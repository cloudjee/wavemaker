/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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
							   height: "40px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess", onError: "onError"}],
		}],


		layer3: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 3", padding: "5", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    html2: ["wm.Html", {width: "100%", height: "100%"}]
		}],
		layer4: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 4", padding: "5", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    labelc4: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "Now upload the jar into studio"}],
		    fileUploader2: ["wm.DojoFileUpload", {  width: "80px",
							   height: "40px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess"}],
		}],


		layer5: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 5", padding: "5", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    html3: ["wm.Html", {width: "100%", height: "100%"}]
		}],
		layer6: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, showing: false, caption: "Step 6", padding: "5", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    labelc5: ["wm.Label", {singleLine: false, width: "100%", autoSizeHeight: true, height: "100%", caption: "Now upload the jar into studio"}],
		    fileUploader3: ["wm.DojoFileUpload", {  width: "80px",
							   height: "40px",
							   margin: "2",
							   useList: false,
							   buttonCaption: "Upload",
							   service: "studioService",
							   operation: "uploadJar"},
				   {onSuccess: "onSuccess"}],
		}],


		layer7: ["wm.Layer", {_classes: {domNode: ["wmGroupBox"]}, caption: "End", padding: "5", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    labeld1: ["wm.Label", {singleLine: false, width: "100%", height: "30px", caption: "Now restart studio"}],
		    labeld2: ["wm.Html", {width: "100%",height: "100%", html: "<ol><li>Restart the studio server using the studio application you launched from you computer's file system</li><li>After you've restarted your server, reload studio in your browser</li></ol>"}]
		}]

	    }]
	}]
    }]
}
