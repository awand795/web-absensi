<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// 1. Matikan error display HTML, kita mau JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. Setup folder storage di /tmp (Vercel)
$storageDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache',
    '/tmp/storage/logs',
];
foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
}

require __DIR__ . '/../vendor/autoload.php';

try {
    /** @var Application $app */
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    // Paksa storage path ke /tmp
    $app->useStoragePath('/tmp/storage');

    // 3. PAKSA REQUEST MENJADI API (JSON)
    $request = Request::capture();
    $request->headers->set('Accept', 'application/json');

    $app->handleRequest($request);

} catch (\Throwable $e) {
    // Jika crash parah, keluarkan JSON manual
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
