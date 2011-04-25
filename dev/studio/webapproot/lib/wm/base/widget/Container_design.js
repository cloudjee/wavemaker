/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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


dojo.provide("wm.base.widget.Container_design");
dojo.require("wm.base.widget.Container");

wm.Container.extend({
	listProperties: function() {
		var p = this.inherited(arguments);
		p.freeze.ignoretmp = this.schema.freeze.ignore || this.getLock();
		return p;
	},
	writeChildren: function(inNode, inIndent, inOptions) {
		var s = [];
		wm.forEach(this.getOrderedWidgets(), function(c) {
			if (wm.isDesignable(c) && !c.flags.notStreamable)
				s.push(c.write(inIndent, inOptions));
		});
		return s;
	},
	suggestDropRect: function(inControl, ioInfo) {
		this.layout.suggest(this, inControl, ioInfo);
	},
	suggestSize: function(inControl, ioInfo) {
		this.layout.suggestSize(this, inControl, ioInfo);
	},
	designMoveControl: function(inControl, inDropInfo) {
		info = {l:inDropInfo.l, t:inDropInfo.t, i: inDropInfo.i};
		if (inControl.parent == this) {
			// inDropInfo.index 'i' may be counting inControl
			this.moveControl(inControl, info.i || 0);
		} else {
			var p = inControl.parent;
			inControl.setParent(this);
			inControl.designWrapper.controlParentChanged();
			// inDropInfo.index 'i' is never counting inControl
			this.removeControl(inControl);
			this.insertControl(inControl, info.i || 0);
			if (p)
				p.reflow();
		}
		if (this.layout.insert) {
			this.layout.insert(this, inControl, inDropInfo);
			//return;
		}
		this.reflow();
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "layoutKind":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: wm.layout.listLayouts()});

                case "themeStyleType":
		    return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]});
		}
		return this.inherited(arguments);
	},
	resizeUpdate: function(inBounds) {
		// update the boundary rectangle highlight only
		this.designWrapper._setBounds(inBounds);
	},

_end: 0
});

wm.Object.extendSchema(wm.Container, {
    layoutKind:         {group: "layout", order: 100, doc: 1},
    horizontalAlign:    {group: "layout", order: 110, doc: 1, options: ["left","center","right"]},
    verticalAlign:      {group: "layout", order: 120, doc: 1, options: ["top","middle","bottom"]},
    fitToContent:       {ignore: true},
    fitToContentWidth:  {group: "advanced layout", order: 90, shortname: "Auto Width", type: "Boolean"},
    fitToContentHeight: {group: "advanced layout", order: 91, shortname: "Auto Height", type: "Boolean"},
    autoScroll: {group: "scrolling", order: 100, ignore: 0, type: "Boolean"},
    scrollX: {group: "scrolling", order: 101, ignore: 0, type: "Boolean"},
    scrollY: {group: "scrolling", order: 102, ignore: 0, type: "Boolean"},
    touchScrolling: {group: "scrolling", order: 103, ignore: 0},
    isMajorContent: {group: "style", order: 150, ignore: 1}, // obsolete
    themeStyleType: {ignore: true, group: "style", order: 150},
    setThemeStyleType: {group: "method"},
    getThemeStyleType: {group: "method", returns: "String"},
    reflow: {group: "method"},
    getInvalidWidget: {group: "method", returns: "wm.Control"},
    setHorizontalAlign:    {group: "method"},
    setVerticalAlign:      {group: "method"},
    customGetValidate:     {group: "customMethods"}
});
