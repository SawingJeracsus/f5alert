<?php
require '../db/config.php';


$doc = new DOMDocument();
$doc->loadHTMLFile($server_link.'/analiable_version');
// $doc->loadHTMLFile('http://server/analiable_version');

$responce = json_decode($doc->textContent);

$ver = $responce->version;
$versionComposed = 0;


foreach(explode(".", $ver) as $value){
    $versionComposed += $value;
}

foreach(explode(".", $_POST['version']) as $value){
    $versionComposed2 += $value;
}

if($versionComposed > $versionComposed2){
    echo json_encode([
        'type' => 'error',
        'message' => 'Будь-ласка, оновіть програмне забезпечення'
    ], JSON_UNESCAPED_UNICODE);
}else{
    echo json_encode([
        'type' => 'success',
        'message' => 'У вас найновіша версія!'
    ], JSON_UNESCAPED_UNICODE);

}

?>