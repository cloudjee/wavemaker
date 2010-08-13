/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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
