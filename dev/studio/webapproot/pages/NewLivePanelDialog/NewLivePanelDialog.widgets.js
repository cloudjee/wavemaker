/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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

NewLivePanelDialog.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
        mainPanel: ["wm.Panel", {_classes: {domNode: ["dialogcontainer"]},layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", padding: "15", border: "10", borderColor: "#313743", backgroundColor: "#848c99"},{}, {

            templatesPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", autoScroll: true},{}, {
                templatesPanelLabel: ["wm.Label", {width: "100%", height: "24px", caption: "Select how you want your data to look"}],
                templatesInsertPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "top-to-bottom", horizontalAlign: "left", verticalAlign: "top", border: "1", borderColor: "#333333"}]
            }]
        }],
            buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, width: "100%", height: "35px", layoutKind: "left-to-right", horizontalAlign: "right", verticalAlign: "top"},{}, {
                CancelButton: ["wm.Button", {caption: "Cancel", width: "100px", height: "100%"}, {onclick: "onCancelClick"}],
                OKButton: ["wm.Button", {caption: "OK", width: "100px", height: "100%"}, {onclick: "_onOkClick"}]
        }]
}]
}
