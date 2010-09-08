dojo.provide("wm.base.widget.ContextMenuDialog");

dojo.declare("wm.ContextMenuDialog", null, {
	constructor: function(dialogTitle, addButtonLabel, onAddButtonClick, headerAttr, dataSet, newRowDefault, domNode, addDeleteColumn, helpText){
		this.helpText = helpText;
		this.dialogTitle = dialogTitle;
		this.addButtonLabel = addButtonLabel;
		this.dataSet = dataSet;
		this.onAddButtonClick = onAddButtonClick;
		this.newRowDefault = newRowDefault;
		this.addDeleteColumn = addDeleteColumn;
		this.headerAttr = headerAttr;
		this.trObjMap = {};
		this.trId = 0;
		this.deleteButtonProps = {id:'deleteButton', title: ' ',width:'', type:'img', label:'Delete', src:'images/delete_24.png', width:'20px'};
		dojo.connect(domNode, "oncontextmenu", this, "show");
	},
	show: function(e){
		if (!this.menu)
			this.createRightClickMenu();
		this.menu.show();
		if (e)
			dojo.stopEvent(e);
	},
	hide: function(){
		this.menu.hide();
	},
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
		if (!this.menu)
			return this.dataSet;
			
		var arr = [];
		for (var tr in this.trObjMap){
			arr.push(this.trObjMap[tr]);
		}
		
		return arr;
	},

	rowPropChanged: function(obj, columnId, trObj, inValue){
		if (columnId == 'deleteButton' && this.addDeleteColumn){
			this.deleteRow(obj, columnId, trObj, inValue);
			return;
		}
		
		obj[columnId] = inValue;
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
		this.menu = new dijit.Dialog({title:this.dialogTitle},dojo.doc.createElement('div'));
		if (this.helpText){
			dojo.create('div', {innerHTML:this.helpText, style:'padding-left:5px;margin:5px;background:#FFF1A8;border:1px solid #DCDCDC;'}, this.menu.containerNode);
		}
		
		this.createMenuHTML(this.headerAttr, this.dataSet);
	},
	createMenuHTML: function(headerAttr, rows){
		this.menuTable = dojo.doc.createElement('table');
		this.menuTable.style.display = 'none';
		var thead = dojo.doc.createElement('thead');
		this.menuTable.appendChild(thead);
		var tr = dojo.doc.createElement('tr');
		dojo.attr(tr, 'style', 'background-color:#DCDCDC');
		thead.appendChild(tr);
		dojo.forEach(headerAttr, function(attr){
			this.addHeaderColumn(tr, attr);
		}, this);

		if (this.addDeleteColumn){
			this.addHeaderColumn(tr, this.deleteButtonProps);
		}

		this.rightClickTBody = dojo.doc.createElement('tbody');
		this.menuTable.appendChild(this.rightClickTBody);
		this.menu.containerNode.appendChild(this.menuTable);
		
		dojo.forEach(rows, function(row){
			this.addNewRow(row, headerAttr, this.rightClickTBody);
		}, this);

		this.paintNewColumnButton();
	},
	addHeaderColumn: function(tr, attr){
		var td = dojo.doc.createElement('td');
		dojo.attr(td,'width',attr.width);
		dojo.attr(td,'align','center');
		td.innerHTML = attr.title;
		tr.appendChild(td);
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
			var td = dojo.doc.createElement('td');
			var widget = null;
			switch(column.type){
				case 'checkbox':
					dojo.attr(td,'align','center');
					var params = {'onChange':dojo.hitch(this, 'rowPropChanged', obj, column.id, tr)};
					if (obj[column.id])
						params.checked = true;
					widget = new dijit.form.CheckBox(params, dojo.doc.createElement('div'));
					break;
				case 'button':
					widget = new dijit.form.Button({label: column.label, onClick: dojo.hitch(this, 'rowPropChanged', obj, column.id, tr), style:'padding:0px;'});
					break;
				case 'img':
					var src = column.src;
					if (column.id == 'deleteButton' && obj.noDelete){
						dojo.create('div', {}, td);
						break;
					}
					
					var imgProps = {src: src, onclick: dojo.hitch(this, 'rowPropChanged', obj, column.id, tr)};
					if (column.width)
						imgProps.width = column.width;
					if (column.height)
						imgProps.height = column.height;
						
					widget = dojo.create('img', imgProps, td);
					break;
				case 'dropdown':
					var params = {value: obj[column.id] || '', autoComplete: false,store: column.dataStore, onChange: dojo.hitch(this, 'rowPropChanged', obj, column.id, tr), query:{}};
					widget = new dijit.form.FilteringSelect(params);
				  	break;
				default:
					// by default we will always paint textbox.
					var params = {value: obj[column.id] || '', 'onChange':dojo.hitch(this, 'rowPropChanged', obj, column.id, tr)};
					if (column.width) 
						params.style = {width: '100%'};
					if (column.readOnly)
						params.readOnly = true;
					widget = new dijit.form.TextBox(params, dojo.doc.createElement('div'));
			}
			
			if (column.type != 'img') {
				if (widget) 
					td.appendChild(widget.domNode);
				else 
					dojo.create('div',{},td);
			}
			
			tr.appendChild(td);
		} catch(e) {
			console.info('Error while adding column: ', column, obj, e );
		}
		
		//dojo.connect(widget, 'onChange', dojo.hitch(this, 'rowPropChanged', obj, column.id, tr));
	},
	paintNewColumnButton: function(){
		if (this.newColumnButton)
			this.newColumnButton.destroy();
		var div = dojo.doc.createElement('div');
		this.menu.containerNode.appendChild(div);
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
