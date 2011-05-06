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
 
RegistrationDialog.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
	    dialog: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
		    dialogInner: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}, {
				titleBar: ["wm.Panel", {layoutKind: "left-to-right", width: "100%", height: "29px"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: [
			"wm_TextDecoration_Bold", 
			"wm_TextAlign_Center", 
			"wm_Padding_4px", 
			"wm_FontColor_White"]}, caption: "Product Registration", width: "100%", height: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				mainPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "100%", height: "100%", horizontalAlign: "center"}, {}, {
				    messageIFrame: ["wm.IFrame", {source: "http://www.wavemaker.com/community/regmsg.html", width: "100%", height: "100%"}, {}]
				}],
				footer: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "right", verticalAlignment: "right", height: "26px", width: "100%"}, {}, {
				    registerButton: ["wm.Button", {caption: "Register Now", width: "100px", height: "26px"}, {onclick: "registerButtonClick"}],
				    spacer4: ["wm.Spacer", {width: "10px", width: "100px", height: "26px"}, {}],
				    skipButton: ["wm.Button", {caption: "Skip", width: "100px", height: "26px"}, {onclick: "skipButtonClick"}],
				    spacer5: ["wm.Spacer", {width: "10px"}, {}],
				    laterButton: ["wm.Button", {caption: "Later", width: "100px", height: "26px"}, {onclick: "laterButtonClick"}]
				}]
			}]
		}]
	}]
}