dojo.declare("Login", wm.Page, {
	"preferredDevice": "desktop",
  start: function() {
  
    this.initSups();
  
  },

  // intit subscription
  initSups: function() {
  
    // set cookie
    this.usernameInput.setDataValue(dojo.cookie("user") || "");
  
    // subscribe key event
    this.connect(this.domNode, "keydown", this, "keydown");
    
    // subscribe hover events for links
    this.connect(this.labLogin.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labLogin"));
    this.connect(this.labLogin.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labLogin"));
    this.connect(this.labRegister.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labRegister"));
    this.connect(this.labRegister.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labRegister"));
    this.connect(this.labReset.domNode, "onmouseover", this, dojo.hitch(this, "LinkMouseOver", "labReset"));
    this.connect(this.labReset.domNode, "onmouseout", this, dojo.hitch(this, "LinkMouseOut", "labReset"));
    
    // subscribe hover events for buttons
    /*
    this.connect(this.loginButton.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "loginButton"));
    this.connect(this.loginButton.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "loginButton"));
    this.connect(this.btnSubmit.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnSubmit"));
    this.connect(this.btnSubmit.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnSubmit"));
    this.connect(this.btnCancel.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnCancel"));
    this.connect(this.btnCancel.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnCancel"));
    this.connect(this.btnReset.domNode, "onmouseover", this, dojo.hitch(this, "BtnMouseOver", "btnReset"));
    this.connect(this.btnReset.domNode, "onmouseout", this, dojo.hitch(this, "BtnMouseOut", "btnReset"));
    */

    // set the cursor pointers for header pix
    this.labLogin.domNode.style.cursor = "pointer";
    this.labRegister.domNode.style.cursor = "pointer";
    this.labReset.domNode.style.cursor = "pointer";
    this.loginButton.domNode.style.cursor = "pointer"; 
    this.btnSubmit.domNode.style.cursor = "pointer";
    this.btnCancel.domNode.style.cursor = "pointer";
    this.btnReset.domNode.style.cursor = "pointer";   
    
    // set the focus to username field
    this.usernameInput.focus();

    // set the tab index for the registration editors
    // i+1 because the first tabIndex should be 1 not 0
    edArr = this.regEditor();
    for(i=0;i<=6;i++) {
      edArr[i].editor.setAttribute("tabIndex",i+1);
    }
    
  },
  // register editors
  regEditor: function() {
    try { 
      editorArr = new Array();
      editorArr[0] = this.teFirstName;
      editorArr[1] = this.teLastName;
      editorArr[2] = this.teEmail;
      editorArr[3] = this.teUsername;
      editorArr[4] = this.teCompany;
      editorArr[5] = this.tePhone;
      editorArr[6] = this.teAddress;
      editorArr[7] = this.teResetEmail;
      return editorArr;
    } catch(e) {
      console.error('ERROR IN regEditor: ' + e); 
    }    
  },
  // mouse hover functions for links
  LinkMouseOver: function(inWidget) {
    this[inWidget].domNode.style.textDecoration = "underline";
  }, 
  LinkMouseOut: function(inWidget) {
    this[inWidget].domNode.style.textDecoration = "";
  },
  // mouse hover functions for buttons
  BtnMouseOver: function(inWidget) {
    this[inWidget].setBorder(3);
    this[inWidget].setBorderColor("#FF9966");
  }, 
  BtnMouseOut: function(inWidget) {
    this[inWidget].setBorder(1);
    this[inWidget].setBorderColor("#ABB8CF");
  },
  keydown: function(e) {
    if (e.keyCode == dojo.keys.ENTER) {
      this.loginButton.domNode.focus();
    }
  },
  loginButtonClick: function(inSender) {
    // check whether user have selected the remember checkbox
    if(this.seRemember.getDataValue() == true) {
      dojo.cookie("user", this.usernameInput.getDataValue(), {expires: 365});
    }
    this.loginErrorMsg.setCaption("");
    wm.login(
      [this.usernameInput.getDataValue(), this.passwordInput.getDataValue()], 
      null, dojo.hitch(this, "loginFailed"));
  },
  loginFailed: function(inResponse) {
    this.loginErrorMsg.setCaption("Your login attempt has failed. The username or password may be incorrect");
    this.usernameInput.focus();
  },
  
  // ********** SERVICE VAR EVENTS **********
  
  // layer change events
  // ONLY FOR CLEARING EDITORS
  layMainChange: function(inSender, inIndex) {
      try {
        editorArr = this.regEditor();
        // clean editors after registration or reset
        if(inIndex == 1 || inIndex == 4) {
          for(i=0; i<=editorArr.length-1; i++) {
            editorArr[i].clear();
          }
          this.labRegError.setCaption("");
        }
      } catch(e) {
          console.error('ERROR IN layMainChange: ' + e); 
      } 
  },
 
  svSetTenantSuccess: function(inSender, inData) {
      try {
        switch(inData) {
          case 0: this.ncSuccess.update();
                  break;
          case 1: this.labRegError.setCaption("Please check your email format!");
                  break;
          case 2: this.labRegError.setCaption("Email or Username already registered!");
                  break;
        };
      } catch(e) {
          console.error('ERROR IN svSetTenantSuccess: ' + e); 
      } 
  },

  _end: 0
});