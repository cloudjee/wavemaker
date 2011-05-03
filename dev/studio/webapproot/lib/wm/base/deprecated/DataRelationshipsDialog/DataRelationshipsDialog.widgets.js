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