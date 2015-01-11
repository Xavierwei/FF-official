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
<div class="banpho  banpho-img"><img src="../images/<?php echo str_replace(' ', '', $pagetit); ?>_pho.jpg" />
<?php if( $pagetit == 'FF BIO' ){ ?>
	<a href="#" class="show-reel transition-wrap" data-a="showreel">
		<div class="transition">SHOW REEL<br><br>SHOW REEL</div>
	</a>
<?php } ?>
</div>

<?php if( isset( $top_title ) && $top_title == 'ABOUT' ){ ?>
<div class="column">
	<div class="about_crumbs crumbs">
		<span>
			<!-- <a href="./group.php" data-a="press_crumbs_link">ff group</a> /  -->
			<a href="./bio.php" data-a="press_crumbs_link">ff bio</a> / 
			<a href="./ffshowreel.php" data-a="press_crumbs_link">ff showreel</a> / 
			<a href="./people.php" data-a="press_crumbs_link">key people</a> /
			<a href="./jobs.php" data-a="press_crumbs_link">jobs</a>
		</span>
	</div>
</div>
<?php } else if( isset( $top_title ) && $top_title == 'PRESS' ){ ?>
<div class="column">
	<div class="about_crumbs crumbs">
		<span>
			<a href="./press.php" data-a="press_crumbs_link">press</a> / 
			<a href="./interview.php" data-a="press_crumbs_link">interview</a>
		</span>
	</div>
</div>
<?php } ?>