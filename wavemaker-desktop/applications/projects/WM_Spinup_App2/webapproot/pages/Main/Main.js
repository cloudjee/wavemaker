dojo.declare("Main", wm.Page, {
    start: function() {
            
    },

    DownloadButton1Click: function(inSender) {
      window.open("http://wavemaker.com/downloads/", "self"); 
    },
    
  LoginServiceVariableSuccess: function(inSender, inDeprecated) {
      result = inDeprecated;
      if (!result) return this.LoginServiceVariableError(inSender, "Login Failed");
      url = result.studio_url;
      token = result.wavemaker_authentication_token;
      cfdomain = result.domain;
      dojo.cookie("wavemaker_authentication_token", token, {expires: 30, domain: cfdomain});
      console.log(dojo.cookie("wavemaker_authentication_token"));
      window.location = url;
    },
  LoginServiceVariableError: function(inSender, inError) {
      this.loginLayer.activate();
      app.alert(inError);
    },
  progressBarTimerTimerFire: function(inSender) {
    var max = 1000 * 120;
    var elapsed = Math.min(max,new Date().getTime() - this._startTimerTime);
      var progress = 100 * elapsed / max;
      this.progressBar1.setProgress(progress);
    },
  LogInButtonClick1: function(inSender) {
      this.progressBar1.setProgress(0);
      this.waitingLayer.activate();
      this.progressBarTimer.startTimer();
      this._startTimerTime = new Date().getTime();
      this._endTimerTime = this._startTimerTime + 1000 * 120;
    },
  finishProgressBarTimerTimerFire: function(inSender) {
      this.progressBar1.setProgress(this.progressBar1.getProgress() + 4);
      if (this.progressBar1.getProgress() >= 100) {
          this.finishProgressBarTimer.stopTimer();
      }
    },
  LoginServiceVariableResult: function(inSender, inDeprecated) {            
      this.progressBarTimer.stopTimer();
      this._progressBarStopAt = this.progressBar1.getProgress();
      this.finishProgressBarTimer.startTimer();
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
  _end: 0
});