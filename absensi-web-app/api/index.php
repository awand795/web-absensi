<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// ──────────────────────────────────────────────
// 1. Handle CORS preflight (OPTIONS) BEFORE any
//    Laravel bootstrap — critical for Vercel
//    serverless where the middleware stack may
//    not run for OPTIONS requests.
// ──────────────────────────────────────────────
$corsOrigins = [
    'https://bikin-absensi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = in_array($origin, $corsOrigins, true) ? $origin : ($corsOrigins[0] ?? '*');

function sendCorsHeaders($origin): void
{
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

sendCorsHeaders($allowedOrigin);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

// Force JSON error reporting for Vercel debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Create storage and bootstrap cache directories in /tmp for Vercel
$storageRoot = '/tmp/storage';
$storageDirs = [
    $storageRoot . '/framework/views',
    $storageRoot . '/framework/sessions',
    $storageRoot . '/framework/cache',
    $storageRoot . '/logs',
];
foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
}

$tmpBootstrapPath = '/tmp/bootstrap';
if (!is_dir($tmpBootstrapPath . '/cache')) {
    mkdir($tmpBootstrapPath . '/cache', 0755, true);
}

require __DIR__ . '/../vendor/autoload.php';

// Capture CORS headers so they can be re-applied after Laravel flushes headers
$corsOrigin = $allowedOrigin;

try {
    /** @var Application $app */
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Set storage path
    $app->useStoragePath($storageRoot);

    // Redirect bootstrap/cache to /tmp so PackageManifest and other
    // cache writers have a writable directory (read-only on Vercel).
    $app->useBootstrapPath($tmpBootstrapPath);

    // Pre-set VIEW_COMPILED_PATH so config/view.php picks it up via env() instead
    // of calling realpath() on a path that might not exist yet during config loading.
    $_ENV['VIEW_COMPILED_PATH'] = $storageRoot . '/framework/views';

    // Register FilesystemServiceProvider first because ViewServiceProvider depends
    // on the 'files' binding ($app['files']) in its registerViewFinder() and
    // registerBladeCompiler() methods. Without this, ViewServiceProvider will
    // throw "Target class [files] does not exist."
    if (!$app->providerIsLoaded(\Illuminate\Filesystem\FilesystemServiceProvider::class)) {
        $app->register(\Illuminate\Filesystem\FilesystemServiceProvider::class);
    }

    // Register ViewServiceProvider early so the 'view' binding exists in the container
    // before kernel bootstrap runs. The exception handler depends on 'view' via
    // response()->json(), and without this it crashes with "Target class [view] does
    // not exist" if an exception occurs before RegisterProviders bootstrapper runs.
    if (!$app->providerIsLoaded(\Illuminate\View\ViewServiceProvider::class)) {
        $app->register(\Illuminate\View\ViewServiceProvider::class);
    }

    // Handle request
    $request = Request::capture();
    // Force JSON for API
    $request->headers->set('Accept', 'application/json');

    $app->handleRequest($request);

} catch (\Throwable $e) {
    // Re-send CORS headers in case Laravel flushed them
    sendCorsHeaders($corsOrigin);
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'exception' => get_class($e),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString())
    ], JSON_PRETTY_PRINT);
}
