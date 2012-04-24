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
 
PreferencesPane.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
            mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
		panel2: ["wm.Panel", {height: "100%", width: "100%", verticalAlign: "middle", horizontalAlign: "left", layoutKind: "top-to-bottom"}, {}, {
		    wavemakerFolderEditor: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "130px", caption: "WaveMaker Folder", width: "100%"}, {onEnterKeyPress: "okButtonClick"}, {}],
		    demoFolderEditor: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "130px", caption: "Demos Folder", width: "100%"}, {onEnterKeyPress: "okButtonClick"}, {
		    }]
		}]
	    }],
	    footer: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		okButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK", width: "70px", padding: "0"}, {onclick: "okButtonClick"}],
		spacer4: ["wm.Spacer", {width: "10px"}, {}],
		cancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel", width: "70px", padding: "0"}, {onclick: "cancelButtonClick"}]
	    }]
	}]
}
