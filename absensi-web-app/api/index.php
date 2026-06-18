<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "Checking vendor folder... ";
$autoload = __DIR__ . '/../vendor/autoload.php';

if (file_exists($autoload)) {
    echo "Autoload found! Loading... ";
    require $autoload;
    echo "Autoload success!";
} else {
    echo "Autoload NOT FOUND at: " . $autoload;
}
exit;
