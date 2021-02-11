<?php
try {
    require('../php/db/dbUnProtected.php');
$login = $_POST['login'];
$password = $_POST['password'];

$user = R::getRow(
'SELECT `id`, `login`, `password` FROM `users` 
WHERE
    `login` = "'.$login.'"
    OR
    `email` = "'.$login.'"
'
);
if(count($user) >= 1 && md5($password) === $user['password']){
    $apikey = R::getRow('SELECT `apikey` FROM `apikeys` WHERE `user`= '.$user['id'].' ')['apikey'];
    
    if(!$apikey){
        $apikey = md5(rand(100000, 900000));
        $apiKeyRow = R::dispense('apikeys');
        $apiKeyRow->user = $user['id'];
        $apiKeyRow->apikey = $apikey;
        R::store($apiKeyRow);
    }
    print_r(json_encode([
        'apikey' => $apikey,
        'type'   => 'success'
    ]));
}
} catch (\Throwable $th) {
    print_r(json_encode([
        'message' => 'cant create apikey',
        'type'    => 'error'
    ]));
}

/*
Вимоги
POST:
    login - логін
    password - пароль
*/
?>