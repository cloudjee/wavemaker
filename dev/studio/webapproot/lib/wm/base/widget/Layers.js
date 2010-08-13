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
dojo.provide("wm.base.widget.Layers");
dojo.require("wm.base.widget.Container");
dojo.require("wm.base.widget.Layers.Decorator");
dojo.require("wm.base.widget.Layers.TabsDecorator");
dojo.require("wm.base.widget.Layers.AccordionDecorator");

dojo.declare("wm.Layer", wm.Container, {
	height: "100%",
	width: "100%",
	caption: "",
	layoutKind: "top-to-bottom",
	moveable: false,
	_requiredParent: "wm.Layers",
        transition: "none",
	destroy: function() {
		//console.info('layer destroy called');
		if (this.parent)
			this.parent.setCaptionMapLayer(this.caption, null);
		this.inherited(arguments);
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
	}
});

dojo.declare("wm.Layers", wm.Container, {
        clientBorder: "",
        clientBorderColor: "",
	layerIndex: -1,
	defaultLayer: -1,
	multiActive: false,
	decoratorClass: wm.LayersDecorator,
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
		if (!this.isRelativePositioned)
			dojo.addClass(this.domNode, "wmlayers");
		else
			this.setHeaderHeight('20px');
            // vertical defaults to justified; once we get rid of justified, we can remove this property
	    this.client = new wm.Panel({isRelativePositioned:this.isRelativePositioned, border: this.clientBorder, borderColor: this.clientBorderColor, name: "client", parent: this, owner: this, height: "100%", width: "100%",  flags: {notInspectable: true}});
		this.inherited(arguments);
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
			return o.createComponent(defName, "wm.Layer", props);
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
            if (this.client) this.client.setBorder(inBorder);
        },
        setClientBorderColor: function(inBorderColor) {
            this.clientBorderColor = inBorderColor;
            if (this.client) this.client.setBorderColor(inBorderColor);
        },    
	// public api for adding a layer
	addLayer: function(inCaption) {
		var pg = this.createLayer(inCaption);
		this._setLayerIndex(this.getCount()-1);
		return pg;
	},
	// called by owner automatically.
	addWidget: function(inWidget) {
		if (inWidget instanceof wm.Layer) {
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
		if (inWidget instanceof wm.Layer) {
			var i = this.indexOfLayer(inWidget);
			this.layers.splice(i, 1);
			this.setCaptionMapLayer(inWidget.caption, null);
			this.decorator.undecorateLayer(inWidget, i);
			this.client.removeWidget(inWidget);
			this.setLayerIndex(0);
		} else {
			this.inherited(arguments);
		}
	},
	addControl: function(inControl) {
		if (inControl.owner == this) {
			this.inherited(arguments);
		} else if (inControl instanceof wm.Layer) {
			this.client.addControl(inControl);
		}
	},
	removeControl: function(inControl) {
		if (inControl.owner == this) {
			this.inherited(arguments);
		} else if (inControl instanceof wm.Layer) {
			this.client.removeControl(inControl);
		}
	},
	isWidgetTypeAllowed: function(inChildType) {
		return inChildType == "wm.Layer";
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
		if (inNameOrLayer instanceof wm.Layer)
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
		var ctor = wm[inLayersType + 'Decorator'];
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


dojo.declare("wm.TabLayers", wm.Layers, {
        useDesignBorder: 0,
       themeStyleType: "ContentPanel",
       layersType: 'Tabs'/*,
	   afterPaletteDrop: function(){
	   	this.inherited(arguments);
	   	this.setLayersType("RoundedTabs");
	   }		*/
});

dojo.declare("wm.AccordionLayers", wm.Layers, {
    themeStyleType: "ContentPanel",
    layersType: 'Accordion',
    layerBorder: 1,
    captionHeight: 26, // used by decorator
    postInit: function() {
        this.inherited(arguments);
        this.setLayerBorder(this.layerBorder);
    },
    setBorderColor: function(inColor) {
	this.inherited(arguments);
        for (var i = 0; i < this.layers.length; i++) {
	    this.layers[i].setBorderColor(this.borderColor);
	}
    },
    setLayerBorder: function(inBorder) {
        this.layerBorder = inBorder;
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].setBorder(this.layerBorder);
	    this.layers[i].setBorderColor(this.borderColor);
	}
    },
    addLayer: function() {
        this.inherited(arguments);
        this.setLayerBorder(this.layerBorder);
    }
});


/************************************************************************
 * FEATURES:
 * 1. Next/previous button built in to get user to next/previous step of wizard (or next/previous card)
 * 2. Turns tabs into breadcrumbs
 * 3. Manages state and clickability of each breadcrumb
 * 4. Manages carriage return, maps it to Next button.
 * 5. Autofocus on any invalid or missing required field and refuses to go to next step
 * 6. Autofocus on first editor after going to next step
 * 7. Introduces animated layer transitions
 * 8. The entire wizard comes with two events that fire if the user backs out of the wizard, or hits next after the wizard is complete (onCancelClick, onDoneClick)
 * 9. Added the ability to auto focus on a widget that fails validation or is required.
 * 10. Added animated transitions
 * 11. Custom validators per layer
 */
dojo.declare("wm.WizardLayers", wm.Layers, {
    themeStyleType: "ContentPanel",
    layersType: 'Wizard',
    transition: "fade",
        useDesignBorder: 0,
    init: function() {
	this.inherited(arguments);
	this.decorator.addFooter();
	this.connect(this.domNode, "keydown", this, "keydown");
    },
    keydown: function(e) {
	var keyCode = e.keyCode;
	if (e.keyCode == dojo.keys.ENTER || e.keyCode == dojo.keys.NUMPAD_ENTER) {
	    this.decorator.nextClick();
	    dojo.stopEvent(e);
	    return false;
	}
	return true;
    },
    onCancelClick: function(inSender) {

    },
    onDoneClick: function(inSender) {

    },
    /* This should really be an event of wm.Layer, but we should first discuss whether we want form
     * validation to be build into wm.Layer */
    onLayerValidation: function(inLayer, outResult) {

    }
});


