/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Popup");
dojo.require("wm.base.widget.Panel");

// positioning utility
wm.positionAroundNode = function(inPositionNode, inPositionLocation, inWidth, inHeight) {
	var
		d = dojo.byId(inPositionNode),
		location = inPositionLocation ||"",
		w = d.offsetWidth,
		h = d.offsetHeight,
		tw = inWidth,
		th = inHeight,
		o = wm.calcOffset(d, document.body);
	// argh, adjust for button borders if we're showing this around a button.
	if (d.tagName == "BUTTON" && dojo.isMoz) {
		var be = dojo._getBorderExtents(d)
		o.x -= be.l;
		o.y -= be.t;
	}

	// MK: OK, so it looks like the parameters are (these are bad guesses; please correct them):
	// first character: position outside of the specified dom node (below it for example)
	// second character: position within the specified dom node (at the bottom of it for example)
	switch (location.charAt(0)) {
		case "t":
			o.y -= th;
			break;
		case "b":
			o.y += h;
			break;
		case "l":
			o.x -= tw;
			break;
		case "r":
			o.x += w;
	}
	switch (location.charAt(1)) {
		case "t":
			o.y += h - th;
			break;
		case "b":
			break;
		case "l":
			o.x += w - tw;
			break;
		case "r":
			break;
	}
	return o;
}

//===========================================================================
// Simple stackable popup / can be positioned around node
//===========================================================================
// note, may want to combine with wm.Dialog
dojo.declare("wm.Popup", wm.Panel,{
	box: "v",
	scrimBackground: false,
	hideOnClick: true,
	positionNode: null,
	positionLocation: "",
	left: 0,
	top: 0,
	contentWidth: 400,
	contentHeight: 300,
	showing: false,
	prepare: function(inProps) {
		this.inherited(arguments);
		// bc
		this.fitToContent = this.autoHeight;
	},
	init: function() {
		this.inherited(arguments);
		document.body.appendChild(this.domNode);
		dojo.addClass(this.domNode, "wmpopup");
		this.domNode.style.position = "absolute";
		this.domNode.style.zIndex = 50;
		this.setContentWidth(this.contentWidth);
		this.setContentHeight(this.contentHeight);
		this.connect(document, "onkeypress", this, "keyPress");
		this.connect(this.domNode, "onclick", this, "onClick");
		dojo.subscribe("window-resize", this, "reflow");
	},
	reflowParent: function() {
	},
	flow: function() {
		if (this.showing && !this._cupdating) {
			this.inherited(arguments);
			// self-render on flow
			this.doPositionAroundNode();
			this.render();
		}
	},
	render: function() {
		if (this.showing) {
			this.inherited(arguments);
			wm.bgIframe.size();
		}
	},
	setContentWidth: function(inWidth) {
		this.contentWidth = inWidth;
		this.setWidth(inWidth + "px");
	},
	setContentHeight: function(inHeight) {
		this.contentHeight = inHeight;
		this.setHeight(inHeight + "px");
	},
	setContentSize: function(inWidth, inHeight) {
		this.setContentWidth(inWidth);
		this.setContentHeight(inHeight);
	},
	setPositionLeft: function(inLeft) {
		this.left = inLeft + "px";
		this.setBounds(inLeft, NaN);
	},
	setPositionTop: function(inTop) {
		this.setBounds(NaN, inTop);
		this.top = inTop + "px";
	},
	setPosition: function(inLeft, inTop) {
		this.setPositionLeft(inLeft);
		this.setPositionTop(inTop);
	},
	doPositionAroundNode: function() {
		if (!this.positionNode)
			return;
		var
			b = this.getBounds(),
			o = wm.positionAroundNode(this.positionNode, this.positionLocation, b.w, b.h);
		this.setPosition(o.x, o.y);
	},
	keyPress: function(inEvent) {
	      if (inEvent.keyCode == dojo.keys.ESCAPE) {
			this.hide();
	      }
	},
	eventHide: function() {
		if (this.closeAll)
			wm.Popup.closeAll();
		else
			this.hide();
	},
	delayedHide: function(inDelay) {
		this._hidePending = setTimeout(dojo.hitch(this, "hide"), inDelay);
	},
	cancelHide: function() {
		if (this._hidePending) {
			clearTimeout(this._hidePending);
			this._hidePending = null;
		}
	},
        setShowing: function(inShowing, forceChange) {
	    wm.dialog.showing = Math.max(0,wm.dialog.showing + ((inShowing) ? 1 : -1));
		// avoid dealing with manager if loading
		if (this._loading)
			this.inherited(arguments);
		else if (forceChange || inShowing != this.showing)
			this[inShowing ? "_popOnIdle" : "_unpop"]();
	},
	_superSetShowing: function(inShowing) {
		wm.Panel.prototype.setShowing.call(this, inShowing);
	},
	_popOnIdle: function() {
		wm.onidle(this, "_pop");
	},
	_pop: function() {
		this.cancelHide();
		// place in flow
		this.showing = true;
		this.reflow();
		// after all sizing, actually show node
		this.domNode.style.display = 'block';
		wm.Popup.addPopup(this);
		this.onShow();
	},
	mouseup: function(e) {
	  var tmp = e.target;
	  if (!tmp || tmp == null)
		  return;
	  
	  while (tmp != this.domNode && tmp != dojo.body()) tmp = tmp.parentNode;
	  if (tmp != this.domNode)
	       wm.Popup.closeEvent(e);
	},
	_unpop: function() {
		// if closing and we are not the top popup
		// close from the top down to this one
		var top = wm.Popup.getTop();
		if (top && top != this)
			wm.Popup.closePopup(this);
		else {
			this.showing = false;
			this.domNode.style.display = 'none';
			wm.Popup.removePopup();
			this.onHide();
		}
	},
	onClick: function(e) {
		e._popup = true;
	},
	onShow: function() {
	},
	onHide: function() {
	}
});

dojo.declare("wm.PopupCapture", wm.Capture, {
	constructor: function() {
		this.setEvents("mousedown", "mousemove", "mouseover", "mouseout", "mouseup");
		// route all events through processCapture
		for (var i in this.events)
			this[i] = this.processCapture;
	},
	processCapture: function(e) {
		var c = wm.Popup.captured;
		if (c) {
			// if we're moving over a node not in our active popup, try to find a new popup
			if (e.type == "mousemove" && !dojo.isDescendant(e.target, c.domNode)) {
				var n = wm.Popup.findPopupForNode(e.target);
				if (n) {
					wm.Popup.doCapture(n);
					return;
				}
			// try to call the captured event in the captured popup
			} else if (c[e.type])
				c[e.type].call(c, e);
		}
		// IE doesn't pass along the captured event to the source node, let's do that
		// for nodes that are in the captured popup
		// this fixes things like node based mouseover/out highlighting
		if (dojo.isIE) {
			if ((e.srcElement == c.domNode) || dojo.isDescendant(e.srcElement, c.domNode)) {
				wm.fire(e.srcElement, "on" + e.type, [e]);
			}
		}
	}
});

//===========================================================================
// Popup manager
//===========================================================================
dojo.mixin(wm.Popup, {
	popups: [],
	_scrim: null,
	getScrim: function() {
		if (!this._scrim) {
			this._scrim = new wm.Scrim({waitCursor: false});
			dojo.addClass(this._scrim.domNode, "wmpopupscrim");
		}
		return this._scrim;
	},
	getCapture: function() {
		return this._capture || (this._capture = this._createCapture());
	},
	_createCapture: function() {
		return new wm.PopupCapture();
	},
	findPopupForNode: function(inNode) {
		for (var i=0, popups = this.popups, p; (p=popups[i]); i++)
			if (dojo.isDescendant(inNode, p.domNode))
				return p;
	},
	doCapture: function(inPopup) {
		var c = this.getCapture();
			this.captured = inPopup;
			c.release();
			c.capture();
	},
	getCount: function() {
		return this.popups.length;
	},
	getTop: function() {
		var c = this.getCount();
		if (c)
			return this.popups[c-1];
	},
	addPopup: function(inPopup) {
		this.popups.push(inPopup);
		if (inPopup.scrimBackground)
			this.setScrimShowing(true);
		if (inPopup.hideOnClick) {
			this.doCapture(inPopup);
		}
	},
	removePopup: function() {
		var p = this.getTop();
		if (p && p.scrimBackground)
			this.setScrimShowing(false);
		this.popups.pop();
	},
	setScrimShowing: function(inShowing) {
		wm.bgIframe.setShowing(inShowing);
		var scrim = this.getScrim();
		scrim.setShowing(inShowing);
	},
	closeEvent: function(e) {
		if (e._popup)
			return;
		e._popup = true;
		var p = this.getTop();
		if (p) {
			if (p.hideOnClick)
				this.getCapture().release();
			p.eventHide();
		}
	},
	closeTop: function() {
		var p = this.getTop();
		if (p)
			p.hide();
	},
	closePopup: function(inPopup) {
		if (dojo.indexOf(this.popups, inPopup) == -1)
			return;
		var p = this.getTop();
		while (p) {
			p.hide();
			if (p == inPopup)
				return;
			p = this.getTop();
		}
	},
	closeAll: function() {
		var p = this.getTop();
		while (p) {
			p.hide();
			p = this.getTop();
		}
	}
});

wm.Object.extendSchema(wm.Popup, {
	contentWidth: {ignore: 1},
	contentHeight: {ignore: 1},
	positionLocation: {ignore: 1}
});

//===========================================================================
// Popup that contains a wm.Pane
//===========================================================================
dojo.declare("wm.PagePopup", [wm.Popup, wm.pageContainerMixin], {
	init: function() {
		this.inherited(arguments);
		this.initPageContainer();
	},
	// part of pageContainerMixin
	dismiss: function() {
		this.hide();
	},
	setContainerOptions: function(inHideControls, inWidth, inHeight) {
		inWidth = inWidth || wm.Dialog.prototype.contentWidth;
		inHeight = inHeight || wm.Dialog.prototype.contentHeight;
		this.setContentWidth(inWidth);
		this.setContentHeight(inHeight);
		this.inherited(arguments);
	}
});

//===========================================================================
// Popup that contains a list of items
//===========================================================================
dojo.declare("wm.ItemsPopup", wm.Popup, {
	//padding: 4,
	fitToContent: true,
	init: function() {
		this.items = [];
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmitempopup");
	},
	_addItem: function(inItem) {
		var i = inItem;
		if (i instanceof wm.Item) {
			this.items.push(i);
			if (i.parent != this)
				i.setParent(this);
			i.render();
			this.connect(i, "onbeforeclick", this, "_itemClick");
			if (i.onItemClick)
				this.connect(i, "onItemClick", this, "onItemClick");
		}
	},
	addWidget: function(inWidget) {
		this.inherited(arguments);
		this._addItem(inWidget);
	},
	createItem: function(inItemProps, inItemEvents, inPopupItem) {
		var r = this.getRoot();
		if (r) {
			var
				itemClass = inPopupItem ? "wm.PopupItem" : "wm.Item",
				c = r.loadComponent(this.name + "Item", this, itemClass, inItemProps, inItemEvents);
			this._addItem(c);
		}
		return c;
	},
	getCount: function() {
		return this.items.length;
	},
	_pop: function() {
		if (!this.getCount())
			return;
		dojo.forEach(this.items, function(i) {
			i.addRemoveOverState(false);
		});
		this.inherited(arguments);
	},
	removeItem: function(inItem) {
		var i = dojo.indexOf(this.items, inItem);
		if (i != -1) {
			var item = this.items[i];
			this.items.splice(i, 1);
			item.destroy();
		}
	},
	removeItems: function() {
		dojo.forEach(this.items, function(i) {
			i.destroy();
		});
		this.items = [];
	},
	_itemClick: function(e) {
		var item = e.item;
		if (item) {
			if (item.popup && item.popup.items)
				item._clicked();
			else
				this.eventHide();
			this.onItemClick(item);
		}
	},
	onItemClick: function(inItem) {
	}
});

//===========================================================================
// A simple item with mouseOver/disabled states
//===========================================================================
dojo.declare("wm.Item", wm.ToolButton, { 
	singleLine: true,
	height: "24px",
	backgroundColor: "transparent",
	border: 0,
	init: function() {
		// adjust parent to be in a popup if available
		if (this.parent && this.parent.popup)
			this.parent = this.parent.popup;
		this.inherited(arguments);
		this.connectEvents(this.domNode, ["mouseover", "mouseout"]);
		dojo.addClass(this.domNode, "wmitem");
	},
        isReflowEnabled: function() {return 1;},
	findImageList: function() {
		var t = this;
		while (t && !t.imageList) {
			t = t.parent || t.owner;
		}
		return t ? t.imageList : null;
	},
	setDisabled: function(inDisabled) {
		this.inherited(arguments);
		dojo[this.disabled ? "addClass" : "removeClass"](this.domNode, "wmitem-disabled");
	},
	mouseover: function() {
		this.addRemoveOverState(true);
	},
	mouseout: function() {
		this.addRemoveOverState(false);
	},
	addRemoveOverState: function(inAdd) {
		dojo[inAdd ? "addClass" : "removeClass"](this.domNode, "wmitem-over");
	},
	click: function(inEvent) {
		inEvent.item = this;
		this.onbeforeclick(inEvent);
		setTimeout(dojo.hitch(this, "onclick", inEvent), 1);
	},
	onbeforeclick: function(inEvent) {
	},
	onclick: function(inEvent) {
	}
});

wm.Object.extendSchema(wm.Item, {
	format: {ignore: 1}
});

//===========================================================================
// Mixin to give a widget the ability to host a popup of items shown around its domNode
//===========================================================================
dojo.declare("wm.PopupItemsMixin", null, {
	container: true,
	popupWidth: 110,
	popupLocation: "br",
	initPopup: function() {
		wm.fire(this.popup, "destroy");
		var p = this.popup = new wm.ItemsPopup({
			owner:this,
			imageList: wm.Button.prototype.findImageList.call(this),
			name: "popup",
			positionLocation: this.popupLocation,
			positionNode: this.domNode,
			maxHeight: this.maxHeight,
			autoHeight: true
		});
		p.setContentWidth(this.popupWidth);
	},
	addPopupItems: function() {
		for (var i in this.widgets) {
			this.popup._addItem(this.widgets[i]);
		}
	},
	// widgets inside popup are streamed directly as this widget's children
	writeChildren: function(inNode, inIndent, inOptions) {
		var s=[], w, widgets = (this.popup || 0).widgets;
		for (var i in widgets) {
			w = widgets[i];
			s.push(w.write(inIndent, inOptions))
		}
		return s;
	},
	// FIXME: Container required functions. Popup should not be a container.
	getFreeze: function() {
		return true;
	},
	isWidgetTypeAllowed: function() {
		return false;
	}
});

//===========================================================================
// Item that has a popup for other items
//===========================================================================
dojo.declare("wm.PopupItem", [wm.Item, wm.PopupItemsMixin], {
	popupLocation: "rb",
	hideDelay: 200,
	init: function() {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmitem-popup");
		this.initPopup();
	},
	postInit: function() {
		this.inherited(arguments);
		//this.addPopupItems();
		this.connect(this.popup, "onItemClick", this, "onItemClick");
		this.popup.closeAll = true;
		this.connect(this.popup.domNode, "mouseover", this.popup, "cancelHide");
	},
	_hideSiblingPopups: function() {
		var w, widgets = this.parent.widgets;
		for (var i in widgets) {
			w = widgets[i];
			if (w instanceof wm.PopupItem)
				w.popup.hide();
		}
	},
	mouseover: function() {
		this.inherited(arguments);
		this._hideSiblingPopups();
		this.popup.show();
	},
	mouseout: function(e) {
		this.inherited(arguments);
		if (e.relatedTarget != this.parent.domNode && dojo.isDescendant(e.relatedTarget, this.parent.domNode))
			this.popup.delayedHide(this.hideDelay);
	},
	_clicked: function() {
		this.popup.hide();
	},
	onItemClick: function(inEvent) {
	}
});

//===========================================================================
// Button that has a popup
//===========================================================================
dojo.declare("wm.PopupButton", [wm.ToolButton, wm.PopupItemsMixin], {
	init: function() {
		this.inherited(arguments);
		this.initPopup();
	},
	postInit: function() {
		this.inherited(arguments);
		this.addPopupItems();
	},
	onclick: function() {
		if (this.popup) {
			var showing = this.popup.showing;
			wm.Popup.closeAll();
			if (!showing)
				this.popup.show();
		}
	}
});

// design-time
wm.Popup.description = "Popup information.";
wm.PopupButton.description = "Button with menu.";
