const SpoofPresets = {
    // ==================== URL PRESETS ====================
    wildberries: {
        name: 'Wildberries',
        template: 'https://www.wildberries.ru/catalog/{RND}/detail.aspx?targetUrl=XS&utm_campaign={DATA}',
        detect: ['wildberries.ru', 'utm_campaign='],
        param: 'utm_campaign',
        lengthCategory: 'medium', // short: <50, medium: 50-200, long: >200
        maxDataLength: 800,
        description: 'Маскировка под товар WB'
    },
    ozon: {
        name: 'Ozon',
        template: 'https://www.ozon.ru/product/{RND}/?utm_content={DATA}',
        detect: ['ozon.ru', 'utm_content='],
        param: 'utm_content',
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'Маскировка под товар Ozon'
    },
    aliexpress: {
        name: 'AliExpress',
        template: 'https://aliexpress.ru/item/{RND}.html?sku_id={DATA}',
        detect: ['aliexpress.ru', 'sku_id='],
        param: 'sku_id',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под товар AliExpress'
    },
    youtube: {
        name: 'YouTube',
        template: 'https://www.youtube.com/watch?v={RND}&list={DATA}',
        detect: ['youtube.com', 'list='],
        param: 'list',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под плейлист YouTube'
    },
    vk: {
        name: 'VK',
        template: 'https://vk.com/wall{RND}?reply={DATA}',
        detect: ['vk.com', 'reply='],
        param: 'reply',
        lengthCategory: 'short',
        maxDataLength: 500,
        description: 'Маскировка под комментарий VK'
    },
    google: {
        name: 'Google Docs',
        template: 'https://docs.google.com/document/d/{RND}/edit?usp={DATA}',
        detect: ['docs.google.com', 'usp='],
        param: 'usp',
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'Маскировка под Google документ'
    },
    amazon: {
        name: 'Amazon',
        template: 'https://www.amazon.com/dp/{RND}?ref_={DATA}',
        detect: ['amazon.com', 'ref_='],
        param: 'ref_=',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под товар Amazon'
    },
    github: {
        name: 'GitHub',
        template: 'https://github.com/user/repo/issues/{RND}#issuecomment-{DATA}',
        detect: ['github.com', 'issuecomment-'],
        param: 'issuecomment-',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под GitHub issue'
    },
    telegram: {
        name: 'Telegram',
        template: 'https://t.me/channel_{RND}?start={DATA}',
        detect: ['t.me', 'start='],
        param: 'start',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под Telegram ссылку'
    },
    reddit: {
        name: 'Reddit',
        template: 'https://www.reddit.com/r/sub/comments/{RND}/?utm_source={DATA}',
        detect: ['reddit.com', 'utm_source='],
        param: 'utm_source',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под Reddit пост'
    },
    twitter: {
        name: 'Twitter/X',
        template: 'https://x.com/user/status/{RND}?s={DATA}',
        detect: ['x.com', 's='],
        param: 's',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под Twitter пост'
    },
    yandex_market: {
        name: 'Яндекс.Маркет',
        template: 'https://market.yandex.ru/product/{RND}?sku={DATA}',
        detect: ['market.yandex.ru', 'sku='],
        param: 'sku',
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'Маскировка под товар Яндекс.Маркет'
    },
    avito: {
        name: 'Avito',
        template: 'https://www.avito.ru/moskva/bytovaya_elektronika/{RND}?context={DATA}',
        detect: ['avito.ru', 'context='],
        param: 'context',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под объявление Avito'
    },
    instagram: {
        name: 'Instagram',
        template: 'https://www.instagram.com/p/{RND}/?utm_source={DATA}',
        detect: ['instagram.com', 'utm_source='],
        param: 'utm_source',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под пост Instagram'
    },
    tiktok: {
        name: 'TikTok',
        template: 'https://www.tiktok.com/@user/video/{RND}?_t={DATA}',
        detect: ['tiktok.com', '_t='],
        param: '_t',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под видео TikTok'
    },
    spotify: {
        name: 'Spotify',
        template: 'https://open.spotify.com/track/{RND}?si={DATA}',
        detect: ['spotify.com', 'si='],
        param: 'si',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под трек Spotify'
    },
    notion: {
        name: 'Notion',
        template: 'https://www.notion.so/workspace/{RND}?pvs={DATA}',
        detect: ['notion.so', 'pvs='],
        param: 'pvs',
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'Маскировка под страницу Notion'
    },
    discord: {
        name: 'Discord',
        template: 'https://discord.com/channels/{RND}/{RND}/{RND}?token={DATA}',
        detect: ['discord.com', 'token='],
        param: 'token',
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Маскировка под сообщение Discord'
    },
    steam: {
        name: 'Steam',
        template: 'https://store.steampowered.com/app/{RND}/?snr={DATA}',
        detect: ['steampowered.com', 'snr='],
        param: 'snr',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под игру Steam'
    },
    linkedin: {
        name: 'LinkedIn',
        template: 'https://www.linkedin.com/posts/{RND}?utm_campaign={DATA}',
        detect: ['linkedin.com', 'utm_campaign='],
        param: 'utm_campaign',
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'Маскировка под пост LinkedIn'
    },
    dropbox: {
        name: 'Dropbox',
        template: 'https://www.dropbox.com/s/{RND}/file?dl=0&st={DATA}',
        detect: ['dropbox.com', 'st='],
        param: 'st',
        lengthCategory: 'medium',
        maxDataLength: 500,
        description: 'Маскировка под файл Dropbox'
    },

    // ==================== CRASH LOG PRESETS ====================
    crashlog_java: {
        name: '☠️ Java Crash',
        type: 'text',
        multipart: true,
        template: `java.lang.NullPointerException: Cannot invoke method on null object
    at com.app.core.Engine.process(Engine.java:{RND})
    at com.app.handlers.Request.handle(Request.java:284)
    at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
Caused by: java.lang.IllegalStateException: {DATA_1}
    at com.app.utils.Parser.decode(Parser.java:89)
    at com.app.security.Validator.verify(Validator.java:{RND})
Suppressed: java.lang.RuntimeException: Context: {DATA_2}
    at com.app.logging.ErrorHandler.wrap(ErrorHandler.java:45)
    ... 47 more`,
        detect: ['java.lang.NullPointerException', 'Caused by:'],
        extract: /Caused by: java\.lang\.\w+: ([^\n]+)/,
        extractMulti: [
            /IllegalStateException: ([^\n]+)/,
            /Context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1500,
        description: 'Java stack trace с разделением данных'
    },
    crashlog_python: {
        name: '🐍 Python Traceback',
        type: 'text',
        multipart: true,
        template: `Traceback (most recent call last):
  File "/app/main.py", line {RND}, in <module>
    result = process_data(payload)
  File "/app/handlers/core.py", line 142, in process_data
    return decoder.parse(raw_input)
  File "/app/utils/decoder.py", line 67, in parse
    decoded = base64.b64decode(data)
binascii.Error: Invalid padding: {DATA_1}

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/app/error_handler.py", line 23, in handle
    logger.error(msg="Processing failed")
RuntimeError: context={DATA_2}`,
        detect: ['Traceback (most recent call last):', 'binascii.Error:'],
        extractMulti: [
            /Invalid padding: ([^\n]+)/,
            /context=([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1500,
        description: 'Python traceback с цепочкой исключений'
    },
    crashlog_js: {
        name: '🟨 JS Error',
        type: 'text',
        multipart: true,
        template: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at Object.processData (bundle.js:{RND}:42)
    at async fetchHandler (api.js:89:12)
    at async main (index.js:23:5)

Error context: {DATA_1}

Additional info from error boundary:
{
  "componentStack": "at DataGrid (webpack:///./src/components/DataGrid.tsx:{RND}:1)",
  "errorMessage": "{DATA_2}",
  "timestamp": "{RND}"
}`,
        detect: ['Uncaught TypeError:', 'Error context:'],
        extractMulti: [
            /Error context: ([^\n]+)/,
            /"errorMessage": "([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'JavaScript ошибка с контекстом'
    },
    crashlog_rust: {
        name: '🦀 Rust Panic',
        type: 'text',
        multipart: true,
        template: `thread 'main' panicked at src/parser.rs:{RND}:13:
called \`Result::unwrap()\` on an \`Err\` value: ParseError("{DATA_1}")
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace
stack backtrace:
   0: rust_begin_unwind
   1: core::panicking::panic_fmt
   2: core::result::unwrap_failed
   3: app::parser::decode_input
             at ./src/parser.rs:{RND}
   4: app::main::process_request
             debug_context: "{DATA_2}"
             at ./src/main.rs:89`,
        detect: ["thread 'main' panicked", 'ParseError('],
        extractMulti: [
            /ParseError\("([^"]+)"\)/,
            /debug_context: "([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Rust panic с debug context'
    },
    crashlog_go: {
        name: '🐹 Go Panic',
        type: 'text',
        multipart: true,
        template: `panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x{RND}]

goroutine 1 [running]:
main.processRequest(0x{RND}, 0x{RND})
        /app/handlers/request.go:142 +0x{RND}
main.main()
        /app/main.go:67 +0x{RND}

Error context: {DATA_1}
Request ID: {RND}-{RND}-{RND}
Payload hash: {DATA_2}`,
        detect: ['panic: runtime error', 'goroutine'],
        extractMulti: [
            /Error context: ([^\n]+)/,
            /Payload hash: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Go panic с контекстом'
    },
    crashlog_csharp: {
        name: '🔷 C# Exception',
        type: 'text',
        multipart: true,
        template: `Unhandled Exception: System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Services.DataProcessor.Process(String input) in C:\\Projects\\MyApp\\Services\\DataProcessor.cs:line {RND}
   at MyApp.Controllers.ApiController.HandleRequest(HttpContext ctx) in C:\\Projects\\MyApp\\Controllers\\ApiController.cs:line 89
   ---> System.ArgumentException: {DATA_1}
   at MyApp.Utils.Validator.Validate(Object obj) in C:\\Projects\\MyApp\\Utils\\Validator.cs:line {RND}
   --- End of inner exception stack trace ---

Application Log:
[ERROR] {RND}-12-13 14:32:18.{RND} | Correlation-ID: {DATA_2}
[ERROR] Request processing failed`,
        detect: ['System.NullReferenceException', 'System.ArgumentException'],
        extractMulti: [
            /System\.ArgumentException: ([^\n]+)/,
            /Correlation-ID: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1500,
        description: 'C# exception stack trace'
    },
    crashlog_kotlin: {
        name: '🟣 Kotlin Crash',
        type: 'text',
        multipart: true,
        template: `Exception in thread "main" kotlin.KotlinNullPointerException
	at com.app.services.UserService.processRequest(UserService.kt:{RND})
	at com.app.api.ApiHandler.handle(ApiHandler.kt:67)
	at io.ktor.server.netty.NettyApplicationCallHandler.handleRequest(NettyApplicationCallHandler.kt:{RND})
Caused by: java.lang.IllegalArgumentException: {DATA_1}
	at com.app.utils.Decoder.decode(Decoder.kt:42)
	at com.app.services.UserService.parseInput(UserService.kt:{RND})
Debug payload: {DATA_2}
	... 15 more`,
        detect: ['kotlin.KotlinNullPointerException', 'Caused by:'],
        extractMulti: [
            /IllegalArgumentException: ([^\n]+)/,
            /Debug payload: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Kotlin exception с payload'
    },
    crashlog_swift: {
        name: '🍎 Swift Crash',
        type: 'text',
        multipart: true,
        template: `*** Terminating app due to uncaught exception 'NSInternalInconsistencyException'
*** First throw call stack:
(0x{RND} 0x{RND} 0x{RND} 0x{RND})
libc++abi.dylib: terminating with uncaught exception of type NSException
Application Specific Information:
abort() called
Payload: {DATA_1}
Thread 0 Crashed:
0   libsystem_kernel.dylib  0x{RND} __pthread_kill + 8
1   CoreFoundation          0x{RND} -[NSObject(NSObject) release] + {RND}
Debug context: {DATA_2}`,
        detect: ['Terminating app', 'NSInternalInconsistencyException'],
        extractMulti: [
            /Payload: ([^\n]+)/,
            /Debug context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'iOS/macOS Swift crash'
    },
    crashlog_php: {
        name: '🐘 PHP Fatal',
        type: 'text',
        multipart: true,
        template: `[14-Dec-2025 14:32:{RND} UTC] PHP Fatal error:  Uncaught Exception in /var/www/app/src/Services/Handler.php:{RND}
Stack trace:
#0 /var/www/app/src/Controllers/ApiController.php(89): App\\Services\\Handler->process()
#1 /var/www/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php({RND}): App\\Controllers\\ApiController->handle()
#2 {main}
Exception message: {DATA_1}

Additional context:
Request ID: {RND}-{RND}-{RND}
Debug data: {DATA_2}`,
        detect: ['PHP Fatal error', 'Exception message:'],
        extractMulti: [
            /Exception message: ([^\n]+)/,
            /Debug data: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1300,
        description: 'PHP fatal error с контекстом'
    },
    crashlog_ruby: {
        name: '💎 Ruby Exception',
        type: 'text',
        multipart: true,
        template: `/app/lib/processor.rb:{RND}:in \`process': RuntimeError
	from /app/lib/handler.rb:42:in \`handle'
	from /app/controllers/api_controller.rb:89:in \`create'
	from /usr/local/bundle/gems/actionpack-7.0.0/lib/action_controller/metal/basic_implicit_render.rb:{RND}:in \`send_action'
Error payload: {DATA_1}
Context hash: {DATA_2}
Backtrace: 15 levels`,
        detect: ['RuntimeError', 'Error payload:'],
        extractMulti: [
            /Error payload: ([^\n]+)/,
            /Context hash: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Ruby on Rails exception'
    },
    crashlog_scala: {
        name: '⚡ Scala Exception',
        type: 'text',
        multipart: true,
        template: `[error] Exception in thread "main" java.util.NoSuchElementException: {DATA_1}
[error]   at scala.collection.immutable.Map$Map1.apply(Map.scala:{RND})
[error]   at app.services.DataProcessor.process(DataProcessor.scala:42)
[error]   at app.http.routes.ApiRoutes.$anonfun$routes$1(ApiRoutes.scala:{RND})
[error]   at akka.http.scaladsl.server.directives.BasicDirectives.$anonfun$mapRequestContext$2(BasicDirectives.scala:{RND})
[error] Correlation ID: {DATA_2}
[error] --- End of stack trace ---`,
        detect: ['NoSuchElementException', 'akka.http'],
        extractMulti: [
            /NoSuchElementException: ([^\n]+)/,
            /Correlation ID: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'Scala/Akka exception trace'
    },
    crashlog_elixir: {
        name: '💧 Elixir Crash',
        type: 'text',
        multipart: true,
        template: `** (exit) exited in: GenServer.call(MyApp.Worker, {:process, "{DATA_1}"}, 5000)
** (EXIT) time out
    (elixir {RND}) lib/gen_server.ex:{RND}: GenServer.call/3
    (my_app {RND}) lib/my_app/services/processor.ex:42: MyApp.Services.Processor.handle/1
    (my_app {RND}) lib/my_app_web/controllers/api_controller.ex:89: MyAppWeb.ApiController.create/2
Request context: {DATA_2}
Process info: <0.{RND}.0>`,
        detect: ['GenServer.call', '** (exit)'],
        extractMulti: [
            /\{:process, "([^"]+)"\}/,
            /Request context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'Elixir/Phoenix GenServer crash'
    },

    // ==================== SYSTEM LOG PRESETS ====================
    log_nginx: {
        name: '📋 Nginx Log',
        type: 'text',
        multipart: true,
        template: `192.168.1.{RND} - - [13/Dec/2025:14:32:18 +0300] "GET /api/v2/data?token={DATA_1} HTTP/1.1" 502 574 "-" "Mozilla/5.0"
192.168.1.{RND} - - [13/Dec/2025:14:32:19 +0300] "POST /api/v2/auth HTTP/1.1" 401 128 "session={DATA_2}" "Mozilla/5.0"
192.168.1.{RND} - - [13/Dec/2025:14:32:20 +0300] "GET /health HTTP/1.1" 200 15 "-" "kube-probe/1.28"`,
        detect: ['HTTP/1.1"', '/api/v2/'],
        extractMulti: [
            /token=([^\s&"]+)/,
            /session=([^\s&"]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 800,
        description: 'Nginx access logs'
    },
    log_docker: {
        name: '🐳 Docker Log',
        type: 'text',
        multipart: true,
        template: `2025-12-13T14:32:{RND}Z container_app | ERROR | Connection refused to database
2025-12-13T14:32:{RND}Z container_app | DEBUG | Retry payload: {DATA_1}
2025-12-13T14:32:{RND}Z container_app | WARN  | Circuit breaker triggered
2025-12-13T14:32:{RND}Z container_app | DEBUG | Fallback response: {DATA_2}
2025-12-13T14:32:{RND}Z container_app | INFO  | Attempting reconnection...`,
        detect: ['container_app |', 'Retry payload:'],
        extractMulti: [
            /Retry payload: ([^\n]+)/,
            /Fallback response: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 1000,
        description: 'Docker container logs'
    },
    log_kernel: {
        name: '🐧 Kernel Panic',
        type: 'text',
        multipart: true,
        template: `[  142.{RND}] Kernel panic - not syncing: VFS: Unable to mount root fs
[  142.{RND}] CPU: 0 PID: 1 Comm: swapper/0 Tainted: G
[  142.{RND}] Hardware name: QEMU Standard PC
[  142.{RND}] Call Trace: {DATA_1}
[  142.{RND}]  dump_stack+0x6d/0x88
[  142.{RND}]  panic+0x101/0x2e0
[  142.{RND}]  mount_block_root+0x{RND}/0x{RND}
[  142.{RND}] Debug info: {DATA_2}
[  142.{RND}]  prepare_namespace+0x13e/0x170`,
        detect: ['Kernel panic', 'Call Trace:'],
        extractMulti: [
            /Call Trace: ([^\n]+)/,
            /Debug info: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1000,
        description: 'Linux kernel panic log'
    },
    log_android: {
        name: '📱 Android Logcat',
        type: 'text',
        multipart: true,
        template: `12-13 14:32:18.{RND} E/AndroidRuntime(8294): FATAL EXCEPTION: main
12-13 14:32:18.{RND} E/AndroidRuntime(8294): Process: com.app.messenger, PID: 8294
12-13 14:32:18.{RND} E/AndroidRuntime(8294): java.lang.RuntimeException: {DATA_1}
12-13 14:32:18.{RND} E/AndroidRuntime(8294):    at android.app.ActivityThread.main(ActivityThread.java:7356)
12-13 14:32:18.{RND} E/AndroidRuntime(8294):    at java.lang.reflect.Method.invoke(Native Method)
12-13 14:32:18.{RND} D/CrashReporter(8294): Uploading crash data: {DATA_2}`,
        detect: ['E/AndroidRuntime', 'FATAL EXCEPTION'],
        extractMulti: [
            /RuntimeException: ([^\n]+)/,
            /Uploading crash data: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Android logcat crash'
    },
    log_git: {
        name: '📦 Git Error',
        type: 'text',
        multipart: true,
        template: `fatal: bad object refs/heads/main
error: failed to push some refs to 'origin/main'
hint: Updates were rejected because the remote contains work
hint: that you do not have locally.
Object hash: {DATA_1}
hint: See 'git pull ...' before pushing again.
Conflict data: {DATA_2}
hint: See the 'Note about fast-forwards' in 'git push --help' for details.`,
        detect: ['fatal: bad object', 'Object hash:'],
        extractMulti: [
            /Object hash: ([^\n]+)/,
            /Conflict data: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 800,
        description: 'Git push error'
    },
    log_sql: {
        name: '🗄️ SQL Error',
        type: 'text',
        multipart: true,
        template: `ERROR 1064 (42000) at line {RND}: You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server version
for the right syntax to use near '{DATA_1}' at line 1

Query context:
  Database: app_production
  User: app_user@{RND}.{RND}.{RND}.{RND}
  Query hash: {DATA_2}
  Execution time: {RND}ms`,
        detect: ['ERROR 1064', "syntax to use near"],
        extractMulti: [
            /near '([^']+)'/,
            /Query hash: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'MySQL syntax error'
    },
    log_ssl: {
        name: '🔐 SSL Error',
        type: 'text',
        multipart: true,
        template: `OpenSSL: error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed
Connection to server {RND}.api.internal:443 failed
Debug trace: {DATA_1}
Verify return code: 21 (unable to verify the first certificate)
Certificate chain:
  0: CN={RND}.api.internal, O=Internal
  1: CN=Internal CA, data={DATA_2}
SSL_CTX_set_verify: callback returned error`,
        detect: ['SSL routines:', 'Debug trace:'],
        extractMulti: [
            /Debug trace: ([^\n]+)/,
            /data=([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'OpenSSL certificate error'
    },
    log_webpack: {
        name: '📦 Webpack Error',
        type: 'text',
        multipart: true,
        template: `ERROR in ./src/components/App.tsx {RND}:42
Module build failed (from ./node_modules/babel-loader/lib/index.js):
ParseError: Unexpected token at position {RND}

> {RND} |   const payload = decode("{DATA_1}");
    |                              ^
  {RND} |   return render(payload);

Build hash: {DATA_2}
webpack 5.{RND}.0 compiled with 1 error in {RND}ms`,
        detect: ['ParseError: Unexpected token', 'const payload = decode'],
        extractMulti: [
            /decode\("([^"]+)"\)/,
            /Build hash: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 1000,
        description: 'Webpack build error'
    },
    log_kubernetes: {
        name: '☸️ Kubernetes Event',
        type: 'text',
        multipart: true,
        template: `Warning  FailedMount  {RND}s  kubelet  Unable to attach or mount volumes: timed out
  Pod: app-deployment-{RND}-xxxxx
  Namespace: production
  Node: node-{RND}.cluster.local
  Volume: secret-volume
  Error: secret "{DATA_1}" not found

Events from kube-system:
  Normal   Scheduled    {RND}s  default-scheduler  Successfully assigned
  Warning  Unhealthy    {RND}s  kubelet            Readiness probe failed: {DATA_2}`,
        detect: ['kubelet', 'FailedMount'],
        extractMulti: [
            /secret "([^"]+)" not found/,
            /probe failed: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Kubernetes pod events'
    },
    log_systemd: {
        name: '🔧 Systemd Journal',
        type: 'text',
        multipart: true,
        template: `Dec 13 14:32:{RND} server systemd[1]: Started Application Service.
Dec 13 14:32:{RND} server app[{RND}]: Initializing with config: {DATA_1}
Dec 13 14:32:{RND} server app[{RND}]: ERROR: Connection refused
Dec 13 14:32:{RND} server app[{RND}]: Retry context: {DATA_2}
Dec 13 14:32:{RND} server systemd[1]: app.service: Main process exited, code=exited, status=1/FAILURE
Dec 13 14:32:{RND} server systemd[1]: app.service: Failed with result 'exit-code'.`,
        detect: ['systemd[1]:', 'exited, code='],
        extractMulti: [
            /Initializing with config: ([^\n]+)/,
            /Retry context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 1000,
        description: 'Systemd service logs'
    },
    log_aws: {
        name: '☁️ AWS CloudWatch',
        type: 'text',
        multipart: true,
        template: `{
  "timestamp": "2025-12-13T14:32:{RND}Z",
  "level": "ERROR",
  "requestId": "{RND}-{RND}-{RND}-{RND}",
  "message": "Lambda execution failed",
  "errorType": "ValidationError",
  "errorMessage": "{DATA_1}",
  "stackTrace": [
    "at validateInput (/var/task/index.js:{RND}:15)",
    "at handler (/var/task/index.js:42:10)"
  ],
  "xrayTraceId": "{DATA_2}"
}`,
        detect: ['Lambda execution', 'errorMessage'],
        extractMulti: [
            /"errorMessage": "([^"]+)"/,
            /"xrayTraceId": "([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'AWS Lambda error log'
    },
    log_elasticsearch: {
        name: '🔍 Elasticsearch',
        type: 'text',
        multipart: true,
        template: `[2025-12-13T14:32:{RND}][ERROR][o.e.a.bulk] [node-{RND}] failed to execute bulk item
  index: app-logs-2025.12.13
  type: _doc
  document_id: {DATA_1}
  error: {
    "type": "mapper_parsing_exception",
    "reason": "failed to parse field [message]",
    "debug_info": "{DATA_2}"
  }`,
        detect: ['failed to execute bulk', 'mapper_parsing_exception'],
        extractMulti: [
            /document_id: ([^\n]+)/,
            /"debug_info": "([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1000,
        description: 'Elasticsearch indexing error'
    },
    log_postgres: {
        name: '🐘 PostgreSQL',
        type: 'text',
        multipart: true,
        template: `2025-12-13 14:32:{RND} UTC [pid={RND}] ERROR:  duplicate key value violates unique constraint "users_email_key"
2025-12-13 14:32:{RND} UTC [pid={RND}] DETAIL:  Key (email)=({DATA_1}) already exists.
2025-12-13 14:32:{RND} UTC [pid={RND}] STATEMENT:  INSERT INTO users (email, data) VALUES ($1, $2)
2025-12-13 14:32:{RND} UTC [pid={RND}] CONTEXT:  Transaction ID: {DATA_2}`,
        detect: ['duplicate key value', 'unique constraint'],
        extractMulti: [
            /Key \(email\)=\(([^)]+)\)/,
            /Transaction ID: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'PostgreSQL constraint error'
    },
    log_redis: {
        name: '🔴 Redis Error',
        type: 'text',
        multipart: true,
        template: `{RND}:M 13 Dec 2025 14:32:{RND}.{RND} # WARNING: Memory overcommit is disabled.
{RND}:M 13 Dec 2025 14:32:{RND}.{RND} * Ready to accept connections
{RND}:M 13 Dec 2025 14:32:{RND}.{RND} # ERROR: OOM command not allowed: {DATA_1}
{RND}:M 13 Dec 2025 14:32:{RND}.{RND} # Client context: {DATA_2}
{RND}:M 13 Dec 2025 14:32:{RND}.{RND} # maxmemory-policy: allkeys-lru`,
        detect: ['OOM command not allowed', 'Client context:'],
        extractMulti: [
            /OOM command not allowed: ([^\n]+)/,
            /Client context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 800,
        description: 'Redis OOM error'
    },
    log_apache: {
        name: '🪶 Apache Error',
        type: 'text',
        multipart: true,
        template: `[Fri Dec 13 14:32:{RND} 2025] [error] [client 192.168.1.{RND}] ModSecurity: Access denied with code 403 (phase 2).
[Fri Dec 13 14:32:{RND} 2025] [error] [client 192.168.1.{RND}] Pattern match "{DATA_1}" at ARGS:input.
[Fri Dec 13 14:32:{RND} 2025] [error] [client 192.168.1.{RND}] [file "/etc/modsecurity/rules.conf"] [line "{RND}"]
[Fri Dec 13 14:32:{RND} 2025] [error] [client 192.168.1.{RND}] Request ID: {DATA_2}`,
        detect: ['ModSecurity:', 'Access denied'],
        extractMulti: [
            /Pattern match "([^"]+)"/,
            /Request ID: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'Apache ModSecurity block'
    },
    log_mongodb: {
        name: '🍃 MongoDB Error',
        type: 'text',
        multipart: true,
        template: `{"t":{"$date":"2025-12-13T14:32:{RND}Z"},"s":"E","c":"QUERY","id":{RND},"ctx":"conn{RND}","msg":"Assertion",
 "attr":{"error":"BSONObj size is invalid","reason":"{DATA_1}",
 "namespace":"app.users","query":{"_id":"{RND}"},
 "planSummary":"IXSCAN { _id: 1 }","keysExamined":{RND},"docsExamined":{RND},
 "cursorid":0,"trace":"{DATA_2}","nreturned":0}}`,
        detect: ['BSONObj size', 'QUERY'],
        extractMulti: [
            /"reason":"([^"]+)"/,
            /"trace":"([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'MongoDB BSON error'
    },
    log_graphql: {
        name: '🔮 GraphQL Error',
        type: 'text',
        multipart: true,
        template: `{
  "errors": [
    {
      "message": "Cannot query field on type User",
      "locations": [{"line": {RND}, "column": 5}],
      "path": ["user", "profile", "data"],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED",
        "payload": "{DATA_1}",
        "stacktrace": ["at validateDocument", "at execute"],
        "requestId": "{DATA_2}"
      }
    }
  ],
  "data": null
}`,
        detect: ['GRAPHQL_VALIDATION_FAILED', 'Cannot query field'],
        extractMulti: [
            /"payload": "([^"]+)"/,
            /"requestId": "([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1000,
        description: 'GraphQL validation error'
    },
    log_terraform: {
        name: '🏗️ Terraform Error',
        type: 'text',
        multipart: true,
        template: `╷
│ Error: Error creating EC2 Instance: InvalidParameterValue
│ 
│   with aws_instance.app_server[0],
│   on main.tf line {RND}, in resource "aws_instance" "app_server":
│   {RND}:   ami = "{DATA_1}"
│ 
│ Status code: 400, Request ID: {DATA_2}
│ The image id does not exist
╵`,
        detect: ['Error creating EC2', 'InvalidParameterValue'],
        extractMulti: [
            /ami = "([^"]+)"/,
            /Request ID: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'Terraform apply error'
    },
    log_ansible: {
        name: '🔧 Ansible Error',
        type: 'text',
        multipart: true,
        template: `fatal: [app-server-{RND}]: FAILED! => {
    "changed": false,
    "msg": "Failed to connect to the host via ssh: {DATA_1}",
    "unreachable": true
}

PLAY RECAP *********************************************************************
app-server-{RND}             : ok=0    changed=0    unreachable=1    failed=0
Playbook context: {DATA_2}`,
        detect: ['fatal:', 'PLAY RECAP'],
        extractMulti: [
            /"msg": "Failed to connect to the host via ssh: ([^"]+)"/,
            /Playback context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'medium',
        maxDataLength: 900,
        description: 'Ansible playbook failure'
    },
    log_jenkins: {
        name: '🔨 Jenkins Build',
        type: 'text',
        multipart: true,
        template: `[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] sh
+ npm run deploy
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! deploy: \`{DATA_1}\`
npm ERR! Exit status 1
Build context: {DATA_2}
[Pipeline] }
[Pipeline] // stage
[Pipeline] End of Pipeline
ERROR: script returned exit code 1`,
        detect: ['Pipeline', 'npm ERR!'],
        extractMulti: [
            /deploy: `([^`]+)`/,
            /Build context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'Jenkins pipeline error'
    },
    log_prometheus: {
        name: '📊 Prometheus Alert',
        type: 'text',
        multipart: true,
        template: `{
  "status": "firing",
  "labels": {
    "alertname": "HighErrorRate",
    "instance": "app-{RND}.internal:9090",
    "severity": "critical"
  },
  "annotations": {
    "summary": "High error rate detected",
    "description": "Error rate is above 5% for 5 minutes",
    "payload": "{DATA_1}",
    "runbook": "https://wiki.internal/alerts/{DATA_2}"
  },
  "startsAt": "2025-12-13T14:32:{RND}Z"
}`,
        detect: ['HighErrorRate', 'firing'],
        extractMulti: [
            /"payload": "([^"]+)"/,
            /alerts\/([^"]+)"/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1000,
        description: 'Prometheus alertmanager'
    },
    log_sentry: {
        name: '🐛 Sentry Event',
        type: 'text',
        multipart: true,
        template: `Event ID: {RND}abcd{RND}ef
Project: production-app
Environment: production
Release: v2.{RND}.0

Exception: UnhandledException
Message: {DATA_1}

User: anonymous
IP: 192.168.{RND}.{RND}
Context: {DATA_2}

Tags:
  browser: Chrome {RND}.0
  os: Windows 11
  url: /api/v2/process`,
        detect: ['Event ID:', 'UnhandledException'],
        extractMulti: [
            /Message: ([^\n]+)/,
            /Context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1100,
        description: 'Sentry error tracking'
    },

    // ==================== SINGLE-PART PRESETS (legacy support) ====================
    crashlog_simple: {
        name: '💥 Simple Crash',
        type: 'text',
        template: `FATAL ERROR at 0x{RND}:
Process terminated unexpectedly.
Error code: {DATA}
Please report this issue.`,
        detect: ['FATAL ERROR', 'Error code:'],
        extract: /Error code: (.+)$/m,
        lengthCategory: 'short',
        maxDataLength: 300,
        description: 'Простой crash log'
    },
    log_simple: {
        name: '📝 Simple Log',
        type: 'text',
        template: `[{RND}-12-13 14:32:{RND}] ERROR: Operation failed
[{RND}-12-13 14:32:{RND}] Details: {DATA}
[{RND}-12-13 14:32:{RND}] Retrying in 5 seconds...`,
        detect: ['ERROR: Operation failed', 'Details:'],
        extract: /Details: (.+)$/m,
        lengthCategory: 'short',
        maxDataLength: 400,
        description: 'Простой лог ошибки'
    },
    hex_dump: {
        name: '🔢 Hex Dump',
        type: 'text',
        template: `00000010: 4865 6c6c 6f20 576f 726c 6421 0a00  Hello.World!..
00000020: {DATA}
00000030: 0000 0000 0000 0000 0000 0000 0000  ..............`,
        detect: ['00000010:', '00000020:'],
        extract: /00000020: ([^\n]+)/,
        lengthCategory: 'short',
        maxDataLength: 300,
        description: 'Hex дамп памяти'
    },
    base64_block: {
        name: '🔐 Base64 Block',
        type: 'text',
        template: `-----BEGIN ENCRYPTED DATA-----
Version: Shield 2.0
Comment: Encrypted message

{DATA}

-----END ENCRYPTED DATA-----`,
        detect: ['BEGIN ENCRYPTED DATA', 'END ENCRYPTED DATA'],
        extract: /Comment: Encrypted message\n\n(.+)\n\n-----END/s,
        lengthCategory: 'long',
        maxDataLength: 2000,
        description: 'PGP-подобный блок'
    },
    jwt_token: {
        name: '🎫 JWT Token',
        type: 'text',
        template: `Authorization failed. Invalid token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{DATA}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Token expired at: 2025-12-13T{RND}:{RND}:00Z
Please refresh your session.`,
        detect: ['Authorization failed', 'eyJhbGciOiJ'],
        extract: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.([^.]+)\./,
        lengthCategory: 'medium',
        maxDataLength: 600,
        description: 'JWT токен ошибка'
    },
    network_packet: {
        name: '📡 Network Packet',
        type: 'text',
        multipart: true,
        template: `Frame {RND}: 1500 bytes on wire
Ethernet II, Src: 00:1a:2b:{RND}:4d:5e, Dst: 00:6f:7g:{RND}:9i:0j
Internet Protocol Version 4, Src: 192.168.1.{RND}, Dst: 10.0.0.{RND}
Transmission Control Protocol, Src Port: {RND}, Dst Port: 443
    Payload: {DATA_1}
    Checksum: {DATA_2}
    [Expert Info: TCP segment of a reassembled PDU]`,
        detect: ['Frame', 'Ethernet II'],
        extractMulti: [
            /Payload: ([^\n]+)/,
            /Checksum: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1200,
        description: 'Сетевой пакет Wireshark'
    },
    coredump: {
        name: '💀 Core Dump',
        type: 'text',
        multipart: true,
        template: `Core was generated by './app --config /etc/app/config.yaml'.
Program terminated with signal SIGSEGV, Segmentation fault.
#0  0x7fff in process_input at src/processor.c:{RND}
#1  0x7ffe in handle_request at src/handler.c:89
Input data: {DATA_1}
Register dump:
  rax: 0x{RND}  rbx: 0x{RND}  rcx: 0x{RND}
Debug context: {DATA_2}`,
        detect: ['Core was generated', 'SIGSEGV'],
        extractMulti: [
            /Input data: ([^\n]+)/,
            /Debug context: ([^\n]+)/
        ],
        parts: 2,
        lengthCategory: 'long',
        maxDataLength: 1000,
        description: 'GDB core dump'
    },

    // ==================== MULTIPART (3+ parts) PRESETS ====================
    crashlog_full_java: {
        name: '☠️ Java Full Stack',
        type: 'text',
        multipart: true,
        template: `java.lang.RuntimeException: Critical failure in processing pipeline
    at com.app.core.Pipeline.execute(Pipeline.java:{RND})
    at com.app.services.Executor.run(Executor.java:156)
Caused by: java.lang.IllegalStateException: {DATA_1}
    at com.app.parsers.DataParser.parse(DataParser.java:{RND})
    at com.app.core.Pipeline.processInput(Pipeline.java:89)
Caused by: java.io.IOException: {DATA_2}
    at com.app.io.FileReader.read(FileReader.java:{RND})
    at com.app.parsers.DataParser.loadData(DataParser.java:45)
Suppressed: java.lang.SecurityException: {DATA_3}
    at com.app.security.Validator.check(Validator.java:67)
    at com.app.core.Pipeline.validate(Pipeline.java:{RND})
    ... 89 more`,
        detect: ['java.lang.RuntimeException', 'Critical failure'],
        extractMulti: [
            /IllegalStateException: ([^\n]+)/,
            /IOException: ([^\n]+)/,
            /SecurityException: ([^\n]+)/
        ],
        parts: 3,
        lengthCategory: 'long',
        maxDataLength: 2000,
        description: 'Java полный stack trace (3 части)'
    },
    log_distributed: {
        name: '🌐 Distributed Trace',
        type: 'text',
        multipart: true,
        template: `[Trace ID: {RND}-{RND}-{RND}]

Service: api-gateway
  Span: receive_request
  Duration: {RND}ms
  Context: {DATA_1}

Service: auth-service  
  Span: validate_token
  Duration: {RND}ms
  Token hash: {DATA_2}

Service: data-service
  Span: fetch_data
  Duration: {RND}ms
  Error: Connection timeout
  Payload: {DATA_3}

Service: cache-service
  Span: get_cache
  Duration: {RND}ms
  Cache key: {DATA_4}
  Status: MISS`,
        detect: ['Trace ID:', 'api-gateway'],
        extractMulti: [
            /Context: ([^\n]+)/,
            /Token hash: ([^\n]+)/,
            /Payload: ([^\n]+)/,
            /Cache key: ([^\n]+)/
        ],
        parts: 4,
        lengthCategory: 'long',
        maxDataLength: 2500,
        description: 'Распределённый трейс (4 части)'
    },
    log_microservices: {
        name: '🔗 Microservices Log',
        type: 'text',
        multipart: true,
        template: `=== Request Pipeline ===
[{RND}:32:18.{RND}] [API-GW] Incoming request from 192.168.{RND}.{RND}
[{RND}:32:18.{RND}] [API-GW] Auth header: {DATA_1}
[{RND}:32:18.{RND}] [AUTH]   Validating token...
[{RND}:32:18.{RND}] [AUTH]   Token payload: {DATA_2}
[{RND}:32:18.{RND}] [USER]   Fetching user profile
[{RND}:32:18.{RND}] [USER]   Profile data: {DATA_3}
[{RND}:32:18.{RND}] [DATA]   Processing request body
[{RND}:32:18.{RND}] [DATA]   Error: Invalid format
[{RND}:32:18.{RND}] [DATA]   Raw input: {DATA_4}
[{RND}:32:18.{RND}] [API-GW] Returning 400 Bad Request`,
        detect: ['Request Pipeline', '[API-GW]'],
        extractMulti: [
            /Auth header: ([^\n]+)/,
            /Token payload: ([^\n]+)/,
            /Profile data: ([^\n]+)/,
            /Raw input: ([^\n]+)/
        ],
        parts: 4,
        lengthCategory: 'long',
        maxDataLength: 2500,
        description: 'Микросервисы логи (4 части)'
    },
    debug_session: {
        name: '🔬 Debug Session',
        type: 'text',
        multipart: true,
        template: `=== Debug Session {RND} ===
Breakpoint 1 at main.cpp:{RND}
> (gdb) print request_data
$1 = "{DATA_1}"

> (gdb) print auth_token  
$2 = "{DATA_2}"

> (gdb) print user_context
$3 = "{DATA_3}"

> (gdb) backtrace
#0  process_request (data=$1) at handler.cpp:{RND}
#1  main (argc=1, argv=0x{RND}) at main.cpp:42

> (gdb) info registers
rax: 0x{RND}  rbx: 0x{RND}  rcx: 0x{RND}`,
        detect: ['Debug Session', 'Breakpoint'],
        extractMulti: [
            /\$1 = "([^"]+)"/,
            /\$2 = "([^"]+)"/,
            /\$3 = "([^"]+)"/
        ],
        parts: 3,
        lengthCategory: 'long',
        maxDataLength: 1800,
        description: 'GDB debug сессия (3 части)'
    },
    api_request_log: {
        name: '📨 API Request Log',
        type: 'text',
        multipart: true,
        template: `--- API Request Log ---
Timestamp: 2025-12-13T{RND}:32:18Z
Method: POST
Path: /api/v2/process
Client: 192.168.{RND}.{RND}

Headers:
  Authorization: Bearer {DATA_1}
  X-Request-ID: {RND}-{RND}-{RND}
  Content-Type: application/json

Body:
  {DATA_2}

Response:
  Status: 500 Internal Server Error
  Error: {DATA_3}
  
Server trace: {DATA_4}`,
        detect: ['API Request Log', 'Headers:'],
        extractMulti: [
            /Authorization: Bearer ([^\n]+)/,
            /Body:\n  ([^\n]+)/,
            /Error: ([^\n]+)/,
            /Server trace: ([^\n]+)/
        ],
        parts: 4,
        lengthCategory: 'long',
        maxDataLength: 2200,
        description: 'API запрос с ответом (4 части)'
    },
    security_audit: {
        name: '🛡️ Security Audit',
        type: 'text',
        multipart: true,
        template: `[SECURITY AUDIT LOG]
Event: SUSPICIOUS_ACTIVITY_DETECTED
Timestamp: 2025-12-13 {RND}:32:18 UTC
Severity: HIGH

Source IP: 192.168.{RND}.{RND}
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

Suspicious payload detected:
  Parameter: input
  Value: {DATA_1}
  
Session info:
  Session ID: {DATA_2}
  User: anonymous
  
Request fingerprint: {DATA_3}

Action taken: BLOCKED
Rule matched: SQL_INJECTION_ATTEMPT
Additional context: {DATA_4}`,
        detect: ['SECURITY AUDIT LOG', 'SUSPICIOUS_ACTIVITY'],
        extractMulti: [
            /Value: ([^\n]+)/,
            /Session ID: ([^\n]+)/,
            /Request fingerprint: ([^\n]+)/,
            /Additional context: ([^\n]+)/
        ],
        parts: 4,
        lengthCategory: 'long',
        maxDataLength: 2000,
        description: 'Аудит безопасности (4 части)'
    },
    test_failure: {
        name: '🧪 Test Failure',
        type: 'text',
        multipart: true,
        template: `FAIL tests/integration/api.test.js
  ● API Integration › should process valid request

    expect(received).toEqual(expected)

    Expected: {DATA_1}
    Received: {DATA_2}

      at Object.<anonymous> (tests/integration/api.test.js:{RND}:5)

    Test context:
      Request body: {DATA_3}
      
Test Suites: 1 failed, 23 passed, 24 total
Tests:       1 failed, 156 passed, 157 total
Time:        {RND}.{RND}s`,
        detect: ['FAIL tests/', 'expect(received)'],
        extractMulti: [
            /Expected: ([^\n]+)/,
            /Received: ([^\n]+)/,
            /Request body: ([^\n]+)/
        ],
        parts: 3,
        lengthCategory: 'long',
        maxDataLength: 1500,
        description: 'Jest тест провал (3 части)'
    }
};

// Helper function to get length category info
const LengthCategories = {
    short: {
        name: 'Короткие',
        icon: '📝',
        maxChars: 50,
        description: 'До 50 символов'
    },
    medium: {
        name: 'Средние',
        icon: '📄',
        maxChars: 200,
        description: '50-200 символов'
    },
    long: {
        name: 'Длинные',
        icon: '📜',
        maxChars: Infinity,
        description: 'Более 200 символов'
    }
};

// Get recommended preset for message length
function getRecommendedPresets(messageLength) {
    const category = messageLength <= 50 ? 'short' : messageLength <= 200 ? 'medium' : 'long';
    const recommended = [];

    for (const [id, preset] of Object.entries(SpoofPresets)) {
        if (preset.lengthCategory === category) {
            recommended.push({ id, ...preset });
        }
    }

    return { category, categoryInfo: LengthCategories[category], presets: recommended };
}
