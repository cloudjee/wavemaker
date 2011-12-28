/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.base.RbacPlugin");
dojo.require("wm.base.Control");
dojo.require("wm.base.widget.Layers");
dojo.require("wm.base.Plugin");

wm.Plugin.plugin("rbac", wm.Widget, {
	roles: '',
	prepare: function() {
		this.rbacSocket(arguments);
		if (this.roles && this.roles.length) {
		    this._rbacShowingRequested = this.showing;
		    this.showing = this.updateRbacShowing(this.showing);
		    this.subscribe("wmRbacUpdate", this, "reshowRbac");
		}
	},
    reshowRbac: function() {
	this.setShowing(this._rbacShowingRequested);
    },
    setShowing: function(inValue) {
	/* wm.Layer.setShowing calls TabDecorator.setShowing which calls wm.Control.setShowing, which would clobber our
	 * _mobileShowingRequested value
	 */
	if (this instanceof wm.Layer == false && this.roles)
	    inValue = this.updateRbacShowing(inValue);
	this.rbacSocket(arguments);
    },
    updateRbacShowing: function(inValue) {
	if (!this._cupdating)
	    this._rbacShowingRequested = inValue; // cache whether it should be showing even if we don't let it show
	return inValue && this.isRbacShowAllowed();
    },
/*
	setShowing: function(inValue) {
	    if (this.roles && this.roles.length) {
		inValue = inValue && this.isAllowed();
	    }
	    this.rbacSocket(arguments);
	},
	*/
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
		this.setShowing(true);
	},
	addRole: function(inRole) {
		if (!this.roles) {
			this.roles = [];
		}
		this.roles.push(inRole);
	},
	removeRole: function(inRole) {
		if (this.roles) {
			for (var i=0, c; c=this.roles[i]; i++) 
				if (c == inRole)
					this.roles.splice(i--, 1);
			if (!this.roles.length) {
				this.roles = '';
			}
		}
	},
	removeAllRoles: function() {
		this.roles = '';
	},
	isRbacShowAllowed: function() {
		var userRoles = this._getUserRoles();
		if (userRoles) {
			for (var i=0, r; (r=this.roles[i]); i++) {
				for (var j=0, ur; (ur=userRoles[j]); j++) {
					if (r == ur) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	},
	_getUserRoles: function() {
		if (this.isDesignLoaded()) {
			// this should return the "Preview By Role(s)" roles
			return null;
		} else {
			return wm.getUserRoles();
		}
	}
});

wm.Plugin.plugin("rbacLayer", wm.Layer, {
	setShowing: function(inValue) {
		if (this.roles && this.roles.length) {
		    inValue = this.updateRbacShowing(inValue);
		}
		this.rbacLayerSocket(arguments);
	}
});

wm.Plugin.plugin("rbacservice", wm.ServiceVariable, {
	roles: '',
    update: function() {
	if (!this.roles || this.isRbacUpdateAllowed())
	    this.rbacserviceSocket(arguments);
	else
	    console.log(this.getId() + " blocked by role settings");
    },
    updateInternal: function() {
	if (!this.roles || this.isRbacUpdateAllowed())
	    this.rbacserviceSocket(arguments);
	else
	    console.log(this.getId() + " blocked by role settings");
    },
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
	},
	isRbacUpdateAllowed: function() {
		var userRoles = this._getUserRoles();
		if (userRoles) {
			for (var i=0, r; (r=this.roles[i]); i++) {
				for (var j=0, ur; (ur=userRoles[j]); j++) {
					if (r == ur) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	},
	_getUserRoles: function() {
		if (this.isDesignLoaded()) {
			// this should return the "Preview By Role(s)" roles
			return null;
		} else {
			return wm.getUserRoles();
		}
	}
});


wm.Object.extendSchema(wm.Control, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", advanced: 1}
}, true);
wm.Object.extendSchema(wm.ServiceVariable, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", advanced: 1}
}, true);


wm.Plugin.plugin("mobile", wm.Control, {
    deviceSizes: '',
    prepare: function() {
	this.mobileSocket(arguments);
	if (this.deviceSizes) {
	    this._mobileShowingRequested = this.showing;
	    this.showing = this.updateMobileShowing(this.showing);
	    this.subscribe("deviceSizeRecalc", this, "reshowMobile");
	}
    },
    reshowMobile: function() {
	this.setShowing(this._mobileShowingRequested);
    },
    setShowing: function(inValue) {
	/* wm.Layer.setShowing calls TabDecorator.setShowing which calls wm.Control.setShowing, which would clobber our
	 * _mobileShowingRequested value
	 */
	if (this instanceof wm.Layer == false && this.deviceSizes)
	    inValue = this.updateMobileShowing(inValue);
	this.mobileSocket(arguments);
    },
    updateMobileShowing: function(inValue) {
	if (!this._cupdating)
	    this._mobileShowingRequested = inValue; // cache whether it should be showing even if we don't let it show
	if (this.deviceSizes && this.deviceSizes.length) {
	    return inValue && this.isMobileShowAllowed();
	} else {
	    return inValue;
	}
    },
    isMobileShowAllowed: function() {
	var deviceSize = this._isDesignLoaded ? app.appRoot.calcDeviceSize(studio.designer.bounds.w) : app.appRoot.deviceSize;
	return (!deviceSize || dojo.indexOf(this.deviceSizes, deviceSize) != -1);
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
    }
});

wm.Plugin.plugin("mobileLayer", wm.Layer, {
    deviceSizes: '',
    setShowing: function(inValue) {
	inValue = this.updateMobileShowing(inValue);
	this.mobileLayerSocket(arguments);
    }
});

wm.Object.extendSchema(wm.Control, {
    deviceSizes: {group: "devices", editor: "wm.prop.DeviceListEditor", advanced: 1}
}, true);
