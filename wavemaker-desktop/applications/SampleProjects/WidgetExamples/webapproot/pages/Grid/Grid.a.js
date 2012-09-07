dojo.declare("Grid", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

Grid.widgets = {
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Grid Widget Examples","padding":"4","width":"134px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px","manageURL":true,"width":"800px"}, {}, {
basic: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Basic Grid","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Basic","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
paging: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Paging","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Paging","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
searching: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Searching","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer3: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Searching","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
sorting: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Sorting","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer4: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Sorting","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
formatting: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Formatting","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer5: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Formatting","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
columns: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Calculated Columns","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer6: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Column","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
subtotal: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Row Subtotal","horizontalAlign":"left","verticalAlign":"top"}, {"onShow":"subtotalShow"}, {
pageContainer7: ["wm.PageContainer", {"deferLoad":true,"pageName":"Grid_Subtotals","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
listViewerLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"List Viewer","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
pageContainer8: ["wm.PageContainer", {"deferLoad":true,"pageName":"ListViewer","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}]
}]
};

Grid.prototype._cssText = '';
Grid.prototype._htmlText = '<div id="proptree">\
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