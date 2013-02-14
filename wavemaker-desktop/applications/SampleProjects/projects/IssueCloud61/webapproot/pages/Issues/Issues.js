dojo.declare("Issues", wm.Page, {
  start: function() {

    // for some reasons dojo.io is not loaded in 6.1.7
    dojo.require("dojo.io.iframe");
    // Initialize page variables for browser history
    // save form node
    formObj = {
      node: null,
      btn: null
    };
    
    // save row details
    row = {
      num: -1,
      widget: null,
      deletable: false 
    };
    
    // save mail info
    mail = {
      iid: null,
      type: null
    };

    // init
    this.initPage();
    this.setPanHeight();
    this.initForm();
  },

  
  // ********** OWN FUNCTIONS **********
  // ******** LINK HOVER EVENTS *********

  initBtn: function(inButton) {
    try {  
       inButton.domNode.style.cursor = "pointer";
    } catch(e) {
      console.error('ERROR IN initSubs: ' + e); 
    }    
  }, 
  
  // init all subscriptions
  initPage: function() {
    try {
      // Saves the page object for browser history/back button
      dojo.setObject("iPage", main.pcPages.issues);
      //main.pcPages.setHeight("760px");
      
      // Change cursor to pointer for buttons
      this.initBtn(this.btnSave);
      this.initBtn(this.btnCancel);
      this.initBtn(this.btnNew);
      this.initBtn(this.btnUpdate);                  

      // Change cursor to pointer for links
      this.initBtn(this.labSearchIssue);
      this.initBtn(this.labReturn);      
      this.initBtn(this.labComment);      
      
      // read URL parameter set issue data
      this.loadIssue();
    
    } catch(e) {
      console.error('ERROR IN initSubs: ' + e); 
    }    
  }, 
  
  // clears the editors for layer manage issue
  clearEditors: function() {
    try {
      // clear RTE
      this.rtIssue.clear();
      // removes all rows of the attachment widget
      this.remAllRows();
      // sets rich text editor in read-only mode
      this.rtIssue.setReadonly(true);
      // clear the dataGrid and liveform
      this.lformIssue.clearData();
      this.liveIssue.clearData();
      // hide the update button
      this.btnUpdate.setShowing(false);
      // disables to attach new comments
      this.labComment.setShowing(false);
    } catch(e) {
      console.error('ERROR IN clearEditors: ' + e); 
    }
  },
    
  // load an issue from URL param (i.e. Bookmark)
  loadIssue: function() {
    try {
      obj = dojo.queryToObject(dojo.hash());
      if(obj.page == "issues") {
        // update existing issue
        if(obj.param >= 1) {
          console.log("update");
          // assign issue id to global var
          app.vIssueId.setValue("dataValue", main.getHashParam());  
          // update all other live vars
          this.liveProject.update();
          this.liveUser.update();
          this.liveVersion.update();
          // update issue live var filtered by app.vIssueId
          this.liveIssue.update();
          // shows the update button
          this.btnUpdate.setShowing(true);
          // enables to attach new comments
          this.labComment.setShowing(true);
        } else if(obj.param == 0) {
          // clear editors and attachment list
          this.clearEditors();
          console.log("new");
        }
      }
    } catch(e) {
      console.error('ERROR IN loadIssue: ' + e); 
    }      
  },
  
  // ********** RELATED EDITOR EVENT ********** 

  lupProjectChange: function(inSender, inDisplayValue, inDataValue) {
    try {
      if(inSender.getDataValue()) {
        this.svGetPrefix.update();
        // after selecting a project the version
        // live var needs to be updated
        this.liveProject.update();
        this.liveUser.update();
        this.liveVersion.update();
        // Make sure liveform editors are visible
        this.panelHide.setShowing(true);
        // show help text
        this.labelProject.setCaption('');        
      }
    } catch(e) {
      console.error('ERROR IN lupProjectChange: ' + e); 
    } 
  },
  
    // ********** LIVE VAR EVENT **********
  
  /*
  *  because there is no onchange event of an
  *  texteditor when data gets altered via setDataValue
  *  we have to push the description & path values
  *  into the appropriate widgets
  */
  liveIssueSuccess: function(inSender, inData) {
    try {
      // pass RTE content to the description editor
      this.rtIssue.setDataValue(this.liveIssue.getData()[0].description);
      // retrieves all rows of the attachment widget
      this.recoverRow(this.liveIssue.getData()[0].path);
      // disables click event for attachment widget
      this.setEnableFPic(false);
    } catch(e) {
      console.error('ERROR IN liveIssueSuccess: ' + e); 
    } 
  },

  // ********** LABEL CLICK EVENT **********
  
  labDashboardClick: function(inSender, inEvent) {
    try {
      main.setHash("home");  
    } catch(e) {
      console.error('ERROR IN labSearchIssueClick: ' + e); 
    } 
  },
  labSearchIssueClick: function(inSender, inEvent) {
    try {
      main.setHash("issue");       
    } catch(e) {
      console.error('ERROR IN labSearchIssue1Click: ' + e); 
    } 
  },
  // go to the comment page
  labCommentClick: function(inSender, inEvent) {
    try {
      obj = dojo.queryToObject(dojo.hash());
      if(obj.param >= 1) {
        // sets the global var for comments
        // to 0; 0 = new comment
        app.vCommentId.setValue("dataValue", 0);
        main.setHash("comment");
      }
    } catch(e) {
      console.error('ERROR IN labCommentClick: ' + e); 
    } 
  },
  
  // ********** SERVICE VAR EVENT **********
  
  // delete all files once an issue has been cancelled
  svDeleteAllFilesBeforeUpdate: function(inSender, ioInput) {
    try {
      inSender.input.setValue("inFileNames", this.retFileDetails());       
    } catch(e) {
      console.error('ERROR IN svDeleteAllFilesBeforeUpdate: ' + e); 
    } 
  },
  // after deleting files on the server
  // remove all rows of the attachment widgets
  svDeleteAllFilesSuccess: function(inSender, inData) {
    try {
      this.remAllRows();
      this.clearEditors(); 
    } catch(e) {
      console.error('ERROR IN svDeleteAllFilesSuccess: ' + e); 
    } 
  },
  // delete file on server
  svDeleteFileBeforeUpdate: function(inSender, ioInput) {
    try {
      fileName = row.widget.getValue("caption");
      inSender.input.setValue("inFileName", fileName);    
    } catch(e) {
      console.error('ERROR IN svDeleteFileBeforeUpdate: ' + e); 
    } 
  },
  // delete the row and set a new height
  svDeleteFileSuccess: function(inSender, inData) {
    try {
      this.panHolder.widgets["rowHolder"+row.num].destroy();
      this.setPanHeight();            
    } catch(e) {
      console.error('ERROR IN svDeleteFileSuccess: ' + e); 
    } 
  },
  // gets the file size of a given file
  svGetFileSizeBeforeUpdate: function(inSender, ioInput) {
    try {
      inSender.input.setValue("inFileName", formObj.btn.value);
    } catch(e) {
      console.error('ERROR IN svGetFileSizeBeforeUpdate: ' + e); 
    } 
  },
  // once we have the filesize we add a new row
  svGetFileSizeSuccess: function(inSender, inData) {
    try {
      this.createRows( this.calcRowCount(), 
                       this.svGetFileSize.getData().dataValue , 
                       formObj.btn.value
                     );
      this.setPanHeight(); 
    } catch(e) {
      console.error('ERROR IN svGetFileSizeSuccess: ' + e); 
    } 
  },
  // gets the project id from the related editor
  svGetPrefixBeforeUpdate: function(inSender, ioInput) {
    try {
      if(this.relProject.dataOutput.getData()) {
        inSender.input.setValue("inID", this.relProject.dataOutput.getData().pid);
      } else {
        inSender.input.setValue("inID", -1);
      }
    } catch(e) {
      console.error('ERROR IN svGetPrefixBeforeUpdate: ' + e); 
    } 
  },
  // passes the new issue id to teIssueKey editor
  svGetPrefixSuccess: function(inSender, inData) {
    try {
     this.teIssueKey.setDataValue(inSender.getData().dataValue);
    } catch(e) {
      console.error('ERROR IN svGetPrefixSuccess: ' + e); 
    } 
  },
  // assignes all info for mailing issue to user
  svSendIssueBeforeUpdate: function(inSender, ioInput) {
    try {
      inSender.input.setValue("inMailType", mail.type);
      inSender.input.setValue("inUrl", window.location.href);
      inSender.input.setValue("inID", mail.iid);   
    } catch(e) {
      console.error('ERROR IN svSendIssueBeforeUpdate: ' + e); 
    } 
  },
  // dismiss send wait dialog
  svSendIssueSuccess: function(inSender, inDeprecated) {
    try {
      app.pageDialog.dismiss("WaitDialog");
      main.setHash("home");   
    } catch(e) {
      console.error('ERROR IN svSendIssueSuccess: ' + e); 
    } 
  },
  
  // ********** BUTTON CLICK EVENT **********
  
  // button new click removes all rows
  // of the attachment widget
  btnNewClick: function(inSender, inEvent) {
    try {
      mail.type = "Created";
      this.panEditIssue.beginDataInsert();
    } catch(e) {
      console.error('ERROR IN btnNewClick: ' + e); 
    } 
  },  
  // saves the mail type
  btnUpdateClick: function(inSender, inEvent) {
    try {
      mail.type = "Updated";
      this.panEditIssue.beginDataUpdate();    
    } catch(e) {
      console.error('ERROR IN btnUpdateClick: ' + e); 
    } 
  },
  // save button event; validates all important editors
  // transfers tinyMCE content to description editor to
  // make use of the live form
  btnSaveClick: function(inSender, inEvent) {
    try {
      if(this.teIssueKey.getDataValue() != null) {
        // saves the content of the rich text editor to the description field
        this.teDescription.setDataValue(this.rtIssue.getDataValue());
        // saves the json array of all attached file names to the path field
        this.tePath.setDataValue(this.retFileDetails());
        this.panEditIssue.saveData();
      } 
    } catch(e) {
      console.error('ERROR IN btnSaveClick: ' + e); 
    } 
  },
  // cancel button event; clears all editor including tinyMCE
  btnCancelClick: function(inSender, inEvent) {
    try {
      /*
      *  check whether live form is in insert mode
      *  if instert is cancelled then delete all
      *  attached files from the server
      */
      if(this.lformIssue.getValue("operation") == "insert") {
        this.svDeleteAllFiles.update();
      } 
      this.panEditIssue.cancelEdit(); 
    } catch(e) {
      console.error('ERROR IN btnCancelClick: ' + e); 
    } 
  },
    
  // ********** LIVE FORM EVENT **********
  
  /* 
  *  dis - or enables conrols
  *  @param {boolean} inDecision
  *  true = enabled, false = disabled
  */
  enableControl: function(inDecision) {
    try {
      if(inDecision === true) {
        this.picSave.setShowing(true);
        this.setEnableFPic(true); 
        this.rtIssue.setReadonly(false); 
      } else if(inDecision === false) {
        this.picSave.setShowing(false);
        this.setEnableFPic(false); 
        this.rtIssue.setReadonly(true);
        // set gloabl comment id to -1
        app.vCommentId.setValue("dataValue", -1); 
      }
    } catch(e) {
      console.error('ERROR IN enableControl: ' + e); 
    }  
  },
  // this event is called before the insert database operation is completed
  lformIssueBeginInsert: function(inSender) {
    try {
      // clears all editors & widgets
      this.clearEditors();
      // load all project live var
      this.liveProject.update();
      this.enableControl(true);
      // enables the project editor
      this.relProject.setDisabled(false);
      // sets the date for NOW  
      this.teCreateDate.setDataValue(new Date());
      // Set default select editor values
      this.seIssueType.setDataValue('Bug');
      this.sePriority.setDataValue('Minor');
      this.seStatus.setDataValue('Open');  
      this.neFlag.setDataValue(1);          
      // sets the Showing editor to "SET"
      this.teFlag.setDataValue(1);
      // disable comment link
      this.labComment.setShowing(false);
      // hide editors until project is set
      this.panelHide.setShowing(false);
      // show help text
      this.labelProject.setCaption('First Select Project');
    } catch(e) {
      console.error('ERROR IN lformIssueBeginInsert: ' + e); 
    } 
  },
  // this event is called after the insert database operation is completed
  lformIssueInsertData: function(inSender) {
    try {
      this.enableControl(false);
      this.clearEditors();    
    } catch(e) {
      console.error('ERROR IN lformIssueInsertData: ' + e); 
    } 
  },
  
  // this event is called before the update database operation
  lformIssueBeginUpdate: function(inSender) {
    try {
      this.enableControl(true);
      // disables the project editor
      this.relProject.setDisabled(true);
      // update all other live vars
      this.liveProject.update();
      this.liveUser.update();
    } catch(e) {
      console.error('ERROR IN lformIssueBeginUpdate: ' + e); 
    } 
  },
  // this event is called after the update database operation is completed
  lformIssueUpdateData: function(inSender) {
    try {
      this.enableControl(false);
    } catch(e) {
      console.error('ERROR IN lformIssueUpdateData: ' + e); 
    } 
  },
  
  // this event is called whenever the cancel button is pressed
  lformIssueCancelEdit: function(inSender) {
    try {
      this.enableControl(false);
      this.btnUpdate.setShowing(false);
      this.clearEditors();
    } catch(e) {
      console.error('ERROR IN lformIssueCancelEdit: ' + e); 
    } 
  },

  // this event is called upon successful completion of an insert, 
  // update or delete.
  // invoke svar for sending issue details to mail recipients 
  lformIssueSuccess: function(inSender, inData) {
    try {
      // saves the returning issue id into object
      mail.iid = inData.iid;
      // alert(mail.iid);
      if(mail.iid != null) {
        app.pageDialog.showPage("WaitDialog",true,250,120);
        this.svSendIssue.update();
      }     
    } catch(e) {
      console.error('ERROR IN lformIssueSuccess: ' + e); 
    } 
  },


  
  // ********** GRID EVENT **********
  
  // saves the comment id in global var
  grdCommentSelectionChanged: function(inSender) {
    try {
      if (inSender.hasSelection()) {
        app.vCommentId.setValue("dataValue", inSender.selectedItem.getData().cid);
        main.setHash("comment"); 
      }
    } catch(e) {
      console.error('ERROR IN grdCommentSelectionChanged: ' + e); 
    } 
  },
  // format column to display html text
  grdCommentSetColumns: function(inSender, inColumn, inIndex) {
    try {
      // make a custom formatter for the first column    
      if (inIndex == 0) {       
        inColumn.formatter = function(inDatum, inRowIndex) {  
          if(inDatum != null) {          
            return "<div style=\"height: 50px;\">" + inDatum.replace(/&lt;/g,"<") + "</div>";
          }
        }
      }    
    } catch(e) {
      console.error('ERROR IN grdCommentSetColumns: ' + e); 
    } 
  },
  
  //^^^^^^^^^^^ all functions for the attachment widget ^^^^^^^^^^^
  
  // init HTML input field
  initForm: function() {
    try {
      this.panUpload.domNode.innerHTML = [
        '<form flex="1" box="v" enctype="multipart/form-data" method="post">',
          '<div class="fileinputs">',
          '<input type="hidden" name="method" value="upload" />',
          '<input id="hiddenButton" type="file" name="file" />',
          '</div>',
        '</form>'].join('');
      formObj.node = this.panUpload.domNode.firstChild;
      formObj.btn = dojo.byId("hiddenButton");
    } catch(e) {
      console.error('ERROR IN initForm: ' + e); 
    }
  },
  // creates a new row in the 
  createRows: function(inRow, inFileSize, inFileName) {
    try {
      // create a panel that holds all rows
      this.panHolder.createComponent("rowHolder"+inRow, "wm.Panel", {
        // properties
        width: "1flex", 
        height: "30px"
      },{},{
        // children
        fileLabel: ["wm.Label", {
          // properties
          width: "1flex",
          height: "1flex"
        }],
        sizeLabel: ["wm.Label", {
          // properties
          width: "65px",
          height: "1flex"
        }],
        remPic: ["wm.Picture", {
          // properties
          width: "65px",
          height: "25px"
        }]
      });
      // set properties
      // for panel holder (static)
      this.panHolder.widgets["rowHolder"+inRow].setLayoutKind("left-to-right");
      this.panHolder.widgets["rowHolder"+inRow].setBorderColor("#B1B1B1");
      this.panHolder.widgets["rowHolder"+inRow].setBorder("0,0,1,0");
      this.panHolder.widgets["rowHolder"+inRow].setBorder("0,0,1,0");
      // gets the widget array for this row
      rowArr = this.mapRow("rowHolder"+inRow);
      // for file label - array item 0
      rowArr[0].setCaption(inFileName);
      rowArr[0].domNode.style.fontSize = "12px";
      rowArr[0].domNode.style.textDecoration = "underline";
      rowArr[0].domNode.style.color = "blue";
      rowArr[0].domNode.style.cursor = "pointer";
      rowArr[0].setLink("services/jsFiles.download?method=download&filename="+inFileName);
      // for size label
      rowArr[1].setCaption(inFileSize);
      rowArr[1].domNode.style.fontSize = "12px";
      rowArr[1].domNode.style.color = "black";
      // for picture
      rowArr[2].setSource("resources/images/buttons/remove.png");
      rowArr[2].setHeight("20px");
      rowArr[2].domNode.style.cursor = "pointer";
      // subscribe click event for the picture
      dojo.connect(rowArr[2].domNode, "onclick", dojo.hitch(this, "remRow", rowArr[0], inRow));
    } catch(e) {
      console.error('ERROR IN createRows: ' + e); 
    }
    this.reflow();
  },
  // calculates the rows
  calcRowCount: function() {
    try {
      rowCount = 0;
      for (var th in this.panHolder.widgets) {
        rowCount++;
      }
      // because the first row is the header -1
      return rowCount -1;
    } catch(e) {
      console.error('ERROR IN calcRowCount: ' + e); 
    }
  },
  // returns an array of all rows inlcuding panHeader
  mapFrame: function() {
    try {
      frameArr = new Array();  
      if(this.panHolder.widgets) {
        for(w in this.panHolder.widgets) {
          frameArr.push(w);
        }
      }
      return frameArr;
    } catch(e) {
      console.error('ERROR IN mapFrame: ' + e); 
    }
  },
  // returns an array of widgets of a given row
  mapRow: function(inRowName) {
    try {
      // create an empty array
      frameArr = new Array();
      if(this.panHolder.widgets[inRowName].widgets) {
        for(bb in this.panHolder.widgets[inRowName].widgets) {
          frameArr.push(this.panHolder.widgets[inRowName].widgets[bb]);
        }
      }
      return frameArr;
    } catch(e) {
      console.error('ERROR IN mapRow: ' + e); 
    }
  },
  // file class
  fileDetails: function(inName, inSize) {
    this.name = inName;
    this.size = inSize;
  },
  // 
  retFileDetails: function() {
    try {
      retString = null;
      fDetails = new Array();
      rowArr = this.mapFrame(); 
      fileName = null;
      fileSize = null;
      // step through all rows
      for(i=1; i<rowArr.length; i++) {
        if(this.panHolder.widgets[rowArr[i]]) {
          wArr = this.mapRow(rowArr[i]);
          fileName = wArr[0].getValue("caption");
          fileSize = wArr[1].getValue("caption");
        }
        fDetails.push(new this.fileDetails(fileName, fileSize));
      }
      retString = dojo.toJson(fDetails);
      return retString;
    } catch(e) {
      console.error('ERROR IN retFileDetails: ' + e); 
    }  
  },
  // removes one row of a given row number
  remRow: function(inWidget, inID) {
    try {
      console.log(inWidget);
      console.log(row.deletable);
      if(row.deletable === true) {
        row.widget = inWidget;
        row.num = inID;
        // invoke sVar to delete file
        this.svDeleteFile.update();
      }
    } catch(e) {
      console.error('ERROR IN remRow: ' + e); 
    }   
  },
  // removes all rows (cancel function)
  remAllRows: function() {
    try {
      rowArr = this.mapFrame();
      for(i=1; i<rowArr.length; i++) {
        if(this.panHolder.widgets[rowArr[i]]) {
          this.panHolder.widgets[rowArr[i]].destroy();
        }
      }
      this.setPanHeight();
    } catch(e) {
      console.error('ERROR IN remAllRows: ' + e); 
    }       
  },
  // recovers all rows
  recoverRow: function(inJson) {
    try {
      // remove all rows before recover 
      this.remAllRows();
      if(inJson != null) {
        fileArr = dojo.fromJson(inJson);
        for(i=0; i<fileArr.length; i++) {
        this.createRows( this.calcRowCount(), 
                         fileArr[i].size , 
                         fileArr[i].name
                       ); 
          
        }
        this.setPanHeight();
      }
    } catch(e) {
      console.error('ERROR IN recoverRow: ' + e); 
    }      
  },
  // sets the widget height
  setPanHeight: function() {
    try {
      boxHeight = this.calcRowCount() * 30 + 32;
      this.panHolder.setHeight(boxHeight + "px");
    } catch(e) {
      console.error('ERROR IN setPanHeight: ' + e); 
    }
  },
  // enables or disabales file delete picture
  setEnableFPic: function(inCommand) {
    try {  
      rowArr = this.mapFrame(); 
      for(i=1; i<rowArr.length; i++) {
        if(this.panHolder.widgets[rowArr[i]]) {
          wArr = this.mapRow(rowArr[i]);
          // true = enabled
          if(inCommand === true) {
            row.deletable = true;
            wArr[2].setSource("resources/images/buttons/remove.png");
            wArr[2].domNode.style.cursor = "pointer";
          } else if(inCommand === false) {
            row.deletable = false;
            wArr[2].setSource("resources/images/buttons/remove_dis.png");
            wArr[2].domNode.style.cursor = "default";
          }
        }
      }
    } catch(e) {
      console.error('ERROR IN setEnableFPic: ' + e); 
    }
  },
  // send XHTML request to server to save file
  picSaveClick: function(inSender) {
    try {
      if (!formObj.btn.value) {
        console.debug("Please specify a file to upload.");
        return;
      }     
      dojo.io.iframe.send({
        url: "services/jsFiles.upload",
        form: formObj.node,
        handleAs: "json",
        handle: dojo.hitch(this,"onComplete")
      });
  
    } catch(e) {
      console.error('ERROR IN picture1Click: ' + e); 
    } 
  },
  // invoked after successful upload
  onComplete: function() {
    try {
      this.svGetFileSize.update();
    } catch(e) {
      console.error('ERROR IN onComplete: ' + e); 
    }
  },
  _end: 0
});
