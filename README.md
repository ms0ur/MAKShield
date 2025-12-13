# MAKShield

<p align="center">
  <img src="maksbanner.png" alt="MAKShield Logo" width="128">
  <img src="maksicon.png" alt="MAKShield Logo" width="128">
</p>

**End-to-End Encryption for MAX Messenger (Web)**

---

## 🇬🇧 English

### Overview

MAKShield is a browser extension that adds end-to-end encryption to MAX Messenger web client (`web.max.ru`). All encryption and decryption happens locally in your browser - no data is ever sent to external servers.

### Features

- 🔐 **AES-256-GCM Encryption** - Military-grade encryption using Web Crypto API
- 🔑 **PBKDF2 Key Derivation** - Secure password-based key generation with 100,000 iterations
- 💬 **Per-Chat Keys** - Set different encryption keys for different conversations
- 🎭 **Message Disguise** - Encrypted messages appear as regular URLs or log entries
- 🔒 **Local-Only Storage** - All keys stored locally using browser storage API
- 📴 **Offline Capable** - No external dependencies or network calls

### Installation

#### Firefox
1. Download the extension from [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/mak-shield/) (pending review)
2. Or install manually:
   - Download the source code
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file from the extension folder

### How It Works

1. **Set a key** for your chat using the KEY button
2. **Type your message** normally
3. **Send** - the message is automatically encrypted and disguised
4. **Receive** - encrypted messages are automatically decrypted if you have the key

### Privacy & Data

⚠️ **Important Privacy Information:**

- ✅ **NO data collection** - This extension does not collect, store, or transmit any user data to external servers
- ✅ **NO analytics** - No tracking, telemetry, or usage statistics
- ✅ **NO network requests** - The extension works entirely offline
- ✅ **Local storage only** - Encryption keys are stored locally in your browser using `browser.storage.local`
- ✅ **Open source** - All code is readable and auditable

**What is stored locally:**
- Encryption keys for each chat (set by you)
- Selected disguise preset preference
- Custom disguise templates (if created)

**What is NOT collected:**
- Message content
- Browsing history
- Personal information
- Any data sent to external servers

### Technical Details

| Feature | Implementation |
|---------|----------------|
| Encryption | AES-256-GCM |
| Key Derivation | PBKDF2-SHA256 (100k iterations) |
| Salt | Random 16 bytes per message |
| IV | Random 12 bytes per message |
| API | Web Crypto API (SubtleCrypto) |

### Permissions Explained

| Permission | Reason |
|------------|--------|
| `storage` | Store encryption keys locally |
| `https://web.max.ru/*` | Access MAX Messenger pages to encrypt/decrypt messages |

### Disguise Presets

Messages can be disguised as:
- 🔗 **URLs**: Wildberries, Ozon, AliExpress, YouTube, VK, Google Docs
- ☠️ **Crash Logs**: Java, Python, JavaScript, Rust
- 📋 **System Logs**: Nginx, Docker, Kernel, Android, Git, SQL, SSL, Webpack

### License

MIT License - Free for personal and commercial use.

### Author

Created by **ms0ur**

---

## 🇷🇺 Русский

### Обзор

MAKShield - это расширение браузера, добавляющее сквозное шифрование в веб-клиент MAX Messenger (`web.max.ru`). Всё шифрование и дешифрование происходит локально в вашем браузере - никакие данные никогда не отправляются на внешние серверы.

### Возможности

- 🔐 **Шифрование AES-256-GCM** - Шифрование военного уровня с использованием Web Crypto API
- 🔑 **Деривация ключей PBKDF2** - Безопасная генерация ключей на основе пароля с 100,000 итерациями
- 💬 **Отдельные ключи для чатов** - Устанавливайте разные ключи шифрования для разных бесед
- 🎭 **Маскировка сообщений** - Зашифрованные сообщения выглядят как обычные URL или логи
- 🔒 **Только локальное хранение** - Все ключи хранятся локально через API хранилища браузера
- 📴 **Работа оффлайн** - Нет внешних зависимостей или сетевых запросов

### Установка

#### Firefox
1. Скачайте расширение из [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/mak-shield/) (на проверке)
2. Или установите вручную:
   - Скачайте исходный код
   - Перейдите на `about:debugging#/runtime/this-firefox`
   - Нажмите "Загрузить временное дополнение"
   - Выберите любой файл из папки расширения

#### Chrome/Edge
1. Скачайте и распакуйте исходный код
2. Перейдите на `chrome://extensions/` (или `edge://extensions/`)
3. Включите "Режим разработчика"
4. Нажмите "Загрузить распакованное" и выберите папку расширения

### Как это работает

1. **Установите ключ** для чата кнопкой KEY
2. **Напишите сообщение** как обычно
3. **Отправьте** - сообщение автоматически зашифруется и замаскируется
4. **Получите** - зашифрованные сообщения автоматически расшифруются, если у вас есть ключ

### Конфиденциальность и данные

⚠️ **Важная информация о конфиденциальности:**

- ✅ **БЕЗ сбора данных** - Это расширение не собирает, не хранит и не передаёт никакие пользовательские данные на внешние серверы
- ✅ **БЕЗ аналитики** - Никакого отслеживания, телеметрии или статистики использования
- ✅ **БЕЗ сетевых запросов** - Расширение работает полностью оффлайн
- ✅ **Только локальное хранилище** - Ключи шифрования хранятся локально в браузере через `browser.storage.local`
- ✅ **Открытый исходный код** - Весь код читаем и проверяем

**Что хранится локально:**
- Ключи шифрования для каждого чата (установленные вами)
- Выбранный пресет маскировки
- Пользовательские шаблоны маскировки (если созданы)

**Что НЕ собирается:**
- Содержимое сообщений
- История браузера
- Личная информация
- Любые данные на внешние серверы

### Технические детали

| Функция | Реализация |
|---------|------------|
| Шифрование | AES-256-GCM |
| Деривация ключей | PBKDF2-SHA256 (100k итераций) |
| Соль | Случайные 16 байт на сообщение |
| IV | Случайные 12 байт на сообщение |
| API | Web Crypto API (SubtleCrypto) |

### Объяснение разрешений

| Разрешение | Причина |
|------------|---------|
| `storage` | Хранение ключей шифрования локально |
| `https://web.max.ru/*` | Доступ к страницам MAX Messenger для шифрования/дешифрования сообщений |

### Пресеты маскировки

Сообщения могут быть замаскированы под:
- 🔗 **URL-ссылки**: Wildberries, Ozon, AliExpress, YouTube, VK, Google Docs
- ☠️ **Crash-логи**: Java, Python, JavaScript, Rust
- 📋 **Системные логи**: Nginx, Docker, Kernel, Android, Git, SQL, SSL, Webpack

### Лицензия

MIT License - Бесплатно для личного и коммерческого использования.

### Автор

Создано **ms0ur**

---

## Firefox Add-on Policy Compliance

This extension fully complies with [Mozilla Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/):

| Policy | Status | Details |
|--------|--------|---------|
| No Surprises | ✅ | Functionality matches description exactly |
| No Remote Code | ✅ | All code is bundled, no external loading |
| Minimal Permissions | ✅ | Only `storage` and site access required |
| No Data Collection | ✅ | Zero data transmitted externally |
| Readable Code | ✅ | No obfuscation or minification |
| No CSP Relaxation | ✅ | Does not modify security headers |
| Encryption | ✅ | Uses secure Web Crypto API |
| Self-Contained | ✅ | No external dependencies |


