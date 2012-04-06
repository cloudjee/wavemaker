/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Box_design");
dojo.require("wm.base.widget.Box");

wm.Object.extendSchema(wm.Box, {
	box: {ignore: 1},
	boxPosition: { ignore: 1}
});

wm.Box.extend({
	_boxTypes: [ 'h', 'v' ], //, 'free' ],
	_boxTypeLabels: [ 'Left-to-Right', 'Top-to-Bottom' ], // 'Free' ],
	_hboxPositions: ['left', 'center', 'right'],
	_vboxPositions: ['top', 'center', 'bottom'],
	_boxPositions: ['topLeft', 'center', 'bottomRight'],
	designCreate: function() {
		this.inherited(arguments);
		// FIXME: this has to be done in setParent
		// don't allow widget to move if it's parent has flow layout.
		var p = this.parent;
		if (p && p.box == 'flow')
			this.moveable = false;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "box":
				return makeSelectPropEdit(inName, inValue, this._boxTypeLabels, inDefault, this._boxTypes);
			case "boxPosition":
				var opts = this.box == "h" ? this._hboxPositions : this._vboxPositions;
				return makeSelectPropEdit(inName, inValue, opts, inDefault, this._boxPositions);
		}
		return this.inherited(arguments);
	}
});
