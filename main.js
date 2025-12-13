const ShieldState = {
    isActive: false,
    observedContainers: new WeakSet()
};

const ShieldSelectors = {
    CONTAINER_CLASS: 'scrollListContent',
    BUBBLE_TEXT: '.bubble .text',
    EDITOR: '.contenteditable[data-lexical-editor="true"]',
    SEND_BTN: 'button[aria-label="Отправить сообщение"]'
};

function startObserver() {
    const bodyObserver = new MutationObserver(() => {
        const containers = document.getElementsByClassName(ShieldSelectors.CONTAINER_CLASS);

        for (const container of containers) {
            if (!ShieldState.observedContainers.has(container)) {
                const chatObserver = new MutationObserver((mutations) => {
                    // Skip if mutations are only from our extension (dataset changes or our containers)
                    const hasRelevantMutation = mutations.some(mutation => {
                        // Check if it's a new message, not our modification
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    // If it's our decrypted container, skip
                                    if (node.classList?.contains('ms-decrypted-container') ||
                                        node.classList?.contains('ms-ecdh-container')) {
                                        continue;
                                    }
                                    return true; // Real new content
                                }
                            }
                        }
                        return false;
                    });

                    if (hasRelevantMutation) {
                        scanMessagesThrottled();
                    }
                });

                chatObserver.observe(container, {
                    childList: true,
                    subtree: true
                });

                ShieldState.observedContainers.add(container);
                scanMessages();
            }
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });
}

function setupEventListeners() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.target.matches(ShieldSelectors.EDITOR)) {
                SendHandler.handle(e);
            }
        }
    }, true);

    document.addEventListener('click', e => {
        if (e.target.closest(ShieldSelectors.SEND_BTN)) {
            SendHandler.handle(e);
        }
    }, true);

    // Track input length for length recommendations
    document.addEventListener('input', e => {
        if (e.target.matches(ShieldSelectors.EDITOR)) {
            const text = SendHandler.extractText(e.target);
            ShieldUI.updateLengthInfo(text.length);
        }
    }, true);
}

setTimeout(() => {
    ShieldUI.init();
    startObserver();
    setupEventListeners();
}, 1500);
