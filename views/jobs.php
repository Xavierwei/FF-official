<?php include_once 'common/header.php';?>
<!--  -->
<div class="page" data-page="jobs-page" data-header="about">
	<!-- page title -->
	<?php 
	$top_title = _e('ABOUT',false);
	$pagetit = _e('JOBS',false);
	include_once 'common/pagetit.php';?>

	<!-- section -->
    <h2 class="job_tit">
        <?php _e('JOB TITLE'); ?>
        <ul class="f-c cs-clear">
            <li><input type="checkbox"/><label for=""><span>Shanghai</span></label></li>
            <li><input type="checkbox"/><label for=""><span>Beijing</span></label></li>
            <li><input type="checkbox"/><label for=""><span>Paris</span></label></li>
            <li><input type="checkbox"/><label for=""><span>New York</span></label></li>
        </ul>
    </h2>
	<div class="section sec_jobs">

		<div class="jobslist column cs-clear">
		</div>
		<!--  -->
	</div>
<?php include_once 'common/footer.php';?>