/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.studio.pages.DeploymentPage.DeploymentPage");

dojo.declare("DeploymentPage", wm.Part, { 
  i18n: true,
  start: function() {
      this.setup();
  },
  setup: function() {
      if (this.GenerateAppPageContainer.page) this.GenerateAppPageContainer.page.setup();
      if (this.ManageCloudPageContainer.page) this.ManageCloudPageContainer.page.setup();
      if (this.ManageWebServersPageContainer.page) this.ManageWebServersPageContainer.page.setup();
      this.reset();
  },
  reset: function() {
      if (this.GenerateAppPageContainer.page) this.GenerateAppPageContainer.page.reset();
      if (this.ManageCloudPageContainer.page) this.ManageCloudPageContainer.page.reset();
      if (this.ManageWebServersPageContainer.page) this.ManageWebServersPageContainer.page.reset();
  },
    doneClicked: function() {
	this.owner.owner.hide();
    },
  _end: 0
});
