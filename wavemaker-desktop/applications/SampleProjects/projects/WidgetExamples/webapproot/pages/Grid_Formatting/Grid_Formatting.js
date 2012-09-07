dojo.declare("Grid_Formatting", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

    empFormatGridPicurlFormat: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
	  try {
           // Formats a picture to have a max height of 40px
           return '<img  style="height: 40px;" src="' + inValue + '" />';		  
		  
	  } catch(e) {
		  console.error('ERROR IN empFormatGridPicurlFormat: ' + e); 
	  } 
  },
  _end: 0
});