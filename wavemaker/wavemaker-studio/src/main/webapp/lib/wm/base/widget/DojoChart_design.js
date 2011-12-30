/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

dojo.provide("wm.base.widget.DojoChart_design");
dojo.require("wm.base.widget.DojoChart");




/* TODO: Localize */
 

// design only...
wm.Object.extendSchema(wm.DojoChart, {
    /* Ignored group */
	variable: { ignore: 1 },
	dojoDiv:{ignore:1},
	caption:{ignore:1},
	disabled:{ignore:1},
	dataValue:{ignore:1},
	defaultValuesX:{ignore:1},
	defaultValuesY:{ignore:1},
	addedSeries:{ignore:1},
	aniHighlight:{ignore:1},
	aniShake:{ignore:1},
	magnify:{ignore:1},
	aniTooltip:{ignore:1},
	xLabels:{ignore:1},
	legendDiv:{ignore:1},
	legend:{ignore:1},

    /* widgetName group */
    dataSet: {writeonly: 1, bindTarget: 1, group: "widgetName", subgroup: "data", order: 10, requiredGroup:1,isList: true},

    xAxis: {group: "widgetName", subgroup: "xaxis", order: 20,requiredGroup:1, editor: "wm.prop.FieldList"},
    includeX: {group: "widgetName", subgroup: "xaxis", order: 21, advanced:1},
    xAxisLabelLength: {group: "widgetName", subgroup: "xaxis", order: 22, advanced:1},
    xMajorTickStep:  {group: "widgetName", subgroup: "xaxis", order: 23, advanced:1},
    xMinorTicks:   {group: "widgetName", subgroup: "xaxis", order: 24, advanced:1},
    xMinorTickStep:  {group: "widgetName", subgroup: "xaxis", order: 25, advanced:1},
    xdisplay:    {group: "widgetName", subgroup: "xaxis", order: 30 }, // shows the display property
    xformat:     {group: "widgetName",subgroup: "xaxis", order: 31, editor: "wm.prop.FormatterEditor"}, // shows the properties made available by the display property    


    yAxis: {group: "widgetName", subgroup: "yaxis",  order: 30,requiredGroup:1, editor: "wm.prop.FieldList"},
    includeY: {group: "widgetName", subgroup: "yaxis",  order: 35, advanced:1},
    yAxisTitle: {group: "widgetName", subgroup: "yaxis",  order: 35},
    yUpperRange: {group: "widgetName", subgroup: "yaxis",  order: 36, advanced:1},
        //isTimeXAxis: {group: "edit", order: 21, type: "string"},
    ydisplay:    {group: "widgetName", subgroup: "yaxis", order: 30 }, // shows the display property
    yformat:     {group: "widgetName",subgroup: "yaxis", order: 31, editor: "wm.prop.FormatterEditor"}, // shows the properties made available by the display property    
    
    maxTimePoints: {group: "widgetName", subgroup: "display", order: 22, advanced:1},
    chartColor: {group: "widgetName", subgroup: "display", order: 40},
    chartType: {group: "widgetName", subgroup: "behavior", order: 10, options:  [
  	"Columns",
	"ClusteredColumns",
	"StackedColumns",
	"Bars",
	"ClusteredBars",
	"StackedBars",
	"Areas",
	"StackedAreas",
	"Pie",
	"Lines"
    ]},
    theme: {group: "widgetName", subgroup: "display", order: 20, options: [
      		"GreySkies",
      		"Adobebricks",
      		"Algae",
      		"Bahamation",
      		"BlueDusk",
      		"CubanShirts",
      		"Desert",
      		"Dollar",
      		"Grasshopper",
      		"Grasslands",
      		"IndigoNation",
      		"Ireland",
      		"MiamiNice",
      		"Midwest",
      		"Minty",
      		"PurpleRain",
      		"RoyalPurples",
      		"SageToLime",
      		"Shrooms",
      		"Tufte",
      		"WatersEdge",
      		"Wetland",
      		"PlotKit.blue",
      		"PlotKit.cyan",
      		"PlotKit.green",
      		"PlotKit.orange",
      		"PlotKit.purple",
      		"PlotKit.red"
    ]},
    gap: {group: "widgetName", subgroup: "display"},
    hideLegend: {group: "widgetName", subgroup: "legend", advanced:1},
    legendHeight: {group: "widgetName", subgroup: "legend", advanced:1},
    legendWidth: {group: "widgetName", subgroup: "legend", advanced:1},
    verticalLegend: {group: "widgetName", subgroup: "legend", advanced:1},
    
    includeGrid: {group: "widgetName", subgroup: "display", advanced:1},
    enableAnimation: {group: "widgetName", subgroup: "display", advanced:1},
    chartTitle: {group: "widgetName", subgroup: "display", advanced:1},
    
	addSilverlight:{ignore:1}
});

wm.DojoChart.description = "A dojo chart.";

wm.DojoChart.extend({
    scrim: true,
    themeable: false,
	makePropEdit: function(inName, inValue, inEditorProps) {
	    switch (inName) {
	    case "xdisplay":
		var funcName = this.generateEventName("onReadOnlyNodeFormat");
		var customFunction = (this.xformatter == funcName) ? funcName : "Custom Function";
		inEditorProps.options = ["", customFunction].concat(wm.formatters);
		inEditorProps.displayField = inEditorProps.dataField = "dataValue";
		inEditorProps.restrictValues = false;
		return new wm.SelectMenu(inEditorProps);
	    case "ydisplay":
		var funcName = this.generateEventName("onReadOnlyNodeFormat");
		var customFunction = (this.yformatter == funcName) ? funcName : "Custom Function";
		inEditorProps.options = ["", customFunction].concat(wm.formatters);
		inEditorProps.displayField = inEditorProps.dataField = "dataValue";
		inEditorProps.restrictValues = false;
		return new wm.SelectMenu(inEditorProps);

	    }
	    return this.inherited(arguments);
	},
    set_xdisplay: function(inDisplay) {
	if (this.xdisplay == inDisplay)
	    return;
	this.xdisplay = inDisplay;
	var ctor = this.xdisplay ? wm.getFormatter(this.xdisplay) : null;
	if (this.components.xformat)
	    this.components.xformat.destroy();

	var funcName = this.generateEventName("onReadOnlyNodeFormat");
	if (this.xdisplay == "Custom Function" || this.xdisplay == funcName) {
	    this.xdisplay = funcName;
	    eventEdit(this, "onFormat", funcName, this.owner == studio.application, "inValue");
	    } else if (ctor) {
		var ctor = wm.getFormatter(this.xdisplay);
		new ctor({name: "xformat", owner: this});
	    } 
	this.renderDojoObj(); // If there was a formatter on it before chaning the display property, we need to show that this formatter no longer is applied
	},
    set_ydisplay: function(inDisplay) {
	if (this.ydisplay == inDisplay)
	    return;
	this.ydisplay = inDisplay;
	var ctor = this.ydisplay ? wm.getFormatter(this.ydisplay) : null;
	if (this.components.yformat)
	    this.components.yformat.destroy();

	var funcName = this.generateEventName("onReadOnlyNodeFormat");
	if (this.ydisplay == "Custom Function" || this.ydisplay == funcName) {
	    this.ydisplay = funcName;
	    eventEdit(this, "onFormat", funcName, this.owner == studio.application, "inValue");
	    } else if (ctor) {
		var ctor = wm.getFormatter(this.ydisplay);
		new ctor({name: "yformat", owner: this});
	    } 
	this.renderDojoObj(); // If there was a formatter on it before chaning the display property, we need to show that this formatter no longer is applied
	},

    set_hideLegend: function(inHide) {
	this.hideLegend = inHide;
	this.legendHeight = inHide ? "0px" : "50px";
	this.renderDojoObj();
    },
    set_yAxisTitle: function(inTitle) {
	this.yAxisTitle = inTitle;
	this.renderDojoObj();
    },
    set_chartTitle: function(inTitle) {
	this.chartTitle = inTitle;
	this.renderDojoObj();
    },
    set_verticalLegend: function(inVert) {
	this.verticalLegend = inVert;
	this.renderDojoObj();
    },
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);
	},
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderDojoObj();
	},
	set_xAxis: function(inValue){
	    this.xAxis = dojo.isArray(inValue) ? inValue.join(",") : inValue;
		this.renderDojoObj();
	},
	set_yAxis: function(inValue){
	    this.yAxis = dojo.isArray(inValue) ? inValue.join(",") : inValue;
		this.renderDojoObj();
	},
    get_xAxis: function() {
	return this.xAxis ? this.xAxis.split(",") : [];
    },
    get_yAxis: function() {
	return this.yAxis ? this.yAxis.split(",") : [];
    },
	setYUpperRange: function(inValue){
		this.yUpperRange = inValue;
		this.renderDojoObj();
	},
	setChartColor: function(inValue){
		if (inValue.indexOf(',') != -1 || this.chartType != 'Pie')
			this.chartColor = inValue.split(',');
		else
			this.chartColor = inValue;
		this.renderDojoObj();
	},
    listProperties: function() {
	var p = this.inherited(arguments);
	p.legendHeight.ignoretmp = this.verticalLegend;
	p.legendWidth.ignoretmp =  !this.verticalLegend;
	return p;
    },
	setTheme:function(inValue){
		this.theme = inValue;
		this.setChartTheme();
		var self = this;
		dojo.addOnLoad(function(){
			self.dojoRenderer();
		});
	},
	setChartType: function(inValue){
	    this.chartType = inValue;
	    this.renderDojoObj();
	},
	setLegendHeight: function(inValue){
		this.legendHeight = inValue;
		this.updateChartSize();
	},
	setLegendWidth: function(inValue){
		this.legendWidth = inValue;
		this.renderDojoObj();
	},
    setXAxisLabelLength: function(inLen) {
	this.xAxisLabelLength = inLen;
	this.renderDojoObj();
    },
	addUserClass: function(arg1, arg2){
		this.inherited(arguments);
		this.updateStyle();
	},
	removeUserClass: function(arg1, arg2){
		this.inherited(arguments);
		this.updateStyle();
	},
	updateStyle: function() { 
		this.setIncludeX(this.includeX);
		this.setIncludeY(this.includeY);
	},
	setIncludeX: function(inValue){
		this.includeX = inValue;
		if (this.includeX)
		{
			this.addXAxis();
		}
		else
		{
			this.dojoObj.removeAxis("x");
		}
		this.dojoRenderer();
	},
	setIncludeY: function(inValue){
		this.includeY = inValue;
		if (this.includeY)
		{
			var yProp = {vertical: true, natural: true, includeZero: true, fixUpper: "minor"};
			var fontProp = this.getFontProperty();
			if (fontProp)
				dojo.mixin(yProp, fontProp);

			this.dojoObj.addAxis("y", yProp);
		}
		else
		{
			this.dojoObj.removeAxis("y");
		}
		this.dojoRenderer();
	},
	setIncludeGrid:function(inValue){
		this.includeGrid = inValue;
		if(this.includeGrid)
		{
			this.dojoObj.addPlot("grid", {type: "Grid", hMinorLines: true, vMinorLines: true});
		}
		else
		{
			this.dojoObj.removePlot("grid");
		}
		
		this.dojoRenderer();
	},
	setGap:function(inValue){
		this.gap = inValue;
		this.updateChartType();
		this.dojoRenderer();
	},
	setEnableAnimation: function (inValue){
		this.enableAnimation = inValue;
		this.addAnimation();
		this.dojoRenderer();
	},

	designResize: function(inBounds){
		this.inherited(arguments);
		this.updateChartSize();
	},
	setSizeProp: function(n, v){
		this.inherited(arguments);
		this.updateChartSize();
	},
	updateChartSize: function(){
		if (this.dojoObj != null)
		{
			this.updateChartDivHeight();
			this.dojoObj.resize();
			this.dojoObj.render();
		}
	}
});

