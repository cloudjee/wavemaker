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
dojo.provide("wm.base.widget.PropTree");
dojo.require("wm.base.widget.Tree");

dojo.declare("wm.TreePropNode", wm.TreeNode, {
	createNode: function(inContent) {
		var li = this.domNode = document.createElement("li"), editor = this.editor ? '<input type="text" value: ' + this.editor + '>' : '';
		li.innerHTML = '<img/><div>' + inContent + '</div><div class="wmproptree-edit">' + editor + '</div>';
		this.btnNode = li.firstChild;
		this.contentNode = this.btnNode.nextSibling;
		this.editorNode = this.contentNode.nextSibling;
		this.editorNode.style.left = this.tree.propWidth;
		this.editorNode.style.width = this.tree.editWidth;
	},
	styleContent: function() {
		this.contentNode.className = "wmproptree-prop";
	},
	styleNode: function() {
		this.inherited(arguments);
		this.btnNode.style.height = this.btnNode.src.indexOf(this.images.none) != -1 ? "26px" : "";
	},
	connectNode: function() {
		this.inherited(arguments);
	}
});

dojo.declare("wm.PropTree", wm.Tree, {
	connectors: false,
	propWidth: "170px",
	editWidth: "150px",
	init: function() {
		this.inherited(arguments);
		dojo.addClass(this.domNode, "wmproptree");
	}
});