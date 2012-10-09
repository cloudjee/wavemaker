dojo.declare("FormDB_Objects", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
		
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	saveButton1Click1: function(inSender) {
        if (this.eidEditor1.getDataValue()) {
            this.employeeDojoGrid.dataSet.query({eid: this.eidEditor1.getDataValue()}).getItem(0).setData(this.employeeLiveForm1.dataOutput);
    		this.employeeLiveForm1.setReadonly(true);
            
        }
	},
	_end: 0
});