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
dojo.declare("Dialog_PageDialog", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
// Called by onClick event for basicButton
basicButtonClick: function(inSender) {
try {
this.buttonPushVar.setValue('dataValue',this.buttonPushVar.getValue('dataValue')+1);
} catch(e) {
console.error('ERROR IN basicButtonClick: ' + e);
}
},
_end: 0
});

Dialog_PageDialog.widgets = {
buttonPushVar: ["wm.Variable", {"type":"NumberData"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"0","source":false,"targetProperty":"dataValue"}, {}]
}]
}],
pageDialog1: ["wm.PageDialog", {}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"selectMenu1.displayValue","targetProperty":"title"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"selectMenu1.dataValue","targetProperty":"pageName"}, {}]
}]
}],
optionsVar: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Button\",\"dataValue\":\"Button_Button\"},{\"name\":\"Editor\",\"dataValue\":\"Editor_Number\"},{\"name\":\"Grid\",\"dataValue\":\"Grid_Basic\"},{\"name\":\"DataSet Editor\",\"dataValue\":\"Select_Filter\"}]","type":"EntryData"}, {}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label4: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"PageDialog Widget","padding":"4","width":"114px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label14: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"caption":"<b>Directions:</b> Pick a page to show in the dialog","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
selectMenu1: ["wm.SelectMenu", {"caption":"Choose a page to show","captionSize":"180px","dataField":"dataValue","dataType":"EntryData","dataValue":undefined,"displayField":"name","displayValue":"","width":"369px"}, {"onchange":"pageDialog1.show"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"optionsVar","targetProperty":"dataSet"}, {}]
}]
}]
}]
}],
panel17: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html2: ["wm.Html", {"height":"100%","html":"<p>The PageDialog allows developers to design a dialog as a single page and display it in dialogs from any other page its needed.  This results in a much more modular and reusable dialog.</p>\n<p>You can set the pageName for a PageDialog to a fixed page, or you can change it at runtime using\n</p><ul>\n<li>NavigationCall components</li>\n<li>Binding the pageName property to a value that may change at runtime</li>\n<li>Programatically calling this.mypageDialog.setPageName(\"MyPage\")</li>\n</ul>\n<p></p> \n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/PageDialog\" target=\"_blank\">PgaeDialog</a></li>\n</ul>\n","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
}]
};

Dialog_PageDialog.prototype._cssText = '';
Dialog_PageDialog.prototype._htmlText = '';