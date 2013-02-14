dojo.declare("MAccount", wm.Page, {
  start: function() {

    // init page
    this.initSubs();
  },
  // invokes after the page is ready
  _finishedLoad: function() {
    try {  
      //main.showSpinner("picSpinMAccount", false);
      //main.pcPages.setHeight("430px");    
      this.reflow();
    } catch(e) {
      console.error('ERROR IN finishedLoad {MAccount}: ' + e); 
    } 
  },
  
  
  // init all subscriptions
  initSubs: function() {
  
    // saves the page object
    dojo.setObject("maPage", main.pcPages.mAccount);
    
    // create an array that stores buttons
    editorArr = [];
    editorArr[0] = "btnAUpdate";
    editorArr[1] = "btnTUpdate";
    editorArr[2] = "btnASave";
    editorArr[3] = "btnTSave";
    editorArr[4] = "btnACancel";
    editorArr[5] = "btnTCancel";
  
    // subscribe hover events for links
    this.connect(this.labTenantDetail.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", maPage.labTenantDetail));
    this.connect(this.labTenantDetail.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", maPage.labTenantDetail));
    this.connect(this.labUserDetail.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", maPage.labUserDetail));
    this.connect(this.labUserDetail.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", maPage.labUserDetail));
    
    // subscribe hover events for buttons
    for(i=0;i<=5;i++) {
      //this.connect(this[editorArr[i]].domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", maPage[editorArr[i]]));
      //this.connect(this[editorArr[i]].domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", maPage[editorArr[i]]));
      this[editorArr[i]].domNode.style.cursor = "pointer";
    }
    
    // set the cursor pointers for links
    this.labTenantDetail.domNode.style.cursor = "pointer";
    this.labUserDetail.domNode.style.cursor = "pointer";
    
  },

  // ********** LIVE VAR EVENT **********  

  // turns off the wait spinner on main page
  liveUserSuccess: function(inSender, inData) {
    try {
      this._finishedLoad();         
    } catch(e) {
      console.error('ERROR IN liveUserSuccess: ' + e); 
    } 
  },
  
  // ********** LIVE FORM EVENTS **********
  
  // use to show the wait dialog
  lformMyAccountSuccess: function(inSender, inData) {
    try {
      //app.pageDialog.showPage("WaitDialog",true,250,120);  
      this.liveUser.update();
    } catch(e) {
      console.error('ERROR IN lformMyAccountSuccess: ' + e); 
    } 
  },
  
  _end: 0
});