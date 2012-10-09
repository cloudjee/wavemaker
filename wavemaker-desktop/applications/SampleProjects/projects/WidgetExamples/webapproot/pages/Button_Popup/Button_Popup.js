dojo.declare("Button_Popup", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

  popupMenuButton1Click: function(inSender) {
	  try {
          this.popupLabel.setCaption(this.popupMenuButton1.caption);          
		  this.popupButtonDialog.show();
		  
	  } catch(e) {
		  console.error('ERROR IN popupMenuButton1Click: ' + e); 
	  } 
  },
  _end: 0
});