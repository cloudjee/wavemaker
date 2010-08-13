/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.PluginTest");

/*
// Basic Example
wm.Plugin.plugin("basic", wm.Widget, {
	loaded: function() {
		// do stuff before
		this.basicSocket(arguments);
		// do stuff after
		console.debug(this);
	}
});

// RBACish
wm.Plugin.plugin("rbac", wm.Widget, {
	loaded: function() {
		this.rbacSocket(arguments);
		if (this.roles)
			this.setShowing(this.showing);
	},
	setShowing: function(inValue) {
		inValue = inValue && (!this.roles || (this.roles == "admin"));
		this.rbacSocket(arguments);
	},
	setRoles: function(inValue) {
		this.roles = inValue;
		this.setShowing(true);
	}
});

wm.Object.extendSchema(wm.Widget, {
	roles: { type: "String" }
});
*/
