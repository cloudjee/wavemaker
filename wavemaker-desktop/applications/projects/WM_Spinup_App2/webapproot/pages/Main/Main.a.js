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

dojo.declare("Main", wm.Page, {
"preferredDevice": "desktop",
start: function() {
this.UserName.focus();
},
DownloadButton1Click: function(inSender) {
window.open("http://wavemaker.com/downloads/", "self");
},
LoginServiceVariableResult: function(inSender, inDeprecated) {
var successString = 'SUCCESS';
inSender.getData().dataValue.substring(0,successString.length) === successString ? this.LoginSuccess() : this.LoginError(inSender, inDeprecated);
},
LoginSuccess: function(inSender, inDeprecated) {
this.endWait();
this.LaunchStudioserviceVariable.update();
this.progressBar1.setProgress(0);
this.waitingLayer.activate();
this.progressBarTimer.startTimer();
this._startTimerTime = new Date().getTime();
this._endTimerTime = this._startTimerTime + 1000 * 120;
},
LoginError: function(inSender, inError) {
this.endWait();
if(!inError){inError = "The user name or password you entered is incorrect.";}
this.labelWarning.setCaption(inError);
this.labelWarning.setShowing(true);
this.error_warning_spacer_1.setShowing(true);
this.error_warning_spacer_2.setShowing(true);
this.loginLayer.activate();
this.Password.focus();
},
progressBarTimerTimerFire: function(inSender) {
var max = 1000 * 120;
var elapsed = Math.min(max,new Date().getTime() - this._startTimerTime);
var progress = 100 * elapsed / max;
this.progressBar1.setProgress(progress);
},
finishProgressBarTimerTimerFire: function(inSender) {
this.progressBar1.setProgress(this.progressBar1.getProgress() + 4);
if (this.progressBar1.getProgress() >= 100) {
this.finishProgressBarTimer.stopTimer();
}
},
getRandomTip: function() {
var rand = Math.floor(Math.random() * 100);
var nextTipIndex = rand % this.tipsVar.getCount();
var tip = this.tipsVar.getItem(nextTipIndex).getValue("dataValue");
if (tip == this.tipsHtml.html) return this.getRandomTip();
return nextTipIndex;
},
tipsTimerTimerFire: function(inSender) {
dojo.animateProperty({node: this.tipsHtmlPanel.domNode,
properties: {opacity: 0},
duration: 1500,
onEnd: dojo.hitch(this, function() {
var item = this.tipsVar.getItem(this.getRandomTip());
this.tipsHtml.setHtml(item.getValue("dataValue"));
this.tipsPic.setSource(item.getValue("name"));
dojo.animateProperty({node: this.tipsHtmlPanel.domNode,
properties: {opacity: 1},
duration: 1500
}).play();
})}).play();
},
LaunchStudioserviceVariableError: function(inSender, inError) {
this.endWait();
var error = (inSender.getDataSet().query({name:"ERROR"}).getItem(0) === false) ? inError.message : inSender.getDataSet().query({name:"ERROR"}).getItem(0).getValue("dataValue")
this.labelError.setShowing(true);
this.labelError.setCaption(inError.toString() != "Error" && error.length > 0 ? error : "Unable to deploy Studio to your account");
this.loginLayer.activate();
},
LaunchStudioserviceVariableSuccess: function(inSender, inDeprecated) {
this.endWait();
var result = inSender.getDataSet();
if (!result || result.query({name:"ERROR"}).getItem(0)) return this.LaunchStudioserviceVariableError(inSender, inSender);
token = result.query({name:"wavemaker_authentication_token"}).getItem(0).getValue("dataValue");
url =  result.query({name:"studio_url"}).getItem(0).getValue("dataValue");
cfdomain =  result.query({name:"domain"}).getItem(0).getValue("dataValue");
var cookie_expire = new Date();
cookie_expire.setTime(cookie_expire.getTime() + 30000);
dojo.cookie("wavemaker_authentication_token", token, {expires: cookie_expire.toGMTString(), domain: cfdomain});
window.location = url;
},
LogInButtonClick: function(inSender) {
this.beginWait("Logging in");
this.labelError.setShowing(false);
this.labelWarning.setShowing(false);
this.error_warning_spacer_1.setShowing(false);
this.error_warning_spacer_2.setShowing(false);
this.LoginServiceVariable.update();
},
beginWait: function(inMsg, inNoThrobber) {
if (!this.waitMsg) this.waitMsg = {};
if (!inMsg)
return;
this.dialog.setWidth("242px");
this.dialog.setHeight("115px");
this.dialog.containerNode.innerHTML = [
'<table class="wmWaitDialog"><tr><td>',
inNoThrobber ? '' : '<div class="wmWaitThrobber">&nbsp;</div>',
'<div class="wmWaitMessage">',
inMsg,
'</div>',
'<br />',
'</td></tr></table>',
''].join('');
this.dialog.setShowing(true);
this.waitMsg[inMsg] = 1;
},
endWait: function(optionalMsg) {
if (optionalMsg)
delete this.waitMsg[optionalMsg];
else
this.waitMsg = {};
var firstMsg = "";
for (var msg in this.waitMsg) {
firstMsg = msg;
break;
}
if (firstMsg)
this.beginWait(firstMsg);
else
this.dialog.setShowing(false);
},
_end: 0
});

Main.widgets = {
LoginServiceVariable: ["wm.ServiceVariable", {"operation":"login","service":"SpinUpService"}, {"onResult":"LoginServiceVariableResult"}, {
input: ["wm.ServiceInput", {"type":"loginInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"UserName.dataValue","targetProperty":"username"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"Password.dataValue","targetProperty":"password"}, {}]
}]
}]
}],
progressBarTimer: ["wm.Timer", {"delay":50}, {"onTimerFire":"progressBarTimerTimerFire"}],
finishProgressBarTimer: ["wm.Timer", {"delay":50}, {"onTimerFire":"finishProgressBarTimerTimerFire"}],
tipsVar: ["wm.Variable", {"isList":true,"json":"[\n\t{\n\t\t\"name\": \"resources/images/Tutorial.png\", \n\t\t\"dataValue\": \"There is a lot of functionality in WaveMaker.  To get started, work through a few  <a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.5/Tutorials' target='_blank'>Tutorials</a>\"\n\t}, \n\t{\n\t\t\"name\": \"resources/images/Variable.png\", \n\t\t\"dataValue\": \"When you see a component called a Variable, think of it as a data store or data model (in the MVC sense of model)\"\n\t}, \n\t{\n\t\t\"name\": \"resources/images/MobileGrid.png\", \n\t\t\"dataValue\": \"the DojoGrid widget can now be used on mobile browsers\"\n\t}, \n\t{\n\t\t\"name\": \"resources/images/Forums.png\", \n\t\t\"dataValue\": \"If you ever need extra help, check the <a href='http://dev.wavemaker.com/forums/' target='_blank'>forums</a> for advice or to hire extra help\"\n\t}, \n\t{\n\t\t\"name\": \"resources/images/ButtonProps.png\", \n\t\t\"dataValue\": \"To learn about basic widgets, drag a button onto your canvas, and try changing its properties, styles and events\"\n\t}\n]","type":"EntryData"}, {}],
tipsTimer: ["wm.Timer", {"autoStart":true,"delay":12000}, {"onTimerFire":"tipsTimerTimerFire"}],
LaunchStudioserviceVariable: ["wm.ServiceVariable", {"operation":"launchStudio","service":"SpinUpService"}, {"onError":"LaunchStudioserviceVariableError","onSuccess":"LaunchStudioserviceVariableSuccess"}, {
input: ["wm.ServiceInput", {"type":"launchStudioInputs"}, {}]
}],
navigationCall1: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"AdminPage\"","targetProperty":"pageName"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"adminPC","targetProperty":"pageContainer"}, {}]
}]
}]
}],
dialog: ["wm.Dialog", {"borderColor":"#666E80"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"center","styles":{"color":"#ffffff"},"verticalAlign":"top","width":"1379px"}, {"onEnterKeyPress":"LogInButtonClick"}, {
ParentPanel: ["wm.Panel", {"_classes":{"domNode":["largerLineHeight"]},"height":"100%","horizontalAlign":"left","styles":{"fontSize":"14px","color":"#3f3f3f","backgroundColor":"#f8f9f9","fontFamily":"Arial, Tahoma, Verdana, Helvetica, sans serif"},"verticalAlign":"top","width":"960px"}, {}, {
BannerPanel: ["wm.Panel", {"height":"100px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel1: ["wm.Panel", {"height":"100px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":"#ffffff","backgroundGradient":{"direction":"vertical","startColor":"#6b83a5","endColor":"#546d8e","colorStop":50}},"verticalAlign":"top","width":"100%"}, {}, {
Logo: ["wm.Picture", {"height":"85px","padding":"12","source":"resources/images/logos/banner.png","width":"277px"}, {}],
BannerSpacer1: ["wm.Spacer", {"height":"1px","width":"100%"}, {}],
BannerLinks: ["wm.Label", {"_classes":{"domNode":["a"]},"autoSizeWidth":true,"caption":"<a href=\"http://wavemaker.cloudfoundry.com\">Home</a>&nbsp;&nbsp;|&nbsp;&nbsp;FAQ&nbsp;&nbsp;|&nbsp;&nbsp;Help","height":"100%","padding":"4","styles":{"color":"#ffffff","textDecoration":"none","whiteSpace":"nowrap"},"width":"139px"}, {}],
BannerSpacer2: ["wm.Spacer", {"height":"1px","width":"12px"}, {}]
}]
}],
panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"25,25,5,25","minDesktopHeight":485,"minHeight":485,"styles":{"fontSize":"undefinedpx","color":"","backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
TopLayers: ["wm.Layers", {}, {}, {
loginLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","layoutKind":"left-to-right","themeStyleType":"","verticalAlign":"top"}, {}, {
ContentPanel1: ["wm.Panel", {"_classes":{"domNode":["largerLineHeight"]},"height":"100%","horizontalAlign":"left","styles":{"backgroundColor":"","color":"","fontFamily":"Arial, Tahoma, Helvetica,Verdana,Sans Serif","fontSize":"undefinedpx"},"verticalAlign":"top","width":"65%"}, {}, {
Content1: ["wm.Html", {"autoScroll":false,"height":"32px","html":"WaveMaker for Cloud Foundry","minDesktopHeight":15,"styles":{"fontSize":"26px","color":""}}, {}],
html1: ["wm.Html", {"_classes":{"domNode":["","largerLineHeight",""]},"autoScroll":false,"height":"98px","html":"WaveMaker provides a fast, efficient and secure environment to develop and \ndeploy enterprise web and cloud applications. With WaveMaker's visual, drag \nand drop tools, any developer can start building enterprise Java applications \nwith minimal training. WaveMaker creates standard Java applications, boosting \ndeveloper productivity and quality without compromising flexibility. ","margin":"14,0,0,0","minDesktopHeight":15,"styles":{"color":"","fontSize":"undefinedpx"}}, {}],
spacer2: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
html2: ["wm.Html", {"_classes":{"domNode":["largerLineHeight"]},"autoScroll":false,"height":"36px","html":"To begin using WaveMaker, sign in using your Cloud Foundry user name and password.","margin":"0,0,0,0","minDesktopHeight":15,"padding":"0,0,0,0","styles":{"fontSize":"undefinedpx"},"width":"65%"}, {}],
error_warning_spacer_1: ["wm.Spacer", {"height":"16px","showing":false,"width":"96px"}, {}],
labelError: ["wm.Label", {"_classes":{"domNode":["labelError"]},"autoSizeHeight":true,"border":"2","borderColor":"#cc0000","caption":"Unkown Error ","height":"36px","padding":"6","showing":false,"singleLine":false,"styles":{"fontSize":"undefinedpx","backgroundColor":""},"width":"78%"}, {}],
labelWarning: ["wm.Label", {"_classes":{"domNode":["labelError"]},"autoSizeHeight":true,"border":"2","borderColor":"#ffb505","caption":"Unkown Error ","height":"36px","padding":"6","showing":false,"singleLine":false,"styles":{"fontSize":"undefinedpx","backgroundColor":"#ffffdd"},"width":"78%"}, {}],
error_warning_spacer_2: ["wm.Spacer", {"height":"4px","showing":false,"width":"96px"}, {}],
LoginPanel: ["wm.Panel", {"fitToContentHeight":true,"height":"142px","horizontalAlign":"left","margin":"15,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
label2: ["wm.Label", {"autoSizeHeight":true,"caption":"Cloud Foundry Username","padding":"4","singleLine":false,"styles":{"fontSize":"undefinedpx"},"width":"100%"}, {}],
UserName: ["wm.Text", {"_classes":{"domNode":["LoginInputs"]},"borderColor":"#bcbdbd","caption":undefined,"captionAlign":"left","captionPosition":"top","captionSize":"0px","desktopHeight":"32px","displayValue":"","emptyValue":"null","height":"32px","minDesktopHeight":96,"padding":"0","required":true,"showMessages":false,"styles":{"backgroundColor":"","fontSize":"undefinedpx"}}, {}],
spacer1: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
label3: ["wm.Label", {"autoSizeHeight":true,"caption":"Cloud Foundry Password","padding":"4","singleLine":false,"styles":{"fontSize":"undefinedpx"},"width":"100%"}, {}],
Password: ["wm.Text", {"_classes":{"domNode":["LoginInputs"]},"borderColor":"#bcbdbd","caption":undefined,"captionAlign":"left","captionPosition":"top","captionSize":"0px","desktopHeight":"32px","displayValue":"","emptyValue":"null","height":"32px","maxHeight":0,"minDesktopHeight":96,"padding":"0","password":true,"required":true,"showMessages":false}, {}]
}],
spacer3: ["wm.Spacer", {"height":"15px","width":"96px"}, {}],
panel7: ["wm.Panel", {"fitToContentHeight":true,"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
LogInButton: ["wm.Button", {"border":"0","caption":"Log In","desktopHeight":"48px","height":"48px","margin":"4","styles":{"backgroundColor":"#ffffff","backgroundGradient":{"direction":"vertical","startColor":"#56a8d7","endColor":"#007cc2","colorStop":51},"fontSize":"20px","fontStyle":"normal","fontWeight":"normal","fontFamily":"Arial"},"width":"150px"}, {"onclick":"LogInButtonClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"LoginPanel.invalid","targetProperty":"disabled"}, {}]
}]
}],
spacer7: ["wm.Spacer", {"height":"10px","width":"10px"}, {}],
label4: ["wm.Label", {"caption":"Don't have a Cloud Foundry accout?  <a href=\"http://cloudfoundry.com/signup\" target=\"blank\">Sign up</a>","height":"100%","padding":"4","width":"100%"}, {}]
}]
}],
ContentPanel2: ["wm.Panel", {"borderColor":"#fbfbfb","height":"100%","horizontalAlign":"left","styles":{"backgroundColor":""},"verticalAlign":"top","width":"35%"}, {}, {
panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","verticalAlign":"top","width":"100%"}, {}, {
spacer4: ["wm.Spacer", {"height":"209px","width":"150px"}, {}],
downloadWMPanel: ["wm.Panel", {"border":"2","borderColor":"#bcbdbd","fitToContentHeight":true,"height":"192px","horizontalAlign":"left","padding":"15,15,15,15","styles":{"backgroundColor":""},"verticalAlign":"top","width":"300px"}, {}, {
html4: ["wm.Html", {"autoScroll":false,"borderColor":"#e1d6d6","height":"100px","html":"Want to use WaveMaker on your \ndesktop?\n<br><br>\nDownload the latest version of \nWaveMaker to run on your Windows, \nMac, or Linux computer.","minDesktopHeight":15}, {}],
spacer6: ["wm.Spacer", {"height":"18px","width":"96px"}, {}],
panel6: ["wm.Panel", {"height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
DownloadButton1: ["wm.Button", {"border":"0","borderColor":"#999999","caption":"Download WaveMaker","desktopHeight":"36px","height":"36px","margin":"4","styles":{"backgroundColor":"#ffffff","backgroundGradient":{"direction":"vertical","startColor":"#ffffff","endColor":"#dbdbdb","colorStop":50},"fontSize":"14px","fontStyle":"normal","fontWeight":"normal","fontFamily":"Arial","color":"#007cd3"},"width":"190px"}, {"onclick":"DownloadButton1Click"}]
}]
}]
}]
}]
}],
waitingLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
progressBar1: ["wm.dijit.ProgressBar", {"height":"48px","padding":"0,20,0,20","progress":1,"width":"100%"}, {}],
html3: ["wm.Html", {"_classes":{"domNode":["largerLineHeight"]},"height":"64px","html":"Setting up your server, this may take a couple of minutes.","margin":"0,20,40,20","minDesktopHeight":15,"styles":{"fontSize":"undefinedpx"}}, {}],
label5: ["wm.Label", {"_classes":{"domNode":["subheading"]},"caption":"Tips:","padding":"4","width":"100%"}, {}],
tipsHtmlPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
tipsHtml: ["wm.Html", {"_classes":{"domNode":["tips"]},"height":"100%","margin":"20","minDesktopHeight":15,"styles":{"fontSize":"undefinedpx"}}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"tipsVar.dataValue","targetProperty":"html"}, {}]
}]
}],
tipsPic: ["wm.Picture", {"height":"100%","margin":"20,0,20,0","width":"300px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"tipsVar.name","targetProperty":"source"}, {}]
}]
}]
}]
}],
adminLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
adminLoginButton: ["wm.Button", {"caption":"Login","margin":"4"}, {"onclick":"navigationCall1"}],
adminPC: ["wm.PageContainer", {"deferLoad":true,"height":"50%"}, {}]
}]
}]
}],
NavBannerParent: ["wm.Panel", {"height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"10,25,10,25","minDesktopHeight":90,"styles":{"color":""},"verticalAlign":"bottom","width":"100%"}, {}, {
NavBannerPanel: ["wm.Panel", {"border":"2","borderColor":"#cccccc","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,25,0,25","styles":{"backgroundGradient":{"direction":"vertical","startColor":"#6b83a5","endColor":"#546d8e","colorStop":53},"color":"#ffffff"},"verticalAlign":"top","width":"100%"}, {}, {
ExplorePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,0","verticalAlign":"middle","width":"25%"}, {}, {
picture2: ["wm.Picture", {"height":"24px","imageIndex":8,"imageList":"app.silkIconList","width":"24px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"explore1.link","targetProperty":"link"}, {}]
}]
}],
explore1: ["wm.Label", {"caption":"<div style=\"color: white;\">Explore<br><div style=\"font-size: 9px;\">Gallery & Demos</div></div>","height":"36px","link":"http://www.wavemaker.com/product/demos.html","margin":"0,0,0,10","padding":"4","singleLine":false}, {}]
}],
WatchPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,0","verticalAlign":"middle","width":"25%"}, {}, {
picture4: ["wm.Picture", {"height":"24px","imageIndex":8,"imageList":"app.silkIconList","width":"24px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"explore3.link","targetProperty":"link"}, {}]
}]
}],
explore3: ["wm.Label", {"caption":"<div style=\"color:white;\">Watch<br><div style=\"font-size: 9px\">Screencasts & Tutorials</div></div>","height":"36px","link":"http://www.wavemaker.com/product/screencasts.html","margin":"0,0,0,10","padding":"4","singleLine":false}, {}]
}],
ForumsPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,0","verticalAlign":"middle","width":"25%"}, {}, {
picture5: ["wm.Picture", {"height":"24px","imageIndex":8,"imageList":"app.silkIconList","width":"24px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"explore4.link","targetProperty":"link"}, {}]
}]
}],
explore4: ["wm.Label", {"caption":"<div style=\"color:white;\">Forums<br><div style=\"font-size: 9px\">Discussions</div></div>","height":"36px","link":"http://dev.wavemaker.com/forums/","margin":"0,0,0,10","padding":"4","singleLine":false}, {}]
}],
WikiPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,0","verticalAlign":"middle","width":"25%"}, {}, {
picture6: ["wm.Picture", {"height":"24px","imageIndex":8,"imageList":"app.silkIconList","width":"24px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"explore5.link","targetProperty":"link"}, {}]
}]
}],
explore5: ["wm.Label", {"caption":"<div style=\"color:white;\">Wiki<br><div style=\"font-size: 9px\">FAQ & Answers</div></div>","height":"36px","link":"http://dev.wavemaker.com/wiki/bin/view/Main/","margin":"0,0,0,10","padding":"4","singleLine":false}, {}]
}]
}]
}],
FooterPanel: ["wm.Panel", {"height":"26px","horizontalAlign":"center","styles":{"backgroundGradient":{"direction":"vertical","startColor":"#6d83a5","endColor":"#546d8e","colorStop":50}},"verticalAlign":"middle","width":"100%"}, {}, {
label1: ["wm.Label", {"align":"center","caption":"WaveMaker  |  Copyright © 2011-2012 VMware, Inc. All rights reserved.","height":"23px","padding":"4","singleLine":false,"styles":{"color":"#ffffff","fontSize":"9px"},"width":"100%"}, {}]
}]
}]
}]
};

Main.prototype._cssText = '.largerLineHeight {\
line-height: 150%;\
}\
a,a:visited {\
color: #007cd3 !important;\
}\
.a a, .a a:visited {\
color: white !important;\
}\
.shadow {\
box-shadow: 0px 0px 2px 2px #444444;\
-moz-box-shadow: 0px 0px 2px 2px #444444;\
-webkit-box-shadow: 0px 0px 2px 2px #444444;\
}\
.wmWaitDialog {\
background-image:url(resources/images/waitdialog_bg.gif);\
background-repeat:repeat-x;\
background-color: #d7d7d7;\
vertical-align: middle;\
color: #000;\
height: 100%;\
width: 100%;\
overflow: hidden;\
text-align: center;\
padding: 10px;\
}\
.wmWaitDialog .wmWaitMessage {\
font-weight: normal;\
font-size: 12px;\
}\
.wmWaitDialog .wmWaitThrobber {\
background: url(resources/images/makewavesani_lg.gif) center no-repeat;\
height: 40px;\
padding-bottom: 8px;\
}\
';
Main.prototype._htmlText = '';