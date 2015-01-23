<?php

include 'RestApi.php';

/*
 * Config
 */

$accessToken = "14273804-BZybnslIEqwect35wQEfuglwLXi5POXth5iO8cztM";
$accessTokenSecret = "RWO1RiU2DkCIPPCIujYKLpGfanB7oMIVlxXPWcWs1SYQU";
$consumerKey = "zNyPmytRlTBHor3iAW5LVg";
$consumerSecret = "7qEjep4r2G4DaCeZ4gBvZnKnhFjNbOkIeGD9zdP3Ps";


/*
 * Create new RestApi instance
 * Consumer key and Consumer secret are required
 * Access Token and Access Token secret are required to use api as a user
 */
$twitter = new \TwitterPhp\RestApi($consumerKey,$consumerSecret,$accessToken,$accessTokenSecret);

/*
 * Connect as application
 * https://dev.twitter.com/docs/auth/application-only-auth
 */
$connection = $twitter->connectAsApplication();

/*
 * Collection of the most recent Tweets posted by the user indicated by the screen_name, without replies
 * https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
 */
$data = $connection->get('/statuses/user_timeline',array('screen_name' => 'FredFarid', 'count' => 3, 'exclude_replies' => 'true'));

$user = $connection->get('/users/lookup',array('screen_name' => 'FredFarid'));

$result = Array("status"=>$data,"user"=>$user);

$twitter_data = json_encode($result);

print_r($twitter_data);
?>