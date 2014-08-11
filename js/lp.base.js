/*
 * page base action
 */
LP.use(['jquery' ,'easing' , '../api'] , function( $ , easing , api ){
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
    }

    // show image in the biggest view
    // and make img auto move effect
    function imageZoom( item ){
        loadingMgr.show('black');
        var src = brandItemManager.getPath( item , 'media' );

        var $wrap = $('<div class="image-zoom-big"><img/></div>').appendTo(document.body)
            .hide()
            .fadeIn();

            // // set image src
            // .find('img')
            // .attr('src' , $imgs.attr('src').replace(/picture_1\/[^/]+$/ , 'media/' + $brandsItem.data('media') ) )

            // .end();

        // TODO:: need to fix image width auto and height auto , show real big image
        var $img = $wrap.find('img').css({
            position: 'absolute',
            // width: 'auto',
            // width: '150%',
            // height: 'auto'
        }).load(function(){
            loadingMgr.hide();
            var imgWidth = $img.width();
            var imgHeight = $img.height();
            var st = $(window).scrollTop();



            $wrap.on('mousemove' , function( ev ){
                var winHeight = $(window).height();
                var winWidth = $(window).width();

                left = - 2 * ev.pageX / winWidth * ( imgWidth - winWidth ) / 2;
                top = - 2 * ( ev.pageY ) / winHeight * ( imgHeight - winHeight ) / 2;
                runAnimate();
            });
        })
        .attr('src' , src);


        var top = 0;
        var left = 0;

        var interval;
        var runAnimate = function(){
            clearInterval( interval ) ;

            var duration = 800;
            var start = new Date();
            var ltop = parseInt( $img.css('top') ) || 0;
            var lleft = parseInt( $img.css('left') ) || 0;
            var ctop = top - ltop;
            var cleft = left - lleft;
            interval = setInterval(function(){
                // t: current time, b: begInnIng value, c: change In value, d: duration
                //x, t, b, c, d
                var dur = ( new Date() - start ) / duration;
                var per =  dur > 1 ? 1 : $.easing.easeOutQuart( 0 , dur , 0 , 1 , 1 );

                $img.css({
                    top: ltop + ctop * per,
                    left: lleft + cleft * per
                });

                if( per == 1 ){
                    clearInterval( interval )
                }
            } , 1000 / 60 );
        }
    }


    // brand item manager , you should get items from this object's function 'getItems'
    // It would save the ajax cache and add some useful properties to every items
    var brandItemManager = (function(){
        var __CACHE_AJAX__ = {};
        var __CACHE_ITEM__ = {};
        var __CACHE_BRAND__ = {};

        var index = 0;

        return {
            dump: function(){
                console.log( __CACHE_ITEM__ );
                console.log( __CACHE_AJAX__ );
            },
            getBrands: function( path , success ){
                if( __CACHE_AJAX__[ path ] ){
                    success && success( __CACHE_AJAX__[ path ] );
                } else {
                    return api.request( path , function( r ){
                        __CACHE_AJAX__[ path ] = r;

                        $.each( r.items ,  function( i , it ){
                            __CACHE_BRAND__[ path + '/' + it.path ] = it;
                        });
                        success && success( r );
                    } );
                }
            },
            getBrand: function( path , success ){
                if( __CACHE_BRAND__[ path ] )
                    success && success( __CACHE_BRAND__[ path ] );
                else {
                    var paths = path.split('/');
                    this.getBrands( [paths[0],paths[1]].join('/') , function( r ){
                        success && success( __CACHE_BRAND__[ path ] );
                    } );
                }
            },
            // path ==> //  {category|brand|service}/{cat_path}
            getItems: function( path , param , success ){
                // var paths = path.split('/');
                var ckey = path;
                if( $.isPlainObject(param) ){
                    ckey = path + LP.json2query( param );
                }
                if( $.isFunction( param ) ){
                    success = param;
                    param = '';
                }
                if( __CACHE_AJAX__[ckey] ){
                    success && success( __CACHE_AJAX__[ckey] );
                } else {
                    return api.request( path , param , function( r ){
                        __CACHE_AJAX__[ckey] = r;
                        // fix items, add key and brand attribute to then
                        $.each( r.items || [] , function( i , item ){
                            // save path
                            item.brand_path = path;
                            // save cache key
                            var ckey = 'item-' + ( ++index );
                            item.key = ckey;
                            __CACHE_ITEM__[ ckey ] = item;

                        } );

                        success && success( r );
                    } );    
                }
            },
            // get item from it's key
            get: function( key ){
                return __CACHE_ITEM__[ key ];
            },
            // get network resource path 
            // base on brand and item info to get image path or video path
            // this is works for videos also;
            // item ==> {object|string}
            getPath: function( item , type ){
                // treat as key
                if( !$.isPlainObject( item ) ){
                    item = this.get( item );
                }

                var rpath = 'http://www.fredfarid.com/eng/file/pages_contents/#[brand_path]/#[type]/#[name]';
                return LP.format( rpath , {
                    brand_path: item.brand_path,
                    //path: item.path,
                    type: type,
                    name: item[type],
                } );
            }
        }
    })();

    window.brandItemManager = brandItemManager;


    // base on brand and item info to get image path or video path
    // this is works for videos also;
    // function getItemPath( item , type ){
    //     var rpath = 'http://www.fredfarid.com/eng/file/pages_contents/categories/#[brand]/#[path]/#[type]/#[name]';
    //     return LP.format( rpath , {
    //         brand: item.brand,
    //         path: item.path,
    //         type: type,
    //         name: item[type],
    //     } );
    // }


    function disposeVideo(){
        $(document.body).find('.video-wrap').parent()
            .each(function(){
                var video = $(this).data('video-object');
                try{video && video.dispose();}catch(e){}
                $(this).removeData('video-object').find('.video-wrap').remove();
            });
    }

   	function textEffect( $dom ){
   		var width = $dom.width();
		var $wrap = $('<div><div></div></div>').find('div')
			.html( $dom.html() )
			.css('marginLeft' , -width / 2)
			.end()
			.appendTo( $dom );
		$wrap.css({
			position: 'absolute',
			top: 0,
			left: '50%',
			width: 0,
			color: '#000',
			overflow: 'hidden',
			whiteSpace: 'nowrap'
		})
		.delay( 300 )
		.animate({
			width: width,
			marginLeft: - width / 2
		} , 300)
		.find('div')
		.delay( 300 )
		.animate({
			marginLeft: 0
		} , 300)
		.promise()
		.then(function(){
			//$dom.addClass('active');
			//$wrap.remove();
		});
   	}

    function initSelect( $select ){
    	$select.each(function(){
    		var $options = $(this).find('option');
    		var index = $options.filter(':selected').index();
    		var value = $(this).val();
    		$(this).hide();
    		var $wrap = $('<div><span class="selitem_tips">' + value + '</span><ul class="select-options"></ul></div>')
    			.insertAfter( this );

    		var ahtml = [];
    		$options.each(function(){
    			ahtml.push('<li>' + $(this).text() + '</li>');
    		});

    		$wrap
    			.find('.selitem_tips')
    			.click(function(){
    				$wrap.find('ul').fadeIn();
    				return false;
    			})
    			.end()
    			.find('ul').html( ahtml.join('') )
    			.on('click' , 'li' , function(){
    				$wrap.find('span').html( $(this).text() );
    				index = $(this).index();
    				$options.eq( index ).attr('selected' , 'selected');
    			});

    		$(document.body).click(function(){
    			$wrap.find('ul').fadeOut();
    		});

    	});
    }

    function intMouseMoveEffect( $dom , staticFn , moveFn , time ){
    	var timer = null;
    	var moving = true;
    	$dom.mousemove(function( ev ){
    		clearTimeout( timer );
    		
    		timer = setTimeout(function(){
    			moving = false;
    			staticFn( ev );
    		} , time || 2000 );
    		if( !moving ){
    			moveFn( ev );
    		}
    		moving = true;
    	});
    }

    function unInitImageMouseMoveEffect( $dom ){
        $dom.unbind('.image-effect');
        $dom.find('.clone-img').fadeOut( 400 , function(){
            $(this).remove();
        } );
    }

    function initImageMouseMoveEffect( $dom , onZoom ){
    	// if( $dom.data('image-init') ) return;
        $dom.unbind('.image-effect');

    	var $img = $dom.find('img');
    	var imgWidth = $img.width();
    	var imgHeight = $img.height();
    	var fixWidth = imgWidth * 0.1;
    	var fixHeight = imgHeight * 0.1;
    	var $cloneImg =  null ;

    	var off = null;
    	var domWidth = null;
    	var domHeight = null;

    	var init = false;
        var top = 0;
        var left = 0;

        var initFn = function(){
            $img = $dom.find('img');
            imgWidth = $img.width();
            imgHeight = $img.height();
            fixWidth = imgWidth * 0.05;
            fixHeight = imgHeight * 0.05;
            $cloneImg =  null ;

            off = null;
            domWidth = null;
            domHeight = null;
            init = false;

        }


        var interval;
        var runAnimate = function( $img ){
            clearInterval( interval ) ;

            var duration = 800;
            var start = new Date();
            var ltop = parseInt( $img.css('top') ) || 0;
            var lleft = parseInt( $img.css('left') ) || 0;
            interval = setInterval(function(){
                // t: current time, b: begInnIng value, c: change In value, d: duration
                //x, t, b, c, d
                var dur = ( new Date() - start ) / duration;
                var per =  dur > 1 ? 1 : $.easing.easeOutQuart( 0 , dur , 0 , 1 , 1 );

                $img.css({
                    top: ltop + (top - ltop) * per,
                    left: lleft + (left - lleft) * per
                });

                if( per == 1 ){
                    clearInterval( interval )
                }
            } , 1000 / 60 );
        }

        // var animate = null;
        $dom.on('reisze.image-effect' , function(){
            // initFn();
            // domWidth = $dom.width();
            // domHeight = $dom.height();

            // if( $cloneImg ){
            //     $cloneImg.css({
            //         width: imgWidth,
            //         height : imgHeight,
            //         marginLeft : $dom.find('img').css('marginLeft'),
            //         marginTop : $dom.find('img').css('marginTop')
            //     });
            // }

        }).on('mouseenter.image-effect' , function(){
            onZoom && onZoom();

            var $cImgs = $(this).find('.clone-img');
    		// if( $cImgs.length ){
      //           $cImgs.last().prevAll('.clone-img').remove();
      //           $cloneImg = $cImgs.last();
    		// }
            // if( $cloneImg ){
            //     $cloneImg.remove();
            //     $cloneImg = null;
            // }
            

            initFn();

    		off = $dom.offset();
    		domWidth = $dom.width();
    		domHeight = $dom.height();

    		init = false;
    		$cloneImg = $cImgs.length ? $cImgs.stop(true , true) : $img.clone().css({
	    		position: 'absolute',
	    		top: 0,
	    		left: 0
	    	})
            .addClass('clone-img')
	    	.appendTo( $dom );

    		$cloneImg.animate({
    			top: - fixHeight,
    			left: - fixWidth,
    			width: imgWidth + 2 * fixWidth,
    			height: imgHeight + 2 * fixHeight,
                opacity: 1
    		} , 500 )
    		.promise()
    		.then(function(){
    			init = true;
    		});
    	}).on('mouseleave.image-effect' , function(){
            clearInterval( interval );
    		if( !$cloneImg ) return;

    		$cloneImg.animate({
    			top: 0,
    			left: 0,
    			width: imgWidth,
    			height: imgHeight
    		} , 500 )
    		.promise()
    		.then(function(){
                $cloneImg && $cloneImg.fadeOut(300 , function(){
                    $cloneImg && $cloneImg.remove();
                    $cloneImg = null;
                });
    		});
    	})
    	.on('mousemove.image-effect' , function( ev ){
    		if( !off ) return;
    		var px = ev.pageX - off.left;
    		var py = ev.pageY - off.top;
    		var lx , ly;
    		lx = ( domWidth / 2 - px );
    		ly = ( domHeight / 2 - py );
    		if( init ){
                top =  - fixHeight + ly / (domHeight / 2) * fixHeight;
                left = - fixWidth + lx / (domWidth / 2) * fixWidth;
                runAnimate( $cloneImg );
    		}
    	});
    }


    // show big brand item
    function showBigBrandsItem( path , itemIndex ){
        loadingMgr.show('black');
        // prev dealing
        disposeVideo();
        $('.sec_brands').scrollTop(0);
        $('.brand_movie').data( 'index' , itemIndex );


        var afterItemsRender = function( item ){

            var winWidth = $(window).width();

            // bind resize event
            $(window).unbind('resize.brand_movie').bind('resize.brand_movie' , function(){
                var $items = $('.brand_movie').find('.brands-item');
                var winWidth = $(window).width();
                var isFullScreen = $('.brand_movie').data('isFullScreen');
                $('.brand_movie').find('ul')
                    .css({
                        width: $items.length * winWidth,
                        marginLeft: - $('.brand_movie').data('index') * winWidth * 0.7 + ( isFullScreen ? winWidth * 0.05 : winWidth * 0.15 )
                    })
                    .children()
                    .width( winWidth * 0.7 )
                    .eq( $('.brand_movie').data('index') )
                    .width( isFullScreen ? winWidth * 0.9 : winWidth * 0.7 );

                //$('.brand_big_prev,.brand_big_next').css('width' , isFullScreen ? winWidth * 0.05 : winWidth * 0.15 );

            });

            // render brand_big_prev and brand_big_next status
            // if( itemIndex == 0 ){
            //     $('.brand_big_prev').fadeOut();
            // } else if( itemIndex == $('.brand_movie').find('.brands-item').length - 1 ){
            //     $('.brand_big_next').fadeOut();
            // }

            $('.brand_movie').find('.brands-mask').show().hover(function(){
                $(this).animate({
                    opacity: 0.2
                } , 300);
            } , function(){
                $(this).animate({
                    opacity: 0.79
                } , 300);
            });
            var $bigItem = $('.brand_movie').find('.brands-item').eq( itemIndex );
            // hide the mask
            $bigItem.find('.brands-mask').hide();


            // list show with animate effect here
            $('.brand_item_tit').show().animate({
                marginTop: 0,
                marginBottom: 0
            } , 500 );


            var $movieWrap = $('.brand_movie').fadeIn(function(){
                if( $bigItem.data('movie') ){
                    renderVideo( $bigItem , $bigItem.data('movie') , $bigItem.find('img').attr('src') , {
                        autoplay: false,
                        pause_button: true
                    } );
                }


                $bigItem.parent().children().each(function(){
                    var $dom = $(this);
                    if( $dom.data('image') ){
                        // initImageMouseMoveEffect( $dom );

                        $dom.hover(function(){
                            // if current dom mask is visible, do not show the iamge-zoom btn
                            if( $dom.find('.brands-mask').is(':visible') ) return;
                            if( !$dom.find('.image-zoom').length ){
                                $('<a href="#" data-a="image-zoom" class="image-zoom transition-wrap" data-a="showreel">\
                                        <div class="transition">ZOOM<br><br>ZOOM</div>\
                                    </a>')
                                    .appendTo( $dom );
                            }
                            $dom.find('.image-zoom').hide().fadeIn();
                        } , function(){
                            $dom.find('.image-zoom').fadeOut();
                        } );
                    }
                });
            });
            
            $movieWrap.find('.brands-item')
                .width( winWidth * 0.7 )
                .each(function(){
                    fixImageToWrap( $(this) , $(this).find('img') );
                });

            // fix initImageMouseMoveEffect
            if( $bigItem.data('image') ){
                initImageMouseMoveEffect( $bigItem );
            }
            

            $movieWrap.find('ul')
                .css({
                    width: winWidth * $movieWrap.find('.brands-item').length,
                    marginLeft: -itemIndex * winWidth * 0.7 + winWidth * 0.15
                });


            // render brand information
            var textTpl = '<p class="brand_big_text_year"> <strong>#[year]</strong> </p>\
                <div class="brand_big_text_item" style="width:80%;"> <p class="brand_big_text_tit">#[title]</p> <p class="brand_big_text_val">#[label]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">##[id]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">client</p> <p class="brand_big_text_val">#[client]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">year</p> <p class="brand_big_text_val">#[year]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">agency</p> <p class="brand_big_text_val">#[agency]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">GENRE</p> <p class="brand_big_text_val">cpgn_type</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">Territory</p> <p class="brand_big_text_val">#[territory]</p> <p class="brand_big_text_val">&nbsp;</p></div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">DIRECTOR</p> <p class="brand_big_text_val">#[director]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">PHOTOGRAPHY</p> <p class="brand_big_text_val">#[photographer]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit"> RESULT </p> #[results] </div>';

            brandItemManager.getBrand( item.brand_path , function( brand ){
                brand['year'] = brand['date'].split('-')[0];
                var str = LP.format( textTpl , brand );
                $('.brand_big_text').html( str );
            } );


            loadingMgr.hide();
        }

        brandItemManager.getItems( path , function( r ){
            var item = r.items[ itemIndex ];
            var aHtml = ['<ul class="brands-items">'];
            var tpl = '<li class="brands-item" data-a="big-brands-item" data-image="#[image]" data-video="#[video]" data-key="#[key]"><div class="brands-mask"></div><img src="#[picture]"></li>';

            var pics = [];
            $.each( r.items , function( i , tm ){
                var pic = brandItemManager.getPath( tm , 'picture_1' );
                pics.push( pic )

                aHtml.push( LP.format( tpl , {
                    key: tm.key ,
                    picture: pic,
                    image: item.video ? '' : 1,
                    video: item.video ? 1 : ''
                } ) );
            } );

            aHtml.push('</ul>');

            $(aHtml.join(''))
                .insertBefore( $('.brand_movie .brand_big_text') );

            loadImages( pics , null , function(){
                afterItemsRender( item );
            } );
        } );

    }

    // show first cate list
    // type => {categories|brands|services}
    function show_cate_list( type ){

        if( $('.sec_brands').is(':visible') ){
            hideBrands();
        }

        // show loading
        loadingMgr.show('black');
        // get 'type' catelist
        api.request( type , function( r ){
            // hide loading
            loadingMgr.hide();
            // load categories 
            var aHtml = [];
             // biuld html
            var tpl = '<li> <a data-a="show-brands" data-d="path=#[path]" data-category="CONSULTING" title="#[title]" href="#">#[title]</a> </li>';
            $.each( r.items || [] , function( i , item ){
                aHtml.push( LP.format( tpl , {
                    title:  item.title,
                    path: type + '/' + item.path
                } ) );
            } );
            $('#categories-wrap').html( aHtml.join('') );

            // start animation
            var winHeight = $(window).height();
            $('.sec_gates').fadeIn()
                .promise()
                .then(function(){
                    $('.gates-inner')
                        .css('marginTop' , '-100%')
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
        });

    }


	// function showCategory(){
	// 	if( $('.sec_gates').is(':visible') ){
	// 		hideCategory();
	// 		return;	
	// 	}

	// 	if( $('.sec_brands').is(':visible') ){
	// 		hideBrands();
	// 	}

	// 	$('.sec_brands').hide();
	// 	var winHeight = $(window).height();
	// 	$('.sec_gates').fadeIn()
	// 		.promise()
	// 		.then(function(){
	// 			$('.gates-inner')
	// 				.animate({
	// 					marginTop: 0
	// 				} , 1000 , 'easeOutBack' );
	// 		});

		

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

	// 	$(document.body).css('overflow' , 'hidden');
	// }

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

    function loadImages( pics , step , cb ){
        if( !pics.length ){
            cb && cb();
        }
        var index = 0;
        $.each( pics ,  function( i , pic ){
            $('<img/>').load(function(){
                step && step( index++ );
                if( i == pics.length - 1 ){
                    cb && cb();
                }
            })
            .error(function(){
                step && step( index++ );
                if( i == pics.length - 1 ){
                    cb && cb();
                }
            })
            .attr('src' , pic );
        });
    }

	function showBrands( isForce ){
		$('.sec_gates').hide();
		if( $('.sec_brands').is(':visible') && !isForce ){
			hideBrands();
			return;
		}
		$('.sec_brands').show()
			.scrollTop(0)
			.css({
				top: $('.header').height()
			});

		// hide slider video
        disposeVideo();
		// $('.home-slider .slider-item').each(function(){
		// 	var video = $(this).data('video-object');
		// 	video && video.pause();
		// });

		$('.brands_tit').show().animate({
			marginTop: 0,
			marginBottom: 0
		} , 200 );

		// set brands-items width
		$('.brands-con').show();

        var itemWidth = 0;
		var nums = $('.brands-con>li .brands-mask').length;
		var index = 0;
        var loading_pics = {};


        var isLoading = false;
        var currentIndex = 0;
        var loadBrandPics = function( _index ){
            if( !loading_pics[ _index ] || isLoading || _index > currentIndex ) return;
            isLoading = true;
            var $loadingBar = $('.brands-con>li .items-loading').eq( _index );
            loadImages( loading_pics[ _index ] , function( i ){
                $loadingBar.stop(true).animate({
                    width:( i + 1 ) / loading_pics[ _index ].length * 100 + '%'
                } , 200 , '' , function(){
                    if( i == loading_pics[ _index ].length - 1 ){
                        $loadingBar.fadeOut();
                    }
                } );
            } , function(){
                var $li = $('.brands-con>li').eq( _index );
                // show the mask
                $li.find('dt .brands-mask').show();

                var $items = $li.find('.brands-item');
                if( !$items.length ){
                    render_next = true;
                    isLoading = false;
                    currentIndex = _index + 1;
                    loadBrandPics( _index + 1 );
                }
                var render_next = false;
                $items.each(function( i ){
                        var i = Math.min( i , 10 );
                        var $this = $(this);
                        $this.delay( i * 150 )
                            .animate({
                                width: itemWidth
                            } , 100 , '' , function(){
                                // fix images width and height
                                fixImageToWrap( $this , $this.find('img') );
                                initImageMouseMoveEffect( $this );

                                if( !render_next && ( i == $items.length - 1 || i >= 10 ) ){
                                    render_next = true;
                                    isLoading = false;
                                    currentIndex = _index + 1;
                                    loadBrandPics( _index + 1 );
                                }
                            });

                        $this.find('.brands-mask')
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
            } );
        }

		$('.brands-con>li').css('opacity' , 1).each(function( i ){
            var path = $(this).data('path');
            // ajax a full screen items
            // hide the loading
            // continue to ajax left
            var ajax = brandItemManager.getItems( path , function( r ){
                var tHtml = [];
                var tpl = '<li data-a="brands-item" class="brands-item" data-image="#[image]" data-video="#[video]" data-key="#[key]"><div class="brands-mask"></div><img src="#[picture]"></li>';
                var pics = [];
                $.each( r.items || [] , function( i , item ){
                    var pic = brandItemManager.getPath( item , 'picture' );
                    pics.push( pic );
                    tHtml.push( LP.format( tpl , {
                        key: item.key,
                        picture: pic,
                        image: item.video ? '' : 1,
                        video: item.video ? 1 : ''
                    } ) );
                } );

                loading_pics[ i ] = pics; 

                var $ul = $('.brands-con ul').eq( i ).html( tHtml.join('') );


                itemWidth = $ul.children().width();

                $ul.width( $ul.children().length * itemWidth )
                    .find('.brands-item')
                    .css('width' , 0);

                loadBrandPics( i );
            } );
			$(this).delay( 400 * i )
				.animate({
					marginLeft: 0
				} , 400 );
				// .promise()
				// .then(function(){
    //                 $(this).find('dt .brands-mask').show();
				// 	$(this).find('.brands-item')
				// 		.each(function( i ){
				// 			$(this).delay( i * 150 )
				// 				.animate({
				// 					width: itemWidth
				// 				} , 100);
				// 			$(this).find('.brands-mask')
				// 				.css({
				// 					display: 'block',
				// 					opacity: 0.2
				// 				})
				// 				.delay( i * 200 )
				// 				.animate({
				// 					opacity: 0.6
				// 				} , 200 );
				// 			if( ++index == nums ){
				// 				$('.brands-con').addClass('ready');
				// 			}
				// 		});
				// });
		});

		$(document.body).css('overflow' , 'hidden');
	}

	function hideBrands(){

		$('.brand_item_tit').css({
			'margin-top': -88,
			'margin-bottom': 88
		}).hide();


        disposeVideo();

		$('.brand_movie')
            .find('ul')
            .remove()
            .end()
            .hide();


        $('.brands_tit').animate({
                marginTop: -176,
                marginBottom: 176
            } , 400 );

        var height = $('.brands-con-li .brands-item').height();
        var sTop = $('.sec_brands').scrollTop();
        var aniIndex = 0; 
        var aniLength = ~~( $(window).height() / height ) + 2;

        var $lis = $('.brands-con>li').each(function( i ){
            var aindex = aniIndex;
            if( i >= sTop / height - 2 && aniIndex <= aniLength ){
                $(this).delay( 400 + 200 * aniIndex++ )
                    .animate({
                        marginLeft: -2000,
                        opacity: 0
                    } , 800 , '' , function(){
                        if( aindex == aniLength || i == $lis.length - 1 ){
                            $('.brands_tit').hide();
                            $('.sec_brands').fadeOut();
                            $(document.body).css('overflow' , 'auto');
                        }
                    });
            }
        });
	}

	function fixImageToWrap( $wrap , $img ){
        if( !$img.width() ){
            $img.load(function(){
                fixImageToWrap( $wrap , $img );
            });
            return ;
        }
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
	

	function renderVideo ( $wrap , movie , poster , config , cb ){
		var id = 'video-js-' + ( $.guid++ );
		$wrap.append( LP.format( '<div class="video-wrap" style="display:none;"><video id="#[id]" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"\
            preload="auto"\
              poster="#[poster]">\
             <source src="#[videoFile].mp4" type="video/mp4" />\
             <source src="#[videoFile].webm" type="video/webm" />\
             <source src="#[videoFile].ogv" type="video/ogg" />\
        </video></div>' , {id: id  , videoFile: movie , poster: poster}));

		config = $.extend( { "controls": false, "muted": false, "autoplay": false, "preload": "auto","loop": true, "children": {"loadingSpinner": false} } , config || {} );
		var ratio = config.ratio || 9/16;

		LP.use('video-js' , function(){
            var is_playing = false;
            videojs.options.flash.swf = "/js/video-js/video-js.swf";
            var myVideo = videojs( id , config , function(){
            	var v = this;
                if( config.resize !== false ){
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

                        try{v.dimensions( vw , vh );}catch(e){}

                        $('#' + v.Q).css({
                            "margin-top": ( h - vh ) / 2,
                            "margin-left": ( w - vw ) / 2
                        });
                        return false;
                    }
                    $(window).bind( 'resize.video-' + id , resizeFn )
                    	.trigger('resize.video-' + id);

                    $wrap.bind('resize.video-' + id , resizeFn);
                }
                setTimeout(function(){
                	$wrap.find('.video-wrap').fadeIn();
                	if( config.autoplay ){
                        try{myVideo.play();}catch(e){}
                    } else if( config.pause_button ){
                        $wrap.find('.vjs-big-play-button').fadeIn();
                    }
                } , 20);

                // if need to add pause button
                if( config.pause_button ){
                    if( !config.controls ){
                        $wrap.off('click.video-operation').on('click.video-operation' , function(){
                            if( is_playing ){
                                v.pause();
                            } else {
                                v.play();
                            }
                        });    
                    }
                    // add big pause btn
                    v.on('play' , function(){
                        is_playing = true;
                        $wrap.find('.vjs-big-play-button').hide();
                        var $pauseBtn = $wrap.find('.vjs-big-pause-button');
                        if( !$pauseBtn.length ){
                            $pauseBtn = $('<div class="vjs-big-pause-button"></div>').insertAfter( $wrap.find('.vjs-big-play-button') )
                                .click(function(){
                                    v.pause();
                                });
                        }
                        $pauseBtn.show()
                            .delay( 4000 )
                            .fadeOut();
                    });

                    v.on('pause' , function(){
                        is_playing = false;
                        $wrap.find('.vjs-big-pause-button').hide();
                        $wrap.find('.vjs-big-play-button').fadeIn();
                    });
                }


                $wrap.data('video-object' , v);

                cb && cb(v);
            } );
        });
	}


	var loadingMgr = (function(){
		var $loading = $('.loading-wrap');
		if( !$loading.length )
			$loading = $('<div class="loading-wrap"><div class="loading"></div></div>')
				.appendTo(document.body);
		var positions = [-44,-142,-240,-338,-436,-534];
		var interval = null;

        var colors = {
            'black': 'rgba(0,0,0,.85)'
        }
		
		return {
			show: function( bgcolor ){
				var index = 0;
                bgcolor = colors[bgcolor] || bgcolor || 'white';
				var $inner = $loading.fadeIn().find('.loading');
				$loading.css({
                    'background-color':  bgcolor
				});
				interval = setInterval(function(){
					$inner.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
				} , 1000 / 6 );
			},
			hide: function(){
				clearInterval( interval );
				$loading.fadeOut();
			}
		}
	})();
	loadingMgr.show();
	$(window).load(loadingMgr.hide);



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
		if( ev.clientY < ( winHeight - headerHeight ) / 4 + headerHeight ){
			runedNum = ( 1 -  ( ev.clientY - headerHeight ) * 4 / ( winHeight - headerHeight ) ) * 15;
			if( !isAtTop ){
				isAtTop = true;
				gatesScrollTop = $gatesInnerL.scrollTop();
			}
		} else if( ev.clientY + ( winHeight - headerHeight ) / 4 > winHeight ){
			runedNum = ( 1 - ( winHeight - ev.clientY ) * 4 / ( winHeight - headerHeight ) ) * 15;
			if( !isAtBottom ){
				isAtBottom = true;
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
	var $dd = null;
	var brandsNum = 0;
	var brandsScrollNum = 0;
	
	$('.brands-con').delegate('.brands-con-li dd' , 'mousemove' , function( ev ){
		$dd = $(this);
		var off = $dd.offset();
		var height = $dd.height();
		var width = $dd.width();
		brandsScrollNum = $dd.scrollLeft();
		if( ev.pageX - off.left < width / 4 ){
			if( !isAtLeft ){
				isAtLeft = true;
			}
			brandsNum = ( 1 - ( ev.pageX - off.left ) * 4 / width ) * 16;
		} else if( width + off.left - ev.pageX < width / 4 ){
			brandsNum = ( 1 - ( width + off.left - ev.pageX ) * 4 / width ) * 16; 
			if( !isAtRight ){
				isAtRight = true;
			}
		} else {
			isAtLeft = false;
			isAtRight = false;
		}
	})
	.delegate('.brands-con-li' , 'mouseleave' , function(){
		isAtRight = false;
		isAtLeft = false;
	});
 // 	var $brandsCon = $('.brands-con').mousemove(function( ev ){
 // 		var off = $brandsCon.offset();
 // 		var width = $brandsCon.width();
 // 		var height = $brandsCon.height();
 // 		if( ev.pageX > off.left + dtWidth && ev.pageY > off.top && ev.pageY < off.top + height ){
 // 			if( ev.pageX - dtWidth - off.left < (width - dtWidth) / 4 ){
 // 				brandsNum = ( 1 - ( ev.pageX - dtWidth - off.left ) * 4 / (width - dtWidth) ) * 8; 
 // 				isAtLeft = true;
 // 			} else if( off.left + width - ev.pageX < (width - dtWidth) / 4 ){
 // 				brandsNum = ( 1 - ( off.left + width - ev.pageX ) * 4 / (width - dtWidth) ) * 8; 
 // 				isAtRight = true;
 // 			} else {
 // 				isAtLeft = false;
 // 				isAtRight = false;
 // 			}

 // 			$tarLi = $(ev.target).closest('li');
 // 			$firstdd = $tarLi.find('dd').eq(0);
 // 		} else {
 // 			isAtLeft = false;
 // 			isAtRight = false;
 // 		}
	// }).hover(function(){} , function(){
	// 	isAtLeft = false;
 // 		isAtRight = false;
 // 		$tarLi = null;
	// });

	setInterval(function(){
		if( isAtTop ){
			gatesScrollTop -= runedNum;
			$gatesInnerL.scrollTop( gatesScrollTop );
		} else if( isAtBottom ) {
			gatesScrollTop += runedNum;
			$gatesInnerL.scrollTop( gatesScrollTop );
		}

		// fix brands_con
		if( isAtLeft ){
			brandsScrollNum -= brandsNum;
			$dd.scrollLeft( brandsScrollNum );
		} else if ( isAtRight ){
			brandsScrollNum += brandsNum;
			$dd.scrollLeft( brandsScrollNum );
		}

	} , 1000 / 60);

	$('.gates-inner').click(function( ev ){
		var target = ev.target;
		if( target.tagName == 'LI' ){
			hideCategory();
		}
	});

    var sec_brands_stop = 0;
    var sec_brands_timer = null;
    $('.sec_brands').scroll(function(){
        //clearTimeout( sec_brands_timer );
        //sec_brands_timer = setTimeout(function(){
            if( $('.brand_movie').data('isFullScreen') ) return false;
            var st = $('.sec_brands').scrollTop();
            if( st > sec_brands_stop ){
                LP.triggerAction('pagetitarrtop');
            } else {
                LP.triggerAction('pagetitarrbottom');
            }
        //} , 100 );
    });

	var brandsInterval = null;
    // var lightPrev = function( $dom , prev ){
    //     setTimeout(function(){
    //         $dom.prev().find('.')
    //     } , 50);
    // }
	$('.brands-con').delegate('.brands-con-li' , 'mouseenter' , function( ev ){

		var $dom = $(ev.target).closest('li');
		var index = $dom.index();
		var all = $dom.parent().children().length;
		var times = Math.max( all - index  , index + 1 );


		var start = 0;
		var $prevAll = $dom.prevAll();
		var $nextAll = $dom.nextAll();
        $(this).find('.brands-mask').stop( true , true ).animate({
            opacity: 0
        } , 600 );

  //       clearInterval( brandsInterval );
		// brandsInterval = setInterval(function(){
		// 	if( start == times ){
		// 		clearInterval( brandsInterval );
		// 		return;
		// 	}
		// 	if( start == 0 ){
		// 		$dom.find('.brands-mask').animate({
		// 			opacity: 0.2
		// 		});
		// 	} else {
		// 		$prevAll.eq( start - 1 )
		// 			.find('.brands-mask').animate({
		// 				opacity: 0.2
		// 			} , 200);
		// 		$nextAll.eq( start - 1 )
		// 			.find('.brands-mask').animate({
		// 				opacity: 0.2
		// 			} , 200);
		// 	}
		// 	start++;
		// } , 60 );
	})
	.delegate('.brands-con-li' , 'mouseleave' , function(){
		clearInterval( brandsInterval );
		$(this).find('.brands-mask').stop( true , true ).animate({
			opacity: 0.7
		} , 600);
	})
	.delegate('.brands-item' , 'mouseenter' , function(){
		// init video with silence
		var $dom = $(this);
		if( $dom.data('movie') ){
			// if( $dom.data('video-object') ){
			// 	$dom.data('video-object').play();
			// } else {
			renderVideo( $dom , $dom.data('movie') , $dom.find('img').attr('src') , {
				muted: true,
				autoplay: true,
                resize: false
			} , function( v ){
                try{v.dimensions( '100%' , '100%' );}catch(e){}
            } );
			//}
		}
        
	})
	.delegate('.brands-item' , 'mouseleave' , function(){
		// stop the movie
		var $dom = $(this);
		if( $dom.data('video-object') ){
			$dom.data('video-object').pause();
			var videoObject = $dom.data('video-object');
			$dom.find('.video-wrap').fadeOut(function(){
                try{
    				videoObject.dispose();
    				$(this).remove();
                }catch(e){}
			});
		}
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

				var $homeBio = $('.home_bio');
				var $homeBioBg = $('.home_bio_bg');
				var $homeNum = $('.home_num');
				var homeNumInit = false;
				var $slider = $('.home-slider');
				var homeBioHeight = $homeBio.height();
				$header = $('.header');
				// header fixed effect
				$(window).scroll(function(){
					var stTop = $(window).scrollTop();
					var winHeight = $(window).height();

					// fix home slider
					var mtop = Math.min( stTop , ( winHeight - headerHeight ) / 2 );
					$slider.css({marginTop: - mtop , marginBottom: - mtop});

					// header fixed effect
					if( stTop >= $header.offset().top ){
						$header.addClass('header-fixed');
					} else {
						$header.removeClass('header-fixed');
					}

					// homeCampaign animate

					if($('.cam_item').eq(0).offset().top < stTop + $(window).height() ){
						$homeCampaign.data('animate' , 1);
						$homeCampaign.find('.cam_item')
							.each(function( i ){
								$(this).delay( i * 200 )
									.animate({
										marginTop: 0
									} , 400 , 'easeLightOutBack');
							});
						$('.home_cambtn').delay( 4 * 200 )
							.animate({
								bottom: 90
							} , 400 , 'easeLightOutBack' );
					}


					// fix $homeBio background image
					var bgTop = $homeBio.offset().top - headerHeight - stTop;
					$homeBioBg.css('top' , - bgTop / 2 );

					// fix numbers
					// if( !homeNumInit ){
					// 	if( stTop + winHeight > $homeNum.offset().top + $homeNum.height() / 2 ){
					// 		homeNumInit = true;
					// 		startHomeNumAnimate();
					// 	}
					// }
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
				

				intMouseMoveEffect( $slider , function( ev ){
					if( !isHomeSliderMoviePlaying ) return;

					if( $(ev.target).closest('.banpho-con').length ) return;

					$banphoCon.fadeOut();
					// resize the videos
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

				} , function( ev ){
					if( !isHomeSliderMoviePlaying ) return;

					$('.slider-block-inner').animate({
						height: $(window).height() - $('.header').height()
					} , 500);

					$banphoCon.fadeIn();
				} );

				// $(document.body).mousemove(function(){
				// 	// if( status.moviePlaying ){
				// 	// 	clearTimeout( status.banphoConTimer );
				// 	// 	status.banphoConTimer = setTimeout(function(){
				// 	// 		status.banphoConFadeOut = true;
				// 	// 	} , 2000);
				// 	// 	status.banphoConFadeIn = true;
				// 	// }

				// 	return;


				// 	if( isHomeSliderMoviePlaying ){
				// 		clearTimeout( banphoConTimer );
				// 		banphoConTimer = setTimeout( function(){
				// 			if( !isInBanphoCon ){
				// 				$banphoCon.fadeOut();
				// 				// resize the videos
				// 				isHeadHide = true;
				// 				var $inner = $('.slider-block-inner');
				// 				var $item = $inner.children('.slider-item').eq( $inner.data('index') );
				// 				$inner.animate({
				// 					height: $(window).height()
				// 				} , 500)
				// 				.promise()
				// 				.then(function(){
				// 					clearInterval( interval );
				// 				});

				// 				var interval = setInterval(function(){
				// 					$item.trigger('resize');
				// 				} , 1000 / 30 );
				// 			}
				// 		} , 2000 );

				// 		if( !isCurrentPlaying && !$banphoCon.is(':visible') ){
				// 			$banphoCon.fadeIn();
				// 		}

				// 		if( isHeadHide ){
				// 			isHeadHide = false;
				// 			$('.slider-block-inner').animate({
				// 				height: $(window).height() - $('.header').height()
				// 			} , 500);
				// 		}
				// 	} else {
				// 		clearTimeout( banphoConTimer );
				// 		$banphoCon.fadeIn();
				// 	}
				// });

				// init home numbers
				initHomeNum();
			},
            'awards-page': function(){
                $('.awardicons img').hover(function(){
                    var num = $(this).data('num');
                    $('.awardicons span').html( num );

                    effects['number-rock']( $('.awardicons span') , 0  , null , 500 );
                }); 
            },
            'contact-page': function(){
                var _LP = window.LP;
                LP.use('http://api0.map.bdimg.com/getscript?v=2.0&ak=AwxxvHue9bTdFietVWM4PLtk&services=&t=20140725172530' , function(){
                    window.LP = _LP;
                });
                var interval = setInterval(function(){
                    if( window.BMap ){
                        clearInterval( interval );
                        var oMap = new BMap.Map("map");
                        oMap.addControl(new BMap.NavigationControl());
                        var point = new BMap.Point(121.478988,31.227919);
                        oMap.centerAndZoom(point, 15);
                        //oMap.setMapStyle({style: 'grayscale'});
                        oMap.setMapStyle({
                          styleJson:[{
                                    "featureType": "all",
                                    "elementType": "all",
                                    "stylers": {
                                              "lightness": 13,
                                              "saturation": -100
                                    }
                          }]
                        });
                    }
                } , 100 );


                $('.pagetit .pagetitarrbottom').fadeOut();
                // LP.use('http://api.map.baidu.com/api?v=2.0&ak=AwxxvHue9bTdFietVWM4PLtk' , function(){
                //     var oMap = new BMap.Map("map");
                //     oMap.addControl(new BMap.NavigationControl());
                //     var point = new BMap.Point(121.478988,31.227919);
                //     oMap.centerAndZoom(point, 15);
                //     oMap.setMapStyle({style: 'gray'});
                // });
            },
            'interview-page': function(){
                // reload js conponent
                LP.use( ['video-js' , '../plugin/jquery.jplayer.min.js'] );
            },
			'press-page': function(){

			}
		}


		var effects = {
			'fadeup': function( $dom , index , cb ){
				$dom.delay( 150 * index )
					.animate({
						opacity: 1,
						marginTop: 0
					} , 500 )
					.promise()
					.then(function(){
						cb && cb();
					});
			},
			'number-rock': function( $dom , index , cb , du ){
				// init humbers
				var num = $dom.text();
				var $span = $('<span>' + num + '</span>').appendTo( $dom.html('').data('num' , num) );
				var width = $span.width();
				var height = $span.height();
				$span.css({
					height: height,
					width: width,
					display: 'inline-block',
					lineHeight: height + 'px',
					position: 'relative',
					margin: '0 auto',
					overflow: 'hidden',
					verticalAlign: 'middle'
				}).html('');
				$.each( num.split('') , function( i ){
					$('<div>' + "1234567890".split('').join('<br/>') + '</div>').appendTo( $span )
						.css({
							position: 'absolute',
							left: i * width / num.length,
							top: -~~( Math.random() * 10 ) * height
						});
				});

				// run the animate
				var spanHeight = height;//$dom.find('span').height();

				var st = new Date();
				var duration = du || 1200;
				var $divs = $span.find('div');
				var interval = setInterval(function(){

					if( new Date - st >= duration ){
						var num = $dom.data('num');
						var nums = num.split('');
						$divs.each(function( i ){
							var top = - ( nums[i] - 1 ) * spanHeight ;
							if( nums[i] == 0 ){
								top = - 9 * spanHeight
							}
							$(this).animate({
								'top': top 
							} , 800 , 'easeOutQuart' , function(){
								if( i == nums.length - 1 ){
									//$dom.html( num );
									cb && cb();
								}
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

				// fix common page init
				// for  banpho-img
				var $footer = $('.footer');
				$(window).scroll(function(){
					var stTop = $(window).scrollTop() + headerHeight;
					var winHeight = $(window).height();

					if( $('.banpho-img').length ){
						var	$banpho = $('.banpho-img');
						var banphoTop = $banpho.offset().top;
						var banphoImgHeight = $('.banpho-img img').height();

						var $interviewList = $('.interview_list');
						

						// for top image
						if( stTop > banphoTop && stTop < banphoTop + banphoImgHeight ){
							$banpho.height( banphoTop + banphoImgHeight - stTop )
								.find('img')
								.css({
									marginTop: ( banphoImgHeight - ( banphoTop + banphoImgHeight - stTop ) ) / 2
								});
						} else if( stTop < banphoTop ){
							$banpho.height( 'auto' )
								.find('img')
								.css('marginTop' , 0);
						} else if( stTop > banphoTop + banphoImgHeight ){
							$banpho.height( 0 )
								.find('img')
								.css('marginTop' , -banphoImgHeight / 2);
						}
					}

					// fix up-fadein
					if( $('.intoview-effect').length ){
						var index = 0;
						$('.intoview-effect').each(function(){
							var $dom = $(this);
							var offTop = $dom.offset().top;
							if( !$dom.data('init') && offTop < stTop + winHeight && offTop > stTop ){
								$dom.data('init' , 1);
								effects[ $dom.data('effect') ] && effects[ $dom.data('effect') ]( $dom , index , function(){
									$dom.removeClass('intoview-effect');
								} );
									// .delay( 150 * index++ )
									// .animate({
									// 	opacity: 1,
									// 	marginTop: 0
									// } , 500 )
									// .promise()
									// .then(function(){
									// 	$dom.removeClass('intoview-effect');
									// });
							}
						});
					}


					// init numbsers
					// if( $('.num-effects').length ){
					// 	$('.num-effects').each(function(){
					// 		if(  )
					// 	});
					// }
				})
				.trigger('scroll');


				// init select
				initSelect( $('select') );


				// init texteffect
				$('.navitem,.crumbs a').filter(':not(.text-effect-init)')
					.addClass('text-effect-init')
					.hover(function(){
						textEffect( $(this) );
					} , function(){
						$(this).children('div').remove();
					});

                // init about_crumbs
                if( $('.about_crumbs').length ){
                    var pagename = location.href.replace(/^.*\/([^/]+$)/ , '$1');
                    $('.about_crumbs').find('a').each(function(){
                        if( $(this).attr('href').indexOf( pagename ) >= 0 ){
                            var $dom = $(this);
                            var off = $dom.offset();
                            var width = $dom.width();
                            var poff = $dom.parent().offset();
                            var pwidth = $dom.parent().width();

                            var marginLeft = ( pwidth - width - 2 * ( -poff.left + off.left ) ) / 2;
                            $dom.addClass('active').parent().css('marginLeft' , marginLeft);
                            return false;
                        }
                    });
                }

                // init banpho-img
                $('.banpho-img img').css('opacity' , 0)
                    .animate({
                        opacity: 1
                    } , 1000);

				return false;
			},
			destroy: function(){
				$(window).unbind('scroll');

				$(document.body).unbind('mousemove').css('overflow' , 'auto');
			},

            // category and brands path
            //  {category}/{brand}/{index}/{normal|big|middle}
            //  commercial_services/suning_2013_may_campaign/0
            //  commercial_services/suning_2013_may_campaign/1
            renderPath: function( path ){
                var paths = path.split('/');

                var category = paths[1] || '';
                var brand = paths[2] || '';
                var index = paths[3] || '';
                var type = paths[4] || '';


                api.request( [ paths[0] , category , brand ].join('/') , function( r ){
                    var items = r.items;

                    if( index ){
                        // render items to brand-movie
                        var item = items[ index ];
                        // TODO ..   check type
                        switch( type ){
                            case 'big':

                                break;
                            default: 
                                ;
                        }

                        return ;
                    }

                    if( brand ){

                        return;
                    }

                    if( category ){

                        return;
                    }

                } );
            }
		}
	})();

	

	// change history
	LP.use('../plugin/history.js' , function(){
		History.replaceState( { prev: '' } , undefined , location.href  );
		pageManager.init( );

		$(document).ajaxError(function(){
			loadingMgr.hide();
		});
        // Bind to StateChange Event
        History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            var prev = State.data.prev;
            var type = State.data.type;

            // show loading
            loadingMgr.show();
            switch( type ){
     //        	case 'press':
					// $.get( location.href , '' , function( html ){
					// 	html = $('<div>' + html + '</div>').find('#press-container')
					// 		.html();
					// 	$( '#press-container' ).children().animate({
					// 		opacity: 0
					// 	} , 500);
					// 	setTimeout(function(){
					// 		$( '#press-container' ).html( html )
					// 			.children()
					// 			.fadeIn();

					// 		$('html,body').animate({
					// 			scrollTop: $('.pagetit').height() + $('.banpho-img img').height() / 2
					// 		} , 400 );

					// 		pageManager.destroy( );
     //    					pageManager.init( );

     //    					loadingMgr.hide();
					// 	} , 500);
					// });
					// break;
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
                            //pagetitarrbottom

							$('html,body').animate({
								scrollTop: 0
							} , 300 );
							pageManager.destroy( );
        					pageManager.init( );

        					loadingMgr.hide();
						} , 500);
					});
            }
        });
	});


	// bind keydown events
    // fuck safari,fuck safari
    // fuck safari,fuck safari
    var isKeyDown = false;
	$(document).keydown(function( ev ){
        if( isKeyDown == true ){
            return ;
        }
        isKeyDown = true;
        setTimeout(function(){
            isKeyDown = false;
        } , 300 );

		switch( ev.which ){
			case 27:
                 if( $('.image-zoom-big').length ){
                    $('.image-zoom-big').fadeOut()
                        .promise()
                        .then(function(){
                            $('.image-zoom-big').remove();
                        });

                    return false;
                }

				// press popup page
				if( $('.shade').is(':visible') ){
					LP.triggerAction('pop_close');
				}

				// brand_movie
				if( $('.brand_movie').is(':visible') ){
                    var index = $('.brand_movie').data('index');
                    if( $('.brand_movie').data('isFullScreen') ){
                        $('.brand_movie').find('.brands-item').eq(index).trigger('dblclick');
                    } else {
                        $(window).unbind('resize.brand_movie');
                        // to brands list
                        $('.brand_item_tit').animate({
                            marginTop: -88,
                            marginBottom: 88
                        } , 400);


                        $('.brand_movie').fadeOut( 400 )
                            .promise()
                            .then(function(){
                                $('.brand_item_tit').hide();
                                // $('.brands-con .brands-item').width('auto');
                                showBrands( true );
                            });
                    }
				}

                $('html,body').animate({
                    scrollTop: sliderHeight
                } , 500 );

                // for home-cam-item-big
                if( $('.home-cam-item-big').length ){
                    $('.home-cam-item-big').click();
                }

                if( $('.sec_gates').is(':visible') ){
                    hideCategory();
                }

                if( $('.brands-con').is(":visible") ){
                    hideBrands();
                }

				break;
			case 37:
				if( $('.shade').is(':visible') ){
                    $('.popnext').get(0).click();
				}
				if( $('.page').data('page') == "home-page" ){
					LP.triggerAction('home-slider-left');
				}
				if( $('.brand_movie').is(':visible') ){
					LP.triggerAction('brand_big_prev') ;
				}
				break;
			case 39:
				if( $('.shade').is(':visible') ){
					$('.popprev').get(0).click();
				}
				if( $('.page').data('page') == "home-page" ){
					LP.triggerAction('home-slider-right');
				}
				if( $('.brand_movie').is(':visible') ){
					LP.triggerAction('brand_big_next') ;
				}
				break;
		}
	});



    // big brand video double click event
    $('.brand_movie').on('dblclick' , '.brands-item' , function(){
        // untrigger stroll event
        

        var isFullScreen = $('.brand_movie').data('isFullScreen');
        isFullScreen = !isFullScreen;

        $('.brand_movie').data('isFullScreen' , isFullScreen );

        var winWidth = $(window).width();
        var time = 600;
        var $dom = $(this);

        // stop the video
        if( $dom.data('video-object') ){
            $dom.data('video-object').pause();
        }

        var interval = setInterval(function(){
            $dom.trigger('resize');

            // fixImageToWrap( $dom , $dom.find('img') );
            $dom.parent()
                .children()
                .each(function(){
                    fixImageToWrap( $(this) , $(this).find('img') );
                });
        } , 1000 / 60 );


        $(this).animate({
            width: winWidth * ( isFullScreen ? 0.9 : 0.7 )
        } , time );


        $('.brand_movie')
            .animate(  {
                // height: isFullScreen ? $(window).height() - $('.header-inner').height() : 445,
                top: isFullScreen ? 0 : 88
            } , 600 )

            .find('ul').animate({
                height: isFullScreen ? $(window).height() - $('.header-inner').height() : 445,
                marginLeft: - $(this).prevAll().length * winWidth * 0.7 + winWidth * ( isFullScreen ? 0.05 : 0.15 )
            } , time )
            .promise()
            .then(function(){
                if( $dom.data('video-object') && isFullScreen ){
                    $dom.data('video-object').play();
                }

                clearInterval( interval );

            });

        // remove the clone image
        $dom.parent().find('.clone-img').remove();

        // $('.brand_big_next,.brand_big_prev').animate({
        //     width: isFullScreen ? 0.05 * winWidth : 0.15 * winWidth
        // } , 600 );

    } );

    // $('.brand_big_prev,.brand_big_next').hover(function(){
    //     $(this).animate({
    //         opacity: 0
    //     } , 700 );
    // } , function(){
    //     $(this).animate({
    //         opacity: 1
    //     } , 700 );
    // });

	// page actions here
	// ============================================================================
	LP.action('navitem' , function(){
		if($('.home-slider').length ){
			// stop the movie
            disposeVideo();

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


 	LP.action('show-category' , function( data ){
		var winTop = $(window).scrollTop();
		var sliderHeight = $('.home-slider').height();
		if( $('.home-slider').length && winTop < sliderHeight ){
			// scroll to $('.home-slider').height()
			$('html,body').animate({
				scrollTop: sliderHeight
			} , 500 )
			.promise()
			.then(function(){

                $(document.body).css('overflow' , 'hidden');
                show_cate_list( data.type );
            });
		} else {
			show_cate_list( data.type );
		}

		// hide slider video
        disposeVideo();

		return false;
	});


	LP.action('home-slider-left' , function(){
		var $inner = $('.slider-block-inner');
		var index =  parseInt( $inner.data('index') );
		var len = $('.slider-item').length;
		if( index == 0 ){ return false; }

		// stop current video
		// var video = $('.slider-item').eq( index )
		// 	.data('video-object');
		// video && video.pause();

		isHomeSliderMoviePlaying = false;

		$inner.animate({
			marginLeft: '+=100%'
		} , 500)
        .promise()
        .then(disposeVideo);

		$inner.data('index' , index - 1 );
		$('.banpho-i').html( index + '/' + len );
	});
	LP.action('home-slider-right' , function(){
		var $inner = $('.slider-block-inner');
		var index =  parseInt( $inner.data('index') );
		var len = $('.slider-item').length;
		if( index == len - 1 ){ return false; }

		// stop current video
		// var video = $('.slider-item').eq( index )
		// 	.data('video-object');
		// video && video.pause();

		isHomeSliderMoviePlaying = false;

		$inner.animate({
			marginLeft: '-=100%'
		} , 500)
        .promise()
        .then(disposeVideo);

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
				// ratio: $sliderItem.children('img').height() / $sliderItem.children('img').width(),
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
		// if( isHomeSliderMoviePlaying )
		// 	$('.banpho-con').fadeOut();
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
        // show brands
        $('.sec_brands').show()
            .scrollTop(0)
            .css({
                top: $('.header').height()
            });

        $('.brands-con').hide();
        $('.brands_tit').hide();
        // hide slider video
        disposeVideo();

        $('.brand_item_tit').show().animate({
            marginTop: 0,
            marginBottom: 0
        } , 200 );

        showBigBrandsItem( $('.brands-con').find('.brands-item').eq(0) );


		// var $dom = $(this);
		// var $img = $dom.find('img');
		// var imgOff = $img.offset();
		// var oriCss = {
		// 		position: 'fixed',
		// 		width: $img.width(),
		// 		height: $img.height(),
		// 		top: imgOff.top - $(window).scrollTop(),
		// 		left: imgOff.left,
		// 		zIndex: 200
		// 	}
		// var $wrap = $('<div></div>').appendTo(document.body)
		// 	.css( oriCss )
  //           .addClass('home-cam-item-big')
		// 	.append($img.clone()
		// 		.css({
		// 			width: '100%',
		// 			height: '100%'
		// 		}));

		// // zoom out
		// $wrap.animate({
		// 	width: $(window).width(),
		// 	height: $(window).height(),
		// 	top: 0,
		// 	left: 0
		// } , 500 , '' ,function(){
		// 	$(document.body).css('overflow' , 'hidden');
		// 	renderVideo( $wrap , $dom.data('movie') , $img.attr('src') , {
		// 		autoplay: true
		// 	} , function(){
		// 	} );
		// } )
		// .click(function(){
		// 	$wrap.animate({
		// 		width: oriCss.width,
		// 		height: oriCss.height,
		// 		top: oriCss.top,
		// 		left: oriCss.left
		// 	} , 500 )
		// 	.promise()
		// 	.then(function(){
		// 		$(document.body).css('overflow' , 'auto');
		// 		$(this).data('video-object').dispose();
		// 		$(this).remove();
		// 	});
		// });
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

	LP.action('show-brands' , function( data ){
        // change tit
        var tit = $.trim( $(this).text() );
        $('.sec_brands_tit h2 span').last().html( tit.toUpperCase() );
        // save path info
        // $('.sec_brands').data('path' , 'categories/' +  data.path );

        // show loading 
        loadingMgr.show('black');
        // load data 
        api.request( data.path , function( r ){
            // build html
            var tpl = '<li class="brands-con-li" data-path="#[path]" style="margin-left:-600px;">\
                <dl class="cs-clear">\
                    <dt>\
                        <div class="brands-mask"></div>\
                        <p class="brands-con-t">#[agency]<br/>-#[label]</p>\
                        <p class="brands-con-time">#[year]</p>\
                        <div class="cs-clear brands-con-meta">\
                            <span class="fr">##[id]</span>\
                            <span>#[cpgn_type]</span>\
                        </div>\
                        <div class="items-loading"></div>\
                    </dt>\
                    <dd><ul class="brands-items cs-clear"></ul></dd>\
                </dl>\
            </li>';
            var aHtml = [];
            // load all pictures
            var loading_pics = [];
            //var whens = [];
            $.each( r.items || [] , function( index , item ){
                aHtml.push( LP.format( tpl , {
                    agency: item.agency,
                    label : item.label,
                    year: item.created.replace(/(\d+)-.*/ , '$1'),
                    id: item.id,
                    cpgn_type: item.cpgn_type,
                    path: data.path + '/' + item.path
                } ) );

                



                // if( ajax ){
                //     whens.push( ajax );
                // }
            } );

            

            // $.when.apply('' , whens).promise()
            //     .then(function(){
            //         loadingMgr.hide();
            //         showBrands();
            //     });

            $('.brands-con').html( aHtml.join('') );
            loadingMgr.hide();
            showBrands();
        } );

		var winTop = $(window).scrollTop();
		var sliderHeight = $('.home-slider').height();
		if( $('.home-slider').length && winTop < sliderHeight ){
			// scroll to $('.home-slider').height()
            $('html,body').animate({
                scrollTop: sliderHeight
            } , 500 );
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
		return false;
	});

	LP.action('brands-item' , function(){
		//var $dom = $(this);
        var key = $(this).data('key');
        var item = brandItemManager.get( key );
        var index = $(this).index();

		$('.brands_tit').animate({
				marginTop: -176,
				marginBottom: 176
			} , 400 );

        var height = $(this).height();
        var sTop = $('.sec_brands').scrollTop();
        var aniIndex = 0; 
        var aniLength = ~~( $(window).height() / height ) + 2;

		var $lis = $('.brands-con>li').each(function( i ){
            var aindex = aniIndex;
            if( i >= sTop / height - 3 && aniIndex <= aniLength ){
                $(this).delay( 400 + 200 * aniIndex++ )
                    .animate({
                        marginLeft: -2000,
                        opacity: 0
                    } , 800 , '' , function(){
                        if( aindex == aniLength || i == $lis.length - 1 ){
                            $lis.css({marginLeft:-2000,opacity:0});
                            $('.brands-con').hide();
                            $('.brands_tit').hide();
                            // clear prev ul element
                            $('.brand_movie').find('ul').remove();
                            showBigBrandsItem( item.brand_path , index );
                        }
                    });
            }
        });

        // console.log( whens );
        // console.log( + new Date() );
        // $.when( whens ).promise()
        //     .then(function(){
        //         console.log( + new Date() );
        //         $('.brands-con').hide();
        //         $('.brands_tit').hide();
        //         // clear prev ul element
        //         $('.brand_movie').find('ul').remove();
        //         showBigBrandsItem( item.brand_path , index );
        //     })

		// var itemIndex = $dom.index();

		// // load movie on item
		// function showBigBrandsItem(){

  //           disposeVideo();

  //           $('.sec_brands').scrollTop(0);

		// 	$dom.closest('ul')
		// 		.children()
		// 		.each(function(){
  //                   $(this).find('.clone-img').remove();
		// 		})
		// 		.end()
		// 		.clone()
		// 		.insertBefore( $('.brand_movie .brand_big_text') )
		// 		// .children()
		// 		// .each(function(){
		// 		// 	$(this).attr('data-a' , 'show-brands-big-movie' );
		// 		// })
		// 		.find('.brands-mask')
		// 		.remove();

  //           // bind resize event
  //           $(window).unbind('resize.brand_movie').bind('resize.brand_movie' , function(){
  //               var $items = $('.brand_movie').find('.brands-item');
  //               var winWidth = $(window).width();
  //               var isFullScreen = $('.brand_movie').data('isFullScreen');
  //               $('.brand_movie').find('ul')
  //                   .css({
  //                       width: $items.length * winWidth,
  //                       marginLeft: - $('.brand_movie').data('index') * winWidth * 0.7 + ( isFullScreen ? winWidth * 0.05 : winWidth * 0.15 )
  //                   })
  //                   .children()
  //                   .width( winWidth * 0.7 )
  //                   .eq( $('.brand_movie').data('index') )
  //                   .width( isFullScreen ? winWidth * 0.9 : winWidth * 0.7 );

  //               $('.brand_big_prev,.brand_big_next').css('width' , isFullScreen ? winWidth * 0.05 : winWidth * 0.15 );

  //           });


  //           if( itemIndex == 0 ){
  //               $('.brand_big_prev').fadeOut();
  //           } else if( itemIndex == $('.brand_movie').find('.brands-item').length - 1 ){
  //               $('.brand_big_next').fadeOut();
  //           }

		// 	var $bigItem = $('.brand_movie').find('.brands-item').eq( itemIndex );


		// 	// animte the title
		// 	$('.brand_item_tit').show().animate({
		// 		marginTop: 0,
		// 		marginBottom: 0
		// 	} , 500 );


		// 	var $movieWrap = $('.brand_movie').fadeIn(function(){
		// 		if( $bigItem.data('movie') ){
		// 			renderVideo( $bigItem , $bigItem.data('movie') , $bigItem.find('img').attr('src') , {
		// 				autoplay: false,
  //                       pause_button: true
		// 			} );
		// 		}


  //               $bigItem.parent().children().each(function(){
  //                   var $dom = $(this);
  //                   if( $dom.data('image') ){
  //                       initImageMouseMoveEffect( $dom );

  //                       $dom.hover(function(){
  //                           if( !$dom.find('.image-zoom').length ){
  //                               $('<a href="#" data-a="image-zoom" class="image-zoom transition-wrap" data-a="showreel">\
  //                                       <div class="transition">ZOOM<br><br>ZOOM</div>\
  //                                   </a>')
  //                                   .appendTo( $dom );
  //                           }
  //                           $dom.find('.image-zoom').hide().fadeIn();
  //                       } , function(){
  //                           $dom.find('.image-zoom').fadeOut();
  //                       } );
  //                   }
  //               });

  //               $bigItem.trigger('mouseenter');
		// 	})
  //           .data('index' , itemIndex);
		// 	var winWidth = $(window).width();
		// 	$movieWrap.find('.brands-item')
		// 		.width( winWidth * 0.7 )
		// 		.each(function(){
		// 			fixImageToWrap( $(this) , $(this).find('img') );
		// 		});

            

		// 	$movieWrap.find('ul')
		// 		.css({
		// 			width: winWidth * $movieWrap.find('.brands-item').length,
		// 			marginLeft: -itemIndex * winWidth * 0.7 + winWidth * 0.15
		// 		});


		// }



		// // TODO...
		// var itemIndex = 0;
		// var $item = $('.brand_movie .brands-item').eq(itemIndex);

		// renderVideo( $item , $item.data('movie') , $item.find('img').attr('src') , {
		// 	autoplay: false,
		// 	controls: false
		// } );

		// function showTheMovie (){
		// 	$('.brand_item_tit').show().animate({
		// 		marginTop: 0,
		// 		marginBottom: 0
		// 	} , 500 );
		// 	var $movieWrap = $('.brand_movie')//.height( $(window).height() - $('.header').height() - $('.brand_item_tit').height() )
		// 		// .delay(500)
		// 		.fadeIn(function(){
		// 			$item.data('video-object').play();
		// 		});

		// 	var winWidth = $(window).width();
		// 	$movieWrap.find('.brands-item')
		// 		.width( winWidth * 0.7 )
		// 		.each(function(){
		// 			fixImageToWrap( $(this) , $(this).find('img') );
		// 		});

		// 	$movieWrap.find('dl')
		// 		.css({
		// 			width: winWidth * $movieWrap.find('.brands-item').length,
		// 			marginLeft: itemIndex * winWidth * 0.7
		// 		});

		// 	// play the video
		// 	// resize the video
		// 	$item.trigger('resize');
		// }
	});

	// LP.action('show-brands-big-movie' , function(){
 //        return;
	// 	var $dom = $(this);
	// 	if( $dom.attr('disabled') ) return ;
	// 	$dom.attr('disabled' , 'disabled');

	// 	var winWidth = $(window).width();
	// 	var currIndex =  $('.brand_movie').data('index');
	// 	var itemIndex = $dom.prevAll('.brands-item').length;

	// 	var $current = $dom.parent().children().eq( currIndex );
	// 	var movieObject = $current.data('video-object');
 //        if( movieObject ){
 //            movieObject.dispose();
 //            $current.data('video-object' , null).find('.video-wrap').remove();
 //        }


 //        var isFullScreen = $('.brand_movie').data('fullScreen');
	// 	//var isShowBigVideo = !$dom.data('big-video');
	// 	if( currIndex != itemIndex ){
 //            // refresh index
 //            $('.brand_movie').data('index' , $dom.index());

 //            if( isFullScreen ){

 //            }

	// 		if( !isShowBigVideo ){
	// 			$current.animate({
	// 				width: winWidth * 0.7
	// 			} , 800 );

	// 			$dom.animate({
	// 				width: winWidth * 0.9
	// 			} , 800 )
	// 			.promise()
	// 			.then(function(){
	// 				clearInterval( interval );
	// 			});
	// 			var interval = setInterval(function(){
	// 				$dom.trigger('resize');
	// 			} , 1000 / 60 );
	// 		}


	// 		$dom.parent().animate({
	// 			marginLeft: - itemIndex * winWidth * 0.7 + ( !isShowBigVideo ? winWidth * 0.05 : winWidth * 0.15 )
	// 		} , 800 )
	// 		.promise()
	// 		.then(function(){
	// 			var video = $dom.data('video-object');
	// 			video && video.play();
	// 			$dom.removeAttr('disabled');
	// 		});

	// 		if( $dom.data('movie') && !$dom.data('video-object') ){
	// 			// render video
	// 			renderVideo( $dom , $dom.data('movie') , $dom.find('img').attr('src') , {
	// 			} );
	// 		}
	// 	} else {
	// 		// var interval ;
	// 		// interval = setInterval(function(){
	// 		// 	$dom.trigger('resize');
	// 		// 	$dom.parent()
	// 		// 		.children()
	// 		// 		.each(function(){
	// 		// 			fixImageToWrap( $(this) , $(this).find('img') );
	// 		// 		});
	// 		// } , 1000 / 60 );

	// 		// // $('.brand_movie').animate({
	// 		// // 	height: isShowBigVideo ? $(window).height() - headerHeight : 445
	// 		// // } , 600 , function(){
	// 		// // 	$(this).find('.brands-item').each(function(){
	// 		// // 		fixImageToWrap( $(this) , $(this).find('img') );
	// 		// // 	});
	// 		// // } )
 //   //          $dom.parent().find('.clone-img').remove();

	// 		// $dom.animate({
	// 		// 	width: isShowBigVideo ? winWidth * 0.9 : winWidth * 0.7
	// 		// } , 600 , '' , function(){
	// 		// 	clearInterval( interval );
	// 		// 	movieObject && movieObject.play();

	// 		// 	$dom.removeAttr('disabled')
	// 		// 		.parent()
	// 		// 		.children();

 //   //              $('.brand_movie').data('fullScreen' , !isFullScreen);

 //   //              $dom.trigger('mouseenter');
	// 		// } )
	// 		// .parent()
	// 		// .animate({
	// 		// 	marginLeft: - winWidth * 0.7 * itemIndex + ( isShowBigVideo ? winWidth * 0.05 : winWidth * 0.15 )
	// 		// } , 600 )
	// 		// .closest('.brand_movie')
	// 		// .animate(  {
	// 		// 	height: isShowBigVideo ? $(window).height() - headerHeight : 445,
	// 		// 	top: isShowBigVideo ? 0 : 88
	// 		// } , 600 );

 //   //          $('.brand_big_next,.brand_big_prev').animate({
 //   //              width: 0.05 * winWidth
 //   //          } , 600 );

	// 	}
	// });



	LP.action('search-toggle' , function(){
		var $wrap = $('.search-wrap');
		if( $wrap.is(':visible') ){
			$wrap.find('form').animate({
				marginTop: -96
			} , 300 )
			.promise()
			.then(function(){
				$wrap.hide();
			});
		} else {
			$wrap.show().find('form')
				.css('marginTop' , -96)
				.animate({
					marginTop: 0
				} , 300 )
				.promise()
				.then(function(){
					$wrap.find('input[type="text"]:visible').focus();
				});
		}
		$(this).toggleClass('search-close');

		return false;
	});


	LP.action('pop_close' , function(){
		$('.pop:visible').animate({
			top: '150%',
			opacity: 0
		} , 500 )
		.promise()
		.then(function(){
			$(this).hide();
			$('.shade').fadeOut();
		});
	});


	var press_index = 0;
	LP.action('press_img' , function(){
		press_index = 1;//$(this).closest('.press_item').prevAll('.press_item').length;
		$('<img/>').load(function(){
			var width = this.width;
			var height = this.height;
			var winHeight = $(window).height();
			var tHeight = Math.min( height , winHeight - 40 );
			this.style.height = tHeight + 'px';
			$('.shade').fadeIn();
			$('.pop_press').show()
				.css({
					top: '-150%',
					opacity: 1,
					marginLeft: - width / height * tHeight / 2,
					marginTop: - tHeight / 2
				})
				.find('.pop_presspho')
				.width( width / height * tHeight )
				.html( this )

				.end()
				.animate({
					top:  '50%'
				} , 400 )
				.promise()
				.then(function(){
					$('.pop_press_menus')
						.delay(100)
						.animate({
							right: 0
						} , 300 , 'easeLightOutBack');
				});

			$('.pop_press_menus').css('right' , 95 );
		})
		.attr( 'src' , $(this).find('.cover_img').data('cover') );

        $('.pop_index').html( press_index );
        $('.pop_total').html( $(this).closest('.press_item').find('.press_all').html() );
	});

	LP.action('press_prev' , function(){
		// get next cover image

        if( press_index == $('.pop_total').html() ) return false;
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

        $('.pop_index').html( press_index );
	});
	LP.action('press_next' , function(){
		// get next cover image
        if( press_index == 1 ){
            return false;
        }
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

        $('.pop_index').html( press_index );
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
				controls: true,
                pause_button: true
			} , function(){
				$('<div class="vjs-default-skin"></div>')
                    .append( $videoWrap.find('.vjs-control-bar') )
                    .appendTo( $videoWrap.parent() );
			});

			// start animate
			$videoWrap.animate({
				marginTop: 0
			} , 400);
		} else {

			$item.removeData('media-dom')
				.find('.interview_opt')
				.removeClass('opened');

			$videoWrap.animate({
				marginTop: -480
			} , 400)
			.promise()
			.then(function(){
                disposeVideo();
				$container.remove();
			});

			// follow items animates
			var $nexts = $container.nextAll()
				.each(function( i ){
					$(this).delay( 150 * i ).animate({
						marginTop: i == 0 ? 0 : -60,
						marginBottom: 80
					} , 400 , function(){
						$(this).css({
							marginTop: 0
						}).prev().css({
							marginTop: 0,
							marginBottom: 20
						});
					} );
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
					    	} , 300 );
			    	}
			  	});
			});
		} else {
			$container.find('.interview-music')
		    	.animate({
		    		marginTop: -190
		    	} , 300 )
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

			// follow items animates
			var $nexts = $container.nextAll()
				.each(function( i ){
					$(this).delay( 120 * i ).animate({
						marginTop: i == 0 ? 0 : -60,
						marginBottom: 80
					} , 400 , function(){
						$(this).css({
							marginTop: 0
						}).prev().css({
							marginTop: 0,
							marginBottom: 20
						});
					} );
				});
		}
		
	});


	LP.action('press_crumbs_link' , function( data ){
		var $dom = $(this);
		if( $dom.hasClass('active') ) return false;

        var off = $dom.offset();
        var width = $dom.width();
        var poff = $dom.parent().offset();
        var pwidth = $dom.parent().width();

        

        var marginLeft = ( pwidth - width - 2 * ( -poff.left + off.left ) ) / 2;


		var index = $dom.index();
		$dom.parent().find('a')
			.removeClass('active')
			.end()
			.animate({
				marginLeft: marginLeft
			} , 300);

		$dom.addClass('active');

		// var width = $dom.width();
		// var $wrap = $('<div><div></div></div>').find('div')
		// 	.html( $dom.html() )
		// 	.css('marginLeft' , -width / 2)
		// 	.end()
		// 	.appendTo(this);
		// $wrap.css({
		// 	position: 'absolute',
		// 	top: 0,
		// 	left: '50%',
		// 	width: 0,
		// 	color: '#000',
		// 	overflow: 'hidden',
		// 	whiteSpace: 'nowrap'
		// })
		// .delay( 300 )
		// .animate({
		// 	width: width,
		// 	marginLeft: - width / 2
		// } , 300)
		// .find('div')
		// .delay( 300 )
		// .animate({
		// 	marginLeft: 0
		// } , 300)
		// .promise()
		// .then(function(){
		// 	$dom.addClass('active');
		// 	$wrap.remove();
		// });

		// load press page
		pageManager.go( $dom.attr('href') , data.type );

		return false;
	});


	LP.action('search-btn' , function(){
		var $form = $(this).closest('form');
		var value = $form.find('input[type="text"]').val();
		if( !value ) {
			$form.find('input[type="text"]').focus();
			return false;
		}
		$form
			.hide()
			.next()
			.fadeIn()
			.find('h1 span').html( value );
		return false;
	});

	LP.action('pagetitarrtop' , function(){

        if( $('.header-inner').attr('disabled') || $('.header-inner').height() == 0 ) return false;
        $('.header-inner').attr('disabled' , 'disabled');
        // hide the header
        $('.header-inner')
            .stop( true )
            .animate({
                height: 0
            } , 500 );

        // $('.brands_tit').css({
        //     top: 66
        // }).addClass('fixed')
        //     .stop( true )
        //     .animate({
        //         top: 0
        //     } , 500);

        $('.sec_brands')
            .css({
                // paddingTop: $('.brands_tit').height()
            }).stop( true ).animate({
                top: 0
            } , 500)
            .promise()
            .then(function(){
                $('.header-inner').removeAttr('disabled');
            });


		// var $dom = $(this).attr('disabled' , 'disabled');
		// // get next item
		// var index = $('.sec_brands').data('index') || 0;
		// if( index == 0 ) return false;
		// var next = $('.gates-inner-l li').eq( index - 1 ).text();

		// // animate h2
		// var $h2 = $('.brands_tit .sec_brands_tit h2');
		// var $cloneH2 = $h2.clone()
		// 	.insertBefore( $h2 )
		// 	.css('marginTop' , -$h2.height())
		// 	.animate({
		// 		marginTop: 0
		// 	} , 300 )
		// 	.promise()
		// 	.then(function(){
		// 		$h2.remove();
		// 		$('.sec_brands').data('index' , index - 1 );
		// 		$dom.removeAttr('disabled');
		// 	});

		// // animate brands-tags
		// var $brandsTagsP =  $('.brands_tit .brands-tags p');
		// var $cloneP = $brandsTagsP.clone()
		// 	.insertBefore( $brandsTagsP )
		// 	.css('marginTop' , - $brandsTagsP.height())
		// 	.animate({
		// 		marginTop: 0
		// 	} , 300 )
		// 	.promise()
		// 	.then(function(){
		// 		$brandsTagsP.remove();
		// 	});

		return false;
	});

	LP.action('pagetitarrbottom' , function(){

        if( $('.header-inner').attr('disabled') ) return false;
        $('.header-inner').attr('disabled' , 'disabled');


        // show the header
        $('.header-inner')
        .stop( true )
        .animate({
            height: 66
        } , 500 );

        // $('.brands_tit').removeClass('fixed');

        $('.sec_brands')
            .css({
                paddingTop: 0
            })
            .stop( true )
            .animate({
                top: 66
            } , 500)
            .promise()
            .then(function(){
                $('.header-inner').removeAttr('disabled');
            });

		// var $dom = $(this).attr('disabled' , 'disabled');
		// // get next item
		// var index = $('.sec_brands').data('index') || 0;
		// var next = $('.gates-inner-l li').eq( index + 1 ).text();

		// // animate h2
		// var $h2 = $('.brands_tit .sec_brands_tit h2');
		// var $cloneH2 = $h2.clone()
		// 	.insertAfter( $h2 );
		// $h2.animate({
		// 	marginTop: - $h2.height()
		// } , 300 )
		// .promise()
		// .then(function(){
		// 	$h2.remove();
		// 	$('.sec_brands').data('index' , index + 1 );
		// 	$dom.removeAttr('disabled');
		// });


		// // animate brands-tags
		// var $brandsTagsP =  $('.brands_tit .brands-tags p');
		// var $cloneP = $brandsTagsP.clone()
		// 	.insertAfter( $brandsTagsP );
		// $brandsTagsP.animate({
		// 	marginTop: - $brandsTagsP.height()
		// } , 300 )
		// .promise()
		// .then(function(){
		// 	$brandsTagsP.remove();
		// });

		return false;
	});

	LP.action('awardfilter' , function(){
		$('.awardlist').fadeOut()
			.promise()
			.then(function(){
				$(this).fadeIn()
			});
		return false;
	});

	LP.action('pop-mask' , function(){
		LP.triggerAction('pop_close');
	});

    var job_index = 0;
    LP.action('jobs-more' , function(){
        $('.shade').fadeIn();
        $('.pop_jobs').show()
            .css({
                top: '-150%',
                opacity: 1
            })
            .animate({
                top:  '50%'
            } , 400 )
            .promise()
            .then(function(){
                $('.pop_press_menus')
                    .delay(100)
                    .animate({
                        right: 0
                    } , 300 , 'easeLightOutBack');
            });

        $('.pop_job_menus').css('right' , 95 );
    });

    LP.action('pop-jobs-prev' , function(){
        if( job_index == 1 ){
            return false;
        }
        press_index--;

        // TODO:: prepare content
        var $inner = $('.pop_jobcon_inner');
        var innerWidth = $inner.width();

        var $dom = $inner.css({
            width: innerWidth,
            float: 'left'
        }).clone().insertBefore($inner)
            .css({
                marginLeft: -innerWidth
            });

        $inner.css('marginRight' , -innerWidth );

        $dom.animate({
            marginLeft: 0
        } , 500 )
        .promise()
        .then(function(){
            $inner.remove();
        });

        $('.pop_index').html( press_index );
    });

    LP.action('pop-jobs-next' , function(){
        // get next cover image
        press_index++;

        // TODO:: prepare content
        var $inner = $('.pop_jobcon_inner');
        var innerWidth = $inner.width();
        var $dom = $inner.css({
            width: innerWidth,
            float: 'left'
        }).clone().insertAfter($inner)
            .css({
                marginRight: -innerWidth
            });

        $inner.animate({
            marginLeft: -innerWidth 
        } , 500 )
        .promise()
        .then(function(){
            $inner.remove();
            $dom.css('marginRight' , 0 );
        });

        $('.pop_index').html( press_index );
    });


    LP.action('page-pagetitarrtop' , function(){
        var $links = $('a[data-a="press_crumbs_link"]');
        var index = $links.filter('.active').index();
        if( $links.length && index > 0 ){
            $links.get( index - 1 ).click();
            return false;
        }

        var page = $('.page').data('header');

        $('.navitem').each(function( i ){
            var text = $.trim( $(this).text() ).toLowerCase();
            if( text == page ){
                var $link = $('.navitem').eq( i - 1 );
                if( $link.data('last') ){
                    pageManager.go( $link.data('last') );
                } else {
                    $link.get(0)
                        .click();
                }
            }
        });

        return false;
    });

    LP.action('page-pagetitarrbottom' , function(){

        var $links = $('a[data-a="press_crumbs_link"]');
        var index = $links.filter('.active').index();
        if( $links.length && index < $links.length - 1 ){
            $links.get( index + 1 ).click();
            return false;
        }

        // var pagename = location.href.replace(/^.*\/([^/]+)$/ , '$1' );

        var page = $('.page').data('header');

        $('.navitem').each(function( i ){
            var text = $.trim( $(this).text() ).toLowerCase();
            if( text == page ){
                var $link = $('.navitem').eq( i + 1 );
                $link.get(0) && $link.get(0)
                        .click();
                return false;
            }
        });

        return false;
    });


    LP.action('big-brands-item' , function(){
        var $dom = $(this);

        var newIndex = $dom.index();
        var prevIndex = $('.brand_movie').data('index');
        if( newIndex > prevIndex ){
            LP.triggerAction('brand_big_next' , {index: newIndex});
        } else if( newIndex < prevIndex ) {
            LP.triggerAction('brand_big_prev' , {index: newIndex});
        } else {
            $dom.find('.image-zoom').click();
        }
        return false;
    });

    LP.action('brand_big_prev' , function( data ){
        var index = $('.brand_movie').data('index');
        if( index == 0 ) return;

        var isFullScreen = $('.brand_movie').data('isFullScreen');

        var $items = $('.brand_movie').find('.brands-item');
        var $current = $items.eq( index );
        var $dom = $items.eq( data.index || index - 1 );
        var winWidth = $(window).width();
        var time = 600;

        if( $current.data('video-object') ){
            $current.data('video-object').muted();
        }
        unInitImageMouseMoveEffect( $current );

        var interval = setInterval(function(){
            fixImageToWrap( $dom , $dom.find('img') );
        } , 1000 / 30 );

        $current.animate({
            width: isFullScreen ? winWidth * 0.7 : winWidth * 0.9
        } , time ).find('.brands-mask').fadeIn( time );


        // do width brands-mask
        $dom.find('.brands-mask').fadeOut( time );

        $dom.animate({
            width: isFullScreen ? winWidth * 0.9 : winWidth * 0.7
        } , time )

        .parent()
        .animate({
            marginLeft: - ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                renderVideo( $dom , $dom.data('movie') , $dom.find('img').attr('src') , {
                    autoplay: false,
                    pause_button: true
                } );
            }

            // if( index - 1 == 0 ){
            //     $('.brand_big_prev').fadeOut();
            // }
            // $('.brand_big_next').fadeIn();
        });

        $('.brand_movie').data('index' , index - 1 );

        // var itemDom = $('.brand_movie').find('.brands-item').eq( index - 1 ).get(0);
        // itemDom && itemDom.click();
    });

    LP.action('brand_big_next' , function(data){
        var index = $('.brand_movie').data('index');

        var isFullScreen = $('.brand_movie').data('isFullScreen');

        var $items = $('.brand_movie').find('.brands-item');
        var $current = $items.eq( index );
        var $dom = $items.eq( data.index || index - 1 );
        if( !$dom.length ) return;

        var winWidth = $(window).width();
        var time = 600;

        // clear current effect
        if( $current.data('video-object') ){
            $current.data('video-object').muted();
        }
        unInitImageMouseMoveEffect( $current );

        $current.animate({
            width: winWidth * 0.7 
        } , time ).find('.brands-mask').fadeIn( time );

        var interval = setInterval(function(){
            fixImageToWrap( $dom , $dom.find('img') );
        } , 1000 / 30);

        // do width brands-mask
        $dom.find('.brands-mask').fadeOut( time );

        $dom.animate({
            width: isFullScreen ? winWidth * 0.9 : winWidth * 0.7
        } , time )

        .parent()
        .animate({
            marginLeft: - ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                renderVideo( $dom , $dom.data('movie') , $dom.find('img').attr('src') , {
                    autoplay: false,
                    pause_button: true
                } );
            } else if( $dom.data('image') ){
                initImageMouseMoveEffect( $dom );
            }

            // if( index + 1 == $('.brand_movie').find('.brands-item').length - 1 ){
            //     $('.brand_big_next').fadeOut();
            // }
            // $('.brand_big_prev').fadeIn();
        });

        $('.brand_movie').data('index' , index + 1 );

        // var itemDom = $('.brand_movie').find('.brands-item').eq( index + 1 ).get(0);
        // itemDom && itemDom.click();
    });
    

    LP.action('showreel' , function( e ){
        renderVideo($('.banpho-img') , '../videos/0' , '' , {
            autoplay: true,
            pause_button: true
        } );

        return false;
    });

    LP.action('image-zoom' , function(){
        //var $imgs = $(this).siblings('img');
        var $brandsItem = $(this).closest('.brands-item');
        var key = $brandsItem.data('key');

        imageZoom( brandItemManager.get( key ) );

        // var $wrap = $('<div class="image-zoom-big"><img /></div>').appendTo(document.body)
        //     //.append( $imgs.eq(0).clone().attr('$') )
        //     .hide()
        //     .fadeIn()

        //     // set image src
        //     .find('img')
        //     .attr('src' , $imgs.attr('src').replace(/picture_1\/[^/]+$/ , 'media/' + $brandsItem.data('media') ) )

        //     .end();

        // // TODO:: need to fix image width auto and height auto , show real big image
        // var $img = $wrap.find('img').css({
        //     position: 'absolute',
        //     // width: 'auto',
        //     // width: '150%',
        //     // height: 'auto'
        // });


        // var top = 0;
        // var left = 0;

        // var interval;
        // var runAnimate = function(){
        //     clearInterval( interval ) ;

        //     var duration = 800;
        //     var start = new Date();
        //     var ltop = parseInt( $img.css('top') ) || 0;
        //     var lleft = parseInt( $img.css('left') ) || 0;
        //     var ctop = top - ltop;
        //     var cleft = left - lleft;
        //     interval = setInterval(function(){
        //         // t: current time, b: begInnIng value, c: change In value, d: duration
        //         //x, t, b, c, d
        //         var dur = ( new Date() - start ) / duration;
        //         var per =  dur > 1 ? 1 : $.easing.easeOutQuart( 0 , dur , 0 , 1 , 1 );

        //         $img.css({
        //             top: ltop + ctop * per,
        //             left: lleft + cleft * per
        //         });

        //         if( per == 1 ){
        //             clearInterval( interval )
        //         }
        //     } , 1000 / 60 );
        // }

        // var winHeight = $(window).height();
        // var winWidth = $(window).width();
        // var imgWidth = $img.width();
        // var imgHeight = $img.height();
        // var st = $(window).scrollTop();
        // $wrap.on('mousemove' , function( ev ){
        //     left = - 2 * ev.pageX / winWidth * ( imgWidth - winWidth ) / 2;
        //     top = - 2 * ( ev.pageY ) / winHeight * ( imgHeight - winHeight ) / 2;
        //     runAnimate();
        // });

    });
    

    LP.action('people_opt' , function(){
        var isSlideDown = !$(this).hasClass('expand');
        if( isSlideDown ){
            $(this).siblings('.people_download').slideDown();
            $(this).siblings('.people_desc').slideDown();
        } else {
            $(this).siblings('.people_download').slideUp();
            $(this).siblings('.people_desc').slideUp();
        }

        $(this).toggleClass('expand');
    });

});
