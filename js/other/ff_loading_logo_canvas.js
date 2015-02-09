(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 48,
	height: 48,
	fps: 80,
	color: "#000000",
	manifest: []
};

// stage content:
(lib.white = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_106 = function() {
		this.gotoAndPlay(1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(106).call(this.frame_106).wait(1));

	// Layer 7
	this.F = new lib.Symbol1();
	this.F.setTransform(24.1,27.6,1,1,0,0,0,34.5,32.5);
	this.F.compositeOperation = "lighter";
	new cjs.ButtonHelper(this.F, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.F).wait(107));

	// 1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AjvDwIAAnfIHeAAIAAA2ImrAAIAAGpg");
	var mask_graphics_106 = new cjs.Graphics().p("AjvDwIAAneIAzAAIAAgBIGrAAIAAA2ImrAAIAAGpg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:24,y:24}).wait(106).to({graphics:mask_graphics_106,x:24,y:24}).wait(1));

	// 2
	this.instance = new lib.Tween1("synched",0);
	this.instance.setTransform(-6.9,55.4,1,1,0,0,0,0,3.7);

	this.instance_1 = new lib.Tween2("synched",0);
	this.instance_1.setTransform(-6.9,55.5,5.521,7.5,0,0,0,0,3.8);

	this.instance.mask = this.instance_1.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},11).to({state:[{t:this.instance_1}]},12).to({state:[{t:this.instance_1}]},83).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:3.8,scaleY:7.5,y:55.5},11).to({_off:true,scaleX:5.52},12).wait(84));

	// 3 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_0 = new cjs.Graphics().p("Ai8CVIAAg7IGrAAIAAA7g");
	var mask_1_graphics_106 = new cjs.Graphics().p("Ai8CVIAAg7IGrAAIAAA7g");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:mask_1_graphics_0,x:24,y:15}).wait(106).to({graphics:mask_1_graphics_106,x:24,y:15}).wait(1));

	// 4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AghAvIAAhdIBEAAIAABdg");
	this.shape.setTransform(-1.9,26.6,1,1,0,0,0,-3.4,0);

	this.instance_2 = new lib.Tween7("synched",0);
	this.instance_2.setTransform(-1.9,26.6,1,1,0,0,0,-3.4,0);
	this.instance_2._off = true;

	this.instance_3 = new lib.Tween8("synched",0);
	this.instance_3.setTransform(-1.8,26.7,7.324,1,0,0,0,-3.3,0.1);
	this.instance_3._off = true;

	this.shape.mask = this.instance_2.mask = this.instance_3.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.instance_2}]},25).to({state:[{t:this.instance_3}]},10).to({state:[{t:this.instance_3}]},23).to({state:[{t:this.instance_3}]},48).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(25).to({_off:false},0).to({_off:true,regX:-3.3,regY:0.1,scaleX:7.32,x:-1.8,y:26.7},10).wait(72));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(25).to({_off:false},10).to({x:-1.7},23).to({x:-1.8},48).wait(1));

	// 5 (mask)
	var mask_2 = new cjs.Shape();
	mask_2._off = true;
	var mask_2_graphics_0 = new cjs.Graphics().p("ABaDvIAAi1IAAj2IA7AAIAAGrg");
	var mask_2_graphics_106 = new cjs.Graphics().p("ABaDvIAAi1IAAj2IA7AAIAAGrg");

	this.timeline.addTween(cjs.Tween.get(mask_2).to({graphics:mask_2_graphics_0,x:15,y:24}).wait(106).to({graphics:mask_2_graphics_106,x:15,y:24}).wait(1));

	// 6
	this.instance_4 = new lib.Tween9("synched",0);
	this.instance_4.setTransform(27.4,53.7,1,1,0,0,0,-0.1,2.9);
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween10("synched",0);
	this.instance_5.setTransform(27.5,53.7,1,9.439,0,0,0,0,2.9);
	this.instance_5._off = true;

	this.instance_4.mask = this.instance_5.mask = mask_2;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(31).to({_off:false},0).to({_off:true,regX:0,scaleY:9.44,x:27.5},18).wait(58));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(31).to({_off:false},18).to({startPosition:0},57).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(13.6,19.1,68.9,65.1);


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
	this.shape.graphics.f("#FFFFFF").s().p("AhaAbIAAg1IC1AAIAAA1g");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-9.2,-2.8,18.4,5.6);


(lib.Tween9 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhaAbIAAg1IC1AAIAAA1g");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-9.2,-2.8,18.4,5.6);


(lib.Tween8 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgiAuIAAhbIBFAAIAABbg");
	this.shape.setTransform(-3.4,0,1,1,0,0,0,-3.4,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-3.5,-4.7,7,9.4);


(lib.Tween7 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgiAuIAAhbIBFAAIAABbg");
	this.shape.setTransform(-3.4,0,1,1,0,0,0,-3.4,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-3.5,-4.7,7,9.4);


(lib.Tween2 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ah1AmIAAhLIDrAAIAABLg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.9,-3.8,23.8,7.7);


(lib.Tween1 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ah1AmIAAhLIDrAAIAABLg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.9,-3.8,23.8,7.7);


(lib.Symbol1 = function() {
	this.initialize();

	// Layer 1
	this.instance = new lib.Tween11("synched",0);
	this.instance.setTransform(34.5,32.6);
	this.instance.alpha = 0.012;

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,68.9,65.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;