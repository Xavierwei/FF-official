/*
 * api 管理 
 */

define(function( require , exports , model ){

	// http://backoffice.fredfarid.com/eng/ws/
	var baseUrl = '../api/proxy.php'; 

	var __AJAX_CACHE__ = {};
	return {
		request: function( path , params , success ){
			if( Object.prototype.toString.call( params ) == '[object Function]' ){
				success = params;
				params = {};
			} else {
				params = params || {};
			}

			params.outputFormat = 'json';

			if(Object.prototype.toString.call(path) == '[object Array]'){
				var contentPaths = [];
			 	$.each( path , function( i , item ){
			 		contentPaths.push( 'pages_contents/' + item );
				} );
			 	path = contentPaths.join(',');
			} else {
				path = 'pages_contents/' + path;
			}


			params.contentPaths = path;

			var cacheKey = path + LP.json2query ( params );
			if( __AJAX_CACHE__[cacheKey] ){
				success( __AJAX_CACHE__[cacheKey] );
			} else {
				return $.post( baseUrl , params , function( r ){
					success( r );
					__AJAX_CACHE__[cacheKey] = r;
				} , 'json' );
			}

			
		}
	}
});