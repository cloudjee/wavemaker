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
 

OpenProjectOptions.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	dialog: ["wm.Panel", {layoutKind: "top-to-bottom", verticalAlign: "middle", width: "100%", height: "100%"}, {}, {
			panel: ["wm.Panel", {_classes: ["wm_Padding_16px"], layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "center"}, {}, {
			    message: ["wm.Html", {autoSizeHeight: true, width: "100%", height: "30px", caption: "Your project needs to be upgraded.  Please choose:"}],
			    radioOpen: ["wm.RadioButton", {captionSize: "100%", captionPosition: "right", captionAlign:"left",caption: "Upgrade existing project", helpText: "A copy of your pre-upgraded project will be saved to your project's exports folder", width: "100%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onDblClick: "okButtonClick"}],
			    radioCopy: ["wm.RadioButton", {captionSize: "100%", captionPosition: "right", captionAlign:"left", caption: "Leave project unchanged, open upgraded project with new name:", helpText: "Your project will be copied to the name you provide; the copy will be upgraded, your original project left untouched", width: "100%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onDblClick: "okButtonClick"}],
			    newProjectName: ["wm.Text", {captionSize: "150px", caption: "New project name", disabled:true, width: "80%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onEnterKeyPress: "okButtonClick"},{
				binding: ["wm.Binding", {}, {}, {
				    wire: ["wm.Wire", {targetProperty: "disabled", expression: "!${radioCopy.checked}"}]
				}]
			    }]
			}],
	buttonBar1: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},"caption":"Cancel","margin":"4"}, {onclick: "cancelButtonClick"}],
	    okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},"caption":"OK","margin":"4"}, {onclick: "okButtonClick"}]
	}]
	}]
    }]
}