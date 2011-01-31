dojo.declare("Main", wm.Page, {
  start: function() {
    if (location.search.indexOf("resetPassword") >= 0) {
      this.gotoResetPasswordLayer.update();
    }
  },
  createAccountBtnClick: function(inSender, inEvent) {
    this.errorMsg.setCaption("");
    if (this.emailInput.isValid()) {
      this.createUser.update();
    } else {
      this.errorMsg.setCaption("You have entered an incorrect email.");
    }
  },
  createUserSuccess: function(inSender, inData) {
    if (inData == false) {
      this.errorMsg.setCaption("The email specified is already in use by another user, please enter a different one.");
    } else {
      this.gotoCreateAccountSuccessLayer.update();
    }
  },
  gotoCreateAccountSuccessLayerSuccess: function(inSender, inData) {
    this.thankYouMsg.setValue("html", "Thank you for your registration.  We've sent an email to " + this.emailInput.getDataValue() + " with a password that allows you to log in to Cloud Studio.");
  },
  resetPasswordBeforeUpdate: function(inSender, ioInput) {
    this.pwResetErrorMsg.setCaption("");
    if (!this.pwResetEmailInput.isValid()) {
      this.pwResetErrorMsg.setCaption("You have entered an incorrect email.");
    }
  },
  resetPasswordSuccess: function(inSender, inData) {
    if (inData == false) {
      this.pwResetErrorMsg.setCaption("You have entered an incorrect email.");
    } else {
      this.gotoResetPasswordSuccessLayer.update();
    }
  },
  gotoResetPasswordSuccessLayerSuccess: function(inSender, inData) {
    this.pwResetMsg.setCaption("An email has been sent to " + this.pwResetEmailInput.getDataValue() + " containing your new password.");
  },
  resetDoneButtonClick: function(inSender, inEvent) {
      try {
         var result = (location+"").match(/loginUrl\=(.*)/);
         var url  = unescape(result[1]);

         window.location = url;
      } catch(e) {
          console.error('ERROR IN resetDoneButtonClick: ' + e); 
      } 
  },
  emailInputEnterKeyPress: function(inSender) {
      try {
          this.createAccountBtnClick();
          
      } catch(e) {
          console.error('ERROR IN emailInputEnterKeyPress: ' + e); 
      } 
  },
  pwResetEmailInputEnterKeyPress: function(inSender) {
      try {
          this.resetDoneButtonClick();
          
      } catch(e) {
          console.error('ERROR IN pwResetEmailInputEnterKeyPress: ' + e); 
      } 
  },
  _end: 0
});