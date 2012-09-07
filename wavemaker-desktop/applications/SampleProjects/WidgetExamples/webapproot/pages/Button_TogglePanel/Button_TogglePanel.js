dojo.declare("Button_TogglePanel", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	_end: 0
});