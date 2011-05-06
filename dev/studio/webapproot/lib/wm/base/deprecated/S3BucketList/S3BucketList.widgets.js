/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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