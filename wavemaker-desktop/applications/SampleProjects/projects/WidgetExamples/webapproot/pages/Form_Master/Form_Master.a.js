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
dojo.declare("Form_Master", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Form_Master.widgets = {
employeeDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","desktopHeight":"320px","height":"320px","title":"employee","width":"500px"}, {}, {
containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
employeeLiveForm1: ["wm.LiveForm", {"alwaysPopulateEditors":true,"captionSize":"100px","fitToContentHeight":true,"height":"238px","horizontalAlign":"center","liveEditing":false,"margin":"4,5,0,0","verticalAlign":"top"}, {"onSuccess":"employeeLivePanel1.popupLiveFormSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
eidEditor1: ["wm.Number", {"caption":"Eid","dataValue":undefined,"desktopHeight":"26px","formField":"eid","height":"26px","required":true,"showing":false,"width":"100%"}, {}],
firstnameEditor1: ["wm.Text", {"caption":"Firstname","dataValue":undefined,"desktopHeight":"26px","formField":"firstname","height":"26px","width":"100%"}, {}],
lastnameEditor1: ["wm.Text", {"caption":"Lastname","dataValue":undefined,"desktopHeight":"26px","formField":"lastname","height":"26px","width":"100%"}, {}],
streetEditor1: ["wm.Text", {"caption":"Street","dataValue":undefined,"desktopHeight":"26px","formField":"street","height":"26px","width":"100%"}, {}],
cityEditor1: ["wm.Text", {"caption":"City","dataValue":undefined,"desktopHeight":"26px","formField":"city","height":"26px","width":"100%"}, {}],
stateEditor1: ["wm.Text", {"caption":"State","dataValue":undefined,"desktopHeight":"26px","formField":"state","height":"26px","width":"100%"}, {}],
zipEditor1: ["wm.Text", {"caption":"Zip","dataValue":undefined,"desktopHeight":"26px","formField":"zip","height":"26px","width":"100%"}, {}],
birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","dateMode":"Date","desktopHeight":"26px","formField":"birthdate","height":"26px","width":"100%"}, {}],
picurlEditor1: ["wm.Text", {"caption":"Picurl","dataValue":undefined,"desktopHeight":"26px","formField":"picurl","height":"26px","width":"100%"}, {}],
twitteridEditor1: ["wm.Text", {"caption":"Twitterid","dataValue":undefined,"desktopHeight":"26px","formField":"twitterid","height":"26px","width":"100%"}, {}],
tenantidEditor1: ["wm.Number", {"caption":"Tenantid","dataValue":undefined,"desktopHeight":"26px","formField":"tenantid","height":"26px","showing":false,"width":"100%"}, {}]
}],
picture1: ["wm.Picture", {"aspect":"h","height":"200px","width":"200px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"picurlEditor1.dataValue","targetProperty":"source"}, {}]
}]
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
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel44: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel45: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label25: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Master Detail","padding":"4","width":"340px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel46: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel48: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label18: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label26: ["wm.Label", {"caption":"<b>Directions:</b> double-click an employee to see the details for that employee in a pop-up window.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel49: ["wm.Panel", {"height":"220px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
employeeLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeDialog","targetId":null,"targetProperty":"dialog"}, {}],
wire1: ["wm.Wire", {"source":"employeeLiveForm1","targetId":null,"targetProperty":"liveForm"}, {}],
wire2: ["wm.Wire", {"source":"employeeDojoGrid","targetId":null,"targetProperty":"dataGrid"}, {}],
wire3: ["wm.Wire", {"source":"employeeSaveButton","targetId":null,"targetProperty":"saveButton"}, {}]
}],
employeeDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"title":"Eid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"eid"},{"show":true,"title":"Firstname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"firstname"},{"show":true,"title":"Lastname","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"lastname"},{"show":false,"title":"Street","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"street"},{"show":true,"title":"City","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"city"},{"show":false,"title":"State","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"state"},{"show":false,"title":"Zip","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"zip"},{"show":true,"title":"Birthdate","width":"80px","displayType":"Date","noDelete":true,"align":"left","formatFunc":"wm_date_formatter","field":"birthdate"},{"show":false,"title":"Picurl","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"picurl"},{"show":false,"title":"Twitterid","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"twitterid"},{"show":false,"title":"Tenantid","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"tenantid"},{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":false,"title":"-","width":"100%","expression":"'<div class=\"MobileRowTitle\">Eid: ' + ${eid} + '</div>'"}],"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"selectFirstRow":true}, {"onCellDblClick":"employeeLivePanel1.popupLivePanelEdit"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}],
employeeGridButtonPanel: ["wm.Panel", {"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
employeeNewButton: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"employeeLivePanel1.popupLivePanelInsert"}],
employeeUpdateButton: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"employeeLivePanel1.popupLivePanelEdit"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
}]
}],
employeeDeleteButton: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"employeeLiveForm1.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeDojoGrid.emptySelection","targetId":null,"targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}],
label30: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel51: ["wm.Panel", {"height":"42px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label27: ["wm.Label", {"caption":"You selected","padding":"4","width":"133px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dbLabel1: ["wm.Label", {"height":"26px","padding":"4","width":"202px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":false,"source":"employeeDojoGrid.selectedItem.firstname","targetProperty":"caption"}, {}]
}],
format: ["wm.DataFormatter", {}, {}]
}]
}]
}],
panel72: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel77: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html8: ["wm.Html", {"height":"100%","html":"<p>The database widget automates the creation of a list-detail form with a popup window.</p>\n<p>This example shows using the database widget generated when a data schema is imported and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Form_Master.prototype._cssText = '';
Form_Master.prototype._htmlText = '';