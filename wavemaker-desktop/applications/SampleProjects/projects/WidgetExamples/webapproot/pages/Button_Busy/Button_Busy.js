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
dojo.declare("Button_Busy", wm.Page, {
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},
    waitServiceVarBeforeUpdate: function(inSender, ioInput) {
      try {
        this.labelBusy.setCaption("");		  
		  
	  } catch(e) {
		  console.error('ERROR IN waitServiceVarBeforeUpdate: ' + e); 
	  } 
    },
	filmLiveVarSuccess: function(inSender, inDeprecated) {
	  try {
        this.labelBusy.setCaption("Finished reading film information from database.");    		  
		  
	  } catch(e) {
		  console.error('ERROR IN filmLiveVarSuccess: ' + e); 
	  } 
  },
  filmLiveVarBeforeUpdate: function(inSender, ioInput) {
	  try {
       this.labelBusy.setCaption("Starting database query."); 		  
		  
	  } catch(e) {
		  console.error('ERROR IN filmLiveVarBeforeUpdate: ' + e); 
	  } 
  },
  _end: 0
});