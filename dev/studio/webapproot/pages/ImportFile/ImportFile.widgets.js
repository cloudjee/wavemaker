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

ImportFile.widgets = {
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
	        spacer: ["wm.Spacer", {height: "10px", width: "100%"}],
		fileUploader: ["wm.FileUpload", {  caption: "",
						   uploadButtonCaption: "Import",
						   padding: "0,20,0,20",
						   width: "500px",
						   height: "28px",
						   captionSize: "100px",						   
						   captionAlign: "left",
						   captionPosition: "left",
						   uploadButtonPosition: "right",
						   uploadButtonWidth: "100px",
						   uploadButtonHeight: "30px",
						   service: "",
						   operation: ""}, 
                                                {  onUploadSuccess: "importClickCallback",
						   onUploadError: "importClickError",
						   onBegin:       "startImportClick"}, {}]
	    }],
	    footer: ["wm.Panel", {layoutKind: "left-to-right",  horizontalAlign: "right", verticalAligh: "bottom", height: "26px", width: "100%"}, {}, {
		cancelButton: ["wm.Button", {caption: "Cancel", width: "100px", height: "100%"}, {onclick: "cancelButtonClick"}]
	    }]
	}]
    }]
}
