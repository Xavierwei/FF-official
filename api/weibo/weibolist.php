<?php
    include_once( 'config.php' );
    include_once( 'saetv2.ex.class.php' );
    $token = file_get_contents("token.txt");
    $c = new SaeTClientV2( WB_AKEY , WB_SKEY , $token );
    $ms  = $c->user_timeline_by_id(WB_UID,1,3);
    echo json_encode($ms);
?>