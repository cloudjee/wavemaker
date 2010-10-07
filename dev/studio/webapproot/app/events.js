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
dojo.provide("wm.studio.app.events");

terminus = "_end: 0";
pageScript = function(name, defaultFunctions) {
	return [
		'dojo.declare("' + name + '", wm.Page, {',
		'\tstart: function() {',
		'\t\t',
		'\t},',
	         (defaultFunctions ? "\t" + defaultFunctions + "," : ""),
		'\t' + terminus,
		'});'
	].join('\n');
}

getEvent = function(name, text) {
	//var r = new RegExp(name + ":\\s+function\\(.*?},$", "m");
	var r = new RegExp(name + ": function\\(", "");
	var m = text.match(r)||[];
	//console.log(r.source, m);
	return (m[0]||'').replace(/\r/g, "");
}

getArgs = function(ctrl, name) {
	var fn = ctrl._designee.constructor.prototype[name], m = fn&&fn.toString().match(/function\s*\(([^)]*)/);
	//return m&&m[1]&&(", " + m[1]) || " /*,args*/";
	return !m&&" /*,args*/" || m[1]&&(", " + m[1]) || "";
}

getEventCode = function(ctrl, name, value, code) {
    var a = getArgs(ctrl, name);
    if (wm.isInstanceType(ctrl, wm.Page))
	a = a.substring(1);
    else
	a = "inSender" + a;
    return value + ": function(" + a + ") {\n\t\t" + code + "\n\t},\n\t";

}

/* Does not appear to get called */
writeCodeFragment = function(code) {
	var t = studio.getScript();
	studio.setScript(t.replace(terminus, code + terminus));
}

removeCodeFragment = function(start, end) {
	var code = studio.getScript();
	var re = new RegExp("\\/\\*\\s+" + start + "\\s+\\*\\/[\\S\\s]*\\/\\*\\s+" + end + "\\s+\\*\\/.*\n\t", "i");
	code = code.replace(re, "");
	studio.setScript(t);
}


eventList = function(eventname, editor) {
  var tmpEventName = eventname.replace(/^on/,"");
  var code = editor.getText();
  var reg = new RegExp("\\bon\\S*" + tmpEventName + "\\:\\s*function", "gi");
  var results = code.match(reg);
  if (results == null) {
    return [];
  }
  for (var i = 0; i < results.length; i++) {
    results[i] = results[i].replace(/\:.*$/, "");
  }
  return results;
}

getAllEventsInCode = function() {
  var code = studio.getScript();
  var reg = new RegExp("\\b\\S*.*" + "\\:\\s*function", "gi");
  var results = code.match(reg);
  if (results == null) {
    return [];
  }
  for (var i = 0; i < results.length; i++) {
    results[i] = results[i].replace(/\s*\:.*$/, "");
  }
  results = wm.Array.removeElement(results, "start"); // pretty rare we'll want to list this
  return results;
}

eventEdit = function(ctrl, name, value, noInSenderInArgs) {
    var appLevel = wm.isInstanceType(ctrl.owner, wm.Application);
    var code = (appLevel) ? studio.getAppScript() : studio.getScript();

    if (wm.isInstanceType(ctrl, wm.Page))
	value = name;
    if (!getEvent( value, code)) {
	var a = getArgs(ctrl, name);
	if (wm.isInstanceType(ctrl, wm.Page) || noInSenderInArgs)
	    a = a.substring(1);
	else
	    a = "inSender" + a;
	var code = code.replace(terminus, value + ": function(" + a + ") {\n      try {\n          \n          \n      } catch(e) {\n          console.error('ERROR IN " + value + ": ' + e); \n      } \n  },\n  " + terminus);
	if (appLevel)
	    studio.setAppScript(code);
	else
	    studio.setScript(code);
    }

    studio.navGotoSourceClick();
    studio.sourceTabs.setLayer((appLevel) ? "appsource" : "scriptLayer");
    caretToEvent(value, appLevel ? studio.appsourceEditor : studio.editArea);
}

eventChange = function(editor, oldName, newName) {
	if (oldName && newName && oldName!=newName) {
		var r = new RegExp(oldName + ": function\\(", "m");
	        var code = editor.getText();
		editor.setText(code.replace(r, newName + ": function("));
	}
}

eventCopy = function(editor,oldName, newName) {
	if (oldName && newName && oldName!=newName) {
		var r = new RegExp(oldName + ": function(\\(.*?\\))", "m");
	        var code = editor.getText();
                var match = code.match(r);
                if (!match) return;
                if (getEvent(newName, code)) return;
            var newcode = newName + ": function" + match[1] + " {\n      try {\n          this." + oldName + match[1] + ";\n          \n      } catch(e) {\n          console.error('ERROR IN " + newName + ": ' + e); \n      } \n  },\n  ";
	    editor.setText(code.replace(terminus,  newcode +  terminus));
	}
}


caretToEvent = function(name, editor) {
	var r = new RegExp("[\\s\\S]*" + name + ": function\\([\\s\\S]*?{[\\s\\S]*?\\n[^\\n\\r\\S]*(try[\\s\\n]*{[\\s\\n]*)?", "m");

	var t = editor.getText();
	var m = t.match(r);
	if (m)
		editor.setSelectionRange(m[0].length);
}

/*setCaretPosition = function(ctrl, pos){
	if(ctrl.setSelectionRange){
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	} else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	} else return false;
}*/

textareaTab = function(e) {
	var t = e.target;
	if (t && t.tagName=='TEXTAREA' && e.keyCode==dojo.keys.TAB) {
		//IE
		if(document.selection){
			t.focus();
			var sel = document.selection.createRange();
			sel.text = "\t";
		}
		//Mozilla + Netscape
		else if(t.selectionStart || t.selectionStart == "0"){
			var scrollY = t.scrollTop, scrollX = t.scrollLeft, start = t.selectionStart, end = t.selectionEnd;
			t.value = t.value.substring(0,start) + "\t" + t.value.substring(end,t.value.length);
			t.focus();
			t.selectionStart = t.selectionEnd = start+1;
			t.scrollTop = scrollY;
			t.scrollLeft = scrollX;
		}
		else t.value += "\t";
		dojo.stopEvent(e);
	}
}

dojo.addOnLoad(function(){
	dojo.connect(document, "keypress", textareaTab);
});
