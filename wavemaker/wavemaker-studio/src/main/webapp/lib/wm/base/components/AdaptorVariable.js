/* 
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.AdaptorVariable");
dojo.require("wm.base.components.Variable");

dojo.declare("wm.AdaptorVariable", wm.Variable, {
    dataSet: null,
    outputVar: null,

    outputType: "",
    _mapping: {},
    mapping: "",
    init: function() {
	this.inherited(arguments);
	this.outputVar = new wm.Variable({type: this.outputType,
					  owner: this});
	try {
	    this._mapping = dojo.fromJson(this.mapping);
	} catch(e){}
    },
    setDataSet: function(inData) {
	debugger;
	this.inherited(arguments);
	var outputData;
	if (this.isList) {
	    outputData = [];
	    for (var i = 0; i < this.data.list.length; i++)
		outputData.push(this.mapData(this.getItem(i)));
	} else {
	    outputData = this.mapData(this);
	}
	this.outputVar.setData(outputData);
    },
    mapData: function(inVariable) {
	var result = {};
	for (var fieldName in this._mapping) {
	    var fieldDesc = this._mapping[fieldName];
	    if (fieldDesc.fieldName)
		result[fieldName] = inVariable.getValue(fieldDesc.fieldName);
	    else
		result[fieldName] = wm.expression.getValue(fieldDesc.displayExpr, inVariable);
	}
	//var fields = wm.typeManager.getType(this.outputType).fields;
	return result;
    },
    _end: 0
});


wm.AdaptorVariable.extend({
    editMapping: function() {
	if (!wm.AdaptorVariable.ConfigDialog) 
	    wm.AdaptorVariable.ConfigDialog = new wm.PageDialog({
		owner: studio,
		pageName: "AdaptorEditor",
		width: "600px",
		height: "500px",
		title: "Adaptor Variable Setup",
		hideControls: true,
		modal: false
	    });
	wm.AdaptorVariable.ConfigDialog.show();
	wm.AdaptorVariable.ConfigDialog.page.setSourceType(this.type);
	wm.AdaptorVariable.ConfigDialog.page.setOutputType(this.outputType);
	wm.AdaptorVariable.ConfigDialog.page.setComponent(this);
    },
    setOutputType: function(inType) {
	this.outputType = inType;
	if (this.outputVar)
	    outputVar.setType(inType);
    },
	listDataProperties: function() {
	    var list = this.inherited(arguments);
	    list.outputVar = this.listProperties().outputVar;
	    return list;
	},
    updateMapping: function() {
	this.mapping = dojo.toJson(this._mapping);
    }

});

wm.Object.extendSchema(wm.AdaptorVariable, {
    editMapping: {operation:1,group:"operations"},
    outputVar: {bindable:1, type: "wm.Variable", simpleBindProp: true},
    outputType:{editor:"wm.prop.DataTypeSelect"},
    mapping: {}
});