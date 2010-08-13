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
dojo.provide("wm.base.components.ImageList");
dojo.require("wm.base.Component");

dojo.declare("wm.ImageList", wm.Component, {
	width: 32,
	height: 32,
	colCount: 100,
	url: "",

	getImageHtml: function(inIndex) {
		var col = inIndex % this.colCount;
		var row = Math.floor(inIndex / this.colCount);
	        var url = this.url;
	        if(this.isDesignLoaded() && this.owner != studio) {
		    url = "/" + studio.projectPrefix + studio.project.getProjectPath() + "/" + url;
		}
		return '<image src="' + wm.theme.getImagesPath() + 'blank.gif"' +
			' width="' + this.width + '"' + 
			' height="' + this.height + '"' + 
			' style="' +
			'vertical-align: middle; ' + 
			'background:url(' + url + ') no-repeat ' + (-this.width * col) + 'px ' + (-this.height * row) + 'px;"' +
			'>';
	}
});

wm.Object.extendSchema(wm.ImageList, {
    url: { group: "display", bindable: 1, type: "String", subtype: "File", order: 10, focus: 1, extensionMatch: ["jpg","jpeg","gif","png","tiff"]  }
});
