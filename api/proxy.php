<?php

// $_POST['wsExtraRequest'] = 'getBrandTags';
// $_POST['brandID'] = '1';
// $_POST['outputFormat'] = 'json';

$lang = isset( $_COOKIE['lang'] ) ? $_COOKIE['lang'] : '';
if(  empty($lang) ){
	$lang = 'eng';
}
// JSON FILE
//$url = 'http://preprod.fredfarid.com/data/' . $lang . '/' . $_POST['contentPaths'] . '.json';

// WS
$url = 'http://backoffice.fredfarid.com/'.$lang.'/ws';
$_POST['contentPaths'] = 'pages_contents/'.$_POST['contentPaths'];

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

$res = file_get_contents( $file );
//if ($_POST['contentPaths'] == 'home' && !empty($_POST['type'])) {
//    $ret = array();
//    $data = json_decode($res, true);
//    foreach ($data['items'] as $item) {
//        if ($item['reel'] == $_POST['type']) $ret[] = $item;
//    }
//    $start = rand(0, 10);
//    if (count($ret)  < 1) {
//        $ret = array_slice($data['items'], $start, 10);
//    }
//    $res = json_encode(array(
//        'items' => $ret
//    ));
//}

echo $res;
