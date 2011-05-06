/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
SyntaxEditor.widgets = {
	layoutBox1: ["wm.Layout", {backgroundColor: "#424A5A", height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		/*header: ["wm.Label", {height: "37px", width: "100%", border: "0", caption: "Editing"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],*/
		editArea: ["wm.EditArea", {height: "100%", width: "100%", border: "0", margin: "2"}, {}],
		panel1: ["wm.Panel", {height: "34px", width: "100%", border: "0", margin: "2", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
			button1: ["wm.Button", {height: "100%", width: "70px", caption: "OK"}, {onclick: "closeEditor"}],
			button2: ["wm.Button", {height: "100%", width: "70px", caption: "Cancel"}, {onclick: "closeEditor"}]
		}]
	}]
}