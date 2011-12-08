/*
 * Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
 
// TODO: Waiting indicators
dojo.provide("wm.studio.pages.DeploymentPage_Cloud.DeploymentPage_Cloud");

dojo.declare("DeploymentPage_Cloud", wm.Page, { 
    i18n: true,
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
