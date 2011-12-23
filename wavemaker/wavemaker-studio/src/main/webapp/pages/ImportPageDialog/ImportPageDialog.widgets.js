/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
 
ImportPageDialog.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
		panelouter: ["wm.Panel", {height: "100%", width: "100%"}, {}, {
			titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right"}, {}, {
				dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "Copy Page", border: "0", width: "100%"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panelcopy: ["wm.Panel", {height: "100%", width: "100%", padding: "5"}, {}, {
				label2: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "Copy page from project:", border: "0", margin: "0,5", padding: "0,4", height: "24px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "100%", width: "100%", margin: "0,5,5,5"}, {}, {
					projectList: ["wm.List", {_classes: {domNode: ["wm_BackgroundColor_White", "wm_FontColor_Black"]}, height: "100%", border: "0", width: "100%", scrollY: true}, {onselect: "projectListSelect"}]
				}],
				label3: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "Page to copy:", border: "0", margin: "0,5", padding: "0,4", height: "24px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "100%", width: "100%", margin: "0,5,5,5"}, {}, {
					panesList: ["wm.List", {_classes: {domNode: ["wm_BackgroundColor_White", "wm_FontColor_Black"]}, height: "100%", border: "0", width: "100%", scrollY: true}, {onselect: "panesListSelect"}]
				}],
				panel3: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "40px", verticalAlign: "middle", margin: "5"}, {}, {
					destPageName: ["wm.Editor", {height: "22px", caption: "Local page name", captionSize: "200px"}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}]
				}]
			}],
			panel4: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
				copyButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "70px", padding: "0"}, {onclick: "copyButtonClick"}],
				spacer1: ["wm.Spacer", {width: "4px"}, {}],
				cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "70px", padding: "0"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}