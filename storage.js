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
    removePassword: () => ShieldStorage.removeChatPassword()
};
