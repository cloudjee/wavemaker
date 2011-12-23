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

dojo.provide("wm.base.widget.DojoChart");


dojo.declare("wm.DojoChart", wm.Control, {
    chartTitle: "",
    yAxisTitle: "",
    hideLegend: false,
    verticalLegend: false,
	padding: 4,
	width:'200px',
	height:'200px',
	legendHeight:'50px',
	legendWidth:'150px',
	variable:null,
	dataSet:null,
	dojoObj:null,
	theme: 'CubanShirts',
	xAxis:'wmDefaultX',
    xAxisLabelLength: 0,
    //isTimeXAxis: "",
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
	        dojo['require']("dojox.charting.widget.SelectableLegend");
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
		this.updateChartDivWidth();
		this.domNode.appendChild(this.dojoDiv);
	    this.dojoObj = new dojox.charting.Chart2D(this.dojoDiv, {title: this.chartTitle, titlePos: "top", titleGap: 5, margins: {l:0,t:5,r:5,b:15}});
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
	        if (this.hideLegend) return;
		this.legendDiv = dojo.doc.createElement('div');
		dojo.attr(this.legendDiv,'align','center');

	    //dojo.place(this.legendDiv, this.domNode, "first");
	    this.domNode.appendChild(this.legendDiv);
            try {
		if (this.xAxis.match(/,/) || this.yAxis.match(/,/)) {
		    this.legend = new dojox.charting.widget.SelectableLegend({chart: this.dojoObj, horizontal:!this.verticalLegend}, this.legendDiv);
		} else {
		    this.legend = new dojox.charting.widget.Legend({chart: this.dojoObj, horizontal:!this.verticalLegend}, this.legendDiv);
		}
            } catch(e) {}
	    wm.onidle(this, function() {
		var newLegendNode = dojo.query(".dojoxLegendNode", this.domNode)[0];
		if (newLegendNode) {
		    var s = newLegendNode.style;
		    if (this.verticalLegend) {
			s.position = "absolute";
			s.left = Math.max(0, this.getContentBounds().w-parseInt(this.legendWidth)) + "px";
			s.width = this.legendWidth;
			s.top = "0px";
		    } 
		}
		while(this.domNode.childNodes[1].childNodes.length > 1) {
		    dojo.destroy(this.domNode.childNodes[1].childNodes[0]);
		}
	    });
	},
	updateChartDivHeight: function(){
		if (!this.dojoDiv)
			return;
		var h = dojo.coords(this.domNode).h;
	        if (!this.verticalLegend) {
		    var lh = wm.splitUnits(this.legendHeight);
		    var l = lh.value;
		} else {
		    l = 0;
		}
	    if (l == 0) {
		var reducedHeight = h + 10; // if no legend desired, get rid of unnecessary margin set aside for the legend
	    } else {
		var reducedHeight = h - l;
	    }
	    if (reducedHeight > 0 )
		{
			// For IE8(Compatibility mode(IE7) height cannot be negetive else it throws js error)
			this.dojoDiv.style.height = reducedHeight + 'px';
		}
	},
	updateChartDivWidth: function(){
	    if (!this.dojoDiv)
		return;
	    var width = this.getContentBounds().w
	    if (this.verticalLegend) {
		width -= parseInt(this.legendWidth);
	    }
	    if (width < 0) width = 0;
	    this.dojoDiv.style.width = width + "px";
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
	    this.dataSet = this.variable = inValue;
	    if(!this.dojoObj && (!this.variable || !this.variable.getData()))
			return;
			
		var thisObj = this;
/*
		if (this.isTimeXAxis && this.dojoObj)
			this.incrementSeries();
		else
		*/
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
/*
		if (this.isTimeXAxis)
			return [];
			*/
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
/*
				if (this.isTimeXAxis)
					x = this.getTimeX();
				else*/
			    if(xField)
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
		        if (this.yAxisTitle)
		            yProp.title = this.yAxisTitle;
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
		this.renderDojoObj();
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

/*
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
	    */
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
	    label = label + '';
	    if (this.xAxisLabelLength)
		label = label.substring(0,this.xAxisLabelLength);
		labels.push({value: value, text: label});
		xAxis.labels = labels;
		this.dojoObj.addAxis("x", xAxis);
		return value;
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
	        dojo.attr(img,'alt', wm.getDictionaryItem("ALT_PROMPT_SILVERLIGHT"));
		dojo.attr(img,'style', 'border-style: none');
		link.appendChild(img);
		this.domNode.appendChild(link);
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
	},

    toHtml: function() {
	return this.dojoObj.node.innerHTML;
    }
});

