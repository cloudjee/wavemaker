/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.drag.capture");

kit = dojo;

kit.declare("wm.Capture", null, {
	isCaptured: false,
	setEvents: function() {
		this.events = {};
		kit.forEach(arguments, kit.hitch(this, "addEvent"));
	},
	addEvent: function(inEvent) {
		if (!this[inEvent])
			this[inEvent] = function() {};
		this.events[inEvent] = kit.hitch(this, inEvent);
	},
	capture: function() {
		if (this.isCaptured)
			return;
		this.doCapture();
		this.isCaptured = true;
	},
	release: function() {
		if (!this.isCaptured)
			return;
		this.doRelease();
		this.isCaptured = false;
	}
});

if (kit.isIE) {
	wm.Capture.extend({
		_bind: function(inTarget, inEvent, inHandler) {
			var on = 'on' + inEvent, old = inTarget[on];
			inTarget[on] = function(){
				inHandler(kit.fixEvent());
			};
			return old;
		},
		_unbind: function(inTarget, inEvent, inHandler) {
			var on = 'on' + inEvent;
			inTarget[on] = inHandler;
		},
		doCapture: function() {
			var n = document.body, e, oldf, newf;
			n.setCapture(true);
			this._captures = {};
			for (var i in this.events) {
				if (!(0)[i]) {
					this._captures[i] = this._bind(n, i, this.events[i]);
				}
			}
		},
		doRelease: function() {
			var n = document.body;
			for (var i in this._captures) {
				if (!(0)[i]) {
					this._unbind(n, i, this._captures[i]);
				}
			}
			this._captures = null;
			n.releaseCapture(true);
		}
	});
} else {
	wm.Capture.extend({
		doCapture: function(inEvents) {
			for (var i in this.events) {
				if (!(0)[i])
					document.addEventListener(i, this.events[i], true);
			}
		},
		doRelease: function() {
			for (var i in this.events) {
				if (!(0)[i])
					document.removeEventListener(i, this.events[i], true);
			}
			this.isCaptured = false;
		}
	});
}

kit.declare("wm.MouseCapture", wm.Capture, {
	constructor: function() {
		this.setEvents("mousemove", "mouseup", "mouseout", "click");
	},
	mousedown: function(e) {
		// FIXME: prevents "click" on FF2 ... have to test other browsers
		kit.stopEvent(e);
		this.capture();
	},
	mousemove: function(e) {
	},
	mouseout: function(e) {
		// helpful for motion detection
	},
	mouseup: function(e) {
		// FIXME: putting this here because "stopEvent" in mousedown prevents "click" on FF2 ... have to test other browsers
		this.release();
		kit.stopEvent(e);
	},
	click: function(e) {
		// FIXME: not executed because "stopEvent" in mousedown prevents "click" on FF2 ... have to test other browsers
		alert("MouseCapture saw a click!");
	}
});
