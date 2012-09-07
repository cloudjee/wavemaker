dojo.declare("FormDB_Lookups", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
		
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	filmactorLiveForm1BeforeServiceCall: function(inSender, inOperation, inData) {
// MUST DO INSERT NOT UPDATE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*
//inData.film = this.filmSelect.selectedItem.getData();
         //inData.actor= this.actorSelect.selectedItem.getData();
         debugger;
         delete inData.film;
         delete inData.actor;
         delete inSender.liveVariable.data.film;
         delete inSender.liveVariable.data.actor;
         */
	},
	_end: 0
});