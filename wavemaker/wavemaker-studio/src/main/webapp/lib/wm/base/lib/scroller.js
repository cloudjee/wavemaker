/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide('wm.base.lib.scroller');
dojo.require('wm.base.lib.util');

// virtual scrollbox

// Content must in /rows/
// Rows are managed in contiguous sets called /pages/
// There are a fixed # of rows per page
// The minimum rendered unit is a page

dojo.declare('wm.scroller.base', null, {
	constructor: function() {
		this.fifo = [];
		this.pageBottoms = [];
		this.pageHeights = [];
	},
	// specified
	rowCount: 0, // total number of rows to manage
	defaultRowHeight: 10, // default height of a row
	keepRows: 500, // maximum number of rows that should exist at one time
	rowsPerPage: 25,
	contentNode: null, // node to contain pages
	scrollboxNode: null, // node that controls scrolling
	// calculated
	defaultPageHeight: 0, // default height of a page
	keepPages: 10, // maximum number of pages that should exists at one time
	pageCount: 0,
	windowHeight: 0,
	firstVisibleRow: 0,
	lastVisibleRow: 0,
	// private
	page: 0,
	pageTop: 0,
	// setup
	setRowCount: function(inRowCount){
		this.rowCount = inRowCount;
		this.defaultPageHeight = this.defaultRowHeight * this.rowsPerPage;
		//this.defaultPageHeight = this.defaultRowHeight * Math.min(this.rowsPerPage, this.rowCount);
		this.pageCount = Math.ceil(this.rowCount / this.rowsPerPage);
		this.keepPages = Math.max(Math.ceil(this.keepRows / this.rowsPerPage), 2);
		var sn = this.scrollboxNode;
		if (sn && !this.contentNode){
			var n = this.contentNode = document.createElement("div");
			n.style.position = "relative";
			sn.appendChild(n);
		}
		this.invalidate();
		if (sn) {
			sn.style.position = "relative";
			sn.scrollTop = 0;
			this.scroll(0);
			sn.onscroll = dojo.hitch(this, 'onscroll');
		}
	},
	// updating
	invalidate: function() {
		this.invalidateNodes();
		this.pageHeights = [ ];
		this.height = (this.pageCount ? (this.pageCount - 1)* this.defaultPageHeight + this.calcLastPageHeight() : 0);
		this.resize();
	},
	updateRowCount: function(inRowCount) {
		this.invalidateNodes();
		this.rowCount = inRowCount;
		// update page count, adjust document height
		oldPageCount = this.pageCount;
		this.pageCount = Math.ceil(this.rowCount / this.rowsPerPage);
		if (this.pageCount < oldPageCount)
			for (var i=oldPageCount-1; i>=this.pageCount; i--) {
				this.height -= this.getPageHeight(i);
				delete this.pageHeights[i]
			}
		else if (this.pageCount > oldPageCount)  {
			this.height += this.defaultPageHeight * (this.pageCount - oldPageCount - 1) + this.calcLastPageHeight();
		}
		this.resize();
	},
	// abstract interface
	/*
	pageExists: function(inPageIndex) {
	},
	measurePage: function(inPageIndex) {
	},
	positionPage: function(inPageIndex, inPos) {
	},
	repositionPages: function(inPageIndex) {
	},
  installPage: function(inPageIndex) {
	},
	preparePage: function(inPageIndex, inPos, inReuseNode) {
	},
	renderPage: function(inPageIndex) {
	},
	removePage: function(inPageIndex) {
	},
	*/
	// default sizing implementation
	resize: function() {
		if (this.scrollboxNode)
			this.windowHeight = this.scrollboxNode.clientHeight;
		dojo.contentBox(this.contentNode, {h: this.height});
	},
	calcLastPageHeight: function() {
		if (!this.pageCount)
			return 0;
		var lastPage = this.pageCount - 1;
		var lastPageHeight = ((this.rowCount % this.rowsPerPage)||(this.rowsPerPage)) * this.defaultRowHeight;
		this.pageHeights[lastPage] = lastPageHeight;
		return lastPageHeight;
	},
	updateContentHeight: function(inDh) {
		//wm.debugf('updateContentHeight: old=%d, delta=%d, new=%d', this.height, inDh, this.height + inDh);
		this.height += inDh;
		this.resize();
	},
	updatePageHeight: function(inPageIndex) {
		if (this.pageExists(inPageIndex)) {
			var oh = this.getPageHeight(inPageIndex);
			var h = (this.measurePage(inPageIndex))||(oh);
			this.pageHeights[inPageIndex] = h;
			//wm.debugf('building: page %d height = %d (%d)', inPageIndex, h, inPos);
			if ((h)&&(oh != h)) {
				this.updateContentHeight(h - oh)
				this.repositionPages(inPageIndex);
			}
		}
	},
	rowHeightChanged: function(inRowIndex) {
		this.updatePageHeight(Math.floor(inRowIndex / this.rowsPerPage));
	},
	// scroller core
	invalidateNodes: function() {
		while (this.fifo.length) 
			this.destroyPage(this.pageOut());
	},
	createPageNode: function() {
		var p = document.createElement('div');
		p.className = "wm-scrollerpage";
		p.style.position = 'absolute';
		p.style.left = '0';
		p.style.width = '100%'; // not always
		return p;
	},
	getPageHeight: function(inPageIndex) {
		var ph = this.pageHeights[inPageIndex];			
		return (ph !== undefined ? ph : this.defaultPageHeight);
	},
	pageIn: function(inPageIndex) {
		return this.fifo.push(inPageIndex);
	},
	pageOut: function() {
		return this.fifo.shift();
	},
	findPage: function(inTop) {
		/*
		var i, h, pb=this.pageBottoms, l=pb.length;
		if (l) {
			h = pb[l-1];
			if (h > inTop) {
				//console.group("findPage at " + inTop);
				var p0=0, p1=l-1, p, b, d;
				do {
					p = Math.floor((p1-p0)/2) + p0;
					b = pb[p];
					//console.log(inTop, b, p0, p1, p);
					if (b>inTop || p1-p0<2) {
						if (b <= inTop) p++;
						this.page = p;
						this.pageTop = pb[p-1] || 0;
						//console.log('using bottom cache ', p);
						//console.groupEnd();
						return;
					} else if (b < inTop)
						p0 = p
					else 
						p1 = p;
				} while(p<l);
				//console.groupEnd();
			}
		}
		*/
		var i=0, h=0;
		for (var ph=0, l=this.pageCount; i<l; i++, h += ph) {
			ph = this.getPageHeight(i);
			this.pageBottoms[i] = h+ph;
			if (h + ph >= inTop)
				break;
		}
		this.page = i;
		this.pageTop = h;
	},
	buildPage: function(inPageIndex, inReuseNode, inPos) {
		this.preparePage(inPageIndex, inReuseNode);
		this.positionPage(inPageIndex, inPos);
		// order of operations is key below
		this.installPage(inPageIndex);
		this.renderPage(inPageIndex);
		// order of operations is key above
		this.pageIn(inPageIndex);
	},
	needPage: function(inPageIndex, inPos) {
		//wm.debugf('scroller.needPage(%d, %d)', inPageIndex, inPos);
		var h = this.getPageHeight(inPageIndex), oh = h;
		if (!this.pageExists(inPageIndex)) {
			this.buildPage(inPageIndex, (this.keepPages)&&(this.fifo.length >= this.keepPages), inPos);
			//wm.debugf('scroller.needPage: page %d, measurePage = %d, h = %d', inPageIndex, this.measurePage(inPageIndex), h);
			h = this.measurePage(inPageIndex) || h;
			this.pageHeights[inPageIndex] = h;
			//wm.debugf('building: page %d height = %d (%d)', inPageIndex, h, inPos);
			if (h && (oh != h))
				this.updateContentHeight(h - oh)
		} 
		else {
			//wm.debugf('positioning: page %d height = %d (%d)', inPageIndex, h, inPos);
			this.positionPage(inPageIndex, inPos);
		}
		return h;		
	},
	getScrollBottom: function(inTop) {
		return (this.windowHeight >= 0 ? inTop + this.windowHeight : -1);
	},
	scroll: function(inTop) {
		this.findPage(inTop);
		var h = this.height;
		var b = this.getScrollBottom(inTop);
		for (var p=this.page, y=this.pageTop; (p<this.pageCount)&&((b<0)||(y<b)); p++)
			y += this.needPage(p, y);
		//wm.debug(this.pageTop, y);
		this.firstVisibleRow = this.getFirstVisibleRow(this.page, this.pageTop, inTop);
		this.lastVisibleRow = this.getLastVisibleRow(p - 1, y, b);
		// indicates some page size has been updated
		if (h != this.height)
			this.repositionPages(p-1);
	},
	// code to increase responsiveness of scroll thumb cribbed from Grid
	onscroll: function() {
		this.setScrollTop(this.scrollboxNode.scrollTop);		
		//this.scrollTo(this.scrollboxNode.scrollTop);		
	},
	scrollTop : 0,
	lastScrollTop: 0,
	delayScroll: false,
	scrollRedrawThreshold: (dojo.isIe ? 100 : 50),
	scrollJobDelay: 100,
	scrollTo: function(inTop) {
		var delta = Math.abs(this.lastScrollTop - inTop);
		this.lastScrollTop = inTop;
		if (delta > this.scrollRedrawThreshold || this.delayScroll) {
			this.delayScroll = true;
			this.scrollTop = inTop;
			//this.views.setScrollTop(inTop);
			wm.job('wmgrid-scroll', this.scrollJobDelay, dojo.hitch(this, "finishScrollJob"));
		} else {
			this.setScrollTop(inTop);
		}
	},
	finishScrollJob: function() {
		this.delayScroll = false;
		this.setScrollTop(this.scrollTop);		
	},
	setScrollTop: function(inTop) {
		this.scrollTop = inTop; 
		//this.views.setScrollTop(inTop);
		this.scroll(this.scrollTop);
	},
	
	// events
	processNodeEvent: function(e, inNode) {
		var t = e.target;
		while (t && (t != inNode) && t.parentNode && (t.parentNode.parentNode != inNode)) 
			t = t.parentNode;
		if (!t || !t.parentNode || (t.parentNode.parentNode != inNode))
			return false;
		var page = t.parentNode;			
		e.topRowIndex = page.pageIndex * this.rowsPerPage;
		e.rowIndex = e.topRowIndex + wm.indexInParent(t);
		e.rowTarget = t;						
		return true;
	},
	processEvent: function(e) {
		return this.processNodeEvent(e, this.contentNode);
	},
	dummy: 0
});

dojo.declare('wm.scroller', wm.scroller.base, {
	constructor: function() {
		this.pageNodes = [ ];
	},
	// virtual rendering interface
	renderRow: function(inRowIndex, inPageNode) {
	},
	removeRow: function(inRowIndex) {
	},
	// page node operations
	getDefaultNodes: function() {
		return this.pageNodes;
	},
	getDefaultPageNode: function(inPageIndex) {
		return this.getDefaultNodes()[inPageIndex];
	},
	positionPageNode: function(inNode, inPos) {
		inNode.style.top = inPos + 'px';
	},
	getPageNodePosition: function(inNode) {
		return inNode.offsetTop;
	},
	repositionPageNodes: function(inPageIndex, inNodes) {
		var last = 0;
		for (var i=0; i<this.fifo.length; i++)
			last = Math.max(this.fifo[i], last);
		//	
		var n = inNodes[inPageIndex];
		var y = (n ? this.getPageNodePosition(n) + this.getPageHeight(inPageIndex) : 0);
		//console.log('detected height change, repositioning from #%d (%d) @ %d ', inPageIndex + 1, last, y, this.pageHeights[0]);
		//
		for (var p=inPageIndex+1; p<=last; p++) {
			n = inNodes[p];
			if (n) {
				//console.log('#%d @ %d', inPageIndex, y, this.getPageNodePosition(n));
				if (this.getPageNodePosition(n) == y)
					return;
				//console.log('placing page %d at %d', p, y);
				this.positionPage(p, y);
			}
			y += this.getPageHeight(p);
		}
	},
	invalidatePageNode: function(inPageIndex, inNodes) {
		var p = inNodes[inPageIndex];
		if (p) {
			delete inNodes[inPageIndex];
			this.removePage(inPageIndex, p);
			p.innerHTML = '';
		}
		return p;
	},
	preparePageNode: function(inPageIndex, inReusePageIndex, inNodes) {
		var p = (inReusePageIndex === null ? this.createPageNode() : this.invalidatePageNode(inReusePageIndex, inNodes));
		p.pageIndex = inPageIndex;
		p.id = 'page-' + inPageIndex;
		inNodes[inPageIndex] = p;
	},
	// implementation for page manager
	pageExists: function(inPageIndex) {
		return Boolean(this.getDefaultPageNode(inPageIndex));
	},
	measurePage: function(inPageIndex) {
		return this.getDefaultPageNode(inPageIndex).offsetHeight;
	},
	positionPage: function(inPageIndex, inPos) {
		this.positionPageNode(this.getDefaultPageNode(inPageIndex), inPos);
	},
	repositionPages: function(inPageIndex) {
		this.repositionPageNodes(inPageIndex, this.getDefaultNodes());
	},
	preparePage: function(inPageIndex, inReuseNode) {
		this.preparePageNode(inPageIndex, (inReuseNode ? this.pageOut() : null), this.getDefaultNodes());
	},
  installPage: function(inPageIndex) {
		this.contentNode.appendChild(this.getDefaultPageNode(inPageIndex));
	},
	destroyPage: function(inPageIndex) {
		var p = this.invalidatePageNode(inPageIndex, this.getDefaultNodes());
		wm.remove(p);
	},
	// rendering implementation
	renderPage: function(inPageIndex) {
		var node = this.pageNodes[inPageIndex];
		for (var i=0, j=inPageIndex*this.rowsPerPage; (i<this.rowsPerPage)&&(j<this.rowCount); i++, j++)
			this.renderRow(j, node);
	},
	removePage: function(inPageIndex) {
		for (var i=0, j=inPageIndex*this.rowsPerPage; i<this.rowsPerPage; i++, j++)
			this.removeRow(j);
	},
	// scroll control
	getPageRow: function(inPage) {
		return inPage * this.rowsPerPage;
	},
	getLastPageRow: function(inPage) {
		return Math.min(this.rowCount, this.getPageRow(inPage + 1)) - 1;
	},
	getFirstVisibleRowNodes: function(inPage, inPageTop, inScrollTop, inNodes) {
		var row = this.getPageRow(inPage);
		var rows = wm.divkids(inNodes[inPage]);
		for (var i=0,l=rows.length; i<l && inPageTop<inScrollTop; i++, row++)
			inPageTop += rows[i].offsetHeight;			
		return (row ? row - 1 : row);
	},
	getFirstVisibleRow: function(inPage, inPageTop, inScrollTop) {
		//wm.debugf('scroller.getFirstVisibleRow(%d, %d, %d)', inPage, inPageTop, inScrollTop);
		if (!this.pageExists(inPage)) 
			return 0;
		return this.getFirstVisibleRowNodes(inPage, inPageTop, inScrollTop, this.getDefaultNodes());
	},
	getLastVisibleRowNodes: function(inPage, inBottom, inScrollBottom, inNodes) {
		var row = this.getLastPageRow(inPage);
		var rows = wm.divkids(inNodes[inPage]);
		for (var i=rows.length-1; i>=0 && inBottom>inScrollBottom; i--, row--)
			inBottom -= rows[i].offsetHeight;			
		return row + 1;
	},
	getLastVisibleRow: function(inPage, inBottom, inScrollBottom) {
		if (!this.pageExists(inPage)) 
			return 0;
		return this.getLastVisibleRowNodes(inPage, inBottom, inScrollBottom, this.getDefaultNodes());
	},
	findTopRowForNodes: function(inScrollTop, inNodes) {
		var rows = wm.divkids(inNodes[this.page]);
		for (var i=0,l=rows.length,t=this.pageTop,h; i<l; i++) {
			h = rows[i].offsetHeight;
			t += h;			
			if (t >= inScrollTop) {
				this.offset = h - (t - inScrollTop);
				return i + this.page * this.rowsPerPage;
			}
		}
		return -1;
	},
	findScrollTopForNodes: function(inRow, inNodes) {
		var rowPage = Math.floor(inRow / this.rowsPerPage);
		var t = 0;
		for (var i=0; i<rowPage; i++)
			t += this.getPageHeight(i);
		this.pageTop = t;
		this.needPage(rowPage, this.pageTop);
		var rows = wm.divkids(inNodes[rowPage]);
		var r = inRow - this.rowsPerPage * rowPage;
		for (var i=0,l=rows.length; i<l && i<r; i++)
			t += rows[i].offsetHeight;			
		return t;
	},
	findTopRow: function(inScrollTop) {
		return this.findTopRowForNodes(inScrollTop, this.getDefaultNodes());
	},
	findScrollTop: function(inRow) {
		return this.findScrollTopForNodes(inRow, this.getDefaultNodes());
	},
	dummy: 0
});

dojo.declare('wm.scroller.columns', wm.scroller, {
	constructor: function(inContentNodes) {
		this.setContentNodes(inContentNodes);
	},
	// nodes
	setContentNodes: function(inNodes) {
		this.contentNodes = inNodes;
		this.colCount = (this.contentNodes ? this.contentNodes.length : 0);
		this.pageNodes = [ ];
		for (var i=0; i<this.colCount; i++)
			this.pageNodes[i] = [ ];
	},
	getDefaultNodes: function() {
		return this.pageNodes[0] || [ ];
	},
	scroll: function(inTop) {
		if (this.colCount)
			wm.scroller.prototype.scroll.call(this, inTop);
	},
	// resize
	resize: function() {
		if (this.scrollboxNode)
			this.windowHeight = this.scrollboxNode.clientHeight;
		for (var i=0; i<this.colCount; i++)
			wm.setStyleHeightPx(this.contentNodes[i], this.height);
	},
	// implementation for page manager
	positionPage: function(inPageIndex, inPos) {
		for (var i=0; i<this.colCount; i++) {
			this.positionPageNode(this.pageNodes[i][inPageIndex], inPos);
		}
	},
	preparePage: function(inPageIndex, inReuseNode) {
		var p = (inReuseNode ? this.pageOut() : null);
		for (var i=0; i<this.colCount; i++)
			this.preparePageNode(inPageIndex, p, this.pageNodes[i]);
	},
  installPage: function(inPageIndex) {
		for (var i=0; i<this.colCount; i++)
			this.contentNodes[i].appendChild(this.pageNodes[i][inPageIndex]);
	},
	destroyPage: function(inPageIndex) {
		for (var i=0; i<this.colCount; i++)
			wm.remove(this.invalidatePageNode(inPageIndex, this.pageNodes[i]));
	},
	// rendering implementation
	renderPage: function(inPageIndex) {
		var nodes = [ ];
		for (var i=0; i<this.colCount; i++)
			nodes[i] = this.pageNodes[i][inPageIndex];			
		for (var i=0, j=inPageIndex*this.rowsPerPage; (i<this.rowsPerPage)&&(j<this.rowCount); i++, j++)
			this.renderRow(j, nodes);
	}
});