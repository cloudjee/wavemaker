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
ListViewer.widgets = {
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
		listViewer1: ["wm.ListViewer", {"pageName":"ListViewerRow"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"app.deptLiveVar","targetProperty":"dataSet"}, {}]
			}]
		}],
		fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","minWidth":280,"title":"Description","width":"50%"}, {}, {
			panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				html2: ["wm.Html", {"height":"100%","html":"<p>The ListViewer widget is a an alternative way to create a list.  It is not as well supported as Grid and MobileList due to performance issues with the approach it takes.</p>\n<p>The approach ListViewer takes is that you design a page that will be used as a row, and the ListViewer displays that page over and over, once per item in your dataSet.</p>\n<p>The example to the left shows a page being displayed over and over.  Its start method gets called on each Department, allowing it to manipulate some data in order to present the DojoGrid that is in each row.  Each also has its own event handler for the button, allowing each to handle its own onClick event in its own way.</p>\n<p>While this widget only loads and renders a row when it becomes visible, generating widgets, setting up events and bindings, all while the user scrolls requires a very fast browser.  IE 8 and mobile devices may not perform well enough to use this widget.</p>\n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/ListViewer\" target=\"_blank\">ListViewer</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
			}]
		}]
	}]
}