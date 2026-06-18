<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "Autoloading... ";
require __DIR__ . '/../vendor/autoload.php';
echo "Done. Bootstrapping Laravel... ";

try {
    $appFile = __DIR__ . '/../bootstrap/app.php';
    if (!file_exists($appFile)) {
        die("bootstrap/app.php NOT FOUND at " . $appFile);
    }
    
    $app = require_once $appFile;
    echo "App instance created successfully! ";
    
    if (isset($app)) {
        echo "App type: " . get_class($app);
    }
} catch (\Throwable $e) {
    echo "\nFATAL ERROR DURING BOOTSTRAP:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace: \n" . $e->getTraceAsString();
}
exit;
