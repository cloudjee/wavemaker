dojo.provide("wm.base.widget.DojoGrid_design");
dojo.require("wm.base.widget.DojoGrid");

wm.DojoGrid.extend({
	editColumns: "(Edit Columns)",
    showAddDialog: "(Show Dialog)",
	fieldOptions: [	{name:'Text',value:'dojox.grid.cells._Widget'},
		           	{name:'Number',value:'dojox.grid.cells.NumberTextBox'},
	                {name:'Date',value:'dojox.grid.cells.DateTextBox'},
	                {name:'Checkbox',value:'dojox.grid.cells.Bool'},
	                {name:'ComboBox',value:'dojox.grid.cells.ComboBox'}
		      ],
	headerAttr: [{id:'show', title:' ',width:'10px', type:'checkbox'}, 
				{id:'id', title: 'Field',width:'150px', type:'text', readOnly:true}, 
				{id:'title', title: 'Title',width:'150px', type:'text'}, 
				{id:'width', title: 'Width',width:'109px', type:'width'}, 
				{id:'align', title: 'Alignment',width:'70px', type:'dropdown'},
				{id:'formatFunc', title: 'Format',width:'150px', type:'dropdown'},
				{id:'fieldType', title: 'Edit Field Type',width:'100px', type:'dropdown', isAdvanced:true},
/*				{id:'editable', title:'Editable',width:'10px', type:'checkbox', isAdvanced:true}, */
/*		                {id: 'editParams', title: "Edit Parameters", width: "100px", type: 'gridEditParams', isAdvanced: true},*/
				{id:'expression', title: 'Data Expression',width:'150px', type:'text', isAdvanced:true}],
	defaultFormatters:[	{name:'', value:''},
											{name:'Currency (WaveMaker)', value:'wm_currency_formatter'},
											{name:'Date (WaveMaker)', value:'wm_date_formatter'},
											{name:'Number (WaveMaker)', value:'wm_number_formatter'},
											{name:'Image (WaveMaker)', value:'wm_image_formatter'}],
    //showAddButton: false,
    //showDeleteButton:false,
    themeableStyles: [],
    themeableSharedStyles: ["-Even Rows", "Row-Background-Color","Row-Font-Color",
			    "-Odd Rows","Row-Background-Odd-Color","Row-Font-Odd-Color",
			    "-Hover Row", "Row-Background-Hover-Color","Row-Font-Hover-Color",
			    "-Selected Row", "Row-Background-Selected-Color", "Row-Font-Selected-Color", 
			    "-Misc", "Row-Border-Color", 
			    "-Header Styles", "Header-Background-Color", "Header-Font-Color", "Header-Image", "Header-Image-Position","Header-Image-Repeat"],
	afterPaletteDrop: function() {
		this.caption = this.caption || this.name;
		this.renderDojoObj();
	},
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	},
	designCreate: function() {
		// if this is being created in studio, supply a default caption
		if (this._studioCreating)
			this.studioCreate();
		this.inherited(arguments);

		this.headerAttr[4].dataStore = this.getAlignmentTypeStore();
		this.updateFormatterList();
		this.headerAttr[5].dataStore = this.formatterStore;

		this.updateFieldTypeList(this.fieldOptions);
		this.headerAttr[6].dataStore = this.fieldTypeStore;
		var defaultCustomFieldParams = {id: 'customField', isCustomField: true, expression: '', show:true, width:'100%'};
		var helpText = '* To re-arrange columns close dialog box and drag columns on grid to desired position.<br>* You can right click on grid to open this dialog.';
	    this.contextMenu = new wm.ContextMenuDialog({addButtonLabel: 'Add Column', 
							 onAddButtonClick: dojo.hitch(this, 'addNewColumn'), 
							 headerAttr: this.headerAttr, 
							 dataSet: this.columns, 
							 newRowDefault: defaultCustomFieldParams, 
							 addDeleteColumn: true, 
							 helpText: helpText, 
							 containerNodeWidth: 700});
	        this.contextMenu.setWidth("710px");
	        this.contextMenu.setTitle("DojoGrid Column Properties");

		//this.contextMenu.showModal = false;
		dojo.connect(this.contextMenu, 'onPropChanged', this, 'columnPropChanged');
		dojo.connect(this.contextMenu, 'onRowDelete', this, 'destroyColumn');
		dojo.connect(this.contextMenu, 'onAddNewColumnSuccess', this, 'columnAddSuccess');
	},
	showMenuDialog: function(e){
		this.updateFormatterList();
		this.contextMenu.show();
	},
	columnPropChanged: function(obj, columnId, inValue, trObj, widget){
		if (columnId && columnId == 'width' && !isNaN(dojo.number.parse(inValue))){
				obj.width = inValue+'px';
		}
		
		var addFormatter = false;
		if (columnId && columnId == 'formatFunc' && inValue == '- Add Formatter'){
			var evtName = wm.getValidJsName('format'+ wm.getValidJsName(wm.capitalize(obj.id)) + wm.capitalize(this.name));
			obj.formatFunc = evtName;
			widget.attr('value', evtName, false);
			addFormatter = true;
		} /*else if (columnId == "fieldType") {
		    switch(inValue) {
		    case "dojox.grid.cells.ComboBox":
			dojo.query(".EditorTextOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorNumberOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorDateOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorComboOptions", trObj)[0].style.display = "block";
			break;
		    case "dojox.grid.cells.DateTextBox":
			dojo.query(".EditorTextOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorNumberOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorDateOptions", trObj)[0].style.display = "block";
			dojo.query(".EditorComboOptions", trObj)[0].style.display = "none";
			break;
		    case "dojox.grid.cells.NumberTextBox":
			dojo.query(".EditorTextOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorNumberOptions", trObj)[0].style.display = "block";
			dojo.query(".EditorDateOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorComboOptions", trObj)[0].style.display = "none";
			break;
		    case "dojox.grid.cells.Bool":
			dojo.query(".EditorTextOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorNumberOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorDateOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorComboOptions", trObj)[0].style.display = "none";
			break;
		    case "dojox.grid.cells._Widget":
			dojo.query(".EditorTextOptions", trObj)[0].style.display = "block";
			dojo.query(".EditorNumberOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorDateOptions", trObj)[0].style.display = "none";
			dojo.query(".EditorComboOptions", trObj)[0].style.display = "none";
			break;
		    }


		}
		    */		
		this.updateGridStructure();		
		if (addFormatter) {
			this.contextMenu.hide();
			eventEdit(this, '_formatterSignature', evtName, true);
		}	
	    wm.onidle(studio, "updateCanvasDirty");
	},
	_formatterSignature: function(inValue, rowId, cellId, cellField, cellObj, rowObj){
	},
	destroyColumn: function(){
		this.updateGridStructure();		
	},
	columnAddSuccess: function(){
		this.updateGridStructure();		
	},
	updateFormatterList: function(){
		var fArray = dojo.clone(this.defaultFormatters);
		dojo.forEach(getAllEventsInCode(), function(f){
			fArray.push({name:f, value:f});			
		});
		fArray.push({name:'- Add Formatter', value:'- Add Formatter'});

		var data = {identifier: 'value', items: fArray};
		if (!this.formatterStore){
			this.formatterStore = new dojo.data.ItemFileReadStore({data: data});
		} else {
			this.formatterStore.reload(data);
		}
	},
	updateFieldTypeList: function(options){
		if (!this.fieldTypeStore){
			var fieldTypeData = {identifier: 'value', label: 'name', value: 'value', items: options};
			this.fieldTypeStore = new dojo.data.ItemFileWriteStore({data: fieldTypeData});
		} else {
			this.fieldTypeStore.attr('data', options);
		}
	},
	getAlignmentTypeStore: function(){
		var fieldTypeData = {identifier: 'value', label: 'name', value: 'value', items: [{name:'Left', value:'left'},{name:'Center', value:'center'},{name:'Right', value:'right'}]};
		return new dojo.data.ItemFileReadStore({data: fieldTypeData});
	},
	getNewColumnId: function(cId){
		if (!this.columnIds){
			this.columnIds = {};
			dojo.forEach(this.columns, function(col){
				if(col.id.indexOf(cId) != -1)
					this.columnIds[col.id] = true;				
			}, this);
		}

		if (!this.columnIds[cId]){
			this.columnIds[cId] = true;
			return cId;
		}

		var c = 1;
		while(this.columnIds['customField' + c]){
			c++;
		}
		
		this.columnIds['customField' + c] = true;
		return 'customField' + c;
	},
	setShowAddButton: function(inValue){
		this.showAddButton = inValue;
		this.updateDOMNode();
		this.renderDojoObj();
		this.addDialogForInsert();
	},
	setShowDeleteButton: function(inValue){
		this.showDeleteButton = inValue;
		this.updateDOMNode();
		this.renderDojoObj();
	},
	setSingleClickEdit: function(inValue){
		this.singleClickEdit = inValue;
		if (this.dojoObj)
			this.dojoObj.singleClickEdit = this.singleClickEdit;
		this.dojoObj.render();
	},
	addNewColumn: function(){
		var customField = {id: this.getNewColumnId('customField'), isCustomField: true, expression: '', show:true, width:'100%'};
		return customField;		
	},
	addDialogForInsert: function(){
		try{
			if (!this.showAddButton){
				return;
			}
				
			if (!this.addDialog){
				this.addDialogName = studio.page.getUniqueName(this.name+"_AddDialog");
				this.addDialog = new wm.Dialog({width:320, height:95, name: this.addDialogName, 
									  fitToContentHeight: true,
												border:2, borderColor: "rgb(80,80,80)", 
												parent: this, owner: this, 
												modal: false, animateSlide:true});
			}
			
			if (!this.liveForm && this.variable instanceof wm.LiveVariable){
				this.addFormName = studio.page.getUniqueName(this.name+"_AddForm");
				this.liveForm = new wm.LiveForm({
						name: this.addFormName,
						owner: this.owner,
				        parent: this.addDialog,
						verticalAlign: "top",
						horizontalAlign: "left",
						_liveSource: this.variable.liveSource
					});
	
				this.liveForm.createLiveSource(this.liveForm._liveSource);
				this.liveForm.beginDataInsert();
				this.addDialog.setHeight(this.liveForm.height);
			}
		}
		catch(e){
			console.info('error while creating dialog and live variable: ', e);
		}			
	},
	updateGridStructure: function(){
		this.columns = this.contextMenu.getUpdatedDataSet();
		this.dojoObj.attr('structure', this.getStructure());
		this.dojoObj.render();
	},
	_onResizeColumn: function(idx, inDrag, delta){
		var sArray = this.contextMenu.getUpdatedDataSet();
		sArray[idx].width = delta.w + 'px';
		this.contextMenu.setDataSet(sArray);
		wm.fire(studio.inspector, "reinspect");
	},
	_onMoveColumn: function(arg1, arg2, oldPos, newPos){
		var sArray = this.contextMenu.getUpdatedDataSet();
		var tmp=sArray[oldPos];
		sArray.splice(oldPos,1);
		sArray.splice(newPos,0,tmp);
		this.contextMenu.setDataSet(sArray);
		wm.fire(studio.inspector, "reinspect");
	},


	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
			case "dataSet":
				return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.variable ? this.variable.getId() : "", allowAllTypes: true, listMatch: true});
		case "selectionMode":
			return makeSelectPropEdit(inName, inValue, ["single", "multiple", "extended", "none"], inDefault);
		case "editColumns":
			return makeReadonlyButtonEdit(inName, inValue, inDefault);
		   case "showAddDialog":
		       return makeReadonlyButtonEdit(inName, inValue, inDefault);
		}
		return this.inherited(arguments);
	},
	editProp: function(inName, inValue, inInspector) {
		switch (inName) {
			case "editColumns":
				return this.showMenuDialog();
		        case "showAddDialog":
		    if (this.addDialog)
			this.addDialog.show();
		    else
			this.addDialogForInsert();
		    return;
		}
		return this.inherited(arguments);
	},
	writeProps: function(){
		try{
			var props = this.inherited(arguments);
			props.columns = this.contextMenu.getUpdatedDataSet();
			return props;
		} catch(e){
			console.info('Error while saving dashboard data..............', e);
		}
	}
	
});

wm.Object.extendSchema(wm.DojoGrid, {
	variable: { ignore: 1 },
	caption:{ignore:1},
	scrollX:{ignore:1},
	scrollY:{ignore:1},
	disabled:{ignore:1},
	query: {ignore:1},
	editColumns:{group: "operation", order:40},
    //showAddDialog:{group: "edit", order:40},
    showAddDialog: {ignore: true}, // will unignore once this feature is ready
    singleClickEdit: {group: "edit", order: 32},
    caseSensitiveSort: {group: "display", order: 40},
    selectFirstRow: {group: "display", order: 41},
	store:{ignore:1},
	menu:{ignore:1},
	storeGUID:{ignore:1},
	dataValue:{ignore:1},
    selectedItem: {ignore:1, bindSource: 1, simpleBindProp: true, doc: 1},
    emptySelection: { ignore: true, bindSource: 1, type: "Boolean",  doc: 1},
    isRowSelected: { ignore: true, bindSource: 1, type: "Boolean",   doc: 1},
    dataSet: {bindTarget: 1, group: "edit", order: 30, isList: true, simpleBindTarget: true, doc: 1},
	selectionMode: {group: "edit", order: 31},
	rightClickTBody: {ignore:1},
	addDialogName:{hidden:true},
	addFormName:{hidden:true},
	dsType:{hidden:true},
    columns:{ignore:1},
    setSelectedRow: {group: "method"},
    getSelectedIndex:{group: "method", returns: "Number"},
    getRow: {group: "method"},
    findRowIndexByFieldValue:  {group: "method", returns: "Number"},
    getCell:  {group: "method", returns: "String"},
    setCell:  {group: "method"},
    editCell:  {group: "method"},
    deleteRow:  {group: "method"},
    addRow:  {group: "method"},
    getRowCount: {group: "method", returns: "Number"},
    getDataSet: {group: "method", returns: "wm.Variable"},
    setDataSet: {group: "method"},
    showCSVData: {group: "method"}
});
