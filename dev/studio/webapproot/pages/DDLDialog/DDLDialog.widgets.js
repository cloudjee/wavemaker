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
DDLDialog.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		label1: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px"]}, height: "48px", border: "0"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		panel4: ["wm.Panel", {width: "100%", height: "100%", borderColor: ""}, {}, {
			ddlEditor: ["wm.TextArea", {readonly: true, height: "100%", readOnly: true, border: "0", width: "100%", borderColor: "", scrollY: true}, {}]
		}],
		footer: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "26px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			okButton: ["wm.Button", {caption: "OK", width: "96px", border: "0"}, {onclick: "onOk"}],
			spacer4: ["wm.Spacer", {width: "10px"}, {}],
			cancelButton: ["wm.Button", {caption: "Cancel", width: "96px", border: "0"}, {onclick: "onCancel"}]
		}]
	}]
}