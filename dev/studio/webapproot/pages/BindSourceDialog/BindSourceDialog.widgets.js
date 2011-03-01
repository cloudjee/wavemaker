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
BindSourceDialog.widgets = {
	layoutBox: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, padding: "2", height: "100%", width: "100%"}, {}, {
		bindPanel1: ["wm.Panel", {border: "0", width: "100%", height: "100%"}, {}, {
			binderSource: ["wm.BinderSource", {border: 0, margin: 0, layoutKind: "top-to-bottom" , height: "100%", width: "100%"}, {onBindNodeSelected: "bindNodeSelected"}, {}],
			bindPanel: ["wm.Panel", {border: 0, width: "100%", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			        bindTargetTypeLabel: ["wm.Label", {width: "100%", border: "0",height: "22px"}, {}, {
				   format: ["wm.DataFormatter", {}, {}]
				}],
				applyStayButton: ["wm.Button", {caption: "Apply", width: "70px"}, {onclick: "applyStayButtonClick"}],
				applyButton: ["wm.Button", {caption: "Bind", width: "70px"}, {onclick: "applyButtonClick"}],
				cancelButton: ["wm.Button", {caption: "Cancel", width: "70px"}, {onclick: "cancelButtonClick"}]
			}]
		}]
	}]
}
