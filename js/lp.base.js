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

	/*
     * Animate Class
     * {@param originNumArr} 需要变化的初始化数据
     * {@param targetNumArr} 数据的最终值
     * {@param speed} 动画持续时间
     * {@param easing} 动画特效
     * {@param step} 动画每一步需要执行的了函数，主要用于更新元素的样式值，其第一个参数是个数组，数组里为数据变化的当前值
     * {@param callback} 动画结束时的回调函数
     */
    var Animate = function(originNumArr,targetNumArr,speed,easing,step,callback){
        this.queue = [];
        this.duration = speed;
        this.easing = easing;
        this.step = step;
        this.callback = callback;
        for (var i = 0; i < originNumArr.length; i++){
            this.queue.push(new Animate.fx(originNumArr[i],targetNumArr[i]));
        }
        // begin animation
        this.begin();
    }

    Animate.prototype = {
        begin: function(){
            if(this._t) return ;
            var that = this;
            this.startTime = +new Date();
            // loop
            this._t = setInterval(function(){
                var dur = +new Date() - that.startTime;
                var queue = that.queue;
                if(dur > that.duration){
                    that.end();
                    // end Animate
                    return;
                }
                var easing = Animate.easing[that.easing] || Animate.easing.linear,
                    currValues = [];
                for (var i = 0,len = queue.length; i < len; i++){
                    currValues.push(queue[i].update(dur,that.duration,easing));
                }
                // run step to update
                that.step(currValues);
            },13);
        },
        // go to end of the animation
        end: function(){
            clearInterval(this._t);
            var queue = this.queue,
                currValues = [];
            for (var i = 0,len = queue.length; i < len; i++){
                currValues.push(queue[i].target);
            }
            this.step(currValues);
            // call callback function
            this.callback && this.callback();
        },
        turnTo: function( targetNumArr ){
            clearInterval(this._t);
            var that = this;
            // reset queue
            this.startTime = + new Date();
            for (var i = 0,len = that.queue.length; i < len; i++){
                that.queue[i] = new Animate.fx(that.queue[i].current,targetNumArr[i]);
            }
            // reset interval
            this._t = setInterval(function(){
                var dur = +new Date() - that.startTime;
                var queue = that.queue;
                if(dur > that.duration){
                    that.end();
                    // end Animate
                    return;
                }
                var easing = Animate.easing[that.easing] || Animate.easing.linear,
                    currValues = [];
                for (var i = 0,len = queue.length; i < len; i++){
                    currValues.push(queue[i].update(dur,that.duration,easing));
                }
                // run step to update
                that.step(currValues);
            } , 13);
        }
    }
    //
    Animate.fx = function(origin,target){
        this.origin = origin;
        this.target = target;
        this.dist = target - origin;
    }
    Animate.fx.prototype = {
        update: function(n,duration,easing){
            var pos = easing(n/duration, n , 0 ,1 , duration);
            this.current = this.origin + this.dist * pos;
            return this.current;
        }
    }
    // easing
    Animate.easing = {
        linear: function( p, n, firstNum, diff ) {
            return firstNum + diff * p;
        },
        swing: function( p, n, firstNum, diff ) {
            return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
        }
    };

	function showCategory(){
		if( $('.sec_gates').is(':visible') ){
			hideCategory();
			return;	
		} 

		$('.sec_brands').hide();
		var winHeight = $(window).height();
		$('.sec_gates').fadeIn()
			.promise()
			.then(function(){
				$('.gates-inner')
					.animate({
						marginTop: 0
					} , 1000 , 'easeOutBack' );
			});

		

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

		$(document.body).css('overflow' , 'hidden');
	}

	function hideCategory( cb ){
		$('.gates-inner')
			.animate({
				marginTop: '-100%'
			} , 1000 , 'easeInBack' )
			.promise()
			.then(function(){
				$('.sec_gates').fadeOut();
				cb && cb();
				$(document.body).css('overflow' , 'auto');
			});
	}

	function showBrands(){
		$('.sec_gates').hide();
		if( $('.sec_brands').is(':visible') ){
			hideBrands();
			return;
		}
		$('.sec_brands').show()
			.scrollTop(0)
			.css({
				top: $(window).scrollTop() + $('.header').height()
			});

		// hide slider video
		$('.home-slider .slider-item').each(function(){
			var video = $(this).data('video-object');
			video && video.pause();
		});

		$('.brands_tit').show().animate({
			marginTop: 0,
			marginBottom: 0
		} , 200 );

		var nums = $('.brands-con li .brands-mask').length;
		var index = 0;
		$('.brands-con li').css('opacity' , 1).each(function( i ){
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
								} , 300);
							$(this).find('.brands-mask')
								.css({
									display: 'block',
									opacity: 0.2
								})
								.delay( i * 200 )
								.animate({
									opacity: 0.6
								} , 200 );
							if( ++index == nums ){
								$('.brands-con').addClass('ready');
							}
						});
				});
		});	

		$(document.body).css('overflow' , 'hidden');
	}

	function hideBrands(){
		$('.brands_tit')
			.animate({
				marginTop: -176,
				marginBottom: 176
			} , 400 , '' , function(){
				// $(this).hide();
			} );

		var $lis = $('.brands-con li').each(function( i ){
			$(this).delay( 400 + 200 * i )
				.animate({
					marginLeft: -2000,
					opacity: 0
				} , 400 , '' , function(){
					if( i == $lis.length - 1 ){
						$('.brands_tit').hide();
						$('.sec_brands').fadeOut();
						$(document.body).css('overflow' , 'auto');
					}
				} );
		});
	}

	function fixImageToWrap( $wrap , $img ){
		var ratio = $img.height() / $img.width();
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

        $img.css({
        	width: vw,
        	height: vh,
        	marginTop: ( h - vh ) / 2,
        	marginLeft: ( w - vw ) / 2
        });
	}

	function initHomeNum(){
		$('.home_numtable .num').each(function(){
			var num = $(this).text();

			$(this).html( '<span>' + num + '</span>' ).data('num' , num);
			var $span = $(this).find('span');
			var width = $span.width();
			var height = $span.height();
			$span.css({
				height: height,
				width: width,
				display: 'block',
				position: 'relative',
				margin: '0 auto',
				overflow: 'hidden'
			}).html('');
			$.each( num.split('') , function( i ){
				$('<div>' + "1234567890".split('').join('<br/>') + '</div>').appendTo( $span )
					.css({
						position: 'absolute',
						left: i * width / num.length,
						top: -~~( Math.random() * 10 ) * height
					});
			});
		});
	}
	function startHomeNumAnimate(){
		var $nums = $('.home_numtable .num');
		var spanHeight = $nums.find('span').height();

		var st = new Date();
		var duration = 1000;
		var $divs = $nums.find('div');
		var interval = setInterval(function(){
			if( new Date - st >= duration ){
				$nums.each(function(){
					var num = $(this).data('num');
					var nums = num.split('');
					$(this).find('div').each(function( i ){
						$(this).animate({
							'top': - nums[i] * spanHeight 
						} , 200);
					});
				});
				clearInterval( interval );
				return false;
			}
			$divs.each(function(){
				$(this).css('top' , -( Math.random() * 10 ) * spanHeight );
			});
		} , 1000 / 15);
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
		LP.use('video-js' , function(){
            videojs.options.flash.swf = "/js/video-js/video-js.swf";
            var myVideo = videojs( id , config , function(){
            	var v = this;
            	var resizeFn = function(){
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
                    return false;
                }
                $(window).bind( 'resize.video-' + id , resizeFn )
                	.trigger('resize.video-' + id);

                $wrap.bind('resize.video-' + id , resizeFn);

                setTimeout(function(){
                	$wrap.find('.video-wrap').fadeIn();
                	if( config.autoplay )
                		myVideo.play();
                } , 20);

                $wrap.data('video-object' , v);

                cb && cb();
            } );
        });
	}




	// page init here
	// ============================================================================

	// window scroll event
	var $header = $('.header');
	var headerHeight = $header.height();


	// menu hover event
	// $('.CATEGORIES').hover(function(){
	// 	if( $('.sec_gates').is(':visible') ) return;
	// 	var winHeight = $(window).height();
	// 	$('.sec_gates').height( winHeight )
	// 		.css('top' , headerHeight - winHeight )
	// 		.show()
	// 		.animate({
	// 			top: headerHeight
	// 		} , 1000 , 'easeLightOutBack' , function(){
	// 			$(this).css({
	// 				height: 'auto'
	// 			});
	// 		} );

	// 	// render the letters
	// 	var letters = [];
	// 	$('.gates-inner-l a').each(function(){
	// 		var l = $.trim($(this).text())[0].toUpperCase();
	// 		if( $.inArray( l , letters ) < 0 ){
	// 			letters.push( l );
	// 		}
	// 	});

	// 	letters.sort();
	// 	var html = [];
	// 	$.each( letters , function( i , l ){
	// 		html.push('<li> <a data-a="filter-letter" href="#">' + l + '</a> </li>');
	// 	} );
	// 	$('.gates-inner-c ul').html( html.join('') );
	// });

	

	var isAtTop = false;
	var isAtBottom = false;
	var gatesScrollTop = 0;
	var runedNum = 0;
	var $gatesInnerL = 	$('.gates-inner-l').mousemove(function( ev ){
		var winHeight = $(window).height();

		if( ev.clientY < ( winHeight - headerHeight ) / 5 + headerHeight ){
			if( !isAtTop ){
				runedNum = 250;
				isAtTop = true;
				gatesScrollTop = $gatesInnerL.scrollTop();
			}
		} else if( ev.clientY + ( winHeight - headerHeight ) / 5 > winHeight ){
			if( !isAtBottom ){
				isAtBottom = true;
				runedNum = 250;
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

	var isAtLeft = false;
	var isAtRight = false;
	var $tarLi = null;
	var $firstdd = null;;
	var dtWidth = 438;
 	var $brandsCon = $('.brands-con').mousemove(function( ev ){
 		var off = $brandsCon.offset();
 		var width = $brandsCon.width();
 		var height = $brandsCon.height();
 		if( ev.pageX > off.left + dtWidth && ev.pageY > off.top && ev.pageY < off.top + height ){
 			if( ev.pageX - dtWidth - off.left < (width - dtWidth) * 0.1 ){
 				isAtLeft = true;
 			} else if( off.left + width - ev.pageX < (width - dtWidth) * 0.1 ){
 				isAtRight = true;
 			} else {
 				isAtLeft = false;
 				isAtRight = false;
 			}

 			$tarLi = $(ev.target).closest('li');
 			$firstdd = $tarLi.find('dd').eq(0);
 		} else {
 			isAtLeft = false;
 			isAtRight = false;
 		}
	}).hover(function(){} , function(){
		isAtLeft = false;
 		isAtRight = false;
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

		// fix brands_con
		if( $tarLi && $tarLi.length ){
			if( isAtLeft ){

				$firstdd
					.css('marginLeft' , Math.min( 0 ,  parseInt( $firstdd.css('marginLeft') ) + 2 ) );
			} else if ( isAtRight ){
				$firstdd
					.css('marginLeft' , Math.min( 0 ,  parseInt( $firstdd.css('marginLeft') ) - 2 ) );
			}
		}

	} , 1000 / 60);

	$('.gates-inner').click(function( ev ){
		var target = ev.target;
		if( target.tagName == 'LI' ){
			hideCategory();
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
	});


	var banphoConTimer ;
	var isInBanphoCon = false;
	var isHomeSliderMoviePlaying = false;
	// is playing just now
	var isCurrentPlaying = false;
	var isHeadHide = false;

	var pageManager = (function(){

		var pageInits = {
			'home-page' : function(){
				// init home scroll event
				var $homeCampaign = $('.home_campaign');
				var homeCampaignTop = $homeCampaign.offset().top;
				var firstCamItemTop = $('.cam_item').eq(0).offset().top;

				var $homeBio = $('.home_bio');
				var $homeBioBg = $('.home_bio_bg');
				var $homeNum = $('.home_num');
				var homeNumInit = false;
				var homeBioHeight = $homeBio.height();
				// header fixed effect
				$(window).scroll(function(){
					var stTop = $(window).scrollTop();

					// header fixed effect
					if( stTop >= $header.offset().top ){
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
					$homeBioBg.css('top' , - bgTop / 2 );

					// fix numbers
					if( !homeNumInit ){
						var homeNumTop  = $homeNum.offset().top;
						if( stTop + headerHeight > homeNumTop - 100 ){
							homeNumInit = true;
							startHomeNumAnimate();
						}
					}
				});

				// init home slider
				// ============================
				var firstLoaded = false;
				var $sliderInner = $('.slider-block-inner').css('width' , $('.slider-item').length + '00%');
				$(window).resize(function(){
					var winWidth = $(window).width();
					var winHeight = $(window).height();
					$('.slider-item').css('width' , winWidth).show();


					// resize slider height
					$sliderInner.height( winHeight - 60 );
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

		                    if( !firstLoaded ){
		                    	firstLoaded = true;
		                    	$sliderInner.find('.slider-item').css('opacity' , 1).hide().fadeIn();
		                    }
		                    
						})
						.attr('src' , $sliderInner.find('.slider-item>img').eq(0).attr('src'));

				})
				.trigger('resize');

				// var status = {};
				// var lastStatus = {};
				// // setInterval(function(){
				// // 	if( !status.moviePlaying ){
				// // 		$banphoCon.show();
				// // 	}
				// // } , 1000 / 60 );
				

				var $banphoCon = $('.banpho-con').hover(function(){
					clearTimeout( banphoConTimer );
					isInBanphoCon = true;
				} , function(){
					isInBanphoCon = false;
				});
				

				$(document.body).mousemove(function(){
					// if( status.moviePlaying ){
					// 	clearTimeout( status.banphoConTimer );
					// 	status.banphoConTimer = setTimeout(function(){
					// 		status.banphoConFadeOut = true;
					// 	} , 2000);
					// 	status.banphoConFadeIn = true;
					// }


					if( isHomeSliderMoviePlaying ){
						clearTimeout( banphoConTimer );
						banphoConTimer = setTimeout( function(){
							if( !isInBanphoCon ){
								$banphoCon.fadeOut();
								// resize the videos
								isHeadHide = true;
								var $inner = $('.slider-block-inner');
								var $item = $inner.children('.slider-item').eq( $inner.data('index') );
								$inner.animate({
									height: $(window).height()
								} , 500)
								.promise()
								.then(function(){
									clearInterval( interval );
								});

								var interval = setInterval(function(){
									$item.trigger('resize');
								} , 1000 / 30 );
							}
						} , 2000 );

						if( !isCurrentPlaying && !$banphoCon.is(':visible') ){
							$banphoCon.fadeIn();
						}

						if( isHeadHide ){
							isHeadHide = false;
							$('.slider-block-inner').animate({
								height: $(window).height() - $('.header').height()
							} , 500);
						}
					} else {
						clearTimeout( banphoConTimer );
						$banphoCon.fadeIn();
					}
				});

				// init home numbers
				initHomeNum();
			},
			'press-page': function(){
				var	$banpho = $('.banpho');
				var banphoTop = $banpho.offset().top;
				var banphoImgHeight = $('.banpho img').height();

				var $interviewList = $('.interview_list');
				$(window).scroll(function(){
					var stTop = $(window).scrollTop();

					// for top image
					if( stTop > banphoTop && stTop < banphoTop + banphoImgHeight ){
						$banpho.height( banphoTop + banphoImgHeight - stTop )
							.find('img')
							.css({
								marginTop: ( banphoImgHeight - ( banphoTop + banphoImgHeight - stTop ) ) / 2
							});
					}


					// for interview
					if( $interviewList.length && !$interviewList.data('init') ){
						if( stTop > banphoTop + banphoImgHeight / 2 ){
							$interviewList.data('init' , 1);
							$interviewList.children().each(function( i ){
								$(this).delay( 150 * i )
									.animate({
										opacity: 1,
										marginTop: 0
									} , 500 );
							});
						}
					}
				});
			}
		}


		return {
			go: function( url , type ){
				History.pushState({
					prev: location.href,
					type: type
                },  undefined , url );
			},
			init: function(){
				var $page = $('.page');
				var fn = pageInits[ $page.data('page') ];
				fn && fn();
			},
			desctory: function(){
				$(window).unbind('scroll');
				$(document.body).css('overflow' , 'auto');
			}
		}
	})();

	

	// change history
	LP.use('../plugin/history.js' , function(){
		History.replaceState( { prev: '' } , undefined , location.href  );
		pageManager.init( );
        // Bind to StateChange Event
        History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            var prev = State.data.prev;
            var type = State.data.type;
            switch( type ){
            	case 'press':
					$.get( location.href , '' , function( html ){
						html = $('<div>' + html + '</div>').find('#press-container')
							.html();
						$( '#press-container' ).children().animate({
							opacity: 0
						} , 500);
						setTimeout(function(){
							$( '#press-container' ).html( html )
								.children()
								.fadeIn();
							pageManager.desctory( );
        					pageManager.init( );
						} , 600);
					} );
					break;
				default: 
					$.get( location.href , '' , function( html ){
						html = $('<div>' + html + '</div>').find('.container')
							.html();
						$( '.container' ).children(':not(.header)').animate({
							opacity: 0
						} , 500);
						setTimeout(function(){
							$( '.container' ).html( html ).children('.page')
								.fadeIn();
							pageManager.desctory( );
        					pageManager.init( );
						} , 600);
					} );
            }
        });
	});


	// page actions here
	// ============================================================================
	LP.action('navitem' , function(){
		if($('.home-slider').length){
			// stop the movie
			$('.home-slider').find('.slider-item')
				.each(function(){
					$(this).data('video-object') && $(this).data('video-object').pause();
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
		var href = $(this).attr('href');

		pageManager.go( href );
		return false;
	});

	LP.action('show-category' , function(){
		var winTop = $(window).scrollTop();
		var sliderHeight = $('.home-slider').height();
		if( $('.home-slider').length && winTop < sliderHeight ){
			// scroll to $('.home-slider').height()
			$('html,body').animate({
				scrollTop: sliderHeight
			} , 500 )
			.promise()
			.then(showCategory);
		} else {
			showCategory();
		}

		// hide slider video
		$('.home-slider .slider-item').each(function(){
			var video = $(this).data('video-object');
			video && video.pause();
		});

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
		var index = $('.slider-block-inner').data('index');
		// get movie
		var $sliderItem = $('.slider-item').eq( index );
		var videoObject = $sliderItem.data('video-object');
		if( !videoObject ){
			var movie = $sliderItem.data('movie');
			$sliderItem.find('.video-wrap').remove();
			isHomeSliderMoviePlaying = true;
			renderVideo( $sliderItem , movie , $sliderItem.find('img').attr('src') , {
				ratio: $sliderItem.children('img').height() / $sliderItem.children('img').width(),
				autoplay: true
			} , function(){

				isCurrentPlaying = true;
				setTimeout(function(){
					isCurrentPlaying = false;
				} , 2000);
			});
		} else {
			if( isHomeSliderMoviePlaying ){
				isHomeSliderMoviePlaying = false;
				videoObject.pause();
			} else {
				isHomeSliderMoviePlaying = true;
				videoObject.play();
				isCurrentPlaying = true;
				setTimeout(function(){
					isCurrentPlaying = false;
				} , 2000);
			}
		}
		if( isHomeSliderMoviePlaying )
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
		var oriCss = {
				position: 'fixed',
				width: $img.width(),
				height: $img.height(),
				top: imgOff.top - $(window).scrollTop(),
				left: imgOff.left,
				zIndex: 200
			}
		var $wrap = $('<div></div>').appendTo(document.body)
			.css( oriCss )
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
			$(document.body).css('overflow' , 'hidden');
			renderVideo( $wrap , $dom.data('movie') , $img.attr('src') , {
				autoplay: true
			} , function(){
			} );
		} )
		.click(function(){
			$wrap.animate({
				width: oriCss.width,
				height: oriCss.height,
				top: oriCss.top,
				left: oriCss.left
			} , 500 )
			.promise()
			.then(function(){
				$(document.body).css('overflow' , 'auto');
				$(this).data('video-object').dispose();
				$(this).remove();
			});
		});
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

		var winTop = $(window).scrollTop();
		var sliderHeight = $('.home-slider').height();
		if( $('.home-slider').length && winTop < sliderHeight ){
			// scroll to $('.home-slider').height()
			$('html,body').animate({
				scrollTop: sliderHeight
			} , 500 )
			.promise()
			.then(showBrands);
		} else {
			showBrands();
		}
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
		var $dom = $(this);
		$('.brands_tit').animate({
				marginTop: -176,
				marginBottom: 176
			} , 400 , '' , function(){
				// $(this).hide();
			} );

		$('.brands-con li').each(function( i ){
			$(this).delay( 400 + 200 * i )
				.animate({
					marginLeft: -2000,
					opacity: 0
				} , 400 , '' , function(){
					if( i == $('.brands-con li').length - 1 ){
						$('.brands-con').hide();
						$('.brands_tit').hide();
						showTheMovie();
					}
				} );
		});

		// load movie on item
		// TODO...
		var itemIndex = 0;
		var $item = $('.brand_movie .brands-item').eq(itemIndex);

		renderVideo( $item , $item.data('movie') , $item.find('img').attr('src') , {
			autoplay: false
		} );

		function showTheMovie (){
			$('.brand_item_tit').show().animate({
				marginTop: 0,
				marginBottom: 0
			} , 500 );
			var $movieWrap = $('.brand_movie')//.height( $(window).height() - $('.header').height() - $('.brand_item_tit').height() )
				.delay(500)
				.fadeIn(function(){
					$item.data('video-object').play();
				});

			var winWidth = $(window).width();
			$movieWrap.find('.brands-item')
				.width( winWidth * 0.7 )
				.each(function(){
					fixImageToWrap( $(this) , $(this).find('img') );
				});

			$movieWrap.find('dl')
				.css({
					width: winWidth * $movieWrap.find('.brands-item').length,
					marginLeft: itemIndex * winWidth * 0.7
				});

			// play the video
			// resize the video
			$item.trigger('resize');
			
		}
	});

	LP.action('show-brands-big-movie' , function(){
		var $dom = $(this);
		if( $dom.attr('disabled') ) return ;
		$dom.attr('disabled' , 'disabled');

		var winWidth = $(window).width();
		var currIndex =  Math.round( Math.abs( parseInt( $dom.closest('dl').css('marginLeft') ) / winWidth / 0.7 ) );
		var itemIndex = $dom.prevAll('.brands-item').length;


		var $current = $dom.parent().children().eq( currIndex );
		var movieObject = $current.data('video-object');
		movieObject && movieObject.pause();


		var isShowBigVideo = !$dom.data('big-video');
		if( currIndex != itemIndex ){
			if( !isShowBigVideo ){
				$current.animate({
					width: winWidth * 0.7
				} , 800 );
				$dom.animate({
					width: winWidth * 0.9
				} , 800 )
				.promise()
				.then(function(){
					clearInterval( interval );
				});
				var interval = setInterval(function(){
					$dom.trigger('resize');
				} , 1000 / 60 );
			}


			$dom.parent().animate({
				marginLeft: - itemIndex * winWidth * 0.7 + ( !isShowBigVideo ? winWidth * 0.05 : 0 )
			} , 800 )
			.promise()
			.then(function(){
				var video = $dom.data('video-object');
				video && video.play();
				$dom.removeAttr('disabled');
			});

			if( !$dom.data('video-object') ){
				// render video
				renderVideo( $dom , $dom.data('movie') , $dom.find('img').attr('src') , {
				} );
			}
		} else {
			var interval ;
			if( isShowBigVideo ){
				interval = setInterval(function(){
					$dom.trigger('resize');
				} , 1000 / 60 );
			}

			$dom.animate({
				width: isShowBigVideo ? winWidth * 0.9 : winWidth * 0.7
			} , 600 , '' , function(){
				clearInterval( interval );
				movieObject && movieObject.play();

				$dom.removeAttr('disabled')
					.parent()
					.children()
					.data('big-video' , isShowBigVideo ? 1 : 0 );
			} )
			.parent()
			.animate({
				marginLeft: - winWidth * 0.7 * itemIndex + ( isShowBigVideo ? winWidth * 0.05 : 0 )
			} , 600 )
			.closest('.brand_movie')
			.animate(  {
				top: isShowBigVideo ? 0 : 88
			} , 600 );
		}
	});



	LP.action('search-toggle' , function(){
		$('.search-wrap').toggle();
		$(this).toggleClass('search-close');

		return false;
	});


	LP.action('pop_close' , function(){
		$('.pop:visible').animate({
			top: '100%',
			opacity: 0
		} , 500 )
		.promise()
		.then(function(){
			$(this).hide();
			$('.shade').fadeOut();
		});
	});


	var press_index = 0;
	LP.action('press_item' , function(){
		press_index = $(this).prevAll('.press_item').length;
		var $img = $(this).find('.cover_img');
		var width = $img.width();
		var height = $img.height();
		new Animate([ height / 2 , width / 2 , height / 2 , width / 2 ] , [0 , width , height , 0] , 500 , '' , function( nums ){
			$img[0].style.clip = 'rect(' + nums.join('px ') + 'px)';
		} , function(){
			$('.shade').fadeIn();
			$('.pop_press')
				.show()
				.animate({
					marginBottom:  - $('.pop_press').height() / 2
				} , 400 )
				.promise()
				.then(function(){
					$(this).css({
						top: '50%',
						marginTop: - $(this).height() / 2,
						marginBottom: 'auto',
						bottom: 'auto'
					});
					$('.pop_press_menus').animate({
						right: 0
					} , 300 , 'easeLightOutBack');
				});
		});
	});

	LP.action('press_next' , function(){
		// get next cover image
		press_index++;
		var $item = $('.press_item').eq( press_index );
		var imgSrc = $item.find('.cover_img').data('cover');
		if( !imgSrc ) return;
		$('<img/>').load(function(){
			$('.pop_presspho img').animate({
				marginLeft: '-70%',
				opacity: 0
			} , 500 )
			.promise()
			.then(function(){
				$(this).attr('src' , imgSrc)
					.css({
						marginLeft: '70%'
					})
					.animate({
						marginLeft: 0,
						opacity: 1
					} , 500);
			})
		}).attr('src' , imgSrc);
	});
	LP.action('press_prev' , function(){
		// get next cover image
		press_index--;
		var $item = $('.press_item').eq( press_index );
		var imgSrc = $item.find('.cover_img').data('cover');
		if( !imgSrc ) return;
		$('<img/>').load(function(){
			$('.pop_presspho img').animate({
				marginLeft: '70%',
				opacity: 0
			} , 500 )
			.promise()
			.then(function(){
				$(this).attr('src' , imgSrc)
					.css({
						marginLeft: '-70%'
					})
					.animate({
						marginLeft: 0,
						opacity: 1
					} , 500);
			})
		}).attr('src' , imgSrc);
	});


	LP.action('show-video-interview' , function(){
		var $item = $(this).closest('.interview_item');
		var $container = $item.data('media-dom');
		var $videoWrap = $container && $container.find('.interview-video');
		if( !$container ){
			$container = $('.<div class="interview-video-wrap">\
				<div class="interview-video"></div>\
				<div class="interview_share">share</div>\
			</div>').insertAfter( $item );

			$item.data('media-dom' , $container)
				.find('.interview_opt')
				.addClass('opened');


			$videoWrap = $container.find('.interview-video');

			// render video
			$videoWrap.css({marginTop: -480});
			renderVideo( $videoWrap , '../videos/0' , '../images/interview1.png' , {
				autoplay: false,
				controls: true
			} , function(){
				$('<div class="vjs-default-skin"></div>')
					.append( $videoWrap.find('.vjs-control-bar') )
					.appendTo( $videoWrap.parent() );

				// add big pause btn
				$videoWrap.data('video-object').on('play' , function(){
					var video = this;
					var $pauseBtn = $videoWrap.find('.vjs-big-pause-button');
					if( !$pauseBtn.length ){
						$pauseBtn = $('<div class="vjs-big-pause-button"></div>').insertAfter( $videoWrap.find('.vjs-big-play-button') )
							.click(function(){
								video.pause();
							});
					}
					$pauseBtn.show()
						.delay( 4000 )
						.fadeOut();
				});

				$videoWrap.data('video-object').on('pause' , function(){
					$videoWrap.find('.vjs-big-pause-button').hide();
				});
			});

			// start animate
			$videoWrap.animate({
				marginTop: 0
			} , 1000);
		} else {

			$item.removeData('media-dom')
				.find('.interview_opt')
				.removeClass('opened');

			$videoWrap.animate({
				marginTop: -480
			} , 1000)
			.promise()
			.then(function(){
				var video = $videoWrap.data('video-object');
				video && video.pause();
				$container.remove();
			});
		}
	});

	LP.action('show-music-interview' , function(){
		var $item = $(this).closest('.interview_item');
		var $container = $item.data('media-dom');
		var $musicWrap = $container && $container.find('.interview-music');
		if( !$container ){
			$container = $('<div class="interview-music-wrap">\
				<div class="interview-music" style="margin-top: -190px;">\
					<div class="interview-audio"></div>\
					<a href="javascript:;" class="jp-play" tabindex="1">play</a>\
					<a href="javascript:;" class="jp-pause" tabindex="1" style="display: none;">pause</a>\
					<div class="jp-current-time"></div>\
					<div class="jp-progress">\
						<div class="jp-seek-bar"><div class="jp-play-bar"></div></div>\
					</div>\
					<div class="interview_share">share</div>\
				</div>\
			</div>').insertAfter( $item );

			var randomId = 'audio-' + ( $.guid++ );
			$container.attr( 'id' , randomId );

			$item.data('media-dom' , $container)
				.find('.interview_opt')
				.addClass('opened');
			$musicWrap = $container.find('.interview-audio');

			// render audio
			LP.use(['../plugin/jquery.jplayer.min.js'] , function(){
			  	$musicWrap.jPlayer({
			  		wmode: "window",
					smoothPlayBar: true,
					keyEnabled: true,
					remainingDuration: true,
					toggleDuration: true,

			  		swfPath: '../',
					solution: 'html, flash',
					supplied: 'm4a, oga',
					preload: 'metadata',
					volume: 0.8,
					muted: false,
					cssSelectorAncestor: '#' + randomId,
					cssSelector: {
						videoPlay: '.jp-video-play',
						play: '.jp-play',
						pause: '.jp-pause',
						stop: '.jp-stop',
						seekBar: '.jp-seek-bar',
						playBar: '.jp-play-bar',
						mute: '.jp-mute',
						unmute: '.jp-unmute',
						volumeBar: '.jp-volume-bar',
						volumeBarValue: '.jp-volume-bar-value',
						volumeMax: '.jp-volume-max',
						playbackRateBar: '.jp-playback-rate-bar',
						playbackRateBarValue: '.jp-playback-rate-bar-value',
						currentTime: '.jp-current-time',
						duration: '.jp-duration',
						title: '.jp-title',
						fullScreen: '.jp-full-screen',
						restoreScreen: '.jp-restore-screen',
						repeat: '.jp-repeat',
						repeatOff: '.jp-repeat-off',
						gui: '.jp-gui',
						noSolution: '.jp-no-solution'
					},
					errorAlerts: false,
					warningAlerts: false,
			   		ready: function () {
					    $(this).jPlayer("setMedia", {
					    	m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
 							oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
					    });

					    $container.find('.interview-music')
					    	.animate({
					    		marginTop: 0
					    	} , 500 );
			    	}
			  	});
			});
		} else {
			$container.find('.interview-music')
		    	.animate({
		    		marginTop: -190
		    	} , 500 )
		    	.promise()
		    	.then(function(){
		    		if( $container.find('.jp-pause')
							.is(':visible') ){
						$container.find('.jp-pause').trigger('click');
					}

					$container.remove();
		    	});

		    $item.removeData('media-dom')
				.find('.interview_opt')
				.removeClass('opened');
		}
		
	});


	LP.action('press_crumbs_link' , function(){
		var $dom = $(this);
		if( $dom.hasClass('active') ) return false;

		var index = $dom.index();
		$dom.parent().find('a')
			.removeClass('active')
			.eq(0)
			.animate({
				marginLeft: [150,0,-150][index]
			} , 500);

		var width = $dom.width();
		var $wrap = $('<div><div></div></div>').find('div')
			.html( $dom.html() )
			.css('marginLeft' , -width / 2)
			.end()
			.appendTo(this);
		$wrap.css({
			position: 'absolute',
			top: 0,
			left: '50%',
			width: 0,
			color: '#000',
			overflow: 'hidden',
			whiteSpace: 'nowrap'
		})
		.delay( 500 )
		.animate({
			width: width,
			marginLeft: - width / 2
		} , 1000)
		.find('div')
		.delay( 500 )
		.animate({
			marginLeft: 0
		} , 1000)
		.promise()
		.then(function(){
			$dom.addClass('active');
			$wrap.remove();
		});


		// load press page
		pageManager.go( $dom.attr('href') , 'press' );

		return false;
	});


	LP.action('pop-mask' , function(){
		LP.triggerAction('pop_close');
	});
});
