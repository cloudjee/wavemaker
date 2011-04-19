/*
 *  Copyright (C) 2010-2011 WaveMaker Software, Inc.
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
dojo.provide("wm.base.widget.Dashboard");

dojo.declare("wm.Dashboard", wm.Control, {
	margin: 4,
	width:'100%',
	height:'100%',
	dojoObj:null,

	hasResizableColumns:false,
	opacity:0.3,
	nbZones:3,
	allowAutoScroll:true,
	withHandles:true,
	minChildWidth:200,
	minColWidth:10,

	saveInCookie:true,
	portlets:[],
	dijitPortlets:[],
	
	init: function() {
		dojo['require']("dojox.layout.GridContainer");
		dojo['require']("dojox.widget.Portlet");
		dojo['require']("dijit.TooltipDialog");
		this.inherited(arguments);
                wm.requireCss("lib.dojo.dojox.layout.resources.GridContainer");
                wm.requireCss("lib.dojo.dojox.widget.Portlet.Portlet");
	},
	postInit: function() {
		this.inherited(arguments);
		this.initAddDialog();
		this.bcPortlets(this.portlets);
		this.portletsObj = {};
		dojo.forEach(this.portlets, function(p){
			this.portletsObj[p.id] = p;
		}, this);
	  dojo.addOnLoad(dojo.hitch(this, "renderDojoObj"));
	},
	createAddDialog: function(){
		this.addDialog = new dijit.TooltipDialog({}, "tt");
		this.addDialog.startup();
		var dom = this.addDialog.containerNode;
                dojo.require("wm.base.widget.Editors.Select");
	    /* TODO: Localize */
	    this.selectEditor = new wm.SelectMenu({owner: this, 
						   "caption":wm.getDictionaryItem("wm.Dashboard.ADD_DIALOG_SELECT_CAPTION"),
						   "display":"Select",
						   "readonly":false,
						   "width":"250px", 
						   captionSize:"80px", 
						   required: true, 
						   isRelativePositioned:true});
		dom.appendChild(this.selectEditor.domNode);
		var panel = dojo.create('div', {style:'text-align:center'}, dom);
	    /* TODO: Localize */
	    this.okButton = new wm.Button({owner: this, 
					   "height":"100%",
					   "width":"60px",
					   "caption": wm.getDictionaryItem("wm.Dashboard.ADD_DIALOG_ADD_CAPTION"),
					   isRelativePositioned:true}); //{"onclick":'onOkClick'}
	    this.connect(this.selectEditor, "onEnterKeyPress", this, "_onOkClick");
	    /* TODO: Localize */
	    this.cancelButton = new wm.Button({owner: this,
					       "height":"100%",
					       "width":"60px",
					       "caption": wm.getDictionaryItem("wm.Dashboard.ADD_DIALOG_CANCEL_CAPTION"),
					       isRelativePositioned:true}); //, {"onclick":'onCancelClick'});
		panel.appendChild(this.okButton.domNode);
		panel.appendChild(this.cancelButton.domNode);
	},
	initAddDialog: function(){
		// Add Dialog should not be created when in Studio.
		if (this.isDesignLoaded())
			return;
    if (!this.addDialog)
			this.createAddDialog();

		var e = this.selectEditor;
		var eData = [];
		dojo.forEach(this.portlets, function(obj){
			eData.push({name: obj.title,dataValue: obj});
		});
		
	    var ds = e.dataSet = new wm.Variable({name: "optionsVar", owner: e, type: "EntryData" });
		ds.setData(eData);
		e.displayField = "name";
		e.dataField = "dataValue";
		e.createEditor();
		dojo.connect(this.okButton, 'onclick', this, '_onOkClick');
		dojo.connect(this.cancelButton, 'onclick', this, '_onCancelClick');
	},
	_onOkClick: function(){
		var props = this.selectEditor.getDataValue();
		props.isOpen = true;
		if (props){
			this.addPortlet(props);
			this.updateClosedList(props.id, false);
		}
		
		this.closeDialog();
	},
	_onCancelClick: function(){
		this.closeDialog();
	},
	update: function(e){
	    if (e && (e.currentTarget||e.target))
			this.openDialog(e.currentTarget||e.target);
	},
	closeDialog: function(){
		dijit.popup.close(this.addDialog);
	},
	openDialog: function(inNearDOM){
		dijit.popup.open({popup: this.addDialog, around: inNearDOM})		
	},
        renderBounds: function() {
	    this.inherited(arguments);
	    this.resizeDijit();
	    this.updatePageContainerBounds();
	},
        updatePageContainerBounds: function() {
	    wm.job(this.getRuntimeId() + ".updatePageContainerBounds", 10, dojo.hitch(this, function() {
		for (var i = 0; i < this.dijitPortlets.length; i++) {
		    var p = this.dijitPortlets[i];
		    var c = dojo.coords(p.wm_pageContainer.domNode.parentNode);
		    p.wm_pageContainer.setBounds(null,null,c.w-2, c.h-4);
		    p.wm_pageContainer.reflow();
		}
	    }));
	},
	resizeDijit: function() {
		if (this.dojoObj)
			this.dojoObj.resize(dojo.contentBox(this.domNode));
	},
	renderDojoObj: function() {
		if (this.dojoObj != null){
			this.dojoObj.destroy();
		}

		var props = {
			acceptTypes:['Portlet'],
			handleClasses:["dijitTitlePaneTitle"],
			isAutoOrganized:false,
			hasResizableColumns:this.hasResizableColumns,
			opacity:this.opacity,
			nbZones:this.nbZones,
			allowAutoScroll:this.allowAutoScroll,
			withHandles:this.withHandles,
			minChildWidth:this.minChildWidth,
			minColWidth:this.minColWidth,
			style:"width:100%;height:100%;"/*,
			"class":"soria"*/
		};

		this.dojoObj = new dojox.layout.GridContainer(props, dojo.create('div', {style:"width:100%;height:100%;"}, this.domNode));
		this.connectDojoEvents();
		this.dojoRenderer();
		this.renderPortlets();
	},
	dojoRenderer: function (){
		if (!this.dojoObj)
			return;
		this.dojoObj.startup();
	},
	renderPortlets: function(){
		var visiblePortlets = {}, opened = [], closed = [];
		dojo.forEach(this.portlets, function(p){
			if (p.isOpen)
				visiblePortlets[p.id] = p;
		}, this);

		if (!this.isDesignLoaded() && this.saveInCookie){
			var strPortletList = dojo.cookie(this.getId() + '_portlets');
			if (strPortletList && strPortletList != ''){
				opened = dojo.fromJson(strPortletList);
				this.bcPortlets(opened);
				dojo.forEach(opened, function(p){
					var validPortlet = this.portletsObj[p.id];
					if (validPortlet){
						visiblePortlets[p.id] = dojo.mixin({}, validPortlet, {x: p.x, y: p.y, isOpen:true});
					}
				}, this);
			}

			var strClosedList = dojo.cookie(this.getId() + '_closed_portlets');
			if (strClosedList && strClosedList != ''){
				closed = dojo.fromJson(strClosedList);
				dojo.forEach(closed, function(pId){
					var validPortlet = this.portletsObj[pId];
					if (validPortlet){
						visiblePortlets[pId] = dojo.mixin({}, validPortlet, {isOpen:false});
					}
				}, this);
			}
		}

		var portletArray = [];
		for (var i in visiblePortlets){
			portletArray.push(visiblePortlets[i]);
		}
		
		if (!this.isDesignLoaded())
			this.onBeforeRenderPortlet(portletArray);
		for (var i = 0; i < portletArray.length; i++){
			this.addPortlet(portletArray[i]);
		}
	},
	onBeforeRenderPortlet: function(portlets){
	},
	connectDojoEvents: function(){
	},
	addPortlet: function(props){
		//props: {id:'portlet', title:'Portlet 1', page:'Page_widget_1', isOpen:true, isClosable:false, x:0, y:0}
		if (!props.isOpen)
			return;
		var portletProps = {'title':props.title, 'class':'soria', 'dndType': 'Portlet', 'closable':props.isClosable};
		var portlet = new dojox.widget.Portlet(portletProps, dojo.create('div'));
		portlet.wmProps = props;
		if (this.isDesignLoaded()){
			props.portletId = portlet.id;
			portlet.closeIcon.style.display = props.isClosable ? 'block' : 'none';
		}
		
		portlet.containerNode.style.padding = '0px';
		this.dojoObj.addService(portlet,props.x || 0, props.y || 0);
	  portlet.wm_pageContainer = new wm.PageContainer({loadParentFirst: false, owner: this, parentNode: portlet.containerNode, isRelativePositioned:true});
    if (props.page) {
			portlet.wm_pageContainer.setPageName(props.page);
	this.updatePageContainerBounds();
   	}

		if (!this.isDesignLoaded()){
		    dojo.connect(portlet, 'onClose', this, 'portletClosed');
		    portlet.subscribe("/dojox/mdnd/drop", dojo.hitch(this, '_onDashboardChange'));
				this._onDashboardChange();
		}	
		
		this.dijitPortlets.push(portlet);		
		return props;
	},
	addNewPortlet: function(props){
		props.id = this.getNewPortletId(props.id);
		props.title = this.getPortletTitleFromId(props.id);
		this.addPortlet(props);
		return props;
	},
	getNewPortletId: function(inId){
		inId = inId.toLowerCase().replace(/ /g, '_');
		if (!this.pIds){
			this.pIds = {};
			dojo.forEach(this.portlets, function(p){
				this.pIds[p.id] = true;
			}, this);
		}

		if (!this.pIds[inId]){
			this.pIds[inId] = true;
			return inId;
		}

		var c = 1;
		while(this.pIds[inId + '_' + c]){
			c++; 
		}
		
		this.pIds[inId + '_' + c] = true;
		return inId + '_' + c;
	},
	portletClosed: function(e){
		var p = dijit.getEnclosingWidget(e.target);
		if (p){
			var wmProps = p.wmProps;
			this.updateClosedList(wmProps.id, true);			
		    if (p.wm_pageContainer)
			p.wm_pageContainer.destroy();
		    p.destroy();
		}
		this._onDashboardChange(e);
	},
	updateClosedList: function(id, isClosed){
		if (!this.saveInCookie)
			return;
		if (!this.closedList){
			var strClosedList = dojo.cookie(this.getId() + '_closed_portlets') || '[]';
			this.closedList = dojo.fromJson(strClosedList);
		}

		if ( (isClosed && this.closedList.indexOf(id) != -1) || (!isClosed && this.closedList.indexOf(id) == -1))
			return;
		
		if (isClosed){
				this.closedList.push(id);
		} else {
			while (this.closedList.indexOf(id) != -1){
				var idx = this.closedList.indexOf(id);
				this.closedList.splice(idx, 1);
			}
		}
		
		dojo.cookie(this.getId() + '_closed_portlets', dojo.toJson(this.closedList), {expires:5});
	},
	_onDashboardChange: function(e){
		var pList = this.updatePortletXY();
		console.info('saving in cookie....', pList);
		if (this.saveInCookie)
      dojo.cookie(this.getId() + '_portlets', dojo.toJson(pList), {expires:5});
    else
      dojo.cookie(this.getId() + '_portlets', null, {expires:-1});
		this.onDashboardChange(pList);
	},
	onDashboardChange: function(activePortlets){
	},
	_togglePortlet: function(evt){
		var p = dijit.getEnclosingWidget(evt.originalTarget);
		dojo.toggleDOM(p.containerNode);
	},
	destroyPortlet: function(props){
		var p = dijit.byId(props.portletId);
		delete props.portletId;
		if (p)
			p.destroy();
	},
	updatePortletXY: function(){
		this.portletXY = {};
		var _this = this;
		var currentPortletList = [];
	    dojo.forEach(this.dojoObj._grid, function(col, x){
	      dojo.forEach(col.node.childNodes, function(domPort, y){
	        var portlet = dijit.getEnclosingWidget(domPort);
					var wmProps = portlet.wmProps;
	        if (portlet){
						_this.portletXY[portlet.id] = {x:x, y:y};
						wmProps.x = x;
						wmProps.y = y;
						currentPortletList.push(wmProps);
	        }
	      });
	    });
		
		return currentPortletList;
	},
	destroy: function(){
		this.inherited(arguments);
		if (this.addDialog){
			this.addDialog.destroy();
			delete this.addDialog;
		}
	},
	
	// Backward compatability: This function is written for dashboard portlets who does not have id's in portlet definition.
	bcPortlets: function(pList){
		dojo.forEach(pList, function(p){
			if (p.id)
				return;
			p.id = this.getPortletIdFromTitle(p.title);
		}, this);
	},
	getPortletIdFromTitle: function(inTitle){
		if (!inTitle)
			return '';
		return inTitle.replace(/ /g, '_');
	},
	getPortletTitleFromId: function(pId){
		return pId.replace(/_/g, ' ');
	}
});

dojo.toggleDOM = function(domNode, animate){
	// summary: 
	//		Toggles the visibility of domNode.
	var n = domNode;
	if(dojo.style(n, "display") == "none"){
		if (animate){
			dojo.style(n, {"display": "block",	"height": "1px","width": "auto"});
			dojo.fx.wipeIn({node: n}).play();
		} else {
			dojo.style(n, {"display": "block"});
		}

	}else{
		if (animate){
			dojo.fx.wipeOut({
				node: n,
				onEnd: dojo.hitch(this, function(){
					dojo.style(n,{"display": "none", "height": "", "width":""});
				}
			)}).play();
		} else {
			dojo.style(n, {"display": "none"});
		}
	}
}
