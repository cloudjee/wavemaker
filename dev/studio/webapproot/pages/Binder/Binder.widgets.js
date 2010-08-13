/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
Binder.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
		panel: ["wm.Panel", {box: "h", flex: 1, height: "", width: ""}, {}, {
			panel5: ["wm.Panel", {box: "v", height: "", width: "300px"}, {}, {
				targetLabel: ["wm.Label", {autoSize: true, caption: "Bind Targets", height: "", width: ""}, {}, {}],
				targetTree: ["wm.Tree", {flex: 1, height: "", width: ""}, {onselect: "targetTreeSelect", ondeselect: "targetTreeDeselect"}, {}],
				bevel4: ["wm.Bevel", {}, {}, {}],
				bindControlsPanel: ["wm.Panel", {box: "h", height: "27px", width: ""}, {}, {
					clearButton: ["wm.Button", {caption: '<img height="24" width="24" src="images/close_b_24.png"/> Clear', height: "", width: ""}, {onclick: "clearButtonClick"}, {}],
					spacer2: ["wm.Spacer", {height: "", width: "10px"}, {}, {}],
					clearAllButton: ["wm.Button", {caption: '<img height="24" width="24" src="images/close_b_24.png"/> Clear All', height: "", width: ""}, {onclick: "clearAllButtonClick"}, {}]
				}]
			}],
			splitter: ["wm.Splitter", {}, {}, {}],
			panel3: ["wm.Panel", {box: "v", flex: 1, height: "", width: ""}, {}, {
				sourceLabel: ["wm.Label", {autoSize: true, caption: "Bind Sources", height: "", width: ""}, {}, {}],
				sourceBinder: ["wm.BinderSource", {size: 1, sizeUnits: "flex"}, {onBindNodeSelected: "sourceBinderBindNodeSelected"}, {}],
				panel4: ["wm.Panel", {box: "h", height: "35px", boxPosition: "bottomRight"}, {}, {
					bindButton: ["wm.Button", {caption: 'Bind'}, {onclick: "bindButtonClick"}, {}]
				}]
			}]
		}]
	}]
}