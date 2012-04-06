/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
 

dojo.declare("EC2Dialog", wm.Page, {
        i18n: true,
	connHandle: null,

	start: function() {

	},
	okButtonClick: function(inSender, inEvent) {
		if (this.accessKeyId.getDataValue() == undefined || this.accessKeyId.getDataValue() == null || this.accessKeyId.getDataValue() == "" ||
			this.secretAccessKey.getDataValue() == undefined || this.secretAccessKey.getDataValue() == null 
			|| this.secretAccessKey.getDataValue() == "") return;
	},
	cancelButtonClick: function(inSender, inEvent) {
		this.owner.owner.dismiss();	
	},
	_end: 0
});