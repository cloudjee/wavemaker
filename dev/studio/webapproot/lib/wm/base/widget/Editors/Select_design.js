/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Editors.Select_design");
dojo.require("wm.base.widget.Editors.Select");


// design only
wm.SelectMenu.extend({
    themeableStyles: ["wm.SelectMenu-Down-Arrow_Image", "wm.SelectMenu-Inner_Radius"],
	updateNow: "(updateNow)",
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else {
			this.setDataSet(inDataSet);
		}
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
	_listFields: function() {
		var list = [ "" ];
		var schema = this.dataSet instanceof wm.LiveVariable ? wm.typeManager.getTypeSchema(this.dataSet.type) : (this.dataSet||0)._dataSchema;
		var schema = (this.dataSet||0)._dataSchema;
		this._addFields(list, schema);
		return list;
	},
	makePropEdit: function(inName, inValue, inDefault) {  
	        var prop = this.schema ? this.schema[inName] : null;
	        var name =  (prop && prop.shortname) ? prop.shortname : inName;
		switch (inName) {
			case "displayField":
				var values = this._listFields();
		                //return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: values});
				return makeSelectPropEdit(inName, inValue, values, inDefault);
			case "dataField":
				var values = this._listFields();
		                if (values.length) values[0] = this._allFields;
		                if (!inValue) inValue = this._allFields;
		                //return new wm.propEdit.Select({component: this, name: inName, value: inValue, options: values});
				return makeSelectPropEdit(inName, inValue, values, inDefault);

			case "displayType":
				return makeSelectPropEdit(inName, inValue, wm.selectDisplayTypes, inDefault);
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.dataSet ? this.dataSet.getId() : "", allowAllTypes: true, listMatch: true});
			case "updateNow":
				return makeReadonlyButtonEdit(name, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
    setPropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "displayField":
	    var editor1 = dijit.byId("studio_propinspect_displayField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var displayFields = this.makePropEdit("displayField");
	    displayFields = displayFields.replace(/^.*?\<option/,"<option");
	    displayFields = displayFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = displayFields;
	    return true;
	case "dataField":
	    var editor1 = dijit.byId("studio_propinspect_dataField");

	    var store1 = editor1.store.root;

	    while (store1.firstChild) store1.removeChild(store1.firstChild);


	    var dataFields = this.makePropEdit("dataField");
	    dataFields = dataFields.replace(/^.*?\<option/,"<option");
	    dataFields = dataFields.replace(/\<\/select.*/,"");
	    store1.innerHTML = dataFields;
	    return true;
	}
	return this.inherited(arguments);
    },    
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "updateNow":
				return this.update();
		}
	    return this.inherited(arguments);
	},
	setHasDownArrow: function(inValue){
		this.hasDownArrow = inValue;
		//this.editor.attr('hasDownArrow', this.hasDownArrow); does not work updates the editor instantly. Therefore wrote a hack to hide downArrowNode by updating style prop.
		if (this.editor.downArrowNode){
			this.editor.downArrowNode.style.display = this.hasDownArrow ? "" : "none";
		}
	}
});



wm.Object.extendSchema(wm.SelectMenu, {
    onEnterKeyPress: {ignore: 0},
    restrictValues: {type: "wm.Boolean", group: "editor", order: 40, doc: 1},
	changeOnKey: { ignore: 1 },
	changeOnEnter: { ignore: 1 },
    selectedItem: { ignore: true, bindSource: true, isObject: true, bindSource: true, doc: 1},
	dataSet: { readonly: true, group: "editor", order: 4, type: "wm.Variable", isList: true, bindTarget: true, doc: 1},
	startUpdate: { group: "editor", order: 5},
  pageSize: { order: 6, group: "editor"},
	liveVariable: {ignore: 1 },
	options: {group: "editor", order: 7},
        dataValue: {ignore: 1, bindable: 1, group: "editData", order: 3, simpleBindProp: true, type: "any"}, // use getDataValue()
	dataField: {group: "editor", order: 10, doc: 1},
	displayField: {group: "editor", order: 15,doc: 1},
    displayExpression: {group: "editor", order: 20, doc: 1, displayExpression: "dataSet"},
	displayType:{group: "editor", order: 21},
  autoComplete: {group: "editor", order: 25},
	hasDownArrow: {group: "editor", order: 26},
  allowNone: {group: "editor", order: 30},
	updateNow: {group: "operation"},
  dataFieldWire: { ignore: 1},
  optionsVar: {ignore:1},
	_allFields: {ignore:1},
    defaultInsert:{ignore:1, bindTarget: 1, type:'wm.Variable', group: "editData", order: 10},
    setRestrictValues: {group: "method", doc: 1},
    setDataSet: {group: "method", doc: 1},
    setOptions: {group: "method", doc: 1},
    getItemIndex: {group: "method", doc: 1, returns: "Number"}
});


wm.Object.extendSchema(wm.Lookup, {
	autoDataSet: {group: "data", order: 3},
    maxResults: {group: "editor", order: 100},
	options: {ignore: 1},
	dataField: {ignore: 1}
});


wm.Lookup.extend({
	listProperties: function() {
		var props = this.inherited(arguments);
		props.dataSet.ignoretmp = this.autoDataSet;
		props.dataSet.bindTarget = !props.dataSet.ignoretmp;
	        props.maxResults.ignoretmp = !this.autoDataSet;
		return props;
	}
});