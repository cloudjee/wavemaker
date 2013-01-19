dojo.declare("Login", wm.Page, {
  start: function() {
    this.connect(this.domNode, "keydown", this, "keydown");
    this.usernameInput.setDataValue(dojo.cookie("user") || "");
    this.usernameInput.focus();
  },
  keydown: function(e) {
    if (e.keyCode == dojo.keys.ENTER) {
      this.loginButton.domNode.focus();
    }
  },
  loginButtonClick: function(inSender) {
          dojo.cookie("user", this.usernameInput.getDataValue(), {expires: 365});
    this.loginErrorMsg.setCaption("");
    wm.login(
      [this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], 
      null, dojo.hitch(this, "loginFailed"));
  },
  loginFailed: function(inResponse) {
    this.loginErrorMsg.setCaption("Invalid username or password.");
    this.usernameInput.focus();
  },
  _end: 0
});