const ShieldStorage = {
    // ---- Chat ID (service-aware) ----
    getCurrentChatId: () => {
        const regex = new RegExp(ShieldSelectors.CHAT_ID_REGEX);
        const url = window.location.pathname + window.location.search + window.location.hash;
        const match = url.match(regex);
        if (match) {
            for (let i = 1; i < match.length; i++) {
                if (match[i]) return match[i];
            }
        }
        return null;
    },

    // ---- Chat Keys ----
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
        return (chatData && chatData.enabled && chatData.key) ? chatData.key : null;
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
        keys[chatId] = { ...(keys[chatId] || {}), key: password, enabled: true, updatedAt: Date.now() };
        return new Promise(resolve => {
            chrome.storage.local.set({ ms_chat_keys: keys }, () => resolve(true));
        });
    },

    toggleChatEncryption: async (enabled, chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return false;
        const keys = await ShieldStorage.getAllChatKeys();
        if (keys[chatId]) keys[chatId].enabled = enabled;
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

    // ---- Spoof Presets ----
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
                ms_custom_spoof: { name, template, param, detect, type, extract }
            }, () => resolve(true));
        });
    },

    // Aliases
    getPassword: () => ShieldStorage.getChatPassword(),
    setPassword: (p) => ShieldStorage.setChatPassword(p),
    removePassword: () => ShieldStorage.removeChatPassword(),

    // ---- ECDH Key Exchange ----
    getECDHData: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return null;
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_ecdh_keys'], res => {
                resolve((res.ms_ecdh_keys || {})[chatId] || null);
            });
        });
    },

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

    getKeyMode: async (chatId = null) => {
        chatId = chatId || ShieldStorage.getCurrentChatId();
        if (!chatId) return 'manual';
        const keys = await ShieldStorage.getAllChatKeys();
        return keys[chatId]?.keyMode || 'manual';
    },

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

    isECDHComplete: async (chatId = null) => {
        const ecdhData = await ShieldStorage.getECDHData(chatId);
        return ecdhData && ecdhData.myPrivateKey && ecdhData.peerPublicKey;
    },

    getECDHStatus: async (chatId = null) => {
        const ecdhData = await ShieldStorage.getECDHData(chatId);
        if (!ecdhData || !ecdhData.myPublicKey) return 'none';
        if (!ecdhData.peerPublicKey) return 'waiting';
        return 'complete';
    },

    // ---- Selector Overrides ----
    getSelectorOverrides: async (serviceId) => {
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_selector_overrides'], res => {
                resolve((res.ms_selector_overrides || {})[serviceId] || null);
            });
        });
    },

    setSelectorOverrides: async (serviceId, selectors) => {
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_selector_overrides'], res => {
                const overrides = res.ms_selector_overrides || {};
                overrides[serviceId] = selectors;
                chrome.storage.local.set({ ms_selector_overrides: overrides }, () => resolve(true));
            });
        });
    },

    clearSelectorOverrides: async (serviceId) => {
        return new Promise(resolve => {
            chrome.storage.local.get(['ms_selector_overrides'], res => {
                const overrides = res.ms_selector_overrides || {};
                delete overrides[serviceId];
                chrome.storage.local.set({ ms_selector_overrides: overrides }, () => resolve(true));
            });
        });
    }
};
