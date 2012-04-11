/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

S3BucketDialog.widgets = {
	locList: ["wm.Variable", {type: "EntryData", json: "[ {name: \"Default\", dataValue: \"Default\" }, \n{name: \"EU\", dataValue: \"EU\"} ]"}, {}],
	layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	    titleBar: ["wm.Panel", {layoutKind: "left-to-right", height: "29px"}, {}, {
		dialogLabel: ["wm.Label", {_classes: {domNode: [
					    "wm_TextDecoration_Bold", 
					    "wm_TextAlign_Center", 
					    "wm_Padding_4px", 
					    "wm_FontColor_White"]}, caption: "Create S3 Bucket",  width: "100%", height: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					    }]
	    }],
	    panel: ["wm.Panel", {_classes: ["wm_Padding_16px"], layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "center"}, {}, {
		bucket: ["wm.TextEditor", {width: "100%", caption: "Bucket Name", height: "25px", captionSize: "60%"}, {}, {
			editor: ["wm._TextEditor", {}, {}]
		}],
		spacer1: ["wm.Spacer", {height: "5px", width: "250px"}, {}],
		locName: ["wm.SelectEditor", {caption: "Location", width: "100%", captionSize: "60%", height: "25px"}, {}, {
		  editor: ["wm._SelectEditor", {displayField: "name", dataField: "dataValue"}, {}, {
		    binding: ["wm.Binding", {}, {}, {
		      wire: ["wm.Wire", {targetProperty: "dataSet", source: "locList"}, {}]
		    }]
		  }]
		}],
	      spacer: ["wm.Spacer", {height: "100%", width: "10px"}],
		footer: ["wm.Panel", {layoutKind: "left-to-right",  horizontalAlign: "right", verticalAligh: "bottom", height: "26px", width: "100%"}, {}, {
			okButton: ["wm.Button", {caption: "OK", width: "100px", height: "100%"}, {onclick: "okButtonClick"}],
			cancelButton: ["wm.Button", {caption: "Cancel", width: "100px", height: "100%"}, {onclick: "cancelButtonClick"}]
		}]
	}]
   }]
}
