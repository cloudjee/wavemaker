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

dojo.provide("wm.base.debug.EventsPanel");


dojo.declare("wm.debug.EventsPanel", wm.Container, {
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
	    duration: 0,
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

	return id;
    },
    endLogEvent: function(inId) {
	for (var i = this.currentEventChain.length-1; i >= 0; i--) {
	    if (this.currentEventChain[i].dataValue == inId) {
		wm.Array.removeElementAt(this.currentEventChain,i);		
		break;
	    }
	}
	var item = this.findEventItemById(inId);
	if (item) {
	    item.setValue("duration", new Date().getTime() - item.getValue("time"));
	}
    },
    findEventItemById: function(inId,startFromEnd) {
	var EventsTable =  app.debugDialog.eventsPanel.eventListVar;
	var count = EventsTable.getCount();

	if (startFromEnd) {
	    for (var i = count-1; i >= 0; i--) {
		var item = EventsTable.getItem(i);
		if (inId == item.getValue("id")) {
		    return item; // don't return the item; an item can't be in two wm.Variables.
		}
	    }
	} else {
	    for (var i = 0; i < count; i++) {
		var item = EventsTable.getItem(i);
		if (inId == item.getValue("id")) {
		    return item; // don't return the item; an item can't be in two wm.Variables.
		}
	    }
	}
	return null;
    },
    findEventById: function(inId,startFromEnd) {
	var item = this.findEventItemById(inId,startFromEnd);
	if (item)
	    return item.getData();
	return null;
    },
    postInit: function() {
	this.inherited(arguments);

	this.currentEventChain = [];

	var typeDef = this.createComponents({debugEventType: ["wm.TypeDefinition", {internal: true}, {}, {
	    field999: ["wm.TypeDefinitionField", {"fieldName":"id","fieldType":"number"}, {}],
	    field1000: ["wm.TypeDefinitionField", {"fieldName":"time","fieldType":"date"}, {}],
	    field1000b: ["wm.TypeDefinitionField", {"fieldName":"duration","fieldType":"number"}, {}],
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
	    field1012: ["wm.TypeDefinitionField", {"fieldName":"causeList","fieldType":"NumberData", isList: true}, {}]
	}]}, this)[0];
	//typeDef.setOwner(this);
	wm.typeManager.types.debugEventType.fields.id.include = ["update"];


	var components = this.createComponents({
	    eventListVar:  ["wm.Variable", {type: "debugEventType", isList: true}],
	    eventChainListVar:  ["wm.Variable", {type: "debugEventType", isList: true}],
	    gridPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%",  verticalAlign: "top", horizontalAlign: "left"},{},{
		searchPanel: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "20px", verticalAlign: "top", horizontalAlign: "left"},{},{
		    showBindings: ["wm.Checkbox", {width: "150px", captionSize: "120px", caption: "Show Bindings"},{onchange: "searchChange"}],
		    clearButton: ["wm.Button", {width: "60px", height: "20px", margin:"0",margin:"2",caption: "Clear",border:"1",borderColor:"#666"}, {onclick: "clearEvents"}]
		}],

		    eventsGrid: ["wm.DojoGrid", 
				 {width: "100%", height: "100%",query:{isBinding:false},"columns":[
				     {show:true,field:"eventType", title:"Type", width: "100px", formatFunc:"getEventType"},
				     {"show":true,"field":"sourceEvent","title":"Source Event","width":"100%","align":"left","formatFunc":"getSourceText"/*, expression: "(${firingId} ? ${firingId} + '.' : '') + (${eventName} == 'Binding' ? ' has changed' : ${eventName} + '()')"*/},
				     {"show":true,"field":"resultEvent","title":"Resulting Event","width":"100%","align":"left","formatFunc":"getResultText"/*,expression: "${affectedId} + '.' + (${isBinding} ? 'setValue(' + ${boundProperty} + ',' + (${boundValue}||null) + ')' : (${method} || ${eventName}) + '()')"*/},
				     {"show":true,"field":"time","title":"Time","width":"80px","align":"left","formatFunc": "wm_date_formatter",
				      "formatProps": {
					  "dateType": "time",
					  formatLength: "medium"
				      }},
				     {"show":true,"field":"duration","title":"Length (ms)","width":"80px","align":"left","formatFunc": "wm_number_formatter"}
				 ],
				  "margin":"4"}, {onSelectionChange: "showEvent"}, {
				      binding: ["wm.Binding", {"name":"binding"}, {}, {
					  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"eventListVar","targetProperty":"dataSet"}, {}]
				      }]
				  }]
	    }],
	    inspector: ["wm.debug.Inspector", {}, {onXClick: "XClick"}]
	},this);
    },
	XClick: function() {
	    this.eventsGrid.deselectAll();
	},
    getEventType: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	var eventType = rowObj.eventType;
	switch(eventType) {
	case "javascriptEvent": 
	case "componentEvent":
	case "subcomponentEvent":
	    return "Event";
	case "serviceCall":
	case "serviceCallResponse":
	    return "Service";
	case "bindingEvent":
	    return "Bind";
	}
	return eventType;
    },
    getResultText: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	if (rowObj.eventName == "Binding") {
	    return rowObj.affectedId + "<br/>setValue(" + rowObj.boundProperty + "," + (rowObj.boundValue || "null") + ")";
	} else {
	    return rowObj.affectedId + "." + rowObj.method + "()";
	}
    },
    getSourceText: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	if (rowObj.eventName == "Binding") {
	    if (rowObj.firingId.match(/ not found/)) {
		return rowObj.firingId;
	    } else {
		return rowObj.firingId + " has changed";
	    }
	} else {
	    return (rowObj.firingId ? rowObj.firingId + "." : "") + rowObj.eventName + "()";
	}
    },
    clearEvents: function() {
	this.eventListVar.clearData();
    },
    showEvent: function(inSender) {
	if (this.inShowEvent) return;
	this.inShowEvent = true;
	try {
	var data =  this.eventsGrid.selectedItem.getData();
	if (!data || !data.id) {
/*
	    this.eventsGrid.setColumnShowing("firingId", true, true);
	    this.eventsGrid.setColumnShowing("eventName", true, true);
	    */
	    this.eventsGrid.setColumnsShowing("eventType", true, true);
	    this.eventsGrid.setColumnShowing("sourceEvent", true, true);
	    this.eventsGrid.setColumnShowing("duration", true, true);
	    this.eventsGrid.setColumnShowing("time", true, false);


	    this.inspector.hide();
	    this.clearButton.show();
	    this.gridPanel.setWidth("100%");
	    return;
	}
/*
	    this.eventsGrid.setColumnShowing("firingId", false, true);
	    this.eventsGrid.setColumnShowing("eventName", false, true);
	    */
	    this.eventsGrid.setColumnShowing("eventType", false, true);
	    this.eventsGrid.setColumnShowing("sourceEvent", false, true);
	    this.eventsGrid.setColumnShowing("duration", false, true);
	    this.eventsGrid.setColumnShowing("time", false, false);
	this.gridPanel.setWidth("200px");
	this.clearButton.hide();
	var selectedComponentId = data.affectedId;
	if (selectedComponentId) {
	    var selectedComponent = app.getValueById(selectedComponentId);
	}
	this.inspector.show(true);
	this.inspector.inspect(selectedComponent, null, data);
	} catch(e) {
	} finally {
	    this.inShowEvent = false;
	}
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

