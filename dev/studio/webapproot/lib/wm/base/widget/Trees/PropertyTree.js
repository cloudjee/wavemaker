/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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



dojo.provide("wm.base.widget.Trees.PropertyTree");
dojo.require("wm.base.widget.Trees.Tree");


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
		    var item = variable;
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
	    return makeTextPropEdit(inName, inValue, inDefault, 15)
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
