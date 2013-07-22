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
dojo.declare("Select_DB", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Select_DB.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel28: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel29: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label19: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"Populate Select Options from Database Query","padding":"4","width":"270px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel30: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel32: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px"}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label17: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (Select Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label20: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of departments","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel33: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel34: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dbSelectMenu: ["wm.SelectMenu", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"autoComplete":false,"caption":"Select department","captionSize":"120px","dataType":"com.sampledatadb.data.Department","dataValue":"Sales","displayField":"name","displayValue":"","pageSize":4}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label29: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label21: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Detailed information for selected Department","height":"42px","margin":"10,0,0,20","padding":"4","width":"331px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
liveForm1: ["wm.LiveForm", {"fitToContentHeight":true,"height":"182px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"dbSelectMenu.selectedItem","targetProperty":"dataSet"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"relatedEditor1.dataOutput","targetProperty":"dataOutput.employees"}, {}]
}],
deptidEditor1: ["wm.Number", {"caption":"Deptid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"deptid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
nameEditor1: ["wm.Text", {"caption":"Name","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"name","height":"26px","readonly":true,"width":"100%"}, {}],
budgetEditor1: ["wm.Number", {"caption":"Budget","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"budget","height":"26px","readonly":true,"width":"100%"}, {}],
q1Editor1: ["wm.Number", {"caption":"Q1","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q1","height":"26px","readonly":true,"width":"100%"}, {}],
q2Editor1: ["wm.Number", {"caption":"Q2","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q2","height":"26px","readonly":true,"width":"100%"}, {}],
q3Editor1: ["wm.Number", {"caption":"Q3","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q3","height":"26px","readonly":true,"width":"100%"}, {}],
q4Editor1: ["wm.Number", {"caption":"Q4","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q4","height":"26px","readonly":true,"width":"100%"}, {}],
deptcodeEditor1: ["wm.Text", {"caption":"Deptcode","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"deptcode","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
locationEditor1: ["wm.Text", {"caption":"Location","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"location","height":"26px","readonly":true,"width":"100%"}, {}],
tenantidEditor1: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
liveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","liveForm":"liveForm1","operationPanel":"operationPanel1","savePanel":"savePanel1","showing":false}, {}, {
savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton1: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"liveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton1: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"liveForm1EditPanel.cancelEdit"}]
}],
operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newButton1: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"liveForm1EditPanel.beginDataInsert"}],
updateButton1: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}],
deleteButton1: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"liveForm1EditPanel.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"liveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"RadioSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label18: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (RadioSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label22: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of departments","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel35: ["wm.Panel", {"height":"127px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel36: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dbRadioSet: ["wm.RadioSet", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Select Department","captionAlign":"left","captionSize":"120px","dataType":"com.sampledatadb.data.Department","dataValue":"Sales","displayField":"name","displayValue":"","height":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label30: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label23: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Detailed information for selected Department","height":"42px","margin":"10,0,0,20","padding":"4","width":"331px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
liveForm2: ["wm.LiveForm", {"fitToContentHeight":true,"height":"182px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire1: ["wm.Wire", {"expression":undefined,"source":"relatedEditor1.dataOutput","targetProperty":"dataOutput.employees"}, {}],
wire: ["wm.Wire", {"expression":undefined,"source":"dbRadioSet.selectedItem","targetProperty":"dataSet"}, {}]
}],
deptidEditor2: ["wm.Number", {"caption":"Deptid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"deptid","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
nameEditor2: ["wm.Text", {"caption":"Name","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"name","height":"26px","readonly":true,"width":"100%"}, {}],
budgetEditor2: ["wm.Number", {"caption":"Budget","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"budget","height":"26px","readonly":true,"width":"100%"}, {}],
q1: ["wm.Number", {"caption":"Q1","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q1","height":"26px","readonly":true,"width":"100%"}, {}],
q2: ["wm.Number", {"caption":"Q2","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q2","height":"26px","readonly":true,"width":"100%"}, {}],
q3: ["wm.Number", {"caption":"Q3","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q3","height":"26px","readonly":true,"width":"100%"}, {}],
q4: ["wm.Number", {"caption":"Q4","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"q4","height":"26px","readonly":true,"width":"100%"}, {}],
deptcodeEditor2: ["wm.Text", {"caption":"Deptcode","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"deptcode","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
locationEditor2: ["wm.Text", {"caption":"Location","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"location","height":"26px","readonly":true,"width":"100%"}, {}],
tenantidEditor2: ["wm.Number", {"caption":"Tenantid","captionSize":"200px","dataValue":undefined,"desktopHeight":"26px","formField":"tenantid","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
liveForm3: ["wm.EditPanel", {"desktopHeight":"32px","height":"32px","operationPanel":null,"savePanel":null,"showing":false}, {}]
}]
}],
layer3: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"CheckboxSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (RadioSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label25: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of departments","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel37: ["wm.Panel", {"height":"127px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dbCheckboxSet: ["wm.CheckboxSet", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Select Department","captionAlign":"left","captionSize":"120px","dataType":"com.sampledatadb.data.Department","dataValue":["Sales"],"displayField":"name","displayValue":"","height":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label26: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Detailed information for selected Department","height":"42px","margin":"10,0,0,20","padding":"4","width":"331px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dojoGrid1: ["wm.DojoGrid", {"columns":[{"show":false,"field":"deptid","title":"Deptid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"budget","title":"Budget","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"q1","title":"Q1","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q2","title":"Q2","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q3","title":"Q3","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q4","title":"Q4","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"deptcode","title":"Deptcode","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"location","title":"Location","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Budget: \" + ${budget} + \"</div>\"\n+ \"<div class='MobileRow'>Location: \" + ${location} + \"</div>\"\n","mobileColumn":true}],"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"dbCheckboxSet.selectedItem","targetProperty":"dataSet"}, {}]
}]
}]
}],
layer4: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"ListSet","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label27: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It! (RadioSet Editor)","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label28: ["wm.Label", {"caption":"<b>Directions:</b> select from a list of departments","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel39: ["wm.Panel", {"height":"168px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dbListSet: ["wm.ListSet", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Select Department","captionAlign":"left","captionSize":"120px","dataType":"com.sampledatadb.data.Department","dataValue":["Sales"],"displayField":"name","displayValue":"","height":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label32: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label33: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"caption":"Detailed information for selected Department","height":"42px","margin":"10,0,0,20","padding":"4","width":"331px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dojoGrid2: ["wm.DojoGrid", {"columns":[{"show":false,"field":"deptid","title":"Deptid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"budget","title":"Budget","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"q1","title":"Q1","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q2","title":"Q2","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q3","title":"Q3","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"q4","title":"Q4","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"deptcode","title":"Deptcode","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"location","title":"Location","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Budget: \" + ${budget} + \"</div>\"\n+ \"<div class='MobileRow'>Location: \" + ${location} + \"</div>\"\n","mobileColumn":true}],"height":"100%","margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"dbListSet.selectedItem","targetProperty":"dataSet"}, {}]
}]
}]
}]
}]
}],
panel75: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel76: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html7: ["wm.Html", {"height":"100%","html":"<p>The DataSet editors can get their options from the result of a database query, Java or web service call.</p>\n<p>This example shows using the dataSet property of the DataSet editors to query a database table and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/SelectMenu\" target=\"_blank\">Select Menu Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/RadioSet\" target=\"_blank\">RadioSet Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/CheckboxSet\" target=\"_blank\">CheckboxSet Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/ListSet\" target=\"_blank\">ListSet Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=editor&amp;layer=radio\">Radio Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Select_DB.prototype._cssText = '';
Select_DB.prototype._htmlText = '';