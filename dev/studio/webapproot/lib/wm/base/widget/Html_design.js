/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
    disabled: { ignore: 1 },
    autoSizeHeight: {type: "Boolean", group: "advanced layout", order: 31, writeonly: true},
    autoSizeWidth: {type: "Boolean", group: "advanced layout", order: 32, shortname: "Auto Size", writeonly: true},
    autoSize: {group: "advanced layout", order: 31, options: ["none", "width", "height"]},
    autoScroll: {ignore: 0},
    html: { type: "String", bindable: 1, group: "display", order: 100, focus: true, editor: "wm.LargeTextArea", editorProps: {height: "300px"} },
    setHtml: {method:1}
});

wm.Html.extend({
    themeable: false,
    getAutoSize: function() {
	return (this.autoSizeHeight ? "height" : (this.autoSizeWidth ? "width" : ""));
    }
});