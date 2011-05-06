/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.design.Drag");
dojo['require']('wm.base.drag.drag');
/**
	@class
	@name wm.LayoutDragDropper
	@inherits wm.DragDropper
*/
dojo.declare("wm.design.Mover", wm.DragDropper, {
	constructor: function() {
		this.info = {};
	    this.domNodes = [];
	},
/* This is a very useful debugging section; do not delete!
    getDomNode: function(i) {
	if (!this.domNodes[i]) {
	    var node = document.createElement("span");
	    node.id = "Tracker" + i;
	    node.style.position = "absolute";
	    node.style.backgroundColor = ["red", "blue", "green", "yellow", "black", "orange", "purple", "gray", "white"][i];
	    node.style.zIndex = 1000;
	    this.domNodes[i] = node;
	}
	return this.domNodes[i];
    },
    */
	beginDrag: function(inEvent, inInfo) {
		this.info = inInfo || this.info;
		if (this.info && this.info.control){
		  var parentForm = wm.getParentForm(this.info.control);
			this.info.parentForm = parentForm instanceof wm.LiveFormBase ? parentForm : null;	
		}
		
		this.mousedown(inEvent);
	},
	initNodes: function() {
		this.inherited(arguments);
		// make a drop marker
		this.markNode = document.createElement("div");
		this.markNode.style.cssText = "position: absolute; z-index: 2; border: 2px solid green;";
		this.scrimNode.appendChild(this.markNode);
		// make snap markers
		this.hSnapNode = document.createElement("div");
		this.hSnapNode.style.cssText = "position: absolute; z-index: 2; border: 1px dotted red; display: none;";
		this.scrimNode.appendChild(this.hSnapNode);
		// make snap markers
		this.vSnapNode = document.createElement("div");
		this.vSnapNode.style.cssText = "position: absolute; z-index: 2; border: 1px dotted red; display: none;";
		this.scrimNode.appendChild(this.vSnapNode);
	},
	start: function(e) {
		this.target = null;
		kit._setMarginBox(this.markNode, 0, 0, 0, 0);
		this.root = window.studio ? studio.page.root : app._page.root;
		this.rootOffset = wm.calcOffset(this.root.domNode.parentNode, this.scrimNode);
		this.inherited(arguments);
		this.setTarget(null);
		this.designable = this.isDesignable();
	},
	drag: function(e) {
		this.inherited(arguments);
		// calc a target rect
		var r = { l: this.pxp - this.rootOffset.x, t: this.pyp - this.rootOffset.y, w:0, h: 0};
		// locate target
		this.findTarget(r);
		if (this.target && this.designable) {
			// calculate suggested drop rect
			var r = { l: this.pxp - this.targetOff.x, t: this.pyp - this.targetOff.y, w:0, h: 0, dx: this.dx, dy: this.dy};
			this.target.suggestDropRect(this.info.control, r);


			// position the drop marker
		    var designerBounds = dojo.coords(studio.designer.domNode);
		    kit._setMarginBox(this.markNode, r.l + this.targetOff.x, r.t + this.targetOff.y, 
				      Math.min(r.w, designerBounds.x+designerBounds.w - r.l-this.targetOff.x),
				      Math.min(r.h, designerBounds.y+designerBounds.h - r.t - this.targetOff.y));
			// position the snap markers
			wm.showHideNode(this.hSnapNode, Boolean(r.hSnap));
			if (r.hSnap) {
				r.hSnap.l += this.targetOff.x;
				r.hSnap.t += this.targetOff.y;
				kit.marginBox(this.hSnapNode, r.hSnap);
			}
			wm.showHideNode(this.vSnapNode, Boolean(r.vSnap));
			if (r.vSnap) {
				r.vSnap.l += this.targetOff.x;
				r.vSnap.t += this.targetOff.y;
				kit.marginBox(this.vSnapNode, r.vSnap);
			}
			// cache drop position
			this.dropRect = r;
		} 

	},
	drop: function(e) {
		if (this.target && this.target.layout.removeEdges)
			this.target.layout.removeEdges(this.target);
		this.inherited(arguments);
	    for (var i = 0; i < this.domNodes.length; i++)
		if (this.domNodes[i].parentNode)
		    this.domNodes[i].parentNode.removeChild(this.domNodes[i]);
	},
	setTarget: function(inTarget){
		if (this.target && this.target.layout.removeEdges)
			this.target.layout.removeEdges(this.target);
		this.target = inTarget;
		if (this.target) {
			this.setCursor("default");
			this.targetNode = this.target.containerNode || this.target.domNode;
			this.targetOff = wm.calcOffset(this.targetNode, this.scrimNode, true);
		} else {
			this.setCursor("no-drop");
			this.targetNode = null;
			this.targetOff = null;
		}
		if (this.target && this.target.layout.renderEdges)
			this.target.layout.renderEdges(this.target, this.info.control);
		this.updateAvatar();
	},
	updateAvatar: function() {
		this.showHideAvatar(true);
		var contentNode = this.info.obj ? this.info.obj.contentNode : '' ;
		var contentHTML = contentNode != '' ? '<span>' + contentNode.innerHTML + '</span>' : this.info.caption;
		if (this.target) 
		{
			var dn = this.designable ? this.target.name : this.root.owner.type;
			this.setAvatarContent(contentHTML + " -> <b>" + dn + "</b>");
		}
		else
		{
			this.setAvatarContent(contentHTML);
		}
	},
	findTarget: function(inHit) {
	    var t;
	    var d = this.getDesignableDialog();
	    if (d) {
		if (this.targetInDialog(inHit, d)) {
		    inHit.l -= d.bounds.l;
		    inHit.t -= d.bounds.t;
		    t = (this.designable ? this._findTarget(inHit, d, 0) : d.containerWidget);
		}
	    } else if (this.targetInRoot(inHit)) {
		t = (this.designable ? this._findTarget(inHit, this.root, 0) : this.root);
	    } 
	    if (!t)
		kit._setMarginBox(this.markNode, 0, 0, 0, 0);
	    if (t != this.target) {
		this.setTarget(t);
	    }
	},
	_findTarget: function(inHit, inWidget, inMargin) {
/* This is a very useful debugging section; do not delete!
	    var node = this.getDomNode(inMargin);
	    console.log("Place " + node.id + "|" + inMargin);
	    if (node.parentNode) node.parentNode.removeChild(node);
	    inWidget.domNode.appendChild(node);
	    node.style.left = inHit.l + "px";
	    node.style.top = inHit.t + "px";
	    node.innerHTML = inMargin + ": " + inWidget.toString();
            //console.log("_findTarget: " + inWidget.toString());
	    */
		var h = inHit, dn = inWidget.domNode, w, b, o;
		var sl = dn.scrollLeft, st = dn.scrollTop;
		var ws = inWidget.widgets;
		var m = inMargin || 0;
		for (var i in ws) {
			w = ws[i];
                    //console.log("_test: " + w.toString());

			if (w != this.info.control && w.container && !w.getLock()) {
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
				    h.l -= b.l + w.marginExtents.l + w.borderExtents.l; 
				    h.t -= b.t + w.marginExtents.t + w.borderExtents.t;
				    var result = this._findTarget(h, w, m+1);//(w.marginExtents.l && w.marginExtents.t && w.marginExtents.r && w.marginExtents.b) ? m : m+1);
                                    //console.log("RESULT " + w.toString() + ": " + result);
                                    return result;
				}
			}
		}
		// FIXME: sort out _noCreate
		var t = inWidget._noCreate ? inWidget.parent : inWidget;
            //console.log("CANBETARGET " + t.toString() + ": " + this.canBeTarget(t));
		return this.canBeTarget(t) ? t : null;
	},
	canBeTarget: function(inWidget) {
		var parentOK = true;
		if (this.info.parentForm){
			var targetParentForm = inWidget instanceof wm.LiveFormBase ? inWidget : wm.getParentForm(inWidget);
	    if (!targetParentForm || targetParentForm.getId() != this.info.parentForm.getId()){
        parentOK = false;
			}
		}
		
		return parentOK && inWidget.container && !inWidget.flags.notInspectable && !inWidget.getFreeze();
	},
	targetInRoot: function(inHit) {
		var h = inHit, b = kit._getMarginBox(this.root.domNode);
		return !(h.l < 0 || h.t < 0 || h.l > b.w || h.t > b.h);
	},
    targetInDialog: function(inHit, inDialog) {
	var h = inHit;
        var b = {l: inDialog.bounds.l + inDialog.containerWidget.bounds.l,
                 t: inDialog.bounds.t + inDialog.containerWidget.bounds.t,
                 h: inDialog.containerWidget.bounds.h + ((inDialog.buttonBar) ? inDialog.buttonBar.bounds.h : 0),
                 w: inDialog.containerWidget.bounds.w};

        return (h.l > b.l && h.l < b.l+b.w &&
                h.t > b.t && h.t < b.t+b.h);
	},
    isDesignableDialogShowing: function() {
	return Boolean(this.getDesignableDialog());
    },
	getDesignableDialog: function() {
	    for (var i = wm.dialog.showingList.length-1; i >= 0; i--) {
		var d = wm.dialog.showingList[i];
		if ((d.owner == studio.wip || d.owner == studio.application) && d instanceof wm.DesignableDialog)
		    return d;
	    }
	    return;
	},
	isDesignable: function() {
		var c = this.info.control || (dojo.getObject(this.info.type)).prototype;
		return c instanceof wm.Control;
	}
});

/**
	@class
	@name wm.LayoutResizer
	@inherits wm.DragDropper
*/
dojo.declare("wm.design.Resizer", wm.DragDropper, {
	snapMask: 3,
	constructor: function() {
		this.info = {};
	},
	beginDrag: function(inEvent, inInfo) {
		this.info = inInfo || this.info;
		this.info.caption = this.info.control.name;
		this.info.node = this.info.control.domNode;
		this.info.rect = dojo.marginBox(this.info.node);
		this.target = this.info.control.parent;
		this.mousedown(inEvent);
	},
	updateAvatar: function() {
		this.setAvatarContent("<b>" + this.info.caption + "</b>: " + this.dropRect.w + ", " + this.dropRect.h);
	},
	start: function(e) {
		this.inherited(arguments);
		this.setCursor(this.info.cursor);
		if (this.target && this.target.layout && this.target.layout.renderEdges)
			this.target.layout.renderEdges(this.target, this.info.control);
	},
	finish: function() {
		this.inherited(arguments);
		if (this.target && this.target.layout && this.target.layout.removeEdges)
			this.target.layout.removeEdges(this.target);
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
		//	this.applySnap(this.dropRect);
		//}
		dojo.mixin(this.dropRect, this.info);
		this.target.suggestSize(this.info.control, this.dropRect);
		with (this.dropRect) {
			w = Math.max(1, w);
			h = Math.max(1, h);
		}
		this.info.control.resizeUpdate(this.dropRect);
		this.updateAvatar();
	}
});