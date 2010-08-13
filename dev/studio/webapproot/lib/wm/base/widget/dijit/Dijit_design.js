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
dojo.provide("wm.base.widget.dijit.Dijit_design");
dojo.require("wm.base.widget.dijit.Dijit");

wm.DijitWrapper.extend({
	designCreate: function() {
		this.inherited(arguments);
		this._designee = this.dijit;
	},
	// FIXME: this is a stop gap to set some properties on the wrapper and some on the designee
	isNativeProp: function(inProp) {
		return inProp in this.nonDijitProps;
	},
	getProp: function(n) {
		if (this.isNativeProp(n))
			this._designee = this;
		var r = this.inherited(arguments);
		this._designee = this.dijit;
		return r;
	},
	setProp: function(n, v) {
		if (this.isNativeProp(n))
			this._designee = this;
		this.inherited(arguments);
		this._designee = this.dijit;
	}, 
	dummy: 0
});