const ShieldStorage = {
    getCurrentChatId: () => {
        const match = window.location.pathname.match(/\/(\d+)/);
        return match ? match[1] : null;
    },

    getAllChatKeys: () => {
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_chat_keys'], res => {
                resolve(res.ms_chat_keys || {});
            });
        });
    },

    getChatPassword: async () => {
        const chatId = ShieldStorage.getCurrentChatId();
        if (!chatId) return null;

        const keys = await ShieldStorage.getAllChatKeys();
        const chatData = keys[chatId];

        if (chatData && chatData.enabled && chatData.key) {
            return chatData.key;
        }
        return null;
    },

    getChatData: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return null;

        const keys = await ShieldStorage.getAllChatKeys();
        return keys[chatId] || null;
    },

    setChatPassword: async (password, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        const keys = await ShieldStorage.getAllChatKeys();
        keys[chatId] = {
            key: password,
            enabled: true,
            updatedAt: Date.now()
        };

        return new Promise(resolve => {
            chrome.storage.local.set({ ms_chat_keys: keys }, () => resolve(true));
        });
    },

    toggleChatEncryption: async (enabled, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        const keys = await ShieldStorage.getAllChatKeys();
        if (keys[chatId]) {
            keys[chatId].enabled = enabled;
        }

        return new Promise(resolve => {
            chrome.storage.local.set({ ms_chat_keys: keys }, () => resolve(true));
        });
    },

    removeChatPassword: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        const keys = await ShieldStorage.getAllChatKeys();
        delete keys[chatId];

        return new Promise(resolve => {
            chrome.storage.local.set({ ms_chat_keys: keys }, () => resolve(true));
        });
    },

    isEncryptionEnabled: async () => {
        const chatData = await ShieldStorage.getChatData();
        return chatData ? chatData.enabled : false;
    },

    getSpoofPreset: () => {
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_spoof_preset', 'ms_custom_spoof'], res => {
                const presetId = res.ms_spoof_preset || 'wildberries';
                if (presetId === 'custom' && res.ms_custom_spoof) {
                    resolve({ id: 'custom', ...res.ms_custom_spoof });
                } else {
                    resolve({ id: presetId, ...SpoofPresets[presetId] });
                }
            });
        });
    },

    setSpoofPreset: (presetId) => {
        return new Promise(resolve => {
            chrome.storage.local.set({ ms_spoof_preset: presetId }, () => resolve(true));
        });
    },

    setCustomSpoof: (name, template, param, detect, type = 'url', extract = null) => {
        return new Promise(resolve => {
            chrome.storage.local.set({
                ms_spoof_preset: 'custom',
                ms_custom_spoof: {
                    name: name,
                    template: template,
                    param: param,
                    detect: detect,
                    type: type,
                    extract: extract
                }
            }, () => resolve(true));
        });
    },

    getPassword: () => ShieldStorage.getChatPassword(),
    setPassword: (p) => ShieldStorage.setChatPassword(p),
    removePassword: () => ShieldStorage.removeChatPassword(),

    // ECDH Key Exchange Storage Methods

    // Get ECDH data for a chat
    getECDHData: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return null;

        return new Promise(resolve => {
            chrome.storage.local.get(['ms_ecdh_keys'], res => {
                const ecdhKeys = res.ms_ecdh_keys || {};
                resolve(ecdhKeys[chatId] || null);
            });
        });
    },

    // Save ECDH key pair for a chat
    setECDHKeyPair: async (publicKeyB64, privateKeyJWK, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        return new Promise(resolve => {
            chrome.storage.local.get(['ms_ecdh_keys'], res => {
                const ecdhKeys = res.ms_ecdh_keys || {};
                ecdhKeys[chatId] = ecdhKeys[chatId] || {};
                ecdhKeys[chatId].myPublicKey = publicKeyB64;
                ecdhKeys[chatId].myPrivateKey = privateKeyJWK;
                ecdhKeys[chatId].updatedAt = Date.now();

                chrome.storage.local.set({ ms_ecdh_keys: ecdhKeys }, () => resolve(true));
            });
        });
    },

    // Save peer's public key
    setPeerPublicKey: async (peerPublicKeyB64, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        return new Promise(resolve => {
            chrome.storage.local.get(['ms_ecdh_keys'], res => {
                const ecdhKeys = res.ms_ecdh_keys || {};
                ecdhKeys[chatId] = ecdhKeys[chatId] || {};
                ecdhKeys[chatId].peerPublicKey = peerPublicKeyB64;
                ecdhKeys[chatId].peerReceivedAt = Date.now();

                chrome.storage.local.set({ ms_ecdh_keys: ecdhKeys }, () => resolve(true));
            });
        });
    },

    // Get key exchange mode: 'manual' or 'auto'
    getKeyMode: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return 'manual';

        const keys = await ShieldStorage.getAllChatKeys();
        const chatData = keys[chatId];
        return chatData?.keyMode || 'manual';
    },

    // Set key exchange mode
    setKeyMode: async (mode, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        const keys = await ShieldStorage.getAllChatKeys();
        keys[chatId] = keys[chatId] || {};
        keys[chatId].keyMode = mode;

        return new Promise(resolve => {
            chrome.storage.local.set({ ms_chat_keys: keys }, () => resolve(true));
        });
    },

    // Clear ECDH data for a chat
    clearECDHData: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;

        return new Promise(resolve => {
            chrome.storage.local.get(['ms_ecdh_keys'], res => {
                const ecdhKeys = res.ms_ecdh_keys || {};
                delete ecdhKeys[chatId];
                chrome.storage.local.set({ ms_ecdh_keys: ecdhKeys }, () => resolve(true));
            });
        });
    },

    // Check if ECDH exchange is complete (both keys present)
    isECDHComplete: async (chatId = null) => {
        const ecdhData = await ShieldStorage.getECDHData(chatId);
        return ecdhData && ecdhData.myPrivateKey && ecdhData.peerPublicKey;
    },

    // Get ECDH status: 'none', 'waiting', 'complete'
    getECDHStatus: async (chatId = null) => {
        const ecdhData = await ShieldStorage.getECDHData(chatId);
        if (!ecdhData || !ecdhData.myPublicKey) return 'none';
        if (!ecdhData.peerPublicKey) return 'waiting';
        return 'complete';
    }
};
