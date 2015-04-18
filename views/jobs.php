<?php include_once 'common/header.php';?>
<!--  -->
<div class="page" data-page="jobs-page" data-header="jobs">
	<!-- page title -->
	<?php 
	$top_title = _e('ABOUT',false);
	$pagetit = _e('JOBS',false);
	include_once 'common/pagetit.php';?>

	<!-- section -->
    <h2 class="job_tit">
        <?php _e('JOB TITLE'); ?>
        <ul class="f-c cs-clear" >
            <li><input type="checkbox" id="shanghai" data-city="SHANGHAI" /><label data-a="jobFilter" for="shanghai">Shanghai</label></li>
            <li><input type="checkbox" id="beijing" data-city="BEIJING"/><label data-a="jobFilter"  for="beijing">Beijing</label></li>
            <li><input type="checkbox" id="paris" data-city="PARIS" /><label data-a="jobFilter" for="paris">Paris</label></li>
            <li><input type="checkbox" id="new_york" data-city="NEW YORK" /><label data-a="jobFilter" for="new_york">New York</label></li>
        </ul>
    </h2>
	<div class="section sec_jobs">

		<div class="jobslist column cs-clear">
		</div>
		<!--  -->
	</div>
<?php include_once 'common/footer.php';?>