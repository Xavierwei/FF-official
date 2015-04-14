<?php
// all page init here
// $userip = $_SERVER['REMOTE_ADDR'];
// //引用ip库的文件 把ip.zip里的全部文件放在lib目录下
// include_once '../ip/iplimit.class';
// $iplimit = new iplimit;

// if($iplimit->setup($userip)){
//     echo 1;
// } else {
//     echo 2;
// }

?>

<!doctype html>
<!--[if lt IE 7 ]><html class="ie6"><![endif]-->
<!--[if IE 7 ]><html class="ie7"><![endif]-->
<!--[if IE 8 ]><html class="ie8"><![endif]-->
<!--[if IE 9 ]><html class="ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html><!--<![endif]-->
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
	<link rel='shortcut icon' href='../../images/favicon.ico' />
    <link href="/css/style.css" rel="stylesheet" type="text/css" />
    <link href="/css/responsive.css" media="screen and (max-width: 1250px)" rel="stylesheet" type="text/css" />
    <!--[if gte IE 9]>
	  <style type="text/css">
	    .gradient {
	       filter: none;
	    }
	  </style>
	<![endif]-->
    <!--
    <script type="text/javascript" src="http://backoffice.fredfarid.com/assets/scripts/bo/api/ws_api.min.js"></script>
    <script type="text/javascript">
    // Initialize API parameters
	// document.BO_API.format = 'json';
	// document.BO_API.wsid = 'fredfarid';
	// document.BO_API.use_static = false; // Comment this line to use static json files
	// document.BO_API.requests_xml_source = 'http://preprod.fredfarid.com/data/_requests.xml';
	
	// // Send request and use results
	// document.BO_API.get('alcoholic_drinks', 'eng', function(JSONResult, data) {
	// 	if (console) {
	// 		console.log(JSONResult);
	// 		console.log(document.BO_API.getFilePath() + JSONResult.items[0].picture);
	// 	}
	// });
	
    </script>-->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-23934440-1', 'auto');
      ga('send', 'pageview');
    </script>
</head>
<body class="lang-<?php echo $_COOKIE['lang'];?>" data-title="<?php _e('FRED &amp; FARID GROUP');?>">
	<div class="loading-wrap gradient" style="display:block;">
	    <div class="layer blue"></div>
	    <div class="layer white"></div>
	    <div class="layer red"></div>
	    <div class="loading"></div>
	</div>
	<div class="page-mask">
        <canvas style="display:none;" id="ff_loading_logo_canvas" width="48" height="48" style="background-color:black"></canvas>
        <div id="random-quotes">
            <div class="table">
                <div class="table-row">
                    <div class="table-cell">

                    </div>
                </div>
            </div>
        </div>
    </div>
	<div class="fullcover-background pop">
	    <p class="popicon popclose transition" data-a="pop_close" data-d="noRefresh=1"></p>
	    <div class="popcon transition qr_pop popcon-show">
            <div class="popup_qr">
                <img src="../../images/weixin_QR.jpg">
            </div>
        </div>
	</div>

	<div class="section sec_gates" style="display:none;">
		<div class="gates-inner cs-clear">
			<div class="gates-inner-l">
				<ul class="column" id="categories-wrap">
				</ul>
			</div>
			<div class="gates-inner-c">
				<ul>
				</ul>
			</div>
			<!-- <div class="gates-inner-r">
				<ul>
					<li> <a data-a="filter-category" data-category="" class="active" href="#">all</a> </li>
					<li> <a data-a="filter-category" data-category="CONSULTING" href="#">CONSULTING</a> </li>
					<li> <a data-a="filter-category" data-category="DIGITAL" href="#">DIGITAL</a> </li>
					<li> <a data-a="filter-category" data-category="TRADITIONAL" href="#">TRADITIONAL</a> </li>
					<li> <a data-a="filter-category" data-category="MEDIA" href="#">MEDIA / SOCIAL MEDIA</a> </li>
				</ul>
			</div> -->
		</div>
	</div>
	<div class="brands_tit" style="display:none;">
		<div class="sec_brands_tit">
			<h2 class="column cs-clear"></h2>
			<a href="#" class="pageback transition" data-a="myBack"></a>
			<a href="#" class="pagetitarr pagetitarrtop transition" data-a="pagetitarrtop"></a>
			<a href="#" class="pagetitarr pagetitarrbottom transition" data-a="pagetitarrbottom"></a>
		</div>
		<!-- <div class="brands-tags">
			<p class="column">
				<a href="javascript:void(0);" class="transition">6 &nbsp; × &nbsp;awards</a>
				<a href="javascript:void(0);" class="transition">6 &nbsp; × &nbsp;services</a>
			</p>
		</div> -->
	</div>
	<div class="brand_item_tit" style="display:none;" >
		<div class="sec_brands_tit">
			<h2 class="column cs-clear"></h2>
			<a href="#" class="pageback transition" data-a="myBack"></a>
			<a href="#" class="pagetitarr pagetitarrtop transition" data-a="pagetitarrtop-level3"></a>
			<a href="#" class="pagetitarr pagetitarrbottom transition" data-a="pagetitarrbottom-level3"></a>
		</div>
	</div>
	<div class="section sec_brands">
		<div class="brand_movie" style="display:none;">
			<!-- <div class="brand_big_prev" data-a="brand_big_prev"> <span></span> </div>
			<div class="brand_big_next" data-a="brand_big_next"> <span></span> </div> -->
			<div class="brand_big_text column cs-clear">
			</div>
		</div>
		<div class="preview">
			<a href="javascript:;" class="close popicon popclose transition" data-a="myBack"></a>
			<a href="javascript:;" class="next" data-a="move-next"><span class="popicon popnext transition"></span></a>
			<a href="javascript:;" class="prev" data-a="move-prev"><span class="popicon popprev transition"></span></a>
			<ul></ul>
		</div>
		<ul class="brands-con">
		</ul>
	</div>
	<div class="container">
		<!-- header -->
		<div id="logo-wrap-mobile" class="logo-wrap mobile">
            <a href="#" data-a="show-mobile-header" class="logo transition">
                <!-- <canvas id="ff_logo_canvas" width="14" height="14" style="background-color:#FFFFFF"></canvas> -->
            </a>
        </div>

		<div class="header">
		    <a href="#" class="transition" id="hide-header-mobile" data-a="hide-mobile-header"></a>
			<div class="header-inner">

				<div class="logo-wrap desktop">
					<a href="/" data-a="navitem" class="logo transition">
					    <!-- <canvas id="ff_logo_canvas" width="14" height="14" style="background-color:#FFFFFF"></canvas> -->

                    </a>
				</div>
				<div class="nav column cs-clear">
				   
					<a class="navitem" data-a="show-category" data-d="type=categories" href="#"><?php _e('CATEGORIES');?></a>
					<a class="navitem" data-a="show-category" data-d="type=brands" href="#"><?php _e('BRANDS');?></a>
					<a class="navitem" data-a="show-category" data-d="type=services" href="#"><?php _e('SERVICES');?></a>
					<a class="navitem" data-a="navitem" href="/awards"><?php _e('AWARDS');?></a>
					<a class="navitem" data-a="navitem" href="/press" data-last="interview"><?php _e('PRESS');?></a>
					<a class="navitem" data-a="navitem" href="/bio" data-last="jobs" ><?php _e('ABOUT');?></a>
					<a class="navitem" data-a="navitem" href="/jobs" data-last="jobs" ><?php _e('jobs');?></a>
					<a class="navitem" data-a="navitem" href="/contact"><?php _e('CONTACT');?></a>
				</div>
				<!--
				<div class="language"><a href="#" data-a="lang" data-d="lang=eng">EN</a> <a href="#" data-a="lang" data-d="lang=zho">中文</a></div>
				-->
				<!-- <a href="#" data-a="search-toggle" class="search">×</a> -->
				<div class="search-wrap">
					<form class="search-wrap-inner column">
						<input type="submit" value="SEARCH" data-a="search-btn" />
						<input type="text" name="skey" placeholder="WRITE HERE YOUR SEAERCH" />
					</form> 
					<div class="search-result column">
						<h1>RESULTS FOR :  <span></span> </h1>
						<p class="search-tags">
							<a href="javascript:void(0);">all (9)</a>
							<a href="javascript:void(0);">campaigns (9)</a>
							<a href="javascript:void(0);">awards (3)</a>
							<a href="javascript:void(0);">others (9)</a>
						</p>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
						<div class="search-item cs-clear">
							<span class="search-item-tit">campaigns</span>
							Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ips sit voluptatem accusantium  
						</div>
					</div>
				</div>
			</div>
			<div class="process"></div>
		</div>






