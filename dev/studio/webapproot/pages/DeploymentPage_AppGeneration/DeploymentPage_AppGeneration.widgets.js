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
 
DeploymentPage_AppGeneration.widgets = {
    archiveTypeVar: ["wm.Variable", {type: "EntryData", 
		json: "[{name: 'WAR file - for servers such as Tomcat', dataValue: 'warfile'}, {name: 'EAR File - for J2EE servers such as WebSphere and JBoss', dataValue: 'earfile'}]"}],		    
    layoutBox1: ["wm.Layout", {height: "100%", border: "0", borderColor: "#B0BDD4", margin: "10"}, {}, {
	MainLayers: ["wm.Layers", {},{}, {
	GenerateAppLayer: ["wm.Layer", {},{}, {
/*	    chooseCloudHeader: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Generate your application if not done yet or if your project has been updated since last generation", margin: "0,0,5,0"}],
		spacer11: ["wm.Spacer", {height: "15px", width: "50px"}, {}],*/
	    firstRowPanel: ["wm.Panel", {height: "100px", width: "300px", margin: "0,0,30,0", border: "0,0,2,0", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left", showing: true}, {}, {
		firstRowLabel: ["wm.Label", {singleLine: false, width: "100%", height: "20px", caption: "Step 1: Generate Application (optionally using JNDI Settings)"}],
/*		lastGeneratedLabel: ["wm.Label",  {_classes:{domNode:["wm_TextAlign_Left", "wm_FontSizePx_12px"]}, width: "100%", height: "20px", caption: "", border: "0 0 0 0", borderColor: "rgb(200,200,200)"}],*/
		useJNDICheckbox: ["wm.Checkbox", {width: "100px", captionAlign: "center", displayValue: "1", height: "20px", singleLine: false, display: "CheckBox", padding: "5,0,0,0", caption: "Use JNDI?", captionSize: "80px", captionPosition: "left", captionAlign: "right"}, {onchange: "useJNDICheckboxChange"}],
		jndiButton: ["wm.Button", {height: "45px", width: "150px", disabled: true, caption: "Setup JNDI", border: "0"}, {onclick: "setupJNDIButtonClick"}],
		generateAppButton: ["wm.Button", {height: "45px", width: "150px", caption: "Generate Application"}, 
			{onclick: "generateAppButtonClick"}]
	    }],


/*		ArchiveListPanel: ["wm.Panel", {layoutKind: "top-to-bottom", height: "100%", width: "100%", margin: "6"},{}, {	    
		archiveType: ["wm.List", {margin: "5,20,10,0", width: "100%", height: "90px", headerVisible: false, dataFields: "name", border: "2", borderColor: "rgb(120,120,120)"}, {onselect: "archiveTypeSelectionChange"}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {targetProperty: "dataSet", source: "archiveTypeVar"}, {}]
		    }]
		}]
	    }],*/
	    secondRowPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		secondRowLabel: ["wm.Label", {singleLine: false, width: "100%", height: "20px", caption: "Step 2: Download the application (or go to Deploy to Servers Tab)"}],

		downloadWarButton: ["wm.Button", {height: "45px", width: "150px", caption: "Download for Tomcat Server"}, {onclick: "downloadWarClick"}, {
		}],
		downloadEarButton: ["wm.Button", {height: "45px", width: "150px", caption: "Download for WebSphere Server"}, {onclick: "downloadEarClick"}, {
		}]
	    }]
	}]
	}]
    }]
}

