/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.sourcer");

sourcer_tab = "\t";
sourcer_nl = "\n";

sourcer = function(inName, inPage) {
	return inName + ".widgets = {" + sourcer_nl + source_body(inPage) + "}";
}

source_body = function(inTop) {
	var c = inTop.writeComponents(sourcer_tab);
	if (inTop.root) {
		var s = inTop.root.write(sourcer_tab, {});
		if (s)
			c.push(s);
	}
	return c.length ? c.join("," + sourcer_nl) + sourcer_nl : "";
}

toJson = function(v) {
	return dojo.toJson(v);
}

quote = function(inValue) {
	return dojo.isString(inValue) ? dojo._escapeString(inValue) : inValue;
}
