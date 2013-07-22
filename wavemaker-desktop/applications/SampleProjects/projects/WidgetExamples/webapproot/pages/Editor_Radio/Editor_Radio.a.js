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
dojo.declare("Editor_Radio", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Editor_Radio.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel2: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"caption":"Radio Button","padding":"4","width":"120px"}, {}, {
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
panel15: ["wm.Panel", {"height":"86px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel25: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
panel13Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
radioButton2: ["wm.RadioButton", {"caption":"Chocolate","checkedValue":"chocolate","displayValue":"","radioGroup":"radiotest","startChecked":true}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"selectMenu1.dataValue","targetProperty":"groupValue"}, {}]
}]
}],
radioButton1: ["wm.RadioButton", {"caption":"Vanilla","checkedValue":"vanilla","displayValue":"","groupValue":"","radioGroup":"radiotest"}, {}],
radioButton3: ["wm.RadioButton", {"caption":"Strawberry","checkedValue":"strawberry","displayValue":"","groupValue":"","radioGroup":"radiotest"}, {}]
}],
panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
checkbox1: ["wm.Checkbox", {"caption":"Chocolate","checkedValue":"chocolate","dataType":"string","displayValue":"","startChecked":true}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${selectMenu1.dataValue} == ${checkbox1.checkedValue}","targetProperty":"dataValue"}, {}]
}]
}],
checkbox2: ["wm.Checkbox", {"caption":"Vanilla","checkedValue":"vanilla","dataType":"string","displayValue":""}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${selectMenu1.dataValue} == ${checkbox2.checkedValue}","targetProperty":"dataValue"}, {}]
}]
}],
checkbox3: ["wm.Checkbox", {"caption":"Strawberry","checkedValue":"strawberry","dataType":"string","displayValue":""}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${selectMenu1.dataValue} == ${checkbox3.checkedValue}","targetProperty":"dataValue"}, {}]
}]
}]
}]
}]
}],
panel11: ["wm.Panel", {"height":"86px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
label11: ["wm.Label", {"height":"63px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"var checkboxes = [];\nif (${checkbox1.checked}) checkboxes.push(${checkbox1.dataValue});\nif (${checkbox2.checked}) checkboxes.push(${checkbox2.dataValue});\nif (${checkbox3.checked}) checkboxes.push(${checkbox3.dataValue});\n\"<b>Result:</b> The ice cream you like is: <ul><li><b>Radio:</b> \" + ${radioButton2.groupValue} + \"</li><li><b>Checkbox:</b> \" + checkboxes.join(\", \") +\"</li></ul>\"","targetProperty":"caption"}, {}]
}]
}]
}],
label27: ["wm.Label", {"caption":"<b>Directions:</b> select a value and see bindings update the values of the radio and checkbox buttons","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
selectMenu1: ["wm.SelectMenu", {"allowNone":true,"caption":"Select your favorite icre cream","captionSize":"250px","dataField":"dataValue","dataValue":undefined,"displayField":"dataValue","displayValue":"","options":"chocolate, vanilla, strawberry","width":"100%"}, {}]
}],
panel69: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel70: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html3: ["wm.Html", {"height":"100%","html":"<p>Radio buttons and checkboxes allow users to select from a set of options.</p>\n<p>This example shows</p><ul>\n<li>Three radio buttons, and a label bound to the current value of the radio buttons</li>\n<li>Three checkbox buttons, and a label bound to the current value of the checkbox buttons</li>\n<li>Binding the groupValue of one radio button to the select editor's dataValue causes the current radio button to change as the Select editor's value changes</li>\n<li>Binding each checkbox editor's dataValue to ${selectEditor.dataValue} == ${checkbox1.checkedValue} causes each checkbox to update its state as the Select editor's value changes</li>\n</ul>\n<p></p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/RadioButton\" target=\"_blank\">Radio Button Widget</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Checkbox\" target=\"_blank\">Checkbox Widget</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Editor_Radio.prototype._cssText = '';
Editor_Radio.prototype._htmlText = '';