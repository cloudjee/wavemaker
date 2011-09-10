/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
NewJavaService.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
		dialog: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				panel: ["wm.Panel", {border: "0", height: "100%", width: "100%", verticalAlign: "center", padding: "10"}, {}, {
					panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", width: "100%", verticalAlign: "center", padding: "10"}, {}, {
					    newJavaServiceIdInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "150px", caption: "Service Name"}, {onEnterKeyPress: "okButtonClick"}, {
						}],
						newJavaClassNameInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "150px", caption: "Package and Class Name"}, {onEnterKeyPress: "okButtonClick"}, {
						}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "96px", margin: "4"}, {onclick: "okButtonClick"}],
					spacer4: ["wm.Spacer", {width: "10px"}, {}],
					cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "96px", margin: "4"}, {onclick: "cancelButtonClick"}]
				}]
			}]
		}]
	}]
}