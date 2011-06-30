/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
//dojo.provide("wm.modules.rbac.RbacPlugin");
dojo.provide("wm.base.RbacPlugin");
dojo.require("wm.base.Control");
dojo.require("wm.base.widget.Layers");
dojo.require("wm.base.Plugin");

wm.Plugin.plugin("rbac", wm.Widget, {
	roles: '',
	loaded: function() {
		this.rbacSocket(arguments);
		if (this.roles && this.roles.length) {
			this.setShowing(this.showing);
		}
	},
	setShowing: function(inValue) {
		if (this.roles && this.roles.length) {
			inValue = inValue && this.isAllowed();
		}
		this.rbacSocket(arguments);
	},
	setRoles: function(inValue) {
		var s = inValue.split(','), r=[];
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
	isAllowed: function() {
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
			inValue = inValue && this.isAllowed();
		}
		this.rbacLayerSocket(arguments);
	}
});

wm.Object.extendSchema(wm.Widget, {
	roles: {ignore: 1, writeonly: 1, category: "Security",
	categoryProps: {content: "Security", image: "images/lock_16.png", inspector: "Security"}}
}, true);
