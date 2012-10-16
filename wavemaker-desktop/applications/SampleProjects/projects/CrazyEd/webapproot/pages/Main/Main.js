dojo.declare("Main", wm.Page, {
	start: function() {
	    var api_key = dojo.trim(wm.load("resources/passwords/api_key.txt"));
        app.varAPIKey.setValue("dataValue", api_key);
        this.inherited(arguments);
	},
	"preferredDevice": "tablet",

	_end: 0
});