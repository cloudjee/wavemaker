/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.pages.RegistrationDialog.RegistrationDialog");

dojo.declare("RegistrationDialog", wm.Page, {
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