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
 
dojo.provide("wm.studio.pages.Services.Services");

dojo.declare("Services", wm.Page, {
        i18n: true,
	start: function() {
		this.tree.initNodeChildren = dojo.hitch(this.tree, "treeInitNodeChildren");
	        /* WM-2518: now that each web service gets its own editor, no longer monitor for changes to what the user has selected or to definitions for any types */
		//this.subscribe("wmservices-changed", this, "servicesChanged");
		this.subscribe("wm-project-changed", this, "update");
		this.update();
	    this._cachedData = this.getCachedData();

	    if (dojo.isIE <= 8) {
		wm.onidle(this, function() {
		    this.webServiceSaveBtn.setBorder("1");
		    this.webServiceSaveBtn.setBorder("0");
		    this.importWebServiceBtn.setBorder("1");
		    this.importWebServiceBtn.setBorder("0");
		    this.delWebServiceBtn.setBorder("1");
		    this.delWebServiceBtn.setBorder("0");
		});
	    }

	},
	update: function() {
		studio.updateServices();
		studio.refreshServiceTree();
	},
	setDirty: function() {
	    wm.job(this.getRuntimeId() + "_hasChanged", 500, dojo.hitch(this, function() {
		if (this.isDestroyed) return;
		var changed = this._cachedData != this.getCachedData();
		this.dirty = changed;
		var caption = (!changed ? "" : "<img class='StudioDirtyIcon'  src='images/blank.gif' /> ") +
		    this.serviceNameInput.getDataValue();
		if (caption != this.owner.parent.caption) {
		    this.owner.parent.setCaption(caption);
		    studio.updateServicesDirtyTabIndicators();
		}
		this.webServiceSaveBtn.setDisabled(!this.dirty);
	    }));

	},

    /* getDirty, save, saveComplete are all common methods all services should provide so that studio can 
     * interact with them
     */
    dirty: false,
    getDirty: function() {
	return this.dirty;
    },
    save: function() {
		if (this.tree.serviceId) {
			var ct = this.wsConnectionTimeoutInput.getValue("dataValue");
			if (ct == null || ct.length == 0) {
				ct = 0;
			}
			var rt = this.wsRequestTimeoutInput.getValue("dataValue");
			if (rt == null || rt.length == 0) {
				rt = 0;
			}
			studio.webService.requestAsync("setBindingProperties",
				[this.tree.serviceId, {
					httpBasicAuthUsername: this.authUsernameInput.getValue("dataValue"),
					httpBasicAuthPassword: this.authPasswordInput.getValue("dataValue"),
					connectionTimeout: ct,
					requestTimeout: rt}
				],
				dojo.hitch(this, "setBindingPropertiesCallback"), dojo.hitch(this, "setBindingPropertiesErrorCallback"));
		}
    },
    saveComplete: function() {
    },
    getProgressIncrement: function(runtime) {
	return 10;
    },

	editorChange: function() {
		this.setDirty();
	},
	updateSelect: function(inSelect, inData) {
		var s = inSelect, o;
		if (inData == null) {
			o = null;
		} else {
			o = inData.join(",");
		}
		s.displayValue = "";
		s.editor.setOptions(o);
	},
/* WM-2518: now that each web service gets its own editor, no longer monitor for changes to what the user has selected or to definitions for any types * /
	servicesChanged: function() {
		this.clearAll();
		this.tree.deselect();
		var names = [];
		wm.services.forEach(function(s) {
			if (s.type == "WebService")
				names.push(s.name);
		});
		this.tree.setTreeData(names);
		if (!this.tree.serviceId) {
			this.tree.selectFirstService();
			this.serviceSelected();
		}
	},

	treeSelect: function(inSender, inNode) {
		var n = inNode;
		while (n instanceof wm.TreeNode && n.isService != true) {
			n = n.parent;
		}
		if (n.isService) {
			if (this.tree.serviceId != n.name) {
				this.tree.serviceId = n.name;
				this.serviceSelected();
			}
		}
	},
	*/
	selectService: function(inWebService) {
		this.webService = inWebService;
		this.tree.serviceId = inWebService.serviceId;
		this.serviceSelected();
	},
	serviceSelected: function() {
		if (!this.tree.serviceId) {
			return;
		}
		this.serviceNameInput.setValue("dataValue", this.tree.serviceId);
		var isFeedSrv = this.tree.serviceId == "FeedService";
		this.webServiceSaveBtn.setDisabled(!isFeedSrv);
		this.serviceNameInput.setShowing(true);
		this.authUsernameInput.setShowing(!isFeedSrv);
		this.authPasswordInput.setShowing(!isFeedSrv);
		this.wsConnectionTimeoutInput.setShowing(!isFeedSrv);
		this.wsRequestTimeoutInput.setShowing(!isFeedSrv);
		this.wsdlSpacing.setShowing(!isFeedSrv);
		this.feedDescInput.setShowing(isFeedSrv);
		this.setDirty();
		if (!isFeedSrv) {
			studio.webService.requestAsync("getBindingProperties", [this.tree.serviceId],
				dojo.hitch(this, "getBindingPropertiesCallback"));
			studio.webService.requestAsync("getWSDL", [this.tree.serviceId],
				dojo.hitch(this, "getWSDLCallback"));
		}
	},
	getBindingPropertiesCallback: function(inData) {
		if (inData) {
			this.authUsernameInput.beginEditUpdate();
		        this.authUsernameInput.setValue("dataValue", inData.httpBasicAuthUsername);
			this.authUsernameInput.endEditUpdate();
			this.authPasswordInput.beginEditUpdate();
			this.authPasswordInput.setValue("dataValue", inData.httpBasicAuthPassword);
			this.authPasswordInput.endEditUpdate();
			var ct = inData.connectionTimeout;
			if (ct == 0) {
				ct = null;
			}
			var rt = inData.requestTimeout;
			if (rt == 0) {
				rt = null;
			}
			this.wsConnectionTimeoutInput.beginEditUpdate();
			this.wsConnectionTimeoutInput.setValue("dataValue", ct);
			this.wsConnectionTimeoutInput.endEditUpdate();
			this.wsRequestTimeoutInput.beginEditUpdate();
			this.wsRequestTimeoutInput.setValue("dataValue", rt);
			this.wsRequestTimeoutInput.endEditUpdate();
		    this._cachedData = this.getCachedData();
		}
	},
    getCachedData: function() {
	return this.serviceNameInput.getDataValue() + "|" + this.authUsernameInput.getDataValue() + "|" + this.authPasswordInput.getDataValue() + "|" + this.wsConnectionTimeoutInput.getDataValue() + "|" + this.wsRequestTimeoutInput.getDataValue();
    },
	getWSDLCallback: function(inData) {
		if (inData.indexOf("services") == 0) {
			this.wsdlCodeEditor.setShowing(false);
			this.wsdlLink.setShowing(true);
			this.wsdlLink.setLink(inData);
		} else {
			this.wsdlCodeEditor.setShowing(true);
			this.wsdlLink.setShowing(false);
			this.wsdlCodeEditor.setInputValue(inData);
		}
	},
	webServiceSaveBtnClick: function(inSender) {
	    studio.saveAll(this);
	},
	setBindingPropertiesCallback: function(inData) {
	    this._cachedData = this.getCachedData();
	    this.setDirty();	    
	    this.saveComplete();
	},
	setBindingPropertiesErrorCallback: function(inError) {
	},
	clearAll: function() {
		this.tree.serviceId = null;
		this.wsdlCodeEditor.setInputValue(null);
		this.serviceNameInput.clear();
		this.serviceNameInput.setShowing(false);
		this.feedDescInput.setShowing(false);
		this.authUsernameInput.clear();
		this.authPasswordInput.clear();
		this.wsConnectionTimeoutInput.clear();
		this.wsRequestTimeoutInput.clear();
		this.wsdlCodeEditor.setShowing(true);
		this.wsdlLink.setShowing(false);
	},
	importWebServiceBtnClick: function(inSender) {
		var d = this.importWebServiceDialog;
		if (d) {
			d.page.reset();
		} else {
			this.importWebServiceDialog = d = new wm.PageDialog({
				pageName: "ImportWebService",
				owner: studio,
				hideControls: true,
			    //height: "612px",
			    height: "597px",
			    width: "800px",
			    title: studio.getDictionaryItem("wm.WebService.IMPORT_TITLE")
			});
			d.onClose = dojo.hitch(this, function(inWhy) {
				if (inWhy == "Import")
					this.serivceImported();
			});
		}
		d.show();
	},
	delWebServiceBtnClick: function(inSender) {
	    if (this.tree.serviceId) {
                app.confirm(this.getDictionaryItem("CONFIRM_DELETE", {serviceId: this.tree.serviceId}), false,
                            dojo.hitch(this, function() {
			        studio.servicesService.requestAsync("deleteService", [this.tree.serviceId], dojo.hitch(this, "deleteServiceCallback"));
                            }));
		}
	},
	deleteServiceCallback: function(inData) {
		this.tree.serviceId = null;
		studio.application.removeServerComponent(this.webService);
	        studio.refreshServiceTree("");


	    var pageContainer = this.owner;
	    var subtablayer = pageContainer.parent;
	    var subtablayers = subtablayer.parent;
	    var serviceslayer = subtablayers.parent;
	    if (subtablayers.layers.length == 1)
		serviceslayer.hide();
	    subtablayer.destroy();


		//this.update();
	},
	serivceImported: function() {
		var id = this.importWebServiceDialog.page.serviceId;
		this.webService = new wm.WebService({name: id, serviceId: id});
		studio.application.addServerComponent(this.webService);
		this.update();
		this.tree.serviceId = id;
		this.serviceSelected();
		studio.select(this.webService);
	},
	_end: 0
});
