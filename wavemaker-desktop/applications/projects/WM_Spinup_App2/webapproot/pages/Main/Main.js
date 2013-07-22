/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
dojo.declare("Main", wm.Page, {
	"preferredDevice": "desktop",
    start: function() {            
        this.UserName.focus();
    },

    DownloadButton1Click: function(inSender) {
      window.open("http://wavemaker.com/downloads/", "self"); 
    },
  LoginServiceVariableResult: function(inSender, inDeprecated) {
     var successString = 'SUCCESS';
     inSender.getData().dataValue.substring(0,successString.length) === successString ? this.LoginSuccess() : this.LoginError(inSender, inDeprecated);
    },    
  LoginSuccess: function(inSender, inDeprecated) {
      this.endWait();
      this.LaunchStudioserviceVariable.update();
      this.progressBar1.setProgress(0);
      this.waitingLayer.activate();
      this.progressBarTimer.startTimer();
      this._startTimerTime = new Date().getTime();
      this._endTimerTime = this._startTimerTime + 1000 * 120;
    },
  LoginError: function(inSender, inError) {
      this.endWait();
      if(!inError){inError = "The user name or password you entered is incorrect.";}
      this.labelWarning.setCaption(inError);
      this.labelWarning.setShowing(true);
      this.error_warning_spacer_1.setShowing(true);
      this.error_warning_spacer_2.setShowing(true);
      this.loginLayer.activate();
      this.Password.focus();
    },
  progressBarTimerTimerFire: function(inSender) {
    var max = 1000 * 120;
    var elapsed = Math.min(max,new Date().getTime() - this._startTimerTime);
      var progress = 100 * elapsed / max;
      this.progressBar1.setProgress(progress);
    },
  finishProgressBarTimerTimerFire: function(inSender) {
      this.progressBar1.setProgress(this.progressBar1.getProgress() + 4);
      if (this.progressBar1.getProgress() >= 100) {
          this.finishProgressBarTimer.stopTimer();
      }
    },
  getRandomTip: function() {
      var rand = Math.floor(Math.random() * 100);
      var nextTipIndex = rand % this.tipsVar.getCount();
      var tip = this.tipsVar.getItem(nextTipIndex).getValue("dataValue");
      if (tip == this.tipsHtml.html) return this.getRandomTip();
      return nextTipIndex;
  },
  tipsTimerTimerFire: function(inSender) {
        dojo.animateProperty({node: this.tipsHtmlPanel.domNode, 
    					  properties: {opacity: 0},
						  duration: 1500,
						  onEnd: dojo.hitch(this, function() {
                            var item = this.tipsVar.getItem(this.getRandomTip());
                            this.tipsHtml.setHtml(item.getValue("dataValue"));
                            this.tipsPic.setSource(item.getValue("name"));
                            dojo.animateProperty({node: this.tipsHtmlPanel.domNode, 
            				    properties: {opacity: 1},
						        duration: 1500
                            }).play();
						  })}).play();
    },

  LaunchStudioserviceVariableError: function(inSender, inError) {
      this.endWait();
      var error = (inSender.getDataSet().query({name:"ERROR"}).getItem(0) === false) ? inError.message : inSender.getDataSet().query({name:"ERROR"}).getItem(0).getValue("dataValue") 
      this.labelError.setShowing(true);
      this.labelError.setCaption(inError.toString() != "Error" && error.length > 0 ? error : "Unable to deploy Studio to your account");
      this.loginLayer.activate();      
    },
  LaunchStudioserviceVariableSuccess: function(inSender, inDeprecated) {
      this.endWait();
      var result = inSender.getDataSet();
      if (!result || result.query({name:"ERROR"}).getItem(0)) return this.LaunchStudioserviceVariableError(inSender, inSender);
      token = result.query({name:"wavemaker_authentication_token"}).getItem(0).getValue("dataValue");
      url =  result.query({name:"studio_url"}).getItem(0).getValue("dataValue");
      cfdomain =  result.query({name:"domain"}).getItem(0).getValue("dataValue");
      var cookie_expire = new Date();  
      cookie_expire.setTime(cookie_expire.getTime() + 30000);
      dojo.cookie("wavemaker_authentication_token", token, {expires: cookie_expire.toGMTString(), domain: cfdomain});
      window.location = url;
    },
  LogInButtonClick: function(inSender) {
      this.beginWait("Logging in");
      this.labelError.setShowing(false);
      this.labelWarning.setShowing(false);
      this.error_warning_spacer_1.setShowing(false);
      this.error_warning_spacer_2.setShowing(false);
      this.LoginServiceVariable.update();
    },
    beginWait: function(inMsg, inNoThrobber) {
        if (!this.waitMsg) this.waitMsg = {};
        if (!inMsg)
            return;
        this.dialog.setWidth("242px");
        this.dialog.setHeight("115px");
        this.dialog.containerNode.innerHTML = [
            '<table class="wmWaitDialog"><tr><td>',
                inNoThrobber ? '' : '<div class="wmWaitThrobber">&nbsp;</div>',
                '<div class="wmWaitMessage">',
                inMsg,
                '</div>',
                '<br />',
            '</td></tr></table>',
        ''].join('');
        this.dialog.setShowing(true);
                this.waitMsg[inMsg] = 1;
    },
    endWait: function(optionalMsg) {
            if (optionalMsg)
                   delete this.waitMsg[optionalMsg];
                else
                   this.waitMsg = {};

                var firstMsg = "";
                for (var msg in this.waitMsg) {
                   firstMsg = msg;
                   break;
                }
            if (firstMsg) 
           this.beginWait(firstMsg);
                else
           this.dialog.setShowing(false);
    },
  _end: 0
});