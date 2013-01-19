/*
 * Copyright (C) 2010-2013 VMware, Inc. All rights reserved.
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
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: {domNode: ["StudioDarkPanel"]}}, {}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
            instructionLabel: ["wm.Html", {width: "100%", height: "100%", html: "<div class='InstructionHeader'>Use this dialog to import</div><ul><li>Projects</li><li>Project Templates</li><li>Themes</li><li>Custom Components</li></ul>"}]            
    	}],
        footer: ["wm.studio.DialogButtonPanel", {}, {}, {            				 
				 fileUploader: ["wm.DojoFileUpload", {  width: "100px",
									height: "32px",
									margin: "2",
									useList: false,
									buttonCaption: "Select Zipfile",
									service: "deploymentService",
									operation: "uploadProjectZipFile"},
						{onChange: "onChange", onSuccess: "onSuccess", onError: "onError"}]
		}]    	
    }]
}
