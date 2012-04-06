/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
 
DataRelationshipsDialog.widgets = {
	layoutBox1: ["wm.Layout", {box: "v", size: 1, sizeUnits: "flex", _classes: {domNode: [
		"wm_BackgroundColor_VeryLightGray"]}}, {}, {
		titleLabel: ["wm.Label", {_classes: {domNode: [
			"wm_TextAlign_Center", 
		"wm_BackgroundChromeBar_LightGray", 
		"wm_FontSize_150percent", 
		"wm_TextDecoration_Bold", 
		"wm_Padding_6px"]}, caption: "Setup Editors For Related Objects"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		infoLabel: ["wm.Label", {_classes: {domNode: [
			"wm_Padding_10px"]}, size: 40, height: "40px"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		chooseRbEditor: ["wm.Editor", {display: "RadioButton", displayValue: "select", caption: "Show a select editor for the related object.", captionSize: 475, captionUnits: "px", captionAlign: "left", captionPosition: "right", height: "20px"}, {}, {
			editor: ["wm._RadioButtonEditor", {radioGroup: "_roe", startChecked: true}, {}]
		}],
		modifyRbEditor: ["wm.Editor", {display: "RadioButton", displayValue: "fields", caption: "Show editors for fields in the related object.", captionSize: 475, captionUnits: "px", captionAlign: "left", captionPosition: "right", height: "20px"}, {}, {
			editor: ["wm._RadioButtonEditor", {radioGroup: "_roe"}, {}]
		}],
		/*noneRbEditor: ["wm.Editor", {display: "RadioButton", displayValue: "ignore", caption: "Do not edit or display this related object.", captionSize: 475, captionUnits: "px", captionAlign: "left", captionPosition: "right", height: "20px"}, {}, {
			editor: ["wm._RadioButtonEditor", {radioGroup: "_roe"}, {}]
		}],*/
		panel1: ["wm.Panel", {border: 0, _classes: {domNode: [
			"wm_Padding_6px"]}, box: "h", size: 26, layoutAlign: "bottomRight", height: "26px"}, {}, {
			okBtn: ["wm.Button", {caption: "OK"}, {onclick: "okBtnClick"}],
			spacer1: ["wm.Spacer", {width: "8px"}, {}],
			cancelBtn: ["wm.Button", {caption: "Cancel"}, {onclick: "cancelBtnClick"}]
		}]
	}]
}