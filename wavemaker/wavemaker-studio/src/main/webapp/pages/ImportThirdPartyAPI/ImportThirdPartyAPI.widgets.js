/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

ImportThirdPartyAPI.widgets = {
    imageDialog: ["wm.DesignableDialog", {width: "350px", height: "500px", title: "Run as Administrator", modal: false},{}, {
		  adminWarningPicture: ["wm.Picture", {source: "images/runasadmin.png", width: "343px", height: "471px", showing: true}]
    }],
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	dialog: ["wm.Panel", {layoutKind: "left-to-right",  width: "100%", height: "100%", border: "10", borderColor: "#424959"}, {}, {
	    layers: ["wm.WizardLayers", {width: "100%", height: "100%", clientBorder: "0"}, {onCancelClick: "close", onDoneClick: "done"}, {
		layer: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "1 Install Extension", padding: "5", layoutKind: "top-to-bottom", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    adminWarningLabel: ["wm.Label", {singleLine: false, width:"100%", height:"40px", caption: "You must have admin/root privileges to install third-party components.  If you do not have admin/root privileges please contact your system administrator."}],
		    adminWarningLabel2: ["wm.Label", {caption: "More info...", link: "#", width: "60px", height:"20px"}, {onclick: "imageDialog"}],
		    adminSpacer: ["wm.Spacer", {height:"100%"}],
		    panel1: ["wm.Panel", {layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left", width:"100%",height:"50px"}, {}, {
			label: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "If you have a zip file for extending Studio's behaviors, upload it here"}],
			fileUploader: ["wm.DojoFileUpload", {  width: "80px",
							       height: "35px",
							       margin: "2",
							       useList: false,
							       buttonCaption: "Upload",
							       service: "studioService",
							       operation: "uploadExtensionZip"},
				       {onSuccess: "onSuccess", onError: "onError"}],
		    }]
		}],
		layer2: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "2 Restart Studio", padding: "5", verticalAlign: "top", horizontalAlign: "center"}, {}, {
		    label2: ["wm.Html", {width: "100%",height: "100%", html: "Before we can use the new jar files, we need to restart studio.  Hit the Restart button when you are ready."}],
		    label2b: ["wm.Html", {width: "100%", height: "35px", html: "Note that if you have unsaved changes, you should hit save before you restart"}],
		    saveButton: ["wm.Button", {width: "100px", caption: "Save"},{onclick: "saveProject"}]
		}]
	    }]
	}]
    }]
}
