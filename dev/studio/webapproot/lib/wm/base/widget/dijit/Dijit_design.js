/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.dijit.Dijit_design");
dojo.require("wm.base.widget.dijit.Dijit");

wm.DijitWrapper.extend({
	designCreate: function() {
		this.inherited(arguments);
		this._designee = this.dijit;
	},
	// FIXME: this is a stop gap to set some properties on the wrapper and some on the designee
	isNativeProp: function(inProp) {
		return inProp in this.nonDijitProps;
	},
	getProp: function(n) {
		if (this.isNativeProp(n))
			this._designee = this;
		var r = this.inherited(arguments);
		this._designee = this.dijit;
		return r;
	},
	setProp: function(n, v) {
		if (this.isNativeProp(n))
			this._designee = this;
		this.inherited(arguments);
		this._designee = this.dijit;
	}, 
	dummy: 0
});

wm.CustomDijit.extend({
    /* For use from the property inspector */
    setRenderBoundsX: function(bind) {
	this.renderBoundsX = bind;
	if (!bind && this.dijit)
	    this.dijit.domNode.style.width = "";
    },
    setRenderBoundsY: function(bind) {
	this.renderBoundsY = bind;
	if (!bind && this.dijit)
	    this.dijit.domNode.style.height = "";
    },
    makeWritableValue: function(dijitValue, simpleValue) {
	if (dijitValue instanceof Date)
	    try {
		return dijitValue.getTime();
	    } catch(e) {return 0;}
	else if (typeof dijitValue == "object")
	    return simpleValue;
	else
	    return dijitValue;
    }
});

wm.DijitDesigner.extend({
    setDijitClass: function(inClass) {
	this.dijitClass = inClass;
	if (this.dijit) {
	    this.dijit.destroy();
	}
	this.initDijit(this.domNode);
	var preferredSize = dojo.marginBox(this.dijit.domNode);
	this.setWidth(preferredSize.w + "px");
	this.setHeight(preferredSize.h + "px");
	/* Reinspect to get the props/events of the new class */
	if (this._isDesignLoaded) {
	    studio.select(studio.page.root);
	    wm.job(this.getRuntimeId() + ".select", 50, dojo.hitch(this, function() {
		studio.select(this);
	    }));
	}
    },
    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	if(this.dijit)
	    this.addToPropList(this.dijit,props);
	return props;
    },
    addToPropList: function(obj, props) {
	var dijitPropList = [];
	for (var propName in obj) {
	    if (propName.indexOf("_") == 0) continue; // private prop
	    if (dojo.indexOf(wm.DijitDesigner.ignorelist, propName) != -1) continue;
	    /* If its property that is already used by our widgets, rename it */
	    var newPropName = "wmdijit" + wm.capitalize(propName);
	    if (propName.indexOf("on") == 0) {
		if (propName.match(/(Mouse|Key)/)) continue; // I'd like to do all events, but there are too many, and all these dojo.connects can get expensive on old browsers
		props["onDijit" + propName.substring(2)] = {isEvent: true};
		this["onDijit" + propName.substring(2)] = function(){};
	    } else if (typeof obj[propName] == "number") {
		dijitPropList.push(newPropName);
		props[newPropName] = {isEvent: false,
				      shortname: propName,
				   group: this.dijitClass,
				   type: "number"};
		this[newPropName] = obj[propName];
	    } else if (typeof obj[propName] == "string") {
		dijitPropList.push(newPropName);
		props[newPropName] = {isEvent: false,
				      shortname: propName,
				   group: this.dijitClass,
				   type: "string"};
		this[newPropName] = obj[propName];
	    } else if (obj[propName] === null) {
		dijitPropList.push(newPropName);
		props[newPropName] = {isEvent: false,
				      type: "string", // open ended type...
				      shortname: propName,
				   group: this.dijitClass};
		this[newPropName] = obj[propName];
	    } else if (typeof obj[propName] == "boolean") {
		dijitPropList.push(newPropName);
		props[newPropName] = {isEvent: false,
				      shortname: propName,
				   group: this.dijitClass,
				   type: "Boolean"};
		this[newPropName] = obj[propName];
	    } else if (obj[propName] instanceof Date) {
		dijitPropList.push(newPropName);
		props[newPropName] = {isEvent: false,
				      shortname: propName,
				   group: this.dijitClass,
				   type: "String"}; // accept dates in various formats...
		this[newPropName] = obj[propName];
	    }
	}
	this.dijitPropList = dijitPropList.join(",");
    },
    makePropEdit: function(inName, inValue, inDefault) {
	/* Component_design uses a checkbox property if the prototype says to. But the prototype of this class won't have dijit props in it
	 * so handle boolean dijit props here.
	 */
	if (!this.schema[inName] && this.listProperties()[inName].type == "Boolean") {
	    return makeCheckPropEdit(inName, inValue, inDefault);
	} else {
	    switch(inName) {
	    case "deployDijit":
	    case "undeployDijit":
		return makeReadonlyButtonEdit(inName, inValue, inDefault);
	    }
	    return this.inherited(arguments);
	}
    },
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "deployDijit":
				return this.deployDijit();
			case "undeployDijit":
				return this.undeployDijit();
		}
		return this.inherited(arguments);
	},


    /* TODO: Try replacing wmdijit[propname] with propname where possible  also need the rendering methods in DijitDesigner */
    makeComponentClass: function() {
	var result = [];
	var postInit = ["\tpostInit: function() {", "\t\tthis.inherited(arguments);"];	

	var namespace = "wmdijit";
	var className = this.dijitClass.replace(/.*\./g,"");
	var fullClassName = namespace + "." + className;
	var packageName = "common.packages.wmdijit." + className;

	var extendSchema = ["wm.Object.extendSchema(" + fullClassName + ", {"];


	result.push("dojo.provide('" + packageName + "');");
	result.push("dojo.declare('" + fullClassName + "', wm.CustomDijit, {");
	result.push("\tdijitClass: '" + this.dijitClass + "',");
	result.push("\twidth: '" + this.width + "',");
	result.push("\theight: '" + this.height + "',");
	var props = this.listProperties();
	var useProps = [];
	for (propName in props) {
	    if (propName.indexOf("wmdijit") == 0) {
		var value = this[propName];
		var dijitPropName = wm.decapitalize(propName.substring(7));
		var usePropName =  (!props[dijitPropName] && 
				    !this["get" + wm.capitalize(dijitPropName)] &&
				    !this["set" + wm.capitalize(dijitPropName)] && 
				    dijitPropName != "value") ? dijitPropName : propName.replace(/^wmdijit/,"dijit");
		useProps.push(usePropName);
		if (typeof value == "string")
		    value = '"' + value +'"';
		else if (typeof value == "object")
		    value = null;
		result.push("\t" + usePropName + ": " + value + ",");
		extendSchema.push("\t" + usePropName + ": {group:'" + this.dijitClass + "', type: '" + props[propName].type + "', bindTarget: true},");
	    }
	}
    
	result.push("");
	result.push("/* All Getters */");

	for (var i = 0; i < useProps.length; i++) {
	    var propName = useProps[i];
	    var dijitPropName = (propName.indexOf("dijit") == 0) ? wm.decapitalize(propName.substring(5)) : propName;
	    result.push("\tget" + wm.capitalize(propName) + ": function() {");
	    result.push("\t\ttry {");
	    if (this.dijit["get" + wm.capitalize(dijitPropName)]) {
		result.push("\t\t\treturn this.dijit['get" + wm.capitalize(dijitPropName) + "']();");
	    } else {
		result.push("\t\t\treturn this.dijit.get('" + dijitPropName + "');");
	    }
	    result.push("\t\t} catch(e) {return '';}");
	    result.push("\t},");
	}
    
	result.push("");
	result.push("/* All Setters */");

	for (var i = 0; i < useProps.length; i++) {
	    var propName = useProps[i];
	    var dijitPropName = (propName.indexOf("dijit") == 0) ? wm.decapitalize(propName.substring(5)) : propName;
	    result.push("\tset" + wm.capitalize(propName) + ": function(inValue) {");
	    result.push("\t\ttry {");
	    if (this.dijit["set" + wm.capitalize(dijitPropName)]) {
		result.push("\t\t\tthis.dijit['set" + wm.capitalize(dijitPropName) + "'](inValue);");
	    } else {
		result.push("\t\t\tthis.dijit.set('" + dijitPropName + "',inValue);");
	    }
	    result.push("\t\t\tif (this._isDesignLoaded)");
	    result.push("\t\t\t\tthis." + propName + " = this.makeWritableValue(this.get" + wm.capitalize(propName) + "(), inValue);");
	    result.push("\t\tvar " + propName + " = this.get" + wm.capitalize(propName) + "();");
	    result.push("\t\tif (" + propName + " instanceof Date) {");
	    result.push("\t\t\tthis." + propName + " = " + propName + ".getTime();");
	    result.push("\t\t} else if (typeof " + propName + " != 'object') {");	    
	    result.push("\t\t\tthis." + propName + " = " + propName + ";");
	    result.push("\t\t}");
	    result.push("\t\t} catch(e) {}");
	    result.push("\t},");
	}
	
	result.push("");
	result.push("/* Called to get properties for dijit's constructor */");

	result.push("\tgetProperties: function() {");	    
	result.push("\t\treturn {");
	for (var i = 0; i < useProps.length; i++) {
	    var propName = useProps[i];
	    var dijitPropName = (propName.indexOf("dijit") == 0) ? wm.decapitalize(propName.substring(5)) : propName;
	    result.push("\t\t\t" + dijitPropName + ": this." + propName + ",");
	}
	result[result.length-1] = result[result.length-1].replace(/,$/,""); // remove last comma
	result.push("\t\t};");
	result.push("\t},");

	result.push("");
	result.push("/* All event handlers */");

	for (propName in props) {
	    if (propName.indexOf("onDijit") == 0) {
		result.push("\t" + propName + ": function(){},");
		postInit.push("\t\tthis.connect(this.dijit, '" + propName.replace(/^onDijit/,"on") + "',this,'"+propName + "');");
	    }
	}
	
	extendSchema[extendSchema.length-1] = extendSchema[extendSchema.length-1].replace(/,$/,"");
	extendSchema.push("\t});");
	postInit.push("\t},");

	result = result.concat(postInit);

	result.push("\t_end: 0");
	result.push("});");

	result.push("");
	result.push("/* Design time information on properties */");
	result = result.concat(extendSchema);
	result.push("wm.registerPackage(['bundlePackage.Dijits','" + className + "','" + fullClassName + "','" + packageName + "','images/wm/widget.png','',false,{}])");
	return result.join("\n");

    },

    deployDijit: function() {
	try {
	    var classDef = this.makeComponentClass();
	    eval(classDef);
	    studio.deployComponent(this.dijitClass.replace(/.*\./g,""), "wmdijit", this.dijitClass, "Dijit", classDef);
	} catch(e) {
	    app.toastError(e);
	}
    },
    undeployDijit: function() {
	studio.undeployComponent(this.dijitClass.replace(/.*\./g,""), "wmdijit", this.dijitClass, "Dijit", true);
    },

    _end: 0
});


wm.Object.extendSchema(wm.CustomDijit, {
    onMouseOver: {ignore: true},
    onMouseOut: {ignore: true},
    imageList: {ignore: true},
    renderBoundsX: {group: "DijitDesigner"},
    renderBoundsY: {group: "DijitDesigner"},
    dijitClass: {group: "DijitDesigner"}
});
wm.Object.extendSchema(wm.DijitDesigner, {
    dijitPropList: {group: "DijitDesigner", writeonly: true},
    deployDijit: {group: "operation", order: 10},
    undeployDijit: {group: "operation", order: 20}
});
