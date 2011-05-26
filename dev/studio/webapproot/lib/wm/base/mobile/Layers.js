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
dojo.provide("wm.base.mobile.Layers");
dojo.require("wm.base.mobile.Container");
dojo.require("wm.base.mobile.Layers.Decorator");
dojo.require("wm.base.mobile.Layers.TabsDecorator");

dojo.declare("wm.mobile.Layer", wm.mobile.Container, {
	height: "100%",
	width: "100%",
	caption: "",
        iconUrl: "", // only for Layers inside of Tabs
	layoutKind: "top-to-bottom",
	moveable: false,
	_requiredParent: "wm.mobile.Layers",
        touchScrolling: true,
	destroy: function() {
		//console.info('layer destroy called');
	    var parent = this.parent;
	    if (parent) 
		parent.setCaptionMapLayer(this.caption, null);	    
	    this.inherited(arguments);
	    if (parent && parent.conditionalTabButtons)
		parent.decorator.tabsControl.setShowing(parent.layers.length > 1);
	},
	init: function() {
		this.inherited(arguments);
		// bc
		if (this.title) {
			this.caption = this.title;
			delete this.title;
		}
		this.setCaption(this.caption);
		if (!this.isRelativePositioned)
			dojo.addClass(this.domNode, "wmlayer");
            this.setBorder(this.parent.clientBorder);
            this.setBorderColor(this.parent.clientBorderColor);
            this.domNode.addEventListener( 'webkitAnimationEnd', dojo.hitch(this, "animationEnd"), false);	    
	},
        animationEnd: function(inEvent) {
	    var animation = inEvent ? inEvent.animationName : ""
	    this.domNode.style.display = this.active ? "" : "none";
	    console.log("DOM2 " + this.toString() + this.domNode.style.display);
	},
	// FIXME: override so that we do not remove and re-add layer
	// this is nasty but avoids dealing with layer order changing
	setName: function(inName) {
		if (this.parent)
			delete this.parent.widgets[this.name];
		this.addRemoveDefaultCssClass(false);
		wm.Component.prototype.setName.apply(this, arguments);
		if (this.parent)
			this.parent.widgets[this.name] = this;
		this.addRemoveDefaultCssClass(true);
	},
	activate: function() {
		var p = this.parent;
		if (p && this.showing && !this.isActive())
			p.setLayer(this);
	    if (this._obscure)
		this.unobscure();
	},
        obscure: function() {
	    if (this._obscure)
		return;
	    this._obscure = true;
	    if (!this._obscureNode) {
		var n = this._obscureNode = document.createElement("div");
		n.className = "ObscureLayer";
		this.domNode.appendChild(n);
		n.innerHTML = "<div class='ObscureCaption'>" + this.caption + "</div>";
	    }
	    dojo.addClass(this._obscureNode, "Showing");
	},
        unobscure: function() {
	    if (this._obscureNode)
		dojo.removeClass(this._obscureNode, "Showing");
	},
        update: function() { // called if you set the event handler to be a layer
	    this.activate();
	},
	isActive: function() {
		return this.active;
	},
	setShowing: function(inShowing) {
		if (!this.canChangeShowing())
			return;
		if (this.showing != inShowing) {
			this.showing = inShowing;
			this.decorator.setLayerShowing(this, inShowing);
			var p = this.parent;
			if (!inShowing && p.layerIndex == this.getIndex()) {
				p.setNext();
			}
		}
	},
        show: function() {
	    this.setShowing(true);
	},
        hide: function() {
	    this.setShowing(false);
	},
	setCaption: function(inCaption) {
		this.caption = inCaption;
		if (this.parent)
			this.parent.setCaptionMapLayer(inCaption, this);
		this.decorator.applyLayerCaption(this);
	},
	getIndex: function() {
		var p = this.parent;
		return p && p.indexOfLayer(this);
	},
	// fired by Layers
	onShow: function() {
		// FIXME: remove _onShowParent when no longer used (e.g. PageContainer)
		wm.forEachProperty(this.widgets, function(w) {
			wm.fire(w, "_onShowParent");
		})
	},
    /* Only valid for layers within a TabLayers */
       setClosable: function(isClosable) {
	   this.closable = isClosable;
	   this.decorator.applyLayerCaption(this);
       },
       setDestroyable: function(isClosable) {
	   this.destroyable = isClosable;
	   this.decorator.applyLayerCaption(this);
       },
       buildCssSetterObj: function() {
	   var cssObj = this.inherited(arguments);
	   cssObj.borderStyle = "ridge";
	   return cssObj;
       }
});

dojo.declare("wm.mobile.Layers", wm.mobile.Container, {
        transition: "fade",
        clientBorder: "",
        clientBorderColor: "",
	layerIndex: -1,
	defaultLayer: -1,
	decoratorClass: wm.mobile.LayersDecorator,
	layersType: 'Layers',
	layoutKind: "top-to-bottom",
	height: "100%",
	width: "100%",
	destroy: function() {
		//console.info('LAYERS destroy called');
		this.inherited(arguments);
		if (this.decorator) 
		{
			this.decorator.destroy();
			this.decorator = null;
		}
		
		this.layers = null;
		this.captionMap = null;
		this.client = null;
	},
	prepare: function() {
		this.layers = [];
		this.captionMap =[];
		this.inherited(arguments);
	},
	build: function() {
		this.inherited(arguments);
		this.setLayersType(this.layersType);
	},
	init: function() {
	    this.userDefHeaderHeight = this.headerHeight;
	    if (!this.isRelativePositioned)
		dojo.addClass(this.domNode, "wmlayers");
	    else
		this.setHeaderHeight('20px');
            // vertical defaults to justified; once we get rid of justified, we can remove this property
	    this.client = new wm.mobile.Panel({isRelativePositioned:this.isRelativePositioned, border: 0, name: "client", parent: this, owner: this, height: "100%", width: "100%",  flags: {notInspectable: true, bindInspectable: true}}); // bindInspectable means the user can see it as a container to open in the bind inspector 
	    this.inherited(arguments);
            this._isDesign = this.isDesignLoaded();
	    if (this._isDesign) {
		this.flags.noModelDrop = true;
	    } else {
		this.connectToAllLayers(this.parent, dojo.hitch(this, function() {
		    this._fireLayerOnShow();
		}));

	    }

	    
	},
	postInit: function() {
		this.inherited(arguments);
		if (!this.getCount())
			this.addLayer();
		this._initDefaultLayer();
		// fire onshow when loaded
		if (wm.widgetIsShowing(this))
			this._fireLayerOnShow();
	},
        afterPaletteDrop: function(){
	    this.inherited(arguments);
	    this.setClientBorder(this.clientBorder);
	    this.setClientBorderColor(this.clientBorderColor);
	},
	_initDefaultLayer: function() {
		var d = this.defaultLayer;
		d = d != -1 ? d : 0;
		var dl = this.getLayer(d);
		// call private index setter so we avoid canShow; however, honor showing property
		if (dl && !dl.showing) {
			d = this._getPrevNextShownIndex(d);
			dl = this.getLayer(d);
		}
		if (dl)
			this._setLayerIndex(dl.getIndex());
	},
	createLayer: function(inCaption) {
		var
			defName = this.owner.getUniqueName(inCaption || "layer1"),
	    props = {width: "100%", height: "100%", caption: defName, parent: this, horizontalAlign: "left", verticalAlign: "top", themeStyleType: this.themeStyleType},
			o = this.getRoot();
		if (o)
			return o.createComponent(defName, "wm.mobile.Layer", props);
	},
        themeStyleType: "",
        setThemeStyleType: function(inMajor) {
	    this.themeStyleType = inMajor;
            for (var i = 0; i < this.layers.length; i++) {
	        this.layers[i].setThemeStyleType(inMajor);
            }
	},

        setClientBorder: function(inBorder) {
            this.clientBorder = inBorder;
	    // in design mode, set_border updates the design borders
	    var method = this.isDesignLoaded() ? "set_border" : "setBorder";
            for (var i = 0; i < this.layers.length; i++) {
		this.layers[i][method](inBorder);
	    }
        },
        setClientBorderColor: function(inBorderColor) {
            this.clientBorderColor = inBorderColor;
            for (var i = 0; i < this.layers.length; i++)
                this.layers[i].setBorderColor(inBorderColor);
        },    
	// public api for adding a layer
	addLayer: function(inCaption) {
		var pg = this.createLayer(inCaption);
		this._setLayerIndex(this.getCount()-1);
		return pg;
	},
	// called by owner automatically.
	addWidget: function(inWidget) {
		if (inWidget instanceof wm.mobile.Layer) {
			this.client.addWidget(inWidget);
			this.layers.push(inWidget);
			this.setCaptionMapLayer(inWidget.caption, inWidget);
			if (this.decorator) {
				this.decorator.decorateLayer(inWidget, this.getCount()-1);
				// de-activate layer by default
				this.decorator.setLayerActive(inWidget, false);
			}
		} else {
			this.inherited(arguments);
		}
	},
	removeWidget: function(inWidget) {
		if (inWidget instanceof wm.mobile.Layer) {
			var i = this.indexOfLayer(inWidget);
			this.layers.splice(i, 1);
			this.setCaptionMapLayer(inWidget.caption, null);
			this.decorator.undecorateLayer(inWidget, i);
			this.client.removeWidget(inWidget);
		    var found = false;
		    for (j = 0; j < this.layers.length; j++) {
			if (this.layers[j].active) {
			    this.layerIndex = j;
			    found = true;
			}
		    }
		    if (!found)
			this.setLayerIndex(this.layers.length == 0 ? -1 : (i > 0 ? i - 1 : 0));
		} else {
			this.inherited(arguments);
		}
	},
	addControl: function(inControl) {
		if (inControl.owner == this) {
			this.inherited(arguments);
		} else if (inControl instanceof wm.mobile.Layer) {
			this.client.addControl(inControl);
		}
	},
	removeControl: function(inControl) {
		if (inControl.owner == this) {
			this.inherited(arguments);
		} else if (inControl instanceof wm.mobile.Layer) {
			this.client.removeControl(inControl);
		}
	},
	isWidgetTypeAllowed: function(inChildType) {
		return inChildType == "wm.mobile.Layer";
	},
	getLayer: function(inIndex) {
		return this.layers[inIndex != undefined ? inIndex : this.layerIndex];
	},
	getActiveLayer: function() {
	  if (this.layerIndex != -1) return this.layers[this.layerIndex];
	  var defaultIndex = (this.defaultLayer == -1) ? 0 : this.defaultLayer;
	  return this.layers[defaultIndex];
	},
	// public api for removing a layer
	removeLayer: function(inIndex) {
		if (!this.layers)
			return;
		var p = this.getLayer(inIndex);
		if (p)
			this.removeWidget(p);
	},
	indexOfLayer: function(inLayer) {
		for (var i=0, l; (l=this.getLayer(i)); i++)
			if (l == inLayer)
				return i;
		return -1;
	},
	indexOfLayerName: function(inLayerName) {
		for (var i=0, l; (l=this.getLayer(i)); i++)
			if (l.name == inLayerName)
				return i;
		return -1;
	},
	indexOfLayerCaption: function(inCaption) {
		return this.indexOfLayer(this.captionMap[inCaption]);
	},
	getLayerCaption: function(inIndex) {
		var p = this.getLayer(inIndex);
		return p && p.caption;
	},
	getLayerByCaption: function(inCaption) {
		return this.getLayer(this.indexOfLayerCaption(inCaption));
	},
	setLayerByCaption: function(inCaption) {
		var p = this.captionMap[inCaption];
		this.setLayerByName(p || inCaption);
	},
	setLayerByName: function(inName) {
		var l = this.client.widgets[inName];
		if (l)
			this.setLayer(l);
		else if (inName)
			this.addLayer(inName);
	},
	setLayer: function(inNameOrLayer) {
		if (inNameOrLayer instanceof wm.mobile.Layer)
			// note: use setProp so we can call design version
			this.setProp("layerIndex", inNameOrLayer.getIndex());
		else
			this.setLayerByName(inNameOrLayer);
	},
	setLayerInactive: function(inLayer) {
		wm.fire(inLayer.decorator, "deactivateLayer", [inLayer]);
	},
	setLayerIndex: function(inIndex) {
		if (inIndex == this.layerIndex)
			return;
		var
			fireEvents = !this.loading,
			l = this.getLayer(inIndex);
		if (fireEvents) {
			var info = {newIndex: inIndex, canChange: l && l.showing};
			this.oncanchange(info);
			if (info.canChange === false)
				return;
			inIndex = info.newIndex;
		}
		if (inIndex < 0 || inIndex > this.getCount()-1)
			return;

		this._setLayerIndex(inIndex);
		if (fireEvents) {
			l && l.onShow();
		}
		if (fireEvents && this.lastLayerIndex != this.layerIndex)
			this.onchange(this.layerIndex);
	},
	_setLayerIndex: function(inIndex) {
		this.lastLayerIndex = this.layerIndex;
		this.layerIndex = inIndex;
		var l = this.getLayer(inIndex);
		if (l)
			this.decorator.activateLayer(l);
	    if (document.activeElement.tagName == "INPUT")
		document.activeElement.blur();

	},
	setDecoratorClass: function(inClass) {
		this.decoratorClass = inClass;
		this.createDecorator();
	},
	createDecorator: function() {
		if (this.decorator)
			this.decorator.destroy();
		this.decorator = this.decoratorClass ? new this.decoratorClass(this) : null;
	},
	setLayersType: function(inLayersType) {
		var ctor = wm.mobile[inLayersType + 'Decorator'];
		if (!ctor)
			return;
		this.layersType = inLayersType;
		var i = this.layerIndex;
	    if (this.decorator) {
		this.decorator.undecorate();
		this.decorator.destroy();
		this.decorator = null;
	    }
		this.setDecoratorClass(ctor);
		this.decorator.decorate();
		this._setLayerIndex(i);
		this.reflow();
	},
	setDefaultLayer: function(inLayerIndex) {
		this.defaultLayer = inLayerIndex;
	},
	getCount: function() {
		return this.layers.length;
	},
	setCaptionMapLayer: function(inCaption, inLayer) {
		try
		{
			this.captionMap[inCaption] = inLayer;
		}
		catch(e)
		{
			// do nothing as this might happen when we are trying to destroy all the layers.
		}
	},
	_getPrevNextShownIndex: function(inIndex, inPrev, inBounded) {
		var
			d = inPrev ? -1 : 1,
			c = this.getCount(),
			e = inPrev ? 0 : c-1,
			w = inPrev ? c-1 : 0,
			i = inPrev ? Math.min(inIndex+d, w) : Math.max(inIndex+d, 0),
			l;
		while (i != inIndex) {
			l = this.getLayer(i);
			if (l && l.showing)
				return i;
			if (inPrev ? i > e : i < e)
				i = i + d;
			else {
				if (inBounded)
					return;
				else
					i = w;
			}
		}
	},
	setNext: function(inBounded) {
		var p = this._getPrevNextShownIndex(Number(this.layerIndex), false, inBounded);
		if (p !== undefined)
			this.setLayerIndex(p);
	},
	setPrevious: function(inBounded) {
		var p = this._getPrevNextShownIndex(Number(this.layerIndex), true, inBounded);
		if (p !== undefined)
			this.setLayerIndex(p);
	},
	moveLayerIndex: function(inLayer, inIndex) {
		var i = inLayer.getIndex(), inIndex = Math.max(0, Math.min(inIndex, this.getCount()-1));
		if (i == inIndex)
			return;
		// fixup layers array
		this.layers.splice(i, 1);
		this.layers.splice(inIndex, 0, inLayer);
		// decorate
		this.decorator.moveLayerIndex(i, inIndex);
		// change layer
		this._setLayerIndex(inIndex);
	},
	_fireLayerOnShow: function() {
		var l = this.getLayer(this.layerIndex);
		l && l.onShow();
	},
	_onShowParent: function() {
		this._fireLayerOnShow();
	},
	clear: function() {
		wm.forEach(this.widgets, function(w) {
			w.destroy();
		});
		this.widgets = {};
		this.layers = [];
		this.domNode.innerHTML = "";
	},
	// events
	oncanchange: function(inChangeInfo) {
	},
	onchange: function(inIndex) {
	},
	// used only by Tabs
	headerHeight: "27px",
	setHeaderHeight: function(inHeight) {
		if (this.layersType != 'Tabs' && this.layersType != "RoundedTabs")
			return;
		this.headerHeight = inHeight;
		this.decorator && this.decorator.tabsControl && this.decorator.tabsControl.setHeight(inHeight);

		delete this._lastTabHeight;
		this.renderBounds();

	},
    set_headerHeight: function(inHeight) {
	        this.userDefHeaderHeight = this.headerHeight;
	this.setHeaderHeight(inHeight);
    },
        renderBounds: function() {
	    this.inherited(arguments);
	    if (this.layersType != 'Tabs' && this.layersType != "RoundedTabs")
		return;
	    if (!this.decorator || !this.decorator.tabsControl)
		return;

	    // for purposes of IE6, we need to get the current height, change the style, and then wait
	    // before doing anything
	    if (!this._lastTabHeight)
		this._lastTabHeight = dojo.marginBox(this.decorator.tabsControl.domNode).h;
	    this.decorator.tabsControl.domNode.style.height = 'auto';
	    wm.job(this.getRuntimeId() + ":updateHeaderHeight", 1, dojo.hitch(this, function() {
		try {
		    var newHeight = this.decorator.tabsControl.updateHeaderHeight();
		    if (newHeight != this._lastTabHeight){
			this._lastTabHeight = newHeight;
			if (this.userDefHeaderHeight && parseInt(this.userDefHeaderHeight) + 5 > newHeight)
			    newHeight = parseInt(this.userDefHeaderHeight);
			if (this.isDesignLoaded()) {
			    this.decorator.tabsControl.setHeight(newHeight+ "px");
			} else {
			    this.setHeaderHeight(newHeight+'px');
			    this.reflow();
			}
		    }

		} catch(e) {
		    console.error(e);
		}
	    }));
	},
        getMinHeightProp: function() {
            if (this.minHeight) return this.minHeight;
            var minHeight = 80;
            if (this.layersType.match(/tabs/i)) minHeight += parseInt(this.headerHeight);
            return minHeight;
        },
        getMinWidthProp: function() {
            if (this.minWidth) return this.minWidth;
            var minWidth = 80;
            if (this.layersType.match(/tabs/i)) minWidth += 120; // need horiz space for tabs
            return minWidth;
        }
});


dojo.declare("wm.mobile.TabLayers", wm.mobile.Layers, {
        //useDesignBorder: 0,
    classNames: "mblTabLayers",
       themeStyleType: "ContentPanel",
       layersType: 'Tabs',
       conditionalTabButtons: false,
	addLayer: function(inCaption) {
	    var result = this.inherited(arguments);
	    if (!this._cupdating && !this.owner._loadingPage)
		this.renderBounds();
	    if (this.conditionalTabButtons)
		this.decorator.tabsControl.setShowing(this.layers.length > 1);
	    return result;
	},
	removeLayer: function(inIndex) {
	    this.inherited(arguments);
	    if (this.conditionalTabButtons)
		this.decorator.tabsControl.setShowing(this.layers.length > 1);
	},
    // onClose handles both destroy and close as long as it came from clicking the close icon in the tab button
    onClose: function(inLayer) {

    },
    customClose: function(inLayer) {

    }
/*,
	   afterPaletteDrop: function(){
	   	this.inherited(arguments);
	   	this.setLayersType("RoundedTabs");
	   }		*/
});



dojo.declare("wm.mobile.ToggleLayers", wm.mobile.Layers, {
        //useDesignBorder: 0,
    classNames: "mblToggleLayers",
       themeStyleType: "ContentPanel",
       layersType: 'Toggle'
});


dojo.declare("wm.mobile.SideBySideLayers", wm.mobile.Layers, {
        transition: "slide",
    multiActive: true,
        //useDesignBorder: 0,
    classNames: "mblSideBySideLayers",
       themeStyleType: "ContentPanel",
    layersType: 'SideBySide',
    init: function() {
	this.inherited(arguments);
	this.client.setLayoutKind("left-to-right");
    },
    
    renderBounds: function() {
	this.inherited(arguments);
	var totalWidth = this.getContentBounds().w;
	var standardWidth = totalWidth <= 580 ? totalWidth : 300;
	var minWidth = 260;
	var widthUsed = 0;
	var firstLayer = null;
	var lastLayer = null;
	var wasUpdating = this._cupdating;
	var showingCount = 0;
	this._cupdating = true;

	// Algorithm for deciding what layers to show:
	// 1. Start with the active layer and work backwards; we want to show as much of the past layers as possible; we only HAVE to show
	//    future layers when they become relevant/activated
	// 2. If there is still space left, iterate over each layer AFTER the active layer
	// 3. Whatever the last layer shown is, set its width to 100% to use up all available space

	for (var i = this.layerIndex; i >= 0; i--) {
	    if (widthUsed + standardWidth < totalWidth) {
		firstLayer = this.layers[i];
		this.decorator.setLayerActive(this.layers[i], true);
		showingCount++;
		if (widthUsed + standardWidth + minWidth > totalWidth) {
		    this.layers[i].setWidth("100%");
		} else {
		    this.layers[i].setWidth(standardWidth + "px");
		}
		widthUsed += Math.max(standardWidth,this.layers[i].bounds.w);
		lastLayer = this.layers[i];
	    } else if (widthUsed + minWidth < totalWidth) {
		firstLayer = this.layers[i];
		this.decorator.setLayerActive(this.layers[i], true);
		showingCount++;
		this.layers[i].setWidth("100%");
		widthUsed = totalWidth;
		lastLayer = this.layers[i];
	    } else {
		this.decorator.setLayerActive(this.layers[i], false);
	    }
	}

	for (var i = this.layerIndex+1; i < this.layers.length; i++) {
	    if (widthUsed + standardWidth < totalWidth) {
		this.decorator.setLayerActive(this.layers[i], true);
		this.layers[i].obscure();
		showingCount++;
		if (widthUsed + standardWidth + minWidth > totalWidth) {
		    this.layers[i].setWidth("100%");
		} else {
		    this.layers[i].setWidth(standardWidth + "px");
		}
		widthUsed += this.layers[i].bounds.w;
		lastLayer = this.layers[i];
	    } else if (widthUsed + minWidth < totalWidth) {
		this.decorator.setLayerActive(this.layers[i], true);
		this.layers[i].obscure();
		showingCount++;
		this.layers[i].setWidth("100%");
		widthUsed += this.layers[i].bounds.w;
		lastLayer = this.layers[i];
	    } else {
		this.decorator.setLayerActive(this.layers[i], false);
	    }
	}


	if (lastLayer) {
	    lastLayer.setWidth("100%");
	}

	this._cupdating = wasUpdating;

	if (showingCount == 1) {
	    dojo.forEach(this.layers, function(l) {
		if (l.showing && l.border == "0,3,0,0")
		    l.setBorder("0");
	    });
	} else {
	    var showingCount2 = 0;
	    dojo.forEach(this.layers, function(l) {
		if (l.showing) { 
		    showingCount2++; 
		    if (showingCount2 == showingCount) { // last layer does not need a right border
			if (l.border == "0,3,0,0")
			    l.setBorder("0");
		    } else if (l.border == "0") {
			l.setBorder("0,3,0,0");
			l.setBorderColor("rgb(120,120,120)");
		    }
		}
	    });
	}
	this.showingCount = showingCount;
	this.client.reflow();

	var page = this.getParentPage();
	if (app._page == this.getParentPage()) {
	    if (firstLayer.getIndex() != 0) {
		page.root.showBackButton(dojo.hitch(this, function() {
		    this.setLayerIndex(firstLayer.getIndex()-1);
		}));
	    } else {
		page.root.hideBackButton();
	    }
	}
	if (firstLayer && firstLayer.caption)
	    this.getParentPage().root.setTitle(firstLayer.caption);
    },

    _end: 0
});


if (!wm.studioConfig) {
    wm.Layer = wm.mobile.Layer;
    wm.Layers = wm.mobile.Layers;
}
