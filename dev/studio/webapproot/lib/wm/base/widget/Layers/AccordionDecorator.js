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
dojo.provide("wm.base.widget.Layers.AccordionDecorator");
dojo.require("wm.base.widget.Layers.Decorator");

dojo.declare("wm.AccordionDecorator", wm.LayersDecorator, {
	decorationClass: "wmaccordion",
        captionBorder: 0,
        captionBorderColor: "",
	decorateLayer: function(inLayer, inIndex) {
		this.inherited(arguments);
		this.createHeader(inLayer, inIndex);
	},
	createHeader: function(inLayer, inIndex) {
                var captionHeight = inLayer.parent.captionHeight;
		var p = this.decoree.client;
		var h = inLayer.header = new wm.Label({
		    caption: inLayer.caption + "<span class='accordionArrowNode'></span>",
		        margin: "0,0,2,0",
		        height: captionHeight + "px",
                        padding: "4,4,0,4",
			_classes: {domNode: ["wmaccordion-header"]},
			showing: inLayer.showing,
			parent: p,
		        owner: p,
		        border: this.captionBorder,
		        borderColor: this.captionBorderColor
		});
		p.moveControl(h, inIndex*2);
		dojo.addClass(inLayer.domNode, "wmaccordion-content");
		this.decoree.connect(h.domNode, 'onclick', dojo.hitch(this, "headerClicked", inLayer));
	},
	headerClicked: function(inLayer, e) {
		var d = this.decoree;
		// prevent designer click
		if (d.isDesignLoaded())
			dojo.stopEvent(e);
		d.setProp(inLayer.active && d.multiActive ? "layerInactive" : "layer", inLayer);
	},
	getNewLayerIndex: function(inLayer) {
		for (var i=0, layers=this.decoree.layers, l; (l=layers[i]); i++)
			if (l != inLayer && l.active)
				return i;
	},
	deactivateLayer: function(inLayer) {
		var newIndex = this.getNewLayerIndex(inLayer);
		if (newIndex != undefined) {
			this.setLayerActive(inLayer, false);
			var d = this.decoree;
			d.layerIndex = newIndex;
			d.reflow();
		}
	},
	activateLayer: function(inLayer) {
		var d = this.decoree;
		if (d.multiActive && !d._loading) {
			this.setLayerActive(inLayer, true);
			d.reflow();
		} else
			this.inherited(arguments);
	},

	undecorateLayer: function(inLayer, inIndex) {
		inLayer.header.destroy();
		dojo.removeClass(inLayer.domNode, 'wmaccordion-content');
	},
	setLayerShowing: function(inLayer, inShowing) {
		inLayer.header.setShowing(inShowing);
		this.inherited(arguments);
	},
	setLayerActive: function(inLayer, inShowing) {
		dojo[inShowing ? 'removeClass' : 'addClass'](inLayer.header.domNode, 'wmaccordion-collapsed');
		this.inherited(arguments);
	},
	applyLayerCaption: function(inLayer) {
	    inLayer.header.setCaption(inLayer.caption +  "<span class='accordionArrowNode'></span>");
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
		var d = this.decoree, client = d.client, l = d.getLayer(inFromIndex);
		client.removeControl(l);
		client.removeControl(l.header);
		client.insertControl(l.header, inFromIndex*2);
		client.insertControl(l, inFromIndex*2 + 1);
	}
});
