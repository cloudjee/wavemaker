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

dojo.provide("wm.base.components.PhoneGapService");
dojo.require("wm.base.components.Service");

dojo.declare("wm.PhoneGapService", wm.Service, {
	/** @lends wm.PhoneGapService.prototype */
	operation: "",
	_operations: {
		contacts_read: {
			parameters: {
			    filter: { type: "string" }
			},
		    returnType: "[phonegap.Contact]"
		},
		contacts_delete: {
			parameters: {
			    id: { type: "number" }
			},
		    returnType: "any"
		},
		contacts_save: {
			parameters: {
			    contact: { type: "phonegap.Contact" }
			},
		    returnType: "any"
		},
	    notification_beep: {
			parameters: {
			    times: { type: "number" }
			},
		    returnType: "any"
		},
	    notification_vibrate: {
			parameters: {
			    miliseconds: { type: "number" }
			},
		    returnType: "any"
	    },
	    capture_audio: {
		parameters: {}, // TODO Support the limit property so we can return multiple images
		returnType: "StringData"
	    },
	    capture_picture: {
		parameters: {}, // TODO Support the limit property so we can return multiple images
		returnType: "StringData"
	    },
	    geolocation_getCurrentPosition: {
		parameters: {
		    enableHighAccuracy: {type: "boolean"},
		    timeout: {type: "number"}, // phonegap example uses value of 5000
		    maximumAge: {type: "number"} // phonegap example uses value of 3000 though I think our users could use something on the order of 1-5 minutes (convert to miliseconds before using here)
		},
		returnType: "phonegap.Coordinates"
	    }
	},
	update: function() {
		this[this.operation]();
	},
        invoke: function(inMethod, inArgs, inOwner) {
		var
			d = this._deferred = new dojo.Deferred(),
			m = this[inMethod];
	       
		if (m) {
		    inArgs.push(inOwner);
		    var newd = m.apply(this, inArgs);
		    if (newd instanceof dojo.Deferred)
			d = this._deferred = newd;
		} else {
			this.onError();
		        /* TODO: Localize (probably not needed */
			d.errback("operation: " + inMethod + " does not exist.");
		}
		return d;
	},
    geolocation_getCurrentPosition: function(enableHighAccuracy, timeout, maximumAge) {
	var d = new dojo.Deferred();
	if (window["PhoneGap"]) {
	    navigator.geolocation.getCurrentPosition(
		dojo.hitch(this, function(inResult) {
		    d.callback(inResult.coords);
		}),
		function(inError) {
		    d.errback(inError);
		},
		{enableHighAccuracy: enableHighAccuracy,
		 timeout: timeout,
		 maximumAge: maximumAge});
	}
	return d;
    },
    capture_audio: function(times) {
	var d = new dojo.Deferred();
	if (window["PhoneGap"]) {
	    navigator.device.capture.captureAudio(
		dojo.hitch(this, function(inResult) {
		    //alert("Audio Capture Success:"+inResult.length);
		    var filePath = inResult[0].fullPath;
		    var name = inResult[0].name;
		    this.readDataUrl(filePath, d);
		}),
		function(inError) {
		    this.handleCaptureError(inError.code, d);
		},
		{limit: 1});
	}
	return d;
    },
    capture_picture: function(times) {
	var d = new dojo.Deferred();
	if (window["PhoneGap"]) {
	    navigator.device.capture.captureImage(
		dojo.hitch(this, function(inResult) {
		    console.log("Image Capture Success");
		    var filePath = inResult[0].fullPath;
		    var name = inResult[0].name;
		    this.readDataUrl(filePath, d);
		}),		
		dojo.hitch(this, function(inError) {
		    this.handleCaptureError(inError.code, d);
		}),
		{limit: 1});
	}
	return d;
    },
    handleCaptureError: function(inErrorCode, d) {
	switch(inErrorCode) {
	case 20:
	    d.errback("CAPTURE_NOT_SUPPORTED");
	    break;
	case 0:
	    d.errback("CAPTURE_INTERNAL_ERR");
	    break;
	case 1:
	    d.errback("CAPTURE_APPLICATION_BUSY");
	    break;
	case 2:
	    d.errback("CAPTURE_INVALID_ARGUMENT");
	    break;
	case 3:
	    d.errback("CAPTURE_NO_MEDIA_FILES");
	    break;
	default:
	    d.errback(inError.code);
	}
    },
    readDataUrl: function(file, deferred) {
        var reader = new FileReader();
        reader.onload = function(evt) {
	    //alert("File Length: " + evt.target.result.length);
	    deferred.callback(evt.target.result);
        };
	reader.onabort = reader.onerror = function(evt) {
	    console.error("Reader Error:"+evt);
	    deferred.errback(evt);
	}
        reader.readAsDataURL(file);
    },
    notification_beep: function(times) {
	var d = new dojo.Deferred();
	d.callback();
	if (window["PhoneGap"]) {
	    navigator.notification.beep(times);
	}
	return d;
    },
    notification_vibrate: function(miliseconds) {
	var d = new dojo.Deferred();
	d.callback();
	if (window["PhoneGap"]) {
	    navigator.notification.vibrate(miliseconds);
	}
	return d;
    },
    contacts_delete: function(id) {
	var d = new dojo.Deferred();
	if (window["PhoneGap"]) {
	    var contact = navigator.contacts.create();
	    contact.id = id;
	    //alert("DELETE " + id);
	    contact.remove(function(inResult) {
		//alert("DELETE SUCCESS");
					    d.callback(inResult);
					},
					function(inError) {
					    console.error("ERROR: " + inError);
					    d.errback(inError);
					});
	}
	return d;
    },
    contacts_save: function(inContact) {
	var d = new dojo.Deferred();
	if (window["PhoneGap"]) {
	    var contact = navigator.contacts.create();
	    for (var prop in inContact) {
		if (typeof inContact[prop] != "object") {
		    contact[prop]  = inContact[prop];
		}
	    }
	    contact.name = new ContactName();
	    for (var prop in inContact.name) {
		contact.name[prop] = inContact.name[prop];
	    }

	    contact.addresses = [];
	    dojo.forEach(inContact.address, function(inAddress) {
		var a = new ContactAddress();
		for (var prop in inAddress) {
		    a[prop] = inAddress[prop];
		}
		contact.addresses.push(a);
	    });

	    contact.phoneNumbers = [];
	    dojo.forEach(inContact.phoneNumbers, function(inPhone) {
		var a = new ContactField(inPhone.name, inPhone.dataValue, false);
		contact.phoneNumbers.push(a);
	    });

	    contact.emails = [];
	    dojo.forEach(inContact.emails, function(inPhone) {
		var a = new ContactField(inPhone.name, inPhone.dataValue, false);
		contact.emails.push(a);
	    });


	    contact.urls = [];
	    dojo.forEach(inContact.urls, function(inPhone) {
		var a = new ContactField(inPhone.name, inPhone.dataValue, false);
		contact.urls.push(a);
	    });


	    contact.organization = new ContactOrganization();
	    for (var prop in inContact.organization) {
		contact.organization[prop] = inContact.organization[prop];
	    }

	    contact.save(
		function(inResult) {
		    //alert("Save Success");
		    d.callback(inResult);
		},
		function(inError) {
		    console.error("ERROR: " + inError);
		    d.errback(inError);
		});
	}
	return d;
    },
    contacts_read: function(filter) {
	var d = new dojo.Deferred();
	    if (window["PhoneGap"]) {
		var options = new ContactFindOptions();
		if (filter != undefined && filter !== "")
		    options.filter=filter ; 
		options.multiple = true;

		var fields = ["displayName", "name", "nickname", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "note", "photos", "categories", "urls"];
		navigator.contacts.find(fields,
					function(inResult) {
					    var normalize = function(inItems) {
						var result = [];
						if (inItems) {
						    dojo.forEach(inItems, function(item) {
							result.push( {name: item.type,
								      dataValue: item.value});
						    });
						}
						return result;
					    }
					    for (var i = 0; i < inResult.length; i++) {
						inResult[i].phoneNumbers = normalize(inResult[i].phoneNumbers);
						inResult[i].emails = normalize(inResult[i].emails);
						inResult[i].urls = normalize(inResult[i].urls);
						//inResult[i].categories = normalize(inResult[i].categories);
						//inResult[i].photos = normalize(inResult[i].photos);

					    }
					    d.callback(inResult);
					},
					function(inError) {
					    console.error("ERROR: " + inError);
					    d.errback(inError);
					},
					options);

	    }
	return d;
    }

});

wm.services.add({name: "phoneGapService", ctor: "wm.PhoneGapService", isClientService: true, clientHide: true});
wm.typeManager.addType("phonegap.Contact", {internal: false, 
					    fields: {
						id: {type: "number", order: 1, 
						     "exclude": ["insert"],
						     "include": ["delete", "read", "update"],
						     "noChange": ["delete", "read", "update"],
						     required: true
						    },
						//displayName: {type: "string", order: 2}, a return field but not a writable field
						name:  {type: "phonegap.ContactName", required: true},
						nickname:  {type: "string", order: 4},
						phoneNumbers: {type: "EntryData", isList: true, order: 5},
						emails:  {type: "EntryData", isList: true, order: 6, hidden: true},
						addresses: {type: "phonegap.Address", isList: true, order: 7, hidden: true},
						ims: {type: "EntryData", isList: true, order: 8, hidden: true},
						organizations: {type: "phonegap.ContactOrganization", isList: true, order: 9, hidden: true},
						birthday: {type: "date", order: 10},
						note: {type: "string", order: 11},
						photos: {type: "StringData", isList: true, order: 12, hidden: true},
						categories: {type: "StringData", isList: true, order: 13, hidden: true},
						urls: {type: "EntryData", isList: true, order:14, hidden: true}
					    }
					   });
// http://docs.phonegap.com/en/1.4.0/phonegap_contacts_contacts.md.html#ContactAddress
wm.typeManager.addType("phonegap.Address", {internal: false, 
					    fields: {
						pref: {type: "boolean", order: 1},
						type: {type: "string", order: 2},
						formatter: {type: "string", order: 3},
						streetAddress: {type: "string", order: 4},
						locality: {type: "string", order: 5},
						region: {type: "string", order: 6},
						postalCode: {type: "string", order: 7},
						country: {type: "string", order: 8}
					    }
					   });

// http://docs.phonegap.com/en/1.4.0/phonegap_contacts_contacts.md.html#ContactOrganization
wm.typeManager.addType("phonegap.ContactOrganization", {internal: false, 
							 fields: {
							     pref: {type: "boolean", order: 1},
							     type: {type: "string", order: 2},
							     name: {type: "string", order: 3},
							     department: {type: "string", order: 4},
							     title: {type: "string", order: 5}
							 }
							});


// http://docs.phonegap.com/en/1.4.0/phonegap_contacts_contacts.md.html#ContactName
wm.typeManager.addType("phonegap.ContactName", {internal: false, 
						 fields: {
						     formatted: {type: "string", order: 1},
						     familyName: {type: "string", order: 2},
						     givenName: {type: "string", order: 3},
						     middleName: {type: "string", order: 4},
						     honorificPrefix: {type: "string", order: 5},
						     honorificSuffix: {type: "string", order: 6}
						 }
						});

// http://docs.phonegap.com/en/1.4.1/phonegap_geolocation_geolocation.md.html#Coordinates
wm.typeManager.addType("phonegap.Coordinates", {internal: false, 
					     fields: {
						latitude: {type: "number", order: 1},
						longitude: {type: "number", order: 2},
						altitude: {type: "number", order: 3},
						accuracy: {type: "number", order: 4},
						altitudeAccuracy: {type: "number", order: 5},
						 heading: {type: "number", order: 6},
						 speed: {type: "number", order: 7}
					    }
					   });



dojo.declare("wm.PhoneGapCall", [wm.ServiceVariable], {
	/** @lends wm.Variable.prototype */
    _deviceReady: false,
	service: "phoneGapService",
    operation: "contacts_read",
        postInit: function() {
	    this.inherited(arguments);
	    document.addEventListener("deviceready", dojo.hitch(this,"_onDeviceReady"), false);
	},
    _onDeviceReady: function() {
	this._deviceReady = true;
	if (this.autoUpdate || this.startUpdate) this.update();
    },
    update: function() {
	if (this._deviceReady) this.inherited(arguments);
    },
    updateInternal: function() {
	if (this._deviceReady) this.inherited(arguments);
    }
});

wm.Object.extendSchema(wm.PhoneGapCall,{
	owner: { group: "common", order: 1, readonly: true, options: ["Page", "Application"]},
    service: {ignore: 1, writeonly: 1},
	operation: { group: "data", order: 1},
	updateNow: { ignore: 1},
    queue: {ignore:1},
    clearInput: { group: "operation", operation:1, order: 30},
    input: {group: "data", order: 3, putWiresInSubcomponent: "input", bindTarget: 1, treeBindField: true, editor: "wm.prop.FieldGroupEditor"}
});

