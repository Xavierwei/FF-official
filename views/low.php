<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <title><?php _e('FRED &amp; FARID GROUP');?></title>
	<meta name="keywords" content="Fred & Farid, Fred&Farid, Fred & Farid Group, Fred&Farid Group, FFL Paris, Frédéric Raillard, Farid Mokart, agence de publicité, agence de communication" />
	<meta name="description" content="FRED & FARID GROUP is the first French independent Digital Creative Group, founded in 2007 by Fred Raillard and Farid Mokart, Cannes Grand Prix 2009 winner." />
	<meta property="og:title" content="FRED &amp;AMP; FARID GROUP" />
	<meta property="og:image" content="http://www.fredfarid.com/assets/images/ff_fb_200x200.jpg" />
	<meta property="og:description" content="FRED & FARID GROUP is the first French independent Digital Creative Group, founded in 2007 by Fred Raillard and Farid Mokart, Cannes Grand Prix 2009 winner." />
	<meta property="og:url" content="http://www.fredfarid.com/" />
	<meta name="viewport" content="width=640, minimum-scale=0.5, maximum-scale=1, target-densityDpi=290,user-scalable = no" />
    <link href="/css/style.css" rel="stylesheet" type="text/css" />
    <!--[if gte IE 9]>
	  <style type="text/css">
	    .gradient {
	       filter: none;
	    }
	  </style>
	<![endif]-->
	<style type="text/css">
	 #bg{position: absolute;}
	 .bg-wrap{position: absolute;top:0;height: 100%;left:0;width: 100%;z-index: -1;overflow: hidden;}
	 .logos{color: white;position: absolute;text-align: center;width: 100%;top:50%;margin-top: -100px;text-transform: uppercase;}
	 .browsers{width: 280px;left: 50%;position: absolute;margin-left: -130px; padding-top: 30px;}
	 .browsers a{float: left;width: 40px;height: 40px;background: url(/images/browsers.png) no-repeat; margin-right: 30px;opacity: 0.6;filter:alpha(opacity=60);}
	 .browsers a:hover{opacity: 1;filter:alpha(opacity=100);}
	 .browsers .b2{background-position: -67px 0;}
	 .browsers .b3{background-position: -137px 0;}
	 .browsers .b4{background-position: -208px 0;}
	</style>
</head>
<body>
<div class="bg-wrap">
	<img id="bg" src="/images/home_biobg.jpg">
</div>

<div class="logos">
	<img src="/images/logo2.png">
	<p><?php _e('FOR THE BEST EXPERIENCE, PLEASE UPDATE YOUR BROWSERS TO THE LATEST. <br/>THANK YOU !');?></p>
	
	<div class="browsers">
	    <a class="b1" href="https://www.google.com/chrome/browser/desktop/"></a>
		<a class="b2" href="http://windows.microsoft.com/en-HK/internet-explorer/download-ie"></a>
		<a class="b3" href="http://support.apple.com/downloads/#safari"></a>
		<a class="b4" href="https://www.mozilla.org/en-US/firefox/new/"></a>
	</div>
</div>

<script type="text/javascript" src="/js/jquery/jquery-1.8.3.min.js"></script>
<!--[if IE 6]><script src="/js/DD_belatedPNG.js"></script><script>  DD_belatedPNG.fix('.browsers a');</script><![endif]-->
<script type="text/javascript">

 function fixImageToWrap($wrap, $img) {
    $img.width('auto').height('auto');
    if (!$img.width()) {
        $img.load(function () {
            fixImageToWrap($wrap, $img);
        });
        return;
    }
    var ratio = $img.height() / $img.width();
    var w = $wrap.width();
    var h = $wrap.height();
    var vh = 0;
    var vw = 0;
    if (h / w > ratio) {
        vh = h;
        vw = vh / ratio;
    } else {
        vw = w;
        vh = vw * ratio;
    }

    $img.css({
        width: vw,
        height: vh,
        marginTop: (h - vh) / 2,
        marginLeft: (w - vw) / 2
    });
}


$(window).resize(function(){
	fixImageToWrap( $('#bg').parent(), $('#bg') );
}).trigger('resize');
</script>

</body>
</html>
