<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// Ensure errors are displayed during debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Create storage directories in /tmp for Vercel's read-only environment
$storageDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache',
    '/tmp/storage/logs',
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

require __DIR__ . '/../vendor/autoload.php';

try {
    /** @var Application $app */
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Force Laravel to use /tmp for its storage-related needs
    $app->useStoragePath('/tmp/storage');

    // Handle the request
    $request = Request::capture();
    $app->handleRequest($request);

} catch (\Throwable $e) {
    // If headers already sent, we just echo
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo "<h1>FATAL ERROR DURING REQUEST HANDLING</h1>";
    echo "<p><strong>Message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    echo "<pre><strong>Trace:</strong>\n" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
