/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
 

ImportFile.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	dialog: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%", border: "10", borderColor: "#424959"}, {}, {
	    panel: ["wm.Panel", {_classes: ["wm_Padding_16px"], 
				 layoutKind: "left-to-right", 
				 width: "100%", 
				 height: "100%", 
				 padding: "16",
				 horizontalAlign: "left", 
				 verticalAlign: "top"}, {}, {
					 fileUploader: ["wm.DojoFileUpload", {  width: "100px",
										height: "32px",
										margin: "2",
										useList: false,
										buttonCaption: "Select Zipfile",
										service: "deploymentService",
										operation: "uploadProjectZipFile"},
							{onChange: "onChange"}],
				     filename: ["wm.Text", {width: "100%",
							    height: "32px",
							    disabled: true,
							    caption: "",
							   },{}, {
							       binding: ["wm.Binding", {}, {}, {
								   wire: ["wm.Wire", {"targetProperty":"dataValue", source: "fileUploader.variable.name"}, {}]
							       }]
							   }],
					 openButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},
								    caption: "Open Project",
								     height: "32px",
								     padding: "0",
								     margin: "2",
								     width: "120px"},
						      {onclick: "openProject"},
						      {
							  binding: ["wm.Binding", {}, {}, {
							      wire: ["wm.Wire", {"targetProperty":"disabled", expression: "!${filename.dataValue}"}, {}]
							  }]
						      }]

				 }]
	}]
    }]
}
