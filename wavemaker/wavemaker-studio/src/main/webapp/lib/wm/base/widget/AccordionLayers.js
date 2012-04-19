/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.base.widget.AccordionLayers");
dojo.require("wm.base.widget.Layers");

dojo.declare("wm.AccordionLayers", wm.Layers, {
    multiActive: false,
    themeStyleType: "ContentPanel",
    layersType: 'Accordion',
    layerBorder: 1,
    captionHeight: 26, // used by decorator
    dndTargetName: "",
    postInit: function() {
        this.inherited(arguments);
        this.setLayerBorder(this.layerBorder);
    },
    setCaptionHeight: function(inHeight) {
	this.captionHeight = inHeight;
        for (var i = 0; i < this.layers.length; i++) {
	    this.layers[i].header.setHeight(inHeight + "px");
	}
	
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
    addLayer: function(inCaption, doNotSelect) {
        var result = this.inherited(arguments);
        result.setBorder(this.layerBorder);
        result.setBorderColor(this.clientBorderColor);
	return result;
    }
});
