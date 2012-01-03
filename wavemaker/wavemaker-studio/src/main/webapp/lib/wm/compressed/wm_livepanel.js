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

dojo.provide("wm.compressed.wm_livepanel");
if(!dojo._hasResource["wm.base.widget.LiveForm"]){
dojo._hasResource["wm.base.widget.LiveForm"]=true;
dojo.provide("wm.base.widget.LiveForm");
wm.getLiveForms=function(_1){
var _2=[];
wm.forEachWidget(_1.root,function(w){
if(wm.isInstanceType(w,wm.LiveForm)){
_2.push(w);
}
});
return _2;
};
wm.getMatchingFormWidgets=function(_3,_4){
var _5=[];
wm.forEach(_3.widgets,function(w){
if(_4(w)){
_5.push(w);
}
if((wm.isInstanceType(w,wm.Container)&&!(wm.isInstanceType(w,wm.LiveFormBase)))){
_5=_5.concat(wm.getMatchingFormWidgets(w,_4));
}
});
return _5;
};
wm.getParentForm=function(_6){
var w=_6.parent;
var r=_6.getRoot();
r=r&&r.root;
while(w&&w!=r){
if(wm.isInstanceType(w,wm.LiveFormBase)){
return w;
}
w=w.parent;
}
};
wm.getFormLiveView=function(_7){
var lv=_7&&_7.getLiveVariable();
return lv&&lv.liveView;
};
wm.getFormField=function(_8){
var a=[],w=_8;
while(w&&!(wm.isInstanceType(w,wm.LiveForm))){
if(w.formField){
a.unshift(w.formField);
}
w=wm.getParentForm(w);
}
return a.join(".");
};
dojo.declare("wm.LiveFormBase",wm.Container,{editorHeight:"26px",editorWidth:"100%",captionSize:"200px",captionAlign:"right",captionPosition:"left",height:"228px",width:"100%",layoutKind:"top-to-bottom",readonly:false,dataSet:null,dataOutput:null,init:function(){
this.dataOutput=new wm.Variable({name:"dataOutput",owner:this});
this.inherited(arguments);
},postInit:function(){
this.inherited(arguments);
this.dataOutput=this.$.dataOutput;
if(wm.pasting){
wm.fire(this,"designPasted");
}
this.populateEditors();
},setDataSet:function(_9){
if(this.parent&&this.parent.operation&&this.editingMode!="lookup"){
return;
}
this.beginEditUpdate();
this.dataSet=_9;
var d=this.getItemData();
this.populateEditors();
this.endEditUpdate();
this.setDataOutput(d);
this.liveFormChanged();
},getSourceId:function(){
try{
return this.components.binding.wires.dataSet.source;
}
catch(e){
}
return "";
},setDataOutput:function(_a){
this.dataOutput.setDataSet(_a);
},clearDataOutput:function(){
dojo.forEach(this.getRelatedEditorsArray(),function(e){
e.clearDataOutput();
});
this.dataOutput.setData({});
},getItemData:function(){
return wm.fire(this.dataSet,"getCursorItem");
},_getDataType:function(){
var t=(this.dataSet||0).type;
if(!wm.typeManager.isStructuredType(t)){
var v=this.getLiveVariable();
t=v&&v.type;
}
if(wm.typeManager.isStructuredType(t)){
return t;
}
},getLiveVariable:function(){
var s=this.dataSet,o=s&&s.owner,ds=null;
o=o&&!(wm.isInstanceType(o,wm.Variable))?o:null;
if(o){
try{
if(wm.isInstanceType(o,wm.DojoGrid)){
ds=o.variable;
}else{
ds=o.dataSet;
}
}
catch(e){
ds=o.dataSet;
}
}
if(o&&ds&&wm.isInstanceType(ds,wm.LiveVariable)){
return ds;
}
while(s){
if(wm.isInstanceType(s,wm.LiveVariable)){
return s;
}
s=s.owner;
if(!(wm.isInstanceType(s.owner,wm.Variable))){
break;
}
}
},beginEditUpdate:function(){
this.dataOutput.beginUpdate();
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"beginEditUpdate");
});
},endEditUpdate:function(){
this.dataOutput.endUpdate();
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"endEditUpdate");
});
},liveFormChanged:function(){
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"doOnchange");
wm.fire(e,"clearDirty");
});
},populateEditors:function(){
var i=this.getItemData(),_b=i?i.getData():null;
dojo.forEach(this.getFormEditorsArray(),dojo.hitch(this,function(e){
if(wm.isInstanceType(e,wm.LiveFormBase)){
if(e.editingMode!="lookup"||!this._operationSucceeded){
wm.fire(e,"populateEditors");
}
}else{
if(wm.isInstanceType(e,wm.Lookup)&&(!e.dataSet||!e.dataSet.type)){
e.setAutoDataSet(e.autoDataSet);
}
wm.fire(e,"setDataValue",[e.formField&&_b?_b[e.formField]:_b]);
}
}));
},updateDataOutputType:function(){
var _c;
if(this.dataSet){
_c=this.dataSet.type;
}else{
var p=this.getParentForm();
var _d=p&&p.dataOutput?p.dataOutput._dataSchema:null;
var _e=_d&&_d[this.formField];
if(_e&&_e.type){
_c=_e.type;
}
}
if(_c&&this.dataOutput.type!=_c){
this.dataOutput.setType(_c);
}
},populateDataOutput:function(){
this.updateDataOutputType();
if(this.dataSet&&this.dataOutput.type!=this.dataSet.type){
this.dataOutput.setType(this.dataSet.type);
}
var d=this.dataOutput;
d.setIsList(false);
dojo.forEach(this.getFormEditorsArray(),dojo.hitch(this,function(e){
if(wm.isInstanceType(e,wm.LiveFormBase)){
wm.fire(e,"populateDataOutput");
}else{
if(e.formField){
d.setValue(e.formField,e.getDataValue());
}else{
if(wm.isInstanceType(this,wm.RelatedEditor)){
d.setData(e.getDataValue());
}
}
}
}));
return this.dataOutput;
},editStarting:function(){
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"editStarting");
});
},editCancelling:function(){
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"editCancelling");
});
},clearData:function(){
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"clear");
});
dojo.forEach(this.getRelatedEditorsArray(),function(e){
wm.fire(e,"clearData");
});
},setDefaultOnInsert:function(){
dojo.forEach(this.getFormEditorsArray(),function(e){
wm.fire(e,"setDefaultOnInsert");
});
},getEditorsArray:function(){
return wm.getMatchingFormWidgets(this,function(w){
return (wm.Editor&&wm.isInstanceType(w,wm.Editor)||wm.isInstanceType(w,wm.AbstractEditor));
});
},getRelatedEditorsArray:function(_f){
return wm.getMatchingFormWidgets(this,function(w){
return (wm.RelatedEditor&&wm.isInstanceType(w,wm.RelatedEditor));
});
},getFormEditorsArray:function(){
return wm.getMatchingFormWidgets(this,function(w){
return (w.formField!==undefined);
});
},_getEditorBindSourceId:function(_10){
var _11=(_10||"").split(".");
_11.pop();
return _11.join(".");
},_getEditorBindSource:function(_12){
var _13=(_12||"").split(".");
_13.pop();
var s=_13.join("."),v=this.getValueById(s);
if(wm.Editor&&wm.isInstanceType(v,wm.Editor)||wm.RelatedEditor&&wm.isInstanceType(v,wm.RelatedEditor)){
return v;
}
},getBoundEditorsArray:function(){
var _14=[];
var _15=this.$.binding.wires;
for(var i in _15){
w=_15[i];
if(!w.targetId&&w.targetProperty.indexOf("dataOutput")==0){
e=this._getEditorBindSource(w.source);
if(e){
_14.push(e);
}
}
}
return _14;
},canChangeEditorReadonly:function(_16,_17,_18){
if(wm.isInstanceType(_16,wm.AbstractEditor)&&_16.ignoreParentReadonly||wm.isInstanceType(_16,wm.RelatedEditor)&&_16.ignoreParentReadonly&&_16.editingMode=="editable subform"){
return false;
}
var c=dojo.isFunction(_18);
return !c||_18(_16,this,_17);
},_setReadonly:function(_19,_1a){
dojo.forEach(this.getFormEditorsArray(),function(e){
if(this.canChangeEditorReadonly(e,_19,_1a)){
e.setReadonly(_19);
}
},this);
dojo.forEach(this.getRelatedEditorsArray(),function(e){
if(this.canChangeEditorReadonly(e,_19,_1a)){
e._setReadonly(_19,_1a);
}
},this);
},setReadonly:function(_1b){
this.readonly=_1b;
this._setReadonly(_1b);
},setCaptionSize:function(_1c){
this.captionSize=_1c;
dojo.forEach(this.getEditorsArray(),function(e){
e.setCaptionSize(_1c);
});
dojo.forEach(this.getRelatedEditorsArray(),function(e){
e.setCaptionSize(_1c);
});
},setCaptionUnits:function(_1d){
this.captionUnits=_1d;
dojo.forEach(this.getEditorsArray(),function(e){
e.setCaptionUnits(_1d);
});
},setCaptionAlign:function(_1e){
this.captionAlign=_1e;
dojo.forEach(this.getEditorsArray(),function(e){
e.setCaptionAlign(_1e);
});
},setCaptionPosition:function(pos){
var _1f=this.captionPosition;
this.captionPosition=pos;
if((_1f=="left"||_1f=="right")&&(pos=="bottom"||pos=="top")){
if(this.editorHeight.match(/px/)&&parseInt(this.editorHeight)<48){
this.editorHeight="48px";
}
this.captionSize="28px";
}else{
if((pos=="left"||pos=="right")&&(_1f=="bottom"||_1f=="top")){
if(this.editorHeight.match(/px/)&&parseInt(this.editorHeight)>=48){
this.editorHeight=wm.AbstractEditor.prototype.height;
}
if(this.captionSize.match(/px/)&&parseInt(this.captionSize)<100){
this.captionSize="100px";
}
}
}
dojo.forEach(this.getEditorsArray(),function(e){
e.setCaptionPositionLF(pos);
});
},setEditorWidth:function(_20){
this.editorWidth=_20;
dojo.forEach(this.getEditorsArray(),function(e){
if(e.parent.horizontalAlign!="justified"){
e.setWidth(_20);
}
});
dojo.forEach(this.getRelatedEditorsArray(),function(e){
e.setWidth(_20);
});
},setEditorHeight:function(_21){
this.editorHeight=_21;
dojo.forEach(this.getEditorsArray(),function(e){
e.setHeight(_21);
});
},valueChanged:function(_22,_23){
if(wm.isInstanceType(this[_22],wm.Variable)){
return;
}else{
this.inherited(arguments);
}
},getViewDataIndex:function(_24){
return _24;
},validateData:function(){
var _25=this.getInvalidWidget();
if(!_25){
return true;
}
app.alert(wm.getDictionaryItem("wm.LiveForm.INVALID_EDITOR",{caption:_25.caption}));
return true;
},getRecordCount:function(){
return wm.fire(this.getDataSource(),"getCount");
},getDataSource:function(){
if(!this._dataSource){
var b=this.$&&this.$.binding,v=(b&&b.wires["dataSet"]||0).source;
this._dataSource=v&&this.getValueById(v);
}
return this._dataSource;
},setRecord:function(_26){
wm.fire(this.getDataSource(),"setCursor",[_26]);
},setNext:function(){
wm.fire(this.getDataSource(),"setNext");
},setPrevious:function(){
wm.fire(this.getDataSource(),"setPrevious");
},setFirst:function(){
wm.fire(this.getDataSource(),"setFirst");
},setLast:function(){
wm.fire(this.getDataSource(),"setLast");
},getIndex:function(){
return (this.getDataSource()||0).cursor||0;
}});
dojo.declare("wm.SimpleForm",wm.LiveFormBase,{});
dojo.declare("wm.LiveForm",wm.LiveFormBase,{saveOnEnterKey:true,alwaysPopulateEditors:false,margin:"0",defaultButton:"",displayErrors:true,liveEditing:true,liveSaving:true,liveVariable:null,liveDataSourceClass:null,confirmDelete:"Are you sure you want to delete this data?",_controlSubForms:false,destroy:function(){
this._cancelOnEnterKey();
this.inherited(arguments);
},init:function(){
this.connect(this.domNode,"keypress",this,"formkeypress");
this.canBeginEdit=this.hasEditableData;
this.inherited(arguments);
},postInit:function(){
this.inherited(arguments);
this.initLiveVariable();
if(String(this.captionSize).search(/\D/)==-1){
this.captionSize+=this.captionUnits;
}
if(String(this.editorSize).search(/\D/)==-1){
this.editorSize+=this.editorSizeUnits;
}
if(this.liveEditing&&!this.isDesignLoaded()){
this.setReadonly(this.readonly);
}
},initLiveVariable:function(){
var lv=this.liveVariable=new wm.LiveVariable({name:"liveVariable",owner:this,liveSource:(this.dataSet||0).type,autoUpdate:false});
this.connect(lv,"onBeforeUpdate",this,"beforeOperation");
this.connect(lv,"onSuccess",this,"operationSucceeded");
this.connect(lv,"onResult",this,"onResult");
this.connect(lv,"onError",this,"onError");
},setLiveEditing:function(_27){
this.liveEditing=_27;
},setDataSet:function(_28){
if(this.dataSet&&this.operation&&!this.alwaysPopulateEditors){
return;
}
if(this.liveVariable&&_28&&_28.type){
this.liveVariable.setLiveSource(_28.type);
}
this._cancelOnEnterKey();
this.inherited(arguments,[_28]);
if(!this.readonly){
wm.getMatchingFormWidgets(this,function(w){
if(wm.isInstanceType(w,wm.Editor)||wm.isInstanceType(w,wm.AbstractEditor)||wm.isInstanceType(w,wm.RelatedEditor)){
w.validate();
}
});
}
},beginDataInsert:function(){
this.clearDataOutput();
this.beginEditUpdate();
this.clearData();
this.endEditUpdate();
this.beginEdit("insert");
this.setDefaultOnInsert();
this.onBeginInsert();
this.validate();
return true;
},beginDataUpdate:function(){
this.beginEdit("update");
this.populatePickList();
this.onBeginUpdate();
return true;
},beginEdit:function(_29){
this.editStarting();
this.operation=_29;
if(this.liveEditing){
if(this.hasLiveService()){
this._setReadonly(false,dojo.hitch(this,"_canChangeEditorReadonly",[_29]));
}else{
this.setReadonly(false);
}
}
},endEdit:function(){
if(this.liveEditing){
this.setReadonly(true);
}
this.operation=null;
},cancelEdit:function(){
this.operation=null;
this.editCancelling();
var d=this.getItemData();
this.beginEditUpdate();
this.dataOutput.setData(d);
this.endEditUpdate();
this.setDataSet(this.dataSet);
this.onCancelEdit();
this.endEdit();
},_canChangeEditorReadonly:function(_2a,_2b,_2c,_2d){
if(wm.isInstanceType(_2b,wm.RelatedEditor)&&_2b.editingMode=="editable subform"&&_2b.ignoreParentReadonly){
return false;
}
if((wm.Editor&&wm.isInstanceType(_2b,wm.Editor)||wm.isInstanceType(_2b,wm.AbstractEditor))&&_2b.formField){
var f=_2b.formField,dt=_2c.dataSet.type,s=wm.typeManager.getTypeSchema(dt),pi=wm.typeManager.getPropertyInfoFromSchema(s,f),ops=_2a;
if(!f){
return true;
}
var _2e=pi&&dojo.some(pi.noChange,function(i){
return (dojo.indexOf(ops,i)>-1);
}),_2f=pi&&dojo.some(pi.exclude,function(i){
return (dojo.indexOf(ops,i)>-1);
});
if(!_2d&&(_2e||_2f)){
return false;
}
}
return true;
},hasLiveService:function(){
return Boolean(wm.typeManager.getLiveService((this.dataSet||0).type));
},hasEditableData:function(){
var v=this.dataOutput;
return !this.liveEditing||(v&&wm.typeManager.getLiveService(v.type)&&wm.data.hasIncludeData(v.type,v.getData()));
},_getDeferredSuccess:function(){
var d=new dojo.Deferred();
d.callback(true);
return d;
},saveDataIfValid:function(){
if(this.getInvalid()){
return;
}
return this.saveData();
},saveData:function(){
if(this.operation=="insert"){
return this.insertData();
}
if(this.operation=="update"){
return this.updateData();
}
},insertData:function(){
return this.doOperation("insert");
},updateData:function(){
return this.doOperation("update");
},deleteData:function(){
var f=dojo.hitch(this,function(){
this.onBeginDelete();
return this.doOperation("delete");
});
if(!this.confirmDelete){
f();
}else{
app.confirm(this.confirmDelete,false,f,dojo.hitch(this,function(){
this.cancelEdit();
}));
}
},doOperation:function(_30){
this.populateDataOutput();
var _31=this.dataOutput.getData();
if(this.liveSaving){
var lv=this.liveVariable;
if(lv.type!=this.dataOutput.type){
lv.setLiveSource(this.dataOutput.type);
}
lv.setOperation(_30);
lv.sourceData.setData(this.dataOutput.getData());
return lv.update();
}else{
switch(this.operation){
case "insert":
this.onInsertData();
break;
case "update":
this.onUpdateData();
break;
case "delete":
this.onDeleteData();
break;
}
this.endEdit();
return this._getDeferredSuccess();
}
},operationSucceeded:function(_32){
if(dojo.isArray(_32)){
_32=_32[0];
}
var op=this.liveVariable.operation;
if(op=="insert"||op=="delete"){
this.dataSet.cursor=0;
}
if(op=="insert"||op=="update"){
var _33=this.getItemData();
this._operationSucceeded=true;
try{
wm.fire(_33,"setData",[_32]);
}
catch(e){
}
delete this._operationSucceeded;
if(_33!=this.dataSet){
wm.fire(this.dataSet,"notify");
}
}
switch(op){
case "insert":
this.onInsertData(_32);
break;
case "update":
this.onUpdateData(_32);
break;
case "delete":
this.beginEditUpdate();
this.clearData();
this.endEditUpdate();
this.onDeleteData(_32);
break;
}
this.onSuccess(_32);
this.endEdit();
},beforeOperation:function(){
this.onBeforeOperation(this.liveVariable.operation);
},getSubFormsArray:function(){
var _34=[],w;
for(var i in this.widgets){
w=this.widgets[i];
if(wm.isInstanceType(w,wm.LiveForm)){
_34.push(w);
_34=_34.concat(w.getSubFormsArray());
}
}
return _34;
},clearData:function(){
this.inherited(arguments);
if(this._controlSubForms){
dojo.forEach(this.getSubFormsArray(),function(f){
f.clearData();
});
}
},_setReadonly:function(_35,_36){
this.inherited(arguments);
if(this._controlSubForms){
dojo.forEach(this.getSubFormsArray(),function(f){
f.setReadonly(_35);
});
}
},forceValidation:function(){
dojo.forEach(this.getEditorsArray(),function(e){
wm.fire(e.editor,"changed");
});
this.validate();
},formkeypress:function(e){
if(e.keyCode==dojo.keys.ENTER&&e.target.tagName!="TEXTAREA"){
this._onEnterKeyHandle=setTimeout(dojo.hitch(this,function(){
this._onEnterKeyHandle=null;
this._doOnEnterKey();
}),50);
}
},_doOnEnterKey:function(){
var d=this.defaultButton;
if(d){
this.forceValidation();
if(!d.disabled){
wm.fire(d,"onclick");
}
}
if(this.saveOnEnterKey){
this.saveDataIfValid();
}
},_cancelOnEnterKey:function(){
if(this._onEnterKeyHandle){
clearTimeout(this._onEnterKeyHandle);
this._onEnterKeyHandle=null;
}
},populatePickList:function(){
var _37={};
var _38=[];
wm.forEach(this.widgets,function(e){
if(e.subType!=null&&e.subType!=undefined&&(e.subType=="picklist"||e.subType=="boolean")){
_38.push(e);
var val=e.getDataValue();
_37[e.formField]=val;
}
});
if(!wm.isEmpty(_37)){
var _39=this.getParentPage();
try{
_39.sforceRuntimeService.requestSync("getPickLists",[this.liveDataSourceClass,_37],dojo.hitch(this,"updatePickList",_38),dojo.hitch(this,"sforceRuntimeServiceError"));
}
catch(e){
console.error("ERROR IN populatePickList: "+e);
}
}
},updatePickList:function(_3a,_3b){
dojo.forEach(_3a,function(e){
if(e.subType=="picklist"){
var _3c=_3b[e.formField];
e.editor.setOptionSet(_3c.options);
e.setDataValue(_3c["default"].dataValue);
}
});
},sforceRuntimeServiceError:function(_3d){
app.alert("sforceRuntimeServiceError error = "+_3d);
},onBeginInsert:function(){
},onInsertData:function(){
},onBeginUpdate:function(){
},onUpdateData:function(){
},onBeginDelete:function(){
},onDeleteData:function(){
},onCancelEdit:function(){
},onBeforeOperation:function(_3e){
},onSuccess:function(_3f){
},onResult:function(_40){
},onError:function(_41){
wm.logging&&console.error(_41);
if(this.displayErrors){
app.alert(wm.getDictionaryItem("wm.LiveForm.ONERROR",{error:dojo.isString(_41)?_41:_41.message||"??"}));
}
}});
}
if(!dojo._hasResource["wm.base.widget.RelatedEditor"]){
dojo._hasResource["wm.base.widget.RelatedEditor"]=true;
dojo.provide("wm.base.widget.RelatedEditor");
dojo.declare("wm.RelatedEditor",wm.LiveFormBase,{ignoreParentReadonly:true,height:"26px",editingMode:"lookup",_lookupCache:null,canChangeEditorReadonly:function(_42,_43,_44){
var m=this.editingMode;
switch(m){
case "readonly":
if(this.parent&&this.parent.operation&&this.parent.operation=="insert"){
return _43||((_42==this.findLookup()&&this.inherited(arguments)));
}else{
return _43;
}
case "lookup":
return _43||((_42==this.findLookup()&&this.inherited(arguments)));
default:
return this.inherited(arguments);
}
},findLookup:function(){
var _45=this.getFormEditorsArray();
for(var i=0,e;(e=_45[i]);i++){
if(wm.Lookup&&(e.display=="Lookup"||e instanceof wm.Lookup)){
return e;
}
}
},getLiveVariable:function(){
var f=this._getLiveForm();
return f&&f.getLiveVariable();
},_getLiveForm:function(){
var p=wm.getParentForm(this);
while(p&&!(wm.isInstanceType(p,wm.LiveForm))){
p=wm.getParentForm(p);
}
return p;
},_getRelativeFormField:function(_46){
var _47=wm.getFormField(this)+".";
if(_46.indexOf(_47)==0){
return _46.substring(_47.length);
}
},getViewDataIndex:function(_48){
var r=wm.getFormField(this);
return (r?r+".":"")+_48;
},validate:function(){
this.inherited(arguments);
wm.fire(this.parent,"validate");
},editStarting:function(){
if(this.editingMode=="lookup"){
this._lookupCache=this.dataOutput.getData();
}
this.inherited(arguments);
},editCancelling:function(){
if(this.editingMode=="lookup"&&this._lookupCache!==undefined){
this.dataSet.beginUpdate();
this.dataSet.setData(this._lookupCache);
this.dataSet.endUpdate();
this._lookupCache=undefined;
}
this.inherited(arguments);
}});
}
if(!dojo._hasResource["wm.base.widget.LivePanel"]){
dojo._hasResource["wm.base.widget.LivePanel"]=true;
dojo.provide("wm.base.widget.LivePanel");
dojo.declare("wm.LivePanel",wm.Panel,{height:"100%",width:"100%",layoutKind:"top-to-bottom",liveDataName:"",autoScroll:true,popupLiveFormSuccess:function(){
this.dialog.hide();
this.dataGrid.getDataSet().update();
},popupLivePanelEdit:function(){
this.liveForm.beginDataUpdate();
dojo.forEach(this.liveForm.getFormEditorsArray(),dojo.hitch(this.liveForm,function(e){
if(e.ignoreParentReadonly){
return;
}
if(this._canChangeEditorReadonly(["update"],e,this,false)){
if(e.readonly){
e.setReadonly(false);
}
}else{
if(!e.readonly){
e.setReadonly(true);
}
}
}));
this.dialog.show();
},popupLivePanelInsert:function(){
this.liveForm.beginDataInsert();
dojo.forEach(this.liveForm.getFormEditorsArray(),dojo.hitch(this.liveForm,function(e){
if(e.ignoreParentReadonly){
return;
}
if(this._canChangeEditorReadonly(["insert"],e,this,false)){
if(e.readonly){
e.setReadonly(false);
}
}else{
if(!e.readonly){
e.setReadonly(true);
}
}
}));
this.dialog.show();
}});
}
if(!dojo._hasResource["wm.base.widget.DataNavigator"]){
dojo._hasResource["wm.base.widget.DataNavigator"]=true;
dojo.provide("wm.base.widget.DataNavigator");
dojo.declare("wm.DataNavigator",wm.Panel,{classNames:"wmdatanavigator",box:"h",lock:true,byPage:true,border:0,height:"36px",_buttonWidth:"46px",layoutKind:"left-to-right",horizontalAlign:"right",verticalAlign:"middle",liveSource:"",init:function(){
this.inherited(arguments);
this.createNavComponents();
this.connectNavComponents();
},createNavComponents:function(){
this.readComponents(this.getTemplate());
dojo.mixin(this,this.widgets);
},connectNavComponents:function(){
this.connect(this.firstButton,"onclick",this,"setFirst");
this.connect(this.prevButton,"onclick",this,"setPrevious");
this.connect(this.nextButton,"onclick",this,"setNext");
this.connect(this.lastButton,"onclick",this,"setLast");
this.connect(this.recordEditor,"onchange",this,"recordEdited");
},getTemplate:function(){
return ["{","firstButton: [\"wm.Button\", {caption: \"&nbsp&laquo;&nbsp;\", width: \"",this._buttonWidth,"\", height: \"100%\"}, {}],","prevButton: [\"wm.Button\", {caption: \"&nbsp&lt;&nbsp;\", width: \"",this._buttonWidth,"\", height: \"100%\"}, {}],","recordEditor: [\"wm.Number\", {caption: \"\", width: \"65px\", margin: 4, height: \"100%\"}],","totalLabel: [\"wm.Label\", {caption: \"/ 0\", width: \"50px\", border: 0, height: \"100%\"}, {}, {","format: [\"wm.DataFormatter\", {}, {}]","}],","nextButton: [\"wm.Button\", {caption: \"&nbsp&gt;&nbsp;\", width: \"",this._buttonWidth,"\", height: \"100%\"}, {}],","lastButton: [\"wm.Button\", {caption: \"&nbsp&raquo;&nbsp;\", width: \"",this._buttonWidth,"\", height: \"100%\"}, {}]","}"].join("");
},setFirst:function(){
wm.fire(this.liveSource,this.byPage?"setFirstPage":"setFirst");
this.update();
},setPrevious:function(){
wm.fire(this.liveSource,this.byPage?"setPreviousPage":"setPrevious");
this.update();
},setNext:function(){
wm.fire(this.liveSource,this.byPage?"setNextPage":"setNext");
this.update();
},setLast:function(){
wm.fire(this.liveSource,this.byPage?"setLastPage":"setLast");
this.update();
},recordEdited:function(){
var r=this.recordEditor;
if(r.isValid()&&!this._updating){
wm.fire(this.liveSource,this.byPage?"setPage":"setCursor",[this.recordEditor.getValue("dataValue")-1]);
}
this._updating=false;
},update:function(_49){
var ls=this.liveSource;
if(!ls){
return;
}
var c=(this.byPage?ls.getPage():ls.cursor)+1,d=this.liveSource.getCursorItem().getData(),t=(this.byPage?ls.getTotalPages():ls.getCount())||1;
r=this.recordEditor;
this._updating=c!=r.getValue("dataValue");
if(c>t){
c=t;
}
r.setValue("dataValue",c);
this.totalLabel.setValue("caption","/ "+t);
this._doSetRecord(d,c);
},setLiveSource:function(_4a){
var s=_4a;
if(dojo.isString(s)&&s){
this.components.binding.addWire("","liveSource",s);
return;
}
s=wm.isInstanceType(s,wm.LiveForm)||wm.isInstanceType(s,wm.DataForm)?s.dataSet:s;
if(s instanceof wm.LiveVariable){
this.liveSource=s;
this.connect(this.liveSource,"onSuccess",this,"update");
this.update();
}else{
this.liveSource="";
}
},getLiveSource:function(){
return this.liveSource&&this.liveSource.getId();
},setLiveForm:function(_4b){
this.setLiveSource(_4b);
},_doSetRecord:function(_4c,_4d){
if(_4d!=this._lastRecord){
this.onsetrecord(_4c,_4d);
}
this._lastRecord=_4d;
},onsetrecord:function(_4e,_4f){
},adjustChildProps:function(_50,_51){
this.inherited(arguments);
dojo.mixin(_51,{owner:this});
}});
}
