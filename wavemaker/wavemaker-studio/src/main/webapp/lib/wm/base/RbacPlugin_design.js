/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.base.RbacPlugin_design");
dojo.require("wm.base.RbacPlugin");

wm.Component.extend({
	setRoles: function(inValue) {
	    if (inValue === undefined || inValue === null)
		inValue = [];
	    var s = dojo.isArray(inValue) ? inValue : inValue.split(','), r=[];
		for (var i=0, v, f; (f=s[i]); i++) {
			v = dojo.trim(f);
			if (v)
				r.push(v);
		}
		this.roles = r;
	        if (this.setShowing)
		    this.setShowing(true);
	},
    set_deviceSizes: function(inSize) {
	this.deviceSizes = inSize;
	var found = false;
	for (var i = 0; i < this._subscriptions.length; i++) {
	    if (this._subscriptions[i][0] == "deviceSizeRecalc") {
		found = true;
		break;
	    }
	}
	if (!found) {
	    this.subscribe("deviceSizeRecalc", this, "reshowMobile");
	}
	this.reshowMobile();
    },
    set_deviceType: function(inType) {
	this.deviceType = inType;
	var deviceType = studio.currentDeviceType;
	this.setShowing(this._mobileShowingRequested || this.showing);

	var found = false;
	for (var i = 0; i < this._subscriptions.length; i++) {
	    if (this._subscriptions[i][0] == "deviceSizeRecalc") {
		found = true;
		break;
	    }
	}
	if (!found) {
	    this.subscribe("deviceSizeRecalc", this, "reshowMobile");
	}
	this.reshowMobile();
    }
});





wm.Object.extendSchema(wm.Control, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", advanced: 1},
    deviceSizes: {group: "mobile", subgroup: "devices", shortname: "showForDeviceSizes", editor: "wm.prop.DeviceSizeEditor", order: 101},
    deviceType: {group: "mobile",  subgroup: "devices", editor: "wm.prop.DeviceListEditor",  order: 100}
}, true);
wm.Object.extendSchema(wm.ServiceVariable, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", advanced: 1}
}, true);


