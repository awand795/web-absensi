<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// Force JSON error reporting for Vercel debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Create storage directories in /tmp for Vercel
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

    // Set storage path
    $app->useStoragePath($storageRoot);

    // Handle request
    $request = Request::capture();
    // Force JSON for API
    $request->headers->set('Accept', 'application/json');

    $app->handleRequest($request);

} catch (\Throwable $e) {
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
