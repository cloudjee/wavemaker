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

getCssDeclaration = function(inName, inNodeName) {
	inNodeName = inNodeName ? " ." + inNodeName : "";
	var pageName = studio.project.pageName;
	return "." + pageName + " ." + pageName + "-" + inName + inNodeName;
}

addCssTemplate = function(inName) {
	var css = studio.cssEditArea, t = css.getText();
	css.setText(t + getCssDeclaration(inName) + " {\n\n}\n\n");
}

getNodeStyleRegExp = function(inName, inNodeName){
	var d = getCssDeclaration(inName, inNodeName).replace(".", "\\.")
	return new RegExp(d + " \\{([^}]*)\\}(\n*)");
}

getControlStyleRegExp = function(inName) {
	var d = getCssDeclaration(inName).replace(".", "\\.")
	return new RegExp(d + "(.*)\\{([^}]*)\\}(\n*)", "g");
}

getControlStyles = function(inName) {
	var t = studio.cssEditArea.getText(), r = getControlStyleRegExp(inName);
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

getControlNodeStyles = function(inName, inNodeName) {
	var t = studio.cssEditArea.getText(), r = getNodeStyleRegExp(inName, inNodeName);
	var m = t.match(r) || [], s = m[1] || '';
	return s.replace(/\r|\t/g, "").slice(1);
}

setControlNodeStyles = function(inName, inStyles, inNodeName) {
	var s= inStyles;
	if (s) {
		if (s.slice(-1) == '\n')
			s = s.slice(0, -1);
		s = "\t" + s.replace("\n", "\n\t");
	}
	var
		css = studio.cssEditArea,
		t = css.getText(),
		r = getNodeStyleRegExp(inName, inNodeName),
		st = getCssDeclaration(inName, inNodeName) + " {\n" + s;
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
	return inStyles.match(re);
}

dojo.addOnLoad(function() {
	//wm.headAppend(wm.createElement("style", {id: "default_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "app_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "page_ss", type: "text/css"}));
	wm.headAppend(wm.createElement("style", {id: "theme_ss", type: "text/css"}));
	// note: this stylesheet is loaded via studio.loadlib to preserve paths
	defaultStyleSheet = loadDataSync(dojo.moduleUrl("wm") + "base/styles/wavemaker.css");
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