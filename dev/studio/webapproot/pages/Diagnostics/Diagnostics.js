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