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
NavigationDialog.widgets = {
	layoutBox: ["wm.Layout", {box: "v", size: 1, sizeUnits: "flex", _classes: ["wm-darksnazzy"]}, {}, {
		label: ["wm.Label", {caption: "Configure Navigation", autoSize: true, _classes: ["wmDialogTitleBar"]}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		panel2: ["wm.Panel", {border: 0, box: "v", size: "234", _classes: ["wm_Padding_6px"], height: "234px"}, {}, {
			label1: ["wm.Label", {caption: "What", autoSize: true}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel3: ["wm.Panel", {border: 0, box: "h", size: "26", height: "26px"}, {}, {
				layerRb: ["wm.Editor", {display: "RadioButton", size: 18, displayValue: "layer", captionPosition: "right", width: "18px"}, {onchange: "layerRbChange"}, {
					editor: ["wm._RadioButtonEditor", {radioGroup: "navEditorRb"}, {}]
				}],
				layerSelect: ["wm.Editor", {display: "Select", size: 1, caption: "Layer:", captionSize: 40, captionUnits: "px", captionAlign: "left", sizeUnits: "flex"}, {}, {
					editor: ["wm._SelectEditor", {}, {}]
				}]
			}],
			spacer1: ["wm.Spacer", {size: "8", height: "8px"}, {}],
			panel4: ["wm.Panel", {border: 0, box: "h", size: "26", height: "26px"}, {}, {
				pageRb: ["wm.Editor", {display: "RadioButton", size: 18, displayValue: "page", captionPosition: "right", width: "18px"}, {onchange: "pageRbChange"}, {
					editor: ["wm._RadioButtonEditor", {radioGroup: "navEditorRb"}, {}]
				}],
				pageSelect: ["wm.Editor", {display: "Select", size: 1, caption: "Page:", captionSize: 40, captionUnits: "px", captionAlign: "left", sizeUnits: "flex"}, {}, {
					editor: ["wm._SelectEditor", {}, {}]
				}]
			}],
			panel5: ["wm.Panel", {border: 0, box: "h", size: 1, sizeUnits: "flex"}, {}, {
				spacer2: ["wm.Spacer", {size: "76", width: "76px"}, {}],
				wherePanel: ["wm.Panel", {border: 0, box: "v", size: 1, sizeUnits: "flex"}, {}, {
					label2: ["wm.Label", {caption: "Where", autoSize: true, _classes: ["wm_FontSize_100percent", "wm_TextDecoration_Bold"]}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel7: ["wm.Panel", {border: 0, box: "h", size: 1, sizeUnits: "flex"}, {}, {
						pageContainerList: ["wm.List", {sizeUnits: "flex", size: 1}, {}]
					}]
				}]
			}]
		}],
		panel1: ["wm.Panel", {border: 0, box: "h", _classes: ["wmDialogFooter"], height: "30px"}, {}, {
			spacer: ["wm.Spacer", {size: 1, sizeUnits: "flex"}, {}],
			saveButton: ["wm.Button", {caption: "Save"}, {onclick: "saveButtonClick"}],
			spacer4: ["wm.Spacer", {size: 8, width: "8px"}, {}],
			cancelButton: ["wm.Button", {caption: "Cancel"}, {onclick: "cancelButtonClick"}]
		}]
	}]
}