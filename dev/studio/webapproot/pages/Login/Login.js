/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
        i18n: true,
        form: null,
	start: function() {
	    //this.connect(this.domNode, "keydown", this, "keydown");

	    if (window.studio) {
	        this.layoutBox.addUserClass("wm-darksnazzy");
	        this.panel3.setWidth("300px");
		this.spacer1.setShowing(false);
		this.contentpanel.setShowing(false);
		this.registerLink.hide();
		this.pwdResetLink.hide();
		this.spacer2.hide();
		this.usernameInput.setReadonly(true);
		this.logoutButton.setWidth("80px");
		this.loginButton.setWidth("80px");
		this.logoutButton.show();

		this.panel5.setHeight("250px");
		this.panel5.setPadding("2");
		
		if (!studio.getUserName()) 
		    dojo.connect(studio, "setUserName", this, "setUserName");
		 else
		     this.usernameInput.setDataValue(studio.getUserName());
		this.registerLink.setShowing(false);
		this.pwdResetLink.setShowing(false);
		this.passwordInput.focus();
		this.reloginLabel.setShowing(true);
		this.loginButton.addUserClass("wm_FontColor_Black");
	    } else {
		var im = new Image();
		im.src = "images/wm-splash-screen.gif";
		this.usernameInput.focus();
		this.pwdResetLink.setLink(this.pwdResetLink.link + "&loginUrl=" + escape(window.location));
		this.usernameInput.setDataValue(dojo.cookie("user") || "");
		/*
		var iframe = dojo.byId("submitFrame");
		if (iframe) iframe.parentNode.removeChild(iframe);
		iframe = document.createElement("iframe");
		dojo.attr(iframe, {id: "submitFrame",
			    name: "submitFrame"});
		dojo.style(iframe, {top: "1px",
			    left: "1px",
			    width: "1px",
			    height: "1px",
			    visibility: "hidden"}); 
		dojo.body().appendChild(iframe);
		this.iframe = iframe;
		
		var form = document.createElement("form");
		form.id     = "submitForm";
		form.method = "post";
		form.target = "submitFrame";
		form.action = "invalidURL";
		this.form = form;
		dojo.place(form, "login_loginMainPanel", "before");
		dojo.place("login_loginMainPanel", "submitForm");
		
		dojo.forEach(document.forms[0].elements, function(element) {
			var isPass =  (dojo.attr(element, "type") == "password");
			var isText =  (dojo.attr(element, "type") == "text");
			dojo.attr(element, {"name": (isPass) ? "pass" : (isText) ? "user" : element.id,
				    "autocomplete": "on"});
		    });
		*/

	    }
	},
	setUserName: function(inName) {
	    this.usernameInput.setDataValue(inName);
	},
/*
	keydown: function(e) {
		if (e.keyCode == dojo.keys.ENTER) {
			this.loginButton.domNode.focus();
		}
	},
	*/
        logoutButtonClick: function(inSender) {
	  studio.logoutClick();
	},
	loginButtonClick: function(inSender) {
	    this.loginButton.setDisabled(true);
	        //this.form.submit();
	        dojo.cookie("user", this.usernameInput.getDataValue(), {expires: 365});
		this.loginErrorMsg.setCaption("");
		
		wm.login(
			[this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], 
			null, dojo.hitch(this, "loginFailed"));

	},
        loginSuccess: function(inResponse) {
	    this.loginButton.setDisabled(false);
	  if (window.studio) 
	    wm.fire(this.owner, "dismiss");

	},
	loginFailed: function(inResponse) {
	    this.loginButton.setDisabled(false);
	    app.alert(this.getDictionaryItem("ALERT_LOGIN_FAILED"));
		this.loginErrorMsg.setCaption(this.getDictionaryItem("CAPTION_LOGIN_FAILED"));
		this.usernameInput.focus();
	},
	_end: 0
});
