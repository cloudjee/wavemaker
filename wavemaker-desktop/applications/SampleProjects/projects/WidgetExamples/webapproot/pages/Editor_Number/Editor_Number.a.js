/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
dojo.declare("Editor_Number", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Editor_Number.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel2: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"caption":"Number Editors","padding":"4","width":"120px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
label38: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label26: ["wm.Label", {"caption":"<b>Directions:</b> select your favorite ice cream.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel25: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
formPanel1: ["wm.FormPanel", {"captionAlign":"left","captionPosition":"top","captionSize":"28px","editorHeight":"54px","height":"100%","type":"wm.FormPanel"}, {}, {
number2: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
number3: ["wm.Number", {"caption":"The number editor formats values","captionAlign":"left","captionPosition":"top","captionSize":"28px","changeOnKey":true,"dataValue":1234567890,"desktopHeight":"54px","displayValue":"1,234,567,890","height":"54px","width":"100%"}, {}],
label6: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"number3.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
number1Panel: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
number1: ["wm.Number", {"caption":"Enter a number between -10 and 10","captionAlign":"left","captionPosition":"top","captionSize":"28px","changeOnKey":true,"dataValue":undefined,"desktopHeight":"54px","displayValue":"","height":"54px","maximum":10,"minimum":-10,"width":"100%"}, {}],
label1: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"number1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
currency1Panel: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
currency1: ["wm.Currency", {"caption":"Enter $ amount from 0.00 to 100.50","captionAlign":"left","captionPosition":"top","captionSize":"28px","changeOnKey":true,"currency":"USD","dataValue":0,"desktopHeight":"54px","displayValue":"$0.00","height":"54px","maximum":100.5,"minimum":0,"places":"2","width":"100%"}, {}],
label2: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"currency1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
currency2: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
currency3: ["wm.Currency", {"caption":"Enter a Euro amount from 0 to 50","captionAlign":"left","captionPosition":"top","captionSize":"28px","changeOnKey":true,"currency":"EUR","dataValue":0,"desktopHeight":"54px","displayValue":"€0","height":"54px","maximum":50,"minimum":0,"places":"0","width":"100%"}, {}],
label5: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"currency3.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
slider1Panel: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
slider1: ["wm.Slider", {"caption":"Select a value from -10 to 10","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":0,"desktopHeight":"54px","displayValue":"","height":"54px","maximum":10,"minimum":-10,"width":"100%"}, {}],
label3: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"slider1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}],
rangeSlider1Panel: ["wm.Panel", {"height":"54px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
rangeSlider1: ["wm.RangeSlider", {"caption":"Select a range from -10 to 10","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":[-2,4],"desktopHeight":"54px","displayValue":"-2,4","height":"54px","maximum":10,"minimum":-10,"width":"100%"}, {}],
label4: ["wm.Label", {"padding":"4","width":"100px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"rangeSlider1.dataValue","targetProperty":"caption"}, {}]
}]
}]
}]
}]
}]
}]
}],
panel69: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel70: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html3: ["wm.Html", {"height":"100%","html":"<p>There are a number of editors for entering a number.  Benefits a Number editor provides that can't be had with a Text editor:\n</p><ul>\n<li>The number will be formatted for readability using localization tools to format it for the user's language</li>\n<li>You can set a maximum and minimum</li>\n<li>You can set how many places (digits after the decimal point) to include</li>\n</ul>\n<p></p>\n<p>This example also shows a currency editor. Note that currency will default to USD ($) no matter what region the browser is running in.  Why is this?  Because if we display the local currency ($ in the US, Euro in Europe) then different users loading the same application would see $500 or €500 which are NOT the same value.\n</p>\n\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Number\" target=\"_blank\">Number Editor</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Currency\" target=\"_blank\">Currency Editor</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Slider\" target=\"_blank\">Slider</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/RangeSlider\" target=\"_blank\">RangeSlider</a></li></ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Editor_Number.prototype._cssText = '';
Editor_Number.prototype._htmlText = '';