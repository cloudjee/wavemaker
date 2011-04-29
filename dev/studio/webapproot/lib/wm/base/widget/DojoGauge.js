dojo.provide("wm.base.widget.DojoGauge");

dojo.declare("wm.DojoGauge", wm.Control, {

    useOverlayImage: true,
    lowRangeMin: 0,
    lowRangeMax: 20,
    lowRangeColor: "#FFFF00",
    
    midRangeMax: 80,
    midRangeColor: "#BCDE53",

    highRangeMax: 100,
    highRangeColor: "#FF6B0A",

    arrowColor1: "#0000FF",
    arrowColor2: "#008888",
    arrowColor3: "#000000",
    currentValue1: 0,
    currentValue2: 0,
    currentValue3: 0,
    useSecondIndicator: false,
    useThirdIndicator: false,

    width: "320px",
    height: "180px",
    margin: "4",
    init: function() {
	this.inherited(arguments);
	dojo.require('dojox.widget.AnalogGauge');
	dojo.require('dojox.widget.gauge.AnalogArrowIndicator');	
    },
    postInit: function() {
	this.inherited(arguments);
	this.createGauge();
    },
    createGauge: function(){
	if (this.gauge) this.gauge.destroy();
	if (this.valueIndicator1) this.valueIndicator1.destroy();	
	if (this.valueIndicator2) this.valueIndicator2.destroy();	
	if (this.valueIndicator3) this.valueIndicator3.destroy();	
	if(this.gaugeNode) dojo.destroy(this.gaugeNode);
	    	
	this.gaugeNode = dojo.create('div', {}, this.domNode);
	if (!this.currentValue1) 
	    this.currentValue1 = this.lowRangeMin;

	var gFill = {'type': 'linear', 'x1': 50, 'x2': 0, 'y2': 0, 'y1': 200, 'colors': [{offset: 0, color: "#FFFFFF"}, {offset: 1, color: "white"}] };
	if (this.useOverlayImage)
	    var gImage = {url: dojo.moduleUrl("wm.base.widget.themes.default.images").path + "gaugeOverlay.png",width: 280,height: 155,x: 10,y: 32,overlay: true}; 
	var gMajorTick = {length: 5, interval: 10, offset: 125, font: {family: "Arial", style: "italic", variant: 'small-caps', size: "13px"} };
	var ranges = [{low:this.lowRangeMin, high:this.lowRangeMax, color: this.lowRangeColor}, {low:this.lowRangeMax, high:this.midRangeMax, color: this.midRangeColor}, {low:this.midRangeMax, high:this.highRangeMax, color: this.highRangeColor}];

	gauge = this.gauge = new dojox.widget.AnalogGauge({
	    width: 320,
	    height: 200,
	    cx: 150,
	    cy: 169,
	    radius: 125,
	    background: gFill,
	    image: dojo.isIE || !this.useOverlayImage ? "" : gImage, // TODO: Test in chrome and IE for both values of useOverlayImage
	    ranges: ranges,
	    useRangeStyles: 0,
	    majorTicks: gMajorTick
	}, this.gaugeNode);
	gauge.startup();

	this.valueIndicator1 = new dojox.widget.gauge.AnalogArrowIndicator({
	    value: this.currentValue1,
	    width: 3,
	    hover:'Value: ' + this.currentValue1, 
	    color: this.arrowColor1,
	    easing: dojo.fx.easing.bounceOut
	});
	if (this.useSecondIndicator) {
	this.valueIndicator2 = new dojox.widget.gauge.AnalogArrowIndicator({
	    value: this.currentValue2,
	    width: 3,
	    hover:'Value: ' + this.currentValue2, 
	    color: this.arrowColor2,
	    easing: dojo.fx.easing.bounceOut
	});
	}
	if (this.useThirdIndicator) {
	this.valueIndicator3 = new dojox.widget.gauge.AnalogArrowIndicator({
	    value: this.currentValue3,
	    width: 3,
	    hover:'Value: ' + this.currentValue3, 
	    color: this.arrowColor3,
	    easing: dojo.fx.easing.bounceOut
	});
	}
	try {
	    gauge.addIndicator(this.valueIndicator1);
	} catch(e){}
	try {
	    if (this.valueIndicator2)
		gauge.addIndicator(this.valueIndicator2);
	} catch(e){}
	try {
	    if (this.valueIndicator3)
		gauge.addIndicator(this.valueIndicator3);
	} catch(e){}
	wm.onidle(this, function() {
	    this.valueIndicator1.currentValue = this.currentValue1
	    this.valueIndicator1.update(this.currentValue1);
	    this.valueIndicator1.draw(true);
	    if (this.valueIndicator2) {
		this.valueIndicator2.currentValue = this.currentValue2
		this.valueIndicator2.update(this.currentValue2);
		this.valueIndicator2.draw(true);
	    }
	    if (this.valueIndicator3) {
		this.valueIndicator3.currentValue = this.currentValue3
		this.valueIndicator3.update(this.currentValue3);
		this.valueIndicator3.draw(true);
	    }

	});
    },
    setCurrentValue1: function(inValue) {
	this.currentValue1 = inValue;
	if (this.valueIndicator1)
	    this.valueIndicator1.update(this.currentValue1);	    
    },

    setCurrentValue2: function(inValue) {
	this.currentValue2 = inValue;
	if (this.valueIndicator2)
	    this.valueIndicator2.update(this.currentValue2);	    
    },

    setCurrentValue3: function(inValue) {
	this.currentValue3 = inValue;
	if (this.valueIndicator3)
	    this.valueIndicator3.update(this.currentValue3);	    
    },

    /* Design time only */
    setUseOverlayImage: function(inUse) {
	this.useOverlayImage = inUse;
	this.createGauge();
    },
    setLowRangeMin: function(inVal) {
	this.lowRangeMin = inVal;
	this.createGauge();
    },
    setLowRangeMax: function(inVal) {
	this.lowRangeMax = inVal;
	this.createGauge();

    },
    setLowRangeColor: function(inVal) {
	this.lowRangeColor = inVal;
	this.createGauge();
    },


    setMidRangeMax: function(inVal) {
	this.midRangeMax = inVal;
	this.createGauge();
    },
    setMidRangeColor: function(inVal) {
	this.midRangeColor = inVal;
	this.createGauge();
    },


    setHighRangeMax: function(inVal) {
	this.highRangeMax = inVal;
	this.createGauge();
    },
    setHighRangeColor: function(inVal) {
	this.highRangeColor = inVal;
	this.createGauge();
    },

    setUseSecondIndicator: function(inUse) {
	this.useSecondIndicator = inUse;
	this.createGauge();
    },
    setUseThirdIndicator: function(inUse) {
	this.useThirdIndicator = inUse;
	this.createGauge();
    },
    setArrowColor1: function(inVal) {
	this.arrowColor1 = inVal;
	this.createGauge();
    },
    setArrowColor2: function(inVal) {
	this.arrowColor2 = inVal;
	this.createGauge();
    },
    setArrowColor3: function(inVal) {
	this.arrowColor3 = inVal;
	this.createGauge();
    },

    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	props.currentValue2.ignoretmp = props.arrowColor2.ignoretmp = !this.useSecondIndicator;
	props.currentValue3.ignoretmp = props.arrowColor3.ignoretmp = !this.useThirdIndicator;
	return props;
    },
    destroy: function(){
      this.valueIndicator1.destroy();
      this.gauge.destroy();
      this.inherited(arguments);
    },
    _end: 0
});


wm.Object.extendSchema(wm.DojoGauge, {
    gaugeNode: {ignore: 1},
    gauge: {ignore: 1},
    valueIndicator1: {ignore: 1},
    lowRangeColor: {group: "gauge", order: 1},
    lowRangeMin:   {group: "gauge", order: 2},
    lowRangeMax:   {group: "gauge", order: 3},
    midRangeColor: {group: "gauge", order: 4},
    midRangeMax: {group: "gauge", order: 5},
    highRangeColor: {group: "gauge", order: 6},
    highRangeMax: {group: "gauge", order: 7},
    useOverlayImage: {group: "gauge", order: 20},

    currentValue1: {group: "indicator", order: 1, bindTarget: 1},
    arrowColor1: {group: "indicator", order: 2},
    useSecondIndicator: {group: "indicator", order: 4},
    currentValue2: {group: "indicator", order: 5, bindTarget: 1},
    arrowColor2: {group: "indicator", order: 6},
    useThirdIndicator: {group: "indicator", order: 7},
    currentValue3: {group: "indicator", order: 8, bindTarget: 1},
    arrowColor3: {group: "indicator", order: 9}
});