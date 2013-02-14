dojo.declare("Login", wm.Page, {
"preferredDevice": "desktop",
start: function() {
this.initSups();
},
// intit subscription
initSups: function() {
// set cookie
this.usernameInput.setDataValue(dojo.cookie("user") || "");
// subscribe key event
this.connect(this.domNode, "keydown", this, "keydown");
// subscribe hover events for links
this.connect(this.labLogin.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labLogin"));
this.connect(this.labLogin.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labLogin"));
this.connect(this.labRegister.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labRegister"));
this.connect(this.labRegister.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labRegister"));
this.connect(this.labReset.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labReset"));
this.connect(this.labReset.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labReset"));
// subscribe hover events for buttons
/*
this.connect(this.loginButton.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "loginButton"));
this.connect(this.loginButton.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "loginButton"));
this.connect(this.btnSubmit.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnSubmit"));
this.connect(this.btnSubmit.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnSubmit"));
this.connect(this.btnCancel.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnCancel"));
this.connect(this.btnCancel.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnCancel"));
this.connect(this.btnReset.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnReset"));
this.connect(this.btnReset.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnReset"));
*/
// set the cursor pointers for header pix
this.labLogin.domNode.style.cursor = "pointer";
this.labRegister.domNode.style.cursor = "pointer";
this.labReset.domNode.style.cursor = "pointer";
this.loginButton.domNode.style.cursor = "pointer";
this.btnSubmit.domNode.style.cursor = "pointer";
this.btnCancel.domNode.style.cursor = "pointer";
this.btnReset.domNode.style.cursor = "pointer";
// set the focus to username field
this.usernameInput.focus();
// set the tab index for the registration editors
// i+1 because the first tabIndex should be 1 not 0
edArr = this.regEditor();
for(i=0;i<=6;i++) {
edArr[i].editor.editor.setAttribute("tabIndex",i+1);
}
},
// register editors
regEditor: function() {
try {
editorArr = new Array();
editorArr[0] = this.teFirstName;
editorArr[1] = this.teLastName;
editorArr[2] = this.teEmail;
editorArr[3] = this.teUsername;
editorArr[4] = this.teCompany;
editorArr[5] = this.tePhone;
editorArr[6] = this.teAddress;
editorArr[7] = this.teResetEmail;
return editorArr;
} catch(e) {
console.error('ERROR IN regEditor: ' + e);
}
},
// mouse hover functions for links
LinkMouseOver: function(inWidget) {
this[inWidget].domNode.style.textDecoration = "underline";
},
LinkMouseOut: function(inWidget) {
this[inWidget].domNode.style.textDecoration = "";
},
// mouse hover functions for buttons
BtnMouseOver: function(inWidget) {
this[inWidget].setBorder(3);
this[inWidget].setBorderColor("#FF9966");
},
BtnMouseOut: function(inWidget) {
this[inWidget].setBorder(1);
this[inWidget].setBorderColor("#ABB8CF");
},
keydown: function(e) {
if (e.keyCode == dojo.keys.ENTER) {
this.loginButton.domNode.focus();
}
},
loginButtonClick: function(inSender) {
// check whether user have selected the remember checkbox
if(this.seRemember.getDataValue() == true) {
dojo.cookie("user", this.usernameInput.getDataValue(), {expires: 365});
}
this.loginErrorMsg.setCaption("");
wm.login(
[this.usernameInput.getDataValue(), this.passwordInput.getDataValue()],
null, dojo.hitch(this, "loginFailed"));
},
loginFailed: function(inResponse) {
this.loginErrorMsg.setCaption("Your login attempt has failed. The username or password may be incorrect");
this.usernameInput.focus();
},
// ********** SERVICE VAR EVENTS **********
// layer change events
// ONLY FOR CLEARING EDITORS
layMainChange: function(inSender, inIndex) {
try {
editorArr = this.regEditor();
// clean editors after registration or reset
if(inIndex == 1 || inIndex == 4) {
for(i=0; i<=editorArr.length-1; i++) {
editorArr[i].clear();
}
this.labRegError.setCaption("");
}
} catch(e) {
console.error('ERROR IN layMainChange: ' + e);
}
},
svSetTenantSuccess: function(inSender, inData) {
try {
switch(inData) {
case 0: this.ncSuccess.update();
break;
case 1: this.labRegError.setCaption("Please check your email format!");
break;
case 2: this.labRegError.setCaption("Email or Username already registered!");
break;
};
} catch(e) {
console.error('ERROR IN svSetTenantSuccess: ' + e);
}
},
_end: 0
});

Login.widgets = {
ncLogin: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"layLogin","targetProperty":"layer"}, {}]
}]
}]
}],
ncWelcome: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"layWelcome","targetProperty":"layer"}, {}]
}]
}]
}],
ncRegister: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"layRegister","targetProperty":"layer"}, {}]
}]
}]
}],
svSetTenant: ["wm.ServiceVariable", {"operation":"createTenant","service":"jsRegistration"}, {"onBeforeUpdate":"svSetTenantBeforeUpdate","onSuccess":"svSetTenantSuccess"}, {
input: ["wm.ServiceInput", {"type":"createTenantInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"teAddress.dataValue","targetProperty":"inAddress"}, {}],
wire1: ["wm.Wire", {"source":"teCompany.dataValue","targetProperty":"inCompName"}, {}],
wire2: ["wm.Wire", {"source":"teEmail.dataValue","targetProperty":"inEmail"}, {}],
wire3: ["wm.Wire", {"source":"teFirstName.dataValue","targetProperty":"inFirst"}, {}],
wire4: ["wm.Wire", {"source":"teLastName.dataValue","targetProperty":"inLast"}, {}],
wire5: ["wm.Wire", {"source":"tePhone.dataValue","targetProperty":"inPhone"}, {}]
}]
}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"CenteredLayout","targetProperty":"loadingDialog"}, {}]
}]
}],
ncSuccess: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"laySuccess","targetProperty":"layer"}, {}]
}]
}]
}],
svResetPass: ["wm.ServiceVariable", {"operation":"resetEmail","service":"jsRegistration"}, {"onSuccess":"ncSuccess"}, {
input: ["wm.ServiceInput", {"type":"resetEmailInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"teResetEmail.dataValue","targetProperty":"inEmail"}, {}]
}]
}]
}],
ncReset: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"layReset","targetProperty":"layer"}, {}]
}]
}]
}],
svCheckEmail: ["wm.ServiceVariable", {"operation":"validateEmail","service":"jsUtil"}, {}, {
input: ["wm.ServiceInput", {"type":"validateEmailInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"teEmail.dataValue","targetProperty":"inEmail"}, {}]
}]
}]
}],
lbxLogin: ["wm.Layout", {"width":"1267px"}, {}, {
CenteredLayout: ["wm.Template", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
contentPanel: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteOutsetPanel"]},"border":"0,1","borderColor":"#656565","height":"700px","width":"800px"}, {}, {
panHeader: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0,0,3,0","borderColor":"#656565","height":"90px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
picLogo: ["wm.Picture", {"aspect":"h","width":"400px"}, {"onclick":"picLogoClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/logos/IssueCloudLogo.png\"","targetProperty":"source"}, {}]
}]
}],
spa2: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
panLink: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"bottom","width":"269px"}, {}, {
labLogin: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Center","wm_TextDecoration_Bold"]},"align":"center","caption":"Customer Login","height":"26px","padding":"4","width":"108px"}, {"onclick":"ncLogin"}, {
format: ["wm.DataFormatter", {}, {}]
}],
spacer5: ["wm.Spacer", {"height":"15px","width":"96px"}, {}]
}]
}],
layMain: ["wm.Layers", {"defaultLayer":0}, {"onchange":"layMainChange"}, {
layWelcome: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"20","verticalAlign":"top"}, {}, {
conWelcome: ["wm.Content", {"content":"Login","height":"210px"}, {}],
picWelcome: ["wm.Picture", {"height":"320px","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/photos/cloud_welcome.jpg\"","targetProperty":"source"}, {}]
}]
}]
}],
layLogin: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
panLoginFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"354px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"620px"}, {}, {
panLogin: ["wm.Panel", {"height":"288px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"559px"}, {}, {
picLogin: ["wm.Picture", {"aspect":"h","height":"277px","width":"190\\"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/photos/cloud_login.jpg\"","targetProperty":"source"}, {}]
}]
}],
loginInputPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved4px","wm_Border_StyleSolid","wm_Border_Size1px","wm_Border_ColorLightGray"]},"height":"288px","padding":"10","width":"351px"}, {}, {
loginErrorMsg: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px"]},"caption":" ","height":"50px","padding":"4","singleLine":false,"width":"215px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
usernameInput: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Email ","captionSize":"80px","height":"28px","padding":"2","width":"224px"}, {}, {
editor: ["wm._TextEditor", {"required":true}, {}]
}],
passwordInput: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Password","captionSize":"80px","height":"28px","padding":"2"}, {}, {
editor: ["wm._TextEditor", {"password":true,"required":true}, {}]
}],
seRemember: ["wm.SelectEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontColor_Black"]},"caption":"Remember Username","captionAlign":"left","captionPosition":"right","captionSize":"223px","display":"CheckBox","displayValue":true,"height":"25px","padding":"2","width":"259px"}, {}, {
editor: ["wm._CheckBoxEditor", {"dataType":"boolean","startChecked":true}, {}]
}],
panLoginBtn: ["wm.Panel", {"height":"45px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
loginButton: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Login","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"loginButtonClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/buttons/submit.png\"","targetProperty":"iconUrl"}, {}]
}]
}]
}],
panRegLink: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
labAccount: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Black","wm_TextAlign_Right"]},"border":"3,0,0,0","caption":"Don't have an account?","height":"100%","padding":"4","width":"143px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
labRegister: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold","wm_TextAlign_Left"]},"border":"3,0,0,0","caption":"Sign up here","height":"100%","padding":"4","width":"110px"}, {"onclick":"ncRegister"}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panResetLink: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
labForgot: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Black","wm_TextAlign_Right"]},"border":"3,0,0,0","caption":"Forgot your password?","height":"100%","padding":"4","width":"143px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
labReset: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold","wm_TextAlign_Left"]},"border":"3,0,0,0","caption":"Reset Password","height":"100%","padding":"4","width":"110px"}, {"onclick":"ncReset"}, {
format: ["wm.DataFormatter", {}, {}]
}]
}]
}]
}]
}],
content1: ["wm.Content", {"content":"GettingStarted","padding":"10","width":"620px"}, {}]
}],
layRegister: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
paRegisterFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"450px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"650px"}, {}, {
panRegTenant: ["wm.Panel", {"height":"380px","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"572px"}, {}, {
labDetail: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_LightGray","wm_Border_StyleFirefoxCurved8px","wm_TextDecoration_Bold"]},"border":"1","borderColor":"#B1B1B1","caption":"Your details:","height":"25px","padding":"10","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
spacer1: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
panDetail: ["wm.Panel", {"height":"55px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"530px"}, {}, {
panDetailLeft: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
teFirstName: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"First Name:","captionSize":"100px","height":"25px","padding":"2","width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {"promptMessage":"Mandatory field!","required":true}, {}]
}],
teEmail: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Email:","captionSize":"100px","height":"25px","padding":"2","width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {"required":true}, {}]
}]
}],
panDetailRight: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
teLastName: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Last Name:","captionSize":"100px","height":"25px","padding":"2","width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {"required":true}, {}]
}],
teUsername: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"User Name:","captionSize":"100px","height":"25px","padding":"2","showing":false,"width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {"required":true}, {}]
}]
}]
}],
labRegError: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextAlign_Center"]},"height":"30px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
labCompany: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_LightGray","wm_Border_StyleFirefoxCurved8px","wm_TextDecoration_Bold"]},"border":"1","borderColor":"#B1B1B1","caption":"Your company details:","height":"25px","padding":"10","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
spacer3: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
panCompany: ["wm.Panel", {"height":"27px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"530px"}, {}, {
panCompLeft: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
teCompany: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Company Name:","captionSize":"120px","height":"25px","padding":"2","width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {}, {}]
}]
}],
panCompRight: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
tePhone: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Phone Number:","captionSize":"120px","height":"25px","padding":"2","width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {}, {}]
}]
}]
}],
teAddress: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Company Address:","captionSize":"122px","height":"80px","padding":"2","singleLine":false,"width":"100%"}, {}, {
editor: ["wm._TextAreaEditor", {}, {}]
}],
spacer4: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
panBtn: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
btnSubmit: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Submit","height":"100%","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"svSetTenant"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/buttons/submit.png\"","targetProperty":"iconUrl"}, {}]
}]
}],
btnCancel: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Cancel","height":"100%","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"ncWelcome"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/buttons/cancel.png\"","targetProperty":"iconUrl"}, {}]
}]
}]
}]
}]
}]
}],
layReset: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
panResetFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"303px","horizontalAlign":"center","verticalAlign":"middle","width":"620px"}, {}, {
conReset: ["wm.Content", {"border":"0,0,3,0","content":"Reset","height":"151px","width":"550px"}, {}],
spacer6: ["wm.Spacer", {"height":"20px","width":"550px"}, {}],
panReset: ["wm.Panel", {"height":"37px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"550px"}, {}, {
teResetEmail: ["wm.TextAreaEditor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"caption":"Email:","captionSize":"100px","height":"28px","padding":"2","width":"300px"}, {}, {
editor: ["wm._TextAreaEditor", {"required":true}, {}]
}],
btnReset: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Reset","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"svResetPass"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"resources/images/buttons/update.png\"","targetProperty":"iconUrl"}, {}]
}]
}]
}]
}]
}],
laySuccess: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
panSuccessFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"171px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"620px"}, {}, {
conSuccess: ["wm.Content", {"content":"Success","height":"116px","width":"550px"}, {}]
}]
}]
}],
panFooter: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"3,0,1,0","borderColor":"#656565","height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
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
}]
}]
}]
}]
};

Login.prototype._cssText = '.Login .Login-loginErrorMsg {\
font-size: 12px; color: red\
}\
.Login .Login-CenteredLayout {\
background: #C8C8C8\
}\
.Login .Login-labLogin {\
color: #51a3d2\
}\
.Login .Login-labRegister {\
color: #51a3d2\
}\
.Login .Login-labReset {\
color: #51a3d2\
}.Login .Login-labRegError {\
color: #E00000\
}\
';
Login.prototype._htmlText = '<div id="Login">\
<p style="font-family:arial; color:#000000; font-size:18px;">Welcome to IssueCloud</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
This application demonstrates how to build multi-tenant cloud applications using WaveMaker.\
</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
This application is hosted on Amazon EC2 and uses WaveMaker&#39;s multi-tenant\
security to automatically enforce data isolation between companies or tenants.\
Issuecloud demonstrates email workflow, enabling the browser back button and\
other advanced WaveMaker techniques.\
</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
Click on the customer login link above to create your own account or login to\
a guest account.\
</p>\
</div>\
<div id="GettingStarted">\
<p style="font-family:arial; color:#000000; font-size:18px;">Getting Started</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
Create your own account or login to one of the guest accounts.\
</p>\
<ul>\
<li style="font-family:arial; color:#484848; font-size:16px;">Administrator role: username = "admin@admin.com" password = "admin"</li>\
<li style="font-family:arial; color:#484848; font-size:16px;">User role: username = "user@user.com" password = "user"</li>\
</ul>\
</div>\
<div id="Success">\
<p style="font-family:arial; color:#000000; font-size:18px;">Password sent</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
Your password has been sent to your email address. Please check your email.\
</p>\
</div>\
<div id="Reset">\
<p style="font-family:arial; color:#000000; font-size:18px;">Reset your password</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
Keep in mind that your email has a [username@company.com] format and is case sensitive!\
</p>\
<p style="font-family:arial; color:#484848; font-size:16px;">\
If you still can&#39;t log in, reset you password below!\
</p>\
</div>\
';