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

dojo.provide("wm.base.widget.Container");

/**
	Base class for widget containers.
	@name wm.Container
	@class
	@extends wm.Control
*/
wm.define("wm.Container", wm.Control, {
	/** @lends wm.Container.prototype */
/*
	published: {
		invalid: { ignore: 1, bindSource: 1, readonly: 1, type: "Boolean" },
	    lock: { order: 0, type: "Boolean" },
		freeze: { order: 5, type: "Boolean" },
		box: { ignore: 1 },
		boxPosition: { ignore: 1},
	        autoScroll: {group: "scrolling", order: 100, ignore: 0, type: "Boolean"}
	},
	*/
    //touchScrolling: false,
	imageList: "",
	border: "0",
	container: true,
	lock: false,
	freeze: false,
	classNames: "wmcontainer",
	autoScroll: false,
    //themeStyleType: "",        // A funky parameter that won't ever show up in widgets.js; instead it adds/removes classes (more of a style's inspector kind of property, but one that identifies the type of content and leaves it to the theme to decide how to render it)
        fitToContentWidth: false,  // Container automatically resizes itself to match the width of its content, or minWidth if % sized content
        fitToContentHeight: false, // Container automatically resizes itself to match the height of its content, or minHeight if % sized content      
        fitToContent: false,       // shortcut for (fitToContentWidth || fitToContentHeight)
        _needsFitToContent: false, // Init time flag that signals that this fitToContent container has not yet been fit to its content


	constructor: function() {
		this.c$ = [];
	},
	init: function() {
	    if (this.dockRight) {
		app.dockRight = this;
	    } 
	    if (this.dockLeft) {
		app.dockLeft = this;
	    } 
	    if (this.dockTop) {
		app.dockTop = this;
	    } 
	    if (this.dockBottom) {
		app.dockBottom = this;
	    }
	    if (this.autoScroll && app._touchEnabled && !wm.disableTouchScroll) {
		wm.conditionalRequire("lib.github.touchscroll.touchscroll" + (djConfig.isDebug ? "" : "min"));
		this._touchScroll = new TouchScroll(this.domNode, {elastic:true, owner: this});
		this._touchScroll.scrollers.outer.style.position = "absolute";
		this._touchScroll.scrollers.outer.style.left = "0px";
		this._touchScroll.scrollers.outer.style.top = "0px";
	    }


	    this.inherited(arguments);
	    this.setLayoutKind(this.layoutKind);
	    this.domNode.box = this.box = "";
	    this._needsFitToContent = this.fitToContent = this.fitToContentWidth || this.fitToContentHeight;
	},
	postInit: function() {
		if (this.isDesignLoaded())
			this.setLock(this.lock);
		this.inherited(arguments);
	},
        /* Called from Component.makeEvents or by end user*/
        connectOnEnterKey: function() {
	    this.connect(this.domNode, "onkeypress", this, "keypress");
	},
        keypress: function(evt) {
	    var self = this; 
	    if (evt.keyCode == dojo.keys.ENTER && evt.target.tagName != "TEXTAREA") {
		wm.job(this.getRuntimeId() + ".enterkeypress", 50, dojo.hitch(this, function() {
		    if (!this.isDestroyed)
			this.onEnterKeyPress(evt);
		}));
	    }
	},
        setThemeStyleType: function(inType) {
	    var oldType = this.getThemeStyleType();
	    if (oldType)
		this.removeUserClass(oldType);
	    if (inType)
		this.addUserClass(inType);
	},
        getThemeStyleType: function() {
	    var types = ["MainContent", "EmphasizedContent", "HeaderContent"];
	    if (this._classes && this._classes.domNode)
		for (var i = 0; i < types.length; i++) {
		    if (dojo.indexOf(this._classes.domNode, types[i]) != -1) return types[i];
		}
	},
	destroy: function()
	{
	    if (this.dockRight) {
		delete app.dockRight;
	    } else if (this.dockLeft) {
		delete app.dockLeft;
	    } else if (this.dockTop) {
		delete app.dockTop;
	    } else if (this.dockBottom) {
		delete app.dockBottom;
	    }
		if (this.domNode && this.domNode.box)
			delete this.domNode.box;
		this.inherited(arguments);
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
    nextSibling: function(inControl, showingOnly) {
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
			    if (!showingOnly) {
				return this.c$[i+1];
			    } else {
				for (var j = i+1; j < this.c$.length; j++) {
				    if (this.c$[j].showing) return this.c$[j];
				}
			    }
			}
		}
	},
    prevSibling: function(inControl, showingOnly) {
		for (var i=0, c; c=this.c$[i]; i++){
			if (c == inControl) {
			    if (!showingOnly) {
				return this.c$[i-1];
			    } else {
				for (var j = i-1; j >= 0; j--) {
				    if (this.c$[j].showing) return this.c$[j];
				}
			    }

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
    adjustFlowForMobile: function() {
	if (this.autoScroll || this.fitToContentHeight  || studio.currentDeviceType == "desktop") return;
	var max = 0;
	if (this.layoutKind == "left-to-right") {
	    max = this.bounds.h;
	    for (var i = 0; i < this.c$.length; i++) {
		var c = this.c$[i];
		if (c.enableTouchHeight && !c._percEx.h && c.mobileHeight) { 
		    if (c.bounds.h > max) max = c.bounds.h;
		}
	    }
	} else {
	    var hasMobileHeight = false;
	    for (var i = 0; i < this.c$.length; i++) {
		var c = this.c$[i];
		if (c.enableTouchHeight && !c._percEx.h && c.mobileHeight) { 
		    hasMobileHeight = true;
		    break;
		}
	    }
	    if (hasMobileHeight)
		max = this.getPreferredFitToContentHeight();
	}
	if (max > this.bounds.h) {
	    this.enableTouchHeight = true;
	    var h =  max + "px";
	    this.mobileHeight = h;
	    this.setHeight(h);
	}

    },
	flow: function() {
	    if (this._boundsDirty && this.isReflowEnabled()) {
		if (this._isDesignLoaded) {
		    this.adjustFlowForMobile();
		}
		this.layout.flow(this,false);
	    }
	},
	renderControls: function() {
	    // code to insure that a container's scrollbars are updated when a child is resized... 
	    // this means that autoscroll has a slower rendering execution than non-autoscroll
	    //if (this.autoScroll && this._xneedReflow || this.fitToContent) this.renderBounds();
	    for (var i=0, c; c=this.c$[i]; i++) {
		if (c.showing)
		    c.renderBounds();
	    }
	},
    removeDelayedReflow: function() {
	delete wm.Container.delayedReflowWidgets[this.getRuntimeId()];
    },
    delayedReflow: function() {
	/* Already queued for reflow */
	if (wm.Container.delayedReflowWidgets[this.getRuntimeId()])
	    return;
	wm.Container.delayedReflowWidgets[this.getRuntimeId()] = this;
	
	var newParents = [];

	/* Iterate over every existing delayed widget and find if they have a common parent that could be reflowed instead */
	try {
	    wm.forEachProperty(wm.Container.delayedReflowWidgets, dojo.hitch(this, function(widget, widgetid) {
	    if (widget === this) {
		;
	    } else if (widget.parent === this.parent) {
		delete wm.Container.delayedReflowWidgets[widgetId];
		delete 	wm.Container.delayedReflowWidgets[this.getRuntimeId()];
		newParents.push(this.parent);
	    } else if (this.isAncestor(widget)) {
		delete wm.Container.delayedReflowWidgets[widgetId];
	    } else if (widget.isAncestor(this)) {
		delete 	wm.Container.delayedReflowWidgets[this.getRuntimeId()];
	    }
	    }));
	} catch(e) {}
	for (var i = 0; i < newParents.length; i++) {
	    newParents[i].delayedReflow();
	}

	if (!wm.Container._delayedReflowWidgetsId) {
	    wm.Container._delayedReflowWidgetsId = window.setTimeout(wm.Container.runDelayedReflow, 1);
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


    updateIsDirty: function() {
	this.setValue("isDirty", this.getIsDirty());
	wm.fire(this.parent, "updateIsDirty");
    },
    getIsDirty: function() {
	for (var i in this.widgets) {
	    var w = this.widgets[i];
	    if (w.isDirty)
		return true;
            else if (w.isDirty === undefined && w.getIsDirty && w.getIsDirty())
                return true;
	}
    },

	//
	// validation
	//
	validate: function() {
		this.setValue("invalid", this.getInvalid());
		wm.fire(this.parent, "validate");
	},
	getInvalid: function() {
	    var p = this.getParentPage();
	    for (var i in this.widgets) {
		var w = this.widgets[i];
		if (p && p.validateVisibleOnly && (!w.showing || wm.Layer && w instanceof wm.Layer && !w.isActive()))
		    continue;
		if (w.invalid)
		    return true;
                else if (w.invalid === undefined && w.getInvalid && w.getInvalid())
                    return true;
	    }

	    if (dojo.isFunction(this.customGetValidate))
		return !this.customGetValidate();
	    return false;
	},
        customGetValidate: function() {
	    return true;
        },
	getInvalidWidget: function() {
	    var p = this.getParentPage();
	    for (var i in this.widgets) {
		var w = this.widgets[i];
		if (p && p.validateVisibleOnly && (!w.showing || wm.Layer && w instanceof wm.Layer && !w.isActive()))
		    continue;
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
		return this.lock || (this.parent && wm.fire(this.parent, "getLock")) || false;
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
			if (w instanceof wm.Editor || w instanceof wm.AbstractEditor)
				w.clear();
		}

		wm.forEachWidget(this,clear);
	},
	resetData: function() {
		var reset = function(w) {
			if (w instanceof wm.AbstractEditor)
				w.reset();
		}

		wm.forEachWidget(this,reset);
	},
        clearDirty: function() {
	    	this.setValue("isDirty", false);
		var dirty = function(w) {
			if (w instanceof wm.AbstractEditor)
				w.clearDirty();
		}

		wm.forEachWidget(this,dirty);
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

wm.Container.extend({

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
	    var percentUsed = 0;
		var v;
	    var count = 0;
		for (var i=0, c; c=this.c$[i]; i++) {		    
			if (this.layout.inFlow(c)) {
			    count++;
			    if (
				/* if its a fitToContentWidth widget, then its height is determined by calling getPreferredFitToContentHeight */
				c.fitToContentWidth || 
				    /* If there is a fitToContentWidth panel that contains a Container that is percent sized, then
				     * assume the parent will resize to fit whatever height this % sized container needs.
				     * If c is autoScrolling, then its size isn't affected by its contents.
				     */
				c instanceof wm.Container && c._percEx.w == 100 && !c.autoScroll && c.parent && (c.parent.fitToContentWidth||c.parent.autoScroll)
			       ) {
					v =  c.getPreferredFitToContentWidth();
				} else if (!c._percEx.w) {
					v =  c.bounds.w;
				} else {
				    v = parseInt(c.minWidth) || c.getMinWidthProp();
				    if (c.bounds.w > v || this.c$.length == 1) {
					if (percentUsed < 100)
					    percentUsed += c._percEx.w;
				    } else {
					percentUsed = 100;
				    }
				}
				max = Math.max(max, v);
				sum += v;				
			    
			}
		}

	    var dontNormalizeMinPercent = count == 1;
	    if (!dontNormalizeMinPercent && percentUsed && percentUsed < 100) {
		sum = Math.round(sum * 100/percentUsed);
		max = Math.round(max * 100/percentUsed);
	    }
                // Never return less than 30px wide; mostly this is for design mode where users still need to be able to find and drop widgets into the container.
	    if (this.layoutKind == "fluid") return Math.min(this.bounds.w, max);

	        var result = ((this.layoutKind == "top-to-bottom") ? max : sum) + extra;
	    return Math.max(this.minWidth,Math.max(result, wm.Control.prototype.getMinWidthProp.call(this)));
	},

    /* Get the preferred height of this container, for use if this is a fitToContentHeight container.
     * top-to-bottom container: height is the sum of the heights of all px sized children and the sum of all minHeights for % sized children.
     * left-to-right container: height is the max of the heights of all px sized children and the minHeights for % sized children
     */
    getFluidHeight: function() {
	return this.layout.flow(this,true);
    },
	getPreferredFitToContentHeight: function() {
	    if (this.layoutKind == "fluid") return this.getFluidHeight();
		// get the maximum width in this column; 
		// and get the sum of height in this row... we'll worry later about whether its a row or column
            var extra = this.padBorderMargin.t + this.padBorderMargin.b;	
	    var max = 0;
	    var sum = 0;
	    var percentUsed = 0;
	    var v;
	    var count = 0;
		for (var i=0, c; c=this.c$[i]; i++) {
			if (this.layout.inFlow(c)) {
			    count++;

			    if (
				c.fitToContentHeight || 
				    /* If there is a fitToContentHeight panel that contains a Container that is percent sized, then
				     * assume the parent will resize to fit whatever height this % sized container needs.
				     * If c is autoscrolling, then its size is not affected by its children.
				     */
				c instanceof wm.Container && c._percEx.h == 100 && !c.autoScroll && c.parent && (c.parent.fitToContentHeight||c.parent.autoScroll)
			       ) {
					v = c.getPreferredFitToContentHeight();
				} else if (!c._percEx.h) {
					v = c.bounds.h;
				} else {
				    v =  c.getMinHeightProp();
				    if (c.bounds.h > v || this.c$.length == 1) {
					if (percentUsed < 100)
					    percentUsed += c._percEx.h;
				    } else {
					percentUsed = 100;
				    }
				}
				max = Math.max(max, v);
				sum += v;
			}
		}
	    var dontNormalizeMinPercent = count == 1;
	    if (!dontNormalizeMinPercent && percentUsed && percentUsed < 100) {
		sum = Math.round(sum * 100/percentUsed);
		max = Math.round(max * 100/percentUsed);
	    }

            // never return less than 15px height
            var result =  ((this.layoutKind == "left-to-right") ? max : sum) + extra;
	    return Math.max(result, wm.Control.prototype.getMinHeightProp.call(this));
	},
    setBestWidth: function() {
	this.setWidth(this.getPreferredFitToContentWidth() + "px");
    },
    setBestHeight: function() {
	this[this._isDesignLoaded ? "set_height" : "setHeight"](this.getPreferredFitToContentHeight() + "px");
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
	    for (var i = 0; i < this.c$.length; i++) {
		var w = this.c$[i];
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

	// bc
	clearEditors: function(){
		return this.clearData();
	},


    // events
    onEnterKeyPress: function(inEvent){}
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
	},


    toHtml: function(inWidth) {
	if (this.customToHtml != this.constructor.prototype.customToHtml)
	    return this.customToHtml();
	var html = [];
	var count = 0;
	var hasContents = [];
	for (var i = 0; i < this.c$.length; i++) {
	    var c = this.c$[i];
	    if (this.layout.inFlow(c) ) {
		hasContents[i] = c.toHtml != wm.Control.prototype.toHtml;
		if (hasContents[i] && c.customToHtml != c.constructor.prototype.customToHtml) {
		    var testContent = c.toHtml(inWidth);
		    if (testContent === "" || testContent === undefined || testContent === null)
			hasContents[i] = false;
		}
		if (hasContents[i]) {
		    count++;
		}
	    }
	}


	if (this.layoutKind == "top-to-bottom" || count <= 1) {
	    html.push("<div id='" + this.domNode.id + "' class='wmPanelTopToBottom'>");
	    for (var i = 0; i < this.c$.length; i++) {
		if (hasContents[i]) {
		    var h = this.c$[i].toHtml(inWidth);
		    if (h) {
			var style = "";//"style='margin: " + this.margin + ";padding: " + this.padding + ";'";
			var classes = (this.c$[i]._classes && this.c$[i]._classes.domNode ? this.c$[i]._classes.domNode : []);
			classes = dojo.filter(classes, function(inClass) {return inClass.indexOf("wm_Font") == 0 || inClass.indexOf("wm_Text") == 0;});
			classes = classes.join(" ");
			html.push("<div id='" + this.c$[i].domNode.id + "_Outer' " + style + " class='" + classes + "'>" + h + "</div>");
		    }
		}
	    }
	} else {
	    var remainingWidth = inWidth-4; // things start wrapping if we don't have at least 4 extra px space
	    var totalPercent = 0;
	    var widths = [];
	    for (var i = 0; i < this.c$.length; i++) {
		if (hasContents[i]) {
		    var c = this.c$[i];
		    if (!c._percEx.w) {
			widths[i] = c.bounds.w;
			remainingWidth -= c.bounds.w;
		    } else {
			totalPercent += c._percEx.w;
		    }
		}
	    }
	    for (var i = 0; i < this.c$.length; i++) {
		if (hasContents[i]) {
		    var c = this.c$[i];
		    if (c._percEx.w) {
			var width = c._percEx.w/totalPercent * remainingWidth;
			widths[i] = width;
		    }
		}
	    }
	    html.push("<div id='" + this.domNode.id + "' class='wmPanelLeftToRight'>");
	    for (var i = 0; i < this.c$.length; i++) {
		var h = this.c$[i].toHtml(widths[i])
		if (h) {
		    var style = ""; //"style='margin-top: " + this.marginExtents.t + "px;margin-bottom: " + this.marginExtents.b + "px;padding-top: " + this.paddingExtents.t + "px;padding-bottom: " + this.paddingExtents.b + "px;'";
		    var classes = (this.c$[i]._classes && this.c$[i]._classes.domNode ? this.c$[i]._classes.domNode : []);
		    classes = dojo.filter(classes, function(inClass) {return inClass.indexOf("wm_Font") == 0 || inClass.indexOf("wm_Text") == 0;});
		    classes = classes.join(" ");
		    html.push("<div id='" + this.c$[i].domNode.id + "_Outer' style='width:" + widths[i] + "px;' " + style + " class='"+classes+"'>" + h + "</div>");
		}
	    }	    
	}
	html.push("</div>");
	return html.join("");
    }
});

wm.Container.delayedReflowWidgets = {};
wm.Container._delayedReflowWidgetsId = 0;
wm.Container.runDelayedReflow = function() {
    var widgets = wm.Container.delayedReflowWidgets;
    wm.Container.delayedReflowWidgets = {};
    wm.Container._delayedReflowWidgetsId = 0;
    wm.forEachProperty(widgets, function(widget,widgetId) {
	if (!widget.isDestroyed)
	    widget.reflow();
    });
};