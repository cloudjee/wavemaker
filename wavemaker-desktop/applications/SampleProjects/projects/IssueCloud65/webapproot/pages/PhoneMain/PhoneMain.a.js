dojo.declare("PhoneMain", wm.Page, {
start: function() {
},
"preferredDevice": "phone",
statusChangeButtonClick: function(inSender) {
if (this.statusEditor1.getDataValue() == "Open") {
this.statusEditor1.setDataValue("In Progress");
} else if (this.statusEditor1.getDataValue() == "In Progress") {
this.statusEditor1.setDataValue("Closed");
} else {
this.statusEditor1.setDataValue("Open");
}
this.liveForm1.operation = "update";
this.liveForm1.saveData();
},
detailsLayerShow: function(inSender) {
this.summaryEditor1.doAutoSize(1,1);
this.descriptionEditor1.doAutoSize(1,1);
},
_end: 0
});

PhoneMain.widgets = {
issueLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Issue"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire1: ["wm.Wire", {"expression":undefined,"source":"projectSelect.selectedItem","targetProperty":"filter.project"}, {}],
wire2: ["wm.Wire", {"expression":undefined,"source":"statusSelect.dataValue","targetProperty":"filter.status"}, {}],
wire: ["wm.Wire", {"expression":undefined,"source":"userSelect.dataValue","targetProperty":"filter.userByAssignUid.uid"}, {}]
}],
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Issue","related":["project"],"view":[{"caption":"Iid","sortable":true,"dataIndex":"iid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Closedate","sortable":true,"dataIndex":"closedate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Summary","sortable":true,"dataIndex":"summary","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Issuetype","sortable":true,"dataIndex":"issuetype","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Priority","sortable":true,"dataIndex":"priority","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Path","sortable":true,"dataIndex":"path","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null},{"caption":"Status","sortable":true,"dataIndex":"status","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":10,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":11,"subType":null},{"caption":"Pid","sortable":true,"dataIndex":"project.pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"project.tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"project.name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"project.description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Url","sortable":true,"dataIndex":"project.url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Prefix","sortable":true,"dataIndex":"project.prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"project.flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null}]}, {}]
}],
projectLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.Project"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.Project","view":[{"caption":"Pid","sortable":true,"dataIndex":"pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Url","sortable":true,"dataIndex":"url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Prefix","sortable":true,"dataIndex":"prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null}]}, {}]
}],
userLiveVariable1: ["wm.LiveVariable", {"type":"com.issuecloudv3db.data.User"}, {}, {
liveView: ["wm.LiveView", {"dataType":"com.issuecloudv3db.data.User","view":[{"caption":"Uid","sortable":true,"dataIndex":"uid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Username","sortable":true,"dataIndex":"username","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Password","sortable":true,"dataIndex":"password","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Email","sortable":true,"dataIndex":"email","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Role","sortable":true,"dataIndex":"role","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"right","verticalAlign":"top"}, {}, {
titlePanel: ["wm.Panel", {"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","styles":{"backgroundGradient":{"direction":"vertical","startColor":"#dadae4","endColor":"#39393b","colorStop":20},"color":"#ffffff","fontWeight":"bold","fontSize":"16px"},"verticalAlign":"top","width":"100%"}, {}, {
backButton: ["wm.MobileIconButton", {"border":"0","direction":"back"}, {"onclick":"app._onBack"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}]
}],
title: ["wm.Label", {"align":"center","caption":"Issue List","height":"100%","padding":"4","width":"100%"}, {}],
searchButton: ["wm.Button", {"caption":undefined,"height":"40px","imageIndex":66,"imageList":"app.silkIconList","margin":"4","width":"40px"}, {"onclick":"searchPanel.show","onclick1":"titlePanel.hide","onclick2":"issueListLayer"}]
}],
breadcrumbLayers1: ["wm.BreadcrumbLayers", {}, {}, {
issueListLayer: ["wm.Layer", {"borderColor":"","caption":"Issues","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"backButton.hide"}, {
searchPanel: ["wm.Panel", {"desktopHeight":"107px","enableTouchHeight":true,"height":"109px","horizontalAlign":"left","layoutKind":"left-to-right","mobileHeight":"109px","verticalAlign":"top","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"Boolean(window[\"studio\"])","targetProperty":"showing"}, {}]
}],
searchPanelInner: ["wm.Panel", {"desktopHeight":"107px","enableTouchHeight":true,"fitToContentHeight":true,"height":"107px","horizontalAlign":"left","mobileHeight":"107px","verticalAlign":"top","width":"100%"}, {}, {
userSelect: ["wm.SelectMenu", {"allowNone":true,"caption":"User","captionAlign":"left","captionSize":"80px","dataField":"uid","dataType":"com.issuecloudv3db.data.User","dataValue":undefined,"desktopHeight":"35px","displayField":"username","displayValue":"","height":"35px","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
projectSelect: ["wm.SelectMenu", {"allowNone":true,"caption":"Project","captionAlign":"left","captionSize":"80px","dataType":"com.issuecloudv3db.data.Project","dataValue":undefined,"desktopHeight":"35px","displayField":"name","displayValue":"","height":"35px","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"projectLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}],
statusSelect: ["wm.SelectMenu", {"allowNone":true,"caption":"Status","captionAlign":"left","captionSize":"80px","dataField":"dataValue","dataType":"com.issuecloudv3db.data.Project","dataValue":"Open","desktopHeight":"35px","displayField":"dataValue","displayValue":"Open","height":"35px","options":"Open, In Progress, Closed","width":"100%"}, {}]
}],
cancelSearch: ["wm.Button", {"caption":undefined,"height":"40px","imageIndex":21,"imageList":"app.silkIconList","margin":"4","width":"40px"}, {"onclick":"searchPanel.hide","onclick1":"titlePanel.show"}]
}],
issueList: ["wm.List", {"_classes":{"domNode":["MobileListStyle"]},"border":"0","columns":[{"show":false,"field":"iid","title":"Iid","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tid","title":"Tid","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>\" + ${name} + \" (\" + ${status} + \")</div>\" +\n\"<div class='MobileRow'>\" + ${summary} + \"</div>\"\n","mobileColumn":false},{"show":false,"field":"createdate","title":"Createdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"closedate","title":"Closedate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"summary","title":"Summary","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"issuetype","title":"Issuetype","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"priority","title":"Priority","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"path","title":"Path","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"status","title":"Status","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"flag","title":"Flag","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"","isCustomField":true,"mobileColumn":false},{"show":true,"controller":"rightarrow","width":"20px","title":"-","field":"_rightArrow","mobileColumn":true}],"headerVisible":false,"height":"100%","isNavigationMenu":true,"margin":"0","minDesktopHeight":60,"rightNavArrow":true,"styleAsGrid":false}, {"onSelect":"detailsLayer"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issueLiveVariable1","targetProperty":"dataSet"}, {}]
}]
}]
}],
detailsLayer: ["wm.Layer", {"borderColor":"","caption":"Details","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"detailsLayerShow","onShow1":"backButton.show"}, {
liveForm1: ["wm.LiveForm", {"autoScroll":true,"captionAlign":"left","captionSize":"100px","enableTouchHeight":true,"height":"100%","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {"onSuccess":"issueLiveVariable1"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"issueList.selectedItem","targetProperty":"dataSet"}, {}]
}],
nameEditor1: ["wm.Text", {"caption":"Name","captionAlign":"left","changeOnKey":true,"dataValue":"wm-4","desktopHeight":"26px","emptyValue":"emptyString","formField":"name","height":"35px","readonly":true,"required":true,"singleLine":false,"width":"100%"}, {}],
summaryEditor1: ["wm.Text", {"autoSizeHeight":true,"caption":"Summary","captionAlign":"left","changeOnKey":true,"dataValue":"CSS rules don't work as expected on wm5.","desktopHeight":"26px","emptyValue":"emptyString","formField":"summary","height":"40px","minHeight":40,"minMobileHeight":40,"readonly":true,"required":true,"singleLine":false,"width":"100%"}, {}],
descriptionEditor1: ["wm.Text", {"autoSizeHeight":true,"caption":"Description","captionAlign":"left","changeOnKey":true,"dataValue":"CSS rules in wm5 don't work as they did for wm4. If this is an expected upgrade please point to any resource to benefit the community. I have attached a test case which i had created in wm4 and then opened on wm5 without the same results. Prior this exercise i tried various approaches tooling the css statement included in the project through the given CSS utilities, style dialog, custom style window, in wm5 without success.","desktopHeight":"26px","emptyValue":"emptyString","formField":"description","height":"40px","maxHeight":10000,"minHeight":40,"minMobileHeight":40,"readonly":true,"singleLine":false,"width":"100%"}, {}],
issuetypeEditor1: ["wm.Text", {"autoSizeHeight":true,"caption":"Issuetype","captionAlign":"left","changeOnKey":true,"dataValue":"Bug","desktopHeight":"26px","emptyValue":"emptyString","formField":"issuetype","height":"40px","minHeight":40,"minMobileHeight":40,"readonly":true,"singleLine":false,"width":"100%"}, {}],
priorityEditor1: ["wm.Text", {"autoSizeHeight":true,"caption":"Priority","captionAlign":"left","changeOnKey":true,"dataValue":"Critical","desktopHeight":"26px","emptyValue":"emptyString","formField":"priority","height":"40px","minHeight":40,"minMobileHeight":40,"readonly":true,"singleLine":false,"width":"100%"}, {}],
pathEditor1: ["wm.Text", {"caption":"Path","captionAlign":"left","changeOnKey":true,"dataValue":"[]","desktopHeight":"26px","emptyValue":"emptyString","formField":"path","height":"35px","readonly":true,"singleLine":false,"width":"100%"}, {}],
statusEditor1: ["wm.Text", {"caption":"Status","captionAlign":"left","changeOnKey":true,"dataValue":"Open","desktopHeight":"26px","emptyValue":"emptyString","formField":"status","height":"35px","readonly":true,"singleLine":false,"width":"100%"}, {}]
}],
buttonPanel: ["wm.Panel", {"_classes":{"domNode":["ToolBar"]},"height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
statusChangeButton: ["wm.Button", {"height":"40px","margin":"4","width":"141px"}, {"onclick":"statusChangeButtonClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${statusEditor1.dataValue} == \"Open\" ? \"Begin Progress\" : ${statusEditor1.dataValue} == \"In Progress\" ? \"Close Issue\" : \"Reopen Issue\"","targetProperty":"caption"}, {}]
}]
}]
}]
}]
}]
}]
};

PhoneMain.prototype._cssText = '';
PhoneMain.prototype._htmlText = '';