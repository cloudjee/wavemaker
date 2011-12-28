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

dojo.provide("wm.base.debug.EventDetailsPanel");

dojo.declare("wm.debug.EventDetailsPanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Event Details",
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    autoScroll: true,



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



    postInit: function() {
	this.inherited(arguments);
	this.createComponents({
	    eventListVar:["wm.Variable", {type: "EntryData", isList: true}],
	    html: ["wm.Html", {margin: "8", width: "100%", height: "80px", autoSizeHeight:1}],
	    eventsGrid: ["wm.DojoGrid", 
				 {width: "100%", height: "100%","columns":[
				     {"show":true,"field":"dataValue","title":"Type","width":"100px","align":"left"},
				     {"show":true,"field":"name","title":"Event","width":"100%","align":"left"}
				 ],
				  "margin":"4"}, {}, {
				      binding: ["wm.Binding", {"name":"binding"}, {}, {
					  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"eventListVar","targetProperty":"dataSet"}, {}]
				      }]
				  }]
	}, this);
    },
    getResultText: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	return wm.debug.EventsPanel.prototype.getResultText(inValue, rowId, cellId, cellField, cellObj, rowObj);
    },
    getSourceText: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	return wm.debug.EventsPanel.prototype.getSourceText(inValue, rowId, cellId, cellField, cellObj, rowObj);
    },
    inspect: function(inComponent, inRequestData, inEventObj) {
	if (!inEventObj) {
	    this.hide();
	    return;
	} 
	this.show();

	var id = inEventObj.id;

	var causeList = inEventObj.causeList || [];
	causeList.push({dataValue:id});
	var eventChain = [];	

	    var lastEvt = "";
	    for (var i = 0; i < causeList.length; i++) {
		var item = wm.debug.EventsPanel.prototype.findEventById(causeList[i].dataValue);
		if (item) {
		    var sourceEvt = wm.debug.EventsPanel.prototype.getSourceText(null, null, null, null, null, item);
		    var resultEvt = wm.debug.EventsPanel.prototype.getResultText(null, null, null, null, null, item);
		    var evtType = wm.debug.EventsPanel.prototype.getEventType(null, null, null, null, null, item);;
		    if (sourceEvt != lastEvt) {
			eventChain.push({dataValue: evtType,
					 name: sourceEvt});
		    }
		    if (sourceEvt != resultEvt) {
			eventChain.push({dataValue: evtType,
					 name: resultEvt});
			var lastEvt = resultEvt;
		    }
		}
	}
	this.eventListVar.setData(eventChain);
	this.html.setHtml("The grid below shows the chain of events that led to the selected event occuring");
    }
});