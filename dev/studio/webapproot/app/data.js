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
dojo.provide("wm.studio.app.data");

wm.dataSources = {
	update: function() {
		this.clearSources();
		this.typesToSources();
		this.sortSources();
	},
	clearSources: function() {
		this.sources = {};
	},
	typesToSources: function() {
		var sources = this.sources, source, ii, caption, s;
		for (var i in wm.typeManager.getPublicTypes()) {
			source = wm.typeManager.getLiveService(i);
			if (!source)
				continue;
			ii = i.split(".");
			caption = ii.pop();
			ii.pop();
			s = sources[source];
			if (!s) {
				sources[source] = s = [];
			}
			s.push({
				type: i,
				caption: caption
			});
		}
	},
	sortSources: function() {
		var ss = this.sources;
		for (var i in ss) {
			if (i in Object.prototype)
				continue;
			ss[i].sort(function(a, b) {
				return a.caption < b.caption ? -1 : a.caption == b.caption ? 0 : 1;
			});
		}
	}
};
