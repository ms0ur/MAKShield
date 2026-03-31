# MAKShield

<p align="center">
  <img src="maksbanner.png" alt="MAKShield Logo" width="128">
  <img src="maksicon.png" alt="MAKShield Logo" width="128">
</p>

**End-to-End Encryption for MAX Messenger & VK (Web)**

---

## 🇬🇧 English

### Overview

MAKShield is a browser extension that adds end-to-end encryption to **MAX Messenger** (`web.max.ru`) and **VKontakte** (`vk.com`, `vk.ru`) web clients. All encryption and decryption happens locally in your browser — no data is ever sent to external servers.

### Features

- 🔐 **AES-256-GCM Encryption** — Military-grade authenticated encryption via Web Crypto API
- 🔑 **PBKDF2 Key Derivation** — 600,000 iterations (OWASP 2023 recommendation)
- 🔗 **HKDF Key Expansion** — Domain-separated key derivation for maximum security
- 🔄 **ECDH Key Exchange** — Automatic key exchange using P-384 curve (192-bit security)
- 💬 **Per-Chat Keys** — Different encryption keys for different conversations
- 🎭 **Message Disguise** — Encrypted data hidden inside URLs, crash logs, or system logs
- 🧩 **Multipart Messages** — Data split across multiple locations for better disguise
- ⚙️ **Configurable Selectors** — CSS selectors editable via UI for any service
- 🌐 **Multi-Service** — Works on MAX and VK with per-service configuration
- 📱 **Firefox Mobile** — Works on Firefox for Android

### Installation

#### Firefox Desktop

**Temporary installation (development):**
1. Download / clone this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on"**
4. Select `manifest.json` from the extension folder

**Permanent installation (unsigned):**
1. Open `about:config`
2. Set `xpinstall.signatures.required` to `false` *(only available in Firefox Developer Edition / Nightly)*
3. Pack the extension folder into a `.zip` file, rename to `.xpi`
4. Open `about:addons` → ⚙️ gear icon → **"Install Add-on From File"**
5. Select the `.xpi` file

#### Firefox Mobile (Android)

> ⚠️ **Firefox for Android supports extensions since version 120+ (Fenix)**

1. On your Android device, open **Firefox** (not Firefox Lite/Focus)
2. Navigate to `about:debugging`  
   *— If unavailable, use the method below:*
3. Go to **Settings** → **About Firefox** → tap version number 5 times to enable Developer Mode
4. Go to **Settings** → **Custom Add-on collection**
5. Enter your Mozilla account user ID and collection name where you've uploaded MAKShield
6. Restart Firefox — the extension will appear in Add-ons

**Alternative (ADB):**
1. Enable **USB Debugging** on your device
2. Connect to PC, open `about:debugging` in **desktop** Firefox
3. Click your device → **"Runtime Info"** → **"Load Temporary Add-on"**
4. Select `manifest.json` from your PC

#### Chrome / Chromium

1. Download / clone this repository
2. Open `chrome://extensions`
3. Enable **"Developer mode"** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the extension folder

> ⚠️ Chrome unpacked extensions show a warning on every browser restart. To remove it, pack the extension and add the `.crx` via group policy or enterprise install.

### How It Works

#### Manual Mode (Password)
1. Open a chat on MAX or VK
2. Click **KEY** → **"Manual"** tab
3. Enter a password and click **Save**
4. Share the password with your contact via a separate secure channel
5. Type and send messages — they are encrypted and disguised automatically

#### Auto Mode (ECDH Key Exchange)
1. Click **KEY** → **"Auto (ECDH)"** tab
2. Click **"Send Public Key"** — your P-384 public key is sent disguised as a regular message
3. Wait for your contact to send their key
4. Once both keys are exchanged, encryption activates automatically
5. **Verify fingerprints** with your contact to ensure no MITM attack

### Technical Details

| Feature | Implementation |
|---------|----------------|
| Encryption | AES-256-GCM (authenticated) |
| Key Derivation | PBKDF2-SHA256 (600,000 iterations) |
| Key Expansion | HKDF-SHA256 (domain separation) |
| Key Exchange | ECDH P-384 (secp384r1, 192-bit security) |
| Salt | Random 32 bytes per message |
| IV | Random 12 bytes per message |
| Payload | v3 format (JSON → Base64URL → URI-encoded) |
| API | Web Crypto API (SubtleCrypto) |

### Permissions

| Permission | Reason |
|------------|--------|
| `storage` | Store encryption keys locally |
| `https://web.max.ru/*` | Access MAX Messenger |
| `https://vk.com/*`, `https://vk.ru/*` | Access VKontakte (desktop) |
| `https://m.vk.com/*`, `https://m.vk.ru/*` | Access VKontakte (mobile web) |

### ⚠️ Mobile Limitations

| Limitation | Details |
|------------|---------|
| **Panel position** | The floating MAKShield panel may overlap UI elements on small screens. It can be minimized by tapping the logo. |
| **Keyboard interaction** | `Enter` key interception may not work on mobile virtual keyboards. Use the send button instead. |
| **Performance** | PBKDF2 with 600K iterations is slower on mobile CPUs. First encryption/decryption for a chat may take 1-3 seconds. |
| **Firefox only** | Chrome for Android does **not** support extensions. Only Firefox for Android (Fenix 120+) works. |
| **Temporary add-ons** | Temporary extensions are removed when Firefox closes. Use ADB or custom collection for persistence. |
| **VK mobile web** | `m.vk.com` is fully supported with dedicated selectors. VK app redirects are not supported — use browser. Enable "Desktop site" mode if `m.vk.com` layout breaks. |
| **Touch events** | Some hover-based interactions (tooltips, button effects) may be less responsive on touch. |
| **Textarea editor** | VK Mobile uses `<textarea>` instead of contenteditable. Text insertion method differs automatically. |

### Selector Configuration

MAKShield uses CSS selectors to find chat elements (message bubbles, editor, send button). These are defined in `selectors.json` and can be customized per service:

1. Click **⚙️** in the MAKShield panel
2. Edit the selectors for the current service
3. Click **Save** — the page will reload with new selectors
4. Click **Reset** to restore defaults

Default selectors are stored in `selectors.json`. User overrides are saved in browser storage.

### Disguise Presets

Messages can be disguised as:

**🔗 URL Links (23 presets):**
Wildberries, Ozon, AliExpress, YouTube, VK, VK Clip, VK Music, Google Docs, Amazon, GitHub, Telegram, Reddit, Twitter/X, Yandex Market, Avito, Instagram, TikTok, Spotify, Notion, Discord, Steam, LinkedIn, Dropbox

**☠️ Crash Logs (13 presets):**
Java, Python, JavaScript, Rust, Go, C#, Kotlin, Swift, PHP, Ruby, Scala, Elixir, Full Java Stack (×3)

**📋 System Logs (23 presets):**
Nginx, Docker, Kernel, Android, Git, SQL, SSL, Webpack, Kubernetes, Systemd, AWS CloudWatch, Elasticsearch, PostgreSQL, Redis, Apache, MongoDB, GraphQL, Terraform, Ansible, Jenkins, Prometheus, Sentry, Distributed Trace (×4), Microservices Log (×4)

**📄 Other (9 presets):**
Hex Dump, Base64 Block, JWT Token, Network Packet (×2), Core Dump (×2), Debug Session (×3), API Request Log (×4), Security Audit (×4), Test Failure (×3)

---

## 🇷🇺 Русский

### Обзор

MAKShield — расширение браузера, добавляющее сквозное шифрование в веб-клиенты **MAX Messenger** (`web.max.ru`) и **ВКонтакте** (`vk.com`, `vk.ru`). Всё шифрование происходит локально — никакие данные не отправляются на внешние серверы.

### Возможности

- 🔐 **AES-256-GCM** — Аутентифицированное шифрование через Web Crypto API
- 🔑 **PBKDF2** — 600 000 итераций (рекомендация OWASP 2023)
- 🔗 **HKDF** — Доменно-разделённая деривация ключей
- 🔄 **ECDH P-384** — Автоматический обмен ключами (192-бит безопасности)
- 💬 **Ключи по чатам** — Разные ключи для разных бесед
- 🎭 **Маскировка** — Зашифрованные данные скрыты в URL, crash-логах, системных логах
- ⚙️ **Настройка селекторов** — CSS-селекторы редактируются через UI
- 🌐 **Мульти-сервис** — MAX и VK с конфигурацией для каждого
- 📱 **Firefox Mobile** — Работает на Firefox для Android

### Установка

#### Firefox Десктоп

**Временная установка (разработка):**
1. Скачайте / клонируйте репозиторий
2. Откройте `about:debugging#/runtime/this-firefox`
3. Нажмите **«Загрузить временное дополнение»**
4. Выберите `manifest.json` из папки расширения

**Постоянная установка (без подписи):**
1. Откройте `about:config`
2. Установите `xpinstall.signatures.required` в `false` *(доступно только в Firefox Developer Edition / Nightly)*
3. Запакуйте папку расширения в `.zip`, переименуйте в `.xpi`
4. Откройте `about:addons` → ⚙️ → **«Установить дополнение из файла»**
5. Выберите `.xpi` файл

#### Установка на Android (Мобильные браузеры)

Так как мобильные браузеры ограничивают установку локальных расширений, вот два рабочих способа загрузить код с GitHub прямо на телефон:

**Способ 1: Kiwi Browser (Рекомендуемый, самый простой)**
Kiwi Browser — это браузер на базе Chromium для Android с полноценной поддержкой расширений ПК и установкой напрямую из ZIP-архивов.
1. Скачайте код репозитория (папку `makshield`) на телефон или ПК.
2. Запакуйте всё содержимое папки (так, чтобы `manifest.json` лежал в корне архива) в файл `.zip`.
3. Установите **Kiwi Browser** из Google Play.
4. В браузере откройте меню (три точки) → **Расширения** (Extensions).
5. Включите переключатель **«Режим разработчика»** (Developer mode).
6. Нажмите кнопку **«+ (from .zip/.crx/.user.js)»**.
7. Выберите ваш созданный `.zip` архив в файлах телефона. MAKShield установлен!

**Способ 2: Firefox Nightly для Android**
Обычный Firefox для Android запрещает сторонние расширения. Чтобы поставить локальное расширение, нужна версия Nightly для разработчиков.
1. Установите **Firefox Nightly for Developers** из Google Play.
2. Запакуйте код в `.zip` и переименуйте файл в `makshield.xpi` (как для ПК). Перенесите файл на телефон.
3. В браузере зайдите в **Настройки** → **О Firefox Nightly**.
4. Быстро **нажмите 5 раз на логотип Firefox**. Появится скрытое меню отладки (сообщение "Debug menu enabled").
5. Вернитесь назад в **Настройки** → меню **Секретные настройки** (Secret Settings) — включите там возможность устанавливать сторонние дополнения (если требуется).
6. Зайдите в **about:config** в строке поиска, найдите `xpinstall.signatures.required` и переключите на `false`.
7. Вернитесь в **Настройки**, прокрутите вниз и нажмите **«Установить дополнение из файла»** (Install add-on from file).
8. Выберите созданный `makshield.xpi`.

> ⚠️ **Для всех Firefox-браузеров на Android требуются версии 120+ (Fenix)**

**Способ 3: Через коллекцию дополнений (Сложный)**
1. Если вы разработчик, зарегистрируйте расширение на [addons.mozilla.org](https://addons.mozilla.org/ru/firefox/).
2. Создайте свою «Коллекцию» и добавьте туда загруженное расширение MAKShield.
3. В Firefox Mobile (120+) перейдите в **Настройки** → **О Firefox**.
4. Нажмите 5 раз на логотип, чтобы включить режим разработчика.
5. Вернитесь назад, перейдите в **Секретные настройки** → **Пользовательская коллекция дополнений**.
6. Введите ID вашего аккаунта Mozilla и название созданной коллекции. Перезапустите Firefox.

**Способ 4: Временная отладка по USB (ADB)**
1. Включите **отладку по USB** в настройках разработчика на вашем Android-устройстве.
2. Подключите устройство к ПК и откройте `about:debugging` в **десктопном** Firefox на ПК.
3. В меню слева выберите ваш телефон, нажмите **«Подключиться»**.
4. В списке расширений устройства нажмите **«Загрузить временное дополнение»** и выберите `manifest.json` с ПК.

#### Chrome / Chromium

1. Скачайте / клонируйте репозиторий
2. Откройте `chrome://extensions`
3. Включите **«Режим разработчика»** (переключатель сверху-справа)
4. Нажмите **«Загрузить распакованное»**
5. Выберите папку расширения

### Как это работает

#### Ручной режим (Пароль)
1. Откройте чат в MAX или VK
2. Нажмите **KEY** → вкладка **«Ручной»**
3. Введите пароль и нажмите **Сохранить**
4. Поделитесь паролем через отдельный безопасный канал
5. Пишите и отправляйте — сообщения шифруются и маскируются автоматически

#### Авто режим (ECDH обмен ключами)
1. Нажмите **KEY** → вкладка **«Авто (ECDH)»**
2. Нажмите **«Отправить публичный ключ»** — P-384 ключ отправится замаскированным
3. Дождитесь ключа от собеседника
4. После обмена ключами **шифрование активируется автоматически**
5. **Сверьте fingerprint-ы** для защиты от MITM-атак

### Технические детали

| Функция | Реализация |
|---------|------------|
| Шифрование | AES-256-GCM (аутентифицированное) |
| Деривация ключей | PBKDF2-SHA256 (600 000 итераций) |
| Расширение ключей | HKDF-SHA256 (доменное разделение) |
| Обмен ключами | ECDH P-384 (secp384r1, 192-бит безопасности) |
| Соль | Случайные 32 байта на сообщение |
| IV | Случайные 12 байт на сообщение |
| Payload | формат v3 (JSON → Base64URL → URI-encoded) |
| API | Web Crypto API (SubtleCrypto) |

### Разрешения

| Разрешение | Причина |
|------------|--------|
| `storage` | Хранение ключей шифрования локально |
| `https://web.max.ru/*` | Доступ к MAX Messenger |
| `https://vk.com/*`, `https://vk.ru/*` | Доступ к ВКонтакте (десктоп) |
| `https://m.vk.com/*`, `https://m.vk.ru/*` | Доступ к ВКонтакте (мобильный веб) |

### ⚠️ Ограничения на мобильных устройствах

| Ограничение | Подробности |
|-------------|-------------|
| **Положение панели** | Плавающая панель MAKShield может перекрывать элементы интерфейса на маленьких экранах. Сверните её нажатием на логотип. |
| **Клавиатура** | Перехват клавиши `Enter` может не работать с виртуальной клавиатурой. Используйте кнопку отправки. |
| **Производительность** | PBKDF2 с 600K итерациями медленнее на мобильных CPU. Первое шифрование может занять 1-3 секунды. |
| **Только Firefox** | Chrome для Android **не** поддерживает расширения. Работает только Firefox для Android (Fenix 120+). |
| **Временные дополнения** | Временные расширения удаляются при закрытии Firefox. Используйте ADB или коллекцию для постоянной установки. |
| **VK мобильный** | `m.vk.com` полностью поддерживается с отдельными селекторами. Перенаправления в приложение VK не поддерживаются — используйте браузер. Включите «Версия для ПК» если `m.vk.com` ломается. |
| **Сенсорные события** | Некоторые hover-эффекты (подсказки, анимации кнопок) менее отзывчивы на сенсоре. |
| **Textarea редактор** | VK Mobile использует `<textarea>` вместо contenteditable. Метод вставки текста переключается автоматически. |

### Настройка селекторов

MAKShield использует CSS-селекторы для поиска элементов чата. Они определены в `selectors.json` и настраиваются для каждого сервиса:

1. Нажмите **⚙️** в панели MAKShield
2. Отредактируйте селекторы для текущего сервиса
3. Нажмите **Сохранить** — страница перезагрузится с новыми селекторами
4. Нажмите **Сбросить** для восстановления значений по умолчанию

### Конфиденциальность

- ✅ **БЕЗ сбора данных** — расширение не собирает и не передаёт данные
- ✅ **БЕЗ аналитики** — никакого отслеживания
- ✅ **БЕЗ сетевых запросов** — работает полностью оффлайн
- ✅ **Только локальное хранилище** — ключи в `chrome.storage.local`
- ✅ **Открытый исходный код** — весь код читаем и проверяем

### Лицензия

MIT License — Бесплатно для личного и коммерческого использования.

### Автор

Создано **ms0ur**
