/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
dojo.provide("wm.base.layout.console");

adaptConsole = function(inNode, inFlex){
	var n = inNode || document.getElementById("console");
	var f = window.consoleFrame;
	if (!f) { 
		if (n) 
			n.parentNode.removeChild(n);
	} else {
		f.flex = inFlex;
		var n = inNode || document.getElementById("console");
		if (n) {
			if (n.flex)
				f.flex = n.flex;
			n.parentNode.insertBefore(f, n);
			n.parentNode.removeChild(n);
		}
		if (!f.flex) {
			f.style.height = "96px";
			console.layout();
		}
		var s = new wm.Splitter({/*parentNode: document.body,*/layout: "bottom"});
		f.parentNode.insertBefore(s.domNode, f);
		//dojo.connect(f, "onboundschange", console, "layout");
		dojo.connect(f, "onboundschange", function() { setTimeout(console.layout, 100); });
	}
};

dojo.addOnLoad(function() {
	//adaptConsole();
});
