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



dojo.provide("wm.base.widget.Container_design");
dojo.require("wm.base.widget.Container");
dojo.require("wm.base.Control_design");

wm.Object.extendSchema(wm.Container, {
    hint: {ignore:true},
    layoutKind:         {group: "layout", order: 100, doc: 1, options: ["top-to-bottom","left-to-right"]},
    horizontalAlign:    {group: "layout", order: 110, doc: 1, options: ["left","center","right"]},
    verticalAlign:      {group: "layout", order: 120, doc: 1, options: ["top","middle","bottom"]},
    fitToContent:       {ignore: true},
    fitToContentWidth:  {group: "advanced layout", order: 90, shortname: "Auto Width", type: "Boolean"},
    fitToContentHeight: {group: "advanced layout", order: 91, shortname: "Auto Height", type: "Boolean"},
    autoScroll: {writeonly: 0},
    scrollX: {group: "scrolling", order: 101, ignore: 0, type: "Boolean"},
    scrollY: {group: "scrolling", order: 102, ignore: 0, type: "Boolean"},
    touchScrolling: {group: "scrolling", order: 103, ignore: 0},
    isMajorContent: {group: "style", order: 150, ignore: 1}, // obsolete
    themeStyleType: {ignore: true, group: "style", order: 20, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]},
    setThemeStyleType: {method:1},
    getThemeStyleType: {method:1, returns: "String"},
    reflow: {method:1},
    getInvalidWidget: {method:1, returns: "wm.Control"},
    setHorizontalAlign:    {method:1},
    setVerticalAlign:      {method:1},
    clearData: {method:1},
    resetData: {method:1},
    clearDirty: {method:1},
    resetData: {method:1},
    clearDirty: {method:1},
    customGetValidate:     {group: "customMethods"},
		invalid: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },
		isDirty: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },
	    lock: { order: 0, type: "Boolean" },
		freeze: { order: 5, type: "Boolean" },
		box: { ignore: 1 },
    boxPosition: { ignore: 1},
    resizeToFit: {group: "operation", operation: true}
});


wm.Container.extend({
	listProperties: function() {
		var p = this.inherited(arguments);
		p.freeze.ignoretmp = this.schema.freeze.ignore || this.getLock();
	        p.resizeToFit.ignoretmp = this.percEx && this.percEx.w && this.percEx.h || this.fitToContent;
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
	        var container = this.containerWidget || this;
		if (inControl.parent == container) {
			// inDropInfo.index 'i' may be counting inControl
			container.moveControl(inControl, info.i || 0);
		} else {
			var p = inControl.parent;
			inControl.setParent(container);
		    if (inControl.designWrapper)
			inControl.designWrapper.controlParentChanged();
			// inDropInfo.index 'i' is never counting inControl
			container.removeControl(inControl);
			container.insertControl(inControl, info.i || 0);
			if (p)
				p.reflow();
		}
		if (container.layout.insert) {
			container.layout.insert(container, inControl, inDropInfo);
			//return;
		}
		container.reflow();
	},

    resizeToFit: function() {
	this.designResizeForNewChild("left-to-right", true);
	this.designResizeForNewChild("top-to-bottom", true);
    },
	resizeUpdate: function(inBounds) {
		// update the boundary rectangle highlight only
		this.designWrapper._setBounds(inBounds);
	},
    designResizeForNewChild: function(layoutKind, reduceSize) {
	if (!this.autoScroll && 
	    !this.scrollX && 
	    !this.scrollY && 
	    !this.fitToContent) 
	{
	    if (!layoutKind) {
		layoutKind = this.layoutKind;
	    }
	    if (layoutKind == "left-to-right") {
		var preferredWidth = this.getPreferredFitToContentWidth();
		var width = this.bounds.w;
		if (preferredWidth > width) {
		    if (!this._percEx.w) {
			this.setWidth(preferredWidth + "px");
		    } else {
			if (this.parent && this.parent instanceof wm.Layout == false) {
			    this.parent.designResizeForNewChild(layoutKind);
			}
		    }
		} else if (reduceSize && !this._percEx.w) {
		    this.setWidth(preferredWidth + "px");
		}
	    } else {
		var preferredHeight = this.getPreferredFitToContentHeight();
		var height = this.bounds.h;
		if (preferredHeight > height) {
		    if (!this._percEx.h) {
			this.setHeight(preferredHeight + "px");
		    } else {
			if (this.parent && this.parent instanceof wm.Container && this.parent instanceof wm.Layout == false) {
			    this.parent.designResizeForNewChild(layoutKind);
			}
		    }
		} else if (reduceSize && !this._percEx.h) {
		    this.setHeight(preferredHeight + "px");
		}


	    }
	}
    },
_end: 0
});
