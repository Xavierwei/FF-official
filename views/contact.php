<?php include_once 'common/header.php';?>
<div class="page" data-page="contact-page" data-header="contact">
  <!-- page title -->
  <?php $top_title = _e('CONTACT', false);
$pagetit = _e('COMMUNICATION AGENCIES', false);include_once 'common/pagetit.php';?>

  <!-- section -->
  <div class="section sec_contact column">
    <!--  -->
    <h2 class="contact_tit"><?php _e('NEWS_HOMEPAGE');?></h2>
    <!--  -->
    <div id="contact_item" class="contact_item"></div>
    <div id="contact_mail" class="contact_item">
      <h3 data-effect="fadeup" class="contact_page_department" style="text-align:center;">
      </h3>
      <div class="contact_con cs-clear" style="text-align:center;">
      </div>
    </div>
  </div>
  <div data-effect="fadeup" class="intoview-effect contact_map" id="map">
  </div>
  <?php include_once 'common/footer.php';?>