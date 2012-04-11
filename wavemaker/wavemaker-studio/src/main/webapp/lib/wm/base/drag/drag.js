/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

dojo.provide("wm.base.drag.drag");
dojo.require("wm.base.drag.capture");
/**
	@class
	@name wm.Drag
*/
dojo.declare("wm.Drag", null, {
	/** @lends wm.Drag.prototype */
	hysteresis: 4,
	/**
		Difference between current position and start position
	*/
	dx:0, dy:0, 
	/**
		Starting page position
	*/
	px:0, py:0,
	constructor: function() {
		this.initNodes();
	},
	initNodes: function() {
		// make a scrim for cursor style control and event capture
		this.scrimNode = document.createElement("div");
		var css = "position: absolute; z-index: 200; width: 100%; height: 100%; top: 0; left: 0; display: none;";
		// FIXME: is this needed only for IE6? test.
		css += /*dojo.isIE ? 
			"background-color: white; filter: alpha(opacity=0);" :*/
				"background-color: transparent;";
		this.scrimNode.style.cssText = css;
		document.body.appendChild(this.scrimNode);
	},
	setCursor: function(inCursor) {
		if (!this.avatarNode)
		{
			this.scrimNode.style.cursor = inCursor;
			return;
		}
		
		if (inCursor == 'no-drop')
		{
			dojo.addClass(this.avatarNode, 'invalidDropCSS');
		}
		else
		{
			dojo.removeClass(this.avatarNode, 'invalidDropCSS');
		}

		this.scrimNode.style.cursor = 'default';
	},
	mousedown: function(e) {
		this.inherited(arguments);
		this.mouseIsDown = true;
		this.dragging = false;
		this.dx = 0;
		this.dy = 0;
		this.px = e.pageX;
		this.py = e.pageY;
		if (this.scrimEarly) {
			// Because scrim is inserted immediately, mouseup will not occur on
			// the same node as mousedown, so we've killed
			// click and dblclick.
			// Ironically, scrim is necessary only to allow motion detection
			// (hysteresis) that would be blocked by IFRAME nodes, and motion
			// detection is only necessary to support differentiating clicks from
			// drags.
			// We support click detection via click/onclick methods
			// in this class (but not dblclick yet).
			//wm.showHideNode(this.scrimNode, true);
		}
	},
	mouseout: function(e) {
		// Alternative motion detection in case, e.g., an IFRAME is stealing our
		// mousemove
		if (this.mouseIsDown && !this.dragging) {
			this.start(e);
		}
	},
	mousemove: function(e) {
		if (this.mouseIsDown) {
			this.dx = e.pageX - this.px;
			this.dy = e.pageY - this.py;
			if (this.dragging) {
				this.drag(e);
			} else if (Math.sqrt(this.dx*this.dx + this.dy*this.dy) > this.hysteresis) {
				this.start(e);
			}
		}
	},
	start: function(e) {
		this.dragging = true;
		wm.showHideNode(this.scrimNode, true);
		this.onstart(e);
	},
	drag: function(e) {
		this.ondrag(e);
	},
	mouseup: function(e) {
		this.inherited(arguments);
		this.mouseIsDown = false;
		this.finish();
		if (this.dragging) {
			this.dragging = false;
			this.drop();
			//wm.onidle(this, "drop");
		}/* else {
			this.click(e);
			//wm.onidle(this, "click", e);
		}*/
	},
	drop: function() {
		this.ondrop();
	},
	/*click: function(e) {
		console.log("drag.click");
		this.onclick(e);
	},*/
	finish: function() {
		wm.showHideNode(this.scrimNode, false);
	},
	onstart: function(e) {
	},
	ondrag: function(e) {
	},
	ondrop: function() {
	}/*,
	onclick: function(e) {
		// if dragging was never triggered
	}*/
});

/**
	@class
	@name wm.MouseDrag
	@inherits wm.MouseCapture
	@inherits wm.Drag
*/
dojo.declare("wm.MouseDrag", [wm.MouseCapture, wm.Drag], {
	/** @lends wm.MouseDrag */
});

/**
	@class
	@name wm.DragDropper
	@inherits wm.MouseDrag
*/
dojo.declare("wm.DragDropper", wm.MouseDrag, {
	/** @lends wm.DragDropper */
	initNodes: function() {
		this.inherited(arguments);
		// make a drag avatar
		this.avatarNode = document.createElement("div");
		dojo.addClass(this.avatarNode, 'dragAvatarCSS');
		this.avatarNode.style.cssText = "display: none;";
		this.avatarNode.innerHTML = "(control)";
		this.scrimNode.appendChild(this.avatarNode);
	},
	showHideAvatar: function(inTrueToShow) {
		wm.showHideNode(this.avatarNode, inTrueToShow);
	},
	setAvatarContent: function(inContent) {
		this.avatarNode.innerHTML = inContent;
	},
	update: function(e) {
		this.pxp = this.px + this.dx;
		this.pyp = this.py + this.dy;
		dojo._setMarginBox(this.avatarNode, this.pxp + 12, this.pyp + 16);
	},
	start: function(e) {
		this.inherited(arguments);
		this.update();
		wm.showHideNode(this.avatarNode, true);
	},
	drag: function() {
		this.inherited(arguments);
		this.update();
	},
	finish: function() {
		wm.showHideNode(this.avatarNode, false);
		this.inherited(arguments);
	}
});
