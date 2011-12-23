/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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