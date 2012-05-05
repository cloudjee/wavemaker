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

dojo.provide("wm.base.widget.Layout");

dojo.declare("wm.Layout", wm.Container, {
    mobileFoldingType: "wm.TabLayers",
	// useful properties
	classNames: 'wmlayout',
        autoScroll: true,
	fit: false,
	width: "100%",
	height: "100%",
        _mobileFolded: false,
	create: function() {
		this.inherited(arguments);
	},
	build: function() {
		this.inherited(arguments);
		this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
	},
	init: function() {
	    if (this.isDesignLoaded() && this.owner == studio.page) {
		this.parent = studio.designer;
	    } else if (this.owner && this.owner.owner instanceof wm.PageContainer) { // this is false within the ThemeDesigner
		this.parent = this.owner.owner;
	    }
	    this.inherited(arguments);
	    this.subscribe("deviceSizeRecalc", this, "resize");
	},
    postInit: function() {
	this.inherited(arguments);
	if (app.appRoot.deviceSize == "tiny" || app.appRoot.deviceSize == "300") {
	    this.foldUI();
	}
    },
    resize: function() {
	if (app.appRoot.deviceSize == "tiny" || app.appRoot.deviceSize == "300") {
	    if (!this._mobileFolded) {
		this.foldUI();
	    }
	} else if (this._mobileFolded) {
	    this.unfoldUI();
	}
    },
    foldUI: function() {
	if (!this.owner.enableMobileFolding) return;
	this._mobileFolded = true;
	    var parentLayers;
	    var layers = [];
	    var hasMobileFolding = false;
	    wm.forEachWidget(this, function(w) {
		if (w._mobileFoldingParent) {
		    ;
		} else if (w.mobileFolding) {
		    layers.push(w);
		    w._mobileFoldingParentIndex = w.parent.indexOfControl(w);
		    hasMobileFolding = true;
		} else if (w.isMobileFoldingParent && !parentLayers) {
		    parentLayers = w;
		}
	    }, true);
	if (!parentLayers) parentLayers = this;
	    if (layers.length > 1 || parentLayers instanceof wm.Layers && parentLayers.layers.length >= 1 && layers.length >= 1) {
		var currentLayer;
		if (!parentLayers.showing) {
		    parentLayers.setShowing(true);
		}
		if (parentLayers instanceof wm.Layers == false) {
		    var ctor = dojo.getObject(this.mobileFoldingType) || wm.TabLayers;
		    this.mobileFoldingLayers = new ctor({owner:  this.owner,
					      parent: parentLayers,
					      name:   "_mobileLayers",
					      width:  "100%",
					      height: "100%"});
		    this.mobileFoldingLayers.setIndexInParent(0);
		    parentLayers = this.mobileFoldingLayers;
		} else {
		    this.owner._mobileLayers = parentLayers;
		    parentLayers.setIndexInParent(layers[0].getIndexInParent());
		}
		var animation = parentLayers.transition;
		parentLayers.transition = "none";
		parentLayers._cupdating = true;
		layers = layers.sort(function(a,b) { 
		    if (a.mobileFoldingIndex === b.mobileFoldingIndex ||
			a.mobileFoldingIndex > b.mobileFoldingIndex)
			return 1;
		    else 
			return -1;
		});

		//var generatedTabs = [];
		for (var i = 0; i < layers.length; i++) {
		    layers[i]._mobileFoldingParent = layers[i].parent;

		    if (layers[i] instanceof wm.Layer == false) {
			layers[i]._mobileFoldingWidth = layers[i].width;
			layers[i]._mobileFoldingHeight = layers[i].height;
/*
			var currentParentLayers;

			// If its already in a layer, we can't just rip it out of that Layers, nor can we leave it alone because
			// presumably there are multiple panels in this Layers that need folding.  So see if this Layers has
			// a mobileLayer generated for it, and if not, generate one
			var ancestorLayers = layers[i].isAncestorInstanceOf(wm.Layer);
			if (ancestorLayers && ancestorLayers.owner == this.owner && ancestorLayers.parent != parentLayers) {
			    if (ancestorLayers._mobileLayer) {
				currentParentLayers = ancestorLayers._mobileLayer;
			    } else {
				currentParentLayers = ancestorLayers._mobileLayer = new wm.TabLayers({owner: ancestorLayers,
												      parent: ancestorLayers,
												      name: "_mobileLayers",
												      _generatedTabs: true,
												      width: "100%",
												      height: "100%"});
				generatedTabs.push(currentParentLayers);
			    }
			} else {
			    currentParentLayers = parentLayers;
			}

			var l = currentParentLayers.addLayer(layers[i].mobileFoldingCaption,true);
			*/
			var l = parentLayers.addLayer(layers[i].mobileFoldingCaption,true);
			layers[i].setParent(l);
			layers[i].setWidth("100%");
			layers[i].setHeight("100%");
			l._mobileFoldingGenerated = true;			
		    } else if (layers[i].parent != parentLayers) {/*currentParentLayers) {*/
			var l = layers[i];
			layers[i].setParent(parentLayers);//currentParentLayers);
		    } else {
			var l = layers[i];
		    }

		    if (String(layers[i].mobileFoldingIndex).length) {
			//currentParentLayers.moveLayerIndex(currentParentLayers.layers[currentParentLayers.layers.length-1], Number(layers[i].mobileFoldingIndex));
			parentLayers.moveLayerIndex(parentLayers.layers[parentLayers.layers.length-1], Number(layers[i].mobileFoldingIndex));
			if (layers[i].active)
			    //currentParentLayers.layerIndex = layers[i].getIndex();
			    parentLayers.layerIndex = layers[i].getIndex();
		    }
		}

		parentLayers._cupdating = false;
		if (currentLayer) {
		    currentLayer.activate();
		} else {
		    parentLayers.setLayerIndex(0);
		}
/*
		for (var i = 0; i < generatedTabs.length; i++) {
		    generatedTabs[i].setLayerIndex(0);
		}
		*/
		parentLayers.transition = animation;

		if (this.mobileFoldingLayers) {
		    for (var i = 1; i < this.c$.length; i++) {
			var c = this.c$[i];
			if (c.showing) {
			    c.hide();
			    c._mobileFoldingShowing = true;
			}
		    }
		}
	    }
	wm.fire(this.owner,"onMobileFolding");
    },
    unfoldUI: function() {
	if (!this.owner.enableMobileFolding) return;
	    this._mobileFolded = false;

	if (this.mobileFoldingLayers) {
	    for (var i = 1; i < this.c$.length; i++) {
		var c = this.c$[i];
		if (c._mobileFoldingShowing) {
		    c.setShowing(true);
		    delete c._mobileFoldingShowing;
		}
	    }
	}
	var generatedTabs = [];
	    wm.forEachWidget(this, function(w) {
		if (w._mobileFoldingParent) {
		    if (w.parent != w._mobileFoldingParent) {
			w.setParent(w._mobileFoldingParent);
		    }
		    if (w instanceof wm.Layer) {
			w.parent.setLayerIndex(w,w._mobileFoldingParentIndex);
		    } else {
			w.parent.moveControl(w,w._mobileFoldingParentIndex);
		    }
		    if (w._mobileFoldingWidth) {
			w.setWidth(w._mobileFoldingWidth);
			w.setHeight(w._mobileFoldingHeight);
		    }
		    delete w._mobileFoldingParent;
		    delete w._mobileFoldingParentIndex;
		}
		if (w._mobileFoldingGenerated) {
		    generatedTabs.push(w);
		}
	    }, true);	
	var newLayerIndex;
	var layers;
	dojo.forEach(generatedTabs, function(w) {
	    w._cupdating = true;
	    if (!layers) {
		layers = w.parent;
		newLayerIndex = layers.layerIndex;
	    }
	    if (w.getIndex() >= w.parent.layerIndex)
		newLayerIndex--;
	    w.destroy();
	    w._cupdating = false;
	});

	if (this.mobileFoldingLayers) {
	    this.mobileFoldingLayers.destroy();
	    delete this.mobileFoldingLayers;
	}
	delete this.owner._mobileLayers;

	if (layers && !layers.isDestroyed) layers.setLayerIndex(Math.max(0,newLayerIndex));

	wm.fire(this.owner,"onMobileUnfolding");
    },
	updateBounds: function() {
	    this._percEx = {w:100, h: 100};
	    this.setBounds(this.parent.getContentBounds());
	},
	reflow: function() {
	        if (this._cupdating || this.isDestroyed)
			return;
	        this.updateBounds();
		this.renderBounds();
		//this.fitTo();
		this.inherited(arguments);
		//wm.layout.box.reflow(this.domNode);
	}/*,
	canResize: function() {
		return false;
	}*/
});

wm.LayoutBox = wm.Layout;
