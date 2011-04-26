/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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


dojo.provide("wm.studio.pages.ResourceManager.ResourceManager");


dojo.declare("ResourceManager", wm.Page, {
  loadingResourceStart: 0,
    dndElements: null,
    selectedItem: null,
    propertiesPanel: null,
    propertiesPanelItem: null,
    itemCount: 1,
    items: null,
    itemDragger: null,
    draggedItem: null,
    fileUploadButton: null,
    fileDialog: null,
    //promptDialog: null,
    doingFileUpdate: false,
    updateModifiedDate: function() {
	studio.resourcesLastUpdate = new Date().getTime();
    },
    deleteItem: function() {
      this.selectedItem.deleteItem();
    },
    renameItem: function() {
        if (!this.selectedItem || this.selectedItem.isRoot()) return;

        app.prompt(this.getDictionaryItem("PROMPT_NAME", {oldName: this.selectedItem.getItemName()}), 
		   this.selectedItem.getItemName(), 
                   dojo.hitch(this.selectedItem, "setItemName"));
/*
	this.promptDialog.page.setTitle("Prompt: Rename");
	this.promptDialog.page.setInstructions("Rename '" + this.selectedItem.getItemName() + "' to:");
	this.promptDialog.page.setValue(this.selectedItem.getItemName());

	this.promptDialog.show();
	this.promptDialog.page.connect(this.promptDialog.page, "getResult", this.selectedItem, "setItemName");
        */
    },

    addNewFolder: function() {
	var selectedItem = this.selectedItem;
	if (selectedItem && !(selectedItem instanceof wm.FolderResourceItem)) {
	  selectedItem = selectedItem.getParent();
	} else if (!selectedItem) {
	    selectedItem = this.resourcesFolder;
	}
	this.setSelectedItem(selectedItem);
        app.prompt(this.getDictionaryItem("PROMPT_FOLDER_NAME"), "", dojo.hitch(this.selectedItem, "addNewFolder"));
/*
	this.getAddPromptDialog();
	this.promptDialog.page.setTitle("Prompt: New Folder");
	this.promptDialog.page.setInstructions("Choose a folder name");
	this.promptDialog.page.setValue("");
	this.promptDialog.page.connect(this.promptDialog.page, "getResult", this.selectedItem, "addNewFolder");
	this.promptDialog.show();
        */
    },
/*
    addNewFile: function() {
	// add a reusable dialog box that takes only a FileUpload widget
	this.doingFileUpdate =  false;
	this.getAddFileDialog().show();	
    },
    updateItem: function() {
	// add a reusable dialog box that takes only a FileUpload widget
        this.doingFileUpdate =  true;
	this.getAddFileDialog().show();
    },
    */
    downloadItem: function() {
      this.selectedItem.downloadItem();
    },
/*
    getAddPromptDialog: function() {
      / *
	if (!this.selectedItem) {
	    this.setSelectedItem(this.resourcesFolder);
	}
      * /
	if (!this.promptDialog) {
		var
		    props = {
			owner: this,
			pageName: "Prompt",
			scrimBackground: true,
			hideOnClick: false,
			positionLocation: "  ",
			positionNode: this.tree.domNode,
			border: "1px"
		    };
		    this.promptDialog = new wm.PagePopup(props);
		    this.promptDialog.setContainerOptions(true, 450, 200);
		    //this.connect(this.fileDialog.page, "importClickCallback", this, "fileUploadCompleted");
		    this.promptDialog.page.setupOnShow(this.promptDialog);
	}
	return this.promptDialog;
    },
    */
/*
    getAddFileDialog: function() {
	if (!this.selectedItem) {
	    this.setSelectedItem(this.resourcesFolder);
	}
	if (!this.fileDialog) {
		var
		    props = {
			owner: this,
			pageName: "ImportFile",
			scrimBackground: true,
			hideOnClick: false,
			positionLocation: "  ",
			positionNode: this.tree.domNode,
			border: "1px"
		    };
		    this.fileDialog = new wm.PagePopup(props);
		    var page = this.fileDialog.importFile;
		    page.setUploadService("resourceFileService");
		    page.setUploadOperation("uploadFile");
		    page.setTitle(bundleStudio.R_UploadFile);
		    page.setCaption(bundleStudio.R_SelectFile);
		    this.fileDialog.setContainerOptions(true, 500, 120);
		    window.debugThis = this.fileDialog;
		    this.connect(this.fileDialog.page, "importClickCallback", this, "fileUploadCompleted");
	}
	return this.fileDialog;
    },
    */
    fileUploadCompleted: function(inSender, fileList) {
	var filename = fileList[0].name;
	var selectedItem = this.selectedItem || this.resourcesFolder;
	if (selectedItem && !(selectedItem instanceof wm.FolderResourceItem)) {
	    selectedItem = selectedItem.treeNode.parent.data;
	}
	if (!selectedItem) {
	    selectedItem = this.resourcesFolder;
	}

	var newName;
	var newItem;
	var parent = selectedItem;

	var replaceIndex = -1;
	for (var i = 0; i < parent.treeNode.kids.length; i++) {
	    if (parent.treeNode.kids[i].content == filename)
		replaceIndex = i;
	}

	if (replaceIndex == -1) {
	  newItem = addResourceBinderNodes(parent.treeNode, {file: filename, files: [], type: "file"}, false);
	    //newName = filename;
	} else {
	    newItem = parent.treeNode.kids[replaceIndex].data;

	    //newName = newItem.getItemName();
	}

	this.setSelectedItem(newItem);
	parent.treeNode.setOpen(true);
        if (newItem.finishFileUpload)
	    newItem.finishFileUpload();
    },

    start: function() {
	this.propertiesPanel = this.resourceProperties;
	this.dragger = new wm.ResourceMover();
	this.dragger.ondrop = dojo.hitch(this, "dragDropItem");

	// Setup the resources folder
	//this.resourcesFolder.setHeight("100%");
	//this.resourcesFolder.setMarginLeft(0);

	//this.items = [["Folder", "A folder for your resources", "/wavemaker/images/resourceManagerIcons/folder16.png", "wm.FolderResourceItem"], 
		      /*
		      ["Image", "A graphics resource file", "picture.png", "wm.ImageResourceItem"],
		      ["JS Library", "A javascript resource file", "jscript.jpg", "wm.JSResourceItem"],
		      ["CSS Library", "A CSS resource file", "css.jpg", "wm.CSSResourceItem"],
		      ["Jar File", "A CSS resource file", "css.jpg", "wm.JarResourceItem"],
		      ["Zipped Folder", "A CSS resource file", "css.jpg", "wm.ZipResourceItem"],
		      ["Misc", "A misc resource (.swf, .txt, .etc)", "document.jpg", "wm.MiscResourceItem"]];
		      */
		      //["File", "Any kind of file (image, zip, jar, js, css, etc, etc)", "/wavemaker/images/resourceManagerIcons/file16.png", "wm.MiscResourceItem"]];

	/*
	// Setup the palette for drag and drop items
	this.resourcePalette = studio.resourcePalette;
	var resourcePalette = this.resourcePalette;

	//resourcePalette.setMoverRoot(this.resourcesFolder);
	dojo.forEach(this.items,function(i) {
	    var treeNode = resourcePalette.addItem(i[0],i[1],i[2],i[3]);
	});	
	*/
	//this.loadResourcesData();
    },
    
    loadResources: function() {
	// I'd rather this was in this.start, but start gets called when the studio loads, not when this page shows. Waste of time loading this stuff before knowing if the user will navigate here.
	//this.loadResourcesData(false);
        ;
	// If two calls go to loadResources within less than 3 seconds, ignore the second one.
	if (this.loadingResourceStart + 3000 > new Date().getTime()) return;
	var t = this.tree;
	t.clear();
	this.selectedItem = null;
	var _this = this;
	this.loadingResourceStart = new Date().getTime();
	this.showLoadingIndicator();
	studio.resourceManagerService.requestAsync("getResourceFolder", [], 
                                                   function(rootfolder) {_this.initResourcesData(rootfolder);},
                                                   dojo.hitch(app, "toastWarning"));	
    },
  initResourcesData: function(rootfolder) {

    this.loadingResourceStart = new Date().getTime(); // update this value in case it took multiple seconds to load the resources

	  this.resourcesModifiedData = new Date().getTime();
	  this.resourcesFolder = addResourceBinderNodes(this.tree.root, rootfolder,true);
/*
	  if (!this.promptDialog)
	    this.getAddPromptDialog();
            */
	this.hideLoadingIndicator();
	this.showPropertiesPanel();
	  
  },
    dragDropItem: function() {
      var moveNode = this.draggedItem;
      var moveItem   = moveNode.data;
      
      var targetNode = this.dragger.target;
      if (!targetNode) {
	return;
      }
      var targetItem = targetNode.data;

      if (moveItem.getParent() == targetItem) {
	    return;
	}

	if (targetItem.hasFileWithName(moveItem.getItemName())) {
	    app.alert(this.getDictionaryItem("ALERT_NAME_EXISTS"));
	    return;
	}
	var _this = this;
	studio.resourceManagerService.requestAsync("renameFile", 
                                                   [moveItem.getResourcelessFilePath(), targetItem.getResourcelessFilePath() + "/" + moveItem.getItemName(), false], 
						   function(response) {
						     try {
						       if (!response) {
							   app.alert(_this.getDictionaryItem("ALERT_RENAME_FAILED"));
						       } else {
							 var oldparent = moveNode.parent;
							 oldparent._remove(moveNode);
							 moveNode.addParent(targetNode);
							 //oldparent.render();
							 targetNode.renderChild(moveNode);
							 _this.updateModifiedDate();							   
							 _this.showPropertiesPanel(1);
						       }
						     } catch(e) {
						       console.error("Drag and Drop Move Failed:" + e);
						       _this.loadResourcesData(true);
						     }
						   },
                                                   dojo.hitch(app, "toastWarning"));	
    },
    /*

    setMoverRoot: function(root) {
	this.dragger.root = root;
    },
    */
    showLoadingIndicator: function() {
	var loader = wm.createElement("div", {
	    id: "_wm_loading",
	    innerHTML: '<div id="_wm_loading" style="position: absolute; font-weight: bold; font-size: 12pt; z-index: 100; top: 40%; left: 40%;"><img alt="loading" style="vertical-align: middle" src="lib/boot/images/loader.gif" />&nbsp;' + this.getDictionaryItem("LOADING") + '</div>'});
	document.body.appendChild(loader);
    },
    hideLoadingIndicator: function() {
	dojo._destroyElement("_wm_loading");
    },
    loadResourcesData: function(keepOpenFolders) {

	// var manager = this.getResourceManager();
	// manager.setOperation("getResourceFolder");
		     // 	manager.update(); 	
		     var _this = this;

		     this.showLoadingIndicator();
		     studio.resourceManagerService.requestAsync("getResourceFolder", [], 
					     function(rootfolder) { 
					       var openFolderHash;
					       if (keepOpenFolders && _this.resourcesFolder) {
						 openFolderHash = {isOpen: true, children: _this.resourcesFolder.buildOpenFolderStateHash()};
					       } else {
						 openFolderHash = {};
					       }
						 _this.tree.clear();
						 _this.initResourcesData(rootfolder);

						 if (keepOpenFolders) {
						     _this.resourcesFolder.useOpenFolderStateHash(openFolderHash);
						 }

						 _this.hideLoadingIndicator();
					     },
								function(inError) {
								    _this.hideLoadingIndicator();
                                                                    this.reportError(inError);
								});
     
	if (this.resourcesFolder) {
	    this.selectedItem = null;
	    this.draggedItem = null;
	}

	/*
	studio.resourcesService.onSuccess = function(rootfolder) {
	    _this.resourcesFolder = new wm.FolderResourceItem({parent: _this.resourcesCanvas,
							       itemName: "resources",
							       saved: true,
							       width: "100%",
							       height: "100%",
							       isRoot: true});
	    _this.resourcesFolder.initFromJSON(rootfolder);
	    //_this.resourcePalette.setMoverRoot(_this.resourcesFolder);
	    _this.setMoverRoot(_this.resourcesFolder);
	    _this.resourcesFolder.setHeight("100%");
	    _this.resourcesFolder.setMarginLeft(0);
	    _this.reflow();
	};
*/

    },
    itemMouseDown: function(inSender,inEvent, inNode) {
      var dragItem = inNode.data;
      if (dragItem != null && dragItem.treeNode && !dragItem.isRoot()) {
	    dragItem.drag(inEvent);
	}
    },
    itemMouseUp: function(inSender,inEvent, inNode) {
      this.dragger.drag();
    },

    itemSelected: function() {
      this.selectedItem = this.tree.selected.data;
        var folder = (this.selectedItem instanceof wm.FolderResourceItem) ? this.selectedItem : this.tree.selected.parent.data;
            
      this.updateToolbar();
      this.showPropertiesPanel();
        this.addFileButton.input.setType("AnyData");
        this.addFileButton.input.setData({dataValue: {path: folder.getResourcelessFilePath()}});
    },

    setSelectedItem: function(item) {
      if (item == null) {
	this.clearSelectedItem();
	return;
      }
	item.selectSelf();
	this.selectedItem = item;
	this.updateToolbar();
	this.showPropertiesPanel();
    },

    clearSelectedItem: function() {
        this.selectedItem = null;
	this.updateToolbar();
	this.hidePropertiesPanel();
    },
    hidePropertiesPanel: function() {
	this.propertiesPanel.removeAllControls();
    },
    forceShowPropertiesPanel: function() {
	this.propertiesPanelItem = null;
	this.showPropertiesPanel();
    },
    showPropertiesPanel: function(forceRegen) {
      if (this.selectedItem == null) {
	this.setSelectedItem( this.resourcesFolder); // setSelectedItem calls showPropertiesPanel
	return;
      }
      /*
	if (this.propertiesPanelItem  && this.propertiesPanelItem != this.selectedItem) {
	    if (!confirm("You have any unsaved changes to this item; continue anyway?")) {
		return;
	    }
	}
      */
	if (this.propertiesPanelItem != this.selectedItem || forceRegen) {
	    this.propertiesPanel.removeAllControls();
	    this.resourcePropertiesHeaderIcon.setSource( this.selectedItem.iconSrc.replace("32","16"));
	    this.resourcePropertiesHeaderLabel.setCaption(this.selectedItem.type);

	    new wm.Label({parent: this.propertiesPanel,
			  caption: this.getDictionaryItem("CAPTION_RELATIVE_URL"),
			  width: "100%",
			  height: "24px"});
	    new wm.Label({parent: this.propertiesPanel,
			  //caption:  "resources/" + this.getFullFilePath(),
			  caption:   this.selectedItem.getItemPath(),
			  singleLine: false,
			  padding: "0,0,0,20",
			  width: "100%",
			  height: "48px"});
	    this.selectedItem.addCustomDataToPropertiesPanel(this.propertiesPanel);	    
	}
	this.propertiesPanel.reflow();
    },    
    updateToolbar: function() {
      if (this.selectedItem == null) {
	this.resourcesFileToolBar.hide();
	this.resourcesFolderToolBar.show();
	this.deleteFolderButton.setDisabled(true);
	this.renameFolderButton.setDisabled(true);
	this.downloadFolderButton.setDisabled(true);
	this.downloadFolderButton.setDisabled(true);
	this.addFileButton.setDisabled(true);
	this.addFolderButton.setDisabled(true);
      } else if (this.selectedItem instanceof wm.FolderResourceItem) {
	this.resourcesFileToolBar.hide();
	this.resourcesFolderToolBar.show();
	if (this.selectedItem == this.resourcesFolder) {
	  this.deleteFolderButton.setDisabled(true);
	  this.renameFolderButton.setDisabled(true);
	  this.downloadFolderButton.setDisabled(false);
	  this.downloadFolderButton.setDisabled(false);
	  this.addFileButton.setDisabled(false);
	  this.addFolderButton.setDisabled(false);
	} else {
	  this.deleteFolderButton.setDisabled(false);
	  this.renameFolderButton.setDisabled(false);
	  this.downloadFolderButton.setDisabled(false);
	  this.downloadFolderButton.setDisabled(false);
	  this.addFileButton.setDisabled(false);
	  this.addFolderButton.setDisabled(false);
	}
      } else {
	this.resourcesFileToolBar.show();
	this.resourcesFolderToolBar.hide();
      }
    },
  _end: 0
});

dojo.declare("wm.ResourceMover", wm.DragDropper, {
	constructor: function() {
		this.info = {};
		this.manager = studio.resourcesPage.getComponent("resourceManager");
		this.root = this.manager.tree;
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
	},
	drop: function(e) {
	  dojo.query(".dndHover").removeClass("dndHover");
	    this.inherited(arguments);
	},
	setTarget: function(inTarget){

		this.target = inTarget;
		if (this.target && this.target.data instanceof wm.FolderResourceItem) {
			this.setCursor("default");
			this.targetNode = this.target.domNode;
			dojo.query(".dndHover").removeClass("dndHover");		  
			dojo.addClass(this.target.domNode, "dndHover");		  
		} else {
			this.setCursor("no-drop");
			this.targetNode = null;
			dojo.query(".dndHover").removeClass("dndHover");		  
		}
		/*
		if (this.target && this.target.layout.renderEdges) {
			this.target.layout.renderEdges(this.target, this.info.control);
		}
		*/
		this.updateAvatar();
	},
	updateAvatar: function() {
	  this.showHideAvatar(Boolean(this.target));	  
	  if (this.target) {
	    var dn = this.target.data.getItemName();
	      this.setAvatarContent(studio.resourcesPage.page.getDictionaryItem("AVATAR_DROP", {caption: this.info.caption, target: dn}));
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
		}
	},
	_findTarget: function(inHit) {
	  var matches = dojo.query(".ResourceManager-mainPanel .wmtree-content").filter(function(element) {
	    var loc = dojo.coords(element);
	    loc.b = loc.t + loc.h;
	    loc.r = loc.l + loc.w;
	    return (loc.t < inHit.t && loc.b > inHit.t && loc.l < inHit.l && loc.r > inHit.l)
	  });
	  if (matches.length ==  0) return null;

	  // OK, the last match is the one deepest in the tree; so use it
	  var match = matches[matches.length-1];
	  return this.root.findDomNode(match);

	},

	targetInRoot: function(inHit) {
	  var h = inHit;
	  var b = dojo.coords(this.root.domNode);
	  var result = !(h.l < 0 || h.t < 0 || h.l > b.w || h.t > b.h);;
	  return result;
	}
});


wm.ResourceItem.extend({
    addCustomDataToPropertiesPanel: function(propertiesPanel) {},
/*
    finishFileUpload2: function(uploadedName, newName, isNewFile) {
	var _this = this;
	var manager = studio.resourcesPage.getComponent("resourceManager");
	studio.resourceManagerService.requestAsync("moveNewFile", [uploadedName, this.buildFilePath(newName), !isNewFile],
						   function(result) {
						     try {
						       _this.finishFileUploadOnSuccess(result,isNewFile); 
						       manager.updateModifiedDate();
						     } catch(e) {
						       console.error("Setup of new file Failed:" + e);
						       _this.loadResourcesData(true);
						     }
						   },
                                                   dojo.hitch(app, "toastWarning"));
	
    },
    // mostly this verifies the result of the upload rename op and
    // then shows properties.  
    finishFileUploadOnSuccess: function(result,isNewFile) {  
	if (!result) {
	    app.alert(bundleStudio.R_FailedToPlaceFile);
	    return;
	}
	this.setItemName(result,true);
	var manager = studio.resourcesPage.getComponent("resourceManager");

	// Force the properties panel to regenerate with any new data
	manager.forceShowPropertiesPanel();
	if (!isNewFile) {
	    app.alert(this.getItemName() + bundleStudio.R_HasBeenUpdated);
	}
    },
    */


    isDescendantOf: function(possibleParent) {
      var thisNode = this.treeNode;
      var root = thisNode.tree.root;
      if (!possibleParent || !possibleParent.treeNode) return false;
      if (possibleParent.treeNode == root) return true;

      var possibleParentNode = possibleParent.treeNode;      
      var parent = thisNode;
      while (parent.parent  && parent.parent != root  && parent != possibleParentNode)
	parent = parent.parent;
      //console.log(parent.name + " | " + possibleParent.name);
      return (parent == possibleParentNode);
    },
    removeSelf: function() {
      this.treeNode.tree.remove(this.treeNode);
    },
    isRoot: function() {
      return this.treeNode == this.treeNode.tree.root || this.treeNode == this.treeNode.tree.root.kids[0]; // a bit strange but the root node for the tree is NOT the resources folder... and to me, the resources folder IS the root.
    },

    drag: function(inEvent) {
	var manager = studio.resourcesPage.getComponent("resourceManager");
	manager.draggedItem = this.treeNode;
	manager.dragger.beginDrag(inEvent, {
	    caption: this.getItemName(),
	    type: this.type,
	    control: this.treeNode
	});
    },

    deleteItem: function() {
	var manager = studio.resourcesPage.getComponent("resourceManager");

	app.confirm(studio.resourcesPage.page.getDictionaryItem("CONFIRM_DELETE", {type: this instanceof wm.FolderResourceItem ? "folder" : "file",
							      name: this.getItemName()}), false,
                    dojo.hitch(this, function() {

	                studio.resourceManagerService.requestAsync("deleteFile", [ this.getFilePath()],
                             dojo.hitch(this, function(result) { 
		                 try {
		                     if (!result) {
			                 app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_DELETE_FAILED", {fileName: this.getItemName()}));
			                 return;
		                     }
		                     var parent = this.treeNode.parent;
		                     parent.remove(this.treeNode);
		                     manager.setSelectedItem(parent.data);
		                 } catch(e) {
		                     console.error("Delete Failed:" + e);
		                     this.loadResourcesData(true);
		                 }
		             }),
                                                                   dojo.hitch(app, "toastWarning"));
                    }));
    },

    setItemName: function(inName, nosave) {
	if (nosave) {
	    this.itemName = inName;
	    this.treeNode.setContent(inName);
	    return;
	}

	var newpath = this.getFilePath(inName);
	var _this = this;
	var manager = studio.resourcesPage.getComponent("resourceManager");
	studio.resourceManagerService.requestAsync("renameFile", [this.getFilePath(), newpath, false],
						   function(result) {
						     try {
						       if (!result) {
							   app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_RENAME_FAILED"));
							   return;
						       } else if (result != inName)
							   app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_RENAME_SUCCESS", {fileName: result}));
						       _this.setItemName(result,true);
						       manager.forceShowPropertiesPanel();
						       manager.updateModifiedDate();
						     } catch(e) {
						       console.error("Renmame Failed:" + e);
						       _this.loadResourcesData(true);
						     }						     
						   },
                                                   dojo.hitch(app, "toastWarning"));	
    },

    getItemName: function() {
	return this.itemName;
    },
    buildFilePath: function(name) {
      var result =  this.treeNode.parent.buildPathString(function() {
	return this.data.getItemName();
      }) + "/" + name;
      return result;
    },
    getFilePath: function(optName) {
      if (optName)
	return this.buildFilePath(optName);
      else
	return this.buildFilePath(this.getItemName());
    },

    getResourcelessFilePath: function() {
	var result =  this.getFilePath();
	result = result.replace(/^\/?resources\/?/, "");
	return result;
    },
    selectSelf: function() {
      this.treeNode.tree.select(this.treeNode);
    },
    unselectSelf: function() {
      if (this.treeNode.selected)
	this.treeNode.tree.deselect();
    },
    hasFileWithName: function(name) {
	return this.treeNode.findChild(function(node) {
	return node.content == name;
	});
    },
    getParent: function() {
      return this.treeNode.parent.data;
    },
    downloadItem: function() {
      studio.downloadInIFrame("services/resourceFileService.download?method=downloadFile&folder=" + ((this.isRoot()) ? "" : this.getParent().getResourcelessFilePath()) + "&filename=" + ((this.isRoot()) ? "" : this.getItemName()));
    }

});

wm.ImageResourceItem.extend({
    addCustomDataToPropertiesPanel: function(propertiesPanel) {
	    new wm.Picture({parent: propertiesPanel,
			  //caption:  "resources/" + this.getFullFilePath(),
			    source:   this.getItemPath(),
			  padding: "0,0,0,20",
			  width: "100%",
			  height: "100%"});      
    }
});

wm.ZipResourceItem.extend({
    finishFileUpload: function() {

	var manager = studio.resourcesPage.getComponent("resourceManager");
	var _this = this;
	studio.resourceManagerService.requestAsync("unzipAndMoveNewFile", [  this.getResourcelessFilePath()],
						   function(result) {
						     try {
						       if (!result) {
							   app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_UNZIP_FAILED"));
							   return;
						       }
						       manager.loadResourcesData(true);
						       manager.updateModifiedDate();
						     } catch(e) {
						       console.error("Unzip Failed:" + e);
						       _this.loadResourcesData(true);
						     }											     
						   },
                                                   dojo.hitch(app, "toastWarning"));	
    }
});


wm.JarResourceItem.extend({
    checkbox: null,
    addCustomDataToPropertiesPanel: function(propertiesPanel) {
	this.checkbox = new wm.Checkbox({caption: studio.resourcesPage.page.getDictionaryItem("CAPTION_CLASSPATH"),
					    name: "inClassPathCheckbox",
					    width: "120px",
					    captionSize: "100px",
					    height: "28px",			
					       startChecked: this.isInClassPath,
					       parent: propertiesPanel,
					       owner: studio.resourcesPage.page});

      var manager = studio.resourcesPage.getComponent("resourceManager");
      manager.connect(this.checkbox, "onchange", this, "changeIsClassPath");
    },
    changeIsClassPath: function(inDisplayValue, inDataValue) {
      var isChecked = this.checkbox.getChecked();
      var _this = this;
      studio.resourceManagerService.requestAsync("changeClassPath", [ this.getFilePath(), isChecked],	
						       function(result) {
							   if (!result) {
							     if (isChecked)
								 app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_ADDJAR_FAILED"));
							     else
								 app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_REMOVEJAR_FAILED"));
							   } else {
							     if (isChecked)
								 app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_ADDJAR_SUCCESS"));
							     else
								 app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_REMOVEJAR_SUCCESS"));
							   }
						       },
                                                 dojo.hitch(app, "toastWarning"));

    }
});
wm.FolderResourceItem.extend({
    addNewFolder: function(inName) {
      var manager = studio.resourcesPage.getComponent("resourceManager");
      if (this.hasFileWithName(inName)) {
	  app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_NAME_EXISTS"));
	return manager.addNewFolder();
      }

      var newFolder = new wm.FolderResourceItem({itemName: inName});
      newFolder.treeNode = new wm.ResourceTreeNode(this.treeNode, {file: {file: inName, files: [], type: "folder"},
							      content: inName,
							      closed: false,
							      image: this.iconSrc});
	newFolder.treeNode.data = newFolder;
      manager.setSelectedItem(newFolder);
      newFolder.mkdir();
      
    },
    mkdir: function() {
	var _this = this;
	var manager = studio.resourcesPage.getComponent("resourceManager");

	var newfolder = this;
	studio.resourceManagerService.requestAsync("createFolder", [ this.getFilePath()],
						       function(result) {
							 try {
							   if (!result) {
							       manager.selectedItem.treeNode.destroy();
							       delete manager.selectedItem.treeNode
							       manager.selectedItem = null;
							       app.alert(studio.resourcesPage.page.getDictionaryItem("ALERT_CREATE_FOLDER_FAILED"));
							       return;
							   }
							   manager.forceShowPropertiesPanel();
							   manager.updateModifiedDate();
						     } catch(e) {
						       console.error("New Folder Failed:" + e);
						       _this.loadResourcesData(true);
						     }
						       },
                                                   dojo.hitch(app, "toastWarning"));	

    },
    buildOpenFolderStateHash: function() {

	var result = {};
	var node = this.treeNode;
	node.forEachChild(function(childIn) {
	  var child = childIn.data;
	    if (child instanceof wm.FolderResourceItem) {
	      var tmpresult =  {children: (!child.treeNode.closed) ? child.buildOpenFolderStateHash() : {},
				name:     child.getItemName(),
				isOpen:   !child.treeNode.closed};
	      var _result = result;
	      _result[child.getItemName()] = tmpresult;
	    }
	});
	return result;
    },
    useOpenFolderStateHash: function(stateHash) {
	for (var childname in stateHash.children) {
	    var child = stateHash.children[childname];
	    if (child.isOpen) {
		var childNode = this.findChildByName(child.name);
		if (childNode) {
		    childNode.setOpen(true);
		    childNode.data.useOpenFolderStateHash(child);
		}
	    }
	}
    },
    findChildByName: function(inName) {
      return this.treeNode.findChild(function(node) {
	var result =  node.data.getItemName() == inName;
	return result;
      });
    }
});

