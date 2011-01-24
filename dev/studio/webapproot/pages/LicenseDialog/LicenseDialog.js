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
dojo.provide("wm.studio.pages.LicenseDialog.LicenseDialog");

dojo.declare("LicenseDialog", wm.Page, {
	start: function() {
	    var licenseService = new wm.JsonRpcService({owner: this, service: "licensingService", sync: false});	
	    var licenseDeferred = licenseService.requestSync("getMacAddr", [], dojo.hitch(this, function(inResult) {
		this.macaddr = inResult;
	    }));
	},
        onSuccess: function(inSender) {
	    studio.startPageDialog.page.layer1.activate();
	    app.toastSuccess("License File Accepted!");
	    studio.setupLicenseInfoLabel();
	},
        onError: function(inSender, inError) {
	    this.resultLabel.setCaption(inError);
	},
    dismiss: function() {
	studio.startPageDialog.page.tabLayers1.setLayerIndex(0);
    },
    trialClick: function() {
	window.open("http://www.wavemaker.com/?macid=" + this.macaddr);
    },
    buyClick: function() {
	window.open("http://www.wavemaker.com/?macid=" + this.macaddr);
    },
	_end: 0
});
