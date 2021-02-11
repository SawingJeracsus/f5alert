<?php
require '../db/db.php';

$res = R::getAll(
  'SELECT `id`, `id_publick`, `surname`, `phone_num`, `model`, `broke`
   FROM `remonts`
   WHERE
     `id_publick` LIKE "%'.$_POST['data'].'%" OR
      `surname`   LIKE "%'.$_POST['data'].'%" OR
      `phone_num` LIKE "%'.$_POST['data'].'%"OR
      `date`      LIKE "%'.$_POST['data'].'%"
    LIMIT 20  
      ');
foreach ($res as $key => $settings) {
  include '../components/item.php';
}
 ?>
