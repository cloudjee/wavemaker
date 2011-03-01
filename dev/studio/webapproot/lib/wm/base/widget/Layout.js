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
dojo.provide("wm.base.widget.Layout");

dojo.declare("wm.Layout", wm.Container, {
	// useful properties
	classNames: 'wmlayout',
        autoScroll: true,
	fit: false,
	width: "",
	height: "",
        touchScrolling: true,
	create: function() {
		this.inherited(arguments);
	},
	build: function() {
		this.inherited(arguments);
		this.domNode.style.cssText += this.style + "overflow: hidden; position: relative;";
	},
	init: function() {
		this.inherited(arguments);
		/*
		// FIXME: detect ownership under app. Seems like it would be cleaner if, at least, part controlled this.
		var mainBox = (this.owner && this.owner.owner == window.app);
		if (mainBox) {
			this.fit = {
				w: (!this.width || wm.splitUnits(this.width).units == "flex"),
				h: (!this.height || wm.splitUnits(this.height).units == "flex")
			};
		}
		*/
		//if(this.domNode === document.body || mainBox){ 
			this.subscribe("window-resize", this, "resize");
		//}

	    
	},
	fitTo: function() {
		if(this.domNode === document.body) {
			document.body.scrollTop = 0;
		}
		var pn = this.domNode.parentNode;
		if (pn && !wm.isEmpty(this.fit)) {
			pn.scrollTop = 0;
			var n = dojo.contentBox(pn), b = {}, f = this.fit;
			b.l = n.l;
			b.t = n.t;
			for (var i in f)
				if (f[i])
					b[i] = n[i];
			dojo.marginBox(this.domNode, b);
		}
	},
	resize: function() {
		// if we have a parent, they control our reflow
		// so we ignore window-resize message
		if (!this.parent)
			this.reflow();
	},
	updateBounds: function() {
		this._percEx = {w:100, h: 100};
		if (!this.parent) {
			var pn = this.domNode.parentNode;
			this.setBounds(0, 0, pn.offsetWidth, pn.offsetHeight);
			//this.setBounds(dojo.contentBox(pn));
		} else {
			this.setBounds(this.parent.getContentBounds());
		}
	},
	reflow: function() {
		if (this._cupdating)
			return;
	        this.updateBounds();
		this.renderBounds();
		//this.fitTo();
		this.inherited(arguments);
		//wm.layout.box.reflow(this.domNode);
	}/*,
	canResize: function() {
		return false;
	}*/
});

// design-time
wm.Object.extendSchema(wm.Layout, {
    themeStyleType: {group: "style", order: 150},
	fitToContent: { ignore: 1 },
	fitToContentWidth: { ignore: 1 },
	fitToContentHeight: { ignore: 1 },
	minWidth: { ignore: 1 },
	minHeight: { ignore: 1 },
	fit: { ignore: 1 }
});

// bc
wm.LayoutBox = wm.Layout;

dojo.extend(wm.Layout, {
    themeable: true,
    themeableStyles: ["Document-Styles-BorderStyle_Radius", "Document-Styles-BorderStyle_Shadow"]
});