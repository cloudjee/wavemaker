/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Webjit");
dojo.require("wm.webjits.dw", true);

wm.findNodes = function(inNode, inPrefix, inResult) {
	inResult = inResult || {};
	for (var i=0, n; n=inNode.childNodes[i]; i++) {
		if (n.id) {
			inResult[n.id] = n;
			n.id = inPrefix + n.id;
		} 
		wm.findNodes(n, inPrefix, inResult);
	}
	return inResult;
}

dojo.declare("wm.DW", null, {
	owner: null,
	constructor: function(inOwner) {
		this.owner = inOwner;
	},
	init: function() {
	},
	draw: function() {
	},
	ondraw: function() {
	},
	getProperty: function(inName) {
		return this[inName];
	}
});

// Mix-in the widget API defined by the DW spec
wm.DW.extend(__DW__.api);

dojo.declare("wm.Webjit", wm.Box, {
	dwClass: wm.DW,
	constructor: function() {
		this.dw = new this.dwClass(this);
	},
	init: function() {
		this.inherited(arguments);
		this.dw.init();
	},
	nodeAutoSize: function(inAtWidth, inAtHeight) {
		var s = this.domNode.style;
		s.overflow = "auto";
		if (this.autoSizeWidth || this.autoSizeHeight) {
			//if (dojo.isFF && dojo.isFF < 3)
			if (!inAtWidth)
				s.width = "";
			if (!inAtHeight)
				s.height = "";
			this.draw();
			this.sizeFromNode();
		} else
			this.draw();
	},
	draw: function(inAtWidth, inAtHeight) {
		var h = this.dw.draw(this.domNode, inAtWidth, inAtHeight);
		if (h !== undefined) {
			this.domNode.innerHTML = h;
		}
		this.dw.nodes = wm.findNodes(this.domNode, this.name + "_");
		this.dw.ondraw();
	}
});
