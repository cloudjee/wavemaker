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
 

UserSettings.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
		dialog: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%"}, {}, {
			titleBar: ["wm.Panel", {layoutKind: "left-to-right", height: "29px"}, {}, {
				dialogLabel: ["wm.Label", {_classes: {domNode: [
			"wm_TextDecoration_Bold", 
			"wm_TextAlign_Center", 
			"wm_Padding_4px", 
			"wm_FontColor_White"]}, caption: "User Settings",  width: "100%", height: "100%"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel: ["wm.Panel", {_classes: ["wm_Padding_16px"], layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "center"}, {}, {
			    oldPasswordEditor: ["wm.Text", {password: true, captionSize: "150px", caption: "Current password", width: "100%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onEnterKeyPress: "okButtonClick"}, {
				}],
			    passwordEditor: ["wm.Text", {password: true, captionSize: "150px", caption: "New password", width: "100%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onEnterKeyPress: "okButtonClick"}, {
				}],
			    confirmPasswordEditor: ["wm.Text", {password: true, captionSize: "150px", caption: "Confirm new password", width: "100%", height: "24px", _classes: {captionNode: ["wm_FontColor_White"]}}, {onEnterKeyPress: "okButtonClick"}, {
				}]
			}],
			footer: ["wm.Panel", {layoutKind: "left-to-right",  horizontalAlign: "right", verticalAligh: "bottom", height: "26px", width: "100%"}, {}, {
			    okButton: ["wm.Button", {caption: "OK", width: "100px", height: "100%"}, {onclick: "okButtonClick"}],
				spacer4: ["wm.Spacer", {height: "100%", width: "10px", height: "100%"}, {}],
			    cancelButton: ["wm.Button", {caption: "Cancel", width: "100px", height: "100%"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}
