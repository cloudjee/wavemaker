 /*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

dojo.declare("CodeEditorDialog", wm.Page, {
    i18n:true,
    start: function() {

    },
    update: function(inTitle, inCode, inSyntax, inOkCallback, inCancelCallback) {
	this.owner.owner.setTitle(inTitle);
	this.editor.setDataValue(inCode);
	this.editor.setSyntax(inSyntax);
	this.okCallback = inOkCallback;
	this.cancelCallback = inCancelCallback;
    },
    cancelClick: function() {
	if (this.cancelCallback) {
	    this.cancelCallback();
	}
	this.owner.owner.hide();
    },
    okClick: function() {
	if (this.okCallback) {
	    this.okCallback(this.editor.getDataValue());
	}
	this.owner.owner.hide();
    },
    applyClick: function() {
	if (this.okCallback) {
	    this.okCallback(this.editor.getDataValue());
	}
    },

    _end: 0
});