# Privacy Policy / Политика конфиденциальности

**Last updated / Последнее обновление: December 2025**

---

## 🇬🇧 English

### Data Collection Statement

**MAKShield does NOT collect, transmit, or share any user data.**

This extension operates entirely locally within your browser. No data is ever sent to external servers, third parties, or the extension developer.

### What This Extension Does

MAKShield provides end-to-end encryption for messages in MAX Messenger web client. It:

1. **Intercepts** messages you type before sending
2. **Encrypts** them locally using AES-256-GCM
3. **Disguises** the encrypted data as URLs or log entries
4. **Decrypts** incoming messages that match known patterns

### Data Stored Locally

The following data is stored **only in your browser** using `browser.storage.local`:

| Data | Purpose | Shared? |
|------|---------|---------|
| Encryption keys (per chat) | Decrypt messages in that chat | ❌ Never |
| ECDH key pairs | Automatic key exchange with contacts | ❌ Never |
| Key mode setting | Remember manual/auto mode preference | ❌ Never |
| Selected disguise preset | Remember your disguise preference | ❌ Never |
| Custom templates | Store user-created disguises | ❌ Never |

### Data NOT Collected

- ❌ Message content (encrypted or decrypted)
- ❌ Chat history
- ❌ Contact lists
- ❌ Personal information
- ❌ Browser history
- ❌ Usage statistics
- ❌ Error reports
- ❌ Analytics or telemetry
- ❌ IP addresses
- ❌ Device information

### Network Activity

**This extension makes ZERO network requests.**

All functionality is performed locally using:
- Browser's Web Crypto API for encryption
- Browser's Storage API for key storage
- DOM manipulation for UI

### Third-Party Services

This extension does not integrate with or send data to any third-party services.

### Open Source

All source code is available for inspection at:
https://github.com/ms0ur/MAKShield

### Contact

For privacy concerns, contact: [Create an issue on GitHub]

---

## 🇷🇺 Русский

### Заявление о сборе данных

**MAKShield НЕ собирает, НЕ передаёт и НЕ распространяет никакие пользовательские данные.**

Это расширение работает полностью локально в вашем браузере. Никакие данные никогда не отправляются на внешние серверы, третьим лицам или разработчику расширения.

### Что делает это расширение

MAKShield обеспечивает сквозное шифрование сообщений в веб-клиенте MAX Messenger. Оно:

1. **Перехватывает** сообщения, которые вы набираете, перед отправкой
2. **Шифрует** их локально с использованием AES-256-GCM
3. **Маскирует** зашифрованные данные под URL или записи логов
4. **Расшифровывает** входящие сообщения, соответствующие известным шаблонам

### Данные, хранящиеся локально

Следующие данные хранятся **только в вашем браузере** через `browser.storage.local`:

| Данные | Назначение | Передаются? |
|--------|------------|-------------|
| Ключи шифрования (по чатам) | Расшифровка сообщений в этом чате | ❌ Никогда |
| ECDH ключевые пары | Автоматический обмен ключами | ❌ Никогда |
| Настройка режима ключей | Запомнить режим (ручной/авто) | ❌ Никогда |
| Выбранный пресет маскировки | Запомнить ваш выбор | ❌ Никогда |
| Пользовательские шаблоны | Хранение созданных маскировок | ❌ Никогда |

### Данные, которые НЕ собираются

- ❌ Содержимое сообщений (зашифрованных или расшифрованных)
- ❌ История чатов
- ❌ Списки контактов
- ❌ Личная информация
- ❌ История браузера
- ❌ Статистика использования
- ❌ Отчёты об ошибках
- ❌ Аналитика или телеметрия
- ❌ IP-адреса
- ❌ Информация об устройстве

### Сетевая активность

**Это расширение НЕ делает НИКАКИХ сетевых запросов.**

Вся функциональность выполняется локально с использованием:
- Web Crypto API браузера для шифрования
- Storage API браузера для хранения ключей
- Манипуляции DOM для интерфейса

### Сторонние сервисы

Это расширение не интегрируется и не отправляет данные никаким сторонним сервисам.

### Открытый исходный код

Весь исходный код доступен для проверки по адресу:
https://github.com/ms0ur/MAKShield

### Контакт

По вопросам конфиденциальности: [Создайте issue на GitHub]

