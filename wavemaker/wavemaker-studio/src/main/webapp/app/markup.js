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
 
dojo.provide("wm.studio.app.markup");

getMarkupIds = function() {
	/*
	var comps = wm.listComponents([studio.application, studio.page], wm.HtmlLoader), ids=[];
	dojo.forEach(comps, function(c) {
		ids = ids.concat(c.getNodeIds());
	});
	*/
	var ids = wm.getNodeIds(studio.markup.domNode);
	ids.sort();
	return ids;
}

makeMarkupIdsPropEdit = function(inName, inValue, inDefault) {
	var ids = getMarkupIds();
	ids.unshift("");
	if (dojo.indexOf(ids, inValue) == -1)
		ids.splice(ids.length ? 1 : 0, 0, inValue);
	return makeSelectPropEdit(inName, inValue, ids, inDefault);
}

insertMarkupNode = function(inNode) {
    if (!studio.markup) return [];
	var ids = getMarkupIds();
	if (dojo.indexOf(ids, inNode.id) == -1)
		studio.markup.domNode.appendChild(inNode);
}

dojo.subscribe('wm-content-markupchanged', insertMarkupNode);