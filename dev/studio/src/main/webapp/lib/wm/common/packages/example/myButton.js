/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

/*
myButton - An example Custom Widget 

Button changes color and cursor while being hovered without defining CSS classes.
Note: CSS classes are the preferred and more efficient way to change domNode styles.

*/
dojo.provide("wm.packages.example.myButton");
dojo.require("wm.base.widget.Button"); 

dojo.declare("wm.example.myButton", wm.Button, {
	  caption: "Click Me",
  	  link: "http://dev.wavemaker.com",
		
	  init: function() {
	    this.inherited(arguments);
	    this.domNode.style.background = "#e0ecf8";
	    this.connect(this.domNode, "onmouseover", this, "onmouseover");
	    this.connect(this.domNode, "onmouseout", this, "onmouseout");
	  },

	  onclick: function(inEvent) {
	    window.open(this.link);
	  },
   
	  onmouseover: function(inEvent) {
	    this.domNode.style.background = "#81bef7";	
	    this.domNode.style.cursor = "pointer";
	  },

	  onmouseout: function(inEvent) {
	    this.domNode.style.background = "#e0ecf8";
	    this.domNode.style.cursor = "default";
	  },
	  _end: null

});

// Add attributes to show in the WaveMaker Studio properties editor
wm.Object.extendSchema(wm.example.myButton, { 
	link: { type: "String", bindable: 1,group: "display", order: 100 }
});
