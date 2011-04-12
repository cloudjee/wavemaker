/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
dojo.declare("LogViewer", wm.Page, {
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
