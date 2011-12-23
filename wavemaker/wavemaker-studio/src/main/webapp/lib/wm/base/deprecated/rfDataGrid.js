/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.rfDataGrid");

rf = {};
kit = dojo;

$$ = rf.getComponent = function(inNameOrReference) {
	return typeof inNameOrReference != "string" ? inNameOrReference : $$[inNameOrReference];
}

dojo.declare("rf.Component", null, {
	postscript: function(inProperties) {
		this._importing = true;
		this.importProperties(inProperties || {});
		delete this._importing;
		this.create(inProperties);
		this.postCreate();
	},
	importProperties: function(inProperties) {
		kit.mixin(this, inProperties);
	},
	create: function() {
		this.setOwner(this.owner);
	},
	postCreate: function() {
	},
	setOwner: function(inOwner) {
		this.owner = inOwner;
	}
});

dojo.declare("rf.Control", rf.Component, {
	create: function() {
		this.inherited(arguments);
		this.parentSet();
	},
	getContent: function() {
		return this.content;
	},
	renderHtml: function() {
		return this.getContent();
	},
	parentSet: function() {
		if (this.parent)
			this.parent.addControl(this);
	},
	setParent: function(inParent) {
		if (this.parent)
			this.parent.removeControl(this);
		this.parent = inParent;
		this.parentSet();
	}
});

dojo.declare("rf.Container", rf.Control, {
	border: 1,
	layout: wm.layout.box,
	constructor: function() {
		this.c$ = [];
	},
	create: function() {
		this.inherited(arguments);
	},
	destroy: function() {
		this.destroyChildren();
		this.inherited(arguments);
	},
	destroyChildren: function() {
		while (this.c$.length)
			this.c$[0].destroy();
	},
	setLayout: function(inLayout) {
		this.layout = inLayout;
		this.flown = false;
	},
	addComponent: function(inComponent) {
		if (inComponent instanceof wm.Control) {
			inComponent.setParent(this);
		} else
			this.inherited(arguments);
	},
	indexOfControl: function(inControl) {
		for (var i=0, c; c=this.c$[i]; i++)
			if (c == inControl)
				return i;
		return -1;
	},
	addControl: function(inControl) {
		var l = this.c$.length;
		var last = this.c$[l - 1];
		inControl.indexInParent = l;
		this.c$.push(inControl);
		inControl.prevSibling = last;
		if (last)
			last.nextSibling = inControl;
	},
	removeControl: function(inControl) {
		var i = this.indexOfControl(inControl);
		if (i >= 0) {
			this.c$.splice(i, 1);
			var p = inControl.prevSibling;
			var n = inControl.nextSibling;
			if (p) {
				p.nextSibling = n;
			}
			if (n) {
				n.prevSibling = p;
			}
		}
	},
	getContent: function() {
		var html = "";
		for (var i=0, c; c=this.c$[i]; i++) {
			html += c.renderHtml();
		}
		return html;
	}
});

dojo.declare("rf.DataGridHeader", rf.Control, {
	getContent: function() {
		this.data = this.grid.data;
		return this.data ? this.renderGrid() : '';
	},
	renderGrid: function() {
		var h = [];
		var row = {
			style: "border-left: 1px solid silver; padding: 2px;",
			tw: this.grid.colWidth * this.grid.colCount,
			index: -1
		};
		this.renderRow(h, row);
		return h.join('');
	},
	renderRow: function(h, r) {
		var s = this.grid.schema, cc = this.grid.colCount, cw = this.grid.colWidth - 4;
		h.push(
			'<table style="width: ', r.tw, 'px; border-bottom: 1px solid silver; border-right: 1px solid silver;" cellpadding="0" cellspacing="0" row="' + r.index + '"><tr>'
		);
		for (var i=0; i<cc; i++) {
			h.push('<td style="width: ', cw, 'px;', r.style, '">', s[i].field || '~', '</td>');
		}
		h.push('</tr></table>');
	}
});

dojo.declare("rf.DataGridBody", rf.Control, {
	getContent: function() {
		this.data = this.grid.data;
		if (!this.it) {
			this.it = new rf.DataIterator(this.data, this.grid.root);
		}
		var it = this.it;
		//
		it.reset();
		var h = [];
		var row = {
			style: "border-left: 1px solid silver; padding: 2px;",
			tw: this.grid.colWidth * this.grid.colCount
		};
		for (var i=0; it.next() != wm.NIL; i++) {
			row.index = i;
			row.values = it.value;
			this.renderRow(h, row);
		}
		return h.join('');
	},
	renderRow: function(h, r) {
		h.push(
			'<table style="table-layout: fixed; width: ', r.tw, 'px; border-bottom: 1px solid silver; border-right: 1px solid silver;" cellpadding="0" cellspacing="0" row="' + r.index + '"><tr>'
		);
		var s = this.grid.schema, cc = this.grid.colCount, cw = this.grid.colWidth - 4;
		for (var i=0; i<cc; i++) {
			h.push('<td style="width: ', cw, 'px;', r.style, '"><div style="width:', cw-5, 'px; overflow: hidden;">', s[i].getter(r.values) || '~', '</div></td>');
		}
		h.push('</tr></table>');
	},
	click: function(e) {
		var t = e.target;
		while (t && t.tagName !='TABLE' && t.parentNode) {
			t = t.parentNode;
		}
		if (t && t.getAttribute) {
			var row = Number(t.getAttribute("row"));
			this.selectRow(row);
		}
		this.grid.focus();
	},
	selectRow: function(inRow) {
		var n$ = (this.getNode() || 0).childNodes;
		if (n$ && this.grid.selectedRow >= 0)
			n$[this.grid.selectedRow].style.backgroundColor = "";
		//
		this.grid.selectedRow = inRow;
		this.grid.onselectrow(inRow);
		//
		if (n$ && this.grid.selectedRow >= 0)
			n$[this.grid.selectedRow].style.backgroundColor = "lightblue";
	}
});

dojo.declare("rf.DataGridRenderer", rf.Container, {
	dataSource: "",
	root: "",
	colCount: 3,
	treeWidth: 140,
	colWidth: 160,
	create: function() {
		this.inherited(arguments);
		this.setDataSource(this.dataSource);
		this.header = new rf.DataGridHeader({parent: this, height: 32, grid: this, styles: "background-color: orange;"});
		this.body = new rf.DataGridBody({parent: this, flex: 1, grid: this, scroll: kit.hitch(this, "bodyScroll")});
	},
	bodyScroll: function(e) {
		this.header.getNode().scrollLeft = this.body.getNode().scrollLeft;
		return true;
	},
	setDataSource: function(inDataSource) {
		this.dataSource = inDataSource;
		this.data = rf.getComponent(inDataSource);
		//this.renderContent();
	},
	setRoot: function(inRoot) {
		this.root = inRoot;
	},
	getContent: function() {
		if (!this.data) 
			return "";
		//this.schema = [].concat(this.data.reflectSchema());
		// fetch the data schema
		var s = this.data.reflectSchema();
		// find the portion of interest
		s = wm.findFieldSchema(s, this.root);
		// flatten
		var ns = [];
		flatten = function(ss) {
			for (var i=0, s; s=ss[i]; i++) {
				if (s.type == "object")
					flatten(s.fields);
				else if (s.type != "array")
					ns.push(s);
			}
		}
		flatten(s);
		this.schema = ns;
		this.colCount = this.schema.length;
		this.rowCount = this.data.getLength();
		return this.inherited(arguments);
	},
	selectRow: function(inRow) {
		this.body.selectRow(inRow);
	},
	onselectrow: function() {
	}
});

rf.compare = function(a, b, sign) {
	if (a > b) 
		return sign;
	else if (a < b)
		return -(sign);
	else
		return 0;
}

dojo.declare("rf.AbstractIterator", null, {
	// FIXME: meanings of "cursor" and "index" are backwards as used
	index: -1,
	constructor: function() {
	},
	//getLength // abstract
	//getItem // abstract
	//getArraySort // abstract
	isValidIndex: function(inIndex) {
		return inIndex >= 0 && inIndex < this.length;
	},
	getCursor: function() {
		return this.cursor = this.map ? this.map[this.index] : this.index;
	},
	setIndex: function(inIndex) {
		this.index = inIndex;
		return this.value = (this.isValidIndex(this.index) ? this.getItem(this.getCursor()) : wm.NIL);
	},
	reset: function() {
		this.length = this.getLength();
		this.setIndex(-1);
	},
	next: function() {
		return this.setIndex(++this.index);
	},
	prev: function() {
		return this.setIndex(--this.index);
	},
	initMap: function() {
		this.map = [];
		//this.imap = [];
		for (var i=0; i<this.length; i++) {
			this.map.push(i);
			//this.imap.push(i);
		}
	},
	unsort: function() {
		delete this.map;
		return this.getCursor();
	},
	sort: function(inBy, inTrueToDescend) {
		this.reset();
		this.initMap();
		var sorter = this.getArraySort(inBy, inTrueToDescend);
		console.time("AbstractIterator.sort");
		this.map.sort(sorter);
		console.timeEnd("AbstractIterator.sort");
		return this.getCursor();
	}
});

dojo.declare("rf.DataIterator", rf.AbstractIterator, {
	constructor: function(inData, inRoot) {
		this.root = inRoot;
		this.setData(inData);
	},
	setData: function(inData) {
		//this.data = $$(inData);
		this.data = inData;
	},
	getItems: function() {
		return this.items = (this.root ? this.data.getNamedValue(this.root) : this.data.items);
	},
	getLength: function() {
		return !this.data ? 0 : (this.getItems() ? this.items.length : 0);
	},
	getItem: function(inIndex) {
		// CAVEAT: won't lazy load
		return this.items[inIndex];
	},
	getArraySort: function(inQuery, inTrueToDescend) {
		var path = wm.toPathString(inQuery);
		var sign = inTrueToDescend ? -1 : 1;
		var code = rf.compare.toString().match(/{([\s\S]*)}/)[1];
		var i$ = this.getItems();
		var fn;
		eval([
			"fn = function(a, b) {",
			"  a = i$[a]." + path + ";",
			"  b = i$[b]." + path + ";",
			code,
			"}"
		].join(''));
		console.log(fn.toString());
		return fn;
	}
});

dojo.declare("rf.DataGrid", wm.Widget, {
	dataSource: "",
	init: function() {
		window.$$ = studio.wip.$;
		this.dgr = new rf.DataGridRenderer();
		this.inherited(arguments);
		this.domNode.style.overflow = "auto";
	},
	setDataSource: function(inDataSource) {
		this.dataSource = inDataSource;
		this.dgr.data = this.owner.$[inDataSource];
		console.log(this.dataSource, this.dgr.data, this.owner.$);
		this.renderContent();
	},
	renderContent: function() {
		this.domNode.innerHTML = this.dgr.renderHtml();
	}
});

registerPackage(["Controls", "rfDataGrid", "rf.DataGrid", "wm.base.widget.rfDataGrid", "images/wm/pane2.png", ""]);
