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

dojo.provide("wm.base.lib.text");

wm.textSizePoll = function(inObject, inMethod, inInterval) {
	var f = document.createElement("div");
	with (f.style) {
		top = "0px";
		left = "0px";
		position = "absolute";
		visibility = "hidden";
	}
	f.innerHTML = "TheQuickBrownFoxJumpedOverTheLazyDogNotDojo";
	document.body.appendChild(f);
	var fw = f.offsetWidth;
	var job = function() {
		if (f.offsetWidth != fw) {
			fw = f.offsetWidth;
			dojo.publish("wm-textsizechange");
		}
	}
	window.setInterval(job, inInterval||2000);
	wm.textSizePoll = function() { };
}

dojo.addOnLoad(wm.textSizePoll);
