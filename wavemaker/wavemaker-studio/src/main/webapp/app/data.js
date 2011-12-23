/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
