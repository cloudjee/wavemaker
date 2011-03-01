/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.design.Designable");

wm.design = {
	handles: {
		none: -1,
		not: 0,
		leftTop: 1,
		leftMiddle: 2,
		leftBottom: 3,
		rightTop: 4,
		rightMiddle: 5,
		rightBottom: 6,
		middleTop: 7,
		middleBottom: 8,
		client: 9
	},
	cursors: {
		"-1": "",
		0: "not-allowed",
		1: "nw-resize",
		2: "w-resize",
		3: "sw-resize",
		4: "ne-resize",
		5: "e-resize",
		6: "se-resize",
		7: "n-resize",
		8: "s-resize",
		9: "move"
	},
	drags: {
		none: 0,
		move: 1,
		resize: 2,
		select: 3,
		create: 4
	}
};

dojo.declare("wm.Designable", wm.Box, {
	classNames: "wmdesignable", 
	surface: null,
	designNode: null,
	dragMode: wm.design.drags.none,
	handleId: wm.design.handles.none,
	// init
	init: function() {
		this.inherited(arguments);
		this.domNode.className = this.classNames;
		// Normally Wrapper (subclass) catches events from the wrapped control.
		// But if the Wrapper is visible (scrim: true), it must catch it's own events.
		this.connectEvents(this.domNode, ["mousedown", "click"]);
		this.designNode = this.domNode;
	},
	getCursor: function() {
		return wm.design.cursors[this.handleId];
	},
	selectDragMode: function(e) {
		with (wm.design) {
			this.handleId = this.getHitHandle(e);
			this.dragMode = 
				this.handleId <= handles.not ? drags.none :
					this.handleId == handles.client ? drags.move : drags.resize;
		}
	},
	mousemove: function(e) {
		this.handleId = this.getHitHandle(e);
		e.currentTarget.style.cursor = this.getCursor();
	}
});