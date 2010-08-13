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
// TODO: Waiting indicators
dojo.provide("wm.studio.pages.DeploymentPage_Cloud.DeploymentPage_Cloud");

dojo.declare("DeploymentPage_Cloud", wm.Page, { 
    start: function() {
	dojo.query("#" + this.chooseCloudList.domNode.id + " .wmlist-item:nth-child(odd)").addClass("Odd");
	dojo.query("#" + this.chooseCloudList.domNode.id + " .wmlist-item:nth-child(even)").addClass("Even");
    },
    chooseCloudClick: function(inSender) {
	var item = this.chooseCloudList.selectedItem.getData();
	this.owner.setPageName("DeploymentPage_Cloud_" + item.dataValue);
    },
    setup: function() {},
    reset: function() {},
    _end: 0
});
