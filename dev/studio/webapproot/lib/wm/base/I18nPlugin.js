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
	if (inProps && inProps.owner && inProps.owner.getDictionaryItem)
	    var entry = inProps.owner.getDictionaryItem(inProps.name);
	if (entry) 
	    inProps = dojo.mixin(inProps, entry);
	this.i18nSocket(arguments);
    },
    getDictionaryItem: function(name, params) {
	if (!this._i18nDictionary) {
	    if (this.owner && this.owner.getDictionaryItem)
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

