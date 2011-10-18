/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
 

HandleRequiredJars.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	dialog: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", border: "10", borderColor: "#424959"}, {}, {
	    label0: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "30px", caption: "You will need to install one or more jar files"}],
	    layers: ["wm.WizardLayers", {width: "100%", height: "100%", clientBorder: "0"}, {onCancelClick: "close", onDoneClick: "done"}, {
		layer1: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "Step 1", padding: "5", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    html1: ["wm.Html", {width: "100%", height: "100%"}]
		}],
		layer2: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "Step 2", padding: "5", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    labelc1: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "Now upload the jar into studio"}],
		    fileUploader: ["wm.DojoFileUpload", {  width: "80px",
							   height: "35px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess", onError: "onError"}],
		}],


		layer3: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 3", padding: "5", verticalAlign: "top", horizontalAlign: "left", showing: false}, {}, {
		    html2: ["wm.Html", {width: "100%", height: "100%"}]
		}],
		layer4: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 4", padding: "5", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left", showing: false}, {}, {
		    labelc4: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "Now upload the jar into studio"}],
		    fileUploader2: ["wm.DojoFileUpload", {  width: "80px",
							   height: "35px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess"}],
		}],


		layer5: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 5", padding: "5", verticalAlign: "top", horizontalAlign: "left", showing: false}, {}, {
		    html3: ["wm.Html", {width: "100%", height: "100%"}]
		}],
		layer6: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 6", padding: "5", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left", showing: false}, {}, {
		    labelc5: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "Now upload the jar into studio"}],
		    fileUploader3: ["wm.DojoFileUpload", {  width: "80px",
							   height: "35px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess"}],
		}],


		layer7: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "End", padding: "5", verticalAlign: "top", horizontalAlign: "center"}, {}, {
		    label7: ["wm.Html", {width: "100%",height: "100%", html: "Before we can use the new jar files, we need to restart studio.  Hit the Restart button when you are ready."}],
		    label7b: ["wm.Html", {width: "100%", height: "35px", html: "Note that if you have unsaved changes, you should hit save before you restart"}],
		    saveButton: ["wm.Button", {width: "100px", caption: "Save"},{onclick: "saveProject"}]
		}]

	    }]
	}]
    }]
}
