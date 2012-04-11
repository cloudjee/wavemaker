/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
dojo.require("wm.base.components.ServiceVariable");
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
	if (djConfig.isDebug) try { this.log("update", arguments.callee.caller.nom || arguments.callee.caller.name || "anonymous");} catch(e) {}
	if (!this.roles || this.isRbacUpdateAllowed())
	    return this.rbacserviceSocket(arguments);
	else {
	    console.log(this.getId() + " blocked by role settings");
	    return new dojo.Deferred();
	}
    },
    updateInternal: function() {
	if (!this.roles || this.isRbacUpdateAllowed())
	    return this.rbacserviceSocket(arguments);
	else
	    console.log(this.getId() + " blocked by role settings");
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


wm.Plugin.plugin("mobile", wm.Control, {
    deviceSizes: '',
    prepare: function(inProps) {
	this.mobileSocket(arguments);
	if (this.deviceSizes || inProps.deviceSizes || window["studio"] && this.deviceType) {
	    this._mobileShowingRequested = this.showing;
	    this.showing = this.updateMobileShowing(this.showing);
	    this.subscribe("deviceSizeRecalc", this, "reshowMobile");
	}
    },
    reshowMobile: function() {
	this.setShowing(this._mobileShowingRequested || this.showing);
    },
    setShowing: function(inValue) {
	/* wm.Layer.setShowing calls TabDecorator.setShowing which calls wm.Control.setShowing, which would clobber our
	 * _mobileShowingRequested value
	 */
	if (this instanceof wm.Layer == false && this.deviceSizes || this._isDesignLoaded && this.deviceType)
	    inValue = this.updateMobileShowing(inValue);
	this.mobileSocket(arguments);
    },
    updateMobileShowing: function(inValue) {
	if (!this._cupdating)
	    this._mobileShowingRequested = inValue; // cache whether it should be showing even if we don't let it show

	if (this.deviceSizes && this.deviceSizes.length || this._isDesignLoaded && this.deviceType ) {
	    return inValue && this.isMobileShowAllowed();
	} else {
	    return inValue;
	}
    },
    isMobileShowAllowed: function() {
	if (this._isDesignLoaded) {
	    var deviceType = studio.currentDeviceType;
	    if (deviceType && this.deviceType && dojo.indexOf(this.deviceType, deviceType) == -1) {
		return false;
	    }

	    var deviceSize = studio.deviceSizeSelect.getDataValue();
	    if (!deviceSize) return true;
	    var isOk = true;
	    if (this.deviceSizes && dojo.indexOf(this.deviceSizes, deviceSize) == -1) return false;
	    return true;
	} else {
	    var deviceSize = app.appRoot.deviceSize;
	    return (!deviceSize || dojo.indexOf(this.deviceSizes, deviceSize) != -1);
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
