/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
 

dojo.declare("EC2HostList", wm.Page, {
    i18n: true,
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