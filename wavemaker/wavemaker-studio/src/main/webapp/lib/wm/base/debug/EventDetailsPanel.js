/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
                        {show:!wm.isMobile,field:"order", title:"Order", width: "40px", formatFunc:"getRowNumb"},
                        {show:!wm.isMobile,field:"eventType", title:"Type", width: "100px", formatFunc:"getEventType"},
                        {show: true, field: "sourceDescription", width: "60%", title: "Cause of Action"},
                        {show: true, field: "resultDescription", width: "100%", title: "Action Taken"},
                         {"show":!wm.isMobile,"field":"time","title":"Time","width":"80px","align":"left","formatFunc": "wm_date_formatter",
                          "formatProps": {
                          "dateType": "time",
                          formatLength: "medium"
                          }},
                         {"show":!wm.isMobile,"field":"duration","title":"Length (ms)","width":"80px","align":"left","formatFunc": "wm_number_formatter"}
                                      ],
                              "margin":"4"}, {}, {
                                  binding: ["wm.Binding", {"name":"binding"}, {}, {
                                  wire: ["wm.Wire", {"expression":undefined,"name":"wire","source":"eventListVar","targetProperty":"dataSet"}, {}]
                                  }]
                              }]
                

        }, this);
    },
    getEventType: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
        return wm.debug.EventsPanel.prototype.getEventType(inValue, rowId, cellId, cellField, cellObj, rowObj);
    },
    getRowNumb: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
        return rowId + 1;
    },
    inspect: function(inComponent, inRequestData, inEventObj) {
        if (!inEventObj) {
            this.hide();
            return;
        }
        this.show();

        var id = inEventObj.id;

        var causeList = inEventObj.causeList || [];
        causeList.push({
            dataValue: id
        });
        var eventChain = [];
        var resultEvtHash = {};
        var lastEvt = "";
        var itemList = [];
        for (var i = 0; i < causeList.length; i++) {
            var item = wm.debug.EventsPanel.prototype.findEventById(causeList[i].dataValue);
            itemList.push(dojo.clone(item));
        }
        this.eventListVar.setData(itemList);
        this.html.setHtml("The grid below shows the chain of events that led to the selected event occuring");
    },
    showDetails: function() {

    }
});