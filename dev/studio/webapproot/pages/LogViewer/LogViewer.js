/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
dojo.declare("LogViewer", wm.Page, {
  i18n: true,
  lastTimeStamp: "",
  lastProjectName: null,
  logName: "project.log",
  start: function() {
  },
  update: function(inText, inSyntax) {

  },
  closeViewer: function(inSender, e) {
		wm.dismiss(this, e);
  },
    onShow: function() {
        this.showLogs();
    },
  showLogs: function() {
      if (this.lastProjectName != studio.project.projectName) {
	  this.lastProjectName = studio.project.projectName;
	  if (this.logArea) {
	      this.logArea.setHtml(this.getDictionaryItem("PLACEHOLDER"));
	      this._isClear = true;
	  }
      }

      var _this = this;
      studio.studioService.requestAsync("getLogUpdate", [this.logName, this.lastTimeStamp],
				 function(result) {
				     var logs = result.logs;			     
				     if (_this.logArea && logs) {
					 if (_this._isClear) {
					     _this._isClear = false;
					     _this.logArea.setHtml(logs);
					 } else 
					     _this.logArea.appendHtml(logs);
				     }
				     if (result.lastStamp) _this.lastTimeStamp = result.lastStamp;
				 });
  },
  clearLog: function() {
      if (this.logArea) {
	  this.logArea.setHtml(this.getDictionaryItem("PLACEHOLDER"));
	  this._isClear = true;
      }
  },
  updateLog: function() {
      this.showLogs();
  },
  setLogFile: function(inLogName) {
      this.logName = inLogName;
      this.lastTimeStamp = 0;
      this.clearLog();
      this.updateLog();
  },
  _end: 0
});
