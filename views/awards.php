<?php include_once 'common/header.php';?>
<div class="page" data-page="awards-page" data-header="awards">
	<!-- page title -->
	<?php
	$pagetit = _e('AWARDS',false);
	include_once 'common/pagetit.php';?>
	
	<!-- section -->
	<div class="section sec_awards">
		<div class="sectit"><h2><span class="intoview-effect" data-effect="number-rock" id="awards-number"></span> <span style="vertical-align:middle;"><?php _e('INTERNATIONAL AWARDS'); ?></span></h2></div>
		<div data-effect="fadeup" class="intoview-effect awardicons cs-clear column">
			<img data-num="40" src="../images/award_img1.png" />
			<img data-num="60" src="../images/award_img2.png" />
			<img data-num="8" src="../images/award_img3.png" />
			<img data-num="108" src="../images/award_img5.png" />
			<img data-num="518" src="../images/award_img6.png" />
			<img data-num="518" src="../images/award_img7.png" />
			<img data-num="518" src="../images/award_img5.png" />
		</div>
		<div data-effect="fadeup" class="intoview-effect awardfilter column cs-clear">
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="year"><option value=""><?php _e('YEAR');?></option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="brand"><option value=""><?php _e('BRANDS');?></option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="award"><option value=""><?php _e('AWARDS');?></option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item awardfilter_item2">
				<a data-a="awardfilter" id="awardfilter" class="awardfilter_btn transition-wrap">
                    <div class="transition">
                    	<?php _e('FILTER');?><br><br>
                    	<?php _e('FILTER');?>
                    </div>
				</a>
			</div>
		</div>
		<!--  -->
		<div data-effect="fadeup" class="intoview-effect awardlist column">
			<table id="list-table" class="take-no-space">
			</table>
		</div>
		<!--  -->
	</div>
<?php include_once 'common/footer.php';?>