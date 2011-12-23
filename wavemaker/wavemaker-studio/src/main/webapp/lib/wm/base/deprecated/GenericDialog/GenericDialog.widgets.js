/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
 

GenericDialog.widgets = {
    layoutBox1: ["wm.Layout", {layoutKind: "top-to-bottom", width: "100%", height: "100%", _classes: ["wm-darksnazzy"]}, {}, {
	dialog: ["wm.Panel", {layoutKind: "top-to-bottom",  width: "100%", height: "100%"}, {}, {
	    titleBar: ["wm.Panel", {layoutKind: "left-to-right", height: "29px"}, {}, {
		dialogLabel: ["wm.Label", {_classes: {domNode: [
					    "wm_TextDecoration_Bold", 
					    "wm_TextAlign_Center", 
					    "wm_Padding_4px", 
					    "wm_FontColor_White"]}, caption: "",  width: "100%", height: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					    }]
	    }],
	    panel: ["wm.Panel", {_classes: ["wm_Padding_16px"], layoutKind: "top-to-bottom",  width: "100%", height: "100%", horizontalAlign: "center"}, {}, {
		userQuestionLabel: ["wm.Label", {"height":"100%","width":"100%","singleLine":false}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		textInput: ["wm.TextEditor", {"width":"100%","captionSize":"0%","showing":false}, {}, {
			editor: ["wm._TextEditor", {}, {}]
		}],
		footer: ["wm.Panel", {layoutKind: "left-to-right",  padding: "2px 0px 2px 0px", horizontalAlign: "right", height: "34px", width: "100%"}, {}, {
			button1: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button1Click"}],
			button2: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button2Click"}],
			button3: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button3Click"}],
			button4: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button4Click"}],
			button5: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button5Click"}],
			button6: ["wm.Button", {"height":"100%","width":"150px","showing":false}, {"onclick":"button6Click"}]
		}]
	}]
	}]
    }]
}
