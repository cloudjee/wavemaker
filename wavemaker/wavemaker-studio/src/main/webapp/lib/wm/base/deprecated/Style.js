/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

dojo.declare("wm.Bounds", null, {
	/** @lends wm.Bounds.prototype */
	constructor: function() {
		this.bounds = {l:0, t:0, w:96, h:64, r: 96, b: 64};
	},
	getBounds: function() {
		return this.bounds;
	},
	/**
		Set the outermost area of this box, including margin, border, and padding.
		l, t describe the position of the outer most corner of this box.
		w, h describe the size of the box, including margin, border, and padding.
		@param {Object} inBox {l: Number, t: Number, w: Number, h: Number }
	*/
	setBounds: function(inL, inT, inW, inH) {
		if (arguments.length == 1) {
			return this.setBounds(inL.l, inL.t, inL.w, inL.h)
		}
		var b = this.bounds;
		if (!isNaN(inL)) {
			b.l = inL;
		}
		if (!isNaN(inT)) {
			b.t = inT;
		}
		if (inW >= 0 && b.w != inW) {
			b.w = inW;
			this._boundsDirty = true;
		}
		if (inH >= 0 && b.h != inH) {
			b.h = inH;
			this._boundsDirty = true;
		}
		b.r = b.l + b.w;
		b.b = b.t + b.h;
		return b;
	},
	cloneBounds: function() {
		with (this.bounds) {
			return {l:l, t:t, w:w, h:h, r:r, b:b};
		}
	}
});

dojo.declare("wm.Style", null, {
	border: null,
	borderColor: null,
	padding: null,
	margin: null,
	bgColor: null,
	bgImage: null,
	bgRepeat: null,
	bgPosition: null,
	fontFamily: null,
	color: null,
	bold: null,
	italic: null,
	underline: null,
	textAlign: null
});

wm.NilStyle = new wm.Style();

dojo.declare("wm.CascadeStyle", wm.Style, {
	inherits: "",
	constructor: function() {
		this.borderExtents = {l:0, t:0, r:0, b: 0};
		this.paddingExtents = {l:0, t:0, r:0, b: 0};
		this.marginExtents = {l:0, t:0, r:0, b: 0};
		this._style = new wm.Style();
		this.setInheritedStyle(wm.NilStyle);
	},
	setInheritedStyle: function(inStyle) {
		this._inheritedStyle = inStyle;
		dojo.connect(this._inheritedStyle, "changed", this, "changed");
		this.updateStyle();
	},
	setBgColor: function(inBgColor) {
		this._style.bgColor = inBgColor;
		this.changed();
	},
	/**
		Set padding extents in pixels.
		@param {String||Number} inPadding "t, <r, b, l>" || Number
	*/
	setPadding: function(inPadding) {
		this._style.padding = inPadding;
		this.changed();
	},
	/**
		Set border extents in pixels.
		@param {String||Number} inBorder "t, <r, b, l>" || Number
	*/
	setBorder: function(inBorder) {
		this._style.border = inBorder;
		this.changed();
	},
	/**
		Set margin extents in pixels.
		@param {String||Number} inMargin "t, <r, b, l>" || Number
	*/
	setMargin: function(inMargin) {
		this._style.margin = inMargin;
		this.changed();
	},
	/**
		Combine local settings with inherited settings.
	*/
	_styleProps: ["padding", "border", "borderColor", "margin", "bgColor", "bgImage", "bgRepeat", "fontFamily", "color", "bold", "italic", "underline", "textAlign" ],
	updateStyle: function() {
		var p$ = this._styleProps;
		for (var i=0, p, s; p=p$[i]; i++) {
			s = this._style[p];
			s = (s !== null) ? s : this._inheritedStyle[p];
			this[p] = s !== null ? s : "";
		}
	},
	/**
		Parse a four-sided style value. Input can be a number, or a comma separated string.
		@param {Number||String} inExtents Number || "t, <r, b, l>"
	*/
	_parseExtents: function(inExtents) {
		var r = {};
		if (typeof inExtents == "number")
			r = { l: inExtents, t: inExtents, r: inExtents, b: inExtents };
		else {
			var ex = (inExtents || "").split(",");
			var l = ex.length;
			r.t = parseFloat(ex[0]) || 0;
			r.r = l < 2 ? r.t : parseFloat(ex[1]) || 0;
			r.b = l < 3 ? r.t : parseFloat(ex[2]) || 0;
			r.l = l < 4 ? r.r : parseFloat(ex[3]) || 0;
		}
		return r;
	},
	/**
		Update metrics when padBorderMargin has changed.
		@protected
	*/
	changed: function() {
		this.updateStyle();
		this.paddingExtents = this._parseExtents(this.padding);
		this.borderExtents = this._parseExtents(this.border);
		this.marginExtents = this._parseExtents(this.margin);
		this.onchange();
	},
	onchange: function() {
	},
	getCssText: function() {
		var t =
			"margin:" + (this.margin.split(",").join("px ") || 0) + "px;"
			+ "padding:" + (this.padding.split(",").join("px ") || 0) + "px;"
			+ "border:0 solid #ABB8CF;"
			+ "border-width:" + (this.border.split(",").join("px ") || 0) + "px;"
			+ "border-color:" + this.borderColor + ";"
			+ (this.bgColor ? "background-color:" + this.bgColor + ";" : "")
		;
		return t;
	}
});

dojo.declare("wm.StyledBounds", wm.Bounds, {
	/** @lends wm.Bounds.prototype */
	constructor: function(inStyle) {
		this.padBorderMargin = {};
	},
	setStyle: function(inStyle) {
		this.style = inStyle;
		dojo.connect(this.style, "changed", this, "styleChanged");
		this.styleChanged();
	},
	setContentBounds: function(inBox) {
		var b= {};
		var sm = this.getScrollMargins();
		if ("w" in inBox) {
			b.w = inBox.w + this.padBorderMargin.w + sm.w;
		}
		if ("h" in inBox) {
			b.h = inBox.h + this.padBorderMargin.h + sm.h;
		}
		return this.setBounds(b);
	},
	/**
		Update metrics when styles have changed.
		@protected
	*/
	styleChanged: function() {
		this.calcPadBorderMargin();
	},
	/**
		Accumulate padBorderMargin extents.
		@private
	*/
	_edges: {l:1, t:1, r:1, b:1},
	calcPadBorderMargin: function() {
		var pbm = this.padBorderMargin;
		for(var e in this._edges)
			pbm[e] = this.style.borderExtents[e] + this.style.paddingExtents[e] + this.style.marginExtents[e];
		pbm.w = pbm.l + pbm.r;
		pbm.h = pbm.t + pbm.b;
	},
	getScrollMargins: function() {
		return {w:0, h:0};
	},
	/**
		Get an object describing the content-box area.
		l, t describe the position of the origin for objects in this frame.
		w, h describe the size of the content area of the box (inside margin, border, padding, and scrollbars).
		@return {Object} {l: Number, t: Number, w: Number, h: Number}
	*/
	getContentBounds: function() {
		var sm = this.getScrollMargins();
		var b = {
			l: this.style.paddingExtents.l,
			t: this.style.paddingExtents.t,
			w: this.bounds.w - this.padBorderMargin.w - sm.w,
			h: this.bounds.h - this.padBorderMargin.h - sm.h
		};
		b.r = b.l + b.w;
		b.b = b.t + b.h;
		return b;
	},
	getStyleBounds: function() {
		var b = {
			l: this.bounds.l,
			t: this.bounds.t,
			w: this.bounds.w - this.padBorderMargin.w,
			h: this.bounds.h - this.padBorderMargin.h
		};
		b.r = b.l + b.w;
		b.b = b.t + b.h;
		return b;
	}
});

wm.define("wm.StyledControl", wm.Control, {
	constructor: function() {
		this._style = new wm.CascadeStyle();
		this._style.onchange = dojo.hitch(this, "styleChange");
	},
	styleChange: function() {
		this.render();
	},
	getCssText: function() {
		var t =
			this._style.getCssText()
			+ "overflow:" + (this.autoScroll ? "auto" : "hidden") + ";"
			+ (this.scrollX ? "overflow-x:scroll;" : "")
			+ (this.scrollY ? "overflow-y:scroll;" : "")
			+ (this.cssText || "")
		;
		return t;
	}
});
