dojo.declare("ProjectsPage", wm.Page, {
"preferredDevice": "tablet",
start: function() {
},
viewIssuesClick: function(inSender) {
var projectData = this.projectDojoGrid.selectedItem.getData();
// this call will unload/destroy this page. Do not refer to any components on this page after this call
main.gotoIssuesPage.update();
var p = wm.getPage("IssuesPage");
p.projectMenu.setDataValue(projectData);
},
_end: 0
});

ProjectsPage.widgets = {
projectLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Project"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Project","related":["versions","issues"],"service":"issuecloudv3DB","view":[{"caption":"Pid","sortable":true,"dataIndex":"pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":1000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1001,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1002,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1003,"subType":null,"widthUnits":"px"},{"caption":"Url","sortable":true,"dataIndex":"url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1004,"subType":null,"widthUnits":"px"},{"caption":"Prefix","sortable":true,"dataIndex":"prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1005,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1006,"subType":null,"widthUnits":"px"},{"caption":"Vid","sortable":true,"dataIndex":"versions.vid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2000},{"caption":"Tid","sortable":true,"dataIndex":"versions.tid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2001},{"caption":"Name","sortable":true,"dataIndex":"versions.name","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2002},{"caption":"Description","sortable":true,"dataIndex":"versions.description","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2003},{"caption":"Releasedate","sortable":true,"dataIndex":"versions.releasedate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2004},{"caption":"Status","sortable":true,"dataIndex":"versions.status","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2005},{"caption":"Flag","sortable":true,"dataIndex":"versions.flag","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2006},{"caption":"Iid","sortable":true,"dataIndex":"issues.iid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3000},{"caption":"Tid","sortable":true,"dataIndex":"issues.tid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3001},{"caption":"Name","sortable":true,"dataIndex":"issues.name","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3002},{"caption":"Createdate","sortable":true,"dataIndex":"issues.createdate","type":"java.util.Date","displayType":"Date","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3003},{"caption":"Closedate","sortable":true,"dataIndex":"issues.closedate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3004},{"caption":"Description","sortable":true,"dataIndex":"issues.description","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3005},{"caption":"Summary","sortable":true,"dataIndex":"issues.summary","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3006},{"caption":"Issuetype","sortable":true,"dataIndex":"issues.issuetype","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3007},{"caption":"Priority","sortable":true,"dataIndex":"issues.priority","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3008},{"caption":"Path","sortable":true,"dataIndex":"issues.path","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3009},{"caption":"Status","sortable":true,"dataIndex":"issues.status","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3010},{"caption":"Flag","sortable":true,"dataIndex":"issues.flag","type":"java.lang.Integer","displayType":"Number","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3011}]}, {}]
}],
versionLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Version"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${projectDojoGrid.selectedItem.pid} || -1","targetProperty":"filter.project.pid"}, {}]
}],
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Version","related":["project"],"view":[{"caption":"Vid","sortable":true,"dataIndex":"vid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Releasedate","sortable":true,"dataIndex":"releasedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Status","sortable":true,"dataIndex":"status","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Pid","sortable":true,"dataIndex":"project.pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"project.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"project.name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"project.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Url","sortable":true,"dataIndex":"project.url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Prefix","sortable":true,"dataIndex":"project.prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"project.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null}]}, {}]
}],
notificationCall1: ["wm.NotificationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"alertInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"<p>The TabLayers showing property is bound to grid.isRowSelected.  A binding is only evaluated at when it is first intialized, and any time grid.isRowSelected changes. So, clicking the New button can call setShowing and show the tab layers even though grid.isRowSelected is still false.</p><p> The versions tab on the other hand has the same binding, and is ONLY shown when there is a selection in the grid; there is no javascript call to setShowing.</p>\"","targetProperty":"text"}, {}]
}]
}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
projectLivePanel1: ["wm.LivePanel", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
projectDojoGridPanel: ["wm.Panel", {"border":"0,1,0,0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
projectDojoGrid: ["wm.DojoGrid", {"border":"0","columns":[{"show":false,"field":"pid","title":"Pid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"tid","title":"Tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"name","title":"Project","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"url","title":"Url","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"prefix","title":"Prefix","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"flag","title":"Flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Project: \" + ${name} + \"</div>\"\n","mobileColumn":false}],"height":"100%","margin":"0"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
panel1: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","roles":["admin"],"verticalAlign":"top","width":"100%"}, {}, {
helpButton: ["wm.Button", {"caption":"Help","desktopHeight":"40px","height":"40px","margin":"4","width":"60px"}, {"onclick":"notificationCall1"}],
spacer1: ["wm.Spacer", {"height":"1px","width":"100%"}, {}],
newButton1: ["wm.Button", {"caption":"New","height":"100%","margin":"4"}, {"onclick":"projectLiveForm1EditPanel.beginDataInsert","onclick1":"tabLayers1.show"}]
}]
}],
tabLayers1: ["wm.TabLayers", {"margin":"0,0,0,1"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${projectDojoGrid.isRowSelected} || Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}],
editProjectLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Edit Project","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
projectLiveForm1: ["wm.LiveForm", {"autoScroll":true,"captionAlign":"left","captionSize":"100px","editorHeight":"40px","enableTouchHeight":true,"height":"100%","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onSuccess":"projectLiveVariable1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
pidEditor1: ["wm.Number", {"caption":"Pid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"pid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
tidEditor1: ["wm.Number", {"caption":"Tid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"tid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"1","targetProperty":"defaultInsert"}, {}]
}]
}],
nameEditor1: ["wm.Text", {"caption":"Name","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"name","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
urlEditor1: ["wm.Text", {"caption":"Url","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"url","height":"35px","readonly":true,"width":"100%"}, {}],
prefixEditor1: ["wm.Text", {"caption":"Prefix","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"prefix","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
flagEditor1: ["wm.Number", {"caption":"Flag","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"flag","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
descriptionEditor1: ["wm.LargeTextArea", {"caption":"Description","captionSize":"28px","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"description","height":"100%","readonly":true,"width":"100%"}, {}],
projectLiveForm1EditPanel: ["wm.EditPanel", {"_classes":{"domNode":["ToolBar"]},"isCustomized":true,"layoutKind":"left-to-right","liveForm":"projectLiveForm1","lock":false,"operationPanel":"operationPanel1","roles":["admin"],"savePanel":"savePanel1"}, {}, {
viewIssues: ["wm.Button", {"caption":"View Issues","height":"100%","margin":"4","width":"108px"}, {"onclick":"viewIssuesClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${projectDojoGrid.isRowSelected} || Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}]
}],
savePanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton1: ["wm.Button", {"caption":"Save","height":"100%","margin":"4"}, {"onclick":"projectLiveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton1: ["wm.Button", {"caption":"Cancel","height":"100%","margin":"4"}, {"onclick":"projectLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
updateButton1: ["wm.Button", {"caption":"Update","height":"100%","margin":"4"}, {"onclick":"projectLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}],
deleteButton1: ["wm.Button", {"caption":"Delete","height":"100%","margin":"4"}, {"onclick":"projectLiveForm1EditPanel.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}],
versionsLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Versions","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${projectDojoGrid.isRowSelected} || Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}],
versionLivePanel1: ["wm.LivePanel", {"autoScroll":false,"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
versionDojoGridPanel: ["wm.Panel", {"border":"0,1,0,0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100px"}, {}, {
versionDojoGrid: ["wm.DojoGrid", {"border":"0","columns":[{"show":false,"field":"vid","title":"Vid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"tid","title":"Tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"name","title":"Version","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"releasedate","title":"Releasedate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"status","title":"Status","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"flag","title":"Flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.pid","title":"Pid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.tid","title":"Tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.name","title":"Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.url","title":"Url","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.prefix","title":"Prefix","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.flag","title":"Flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Version: \" + ${name} + \"</div>\"\n","mobileColumn":false}],"dsType":"com.issuecloudv3db.data.Version","height":"100%","margin":"0"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"versionLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
panel2: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newButton2: ["wm.Button", {"caption":"New","height":"100%","margin":"4"}, {"onclick":"versionLiveForm1EditPanel.beginDataInsert"}]
}]
}],
versionLiveForm1: ["wm.LiveForm", {"autoScroll":true,"captionAlign":"left","captionSize":"100px","editorHeight":"40px","enableTouchHeight":true,"height":"100%","horizontalAlign":"center","readonly":true,"verticalAlign":"top"}, {"onSuccess":"versionLiveVariable1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"versionDojoGrid.selectedItem","targetProperty":"dataSet"}, {}]
}],
vidEditor1: ["wm.Number", {"caption":"Vid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"vid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
tidEditor2: ["wm.Number", {"caption":"Tid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"tid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"1","targetProperty":"defaultInsert"}, {}]
}]
}],
nameEditor2: ["wm.Text", {"caption":"Name","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"26px","emptyValue":"emptyString","formField":"name","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
releasedateEditor1: ["wm.DateTime", {"caption":"Releasedate","captionAlign":"left","dateMode":"Date","desktopHeight":"26px","emptyValue":"zero","formField":"releasedate","height":"35px","readonly":true,"width":"100%"}, {}],
statusEditor: ["wm.SelectMenu", {"caption":"Status","captionAlign":"left","dataField":"dataValue","dataValue":undefined,"desktopHeight":"35px","displayField":"dataValue","formField":"status","height":"35px","options":"Open, In Progress, Shipped","readonly":true,"width":"100%"}, {}],
flagEditor2: ["wm.Number", {"caption":"Flag","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"26px","emptyValue":"zero","formField":"flag","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"1","targetProperty":"defaultInsert"}, {}]
}]
}],
projectLookup1: ["wm.Lookup", {"caption":"Project","captionAlign":"left","dataType":"com.issuecloudv3db.data.Project","dataValue":undefined,"desktopHeight":"40px","displayField":"url","formField":"project","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"projectLookup1.liveVariable","targetProperty":"dataSet"}, {}],
wire: ["wm.Wire", {"expression":undefined,"source":"projectDojoGrid.selectedItem","targetProperty":"defaultInsert"}, {}]
}]
}],
descriptionEditor2: ["wm.LargeTextArea", {"caption":"Description","captionSize":"28px","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"description","height":"100%","minHeight":100,"minMobileHeight":100,"readonly":true,"width":"100%"}, {}],
versionLiveForm1EditPanel: ["wm.EditPanel", {"_classes":{"domNode":["ToolBar"]},"desktopHeight":"32px","isCustomized":true,"liveForm":"versionLiveForm1","lock":false,"operationPanel":"operationPanel2","savePanel":"savePanel2"}, {}, {
savePanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
saveButton2: ["wm.Button", {"caption":"Save","height":"100%","margin":"4"}, {"onclick":"versionLiveForm1EditPanel.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"versionLiveForm1EditPanel.formInvalid","targetProperty":"disabled"}, {}]
}]
}],
cancelButton2: ["wm.Button", {"caption":"Cancel","height":"100%","margin":"4"}, {"onclick":"versionLiveForm1EditPanel.cancelEdit"}]
}],
operationPanel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
updateButton2: ["wm.Button", {"caption":"Update","height":"100%","margin":"4"}, {"onclick":"versionLiveForm1EditPanel.beginDataUpdate"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"versionLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}],
deleteButton2: ["wm.Button", {"caption":"Delete","height":"100%","margin":"4"}, {"onclick":"versionLiveForm1EditPanel.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"versionLiveForm1EditPanel.formUneditable","targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}]
}]
}]
}]
}]
}]
};

ProjectsPage.prototype._cssText = '';
ProjectsPage.prototype._htmlText = '';