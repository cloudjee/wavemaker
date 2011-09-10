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

/* mkantor: I presume this file to be obsolete? (4/14/2010) */
dojo.provide("wm.base.widget.Slide");

dojo.declare("wm.Slide", wm.Composite, {
	picture1Click: function(inSender) {
		alert(this.$.picture1.source);
	}
});

wm.Slide.components = {
	panel1: ["wm.Panel", {_classes: {domNode: ["wm_Padding_8px", "wm_BackgroundColor_Purple"]}, box: "v", height: "1flex"}, {}, {
		picture1: ["wm.Picture", {_classes: {domNode: ["wm_BackgroundColor_White"]}, source: "http://itch.selfip.net/images/Sample%20Pictures/Garden.jpg", aspect: "h", width: "96px", height: "1flex"}, {onclick: "picture1Click"}, {}],
		label1: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_TextDecoration_Bold", "wm_Padding_8px", "wm_BackgroundColor_White"]}, height: "14px", autoSize: true}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "caption", source: "picture1.source"}, {}]
			}],
			format: ["wm.DataFormatter", {}, {}]
		}]
	}]
};

wm.publish(wm.Slide, [
	["url", "picture1.source", {group: "Image", bindTarget: 1, bindSource: 1}],
	["showLabel", "label1.showing", {group: "Image", bindTarget: 1, bindSource: 1}],
	["aspect", "picture1.aspect", {group: "Image", bindTarget: 1, bindSource: 1}]
]);

dojo.addOnLoad(function() {
	if (window.registerPackage) {
		registerPackage([ "Composites", "Slide", "wm.Slide", "wm.base.widget.Slide", '', "Slide"]);
	}
});
