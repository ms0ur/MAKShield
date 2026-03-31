const ShieldState = {
    isActive: false,
    observedContainers: new WeakSet(),
    currentService: null,
    serviceConfig: null,
    defaultSelectors: null
};

// Default selectors (MAX) — overridden at startup from selectors.json
const ShieldSelectors = {
    CONTAINER_CLASS: 'scrollListContent',
    BUBBLE_TEXT: '.bubble .text',
    EDITOR: '.contenteditable[data-lexical-editor="true"]',
    SEND_BTN: 'button[aria-label="Отправить сообщение"]',
    EMOJI_BTN: 'button[aria-label="Открыть меню стикеров"]',
    CHAT_ID_REGEX: '\\/(\\d+)',
    EDITOR_TYPE: 'contenteditable'
};

// ---- Load service config from selectors.json ----
async function loadServiceConfig() {
    try {
        const response = await fetch(chrome.runtime.getURL('selectors.json'));
        const config = await response.json();
        const hostname = window.location.hostname;

        for (const [id, service] of Object.entries(config.services)) {
            if (service.hostPatterns.some(p => hostname.includes(p))) {
                ShieldState.currentService = id;
                ShieldState.serviceConfig = service;
                ShieldState.defaultSelectors = { ...service.selectors, CHAT_ID_REGEX: service.chatIdRegex, EDITOR_TYPE: service.editorType || 'contenteditable' };

                // Apply default selectors
                Object.assign(ShieldSelectors, service.selectors);
                ShieldSelectors.CHAT_ID_REGEX = service.chatIdRegex;
                ShieldSelectors.EDITOR_TYPE = service.editorType || 'contenteditable';

                // Apply user overrides on top
                const overrides = await ShieldStorage.getSelectorOverrides(id);
                if (overrides) {
                    Object.assign(ShieldSelectors, overrides);
                }

                console.log(`[Shield] Service: ${service.name} (${id})`);
                return;
            }
        }
        console.warn('[Shield] Unknown host, using fallback selectors');
    } catch (e) {
        console.error('[Shield] Failed to load selectors.json:', e);
    }
}

// ---- DOM Observer ----
function startObserver() {
    const bodyObserver = new MutationObserver(() => {
        const containers = document.getElementsByClassName(ShieldSelectors.CONTAINER_CLASS);

        for (const container of containers) {
            if (!ShieldState.observedContainers.has(container)) {
                // Throttle scan inside observer callback to prevent excess CPU usage
                const scanThrottled = typeof MessageScanner !== 'undefined' ? 
                    MessageScanner.throttle(MessageScanner.scan, 800) : null;

                const chatObserver = new MutationObserver((mutations) => {
                    const hasRelevant = mutations.some(m => {
                        if (m.type === 'childList') {
                            for (const node of m.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE &&
                                    !node.classList?.contains('ms-decrypted-container') &&
                                    !node.classList?.contains('ms-ecdh-container')) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                    if (hasRelevant && scanThrottled) scanThrottled();
                });

                chatObserver.observe(container, { childList: true, subtree: true });
                ShieldState.observedContainers.add(container);
                if (typeof MessageScanner !== 'undefined') MessageScanner.scan();
            }
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });
}

// ---- Event Listeners ----
function setupEventListeners() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey && e.target.matches(ShieldSelectors.EDITOR)) {
            SendHandler.handle(e);
        }
    }, true);

    document.addEventListener('click', e => {
        if (e.target.closest(ShieldSelectors.SEND_BTN)) {
            SendHandler.handle(e);
        }
    }, true);

    document.addEventListener('input', e => {
        if (e.target.matches(ShieldSelectors.EDITOR)) {
            const text = SendHandler.extractText(e.target);
            ShieldUI.updateLengthInfo(text.length);
        }
    }, true);
}

// ---- Bootstrap ----
async function initShield() {
    await loadServiceConfig();
    ShieldUI.init();
    startObserver();
    setupEventListeners();
}

setTimeout(initShield, 1500);
