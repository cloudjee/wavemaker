/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

CustomWebServiceImporter.widgets = {
    flowListService: ["wm.JsonRpcService", {service: "warpFlowService", sync: false}, {}],
    layoutBox: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", imageList: "smallToolbarImageList"}, {}, {
	dialog: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", border: "10",  borderColor: "#424959"}, {}, {
	    importLabel: ["wm.Label", {width: "100%", height: "20px", caption: "Step 1. Import list of projects and flows"}],
	    importPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "165px", padding: "10",margin:"0,0,10,0", horizontalAlign: "right", verticalAlign: "middle"}, {onEnterKeyPress: "scanClick"}, {
		serviceName: ["wm.Text", {width: "100%", caption: "Service Name", captionAlign: "right", captionSize: "120px", dataValue: "InfoteriaFlows",emptyValue: "emptyString"}],
		importHostPanel: ["wm.Panel", {layoutKind: "left-to-right", height: "24px", width: "100%"}, {}, {
		    importHost: ["wm.Text", {width: "100%", caption: "Import URL", captionAlign: "right", captionSize: "120px", dataValue: "10.18.63.147",emptyValue: "emptyString"}],
		    importPort: ["wm.Number", {width: "150px", caption: "Port", captionAlign: "right", captionSize: "40px", dataValue: "21381",emptyValue: "emptyString"}]
		}],
		userInput: ["wm.Text", {width: "100%", caption: "Username", captionAlign: "right", captionSize: "120px",emptyValue: "emptyString"}],
		passInput: ["wm.Text", {width: "100%", caption: "Password", captionAlign: "right", captionSize: "120px",emptyValue: "emptyString"}],
		scanButton: ["wm.Button", {width: "120px", caption: "Read Service"}, {onclick: "scanClick"}]
	    }],
	    resultLabel: ["wm.Label", {width: "100%", height: "20px", caption: "Step 2. Select the flows for your project"}],
	    resultPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "right", verticalAlign: "middle"}, {}, {	    
		searchBox: ["wm.Text", {width: "100%", caption: "Filter Flows", captionAlign: "right", captionSize: "120px", changeOnKey: true, border: "0,0,2,0", borderColor: "#424A5A"}, {onchange: "filterResults"}],
		tree: ["wm.Tree", {width: "100%", height: "100%",margin: "10"}, {oncheckboxclick: "nodeChecked"}]
	    }]
	}],
	buttonBar: ["wm.Panel", {_classes: {domNode:["wmDialogFooter"]}, layoutKind: "left-to-right", width: "100%", height: "35px", horizontalAlign: "right", verticalAlign: "middle"}, {}, {
	    importButton: ["wm.Button", {width: "100px", caption: "Import"}, {onclick: "importClick"}],
	    cancelButton: ["wm.Button", {width: "100px", caption: "Cancel"}, {onclick: "cancelClick"}]

	}]
    }]
}