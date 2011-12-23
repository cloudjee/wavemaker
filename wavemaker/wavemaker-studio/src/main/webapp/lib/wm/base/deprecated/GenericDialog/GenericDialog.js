/*
 * Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
