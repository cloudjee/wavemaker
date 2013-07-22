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

dojo.provide("wm.base.widget.TwitterFeed");
dojo.require("wm.base.widget.FeedList");

dojo.declare("wm.TwitterFeed", wm.FeedList, {
	width:'100%',
	twitterId:'',
    consumerKey: '',
    consumerSecret: '',
    accessToken: '',
    accessTokenSecret : '',
    classNames: 'wmfeedlist wmtwitterlist',
    serviceName: "TwitterFeedService",
    registerFeedService : "registerTwitterFeedService",
	init: function() {
		this.inherited(arguments);
	},
    build : function() {
        this.inherited(arguments);
        if(this.isDesignLoaded()) {
            studio.webService.requestAsync("getProperties", [this.serviceName], dojo.hitch(this, function(inData) {
                this.consumerKey = inData.OAuthConsumerKey ? inData.OAuthConsumerKey : '';
                this.consumerSecret = inData.OAuthConsumerSecret ? inData.OAuthConsumerSecret : '';
                this.accessToken = inData.OAuthAccessToken ? inData.OAuthAccessToken : '';
                this.accessTokenSecret = inData.OAuthAccessTokenSecret ? inData.OAuthAccessTokenSecret : '';
            }));
        }
    },
    setConsumerKey : function(inValue) {
        this.consumerKey = inValue? inValue : '';
        studio.webService.requestAsync("setProperty", [this.serviceName,"OAuthConsumerKey", this.consumerKey]);
    },
    setConsumerSecret : function(inValue) {
        this.consumerSecret = inValue? inValue : '';
        studio.webService.requestAsync("setProperty", [this.serviceName,"OAuthConsumerSecret", this.consumerSecret]);
    },
    setAccessToken : function(inValue) {
        this.accessToken = inValue? inValue : '';
        studio.webService.requestAsync("setProperty", [this.serviceName,"OAuthAccessToken", this.accessToken]);
    },
    setAccessTokenSecret : function(inValue) {
        this.accessTokenSecret = inValue? inValue : '';
        studio.webService.requestAsync("setProperty", [this.serviceName,"OAuthAccessTokenSecret", this.accessTokenSecret]);
    },
	setTwitterId: function(inValue){
		this.twitterId = inValue;
        if (this.validate()){
			this.update();
		} else {
			this.clear();
		}
	},
    designTimeMandatoryFields:function () {
        return (this.consumerKey && this.consumerKey != '') && (this.consumerSecret && this.consumerSecret != '') &&
            (this.accessToken && this.accessToken != '') && (this.accessTokenSecret && this.accessTokenSecret != '');
    },
    validate: function() {
        if ((this.twitterId && this.twitterId != '') && (!this.isDesignLoaded() || this.designTimeMandatoryFields())) {
            return true;
        }
        return false;
    },
    getParamsForServiceVariable: function() {
        return [this.twitterId];
    },
    getFeedItemTitleContent: function(inTitle, inLink) {
        return inTitle;
    },
    onclick: function(inEvent, inItem) {
    }
});

wm.Object.extendSchema(wm.TwitterFeed, {
	url: {ignore:true, hidden:true, type: "String", bindTarget: 1},
	twitterId: {bindable: 1, group: "edit", order: 30},
    consumerKey: {group: "Oauth Details", requiredGroup:1, order: 30},
    consumerSecret: {group: "Oauth Details", requiredGroup:1, order: 30},
    accessToken: {group: "Oauth Details", requiredGroup:1, order: 30},
    accessTokenSecret: {group: "Oauth Details", requiredGroup:1, order: 30}
});

wm.TwitterFeed.description = "A twitter feed.";
