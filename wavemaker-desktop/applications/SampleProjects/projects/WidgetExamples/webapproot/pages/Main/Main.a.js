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

dojo.declare("Main", wm.Page, {
"preferredDevice": "desktop",
start: function(backState, locationState) {
/* Take the locationState, a representation of the query string of the URL, and restore state.
* Most state is automatically restored via properties, but the grid selection requires some
* custom code
*/
if (locationState && locationState["main.mainPageContainer"]) {
this.mainMenuGrid.selectByQuery({dataValue: locationState["main.mainPageContainer"]});
} else {
this.mainMenuGrid.select(0);
}
},
mainMenuGridSelect: function(inSender) {
this.mainPageContainer.setPageName(inSender.selectedItem.getValue("dataValue"));
},
_end: 0
});

Main.widgets = {
buttonNavCall: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"mainPageContainer","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"button\"","targetProperty":"pageName"}, {}]
}]
}]
}],
selectNavCall: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"mainPageContainer","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"select\"","targetProperty":"pageName"}, {}]
}]
}]
}],
editorNavCall: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"mainPageContainer","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"editor\"","targetProperty":"pageName"}, {}]
}]
}]
}],
treeNavCall: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"source":"mainPageContainer","targetProperty":"pageContainer"}, {}],
wire1: ["wm.Wire", {"expression":"\"tree\"","targetProperty":"pageName"}, {}]
}]
}]
}],
mainMenuVar: ["wm.Variable", {"isList":true,"json":"[\n\t{\n\t\t\"name\": \"Buttons\", \n\t\t\"dataValue\": \"Button\"\n\t}, \n\t{\n\t\t\"name\": \"Grids & Lists\", \n\t\t\"dataValue\": \"Grid\"\n\t}, \n\t{\n\t\t\"name\": \"Editors\", \n\t\t\"dataValue\": \"Editor\"\n\t}, \n\t{\n\t\t\"name\": \"DataSet Editors\", \n\t\t\"dataValue\": \"Select\"\n\t}, \n\t{\n\t\t\"name\": \"Forms\", \n\t\t\"dataValue\": \"Form\"\n\t}, \n\t{\n\t\t\"name\": \"Dialogs\", \n\t\t\"dataValue\": \"Dialog\"\n\t}, \n\t{\n\t\t\"name\": \"Moues Events\", \n\t\t\"dataValue\": \"Mouse\"\n\t}, \n\t{\n\t\t\"name\": \"Trees\", \n\t\t\"dataValue\": \"Tree\"\n\t}, \n\t{\n\t\t\"name\": \"Dashboards & Portlets\", \n\t\t\"dataValue\": \"Dashboard\"\n\t}, \n\t{\n\t\t\"name\": \"Social widgets\", \n\t\t\"dataValue\": \"Social\"\n\t}, \n\t{\n\t\t\"name\": \"Querying & Searching\", \n\t\t\"dataValue\": \"Querying\"\n\t}, \n\t{\n\t\t\"name\": \"About App\", \n\t\t\"dataValue\": \"About\"\n\t}\n]","type":"EntryData"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
panel1: ["wm.Panel", {"border":"0,1,0,0","borderColor":"#999999","height":"100%","horizontalAlign":"left","minDesktopHeight":600,"minHeight":600,"minWidth":1000,"verticalAlign":"top","width":"100%"}, {}, {
panel2: ["wm.HeaderContentPanel", {"border":"0,0,1,0","height":"65px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,10","verticalAlign":"middle","width":"100%"}, {}, {
picture1: ["wm.Picture", {"height":"50px","source":"lib/wm/base/widget/themes/default/images/wmLogo.png","width":"62px"}, {}],
label3: ["wm.Label", {"caption":"WaveMaker Widget Sampler","height":"35px","padding":"4","width":"450px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
gadgetFacebookLikeButton1: ["wm.gadget.FacebookLikeButton", {"action":"recommend","height":"80px","href":"http://widgetexamples.cloudfoundry.com"}, {}]
}],
panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
mainMenuGrid: ["wm.DojoGrid", {"border":"0","columns":[{"show":true,"field":"name","title":"Demos","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Demos: \" + ${name} + \"</div>\"\n","mobileColumn":true}],"height":"100%","localizationStructure":{},"margin":"0","minDesktopHeight":60,"singleClickEdit":true,"width":"120px"}, {"onSelect":"mainMenuGridSelect"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"mainMenuVar","targetProperty":"dataSet"}, {}]
}]
}],
panel4: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"4,0,0,0","verticalAlign":"top","width":"100%"}, {}, {
mainPageContainer: ["wm.PageContainer", {"deferLoad":true,"manageHistory":true,"manageURL":true,"pageName":"Button","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}],
panel6: ["wm.HeaderContentPanel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
picture2: ["wm.Picture", {"height":"100%","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"24px"}, {}],
label2: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"Powered by WaveMaker","height":"100%","padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","caption":"Copyright [company name] 2011","height":"100%","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}]
}]
}]
};

Main.prototype._cssText = 'body.tundra .Main .wmlayout .Main-label3 {\
font-family: "Helvetica Neue", helvetica, arial, sans-serif;\
font-weight: bold;\
font-size:30px;\
line-height: 28px;\
color: #333333;\
letter-spacing: -0.015em;\
text-shadow: 0 2px 1px #b3d5f0;\
white-space: nowrap;\
}\
body.tundra .Main .wmlayout .Main-menuObjectTree {\
color:#333333;\
background-color:#cccccc;\
}\
';
Main.prototype._htmlText = '';