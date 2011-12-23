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
