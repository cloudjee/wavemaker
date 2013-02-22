/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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
    this.useLopEditor.beginEditUpdate();
    this.useLopEditor.setDataValue(studio.getUserSetting("useLop"));
    this.useLopEditor.endEditUpdate();
    */
  },
  getPreferencesCallBack: function(inResult) {
    var cookie = dojo.cookie("wavemakerHome");
    var currentWaveMakerHome = inResult['wavemakerHome'];
    var options =  cookie ? cookie.split(",") : [];
    var exists = dojo.some(options, function(item) {return item === currentWaveMakerHome;}, this);
    if (!exists)  options.unshift(currentWaveMakerHome);
    this.wavemakerFolderEditor.setOptions(options);
    this.wavemakerFolderEditor.setDataValue(inResult['wavemakerHome']);
    this.demoFolderEditor.setDataValue(inResult['demoHome']);
  },
  okButtonClick: function(inSender) {
    studio.studioService.requestAsync("setPreferences", [{
        'wavemakerHome': this.wavemakerFolderEditor.getDataValue(),
        'demoHome': this.demoFolderEditor.getDataValue()
      }], dojo.hitch(this, "okButtonClickResult"),
      dojo.hitch(this, "okButtonClickError"));

  },
  okButtonClickResult: function(inSender) {
    wm.fire(this.owner, "dismiss", ["OK"]);
    if (studio.startPageDialog.page)
        studio.startPageDialog.page.refreshProjectList();
    var exists = dojo.some(this.wavemakerFolderEditor.options, function(item) {return item === this.wavemakerFolderEditor.getDataValue();}, this);
    if (!exists) {
        while (this.wavemakerFolderEditor.options.length > 4) this.wavemakerFolderEditor.options.pop(); // bring it down to 4 items before we add a new item. Max of 5 item history (cookie memory space is small)
        var options = this.wavemakerFolderEditor.getDataValue() + "," + this.wavemakerFolderEditor.options.join(",")
        dojo.cookie("wavemakerHome", options);
    }
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
/*
  useLopEditorChange: function(inSender, inDisplayValue, inDataValue) {
  	studio.setUserSettings({useLop: inDataValue});
  },
  */
  _end: 0
});
