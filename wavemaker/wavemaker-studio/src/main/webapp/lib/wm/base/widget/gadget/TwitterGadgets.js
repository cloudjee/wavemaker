/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.gadget.TwitterGadgets");
dojo.require("wm.base.widget.gadget.Gadget");


/* https://dev.twitter.com/docs/follow-button */
dojo.declare("wm.gadget.TwitterFollowButton", wm.Gadget, {
    scrim: true,
    autoScroll:false,
    width: "300px",
    height: "20px",
    screenName: "WaveMakerDev",
    showFollowerCount: true,
    buttonColor: "blue",
    linkColor: "",
    textColor: "",
    build: function() {
	this.inherited(arguments);
	dojo.attr(this.domNode, "frameborder", 0);
	dojo.attr(this.domNode, "scrolling", "no");
	dojo.attr(this.domNode, "allowtransparency", "true");
    },
    getSource: function() {
	return "http://platform.twitter.com/widgets/follow_button.html?" + 
	    "screen_name=" + this.screenName +
	    "&button=" + this.buttonColor + 
	    (this.linkColor ? "&link_color=" + this.linkColor.substring(1) : "") +
	    (this.textColor ? "&text_color=" + this.textColor.substring(1) : "") +
	    "&show_count=" + this.showFollowerCount + 
	    "&lang=" + dojo.locale;
    },
    setScreenName: function(inId) {
	this.screenName = inId;
	this.setSource(this.getSource());
    },
    setButtonColor: function(inVal) {
	this.buttonColor = inVal;
	this.setSource(this.getSource());
    },
    setLinkColor: function(inVal) {
	this.linkColor = inVal;
	this.setSource(this.getSource());
    },
    setTextColor: function(inVal) {
	this.textColor = inVal;
	this.setSource(this.getSource());
    },
    setShowFollowerCount: function(inVal) {
	this.showFollowerCount = Boolean(inVal);
	this.setSource(this.getSource());
    }
});

wm.Object.extendSchema(wm.gadget.TwitterFollowButton, {
    screenName: {bindTarget: 1, group: "widgetName", subgroup: "data"},
    buttonColor: {group: "widgetName", subgroup: "style", options: ["blue","grey"]},
    showFollowerCount: {group: "widgetName", subgroup: "layout", type: "Boolean"},
    linkColor: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker"},
    textColor: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker"}
});



/* https://dev.twitter.com/docs/tweet-button */
dojo.declare("wm.gadget.TwitterTweetButton", wm.Gadget, {
    scrim: true,
    autoScroll:false,
    width: "100px",
    height: "20px",
    url: "http://dev.wavemaker.com/", 
    via: "",
    countPosition: "horizontal", // none, horizontal, vertical
    build: function() {
	this.inherited(arguments);
	dojo.attr(this.domNode, "frameborder", 0);
	dojo.attr(this.domNode, "scrolling", "no");
	dojo.attr(this.domNode, "allowtransparency", "true");
    },
    getSource: function() {
	return "http://platform.twitter.com/widgets/tweet_button.html?" + 
	    "url=" + escape(this.url) + 
	    "&count=" + this.countPosition +
	    (this.via ? "&via=" + this.via : "");
    },
    setUrl: function(inId) {
	this.url = inId;
	this.setSource(this.getSource());
    },
    setVia: function(inVal) {
	this.via = inVal;
	this.setSource(this.getSource());
    },
    setCountPosition: function(inVal) {
	this.countPosition = inVal;
	this.setSource(this.getSource());
	if (this._isDesignLoaded) {
	    switch(inVal) {
	    case "vertical":
		this.setWidth("56px");
		this.setHeight("63px");
		break;
	    case "horizontal":
		this.setWidth("100px");
		this.setHeight("20px");
		break;
	    case "none":
		this.setWidth("55px");
		this.setHeight("20px");
		break;
	    }
	}
    }
});

wm.Object.extendSchema(wm.gadget.TwitterTweetButton, {
    url: {bindTarget: 1, group: "widgetName", subgroup: "data"},
    via: {bindTarget: 1, group: "widgetName", subgroup: "data"},
    countPosition: {group: "widgetName", subgroup: "layout", options: ["none", "horizontal", "vertical"]}
});


dojo.declare("wm.gadget.TwitterList", wm.Control, {
    scrim: true,
    width: "250px",
    height: "300px",
    screenName: "WaveMakerDev", /* Bindable */
    title: "Your title",
    search: "WaveMaker",
    _version: 2,
    twitterActivity: "profile",
    postCount: 10, // rpp
    pollInterval: 30, // seconds; name: interval
    shellTextColor: "#ffffff",
    shellBackground: "#333333",
    tweetTextColor: "#ffffff",
    tweetBackground: "#000000",
    tweetLinkColor: "#4aed05",
    twitterScrollbar: true,
    twitterLoop: false, /* Don't know what this does */
    twitterPollingEnabled: true,
    twitterBehavior: "all",
    build: function() {
	this.inherited(arguments);
	if (!window["TWTR"]) {
	    var tag = document.createElement("script");
	    tag.src = "http://widgets.twimg.com/j/2/widget.js";
	    var head = document.getElementsByTagName("head")[0];
	    head.appendChild(tag);
	}
    },
    postInit: function() {
	this.inherited(arguments);
	this.initTwitterWidget();
    },
    initTwitterWidget: function() {
	if (!window["TWTR"]) {
	    wm.job(this.getRuntimeId() + ".LoadLib", 50, dojo.hitch(this, "initTwitterWidget"));
	    return;
	}

var params = {
		id: this.domNode.id,
		version: this._version,
    type: this.twitterActivity,
    search: this.search,
    title: this.title,
		rpp: this.postCount,
		interval: this.pollInterval * 1000,
		width: 'auto',
                height: this.bounds.h,
		theme: {
		    shell: {
			background: this.shellBackground,
			color: this.shellTextColor
		    },
		    tweets: {
			background: this.tweetBackground,
			color: this.tweetTextColor,
			links: this.tweetLinkColor
		    }
		},
		features: {
		    scrollbar: this.twitterScrollbar,
		    loop: this.twitterLoop,
		    live: this.twitterPollingEnabled,
		    behavior: this.twitterBehavior
		}
};

	this._twidget = new TWTR.Widget(params);
	this._twidget.render();
	if (this.twitterActivity == "profile") {
	    this._twidget.setUser(this.screenName);
	}
	this._twidget.start();
	this.connect(this._twidget, "_prePlay", this, "getResults");
	TWTR.Widget.hasLoadedStyleSheet = true;
    },
    getResults: function() {
	var result = this._twidget.results;
	this.onSuccess(result);
    },
    onSuccess: function(inTweetList){},
    setScreenName: function(inVal) {
	this.screenName = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setPostCount:  function(inVal) {
	this.postCount = inVal;
	if (this._twidget)
	    this._twidget.setRpp(this.postCount);
    },
    setPollInterval: function(inVal) {
	this.pollInterval = inVal;
	if (this._twidget)
	    this._twidget.setTweetInterval(this.pollInterval);

    },
    setShellTextColor: function(inVal) {
	this.shellTextColor = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setShellBackground: function(inVal) {
	this.shellBackground = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTweetTextColor: function(inVal) {
	this.tweetTextColor = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTweetBackground: function(inVal) {
	this.tweetBackground = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTweetLinkColor: function(inVal) {
	this.tweetLinkColor = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTwitterScrollbar: function(inVal) {
	this.twitterScrollbar = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTwitterLoop: function(inVal) {
	this.twitterLoop = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setPollingEnabled: function(inVal) {
	this.pollingEnabled = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setTwitterActivity: function(inVal) {
	this.twitterActivity = inVal;
	this.destroyTwitter();
	this.initTwitterWidget();
    },
    setSearch: function(inVal) {
	this.search = inVal;
	if (this._twidget)
	    this._twidget.setSearch(this.search);
    },
    setTitle: function(inVal) {
	this.title = inVal;
	if (this._twidget)
	    this._twidget.setTitle(this.title);
    },
    destroyTwitter: function() {
	if (this._twidget) {
	    this._twidget.destroy();
	    delete this._twidget;
	}

    },
    renderBounds: function() {
	this.inherited(arguments);
	if (this._twidget) {
		this._twidget._fullScreenResize();
/*
	    this._twidget.setDimensions(this.bounds.w,this.bounds.h);
	    this._twidget.render();
	    */
	}
    },
    destroy: function() {
	this.destroyTwitter();
	this.inherited(arguments);
    },
    listProperties: function() {
	var p = this.inherited(arguments);
	p.title.ignoretmp = p.search.ignoretmp =  (this.twitterActivity != "search");
	p.screenName.ignoretmp = (this.twitterActivity != "profile");
	return p;
    }
});
wm.Object.extendSchema(wm.gadget.TwitterList, {
    screenName: {bindTarget: 1, group: "widgetName", subgroup: "data"},
    title: {bindTarget: 1, group: "widgetName", subgroup: "text", ignoreHint: "title is only available when twitterActivity=\"profile\"" },
    search: {bindTarget: 1, group: "widgetName", subgroup: "data", ignoreHint: "search is only available when twitterActivity=\"search\"" },
    twitterActivity: {group: "widgetName", subgroup: "behavior", options: ["profile", "search"]},
    postCount: {group: "widgetName", subgroup: "behavior", order: 100},
    twitterScrollbar: {group: "widgetName", subgroup: "style", order: 101},
    twitterLoop:  {group: "widgetName", subgroup: "behavior", order: 102},
    pollInterval: {group: "widgetName", subgroup: "behavior", order: 110},
    twitterPollingEnabled: {group: "widgetName", subgroup: "behavior", order: 111},

    shellTextColor: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker", order: 200},
    shellBackground: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker", order: 201},
    tweetTextColor: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker", order: 202},
    tweetBackground: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker", order: 203},
    tweetLinkColor: {group: "widgetName", subgroup: "style", editor: "wm.ColorPicker", order: 204},
    twitterBehavior: {ignore:1}
});