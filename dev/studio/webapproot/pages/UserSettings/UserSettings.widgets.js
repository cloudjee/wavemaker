/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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
