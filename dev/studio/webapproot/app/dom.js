/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
