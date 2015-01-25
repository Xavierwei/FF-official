<?php
define('ROOT', __DIR__);
require_once ROOT . '/views/common/ins.php';

// sent lange
setLang( getLang() );
header('Access-Control-Allow-Origin: *');

// router
$path = $_GET['path'];
$paths = array_filter( explode('/', $path) );
if( empty( $paths ) || in_array($paths[0], array('categories','brands','services')) ){
	$page = 'index';
} else {
	$page = $paths[0];
}
$file = ROOT . "/views/{$page}.php";

if( file_exists( $file ) ){
	setcookie( 'page', $page == 'index' ? '/' : $page );
	require_once $file;
} else {
	require_once '404.html';
	//header('Location:/404.html');
}
