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
 
PopupHelp.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
	      labelBody: ["wm.Label", {caption: "Loading...", height: "100%", width: "100%", scrollY: true, singleLine: false}, {}, {}],
	    buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, border: 0, width: "100%", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			      /*
		    moreButton: ["wm.Button", {caption: "More...", width: "70px"}, {onclick: "moreButtonClick"}],
		    examplesButton: ["wm.Button", {caption: "Examples...", width: "85px"}, {onclick: "examplesButtonClick"}],
			      */
		    closeButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", width: "70px"}, {onclick: "cancelButtonClick"}]
	      }]
	}]
}
