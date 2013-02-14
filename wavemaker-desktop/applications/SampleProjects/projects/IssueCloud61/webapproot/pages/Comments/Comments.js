dojo.declare("Comments", wm.Page, {
  start: function() {
  
    /*
    *  there are 3 ways to activate this page
    *
    *  1. user clicks on the comment link of
    *  the issue page; app.vCommentId = 0
    *
    *  2. user clicks on the datagrid of 
    *  the issue page; app.vCommentId = comment ID
    *
    *  3. user types into url field  #page=comment
    *  (would not load page if app.vCommentId = -1
    */
 
    // init
    this.initSubs();

  },
  // invokes after the page is ready
  _finishedLoad: function() {
    try {  
      // This sets the height of the loaded page in the main screen
      //main.pcPages.setHeight("430px");   
      // If comment is new, start new operation 
      if(app.vCommentId.getValue("dataValue") == 0) {
        this.panControl.beginDataInsert();      
      }
    } catch(e) {
      console.error('ERROR IN finishedLoad {Comments}: ' + e); 
    } 
  },
  
  // ********** OWN FUNCTIONS **********
  
  // init all subscriptions
  initSubs: function() {

    try {

      // saves the page object
      dojo.setObject("iPage", main.pcPages.comments);
      
      // create an array that stores buttons
      editorArr = [];
      editorArr[0] = "btnSave";
      editorArr[1] = "btnCancel";
      editorArr[2] = "btnNew";
      editorArr[3] = "btnUpdate";
      
      // subscribe hover events for buttons
      for(i=0;i<=3;i++) {
        //this.connect(this[editorArr[i]].domNode, "onmouseover", this, dojo.hitch(main, "btnMouseOver", iPage[editorArr[i]]));
        //this.connect(this[editorArr[i]].domNode, "onmouseout", this, dojo.hitch(main, "btnMouseOut", iPage[editorArr[i]]));
        this[editorArr[i]].domNode.style.cursor = "pointer";
      }    
  
      // subscribe hover events for links
      //this.connect(this.labSearchIssue.domNode, "onmouseover", this, dojo.hitch(main, "linkMouseOver", iPage.labSearchIssue));
      //this.connect(this.labSearchIssue.domNode, "onmouseout", this, dojo.hitch(main, "linkMouseOut", iPage.labSearchIssue));
      
      // set the cursor pointers for links
      this.labSearchIssue.domNode.style.cursor = "pointer";
      
      // update live vars
      // HACK - shouldn't have to update livereporter first - this should all be moved to main/app level
      this.liveReporter.update();
      this.svGetID.update();
      this.liveIssue.update();
      
      // load all other data
      this.loadData();

    } catch(e) {
      console.error('ERROR IN initSubs: ' + e); 
    }    
  }, 
  
  // function that invokes live vars
  // accourding to update or new comment
  loadData: function() {
    try {
      // first check comment gloabl var
      // whether it will be a new comment = 0
      // or it will be a updated comment = any comment id
      if(app.vCommentId.getValue("dataValue") == 0) {
        this.clearEditors();      
      } else {
        // update comment live var
        this.liveComment.update();
      }
    } catch(e) {
      console.error('ERROR IN loadData: ' + e); 
    }  
  },
  
  // clears the editors
  clearEditors: function() {
    try {
      this.rtComment.clear();
      // sets rich text editor in read-only mode
      this.rtComment.setReadonly(true);
      // clears the label
      this.labIssue.setCaption("");
      // clear comment live var
      this.liveComment.clearData();
    } catch(e) {
      console.error('ERROR IN clearEditors: ' + e); 
    }
  },
  
  // clears live vars
  clearLVar: function() {
    try {
      this.liveComment.clearData();
      this.liveIssue.clearData();
    } catch(e) {
      console.error('ERROR IN clearLVar: ' + e); 
    }
  },

  // ********** BUTTON CLICK EVENT **********
  
  btnSaveClick: function(inSender, inEvent) {
    try {
      this.teDescription.setDataValue(this.rtComment.getDataValue());
      this.panControl.saveData();     
    } catch(e) {
      console.error('ERROR IN btnSaveClick: ' + e); 
    } 
  },
  
  // ********** LIVE FORM EVENT **********  
  
  // assign all fields to activate save button
  lformCommentBeginInsert: function(inSender) {
    try {
      // enable RTE
      this.rtComment.setReadonly(false);
      //clear RTE
      this.rtComment.clear();
      // set focus to RTE
      this.rtComment.focus();
      // assnigns date of now
      this.teCreateDate.setDataValue(new Date()); 
      // set issue id in related editor
      this.lupIssue.setDataValue(this.liveIssue); 
      // assign reporter id
      this.lupReporter.setDataValue(this.liveReporter); 
      // showing flag is always 1 (at this stage)
      this.teFlag.setDataValue(1);     
    } catch(e) {
      console.error('ERROR IN lformCommentBeginInsert: ' + e); 
    } 
  },
  
  lformCommentBeginUpdate: function(inSender) {
    try {
      // enable RTE
      this.rtComment.setReadonly(false);
      // set focus to RTE
      this.rtComment.focus();    
    } catch(e) {
      console.error('ERROR IN lformCommentBeginUpdate: ' + e); 
    } 
  },
  
  // go back to issues page if comment is cancelled
  lformCommentCancelEdit: function(inSender) {
    try {
      main.setHash("issues",app.vIssueId.getValue("dataValue")); 
      // reset gloable var
      app.vCommentId.setValue("dataValue", -1); 
    } catch(e) {
      console.error('ERROR IN lformCommentCancelEdit: ' + e); 
    } 
  },
  // go back to issues page after save
  lformCommentSuccess: function(inSender, inData) {
    try {
      // send of emails to all involved participients
      this.svSendMail.update();
      main.setHash("issues",app.vIssueId.getValue("dataValue")); 
      // reset gloable var
      app.vCommentId.setValue("dataValue", -1);
    } catch(e) {
      console.error('ERROR IN lformCommentSuccess: ' + e); 
    } 
  },

  // ********** LABEL LINK EVENT ********** 

  labSearchIssueClick: function(inSender, inEvent) {
    try {
      // reset global var
      app.vCommentId.setValue("dataValue", -1);   
      this.clearLVar();
      this.clearEditors();
      main.setHash("issues",app.vIssueId.getValue("dataValue"));          
    } catch(e) {
      console.error('ERROR IN labSearchIssueClick: ' + e); 
    } 
  },
  
  // ********** LIVE VAR EVENT **********  
  
  // display issue key in label
  liveIssueSuccess: function(inSender, inData) {
    try {
      labelText = this.liveIssue.getData()[0].name + " (" +
                  this.liveIssue.getData()[0].summary.substr(0,40) + " ... )";
      this.labIssue.setCaption(labelText);
      this._finishedLoad();
    } catch(e) {
      console.error('ERROR IN liveIssueSuccess: ' + e); 
    } 
  },
  
  // push comment description into RTE
  liveCommentSuccess: function(inSender, inData) {
    try {     
      // push comments into RTE
      this.rtComment.setDataValue(this.liveComment.getData()[0].description);
    } catch(e) {
      console.error('ERROR IN liveCommentSuccess: ' + e); 
    } 
  },
  
  // ********** SERVICE VAR EVENT **********
  
  svSendMailBeforeUpdate: function(inSender, ioInput) {
    try {
      proto = "http://";
      host = window.location.host;
      path = window.location.pathname;
      param = "#page=issues&param="
      id = app.vIssueId.getData().dataValue;
      inSender.input.setValue("inMailType", "Updated");
      inSender.input.setValue("inUrl", proto+host+path+param+id);
      inSender.input.setValue("inID", this.liveIssue.getData()[0].iid); 
    } catch(e) {
      console.error('ERROR IN svSendIssueBeforeUpdate: ' + e); 
    } 
  },

  _end: 0
});