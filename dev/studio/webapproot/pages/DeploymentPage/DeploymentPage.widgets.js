/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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

