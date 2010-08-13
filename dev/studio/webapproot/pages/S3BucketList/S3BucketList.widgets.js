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

S3BucketList.widgets = {
	bucketNames: ["wm.Variable", {type: "EntryData"}, {}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		spacer1: ["wm.Spacer", {height: "24px", width: "96px"}, {}],
		bucketList: ["wm.SelectEditor", {caption: "Available Buckets", captionSize: "20%", width: "700px"}, {onchange: "bucketListChange"}, {
			editor: ["wm._SelectEditor", {displayField: "name", dataField: "dataValue"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {targetProperty: "dataSet", source: "bucketNames"}, {}]
				}]
			}]
		}],
		spacer5: ["wm.Spacer", {height: "10px", width: "96px"}, {}],
		panel1: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "left", width: "100%", height: "41px", verticalAlign: "top"}, {}, {
			spacer2: ["wm.Spacer", {height: "28px", width: "120px"}, {}],
			copyWarButton: ["wm.Button", {_classes: {domNode: ["wm_BackgroundChromeBar_Blue"]}, caption: "Upload WAR File", width: "100px", height: "30px"}, {onclick: "copyWarButtonClick"}],
			spacer6: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			deleteWarButton: ["wm.Button", {_classes: {domNode: ["wm_BackgroundChromeBar_Blue"]}, caption: "Delete WAR File", width: "100px", height: "30px"}, {onclick: "deleteWarButtonClick"}],
			spacer7: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			newButton: ["wm.Button", {_classes: {domNode: ["wm_BackgroundChromeBar_Blue"]}, caption: "New Bucket", width: "100px", height: "30px"}, {onclick: "newButtonClick"}],
			spacer4: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			deleteButton: ["wm.Button", {_classes: {domNode: ["wm_BackgroundChromeBar_Blue"]}, caption: "Delete Bucket", width: "100px", height: "30px"}, {onclick: "deleteButtonClick"}],
			spacer3: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			cancelButton: ["wm.Button", {_classes: {domNode: ["wm_BackgroundChromeBar_Blue"]}, caption: "Cancel", width: "100px", height: "30px"}, {onclick: "cancelButtonClick"}]
		}]
	}]
}