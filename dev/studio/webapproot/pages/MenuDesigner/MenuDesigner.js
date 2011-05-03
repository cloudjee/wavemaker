/*
 * Copyright (C) 2011 WaveMaker Software, Inc.
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

dojo.declare("MenuDesigner", wm.Page, {
    i18n: true,
    //defaultItem: null,
    //defaultItemEnabled: false,
    start: function() {
    
    },
    setMenu: function(inMenu/*, inDefaultItem, inDefaultItemEnabled*/) {
	this.editMenu = inMenu;
/*
	this.defaultItemEnabled = inDefaultItemEnabled;
	this.DefaultItemButton.setShowing(inDefaultItemEnabled);
	if (inDefaultItem) {
	    this._defaultLabel = inDefaultItem.content;
	    this._defaultClass = inDefaultItem.iconClass;
	}
	*/
	var s = inMenu.fullStructure;
	if (!s && inMenu.fullStructureStr)
	    s = dojo.fromJson(inMenu.fullStructureStr);
	this.tree.clear();
	if (s)
	    this.setMenuBuildTree(s, this.tree.root);
	this.updateMenu();

	this.menuItemImageList.setOptions(studio.getImageLists().join(","));
	delete this._defaultLabel;
	delete this._defaultClass;
    },
    setMenuBuildTree: function(structure, parentNode) {
	for (var i = 0; i < structure.length; i++) {
	    var content = structure[i].label;
	    if (structure[i].iconClass)
		content = '<img src="lib/dojo/dojo/resources/blank.gif" alt="" class="dijitIcon dijitMenuItemIcon ' + structure[i].iconClass + '" dojoattachpoint="iconNode">&nbsp;' + content;

	    var n = new wm.TreeNode(parentNode, {closed: false, content: content, data: {content: structure[i].label,
											 iconClass: structure[i].iconClass,
											 imageList: structure[i].imageList}});
	    if (this._defaultLabel == structure[i].label && this._defaultClass == structure[i].iconClass)
		n.domNode.style.fontWeight = "bold";
	    if (structure[i].children) // test for children needed on upgraded projects
		this.setMenuBuildTree(structure[i].children, n);
	}
    },
  AddButtonClick: function(inSender, inEvent, inTarget) {
      try {
          var parent = this.tree.selected || this.tree.root;
	  var childCount = parent.kids.length;
	  var content = this.getDictionaryItem("DEFAULT_ITEM_NAME", {index: childCount});
          new wm.TreeNode(parent, {closed: false, content: content, data: {content: content}});
          this.updateMenu();
          
      } catch(e) {
          console.error('ERROR IN AddButtonClick: ' + e); 
      } 
  },
  DeleteButtonClick: function(inSender, inEvent, inTarget) {
      try {
          var node = this.tree.selected;
          if (!node || node == this.tree.root) return;
          node.destroy();
          this.updateMenu();          
	  this.tree.selected = null;
      } catch(e) {
          console.error('ERROR IN DeleteButtonClick: ' + e); 
      } 
  },
  EditButtonClick: function(inSender, inEvent, inTarget) {
      try {
          var node = this.tree.selected;
          if (!node || node == this.tree.root) return;
          var data = node.data;
          this.menuItemName.setDataValue(data.content);
          this.menuItemImageList.setDataValue(data ? data.imageList : null);
          this.menuItemIconClass.setDataValue(data ? data.iconClass : null);
	  this.menuItemImageListBtn.setIconUrl("images/blank.gif");
	  dojo.query("img", this.menuItemImageListBtn.domNode)[0].className = data.iconClass;

          this.editMenuItemDialog.show();
          this.menuItemName.focus();
      } catch(e) {
          console.error('ERROR IN EditButtonClick: ' + e); 
      } 
  },
/*
    DefaultButtonClick: function(inSender) {
        var node = this.tree.selected;
	if (!node) return;
	if (this.defaultItem) {
	    this.defaultItem.domNode.style.fontWeight = "";
	}
	this.defaultItem = node;
	this.defaultItem.domNode.style.fontWeight = "bold";
    },
    */
  menuItemCancelButtonClick: function(inSender, inEvent, inTarget) {
          this.editMenuItemDialog.hide();
      this.disconnectImageListPopup();
  },
  menuItemOKButtonClick: function(inSender, inEvent, inTarget) {
      try {
          this.tree.selected.data = {content: this.menuItemName.getDataValue(),
                                     imageList: this.menuItemImageList.getDataValue(),
                                     iconClass: this.menuItemIconClass.getDataValue()};
	  var content = this.tree.selected.data.content;
	  if (this.tree.selected.data.iconClass)
              content = '<img src="lib/dojo/dojo/resources/blank.gif" alt="" class="dijitIcon dijitMenuItemIcon ' + this.tree.selected.data.iconClass + '" dojoattachpoint="iconNode">&nbsp;' + content;
	  this.tree.selected.setContent(content);
          this.editMenuItemDialog.hide();
          this.updateMenu();

	  // Usually the next act is to create a new menu item; should be a sibling of not a child of the item just created (most times)
	  this.tree.select(this.tree.selected.parent); 
      } catch(e) {
          console.error('ERROR IN menuItemOKButtonClick: ' + e); 
      } 
      this.disconnectImageListPopup();
  },
  onTextEnterKeyPress: function(inSender) {
      try {
          this.menuItemOKButtonClick();
          
      } catch(e) {
          console.error('ERROR IN onTextEnterKeyPress: ' + e); 
      } 
  },
  treeDblclick: function(inSender, inNode) {
      try {
          this.EditButtonClick();
          
      } catch(e) {
          console.error('ERROR IN treeDblclick: ' + e); 
      } 
  },
    mainOKClick: function() {
	this.editMenu.setFullStructureStr(dojo.toJson(this.write()), true);
/*
	if (this.defaultItemEnabled && this.defaultItem && this.defaultItem.data) 
	    this.editMenu.setDefaultItem(this.defaultItem.data);
	    */
	this.owner.owner.dismiss();
    },
    mainCancelClick: function() {
	this.owner.owner.dismiss();
    },

    popupImageSelector: function() {
	var imageList = this.menuItemImageList.getDataValue();
	if (!imageList) {
	    imageList = studio.getImageLists()[0];
            this.menuItemImageList.setDataValue(imageList);
	}
	if (imageList)
	    imageList = studio.page.getValueById(imageList);
	if (imageList) {
	    var popupDialog = imageList.getPopupDialog();
	    this._iconlistDialog = popupDialog;
	    popupDialog.fixPositionNode = this.menuItemImageListBtn.domNode;
	    
	    this._designImageListSelectCon = dojo.connect(imageList._designList, "onselect", this, function() {		    
		var cssClass = imageList.getImageClass(imageList._designList.getSelectedIndex());
		this.menuItemIconClass.setDataValue(cssClass);
		dojo.query("img", this.menuItemImageListBtn.domNode)[0].className = cssClass;
	    });

	    popupDialog.show();
	}
	},
	disconnectImageListPopup: function() {

	    if (this._designImageListSelectCon) {
		dojo.disconnect(this._designImageListSelectCon);
		delete this._designImageListSelectCon;
	    }

	    this._iconlistDialog.hide();
	    delete this._iconlistDialog;
    },

  updateMenu: function() {
/*
      this.sample.setFullStructure(this.write());
      this.sample.renderDojoObj();
      */
  },
  write: function() {
    var result = [];
      for (var i =0; i < this.tree.root.kids.length; i++) {
        result.push(this.writeNode(this.tree.root.kids[i]));
   }

    return result;
  },
  writeNode: function(inNode) {
   
      var obj = {label: inNode.data.content,
	       iconClass: inNode.data.iconClass,
	       imageList: inNode.data.imageList,
               children: []};
   for (var i =0; i < inNode.kids.length; i++) {
      obj.children.push(this.writeNode(inNode.kids[i]));
   }
    return obj;
  },

  _end: 0
});