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


/* mkantor: This file is NOT obsolete, but should be.  Recommendations:
   1. wm.Box = wm.Control;
   2. Remove Box.js from manifest.js and dojo.requires
   3. Warning: Box_design.js has some code in it; looks very wavemaker 4ish.  
   */
dojo.provide("wm.base.widget.Box");
dojo.require("wm.base.Widget");

/**
	Adds box layout features to Widget.
	@name wm.Box
	@class
	@extends wm.Widget
*/
dojo.declare("wm.Box", wm.Widget, {
	/** @lends wm.Widget.prototype */
	/*
	width: "96px", 
	height: "48px",
	autoSize: false,
	setDomNode: function(inDomNode) {
		var n = inDomNode;
		if (!n) return;
		if (this.autoSize)
			this.width = this.height = "";
		// the domNode might already have box and flex ...
		this.box && (n.box = this.box);
		this.flex && (n.flex = this.flex);
		this.boxPosition && (n.boxPosition = this.boxPosition);
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmbox");
	},
	setBox: function(inBox) {
		this.domNode.box = this.box = inBox;
		this.reflowParent();
	},
	setBoxPosition: function(inPosition) {
		this.boxPosition = this.domNode.boxPosition = inPosition;
		this.reflowParent();
	}
	*/
});
