/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.PopoutDialog");
dojo.require("wm.base.widget.Dialogs.Dialog");

/* This appears to be obsolete */
dojo.declare("wm.PopoutDialog", wm.Dialog, {
	popout: "",
	postInit: function() {
		this.inherited(arguments);
	},
        setShowing: function(inShow, forceChange) {
		this.inherited(arguments);
		if (this.getValueById(this.popout))
			this[this.showing ? "_addPopout" : "_removePopout"]();
	},
	_addPopout: function() {
		var p = this.getValueById(this.popout);
		this._popoutShowing = p.showing;
		this._popoutParent = p.parent;
		this._popoutIndex = dojo.indexOf(p.parent.c$, this);
		p.setParent(this);
		this.moveControl(p, 0);
		if (!this._popoutShowing)
			p.setShowing(true);
		if (this._popoutShowing)
			this._popoutParent.reflow();
		this.flow();
	},
	_removePopout: function() {
		var p = this.getValueById(this.popout);
		p.setShowing(this._popoutShowing);
		p.setParent(this._popoutParent);
		this._popoutParent.moveControl(p, this._popoutIndex);
		if (this._popoutShowing)
			this._popoutParent.reflow();
	}
});
