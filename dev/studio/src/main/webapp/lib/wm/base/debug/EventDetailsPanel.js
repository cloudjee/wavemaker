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
	    eventListVar:["wm.Variable", {type: "debugEventType", isList: true}],
	    html: ["wm.Html", {margin: "8", width: "100%", height: "80px", autoSizeHeight:1}],
	    eventsGrid: ["wm.DojoGrid", 
				 {width: "100%", height: "100%","columns":[
				     {"show":true,"field":"sourceEvent","title":"Source Event","width":"100%","align":"left","formatFunc":"", expression: "${firingId} + '.' + ${eventName} + '()'"},
				     {"show":true,"field":"resultEvent","title":"Resulting Event","width":"100%","align":"left","formatFunc":"",expression: "${affectedId} + '.' + (${isBinding} ? 'setValue(' + ${boundProperty} + ',' + (${boundValue}||null) + ')' : (${method} || ${eventName}) + '()')"}
				 ],
				  "margin":"4"}, {}, {
				      binding: ["wm.Binding", {"name":"binding"}, {}, {
					  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"eventListVar","targetProperty":"dataSet"}, {}]
				      }]
				  }]
	}, this);
    },
    inspect: function(inComponent, inRequestData, inEventObj) {
	if (!inEventObj) {
	    this.hide();
	    return;
	} 
	this.show();

	var id = inEventObj.id;

	var causeList = inEventObj.causeList || [];
	var eventChain = [];
	if (causeList) {
	    for (var i = 0; i < causeList.length; i++) {
		var item = this.findEventById(causeList[i].dataValue);
		if (item) {
		    eventChain.push(item);
		}
	    }
	}
	eventChain.push(inEventObj);
	this.eventListVar.setData(eventChain);
	this.html.setHtml("The grid below shows the chain of events that led to the selected event occuring");
    },
    findEventById: function(inId) {
	var EventsTable =  app.debugDialog.eventsPanel.eventListVar;
	var count = EventsTable.getCount();
	for (var i = 0; i < count; i++) {
	    var item = EventsTable.getItem(i);
	    if (inId == item.getValue("id")) {
		return item.getData(); // don't return the item; an item can't be in two wm.Variables.
	    }
	}
	return null;
    }
});