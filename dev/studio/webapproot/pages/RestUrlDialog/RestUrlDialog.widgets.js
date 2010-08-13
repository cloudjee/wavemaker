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
RestUrlDialog.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%"}, {}, {
		dialog: ["wm.Panel", {border: "0", height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				titleBar: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "REST Service Call", height: "100%", border: "0", width: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				mainPanel: ["wm.Panel", {border: "0", height: "100%", width: "100%", padding: "10,0"}, {}, {
					spacer5: ["wm.Spacer", {height: "10px"}, {}],
					panel1: ["wm.Panel", {border: "0", height: "24px", layoutKind: "left-to-right"}, {}, {
						spacer2: ["wm.Spacer", {height: "100%", width: "100%"}, {}],
						urlInput: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "URL", captionSize: "50px", width: "600px", layoutKind: "left-to-right"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						spacer3: ["wm.Spacer", {height: "100%", width: "100%"}, {}]
					}],
					spacer6: ["wm.Spacer", {height: "10px"}, {}],
					responseTextArea: ["wm.Editor", {width: "100%", layoutKind: "left-to-right", padding: "0", height: "100%", singleLine: false, display: "TextArea"}, {}, {
						editor: ["wm._TextAreaEditor", {}, {}]
					}],
					errorMessageTextArea: ["wm.Editor", {width: "96px", layoutKind: "left-to-right", padding: "0", height: "100px", singleLine: false, display: "TextArea", showing: false}, {}, {
						editor: ["wm._TextAreaEditor", {}, {}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "26px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					testBtn: ["wm.Button", {caption: "Test", border: "0", margin: "4", width: "96px"}, {onclick: "testBtnClick"}],
					spacer1: ["wm.Spacer", {width: "10px"}, {}],
					populateBtn: ["wm.Button", {caption: "Populate", border: "0", margin: "4", width: "96px"}, {onclick: "populateBtnClick"}],
					spacer4: ["wm.Spacer", {width: "10px"}, {}],
					cancelBtn: ["wm.Button", {caption: "Back", border: "0", margin: "4", width: "96px"}, {onclick: "cancelBtnClick"}]
				}]
			}]
		}]
	}]
}