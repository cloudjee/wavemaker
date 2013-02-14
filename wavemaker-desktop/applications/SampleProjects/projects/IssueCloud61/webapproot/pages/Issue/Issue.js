dojo.declare("Issue", wm.Page, {
  start: function() {

    // invoke functions
    this.initSubs();

  },
  // invokes after the page is ready
  _finishedLoad: function() {
    try {  
      //main.showSpinner("picSpinIssue", false);
     // main.pcPages.setHeight("600px");    
    } catch(e) {
      console.error('ERROR IN finishedLoad {Issue}: ' + e); 
    } 
  },
  
  // ********** OWN FUNCTIONS **********
  
  // init all subscriptions
  initSubs: function() {

    try {
    
      // saves the page object
      dojo.setObject("iPage", main.pcPages.issue);
      
      // create an array that stores buttons
      editorArr = [];
      editorArr[0] = "btnSearch";
      editorArr[1] = "btnClear";
      
      // subscribe hover events for buttons
      for(i=0;i<=1;i++) {
        //this.connect(this[editorArr[i]].domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", iPage[editorArr[i]]));
        //this.connect(this[editorArr[i]].domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", iPage[editorArr[i]]));
        this[editorArr[i]].domNode.style.cursor = "pointer";
      }    
  
      // subscribe hover events for links
      this.connect(this.labManageIssue.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", iPage.labManageIssue));
      this.connect(this.labManageIssue.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", iPage.labManageIssue));
      
      // set the cursor pointers for links
      this.labManageIssue.domNode.style.cursor = "pointer";
      
      // clears all search editors
      this.clearSearchEditors();

    
    } catch(e) {
      console.error('ERROR IN initSubs: ' + e); 
    }    
  }, 
  
  // clears the editors for layer search issue
  clearSearchEditors: function() {
    try { 
      this.teSSummary.clear();
      this.teSProject.clear();
      this.teSPriority.clear();
      this.teSType.clear();
      this.teSStatus.clear();
      this.teSUserReported.clear();
      this.teSUserAssigned.clear();
      this.teSDescription.clear();
      this.teSDateCreatedBefore.clear();
      this.teSDateCreatedAfter.clear();
      this.teSClosedBefore.clear();
      this.teSClosedAfter.clear();
      this.teSVersionReported.clear();
      this.teSVersionFixed.clear();
      this.teSQuick.clear();
    } catch(e) {
      console.error('ERROR IN clearSearchEditors: ' + e); 
    }
  },  
  
  // ********** LINK CLICK EVENT **********
  
  // goes to the issues page 
  // param 0 = nothing selected
  labManageIssueClick: function(inSender, inEvent) {
    try {
     main.setHash("issues", 0);
    } catch(e) {
      console.error('ERROR IN labManageIssuesClick: ' + e); 
    } 
  },
  
  // ********** BUTTON CLICK EVENT **********
  
  // clears all search editors
  btnClearClick: function(inSender, inEvent) {
    try {
      this.clearSearchEditors();
      // clear dataGrid
      this.grdIssues.setDataSet();
    } catch(e) {
      console.error('ERROR IN btnClearClick: ' + e); 
    } 
  },
    
  // ********** GRID EVENT **********
  
  // updates the url with the selected Issue ID
  grdIssuesSelectionChanged: function(inSender) {
    try {
      if (inSender.hasSelection()) {
        main.setHash("issues", inSender.selectedItem.getData()[0].iid);  
      }
    } catch(e) {
      console.error('ERROR IN grdIssuesSelectionChanged: ' + e); 
    } 
  },
  

  // ********** LIVE VAR EVENT **********
  
  // hide issue spinner
  liveUserSuccess: function(inSender, inData) {
    try {
      this._finishedLoad(); 
    } catch(e) {
      console.error('ERROR IN liveUserSuccess: ' + e); 
    } 
  },
  _end: 0
});
