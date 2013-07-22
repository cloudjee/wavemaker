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
dojo.declare("Social_Map", wm.Page, {
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

Social_Map.widgets = {
buttonPushVar: ["wm.Variable", {"type":"NumberData"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"0","source":false,"targetProperty":"dataValue"}, {}]
}]
}],
buttonClickDialog: ["wm.GenericDialog", {"button1Caption":"Close","button1Close":true,"corner":"cr","desktopHeight":"102px","height":"102px","positionNear":"basicButton","userPrompt":"You pushed the button!"}, {}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label4: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"Button Widget","padding":"4","width":"85px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label14: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"caption":"<b>Directions:</b> Click the twitter follow button to follow WaveMakerDev","height":"41px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gadgetGoogleMap1: ["wm.gadget.GoogleMap", {"height":"187px"}, {}]
}],
panel17: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html2: ["wm.Html", {"height":"100%","html":"<p>WaveMaker ships with a few basic Twitter widgets</p>\n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/TwitterFollowButton\" target=\" _blank\" =\"\"=\"\">Twitter Follow Button</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/TwitterTweetButton\" target=\" _blank\" =\"\"=\"\">Facebook Tweet Button</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/TwitterList\" target=\" _blank\" =\"\"=\"\">Twitter List</a></li>\n</ul>\n","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
}]
};

Social_Map.prototype._cssText = '';
Social_Map.prototype._htmlText = '';