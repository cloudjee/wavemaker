dojo.declare("Main", wm.Page, {
	"preferredDevice": "desktop",
    start: function(backState, locationState) {

        /* Take the locationState, a representation of the query string of the URL, and restore state.
         * Most state is automatically restored via properties, but the grid selection requires some
         * custom code
         */
       if (locationState && locationState["main.mainPageContainer"]) {
           this.mainMenuGrid.selectByQuery({dataValue: locationState["main.mainPageContainer"]});
       } else {
           this.mainMenuGrid.select(0);
       }
    },
 
    mainMenuGridSelect: function(inSender) {
      this.mainPageContainer.setPageName(inSender.selectedItem.getValue("dataValue"));
    },
  _end: 0
});