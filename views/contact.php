<?php include_once 'common/header.php';?>
<div class="page" data-page="contact-page" data-header="contact">
  <!-- page title -->
  <?php $top_title= _e( 'CONTACT', false); $pagetit= _e( 'COMMUNICATION AGENCIES', false); include_once 'common/pagetit.php';?>

  <!-- section -->
  <div class="section sec_contact column">
    <!--  -->
    <h2 class="contact_tit">
		<?php _e('Fred & Farid is a digital creative agency<br /> based in shanghai and paris'); ?>
	</h2>
    <!--  -->
    <div class="contact_item"></div>
  </div>
  <div data-effect="fadeup" class="intoview-effect contact_map" id="map">
  </div>
  <?php include_once 'common/footer.php';?>