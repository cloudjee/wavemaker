dojo.declare("Project", wm.Page, {
  start: function() {

    this.initSubs();
  },
  // invokes after the page is ready
  _finishedLoad: function() {
    try {  
     // main.showSpinner("picSpinProject", false);
     // main.pcPages.setHeight("600px");    
      this.reflow();
    } catch(e) {
      console.error('ERROR IN finishedLoad {Project}: ' + e); 
    } 
  },
  
  // ********** OWN FUNCTIONS **********
  
  // init all subscriptions
  initSubs: function() {

    // saves the page object
    dojo.setObject("maPage", main.pcPages.project);

    // create an array that stores buttons
    editorArr = [];
    editorArr[0] = "btnPNew";
    editorArr[1] = "btnVNew";
    editorArr[2] = "btnPUpdate";
    editorArr[3] = "btnVUpdate";
    editorArr[4] = "btnPSave";
    editorArr[5] = "btnVSave";
    editorArr[6] = "btnPCancel";
    editorArr[7] = "btnVCancel";
  
    // subscribe hover events for links
    this.connect(this.labVersion.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", maPage.labVersion));
    this.connect(this.labVersion.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", maPage.labVersion));
    this.connect(this.labProject.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", maPage.labProject));
    this.connect(this.labProject.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", maPage.labProject));
    
    // set the cursor pointers for links
    this.labVersion.domNode.style.cursor = "pointer";
    this.labProject.domNode.style.cursor = "pointer";
    
    // subscribe hover events for buttons
    for(i=0;i<=7;i++) {
      //this.connect(this[editorArr[i]].domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", maPage[editorArr[i]]));
      //this.connect(this[editorArr[i]].domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", maPage[editorArr[i]]));
      this[editorArr[i]].domNode.style.cursor = "pointer";
    }

  },

  // ******** BUTTON CLICK EVENTS *********
  
  // checks whether prefix is already in DB
  btnPSaveClick: function(inSender, inEvent) {
    try {
      // 0 means no retured dataset = available
      if(this.svCheckPfx.getCount() > 0) {
        this.labErrorPfx.setCaption("Prefix already given! Please choose another one.");
      } else if(this.svCheckPfx.getCount() == 0) {
        this.editProjectPanel.saveData();
      }    
    } catch(e) {
      console.error('ERROR IN btnVSaveClick: ' + e); 
    } 
  },
  
  // ******** EDITOR ONCHANGE EVENT **********

  // checks the prefix againt DB
  tePrefixChange: function(inSender, inDisplayValue, inDataValue) {
    try {
      this.svCheckPfx.update();     
    } catch(e) {
      console.error('ERROR IN tePrefixChange: ' + e); 
    } 
  },
  
  // ******** LIVE FORM EVENT **********
  
  // ^^^^^^^^^^ for Project ^^^^^^^^^^
  
  // set showing editor to set before new project gets assigned
  lformProjectBeginInsert: function(inSender) {
    try {
      this.teFlag.setDataValue(1);   
    } catch(e) {
      console.error('ERROR IN lformProjectBeginInsert: ' + e); 
    } 
  }, 
  // clears error label after save
  lformProjectInsertData: function(inSender) {
    try {
      this.labErrorPfx.setCaption("");   
    } catch(e) {
      console.error('ERROR IN lformProjectInsertData: ' + e); 
    } 
  }, 
  // clears error label after cancel
  lformProjectCancelEdit: function(inSender) {
    try {
      this.labErrorPfx.setCaption("");   
    } catch(e) {
      console.error('ERROR IN lformProjectCancelEdit: ' + e); 
    } 
  },
  
  // ^^^^^^^^^^ for Version ^^^^^^^^^^
  
  lformVersionBeginInsert: function(inSender) {
    try {
      this.teVFlag.setDataValue(1);   
    } catch(e) {
      console.error('ERROR IN lformVersionBeginInsert: ' + e); 
    } 
  },  
  
  // ******** NAV CALL EVENT ********** 

  ncVersionBeforeUpdate: function(inSender, ioInput) {
    try {
      this.liveProject.update();  
    } catch(e) {
      console.error('ERROR IN ncVersionBeforeUpdate: ' + e); 
    } 
  },
  
  // ******** LIVE VAR EVENT ********** 

  // hide project spinner
  liveProjectSuccess: function(inSender, inData) {
    try {
      this._finishedLoad();    
    } catch(e) {
      console.error('ERROR IN liveProjectSuccess: ' + e); 
    } 
  },
  _end: 0
});