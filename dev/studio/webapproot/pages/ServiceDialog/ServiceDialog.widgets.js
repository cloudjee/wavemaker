/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
ServiceDialog.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
		panel7: ["wm.Panel", {border: 0, box: "h", height: "30px", width: ""}, {}, {	
			label: ["wm.Label", {caption: "Configure Service Call:", height: "", width: "150px"}, {}, {}],
			panel7: ["wm.Panel", {border: 0, box: "v", height: "", width: "300px"}, {}, {	
				spacer2: ["wm.Spacer", { height: "4px", width: ""}, {}, {}],
				nameInput: ["wm.Input", {height: "20px", width: "300px"}, {onblur: "nameInputBlur"}, {}]
			}]
		}],
		bevel: ["wm.Bevel", {}, {}, {}],
		panel: ["wm.Panel", {border: 0, box: "v", height: "84px", width: ""}, {}, {
			panel5: ["wm.Panel", {border: 0, box: "h", height: "26px", width: ""}, {}, {
				label2: ["wm.Label", {caption: "Service:", height: "", width: "80px"}, {}, {}],
				servicesSelect: ["wm.Select", {flex: 1, height: "", width: ""}, {onchange: "servicesSelectChange"}, {}]
			}],
			panel6: ["wm.Panel", {border: 0, box: "h", height: "25px", width: ""}, {}, {
				label3: ["wm.Label", {caption: "Operation:", height: "", width: "80px"}, {}, {}],
				operationSelect: ["wm.Select", {flex: 1, height: "", width: ""}, {onchange: "operationSelectChange"}, {}]
			}],
			panel9: ["wm.Panel", {border: 0, box: "h", height: "18px", width: ""}, {}, {
				hintLabel: ["wm.Label", {flex: 1, height: "", width: ""}, {}, {}]
			}]
		}],
		bevel1: ["wm.Bevel", {}, {}, {}],
		pageContainer: ["wm.PageContainer", {pageName: "Binder", size: 1, sizeUnits: "flex"}, {}, {}],
		bevel2: ["wm.Bevel", {}, {}, {}],
		panel1: ["wm.Panel", {border: 0, box: "h", height: "30px", width: ""}, {}, {
			spacer: ["wm.Spacer", {flex: 1, height: "", width: ""}, {}, {}],
			closeButton: ["wm.Button", {caption: "Close", height: "", width: "113px"}, {onclick: "closeButtonClick"}, {}]
		}]
	}]
}