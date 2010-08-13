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
dojo.provide("wm.base.widget.gadget.Stocks");
dojo.require("wm.base.widget.gadget.Gadget");

dojo.declare("wm.gadget.Stocks", wm.Gadget, {
	ticker: 'GOOG',
	source: "http://gmodules.com/ig/ifr?url=http://www.tigersyard.com/gadgets/stock.xml&up_price1=200&up_refreshtime=1000&up_symbol1=GOOG&up_shares1=5&up_link=google&synd=open&w=320&h=190&title=Stocks&border=%23ffffff%7C3px%2C1px+solid+%23999999",
	setTicker: function(inTicker) {
		this.ticker = inTicker;
		this.update();
	},
	update: function() {
		var rx = new RegExp('up_symbol1=[^&]*&', 'g');
		this.source = this.source.replace(rx, "up_symbol1="+ this.ticker + "&");
		this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.gadget.Stocks, {
	ticker: { bindable: 1, type: 'String' }
});
