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
dojo.provide("wm.base.widget.Splitter");
dojo.require("wm.base.widget.Bevel");

/**
	@class
	@name wm.SplitterResize
	@inherits wm.MouseDrag
*/
dojo.declare("wm.SplitterResize", wm.MouseDrag, {
	beginResize: function(e, inSplitter) {
		this.splitter = inSplitter;
		this.setCursor(this.splitter.vertical ? "w-resize" : "n-resize");
		this.mousedown(e);
	},
	drag: function() {
		this.inherited(arguments);
		this.splitter.drag(this.dx, this.dy);
	},
	finish: function() {
		this.inherited(arguments);
		this.splitter.drop();
	}
});

dojo.declare("wm.Splitter", wm.Bevel, {
	className: "wmsplitter",
	minimum: -1,
	maximum: -1,
	mode: dojo.isMoz || dojo.isIE ? 2 : 0,
	layout: "",
	constructor: function() {
		wm.Splitter.resizer = wm.Splitter.resizer || new wm.SplitterResize();
	},
	init: function() {
		this.inherited(arguments);
		this.findLayout();
		this.connectEvents(this.domNode, ["mousedown", "dblclick"]);
	},
	/*
	// FIXME: unify canSize and getSizeNode
	canSize: function(n, next) {
		while (n=n[next]) {
			if (n.style && !n.style.visibility && !n.style.display)
				return !(n.flex > 0);
		}
		return false;
	},
	*/
	findLayout: function() {
		var v = (this.parent||0).layoutKind == "left-to-right", p = this.parent.prevSibling(this);
		if (p) {
			var l = v ? (p.width == "100%" ? "right" : "left") : (p.height == "100%" ? "bottom" : "top");
			this.setLayout(l);
		}
	},
	setLayout: function(inLayout) {
		this.layout = inLayout;
		this.removeOrientation();
		this.vertical = this.layout == "left" || this.layout == "right";
		this.addOrientation();
		this.updateSize();
	},
	getSizeControl: function() {
		//if (!this.layout) 
			//this.findLayout();
		switch (this.layout) {
			case "left":
			case "top":
				return this.parent.prevSibling(this);
				/*var node = this.domNode.previousSibling;
				while (node && node.nodeType != 1)
					node = node.previousSibling;
				break;*/
			case "right":
			case "bottom":
				return this.parent.nextSibling(this);
				/*var node = this.domNode.nextSibling;
				while (node && node.nodeType != 1)
					node = node.nextSibling;
				break;*/
		}
		//return node;
	},
	getPosition: function() {
		//return { top: this.domNode.offsetTop, left: this.domNode.offsetLeft };
		return { top: this.bounds.t, left: this.bounds.l };
	},
	mousedown: function(e) {
		this.sizeControl = this.getSizeControl();
		if (!this.sizeControl)
			return;
		//this.size = dojo._getMarginBox(this.sizeNode);
		//this.containerSize = dojo._getContentBox(this.sizeNode.parentNode);
		this.size = this.sizeControl.cloneBounds();
		this.containerSize = this.sizeControl.parent.cloneBounds();
		this.initialPosition = this.getPosition();
		this.position = this.getPosition();
		wm.Splitter.resizer.beginResize(e, this);
	},
	drag: function(inDx, inDy) {
		if (this.vertical)
			this.moveX(inDx);
		else
			this.moveY(inDy);
		this.changing();
	},
	drop: function() {
		this.change();
	},
	// events
	changing: function() { 
		this._collapsed = false;
		switch(this.mode) {
			case 0:
				// slowest, best feedback
				this.adjustSize();
				this.reflowParent();
				break;
			/*case 1:
				// slower, partial feedback
				this.adjustSize();
				with (wm.layout.box) {
					recurse = false;
					this.reflowParent();
					recurse = true;
				}
				wm.job(this.id+"reflow", 5, dojo.hitch(this, "reflowParent"));
				break;*/
			default:
				// fastest, minimal feedback (do nothing)
				break;
		}
	},
	change: function() {
		this.adjustSize();
		this.reflowParent();
	},
	boundValue: function(inValue) {
		var x = inValue;
		if (this.minimum != -1)
			inValue = Math.max(this.minimum, inValue);
		if (this.maximum != -1)
			inValue = Math.min(this.maximum, inValue);
		this.atLimit = (x != inValue);
		return inValue;
	},
	adjustSize: function() {
		var dx = this.position.left - this.initialPosition.left, dy = this.position.top - this.initialPosition.top
		var w = this.size.w + (this.layout=="right" ? -dx : dx), h = this.size.h + (this.layout=="bottom" ? -dy : dy);
		//console.log(w, h, dx, dy);
		//dojo._setMarginBox(this.sizeNode, NaN, NaN, w, h);
		this.sizeControl.setBounds(NaN, NaN, w, h);
	},
	move: function(inD, inOrd, inExtent) {
		if (inD == 0)
			return;
		this.position[inOrd] = this.initialPosition[inOrd] + inD;
		if (this.layout==inOrd)
			this.position[inOrd] = this.boundValue(this.position[inOrd]);
		else {
			var e = this.containerSize[inExtent];
			this.position[inOrd] = e - this.boundValue(e - this.position[inOrd]);
		}
		this.domNode.style[inOrd] = this.position[inOrd] + "px";
	},
	moveX: function(inDx) {
		this.move(inDx, "left", "w");
	},
	moveY: function(inDy) {
		this.move(inDy, "top", "h");
	},
	dblclick: function() {
		app.scrim.scrimOnIdle(this, function(){
			if (this._collapsed)
				this.expand();
			else
				this.collapse();
		});
	},
	collapse: function() {
		this._collapsed = true;
		this.initialPosition = this.getPosition();
		this._expandedPosition = dojo.mixin({}, this.initialPosition);
		switch (this.layout) {
			case "left":
				this.position.left = 0;
				break;
			case "top":
				this.position.top = 0;
				break;
			case "right":
				this.position.left = this.boundValue(this.position.left + this.size.w);
				break;
			case "bottom":
				this.position.top = this.boundValue(this.position.top + this.size.h);
				break;
		}
		this.change();
	},
	expand: function() {
		this._collapsed = false;
		this.initialPosition = this.getPosition();
		dojo.mixin(this.position, this._expandedPosition);
		this.change();
	}
});


wm.Object.extendSchema(wm.Splitter, {
	left: {ignore: 1},
	height: {ignore: 1},
	top: {ignore: 1},
	mode: {ignore: 1},
	border: {ignore: 1},
	borderColor: {ignore: 1},
	margin: {ignore: 1},
	padding: {ignore: 1},
	minWidth:   { ignore: 1 },
	minHeight:   { ignore: 1 },
	minimum: { group: "layout", order: 1},
	maximum: { group: "layout", order: 5}
});
