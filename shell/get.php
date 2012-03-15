<?php
require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . "CnCApi.php";
require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . "Grabber.php";


if (!isset($argv[1])) {
    print_r("Hash needed!!!");
    exit(0);
}

$server = isset($argv[2]) ? $argv[2] + 1 : 4;

$api = new CnCApi($server);

$api->setSession($argv[1]);

//if ($api->isValidSession()) {

$grabber = new Grabber($api);
//    $grabber->parse();
$grabber->load();
$grabber->writeData();

//} else {
//    print_r("Wrong hash!!!");
//    exit(0);
//}





