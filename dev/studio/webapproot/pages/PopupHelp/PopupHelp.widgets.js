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
PopupHelp.widgets = {
	layoutBox: ["wm.Layout", {box: "v", flex: 1, height: "", width: ""}, {}, {
	      labelBody: ["wm.Label", {caption: "Loading...", height: "100%", width: "100%", scrollY: true, singleLine: false}, {}, {}],
	    buttonPanel: ["wm.Panel", {_classes: {domNode: ["wmDialogFooter"]}, border: 0, width: "100%", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
			      /*
		    moreButton: ["wm.Button", {caption: "More...", width: "70px"}, {onclick: "moreButtonClick"}],
		    examplesButton: ["wm.Button", {caption: "Examples...", width: "85px"}, {onclick: "examplesButtonClick"}],
			      */
		    closeButton: ["wm.Button", {caption: "Close", width: "70px"}, {onclick: "cancelButtonClick"}]
	      }]
	}]
}
