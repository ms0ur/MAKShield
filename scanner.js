const MessageScanner = {
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isEncryptedMessage: async (text) => {
        const currentPreset = await ShieldStorage.getSpoofPreset();
        const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

        for (const preset of allPresets) {
            const hasAllDetect = preset.detect.every(d => text.includes(d));
            if (hasAllDetect) return true;
        }
        return false;
    },

    scan: async () => {
        if (!ShieldState.isActive) return;

        const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);

        for (const bubble of bubbles) {
            if (bubble.dataset.msDecrypted) continue;

            const text = bubble.innerText;

            const isEncrypted = await MessageScanner.isEncryptedMessage(text);
            if (isEncrypted) {
                bubble.dataset.msDecrypted = "pending";

                const password = await ShieldStorage.getChatPassword();
                if (!password) return;

                const result = await CryptoEngine.decrypt(text, password);

                if (result) {
                    MessageScanner.renderDecrypted(bubble, result, text);
                    bubble.dataset.msDecrypted = "true";
                } else {
                    bubble.removeAttribute('data-ms-decrypted');
                }
            }
        }
    },

    renderDecrypted: (bubble, result, originalText) => {
        bubble.innerHTML = '';

        bubble.dataset.msOriginal = originalText;
        bubble.dataset.msDecryptedText = result.content;
        bubble.dataset.msShowDecrypted = 'true';

        const container = document.createElement('div');
        container.className = 'ms-decrypted-container';
        container.style.cssText = `position: relative; padding: 2px 0;`;

        const lockIcon = document.createElement('span');
        lockIcon.className = 'ms-lock-icon';
        lockIcon.textContent = '🔒';
        lockIcon.title = '✅ Расшифровано MAKShield\n🔐 Сообщение было зашифровано\n👆 Нажмите чтобы скрыть';
        lockIcon.style.cssText = `
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 12px;
            opacity: 0.7;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
            padding: 2px;
            border-radius: 4px;
        `;

        lockIcon.onmouseenter = () => {
            lockIcon.style.opacity = '1';
            lockIcon.style.transform = 'scale(1.2)';
            lockIcon.style.background = 'rgba(0,0,0,0.3)';
        };
        lockIcon.onmouseleave = () => {
            lockIcon.style.opacity = '0.7';
            lockIcon.style.transform = 'scale(1)';
            lockIcon.style.background = 'transparent';
        };

        lockIcon.onclick = (e) => {
            e.stopPropagation();
            MessageScanner.toggleDecryption(bubble);
        };

        const decryptedSpan = document.createElement('div');
        decryptedSpan.className = 'ms-message-text';
        decryptedSpan.style.cssText = `
            font-size: inherit;
            color: inherit;
            word-break: break-word;
            white-space: pre-wrap;
            line-height: 1.4;
            padding-right: 16px;
        `;
        decryptedSpan.textContent = result.content;

        container.appendChild(lockIcon);
        container.appendChild(decryptedSpan);
        bubble.appendChild(container);
    },

    toggleDecryption: (bubble) => {
        const isDecrypted = bubble.dataset.msShowDecrypted === 'true';
        const textEl = bubble.querySelector('.ms-message-text');
        const lockEl = bubble.querySelector('.ms-lock-icon');

        if (!textEl || !lockEl) return;

        if (isDecrypted) {
            textEl.textContent = bubble.dataset.msOriginal;
            textEl.style.cssText += `font-size: 0.85em; opacity: 0.7; word-break: break-all; color: #888;`;
            lockEl.textContent = '🔓';
            lockEl.title = '🔐 Зашифрованное сообщение\n👆 Нажмите чтобы расшифровать';
            bubble.dataset.msShowDecrypted = 'false';
        } else {
            textEl.textContent = bubble.dataset.msDecryptedText;
            textEl.style.cssText = `
                font-size: inherit;
                color: inherit;
                word-break: break-word;
                white-space: pre-wrap;
                line-height: 1.4;
                padding-right: 16px;
                opacity: 1;
            `;
            lockEl.textContent = '🔒';
            lockEl.title = '✅ Расшифровано MAKShield\n🔐 Сообщение было зашифровано\n👆 Нажмите чтобы скрыть';
            bubble.dataset.msShowDecrypted = 'true';
        }
    }
};

const scanMessagesThrottled = MessageScanner.throttle(MessageScanner.scan, 800);

function scanMessages() {
    MessageScanner.scan();
}
