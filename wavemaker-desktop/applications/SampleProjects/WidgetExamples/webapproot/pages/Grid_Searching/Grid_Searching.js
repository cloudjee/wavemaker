dojo.declare("Grid_Searching", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	searchText1Change: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
	  this.countryLiveVar1.setQuery({country: "*" + this.searchText1.getDataValue() + "*",
                                     countryId: ">" + this.searchNumber.getDataValue()});      
	},
  searchNumberChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
      this.countryLiveVar1.setQuery({country: "*" + this.searchText1.getDataValue() + "*",
                                     countryId: ">" + this.searchNumber.getDataValue() });	  
	},
  _end: 0
});