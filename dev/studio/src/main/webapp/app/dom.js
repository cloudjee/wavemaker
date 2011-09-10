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
 
dojo.provide("wm.studio.app.dom");

wm.createDocument = function(/*string?*/ str, /*string?*/ mimetype){
	//	summary:
	//		cross-browser implementation of creating an XML document object.
	//
	//	str:
	//		Optional text to create the document from.  If not provided, an empty XML document will be created.
	//	mimetype:
	//		Optional mimetype of the text.  Typically, this is text/xml.  Will be defaulted to text/xml if not provided.
	var _document = dojo.doc;

	if(!mimetype){ mimetype = "text/xml"; }
	if(str && (typeof dojo.global["DOMParser"]) !== "undefined"){
		var parser = new DOMParser();
		return parser.parseFromString(str, mimetype);	//	DOMDocument
	}else if((typeof dojo.global["ActiveXObject"]) !== "undefined"){
		var prefixes = [ "MSXML2", "Microsoft", "MSXML", "MSXML3" ];
		for(var i = 0; i<prefixes.length; i++){
			try{
				var doc = new ActiveXObject(prefixes[i]+".XMLDOM");
				if(str){
					if(doc){
						doc.async = false;
						doc.loadXML(str);
						return doc;	//	DOMDocument
					}else{
						console.log("loadXML didn't work?");
					}
				}else{
					if(doc){ 
						return doc; //DOMDocument
					}
				}
			}catch(e){ /* squelch */ };
		}
	}else if((_document.implementation)&&
		(_document.implementation.createDocument)){
		if(str){
			if(_document.createElement){
				// FIXME: this may change all tags to uppercase!
				var tmp = _document.createElement("xml");
				tmp.innerHTML = str;
				var xmlDoc = _document.implementation.createDocument("foo", "", null);
				for(var i = 0; i < tmp.childNodes.length; i++) {
					xmlDoc.importNode(tmp.childNodes.item(i), true);
				}
				return xmlDoc;	//	DOMDocument
			}
		}else{
			return _document.implementation.createDocument("", "", null); // DOMDocument
		}
	}
	return null;	//	DOMDocument
}
