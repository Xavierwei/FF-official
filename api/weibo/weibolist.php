<?php

function debugEcho() {
    $args = func_get_args();
    $str = '';
    foreach ($args as $arg) {
        $str .= print_r($arg, true)."\n";
    }

    $file = fopen(__DIR__.'/debug.txt', 'a+');
    if ($file) {
        fwrite($file, $str);
    }

    fclose($file);

    return true;
}

// 每天 早上9点重新抓一次
$cacheFile = __DIR__.'/cache.txt';
$output = file_get_contents($cacheFile);

debugEcho('====== begin fetch weibo ========');
debugEcho('=====  now is '. date('G').' =======');

if (date('G') == 9 || $output == '') {
    debugEcho('===== fetching weibo ======= ');
    include_once( 'config.php' );
    include_once( 'saetv2.ex.class.php');
    $token = file_get_contents("token.txt");
    $c = new SaeTClientV2( WB_AKEY , WB_SKEY , $token );
    $ms  = $c->user_timeline_by_id(WB_UID,1,2);
    $user = $c->show_user_by_id(WB_UID);
    $ms['userinfo'] = $user;

    $ret = json_encode($ms);

    file_put_contents($cacheFile, $ret);
    $output = $ret;
}

debugEcho('=======end fetch weibo ========');



echo $output;
?>