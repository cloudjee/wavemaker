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
SyntaxEditor.widgets = {
	layoutBox1: ["wm.Layout", {backgroundColor: "#424A5A", height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		/*header: ["wm.Label", {height: "37px", width: "100%", border: "0", caption: "Editing"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],*/
		editArea: ["wm.EditArea", {height: "100%", width: "100%", border: "0", margin: "2"}, {}],
		panel1: ["wm.Panel", {height: "34px", width: "100%", border: "0", margin: "2", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
			button1: ["wm.Button", {height: "100%", width: "70px", caption: "OK"}, {onclick: "closeEditor"}],
			button2: ["wm.Button", {height: "100%", width: "70px", caption: "Cancel"}, {onclick: "closeEditor"}]
		}]
	}]
}