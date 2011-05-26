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
dojo.provide("wm.base.mobile.Layers.TabsDecorator");
dojo.require("wm.base.mobile.Layers.Decorator");

dojo.declare("wm.mobile.TabsDecorator", wm.mobile.LayersDecorator, {
	decorationClass: "wmtablayers",
	undecorate: function() {
		this.inherited(arguments);		
	},
    getCaption: function(inLayer) {
	return (inLayer.iconUrl ? "<img src='" + inLayer.iconUrl + "' style='width:29px;height:29px;'/><br/>" : "") + inLayer.caption;
    },
	createTab: function(inCaption, inIndex, inLayer) {
	    if (!this.btns) this.btns = [];
	    var ownerPage = this.decoree.getParentPage();
	    var controlBar = ownerPage.root.getControlBar();
	    if (!controlBar.showing) 
		controlBar.show();

	    if (controlBar.c$.length == 0) {
		var s = new wm.mobile.Spacer({owner: inLayer,
					      parent: controlBar,
					      width: "100%"});
	    }

	    var b = new wm.mobile.ToolButton({owner: inLayer,
					      caption: this.getCaption(inLayer),
					      parent: controlBar,
					      border: "0",
					      classNames: "mblTabBarButton", 
					      width: "50px",
					      margin: "2,0,2,0",
					      height: "100%"});
	    b.connect(b, "onclick", dojo.hitch(this, "tabClicked", inLayer));

		var s = new wm.mobile.Spacer({owner: inLayer,
					      parent: controlBar,
					      width: "100%"});
	    this.btns.push({button: b,
			    spacer: s});
	},
	tabClicked: function(inLayer, e) {
	    var d = this.decoree;
	    d.setLayer(inLayer);
	},
	decorateLayer: function(inLayer, inIndex) {
		this.inherited(arguments);
		this.createTab(inLayer.caption, inIndex, inLayer);
	},
	undecorateLayer: function(inLayer, inIndex) {
	    var ownerPage = this.decoree.getParentPage();
	    var controlBar = ownerPage.root.getControlBar();
	    if (inIndex != 0) {
		var b = this.btns[inIndex];
		wm.Array.removeElementAt(this.btns, inIndex);
		b.button.destroy();
		b.spacer.destroy();
	    }
	    if (this.btns.length == 0)
		controlBar.hide();
	},
	setLayerShowing: function(inLayer, inShowing) {

	    var i = inLayer.getIndex();

	    if (i != -1) {
		var ownerPage = this.decoree.getParentPage();
		var controlBar = ownerPage.root.getControlBar();
		var b = this.btns[inIndex];
		b.button.setShowing(inShowing);
		b.spacer.setShowing(inShowing);
		this.inherited(arguments);
	    }
	},
	setLayerActive: function(inLayer, inActive) {
	    var ownerPage = this.decoree.getParentPage();
	    var controlBar = ownerPage.root.getControlBar();
	    var b = this.btns[inLayer.getIndex()];
	    if (b) {
		dojo[inActive ? "addClass" : "removeClass"](b.button.domNode, "mblTabButtonSelected");
	    }
	    this.inherited(arguments);
	},
	applyLayerCaption: function(inLayer) {
	    var d = this.decoree, i = inLayer.getIndex();
	    if (i != -1) {
		var ownerPage = this.decoree.getParentPage();
		var controlBar = ownerPage.root.getControlBar();
		var b = this.btns[i].button;
		b.setCaption(this.getCaption(inLayer));
	    }
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
	    this.inherited(arguments);
	    var ownerPage = this.decoree.getParentPage();
	    var controlBar = ownerPage.root.getControlBar();	    
	    controlBar.moveControl(controlBar.c$[inFromIndex*2+1], inToIndex*2+1);
	    var b = this.btns[inFromIndex];
	    wm.Array.removeElementAt(this.btns, inFromIndex);
	    this.btns.splice(inToIndex, 0, b);
	}
});



dojo.declare("wm.mobile.ToggleDecorator", wm.mobile.LayersDecorator, {
	decorationClass: "wmtogglelayers",
	decorateContainer: function() {
		this.inherited(arguments);
		this.btns = [];
		this.toggleButton = new wm.mobile.ToggleButtonSet({
		    parent: this.decoree, 
		    owner: this.decoree,
		    padding: this.decoratorPadding,
		    name: "toggleButton"
		});
		this.decoree.moveControl(this.toggleButton, 0);
	    this.toggleButton.connect(this.toggleButton, "onclick", this, function(inIndex) {
		this.decoree.setLayerIndex(inIndex);
	    });
	},

	undecorate: function() {
		this.inherited(arguments);
		this.toggleButton.destroy();
	},
    getCaption: function(inLayer) {
	return inLayer.caption;
    },
	createTab: function(inCaption, inIndex, inLayer) {
	    this.toggleButton.setCaption(inCaption, inIndex);
	},

	decorateLayer: function(inLayer, inIndex) {
		this.inherited(arguments);
		this.createTab(inLayer.caption, inIndex, inLayer);
	},
	undecorateLayer: function(inLayer, inIndex) {
	    this.toggleButton.setCaption("", inIndex);
	},
	setLayerShowing: function(inLayer, inShowing) {
	    this.toggleButton.setCaption(inShowing ? inLayer.caption : "", inLayer.getIndex());
	},
	setLayerActive: function(inLayer, inActive) {
	    this.toggleButton.setClicked(inLayer.getIndex());
	    this.inherited(arguments);
	},
	applyLayerCaption: function(inLayer) {
	    this.toggleButton.setCaption(inLayer.caption, inLayer.getIndex());
	},
	moveLayerIndex: function(inFromIndex, inToIndex) {
	    this.inherited(arguments);
	    var layers = this.decoree.layers;
	    for (var i = 0; i < layers.length; i++) {
		this.toggleButton.setCaption(layers[i].caption, i);
	    }
	    for (; i < 4; i++) {
		this.toggleButton.setCaption("", i);
	    }
	}
});

dojo.declare("wm.mobile.SideBySideDecorator", wm.mobile.LayersDecorator, {

    activateLayer: function(inLayer) {
	this.inherited(arguments);
	this.decoree.renderBounds();
    }


});