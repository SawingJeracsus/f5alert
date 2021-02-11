<?php
try {
    require('../php/db/dbUnProtected.php');

if(isset($_GET['login']) && isset($_GET['password'])){
    $login = $_GET['login'];
    $password = $_GET['password'];

$user = R::getRow(
'SELECT `id`, `login`, `password` FROM `users` 
WHERE
    `login` = "'.$login.'"
    OR
    `email` = "'.$login.'"
'
);
if($user && count($user) >= 1 && md5($password) === $user['password']){
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
}else{
    print_r(json_encode([
        'message' => 'wrong password or login!',
        'type'    => 'error'
    ]));
}

}else{
    print_r(json_encode([
        'message' => 'login & password not goted',
        'type'    => 'error',
        'get'    => $_GET
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
GET:
    login - логін
    password - пароль
*/
?>
