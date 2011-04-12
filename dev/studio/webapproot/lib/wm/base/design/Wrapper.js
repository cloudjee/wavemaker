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
dojo.provide("wm.base.design.Wrapper");

dojo.declare("wm.DomBorder", null, {
	classNames: "",
	size: 4,
	constructor: function(inClassNames) {
		this.classNames = inClassNames || "";
		this.make();
	},
	make: function() {
		this.handles = [];
		for (var i=0, s, ss=['top', 'right', 'bottom', 'left']; s=ss[i]; i++)
			this.handles[i] = this.makeHandle(s);
	},
	makeHandle: function(inSide) {
		var d = document.createElement('div');
	        this.domNode = d;
		d.className = 'wmdesign-handle wmdesign-handle-' + inSide + " " + this.classNames;
		// style.zIndex > 1 takes us out of layout calculations (must be style, not computedStyle)
		d.style.zIndex = 20;
		return d;
	},
	setBounds: function(inBox) { 
		var hs = this.handles, bx=dojo._setBox, sz=this.size;
		with(inBox){
			bx(hs[0], l, t, w, sz);
			bx(hs[1], l+w-sz, t, sz, h);
			bx(hs[2], l, t+h-sz, w, sz);
			bx(hs[3], l, t, sz, h);
		}
	},
	setParentNode: function(inNode) {
		for (var i=0, h; h=this.handles[i]; i++)
			inNode.appendChild(h);
	},
	showHide: function(inShow) {
		for (var i=0, h; h=this.handles[i]; i++)
			wm.showHideNode(h, inShow);
	}, 
        destroy: function() {
		for (var i=0, h; h=this.handles[i]; i++)
		    dojo.destroy(h);
	}
});

dojo.declare("wm.DesignHandles", wm.DomBorder, {
	constructor: function() {
		this.connect();
	},
	connect: function() { // safari
		this.click = this.mousedown = this.mousemove = this.mouseevent;
		var c = [];
		for (var i=0, h; h=this.handles[i]; i++) {
			//c = c.concat(wm.connectEvents(this, h, ["click", "mousedown", "mousemove"]));
			c = c.concat(wm.connectEvents(this, h, ["mousedown", "mousemove"]));
		}
		this.connects = c;
	},
	mouseevent: function(e) {
		wm.fire(this.parent, e.type, [e]);
	},
	showHide: function(inShow, inParent) {
            if (!inParent.domNode) return;
	    var h;
	    var parentNode = inParent.domNode.parentNode;
	    if (!parentNode) return;
	    var parentObj  = this.parent;
	    var same=!!(parentObj && parentObj.domNode && (parentNode==parentObj.domNode.parentNode));

		this.parent = (inShow ? inParent : null);
		if (inShow != same) {
			for (var i=0, h; h=this.handles[i]; i++)
			    try {
				if (inShow) {
				    if (h.parentNode != parentNode)
					parentNode.appendChild(h);
				} else {
				    if (h.parentNode == parentNode)
					parentNode.removeChild(h);
				}
			    } catch(e) {
			    	djConfig.isDebug && console.info('Error while deleting node: ' + e);
			    }
		}
	}
});

dojo.declare("wm.WrapperMover", wm.design.Mover, {
	beginDrag: function(e, inWrapper) {
		this.wrapper = inWrapper;
		this.inherited(arguments, [e, {
			control: this.wrapper.control, 
			caption: this.wrapper.control.name
		}]);
	},
	ondrop: function(e) {
		var i = this.dropRect;
	        if (!i) return; // there's no i if we call this after a right click instead of after a move
		i.target = this.target;
		new wm.DropTask(this.wrapper.control);
		this.wrapper.designMove(i);
		//with (this.dropRect) {
		//	var dropInfo = {l: t, t: t, i: i, target: this.target};
		//}
		//this.wrapper.designMove(dropInfo);
		//this.wrapper.control.designMove(this.target, this.dropRect);
	}
});

// singleton
wm.wrapperMover = new wm.WrapperMover();

dojo.declare("wm.WrapperResizer", wm.design.Resizer, {
	beginDrag: function(e, inWrapper) {
		this.wrapper = inWrapper;
		this.inherited(arguments, [e, {
			control: this.wrapper.control, 
			handleId: this.wrapper.getHitHandle(e),
			cursor: this.wrapper.getCursor()
		}]);
	},
	ondrop: function() {
		this.info.control.designResize(this.dropRect);
	}
});

// singleton
wm.wrapperResizer = new wm.WrapperResizer();

dojo.declare("wm.DesignWrapper", wm.Designable, {
	//buffer: 6,
	border: 0,
        borderColor: "#F0F0F0",
	handles: null,
	surface: null,
	init: function() {
		this.designConnects = [];
		this.makeLabel();
		this.makeHandles();
		//this.makeMarker();
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmdesign-wrapper");
		this.domNode.style.cssText = "z-index: 10; visibility: hidden;";
		this.setControl(this.control);
	    dojo.connect(this.control.scrim ? this.domNode : this.control.domNode, "oncontextmenu", this.control, function(event) {
		    this.showContextMenu(event);
	    });
	    if (dojo.isFF) { // FF 3.6/4.0 on OSX require this, others may as well
		dojo.connect(this.control.scrim ? this.domNode : this.control.domNode, "onmousedown", this.control, function(event) {
		    if (event.button == 2 || event.ctrlKey)
			this.showContextMenu(event);
		});
	    }

	},

	destroy: function() {
		this.surface._deleted(this.control);
		this.disconnect();
		this.inherited(arguments);
	},
	// make label nodes
	makeLabel: function() {
		var l = document.createElement("div");
		l.className = "wmdesign-label";
		l.innerHTML = '<img class="wmdesign-label-corner" /><div>control</div>';
		this.domNode.appendChild(l);
		this.label = l.childNodes[1];
	},
	// make marker nodes
	makeMarker: function() {
		this.marker = new wm.DomBorder("wmdesign-marker");
		this.marker.size = 0;
		this.marker.setParentNode(this.domNode);
	},
	// make or acquire handles object
	makeHandles: function() {
		this.handles = this.surface.handles || (this.surface.handles = new wm.DesignHandles());
	},
	// attach to this control
	setControl: function(inControl) {
		var 
			c = this.control = inControl, 
			n = this.designNode = c && c.domNode;
		if (c) {
			c.designWrapper = this;
		        this.domNode.style.backgroundColor = 'transparent';
			if (c.scrim)
				this.setScrim(c.scrim);
		        this.label.innerHTML = c.getId();
			this.owner = c.owner;
			this.setShowing(inControl.showing);
		}
		if (n)
			this.setDesignNode(n);
	},
	setShowing: function(inShowing) {
		if (inShowing != this.showing)
			this.showHideHandles(inShowing)
		this.inherited(arguments);

	},
	// undo connections to our control
	disconnect: function() {
		dojo.forEach(this.designConnects, dojo.disconnect);
		this.designConnects = [];
	},
	// make connections to our control
	connect: function(n) {
		var d = this.designConnects = wm.connectEvents(this, n, ["click", "mousedown", "mousemove"]);
		d.push(
			dojo.connect(n, "onboundschange", this, "controlBoundsChange", true),
			dojo.connect(this.control, "setName", this, "controlNameChanged")
		);
	},
	controlNameChanged: function() {
	    this.label.innerHTML = this.control.getId()
	},
	controlParentChanged: function() {
		this.setDesignNode(this.control.domNode);
		if (this.handles.parent == this)
			this.handles.setParentNode(this.domNode.parentNode);
	},
	setScrim: function(inScrim) {
		this.domNode.style.visibility = (inScrim ? 'visible' : 'hidden');
	},
	setDesignNode: function(inNode) {
		this.disconnect();
		this.designNode = inNode;
		// it's cleaner to put the designer chrome into surface
		//this.surface.domNode.appendChild(this.domNode);
		// but this way we get free clipping
		inNode.parentNode.appendChild(this.domNode);
		this.connect(inNode);
	},
	setBounds: function(inBox) {
		return;
	},
	setControlBounds: function(inBox) {
		this.control.setBounds(inBox);
		this.control.renderBounds();
		this.controlBoundsChange();
	},
	controlBoundsChange: function() {
		this._setBounds(this.control.bounds);
		//if (this.designNode)
		//	this._setBounds(dojo._getMarginBox(this.designNode));
	},
	_setBounds: function(inBox) {
		//var o = wm.calcOffset(this.designNode.parentNode, this.surface.domNode);
		var o = {x:0, y:0};
		var b = {l: inBox.l + o.x, t: inBox.t + o.y, w: inBox.w, h: inBox.h};
		wm.Bounds.prototype.setBounds.call(this, b.l, b.t, b.w, b.h);
		//this.setBounds(b);
		this.renderBounds();
		//dojo.marginBox(this.domNode, b);
		if (this.handles.parent == this) 
			this.handles.setBounds(b);
		// FIXME: hacky
		// hides only the label, leaving the slant
	    this.label.innerHTML = (b.h > 22 && b.w > 64) ? this.control.getId() : ".";
	    //this.label.parentNode.style.display = (b.h > 22 && b.w > 64) ? '' : 'none';
		//this.label.style.width = b.w > 200 ? 64 + (b.w / 4) + "px" : "";
	    wm.onidle(this, "setLabelPosition");
		b.l = b.t = 0;
		//this.marker.setBounds(b);
	},
    setLabelPosition: function() {
	if (this.isDestroyed) return;
	    if (studio.selected == this.control) {
		this.label.parentNode.style.right = 
		    this.label.parentNode.style.top = "0px";
	    } else {
		this.label.parentNode.style.right = (this.control.marginExtents.r-2) + "px";
		this.label.parentNode.style.top   = this.control.marginExtents.t + "px";
	    }
    },
	canSize: function(box, next) { 
	    if (!this.control.canResize(box))
			return false;
		return true;
		//
		var n = this.designNode;
		var ok = true;
		while (n=n[next]) {
			if (n.flex > 0)
				return true;
			else if (ok && n.style && !n.style.visibility && !n.style.display)
				ok = false;
		}
		return ok || (next=='nextSibling');
	},
	getHitHandle: function(e) {
		var dh = wm.design.handles, m = 4;
		// allow control to determine if it's moveable.
		var result = this.control.isMoveable() === false ? dh.none : dh.client;
		// for very small controls we cannot differentiate operations well,
		// so we prioritize moving
		if (result == dh.client) {
			var d = this.control.domNode, n = m*3;
			if (d.offsetHeight<n || d.offsetWidth<n)
				return result;
		}
		/*if (!this.control.isSizeable()){
			var d = this.control.domNode, n = m*3;
			if (d.offsetHeight<n || d.offsetWidth<n)
				return result;
		}*/
		var w = e.target.offsetWidth-m, h = e.target.offsetHeight-m, ps="previousSibling", ns="nextSibling", hs=this.handles.handles;
		if (e.target == hs[0]) {
			if (!this.canSize('h', ps) || !this.canSize('flow')) return dh.not;
			return (e.layerX < m ? dh.leftTop : (e.layerX > w ? dh.rightTop : dh.middleTop));
		}
		if (e.target == hs[1]) {
			if (!this.canSize('v', ns)) return dh.not;
			return (e.layerY < m ? dh.rightTop : (e.layerY > h ? dh.rightBottom : dh.rightMiddle));
		}
		if (e.target == hs[2]) {
			if (!this.canSize('h', ns)) return dh.not;
			return (e.layerX < m ? dh.leftBottom : (e.layerX > w ? dh.rightBottom : dh.middleBottom));
		}
		if (e.target == hs[3]) {
			if (!this.canSize('v', ps) || !this.canSize('flow')) return dh.not;
			return (e.layerY < m ? dh.leftTop : (e.layerY > h ? dh.leftBottom : dh.leftMiddle));
		}
		return result;
	},
	showHideHandles: function(inShow) {
		// prevent showing handles if control is not showing
		if (!this.control.showing && inShow)
			return;
		this.handles.showHide(inShow, this);
		if (inShow) 
			this.controlBoundsChange();
	},
	select: function(){
		var c = this.control;
		while (c && c.isParentLocked())
			c = c.parent;
		this.surface.select(c);
	},
	_selected: function(inSelected){
	        if (!this.domNode || !this.control.domNode) return;
	        this.showHideHandles(inSelected);
            var zIndex = parseInt(this.control.domNode.style.zIndex);
            if (zIndex > 10 && inSelected) {
                this.domNode.style.zIndex= zIndex + 1;
            } else {
	        this.domNode.style.zIndex = inSelected ? 11 : 10;
            }
		wm.addRemoveClass(this.domNode, "wmdesign-wrapper-selected", inSelected);
	},
	onselected: function(){
		this._selected(true);
	    wm.onidle(this, function() {
		this.control.getDesignBorder();
		this.control.invalidCss = true;
		this.control.render();
		this.setLabelPosition();
	    });
		
	},
	ondeselected: function(){
		this._selected(false);
	    wm.onidle(this, function() {
                if (this.control.isDestroyed) return;
		this.control.getDesignBorder();
		this.control.invalidCss = true;
		this.control.render();
		this.setLabelPosition();
	    });
	},
	getId: function() {
		// we don't want id's for wrappers so they don't pollute widget registry
		return "";
	},
	mousedown: function(e) {
		if (wm.inScrollbar(e)) {
			this.click(e);
			dojo.stopEvent(e);
			return;
		}
		this.selectDragMode(e);
		switch (this.dragMode) {
			case wm.design.drags.move:
				wm.wrapperMover.beginDrag(e, this);
				break;
			case wm.design.drags.resize:
				wm.wrapperResizer.beginDrag(e, this);
				break;
		}
	},
	click: function(e) {
		dojo.stopEvent(e);
		this.select();
		//wm.fire(this.control, "click", e);
	},
	designMove: function(inDropInfo) {
		this.surface.designMove(this.control, inDropInfo);
	},
    destroy: function() {
	this.handles.destroy();
	this.inherited(arguments);
    },
    showContextMenu: function(e) {
	this.control.showContextMenu(e);
    }
});

dojo.declare("wm.ComponentWrapper", null, {
	setDesignNode: function() {
	},
	showHideHandles: function() {
	},
	select: function(){
	},
	onselected: function(){
	},
	ondeselected: function(){
	}
});
