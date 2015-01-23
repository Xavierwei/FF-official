<?php
include_once('ip.php');
if(isset($_SERVER["HTTP_VIA"])){
    if(isset($_SERVER["HTTP_X_FORWARDED_FOR"])){
        $userIp = $_SERVER["HTTP_X_FORWARDED_FOR"];
    }
    else {
        $userIp = $_SERVER["REMOTE_ADDR"];
    }
}
else {
    $userIp = $_SERVER["REMOTE_ADDR"];
}


$ip = new IPToLatlng();
//$userIp = (isset($_SERVER["HTTP_VIA"])) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"];
$country = $ip->toCountry($userIp);
if($country == "CN") {
    echo 1;
}
else {
    echo 2;
}
?>