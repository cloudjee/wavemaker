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
dojo.provide("wm.studio.pages.DeploymentPage.DeploymentPage");

dojo.declare("DeploymentPage", wm.Part, { 
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
	studio.navGotoDesignerClick();
    },
  _end: 0
});
