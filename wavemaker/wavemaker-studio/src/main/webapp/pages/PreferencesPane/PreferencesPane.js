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
 
dojo.provide("wm.studio.pages.PreferencesPane.PreferencesPane");

dojo.declare("PreferencesPane", wm.Page, {
  i18n: true,
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
