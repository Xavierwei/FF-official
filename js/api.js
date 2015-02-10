/*
 * api 管理 
 */

define(function( require , exports , model ){

	// http://backoffice.fredfarid.com/eng/ws/
	var baseUrl = '/api/proxy.php'; 

	var __AJAX_CACHE__ = {};

	var localStoragePaths = [];//['pages_contents/awards','pages_contents/footer_icons','pages_contents/brands','pages_contents/categorys'];
	return {
		getServiceCampaigns: function( serviceId, success ){
			api.require('extended/service_' + serviceId + '_campaigns', success);
			// var path = 'services/' + serviceId;
			// if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
			// 	var result = localStorage.getItem( path );
			// 	if( result ){
			// 		success && success( JSON.parse( result ) );
			// 		return;
			// 	}
			// }

			// var cacheKey = path;

			// if( __AJAX_CACHE__[cacheKey] ){
			// 	success && success( __AJAX_CACHE__[cacheKey] );
			// } else {
			// 	$.post( baseUrl , {wsExtraRequest: 'getServiceCampaigns', serviceID: serviceId, outputFormat: 'json'} , function( r ){
			// 		success && success( r );
			// 		__AJAX_CACHE__[cacheKey] = r;
			// 		if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
			// 			localStorage.setItem( path, JSON.stringify( r ) );
			// 		}
			// 	}, 'json');
			// }
		},
		getBrandCampaigns: function( brandId, success ){
			api.require('extended/brand_' + brandId + '_campaigns', success);
			// var path = 'brands/' + brandId;
			// if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
			// 	var result = localStorage.getItem( path );
			// 	if( result ){
			// 		success && success( JSON.parse( result ) );
			// 		return;
			// 	}
			// }

			// var cacheKey = path;

			// if( __AJAX_CACHE__[cacheKey] ){
			// 	success && success( __AJAX_CACHE__[cacheKey] );
			// } else {
			// 	$.post( baseUrl , {wsExtraRequest: 'getBrandCampaigns', brandID: brandId, outputFormat: 'json'} , function( r ){
			// 		success && success( r );
			// 		__AJAX_CACHE__[cacheKey] = r;
			// 		if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
			// 			localStorage.setItem( path, JSON.stringify( r ) );
			// 		}
			// 	}, 'json');
			// }
		},
		// extraRequest: function( data, success ){
		// 	var cacheKey = LP.json2query( data );
		// 	if( window.localStorage && $.inArray( cacheKey, localStoragePaths ) >= 0 ){
		// 		var result = localStorage.getItem( cacheKey );
		// 		if( result ){
		// 			success && success( JSON.parse( result ) );
		// 			return;
		// 		}
		// 	}

		// 	data.outputFormat = 'json';

		// 	if( __AJAX_CACHE__[cacheKey] ){
		// 		success && success( __AJAX_CACHE__[cacheKey] );
		// 	} else {
		// 		$.post( baseUrl , data , function( r ){
		// 			success && success( r );
		// 			__AJAX_CACHE__[cacheKey] = r;
		// 			if( window.localStorage && $.inArray( cacheKey, localStoragePaths ) >= 0 ){
		// 				localStorage.setItem( cacheKey, JSON.stringify( r ) );
		// 			}
		// 		}, 'json');
		// 	}
		// },
        localRequest: function( url, success ){
            var cacheKey = url;
            if( window.localStorage && $.inArray( cacheKey, localStoragePaths ) >= 0 ){
                var result = localStorage.getItem( cacheKey );
                if( result ){
                    success && success( JSON.parse( result ) );
                    return;
                }
            }


            if( __AJAX_CACHE__[cacheKey] ){
                success && success( __AJAX_CACHE__[cacheKey] );
            } else {
                $.get( url , function( r ){
                    success && success( r );
                    __AJAX_CACHE__[cacheKey] = r;
                    if( window.localStorage && $.inArray( url, localStoragePaths ) >= 0 ){
                        localStorage.setItem( cacheKey, JSON.stringify( r ) );
                    }
                }, 'json');
            }
        },
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

			// save cache to localStorage
			if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
				var result = localStorage.getItem( path );
				if( result ){
					success && success( JSON.parse( result ) );
					return;
				}
			}


			params.contentPaths = path.replace(/pages_contents\//g,'');

			var paths = params.contentPaths.split(',');

			var successIndex = 0;
			var totalItems = [];
			$.each( paths, function(i , path){
				params.contentPaths = path;
				var cacheKey = path + LP.json2query ( params );
				if( __AJAX_CACHE__[cacheKey] ){
					successIndex++;
					totalItems = totalItems.concat( __AJAX_CACHE__[cacheKey].items || [] );
					if( successIndex == paths.length ){
						success && success( {items: totalItems} );
					}
				} else {
					return $.ajax({
						url: baseUrl,
						data: params,
						type: 'post',
						dataType: 'json',
						success: function( r ){
							successIndex++;

							__AJAX_CACHE__[cacheKey] = r;
							totalItems = totalItems.concat( r.items || [] );
							if( successIndex == paths.length ){
								success && success( {items: totalItems} );
							}
						},
						error: function(){
							successIndex++;
							if( successIndex == paths.length ){
								success && success( {items: totalItems} );
							}
						}
					});
				}
			});

			// var cacheKey = path + LP.json2query ( params );
			// if( __AJAX_CACHE__[cacheKey] ){
			// 	success && success( __AJAX_CACHE__[cacheKey] );
			// } else {
			// 	return $.post( baseUrl , params , function( r ){
			// 		success && success( r );
			// 		__AJAX_CACHE__[cacheKey] = r;

			// 		if( window.localStorage && $.inArray( path, localStoragePaths ) >= 0 ){
			// 			localStorage.setItem( path, JSON.stringify( r ) );
			// 		}
			// 	} , 'json' );
			// }
		}
	}
});