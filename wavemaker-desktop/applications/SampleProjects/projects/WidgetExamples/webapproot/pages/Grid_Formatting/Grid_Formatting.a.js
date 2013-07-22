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
dojo.declare("Grid_Formatting", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
empFormatGridPicurlFormat: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
try {
// Formats a picture to have a max height of 40px
return '<img  style="height: 40px;" src="' + inValue + '" />';
} catch(e) {
console.error('ERROR IN empFormatGridPicurlFormat: ' + e);
}
},
_end: 0
});

Grid_Formatting.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel19: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label15: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Grid Formatting","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel22: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel24: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
tabLayers1: ["wm.TabLayers", {}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Data Formatters","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label21: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label17: ["wm.Label", {"caption":"<b>Directions:</b> there are standard formatters for common data types.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel25: ["wm.Panel", {"height":"257px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
empFormatGrid: ["wm.DojoGrid", {"columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"firstname","title":"Firstname","width":"100px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"90px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"zip","title":"Numbers","width":"80px","align":"left","formatFunc":"wm_number_formatter","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"birthdate","title":"Dates","width":"80px","align":"left","formatFunc":"wm_date_formatter","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"picurl","title":"Images","width":"60px","align":"left","formatFunc":"wm_image_formatter","formatProps":{"width":40,"height":40},"editorProps":{"restrictValues":true},"expression":"","mobileColumn":false},{"show":true,"field":"twitterid","title":"Links","width":"100%","align":"left","formatFunc":"wm_link_formatter","formatProps":{"prefix":"http://twitter.com/"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Lastname: \" + ${lastname} + \"</div>\"\n+ \"<div class='MobileRow'>Numbers: \" + wm.DojoGrid.prototype.numberFormatter({}, null,null,null,${zip}) + \"</div>\"\n+ \"<div class='MobileRow'>Dates: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${birthdate}) + \"</div>\"\n+ \"<div class='MobileRow'>Images: \" + wm.DojoGrid.prototype.imageFormatter({\"width\":40,\"height\":40}, null,null,null,${picurl}) + \"</div>\"\n+ \"<div class='MobileRow'>Links: \" + wm.DojoGrid.prototype.linkFormatter({\"prefix\":\"http://twitter.com/\"}, null,null,null,${twitterid}) + \"</div>\"\n","mobileColumn":true}],"height":"100%","margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel27: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label18: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dataTreeLabel: ["wm.Label", {"padding":"4"}, {"onclick":"dataTreeLabelClick"}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":false,"source":"empFormatGrid.selectedItem.firstname","targetProperty":"caption"}, {}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Cell Formatters","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label23: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label19: ["wm.Label", {"caption":"<b>Directions:</b> there are standard formatters for common data types.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel26: ["wm.Panel", {"height":"257px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
empFormatGrid1: ["wm.DojoGrid", {"columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"textColor":"${firstname}.match(/h/i) ? \"blue\" : \"\"","mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"90px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"zip","title":"Numbers","width":"80px","align":"left","formatFunc":"wm_number_formatter","formatProps":null,"editorProps":{"restrictValues":true},"backgroundColor":"${zip} > 50000 ? \"red\" : \"\"","mobileColumn":false},{"show":true,"field":"birthdate","title":"Dates","width":"80px","align":"left","formatFunc":"wm_date_formatter","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"picurl","title":"Images","width":"100px","align":"left","formatFunc":"wm_image_formatter","formatProps":{"width":40,"height":40},"editorProps":{"restrictValues":true},"expression":"","mobileColumn":false},{"show":false,"field":"twitterid","title":"Links","width":"100%","align":"left","formatFunc":"wm_link_formatter","formatProps":{"prefix":"http://twitter.com/"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n+ \"<div class='MobileRow'>Numbers: \" + wm.DojoGrid.prototype.numberFormatter({}, null,null,null,${zip}) + \"</div>\"\n+ \"<div class='MobileRow'>Dates: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${birthdate}) + \"</div>\"\n","mobileColumn":true}],"height":"100%","margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel28: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label20: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dataTreeLabel1: ["wm.Label", {"padding":"4"}, {"onclick":"dataTreeLabel1Click"}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"empFormatGrid1.selectedItem.firstname","targetProperty":"caption"}, {}]
}]
}]
}]
}]
}]
}],
panel81: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel11: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel82: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html7: ["wm.Html", {"height":"402px","html":"<p>Grids and Mobile Lists provide formatters for </p><ul>\n<li>Dates</li>\n<li>Numbers</li>\n<li>Currency</li>\n<li>Images</li>\n<li>Links</li>\n<li>Buttons</li>\n<li>Custom formatters you define</li>\n</ul></p>\n<p>Cells can also be styled using simple expressions to control text color, background color, or to add CSS Classes.</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>\t</li></ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Grid_Formatting.prototype._cssText = '';
Grid_Formatting.prototype._htmlText = '';