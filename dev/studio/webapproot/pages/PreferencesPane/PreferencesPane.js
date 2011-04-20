/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.studio.pages.PreferencesPane.PreferencesPane");

dojo.declare("PreferencesPane", wm.Page, {
  start: function() {
    this.update();
    if (studio.isCloud()) {
	this.panel2.setShowing(false);
    }
  },
  update: function() {
    studio.studioService.requestSync("getPreferences", null, dojo.hitch(this, "getPreferencesCallBack"));
    /*
    this.debugEditor.beginEditUpdate();
    this.debugEditor.setDataValue(studio.getUserSetting("previewDebug"));
    this.debugEditor.endEditUpdate();
    */
    this.useLopEditor.beginEditUpdate();
    this.useLopEditor.setDataValue(studio.getUserSetting("useLop"));
    this.useLopEditor.endEditUpdate();
  },
  getPreferencesCallBack: function(inResult) {
    this.wavemakerFolderEditor.setDataValue(inResult['wavemakerHome']);
    this.demoFolderEditor.setDataValue(inResult['demoHome']);
  },
  okButtonClick: function(inSender) {
    studio.studioService.requestAsync("setPreferences", [{
        'wavemakerHome': this.wavemakerFolderEditor.getDataValue(),
        'demoHome': this.demoFolderEditor.getDataValue()
      }], dojo.hitch(this, "okButtonClickResult"),
      dojo.hitch(this, "okButtonClickError"));
      if (studio.startPageDialog.page)
	  studio.startPageDialog.page.refreshProjectList();
  },
  okButtonClickResult: function(inSender) {
    wm.fire(this.owner, "dismiss", ["OK"]);
  },
  okButtonClickError: function(inSender) {
    app.alert("Error: "+inSender.message);
  },
  cancelButtonClick: function(inSender) {
    wm.fire(this.owner, "dismiss");
  },
  /*
  debugEditorChange: function(inSender, inDisplayValue, inDataValue) {
    studio.setUserSettings({previewDebug: inDataValue});
  },
  */
  useLopEditorChange: function(inSender, inDisplayValue, inDataValue) {
  	studio.setUserSettings({useLop: inDataValue});
  },
  _end: 0
});
