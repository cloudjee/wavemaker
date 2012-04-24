/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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
 
ImportPageDialog.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", layoutKind: "top-to-bottom"}, {}, {
            mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
		    label2: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "Copy page from project:", border: "0", margin: "0,5", padding: "0,4", height: "24px"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }],
		    panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "100%", width: "100%", margin: "0,0,5,0"}, {}, {
			projectList: ["wm.List", {_classes: {domNode: ["wm_BackgroundColor_White", "wm_FontColor_Black"]}, height: "100%", border: "0", width: "100%", scrollY: true, noHeader:true}, {onselect: "projectListSelect"}]
		    }],
		    label3: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "Page to copy:", border: "0", margin: "0,5", padding: "0,4", height: "24px"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }],
		    panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "100%", width: "100%", margin: "0,0,5,0"}, {}, {
			panesList: ["wm.List", {_classes: {domNode: ["wm_BackgroundColor_White", "wm_FontColor_Black"]}, height: "100%", border: "0", width: "100%", scrollY: true, noHeader: true}, {onselect: "panesListSelect"}]
		    }],
		panel3: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, height: "40px", width: "100%", verticalAlign: "middle", horizontalAlign: "left", margin: "5"}, {}, {
		    destPageName: ["wm.Text", {height: "22px", width: "400px", caption: "Local page name", captionSize: "150px", captionAlign: "left"}]
		    }]

	    }],
	    panel4: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		copyButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "70px", padding: "0"}, {onclick: "copyButtonClick"}],
		spacer1: ["wm.Spacer", {width: "4px"}, {}],
		cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "70px", padding: "0"}, {onclick: "cancelButtonClick"}]
	    }]
	}]
}