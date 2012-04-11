/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.layout.Abs");

wm.layout.findColEdges = function(c$, cc, x) {
	var edges = [];
	for (var i=0, c; c=c$[i]; i++) {
		if (c != cc) {
			if (c.bounds.l==x) {
				edges.push({right: (c$[i] ? c$[i].name : ""), control: c, index: i});
			} else if (c.bounds.r==x) {
				edges.push({left: (c$[i] ? c$[i].name : ""), control: c, index: i});
			}
		}
	}
	return edges;
}

dojo.declare("wm.layout.Abs", wm.layout.Base, {
	_closeness: 6,
	flow: function(inContainer) {
		for (var i=0, c; c=inContainer.c$[i]; i++) {
			if (c.flow && this.inFlow(c)) {
					c.flow();
			}
		}
		inContainer.renderControls();
	},
	suggest: function(inContainer, inControl, ioInfo) {
		var r = ioInfo, c=inControl;
		if (c) {
			r.l = c.bounds.l + r.dx;
			r.t = c.bounds.t + r.dy;
			r.w = c.bounds.w;
			r.h = c.bounds.h;
		} else {
			r.w = 96;
			r.h = 48;
			r.l -= 16;
			r.t -= 16;
		}
		r.r = r.l + r.w;
		r.b = r.t + r.h;
		//
		var hSnap = null, vSnap = null;
		var hys = this._closeness;
		var cb = inContainer.getContentBounds();
		var ib = dojo.mixin({}, r);
		if (Math.abs(ib.t - cb.t) < hys) {
			// snap to top edge of container
			r.t = cb.t;
			vSnap = { l: cb.l, t: r.t, w: cb.w, h: 1};
		} else if (Math.abs(ib.b - cb.b) < hys) {
			// snap to bottom edge of container
			r.t = cb.b - ib.h;
			vSnap = { l: cb.l, t: r.t+r.h, w: cb.w, h: 1};
		}
		if (Math.abs(ib.l - cb.l) < hys) {
			// snap to left edge of container
			r.l = 0;
			hSnap = { l: r.l, t: cb.t, w: 1, h: cb.h};
		} else if (Math.abs(ib.r - cb.r) < hys) {
			// snap to right edge of container
			r.l = cb.r - ib.w;
			hSnap = { l: r.l+r.w, t: cb.t, w: 1, h: cb.h};
		}
		for (var i=0, c; c=inContainer.c$[i]; i++) {
			if (c == inControl)
				continue;
			var b = c.bounds;
			// snap top to bottom edge of a control
			if (Math.abs(b.b - ib.t) < hys) {
				r.t = b.t + b.h;
				vSnap = { l: cb.l, t: r.t, w: cb.w, h: 1};
			}
			// snap bottom to top edge of a control
			if (Math.abs(ib.b - b.t) < hys) {
				r.t = b.t - ib.h;
				vSnap = { l: cb.l, t: r.t+r.h, w: cb.w, h: 1};
			}
			// snap top to top edge of a control
			if (Math.abs(ib.t - b.t) < hys) {
				r.t = b.t;
				vSnap = { l: cb.l, t: r.t, w: cb.w, h: 1};
			}
			// snap left to right edge of a control
			if (Math.abs(b.r - ib.l) < hys) {
				r.l = b.l + b.w;
				hSnap = { l: r.l, t: cb.t, w: 1, h: cb.h};
			}
			// snap right to left edge of a control
			if (Math.abs(ib.r - b.l) < hys) {
				r.l = b.l - ib.w;
				hSnap = { l: r.l+r.w, t: cb.t, w: 1, h: cb.h};
			}
			// snap left to left edge of a control
			if (Math.abs(ib.l - b.l) < hys) {
				r.l = b.l;
				hSnap = { l: r.l, t: cb.t, w: 1, h: cb.h};
			}
		}
		r.hSnap = hSnap;
		r.vSnap = vSnap;
		//return inControl.toFrame(r);
	},
	suggestSize: function(inContainer, inControl, ioInfo) {
		var r = ioInfo;
		r.b = r.t + r.h;
		r.r = r.l + r.w;
		var cb = inContainer.getContentBounds();
		var hys = this._closeness;
		for (var i=0, c; c=inContainer.c$[i]; i++) {
			if (c == inControl)
				continue;
			var b = c.bounds;
			with (wm.design.handles) {
				switch (ioInfo.handleId) {
					case leftTop:
					case middleTop:
					case rightTop:
						// snap top to container top
						if (Math.abs(r.t - cb.t) < hys) {
							r.t = cb.t;
						}
						// snap top to bottom
						else if (Math.abs(r.t - b.b) < hys) {
							r.t = b.b;
						}
						else // snap top to top
						if (Math.abs(r.t - b.t) < hys) {
							r.t = b.t;
						}
						r.h = r.b - r.t;
						break;
					case leftBottom:
					case middleBottom:
					case rightBottom: 
						// snap bottom to container bottom
						if (Math.abs(r.b - cb.b) < hys) {
							r.h = cb.b - r.t;
						}
						// snap bottom to bottom
						else if (Math.abs(r.b - b.b) < hys) {
							r.h = b.b - r.t;
						}
						// snap bottom to top
						else if (Math.abs(r.b - b.t) < hys) {
							r.h = b.t - r.t;
						}
						break;
				}
				switch (ioInfo.handleId) {
					case leftTop:
					case leftMiddle:
					case leftBottom:
						// snap left to container top
						if (Math.abs(r.l - cb.l) < hys) {
							r.l = cb.l;
						}
						// snap left to right
						else if (Math.abs(r.l - b.r) < hys) {
							r.l = b.r;
						}
						// snap left to left
						else if (Math.abs(r.l - b.l) < hys) {
							r.l = b.l;
						}
						r.w = r.r - r.l;
						break;
					case rightTop:
					case rightMiddle:
					case rightBottom:
						// snap right to container bottom
						if (Math.abs(r.r - cb.r) < hys) {
							r.w = cb.r - r.l;
						}
						// snap right to right
						else if (Math.abs(r.r - b.r) < hys) {
							r.w = b.r - r.l;
						}
						// snap right to left
						else if (Math.abs(r.r - b.l) < hys) {
							r.w = b.l - r.l;
						}
						break;
				}
			}
		}
	},
	insert: function(inTarget, inControl, inDropInfo) {
		//if (inControl.flags._absLayout == this) 
		//	this.takeRoom(inTarget, inControl);
		inControl.setBounds(inDropInfo);
		inControl.left = inDropInfo.l;
		inControl.top = inDropInfo.t;
		//inControl.flags._absLayout = this;
		//this.makeRoom(inTarget, inControl);
	},
	makeRoom: function(inContainer, inControl) {
		var c$ = inContainer.c$;
		var edges = wm.layout.findColEdges(inContainer.c$, inControl, inControl.bounds.l);
		for (var i=0, e; e=edges[i]; i++) {
			if (e.right) {
				if (e.control.bounds.t < inControl.bounds.b && e.control.bounds.b > inControl.bounds.t) {
					e.control.setBounds({l: e.control.bounds.l + inControl.bounds.w});
					this.makeRoom(inContainer, e.control);
				}
			}
		}
	},
	takeRoom: function(inContainer, inControl) {
		var c$ = inContainer.c$;
		var edges = wm.layout.findColEdges(inContainer.c$, inControl, inControl.bounds.r);
		for (var i=0, e; e=edges[i]; i++) {
			if (e.right) {
				if (e.control.bounds.t < inControl.bounds.b && e.control.bounds.b > inControl.bounds.t) {
					this.takeRoom(inContainer, e.control);
					e.control.setBounds({l: e.control.bounds.l - inControl.bounds.w});
				}
			}
		}
	},
	renderEdges: function(inContainer, inControl) {
		var cb = inContainer.getContentBounds();
		var c$ = inContainer.c$;
		//
		this.nodes = [];
		//
		var ve$ = [cb.l, cb.r - 1];
		for (var i=0, c; c=c$[i]; i++) {
			if (c != inControl) {
				ve$.push(c.bounds.l);
				ve$.push(c.bounds.r);
			}
		}
		ve$.sort();
		for (var i=1, e; (e=ve$[i]) || i<ve$.length; i++) {
			if (e == ve$[i-1]) {
				ve$.splice(i--, 1);
			}
		}
		for (var i=0, e, n; (e=ve$[i]) || i<ve$.length; i++) {
			var n = document.createElement("div");
			n.style.cssText = "position: absolute; z-index: 40; border: 1px dotted lightgreen;";
			dojo._setBox(n, e, cb.t, 0, cb.h);
			inContainer.dom.node.appendChild(n);
			this.nodes.push(n);
		}
		//
		var he$ = [cb.t, cb.b - 1];
		for (var i=0, c; c=c$[i]; i++) {
			if (c != inControl) {
				he$.push(c.bounds.t);
				he$.push(c.bounds.b);
			}
		}
		he$.sort();
		for (var i=1, e; (e=he$[i]) || i<he$.length; i++) {
			if (e == he$[i-1]) {
				he$.splice(i--, 1);
			}
		}
		for (var i=0, e, n; (e=he$[i]) || i<he$.length; i++) {
			var n = document.createElement("div");
			n.style.cssText = "position: absolute; z-index: 40; border: 1px dotted lightgreen;";
			dojo._setBox(n, cb.l, e, cb.w, 0);
			inContainer.dom.node.appendChild(n);
			this.nodes.push(n);
		}
	},
	removeEdges: function(inContainer) {
		if (!this.nodes)
			return;
		for (var i=0, n; n=this.nodes[i]; i++) {
			n.parentNode.removeChild(n);
		}
		delete this.nodes;
	}
});
