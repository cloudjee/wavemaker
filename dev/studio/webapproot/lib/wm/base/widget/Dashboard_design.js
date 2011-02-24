dojo.provide("wm.base.widget.Dashboard_design");
dojo.require("wm.base.widget.Dashboard");
dojo.require("wm.base.widget.ContextMenuDialog");

wm.Dashboard.extend({
  themeable: false,
	configPortlets: "(Configure Portlets)",
	headerAttr: [{id:'isOpen', title:'Default',width:'50px', type:'checkbox'}, 
				{id:'title', title: 'Title',width:'170px', type:'text'}, 
				{id:'page', title: 'Page',width:'170px', type:'dropdown'}, 
				{id:'isClosable', title: 'Closable',width:'55px', type:'checkbox'}],

	designCreate: function(){
		this.inherited(arguments);
		var defaultPortletParams = {id:'portlet', title:'Portlet', page:'', isOpen:true, isClosable:true, x:0, y:0};
		this.updatePageList();
		this.headerAttr[2].dataStore = this.pageStore;
	    this.contextMenu = new wm.ContextMenuDialog({addButtonLabel: 'Add Portlet', 
							onAddButtonClick: dojo.hitch(this, 'addNewPortlet'), 
							headerAttr: this.headerAttr, 
							dataSet: this.portlets, 
							newRowDefault: defaultPortletParams, 
							addDeleteColumn: true});
		dojo.connect(this.contextMenu, 'onPropChanged', this, 'portletPropChanged');
		dojo.connect(this.contextMenu, 'onRowDelete', this, 'destroyPortlet');

	        this.contextMenu.setWidth("500px");
	        this.contextMenu.setHeight("300px");
	        this.contextMenu.setTitle("Configure Portlets");

	},
	showMenuDialog: function(e){
		this.contextMenu.show();
	},
	portletPropChanged: function(Obj, prop, inValue, trObj){
		switch(prop){
			case 'isOpen':
				if (inValue){
					this.addPortlet(Obj);
				} else {
					this.destroyPortlet(Obj);
				}
				break;
			case 'title':
				var p = dijit.byId(Obj.portletId);
				if (!p)
					return;
				p.attr('title', inValue);					 
			  	break;
			case 'page':
				var p = dijit.byId(Obj.portletId);
				if (!p)
					return;
				p.wm_pageContainer.setPageName(inValue);
			  	break;
			case 'isClosable':
				var p = dijit.byId(Obj.portletId);
				if (!p)
					return;
				p.closeIcon.style.display = inValue ? 'block':'none';
			  	break;
		}
	},
	removePortlet: function(obj){
		this.destroyPortlet(Obj);
	},
	updatePageList: function(){
		var pages = wm.getPageList(false);
		var pageList = [];
		
		dojo.forEach(pages, function(pageName){
			pageList.push({name:pageName, value:pageName});
		});

		if (!this.pageStore){
			var storeData = {identifier: 'value', label: 'name', value: 'value', items: pageList};
			this.pageStore = new dojo.data.ItemFileWriteStore({data: storeData});
		} else {
			this.pageStore.attr('data', pageList);
		}
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		case "configPortlets":
			return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "configPortlets":
				return this.showMenuDialog();
		}
		return this.inherited(arguments);
	},
	writeComponents: function() {
		return ""; // don't write the addDialog at a minimum...
	},
	writeProps: function(){
		try{
			var props = this.inherited(arguments);
			var pList = this.contextMenu.getUpdatedDataSet();
		    if (pList.length == 0) {
			this.contextMenu.setDataSet(this.portlets);
			pList = this.contextMenu.getUpdatedDataSet();
		    }
			this.updatePortletXY();
			var writePortlets = [];		
			dojo.forEach(pList, function(obj){
				var coord = this.portletXY[obj.portletId];
				if (coord){
					obj.x = coord.x;
					obj.y = coord.y;
				}
				
				var wObj = dojo.clone(obj);
				delete wObj.portletId;
				writePortlets.push(wObj);
			}, this);
			props.portlets = writePortlets;
			return props;
		} catch(e){
			console.info('Error while saving dashboard data..............', e);
		}
	}
});

wm.Dashboard.description = "A dojo Grid Container that is used as a dashboard element.";

wm.Object.extendSchema(wm.Dashboard, {
	caption:{ignore:1},
	disabled:{ignore:1},
	dataValue:{ignore:1},
	minWidth:{ignore:1},
	portlets:{ignore:1},
	dijitPortlets:{ignore:1},
	addDialogName:{hidden:true},
	headerAttr:{ignore:1},
        configPortlets: { group: "edit", order: 10 },
        autoScroll: {group: "style", order: 100, ignore: 0},
    allowAutoScroll: {group: "style", order: 101, ignore: 0},
    openDialog: {group: "method"},
    initAddDialog: {group: "method"},
    addPortlet: {group: "method"}
});

