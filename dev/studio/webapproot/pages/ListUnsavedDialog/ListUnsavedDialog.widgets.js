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

ListUnsavedDialog.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", backgroundColor: "#848c99" }, {}, {
        mainPanel: ["wm.Panel", {_classes: {domNode: ["dialogcontainer"]},layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top",autoScroll:true, margin: "15", border: "10", borderColor: "#313743"},{}, {

        }],
	buttonPanel: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, layoutKind: "left-to-right", horizontalAlign: "right", width: "100%", height: "32px"},{}, {
	    cancelButton: ["wm.Button", {caption: "Cancel", width: "80px", height: "100%"}, {onclick: "cancelClick"}],
	    doneButton: ["wm.Button", {caption: "Continue", width: "80px", height: "100%"}, {onclick: "doneClick"}],
	    saveAllButton: ["wm.Button", {caption: "Save All", width: "80px", height: "100%"}, {onclick: "saveall"}]
	}]
    }]
}
