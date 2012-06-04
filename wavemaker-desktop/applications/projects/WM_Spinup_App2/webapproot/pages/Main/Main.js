dojo.declare("Main", wm.Page, {
    start: function() {            
    },

    DownloadButton1Click: function(inSender) {
      window.open("http://wavemaker.com/downloads/", "self"); 
    },
  LoginServiceVariableResult: function(inSender, inDeprecated) {
     var successString = 'SUCCESS';
     inSender.getData().dataValue.substring(0,successString.length) === successString ? this.LoginSuccess() : this.LoginError(inSender, inDeprecated);
    //  this.progressBarTimer.stopTimer();
    //  this._progressBarStopAt = this.progressBar1.getProgress();
    //  this.finishProgressBarTimer.startTimer();
    },    
  LoginSuccess: function(inSender, inDeprecated) {
      this.LaunchStudioserviceVariable.update();
      this.progressBar1.setProgress(0);
      this.waitingLayer.activate();
      this.progressBarTimer.startTimer();
      this._startTimerTime = new Date().getTime();
      this._endTimerTime = this._startTimerTime + 1000 * 120;
    },
  LoginError: function(inSender, inError) {
      if(!inError){inError = "The user name or password you entered is incorrect.";}
      this.labelWarning.setCaption(inError);
      this.labelWarning.setShowing(true);
      this.error_warning_spacer_1.setShowing(true);
      this.error_warning_spacer_2.setShowing(true);
      this.loginLayer.activate();
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
      this.labelError.setCaption(inError);
      this.loginLayer.activate();      
    },
  LaunchStudioserviceVariableSuccess: function(inSender, inDeprecated) {
      result = inDeprecated;
      if (!result || result.ERROR) return this.LaunchStudioserviceVariableError(inSender, result.ERROR);
      url = result.studio_url;
      token = result.wavemaker_authentication_token;
      cfdomain = result.domain;
      dojo.cookie("wavemaker_authentication_token", token, {expires: 30, domain: cfdomain});
      console.log(dojo.cookie("wavemaker_authentication_token"));
      window.location = url;


    },
  LogInButtonClick: function(inSender) {
      this.labelError.setShowing(false);
      this.labelWarning.setShowing(false);
      this.error_warning_spacer_1.setShowing(false);
      this.error_warning_spacer_2.setShowing(false);
      this.LoginServiceVariable.update();
    },
  _end: 0
});