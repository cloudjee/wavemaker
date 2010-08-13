/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.widget.Layers.SequenceDecorator");
dojo.require("wm.base.widget.Layers.Decorator");

dojo.declare("wm.SequenceDecorator", wm.LayersDecorator, {
	decorationClass: "wmsequencelayers",
	undecorate: function() {
		this.inherited(arguments);
		this.sequenceControl.destroy();
	},
	decorateContainer: function() {
		this.inherited(arguments);
		var d = this.decoree;
		var s = this.sequenceControl = new wm.Container({
			parent: d, 
			owner: d,
			layoutKind: "left-to-right",
			verticalAlign: "middle",
			horizontalAlign: "right",
			height: "36px",
			width: "100%",
			border: "1,0,0,0",
			padding: "2,0,0,0",
			lock: true
		});
		this.decoree.moveControl(this.sequenceControl, 1);
		//
		new wm.Button({caption: "Previous", owner: d, parent: s, width: "70px", height: "100%", margin: "4, 10, 4, 4", onclick: dojo.hitch(d, "setPrevious")});
		new wm.Button({caption: "Next", owner: d, parent: s, width: "70px", height: "100%", onclick: dojo.hitch(d, "setNext")});
	}
});
