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
CreateLiveView.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		dialogPanel: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				titleBar: ["wm.Panel", {border: "0,0,1,0", borderColor: "#363b44", height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_FontColor_White"]}, height: "100%", width: "100%", caption: "New LiveView", padding: "4"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				mainPanel: ["wm.Panel", {border: "0", padding: "5", horizontalAlign: "center", height: "100%", width: "100%"}, {}, {
					serviceSelectEditor: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "40%", caption: "Service", height: "24px", width: "100%", display: "Select"}, {onchange: "updateDataTypeList"}, {
						editor: ["wm._SelectEditor", {}, {}]
					}],
					panel1: ["wm.Panel", {border: "0", padding: "4", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
						dataTypeLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Right", "wm_FontColor_White"]}, height: "100%", width: "40%", caption: "Data Type", border: "", padding: "0,8,8,8", singleLine: false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						dataTypeList: ["wm.List", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, headerVisible: false, dataFields: "caption", width: "100%", height: "100%"}, {onselect: "dataTypeListSelect", onformat: "dataTypeListFormat"}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", horizontalAlign: "right", height: "32px", layoutKind: "left-to-right", border: "1,0,0,0", borderColor: "#363b44"}, {}, {
					okButton: ["wm.Button", {caption: "OK", disabled: true, width: "64px", height: "100%"}, {onclick: "okButtonClick"}],
					cancelButton: ["wm.Button", {caption: "Cancel", width: "64px", height: "100%"}, {onclick: "cancelButtonClick"}]
				}]
			}]
		}]
	}]
}