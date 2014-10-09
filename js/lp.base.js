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

    var getRealPath = function( item , type ){
        // var lang = LP.getCookie('lang') || 'eng';
        var lang = 'eng';
        var rpath = 'http://www.fredfarid.com/#[lang]/file/#[_contentPath]/#[type]/#[name]';
        return LP.format( rpath , {
            lang: lang,
            _contentPath: item._contentPath,
            type: type,
            name: item[type],
        } );
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
        var src = itemsManager.getPath( item , 'media' );

        var $wrap = $('<div class="image-zoom-big"><img/></div>').appendTo(document.body)
            .hide()
            .fadeIn();

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

            var winWidth = $(window).width();
            var winHeight = $(window).height();

            if( imgWidth < winWidth || imgHeight < winHeight ){
                fixImageToWrap( $wrap , $img );
                imgWidth = $img.width();
                imgHeight = $img.height();
            }

            $wrap.on('mousemove' , function( ev ){
                var winHeight = $(window).height();
                var winWidth = $(window).width();

                left = - 2 * ev.pageX / winWidth * ( imgWidth - winWidth ) / 2;
                top = - 2 * ( ev.pageY - st ) / winHeight * ( imgHeight - winHeight ) / 2;
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
    var itemsManager = (function(){
        var __CACHE_AJAX__ = {};
        var __CACHE_ITEM__ = {};
        var __CACHE_BRAND__ = {};
        var __CACHE_TITLE__ = {};
        var index = 0;

        return {
            dump: function(){
                console.log( __CACHE_ITEM__ );
                console.log( __CACHE_AJAX__ );
            },

            renderTitle: function( path ){
                var paths = path.split('/');
                var key = paths[0] + '/' +  paths[1];
                if( __CACHE_TITLE__[ key ] ){
                    $('.sec_brands_tit h2').html( 
                        LP.format('<span>#[cate]</span>  <span class="sep">|</span>  <span>#[tit]</span>' , {
                            cate: paths[0].toUpperCase(),
                            tit: __CACHE_TITLE__[ key ].toUpperCase()
                        }));
                } else {
                    api.request( paths[0] , function( r ){
                        $.each( r.items , function( i , item ){
                            if( item.path == paths[1] ){
                                __CACHE_TITLE__[ key ] = item.title;
                                $('.sec_brands_tit h2').html( 
                                    LP.format('<span>#[cate]</span>  <span class="sep">|</span>  <span>#[tit]</span>' , {
                                        cate: paths[0].toUpperCase(),
                                        tit: item.title.toUpperCase()
                                    }));
                                return false;
                            }
                        } );
                    } );
                }
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
                        var items = r ? r.items : [];
                        $.each( items || [] , function( i , item ){
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

                return getRealPath( item , type );

                // var rpath = 'http://www.fredfarid.com/eng/file/pages_contents/#[brand_path]/#[type]/#[name]';
                // if( item._contentPath ){
                //     return getRealPath( item , type );

                //     // return LP.format( 'http://www.fredfarid.com/eng/file/#[_contentPath]/#[type]/#[name]' , {
                //     //     _contentPath: item._contentPath,
                //     //     type: type,
                //     //     name: item[ type ]
                //     // } );
                // } else {
                //     return LP.format( rpath , {
                //         brand_path: item.brand_path,
                //         //path: item.path,
                //         type: type,
                //         name: item[type],
                //     } );
                // }
            }
        }
    })();

    window.itemsManager = itemsManager;

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
                    $('.select-options').fadeOut();

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
            } , time || 1000 );
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

            var duration = 1000;
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
        $dom.on('mouseenter.image-effect' , function(){
            onZoom && onZoom();

            var $cImgs = $(this).find('.clone-img');

            initFn();

            off = $dom.offset();
            domWidth = $dom.width();
            domHeight = $dom.height();

            init = false;
            $cloneImg = $cImgs.length ? $cImgs : $img.clone().css({
                position: 'absolute',
                top: 0,
                left: 0
            })
            .addClass('clone-img')
            .appendTo( $dom );

            $cloneImg.stop().css({
                opacity: 1,
                display: 'block'
            }).animate({
                top: - fixHeight,
                left: - fixWidth,
                width: imgWidth + 2 * fixWidth,
                height: imgHeight + 2 * fixHeight
                
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
                $cloneImg && $cloneImg.fadeOut(100 , function(){
                    $cloneImg && $cloneImg.hide();
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
        itemIndex = parseInt( itemIndex );
        // change hash
        location.hash = '##!' + path + '/' + itemIndex;

        loadingMgr.show('black');
        // prev dealing
        disposeVideo();
        $('.sec_brands').scrollTop(0);
        $('.brand_movie').data( 'index' , itemIndex );


        var afterItemsRender = function( item ){

            var winWidth = $(window).width();


            // render brand_big_prev and brand_big_next status
            if( itemIndex == 0 ){
                $('.brand_big_prev').fadeOut();
            } else if( itemIndex == $('.brand_movie').find('.brands-item').length - 1 ){
                $('.brand_big_next').fadeOut();
            }

            $('.brand_movie').find('.brands-mask').show().hover(function(){
                $(this).animate({
                    opacity: 0.2
                } , 300);
            } , function(){
                $(this).animate({
                    opacity: 0.5
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
                    var key = $bigItem.data('key');
                    var item = itemsManager.get( key );
                    renderVideo( $bigItem , itemsManager.getPath( item , 'media' ) , $bigItem.find('img').attr('src') , {
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
            
            

            // fix initImageMouseMoveEffect
            if( $bigItem.data('image') ){
                initImageMouseMoveEffect( $bigItem );
            }
            
            var totalWidth = 0;
            var preWidth = 0;
            $movieWrap.find('.brands-item').css('width' , 'auto')
                .each(function( i ){
                    var itemWidth = $(this).width();
                    totalWidth += itemWidth;
                    if( i < itemIndex ){
                        preWidth += itemWidth;
                    } else if( i == itemIndex ){
                        preWidth += itemWidth / 2
                    }
                });


            $movieWrap.find('ul')
                .css({
                    width: totalWidth, //winWidth * $movieWrap.find('.brands-item').length,
                    marginLeft: winWidth / 2 - preWidth
                });


            // render brand information
            var textTpl = '<p class="brand_big_text_year">#[year]</p>\
                <div class="brand_big_text_item" style="width:80%;"> <p class="brand_big_text_tit">#[title]</p> <p class="brand_big_text_val">#[label]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">##[id]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">client</p> <p class="brand_big_text_val">#[fid_customer]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">year</p> <p class="brand_big_text_val">#[year]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">agency</p> <p class="brand_big_text_val">#[agency]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">GENRE</p> <p class="brand_big_text_val">#[cpgn_type]</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">Territory</p> <p class="brand_big_text_val">#[territory]</p> <p class="brand_big_text_val">&nbsp;</p></div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">DIRECTOR</p> <p class="brand_big_text_val">#[director]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">PHOTOGRAPHY</p> <p class="brand_big_text_val">#[photographer]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item"> <p class="brand_big_text_tit"> RESULT </p> #[results] </div>';

            itemsManager.getBrand( item.brand_path , function( brand ){
                brand['year'] = brand['date'].split('-')[0];
                var str = LP.format( textTpl , brand );
                $('.brand_big_text').html( str );
            } );


            loadingMgr.hide();
        }

        itemsManager.getItems( path , function( r ){
            var item = r.items[ itemIndex ];
            var aHtml = ['<ul class="brands-items">'];
            var tpl = '<li class="brands-item" data-a="big-brands-item" data-image="#[image]" data-movie="#[video]" data-key="#[key]"><div class="brands-mask"></div><img src="#[picture]"></li>';

            var pics = [];
            $.each( r.items , function( i , tm ){
                var pic = itemsManager.getPath( tm , 'picture_1' );
                pics.push( pic )

                aHtml.push( LP.format( tpl , {
                    key: tm.key ,
                    picture: pic,
                    image: tm.media.match(/\.jpg$/) ? 1 : '',
                    video: tm.media.match(/\.jpg$/) ? '' : 1 
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
        $('header-inner').height(66);
        $('.sec_brands,.brand_movie,.brand_item_tit').fadeOut();

        // show loading
        loadingMgr.show('black');
        // get 'type' catelist
        api.request( type , function( r ){
            // add hash to url
            location.hash = '##!' + type;

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

            switch( type ){
                case 'categories':
                case 'services':
                    $('.sec_gates').find('.gates-inner-r').hide();
                    break;
                case 'brands':
                    $('.sec_gates').find('.gates-inner-r').show();
                    break;
            }

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
    //  if( $('.sec_gates').is(':visible') ){
    //      hideCategory();
    //      return; 
    //  }

    //  if( $('.sec_brands').is(':visible') ){
    //      hideBrands();
    //  }

    //  $('.sec_brands').hide();
    //  var winHeight = $(window).height();
    //  $('.sec_gates').fadeIn()
    //      .promise()
    //      .then(function(){
    //          $('.gates-inner')
    //              .animate({
    //                  marginTop: 0
    //              } , 1000 , 'easeOutBack' );
    //      });

        

    //  // render the letters
    //  var letters = [];
    //  $('.gates-inner-l a').each(function(){
    //      var l = $.trim($(this).text())[0].toUpperCase();
    //      if( $.inArray( l , letters ) < 0 ){
    //          letters.push( l );
    //      }
    //  });

    //  letters.sort();
    //  var html = [];
    //  $.each( letters , function( i , l ){
    //      html.push('<li> <a data-a="filter-letter" href="#">' + l + '</a> </li>');
    //  } );
    //  $('.gates-inner-c ul').html( html.join('') );

    //  $(document.body).css('overflow' , 'hidden');
    // }

    function hideCategory( cb ){
        location.hash = '##!';

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


    function renderGoogleMap( $dom , points ){
        if( !window.google ) return;
        // point[0] = point[0] || 0;
        // point[1] = point[1] || 0;

        var map = new google.maps.Map($dom[0],{
            center: new google.maps.LatLng(0,0),//new google.maps.LatLng(point[0],point[1]),
            zoom:2,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        });


        var styleArray = [
          {
            featureType: "all",
            stylers: [
              { saturation: -80 }
            ]
          },{
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              { hue: "#999" },
              { saturation: 50 }
            ]
          },{
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [
              { hue: "#999" },
              { saturation: 50 }
            ]                
          }
        ];
        map.setOptions({styles: styleArray});

        $.each( points , function( i , point ){
            new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(point[0],point[1]),
                icon: "../images/marker.png"
            });
        } );
    }


    function showBrands( ){
        location.hash = '##!' + $('.sec_brands').data('path');
        // set brands-items width
        $('.brands-con').show();
        if( !$('.brands-con').children().length ){
            LP.triggerAction('show-brands' , {path: $('.sec_brands').data('path')});

            return false;
        }


        $('.sec_brands').show()
            .scrollTop(0)
            .css({
                top: $('.header').height()
            });

        // hide slider video
        disposeVideo();

        $('.brands_tit').show().animate({
            marginTop: 0,
            marginBottom: 0
        } , 200 );


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

                                // if( $this.data('image') )
                                //     initImageMouseMoveEffect( $this );

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
                                opacity: 0.5
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
            var ajax = itemsManager.getItems( path , function( r ){
                var tHtml = [];
                var tpl = '<li data-a="brands-item" class="brands-item" data-image="#[image]" data-movie="#[video]" data-key="#[key]"><div class="brands-mask"></div><img src="#[picture]"></li>';
                var pics = [];
                var items = r ? r.items : [];
                $.each( items || [] , function( i , item ){
                    var pic = itemsManager.getPath( item , 'picture' );
                    pics.push( pic );
                    tHtml.push( LP.format( tpl , {
                        key: item.key,
                        picture: pic,
                        image: item.media.match(/\.jpg$/) ? 1 : '',
                        video: item.media.match(/\.jpg$/) ? '' : 1 
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
        });

        $(document.body).css('overflow' , 'hidden');
    }

    function hideBrands( changeHash ){
        var category = $('.sec_brands').data('path').split('/')[0];
        if( changeHash !== false )
            location.hash = '##!' + category;

        $('.brand_item_tit').css({
            'margin-top': -88,
            'margin-bottom': 88
        }).hide();

        $('.header-inner').height(66);

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
                            $('.sec_brands').hide();
                            show_cate_list( category );
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
            vh = h ;
            vw = vh / ratio;
        } else {
            vw = w ;
            vh = vw * ratio;
        }

        $img.css({
            width: vw,
            height: vh,
            marginTop: ( h - vh ) / 2,
            marginLeft: ( w - vw ) / 2
        });
    }


    function renderVideo ( $wrap , movie , poster , config , cb ){
        var id = 'video-js-' + ( $.guid++ );
        $wrap.append( LP.format( '<div class="video-wrap" style="display:none;"><video id="#[id]" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"\
            preload="auto"\
              poster="#[poster]">\
             <source src="#[videoFile]" type="video/mp4" />\
             <source src="#[videoFile]" type="video/webm" />\
             <source src="#[videoFile]" type="video/ogg" />\
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

                cb && cb.call(v,v);
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
            showLoading: function( $wrap ){
                $('<div class="loading-wrap" style="position: absolute;"><div class="loading" style="position:absolute;"></div></div>').appendTo( $wrap )
                    .fadeIn();
                var $loading = $wrap.find('.loading');
                clearInterval( $wrap.data('interval') );
                var index = 0;
                $wrap.data('interval' , setInterval(function(){
                    $loading.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
                } , 1000 / 6 ) );
            },
            hideLoading: function( $wrap ){
                clearInterval( $wrap.data('interval') );
                $wrap.find('.loading-wrap').fadeOut();
            },
            show: function( bgcolor ){
                var index = 0;
                var processStep = 5;
                var processWidth = 0;
                var processTarget = 0;
                bgcolor = colors[bgcolor] || bgcolor || 'white';
                var $inner = $loading.fadeIn().find('.loading');
                $loading.css({
                    'background-color':  bgcolor
                });
                clearInterval( interval );

                var $process = $('.process').show();
                interval = setInterval(function(){
                    $inner.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
                    // processStep -= 1 / 60;
                    // processTarget += Math.max( processStep , 0 );

                    // processWidth = Math.min( processWidth + 0.5 , processTarget );
                    // $process.css('width' , processWidth + '%');

                } , 1000 / 6 );
            },
            hide: function(){
                $('.process').hide();
                clearInterval( interval );
                $loading.fadeOut();
            }
        }
    })();
    window.loadingMgr = loadingMgr;


    // page init here
    // ============================================================================

    // window scroll event
    var $header = $('.header');
    var headerHeight = $header.height();


    var isAtTop = false;
    var isAtBottom = false;
    var gatesScrollTop = 0;
    var runedNum = 0;
    var $gatesInnerL =  $('.gates-inner-l').mousemove(function( ev ){
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

    //var sec_brands_stop = 0;
    var sec_brands_timer = null;
    $('.sec_brands').scroll(function(){
        //clearTimeout( sec_brands_timer );
        //sec_brands_timer = setTimeout(function(){
            if( $('.brand_movie').data('isFullScreen') ) return false;
            var headerHeight = $('.header-inner').height();
            var st = $('.sec_brands').scrollTop();
            if( st < headerHeight ){
                $('.sec_brands').css({
                    top: headerHeight - st
                })
                .find('.sec_brands_tit')
                .css({
                    'margin-top': st,
                    position: 'relative'
                })
                .next()
                .css('margin-top' , 0 );

                // if( $('.header-inner').attr('disabled') || $('.header-inner').height() == 0 ) return false;
                // $('.header-inner').attr('disabled' , 'disabled');
                // hide the header
                // $('.header-inner')
                //     .stop( true )
                //     .animate({
                //         height: 0
                //     } , 500 );


                // $('.sec_brands')
                //     .css({
                //         paddingTop: $('.sec_brands_tit').height()
                //     })
                    // .stop( true ).animate({
                    //     top: 0
                    // } , 500)
                    // .promise()
                    // .then(function(){
                    //     $('.header-inner').removeAttr('disabled');
                    // });

                // $('.sec_brands_tit').css({
                //     position: 'fixed',
                //     width: '100%',
                //     top: st
                // })
            } else {
                $('.sec_brands').css({
                    top: 0
                })
                .find('.sec_brands_tit')
                .css({
                    'margin-top': 0,
                    position: 'fixed',
                    width: '100%',
                    top: 0
                })
                .next()
                .css('margin-top' , $('.sec_brands_tit').height() + headerHeight );
                // if( $('.header-inner').attr('disabled') ) return false;
                // $('.header-inner').attr('disabled' , 'disabled');


                // show the header
                // $('.header-inner')
                //  .stop( true )
                //  .animate({
                //     height: 66
                //  } , 500 );

                // $('.brands_tit').removeClass('fixed');

                // $('.sec_brands')
                //     .css({
                //         paddingTop: 0
                //     })
                //     .stop( true )
                //     .animate({
                //         top: 66
                //     } , 500)
                //     .promise()
                //     .then(function(){
                //         $('.header-inner').removeAttr('disabled');
                //     });
            }
        //} , 100 );
    });

    var brandsInterval = null;
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

    })
    .delegate('.brands-con-li' , 'mouseleave' , function(){
        clearInterval( brandsInterval );
        $(this).find('.brands-mask').stop( true , true ).animate({
            opacity: 0.7
        } , 600);
    })
    // .delegate('.brands-item' , 'mouseenter' , function(){
    //     // init video with silence
    //     var $dom = $(this);
    //     if( $dom.data('movie') ){
    //         // if( $dom.data('video-object') ){
    //         //  $dom.data('video-object').play();
    //         // } else {
    //         var key = $dom.data('key');
    //         var item = itemsManager.get( key );
    //         renderVideo( $dom , itemsManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
    //             muted: true,
    //             autoplay: true,
    //             resize: false
    //         } , function( v ){
    //             try{v.dimensions( '100%' , '100%' );}catch(e){}
    //         } );
    //         //}
    //     }
    // })
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



    // var hashManager = (function(){
    //     var prefix = '##!';

    //     // ##!categories/travel_transport/klm_world_cup_hijack_1/0
    //     var deal = function( path ){
    //          path = path.replace( prefix , '' );
    //          var paths = path.split('/');

    //          return {
    //             cate_type   : paths[0],
    //             cate        : paths[1],
    //             events      : paths[2],
    //             index       : paths[3],
    //             type        : paths[4]
    //          }
    //     }

    //     var current_status = null;

    //     var show_anis = {
    //         'asc_cate_type' : function(){
    //             if( $('.home-slider').length ){
    //                 var winTop = $(window).scrollTop();
    //                 var sliderHeight = $('.home-slider').height();
    //                 if( winTop < sliderHeight ){
    //                     $('html,body').animate({
    //                         scrollTop: sliderHeight
    //                     } , 500 )
    //                     .promise()
    //                     .then(function(){
    //                         $(document.body).css('overflow' , 'hidden');
    //                         show_cate_list( current_status.cate_type );
    //                     });
    //                 } else {
    //                     show_cate_list( current_status.cate_type );
    //                 }
    //             } else {
    //                 show_cate_list( current_status.cate_type );
    //             }

    //             // hide slider video
    //             disposeVideo();
    //         },
    //         'cate' : function(){

    //         },
    //         'events': function(){

    //         },
    //         'index': function(){

    //         },
    //         'type': function(){

    //         }
    //     }
        

    //     return {
    //         go: function( path ){
    //             current_status = deal( path );

    //         }
    //     }
    // })();

    var banphoConTimer ;
    var isInBanphoCon = false;
    // is playing just now
    // var isCurrentPlaying = false;
    var isHeadHide = false;

    var pageManager = (function(){
        var initSlider = function( cb ){
            var $slider = $('.home-slider');
            // init home slider
            // ============================
            var firstLoaded = false;
            var $sliderInner = $('.slider-block-inner').css('width' , $('.slider-item').length + '00%');
            $sliderInner.data('cb' , cb);

            // hide left arrow 
            $sliderInner.next().find('.banpho-bt-l').hide();

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

            var $banphoCon = $('.banpho-con').hover(function(){
                clearTimeout( banphoConTimer );
                isInBanphoCon = true;
            } , function(){
                isInBanphoCon = false;
            });
            

            intMouseMoveEffect( $slider , function( ev ){

                // if( $(ev.target).closest('.banpho-con').length ) return;
                // resize the videos

                var $inner = $('.slider-block-inner');
                var $item = $inner.children('.slider-item').eq( $inner.data('index') );

                // if video is not playing
                var video = $item.data('video-object');
                if( !video || video.paused() ) return;

                $banphoCon.fadeOut();

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

                $('.slider-block-inner').animate({
                    height: $(window).height() - $('.header').height()
                } , 500);

                $banphoCon.fadeIn();
            } );

            cb && cb( 0 );
        }

        var pageInits = {
            'home-page' : function( cb ){
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

                });

                // render home news
                api.request('miscellaneous' , function( r ){
                    $.each( r.items , function( i , item ){
                        switch( item.id ){
                            case '1': 
                                var htmls = [];
                                $.each([1,2,3] , function( i , val ){
                                    if( item[ 'text_' + val ] ){
                                        htmls.push( '<p>' + item[ 'text_' + val ] + '</p>' );
                                    }
                                });
                                $('#home-news').css('width' , htmls.length * 100 + '%' )
                                    .html( htmls.join('') )
                                    .find('p')
                                    .css('width' , 1 / htmls.length * 100 + '%' );

                                $('.home_newspage span').html( '1/' + htmls.length );
                                if( htmls.length <= 1 ){
                                    $('.home_newspage').hide();
                                }
                                break;
                            case '2':
                                $('.home_bioleft').html( item.content_1 );
                                $('.home_bioright').html( item.content_2 );
                                break;
                            case '3':
                                // TODO render 
                        }
                    } );
                });

                // render home page slider
                api.request('home' , function( r ){
                    var aHtml = [];
                    $.each( r.items || [] , function( i , item ){
                        item.brand_path = 'home';
                        aHtml.push( LP.format('<div class="slider-item" data-movie="#[video]"><img src="#[image]" /></div>' , {
                            image: itemsManager.getPath( item , 'picture' ),
                            video: itemsManager.getPath( item , 'video' )
                        }));
                    } );

                    $('#slider-block-inner').html( aHtml.join('') );
                    initSlider();

                    cb && cb();
                });


                // init campaigns mouse move effect
                $('.cam_item div').each(function(){
                    initImageMouseMoveEffect( $(this) );  
                });
            },
            'awards-page': function( cb ){
                $('.awardicons img').hover(function(){
                    var num = $(this).data('num');
                    $('.awardicons span').html( num );

                    effects['number-rock']( $('.awardicons span') , 0  , null , 500 );
                }); 

                cb && cb();
            },
            'contact-page': function( cb ){
                renderGoogleMap( $('#map') , [[31.227919,121.478988],[11.227919,111.478988],[50.227919,67.478988],[11.227919,24.478988]] );
                // var _LP = window.LP;
                // LP.use('http://api0.map.bdimg.com/getscript?v=2.0&ak=AwxxvHue9bTdFietVWM4PLtk&services=&t=20140725172530' , function(){
                //     window.LP = _LP;
                // });
                // var interval = setInterval(function(){
                //     if( window.BMap ){
                //         clearInterval( interval );
                //         var oMap = new BMap.Map("map");
                //         oMap.addControl(new BMap.NavigationControl());
                //         var point = new BMap.Point(121.478988,31.227919);
                //         oMap.centerAndZoom(point, 15);
                //         //oMap.setMapStyle({style: 'grayscale'});
                //         oMap.setMapStyle({
                //           styleJson:[{
                //                     "featureType": "all",
                //                     "elementType": "all",
                //                     "stylers": {
                //                               "lightness": 13,
                //                               "saturation": -100
                //                     }
                //           }]
                //         });
                //     }
                // } , 100 );

                $('.pagetit .pagetitarrbottom').fadeOut();

                // loading concat
                var aHtml = [];
                var bHtml = [];
                api.request('about/contact/peoples' , function( r ){
                    $.each( r.items , function( i , item ){
                        var c = i == 0 ? 'contact_maill' : i == r.items.length - 1 ? 'contact_mailr' : 'contact_mailc';
                        aHtml.push('<td class="' + c + '">' + item.title + '</td>');
                        bHtml.push('<td class="' + c + '">' + item.content + '</td>');
                    });
                    $('.contact_mail').find('tr').eq(0)
                        .html( aHtml.join('') )
                        .next()
                        .html( bHtml.join('') );
                });


                cb && cb();
                
            },
            'interview-page': function( cb ){
                // preload js conponent
                LP.use( ['video-js' , '../plugin/jquery.jplayer.min.js'] );

                var tpl = '<div data-effect="fadeup" class="interview_item intoview-effect interview_#[oddoreven] cs-clear">\
                    <div class="interview_info">\
                        <span><strong>#[title]</strong><br/>#[content]</span>\
                    </div>\
                    <div class="interview_img" data-a="show-video-interview" data-media="#[media]">\
                        <img src="#[preview]">\
                    </div>\
                    <span class="interview_opt" data-a="show-video-interview" data-media="#[media]">\
                        <div class="transition">#[text]</div>\
                    </span>\
                </div>';
                // var radioTpl = '<div data-effect="fadeup" class="interview_item intoview-effect interview_even cs-clear">\
                //     <div class="interview_info">\
                //         <span><strong>#[title]</strong><br/>#[content]</span>\
                //     </div>\
                //     <div class="interview_img"  data-a="show-music-interview" data-media="#[media]"><img src="#[preview]"></div>\
                //     <span class="interview_opt" data-a="show-music-interview" data-media="#[media]">\
                //         <div class="transition">LISTEN<br/>CLOSE</div>\
                //     </span>\
                // </div>';
                // get audio and video
                api.request(['about/interviews/radio','about/interviews/tv'] , function( r ){
                    var aHtml = [];
                    var date = [];
                    
                    $.each(r.items , function( i , item ){
                        // var tpl = item._contentPath.match(/tv$/)? tvTpl : radioTpl;
                        var titles = item.title.split('|');
                        aHtml.push( LP.format( tpl , {
                            oddoreven: i % 2 ? 'even' : 'odd',
                            text: item._contentPath.match(/tv$/) ? 'WATCH<br/>CLOSE' : 'LISTEN<br/>CLOSE',
                            title: titles[0] ,
                            content: titles.slice(1).join('<br/>'),
                            preview: getRealPath( item , 'picture_2' ),
                            media: getRealPath( item , 'media' )
                        } ) );
                    });

                    $('#press-container').html( aHtml.join('') );

                    loadImages( $('#press-container img') , function(){
                        $('#press-container img').each(function(){
                            fixImageToWrap( $(this).parent() , $(this) );
                        });
                    } );
                    cb && cb();
                });
                
            },
            'press-page': function( cb ){

                var positions = [-44,-142,-240,-338,-436,-534];
                var index = 0;
                clearInterval( window.press_interval );
                window.press_interval = setInterval(function(){
                    var $wraps = $('.ploading-wrap');
                    if( !$wraps.length ){
                        clearInterval( window.press_interval );
                    }

                    $wraps.find('.loading').css('background-position' , 'right ' + positions[( index++ % positions.length )] + 'px' );
                } , 1000 / positions.length);

                // loading all articles
                // var pathContents = [];
                // for( var year = ( new Date() ).getFullYear() ; year >= 1999 ; year-- ){
                //     pathContents.push( 'about/press_articles/' + year );
                // }
                // api.request( pathContents , function( r ){
                //     console.log( r );
                // } );
                cb && cb();
            },
            'jobs-page': function( cb ){
                api.request('about/jobs' , function( r ){
                    var contentPaths = [];
                    $.each( r.items , function( i , item ){
                        contentPaths.push( 'about/jobs/' + item.path );
                    } );


                    var tpl = '<div data-effect="fadeup" class="jobsitem intoview-effect">\
                            <h3>#[title]</h3>\
                            <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                            <p class="jobs-con">#[content]</p>\
                            <strong class="jobs_more transition-wrap"  data-a="jobs-more" data-d="contact=#[contact]">\
                                <div class="transition">MORE <br><br> MORE</div>\
                            </strong>\
                            <div class="pop_jobcon_inner" style="display:none;">\
                                <div class="joblang"><a href="#" data-a="jobs-lang" data-lang="en"> EN </a> <a href="#" data-a="jobs-lang" data-lang="cn"> 中国 </a></div>\
                                <div class="jobcontent content_en">\
                                    <h3>#[title]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content]</div>\
                                </div>\
                                <div class="jobcontent content_cn" style="display:none;">\
                                    <h3>#[title_zho]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content_zho]</div>\
                                </div>\
                            </div>\
                        </div>';
                    // <a href="mailto:#[contact]" class="jobs_more transition-wrap">\
                    //             <div class="transition">APPLY <br><br> APPLY</div>\
                    //         </a>\
                    var aHtml = [];
                    api.request( contentPaths , function( r ){
                        $.each( r.items , function( i , item){
                            aHtml.push( LP.format( tpl , item ) );
                        } );

                        $('.jobslist').html( aHtml.join('') );
                        cb && cb();
                    } );
                });
            },
            'bio-page': function( cb ){
                var aHtml = [];
                var tpl = '';
                api.request('about/f_f_bio' , function( r ){
                    // $.each( r.items , function( i , item ){
                    //     // aHtml.push( LP.format( tpl , item ) );
                    //     aHtml.push( item.content );
                    // } );
                    // $('#sec_content').html( aHtml.join('\n') );

                    $('#download').attr('href' , itemsManager.getPath( r.items[0] , 'file' ) );
                    cb && cb();
                });
            },
            'ffshowreel-page': function( cb ){
                var aHtml = [];
                var tpl = '<div class="slider-item" data-movie="#[movie]"><img src="#[image]"></div>';
                var getResPath = getRealPath;

                // ( item , type )function( item , type ){
                //     return LP.format( 'http://www.fredfarid.com/eng/file/pages_contents/about/f_f_personal_showreel/#[type]/#[name]' , {
                //         type: type,
                //         name: item[ type ]
                //     });
                // }

                var images = [];
                api.request('about/f_f_personal_showreel' , function( r ){
                    $.each( r.items , function( i , item ){
                        aHtml.push( LP.format( tpl , {
                            image: getResPath( item , 'preview' ),
                            movie: getResPath( item , 'video_small' ).replace(/\.\w+$/ , '')
                        } ) );

                        images.push( getResPath( item , 'preview' ) );
                    } );

                    $('#slider-block-inner').html( aHtml.join('') ).children()
                            .eq(0).css('opacity' , 1).fadeIn();


                    initSlider( function( index ){
                        var item = r.items[ index ];
                        $('.showreel-tit').html( LP.format( '<h3>#[brand]</h3><p>#[campaign]</p><p>#[year]</p></div>' , {
                            brand: item.brand,
                            campaign: item.campaign,
                            year: item.date_and_price.split('-')[0]
                        } ) );
                    } );

                    loadImages( images.slice( 0 , 3 ) , function(){
                        cb && cb();
                    });
                });
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
                var duration = du || 600;
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
            },
            'press-loading': function( $dom , index , cb ){
                var tpl = '<div class="press_item" data-path="#[year]/#[id]">\
                    <div class="press_img" data-a="press_img" data-path="#[year]/#[id]">\
                        <img class="cover_img" data-cover="#[cover]" src="#[preview]" />\
                        <img src="../images/press_demopho1.jpg" />\
                        <img class="press_top_right transition" src="../images/press_top_right.png">\
                        <img class="press_bottom_left transition" src="../images/press_bottom_left.png">\
                    </div>\
                    <h3>#[title]</h3>\
                    <p class="press_itemtxt"><strong>#[title]</strong>#[content]</p>\
                    <div class="cs-clear">\
                        <strong class="press_itempage">#[index]/<span class="press_all">#[total]</span></strong>\
                        <a class="press_itemdown transition" target="_blank" href="#[attached_file]"></a>\
                    </div>\
                </div>';
                var biuldPressImageUrl = getRealPath;

                // function( item , type ){
                //     var year = item.date.split('-')[0];
                //     return LP.format( 'http://www.fredfarid.com/eng/file/pages_contents/about/press_articles/#[year]/#[type]/#[name]' , {
                //         year: year,
                //         type: type , 
                //         name: item[type]
                //     });
                // }
                api.request('about/press_articles/' + $dom.data('year') , function( r ){
                    var aHtml = [];
                    $.each( r.items , function( i , item ){
                        aHtml.push( LP.format( tpl , {
                            year: item.date.split('-')[0],
                            title: item.title,
                            content: item.content,
                            id: item.id,
                            cover: biuldPressImageUrl( item , 'picture_2' ),
                            preview: biuldPressImageUrl( item , 'preview' ),
                            index: i + 1,
                            total: r.items.length,
                            attached_file: biuldPressImageUrl( item , 'attached_file' )
                        } ) );
                    } );

                    $dom.html( aHtml.join('') );
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
                loadingMgr.show();
                var $page = $('.page');
                var fn = pageInits[ $page.data('page') ];

                if( fn ){
                    fn( function(){
                        $(window).trigger('scroll');
                        loadingMgr.hide();
                    });
                } else {
                    loadingMgr.hide();
                }

                // fix common page init
                // for  banpho-img
                var $footer = $('.footer');
                $(window).scroll(function(){
                    var stTop = $(window).scrollTop() + headerHeight;
                    var winHeight = $(window).height();

                    if( $('.banpho-img').length ){
                        var $banpho = $('.banpho-img');
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
                                
                            }
                        });
                    }

                    // fix quote event "banner_footer"
                    $('.banner_footer').css('background-position' , '0 ' + ~~(stTop / 3) + 'px' );
                })
                .trigger('scroll');


                // init select
                initSelect( $('select') );


                // init texteffect
                // $('.navitem,.crumbs a').filter(':not(.text-effect-init)')
                //     .addClass('text-effect-init')
                //     .hover(function(){
                //         textEffect( $(this) );
                //     } , function(){
                //         $(this).children('div').remove();
                //     });

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

    
    // load footer json data
    api.request( 'footer_icons' , function( r ){
        var shareHtml = [];
        $.each(r.items , function( i , item ){
            if( item.role == 'share' ){
                shareHtml.push( LP.format('<a role="#[role]" href="#[link]" target="#[link_target]" class="find_item #[name]">#[label]</a>' , item ) )
            }
        });
        $('#share-wrap').html( shareHtml.join('') );

        // render websites
        var linkHtml = [];
        $.each(r.items , function( i , item ){
            if( item.role == 'icon' && item.link ){
                linkHtml.push( LP.format('<a role="#[role]" href="#[link]" target="#[link_target]" class="work_item #[name]">#[label]</a>' , item ) )
            }
        });
        $('#icon-wrap').html( linkHtml.join('') );

    });

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

            // if only change hash
            if( State.url.indexOf('##') >= 0 ){
                return false;
            }
            // show loading
            loadingMgr.show();
            switch( type ){
     //         case 'press':
                    // $.get( location.href , '' , function( html ){
                    //  html = $('<div>' + html + '</div>').find('#press-container')
                    //      .html();
                    //  $( '#press-container' ).children().animate({
                    //      opacity: 0
                    //  } , 500);
                    //  setTimeout(function(){
                    //      $( '#press-container' ).html( html )
                    //          .children()
                    //          .fadeIn();

                    //      $('html,body').animate({
                    //          scrollTop: $('.pagetit').height() + $('.banpho-img img').height() / 2
                    //      } , 400 );

                    //      pageManager.destroy( );
     //                     pageManager.init( );

     //                     loadingMgr.hide();
                    //  } , 500);
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

                    // change url hash
                    location.hash = location.hash.replace(/\/big$/ , '') ;

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
                        // $(window).unbind('resize.brand_movie');
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
                                showBrands();
                            });

                    }
                    return false;
                }

                // for home-cam-item-big
                if( $('.home-cam-item-big').length ){
                    $('.home-cam-item-big').click();
                }

                if( $('.brands-con').is(":visible") ){
                    hideBrands();
                    return false;
                }

                if( $('.sec_gates').is(':visible') ){
                    hideCategory();
                    return false;
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
    
    // ==============================================================
    // init location hash here
    if( location.hash && location.hash != '##!' ){
        !!(function(){
            var hash = location.hash.replace('##!' , '');
            //##!categories/travel_transport/klm_world_cup_hijack_1/1/big
            var hashs = hash.split('/');
            switch( hashs.length ){
                case 1:
                    setTimeout(function(){
                        LP.triggerAction('show-category' , {type: hashs[0]});
                    } , 10);
                    
                    break;
                case 2:
                    api.request( hashs[0] , function( r ){
                        $.each( r.items , function( i , item ){
                            if( item.path == hashs[1] ){
                                LP.triggerAction('show-brands' , {path: hash , tit: item.title});
                                return false;
                            }
                        } );
                    } );
                    break;
                case 4:
                    itemsManager.renderTitle( hash );

                    $(window).load(function(){
                        // set data to brand_movie
                        var sliderHeight = $('.home-slider').height();
                        if( $('.home-slider').length ){
                            // scroll to $('.home-slider').height()
                            $('html,body').animate({
                                scrollTop: sliderHeight / 2
                            } , 100);
                            $(document.body).css('overflow' , 'hidden');
                        }
                    })
                    
                    // show 
                    $('.sec_brands').fadeIn().data('path' , hashs.slice(0,2).join('/'));
                    $('.brands-con,.brands_tit').hide();
                    showBigBrandsItem( hashs.slice(0,3).join('/') , hashs[3] );
                case 5:
            }
        })();
    }

    //  else {
    //     $(window).load(loadingMgr.hide);
    // }


    // big brand video double click event
    // $('.brand_movie').on('dblclick' , '.brands-item' , function(){
    //     // untrigger stroll event
        

    //     var isFullScreen = $('.brand_movie').data('isFullScreen');
    //     isFullScreen = !isFullScreen;

    //     $('.brand_movie').data('isFullScreen' , isFullScreen );

    //     var winWidth = $(window).width();
    //     var time = 600;
    //     var $dom = $(this);

    //     // stop the video
    //     if( $dom.data('video-object') ){
    //         $dom.data('video-object').pause();
    //     }

    //     var interval = setInterval(function(){
    //         $dom.trigger('resize');

    //         // fixImageToWrap( $dom , $dom.find('img') );
    //         $dom.parent()
    //             .children()
    //             .each(function(){
    //                 fixImageToWrap( $(this) , $(this).find('img') );
    //             });
    //     } , 1000 / 60 );


    //     $(this).animate({
    //         width: winWidth * ( isFullScreen ? 0.9 : 0.7 )
    //     } , time );


    //     $('.brand_movie')
    //         .animate(  {
    //             // height: isFullScreen ? $(window).height() - $('.header-inner').height() : 445,
    //             top: isFullScreen ? 0 : 88
    //         } , 600 )

    //         .find('ul').animate({
    //             height: isFullScreen ? $(window).height() - $('.header-inner').height() : 445,
    //             marginLeft: - $(this).prevAll().length * winWidth * 0.7 + winWidth * ( isFullScreen ? 0.05 : 0.15 )
    //         } , time )
    //         .promise()
    //         .then(function(){
    //             if( $dom.data('video-object') && isFullScreen ){
    //                 $dom.data('video-object').play();
    //             }

    //             clearInterval( interval );

    //         });

    //     // remove the clone image
    //     $dom.parent().find('.clone-img').remove();

    //     // $('.brand_big_next,.brand_big_prev').animate({
    //     //     width: isFullScreen ? 0.05 * winWidth : 0.15 * winWidth
    //     // } , 600 );

    // } );

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
        //  .data('video-object');
        // video && video.pause();

        $inner.animate({
            marginLeft: '+=100%'
        } , 500)
        .promise()
        .then(disposeVideo);
        $inner.data('index' , index - 1 );
        $inner.data('cb') && $inner.data('cb')( index - 1 );

        if( index == 1 ){
            $(this).hide();
        }
        $(this).siblings('.banpho-bt-r').show();

        $('.banpho-i').html( index + '/' + len );
    });

    LP.action('home-slider-right' , function(){
        var $inner = $('.slider-block-inner');
        var index =  parseInt( $inner.data('index') );
        var len = $('.slider-item').length;
        if( index == len - 1 ){ return false; }

        // stop current video
        // var video = $('.slider-item').eq( index )
        //  .data('video-object');
        // video && video.pause();

        $inner.animate({
            marginLeft: '-=100%'
        } , 500)
        .promise()
        .then(disposeVideo);

        $inner.data('index' , index + 1 );
        $inner.data('cb') && $inner.data('cb')( index + 1 );

        if( index + 2 == len ){
            $(this).hide();
        }
        $(this).siblings('.banpho-bt-l').show();

        $('.banpho-i').html( ( index + 2 ) + '/' + len );
    });

    LP.action('home-play-movie' , function(){
        var index = $('.slider-block-inner').data('index');
        // get movie
        var $sliderItem = $('.slider-item').eq( index );
        var videoObject = $sliderItem.data('video-object');
        var $btn = $('.slider-block-inner').next();
        if( !videoObject ){
            var movie = $sliderItem.data('movie');
            $sliderItem.find('.video-wrap').remove();
            renderVideo( $sliderItem , movie , $sliderItem.find('img').attr('src') , {
                // ratio: $sliderItem.children('img').height() / $sliderItem.children('img').width(),
                autoplay: true
            } , function(){
                console.log( this );
                this.on('play' , function(){
                    $btn
                        .fadeOut()
                        .find('.banpho-bt-c')
                        .html('<div class="transition">PAUSE<br><br>PAUSE</div>');
                });

                this.on('pause' , function(){
                    $btn
                        .fadeIn()
                        .find('.banpho-bt-c')
                        .html('<div class="transition">PLAY MOVIE<br><br>PLAY MOVIE</div>');
                });
                
                // isCurrentPlaying = true;
                // setTimeout(function(){
                //     isCurrentPlaying = false;
                // } , 2000);
            });
        } else if( videoObject.paused() ){
            videoObject.play();
        } else {
            videoObject.pause();
        }
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
                    $(this)
                        .find('img')
                        .eq(1)
                        .remove()
                        .end()
                        .end()
                        .delay( 300 + ( i + 1 ) * 200 )
                        .animate({
                            marginTop: 0
                        } , 600 , 'easeLightOutBack');

                    // init mouse move effect 
                    initImageMouseMoveEffect( $(this).find('div') );
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
        itemsManager.renderTitle( data.path );

        $('.sec_brands').data('path' , data.path);
        // save path info
        // $('.sec_brands').data('path' , 'categories/' +  data.path );

        // show loading 
        loadingMgr.show('black');
        // load data 
        api.request( data.path , function( r ){

            location.hash = '##!' + data.path;

            // build html
            var tpl = '<li class="brands-con-li" data-path="#[path]" style="margin-left:-600px;">\
                <dl class="cs-clear">\
                    <dt>\
                        <div class="brands-mask"></div>\
                        <p class="brands-con-t">#[label]</p>\
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

            // TODO::  debug
            // r.items = [r.items[r.items.length - 1]];
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
            } );

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
        var letter = $(this).html();
        // scroll to right position
        $('.gates-inner-l').find('li a').each(function( i ){
            if( $.trim($(this).text())[0].toUpperCase() == letter ){
                $('.gates-inner-l').animate({
                    scrollTop: $(this).parent().height() * i 
                } , 1000);
                return false;
            }
        });
        //LP.triggerAction('filter-category' , {category: $('.gates-inner-r a.active').data('category')});
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
        var $dom = $(this);
        //var $dom = $(this);
        var key = $dom.data('key');
        var item = itemsManager.get( key );

        var index = $dom.index();

        $('.brands_tit').animate({
                marginTop: -176,
                marginBottom: 176
            } , 400 );

        var height = $dom.height();
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

    });



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


    LP.action('press_img' , function( data ){
        var $item = $(this).closest('.press_item') ;
        var path = $(this).data('path');
        var press_index = $(this).closest('.press_item').index() + 1;
        loadingMgr.show();
        $('<img/>').load(function(){
            var width = this.width;
            var height = this.height;
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            var tHeight = Math.min( height , winHeight - 40 );

            var tWidth = Math.max( winWidth * 2 / 3 , 450 );
            this.style.width = tWidth + 'px';
            $('.pop_presspho').css({
                height: tHeight,
                width: tWidth
            });
            $('.shade').fadeIn();
            $('.pop_press').show()
                .data('path' , path )
                .css({
                    top: '-150%',
                    opacity: 1,
                    marginLeft: - tWidth / 2,
                    marginTop: - tHeight / 2
                })
                .find('.pop_presspho')
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


            loadingMgr.hide();
        })
        .attr( 'src' , $(this).find('.cover_img').data('cover') );

        $('.pop_index').html( press_index );
        $('.pop_total').html( $(this).closest('.press_list').children().length );
        $('.pop_press .popdownicon').attr('href' , $item.find('.press_itemdown').attr('href') );
    });

    LP.action('press_prev' , function(){
        var $popPress = $('.pop_press');
        // get next cover image
        var path = $popPress.data('path');
        var $pressItem = $('.press_item[data-path="' + path + '"]');
        var $item = $pressItem.prev();
        var imgSrc = $item.find('.cover_img').data('cover');
        if( !imgSrc ) return;

        $popPress.data('path' , $item.data('path') );
        loadingMgr.showLoading( $popPress );
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
                loadingMgr.hideLoading( $popPress );
            })
        }).attr('src' , imgSrc);

        $('.pop_index').html( $item.index() + 1 );
        $('.pop_press .popdownicon').attr('href' , $item.find('.press_itemdown').attr('href') );
    });
    LP.action('press_next' , function(){
        var $popPress = $('.pop_press');
        // get next cover image
        var path = $popPress.data('path');
        var $pressItem = $('.press_item[data-path="' + path + '"]');
        var $item = $pressItem.next();
        var imgSrc = $item.find('.cover_img').data('cover');
        if( !imgSrc ) return;

        $popPress.data('path' , $item.data('path') );
        loadingMgr.showLoading( $popPress );
        $('<img/>').load(function(){
            $('.pop_presspho img').off('load').animate({
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

                loadingMgr.hideLoading( $popPress );
            })
        }).attr('src' , imgSrc);


        $('.pop_index').html( $item.index() + 1 );
        $('.pop_press .popdownicon').attr('href' , $item.find('.press_itemdown').attr('href') );
    });


    LP.action('show-video-interview' , function(){
        var media = $(this).data('media');
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
            renderVideo( $videoWrap , media , $item.find('img').attr('src') , {
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
        var media = $(this).data('media');
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
                            m4a: media, //"http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                            oga: media//"http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
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
        var paths = $('.sec_brands').data('path').split('/');
        var prePath = '';
        api.request(paths[0] , function( r ){
            $.each( r.items , function( i , item ){
                if( paths[1] == item.path ){
                    return false;
                }
                prePath = item.path;
            } );

            LP.triggerAction('show-brands' , {path: paths[0] + '/' + prePath});
        });

        return false;
    });

    LP.action('pagetitarrbottom' , function(){
        var paths = $('.sec_brands').data('path').split('/');
        var nextPath = '';
        api.request(paths[0] , function( r ){
            $.each( r.items , function( i , item ){
                if( paths[1] == item.path ){
                    nextPath = r.items[i + 1].path;
                    return false;
                }
            } );

            LP.triggerAction('show-brands' , {path: paths[0] + '/' + nextPath});
        });
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
    LP.action('jobs-more' , function( data ){
        var $item = $(this).closest('.jobsitem');
        job_index = $item.index() + 1;
        $('.shade').fadeIn();
        $('.pop_jobs').show()
            .find('.pop_jobcon')
            .html('')
            .append( $item.find('.pop_jobcon_inner').clone().show() )

            .end()
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

        $('.pop_jobs .jobs_more').attr('href' , 'mailto:' + data.contact );
        $('.pop_jobs .pop_index').html( job_index );
        $('.pop_jobs .pop_total').html( $item.parent().children().length );
        $('.pop_job_menus').css('right' , 95 );
    });



    LP.action('pop-jobs-prev' , function(){
        if( job_index == 1 ){
            return false;
        }
        job_index--;

        var $item = $('.jobsitem').eq( job_index - 1 );

        var $newInner = $item.find('.pop_jobcon_inner').clone().show();
        var $inner = $('.pop_jobs .pop_jobcon_inner');
        var innerWidth = $('.pop_jobcon').width();
        $('.pop_jobcon').prepend( $newInner )
            .children()
            .css({
                width: innerWidth,
                'float': 'left'
            })
            .eq(0)
            .css('marginLeft' , -innerWidth);

        $inner.css('marginRight' , -innerWidth );

        $newInner.animate({
            marginLeft: 0
        } , 500 )
        .promise()
        .then(function(){
            $inner.remove();
        });


        var contact = LP.query2json($item.find('.jobs_more').attr('data-d'))['contact'];
        $('.pop_jobs .jobs_more').attr('href' , 'mailto:' + contact );
        $('.pop_jobs .pop_index').html( job_index );
    });

    LP.action('pop-jobs-next' , function(){
        if( $('.pop_jobs .pop_total').html() == $('.pop_jobs .pop_index').html() ) return false;
        job_index++;

        var $item = $('.jobsitem').eq( job_index - 1 );

        var $newInner = $item.find('.pop_jobcon_inner').clone().show();
        var $inner = $('.pop_jobs .pop_jobcon_inner');
        var innerWidth = $('.pop_jobcon').width();
        $('.pop_jobcon').append( $newInner )
            .children()
            .css({
                width: innerWidth,
                'float': 'left'
            })
            .eq(1)
            .css('marginRight' , -innerWidth);

        $inner.animate({
            marginLeft: -innerWidth
        } , 500 )
        .promise()
        .then(function(){
            $inner.remove();
            $newInner.css('marginRight' , 0);
        });

        var contact = LP.query2json($item.find('.jobs_more').attr('data-d'))['contact'];
        $('.pop_jobs .jobs_more').attr('href' , 'mailto:' + contact );
        $('.pop_jobs .pop_index').html( job_index );
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

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30 );

        $current.find('.brands-mask').fadeIn( time )
            .end()
            .find('.image-zoom')
            .fadeOut();

        // do width brands-mask
        $dom.find('.brands-mask').fadeOut( time );


        var preWidth = $dom.width() / 2;
        $dom.prevAll().each(function(){
            preWidth += $(this).width();
        });

        // $dom.animate({
        //     width: isFullScreen ? winWidth * 0.9 : winWidth * 0.7
        // } , time )
        $dom
        .parent()
        .animate({
            marginLeft: winWidth / 2 - preWidth // - ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            //clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                var key = $dom.data('key');
                var item = itemsManager.get( key );
                renderVideo( $dom , itemsManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
                    autoplay: false,
                    pause_button: true
                } );
            } else if( $dom.data('image') ){
                initImageMouseMoveEffect( $dom );
            }

            // if( index - 1 == 0 ){
            //     $('.brand_big_prev').fadeOut();
            // }
            // $('.brand_big_next').fadeIn();
        });

        $('.brand_movie').data('index' , index - 1 );
        location.hash = location.hash.replace(/\d+$/ , index - 1);

        // var itemDom = $('.brand_movie').find('.brands-item').eq( index - 1 ).get(0);
        // itemDom && itemDom.click();
    });

    LP.action('brand_big_next' , function(data){
        var index = $('.brand_movie').data('index');

        var isFullScreen = $('.brand_movie').data('isFullScreen');

        var $items = $('.brand_movie').find('.brands-item');
        var $current = $items.eq( index );
        var $dom = $items.eq( data.index || index + 1 );
        if( !$dom.length ) return;

        var winWidth = $(window).width();
        var time = 600;

        // clear current effect
        if( $current.data('video-object') ){
            $current.data('video-object').muted();
        }
        unInitImageMouseMoveEffect( $current );

        $current.find('.brands-mask').fadeIn( time )
            .end()
            .find('.image-zoom')
            .fadeOut();

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30);

        // do width brands-mask
        $dom.find('.brands-mask').fadeOut( time );


        var preWidth = $dom.width() / 2;
        $dom.prevAll().each(function(){
            preWidth += $(this).width();
        });

        $dom
        // .animate({
        //     width: isFullScreen ? winWidth * 0.9 : winWidth * 0.7
        // } , time )

        .parent()
        .animate({
            marginLeft: winWidth / 2 - preWidth //- ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            //clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                var key = $dom.data('key');
                var item = itemsManager.get( key );
                renderVideo( $dom , itemsManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
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
        location.hash = location.hash.replace(/\d+$/ , index + 1);

        // var itemDom = $('.brand_movie').find('.brands-item').eq( index + 1 ).get(0);
        // itemDom && itemDom.click();
    });
    

    LP.action('showreel' , function( e ){
        renderVideo($('.banpho-img') , '../videos/0.mp4' , '' , {
            autoplay: true,
            pause_button: true
        } );

        return false;
    });

    LP.action('image-zoom' , function(){
        //var $imgs = $(this).siblings('img');
        var $brandsItem = $(this).closest('.brands-item');
        var key = $brandsItem.data('key');

        var item = itemsManager.get( key );

        location.hash = '##!' + item.brand_path + '/' + $brandsItem.index() + '/big' ;

        imageZoom( item );

        return false;
    });

    LP.action('lang' , function( data ){
        LP.setCookie('lang' , data.lang );
        LP.reload();
        return false;
    });
    

    LP.action('people_opt' , function(){
        var $opt = $(this).find('.people_opt');
        var isSlideDown = !$opt.hasClass('expand');
        if( isSlideDown ){
            $opt.siblings('.people_download').slideDown();
            $opt.siblings('.people_desc').slideDown();

            // go to the top
            $('html,body').animate({
                scrollTop: $(this).offset().top - $('.header').height()
            } , 500);

        } else {
            $opt.siblings('.people_download').slideUp();
            $opt.siblings('.people_desc').slideUp();
        }

        $opt.toggleClass('expand');
    });


    LP.action('jobs-lang' , function(){
        var lang = $(this).data('lang');

        $('.pop_jobcon_inner .jobcontent').hide()
            .filter('.content_' + lang )
            .show();
        return false;
    });


    LP.action('pageback' , function(){
        var e = jQuery.Event("keydown");
        e.which = 27; // # Some key code value
        $(document).trigger(e);

        return false;
    });

});
