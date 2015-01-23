<?php

class IPToLatlng {

    // 百度 ak
    private $ak = "ZuVRDtLTr1PXxz7g028BUPYL";
    private $api = "http://api.map.baidu.com/location/ip";
    private static $_ips = array();
    /**
     * 解析IP
     */
    public function parseIP($ip = NULL){
        if (!$ip) {
            $request = Yii::app()->getRequest();
            $ip =$request->getUserHostAddress();
        }

        if (isset(self::$_ips[$ip])) {
            return self::$_ips[$ip];
        }

        $ci = curl_init();
        /* Curl settings */
        curl_setopt($ci, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ci, CURLOPT_ENCODING, "");

        $data = array(
            "ak" => $this->ak,
            "ip" => $ip,
            "coor" => "bd09ll",
        );
        $url = "{$this->api}?". http_build_query($data);
        curl_setopt($ci, CURLOPT_URL, $url);
        curl_setopt($ci, CURLINFO_HEADER_OUT, TRUE );

        $ret = curl_exec($ci);

        $parse = json_decode($ret, TRUE);

        self::$_ips[$ip] = $parse;

        return $parse;
    }

    /**
     * IP 转换坐标
     * @param type $ip
     */
    public function toLatlng($ip = NULL) {
        $parse = $this->parseIP($ip);

        if ($parse && $parse["status"] == 0) {
            return $parse["content"]["point"];
        }
        // 默认是0
        return array("x"=> 0, "y" => 0);
    }

    /**
     * IP 转换城市
     * @param type $ip
     * @return type
     */
    public function toCity($ip = NULL) {
        $parse = $this->parseIP($ip);
        if ($parse && $parse["status"] == 0) {
            $city = $parse["content"]["address_detail"]["city"];
            return Yii::t("strings", $city);
        }
        // 默认是上海市
        else {
            return FALSE;
        }
    }

    public function toCountry($ip = NULL) {
        $parse = $this->parseIP($ip);
        if ($parse && $parse["status"] == 0) {
            $str = $parse["address"];
            $str_array = explode('|',$str);
            return $str_array[0];
        }
        // 默认是上海市
        else {
            return "OHTER";
        }
    }

    function distance($lat1, $lng1, $lat2, $lng2, $len_type = 2, $decimal = 2)
    {
        $EARTH_RADIUS = 6378.137;
        $PI = "3.1415926";
        $radLat1 = $lat1 * PI ()/ 180.0;   //PI()圆周率
        $radLat2 = $lat2 * PI() / 180.0;
        $a = $radLat1 - $radLat2;
        $b = ($lng1 * PI() / 180.0) - ($lng2 * PI() / 180.0);
        $s = 2 * asin(sqrt(pow(sin($a/2),2) + cos($radLat1) * cos($radLat2) * pow(sin($b/2),2)));
        $s = $s * $EARTH_RADIUS;
        $s = round($s * 1000);
        if ($len_type > 1)
        {
            $s /= 1000;
        }
        return round($s, $decimal);
    }

}
