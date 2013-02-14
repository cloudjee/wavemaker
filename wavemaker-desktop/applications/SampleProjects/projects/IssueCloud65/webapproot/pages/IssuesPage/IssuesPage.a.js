dojo.declare("IssuesPage", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
issuesGridSelect: function(inSender) {
this.issueViewLayer.activate();
},
issueListLVarSuccess: function(inSender, inDeprecated) {
var typedata = [{name: "Bug", dataValue: 0},
{name: "New Feature", dataValue: 0},
{name: "Improvement", dataValue: 0}];
var prioritydata = [{name: "Minor", dataValue: 0},
{name: "Major", dataValue: 0},
{name: "Critical", dataValue: 0},
{name: "Blocker", dataValue: 0}];
inSender.forEach(function(inItem) {
switch (inItem.getValue("issuetype")) {
case "Bug":
typedata[0].dataValue++;
break;
case "New Feature":
typedata[1].dataValue++;
break;
case "Improvement":
typedata[2].dataValue++;
break;
}
switch (inItem.getValue("priority")) {
case "Minor":
prioritydata[0].dataValue++;
break;
case "Major":
prioritydata[1].dataValue++;
break;
case "Critical":
prioritydata[2].dataValue++;
break;
case "Blocker":
prioritydata[3].dataValue++;
break;
}
});
this.issuesGraphVar.setData(typedata);
this.issuePriorityGraphVar.setData(prioritydata);
},
showCheckboxChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
this.issuesGrid.renderDojoObj();
},
_end: 0
});

IssuesPage.widgets = {
issueListLVar: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Issue"}, {"onSuccess":"issueListLVarSuccess"}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Issue","related":["project","versionByReportedVid","versionByFixedVid","userByAssignUid","userByReportedUid"],"view":[{"caption":"Iid","sortable":true,"dataIndex":"iid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":1000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1001,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1002,"subType":null,"widthUnits":"px"},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1003,"subType":null,"widthUnits":"px"},{"caption":"Closedate","sortable":true,"dataIndex":"closedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1004,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1005,"subType":null,"widthUnits":"px"},{"caption":"Summary","sortable":true,"dataIndex":"summary","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1006,"subType":null,"widthUnits":"px"},{"caption":"Issuetype","sortable":true,"dataIndex":"issuetype","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1007,"subType":null,"widthUnits":"px"},{"caption":"Priority","sortable":true,"dataIndex":"priority","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1008,"subType":null,"widthUnits":"px"},{"caption":"Path","sortable":true,"dataIndex":"path","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1009,"subType":null,"widthUnits":"px"},{"caption":"Status","sortable":true,"dataIndex":"status","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1010,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1011,"subType":null,"widthUnits":"px"},{"caption":"Pid","sortable":true,"dataIndex":"project.pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":2000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"project.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2001,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"project.name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2002,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"project.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2003,"subType":null,"widthUnits":"px"},{"caption":"Url","sortable":true,"dataIndex":"project.url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2004,"subType":null,"widthUnits":"px"},{"caption":"Prefix","sortable":true,"dataIndex":"project.prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2005,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"project.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2006,"subType":null,"widthUnits":"px"},{"caption":"Vid","sortable":true,"dataIndex":"versionByReportedVid.vid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":3000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"versionByReportedVid.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":3001,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"versionByReportedVid.name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":3002,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"versionByReportedVid.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3003,"subType":null,"widthUnits":"px"},{"caption":"Releasedate","sortable":true,"dataIndex":"versionByReportedVid.releasedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3004,"subType":null,"widthUnits":"px"},{"caption":"Status","sortable":true,"dataIndex":"versionByReportedVid.status","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":3005,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"versionByReportedVid.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":3006,"subType":null,"widthUnits":"px"},{"caption":"Vid","sortable":true,"dataIndex":"versionByFixedVid.vid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":4000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"versionByFixedVid.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4001,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"versionByFixedVid.name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4002,"subType":null,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"versionByFixedVid.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4003,"subType":null,"widthUnits":"px"},{"caption":"Releasedate","sortable":true,"dataIndex":"versionByFixedVid.releasedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4004,"subType":null,"widthUnits":"px"},{"caption":"Status","sortable":true,"dataIndex":"versionByFixedVid.status","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4005,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"versionByFixedVid.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4006,"subType":null,"widthUnits":"px"},{"caption":"Uid","sortable":true,"dataIndex":"userByAssignUid.uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":5000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"userByAssignUid.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5001,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"userByAssignUid.firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5002,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"userByAssignUid.lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5003,"subType":null,"widthUnits":"px"},{"caption":"Username","sortable":true,"dataIndex":"userByAssignUid.username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5004,"subType":null,"widthUnits":"px"},{"caption":"Password","sortable":true,"dataIndex":"userByAssignUid.password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5005,"subType":null,"widthUnits":"px"},{"caption":"Email","sortable":true,"dataIndex":"userByAssignUid.email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5006,"subType":null,"widthUnits":"px"},{"caption":"Createdate","sortable":true,"dataIndex":"userByAssignUid.createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5007,"subType":null,"widthUnits":"px"},{"caption":"Role","sortable":true,"dataIndex":"userByAssignUid.role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5008,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"userByAssignUid.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5009,"subType":null,"widthUnits":"px"},{"caption":"Uid","sortable":true,"dataIndex":"userByReportedUid.uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":6000,"subType":null,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"userByReportedUid.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6001,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"userByReportedUid.firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6002,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"userByReportedUid.lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6003,"subType":null,"widthUnits":"px"},{"caption":"Username","sortable":true,"dataIndex":"userByReportedUid.username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6004,"subType":null,"widthUnits":"px"},{"caption":"Password","sortable":true,"dataIndex":"userByReportedUid.password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6005,"subType":null,"widthUnits":"px"},{"caption":"Email","sortable":true,"dataIndex":"userByReportedUid.email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6006,"subType":null,"widthUnits":"px"},{"caption":"Createdate","sortable":true,"dataIndex":"userByReportedUid.createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6007,"subType":null,"widthUnits":"px"},{"caption":"Role","sortable":true,"dataIndex":"userByReportedUid.role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6008,"subType":null,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"userByReportedUid.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6009,"subType":null,"widthUnits":"px"}]}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectMenu.selectedItem","targetProperty":"filter.project"}, {}],
wire2: ["wm.Wire", {"expression":"${issueStatusTogglePanel.currentButtonCaption} == \"All\" ? undefined : ${issueStatusTogglePanel.currentButtonCaption} ","source":false,"targetProperty":"filter.status"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"assignedToMenu.selectedItem.uid","targetProperty":"filter.userByAssignUid.uid"}, {}]
}]
}],
projectListLVar: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Project"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Project","view":[{"caption":"Pid","sortable":true,"dataIndex":"pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Url","sortable":true,"dataIndex":"url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Prefix","sortable":true,"dataIndex":"prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null}]}, {}]
}],
userListLVar: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.User"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.User","view":[{"caption":"Uid","sortable":true,"dataIndex":"uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Username","sortable":true,"dataIndex":"username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Password","sortable":true,"dataIndex":"password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Email","sortable":true,"dataIndex":"email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Role","sortable":true,"dataIndex":"role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}]
}],
versionLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Version"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectEditor.selectedItem","targetProperty":"filter.project"}, {}]
}],
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Version","view":[{"caption":"Vid","sortable":true,"dataIndex":"vid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Releasedate","sortable":true,"dataIndex":"releasedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Status","sortable":true,"dataIndex":"status","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null}]}, {}]
}],
issuesGraphVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
issuePriorityGraphVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
notificationCall1: ["wm.NotificationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"alertInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"<p>The editors and toggle buttons are used to set the filter for the LiveVariable that loads the issues list.  This has been done using Binding.</p><p>The charts below are populated by doing a simple transform on the issue list in order to have a dataSet that shows the counts of each item type.  This transform is one of the few places where javascript was required for this application.</p>\"","targetProperty":"text"}, {}]
}]
}]
}],
assignedToMenuDataValue: ["wm.Property", {"bindSource":1,"bindTarget":1,"property":"assignedToMenu.dataValue","type":"String"}, {}],
hideSummaryVar: ["wm.Variable", {"type":"BooleanData"}, {}],
hideSummaryVarDataSet: ["wm.Property", {"bindSource":undefined,"bindTarget":1,"property":"hideSummaryVar.dataSet","type":"BooleanData"}, {}],
loadingDialog1: ["wm.LoadingDialog", {"image":"lib/dojo/dojo/../../../lib/wm/base/widget/themes/default/images/loadingThrobber.gif"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issuesGrid","targetProperty":"widgetToCover"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"issueListLVar","targetProperty":"serviceVariableToTrack"}, {}]
}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
mainPanel: ["wm.Panel", {"enableTouchHeight":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
issuesGridPanel: ["wm.Panel", {"_classes":{"domNode":["LeftMenu"]},"border":"0,1,0,0","height":"100%","horizontalAlign":"right","styles":{"backgroundGradient":""},"verticalAlign":"top","width":"200px"}, {}, {
issuesGrid: ["wm.DojoGrid", {"border":"0","columns":[{"show":false,"field":"iid","title":"Iid","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tid","title":"Tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"name","title":"Issue","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"expression":"var showName = main.pageContainer.page.showNameCheckbox.getChecked();\nvar showSummary = main.pageContainer.page.showSummaryCheckbox.getChecked();\n(showName ? ${name} : \"\") + (showName && showSummary ? \": \" : \"\") + (showSummary ? ${summary} : \"\")","mobileColumn":false},{"show":false,"field":"createdate","title":"Createdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"closedate","title":"Closedate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"summary","title":"Issues","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"issuetype","title":"Issuetype","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"priority","title":"Priority","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"path","title":"Path","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"status","title":"Status","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"flag","title":"Flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.pid","title":"Project.pid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.tid","title":"Project.tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.name","title":"Project.name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.description","title":"Project.description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.url","title":"Project.url","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.prefix","title":"Project.prefix","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"project.flag","title":"Project.flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.vid","title":"VersionByReportedVid.vid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.tid","title":"VersionByReportedVid.tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.name","title":"VersionByReportedVid.name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.description","title":"VersionByReportedVid.description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.releasedate","title":"VersionByReportedVid.releasedate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"versionByReportedVid.status","title":"VersionByReportedVid.status","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByReportedVid.flag","title":"VersionByReportedVid.flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.vid","title":"VersionByFixedVid.vid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.tid","title":"VersionByFixedVid.tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.name","title":"VersionByFixedVid.name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.description","title":"VersionByFixedVid.description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.releasedate","title":"VersionByFixedVid.releasedate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"versionByFixedVid.status","title":"VersionByFixedVid.status","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"versionByFixedVid.flag","title":"VersionByFixedVid.flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.uid","title":"UserByAssignUid.uid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.tid","title":"UserByAssignUid.tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.firstname","title":"UserByAssignUid.firstname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.lastname","title":"UserByAssignUid.lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.username","title":"UserByAssignUid.username","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.password","title":"UserByAssignUid.password","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.email","title":"UserByAssignUid.email","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.createdate","title":"UserByAssignUid.createdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"userByAssignUid.role","title":"UserByAssignUid.role","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByAssignUid.flag","title":"UserByAssignUid.flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.uid","title":"UserByReportedUid.uid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.tid","title":"UserByReportedUid.tid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.firstname","title":"UserByReportedUid.firstname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.lastname","title":"UserByReportedUid.lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.username","title":"UserByReportedUid.username","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.password","title":"UserByReportedUid.password","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.email","title":"UserByReportedUid.email","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.createdate","title":"UserByReportedUid.createdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"userByReportedUid.role","title":"UserByReportedUid.role","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"userByReportedUid.flag","title":"UserByReportedUid.flag","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"","mobileColumn":true}],"height":"100%","localizationStructure":{},"margin":"0","minDesktopHeight":60}, {"onSelect":"issuesGridSelect"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issueListLVar","targetProperty":"dataSet"}, {}]
}]
}],
panel1: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
newIssueButton: ["wm.Button", {"caption":"New","desktopHeight":"40px","height":"40px","margin":"4","width":"103px"}, {"onclick2":"issueViewLayer","onclick3":"issueDBForm.editNewObject"}]
}]
}],
issuesMainPanel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel2: ["wm.MainContentPanel", {"border":"0","enableTouchHeight":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
layers: ["wm.BreadcrumbLayers", {"clientBorder":"1,0,0,1","desktopHeaderHeight":"28px","enableTouchHeight":true,"margin":"0,0,0,1"}, {}, {
searchLayer: ["wm.Layer", {"autoScroll":true,"border":"1,0,0,1","borderColor":"","caption":"Search","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"!${hideSummaryVar.dataValue} || Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}],
issueStatusTogglePanel: ["wm.ToggleButtonPanel", {"_classes":{"domNode":["TogglePanel"]},"borderColor":"#000000","horizontalAlign":"left","margin":"4","verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"allIssuesToggle","targetProperty":"currentButton"}, {}]
}],
allIssuesToggle: ["wm.Button", {"border":"0,1,0,0","borderColor":"#282828","caption":"All","height":"100%","margin":"0","width":"100%"}, {}],
closedIssueToggle: ["wm.Button", {"border":"0,1,0,0","borderColor":"#282828","caption":"Closed","height":"100%","margin":"0","width":"100%"}, {}],
openIssueToggle: ["wm.Button", {"border":"0,1,0,0","borderColor":"#282828","caption":"Open","height":"100%","margin":"0","width":"100%"}, {}],
inProgressToggle: ["wm.Button", {"border":"0","borderColor":"#282828","caption":"Progress","height":"100%","margin":"0","width":"100%"}, {}]
}],
panel3: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"35px","verticalAlign":"top","width":"100%"}, {}, {
projectMenu: ["wm.SelectMenu", {"allowNone":true,"caption":undefined,"dataType":"com.issuecloudv3db.data.Project","dataValue":undefined,"desktopHeight":"35px","displayField":"name","displayValue":"","height":"35px","padding":"4","placeHolder":"Select Project","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectListLVar","targetProperty":"dataSet"}, {}]
}]
}],
assignedToMenu: ["wm.SelectMenu", {"allowNone":true,"caption":undefined,"dataType":"com.issuecloudv3db.data.User","dataValue":undefined,"desktopHeight":"35px","displayField":"username","displayValue":"","height":"35px","padding":"4","placeHolder":"Assigned to","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userListLVar","targetProperty":"dataSet"}, {}]
}]
}],
searchHelpButton: ["wm.Button", {"caption":"Help","margin":"4","mobileHeight":"35px","width":"60px"}, {"onclick":"notificationCall1"}]
}],
panel5: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
showNameCheckbox: ["wm.Checkbox", {"caption":"Show Name","captionAlign":"left","captionPosition":"right","desktopHeight":"35px","displayValue":true,"height":"35px","startChecked":true,"width":"150px"}, {"onchange":"showCheckboxChange"}],
showSummaryCheckbox: ["wm.Checkbox", {"caption":"Show Summary","captionAlign":"left","captionPosition":"right","captionSize":"120px","desktopHeight":"35px","displayValue":true,"height":"35px","startChecked":true,"width":"164px"}, {"onchange":"showCheckboxChange"}]
}],
dojoChart1: ["wm.DojoChart", {"chartType":"Pie","padding":"4","width":"100%","xAxis":"name","yAxis":"dataValue"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issuesGraphVar","targetProperty":"dataSet"}, {}]
}]
}],
issuePriorityChart: ["wm.DojoChart", {"height":"300px","hideLegend":true,"legendHeight":"0px","padding":"4","width":"100%","xAxis":"name","yAxis":"dataValue"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issuePriorityGraphVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
issueViewLayer: ["wm.Layer", {"border":"1,0,0,1","borderColor":"","caption":"Issue","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
issueDBForm: ["wm.DBForm", {"autoScroll":true,"captionAlign":"left","captionSize":"100px","confirmChangeOnDirty":undefined,"height":"100%","isCompositeKey":false,"readonly":true,"readonlyManager":true,"type":"com.issuecloudv3db.data.Issue"}, {"onEnterKeyPress":"issueDBForm.saveData","onEnterKeyPress1":"issueViewLayer","onSuccess":"issueListLVar"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issuesGrid.selectedItem","targetProperty":"dataSet"}, {}],
wire1: ["wm.Wire", {"source":"issueDBFormButtonPanel","targetId":null,"targetProperty":"buttonPanel"}, {}],
wire2: ["wm.Wire", {"source":"issueDBFormNewButton","targetId":null,"targetProperty":"newButton"}, {}],
wire3: ["wm.Wire", {"source":"issueDBFormEditButton","targetId":null,"targetProperty":"editButton"}, {}],
wire4: ["wm.Wire", {"source":"issueDBFormDeleteButton","targetId":null,"targetProperty":"deleteButton"}, {}],
wire5: ["wm.Wire", {"source":"issueDBFormCancelButton","targetId":null,"targetProperty":"cancelButton"}, {}],
wire6: ["wm.Wire", {"source":"issueDBFormSaveButton","targetId":null,"targetProperty":"saveButton"}, {}]
}],
iidEditor1: ["wm.Number", {"caption":"Iid","captionAlign":"left","changeOnKey":true,"dataValue":0,"desktopHeight":"35px","emptyValue":"zero","formField":"iid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
tidEditor1: ["wm.Number", {"caption":"Tid","captionAlign":"left","changeOnKey":true,"desktopHeight":"35px","emptyValue":"zero","formField":"tid","height":"35px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"1","targetProperty":"dataValue"}, {}]
}]
}],
nameEditor1: ["wm.Text", {"caption":"Name","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"35px","emptyValue":"emptyString","formField":"name","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
summaryEditor1: ["wm.Text", {"autoSizeHeight":true,"caption":"Summary","captionAlign":"left","changeOnKey":true,"dataValue":"","desktopHeight":"35px","emptyValue":"emptyString","formField":"summary","height":"35px","minDesktopHeight":40,"minHeight":40,"minMobileHeight":40,"readonly":true,"required":true,"width":"100%"}, {}],
statusEditorPanel: ["wm.Panel", {"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
projectEditor: ["wm.Lookup", {"caption":"Project","captionAlign":"left","dataType":"com.issuecloudv3db.data.Project","dataValue":undefined,"desktopHeight":"35px","displayField":"name","formField":"project","height":"35px","readonly":true,"width":"100%"}, {}],
statusEditor: ["wm.SelectMenu", {"caption":"Status","captionAlign":"left","dataField":"dataValue","dataValue":undefined,"desktopHeight":"35px","displayField":"dataValue","formField":"status","height":"35px","options":"Open, In Progress, Closed","readonly":true,"width":"100%"}, {}]
}],
panel4: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"35px","verticalAlign":"top","width":"100%"}, {}, {
createdateEditor1: ["wm.DateTime", {"caption":"Created","captionAlign":"left","dateMode":"Date","desktopHeight":"35px","emptyValue":"zero","formField":"createdate","height":"35px","readonly":true,"required":true,"width":"100%"}, {}],
closedateEditor1: ["wm.DateTime", {"caption":"Closed","captionAlign":"left","dateMode":"Date","desktopHeight":"35px","emptyValue":"zero","formField":"closedate","height":"35px","readonly":true,"width":"100%"}, {}]
}],
panel7: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"35px","verticalAlign":"top","width":"100%"}, {}, {
issueTypeEditor: ["wm.SelectMenu", {"caption":"Issuetype","captionAlign":"left","dataField":"dataValue","dataValue":undefined,"desktopHeight":"35px","displayField":"dataValue","formField":"issuetype","height":"35px","options":"Bug, Improvement, New Feature","readonly":true,"width":"100%"}, {}],
priorityEditor: ["wm.SelectMenu", {"caption":"Priority","captionAlign":"left","dataField":"dataValue","dataValue":undefined,"desktopHeight":"35px","displayField":"dataValue","formField":"priority","height":"35px","options":"Minor, Major, Critical, Blocker","readonly":true,"width":"100%"}, {}]
}],
panel9: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"35px","verticalAlign":"top","width":"100%"}, {}, {
versionByReportedVidLookup1: ["wm.Lookup", {"autoDataSet":false,"caption":"Version Reported","captionAlign":"left","dataType":"com.issuecloudv3db.data.Version","dataValue":undefined,"desktopHeight":"35px","displayField":"name","formField":"versionByReportedVid","height":"35px","readonly":true,"width":"100%"}, {}, {
binding1: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"versionByReportedVidLookup1.liveVariable","targetProperty":"dataSet"}, {}]
}],
binding: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"versionByReportedVidLookup1.liveVariable","targetProperty":"dataSet"}, {}],
wire: ["wm.Wire", {"expression":undefined,"source":"versionLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
versionByFixedVidLookup1: ["wm.Lookup", {"caption":"Fixed by","captionAlign":"left","dataType":"com.issuecloudv3db.data.Version","dataValue":undefined,"desktopHeight":"35px","displayField":"name","formField":"versionByFixedVid","height":"35px","readonly":true,"width":"100%"}, {}, {
binding1: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"versionByFixedVidLookup1.liveVariable","targetProperty":"dataSet"}, {}]
}]
}]
}],
panel10: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"35px","verticalAlign":"top","width":"100%"}, {}, {
userByAssignUidLookup1: ["wm.Lookup", {"caption":"Assigned to","captionAlign":"left","dataType":"com.issuecloudv3db.data.User","dataValue":undefined,"desktopHeight":"35px","displayField":"username","formField":"userByAssignUid","height":"35px","readonly":true,"width":"100%"}, {}, {
binding1: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"userByAssignUidLookup1.liveVariable","targetProperty":"dataSet"}, {}]
}]
}],
userByReportedUidLookup1: ["wm.Lookup", {"caption":"Reported by","captionAlign":"left","dataType":"com.issuecloudv3db.data.User","dataValue":undefined,"desktopHeight":"35px","displayField":"username","formField":"userByReportedUid","height":"35px","readonly":true,"width":"100%"}, {}, {
binding1: ["wm.Binding", {}, {}, {
dataFieldWire: ["wm.Wire", {"source":"userByReportedUidLookup1.liveVariable","targetProperty":"dataSet"}, {}]
}]
}]
}],
descriptionEditor1: ["wm.LargeTextArea", {"caption":"Description","captionSize":"28px","changeOnKey":true,"dataValue":"","emptyValue":"emptyString","formField":"description","height":"100%","readonly":true,"width":"100%"}, {}],
issueDBFormButtonPanel: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"desktopHeight":"32px","enableTouchHeight":true,"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","mobileHeight":"40px","verticalAlign":"top","width":"100%"}, {}, {
issueDBFormEditButton: ["wm.Button", {"caption":"Edit","margin":"4"}, {"onclick":"issueDBForm.editCurrentObject"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"issueDBForm.noDataSet","targetId":null,"targetProperty":"disabled"}, {}]
}]
}],
issueDBFormDeleteButton: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"issueDBForm.deleteData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"issueDBForm.noDataSet","targetId":null,"targetProperty":"disabled"}, {}]
}]
}],
issueDBFormCancelButton: ["wm.Button", {"caption":"Cancel","margin":"4","showing":false}, {"onclick":"issueDBForm.cancelEdit"}],
issueDBFormSaveButton: ["wm.Button", {"caption":"Save","margin":"4","showing":false}, {"onclick":"issueDBForm.saveData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${issueDBForm.invalid} || !${issueDBForm.isDirty}","targetId":null,"targetProperty":"disabled"}, {}]
}]
}]
}]
}]
}],
commentsLayer: ["wm.Layer", {"border":"1,0,0,1","borderColor":"","caption":"Comments","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
commentsOneToMany1: ["wm.OneToMany", {"caption":"Comments","dataValue":undefined,"displayField":"description","displayValue":"","height":"100%","width":"100%"}, {}]
}]
}]
}]
}]
}]
}]
};

IssuesPage.prototype._cssText = '';
IssuesPage.prototype._htmlText = '';