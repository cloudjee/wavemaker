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
dojo.provide("wm.studio.pages.JavaEditor.JavaEditor");

dojo.declare("JavaEditor", wm.Page, {
	start: function() {
            /*
            if (dojo.isFF > 4 || dojo.isWebKit || dojo.isIE >= 9)
                this.javaCodeEditor.setSyntax("java");
            else 
                this.javaCodeEditor.setSyntax("");
                */
		this.tree.initNodeChildren = dojo.hitch(this.tree, "treeInitNodeChildren");
		this.update();
		this.subscribe("wmtypes-changed", dojo.hitch(this, "typesChangedCall"));
	},

    setDirty: function() {
		wm.job(this.getRuntimeId() + "_keydown", 500, dojo.hitch(this, function() {
		    if (this.isDestroyed) return;
		    this.dirty = this.javaCodeEditor.getText() != this._cachedData;
		    var caption =  (this.dirty ? "<img class='StudioDirtyIcon'  src='images/blank.gif' /> " : "") + this.tree.serviceId;
		    if (caption != this.owner.parent.caption) {
			this.owner.parent.setCaption(caption);
			studio.updateServicesDirtyTabIndicators();
		    }
		}));
    },

    /* getDirty, save, saveComplete are all common methods all services should provide so that studio can 
     * interact with them
     */
    dirty: false,
    getDirty: function() {return this.dirty;},

    /* Called when saving is done regardless of success/failure */
    saveComplete: function() {
    },
    onSaveSuccess: function() {
	studio.project.setMetaDataFlag("service_invalid_" + this.javaService.getRuntimeId(), false);

	dojo.removeClass(this.javaService._studioTreeNode.domNode, "Error");
	this._cachedData = this.javaCodeEditor.getText();
	this.setDirty();
	this.saveComplete();
    },
    onSaveError: function() {
	studio.project.setMetaDataFlag("service_invalid_" + this.javaService.getRuntimeId(), true);

	dojo.addClass(this.javaService._studioTreeNode.domNode, "Error");
	this.saveComplete();
    },
    getProgressIncrement: function() {
	return 20; // saving java services is very slow...  1 tick is very fast; this is 20 times slower than that
    },

	update: function() {
		studio.updateServices();
		this.servicesChanged();
		this.typesChangedCall();
		studio.refreshWidgetsTree();
	},
	servicesChanged: function() {
		var names = [];
		wm.services.forEach(function(s) {
			if (s.type == "JavaService" && (s.name != "securityService"|| s.name != "securityServiceJOSSO"))
				names.push(s.name);
		});
		this.tree.setTreeData(names);
	},
	treeSelect: function(inSender, inNode) {
		var n = inNode;
		while (n instanceof wm.TreeNode && n.isService != true) {
			n = n.parent;
		}
		if (n.isService) {
			var id = this.tree.serviceId;
			if (id != n.name) {
				this.tree.serviceId = id = n.name;
				studio.javaService.requestAsync("openClass", [id],
					dojo.hitch(this, "openJavaClassCallback"), dojo.hitch(this, "openJavaClassErrorCallback"));
			}
		}
	},
	selectService: function(inJavaService) {
		this.javaService = inJavaService;
		this.tree.serviceId = this.javaService.serviceId;
		studio.javaService.requestAsync("openClass", [this.javaService.serviceId],
					dojo.hitch(this, "openJavaClassCallback"), dojo.hitch(this, "openJavaClassErrorCallback"));
	},
	openJavaClassCallback: function(inData) {
		// FIXME: without clearing the text here, the EditArea doesn't display properly
		this.javaCodeEditor.setText("");
		this.javaCodeEditor.setText(inData || "");
	        this._cachedData = inData || "";
	        this.dirty = false;
		var matches = inData.match(/^\s*package\s+(\S*)\s*;/);
	        this.packageName = (matches) ? matches[1] : "";
		var matches2 = inData.match(/\s*public\s+class\s+(\S+)/);
		this.className = matches2[1];
	    this.logViewer.page.setLogFile((this.packageName ? this.packageName + "." : "") + this.className + ".log");
	},
	openJavaClassErrorCallback: function(inError) {
		this.layers.setLayer("defaultServiceLayer");
	},
	typesChangedCall: function(inData) {
		studio.servicesService.requestAsync("listTypesTree", null, 
				dojo.hitch(this, "typesChangedCallback"));
	},
	typesChangedCallback: function(inData) {
		this.typeTree.renderData(inData.dataObjectsTree);
	},
	newJavaBtnClick: function(inSender) {
		var d = this.newJavaServiceDialog;
		if (d) {
			d.page.clearAll();
		} else {
			this.newJavaServiceDialog = d = new wm.PageDialog({
				pageName: "NewJavaService",
				owner: studio,
				hideControls: true,
				height: 180,
			        width: 400,
			    title: this.getDictionaryItem("TITLE_NEW_SERVICE")
			});
			d.onClose = dojo.hitch(this, function(inWhy) {
				if (inWhy == "OK")
					this.newJavaServiceCallback();
			});
		}
		d.show();
	},
	newJavaServiceCallback: function(inData) {
		if (this.newJavaServiceDialog && this.newJavaServiceDialog.page.newServiceId) {
			this.tree.serviceId = this.newJavaServiceDialog.page.newServiceId;
			this.javaCodeEditor.getText(this.newJavaServiceDialog.page.newJavaCode || "");
		}
		this.javaService = new wm.JavaService({name: this.tree.serviceId, serviceId: this.tree.serviceId});
		studio.application.addServerComponent(this.javaService);
		this.update();
		studio.select(this.javaService);
	},
	delJavaBtnClick: function(inSender) {
	    if (this.tree.serviceId)
                app.confirm(this.getDictionaryItem("CONFIRM_DELETE", {serviceName: this.tree.serviceId}), false,
                            dojo.hitch(this, function() {
			        studio.servicesService.requestAsync("deleteService", [this.tree.serviceId], dojo.hitch(this, "deleteServiceCallback"));
                            }));
	},
	deleteServiceCallback: function(inData) {
	    studio.application.removeServerComponent(this.javaService);	    
	    studio.refreshServiceTree("");
	    var pageContainer = this.owner;
	    var subtablayer = pageContainer.parent;
	    var subtablayers = subtablayer.parent;
	    var javalayer = subtablayers.parent;
	    if (subtablayers.layers.length == 1)
		javalayer.hide();
	    subtablayer.destroy();
	    
/*
		this.tree.serviceId = null;
		this.javaCodeEditor.setText("");
	        if (this.javaService._editTab)
		    this.javaService._editTab.destroy();
		studio.application.removeServerComponent(this.javaService);
		this.update();
		*/
	},
	openCmpOutBtnClick: function(inSender) {
	    this.javaCodeSplitter.setShowing(true);
            this.logTabs.setShowing(true);
	},
	closeCmpOutBtnClick: function(inSender) {
	    this.javaCodeSplitter.setShowing(false);
            this.logTabs.setShowing(false);
	},
	javaServiceRefreshButtonClick: function(inSender) {
		if (this.tree.serviceId) {
		    app.confirm(this.getDictionaryItem("CONFIRM_RELOAD"), false,
                                dojo.hitch(this, function() {
				    studio.beginWait(this.getDictionaryItem("WAIT_RELOAD"));
				studio.javaService.requestAsync("openClass", [this.tree.serviceId],
					                        dojo.hitch(this, "refreshButtonCallback"),
				                                dojo.hitch(this, "saveJavaServiceErrorCallback"));
			        }));
		}
	},
	refreshButtonCallback: function(inData) {
		this.openJavaClassCallback(inData);
            wm.onidle(this, function() {
		studio.javaService.requestAsync("saveClass",
			[this.tree.serviceId, this.javaCodeEditor.getText()],
			dojo.hitch(this, "saveJavaServiceCallback"),
			dojo.hitch(this, "saveJavaServiceErrorCallback"));
            });
	},
	javaServiceSaveButtonClick: function(inSender) {
		if (this.tree.serviceId) {
		    //studio.beginWait("Saving Java service...");
		    studio.saveAll(this);
		}
	},

        save: function() {
	    studio.javaService.requestAsync("saveClass",
					    [this.tree.serviceId, this.javaCodeEditor.getText()],
					    dojo.hitch(this, "saveJavaServiceCallback"),
					    dojo.hitch(this, "saveJavaServiceErrorCallback"));
	},
	saveJavaServiceCallback: function(inData) {
	    this.owner.parent.setCaption(this.tree.serviceId);
	    //studio.endWait();
		if (inData.buildSucceeded) {
			this.update();
                    //app.toastSuccess("Compiled Successfully!");
		} else {
		    studio._saveErrors.push({owner: this,
					     message: this.getDictionaryItem("WARNING_COMPILE_FAILED")});
		}
	    var m;
	    if (inData.buildSucceeded) {
		m = this.getDictionaryItem("COMPILE_LOG_SUCCESS", 
					   {time: dojo.date.locale.format(new Date(), {selector: "time",
										       formatLength: "medium"})});
	    } else {
		m = this.getDictionaryItem("COMPILE_LOG_FAILED",
					   {time: dojo.date.locale.format(new Date(), {selector: "time",
										       formatLength: "medium"})});
	    }
	    m += "\n\n";

	        this.javaCompilerOutputEditor.setInputValue(m + inData.compileOutput.substring(inData.compileOutput.indexOf("compile:") + 9));
		this.logViewer.page.clearLog();
		this.updateJavaLogs();
		this.openCmpOutBtnClick();
		if (inData.buildSucceeded) {
	            this.onSaveSuccess();
	            this._cachedData = this.javaCodeEditor.getText();
	            this.dirty = false;
		} else {
		    this.onSaveError();
		}
	},
	changeLogTab: function() {
	    // TODO: Only call this if the server logs tab is selected
	    this.updateJavaLogs();
	},
	updateJavaLogs: function() {
	    this.logViewer.page.updateLog();
	},
	saveJavaServiceErrorCallback: function(inError) {
	        //studio.endWait();
	    studio._saveErrors.push({owner: this,
				     message: this.getDictionaryItem("WARNING_SAVE_FAILED", {error: inError.message})});
	    this.onSaveError();
	},
    showEditorHelp: function() {
	this.javaCodeEditor.showHelp();
    },
    toggleWrapClick: function() {
	this._editAreaWrapping = (this._editAreaWrapping == undefined) ? false : !this._editAreaWrapping;
	this.javaCodeEditor.setWordWrap(this._editAreaWrapping);
    },
    findClick: function() {
	this.javaCodeEditor.showSearch();
    },
    formatClick: function() {
	try {
	    wm.conditionalRequire("lib.github.beautify", true);
	} catch(e){}
	var start = editAreaLoader.getSelectionRange(this.javaCodeEditor.area.textarea.id).start;
	this.javaCodeEditor.setText(js_beautify(this.javaCodeEditor.getText()));
	this.javaCodeEditor.setSelectionRange(start, start);
    },
    onCtrlKey: function(inSender, letter) {
	switch(letter.toLowerCase()) {
	case "s":
	    return this.javaServiceSaveButtonClick();
	case "i":
	    return this.formatClick();
	case "o":
	    return this.toggleWrapClick();
	case "l":
	    return this.javaCodeEditor.promptGotoLine();
	}



    },
	_end: 0
});
