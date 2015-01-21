<?php

// $_POST['wsExtraRequest'] = 'getBrandTags';
// $_POST['brandID'] = '1';
// $_POST['outputFormat'] = 'json';

$lang = isset( $_COOKIE['lang'] ) ? $_COOKIE['lang'] : '';
if(  empty($lang) ){
	$lang = 'eng';
}
$url = 'http://backoffice.fredfarid.com/' . $lang . '/ws/';
$key = md5( $url . json_encode( $_POST ) );
// check file
$file = __DIR__ . '/../api_cache/' . $key;
if( !file_exists($file) || !file_get_contents( $file ) ){
	$ch = curl_init($url);
	curl_setopt( $ch, CURLOPT_HEADER, 0 );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1 );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
	$contents = curl_exec( $ch );
	curl_close( $ch );
	file_put_contents( $file , $contents);
}

echo file_get_contents( $file );
