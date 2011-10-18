/*
 *  Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Trees.DraggableTree");
dojo.require("wm.base.widget.Trees.Tree");

dojo.declare("wm.DraggableTree", wm.Tree, {
    classNames: "wmtree wmdraggabletree",
    dropBetweenNodes: false,
    init: function() {
	this.inherited(arguments);
	this.connect(this.domNode, "onmouseup", this, "treeMouseUp");
    },

    /* Setup the drag and drop manager */
    postInit: function() {
	this.inherited(arguments);
	this.dragger = new wm.DraggableTreeMover();
	this.dragger.ondrop = dojo.hitch(this, "nodeDrop");
	this.dragger.manager = this;
    },

    /* Call this method, passing in inNode to make some nodes invalid drop targets.
     * why not just support node.setNoDrop(inNoDrop) ?  Because I've managed to make
     * this whole thing work such that any existing wm.TreeNode will be supported
     * without having to subclass wm.TreeNode
     */
    setNoDrop: function(inNode, noDrop) {
	dojo.toggleClass(inNode.contentNode, "noDrop", noDrop);
    },
    getNoDrop: function(inNode) {
	if (inNode == this.root)
	    return dojo.hasClass(inNode.domNode, "noDrop");
	else
	    return dojo.hasClass(inNode.contentNode, "noDrop");
    },
    nodeDrop: function() {
	// TODO: Better management of which nodes have what temporary classes
	dojo.query(".dndHover", this.root.domNode).removeClass("dndHover");
	if (this.dropBetweenNodes) {
	    dojo.query(".dndHoverTop", this.root.domNode).removeClass("dndHoverTop");
	    dojo.query(".dndHoverBottom", this.root.domNode).removeClass("dndHoverBottom");
	}

	this.dragger.mouseUp();
	var moveNode = this.draggedItem;

	var targetNode = this.dragger.target;
	if (!targetNode || this.getNoDrop(targetNode) && !this.dropBetweenNodes) return;

	if (this.dropBetweenNodes) {
	    var isParentDropTarget = !this.getNoDrop(targetNode.parent);
	    var index;
	    switch(this.dragger.targetArea) {
	    case "top":
		/*************************************************************************************
		 * if it goes above the current target, then it gets the same parent and index in
		 * that parent as the targetNode (side effect of the targetNode moves one index greater)
		 *************************************************************************************/
		if (isParentDropTarget) {
		    index = dojo.indexOf(targetNode.parent.kids, targetNode);
		    targetNode = targetNode.parent;
		} else if (!this.getNoDrop(targetNode)) {
		    index = targetNode.kids.length;
		} else {
		    return;
		}
		break;
	    case "mid":
		/*************************************************************************************
		 * if dropping it right on a node that allows droptargets, then the targetNode is now
		 * the parentNode, and the dropNode is the last child. 
		 * If it does NOT allow itself to be a droptarget, then default assumption is
		 * that we drop the node below the target.
		*************************************************************************************/
		if (!this.getNoDrop(targetNode)) {
		    index = targetNode.kids.length;
		} else {
		    index = dojo.indexOf(targetNode.parent.kids, targetNode)+1;
		    targetNode = targetNode.parent;		
		}
		break;
	    case "bot":
		/*************************************************************************************
		 * If dropping it at the bottom of the target, then if its a valid drop target AND
		 * its open, it goes as the first child of that node.
		 * Otherwise, the drop node becomes the target node's next sibling.
		 *************************************************************************************/
		if (!this.getNoDrop(targetNode) && !targetNode.closed && targetNode.kids) {
		    if (targetNode.declaredClass == "wm.TreeNode" && targetNode.kids.length == 0) {
			index = dojo.indexOf(targetNode.parent.kids, targetNode)+1; // next sibling
			targetNode = targetNode.parent; // has same parent as targetnode
		    } else {
			index = 0; // first child
		    }
		} else if (isParentDropTarget) {
		    index = dojo.indexOf(targetNode.parent.kids, targetNode)+1; // next sibling
		    targetNode = targetNode.parent; // has same parent as targetnode
		} else {
		    return;
		}
	    }
	    moveNode.parentIndex = index;
	}

	var oldparent = moveNode.parent;
	oldparent._remove(moveNode);
	moveNode.addParent(targetNode);
	targetNode.renderChild(moveNode);

	this.onNodeDrop(moveNode, targetNode, index, oldparent);
    },
    onNodeDrop: function(inMovedNode, inNewParentNode, inIndexInParent, inOldParent) {},
    treeMouseDown: function(e) {
	var dragItem = this.findEventNode(e);
	if (dragItem != null && !dragItem.isRoot()) {
	    this.drag(dragItem, e);
	}
    },
    drag: function(node,inEvent) {
	this.dragger.root = this.root;
	this.draggedItem = node;
	this.dragger.beginDrag(inEvent, {
	    caption: node.content,
	    control: node
	});
    },

    treeMouseUp: function(inSender,inEvent, inNode) {
	this.dragger.drag();
    },
    _end: 0

});

dojo.declare("wm.DraggableTreeMover", wm.DragDropper, {
	constructor: function() {
		this.info = {};
	    this.hoverStyleNodes = [];
	},
	beginDrag: function(inEvent, inInfo) {
		this.info = inInfo || this.info;
		this.mousedown(inEvent);
	},
	initNodes: function() {
		this.inherited(arguments);
		// make a drop marker
		this.markNode = document.createElement("div");
		this.markNode.style.cssText = "position: absolute; z-index: 2; border: 2px solid green;";
		this.scrimNode.appendChild(this.markNode);
		// make snap markers
		this.hSnapNode = document.createElement("div");
		this.hSnapNode.style.cssText = "position: absolute; z-index: 2; border: 1px dotted red; display: none;";
		this.scrimNode.appendChild(this.hSnapNode);
		// make snap markers
		this.vSnapNode = document.createElement("div");
		this.vSnapNode.style.cssText = "position: absolute; z-index: 2; border: 1px dotted red; display: none;";
		this.scrimNode.appendChild(this.vSnapNode);
	},
	start: function(e) {
		this.target = null;
		kit._setMarginBox(this.markNode, 0, 0, 0, 0);
		this.rootOffset = wm.calcOffset(this.root.domNode, this.scrimNode);
		this.inherited(arguments);
		this.setTarget(null);
	},

	drag: function(e) {
		this.inherited(arguments);
		// calc a target rect
	        if (!this.rootOffset) return; // drag gets called on mouseup after right click which is something we should ignore
		var r = { l: this.pxp - this.rootOffset.x, t: this.pyp - this.rootOffset.y, w:0, h: 0};
					   
		// locate target
	    this.findTarget(r);
	},
    mouseUp:function() {
	if (this.target) {

		dojo.removeClass(this.target.domNode, "dndHover");
	}
    },
	drop: function(e) {
   	    dojo.query(".dndHover").removeClass("dndHover");
	    this.inherited(arguments);	    
	},    
	setTarget: function(inTarget){
	    dojo.forEach(this.hoverStyleNodes, function(e) {
		dojo.removeClass(e, "dndHoverTop");
		dojo.removeClass(e, "dndHoverBottom");
	    });
	    if (this.target) {
		dojo.removeClass(this.target.domNode, "dndHover");
	    }
		this.target = inTarget;

	    // TODO: This needs to be handled via subclass or event hnadler
	    if (this.target && (this.manager.dropBetweenNodes || !this.manager.getNoDrop(this.target))) {
		this.setCursor("move");
		console.log("DEFAULT");
		this.targetNode = this.target.domNode;
		dojo.query(".dndHover", this.root.domNode).removeClass("dndHover");		  
		dojo.addClass(this.target.domNode, "dndHover");		  
	    } else {
		this.setCursor("no-drop");
		console.log("NO DROP!");
		this.targetNode = null;
		dojo.query(".dndHover", this.root.domNode).removeClass("dndHover");		  
	    }
	},
    setTargetArea: function(inTargetArea) {
	if (!this.manager.dropBetweenNodes) return;
	this.targetArea = inTargetArea;
	dojo.forEach(this.hoverStyleNodes, function(e) {
	    dojo.removeClass(e, "dndHoverTop");
	    dojo.removeClass(e, "dndHoverBottom");
	});
	this.hoverStyleNodes = [];
	switch(inTargetArea) {
	case "top":
	    dojo.addClass(this.target.domNode, "dndHover");
	    dojo.addClass(this.target.domNode, "dndHoverTop");
	    this.hoverStyleNodes.push(this.target.domNode);
	    break;
	case "bot":
	    if (!this.target.closed && this.target.kids && this.target.kids.length && !this.manager.getNoDrop(this.target)) {
		dojo.removeClass(this.target.domNode, "dndHover");
		dojo.addClass(this.target.kids[0].domNode, "dndHoverTop");
		this.hoverStyleNodes.push(this.target.kids[0].domNode);
	    } else {
		dojo.addClass(this.target.domNode, "dndHover");
		dojo.addClass(this.target.domNode, "dndHoverBottom");
		this.hoverStyleNodes.push(this.target.domNode);
	    }
	    break;
	case "mid":
	    dojo.addClass(this.target.domNode, "dndHover");
	    if (this.manager.getNoDrop(this.target)) {
		dojo.addClass(this.target.domNode, "dndHoverBottom");
		this.hoverStyleNodes.push(this.target.domNode);
	    }
	}
    },
	updateAvatar: function() {
	    //this.showHideAvatar(Boolean(this.target));	  
	    this.showHideAvatar(true);
	  if (!this.target) {
	      this.setAvatarContent("Moving <b>" + this.info.caption + "</b>");
	  } else {
	      var dn = this.target.content;
	      var caption = "Drop <b>" + this.info.caption + "</b>";
	      if (!this.manager.dropBetweenNodes) {
		  caption += " into ";
	      } else {
		  var isParentDropTarget = !this.manager.getNoDrop(this.target.parent);

	      switch (this.targetArea) {
	      case "top":
		  if (isParentDropTarget) {
		      var index = dojo.indexOf(this.target.parent.kids, this.target);
		      var newTarget;
		      // if the target is NOT the first node of the subtree, then describe the target using the prior sibling
		      if (index > 0) {
			  newTarget = this.target.parent.kids[index-1];
			  dn = newTarget.content;
			  caption += " after ";
		      } else {
			  // If the target is the first node of a subtree, then describe the target using the parent node
			  newTarget = this.target.parent;
			  dn = newTarget.content;
			  caption += " first child of ";		  
		      }
		  } else if (!this.manager.getNoDrop(this.target)) {
		      caption += " into ";
		  } else {
		      this.setAvatarContent("Moving <b>" + this.info.caption + "</b>");
		      return;
		  }

		  break;
	      case "bot":
		  if (!this.target.closed && !this.manager.getNoDrop(this.target)) 
		      if (this.target.declaredClass == "wm.TreeNode" && this.target.kids.length == 0) {
			  caption += " after ";
		      } else {
			  caption += " first child of ";
		      }
		  else if (isParentDropTarget) 
		      caption += " after ";
		  else {
		      this.setAvatarContent("Moving <b>" + this.info.caption + "</b>");
		      return;
		  }
		  break;
	      case "mid":
		  if (!this.manager.getNoDrop(this.target)) {
		      caption += " into ";
		  } else if (isParentDropTarget) {
		      caption += " after ";
		  } else {
		      this.setAvatarContent("Moving <b>" + this.info.caption + "</b>");
		      return;
		  }
		  break;
	      }
	      }
	      this.setAvatarContent(caption + " <b>" + dn + "</b>");
	  }
	},

	findTarget: function(inHit) {	 
		var t;
	    
		if (this.targetInRoot(inHit)) {
		    t = this._findTarget(inHit, this.root);
		} else
		    t = null;

		if (t == this.manager.draggedItem) 
		    t = null;
		if (t != this.target) {
		  //console.log("SET TARGET TO " + ((t==null) ? "NULL" : t.data.getItemName()));
		    this.setTarget(t);
		    if (this.target)
			this.setTargetArea(this._targetArea);
		} else if (this.target && this.targetArea != this._targetArea)
		    this.setTargetArea(this._targetArea);
	    this.updateAvatar();
	},
	_findTarget: function(inHit) {
	    var matches = dojo.query("#" + this.manager.domNode.id + " .wmtree-content").filter(dojo.hitch(this,function(element) {
		if (this.manager.dropBetweenNodes || !dojo.hasClass(element, "noDrop")) {
		    var loc = dojo.coords(element);
		    var inY = loc.t < inHit.t && loc.t + loc.h > inHit.t;
		    var inX = loc.l < inHit.l && loc.l + loc.w > inHit.l;

		    return (inY && inX);
		}
	    }));

	    if (matches.length ==  0) return null;

	  // OK, the last match is the one deepest in the tree; so use it
	    var match = matches[matches.length-1];
	    console.log("Matches found");
	    // are we on the top, middle or bottom of the node?
	    var matchloc = dojo.coords(match);
	    var onethird = Math.floor(matchloc.h/3);
	    var y = inHit.t - matchloc.t;
	    if (y <= onethird)
		this._targetArea = "top";
	    else if (y <= onethird*2)
		this._targetArea = "mid";
	    else
		this._targetArea = "bot";
	    console.log(this._targetArea + ": " + y + " <=> " + onethird  + " (" + inHit.t + " - " + matchloc.t + ")");
	    var target =  this.root.findDomNode(match);

	    console.log("TARGET:" + (target ? target.content : "null"));
	    return target;

	},

	targetInRoot: function(inHit) {
	  var h = inHit;
	  var b = wm.calcOffset(this.draggedItem, this.manager.root.domNode);
	    //var b = wm.calcOffset(studio.selected._studioTreeNode.domNode, studio.widgetsTree.root.domNode);
	  var result = !(h.l < 0 || h.t < 0 || h.l > b.w || h.t > b.h);;
	  return result;
	}
});
