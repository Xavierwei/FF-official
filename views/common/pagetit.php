<div class="pagetit">
	<div class="column">
		<h1> <?php echo $pagetit; ?></h1>
		<a href="#" class="pagetitarr pagetitarrtop transition" data-a="page-pagetitarrtop"></a>
		<a href="#" class="pagetitarr pagetitarrbottom transition" data-a="page-pagetitarrbottom"></a>
	</div>
</div>
<!-- banner -->
<div class="banpho  banpho-img"><img src="../images/<?php echo $pagetit; ?>_pho.jpg" />
<?php if( $pagetit == 'ABOUT' ){ ?>
	<a href="#" class="show-reel transition-wrap">
		<div class="transition">SHOW REEL<br><br>SHOW REEL</div>
	</a>
<?php } ?>
</div>