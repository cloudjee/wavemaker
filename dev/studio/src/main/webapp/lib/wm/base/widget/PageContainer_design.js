/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.PageContainer_design");
dojo.require("wm.base.widget.PageContainer");

// design only
wm.PageContainer.extend({
        themeable: false,
	scrim: true,
	_isBindSource: true,
    createOpenPageButton: function() {
        if (this.openPageButton) {
            dojo.destroy(this.openPageButton);
            dojo.disconnect(this.openPageButtonConnect);
        }
	var openPageButton = this.openPageButton = document.createElement("div");
                
	openPageButton.className = "openPageContainerDesignWrapperButton" + ((this.pageName) ? " hasPageName" : ""); 
	openPageButton.innerHTML = (this.pageName) ? studio.getDictionaryItem("wm.PageContainer.OPEN_PAGE") : studio.getDictionaryItem("wm.PageContainer.NEW_PAGE");
	this.designWrapper.domNode.appendChild(openPageButton);	
	this._designerOpenPageButton = openPageButton;
	this.openPageButtonConnect = dojo.connect(openPageButton, "onclick", this, function() {
            if (this.pageName) {
		    var warnPage = studio.getDictionaryItem("CONFIRM_OPEN_PAGE", {newPage: this.pageName, oldPage: studio.project.pageName});
		    studio.confirmPageChange(warnPage, this.pageName, 
					     /* onSave */
					     dojo.hitch(this, function(noChanges) {
						 studio.project.saveProject(false, dojo.hitch(this, function() {
						     studio.project.openPage(this.pageName);
						 }));
					     }),
					     /* onDontSave */
					     dojo.hitch(this, function() {
						     studio.project.openPage(this.pageName);
					     }),
					     null, /* onCance */
					     !studio.isPageDirty() /* skip save */
					     );

/*

		    app.confirm(studio.getDictionaryItem("wm.PageContainer.CONFIRM_SAVE_CHANGES"), false,
				dojo.hitch(this,function() {
				    this.connect(studio, "saveProjectComplete", this, function() {				
					studio.project.openPage(this.pageName);
				    });
				    studio.saveAll(studio.project);
				}),
				dojo.hitch(this, function() {
					studio.project.openPage(this.pageName);
				}));
				*/
            } else {
                this.createNewPage();
            }
	});

    },

    createNewPage: function() {
	var pages = studio.project.getPageList();
	var l = {};
	dojo.forEach(pages, function(p) {
	    l[p] = true;
	});
        studio.promptForName("page", wm.findUniqueName("Page", [l]), pages,
                             dojo.hitch(this, function(n) {
				 n = wm.capitalize(n);
				 if (this.owner instanceof wm.PageDialog)
				     this.owner.pageName = n;
				 else
				     this.pageName = n;

				 studio.confirmSaveDialog.page.setup(
				     studio.getDictionaryItem("CONFIRM_OPEN_PAGE", {oldPage: studio.project.pageName, newPage: this.pageName}),
				     /* onSave */
				     dojo.hitch(this, function() {
					 studio.project.saveProject(false, dojo.hitch(this, function() {
					     studio.project.newPage(n);
					 }));
				     }),
				     /* onDontSave */
				     dojo.hitch(this, function() {
					 studio.project.newPage(n);
				     }),
				     null, /* onCancel */
				     !studio.isPageDirty()); /* skip save */
			     }));
    },
	designCreate: function() {
		this.inherited(arguments);
		if (this.designWrapper)
			dojo.addClass(this.designWrapper.domNode, "wmchrome-wrapper");
	},
	writeChildren: function() {
		return [];
	},
	// write only binding.
	writeComponents: function(inIndent) {
		var
			s = [];
			c = this.components.binding.write(inIndent);
		if (c) 
			s.push(c);
		return s;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "pageName":
		    return new wm.propEdit.PagesSelect({component: this, name: inName, value: inValue, newPage: true});
		}
		return this.inherited(arguments);
	},
	afterPaletteDrop: function() {
		// change default so deferLoad is false
		// this.inherited(arguments);
		this.deferLoad = true;
	},
    createDesignContextMenu: function(menuObj) {
	var pagelist = wm.getPageList(this.currentPageOK);
	if (pagelist.length) {
	    var data = {label: "Set PageName",
			iconClass: "Studio_silkIconImageList_30",
			children: []};

	    for (var i = 0; i < pagelist.length; i++) {
		data.children.push(this.addPageToContextMenu(pagelist[i]));
	    }
	    var submenu = menuObj.addAdvancedMenuChildren(menuObj.dojoObj, data);
	}
    },
    addPageToContextMenu: function(pagename) {
	return 	{label:   pagename,
		 onClick: dojo.hitch(this, function() {
		     this.setPageName(pagename);
		 })
		};
    }
})

wm.Object.extendSchema(wm.PageContainer, {
	pageLoadedDeferred: {ignore: 1},
        pageName: {group: "common", bindable: 1, type: "string", order: 50, pageProperty: "page"},
	deferLoad: {group: "common", order: 100},
	loadParentFirst: {group: "common", order: 101},
	box: {ignore: 1},
	disabled: {ignore: 1},
	page: {ignore: 1},
    pageProperties: {ignore: 1, writeonly: 1},
    setPageName: {group: "method"},
    forceReloadPage: {group: "method"}
});
