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
dojo.declare("Editor_Misc", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
this.richText1.changeOnKey = true;
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
toggleButtonPanel1Change: function(inSender, inButton) {
this.text4.setReadonly(inButton.caption == "Readonly");
},
setValueButtonClick: function(inSender) {
this.text6.setDataValue((parseInt(this.text6.getDataValue()) || 0) + 1);
},
toggleButtonPanel2Change: function(inSender, inButton) {
this.text9.setDisabled(inButton.caption == "Disabled");
},
_end: 0
});

Editor_Misc.widgets = {
notificationCall1: ["wm.NotificationCall", {"operation":"toast"}, {}, {
input: ["wm.ServiceInput", {"type":"toastInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire1: ["wm.Wire", {"expression":"\"center center\"","targetProperty":"dialogPosition"}, {}],
wire: ["wm.Wire", {"expression":"\"Value changed to <b>\" + ${text12.dataValue} + \"</b><br/><br/>This popup shown by the editor's onChange event.\"","targetProperty":"text"}, {}]
}]
}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel24: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel34: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"caption":"Text Editor Widgets","padding":"4","width":"148px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel37: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel41: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"500px"}, {}, {
label53: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
formPanel1: ["wm.FormPanel", {"captionSize":"160px","editorWidth":"351px","height":"100%"}, {}, {
text1Panel: ["wm.Panel", {"height":"250px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
richText1: ["wm.RichText", {"caption":"This is the RichText editor","captionSize":"28px","height":"100%","width":"272px"}, {"onchange":"richText1Change"}],
labelEquals: ["wm.Label", {"align":"center","caption":"=","height":"100%","padding":"4","width":"40px"}, {}],
label1: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"richText1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
text3Panel: ["wm.Panel", {"height":"33px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
colorPicker1: ["wm.ColorPicker", {"caption":"Color Picker Editor","captionSize":"160px","dataValue":"","desktopHeight":"26px","displayValue":"","height":"26px","width":"351px"}, {}],
labelEquals1: ["wm.Label", {"align":"center","caption":"=","padding":"4","width":"40px"}, {}],
label2: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"colorPicker1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}]
}]
}],
panel73: ["wm.MainContentPanel", {"height":"734px","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"260px"}, {}, {
fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html5: ["wm.Html", {"height":"460px","html":"<p>The RichText editor allows the user to enter styled text.  The output is HTML which can be written to a database, and shown in other widgets.</p>\n<p>The color picker is used in many places within WaveMaker Studio, and is available for use in your projects.</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/RichText\" target=\"_blank\">RichText</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/ColorPicker\" target=\"_blank\">ColorPicker</a></li>\n</ul>\n","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Editor_Misc.prototype._cssText = '';
Editor_Misc.prototype._htmlText = '';