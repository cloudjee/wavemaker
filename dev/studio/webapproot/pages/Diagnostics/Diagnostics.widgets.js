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

Diagnostics.widgets = {
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
		bevel1: ["wm.Bevel", {width: "100%", height: "4px"}, {}],
		panel1: ["wm.Panel", {_classes: {domNode: ["wm_Padding_4px"]}, height: "30px", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {caption: "Refresh", width: "80px"}, {onclick: "update"}]
		}],
		label1: ["wm.Label", {_classes: {domNode: ["wmToolbar", "wm_TextDecoration_Bold", "wm_FontSize_150percent", "wm_BackgroundChromeBar_LightGray"]}, padding: "10", height: "24px", caption: "Wires"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		wiresPanel: ["wm.Label", {padding: "6", width: "100%", height: "100%", singleLine: false, scrollY: true}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}]
}