<?php
    include_once( 'config.php' );
    include_once( 'saetv2.ex.class.php' );
    $token = file_get_contents("token.txt");
    $c = new SaeTClientV2( WB_AKEY , WB_SKEY , $token );
    $ms  = $c->user_timeline_by_id(WB_UID,1,2);

//    foreach($ms['statuses'] as $item) {
//        print_r($item);
//        $url = file_get_contents('http://api.t.sina.com.cn/querymid.json?id='.$item['mid']);
//        print_r('http://api.t.sina.com.cn/querymid.json?id='.$item['mid']);
//    }

    echo json_encode($ms);
?>