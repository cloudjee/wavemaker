/*
 *  Copyright (C) 2010-2013 VMware, Inc. All rights reserved.
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


dojo.declare("Login", wm.Page, {
    start: function() {
        if (window["PhoneGap"]) {
            this.restorePhonegapCredentials();
        } else {
            this.usernameInput.setDataValue(dojo.cookie("user") || "");
            this.usernameInput.focus();
        }
        if (this.wmTitle) this.wmTitle.setCaption(app.name || app.declaredClass);
        this.loadingDialog.setMargin(parseInt(this.loadingDialog.widgetToCover.margin) + parseInt(this.loadingDialog.widgetToCover.border));
    },
    loginButtonClick: function(inSender) {
        this.loginErrorMsg.setCaption("");
        dojo.cookie("user", this.usernameInput.getDataValue(), {
            expires: 365
        });
    },
    
    onLoginSuccess: function() {
        if (window["PhoneGap"]) {
            this.phonegapCredentialStorage.setData({
                name: this.usernameInput.getDataValue(),
                dataValue: this.passwordInput.getDataValue()
            });
        }
    },
    loginFailed: function(inResponse) {
        this.loginErrorMsg.setCaption("Invalid username or password.");
        this.usernameInput.focus();
    },
    restorePhonegapCredentials: function() {        
        var username = this.phonegapCredentialStorage.getValue("name");
        var password = this.phonegapCredentialStorage.getValue("dataValue");
        if (username || password) {
            this.usernameInput.setDataValue(username);
            this.passwordInput.setDataValue(password);
            if (username && password) {
                this.loginVariable1.update();
            }
        }
    },
  _end: 0
});