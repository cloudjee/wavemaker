/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Table.builder");

// FIXME: put in lib
wm.getTr = function(inTable, index) {
		return inTable && ((inTable.rows||0)[index] || inTable.childNodes[index]);
	}
	
wm.getTd = function(inTable, rowIndex, cellIndex) {
		return (wm.getTr(inTable, rowIndex)||0).childNodes[cellIndex];
	}


dojo.declare("wm.table.builder", null, {
	rowCount: 0,
	colCount: 0,
	constructor: function(inClassName, inRowClassName, inColumnClassName) {
		this.className = inClassName || '';
		this.rowClassName = inRowClassName || '';
		this.columnClassName = inColumnClassName || '';
	},
	// boilerplate HTML
	_table: ['<table class="', '','" cellspacing="0" cellpadding="0">'],
	// generate starting tags for a cell
	generateCell: function(inRow, inCol, inHeader) {
	    var tag = (inHeader ? 'th' : 'td');
	    var html = ['<', tag, ' '];
	    var s=this.getCellStyle && this.getCellStyle(inRow, inCol);
	    var c=this.getCellClass && this.getCellClass(inRow, inCol);
	    c = (c ? c + " " : "") +  this.columnClassName;
		s&&html.push([' style="', s, '"'].join(''));
		c&&html.push([' class="', c, '"'].join(''));
		html.push('>')
		html.push(this.getCellContent(inRow, inCol, inHeader))
		html.push('</' + tag + '>');
		return html.join('');
	},
	generateRow: function(inRow, inHeader) {
		var s = (this.getRowStyle)&&this.getRowStyle(inRow), 
			c = this.rowClassName || ((this.getRowClass)&&this.getRowClass(inRow));
		var html = [
			'<tr',
			' style="',
			s,
			'" class="',
			c,
			'">'
		];
		for (var i=0, l=this.colCount; i<l; i++)
			html.push(this.generateCell(inRow, i, inHeader));
		html.push('</tr>');
		return html.join('');
	},
	generateTableStart: function() {
		var result = this._table.concat([]);
		result[1] = this.className;
		return result.join('');
	},
	generateTableEnd: function() {
		return '</table>';
	},
	generateHtml: function() {
		result = [this.generateTableStart()];
		for (var i=0, l=this.rowCount; i<l; i++)
			result.push(this.generateRow(i));
		result.push(this.generateTableEnd());
		return result.join('');
	},
	generateHeaderHtml: function() {
		result = [this.generateTableStart()];
		result.push(this.generateRow(-1, true));
		result.push(this.generateTableEnd());
		return result.join('');
	},
	generateEmptyTable: function() {
		return [this.generateTableStart(), this.generateTableEnd()].join('');
	}
});
