/*
 * page base action
 */
LP.use(['/js/plugin/jquery.easing.1.3.js', '../api'], function (easing, api) {
//LP.use(['/js/plugin/jquery.easing.1.3.js', '../api','logo'], function (easing, api) {

    var lang = LP.getCookie('lang');
    var needAjax = $('html').hasClass('history');
    // page components here
    // ============================================================================
    $.easing.easeLightOutBack = function (x, t, b, c, d, s) {
        if (s == undefined) s = 0.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }

    Object.getOwnPropertyNames = Object.getOwnPropertyNames || function(departments){
        return {
            forEach: function( fn ){
                for( var key in departments ){
                    fn && fn( key, departments[key] );
                }
            }
        }
    }

    window.console = window.console || {log:function(){}};
    // window.banft_txt_length = 0;


    var initSoundWave = function( file, $canves , cb ){
        // file = 'http://f.cn/audios/1.mp3'
        LP.use('waveform', function(){

          var
            AUDIO_FILE = file,
            waveform = $canves[0],
            ctx = waveform.getContext( '2d' ),
            dancer, kick;

          /*
           * Dancer.js magic
           */
          Dancer.setOptions({
            flashSWF : '/js/dancer/lib/soundmanager2.swf',
            flashJS  : '/js/dancer/lib/soundmanager2.js'
          });

          dancer = new Dancer();
          // kick = dancer.createKick({
          //   onKick: function () {
          //     ctx.strokeStyle = '#ff0077';
          //   },
          //   offKick: function () {
          //     ctx.strokeStyle = '#666';
          //   }
          // }).on();

          var num = 1000;
          var width = waveform.width / num;

          dancer
            .load({ src: AUDIO_FILE})
            .waveform( waveform, { width: width, num: num});

          if( Dancer.isSupported() ){
            cb && cb( dancer );
          }

          var moveElement = $canves.siblings()[0];
          dancer.bind('update', function(){

            moveElement.style.left = dancer.getTime() / dancer.getDuration() * 100 + '%';
          });


          $canves.click(function( ev ){
            var percent = ev.offsetX / $canves.width();
            dancer.seekTo( percent );
            $canves.attr('percent', percent);
          });

          window.dancer = dancer;

          // Dancer.isSupported() || loaded();
          // !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();
        });
    }

    var array_column = function (arr, val, key) {
        if (val) {
            var vals = [];
            $.each(arr, function (i, item) {
                vals.push(item[val]);
            });
        } else {
            var vals = {};
            $.each(arr, function (i, item) {
                vals[item[key]] = item;
            });
        }

        return vals;
    }
    var array_filter = function (arr, fn) {
        var newArr = [];
        $.each(arr, function (index, item) {
            if (fn(item, index)) {
                newArr.push(item);
            }
        });

        return newArr;
    }

    var array_unique = function (arr) {
        var newArr = [];
        $.each(arr, function (i, item) {
            if ($.inArray(item, newArr) < 0) {
                newArr.push(item);
            }
        });

        return newArr;
    }

    var versions = {};
    var setVersion = function (path) {
        versions[path] = versions[path] || 0;
        return ++versions[path];
    }

    var compareVersion = function (path, version) {
        return getPath() == path && versions[path] == version;
    }


    var process = function ($proBar, $proMsg) {
        var prog = 0,
            step = 0,
            stepAdd = 12,
            _timer = function () {
                if (prog >= 99) return false;
                stepAdd--;
                if (stepAdd < 2) stepAdd = 2;
                prog += stepAdd;
                step++;
                $proMsg && $proMsg.html(prog + "%");
                $proBar.stop().animate({
                    width: 100 - prog + '%'
                }, step * 30, null, _timer);
            };
        return {
            stop: function () {
                $proBar.stop(true);
                return this;
            },
            end: function () {
                $proMsg && $proMsg.html('100%');
                prog = 0;
                $proBar.stop().animate({
                    width: 0
                }, 500)
                // .promise()
                // .then( $proBar.width('100%') );
                return this;
            },
            start: function () {
                prog = 0;
                $proBar.width('100%');
                _timer();
                return this;
            },
            reset: function () {
                prog = 0;
                step = 0;
                stepAdd = 12;
                $proMsg && $proMsg.html('0%');
                $proBar.stop(true).css('width', '0%');
                return this;
            }
        }
    }

    var videoProgress = function ($percent) {
        $('.loading-wrap').show()
            .find('.loading')
            .stop(true, true)
            .animate({
                width: 100 - $percent + '%'
            }, 300);
        // .css('width', 100 - $percent + '%');
    }

    var videoProgressHide = function () {
        $('.loading-wrap').fadeOut()
            .find('.loading')
            .css('width', '100%');
    }


    var fixHomePageVideo = function (success) {
        disposeVideo();
        success && success();
        return;
        // fuck
        var winTop = $(window).scrollTop();
        var sliderHeight = $('.home-slider').height();

        disposeVideo();
        if ($('.page').data('page') == 'home-page' && winTop < sliderHeight) {
            //console.log( sliderHeight );
            // scroll to $('.home-slider').height()
            $('html,body').animate({
                scrollTop: sliderHeight
            }, 500)
            .promise()
            .then(function () {
                success && success();
            });
        } else {
            success && success();
        }
    }


    var formatPath2Arr = function (path) {
        path = getPath(path);
        path = path.replace('pages_contents/', '');
        var paths = path.split('/');
        return paths;
    }


    var getPath = function (href) {
        var match = (href || location.href).match(/(categories|brands|services).*$/);
        if (match) {
            return match[0];
        }
        return '';
    }

    var setPath = function (url) {
        if (!url.match(/^\//)) {
            url = '/' + url;
        }
        pageManager.go(url);
    }


    var urlManager = (function () {

        var getItemPathinfoFromUrl = function () {
            var path = getPath();
            // 如果是brands 和 services
            var paths = path.split('/');
            if (paths[0] == 'brands' || paths[0] == 'services') {
                path = 'pages_contents/' + paths[2].split(',,').join('/') + '/' + paths[3];
            } else {
                path = 'pages_contents/' + paths.slice(0, 4).join('/');
            }
            return path;
        }


        // var getDataRequestUrl = function( url ){
        //     url = url || LP.parseUrl().path;
        //     // 如果是brands 和 services
        //     url = url.replace('pages_contents/','');
        //     var paths = url.split('/');
        //     switch( paths.length ){
        //         case 1:
        //         case 2:
        //             break;
        //         case 4:
        //         case 5:

        //     }
        //     if (paths[0] == 'brands' || paths[0] == 'services') {
        //         path = 'pages_contents/' + paths[2].split(',,').join('/') + '/' + paths[3];
        //     } else {
        //         path = 'pages_contents/' + paths.slice(0, 4).join('/');
        //     }
        // }


        //  ===> categories
        // categories ===>
        var rules = [];
        rules.push({
            url: /^(categories|brands)$/,
            destory: function (cb) {
                $('.gates-inner')
                    .stop(true,true)
                    .animate({
                        top: '-100%'
                    }, 1000, 'easeInBack')
                    .promise()
                    .then(function () {
                        $('.sec_gates').fadeOut();
                        $(document.body).css('overflow', 'auto');
                        $('.header').removeClass('header-fixed');
                        cb && cb();
                    });
            },
            load: function () {
                var path = getPath();
                fixHomePageVideo(function () {
                    $('.header').addClass('header-fixed');
                    $(document.body).stop(true,true).css('overflow', 'hidden');

                    document.title = $(document.body).data('title') + ' | ' + $('a[data-d="type='+ path +'"]').html();
                    show_cate_list(path);
                });
            }
        });

        rules.push({
            url: /^((categories|brands|services)\/[^\/]+)$/,
            destory: function (cb) {
                var url = /^((categories|brands|services)\/[^\/]+)$/;
                $('.brand_item_tit').hide();

                $('.header-inner').height(66);

                $('.brand_movie')
                    .find('ul')
                    .remove()
                    .end()
                    .hide();

                // if( $('.sec_brands').scrollTop() < 66 ){
                //     $('.sec_brands').animate({
                //         scrollTop: 66
                //     }, 300 )
                //     .promise()
                //     .then( function(){
                $('.brands_tit').animate({
                    height: 0
                }, 400);
                //     } );
                // }


                var height = $('.brands-con-li').height();
                var sTop = $('.sec_brands').scrollTop();
                var aniIndex = 0;
                var aniLength = ~~ ($(window).height() / height) + 2;

                var $lis = $('.brands-con-li').each(function (i) {
                    var aindex = aniIndex;
                    if (i >= sTop / height - 2 && aniIndex <= aniLength) {
                        $(this).delay(400 + 200 * aniIndex++)
                            .stop(true, true)
                            .animate({
                                marginLeft: -2000,
                                opacity: 0
                            }, 800, '', function () {
                                if (aindex == aniLength || i == $lis.length - 1) {
                                    if (!getPath().match(url)) {
                                        $('.brands_tit,.brands-con').hide();
                                        $(document.body).css('overflow', 'auto');
                                        $('.header').removeClass('header-fixed');
                                        $('.sec_brands').fadeOut();
                                    }
                                    cb && cb();
                                }
                            });
                    }
                });

                if (!$lis.length) {
                    $('.brands_tit,.brands-con').hide();
                    $(document.body).css('overflow', 'auto');
                    $('.header').removeClass('header-fixed');
                    $('.sec_brands').fadeOut();
                    cb && cb();
                }
            },
            load: function () {

                $('.page-mask').stop(true, true).fadeOut();
                fixHomePageVideo(function(){
                    $('.header').addClass('header-fixed');
                    $(document.body).stop(true,true).css('overflow', 'hidden');
                })
                $('.sec_brands').stop(true, true).show();
                var path = getPath();

                LP.setCookie('level2', path || '');

                var ver = setVersion(path);

                // change tit
                campaignManager.renderTitle(path);

                // show loading
                loadingMgr.show();
                var renderComapigns = function (compaigns) {
                    if (!compareVersion(path, ver)) {
                        return;
                    }
                    var tpl = '<li class="brands-con-li" data-path="#[path]" data-id="#[id]" style="margin-left:-600px;">\
                        <dl class="cs-clear">\
                            <dt>\
                                <div class="brands-mask"></div>\
                                <p class="brands-con-t">#[label]</p>\
                                <p class="brands-con-time">#[year]</p>\
                                <div class="cs-clear brands-con-meta">\
                                    <span class="fr">##[index]</span>\
                                    <span>#[cpgn_type]</span>\
                                </div>\
                                <div class="items-loading"></div>\
                            </dt>\
                            <dd><ul class="brands-items cs-clear"></ul></dd>\
                        </dl>\
                    </li>';
                    var aHtml = [];

                    var paths = [];

                    $.each(compaigns || [], function (index, item) {
                        aHtml.push(LP.format(tpl, {
                            agency: item.agency,
                            label: item.title,
                            year: item.date.replace(/(\d+)-.*/, '$1'),
                            index: compaigns.length - index,
                            cpgn_type: item.cpgn_type,
                            path: item._contentPath.replace('pages_contents/', '') + '/' + item.path
                        })
                        );
                    });

                    $('.brands-con').children().remove();
                    $('.brands-con').html(aHtml.join(''));
                    showCompains(path, ver);
                }

                loadingMgr.setSuccess(renderComapigns, 'renderComapigns');


                // load data
                campaignManager.getCampaigns(path, function (campaigns) {
                    loadingMgr.success('renderComapigns', campaigns);
                });
            }
        });

        rules.push({
            url: /^((categories|brands|services)\/[^\/]+\/[^\/]+\/\d+)$/,
            destory: function (cb) {
                $(document).unbind('keydown.level3');
                // to brands list
                if ($('.sec_brands').scrollTop() < 66) {
                    $('.sec_brands').animate({
                        scrollTop: 66
                    }, 300)
                        .promise()
                        .then(function () {
                            $('.brand_item_tit').animate({
                                height: 0
                            }, 400);
                        });
                }

                $('.brand_movie').fadeOut(400)
                    .promise()
                    .then(function () {
                        $('.brand_item_tit').hide();
                        $(document.body).css('overflow', 'auto');
                        $('.sec_brands').fadeOut();
                        $('.header').removeClass('header-fixed');
                        cb && cb();
                    });
            },
            load: function () {
                $('.sec_brands').stop(true, true).css({
                    display: 'block',
                    opacity: 1
                });
                
                // hide nav bar
                fixHomePageVideo(function(){
                    $('.header').addClass('header-fixed');
                    //setTimeout(function(){
                    $(document.body).stop(true,true).css('overflow', 'hidden');
                    //}, 600 );
                });
                var path = getItemPathinfoFromUrl();
                var paths = path.split('/');

                showBigBrandsItem(paths.slice(0, 4).join('/'), paths.pop());

                $(document).bind('keydown.level3', function (ev) {
                    switch (ev.which) {
                    case 37: // prev
                        LP.triggerAction('brand_big_prev');
                        break;
                    case 39: // next
                        LP.triggerAction('brand_big_next');
                        break;
                    }
                });
            }
        });

        rules.push({
            url: /^(categories|brands|services).*(\/\d+\/big)$/,
            destory: function (cb) {
                $(window).unbind('resize.fixedimg');
                $(document).unbind('keydown.level4');
                $('.preview').fadeOut()
                    .promise()
                    .then(function () {
                        $(document.body).css('overflow', 'auto');
                        cb && cb();
                    });
            },
            load: function (data) {
                fixHomePageVideo(function(){
                    $(document.body).stop(true,true).css('overflow', 'hidden');
                });

                $('.sec_brands').stop(true, true).show().css({
                    display: 'block',
                    opacity: 1,
                    top: 0
                });
                var path = getItemPathinfoFromUrl();

                // 如果是brands 和 services
                var paths = path.split('/');

                showBigItem(paths.slice(0, 4).join('/'), paths.slice(4, 5)[0]);

                var timer = null;
                $(window).bind('resize.fixedimg', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        $('.preview li').each(function () {
                            fixImageToWrap($(this), $(this).find('img'));
                        });
                    }, 200);
                });
                $(document).bind('keydown.level4', function (ev) {
                    switch (ev.which) {
                    case 37: // prev
                        LP.triggerAction('move-prev');
                        break;
                    case 39: // next
                        LP.triggerAction('move-next');
                        break;
                    }
                });
            }
        });
        
        

        // press page
        // rules.push({
        //     url: /^press\/\d+\/\d+/,
        //     destory: function(){
        //         LP.triggerAction('pop-mask');
        //     },
        //     load: function( data ){

        //     }
        // })
        // press page
        // rules.push({
        //     url: /^jobs\/\d+$/,
        //     destory: function (cb) {
        //         cb && cb();
        //     },
        //     load: function (data) {
        //         var $item = $(this).closest('.jobsitem');
        //         job_index = $item.index() + 1;
        //         $('.shade').fadeIn();
        //         $('.pop_jobs').show()
        //             .find('.pop_jobcon')
        //             .html('')
        //             .append($item.find('.pop_jobcon_inner').clone().show())

        //         .end()
        //             .css({
        //                 top: '-150%',
        //                 opacity: 1
        //             })
        //             .animate({
        //                 top: '50%'
        //             }, 400)
        //             .promise()
        //             .then(function () {
        //                 $('.pop_press_menus')
        //                     .delay(100)
        //                     .animate({
        //                         right: 0
        //                     }, 300, 'easeLightOutBack');
        //             });

        //         $('.pop_jobs .jobs_more').attr('href', 'mailto:' + data.contact);
        //         $('.pop_jobs .pop_index').html(job_index);
        //         $('.pop_jobs .pop_total').html($item.parent().children().length);
        //         $('.pop_job_menus').css('right', 95);
        //     }
        // });


        return {
            setFormatHash: function (toUrl, fromUrl, data) {
                // var fromHash = getPath(fromUrl);
                // var currPaths = fromHash.split('/');
                // var paths = toUrl.split('/');
                // if ( paths.length >= 4 ){
                //     if( paths[0] == 'pages_contents' ) {
                //         paths.shift();
                //     }
                //     if ( ( currPaths[0] == 'brands' || currPaths[0] == 'services' ) && paths[0] == 'categories' ) {
                //         var index = paths.pop();
                //         toUrl = currPaths[0] + '/' + currPaths[1] + '/' + paths.join(',,') + '/' + index;
                //     } else {
                //         toUrl = paths.join('/');
                //     }
                // }
                toUrl = getPath(toUrl);
                setPath(toUrl);
            },
            destory: function( url , cb ){
                disposeVideo();

                var loadFn = null,
                    destory = null,
                    currUrlMatch = null;
                
                $.each(rules, function (i, rule) {
                    if (rule.url.test(url)) {
                        destory = rule.destory;;
                        return false;
                    }
                });

                destory && destory( function(){
                    $('.page-mask').stop(true,true).fadeOut();
                    cb && cb();
                } );
            },
            go: function (toUrl, data, fromUrl) {
                disposeVideo(); //销毁视频调用这个函数
                //pages_contents/categories/alcoholic_drinks/16eme_ciel_stand-up_-_lyon_-_2013/0

                var hash = getPath(fromUrl);
                // if( hash == toUrl ){
                //     return false;
                // }
                var currPaths = hash.split('/');
                var paths = toUrl.split('/');
                if (paths.length >= 4) {
                    if (paths[0] == 'pages_contents') {
                        paths.shift();
                    }
                    if ((currPaths[0] == 'brands' || currPaths[0] == 'services') && paths[0] == 'categories') {
                        var index = paths.pop();
                        toUrl = currPaths[0] + '/' + currPaths[1] + '/' + paths.join(',,') + '/' + index;
                    } else {
                        toUrl = paths.join('/');
                    }
                }

                var loadFn = null, //进场动画
                    destory = null, //退场动画
                    currUrlMatch = null;
                $.each(rules, function (i, rule) {
                    if (rule.url.test(toUrl)) {
                        loadFn = rule.load;
                        currUrlMatch = rule.url;
                        return false;
                    }
                });

                $.each(rules, function (i, rule) {
                    if (rule.url.test(hash)) {
                        destory = rule.destory;;
                        return false;
                    }
                });

                fixHomePageVideo(function () {
                    if (destory && fromUrl) {
                        destory(function () {
                            if (getPath().match(currUrlMatch)) {
                                loadFn && loadFn(data)
                            }
                        });
                    } else {
                        if (getPath().match(currUrlMatch)) {
                            loadFn && loadFn(data)
                        }
                    }
                });
            },
            back: function () {

                LP.triggerAction('pop_close');

                disposeVideo();
                var path = getPath();
                var paths = path.split('/');
                var tarPath = '';
                switch (paths.length) {
                case 1:
                    tarPath = '';
                    break;
                case 2:
                    tarPath = paths[0];
                    break;
                case 4:
                    if( LP.getCookie('prev') ){
                        tarPath = LP.getCookie('prev');
                    } else if (LP.getCookie('level2')) {
                        tarPath = LP.getCookie('level2');
                    } else {
                        tarPath = paths[0] + '/' + paths[1];
                    }
                    break;
                case 5:
                    paths.pop();
                    tarPath = paths.join('/');
                    break;
                }
                if (!tarPath || tarPath == 'undefined') {
                    tarPath = LP.getCookie('page') || '';
                }

                setPath(tarPath);
            },
            myBack: function () {

                //LP.triggerAction('pop_close');

                disposeVideo();
                var path = getPath();
                var paths = path.split('/');
                var tarPath = '';
                switch (paths.length) {
                    case 1:
                        tarPath = '';
                        break;
                    case 2:
                        tarPath = paths[0];
                        break;
                    case 4:
                        if( LP.getCookie('prev') ){
                            tarPath = LP.getCookie('prev');
                        } else if (LP.getCookie('level2')) {
                            tarPath = LP.getCookie('level2');
                            // 判断terPath 是否正确
                            if (tarPath.indexOf(paths[0]) == -1) {
                                tarPath = paths[0] + '/' + paths[1];
                            }
                        } else {
                            tarPath = paths[0] + '/' + paths[1];
                        }
                        break;
                    case 5:
                        paths.pop();
                        tarPath = paths.join('/');
                        break;
                }
                if (!tarPath || tarPath == 'undefined') {
                    tarPath = LP.getCookie('page') || '';
                }

                setPath(tarPath);
            }
        }

    })();


    function showBigItem(path, index) {

        // show brand
        $('.sec_brands').css('top', 0);

        var tpl = '<li class="big-item #[class]" data-video="#[video]"><img src="#[src]" /></li>';
        loadingMgr.show();
        $('.page-mask').stop(true, true).show();
        loadingMgr.setSuccess(function () {
            $('.sec_brands').css('top', 0);
            $('.page-mask').stop(true, true).fadeOut();
            $('.preview').stop().css('opacity', 1).hide().fadeIn().find('ul').fadeIn();
            $('.preview li img')
                .each(function () {
                    fixImageToWrap($(this).parent().data('fixed-img-wrap', 1), $(this));
                })
                .load(function () {
                    fixImageToWrap($(this).parent().data('fixed-img-wrap', 1), $(this));
                });

            var $li = $('.preview ul').children().eq(index);
            var video = $li.data('video');
            if (video) {
                // render video and play
                renderVideo($li, video, $li.find('img').attr('src'), {
                    autoplay: true,
                    pause_button: true,
                    showLoadingBar: true
                }, function () {
                    $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                        .append($li.find('.vjs-control-bar').show())
                        .appendTo($li);
                });
            }

            $('.preview ul').children().each(function(){
                if( !$(this).data('video') ){
                    initImageMouseMoveEffect( $(this) );
                }
            });

            if( index == 0 ){
                $('.preview .prev').hide();
            }
            if( index == $('.preview ul').children().length - 1 ){
                $('.preview .next').hide();
            }

        }, 'showBigItem');
        campaignManager.getCampaignItems(path, function (items) {
            var aHtml = [];
            var pics = [];

            $.each(items, function (i, item) {
                var isImage = !item.media || item.media.match(/\.(jpg|png|bmp|jpeg)$/i);

                // 如果是图片  则取media ， 否则取picture
                var pic = campaignManager.getPath(item, isImage && item.media ? 'media' : 'picture_1');
                pics.push(pic);
                aHtml.push(LP.format(tpl, {
                    src: pic,
                    video: isImage ? '' : campaignManager.getPath(item, 'media'),
                    'class': isImage ? '' : 'interview-video-wrap'
                }));

            });

            var $ul = $('.preview ul').html(aHtml.join('')).css('marginLeft', -index * 90 + 5 + '%').data('index', index);


            $ul.children().css({
                width: 1 / items.length * 100 + '%'
            });

            $ul.css('width', items.length * 90 + '%').hide();


            // 只载入前后的3张
            loadImages(pics.slice(Math.max(index - 2, 0), index + 2), null, function () {
                loadingMgr.success('showBigItem');
            });
        });
    }


    // show image in the biggest view
    // and make img auto move effect
    function imageZoom(item) {
        var src = campaignManager.getPath(item, 'media');

        var $wrap = $('<div class="image-zoom-big"><img/></div>').appendTo(document.body)
            .hide()
            .fadeIn();

        loadingMgr.show();
        loadingMgr.setSuccess(function () {
            var imgWidth = $img.width();
            var imgHeight = $img.height();
            var st = $(window).scrollTop();

            var winWidth = $(window).width();
            var winHeight = $(window).height();

            if (imgWidth < winWidth || imgHeight < winHeight) {
                fixImageToWrap($wrap, $img);
                imgWidth = $img.width();
                imgHeight = $img.height();
            }

            $wrap.on('mousemove', function (ev) {
                var winHeight = $(window).height();
                var winWidth = $(window).width();

                left = -2 * ev.pageX / winWidth * (imgWidth - winWidth) / 2;
                top = -2 * (ev.pageY - st) / winHeight * (imgHeight - winHeight) / 2;
                runAnimate();
            });
        }, 'image-zoom');
        // TODO:: need to fix image width auto and height auto , show real big image
        var $img = $wrap.find('img').css({
                position: 'absolute'
            }).load(function () {
                loadingMgr.success('image-zoom');
            })
            .attr('src', src);


        var top = 0;
        var left = 0;

        var interval;
        var runAnimate = function () {
            clearInterval(interval);

            var duration = 800;
            var start = new Date();
            var ltop = parseInt($img.css('top')) || 0;
            var lleft = parseInt($img.css('left')) || 0;
            var ctop = top - ltop;
            var cleft = left - lleft;
            interval = setInterval(function () {
                // t: current time, b: begInnIng value, c: change In value, d: duration
                //x, t, b, c, d
                var dur = (new Date() - start) / duration;
                var per = dur > 1 ? 1 : $.easing.easeOutQuart(0, dur, 0, 1, 1);

                $img.css({
                    top: ltop + ctop * per,
                    left: lleft + cleft * per
                });

                if (per == 1) {
                    clearInterval(interval)
                }
            }, 1000 / 60);
        }
    }


    // brand item manager , you should get items from this object's function 'getCampaignItems'
    // It would save the ajax cache and add some useful properties to every items
    var campaignManager = (function () {
        var __CACHE_AJAX__ = {};
        var __CACHE_ITEM__ = {};
        var __CACHE_BRAND__ = {};
        var __CACHE_CAMPAIGN__ = {};
        var __CACHE_TITLE__ = {};
        var __CACHE_PREV_ITEM__ = {};
        var __CACHE_NEXT_ITEM__ = {};
        var index = 0;


        var __fixCampaigns = function (campaigns) {
            $.each(campaigns, function (i, campaign) {
                var path = campaign._contentPath + '/' + campaign.path + '/';
                path = path.replace(/\/\//g, '/');
                __CACHE_CAMPAIGN__[path] = campaign;
            });
            return campaigns;
        }


        var __fixCampaignItems = function (items) {
            // 分path
            var itemGroupIndex = {};

            $.each(items, function (i, item) {
                if (itemGroupIndex[item._contentPath] === undefined) {
                    itemGroupIndex[item._contentPath] = -1;
                }
                itemGroupIndex[item._contentPath]++;

                __CACHE_ITEM__[item._contentPath  + itemGroupIndex[item._contentPath]] = item;
            })
            return items;
        }

        var __fixRequestPath = function (path) {
            return path.replace('pages_contents/', '');
        }

        return {
            dump: function () {
                //console.log(__CACHE_ITEM__);
                //console.log(__CACHE_AJAX__);
            },


            renderTitle: function (path, isLevel3) {
                path = __fixRequestPath(path);
                var paths = path.split('/');
                var key = paths[0] + '/' + paths[1];

                var fixLevel2Title = function () {
                    var path = getPath();
                    var tmpPaths = path.split('/');
                    tmpPaths.pop();
                    if (__CACHE_NEXT_ITEM__[key]) {
                        if (tmpPaths[0] == 'categories') {
                            tmpPaths.push(__CACHE_NEXT_ITEM__[key].path);
                        } else {
                            tmpPaths.push(__CACHE_NEXT_ITEM__[key].id);
                        }
                        $('a[data-a="pagetitarrbottom"]').attr('href', tmpPaths.join('/')).show();
                    } else {
                        $('a[data-a="pagetitarrbottom"]').hide();
                    }
                    tmpPaths.pop();
                    if (__CACHE_PREV_ITEM__[key]) {
                        if (tmpPaths[0] == 'categories') {
                            tmpPaths.push(__CACHE_PREV_ITEM__[key].path);
                        } else {
                            tmpPaths.push(__CACHE_PREV_ITEM__[key].id);
                        }
                        $('a[data-a="pagetitarrtop"]').attr('href', tmpPaths.join('/')).show();
                    } else {
                        $('a[data-a="pagetitarrtop"]').hide();
                    }
                }
                var fixLevel3Title = function () {
                    var paths = LP.parseUrl().path.split('/');
                    var level2 = LP.getCookie('level2');
                    var request = path;
                    if (level2) {
                        request = level2;
                    }
                    campaignManager.getCampaigns(request, function (items) {
                        var prev = null;
                        var next = null;
                        $.each(items, function (i, compaign) {
                            if ($.inArray(compaign.path, paths) >= 0) {
                                prev = items[i - 1];
                                next = items[i + 1];
                                if (prev) {
                                    paths.pop();
                                    paths.pop();
                                    paths.push(prev.path);
                                    paths.push(0);
                                    $('a[data-a="pagetitarrtop-level3"]').attr('href', paths.join('/')).show();
                                } else {
                                    $('a[data-a="pagetitarrtop-level3"]').hide();
                                }
                                if (next) {
                                    paths.pop();
                                    paths.pop();
                                    paths.push(next.path);
                                    paths.push(0);
                                    $('a[data-a="pagetitarrbottom-level3"]').attr('href', paths.join('/')).show();
                                } else {
                                    $('a[data-a="pagetitarrbottom-level3"]').hide();
                                }
                                return false;
                            }
                        });
                    });
                    // api.request(paths[0] + '/' + paths[1] , function (r) {
                    //     console.log( r );
                    // });
                }
                var cate = $('[data-d="type=' + paths[0] + '"]').html();
                if (__CACHE_TITLE__[key]) {

                    $('.sec_brands_tit h2').html(
                        LP.format('<span>#[cate]</span>  <span class="sep">|</span>  <span>#[tit]</span>', {
                            cate: cate,
                            tit: __CACHE_TITLE__[key].toUpperCase()
                        }));

                    document.title = $(document.body).data('title') + ' | ' + paths[0].toUpperCase() + ' | ' + __CACHE_TITLE__[key].toUpperCase();

                    isLevel3 ? fixLevel3Title() : fixLevel2Title();
                } else {
                    api.request(paths[0], function (r) {
                        $.each(r.items, function (i, item) {
                            // 如果是brands和services则，只能从id中获取
                            if (item.path == paths[1] || ((paths[0] == 'brands' || paths[0] == 'services') && item.id == paths[1])) {
                                __CACHE_PREV_ITEM__[key] = r.items[i - 1];
                                __CACHE_NEXT_ITEM__[key] = r.items[i + 1];
                                __CACHE_TITLE__[key] = item.title;
                                $('.sec_brands_tit h2').html(
                                    LP.format('<span>#[cate]</span>  <span class="sep">|</span>  <span>#[tit]</span>', {
                                        cate: cate,
                                        tit: item.title.toUpperCase()
                                    }));

                                document.title = $(document.body).data('title') + ' | ' + paths[0].toUpperCase() + ' | ' + item.title.toUpperCase();

                                isLevel3 ? fixLevel3Title() : fixLevel2Title();
                                return false;
                            }
                        });
                    });
                }
            },

            getBrandById: function (id, success) {
                if (__CACHE_BRAND__[id]) {
                    success && success(__CACHE_BRAND__[id]);
                } else {
                    api.request('brands', function (r) {
                        $.each(r.items || [], function (i, brand) {
                            __CACHE_BRAND__[brand.id] = brand;
                        });

                        success && success(__CACHE_BRAND__[id]);
                    });
                }
            },

            // 获取campaign列表
            // brands/1
            getCampaigns: function (path, success) {
                path = __fixRequestPath(path);
                if( path.match(/^eng|zho/) ){
                    path = path.split('/').slice(0, 3).join('/');
                } else {
                    path = path.split('/').slice(0, 2).join('/');
                }
                

                var match = path.match(/^(brands|services)\/([^\/]+)/);
                if (match && match[1] == 'brands') {
                    api.getBrandCampaigns(match[2], function (r) {
                        var campaigns = __fixCampaigns(r.items || []);
                        success && success(campaigns);
                    });
                } else if (match && match[1] == 'services') {
                    api.getServiceCampaigns(match[2], function (r) {
                        var campaigns = __fixCampaigns(r.items || []);
                        success && success(campaigns);
                    });
                } else {
                    api.request(path, function (r) {
                        var campaigns = __fixCampaigns(r.items || []);
                        success && success(campaigns);
                    });
                }
            },
            // categories/xxx/yyyy
            getCampaignInfo: function (path, success) {
                // path = __fixRequestPath( path );
                var campaigns = this.getCampaigns(path, function (campaigns) {
                    $.each(campaigns, function (i, campaign) {
                        if (path.indexOf(campaign._contentPath + campaign.path) >= 0) {
                            success && success(__CACHE_CAMPAIGN__[path]);
                            return false;
                        }
                    });
                });
            },

            // 获取每一个campaign的图片列表
            // 可以传数组进来  获取多个campaign的图片列表
            getCampaignItems: function (path, success) {
                if (!$.isArray(path)) {
                    path = [path];
                }

                $.each(path, function (i, p) {
                    path[i] = __fixRequestPath(p);
                });

                var key = path.join(',');
                if (__CACHE_AJAX__[key]) {
                    success && success(__CACHE_AJAX__[key]);
                } else {
                    api.request(path, function (r) {
                        var items = __fixCampaignItems(r.items || []);

                        __CACHE_AJAX__[key] = items;
                        success && success(items);
                    });
                }
            },

            // 获取每一个活动的图片的链接
            getPath: function (item, type, isBack) {
                // treat as key
                if (!$.isPlainObject(item)) {
                    item = __CACHE_ITEM__[item];
                }

                var lang = 'eng';
                var rpath = 'http://preprod.fredfarid.com/data/#[lang]/#[_contentPath]/#[type]/#[name]';
                
                return LP.format(rpath, {
                    lang: lang,
                    _contentPath: item._contentPath.replace(/(pages_contents|eng|zho)\//,''),
                    type: type,
                    name: item[type]
                });
            },
            getPath_awards: function (item, type, isBack) {
                // treat as key
                if (!$.isPlainObject(item)) {
                    item = __CACHE_ITEM__[item];
                }

                var lang = 'eng';
                var rpath = 'http://preprod.fredfarid.com/data/#[lang]/awards/preview/#[name]';
                return LP.format(rpath, {
                    lang: lang,
                    name: item.award_preview
                });
            },


            // get item from it's key
            get: function (key) {
                return __CACHE_ITEM__[key];
            }
        }
    })();

    window.campaignManager = campaignManager;
    window.api = api;

    function disposeVideo( $dom ) {
        ( $dom || $(document.body) ).find('.video-wrap').parent()
            .each(function () {
                var video = $(this).data('video-object');
                try {
                    video && video.dispose();
                } catch (e) {}
                $(this).removeData('video-object').find('.video-wrap').remove();
            });

        ( $dom || $(document.body) ).find('.vjs-default-skin').remove();

        // hide videoProgress
        loadingMgr.success();
        clearTimeout(window.preloadTimer);
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

    function initSelect($select) {
        $select.each(function () {
            var $options = $(this).find('option');
            var index = $options.filter(':selected').index();
            //var value = $(this).val();
            $(this).hide();
            var $wrap = $('<div><span class="selitem_tips">' + $options.eq(index).html() + '</span><ul class="select-options"></ul></div>')
                .insertAfter(this);

            var ahtml = [];
            $options.each(function () {
                ahtml.push('<li>' + $(this).text() + '</li>');
            });

            $wrap
                .find('.selitem_tips')
                .click(function () {
                    $('.select-options').fadeOut();

                    $wrap.find('ul').fadeIn();
                    return false;
                })
                .end()
                .find('ul').html(ahtml.join(''))
                .on('click', 'li', function () {
                    $wrap.find('span').html($(this).text());
                    index = $(this).index();
                    $options.eq(index).attr('selected', 'selected');
                });


            $(document.body).click(function () {
                $wrap.find('ul').fadeOut();
            });

        });
    }

    function intMouseMoveEffect($dom, staticFn, moveFn, time) {
        var timer = null;
        var showTimer = null;
        var moving = true;
        $dom.mousemove(function (ev) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                moving = false;
                staticFn(ev);
            }, time || 2000);

            clearTimeout(showTimer);
            showTimer = setTimeout(function () {
                moveFn(ev);
            }, 200);
            moving = true;
        });
    }


    var fixImgsDomLoaded = function ($imgs, cb) {
        if (!$imgs.length) {
            cb && cb();
        } else {
            var index = 0;
            var imgs = [];
            $imgs.each(function () {
                imgs.push(this.getAttribute('src'));
            });

            loadImages(imgs, null, cb);
        }
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
        var fixWidth = imgWidth * 0;
        var fixHeight = imgHeight * 0;
        var $cloneImg =  null ;

        var off = null;
        var domWidth = $dom.width();
        var domHeight = $dom.height();

        var init = false;
        var top = 0;
        var left = 0;

        var initFn = function(){
            $img = $dom.find('img');
            imgWidth = $img.width();
            imgHeight = $img.height();
            
            $cloneImg =  null ;


            off = $dom.offset();
            domWidth = $dom.width();
            domHeight = $dom.height();

            init = false;

            fixWidth = Math.abs( parseInt( $img.css('marginLeft') ) );
            fixHeight = Math.abs( parseInt( $img.css('marginTop') ) );

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


            $cloneImg = $cImgs.length ? $cImgs : $img.clone().css({
                position: 'absolute',
                top: - fixHeight,
                left: - fixWidth,
                marginLeft:0,
                marginTop: 0
            })
            .addClass('clone-img')
            .appendTo( $dom );
            init = true;

            // $cloneImg.stop().css({
            //     opacity: 1,
            //     display: 'block'
            // }).animate({
            //     top: - fixHeight,
            //     left: - fixWidth
            //     // width: imgWidth + 2 * fixWidth,
            //     // height: imgHeight + 2 * fixHeight

            // } , 500 )
            // .promise()
            // .then(function(){
            //     init = true;
            // });
        }).on('mouseleave.image-effect' , function(){
            return
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
            domWidth = $dom.width();
            domHeight = $dom.height();
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
    function showBigBrandsItem(path, itemIndex) {
        $('.brand_big_text').html('');
        itemIndex = parseInt(itemIndex);
        // change hash

        loadingMgr.show();
        $('.page-mask').stop(true, true).removeClass('lighter').show();
        // prev dealing
        $('.sec_brands').scrollTop(0).fadeIn();
        $('.brand_movie').data('index', itemIndex).css('opacity', 1).hide().fadeIn();

        // render title
        campaignManager.renderTitle(path, true);

        var afterItemsRender = function (item) {

            var winWidth = $(window).width();


            // render brand_big_prev and brand_big_next status
            // if( itemIndex == 0 ){
            //     $('.brand_big_prev').fadeOut();
            // } else if( itemIndex == $('.brand_movie').find('.brands-item').length - 1 ){
            //     $('.brand_big_next').fadeOut();
            // }

            $('.brand_movie').find('.brands-mask').show().hover(function () {
                $(this).animate({
                    opacity: 0.2
                }, 300);
            }, function () {
                $(this).animate({
                    opacity: 0.5
                }, 300);
            });

            var $bigItem = $('.brand_movie').find('.brands-item').eq(itemIndex);
            // hide the mask
            $bigItem.find('.brands-mask').hide();


            // list show with animate effect here
            $('.brand_item_tit').show().animate({
                height: 88
            }, 400);

            $('.page-mask').stop(true, true).fadeOut();
            $('.sec_brands').scrollTop(66);


            var $movieWrap = $('.brand_movie').fadeIn(function () {

                $bigItem.parent().children().each(function () {
                    var $dom = $(this);
                    if ($dom.data('image')) {
                        // initImageMouseMoveEffect( $dom );

                        $dom.hover(null, function () {
                            $dom.find('.image-zoom').fadeOut();
                        })
                            .mousemove(function () {
                                if ($dom.find('.brands-mask,.image-zoom').is(':visible')) return;
                                if (!$dom.find('.image-zoom').length) {
                                    $('<a href="#" data-a="image-zoom" class="image-zoom" data-a="showreel"></a>').appendTo($dom);
                                }
                                $dom.find('.image-zoom').fadeIn();
                            });
                    }
                });
            });


            var renderItems = function () {
                var totalWidth = 0;
                var preWidth = 0;

                // fixImgsDomLoaded( $movieWrap
                //     .find('img'), function(){
                $movieWrap.find('.brands-item')
                    .each(function (i) {
                        var itemWidth = $(this).width(); //$(this).is(':hidden') ? 0 : $(this).width();
                        totalWidth += itemWidth;
                        if (i < itemIndex) {
                            preWidth += itemWidth;
                        } else if (i == itemIndex) {
                            preWidth += itemWidth / 2
                        }
                    });

                $movieWrap.find('ul')
                    .css({
                        width: totalWidth, //winWidth * $movieWrap.find('.brands-item').length,
                        marginLeft: winWidth -  totalWidth > 0 ? 0 : Math.max( Math.min(0, winWidth / 2 - preWidth) , winWidth -  totalWidth )
                    });
            }

            renderItems()


            // } );

            $movieWrap.find('img').each(function () {
                var $img = $(this);
                if (!$img.data('img')) return;
                $('<img/>').load(function () {


                    $img
                        .load(function(){
                            renderItems();
                            $img.unbind('load');
                        })
                        .attr('src', $img.data('img'))
                        .data('img', '');

                    // var index = $(this).closest('li').index();
                    // var realIndex = $('.brand_movie').data('index');
                    // if( index < realIndex ){
                    //     var rWidth = 445 / this.height * this.width;
                    //     $movieWrap.find('ul')
                    //         .width( totalWidth + rWidth - 300 )
                    //         .css('')
                    //}
                }).attr('src', $img.data('img'));
            });
            // set other width
            // $('.brand_movie .brands-item').filter(':hidden')
            //     .css('width','auto')
            //     .find('img')
            //     .load(function(){
            //         var $item = $(this).closest('.brands-item')
            //             .show();

            //         var width = $item.width();
            //         console.log( 'brands-item add width : ' + width );
            //         var $ul = $movieWrap.find('ul').width('+=' + width);
            //         if( $item.data('pos') == 'prev' ){
            //             $ul.css('marginLeft', '-=' + width);
            //         }

            //         $(this).unbind('load');
            //     });


            // render brand information
            var textTpl = $('#brand_big_text_year').html();


            // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
            // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\
            // <div class="brand_big_text_item"> <p class="brand_big_text_tit">&nbsp;</p> <p class="brand_big_text_val">&nbsp;</p><p class="brand_big_text_val">&nbsp;</p> </div>\

            campaignManager.getCampaignInfo(item._contentPath, function (campaign) {
                campaign['year'] = campaign['date'].split('-')[0];
                for (var key in campaign) {
                    if (!campaign[key]) {
                        campaign[key + '_visible'] = 'style="display:none;"';
                    }
                }

                campaignManager.getBrandById(campaign.fid_customer, function (brand) {
                    campaign.brand = brand.title;
                    var str = LP.format(textTpl, campaign);
                    $('.brand_big_text').html(str).fadeIn();
                });
            });
        }

        loadingMgr.setSuccess(function (aHtml, item) {

            $('.brand_movie .brands-items').show();
            afterItemsRender(item);


            $('.sec_brands').trigger('scroll');

        }, 'afterItemsRender');

        campaignManager.getCampaignItems(path, function (items) {
            var item = items[itemIndex];
            var aHtml = ['<ul class="brands-items">'];
            var tpl = '<li class="brands-item #[brands-class]" #[style] data-pos="#[pos]" data-a="big-brands-item" data-image="#[image]" data-movie="#[video]" data-path="#[path]">\
                #[video-btn]<div class="brands-mask"></div><img data-img="#[picture]" src="#[src]">#[video-meta]\
                </li>';

            var pics = [];
            // 只载入前后的5张
            var preloadNum = 4;
            $.each(items, function (i, tm) {
                var pic = campaignManager.getPath(tm, 'picture_1');
                pics.push(pic)

                var isImage = !tm.media || tm.media.match(/\.(jpg|png|bmp|jpeg)$/i);
                aHtml.push(LP.format(tpl, {
                    path: tm._contentPath + i,
                    picture: Math.abs(i - itemIndex) <= preloadNum ? '' : pic,
                    image: isImage ? 1 : '',
                    src: Math.abs(i - itemIndex) <= preloadNum ? pic : '/images/pre_load_l3.png',

                    // style: Math.abs( i - itemIndex ) <= preloadNum  ? '': 'style="display:none;"',
                    // pos: i < itemIndex ? 'prev' : 'next',
                    'brands-class': isImage ? 'brands-item-image' : 'brands-item-video',
                    'video-btn': isImage ? '' : '<div class="brands-video-btn"></div>',
                    'video-meta': isImage && tm.media_meta ? '' : '<span class="video-meta">' + tm.media_meta + '</span>'
                    //video: tm.media.match(/\.(jpg|png|bmp|jpeg)$/i) ? '' : 1
                }));
            });

            aHtml.push('</ul>');

            $('.brand_movie .brands-items').remove();
            $(aHtml.join(''))
                .insertBefore($('.brand_movie .brand_big_text'));

            $('.brand_movie .brands-items').hide();
            // fixImgsDomLoaded($('.brand_movie').find('img'), function () {
            //     loadingMgr.success('afterItemsRender', aHtml, item);
            // });
            loadImages(pics);
            loadImages(pics.slice(Math.max(itemIndex - preloadNum, 0), itemIndex + preloadNum + 1), null, function () {
                loadingMgr.success('afterItemsRender', aHtml, item);
            });
        });

    }

    // show first cate list
    // type => {categories|brands|services}
    function show_cate_list(type) {
        $('header-inner').height(66);
        $('.sec_brands,.brand_movie,.brand_item_tit').fadeOut();

        // show loading
        loadingMgr.show();
        loadingMgr.setSuccess(function (r) {
            // load categories
            var aHtml = [];
            $('.gates-inner-c').show();
            // biuld html
            var tpl = '<li> <a data-a="show-compagins" #[disabled] data-d="path=#[path]" data-id="#[id]" data-category="CONSULTING" title="#[title]" href="#">#[title]</a> </li>';
            $.each(r.items || [], function (i, item) {
                var path = type + '/';
                switch (type) {
                case 'services':
                    $('.gates-inner-c').hide();
                case 'brands':
                    path += item.id;
                    break;
                case 'categories':
                    path += item.path;
                    break;
                }

                aHtml.push(LP.format(tpl, {
                    title: item.title,
                    path: path,
                    id: item.id,
                    disabled: type == 'services' ? 'disabled="disabled"' : ''
                }));
            });
            $('#categories-wrap').html(aHtml.join(''));


            $('.sec_gates').find('.gates-inner-r').hide();
            // start animation
            var winHeight = $(window).height();
            $('.sec_gates')
                .stop(true, true)
                .fadeIn()
                .promise()
                .then(function () {
                    $('.gates-inner')
                        .css({
                            top: '-100%',
                            height: 'auto'
                        })
                        .stop(true, true)
                        .animate({
                            top: 0
                        }, 1000, 'easeOutBack')
                        .promise()
                        .then(function () {
                            $(this).css('height', '100%');
                        });
                });
            // render the letters
            if (lang != 'zho') {
                var letters = [];
                $('.gates-inner-l a').each(function () {
                    var l = $.trim($(this).text())[0].toUpperCase();
                    if ($.inArray(l, letters) < 0) {
                        letters.push(l);
                    }
                });

                letters.sort();
                var html = [];
                $.each(letters, function (i, l) {
                    html.push('<li> <a data-a="filter-letter" href="#">' + l + '</a> </li>');
                });
                $('.gates-inner-c ul').html(html.join(''));
            }

        }, 'show_cate_list');
        // get 'type' catelist
        api.request(type, function (r) {
            loadingMgr.success('show_cate_list', r);
        });

    }


    function loadImages(pics, step, cb) {
        if (!pics.length) {
            cb && cb();
        }
        var index = 0;
        $.each(pics, function (i, pic) {
            $('<img/>').on('load', function () {
                //console.log($(this).prop('src'),'loaded');
                step && step(index);
                index++;
                if (index == pics.length) {
                    cb && cb();
                }
            }).attr('src', pic).on('error', function () {
                step && step(index);
                index++;
                if (index == pics.length) {
                    cb && cb();
                }
            });
        });
    }

    function loadImages_2(pics, callback_when_all_done, callback_when_each_done) {
        if (!pics.length) {
            return callback_when_all_done && callback_when_all_done();
        }
        //console.log('load ',pics.length,' images: ');
        var _index = 0;
        $.each(pics, function (i, url) {
            var $img = $('<img>');
            $img.load(function () {
                _index = i + 1;
                //console.log(_index,'th ', $img.prop('src'), ' loaded');
                callback_when_each_done && callback_when_each_done($(this));
                if (_index == pics.length) {
                    return callback_when_all_done && callback_when_all_done();
                }
            }).error(function () {
                _index = i + 1;
                //console.log(_index,'th ', $img.prop('src'), ' fail to loaded');
                if (_index == pics.length) {
                    return callback_when_all_done && callback_when_all_done();
                }
            }).prop("src", url);
        });
    }


    var mapHelper = (function () {
        return {
            renderBaidu: function ($dom, points) {
                var href = 'http://j.map.baidu.com/Vhzjb';
                var $link = $('<a target="_blank"></a>').attr('href', href);
                $link.append( $('<img/>').attr('src', '/images/google-map.jpg').width('100%') );
                $dom.append( $link );
                return;
                // var html = '<img class="map-marker" src="#[markerPath]" />\
                //     <img src="http://api.map.baidu.com/staticimage?center=#[pointer]&width=#[width]&height=#[height]&zoom=11" />';
                // $dom.html( LP.format( html , {
                //     markerPath: SOURCE_PATH + '/images/map-marker.png',
                //     pointer: point.join(','),
                //     width: $dom.width(),
                //     height: $dom.height()
                // } ) );

                var id = $dom.attr('id') || 'baidu-map-' + (+new Date());
                $dom.attr('id', id);
                if (!window.BMap) {
                    var _LP = window.LP;
                    LP.use('http://api0.map.bdimg.com/getscript?v=2.0&ak=AwxxvHue9bTdFietVWM4PLtk&services=&t=20140725172530', function () {
                        window.LP = _LP;
                    });
                }
                var interval = setInterval(function () {
                    if (window.BMap) {
                        clearInterval(interval);
                        var oMap = new BMap.Map(id);
                        oMap.addControl(new BMap.NavigationControl());
                        var point = new BMap.Point(points[0][0], points[0][1]);
                        oMap.centerAndZoom(point, 15);
                        oMap.setMapStyle({
                            styleJson: [{
                                "featureType": "all",
                                "elementType": "geometry.fill",
                                "stylers": {
                                    "lightness": 13,
                                    "saturation": -100
                                }
                            }, {
                                "featureType": "road",
                                "elementType": "geometry.stroke",
                                "stylers": {
                                    "color": "#cac4b5"
                                }
                            }, {
                                "featureType": "building",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#9e927a"
                                }
                            }, {
                                "featureType": "administrative",
                                "elementType": "labels.text.fill",
                                "stylers": {
                                    "color": "#9e927a"
                                }
                            }, {
                                "featureType": "administrative",
                                "elementType": "labels.text.stroke",
                                "stylers": {
                                    "color": "#ffffff",
                                    "saturation": 100
                                }
                            }, {
                                "featureType": "road",
                                "elementType": "labels.text.fill",
                                "stylers": {
                                    "color": "#9e927a"
                                }
                            }, {
                                "featureType": "road",
                                "elementType": "labels.text.stroke",
                                "stylers": {
                                    "color": "#ffffff"
                                }
                            }]
                        });

                        var myIcon = new BMap.Icon("/images/marker.png", new BMap.Size(34, 40));

                        $.each(points, function (i, point) {
                            var new_point = new BMap.Point(point[0], point[1]);
                            var marker2 = new BMap.Marker(new_point, {
                                icon: myIcon
                            });
                            oMap.addOverlay(marker2);
                        });

                    }
                }, 100);
            },
            renderGoogle: function ($dom, points) {
                var href = 'https://www.google.com/maps/place/Fred+%26+Farid+Group/@48.8753205,2.3372749,17z/data=!4m7!1m4!3m3!1s0x47e66e38be772a75:0x626c11bd6957ed59!2sFred+%26+Farid+Group!3b1!3m1!1s0x47e66e38be772a75:0x626c11bd6957ed59';
                var $link = $('<a target="_blank"></a>').attr('href', href);
                $link.append( $('<img/>').attr('src', '/images/google-map.jpg').width('100%') );
                $dom.append( $link );
                return;
                if (!window.google) return;

                var map = null;
                try{
                    map = new google.maps.Map($dom[0], {
                        center: new google.maps.LatLng(points[0][0], points[0][1]),
                        zoom: 2,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                } catch(e){}
                


                var styleArray = [{
                    featureType: "all",
                    stylers: [{
                        saturation: -80
                    }]
                }, {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [{
                        hue: "#4b3700"
                    }, {
                        saturation: 50
                    }]
                }, {
                    featureType: "all",
                    elementType: "labels.text.stroke",
                    stylers: [{
                        hue: "#4b3700"
                    }, {
                        saturation: 50
                    }]
                }];
                map.setOptions({
                    styles: styleArray
                });


                $.each(points, function (i, point) {
                    new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(point[0], point[1]),
                        icon: "/images/marker.png"
                    });
                });

                // var map = new google.maps.Map($dom[0],{
                //     center: new google.maps.LatLng(point[0],point[1]),
                //     zoom:5,
                //     mapTypeId:google.maps.MapTypeId.ROADMAP
                // });

                // new google.maps.Marker({
                //     map: map,
                //     position: new google.maps.LatLng(point[0],point[1])
                //   });
            }
        }
    })();

    function renderGoogleMap($dom, points) {
        if (!window.google) return;
        // point[0] = point[0] || 0;
        // point[1] = point[1] || 0;

        var map = new google.maps.Map($dom[0], {
            center: new google.maps.LatLng(0, 0), //new google.maps.LatLng(point[0],point[1]),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });


        var styleArray = [{
            featureType: "all",
            stylers: [{
                saturation: -80
            }]
        }, {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{
                hue: "#999"
            }, {
                saturation: 50
            }]
        }, {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{
                hue: "#999"
            }, {
                saturation: 50
            }]
        }];
        map.setOptions({
            styles: styleArray
        });

        $.each(points, function (i, point) {
            new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(point[0], point[1]),
                icon: "/images/marker.png"
            });
        });
    }


    function showCompains(loadpath, ver) {
        if (!compareVersion(loadpath, ver)) {
            return;
        }
        // set brands-items width
        $('.brands-con').stop(true, true).show();

        $('.sec_brands').show()
            .scrollTop(0)
            .css({
                top: $('.header').height()
            });

        $('.brands_tit').show().animate({
            height: 88
        }, 400);


        var nums = $('.brands-con>li .brands-mask').length;
        var index = 0;
        var loading_pics = {};


        var isLoading = false;
        var paths = [];
        $('.brands-con li').each(function () {
            paths.push(this.getAttribute('data-path'));
        });


        var loadCampaignDetails = function ($lis) {

            if (!compareVersion(loadpath, ver)) {
                return;
            }


            $lis = $lis.filter(function (i, li) {
                if (li.getAttribute('deal') || !li.getAttribute('start-loading')) {
                    return false;
                } else {
                    li.setAttribute('deal', 1);
                    return true;
                }
            });

            if (!$lis.length) return;

            // 获取每一个li对应的 图片列表
            var tpl = '<li data-a="brands-item" class="brands-item" data-path="#[path]" data-image="#[image]" data-movie="#[video]"><div class="brands-mask"></div><img src="#[picture]"></li>';
            $lis.each(function (i) {
                var path = this.getAttribute('data-path');
                var pics = [];
                var tHtml = [];
                path = path.replace(/\/\//,'/');
                if( path.indexOf( path.length - 1 ) !== '/' ){
                    path += '/';
                }
                $.each(campaignItemGroups[path] || [], function (i, item) {
                    var pic = campaignManager.getPath(item, 'picture');
                    pics.push(pic);
                    // render items
                    tHtml.push(LP.format(tpl, {
                        picture: pic,
                        image: !item.media || item.media.match(/\.jpg$/) ? 1 : '',
                        video: !item.media || item.media.match(/\.jpg$/) ? '' : 1,
                        path: item._contentPath + i
                    }));
                });
                var $li = $(this);
                $li.find('ul').html(tHtml.join(''))
                    .width(pics.length * CAMPAIGN_ACT_WIDTH)
                    .find('.brands-item')
                    .css('width', 0);

                // 每一个li去载入完图片后，做动画处理
                var $loadingBar = $li.find('.items-loading');
                loadImages(pics, function (i) {

                    if (!compareVersion(loadpath, ver)) {
                        return;
                    }

                    $li.attr('loading', 1);
                    var percent = (i + 1) / pics.length;
                    $loadingBar.stop(true).animate({
                        width: percent * 100 + '%'
                    }, 200);
                }, function () {
                    if (!compareVersion(loadpath, ver)) {
                        return;
                    }

                    $loadingBar.stop(true).animate({
                        width: 100 + '%'
                    }, 300, '', function () {
                        $loadingBar.fadeOut();
                    });
                    $li.attr('loading', 2);
                    campaignPicLoadSuccess($li);
                });

            });

            // var currentIndex = 0;
            // var timer = setInterval(function () {
            //     if (!compareVersion(loadpath, ver)) {
            //         clearInterval(timer);
            //         return;
            //     }
            //     $lis.each(function (i, li) {
            //         var $li = $(li);
            //         if (i == currentIndex && $li.attr('loading') == 2) {
            //             campaignPicLoadSuccess($li);
            //             currentIndex++;
            //         }
            //         if (currentIndex >= $lis.length) {
            //             clearInterval(timer);
            //         }
            //     });
            // }, 100);

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
        var campaignPicLoadSuccess = function ($li) {
            // show the mask
            $li.find('dt .brands-mask').show();
            $li.find('.brands-item')
                .each(function (i) {
                    // 只处理前10个
                    var i = Math.min(i, 10);
                    var $this = $(this);
                    $this.delay(i * 150)
                        .animate({
                            width: CAMPAIGN_ACT_WIDTH
                        }, 100, '', function () {
                            // fix images width and height
                            fixImageToWrap($this, $this.find('img'));
                        });

                    $this.find('.brands-mask')
                        .css({
                            display: 'block',
                            opacity: 0.2
                        })
                        .delay(i * 200)
                        .animate({
                            opacity: 0.5
                        }, 200);
                });
        }


        // bindscroll event
        var timeout = null;
        $('.sec_brands').unbind('scroll.loading-con')
            .bind('scroll.loading-con', function () {
                var stTop = $(this).scrollTop();
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    if (!compareVersion(loadpath, ver)) {
                        return;
                    }
                    // get viewable li
                    var $lis = $('.brands-con-li');
                    var itemHeight = $lis.height();
                    var winHeight = $(window).height();
                    var start = Math.max(0, Math.floor(stTop / itemHeight - 1));
                    var end = Math.floor((stTop + winHeight * 2) / itemHeight + 1);

                    $lis = $lis.slice(start, end).filter(':not(.done)');
                    $lis.addClass('done');
                    //console.log( $lis );
                    $lis.each(function (i) {
                        var $item = $(this);
                        campaignManager.getCampaignItems(this.getAttribute('data-path'), function( items ){
                            if( items && items[0] ){
                                campaignItemGroups[items[0]._contentPath] = items || [];
                                // $.each(items, function (i, item) {
                                //     campaignItemGroups[item._contentPath] = campaignItemGroups[item._contentPath] || [];
                                //     campaignItemGroups[item._contentPath].push(item);
                                // });

                                loadCampaignDetails($item);
                            }
                        });
                    });

                    
                }, 40);
            });

        // 需要载入所有的campaigns
        
        $('.brands-con-li').each(function (i) {
            $(this)
                .delay(200 * i)
                .animate({
                    marginLeft: 0,
                    opacity: 1
                }, 400, function () {
                    $(this).attr('start-loading', 1).removeClass('done');
                    $('.sec_brands').trigger('scroll.loading-con');
                });
        });
        var campaignItemGroups = {}
        // campaignManager.getCampaignItems(campaignPaths, function (items) {
        //     if (!compareVersion(loadpath, ver)) {
        //         return;
        //     }


        //     $.each(items, function (i, item) {
        //         campaignItemGroups[item._contentPath] = campaignItemGroups[item._contentPath] || [];
        //         campaignItemGroups[item._contentPath].push(item);
        //     });

        //     campaignItemGroups.ready = true;

        //     $('.sec_brands').trigger('scroll.loading-con');
        // });
    }

    function fixImageToWrap($wrap, $img) {
        $img.width('auto').height('auto');
        if (!$img.width()) {
            $img.load(function () {
                fixImageToWrap($wrap, $img);
            });
            return;
        }
        var ratio = $img.height() / $img.width();
        var w = $wrap.width();
        var h = $wrap.height();
        var vh = 0;
        var vw = 0;
        if (h / w > ratio) {
            vh = h;
            vw = vh / ratio;
        } else {
            vw = w;
            vh = vw * ratio;
        }

        $img.css({
            width: vw,
            height: vh,
            marginTop: (h - vh) / 2,
            marginLeft: (w - vw) / 2
        });
    }


    function renderVideo($wrap, movie, poster, config, cb) {
        var id = 'video-js-' + ($.guid++);
        $wrap.append(LP.format('<div class="video-wrap" style="z-index:-1;"><video id="#[id]" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"\
            preload="auto"\
              poster="#[poster]">\
             <source src="#[videoFile]" type="video/mp4" />\
             <source src="#[videoFile]" type="video/webm" />\
             <source src="#[videoFile]" type="video/ogg" />\
             <object class="vjs-flash-fallback" type="application/x-shockwave-flash" data="http://vjs.zencdn.net/c/video-js.swf">\
                 <param name="movie" value="http://vjs.zencdn.net/c/video-js.swf" />\
                 <param name="allowfullscreen" value="true" />\
                 <param name="flashvars" value=\'config={"playlist":["#[poster]", {"url": "#[videoFile]","autoPlay":false,"autoBuffering":true}]}\' />\
                 <img src="#[poster]" alt="Poster Image" title="No video playback capabilities." />\
             </object>\
        </video></div>', {
            id: id,
            videoFile: movie,
            poster: poster
        }));

        config = $.extend({
            "controls": false,
            "muted": false,
            "autoplay": false,
            "preload": "auto",
            "loop": true,
            "children": {
                "loadingSpinner": false
            }
        }, config || {});
        var ratio = config.ratio || 9 / 16;

        LP.use('video-js', function () {
            var is_playing = false;
            // videojs.options.techOrder = ['flash'];
            videojs.options.flash.swf = "/js/video-js/video-js.swf";
            var myVideo = videojs(id, config, function () {
                var v = this;
                if (config.resize !== false) {
                    var resizeFn = function () {
                        var w = $wrap.width();
                        var h = $wrap.height();
                        var vh = 0;
                        var vw = 0;
                        if (h / w > ratio) {
                            vh = h + 0;
                            vw = vh / ratio;
                        } else {
                            vw = w + 0;
                            vh = vw * ratio;
                        }
                        try {
                            v.dimensions(vw, vh);
                        } catch (e) {}
                        $('#' + v.Q).css({
                            "margin-top": (h - vh) / 2,
                            "margin-left": (w - vw) / 2
                        });
                        return false;
                    }
                    $(window).bind('resize.video' + id, resizeFn)
                        .trigger('resize.video' + id);

                    $wrap.bind('resize.video' + id, resizeFn);
                }
                setTimeout(function () {
                    $wrap.find('.video-wrap').css('z-index',1);
                    if (config.autoplay) {
                        try {
                            myVideo.play();
                        } catch (e) {}
                    } else if (config.pause_button) {
                        $wrap.find('.vjs-big-play-button').fadeIn();
                    }
                }, 200);

                // if need to add pause button
                $('<div class="vjs-mask"></div>').insertAfter($wrap.find('.vjs-poster'))
                    .click(function () {
                        if (is_playing) {
                            v.pause();
                        } else {
                            v.play();
                        }
                    });

                if (config.pause_button) {
                    if (!config.controls) {
                        $wrap.off('click.video-operation').on('click.video-operation', function () {
                            if (is_playing) {
                                v.pause();
                            } else {
                                v.play();
                            }
                        });
                    }
                    // add big pause btn
                    v.on('play', function () {
                        is_playing = true;
                        var $poster = $wrap.find('.vjs-poster');
                        $poster.show();
                        v.on('timeupdate', function () {
                            if (this.currentTime() > 0) {
                                $poster.remove();
                            }
                        });

                        $wrap.find('.vjs-big-play-button').hide();
                        var $pauseBtn = $wrap.find('.vjs-big-pause-button');
                        if (!$pauseBtn.length) {
                            $pauseBtn = $('<div class="vjs-big-pause-button"></div>').insertAfter($wrap.find('.vjs-big-play-button'))
                                .click(function () {
                                    v.pause();
                                });
                        }
                        $pauseBtn.show()
                            .delay(4000)
                            .fadeOut();
                    });

                    v.on('pause', function () {
                        is_playing = false;
                        $wrap.find('.vjs-big-pause-button').hide();
                        $wrap.find('.vjs-big-play-button').fadeIn();
                    });
                }

                if (config.showLoadingBar) {
                    var isWaiting = false;
                    var waitingTimeout = null;
                    v.on('waiting', function () {
                        waitingTimeout = setTimeout(function () {
                            isWaiting = true;
                            loadingMgr.show('waiting');
                        }, 1000);
                    });


                    window.preloadTimer = null;
                    var isShowLoading = false;
                    var currentTime = 0;
                    v.on('timeupdate', function () {
                        clearTimeout(preloadTimer);
                        clearTimeout(waitingTimeout);
                        // console.log( 'timeupdate' );
                        if (currentTime != this.currentTime()) {
                            currentTime = this.currentTime();
                            if (isWaiting) {
                                loadingMgr.success();
                                isWaiting = false;
                            }

                            preloadTimer = setTimeout(function () {
                                loadingMgr.show('preload');
                                isShowLoading = true;
                            }, 2000);

                            if (isShowLoading) {
                                isShowLoading = false;
                                loadingMgr.success();
                            }
                        }

                    });

                    v.on('pause', function () {
                        clearTimeout(preloadTimer);
                        clearTimeout(waitingTimeout);
                    });
                }


                $wrap.data('video-object', v);

                cb && cb.call(v, v);
            });
        });
    }


    var loadingMgr = (function () {
        var $loading = $('.loading-wrap');

        var mutiSuccess = {};
        var success = null;
        var pro = null;
        var timer = null;
        var loadingTimes = 0;
        return {
            showLoading: function ($wrap) {

                var $loading = $('<div class="loading-wrap" style="position: absolute;"><div class="loading" style="position:absolute;"></div></div>').appendTo($wrap)
                    .fadeIn();
                pro && pro.end();
                pro = process($loading.find('div'));


                // var $loading = $wrap.find('.loading');
                // clearInterval( $wrap.data('interval') );
                // var index = 0;
                // $wrap.data('interval' , setInterval(function(){
                //     $loading.css('background-position' , 'right ' +  positions[ ( index++ % positions.length ) ] + 'px' );
                // } , 1000 / 6 ) );
            },
            hideLoading: function ($wrap) {
                pro && pro.end();
                $wrap.find('.loading-wrap').fadeOut();
            },
            show: function (bgcolor) {

                //pro && pro.end();
                clearTimeout(timer);

                if( !pro ){
                    loadingTimes = 1;
                    $loading.find('.loading').width('100%');
                    pro = process($loading.stop(true, true).fadeIn().find('.loading'));
                    pro.start();
                } else {
                    loadingTimes++;
                }
                
                
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
            setSuccess: function (fn, key) {
                // console.log( 'setSuccess' );
                mutiSuccess[key] = fn;
                success = fn;
            },
            isLoading: function () {
                return !!$('.process:visible').length;
            },
            success: function () {
                var args = Array.prototype.slice.call(arguments);
                var key = args.shift();
                mutiSuccess[key] && mutiSuccess[key].apply('', args);
                success = null;
                loadingTimes--;
                loadingTimes = Math.max(0, loadingTimes);
                if( loadingTimes == 0 ){
                    loadingMgr.hide();
                }
            },
            abort: function () {
                mutiSuccess = {};
                loadingMgr.hide();

                loadingTimes = 0;
                success = null;
            },
            hide: function () {
                pro && pro.end();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    $loading.fadeOut();
                    pro = null;
                }, 800);

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
    var $gatesInnerL = $('.gates-inner-l').mousemove(function (ev) {
        var winHeight = $(window).height();
        if (ev.clientY < (winHeight - headerHeight) / 4 + headerHeight) {
            runedNum = (1 - (ev.clientY - headerHeight) * 4 / (winHeight - headerHeight)) * 15;
            if (!isAtTop) {
                isAtTop = true;
                gatesScrollTop = $gatesInnerL.scrollTop();
            }
        } else if (ev.clientY + (winHeight - headerHeight) / 4 > winHeight) {
            runedNum = (1 - (winHeight - ev.clientY) * 4 / (winHeight - headerHeight)) * 15;
            if (!isAtBottom) {
                isAtBottom = true;
                gatesScrollTop = $gatesInnerL.scrollTop();
            }
        } else {
            isAtTop = false;
            isAtBottom = false;
        }
    }).hover(function () {

    }, function () {
        isAtTop = false;
        isAtBottom = false;
    });

    var isAtLeft = false;
    var isAtRight = false;
    var $dd = null;
    var brandsNum = 0;
    var brandsScrollNum = 0;

    $('.brands-con').delegate('.brands-con-li dd', 'mousemove', function (ev) {
        $dd = $(this);
        var off = $dd.offset();
        var height = $dd.height();
        var width = $dd.width();
        brandsScrollNum = $dd.scrollLeft();
        if (ev.pageX - off.left < width / 4) {
            if (!isAtLeft) {
                isAtLeft = true;
            }
            brandsNum = (1 - (ev.pageX - off.left) * 4 / width) * 16;
        } else if (width + off.left - ev.pageX < width / 4) {
            brandsNum = (1 - (width + off.left - ev.pageX) * 4 / width) * 16;
            if (!isAtRight) {
                isAtRight = true;
            }
        } else {
            isAtLeft = false;
            isAtRight = false;
        }
    })
        .delegate('.brands-con-li', 'mouseleave', function () {
            isAtRight = false;
            isAtLeft = false;
        });


    setInterval(function () {
        if (isAtTop) {
            gatesScrollTop -= runedNum;
            $gatesInnerL.scrollTop(gatesScrollTop);
        } else if (isAtBottom) {
            gatesScrollTop += runedNum;
            $gatesInnerL.scrollTop(gatesScrollTop);
        }

        // fix brands_con
        if (isAtLeft) {
            brandsScrollNum -= brandsNum;
            $dd.scrollLeft(brandsScrollNum);
        } else if (isAtRight) {
            brandsScrollNum += brandsNum;
            $dd.scrollLeft(brandsScrollNum);
        }

    }, 1000 / 60);

    $('.gates-inner').click(function (ev) {
        var target = ev.target;
        if (target.tagName == 'LI') {
            urlManager.back();
            // hideCategory();
        }
    });

    //var sec_brands_stop = 0;
    var sec_brands_timer = null;
    $('.sec_brands').scroll(function () {
        //clearTimeout( sec_brands_timer );
        //sec_brands_timer = setTimeout(function(){
        if ($('.preview').is(':visible')) return false;
        if( !$('.header').hasClass('header-fixed') ){
            $('.header').addClass('header-fixed')
        }
        var headerHeight = $('.header-inner').height();
        var st = $('.sec_brands').scrollTop();
        if (st < headerHeight) {
            $('.sec_brands').css({
                top: headerHeight - st
            })
                .find('.brands-con,.brand_movie')
                .css({
                    marginTop: 88 + st
                });

            $('.brands_tit,.brand_item_tit')
                .css({
                    top: headerHeight - st
                });

            // // .find('.brands_tit')
            // // .css('margin-bottom' , st);
            // .find('.sec_brands_tit')
            // .css({
            //     'margin-top': st,
            //     position: 'relative',
            //     width: 'auto'
            // })
            // .next()
            // .css('margin-top', 0);

        } else {
            $('.sec_brands').css({
                top: 0
            }).find('.brands-con,.brand_movie')
                .css({
                    marginTop: 88 + headerHeight
                });

            $('.brands_tit,.brand_item_tit').css('top', 0);

            // .find('.sec_brands_tit')
            // .css({
            //     'margin-top': 0,
            //     position: 'fixed',
            //     width: '100%',
            //     top: 0
            // })
            // .next()
            // .css('margin-top', $('.sec_brands_tit').height() + headerHeight);
        }
        //} , 100 );
    });

    // $('.brands-con').delegate('.brands-con-li', 'mouseenter', function (ev) {

    //     // var $dom = $(ev.target).closest('li');
    //     // var index = $dom.index();
    //     // var all = $dom.parent().children().length;
    //     // var times = Math.max( all - index  , index + 1 );

    //     $(this).find('.brands-mask').stop(true, true).animate({
    //         opacity: 0
    //     }, 600);

    // })
    // .delegate('.brands-con-li', 'mouseleave', function () {
    //     $(this).find('.brands-mask').stop(true, true).animate({
    //         opacity: 0.7
    //     }, 600);
    // })
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
    // .delegate('.brands-item', 'mouseleave', function () {
    //     // stop the movie
    //     var $dom = $(this);
    //     if ($dom.data('video-object')) {
    //         $dom.data('video-object').pause();
    //         var videoObject = $dom.data('video-object');
    //         $dom.find('.video-wrap').fadeOut(function () {
    //             try {
    //                 videoObject.dispose();
    //                 $(this).remove();
    //             } catch (e) {}
    //         });
    //     }
    // });

    // init scroll event
    $('.gates-inner-l').scroll(function () {
        var st = $(this).scrollTop();
        var cHeight = 0;
        var $li = null;
        $(this).find('li').each(function () {
            cHeight += $(this).height();
            if (cHeight > st) {
                $li = $(this);
                return false;
            }
        });

        var letter = $.trim($li.text())[0];
        $('.gates-inner-c li').each(function () {

            if (letter.toUpperCase() == $.trim($(this).text().toUpperCase())) {
                $('.gates-inner-c a').removeClass('active');
                $(this).find('a').addClass('active');
                return false;
            }
        });
    });


    var banphoConTimer;
    var isInBanphoCon = false;
    // is playing just now
    // var isCurrentPlaying = false;
    var isHeadHide = false;

    var pageManager = (function () {
        var initSlider = function (cb, hideHeadBar) {
            var $slider = $('.home-slider');
            // init home slider
            // ============================
            var firstLoaded = false;
            var $sliderInner = $('.slider-block-inner').css('width', $('.slider-item').length + '00%');
            $sliderInner.data('index', 0);
            $sliderInner.data('cb', cb);

            $('.banpho-con p').html( $slider.find('.slider-item').eq(0).attr('title') );

            // hide left arrow
            $sliderInner.next().find('.banpho-bt-l').hide();
            $slider.find('.banpho-i').html('1/' + $('.slider-item').length);

            $(window).resize(function () {
                var winWidth = $(window).width();
                var winHeight = $(window).height();
                $('.slider-item').css('width', winWidth).show();


                // resize slider height
                $sliderInner.height(winHeight - 60 - 40);

                // resize the slider images
                $('<img />')
                    .load(function () {
                        var ratio = this.height / this.width;
                        var w = winWidth;
                        var h = winHeight;
                        var vh = 0;
                        var vw = 0;
                        if (h / w > ratio) {
                            vh = h + 40;
                            vw = vh / ratio;
                        } else {
                            vw = w + 40;
                            vh = vw * ratio;
                        }
                        $sliderInner.find('.slider-item>img').css({
                            width: vw,
                            height: vh,
                            marginTop: (h - vh) / 2,
                            marginLeft: (w - vw) / 2
                        });

                        if (!firstLoaded) {
                            firstLoaded = true;
                            $sliderInner.find('.slider-item').css('opacity', 1).hide().fadeIn(800);
                        }

                    })
                    .attr('src', $sliderInner.find('.slider-item>img').eq(0).attr('src'));
            })
                .trigger('resize');

            var $banphoCon = $('.banpho-con').hover(function () {
                clearTimeout(banphoConTimer);
                isInBanphoCon = true;
            }, function () {
                isInBanphoCon = false;
            });
            $banphoCon.css('margin-top', function () {
                var h = $(this).data('height'); //height();//$(this).find('.banpho-bt').height() + $(this).find('.banpho-tit').height();
                return (-h / 2) + 'px';
            });


            intMouseMoveEffect($slider, function (ev) {
                // if( $(ev.target).closest('.banpho-con').length ) return;
                // resize the videos

                var $inner = $('.slider-block-inner');
                var $item = $inner.children('.slider-item').eq($inner.data('index'));

                // if video is not playing
                var video = $item.data('video-object');
                if (!video || video.paused()) {
                    $banphoCon.stop(true, true).fadeIn();
                    $('.slide-tip').stop(true, true).fadeIn();
                    return;
                }

                $banphoCon.stop(true, true).fadeOut();
                $('.slide-tip').stop(true, true).fadeOut();

            }, function (ev) {
                $banphoCon.stop(true, true).fadeIn();
                $('.slide-tip').stop(true, true).fadeIn();
            });

            cb && cb(0);
        }

        var pageInits = {
            'home-page': function (cb) {
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

                // showcase nav hover effect
                $('.slide-tip .slide-cat-nav a').click(function () {
                    $(this).siblings().removeClass('cur');
                    $(this).addClass('cur');
                });
                // header fixed effect
                $(window).scroll(function () {
                    var stTop = $(window).scrollTop();
                    var winHeight = $(window).height();

                    // fix home slider
                    var mtop = Math.max(0, Math.min(stTop, (winHeight - headerHeight) / 2));
                    $slider.css({
                        marginTop: -mtop,
                        marginBottom: -mtop
                    });

                    // header fixed effect
                    // if (stTop >= $header.offset().top) {
                    //     $header.addClass('header-fixed');
                    // } else {
                    //     $header.removeClass('header-fixed');
                    // }
                    // homeCampaign animate
                    if ($('.cam_item').length && $('.cam_item').eq(0).offset().top < stTop + $(window).height()) {
                        $homeCampaign.data('animate', 1);
                        $homeCampaign.find('.cam_item')
                            .each(function (i) {
                                $(this).delay(i * 200)
                                    .animate({
                                        marginTop: 0
                                    }, 400, 'easeLightOutBack');
                            });
                        $('.home_cambtn').delay(4 * 200)
                            .animate({
                                bottom: 90
                            }, 400, 'easeLightOutBack');
                    }
                    // fix $homeBio background image
                    var all = $homeBioBg.height() - $homeBio.height();
                    var bgTop = stTop + winHeight - $homeBio.offset().top; // - headerHeight - stTop;
                    var per = bgTop / (winHeight + $homeBio.height());

                    var trans = 'translate(0px,' + (-per * all) + 'px)';
                    $homeBioBg.css({
                        'transform': trans,
                        'mozTransform': trans,
                        'msTransform': trans,
                        'webkitTransform': trans
                    });
                });


                // render home numbers
                api.request('extended/numbers', function (r) {
                    var obj = {};
                    $.each(r.items || [], function (i, item) {
                        obj[item.id] = item.number;

                    });

                    var tpl = $('#num-tpl').html();
                    // <td><strong class="intoview-effect" data-effect="number-rock">#[projects]</strong>PROJECTS</td>\
                    //     <td><strong class="intoview-effect" data-effect="number-rock">#[brands]</strong>BRANDS</td>\
                    //     <td><strong class="intoview-effect" data-effect="number-rock">#[press_articles]</strong>PRESS ARTICLES</td>\
                    //     <td><strong class="intoview-effect" data-effect="number-rock">#[services]</strong>SERVICES</td>\
                    //     <td><strong class="intoview-effect" data-effect="number-rock">#[awards]</strong>AWARDS</td>';
                    $('#home-num-tr').html(LP.format(tpl, obj));
                });

                // render weibo
                api.localRequest('/api/weibo/weibolist.php', function (r) {
                    var aHtml = [];
                    $.each(r.statuses || [], function (i, item) {
                        aHtml.push(LP.format('<div class="home_viewtxt">#[text]</div>', {
                            text: item.text
                        }));
                    });
                    $('#home_weibo_wrap').html(aHtml.join(''));
                    $('#home_weibo_follow').html(~~(r.userinfo.followers_count / 1000) + 'k');
                });

                // render twitter
                api.localRequest('/api/twitter/twitterlist.php', function (r) {
                    var aHtml = [];
                    $.each(r.status || [], function (i, item) {
                        aHtml.push(LP.format('<div class="home_viewtxt"><a href="https://twitter.com/engadget/status/#[url]" target="_blank">#[text]</a></div>', {
                            text: item.text,
                            url: item.id_str
                        }));
                    });
                    $('#home_twitter_wrap').html(aHtml.join(''));
                    $('#home_twitter_follow').html((r.user[0].followers_count / 1000) + 'k');
                });

                // render home page slider
                function homeAPICb (r) {
                    var aHtml = [];
                        items = (r.items || [] ).slice();

                    $.each(items || [], function (i, item) {
                        aHtml.push(LP.format('<div class="slider-item" title="#[title]" data-movie="#[video]"><img src="#[image]" /></div>', {
                            image: campaignManager.getPath(item, 'picture'),
                            video: campaignManager.getPath(item, 'video'),//i == 0 ? '/test.mp4' : '/test1.mp4', //
                            title: item.title || ''
                        }));
                    });

                    $('#slider-block-inner').html(aHtml.join(''));
                    initSlider();

                    fixImgsDomLoaded($($('#slider-block-inner img').slice(0, 3)), cb);
                }
                api.request('home', function (r) {
                    homeAPICb(r);
                });

                api.request('about/jobs', function (r) {
                    var paths = [];
                    $.each(r.items || [], function (i, jobPath) {
                        paths.push('about/jobs/' +  jobPath['path']);
                    });

                    api.request(paths, function (r) {
                        var first = [],
                            min, rnum = 3, items = [];
                        r.items || (r.items = []);

                        for (var i = 0; i < r.items.length; i++) {
                            var timestamp = Date.parse(r.items[i]['updated']);
                            if (min && timestamp > Date.parse(min['updated'])) {
                                continue;
                            }
                            min = r.items[i];
                            items.push(min);
                            min = null;

                            if (items.length > rnum - 1) {
                                break;
                            }
                        }

                        var tpl = '<div data-effect="fadeup" class="jobsitem intoview-effect" data-city="#[city]">\
                            <h3>#[title]</h3>\
                            <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                            <p class="jobs-con">#[show_content]</p>\
                            <strong class="jobs_more transition-wrap"  data-a="navitem" href="/jobs/#[id]/#[city]">\
                                <div class="transition">MORE <br><br> MORE</div>\
                            </strong>\
                            <div class="pop_jobcon_inner" style="display:none;">\
                                <div class="joblang"><a href="#" data-a="jobs-lang" data-lang="en"> EN </a> #[fr-lang] #[zho-lang] </div>\
                                <div class="jobcontent content_en">\
                                    <h3>#[title]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[show_content]</div>\
                                </div>\
                                <div class="jobcontent content_fr">\
                                    <h3>#[title_fr]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content_fr]</div>\
                                </div>\
                                <div class="jobcontent content_zho" style="display:none;">\
                                    <h3>#[title_zho]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content_zho]</div>\
                                </div>\
                            </div>\
                            <div class="sharecon" style="display:none;">\
                              <a target="_blank" href="http://service.weibo.com/share/share.php?title=#[share_content]&url=#[url]" class="jobshareitem jobshare_weibo"></a>\
                              <a target="_blank" href="http://www.facebook.com/sharer.php?u=#[url]&t=#[share_title]" class="jobshareitem jobshare_fb"></a>\
                              <a target="_blank" href="https://twitter.com/intent/tweet?url=#[url]&text=#[share_content]" class="jobshareitem jobshare_t"></a>\
                              <a target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=#[url]&title=#[share_title]&source=#[url]" class="jobshareitem jobshare_lin"></a>\
                            </div>\
                        </div>';

                        var aHtml = [];
                        $.each(items, function (i, item) {
                            item['fr-lang'] = item['content_fr'] ? '<a href="#" data-a="jobs-lang" data-lang="fr"> FR </a>' : '';
                            item['zho-lang'] = item['content_zho'] ? '<a href="#" data-a="jobs-lang" data-lang="zho"> 中文 </a>' : '';
                            item['url'] = encodeURIComponent( 'http://' + document.domain + '/jobs/' + item.id );
                            item['share_content'] = encodeURIComponent( item.content );
                            item['share_title'] = encodeURIComponent( item.title );
                            item['show_content'] = item['content'];
                            //item['show_content'] = lang == 'zho' ? item['content_zho'] : item['content'];
                            //console.log( item );
                            aHtml.push(LP.format(tpl, item));
                        });

                        $('.jobslist').html(aHtml.join(''));

                    });
                });

                LP.action('homeSlideType', function (data) {
                    api.request('home', function (res) {
                        var items = [];
                        $.each(res['items'], function (index) {
                           if  (res['items'][index]['reel'] == data['type']) {
                               items.push(res['items'][index]);
                           }
                        });
                        $("#slider-block-inner").css('margin-left', '0%');
                        $('a[data-a="home-slider-right"]').css('display', 'block');

                        //var el = $(event.target);
                        //var start =el.data('start') ? el.data('start') : (el.data('start', Math.round(Math.random() * 10)), el.data('start'));
                        //var end = el.data('end') ? el.data('end'): (el.data('end', Math.round(Math.random() * 12)), el.data('end'));
                        //if (start >= end ) {
                        //    end = 10;
                        //}
                        //items = res['items'].slice(start, start + end);
                        homeAPICb({items: items});
                    });
                });

                // render home page featured_campaigns
                // 完成:图片的加载,文字的替换
                // 未完成:图片的依次淡入效果,loadMore按钮的边界判断,点击div.cam_item后的跳转
                // issues: 第一张图片不对,原因是代码中Ajax返回的JSON对象与直接取get返回的JSON内容不一致
                //
                api.request('new_uploads', function (r) {
                    var tpl = '<div class="cam_item" data-d="path=#[path]&id=#[id]" data-a="home-cam-item">\
                            <div><img src="#[src]" /><div class="cover_cam_item transition"><p>#[label]</p></div></div>\
                        </div>';
                    var aHtml = [];
                    $.each(r.items || [], function (i, item) {
                        if( i > 8 ) return false;
                        var pic = campaignManager.getPath(item, 'preview');
                        var sp = item.fid_campaign.split('#');
                        aHtml.push(LP.format(tpl, {
                            src: pic,
                            path: 'categories/' + sp[0],
                            label: item.label,
                            id: sp[1]
                        }));
                    });

                    $('.home_camcon').html(aHtml.join(''));
                    $('.cover_cam_item').each(function(i,item) {
                        var p = $(this).find('p');
                        var w = p.width();
                        var h = p.height();
                        p.css({
                            'margin-top': -(h/2) + 'px',
                            'margin-left': -(w/2) + 'px'
                        });
                    });
                    $('.home_camcon').children().each(function (i) {
                        var $this = $(this);
                        // if (i <= 2) {
                            $this.find('img').load(function () {
                                fixImageToWrap($this.find('div'), $this.find('img'));
                            });
                        // } else {
                        //     $this.hide();
                        // }
                    });

                });

                // init down slider
                var positionY = 0;
                var $slideA = $('.slide-tip a');
//                setInterval(function(){
//                    $slideA.css({
//                        'background-position': '-23px ' + (++positionY) + 'px'
//                    });
//                }, 40);
                

                // init campaigns mouse move effect
                // $('.cam_item div').each(function(){
                //     initImageMouseMoveEffect( $(this) );
                // });
            },
            'awards-page': function (cb) {
                var awards = [];
                var old_awards = [];
                var old_awards_for_imgs = [];
                //var pics = [];
                var preload_imgs = [];

                api.request('extended/awards', function (r) {
                    awards = array_unique(r.items);
                    var a = {};
                    var b = [];
                    $.each(awards, function (i, item) {
                        a[item.id] = item;

                    });
                    $.each(a, function (i, item) {
                        if (item) {
                            b.push(item);
                        }
                        //preload_imgs.push(item.award_preview);
                    });
                    //$('#awards-number').text(b.length);
                    // preloading awards icons
                    api.request('awards', function (r) {
                        $.each(r.items, function (i, old_award) {
                            old_awards[i] = old_award.label;
                            old_awards_for_imgs[i] = old_award;
                        });
                        renderPage(awards);
                    });

                    function renderPage(awards) {
                        var years = [];
                        var brandHtml = [];
                        var awardHtml = [];
                        var yearHtml = [];
                        var brands = [];
                        var award_count = {};
                        var old_awards_uniq = array_unique(old_awards).sort();
                        // awards过滤器用旧返回:
                        $.each(old_awards_uniq, function (i, old_award) {
                            awardHtml.push('<option value="' + old_award + '">' + old_award + '</option>');
                        });

                        $.each(awards, function (i, award) {
                            brands.push(award.brand_title);
                            award_count[award.award_label] = award_count[award.award_label] || 0;
                            award_count[award.award_label]++;
                            var y = award['date'].replace(/^(\d{4}).*/, '$1');
                            if (y) {
                                years.push(y);
                            }
                        });
                        // brands过滤器:
                        var brands_options = array_unique(brands).sort();
                        $.each(brands_options, function (i, brands_option) {
                            brandHtml.push('<option value="' + brands_option + '">' + brands_option + '</option>');
                        });
                        // years
                        years = array_unique(years).sort();
                        $.each(years, function (i, year) {
                            yearHtml.push('<option value="' + year + '">' + year + '</option>');
                        });
                        $('#year').append(yearHtml.join(''));
                        $('#brand').append(brandHtml.join(''));
                        $('#award').append(awardHtml.join(''));

                        $('#awardfilter')
                            .data('campaigns', old_awards_for_imgs)
                            .data('brands', brands_options)
                            .data('awards', old_awards_for_imgs)
                            .data('all', awards);

                        //LP.triggerAction('awardfilter');
                        // init select
                        //initSelect($('select'));

                        // render awards
                        var awardsHtml = [];
                        $.each(old_awards_for_imgs, function (i, old_award_for_imgs) {
                            var num = award_count[old_award_for_imgs.label] || 0;
                            awardsHtml.push('<div class="award-image-num">' + '<p class="transition">' + num + '</p>' + '<img class="transition"' + 'data-num=\"' + num + '" src="' + campaignManager.getPath(old_award_for_imgs, 'preview', true) + '">' + '</div>');
                            preload_imgs.push(campaignManager.getPath(old_award_for_imgs, 'preview', true));
                        });

                        $('.awardicons').html(awardsHtml.join(''));
                        //$('.awardicons').on('hover', 'img' , function () {
                        //    var num = $(this).data('num');
                        //    $('.awardicons span').html(num);
                        //    effects['number-rock']($(this).closest('.award-image-num').find('p'), 0, null, 500);
                        //
                        //});

                        loadImages_2(preload_imgs.slice(0,8), function () {
                            cb && cb();
                        });
                    }
                });
            },
            'contact-page': function (cb) {
                // render twitter
                api.localRequest('/api/city/isChina.php', function (r) {
                    if (r == 1) {
                        mapHelper.renderBaidu($('#map'), [
                            [121.501577, 31.251566],
                            [-73.984867,40.7410476],
                            [2.338616000000002,48.875137]
                        ]);
                    } else {
                        mapHelper.renderGoogle($('#map'), [
                            [48.875137, 2.338616000000002],
                            [31.245583, 121.49472600000001],
                            [40.7410476,-73.984867]
                        ]);
                    }
                });


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

                api.request('about/contact/peoples', function (r) {
                    var items = [];

                    $.each(r.items, function (i, item) {
                        if (item.id == 4 || item.id == 5) {
                            return;
                        }
                        items.push(item);
                    });
                    //console.log('people: ',items)
                    $.each(items, function (i, item) {
                        var c = i == 0 ? 'contact_maill' : i == items.length - 1 ? 'contact_mailr' : 'contact_mailc';
                        aHtml.push('<span class="' + c + '">' + item.title + '</span>');
                        bHtml.push('<span class="' + c + '"><a href="mailto:' + item.content + '">' + item.content + '</a></span>');
                    });
                    $('#contact_mail').find('.contact_page_department')
                        .html(aHtml.join(''))
                        .next()
                        .html(bHtml.join(''));
                });
                var tpl = '<div class="#[leftORright]"> \
                                <h4 class="contact_title"> #[title] </h4> \
                                <p class="contact_txt contact_content">#[content]</p> \
                                <div class="cs-clear contact_citys"> \
                                  <div class="contact_wrap">\
									  <strong class="contact_city">#[city_1]</strong> \
									  <div class="contact_ad contact_address_1"> \
										<p class="contact_address_p">#[contact_address_1]</p> \
									  </div> \
                                  </div>\
                                  <div class="contact_wrap">\
									  <strong class="contact_city">#[city_2]</strong> \
									  <div class="contact_ad contact_address_2"> \
										<p class="contact_address_p">#[contact_address_2]</p> \
									  </div> \
                                  </div>\
                                  <div class="contact_wrap">\
									  <strong class="contact_city">#[city_3]</strong> \
									  <div class="contact_ad contact_address_3"> \
										<p class="contact_address_p">#[contact_address_3]</p> \
									  </div> \
                                  </div>\
                                  <div class="contact_wrap">\
									  <strong class="contact_city">#[city_4]</strong> \
									  <div class="contact_ad contact_address_4"> \
										<p class="contact_address_p">#[contact_address_4]</p> \
									  </div> \
                                  </div>\
                                </div> \
                              </div> \
                            ';
                var cHtml = [];
                api.request('about/contact/entities', function (r) {
                    var entities = [];
                    var departments = {};
                    $.each(r.items, function (i, item) {
                        entities.push(item);
                    });
                    //console.log('entities: ',entities)
                    $.each(entities, function (i, entity) {
                        if (!departments[entity.department]) {
                            departments[entity.department] = [];
                        }
                        departments[entity.department][entity.order] = entity;
                    });

                    Object.getOwnPropertyNames(departments).forEach(function(val, idx, array) {
                        //console.log(val + ' -> ' + departments[val]);
                        var value = val.replace(/\+/g,' ');
                        cHtml.push('<h3 data-effect="fadeup" class="intoview-effect contact_page_department">');
                        cHtml.push(value);
                        cHtml.push('</h3>');
                        cHtml.push('<div data-effect="fadeup" class="intoview-effect contact_con cs-clear">');

                        var num = 0;
                        var isOdd;

                        $.each(departments[val],function(i,item) {
                            if (item) {
                                num++;
                                cHtml.push(LP.format(tpl, {
                                    leftORright: num % 2 ? 'contact_conl' : 'contact_conr',
                                    department: item.department,
                                    title: item.title,
                                    content: item.content.split('\n').join('<br/>'),
                                    city_1: item.city_1 || '',
                                    city_2: item.city_2 || '',
                                    city_3: item.city_3 || '',
									city_4: item.city_4 || '',
                                    contact_address_1: item.address_1 || '',
                                    contact_address_2: item.address_2 || '',
                                    contact_address_3: item.address_3 || '',
									contact_address_4: item.address_4 || ''
                                }));
                                if(!(num % 2)) {
                                    cHtml.push('<div class="cs-clear"></div>');
                                }
                            }
                        });
                        cHtml.push('</div>');
                    });
                    //console.log('cHtml: ',cHtml);
                    $('#contact_item').html(cHtml.join(''));
                    // fix style:
                    $(window).resize(function() {
                        $('.contact_con').each(function(i,con) {
                            var $con = $(this);
                            var Height_contact_content_arr = [];
                            var Height_contact_citys_arr = [];
                            var Height_contact_citys_arr_1 = [];

                            $con.find('.contact_content').each(function(i,el) {
                                Height_contact_content_arr.push($(el).height());
                            });
                            $con.find('.contact_ad').each(function(i,el) {
                                Height_contact_citys_arr.push($(el).height());
                            });
                            $con.find('.contact_address_3').each(function(i,el) {
                                Height_contact_citys_arr_1.push($(el).height());
                            });

                            var maxHeight_contact_content = Math.max.apply(null, Height_contact_content_arr);
                            var maxHeight_contact_citys = Math.max.apply(null, Height_contact_citys_arr);
                            var maxHeight_contact_citys_1 = Math.max.apply(null, Height_contact_citys_arr_1);

                            //console.log('max height: ',maxHeight_contact_content);
                            $con.find('.contact_content').each(function(i,el) {
                                $(el).height(maxHeight_contact_content);
                            });
                            $con.find('.contact_ad').each(function(i,el) {
                                $(el).height(maxHeight_contact_citys);
                            });
                            $con.find('.contact_address_3').each(function(i,el) {
                                $(el).height(maxHeight_contact_citys_1);
                            });
                        });
                        $('.contact_address_p').each(function(i,item) {
                            if ($(item).html() == '') {
                                $(item).closest('.contact_ad').add($(item).closest('.contact_ad').prev('strong.contact_city')).remove();
                            }
                        });
                        ///////// Footer /////////

                        var heights_p1 = [];
                        $('.ft-addr-p-1').each(function(i,p) {
                            heights_p1.push($(p).height());
                        });
                        var p1_max = Math.max.apply(null, heights_p1);
                        $('.ft-addr-p-1').each(function(i,p) {
                            $(p).height(p1_max);
                        });

                        var heights_p2 = [];
                        $('.ft-addr-p-2').each(function(i,p) {
                            heights_p2.push($(p).height());
                        });
                        var p2_max = Math.max.apply(null, heights_p2);
                        $('.ft-addr-p-2').each(function(i,p) {
                            $(p).height(p2_max);
                        });

                        var heights_p3 = [];
                        $('.ft-addr-p-3').each(function(i,p) {
                            heights_p3.push($(p).height());
                        });
                        var p3_max = Math.max.apply(null, heights_p3);
                        $('.ft-addr-p-3').each(function(i,p) {
                            $(p).height(p3_max);
                        });

                        var heights_p4 = [];
                        $('.ft-addr-p-4').each(function(i,p) {
                            heights_p4.push($(p).height());
                        });
                        var p4_max = Math.max.apply(null, heights_p4);
                        $('.ft-addr-p-4').each(function(i,p) {
                            $(p).height(p4_max);
                        });

                    }).trigger('resize');

                    cb && cb();
                });
            },
            'interview-page': function (cb) {
                // preload js conponent
                // LP.use(['video-js', '../plugin/jquery.jplayer.min.js']);
                // LP.use(['wavesurfer']);

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
                    <div class="interview_img hold-audio-url"  data-a="show-music-interview" data-media="#[media]">\
                        <img src="#[preview]">\
                    </div>\
                    <span class="interview_opt" data-a="show-music-interview" data-media="#[media]">\
                        <div class="transition">#[text]</div>\
                    </span>\
                </div>';
                // get audio and video
                api.request(['about/interviews/radio', 'about/interviews/tv'], function (r) {
                    var aHtml = [];
                    var images = [];
                    var audio_images_num = 0,
                        video_images_num = 0;

                    var listen_txt,
                        watch_txt,
                        close_txt;
                    if($('body').hasClass('lang-zho')) {
                        listen_txt = '收听';
                        watch_txt = '观看';
                        close_txt = '关闭';
                    } else if($('body').hasClass('lang-fr')) {
                        listen_txt = 'LISTEN';
                        watch_txt = 'WATCH';
                        close_txt = 'CLOSE';
                    } else {
                        listen_txt = 'LISTEN';
                        watch_txt = 'WATCH';
                        close_txt = 'CLOSE';
                    }

                    // sort by time
                    var objs = {};
                    var dates = [];
                    $.each( r.items, function(i, item){

                        if( !objs[ item['date'] ] ){
                            dates.push( item.date );
                        }

                        objs[ item['date'] ] = objs[ item['date'] ] || [];
                        objs[ item['date'] ].push( item );
                    } );
                    dates = dates.sort().reverse();

                    var result = [];
                    $.each( dates, function(i, date){
                        result = result.concat( objs[date] );
                    } );

                    console.log( objs );

                    console.log( result );


                    $.each(result, function (i, item) {
                        var media = campaignManager.getPath(item, 'media');
                        var tpl = !media.match(/.mp3$/) ? tvTpl : radioTpl;
                        var titles = item.title.split('|');
                        aHtml.push(LP.format(tpl, {
                            oddoreven: i % 2 ? 'even' : 'odd',
                            text: !media.match(/.mp3$/) ? (watch_txt + '<br/>' + close_txt) : (listen_txt + '<br/>' + close_txt),
                            title: titles[0],
                            content: titles.slice(1).join('<br/>'),
                            preview: campaignManager.getPath(item, 'picture_2'),
                            media: media
                        }));

                        if (!media.match(/.mp3$/)) {
                            if (video_images_num++ <= 5) {
                                images.push(campaignManager.getPath(item, 'picture_2'));
                            }
                        } else {
                            if (audio_images_num++ <= 5) {
                                images.push(campaignManager.getPath(item, 'picture_2'));
                            }
                        }
                    });
                    loadImages_2(images, function () {
                        loadImages($('#press-container img'), null, function () {
                            $('#press-container img').each(function () {
                                fixImageToWrap($(this).parent(), $(this));
                            });
                        });
                        cb && cb();
                    });
                    $('#press-container').html(aHtml.join(''));
                });
            },
            'press-page': function (cb) {

                var match = location.href.match(/\/press\/(\d+)\/(\d+)$/);

                var $doms = $('[data-year]').slice(0,2);
                if( match ){
                    // console.log( $('[data-year="' + match[1] + '"]') );
                    $doms = $doms.add( $('[data-year="' + match[1] + '"]') );
                }

                var loadIndex = 0;
                $doms.each(function(){
                        effects['press-loading']( $(this) , 0 , function(){
                            if( ++loadIndex == $doms.length ){
                                var imgs = [];
                                $('.cover_img').slice(0,20).each(function(){
                                    imgs.push( this.getAttribute('src') );
                                });

                                if( match ){
                                    $('[data-path="' + match[1] + '/' + match[2] + '"]').click();
                                }

                                loadImages( imgs, null, cb );
                            }
                        } );
                    });

                api.request('extended/numbers', function (r) {
                    var obj = {};
                    $.each(r.items || [], function (i, item) {
                        obj[item.id] = item.number;

                    });

                    $('#press-num').html( obj.press_articles )
                });

                // var preview_imgs = [];
                // var $year_dom = $('div.press_list.column.cs-clear.intoview-effect').slice(0, 2);
                // var year_arr = [];

                // $year_dom.each(function (i, el) {
                //     year_arr.push($(el).data('year'));
                // });


                // year_arr.length && $.each(year_arr, function (i, year) {
                //     api.request('about/press_articles/' + year, function (r) {
                //         if (!r.items.length) {
                //             return;
                //         }
                //         $.each(r.items, function (i, item) {
                //             if ( i < 10 ) {
                //                 preview_imgs.push(campaignManager.getPath(item, 'preview'));
                //             }
                //         });


                //                 if (preview_imgs.length > 8) {
                //                     loadImages_2(preview_imgs, function () {
                //                         cb && cb();
                //                     });
                //                     return false;
                //                 }
                //             } else {
                //                 return false;
                //             }
                //         });
                //     });
                // });


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
                // cb && cb();
            },
            'jobs-page': function (cb) {
                api.request('about/jobs', function (r) {
                    var contentPaths = [];
                    $.each(r.items, function (i, item) {
                        contentPaths.push('about/jobs/' + item.path);
                    });


                    var tpl = '<div data-effect="fadeup" class="jobsitem intoview-effect" data-city="#[city]">\
                            <h3>#[title]</h3>\
                            <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                            <p class="jobs-con">#[show_content]</p>\
                            <strong class="jobs_more transition-wrap"  data-a="jobs-more" data-path="/jobs/#[id]/#[city]" data-d="contact=#[contact]">\
                                <div class="transition">MORE <br><br> MORE</div>\
                            </strong>\
                            <div class="pop_jobcon_inner" style="display:none;">\
                                <div class="joblang"><a href="#" data-a="jobs-lang" data-lang="en"> EN </a> #[fr-lang] #[zho-lang] </div>\
                                <div class="jobcontent content_en">\
                                    <h3>#[title]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[show_content]</div>\
                                </div>\
                                <div class="jobcontent content_fr">\
                                    <h3>#[title_fr]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content_fr]</div>\
                                </div>\
                                <div class="jobcontent content_zho" style="display:none;">\
                                    <h3>#[title_zho]</h3>\
                                    <h4>#[agency]<br>#[city]<br>#[contract]</h4>\
                                    <div class="pop_jobtxt">#[content_zho]</div>\
                                </div>\
                            </div>\
                            <div class="sharecon" style="display:none;">\
                              <a target="_blank" href="http://service.weibo.com/share/share.php?title=#[share_content]&url=#[url]" class="jobshareitem jobshare_weibo"></a>\
                              <a target="_blank" href="http://www.facebook.com/sharer.php?u=#[url]&t=#[share_title]" class="jobshareitem jobshare_fb"></a>\
                              <a target="_blank" href="https://twitter.com/intent/tweet?url=#[url]&text=#[share_content]" class="jobshareitem jobshare_t"></a>\
                              <a target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=#[url]&title=#[share_title]&source=#[url]" class="jobshareitem jobshare_lin"></a>\
                            </div>\
                        </div>';
                    // <a href="mailto:#[contact]" class="jobs_more transition-wrap">\
                    //             <div class="transition">APPLY <br><br> APPLY</div>\
                    //         </a>\
                    var aHtml = [];
                    api.request(contentPaths, function (r) {
                        $.each(r.items, function (i, item) {
                            item['fr-lang'] = item['content_fr'] ? '<a href="#" data-a="jobs-lang" data-lang="fr"> FR </a>' : '';
                            item['zho-lang'] = item['content_zho'] ? '<a href="#" data-a="jobs-lang" data-lang="zho"> 中文 </a>' : '';
                            item['url'] = encodeURIComponent( 'http://' + document.domain + '/jobs/' + item.id );
                            item['share_content'] = encodeURIComponent( item.content );
                            item['share_title'] = encodeURIComponent( item.title );
                            item['show_content'] = item['content'];
                            //item['show_content'] = lang == 'zho' ? item['content_zho'] : item['content'];
                            //console.log( item );
                            aHtml.push(LP.format(tpl, item));
                        });

                        $('.jobslist').html(aHtml.join(''));

                        $('.pop_jobcon_inner').each(function(i,el) {
                            var $self = $(this);
                            $self.find('.jobcontent').each(function(i,el) {
                                if($(el).text() == '') {
                                    var id = $(el).prop('class').split(' ')[1].split('_')[1];
                                    //console.log('id: ',id);
                                    $self.find('a').each(function(i,a) {
                                        //console.log($(a).data('lang'));
                                        if($(a).data('lang') == id) {
                                            //console.log(a);
                                            $(a).hide();
                                        }
                                    });
                                }
                            });
                        });

                        var match = location.href.match(/(\/jobs\/\d+\/\w+)/);
                        if( match ){
                            $('.jobs_more[data-path="' + match[1] + '"]').click();
                        }

                        $(window).on('resize',function() {
                            var heights_h4 = [];
                            $('.jobsitem h4').each(function(i,h) {
                                heights_h4.push($(h).height());
                            });
                            var h4_max = Math.max.apply(null, heights_h4);
                            $('.jobsitem h4').each(function(i,h) {
                                $(h).height(h4_max);
                            });
                        }).trigger('resize');

                        cb && cb();
                    });
                });
            },
            'bio-page': function (cb) {
                var aHtml = [];
                var tpl = '';
                api.request('about/f_f_bio', function (r) {
                    $('#download').attr('href', campaignManager.getPath(r.items[0], 'file'));
                    //cb && cb();
                });

                !!(function () {
                    var aHtml = [];
                    var tpl = '<div class="slider-item" data-movie="#[movie]"><img src="#[image]"></div>';
                    var images = [];

                    function resize_slide_img(img) {
                        var $img = $(img);
                        if ($img) {
                            var ratio = $img[0].width / $img[0].height;
                            var w = $(window).width();
                            var h = $(window).height() - $('.header').height() - $('.pagetit').height();
                            var img_w = 0;
                            var img_h = 0;
                            if (w / h > ratio) {
                                img_h = h;
                                img_w = img_h * ratio;
                            } else {
                                img_w = w;
                                img_h = img_w / ratio;
                            }
                            $img.css({
                                width: img_w,
                                height: img_h,
                                marginLeft: -Math.abs((w - img_w) / 2),
                                marginTop: -Math.abs((h - img_h) / 2)
                            });
                            $img.data({
                                'width': img_w,
                                'height': img_h,
                                'marginLeft': -Math.abs((w - img_w) / 2),
                                'marginTop': -Math.abs((h - img_h) / 2)
                            });
                        }
                    }

                    api.request('about/f_f_personal_showreel', function (r) {
                        var firstImg = null;
                        $.each(r.items, function (i, item) {
                            aHtml.push(LP.format(tpl, {
                                image: campaignManager.getPath(item, 'preview'),
                                movie: campaignManager.getPath(item, 'video')
                            }));
                            images.push(campaignManager.getPath(item, 'preview'));
                        });

                        $.each(images, function (i, url) {
                            var $img = $('<img>');
                            $img.load(function () {
                                resize_slide_img($img);
                            }).error(function () {

                            }).prop('src', url);

                        });
                        loadImages_2(images.slice(0, 5), function () {
                            initSlider(function (index) {

                                var item = r.items[index];
                                $('.showreel-tit').html(LP.format('<h3>#[brand]</h3><p>#[campaign]</p><p>#[year]</p></div>', {
                                    brand: item.brand,
                                    campaign: item.campaign,
                                    year: item.date_and_price.split('-')[0]
                                }));
                                $('.slider-block-inner').find('.slider-item >img').each(function (i, img) {
                                    fixImageToWrap($(this).closest('.slider-item'), $(this));
                                });
                            });
                            firstImg = $('.slider-block-inner').find('.slider-item >img').eq(0);
                            cb && cb();
                        });
                        $('#slider-block-inner').html(aHtml.join(''));
                        //hide others
                        $('.banpho-bt a').css('visibility','hidden');
                        $('.banpho-i').css('visibility','hidden');
                        $('.showreel-tit').css('visibility','hidden');

                        $(window).resize(function () {
                            $('#slider-block-inner, .home-slider').css('height', ($(window).height() - $('.header').height() - $('.pagetit').height()) + 'px');
                        }).trigger('resize');
                    });
                })();

            },
            'ffshowreel-page': function (cb) {
                var aHtml = [];
                var tpl = '<div class="slider-item" data-movie="#[movie]"><img src="#[image]"></div>';

                // ( item , type )function( item , type ){
                //     return LP.format( 'http://www.fredfarid.com/eng/file/pages_contents/about/f_f_personal_showreel/#[type]/#[name]' , {
                //         type: type,
                //         name: item[ type ]
                //     });
                // }

                var images = [];
                api.request('about/f_f_personal_showreel', function (r) {
                    $.each(r.items, function (i, item) {
                        aHtml.push(LP.format(tpl, {
                            image: campaignManager.getPath(item, 'preview'),
                            movie: campaignManager.getPath(item, 'video')
                        }));

                        images.push(campaignManager.getPath(item, 'preview'));
                    });

                    $('#slider-block-inner').html(aHtml.join(''))
                    // .children()
                    // .eq(0).css('opacity' , 1).fadeIn();

                    initSlider(function (index) {
                        var item = r.items[index];
                        $('.showreel-tit').html(LP.format('<h3>#[brand]</h3><p>#[campaign]</p><p>#[year]</p></div>', {
                            brand: item.brand,
                            campaign: item.campaign,
                            year: item.date_and_price.split('-')[0]
                        }));
                        $('.slider-block-inner').find('.slider-item >img').each(function (i, img) {
                            fixImageToWrap($(this).closest('.slider-item'), $(this));
                        });
                    });
                    $(window).resize(function () {
                        var winWidth = $(window).width();
                        var winHeight = $(window).height();
                        var $sliderInner = $('.slider-block-inner');
                        var _height=$(window).height() - $('.header').height();
                        $('#slider-block-inner').css('height', _height);
                        // resize the slider images
                        $('<img />')
                            .load(function () {
                                var ratio = this.height / this.width;
                                var w = winWidth;
                                var h = winHeight;
                                var vh = 0;
                                var vw = 0;
                                if (h / w > ratio) {
                                    vh = h + 40;
                                    vw = vh / ratio;
                                } else {
                                    vw = w + 40;
                                    vh = vw * ratio;
                                }
                                $sliderInner.find('.slider-item>img').css({
                                    width: vw,
                                    height: vh,
                                    marginTop: (h - vh) / 2,
                                    marginLeft: (w - vw) / 2
                                });

                                //if( !firstLoaded ){
                                //    firstLoaded = true;
                                //    $sliderInner.find('.slider-item').css('opacity' , 1).hide().fadeIn();
                                //}

                            })
                            .attr('src', $sliderInner.find('.slider-item>img').eq(0).attr('src'));
                    }).trigger('resize');
                    loadImages(images.slice(0, 3), null, function () {
                        cb && cb();
                    });
                });
            },
            'services-page': function (cb) {

                var tpl = '';

                api.request('nav_services', function (r) {
                    var htpl = '<p class="s_bigTitle">#[total] Services to serve you the best</p>';
                    var stpl = '<li> \
                        <p class="s_busP1 s_f14 s_fb">#[index]/#[total]</p> \
                    <h2 class="s_busH2 s_f24 s_fb">#[title]</h2> \
                    <p class="s_busP2 s_f14">#[content]</p> \
                    </li>';

                    var htmls = [],
                        total = (r.items || []).length;
                    $.each(r.items || [], function (i, service) {
                        /*temp modify，去除creative关键词*/
                        var title=service['title'];
                        if(title&&title.length>9){
                            title=title.substring(9);
                        }else{
                            title='';
                        }
                        htmls.push(LP.format(stpl, {
                            total: total,
                            index: i + 1,
                            title: title,
                            content: service['description']
                        }));
                    });

                    $('.banpho').after(LP.format(htpl, {total: total}));

                    $('.s_business').append(htmls.join(''));
                    cb && cb();
                });

            },
            'people-page': function (cb) {
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
                api.request('about/key_people', function (r) {
                    var aHtml = [];
                    $.each(r.items || [], function (i, people) {
                        aHtml.push(LP.format(tpl, {
                            img: campaignManager.getPath(people, 'background', true),
                            file: campaignManager.getPath(people, 'file'),
                            content: people.content.replace(/\n/g, '<p/><p>'),
                            'class': !(i % 2) ? 'people_odd' : 'people_even',
                            title: people.title,
                            city: people.city
                        }));
                    });

                    $('#people-wrap').html(aHtml.join(''));

                    cb && cb();
                });
            }
        }


        var effects = {
            'fadeup': function ($dom, index, cb) {
                var marginTop = parseInt($dom.css('marginTop')) || 0;

                $dom
                    .css('marginTop', marginTop + 100)
                    .delay(150 * index)
                    .animate({
                        opacity: 1,
                        marginTop: marginTop
                    }, 500)
                    .promise()
                    .then(function () {
                        cb && cb();
                    });
            },
            'number-rock': function ($dom, index, cb, du) {
                // init humbers
                var num = $dom.text() || '';
                if( !num ) return;
                //console.log( num );
                var $span = $('<span>' + num + '</span>').appendTo($dom.html('').data('num', num));
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

                $.each(num.split(''), function (i, n) {
                    var str = '1234567890';
                    var className = 'num';
                    if( n == '+' ){
                        str = '!@#$%^&*-+';
                        className = 'sign';
                    }

                    $('<div>' + str.split('').join('<br/>') + '</div>').addClass(className).appendTo($span)
                        .css({
                            position: 'absolute',
                            left: i * width / num.length,
                            top: -~~(Math.random() * 10) * height,
                            width: width / num.length
                        });
                });

                // run the animate
                var spanHeight = height; //$dom.find('span').height();

                var st = new Date();
                var duration = du || 600;
                var $divs = $span.find('div');
                var interval = setInterval(function () {

                    if (new Date - st >= duration) {
                        var num = $dom.data('num') || '';
                        var nums = num.split('');
                        $divs.each(function (i) {
                            var top = -(nums[i] - 1) * spanHeight;
                            
                            if (nums[i] == 0 || nums[i] == '+') {
                                top = -9 * spanHeight
                            }
                            $(this).animate({
                                'top': top
                            }, 800, 'easeOutQuart', function () {
                                if (i == nums.length - 1) {
                                    $dom.html( num );
                                    cb && cb();
                                }
                            });
                        });
                        clearInterval(interval);
                        return false;
                    }
                    $divs.each(function () {
                        $(this).css('top', -(Math.random() * 10) * spanHeight);
                    });
                }, 1000 / 15);
            },
            'press-loading': function ($dom, index, cb) {
                if( $dom.data('loaded') ){
                    cb && cb();
                    return false;
                }

                var callbacks = [ cb ];
                if( $dom.data('loading') ){
                    callbacks = $dom.data('callbacks') || [];
                    callbacks.push( cb );
                }
                $dom.data('loading', true);
                $dom.data('callbacks', callbacks);

                //var tpl = '<div class="press_item" data-path="#[year]/#[id]">\
                //    <div class="press_img" data-a="press_img" data-path="#[year]/#[id]">\
                //        <img class="cover_img" data-cover="#[cover]" src="#[preview]" />\
                //        <img src="../images/press_demopho1.jpg" />\
                //        <img class="press_top_right transition" src="../images/press_top_right.png">\
                //        <img class="press_bottom_left transition" src="../images/press_bottom_left.png">\
                //    </div>\
                //    <h3>#[title]</h3>\
                //    <p class="press_itemtxt"><strong>#[title]</strong>#[content]</p>\
                //    <div class="cs-clear">\
                //        <strong class="press_itempage">#[index]/<span class="press_all">#[total]</span></strong>\
                //        <a class="press_itemdown transition" target="_blank" href="#[attached_file]"></a>\
                //    </div>\
                //</div>';
                var tpl = '<div class="press_item" data-path="#[year]/#[id]">\
                    <div class="press_img" data-a="press_img" data-path="#[year]/#[id]">\
                        <img class="cover_img" data-path="/press/#[year]/#[id]" data-cover="#[cover]" src="#[preview]" />\
                        <img src="/images/press_demopho1.jpg" />\
                        <div class="press_folding_corner"></div>\
                    </div>\
                    <h3>#[title]</h3>\
                    <p class="press_itemtxt"><strong>#[title]</strong>#[content]</p>\
                    <div class="cs-clear">\
                        <strong class="press_itempage">#[index]/<span class="press_all">#[total]</span></strong>\
                        <a class="press_itemdown transition" target="_blank" href="#[attached_file]"></a>\
                    </div>\
                </div>';

                //$('body').on('mouseleave','.press_img',function() {
                //    $(this).addClass('js-mouseout');
                //});
                //$('body').on('mouseenter','.press_img',function() {
                //    $(this).removeClass('js-mouseout');
                //});
                // function( item , type ){
                //     var year = item.date.split('-')[0];
                //     return LP.format( 'http://www.fredfarid.com/eng/file/pages_contents/about/press_articles/#[year]/#[type]/#[name]' , {
                //         year: year,
                //         type: type ,
                //         name: item[type]
                //     });
                // }
                api.request('about/press_articles/' + $dom.data('year'), function (r) {
                    var aHtml = [];
                    $.each(r.items, function (i, item) {
                        aHtml.push(LP.format(tpl, {
                            year: item.date.split('-')[0],
                            title: item.title,
                            content: item.content,
                            id: item.id,
                            cover: campaignManager.getPath(item, 'picture_2'),
                            preview: campaignManager.getPath(item, 'preview'),
                            index: i + 1,
                            total: r.items.length,
                            attached_file: campaignManager.getPath(item, 'attached_file')
                        }));
                    });

                    $dom.html(aHtml.join(''));
                    $dom.data('loaded', true);

                    $.each(callbacks, function( i, cb ){
                        cb && cb();
                    });
                });
            }
        }

        var isFirstLoading = true;
        return {
            go: function (url, type) {
                if( !needAjax ){
                    // window.location.hash = url;
                    window.location.href = url;
                } else {
                    History.pushState({
                        prev: location.href,
                        type: type
                    }, undefined, url);
                }
            },
            init: function (cb) {
                if ($('html').hasClass('canvas')) {
                    // LP.use(['logo'],function() {
                    //     var reloadLogo = function() {
                    //         var canvas, stage, exportRoot;
                    //         canvas = document.getElementById("ff_logo_canvas");
                    //         exportRoot = new lib._2();

                    //         stage = new createjs.Stage(canvas);
                    //         stage.addChild(exportRoot);
                    //         stage.update();
                    //         stage.enableMouseOver();

                    //         createjs.Ticker.setFPS(lib.properties.fps);
                    //         createjs.Ticker.addEventListener("tick", stage);
                    //     }
                    //     reloadLogo();
                    // });
                    LP.use(['loading_logo'],function() {
                        var loading_logo = function () {
                            var canvas, stage, exportRoot;
                            canvas = document.getElementById("ff_loading_logo_canvas");
                            exportRoot = new lib.white();

                            stage = new createjs.Stage(canvas);
                            stage.addChild(exportRoot);
                            stage.update();
                            stage.enableMouseOver();

                            createjs.Ticker.setFPS(lib.properties.fps);
                            createjs.Ticker.addEventListener("tick", stage);
                        }
                        loading_logo();
                    });
                }
                // var random_num = null;
                // if (window.banft_txt_length) {
                //     random_num = window.banft_txt_length;
                // } else {
                //     random_num = 3;
                // }
                // random_num = Math.floor((Math.random() * random_num));

                // $('.banft_txt').css({
                //     marginLeft: -(random_num) * 100 + '%'
                // });

                //var index = 0 ;
                //if (window.quote_timer) {
                //    window.clearInterval(quote_timer);
                //}
                //window.quote_timer = setInterval(function(){
                //    console.log('quote_timer() ',index);
                //    index++;
                //    index = index % $('.banft_txt div').length;
                //    $('#random-quotes .banft_txt').animate({
                //        marginLeft: -index * 100 + '%'
                //    }, 500);
                //}, 5000);

                //var index = Math.floor((Math.random() * 3));
                //$('.banft_txt').animate({
                //    marginLeft: -index * 100 + '%'
                //}, 500);

                var $page = $('.page');
                var fn = pageInits[$page.data('page')];

                if (fn) {
                    loadingMgr.show();
                    fn(function () {
                        // hide page mask
                        loadingMgr.success();
                        $('.page-mask').stop(true, true).fadeOut()
                            .addClass('lighter');

                        $(window).trigger('scroll');
                        if (isFirstLoading) {
                            cb && cb();
                            var path = getPath();
                            path && urlManager.go(path);
                        }
                        isFirstLoading = false;
                    });
                } else {
                    // hide page mask
                    $('.page-mask').stop(true, true).fadeOut()
                        .addClass('lighter');

                    if (isFirstLoading) {
                        cb && cb();
                        var path = getPath();
                        path && urlManager.go(path);
                    }
                    isFirstLoading = false;

                }

                // fix common page init
                // for  banpho-img
                var $footer = $('.footer');
                $(window).scroll(function () {
                    var stTop = $(window).scrollTop();
                    var winHeight = $(window).height();

                    if ($('.banpho-img').length) {
                        var $banpho = $('.banpho-img');
                        var banphoTop = $banpho.offset().top;
                        var banphoImgHeight = $('.banpho-img img').height();

                        var $interviewList = $('.interview_list');

                        var off = ( stTop / ( $banpho.height() + $banpho.offset().top ) ) * ( banphoImgHeight - $banpho.height() );
                        if( $.browser.msie && $.browser.version < 9 ){
                            var css = {marginTop: - off }
                        } else {
                            var css = {
                                transform: 'translate(0px,-' + off + 'px)',
                                webkitTransform: 'translate(0px,-' + off + 'px)',
                                msTransform: 'translate(0px,-' + off + 'px)',
                                oTransform: 'translate(0px,-' + off + 'px)',
                                mozTransform: 'translate(0px,-' + off + 'px)'
                            }
                        }
                        

                        // for top image
                        $banpho.find('img')
                            .css(css);
                        // if (stTop > banphoTop && stTop < banphoTop + banphoImgHeight) {
                        //     $banpho.height(banphoTop + banphoImgHeight - stTop)
                        //         .find('img')
                        //         .css({
                        //             marginTop: (banphoImgHeight - (banphoTop + banphoImgHeight - stTop)) / 2
                        //         });
                        // } else if (stTop < banphoTop) {
                        //     $banpho.height('auto')
                        //         .find('img')
                        //         .css('marginTop', 0);
                        // } else if (stTop > banphoTop + banphoImgHeight) {
                        //     $banpho.height(0)
                        //         .find('img')
                        //         .css('marginTop', -banphoImgHeight / 2);
                        // }
                    }

                    // fix up-fadein
                    if ($('.intoview-effect').length) {
                        var index = 0;
                        $('.intoview-effect').each(function () {
                            var $dom = $(this);
                            var offTop = $dom.offset().top;
                            if (!$dom.data('init') && offTop < stTop + winHeight && offTop > stTop) {
                                $dom.data('init', 1);
                                effects[$dom.data('effect')] && effects[$dom.data('effect')]($dom, index, function () {
                                    $dom.removeClass('intoview-effect');
                                });

                            }
                        });
                    }


                    // fix second page tit
                    //var off = $('.pagetit').offset();
                    //if ($('.pagetit').offset().top < stTop - headerHeight) {
                    //    $('.pagetit').addClass('pagetit-fixed');
                    //} else {
                    //    $('.pagetit').removeClass('pagetit-fixed');
                    //}
                    if (stTop - headerHeight > 0) {
                        $('.pagetit').addClass('pagetit-fixed');
                    } else {
                        $('.pagetit').removeClass('pagetit-fixed');
                    }

                    // fix quote event "banner_footer"
                    $('.banner_footer').css('background-position', '0 ' + ~~(stTop / 3) + 'px');
                }).trigger('scroll');


                // init texteffect
                // $('.navitem,.crumbs a').filter(':not(.text-effect-init)')
                //     .addClass('text-effect-init')
                //     .hover(function(){
                //         textEffect( $(this) );
                //     } , function(){
                //         $(this).children('div').remove();
                //     });

                // init about_crumbs
                if ($('.about_crumbs').length) {
                    var pagename = location.href.replace(/^.*\/([^/]+$)/, '$1');
                    $('.about_crumbs').find('a').each(function () {
                        if ($(this).attr('href').indexOf(pagename) >= 0) {
                            var $dom = $(this);
                            var off = $dom.offset();
                            var width = $dom.width();
                            var poff = $dom.parent().offset();
                            var pwidth = $dom.parent().width();

                            var marginLeft = (pwidth - width - 2 * (-poff.left + off.left)) / 2;
                            $dom.addClass('active').parent().css('marginLeft', marginLeft);
                            return false;
                        }
                    });
                }

                // init banpho-img
                $('.banpho-img img').css('opacity', 0)
                    .animate({
                        opacity: 1
                    }, 1000);


                // render home news
                api.request('miscellaneous', function (r) {
                    $.each(r.items, function (i, item) {
                        switch (item.id) {
                        case '1':
                            var htmls = [];
                            $.each([1, 2, 3], function (i, val) {
                                if (item['text_' + val]) {
                                    htmls.push('<p>' + item['text_' + val] + '</p>');
                                }
                            });
                            $('#home-news').css('width', htmls.length * 100 + '%')
                                .html(htmls.join(''))
                                .find('p')
                                .css('width', 1 / htmls.length * 100 + '%');

                            $('.home_newspage span').html('1/' + htmls.length);
                            if (htmls.length <= 1) {
                                $('.home_newspage').hide();
                            }
                            break;
                        case '2':
                            $('.home_bioleft').html(item.text_1);
                            $('.home_bioright').html(item.text_2);
                            break;
                        case '3':
                            if( $('.banner_footer').length && !$('.banft_txt div').length ){
                                var quoteHtmls = [];
                                var tpl = '<div><div class="table"><div class="tablecell"><p>#[text]</p><span>#[author]</span></div></div></div>';
                                for( var i = 1; item['text_' + i] !== undefined ; i++ ){
                                    item['text_' + i] = item['text_' + i].replace('\\u201d','”').replace('\\u201c','“');
                                    //console.log( item['text_' + i] );
                                    var text = item['text_' + i].match(/^\s*(["“”](.|\n)*["“”])((.|\n)*)$/i);
                                    if( item['text_' + i] && !text ){
                                        quoteHtmls.push( LP.format( tpl, {text: item['text_' + i], author: ''} ) );
                                    } else if( item['text_' + i] && text ){
                                        quoteHtmls.push( LP.format( tpl, {text: $.trim(text[1]).replace(/\n+/g,'<br/>'), author: $.trim(text[3]).replace(/\n+/g,'<br/>')} ) );
                                    }
                                }
                                // var text_1 = item.text_1.match(/^\s*(["”](.|\n)*["“])((.|\n)*)$/i);
                                // quoteHtmls.push( LP.format( tpl, {text: $.trim(text_1[1]).replace(/\n+/g,'<br/>'), author: $.trim(text_1[3]).replace(/\n+/g,'<br/>')} ) );

                                // var text_2 = item.text_2.match(/^\s*(["”](.|\n)*["“])((.|\n)*)$/i);
                                // quoteHtmls.push( LP.format( tpl, {text: $.trim(text_2[1]).replace(/\n+/g,'<br/>'), author: $.trim(text_2[3]).replace(/\n+/g,'<br/>')} ) );

                                // var text_3 = item.text_3.match(/^\s*(["”](.|\n)*["“])((.|\n)*)$/i);
                                // quoteHtmls.push( LP.format( tpl, {text: $.trim(text_3[1]).replace(/\n+/g,'<br/>'), author: $.trim(text_3[3]).replace(/\n+/g,'<br/>')} ) );
                                $('.banft_txt').html( quoteHtmls.join('') )
                                    .css({
                                        width: quoteHtmls.length * 100 + '%'
                                    })
                                    .children()
                                    .css({
                                        float: 'left',
                                        width: 1 / quoteHtmls.length * 100 + '%'
                                    });

                                $('.banft_txt').children()
                                    .each(function(){
                                        $(this).css('paddingTop', ( $('.banner_footer').height() - $(this).height() ) / 2 )
                                    });

                                // window.banft_txt_length = quoteHtmls.length;
                                var $banft = $('.banft_txt');
                                $banft.clone().appendTo('#random-quotes').animate({ opacity: 1 })
                                    .css('marginLeft',0)
                                    .children()
                                    .css('paddingTop', 0);
                                $banft.children().eq(0).remove();
                                

                                window.quote_timer_index = 0 ;
                                if (window.quote_switch_timer) {
                                    clearInterval(window.quote_timer);
                                }
                                window.quote_timer = setInterval(function(){
                                    if( !$('.page-mask').hasClass('lighter') ) return;
                                    quote_timer_index++;
                                    quote_timer_index = quote_timer_index % $('#random-quotes .banft_txt div').length;
                                    quote_timer_index = Math.max( quote_timer_index, 1 );
                                    $('#random-quotes .banft_txt')
                                        .fadeOut(function(){
                                            $(this)
                                                .css({
                                                    marginLeft: - quote_timer_index * 100 + '%'
                                                })
                                                .fadeIn(500);
                                        });
                                }, 3000);
                            }
                            // interview to scroll
                            var index = 0 ;
                            if (window.quote_switch_timer) {
                                clearInterval(window.quote_switch_timer);
                            }
                            window.quote_switch_timer = setInterval(function(){
                               index++;
                               index = index % $('.banner_footer .banft_txt').children().length;
                               $('.banner_footer .banft_txt').fadeOut(function(){
                                    $(this).css({
                                       marginLeft: -index * 100 + '%'
                                    }).fadeIn();
                               });
                            }, 3000);
                        }
                    });
                });
                ///////// Footer /////////
                $(window).on('resize',function() {
                    var heights_p1 = [];
                    $('.ft-addr-p-1').each(function(i,p) {
                        heights_p1.push($(p).height());
                    });
                    var p1_max = Math.max.apply(null, heights_p1);
                    $('.ft-addr-p-1').each(function(i,p) {
                        $(p).height(p1_max);
                    });

                    var heights_p2 = [];
                    $('.ft-addr-p-2').each(function(i,p) {
                        heights_p2.push($(p).height());
                    });
                    var p2_max = Math.max.apply(null, heights_p2);
                    $('.ft-addr-p-2').each(function(i,p) {
                        $(p).height(p2_max);
                    });

                    var heights_p3 = [];
                    $('.ft-addr-p-3').each(function(i,p) {
                        heights_p3.push($(p).height());
                    });
                    var p3_max = Math.max.apply(null, heights_p3);
                    $('.ft-addr-p-3').each(function(i,p) {
                        $(p).height(p3_max);
                    });

                    var heights_p4 = [];
                    $('.ft-addr-p-4').each(function(i,p) {
                        heights_p4.push($(p).height());
                    });
                    var p4_max = Math.max.apply(null, heights_p4);
                    $('.ft-addr-p-4').each(function(i,p) {
                        $(p).height(p4_max);
                    });
                }).trigger('resize');
                return false;
            },
            destroy: function () {
                $(window).unbind('scroll');
                $(document.body).unbind('mousemove').css('overflow', 'auto');
            }
        }
    })();


    // load footer json data
    api.request('footer_icons', function (r) {
        var shareHtml = [];
        $.each(r.items, function (i, item) {
            if (item.role == 'share' && ["icon_ch", "icon_hb"].indexOf(item.name) == -1) {
                shareHtml.push(LP.format('<a role="#[role]" href="#[link]" target="#[link_target]" class="find_item #[name]">#[label]</a>', item))
            }
        });
        //Place holders
        shareHtml.push('<a role="share" href="#" target="_blank" data-a="icon-wx" class="find_item icon_wx">Weixin</a>');
        //shareHtml.push('<a role="share" href="#" target="_blank" class="find_item icon_lk">Linkedin</a>');
        $('div[role="share-wrap"]').html(shareHtml.join(''));

        // render websites
        var linkHtml = [];
        $.each(r.items, function (i, item) {
            if (item.role == 'media' && item.link) {
                linkHtml.push(LP.format('<a role="#[role]" href="#[link]" target="#[link_target]" class="work_item #[name]">#[label]</a>', item))
            }
        });
        linkHtml.push('<a role="media" href="#" target="_blank" class="work_item icon_fredInChina"></a>');
        $('#icon-wrap').html(linkHtml.join(''));

    });

    
    // change history
    LP.use('../plugin/history.js', function () {
        // History.replaceState({
        //     prev: ''
        // }, undefined, location.href);
        
        loadingMgr.show();
        pageManager.init(function () {
            loadingMgr.success();
        });

        // $(document).ajaxError(function(){
        //     loadingMgr.success();
        // });


        // Bind to StateChange Event
        function loadPage(){
            // if( LP.parseUrl().path == '/' + LP.getCookie('page') ){
            //     return false;
            // }

            $('.page-mask').stop(true, true).fadeIn();
            // if( State.url.indexOf('##') >= 0 ){
            //     return false;
            // }
            // show loading
            loadingMgr.show();
            loadingMgr.setSuccess(function (html) {
                pageManager.destroy();

                var $banner_footer = $('.container').find('.banner_footer');
                //console.log( $banner_footer );
                $('.container').html(html)
                    .find('.banner_footer')
                    .html('')
                    .append( $banner_footer.children() )
                    .end()
                    .children('.page')
                    .stop()
                    .fadeIn();
                //pagetitarrbottom

                $('html,body').animate({
                    scrollTop: 0
                }, 300);
                
                pageManager.init();

                var subTitle = $.trim($('.pagetit h1').html());
                document.title = document.title + ( subTitle ? ' | ' + subTitle : '' );

            }, 'statechange');
            $.get(location.href, '', function (html) {
                var $dom = $('<div>' + html + '</div>').find('.container');
                html = $dom.html();

                var imgs = [];
                $dom.find('img').each(function () {
                    imgs.push(this.getAttribute('src'));
                });


                // preload all images
                loadImages(imgs, null, function () {
                    $('.container').children(':not(.header)').animate({
                        opacity: 0
                    }, 500);
                    setTimeout(function () {
                        loadingMgr.success('statechange', html);
                    }, 500);
                });

            });
        }

        if( !needAjax ){
            // History.Adapter.bind(window,'hashchange',function( ev ){
            //     var oldURL = ev.oldURL;
            //     var newURL = ev.newURL;
            //     var oldArr = formatPath2Arr( ev.oldURL );
            //     var newArr = formatPath2Arr( ev.newURL );
            //     if( ( !newArr[4] && !oldArr[4] ) && oldArr[3] && oldArr[3].match(/^\d+$/) && newArr[3] && newArr[3].match(/^\d+$/) ){
            //         return false;
            //     }

            //     urlManager.go( newURL.replace( /.*##!/,'' ), null, oldURL.replace( /.*##!/,'' ) );
            // });
        } else {
            History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate

                var State = History.getState(); // Note: We are using History.getState() instead of event.state
                var prev = State.data.prev;
                var type = State.data.type;

                var path = LP.parseUrl(State.url).path.replace(/^\//, '');
                var prevPath = LP.parseUrl(prev).path.replace(/^\//, '');
                if( !document.title ){
                    document.title = $(document.body).data('title');
                }

                if( prevPath.match(/^press/) && path.match(/^press/) ){
                    return false;
                }

                if( prevPath.match(/^jobs/) && path.match(/^jobs/) ){
                    return false;
                }
                


                if( prevPath.match(/^(categories|brands)/) && !path.match(/^(categories|brands)/) ){
                    if( LP.parseUrl(prev).path != LP.getCookie('page') ){
                        urlManager.destory( prevPath );
                        if( path != LP.getCookie('page') ){
                            loadPage();
                        }
                        return false;
                    }
                }
                // if only change hash
                if (path.match(/^(categories|brands)/) || prevPath.match(/^(categories|brands)/)) {
                    var oldArr = prevPath ? formatPath2Arr(prevPath) : [];
                    var newArr = formatPath2Arr(path);
                    if ((!newArr[4] && !oldArr[4]) && oldArr[3] && oldArr[3].match(/^\d+$/) && newArr[3] && newArr[3].match(/^\d+$/) && oldArr[2] == newArr[2]) {
                        return false;
                    }

                    urlManager.go(path, null, prevPath);
                    return false;
                }
                loadPage();

            });
        }
    });


    // bind keydown events
    // fuck safari,fuck safari
    // fuck safari,fuck safari
    var isKeyDown = false;
    $(document).keydown(function (ev) {
        if (isKeyDown == true) {
            return;
        }
        isKeyDown = true;
        setTimeout(function () {
            isKeyDown = false;
        }, 300);

        switch (ev.which) {
        case 27:
            if (loadingMgr.isLoading()) {
                loadingMgr.abort();
            }
            if ($('#categories-wrap').length) {
                LP.triggerAction('myBack');
            } else {
                urlManager.back();
            }


            break;
        case 37:
            if ($('.shade').is(':visible')) {
                $('.popnext').get(0).click();
            }
            if ($('.page').data('page') == "home-page") {
                LP.triggerAction('home-slider-left');
            }
            break;
        case 39:
            if ($('.shade').is(':visible')) {
                $('.popprev').get(0).click();
            }
            if ($('.page').data('page') == "home-page") {
                LP.triggerAction('home-slider-right');
            }
            break;
        }
    });

    var CAMPAIGN_ACT_WIDTH = 322;
    var window_resize_timer = null;
    $(window).resize(function () {
        clearTimeout(window_resize_timer);
        window_resize_timer = setTimeout(function () {
            CAMPAIGN_ACT_WIDTH = $(this).width() > 1200 ? 322 : 175;
            $('.brands-con .brands-items').each(function () {
                $(this).css('width', $(this).children().length * CAMPAIGN_ACT_WIDTH);
            });

            $('.brands-con .brands-item[data-a="brands-item"]').css('width', CAMPAIGN_ACT_WIDTH).each(function () {
                fixImageToWrap($(this), $(this).find('img'));
            });
        }, 400);

        // fix banpho banpho-img
        $('.banpho-img').height( 500 / 1600 * $(window).width() );
    });


    // page actions here
    // ============================================================================
    LP.action('icon-wx',function(){
        $('.shade').fadeIn();
        $('.fullcover-background').show()
            .css({
                top: '-100%',
                opacity: 1
            })
            .animate({
                top: '0%'
            }, 400);
            //$('.fullcover-background').addClass('show');
        return false;
    });

    LP.action('navitem', function () {
        // load next page
        pageManager.go($(this).attr('href'));
        return false;
    });

    LP.action('slide-alink', function(){
        $('html,body').animate({
            scrollTop: ( $(window).height() + 60 ) / 3
        }, 500);
    })


    LP.action('show-category', function (data) {
        urlManager.setFormatHash(data.type);
        // urlManager.go( data.type );
        return false;
    });


    LP.action('home-slider-left', function () {
        var $inner = $('.slider-block-inner');
        var index = parseInt($inner.data('index'));
        var len = $('.slider-item').length;
        if (index == 0) {
            return false;
        }

        // stop current video
        // var video = $('.slider-item').eq( index )
        //  .data('video-object');
        // video && video.pause();

        $inner.animate({
            marginLeft: '+=100%'
        }, 500)
            .promise()
            .then(disposeVideo);
        $inner.data('index', index - 1);
        $inner.data('cb') && $inner.data('cb')(index - 1);

        if (index == 1 ) {
            $(this).hide();
        }

        $('.banpho-con p').html( $inner.children().eq( index - 1 ).attr('title') );

        $(this).siblings('.banpho-bt-r').show();
        $(this).siblings('.banpho-bt-c').html($('.banpho-bt-c').html());

        $('.banpho-i').html(index + '/' + len);
		if($('body').hasClass('lang-zho')) {
			pause_txt = '暂停';
			play_txt = '播放';
		} else if($('body').hasClass('lang-fr')) {
			pause_txt = 'PAUSE';
			play_txt = 'PLAY';
		} else {
			pause_txt = 'PAUSE';
			play_txt = 'PLAY';
		}
		$('.banpho-bt-c')
			.html('<div class="transition">' + play_txt + '<br><br>' + play_txt + '</div>');
        return false;
    });

    LP.action('home-slider-right', function ( data ) {
        var $inner = $('.slider-block-inner');
        var index = parseInt($inner.data('index'));
        var len = $('.slider-item').length;
        if (index == len - 1) {
            var mLeft = 0;
            index = -1;
        } else {
            var mLeft = '-=100%';
        }

        // stop current video
        // var video = $('.slider-item').eq( index )
        //  .data('video-object');
        // video && video.pause();

        $inner.animate({
            marginLeft: mLeft
        }, 500)
            .promise()
            .then(disposeVideo);

        setTimeout( data.callback || function(){} , 500 );

        $inner.data('index', index + 1);
        $inner.data('cb') && $inner.data('cb')(index + 1);

        $('.banpho-con p').html( $inner.children().eq( index + 1 ).attr('title') );

        if (index + 2 == len) {
            $(this).hide();
        }
        $(this).siblings('.banpho-bt-l').show();
        $(this).siblings('.banpho-bt-c').html($('.banpho-bt-c').html());

        $('.banpho-i').html((index + 2) + '/' + len);

		if($('body').hasClass('lang-zho')) {
			pause_txt = '暂停';
			play_txt = '播放';
		} else if($('body').hasClass('lang-fr')) {
			pause_txt = 'PAUSE';
			play_txt = 'PLAY';
		} else {
			pause_txt = 'PAUSE';
			play_txt = 'PLAY';
		}
		$('.banpho-bt-c')
			.html('<div class="transition">' + play_txt + '<br><br>' + play_txt + '</div>');
        return false;
    });

    LP.action('home-play-movie', function () {
        var index = $('.slider-block-inner').data('index');
        // get movie
        var $sliderItem = $('.slider-item').eq(index);
        var videoObject = $sliderItem.data('video-object');
        var $btn = $('.slider-block-inner').next();
        var pause_txt,
            play_txt;
        if($('body').hasClass('lang-zho')) {
            pause_txt = '暂停';
            play_txt = '播放';
        } else if($('body').hasClass('lang-fr')) {
            pause_txt = 'PAUSE';
            play_txt = 'PLAY';
        } else {
            pause_txt = 'PAUSE';
            play_txt = 'PLAY';
        }

        if (!videoObject) {
            var movie = $sliderItem.data('movie');
            $sliderItem.find('.video-wrap').remove();
            renderVideo($sliderItem, movie, $sliderItem.find('img').attr('src'), {
                ratio: $sliderItem.children('img').height() / $sliderItem.children('img').width(),
                autoplay: true,
                showLoadingBar: true,
                loop: false
            }, function () {
                this.on('play', function () {
                    $btn
                        .fadeOut('fast')
                        .find('.banpho-bt-c')
                        .html('<div class="transition">' + pause_txt + '<br><br>' + pause_txt + '</div>');
                });

                this.on('pause', function () {
                    $btn
                        .fadeIn('fast')
                        .find('.banpho-bt-c')
                        .html('<div class="transition">' + play_txt + '<br><br>' + play_txt + '</div>');
                });

                this.on('ended', function () {
                    //LP.triggerAction('home-slider-right',{callback:function(){
                    //    LP.triggerAction('home-play-movie');
                    //}});
                    $('.video-wrap').remove();
                    console.log('remove video');
                });

                // this.on('progress', function(){
                //     videoProgress( this.currentTime() / this.duration() * 100 );
                // });
            });
        } else if (videoObject.paused()) {
            videoObject.play();
        } else {
            videoObject.pause();
        }
    });

    LP.action('home_newsnext', function () {
        var width = $('.home_news').width();
        var index = $('.home_news').data('index');

        var $children = $('.home_news_inner').children();
        if (index == $children.length - 1) {
            return false;
        }
        $('.home_news').data('index', index + 1);
        $children.eq(index)
            .animate({
                opacity: 0
            }, 500)

        .end()
            .eq(index + 1)
            .css('opacity', 0)
            .delay(700)
            .animate({
                opacity: 1
            }, 400);

        $('.home_news_inner')
            .animate({
                marginLeft: "-=" + width
            }, 1000, function () {
                $('.home_newspage span').html((index + 2) + '/' + $children.length);
            });

        return false;
    });
    LP.action('home_newsprev', function () {
        var width = $('.home_news').width();
        var index = $('.home_news').data('index');

        var $children = $('.home_news_inner').children();
        if (index == 0) {
            return false;
        }
        $('.home_news').data('index', index - 1);
        $children.eq(index)
            .animate({
                opacity: 0
            }, 500)

        .end()
            .eq(index - 1)
            .css('opacity', 0)
            .delay(700)
            .animate({
                opacity: 1
            }, 400);

        $('.home_news_inner')
            .animate({
                marginLeft: "+=" + width
            }, 1000, function () {
                $('.home_newspage span').html((index) + '/' + $children.length);
            });

        return false;
    });

    LP.action('home-cam-item', function (data) {
        // get the compaigns
        campaignManager.getCampaigns(data.path, function (items) {
            var compaign = null;
            $.each(items || [], function (i, item) {
                if (item.id == data.id) {
                    compaign = item;
                    return false;
                }
            });
            if (compaign) {
                urlManager.setFormatHash(compaign._contentPath + compaign.path + '/0');
            }
        });

        return false;
    });

    LP.action('home-loadmore', function () {
        var $dom = $(this).fadeOut();

        var $homeCamcon = $('.home_camcon');
        $homeCamcon.height($homeCamcon.height());
        $($('.cam_item:hidden')
            .splice(0, 3))
            .css('marginTop', 150)
            .show()
            .each(function (i) {
                var $img = $(this)
                    .delay(300 + (i + 1) * 200)
                    .animate({
                        marginTop: 0
                    }, 600, 'easeLightOutBack')

                .find('img')
                    .load(function () {
                        fixImageToWrap($(this).parent(), $(this));
                    });
                if ($img.width()) {
                    $img.trigger('load');
                }
                // init mouse move effect
                // initImageMouseMoveEffect( $(this).find('div') );

                if (i == 0) {
                    $homeCamcon.animate({
                        height: $homeCamcon.height() + $('.cam_item').height()
                    }, 600);
                }
            });

        if ($('.cam_item:hidden').length) {
            $dom.delay(700).fadeIn();
        }

        return false;
    });

    LP.action('show-compagins', function (data) {
        if( $(this).attr('disabled') ){
            return false;
        }
        urlManager.setFormatHash(data.path);
        // urlManager.go( data.path );
        return false;
    });

    LP.action('filter-letter', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('ul')
                .find('a')
                .removeClass('active');
            $(this).addClass('active');
        }
        var letter = $(this).html();
        // scroll to right position
        $('.gates-inner-l').find('li a').each(function (i) {
            if ($.trim($(this).text())[0].toUpperCase() == letter) {
                $('.gates-inner-l').animate({
                    scrollTop: ($(this).parent().height() + 28) * i
                }, 1000);
                return false;
            }
        });
        return false;
    });


    LP.action('filter-category', function (data) {
        var category = data.category || $(this).data('category');
        $(this).closest('ul')
            .find('a')
            .removeClass('active');
        $(this).addClass('active');


        var $showLi = null;
        var $hideLi = null;
        if (!category) {
            $showLi = $('.gates-inner-l li');
        } else {
            $showLi = $('.gates-inner-l a[data-category!="' + category + '"]').parent();
            $hideLi = $('.gates-inner-l a[data-category="' + category + '"]').parent();
        }

        var $realShowLi = $();
        var $realHideLi = $hideLi || $();
        var letter = $.trim($('.gates-inner-c a.active').text());
        $showLi.each(function () {
            var text = $.trim($(this).text());
            if (!letter || text[0].toUpperCase() == letter) {
                $(this).slideDown();
                $realShowLi.add(this);
            } else {
                $(this).slideUp();
                $realHideLi.add(this);
            }
        });

        $realShowLi.slideDown();
        $realHideLi.slideUp();
        return false;
    });

    LP.action('move-next', function () {
        var index = parseInt($('.preview ul').data('index'));
        if (index >= $('.preview ul').children('.big-item').length - 1) {
            return false;
        }

        index++;

        $('.preview ul').data('index', index);

        var ml = -index * 90 + 5 + '%';


        $('.preview ul').animate({
            marginLeft: ml
        }, 600, 'easeOutQuart')
            .promise()
            .then(function () {
                disposeVideo();
                var $ul = $(this);
                // if need to render new video
                var $li = $ul.children().eq(index);
                var video = $li.data('video');
                if (video) {
                    // render video and play
                    renderVideo($li, video, $li.find('img').attr('src'), {
                        autoplay: true,
                        pause_button: true,
                        showLoadingBar: true
                    }, function () {
                        $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                            .append($li.find('.vjs-control-bar').show())
                            .appendTo($li);
                    });
                }

                $('.preview .prev').show();
                if( index == $ul.children().length - 1 ){
                    $('.preview .next').hide();
                }
            });

    });

    LP.action('move-prev', function () {
        var index = parseInt($('.preview ul').data('index'));
        if (index <= 0) {
            return false;
        }

        index--;
        $('.preview ul').data('index', index);

        var ml = -index * 90 + 5 + '%';


        $('.preview ul').animate({
            marginLeft: ml
        }, 600, 'easeOutQuart')
            .promise()
            .then(function () {
                disposeVideo();
                var $ul = $(this);
                // if need to render new video
                var $li = $ul.children().eq(index);
                var video = $li.data('video');
                if (video) {
                    // render video and play
                    renderVideo($li, video, $li.find('img').attr('src'), {
                        autoplay: true,
                        pause_button: true,
                        showLoadingBar: true
                    }, function () {
                        $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                            .append($li.find('.vjs-control-bar').show())
                            .appendTo($li);
                    });
                }

                $('.preview .next').show();
                if( index == 0 ){
                    $('.preview .prev').hide();
                }
            });
    });


    LP.action('brands-item', function ( data ) {
        var prev = data.prev;
        prev && LP.setCookie('prev', prev || '');
        urlManager.setFormatHash(getPath($(this).data('path')));
    });


    LP.action('search-toggle', function () {
        var $wrap = $('.search-wrap');
        if ($wrap.is(':visible')) {
            $wrap.find('form').animate({
                marginTop: -96
            }, 300)
                .promise()
                .then(function () {
                    $wrap.hide();
                });
        } else {
            $wrap.show().find('form')
                .css('marginTop', -96)
                .animate({
                    marginTop: 0
                }, 300)
                .promise()
                .then(function () {
                    $wrap.find('input[type="text"]:visible').focus();
                });
        }
        $(this).toggleClass('search-close');

        return false;
    });


    LP.action('pop_close', function ( data ) {
        $('.pop:visible').animate({
            top: '150%',
            opacity: 0
        }, 500)
            .promise()
            .then(function () {
                $(this).hide();
                $('.shade').fadeOut();
            });


        loadingMgr.abort();

        if( !data.noRefresh ){
            pageManager.go( LP.parseUrl().path.match(/^(\/\w+)/)[1] );
        }

    });


    LP.action('press_img', function (data) {
        var $item = $(this).closest('.press_item');
        var path = $(this).data('path');
        var press_index = $(this).closest('.press_item').index() + 1;
        var total = $(this).closest('.press_list').children().length;
        loadingMgr.show();
        loadingMgr.setSuccess(function (img) {
            var width = img.width;
            var height = img.height;
            var winHeight = $(window).height();
            var winWidth = $(window).width();
            var tHeight = Math.min(height, winHeight - 40);

            var tWidth = Math.max(winWidth * 2 / 3, 450);
            img.style.width = tWidth + 'px';
            $('.pop_presspho').css({
                height: tHeight,
                width: tWidth
            });
            $('.shade').fadeIn();
            $('.pop_press').show()
                .data('path', path)
                .css({
                    top: '-150%',
                    opacity: 1,
                    marginLeft: -tWidth / 2,
                    marginTop: -tHeight / 2
                })
                .find('.pop_presspho')
                .html(img)
                .end()
                .animate({
                    top: '50%'
                }, 400)
                .promise()
                .then(function () {
                    $('.pop_press_menus')
                        .delay(100)
                        .animate({
                            right: 0
                        }, 300, 'easeLightOutBack');
                });

            $('.pop_press_menus').css('right', 95);

            if( press_index == 1 ){
                $('.pop_press .popnext').hide();
            } else {
                $('.pop_press .popnext').show();
            }
            if( press_index == total ){
                $('.pop_press .popprev').hide();
            } else {
                $('.pop_press .popprev').show();
            }


            // change url 
            pageManager.go('/press/' + path );

        }, 'press_image');
        $('<img/>').load(function () {
            loadingMgr.success('press_image', this);
        }).attr('src', $(this).find('.cover_img').data('cover'));

        $('.pop_index').html(press_index);
        $('.pop_total').html(total);
        $('.pop_press .popdownicon').attr('href', $item.find('.press_itemdown').attr('href'));
    });

    LP.action('press_prev', function () {
        var $popPress = $('.pop_press');
        // get next cover image
        var path = $popPress.data('path');
        var $pressItem = $('.press_item[data-path="' + path + '"]');
        var $item = $pressItem.prev();
        var imgSrc = $item.find('.cover_img').data('cover');
        if (!imgSrc) return;

        $popPress.data('path', $item.data('path'));
        loadingMgr.show();
        loadingMgr.setSuccess(function () {
            $('.pop_presspho img').animate({
                marginLeft: '-70%',
                opacity: 0
            }, 500)
                .promise()
                .then(function () {
                    $(this)
                        .unbind('load')
                        .attr('src', imgSrc)
                        .css({
                            marginLeft: '70%'
                        })
                        .animate({
                            marginLeft: 0,
                            opacity: 1
                        }, 500);
                });

            

            $('.pop_index').html($item.index() + 1);
            $('.pop_press .popdownicon').attr('href', $item.find('.press_itemdown').attr('href'));

            pageManager.go('/press/' + $item.data('path') );
            if( $item.index() + 1 == 1 ){
                $('.pop_press .popnext').hide();
            }
            $('.pop_press .popprev').show();
        }, 'press-img-load');
        $('<img/>').load(function () {
            loadingMgr.success('press-img-load');
        }).attr('src', imgSrc);

    });


    LP.action('press_next', function () {
        var $popPress = $('.pop_press');
        // get next cover image
        var path = $popPress.data('path');
        var $pressItem = $('.press_item[data-path="' + path + '"]');
        var $item = $pressItem.next();
        var imgSrc = $item.find('.cover_img').data('cover');
        if (!imgSrc) return;

        $popPress.data('path', $item.data('path'));
        loadingMgr.show();
        loadingMgr.setSuccess(function () {
            $('.pop_presspho img').off('load').animate({
                marginLeft: '70%',
                opacity: 0
            }, 500)
                .promise()
                .then(function () {
                    $(this)
                        .unbind('load')
                        .attr('src', imgSrc)
                        .css({
                            marginLeft: '-70%'
                        })
                        .animate({
                            marginLeft: 0,
                            opacity: 1
                        }, 500);
                });

            $('.pop_index').html($item.index() + 1);
            $('.pop_press .popdownicon').attr('href', $item.find('.press_itemdown').attr('href'));

            pageManager.go('/press/' + $item.data('path') );
            if( $item.index() + 1 == $item.parent().children().length ){
                $('.pop_press .popprev').hide();
            }
            $('.pop_press .popnext').show();

        }, 'press_next');
        $('<img/>').load(function () {
            loadingMgr.success('press_next');
        }).attr('src', imgSrc);
        
    });


    LP.action('show-video-interview', function () {
        var media = $(this).data('media');
        var $item = $(this).closest('.interview_item');

        // hide others
        $item.siblings('.interview-music-wrap')
            .each(function(){
                if( $(this).height() != 0 ){
                    $(this).prev()
                        .find('.interview_opt')
                        .click();
                }
            });

        if( $item.next().hasClass('interview-video-wrap') ){
            $item.next().siblings('.interview-video-wrap')
                .prev()
                .find('.interview_img')
                .click();
        } else {
            $item.siblings('.interview-video-wrap')
            .prev()
            .find('.interview_img')
            .click();
        }
        


        var $container = $item.data('media-dom');
        var $videoWrap = $container && $container.find('.interview-video');
        if (!$container) {
            $container = $('.<div class="interview-video-wrap">\
                <div class="interview-video"></div>\
            </div>').insertAfter($item);

            $item.data('media-dom', $container)
                .find('.interview_opt')
                .addClass('opened');


            $videoWrap = $container.find('.interview-video');

            // render video
            renderVideo($videoWrap, media, $item.find('img').attr('src'), {
                autoplay: false,
                controls: true,
                pause_button: true,
                showLoadingBar: true
            }, function () {
                $('<div class="vjs-default-skin"><div class="video-share">share</div></div>')
                    .append($videoWrap.find('.vjs-control-bar').show())
                    .appendTo($videoWrap.parent());
                
            });

            // start animate
            $videoWrap.css({
                marginTop: -480
            })
                .animate({
                    marginTop: 0
                }, 400);
        } else {

            $item.removeData('media-dom')
                .find('.interview_opt')
                .removeClass('opened');

            $videoWrap.animate({
                marginTop: -480
            }, 400)
                .promise()
                .then(function () {
                    disposeVideo( $videoWrap );

                    $container.remove();
                });

            // follow items animates
            var $nexts = $container.nextAll()
                .each(function (i) {
                    $(this).delay(150 * i).animate({
                        marginTop: i == 0 ? 0 : -60,
                        marginBottom: 80
                    }, 400, function () {
                        $(this).css({
                            marginTop: 0
                        }).prev().css({
                            marginTop: 0,
                            marginBottom: 20
                        });
                    });
                });
        }
    });

    LP.action('show-music-interview', function () {
        var media = $(this).data('media');
        var $item = $(this).closest('.interview_item');

        // hide others
        $item.siblings('.interview-music-wrap')
            .each(function(){
                if( $(this).height() != 0 ){
                    $(this).prev()
                        .find('.interview_opt')
                        .click();
                }
            });

        $item.siblings('.interview-video-wrap')
            .prev()
            .find('.interview_img')
            .click();
            

        // $item.closest('.interview-music-wrap')
        //     .siblings()
        //     .find('.interview-video')
        //     .each(function(){
        //         var video = $(this).data('video-object');
        //         video && video.pause();
        //     });


        var $container = $item.next();

        var $musicWrap = $container.find('.interview-music');

        if( !$container.hasClass('interview-music-wrap') ){
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
            </div>').insertAfter($item)
            .find('.interview-music')
            .animate({
                marginTop: 0
            }, 500);

            var randomId = 'audio-' + ($.guid++);
            $container.attr('id', randomId);

            $item.data('media-dom', $container)
                .find('.interview_opt')
                .addClass('opened');
            $musicWrap = $container.find('.interview-audio');

            $musicWrap.append('<canvas></canvas>')
                .find('canvas')
                .attr('width', $musicWrap.width())
                .attr('height', $musicWrap.height())
                .end()
                .append('<div class="move-line"></div>');


            var audio_url = $item.find('.hold-audio-url').data('media');

            initSoundWave( audio_url, $musicWrap.find('canvas'), function( dancer ){
                $container.find('.wavesurfer-playPause-btn').click(function(){

                    if( dancer.isPlaying() ){
                        dancer.pause();
                        $(this).addClass('wavesurfer-pause')
                            .removeClass('wavesurfer-play');
                    } else {
                        dancer.play();
                        $(this).removeClass('wavesurfer-pause')
                            .addClass('wavesurfer-play');
                    }
                })
                .click();
            } );
            // render audio
            // LP.use(['wavesurfer'], function () {
            //     var $audio_loading_wrapper = $('<div class="audio-loading-wrapper"><div class="audio-loading-wrapper-progress"></div></div>');
            //     $audio_loading_wrapper.appendTo($item.find('.interview_img'));
            //     var h = $musicWrap.height();
            //     var audio_url = $item.find('.hold-audio-url').data('media');
            //     var $playPause_btn = $musicWrap.next('.wavesurfer-playPause-btn');
            //     var wavesurfer = Object.create(WaveSurfer);
            //     wavesurfer.init({
            //         container: $musicWrap.get(0),
            //         waveColor: 'white',
            //         progressColor: '#fd0000',
            //         cursorColor: '#fd0000',
            //         height: h
            //     });
                
            //     wavesurfer.on('loading', function (progress, e) {
            //         $item.find('.audio-loading-wrapper-progress').width(progress + '%');
            //         if (progress > 99) {
            //             $item.find('.audio-loading-wrapper').fadeOut();
            //         }
            //     });
            //     $playPause_btn.on('click', function (e) {
            //         if ($(this).hasClass('wavesurfer-play')) {
            //             wavesurfer.pause();
            //             $(this).removeClass('wavesurfer-play').addClass('wavesurfer-pause');
            //         } else {
            //             wavesurfer.play();
            //             $(this).addClass('wavesurfer-play').removeClass('wavesurfer-pause');
            //         }
            //     });

            //     wavesurfer.load(audio_url,[
            //         0.01, 0.02, 0.011, 0.017, 0.016, 0.007, 0.015, 0.01, 0.011,
            //         0.01, 0.025, 0.013, 0.01, 0.3, 0.3, 0., 0.32, 0.2, 0.2, 0.2, 0.18,
            //         0.30, 0.1, 0.24, 0.1, 0.2, 0.23, 0.2, 0.23, 0., 0.2, 0.21, 0.23,
            //         0.25, 0.26, 0.2, 0.28, 0.2, 0.24, 0.22, 0.21, 0.17, 0.25, 0.25,
            //         0.26, 0.18, 0.22, 0.17, 0.24, 0.22, 0.09, 0.12, 0.2, 0.13, 0.22,
            //         0.2, 0.20, 0.29, 0.25, 0.31, 0.25, 0.26, 0.20, 0.37, 0.29, 0.,
            //         0.34, 0.2, 0.26, 0.17, 0.2, 0., 0.29, 0., 0.1, 0.18, 0.29, 0.2,
            //         0.27, 0.18, 0.19, 0.24, 0.24, 0.21, 0.26, 0.19, 0.18, 0.23, 0.3,
            //         0.3, 0.3, 0.29, 0.24, 0.3, 0.3, 0.15, 0.1, 0.23, 0.2, 0.23, 0.18,
            //         0.2, 0.2, 0.30, 0.2, 0.20, 0., 0.29, 0.3, 0.1, 0.14, 0.1, 0.,
            //         0.27, 0.23, 0.29, 0.18, 0.20, 0.1, 0.3, 0.23, 0.27, 0.19, 0.2,
            //         0.19, 0.22, 0.19, 0.12, 0.23, 0.21, 0.12, 0.1, 0.1, 0.1, 0.15,
            //         0.24, 0.1, 0.1, 0.1, 0.1, 0.14, 0.13, 0.10, 0.11, 0.13, 0.1, 0.10,
            //         0.10, 0.1, 0.14, 0.13, 0.12, 0.1, 0.1, 0.14, 0.13, 0.14, 0.12,
            //         0.1, 0.12, 0.1, 0.16, 0.1, 0.1, 0.16, 0.15, 0.1, 0.13, 0.15, 0.1,
            //         0.13, 0.16, 0.15, 0.12, 0.14, 0.13, 0.13, 0.14, 0.13, 0.17, 0.16,
            //         0.17, 0.14, 0.1, 0.16, 0.1, 0.15, 0.14, 0.08, 0.1, 0.11, 0.1,
            //         0.09, 0.11, 0.1, 0.11, 0.10, 0.10, 0.11, 0.10, 0.0, 0.08, 0.07,
            //         0.05, 0.04, 0.023, 0.007, 0.007, 0.007, 0.015, 0.00, 0.008, 0.007,
            //         0.007, 0.007, 0.007, 0.0, 0.010
            //     ]);

            //     //wavesurfer.play();
            //     // wavesurfer.on('ready', function () {
            //         // $musicWrap.closest('.interview-music').animate({
            //         //     marginTop: 0
            //         // }, 300);
                    
            //     // });
            // });
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
            var marginTop = parseInt( $container.find('.interview-music').css('marginTop') );

            $container.find('.interview-music')
                .animate({
                    marginTop: marginTop == 0 ? -190 : 0
                }, 500)
                .promise()
                .then(function () {
                    if( marginTop ){
                        if ($container.find('.wavesurfer-pause').length) {
                            $container.find('.wavesurfer-pause').click();
                        }
                    } else {
                        if ($container.find('.wavesurfer-play').length) {
                            $container.find('.wavesurfer-play').click();
                        }
                    }
                    
                });

            $item
                .find('.interview_opt')
                .removeClass('opened');

            // // follow items animates
            // var $nexts = $container.nextAll()
            //     .each(function (i) {
            //         $(this).delay(120 * i).animate({
            //             marginTop: i == 0 ? 0 : -60,
            //             marginBottom: 80
            //         }, 400, function () {
            //             $(this).css({
            //                 marginTop: 0
            //             }).prev().css({
            //                 marginTop: 0,
            //                 marginBottom: 20
            //             });
            //         });
            //     });
        }

    });


    LP.action('press_crumbs_link', function (data) {
        var $dom = $(this);
        if ($dom.hasClass('active')) return false;

        var off = $dom.offset();
        var width = $dom.width();
        var poff = $dom.parent().offset();
        var pwidth = $dom.parent().width();


        var marginLeft = (pwidth - width - 2 * (-poff.left + off.left)) / 2;


        var index = $dom.index();
        $dom.parent().find('a')
            .removeClass('active')
            .end()
            .animate({
                marginLeft: marginLeft
            }, 300);

        $dom.addClass('active');


        // load press page
        pageManager.go($dom.attr('href'), data.type);

        return false;
    });


    LP.action('search-btn', function () {
        var $form = $(this).closest('form');
        var value = $form.find('input[type="text"]').val();
        if (!value) {
            $form.find('input[type="text"]').focus();
            return false;
        }
        $form
            .hide()
            .next()
            .fadeIn()
            .find('h1 span').html(value);
        return false;
    });


    LP.action('pagetitarrtop', function () {
        var href = $(this).attr('href');
        if (href) {
            urlManager.setFormatHash(href);
        }

        return false;
    });

    LP.action('pagetitarrtop-level3', function () {
        var href = $(this).attr('href');
        if (href) {
            urlManager.setFormatHash(href);
        }

        return false;
    });
    LP.action('pagetitarrbottom-level3', function () {
        var href = $(this).attr('href');
        if (href) {
            urlManager.setFormatHash(href);
        }

        return false;
    });

    LP.action('pagetitarrbottom', function () {
        var href = $(this).attr('href');
        if (href) {
            urlManager.setFormatHash(href);
        }

        return false;
    });

    LP.action('awardfilter', function () {
        var awards = $('#awardfilter').data('awards');
        var campaigns = $('#awardfilter').data('campaigns');
        var brands = $('#awardfilter').data('brands');
        var all_replicated = $('#awardfilter').data('all');
        var all_obj = {};
        var all = [];
        $.each(all_replicated, function (i, item) {
            all_obj[item.id] = item;
        });
        $.each(all_obj, function (i, item) {
            if (item) {
                all.push(item);
            }
        });

        var year = $('#year').val();
        var brand_id = $('#brand').val();
        var award_id = $('#award').val();

        if (year) {
            all = array_filter(all, function (award) {
                return award.date.indexOf(year) == 0;
            });
        }
        if (brand_id) {
            all = array_filter(all, function (award) {
                return award.brand_title == brand_id;
            });
        }

        if (award_id) {
            all = array_filter(all, function (award) {
                return award.award_label == award_id;
            });
        }

        //console.log('filtered all: ',all);

        var _comtentPaths = [];
        $.each(all, function (i, award) {
            //_comtentPaths.push('pages_contents/awards/' + award.path);
            _comtentPaths.push(award._awardPath);
        });

        // filter campaign
        campaigns = array_filter(campaigns, function (campaign) {
            return $.inArray(campaign._contentPath, _comtentPaths) >= 0;
        });
        var tpl = '<tr class="#[class]"><td>#[year] #[award]</td><td>#[brand]</td><td class="cam_item" data-a="brands-item" data-path="#[path]" data-d="prev=/awards">#[campaign]</td></tr>';

        // data-a="brands-item" data-path="pages_contents/categories/alcoholic_drinks/huang_lei_interview/0"
        var listHtml = [];
        $.each(all, function (i, all_item) {
            listHtml.push(LP.format(tpl, {
                'class': i % 2 ? '' : 'even',
                year: all_item['date'].replace(/^(\d{4}).*/, '$1'),
                award: all_item.award_label,
                brand: all_item.brand_title,
                campaign: all_item.label,
                path: all_item._contentPath.replace('pages_contents/','') + '/' + all_item.path + '/0'
                //campaign_link: 'path=categories/' + all_item._awardPath + '&id=' + all_item.fid_award
            }));
        });
        $('#list-table').html(listHtml.join('') || '<tr></tr>');
        $('#awardfilter').one('click',function() {
            $('#list-table').removeClass('take-no-space');
        });
        //$('#awardfilter').trigger('click');
        //$('#awardfilter').on('click',function() {
        //    $('#list-table').show();
        //    //$('#list-table').toggleClass('take-no-space');
        //    $('#list-table').find('tr').each(function(i, row) {
        //        //$(row).removeClass('take-no-space');
        //        console.log('tr: ',row);
        //        setTimeout(function() {
        //            $(this).show();
        //            $(this).css('opacity',1);
        //        }, 300 * i);
        //    });
        //});
        return false;
    });

    LP.action('pop-mask', function () {
        LP.triggerAction('pop_close');
    });

    var job_index = 0;
    LP.action('jobs-more', function (data) {
        $('.pop_jobcon_inner').each(function(i,el) {
            var $self = $(this);
            $self.find('.jobcontent').each(function(i,el) {
                if($(el).text() == '') {
                    var id = $(el).prop('class').split(' ')[1].split('_')[1];
                    //console.log('id: ',id);
                    $self.find('a').each(function(i,a) {
                        if($(a).data('lang') == id) {
                            //console.log(a);
                            $(a).hide();
                        }
                    });
                }
            });
        });


        var $item = $(this).closest('.jobsitem');
        job_index = $item.index() + 1;
        $('.shade').fadeIn();
        $('.pop_jobs').show()
            .find('.pop_jobcon')
            .html('')
            .append($item.find('.pop_jobcon_inner').clone().show())

            .end()
            .css({
                top: '-150%',
                opacity: 1
            })
            .animate({
                top: '50%'
            }, 400)
            .promise()
            .then(function () {
                $('.pop_press_menus')
                    .delay(100)
                    .animate({
                        right: 0
                    }, 300, 'easeLightOutBack');
            });

        $('.pop_jobs .jobs_more').attr('href', 'mailto:' + data.contact);
        $('.pop_jobs .pop_index').html(job_index);
        $('.pop_jobs .pop_total').html($item.parent().children().length);
        $('.pop_job_menus').css('right', 95);

        if( job_index == 1 ){
            $('.pop_job_menus .popnext').hide();
        } else {
            $('.pop_job_menus .popnext').show();
        }

        if( job_index == $item.parent().children().length ){
            $('.pop_job_menus .popprev').hide();
        } else {
            $('.pop_job_menus .popprev').show();
        }

        // change share content
        $('.pop_jobs').find('.jobshare')
            .find('a')
            .remove()
            .end()
            .append($item.find('.sharecon').html());

        // change path
        pageManager.go( $(this).data('path') );
    });


    LP.action('pop-jobs-prev', function () {
        if (job_index == 1) {
            return false;
        }
        job_index--;

        var $item = $('.jobsitem').eq(job_index - 1);

        var $newInner = $item.find('.pop_jobcon_inner').clone().show();
        var $inner = $('.pop_jobs .pop_jobcon_inner');
        var innerWidth = $('.pop_jobcon').width();
        $('.pop_jobcon').prepend($newInner)
            .children()
            .css({
                width: innerWidth,
                'float': 'left'
            })
            .eq(0)
            .css('marginLeft', -innerWidth);

        $inner.css('marginRight', -innerWidth);

        $newInner.animate({
            marginLeft: 0
        }, 500)
            .promise()
            .then(function () {
                $inner.remove();
            });


        var contact = LP.query2json($item.find('.jobs_more').attr('data-d'))['contact'];
        $('.pop_jobs .jobs_more').attr('href', 'mailto:' + contact);
        $('.pop_jobs .pop_index').html(job_index);

        if( job_index == 1 ){
            $('.pop_job_menus .popnext').hide();
        }
        $('.pop_job_menus .popprev').show();

        // change share content
        $('.pop_jobs').find('.jobshare')
            .find('a')
            .remove()
            .end()
            .append($item.find('.sharecon').html());

        // change path
        pageManager.go( $item.find('[data-path]').data('path') );
    });

    LP.action('pop-jobs-next', function () {
        if ($('.pop_jobs .pop_total').html() == $('.pop_jobs .pop_index').html()) return false;
        job_index++;

        var $item = $('.jobsitem').eq(job_index - 1);

        var $newInner = $item.find('.pop_jobcon_inner').clone().show();
        var $inner = $('.pop_jobs .pop_jobcon_inner');
        var innerWidth = $('.pop_jobcon').width();
        $('.pop_jobcon').append($newInner)
            .children()
            .css({
                width: innerWidth,
                'float': 'left'
            })
            .eq(1)
            .css('marginRight', -innerWidth);

        $inner.animate({
            marginLeft: -innerWidth
        }, 500)
            .promise()
            .then(function () {
                $inner.remove();
                $newInner.css('marginRight', 0);
            });

        var contact = LP.query2json($item.find('.jobs_more').attr('data-d'))['contact'];
        $('.pop_jobs .jobs_more').attr('href', 'mailto:' + contact);
        $('.pop_jobs .pop_index').html(job_index);

        if( job_index == $item.parent().children().length ){
            $('.pop_job_menus .popprev').hide();
        }
        $('.pop_job_menus .popnext').show();

        // change share content
        $('.pop_jobs').find('.jobshare')
            .find('a')
            .remove()
            .end()
            .append($item.find('.sharecon').html());

        // change path
        pageManager.go( $item.find('[data-path]').data('path') );
    });


    LP.action('page-pagetitarrtop', function () {
        var $links = $('a[data-a="press_crumbs_link"]');
        var index = $links.filter('.active').index();
        if ($links.length && index > 0) {
            $links.get(index - 1).click();
            return false;
        }

        var page = $('.page').data('header');

        $('.navitem').each(function (i) {
            var text = $.trim($(this).text()).toLowerCase();
            if (text == page) {
                var $link = $('.navitem').eq(i - 1);
                if ($link.data('last')) {
                    pageManager.go($link.data('last'));
                } else {
                    $link.get(0)
                        .click();
                }
            }
        });

        return false;
    });

    LP.action('page-pagetitarrbottom', function () {

        var $links = $('a[data-a="press_crumbs_link"]');
        var index = $links.filter('.active').index();
        if ($links.length && index < $links.length - 1) {
            $links.get(index + 1).click();
            return false;
        }

        // var pagename = location.href.replace(/^.*\/([^/]+)$/ , '$1' );

        var page = $('.page').data('header');

        $('.navitem').each(function (i) {
            var text = $.trim($(this).text()).toLowerCase();
            if (text == page) {
                var $link = $('.navitem').eq(i + 1);
                $link.get(0) && $link.get(0)
                    .click();
                return false;
            }
        });

        return false;
    });


    LP.action('big-brands-item', function () {
        var $dom = $(this);

        var newIndex = $dom.index();
        var prevIndex = $('.brand_movie').data('index');
        if (newIndex > prevIndex) {
            LP.triggerAction('brand_big_next', {
                index: newIndex
            });
        } else if (newIndex < prevIndex) {
            LP.triggerAction('brand_big_prev', {
                index: newIndex
            });
        } else if ($dom.hasClass('brands-item-video')) {
            // show big video
            LP.triggerAction('show_fullscreen_video', {
                dom: this
            });
        } else {
            LP.triggerAction('image-zoom', {
                dom: $dom.find('.image-zoom')
            });
        }
        return false;
    });

    LP.action('show_fullscreen_video', function (data) {
        // 获取这个元素的信息
        urlManager.setFormatHash(LP.parseUrl().path + '/big');

        // var item = campaignManager.get( $(data.dom).data('path') );

        // // 创建一个dom，显示在全屏
        // var $wrap = $('<div class="full_screen_video_wrap"></div>').appendTo(document.body);
        // renderVideo( $wrap , campaignManager.getPath( item , 'media' ) , campaignManager.getPath( item , 'picture' ) , {
        //     autoplay: true,
        //     pause_button: true
        // } );
    });

    LP.action('close_fullscreen_video', function () {
        $('.full_screen_video_wrap').remove();
    });


    LP.action('brand_big_prev', function (data) {
        var index = $('.brand_movie').data('index');
        if (index == 0) return;

        var isFullScreen = $('.brand_movie').data('isFullScreen');

        var $items = $('.brand_movie').find('.brands-item');
        var $current = $items.eq(index);
        var $dom = $items.eq(data.index || index - 1);
        var winWidth = $(window).width();
        var time = 600;

        // if ($current.data('video-object')) {
        //     $current.data('video-object').muted();
        // }
        // unInitImageMouseMoveEffect( $current );

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30 );
        
        $('.brand_movie').find('.brands-mask').stop(true,true).fadeIn( 600 );

        $current
            // .find('.brands-mask').stop(true, true)
            // .fadeIn(time)
            // .end()
            .find('.image-zoom')
            .fadeOut();

        // do width brands-mask
        $dom.find('.brands-mask').stop(true, true).fadeOut(time);

        var totalWidth = $dom.parent().width();
        var preWidth = $dom.width() / 2;
        $dom.prevAll().each(function () {
            preWidth += $(this).width();
        });

        // $dom.animate({
        //     width: isFullScreen ? winWidth * 0.9 : winWidth * 0.7
        // } , time )
        $dom
            .parent()
            .animate({
                marginLeft: winWidth - totalWidth > 0 ? 0 : Math.max(Math.min(0, winWidth / 2 - preWidth), winWidth - totalWidth) // - ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
            }, time)
            .promise()
            .then(function () {
                //clearInterval( interval );
                disposeVideo();

                if ($dom.data('movie')) {
                    // var key = $dom.data('key');
                    // var item = campaignManager.get( key );
                    // renderVideo( $dom , campaignManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
                    //     autoplay: false,
                    //     pause_button: true
                    // } );
                } else if ($dom.data('image')) {
                    // initImageMouseMoveEffect( $dom );
                }

                // if( index - 1 == 0 ){
                //     $('.brand_big_prev').fadeOut();
                // }
                // $('.brand_big_next').fadeIn();
            });

        $('.brand_movie').data('index', index - 1);
        var path = getPath();
        setPath(path.replace(/\d+$/, index - 1));

        // var itemDom = $('.brand_movie').find('.brands-item').eq( index - 1 ).get(0);
        // itemDom && itemDom.click();
    });

    LP.action('brand_big_next', function (data) {
        var index = $('.brand_movie').data('index');

        var $items = $('.brand_movie').find('.brands-item');
        var $current = $items.eq(index);
        var $dom = $items.eq(data.index || index + 1);
        if (!$dom.length) return;

        var winWidth = $(window).width();
        var time = 600;

        // clear current effect
        if ($current.data('video-object')) {
            $current.data('video-object').muted();
        }
        // unInitImageMouseMoveEffect( $current );

        $current.find('.brands-mask').fadeIn(time)
            .end()
            .find('.image-zoom')
            .fadeOut();

        // var interval = setInterval(function(){
        //     fixImageToWrap( $dom , $dom.find('img') );
        // } , 1000 / 30);

        // do width brands-mask
        $dom.find('.brands-mask').fadeOut(time);


        var totalWidth = $dom.parent().width();
        var preWidth = $dom.width() / 2;
        $dom.prevAll().each(function () {
            preWidth += $(this).width();
        });

        $dom
            .parent()
            .animate({
                marginLeft: winWidth - totalWidth > 0 ? 0 : Math.max(Math.min(0, winWidth / 2 - preWidth), winWidth - totalWidth) //- ( $dom.prevAll().length * ( winWidth * 0.7 ) - (isFullScreen ? winWidth * 0.05 : winWidth * 0.15) )
            }, time)
            .promise()
            .then(function () {
                //clearInterval( interval );
                disposeVideo();

                if ($dom.data('movie')) {
                    // var key = $dom.data('key');
                    // var item = campaignManager.get( key );
                    // renderVideo( $dom , campaignManager.getPath( item , 'media' ) , $dom.find('img').attr('src') , {
                    //     autoplay: false,
                    //     pause_button: true
                    // } );
                } else if ($dom.data('image')) {
                    // initImageMouseMoveEffect( $dom );
                }
            });

        $('.brand_movie').data('index', index + 1);
        var path = getPath();
        setPath(path.replace(/\d+$/, index + 1));
    });


    // LP.action('showreel' , function( e ){
    //     renderVideo($('.banpho-img') , '../videos/0.mp4' , '' , {
    //         autoplay: true,
    //         pause_button: true,
    //         showLoadingBar: true
    //     } );

    //     return false;
    // });

    LP.action('image-zoom', function (data) {
        var path = LP.parseUrl().path;
        urlManager.setFormatHash(path + '/big');
        return false;
    });

    LP.action('lang', function (data) {
        LP.setCookie('lang', data.lang);
        LP.reload();
        return false;
    });


    LP.action('people_opt', function () {
        var $opt = $(this).find('.people_opt');
        var isSlideDown = !$opt.hasClass('expand');
        if (isSlideDown) {
            $opt.siblings('.people_download').slideDown();
            $opt.siblings('.people_desc').slideDown();

            // go to the top
            $('html,body').animate({
                scrollTop: $(this).offset().top - $('.header').height()
            }, 500);

        } else {
            $opt.siblings('.people_download').slideUp();
            $opt.siblings('.people_desc').slideUp();
        }

        $opt.toggleClass('expand');
    });


    LP.action('jobs-lang', function () {
        var lang = $(this).data('lang');

        $('.pop_jobcon_inner .jobcontent').hide()
            .filter('.content_' + lang)
            .show();
        return false;
    });


    LP.action('pageback', function () {
        urlManager.back();
        return false;
    });
    LP.action('myBack', function () {
        urlManager.myBack();
        return false;
    });

    LP.action('jobFilter', function () {
        var target = $(event.target);

        if (target.prop('tagName') == 'LABEL') {
            target.parent().siblings('li').find('input[type="checkbox"]:checked + label').click();
        }

        function showWarning() {
            var warning = "<p class='job-warning' style='opacity:0;'>No positions available at this time</p>";
            $('.job-warning').size() || ($('.sec_jobs').append(warning), $('.job-warning').animate({opacity:1}));
        }

        function hideWarning() {
            $('.job-warning').fadeOut(function () {
                $('.job-warning').remove();
            });
        }

        setTimeout(function () {
            if ((input = $('.f-c').find('input[type="checkbox"]:checked')).size()) {
                var el = $('.jobslist > div');
                if (!el.data('fadeUp')) {
                    $('.jobslist > div').css({'margin-top':0, 'opacity': 1});
                    el.data('fadeUp', true);
                }
                var jobCounter = 0;
                el.each(function () {
                    if ($(this).data('city') != input.data('city')) {
                        $(this).stop(true, true).animate({
                            'margin-top': 50,
                            'opacity': 0
                        }).hide();
                    }
                    else {
                        hideWarning();
                        $(this).stop(true, true).show().css({'opacity': 0, 'margin-top': 50}).animate({
                            'margin-top': 0,
                            'opacity': 1
                        });
                        jobCounter += 1;
                    }
                });

                if (jobCounter <= 0) {
                    showWarning();
                }
            }
            else {
                hideWarning();
                $('.jobslist > div').each(function () {
                    $(this).stop(true, true).show().animate({
                        'margin-top': 0,
                        'opacity': 1
                    });
                });
            }
        });

    });

});
//
//$(function(){
//    function bio_hide(){
//        if(window.location.href.indexOf('bio')>0){
//            $('.banpho-bt a').hide();
//            $('.banpho-i').hide();
//            $('.showreel-tit').css('visibility','hidden');
//        }
//    }
//    bio_hide();
//
//    $('.nav a').click(function(){
//        console.log(window.location.href);
//        bio_hide();
//    });
//})
