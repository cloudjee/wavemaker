/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

NewLivePanelDialog.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
            templatesPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", autoScroll: true},{}, {
                templatesPanelLabel: ["wm.Label", {width: "100%", height: "24px", caption: "Select how you want your data to look"}],
                templatesInsertPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", border: "1", borderColor: "#333333"}]
            }]
        }],
            buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, width: "100%", height: "35px", layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top"},{}, {
                CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "100px", height: "100%"}, {onclick: "onCancelClick"}],
                OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "100px", height: "100%"}, {onclick: "_onOkClick"}]
        }]
}]
}
