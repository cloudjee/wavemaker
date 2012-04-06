/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
 
DeploymentPage.widgets = {
    webServerListVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Tomcat', value: 'tomcat'}]"}],		    
    layoutBox1: ["wm.Layout", {height: "100%"}, {}, {
	MainPanel: ["wm.Panel", {border: "10", borderColor: "#424A5A", width: "100%", height: "100%", padding: "5, 10, 5, 10", layoutKind: "top-to-bottom", backgroundColor: "#8B93A1"},{},{
	    MainDeploymentLayers: ["wm.TabLayers", {headerHeight: "32px", width: "100%", height: "100%", border: "0", clientBorder: "3", borderColor: "#808DA4"}, {}, {
		GenerateAppLayer: ["wm.Layer", {width: "100%", height: "100%", caption: "Generate Application", backgroundColor: "white"}, {}, {
		    GenerateAppPageContainer: ["wm.PageContainer", {width: "100%", height: "100%", pageName: "DeploymentPage_AppGeneration", deferLoad: true},
					       {onShow: "reset"}]
		}],
		ManageCloudLayer: ["wm.Layer", {width: "100%", height: "100%", caption: "Manage Cloud Servers", backgroundColor: "white"}, {}, {
		    ManageCloudPageContainer: ["wm.PageContainer", {width: "100%", height: "100%", pageName: "DeploymentPage_Cloud", deferLoad: true},
					       {onShow: "reset"}]		
		}],
		ManageWebServersLayer: ["wm.Layer", {width: "100%", height: "100%", caption: "Deploy to Servers", backgroundColor: "white"}, {}, {
		    ManageWebServersPageContainer: ["wm.PageContainer", {width: "100%", height: "100%", pageName: "DeploymentPage_WebServer", deferLoad: true},
						    {onShow: "reset"}]		
		}]
	    }]
	}],
	    ButtonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, width: "100%", height: "32px", horizontalAlign: "right"}, {}, {
		doneButton: ["wm.Button", {width: "150px", height: "100%", caption: "Close"}, {onclick: "doneClicked"}]
	    }]

    }]
};

