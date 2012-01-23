/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
	// useful properties
	classNames: 'wmlayout',
        autoScroll: true,
	fit: false,
	width: "",
	height: "",
        touchScrolling: true,
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
	    this._mobileFolded = true;
	    var parentLayers;
	    var layers = [];
	    var hasMobileFolding = false;
	    wm.forEachWidget(this, function(w) {
		if (w._mobileFoldingParent) {
		    ;
		} else if (w.mobileFolding) {
		    layers.push(w);
		    hasMobileFolding = true;
		} else if (w instanceof wm.Layers && !parentLayers) {
		    parentLayers = w;
		}
	    }, true);
	    if (layers.length) {		
		var currentLayer;
		if (parentLayers) {
		    if (parentLayers.showing) {
			parentLayers.setShowing(true);
		    }
		    currentLayer = parentLayers.layerIndex > 0 ? parentLayers.getActiveLayer() : null;
		} else {
		    parentLayers = new wm.TabLayers({owner: this.owner,
						  parent: layers[0].parent,
						  name: "_mobileLayers",
						  width: layers[0].width,
						  height:layers[0].height});
		    this.owner._mobileLayers = parentLayers;
		    parentLayers.parent.moveControl(parentLayers, parentLayers.parent.indexOfControl(layers[0]));
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
		var generatedTabs = [];
		for (var i = 0; i < layers.length; i++) {
		    layers[i]._mobileFoldingParent = layers[i].parent;
		    layers[i]._mobileFoldingParentIndex = layers[i].parent.indexOfControl(layers[i]);
		    if (layers[i] instanceof wm.Layer == false) {
			layers[i]._mobileFoldingWidth = layers[i].width;
			layers[i]._mobileFoldingHeight = layers[i].height;
			var currentParentLayers;
			// If its already in a layer, we can't just rip it out of that Layers, nor can we leave it alone because
			// presumably there are multiple panels in this Layers that need folding.  So see if this Layers has
			// a mobileLayer generated for it, and if not, generate one
			var ancestorLayers = layers[i].isAncestorInstanceOf(wm.Layer);
			if (ancestorLayers) {
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
			layers[i].setParent(l);
			layers[i].setWidth("100%");
			layers[i].setHeight("100%");
			l._mobileFoldingGenerated = true;			
		    } else if (layers[i].parent != currentParentLayers) {
			var l = layers[i];
			layers[i].setParent(currentParentLayers);
		    } else {
			var l = layers[i];
		    }

		    if (String(layers[i].mobileFoldingIndex).length) {
			currentParentLayers.moveLayerIndex(currentParentLayers.layers[currentParentLayers.layers.length-1], Number(layers[i].mobileFoldingIndex));
			if (layers[i].active)
			    currentParentLayers.layerIndex = layers[i].getIndex();
		    }
		}
		if (parentLayers.layers.length == 0) parentLayers.destroy();
		parentLayers._cupdating = false;
		if (currentLayer) {
		    currentLayer.activate();
		} else {
		    parentLayers.setLayerIndex(0);
		}
		for (var i = 0; i < generatedTabs.length; i++) {
		    generatedTabs[i].setLayerIndex(0);
		}
		parentLayers.transition = animation;

	    }
	wm.fire(this.owner,"onMobileFolding");
	},
    unfoldUI: function() {
	    this._mobileFolded = false;

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
	    }, true);	
	var newLayerIndex;
	var layers;
	var generatedTabs = [];
	    wm.forEachWidget(this, function(w) {
		if (w._mobileFoldingGenerated) {
		    w._cupdating = true;
		    if (!layers) {
			layers = w.parent;
			newLayerIndex = layers.layerIndex;
		    }
		    if (w.getIndex() >= w.parent.layerIndex)
			newLayerIndex--;
		    w.destroy();
		    w._cupdating = false;
		} else if (w._generatedTabs) {
		    generatedTabs.push(w);
		}
	    }, true);
	if (this.owner._mobileLayers) {	    
	    this.owner._mobileLayers.destroy();
	    delete this.owner._mobileLayers;
	}
	dojo.forEach(generatedTabs, function(t) {
	    delete t.parent._mobileLayer;
	    t.destroy();
	});
	if (layers) layers.setLayerIndex(Math.max(0,newLayerIndex));

	wm.fire(this.owner,"onMobileUnfolding");
    },
	updateBounds: function() {
	    this._percEx = {w:100, h: 100};
	    this.setBounds(this.parent.getContentBounds());
	},
	reflow: function() {
		if (this._cupdating)
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
