/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
DeploymentPage_Cloud.widgets = {
    cloudListVar: ["wm.Variable", {type: "EntryData", 
		json: "[{name: 'Amazon EC2', dataValue: 'amazonec2'}, {name: 'Amazon S3 / RightScale', dataValue: 'amazons3'}, {name: 'Eucalyptus Cloud', dataValue: 'eucalyptusec2'}, {name: 'OpSource', dataValue: 'opsource'}, {name: 'RackSpace Servers', dataValue: 'rackspaceserver'}, {name: 'RackSpace Storage / RightScale', dataValue: 'rackspacestorage'}]"}],
    layoutBox1: ["wm.Layout", {height: "100%", border: "3", borderColor: "#B0BDD4", margin: "10"}, {}, {
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
