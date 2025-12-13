const SpoofPresets = {
    wildberries: {
        name: 'Wildberries',
        template: 'https://www.wildberries.ru/catalog/{RND}/detail.aspx?targetUrl=XS&utm_campaign={DATA}',
        detect: ['wildberries.ru', 'utm_campaign='],
        param: 'utm_campaign'
    },
    ozon: {
        name: 'Ozon',
        template: 'https://www.ozon.ru/product/{RND}/?utm_content={DATA}',
        detect: ['ozon.ru', 'utm_content='],
        param: 'utm_content'
    },
    aliexpress: {
        name: 'AliExpress',
        template: 'https://aliexpress.ru/item/{RND}.html?sku_id={DATA}',
        detect: ['aliexpress.ru', 'sku_id='],
        param: 'sku_id'
    },
    youtube: {
        name: 'YouTube',
        template: 'https://www.youtube.com/watch?v={RND}&list={DATA}',
        detect: ['youtube.com', 'list='],
        param: 'list'
    },
    vk: {
        name: 'VK',
        template: 'https://vk.com/wall{RND}?reply={DATA}',
        detect: ['vk.com', 'reply='],
        param: 'reply'
    },
    google: {
        name: 'Google Docs',
        template: 'https://docs.google.com/document/d/{RND}/edit?usp={DATA}',
        detect: ['docs.google.com', 'usp='],
        param: 'usp'
    },
    crashlog_java: {
        name: '☠️ Java Crash',
        type: 'text',
        template: `java.lang.NullPointerException: Cannot invoke method on null object
    at com.app.core.Engine.process(Engine.java:{RND})
    at com.app.handlers.Request.handle(Request.java:284)
    at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
Caused by: java.lang.IllegalStateException: {DATA}
    at com.app.utils.Parser.decode(Parser.java:89)
    ... 47 more`,
        detect: ['java.lang.NullPointerException', 'Caused by:'],
        extract: /Caused by: java\.lang\.\w+: ([^\n]+)/
    },
    crashlog_python: {
        name: '🐍 Python Traceback',
        type: 'text',
        template: `Traceback (most recent call last):
  File "/app/main.py", line {RND}, in <module>
    result = process_data(payload)
  File "/app/handlers/core.py", line 142, in process_data
    return decoder.parse(raw_input)
  File "/app/utils/decoder.py", line 67, in parse
    raise ValueError("{DATA}")
ValueError: {DATA}`,
        detect: ['Traceback (most recent call last):', 'ValueError:'],
        extract: /ValueError: ([^\n]+)$/
    },
    crashlog_js: {
        name: '🟨 JS Error',
        type: 'text',
        template: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at Object.processData (bundle.js:{RND}:42)
    at async fetchHandler (api.js:89:12)
    at async main (index.js:23:5)
Error context: {DATA}`,
        detect: ['Uncaught TypeError:', 'Error context:'],
        extract: /Error context: (.+)$/
    },
    crashlog_rust: {
        name: '🦀 Rust Panic',
        type: 'text',
        template: `thread 'main' panicked at src/parser.rs:{RND}:13:
called \`Result::unwrap()\` on an \`Err\` value: ParseError("{DATA}")
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace
stack backtrace:
   0: rust_begin_unwind
   1: core::panicking::panic_fmt
   2: core::result::unwrap_failed`,
        detect: ["thread 'main' panicked", 'ParseError('],
        extract: /ParseError\("([^"]+)"\)/
    },
    log_nginx: {
        name: '📋 Nginx Log',
        type: 'text',
        template: `192.168.1.{RND} - - [13/Dec/2025:14:32:18 +0300] "GET /api/v2/data?token={DATA} HTTP/1.1" 502 574 "-" "Mozilla/5.0"`,
        detect: ['HTTP/1.1"', '/api/v2/data?token='],
        extract: /token=([^\s&]+)/
    },
    log_docker: {
        name: '🐳 Docker Log',
        type: 'text',
        template: `2025-12-13T14:32:{RND}Z container_app | ERROR | Connection refused to database
2025-12-13T14:32:{RND}Z container_app | DEBUG | Retry payload: {DATA}
2025-12-13T14:32:{RND}Z container_app | INFO  | Attempting reconnection...`,
        detect: ['container_app |', 'Retry payload:'],
        extract: /Retry payload: (.+)$/m
    },
    log_kernel: {
        name: '🐧 Kernel Panic',
        type: 'text',
        template: `[  142.{RND}] Kernel panic - not syncing: VFS: Unable to mount root fs
[  142.{RND}] CPU: 0 PID: 1 Comm: swapper/0 Tainted: G
[  142.{RND}] Hardware name: QEMU Standard PC
[  142.{RND}] Call Trace: {DATA}
[  142.{RND}]  dump_stack+0x6d/0x88
[  142.{RND}]  panic+0x101/0x2e0`,
        detect: ['Kernel panic', 'Call Trace:'],
        extract: /Call Trace: (.+)$/m
    },
    log_android: {
        name: '📱 Android Logcat',
        type: 'text',
        template: `12-13 14:32:18.{RND} E/AndroidRuntime(8294): FATAL EXCEPTION: main
12-13 14:32:18.{RND} E/AndroidRuntime(8294): Process: com.app.messenger, PID: 8294
12-13 14:32:18.{RND} E/AndroidRuntime(8294): java.lang.RuntimeException: {DATA}
12-13 14:32:18.{RND} E/AndroidRuntime(8294):    at android.app.ActivityThread.main(ActivityThread.java:7356)`,
        detect: ['E/AndroidRuntime', 'FATAL EXCEPTION'],
        extract: /RuntimeException: (.+)$/m
    },
    log_git: {
        name: '📦 Git Error',
        type: 'text',
        template: `fatal: bad object {RND}abc{RND}def
error: failed to push some refs to 'origin/main'
hint: Updates were rejected because the remote contains work
hint: that you do not have locally. Merge conflict in: {DATA}`,
        detect: ['fatal: bad object', 'Merge conflict in:'],
        extract: /Merge conflict in: (.+)$/
    },
    log_sql: {
        name: '🗄️ SQL Error',
        type: 'text',
        template: `ERROR 1064 (42000) at line {RND}: You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server version
for the right syntax to use near '{DATA}' at line 1`,
        detect: ['ERROR 1064', "syntax to use near"],
        extract: /near '([^']+)'/
    },
    log_ssl: {
        name: '🔐 SSL Error',
        type: 'text',
        template: `OpenSSL: error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed
Connection to server {RND}.api.internal:443 failed
Debug trace: {DATA}
Verify return code: 21 (unable to verify the first certificate)`,
        detect: ['SSL routines:', 'Debug trace:'],
        extract: /Debug trace: (.+)$/m
    },
    log_webpack: {
        name: '📦 Webpack Error',
        type: 'text',
        template: `ERROR in ./src/components/App.tsx {RND}:42
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: Unexpected token, expected "," (42:{RND})
Build hash: {DATA}
webpack compiled with 1 error`,
        detect: ['Module build failed', 'Build hash:'],
        extract: /Build hash: (.+)$/m
    }
};

