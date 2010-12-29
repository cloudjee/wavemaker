/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.packageLoader");

_import = function(inTab, inName, inClass, inModule, inImage, inDescription, inProps) {
	var
		n=inName,
		c=inClass,
		m=inModule||c,
		i=inImage||"images/wm/widget.png";

	try{
		// trips up build system to have a dojo.require here
		dojo["require"](m);
	}catch(e){
		return 'Could not import module "' + m + '".';
	}
	var ctor = dojo.getObject(c);
	if (!ctor) {
		return 'Module "' + m + '" is loaded, but function "' + c + '" was not found.';
	}
	var d = inDescription || ctor.description || inClass;
	/*var s = inTab.split(".");
	var p = "";
	if (s.length > 1) {
		inTab = s.pop();
		p = s;
	}
	p = "palette" + p;*/
        if (!(ctor.prototype instanceof wm.Control) && !(ctor.prototype.declaredClass == "wm.DojoLightbox"))
		studio.addComponentMenuItem(inTab, n, d, i, c, inProps);
        else
	    studio["palette"].addItem(inTab, n, d, i, c, inProps);
}

installPackages = function(m) {
	for (var i=0, e; i<m.length; i++) {
		if(e=_import.apply(this, m[i]))
			console.warn(e);
	}
}

_loadPackages = function( d) {
	var m = eval("[" + d + "]");
	installPackages(m);
}

loadPackages = function() {
	//studio.palette.beginUpdate();
	loadData(dojo.moduleUrl("wm.studio.app") + "packages.js", _loadPackages);
	loadData(dojo.moduleUrl("wm.packages") + "packages.js", _loadPackages);

	if (!studio.isCloud()) 
	    loadData(dojo.moduleUrl("wm.studio.app") + "packages.noncloud.js", _loadPackages);
	//console.dir(__packageRegistry);
	installPackages(__packageRegistry);
	//studio.palette.endUpdate();
	studio.palette.setLayerIndex(0);
	// redefine registration
	wm.registerPackage = registerPackage = function(p) {
		//console.log("[late] registerPackage:", p);
		wm.onidle(function(){ 
				installPackages([p]); 
			});
	}
}

// palette helper
__packageRegistry = [];
wm.registerPackage = registerPackage = function(p) {
		//console.log("[early] registerPackage:", p);
	__packageRegistry.push(p);
}
