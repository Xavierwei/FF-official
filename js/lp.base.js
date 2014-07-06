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




	// page init here
	// ============================================================================
	var $header = $('.header');
	var headerHeight = $header.height();
	var headerTop = $header.offset().top;

	var $homeCampaign = $('.home_campaign');
	var homeCampaignTop = $homeCampaign.offset().top;
	var firstCamItemTop = $('.cam_item').eq(0).offset().top;

	var $homeBio = $('.home_bio');
	var homeBioHeight = $homeBio.height();
	// header fixed effect
	$(window).scroll(function(){
		var stTop = $(window).scrollTop();

		// header fixed effect
		if( stTop > headerTop ){
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

	var $page = $('.page');
	switch( $page.data('page') ){
		case 'home-page':
			// init home slider
			// ============================
			$('.slider-block-inner').css('width' , $('.slider-item').length + '00%');
			$(window).resize(function(){
				$('.slider-item').css('width' , $(window).width()).show();
			})
			.trigger('resize');

			var banphoConTimer ;
			var isInBanphoCon = false;
			var isMoviePlaying = false;
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
					$banphoCon.fadeIn();
				}
			});

	}





	// page actions here
	// ============================================================================
	LP.action('home-slider-left' , function(){
		var $inner = $('.slider-block-inner');
		var index =  parseInt( $inner.data('index') );
		var len = $('.slider-item').length;
		if( index == 0 ){ return false; }

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

		$inner.animate({
			marginLeft: '-=100%'
		} , 500);

		$inner.data('index' , index + 1 );
		$('.banpho-i').html( ( index + 2 ) + '/' + len );
	});

	LP.action('home-play-movie' , function(){
		isMoviePlaying = true;
		var index = $('.slider-block-inner').data('index');
		// get movie
		var $sliderItem = $('.slider-item').eq( index );
		

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



	LP.action('search-toggle' , function(){
		$('.search-wrap').toggle();
		$(this).toggleClass('search-close');

		return false;
	});


});
