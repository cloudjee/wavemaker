/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Toolbar");
dojo.require("wm.base.widget.Panel");

/**
	A container of buttons
	@name wm.Toolbar
	@class
	@extends wm.Panel
*/
// FIXME: todo, add support for wm.ImageList
dojo.declare("wm.Toolbar", wm.Panel, {
	box: "h",
	boxPosition: "bottomRight",
	_classes: {domNode: ["wm_Padding_4px"]},
	height: "28px",
	init: function() {
		this.inherited(arguments);
		this.initContents();
		dojo.connect(this.domNode, "onclick", this, "click");
	},
	initContents: function() {
		this.makeButtons(this.buttonList);
	},
	makeButtons: function(inButtonList) {
		this.buttons = this.$$ = {};
		if (inButtonList) {
			var l = inButtonList.length;
			dojo.forEach(inButtonList, function(n, i) {
				var b = this.buttons[n] = new wm.Button({owner: this, parent: this, caption: n, name: "button" + i});
					b.spacer = new wm.Spacer({owner: this, parent: this, width: "4px", name: "spacer" + i, showing: (i < l-1)});
			}, this);
		}
	},
	getButton: function(inName) {
		return this.buttons[inName];
	},
	getLastShowingButton: function(inWidgets, inButton) {
		var a = dojo.indexOf(inWidgets, inButton);
		for (var i = (a == -1 ? inWidgets.length : a)-1; w=inWidgets[i]; i--)
			if (w.showing && (w instanceof wm.Button))
				return w;
	},
	setButtonShowing: function(inName, inTrueToShow) {
		var b = this.getButton(inName);
		if (b) {
			b.setShowing(inTrueToShow);
			b.spacer.setShowing(inTrueToShow);
			// make sure last button has spacer correctly before and after it
			var $$ = this.getOrderedWidgets(), l = this.getLastShowingButton($$);
			if (l) {
				// last showing button's spacer is hidden
				l.spacer.hide();
				// previous to last showing button's spacer is showing
				$$.splice(dojo.indexOf($$, l));
				var p = this.getLastShowingButton($$);
				if (p && p != l)
					p.spacer.show();
			}
		}
	},
	click: function(e) {
		if (e.target.tagName == "BUTTON")
			this.onclick(e.target.innerHTML)
	},
	onclick: function(inEvent, inCaption) {
	},
	adjustChildProps: function(inCtor, inProps) {
		this.inherited(arguments);
		// this widget is owner so that children are not in part space
		dojo.mixin(inProps, {owner: this});
	},
	writeChildren: function() {
		// we don't want to stream our child widgets
		// since we create them at runtime.
		return [];
	}
});

wm.Object.extendSchema(wm.Toolbar, {
	buttons: {ignore: 1}
});