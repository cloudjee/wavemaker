dojo.declare("Main", wm.Page, {
"preferredDevice": "desktop",
start: function() {
// subscribe session expiration
dojo.subscribe("session-expiration", this, "sessExp");
this.initSups();
},
sessExp: function (){
proto = window.location.protocol
host = window.location.host;
appName = app.declaredClass;
// Doctor url for login page
window.location.href = proto + "//" + host +"/"+ appName +"/login.html";
},
// Initializes link to show underline and change mouse to pointer onHover
initLink: function (inLink){
this.connect(inLink.domNode, "onmouseover", this, dojo.hitch(this, "linkMouseOver", inLink));
this.connect(inLink.domNode, "onmouseout", this, dojo.hitch(this, "linkMouseOut", inLink));
this.labHome.domNode.style.cursor = "pointer";
},
// intit subscription & CSS
initSups: function() {
// hide control panel until roles
// determined; see svGetRoleResult()
this.panControl.setShowing(false);
// load dojo hash
dojo.require("dojo.hash");
// subscribe URL change events
dojo.connect(window,"onhashchange",this, "callback");
//dojo.connect(dojo.global, "onhashchange", this, "callback");
this.initLink(this.labHome);
this.initLink(this.labMyAccount);
this.initLink(this.labUserAccount);
this.initLink(this.labProject);
this.initLink(this.labIssue);
this.initLink(this.labLogout);
// load the issues page in the background
// so that a bookmark request can be performed
//this.pcPages.loadPage("Chart");
},
// ******** LINK HOVER EVENTS *********
// mouse hover functions for links
linkMouseOver: function(inWidget) {
inWidget.domNode.style.textDecoration = "underline";
},
linkMouseOut: function(inWidget) {
inWidget.domNode.style.textDecoration = "";
},
// ******** BUTTON HOVER EVENTS *********
// mouse hover functions for buttons
btnMouseOver: function(inWidget) {
inWidget.setBorder(3);
inWidget.setBorderColor("#FF9966");
},
btnMouseOut: function(inWidget) {
inWidget.setBorder(1);
inWidget.setBorderColor("#ABB8CF");
},
// ******** OWN FUNCTIONS *********
// sets 2 URL parameters
setHash: function(inPage,inParam) {
if(inParam>0) {
obj = {
page: inPage,
param: inParam
}
} else {
obj = {
page: inPage
}
}
dojo.hash(dojo.objectToQuery(obj));
},
// gets the paramter of the URL hash
getHashParam: function() {
var obj = dojo.queryToObject(dojo.hash());
return obj.param;
},
// updates the parameter value
updateHashParam: function (inParam) {
var obj = dojo.queryToObject(dojo.hash());
obj.param = inParam;
dojo.hash(dojo.objectToQuery(obj));
},
// adds a tailing segment to the url
addHashTail: function (inTailing) {
var obj = dojo.hash().split("/");
obj.push(inTailing);
dojo.hash(obj.join("/"));
},
// called when URL changed by dojo.hash() function
callback: function () {
//hashchange event
var obj = dojo.queryToObject(dojo.hash());
switch(obj.page) {
case "home":        this.ncHome.update();
break;
case "myaccount":   this.ncMyAccount.update();
break;
case "useraccount": this.ncUAccount.update();
break;
case "project":     this.ncProject.update();
break;
case "issue":       this.ncIssue.update();
break;
case "issues":      this.ncIssues.update();
break;
case "comment":     if(app.vCommentId.getValue("dataValue") >= 0) {
this.ncComment.update();
}
break;
};
},
// load all properties for page load
pageLoad: function(inSpinnerName, inNavCall) {
try {
// sets the height for the layer
//this.pcPages.setHeight("0px");
// invokes nav call
this[inNavCall].update();
} catch(e) {
console.error('ERROR IN pageLoad: ' + e);
}
},
// ******** SERVICE VAR EVENTS *********
// set the width for the link panel in the header
svGetRoleResult: function(inSender, inData) {
try {
if(inSender.getItem(0).getData().dataValue == "admin") {
this.panControl.setWidth("620px");
} else if(inSender.getItem(0).getData().dataValue == "user") {
this.panControl.setWidth("420px");
}
this.panControl.reflow();
this.panControl.setShowing(true);
} catch(e) {
console.error('ERROR IN svGetRoleResult: ' + e);
}
},
// ******** LINK CLICK EVENTS *********
// home link
labHomeClick: function(inSender, inEvent) {
try {
// set URL and callback gets invoked
this.setHash("home");
} catch(e) {
console.error('ERROR IN labHomeClick: ' + e);
}
},
// myaccount link
labMyAccountClick: function(inSender, inEvent) {
try {
this.setHash("myaccount");
} catch(e) {
console.error('ERROR IN labMyAccountClick: ' + e);
}
},
// user account link
labUserAccountClick: function(inSender, inEvent) {
try {
this.setHash("useraccount");
} catch(e) {
console.error('ERROR IN labUserAccountClick: ' + e);
}
},
// project link
labProjectClick: function(inSender, inEvent) {
try {
this.setHash("project");
} catch(e) {
console.error('ERROR IN labProjectClick: ' + e);
}
},
// issue link
labIssueClick: function(inSender, inEvent) {
try {
this.setHash("issues");
} catch(e) {
console.error('ERROR IN labIssueClick: ' + e);
}
},
// logout link
labLogoutClick: function(inSender, inEvent) {
try {
wm.logout();
} catch(e) {
console.error('ERROR IN labLogoutClick: ' + e);
}
},
_end: 0
});

Main.widgets = {
svGetRole: ["wm.ServiceVariable", {"operation":"getUserRoles","service":"securityService","startUpdate":true}, {"onResult":"svGetRoleResult"}, {
input: ["wm.ServiceInput", {"type":"getUserRolesInputs"}, {}]
}],
ncMyAccount: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"MAccount\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncHome: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"Chart\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncProject: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"Project\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncUAccount: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"UAccount\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncIssue: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"Issue\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncIssues: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"Issues\"","targetProperty":"pageName"}, {}]
}]
}]
}],
ncComment: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"Comments\"","targetProperty":"pageName"}, {}]
}]
}]
}],
svGetInvolved: ["wm.ServiceVariable", {"operation":"getInvolved","service":"jsSendMail"}, {}, {
input: ["wm.ServiceInput", {"type":"getInvolvedInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"inID"}, {}]
}]
}]
}],
svGetMails: ["wm.ServiceVariable", {"operation":"getInvolved","service":"jsSendMail"}, {}, {
input: ["wm.ServiceInput", {"type":"getInvolvedInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"issueid"}, {}],
wire1: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"inID"}, {}]
}]
}]
}],
navigationCall1: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"IssuesV2\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCall2: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"IssueMain\"","targetProperty":"pageName"}, {}]
}]
}]
}],
lbxHome: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
CenteredLayout: ["wm.Template", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
contentPanel: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteOutsetPanel"]},"borderColor":"#B8B8B8","height":"100%","horizontalAlign":"center","width":"100%"}, {}, {
panHeader: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0,0,3,0","borderColor":"#656565","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
picLogo: ["wm.Picture", {"aspect":"h","height":"88px","width":"343px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/logos/IssueCloudLogo.png\"","targetProperty":"source"}, {}]
}]
}],
spa2: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
panControl: ["wm.Panel", {"height":"95px","horizontalAlign":"left","verticalAlign":"top","width":"620px"}, {}, {
spacer4: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
panLinks: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"165%"}, {}, {
labHome: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,1","borderColor":"#B1B1B1","caption":"Home","height":"100%","padding":"4","width":"100px"}, {"onclick":"labHomeClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
labMyAccount: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"My Account","height":"100%","padding":"4","width":"100px"}, {"onclick":"labMyAccountClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
labUserAccount: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"User Account","height":"100%","padding":"4","width":"100px"}, {"onclick":"labUserAccountClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
labProject: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Project","height":"100%","padding":"4","width":"100px"}, {"onclick":"labProjectClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
labIssue: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Issue","height":"100%","padding":"4","width":"100px"}, {"onclick":"labIssueClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
labLogout: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Logout","height":"100%","padding":"4","width":"100%"}, {"onclick":"labLogoutClick"}, {
format: ["wm.DataFormatter", {}, {}]
}],
spacer1: ["wm.Spacer", {"height":"100%","width":"20px"}, {}]
}]
}]
}],
panel1: ["wm.Panel", {"autoScroll":true,"height":"800px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"1000px"}, {}, {
pcPages: ["wm.PageContainer", {"pageName":"Chart","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
panFooter: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"3,0,0,0","borderColor":"#656565","height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","lock":true,"verticalAlign":"middle","width":"100%"}, {}, {
labFooter: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Right","wm_FontColor_Graphite"]},"caption":"Copyright 2010 WaveMaker, Inc.","height":"20px","padding":"4","width":"186px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
picIcon: ["wm.Picture", {"aspect":"v","height":"20px","width":"20px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/logos/WaveMaker.ico\"","targetProperty":"source"}, {}]
}]
}],
labVersion: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Graphite","wm_TextAlign_Left"]},"caption":"Version Beta 1.07","height":"20px","padding":"4","width":"120px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panRest: ["wm.Panel", {"borderColor":"#B8B8B8","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}]
}]
}]
}]
};

Main.prototype._cssText = '.Main .Main-CenteredLayout {\
background: #B8B8B8\
}\
.Main .Main-labHome {\
color: #326dcf\
}\
.Main .Main-labMyAccount {\
color: #326dcf\
}\
.Main .Main-labUserAccount {\
color: #326dcf\
}\
.Main .Main-labProject {\
color: #326dcf\
}\
.Main .Main-labIssue {\
color: #326dcf\
}\
.Main .Main-labLogout {\
color: #326dcf\
}\
.Main .Main-panRest {\
background: #B8B8B8\
}\
.Main .Main-contentPanel {\
background: #B8B8B8\
}\
.Main .Main-pcPages {\
background: #FFFFFF\
}\
';
Main.prototype._htmlText = '<div id=amazon>\
<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab" id="Player_2fbef003-d120-467d-b9a8-07092cfad2a8"  WIDTH="600px" HEIGHT="200px"> <PARAM NAME="movie" VALUE="http://ws.amazon.com/widgets/q?ServiceVersion=20070822&MarketPlace=US&ID=V20070822%2FUS%2Fwidgetsamazon-20%2F8010%2F2fbef003-d120-467d-b9a8-07092cfad2a8&Operation=GetDisplayTemplate"><PARAM NAME="quality" VALUE="high"><PARAM NAME="bgcolor" VALUE="#FFFFFF"><PARAM NAME="allowscriptaccess" VALUE="always"><embed src="http://ws.amazon.com/widgets/q?ServiceVersion=20070822&MarketPlace=US&ID=V20070822%2FUS%2Fwidgetsamazon-20%2F8010%2F2fbef003-d120-467d-b9a8-07092cfad2a8&Operation=GetDisplayTemplate" id="Player_2fbef003-d120-467d-b9a8-07092cfad2a8" quality="high" bgcolor="#ffffff" name="Player_2fbef003-d120-467d-b9a8-07092cfad2a8" allowscriptaccess="always"  type="application/x-shockwave-flash" align="middle" height="200px" width="600px"></embed></OBJECT> <NOSCRIPT><A HREF="http://ws.amazon.com/widgets/q?ServiceVersion=20070822&MarketPlace=US&ID=V20070822%2FUS%2Fwidgetsamazon-20%2F8010%2F2fbef003-d120-467d-b9a8-07092cfad2a8&Operation=NoScript">Amazon.com Widgets</A></NOSCRIPT>\
</div>\
';