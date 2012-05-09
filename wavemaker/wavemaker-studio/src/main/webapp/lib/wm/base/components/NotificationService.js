/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.components.NotificationService");
dojo.require("wm.base.components.Service");

dojo.declare("wm.NotificationService", wm.Service, {
	/** @lends wm.PhoneGapService.prototype */
	operation: "",
	_operations: {
		alert: {
			parameters: {
			    text: { type: "string" }
			},
		    returnType: "any"
		},
		confirm: {
			parameters: {
			    text: { type: "string" },
			    OKButtonText: {type: "string"},
			    CancelButtonText: {type: "string"}
			},
		    returnType: "any"
		},
		prompt: {
			parameters: {
			    text: { type: "string" },
			    defaultValue: {type: "string"},
			    OKButtonText: {type: "string"},
			    CancelButtonText: {type: "string"}
			},
		    returnType: "StringData"
		},
		warnOnce: {
			parameters: {
			    text: { type: "string" },
			    cookieName: {type: "string"}
			},
		    returnType: "StringData"
		},

		toast: {
			parameters: {
			    text: {type: "string"},
			    duration: {type: "number"},
 			    cssClasses: {type: "string"},
                            dialogPosition: {type: "string"}
			},
			returnType: "any",
			hint: "This operation displays a page in a dialog."
		}
	},
	update: function() {
		this[this.operation]();
	},
        invoke: function(inMethod, inArgs, inOwner) {
	    var m = this[inMethod];
	    var d;
	    if (m) {
		inArgs.push(inOwner);
		var newd = m.apply(this, inArgs);
		if (newd instanceof dojo.Deferred)
		    d  = newd;
	    } else {
		this.onError();
		/* TODO: Localize (probably not needed */
		d.errback("operation: " + inMethod + " does not exist.");
	    }
	    this._deferred = d || new dojo.Deferred();
	    return this._deferred;
	},
    alert: function(text) {
	var d = new dojo.Deferred();
	app.alert(text);
	this.connectOnce(app.alertDialog, "onClose", function() {
	    d.callback();
	});
	return d;
    },
    confirm: function(text, OKButtonText, CancelButtonText) {
	var d = new dojo.Deferred();
	var ok = OKButtonText || wm.getDictionaryItem("wm.Application.CAPTION_ALERT_OK");
	var cancel = CancelButtonText || wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_CANCEL");
	app.confirm(text, 
		    false, 
		    function() {
			d.callback(true);
		    },
		    function() {
			d.errback();
		    },
		    ok,
		    cancel,
		   false);
	return d;
    },
    prompt: function(text, defaultValue, OKButtonText, CancelButtonText) {
	var d = new dojo.Deferred();
	var ok = OKButtonText || wm.getDictionaryItem("wm.Application.CAPTION_ALERT_OK");
	var cancel = CancelButtonText || wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_CANCEL");
	app.prompt(text, 
		    defaultValue,
		    function(inText) {
			d.callback(inText);
		    },
		    function() {
			d.errback();
		    },
		    ok,
		    cancel);
	return d;
    },
    warnOnce: function(text, cookieName) {
	var d = new dojo.Deferred();
	if (!app.warnOnce(cookieName, text)) {
	    d.callback();
	} else {
	    this.connectOnce(app.alertDialog, "onClose", function() {
		d.callback();
	    }) 
	}
	return d;
    },
    toast: function(text, inDuration, cssClasses, toastPosition) {
	var d = new dojo.Deferred();
	app.toastDialog.showToast(text, inDuration, cssClasses, toastPosition);
	this.connectOnce(app.toastDialog, "onClose", function() {
	    d.callback();
	});
	return d;
    }

});

wm.services.add({name: "notificationService", ctor: "wm.NotificationService", isClientService: true, clientHide: true});

dojo.declare("wm.NotificationCall", [wm.Component, wm.ServiceCall], {
    service: "notificationService",
    operation: "alert",

    // this is called if the dialog dismisses normally
    processResult: function(inResult) {
	switch(this.operation) {
	case "alert":
	case "confirm":
	case "prompt":
	case "warnOnce":
	    this.onOk(inResult);
	    break;
	}
	this.onClose();
    },
    // this is called if the user clicks cancel
    processError: function() {
	this.onCancel();
	this.onClose();
    },
    onCancel: function() {},
    onOk: function(inResult) {},
    onClose: function() {}
});

wm.Object.extendSchema(wm.NotificationCall,{
    owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"]},
    service: {ignore: 1, writeonly: 1},
    operation: { group: "data", order: 1},
    updateNow: { ignore: 1},
    queue: {ignore:1},
    clearInput: { group: "operation", operation:1, order: 30},
    input: {group: "data", order: 3, putWiresInSubcomponent: "input", bindTarget: 1, treeBindField: true, editor: "wm.prop.NavigationGroupEditor"},
    inFlightBehavior: {ignore:1},
    autoUpdate: {ignore:1},
    startUpdate: {ignore:1},
    startUpdateComplete: {ignore:1},
    onError: {ignore:1},
    onSuccess: {ignore:1},
    onBeforeUpdate: {ignore:1},
    onCanUpdate: {ignore:1}
});

