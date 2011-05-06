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




dojo.provide("wm.base.widget.Trees.Tree_design");
dojo.require("wm.base.widget.Trees.Tree");
dojo.require("wm.base.widget.Trees.ObjectTree");
dojo.require("wm.base.widget.Trees.PropertyTree");
dojo.require("wm.base.widget.Trees.DraggableTree");

wm.Object.extendSchema(wm.TreeNode, {
    data: {ignore: 1, doc: 1},
    closed: {ignore: 1, doc: 1},
    content: {ignore: 1, doc: 1},
    canSelect: {ignore: 1, doc: 1},
    destroy: {group: "method"},
    isSelected: {group: "method", returns: "Boolean"},
    removeChildren: {group: "method"},
    setOpen: {group: "method"},
    setContent: {group: "method"},    
    forEachDescendant: {group: "method"},    
    findDescendant: {group: "method", returns: "wm.TreeNode"}
});


wm.Object.extendSchema(wm.Tree, {
	disabled: { ignore: 1 },
    nodes: { ignore: 1},
    clear: {group: "method"},
    deselect: {group: "method"},
    select: {group: "method"},
    forEachNode: {group: "method"},
    findNodeByCallback: {group: "method", returns: "wm.TreeNode"},
    root: {type: "wm.TreeNode", doc: 1, ignore: 1}

});
wm.Tree.extend({
    themeable: false
});



wm.Object.extendSchema(wm.PropertyTree, {
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true }
});



wm.Object.extendSchema(wm.ObjectBrowserTree, {
    data: {group: "data", order: 1, type: "Object"}
});
