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
DeploymentPage_AppGeneration.widgets = {
    archiveTypeVar: ["wm.Variable", {type: "EntryData", 
		json: "[{name: 'WAR file - for servers such as Tomcat', dataValue: 'warfile'}, {name: 'EAR File - for J2EE servers such as WebSphere and JBoss', dataValue: 'earfile'}]"}],		    
    layoutBox1: ["wm.Layout", {height: "100%", border: "3", borderColor: "#B0BDD4", margin: "10"}, {}, {
	MainLayers: ["wm.Layers", {},{}, {
	GenerateAppLayer: ["wm.Layer", {},{}, {
	    chooseCloudHeader: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Generate your application if not done yet or if your project has been updated since last generation", margin: "0,0,5,0"}],
		spacer11: ["wm.Spacer", {height: "15px", width: "50px"}, {}],
	    jndiRowPanel: ["wm.Panel", {height: "48px", width: "300px", border: "0,0,0,0", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		lastGeneratedLabel: ["wm.Label",  {_classes:{domNode:["wm_TextAlign_Left", "wm_FontSizePx_12px"]}, width: "100%", height: "20px", caption: "", border: "0 0 0 0", borderColor: "rgb(200,200,200)"}],
		useJNDICheckbox: ["wm.Checkbox", {width: "100px", captionAlign: "center", displayValue: "1", height: "20px", singleLine: false, display: "CheckBox", padding: "5,0,0,0", caption: "Use JNDI?", captionSize: "80px", captionPosition: "left", captionAlign: "right"}, {onchange: "useJNDICheckboxChange"}],
		jndiButton: ["wm.Button", {height: "100%", width: "150px", disabled: true, caption: "Setup JNDI", border: "0"}, {onclick: "setupJNDIButtonClick"}]
	    }],
		ArchiveListPanel: ["wm.Panel", {layoutKind: "top-to-bottom", height: "100%", width: "100%", margin: "6"},{}, {	    
		archiveType: ["wm.List", {margin: "5,20,10,0", width: "100%", height: "90px", headerVisible: false, dataFields: "name", border: "2", borderColor: "rgb(120,120,120)"}, {onselect: "archiveTypeSelectionChange"}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {targetProperty: "dataSet", source: "archiveTypeVar"}, {}]
		    }]
		}]
	    }],
		GenerateAppButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		generateAppButton: ["wm.Button", {width: "150px", height: "100%", caption: "Generate Application"}, 
			{onclick: "generateAppButtonClick"}],

		downloadAppButton: ["wm.Button", {width: "150px", height: "100%", caption: "Download Application"},
				    {onclick: "downloadAppClick"}, {
			
			binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"disabled","source":"archiveType.emptySelection"}, {}]
		    }]
			
		}],
	    }]
	}]	
	}]
    }]
}

