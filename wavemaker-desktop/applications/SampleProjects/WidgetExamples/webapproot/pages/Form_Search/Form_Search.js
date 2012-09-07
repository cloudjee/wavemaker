dojo.declare("Form_Search", wm.Page, {
	start: function() {
		try {
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	_end: 0
});