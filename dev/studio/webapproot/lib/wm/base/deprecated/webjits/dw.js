/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
// TODO: naming conventions and namespacing
function _gel(x) { return document.getElementById(x); }

__DW__ = {
	loadedScripts: new Array,
	loadScript: function(url, cb) {
		if (__DW__.loadedScripts[url]) { return; }
		var e = document.createElement("script");
		e.src = url;
		e.type="text/javascript";
		var head = document.getElementsByTagName('head').item(0);
		head.insertBefore(e, head.firstChild);
		__DW__.loadedScripts[url] = 1;
	},

	loadedCSS: new Array,
	loadCSS: function(url) {
		if (__DW__.loadedCSS[url]) { return; }
		var e = document.createElement("link");
		e.href = url;
		e.rel = "stylesheet";
		e.type = "text/css";
		// TODO: remove from DOM after loading...
		var head = document.getElementsByTagName('head').item(0);
		head.insertBefore(e, head.firstChild);
		__DW__.loadedCSS[url] = 1;
	},

		// from w3schools.com
		parseXML: function(text) {
	var xmlDoc = null;
	try {
			// MSIE
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
	} catch(e) {
			try {
		// Firefox, Mozilla, Opera, etc.
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(text, "text/xml");
			} catch(e) {
		alert(e.message);
		return;
			}
	}
	return xmlDoc;
		},

		downloadedWidgets: new Array,
		parseWidgetXML: function(url, widgetText) {
	widgetText = widgetText.replace(/\/\* --- URL .+ --- \*\//,"");
	__DW__.downloadedWidgets[url] = __DW__.parseXML(widgetText);
	__DW__.downloadedWidgets[url].widgetText = widgetText;
		},

		widgetnum: 0,
		widgets: new Array,
		loadWidgetScript: function(id, script) {
	var DW = null;
	eval(script);
	// registration
	__DW__.widgets[id] = DW;
	return __DW__.widgets[id];
		},

		widgetsByNum: new Array,

		allocWidgetId: function() {
	return ++__DW__.widgetnum;
		},

		// TODO: handle errors from the widget
		loadParsedWidget: function(url, div_id, cbfunc) {
	var xmldoc = __DW__.downloadedWidgets[url];
	var script = xmldoc.getElementsByTagName("script")[0].childNodes[0].nodeValue;
	var new_widgetnum = __DW__.allocWidgetId();
	var w = __DW__.loadWidgetScript(new_widgetnum, script);
	w.WIDGETNUM = new_widgetnum;
	w.WIDGETXML = function() { return __DW__.downloadedWidgets[url]; };
	w.WIDGETTEXT = function() { return xmldoc.widgetText; };
	w.GET_SELF = function(){ return "__DW__.widgetsByNum["+w.WIDGETNUM+"]";};
/*
	w.MAKE_INTO_CALLBACK = function(methodName){ 
			var rnd = Math.floor(Math.random()*1000000);
			var callSelf = w.GET_SELF() + "."+methodName+"();";
			var globalName = "__DW__.cb"+rnd;
			var code = globalName+" = function(){"+callSelf+";"+globalName+" = null;};";
			eval(code);
			return globalName;
	};
	w.WIDGETNAME = function(name){return name+"_w"+new_widgetnum;};
*/
	if (typeof w.init == 'function') {
			__DW__.debug("calling init()...");
			w.init(new_widgetnum);
	};
	__DW__.debug("calling draw().");
	var div = _gel(div_id);
	div.innerHTML = w.draw();
	__DW__.debug("replacing names/IDs/classnames...");
	__DW__.replaceChildNames(div, "", "_w" + new_widgetnum);
	if (typeof w.ondraw == 'function') {
			__DW__.debug("calling ondraw()...");
			w.ondraw(new_widgetnum);
	};
	__DW__.widgetsByNum[new_widgetnum] = w;
	if (cbfunc != null) {
			__DW__.debug("calling "+cbfunc);
			eval("var f = function(x){"+cbfunc+"(x);};");
			f(w);
	}
		},

		replaceChildNames: function(elem, prefix, suffix) {
	if (elem == null) { return; }
	var i = 0;
	while (elem.childNodes[i]) {
			var node = elem.childNodes[i];
			if (node.id) {
		node.id = prefix + node.id + suffix;
			}
			if (node.name) {
		node.name = prefix + node.name + suffix;
			}
			if (node.style && node.style.class) {
		node.style.class = prefix + node.style.class + suffix;
			}
			__DW__.replaceChildNames(node, prefix, suffix);
			i++;
	}
		},

		cleardebug: function(msg) {
	var dbg = _gel("debug");
	if (dbg == null) { return; };
	dbg.innerHTML = "";
		},
		debug: function(msg) {
	var dbg = _gel("debug");
	if (dbg == null) { return; };
	dbg.innerHTML += msg + "<br/>";
		},

		// macro for callback in addWidget
		fetchParseAndLoad: function(url, content, div_id, cbfunc) {
	__DW__.parseWidgetXML(url, content);
	__DW__.loadParsedWidget(url, div_id, cbfunc);
		},

		addWidget: function(url, div_id, cbfunc) {
	__DW__.debug(url);
	if (__DW__.downloadedWidgets[url]) {
			__DW__.loadParsedWidget(url, div_id, cbfunc);
			return;
	}

	// TODO: short-circuit for lightweight, builtin widgets-- this path is only for heavyweight widgets
	var rnd = Math.floor(Math.random()*1000000);

	// TODO: omg this is an ugly hack to pass the url to the loader,
	// assuming concurrent loads
	var funcname = "loadWidgetXML_"+rnd;
				// TODO: XSS problems with url?
	eval(funcname+" = function(x){__DW__.fetchParseAndLoad('"+url+"',x,'"+div_id+"','"+cbfunc+"');}");

	// TODO: workaround for bug in suprfetch-- nocache=true being ignored...
	url += "?" + rnd;
	__DW__.loadScript("http://suprfetch.appspot.com/?url="+encodeURIComponent(url)+"&output=json&callback="+funcname+"&nocache=true");
		},

	// SJM2008
	callbackCounter: 0,
	api: {
		MAKE_INTO_CALLBACK: function(methodName) {
			var self = this;
			var name = "cb" + __DW__.callbackCounter++;
			__DW__[name] = function() {
				self[methodName]();
				delete __DW__[name];
			}
			return "__DW__."+name;
		},
		WIDGETNAME: function(name){
			return this.owner.name + "_" + name;
		},
		$: function(inName) {
			return dojo.byId(this.WIDGETNAME(inName));
		}
	},
END:0};
