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


dojo.provide("wm.base.widget.DojoLightbox");

dojo.require('dojox.image.Lightbox');
dojo.extend(dojox.image.Lightbox, {
	removeImage:function(child,group){
		if (this._attachedDialog)
			this._attachedDialog.removeImage(child, group);
	},
	pop: function(group){
		if (this._attachedDialog)
			this._attachedDialog.pop(group);
	},
	clearGroup: function(group){
		if (this._attachedDialog)
			this._attachedDialog.clearGroup(group);
	}
});

dojo.extend(dojox.image.LightboxDialog, {
	removeImage:function(child,group){
		var g = group;
		if(!child.href){ return; }
		if (!g)
			g = "XnoGroupX";
		if(!this._groups[g])
			return;
		for (var i = 0; i < this._groups[g].length; i++){
			if (this._groups[g][i].href == child.href){
				this._groups[g].slice(i,1);
				break;
			}
		}
	},
	pop: function(group){
		var g = group;
		if (!g)
			g = "XnoGroupX";
		if(!this._groups[g])
			return;
		this._groups[g].pop();
	},
	clearGroup: function(group){
		if(this._groups[group])
			delete this._groups[group];
	}
});

dojo.declare("wm.DojoLightbox", wm.Component, {
	dataSet:null,
	imageUrlField:'',
	imageLabelField:'',

	postInit: function() {
		this.inherited(arguments);
	    if (!this.$.binding && this.isDesignLoaded())
			new wm.Binding({name: "binding", owner: this});
		this.createDojoObj();	
	},
	destroy: function(){
	    delete this.variable;
	    delete this.dataSet;
		this.inherited(arguments);
		this.destroyDojoObj();
	},
	destroyDojoObj: function(){
		if (this.dojoObj)
			this.dojoObj.destroy();
	},
	createDojoObj: function(){
		this.destroyDojoObj();
		this.dojoObj = new dojox.image.Lightbox({group:this.name});
		this.dojoObj.startup();
	},
	renderDojoObj: function() {
		if (this._loading || !this.variable || !this.imageUrlField || this.imageUrlField == '')
			return;

		if (!this.dojoObj)
			this.createDojoObj();
		else 
			this.empty();
			
		var imgUrlArray = [];
		for (var i = 0; i < this.variable.getCount(); i++)
		{
			var dataObj = this.variable.getItem(i).data;
			var imgObj = {};
			if (dataObj && dataObj != null)
			{
				imgObj.href = dataObj[this.imageUrlField];
				imgObj.title = this.imageLabelField && this.imageLabelField != '' ? dataObj[this.imageLabelField] : '';
			}

			imgUrlArray[imgUrlArray.length] = imgObj;
		}
		
		this.addToLightBox(imgUrlArray);
	},
	addToLightBox: function(dataArray){
		dojo.forEach(dataArray, function(item){
			this.dojoObj._attachedDialog.addImage(item,this.name);
		}, this);
	},
    // This rather than show is called when you select a lightbox from the events menu, and then fire the event.
    activate: function() {
	this.show();
    },
	show: function(startFromUrl){
		if (startFromUrl)
			this.dojoObj.href = startFromUrl;
		this.dojoObj.show(this.name);
	},
	getDataSet: function() {
		return this.variable;
	},
	setDataSet: function (inValue, inDefault){
		this.variable = this.dataSet = inValue;
		this.renderDojoObj();
	},
	setImageUrlField: function(inValue){
		this.imageUrlField = inValue;
		this.renderDojoObj();
	},
	setImageLabelField: function(inValue){
		this.imageLabelField = inValue;
		this.renderDojoObj();
	},
	empty: function(){
		if (this.dojoObj)
			this.dojoObj.clearGroup(this.name);
	},
	update: function(){
		this.show();
	},

	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
		    var ds = this.getValueById(inDataSet);
		    if (ds) {
			this.components.binding.addWire("", "dataSet", ds.getId());
		    }
		} else {
		    this.setDataSet(inDataSet);
		}
	},
	_listFields: function() {
		var list = [ "" ];
		var schema = this.dataSet instanceof wm.LiveVariable ? wm.typeManager.getTypeSchema(this.dataSet.type) : (this.dataSet||0)._dataSchema;
		var schema = (this.dataSet||0)._dataSchema;
		this._addFields(list, schema);
		return list;
	},
	// FIXME: for simplicity, allow only top level , non-list, non-object fields.
	_addFields: function(inList, inSchema) {
		for (var i in inSchema) {
			var ti = inSchema[i];
			if (!(ti||0).isList && !wm.typeManager.isStructuredType((ti||0).type)) {
				inList.push(i);
			}
		}
	},
	makePropEdit: function(inName, inValue, inDefault) {  
	    var prop = this.schema ? this.schema[inName] : null;
	    var name =  (prop && prop.shortname) ? prop.shortname : inName;
	    switch (inName) {
	    case "imageUrlField":
	    case "imageLabelField":
		var values = this._listFields();
		return makeSelectPropEdit(inName, inValue, values, inDefault);
	    case "dataSet":
		return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true, value: inValue});
	    }
	    return this.inherited(arguments);
	},
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "imageUrlField":
	    var editor1 = dijit.byId("studio_propinspect_imageUrlField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var displayFields = this.makePropEdit("imageUrlField");
	    displayFields = displayFields.replace(/selected="selected"/,"");
	    displayFields = displayFields.replace(/^.*?\<option/,"<option");
	    displayFields = displayFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = displayFields;
	    editor1.set("value", inValue, false);
	    return true;
	case "imageLabelField":
	    var editor1 = dijit.byId("studio_propinspect_imageLabelField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var displayFields = this.makePropEdit("imageLabelField");
	    displayFields = displayFields.replace(/selected="selected"/,"");
	    displayFields = displayFields.replace(/^.*?\<option/,"<option");
	    displayFields = displayFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = displayFields;
	    editor1.set("value", inValue, false);
	    return true;

	}
	return this.inherited(arguments);
    }
});

// design only...
wm.Object.extendSchema(wm.DojoLightbox, {
	variable: {ignore: 1},
    dataSet: {bindable: 1, group: "edit", order: 10, isList: true, type: "wm.Variable"},
	imageUrlField:{group: "edit", order: 20},
	imageLabelField:{group: "edit", order: 30}
});

wm.DojoLightbox.description = "A dojo Lightbox.";

