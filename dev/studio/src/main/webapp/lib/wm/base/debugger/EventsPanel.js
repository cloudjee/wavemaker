/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.debugger.EventsPanel");


dojo.declare("wm.debugger.EventsPanel", wm.Container, {
    layoutKind: "left-to-right",

/* This hack (providing getRoot and getRuntimeId) is needeed to be able to write event handlers such as onShow: "serviceGridPanel.activate"; without it, we'd need something like
 * app.debugDialog.serviceGridPanel.activate
 */
    getRoot: function() {
	return this;
    },
	getRuntimeId: function(inId) {
		inId = this.name + (inId ? "." + inId : "");
		return this.owner != app.pageContainer ? this.owner.getRuntimeId(inId) : inId;
	},
	getId: function(inName) {
		return inName;
	},

    currentEventChain: null,
    nextId: 1,
    newLogEvent: function(inData) {
	
	var id = this.nextId;
	this.nextId++;
	this.eventListVar.addItem({
	    id: id,
	    time: new Date(),
	    eventType: inData.eventType,
	    eventName: inData.eventName,
	    firingId: inData.firingId,
	    affectedId: inData.affectedId,
	    method: inData.method,
	    boundProperty: inData.boundProperty,
	    boundValue: inData.boundValue,
	    boundSource: inData.boundSource,
	    boundExpression: inData.boundExpression,
	    isBinding: inData.eventType == "bindingEvent",
	    causeList: dojo.clone(this.currentEventChain)
	});
	this.currentEventChain.push({dataValue:id, data: inData});
	console.log("newLogEvent: " + id + " caused by " + this.currentEventChain.length + " events");

	return id;
    },
    endLogEvent: function(inId) {
	for (var i = this.currentEventChain.length-1; i >= 0; i--) {
	    if (this.currentEventChain[i].dataValue == inId) {
		wm.Array.removeElementAt(this.currentEventChain,i);
		console.log("removed log " + inId);
		break;
	    }
	}
    },

    postInit: function() {
	this.inherited(arguments);

	this.currentEventChain = [];

	var typeDef = this.createComponents({debuggerEventType: ["wm.TypeDefinition", {internal: true}, {}, {
	    field999: ["wm.TypeDefinitionField", {"fieldName":"id","fieldType":"number"}, {}],
	    field1000: ["wm.TypeDefinitionField", {"fieldName":"time","fieldType":"date"}, {}],
	    field1001: ["wm.TypeDefinitionField", {"fieldName":"eventType","fieldType":"string"}, {}], 
	    field1002: ["wm.TypeDefinitionField", {"fieldName":"eventName","fieldType":"string"}, {}],
	    field1004: ["wm.TypeDefinitionField", {"fieldName":"firingId","fieldType":"string"}, {}], // identifier for the thing that triggered this event
	    field1005: ["wm.TypeDefinitionField", {"fieldName":"affectedId","fieldType":"string"}, {}], // identifier for the thing that this event caused a call to be made on
	    field1006: ["wm.TypeDefinitionField", {"fieldName":"method","fieldType":"string"}, {}], // name of the method called on affectedId
	    field1007: ["wm.TypeDefinitionField", {"fieldName":"boundProperty","fieldType":"string"}, {}], 
	    field1008: ["wm.TypeDefinitionField", {"fieldName":"boundValue","fieldType":"string"}, {}], 
	    field1009: ["wm.TypeDefinitionField", {"fieldName":"boundSource","fieldType":"string"}, {}], 
	    field1010: ["wm.TypeDefinitionField", {"fieldName":"boundExpression","fieldType":"string"}, {}],
	    field1011: ["wm.TypeDefinitionField", {"fieldName":"isBinding","fieldType":"boolean"}, {}],
	    field1012: ["wm.TypeDefinitionField", {"fieldName":"causeList","fieldType":"NumberData", isList: true}, {}],
	    field1013: ["wm.TypeDefinitionField", {"fieldName":"highlightRow","fieldType":"boolean"}, {}]
	}]}, this)[0];
	//typeDef.setOwner(this);
	//wm.typeManager.types.debuggerEventType.fields.id.include = ["update"];


	var components = this.createComponents({
	    eventListVar:  ["wm.Variable", {type: "debuggerEventType", isList: true}],
	    eventChainListVar:  ["wm.Variable", {type: "debuggerEventType", isList: true}],
	    gridPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%",  verticalAlign: "top", horizontalAlign: "left"},{},{
		searchPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "30px", verticalAlign: "top", horizontalAlign: "left"},{},{
		    showBindings: ["wm.Checkbox", {width: "150px", captionSize: "120px", caption: "Show Bindings"},{onchange: "searchChange"}],
		    clearButton: ["wm.Button", {width: "80px", caption: "Clear"}, {onclick: "clearEvents"}]
		}],

		    eventsGrid: ["wm.DojoGrid", 
				 {width: "100%", height: "100%",query:{isBinding:false},"columns":[
				     {"show":true,"field":"firingId","title":"Component","width":"120px","align":"left","formatFunc":"", backgroundColor: "${highlightRow} ? '#FFAAAA' : undefined;"},
				     {"show":true,"field":"eventName","title":"Event","width":"80px","align":"left","formatFunc":""},
				     {"show":true,"field":"affectedId","title":"Causing Widget","width":"120px","align":"left"},
				     {"show":true,"field":"method","title":"To call","width":"100%","align":"left","expression": "${isBinding} ? 'setValue(' + ${boundProperty} + ',' + (${boundValue}||null) + ')' : ${method}"},
				     {"show":true,"field":"time","title":"Time","width":"120px","align":"left","formatFunc": "wm_date_formatter",
				      "formatProps": {
					  "dateType": "time",
					  formatLength: "medium"
				      }}
				 ],
				  "margin":"4"}, {onSelectionChange: "showEvent"}, {
				      binding: ["wm.Binding", {"name":"binding"}, {}, {
					  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"eventListVar","targetProperty":"dataSet"}, {}]
				      }]
				  }]
	    }]
	},this);
    },
    clearEvents: function() {
	this.eventListVar.clearData();
    },
    showEvent: function(inSender) {
	if (this.inShowEvent) return;
	this.inShowEvent = true;
	/* Clear highlighted rows */
	var count = this.eventListVar.getCount();
	for (var i = 0; i < count; i++) {
	    var item  = this.eventListVar.getItem(i);
	    item.beginUpdate();
	    item.setValue("highlightRow", false);
	    item.endUpdate();
	}


	var data = this.eventsGrid.selectedItem.getData();
	var id = data.id;

	/* If there is no selected id, return */
	if (!id) {
	    this.selectedItem = null;
	    this.inShowEvent = false;
	    return;
	}

	this.selectedItem = app.getValueById(data.affectedId);

	var causeList = data.causeList;
	causeList.unshift({dataValue:id});
	var eventChain = [data];
	if (causeList) {
	    for (var i = 0; i < causeList.length; i++) {
		var item = this.findEventById(causeList[i].dataValue);
		if (item) {
		    item.beginUpdate();
		    item.setValue("highlightRow", true);
		    item.endUpdate();
		    eventChain.push(item);
		}
	    }
	}
	this.eventListVar.notify();
/*
	this.eventChainListVar.setData(eventChain);
	if (data.method && data.affectedId) {
	    this.eventChainDesc.setHtml(data.affectedId + "." + data.method + "() was called at " + dojo.date.locale.format(new Date(data.time), {selector: "time"}) + " as a result of the following events");
	}
	*/

	    this.inShowEvent = false;	

    },
    findEventById: function(inId) {
	var count = this.eventListVar.getCount();
	for (var i = 0; i < count; i++) {
	    var item = this.eventListVar.getItem(i);
	    if (inId == item.getValue("id")) {
		return item;
	    }
	}
	return null;
    },
    searchChange: function(inSender) {
	var q = {};

	var showBindings = this.showBindings.getChecked();
	if (!showBindings) {
	    q.isBinding = false;
	}
	this.eventsGrid.setQuery(q);
	inSender.focus();
    },
   activate: function() {
    },
    deactivate: function() {
    }
});

