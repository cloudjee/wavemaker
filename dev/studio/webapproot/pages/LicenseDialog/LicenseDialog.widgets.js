/*
 * Copyright (C) 2009-2010 WaveMaker Software, Inc.
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
LicenseDialog.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%", layoutKind: "top-to-bottom"}, {}, {
	    titleBar: ["wm.Panel", {height: "29px", layoutKind: "left-to-right"}, {}, {
		dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "Studio Licensing", border: "0", width: "100%"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}]
	    }],

	    panelouter: ["wm.Panel", {height: "100%", width: "100%", horizontalAlign: "center", verticalAlign: "top", margin: "10"}, {}, {
		label2: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "You are running an unlicensed version of studio; please upload your license.  Note: Connection to the internet may be required for this to work:", border: "0", margin: "0,5", padding: "0,4", height: "48px", width: "100%", singleLine: false}],
		licenseUploader: ["wm.DojoFileUpload",   {_classes: {domNode: ["studioButton"]},
							  width: "200px",
							      height: "32px",
							      margin: "2",
							      useList: false,
							      buttonCaption: "Select License File",
							      service: "licensingService",
							      operation: "uploadLicense"},
				      {onSuccess: "onSuccess", onError: "onError"}],
		toGetLabel: ["wm.Label", {width: "100%", height: "30px", margin: "10,5,0,5", caption: "If you don't have a license file yet, here are two ways to get a license"}],
		trialButton: ["wm.Button", {width: "200px", caption: "Request Trial License"}, {onclick: "trialClick"}],
		    buyButton: ["wm.Button", {width: "200px", caption: "Purchase License"}, {onclick: "buyClick"}],
		    resultPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			resultLabel: ["wm.Label", {width: "100%", height: "100%", caption: "", singleLine: false}]
		    }],
		buttonPanel: ["wm.Panel", {width: "100%", height: "40px", layoutKind: "left-to-right"}, {}, {
		    closeButton: ["wm.Button", {width: "200px", caption: "Cancel", showing: false}, {onclick: "dismiss"}]
		}]
	    }]
	}]
}