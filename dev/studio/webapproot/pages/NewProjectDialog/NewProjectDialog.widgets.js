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
 

NewProjectDialog.widgets = {
    themesListVar: ["wm.Variable", {type: "StringData"}],
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
        mainPanel: ["wm.Panel", {_classes: {domNode: ["dialogcontainer"]},layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", padding: "15", border: "10", borderColor: "#313743", backgroundColor: "#848c99"},{}, {
            projectName: ["wm.Text", {width: "100%", height: "24px", captionSize: "90px", caption: "Project Name", displayValue: "Project", regExp: '^[a-zA-Z][\\w\\d]+$', invalidMessage: "Only letters/numbers.  Must start with letter", tooltipDisplayTime: "6000"}, {"onEnterKeyPress":"onOkClick"}],
            themeName: ["wm.SelectMenu", {width: "100%", height: "24px",  captionSize: "90px", caption: "Theme", displayField: "dataValue", dataField: "dataValue" }, {"onEnterKeyPress":"onOkClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"themesListVar"}, {}]
		}]
            }],
            templatesPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top", autoScroll: true},{}, {
                templatesPanelLabel: ["wm.Label", {width: "90px", height: "100%", caption: "Templates"}],
                templatesInsertPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", border: "1", borderColor: "#333333"}]
            }]
        }],
            buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, width: "100%", height: "35px", layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top"},{}, {
                CancelButton: ["wm.Button", {caption: "Cancel", width: "100px", height: "100%"}, {onclick: "onCancelClick"}],
                OKButton: ["wm.Button", {caption: "OK", width: "100px", height: "100%"}, {onclick: "onOkClick"}]
        }]
}]
}
