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
dojo.provide("wm.base.widget.CollapsingPanel");

dojo.declare("wm.CollapsingPanel", wm.Container, {
	layoutKind: "top-to-bottom",
	// FIXME: margin doesn't seem to be interacting properly with layoutFit
	//margin: 2,
	border: 1,
	fitToContent: true,
	collapsed: false,
	caption: "Header",
	init: function() {
		this.inherited(arguments);
		// local image list for collapse button images
		this.imageList = new wm.ImageList({name: "imageList", owner: this, width: 16, height: 16, colCount: 10,
			url: wm.theme.getImagesPath() + "collapsebuttons.png"});
		// header: button + label
		this.header = new wm.Container({name: "header", owner: this, parent: this, height: "24px", width: "100%", padding: "2", layoutKind: "left-to-right", backgroundColor: "#ABB8CF;", border: "0,0,1,0", padding: 2, lock: true});
		this.headerButton = new wm.ToolButton({name: "headerButton", owner: this, parent: this.header, width: "18px", caption: "", backgroundColor: "transparent"});
		this.connect(this.headerButton, "onclick", this, "toggleCollapse");
		this.headerLabel = new wm.Label({name: "headerLabel",owner: this, parent: this.header, width: "100%", border:0, caption: this.caption});
		// client region for widgets
		this.client = new wm.Panel({name: "client", owner: this, parent: this, height: "100px", width: "100%", showing: !this.collapsed, border: 0, fitToContent: true, lock: true});
	},
	postInit: function() {
		this.inherited(arguments);
		this.setCollapsed(this.collapsed);
	},
	toggleCollapse: function() {
		this.setCollapsed(!this.collapsed);
	},
	setCaption: function(inCaption) {
		this.caption = inCaption;
		this.headerLabel.setCaption(inCaption);
	},
	setCollapsed: function(inCollapsed) {
		this.collapsed = inCollapsed;
		this.headerButton.setImageIndex(this.collapsed ? 1 : 0);
		this.client.setShowing(!this.collapsed);
	},
	// add un-owned widgets to client container
	addWidget: function(inWidget) {
		if (inWidget.owner == this)
			this.inherited(arguments);
		else
			this.client.addWidget(inWidget);
	},
	// FIXME: can't seem to place widgets at dragged location in client
	// only at top or bottom of client.
	// control management (need to add/remove controls from client)
	// all un-owned controls go into client
	addControl: function(inControl) {
		if (inControl.owner == this)
			this.inherited(arguments);
		else
			this.client.addControl(inControl);
	},
	removeControl: function(inControl) {
		if (inControl.owner == this)
			this.inherited(arguments);
		else
			this.client.removeControl(inControl);
	},
	insertControl: function(inControl, inIndex) {
		if (inControl.owner == this)
			this.inherited(arguments);
		else
			this.client.insertControl(inControl, inIndex);
		
	},
	// called by designMoveControl
	moveControl: function(inControl, inIndex) {
		if (inControl.owner == this)
			this.inherited(arguments);
		else
			this.client.moveControl(inControl, inIndex);
	},
	getOrderedWidgets: function() {
		return this.client.getOrderedWidgets();
	}
});

wm.registerPackage(["Common", "CollapsingPanel", "wm.CollapsingPanel", "wm.base.widget.Panel", "images/wm/panel.png", "A collapsing panel"]);
