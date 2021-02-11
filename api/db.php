<?php

  require 'config.php';
  require 'rb-mysql.php';
  R::setup('mysql:host='.$server_url.';dbname='.$server_db_name.'',$server_user_name, $server_password);

  session_start();

if(!isset($_SESSION['user']) || $_SESSION['user']['activated'] == '0'){
   header('Location: login.php');
}

$doc = new DOMDocument();
$doc->loadHTMLFile($server_link.'?key='.$_KEY);

$responce = json_decode($doc->textContent);
if($responce->type == 'error'){
  header('Location: updatelicense.php?error='.$responce->message);
}

 ?>
