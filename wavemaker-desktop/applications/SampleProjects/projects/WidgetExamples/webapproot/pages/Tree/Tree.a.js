/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
dojo.declare("Tree", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

Tree.widgets = {
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Tree Widget Examples","padding":"4","width":"128px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px","manageURL":true,"width":"800px"}, {}, {
propertyTree: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Property Tree","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Tree_Property","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
objectTree: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Object Tree","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Tree_Object","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}]
}]
};

Tree.prototype._cssText = '';
Tree.prototype._htmlText = '<div id="proptree">\
To use the property tree widget, follow these steps:<br>\
<ol>\
<li>Bind the dataSet property to a live variable, live view or service variable.\
This provides the underlying data for the tree.</li>\
<li>Specify the columns and relationships to show using the configJson property.\
This defines how the data should be shown in the tree.</li>\
</ol>\
</div>\
<div id="objtree">\
To use the ObjectTree widget, follow these steps:<br>\
<ol>\
<li>Drag an ObjectTree widget onto the palette.</li>\
<li>Set the data property to display the items in the tree.</li>\
</ol>\
</div>\
';