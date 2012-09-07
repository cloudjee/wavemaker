dojo.declare("Select", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

Select.widgets = {
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Select Menu Widget Examples","padding":"4","width":"169px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px","manageURL":true,"width":"800px"}, {}, {
select: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select from List","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_List","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
populate: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select from DB","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_DB","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
filter: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Filtering Select","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer3: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_Filter","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
display: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Display Expression","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer4: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_Display","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}]
}]
};

Select.prototype._cssText = '';
Select.prototype._htmlText = '<div id="simplestatic">\
To set the display values for a select editor, follow these steps:<br>\
<ol>\
<li>Drag a select editor onto the canvas</li>\
<li>In the "options" parameter, enter the enter the values to show for that editor,\
such as "Red, Green, Blue"</li>\
<li>Run the application. Note that the select editor will show the values entered into the options parameter.</li>\
</ol>\
</div>\
<div id="jsontatic">\
Sometimes the value that should be returned from the select editor is different from the value displayed.\
For example, the select editoror may display a list of states but return the abbreviation for that state, such as\
displaying the state California but returning a dataValue of CA when that item is selected<br>\
The value displayed by the select editor is called the displayValue or name. The value returned when that item is selected\
is called the dataValue.\
To have a select editor that returns a data value that is different from the display value, follow these steps:<br>\
<ol>\
<li>Create a variable with an array of names and corresponding dataValues by clicking on Insert->Variable</li>\
<li>Change the name property to stateStaticVar</li>\
<li>Set the type parameter to EntryData</li>\
<li>Click the isList parameter</li>\
<li>Enter a JSON data structure in the json parameter. For each value, specify a name parameter and a\
dataValue parameter. For example:<br><code>\
[ {name: " ", dataValue: "" },\
{name: "Alabama", dataValue: "AL" },\
{name: "Alaska", dataValue: "AK"}]\
</code></li>\
<li>Drag a select editor onto the canvas</li>\
<li>Bind the dataSet parameter to the variable</li>\
<li>Set the dataField parameter to dataValue</li>\
<li>Set the displayField parameter to name</li>\
<li>Run the application. Note that the select editor will display the name for each state but return the\
abbreviation for the selected state</li>\
</ol>\
</div>\
<div id="databasebinding">\
To use a database query to populate a select editor, follow these steps:\
<ol>\
<li>Drag a select editor onto the canvas</li>\
<li>Bind the dataSet parameter to a live variable, live view or service variable (which could be the result\
of calling a database query, executing a Java method or calling a web service).</li>\
<li>Set the dataField parameter to the database column that should be returned when an item is selected</li>\
<li>Set the displayField parameter to the database column that should be displayed.\
To display multiple columns, use the dataExpression parameter</li>\
</ol>\
</div>\
';