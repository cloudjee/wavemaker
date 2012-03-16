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
	    this.deviceSize = wm.deviceSize || this.calcDeviceSize(window.innerWidth);
	    app.valueChanged("deviceSize",this.deviceSize); // bindable event
	},
	build: function() {
	    this.domNode = dojo.byId(this.owner.domNode) || document.body;
	    this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
	},
	init: function() {
	    this.inherited(arguments);
	    /* using onorientationchange is unreliable for android browser; may need to re-review this */
	    /* The Android browser shipped by google with 2.x devices can not find the width and height of the screen when the onorientationchange event fires, and
	     * the result is a big gap in the margin of the page.  While a delay could be used, on a test device the delay was significant and unpredictable.
	     *
	     * WARNING: onresize may not be provided to android devices within phonegap applications.
	     */
	    if (navigator.vendor.match(/Google/i) && navigator.userAgent.match(/android/i)) {
		window.addEventListener("resize", dojo.hitch(this,"resize"));
	    } else if ("onorientationchange" in window) {
		window.addEventListener("orientationchange", dojo.hitch(this, "_onOrientationChange"));
	    } else {
		window.addEventListener("resize", dojo.hitch(this,"resize"));
	    }
	},
    getRuntimeId: function() {return "approot";},

    /* Assumes that wavemaker app is the only thing on the page; some of these calculations fail if there is other html outside of the wavemakerNode */
    _onOrientationChange: function() {
	    this._inResize = true;
	    var max = Math.max(screen.width, screen.height);
	    var min = Math.min(screen.width, screen.height);
	    console.log("MAX:" + max + "; MIN: " + min);
	    switch(window.orientation) {
	    case 90:
	    case -90:
	    case 270:
		this.setBounds(null,null, max, min);
		if (app.appTitleBar)
		    app.appTitleBar.hide();
		break;
	    default: 
		this.setBounds(null,null, min,max);
		if (app.appTitleBar)
		    app.appTitleBar.show();
	    }
	    app.valueChanged("deviceSize",this.deviceSize); // bindable event
	    dojo.publish("deviceSizeRecalc");
	    this.reflow();
	    this._inResize = false;
    },
	resize: function() {
	    this._inResize = true;
	    if (!wm.deviceSize) {
		var deviceSize = this.deviceSize;
		this.updateBounds();
		console.log("RESIZE: WIDTH: " + this.bounds.w + " | " + this.bounds.h);
		this.deviceSize = this.calcDeviceSize(this.bounds.w);
		if (deviceSize != this.deviceSize) {
		    app.valueChanged("deviceSize",this.deviceSize); // bindable event
		    dojo.publish("deviceSizeRecalc");
		}
	    }
	    this.reflow();
	    if (wm.device != "desktop" && app.wmMinifiedDialogPanel) {
		app.wmMinifiedDialogPanel.hide();
		wm.onidle(app.wmMinifiedDialogPanel, "show");
	    }
	    this._inResize = false;
	},
	updateBounds: function() {
	    this._percEx = {w:100, h: 100};

	    var pn = this.domNode.parentNode;
	    if (window["PhoneGap"]) {
		pn.style.height = screen.height + "px";
	    } else if (wm.isMobile) {
		pn.style.height = "100%";
	    }
	    this.setBounds(0, 0, pn.offsetWidth, pn.offsetHeight);
	},
	reflow: function() {
	    if (this._cupdating)
		return;
	    if (!this._inResize) {
		this.updateBounds();
	    }
	    this.renderBounds();
	    this.inherited(arguments);
	},
    calcDeviceSize: function(width) {	
	if (width >= 1150) {
	    return "1150";
	} else if (width >= 900) {
	    return "900";
	} else if (width >= 750) {
	    return "750";
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
