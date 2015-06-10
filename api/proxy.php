<?php

$lang = isset( $_COOKIE['lang'] ) ? $_COOKIE['lang'] : '';
if(  empty($lang) ){
	$lang = 'eng';
}

/**
 * @param $res 匹配JSON的contentPath
 */
function fixContentPath($res, $lang) {
    if (is_string($res)) {
        $data = json_decode($res, true);
    }
    if (isset($data['items'])) {
        foreach ($data['items'] as &$item) {
            $item['_contentPath'] = str_replace('pages_contents', $lang,  $item['_contentPath']). '/';
            $item['_contentPath'] = str_replace('//', '/', $item['_contentPath']);
        }
    }

    return json_encode($data);
}

/**
 * @param $contentPath
 */
function fixRequestContentPath($contentPath) {
    if (strpos($contentPath, 'extended/brands') !== false) {
        preg_match('(\d+)', $contentPath, $brandID);
        if ($brandID) {
            $_POST['brandID'] = $brandID[0];
            $_POST['wsExtraRequest'] = 'getBrandCampaigns';
            $contentPath = 'pages_contents/brands/';
        }
    }
    if (strpos($contentPath, 'nav_services') !== false) {
        $contentPath = 'navigation_menus/frontoffice/services';
    }
    else {
        $contentPath = 'pages_contents/'. $contentPath;
    }

    return $contentPath;
}

// JSON FILE
// $url = 'http://preprod.fredfarid.com/data/' . $lang . '/' . $_POST['contentPaths'] . '.json';

// WS
$url = 'http://backoffice.fredfarid.com/'.$lang.'/ws';
$_POST['contentPaths'] = fixRequestContentPath($_POST['contentPaths']);


$key = md5( $url . json_encode( $_POST ) );
// check file
$file = __DIR__ . '/../api_cache/' . $key;
 // if( !file_exists($file) || !file_get_contents( $file )){
	$ch = curl_init($url);
	curl_setopt( $ch, CURLOPT_HEADER, 0 );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1 );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
	$contents = fixContentPath(curl_exec($ch), $lang);
	curl_close( $ch );
	file_put_contents( $file , $contents);
// }

$res = file_get_contents( $file );

echo $res;
