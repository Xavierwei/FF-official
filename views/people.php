<?php include_once 'common/header.php';?>
<div class="page" data-page="people-page" data-header="about">
	<!-- page title -->
	<?php 
	$top_title = _e('ABOUT',false);
	$pagetit = _e('KEY PEOPLE',false);
	include_once 'common/pagetit.php';?>

	<!-- section -->
	<div class="section sec_people column">
		<!--  -->
		<h2 class="contact_tit intoview-effect" data-effect="fadeup">
			<?php _e('Nine key people leads the group in all field <br>like strategic, creation etc.'); ?>
		</h2>
		<!--  -->
		<div id="people-wrap">
		</div>
	</div>
<?php include_once 'common/footer.php';?>