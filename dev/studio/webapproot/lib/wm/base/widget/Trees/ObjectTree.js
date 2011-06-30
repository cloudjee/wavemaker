/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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




/* Example configuration; can be an arbitrary javascript object consisting of
 * any mishmash of arrays and hashes.  
   [
      {"Joe":      {"some":"guy"}},
      {"Michael":  {"role":     "Sr Engineer",
                    "Years":    "2",
		    "vacations":[
		        {"Janurary": ["3-5", "10-14"],
			 "February": {"sick":"3-5"}
			}
		    ]
		   }
      },
      {"Derek":    {"role":      "VP Engineering",
                    "Years":     "4",
		    "Prior Jobs":["Persistence Software", "Progress"]
		   }
      }
    ]
*/
dojo.provide("wm.base.widget.Trees.ObjectTree");
dojo.require("wm.base.widget.Trees.Tree");
dojo.require("wm.base.widget.Trees.JSObjTreeNode");
dojo.declare("wm.ObjectTree", wm.Tree, {
    data: null,
    postInit: function() {
	this.inherited(arguments);
	if (this.data)
	    this.setData(this.data);
    },
    setData: function(inData) {
	if (dojo.isString(inData))
	    inData = dojo.fromJson(inData);
	this.data = inData;
	this.root.destroy();
	this.root = new wm.JSPrettyObjTreeRootNode(this, {prefix: "",
							  object: inData});
	this.root.setOpen(true);
    },
    makePropEdit: function(inName, inValue, inDefault) {
	switch (inName) {
	case "data":
	    if (!dojo.isString(inValue)) inValue = dojo.toJson(inValue);
	    return makeTextPropEdit(inName, inValue, inDefault)
	}
	return this.inherited(arguments);
    },
    onselect: function(inNode, inData) {},
    select: function(inNode) {
	if (this.selected != inNode) {
	    this.deselect();
	    this.addToSelection(inNode);
	    this.onselect(inNode, inNode.object || inNode.content);
	}
    }
});

dojo.declare("wm.JSPrettyObjTreeNode", wm.JSObjTreeNode, {
    setObject: function(inObject) {
	this.object = inObject;
	var prefix = this.prefix;

	if (dojo.isArray(inObject) && inObject.length == 0)
	    this.setContent(prefix + ": none");
	else if (inObject === null || inObject === undefined)
	    this.setContent(prefix + ": none");
	else if (typeof inObject == "object" && wm.isEmpty(inObject))
	    this.setContent(prefix + ": none");
	else if (typeof inObject == "object") {
	    this.hasChildren = true;
	    //this.objectString = dojo.toJson(inObject);
	    //this.setContent(this.prefix + ": " + this.objectString);
	    var objectString = "";
	    if (dojo.isArray(inObject)) {
		objectString = "";
	    }
	    if (objectString)
		this.setContent(prefix + ": " + objectString);
	    else
		this.setContent(prefix);
	    this.styleNode();
	} else {
	    if (prefix) prefix += ": ";
	    this.setContent(prefix + inObject);
	}

    },
    getPropertyCount: function() {
	var i = 0;
	for (prop in this.object) i++;
	return i;
    },

    initNodeChildren: function(inParentNode, inCounter) {
	var inObject = this.object;
	var isArray = dojo.isArray(inObject) ;
	for (var i in inObject) {
	    if (isArray && dojo.isObject(inObject[i])) {
		var p = this.prefix;		
		this.object = inObject[i];

		this.initNodeChildren(inParentNode, inCounter || parseInt(i)+1);
		this.object = inObject;

	    } else {
		var prefix;
		if (inCounter) {
		    prefix = inCounter + ": " + i;
		    inCounter++;
		} else if (isArray)
		    prefix = parseInt(i) + 1;
		else
		    prefix =  i;

		new wm.JSPrettyObjTreeNode(this, {prefix: prefix,
						  object: inObject[i]});
	    }
	}
    }

});

dojo.declare("wm.JSPrettyObjTreeRootNode", [wm.JSPrettyObjTreeNode, wm.TreeRoot],{});
wm.ObjectBrowserTree = wm.ObjectTree;