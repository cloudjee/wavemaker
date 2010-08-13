/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
