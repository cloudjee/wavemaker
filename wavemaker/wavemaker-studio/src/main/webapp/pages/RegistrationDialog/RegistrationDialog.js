/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.pages.RegistrationDialog.RegistrationDialog");

dojo.declare("RegistrationDialog", wm.Page, {
        i18n: true,
	dialogReference: null,
	start: function() {
		
	},
	skipButtonClick: function(inSender) {
		studio.registrationService.requestAsync("setRegistrationChoice", ["Skip"]);
		wm.fire(this.owner, "dismiss");
		return inSender;
	},
	registerButtonClick: function(inSender) {
		studio.registrationService.requestAsync("setRegistrationChoice", ["Register"]);
		window.open("http://www.wavemaker.com/community/dlreg.html", "wmregistration");
		wm.fire(this.owner, "dismiss");
		return inSender;
	},
	laterButtonClick: function(inSender) {
		studio.registrationService.requestAsync("setRegistrationChoice", ["Later"]);
		wm.fire(this.owner, "dismiss");
		return inSender;
	},
	_end: 0
});