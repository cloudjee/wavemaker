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
dojo.declare("Grid_Paging", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Grid_Paging.widgets = {
filmLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.sampledatadb.data.Film","maxResults":10,"type":"com.sampledatadb.data.Film"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel34: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel35: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label28: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Grid Paging","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
tabLayers1: ["wm.TabLayers", {"manageURL":true}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Data Navigator","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel36: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel38: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
label29: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label30: ["wm.Label", {"caption":"<b>Directions:</b> this grid shows 10 films at a time.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
dataNavigator1: ["wm.DataNavigator", {"border":"0","height":"32px","horizontalAlign":"center","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"liveSource"}, {}]
}]
}],
panel39: ["wm.Panel", {"height":"236px","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
dojoGrid4: ["wm.DojoGrid", {"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Title: \" + ${title} + \"</div>\"\n+ \"<div class='MobileRow'>ReleaseYear: \" + ${releaseYear} + \"</div>\"\n+ \"<div class='MobileRow'>Rating: \" + ${rating} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"filmId","title":"FilmId","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"title","title":"Title","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"releaseYear","title":"ReleaseYear","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"rentalDuration","title":"RentalDuration","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"rentalRate","title":"RentalRate","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"length","title":"Length","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"replacementCost","title":"ReplacementCost","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"rating","title":"Rating","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"specialFeatures","title":"SpecialFeatures","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"height":"100%","margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label31: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel41: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label32: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel1: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":false,"source":"dojoGrid4.selectedItem.title","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel75: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel76: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html9: ["wm.Html", {"height":"100%","html":"<p>The Data Navigator makes it possible to page through a large set of rows without having to display all of them at once. This example shows 10 rows at a time from a 1,000 row table.</p>\n<p>This example shows using the data navigator widget tied to a database live variable to fetch 10 rows of data at a time and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DataNavigator\" target=\"_blank\">Data Navigator</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Automatic Paging","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel37: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel40: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
label33: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label34: ["wm.Label", {"caption":"<b>Directions:</b> The Mobile List supports automatic paging, and will load more data as you scroll.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
list1: ["wm.List", {"_classes":{"domNode":["MobileListStyle"]},"border":"0","columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Title: \" + ${title} + \"</div>\"\n+ \"<div class='MobileRow'>ReleaseYear: \" + ${releaseYear} + \"</div>\"\n+ \"<div class='MobileRow'>Rating: \" + ${rating} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"filmId","title":"FilmId","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"title","title":"Title","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"releaseYear","title":"ReleaseYear","width":"60px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"rentalDuration","title":"RentalDuration","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"rentalRate","title":"RentalRate","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"length","title":"Length","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"replacementCost","title":"ReplacementCost","width":"80px","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"rating","title":"Rating","width":"60px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"specialFeatures","title":"SpecialFeatures","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"controller":"rightarrow","width":"20px","title":"-","field":"_rightArrow","mobileColumn":true}],"headerVisible":false,"margin":"0","minDesktopHeight":60,"rightNavArrow":true,"styleAsGrid":false}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"dataSet"}, {}]
}]
}],
label35: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel44: ["wm.Panel", {"height":"39px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
jsonStatus1: ["wm.JsonStatus", {}, {}],
label37: ["wm.Label", {"caption":"Page","padding":"4","width":"56px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel3: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${filmLiveVar.page}","targetProperty":"caption"}, {}]
}]
}]
}],
panel43: ["wm.Panel", {"height":"100px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"top","width":"100%"}, {}, {
label36: ["wm.Label", {"caption":"You selected","padding":"4","width":"80px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel2: ["wm.Label", {"height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${list1.selectedItem.title} + \": \" + ${list1.selectedItem.description}","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel77: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel9: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel78: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html10: ["wm.Html", {"height":"100%","html":"<p>The MobileList supports automatic paging of its dataSet.  This behavior is automatically enabled for basic database requests and easily tooled for custom dataSets.</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/List\" target=\"_blank\">Data Navigator</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
}]
}]
};

Grid_Paging.prototype._cssText = '';
Grid_Paging.prototype._htmlText = '';