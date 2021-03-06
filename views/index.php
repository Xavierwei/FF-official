<?php $home_page = true; ?>
<?php include_once 'common/header.php';?>
<!-- banner -->
<div class="banpho home-slider">
	<div class="slider-block-inner cs-clear" id="slider-block-inner" data-index="0"></div>
	<div class="banpho-con" data-height="94">
		<p style="font-size: 1.5em;margin-top:-50px;"></p>
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
<div class="slide-tip">
    <a class="hideme" href="javascript:;" data-a="slide-alink"></a>
    <div class="slide-cat-nav">
        <a href="javascript:;" data-a="homeSlideType" data-d="type=DIGITAL REEL" class="last cur" style="width: 124px;">Digital reel</a>
        <a href="javascript:;" data-a="homeSlideType" data-d="type=LUXE REEL" style="width: 108px;">LUXE reel</a>
        <a href="javascript:;" data-a="homeSlideType" data-d="type=VIDEO REEL" style="width: 108px;">video reel</a>
    </div>
</div>
<div class="slide-down-tip"> <a href="javascript:;" data-a="slide-alink"></a> </div>
<div class="page" data-page="home-page">
	<!-- section -->
	<div class="section sec_home">

        <!-- Home Adwards -->

        <div class="home-adwards">
            <h2 class="intoview-effect" data-effect="fadeup"><?php _e('NEWS_HOMEPAGE'); ?></h2>

            <div class="home-adwards-inner">
                <ul class="adwards-items cs-clear">
                    <li class="intoview-effect" data-effect="fadeup">
                        <img src="../images/adward7.jpg" alt=""/>
                        <span>Grand Prix award winner</span></li>
                    <li class="intoview-effect" data-effect="fadeup">
                        <img src="../images/adward6.jpg" alt=""/>
                        <span>Top 4 world's best digital Agency</span></li>
                    <li class="intoview-effect" data-effect="fadeup">
                        <img src="../images/adward5.jpg" alt=""/>
                        <span>5 times best Agency</span></li>
                    <li class="intoview-effect" data-effect="fadeup">
                        <img src="../images/adward4.jpg" alt=""/>
                        <span>Independent Agency of the year</span></li>
                    <li class="intoview-effect" data-effect="fadeup">
                        <img src="../images/adward3.jpg" alt=""/>
                        <span>Independent Agency of the year</span></li>
                    <li class="intoview-effect" data-effect="fadeup"><img src="../images/adward2.jpg" alt=""/><span>Silver Agency of the year</span></li>
                    <li class="intoview-effect s_lastLi" data-effect="fadeup">
                        <img src="../images/adward1.jpg" alt=""/>
                        <span>Top 10 best Agency outside USA</span></li>
                </ul>
            </div>
        </div>

		<!--  -->
		<div class="home_news" data-index="0" style="display:none;">
<!--			<h2 class="intoview-effect" data-effect="fadeup">--><?php //_e('NEWS_HOMEPAGE'); ?><!--</h2>-->
			<div class="home_news_inner cs-clear intoview-effect" data-effect="fadeup" style="width:300%;" id="home-news">
			</div>
			<div class="home_newspage">
				<span>1/3</span>
				<a href="#" data-a="home_newsprev" class="home_newspicon home_newsprev transition"></a>
				<a href="#" data-a="home_newsnext" class="home_newspicon home_newsnext transition"></a>
			</div>
		</div>
		<!--  -->
		<div class="home_view column">
			<div class="home_viewtiem home_twitter cs-clear intoview-effect" data-effect="fadeup">
				<a href="https://twitter.com/FredFaridGroup" target="_blank" class="home_viewlogo home_tlogo" id="home_twitter_follow"></a>
                <div id="home_twitter_wrap"></div>
			</div>
			<div class="home_viewtiem home_weibo cs-clear intoview-effect" data-effect="fadeup">
				<a href="http://weibo.com/fredfaridgroup" target="_blank" class="home_viewlogo home_wlogo" id="home_weibo_follow"></a>
                <div id="home_weibo_wrap"></div>
			</div>
			<div class="home_viewbtn cs-clear">
				<a href="https://twitter.com/FredFaridGroup" target="_blank" class="home_viewbtntw transition-wrap">
					<div class="transition">
					<?php _e('VIEW ALL TWEETS'); ?><br/><br/><?php _e('VIEW ALL TWEETS'); ?>
					</div>
				</a>
				<a href="http://weibo.com/fredfaridgroup" target="_blank" class="home_viewbtnwb transition-wrap">
					<div class="transition">
						<?php _e('VIEW ALL WEIBO'); ?><br/><br/><?php _e('VIEW ALL WEIBO'); ?>
					</div>
				</a>
			</div>
		</div>
		<!--  -->
		<div class="home_num">
			<h2><?php _e('NUMBERS'); ?></h2>
			<div class="home_numtable" style="padding-bottom: 50px;">
				<table>
					<tr id="home-num-tr"></tr>
					<tr>
						<td><strong class="intoview-effect" data-effect="number-rock">450+</strong><?php _e('EMPLOYEES');?></td>
						<td><strong class="intoview-effect" data-effect="number-rock">6</strong><?php _e('BUILDINGS');?></td>
						<td><strong class="intoview-effect" data-effect="number-rock">3</strong><?php _e('COUNTRIES');?></td>
						<td><strong class="intoview-effect" data-effect="number-rock">25</strong><?php _e('NATIONALITIES');?></td>
						<td><strong class="intoview-effect" data-effect="number-rock">1</strong><?php _e('HEART');?></td>
					</tr>
				</table>
			</div>
			<!-- <a href="/awards" class="home_numbtn">
				<div class="transition">
					<?php _e('ABOUT'); ?> <br/><br/><?php _e('ABOUT'); ?>
				</div>
			</a> -->
		</div>
		<!--  -->
		<div class="home_campaign" style="display:none;">
			<h2 class="intoview-effect" data-effect="fadeup"><?php _e('FEATURED CAMPAIGNS'); ?></h2>
			<div class="home_camcon column cs-clear">
			</div>
			<!-- <a class="home_cambtn" data-a="home-loadmore" href="#">
				<div class="transition">
					<?php _e('LOAD MORE'); ?><br/><br/><?php _e('LOAD MORE'); ?>
				</div>
			</a> -->
		</div>

        <div class="home_jobs">
            <h2 class="intoview-effect" style="margin-top: 0;" data-effect="fadeup"><?php _e('NEW JOBS'); ?></h2>
            <div class="section sec_jobs">

                <div class="jobslist column cs-clear">
                </div>
                <!--  -->
            </div>
        </div>

        <div class="home_brand">
            <h2 class="intoview-effect" style="margin-top: 0;" data-effect="fadeup">ff digital investment fund</h2>
            <p>we PROVIDE CAPITAL, INCUBATION, MENTORING & RESOURCES</p>
            <p>TO PROMISING DIGITAL VENTURES</p>
            <div class="">
                <a target="_blank" href="http://www.5m-ventures.com/fr/"><img src="/images/brand/HOME-BRAND-1.jpg"></a>
                <a target="_blank" href="http://babbler.fr/"><img src="/images/brand/HOME-BRAND-2.jpg"></a>
                <a target="_blank" href="http://www.bonjourbonjour.net/en"><img src="/images/brand/HOME-BRAND-3.jpg"></a>
                <a target="_blank" href="http://fashioncapitalpartners.com/"><img src="/images/brand/HOME-BRAND-4.jpg"></a>
                <a target="_blank" href="http://www.early-birds.fr/"><img src="/images/brand/HOME-BRAND-5.jpg"></a>
                <a target="_blank" href="https://itunes.apple.com/fr/app/gov/id732854392?mt=8%3Cbr%20/%3E%3Cbr%20/%3E%3Cbr%20/%3E"><img src="/images/brand/HOME-BRAND-6.jpg"></a>
            </div>
            <div>
                <a target="_blank" href="http://www.little-big-data.com/"><img src="/images/brand/HOME-BRAND-7.jpg"></a>
                <a target="_blank" href="http://www.markelys.com/"><img src="/images/brand/HOME-BRAND-8.jpg"></a>
                <a target="_blank" href="http://www.melty.fr/"><img src="/images/brand/HOME-BRAND-9.jpg"></a>
                <a target="_blank" href="https://state.com/landing"><img src="/images/brand/HOME-BRAND-10.jpg"></a>
                <a target="_blank" href="http://www.thetops.fr/"><img src="/images/brand/HOME-BRAND-11.jpg"></a>
                <a target="_blank" href="http://www.wezzoo.com/"><img src="/images/brand/HOME-BRAND-12.jpg"></a>
            </div>
        </div>

        <div class="home_agencies">
            <!--<h2 class="intoview-effect" style="margin-top: 0;" data-effect="fadeup"><?php _e('AGENCIES'); ?></h2>-->
            <div class="section sec_jobs">

                <div class="agencies-con column cs-clear f_column">
                    <img src="../images/home-map.jpg" alt=""/>
                </div>
                <!--  -->
            </div>
        </div>
		<!--  -->
		<div class="home_bio">
			<img class="home_bio_bg" src="/images/home_biobg.jpg">
			<h2><?php _e('BIOGRAPHY'); ?></h2>
			<div class="home_biotxt cs-clear">
				<div class="home_bioleft"></div>
				<div class="home_bioright"></div>
			</div>
			<a href="/bio" data-a="navitem" class="home_biobtn">
				<div class="transition">
					<?php _e('READ MORE'); ?><br/><br/><?php _e('READ MORE'); ?>
				</div>
			</a>
		</div>
	</div>
<script type="text/tpl" id="num-tpl" >
<td><strong class="intoview-effect" data-effect="number-rock">#[projects]</strong><?php _e('PROJECTS');?></td>
<td><strong class="intoview-effect" data-effect="number-rock">#[brands]</strong><?php _e('BRANDS');?></td>
<td><strong class="intoview-effect" data-effect="number-rock">#[press_articles]</strong><?php _e('PRESS_1');?></td>
<td><strong class="intoview-effect" data-effect="number-rock">#[services]</strong><?php _e('SERVICES');?></td>
<td><strong class="intoview-effect" data-effect="number-rock">#[awards]</strong><?php _e('AWARDS');?></td>
 </script>
<?php include_once 'common/footer.php';?>
