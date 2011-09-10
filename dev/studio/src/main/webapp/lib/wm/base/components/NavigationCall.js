/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

wm.Object.extendSchema(wm.NavigationCall,{
	owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"]},
	autoUpdate: {ignore: 1},
        startUpdateComplete: { ignore: 1},
	startUpdate: {ignore: 1},
	service: {ignore: 1, writeonly: 1},
	operation: { group: "common", order: 24},
	updateNow: { ignore: 1},
	queue: { group: "operation", order: 20},
	clearInput: { group: "operation", order: 30},
    input: { ignore: 1 , writeonly: 1, componentonly: 1, categoryParent: "Properties", categoryProps: {component: "input", bindToComponent: true, inspector: "Navigation"}, doc: 1}
});

// design only...
/**#@+ @design */
wm.NavigationCall.extend({
	listProperties: function() {
		var result = this.inherited(arguments);
		result.owner.ignoretmp = (this.operation == "gotoPage" || this.operation == "gotoDialogPage") ? 0 : 1;
		return result;
	},
	operationChanged: function() {
		this.inherited(arguments);
	    if (this.isDesignLoaded() && this.owner instanceof wm.Application && this.operation != "gotoPage" && this.operation != "gotoDialogPage" && studio.page) {
			this.set_owner("Page");
		}
	}

});
/**#@- @design */

wm.NavigationCall.description = "Navigation service call.";
