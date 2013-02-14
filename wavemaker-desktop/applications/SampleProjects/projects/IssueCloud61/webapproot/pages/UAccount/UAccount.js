dojo.declare("UAccount", wm.Page, {
  start: function() {
  

    // create user object
    user = {
      email: null
    }

    this.initSubs();

  },
  // invokes after the page is ready
  _finishedLoad: function() {
    try {  
      //main.showSpinner("picSpinUAccount", false);
      //main.pcPages.setHeight("600px");    
      this.reflow();
    } catch(e) {
      console.error('ERROR IN finishedLoad {UAccount}: ' + e); 
    } 
  },
  
  // ********** OWN FUNCTIONS **********

  // init all subscriptions
  initSubs: function() {

    // saves the page object
    dojo.setObject("uaPage", main.pcPages.uAccount);

    // subscribe hover events for buttons
    /*
    this.connect(this.btnUpdate.domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", uaPage.btnUpdate));
    this.connect(this.btnUpdate.domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", uaPage.btnUpdate));
    this.connect(this.btnSave.domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", uaPage.btnSave));
    this.connect(this.btnSave.domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", uaPage.btnSave));
    this.connect(this.btnCancel.domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", uaPage.btnCancel));
    this.connect(this.btnCancel.domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", uaPage.btnCancel));
    this.connect(this.btnNew.domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", uaPage.btnNew));
    this.connect(this.btnNew.domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", uaPage.btnNew));
    */
    
    // set the cursor pointers for buttons
    this.btnUpdate.domNode.style.cursor = "pointer";
    this.btnSave.domNode.style.cursor = "pointer";
    this.btnCancel.domNode.style.cursor = "pointer";
    this.btnNew.domNode.style.cursor = "pointer";
  },

  
  /**
  *  because a tenant assigns a new user
  *  the username should be generic as
  *  the user will change it to its own needs
  *  together with the password after the first login
  *  The username contains the date of creation and is
  *  therefore unique
  */
  retUserName: function() {
    try {
      date = new Date();
      return "user" + date.getTime();
    } catch(e) {
      console.error('ERROR IN retUserName: ' + e); 
    }  
  },
  
  
  // ********** BUTTON CLICK EVENTS **********
  
  /** 
  *  sets the editPanel in edit mode
  *  gets a random password from server
  *  creates a unique username
  */
  btnNewClick: function(inSender, inEvent) {
    try {
      this.editPanel.beginDataInsert();
    } catch(e) {
      console.error('ERROR IN newButton1Click: ' + e); 
    } 
  },
  // clear the error message
  btnCancelClick: function(inSender, inEvent) {
    try {
      this.labError.setCaption("");
      this.editPanel.cancelEdit();   
    } catch(e) {
      console.error('ERROR IN btnCancelClick: ' + e); 
    } 
  },
  
  // ********** EDITOR CHANGE EVENT **********  
  
  // clear the error message
  teEmailFocus: function(inSender, inDisplayValue, inDataValue) {
    try {
      this.labError.setCaption("");   
    } catch(e) {
      console.error('ERROR IN teEmailFocus: ' + e); 
    } 
  },
  
  // ********** GRID SELECTED EVENT **********
  
  // saves the email to the user class
  grdUAccountSelected: function(inSender, inIndex) {
    try {
      user.email = this.grdUAccount.selected.getData().email;    
    } catch(e) {
      console.error('ERROR IN grdUAccountSelected: ' + e); 
    } 
  },

  // ********** SERVICE VAR EVENTS **********

  // creates a 6 character password
  svGetPassBeforeUpdate: function(inSender, ioInput) {
    try {
      inSender.input.setValue("passLength",6);  
    } catch(e) {
      console.error('ERROR IN svGetPassBeforeUpdate: ' + e); 
    } 
  },
  // saves the new password in user class
  svGetPassSuccess: function(inSender, inData) {
    try {
      this.tePass.setDataValue(inSender.getData().dataValue);
    } catch(e) {
      console.error('ERROR IN svGetPassSuccess: ' + e); 
    } 
  },
  // validate email against email format like xx@xx.xx
  // true if the format matches
  svValidateEmailSuccess: function(inSender, inData) {
    try {
      if(inSender.getData().dataValue === true) {
        // invoke another svar to check email against DB
        if(this.lformUAccount.operation == "insert") {
          this.svCheckEmail.update();
        } else if(this.lformUAccount.operation == "update") {
          // if the email of the user class not the same as 
          // the email of the email editor also check email against DB 
          if(user.email != this.teEmail.getDataValue()) {
            this.svCheckEmail.update();
          } else {
            this.editPanel.saveData();
          }
        }
      } else if(inSender.getData().dataValue === false) {
        this.labError.setCaption("Invalid email format!");
      }
    } catch(e) {
      console.error('ERROR IN svValidateEmailResult: ' + e); 
    } 
  },
  // check whether email is already registered in DB
  // if not dataset can be saved
  // false: if the email is not in DB
  svCheckEmailSuccess: function(inSender, inData) {
    try {
      if(inSender.getData().dataValue === false) {
        this.editPanel.saveData();
      } else if(inSender.getData().dataValue === true) {
        this.labError.setCaption("Email already registered!");
      }   
    } catch(e) {
      console.error('ERROR IN svCheckEmailSuccess: ' + e); 
    } 
  },
  // send email to the newly created or updated user
  svSendMailBeforeUpdate: function(inSender, ioInput) {
    try {
      app.pageDialog.showPage("WaitDialog",true,250,120);
      inSender.input.setValue("username", this.lformUAccount.getItemData().getData().email);  
      inSender.input.setValue("password",this.lformUAccount.getItemData().getData().password);  
      inSender.input.setValue("email",this.lformUAccount.getItemData().getData().email);      
    } catch(e) {
      console.error('ERROR IN svSendMailBeforeUpdate: ' + e); 
    } 
  },
  // after sending email the live var can be reloaded
  svSendMailSuccess: function(inSender, inDeprecated) {
    try {
      this.liveUser.update();   
    } catch(e) {
      console.error('ERROR IN svSendMailSuccess: ' + e); 
    } 
  },

  // ********** LIVE VAR EVENTS ********** 
  
  // once users are loaded the wait dailog can be dismissed
  liveUserSuccess: function(inSender, inData) {
    try {
      this._finishedLoad();
      app.pageDialog.dismiss("WaitDialog");       
    } catch(e) {
      console.error('ERROR IN liveUserSuccess: ' + e); 
    } 
  },
  
  // ********** LIVE FORM EVENTS ********** 

  // this event is called before insert
  lformUAccountBeginInsert: function(inSender) {
    try {
      // gets a new password from server
      this.svGetPass.update();
      // formulate a new user name
      this.teUserName.setDataValue(this.retUserName());
      // sets the date of today
      this.teCreateDate.setDataValue(new Date());
      // clear error label
      this.labError.setCaption(""); 
    } catch(e) {
      console.error('ERROR IN lformUAccountBeginInsert: ' + e); 
    } 
  },

  // this event is called after insert or update
  lformUAccountSuccess: function(inSender, inData) {
    try {
      // send off email to user
      this.svSendMail.update();   
    } catch(e) {
      console.error('ERROR IN lformUAccountSuccess: ' + e); 
    } 
  },


  _end: 0
});