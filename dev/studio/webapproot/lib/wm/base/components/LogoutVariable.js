/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.LogoutVariable");
dojo.require("wm.base.components.ServiceVariable");

//===========================================================================
// Main service calling class: calls services with input data and returns data
//===========================================================================
/**
	Main service calling class: calls services with input data and returns data
	@name wm.ServiceVariable
	@class
	@extends wm.Variable
	@extends wm.ServiceCall
*/
dojo.declare("wm.LogoutVariable", wm.ServiceVariable, {
      service: "securityService",
      operation: "logout",
      autoUpdate: 0,
      startUpdate: 0,
      clearDataOnLogout: true,
      logoutNavCall: null,
      init: function() {
          if (!this.clearDataOnLogout) {
              this.logoutNavCall = new wm.NavigationCall({
	          name: "logoutNavCall",
	          owner: this,
	          operation: "gotoPage"
	      });
              this.logoutNavCall.input.setData({pageName: "Login"});
          }
    },
      onSuccess: function(inData) {
          if (!this.clearDataOnLogout) {
              this.logoutNavCall.update();
          } else {
              var path = window.location.pathname;
              if (path.match(/[^\/]*\.html/)) {
                  path = path.replace(/[^\/]*\.html/, "login.html");
              } else {
                  if (!path.match(/\/$/)) path += "/";
                  path += "login.html";
              }
              
              window.location = window.location.protocol + "//" + window.location.host + path + window.location.search;
          }
      },
      onError: function(inError) {
         this.inherited(arguments);
	  /* TODO: Localize this */
	  app.alert(wm.getDictionaryItem("wm.LogoutVariable.FAILED", {error: inError}));
      },
      _end: 0
      });

wm.Object.extendSchema(wm.LogoutVariable, {
    downloadFile: {ignore: 1},
	logoutNavCall: {ignore: 1},
	operation: { ignore:1},
        clearInput: { ignore: 1},
	onSetData: {ignore: 1},
	service: {ignore: 1},
        autoUpdate: {ignore: 1},
        startUpdate: {ignore: 1},
        updateNow: {ignore: 1},
        queue: {ignore: 1},
        maxResults: {ignore: 1},
        designMaxResults: {ignore: 1}
  });


wm.LogoutVariable.description = "Data from a service.";

/**#@+ @design */
wm.LogoutVariable.extend({
	/** @lends wm.LogoutVariable.prototype */
  });
/**#@- @design */
