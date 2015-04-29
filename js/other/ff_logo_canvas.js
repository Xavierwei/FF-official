(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 14,
	height: 14,
	fps: 80,
	color: "#FFFFFF",
	manifest: []
};

// stage content:
(lib._2 = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// Actions
	this.instance = new lib.FF();
	this.instance.setTransform(6.1,8.1,0.293,0.293,0,0,0,-4.2,3.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(64));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1.4,5.5,22.7,19.1);


// symbols:
(lib.Tween11 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AlXFFIAAqJIKvAAIAAKJg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-34.4,-32.5,68.9,65.1);


(lib.Tween10 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhbAcIAAg3IC3AAIAAA3g");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-9.2,-2.8,18.4,5.6);


(lib.Tween9 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhbAcIAAg3IC3AAIAAA3g");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-9.2,-2.8,18.4,5.6);


(lib.Tween8 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AghAvIAAhdIBEAAIAABdg");
	this.shape.setTransform(-3.4,0,1,1,0,0,0,-3.4,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-3.5,-4.7,7,9.4);


(lib.Tween7 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AghAvIAAhdIBEAAIAABdg");
	this.shape.setTransform(-3.4,0,1,1,0,0,0,-3.4,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-3.5,-4.7,7,9.4);


(lib.Tween2 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ah2AjIAAhGIDtAAIAABGg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.9,-3.6,23.8,7.2);


(lib.Tween1 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ah2AjIAAhGIDtAAIAABGg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.9,-3.6,23.8,7.2);


(lib.Symbol1 = function() {
	this.initialize();

	// Layer 1
	this.instance = new lib.Tween11("synched",0);
	this.instance.setTransform(34.5,32.6);
	this.instance.alpha = 0.012;

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,68.9,65.1);


(lib.FF = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_63 = function() {
		this.stop();
		this.F.addEventListener("mouseover", fl_ClickToGoToAndPlayFromFrame_4.bind(this));
		function fl_ClickToGoToAndPlayFromFrame_4()
		{
			this.gotoAndPlay(1);
		}
		this.F.addEventListener("click", fl_ClickToGoToWebPage);
		
		function fl_ClickToGoToWebPage() {
			//window.open("http://www.adobe.com", "_target");
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(63).call(this.frame_63).wait(1));

	// Layer 2
	this.F = new lib.Symbol1();
	this.F.setTransform(0.1,3.6,1,1,0,0,0,34.5,32.5);
	this.F.compositeOperation = "lighter";
	new cjs.ButtonHelper(this.F, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.F).wait(64));

	// 1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AjvDwIAAneIAzAAIAAgBIGsAAIAAA2ImsAAIAAGpg");

	// 2
	this.instance = new lib.Tween1("synched",0);
	this.instance.setTransform(-30.9,31.4,1,1,0,0,0,0,3.7);

	this.instance_1 = new lib.Tween2("synched",0);
	this.instance_1.setTransform(-30.9,31.5,5.521,7.5,0,0,0,0,3.8);

	this.instance.mask = this.instance_1.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},11).to({state:[{t:this.instance_1}]},12).wait(41));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:3.8,scaleY:7.5,y:31.5},11).to({_off:true,scaleX:5.52},12).wait(41));

	// 3 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	mask_1.graphics.p("AjVAdIAAg5IGsAAIAAA5g");
	mask_1.setTransform(2.5,3);

	// 4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AghAvIAAhdIBEAAIAABdg");
	this.shape.setTransform(-25.9,2.6,1,1,0,0,0,-3.4,0);

	this.instance_2 = new lib.Tween7("synched",0);
	this.instance_2.setTransform(-25.9,2.6,1,1,0,0,0,-3.4,0);
	this.instance_2._off = true;

	this.instance_3 = new lib.Tween8("synched",0);
	this.instance_3.setTransform(-25.8,2.7,7.324,1,0,0,0,-3.3,0.1);

	this.shape.mask = this.instance_2.mask = this.instance_3.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.instance_2}]},25).to({state:[{t:this.instance_3}]},10).wait(29));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(25).to({_off:false},0).to({_off:true,regX:-3.3,regY:0.1,scaleX:7.32,x:-25.8,y:2.7},10).wait(29));

	// 5 (mask)
	var mask_2 = new cjs.Shape();
	mask_2._off = true;
	mask_2.graphics.p("AgdDXIAAi2IAAj2IA7AAIAAGsg");
	mask_2.setTransform(3,2.5);

	// 6
	this.instance_4 = new lib.Tween9("synched",0);
	this.instance_4.setTransform(3.4,29.7,1,1,0,0,0,-0.1,2.9);
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween10("synched",0);
	this.instance_5.setTransform(3.5,29.7,1,9.439,0,0,0,0,2.9);

	this.instance_4.mask = this.instance_5.mask = mask_2;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_4}]},31).to({state:[{t:this.instance_5}]},18).wait(15));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(31).to({_off:false},0).to({_off:true,regX:0,scaleY:9.44,x:3.5},18).wait(15));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-28.9,68.9,65.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;