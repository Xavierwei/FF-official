seajs.config({
  // 配置 shim 信息，这样我们就可以通过 require("jquery") 来获取 jQuery
  //plugins: ['shim']

  shim: {
    // for jquery
    jquery: {
      src: "/js/jquery/jquery-1.8.3.min.js"
      , exports: "jQuery"
    }
    ,handlebars: {
      src: "/js/handlebars/handlebars-v1.1.2.js"
      , exports: "Handlebars"
    }
    ,easing:{
      src: "/js/plugin/jquery.easing.1.3.js"
      , deps: ['jquery']
    }
	,transit:{
	  src: "/js/plugin/jquery.transit.min.js"
	  , deps: ['jquery']
	}
    ,isotope:{
      src: "/js/plugin/jquery.isotope.min.js"
      , deps: ['jquery']
    }
    ,jscrollpane:{
      src: "/js/plugin/jquery.jscrollpane.js"
      , deps: ['jquery']
    }
    ,mousewheel:{
      src: "/js/plugin/jquery.mousewheel.js"
      , deps: ['jquery']
    }
    ,uiwidget: {
      src: "/js/plugin/jquery.ui.widget.js"
      , deps: ['jquery']
    }
    ,uicustom: {
        src: "/js/plugin/jquery-ui-1.10.3.custom.js"
        , deps: ['jquery']
    }
    ,fileupload:{
      src: "/js/plugin/jquery.fileupload.js"
      , deps: ['jquery','uiwidget']
    }
    ,form:{
      src: "/js/plugin/jquery.form.js"
      , deps: ['jquery']
    }
    ,validate:{
      src: "/js/plugin/jquery.validate.js"
      , deps: ['jquery']
    }
    ,raphael:{
      src: "/js/raphael/raphaeljs.min.js"
      , deps: ['eve']
      , exports: "Raphael"
    }
    ,"video-js":{
      src: "/js/video-js/video.js"
      , deps: ['/js/video-js/video-js.css']
    }
    ,"flash-detect":{
      src: "/js/plugin/flash_detect_min.js"
    }
    ,"swfupload":{
      src: "/js/plugin/swfupload.js"
    }
    ,"swfupload-speed":{
      src: "/js/plugin/swfupload.speed.js"
    }
    ,"swfupload-queue":{
      src: "/js/plugin/swfupload.queue.js"
    }
    ,hammer:{
      src: "/js/plugin/jquery.hammer.js"
      ,deps: ['jquery']
    }
    ,skrollr:{
      src: "/js/plugin/skrollr.min.js"
    },
    queryloader: {
      src: "/js/plugin/jquery.queryloader22.js",
      deps: ['jquery']
    },
    wavesurfer: {
      src: "/js/plugin/wavesurfer.min.js"
    }
  }
  , alias: {
    api: '/js/api.js?_201403#'
    , eve : '/js/raphael/eve.js'
    , api4sjht: '/js/api4sjht'
    , imgUtil: '/js/util/imgHelper'
    , panel: "/js/panel/panel"
    , autoComplete: '/js/autocomplete/autoComplete'
    , validator: '/js/validator/validator'
    , html2json: '/js/com/html2json'
    , tooltip: '/js/util/tooltip'
  }
});