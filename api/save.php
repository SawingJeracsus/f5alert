<?php
require '../db/db.php';

session_start();


$remont = R::dispense('remonts');
$id = R::getRow('SELECT `id_publick` FROM `remonts` ORDER BY `id` DESC LIMIT 1')['id_publick'] + 1;
$remont->id_publick = $id;
  foreach ($_POST as $key => $value) {
    $remont->$key = $value;
  }  
$remont->imei = null;
$remont->date = date('d:m:Y');
$remont->history = '';
$remont->price_our = $remont->price_master = $remont->notes = null;
$remont->wariaty = false;
$remont->savedby = $_SESSION['user']['login'];

$redirects = R::getAll('SELECT `redirect` from `subscribers`');
$idOfMaster = R::getRow('SELECT `id` from `masters` WHERE `name` = "'.$_POST['master'].'"')['id'];
foreach($redirects as $redirect){
  $url  = $redirect['redirect'];
  $model = $_POST['model'];
  $broke = $_POST['broke'];
  file_get_contents(str_replace(' ', '%20', "$url/$idOfMaster?model=$model&broke=$broke&src=$sitelink"));
}

try {
  $id = R::store($remont);
} catch (\Exception $e) {
  echo json_encode([
    'type' => 'error',
    'message' => 'Can`t save remont ('
  ]);
  die;
}
echo json_encode([
  'type'    => 'success',
  'message' => 'Success',
  'id'      => $id
]);

 ?>
