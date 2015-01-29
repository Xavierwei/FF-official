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
</head>
<body class="lang-<?php echo $_COOKIE['lang'];?>">
	<div class="loading-wrap gradient" style="display:block;"><div class="loading"></div></div>
	<div class="page-mask"></div>
	<div class="container">
	<?php if( isset($home_page) ){?>
	<!-- banner -->
	<div class="banpho home-slider">
		<div class="slider-block-inner cs-clear" id="slider-block-inner" data-index="0"></div>
		<div class="banpho-con" data-height="94">
			<div class="banpho-bt">
				<a href="javascript:;" data-a="home-slider-left" class="banpho-bt-l transition"></a>
				<div class="banpho-bt-c" data-a="home-play-movie">
					<div class="transition"><?php _e('play movie');?><br/><br/><?php _e('play movie');?></div>
				</div>
				<a href="javascript:;" data-a="home-slider-right" class="banpho-bt-r transition"></a>
			</div>
			<div class="banpho-i">1/12</div>
		</div>
	</div>
	<script type="text/javascript">
	(function(){
		var winHeight = document.documentElement.clientHeight;
		var sliderInner = document.getElementById('slider-block-inner');
		sliderInner.style.height = winHeight - 60 + 'px';
	})();
	</script>
	<?php }?>
	<!-- header -->
	<div class="header <?php if( !isset($home_page) && 0 ){ ?>header-fixed<?php }?>">
		<div class="header-inner">
			<div class="logo-wrap">
				<a href="/" data-a="navitem" class="logo transition"></a>
			</div>
			<div class="nav column cs-clear">
				<a class="navitem" data-a="show-category" data-d="type=categories" href="#"><?php _e('CATEGORIES');?></a>
				<a class="navitem" data-a="show-category" data-d="type=brands" href="#"><?php _e('BRANDS');?></a>
				<a class="navitem" data-a="show-category" data-d="type=services" href="#"><?php _e('SERVICES');?></a>
				<a class="navitem" data-a="navitem" href="/awards"><?php _e('AWARDS');?></a>
				<a class="navitem" data-a="navitem" href="/press" data-last="interview"><?php _e('PRESS');?></a>
				<a class="navitem" data-a="navitem" href="/bio" data-last="jobs" ><?php _e('ABOUT');?></a>
				<a class="navitem" data-a="navitem" href="/contact"><?php _e('CONTACT');?></a>
			</div>
			<div class="language"><a href="#" data-a="lang" data-d="lang=eng">EN</a> <a href="#" data-a="lang" data-d="lang=zho">中国</a></div>
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
			<a href="#" class="pageback transition" data-a="pageback"></a>
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
			<a href="#" class="pageback transition" data-a="pageback"></a>
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
			<a href="javascript:;" class="close popicon popclose transition" data-a="pageback"></a>
			<a href="javascript:;" class="next" data-a="move-next"><span class="popicon popnext transition"></span></a>
			<a href="javascript:;" class="prev" data-a="move-prev"><span class="popicon popprev transition"></span></a>
			<ul></ul>
		</div>
		<ul class="brands-con">
		</ul>
	</div>






