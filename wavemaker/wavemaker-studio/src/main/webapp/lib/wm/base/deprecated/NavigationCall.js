/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.NavigationCall");
dojo.require("wm.base.components.ServiceCall");
dojo.require("wm.base.components.NavigationService");

/**
	Encapsulates a {@link wm.NavigationService} configuration with a trigger to invoke the configured service.
	@see wm.ServiceCall#update
	@name wm.NavigationCall
	@class
	@extends wm.Component
	@extends wm.ServiceCall
*/
dojo.declare("wm.NavigationCall", [wm.Component, wm.ServiceCall], {
	/** @lends wm.Variable.prototype */
	service: "navigationService",
	operation: "gotoLayer",
	// page navigation can lead to destruction, so abort processing
	processResult: function(inResult) {
		if (!this.owner)
			return;
		return this.inherited(arguments);
	},
	processError: function(inError) {
		if (!this.owner)
			return;
		return this.inherited(arguments);
	}
});

