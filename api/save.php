<?php
require '../db/db.php';

session_start();



$remont = R::dispense('remonts');
$id = R::getRow('SELECT `id_publick` FROM `remonts` ORDER BY `id` DESC LIMIT 1')['id_publick'] + 1;
$remont->id_publick = $id;
  foreach ($_POST as $key => $value) {
    if($key != "id"){
      $remont->$key = $value;
    }
  }
$remont->imei = null;
$remont->date = date('d:m:Y');
$remont->history = '';
$remont->price_our = $remont->price_master = $remont->notes = null;
$remont->wariaty = false;
$remont->savedby = $_SESSION['user']['login'];

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
  'post_recived' => $_POST,
  'id'      => $id
]);

 ?>
