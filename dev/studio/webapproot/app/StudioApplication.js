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
dojo.provide("wm.studio.app.StudioApplication");

dojo.declare("StudioApplication", wm.Application, {
	main: "Main",
        theme: "wm_studio",
	widgets: {
	},
    confirm: function() {
        this.inherited(arguments);
        this.confirmDialog.setBorderColor("white");
        this.confirmDialog.setBorder("2");        
        this.confirmDialog.$.genericInfoPanel.setBorder("10");
        this.confirmDialog.$.genericInfoPanel.setBorderColor("#424A5A");
    },
    alert: function() {      
        var hasAlert = this.alertDialog;
        this.inherited(arguments);
        if (!hasAlert) {
            this.alertDialog.setBorderColor("white");
            this.alertDialog.setBorder("2");        
            this.alertDialog.$.genericInfoPanel.setBorder("10");
            this.alertDialog.$.genericInfoPanel.setBorderColor("#424A5A");
        }
    }
});
