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
dojo.declare("Button_Toggle", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Button_Toggle.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"caption":"Toggle Button","padding":"4","width":"120px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
label18: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label26: ["wm.Label", {"caption":"<b>Directions:</b> push button to toggle state between clicked and unclicked. ","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel15: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
toggleButton1: ["wm.ToggleButton", {"captionDown":"Clicked","captionUp":"Unclicked","hint":"Clicking this button changes the buttons state between unclicked and clicked","margin":"4","width":"98px"}, {}]
}],
label20: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel11: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
label9: ["wm.Label", {"autoSizeWidth":true,"caption":"Button is clicked = ","padding":"4","width":"108px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label11: ["wm.Label", {"border":"1","padding":"4","width":"43px"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":false,"source":"toggleButton1.clicked","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel25: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel3: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel4: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html3: ["wm.Html", {"height":"100%","html":"<p>The toggle button widget changes its state when clicked: clicking once toggles its state to 'on'. Clicking again toggles the state back to 'off'.</p>\n<p>This example shows using the onClick event of a toggle button to change the message in a label built using drag and drop development and no code!</p>\n<p>There are two common ways to use a toggle button<ul>\n<li><b>Binding</b>: You can bind properties to the button's state; in this example, we have bound a label to its clicked value without writing any code</li>\n<li><b>JS Event Handlers</b>: You can also write more sophisticated javascript event handlers that will be called each time the button is clicked</li>\n</ul>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/ToggleButton\">Toggle Button Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=button\">Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=busy\">Busy Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=popup\">Popup Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Button_Toggle.prototype._cssText = '';
Button_Toggle.prototype._htmlText = '';