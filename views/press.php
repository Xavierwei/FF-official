<?php include_once 'common/header.php';?>
<div class="shade" data-a="pop-mask"></div>
<div class="pop pop_press">
	<div class="pop_presspho"></div>
	<div class="pop_press_menus">
		<p class="popicon popclose transition" data-a="pop_close"></p>
		<p class="popicon popnext transition" data-a="press_prev"></p>
		<p class="popnum"><span class="pop_index">1</span>/<span class="pop_total">12</span></p>
		<p class="popicon popprev transition" data-a="press_next" ></p>
		<a class="popdownicon transition" target="_blank" href="#"></a>
	</div>
</div>
<div class="page" data-page="press-page" data-header="press">
	<!-- page title -->
	<?php 
	$top_title = 'PRESS';
	$pagetit = 'PRESS';
	include_once 'common/pagetit.php';?>

	<!-- section -->
	<div class="section sec_press">
		<!--  -->
		<div id="press-container" >
			<div class="press_txt"><?php _e('Ici un texte de presentation<br />de chapitre utile pour le referencement'); ?></div>
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