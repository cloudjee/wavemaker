dojo.declare("Chart", wm.Page, {
  start: function() {

    // init page
    this.initPage();
 
  },
  
  // Called by start() function. Init all subscriptions
  initPage: function() {

    try {

      // saves the page object
      dojo.setObject("iPage", main.pcPages.chart);
      // Set cursor style to pointer for button
      this.btnAllProject.domNode.style.cursor = "pointer";
      // Set cursor style to pointer for data grid
      this.grdProject.domNode.style.cursor = "pointer";
      // Set page height
      //main.pcPages.setHeight("700px");    
    } catch(e) {
      console.error('ERROR IN initSubs: ' + e); 
    }    
  }, 
  
  // ********** DATAGRID SELECTED EVENT **********

  // Called by onSelected event for grdProject
  grdProjectSelected: function(inSender, inIndex) {
    try {
      // Navigate to issues page and show selected issue
      main.setHash("issues", inSender.selectedItem.getData().issueId);  
    } catch(e) {
      console.error('ERROR IN grdProjectSelected: ' + e); 
    } 
  },
  
  // ******** BUTTON CLICK EVENTS *********
  
  // Called by onClick event for btnAllProject
  btnAllProjectClick: function(inSender, inEvent) {
    try {
      // Clears selected project from select editor
      this.seProject.clear();    
    } catch(e) {
      console.error('ERROR IN btnAllProjectClick: ' + e); 
    } 
  },
  
  // ******** SELECT EDITOR CHANGE EVENTS *********  

  // Called by onChange event for seProject select Editor  
  seProjectChange: function(inSender) {
    try {
      // Re-run HQL queries to filter by selected project
      this.svGetIssueByCritical.update(); 
      this.svGetIssueByPriority.update();
      this.svGetIssueByType.update();
    } catch(e) {
      console.error('ERROR IN seProjectChange: ' + e); 
    } 
  },
  
  _end: 0
});