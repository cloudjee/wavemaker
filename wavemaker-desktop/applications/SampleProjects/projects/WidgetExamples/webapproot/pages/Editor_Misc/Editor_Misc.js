dojo.declare("Editor_Misc", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			this.richText1.changeOnKey = true;
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	toggleButtonPanel1Change: function(inSender, inButton) {
		this.text4.setReadonly(inButton.caption == "Readonly");
	},
	setValueButtonClick: function(inSender) {
		this.text6.setDataValue((parseInt(this.text6.getDataValue()) || 0) + 1);
	},
	toggleButtonPanel2Change: function(inSender, inButton) {
    	this.text9.setDisabled(inButton.caption == "Disabled");
	},
	_end: 0
});