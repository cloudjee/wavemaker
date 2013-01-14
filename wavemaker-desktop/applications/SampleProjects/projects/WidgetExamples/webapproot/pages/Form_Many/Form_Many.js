/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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
dojo.declare("Form_Many", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		try {
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	dojoGrid4PicurlFormat: function( inValue, rowId, cellId, cellField, cellObj, rowObj) {
	  try {
         // Formats a picture to have a max height of 40px
           return '<img  style="height: 40px;" src="' + inValue + '" />';		  
		  
	  } catch(e) {
		  console.error('ERROR IN dojoGrid4PicurlFormat: ' + e); 
	  } 
  },
  _end: 0
});