dojo.declare("Editor_Dates", wm.Page, {
	start: function() {
		try {
            // Initialize min date for date editor
            var today = new Date();
            this.dateMin.minimum = today;
            // Initialize max date for date editor to be one month from today
            var maxDate = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
            this.dateMin.maximum = maxDate;
            this.dateMin.createEditor();	
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	_end: 0
});