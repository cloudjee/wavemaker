dojo.declare("PhoneMain", wm.Page, {
	start: function() {
		
	},
	"preferredDevice": "phone",

	statusChangeButtonClick: function(inSender) {
		if (this.statusEditor1.getDataValue() == "Open") {
            this.statusEditor1.setDataValue("In Progress");
		} else if (this.statusEditor1.getDataValue() == "In Progress") {
            this.statusEditor1.setDataValue("Closed");
		} else {
            this.statusEditor1.setDataValue("Open");            
		}
        this.liveForm1.operation = "update";
        this.liveForm1.saveData();
	},
	detailsLayerShow: function(inSender) {
        this.summaryEditor1.doAutoSize(1,1);
		this.descriptionEditor1.doAutoSize(1,1);
	},
	_end: 0
});