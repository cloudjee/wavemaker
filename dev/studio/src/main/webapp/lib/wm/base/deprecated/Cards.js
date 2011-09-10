/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Cards");

wm.define("wm.Cards", wm.Container, {
	borderColor: "brown",
	border: 2,
	padding: 8,
	constructor: function() {
		this.layout = new wm.layout.Cards();
		this.mover = new wm.design.Mover();
	},
	loaded: function() {
		this.inherited(arguments);
		console.log(this.columns);
		var lc = [];
		var pc = this.columns;
		if (pc) {
			for (var i=0, r; r=pc[i]; i++) {
				var lr = [];
				for (var j=0, ci; ci=r[j]; j++) {
					lr.push(this.c$[ci]);
				}
				lc.push(lr);
			}
		}
		this.layout.columns = lc;
		delete this.columns;
	},
	writeProps: function() {
		var props = this.inherited(arguments);
		var pc = [];
		var lc = this.layout.columns;
		for (var i=0, r; r=lc[i]; i++) {
			var pr = [];
			for (var j=0, c; c=r[j]; j++) {
				pr.push(this.indexOfControl(c));
			}
			pc.push(pr);
		}
		props.columns = pc;
		return props;
	},
	beginDrag: function(e, inCard) {
		this.mover.beginDrag(e, {caption: inCard.name, control: inCard});
	}
});

wm.define("wm.Card", wm.Control, {
	backgroundColor: "lightblue",
	border: 1,
	init: function() {
		this.inherited(arguments);
		this.dom.node.innerHTML = '<div style="text-align: center;">' + this.name + '</div>';
		this.connect(this.dom.node, "onmousedown", this, "mousedown");
	},
	mousedown: function(e) {
		this.parent.beginDrag(e, this);
	}
});

wm.define("wm.layout.Cards", wm.layout.Base, {
	margin: 8,
	cardWidth: 128,
	cardHeight: 96,
	constructor: function() {
		this.columns = [];
		this.widths = [];
	},
	flow: function(inContainer) {
		for (var i=0, w; i<this.columns.length; i++) {
			w = this.cardWidth;
			for (var j=0, c=this.columns[i], d; c && (d=c[j]); j++)
				w = Math.max(w, d.bounds.w);
			this.widths[i] = w;
		}
		var r = {l:0, t:0, w:0, h:0};
		for (var i=0, r; i<this.columns.length; i++) {
			r.w = this.widths[i] || this.cardWidth;
			for (var j=0, c=this.columns[i], d;  c && (d=c[j]); j++) {
				r.h = d.bounds.h || this.cardHeight;
				d.setBounds(r);
				r.t += r.h + this.margin;
			}
			r.t = 0;
			r.l += r.w + this.margin;
		}
		inContainer.renderControls();
	},
	remove: function(inControl) {
		for (var i=0, c; i<this.columns.length; i++) {
			c = this.columns[i];
			for (var j=0, d; c && (d=c[j]); j++) {
				if (d == inControl) {
					c.splice(j, 1);
					return;
				}
			}
		}
	},
	insert: function(inTarget, inControl, inInfo) {
		this.remove(inControl);
		inControl.setBounds(inInfo.l, inInfo.t);
		var i = this.findColumnIndex(inInfo.l);
		var col = this.columns[i] || [];
		this.columns[i] = col;
		this.insertInColumn(inControl, col);
	},
	findColumnIndex: function(inX) {
		var c = 0, w = 0;
		do {
			w += this.widths[c++] || this.cardWidth;
		} while (inX >= w);
		return c-1;
	},
	insertInColumn: function(inControl, inColumn) {
		for (var i=0, d; (d=inColumn[i]); i++) {
			if (d.bounds.t >= inControl.bounds.t) {
				inColumn.splice(i, 0, inControl);
				return;
			}
		}
		inColumn.push(inControl);
	}
});

//wm.registerPackage(["Controls", "Cards", "wm.Cards", "wm.base.widget.Cards", "images/wm/panel.png", "A card-layout panel."]);
//wm.registerPackage(["Controls", "Card", "wm.Card", "wm.base.widget.Cards", "images/wm/panel.png", "A card."]);
