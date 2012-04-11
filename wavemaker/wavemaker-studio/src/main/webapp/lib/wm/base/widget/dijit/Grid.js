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

dojo.provide("wm.base.widget.dijit.Grid");
dojo.require("wm.base.widget.dijit.Dijit");
dojo.require("dojox.grid.compat.Grid");

/**
	Encapsulates the Dijit Grid for use in WaveMaker.
	@name wm.dijit.Grid
	@class
	@extends wm.Dijit
	@noindex
*/
dojo.declare("wm.dijit.Grid", wm.Dijit, {
	/** @lends wm.dijit.Grid.prototype */
	dijitClass: dojox.Grid,
	width: "100%",
	height: "100%",
	init: function() {
		this.inherited(arguments);
	},
        renderBounds: function() {
	    this.inherited(arguments);
	    this.resizeDijit();
	},
/*
	render: function() {
		this.inherited(arguments);
	        this.resizeDijit();
	},
	*/
	resizeDijit: function() {
		this.dijit.sizeChange();
	}
});