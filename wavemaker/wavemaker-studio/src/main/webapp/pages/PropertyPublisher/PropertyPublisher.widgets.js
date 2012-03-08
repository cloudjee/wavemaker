/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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
 

PropertyPublisher.widgets = {
    fullPropListVar: ["wm.Variable", {isList: true, type: "EntryData"}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
	    containerWidget: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2"}, {}, {
		mainPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", border: "1", borderColor: "#333"}, {}, {
		    treeHeader: ["wm.Label", {width: "100%", caption: "", _classes: {domNode: ["dialogfooter"]}}],
		    instructionsHtml: ["wm.Html", {padding: "0,3,8,3", width: "100%", height: "40px", autoSizeHeight: true, html: "Each property selected below can be editted in the properties panel of anuy PageContainer that contains this page"}],
		    tree: ["wm.Tree", {width: "100%", height: "100%"},{oncheckboxclick: "checkboxChange"}]
		}],
		listPanel: ["wm.Panel", {width: "250px", height: "100%", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left", border: "1", borderColor: "#333"}, {}, {
		    listHeader: ["wm.Label", {width: "100%", caption: "All Published Properties", _classes: {domNode: ["dialogfooter"]}}],
		    fullList: ["wm.DojoGrid", {width: "100%", height: "100%", deleteColumn: true, columns: [{show: true,title: "Name", field: "name", width: "100%"},
													 {show: true,title: "Property", field: "dataValue", width: "100%"}]},
			   {onRowDeleted: "listRowDeleted"},
			   {
			       binding: ["wm.Binding", {},{}, {
				   wire: ["wm.Wire", {"source":"fullPropListVar","targetProperty":"dataSet"}, {}]

			       }]
			   }]
		}]
	    }],
		     
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
		okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}]
	    }]
	}]
}