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

dojo.provide("wm.base.widget.Respector");

dojo.declare("wm.RespectorRow", null, {
	constructor: function(inProps) {
		dojo.mixin(this, inProps);
	},
	getColCount: function() {
		return this.parent.colCount;
	},
	getColWidth: function(inIndex) {
		return this.parent.getColWidth(inIndex);
	},
	getColContent: function(inIndex) {
		switch (inIndex) {
			case 0:
				return Math.random() < 0.2 ? '<img src="images/star_16.png"/>' : '&nbsp;';
			case 1:
				return 'property';
			case 2:
				return '<input style="width: 100%; border: 0px none;" />';
			case 3:
				return Math.random() < 0.2 ? '<img src="images/target.png"/>' : '&nbsp;';
		}
	},
	render: function() {
		var h = [
			'<table cellspacing="0" cellpadding="0"', 
					'style="border: 1px solid orange; width: 100%;"', 
			'>',
			'<tr>'
		];
		var cc = this.getColCount();
		for (var i=0; i<cc; i++) {
			var w = this.getColWidth(i);
			h.push(
				'<td style="',
					'text-align: center;',
					w ? 'width: ' + this.getColWidth(i) + 'px;' : '',
					i ? 'border-left: 1px solid orange;' : '',
				'">',
				this.getColContent(i),
				'</td>'
			)
		}
		h.push("</tr></table>");
		return h.join('');
	}
});

dojo.declare("wm.Respector", wm.Box, {
	scrim: false,
	box: "v",
	colCount: 4,
	init: function() {
		this.inherited(arguments);
		this.rr = new wm.RespectorRow({parent: this});
		this.render();
		//this.domNode.style.overflowY = "auto";
	},
	getColCount: function() {
		return 4;
	},
	getColWidth: function(inIndex) {
		return [32, 120, 0, 32][inIndex];
	},
	getRowCount: function() {
		return 20;
	},
	getColHeader: function(inIndex) {
		switch (inIndex) {
			case 0:
				return '<img src="images/star_16.png"/>';
			case 1:
				return "Property";
			case 2:
				return "Value";
			case 3:
				return '<img src="images/target.png"/>';
		}
	},
	renderHeader: function() {
		var h = [
			'<table cellspacing="0" cellpadding="0"', 
					'style="border: 1px solid orange; Xwidth: 100%; background-color: #FFD79B;"', 
			'>',
			'<tr>'
		];
		var cc = this.colCount;
		for (var i=0; i<cc; i++) {
			var w = this.getColWidth(i);
			h.push(
				'<td style="',
					'text-align: center;',
					w ? 'width: ' + this.getColWidth(i) + 'px;' : '',
					i ? 'border-left: 1px solid orange;' : '',
				'">',
				this.getColHeader(i),
				'</td>'
			)
		}
		h.push('<td style="background-color: orange; width:17px;"></td>');
		h.push("</tr></table>");
		return h.join('');
	},
	render: function() {
		var h = '';
		//h += '<div style="overflow-y: scroll;">';
		h += this.renderHeader();
		//h += '</div>';
		h += '<div flex="1" style="overflow-y: auto;">';
		var rc = this.getRowCount();
		for (var i=0; i<rc; i++) {
			h += this.rr.render();
		}
		h += '</div>';
		//console.log(h);
		this.domNode.innerHTML = h;
	}
});

registerPackage([ "Experimental", "Respector", "wm.Respector", "wm.base.widget.Respector", "images/wm/template.png", "Respector" ]);
