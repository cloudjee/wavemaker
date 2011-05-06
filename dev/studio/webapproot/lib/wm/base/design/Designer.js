/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.design.Designer");

//wm.design.mover.prototype.hintMsg = "Hold <b>Ctrl</b> to keep original container";
//wm.design.sizer.prototype.hintMsg = "Hold <b>Shift</b> to defeat snap";

// FIXME: drag tools and Designer code are improperly factored

dojo.declare("wm.Designer", wm.Surface, {
	selected: null,
	//tlb: wm.layout.box,
	box: "v",
	init: function() {
		this.inherited(arguments);
		if (this.isDesignLoaded()) {
			this.flow = function() {};
			return;
		}
		// FIXME: no bueno on Safari, can't focus a DIV
		this.domNode.setAttribute('tabindex', -1);
		// mousedown on the surface clears selection
		this.connectEvents(this.domNode, ["mousedown"]);
	},
	// events
	onselect: function(inControl) { 
	},
	ondelete: function(inControl) {
	},
	onmove: function(inControl) {
	},
	//
	keypress: function(e) {
	},
	mousedown: function(e) {
		if (e.target == this.domNode)
			this.select(null);
	},
	showHideHandles: function(inShowHide) {
		var s=this.selected;
		if (s && !s.isDestroyed)
			s.designWrapper.showHideHandles(inShowHide);
	},
	/*
	place: function(inControl, inTarget, inDropRect) {
		var 
			dr = inDropRect,
			c = inControl, w = c.designWrapper,
			t = inTarget, tn = t.containerNode || t.domNode;
		// alias layout engine
		//var tlb = wm.layout.box;
		// cache scrolling information for target before modifying nodes
		//tlb.cacheNodeScroll(tn);
		// prevent reflows for now
		//t.beginUpdate();
		// hide wrapper handles
		w.showHideHandles(false);
		// move control to target
		//tn.appendChild(c.domNode);
		// reparent the design wrapper
		//w.setDesignNode(c.domNode);
		// restore wrapper handles (?)
		w.showHideHandles(true);
		// set wrapper bounds (can trigger a reflow due to: setBounds -> autoSize -> setSize/Units)
		// FIXME: it's possible this node was never part of a reflow and has no position
		//c.domNode.style.position = 'absolute';
		w.setBounds(dr);
		// repair layout
		// position trumps DOM order for this work
		//tlb.rearrange(tn);
		// allow reflows
		//t.endUpdate();
		// force a reflow
		//tlb.reflow(tn);
		// if parent has changed
		if (t != c.parent) {
			// reflow original parent
			if (c.parent) 
				c.parent.reflow();
			// reparent control
			c.setParent(t);
		}
	},
	*/
    // called by redo I believe...
	replace: function(inControl, inTarget, inBounds, inNextSibling) {
		var c = inControl, t = inTarget, w = c.designWrapper;
		// hide wrapper handles
		w.showHideHandles(false);
		// move control to target 
		var i = inNextSibling ? t.indexOfControl(inNextSibling) : t.c$.length;
		t.designMoveControl(c, {i: i});
		// reassign control to wrapper
		w.setDesignNode(c.domNode);
		// restore wrapper handles (?)
		w.showHideHandles(true);
		// set bounds
		c.designResize(inBounds);
	},
	/*
	dragStart: function(inDragger, inEvent) {
		// provide some usage hint
		studio.setStatusMsg(inDragger.hintMsg || "");
		// convenient aliases
		var d = inDragger, w = d.client, c = w.control;
		// cache original values
		d.originalTarget = d.target = c.parent;
		d.originalRect = dojo.marginBox(d.domNode);
		// FIXME: c.domNode vs d.domNode?
		d.originalSibling = this._findNextLayoutSibling(d.domNode); // (c.domNode);
		// select the source wrapper
		w.select();
		// employ scrim to optimize mouse response
		this.scrimNode.style.display = "block";
		// adjust cursor
		this.scrimNode.style.cursor = d.getCursor();
		// prepare source hint
		d.domNode.parentNode.appendChild(this.sourceNode);
		dojo.marginBox(this.sourceNode, d.originalRect);
		this.sourceNode.style.display = "block";
		// prepare drag hints
		this.showHints = this.canShowHint(d);
		if (this.showHints) {
			this.avatarNode.innerHTML = c.name + " on " + d.target.name;
			this.avatarNode.style.display = "block";
			this.markNode.style.display = "block";
		}
		// establish target
		d.targetNode = d.target.containerNode || d.target.domNode;
		// set origin of startRect to topNode
		var o = wm.calcOffset(d.targetNode.parentNode, this.topNode);
		with (d.startRect) {
			l += o.x;
			t += o.y;
		}
		// need to layout by position when moving
		wm.layout.box.sorting = d instanceof wm.design.mover;
	},
	drag: function(inDragger, inEvent) {
		// convenient aliasing
		var d = inDragger;
		// target location
		if (d instanceof wm.design.mover) {
			var t = inEvent.ctrlKey ? d.originalTarget : this.findTarget(d, inEvent);
			if (t != d.target && !t.getFreeze()) {
				this.changeDropTarget(d, t);
			}
		}
		// find drop rect in target frame
		var dropRect = this.calcDropRect(d);
		// immediate feedback when sizing
		if (d instanceof wm.design.sizer) {
			dojo.marginBox(this.sourceNode, dropRect);
		}
		if (this.showHints) {
			// find the target rect
			dropRect.w = dropRect.h = 0;
			// find offset from target frame to avatar frame
			var o = wm.calcOffset(d.targetNode, this.topNode);
			// update the avatar position
			dojo._setMarginBox(this.avatarNode, dropRect.l + o.x + 16, dropRect.t + o.y + 16);
			// calculate suggested drop rect
			wm.layout.box.suggest(d.targetNode, dropRect);
			dojo._setMarginBox(this.markNode, dropRect.l + o.x, dropRect.t + o.y, dropRect.w, dropRect.h);
			// clone box from dragger node to source node
			//dojo.marginBox(this.sourceNode, dojo.marginBox(d.domNode));
		}
		// fire event
		this.ondrag(d);
	},
	drop: function(inDragger) {
		// no longer need sorting layout
		wm.layout.box.sorting = false;
		// convenient alias
		var d = inDragger;
		// cleanup hints
		this.sourceNode.style.display = "none";
		if (this.showHints) {
			this.avatarNode.style.display = "none";
			this.markNode.style.display = "none";
		}
		// hide utility nodes
		this.scrimNode.style.display = "none";
		// clear usage hints
		studio.setStatusMsg("");
		// find drop rect
		d.dropRect = this.calcDropRect(d);
		wm.layout.box.suggest(d.targetNode, d.dropRect);
		// place our control
		this.place(d.client.control, d.target, d.dropRect);
		// calculate new natural size on resize
		if (d instanceof wm.design.sizer)
			d.client.control.sizeFromNode();
		// fire event
		this.ondrop(d);
	},
	// only show hint if moving and control is moveable
	canShowHint: function(inDragger) {
		return (inDragger instanceof wm.design.mover) && (inDragger.client.control.isMoveable() !== false);
	},
	_findNextLayoutSibling: function(inNode) {
		var n = inNode.nextSibling;
		while (n && !wm.inLayout(n)) {
			n = n.nextSibling;
		}
		return n;
	},
	calcDropRect: function(inDragger, inTarget) {
		var d = inDragger, dr = d.dragRect;
		var t = inTarget || d.target;
		// when moving, reset origin to mouse position
		var p = (d instanceof wm.design.mover) ? { l : d.clientX - 2, t: d.clientY - 2} : { l: dr.l, t: dr.t };
		// adjust position to target frame
		var o = wm.calcOffset(t.domNode, this.topNode);
		var r = { l: p.l-o.x, t: p.t-o.y, w: dr.w, h: dr.h };
		//console.log(o, r, t);
		// resize heuristic for change in orientation
		if (inDragger.originalTarget.box != t.box) {
			if (inDragger.client.control.autoSize) {
				r.w = r.h = 32;
			} else {
				r.w = 96;
				r.h = 64;
			}
		}
		return r;
	},
	_findTarget: function(inControl, inHit, inWidget) {
		var h = inHit, ws = inWidget.widgets, dn = inWidget.domNode, w, b, o;
		var sl = dn.scrollLeft, st = dn.scrollTop;
		for (var i in ws) {
			w = ws[i];
			if (w.container && w != inControl) {
				b = dojo._getMarginBox(w.domNode);
				if (w.domNode.parentNode != inWidget.domNode){
					// change reference frame of target rect to hit frame
					o = wm.calcOffset(w.domNode.parentNode, inWidget.domNode);
					b.l += o.x; b.t += o.y;
				} else {
					b.l -= sl; b.t -= st;
				}
				// must be well inside
				b.r = b.l + b.w; b.b = b.t + b.h;
				if (h.x-b.l>3 && b.r-h.x>3 && h.y-b.t>3 && b.b-h.y>3) {
				//if (h.x >= b.l && h.y >= b.t && h.x < b.r && h.y < b.b) {
					h.x -= b.l, h.y -= b.t;
					return this._findTarget(inControl, h, w);
				}
			}
		}
		return inWidget._noCreate ? inWidget.parent : inWidget;
	},
	findTarget: function(inDragger, inEvent) {
		// FIXME: root hack
		var root = studio.page.root;
		var o = wm.calcOffset(root.domNode.parentNode, this.topNode);
		var hit = { x: inEvent.clientX - o.x, y: inEvent.clientY - o.y };
		return this._findTarget(inDragger.client.control, hit, root);
	},
	changeDropTarget: function(d, t) {
		if (t) {
			d.targetNode = t.containerNode || t.domNode;
			this.avatarNode.innerHTML = d.client.control.name + (t.name ? " on " + t.name : "");
		}
		d.target = t;
	},
	*/
	select: function(inControl) {
	        if (inControl && !inControl.designWrapper || this._selecting) return;
                try {
                    this._selecting = true;
		    if (this.selected) 
			this.selected.designWrapper.ondeselected();
		    this.selected = inControl;
		    if (this.selected)
			this.selected.designWrapper.onselected();
		    this.onselect(inControl);
		    // FIXME: no bueno on Safari, can't focus a DIV
		    // FIXME: do we intend to focus on select()? why not only on mousedown or click events?
		    try{this.domNode.focus();}catch(e){};
                } finally {
                    this._selecting = false;
                }
	},
	selectParent: function(inControl) {
		var p = inControl || this.selected;
		p = p&&p.parent;
	    if (p) {
                    if (p.designWrapper) {
			this.select(p);
                    } else {
                        this.selectParent(p);
                    }
	    } else if (studio.page.root) {
		this.select(studio.page.root);
	    }
	},
	_deleted: function(inControl) {
		// FIXME: name bad, called from Wrapper on destroy
		/*
		if (inControl == this.selected) {
			this.select(null);
			var p = inControl.parent;
			if (p && p.designWrapper)
				this.select(p);
		}
		*/
	},
	/*
	deleteComponent: function(inComponent) {
		if (inComponent) {
			this.ondelete(inComponent);
			inComponent.destroy();
		}
	},
	deleteSelected: function() {
		this.deleteComponent(this.selected);
	},
	*/
	reflow: function() {
		this._boundsDirty = true;
		this.flow();
	},
	flow: function() {
		if (this._boundsDirty) {
			wm.fire(studio.wip, "reflow");
			this._boundsDirty = false;
		}
	},
	designMove: function(inControl, inDropInfo) {
		inControl.designMove(inDropInfo.target, inDropInfo);
		this.onmove(inControl);
	}
});