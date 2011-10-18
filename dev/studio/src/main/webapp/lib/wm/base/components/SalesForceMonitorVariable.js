/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
 

dojo.provide("wm.base.components.SalesForceMonitorVariable");
dojo.require("wm.base.components.ServiceVariable");


dojo.declare("wm.SalesForceMonitorVariable", wm.ServiceVariable, {
    pollSeconds: 15, // Frequency measured in seconds
    _intervalId: 0, 
    _timeStamp: 0,   // should be updated via cookie on initialization
    fieldName: "",   // name of the field we are monitoring
    eventMinorMax: "",  // if fieldName excedes this value give a "light" warning
    eventMajorMax:   "",  // if fieldName excedes this value give a "heavy" warning
    eventMinorMin: "",  // if fieldName falls below this value give a "light" warning
    eventMajorMin:   "",  // if fieldName falls below this value give a "heavy" warning
    eventMinorRegex: "", // If the new value matches this regex, fire a "light" warning
    eventMajorRegex: "",  // If the new value matches this regex fire a "heavy" warning
    
    init: function() {
        this.inherited(arguments);
        this._timeStamp = dojo.cookie(this.getId() +"_timeStamp") || new Date().getTime();
    },

    postInit: function() {
        this.inherited(arguments);
        if (!this.isDesignLoaded())
            this._intervalId = window.setInterval(dojo.hitch(this, "update"), this.pollSeconds*1000);
    },
    destroy: function() {
        if (this._intervalId)
            window.clearInterval(this._intervalId);
        this.inherited(arguments);
    },
    onSuccess: function() {
        this.inherited(arguments);
        var data = this.getData();
        if (!data || !data.length) return;

        var newData = [];
        for (var i = 0; i < data.length; i++) {
            data[i].createdDateSecs = new Date(data[i].createdDate).getTime();
            if (data[i].createdDateSecs > this._timeStamp) {
                newData.push(data[i]);
            }
        }
        if (!newData.length) return;
        newData = newData.sort(function(a,b) {
            if (a.createDateSecs > b.createdDateSecs) return -1;
            else if (a.createDateSecs == b.createdDateSecs) return 0;
            else return 1;
        });
        this._timeStamp = newData[newData.length-1].createdDateSecs;
        dojo.cookie(this.getId() +"_timeStamp", this._timeStamp);

        for (var i = 0; i < newData.length; i++) {
            var d = newData[i];
            if (d.fieldName.match(this.fieldName)) {
                // we are dealing with an integer if any of these are true...
                if (this.eventMinorMax || this.eventMajorMax || this.eventMinorMin || this.eventMajorMin) {
                    var newval = parseInt(d.newValue);
                    var oldval = parseInt(d.oldValue);
                    if (newval >= this.eventMajorMax && oldval < this.eventMajorMax) {
                        this.onEventMajorMax(d);
                    } else if (newval >= this.eventMinorMax && oldval < this.eventMinorMax) {
                        this.onEventMinorMax(d);
                    } else if (newval <= this.eventMajorMin && oldval > this.eventMajorMin) {
                        this.onEventMajorMax(d);
                    } else if (newval <= this.eventMinorMin && oldval > this.eventMinorMin) {
                        this.onEventMinorMax(d);
                    }
                } else if (d.newValue.match(this.eventMajorRegex) && !d.oldValue.match(this.eventMajorRegex)) {
                    this.onEventMajorRegex(d);
                } else if (d.newValue.match(this.eventMinorRegex) && !d.oldValue.match(this.eventMinorRegex)) {
                    this.onEventMinorRegex(d);
                }
            }
        }
    },
    onEventMinorMax: function(inFeedDataItem) {},
    onEventMinorMin: function(inFeedDataItem) {},
    onEventMajorMax: function(inFeedDataItem) {},
    onEventMajorMin: function(inFeedDataItem) {},
    onEventMinorRegex: function(inFeedDataItem) {},
    onEventMajorRegex: function(inFeedDataItem) {}

});

wm.SalesForceMonitorVariable.description = "Data from a service.";

/**#@+ @design */
wm.SalesForceMonitorVariable.extend({
	/** @lends wm.ServiceVariable.prototype */
});

wm.Object.extendSchema(wm.SalesForceMonitorVariable, {
    autoStart: {ignore: true},
    autoUpdate: {ignore: true}
});

/**#@- @design */
