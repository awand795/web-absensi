<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// 1. Force raw error display for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. Setup folder storage di /tmp (Vercel)
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

require __DIR__ . '/../vendor/autoload.php';

try {
    /** @var Application $app */
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    // Set storage path before handling request
    $app->useStoragePath($storageRoot);

    // Ensure core configs are set for serverless
    config([
        'view.compiled' => $storageRoot . '/framework/views',
        'session.driver' => 'cookie',
        'cache.default' => 'array',
        'logging.default' => 'stderr',
    ]);

    // Force request to be JSON to avoid view rendering on errors
    $request = Request::capture();
    $request->headers->set('Accept', 'application/json');

    $app->handleRequest($request);

} catch (\Throwable $e) {
    // Return a clean JSON error even if Laravel fails
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
