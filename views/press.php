<?php include_once 'common/header.php';?>
<div class="page" data-page="press-page" data-header="press">
	<!-- page title -->
	<?php 
	$top_title = _e('PRESS',false);
	$pagetit = _e('PRESS',false);
	include_once 'common/pagetit.php';?>

	<!-- section -->
	<div class="section sec_press">
		<!--  -->
		<div id="press-container" >
			<div class="press_txt"><span id="press-num" class="intoview-effect" data-effect="number-rock"></span> <?php _e('PRESS ARTICLES'); ?></div>
			<!--  -->
			<?php for( $i = date('Y') ; $i >= 1999 ; $i-- ){ ?>
				<div class="press_year"><span class="intoview-effect" data-effect="number-rock"><?php echo $i; ?></span></div>
				<div class="press_list column cs-clear intoview-effect" data-effect="press-loading" data-year="<?php echo $i; ?>">
					<div class="ploading-wrap" style="position: relative;height: 200px;"><div class="loading" style="position: absolute;"></div></div>
				</div>
			<?php } ?>
		</div>
		<!--  -->
	</div>
<?php include_once 'common/footer.php';?>