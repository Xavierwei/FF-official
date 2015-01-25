<div class="pagetit">
	<div class="pagetit-inner">
		<div class="column">
			<h1> <?php echo $pagetit; ?></h1>
			<a href="#" class="pagetitarr pagetitarrtop transition" data-a="page-pagetitarrtop"></a>
			<a href="#" class="pagetitarr pagetitarrbottom transition" data-a="page-pagetitarrbottom"></a>
		</div>
	</div>
</div>
<!-- banner -->

<?php if( $pagetit == 'FF BIO' ){ ?>
<div class="banpho home-slider">
	<!-- <a href="#" class="ffwheel-close"></a> -->
	<div class="slider-block-inner cs-clear" id="slider-block-inner" data-index="0">
		<div class="slider-item" style="display:block;" data-movie="../videos/0"><img id="slider-img-1" src="../images/INDEX_pho.jpg" /></div>
		<div class="slider-item" data-movie="../videos/0"><img src="../images/INDEX_pho.jpg" /></div>
		<div class="slider-item" data-movie="../videos/0"><img src="../images/INDEX_pho.jpg" /></div>
		<div class="slider-item" data-movie="../videos/0"><img src="../images/INDEX_pho.jpg" /></div>
	</div>
	<div class="banpho-con" data-height="188">
		<div class="showreel-tit">
			<h3></h3><p></p><p></p>
		</div>
		<div class="banpho-bt">
			<a href="javascript:;" data-a="home-slider-left" class="banpho-bt-l transition"></a>
			<div class="banpho-bt-c" data-a="home-play-movie">
				<div class="transition">play movie<br/><br/>play movie</div>
			</div>
			<a href="javascript:;" data-a="home-slider-right" class="banpho-bt-r transition"></a>
		</div>
		<div class="banpho-i">1/12</div>
	</div>
</div>
<?php } else { ?>
<div class="banpho  banpho-img">
	<img src="../images/<?php echo str_replace(' ', '', $pagetit); ?>_pho.jpg" />
</div>
<?php } ?>


<?php if( isset( $top_title ) && $top_title == 'ABOUT' ){ ?>
<div class="column">
	<div class="about_crumbs crumbs">
		<span>
			<!-- <a href="./group" data-a="press_crumbs_link">ff group</a> /  -->
			<a href="/bio" data-a="press_crumbs_link">ff bio</a> / 
			<a href="/ffshowreel" data-a="press_crumbs_link">ff showreel</a> / 
			<a href="/people" data-a="press_crumbs_link">key people</a> /
			<a href="/jobs" data-a="press_crumbs_link">jobs</a>
		</span>
	</div>
</div>
<?php } else if( isset( $top_title ) && $top_title == 'PRESS' ){ ?>
<div class="column">
	<div class="about_crumbs crumbs">
		<span>
			<a href="/press" data-a="press_crumbs_link">press</a> / 
			<a href="/interview" data-a="press_crumbs_link">interview</a>
		</span>
	</div>
</div>
<?php } ?>