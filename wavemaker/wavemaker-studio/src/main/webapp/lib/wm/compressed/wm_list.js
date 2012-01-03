/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

dojo.provide("wm.compressed.wm_list");
if(!dojo._hasResource["wm.base.widget.VirtualList"]){
dojo._hasResource["wm.base.widget.VirtualList"]=true;
dojo.provide("wm.base.widget.VirtualList");
dojo.declare("wm.VirtualListItem",null,{selected:false,className:"wmlist-item",constructor:function(_1,_2,_3){
this.list=_1;
this.connections=[];
this.create();
this.setContent(_2,_3);
},destroy:function(){
dojo.forEach(this.connections,function(_4){
dojo.disconnect(_4);
});
},create:function(){
var n=this.domNode=document.createElement("div");
dojo.addClass(n,this.className);
this.makeConnections();
},makeConnections:function(){
this.connections=[dojo.connect(this.domNode,"mouseover",this,"mouseover"),dojo.connect(this.domNode,"mouseout",this,"mouseout"),dojo.connect(this.domNode,"click",this,function(_5){
wm.onidle(this,"click",_5);
}),dojo.connect(this.domNode,"dblclick",this,function(_6){
wm.onidle(this,"dblclick",_6);
})];
},setContent:function(_7){
this.domNode.innerHTML=_7;
},getContent:function(){
return this.domNode.innerHTML;
},doOver:function(){
dojo.addClass(this.domNode,this.className+"-over");
},mouseover:function(e){
if(e&&e.currentTarget==this.domNode){
this.list._onmouseover(e,this);
}
},mouseout:function(e){
if(e.currentTarget==this.domNode){
dojo.removeClass(this.domNode,this.className+"-over");
}
},click:function(e){
this.list.onclick(e,this);
},dblclick:function(e){
this.list.ondblclick(e,this);
},select:function(){
this.selected=true;
dojo.addClass(this.domNode,this.className+"-selected");
},deselect:function(){
this.selected=false;
dojo.removeClass(this.domNode,this.className+"-selected");
}});
dojo.declare("wm.VirtualList",wm.Control,{headerVisible:true,toggleSelect:false,width:"250px",height:"150px",box:"v",multiSelect:false,className:"wmlist",selectedItem:null,init:function(){
this.inherited(arguments);
this.items=[];
this.selection=[];
this.selectedItem=new wm.Variable({name:"selectedItem",owner:this});
this.createHeaderNode();
this.createListNode();
this.domNode.appendChild(this.headerNode);
this.domNode.appendChild(this.listNode);
this.setHeaderVisible(this.headerVisible);
if(app._touchEnabled){
wm.conditionalRequire("lib.github.touchscroll.touchscroll");
this._listTouchScroll=new TouchScroll(this.listNode,{owner:this});
this.listNode=this._listTouchScroll.scrollers.inner;
this._listTouchScroll.scrollers.outer.style.position="absolute";
this._listTouchScroll.scrollers.outer.style.left="0px";
this._listTouchScroll.scrollers.outer.style.top="0px";
}
},dataSetToSelectedItem:function(_8){
this.selectedItem.setLiveView((_8||0).liveView);
this.selectedItem.setType(_8?_8.type:"any");
},getCount:function(){
return this.items.length;
},getItem:function(_9){
return this.items[_9];
},getItemByCallback:function(_a){
for(var i=0;i<this.getCount();i++){
var d=this.items[i].getData();
if(_a(d)){
return this.items[i];
}
}
},getItemByFieldName:function(_b,_c){
for(var i=0;i<this.getCount();i++){
var d=this.items[i].getData();
if(d[_b]==_c){
return this.items[i];
}
}
},createListNode:function(){
this.listNode=document.createElement("div");
this.listNode.flex=1;
dojo.addClass(this.listNode,"wmlist-list");
},createHeaderNode:function(){
this.headerNode=document.createElement("div");
dojo.addClass(this.headerNode,"wmlist-header");
},renderBounds:function(){
this.inherited(arguments);
if(this.headerVisible&&!this.isAncestorHidden()){
wm.job(this.getRuntimeId()+"ListRenderBounds",1,dojo.hitch(this,"renderListBounds"));
}
},renderListBounds:function(){
var _d=dojo.marginBox(this.headerNode);
if(_d.h==0&&!this.isAncestorHidden()){
return wm.job(this.getRuntimeId()+"ListRenderBounds",1,dojo.hitch(this,"renderListBounds"));
}
var _e=this.getContentBounds().h-_d.h;
if(!this._listTouchScroll){
this.listNode.style.height=_e+"px";
}else{
this._listTouchScroll.scrollers.outer.parentNode.height=_e+"px";
}
if(this._listTouchScroll){
var b=this.getContentBounds();
this._listTouchScroll.scrollers.outer.style.width=b.w+"px";
this._listTouchScroll.scrollers.outer.style.height=(b.h-_d.h)+"px";
this._listTouchScroll.scrollers.outer.style.top=_d.h+"px";
if(this.updateHeaderWidth){
this.updateHeaderWidth();
}
}
},clear:function(){
this._setHeaderVisible(false);
while(this.getCount()){
this.removeItem(this.getCount()-1);
}
this.deselectAll();
this._setSelected(null);
},createItem:function(_f){
return new wm.VirtualListItem(this,_f);
},addItem:function(_10,_11){
var li=this.createItem(_10),ln=this.listNode;
dojo.setSelectable(li.domNode,false);
if(_11!=undefined){
this.items.splice(_11,0,li);
li.index=_11;
this.selection.splice(_11,0,false);
this.updateItemIndexes(_11+1,1);
var _12=ln.childNodes[_11];
if(_12){
ln.insertBefore(li.domNode,ln.childNodes[_11]);
}else{
ln.appendChild(li.domNode);
}
}else{
this.items.push(li);
li.index=this.items.length-1;
ln.appendChild(li.domNode);
}
},removeItem:function(_13){
var li=this.getItem(_13);
if(li){
this.listNode.removeChild(li.domNode);
this.items.splice(_13,1);
this.selection.splice(_13,1);
this.updateItemIndexes(_13,-1);
li.destroy();
}
},updateItemIndexes:function(_14,_15){
for(var i=_14,l=this.getCount(),li;i<l&&(li=this.items[i]);i++){
li.index+=_15;
}
},removeItems:function(_16){
for(var i=_16.length,_17;((_17=_16[i])!=undefined);i--){
this.removeItem(_17);
}
},modifyItem:function(_18,_19){
var li=this.getItem(_18);
(li?li.setContent(_19):this.addItem(_19));
},renderHeader:function(_1a){
this.headerNode.innerHTML=_1a;
},_setHeaderVisible:function(_1b){
this.headerNode.style.display=_1b?"":"none";
},setHeaderVisible:function(_1c){
this.headerVisible=_1c;
if(this.getCount()){
if(this.headerVisible){
this.renderHeader();
}
this._setHeaderVisible(this.headerVisible);
this.reflow();
}
},_setSelected:function(_1d){
this.selected=_1d;
if(this.selected){
this.selectedItem.setData(this.selected);
}else{
this.selectedItem.clearData();
}
},addToSelection:function(_1e){
if(!_1e){
return;
}
this.selection[_1e.index]=true;
this.lastSelected=this.selected;
this._setSelected(_1e);
_1e.select();
},removeFromSelection:function(_1f){
this.selection[_1f.index]=false;
_1f.deselect();
this._setSelected(this.lastSelected);
},deselectAll:function(_20){
dojo.forEach(this.items,function(i){
i.deselect();
});
this.selection=[];
if(!_20){
this._setSelected(null);
this.onSelectionChange();
}
},isSelected:function(_21){
return this.selection[_21.index];
},ctrlSelect:function(_22){
if(this.isSelected(_22)){
this.eventDeselect(_22);
}else{
this.eventSelect(_22);
}
},shiftSelect:function(_23){
var t=s=(this.selected||this.lastSelected||0).index,e=_23.index,t;
this.deselectAll();
if(s>e){
s=e;
e=t;
}
for(var i=s,li;i<=e&&(li=this.getItem(i));i++){
this.addToSelection(li);
}
},clickSelect:function(_24,_25){
if(this.multiSelect&&(_25.ctrlKey||_25.shiftKey)){
if(_25.ctrlKey){
this.ctrlSelect(_24);
}else{
if(_25.shiftKey){
this.shiftSelect(_24);
}
}
}else{
if(this.multiSelect){
if(dojo.indexOf(this.selected,_24.index)==-1){
this.addToSelection(_24);
}else{
this.removeFromSelection(_24);
}
}else{
var s=this.selected,_26=s&&s.index,_27=_24.index;
if(_26!==_27){
this.eventDeselect(_24,true);
this.eventSelect(_24);
}else{
if(this.toggleSelect){
this.eventDeselect(_24);
}
}
}
}
},eventDeselect:function(_28,_29){
if(this.multiSelect){
this.removeFromSelection(_28);
}else{
this.deselectAll(_29);
}
if(!_29){
this.ondeselect(_28);
this.onSelectionChange();
}
},eventSelect:function(_2a){
var _2b={canSelect:true};
this._oncanselect(_2a,_2b);
if(_2b.canSelect){
this.addToSelection(_2a);
this.onselect(_2a);
this.onSelectionChange();
}
},select:function(_2c){
if(_2c){
this.deselectAll();
this.addToSelection(_2c);
}
},selectByIndex:function(_2d){
var i=this.getItem(_2d);
if(i){
this.select(i);
}
},getSelectedIndex:function(){
return this.selected?this.selected.index:-1;
},_oncanmouseover:function(_2e,_2f,_30){
},onclick:function(_31,_32){
this.clickSelect(_32,_31);
},ondblclick:function(_33,_34){
},onSelectionChange:function(){
},onselect:function(_35){
},ondeselect:function(_36){
},_oncanselect:function(_37,_38){
},_onmouseover:function(_39,_3a){
var _3b={canMouseOver:true};
this._oncanmouseover(_39,_3a,_3b);
if(_3b.canMouseOver){
_3a.doOver();
}
}});
}
if(!dojo._hasResource["wm.base.widget.Table.builder"]){
dojo._hasResource["wm.base.widget.Table.builder"]=true;
dojo.provide("wm.base.widget.Table.builder");
wm.getTr=function(_3c,_3d){
return _3c&&((_3c.rows||0)[_3d]||_3c.childNodes[_3d]);
};
wm.getTd=function(_3e,_3f,_40){
return (wm.getTr(_3e,_3f)||0).childNodes[_40];
};
dojo.declare("wm.table.builder",null,{rowCount:0,colCount:0,constructor:function(_41,_42,_43){
this.className=_41||"";
this.rowClassName=_42||"";
this.columnClassName=_43||"";
},_table:["<table class=\"","","\" cellspacing=\"0\" cellpadding=\"0\">"],generateCell:function(_44,_45,_46){
var tag=(_46?"th":"td");
var _47=["<",tag," "];
var s=this.getCellStyle&&this.getCellStyle(_44,_45);
var c=this.getCellClass&&this.getCellClass(_44,_45);
c=(c?c+" ":"")+this.columnClassName;
s&&_47.push([" style=\"",s,"\""].join(""));
c&&_47.push([" class=\"",c,"\""].join(""));
_47.push(">");
_47.push(this.getCellContent(_44,_45,_46));
_47.push("</"+tag+">");
return _47.join("");
},generateRow:function(_48,_49){
var s=(this.getRowStyle)&&this.getRowStyle(_48),c=this.rowClassName||((this.getRowClass)&&this.getRowClass(_48));
var _4a=["<tr"," style=\"",s,"\" class=\"",c,"\">"];
for(var i=0,l=this.colCount;i<l;i++){
_4a.push(this.generateCell(_48,i,_49));
}
_4a.push("</tr>");
return _4a.join("");
},generateTableStart:function(){
var _4b=this._table.concat([]);
_4b[1]=this.className;
return _4b.join("");
},generateTableEnd:function(){
return "</table>";
},generateHtml:function(){
result=[this.generateTableStart()];
for(var i=0,l=this.rowCount;i<l;i++){
result.push(this.generateRow(i));
}
result.push(this.generateTableEnd());
return result.join("");
},generateHeaderHtml:function(){
result=[this.generateTableStart()];
result.push(this.generateRow(-1,true));
result.push(this.generateTableEnd());
return result.join("");
},generateEmptyTable:function(){
return [this.generateTableStart(),this.generateTableEnd()].join("");
}});
}
if(!dojo._hasResource["wm.base.widget.List"]){
dojo._hasResource["wm.base.widget.List"]=true;
dojo.provide("wm.base.widget.List");
dojo.declare("wm.ListItem",wm.VirtualListItem,{create:function(){
this.inherited(arguments);
dojo.addClass(this.domNode,"wmlist-item");
},format:function(_4c,_4d){
this.list.inSetContent=true;
var _4e=(this.list.format?this.list.format(_4d,_4c):_4c);
delete this.list.inSetContent;
return _4e;
},setContent:function(_4f,_50){
var f=this.format(_4f,this.index);
this.inherited(arguments,[f]);
this._data=this.getData();
},getData:function(){
return this.list.getItemData(this.index);
},update:function(){
var _51=this.format(this.getData(),this.index);
this.domNode.innerHTML=_51;
},getColumnFromNode:function(_52){
if(_52){
while(_52.tagName!="TD"){
_52=_52.parentNode;
}
var td=_52,tr=_52.parentNode;
for(var i=0,c;(c=tr.childNodes[i]);i++){
if(c==td){
return i;
}
}
}
return -1;
}});
wm.Object.extendSchema(wm.ListItem,{getData:{group:"method",returns:"Object"}});
dojo.declare("wm.List",wm.VirtualList,{query:{},width:"100%",height:"200px",minWidth:150,minHeight:60,autoScroll:false,constructor:function(){
this._data=[];
},columnWidths:"",dataFields:"",classNames:"wmlist",columns:"",_columnsHash:"",setColumns:function(_53){
this.columns=_53;
this._columnsHash={};
for(var i=0;i<this.columns.length;i++){
var _54=this.columns[i];
this._columnsHash[_54.field]=_54;
}
},init:function(){
if(this.columns){
this.setColumns(this.columns);
}
this.inherited(arguments);
this.createSelectedItem();
this.createBuilder();
if(!this.columns&&this.columnWidths&&this.dataFields.split(",").length!=this.columnWidths.split(",").length){
console.error("Column width count does not match field list count");
}
this._setDataFields(this.dataFields);
this.setColumnWidths(this.columnWidths);
this._render();
this.domNode.onboundschange=dojo.hitch(this,"updateHeaderWidth");
},createSelectedItem:function(){
this.selectedItem=new wm.Variable({name:"selectedItem",owner:this});
},createBuilder:function(){
this.builder=new wm.table.builder(this.className+"-table",this.className+"-row",this.className+"-cell");
this.builder.getCellContent=dojo.hitch(this,"getCellContent");
this.builder.getCellStyle=dojo.hitch(this,"getCellStyle");
this.builder.getCellClass=dojo.hitch(this,"getCellClass");
},createItem:function(_55){
return new wm.ListItem(this,_55);
},_setSelected:function(_56){
this.selected=_56;
var d=this.selected?this.selected.getData():{},s=this.selectedItem;
if(dojo.isObject(d)&&!wm.typeManager.getType(s.type)){
s.setDataSchema(d);
}
if(this.selected&&dojo.isObject(d)){
s.setData(d);
}else{
s.clearData();
}
this.setValue("emptySelection",Boolean(!this.selected));
},getEmptySelection:function(){
return Boolean(!this.selected);
},hasSelection:function(){
return Boolean(this.selected);
},_setDataFields:function(_57){
if(this.columns){
this._dataFields=[];
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].show){
this._dataFields.push(this.columns[i].field);
}
}
}else{
var d=this.dataFields=_57||"";
if(d){
var s=d.split(","),d=[];
for(var i=0,v,f;(f=s[i]);i++){
v=dojo.trim(f);
if(v){
d.push(v);
}
}
}else{
var _58=(this.dataSet||0)._dataSchema;
if(_58){
var d=[];
for(var i in _58){
var ti=_58[i];
if(!(ti||0).isList&&!wm.typeManager.isStructuredType((ti||0).type)){
d.push(i);
}
}
}else{
var row=this._data;
if(dojo.isArray(row)){
row=row[0];
}
if(dojo.isObject(row)&&!dojo.isArray(row)){
d=[];
for(var i in row){
if(!dojo.isObject(row[i])){
d.push(dojo.trim(i));
}
}
}
}
}
this.trimDataSetObjectFields(d);
this._dataFields=d;
}
},getDataSetObjectFields:function(){
var o={};
if(!this.dataSet){
return o;
}
var t=this.dataSet.type,tt=wm.typeManager.getTypeSchema(t)||{};
for(var i in tt){
if(wm.typeManager.isStructuredType(tt[i])){
o[i]=tt[i];
}
}
return o;
},trimDataSetObjectFields:function(_59){
var f=this.getDataSetObjectFields();
for(var i in f){
for(var j=0,df;(df=_59[j]);j++){
if(df==i){
_59.splice(j,1);
break;
}
}
}
},setDataFields:function(_5a){
this._setDataFields(_5a);
this._render();
},setColumnWidths:function(_5b){
var c=this.columnWidths=_5b;
this._columnWidths=dojo.isArray(c)?c:c.split(",");
this._render();
},shouldShowHeader:function(){
var _5c=this._dataFields&&this.getCount();
return (this.headerVisible&&(_5c||this._headerContent));
},getHeaderContent:function(){
return this._headerContent||this.builder.generateHeaderHtml();
},renderHeader:function(){
var s=this.shouldShowHeader();
this._setHeaderVisible(s);
if(s){
this.headerNode.innerHTML=this.getHeaderContent();
this.updateHeaderWidth();
}
},updateHeaderWidth:function(){
var f=this.items&&this.items[0];
var n=f&&f.domNode.firstChild;
var b=n&&dojo.marginBox(n);
if(b&&this.headerNode.firstChild&&b.w){
dojo.marginBox(this.headerNode.firstChild,{w:b.w});
}
},_render:function(){
this.renderData(this._data);
},clear:function(){
this._data=null;
this.inherited(arguments);
},getDataItemCount:function(){
return this._data.length;
},canSetDataSet:function(_5d){
return Boolean(_5d&&_5d.isList);
},setDataSet:function(_5e){
try{
if(!this.canSetDataSet(_5e)){
this.dataSet="";
}else{
this.dataSet=_5e;
}
var t=(_5e||0).type||"AnyData";
this.setSelectedItemType(t);
this.dataSetToSelectedItem(_5e);
this.onsetdata(this.dataSet);
this.renderDataSet(this.dataSet);
}
catch(e){
alert(e.toString());
}
},setSelectedItemType:function(_5f){
this.selectedItem.setType(_5f);
},update:function(){
var ds=this.getValueById((this.components.binding.wires["dataSet"]||0).source);
wm.fire(ds,"update");
},renderDataSet:function(_60){
if(this.isAncestorHidden()&&!this._renderHiddenGrid){
this._renderDojoObjSkipped=true;
return;
}
this._renderDojoObjSkipped=false;
var d=_60 instanceof wm.Variable?_60.getData():[];
d=this.runQuery(d);
this.renderData(d);
},_onShowParent:function(){
if(this._renderDojoObjSkipped){
this.renderDataSet(this.dataSet);
}
},renderData:function(_61){
this.clear();
this._data=_61;
if(!this.dataFields){
this._setDataFields();
}
this.updateBuilder();
if(!this._data){
return;
}
for(var i=0,l=this.getDataItemCount();i<l;i++){
this.addItem(this.getItemData(i),i);
}
this.renderHeader();
dojo.query(".wmlist-item:nth-child(odd)",this.domNode).addClass("Odd");
this.reflow();
if(this._listTouchScroll){
wm.job(this.getRuntimeId()+"ListSetupScroller",1,dojo.hitch(this._listTouchScroll,"setupScroller"));
}
},runQuery:function(_62){
if(wm.isEmpty(this.query)){
return _62;
}else{
var _63=[];
for(var i=0;i<_62.length;i++){
var d=_62[i];
var w="*";
var _64=true;
for(var key in this.query){
var a=d[key];
if(dojo.isString(a)){
a=a.replace(/\\([^\\])/g,"$1");
}
var b=this.query[key];
if(dojo.isString(b)){
b=b.replace(/\\([^\\])/g,"$1");
}
if(b==w){
continue;
}
if(dojo.isString(a)&&dojo.isString(b)){
if(b.charAt(b.length-1)==w){
b=b.slice(0,-1);
}
a=a.toLowerCase();
b=b.toLowerCase();
if(a.indexOf(b)!=0){
_64=false;
break;
}
}else{
if(a!==b){
_64=false;
break;
}
}
}
if(_64){
_63.push(d);
}
}
return _63;
}
},getHeading:function(_65){
if(this.columns){
var _66=this._columnsHash[_65];
var _67=_66.title;
return _67==null?"":_67;
}else{
var d=this._dataSource;
var s=d&&d.schema||0;
var si=s[_65]||0;
if(si.label){
return wm.capitalize(si.label);
}else{
var _68=_65.replace(/^.*\./,"");
return wm.capitalize(_68);
}
}
},getItemData:function(_69){
return this._data[_69];
},getCellContent:function(_6a,_6b,_6c){
var _6d=this._dataFields&&this._dataFields[_6b];
var _6e;
var i=this._formatIndex!=null?this._formatIndex:this.getCount();
if(_6c){
_6e="<div>"+this.getHeading(_6d);
}else{
if(this.columns){
var _6f=this._data[i];
_6e=_6f[_6d];
_6e=this.formatCell(_6d,_6e,_6f,i,_6b);
}
}
if(_6e==undefined){
var d=this.getItemData(i);
f=wm.decapitalize(_6d);
_6e=_6d?d[_6d]:d;
}
var _70={column:_6b,data:_6e,header:_6c};
this.onformat(_70,_6b,_6e,_6c,_6f);
if(!this.inSetContent){
this._formatIndex=null;
}
return _70.data;
},getColWidth:function(_71){
if(this.columns){
return this.columns[_71].width;
}else{
var c=this._columnWidths;
return c&&(c[_71]!=undefined)?c[_71]:Math.round(100/this.builder.colCount)+"%";
}
},getCellStyle:function(_72,_73){
if(this.columns){
var _74=[];
var col=this.columns[_73];
var _75=col.align;
if(_72!=-1){
_72=this._formatIndex!=null?this._formatIndex:this.getCount();
var _76=this._data[_72];
if(col.backgroundColor){
var _77=wm.expression.getValue(col.backgroundColor,_76,this.owner);
if(_77){
_74.push("background-color:"+_77);
}
}
if(col.textColor){
var _78=wm.expression.getValue(col.textColor,_76,this.owner);
if(_78){
_74.push("color:"+_78);
}
}
}
var _79=this.getColWidth(_73);
if(_79){
_74.push("width:"+_79);
}
if(_75){
_74.push("text-align:"+_75);
}
return _74.join(";");
}else{
return "width: "+this.getColWidth(_73)+";";
}
},updateBuilder:function(){
this.builder.colCount=this._dataFields?this._dataFields.length:1;
this.builder.rowCount=1;
},format:function(_7a,_7b){
this._formatIndex=_7a;
return this.builder.generateHtml(_7b);
},onformat:function(_7c,_7d,_7e,_7f,_80){
},onsetdata:function(_81){
}});
wm.List.extend({formatCell:function(_82,_83,_84,_85,_86){
if(!this._columnsHash){
return _83;
}else{
var col=this._columnsHash[_82];
var _87="";
if(col.expression){
try{
_87=wm.expression.getValue(col.expression,_84,this.owner);
}
catch(e){
}
}else{
_87=_83;
}
if(col.formatFunc){
switch(col.formatFunc){
case "wm_date_formatter":
case "Date (WaveMaker)":
_87=this.dateFormatter(col.formatProps||{},_87);
break;
case "wm_localdate_formatter":
case "Local Date (WaveMaker)":
_87=this.localDateFormatter(col.formatProps||{},_87);
break;
case "wm_time_formatter":
case "Time (WaveMaker)":
_87=this.timeFormatter(col.formatProps||{},_87);
break;
case "wm_number_formatter":
case "Number (WaveMaker)":
_87=this.numberFormatter(col.formatProps||{},_87);
break;
case "wm_currency_formatter":
case "Currency (WaveMaker)":
_87=this.currencyFormatter(col.formatProps||{},_87);
break;
case "wm_image_formatter":
case "Image (WaveMaker)":
_87=this.imageFormatter(col.formatProps||{},_87);
break;
case "wm_link_formatter":
case "Link (WaveMaker)":
_87=this.linkFormatter(col.formatProps||{},_87);
break;
case "wm_button_formatter":
_87=this.buttonFormatter(_82,col.formatProps||{},_85,_87);
break;
default:
if(!this.isDesignLoaded()){
if(this.owner[col.formatFunc]){
_87=dojo.hitch(this.owner,col.formatFunc)(_87,_85,_86,_82,{},_84);
}
}else{
_87="<i>runtime only...</i>";
}
break;
}
}
return _87;
}
},dateFormatter:function(_88,_89){
if(!_89){
return _89;
}else{
if(typeof _89=="number"){
_89=new Date(_89);
}else{
if(_89 instanceof Date==false){
return _89;
}
}
}
if(!_88.useLocalTime){
_89.setHours(_89.getHours()+wm.timezoneOffset);
}
var _8a={selector:_88.dateType||"date",formatLength:_88.formatLength||"short",locale:dojo.locale,datePattern:_88.datePattern,timePattern:_88.timePattern};
return dojo.date.locale.format(_89,_8a);
},numberFormatter:function(_8b,_8c){
var _8d={places:_8b.dijits||0,round:_8b.round?0:-1,type:_8b.numberType};
return dojo.number.format(_8c,_8d);
},currencyFormatter:function(_8e,_8f){
return dojo.currency.format(_8f,{currency:_8e.currency||(this._isDesignLoaded?studio.application.currencyLocale:app.currencyLocale)||wm.getLocaleCurrency(),places:_8e.dijits==undefined?2:_8e.dijits,round:_8e.round?0:-1});
},imageFormatter:function(_90,_91){
if(_91&&_91!=""){
var _92=_90.width?" width=\""+_90.width+"px\"":"";
var _93=_90.height?" height=\""+_90.height+"px\"":"";
if(_90.prefix){
_91=_90.prefix+_91;
}
if(_90.postfix){
_91=_91+_90.postfix;
}
return "<img "+_92+_93+" src=\""+_91+"\">";
}
return "";
},linkFormatter:function(_94,_95){
if(_95&&_95!=""){
var _96=String(_95);
var _97=String(_95);
if(_94.prefix){
_97=_94.prefix+_97;
}
if(_94.postfix){
_97=_97+_94.postfix;
}
var _98=_94.target||"_NewWindow";
if(_97.indexOf("://")==-1&&_97.charAt(0)!="/"){
_97="http://"+_97;
}
return "<a href=\""+_97+"\" target=\""+_98+"\">"+_96+"</a>";
}
return _95;
},buttonFormatter:function(_99,_9a,_9b,_9c){
if(_9c&&_9c!=""){
var _9d=_9a.buttonclass?" class=\""+_9a.buttonclass+"\" ":" class=\"wmbutton\" ";
var _9e="onclick='"+this.getRuntimeId()+".gridButtonClicked(\""+_99+"\","+_9b+")' ";
return "<button "+_9e+_9a.buttonclick+"\" style=\"width:94%;display:inline-block\" "+_9d+">"+_9c+"</button>";
}
return _9c;
},gridButtonClicked:function(_9f,_a0){
var _a1=this._data[_a0];
this.onGridButtonClick(_9f,_a1,_a0);
},onGridButtonClick:function(_a2,_a3,_a4){
},select:function(_a5){
if(typeof _a5!="object"){
this.eventSelect(this.items[_a5]);
}else{
this.inherited(arguments);
}
},getRow:function(_a6){
return this._data[_a6];
},findRowIndexByFieldValue:function(_a7,_a8){
var _a9;
for(var i=0;i<this._data.length;i++){
_a9=this._data[i];
if(_a9[_a7]===_a8){
return i;
}
}
return -1;
},getCell:function(_aa,_ab){
var row=this._data[_aa];
if(row){
return row[_ab];
}
return "";
},setCell:function(_ac,_ad,_ae,_af){
var _b0=this.dataSet.getItem(_ac);
_b0.beginUpdate();
_b0.setValue(_ad,_ae);
_b0.endUpdate();
var row=this._data[_ac];
if(row){
row[_ad]=_ae;
if(!_af){
this.items[_ac].setContent(row);
}
}
},deleteRow:function(_b1){
this.dataSet.removeItem(_b1);
this._render();
},getRowCount:function(){
return this.items.length;
},addRow:function(_b2,_b3){
if(this.getRowCount()==0&&this.variable){
this.dataSet.setData([_b2]);
if(_b3){
this.select(0);
this.selectionChange();
}
return;
}
var _b4=dojo.clone(_b2);
var v=new wm.Variable({type:this.dataSet.type});
v.setData(_b4);
this.dataSet.addItem(v,0);
this.dataSet.getItem(0).data._new=true;
if(_b3||_b3===undefined){
this.select(0);
}
},addEmptyRow:function(_b5){
var obj={};
var _b6=false;
for(var i=0;i<this.columns.length;i++){
var _b7=this.columns[i];
var _b8=_b7.field||_b7.id;
var _b9=_b8.split(".");
var _ba=this.dataSet.type;
var _bb=wm.typeManager.getType(_ba);
for(var _bc=0;_bc<_b9.length;_bc++){
if(_bb&&_bb.fields){
var _bd=_bb.fields[_b9[_bc]];
if(_bd){
_ba=_bb.fields[_b9[_bc]].type;
_bb=wm.typeManager.getType(_ba);
}else{
_bb="java.lang.String";
}
}
}
var _be=null;
switch(_ba){
case "java.lang.Integer":
case "java.lang.Double":
case "java.lang.Float":
case "java.lang.Short":
_be=0;
break;
case "java.lang.Date":
_be=new Date().getTime();
_b6=true;
break;
case "java.lang.Boolean":
_be=false;
break;
default:
_be="";
_b6=true;
}
var _bf=obj;
for(var _bc=0;_bc<_b9.length;_bc++){
if(_bc+1<_b9.length){
if(!_bf[_b9[_bc]]){
_bf[_b9[_bc]]={};
}
_bf=_bf[_b9[_bc]];
}else{
_bf[_b9[_bc]]=_be;
}
}
}
this.addRow(obj,_b5);
},getDataSet:function(){
return this.dataSet;
},setSortIndex:function(){
console.warn("setSortIndex not implemented for wm.List");
},setSortField:function(){
console.warn("setSortField not implemented for wm.List");
},setQuery:function(_c0){
this.query=_c0;
this.renderDataSet(this.dataSet);
},getColumnIndex:function(_c1){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].field==_c1){
return i;
}
}
return -1;
},getColumnShowing:function(_c2,_c3,_c4){
var _c5=this.getColumnIndex(_c2);
if(_c5!=-1){
return this.columns[_c5].show;
}
},setColumnShowing:function(_c6,_c7,_c8){
var _c9=this.getColumnIndex(_c6);
if(_c9!=-1&&this.columns[_c9].show!=_c7){
this.columns[_c9].show=_c7;
this.setColumns(this.columns);
this._setDataFields();
if(!_c8){
this._render();
}
}
},setColumnWidth:function(_ca,_cb,_cc){
this._columnsHash[_ca].width=_cb;
if(!_cc){
this._render();
}
},getCellClass:function(_cd,_ce){
if(!this.columns){
return;
}
if(_cd!=-1){
_cd=this._formatIndex!=null?this._formatIndex:this.getCount();
var col=this.columns[_ce];
var _cf=this._data[_cd];
if(col.cssClass){
return wm.expression.getValue(col.cssClass,_cf,this.owner);
}
}
return "";
},});
if(wm.isMobile){
wm.DojoGrid=wm.List;
}
wm.FocusablePanelRegistry=[];
dojo.declare("wm.FocusableList",wm.List,{init:function(){
this.inherited(arguments);
wm.FocusablePanelRegistry.push(this);
dojo.connect(document,"keydown",this,"keydown");
},nextFocus:null,nextFocusableItemField:null,priorFocus:null,hasFocus:false,focusOnStart:false,focusEventTime:0,defaultFocusListIndex:0,getNextFocus:function(){
if(!(this.nextFocus instanceof Object)){
this.setNextFocus(this.nextFocus);
}
return this.nextFocus;
},setNextFocus:function(_d0){
if(!(_d0 instanceof Object)){
var tmp=this.getRoot()[_d0];
this.nextFocus=tmp||this.nextFocus;
}else{
this.nextFocus=_d0;
}
},getPriorFocus:function(){
if(!(this.priorFocus instanceof Object)){
this.setPriorFocus(this.priorFocus);
}
return this.priorFocus;
},setPriorFocus:function(_d1){
if(!(_d1 instanceof Object)){
this.priorFocus=this.getRoot()[_d1];
}else{
this.priorFocus=_d1;
}
},setFocus:function(_d2,e){
this.focusEventTime=(e)?e.timeStamp:0;
this.hasFocus=_d2;
if(_d2){
this.show();
dojo.addClass(this.domNode,"wmselectedlist");
this.setBorderColor("rgb(0,0,160)");
for(var i=0;i<wm.FocusablePanelRegistry.length;i++){
if(wm.FocusablePanelRegistry[i]!=this){
wm.FocusablePanelRegistry[i].setFocus(false,e);
}
}
if(this.getSelectedIndex()==-1){
this.deselectAll(true);
if(this.defaultFocusListIndex!=-1){
this.eventSelect(this.getItem(this.defaultFocusListIndex));
}
}
if(this.getNextFocus() instanceof Object){
this.getNextFocus().show();
}
}else{
dojo.removeClass(this.domNode,"wmselectedlist");
this.setBorderColor("transparent");
}
},show:function(){
this.inherited(arguments);
var _d3=this.parent;
while(_d3&&!(_d3 instanceof wm.Layer)){
_d3=_d3.parent;
}
if(this.autoShowLayer){
if(_d3&&(_d3 instanceof wm.Layer)&&!_d3.active){
_d3.parent.setLayer(_d3);
}
}
},onclick:function(_d4,_d5){
this.inherited(arguments);
this.setFocus(true,_d4);
},eventSelect:function(_d6){
if(this.nextFocusableItemField){
var _d7=_d6.getData();
var _d8=new wm.Object();
_d8.data=_d7;
var _d9=_d8.getValue("data."+this.nextFocusableItemField);
if(_d9){
this.setNextFocus(_d9);
if(this.getNextFocus() instanceof Object){
this.getNextFocus().show();
}
}
}
this.inherited(arguments);
},keydown:function(e){
if(e.target&&e.target.nodeName.toLowerCase()=="input"){
return;
}
if(!this.hasFocus||this.focusEventTime==e.timeStamp){
return;
}
if(e.ctrlKey||e.shiftKey){
return;
}
if(e.keyCode==dojo.keys.UP_ARROW){
var _da=this.getSelectedIndex();
_da=_da-1;
if(_da<0){
_da=this.getCount()+_da;
}
_da=_da%this.getCount();
this.deselectAll(true);
this.eventSelect(this.getItem(_da));
dojo.stopEvent(e);
}else{
if(e.keyCode==dojo.keys.DOWN_ARROW){
var _da=this.getSelectedIndex();
_da=(_da+1)%this.getCount();
this.deselectAll(true);
this.eventSelect(this.getItem(_da));
dojo.stopEvent(e);
}else{
if(e.keyCode==dojo.keys.RIGHT_ARROW&&this.nextFocus){
this.getNextFocus().setFocus(true,e);
dojo.stopEvent(e);
}else{
if(e.keyCode==dojo.keys.LEFT_ARROW&&this.priorFocus){
this.deselectAll();
this.getPriorFocus().setFocus(true,e);
dojo.stopEvent(e);
if(this.nextFocus){
this.getNextFocus().hideNextChain();
}
}
}
}
}
},setDataSet:function(_db){
this.inherited(arguments);
if(this.focusOnStart){
this.setFocus(true,0);
window.focus();
}
this.focusOnStart=false;
},hideNextChain:function(){
this.hide();
if(this.nextFocus){
this.getNextFocus().hideNextChain();
}
}});
dojo.declare("wm.FocusablePanel",wm.Container,{init:function(){
this.inherited(arguments);
wm.FocusablePanelRegistry.push(this);
dojo.connect(document,"keydown",this,"keydown");
dojo.connect(this.domNode,"click",this,"onclick");
if(this.focusOnStart){
this.setFocus(true,0);
}
},autoShowLayer:false,autoFormFocus:null,nextFocus:null,priorFocus:null,hasFocus:false,focusOnStart:false,focusEventTime:0,getNextFocus:function(){
if(!(this.nextFocus instanceof Object)){
this.setNextFocus(this.nextFocus);
}
return this.nextFocus;
},setNextFocus:function(_dc){
if(!(_dc instanceof Object)){
var tmp=this.getRoot()[_dc];
this.nextFocus=tmp||this.nextFocus;
}else{
this.nextFocus=_dc;
}
},getPriorFocus:function(){
if(!(this.priorFocus instanceof Object)){
this.setPriorFocus(this.priorFocus);
}
return this.priorFocus;
},setPriorFocus:function(_dd){
if(!(this.priorFocus instanceof Object)){
this.priorFocus=this.getRoot()[_dd];
}else{
this.priorFocus=_dd;
}
},setFocus:function(_de,e){
this.focusEventTime=e.timeStamp;
this.hasFocus=_de;
if(_de){
this.show();
this.setBorderColor("rgb(0,0,160)");
if(this.autoFormFocus){
this.getRoot()[this.autoFormFocus].focus();
}
for(var i=0;i<wm.FocusablePanelRegistry.length;i++){
if(wm.FocusablePanelRegistry[i]!=this){
wm.FocusablePanelRegistry[i].setFocus(false,e);
}
}
if(this.getNextFocus() instanceof Object){
this.getNextFocus().show();
}
}else{
this.setBorderColor("transparent");
}
},show:function(){
this.inherited(arguments);
var _df=this.parent;
while(_df&&!(_df instanceof wm.Layer)){
_df=_df.parent;
}
if(this.autoShowLayer){
if(_df&&(_df instanceof wm.Layer)&&!_df.active){
_df.parent.setLayer(_df);
}
}
},onclick:function(_e0,_e1){
this.inherited(arguments);
this.setFocus(true,_e0);
},keydown:function(e){
if(e.target&&e.target.nodeName.toLowerCase()=="input"){
return;
}
if(!this.hasFocus||this.focusEventTime==e.timeStamp){
return;
}
if(e.ctrlKey||e.shiftKey){
return;
}
if(e.keyCode==dojo.keys.RIGHT_ARROW&&this.nextFocus){
this.getNextFocus().setFocus(true,e);
dojo.stopEvent(e);
}else{
if(e.keyCode==dojo.keys.LEFT_ARROW&&this.priorFocus){
this.getPriorFocus().setFocus(true,e);
dojo.stopEvent(e);
if(this.nextFocus){
this.getNextFocus().hideNextChain();
}
}else{
if(e.keyCode==dojo.keys.ENTER||e.keyCode==dojo.keys.NUMPAD_ENTER){
this.ondblclick({},this.selectedItem);
}
}
}
},hideNextChain:function(){
this.hide();
if(this.nextFocus){
this.getNextFocus().hideNextChain();
}
}});
}
