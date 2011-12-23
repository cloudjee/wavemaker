/*
 * Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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
  logName: "wm.log",
  start: function() {
      if (!this._interval) {
	  this._interval = window.setInterval(dojo.hitch(this, "updateLogIfVisible"), 10000);
      }      
  },
  update: function(inText, inSyntax) {

  },
  closeViewer: function(inSender, e) {
		wm.dismiss(this, e);
  },
    onShow: function() {
	this.updateCheckbox.setShowing(this.logName == "wm.log");
	this.button1.setShowing(this.logName != "wm.log");
	this.button2.setShowing(this.logName != "wm.log");
        this.showLogs(true);
    },

  showLogs: function(scrollToBottom) {
      if (this.lastProjectName != studio.project.projectName) {
	  this.lastProjectName = studio.project.projectName;
	  if (this.logArea && this.logName != "wm.log") {
	      this.logArea.setHtml(this.getDictionaryItem("PLACEHOLDER"));
	      this._isClear = true;
	  }
      }

      var _this = this;
      if (this.logName == "wm.log") {
	  this.loadingDialog.show();
	  studio.studioService.requestAsync("getMainLog", [500],
					    function(result) {
						if (result != _this.logArea.html) {
						    _this.logArea.setHtml(result.replace(/\</g, "&lt;").replace(/\</g, "&gt;").replace(/\n/g,"<br/>"));
						    /* If the user hasn't scrolled from the last time we set the _lastScrollTop,
						     * then continue to insure we are looking at the bottom of the log
						     */
						    if (scrollToBottom || _this._lastScrollTop == _this.logArea.domNode.scrollTop) {
							_this.logArea.domNode.scrollTop = 1000000;
							_this._lastScrollTop = _this.logArea.domNode.scrollTop;
						    }
						    _this.loadingDialog.hide();
						}
					    },
					    function() {
						_this.loadingDialog.hide();						
					    });


      } else {
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
      }
  },
  clearLog: function() {
      if (this.logArea) {
	  this.logArea.setHtml(this.getDictionaryItem("PLACEHOLDER"));
	  this._isClear = true;
      }
  },
    updateCheckboxChanged: function(inSender) {
	if (inSender.showing && inSender.getChecked()) {
	    window.clearInterval(this._interval);
	    this.showLogs(true);
	    this._interval = window.setInterval(dojo.hitch(this, "updateLogIfVisible"), 10000);
	}
    },
    updateLogIfVisible: function() {
	if (!this.root.isAncestorHidden() && this.logName == "wm.log" && this.updateCheckbox.getChecked())
	    this.showLogs(false);
    },
  updateLog: function() {
      this.showLogs(false);
  },
  setLogFile: function(inLogName) {
      this.logName = inLogName;
      this.lastTimeStamp = 0;
      this.clearLog();
      this.updateLog();
  },
    destroy: function() {
	window.clearTimeout(this._interval);
	this.inherited(arguments);
    },
  _end: 0
});
