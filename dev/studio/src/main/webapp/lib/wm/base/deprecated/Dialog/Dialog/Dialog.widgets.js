/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

Dialog.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
		pages: ["wm.Pages", {pagesType: "Tabs", box: "v", pageIndex: 1, flex: 1, height: "", width: ""}, {}, {
			DataPage: ["wm.Page", {flex: 1, showing: false, title: "Populate From Data", box: "h", height: "", width: ""}, {}, {
				tree: ["wm.Tree", {height: "", width: "92px"}, {}, {}]
			}],
			ServicePage: ["wm.Page", {flex: 1, title: "Populate From Service", box: "h", height: "", width: ""}, {}, {
				panel3: ["wm.Panel", {box: "v", flex: 1, height: "", width: ""}, {}, {}],
				tree1: ["wm.Tree", {height: "", width: "143px"}, {}, {}]
			}]
		}],
		panel1: ["wm.Panel", {box: "v", height: "58px", width: ""}, {}, {
			spacer1: ["wm.Spacer", {height: "15px", width: ""}, {}, {}],
			panel: ["wm.Panel", {box: "h", height: "29px", width: ""}, {}, {
				spacer2: ["wm.Spacer", {flex: 1, height: "", width: ""}, {}, {}],
				button: ["wm.Button", {content: "Cancel", height: "", width: "82px"}, {}, {}],
				spacer: ["wm.Spacer", {height: "", width: "15px"}, {}, {}],
				button1: ["wm.Button", {content: "Apply", height: "", width: "53px"}, {}, {}],
				spacer3: ["wm.Spacer", {height: "", width: "17px"}, {}, {}]
			}]
		}]
	}]
}