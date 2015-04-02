<?php
    // 每天 早上9点重新抓一次
    $cacheFile = __DIR__.'/cache.txt';
    $output = file_get_contents($cacheFile);

    if (date('G') == 9 || $output == '') {
        include_once( 'config.php' );
        include_once( 'saetv2.ex.class.php');
        $token = file_get_contents("token.txt");
        $c = new SaeTClientV2( WB_AKEY , WB_SKEY , $token );
        $ms  = $c->user_timeline_by_id(WB_UID,1,2);
        $user = $c->show_user_by_id(WB_UID);
        $ms['userinfo'] = $user;

        $ret = json_encode($ms);
        print_r($ret);
        die();

        file_put_contents($cacheFile, $ret);
        $output = $ret;
    }


    echo $output;
?>