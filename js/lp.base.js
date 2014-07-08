/*
 * page base action
 */
LP.use(['jquery' ,'easing'] , function( $ ){
	'use strict'

	// page components here
	// ============================================================================	
	$.easing.easeLightOutBack = function (x, t, b, c, d, s) {
		if (s == undefined) s = 0.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}

	function renderVideo ( $wrap , movie , poster , config , cb ){
		var id = 'video-js-' + ( $.guid++ );
		$wrap.append( LP.format( '<div class="video-wrap" style="display:none;"><video id="#[id]" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"\
            preload="auto"\
              poster="#[poster]">\
             <source src="#[videoFile].mp4" type="video/mp4" />\
             <source src="#[videoFile].webm" type="video/webm" />\
             <source src="#[videoFile].ogv" type="video/ogg" />\
        </video></div>' , {id: id  , videoFile: movie , poster: poster}));

		config = $.extend( { "controls": false, "autoplay": false, "preload": "auto","loop": true, "children": {"loadingSpinner": false} } , config || {} );
		var ratio = config.ratio || 3/4;
		console.log( ratio );
		LP.use('video-js' , function(){
            videojs.options.flash.swf = "/js/video-js/video-js.swf";
            var myVideo = videojs( id , config , function(){
            	var v = this;
                $(window).bind( 'resize.video-' + id , function(){
                    var w = $wrap.width()  ;
                    var h = $wrap.height() ;
                    var vh = 0 ;
                    var vw = 0 ;
                    if( h / w > ratio ){
                        vh = h + 40;
                        vw = vh / ratio;
                    } else {
                        vw = w + 40;
                        vh = vw * ratio;
                    }
                    v.dimensions( vw , vh );

                    $('#' + v.Q).css({
                        "margin-top": ( h - vh ) / 2,
                        "margin-left": ( w - vw ) / 2
                    });
                })
                .trigger('resize.video-' + id);

                setTimeout(function(){
                	$wrap.find('.video-wrap').fadeIn();
                	myVideo.play();
                } , 20);

                cb && cb();
            } );

			$wrap.data('video-object' , myVideo);
        });
	}




	// page init here
	// ============================================================================

	// window scroll event
	var $header = $('.header');
	var headerHeight = $header.height();

	var $homeCampaign = $('.home_campaign');
	var homeCampaignTop = $homeCampaign.offset().top;
	var firstCamItemTop = $('.cam_item').eq(0).offset().top;

	var $homeBio = $('.home_bio');
	var homeBioHeight = $homeBio.height();
	// header fixed effect
	$(window).scroll(function(){
		var stTop = $(window).scrollTop();

		// header fixed effect
		if( stTop > $header.offset().top ){
			$header.addClass('header-fixed');
		} else {
			$header.removeClass('header-fixed');
		}

		// homeCampaign animate
		if( !$homeCampaign.data('animate') && ( headerHeight + stTop > homeCampaignTop 
		|| firstCamItemTop < stTop + $(window).height() ) ){
			$homeCampaign.data('animate' , 1);
			$homeCampaign.find('.cam_item')
				.each(function( i ){
					$(this).delay( i * 200 )
						.animate({
							marginTop: 0
						} , 600 , 'easeLightOutBack');
				});
			$('.home_cambtn').delay( 4 * 200 )
				.animate({
					bottom: 90
				} , 600 , 'easeLightOutBack' );
		}

		// fix $homeBio background image
		var homeBioTop = $homeBio.offset().top;
		var bgTop = homeBioTop - headerHeight - stTop;
		// 1094 is background image's height
		bgTop = Math.max( 0 , bgTop );

		if( bgTop < 1094 ){
			$homeBio.css({
				backgroundPosition: 'center -' + bgTop + 'px'
			});
		}
	});

	// menu hover event
	$('.CATEGORIES').hover(function(){
		if( $('.sec_gates').is(':visible') ) return;
		var winHeight = $(window).height();
		$('.sec_gates').height( winHeight )
			.css('top' , headerHeight - winHeight )
			.show()
			.animate({
				top: headerHeight
			} , 1000 , 'easeLightOutBack' , function(){
				$(this).css({
					height: 'auto'
				});
			} );

		// render the letters
		var letters = [];
		$('.gates-inner-l a').each(function(){
			var l = $.trim($(this).text())[0].toUpperCase();
			if( $.inArray( l , letters ) < 0 ){
				letters.push( l );
			}
		});

		letters.sort();
		var html = [];
		$.each( letters , function( i , l ){
			html.push('<li> <a data-a="filter-letter" href="#">' + l + '</a> </li>');
		} );
		$('.gates-inner-c ul').html( html.join('') );
	});


	var isAtTop = false;
	var isAtBottom = false;
	var gatesScrollTop = 0;
	var runedNum = 0;
	var $gatesInnerL = 	$('.gates-inner-l').mousemove(function( ev ){
		if( ev.clientY < 50 + headerHeight ){
			if( !isAtTop ){
				runedNum = 200;
				isAtTop = true;
				gatesScrollTop = $gatesInnerL.scrollTop();
			}
		} else if( ev.clientY + 50 > $(window).height() ){
			if( !isAtBottom ){
				isAtBottom = true;
				runedNum = 200;
				gatesScrollTop = $gatesInnerL.scrollTop();
			}
		} else {
			isAtTop = false;
			isAtBottom = false;
		}
	}) . hover(function(){

	} , function(){
		isAtTop = false;
		isAtBottom = false;
	});

	setInterval(function(){
		if( isAtTop ){
			runedNum++;
			gatesScrollTop -= runedNum / 50;
			$gatesInnerL.scrollTop( gatesScrollTop );
		} else if( isAtBottom ) {
			runedNum++;
			gatesScrollTop += runedNum / 50;
			$gatesInnerL.scrollTop( gatesScrollTop );
		}
	} , 1000 / 60);


	var $page = $('.page');
	switch( $page.data('page') ){
		case 'home-page':
			// init home slider
			// ============================
			var $sliderInner = $('.slider-block-inner').css('width' , $('.slider-item').length + '00%');
			$(window).resize(function(){
				var winWidth = $(window).width();
				var winHeight = $(window).height();
				$('.slider-item').css('width' , winWidth).show();


				// resize slider height
				$sliderInner.height( winHeight );
				// resize the slider images
				$('<img />')
					.load(function(){
						var ratio = this.height / this.width;
						var w = winWidth ;
	                    var h = winHeight ;
	                    var vh = 0 ;
	                    var vw = 0 ;
	                    if( h / w > ratio ){
	                        vh = h + 40;
	                        vw = vh / ratio;
	                    } else {
	                        vw = w + 40;
	                        vh = vw * ratio;
	                    }
	                    $sliderInner.find('.slider-item>img').css({
	                    	width: vw,
	                    	height: vh,
	                    	marginTop: ( h - vh ) / 2,
	                    	marginLeft: ( w - vw ) / 2
	                    });
					})
					.attr('src' , $sliderInner.find('.slider-item>img').eq(0).attr('src'));

			})
			.trigger('resize');

			var banphoConTimer ;
			var isInBanphoCon = false;
			var isMoviePlaying = false;
			// is playing just now
			var isCurrentPlaying = false;
			var $banphoCon = $('.banpho-con').hover(function(){
				clearTimeout( banphoConTimer );
				isInBanphoCon = true;
			} , function(){
				isInBanphoCon = false;
			});
			

			$(document.body).mousemove(function(){
				if( isMoviePlaying ){
					clearTimeout( banphoConTimer );
					banphoConTimer = setTimeout( function(){
						if( !isInBanphoCon )
							$banphoCon.fadeOut();
					} , 2000 );

					if( !isCurrentPlaying ){
						$banphoCon.fadeIn();
					}
				}
			});


			$('.brands-con li').hover(function(){
				var $els = $(this).find('.brands-mask').animate({
					opacity: 0.2
				});

			} , function(){
				$(this).find('.brands-mask').animate({
					opacity: 0.7
				});
			})

	}





	// page actions here
	// ============================================================================
	LP.action('navitem' , function(){
		if($('.home-slider').length){
			// stop the movie
			$('.home-slider').find('.slider-item')
				.each(function(){
					$(this).data('movie-object') && $(this).data('movie-object').pause();
				});

			// hide the slider
			$('.home-slider').animate({
				height: 0
			} , 500 , '' , function(){
				$(this).remove();
			});

			// scroll to top 
			$('html,body').animate({
				scrollTop: 0
			} , 500);
		}

		// load next page


		return false;
	});
	LP.action('home-slider-left' , function(){
		var $inner = $('.slider-block-inner');
		var index =  parseInt( $inner.data('index') );
		var len = $('.slider-item').length;
		if( index == 0 ){ return false; }

		// stop current video
		var video = $('.slider-item').eq( index )
			.data('video-object');
		video && video.pause();

		$inner.animate({
			marginLeft: '+=100%'
		} , 500);

		$inner.data('index' , index - 1 );
		$('.banpho-i').html( index + '/' + len );
	});
	LP.action('home-slider-right' , function(){
		var $inner = $('.slider-block-inner');
		var index =  parseInt( $inner.data('index') );
		var len = $('.slider-item').length;
		if( index == len - 1 ){ return false; }

		// stop current video
		var video = $('.slider-item').eq( index )
			.data('video-object');
		video && video.pause();

		$inner.animate({
			marginLeft: '-=100%'
		} , 500);

		$inner.data('index' , index + 1 );
		$('.banpho-i').html( ( index + 2 ) + '/' + len );
	});

	LP.action('home-play-movie' , function(){
		isCurrentPlaying = true;
		setTimeout(function(){
			isCurrentPlaying = false;
		} , 2000);

		var index = $('.slider-block-inner').data('index');
		// get movie
		var $sliderItem = $('.slider-item').eq( index );
		var movie = $sliderItem.data('movie');
		$sliderItem.find('.video-wrap').remove();

		renderVideo( $sliderItem , movie , $sliderItem.find('img').attr('src') , {
			ratio: $sliderItem.children('img').height() / $sliderItem.children('img').width()
		} , function(){
			isMoviePlaying = true;
		});
		
		$('.banpho-con').fadeOut();
	});

	LP.action('home_newsnext' , function(){
		var width = $('.home_news').width();
		var index = $('.home_news').data('index');

		var $children = $('.home_news_inner').children();
		if( index == $children.length - 1 ){
			return false;
		}
		$('.home_news').data('index' , index + 1);
		$children.eq(index)
			.animate({
				opacity: 0
			} , 500)

			.end()
			.eq( index + 1 )
			.css('opacity' , 0)
			.delay( 700 )
			.animate({
				opacity: 1
			} , 400);

		$('.home_news_inner')
			.animate({
				marginLeft: "-=" + width
			} , 1000 , function(){
				$('.home_newspage span').html( ( index + 2 ) + '/' + $children.length );
			} );

		return false;
	});
	LP.action('home_newsprev' , function(){
		var width = $('.home_news').width();
		var index = $('.home_news').data('index');

		var $children = $('.home_news_inner').children();
		if( index == 0 ){
			return false;
		}
		$('.home_news').data('index' , index - 1);
		$children.eq(index)
			.animate({
				opacity: 0
			} , 500)

			.end()
			.eq( index - 1 )
			.css('opacity' , 0)
			.delay( 700 )
			.animate({
				opacity: 1
			} , 400);

		$('.home_news_inner')
			.animate({
				marginLeft: "+=" + width
			} , 1000 , function(){
				$('.home_newspage span').html( ( index ) + '/' + $children.length );
			} );

		return false;
	});

	LP.action('home-cam-item' , function(){
		var $dom = $(this);
		var $img = $dom.find('img');
		var imgOff = $img.offset();
		var $wrap = $('<div></div>').appendTo(document.body)
			.css({
				position: 'fixed',
				width: $img.width(),
				height: $img.height(),
				top: imgOff.top - $(window).scrollTop(),
				left: imgOff.left,
				zIndex: 200
			})
			.append($img.clone()
				.css({
					width: '100%',
					height: '100%'
				}));

		// zoom out
		$wrap.animate({
			width: $(window).width(),
			height: $(window).height(),
			top: 0,
			left: 0
		} , 500 , '' ,function(){
			renderVideo( $wrap , $dom.data('movie') , $img.attr('src') , {

			} );
		} );
	});

	LP.action('home-loadmore' , function(){
		var $dom = $(this);
		// loading
		var i = 0;
		var round = ['left' , 'bottom' , 'right' , 'top'];
		var interval = setInterval(function(){
			$dom.css('border-' + round[ i % 4 ] + '-color' ,(~~( i / 4 )) % 2 == 0 ? 'red' : 'black' );
			i++;			
		} , 100 );

		// TODO .. get data from server

		setTimeout(function(){
			var $homeCamcon = $('.home_camcon');
			$homeCamcon.height( $homeCamcon.height() );

			$($('.cam_item').clone()
				.splice(0 , 3))
				.removeAttr('style')
				.appendTo( $homeCamcon )
				.each(function( i ){
					$(this).delay( 300 + ( i + 1 ) * 200 )
						.animate({
							marginTop: 0
						} , 600 , 'easeLightOutBack');
				});

			$homeCamcon.animate({
				height: $homeCamcon.height() + $('.cam_item').height()
			} , 600 );

			clearInterval( interval );

			$dom.css('border-color' , 'black');
		} , 700);

		return false;
	});

	LP.action('show-brands' , function(){
		// TODO:: loading data from server
		setTimeout(function(){
			$('.sec_gates').hide();
			$('.sec_brands').show();

			$('.brands_tit').animate({
				marginTop: 0,
				marginBottom: 0
			} , 200 );

			$('.brands-con li').each(function( i ){
				$(this).delay( 400 * i )
					.animate({
						marginLeft: 0
					} , 400 )
					.promise()
					.then(function(){
						$(this).find('dd')
							.each(function( i ){
								$(this).delay( i * 150 )
									.animate({
										width: 320
									} , 200);
								$(this).find('.brands-mask')
									.css({
										display: 'block',
										opacity: 0.2
									})
									.delay( i * 200 )
									.animate({
										opacity: 0.6
									} , 100 );
							});
					});
			});	

		} , 1000);

		return false;
	});

	LP.action('filter-letter' , function(){
		if( $(this).hasClass('active') ){
			$(this).removeClass('active');
		} else {
			$(this).closest('ul')
				.find('a')
				.removeClass('active');
			$(this).addClass('active');
		}
		LP.triggerAction('filter-category' , {category: $('.gates-inner-r a.active').data('category')});
		return false;
	});


	LP.action('filter-category' , function( data ){
		var category = data.category || $(this).data('category');
		$(this).closest('ul')
			.find('a')
			.removeClass('active');
		$(this).addClass('active');

		
		var $showLi = null;
		var $hideLi = null;
		if( !category ){
			$showLi = $('.gates-inner-l li');
		} else {
			$showLi = $('.gates-inner-l a[data-category!="' + category + '"]').parent();
			$hideLi = $('.gates-inner-l a[data-category="' + category + '"]').parent();
		}

		var $realShowLi = $();
		var $realHideLi = $hideLi || $();
		var letter = $.trim( $('.gates-inner-c a.active').text() );
		$showLi.each(function(){
			var text = $.trim( $(this).text() );
			if( !letter || text[0].toUpperCase() == letter ){
				$(this).slideDown();
				$realShowLi.add( this );
			} else {
				$(this).slideUp();
				$realHideLi.add( this );
			}
		});

		$realShowLi.slideDown();
		$realHideLi.slideUp();
		console.log( $realShowLi , $realHideLi );
		return false;
	});

	LP.action('brands-item' , function(){
		$('.brands_tit').animate({
				marginTop: -176,
				marginBottom: 176
			} , 200 );

		$('.brands-con li').each(function( i ){
			$(this).delay( 200 * i )
				.animate({
					marginLeft: -2000
				} , 400 )
				.promise()
				.then(function(){
					
				});
		});	
	});

	LP.action('search-toggle' , function(){
		$('.search-wrap').toggle();
		$(this).toggleClass('search-close');

		return false;
	});


});
