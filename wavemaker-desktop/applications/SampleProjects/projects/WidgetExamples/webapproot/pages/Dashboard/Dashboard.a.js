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
dojo.declare("Dashboard", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

Dashboard.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
dashboard1Panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
dashboard1: ["wm.Dashboard", {"margin":"4","nbZones":2,"saveInCookie":false,"portlets":[{"id":"portlet","title":"Text Editor","page":"Editor_Text","isOpen":true,"isClosable":true,"x":0,"y":0},{"id":"portlet_1","title":"ToggleButton Panel","page":"Button_TogglePanel","isOpen":false,"isClosable":true,"x":0,"y":1},{"id":"portlet_2","title":"Grids & Lists","page":"Grid_Basic","isOpen":false,"isClosable":true,"x":0,"y":0},{"id":"portlet_3","title":"About App","page":"About","isOpen":true,"isClosable":true,"x":1,"y":0},{"id":"portlet_4","title":"List Viewer","page":"ListViewer","isOpen":false,"isClosable":true,"x":0,"y":0}]}, {}],
addPortletButton: ["wm.Button", {"caption":"Add Widget","margin":"4","width":"121px"}, {"onclick":"dashboard1"}]
}],
fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description","width":"280px"}, {}, {
panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html2: ["wm.Html", {"height":"100%","html":"<p>The Dashboard widget lets you load other pages into a dashboard that the end user can reorganize.  You can control the size of the \"Portlets\" in your dashboard by setting the width of the layoutBox in each page to be shown as a Portlet, or you can let the Dashboard figure out its own width.</p>\n<p>Providing some manner of \"Add Widget\" button allows users to add other Portlets you've prepared into the Dashboard.\n</p>\n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/Dashboard\" target=\"_blank\">Dashboard</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
};

Dashboard.prototype._cssText = '';
Dashboard.prototype._htmlText = '';