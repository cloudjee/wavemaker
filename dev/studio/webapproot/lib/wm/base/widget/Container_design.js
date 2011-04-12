/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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


dojo.provide("wm.base.widget.Container_design");
dojo.require("wm.base.widget.Container");

wm.Container.extend({
	listProperties: function() {
		var p = this.inherited(arguments);
		p.freeze.ignoretmp = this.schema.freeze.ignore || this.getLock();
		return p;
	},
	writeChildren: function(inNode, inIndent, inOptions) {
		var s = [];
		wm.forEach(this.getOrderedWidgets(), function(c) {
			if (wm.isDesignable(c) && !c.flags.notStreamable)
				s.push(c.write(inIndent, inOptions));
		});
		return s;
	},
	suggestDropRect: function(inControl, ioInfo) {
		this.layout.suggest(this, inControl, ioInfo);
	},
	suggestSize: function(inControl, ioInfo) {
		this.layout.suggestSize(this, inControl, ioInfo);
	},
	designMoveControl: function(inControl, inDropInfo) {
		info = {l:inDropInfo.l, t:inDropInfo.t, i: inDropInfo.i};
		if (inControl.parent == this) {
			// inDropInfo.index 'i' may be counting inControl
			this.moveControl(inControl, info.i || 0);
		} else {
			var p = inControl.parent;
			inControl.setParent(this);
			inControl.designWrapper.controlParentChanged();
			// inDropInfo.index 'i' is never counting inControl
			this.removeControl(inControl);
			this.insertControl(inControl, info.i || 0);
			if (p)
				p.reflow();
		}
		if (this.layout.insert) {
			this.layout.insert(this, inControl, inDropInfo);
			//return;
		}
		this.reflow();
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "layoutKind":
				return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: wm.layout.listLayouts()});

                case "themeStyleType":
		    return new wm.propEdit.Select({component: this, value: inValue, name: inName, options: ["", "MainContent", "EmphasizedContent", "HeaderContent"]});
		}
		return this.inherited(arguments);
	},
	resizeUpdate: function(inBounds) {
		// update the boundary rectangle highlight only
		this.designWrapper._setBounds(inBounds);
	},

_end: 0
});