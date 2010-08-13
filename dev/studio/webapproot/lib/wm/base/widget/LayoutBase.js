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
dojo.provide("wm.base.widget.LayoutBase");
dojo.require("wm.base.Widget");

dojo.declare("wm.LayoutBase", wm.Widget, {
	// useful properties
	classTag: 'wm-layout',
	style: '',
	fit: false,
	create: function() {
		this.inherited("create", arguments);
		this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
		if(this.domNode === document.body){ 
			this.subscribe("window-resize", this, "reflow");
		}
	},
	fitTo: function() {
		if (this.fit) {
			dojo.marginBox(this.domNode, dojo.contentBox(this.domNode.parentNode));
		}
	},
	reflow: function() {
		//console.log(this, "reflow");
		this.fitTo();
	}
});