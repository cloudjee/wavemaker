/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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


var chartThemes = [
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
      	];

/* TODO: Localize */
var chartTypes = [
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
                  ];


// design only...
wm.Object.extendSchema(wm.DojoChart, {
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
	dataSet: {bindTarget: 1, group: "edit", order: 10, isList: true},
	xAxis: {group: "edit", order: 20},
        //isTimeXAxis: {group: "edit", order: 21, type: "string"},
	maxTimePoints: {group: "edit", order: 22},
	yAxis: {group: "edit", order: 30},
	chartColor: {group: "edit", order: 40},
	chartType: {order: 10},
	theme: {order: 20},
	addSilverlight:{ignore:1}
});

wm.DojoChart.description = "A dojo chart.";

wm.DojoChart.extend({
    themeable: false,
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
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "theme":
				return makeSelectPropEdit(inName, inValue, chartThemes, inDefault);
			case "chartType":
				return makeSelectPropEdit(inName, inValue, chartTypes, inDefault);
/*
		case "isTimeXAxis":		    
		    return makeSelectPropEdit(inName, inValue, ["", "hh:mm:ss", "hh:mm", "hh"], inDefault);
		    */
		}
		return this.inherited(arguments);
	},
	setXAxis: function(inValue){
		this.xAxis = inValue;
		this.renderDojoObj();
	},
	setYAxis: function(inValue){
		this.yAxis = inValue;
		this.renderDojoObj();
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
		this.updateChartType();
		this.dojoRenderer();
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

