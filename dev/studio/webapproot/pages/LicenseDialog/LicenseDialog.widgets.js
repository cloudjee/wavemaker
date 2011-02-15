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

	    panelouter: ["wm.Panel", {layoutKind: "left-to-right", height: "320px", width: "100%", verticalAlign: "top", margin: "10"}, {}, {
		logoPanel: ["wm.Panel", {layoutKind: "top-to-bottom", width: "324px", height: "100%", backgroundColor: "white", border: "2", borderColor: "black", verticalAlign: "top", horizontalAlign: "left"},{},{
		    logoLabel: ["wm.Label", {caption: "WaveMaker", height: "100%", width: "100%"}],
		    logo: ["wm.Picture", {width: "320px", height: "248px", source: "/wavemaker/images/wm-logo-fancy.png"}]
		}],
		panelInner: ["wm.Panel", {layoutKind: "top-to-bottom", height: "100%", width: "100%", horizontalAlign: "center", verticalAlign: "top", margin: "10,10,0,10"}, {}, {
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
		    toGetLabel: ["wm.Label", {width: "100%", height: "30px", margin: "10,5,0,5", caption: "If you don't have a license file yet (trial or full license), contact sales"}],
		    requestLicenseButton: ["wm.Button", {width: "200px", caption: "Contact Sales"}, {onclick: "trialClick"}],
/*
		    trialButton: ["wm.Button", {width: "200px", caption: "Request Trial License"}, {onclick: "trialClick"}],
		    buyButton: ["wm.Button", {width: "200px", caption: "Purchase License"}, {onclick: "buyClick"}],
		    */
		    closeButton: ["wm.Button", {width: "200px", caption: "Cancel", showing: false}, {onclick: "dismiss"}],
		    resultPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", padding: "10,5,10,5", margin: "10,0,0,0"}, {}, {
			resultLabel: ["wm.Label", {width: "100%", height: "100%", caption: "", singleLine: false, align: "center"}]
		    }]
		}]
	    }],
	    macidLabel: ["wm.Label", {width: "100%", height: "24px", caption: ""}]
	}]
}