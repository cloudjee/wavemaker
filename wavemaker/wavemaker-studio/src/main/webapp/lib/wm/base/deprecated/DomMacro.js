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

dojo.provide("wm.base.components.DomMacro");

dojo.declare("wm.DomMacro", wm.Component, {
	steps: [],
	perform: function() {
		for (var i=0, s; s=this.steps[i]; i++) {
			this.doStep(s);
		}
	},
	doStep: function(inStep) {
		var fn = this[inStep.event + "Step"];
		if (fn)
			fn.apply(this, [inStep, dojo.byId(inStep.node)]);
	},
	clickStep: function(inStep, inNode) {
		var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		inNode.dispatchEvent(event);
	},
	sleepStep: function(inStep, inNode) {
		var t = new Date().getTime() + inStep.wait;
		while (new Date().getTime() < t);
	},
	keyStep: function(inStep, inNode) {
		var event = document.createEvent("KeyboardEvent");
		event.initKeyEvent("keydown", true, true, window, false, false, false, false, inStep.key, 0);
		inNode.dispatchEvent(event);
	},
	sendChar: function(inChar, inNode) {
		var event = document.createEvent("KeyboardEvent");
		event.initKeyEvent("keypress", true, true, window, false, false, false, false, 0, inChar);
		inNode.dispatchEvent(event);
	},
	stringStep: function(inStep, inNode) {
		var s = inStep.chars;
		inNode.focus();
		for (var i=0; i<s.length; i++) {
			this.sendChar(s.charCodeAt(i), inNode);
		}
		//document.body.focus();
		//inNode.blur();
	}
});
