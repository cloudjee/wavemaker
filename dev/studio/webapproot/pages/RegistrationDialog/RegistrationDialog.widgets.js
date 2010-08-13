/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
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