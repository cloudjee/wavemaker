/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
dojo.declare("Form", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

Form.widgets = {
employeeDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","desktopHeight":368,"height":368,"title":"employee","width":"500px"}, {}, {
containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
employeeLiveForm1: ["wm.LiveForm", {"alwaysPopulateEditors":true,"fitToContentHeight":true,"height":"294px","horizontalAlign":"left","liveEditing":false,"margin":"4","verticalAlign":"top"}, {"onSuccess":"employeeLivePanel1.popupLiveFormSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
eidEditor1: ["wm.Number", {"caption":"Eid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"eid","height":"26px","required":true,"width":"100%"}, {}],
firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"firstname","height":"26px","width":"100%"}, {}],
lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"lastname","height":"26px","width":"100%"}, {}],
streetEditor1: ["wm.Text", {"caption":"Street","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"street","height":"26px","width":"100%"}, {}],
cityEditor1: ["wm.Text", {"caption":"City","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"city","height":"26px","width":"100%"}, {}],
stateEditor1: ["wm.Text", {"caption":"State","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"state","height":"26px","width":"100%"}, {}],
zipEditor1: ["wm.Text", {"caption":"Zip","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"zip","height":"26px","width":"100%"}, {}],
birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","captionSize":"200px","dateMode":"Date","desktopHeight":"26px","formField":"birthdate","height":"26px","width":"100%"}, {}],
picurlEditor1: ["wm.Text", {"caption":"Picurl","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"picurl","height":"26px","width":"100%"}, {}],
twitteridEditor1: ["wm.Text", {"caption":"Twitterid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"twitterid","height":"26px","width":"100%"}, {}],
tenantidEditor1: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"tenantid","height":"26px","width":"100%"}, {}]
}]
}],
buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
employeeSaveButton: ["wm.Button", {"caption":"Save","margin":"4","showing":false}, {"onclick":"employeeLiveForm1.saveDataIfValid"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeLiveForm1.invalid","targetId":null,"targetProperty":"disabled"}, {}]
}]
}],
employeeCancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"employeeDialog.hide"}]
}]
}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Form Widget Examples","padding":"4","width":"132px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"headerHeight":"32px","manageURL":true}, {}, {
basic: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Basic Form","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"FormDB_Objects","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
search: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"DB Relationships","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"FormDB_Lookups","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
master: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Master Detail","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer3: ["wm.PageContainer", {"deferLoad":true,"pageName":"Form_Master","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
toMany: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"One To Many Relations","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer4: ["wm.PageContainer", {"deferLoad":true,"pageName":"Form_Many","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
toOne: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"One To One Relations","horizontalAlign":"left","verticalAlign":"top"}, {}, {
pageContainer5: ["wm.PageContainer", {"deferLoad":true,"pageName":"Form_One","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
related: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Set Related","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
pageContainer6: ["wm.PageContainer", {"deferLoad":true,"pageName":"Form_Related","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}]
}]
};

Form.prototype._cssText = 'body.tundra .form .wmlayout .form-label3 {\
}\
';
Form.prototype._htmlText = '<div id="simplestatic">\
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