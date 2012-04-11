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

dojo.provide("wm.base.widget.gadget.YouTube");
dojo.require("wm.base.widget.gadget.Gadget");


dojo.declare("wm.gadget.YouTube", wm.Gadget, {
    videoId: "http://youtu.be/Zmqu39fzPxY",
    autoScroll: true,
    build: function() {
	this.inherited(arguments);
	dojo.attr(this.domNode, "frameborder", 0);
	dojo.attr(this.domNode, "allowfullscreen", "true");
    },
    getSource: function() {
	if (!this.videoId || this._isDesignLoaded)
	    return "";
	var id = this.videoId || "";
	id = id.replace(/^.*\//,"");
	id = id.replace(/^watch\?v\=/,"");
	return "http://www.youtube.com/embed/" + id;
    },
    setVideoId: function(inId) {
	this.videoId = inId;
	this.setSource(this.getSource());
    }
});

wm.Object.extendSchema(wm.gadget.YouTube, {
    videoId: {bindTarget: 1, group: "display", subgroup: "behavior", requiredGroup: 1}
});
