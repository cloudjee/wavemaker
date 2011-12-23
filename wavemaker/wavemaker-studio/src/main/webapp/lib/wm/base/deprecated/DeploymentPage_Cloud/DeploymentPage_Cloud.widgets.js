/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
 
DeploymentPage_Cloud.widgets = {
    cloudListVar: ["wm.Variable", {type: "EntryData", 
		json: "[{name: 'Amazon EC2', dataValue: 'amazonec2'}, {name: 'Amazon S3', dataValue: 'amazons3'}, {name: 'Eucalyptus Cloud', dataValue: 'eucalyptusec2'}, {name: 'OpSource', dataValue: 'opsource'}, {name: 'RackSpace Servers', dataValue: 'rackspaceserver'}, {name: 'RackSpace Storage', dataValue: 'rackspacestorage'}]"}],
    layoutBox1: ["wm.Layout", {height: "100%", border: "0", borderColor: "#B0BDD4", margin: "10"}, {}, {
	chooseCloudHeader: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Which cloud service provider do you want to use?", margin: "0,0,5,0"}],
	WhatToDoLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {	    
	WhatToDoPanel:  ["wm.Panel", {height: "210px", width: "450px", layoutKind: "top-to-bottom"}, {}, {
	    chooseCloudLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Select a cloud service provider"}],
	    chooseCloudList: ["wm.List", {margin: "5,20,10,0", width: "100%", height: "200px", headerVisible: false, dataFields: "name", border: "2", borderColor: "rgb(120,120,120)"}, {}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {targetProperty: "dataSet", source: "cloudListVar"}, {}]
		}]
	    }]
	}],
	spacer1: ["wm.Spacer", {height: "100%"}],
	chooseCloudButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
	    chooseCloudButton: ["wm.Button", {width: "150px", height: "100%", caption: "OK"}, {onclick: "chooseCloudClick"}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {"targetProperty":"disabled","source":"chooseCloudList.emptySelection"}, {}]
			}]
	    }]
	}]
	}]
    }]
};
