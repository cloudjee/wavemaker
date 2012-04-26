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

dojo.provide("wm.base.widget.VirtualList");

dojo.declare("wm.VirtualListItem", null, {
	selected: false,
	className: 'wmlist-item',
	constructor: function(inList, inText, inImage) {
		this.list = inList;
		this.connections = [];
		this.create();
		this.setContent(inText, inImage);
	},
	destroy: function() {
		dojo.forEach(this.connections, function(inConnect) { dojo.disconnect(inConnect) });
	},
	create: function() {
		var n = this.domNode = document.createElement('div');
		dojo.addClass(n, this.className);
		this.makeConnections();
	},
	makeConnections: function() {
		this.connections = [
		    dojo.connect(this.domNode, 'mouseover', this, 'mouseover'),
		    dojo.connect(this.domNode, 'mouseout', this, 'mouseout')
		];
	    if (!wm.isMobile) {
		this.connections.push(dojo.connect(this.domNode,'click', this, function(evt) {
		    wm.onidle(this,'click',{target: evt.target});
		}));
		this.connections.push(
		    dojo.connect(this.domNode, 'dblclick', this, function(evt) {
			wm.onidle(this, 'dblclick',{target: evt.target});
		    }));
	    } else if (wm.isFakeMobile) {
		this.connections.push(dojo.connect(this.domNode,'onmousedown', this, "touchStart"));
		this.connections.push(dojo.connect(this.domNode,'onmousemove', this, "touchMove"));
		this.connections.push(dojo.connect(this.domNode,'onmouseup', this, "touchEnd"));
	    } else {
		this.connections.push(dojo.connect(this.domNode,'ontouchstart', this, "touchStart"));
		this.connections.push(dojo.connect(this.domNode,'ontouchmove', this, "touchMove"));
		this.connections.push(dojo.connect(this.domNode,'ontouchend', this, "touchEnd"));
	    }
	},
        touchStart: function(evt) {

	    if (this.list._ontouchstart) return;
	    if (!this.selected) {
		this._selectionIndicatorOnly = true;
		this.select();
		this.selected = false;
		this.list._ontouchstart =  this;
		wm.job(this.list.getRuntimeId() + "_" + this.index, app.touchToClickDelay, dojo.hitch(this, "touchEnd"));
	    }


	},
        touchMove: function(evt) {
    if (this.list._ontouchstart == this) {
	wm.cancelJob(this.list.getRuntimeId()+"_"+this.index);
	delete this.list._ontouchstart;
	if(this._selectionIndicatorOnly){
	    delete this._selectionIndicatorOnly;
	    this.deselect();
	}
    }
	},
    touchEnd: function(evt) {
	 wm.cancelJob(this.list.getRuntimeId() + "_" + this.index);
	if (this.list._ontouchstart == this) {
	    this.list._ontouchstart = null;
	    if (!evt) {
		evt = {target: this.domNode};
	    } 
	    this.click(evt);
	}
    },
	setContent: function(inContent) {
	    this.domNode.innerHTML = inContent;
	},
	getContent: function() {
		return this.domNode.innerHTML;
	},
	// events
	doOver: function() {
		dojo.addClass(this.domNode, this.className +'-over');
	},
	mouseover: function(e) {
		if (e&&e.currentTarget == this.domNode) {
			this.list._onmouseover(e, this);
		}
	},
	mouseout: function(e) {
		if (e.currentTarget == this.domNode)
			dojo.removeClass(this.domNode, this.className +'-over');
	},
	click: function(e) {
		this.list.onclick(e, this);
	},
	dblclick: function(e) {
		this.list.ondblclick(e, this);
	},
	select: function() {
	    console.log("SELECT:" + new Date().getTime() + ", " + dojo.indexOf(this.list.items, this));
	    this.selected = true;
	    dojo.addClass(this.domNode, this.className +'-selected');
	},
	deselect: function() {
		this.selected = false;
		dojo.removeClass(this.domNode, this.className +'-selected');
	}
});

dojo.declare("wm.VirtualList", wm.Control, {
        manageHistory: true,
	headerVisible: true,
	toggleSelect: false,
	width: "250px",
	height: "150px",
	box: "v",
	selectionMode: "single",
        _selectionMode: "single",
	className: "wmlist",
	selectedItem: null,
	init: function() {
		this.inherited(arguments);
		this.items = [];
		this.selection = [];
	    this.selectedItem = new wm.Variable({name: "selectedItem", owner: this, isList: this._selectionMode == "multiple"});
		this.createHeaderNode();
		this.createListNode();
		this.domNode.appendChild(this.headerNode);
		this.domNode.appendChild(this.listNode);
		this.setHeaderVisible(this.headerVisible);
	    if (this.onselect)
		this.connect(this, "onSelect", this, "onselect"); // changed from onselect to onSelect for grid compatibility
	    if (this.ondeselect)
		this.connect(this, "onDeselect", this, "ondeselect");// changed from onselect to onSelect for grid compatibility
	    if (app._touchEnabled) {
		wm.conditionalRequire("lib.github.touchscroll.touchscroll"+ (djConfig.isDebug ? "" : "min"));
		this._listTouchScroll = new TouchScroll(this.listNode, {elastic:true,owner: this});
		this.listNode = this._listTouchScroll.scrollers.inner;
		this._listTouchScroll.scrollers.outer.style.position = "absolute";
		this._listTouchScroll.scrollers.outer.style.left = "0px";
		this._listTouchScroll.scrollers.outer.style.top = "0px";
		this.connect(this._listTouchScroll, "setupScroller", this, "postSetupScroller");
	    }

	},
    postSetupScroller: function() {
	var touchScrollOuter = this._listTouchScroll.scroller ? this._listTouchScroll.scroller.outer : null;
	if (touchScrollOuter) {
	    touchScrollOuter.style.width = "100%";
	}
    },
	dataSetToSelectedItem: function(inDataSet) {
		this.selectedItem.setLiveView((inDataSet|| 0).liveView);
		this.selectedItem.setType(inDataSet ? inDataSet.type : "any");
	},
	getCount: function() {
		return this.items.length;
	},
	getItem: function(inIndex) {
		return this.items[inIndex];
	},
	getItemByCallback: function(callback) {
	  for (var i= 0; i < this.getCount(); i++) {
	    var d = this.items[i].getData();
	    if (callback(d)) {
	      return this.items[i];
	    }
	  }
	},
	getItemByFieldName: function(inName, inValue) {
	  for (var i= 0; i < this.getCount(); i++) {
	    var d = this.items[i].getData();
	    if (d[inName] == inValue) {
	      return this.items[i];
	    }
	  }
	},

	// rendering
	createListNode: function() {
		this.listNode = document.createElement('div');
		this.listNode.flex = 1;
		dojo.addClass(this.listNode, "wmlist-list");

	},
	createHeaderNode: function() {
		this.headerNode = document.createElement('div');
		dojo.addClass(this.headerNode, "wmlist-header");
	},

    renderBounds: function() {
	this.inherited(arguments);
	var hidden = this.isAncestorHidden();
	if (!this._listTouchScroll && this.headerVisible && !hidden) {
	    wm.job(this.getRuntimeId() + ".postRenderBounds", 1, dojo.hitch(this, "postRenderBounds"));	    
	}
	if (this._listTouchScroll && !hidden) {
	    wm.job(this.getRuntimeId() + ".postTouchRenderBounds", 1, dojo.hitch(this, "postTouchRenderBounds"));
	}

    },
    postRenderBounds: function() {
	if (!this.isAncestorHidden()) {
	    var coords = (this.noHeader || !this.headerVisible) ? {h:0} : dojo.marginBox(this.headerNode);
	    var bodyheight = this.getContentBounds().h - coords.h;
	    console.log("LIST DOM:" + this.bounds.h + " | " + bodyheight);
	    this.listNode.style.height = bodyheight + "px";
	}
    },
    postTouchRenderBounds: function() {
	var coords = dojo.marginBox(this.headerNode);
	var bodyheight = this.getContentBounds().h - coords.h;
	this._listTouchScroll.scrollers.outer.parentNode.height = bodyheight + "px";

	var b = this.getContentBounds();
	var s = this._listTouchScroll.scrollers.outer.style;
	var changed = s.width != (b.w + "px") || s.height != (b.h - coords.h) + "px";
	if (changed) {
	    this._listTouchScroll.scrollers.outer.parentNode.style.width = this.listNode.style.width = s.width = b.w + "px";
	    s.height = (b.h - coords.h) + "px";
	}
	this._listTouchScroll.scrollers.outer.style.top = "0px";//coords.h + "px";
	if (this.updateHeaderWidth)
	    this.updateHeaderWidth();
	if (changed) {
	    this._listTouchScroll.setupScroller();
	}
    },
	clear: function(noEvents) {
		this._setHeaderVisible(false);
		while (this.getCount())
			this.removeItem(this.getCount()-1);
		this.deselectAll(noEvents);
	        this._clearSelectedData();
	},
	createItem: function(inContent) {
		return new wm.VirtualListItem(this, inContent);
	},
	addItem: function(inContent, inIndex) {
		var li = this.createItem(inContent), ln = this.listNode;
		dojo.setSelectable(li.domNode, false);
		if (inIndex!= undefined) {
			this.items.splice(inIndex, 0, li);
			li.index = inIndex;
			this.selection.splice(inIndex, 0, false);
			this.updateItemIndexes(inIndex+1, 1);
			var sibling = ln.childNodes[inIndex];
			if (sibling)
				ln.insertBefore(li.domNode, ln.childNodes[inIndex]);
			else
				ln.appendChild(li.domNode);
		} else {
			this.items.push(li);
			li.index = this.items.length-1;
			ln.appendChild(li.domNode);
		}
	},
	removeItem: function(inIndex) {
		var li = this.getItem(inIndex);
		if (li) {
			this.listNode.removeChild(li.domNode);
			this.items.splice(inIndex, 1);
			this.selection.splice(inIndex, 1);
			this.updateItemIndexes(inIndex, -1);
			li.destroy();
		}
	},
	updateItemIndexes: function(inStart, inDelta) {
		for (var i= inStart, l=this.getCount(), li; i<l&&(li=this.items[i]); i++)
			li.index += inDelta;
	},
	removeItems: function(inIndexes) {
		for (var i=inIndexes.length, index; ((index=inIndexes[i])!= undefined); i--)
			this.removeItem(index);
	},
	modifyItem: function(inIndex, inContent) {
		var li = this.getItem(inIndex);
		(li ? li.setContent(inContent) : this.addItem(inContent));
	},
	// header rendering
	renderHeader: function(inHtml) {
		this.headerNode.innerHTML = inHtml;
	},
	_setHeaderVisible: function(inHeaderVisible) {
		this.headerNode.style.display = inHeaderVisible ? '' : 'none';
	},
	setHeaderVisible: function(inHeaderVisible) {
		this.headerVisible = inHeaderVisible;
			if (this.headerVisible)
				this.renderHeader();
			this._setHeaderVisible(this.headerVisible);
			this.reflow();
	},
	// selection
/*
	_setSelected: function(inItem) {
		this.selected = inItem;
		if (this.selected)
			this.selectedItem.setData(this.selected);
		else
			this.selectedItem.clearData();
	},
	*/
    _addSelectedData: function(inItem) {
	if (this._selectionMode == "multiple") {
	    if (!dojo.isArray(this.selected))
		this.selected = [];
	    if (inItem && dojo.indexOf(this.selected,inItem.index) == -1)
		this.selected.push(inItem.index);
	    var data = [];
	    dojo.forEach(this.selected, dojo.hitch(this, function(index) {
		var v = this.getItemData(index);
		if (typeof v == "object") {
		    data.push(v);
		} else {
		    data.push({dataValue: v});
		}
	    }));
	    this.selectedItem.setData(data);
	    this.setValue("emptySelection", this.selected.length == 0);
	    this.setValue("isRowSelected", this.selected.length > 0);
	} else {
		this.selected = inItem;
		var
			d = this.selected ? this.selected.getData() : {},
			s = this.selectedItem;
		if (dojo.isObject(d) && !wm.typeManager.getType(s.type))
			s.setDataSchema(d);
		if (this.selected && dojo.isObject(d))
			s.setData(d);
		else
			s.clearData();
		this.setValue("emptySelection", Boolean(!this.selected));
	        this.setValue("isRowSelected", Boolean(this.selected));
	    }
	},
    _removeSelectedData: function(inItem) {
	if (this._selectionMode == "multiple") {
	    this.selected = wm.Array.removeElement(this.selected, inItem.index);
	}
	this._addSelectedData(null);
    },
    _clearSelectedData: function() {
	this.selected = this._selectionMode == "multiple" ? [] : null;
	this.selectedItem.setData(null);
	this.setValue("emptySelection", true);
	this.setValue("isRowSelected", false);
    },

	addToSelection: function(inItem) {
		if (!inItem)
			return;
		this.selection[inItem.index] = true;
		this.lastSelected = this.selected;
		this._addSelectedData(inItem);
		inItem.select();
	},
	removeFromSelection: function(inItem) {
		this.selection[inItem.index] = false;
		inItem.deselect();
	    this._removeSelectedData(inItem);
		//this._setSelected(this.lastSelected);
	},
	deselectAll: function(ignoreSelectedItem) {
		dojo.forEach(this.items, function(i) {
			i.deselect();
		});
	        var count = this.selection ? this.selection.length : 0;
		this.selection = [];
		if (!ignoreSelectedItem && count) {
		    this._clearSelectedData();
		    this.onSelectionChange();
		}
	},
	isSelected: function(inItem) {
		return this.selection[inItem.index];
	},
	ctrlSelect: function(inItem) {
		if (this.isSelected(inItem))
			this.eventDeselect(inItem);
		else
			this.eventSelect(inItem);
	},
	shiftSelect: function(inItem) {
		var t = s = (this.selected || this.lastSelected || 0).index, e = inItem.index, t;
		this.deselectAll();
		if (s > e) {
			s = e;
			e = t;
		}
		for (var i=s, li; i<=e && (li=this.getItem(i)); i++)
			this.addToSelection(li);
	},
	clickSelect: function(inItem, inEvent) {
	    if (this._selectionMode == "none") return;
	    var selectedIndexWas = this.getSelectedIndex();
	    if (this._selectionMode == "multiple" && (inEvent.ctrlKey || inEvent.shiftKey)) {
		if (inEvent.ctrlKey) {
		    this.ctrlSelect(inItem);
		} else if (inEvent.shiftKey) {
		    this.shiftSelect(inItem);
		}
	    } else if (this._selectionMode == "multiple") {
		    if (dojo.indexOf(this.selected, inItem.index) == -1) {
			//this.addToSelection(inItem);
			this.eventSelect(inItem);
		    } else {
			//this.removeFromSelection(inItem);
			this.eventDeselect(inItem, false);
		    }
		} else {
			var s = this.selected, oldIndex = s && s.index, newIndex = inItem.index;
			if (oldIndex !== newIndex){
			        this.eventDeselect(inItem,true);			        
				this.eventSelect(inItem);
			} else {
			    if (this.toggleSelect) 
					this.eventDeselect(inItem);
			}
		}
		if (!this._isDesignLoaded && !this._handlingBack && this.manageHistory) {
		    app.addHistory({id: this.getRuntimeId(),
				    options: {selectedRow: selectedIndexWas},
				    title: "SelectionChange"});
		}
	    
	},
    eventDeselect: function(inItem, ignoreSelectedItem) {
		if (this._selectionMode == "multiple")
			this.removeFromSelection(inItem);
		else
			this.deselectAll(ignoreSelectedItem);
	    if (!ignoreSelectedItem) {
		wm.job(this.getRuntimeId() + ".eventSelect", 0, dojo.hitch(this, function() {
		    this.onDeselect(inItem);
		    this.onSelectionChange();
		}));
	    }
	},
	eventSelect: function(inItem) {
		var selectInfo = {canSelect: true};
		this._oncanselect(inItem, selectInfo);
		if (selectInfo.canSelect) {
			/* candidate for a wm.onidle, but unfortunately, that will make javascript calls that use this async and will likely fail */
		    this.addToSelection(inItem);

		    /* Seperates the thread for indicating/giving feedback as to a selection and the thread for handling
		     * events from the selection which might slow down the rendering or hide the rendering of the selection inidcator */
		    if (!this._cupdating) {
			wm.job(this.getRuntimeId() + ".eventSelect", 0, dojo.hitch(this, function() {
			    this.onSelect(inItem);
			    this.onSelectionChange();
			}));
		    }
		//}));
		}
	},
	select: function(inItem) {
		if (inItem) {
			this.deselectAll();
			this.addToSelection(inItem);
		}
	},
	selectByIndex: function(inIndex) {
		var i = this.getItem(inIndex);
		if (i)
			this.select(i);
	},
	getSelectedIndex: function() {
	    if (this._selectionMode == "multiple")
		return this.selected;
	    else
		return this.selected ? this.selected.index : -1;
	},
    handleBack: function(inOptions) {
	this._handlingBack = true;
	try {
	    var selectedRow = inOptions.selectedRow;
	    this.select(selectedRow);
	} catch(e) {}
	delete 	this._handlingBack;
	return true;
    },
	// events
	_oncanmouseover: function(inEvent, inItem, inMouseOverInfo) {
	},
	onclick: function(inEvent, inItem) {
	    
	    var target = inEvent.target;
	    if (target.firstChild && dojo.attr(target.firstChild, "wmcontroller")) {
		target = target.firstChild;
	    }

	    if (target && dojo.attr(target, "wmcontroller")) {
		if (target.type == "checkbox") {
		    if (target.checked) {
			this.eventSelect(inItem);
		    } else {
			this.eventDeselect(inItem);
		    }
		} else if (target.type == "radio") {
		    var toggleSelectWas = this.toggleSelect;
		    this.toggleSelect = false;
		    this.clickSelect(inItem, inEvent);
		    this.toggleSelect = toggleSelectWas;
		} else if (dojo.hasClass(target, "wmDeleteColumn") || dojo.hasClass(target, "wmDeleteColumnImage")) {
		    this._deleteItem(inItem);
		}
	    } else {
		this.clickSelect(inItem, inEvent);
	    }
	},
    _deleteItem: function(inItem) {
	if (this.deleteConfirm) {
	    app.confirm(this.deleteConfirm, false, dojo.hitch(this, function() {
		this.deleteItem(inItem);
	    }));
	} else {
	    this.deleteItem(inItem);
	}
    },
    deleteItem: function(inItem) {
	var index = dojo.indexOf(this.items, inItem);
	wm.Array.removeElementAt(this.items, index);
	dojo.destroy(inItem.domNode);
	return index;
    },
	ondblclick: function(inEvent, inItem) {
	},
    onSelectionChange: function() {}, // Added for DojoGrid compatability
    onselect: function(inItem) {
	},
	ondeselect: function(inItem) {
	},
	onSelect: function(inItem) {
	},
	onDeselect: function(inItem) {
	},

	_oncanselect: function(inItem, inSelectInfo) {
	},
	_onmouseover: function(inEvent, inItem) {
		var mouseOverInfo = {canMouseOver: true};
		this._oncanmouseover(inEvent, inItem, mouseOverInfo);
		if (mouseOverInfo.canMouseOver) {
			inItem.doOver();
		}
	}
});

