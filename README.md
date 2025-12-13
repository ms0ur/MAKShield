# MAKShield

<p align="center">
  <img src="maksbanner.png" alt="MAKShield Logo" width="128">
  <img src="maksicon.png" alt="MAKShield Logo" width="128">
</p>

**End-to-End Encryption for MAX Messenger (Web) (Russian goverment messanger)**

---

## 🇬🇧 English

### Overview

MAKShield is a browser extension that adds end-to-end encryption to MAX Messenger web client (`web.max.ru`) (this is russian goverment messanger, all messages in extension only in russian). All encryption and decryption happens locally in your browser - no data is ever sent to external servers.

### Features

- 🔐 **AES-256-GCM Encryption** - Military-grade encryption using Web Crypto API
- 🔑 **PBKDF2 Key Derivation** - Secure password-based key generation with 100,000 iterations
- 🔄 **ECDH Key Exchange** - Automatic secure key exchange using Elliptic Curve Diffie-Hellman (P-256)
- 💬 **Per-Chat Keys** - Set different encryption keys for different conversations
- 🎭 **Message Disguise** - Encrypted messages appear as regular URLs, crash logs, or system logs
- 🧩 **Multipart Messages** - Data can be split across multiple locations in a message for better disguise
- 📏 **Length Categories** - Presets optimized for short (<50), medium (50-200), and long (>200) messages
- 🔒 **Local-Only Storage** - All keys stored locally using browser storage API
- 📴 **Offline Capable** - No external dependencies or network calls

### Installation

#### Firefox
1. Download the extension from SOON
2. Or install manually:
   - Download the source code
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file from the extension folder

### How It Works

#### Manual Mode (Password)
1. **Set a key** for your chat using the KEY button → Manual tab
2. **Share the password** with your contact through a secure channel
3. **Type your message** normally
4. **Send** - the message is automatically encrypted and disguised

#### Auto Mode (ECDH Key Exchange)
1. Click **KEY** button → **Auto (ECDH)** tab
2. Click **"Send Public Key"** - your key is sent disguised as a regular message
3. **Wait** for your contact to send their key
4. Once both keys are exchanged, **encryption activates automatically**
5. Verify fingerprints with your contact to ensure no MITM attack

### Privacy & Data

⚠️ **Important Privacy Information:**

- ✅ **NO data collection** - This extension does not collect, store, or transmit any user data to external servers
- ✅ **NO analytics** - No tracking, telemetry, or usage statistics
- ✅ **NO network requests** - The extension works entirely offline
- ✅ **Local storage only** - Encryption keys are stored locally in your browser using `browser.storage.local`
- ✅ **Open source** - All code is readable and auditable

**What is stored locally:**
- Encryption keys for each chat (set by you or derived via ECDH)
- ECDH key pairs for automatic key exchange
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
| Key Exchange | ECDH P-256 (secp256r1) |
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

**🔗 URL Links (21 presets):**
- Wildberries, Ozon, AliExpress, YouTube, VK, Google Docs
- Amazon, GitHub, Telegram, Reddit, Twitter/X, Яндекс.Маркет
- Avito, Instagram, TikTok, Spotify, Notion, Discord, Steam, LinkedIn, Dropbox

**☠️ Crash Logs (13 presets):**
- Java, Python, JavaScript, Rust, Go, C#, Kotlin
- Swift, PHP, Ruby, Scala, Elixir, Full Java Stack (×3 parts)

**📋 System Logs (23 presets):**
- Nginx, Docker, Kernel, Android, Git, SQL, SSL, Webpack
- Kubernetes, Systemd, AWS CloudWatch, Elasticsearch, PostgreSQL
- Redis, Apache, MongoDB, GraphQL, Terraform, Ansible, Jenkins
- Prometheus, Sentry, Distributed Trace (×4), Microservices Log (×4)

**📄 Other (9 presets):**
- Hex Dump, Base64 Block, JWT Token, Network Packet, Core Dump
- Debug Session (×3), API Request Log (×4), Security Audit (×4), Test Failure (×3)

**Multipart presets** split encrypted data across multiple locations in the message (marked with ×N), making detection even harder.

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
- 🔄 **Обмен ключами ECDH** - Автоматический безопасный обмен ключами через ECDH (P-256)
- 💬 **Отдельные ключи для чатов** - Устанавливайте разные ключи шифрования для разных бесед
- 🎭 **Маскировка сообщений** - Зашифрованные сообщения выглядят как обычные URL, crash-логи или системные логи
- 🧩 **Multipart сообщения** - Данные могут быть разбиты на несколько мест в сообщении для лучшей маскировки
- 📏 **Категории длины** - Пресеты оптимизированы для коротких (<50), средних (50-200) и длинных (>200) сообщений
- 🔒 **Только локальное хранение** - Все ключи хранятся локально через API хранилища браузера
- 📴 **Работа оффлайн** - Нет внешних зависимостей или сетевых запросов

### Установка

#### Firefox
1. Скачайте расширение из СКОРО
2. Или установите вручную:
   - Скачайте исходный код
   - Перейдите на `about:debugging#/runtime/this-firefox`
   - Нажмите "Загрузить временное дополнение"
   - Выберите любой файл из папки расширения

### Как это работает

#### Ручной режим (Пароль)
1. **Установите ключ** для чата кнопкой KEY → вкладка "Ручной"
2. **Поделитесь паролем** с собеседником через безопасный канал
3. **Напишите сообщение** как обычно
4. **Отправьте** - сообщение автоматически зашифруется и замаскируется

#### Авто режим (ECDH обмен ключами)
1. Нажмите **KEY** → вкладка **"Авто (ECDH)"**
2. Нажмите **"Отправить публичный ключ"** - ключ отправится замаскированным под обычное сообщение
3. **Дождитесь** пока собеседник отправит свой ключ
4. После обмена ключами **шифрование активируется автоматически**
5. Сверьте fingerprint-ы с собеседником для защиты от MITM-атак

### Конфиденциальность и данные

⚠️ **Важная информация о конфиденциальности:**

- ✅ **БЕЗ сбора данных** - Это расширение не собирает, не хранит и не передаёт никакие пользовательские данные на внешние серверы
- ✅ **БЕЗ аналитики** - Никакого отслеживания, телеметрии или статистики использования
- ✅ **БЕЗ сетевых запросов** - Расширение работает полностью оффлайн
- ✅ **Только локальное хранилище** - Ключи шифрования хранятся локально в браузере через `browser.storage.local`
- ✅ **Открытый исходный код** - Весь код читаем и проверяем

**Что хранится локально:**
- Ключи шифрования для каждого чата (установленные вами или полученные через ECDH)
- ECDH ключевые пары для автоматического обмена ключами
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
| Обмен ключами | ECDH P-256 (secp256r1) |
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

**🔗 URL-ссылки (21 пресет):**
- Wildberries, Ozon, AliExpress, YouTube, VK, Google Docs
- Amazon, GitHub, Telegram, Reddit, Twitter/X, Яндекс.Маркет
- Avito, Instagram, TikTok, Spotify, Notion, Discord, Steam, LinkedIn, Dropbox

**☠️ Crash-логи (13 пресетов):**
- Java, Python, JavaScript, Rust, Go, C#, Kotlin
- Swift, PHP, Ruby, Scala, Elixir, Full Java Stack (×3 части)

**📋 Системные логи (23 пресета):**
- Nginx, Docker, Kernel, Android, Git, SQL, SSL, Webpack
- Kubernetes, Systemd, AWS CloudWatch, Elasticsearch, PostgreSQL
- Redis, Apache, MongoDB, GraphQL, Terraform, Ansible, Jenkins
- Prometheus, Sentry, Distributed Trace (×4), Microservices Log (×4)

**📄 Другое (9 пресетов):**
- Hex Dump, Base64 Block, JWT Token, Network Packet, Core Dump
- Debug Session (×3), API Request Log (×4), Security Audit (×4), Test Failure (×3)

**Multipart пресеты** разбивают зашифрованные данные на несколько мест в сообщении (помечены ×N), что затрудняет обнаружение.

### Лицензия

MIT License - Бесплатно для личного и коммерческого использования.

### Автор

Создано **ms0ur**

