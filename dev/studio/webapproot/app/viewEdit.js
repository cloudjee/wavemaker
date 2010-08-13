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
dojo.provide("wm.studio.app.viewEdit");

view.refreshTree: function() {
	studio.dataTree.clear();
	var n = this.newTreeNode(studio.dataTree.root, "images/wm/data.png", "sakila");
	var items = [
		["sakila", "Actor", "sakila.Actor", "images/wm/data.png", "sakila.Actor"],
		["sakila", "ActorInfo", "sakila.ActorInfo", "images/wm/data.png", "sakila.ActorInfo"],
		["sakila", "Address", "sakila.Address", "images/wm/data.png", "sakila.Address"],
		["sakila", "Category", "sakila.Category", "images/wm/data.png", "sakila.Category"],
		["sakila", "City", "sakila.City", "images/wm/data.png", "sakila.City"],
		["sakila", "Country", "sakila.Country", "images/wm/data.png", "sakila.Country"],
		["sakila", "Film", "sakila.Film", "images/wm/data.png", "sakila.Film"]
	];
	for (var i=0, item; (item=items[i]); i++)
		studio.newTreeNode(n, item[3], item[1]);
}
