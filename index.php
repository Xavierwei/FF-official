<?php
define('ROOT', __DIR__);
require_once ROOT . '/views/common/ins.php';

// sent lange
setLang( getLang() );
header('Access-Control-Allow-Origin: *');


if(strpos($_SERVER['HTTP_USER_AGENT'],'MSIE 6.0') == true  || strpos($_SERVER['HTTP_USER_AGENT'],'MSIE 7.0') == true ){
    require_once ROOT . '/views/low.php';
} else {
	// router
	$path =  isset($_GET['path']) ? $_GET['path'] : '/' ;
	$paths = array_filter( explode('/', $path) );
	if( empty( $paths ) || in_array($paths[0], array('categories','brands','services')) ){
		$page = 'index';
	} else {
		$page = $paths[0];
	}
	$file = ROOT . "/views/{$page}.php";

	if( file_exists( $file ) ){
		setcookie( 'page', $page == 'index' ? '' : $page );
		require_once $file;
	} else {
		if(isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"])=="xmlhttprequest"){ 
			throw new Exception('sb Exception');
		}
		//require_once '404.html';
		header('Location:/404.html');
	}

}

