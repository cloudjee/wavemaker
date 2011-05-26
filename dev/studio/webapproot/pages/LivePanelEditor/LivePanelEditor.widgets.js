/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
LivePanelEditor.widgets = {
	smallToolbarImageList: ["wm.ImageList", {width: 16, height: 16, colCount: 32, url: "images/smallToolbarBtns.png"}, {}],
	liveVariable: ["wm.LiveVariable", {autoUpdate: false, startUpdate: false}, {onSuccess: "updateSuccess"}],
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", imageList: "smallToolbarImageList"}, {}, {
		managerToolbar: ["wm.Panel", {border: "0", padding: "0,4", height: "29px", layoutKind: "left-to-right"}, {}, {
			toolbarBtnHolder: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
				saveLiveViewBtn: ["wm.ToolButton", {imageIndex: 8, width: "24px", height: "100%", border: "", margin: "", hint: "Save LiveView"}, {onclick: "saveLiveViewBtnClick"}],
				toolbarspacer1: ["wm.Spacer", {height: "24px", width: "12px", margin: "0,5"}, {}],
				newLiveViewBtn: ["wm.ToolButton", {imageIndex: 25, width: "24px", height: "100%", border: "", margin: "", hint: "New LiveView", showing: false}, {onclick: "newLiveViewBtnClick"}],
				delLiveViewBtn: ["wm.ToolButton", {imageIndex: 0, width: "24px", height: "100%", border: "", margin: "", hint: "Delete LiveView"}, {onclick: "delLiveViewBtnClick"}]
			}],
			logoBtmHolder: ["wm.Panel", {border: "0", width: "221px"}, {}]
		}],
		namePanel: ["wm.Panel", {border: "0", height: "28px", padding: "2", width: "100%", layoutKind: "left-to-right"}, {}, {
			nameEdit: ["wm.Editor", {caption: "LiveView Name", captionSize: "150px", layoutKind: "left-to-right", captionAlign: "left", width: "350px", height: "100%"}, {onchange: "nameEditChanged"}, {
			    editor: ["wm._TextEditor", {changeOnKey:true}, {}]
			}]
		}],
		label1: ["wm.Label", {height: "20px", width: "100%", border: "", padding: "4", caption: "Choose fields to include in this LiveView. Fields required for data operations indicated by <span class=\"wmeditor-required\">*</span>.", singleLine: false}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		bevel1: ["wm.Bevel", {border: ""}, {}],
		panel1: ["wm.Panel", {border: "0", height: "100%", width: "100%", layoutKind: "left-to-right"}, {}, {
		    tree1: ["wm.DraggableTree", {height: "100%", width: "100%", border: "", keepInParent:true, dropBetweenNodes: true}, {oninitchildren: "tree1Initchildren", oncheckboxclick: "tree1Checkboxclick", onselect: "tree1Select", ondblclick: "tree1DblClick", onNodeDrop: "onNodeDrop"}]
		}]
	}]
}