/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Enterprise.
 *  You may not use this file in any manner except through written agreement with WaveMaker Software, Inc.
 *
 */ 

dojo.provide("wm.base.I18nPlugin");
dojo.require("wm.base.Plugin");

wm.getDictionaryItem = function(name, params) {
    if (params == undefined)
	return wm.locale.phrases[name];
    else
	    return dojo.string.substitute(wm.locale.phrases[name],params);	
}

wm.Plugin.plugin("i18n", wm.Component, {
    prepare: function(inProps) {
	if (inProps && inProps.owner)
	    var entry = inProps.owner.getDictionaryItem(inProps.name);
	if (entry) 
	    inProps = dojo.mixin(inProps, entry);
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

/*
wm.Plugin.plugin("i18nPageLoader", wm.PageLoader, {
    loadPageCode: function(inName) {
	var ctor = this.i18nPageLoaderSocket(arguments);
	try {
	    dojo.requireLocalization("language", inName);
	    ctor.prototype._i18nDictionary = dojo.i18n.getLocalization("language", inName);
	} catch(e) {}
	return ctor;
    }
});
*/
wm.Plugin.plugin("i18nApplication", wm.Application, {
    init: function() {
	try {
	    dojo.requireLocalization("language", "app");
	    this._i18nDictionary = dojo.i18n.getLocalization("language", "app");
	} catch(e){}
	this.i18nApplicationSocket(arguments);
    }
});