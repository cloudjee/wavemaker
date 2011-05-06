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
 
dojo.provide("wm.studio.pages.Diagnostics.Diagnostics");

dojo.declare("Diagnostics", wm.Page, {
	start: function() {
		//this.update();  
	},
	update: function() {
		var ws = this.dumpWires();
		ws.sort(function(a, b) {
			return (a.tid == b.tid ? 0 : a.tid < b.tid ? -1 : 1);
		});
		var h = [];
		for (var i=0, w; w = ws[i]; i++) {
			h.push(
				'<span class="diag-wire-target">', w.tid, "</span>", 
				bundleStudio.D_BoundTo,
				'<span class="diag-wire-source">', w.sid, "</span>",
				!w.ttype || !w.stype ? "" : w.ttype == w.stype ? D_WithMatchedType + w.ttype + "</i>" : 
					'<br/><span class="diag-type-error">! type mismatch</span>' + w.ttype + '!=' + w.stype,
				"<br/>"
			);
		}
		if (!h.length)
			h.push("No wires in project.");
		this.wiresPanel.domNode.innerHTML = h.join("");
	},
	dumpWires: function() {
		var ws = [];
		var cs = wm.Component.byId, c, s, tt, st;
		for (var i in cs) {
			c = cs[i];
			if (c instanceof wm.Wire) {
				var p = c.target[c.targetProperty];
				tt = p instanceof wm.Variable ? " (" + p.type + ") " : "";
				s = c.getValueById(c.source);
				st = s instanceof wm.Variable ? " (" + s.type + ") " : "";
				ws.push({ tid: c.target.getId() + "." + c.targetProperty, ttype: tt, sid: c.source, stype: st});
			}
		}
		return ws;
	},
	_end: 0
});