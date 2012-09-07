dojo.declare("Button_Busy", wm.Page, {
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},
    waitServiceVarBeforeUpdate: function(inSender, ioInput) {
      try {
        this.labelBusy.setCaption("");		  
		  
	  } catch(e) {
		  console.error('ERROR IN waitServiceVarBeforeUpdate: ' + e); 
	  } 
    },
	filmLiveVarSuccess: function(inSender, inDeprecated) {
	  try {
        this.labelBusy.setCaption("Finished reading film information from database.");    		  
		  
	  } catch(e) {
		  console.error('ERROR IN filmLiveVarSuccess: ' + e); 
	  } 
  },
  filmLiveVarBeforeUpdate: function(inSender, ioInput) {
	  try {
       this.labelBusy.setCaption("Starting database query."); 		  
		  
	  } catch(e) {
		  console.error('ERROR IN filmLiveVarBeforeUpdate: ' + e); 
	  } 
  },
  _end: 0
});