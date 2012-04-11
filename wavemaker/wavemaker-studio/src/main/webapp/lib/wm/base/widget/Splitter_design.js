/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Splitter_design");
dojo.require("wm.base.widget.Splitter");
dojo.require("wm.base.widget.Bevel_design");
/*
wm.Splitter.extend({
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "layout":
				return makeSelectPropEdit(inName, inValue, ["top", "left", "bottom", "right"], inDefault);
		}
		return this.inherited(arguments);
	}
});
*/
wm.Object.extendSchema(wm.Splitter, {
    /* Display group; layout subgroup */
    minimum: { group: "widgetName", subgroup: "behavior", order: 1},
    maximum: { group: "widgetName", subgroup: "behavior", order: 5},

    /* Ignored group */
    left: {ignore: 1},
    height: {ignore: 1},
    top: {ignore: 1},
    mode: {ignore: 1},
    border: {ignore: 1},
    borderColor: {ignore: 1},
    margin: {ignore: 1},
    padding: {ignore: 1},
    minWidth:   { ignore: 1 },
    minHeight:   { ignore: 1 },
    layout: {ignore: 1}

});

