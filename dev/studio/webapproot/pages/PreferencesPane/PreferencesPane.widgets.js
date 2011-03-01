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
PreferencesPane.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
		prefsDialog: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
			prefsDialogInner: ["wm.Panel", {_classes: {domnode: ["wm-darksnazzy", "dialogTitleBar"]}, height: "100%", width: "100%"}, {}, {
				titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, height: "100%", width: "100%", caption: "WaveMaker Preferences", border: "0"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				prefsPanel: ["wm.Panel", {height: "100%", width: "100%", padding: "10"}, {}, {
					panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, margin: "0,0,5,0", height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "left"}, {}, {
						wavemakerFolderEditor: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "WaveMaker Folder", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						demoFolderEditor: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "Demos Folder", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
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
