/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
	// Removing old implementation of changing JSON Object to JSON String with the new dojo's implementation.
	/*
	console.info("object sent to toJson method: " + dojo.toJson(v));
	var j = "";
	switch(true){
		case (v == undefined):
			j += "undefined";
			break;
		case dojo.isArray(v):
			var e = elementsToJson(v);
			//if (e) 
			//	e = sourcer_nl + sourcer_tab + sourcer_tab + sourcer_tab + e;
			j += "[" + e + "]";
			break;
		case dojo.isObject(v):
			j += "{" + propsToJson(v) + "}"
			break;
		default:
			j += quote(v);
			break;
	}
	return j;
	*/
}

propsToJson = function(p) {
	var s=[], v;
	for (var n in p)
		if (!(n in Object)) {
			v = p[n];
			if (v != undefined)
				s.push(n + ": " + toJson(v));
		}
		else
		{
			console.info('ignoring: ' + n + 'in ' + Object);
		}
	return s.join(", ");
}

elementsToJson = function(p) {
	var s=[];
	for (var i=0, l=p.length; i<l; i++)
		s.push(toJson(p[i]));
	return s.join(", ");
	//return s.join(", " + sourcer_nl + sourcer_tab + sourcer_tab + sourcer_tab);
}

quote = function(inValue) {
	return dojo.isString(inValue) ? dojo._escapeString(inValue) : inValue;
}
