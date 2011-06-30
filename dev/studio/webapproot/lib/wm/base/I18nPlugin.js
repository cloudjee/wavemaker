/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
 

dojo.provide("wm.base.I18nPlugin");
dojo.require("wm.base.Plugin");

wm.getDictionaryItem = function(name, params) {
    if (params == undefined)
	return wm.locale.phrases[name];
    
    var newparams = {};
    for (var i in params)
	newparams[i] = (params[i] === undefined || params[i] === null) ? "" : params[i];
	    return dojo.string.substitute(wm.locale.phrases[name],newparams);	
}

wm.Plugin.plugin("i18n", wm.Component, {
    prepare: function(inProps) {
	if (inProps && inProps.owner)
	    var entry = inProps.owner.getDictionaryItem(inProps.name);
	if (entry) 
	    inProps = dojo.mixin(inProps, entry);
	if (wm.branding) {
	    var app =  inProps.owner ? inProps.owner.getOwnerApp() : null;
	    if (app && app._brandingDictionary) {
		var owner = inProps.owner;
		var ownerName;
		if (owner == app)
		    ownerName = "app";
		else if (owner instanceof wm.Page)
		    ownerName = owner.declaredClass;
		if (ownerName && app._brandingDictionary[ownerName] && app._brandingDictionary[ownerName][inProps.name]) {
		    var componentProps = app._brandingDictionary[ownerName][inProps.name];
		    var locale = dojo.locale;
		    for (prop in componentProps) {
			var propHash = componentProps[prop];
			if (propHash[locale] !== undefined)
			    inProps[prop] = propHash[locale];
			else if (propHash["default"] !== undefined)
			    inProps[prop] = propHash["default"];
		    }
		}
	    }
	}
	this.i18nSocket(arguments);
    },
    getDictionaryItem: function(name, params) {
	if (!this._i18nDictionary) {
	    if (this.owner)
		return this.owner.getDictionaryItem(name,params);
	    else 
		return "";
	}
	if (params == undefined)
	    return this._i18nDictionary[name];
	else {
	    // undefined as a value can throw errors:
	    var newparams = {};
	    for (var i in params)
		newparams[i] = (params[i] === undefined || params[i] === null) ? "" : params[i];
	    return dojo.string.substitute(this._i18nDictionary[name],newparams);
	}
    }
});

