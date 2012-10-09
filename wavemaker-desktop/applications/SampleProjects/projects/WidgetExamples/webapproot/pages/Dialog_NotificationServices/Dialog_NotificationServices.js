dojo.declare("Dialog_NotificationServices", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},
    // Called by onClick event for basicButton
    basicButtonClick: function(inSender) {
	  try {
		  this.buttonPushVar.setValue('dataValue',this.buttonPushVar.getValue('dataValue')+1);
		  
	  } catch(e) {
		  console.error('ERROR IN basicButtonClick: ' + e); 
	  } 
  },
    confirmNotOk: function(inSender, inResult) {
    	this.confirmResponseLabel.setCaption("OK Pressed");
    },
	confirmNotCancel: function(inSender) {
		this.confirmResponseLabel.setCaption("OK NOT Pressed");
	},
	promptNotCancel: function(inSender) {
		this.promptResponseLabel.setCaption("Canceled");

	},
	promptNotOk: function(inSender, inResult) {
		   this.promptResponseLabel.setCaption("User entered " + inResult);

	},
	_end: 0
});