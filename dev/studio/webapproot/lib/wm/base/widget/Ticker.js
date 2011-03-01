/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.widget.Ticker");
dojo.require("wm.base.widget.Panel");

dojo.declare("wm.Ticker", wm.Panel, {
	delay: 20,
	motion: 4,
	rewindDelay: 200,
	_rewindWait: 0,
	destroy: function() {
		this.stop();
		this.inherited(arguments);
	},
	init: function() {
		this.inherited(arguments);
		this._animate = dojo.hitch(this, "animate");
		this.start();
	},
	setDomNode: function(inNode) {
		if (this.domNode)
			this.domNode._noscroll = false;
		this.inherited(arguments);
		this.connect(this.domNode, "onmouseenter", this, "mouseenter");
		this.connect(this.domNode, "onmouseleave", this, "mouseleave");
		if (inNode)
			inNode._noscroll = true;
	},
	mouseenter: function() {
		this._pause = true;
	},
	mouseleave: function() {
		this._pause = false;
	},
	start: function() {
		if (!this.job) {
			this.job = setInterval(this._animate, this.delay);
		}
	},
	stop: function() {
		if (this.job) {
			clearInterval(this.job);
			this.job = null;
			this.setLeft(0);
		}
	},
	getLeft: function(inLeft) {
		return this.domNode.scrollLeft;
	},
	setLeft: function(inLeft) {
		this.domNode.scrollLeft = inLeft;
	},
	animate: function() {
		if (this._pause) 
			return;
		var l = this.getLeft();
		l += this.motion;
		this.setLeft(l);
		if (this._lastLeft == this.getLeft()) {
			if (this._rewindWait++ > this.rewindDelay) {
				this.setLeft(0);
				this._rewindWait = 0;
			}
		}
		this._lastLeft = this.getLeft();
	}
});

wm.Object.extendSchema(wm.Ticker, {
	startNow: { group: "operation", order: 10},
	stopNow: { group: "operation", order: 20},
	fitToContent: { ignore: 1 },		// ticker content must be larger than container to work
    layoutKind: { ignore: 1 },				// ticker only moves left to right (so don't allow top-to-bottom)
    fitToContentHeight: {ignore: 1},
    fitToContentWidth: {ignore: 1},
    scrollY: {ignore: true, writeonly: 1},
    touchScrolling: {ignore: true, writeonly: 1},
    scrollX: {ignore: true, writeonly: 1}
});

wm.Ticker.extend({
    themeable: false,
	startNow: "(click to start)",
	stopNow: "(click to stop)",
	designCreate: function() {
		this.inherited(arguments);
		this.stop();
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "startNow":
			case "stopNow":
				return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "startNow":
				return this.start();
			case "stopNow":
				return this.stop();
		}
		return this.inherited(arguments);
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
	},
});



