/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
				copyButton: ["wm.Button", {caption: "OK", width: "70px", padding: "0"}, {onclick: "copyButtonClick"}],
				spacer1: ["wm.Spacer", {width: "4px"}, {}],
				cancelButton: ["wm.Button", {caption: "Cancel", width: "70px", padding: "0"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}