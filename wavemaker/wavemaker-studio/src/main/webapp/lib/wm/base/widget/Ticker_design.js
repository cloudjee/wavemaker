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

dojo.provide("wm.base.widget.Ticker_design");
dojo.require("wm.base.widget.Ticker");


wm.Object.extendSchema(wm.Ticker, {
    startNow: { group: "operation", order: 10,operation:1},
    stopNow: { group: "operation", order: 20,operation:1},
	fitToContent: { ignore: 1 },		// ticker content must be larger than container to work
    resizeToFit: {ignore:1},
    layoutKind: { ignore: 1 },				// ticker only moves left to right (so don't allow top-to-bottom)
    fitToContentHeight: {ignore: 1},
    fitToContentWidth: {ignore: 1},
    scrollY: {ignore: true, writeonly: 1},
    touchScrolling: {ignore: true, writeonly: 1},
    scrollX: {ignore: true, writeonly: 1},
    lock: {ignore: 1},
    freeze: {ignore: 1},
    delay: {group: "display",subgroup:"scrolling"},
    imageList: {ignore: 1},
    motion: {group: "display", subgroup: "scrolling"},
    rewindDelay: {group: "display", subgroup: "scrolling"},
    autoScroll: {ignore: 1},
    customGetValidate: {ignore:1}
});

wm.Ticker.extend({
    themeable: false,
    startNow: function() {this.start();},
    stopNow:function() {this.stop();},
	designCreate: function() {
		this.inherited(arguments);
		this.stop();
	},
	_start: wm.Ticker.prototype.start,
	_stop: wm.Ticker.prototype.stop,
	start: function() {
		this.domNode._noscroll = true;
		this.reflowParent();
		this._start();
	},
	stop: function() {
		this._stop();
		this.domNode._noscroll = false;
		this.reflowParent();
	},
	afterPaletteDrop: function() {
		this.inherited(arguments);
	    this.setLayoutKind("left-to-right");
	    this.setWidth("100%");
	}
});



