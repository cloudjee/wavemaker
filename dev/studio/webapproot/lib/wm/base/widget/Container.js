/*
 *  Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Container");

/**
	Base class for widget containers.
	@name wm.Container
	@class
	@extends wm.Control
*/
wm.define("wm.Container", wm.Control, {
	/** @lends wm.Container.prototype */
	published: {
		invalid: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },
		lock: { order: 0 },
		freeze: { order: 5 },
		box: { ignore: 1 },
		boxPosition: { ignore: 1},
		disabled: { ignore: 1 },
	        autoScroll: {group: "scrolling", order: 100, ignore: 0}
	},
	imageList: "",
	border: 0,
	container: true,
	lock: false,
	freeze: false,
	classNames: "wmcontainer",
	autoScroll: false,
        isMajorContent: false,
    //themeStyleType: "",        // A funky parameter that won't ever show up in widgets.js; instead it adds/removes classes (more of a style's inspector kind of property, but one that identifies the type of content and leaves it to the theme to decide how to render it)
        fitToContentWidth: false,  // Container automatically resizes itself to match the width of its content, or minWidth if % sized content
        fitToContentHeight: false, // Container automatically resizes itself to match the height of its content, or minHeight if % sized content      
        fitToContent: false,       // shortcut for (fitToContentWidth || fitToContentHeight)
        _needsFitToContent: false, // Init time flag that signals that this fitToContent container has not yet been fit to its content

	constructor: function() {
		this.c$ = [];
	},
	init: function() {
	    this.inherited(arguments);
	    this.setLayoutKind(this.layoutKind);
	    this.domNode.box = this.box = "";
	    this._needsFitToContent = this.fitToContent = this.fitToContentWidth || this.fitToContentHeight;
	},
	postInit: function() {
		if (this.isDesignLoaded())
			this.setLock(this.lock);
		this.inherited(arguments);
/*
	    if (this.isMajorContent)  // obsolete property
                this.setThemeStyleType("ContentPanel");
            else if (this.themeStyleType)
                this.setThemeStyleType(this.themeStyleType);
                */
	},
	destroy: function()
	{
		if (this.domNode && this.domNode.box)
			delete this.domNode.box;
		this.inherited(arguments);
	},
	// backward-compatibility fixups
	afterPaletteDrop: function() {
		if (this.verticalAlign == "justified")
			this.verticalAlign = "top";
		if (this.horizontalAlign == "justified")
			this.horizontalAlign = "left";
	},
	bc: function() {
		this.inherited(arguments);
		/*
		if (this.verticalAlign == "justified") {
			this.verticalAlign = "top";
		}
		if (this.horizontalAlign == "justified") {
			this.horizontalAlign = "left";
		}
		*/
		delete this.layoutJustify;
		if (this.layoutAlign) {
			this.contentAlign = this.layoutAlign;
			delete this.layoutAlign;
		}
	    
	        /* this.layoutFit I believe is an obsolete wm 4.x property */
		if (this.layoutFit) {
			this.fitToContentWidth = this.fitToContentHeight = this.layoutFit;
			delete this.layoutFit;
		}
		if (this.box == "h") {
			this.layoutKind = "left-to-right";
			//this.layout = wm.Container.vBox;
		}
		if (this.boxPosition) {
			var
				boxPositions = ['topLeft', 'center', 'bottomRight'],
				vAligns = ["top", "middle", "bottom"],
				hAligns = ["left", "center", "right"],
				h = this.layoutKind == "left-to-right",
				i = dojo.indexOf(boxPositions, this.boxPosition);
			if (i != -1) {
				if (h)
					this.horizontalAlign = hAligns[i];
				else
					this.verticalAlign = vAligns[i];
			}
		}
	},
	//
	// Child Controls
	//
	addWidget: function(inWidget){
		this.inherited(arguments);

			if (this.box == 'h' && !inWidget.width)
				inWidget.setProp("width", "64px");
			else if (this.box == 'v' && !inWidget.height)
				inWidget.setProp("height", "64px");
			//inWidget.setSize(inWidget.size);
	},
	getOrderedWidgets: function() {
		return this.c$;
	},
	addControl: function(inControl) {
		this.c$.push(inControl);
		//this.dom.append(inControl.dom);
	},
	removeControl: function(inControl) {
		//this.dom.remove(inControl.dom);
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
				this.c$.splice(i, 1);
				return i;
			}
		}
	},
        // Added by michael k 5/15/09 to support the PopupHelp dialog
	removeAllControls: function() {
		    while (this.c$.length) {
			  var c = this.c$[0];
			  this.removeControl(c);
			  c.destroy();
		    }
			  /*
	      while (this.c$.length) this.removeControl(this.c$[0]);
	      for (var n in this.widgets)
		    this.removeWidget(this.widgets[n]);
	      while (this.domNode.firstChild) this.domNode.removeChild(this.domNode.firstChild);
			  */
	      this.reflow();
	},
	insertControl: function(inControl, inIndex) {
		this.c$.splice(inIndex, 0, inControl);
		//this.dom.append(inControl.dom);
	},
	moveControl: function(inControl, inIndex) {
		var i0 = this.removeControl(inControl);
		if (i0 < inIndex)
			inIndex--;
		this.c$.splice(inIndex, 0, inControl);
	},
	indexOfControl: function(inControl) {
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
				return i;
			}
		}
		return -1;
	},
	nextSibling: function(inControl) {
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
				return this.c$[i+1];
			}
		}
	},
	prevSibling: function(inControl) {
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
				return this.c$[i-1];
			}
		}
	},
	setAutoScroll: function(inAutoScroll) {
		this._xscrollX = false;
		this._xscrollY = false;
		this.inherited(arguments);
		this.reflow();
	},


        adjustSetSizeProp: function(n,v) {
	    if (n == "height" && this.fitToContentHeight && this.getPreferredFitToContentHeight)
		return this.getPreferredFitToContentHeight() + "px";
	    if (n == "width" && this.fitToContentWidth && this.getPreferredFitToContentWidth) 
		return this.getPreferredFitToContentWidth() + "px";
	    return v;
	},
	//
	// Flow
	//
	reflow: function() {
	    this._boundsDirty = true;
	    if (!this.isReflowEnabled()) 
		return;
	    /* If this widget is fitToContent, then we'll need to update this container's width/height to fit its contents; and that means the parent will need to reflow.
	     * If the parent is fitToContent, (TODO: Is this still needed?) then any we'll need to call this.parent.reflow() which will cause the parent to flow its children, 
	     * (of which this container is one), and the children to flow their children of which this is one. 
	     *  After this is done, this too will call calcFitToContent.  
	     */
		if (this.parent && (this.fitToContent || this.parent.fitToContent)) {
			if (this._needsFitToContent) delete this._needsFitToContent;
			this.parent.reflow();
                    /*
			if (this.fitToContent) {
				this.calcFitToContent();
			}
                        */
		} else {
			this.flow();
		}
	},
	flow: function() {
	       if (this._boundsDirty && this.isReflowEnabled()) {
			// call flow; if autoScroll is enabled, then this call to flow is just to test if scrollbars are needed.	
			// If autoScroll is enabled, we'll need to call flow again, 
                   /* all autoscroll calculations moved to Box.js
			if (this.autoScroll) {
			    // This call sets _xscrollX/_xscrollY and returns without doing a real traversal.
			    // Setting these values means when we do the real call to flow we will get an adjusted return value when we call getContentBounds()
			    this.layout.flow(this,true);  
			} 
                        */

			this.layout.flow(this,false);
		}
		//else (!this._boundsDirty)
		//	console.log(this.name, ": not flowing (clean bounds)");
	},
	renderControls: function() {
	    // code to insure that a container's scrollbars are updated when a child is resized... 
	    // this means that autoscroll has a slower rendering execution than non-autoscroll
	    //if (this.autoScroll && this._xneedReflow || this.fitToContent) this.renderBounds();
	    for (var i=0, c; c=this.c$[i]; i++) {
		c.renderBounds();
	    }
	},
        forEachControl: function(inFunc, paramArray) {
	  dojo.forEach(this.c$, function(inControl) {
	    inFunc.apply(inControl, (paramArray) ? paramArray : []);
	    });
	},
	// bc
	nodeBoundsChange: function() {
		// should be caused by box layout flow
		/*
		this.setBounds(dojo.marginBox(this.domNode));
		this.flow();
		*/
	},
	//
	// Image list
	//
	imageListChanged: function() {
		for (var i=0, c; c=this.c$[i]; i++) {
			wm.fire(c, "imageListChanged");
		}
	},
	setImageList: function(inImageList) {
		this.imageList = inImageList;
		this.imageListChanged();
	},
	//
	// validation
	//
	validate: function() {
		this.setValue("invalid", this.getInvalid());
		wm.fire(this.parent, "validate");
	},
	getInvalid: function() {
	    for (var i in this.widgets) {
		var w = this.widgets[i];
		if (w.invalid)
		    return true;
                else if (w.invalid === undefined && w.getInvalid && w.getInvalid())
                    return true;
	    }
            return !this.customGetValidate();
	},
        customGetValidate: function() {
	    return true;
        },
	getInvalidWidget: function() {
	    for (var i in this.widgets) {
		var w = this.widgets[i];
		if (wm.isInstanceType(w,wm.Editor) ||
		    wm.isInstanceType(w,wm.AbstractEditor)) {
		    if (w.getInvalid()) return w;
		} else if (wm.isInstanceType(w,wm.Container)) {
		    var tmp = w.getInvalidWidget();
		    if (tmp) return tmp;
		}
	    }
	    return null;
	},

	//
	// Lock/freeze
	//
	getLock: function() {
		return this.lock || (this.parent && wm.fire(this.parent, "getLock"));
	},
	setLock: function(inLock) {
	        var original = this.lock;
		this.lock = inLock;
		if (window['studio'] && (this.lock != original || this.lock)) {
		    studio.refreshComponentOnTree(this);
		}
	},
	getFreeze: function() {
		return this.freeze || this.getLock();
	},
	// FIXME: design only? vestigal?
	/*
	findContainer: function(inType) {
		if (!this.lock) {
			if (this.freeze || !this.isWidgetTypeAllowed(inType)) {
				for (var i in this.widgets) {
					var w = this.widgets[i];
					if (w.container) {
						var r = w.findContainer(inType);
						if (r)
							return r;
					}
				}
			} else {
				return this;
			}
		}
	},
	*/
	// used by paste
	isWidgetTypeAllowed: function(inType) {
		// subclasses should override this to enforce only certain widget types
		// are allowed to be added to the container.
		return true;
	},
	/*
	setBox: function(inBox) {
		if (this.box != inBox) {
			this.box = (this.containerNode || this.domNode).box = inBox;
			// FIXME: wtf?
			//if (this.isSizeable() || !this.isMoveable())
				this._reorientChildren(this.box);
			this.reflow();
		}
	},
	*/
	/*
	_reorientChildren: function(inBox) {
		var b = inBox, bp = wm.Box.prototype, bw = bp.width, bh = bp.height;
		var parentNode = this.containerNode || this.domNode;
		wm.forEachProperty(this.widgets, function(w) {
			if (w.domNode.parentNode != parentNode)
				return;
			var s = w.domNode.style, f = (b == 'flow' || b == '');
			if (f) {
				s.position = 'static';
				w.left = w.top = '';
				w.updateBounds();
			} else
				s.position = 'absolute';
			w.moveable = !f;
			if (b == 'h' || b == 'v') {
				w.width = bw; 
				w.height = bh;
				w.updateBounds();
			}
		});
	},*/
	_reorientChildren: function(inBox) {
		var parentNode = this.containerNode || this.domNode;
		wm.forEachProperty(this.widgets, function(w) {
			if (w.domNode.parentNode != parentNode)
				return;
			var ww = w.width;
			w.width = w.height;
			w.height = ww;
			w.updateBounds();
		});
	},
	clearData: function() {
		var clear = function(w) {
			if (w instanceof wm.Editor)
				w.clear();
		}

		wm.forEachWidget(this,clear);
	},
    /* What is the maximum width that this container can achieve given its parents and assuming we aren't planning on using scrollbars? 
     * The answer is a function of the parent's getCurrentMaxWidth and the sizes of this container's siblings.
     */
	getCurrentMaxWidth: function() {
		// If no parent, or if the parent doesn't have the getCurrentMaxWidth method, then there is nothing to look up, just
		// return the available width within this container
		if (!this.parent || !this.parent.getCurrentMaxWidth)
			return this.bounds.w - this.padBorderMargin.l - this.padBorderMargin.r;

		// Else if we are fitToContent, then we need to get the parent's current max width, as that is how far our fitToContent container can extend
		else if (this.fitToContent)
			return this.parent.getCurrentMaxWidth();

		// If we are NOT fitToContent, but we are % sized in a top-to-bottom layout, then our max width is the width of the parent
		else if (this._percEx.w && this.layoutKind == "top-to-bottom")
			return this.parent.getCurrentMaxWidth();

		// If we are NOT fitToContent but we are % sized in a left-to-right layout, then calc how much free space there is in the parent
		// return free space minus the width of this object to get the full space available for this container to grow
		else if (this._percEx.w && this.layoutKind == "top-to-bottom") {
			var maxWidth = this.parent.layout.getMaxFreeSpace(this.parent.c$, "w",this.parent.bounds.w - this.parent.padBorderMargin.l - this.parent.padBorderMargin.r);
			return maxWidth + this.bounds.w;
		}
		// Else we must be px sized, so just return our width
		else
			return this.bounds.w - this.padBorderMargin.l - this.padBorderMargin.r;
	},

    /* What is the maximum height that this container can achieve given its parents and assuming we aren't planning on using scrollbars? 
     * The answer is a function of the parent's getCurrentMaxHeight and the sizes of this container's siblings.
     */
	getCurrentMaxHeight: function() {
		if (!this.parent || !this.parent.getCurrentMaxHeight)
			return this.bounds.h - this.padBorderMargin.t - this.padBorderMargin.b;

		else if (this.fitToContent)
			return this.parent.getCurrentMaxHeight();

		else if (this._percEx.h && this.layoutKind == "left-to-right")
			return this.parent.getCurrentMaxHeight();
		else if (this._percEx.h && this.layoutKind == "top-to-bottom") {
			var maxHeight = this.parent.layout.getMaxFreeSpace(this.parent.c$, "h",this.parent.bounds.h - this.parent.padBorderMargin.t - this.parent.padBorderMargin.b);
			return maxHeight + this.bounds.h;
		}
		else
			return this.bounds.h - this.padBorderMargin.t - this.padBorderMargin.b;
	}
});

// Design

wm.Container.extend({
	listProperties: function() {
		var p = this.inherited(arguments);
		p.freeze.ignore = this.schema.freeze.ignore || this.getLock();
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
	resizeUpdate: function(inBounds) {
		// update the boundary rectangle highlight only
		this.designWrapper._setBounds(inBounds);
	},

    /* Get the preferred width of this container, for use if this is a fitToContentWidth container.
     * left-to-right container: width is the sum of the widths of all px sized children and the sum of all minWidths for % sized children.
     * top-to-bottom container: width is the max of the widths of all px sized children and the minWidths for % sized children
     */
	getPreferredFitToContentWidth: function() {
		// get the maximum width in this column; 
		// and get the sum of widths in this row... we'll worry later about whether its a row or column
                var extra = this.padBorderMargin.r + this.padBorderMargin.l;	
	        var max = 0;
	        var sum = 0;
		var v;
		for (var i=0, c; c=this.c$[i]; i++) {
			if (this.layout.inFlow(c)) {
				if (c.fitToContentWidth) {
					v =  c.getPreferredFitToContentWidth();
				} else if (!c._percEx.w) {
					v =  c.bounds.w;
				} else {
					v = c.minWidth || c.getMinWidthProp();
				}
				max = Math.max(max, v);
				sum += v;				
			}
		}

                // Never return less than 30px wide; mostly this is for design mode where users still need to be able to find and drop widgets into the container.
	        var result = ((this.layoutKind == "top-to-bottom") ? max : sum) + extra;
	    return Math.max(result, wm.Control.prototype.getMinWidthProp.call(this));
	},

    /* Get the preferred height of this container, for use if this is a fitToContentHeight container.
     * top-to-bottom container: height is the sum of the heights of all px sized children and the sum of all minHeights for % sized children.
     * left-to-right container: height is the max of the heights of all px sized children and the minHeights for % sized children
     */
	getPreferredFitToContentHeight: function() {
		// get the maximum width in this column; 
		// and get the sum of height in this row... we'll worry later about whether its a row or column
            var extra = this.padBorderMargin.t + this.padBorderMargin.b;	
	    var max = 0;
	    var sum = 0;
		var v;
		for (var i=0, c; c=this.c$[i]; i++) {
			if (this.layout.inFlow(c)) {
				 if (c.fitToContentHeight) {
					v = c.getPreferredFitToContentHeight();
				} else if (!c._percEx.h) {
					v = c.bounds.h;
				} else {
					v =  c.minHeight || c.getMinHeightProp();
				}
				max = Math.max(max, v);
				sum += v;
			}
		}
            // never return less than 15px height
            var result =  ((this.layoutKind == "left-to-right") ? max : sum) + extra;
	    return Math.max(result, wm.Control.prototype.getMinHeightProp.call(this));
	},
	getMinWidthProp: function() {
            if (this.fitToContentWidth)
                return this.getPreferredFitToContentWidth();
	    else
		return this.inherited(arguments);
	},
	getMinHeightProp: function() {
            if (this.fitToContentHeight)
                return this.getPreferredFitToContentHeight();
	    else
		return this.inherited(arguments);
	},
        focusFirstEditor: function() {
	    for (var i in this.widgets) {
		var w = this.widgets[i];
		if (wm.isInstanceType(w,wm.Editor) ||
		    wm.isInstanceType(w,wm.AbstractEditor)) {
		    w.focus();
		    return w;
		} else if (wm.isInstanceType(w,wm.Container)) {
		    var tmp = w.focusFirstEditor();
		    if (tmp) return tmp;
		}
	    }
	    return null;
	},
        setIsMajorContent: function(inMajor) {
	    if (inMajor)
		this.addUserClass("wmcontentarea");
	    else
		this.removeUserClass("wmcontentarea");
	},
        getIsMajorContent: function() {
	    try {
		return dojo.indexOf(this._classes.domNode, "wmcontentarea") != -1;
	    } catch(e){}
	},
	// bc
	clearEditors: function(){
		return this.clearData();
	}
});

// this stuff is layout specific

wm.Container.extend({
	layoutKind: "top-to-bottom",
	//layoutFit: false,
	//contentAlign: "leftTop",
	horizontalAlign: "justified",
	verticalAlign: "justified",
	//horizontalAlign: "left",
	//verticalAlign: "top",
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "layoutKind":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: wm.layout.listLayouts()});
			case "horizontalAlign":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["left", "center", "right"/*, "justified"*/]});
			case "verticalAlign":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["top", "middle", "bottom"/*, "justified"*/]});
                case "themeStyleType":
		    return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]});
		}
		return this.inherited(arguments);
	},
	setLayoutKind: function(inLayoutKind) {
		if (this.layoutKind != inLayoutKind || !this.layout) {
		  /*
			var ctor = wm.layout.registry[inLayoutKind];
			if (!ctor) {
				return;
			}
			this.layoutKind = inLayoutKind;
			this.layout = new ctor();
		  */
		  this.layoutKind = inLayoutKind;
		  this.layout = wm.layout.cache[inLayoutKind];
		}

	        // KANA: for the JobDesigner
		if (this.isDesignLoaded())
		    dojo.publish("LayoutKindChanged", [this]); 
		this.reflow();
	},
	setHorizontalAlign: function(inHorizAlign) {
		this.horizontalAlign = inHorizAlign;
		this.reflow();
	},
	setVerticalAlign: function(inVertAlign) {
		this.verticalAlign = inVertAlign;
		this.reflow();
	},
	setFitToContentWidth: function(inFitToContent) {
		this.fitToContentWidth = inFitToContent;
		this.fitToContent = this.fitToContentWidth || this.fitToContentHeight;
		this.updateBounds();
		this.reflowParent();
		this.calcFitToContent();
		this.reflowParent();
	},
	setFitToContentHeight: function(inFitToContent) {
		this.fitToContentHeight = inFitToContent;
		this.fitToContent = this.fitToContentWidth || this.fitToContentHeight;
		this.updateBounds();
		this.reflowParent();
		this.calcFitToContent();
		this.reflowParent();
	},
	calcFitToContent: function() {
	        if (this.fitToContentHeight) {
			this.height = this.bounds.h + "px";
                        this._percEx.h = 0;
                }
	        if (this.fitToContentWidth) {
			this.width = this.bounds.w + "px";
                        this._percEx.w = 0;
                }
	}
});

wm.Object.extendSchema(wm.Container, {
    layoutKind:         {group: "layout", order: 100},
    horizontalAlign:    {group: "layout", order: 110},
    verticalAlign:      {group: "layout", order: 120},
    fitToContent:       {ignore: true},
    fitToContentWidth:  {group: "advanced layout", order: 90, shortname: "Auto Width"},
    fitToContentHeight: {group: "advanced layout", order: 91, shortname: "Auto Height"},
    autoScroll: {group: "scrolling", order: 100, ignore: 0},
    isMajorContent: {group: "style", order: 150, ignore: 1},
    themeStyleType: {group: "style", order: 150}
});
