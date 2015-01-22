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

    var array_column = function( arr, val, key ){
        if( val ){
            var vals = [];
            $.each( arr , function(i , item){
                vals.push( item[val] );
            } );
        } else {
            var vals = {};
            $.each( arr , function(i , item){
                vals[ item[key] ] = item;
            } );
        }

        return vals;
    }
    var array_filter = function( arr, fn ){
        var newArr = [];
        $.each( arr, function( index , item ){
            if( fn( item, index ) ){
                newArr.push( item );
            }
        } );

        return newArr;
    }

    var array_unique = function( arr ){
        var newArr = [];
        $.each( arr, function(i , item){
            if( $.inArray( item, newArr ) < 0 ){
                newArr.push( item );
            }
        } );

        return newArr;
    }


    var process = function( $proBar, $proMsg ){
        var prog = 0,
            step = 0,
            stepAdd = 12,
            _timer = function(){
                if (prog >= 99) return false;
                stepAdd--;
                if (stepAdd < 2)stepAdd = 2;
                prog += stepAdd; 
                step ++;
                $proMsg && $proMsg.html(prog+"%");
                $proBar.stop().animate({width : 100 - prog + '%'}, step*30, null, _timer);
            };
        return {
            stop: function(){
                $proBar.stop(true);
                return this;
            },
            end: function(){
                $proMsg && $proMsg.html('100%');
                prog = 0;
                $proBar.stop().animate({
                    width: 0
                }, 500)
                // .promise()
                // .then( $proBar.width('100%') );
                return this;
            },
            start: function(){
                prog = 0;
                $proBar.width('100%');
                _timer();
                return this;
            },
            reset: function(){
                prog = 0;
                step = 0;
                stepAdd = 12;
                $proMsg && $proMsg.html('0%');
                $proBar.stop(true).css('width' , '0%');
                return this;
            }
        }
    }

    var videoProgress = function( $percent ){
        $('.loading-wrap').show()
            .find('.loading')
            .stop(true,true)
            .animate( {width: 100 - $percent + '%'} , 300 );
            // .css('width', 100 - $percent + '%');
    }

    var videoProgressHide = function(){
        $('.loading-wrap').fadeOut()
            .find('.loading')
            .css('width', '100%');
    }


    var fixHomePageVideo = function( success ){
        var winTop = $(window).scrollTop();
        var sliderHeight = $('.home-slider').height();

        disposeVideo();
        if( $('.page').data('page') == 'home-page' && winTop < sliderHeight ){
            // scroll to $('.home-slider').height()
            $('html,body').animate({
                scrollTop: sliderHeight
            } , 500 )
            .promise()
            .then(function(){
                success && success();
            });
        } else {
            success && success();
        }
    }


    var formatPath2Arr = function( path ){
        path = path || location.hash;
        path = path.replace(/.*##!/,'');

        path = path.replace('pages_contents/','');
        var paths = path.split('/');
        return paths;
    }


    var urlManager = (function(){

        var getPath = function( href ){
            return ( href || location.hash ).replace(/.*##!/, '');
        }
        var setPath = function( url ){
            location.hash = '##!' + url;
        }

        var getItemPathinfoFromUrl = function(){
            var path = getPath();
            // 如果是brands 和 services
            var paths = path.split('/');
            if( paths[0] == 'brands' || paths[0] == 'services' ){
                path = 'pages_contents/' + paths[2].split('|||').join('/') + '/' + paths[3];
            } else {
                path = 'pages_contents/' + paths.slice(0,4).join('/');
            }
            return path;
        }

        
        //  ===> categories
        // categories ===> 
        var rules = [];
        rules.push( {
            url: /^(categories|brands|services)$/,
            destory: function( cb ){
                $('.gates-inner')
                    .animate({
                        top: '-100%'
                    } , 1000 , 'easeInBack' )
                    .promise()
                    .then(function(){
                        $('.sec_gates').fadeOut();
                        $(document.body).css('overflow' , 'auto');
                        cb && cb();
                    });
            },
            load: function(  ){
                var path = getPath();
                fixHomePageVideo( function(){
                    $(document.body).css('overflow' , 'hidden');
                    show_cate_list( path );
                } );
            }
        } );

        rules.push( {
            url: /^((categories|brands|services)\/[^\/]+)$/,
            destory: function( cb ){

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
                                    $('.brands_tit,.brands-con').hide();
                                    $(document.body).css('overflow' , 'auto');
                                    cb && cb();
                                }
                            });
                    }
                });

                if( !$lis.length ){
                    $(document.body).css('overflow' , 'auto');
                    cb && cb();
                }
            },
            load: function(  ){
                $(document.body).css('overflow' , 'hidden');
                $('.sec_brands').show();
                var path = getPath();
                // change tit
                campaignManager.renderTitle( path );

                // show loading 
                loadingMgr.show('black');
                var renderComapigns = function( compaigns ){
                    var tpl = '<li class="brands-con-li" data-path="#[path]" data-id="#[id]" style="margin-left:-600px;">\
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

                    var paths = [];
                    $.each( compaigns || [] , function( index , item ){
                        aHtml.push( LP.format( tpl , {
                            agency: item.agency,
                            label : item.label,
                            year: item.created.replace(/(\d+)-.*/ , '$1'),
                            id: item.id,
                            cpgn_type: item.cpgn_type,
                            path: item._contentPath.replace('pages_contents/','') + '/' + item.path
                        } ) );
                    } );

                    $('.brands-con').html( aHtml.join('') );
                    showCompains();
                }

                loadingMgr.setSuccess(renderComapigns , 'renderComapigns');


                // load data 
                campaignManager.getCampaigns( path , function( campaigns ){
                    loadingMgr.success( 'renderComapigns', campaigns );
                } );
            }
        } );
        
        rules.push( {
            url: /^((categories|brands|services)\/[^\/]+\/[^\/]+\/\d+)$/,
            destory: function( cb ){
                $(document).unbind('keydown.level3');
                // to brands list
                $('.brand_item_tit').animate({
                    marginTop: -88,
                    marginBottom: 88
                } , 400);

                $('.brand_movie').fadeOut( 400 )
                    .promise()
                    .then(function(){
                        $('.brand_item_tit').hide();
                        $(document.body).css('overflow' , 'auto');
                        cb && cb();
                    });
            },
            load: function(  ){
                $(document.body).css('overflow' , 'hidden');
                var path = getItemPathinfoFromUrl();
                var paths = path.split('/');

                showBigBrandsItem( paths.slice(0,4).join('/') , paths.pop() );

                $(document).bind('keydown.level3', function( ev ){
                    switch( ev.which ){
                        case 37: // prev
                            LP.triggerAction('brand_big_prev') ;
                            break;
                        case 39: // next
                            LP.triggerAction('brand_big_next') ;
                            break;
                    }
                });
            }
        } );
        
        rules.push( {
            url: /^(categories|brands|services).*(\/\d+\/big)$/,
            destory: function( cb ){
                $(window).unbind('resize.fixedimg');
                $(document).unbind('keydown.level4');
                $('.preview').fadeOut()
                    .promise()
                    .then(function(){
                        $(document.body).css('overflow' , 'auto');
                        cb && cb();
                    });
            },
            load: function( data ){
                $(document.body).css('overflow' , 'hidden');
                var path = getItemPathinfoFromUrl();
                // 如果是brands 和 services
                var paths = path.split('/');

                showBigItem( paths.slice(0,4).join('/') , paths.slice(4,5)[0] );

                var timer = null;
                $(window).bind('resize.fixedimg', function(){
                    clearTimeout( timer );
                    timer = setTimeout(function(){
                        $('.preview li').each(function(){
                            fixImageToWrap( $(this), $(this).find('img') );
                        });
                     }, 200);
                });
                $(document).bind('keydown.level4', function( ev ){
                    switch( ev.which ){
                        case 37: // prev
                            LP.triggerAction('move-prev');
                            break;
                        case 39: // next
                            LP.triggerAction('move-next');
                            break;
                    }
                });
            }
        } );

        
        // press page
        rules.push( {
            url: /^jobs\/\d+$/,
            destory: function( cb ){

            },
            load: function( data ){
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
            }
        } );
        
        

        return {
            setFormatHash: function( toUrl , fromUrl, data ){
                var fromHash = getPath( fromUrl );
                var currPaths = fromHash.split('/');
                var paths = toUrl.split('/');
                if( paths[0] == 'pages_contents' && paths.length == 5 ){
                    paths.shift();
                    if ( currPaths[0] == 'brands' || currPaths[0] == 'services' ){
                        var index = paths.pop();
                        toUrl = currPaths[0] + '/' + currPaths[1] + '/' + paths.join('|||') + '/' + index;
                    } else {
                        toUrl = paths.join('/');
                    }
                }
                setPath( toUrl );
            },
            go: function( toUrl , data , fromUrl ){
                disposeVideo();
                //pages_contents/categories/alcoholic_drinks/16eme_ciel_stand-up_-_lyon_-_2013/0

                var hash = getPath( fromUrl );
                // if( hash == toUrl ){
                //     return false;
                // }
                var currPaths = hash.split('/');
                var paths = toUrl.split('/');
                if( paths[0] == 'pages_contents' && paths.length == 5 ){
                    paths.shift();
                    if ( currPaths[0] == 'brands' || currPaths[0] == 'services' ){
                        var index = paths.pop();
                        toUrl = currPaths[0] + '/' + currPaths[1] + '/' + paths.join('|||') + '/' + index;
                    } else {
                        toUrl = paths.join('/');
                    }
                }

                var loadFn = null , destory = null;
                $.each( rules, function( i, rule ){
                    if( rule.url.test( toUrl ) ){
                        loadFn = rule.load;
                        return false;
                    }
                } );

                $.each( rules, function( i, rule ){
                    if( rule.url.test( hash ) ){
                        destory = rule.destory;;
                        return false;
                    }
                } );
                setPath( toUrl );

                fixHomePageVideo( function(){
                    destory ? destory( function(){loadFn && loadFn(data)} ) : loadFn && loadFn( data ) ;
                } );
            },
            back: function(){

                disposeVideo();
                var path = getPath();
                var paths = path.split('/');
                var tarPath = '';
                switch( paths.length ){
                    case 1:
                        tarPath = '';
                        break;
                    case 2:
                        tarPath = paths[0];
                        break;
                    case 4:
                        tarPath = paths[0] + '/' + paths[1];
                        break;
                    case 5:
                        paths.pop();
                        tarPath = paths.join('/');
                        break;
                }
                setPath( tarPath );
            }
        }
        
    })();
    

    function showBigItem( path, index ){

        // show brand
        $('.sec_brands').fadeIn().css('top',0);

        var tpl = '<li class="big-item #[class]" data-video="#[video]"><img src="#[src]" /></li>';
        loadingMgr.show();
        loadingMgr.setSuccess(function(){
            $('.preview').stop().css('opacity',1).hide().fadeIn().find('ul').fadeIn();
            $('.preview li img')
                .load(function(){
                    fixImageToWrap( $(this).parent().data('fixed-img-wrap',1) , $(this) );
                });

            var $li = $('.preview ul').children().eq( index );
            var video = $li.data('video');
            if( video ){
                // render video and play
                renderVideo( $li , video , $li.find('img').attr('src') , {
                    autoplay: true,
                    pause_button: true,
                    showLoadingBar: true
                }, function(){
                    $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                        .append( $li.find('.vjs-control-bar') )
                        .appendTo( $li );
                } );
            }

        }, 'showBigItem');
        campaignManager.getCampaignItems( path, function( items ){
            var aHtml = [];
            var pics = [];

            $.each( items, function( i, item ){
                var isImage = item.media.match(/\.(jpg|png|bmp|jpeg)$/i);

                // 如果是图片  则取media ， 否则取picture
                var pic = campaignManager.getPath( item , isImage ? 'media' : 'picture_1' );
                pics.push( pic );
                aHtml.push( LP.format( tpl, {
                    src: pic,
                    video: isImage ? '':campaignManager.getPath( item , 'media' ),
                    'class': isImage ? '': 'interview-video-wrap'
                } ) );

            } );

            var $ul = $('.preview ul').html( aHtml.join('') ).css('marginLeft' , - index * 90 + 5 + '%').data('index', index);


            $ul.children().css({
                width: 1 / items.length * 100 + '%'
            });

            $ul.css('width', items.length * 90 + '%' ).hide();


            // 只载入前后的3张
            console.log( pics.slice( Math.max( index - 2 , 0 ), index + 2 ) );
            loadImages( pics.slice( Math.max( index - 2 , 0 ), index + 2 ) , null , function(){
                loadingMgr.success('showBigItem');
            } );
        } );
    }



    // show image in the biggest view
    // and make img auto move effect
    function imageZoom( item ){
        var src = campaignManager.getPath( item , 'media' );

        var $wrap = $('<div class="image-zoom-big"><img/></div>').appendTo(document.body)
            .hide()
            .fadeIn();

        loadingMgr.show('black');
        loadingMgr.setSuccess(function(){
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
        }, 'image-zoom' );
        // TODO:: need to fix image width auto and height auto , show real big image
        var $img = $wrap.find('img').css({
            position: 'absolute',
        }).load(function(){
            loadingMgr.success('image-zoom');
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



    // brand item manager , you should get items from this object's function 'getCampaignItems'
    // It would save the ajax cache and add some useful properties to every items
    var campaignManager = (function(){
        var __CACHE_AJAX__ = {};
        var __CACHE_ITEM__ = {};
        var __CACHE_BRAND__ = {};
        var __CACHE_CAMPAIGN__ = {};
        var __CACHE_TITLE__ = {};
        var index = 0;


        var __fixCampaigns = function( campaigns ){
            $.each( campaigns , function( i , campaign ){
                __CACHE_CAMPAIGN__[ campaign._contentPath + '/' + campaign.path ] = campaign;
            } );
            return campaigns;
        }

        var __fixCampaignItems = function( items ){
            // 分path
            var itemGroupIndex = {};

            $.each( items, function( i, item ){
                if( itemGroupIndex[ item._contentPath ] === undefined ){
                    itemGroupIndex[ item._contentPath ] = -1;
                }
                itemGroupIndex[ item._contentPath ]++;

                __CACHE_ITEM__[ item._contentPath + '/' + itemGroupIndex[ item._contentPath ] ] = item;
            } )
            return items;
        }

        var __fixRequestPath = function( path ){
            return path.replace('pages_contents/', '');
        }

        return {
            dump: function(){
                console.log( __CACHE_ITEM__ );
                console.log( __CACHE_AJAX__ );
            },


            renderTitle: function( path ){
                path = __fixRequestPath( path );
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
                            // 如果是brands和services则，只能从id中获取
                            if( item.path == paths[1] || ( ( paths[0] == 'brands' || paths[0] == 'services' ) && item.id == paths[1] ) ){
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

            getBrandById: function( id, success ){
                if( __CACHE_BRAND__[id] ){
                    success && success( __CACHE_BRAND__[id] );
                } else {
                    api.request('brands', function( r ){
                        $.each( r.items || [], function( i , brand ){
                            __CACHE_BRAND__[ brand.id ] = brand;
                        });

                        success && success( __CACHE_BRAND__[id] );
                    });
                }
            },

            // 获取campaign列表
            // brands/1
            getCampaigns: function( path, success ){

                path = __fixRequestPath( path );
                path = path.split('/').slice(0,2).join('/');

                var match = path.match(/^(brands|services)\/([^\/]+)/);
                if( match && match[1] == 'brands' ){
                    api.getBrandCampaigns( match[2], function( r ){
                        var campaigns = __fixCampaigns( r.items || [] );
                        success && success( campaigns );
                    } );
                } else if( match && match[1] == 'services' ){
                    api.getServiceCampaigns( match[2], function( r ){
                        var campaigns = __fixCampaigns( r.items || [] );
                        success && success( campaigns );
                    } );
                } else {
                    api.request( path, function( r ){
                        var campaigns = __fixCampaigns( r.items || [] );
                        success && success( campaigns );
                    } );
                }
            },
            // categories/xxx/yyyy
            getCampaignInfo: function( path , success ){
                // path = __fixRequestPath( path );
                var campaigns = this.getCampaigns( path , function( campaigns ){
                    $.each( campaigns , function( i , campaign){
                        if( path.indexOf(campaign._contentPath + '/' + campaign.path ) >= 0 ){
                            success && success( __CACHE_CAMPAIGN__[ path ] );
                            return false;
                        }
                    } );
                } );
            },

            // 获取每一个campaign的图片列表
            // 可以传数组进来  获取多个campaign的图片列表
            getCampaignItems: function( path, success ){
                if( !$.isArray( path ) ){
                    path = [path];
                }

                $.each( path , function( i , p ){
                    path[i] = __fixRequestPath( p );
                } );

                var key = path.join(',');
                if( __CACHE_AJAX__[ key ] ){
                    success && success( __CACHE_AJAX__[ key ] );
                } else {
                    api.request( path , function( r ){
                        var items = __fixCampaignItems( r.items || [] );

                        __CACHE_AJAX__[ key ] = items;
                        success && success( items );
                    });
                }
            },

            // 获取每一个活动的图片的链接
            getPath: function( item , type , isBack ){
                // treat as key
                if( !$.isPlainObject( item ) ){
                    item = __CACHE_ITEM__[ item ];
                }

                var lang = 'eng';
                var rpath = 'http://backoffice.fredfarid.com/#[lang]/file/#[_contentPath]/#[type]/#[name]';
                return LP.format( rpath , {
                    lang: lang,
                    _contentPath: item._contentPath,
                    type: type,
                    name: item[type],
                } );
            },

            // get item from it's key
            get: function( key ){
                return __CACHE_ITEM__[ key ];
            }
        }
    })();

    window.campaignManager = campaignManager;
    window.api = api;

    function disposeVideo(){
        $(document.body).find('.video-wrap').parent()
            .each(function(){
                var video = $(this).data('video-object');
                try{video && video.dispose();}catch(e){}
                $(this).removeData('video-object').find('.video-wrap').remove();
            });

        $('.vjs-default-skin').remove();

        // hide videoProgress
        loadingMgr.success();
        clearTimeout( window.preloadTimer );
    }


    // function textEffect( $dom ){
    //     var width = $dom.width();
    //     var $wrap = $('<div><div></div></div>').find('div')
    //         .html( $dom.html() )
    //         .css('marginLeft' , -width / 2)
    //         .end()
    //         .appendTo( $dom );
    //     $wrap.css({
    //         position: 'absolute',
    //         top: 0,
    //         left: '50%',
    //         width: 0,
    //         color: '#000',
    //         overflow: 'hidden',
    //         whiteSpace: 'nowrap'
    //     })
    //     .delay( 300 )
    //     .animate({
    //         width: width,
    //         marginLeft: - width / 2
    //     } , 300)
    //     .find('div')
    //     .delay( 300 )
    //     .animate({
    //         marginLeft: 0
    //     } , 300)
    //     .promise()
    //     .then(function(){
    //         //$dom.addClass('active');
    //         //$wrap.remove();
    //     });
    // }

    function initSelect( $select ){
        $select.each(function(){
            var $options = $(this).find('option');
            var index = $options.filter(':selected').index();
            var value = $(this).val();
            $(this).hide();
            var $wrap = $('<div><span class="selitem_tips">' + $options.eq(index).html() + '</span><ul class="select-options"></ul></div>')
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
        var showTimer = null;
        var moving = true;
        $dom.mousemove(function( ev ){
            clearTimeout( timer );
            timer = setTimeout(function(){
                moving = false;
                staticFn( ev );
            } , time || 2000 );

            clearTimeout( showTimer );
            showTimer = setTimeout(function(){
                moveFn( ev );
            }, 200);
            moving = true;
        });
    }

    // function unInitImageMouseMoveEffect( $dom ){
    //     $dom.unbind('.image-effect');
    //     $dom.find('.clone-img').fadeOut( 400 , function(){
    //         $(this).remove();
    //     } );
    // }

    // function initImageMouseMoveEffect( $dom , onZoom ){
    //     // if( $dom.data('image-init') ) return;
    //     $dom.unbind('.image-effect');

    //     var $img = $dom.find('img');
    //     var imgWidth = $img.width();
    //     var imgHeight = $img.height();
    //     var fixWidth = imgWidth * 0.1;
    //     var fixHeight = imgHeight * 0.1;
    //     var $cloneImg =  null ;

    //     var off = null;
    //     var domWidth = null;
    //     var domHeight = null;

    //     var init = false;
    //     var top = 0;
    //     var left = 0;

    //     var initFn = function(){
    //         $img = $dom.find('img');
    //         imgWidth = $img.width();
    //         imgHeight = $img.height();
    //         fixWidth = imgWidth * 0.05;
    //         fixHeight = imgHeight * 0.05;
    //         $cloneImg =  null ;

    //         off = null;
    //         domWidth = null;
    //         domHeight = null;
    //         init = false;

    //     }


    //     var interval;
    //     var runAnimate = function( $img ){
    //         clearInterval( interval ) ;

    //         var duration = 1000;
    //         var start = new Date();
    //         var ltop = parseInt( $img.css('top') ) || 0;
    //         var lleft = parseInt( $img.css('left') ) || 0;
    //         interval = setInterval(function(){
    //             // t: current time, b: begInnIng value, c: change In value, d: duration
    //             //x, t, b, c, d
    //             var dur = ( new Date() - start ) / duration;
    //             var per =  dur > 1 ? 1 : $.easing.easeOutQuart( 0 , dur , 0 , 1 , 1 );

    //             $img.css({
    //                 top: ltop + (top - ltop) * per,
    //                 left: lleft + (left - lleft) * per
    //             });

    //             if( per == 1 ){
    //                 clearInterval( interval )
    //             }
    //         } , 1000 / 60 );
    //     }

    //     // var animate = null;
    //     $dom.on('mouseenter.image-effect' , function(){
    //         onZoom && onZoom();

    //         var $cImgs = $(this).find('.clone-img');

    //         initFn();

    //         off = $dom.offset();
    //         domWidth = $dom.width();
    //         domHeight = $dom.height();

    //         init = false;
    //         $cloneImg = $cImgs.length ? $cImgs : $img.clone().css({
    //             position: 'absolute',
    //             top: 0,
    //             left: 0
    //         })
    //         .addClass('clone-img')
    //         .appendTo( $dom );

    //         $cloneImg.stop().css({
    //             opacity: 1,
    //             display: 'block'
    //         }).animate({
    //             top: - fixHeight,
    //             left: - fixWidth,
    //             width: imgWidth + 2 * fixWidth,
    //             height: imgHeight + 2 * fixHeight
                
    //         } , 500 )
    //         .promise()
    //         .then(function(){
    //             init = true;
    //         });
    //     }).on('mouseleave.image-effect' , function(){
    //         clearInterval( interval );
    //         if( !$cloneImg ) return;

    //         $cloneImg.animate({
    //             top: 0,
    //             left: 0,
    //             width: imgWidth,
    //             height: imgHeight
    //         } , 500 )
    //         .promise()
    //         .then(function(){
    //             $cloneImg && $cloneImg.fadeOut(100 , function(){
    //                 $cloneImg && $cloneImg.hide();
    //             });
    //         });
    //     })
    //     .on('mousemove.image-effect' , function( ev ){
    //         if( !off ) return;
    //         var px = ev.pageX - off.left;
    //         var py = ev.pageY - off.top;
    //         var lx , ly;
    //         lx = ( domWidth / 2 - px );
    //         ly = ( domHeight / 2 - py );
    //         if( init ){
    //             top =  - fixHeight + ly / (domHeight / 2) * fixHeight;
    //             left = - fixWidth + lx / (domWidth / 2) * fixWidth;
    //             runAnimate( $cloneImg );
    //         }
    //     });
    // }


    // show big brand item
    function showBigBrandsItem( path , itemIndex ){
        itemIndex = parseInt( itemIndex );
        // change hash

        loadingMgr.show('black');
        // prev dealing
        $('.sec_brands').scrollTop(0).fadeIn();
        $('.brand_movie').data( 'index' , itemIndex ).css('opacity',1).hide().fadeIn();

        // render title
        campaignManager.renderTitle( path );

        var afterItemsRender = function( item ){

            var winWidth = $(window).width();


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

                $bigItem.parent().children().each(function(){
                    var $dom = $(this);
                    if( $dom.data('image') ){
                        // initImageMouseMoveEffect( $dom );

                        $dom.hover(null , function(){
                            $dom.find('.image-zoom').fadeOut();
                        } )
                        .mousemove(function(){
                            if( $dom.find('.brands-mask,.image-zoom').is(':visible') ) return;
                            if( !$dom.find('.image-zoom').length ){
                                $('<a href="#" data-a="image-zoom" class="image-zoom transition-wrap" data-a="showreel">\
                                        <div class="transition">ZOOM<br><br>ZOOM</div>\
                                    </a>')
                                    .appendTo( $dom );
                            }
                            $dom.find('.image-zoom').fadeIn();
                        });
                    }
                });
            });
            
            
            var totalWidth = 0;
            var preWidth = 0;
            $movieWrap.find('.brands-item').css('width' , 'auto')
                .each(function( i ){
                    var itemWidth = $(this).is(':hidden') ? 0 : $(this).width();
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
                    marginLeft: Math.min( 0 , winWidth / 2 - preWidth )
                });


            // set other width
            $('.brand_movie .brands-item').filter(':hidden')
                .css('width','auto')
                .find('img')
                .load(function(){
                    var $item = $(this).closest('.brands-item')
                        .show();

                    var width = $item.width();
                    console.log( width );
                    var $ul = $movieWrap.find('ul').width('+=' + width);
                    if( $item.data('pos') == 'prev' ){
                        $ul.css('marginLeft', '-=' + width);
                    }

                    $(this).unbind('load');
                });


            // render brand information
            var textTpl = '<p class="brand_big_text_year">#[year]</p>\
                <div class="brand_big_text_item" style="width:80%;"> <p class="brand_big_text_tit">#[title]</p> <p class="brand_big_text_val">#[label]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[id_visible]> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">##[id]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[fid_customer_visible]> <p class="brand_big_text_tit">client</p> <p class="brand_big_text_val">#[brand]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[year_visible]> <p class="brand_big_text_tit">year</p> <p class="brand_big_text_val">#[year]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[agency_visible]> <p class="brand_big_text_tit">agency</p> <p class="brand_big_text_val">#[agency]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[cpgn_type_visible]> <p class="brand_big_text_tit">GENRE</p> <p class="brand_big_text_val">#[cpgn_type]</p> </div>\
                <div class="brand_big_text_item" #[territory_visible]> <p class="brand_big_text_tit">Territory</p> <p class="brand_big_text_val">#[territory]</p> <p class="brand_big_text_val">&nbsp;</p></div>\
                <div class="brand_big_text_item" #[director_visible]> <p class="brand_big_text_tit">DIRECTOR</p> <p class="brand_big_text_val">#[director]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[photographer_visible]> <p class="brand_big_text_tit">PHOTOGRAPHY</p> <p class="brand_big_text_val">#[photographer]</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                <div class="brand_big_text_item" #[results_visible]> <p class="brand_big_text_tit"> RESULT </p> #[results] </div>';

                // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
                // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\

            campaignManager.getCampaignInfo( item._contentPath , function( campaign ){
                campaign['year'] = campaign['date'].split('-')[0];

                for( var key in campaign ){
                    if( !campaign[ key ] ){
                        campaign[ key + '_visible' ] = 'style="display:none;"';
                    }
                }

                campaignManager.getBrandById( campaign.fid_customer, function( brand ){
                    campaign.brand = brand.title;
                    var str = LP.format( textTpl , campaign );
                    $('.brand_big_text').html( str );
                } );
            } );
        }

        loadingMgr.setSuccess( function( aHtml, item ){
            $(aHtml.join(''))
                .insertBefore( $('.brand_movie .brand_big_text') );
            afterItemsRender( item );
        }, 'afterItemsRender' );

        campaignManager.getCampaignItems( path , function( items ){
            var item = items[ itemIndex ];
            var aHtml = ['<ul class="brands-items">'];
            var tpl = '<li class="brands-item #[brands-class]" #[style] data-pos=#[pos] data-a="big-brands-item" data-image="#[image]" data-movie="#[video]" data-path="#[path]">\
                #[video-btn]<div class="brands-mask"></div><img src="#[picture]">\
                </li>';

            var pics = [];
            // 只载入前后的5张
            var preloadNum = 3;
            $.each( items , function( i , tm ){
                var pic = campaignManager.getPath( tm , 'picture_1' );
                pics.push( pic )

                var isImage = tm.media && tm.media.match(/\.(jpg|png|bmp|jpeg)$/i);
                aHtml.push( LP.format( tpl , {
                    path: tm._contentPath + '/' + i,
                    picture: pic,
                    image: isImage ? 1 : '',
                    style: Math.abs( i - itemIndex ) <= preloadNum  ? '': 'style="display:none;"',
                    pos: i < itemIndex ? 'prev' : 'next',
                    'brands-class': isImage ? 'brands-item-image' : 'brands-item-video',
                    'video-btn': isImage ? '' : '<div class="brands-video-btn"></div>' 
                    //video: tm.media.match(/\.(jpg|png|bmp|jpeg)$/i) ? '' : 1 
                } ) );
            } );

            aHtml.push('</ul>');

            loadImages( pics.slice( Math.max( itemIndex - preloadNum , 0 ), itemIndex + preloadNum + 1 ) , null , function(){
                $('.brands-items').remove();
                loadingMgr.success( 'afterItemsRender', aHtml, item );
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
        loadingMgr.setSuccess(function( r ){
            // load categories 
            var aHtml = [];
             // biuld html
            var tpl = '<li> <a data-a="show-compagins" data-d="path=#[path]" data-id="#[id]" data-category="CONSULTING" title="#[title]" href="#">#[title]</a> </li>';
            $.each( r.items || [] , function( i , item ){
                var path = type + '/';
                switch( type ){
                    case 'services':
                    case 'brands':
                        path += item.id;
                        break;
                    case 'categories':
                        path += item.path;
                        break;
                }

                aHtml.push( LP.format( tpl , {
                    title:  item.title,
                    path: path,
                    id: item.id
                } ) );
            } );
            $('#categories-wrap').html( aHtml.join('') );


            $('.sec_gates').find('.gates-inner-r').hide();
            // start animation
            var winHeight = $(window).height();
            $('.sec_gates')
                .stop( true, true )
                .fadeIn()
                .promise()
                .then(function(){
                    $('.gates-inner')
                        .css({
                            top: '-100%',
                            height: 'auto'
                        })
                        .stop( true, true )
                        .animate({
                            top: 0
                        } , 1000 , 'easeOutBack' )
                        .promise()
                        .then(function(){
                            $(this).css('height', '100%');
                        });
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
            
        } , 'show_cate_list');
        // get 'type' catelist
        api.request( type , function( r ){
            loadingMgr.success( 'show_cate_list', r );
        });

    }


    function loadImages( pics , step , cb ){
        if( !pics.length ){
            cb && cb();
        }
        var index = 0;
        $.each( pics ,  function( i , pic ){
            $('<img/>').load(function(){

                step && step( index );
                index++;
                if( index == pics.length ){
                    cb && cb();
                }
            })
            .error(function(){
                step && step( index );
                index++;
                if( index == pics.length ){
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


    function showCompains( ){
        // location.hash = '##!' + $('.sec_brands').data('path');
        // set brands-items width
        $('.brands-con').show();
        // if( !$('.brands-con').children().length ){
        //     LP.triggerAction('show-compagins' , {path: $('.sec_brands').data('path')});
        //     return false;
        // }


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


        var nums = $('.brands-con>li .brands-mask').length;
        var index = 0;
        var loading_pics = {};


        var isLoading = false;
        var currentIndex = 0;

        var paths = [];
        $('.brands-con li').each(function(){
            paths.push( this.getAttribute('data-path') );
        });



        var loadCampaignDetails = function( $lis ){

            $lis = $lis.filter(function( i , li ){
                if( li.getAttribute('deal') || !li.getAttribute('start-loading') ){
                    return false;
                } else {
                    li.setAttribute('deal' , 1);
                    return true;
                }
            });

            if( !$lis.length ) return;

            // 获取每一个li对应的 图片列表
            var tpl = '<li data-a="brands-item" class="brands-item" data-path="#[path]" data-image="#[image]" data-movie="#[video]"><div class="brands-mask"></div><img src="#[picture]"></li>';
            $lis.each( function( i ){
                var path = this.getAttribute('data-path');
                var pics = [];
                var tHtml = [];
                $.each( campaignItemGroups[ 'pages_contents/' + path ] || [] , function( i, item ){
                    var pic = campaignManager.getPath( item , 'picture' );
                    pics.push( pic );
                    // render items
                    tHtml.push( LP.format( tpl , {
                        picture: pic,
                        image: item.media.match(/\.jpg$/) ? 1 : '',
                        video: item.media.match(/\.jpg$/) ? '' : 1,
                        path: item._contentPath + '/' + i
                    } ) );
                } );
                var $li = $(this);
                $li.find('ul').html( tHtml.join('') )
                    .width( pics.length * CAMPAIGN_ACT_WIDTH )
                    .find('.brands-item')
                    .css('width' , 0);


                // 每一个li去载入完图片后，做动画处理
                var $loadingBar = $li.find('.items-loading');
                loadImages( pics, function( i ){
                    $li.attr('loading' , 1);
                    var percent = ( i + 1 ) / pics.length;
                    $loadingBar.stop(true).animate({
                        width: percent * 100 + '%'
                    } , 200);
                } , function(){

                    $loadingBar.stop(true).animate({
                        width: 100 + '%'
                    } , 300, '', function(){
                        $loadingBar.fadeOut();
                    });
                    $li.attr('loading' , 2);
                } );

            } );

            var currentIndex = 0;
            var timer = setInterval(function(){
                $lis.each(function( i , li ){
                    var $li = $(li);
                    if( i == currentIndex && $li.attr('loading') == 2 ){
                        campaignPicLoadSuccess( $li );
                        currentIndex++;
                    }
                    if( currentIndex >= $lis.length ){
                        clearInterval( timer );
                    }
                });
            } , 100);

        }

        // var campaignPicLoading = function( $li , i ){
        //     var $loadingBar = $li.find('.items-loading');
        //     $loadingBar.stop(true).animate({
        //         width: i * 100 + '%'
        //     } , 200 , '' , function(){
        //         if( i == 1 ){
        //             $loadingBar.fadeOut();
        //         }
        //     } );
        // }
        var campaignPicLoadSuccess = function( $li ){
            // show the mask
            $li.find('dt .brands-mask').show();
            $li.find('.brands-item')
                .each(function( i ){
                    // 只处理前10个
                    var i = Math.min( i , 10 );
                    var $this = $(this);
                    $this.delay( i * 150 )
                        .animate({
                            width: CAMPAIGN_ACT_WIDTH
                        } , 100 , '' , function(){
                            // fix images width and height
                            fixImageToWrap( $this , $this.find('img') );
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
                });
        }


        // bindscroll event
        var timeout = null;
        $('.sec_brands').unbind('scroll.loading-con')
            .bind('scroll.loading-con', function(){
                if( !campaignItemGroups.ready ) return;
                var stTop = $(this).scrollTop();
                clearTimeout( timeout );
                timeout = setTimeout(function(){
                    // get viewable li
                    var $lis = $('.brands-con-li');
                    var itemHeight = $lis.height();
                    var winHeight = $(window).height();
                    var start = Math.max( 0 , Math.floor( stTop / itemHeight - 1 ) );
                    var end = Math.floor( ( stTop + winHeight * 2 ) / itemHeight + 1 );
                    loadCampaignDetails( $lis.slice(start , end) );
                }, 40);
            });

        // 需要载入所有的campaigns
        var campaignPaths = [];
        $('.brands-con-li').each(function( i ){
            campaignPaths.push( this.getAttribute('data-path') );

            $(this).delay( 400 * i )
                .animate({
                    marginLeft: 0,
                    opacity: 1
                }, 400 , function(){
                    $('.sec_brands').trigger('scroll.loading-con');
                    $(this).attr('start-loading' , 1);
                });
        });
        var campaignItemGroups = {ready: false};
        campaignManager.getCampaignItems( campaignPaths , function( items ){
            $.each( items, function( i , item ){
                campaignItemGroups[ item._contentPath ] = campaignItemGroups[ item._contentPath ] || [];
                campaignItemGroups[ item._contentPath ].push( item );
            } );

            campaignItemGroups.ready = true;

            $('.sec_brands').trigger('scroll.loading-con');
        } );        
    }
    
    function fixImageToWrap( $wrap , $img ){
        $img.width('auto').height('auto');
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
                            vh = h + 0;
                            vw = vh / ratio;
                        } else {
                            vw = w + 0;
                            vh = vw * ratio;
                        }

                        try{v.dimensions( vw , vh );}catch(e){}

                        $('#' + v.Q).css({
                            "margin-top": ( h - vh ) / 2,
                            "margin-left": ( w - vw ) / 2
                        });
                        return false;
                    }
                    $(window).bind( 'resize.video' + id , resizeFn )
                        .trigger('resize.video' + id);

                    $wrap.bind('resize.video' + id , resizeFn);
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
                $('<div class="vjs-mask"></div>').insertAfter( $wrap.find('.vjs-poster') )
                    .click(function(){
                        if( is_playing ){
                            v.pause();
                        } else {
                            v.play();
                        }
                    });

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

                if( config.showLoadingBar ){
                    var isWaiting = false;
                    var waitingTimeout = null;
                    v.on('waiting', function(){
                        waitingTimeout = setTimeout(function(){
                            isWaiting = true;
                            loadingMgr.show( 'waiting' );
                        }, 1000);
                    });

                    
                    window.preloadTimer = null;
                    var isShowLoading = false;
                    var currentTime = 0;
                    v.on('timeupdate', function(){
                        clearTimeout( preloadTimer );
                        clearTimeout( waitingTimeout );
                        // console.log( 'timeupdate' );
                        if( currentTime != this.currentTime() ){
                            currentTime = this.currentTime();
                            if( isWaiting ){
                                loadingMgr.success();
                                isWaiting = false;
                            }

                            preloadTimer = setTimeout(function(){
                                loadingMgr.show( 'preload' );
                                isShowLoading = true;
                            },2000);

                            if( isShowLoading ){
                                isShowLoading = false;
                                loadingMgr.success();
                            }
                        }
                        
                    });

                    v.on('pause',function(){
                        clearTimeout( preloadTimer );
                        clearTimeout( waitingTimeout );
                    });
                }

                


                $wrap.data('video-object' , v);

                cb && cb.call(v,v);
            } );
        });
    }


    var loadingMgr = (function(){
        var $loading = $('.loading-wrap');

        var mutiSuccess = {};
        var success = null;
        var pro = null;
        var timer = null;
        return {
            showLoading: function( $wrap ){

                var $loading = $('<div class="loading-wrap" style="position: absolute;"><div class="loading" style="position:absolute;"></div></div>').appendTo( $wrap )
                    .fadeIn();
                pro && pro.end();
                pro = process( $loading.find('div') );


                // var $loading = $wrap.find('.loading');
                // clearInterval( $wrap.data('interval') );
                // var index = 0;
                // $wrap.data('interval' , setInterval(function(){
                //     $loading.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
                // } , 1000 / 6 ) );
            },
            hideLoading: function( $wrap ){
                pro.end();
                $wrap.find('.loading-wrap').fadeOut();
            },
            show: function( bgcolor ){

                console.log('show:' + bgcolor);
                $loading.find('div').width('100%');
                pro && pro.end();
                clearTimeout( timer );
                pro = process( $loading.stop(true,true).fadeIn().find('div') );
                pro.start();
                // var index = 0;
                // var processStep = 5;
                // var processWidth = 0;
                // var processTarget = 0;
                // bgcolor = colors[bgcolor] || bgcolor || 'white';
                // var $inner = $loading.fadeIn().find('.loading');
                // $loading.css({
                //     'background-color':  bgcolor
                // });
                // clearInterval( interval );

                // var $process = $('.process').show();
                // interval = setInterval(function(){
                //     $inner.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
                //     // processStep -= 1 / 60;
                //     // processTarget += Math.max( processStep , 0 );

                //     // processWidth = Math.min( processWidth + 0.5 , processTarget );
                //     // $process.css('width' , processWidth + '%');

                // } , 1000 / 6 );
            },
            setSuccess: function( fn, key ){
                console.log( 'setSuccess' );
                mutiSuccess[key] = fn;
                success = fn;
            },
            isLoading: function(){
                return !!$('.process:visible').length;
            },
            success: function( ){
                var args = Array.prototype.slice.call( arguments );
                var key = args.shift();
                console.log( 'success' );
                mutiSuccess[key] && mutiSuccess[key].apply('', args);
                loadingMgr.hide();
                success = null;
            },
            abort: function(){
                mutiSuccess = {};
                loadingMgr.hide();
                success = null;
            },
            hide: function(){
                pro.end();
                clearTimeout( timer );
                timer = setTimeout(function(){
                    $loading.fadeOut();
                }, 800 );
                
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
            urlManager.back();
            // hideCategory();
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
                // .find('.brands_tit')
                // .css('margin-bottom' , st);
                .find('.sec_brands_tit')
                .css({
                    'margin-top': st,
                    position: 'relative',
                    width: 'auto'
                })
                .next()
                .css('margin-top' , 0 );

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
            }
        //} , 100 );
    });

    $('.brands-con').delegate('.brands-con-li' , 'mouseenter' , function( ev ){

        // var $dom = $(ev.target).closest('li');
        // var index = $dom.index();
        // var all = $dom.parent().children().length;
        // var times = Math.max( all - index  , index + 1 );

        $(this).find('.brands-mask').stop( true , true ).animate({
            opacity: 0
        } , 600 );

    })
    .delegate('.brands-con-li' , 'mouseleave' , function(){
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
    //         var item = campaignManager.get( key );
    //         renderVideo( $dom , campaignManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
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

    // init scroll event
    $('.gates-inner-l').scroll(function(){ 
        var st = $(this).scrollTop();
        var cHeight = 0;
        var $li = null;
        $(this).find('li').each(function(){
            cHeight+= $(this).height();
            if( cHeight > st ){
                $li = $(this);
                return false;
            }
        });

        var letter = $.trim( $li.text() )[0];
        $('.gates-inner-c li').each(function(){
            
            if( letter.toUpperCase() == $.trim( $(this).text().toUpperCase()) ){
                $('.gates-inner-c a').removeClass('active');
                $(this).find('a').addClass('active');
                return false;
            }
        });
    });


    var banphoConTimer ;
    var isInBanphoCon = false;
    // is playing just now
    // var isCurrentPlaying = false;
    var isHeadHide = false;

    var pageManager = (function(){
        var initSlider = function( cb , hideHeadBar ){
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
                if( !video || video.paused() ){
                    $banphoCon.stop(true,true).fadeIn();
                    return;
                }

                $banphoCon.stop(true,true).fadeOut();

            } , function( ev ){
                $banphoCon.stop(true,true).fadeIn();
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
                    var mtop = Math.max( 0, Math.min( stTop , ( winHeight - headerHeight ) / 2 ) );
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
                    var all = $homeBioBg.height() -  $homeBio.height();
                    var bgTop = stTop + winHeight - $homeBio.offset().top; // - headerHeight - stTop;
                    var per = bgTop / ( winHeight - headerHeight + $homeBio.height() );
                    
                    var trans = 'translate(0px,' + ( - per * all ) + 'px)';
                    $homeBioBg.css({
                        'transform': trans,
                        'mozTransform': trans,
                        'msTransform': trans,
                        'webkitTransform': trans
                    });

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
                                $('.home_bioleft').html( item.text_1 );
                                $('.home_bioright').html( item.text_2 );
                                break;
                            case '3':
                                // TODO render 
                        }
                    } );
                });

                // render home numbers
                api.extraRequest( {wsExtraRequest: 'getNumbers'}, function( r ){
                    var obj = {};
                    $.each( r.items || [], function( i, item ){
                        obj[ item.id ] = item.number;
                    } );

                    var tpl = '<td><strong class="intoview-effect" data-effect="number-rock">#[projects]</strong>PROJECTS</td>\
                        <td><strong class="intoview-effect" data-effect="number-rock">#[brands]</strong>BRANDS</td>\
                        <td><strong class="intoview-effect" data-effect="number-rock">#[press_articles]</strong>PRESS ARTICLES</td>\
                        <td><strong class="intoview-effect" data-effect="number-rock">#[services]</strong>SERVICES</td>\
                        <td><strong class="intoview-effect" data-effect="number-rock">#[awards]</strong>AWARDS</td>';
                    $('#home-num-tr').html( LP.format(tpl, obj) );
                } );

                // render home page slider
                api.request('home' , function( r ){
                    var aHtml = [];
                    $.each( r.items || [] , function( i , item ){
                        aHtml.push( LP.format('<div class="slider-item" data-movie="#[video]"><img src="#[image]" /></div>' , {
                            image: campaignManager.getPath( item , 'picture' ),
                            video: campaignManager.getPath( item , 'video' )
                        }));
                    } );

                    $('#slider-block-inner').html( aHtml.join('') );
                    initSlider();

                    cb && cb();
                });

                // render home page featured_campaigns
                // 完成:图片的加载,文字的替换
                // 未完成:图片的依次淡入效果,loadMore按钮的边界判断,点击div.cam_item后的跳转
                // issues: 第一张图片不对,原因是代码中Ajax返回的JSON对象与直接取get返回的JSON内容不一致
                //
                api.request('featured_campaigns' , function( r ){
                    $.each( r.items , function( i , item ){
                        var $container = $('.home_campaign').find('.cam_item').eq(i);
                        $container.find('p').text(item.label);
                        $container.find('img').prop('src',campaignManager.getPath( item , 'preview' ));
                        $container.find('img').load(function(){
                            var ratio = this.height / this.width;
                            var w = $(this).closest('div').width() ;
                            var h = $(this).closest('div').height() ;
                            var vh = 0 ;
                            var vw = 0 ;
                            if( h / w > ratio ){
                                vw = w;
                                vh = (h - (w / ratio)) / 2;
                            } else {
                                vh = h;
                                vw = (w - (h * ratio)) / 2;
                            }
                            $(this).css({'margin-left': (-vw + 'px'),
                            'margin-top': (-vh + 'px')});
                        });
                        $container.off('click');
                        $container.on('click',function() {
                            var url_surfix = item.fid_campaign.split('#')[0];
                            var id = item.fid_campaign.split('#')[1];
                            var current_url =  window.location + '';
                            var tmp_url = current_url.replace(/index.*$/,"##!categories/");
                            var url = tmp_url + url_surfix;
                            console.log('url: ',url)
                            //window.location.replace(url);
                            //urlManager.setFormatHash(url);
                        });
                        fixImageToWrap( $container.find('div') , $container.find('img') );
                    } );
                        cb && cb();
                });

                // init campaigns mouse move effect
                // $('.cam_item div').each(function(){
                //     initImageMouseMoveEffect( $(this) );  
                // });
            },
            'awards-page': function( cb ){

                var datas = [];
                var paths = [];
                var awards = [];

                // get awards number
                api.extraRequest( {wsExtraRequest: 'getNumbers'}, function( r ){
                    var obj = {};
                    $.each( r.items || [], function( i, item ){
                        obj[ item.id ] = item.number;
                    } );
                    $('#awards-number').html( obj.awards );
                } );
                // get awards page
                api.request( 'awards' , function( r ){
                    awards = r.items;
                    paths = array_column( awards, 'path' );
                    $.each(paths, function(i){
                        paths[i] = 'awards/' + paths[i];
                    });
                    
                    api.request( paths, function( r ){
                        var allCampaigns = r.items;
                        
                        // 获取所有的brands
                        api.request( 'brands', function( r ){
                            var allBrands = r.items;

                            renderPage( allBrands, awards, allCampaigns );
                        } );

                    } );


                    function renderPage(allBrands, awards, allCampaigns){
                        // render filters year
                        var years = [];
                        
                        $.each( awards, function( i , award ){
                            var y = award['created'].replace(/^(\d{4}).*/, '$1');
                            if( y )
                                years.push( y );

                            $.each( allCampaigns, function(i, campaign){
                                if( campaign._contentPath == award._contentPath + '/' + award.path ){
                                    award.count = award.count || 0;
                                    award.count++;
                                }
                            } );
                        });
                        years = array_unique( years ).sort();
                        var yearHtml = [];
                        $.each( years, function( i, year ){
                            yearHtml.push( '<option value="' + year + '">' + year + '</option>' );
                        } );

                        $('#year').append( yearHtml.join('') );


                        // render filters brands
                        allBrands = array_column( allBrands, null, 'id' );
                        var fid_customers = [];
                        $.each( allCampaigns, function( i , campaign){
                            fid_customers.push( campaign.fid_author );
                        } );

                        fid_customers = array_unique( fid_customers ).sort();
                        var brandHtml = [];
                        $.each( fid_customers, function( i , fid_customer ){
                            var name = allBrands[ fid_customer ].label;
                            brandHtml.push( '<option value="' + fid_customer + '">' + name + '</option>' );
                        } );

                        $('#brand').append( brandHtml.join('') );

                        // render filter awards
                        var awardHtml = [];
                        $.each( awards, function( i , award ){
                            awardHtml.push( '<option value="' + award.id + '">' + award.label + '</option>' );
                        } );

                        $('#award').append( awardHtml.join('') );


                        $('#awardfilter')
                            .data('campaigns' , allCampaigns )
                            .data('brands', allBrands)
                            .data('awards', awards);

                        LP.triggerAction( 'awardfilter' );


                        // init select
                        initSelect( $('select') );



                        // render awards
                        var awardsHtml = ['<span class="award-num"></span>'];
                        $.each( awards, function( i , award ){
                            awardsHtml.push( '<img data-num="' + ( award.count || 0 ) + '" src="' + campaignManager.getPath( award, 'preview', true) + '">' );
                        } );

                        $('.awardicons').html( awardsHtml.join('') );
                        $('.awardicons img').hover(function(){
                            var num = $(this).data('num');
                            $('.awardicons span').html( num );

                            effects['number-rock']( $('.awardicons span') , 0  , null , 500 );
                        }); 

                        cb && cb();
                    }
                    
                });
            },
            'contact-page': function( cb ){
                var interval = setInterval(function(){
                    if( window.google ){
                        clearInterval( interval );
                        renderGoogleMap( $('#map') , [[31.245583,121.49472600000001],[48.875137,2.338616000000002]] );    
                    }
                }, 1000);
                
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
                    var items = [];
                    $.each( r.items , function( i , item ){
                        if( item.id == 4 || item.id == 5 )
                            return;
                        items.push( item );
                    });
                    $.each( items , function( i , item ){
                        var c = i == 0 ? 'contact_maill' : i == items.length - 1 ? 'contact_mailr' : 'contact_mailc';
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
                LP.use(['video-js', '../plugin/jquery.jplayer.min.js']);
                LP.use(['wavesurfer']);

                var tvTpl = '<div data-effect="fadeup" class="interview_item intoview-effect interview_#[oddoreven] cs-clear">\
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
                var radioTpl = '<div data-effect="fadeup" class="interview_item intoview-effect interview_#[oddoreven] cs-clear">\
                    <div class="interview_info">\
                        <span><strong>#[title]</strong><br/>#[content]</span>\
                    </div>\
                    <div class="interview_img hold-audio-url"  data-a="show-music-interview" data-media="#[media]"><img src="#[preview]"></div>\
                    <span class="interview_opt" data-a="show-music-interview" data-media="#[media]">\
                        <div class="transition">LISTEN<br/>CLOSE</div>\
                    </span>\
                </div>';
                // get audio and video
                api.request(['about/interviews/radio','about/interviews/tv'] , function( r ){
                    var aHtml = [];
                    var date = [];
                    
                    $.each(r.items , function( i , item ){
                        var media = campaignManager.getPath( item , 'media' );
                        var tpl = !media.match(/.mp3$/) ? tvTpl : radioTpl;
                        var titles = item.title.split('|');
                        aHtml.push( LP.format( tpl , {
                            oddoreven: i % 2 ? 'even' : 'odd',
                            text: !media.match(/.mp3$/) ? 'WATCH<br/>CLOSE' : 'LISTEN<br/>CLOSE',
                            title: titles[0] ,
                            content: titles.slice(1).join('<br/>'),
                            preview:  campaignManager.getPath( item , 'picture_2' ),
                            media: media
                        } ) );
                    });

                    $('#press-container').html( aHtml.join('') );

                    loadImages( $('#press-container img') , null , function(){
                        $('#press-container img').each(function(){
                            fixImageToWrap( $(this).parent() , $(this) );
                        });
                    } );
                    cb && cb();
                });
                
            },
            'press-page': function( cb ){

                // var positions = [-44,-142,-240,-338,-436,-534];
                // var index = 0;
                // clearInterval( window.press_interval );
                // window.press_interval = setInterval(function(){
                //     var $wraps = $('.ploading-wrap');
                //     if( !$wraps.length ){
                //         clearInterval( window.press_interval );
                //     }

                //     $wraps.find('.loading').css('background-position' , 'right ' + positions[( index++ % positions.length )] + 'px' );
                // } , 1000 / positions.length);

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

                    $('#download').attr('href' , campaignManager.getPath( r.items[0] , 'file' ) );
                    cb && cb();
                });

                !!(function(){
                    var aHtml = [];
                    var tpl = '<div class="slider-item" data-movie="#[movie]"><img src="#[image]"></div>';

                    var images = [];
                    api.request('about/f_f_personal_showreel' , function( r ){
                        $.each( r.items , function( i , item ){
                            aHtml.push( LP.format( tpl , {
                                image: campaignManager.getPath( item , 'preview' ),
                                movie: campaignManager.getPath( item , 'video' )
                            } ) );

                            images.push( campaignManager.getPath( item , 'preview' ) );
                        } );

                        $('#slider-block-inner').html( aHtml.join('') )
                                // .children()
                                // .eq(0).css('opacity' , 1).fadeIn();


                        initSlider( function( index ){
                            var item = r.items[ index ];
                            $('.showreel-tit').html( LP.format( '<h3>#[brand]</h3><p>#[campaign]</p><p>#[year]</p></div>' , {
                                brand: item.brand,
                                campaign: item.campaign,
                                year: item.date_and_price.split('-')[0]
                            } ) );
                        } );
                        $(window).resize(function(){
                                 $('#slider-block-inner').css('height',($(window).height() -$('.header').height()-$('.pagetit').height() )+ 'px');
                        }).trigger('resize');
                        loadImages( images.slice( 0 , 3 ), null , function(){
                            cb && cb();
                        });
                    });
                })();
                
            },
            'ffshowreel-page': function( cb ){
                var aHtml = [];
                var tpl = '<div class="slider-item" data-movie="#[movie]"><img src="#[image]"></div>';

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
                            image: campaignManager.getPath( item , 'preview' ),
                            movie: campaignManager.getPath( item , 'video')
                        } ) );

                        images.push( campaignManager.getPath( item , 'preview' ) );
                    } );

                    $('#slider-block-inner').html( aHtml.join('') )
                            // .children()
                            // .eq(0).css('opacity' , 1).fadeIn();

                    initSlider( function( index ){
                        var item = r.items[ index ];
                        $('.showreel-tit').html( LP.format( '<h3>#[brand]</h3><p>#[campaign]</p><p>#[year]</p></div>' , {
                            brand: item.brand,
                            campaign: item.campaign,
                            year: item.date_and_price.split('-')[0]
                        } ) );

                    } );
                    $(window).resize(function(){
                        var winWidth = $(window).width();
                        var winHeight = $(window).height();
                        var $sliderInner = $('.slider-block-inner');
                        $('#slider-block-inner').css('height',($(window).height() -$('.header').height() )+ 'px');
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

                                //if( !firstLoaded ){
                                //    firstLoaded = true;
                                //    $sliderInner.find('.slider-item').css('opacity' , 1).hide().fadeIn();
                                //}

                            })
                            .attr('src' , $sliderInner.find('.slider-item>img').eq(0).attr('src'));
                    }).trigger('resize');
                    loadImages( images.slice( 0 , 3 ) , null , function(){
                        cb && cb();
                    });
                });
            },
            'people-page': function( cb ){
                //var tpl = '<div class="people_item cs-clear intoview-effect #[class]" data-effect="fadeup" data-a="people_opt">\
                //        <div class="people_s people_opt"> <span class="transition"></span> </div>\
                //        <div class="people_b people_img"><img src="#[img]"></div>\
                //        <div class="people_s people_addr"> SHANGHAI </div>\
                //        <div class="people_b people_tit"> \
                //            <h3>#[title]</h3>\
                //            <p><strong>PARTNER</strong></p>\
                //            <p><strong>HEAD OF STRATEGY</strong></p>\
                //            <p><strong>FRED & FARID GROUP</strong></p>\
                //        </div>\
                //        <div class="people_s people_download" style="display:none;"> <a class="transition" href="#[file]"></a><span>download</span> </div>\
                //        <div class="people_b people_desc"  style="display:none;"><p> #[content]</p></div>\
                //    </div>';
                var tpl = '<div class="people_item cs-clear intoview-effect #[class]" data-effect="fadeup" data-a="people_opt">\
                        <div class="people_s people_opt"> <span class="transition"></span> </div>\
                        <div class="people_b people_img"><img src="#[img]"></div>\
                        <div class="people_s people_addr">#[city]</div>\
                        <div class="people_b people_tit"> \
                            <h3>#[title]</h3>\
                            <p><strong>PARTNER</strong></p>\
                            <p><strong>HEAD OF STRATEGY</strong></p>\
                        </div>\
                        <div class="people_s people_download" style="display:none;"> <a class="transition" href="#[file]"></a><span>download</span> </div>\
                        <div class="people_b people_desc"  style="display:none;"><p> #[content]</p></div>\
                    </div>';
                api.request('about/key_people', function( r ){
                    var aHtml = [];
                    $.each( r.items || [], function( i, people ){
                        aHtml.push( LP.format( tpl, {
                            img: campaignManager.getPath( people , 'background' , true ),
                            file: campaignManager.getPath( people , 'file' ),
                            content: people.content.replace(/\n/g,'<p/><p>'),
                            'class': !( i % 2 ) ? 'people_odd' : 'people_even',
                            title: people.title,
                            city: people.city
                        } ) )
                    } );
                    $('#people-wrap').html( aHtml.join('') );

                    cb && cb();
                });
            }
        }


        var effects = {
            'fadeup': function( $dom , index , cb ){
                var marginTop = parseInt( $dom.css('marginTop') ) || 0;

                $dom
                    .css('marginTop', marginTop + 100)
                    .delay( 150 * index )
                    .animate({
                        opacity: 1,
                        marginTop: marginTop
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
                console.log(111);
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
                            cover: campaignManager.getPath( item , 'picture_2' ),
                            preview: campaignManager.getPath( item , 'preview' ),
                            index: i + 1,
                            total: r.items.length,
                            attached_file: campaignManager.getPath( item , 'attached_file' )
                        } ) );
                    } );

                    $dom.html( aHtml.join('') );
                });
            }
        }

        var isFirstLoading = true;

        return {
            go: function( url , type ){
                History.pushState({
                    prev: location.href,
                    type: type
                },  undefined , url );

                $('.page-mask').stop().fadeIn();
            },
            init: function( cb ){
                var $page = $('.page');
                var fn = pageInits[ $page.data('page') ];

                // hide page mask
                $('.page-mask').stop().fadeOut()
                    .addClass('lighter');


                if( fn ){
                    fn( function(){
                        $(window).trigger('scroll');
                        if( isFirstLoading ){
                            cb && cb();
                            var path = location.hash.replace('##!', '');
                            path && urlManager.go( path );
                        }
                        isFirstLoading = false;
                    });
                } else {
                    if( isFirstLoading ){
                        cb && cb();
                        var path = location.hash.replace('##!', '');
                        path && urlManager.go( path );
                    }
                    isFirstLoading = false;

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


                    // fix second page tit
                    var off = $('.pagetit').offset();
                    if( off && off.top < stTop - headerHeight ){
                        $('.pagetit').addClass('pagetit-fixed');
                    } else {
                        $('.pagetit').removeClass('pagetit-fixed');
                    }

                    // fix quote event "banner_footer"
                    $('.banner_footer').css('background-position' , '0 ' + ~~(stTop / 3) + 'px' );
                })
                .trigger('scroll');



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
        loadingMgr.show();
        pageManager.init( function(){
            loadingMgr.success();
        } );

        $(document).ajaxError(function(){
            loadingMgr.success();
        });

        History.Adapter.bind(window,'hashchange',function( ev ){
            var oldURL = ev.oldURL;
            var newURL = ev.newURL;
            var oldArr = formatPath2Arr( ev.oldURL );
            var newArr = formatPath2Arr( ev.newURL );
            if( ( !newArr[4] && !oldArr[4] ) && oldArr[3] && oldArr[3].match(/^\d+$/) && newArr[3] && newArr[3].match(/^\d+$/) ){
                return false;
            }

            urlManager.go( newURL.replace( /.*##!/,'' ), null, oldURL.replace( /.*##!/,'' ) );
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
            loadingMgr.setSuccess(function( html ){
                var $dom = $('<div>' + html + '</div>').find('.container');
                html = $dom.html();

                var imgs = [];
                $dom.find('img').each(function(){
                    imgs.push( this.getAttribute('src') );
                });


                // preload all images
                loadImages( imgs, null, function(){
                    $( '.container' ).children(':not(.header)').animate({
                        opacity: 0
                    } , 500);
                    setTimeout(function(){

                        $( '.container' ).html( html )
                            .children('.page')
                            .stop()
                            .fadeIn();
                        //pagetitarrbottom

                        $('html,body').animate({
                            scrollTop: 0
                        } , 300 );

                        pageManager.destroy( );
                        pageManager.init( );
                    }, 500);
                } );
            }, 'statechange');
            switch( type ){
                default: 
                    $.get( location.href , '' , function( r ){
                        loadingMgr.success('statechange', r );
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
                if( loadingMgr.isLoading() ){
                    loadingMgr.abort();
                }

                urlManager.back();

                break;
            case 37:
                if( $('.shade').is(':visible') ){
                    $('.popnext').get(0).click();
                }
                if( $('.page').data('page') == "home-page" ){
                    LP.triggerAction('home-slider-left');
                }
                break;
            case 39:
                if( $('.shade').is(':visible') ){
                    $('.popprev').get(0).click();
                }
                if( $('.page').data('page') == "home-page" ){
                    LP.triggerAction('home-slider-right');
                }
                break;
        }
    });
    
    var CAMPAIGN_ACT_WIDTH = 322;
    var window_resize_timer = null;
    $(window).resize( function(){
        clearTimeout( window_resize_timer );
        window_resize_timer = setTimeout(function(){
            CAMPAIGN_ACT_WIDTH = $(this).width() > 1200 ? 322 : 175;
            $('.brands-con .brands-items').each(function(){
                $(this).css( 'width', $(this).children().length * CAMPAIGN_ACT_WIDTH );
            });

            $('.brands-con .brands-item[data-a="brands-item"]').css('width',CAMPAIGN_ACT_WIDTH ).each(function(){
                fixImageToWrap( $(this) , $(this).find('img') );
            });
        }, 400);
    } );
    

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
        urlManager.setFormatHash( data.type );
        // urlManager.go( data.type );
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
        $(this).siblings('.banpho-bt-c').html('<div class="transition">PLAY MOVIE<br><br>PLAY MOVIE</div>');

        $('.banpho-i').html( index + '/' + len );

        return false;
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
        $(this).siblings('.banpho-bt-c').html('<div class="transition">PLAY MOVIE<br><br>PLAY MOVIE</div>');

        $('.banpho-i').html( ( index + 2 ) + '/' + len );

        return false;
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
                autoplay: true,
                showLoadingBar: true
            } , function(){
                this.on('play' , function(){
                    $btn
                        .fadeOut('fast')
                        .find('.banpho-bt-c')
                        .html('<div class="transition">PAUSE<br><br>PAUSE</div>');
                });

                this.on('pause' , function(){
                    $btn
                        .fadeIn('fast')
                        .find('.banpho-bt-c')
                        .html('<div class="transition">PLAY MOVIE<br><br>PLAY MOVIE</div>');
                });

                // this.on('progress', function(){
                //     videoProgress( this.currentTime() / this.duration() * 100 );
                // });
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
                    // initImageMouseMoveEffect( $(this).find('div') );
                });

            $homeCamcon.animate({
                height: $homeCamcon.height() + $('.cam_item').height()
            } , 600 );

            clearInterval( interval );

            $dom.css('border-color' , 'black');
        } , 700);

        return false;
    });

    LP.action('show-compagins' , function( data ){
        urlManager.setFormatHash( data.path );
        // urlManager.go( data.path );
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

    LP.action('move-next', function(){
        var index = parseInt( $('.preview ul').data('index') );
        if( index >= $('.preview ul').children('.big-item').length - 1 ){
            return false;
        }

        index++;

        $('.preview ul').data('index', index);

        var ml = -index * 90 + 5 + '%';
        

        $('.preview ul').animate({
            marginLeft: ml
        } , 1000, 'easeOutQuart')
        .promise()
        .then(function(){
            disposeVideo();
            var $ul = $(this);
            // if need to render new video
            var $li = $ul.children().eq( index );
            var video = $li.data('video');
            if( video ){
                // render video and play
                renderVideo( $li , video , $li.find('img').attr('src') , {
                    autoplay: true,
                    pause_button: true,
                    showLoadingBar: true
                }, function(){
                    $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                        .append( $li.find('.vjs-control-bar') )
                        .appendTo( $li );
                } );
            }
        });
        
    });

    LP.action('move-prev', function(){
        var index = parseInt( $('.preview ul').data('index') );
        if( index <= 0 ){
            return false;
        }

        index--;
        $('.preview ul').data('index', index);

        var ml = -index * 90 + 5 + '%';

        

        $('.preview ul').animate({
            marginLeft: ml
        } , 1000, 'easeOutQuart')
        .promise()
        .then(function(){
            disposeVideo();
            var $ul = $(this);
            // if need to render new video
            var $li = $ul.children().eq( index );
            var video = $li.data('video');
            if( video ){
                // render video and play
                renderVideo( $li , video , $li.find('img').attr('src') , {
                    autoplay: true,
                    pause_button: true,
                    showLoadingBar: true
                }, function(){
                    $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                        .append( $li.find('.vjs-control-bar') )
                        .appendTo( $li );
                } );
            }
        });
    });


    LP.action('brands-item' , function(){
        urlManager.setFormatHash( $(this).data('path') );
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
        loadingMgr.setSuccess(function( img ){
            var width = img.width;
            var height = img.height;
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            var tHeight = Math.min( height , winHeight - 40 );

            var tWidth = Math.max( winWidth * 2 / 3 , 450 );
            img.style.width = tWidth + 'px';
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
                .html( img )

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
        }, 'press_image');
        $('<img/>').load(function(){
            loadingMgr.success( 'press_image', this );
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
        laodingMgr.setSuccess( function(){
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
                });
        } );
        $('<img/>').load(function(){
            laodingMgr.success();
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
        loadingMgr.setSuccess(function(){
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
        }, 'press_next');
        $('<img/>').load(function(){
            loadingMgr.success('press_next');
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
            </div>').insertAfter( $item );

            $item.data('media-dom' , $container)
                .find('.interview_opt')
                .addClass('opened');


            $videoWrap = $container.find('.interview-video');

            // render video
            renderVideo( $videoWrap , media , $item.find('img').attr('src') , {
                autoplay: false,
                controls: true,
                pause_button: true,
                showLoadingBar: true
            } , function(){
                $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                    .append( $videoWrap.find('.vjs-control-bar') )
                    .appendTo( $videoWrap.parent() );
            });

            // start animate
            $videoWrap.css({marginTop: -480})
                .animate({
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
        if (!$container) {
            //$container = $('<div class="interview-music-wrap">\
            //    <div class="interview-music" style="margin-top: -190px;">\
            //        <div class="interview-audio"></div>\
            //        <a href="javascript:;" class="jp-play" tabindex="1">play</a>\
            //        <a href="javascript:;" class="jp-pause" tabindex="1" style="display: none;">pause</a>\
            //        <div class="jp-current-time"></div>\
            //        <div class="jp-progress">\
            //            <div class="jp-seek-bar"><div class="jp-play-bar"></div></div>\
            //        </div>\
            //        <div class="interview_share">share</div>\
            //    </div>\
            //</div>').insertAfter( $item );
            $container = $('<div class="interview-music-wrap">\
                <div class="interview-music" style="margin-top: -190px;">\
                    <div class="interview-audio"></div>\
                    <div class="wavesurfer-playPause-btn wavesurfer-pause" tabindex="1">play</div>\
                    <div class="interview_share">share</div>\
                </div>\
            </div>').insertAfter($item);

            var randomId = 'audio-' + ($.guid++);
            $container.attr('id', randomId);

            $item.data('media-dom', $container)
                .find('.interview_opt')
                .addClass('opened');
            $musicWrap = $container.find('.interview-audio');

            // render audio
            LP.use(['wavesurfer'], function () {
                var $audio_loading_wrapper = $('<div class="audio-loading-wrapper"><div class="audio-loading-wrapper-progress"></div></div>');
                $audio_loading_wrapper.appendTo($item.find('.interview_img'));
                var h = $musicWrap.height();
                var audio_url = $container.prev('.interview_item').find('.hold-audio-url').data('media') + '';
                var tmp_audio_url = audio_url.replace("backoffice", "www");
                var $playPause_btn = $musicWrap.next('.wavesurfer-playPause-btn');
                var wavesurfer = Object.create(WaveSurfer);
                wavesurfer.init({
                    container: $musicWrap.get(0),
                    waveColor: 'white',
                    progressColor: '#fd0000',
                    cursorColor: '#fd0000',
                    height: h
                });
                //wavesurfer.load('http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a');
                tmp_audio_url && wavesurfer.load(tmp_audio_url);

                wavesurfer.on('loading',function(progress,e) {
                    $item.find('.audio-loading-wrapper-progress').width(progress + '%');
                    if (progress > 99) {
                        $item.find('.audio-loading-wrapper').fadeOut();
                    }
                });
                wavesurfer.on('ready', function () {
                    //console.log('wavesurfer ready')
                    $musicWrap.closest('.interview-music').animate({
                        marginTop: 0
                    }, 300);
                    $playPause_btn.on('click', function (e) {
                        if ($(this).hasClass('wavesurfer-play')) {
                            wavesurfer.pause();
                            $(this).removeClass('wavesurfer-play').addClass('wavesurfer-pause');
                        } else {
                            wavesurfer.play();
                            $(this).addClass('wavesurfer-play').removeClass('wavesurfer-pause');
                        }
                    });
                });


            });
            //LP.use(['../plugin/jquery.jplayer.min.js'] , function(){
            //    $musicWrap.jPlayer({
            //        wmode: "window",
            //        smoothPlayBar: true,
            //        keyEnabled: true,
            //        remainingDuration: true,
            //        toggleDuration: true,
            //
            //        swfPath: '../',
            //        solution: 'html, flash',
            //        supplied: 'm4a, oga',
            //        preload: 'metadata',
            //        volume: 0.8,
            //        muted: false,
            //        cssSelectorAncestor: '#' + randomId,
            //        cssSelector: {
            //            videoPlay: '.jp-video-play',
            //            play: '.jp-play',
            //            pause: '.jp-pause',
            //            stop: '.jp-stop',
            //            seekBar: '.jp-seek-bar',
            //            playBar: '.jp-play-bar',
            //            mute: '.jp-mute',
            //            unmute: '.jp-unmute',
            //            volumeBar: '.jp-volume-bar',
            //            volumeBarValue: '.jp-volume-bar-value',
            //            volumeMax: '.jp-volume-max',
            //            playbackRateBar: '.jp-playback-rate-bar',
            //            playbackRateBarValue: '.jp-playback-rate-bar-value',
            //            currentTime: '.jp-current-time',
            //            duration: '.jp-duration',
            //            title: '.jp-title',
            //            fullScreen: '.jp-full-screen',
            //            restoreScreen: '.jp-restore-screen',
            //            repeat: '.jp-repeat',
            //            repeatOff: '.jp-repeat-off',
            //            gui: '.jp-gui',
            //            noSolution: '.jp-no-solution'
            //        },
            //        errorAlerts: false,
            //        warningAlerts: false,
            //        ready: function () {
            //            $(this).jPlayer("setMedia", {
            //                m4a: media, //"http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
            //                oga: media//"http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
            //            });
            //
            //            $container.find('.interview-music')
            //                .animate({
            //                    marginTop: 0
            //                } , 300 );
            //        }
            //    });
            //});
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

            LP.triggerAction('show-compagins' , {path: paths[0] + '/' + prePath});
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

            LP.triggerAction('show-compagins' , {path: paths[0] + '/' + nextPath});
        });
        return false;
    });

    LP.action('awardfilter' , function( ){
        var awards = $('#awardfilter').data('awards');
        var campaigns = $('#awardfilter').data('campaigns');
        var brands = $('#awardfilter').data('brands');

        var year = $('#year').val();
        var brand_id = $('#brand').val();
        var award_id = $('#award').val();

        if( year ){
            awards = array_filter( awards, function( award ){
                return award.created.indexOf( year ) == 0;
            } );
        }
        if( award_id ){
            awards = array_filter( awards, function( award ){
                return award.id == award_id;
            } );
        }

        var _comtentPaths = [];
        $.each(awards , function( i , award){
            _comtentPaths.push('pages_contents/awards/' + award.path );
        });

        // filter campaign
        campaigns = array_filter(campaigns, function(campaign){
            return $.inArray( campaign._contentPath, _comtentPaths ) >= 0;
        });

        var tpl = '<tr class="#[class]"><td>#[year] #[award]</td><td>#[brand]</td><td>#[campaign]</td></tr>';

        var listHtml = [];
        var awardsObj = {};
        $.each( awards, function( i , award ){
            awardsObj[ award._contentPath + '/' + award.path ] = award;
        } );
        $.each( campaigns, function( i, campaign ){
            if( brand_id && campaign['fid_author'] != brand_id ){
                return;
            }
            var award = awardsObj[ campaign._contentPath ];
            listHtml.push( LP.format( tpl, {
                'class': i % 2 ? '' : 'even',
                year: award['created'].replace(/^(\d{4}).*/, '$1'),
                award: award.label,
                brand: brands[ campaign.fid_author ].label,
                campaign: campaign.label
            } ) );
        } );

        $('#list-table').html( listHtml.join('') || '<tr> empty </tr>' );
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
        } else if( $dom.hasClass('brands-item-video') ){
            // show big video
            LP.triggerAction( 'show_fullscreen_video' , {dom: this} );
        } else {
            LP.triggerAction( 'image-zoom' , {dom: $dom.find('.image-zoom')} );
        }
        return false;
    });

    LP.action('show_fullscreen_video', function( data ){
        // 获取这个元素的信息
        urlManager.setFormatHash( location.hash.replace('##!','') + '/big' );

        // var item = campaignManager.get( $(data.dom).data('path') );

        // // 创建一个dom，显示在全屏
        // var $wrap = $('<div class="full_screen_video_wrap"></div>').appendTo(document.body);
        // renderVideo( $wrap , campaignManager.getPath( item , 'media' ) , campaignManager.getPath( item , 'picture' ) , {
        //     autoplay: true,
        //     pause_button: true
        // } );
    });

    LP.action('close_fullscreen_video', function(){
        $('.full_screen_video_wrap').remove();
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
        // unInitImageMouseMoveEffect( $current );

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30 );

        $current.find('.brands-mask').stop(true,true)
            .fadeIn( time )
            .end()
            .find('.image-zoom')
            .fadeOut();

        // do width brands-mask
        $dom.find('.brands-mask').stop(true,true).fadeOut( time );

        var totalWidth = $dom.parent().width();
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
            marginLeft: Math.max( Math.min( 0 , winWidth / 2 - preWidth ), winWidth - totalWidth ) // - ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            //clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                // var key = $dom.data('key');
                // var item = campaignManager.get( key );
                // renderVideo( $dom , campaignManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
                //     autoplay: false,
                //     pause_button: true
                // } );
            } else if( $dom.data('image') ){
                // initImageMouseMoveEffect( $dom );
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
        // unInitImageMouseMoveEffect( $current );

        $current.find('.brands-mask').fadeIn( time )
            .end()
            .find('.image-zoom')
            .fadeOut();

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30);

        // do width brands-mask
        $dom.find('.brands-mask').fadeOut( time );


        var totalWidth = $dom.parent().width();
        var preWidth = $dom.width() / 2;
        $dom.prevAll().each(function(){
            preWidth += $(this).width();
        });

        $dom
        .parent()
        .animate({
            marginLeft: Math.max( Math.min( 0 , winWidth / 2 - preWidth ), winWidth - totalWidth ) //- ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
        } , time)
        .promise()
        .then(function(){
            //clearInterval( interval );
            disposeVideo();

            if( $dom.data('movie') ){
                // var key = $dom.data('key');
                // var item = campaignManager.get( key );
                // renderVideo( $dom , campaignManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
                //     autoplay: false,
                //     pause_button: true
                // } );
            } else if( $dom.data('image') ){
                // initImageMouseMoveEffect( $dom );
            }
        });

        $('.brand_movie').data('index' , index + 1 );
        location.hash = location.hash.replace(/\d+$/ , index + 1);
    });
    

    // LP.action('showreel' , function( e ){
    //     renderVideo($('.banpho-img') , '../videos/0.mp4' , '' , {
    //         autoplay: true,
    //         pause_button: true,
    //         showLoadingBar: true
    //     } );

    //     return false;
    // });

    LP.action('image-zoom' , function( data ){
        var hash = location.hash;
        urlManager.setFormatHash( hash.replace('##!','') + '/big' );
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
        urlManager.back();
        return false;
    });

});
