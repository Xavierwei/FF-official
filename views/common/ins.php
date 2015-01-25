<?php

function getLang(){
	$lang = isset( $_COOKIE['lang'] ) ? $_COOKIE['lang'] : '';
	if(  empty( $lang ) ){
		$lang = 'eng';
	}
	return $lang;
}

function setLang( $lang ){
	$_COOKIE['lang'] = $lang;
}

function getStrings(){
	static $strings;
	if( $strings ){
		return $strings;
	}
	$lang = getLang();

	$strings = require_once ROOT . '/views/langs/' . $lang . '.php';
	return $strings;
}

function _e( $str ){
	$strings = getStrings();
	echo !isset( $strings[ $str ] ) || empty( $strings[ $str ] ) ? $str : $strings[ $str ];
}