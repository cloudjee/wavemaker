dojo.declare("Social_Map", wm.Page, {
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
  _end: 0
});