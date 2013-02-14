dojo.declare("Main", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
loginLinkClick: function(inSender, inEvent) {
},
aboutLinkClick: function(inSender, inEvent) {
this.loginLinkClick(inSender, inEvent);
},
navTogglePanelChange: function(inSender, inIndex) {
var pageName;
switch(this.navTogglePanel.currentButtonName) {
case "viewProjectsToggle":
pageName = "ProjectsPage";
break;
case "viewUsersToggle":
pageName = "UsersPage";
break;
default:
pageName = "IssuesPage";
}
this.pageContainer.setPageName(pageName);
},
mainMenuDesktopClick: function(inSender /*,args*/) {
window.location.search = "wmmobile=desktop";
},
mainMenuPhoneClick: function(inSender /*,args*/) {
window.location.search = "wmmobile=phone";
},
mainMenuTabletClick: function(inSender /*,args*/) {
window.location.search = "wmmobile=tablet";
},
_end: 0
});

Main.widgets = {
gotoIssuesPage: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"IssuesPage\"","targetProperty":"pageName"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"pageContainer","targetProperty":"pageContainer"}, {}]
}]
}]
}],
gotoProjectsNav: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"ProjectsPage\"","targetProperty":"pageName"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"pageContainer","targetProperty":"pageContainer"}, {}]
}]
}]
}],
gotoUsersNav: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"UsersPage\"","targetProperty":"pageName"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"pageContainer","targetProperty":"pageContainer"}, {}]
}]
}]
}],
helpNotificationCall: ["wm.NotificationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"alertInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"This header is set to only show on desktop computers and be hidden on tablets and phones.  This is done using the Mobile section of the properties panel.  Similarly, the ToggleButtonPanel used to navigate in the Tablet Application is set to only show for Tablet and Phone.\"","targetProperty":"text"}, {}]
}]
}]
}],
gotoUserAccountPage: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"pageContainer","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"UserAccountPage\"","targetProperty":"pageName"}, {}]
}]
}]
}],
logoutVariable1: ["wm.LogoutVariable", {"inFlightBehavior":"executeLast"}, {}, {
input: ["wm.ServiceInput", {"type":"logoutInputs"}, {}]
}],
designableDialog1: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"containerWidget","desktopHeight":"100px","height":"100px","mobileHeight":"100px","modal":false,"noMaxify":true,"noMinify":true,"title":"About Us","width":"300px"}, {}, {
containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
html1: ["wm.Html", {"height":"100%","html":"Welcome to IssueCloud, a sample application created to showcase WaveMaker's tools","minDesktopHeight":15}, {}]
}]
}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["PageBackground"]},"horizontalAlign":"center","verticalAlign":"top"}, {}, {
desktopHeader: ["wm.Panel", {"border":"0,0,4,0","borderColor":"#a6abb9","deviceType":["desktop"],"height":"88px","horizontalAlign":"left","layoutKind":"left-to-right","minWidth":800,"styles":{"fontSize":"16px","backgroundGradient":{"direction":"vertical","startColor":"#ffffff","endColor":"#dbdee6","colorStop":28}},"verticalAlign":"middle","width":"100%"}, {}, {
picture1: ["wm.Picture", {"aspect":"h","height":"88px","source":"resources/images/IssueCloudLogo.png","width":"280px"}, {}],
mainMenu: ["wm.DojoMenu", {"fullStructure":[{"label":"Issues","separator":undefined,"defaultLabel":"Issues","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"gotoIssuesPage","children":[]},{"label":"Projects","separator":undefined,"defaultLabel":"Projects","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"gotoProjectsNav","children":[]},{"label":"Accounts","separator":undefined,"defaultLabel":"Accounts","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"gotoUsersNav","children":[{"label":"Users","separator":undefined,"defaultLabel":"Users","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"gotoUsersNav","children":[]},{"label":"My Account","separator":undefined,"defaultLabel":"My Account","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"gotoUserAccountPage","children":[]}]},{"label":"Device","separator":undefined,"defaultLabel":"Device","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":undefined,"children":[{"label":"Phone","separator":undefined,"defaultLabel":"Phone","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"mainMenuPhoneClick","children":[]},{"label":"Tablet","separator":undefined,"defaultLabel":"Tablet","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"mainMenuTabletClick","children":[]},{"label":"Desktop","separator":undefined,"defaultLabel":"Desktop","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"mainMenuDesktopClick","children":[]}]},{"label":"Help","separator":undefined,"defaultLabel":"Help","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"helpNotificationCall","children":[]},{"label":"Logout","separator":undefined,"defaultLabel":"Logout","iconClass":undefined,"imageList":undefined,"idInPage":undefined,"isCheckbox":false,"onClick":"logoutVariable1","children":[]}],"localizationStructure":{}}, {}]
}],
navTogglePanel: ["wm.ToggleButtonPanel", {"_classes":{"domNode":["ToggleFooter"]},"border":"1,1,0,1","borderColor":"#000000","deviceType":["tablet","phone"],"horizontalAlign":"left","manageHistory":true,"manageURL":true,"verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"viewIssuesToggle","targetProperty":"currentButton"}, {}]
}],
viewIssuesToggle: ["wm.Button", {"border":"0,1,0,0","borderColor":"#282828","caption":"Issues","height":"100%","margin":"0","width":"100%"}, {"onclick":"gotoIssuesPage"}],
viewProjectsToggle: ["wm.Button", {"border":"0,1,0,0","borderColor":"#282828","caption":"Projects","height":"100%","margin":"0","width":"100%"}, {"onclick":"gotoProjectsNav"}],
viewUsersToggle: ["wm.Button", {"border":"0","borderColor":"#282828","caption":"Users","height":"100%","margin":"0","width":"100%"}, {"onclick":"gotoUsersNav"}]
}],
pageContainer: ["wm.PageContainer", {"deferLoad":true,"pageName":"IssuesPage","styles":{"backgroundColor":"#ffffff"},"subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{"assignedToMenuDataValue":"assignedToMenu.dataValue","hideSummaryVarDataSet":"hideSummaryVar.dataSet"}}, {}]
}]
};

Main.prototype._cssText = '';
Main.prototype._htmlText = '';