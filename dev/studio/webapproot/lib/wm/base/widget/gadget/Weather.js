/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.gadget.Weather");
dojo.require("wm.base.widget.gadget.Gadget");

dojo.declare("wm.gadget.Weather", wm.Gadget, {
	zip: '94105',
	source: "http://gmodules.com/ig/ifr?url=http://www.labpixies.com/campaigns/weather/weather.xml&up_degree_unit_type=0&up_city_code=none&up_zip_code=94105&synd=open&w=320&h=224&title=Live+Weather&border=%23ffffff%7C3px%2C1px+solid+%23999999",
	setZip: function(inZip) {
		this.zip = inZip;
		this.update();
	},
	update: function() {
		var rx = new RegExp('up_zip_code=[^&]*&', 'g');
		this.source = this.source.replace(rx, "up_zip_code="+ this.zip + "&");
		this.inherited(arguments);
	}
});

wm.Object.extendSchema(wm.gadget.Weather, {
	zip: { bindable: 1, type: 'String' }
});
