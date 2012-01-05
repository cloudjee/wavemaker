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

dojo.provide("wm.base.widget.Html_design");
dojo.require("wm.base.widget.Html");
dojo.require("wm.base.Control_design");
wm.Html.description = "Container for any HTML content.";

wm.Object.extendSchema(wm.Html, {

    /* Display group; layout subgroup */
    autoSize: {ignore:0,advanced:0},

    /* Display group; scrolling subgroup */
    autoScroll: {writeonly: 0},

    /* Display group; text subgroup */
    html: {group: "widgetName", subgroup: "text", order: 100,  type: "String", bindable: 1, editor: "wm.LargeTextArea", editorProps: {height: "250px"}, requiredGroup:1 },

    /* Ignored/writeonly group */
    autoSizeHeight: { writeonly: true},
    autoSizeWidth: {writeonly: true},
    disabled: { ignore: 1 },

    /* Method group */
    setHtml: {method:1}
});

wm.Html.extend({
    themeable: false,
    getAutoSize: function() {
	return (this.autoSizeHeight ? "height" : (this.autoSizeWidth ? "width" : ""));
    }
});