<?php
require '../db/db.php';
$val = $_POST['val'];
print_r($_POST);
$sql = 'UPDATE `remonts` SET '.$_POST['table'].' = "'.$val.'" WHERE `id` = '.$_POST['id'];
R::exec($sql);
echo $sql;
// echo $sql;
// echo json_encode()
 ?>
