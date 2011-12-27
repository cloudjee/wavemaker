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

dojo.provide("wm.base.widget.AppRoot");

dojo.declare("wm.AppRoot", wm.Container, {
	// useful properties
	classNames: '',
	width: "",
	height: "",
        deviceSize: "",
	create: function() {
	    this.inherited(arguments);
	    this.deviceSize = this.calcDeviceSize(window.innerWidth);
	    app.valueChanged("deviceSize",this.deviceSize); // bindable event
	},
	build: function() {
	    this.domNode = dojo.byId(this.owner.domNode) || document.body;
	    this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
	},
	init: function() {
	    this.inherited(arguments);
	    this.subscribe("window-resize", this, "resize");
	},
    getRuntimeId: function() {return "approot";},
	resize: function() {
	    var deviceSize = this.deviceSize;
	    this.deviceSize = this.calcDeviceSize(window.innerWidth);
	    if (deviceSize != this.deviceSize) {
		app.valueChanged("deviceSize",this.deviceSize); // bindable event
		dojo.publish("deviceSizeRecalc");
	    }
	    this.reflow();
	},
	updateBounds: function() {
	    this._percEx = {w:100, h: 100};
	    var pn = this.domNode.parentNode;
	    this.setBounds(0, 0, pn.offsetWidth, pn.offsetHeight);
	},
	reflow: function() {
		if (this._cupdating)
			return;
	        this.updateBounds();
		this.renderBounds();
		this.inherited(arguments);
	},
    calcDeviceSize: function(width) {
	if (width >= 1000) {
	    return "1000";
	} else if (width >= 800) {
	    return "800";
	} else if (width >= 600) {
	    return "600";
	} else if (width >= 450) {
	    return "450";
	} else if (width >= 300) {
	    return "300";
	} else {
	    return "tiny";
	}
    }
});
