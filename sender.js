const SendHandler = {
    isHandling: false,

    extractText: (editor) => {
        // Textarea (VK Mobile) — use .value directly
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            return (editor.value || '').trim();
        }

        // Contenteditable (MAX, VK Desktop) — walk DOM
        let result = '';

        const walk = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG') {
                    return;
                } else if (node.tagName === 'BR') {
                    result += '\n';
                } else if (node.tagName === 'DIV' || node.tagName === 'P') {
                    if (result && !result.endsWith('\n')) {
                        result += '\n';
                    }
                    for (const child of node.childNodes) {
                        walk(child);
                    }
                    return;
                }

                for (const child of node.childNodes) {
                    walk(child);
                }
            }
        };

        walk(editor);
        return result.trim();
    },

    handle: async (e) => {
        if (!ShieldState.isActive) return;
        if (SendHandler.isHandling) {
            // Already handling - allow the encrypted message to be sent
            return;
        }

        const editor = document.querySelector(ShieldSelectors.EDITOR);
        if (!editor) return;

        const rawText = SendHandler.extractText(editor);
        if (!rawText) return;

        // Synchronous quick check - if text looks encrypted, let it through
        if (SendHandler.isAlreadyEncryptedSync(rawText)) {
            return;
        }

        // Block original send immediately (before async operations)
        e.preventDefault();
        e.stopPropagation();

        SendHandler.isHandling = true;

        try {
            const password = await ShieldStorage.getChatPassword();
            if (!password) {
                ShieldUI.toast('Сначала установите ключ!', 'error');
                SendHandler.isHandling = false;
                return;
            }

            const encryptedUrl = await CryptoEngine.encrypt(rawText, password);
            if (!encryptedUrl) {
                ShieldUI.toast('Ошибка шифрования', 'error');
                SendHandler.isHandling = false;
                return;
            }

            // Enforce VK message limit to prevent the messenger from splitting the message
            // which irreversibly corrupts the encrypted payload
            if (encryptedUrl.length > 4000) {
                ShieldUI.toast(`Слишком длинное сообщение (${encryptedUrl.length} симв, лимит 4000). Разбиение ВКонтакте сломает шифрование. Сократите исходный текст!`, 'error');
                SendHandler.isHandling = false;
                return;
            }

            SendHandler.insertIntoEditor(editor, encryptedUrl);

            // Notify the app that editor content changed
            // (VK Desktop React needs this to update send button state)
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: encryptedUrl }));

            // Wait for VK to react to content change (update send button class)
            setTimeout(() => {
                const btn = document.querySelector(ShieldSelectors.SEND_BTN);
                if (btn) {
                    btn.click();
                } else {
                    // Fallback: try Enter key on editor
                    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                }

                // Re-scan messages after send so our encrypted message gets decrypted
                setTimeout(() => {
                    SendHandler.isHandling = false;
                    if (typeof MessageScanner !== 'undefined' && MessageScanner.scan) {
                        MessageScanner.scan();
                    }
                }, 500);
            }, 250);
        } catch (err) {
            console.error('[Shield] Send error:', err);
            SendHandler.isHandling = false;
        }
    },

    insertIntoEditor: (editor, text) => {
        // Textarea (VK Mobile)
        if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            editor.value = text;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }

        // Contenteditable (MAX, VK Desktop)
        editor.focus();

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editor);
        selection.removeAllRanges();
        selection.addRange(range);

        let success = document.execCommand('insertText', false, text);

        if (!success) {
            const event = new InputEvent('beforeinput', {
                inputType: 'insertText',
                data: text,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(event);

            setTimeout(() => {
                if (editor.innerText !== text) {
                    editor.innerText = text;
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 10);
        }
    },

    // Synchronous check if text is already encrypted (uses cached preset)
    isAlreadyEncryptedSync: (text) => {
        // Check against all presets synchronously
        for (const preset of Object.values(SpoofPresets)) {
            if (!preset || !preset.detect) continue;
            const hasAllDetect = preset.detect.every(d => text.includes(d));
            if (hasAllDetect) return true;
        }
        return false;
    },

    // Check if text is already encrypted by checking against all preset detect patterns
    isAlreadyEncrypted: async (text) => {
        const currentPreset = await ShieldStorage.getSpoofPreset();
        const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

        for (const preset of allPresets) {
            if (!preset || !preset.detect) continue;
            const hasAllDetect = preset.detect.every(d => text.includes(d));
            if (hasAllDetect) return true;
        }
        return false;
    }
};
