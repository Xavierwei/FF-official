<?php $home_page = true; ?>
<?php include_once 'common/header.php';?>
<div class="page" data-page="home-page">
	<!-- section -->
	<div class="section sec_home">
		<!--  -->
		<div class="home_news" data-index="0">
			<h2 class="intoview-effect" data-effect="fadeup"><?php _e('NEWS'); ?></h2>
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
				<a href="https://twitter.com/FredFarid" target="_blank" class="home_viewlogo home_tlogo" id="home_twitter_follow"></a>
                <div id="home_twitter_wrap"></div>
			</div>
			<div class="home_viewtiem home_weibo cs-clear intoview-effect" data-effect="fadeup">
				<a href="http://weibo.com/fredfaridgroup" target="_blank" class="home_viewlogo home_wlogo" id="home_weibo_follow"></a>
                <div id="home_weibo_wrap"></div>
			</div>
			<div class="home_viewbtn cs-clear">
				<a href="https://twitter.com/FredFarid" target="_blank" class="home_viewbtntw transition-wrap">
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
		<div class="home_campaign">
			<h2 class="intoview-effect" data-effect="fadeup"><?php _e('FEATURED CAMPAIGNS'); ?></h2>
			<div class="home_camcon column cs-clear">
			</div>
			<a class="home_cambtn" data-a="home-loadmore" href="#">
				<div class="transition">
					<?php _e('LOAD MORE'); ?><br/><br/><?php _e('LOAD MORE'); ?>
				</div>
			</a>
		</div>		
		<!--  -->
		<div class="home_bio">
			<img class="home_bio_bg" src="../images/home_biobg.jpg">
			<h2><?php _e('BIOGRAPHY'); ?></h2>
			<div class="home_biotxt cs-clear">
				<div class="home_bioleft"></div>
				<div class="home_bioright"></div>
			</div>
			<a href="/bio" class="home_biobtn">
				<div class="transition">
					<?php _e('READ MORE'); ?><br/><br/><?php _e('READ MORE'); ?>
				</div>
			</a>
		</div>
		<!--  -->
		<div class="home_num">
			<h2><?php _e('NUMBERS'); ?></h2>
			<div class="home_numtable">
				<table>
					<tr id="home-num-tr"></tr>
				</table>
			</div>
			<a href="/awards" class="home_numbtn">
				<div class="transition">
					<?php _e('ABOUT'); ?> <br/><br/><?php _e('ABOUT'); ?>
				</div>
			</a>
		</div>
	</div>
<?php include_once 'common/footer.php';?>