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
dojo.declare("FormDB_Objects", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
saveButton1Click1: function(inSender) {
if (this.eidEditor1.getDataValue()) {
this.employeeDojoGrid.dataSet.query({eid: this.eidEditor1.getDataValue()}).getItem(0).setData(this.employeeLiveForm1.dataOutput);
this.employeeLiveForm1.setReadonly(true);
}
},
_end: 0
});

FormDB_Objects.widgets = {
employeeLiveVariable1: ["wm.LiveVariable", {"type":"com.sampledatadb.data.Employee"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Employee","view":[{"caption":"Eid","sortable":true,"dataIndex":"eid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Street","sortable":true,"dataIndex":"street","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"City","sortable":true,"dataIndex":"city","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"State","sortable":true,"dataIndex":"state","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Zip","sortable":true,"dataIndex":"zip","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Birthdate","sortable":true,"dataIndex":"birthdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Picurl","sortable":true,"dataIndex":"picurl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Twitterid","sortable":true,"dataIndex":"twitterid","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":10,"subType":null}]}, {}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel12: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minDesktopHeight":570,"minHeight":570,"verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label13: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Basic Database Form","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label12: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"caption":"<b>Directions:</b> enter required data until form is no longer invalid.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel16: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
sampledataDBLivePanel: ["wm.LivePanel", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
employeeDojoGrid: ["wm.DojoGrid", {"columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"picurl","title":"Picurl","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n","mobileColumn":true}],"dsType":"com.sampledatadb.data.Employee","height":"100%","margin":"4","minDesktopHeight":60,"width":"200px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"employeeLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
employeeLiveForm1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
employeeLiveForm1: ["wm.LiveForm", {"autoScroll":true,"height":"100%","horizontalAlign":"center","readonly":true,"saveOnEnterKey":false,"verticalAlign":"top"}, {"onEnterKeyPress":"employeeLiveForm1.populateDataOutput","onSuccess":"employeeLiveVariable1","onEnterKeyPress1":"saveButton1Click1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
eidEditor1: ["wm.Number", {"caption":"Eid","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"eid","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
firstnameEditor1: ["wm.Text", {"caption":"Firstname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
lastnameEditor1: ["wm.Text", {"caption":"Lastname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
streetEditor1: ["wm.Text", {"caption":"Street","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"street","height":"26px","readonly":true,"width":"100%"}, {}],
cityEditor1: ["wm.Text", {"caption":"City","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"city","height":"26px","readonly":true,"width":"100%"}, {}],
stateEditor1: ["wm.Text", {"caption":"State","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"state","height":"26px","readonly":true,"width":"100%"}, {}],
zipEditor1: ["wm.Text", {"caption":"Zip","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"zip","height":"26px","readonly":true,"width":"100%"}, {}],
birthdateEditor1: ["wm.DateTime", {"caption":"Birthdate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"birthdate","height":"26px","readonly":true,"width":"100%"}, {}],
picurlEditor1: ["wm.Text", {"caption":"Picurl","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"picurl","height":"26px","readonly":true,"width":"100%"}, {}],
twitteridEditor1: ["wm.Text", {"caption":"Twitterid","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"twitterid","height":"26px","readonly":true,"width":"100%"}, {}],
tenantidEditor1: ["wm.Number", {"caption":"Tenantid","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"tenantid","height":"26px","readonly":true,"width":"100%"}, {}],
employeeSpacer: ["wm.Spacer", {"height":"100%","width":"10px"}, {}]
}],
employeeLiveForm1EditPanel: ["wm.EditPanel", {"desktopHeight":"34px","height":"34px","isCustomized":true,"liveForm":"employeeLiveForm1","lock":false,"operationPanel":"operationPanel1","savePanel":"savePanel1","styles":{"backgroundColor":"#ffffff"}}, {}, {
savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton1: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"employeeLiveForm1.populateDataOutput","onclick1":"saveButton1Click1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton1: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel1: ["wm.Panel", {"height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"307px"}, {}, {
newButton1: ["wm.Button", {"caption":"New","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.beginDataInsert"}],
updateButton1: ["wm.Button", {"caption":"Edit","margin":"4"}, {"onclick":"employeeLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}]
}],
label15: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label17: ["wm.Label", {"caption":"<b>Result:</b> The following data will be written to the database (sorry, this demo does not allow you to actually modify the database)","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
liveForm1: ["wm.LiveForm", {"autoScroll":true,"height":"100%","horizontalAlign":"left","liveEditing":false,"readonly":true,"verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"employeeLiveForm1.dataOutput","targetProperty":"dataSet"}, {}]
}],
eidEditor2: ["wm.Number", {"caption":"Eid","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"eid","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
firstnameEditor2: ["wm.Text", {"caption":"Firstname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"firstname","height":"26px","readonly":true,"width":"100%"}, {}],
lastnameEditor2: ["wm.Text", {"caption":"Lastname","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"lastname","height":"26px","readonly":true,"width":"100%"}, {}],
streetEditor2: ["wm.Text", {"caption":"Street","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"street","height":"26px","readonly":true,"width":"100%"}, {}],
cityEditor2: ["wm.Text", {"caption":"City","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"city","height":"26px","readonly":true,"width":"100%"}, {}],
stateEditor2: ["wm.Text", {"caption":"State","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"state","height":"26px","readonly":true,"width":"100%"}, {}],
zipEditor2: ["wm.Text", {"caption":"Zip","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"zip","height":"26px","readonly":true,"width":"100%"}, {}],
birthdateEditor2: ["wm.DateTime", {"caption":"Birthdate","captionSize":"140px","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"birthdate","height":"26px","readonly":true,"width":"100%"}, {}],
picurlEditor2: ["wm.Text", {"caption":"Picurl","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"picurl","height":"26px","readonly":true,"width":"100%"}, {}],
twitteridEditor2: ["wm.Text", {"caption":"Twitterid","captionSize":"140px","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"twitterid","height":"26px","readonly":true,"width":"100%"}, {}],
tenantidEditor2: ["wm.Number", {"caption":"Tenantid","captionSize":"140px","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"tenantid","height":"26px","readonly":true,"width":"100%"}, {}]
}]
}],
panel73: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html6: ["wm.Html", {"height":"100%","html":"Form widgets provide an easy way to input data into a database. Supported features include<br>\n<ul>\n<li>Automatic validation of form fields</li>\n<li>Create, Update, Delete database records from form</li>\n<li>Manage required fields and required relationships</li>\n</ul>\n<p>This example shows a form widget set to create a new employee in the database with validation of each field and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/LiveForm\" target=\"_blank\">Live Form Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=grid&amp;layer=basic\">Grid</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

FormDB_Objects.prototype._cssText = '';
FormDB_Objects.prototype._htmlText = '';