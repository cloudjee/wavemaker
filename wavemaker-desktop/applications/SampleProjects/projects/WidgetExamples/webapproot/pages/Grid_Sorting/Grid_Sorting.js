dojo.declare("Grid_Sorting", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	selectMenu1Change: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
	  app.empLiveVar.sort(inDisplayValue);
	},
  _end: 0
});