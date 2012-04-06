/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
    destroy: {method:1},
    isSelected: {method:1, returns: "Boolean"},
    removeChildren: {method:1},
    setOpen: {method:1},
    setContent: {method:1},    
    forEachDescendant: {method:1},    
    findDescendant: {method:1, returns: "wm.TreeNode"}
});


wm.Object.extendSchema(wm.Tree, {

    connectors: {group: "widgetName", subgroup: "graphics", order: 100},

    /* Events group */
    onselect: {order: 1},
    ondeselect: {order: 2},
    onclick: {order: 3, advanced:1},
    ondblclick: {order: 4},
    onmousedown: {order: 5, advanced:1},
    oncheckboxclick: {order: 20, advanced:1},
    oninitchildren: {order: 30, advanced:1},
    
    /* Ignored group */
    disabled: { ignore: 1 },
    nodes: { ignore: 1},
    root: {type: "wm.TreeNode", doc: 1, ignore: 1},

    /* Methods group */
    clear: {method:1},
    deselect: {method:1},
    select: {method:1},
    forEachNode: {method:1},
    findNodeByCallback: {method:1, returns: "wm.TreeNode"},
    forEachNode: {method: 1, returns: null},
    clear: {method: 1, returns: null},
    deselect: {method: 1, returns: null},
    select: {method: 1, returns: null}

});
wm.Tree.extend({
    themeable: false
});



wm.Object.extendSchema(wm.PropertyTree, {
    /* widgetName group */
    dataSet: {group: "widgetName", subgroup: "data", order: 1, requiredGroup: 1, bindTarget: 1, isList: true, simpleBindTarget: true, editor: "wm.prop.DataSetSelect", editorProps: {listMatch: true, widgetDataSets: true, allowAllTypes: true}},
    configJson: {group: "widgetName", subgroup: "data", order: 10, requiredGroup:1, editor: "wm.LargeTextArea", editorProps: {height: "300px"} },

    /* Hidden bindSource group */
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true }

});



wm.Object.extendSchema(wm.ObjectTree, {
    data: {group: "widgetName", subgroup: "data", order: 1, requiredGroup: 1, type: "Object"}
});


wm.Object.extendSchema(wm.DraggableTree, {
    dropBetweenNodes: {group: "widgetName", subgroup: "behavior"},
    dragEnabled: {ignore: 1}
});