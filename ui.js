const ShieldUI = {
    panel: null,
    isMinimized: false,

    init: () => {
        if (document.getElementById('ms-overlay')) return;

        const iconUrl = chrome.runtime.getURL('maksbanner.png');

        const panel = document.createElement('div');
        panel.id = 'ms-overlay';
        panel.innerHTML = ShieldUI.getTemplate(iconUrl);

        ShieldUI.applyStyles(panel);
        document.body.appendChild(panel);
        ShieldUI.panel = panel;

        ShieldUI.bindEvents();
        ShieldUI.checkInitialState();
        ShieldUI.updateSpoofDisplay();
    },

    getTemplate: (iconUrl) => `
        <img id="ms-logo" src="${iconUrl}" alt="Shield" title="MAKShield">
        <div id="ms-controls">
            <div id="ms-chat-info" style="font-size: 10px; color: #666; text-align: center; margin-bottom: 4px;">
                Chat: <span id="ms-chat-id">---</span>
            </div>
            <div id="ms-buttons-row" style="display: flex; gap: 6px; margin-bottom: 6px;">
                <button id="ms-setup-btn" title="Установить ключ для этого чата">
                    <span id="ms-ind"></span>
                    KEY
                </button>
                <button id="ms-toggle-btn" title="Включить/выключить шифрование">
                    <span id="ms-toggle-icon">⏸️</span>
                </button>
                <button id="ms-spoof-btn" title="Выбрать маскировку">
                    🎭
                </button>
            </div>
            <div id="ms-key-mode-info" style="font-size: 9px; color: #888; text-align: center; margin-bottom: 2px;">
                <span id="ms-key-mode-status">🔑 Нет ключа</span>
            </div>
            <div id="ms-spoof-info" style="font-size: 9px; color: #888; text-align: center;">
                <span id="ms-spoof-name">Wildberries</span>
            </div>
        </div>
        <div id="ms-key-menu" style="display: none;">
            <div class="ms-spoof-title">🔐 Режим ключей</div>
            <div class="ms-key-mode-tabs">
                <button class="ms-key-tab active" data-mode="manual">🔑 Ручной</button>
                <button class="ms-key-tab" data-mode="auto">🔄 Авто (ECDH)</button>
            </div>
            <div id="ms-key-mode-manual" class="ms-key-panel">
                <div class="ms-modal-field">
                    <label class="ms-modal-label">Пароль для чата</label>
                    <input type="text" class="ms-modal-input" id="ms-manual-password" placeholder="Введите пароль...">
                </div>
                <div class="ms-modal-buttons">
                    <button class="ms-modal-btn" id="ms-manual-remove">🗑️ Удалить</button>
                    <button class="ms-modal-btn primary" id="ms-manual-save">💾 Сохранить</button>
                </div>
            </div>
            <div id="ms-key-mode-auto" class="ms-key-panel" style="display: none;">
                <div id="ms-ecdh-status" style="text-align: center; padding: 8px; margin-bottom: 10px; border-radius: 8px; background: rgba(0,0,0,0.2);">
                    <div id="ms-ecdh-status-icon" style="font-size: 24px;">🔓</div>
                    <div id="ms-ecdh-status-text" style="font-size: 11px; color: #888;">Ключи не согласованы</div>
                    <div id="ms-ecdh-fingerprint" style="font-size: 10px; color: #666; font-family: monospace;"></div>
                </div>
                <button class="ms-modal-btn primary" id="ms-ecdh-send" style="width: 100%;">📤 Отправить публичный ключ</button>
                <div style="font-size: 9px; color: #666; text-align: center; margin-top: 8px;">
                    Оба участника должны отправить свои ключи
                </div>
                <button class="ms-modal-btn" id="ms-ecdh-reset" style="width: 100%; margin-top: 8px;">🔄 Сбросить ключи</button>
            </div>
        </div>
        <div id="ms-spoof-menu" style="display: none;">
            <div class="ms-spoof-title">🎭 Маскировка</div>
            <div id="ms-length-info" class="ms-length-info">
                <span id="ms-length-icon">📄</span>
                <span id="ms-length-text">Любая длина</span>
            </div>
            <div class="ms-filter-row">
                <button class="ms-filter-btn active" data-filter="all">Все</button>
                <button class="ms-filter-btn" data-filter="url">🔗</button>
                <button class="ms-filter-btn" data-filter="crash">☠️</button>
                <button class="ms-filter-btn" data-filter="log">📋</button>
                <button class="ms-filter-btn" data-filter="multi">×3+</button>
            </div>
            <div class="ms-spoof-category">🔗 URL-ссылки</div>
            <div id="ms-spoof-urls"></div>
            <div class="ms-spoof-category">☠️ Crash Logs</div>
            <div id="ms-spoof-crashes"></div>
            <div class="ms-spoof-category">📋 System Logs</div>
            <div id="ms-spoof-logs"></div>
            <div class="ms-spoof-category">📄 Другое</div>
            <div id="ms-spoof-other"></div>
            <button id="ms-spoof-custom" class="ms-spoof-custom-btn">✏️ Свой шаблон</button>
        </div>
    `,

    applyStyles: (panel) => {
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            background: rgba(10, 12, 10, 0.92);
            backdrop-filter: blur(12px);
            padding: 16px;
            border-radius: 20px;
            border: 1px solid rgba(0, 255, 0, 0.15);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', system-ui, sans-serif;
        `;

        const style = document.createElement('style');
        style.textContent = `
            #ms-overlay #ms-logo {
                width: 140px;
                height: 70px;
                cursor: pointer;
                opacity: 0.95;
                transition: transform 0.2s, opacity 0.2s;
                border-radius: 12px;
                filter: drop-shadow(0 2px 8px rgba(0,255,0,0.2));
                object-fit: contain;
            }
            #ms-overlay #ms-logo:hover {
                transform: scale(1.05);
                opacity: 1;
                filter: drop-shadow(0 4px 12px rgba(0,255,0,0.3));
            }
            #ms-overlay #ms-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            #ms-overlay button {
                background: rgba(255,255,255,0.05);
                border: 1px solid #444;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                border-radius: 20px;
                transition: all 0.2s;
            }
            #ms-overlay button:hover {
                background: rgba(255,255,255,0.1);
                border-color: #666;
                color: #fff;
            }
            #ms-overlay #ms-ind {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #555;
                display: inline-block;
                transition: all 0.3s;
            }
            #ms-overlay.minimized {
                padding: 12px;
                border-radius: 24px;
            }
            #ms-overlay.minimized #ms-controls {
                display: none;
            }
            #ms-overlay.minimized #ms-spoof-menu {
                display: none !important;
            }
            #ms-overlay.minimized #ms-logo {
                width: 48px;
                height: 48px;
            }
            #ms-spoof-menu {
                background: rgba(20, 25, 20, 0.95);
                border: 1px solid #333;
                border-radius: 12px;
                padding: 12px;
                min-width: 240px;
                max-width: 320px;
                max-height: 500px;
                overflow-y: auto;
            }
            #ms-spoof-menu::-webkit-scrollbar {
                width: 6px;
            }
            #ms-spoof-menu::-webkit-scrollbar-thumb {
                background: #333;
                border-radius: 3px;
            }
            .ms-spoof-title {
                color: #0f0;
                font-size: 12px;
                text-align: center;
                margin-bottom: 10px;
                font-weight: bold;
            }
            .ms-spoof-category {
                color: #888;
                font-size: 10px;
                margin: 8px 0 4px 0;
                padding-bottom: 2px;
                border-bottom: 1px solid #333;
            }
            #ms-spoof-urls, #ms-spoof-crashes, #ms-spoof-logs {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            .ms-spoof-item {
                background: rgba(255,255,255,0.03);
                border: 1px solid #333;
                color: #aaa;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
                text-align: left;
            }
            .ms-spoof-item:hover {
                background: rgba(255,255,255,0.08);
                border-color: #555;
                color: #fff;
            }
            .ms-spoof-item.active {
                background: rgba(0,255,0,0.1);
                border-color: #0a0;
                color: #0f0;
            }
            .ms-spoof-custom-btn {
                width: 100%;
                margin-top: 10px;
                justify-content: center;
                background: rgba(255,200,0,0.1) !important;
                border-color: #553 !important;
                color: #fd0 !important;
            }
            .ms-spoof-custom-btn:hover {
                background: rgba(255,200,0,0.2) !important;
                border-color: #885 !important;
            }
            .ms-length-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 6px 10px;
                margin-bottom: 8px;
                background: rgba(0,255,0,0.1);
                border: 1px solid rgba(0,255,0,0.2);
                border-radius: 8px;
                font-size: 10px;
                color: #0f0;
            }
            .ms-filter-row {
                display: flex;
                gap: 4px;
                margin-bottom: 8px;
                flex-wrap: wrap;
            }
            .ms-filter-btn {
                padding: 4px 8px !important;
                font-size: 10px !important;
                border-radius: 6px !important;
                background: rgba(255,255,255,0.05) !important;
                border: 1px solid #333 !important;
                color: #888 !important;
                cursor: pointer;
                flex: 1;
                min-width: 30px;
            }
            .ms-filter-btn:hover {
                background: rgba(255,255,255,0.1) !important;
                color: #fff !important;
            }
            .ms-filter-btn.active {
                background: rgba(0,255,0,0.15) !important;
                border-color: #0a0 !important;
                color: #0f0 !important;
            }
            .ms-length-badge {
                font-size: 9px;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 4px;
            }
            .ms-length-badge.short {
                background: rgba(0,200,255,0.15);
                color: #0cf;
            }
            .ms-length-badge.medium {
                background: rgba(255,200,0,0.15);
                color: #fc0;
            }
            .ms-length-badge.long {
                background: rgba(255,100,100,0.15);
                color: #f88;
            }
            .ms-multipart-badge {
                font-size: 8px;
                padding: 1px 4px;
                border-radius: 3px;
                background: rgba(150,100,255,0.2);
                color: #a8f;
                margin-left: 4px;
            }
            /* Decryption status animations */
            @keyframes ms-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .ms-pending-container .ms-spinner {
                display: inline-block;
                animation: ms-spin 1s linear infinite;
            }
            .ms-failed-container:hover {
                background: rgba(255, 80, 80, 0.15) !important;
            }
            /* Key Menu Styles */
            #ms-key-menu {
                background: rgba(20, 25, 20, 0.95);
                border: 1px solid #333;
                border-radius: 12px;
                padding: 12px;
                min-width: 260px;
            }
            .ms-key-mode-tabs {
                display: flex;
                gap: 4px;
                margin-bottom: 12px;
            }
            .ms-key-tab {
                flex: 1;
                padding: 8px 12px !important;
                font-size: 11px !important;
                border-radius: 8px !important;
                background: rgba(255,255,255,0.05) !important;
                border: 1px solid #333 !important;
                color: #888 !important;
                cursor: pointer;
                transition: all 0.2s;
            }
            .ms-key-tab:hover {
                background: rgba(255,255,255,0.1) !important;
                color: #fff !important;
            }
            .ms-key-tab.active {
                background: rgba(0,255,0,0.15) !important;
                border-color: #0a0 !important;
                color: #0f0 !important;
            }
            .ms-key-panel {
                animation: msFadeIn 0.2s ease;
            }
            @keyframes msFadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ms-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 40, 0, 0.95);
                color: #0f0;
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid #0f0;
                font-family: monospace;
                font-size: 13px;
                z-index: 1000000;
                animation: msToastIn 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,255,0,0.2);
            }
            .ms-toast.error {
                background: rgba(40, 0, 0, 0.95);
                color: #f55;
                border-color: #f55;
                box-shadow: 0 4px 15px rgba(255,0,0,0.2);
            }
            @keyframes msToastIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ms-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 1000001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ms-modal {
                background: rgba(15, 20, 15, 0.98);
                border: 1px solid #0a0;
                border-radius: 16px;
                padding: 20px;
                min-width: 400px;
                max-width: 550px;
            }
            .ms-modal-title {
                color: #0f0;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 16px;
                text-align: center;
            }
            .ms-modal-field {
                margin-bottom: 12px;
            }
            .ms-modal-label {
                color: #888;
                font-size: 11px;
                margin-bottom: 4px;
                display: block;
            }
            .ms-modal-input {
                width: 100%;
                background: rgba(0,0,0,0.3);
                border: 1px solid #333;
                border-radius: 8px;
                padding: 8px 12px;
                color: #fff;
                font-family: monospace;
                font-size: 12px;
                box-sizing: border-box;
            }
            .ms-modal-textarea {
                width: 100%;
                background: rgba(0,0,0,0.3);
                border: 1px solid #333;
                border-radius: 8px;
                padding: 8px 12px;
                color: #fff;
                font-family: monospace;
                font-size: 11px;
                box-sizing: border-box;
                resize: vertical;
                min-height: 80px;
            }
            .ms-modal-input:focus, .ms-modal-textarea:focus {
                outline: none;
                border-color: #0a0;
            }
            .ms-modal-hint {
                color: #666;
                font-size: 10px;
                margin-top: 4px;
            }
            .ms-modal-buttons {
                display: flex;
                gap: 8px;
                margin-top: 16px;
            }
            .ms-modal-btn {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #444;
                background: rgba(255,255,255,0.05);
                color: #aaa;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .ms-modal-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }
            .ms-modal-btn.primary {
                background: rgba(0,255,0,0.1);
                border-color: #0a0;
                color: #0f0;
            }
            .ms-modal-btn.primary:hover {
                background: rgba(0,255,0,0.2);
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents: () => {
        const logo = document.getElementById('ms-logo');
        const btn = document.getElementById('ms-setup-btn');
        const toggleBtn = document.getElementById('ms-toggle-btn');
        const spoofBtn = document.getElementById('ms-spoof-btn');

        logo.onclick = () => {
            ShieldUI.panel.classList.toggle('minimized');
            ShieldUI.isMinimized = !ShieldUI.isMinimized;
            if (ShieldUI.isMinimized) {
                document.getElementById('ms-spoof-menu').style.display = 'none';
                document.getElementById('ms-key-menu').style.display = 'none';
            }
        };

        btn.onclick = async () => {
            const chatId = ShieldStorage.getCurrentChatId();
            if (!chatId) {
                ShieldUI.toast('Откройте чат!', 'error');
                return;
            }

            // Toggle key menu
            ShieldUI.toggleKeyMenu();
        };

        // Key menu tab switching
        document.querySelectorAll('.ms-key-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.ms-key-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const mode = tab.dataset.mode;
                document.getElementById('ms-key-mode-manual').style.display = mode === 'manual' ? 'block' : 'none';
                document.getElementById('ms-key-mode-auto').style.display = mode === 'auto' ? 'block' : 'none';

                if (mode === 'auto') {
                    ShieldUI.updateECDHStatus();
                }
            };
        });

        // Manual mode - save password
        document.getElementById('ms-manual-save').onclick = async () => {
            const pass = document.getElementById('ms-manual-password').value.trim();
            if (!pass) {
                ShieldUI.toast('Введите пароль!', 'error');
                return;
            }

            await ShieldStorage.setChatPassword(pass);
            await ShieldStorage.setKeyMode('manual');
            ShieldState.isActive = true;
            ShieldUI.updateIndicator(true);
            ShieldUI.updateEmojiButton(true);
            ShieldUI.updateToggleButton(true);
            ShieldUI.updateKeyModeDisplay();
            document.getElementById('ms-key-menu').style.display = 'none';
            ShieldUI.toast('🔑 Ручной ключ установлен!');

            if (typeof scanMessages === 'function') {
                scanMessages();
            }
        };

        // Manual mode - remove password
        document.getElementById('ms-manual-remove').onclick = async () => {
            await ShieldStorage.removeChatPassword();
            await ShieldStorage.clearECDHData();
            ShieldState.isActive = false;
            ShieldUI.updateIndicator(false);
            ShieldUI.updateEmojiButton(false);
            ShieldUI.updateKeyModeDisplay();
            document.getElementById('ms-manual-password').value = '';
            document.getElementById('ms-key-menu').style.display = 'none';
            ShieldUI.toast('Ключ удалён', 'error');
        };

        // Auto mode - send ECDH public key
        document.getElementById('ms-ecdh-send').onclick = async () => {
            await ShieldUI.sendECDHKey();
        };

        // Auto mode - reset ECDH keys
        document.getElementById('ms-ecdh-reset').onclick = async () => {
            await ShieldStorage.clearECDHData();
            await ShieldStorage.removeChatPassword();
            ShieldState.isActive = false;
            ShieldUI.updateIndicator(false);
            ShieldUI.updateEmojiButton(false);
            ShieldUI.updateKeyModeDisplay();
            ShieldUI.updateECDHStatus();
            ShieldUI.toast('ECDH ключи сброшены', 'error');
        };

        // Filter buttons handler (delegated event)
        document.getElementById('ms-spoof-menu')?.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.ms-filter-btn');
            if (!filterBtn) return;

            document.querySelectorAll('.ms-filter-btn').forEach(b => b.classList.remove('active'));
            filterBtn.classList.add('active');

            const filter = filterBtn.dataset.filter;
            ShieldUI.currentFilter = filter;
            ShieldUI.applyPresetFilter(filter);
        });

        toggleBtn.onclick = async () => {
            const chatData = await ShieldStorage.getChatData();
            if (!chatData || !chatData.key) {
                ShieldUI.toast('Сначала установите ключ!', 'error');
                return;
            }

            const newState = !chatData.enabled;
            await ShieldStorage.toggleChatEncryption(newState);
            ShieldState.isActive = newState;
            ShieldUI.updateIndicator(newState);
            ShieldUI.updateEmojiButton(newState);
            ShieldUI.updateToggleButton(newState);

            ShieldUI.toast(newState ? 'Шифрование включено 🔒' : 'Шифрование выключено 🔓');

            if (newState && typeof scanMessages === 'function') {
                scanMessages();
            }
        };

        spoofBtn.onclick = () => {
            ShieldUI.toggleSpoofMenu();
        };

        document.getElementById('ms-spoof-custom').onclick = () => {
            ShieldUI.showCustomSpoofModal();
        };

        let lastChatId = ShieldStorage.getCurrentChatId();
        setInterval(async () => {
            const currentChatId = ShieldStorage.getCurrentChatId();
            if (currentChatId !== lastChatId) {
                lastChatId = currentChatId;
                await ShieldUI.onChatChanged(currentChatId);
            }
        }, 500);
    },

    // Toggle key menu visibility
    toggleKeyMenu: async () => {
        const menu = document.getElementById('ms-key-menu');
        const spoofMenu = document.getElementById('ms-spoof-menu');
        const isVisible = menu.style.display !== 'none';

        spoofMenu.style.display = 'none';

        if (isVisible) {
            menu.style.display = 'none';
        } else {
            // Load current password if exists
            const chatData = await ShieldStorage.getChatData();
            const keyMode = await ShieldStorage.getKeyMode();

            if (keyMode === 'manual' && chatData?.key) {
                document.getElementById('ms-manual-password').value = chatData.key;
            } else {
                document.getElementById('ms-manual-password').value = '';
            }

            // Set active tab based on current mode
            document.querySelectorAll('.ms-key-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.mode === keyMode);
            });
            document.getElementById('ms-key-mode-manual').style.display = keyMode === 'manual' ? 'block' : 'none';
            document.getElementById('ms-key-mode-auto').style.display = keyMode === 'auto' ? 'block' : 'none';

            await ShieldUI.updateECDHStatus();
            menu.style.display = 'block';
        }
    },

    // Send ECDH public key
    sendECDHKey: async () => {
        const chatId = ShieldStorage.getCurrentChatId();
        if (!chatId) {
            ShieldUI.toast('Откройте чат!', 'error');
            return;
        }

        try {
            // Check if we already have a key pair
            let ecdhData = await ShieldStorage.getECDHData();
            let publicKeyB64;

            if (ecdhData && ecdhData.myPublicKey && ecdhData.myPrivateKey) {
                // Reuse existing key pair
                publicKeyB64 = ecdhData.myPublicKey;
            } else {
                // Generate new key pair
                const keyPair = await ECDHEngine.generateKeyPair();
                if (!keyPair) {
                    ShieldUI.toast('Ошибка генерации ключей!', 'error');
                    return;
                }

                publicKeyB64 = await ECDHEngine.exportPublicKey(keyPair.publicKey);
                const privateKeyJWK = await ECDHEngine.exportPrivateKey(keyPair.privateKey);

                if (!publicKeyB64 || !privateKeyJWK) {
                    ShieldUI.toast('Ошибка экспорта ключей!', 'error');
                    return;
                }

                await ShieldStorage.setECDHKeyPair(publicKeyB64, privateKeyJWK);
                await ShieldStorage.setKeyMode('auto');
            }

            // Create ECDH message
            const ecdhMessage = await CryptoEngine.createECDHKeyMessage(publicKeyB64);
            if (!ecdhMessage) {
                ShieldUI.toast('Ошибка создания сообщения!', 'error');
                return;
            }

            // Insert into editor and send
            const editor = document.querySelector(ShieldSelectors.EDITOR);
            if (!editor) {
                ShieldUI.toast('Редактор не найден!', 'error');
                return;
            }

            SendHandler.insertIntoEditor(editor, ecdhMessage);

            setTimeout(() => {
                const btn = document.querySelector(ShieldSelectors.SEND_BTN);
                if (btn) btn.click();
            }, 100);

            const fingerprint = await ECDHEngine.generateFingerprint(publicKeyB64);
            ShieldUI.toast(`📤 Ключ отправлен [${fingerprint}]`);
            ShieldUI.updateECDHStatus();
            ShieldUI.updateKeyModeDisplay();

            // Check if we can already derive shared secret
            ecdhData = await ShieldStorage.getECDHData();
            if (ecdhData && ecdhData.myPrivateKey && ecdhData.peerPublicKey) {
                const privateKey = await ECDHEngine.importPrivateKey(ecdhData.myPrivateKey);
                const peerPublicKey = await ECDHEngine.importPublicKey(ecdhData.peerPublicKey);

                if (privateKey && peerPublicKey) {
                    const sharedSecret = await ECDHEngine.deriveSharedSecret(privateKey, peerPublicKey);

                    if (sharedSecret) {
                        await ShieldStorage.setChatPassword(sharedSecret);
                        ShieldState.isActive = true;
                        ShieldUI.updateIndicator(true);
                        ShieldUI.updateEmojiButton(true);
                        ShieldUI.updateToggleButton(true);
                        ShieldUI.updateKeyModeDisplay();
                        ShieldUI.toast('🔐 Ключи согласованы!');

                        setTimeout(() => {
                            if (typeof scanMessages === 'function') {
                                scanMessages();
                            }
                        }, 500);
                    }
                }
            }

        } catch (e) {
            console.error("[Shield] sendECDHKey Error:", e);
            ShieldUI.toast('Ошибка отправки ключа!', 'error');
        }
    },

    // Update ECDH status display
    updateECDHStatus: async () => {
        const ecdhData = await ShieldStorage.getECDHData();
        const statusIcon = document.getElementById('ms-ecdh-status-icon');
        const statusText = document.getElementById('ms-ecdh-status-text');
        const fingerprint = document.getElementById('ms-ecdh-fingerprint');
        const sendBtn = document.getElementById('ms-ecdh-send');

        if (!ecdhData || !ecdhData.myPublicKey) {
            statusIcon.textContent = '🔓';
            statusText.textContent = 'Ключи не созданы';
            statusText.style.color = '#888';
            fingerprint.textContent = '';
            sendBtn.textContent = '📤 Отправить публичный ключ';
        } else if (!ecdhData.peerPublicKey) {
            statusIcon.textContent = '⏳';
            statusText.textContent = 'Ожидание ключа собеседника';
            statusText.style.color = '#fa0';
            const fp = await ECDHEngine.generateFingerprint(ecdhData.myPublicKey);
            fingerprint.textContent = `Ваш: ${fp}`;
            sendBtn.textContent = '📤 Отправить ещё раз';
        } else {
            statusIcon.textContent = '🔐';
            statusText.textContent = 'Ключи согласованы!';
            statusText.style.color = '#0f0';
            const myFp = await ECDHEngine.generateFingerprint(ecdhData.myPublicKey);
            const peerFp = await ECDHEngine.generateFingerprint(ecdhData.peerPublicKey);
            fingerprint.textContent = `Ваш: ${myFp} | Партнёр: ${peerFp}`;
            sendBtn.textContent = '📤 Отправить ещё раз';
        }
    },

    // Update key mode display in panel
    updateKeyModeDisplay: async () => {
        const statusEl = document.getElementById('ms-key-mode-status');
        if (!statusEl) return;

        const chatData = await ShieldStorage.getChatData();
        const keyMode = await ShieldStorage.getKeyMode();
        const ecdhStatus = await ShieldStorage.getECDHStatus();

        if (!chatData || !chatData.key) {
            statusEl.textContent = '🔑 Нет ключа';
            statusEl.style.color = '#888';
        } else if (keyMode === 'auto') {
            if (ecdhStatus === 'complete') {
                statusEl.textContent = '🔐 ECDH ключи';
                statusEl.style.color = '#0af';
            } else if (ecdhStatus === 'waiting') {
                statusEl.textContent = '⏳ Ожидание ключа';
                statusEl.style.color = '#fa0';
            } else {
                statusEl.textContent = '🔄 ECDH режим';
                statusEl.style.color = '#888';
            }
        } else {
            statusEl.textContent = '🔑 Ручной ключ';
            statusEl.style.color = '#0f0';
        }
    },

    toggleSpoofMenu: async () => {
        const menu = document.getElementById('ms-spoof-menu');
        const keyMenu = document.getElementById('ms-key-menu');
        const isVisible = menu.style.display !== 'none';

        keyMenu.style.display = 'none';

        if (isVisible) {
            menu.style.display = 'none';
        } else {
            await ShieldUI.renderSpoofPresets();
            menu.style.display = 'block';
        }
    },

    renderSpoofPresets: async () => {
        const urlContainer = document.getElementById('ms-spoof-urls');
        const crashContainer = document.getElementById('ms-spoof-crashes');
        const logContainer = document.getElementById('ms-spoof-logs');
        const otherContainer = document.getElementById('ms-spoof-other');
        const currentPreset = await ShieldStorage.getSpoofPreset();

        urlContainer.innerHTML = '';
        crashContainer.innerHTML = '';
        logContainer.innerHTML = '';
        otherContainer.innerHTML = '';

        // All URL presets
        const urlPresets = ['wildberries', 'ozon', 'aliexpress', 'youtube', 'vk', 'google',
                           'amazon', 'github', 'telegram', 'reddit', 'twitter', 'yandex_market',
                           'avito', 'instagram', 'tiktok', 'spotify', 'notion', 'discord',
                           'steam', 'linkedin', 'dropbox'];
        // All crash presets
        const crashPresets = ['crashlog_java', 'crashlog_python', 'crashlog_js', 'crashlog_rust',
                             'crashlog_go', 'crashlog_csharp', 'crashlog_kotlin', 'crashlog_swift',
                             'crashlog_php', 'crashlog_ruby', 'crashlog_scala', 'crashlog_elixir',
                             'crashlog_full_java', 'crashlog_simple'];
        // All log presets
        const logPresets = ['log_nginx', 'log_docker', 'log_kernel', 'log_android', 'log_git',
                           'log_sql', 'log_ssl', 'log_webpack', 'log_kubernetes', 'log_systemd',
                           'log_aws', 'log_elasticsearch', 'log_postgres', 'log_redis',
                           'log_apache', 'log_mongodb', 'log_graphql', 'log_terraform',
                           'log_ansible', 'log_jenkins', 'log_prometheus', 'log_sentry',
                           'log_distributed', 'log_microservices', 'log_simple'];
        // Other presets (including multipart advanced)
        const otherPresets = ['hex_dump', 'base64_block', 'jwt_token', 'network_packet', 'coredump',
                             'debug_session', 'api_request_log', 'security_audit', 'test_failure'];

        const getLengthBadge = (category) => {
            const badges = {
                'short': '<span class="ms-length-badge short">📝 Корот.</span>',
                'medium': '<span class="ms-length-badge medium">📄 Сред.</span>',
                'long': '<span class="ms-length-badge long">📜 Длин.</span>'
            };
            return badges[category] || '';
        };

        const getMultipartBadge = (preset) => {
            if (preset.multipart && preset.parts) {
                return `<span class="ms-multipart-badge">×${preset.parts}</span>`;
            }
            return '';
        };

        const createItem = (id, preset, container) => {
            const item = document.createElement('div');
            item.className = `ms-spoof-item ${currentPreset.id === id ? 'active' : ''}`;
            item.innerHTML = `${preset.name}${getLengthBadge(preset.lengthCategory)}${getMultipartBadge(preset)}`;
            item.title = preset.description || '';
            item.onclick = async () => {
                await ShieldStorage.setSpoofPreset(id);
                await ShieldUI.updateSpoofDisplay();
                document.getElementById('ms-spoof-menu').style.display = 'none';
                const info = preset.multipart ? ` (×${preset.parts} частей)` : '';
                ShieldUI.toast(`Маска: ${preset.name}${info}`);
            };
            container.appendChild(item);
        };

        urlPresets.forEach(id => {
            if (SpoofPresets[id]) createItem(id, SpoofPresets[id], urlContainer);
        });
        crashPresets.forEach(id => {
            if (SpoofPresets[id]) createItem(id, SpoofPresets[id], crashContainer);
        });
        logPresets.forEach(id => {
            if (SpoofPresets[id]) createItem(id, SpoofPresets[id], logContainer);
        });
        otherPresets.forEach(id => {
            if (SpoofPresets[id]) createItem(id, SpoofPresets[id], otherContainer);
        });

        if (currentPreset.id === 'custom') {
            const customItem = document.createElement('div');
            customItem.className = 'ms-spoof-item active';
            customItem.textContent = '✏️ Custom';
            otherContainer.appendChild(customItem);
        }
    },

    showCustomSpoofModal: () => {
        const existing = document.querySelector('.ms-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'ms-modal-overlay';
        overlay.innerHTML = `
            <div class="ms-modal">
                <div class="ms-modal-title">✏️ Свой шаблон маскировки</div>
                <div class="ms-modal-field">
                    <label class="ms-modal-label">Название</label>
                    <input type="text" class="ms-modal-input" id="ms-custom-name" 
                           placeholder="My Custom Spoof">
                </div>
                <div class="ms-modal-field">
                    <label class="ms-modal-label">Шаблон (URL или текст)</label>
                    <textarea class="ms-modal-textarea" id="ms-custom-template" 
                           placeholder="https://example.com/?data={DATA}&#10;или многострочный текст с {DATA}"></textarea>
                    <div class="ms-modal-hint">{RND} - случайное число, {DATA} - зашифрованные данные</div>
                </div>
                <div class="ms-modal-field">
                    <label class="ms-modal-label">Regex для извлечения данных</label>
                    <input type="text" class="ms-modal-input" id="ms-custom-extract" 
                           placeholder="data=([^&\\s]+) или Error: (.+)$">
                    <div class="ms-modal-hint">Группа захвата (1) должна содержать {DATA}</div>
                </div>
                <div class="ms-modal-field">
                    <label class="ms-modal-label">Детекторы (через запятую)</label>
                    <input type="text" class="ms-modal-input" id="ms-custom-detect" 
                           placeholder="example.com, data=">
                    <div class="ms-modal-hint">Строки для определения зашифрованного сообщения</div>
                </div>
                <div class="ms-modal-buttons">
                    <button class="ms-modal-btn" id="ms-modal-cancel">Отмена</button>
                    <button class="ms-modal-btn primary" id="ms-modal-save">Сохранить</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        document.getElementById('ms-modal-cancel').onclick = () => overlay.remove();

        document.getElementById('ms-modal-save').onclick = async () => {
            const name = document.getElementById('ms-custom-name').value.trim() || 'Custom';
            const template = document.getElementById('ms-custom-template').value.trim();
            const extractStr = document.getElementById('ms-custom-extract').value.trim();
            const detectStr = document.getElementById('ms-custom-detect').value.trim();

            if (!template || !detectStr) {
                ShieldUI.toast('Заполните шаблон и детекторы!', 'error');
                return;
            }

            if (!template.includes('{DATA}')) {
                ShieldUI.toast('Шаблон должен содержать {DATA}!', 'error');
                return;
            }

            const detect = detectStr.split(',').map(s => s.trim()).filter(s => s);
            if (detect.length < 1) {
                ShieldUI.toast('Нужен хотя бы один детектор!', 'error');
                return;
            }

            const type = template.startsWith('http') ? 'url' : 'text';

            await ShieldStorage.setCustomSpoof(name, template, null, detect, type, extractStr || null);
            await ShieldUI.updateSpoofDisplay();
            overlay.remove();
            document.getElementById('ms-spoof-menu').style.display = 'none';
            ShieldUI.toast('Свой шаблон сохранён! ✏️');
        };
    },

    updateSpoofDisplay: async () => {
        const preset = await ShieldStorage.getSpoofPreset();
        const nameEl = document.getElementById('ms-spoof-name');
        if (nameEl) {
            let name = preset.name;
            if (preset.multipart && preset.parts) {
                name += ` (×${preset.parts})`;
            }
            nameEl.textContent = name;
        }
    },

    onChatChanged: async (chatId) => {
        document.getElementById('ms-chat-id').textContent = chatId || '---';

        // Close menus on chat change
        document.getElementById('ms-key-menu').style.display = 'none';
        document.getElementById('ms-spoof-menu').style.display = 'none';

        const chatData = await ShieldStorage.getChatData(chatId);
        const isEnabled = chatData && chatData.enabled;

        ShieldState.isActive = isEnabled;
        ShieldUI.updateIndicator(isEnabled);
        ShieldUI.updateEmojiButton(isEnabled);
        ShieldUI.updateToggleButton(isEnabled);
        ShieldUI.updateKeyModeDisplay();

        if (isEnabled && typeof scanMessages === 'function') {
            scanMessages();
        } else {
            // Still scan for ECDH key messages even when not enabled
            if (typeof MessageScanner !== 'undefined' && MessageScanner.scanForECDH) {
                MessageScanner.scanForECDH();
            }
        }
    },

    updateEmojiButton: (encryptionActive) => {
        const emojiBtn = document.querySelector('button[aria-label="Открыть меню стикеров"]');
        if (emojiBtn) {
            const wrapper = emojiBtn.closest('.btn');
            if (wrapper) {
                wrapper.style.display = encryptionActive ? 'none' : '';
            }
        }
    },

    updateToggleButton: (enabled) => {
        const icon = document.getElementById('ms-toggle-icon');
        if (icon) {
            icon.textContent = enabled ? '⏸️' : '▶️';
        }
    },

    checkInitialState: async () => {
        const chatId = ShieldStorage.getCurrentChatId();
        document.getElementById('ms-chat-id').textContent = chatId || '---';

        const chatData = await ShieldStorage.getChatData();
        const isEnabled = chatData && chatData.enabled;

        ShieldState.isActive = isEnabled;
        ShieldUI.updateIndicator(isEnabled);
        ShieldUI.updateEmojiButton(isEnabled);
        ShieldUI.updateToggleButton(isEnabled);
        ShieldUI.updateKeyModeDisplay();
    },

    updateIndicator: (active) => {
        const ind = document.getElementById('ms-ind');
        const btn = document.getElementById('ms-setup-btn');

        if (!ind || !btn) return;

        if (active) {
            ind.style.background = '#00ff00';
            ind.style.boxShadow = '0 0 8px #00ff00';
            btn.style.color = '#fff';
            btn.style.borderColor = '#0a0';
        } else {
            ind.style.background = '#555';
            ind.style.boxShadow = 'none';
            btn.style.color = '#aaa';
            btn.style.borderColor = '#444';
        }
    },

    toast: (message, type = 'success') => {
        const existing = document.querySelector('.ms-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `ms-toast ${type === 'error' ? 'error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    // Update length info display based on current text length
    updateLengthInfo: (textLength) => {
        const iconEl = document.getElementById('ms-length-icon');
        const textEl = document.getElementById('ms-length-text');

        if (!iconEl || !textEl) return;

        let category, icon, text, color;

        if (textLength === 0) {
            icon = '📄';
            text = 'Любая длина';
            color = '#888';
            category = null;
        } else if (textLength <= 50) {
            icon = '📝';
            text = `Короткое (${textLength} симв.)`;
            color = '#0cf';
            category = 'short';
        } else if (textLength <= 200) {
            icon = '📄';
            text = `Среднее (${textLength} симв.)`;
            color = '#fc0';
            category = 'medium';
        } else {
            icon = '📜';
            text = `Длинное (${textLength} симв.)`;
            color = '#f88';
            category = 'long';
        }

        iconEl.textContent = icon;
        textEl.textContent = text;
        textEl.style.color = color;

        // Store current category for filtering
        ShieldUI.currentLengthCategory = category;
    },

    // Apply filter to show/hide preset categories
    applyPresetFilter: (filter) => {
        const urlSection = document.getElementById('ms-spoof-urls')?.parentElement;
        const crashSection = document.getElementById('ms-spoof-crashes')?.parentElement;
        const logSection = document.getElementById('ms-spoof-logs')?.parentElement;
        const otherSection = document.getElementById('ms-spoof-other')?.parentElement;

        // Get all category headers
        const categories = document.querySelectorAll('#ms-spoof-menu .ms-spoof-category');
        const urlCat = categories[0];
        const crashCat = categories[1];
        const logCat = categories[2];
        const otherCat = categories[3];

        const urlDiv = document.getElementById('ms-spoof-urls');
        const crashDiv = document.getElementById('ms-spoof-crashes');
        const logDiv = document.getElementById('ms-spoof-logs');
        const otherDiv = document.getElementById('ms-spoof-other');

        // Show all by default
        if (urlCat) urlCat.style.display = '';
        if (crashCat) crashCat.style.display = '';
        if (logCat) logCat.style.display = '';
        if (otherCat) otherCat.style.display = '';
        if (urlDiv) urlDiv.style.display = '';
        if (crashDiv) crashDiv.style.display = '';
        if (logDiv) logDiv.style.display = '';
        if (otherDiv) otherDiv.style.display = '';

        // Apply filter
        switch(filter) {
            case 'url':
                if (crashCat) crashCat.style.display = 'none';
                if (logCat) logCat.style.display = 'none';
                if (otherCat) otherCat.style.display = 'none';
                if (crashDiv) crashDiv.style.display = 'none';
                if (logDiv) logDiv.style.display = 'none';
                if (otherDiv) otherDiv.style.display = 'none';
                break;
            case 'crash':
                if (urlCat) urlCat.style.display = 'none';
                if (logCat) logCat.style.display = 'none';
                if (otherCat) otherCat.style.display = 'none';
                if (urlDiv) urlDiv.style.display = 'none';
                if (logDiv) logDiv.style.display = 'none';
                if (otherDiv) otherDiv.style.display = 'none';
                break;
            case 'log':
                if (urlCat) urlCat.style.display = 'none';
                if (crashCat) crashCat.style.display = 'none';
                if (otherCat) otherCat.style.display = 'none';
                if (urlDiv) urlDiv.style.display = 'none';
                if (crashDiv) crashDiv.style.display = 'none';
                if (otherDiv) otherDiv.style.display = 'none';
                break;
            case 'multi':
                // Show only multipart presets (3+ parts)
                document.querySelectorAll('.ms-spoof-item').forEach(item => {
                    const badge = item.querySelector('.ms-multipart-badge');
                    const parts = badge ? parseInt(badge.textContent.replace('×', '')) : 1;
                    item.style.display = parts >= 3 ? '' : 'none';
                });
                break;
            case 'all':
            default:
                // Show all
                document.querySelectorAll('.ms-spoof-item').forEach(item => {
                    item.style.display = '';
                });
                break;
        }
    },

    currentFilter: 'all',
    currentLengthCategory: null
};
