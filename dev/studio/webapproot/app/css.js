/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.css");

setCss = function(inSheetId, inCss){
	var sheet = dojo.byId(inSheetId);
	if (!sheet)
		return;
	inCss = inCss || "";
	if(sheet.styleSheet) {//IE
		// must make sure to set cssText to at least empty string or IE can crash
		if (dojo.isIE < 7)
			setIe6Css(sheet, inCss);
		else
			sheet.styleSheet.cssText = inCss;
	} else {
		sheet.firstChild && sheet.removeChild(sheet.firstChild);
		sheet.appendChild(document.createTextNode(inCss));
	}
}

// IE6 doesn't allow setting cssText so replace the style node completely
setIe6Css = function(inSheet, inCss) {
	var c = document.documentElement.firstChild, id = inSheet.id;
	c.removeChild(inSheet);
	var n = document.createElement("style");
	n.id = id;
	n.type = "text/css";
	if (n.styleSheet)
		n.styleSheet.cssText = inCss;
	else
		n.appendChild(document.createTextNode(inCss));
	c.appendChild(n);
}

getCssDeclaration = function(inWidget, inNodeName) {
    inNodeName = inNodeName ? " ." + inNodeName : "";
    

    var inDesignableDialog = Boolean(inWidget.isAncestorInstanceOf(wm.DesignableDialog));
    var pageName = inDesignableDialog ? "" : "." + studio.project.pageName;
    var pageName2 = "." + studio.project.pageName;
    if (inWidget.owner instanceof wm.BasicApplication) {
        pageName = "";
        pageName2 = "." + inWidget.owner.declaredClass;
    }
    var isLayout = (inWidget instanceof wm.Layout || wm.mobile && wm.mobile.Layout && inWidget instanceof wm.mobile.Layout);
    var result = ["body.tundra " + pageName + (isLayout || inDesignableDialog ? "" : " .wmlayout") + " " + pageName2 + "-" + inWidget.name + inNodeName + (isLayout ? ".wmlayout":"")];
    return result.join(",\n");

}

addCssTemplate = function(inWidget) {
	var css = studio.cssEditArea, t = css.getText();
	css.setText(t + getCssDeclaration(inWidget) + " {\n\n}\n\n");
}

getNodeStyleRegExp = function(inWidget, inNodeName){
	var d = getCssDeclaration(inWidget, inNodeName).replace(".", "\\.")
	return new RegExp(d + " \\{([^}]*)\\}(\n*)");
}

getControlStyleRegExp = function(inWidget) {
	var d = getCssDeclaration(inWidget).replace(".", "\\.")
	return new RegExp(d + "(.*)\\{([^}]*)\\}(\n*)", "g");
}

getControlStyles = function(inWidget) {
	var t = studio.cssEditArea.getText(), r = getControlStyleRegExp(inWidget);
	var m, s, r, result=[], n, c;
	while((m = r.exec(t)) != null) {
		n = dojo.trim(m[1]);
		if (n.indexOf(".") == 0)
			n = n.slice(1);
		c = (m[2]||"").replace(/\r|\t/g, "").slice(1, -1);
		result.push({node: n, css: c});
	}
	return result;
}

getControlNodeStyles = function(inWidget, inNodeName) {
	var t = studio.cssEditArea.getText(), r = getNodeStyleRegExp(inWidget, inNodeName);
	var m = t.match(r) || [], s = m[1] || '';
	return s.replace(/\r|\t/g, "").slice(1);
}

setControlNodeStyles = function(inWidget, inStyles, inNodeName) {
	var s= inStyles;
	if (s) {
		if (s.slice(-1) == '\n')
			s = s.slice(0, -1);
		s = "\t" + s.replace("\n", "\n\t");
	}
	var
		css = studio.cssEditArea,
		t = css.getText(),
		r = getNodeStyleRegExp(inWidget, inNodeName),
		st = getCssDeclaration(inWidget, inNodeName) + " {\n" + s;
	// removes old declaration if no styles passed in.
	if (t.match(r)) {
		css.setText(t.replace(r, s ? st + "\n}$2" : ""));
	} else if (s)
		css.setText(t + st + "\n}\n\n");
}

styleChange = function(oldName, newName) {
	if (oldName && newName && oldName!=newName) {
		var
			r = new RegExp("(\\." + studio.project.pageName + "-)(" + oldName + ")(\\W+)", "g"),
			css = studio.cssEditArea,
			t = css.getText();
		css.setText(t.replace(r, "$1" + newName + "$3"));
	}
}

dojo.subscribe("wmwidget-rename", styleChange);

// stock classes

listClassNames = function(inStyles) {
	// FIXME: this is going to match stuff like .jpg
	// need more mojo here
	var re = /\.[^.\s\#]*/g;
    return inStyles ? inStyles.match(re) : [];
}

dojo.addOnLoad(function() {
	//wm.headAppend(wm.createElement("style", {id: "default_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "app_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "page_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "theme_ss", type: "text/css"}));
	// note: this stylesheet is loaded via studio.loadlib to preserve paths
	defaultStyleSheet = loadDataSync(dojo.moduleUrl("wm") + "/base/styles/wavemaker.css");
	//
	var n = listClassNames(defaultStyleSheet);
	//
	//var r = /\/\*(.*)\*\//;
	for (var i=0, cn, inf; (cn=n[i]); i++) {
		//inf = (cn.match(r) || 0)[1];
		//inf && console.debug(inf);
		//cn = cn.replace(r, "");
		n[i] = cn.split("_");
	}
	//
	var g = [];
	for (i=0; (cn=n[i]); i++) {
		if (cn.length < 3) 
			continue;
		if (!g[cn[1]])
			g[cn[1]] = [];
		g[cn[1]].push(cn[2]);
	}
	defaultCssClasses = g;
	//console.dir(defaultCssClasses);
});