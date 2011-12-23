/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.DatumList");

dojo.declare("wm.DatumList", wm.Widget, {
	data: "",
	init: function() {
		this.inherited(arguments);
		this.render();
	},
	getData: function() {
		if (dojo.isString(this.data)) {
			var d = this.owner.$[this.data];
			if (!d)
				return null;
			this.data = d;
		}
		return this.data;
	},
	render: function() {
		this.domNode.innerHTML = "yeah, baby, yeah";
	}
});

