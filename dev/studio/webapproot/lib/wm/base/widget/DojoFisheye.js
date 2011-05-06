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


dojo.provide("wm.base.widget.DojoFisheye");

dojo.declare("wm.DojoFisheye", wm.Control, {
	padding: 0,
	width:'100%',
	height:'40px',
	dataSet:null,
	imageUrlField:'',
	imageLabelField:'',
	itemWidth:40,
	itemHeight:40,
	itemMaxWidth:150,
	itemMaxHeight:150,
	connectEvents:[],
	variableConnectEvents:[],
	
	init: function() {
		dojo['require']("dojox.widget.FisheyeList");
		this.inherited(arguments);
		this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
		this.connectEvents = [];
	},
	destroy: function(){
		this.inherited(arguments);
		this.destroyDojoObj();
		delete this.dojoObj;
		delete this.variable;
		this.connectEvents = null;
		delete this.connectEvents;
		if (this.variableConnectEvents)
			dojo.forEach(this.variableConnectEvents, dojo.disconnect);
		delete this.variableConnectEvents;
		if (this.selectedItem)
			this.selectedItem.destroy();
		delete this.selectedItem;
	},
	destroyDojoObj: function(){
		if (this.dojoObj)
			this.dojoObj.destroy();
		if (this.connectEvents.length > 0)
			dojo.forEach(this.connectEvents, dojo.disconnect);
	},
	renderDojoObj: function() {
		if (this._loading || !this.variable || !this.imageUrlField || this.imageUrlField == '')
		{
			this.destroyDojoObj();
			return;
		}

		this.destroyDojoObj();
		var prop = {itemWidth:this.itemWidth, itemHeight:this.itemHeight, itemMaxWidth:this.itemMaxWidth, itemMaxHeight: this.itemMaxHeight,
					effectUnits: 2, itemPadding:10, attachEdge:'center',labelEdge:'bottom', orientation:'horizontal'};
		

		this.updateDOMStyle();		
		this.dojoObj = new dojox.widget.FisheyeList(prop, dojo.create('div', null, this.domNode));
		var imgUrlArray = [];
		for (var i = 0; i < this.variable.getCount(); i++)
		{
			var dataObj = this.variable.getItem(i).data;
			if (!dataObj || !dataObj[this.imageUrlField] || dataObj[this.imageUrlField] == '')
				continue;
			var imgObj = {};
			if (dataObj && dataObj != null)
			{
				imgObj.url = dataObj[this.imageUrlField];
				imgObj.label = this.imageLabelField && this.imageLabelField != '' ? dataObj[this.imageLabelField] : '';
				imgObj.data = dataObj;
			}

			imgUrlArray[imgUrlArray.length] = imgObj;
		}
		
		for (var i = 0; i < imgUrlArray.length; i++)
		{
			this.addImageToFish(imgUrlArray[i]);
		}
	},
	updateDOMStyle: function(){
		this.domNode.style.overflow = 'visible';
		if (dojo.isIE)
		{
			this.domNode.style.overflowX = 'visible';
			this.domNode.style.overflowY = 'visible';
		}
		
		if (this.parent && this.parent instanceof wm.Panel)
		{
			this.parent.domNode.style.overflow = 'visible';
			if (dojo.isIE)
			{
				this.parent.domNode.style.overflowX = 'visible';
				this.parent.domNode.style.overflowY = 'visible';
			}
		}
	},
	addImageToFish: function(imgObj){
		if (!this.dojoObj)
			return;
		var item = new dojox.widget.FisheyeListItem();
		item.label = imgObj.label;
		item.iconSrc = imgObj.url;
		try
		{
			this.connectEvents.push(dojo.connect(item, 'onClick', dojo.hitch(this, '_onClick', imgObj.data)));
		}
		catch(e)
		{
			console.info('exception while connecting to on click ', e)	
		}
		
		item.postCreate();
		this.dojoObj.addChild(item);
		this.dojoObj.startup();
		item.startup();
	},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){
		if (this.variableConnectEvents)
			dojo.forEach(this.variableConnectEvents, dojo.disconnect);
		this.variableConnectEvents = [];
		this.variable = inValue;
		if (this.variable && this.variable != '')
			this.variableConnectEvents.push(dojo.connect(this.variable, 'onSetData', this, 'sourceDataChanged'));
		var t = (inValue||0).type || "AnyData";
		this.setSelectedItemType(t);
		this.dataSetToSelectedItem(inValue);
		this.onsetdata(this.variable);
		this.renderDojoObj();
	},
	sourceDataChanged: function(){
		this.renderDojoObj();
	},
	setSelectedItemType: function(inType) {
		this.selectedItem.setType(inType);
	},
	dataSetToSelectedItem: function() {
		this.selectedItem.setLiveView((this.variable|| 0).liveView);
		this.selectedItem.setType(this.variable ? this.variable.type : "any");
	},
	updateSelected: function(dataObj){
		this.selectedItem.setDataSchema(dataObj);
		this.selectedItem.setData(dataObj);
		this.setValue("emptySelection", Boolean(!dataObj));
	},
	_onClick: function(dataObj, event){
		this.updateSelected(dataObj);
		this.onClick(dataObj, event);
	},
	onClick: function(dataObj, event){
	},
	onsetdata: function(inData) {
	}
	
});

// design only...
wm.Object.extendSchema(wm.DojoFisheye, {
	variable: {ignore: 1},
	connectEvents:{ignore:1},
	variableConnectEvents:{ignore:1},
	dataSet: {bindable: 1, group: "edit", order: 10, isList: true},
	imageUrlField:{group: "edit", order: 20},
	imageLabelField:{group: "edit", order: 30},
	itemWidth:{group: "edit", order: 40},
	itemHeight:{group: "edit", order: 50},
	itemMaxWidth:{group: "edit", order: 60},
	itemMaxHeight:{group: "edit", order: 70},
	selectedItem: { ignore: true, isObject: true, bindSource: true, simpleBindProp: true }
});

