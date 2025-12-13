const SendHandler = {
    extractText: (editor) => {
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

        const editor = document.querySelector(ShieldSelectors.EDITOR);
        if (!editor) return;

        const rawText = SendHandler.extractText(editor);
        if (!rawText || rawText.includes('wildberries.ru')) return;

        e.preventDefault();
        e.stopPropagation();

        const password = await ShieldStorage.getChatPassword();
        if (!password) {
            ShieldUI.toast('Set password first!', 'error');
            return;
        }

        const encryptedUrl = await CryptoEngine.encrypt(rawText, password);
        if (!encryptedUrl) {
            ShieldUI.toast('Encryption failed', 'error');
            return;
        }

        SendHandler.insertIntoEditor(editor, encryptedUrl);

        setTimeout(() => {
            const btn = document.querySelector(ShieldSelectors.SEND_BTN);
            if (btn) btn.click();
        }, 100);
    },

    insertIntoEditor: (editor, text) => {
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
    }
};
