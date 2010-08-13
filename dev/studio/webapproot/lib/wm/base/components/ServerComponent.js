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
dojo.provide("wm.base.components.ServerComponent");
dojo.require("wm.base.Component");

/**
	Base class for all server-side components.
	@name wm.ServerComponent
	@class
	@extends wm.Component
*/
dojo.declare("wm.ServerComponent", wm.Component, {
	noInspector: true,
	init: function() {
		this.inherited(arguments);
		this.publishClass = this.publishClass || this.declaredClass;
	},
	prepare: function() {
		this.inherited(arguments);
		this.setOwner(null);
	},
	write: function() {
		return "";
	},
	designSelect: function() {
		this.editView();
	},
	editView: function() {
	}
});
