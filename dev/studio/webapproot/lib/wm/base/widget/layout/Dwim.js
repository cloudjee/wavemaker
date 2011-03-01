/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
// DWIM = "do what I mean"

dojo.provide("wm.base.widget.layout.Dwim");

// insert object id with given # of rows and cols to the RIGHT (delta=1) or to the LEFT (delta=0) of [cin,rin]
mapInsertCols = function(m, id, cin, rin, cols, rows, delta) {
	var ri = rin;
	// pad rows above and below
	for (var i=0, r; r=m[i]; i++) {
		// if we are above or below the insertion rows
		if (i<ri || i>=ri+rows) {
			console.log("padding row:", i);
			// the column we are inserting around
			var ci = cin;
			// get the cell at this column
			var c = r[ci];
			console.log("ci, c:", ci, c);
			// if the cell is a spacer
			if (c[0] < 0) {
				// find the owning cell
				var oc = m[c[2]][c[1]];
				// c is already a suitable spacer for oc
				console.log("found spacer for:", oc);
			} else {
				// c is an owning cell
				var oc = c;
				// construct a suitable spacer
				c = [ -1, ci, i];
				// do our insertions after the oc
				ci++;
				console.log("found owning cell, new ci, c:", ci, c);
			}
			// update column count for owning cell
			oc[1] += cols;
			// insert the cells
			console.log("inserting", cols, "of", c, "at", ci);
			for (var j=0;j<cols;j++) {
				r.splice(ci, 0, c);
			}
		}
	}
	// insertion location
	cin += delta;
	// args to "splice"
	// we will insert a set of values at 'cin' (with 0 deletions)
	var args = [cin, 0];
	// a reference cell
	var ref = [-1, cin, rin];
	// add ref cells to the argument list
	for (var i=0; i<cols; i++) {
		args.push(ref);
	}
	// insert the cells into each row
	for (var i=0;i<rows;i++) {
		var r = m[rin + i];
		r.splice.apply(r, args);
	}
	// set our owner cell
	m[rin][cin] = [id, cols, rows];
}

dojo.declare("wm.layout.Dwim", wm.layout.Base, {
	map: [
		[ [0, 3, 1], [-1, 0, 0], [-1, 0, 0], [1, 1, 2] ],
		[ [2, 1, 1], [3, 1, 1], [4, 1, 1], [-1, 3, 0] ],
		[ [5, 1, 1], [6, 1, 2], [7, 1, 1], [8, 1, 1] ],
		[ [9, 1, 1], [-1, 1, 2], [10, 1, 1], [11, 1, 1] ]
	],
	flow: function(inContainer) {
		var b = inContainer.getContentBounds();
		var rc = this.map.length;
		var cellH = b.h / rc;
		for (var ri=0; row=this.map[ri]; ri++) {
			var l = b.l;
			var cc = row.length;
			var cellW = b.w / cc;
			for (var ci=0; cell=row[ci]; ci++) {
				var i = cell[0], x = cell[1], y = cell[2];
				if (i>=0) {
					var w = x * cellW;
					var h = y * cellH;
					var c = inContainer.c$[i];
					if (c) {
						c.setBounds(l, b.t, w, h);
						if (c.flow)
							c.flow();
					}
				}
				l += cellW;
			}
			b.t += cellH;
		}
		inContainer.renderControls();
	},
	findHitControl: function(inContainer, ioRect) {
		var b = inContainer.getContentBounds();
		var rc = this.map.length;
		var cellH = b.h / rc;
		var t = b.t;
		for (var ri=0; row=this.map[ri]; ri++) {
			var l = b.l;
			var cc = row.length;
			var cellW = b.w / cc;
			for (var ci=0; cell=row[ci]; ci++) {
				var i = cell[0], x = cell[1], y = cell[2];
				if (i>=0) {
					var w = x * cellW;
					var h = y * cellH;
					var c = inContainer.c$[i];
					if (c) {
						if (ioRect.l >= l && ioRect.l <= l+w && ioRect.t >= t && ioRect.t <= t+h) {
							return {l:l, t:t, w:w, h:h, r:l+w, b:t+h, i:0, ci: ci, ri: ri, c: c};
						}
					}
				}
				l += cellW;
			}
			t += cellH;
		}
	},
	findSide: function(inHit, inInfo) {
		var dt = inHit.t - inInfo.t;
		var db = inInfo.b - inHit.t;
		var dy = Math.min(dt, db);
		var t = dt < db ? inInfo.t : inInfo.b;
		//
		var dl = inHit.l - inInfo.l;
		var dr = inInfo.r - inHit.l;
		var dx = Math.min(dl, dr);
		var l = dl < dr ? inInfo.l : inInfo.r;
		if (dy < dx) {
			return {
				l:inInfo.l,
				t:t,
				w:inInfo.w,
				side: dt < db ? "top" : "bottom",
				d: dy
			};
			//this._suggestTb(inContainer, info);
		} else {
			return {
				l:l,
				t:inInfo.t,
				h:inInfo.h,
				side: dl < dr ? "left" : "right",
				d: dx
			};
		}
	},
	suggest: function(inContainer, inControl, ioRect) {
		var info = this.findHitControl(inContainer, ioRect);
		if (!info) 
			return;
		var sideInfo = this.findSide(ioRect, info);
		with (info) {
			info = dojo.mixin({ci: ci, ri: ri, c: c}, sideInfo);
		}
		switch (info.side) {
			case "left":
			case "right":
				this._suggestLr(inContainer, info);
				console.log(info.c, info.c.bounds);
				console.dir(findColLines(inContainer.c$, info.c, info.c.bounds.r));
				break;
			default:
				//this._suggestTb(inContainer, info);
				break;
		}
		dojo.mixin(ioRect, info);
		this.info = info;
	},
	_suggestLr: function(inContainer, info) {
		// find spans
		var cb = inContainer.getContentBounds();
		var rc = this.map.length;
		var cellH = cb.h / rc;
		var cc = this.map[info.ri][info.ci];
		// the cell column at the left or right edge of c
		var ci = Number(info.ci) + (info.side == "left" ? 0 : Number(cc[1]));
		var ri = info.ri-1;
		// find the top most part of the vertical span
		for (var j=ri, to=0; j>=0; j--, to++) {
			// check the cell
			var c = this.map[j][ci];
			// if the cell cuts this column, stop
			if (c && c[0]<=0 && c[1]<ci)
				break;
		}
		// the cell row at the bottom edge of c
		var ri = Number(info.ri) + Number(cc[2]);
		// find the bottom most part of the vertical span
		for (var j=ri, bo=0; j<rc; j++, bo++) {
			// check the cell
			var c = this.map[j][ci];
			// if the cell cuts this column, stop
			if (c && c[0]<=0 && c[1]<ci)
				break;
		}
		// the farther away from the edge, the more we want to limit the span
		var lim = Math.floor(info.dx/3);
		// half the limit goes to the top, half to the bottom
		var lim2 = Math.floor(lim/2);
		// odd portion goes to the top
		to = Math.max(0, to - lim2 - (lim & 1));
		bo = Math.max(0, bo - lim2);
		// adjust drop rect
		info.t = info.t - to*cellH;
		info.h = info.h + (to + bo)*cellH;
		// return information
		dojo.mixin(info, {
			ri: info.ri - to,
			ci: ci,
			cols: 1,
			rows: to + bo + Number(cc[2]),
			i: inContainer.c$.length
		});
		return info;
	},
	insert: function(inContainer, inControl, inInfo) {
		console.log(inInfo);
		var m = this.map;
		var n = inInfo;
		if (n.side == "right") {
			console.log("Inserting [", n.cols, ", ", n.rows, "] cells to the right of [", n.ci-1, ", ", n.ri, "]");
			mapInsertCols(m, n.i, n.ci-1, n.ri, n.cols, n.rows, 1);
		} else if (n.side == "left") {
			console.log("Inserting [", n.cols, ", ", n.rows, "] cells to the left of [", n.ci, ", ", n.ri, "]");
			mapInsertCols(m, n.i, n.ci, n.ri, n.cols, n.rows, 0);
		}
		inContainer.reflow();
	}
});

findColLines = function(c$, cc, ex) {
	var edges = [];
	for (var i=0, c; c=c$[i]; i++) {
		if (c.bounds.l==ex) {
			edges.push({left: (c$[i] ? c$[i].name : "")});
		} else if (c.bounds.r==ex) {
			edges.push({right: (c$[i] ? c$[i].name : "")});
		}
	}
	return edges;
}
