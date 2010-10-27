/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Tree");

try { 
	document.execCommand("BackgroundImageCache", false, true); 
} catch(e) {
};

dojo.addOnLoad(function() {
	wm.preloadImage(wm.theme.getImagesPath() + "tree_blank.gif");
});

dojo.declare("wm.TreeNode", null, {
	images: { none: "tree_blank.gif", leaf: "tree_leaf.gif", closed: "tree_closed.gif", open: "tree_open.gif" },
	classes: { leaf: "wmtree-leaf", lastLeaf: "wmtree-last-leaf", lastItem: "wmtree-last-item", content: "wmtree-content", selected: "wmtree-selected", rootLeaf: "wmtree-root-leaf", rootLastLeaf: "wmtree-root-last-leaf", open: "wmtree-open" },
	closed: false,
	canSelect: true,
	constructor: function(inParent, inProps) {
		this.addParent(inParent);
		this.initProps(inProps);
		this.placeInParent();
		if (!this.tree._updating)
			this.render();
	},
	destroy: function() {
		this.forEachDescendant(function(n) {
			n._destroy();
		});
		this._destroy();
	},
	destroy: function() {
		if (this.tree.nodes[this.id])
			this.tree._removeNode(this);
		if (this.parent)
			wm.fire(this.parent, "_remove", [this]);
		if (this != this.tree.root) {
			var d = this.domNode;
			dojo._destroyElement(d);
		}
	},
	addParent: function(inParent) {
		this.parent = inParent;
		this.tree = inParent.tree;
		this.tree._addNode(this);
	},
	initProps: function(inProps) {
		inProps = inProps || {};
		dojo.mixin(this, {
			kids: [],
			content: "",
			data: {},
			_data: {},
			//_childrenRendered: this.closed,
			imageRoot: this.tree._imageRoot
		}, inProps);
		// FIXME: wtf?
		if (this.closed)
			this._childrenRendered = false;
	},
	placeInParent: function() {
		var i = this.parentIndex;
		if (i !== undefined)
			this.parent.kids.splice(i, 0, this);
		else
			this.parent.kids.push(this);
	},
	render: function() {
		this.createNode();
		this.domNode.nodeId = this.id;

		this.styleContent();
		// Note: do as much as we can before adding to dom.
		this.parent.renderChild(this);
		if (this.selected)
			this.tree.selected = this;
		if (!this.closed)
			this.initKids();
	},
	createKidsNode: function() {
		var n = this.kidsNode = document.createElement("ul")
		n.style.display = (this.closed ? "none" : "");
		return n;
	},
	formatImage: function(inImage, inImageSize) {
		inImage = inImage || this.image;
		inImageSize = inImageSize || this.imageSize || 16;
		return inImage ? ['<img src="', inImage, '" style="height: ', inImageSize, 'px; width: ', inImageSize, 'px;">&nbsp;'].join('') : "";
	},
	formatContent: function() {
		i = this.formatImage();
		return [i, i ? '&nbsp;' : '', this.content].join('');
	},
	createNode: function() {
		var li = this.domNode = document.createElement("li");
		li.innerHTML = "<img/><span>" + this.formatContent() + "</span>";
		this.btnNode = li.firstChild;
		this.contentNode = this.btnNode.nextSibling;
	},
	isLastChild: function() {
		var k = this.parent.kids;
		return this == k[k.length-1];
	},
	isRoot: function() {
		return (this.parent == this.tree.root) && (this == this.tree.root.kids[0]);
	},
	isSelected: function() {
		return this == this.tree.selected;
	},
	styleNode: function() {
		var n=this.domNode, i=n.firstChild, isLast=this.isLastChild(), isRoot=this.isRoot();
		if (!n)
			return;
		// img class (check if last or root)
		var ic = (isLast ? this.classes.lastLeaf : this.classes.leaf);
		if (isRoot)
			ic = (isLast ? this.classes.rootLastLeaf : this.classes.rootLeaf);
		if (i && i.className != ic)
			i.className = ic;
		// node class
		var nc = (isLast ? this.classes.lastItem : "") + (this.closed ? "" : " " + this.classes.open);
		if (n.className != nc)
			n.className = nc;
		// FIXME: not a good check for if we have unrendered children (might be lazy)
		var hasChildren = !this._childrenRendered && (this.hasChildren || this._hasChildren || (this._data.children && this._data.children.length));
		// img src
		var img = !this.kids.length && !hasChildren ? this.images.none : (this.closed ? this.images.closed : this.images.open), s = this.imageRoot + img;
		if (i && i.src != s)
			i.src = s;
	},
	styleNodeNoDom: function() {
		var d = this.domNode, p = d.parentNode;
		if (p)
			p.removeChild(d);
		this.styleNode();
		if (p)
			p.appendChild(d);
	},
	// called for children
	renderChild: function(inChild) {
		// Note: do as much as we can before adding to dom.
		var i = dojo.indexOf(this.kids, inChild);
		if (i == -1) {
		  inChild.placeInParent(inChild);
		  i = dojo.indexOf(this.kids, inChild);
		}

		if (this.kids.length == 1){
			this.styleNode();
			this.domNode.appendChild(this.createKidsNode());
		} else if (i == this.kids.length-1){
			// when adding, need to style previous to address change in node position
			var c = this.kids[this.kids.length-2];
			// slight speed bump to style when node outside dom.
			c.styleNodeNoDom();
		} else ;
		inChild.styleNode();
		dojo.setSelectable(inChild.domNode, false);
		if (i == this.kids.length-1)
			this.kidsNode.appendChild(inChild.domNode);
		else
			this.kidsNode.insertBefore(inChild.domNode, this.kids[i+1].domNode);
	},
	_findIndexInParent: function(inChild) {
		var parent = inChild.parent;
		if (parent) {
			for (var i=0, l=parent.kids.length, k; i<l && (k=parent.kids[i]); i++) {
				if (inChild == k)
					return i;
			}
		}
		return -1;
	},
	remove: function(inChild) {
		inChild.destroy();
	},
	_remove: function(inChild) {
		var i = this._findIndexInParent(inChild);
		if (i>=0) {
			var last = (i == this.kids.length - 1);
			this.kids.splice(i, 1);
			if (last && this.kids.length)
					this.kids[this.kids.length-1].styleNode();
			if (!this.kids.length)
				this.styleNode();
			return true;
		}
	},
	removeChildren: function() {
		while (this.kids.length) {
			this.remove(this.kids[0]);
		}
	},
	initKids: function() {
		if (!this._childrenRendered) {
			if (this.initNodeChildren)
				this.initNodeChildren(this);
			else
				this.tree.initNodeChildren(this);
		}
		this._childrenRendered = true;
	},
	setOpen: function(inOpen) {
		this.initKids();
		var c = this.closed
		this.closed = !inOpen;
		if (c != this.closed && this.kidsNode) {
			(this.closed ? wm.collapseNode : wm.expandNode)(this.kidsNode);
			this.styleNode();
		}
	},
	btnToggled: function(e) {
		this.tree.dispatchNodeEvent("Btnclick", this, e);
	},

	mousedown: function(e) {
	},
	click: function(e) {
		if (e.target == this.btnNode)
			this.btnToggled(e)
		else
			this.tree.dispatchNodeEvent("Click", this, e);
	},
	dblclick: function(e) {
		this.tree.dispatchNodeEvent("Dblclick", this, e);
	},
	styleContent: function() {
		this.contentNode.className = this.classes.content;
		if (this.selected)
			this.contentNode.className += " " + this.classes.selected;
	},
	setContent: function(inContent) {
		//var n = this.contentNode.lastChild || this.contentNode, c = " " + inContent;
		this.content = inContent;
		var
			c = this.formatContent(),
			n = this.contentNode;
		if (n.nodeType == 3)
			n.nodeValue = c;
		else
			n.innerHTML = c;
	},
	forEach: function(inFunc) {
		if (!inFunc)
			return;
		inFunc(this);
		this.forEachDescendant(inFunc);
	},
	forEachDescendant: function(inFunc) {
		for (var i=0, k, kids=this.kids; (k=kids[i]); i++)
			k.forEach(inFunc);
	},
	forEachChild: function(inFunc) {
		for (var i=0, k, kids=this.kids; (k=kids[i]); i++)
		  inFunc(k);
	},
	// Input parameter is a function testing to see if something is true for some descendant
	hasDescendant: function(inFunc) {
	  try {
	    if (inFunc(this)) return true;
	  } catch(e) {}
	  for (var i=0, k, kids=this.kids; (k=kids[i]); i++)
	    if (k.hasDescendant(inFunc)) return true;
	  return false;
	},
	// Input parameter is a function testing to see if something is true for some descendant
	findChild: function(inFunc) {
	  for (var i=0, k, kids=this.kids; (k=kids[i]); i++)
	    if (inFunc(k)) return k;
	  return null;
	},

	buildPathString: function(inFunc) {
	  if (this.parent == this.tree.root || this.parent == this.tree) return "";
	  return this.parent.buildPathString(inFunc) + "/" + this.data.getItemName();
	},
	findDomNode: function(inDomNode) {
	  if (this.domNode == inDomNode || this.contentNode == inDomNode) return this;
	  for (var i=0; i <  this.kids.length; i++) {
	    var result = this.kids[i].findDomNode(inDomNode);
	    if (result) return result;
	  }
	  return null;
	}
});

dojo.declare("wm.TreeCheckNode", wm.TreeNode, {
	checked: false,
	render: function() {
		this.inherited(arguments);
		this.setChecked(this.checked);
	},
	createNode: function() {
		var li = this.domNode = document.createElement("li");
		li.innerHTML = [
			'<img/><input type="checkbox" style="margin: 0 4px 0 0; padding:0;"',
			this.checked ? ' checked="yes"' : "",
			'><span>' + this.formatContent() + '</span>'
		].join("");
		this.btnNode = li.firstChild;
		this.checkboxNode = this.btnNode.nextSibling;
		this.contentNode = this.checkboxNode.nextSibling;
	},
	click: function(e) {
		if (e.target == this.checkboxNode)
			this.checkboxClick(e);
		else
			this.inherited(arguments);
	},
	checkboxClick: function(e) {
		this.tree.dispatchNodeEvent("Checkboxclick", this, e);
	},
	getChecked: function(inChecked) {
		return this.checkboxNode ? this.checkboxNode.checked : this.checked;
	},
	setChecked: function(inChecked) {
		this.checkboxNode.checked = inChecked;
	},
	toggleChecked: function() {
		this.setChecked(!this.checkBoxNode.checked);
	}
});

dojo.declare("wm.TreeRoot", wm.TreeNode, {
	render: function(inContent) {
		this.domNode = this.tree.domNode;
	},
	addParent: function(inTree) {
		this.parent = this.tree = inTree;
		this.tree._addNode(this);
	},
	styleNode: function() {
	},
	placeInParent: function() {
	}
});

dojo.declare("wm.Tree", wm.Box, {
	width: "",
	height: "",
	connectors: true,
	selected: null,
	autoScroll: true,
	init: function() {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmtree");
		this.setConnectors(this.connectors);
		this._nodeId = 0;
		this.nodes = [];
		this._imageRoot = wm.theme.getImagesPath();
		this.root = new wm.TreeRoot(this, "");
		this.connect(this.domNode, "onmousedown", this, "treeMouseDown");
		this.connect(this.domNode, "onclick", this, "treeClick");
		this.connect(this.domNode, "ondblclick", this, "treeDblClick");
	},
	setConnectors: function(inConnectors) {
		var c = this.connectors = inConnectors;
		dojo[c ? "removeClass" : "addClass"](this.domNode, "wmtree-noconnectors");
	},
	setDisabled: function(inDisabled) {
		this.inherited(arguments);
		if (inDisabled)
			this.deselect();
		dojo[inDisabled ? "addClass" : "removeClass"](this.domNode, "wmtree-disabled");
	},
	forEachNode: function(inFunc) {
		if (dojo.isFunction(inFunc))
			this.root.forEach(inFunc);
	},
	clear: function() {
		this._data = {};
		this._nodeId = 0;
		this.selected = null;
		this.domNode.innerHTML = "";
		this.nodes = [];
		this.root.destroy();
		this.root = new wm.TreeRoot(this, "");
	},
	toggle: function(inNode) {
		var old = this.selected, neo = this.selected = (old==inNode ? null : inNode);
		old && old.styleContent();
		(old!=neo) && neo && neo.styleContent();
	},
	// selection
	eventSelect: function(inNode) {
		var selectInfo = {canSelect: true};
		this._oncanselect(inNode, selectInfo);
		if (inNode.canSelect && selectInfo.canSelect) {
			this.select(inNode);
		}
	},
	addToSelection: function(inNode) {
		if (inNode) {
			this.selected = inNode;
			inNode.selected = true;
			inNode.styleContent();
			var
				n = inNode.domNode,
				d = this.domNode,
				fc = n.firstChild;
			if (n && d && fc) {
				var
					isAbove = (n.offsetTop < d.scrollTop),
					isBelow = (n.offsetTop + fc.offsetHeight > d.scrollTop + d.offsetHeight)
				if ((isAbove || isBelow) && wm.widgetIsShowing(this))
					n.scrollIntoView(false);
			}
		}
	},
	_deselect: function() {
		var old = this.selected;
		if (old) {
			if (this.selected)
				this.selected.selected = false;
			this.selected = null;
			old.styleContent();
		}
	},
	_select: function(inNode) {
		this._deselect();
		this.addToSelection(inNode);
	},
	deselect: function() {
		this.ondeselect(this.selected);
		this._deselect();
	},
	select: function(inNode) {
		if (this.selected != inNode) {
			this.deselect();
			this.addToSelection(inNode);
			this.onselect(inNode);
		}
	},
	// simple lazy loading
	initNodeChildren: function(inNode) {
		this.oninitchildren(inNode);
		this.renderDataNode(inNode, this.getNodeChildData(inNode));
	},
	getNodeChildData: function(inNode) {
		return inNode._data.children;
	},
	_render: function() {
		this.renderData(this._data);
	},
	renderData: function(inData) {
		this.clear();
		this._data = inData;
		// quicky profile...
		//var t = new Date();
		this.renderDataNode(this.root, this._data);
		//console.log("rendering took", new Date().valueOf() - t.valueOf());
		
	},
	renderDataNode: function(inParent, inData) {
		if (!inData)
			return;
		inParent._childrenRendered = true;
		dojo.forEach(inData, dojo.hitch(this, function(d) {
			var 
				p = {
					data: d.data || d.content, 
					_data: d, 
					checked: d.checked, 
					content: d.content, 
					closed: d.closed,
					image: d.image,
					_childrenRendered: true
				},
				n = new wm[d.type == "checkbox" ? "TreeCheckNode" : "TreeNode"](inParent, p);
			if (d.children && !d.closed)
				this.renderDataNode(n, d.children);
		}));
	},
	// node handling
	_addNode: function(inNode) {
		var id = this.makeNodeId();
		inNode.id = id;
		this.nodes[id] = inNode;
	},
	_removeNode: function(inNode) {
		this.nodes[inNode.id] = null;
	},
	makeNodeId: function() {
		return this._nodeId++;
	},
	// node event handlers
	findEventNode: function(e) {
		var n = e.target;
		while (n.nodeId === undefined && n != this.domNode) {
			n = n.parentNode;
		}
		if (n.nodeId !== undefined)
			return this.nodes[n.nodeId];
	},
	treeMouseDown: function(e) {
	  var n = this.findEventNode(e);
	  if (n) {
	    n.mousedown(e);
	    this.onmousedown(e,n);
	  }
	},
	treeClick: function(e) {
		var n = this.findEventNode(e);
		if (n)
			n.click(e);
		else
			this.deselect();
	},
	treeDblClick: function(e) {
		var n = this.findEventNode(e);
		if (n)
			n.dblclick(e);
	},
	dispatchNodeEvent: function(inEventName, inNode, inEvent) {
		if (this.disabled)
			inEvent._treeHandled = true;
		else {
			inEvent.treeNode = inNode;
			wm.fire(this, "node" + inEventName, [inNode, inEvent]);
		}
	},
	nodeClick: function(inNode, inEvent) {
		if (inEvent._treeHandled)
			return;
		inEvent._treeHandled = true;
		this.eventSelect(inNode);
		setTimeout(dojo.hitch(this, "onclick", inNode), 1);
		//this.onclick(inNode);
	},
	nodeDblclick: function(inNode, inEvent) {
		if (inEvent._treeHandled)
			return;
		inEvent._treeHandled = true;
		wm.clearSelection();
		this.ondblclick(inNode);
	},
	nodeCheckboxclick: function(inNode, inEvent) {
		if (inEvent._treeHandled)
			return;
		inEvent._treeHandled = true;
		this.oncheckboxclick(inNode, inEvent);
	},
	nodeBtnclick: function(inNode, inEvent) {
		if (inEvent._treeHandled)
			return;
		inEvent._treeHandled = true;
		inNode.setOpen(inNode.closed);
	},
	_nodeMatchesProps: function(inNode, inProps) {
		for (var i in inProps)
			if (inNode[i] != inProps[i])
				return;
		return true;
	},
	findNode: function(inProps, inStartNode) {
		var n = inStartNode || this.root;
		// FIXME: node should have iterators up to this task
		for (var i=0, k, c; (k=n.kids[i]); i++) {
			if (this._nodeMatchesProps(k, inProps))
				return k;
			else {
				c = this.findNode(inProps, k);
				if (c)
					return c;
			}
		}
	},
  findTreeNode: function(dataValue, inStartNode) { 
      var n = inStartNode || this.root;
      for (var i=0, k, c; (k=n.kids[i]); i++) {
          if (dataValue == k.data)
          return k;
      else {
          c = this.findTreeNode(dataValue, k);
          if (c)
            return c;
          }
      }                
  },
	findDomNode: function(inDomNode) {
	  return this.root.findDomNode(inDomNode);
	},
	// publish events
	onclick: function(inNode) {},
	_oncanselect: function(inNode, inSelectInfo) {},
	onmousedown: function(inNode) {},
	onselect: function(inNode) {},
	ondeselect: function(inNode) {},
//	oncheckboxclick: function(inNode) {}, // since we don't expose checkbox, don't expose the event
	ondblclick: function(inNode) {},
	oninitchildren: function(inNode) {
	}
});

wm.Object.extendSchema(wm.Tree, {
	disabled: { ignore: 1 },
	nodes: { ignore: 1}
});
wm.Tree.extend({
    themeable: false
});
wm.collapseNode = function(n, step, accel, interval) {
	n.style.display = "none";
	return;
	//
	var v=step||30, a=accel||5, i=interval||2, h=n._height=n.offsetHeight, s=n.style;
	function act() {
		h -= (v += a);
		if (h <= 0) {
			s.display = "none";
			s.height = "";
		} else {
			s.height = h + "px";
			setTimeout(act, i);
		}
	}
	act();
}

wm.expandNode = function(n, step, accel, interval) {
	if (n)
		n.style.display = "";
	return;
	//
	var v=step||30, a=accel||5, i=interval||2, h=0, s=n.style;
	s.display = "";
	if (!n._height) {
		var ns=n.parentNode.style, o=ns.overflow;
		ns.overflow = "hidden";
		n._height = n.offsetHeight;
		s.height = "1px";
		ns.overflow = o;
	} else s.height = "1px";
	function act() {
		h += (v += a);
		s.height = h + "px";
		if (n.offsetHeight + v >= n._height)  {
			s.height = "";
		} else {
			setTimeout(act, i);
		}
	}
	act();
}


/**************************************************************************************************************
 * CLASS: wm.PropertyTree
 * DESCRIPTION:
 *   Takes a dataSet which is a wm.Variable or subclass that has a list.  
 *   Each item in that list will be a node of the tree -- a child of the root node of the tree.
 *   The "mainContentField" property indicates the field of each item to display the node.
 *   The "propertyList" property is a comma separated list of
 *   EXAMPLE FROM CMDB Database
 *   dataSet: customerLiveVar
 *   { displayField: "customername",
 *     childNodes: {orderses: {displayField: "orderdate",
 *                             childNodes: {customers: {displayField: "customername"}}
 *                            }
 *                 }
 *   }
 * We can also get fancy and use displayExpression:
 * { displayExpression: "${customername} + ' : ' + ${phone}.substring(0,3) + '-' + ${phone}.substring(3,6) + '-' + ${phone}.substring(6,10)",
 *    childNodes:  {orderses: {displayExpression: "new Date(${orderdate}).toString()"},
 *                   customaddress: {displayExpression: "${addressline1} +'; ' + ${city} + ', ' + ${state}"}}
 *   }
 *                   
 *   childNodes is a hash of as many different properties as the designer wants
 *   LiveVariables are generated and fired by the tree to load childNode lists ondemand
 **************************************************************************************************************/
dojo.declare("wm.PropertyTree", wm.Tree, {
    dataSet: "",
    configJson: "",
    _treeConfig: null,

    selectedItem: null,  // wm.Variable that the selected item contains

    init: function() {
	this.inherited(arguments);
	this.setConfigJson(this.configJson);
	this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
	this.setDataSet(this.dataSet);
    },
    setConfigJson: function(inJson) {
	
	this.configJson = inJson;
	try { 
	    this._treeConfig = eval("(" + inJson + ")");
	    this.buildTree();
	} catch(e) {
	    console.error("Json error in " + this.name + ": " + e);
	}
    },

    setDataSet: function(inDataSet) {
	this.dataSet = inDataSet;
	if (inDataSet)
	    this.selectedItem.setType(inDataSet.type);
	this.buildTree();
    },
    set_dataSet: function(inDataSet) {
	// support setting dataSet via id from designer
	if (inDataSet && !(inDataSet instanceof wm.Variable)) {
	    var ds = this.getValueById(inDataSet);
	    if (ds)
		this.components.binding.addWire("", "dataSet", ds.getId());
	} else
	    this.setDataSet(inDataSet);
    },

    buildTree: function() {
	this.clear();  // remove all nodes so we can rebuild
	if (!this.dataSet || !this._treeConfig) return;


	var size = this.dataSet.getCount();
	for (var i = 0; i < size; i++) {
	    var item = this.dataSet.getItem(i);
	    var childProps = this._treeConfig.childNodes;
	    var hasChild = !wm.isEmpty(childProps);
	    var content;
	    if (this._treeConfig.displayExpression) {
		content = wm.expression.getValue(this._treeConfig.displayExpression, item);
	    } else {
		content = item.getValue(this._treeConfig.displayField);
	    }
	    var node = new wm.TreeNode(this.root, {closed: true,
						   data: item,
						   dataValue: null,
						   _nodeConfig: childProps,
						   content: content});
	    if (hasChild) {
		var blankChild = new wm.TreeNode(node, {close: true,
							content: "_PLACEHOLDER"});
	    }
	}

    },
    buildSubTree: function(inParentNode) {
	var parentChildProps = inParentNode._nodeConfig;
	for (var prop in parentChildProps) {
	    var value = inParentNode.data.getValue(prop);
	    if (value instanceof wm.Variable) {
		var variable = value;
		var props = parentChildProps[prop];
		var childNodes = props.childNodes;
		var hasChild = !wm.isEmpty(childNodes);
		if (variable.isList) {
		    var size = variable.getCount();
		    for (var i = 0; i < size; i++) {
			var item = variable.getItem(i);
			var content;
			if (props.displayExpression) {
			    content = wm.expression.getValue(props.displayExpression, item);
			} else {
			    content = item.getValue(props.displayField);
			}
			var node = new wm.TreeNode(inParentNode, {closed: true,
								  data: item,
								  propertyName: prop,
								  dataValue: null,
								  _nodeConfig: childNodes,
								  content: content});
			if (hasChild) {
			    var blankChild = new wm.TreeNode(node, {close: true,
								    content: "_PLACEHOLDER"});
			}
		    }
		} else {
		    var content;
		    if (props.displayExpression) {
			content = wm.expression.getValue(props.displayExpression, item);
		    } else {
			content = item.getValue(props.displayField);
		    }
		    var node = new wm.TreeNode(inParentNode, {closed: true,
							      data: variable,
							      propertyName: prop,
							      dataValue: null,
							      _nodeConfig: childNodes,
							      content: content});
		    if (hasChild) {
			var blankChild = new wm.TreeNode(node, {close: true,
								content: "_PLACEHOLDER"});
		    }
		}
	    } else {
		    var content;
		    if (parentChildProps[prop].displayExpression) {
			content = wm.expression.getValue(parentChildProps[prop].displayExpression, inParentNode.data);
		    } else {
			content = value;
		    }
		    var node = new wm.TreeNode(inParentNode, {closed: true,
							      data: inParentNode.data,
							      propertyName: prop,
							      dataValue: value,
							      content: content});
	    }
	}
    },
    initNodeChildren: function(inParentNode) {
	if (inParentNode.kids.length == 1 && inParentNode.kids[0].content == "_PLACEHOLDER") {
	    inParentNode.remove(inParentNode.kids[0]);
	    this.buildSubTree(inParentNode);
	}
    },
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "configJson":
	    return makeTextPropEdit(inName, inValue, inDefault)
	}
	return this.inherited(arguments);
    },
    select: function(inNode) {
	if (this.selected != inNode) {
	    this.deselect();
	    this.addToSelection(inNode);
	    this.selectedItem.setData(inNode.data);
	    var data = [inNode.data];
	    var node = inNode.parent;
	    while (node != this.root) {
		if (dojo.indexOf(data, node.data) == -1)
		    data.push(node.data);
		node = node.parent;
	    }
	    this.onselect(inNode, data, inNode.propertyName, inNode.dataValue);
	}
    },
    onselect: function(inNode, inSelectedDataList, inSelectedPropertyName, inSelectedPropertyValue) {},
    _end: 0
});

wm.Object.extendSchema(wm.PropertyTree, {
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true }
});