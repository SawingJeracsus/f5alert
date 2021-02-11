<?php 
require('../php/db/dbUnProtected.php');
$res = R::getRow('SELECT COUNT(`user`) FROM `apikeys` WHERE `apikey` = "'.$_GET['apikey'].'" ');
if($res['COUNT(`user`)'] != 0){
	$masters = R::getAll('SELECT * FROM `masters`');
    print_r(json_encode([
    	'type' => 'success',
    	'mesage' => 'masters uploaded successfull',
    	'payload' => json_encode($masters, JSON_UNESCAPED_UNICODE)
    ]));    
}else{
    print_r(json_encode([
        'type' => 'error',
        'message' => 'Invalid API key!'
    ], JSON_UNESCAPED_UNICODE));
}

/*
Вимоги
GET:
    apikey - ключ api
*/
?>

