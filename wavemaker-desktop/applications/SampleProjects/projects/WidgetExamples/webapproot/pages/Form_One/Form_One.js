dojo.declare("Form_One", wm.Page, {
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	dojoGrid1PicurlFormat: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
	  try {
		  
		  
	  } catch(e) {
		  console.error('ERROR IN dojoGrid1PicurlFormat: ' + e); 
	  } 
  },
  _end: 0
});