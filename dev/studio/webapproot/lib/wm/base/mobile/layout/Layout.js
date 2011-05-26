/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.mobile.layout.Layout");

// bc only
wm.inLayout = function(inNode) {
	if (!inNode)
		return false;
	var s = inNode.style;
	return s &&
		s.zIndex >=0 && s.zIndex <= 1
		&& s.display != 'none'
		&& s.visibility != 'hidden'
		&& inNode.tagName != 'SCRIPT'
		&& inNode.nodeType == 1;
}

dojo.declare("wm.layout.Base", null, {
	inFlow: function(inControl) {
		return inControl.showing && (inControl.inFlow !== false) &&
		      (inControl._forceShowing /*|| wm.inLayout(inControl.domNode)*/); //bc only
	},
	flow: function(inContainer) {
	},
	suggest: function(inContainer, inControl, ioInfo) {
	},
	suggestSize: function(inContainer, inControl, ioInfo) {
	},
	insert: function(inTarget, inControl, inInfo) {
	}
});

dojo.mixin(wm.layout, {
	registry: {},
	cache: {},
	register: function(inName, inClass) {
		this.registry[inName] = inClass;
	},
	addCache: function(inName, inObj) {
		this.cache[inName] = inObj;
	},
	listLayouts: function() {
		var list = [];
		for (var n in this.registry) {
			list.push(n);
		}
		return list;
	}
});
