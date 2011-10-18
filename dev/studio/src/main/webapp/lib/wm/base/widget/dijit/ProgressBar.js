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

dojo.provide("wm.base.widget.dijit.ProgressBar");
dojo.require("wm.base.widget.dijit.Dijit");
dojo.require("dijit.ProgressBar");

dojo.declare("wm.dijit.ProgressBar", wm.Dijit, {
	progress: 10,
	indeterminate: false,
	dijitClass: dijit.ProgressBar,
	width: "20em",
        classNames: "wmprogressbar",
	renderBounds: function() {
		this.inherited(arguments);
		this.reflowDijit();
	},
	init: function() {
		this.inherited(arguments);
		this.dijit.progress = this.progress;
		this.dijit.indeterminate = this.indeterminate;
		this.connect(this.dijit, "update", this, "reflowDijit");
		this.dijit.update();
	},
	reflowDijit: function() {
		var b = dojo.contentBox(this.domNode);
		if (this.dijit) {
		    dojo.marginBox(this.dijit.domNode, {h: b.h});
		    if (this.dijit.labelNode) {
			dojo.marginBox(this.dijit.labelNode, {h: b.h});
			this.dijit.labelNode.style.lineHeight = b.h + "px";
		    }
		}
	},
	setProgress: function(inProgress) {
		var p = Number(inProgress);
		this.progress = isNaN(p) ? 0 : p;
		this.dijit.progress = this.progress;
		this.dijit.update();
	        this.valueChanged("progress", this.progress);
	},
	getProgress: function() {
		return this.dijit.progress;
	},
	setIndeterminate: function(inIndeterminate) {
		this.indeterminate = inIndeterminate;
		this.dijit.indeterminate = this.indeterminate;
		this.dijit.update();
	        this.valueChanged("indeterminate", this.indeterminate);
	},
	getIndeterminate: function() {
		return this.dijit.indeterminate;
	},
	// events
	onChange: function() {}
});

wm.Object.extendSchema(wm.dijit.ProgressBar, {
	disabled: { ignore: 1 },
	progress: { bindable: 1 },
	indeterminate: { bindable: 1 }
});

wm.dijit.ProgressBar.extend({
    themeableDemoProps: {height: "40px"}
});