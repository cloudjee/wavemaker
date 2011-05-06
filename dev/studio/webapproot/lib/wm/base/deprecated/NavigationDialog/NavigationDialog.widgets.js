/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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