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

    // Handle ECDH key exchange message
    handleECDHMessage: async (payload, bubble) => {
        try {
            const chatId = ShieldStorage.getCurrentChatId();
            if (!chatId) return false;

            const peerPublicKeyB64 = payload.pk;
            if (!peerPublicKeyB64) return false;

            // Check if we already have this peer's key
            const ecdhData = await ShieldStorage.getECDHData();
            if (ecdhData && ecdhData.peerPublicKey === peerPublicKeyB64) {
                // Already have this key, just show indicator
                MessageScanner.renderECDHMessage(bubble, 'received', peerPublicKeyB64);
                return true;
            }

            // Save peer's public key
            await ShieldStorage.setPeerPublicKey(peerPublicKeyB64);

            // Generate fingerprint for display
            const fingerprint = await ECDHEngine.generateFingerprint(peerPublicKeyB64);

            // Check if we can derive shared secret now
            const updatedEcdhData = await ShieldStorage.getECDHData();
            if (updatedEcdhData && updatedEcdhData.myPrivateKey && updatedEcdhData.peerPublicKey) {
                // We have both keys, derive shared secret
                const privateKey = await ECDHEngine.importPrivateKey(updatedEcdhData.myPrivateKey);
                const peerPublicKey = await ECDHEngine.importPublicKey(updatedEcdhData.peerPublicKey);

                if (privateKey && peerPublicKey) {
                    const sharedSecret = await ECDHEngine.deriveSharedSecret(privateKey, peerPublicKey);

                    if (sharedSecret) {
                        // Set shared secret as chat password
                        await ShieldStorage.setChatPassword(sharedSecret);
                        await ShieldStorage.setKeyMode('auto');

                        ShieldState.isActive = true;
                        if (typeof ShieldUI !== 'undefined') {
                            ShieldUI.updateIndicator(true);
                            ShieldUI.updateEmojiButton(true);
                            ShieldUI.updateToggleButton(true);
                            ShieldUI.updateKeyModeDisplay();
                            ShieldUI.toast(`🔐 Ключи согласованы! [${fingerprint}]`);
                        }

                        // Re-scan messages with new key
                        setTimeout(() => {
                            if (typeof scanMessages === 'function') {
                                scanMessages();
                            }
                        }, 500);
                    }
                }
            } else {
                // We received peer's key but haven't sent ours yet
                if (typeof ShieldUI !== 'undefined') {
                    ShieldUI.toast(`🔑 Получен ключ [${fingerprint}]. Отправьте свой!`);
                    ShieldUI.updateKeyModeDisplay();
                }
            }

            MessageScanner.renderECDHMessage(bubble, 'received', peerPublicKeyB64);
            return true;
        } catch (e) {
            console.error("[Shield] handleECDHMessage Error:", e);
            return false;
        }
    },

    // Render ECDH key exchange message
    renderECDHMessage: async (bubble, type, publicKeyB64) => {
        const fingerprint = await ECDHEngine.generateFingerprint(publicKeyB64);
        const originalText = bubble.innerText;

        bubble.innerHTML = '';
        bubble.dataset.msDecrypted = 'ecdh';
        bubble.dataset.msOriginal = originalText;

        const container = document.createElement('div');
        container.className = 'ms-ecdh-container';
        container.style.cssText = `
            padding: 8px 12px;
            background: linear-gradient(135deg, rgba(0,100,255,0.1), rgba(0,200,100,0.1));
            border-radius: 8px;
            border: 1px solid rgba(0,150,255,0.3);
        `;

        const icon = type === 'received' ? '📥' : '📤';
        const label = type === 'received' ? 'Получен ключ' : 'Отправлен ключ';

        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <div>
                    <div style="color: #0af; font-size: 11px; font-weight: bold;">🔐 ECDH ${label}</div>
                    <div style="color: #888; font-size: 10px; font-family: monospace;">
                        Fingerprint: ${fingerprint}
                    </div>
                </div>
            </div>
        `;

        bubble.appendChild(container);
    },

    scan: async () => {
        if (!ShieldState.isActive) {
            // Even if not active, scan for ECDH key exchange messages
            await MessageScanner.scanForECDH();
            return;
        }

        const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);

        for (const bubble of bubbles) {
            if (bubble.dataset.msDecrypted) continue;

            const text = bubble.innerText;

            const isEncrypted = await MessageScanner.isEncryptedMessage(text);
            if (isEncrypted) {
                // First check if it's an ECDH message
                const payload = await CryptoEngine.parsePayloadAsync(text);
                if (payload && payload.t === 'ecdh') {
                    bubble.dataset.msDecrypted = "ecdh";
                    await MessageScanner.handleECDHMessage(payload, bubble);
                    continue;
                }

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

    // Scan only for ECDH messages (when encryption is not active)
    scanForECDH: async () => {
        const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);

        for (const bubble of bubbles) {
            if (bubble.dataset.msDecrypted) continue;

            const text = bubble.innerText;
            const isEncrypted = await MessageScanner.isEncryptedMessage(text);

            if (isEncrypted) {
                const payload = await CryptoEngine.parsePayloadAsync(text);
                if (payload && payload.t === 'ecdh') {
                    bubble.dataset.msDecrypted = "ecdh";
                    await MessageScanner.handleECDHMessage(payload, bubble);
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
