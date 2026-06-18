<?php

// Vercel serverless entry point for Laravel
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug: Check current directory and target file
$targetFile = __DIR__ . '/../public/index.php';
if (!file_exists($targetFile)) {
    die("Error: Target file not found at: " . realpath($targetFile) . " (Search path: " . $targetFile . ")");
}

// Create storage directories in /tmp
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

// Forward all requests to Laravel's public/index.php
require $targetFile;
