/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.TwitterFeed");
dojo.require("wm.base.widget.FeedList");

dojo.declare("wm.TwitterFeed", wm.FeedList, {
	width:'100%',
	twitterId:'',
	init: function() {
		this.inherited(arguments);
		this.url = '';
	},
	setTwitterId: function(inValue){
		this.twitterId = inValue;
		if (this.twitterId && this.twitterId != '')
		{
			this.url = 'http://search.twitter.com/search.atom?q=' + this.twitterId;
			this.update();
		}
		else
		{
			this.clear();
		}
	}
});

wm.Object.extendSchema(wm.TwitterFeed, {
	url: {hidden:true, type: "String", bindTarget: 1},
	twitterId: {bindable: 1, group: "edit", order: 30}
});

wm.TwitterFeed.description = "A twitter feed.";
