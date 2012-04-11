/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

dojo.declare("wm.Dispatcher", wm.Container, {
	domEvents: [ 
		"onclick", 
		"onmousedown", 
		"onmouseup", 
		"onmouseover", 
		"onmouseout", 
		"onmousemove", 
		"onchange", 
		"oncontextmenu", 
		"onkeypress", 
		"onkeydown", 
		"onload"
	],
	constructor: function() {
		this.connects = new wm.Connects(this);
		wm.dispatcher = this;
	},
	destroy: function() {
		this.inherited(arguments);
		this.connects.destroy();
	},
	renderNode: function(inNode) {
		this.inherited(arguments);
		this.connect();
		return this.node;
	},
	connect: function() {
		for (var i=0, e; e=this.domEvents[i]; i++) {
			this.connects.add(this.node, e, "dispatch");
		}
	},
	findDispatchTarget: function(e) {
		var t = e.target, c = null, rid;
	// image.onload has target: document, currentTarget: img (at least on FF2)
		if (t == document)
			t = e.currentTarget;
		while (t && !c) {
			rid = t.rid;
			c = $$[rid];
			t = t.parentNode;
		}
		return c;
	},
	dispatch: function(e) {
		//if (e.type.indexOf("key") >= 0)
		//	console.log(e);
		//if (!(({mousemove:1, mouseover:1, mouseout:1})[e.type]))
		//	console.log(e);
		if ((({load:1})[e.type]))
			console.log(e);
		var c = this.findDispatchTarget(e);
		if (!c)
			return;
		while (c) {
			if (c[e.type])
				if (c[e.type](e) === true)
					break;
			c = c.parent;
		}
		if (e.type == "mousedown" && e.target.tagName != 'INPUT') {
			// generally disable selection
			e.preventDefault();
		}
	}
});

wm.bubble = function(e) {
	kit.fixEvent(e);
	wm.dispatcher.dispatch(e);
};

dojo.declare("wm.CDispatcher", wm.Component, {
	domEvents: [ 
		"onclick", 
		"onmousedown", 
		"onmouseup", 
		"onmouseover", 
		"onmouseout", 
		"onchange", 
		"oncontextmenu", 
		"onkeypress", 
		"onkeydown", 
		"onload"
	],
	create: function() {
		this.connects = new wm.Connects();
		wm.dispatcher = this;
	},
	destroy: function() {
		this.inherited(arguments);
		this.connects.destroy();
	},
	setNode: function(inNode) {
		this.connects.setTarget(inNode);
		this.connect();
	},
	connect: function(inNode) {
		for (var i=0, e; e=this.domEvents[i]; i++) {
			this.connects.add(this.node, e, "dispatch");
		}
	},
	findDispatchTarget: function(e) {
		var t = e.target, c = null, id;
		while (t && !c) {
			id = t.id;
			c = $$[id];
			t = t.parentNode;
		}
		return c;
	},
	dispatch: function(e) {
		//if (e.type.indexOf("key") >= 0)
		//	console.log(e);
		var c = this.findDispatchTarget(e);
		if (!c)
			return;
		while (c) {
			if (c[e.type])
				if (c[e.type](e) === true)
					break;
			c = c.parent;
		}
		if (e.type == "mousedown" && e.target.tagName != 'INPUT') {
			// generally disable selection
			e.preventDefault();
		}
	}
});
