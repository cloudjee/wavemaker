/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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


dojo.provide("wm.base.design.Drag");
dojo.provide("dojo.dnd.Source");
dojo.provide("dojo.dnd.Target");


dojo.declare("Main", wm.Page, {
    dndElements: null,
    selectedItem: null,
    propertiesPanel: null,
    propertiesPanelItem: null,
    itemCount: 1,
    items: null,
    itemDragger: null,
    draggedItem: null,
    dragDropItem: function() {
	var target = this.dragger.target;
	if (!target)
	    return;
	if (target.hasFileWithName(this.draggedItem.getItemName())) {
	    alert("A file with that name already exists");
	    return;
	}
	main.resourceManager.setOperation("renameFile");
	main.resourceManager.setValue("input.from", this.draggedItem.getFullFilePath());
	main.resourceManager.setValue("input.to", target.getFullFilePath() + "/" + this.draggedItem.getItemName());	
	main.resourceManager.update();
	var _this = this;
	main.resourceManager.onSuccess = function(result) {
	    _this.draggedItem.parent.removeChild(_this.draggedItem);
	    target.addChild(_this.draggedItem);
	}
    },

    setMoverRoot: function(root) {
	this.dragger.root = root;
    },
    start: function() {
	this.propertiesPanel = this.resourceProperties;

	this.dragger = new wm.ResourceMover();
	this.dragger.ondrop = dojo.hitch(this, "dragDropItem");

	// Setup the resources folder
	//this.resourcesFolder.setHeight("100%");
	//this.resourcesFolder.setMarginLeft(0);

	this.items = [["Folder", "A folder for your resources", "foldericon.jpg", "wm.FolderResourceItem"], 
		      /*
		      ["Image", "A graphics resource file", "picture.png", "wm.ImageResourceItem"],
		      ["JS Library", "A javascript resource file", "jscript.jpg", "wm.JSResourceItem"],
		      ["CSS Library", "A CSS resource file", "css.jpg", "wm.CSSResourceItem"],
		      ["Jar File", "A CSS resource file", "css.jpg", "wm.JarResourceItem"],
		      ["Zipped Folder", "A CSS resource file", "css.jpg", "wm.ZipResourceItem"],
		      ["Misc", "A misc resource (.swf, .txt, .etc)", "document.jpg", "wm.MiscResourceItem"]];
		      */
		      ["File", "Any kind of file (image, zip, jar, js, css, etc, etc)", "document.jpg", "wm.MiscResourceItem"]];

	// Setup the palette for drag and drop items
	var resourcePalette = this.resourcePalette;

	//resourcePalette.setMoverRoot(this.resourcesFolder);
	this.items.forEach(function(item) {
	    var treeNode = resourcePalette.addItem(item[0],item[1],item[2],item[3]);
	});	

	this.loadResourcesData();
  },
    loadResourcesData: function() {
	main.resourceManager.setOperation("getResourceFolder");
 	main.resourceManager.update(); 

	if (this.resourcesFolder) {
	    this.resourcesFolder.destroy();
	    this.selectedItem = null;
	    this.draggedItem = null;
	}

	var _this = this;
	main.resourceManager.onSuccess = function(rootfolder) {
	    _this.resourcesFolder = new wm.FolderResourceItem({parent: _this.resourcesCanvas,
							       itemName: "resources",
							       saved: true,
							       width: "100%",
							       height: "100%",
							       isRoot: true});
	    _this.resourcesFolder.initFromJSON(rootfolder);
	    _this.resourcePalette.setMoverRoot(_this.resourcesFolder);
	    _this.setMoverRoot(_this.resourcesFolder);
	    _this.resourcesFolder.setHeight("100%");
	    _this.resourcesFolder.setMarginLeft(0);
	    _this.reflow();
	};

    },
    setSelectedItem: function(item) {
	if (this.selectedItem != null) 
	    this.selectedItem.unselectSelf();
	item.selectSelf();
	this.selectedItem = item;
	this.showPropertiesPanel();
    },
    clearSelectedItem: function(item) {
	if (this.selectedItem != null) {
	    this.selectedItem.unselectSelf();
	    this.selectedItem = null;
	}
	this.hidePropertiesPanel();
    },
    hidePropertiesPanel: function() {
	this.propertiesPanel.removeAllControls();
    },
    forceShowPropertiesPanel: function() {
	main.propertiesPanelItem = null;
	this.showPropertiesPanel();
    },
    showPropertiesPanel: function() {
	if (this.propertiesPanelItem != null && this.propertiesPanelItem != this.selectedItem)
	    if (!confirm("You have any unsaved changes to this item; continue anyway?")) return;
	if (this.propertiesPanelItem != this.selectedItem) {
	    this.propertiesPanel.removeAllControls();
	    this.resourcePropertiesHeaderIcon.setSource(this.selectedItem.iconSrc);
	    this.resourcePropertiesHeaderLabel.setCaption(this.selectedItem.type);
	    this.selectedItem.setupPropertiesPanel(this.propertiesPanel);
	    this.selectedItem.setupPropertiesPanelOperations(this.propertiesPanel);
	    this.propertiesPanel.reflow();
	}
    },
  _end: 0
});

dojo.declare("wm.ResourcePalette", wm.Tree, {
	init: function() {
		this.items = [];
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", this, "mousedown");
		this.dragger = new wm.ResourceMover();
		this.dragger.ondrop = dojo.hitch(this, "dragDropPalette");
		this.node = new wm.TreeNode(this.root, {content: "Resources",
							  name: "Resources",
							  closed: false});
	},
	setMoverRoot: function(root) {
	    this.dragger.root = root;
	},
	mousedown: function(e) {
		var t = this.findEventNode(e);
		if (t) {
			if (t.klass)
			    this.drag(e, t.name, t.klass, t.props);
			else if (t.parent == this.root && e.target != t.btnNode)
				t.setOpen(t.closed);
		}
	},
	drag: function(inEvent, inCaption, inType, inProps) {
			this.dragger.beginDrag(inEvent, {
			    caption: inCaption,
				type: inType,
				props: inProps
			});
	},
	dragDropPalette: function() {
	    var target = this.dragger.target;
	    if (!target)
		return;
	    var droppedItem = eval("new " + this.dragger.info.type + "()");
	    target.addChild(droppedItem);
	    main.setSelectedItem(droppedItem);
	    if (this.dragger.info.type == "wm.FolderResourceItem")
		droppedItem.mkdir();

		/*
		var info = this.dragger.info;
		var props = dojo.clone(info.props || {});
		var ctor = dojo.getObject(info.type);
		dojo.mixin(props, {
			_designer: studio.page._designer,
			name: studio.page.getUniqueName(props.name || studio.makeName(info.type)),
			owner: studio.page,
			parent: this.dragger.target
		});
		if (ctor.prototype instanceof wm.Control) {
			props.height = ctor.prototype.height || props.height || "48px";
			props.width = ctor.prototype.width  || props.width || "96px";
		}
		var comp = new ctor(props);
		if (comp) {
			if (!(comp instanceof wm.ServerComponent)) {
				// create an undo task
				new wm.AddTask(comp);
			}
			if (comp instanceof wm.Control) {
				//comp.designMoveControl(this.dragger.target, this.dragger.dropRect);
				this.dragger.target.designMoveControl(comp, this.dragger.dropRect);
			}
			if (!wm.fire(comp, "afterPaletteDrop")) {
				// FIXME: should not refresh entire tree when dropping from palette.
				studio.refreshDesignTrees();
				studio.inspector.resetInspector();
				studio.select(comp);
			}
		}
		*/
	},
	addItem: function( inName, inDescription, inImage, inClass, inProps) {
			wm.fire(this.findItemByName(inName, this.node), "destroy");

			var n = new wm.TreeNode(this.node, {
			    name: inName,
			    content: inName,
			    image: inImage,
			    klass: inClass,
			    props: inProps
			});
			return n;
	},


	findItemByName: function(inName, inParent) {
		inParent = inParent || this.root;
		for (var i=0, nodes=inParent.kids, n; (n=nodes[i]); i++) {
			if (inName == (n||0).name)
				return n;
		}
	},
	select: function() {
	},
	// bc
	setLayerIndex: function() {
	},
	clearSection: function(inName) {
	    /*
		var p = this.findItemByName(inName);
		if (p) {
			dojo.forEach(p.kids, function(n) {
				delete wm.ResourcePalette.items[n.klass];
			});
			p.removeChildren();
		}
	    */
	},
	removeSection: function(inName) {
	    /*
		wm.fire(this.findItemByName(inName), "destroy");
	    */
	}
});

dojo.declare("wm.ResourceMover", wm.DragDropper, {
	constructor: function() {
		this.info = {};
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
		this.rootOffset = wm.calcOffset(this.root.domNode.parentNode, this.scrimNode);
		this.inherited(arguments);
		this.setTarget(null);
	},
	drag: function(e) {
		this.inherited(arguments);
		// calc a target rect
		var r = { l: this.pxp - this.rootOffset.x, t: this.pyp - this.rootOffset.y, w:0, h: 0};
		// locate target
		this.findTarget(r);
		if (this.target) {
			// calculate suggested drop rect
		    var r = this.target.getBounds();
		    var rtmp = {h: r.h,
				t: r.t,
				l: r.l,
				w: r.w};
		    var o = wm.calcOffset(this.target.domNode.parentNode, this.target.domNode);
		    rtmp.l += o.x;
		    rtmp.t += o.y;
		    
		    var targetParent = this.target;
		    while (targetParent instanceof wm.FolderResourceItem) {
			rtmp.l += targetParent.marginLeft;
			rtmp.w -= targetParent.marginLeft; 
			targetParent = targetParent.parent;
		    }
		    kit._setMarginBox(this.markNode, rtmp.l, rtmp.t, rtmp.w, rtmp.h);

		    // cache drop position
		    //this.dropRect = r;
		} 
	},
	drop: function(e) {
	    this.inherited(arguments);
	    if (!this.target) return;	    
	},
	setTarget: function(inTarget){
		if (this.target && this.target.layout.removeEdges)
			this.target.layout.removeEdges(this.target);
		this.target = inTarget;
		if (this.target) {
			this.setCursor("default");
			this.targetNode = this.target.domNode;
		} else {
			this.setCursor("no-drop");
			this.targetNode = null;
		}
		if (this.target && this.target.layout.renderEdges)
			this.target.layout.renderEdges(this.target, this.info.control);
		this.updateAvatar();
	},
	updateAvatar: function() {
		this.showHideAvatar(Boolean(this.target));
		if (this.target) {
		    var dn = this.target.getItemName();
			this.setAvatarContent("Drop <b>" + this.info.caption + "</b>" + " into <b>" + dn + "</b>");
		}
	},
	findTarget: function(inHit) {
		var t;
		if (this.targetInRoot(inHit)) {
			t = this._findTarget(inHit, this.root);
			if (!t) t = this.root;
		}

		if (!t)
			kit._setMarginBox(this.markNode, 0, 0, 0, 0);
		if (t != this.target) {
			this.setTarget(t);
		}
	},
	_findTarget: function(inHit, inWidget, inMargin) {
		var h = inHit, dn = inWidget.domNode, w, b, o;
		var sl = dn.scrollLeft, st = dn.scrollTop;
		var ws = inWidget.resourceChildren;
		var m = inMargin || 0;
		for (var i in ws) {
			w = ws[i];
			// Can't drop an item into itself.  Can only drop onto an item that is a resourceDropTarget
			if (w != this.info.control && w.resourceDropTarget) {
			    
			    // get and correct the bounding box for the widget we are currently testing
			    b = kit._getMarginBox(w.domNode);
			    if (w.domNode.parentNode != inWidget.domNode){
				// offset from target rect to hit frame
				o = wm.calcOffset(w.domNode.parentNode, inWidget.domNode);
				b.l += o.x; 
				b.t += o.y;
			    } else {
				b.l -= sl; 
				b.t -= st;
			    }
				
			    // must be well inside
			    b.r = b.l + b.w; 
			    b.b = b.t + b.h;

			    // If we have dragged it inside of the bounds of this widget, it must also be inside of one of this widget's children...
			    // if that child happens to be a resourceDropTarget
			    if (h.l-b.l>m && b.r-h.l>m && h.t-b.t>m && b.b-h.t>m) {
				h.l -= b.l; 
				h.t -= b.t;
				return this._findTarget(h, w, m+1) || w;
			    }
			}
		}
		return null;
	},
	/*
	_isCanvasTarget: function(inHit, inCanvas) {
	    var h = inHit;
	    var dn = inCanvas.domNode;
	    var sl = dn.scrollLeft, st = dn.scrollTop;
	    var canvasBounds = kit._getMarginBox(inCanvas.domNode);
	    var dropBounds   = kit._getMarginBox(inHit.domNode);
	    / *
	    var m = 0;

	    // offset from target rect to hit frame
	    o = wm.calcOffset(inCanvas.domNode.parentNode, inCanvas.domNode);
	    b.l += o.x; 
	    b.t += o.y;

	    // must be well inside
	    b.r = b.l + b.w; 
	    b.b = b.t + b.h;
	    console.group("Inside??");console.dir(h);console.dir(b);console.groupEnd();
	    * p/
	    if (this._between(dropBoundsl, canvasBounds.l, canvasBounds.l+canvasBounds.w) && this._between(dropBoundst, canvasBounds.t, canvasBounds.t+canvasBounds.h)) {
		return true;
	    }
	    return false;
	},
	_between: function(val, i, j) {
	    return val >= i && val <= j;
	},
*/
	targetInRoot: function(inHit) {
		var h = inHit, b = kit._getMarginBox(this.root.domNode);
		return !(h.l < 0 || h.t < 0 || h.l > b.w || h.t > b.h);
	}
});


dojo.declare("wm.ResourceItem", wm.Container, {
    itemName: "",
    nameLabel: "",
    icon: "",
    iconSrc: "document.jpg",
    itemPanel: "",
    resourceChildren: null, // don't use normal container child relation as that just gives the next panel up/down, not the next ResourceItem up/down
    marginLeft: 20,
    defaultBorderColor: "#AAAAAA",
    saved: false, // does NOT mean the latest changes are saved; means that there is a file on the server that represents this resource
    showFileUplaod: true,
    setSaved: function(isSaved) {
	this.saved = isSaved;
    },
    init: function() {
	this.inherited(arguments);

	this.connect(this.domNode, "onmousedown", this, "mousedown");

	this.setLayoutKind("top-to-bottom");
	this.resourceDropTarget = false;
	this.setHeight("40px");
	this.setWidth("100%");
	this.setVerticalAlign("top");
	this.setHorizontalAlign("left");
	this.setBorder("2");
	this.setBorderColor(this.defaultBorderColor);
	this.setMargin("0,0,0," + this.marginLeft);

	// itemPanel only matters for a folderItem
	this.itemPanel = new wm.Panel({parent: this, width: "100%", height: "35px", layoutKind: "left-to-right", showing: true});
	this.itemName = this.itemName || "New_Item_" + main.itemCount++;
	this.icon = new wm.Picture({parent: this.itemPanel,
				    width: "35px",
				    height: "35px",
				    source: this.iconSrc,
				    showing: true});
	
	this.nameLabel = new wm.Label({parent: this.itemPanel, width: "100%", height: "35px", caption: this.itemName, singleLine: true, showing: true});
	this.resourceChildren = []; 

	this.connectEvents(this.itemPanel.domNode, ["click"]);

    },
    createNewResourceItem: function(filename) {
	var ext = filename.substring(filename.lastIndexOf(".")+1);
	var newfile;
	switch (ext) {
	case "jpg":
	case "jpeg":
	case "gif":
	case "png":
	case "tif":
	case "bmp":
	    newfile = new wm.ImageResourceItem({//parent: this,
					       width: "100%",
						       height: "35px",
						       saved: true});
	    break;
	case "jar":
	    newfile = new wm.JarResourceItem({//parent: this,
					     width: "100%",
						     height: "35px",
						     saved: true});
	    break;
	case "zip":
	    newfile = new wm.ZipResourceItem({//parent: this,
					     width: "100%",
						     height: "35px",
						     saved: true});
	    break;
	case "js":
	    newfile = new wm.JSResourceItem({//parent: this,
					    width: "100%",
						    height: "35px",
						    saved: true});
	    break;
	case "css":
	    newfile = new wm.CSSResourceItem({//parent: this,
					     width: "100%",
						     height: "35px",
						     saved: true});
	    break;
	default:
	    newfile = new wm.MiscResourceItem({//parent: this,
					      width: "100%",
						      height: "35px",
						      saved: true});
	}
	return newfile;
    },
    removeSelf: function() {
	this.parent.removeChild(this);
    },

    initFromJSON: function(json) {
	    this.setItemName( json.file,true);
	    var result = json.file.match(/\d+$/);
	    if (result && result[0] > main.itemCount)
		main.itemCount = parseInt(result[0])+1;
    },
    mousedown: function(e) {
	if (!this.isRoot)
	    this.drag(e);
    },
    drag: function(inEvent) {
	main.draggedItem = this;
	main.dragger.beginDrag(inEvent, {
	    caption: this.getItemName(),
	    type: this.type
	});
    },
    /*
    dragDrop: function() {
	var target = this.dragger.target;
	if (!target)
	    return;
	var droppedItem = eval("new " + this.dragger.info.type + "()");
	target.addChild(droppedItem);
	main.setSelectedItem(droppedItem);
	if (this.dragger.info.type == "wm.FolderResourceItem")
	    droppedItem.mkdir();
    },
    */
    setItemName: function(inName, nosave) {
	var newpath = this.buildFilePath(inName);
	if (nosave) {
	    this.itemName = inName;
	    this.nameLabel.setCaption(inName);
	    return;
	}
	main.resourceManager.setOperation("renameFile");
	main.resourceManager.setValue("input.from", this.getFullFilePath());	
	main.resourceManager.setValue("input.to", newpath);	
	main.resourceManager.update();
	var _this = this;
	main.resourceManager.onSuccess = function(result) {
	    if (!result) {
		alert("Failed to change name");
		return;
	    }
	    _this.itemName = inName;
	    _this.nameLabel.setCaption(inName);
	    main.forceShowPropertiesPanel();
	};
    },
    /*
    setItemName: function(inName) {
	this.itemName = inName;
	this.nameLabel.setCaption(inName);
    },
    */
    getItemName: function() {
	return this.itemName;
    },
    setIcon:  function(inSrc) {
	this.iconSrc = inSrc;
	this.icon.setSource(inSrc);
    },

    selectSelf: function() {
	this.setBorderColor("red");
    },
    unselectSelf: function() {
	this.setBorderColor(this.defaultBorderColor);
    },
    click: function(e) {
	this.onclick(e);
    },
    onclick: function(e) {
	main.setSelectedItem(this);
	dojo.stopEvent(e);
    },
    setMarginLeft: function(val) {
	this.setMargin("0,0,0," + val);
	this.marginLeft = val;
    },
    setupPropertiesPanelOperations: function(panel) {
	var _this = this;
	new wm.Bevel({parent: panel});
	new wm.Label({parent: panel, 
		      caption: "Operations",
		      width: "100%",
		      height: "35px"});
	new wm.Button({parent: panel,
		       caption: "Delete",
		       onclick: function() {_this.deleteItem();}});
    },
    setupPropertiesPanel: function(panel) {
	var _this = this;
	var name_edit;
	var hasFile = this.saved;
	if (hasFile) {
	    name_edit = new wm.TextEditor({parent: panel,
					   readonly: this.isRoot,
					   caption: "name",
					   height: "24px",
					   width: "100%",
					   captionSize: "60%",
					   dataValue: this.getItemName()});

	    name_edit.onchange = function() {
		_this.setItemName(this.getDataValue(),false);
	    };
	}
	if (this.showFileUplaod) {
	    var upload_edit = new wm.FileUpload({parent: panel,
						 name: "uploader",
						 service: "resourceManager",
						 operation: "uploadFile",
						 showing: true,
						 height: "65px",
						 width: "100%",
						 horizontalAlign: (hasFile) ? "left" : "middle",
						 caption: "",
						 uploadButton: true,
						 uploadButtonPosition: "bottom",
						 uploadButtonCaption: "Upload",
						 "input.folder": this.getFullFilePath()}); 
	    this.connect(upload_edit, "onComplete", this, "finishFileUpload");  

	}	    
	if (hasFile) {
	    new wm.Label({parent: panel,
			  caption: "path:",
			  width: "100%",
			  height: "24px"});
	    new wm.Label({parent: panel,
			  caption:  "resources/" + this.getFullFilePath(),
			  singleLine: false,
			  width: "100%",
			  height: "48px"});
	}
    },
    getFullFilePath: function() {return this.buildFilePath(this.getItemName());},
    buildFilePath: function(name) {
	var path =  name;
	var parent = this.parent;
	while(parent instanceof wm.FolderResourceItem && parent.itemName != "resources") {
	    path = parent.itemName + "/" + path;
	    parent = parent.parent;
	}
	return path;
    },

    moveFile: function(newpath) {
	main.resourceManager.setOperation("renameFile");
	main.resourceManager.setValue("input.from", this.getFullFilePath());
	main.resourceManager.setValue("input.to", newpath);	
	main.resourceManager.update();
	var _this = this;
	main.resourceManager.onSuccess = function(result) {
	    if (!result) {
		alert("Failed to move file");
		return;
	    }
	    _this.itemName = newname;
	    _this.reflow();
	};
    },

    finishFileUpload: function(json) {
	var _this = this;
	var isNewFile = !this.saved; 
	this.setSaved(true); 
	var uploadedName = json.result;
	main.resourceManager.setOperation("renameFile");
	main.resourceManager.setValue("input.from", ".tmp/" + uploadedName);
	if (isNewFile) {
		console.log("HO HO");
	    console.dir(this);
	    var newfile = this.createNewResourceItem(uploadedName);
	    newfile.setItemName(uploadedName,true);
	    this.parent.addChild(newfile);
	    this.removeSelf();
	    _this = newfile;  // ok, kind of a nasty hack...
	    main.resourceManager.setValue("input.to", _this.getFullFilePath());
	} else
	    main.resourceManager.setValue("input.to", this.getFullFilePath());

	main.resourceManager.update();
	main.resourceManager.onSuccess = function(result) {
	    _this.finishFileUploadOnSuccess(result); // I prefer this to connect because its error prone to have to constantly disconnect stuff
	};
    },
    finishFileUploadOnSuccess: function(result) {  
	//this.disconnect(main.resourceManager, "onSuccess", this, "finishFileUploadOnSuccess");
	if (!result) {
	    alert("Failed to place file");
	    return;
	}
	this.reflow();
	// Force the properties panel to regenerate with any new data
	main.forceShowPropertiesPanel();
    },
    deleteItem: function() {
	if (!confirm("Are you sure you want to delete " + this.getItemName() + "?"))
	    return;

	main.resourceManager.setOperation("deleteFile");
	main.resourceManager.setValue("input.name", this.getFullFilePath());
	main.resourceManager.update();
 	var _this = this;
	main.resourceManager.onSuccess = function(result) { 
	    if (!result) {
		alert("Failed to delete " + _this.getItemName()); 
		return;
	    }
	    _this.parent.removeChild(_this);
	    main.hidePropertiesPanel();
	};
    }
});

dojo.declare("wm.ImageResourceItem", wm.ResourceItem, {
    iconSrc: "picture.png",
    init: function() {
	this.inherited(arguments);
    },
    setupPropertiesPanel: function(panel) {
	this.inherited(arguments);
	new wm.Picture({parent: panel,
			source: "resources/" + this.getFullFilePath() + "?" + Math.floor(Math.random()*10000000), // insure changes to the image don't get cached
			width: "80px",
			border: 2,
			margin: 8,
			padding: 8,
			borderColor: "black",
			height: "80px"}).domNode.style.backgroundColor = "white";
    }
});

dojo.declare("wm.JSResourceItem", wm.ResourceItem, {
    iconSrc: "jscript.jpg",
    init: function() {
	this.inherited(arguments);
    }
});

dojo.declare("wm.CSSResourceItem", wm.ResourceItem, {
    iconSrc: "css.jpg",
    init: function() {
	this.inherited(arguments);
    }
});

dojo.declare("wm.MiscResourceItem", wm.ResourceItem, {
    init: function() {
	this.inherited(arguments);
    }
});


dojo.declare("wm.ZipResourceItem", wm.ResourceItem, {
    iconSrc: "document.jpg",
    init: function() {
	this.inherited(arguments);
    },
    finishFileUploadOnSuccess: function(result) {
	//this.disconnect(main.resourceManager, "onSuccess", this, "finishFileUploadOnSuccess");
	if (!result) {
	    alert("Failed to place file");
	    return;
	}
	main.resourceManager.setOperation("unzipFile");
	main.resourceManager.setValue("input.file", this.getFullFilePath());
	main.resourceManager.update();
	
	var _this = this;
	main.resourceManager.onSuccess = function(result) {
	    if (!result) {
		alert("Failed to unzip the file");
		return;
	    }
	    main.loadResourcesData();    
	}
    } 
});

dojo.declare("wm.JarResourceItem", wm.ResourceItem, {
    iconSrc: "document.jpg",
    init: function() {
	this.inherited(arguments);
    }
});

dojo.declare("wm.FolderResourceItem", wm.ResourceItem, {
    defaultBorderColor: "#080808",
    iconSrc: "foldericon.jpg",
    isRoot: false,
    showFileUplaod: false,
    init: function() {
	this.inherited(arguments);
	this.resourceDropTarget = true;
	var filePath = this.getFullFilePath();
    },
    mkdir: function() {
	var _this = this;
	if (!this.saved) {
	    main.resourceManager.setOperation("createFolder");
	    main.resourceManager.setValue("input.name", this.getFullFilePath());
	    main.resourceManager.update();
	    var newfolder = this;
	    main.resourceManager.onSuccess = function(result) {
		if (!result) {
		    alert("Failed to create folder");
		    return;
		}
		newfolder.setSaved(true);
	    };

	}
    },
    // Initializes itself and its children from a json obj
    initFromJSON: function(json) {
	this.inherited(arguments);	
	var _this = this;
	json.files.forEach(function(file) {
	    var newfile;
	    if (file.type == "folder")
		newfile = new wm.FolderResourceItem({//parent: this,
						     width: "100%",
						     height: "35px",
						     saved: true});
	    else {
		var name = file.file;
		newfile = _this.createNewResourceItem(name);
	    }
	    newfile.initFromJSON(file);
	    //console.log("Added " + newfile.getItemName());
	    _this.addChild(newfile);
	});
    },

    addChild: function(inChild) {
	inChild.setParent(this);
	this.resourceChildren.push(inChild);
	var parent = this;
	while ((parent == this || parent instanceof wm.FolderResourceItem) && !parent.isRoot) { // find a better test for whether the parent is a folder or our canvas
	    parent.setHeight((parseInt(parent.height) + parseInt(inChild.height)) + "px");
	    parent = parent.parent;
	}
	this.reflow();
    }, 
    removeChild: function(inChild) {
	var h = parseInt(inChild.height);

	var index = this.resourceChildren.indexOf(inChild);
	this.resourceChildren.splice(index,1);
	this.removeControl(inChild);	
	new dojo.NodeList(inChild.domNode).orphan();
	
	var parent = this;
	while ((parent == this || parent instanceof wm.FolderResourceItem) && !parent.isRoot) { // find a better test for whether the parent is a folder or our canvas
	    parent.setHeight((parseInt(parent.height) - h) + "px");
	    parent = parent.parent;
	}
	this.reflow();
    },
    hasFileWithName: function(name) {
	for (var i = 0; i < this.resourceChildren.length; i++) {
	    if (this.resourceChildren[i].getItemName() == name) return true;
	}
	return false;
    }
    /*
    setupPropertiesPanel: function(panel) {
		      
    }
    */
});

wm.ResourcePalette.items = [];
