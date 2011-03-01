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
dojo.provide("wm.base.design.Surface");

dojo.declare("wm.design.Surface", null, {
	origin: { l: 2, t: 2 },
	snapMask: 7,
	add: function(inDesignable) {
		inDesignable.setBounds(wm.design.rect(-1, -1, 160, 96));
		this.domNode.appendChild(inDesignable.domNode);
	},
	snap: function(inRect) {
		var mask = this.snapMask, o = this.origin;
		with (inRect) {
			l -= (l - o.l) & mask;
			t -= (t - o.t) & mask;
			w -= w & mask;
			h -= h & mask;
		}
	},
	dragStart: function(inDragger) {
	},
	drag: function(inDragger, inEvent) {
		inDragger.client.setBounds(inDragger.dragRect);
	},
	drop: function(inDragger) {
		inDragger.client.setBounds(inDragger.dragRect);
	}
});

dojo.declare("wm.Surface", [wm.Box, wm.design.Surface], {
});
