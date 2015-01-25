<?php include_once 'common/header.php';?>
<div class="shade" data-a="pop-mask"></div>
<div class="pop pop_press">
	<div class="pop_presspho" style="overflow:hidden;width:785px;"><img src="../images/presspop_pho.jpg" /></div>
	<div class="pop_press_menus">
		<p class=" popicon popclose " data-a="pop_close"></p>
		<p class=" popicon popnext " data-a="press_next"></p>
		<p class=" popnum ">1/12</p>
		<p class=" popicon popprev " data-a="press_prev" ></p>
		<p class=" popdownicon " data-a="press_prev"></p>
	</div>
</div>
<div class="page" data-page="interview-page" data-header="press">
	<!-- page title -->
	<?php 
	$top_title = 'PRESS';
	$pagetit = 'INTERVIEW';
	include_once 'common/pagetit.php';?>


	<!-- section -->
	<div class="section sec_press">
		<div>
			<!--  -->
			<div class="press_txt">
				<?php _e('Ici un texte de presentation<br />de chapitre utile pour le referencement'); ?>
			</div>
			<!--  -->
			<div id="press-container" class="interview_list cs-clear">
			</div>
		</div>
	</div>
<?php include_once 'common/footer.php';?>