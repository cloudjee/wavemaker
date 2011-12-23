/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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