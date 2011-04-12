/*
 *  Copyright (C) 2011 WaveMaker Software, Inc.
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


dojo.provide("wm.base.widget.Trees.JSObjTreeNode");
dojo.require("wm.base.widget.Trees.Tree");

dojo.declare("wm.JSObjTreeNode", wm.TreeNode, {
    closed: true,
    setContent: function(inContent) {
	this.content = inContent;
	if (this.contentNode)
	    this.inherited(arguments);
    },
    constructor: function(inParent, inProps) {
	if (this.object !== undefined)
	    this.setObject(this.object);
	else 
	    this.setContent(this.prefix || "");
    },
    setObject: function(inObject) {
	this.object = inObject;
	var prefix = this.prefix;
	prefix =  (prefix) ? prefix + ":" : "";


	if (dojo.isArray(inObject) && inObject.length == 0)
	    this.setContent(prefix + "[]");
	else if (inObject === null || inObject === undefined)
	    this.setContent(prefix + "" + String(inObject));
	else if (typeof inObject == "object" && wm.isEmpty(inObject))
	    this.setContent(prefix + "{}");
	else if (typeof inObject == "object") {
	    this.hasChildren = true;
	    //this.objectString = dojo.toJson(inObject);
	    //this.setContent(this.prefix + ": " + this.objectString);
	    var objectString = "";
	    if (dojo.isArray(inObject)) 
		objectString = "Array of length " + inObject.length;
	    else {
		try {
		    objectString = inObject instanceof wm.Component ? inObject.getRuntimeId() : inObject.toString();
		} catch(e) {
		    objectString = "{?}";
		}
	    }
	    this.setContent(prefix + objectString);
	    this.styleNode();
	} else {
	    this.setContent(prefix + inObject);
	}

    },
    initNodeChildren: function(inParentNode) {
	var inObject = this.object;
	    for (var i in inObject) {
		new wm.JSObjTreeNode(this, {prefix: i,
					    object: inObject[i]});
	    }
    }
});
