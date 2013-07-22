/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
 

dojo.provide("wm.base.widget.ContextMenuDialog");
dojo.require('dojo.data.ItemFileReadStore');
dojo.require("wm.base.widget.Dialog");
dojo.declare("wm.ContextMenuDialog", wm.Dialog, {
    useContainerWidget: true,
    modal: false,
    title: "",
/*
    constructor: function(addButtonLabel, onAddButtonClick, headerAttr, dataSet, newRowDefault, domNode, addDeleteColumn, helpText, width){
	        this.owner = window["studio"]; // without this, dialog shows up only in canvas
		this.helpText = helpText;
	//this.dialogTitle = dialogTitle;
		this.addButtonLabel = addButtonLabel;
		this.dataSet = dataSet;
		this.onAddButtonClick = onAddButtonClick;
		this.newRowDefault = newRowDefault;
		this.addDeleteColumn = addDeleteColumn;
		this.headerAttr = headerAttr;
		this.trObjMap = {};
		this.trId = 0;
		this.showModal = true;
		this.deleteButtonProps = {id:'deleteButton', title: ' ',width:'', type:'img', label:'Delete', src:'images/delete_24.png', width:'20px'};
	        this.containerNodeWidth = width;
	//dojo.connect(domNode, "oncontextmenu", this, "show");
	},
	*/
    init: function() {
	this.owner = window["studio"]; // without this, dialog shows up only in canvas
	this.inherited(arguments);
	this.deleteButtonProps = {id:'deleteButton', 
				  title: ' ',
				  width:'', 
				  type:'img', 
				  label: studio.getDictionaryItem("wm.ContextMenuDialog.DELETE_LABEL"),
				  src:'images/delete_24.png', 
				  width:'20px'};
	this.trObjMap = {};
	this.trId = 0;
    },
    postInit: function() {
	this.inherited(arguments);
	this.innerDomNode = document.createElement("div");
	this.innerDomNode.style.overflow = "auto";
	this.innerDomNode.style.height = "100%";
	this.containerWidget.domNode.appendChild(this.innerDomNode);
    },
    show: function(e) {
	this.inherited(arguments);
	this.createRightClickMenu();
	if (e)
	    dojo.stopEvent(e);
    },
/*
	show: function(e){
		if (!this.menu)
			this.createRightClickMenu();
		this.menu.show();
		if (!this.showModal)
			dijit._underlay.hide();
		if (e)
			dojo.stopEvent(e);
	},
	hide: function(){
		this.menu.hide();
	},
	*/
	setDataSet: function(dataSet){
		this.trObjMap = {};
		this.trId = 0;
		this.dataSet = dataSet;
		if (this.menuTable){
			dojo.destroy(this.menuTable);
			delete this.menuTable;
			this.createMenuHTML(this.headerAttr, this.dataSet);			
		}
	},
	getUpdatedDataSet: function(){
/*
		if (!this.menu) // with change in superclass, this.menu now refers to this.
			return this.dataSet;
			*/			
		var arr = [];
		for (var tr in this.trObjMap){
			 arr.push(this.trObjMap[tr]);
		}
		
		return arr;
	},

	rowPropChanged: function(obj, columnId, trObj, widget, inValue){
		if (widget && widget.declaredClass == 'dijit.form.ComboBox'){
		  inValue = this.getComboBoxValueFromLabel(widget, inValue);	
		}
		
		if (columnId == 'deleteButton' && this.addDeleteColumn){
			this.deleteRow(obj, columnId, trObj, inValue);
			return;
		}
		
		obj[columnId] = inValue;
		var trId = dojo.attr(trObj, 'trId');
		this.onPropChanged(obj, columnId, inValue, trObj, widget);
		this.trObjMap['TR_'+trId] = obj;
	},
	getComboBoxValueFromLabel: function(widget, label){
	    var value = label;
	    try {
		var identifier = widget.store.getIdentityAttributes()[0];
		
		if (widget.item) {
		    value = widget.item[identifier][0];
		} else {
		    value = widget.get("value");
		}
	    } catch(e) {
		// do nothing as anything might go wrong in above to statements.
		// If so, then we will just pass label back.	 	
	  }
	
		return value;
	},
	widthTextChanged: function(obj, columnId, trObj, textWidget, typeWidget, inValue){
		var w = this.getWidthProps(inValue);
		inValue = w.text;
		textWidget.attr('value', inValue);
		if (w.dd) {
			inValue += w.dd;
			typeWidget.attr('value', w.dd);
		} else {
			inValue += typeWidget.attr('value');
		}
		
		obj[columnId] = inValue;
		var trId = dojo.attr(trObj, 'trId');
		this.onPropChanged(obj, columnId, inValue, trObj);
		this.trObjMap['TR_'+trId] = obj;
	},
	widthTypeChanged: function(obj,columnId,trObj,textWidget,typeWidget,inValue){
		var w = this.getWidthProps(obj[columnId]);
		var width = w.text + inValue;
		obj[columnId] = width;
		var trId = dojo.attr(trObj, 'trId');
		this.onPropChanged(obj, columnId, inValue, trObj);
		this.trObjMap['TR_'+trId] = obj;
	},
	onPropChanged: function(Obj, prop, inValue, trObj){
	},
	deleteRow: function(obj, columnId, trObj, inValue){
		var trId = dojo.attr(trObj, 'trId');
		dojo.destroy(trObj);
		delete this.trObjMap['TR_'+trId];
		this.onRowDelete(obj);
	},
	onRowDelete: function(Obj){
	},
	
	createRightClickMenu: function(){
	    if (this.rightMenuCreated) return;
	    this.rightMenuCreated = true;
/*
		this.menu = new dijit.Dialog({title:this.dialogTitle},dojo.doc.createElement('div'));
		this.titleBarClass = 'wmcontainer wmPageDialog-titleBar dialogtitlebar wmlabel wmGenericDialog-dialogTitleLabel';
		dojo.removeClass(this.menu.titleBar, 'dijitDialogTitleBar');
    dojo.addClass(this.menu.titleBar, this.titleBarClass);
		this.menu.domNode.style.border = '1px solid #333333';
		*/				
	    
		if (this.helpText){
			this.helpTextDiv = dojo.create('div', {innerHTML:this.helpText, style:'padding-left:5px;margin:5px;background:#FFF1A8;border:1px solid #DCDCDC;'}, this.innerDomNode);
		}

		this.createMenuHTML(this.headerAttr, this.dataSet);
	},
	createMenuHTML: function(headerAttr, rows){
		this.hasAdvancedColumn = false;
		this.isAdvancedHidden = true;
		this.advancedColumns = [];
		this.menuTable = dojo.doc.createElement('table');
		this.menuTable.style.display = 'none';
	    if (this.containerNodeWidth)
		this.menuTable.style.width = this.containerNodeWidth + "px";
		var thead = dojo.doc.createElement('thead');
		this.menuTable.appendChild(thead);
		var tr = dojo.doc.createElement('tr');
		dojo.attr(tr, 'style', 'background-color:#DCDCDC');
		thead.appendChild(tr);
		dojo.forEach(headerAttr, function(attr){
			this.addHeaderColumn(tr, attr);
			if (attr.isAdvanced)
				this.hasAdvancedColumn = true;
		}, this);

		if (this.addDeleteColumn){
			if (this.hasAdvancedColumn)
				this.deleteButtonProps.isAdvanced = true;
			var deleteTD = this.addHeaderColumn(tr, this.deleteButtonProps);
			deleteTD.style.backgroundColor = '#FFFFFF'; 
		    deleteTD.width = "20px";
		}

		this.rightClickTBody = dojo.doc.createElement('tbody');
		this.menuTable.appendChild(this.rightClickTBody);
		this.innerDomNode.appendChild(this.menuTable);
		
		dojo.forEach(rows, function(row){
			this.addNewRow(row, headerAttr, this.rightClickTBody);
		}, this);

		this.paintNewColumnButton();
		if (this.hasAdvancedColumn)
			this.addAdvancedProperties();
	},
	addAdvancedProperties: function(){
		this.destoryAdvancedPropertiesDiv();
	    this.advancedButtonDiv = dojo.create('span', {}, this.innerDomNode);
	    dojo.place(this.advancedButtonDiv, this.newColumnButton.domNode, 'after');
	    this.advancedButton = new dijit.form.Button({label:studio.getDictionaryItem("wm.ContextMenuDialog.SHOW_MORE")},dojo.create('div',{},this.advancedButtonDiv));
		dojo.connect(this.advancedButton, 'onClick', this, 'toggleAdvancedProps');
	},
	destoryAdvancedPropertiesDiv: function(){
		if (!this.advancedButton)
			return;
		dojo.destroy(this.advancedButton);
		dojo.destroy(this.advancedButtonDiv);
	},
	toggleAdvancedProps: function(){
		if (this.isAdvancedHidden) {
			this.isAdvancedHidden = false;
			dojo.forEach(this.advancedColumns, function(td){
				td.style.display = '';
			});
		    this.advancedButton.attr('label', studio.getDictionaryItem("wm.ContextMenuDialog.SHOW_LESS"));
		    this.menuTable.style.width = "1000px";
		    this.setWidth("1020px");
		} else {
			this.isAdvancedHidden = true;
			dojo.forEach(this.advancedColumns, function(td){
				td.style.display = 'none';
			});
			this.advancedButton.attr('label', studio.getDictionaryItem("wm.ContextMenuDialog.SHOW_MORE"));
		    this.setWidth("720px");
	    this.menuTable.style.width = "700px";
		}

	    //this.menu._position();
	},
	addHeaderColumn: function(tr, attr){
		var td = dojo.doc.createElement('td');
		dojo.attr(td,'width',attr.width);
		dojo.attr(td,'align','center');
		td.innerHTML = attr.title;
		tr.appendChild(td);
		if (attr.isAdvanced){
			td.style.display = 'none';
			this.advancedColumns.push(td);
		}
		
		return td;
	},
	addNewRow: function(obj, headerAttr, tbody){
		var tr = dojo.doc.createElement('tr');
		dojo.attr(tr, 'trId', this.trId);
		this.trObjMap['TR_'+this.trId] = obj;
		dojo.forEach(headerAttr, function(column){
			this.addChildColumn(tr, column, obj);
		}, this);

		if (this.addDeleteColumn){
			this.addChildColumn(tr, this.deleteButtonProps, obj);
		}

		tbody.appendChild(tr);
		this.menuTable.style.display = 'block';
		this.trId++;
	},
	addChildColumn: function(tr, column, obj){
		try{
		    var td = dojo.create('td', {});
			var widget = null;
			switch(column.type){
				case 'checkbox':
					dojo.attr(td,'align','center');
					var params = {};
					if (obj[column.id])
						params.checked = true;
					widget = new dijit.form.CheckBox(params, dojo.doc.createElement('div'));
					widget.onChange = dojo.hitch(this, 'rowPropChanged', obj, column.id, tr, widget);
					break;
				case 'button':
					widget = new dijit.form.Button({label: column.label, style:'padding:0px;'});
					widget.onClick = dojo.hitch(this, 'rowPropChanged', obj, column.id, tr, widget);
					break;
				case 'img':
					var src = column.src;
					if (column.id == 'deleteButton' && obj.noDelete){
					    dojo.create('div', {}, td);
						break;
					}
					
					var imgProps = {src: src, onclick: dojo.hitch(this, 'rowPropChanged', obj, column.id, tr)};
			                if (column.width) {
						imgProps.width = column.width;
					}
					if (column.height)
						imgProps.height = column.height;
						
					widget = dojo.create('img', imgProps, td);
					break;
				case 'dropdown':
					var params = {value: obj[column.id] || '', autoComplete: false,store: column.dataStore, query:{}};
					if (column.width) 
						params.style = {width: '100%'};
					widget = new dijit.form.ComboBox(params);
					widget.onChange = dojo.hitch(this, 'rowPropChanged', obj, column.id, tr, widget);
					dojo.query('.dijitValidationIcon', widget.domNode).forEach(function(domNode){
						domNode.style.display = 'none';
					});
				  break;
/*
			        case 'gridEditParams':
			          var fieldType = obj.fieldType;

			    var options = [{name: "EditorTextOptions", value: "dojox.grid.cells._Widget"},
					   {name: "EditorNumberOptions", value: "dojox.grid.cells.NumberTextBox"},
					   {name: "EditorCheckboxOptions", value: "dojox.grid.cells.Bool"},
					   {name: "EditorDateOptions", value: "dojox.grid.cells.DateTextBox"},
					   {name: "EditorComboOptions", value: "dojox.grid.cells.ComboTextBox"}];
			    var optionNodes = {};
			    widget = document.createElement("div");
			    widget.className = "optionsField";
			    dojo.forEach(options, function(option) {
				var node = dojo.create("div", {}, widget);
				node.className = option.name;
				node.style.display = option.value == fieldType ? "block" : "none";
				optionNodes[option.name] = node;
			    });


			    var regExpEditor = new dijit.form.TextBox({value: (fieldType == "dojo.grid.cells._Widget") ? v : "",
								       placeHolder: "Optional regular Expression"},
								      dojo.create("div",{},optionNodes.EditorTextOptions));

			    var numberMinNode = dojo.create("div", {},optionNodes.EditorNumberOptions);
			    var numberMinEditor = new dijit.form.TextBox({value: (fieldType == "dojo.grid.cells.Number") ? v : "",
									  placeHolder: "Optional Minimum"},
									 numberMinNode);

			    var numberMaxNode = dojo.create("div", {}, optionNodes.EditorNumberOptions);
			    var numberMaxEditor = new dijit.form.TextBox({value: (fieldType == "dojo.grid.cells.Number") ? v : "",
									  placeHolder: "Optional Maximum"},
									 numberMaxNode);


			    var useDateMinEditor = new dijit.form.NumberTextBox({value: (fieldType == "dojo.grid.cells.DateTextBox") ? v : "",
										 placeHolder: "Min date; days offset from today"},
										dojo.create("div", {}, optionNodes.EditorDateOptions));


			    var staticComboEditor = new dijit.form.TextBox({value: (fieldType == "dojo.grid.cells.ComboBox") ? v : "",
									    placeHolder: "Comma separated options"},
									   dojo.create("div", {}, optionNodes.EditorComboOptions));


			    var variableComboEditor = new dijit.form.ComboBox({value: (fieldType == "dojo.grid.cells.ComboBox") ? v : ""},
									   dojo.create("div", {}, optionNodes.EditorComboOptions));



			    var displayFieldComboEditor = new dijit.form.ComboBox({value: (fieldType == "dojo.grid.cells.ComboBox") ? v : ""},
									   dojo.create("div", {}, optionNodes.EditorComboOptions));


			    var dataFieldComboEditor = new dijit.form.ComboBox({value: (fieldType == "dojo.grid.cells.ComboBox") ? v : ""},
									   dojo.create("div", {}, optionNodes.EditorComboOptions));

			    td.appendChild(widget);
			    widget = null;

				  break;
				  */
				case 'width':
					var w = this.getWidthProps(obj[column.id]);
					var params = {value: w.text, style:'width:40px;height:14px'};
					if (column.readOnly)
						params.readOnly = true;
					var tf = new dijit.form.TextBox(params, dojo.doc.createElement('div'));
					td.appendChild(tf.domNode);

					var params = {value: w.dd || 'px', autoComplete: false, tabIndex:-1, store: this.getWidthStore(), query:{}, style:'width:60px;height:14px'};
					if (column.readOnly)
						params.readOnly = true;
					widget = new dijit.form.FilteringSelect(params);
					dojo.query('.dijitValidationIcon', widget.domNode).forEach(function(domNode){
						domNode.style.display = 'none';
					});

					tf.onChange = dojo.hitch(this, 'widthTextChanged', obj, column.id, tr, tf, widget);
					widget.onChange = dojo.hitch(this, 'widthTypeChanged', obj, column.id, tr, tf, widget);
				  break;
				default:
					// by default we will always paint textbox.
					var params = {value: obj[column.id] || ''};
					if (column.width) 
						params.style = {width: '100%'};
					if (column.readOnly)
						params.readOnly = true;
					widget = new dijit.form.TextBox(params, dojo.doc.createElement('div'));
					widget.onChange = dojo.hitch(this, 'rowPropChanged', obj, column.id, tr, widget);
			}
			
		        if (column.type != 'img' ) {
				if (widget) 
					td.appendChild(widget.domNode);
				else 
					dojo.create('div',{},td);
			}
			
			tr.appendChild(td);
			if (column.isAdvanced){
				this.advancedColumns.push(td);
				if (this.isAdvancedHidden)
					td.style.display = 'none';
			}
		} catch(e) {
			console.info('Error while adding column: ', column, obj, e );
		}
		
		//dojo.connect(widget, 'onChange', dojo.hitch(this, 'rowPropChanged', obj, column.id, tr));
	},
	getWidthProps: function(inValue){
		var props = {text:'auto'};
		if (!inValue)
			return props;

		inValue = inValue.toLowerCase();
		if (inValue.indexOf('p') != -1){
			props.dd = 'px';
		} else if (inValue.indexOf('%') != -1){
			props.dd = '%';
		}

		inValue = inValue.replace(/p|x|%/g, '');
		props.text = inValue;
		return props;
	},
	getWidthStore: function(){
		var arr = [{name:'px', value:'px'}, {name:'%', value:'%'}];
		var data = {identifier: 'value', label: 'name', value: 'value', items: arr};
		return new dojo.data.ItemFileReadStore({data: data});
	},
	paintNewColumnButton: function(){
		if (this.newColumnButton)
			this.newColumnButton.destroy();
		var div = dojo.doc.createElement('div');
		this.innerDomNode.appendChild(div);
		this.newColumnButton = new dijit.form.Button({label: this.addButtonLabel, onClick: dojo.hitch(this, 'addNewColumn'), style:'padding:5px;'});
		this.newColumnButton.placeAt(div);
	},
	addNewColumn: function(){
		var props = dojo.clone(this.newRowDefault);
		var prop2 = this.onAddButtonClick(props);
		if (!prop2)
			prop2 = props;
		this.addNewRow(prop2, this.headerAttr, this.rightClickTBody);
		this.onAddNewColumnSuccess(prop2);
	},
	onAddNewColumnSuccess: function(columnProps){}
});
