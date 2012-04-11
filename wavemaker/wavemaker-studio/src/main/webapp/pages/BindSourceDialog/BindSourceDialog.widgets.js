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
 
BindSourceDialog.widgets = {
	layoutBox: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, padding: "2", height: "100%", width: "100%"}, {}, {
		bindPanel1: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
			binderSource: ["wm.BinderSource", {border: 0, margin: 0, layoutKind: "top-to-bottom" , height: "100%", width: "100%"}, {onBindNodeSelected: "bindNodeSelected"}, {}],
			bindPanel: ["wm.Panel", {border: 0, width: "100%", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			        bindTargetTypeLabel: ["wm.Label", {width: "100%", border: "0",height: "22px"}, {}, {
				   format: ["wm.DataFormatter", {}, {}]
				}],
			    clearButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Clear", width: "70px"}, {onclick: "clearButtonClick"}],
			    applyButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Bind", width: "70px"}, {onclick: "applyButtonClick"}],
			    doneButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Done", width: "70px"}, {onclick: "cancelButtonClick"}],
		    cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "70px"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}
