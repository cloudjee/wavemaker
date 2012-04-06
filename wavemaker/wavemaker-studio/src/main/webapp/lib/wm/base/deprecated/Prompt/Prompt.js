/*
 * Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 

dojo.provide("wm.studio.pages.Prompt.Prompt");

/* USAGE NOTES
 * promptDialog.page.setTitle("My Title");
 * promptDialog.page.setInstructions("Enter the text");
 * promptDialog.page.setButtonCaption("Somewhat OK");
 * 
 * this.connect(promptDialog.page, "getDataValue", this, "myDialogOKHandler")
 */
dojo.declare("Prompt", wm.Page, {
    title: "Title",
    instructions: "Instructions",
    buttonCaption: "OK",
    value: "",
    start: function() {
	this.setTitle(this.title);
	this.setInstructions(this.instructions);
	this.setButtonCaption(this.buttonCaption);
	this.setValue(this.value);
	this.connect(this.domNode, "keydown", this, "keydown");
	this.editor1.focus();
    },
    show: function() {
      this.editor1.focus();       
    },
    setupOnShow: function() {
	this.connect(this.layoutBox1.parent.parent, "show", this, "show");
      },
    keydown: function(e) {
      if (e.keyCode == dojo.keys.ENTER) {
	this.okButton.domNode.focus();
      }
    },
    setTitle: function(inTitle) {
	this.title = inTitle;
	this.dialogLabel.setCaption(this.title);
    },

    setValue: function(inValue) {
      this.value = inValue;
      this.editor1.setDataValue(this.value);
    },
    setInstructions: function(inInstr) {
      this.instructions = inInstr;
	this.editor1.setCaption(this.instructions);
    },
    setButtonCaption: function(inCaption) {
	this.buttonCaption = inCaption;
	this.okButton.setCaption(this.buttonCaption);
    },
    cancelButtonClick: function(inSender) {
      this.close();
    },

    okButtonClick: function(inSender) {
      this.getResult(this.editor1.getDataValue());
      this.close();
    },
    
    close: function() {
      this.disconnectEvent("getResult");
      wm.fire(this.owner, "dismiss");
    },
    getResult: function(userText) {
    },
    _end: 0
    });
