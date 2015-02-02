	<div class="banner_footer">
		<div class="banft_txt">
			<p><?php _e('“il n’est de richesse que d’homme.”');?></p>
			<span><?php _e('Rene Char');?></span>
		</div>
	</div>
</div>
	<!-- footer -->
	<div class="footer">
		<div class="ft_con cs-clear">
			<div class="ft_mod ft_find">
				<h3><?php _e('FOLLOW US');?></h3>
				<div class="ft_mbd ft_findmbd cs-clear" id="share-wrap">
					<a href="#" class="find_item icon_fb"></a>
					<a href="#" class="find_item icon_wb"></a>
					<a href="#" class="find_item icon_tw"></a>
					<a href="#" class="find_item icon_ch"></a>
					<a href="#" class="find_item icon_hb"></a>
					<a href="#" class="find_item icon_yk"></a>
					<a href="#" class="find_item icon_yt"></a>
				</div>
			</div>
			<div class="ft_mod ft_paris">
				<h3><?php _e('PARIS');?></h3>
				<div class="ft_mbd">
				    <p><?php _e('PARIS_ADDR_L1');?></p>
				    <p><?php _e('PARIS_ADDR_L2');?></p>
				    <p><?php _e('PARIS_ADDR_L3');?></p>
				    <p><?php _e('PARIS_ADDR_L4');?></p>
				</div>
			</div>
			<div class="ft_mod ft_shanghai">
				<h3><?php _e('SHANGHAI');?></h3>
				<div class="ft_mbd">
					<p><?php _e('SHANGHAI_ADDR_L1');?></p>
                    <p><?php _e('SHANGHAI_ADDR_L2');?></p>
                    <p><?php _e('SHANGHAI_ADDR_L3');?></p>
				</div>
			</div>
			<div class="ft_mod ft_network">
				<h3><?php _e('OUR MEDIAS');?></h3>
				<div class="ft_mbd ft_workmbd" id="icon-wrap">
					<a href="#" class="work_item icon_bg"></a>
					<a href="#" class="work_item icon_bk"></a>
					<a href="#" class="work_item icon_cc"></a>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/tpl" id="video-pause-tpl"><div class="transition"><?php _e('PAUSE'); ?><br><br><?php _e('PAUSE'); ?></div></script>
<script type="text/tpl" id="video-play-tpl"><div class="transition"><?php _e('PLAY MOVIE'); ?><br><br><?php _e('PLAY MOVIE'); ?></div></script>
<script type="text/tpl" id="brand_big_text_year">
<p class="brand_big_text_year">#[year]</p>
<div class="brand_big_text_item" style="width:80%;">
  <p class="brand_big_text_tit">#[title]</p>
  <p class="brand_big_text_val">#[label]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[id_visible]>
  <p class="brand_big_text_tit">&nbsp;</p>
  <p class="brand_big_text_val">##[id]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[fid_customer_visible]>
  <p class="brand_big_text_tit"><?php _e('CLIENT');?></p>
  <p class="brand_big_text_val">#[brand]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[year_visible]>
  <p class="brand_big_text_tit"><?php _e('YEAR');?></p>
  <p class="brand_big_text_val">#[year]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[agency_visible]>
  <p class="brand_big_text_tit"><?php _e('AGENCY');?></p>
  <p class="brand_big_text_val">#[agency]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[cpgn_type_visible]>
  <p class="brand_big_text_tit"><?php _e('GENRE');?></p>
  <p class="brand_big_text_val">#[cpgn_type]</p>
</div>
<div class="brand_big_text_item" #[territory_visible]>
  <p class="brand_big_text_tit"><?php _e('TERRITORY');?></p>
  <p class="brand_big_text_val">#[territory]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[director_visible]>
  <p class="brand_big_text_tit"><?php _e('DIRECTOR');?></p>
  <p class="brand_big_text_val">#[director]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[photographer_visible]>
  <p class="brand_big_text_tit"><?php _e('PHOTOGRAPHY');?></p>
  <p class="brand_big_text_val">#[photographer]</p>
  <p class="brand_big_text_val">&nbsp;</p>
</div>
<div class="brand_big_text_item" #[results_visible]>
  <p class="brand_big_text_tit"><?php _e('RESULT');?></p>
   #[results] 
</div>
</script>
<script type="text/javascript" src="/js/plugin/modernizr-2.5.3.min.js"></script>
<script type="text/javascript" src="/js/sea/sea-debug.js" data-config="/js/config.js"></script>
<script type="text/javascript" src="/js/sea/plugin-shim.js"></script>
<script type="text/javascript" src="/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="/js/lp.core.js"></script>
<script type="text/javascript" src="/js/lp.base.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false"></script>
<!--IE6透明判断-->
<!--[if IE 6]>
<script src="js/DD_belatedPNG.js"></script>
<script>
    DD_belatedPNG.fix('*');
    document.execCommand("BackgroundImageCache", false, true);
</script>
<![endif]-->
</body>
</html>
