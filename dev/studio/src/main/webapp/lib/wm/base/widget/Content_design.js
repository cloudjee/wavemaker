/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Content_design");
dojo.require("wm.base.widget.Content");

// design-time only
wm.Content.description = "Displays markup content.";

wm.Object.extendSchema(wm.Content, {
    resource: {group: "display", type: "String", subtype: "File", bindTarget: true, extensionMatch: ["html","txt"] },
    disabled: {ignore: 1},
    allowDuplicateContent: {ignore: 1},
    autoScroll: {group: "scrolling", order: 100},
    content: {group: "display"}
});

wm.Content.extend({
    themeable: false,
	designCreate: function() {
		this.inherited(arguments);
		this.subscribe("wm-markupchanged", dojo.hitch(this, "contentChanged"));
	},
	designDestroy: function() {
		this.releaseContentNode(this.domNode, this.content);
		this.inherited(arguments);
	},
	set_content: function(inContent) {
		var old = this.domNode.firstChild, oldId = this.content;
		this.setContent(inContent);
		// place old node back into studio.markup.domNode
		//(allows changing nodes from content to content 
		// without actually changing markup and triggering a wm-markupchanged)
		this.releaseContentNode(old, oldId);
	},
	releaseContentNode: function(inNode, inContentId) {
		if (inNode && inContentId && !this.allowDuplicateContent) {
			inNode.id = inContentId;
			dojo.publish('wm-content-markupchanged', [inNode]);
		}
	},
	makePropEdit: function(inName, inValue, inDefault) {
		if (inName == "content")
			return makeMarkupIdsPropEdit(inName, inValue, inDefault);
		return this.inherited(arguments);
	}
});
