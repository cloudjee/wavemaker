/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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

dojo.declare("GenericDialog", wm.Page, {
  callback1: null,
  callback2: null,
  callback3: null,
  callback4: null,
  callback5: null,
  callback6: null,
  start: function() {
    
  },
  setupPage: function(title, prompt) {
    this._loadingPage = false; // enables reflow, which also enables calls to renderButton and other key methods
    this.userQuestionLabel.setCaption(prompt);
    this.dialogLabel.setCaption(title);
    this.button1.hide();
    this.button2.hide();
    this.button3.hide();
    this.button4.hide();
    this.button5.hide();
    this.button6.hide();
    this.textInput.hide();
  },
  dismiss: function() {
    this.owner.dismiss();
  },
  setupButton: function(buttonNumb, inLabel, inCallback) {
    var button = this["button" + buttonNumb];
    button.setCaption(inLabel);
    this["callback" + buttonNumb] = inCallback;
    button.setShowing(true);
  },
  button1Click: function(inSender, inEvent) {
      try {
	if (this.callback1) this.callback1();
      } catch(e) {
          console.error('ERROR IN button1Click: ' + e); 
      } 
  },
  button2Click: function(inSender, inEvent) {
      try {
	if (this.callback2) this.callback2();                   
      } catch(e) {
          console.error('ERROR IN button2Click: ' + e); 
      } 
  },
  button3Click: function(inSender, inEvent) {
      try {
	if (this.callback3) this.callback3();                   
      } catch(e) {
          console.error('ERROR IN button3Click: ' + e); 
      } 
  },
  button4Click: function(inSender, inEvent) {
      try {
	if (this.callback4) this.callback4();                  
      } catch(e) {
          console.error('ERROR IN button4Click: ' + e); 
      } 
  },
  button5Click: function(inSender, inEvent) {
      try {
	if (this.callback5) this.callback5();                   
      } catch(e) {
          console.error('ERROR IN button5Click: ' + e); 
      } 
  },
  button6Click: function(inSender, inEvent) {
      try {
	if (this.callback6) this.callback6();                   
      } catch(e) {
          console.error('ERROR IN button6Click: ' + e); 
      } 
  },
  _end: 0
});
