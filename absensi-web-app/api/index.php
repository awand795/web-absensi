<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

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

/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Set storage path
$app->useStoragePath($storageRoot);

// Handle request
$request = Request::capture();
// Force JSON for API
$request->headers->set('Accept', 'application/json');

$app->handleRequest($request);
