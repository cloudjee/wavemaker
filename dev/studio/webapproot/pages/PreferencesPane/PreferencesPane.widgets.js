/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
PreferencesPane.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
		prefsDialog: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
			prefsDialogInner: ["wm.Panel", {_classes: {domnode: ["wm-darksnazzy", "dialogTitleBar"]}, height: "100%", width: "100%"}, {}, {
/*
				titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, height: "100%", width: "100%", caption: "WaveMaker Preferences", border: "0"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				*/
				prefsPanel: ["wm.Panel", {height: "100%", width: "100%", padding: "10"}, {}, {
				    panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, padding: "10", margin: "0,0,5,0", height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "left"}, {}, {
					    wavemakerFolderEditor: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "130px", caption: "WaveMaker Folder", width: "100%"}, {onEnterKeyPress: "okButtonClick"}, {}],
						demoFolderEditor: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "130px", caption: "Demos Folder", width: "100%"}, {onEnterKeyPress: "okButtonClick"}, {
						}]
					}],
					panel3: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, margin: "5,0,0,0", height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "left"}, {}, {
					    /*
						debugEditor: ["wm.Editor", {captionSize: "400px", width: "100%", caption: "Run in debug mode", displayValue: true, display: "CheckBox", captionAlign: "left", captionPosition: "right"}, {onchange: "debugEditorChange"}, {
							editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
						}],
					    */
						useLopEditor: ["wm.Editor", {captionSize: "400px", width: "100%", caption: "Open the last opened project on startup", displayValue: true, display: "CheckBox", captionAlign: "left", captionPosition: "right"}, {onchange: "useLopEditorChange"}, {
							editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
						}]
					}]
				}],
				footer: ["wm.Panel", {height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					okButton: ["wm.Button", {caption: "OK", width: "70px", padding: "0"}, {onclick: "okButtonClick"}],
					spacer4: ["wm.Spacer", {width: "10px"}, {}],
					cancelButton: ["wm.Button", {caption: "Cancel", width: "70px", padding: "0"}, {onclick: "cancelButtonClick"}]
				}]
			}]
		}]
	}]
}
