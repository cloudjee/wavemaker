/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
        mainPanel: ["wm.studio.DialogMainPanel", {_classes: {domNode:["StudioDarkPanel"]}, backgroundColor:""},{}, {
            projectName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, emptyValue: "emptyString", selectOnClick: true, width: "100%", height: "24px", captionSize: "90px", caption: "Project Name", displayValue: "Project", regExp: '^[a-zA-Z][\\w\\d]+$', invalidMessage: "Only letters/numbers.  Must start with letter", tooltipDisplayTime: "6000"}, {"onEnterKeyPress":"onOkClick"}],
            themeName: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, emptyValue: "emptyString", width: "100%", height: "24px",  captionSize: "90px", caption: "Theme", displayField: "name", dataField: "dataValue", restrictValues: false }, {"onEnterKeyPress":"onOkClick"}, {
        		binding: ["wm.Binding", {}, {}, {
        		    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"studio.themesListVar"}, {}]
        		}]
            }],
            templatesPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top", autoScroll: true},{}, {
                templatesPanelLabel: ["wm.Label", {_classes: {domNode: ["StudioLabel"]}, styles: {fontWeight:"bold"}, width: "90px", height: "100%", caption: "Template", align: "right"}],
                tabs: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs","StudioTabsInverted", "NoRightMarginOnTab", "TransparentTabBar"]}, width: "100%", height: "100%", clientBorder: "1", clientBorderColor: "#959DAB", margin:"4,10,10,4"},{},{
                    desktopTemplatesInsertLayer: ["wm.Layer", {caption: "Desktop", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", padding: "8"},{},{
                        desktopTemplatesInsertPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom",horizontalAlign: "left", verticalAlign: "top"}]
                    }],
                }]
            }]
        }],
            buttonPanel: ["wm.studio.DialogButtonPanel", {},{}, {
                CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "100px", height: "100%"}, {onclick: "onCancelClick"}],
                OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "100px", height: "100%"}, {onclick: "onOkClick"}]
        }]
}]
}
