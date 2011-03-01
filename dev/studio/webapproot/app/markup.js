/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
	var ids = getMarkupIds();
	if (dojo.indexOf(ids, inNode.id) == -1)
		studio.markup.domNode.appendChild(inNode);
}

dojo.subscribe('wm-content-markupchanged', insertMarkupNode);