/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.drag.layout");

/**
	@class
	@name wm.LayoutDragDropper
	@inherits wm.DragDropper
*/
dojo.declare("wm.LayoutDragDropper", wm.DragDropper, {
	constructor: function() {
		this.info = {};
	},
	beginDrag: function(inEvent, inInfo) {
		this.info = inInfo || this.info;
		this.mousedown(inEvent);
	},
	initNodes: function() {
		this.inherited(arguments);
		// make a drop marker
		this.markNode = document.createElement("div");
		this.markNode.style.cssText = "position: absolute; z-index: 2; border: 2px solid green;";
		this.scrimNode.appendChild(this.markNode);
	},
	updateAvatar: function() {
		this.showHideAvatar(Boolean(this.target));
		if (this.target) {
			this.setAvatarContent("Drop <b>" + this.info.caption + "</b>" + " into <b>" + this.target.name + "</b>");
		}
	},
	setTarget: function(inTarget){
		this.target = inTarget;
		if (this.target) {
			this.setCursor("default");
			this.targetNode = this.target.containerNode || this.target.domNode;
			this.targetOff = wm.calcOffset(this.targetNode, this.scrimNode);
		} else {
			this.setCursor("no-drop");
			this.targetNode = null;
			this.targetOff = null;
		}
		this.updateAvatar();
	},
	canBeTarget: function(inWidget) {
		return (inWidget.container && !inWidget.flags.notInspectable && !inWidget.getFreeze());
	},
	_findTarget: function(inHit, inWidget, inMargin) {
		var h = inHit, dn = inWidget.domNode, w, b, o;
		var sl = dn.scrollLeft, st = dn.scrollTop;
		var ws = inWidget.widgets;
		var m = inMargin || 0;
		for (var i in ws) {
			w = ws[i];
			if (w.container && (w != this.info.control) && !w.getLock()) {
				b = kit._getMarginBox(w.domNode);
				if (w.domNode.parentNode != inWidget.domNode){
					// offset from target rect to hit frame
					o = wm.calcOffset(w.domNode.parentNode, inWidget.domNode);
					b.l += o.x; 
					b.t += o.y;
				} else {
					b.l -= sl; 
					b.t -= st;
				}
				// must be well inside
				b.r = b.l + b.w; 
				b.b = b.t + b.h;
				if (h.l-b.l>m && b.r-h.l>m && h.t-b.t>m && b.b-h.t>m) {
				//if (h.l-b.l>1 && b.r-h.l>1 && h.t-b.t>1 && b.b-h.t>1) {
					h.l -= b.l; 
					h.t -= b.t;
					return this._findTarget(h, w, m+2);
				}
			}
		}
		// FIXME: sort out _noCreate
		var t = inWidget._noCreate ? inWidget.parent : inWidget;
		return this.canBeTarget(t) ? t : null;
	},
	findTarget: function(inHit) {
		var t = this._findTarget(inHit, this.root);
		if (t != this.target) {
			this.setTarget(t);
		}
	},
	start: function(e) {
		this.root = studio.page.root;
		this.rootOffset = wm.calcOffset(this.root.domNode.parentNode, this.scrimNode);
		var t = this.canBeTarget(this.root) ? this.root : null;
		this.setTarget(t);
		// reset drop marker
		kit._setMarginBox(this.markNode, 0, 0, 0, 0);
		this.inherited(arguments);
		this.updateAvatar();
	},
	drag: function(e) {
		this.inherited(arguments);
		// calc a target rect
		var r = { l: this.pxp - this.rootOffset.x, t: this.pyp - this.rootOffset.y, w:0, h: 0};
		// locate target
		//var t = inEvent.ctrlKey ? d.originalTarget : this.findTarget(d, inEvent);
		this.findTarget(r);
		if (this.target) {
			// calculate suggested drop rect
			var r = { l: this.pxp - this.targetOff.x, t: this.pyp - this.targetOff.y, w:0, h: 0};
			this.target.suggestDropRect(r);
			//wm.layout.box.suggest(this.targetNode, r);
			// position the drop hint
			kit._setMarginBox(this.markNode, r.l + this.targetOff.x, r.t + this.targetOff.y, r.w, r.h);
			// cache drop position
			this.dropRect = r; //{l: r.l, t: r.t};
		}
	}
});

/**
	@class
	@name wm.LayoutResizer
	@inherits wm.DragDropper
*/
dojo.declare("wm.LayoutResizer", wm.DragDropper, {
	snapMask: 7,
	constructor: function() {
		this.info = {};
	},
	beginDrag: function(inEvent, inInfo) {
		this.info = inInfo || this.info;
		this.info.caption = this.info.control.name;
		this.info.node = this.info.control.domNode;
		this.info.rect = dojo.marginBox(this.info.node);
		this.mousedown(inEvent);
	},
	updateAvatar: function() {
		this.setAvatarContent("<b>" + this.info.caption + "</b>: " + this.dropRect.w + ", " + this.dropRect.h);
	},
	start: function(e) {
		this.inherited(arguments);
		this.setCursor(this.info.cursor);
	},
	applyMouseDelta: function() {
		with (this.info.rect) 
			this.dropRect = { l: l, t: t, w: w, h: h };
		with (wm.design.handles) {
			switch (this.info.handleId) {
				case leftTop:
				case middleTop:
				case rightTop:
					this.dropRect.t += this.dy;
					this.dropRect.h -= this.dy;
					break;
				case leftBottom:
				case middleBottom:
				case rightBottom: 
					this.dropRect.h += this.dy;
					break;
			}
			switch (this.info.handleId) {
				case leftTop:
				case leftMiddle:
				case leftBottom:
					this.dropRect.l += this.dx;
					this.dropRect.w -= this.dx;
					break;
				case rightTop:
				case rightMiddle:
				case rightBottom:
					this.dropRect.w += this.dx;
					break;
			}
		}
	},
	applySnap: function(inRect) {
		with (wm.design.handles) {
			switch (this.info.handleId) {
				case leftTop:
				case middleTop:
				case rightTop:
				case leftBottom:
				case middleBottom:
				case rightBottom: 
					inRect.h = this.snap(inRect.h);
					break;
				case leftTop:
				case leftMiddle:
				case leftBottom:
				case rightTop:
				case rightMiddle:
				case rightBottom:
					inRect.w = this.snap(inRect.w);
					break;
			}
		}
	},
	snap: function(inValue) {
		return inValue - (inValue & this.snapMask);
	},
	drag: function(e) {
		this.inherited(arguments);
		this.applyMouseDelta();
		//if (!e.shiftKey) {
			this.applySnap(this.dropRect);
		//}
		with (this.dropRect) {
			w = Math.max(1, w);
			h = Math.max(1, h);
		}
		// FIXME: figure out what is best practice for resizing
		if (this.info.control.container)
			this.info.control.designWrapper._setBounds(this.dropRect);
		else
			this.info.control.designWrapper.setBounds(this.dropRect);
		//this.info.control.setMarginBox(this.dropRect);
		//dojo.marginBox(this.info.node, this.dropRect);
		this.updateAvatar();
	}
});