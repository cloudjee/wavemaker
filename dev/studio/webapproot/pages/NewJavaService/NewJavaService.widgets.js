/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
NewJavaService.widgets = {
	layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
		dialog: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			dialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				panel: ["wm.Panel", {border: "0", height: "100%", width: "100%", verticalAlign: "center", padding: "10"}, {}, {
					panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, border: "0", height: "100%", width: "100%", verticalAlign: "center", padding: "10"}, {}, {
					    newJavaServiceIdInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "150px", caption: "Service Name"}, {onEnterKeyPress: "okButtonClick"}, {
						}],
						newJavaClassNameInput: ["wm.Text", {_classes: {captionNode: ["wm_FontColor_White"]}, captionSize: "150px", caption: "Package and Class Name"}, {onEnterKeyPress: "okButtonClick"}, {
						}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
					okButton: ["wm.Button", {caption: "OK", width: "96px", margin: "4"}, {onclick: "okButtonClick"}],
					spacer4: ["wm.Spacer", {width: "10px"}, {}],
					cancelButton: ["wm.Button", {caption: "Cancel", width: "96px", margin: "4"}, {onclick: "cancelButtonClick"}]
				}]
			}]
		}]
	}]
}