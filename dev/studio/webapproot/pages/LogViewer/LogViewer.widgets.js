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
LogViewer.widgets = {
	layoutBox1: ["wm.Layout", {backgroundColor: "#424A5A", height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
	    logArea: ["wm.Html", {height: "100%", width: "100%", border: "0", padding: "4, 0, 0, 4", scrollY: true}, {}],
	    panel1: ["wm.Panel", {height: "34px", width: "100%", border: "2,0,0,0", borderColor: "white", margin: "2", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		button1: ["wm.Button", {height: "100%", width: "70px", caption: "Clear"}, {onclick: "clearLog"}],
		button2: ["wm.Button", {height: "100%", width: "70px", caption: "Update"}, {onclick: "updateLog"}]
	    }]
	}]
}
