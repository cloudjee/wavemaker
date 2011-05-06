/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.IFrame");
dojo.require("wm.base.components.Binding");

dojo.declare("wm.IFrame", wm.Control, {
	scrim: true,
	source: "",
	build: function() {
		this.frame = document.createElement("iframe");
		this.domNode = dojo.byId(this.domNode||this.id||undefined);
		if (!this.domNode)
			this.domNode = this.frame;
		else
			this.domNode.appendChild(this.frame);
	},
	init: function() {
		dojo.addClass(this.domNode, "wmiframe");
		this.inherited(arguments);
		this.setSource(this.source);
	},
	setSource: function(inSource) {
		if (!dojo.isString(inSource) || inSource == "undefined")
			inSource = "";
		this.source = inSource;
		var root = this.source.slice(0, 4) != "http" && this.source.slice(0, 1) != "/" ? this.getPath() : "";
		this.frame.src = this.source ? root + this.source : this.source;
	}
});

// design only...
wm.Object.extendSchema(wm.IFrame, {
	disabled: { ignore: 1 },
    source: { type: "String", bindable: 1 },
    setSource: {group: "method"}
});

wm.IFrame.description = "A frame.";

dojo.extend(wm.IFrame, {
        themeable: false
});