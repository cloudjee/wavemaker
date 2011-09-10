/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.FeedList");
dojo.require("wm.base.widget.List");
dojo.require("wm.base.components.ServiceVariable");

dojo.declare("wm.FeedList", wm.List, {
	url: "",
	dataFields: "title",
	title: "",
	expand: false,
	headerVisible: true,
	showLink: true,
	selectedLink: "",
	totalItems: "",
	onselect: null,
	ondeselect: null,
        classNames: 'wmfeedlist',
	init: function() {
		this.inherited(arguments);
	},
    postInit: function() {
	this.inherited(arguments);
	this._createGetFeedServiceVariable();
	if (!this.isDesignLoaded()) {
	    this.getFeed();
	}

    },
	prepare: function() {
		this.inherited(arguments);
		if (this.isDesignLoaded() && !wm.services.byName["FeedService"]) {
		    if (studio.isJarMissing("wsdl4j.jar")) {
			wm.WebService.prototype.showJarDialog();

			/* If we just created the component rather than loaded it from an existing page, destroy it until the environment is setup */
			if (!studio.project.loadingPage) {
			    this.destroy();
			    throw "Missing jar file";
			    return;
			}
		    } else {
			studio.webService.requestAsync("registerFeedService", null, 
						       dojo.hitch(this, "registerFeedServiceSuccess"));
		    }
		}
	},
	createListNode: function() {
		this.listNode = document.createElement('div');
		this.listNode.flex = 1;
		dojo.addClass(this.listNode, "wmfeedlist-list");
	},
	createHeaderNode: function() {
		this.headerNode = document.createElement('div');
		dojo.addClass(this.headerNode, "wmfeedlist-header");
	},
	getHeaderContent: function() {
		return '<div>' + this.title + '</div>';
	},
	updateHeaderWidth: function() {
		if (this.headerNode.firstChild) {
			dojo.marginBox(this.headerNode.firstChild, {w: this.width});
			this.updateItemListHeight();
		}
	},
	updateItemListHeight: function(){
		var domNodeBox = dojo.contentBox(this.domNode);
		var headerBox = dojo.marginBox(this.headerNode);
		var listNodeHeight = domNodeBox.h - headerBox.h;
		console.info('setting height for list node = ', listNodeHeight);
		dojo.marginBox(this.listNode, {h:listNodeHeight});
	},
	getCellContent: function(inRow, inCol, inHeader) {
		var d = this.getItemData(this.getCount());
		var titleData = d.title;
		var linkData = d.link;
		var descriptionData = d.description ? d.description.value : "";

		var info = {column: inCol, data: d, header: inHeader};
		this.onformat(info, inCol, d, inHeader);
		
		var html = ['<img class="feedlistexpander" src="' + this._getImageSrc(this.expand) + '"/>'];
		html.push(this.getFeedItemTitleContent(titleData, linkData));
		html.push('<br>');
		html.push('<div class="wmfeedlist-row-desc" style="display: ' + 
			(this.expand ? '' : 'none') + ';">' + descriptionData + '</div>');
		return html.join('');
	},
	getFeedItemTitleContent: function(inTitle, inLink) {
		return '<a target="newpage" href="' + (this.showLink ? inLink : 'javascript:;') + '">' + inTitle + '</a>';
	},
	setUrl: function(inUrl) {
		this.url = inUrl;
		if (!this.isDesignLoaded()) {
			this.getFeed();
		}
	},
	setExpand: function(inExpand) {
		this.expand = inExpand;
		this._render();
	},
	setShowLink: function(inShowLink) {
		this.showLink = inShowLink;
		this._render();
	},
	setTotalItems: function(inNum) {
		this.totalItems = parseInt(inNum) || '';
		this._render();
	},
	getDataItemCount: function() {
		var c = this.inherited(arguments);
		if (c && parseInt(this.totalItems) && this.totalItems > -1 && c > this.totalItems) {
			return this.totalItems;
		} else {
			return c;
		}
	},
	_getImageSrc: function(isCollapsed) {
		return wm.theme.getImagesPath() + (isCollapsed ? "feedlist_open.gif" : "feedlist_closed.gif");
	},
	_createGetFeedServiceVariable: function() {
	    if (this.$.getFeedServiceVariable) {
		this.getFeedServiceVariable = this.$.getFeedServiceVariable;
	    } else {
		this.getFeedServiceVariable = new wm.ServiceVariable(
			{name: "getFeedServiceVariable", owner: this, service: "FeedService", operation: "getFeed"});
	    }
	    this.getFeedServiceVariable["setData"] = function() {};
	    this.getFeedServiceVariable["onSuccess"] = dojo.hitch(this, "getFeedServiceVariableSuccess");
	},
	registerFeedServiceSuccess: function(inResult) {
		this._createGetFeedServiceVariable();
	        delete studio.application.serverComponents; // force it to recalculate its updated component list
		studio.updateServices();
	},
	update: function() {
		if (this.isDesignLoaded() && !studio.isLiveLayoutReady()) {
			studio.refreshLiveData();
			if (studio._deploying && studio._deployer)
				studio._deployer.addCallback(dojo.hitch(this, function(inResult) {
					this.update();
				}));
		} else {
			this.getFeed();
		}
	},
	getFeed: function() {
		if (this.url && this.url !== undefined) {
			this.getFeedServiceVariable.request([this.url]);
		} else
			this.clear();
	},
	getFeedServiceVariableSuccess: function(inResult) {
		this.title = inResult.title;
		this.renderData(inResult.entries);
	},
	onclick: function(inEvent, inItem) {
		if (inEvent.target.tagName == 'IMG') {
			var isCollapsed = inEvent.target.src.match("feedlist_closed.gif");
			inEvent.target.src = this._getImageSrc(isCollapsed);
			inEvent.target.parentNode.lastChild.style.display = isCollapsed ? "" : "none";
		} else {
			this.setValue("selectedLink", inItem.getData().link);
		}
	},
	_onmouseover: function(inEvent, inItem) {
	}
});

// design only...
wm.Object.extendSchema(wm.FeedList, {
	dataSet: {ignore: 1},
	disabled: {ignore: 1},
	columnWidths: {ignore: 1},
	dataFields: {ignore: 1},
	title: {ignore: 1},
        url: {group: "display", type: "String", bindTarget: 1},
	selectedLink: {ignore:1, bindSource: 1, type: "String"},
    selectedItem: {ignore: 1},
    showLink: {group: "display"},
    totalItems: {group: "display"},
    headerVisible: {group: "display"},
    expand: {group: "display"}
});

wm.FeedList.description = "A feed list.";

dojo.extend(wm.FeedList, {
    themeable: false
});
