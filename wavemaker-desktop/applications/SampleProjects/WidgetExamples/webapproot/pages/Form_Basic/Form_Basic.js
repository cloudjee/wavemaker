dojo.declare("Form_Basic", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			// Initialize form
            this.liveForm2.beginDataInsert();
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	_end: 0
});