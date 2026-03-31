const MessageScanner = {
    isScanning: false, // Flag to prevent recursive scanning

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

            // Check if this is OUR own key we sent
            if (ecdhData && ecdhData.myPublicKey === peerPublicKeyB64) {
                MessageScanner.renderECDHMessage(bubble, 'sent', peerPublicKeyB64);
                return true;
            }

            if (ecdhData && ecdhData.peerPublicKey === peerPublicKeyB64) {
                // Already have this key, just show indicator
                MessageScanner.renderECDHMessage(bubble, 'received', peerPublicKeyB64);
                return true;
            }

            // Save peer's public key
            await ShieldStorage.setPeerPublicKey(peerPublicKeyB64);

            // Generate fingerprint for display
            const fingerprint = await ECDHEngine.generateFingerprint(peerPublicKeyB64);

            // Fetch latest data and keyMode
            const updatedEcdhData = await ShieldStorage.getECDHData();
            const keyMode = await ShieldStorage.getKeyMode(chatId);

            // Only derive if we are in AUTO mode
            if (keyMode === 'auto' && updatedEcdhData && updatedEcdhData.myPrivateKey && updatedEcdhData.peerPublicKey) {
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
            } else if (keyMode === 'auto') {
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
        const originalText = MessageScanner.getTextWithNewlines ? MessageScanner.getTextWithNewlines(bubble) : bubble.innerText;

        MessageScanner.hideOriginalContent(bubble);
        bubble.querySelectorAll('.ms-injected-container').forEach(el => el.remove());

        bubble.dataset.msDecrypted = 'ecdh';
        bubble.dataset.msOriginal = originalText;

        const container = document.createElement('div');
        container.className = 'ms-injected-container ms-ecdh-container';
        container.style.cssText = `
            padding: 8px 12px !important;
            background: linear-gradient(135deg, rgba(0,100,255,0.1), rgba(0,200,100,0.1)) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(0,150,255,0.3) !important;
            display: block !important;
            margin: 4px 0 !important;
            width: fit-content !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
        `;

        const icon = type === 'received' ? '📥' : '📤';
        const label = type === 'received' ? 'Получен ключ' : 'Отправлен ключ';

        container.innerHTML = `
            <div style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 8px !important; margin: 0 !important; padding: 0 !important;">
                <span style="font-size: 16px !important; line-height: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important;">${icon}</span>
                <div style="display: flex !important; flex-direction: column !important; margin: 0 !important; padding: 0 !important; align-items: flex-start !important; justify-content: center !important;">
                    <div style="color: #0af !important; font-size: 11px !important; font-weight: bold !important; line-height: 1.2 !important; margin: 0 !important; padding: 0 !important;">🔐 ECDH ${label}</div>
                    <div style="color: #888 !important; font-size: 10px !important; font-family: monospace !important; line-height: 1.2 !important; margin: 0 !important; padding: 0 !important; margin-top: 2px !important;">
                        Fingerprint: ${fingerprint}
                    </div>
                </div>
            </div>
        `;

        bubble.appendChild(container);
    },

    scan: async () => {
        // Prevent recursive scanning
        if (MessageScanner.isScanning) return;
        MessageScanner.isScanning = true;

        try {
            if (!ShieldState.isActive) {
                // Even if not active, scan for ECDH key exchange messages
                await MessageScanner.scanForECDH();
                return;
            }

            const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);

            for (const bubble of bubbles) {
                if (bubble.dataset.msDecrypted) continue;

                const text = MessageScanner.extractFullText(bubble);

                const isEncrypted = await MessageScanner.isEncryptedMessage(text);
                if (isEncrypted) {
                    // First check if it's an ECDH message
                    const payload = await CryptoEngine.parsePayloadAsync(text);
                    if (payload && payload.t === 'ecdh') {
                        bubble.dataset.msDecrypted = "ecdh";
                        await MessageScanner.handleECDHMessage(payload, bubble);
                        continue;
                    }

                    // Show pending status
                    bubble.dataset.msDecrypted = "pending";
                    MessageScanner.renderPending(bubble, text);

                    const password = await ShieldStorage.getChatPassword();
                    if (!password) {
                        // No password - show failed
                        MessageScanner.renderFailed(bubble, text);
                        continue;
                    }

                    const result = await CryptoEngine.decrypt(text, password);

                    if (result) {
                        MessageScanner.renderDecrypted(bubble, result, text);
                        bubble.dataset.msDecrypted = "true";
                    } else {
                        // Decryption failed
                        MessageScanner.renderFailed(bubble, text);
                    }
                }
            }
        } finally {
            MessageScanner.isScanning = false;
        }
    },

    // Scan only for ECDH messages (when encryption is not active)
    scanForECDH: async () => {
        const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);

        for (const bubble of bubbles) {
            if (bubble.dataset.msDecrypted) continue;

            const text = MessageScanner.extractFullText(bubble);
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

    getTextWithNewlines: (node) => {
        let text = '';
        const walk = (n) => {
            if (n.nodeType === Node.TEXT_NODE) {
                text += n.textContent;
            } else if (n.nodeType === Node.ELEMENT_NODE) {
                if (n.classList?.contains('ms-injected-container') || 
                    n.classList?.contains('im-mess__more') ||
                    n.classList?.contains('PostTextMore') ||
                    n.classList?.contains('pi_more')) {
                    return;
                }
                if (n.tagName === 'BR') {
                    text += '\n';
                } else if (n.tagName === 'DIV' || n.tagName === 'P') {
                    if (text.length > 0 && !text.endsWith('\n')) text += '\n';
                    n.childNodes.forEach(walk);
                    if (text.length > 0 && !text.endsWith('\n')) text += '\n';
                } else {
                    n.childNodes.forEach(walk);
                }
            }
        };
        walk(node);
        return text;
    },

    hideOriginalContent: (bubble) => {
        if (bubble.dataset.msHiddenContent === 'true') return;
        
        Array.from(bubble.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const span = document.createElement('span');
                span.className = 'ms-original-text';
                span.style.display = 'none';
                node.parentNode.insertBefore(span, node);
                span.appendChild(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (!node.classList.contains('ms-injected-container')) {
                    node.dataset.msOriginalDisplay = node.style.display || '';
                    node.style.display = 'none';
                    node.classList.add('ms-original-element');
                }
            }
        });
        bubble.dataset.msHiddenContent = 'true';
    },

    restoreOriginalContent: (bubble) => {
        if (bubble.dataset.msHiddenContent !== 'true') return;

        bubble.querySelectorAll('.ms-original-text').forEach(span => {
            while (span.firstChild) {
                span.parentNode.insertBefore(span.firstChild, span);
            }
            span.remove();
        });

        bubble.querySelectorAll('.ms-original-element').forEach(el => {
            el.style.display = el.dataset.msOriginalDisplay || '';
            delete el.dataset.msOriginalDisplay;
            el.classList.remove('ms-original-element');
        });

        delete bubble.dataset.msHiddenContent;
    },

    resetAllMessages: () => {
        const bubbles = document.querySelectorAll(ShieldSelectors.BUBBLE_TEXT);
        bubbles.forEach(bubble => {
            if (bubble.dataset.msDecrypted) {
                bubble.querySelectorAll('.ms-injected-container').forEach(el => el.remove());
                MessageScanner.restoreOriginalContent(bubble);
                
                delete bubble.dataset.msDecrypted;
                delete bubble.dataset.msOriginal;
                delete bubble.dataset.msDecryptedText;
                delete bubble.dataset.msShowDecrypted;
                delete bubble.dataset.msShowError;
            }
        });
    },

    // Extract text safely, handling VK/MAX truncation via URL wrappers
    extractFullText: (bubble) => {
        const link = bubble.querySelector('a');
        if (link && !link.classList.contains('im-mess__more') && !link.classList.contains('PostTextMore') && !link.classList.contains('pi_more')) {
            try {
                const urlStr = link.getAttribute('href'); 
                if (urlStr && urlStr.includes('away.php')) {
                    const url = new URL(link.href, window.location.origin);
                    if (url.searchParams.has('to')) {
                        return decodeURIComponent(url.searchParams.get('to'));
                    }
                } else if (urlStr && urlStr.startsWith('http')) {
                    return urlStr;
                }
            } catch (e) {
            }
        }
        return MessageScanner.getTextWithNewlines(bubble).trim();
    },

    renderDecrypted: (bubble, result, originalText) => {
        MessageScanner.hideOriginalContent(bubble);
        bubble.querySelectorAll('.ms-injected-container').forEach(el => el.remove());

        bubble.dataset.msOriginal = originalText;
        bubble.dataset.msDecryptedText = result.content;
        bubble.dataset.msShowDecrypted = 'true';

        const container = document.createElement('div');
        container.className = 'ms-injected-container ms-decrypted-container';
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

    // Render pending decryption status
    renderPending: (bubble, originalText) => {
        MessageScanner.hideOriginalContent(bubble);
        bubble.querySelectorAll('.ms-injected-container').forEach(el => el.remove());
        
        bubble.dataset.msOriginal = originalText;

        const container = document.createElement('div');
        container.className = 'ms-injected-container ms-pending-container';
        container.style.cssText = `
            position: relative;
            padding: 6px 10px;
            background: rgba(255, 200, 0, 0.08);
            border-radius: 6px;
            border-left: 3px solid #fc0;
        `;

        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <span class="ms-spinner" style="font-size: 12px; animation: ms-spin 1s linear infinite;">⏳</span>
                <span style="color: #fc0; font-size: 11px;">Расшифровка...</span>
            </div>
        `;

        bubble.appendChild(container);
    },

    // Render failed decryption status
    renderFailed: (bubble, originalText) => {
        MessageScanner.hideOriginalContent(bubble);
        bubble.querySelectorAll('.ms-injected-container').forEach(el => el.remove());
        
        bubble.dataset.msOriginal = originalText;
        bubble.dataset.msDecrypted = 'failed';

        const container = document.createElement('div');
        container.className = 'ms-injected-container ms-failed-container';
        container.style.cssText = `
            position: relative;
            padding: 6px 10px;
            background: rgba(255, 80, 80, 0.08);
            border-radius: 6px;
            border-left: 3px solid #f55;
            cursor: pointer;
        `;

        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 12px;">🔐</span>
                <span style="color: #f88; font-size: 11px; flex: 1;">Зашифровано (неверный ключ?)</span>
                <span style="font-size: 9px; color: #666; text-decoration: underline;">показать</span>
            </div>
        `;

        container.title = 'Не удалось расшифровать.\nВозможные причины:\n• Неверный ключ шифрования\n• Сообщение от другого пресета\n• Повреждённые данные\n\nНажмите чтобы показать оригинал';

        container.onclick = (e) => {
            e.stopPropagation();
            MessageScanner.toggleFailedView(bubble);
        };

        bubble.appendChild(container);
    },

    // Toggle between failed message and original encrypted text
    toggleFailedView: (bubble) => {
        const isShowingError = bubble.dataset.msShowError !== 'false';
        const originalText = bubble.dataset.msOriginal;
        const container = bubble.querySelector('.ms-failed-container');
        if (!container) return;

        if (isShowingError) {
            container.innerHTML = `
                <div style="position: relative;">
                    <div style="font-size: 0.8em; opacity: 0.6; word-break: break-all; color: #888; max-height: 150px; overflow-y: auto; padding-right: 20px;">
                        ${originalText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                    </div>
                    <span class="ms-failed-close" style="position: absolute; top: 0; right: 0; font-size: 10px; color: #666; cursor: pointer; padding: 2px 4px; border-radius: 3px;" title="Скрыть оригинал">✕</span>
                </div>
            `;
            
            const closeBtn = container.querySelector('.ms-failed-close');
            closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.onmouseleave = () => closeBtn.style.background = 'transparent';
            
            // Backup the old onclick
            if (!container.dataset.originalOnclick) {
                container.dataset.originalOnclick = "true";
                container._originalOnclick = container.onclick;
            }
            container.onclick = null;
            
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                MessageScanner.toggleFailedView(bubble);
            };
            bubble.dataset.msShowError = 'false';
        } else {
            // Restore original state
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 12px;">🔐</span>
                    <span style="color: #f88; font-size: 11px; flex: 1;">Зашифровано (неверный ключ?)</span>
                    <span style="font-size: 9px; color: #666; text-decoration: underline;">показать</span>
                </div>
            `;
            
            if (container.dataset.originalOnclick) {
                container.onclick = container._originalOnclick;
            }
            
            bubble.dataset.msShowError = 'true';
        }
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
