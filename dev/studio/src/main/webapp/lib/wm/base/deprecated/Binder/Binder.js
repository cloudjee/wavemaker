/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.pages.Binder.Binder");

dojo.require("wm.base.components.Binding");
dojo.require("wm.studio.app.binding");

dojo.declare("Binder", wm.Page, {
    i18n: true,

	//===========================================================================
	// Initialization / setup
	//===========================================================================
	start: function() {
		this.update();
	},
	update: function() {
		if (this.sourceBinder && this.binding) {
			this.buildSourceTree();
			this.updateTarget();
		}
	},
	updateTarget: function() {
		this.sourceBinder.expressionEditor.clear();
		this.buildTargetTree();
		this.disEnableBinding(true);
	},
	buildTargetTree: function() {
		var t = this.targetTree;
		t.clear();
		var target = null;
		var n = new wm.BindTargetTreeNode(t.root, {object: this.binding.owner, closed: false});
	},
	buildSourceTree: function() {
		if (this.sourceBinder)
			this.sourceBinder.initBinding();
	},
	//===========================================================================
	// Binding
	//===========================================================================
	isRootTargetNode: function(inNode) {
		return inNode == inNode.tree.root.kids[0];
	},
	getRootTargetNode: function() {
		return this.targetTree.root.kids[0];
	},
	isTarget: function(inObject) {
		return (inObject == this.binding.owner);
	},
	doBinding: function() {
		if (this.sourceBinder.applyBinding(this.target))
			this.postApplyBinding();
	},
	postApplyBinding: function() {
		// update ui
		// we're binding the owner, root node.
		var isBindingOwner = this.isRootTargetNode(this.target);
		if (isBindingOwner) {
			this.updateTarget();
			this.targetTree.select(this.getRootTargetNode());
		} else
			this.updateNode(this.target);
	},
	updateNode: function(inNode) {
		inNode.updateNodeContent();
	},
	disEnableBinding: function(inDisabled) {
		var sb = this.sourceBinder;
		sb.tree.setDisabled(inDisabled);
		sb.expressionEditor.setDisabled(inDisabled);
	},
	//===========================================================================
	// Event implemenations
	//===========================================================================
	// target side
	targetTreeSelect: function(inSender, inNode) {
		this.target = inNode.targetProperty || inNode.isProperty ? inNode : null;
		this.sourceBinder.tree.deselect();
		this.sourceBinder.updateUiForWire(wm.data.getPropWire(inNode.object, inNode.targetProperty));
		this.disEnableBinding(false);
	},
	targetTreeDeselect: function(inSender, inNode) {
		this.target = null;
		this.disEnableBinding(true);
	},
	clearButtonClick: function() {
		if (this.target) {
			this.sourceBinder.tree.deselect();
			this.target.clearBinding();
			if (this.isRootTargetNode(this.target))
				this.updateTarget();
			else
				this.updateNode(this.target);
		}
	},
	clearAllButtonClick: function() {
		this.getRootTargetNode().clearBinding();
		this.sourceBinder.tree.deselect();
		this.updateTarget();
	},
	// source side
	sourceBinderBindNodeSelected: function(inSender, inNode) {
		if (inNode && this.sourceBinder.canBind(this.target, inNode))
			this.sourceBinder.bindEditor.setValue("dataValue", inNode.source);
	},
	bindButtonClick: function(inSender) {
		this.doBinding();
	}
});
