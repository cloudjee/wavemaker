/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
