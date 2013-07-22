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
dojo.declare("Grid_Searching", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
searchText1Change: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
this.countryLiveVar1.setQuery({country: "*" + this.searchText1.getDataValue() + "*",
countryId: ">" + this.searchNumber.getDataValue()});
},
searchNumberChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
this.countryLiveVar1.setQuery({country: "*" + this.searchText1.getDataValue() + "*",
countryId: ">" + this.searchNumber.getDataValue() });
},
_end: 0
});

Grid_Searching.widgets = {
countryLiveVar: ["wm.LiveVariable", {"ignoreCase":true,"liveSource":"com.sampledatadb.data.Country","maxResults":100,"type":"com.sampledatadb.data.Country"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"searchText.dataValue","targetProperty":"filter.country"}, {}]
}]
}],
countryLiveVar1: ["wm.LiveVariable", {"ignoreCase":true,"liveSource":"com.sampledatadb.data.Country","maxResults":1000,"type":"com.sampledatadb.data.Country"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel40: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel42: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label33: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Grid Searching","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"manageURL":true}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"DB Searching","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel43: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel45: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
label34: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label35: ["wm.Label", {"caption":"<b>Directions:</b> this grid shows countries. Enter characters into search box to filter the list.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel2: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
searchText: ["wm.Text", {"changeOnKey":true,"dataValue":undefined,"displayValue":"","placeHolder":"Enter name to search","resetButton":true,"width":"163px"}, {"onchange":"countrySearchLiveVar"}]
}],
panel46: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel47: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dojoGrid5: ["wm.DojoGrid", {"columns":[{"show":true,"title":"CountryId","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"countryId"},{"show":true,"title":"Country","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"country"},{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":false,"title":"-","width":"100%","expression":"\"<div class='MobileRowTitle'>CountryId: \" + ${countryId} + \"</div>\"\n+ \"<div class='MobileRow'>Country: \" + ${country} + \"</div>\"\n"}],"localizationStructure":{},"margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"countryLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label36: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel48: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label37: ["wm.Label", {"autoSizeWidth":true,"caption":"Found","padding":"4","width":"41px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel2: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${dojoGrid5.dataSet.count} + \" Matches\"","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel77: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel78: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html10: ["wm.Html", {"height":"100%","html":"<p>Adding a search box makes it possible to search for specific data in a grid.</p>\n<p>This example shows using a text editor to get a search string and then filter a database live variable by that string to display database information and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Client-side Searching","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel44: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel49: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
label38: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label39: ["wm.Label", {"caption":"<b>Directions:</b> this grid shows countries. Enter characters into search box to filter the list.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
searchText1: ["wm.Text", {"changeOnKey":true,"dataValue":"","displayValue":"","emptyValue":"emptyString","placeHolder":"Enter name to search","resetButton":true,"width":"163px"}, {"onchange":"searchText1Change"}],
searchNumber: ["wm.Number", {"caption":undefined,"changeOnKey":true,"dataValue":0,"displayValue":"","emptyValue":"zero","placeHolder":"countryId > than","width":"100%"}, {"onchange":"searchNumberChange"}]
}],
panel50: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel51: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
dojoGrid6: ["wm.DojoGrid", {"columns":[{"show":true,"title":"CountryId","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":"","field":"countryId"},{"show":true,"title":"Country","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":"","field":"country"},{"mobileColumn":true,"align":"left","field":"PHONE COLUMN","show":false,"title":"-","width":"100%","expression":"\"<div class='MobileRowTitle'>CountryId: \" + ${countryId} + \"</div>\"\n+ \"<div class='MobileRow'>Country: \" + ${country} + \"</div>\"\n"}],"localizationStructure":{},"margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"countryLiveVar1.queriedItems","targetProperty":"dataSet"}, {}]
}]
}]
}],
label40: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel52: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label41: ["wm.Label", {"autoSizeWidth":true,"caption":"Found","padding":"4","width":"41px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel3: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${dojoGrid6.dataSet.count} + \" Matches\"","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel79: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel10: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel80: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html11: ["wm.Html", {"height":"100%","html":"<p>Client-side searching makes it easy to quickly filter a set of data without having to call the server.</p>\n<p>This example shows a text editor for filtering by country name AND a number editor for filtering all countryIds greater than the entered value.</p>\n<p>This example required a small amount of code:\n</p><pre><code>\nsearchText1Change: function(inSender, inDisplayValue, inDataValue, inSetByCode) {\n  this.countryLiveVar1.setQuery({country: \"*\" + this.searchText1.getDataValue() + \"*\",\n                                 countryId: \"&gt;\" + this.searchNumber.getDataValue()});      \n},\n</code>\n</pre>\n<p></p><h3>Documentation</h3>\n<ul>\n\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Variable_query\" target=\"_blank\">query</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Variable_setQuery\" target=\"_blank\">setQuery</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
}]
}]
};

Grid_Searching.prototype._cssText = '';
Grid_Searching.prototype._htmlText = '';