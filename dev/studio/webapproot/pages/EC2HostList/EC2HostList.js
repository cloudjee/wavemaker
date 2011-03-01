/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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

dojo.declare("EC2HostList", wm.Page, {
  connHandle: null,

  start: function() {
  },
  okButtonClick: function(inSender, inEvent) {
	var ec2InstInfo = this.hostList.getDisplayValue();
	if (ec2InstInfo == null || ec2InstInfo == undefined || ec2InstInfo == "") return;
	  
	this.connHandle = dojo.connect(app.studio.dplDialog.deploymentDialog, "_getParms1", this, "dismissToContinue");
  },
  cancelButtonClick: function(inSender, inEvent) {
    this.owner.owner.dismiss();
  },
  dismissToContinue: function() {
	dojo.disconnect(this.connHandle);
    this.owner.owner.dismiss();   
  },
  terminateButtonClick: function(inSender, inEvent) {
  },
  newButtonClick: function(inSender, inEvent) {
    
  },
  _end: 0
});