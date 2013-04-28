/*
 * Copyright (C) 2011-2013 VMware, Inc. All rights reserved.
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
		if (inValue === undefined || inValue === null) inValue = [];
		var s = dojo.isArray(inValue) ? inValue : inValue.split(','),
			r = [];
		for (var i = 0, v, f;
		(f = s[i]); i++) {
			v = dojo.trim(f);
			if (v) r.push(v);
		}
		this.roles = r;
		if (this.setShowing) this.setShowing(true);
	}
});




wm.Object.extendSchema(wm.Control, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", nonlocalizable:1, editorProps: {singleLine: false, captionSize: "90px", height: "240px"}, shortname: "<div class='NotTrueSecurity'><table><tr><td class='SecurityNote'>NOTE:</td><td>These selections effect client access only, and do not ensure complete security. For more information, see <a target='Docs' href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.6/Security#HServerSideSecurity'>WaveMaker Security</a>.</td></tr></table></div>Visibile to which roles"}
}, true);

wm.Object.extendSchema(wm.ServiceVariable, {
    roles: {group: "roles", editor: "wm.prop.RolesEditor", nonlocalizable:1, editorProps: {singleLine: false, captionSize: "90px", height: "240px"}, advanced: 1, shortname: "<div class='NotTrueSecurity'><table><tr><td class='SecurityNote'>NOTE:</td><td>These selections effect client access only, and do not ensure complete security. For more information, see <a target='Docs' href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.6/Security#HServerSideSecurity'>WaveMaker Security</a>.</td></tr></table></div>Fires for which roles"}
}, true);


