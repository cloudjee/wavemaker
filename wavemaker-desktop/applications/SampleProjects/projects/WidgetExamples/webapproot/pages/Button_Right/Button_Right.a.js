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
dojo.declare("Button_Right", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Button_Right.widgets = {
leftClickDialog: ["wm.GenericDialog", {"button1Caption":"OK","button1Close":true,"corner":"cr","desktopHeight":"102px","height":"102px","positionNear":"rightClickButton","title":"Left Click Dialog","userPrompt":"Button left click detected"}, {}],
rightClickDialog: ["wm.GenericDialog", {"button1Caption":"OK","button1Close":true,"corner":"cr","desktopHeight":"102px","height":"102px","positionNear":"rightClickButton","title":"Right Click Dialog","userPrompt":"Button right click detected"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel2: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel24: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label25: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"autoSizeWidth":true,"caption":"Right Clicking a Button","padding":"4","width":"169px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel39: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel41: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label32: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label38: ["wm.Label", {"caption":"<b>Directions:</b> right click this button, then left click the button","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel42: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
rightClickButton: ["wm.Button", {"caption":"Right Click Me","margin":"4","width":"129px"}, {"onRightClick":"rightClickDialog.show","onclick":"leftClickDialog.show"}]
}],
label33: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel44: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
label39: ["wm.Label", {"caption":"Clicking the button brings up dialog windows","height":"48px","padding":"0,0,0,20","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}]
}],
panel32: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel6: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel26: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html6: ["wm.Html", {"height":"100%","html":"<p>Button widgets can respond to both left and right click buttons.</p>\n<p>This example shows using the onRightClick event of a button to show a dialog window and was built using drag and drop development and no code!</p>\n<p>Most widgets support right click as an easy to use event</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Button\">Button Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=toggle\">Toggle Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=busy\">Busy Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=popup\">Popup Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Button_Right.prototype._cssText = '';
Button_Right.prototype._htmlText = '';