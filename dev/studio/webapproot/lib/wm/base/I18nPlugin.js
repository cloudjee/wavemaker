dojo.provide("wm.base.I18nPlugin");
dojo.require("wm.base.Plugin");

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
	else 
	    return dojo.string.substitute(name,params);
    }
});

wm.Plugin.plugin("i18nPageLoader", wm.PageLoader, {
    loadPageCode: function(inName) {
	var ctor = this.i18nPageLoaderSocket(arguments);
	try {
	    dojo.registerModulePath("language", window.location.pathname.replace(/[^\/]*$/,"language"));
	    dojo.requireLocalization("language", inName);
	    ctor.prototype._i18nDictionary = dojo.i18n.getLocalization("language", inName);
	} catch(e) {}
	return ctor;
    }
});

wm.Plugin.plugin("i18nApplication", wm.Application, {
    init: function() {
	try {
	    dojo.registerModulePath("language", window.location.pathname.replace(/[^\/]*$/,"language"));
	    dojo.requireLocalization("language", "app");
	    this._i18nDictionary = dojo.i18n.getLocalization("language", "app");
	} catch(e){}
	this.i18nApplicationSocket(arguments);
    }
});