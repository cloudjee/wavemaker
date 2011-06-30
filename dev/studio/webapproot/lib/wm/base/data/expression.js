/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.data.expression");

/**
	@class
	Static API for handling data expressions.
	Data expressions are strings can contain valid JavaScript and
	special macros.
	Macros are expanded via preprocessing, and use this syntax:
	<pre class="code">${&lt;id&gt;}</pre>
	&lt;id&gt; supports dot notation, e.g. ${address.name.lastName}.<br/>
	<br/>
	<b>Example:</b>
	<pre class="code">
"Half of " + ${editor1.dataValue} + " is " + ${editor1.dataValue}/2.

<i>// Macros are replaced with quoted JSON and should not be inside of literal strings</i>
"${lastName}, ${firstName}" <i>// bad</i>
${lastName} + ", " + ${firstName} <i>// good</i>
</pre>
*/
wm.expression = {
	/**
		Evaluate expression with given namespace root.
		@param {String} inExpression Valid javascript that is evaluated in global scope. The expression can contain 
			macros.
		@param {String} inRoot The root object under which id macros are evaluated.
		@example 
var exp = '"Half of " + ${editor1.dataValue} + " is " + ${editor1.dataValue}/2.';
wm.expression.getValue(exp, app.main);
	*/
	getValue: function(inExpression, inRoot) {
		var v = wm.expression._getText(inExpression, inRoot);
		return wm.evalJs(v);
	},
	getSources: function(inExpression) {
		var re = wm.expression._getSourceRegEx
		re.lastIndex = 0;
		var m, sources=[];
		while((m = re.exec(inExpression)) != null) {
		  sources.push(m[1]);
		  var mList = m[1].split(".");
		  mList.pop();
		  while(mList.length > 1) {
		    sources.push(mList.join("."));
		    mList.pop();
		  }
		}
		return sources;
	},
	_getText: function(inExpression, inRoot) {
		//return inExpression.replace(wm.expression._getSourceRegEx(), function(){
		return inExpression.replace(wm.expression._getSourceRegEx, function(){
			try {
			    var inSource = arguments[1];
			    if (inSource.match(/^\[.*\]/)) {
				var matches = inSource.match(/^\[(.*?)\]/);
				inSource = inSource.replace(/^\[(.*?)\]\./, "");
				var roots = wm.Page.byName[matches[1]];
				var root = (roots) ? roots[0] : "";
				var v = root ? root.getValue(inSource) : "";
			    } else if (inRoot.getValue){
				var v = inRoot.getValue(inSource);
			    }
			    else if (inSource.indexOf('.') != -1){
					var arr = inSource.split('.');
					var v = inRoot;		
					dojo.forEach(arr, function(prop){
						v = v[prop];
					});
				} else {
				    var v = inRoot[inSource];
				}
				// objects cannot be returned directly since they are eval'd.
				if (v instanceof wm.Object || v === undefined)
					v = "";
				// do we want to automatically jsonify all values?
				return dojo.toJson(v);
			} catch(e) {}
		});
	},
	_getSourceRegEx: new RegExp(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g)
	//_getSourceRegEx: function() {
	//	return new RegExp(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g);
	//}
}
