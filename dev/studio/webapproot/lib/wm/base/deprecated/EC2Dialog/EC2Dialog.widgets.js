/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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

EC2Dialog.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		spacer4: ["wm.Spacer", {height: "24px", width: "369px"}, {}],
		accessKeyId: ["wm.TextEditor", {width: "350px", caption: "Access Key Id", height: "25px"}, {}, {
			editor: ["wm._TextEditor", {}, {}]
		}],
		spacer1: ["wm.Spacer", {height: "5px", width: "250px"}, {}],
		secretAccessKey: ["wm.TextEditor", {width: "350px", caption: "Secret Access Key", height: "25px"}, {}, {
			editor: ["wm._TextEditor", {}, {}]
		}],
		spacer6: ["wm.Spacer", {height: "10px", width: "96px"}, {}],
		panel1: ["wm.Panel", {_classes: {domNode: ["wm_Padding_16px"]}, layoutKind: "left-to-right", horizontalAlign: "left", width: "100%", height: "38px", verticalAlign: "top"}, {}, {
			spacer3: ["wm.Spacer", {height: "20px", width: "132px"}, {}],
			okButton: ["wm.Button", {_classes: {domNode: ["wm_FontColor_Blue", "wm_FontColor_Black", "wm_BackgroundChromeBar_Blue"]}, caption: "OK", width: "60px", height: "30px"}, {onclick: "okButtonClick"}],
			spacer2: ["wm.Spacer", {height: "20px", width: "14px"}, {}],
			cancelButton: ["wm.Button", {_classes: {domNode: ["wm_FontColor_Blue", "wm_FontColor_Black", "wm_BackgroundChromeBar_Blue"]}, caption: "Cancel", width: "60px", height: "30px"}, {onclick: "cancelButtonClick"}]
		}]
	}]
}