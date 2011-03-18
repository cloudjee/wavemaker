/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.widget.DojoChart");

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

dojo.declare("wm.DojoChart", wm.Control, {
	padding: 4,
	width:'200px',
	height:'200px',
	legendHeight:'50px',
	variable:null,
	dataSet:null,
	dojoObj:null,
	theme: 'CubanShirts',
	xAxis:'wmDefaultX',
	isTimeXAxis: "",
	maxTimePoints:15,
	xMajorTickStep: 5,
	xMinorTicks:false,
	xMinorTickStep:1,

	yAxis:'wmDefaultY',
	yUpperRange:'',
	chartColor:'',
	includeX: true,
	includeY:true,
	enableAnimation:true,
	chartType: 'Columns',
	includeGrid:false,
	gap:2,
	defaultXY:[{'wmDefaultX':'Jan', 'wmDefaultY':3}, {'wmDefaultX':'Feb', 'wmDefaultY':5}, {'wmDefaultX':'Mar', 'wmDefaultY':8}, {'wmDefaultX':'Apr', 'wmDefaultY':2}],
	addedSeries:{},
	aniHighlight:null,
	aniShake:null,
	magnify:null,
	aniTooltip:null,
	addSilverlight:false,
	
	init: function() {
		if (this.showAddSilverlight())
			return;
	
		dojo['require']("dojox.charting.Chart2D");
		dojo['require']("dojox.charting.widget.Legend");
		dojo['require']("dojox.charting.action2d.Highlight");
		dojo['require']("dojox.charting.action2d.Magnify");
		dojo['require']("dojox.charting.action2d.MoveSlice");
		dojo['require']("dojox.charting.action2d.Shake");
		dojo['require']("dojox.charting.action2d.Tooltip");
		dojo['require']("dojo.fx.easing");
		this.inherited(arguments);
	},
	postInit: function() {
		this.inherited(arguments);
	},
	renderDojoObj: function() {
		if (this._loading || this.addSilverlight){
			return;
		}

		if (this.dojoObj != null)
		{
			this.dojoObj.destroy();
			while(this.domNode.childNodes.length > 0)
			{
				this.domNode.removeChild(this.domNode.childNodes[0]);
			}
		}
		
		this.dojoDiv = dojo.doc.createElement('div');
		this.updateChartDivHeight();
		this.domNode.appendChild(this.dojoDiv);
		this.dojoObj = new dojox.charting.Chart2D(this.dojoDiv);
		this.setChartTheme();
		this.updateChartType();
		this.addXAxis();
		this.addYAxis();
		if(this.includeGrid){
			this.dojoObj.addPlot("grid", {type: "Grid", hMinorLines: true, vMinorLines: true});
		}

		this.addAnimation();
		this.addChartSeries();
		var self = this;
		dojo.addOnLoad(function(){
			self.dojoRenderer();
			self.connectDojoEvents();
		});
	},
    renderBounds: function() {
		this.inherited(arguments);
	    this.resizeDijit();
	},
	resizeDijit: function() {
		/*
		if (this.dojoObj)
			this.dojoObj.resize();
		*/
		this.renderDojoObj();
	},
	createLegend: function(){
		if (this.legend && this.legend != null)
			this.legend.destroy();

		this.legendDiv = dojo.doc.createElement('div');
		dojo.attr(this.legendDiv,'align','center');
		this.domNode.appendChild(this.legendDiv);
            try {
		this.legend = new dojox.charting.widget.Legend({chart: this.dojoObj}, this.legendDiv);
            } catch(e) {}
	},
	updateChartDivHeight: function(){
		if (!this.dojoDiv)
			return;
		var h = dojo.coords(this.domNode).h;
		var lh = wm.splitUnits(this.legendHeight);
		var l = lh.value;
		var reducedHeight = h - l;
		if (reducedHeight > 0 )
		{
			// For IE8(Compatibility mode(IE7) height cannot be negetive else it throws js error)
			this.dojoDiv.style.width = this.width;
			this.dojoDiv.style.height = reducedHeight + 'px';
		}
	},
	dojoRenderer: function (){
		if (!this.dojoObj)
			return;
		try{this.dojoObj.render();}catch(e){/*do nothing since some object might now have render method*/}
		this.createLegend();
	},
	connectDojoEvents: function(){
		this.dojoObj.connectToPlot("default", dojo.hitch(this, 'dojoChartEvent'));		
	},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){
		this.variable = inValue;
		if(!this.variable || !this.variable.getData())
			return;
			
		var thisObj = this;
		if (this.isTimeXAxis && this.dojoObj)
			this.incrementSeries();
		else
			dojo.addOnLoad(function(){thisObj.renderDojoObj();});
	},
	addChartSeries: function(isUpdate){
		this.updateXLabelSet();
		dojo.forEach(this.yAxis.split(','), function(columnName, idx){
			try{
				columnName = dojo.trim(columnName);
				if (!columnName)
					return;
				var columnData = this.getColumnDataSet(columnName);
				var seriesName = wm.capitalize(columnName);
				if (isUpdate && this.addedSeries[seriesName] && this.addedSeries[seriesName].length > 0){
					columnData = this.addedSeries[seriesName].concat(columnData);
					while (columnData.length > this.maxTimePoints) {
						columnData.shift();
					}
				}
				
				if (this.chartColor instanceof Array)
					var color = this.chartColor[idx];
				if (color && color != '' && this.chartType != 'Pie')
					this.dojoObj.addSeries(seriesName, columnData, {stroke:{width:0}, fill:color});
				else if (!isUpdate)
					this.dojoObj.addSeries(seriesName, columnData);
				else
					this.dojoObj.updateSeries(seriesName, columnData);
				this.addedSeries[seriesName] = columnData;
			} catch(e){
				console.info('Error while making chartdata', e);
			}
 
		}, this);
	},
	getChartDataSet: function(){
		if (this.xAxis == 'wmDefaultX' && this.yAxis == 'wmDefaultY')
			return this.defaultXY;
		if (!this.variable || this.variable == '')
			return [];
		var ds = this.variable.getData();
		if (ds && !(ds instanceof Array))
			ds = [ds];

    if (this.xAxis == 'wmDefaultX' || this.yAxis == 'wmDefaultY'){
      if (this.xAxis == 'wmDefaultX')
			 var axis = 'wmDefaultX';
			else
			 var axis = 'wmDefaultY';
      dojo.forEach(ds, function(obj, i){
				if (i >= this.defaultXY.length)
					return;
				ds[i][axis] = this.defaultXY[i][axis];
			}, this);      
    }   

		return ds;
	},
	updateXLabelSet: function (){
		if (this.isTimeXAxis)
			return [];
		this.xLabels = {};
		if (this.xAxis == 'wmDefaultX')
		  var ds = this.defaultXY;
		else
		  var ds = this.getChartDataSet();
		
		var x = this.xAxis;
		dojo.forEach(ds, function(obj,idx){
			var label = obj[x];
			this.xLabels[label] = this.addXLabel(label);
		}, this);

		return this.xLabels;
	},
	isPieChart: function(){
		return this.chartType == 'Pie';
	},
	getColumnDataSet: function(columnName){
		var data = [], x = '';
		var ds = this.getChartDataSet();
		var xField = this.xAxis;
		dojo.forEach(ds, function(dataObj, i){
			var obj = {y: columnName in dataObj ? dataObj[columnName] : 0};
			if (this.isPieChart()) {
				if (xField != '')
					obj.legend = dataObj[xField];
				if (this.chartColor != '') {
					if (this.chartColor instanceof Array) {
						var color = this.chartColor[i];
						if (color)
							obj.color = color;
					} else {
						obj.color = dataObj[this.chartColor];
					}
				}
			} else {
				if (this.isTimeXAxis)
					x = this.getTimeX();
				else if(xField)
					x = this.xLabels[dataObj[xField]];
				if (x != '')
					obj.x = x;
			}

			data.push(obj);
		}, this);
		
		return data;
	},
	getPieDataSet: function(columnName){
		if ((columnName == 'wmDefaultX' || columnName == 'wmDefaultY') && this.isDesignLoaded()) {
			if (columnName == 'wmDefaultX')
				return this.defaultXY;
			else
				return this.defaultXY;
		}
		
		if (this.variable == null || this.variable == '')
		{
			return [];
		}

		var data = [];
		for (var i = 0; i < this.variable.getCount(); i++)
		{
			var dataObj = this.variable.getItem(i).data;
			if (dataObj && dataObj != null)
			{
				var obj = {y: dataObj[columnName]};
				if (this.xAxis != '')
					obj.legend = dataObj[this.xAxis];
				if (this.chartColor != '')
				{
					if (this.chartColor instanceof Array)
					{
						var color = this.chartColor[i];
						if (color)
							obj.color = color;
					}
					else
					{
						obj.color = dataObj[this.chartColor];
					}
				}
				
				data[data.length] = obj;
			}
		}
		
		return data;
	},
	addXAxis: function(){
		if (!this.includeX){
			this.dojoObj.removeAxis("x");
			return;
		}

		var x = this.dojoObj ? this.dojoObj.getAxis('x') : {}, xParams = {};
		if (x && x.opt)
			xParams = x.opt;
		xParams.minorTicks = this.xMinorTicks;
		var fontProp = this.getFontProperty();
		if (fontProp)
			dojo.mixin(xParams, fontProp);
		if (this.xMajorTickStep)
			xParams.majorTickStep = this.xMajorTickStep;
		if (this.xMinorTickStep)
			xParams.minorTickStep = this.xMinorTickStep;
		this.dojoObj.addAxis("x", xParams);
	},
	addYAxis: function(){
		if(this.includeY){
			var yProp = {vertical: true, natural: true, includeZero: true, fixUpper: "minor"};
			var fontProp = this.getFontProperty();
			if (fontProp)
				dojo.mixin(yProp, fontProp);
			if (this.yLowerRange)
				yProp.min = this.yLowerRange;
			if (this.yUpperRange && this.yUpperRange != '')
				yProp.max = this.yUpperRange;
			if (this.yMajorTickStep)
				yProp.majorTickStep = this.yMajorTickStep;
			this.dojoObj.addAxis("y", yProp);
		}
	},
	getFontProperty: function(){
		var defaultFontProp = {style: "normal", variant:"normal", weight:"normal", size:"7pt", family:"Tahoma"};
		var results = {};
		var fontProp = {};
		var fontPropExists = false;
		if(this._classes && this._classes.domNode)
		{
			for (var i = 0; i < this._classes.domNode.length; i++)
			{
				var classProp = this._classes.domNode[i];
				var propObj = this.getDojoGFXCssPropObj(classProp);
				if (propObj)
				{
					fontProp[propObj.propName] = propObj.propValue;
					fontPropExists = true;
				}
			}
			
			if (fontPropExists)
			{
				var fontPropStr = '';
				for (p in defaultFontProp)
				{
					if (fontProp[p] && fontProp[p] != '')
						fontPropStr += ' ' + fontProp[p];
					else
						fontPropStr += ' ' + defaultFontProp[p];
				}

				results.font = dojo.trim(fontPropStr);
				if (fontProp.fontColor)
					results.fontColor = fontProp.fontColor;
				return results;
			}
		}
		
		return null;
	},
	addSeries: function(){
		return;
		thisObj = this;
		dojo.forEach(this.yAxis.split(','), function(columnName, idx){
			var columnData = null;
			if (thisObj.chartType == 'Pie')
				columnData = thisObj.getPieDataSet(columnName);
			else
				columnData = thisObj.getColumnDataSet(columnName);

			columnName = dojo.trim(columnName);
			var seriesName = wm.capitalize(columnName);
			var counter = 1;
			while (dojo.indexOf(thisObj.addedSeries, seriesName) != -1)	{
				seriesName += ' '+counter;
				counter++;
			}
			
			if (thisObj.chartType != 'Pie' && thisObj.chartColor instanceof Array)
			{
				var color = thisObj.chartColor[idx];
				if (color && color != '')
					thisObj.dojoObj.addSeries(seriesName, columnData, {stroke:{width:0}, fill:color});
				else
					thisObj.dojoObj.addSeries(seriesName, columnData);
			}
			else
			{
				thisObj.dojoObj.addSeries(seriesName, columnData);
			}
			
			thisObj.addedSeries[thisObj.addedSeries.length] = seriesName; 
		});
	},
	incrementSeries: function(){
		this.addChartSeries(true);
		this.dojoObj.render();
		//this.renderBounds();
	},
	updateSeries: function(seriesName, inData){
		try{
			this.dojoObj.updateSeries(seriesName, inData);
			this.dojoObj.render();		
		}catch(e){
			console.info('error while updating series for ', this.declaredClass);
		}
	},
	setChartTheme: function(){
		var js = 'dojox.charting.themes.' + this.theme;
		dojo["require"](js);
		var self = this;
		dojo.addOnLoad(function(){
			self.updateChartTheme();
		});
	},
	updateChartTheme: function(){
		var themeObj = dojo.getObject('dojox.charting.themes.' + this.theme);
		this.dojoObj.setTheme(themeObj);
	},
	updateChartType: function(){
		this.updateChartXY();
		var prop = {type: this.chartType, gap: this.gap};
		if (this.chartType == 'Lines')
			prop.markers = true;
		this.dojoObj.addPlot("default", prop);
	},
	getDojoGFXCssPropObj: function(prop){
		var propArray = prop.split("_");
		if (propArray.length == 3)
		{
			switch (propArray[1])
			{
				case 'FontFamily': 
					return {propName: 'family', propValue: propArray[2]};
				case 'FontSizePx':
					return {propName: 'size', propValue: propArray[2]};
				case 'FontColor':
					return {propName: 'fontColor', propValue: propArray[2]};
				case 'TextDecoration':
					return {propName: 'weight', propValue: propArray[2]};
			}
		}
		
		return null;
	},
	updateChartXY: function(){
		if(this.chartType == 'Pie')
		{
			this.dojoObj.removeAxis('x');
		}
		else
		{
			this.addXAxis();
		}
		
		this.addSeries();
	},
	addAnimation:function(){
		if (this.aniHighlight != null)
		{
			this.aniHighlight.destroy();
			this.aniShake.destroy();
			this.aniTooltip.destroy();
			if (this.magnify)
				this.magnify.destroy();
		}
		
		if (this.enableAnimation)
		{
			var dc = dojox.charting;
			var dur = 450;
			this.aniHighlight = new dc.action2d.Highlight(this.dojoObj, "default", {
				duration: dur,
				easing:   dojo.fx.easing.sineOut
			});
			this.aniShake = new dc.action2d.Shake(this.dojoObj, "default");
			this.aniTooltip = new dc.action2d.Tooltip(this.dojoObj, "default");
			if (this.chartType == 'Lines')
				this.magnify = new dc.action2d.Magnify(this.dojoObj, "default");
		}
	},
	getTimeX: function(){
		var today = new Date();
	    var h = today.getHours();
	    var m = today.getMinutes();
	    var s = today.getSeconds();
	    var text;

	    // isTimeXAxis used to be a boolean; users should update, but this will handle those users who don't.  Change made for 6.3
	    if (this.isTimeXAxis === true)
		this.isTimeXAxis = "hh:mm:ss";
	    switch(this.isTimeXAxis) {
	    case "hh:mm:ss":
		 text = h+':'+m + ':' + s;
		break;
	    case "hh:mm":
		text = h + ':' + m;
		break;
	    case "hh":
		text = h;
		break;
	    }
		var xAxis = this.dojoObj.getAxis('x'), labels = xAxis.opt.labels || [];
		if (labels.length < 1) {
			var value = 1;
		} else {
			var value = labels[labels.length -1].value + 1; 
			while (labels.length > this.maxTimePoints) {
				labels.shift();
			}
		}
		
		labels.push({value: value, text: text});
		xAxis.labels = labels;
		this.dojoObj.addAxis("x", xAxis);
		return value;
	},
	addXLabel: function(label){
		var xAxis = this.dojoObj.getAxis('x'), labels = xAxis.opt.labels || [], value = 0;
		if (labels.length < 1)
			value = 1;
		else
			value = labels[labels.length -1].value + 1;
		labels.push({value: value, text: label+''});
		xAxis.labels = labels;
		this.dojoObj.addAxis("x", xAxis);
		return value;
	},
	dojoChartEvent: function(e){
		var type = e.type;
		var idx = e.index;
		if (!this.variable || !type || !idx || type == null || idx == null || this.variable == null)
			return;

		var dataObj = null;
		var item = this.variable.getItem(idx);
		if (item != null)
			dataObj = item.data;
		
		if (type == 'onclick')
			dojo.hitch(this, 'onClick')(e, dataObj);
		else if (type == 'onmouseover')
			dojo.hitch(this, 'onMouseOver')(e, dataObj);
		else if (type == 'onmouseout')
			dojo.hitch(this, 'onMouseOut')(e, dataObj);
	},
	onClick: function(e, dataObj){
	},
	onMouseOver: function(e, dataObj){
	},
	onMouseOut: function(e, dataObj){
	}
});

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
	dataSet: {bindable: 1, group: "edit", order: 10, isList: true},
	xAxis: {group: "edit", order: 20},
    isTimeXAxis: {group: "edit", order: 21, type: "string"},
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
		case "isTimeXAxis":		    
		    return makeSelectPropEdit(inName, inValue, ["", "hh:mm:ss", "hh:mm", "hh"], inDefault);
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
	showAddSilverlight: function(){
		if (!dojo.isIE || !Silverlight || Silverlight.isInstalled())
			return;
		this.addSilverlight = true;
		var link = dojo.doc.createElement('a');
		dojo.attr(link, 'href', 'http://go.microsoft.com/fwlink/?LinkId=149156');
		dojo.attr(link, 'style', 'text-decoration: none;');
		var img = dojo.doc.createElement('img');
		dojo.attr(img,'src', 'http://go.microsoft.com/fwlink/?LinkId=108181');
		dojo.attr(img,'alt', 'Get Microsoft Silverlight');
		dojo.attr(img,'style', 'border-style: none');
		link.appendChild(img);
		this.domNode.appendChild(link);
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

