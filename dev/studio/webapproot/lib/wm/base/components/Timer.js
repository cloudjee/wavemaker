// TODO: Add it to build system

/*
 *  Copyright (C) 2010-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at 
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.Timer");
dojo.require("wm.base.Component");


dojo.declare("wm.Timer", wm.Component, {
    delay: 500, // number of miliseconds until firing
    repeating: true, // determines whether we're using setInterval or setTimeout
    _timeoutId: 0,
    _intervalId: 0,
    autoStart: false,
    count: 0,
    init: function() {
	this.inherited(arguments);
	if (this.autoStart) {
	    this.startTimer();
	}
    },
    startTimer: function() {
	this.stopTimer();
	this.count = 0;
	if (this.repeating) {
	    this._intervalId = window.setInterval(dojo.hitch(this, "onTimerFire"), this.delay);
	} else {
	    this._timeoutId = window.setTimeout(dojo.hitch(this, "onTimerFire"), this.delay);
	}
    },
    stopTimer: function() {
	if (this._timeoutId) {
	    window.clearTimeout(this._timeoutId);
	    this._timeoutId = 0;
	}
	if (this._intervalId) {
	    window.clearInterval(this._intervalId);
	    this._intervalId = 0;
	}
    },

    // event that gets called each time the timer fires; this is what fires
    // the developer's real code.
    onTimerFire: function() {
	this.count++;
	this.valueChanged("count", this.count);
    },

    // If I have a ServiceVariable, and its onSuccess method points to this timer,
    // the Activate (or is it update?) method is what would be called.  So, onSuccess, the timer starts up.
    activate: function() {
	this.startTimer();
    },
    update: function() {
	this.startTimer();
    },

    // Changes the repeating value, and if the timer was already running
    // restarts the timer
    setRepeating: function(inRepeating) {
	var isRunning = this._timeoutId || this._intervalId;
	if (isRunning)
	    this.stopTimer();
	this.repeating = inRepeating;
	if (isRunning)
	    this.startTimer();
    },
    
    setDelay: function(inDelay) {
	var isRunning = this._timeoutId || this._intervalId;
	if (isRunning)
	    this.stopTimer();
	this.delay = inDelay;
	if (isRunning)
	    this.startTimer();
    }
    
});


wm.Object.extendSchema(wm.Timer, {
    delay: {bindTarget: true},
    count: {bindSource: true, ignore: true}
});