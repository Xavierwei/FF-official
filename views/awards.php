<?php include_once 'common/header.php';?>
<div class="page" data-page="awards-page" data-header="awards">
	<!-- page title -->
	<?php 
	$pagetit = 'AWARDS';
	include_once 'common/pagetit.php';?>
	
	<!-- section -->
	<div class="section sec_awards">
		<div class="sectit"><h2><span class="intoview-effect" data-effect="number-rock" id="awards-number"></span> <span style="vertical-align:middle;">INTERNATIONAL AWARDS</span></h2></div>
		<div data-effect="fadeup" class="intoview-effect awardicons cs-clear column">
			<img data-num="40" src="../images/award_img1.png" />
			<img data-num="60" src="../images/award_img2.png" />
			<img data-num="8" src="../images/award_img3.png" />
			<span class="award-num">
				20
			</span>
			<img data-num="108" src="../images/award_img5.png" />
			<img data-num="518" src="../images/award_img6.png" />
			<img data-num="518" src="../images/award_img7.png" />
			<img data-num="518" src="../images/award_img5.png" />
		</div>
		<div data-effect="fadeup" class="intoview-effect awardfilter column cs-clear">
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="year"><option value="">year</option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="brand"><option value="">brand</option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item">
				<a class="selitem ">
					<select id="award"><option value="">award</option>
					</select>
				</a>
			</div>
			<div class="awardfilter_item awardfilter_item2">
				<button data-a="awardfilter" id="awardfilter" class="awardfilter_btn">FILTER</button>
			</div>
		</div>
		<!--  -->
		<div data-effect="fadeup" class="intoview-effect awardlist column">
			<table id="list-table">
				
			</table>
		</div>
		<!--  -->
	</div>
<?php include_once 'common/footer.php';?>