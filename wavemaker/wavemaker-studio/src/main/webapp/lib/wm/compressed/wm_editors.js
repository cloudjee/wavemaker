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

dojo.provide("wm.compressed.wm_editors");
if(!dojo._hasResource["wm.base.lib.text"]){
dojo._hasResource["wm.base.lib.text"]=true;
dojo.provide("wm.base.lib.text");
wm.textSizePoll=function(_1,_2,_3){
var f=document.createElement("div");
with(f.style){
top="0px";
left="0px";
position="absolute";
visibility="hidden";
}
f.innerHTML="TheQuickBrownFoxJumpedOverTheLazyDogNotDojo";
document.body.appendChild(f);
var fw=f.offsetWidth;
var _4=function(){
if(f.offsetWidth!=fw){
fw=f.offsetWidth;
dojo.publish("wm-textsizechange");
}
};
window.setInterval(_4,_3||2000);
wm.textSizePoll=function(){
};
};
dojo.addOnLoad(wm.textSizePoll);
}
if(!dojo._hasResource["wm.base.widget.Editor"]){
dojo._hasResource["wm.base.widget.Editor"]=true;
dojo.provide("wm.base.widget.Editor");
wm.editors=["Text","Date","Time","DateTime","Number","Currency","SelectMenu","Checkbox","TextArea","RadioButton","Lookup","Slider"];
wm.getEditor=function(_5){
var c=_5||"Text";
if(c.slice(0,5)!="wm"){
c="wm._"+c+"Editor";
}
return dojo.getObject(c)||wm._BaseEditor;
};
wm.getDataSet=function(_6){
var w=_6;
while(w&&!w.dataSet){
w=w.parent;
}
if(w&&w.dataSet){
return w.dataSet;
}
};
wm.getEditorType=function(_7){
var t=wm.typeManager.getPrimitiveType(_7)||_7;
var _8={Boolean:"CheckBox"};
if(t in _8){
t=_8[t];
}
return dojo.indexOf(wm.editors,t)!=-1?t:"Text";
};
wm.getFieldEditorProps=function(_9){
var f=_9,_a={caption:f.caption||wm.capitalize(f.name),display:wm.getEditorType(f.displayType||f.type),readonly:f.readonly,editorInitProps:{required:f.required},required:f.required,subType:f.subType};
if(_a.display=="CheckBox"){
_a.editorInitProps.dataType="boolean";
_a.displayValue=true;
_a.emptyValue="false";
}else{
if(_a.display=="Date"){
_a.dateMode="Date";
}
}
return _a;
};
wm.createFieldEditor=function(_b,_c,_d,_e,_f){
var _10=dojo.mixin({},wm.getFieldEditorProps(_c),_d);
var _11=wm.getValidJsName(_10.name||"editor1");
return _b.owner.loadComponent(_11,_b,_f||"wm.Editor",_10,_e);
};
wm.updateFieldEditorProps=function(_12,_13){
var e=_12,_14=wm.getFieldEditorProps(_13),_15=_14.editorInitProps;
delete _14.formField;
delete _14.editorInitProps;
for(var i in _14){
e.setProp(i,_14[i]);
}
for(var i in _15){
e.editor.setProp(i,_15[i]);
}
};
dojo.declare("wm.Editor",wm.Container,{height:"24px",width:"150px",padding:2,displayValue:"",saveDisplayValue:false,dataValue:null,horizontalAlign:"justified",verticalAlign:"justified",emptyValue:"unset",caption:"",lock:true,box:"h",captionSize:"50%",resizeToFit:"(Resize to Fit)",captionUnits:"flex",captionAlign:"right",captionPosition:"left",singleLine:true,display:"Text",readonly:false,subType:"",_updating:0,editingProps:{displayValue:1,dataValue:1,groupValue:1},init:function(){
this.inherited(arguments);
this.createCaption();
},postInit:function(){
this.startTimer("Editor.postInit",this.declaredClass);
this.startTimer("Editor.super.postInit",this.declaredClass);
this.inherited(arguments);
this.stopTimer("Editor.super.postInit",this.declaredClass);
this.startTimer("Editor.Misc.postInit",this.declaredClass);
if(String(this.captionSize).search(/\D/)==-1){
this.captionSize+=this.captionUnits;
}
var su=wm.splitUnits(this.captionSize);
if(su.units=="flex"){
this.captionSize=(su.value*10)+"%";
}
if(!this.$.editor){
this.setDisplay(this.display);
}else{
this.editor=this.$.editor;
}
wm.fire(this.editor,"ownerLoaded");
if(this.captionPosition!="left"){
this.setCaptionPosition(this.captionPosition);
}
this.stopTimer("Editor.Misc.postInit",this.declaredClass);
this.startTimer("editorChanged",this.declaredClass);
this.editorChanged();
this.stopTimer("editorChanged",this.declaredClass);
this.stopTimer("Editor.postInit",this.declaredClass);
},setDomNode:function(_16){
this.inherited(arguments);
dojo.addClass(this.domNode,"wmeditor");
},createCaption:function(){
var cs=String(this.captionSize);
var _17={domNode:["wmeditor-caption"].concat(this._classes.captionNode)};
this.captionLabel=new wm.Label({parent:this,width:cs,height:cs,_classes:_17,singleLine:this.singleLine,caption:this.caption,showing:Boolean(this.caption),margin:"0,4,0,0",border:0,owner:this});
this.setCaptionAlign(this.captionAlign);
},getRequiredHtml:function(){
var e=this.editor;
if(!e){
e=this.$.editor;
}
return !this.readonly&&e&&e.required?"&nbsp;<span class=\"wmeditor-required\">*</span>":"";
},setDisplay:function(_18){
this.display=_18;
var e=this.editor||this.$.editor;
if(e){
e.destroy();
this.editor=null;
}
this.createEditor();
this.reflow();
},createEditor:function(){
var _19=wm.getEditor(this.display);
var _1a=dojo.mixin({name:"editor",owner:this,parent:this,border:0,readonly:this.readonly},this.editorInitProps||{});
this.editor=new _19(_1a);
this._editor=this.editor.editor;
},setDisplayValue:function(_1b){
this.displayValue=_1b;
wm.fire(this.editor,"setDisplayValue",[_1b]);
},getDisplayValue:function(){
var v=this.getEditorIsReady()?this.editor.getDisplayValue():this.displayValue;
return (v===null||v===undefined||v===false)?"":v;
},getEditorIsReady:function(){
return this.editor&&this.editor.isReady();
},getDataValue:function(){
return this.getEditorIsReady()?this.editor.getEditorValue():this.dataValue;
},_getReadonlyValue:function(){
var v=this.editor&&this.editor._getReadonlyValue();
return v===undefined?"":v;
},setDataValue:function(_1c){
if(_1c===undefined){
_1c=null;
}
this.dataValue=_1c instanceof wm.Variable?_1c.getData():_1c;
wm.fire(this.editor,"setEditorValue",[_1c]);
},setCaption:function(_1d){
var c=this.caption;
this.caption=_1d;
this.captionLabel.setCaption(this.caption+this.getRequiredHtml());
this.captionLabel.setShowing(Boolean(this.caption));
if(Boolean(c)!=Boolean(this.caption)){
this.renderControls();
}
},setCaptionSize:function(_1e){
this.captionLabel[this.layoutKind=="top-to-bottom"?"setHeight":"setWidth"](this.captionSize=_1e);
this.reflow();
},setCaptionAlign:function(_1f){
this.captionAlign=_1f;
this.captionLabel.setAlign(this.captionAlign);
},setCaptionPosition:function(_20){
var cp=this.captionPosition=_20;
this.removeControl(this.captionLabel);
this.insertControl(this.captionLabel,(cp=="top"||cp=="left")?0:1);
this.setLayoutKind((cp=="top"||cp=="bottom")?"top-to-bottom":"left-to-right");
this.setCaptionSize(this.captionSize);
},setSingleLine:function(_21){
this.singleLine=_21;
this.captionLabel.setSingleLine(_21);
},setDisabled:function(_22){
var d=this.disabled;
this.inherited(arguments);
if(d!=this.disabled){
this.updateDisabled();
}
},updateDisabled:function(){
dojo[this.disabled?"addClass":"removeClass"](this.captionLabel.domNode,"wmeditor-caption-disabled");
wm.fire(this.editor,"setDisabled",[this.disabled]);
},setReadonly:function(_23){
var r=this.readonly;
this.readonly=_23;
if(r!=this.readonly){
this.setCaption(this.caption);
}
wm.fire(this.editor,"setReadonly",[_23]);
},setRequired:function(_24){
wm.fire(this.editor,"setRequired",[_24]);
},requireChanged:function(){
this.setCaption(this.caption);
},getInvalid:function(){
return wm.fire(this.editor,"getInvalid");
},isValid:function(){
return !this.getInvalid();
},validate:function(_25){
wm.fire(this.parent,"validate");
this.valueChanged("invalid",this.getInvalid());
},getGroupValue:function(){
var e=this.editor;
return wm.fire(e,"getGroupValue");
},setGroupValue:function(_26){
this.groupValue=_26;
var e=this.editor;
wm.fire(e,"setGroupValue",[_26]);
},getCheckedValue:function(){
return this.getDisplayValue();
},setCheckedValue:function(_27){
this.setDisplayValue(_27);
},editorChanged:function(){
this.valueChanged("displayValue",this.displayValue=this.getDisplayValue());
this.valueChanged("dataValue",this.dataValue=this.getDataValue());
wm.fire(this.editor,"ownerEditorChanged");
},isUpdating:function(){
return this._updating>0;
},beginEditUpdate:function(_28){
this._updating++;
},endEditUpdate:function(_29){
this._updating--;
},valueChanged:function(_2a,_2b){
if(this._updating){
return;
}
this.inherited(arguments);
},setValueAsEmpty:function(){
this.setDataValue(dojo.hitch(this.editor,"makeEmptyValue")());
},clear:function(){
this.dataValue=null;
this.beginEditUpdate();
wm.fire(this.editor,"clear");
this.endEditUpdate();
this.editorChanged();
},update:function(){
return wm.fire(this.editor,"update");
},canFocus:function(){
return !this.readonly;
},focus:function(){
this.editor.focus();
},doOnchange:function(){
this.editorChanged();
var e=this.editor;
if(!this._loading&&!this.isUpdating()&&!this.readonly&&e&&!e.isLoading()){
this.onchange(this.getDisplayValue(),this.getDataValue());
}
},doOnblur:function(){
if(!this.disabled){
this.onblur();
}
},doOnfocus:function(){
if(!this.disabled){
this.onfocus();
}
},onchange:function(_2c,_2d){
},onfocus:function(){
},onblur:function(){
}});
wm.Editor.description="A general purpose editor.";
wm.Editor.extend({themeable:false,scrim:true,listProperties:function(){
var e=this.editor,_2e=dojo.mixin({},this.inherited(arguments),e?e.listOwnerProperties():{}),f=wm.getParentForm(this);
_2e.formField.ignoretmp=!Boolean(f);
_2e.displayValue.readonly=this.formField&&!this.saveDisplayValue;
_2e.saveDisplayValue.ignoretmp=!this.formField;
return _2e;
},afterPaletteDrop:function(){
this.setCaption(this.name);
},set_formField:function(_2f){
if(!_2f){
delete this.formField;
}else{
this.formField=_2f;
}
var f=wm.getParentForm(this);
if(f){
var _30=f.addEditorToForm(this);
}
},resizeLabel:function(){
var _31=dojo.doc.createElement("span");
_31.style.padding="5px";
_31.innerHTML=this.captionLabel.caption;
document.body.appendChild(_31);
var _32=dojo.coords(_31);
var _33=_32.w;
_31.parentNode.removeChild(_31);
this.setCaptionSize("50%");
var _34=_33*4;
this.setWidth(_34+"px");
if(this.isDesignLoaded()&&studio.designer.selected==this){
setTimeout(dojo.hitch(studio.inspector,"reinspect"),100);
}
},makePropEdit:function(_35,_36,_37){
switch(_35){
case "formField":
return new wm.prop.FormFieldSelect(_37);
case "display":
return new wm.SelectMenu(dojo.mixin(_37,{options:wm.editors}));
}
return this.inherited(arguments);
},resizeToFit:function(){
this.resizeLabel();
},writeChildren:function(_38,_39,_3a){
var s=this.inherited(arguments);
s.push(this.editor.write(_39,_3a));
return s;
},addUserClass:function(_3b,_3c){
this.inherited(arguments);
if(_3c=="captionNode"){
this.captionLabel.addUserClass(_3b,"domNode");
}
},removeUserClass:function(_3d,_3e){
this.inherited(arguments);
if(_3e=="captionNode"){
this.captionLabel.removeUserClass(_3d,"domNode");
}
}});
wm.FormEditor=wm.Editor;
dojo.declare("wm.TextEditor",wm.Editor,{});
dojo.declare("wm.DateEditor",wm.Editor,{display:"Date"});
dojo.declare("wm.TimeEditor",wm.Editor,{display:"Time"});
dojo.declare("wm.NumberEditor",wm.Editor,{display:"Number"});
dojo.declare("wm.CurrencyEditor",wm.Editor,{display:"Currency"});
dojo.declare("wm.SelectEditor",wm.Editor,{display:"Select"});
dojo.declare("wm.CheckBoxEditor",wm.Editor,{displayValue:1,display:"CheckBox",getChecked:function(){
return this.editor.getChecked();
},setChecked:function(_3f){
this.editor.setChecked(_3f);
}});
dojo.declare("wm.TextAreaEditor",wm.Editor,{display:"TextArea"});
wm.TextAreaEditor.extend({});
dojo.declare("wm.RadioButtonEditor",wm.Editor,{displayValue:1,display:"RadioButton"});
dojo.declare("wm.LookupEditor",wm.Editor,{display:"Lookup"});
dojo.declare("wm.SliderEditor",wm.Editor,{display:"Slider"});
wm.Object.extendSchema(wm.Editor,{disabled:{bindTarget:true,type:"Boolean",group:"common",order:40},formField:{group:"common",order:500},singleLine:{group:"display",order:200},box:{ignore:1},horizontalAlign:{ignore:1},verticalAlign:{ignore:1},layoutKind:{ignore:1},fitToContent:{ignore:1},scrollX:{ignore:1},scrollY:{ignore:1},lock:{ignore:1},imageList:{ignore:1},caption:{bindable:1,group:"display",type:"String",order:0,focus:1},readonly:{bindable:1,type:"Boolean",group:"display",order:5},captionSize:{group:"display",order:200,editor:"wm.prop.SizeEditor"},captionUnits:{ignore:1},captionAlign:{group:"display",order:210,options:["left","center","right"]},captionPosition:{group:"display",order:220,options:["top","left","bottom","right"]},display:{group:"editor",subgroup:"value",order:20},editor:{readonly:1,group:"editor",subgroup:"Sub Editor",editor:"wm.prop.SubComponentEditor"},displayValue:{bindable:1,group:"editor",subgroup:"value",order:40,type:"any"},dataValue:{ignore:1,bindable:1,group:"editor",order:45,simpleBindProp:true},emptyValue:{group:"editor",subgroup:"value",order:50,options:["unset","null","emptyString","false","zero"]},invalid:{ignore:1,bindSource:1,type:"boolean"},groupValue:{ignore:1},selectedItem:{ignore:1},resizeToFit:{group:"layout",order:200,operation:1},captionStyles:{ignore:1,categoryParent:"Styles",categoryProps:{content:"caption",nodeName:"captionNode",nodeClass:"wmeditor-caption"}}});
}
if(!dojo._hasResource["dijit._Container"]){
dojo._hasResource["dijit._Container"]=true;
dojo.provide("dijit._Container");
dojo.declare("dijit._Container",null,{isContainer:true,buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_40,_41){
var _42=this.containerNode;
if(_41&&typeof _41=="number"){
var _43=this.getChildren();
if(_43&&_43.length>=_41){
_42=_43[_41-1].domNode;
_41="after";
}
}
dojo.place(_40.domNode,_42,_41);
if(this._started&&!_40._started){
_40.startup();
}
},removeChild:function(_44){
if(typeof _44=="number"){
_44=this.getChildren()[_44];
}
if(_44){
var _45=_44.domNode;
if(_45&&_45.parentNode){
_45.parentNode.removeChild(_45);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},destroyDescendants:function(_46){
dojo.forEach(this.getChildren(),function(_47){
_47.destroyRecursive(_46);
});
},_getSiblingOfChild:function(_48,dir){
var _49=_48.domNode,_4a=(dir>0?"nextSibling":"previousSibling");
do{
_49=_49[_4a];
}while(_49&&(_49.nodeType!=1||!dijit.byNode(_49)));
return _49&&dijit.byNode(_49);
},getIndexOfChild:function(_4b){
return dojo.indexOf(this.getChildren(),_4b);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_4c){
_4c.startup();
});
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dojo.dnd.move"]){
dojo._hasResource["dojo.dnd.move"]=true;
dojo.provide("dojo.dnd.move");
dojo.declare("dojo.dnd.move.constrainedMoveable",dojo.dnd.Moveable,{constraints:function(){
},within:false,markupFactory:function(_4d,_4e){
return new dojo.dnd.move.constrainedMoveable(_4e,_4d);
},constructor:function(_4f,_50){
if(!_50){
_50={};
}
this.constraints=_50.constraints;
this.within=_50.within;
},onFirstMove:function(_51){
var c=this.constraintBox=this.constraints.call(this,_51);
c.r=c.l+c.w;
c.b=c.t+c.h;
if(this.within){
var mb=dojo._getMarginSize(_51.node);
c.r-=mb.w;
c.b-=mb.h;
}
},onMove:function(_52,_53){
var c=this.constraintBox,s=_52.node.style;
this.onMoving(_52,_53);
_53.l=_53.l<c.l?c.l:c.r<_53.l?c.r:_53.l;
_53.t=_53.t<c.t?c.t:c.b<_53.t?c.b:_53.t;
s.left=_53.l+"px";
s.top=_53.t+"px";
this.onMoved(_52,_53);
}});
dojo.declare("dojo.dnd.move.boxConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{box:{},markupFactory:function(_54,_55){
return new dojo.dnd.move.boxConstrainedMoveable(_55,_54);
},constructor:function(_56,_57){
var box=_57&&_57.box;
this.constraints=function(){
return box;
};
}});
dojo.declare("dojo.dnd.move.parentConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{area:"content",markupFactory:function(_58,_59){
return new dojo.dnd.move.parentConstrainedMoveable(_59,_58);
},constructor:function(_5a,_5b){
var _5c=_5b&&_5b.area;
this.constraints=function(){
var n=this.node.parentNode,s=dojo.getComputedStyle(n),mb=dojo._getMarginBox(n,s);
if(_5c=="margin"){
return mb;
}
var t=dojo._getMarginExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(_5c=="border"){
return mb;
}
t=dojo._getBorderExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(_5c=="padding"){
return mb;
}
t=dojo._getPadExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
return mb;
};
}});
dojo.dnd.constrainedMover=dojo.dnd.move.constrainedMover;
dojo.dnd.boxConstrainedMover=dojo.dnd.move.boxConstrainedMover;
dojo.dnd.parentConstrainedMover=dojo.dnd.move.parentConstrainedMover;
}
if(!dojo._hasResource["dijit._HasDropDown"]){
dojo._hasResource["dijit._HasDropDown"]=true;
dojo.provide("dijit._HasDropDown");
dojo.declare("dijit._HasDropDown",null,{_buttonNode:null,_arrowWrapperNode:null,_popupStateNode:null,_aroundNode:null,dropDown:null,autoWidth:true,forceWidth:false,maxHeight:0,dropDownPosition:["below","above"],_stopClickEvents:true,_onDropDownMouseDown:function(e){
if(this.disabled||this.readOnly){
return;
}
dojo.stopEvent(e);
this._docHandler=this.connect(dojo.doc,"onmouseup","_onDropDownMouseUp");
this.toggleDropDown();
},_onDropDownMouseUp:function(e){
if(e&&this._docHandler){
this.disconnect(this._docHandler);
}
var _5d=this.dropDown,_5e=false;
if(e&&this._opened){
var c=dojo.position(this._buttonNode,true);
if(!(e.pageX>=c.x&&e.pageX<=c.x+c.w)||!(e.pageY>=c.y&&e.pageY<=c.y+c.h)){
var t=e.target;
while(t&&!_5e){
if(dojo.hasClass(t,"dijitPopup")){
_5e=true;
}else{
t=t.parentNode;
}
}
if(_5e){
t=e.target;
if(_5d.onItemClick){
var _5f;
while(t&&!(_5f=dijit.byNode(t))){
t=t.parentNode;
}
if(_5f&&_5f.onClick&&_5f.getParent){
_5f.getParent().onItemClick(_5f,e);
}
}
return;
}
}
}
if(this._opened&&_5d.focus&&_5d.autoFocus!==false){
window.setTimeout(dojo.hitch(_5d,"focus"),1);
}
},_onDropDownClick:function(e){
if(this._stopClickEvents){
dojo.stopEvent(e);
}
},buildRendering:function(){
this.inherited(arguments);
this._buttonNode=this._buttonNode||this.focusNode||this.domNode;
this._popupStateNode=this._popupStateNode||this.focusNode||this._buttonNode;
var _60={"after":this.isLeftToRight()?"Right":"Left","before":this.isLeftToRight()?"Left":"Right","above":"Up","below":"Down","left":"Left","right":"Right"}[this.dropDownPosition[0]]||this.dropDownPosition[0]||"Down";
dojo.addClass(this._arrowWrapperNode||this._buttonNode,"dijit"+_60+"ArrowButton");
},postCreate:function(){
this.inherited(arguments);
this.connect(this._buttonNode,"onmousedown","_onDropDownMouseDown");
this.connect(this._buttonNode,"onclick","_onDropDownClick");
this.connect(this.focusNode,"onkeypress","_onKey");
this.connect(this.focusNode,"onkeyup","_onKeyUp");
},destroy:function(){
if(this.dropDown){
if(!this.dropDown._destroyed){
this.dropDown.destroyRecursive();
}
delete this.dropDown;
}
this.inherited(arguments);
},_onKey:function(e){
if(this.disabled||this.readOnly){
return;
}
var d=this.dropDown,_61=e.target;
if(d&&this._opened&&d.handleKey){
if(d.handleKey(e)===false){
dojo.stopEvent(e);
return;
}
}
if(d&&this._opened&&e.charOrCode==dojo.keys.ESCAPE){
this.closeDropDown();
dojo.stopEvent(e);
}else{
if(!this._opened&&(e.charOrCode==dojo.keys.DOWN_ARROW||((e.charOrCode==dojo.keys.ENTER||e.charOrCode==" ")&&((_61.tagName||"").toLowerCase()!=="input"||(_61.type&&_61.type.toLowerCase()!=="text"))))){
this._toggleOnKeyUp=true;
dojo.stopEvent(e);
}
}
},_onKeyUp:function(){
if(this._toggleOnKeyUp){
delete this._toggleOnKeyUp;
this.toggleDropDown();
var d=this.dropDown;
if(d&&d.focus){
setTimeout(dojo.hitch(d,"focus"),1);
}
}
},_onBlur:function(){
var _62=dijit._curFocus&&this.dropDown&&dojo.isDescendant(dijit._curFocus,this.dropDown.domNode);
this.closeDropDown(_62);
this.inherited(arguments);
},isLoaded:function(){
return true;
},loadDropDown:function(_63){
_63();
},toggleDropDown:function(){
if(this.disabled||this.readOnly){
return;
}
if(!this._opened){
if(!this.isLoaded()){
this.loadDropDown(dojo.hitch(this,"openDropDown"));
return;
}else{
this.openDropDown();
}
}else{
this.closeDropDown();
}
},openDropDown:function(){
var _64=this.dropDown,_65=_64.domNode,_66=this._aroundNode||this.domNode,_67=this;
if(!this._preparedNode){
this._preparedNode=true;
if(_65.style.width){
this._explicitDDWidth=true;
}
if(_65.style.height){
this._explicitDDHeight=true;
}
}
if(this.maxHeight||this.forceWidth||this.autoWidth){
var _68={display:"",visibility:"hidden"};
if(!this._explicitDDWidth){
_68.width="";
}
if(!this._explicitDDHeight){
_68.height="";
}
dojo.style(_65,_68);
var _69=this.maxHeight;
if(_69==-1){
var _6a=dojo.window.getBox(),_6b=dojo.position(_66,false);
_69=Math.floor(Math.max(_6b.y,_6a.h-(_6b.y+_6b.h)));
}
if(_64.startup&&!_64._started){
_64.startup();
}
dijit.popup.moveOffScreen(_64);
var mb=dojo._getMarginSize(_65);
var _6c=(_69&&mb.h>_69);
dojo.style(_65,{overflowX:"hidden",overflowY:_6c?"auto":"hidden"});
if(_6c){
mb.h=_69;
if("w" in mb){
mb.w+=16;
}
}else{
delete mb.h;
}
if(this.forceWidth){
mb.w=_66.offsetWidth;
}else{
if(this.autoWidth){
mb.w=Math.max(mb.w,_66.offsetWidth);
}else{
delete mb.w;
}
}
if(dojo.isFunction(_64.resize)){
_64.resize(mb);
}else{
dojo.marginBox(_65,mb);
}
}
var _6d=dijit.popup.open({parent:this,popup:_64,around:_66,orient:dijit.getPopupAroundAlignment((this.dropDownPosition&&this.dropDownPosition.length)?this.dropDownPosition:["below"],this.isLeftToRight()),onExecute:function(){
_67.closeDropDown(true);
},onCancel:function(){
_67.closeDropDown(true);
},onClose:function(){
dojo.attr(_67._popupStateNode,"popupActive",false);
dojo.removeClass(_67._popupStateNode,"dijitHasDropDownOpen");
_67._opened=false;
}});
dojo.attr(this._popupStateNode,"popupActive","true");
dojo.addClass(_67._popupStateNode,"dijitHasDropDownOpen");
this._opened=true;
return _6d;
},closeDropDown:function(_6e){
if(this._opened){
if(_6e){
this.focus();
}
dijit.popup.close(this.dropDown);
this._opened=false;
}
}});
}
if(!dojo._hasResource["dijit.form.Button"]){
dojo._hasResource["dijit.form.Button"]=true;
dojo.provide("dijit.form.Button");
dojo.declare("dijit.form.Button",dijit.form._FormWidget,{label:"",showLabel:true,iconClass:"",type:"button",baseClass:"dijitButton",templateString:dojo.cache("dijit.form","templates/Button.html","<span class=\"dijit dijitReset dijitInline\"\n\t><span class=\"dijitReset dijitInline dijitButtonNode\"\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"titleNode,focusNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\"></span\n\t\t\t><span class=\"dijitReset dijitToggleButtonIconChar\">&#x25CF;</span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t\tdojoAttachPoint=\"containerNode\"\n\t\t\t></span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\" tabIndex=\"-1\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),attributeMap:dojo.delegate(dijit.form._FormWidget.prototype.attributeMap,{value:"valueNode"}),_onClick:function(e){
if(this.disabled){
return false;
}
this._clicked();
return this.onClick(e);
},_onButtonClick:function(e){
if(this._onClick(e)===false){
e.preventDefault();
}else{
if(this.type=="submit"&&!(this.valueNode||this.focusNode).form){
for(var _6f=this.domNode;_6f.parentNode;_6f=_6f.parentNode){
var _70=dijit.byNode(_6f);
if(_70&&typeof _70._onSubmit=="function"){
_70._onSubmit(e);
break;
}
}
}else{
if(this.valueNode){
this.valueNode.click();
e.preventDefault();
}
}
}
},buildRendering:function(){
this.inherited(arguments);
dojo.setSelectable(this.focusNode,false);
},_fillContent:function(_71){
if(_71&&(!this.params||!("label" in this.params))){
this.set("label",_71.innerHTML);
}
},_setShowLabelAttr:function(val){
if(this.containerNode){
dojo.toggleClass(this.containerNode,"dijitDisplayNone",!val);
}
this._set("showLabel",val);
},onClick:function(e){
return true;
},_clicked:function(e){
},setLabel:function(_72){
dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_72);
},_setLabelAttr:function(_73){
this._set("label",_73);
this.containerNode.innerHTML=_73;
if(this.showLabel==false&&!this.params.title){
this.titleNode.title=dojo.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
},_setIconClassAttr:function(val){
var _74=this.iconClass||"dijitNoIcon",_75=val||"dijitNoIcon";
dojo.replaceClass(this.iconNode,_75,_74);
this._set("iconClass",val);
}});
dojo.declare("dijit.form.DropDownButton",[dijit.form.Button,dijit._Container,dijit._HasDropDown],{baseClass:"dijitDropDownButton",templateString:dojo.cache("dijit.form","templates/DropDownButton.html","<span class=\"dijit dijitReset dijitInline\"\n\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\" dojoAttachPoint=\"_buttonNode\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"focusNode,titleNode,_arrowWrapperNode\"\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\n\t\t\t\tdojoAttachPoint=\"iconNode\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tdojoAttachPoint=\"containerNode,_popupStateNode\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\" tabIndex=\"-1\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),_fillContent:function(){
if(this.srcNodeRef){
var _76=dojo.query("*",this.srcNodeRef);
dijit.form.DropDownButton.superclass._fillContent.call(this,_76[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
if(!this.dropDown&&this.dropDownContainer){
var _77=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.dropDown=dijit.byNode(_77);
delete this.dropDownContainer;
}
if(this.dropDown){
dijit.popup.hide(this.dropDown);
}
this.inherited(arguments);
},isLoaded:function(){
var _78=this.dropDown;
return (!!_78&&(!_78.href||_78.isLoaded));
},loadDropDown:function(){
var _79=this.dropDown;
if(!_79){
return;
}
if(!this.isLoaded()){
var _7a=dojo.connect(_79,"onLoad",this,function(){
dojo.disconnect(_7a);
this.openDropDown();
});
_79.refresh();
}else{
this.openDropDown();
}
},isFocusable:function(){
return this.inherited(arguments)&&!this._mouseDown;
}});
dojo.declare("dijit.form.ComboButton",dijit.form.DropDownButton,{templateString:dojo.cache("dijit.form","templates/ComboButton.html","<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tcellspacing='0' cellpadding='0' role=\"presentation\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonNode\" dojoAttachPoint=\"buttonNode\" dojoAttachEvent=\"ondijitclick:_onButtonClick,onkeypress:_onButtonKeyPress\"\n\t\t><div id=\"${id}_button\" class=\"dijitReset dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"titleNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><div class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" dojoAttachPoint=\"containerNode\" role=\"presentation\"></div\n\t\t></div\n\t\t></td\n\t\t><td id=\"${id}_arrow\" class='dijitReset dijitRight dijitButtonNode dijitArrowButton'\n\t\t\tdojoAttachPoint=\"_popupStateNode,focusNode,_buttonNode\"\n\t\t\tdojoAttachEvent=\"onkeypress:_onArrowKeyPress\"\n\t\t\ttitle=\"${optionsTitle}\"\n\t\t\trole=\"button\" aria-haspopup=\"true\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\n\t\t></td\n\t\t><td style=\"display:none !important;\"\n\t\t\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" dojoAttachPoint=\"valueNode\"\n\t\t/></td></tr></tbody\n></table>\n"),attributeMap:dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap),{id:"",tabIndex:["focusNode","titleNode"],title:"titleNode"}),optionsTitle:"",baseClass:"dijitComboButton",cssStateNodes:{"buttonNode":"dijitButtonNode","titleNode":"dijitButtonContents","_popupStateNode":"dijitDownArrowButton"},_focusedNode:null,_onButtonKeyPress:function(evt){
if(evt.charOrCode==dojo.keys[this.isLeftToRight()?"RIGHT_ARROW":"LEFT_ARROW"]){
dijit.focus(this._popupStateNode);
dojo.stopEvent(evt);
}
},_onArrowKeyPress:function(evt){
if(evt.charOrCode==dojo.keys[this.isLeftToRight()?"LEFT_ARROW":"RIGHT_ARROW"]){
dijit.focus(this.titleNode);
dojo.stopEvent(evt);
}
},focus:function(_7b){
if(!this.disabled){
dijit.focus(_7b=="start"?this.titleNode:this._popupStateNode);
}
}});
dojo.declare("dijit.form.ToggleButton",dijit.form.Button,{baseClass:"dijitToggleButton",checked:false,attributeMap:dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap),{checked:"focusNode"}),_clicked:function(evt){
this.set("checked",!this.checked);
},_setCheckedAttr:function(_7c,_7d){
this._set("checked",_7c);
dojo.attr(this.focusNode||this.domNode,"checked",_7c);
dijit.setWaiState(this.focusNode||this.domNode,"pressed",_7c);
this._handleOnChange(_7c,_7d);
},setChecked:function(_7e){
dojo.deprecated("setChecked("+_7e+") is deprecated. Use set('checked',"+_7e+") instead.","","2.0");
this.set("checked",_7e);
},reset:function(){
this._hasBeenBlurred=false;
this.set("checked",this.params.checked||false);
}});
}
if(!dojo._hasResource["dojo.number"]){
dojo._hasResource["dojo.number"]=true;
dojo.provide("dojo.number");
dojo.getObject("number",true,dojo);
dojo.number.format=function(_7f,_80){
_80=dojo.mixin({},_80||{});
var _81=dojo.i18n.normalizeLocale(_80.locale),_82=dojo.i18n.getLocalization("dojo.cldr","number",_81);
_80.customs=_82;
var _83=_80.pattern||_82[(_80.type||"decimal")+"Format"];
if(isNaN(_7f)||Math.abs(_7f)==Infinity){
return null;
}
return dojo.number._applyPattern(_7f,_83,_80);
};
dojo.number._numberPatternRE=/[#0,]*[#0](?:\.0*#*)?/;
dojo.number._applyPattern=function(_84,_85,_86){
_86=_86||{};
var _87=_86.customs.group,_88=_86.customs.decimal,_89=_85.split(";"),_8a=_89[0];
_85=_89[(_84<0)?1:0]||("-"+_8a);
if(_85.indexOf("%")!=-1){
_84*=100;
}else{
if(_85.indexOf("‰")!=-1){
_84*=1000;
}else{
if(_85.indexOf("¤")!=-1){
_87=_86.customs.currencyGroup||_87;
_88=_86.customs.currencyDecimal||_88;
_85=_85.replace(/\u00a4{1,3}/,function(_8b){
var _8c=["symbol","currency","displayName"][_8b.length-1];
return _86[_8c]||_86.currency||"";
});
}else{
if(_85.indexOf("E")!=-1){
throw new Error("exponential notation not supported");
}
}
}
}
var _8d=dojo.number._numberPatternRE;
var _8e=_8a.match(_8d);
if(!_8e){
throw new Error("unable to find a number expression in pattern: "+_85);
}
if(_86.fractional===false){
_86.places=0;
}
return _85.replace(_8d,dojo.number._formatAbsolute(_84,_8e[0],{decimal:_88,group:_87,places:_86.places,round:_86.round}));
};
dojo.number.round=function(_8f,_90,_91){
var _92=10/(_91||10);
return (_92*+_8f).toFixed(_90)/_92;
};
if((0.9).toFixed()==0){
(function(){
var _93=dojo.number.round;
dojo.number.round=function(v,p,m){
var d=Math.pow(10,-p||0),a=Math.abs(v);
if(!v||a>=d||a*Math.pow(10,p+1)<5){
d=0;
}
return _93(v,p,m)+(v>0?d:-d);
};
})();
}
dojo.number._formatAbsolute=function(_94,_95,_96){
_96=_96||{};
if(_96.places===true){
_96.places=0;
}
if(_96.places===Infinity){
_96.places=6;
}
var _97=_95.split("."),_98=typeof _96.places=="string"&&_96.places.indexOf(","),_99=_96.places;
if(_98){
_99=_96.places.substring(_98+1);
}else{
if(!(_99>=0)){
_99=(_97[1]||[]).length;
}
}
if(!(_96.round<0)){
_94=dojo.number.round(_94,_99,_96.round);
}
var _9a=String(Math.abs(_94)).split("."),_9b=_9a[1]||"";
if(_97[1]||_96.places){
if(_98){
_96.places=_96.places.substring(0,_98);
}
var pad=_96.places!==undefined?_96.places:(_97[1]&&_97[1].lastIndexOf("0")+1);
if(pad>_9b.length){
_9a[1]=dojo.string.pad(_9b,pad,"0",true);
}
if(_99<_9b.length){
_9a[1]=_9b.substr(0,_99);
}
}else{
if(_9a[1]){
_9a.pop();
}
}
var _9c=_97[0].replace(",","");
pad=_9c.indexOf("0");
if(pad!=-1){
pad=_9c.length-pad;
if(pad>_9a[0].length){
_9a[0]=dojo.string.pad(_9a[0],pad);
}
if(_9c.indexOf("#")==-1){
_9a[0]=_9a[0].substr(_9a[0].length-pad);
}
}
var _9d=_97[0].lastIndexOf(","),_9e,_9f;
if(_9d!=-1){
_9e=_97[0].length-_9d-1;
var _a0=_97[0].substr(0,_9d);
_9d=_a0.lastIndexOf(",");
if(_9d!=-1){
_9f=_a0.length-_9d-1;
}
}
var _a1=[];
for(var _a2=_9a[0];_a2;){
var off=_a2.length-_9e;
_a1.push((off>0)?_a2.substr(off):_a2);
_a2=(off>0)?_a2.slice(0,off):"";
if(_9f){
_9e=_9f;
delete _9f;
}
}
_9a[0]=_a1.reverse().join(_96.group||",");
return _9a.join(_96.decimal||".");
};
dojo.number.regexp=function(_a3){
return dojo.number._parseInfo(_a3).regexp;
};
dojo.number._parseInfo=function(_a4){
_a4=_a4||{};
var _a5=dojo.i18n.normalizeLocale(_a4.locale),_a6=dojo.i18n.getLocalization("dojo.cldr","number",_a5),_a7=_a4.pattern||_a6[(_a4.type||"decimal")+"Format"],_a8=_a6.group,_a9=_a6.decimal,_aa=1;
if(_a7.indexOf("%")!=-1){
_aa/=100;
}else{
if(_a7.indexOf("‰")!=-1){
_aa/=1000;
}else{
var _ab=_a7.indexOf("¤")!=-1;
if(_ab){
_a8=_a6.currencyGroup||_a8;
_a9=_a6.currencyDecimal||_a9;
}
}
}
var _ac=_a7.split(";");
if(_ac.length==1){
_ac.push("-"+_ac[0]);
}
var re=dojo.regexp.buildGroupRE(_ac,function(_ad){
_ad="(?:"+dojo.regexp.escapeString(_ad,".")+")";
return _ad.replace(dojo.number._numberPatternRE,function(_ae){
var _af={signed:false,separator:_a4.strict?_a8:[_a8,""],fractional:_a4.fractional,decimal:_a9,exponent:false},_b0=_ae.split("."),_b1=_a4.places;
if(_b0.length==1&&_aa!=1){
_b0[1]="###";
}
if(_b0.length==1||_b1===0){
_af.fractional=false;
}else{
if(_b1===undefined){
_b1=_a4.pattern?_b0[1].lastIndexOf("0")+1:Infinity;
}
if(_b1&&_a4.fractional==undefined){
_af.fractional=true;
}
if(!_a4.places&&(_b1<_b0[1].length)){
_b1+=","+_b0[1].length;
}
_af.places=_b1;
}
var _b2=_b0[0].split(",");
if(_b2.length>1){
_af.groupSize=_b2.pop().length;
if(_b2.length>1){
_af.groupSize2=_b2.pop().length;
}
}
return "("+dojo.number._realNumberRegexp(_af)+")";
});
},true);
if(_ab){
re=re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g,function(_b3,_b4,_b5,_b6){
var _b7=["symbol","currency","displayName"][_b5.length-1],_b8=dojo.regexp.escapeString(_a4[_b7]||_a4.currency||"");
_b4=_b4?"[\\s\\xa0]":"";
_b6=_b6?"[\\s\\xa0]":"";
if(!_a4.strict){
if(_b4){
_b4+="*";
}
if(_b6){
_b6+="*";
}
return "(?:"+_b4+_b8+_b6+")?";
}
return _b4+_b8+_b6;
});
}
return {regexp:re.replace(/[\xa0 ]/g,"[\\s\\xa0]"),group:_a8,decimal:_a9,factor:_aa};
};
dojo.number.parse=function(_b9,_ba){
var _bb=dojo.number._parseInfo(_ba),_bc=(new RegExp("^"+_bb.regexp+"$")).exec(_b9);
if(!_bc){
return NaN;
}
var _bd=_bc[1];
if(!_bc[1]){
if(!_bc[2]){
return NaN;
}
_bd=_bc[2];
_bb.factor*=-1;
}
_bd=_bd.replace(new RegExp("["+_bb.group+"\\s\\xa0"+"]","g"),"").replace(_bb.decimal,".");
return _bd*_bb.factor;
};
dojo.number._realNumberRegexp=function(_be){
_be=_be||{};
if(!("places" in _be)){
_be.places=Infinity;
}
if(typeof _be.decimal!="string"){
_be.decimal=".";
}
if(!("fractional" in _be)||/^0/.test(_be.places)){
_be.fractional=[true,false];
}
if(!("exponent" in _be)){
_be.exponent=[true,false];
}
if(!("eSigned" in _be)){
_be.eSigned=[true,false];
}
var _bf=dojo.number._integerRegexp(_be),_c0=dojo.regexp.buildGroupRE(_be.fractional,function(q){
var re="";
if(q&&(_be.places!==0)){
re="\\"+_be.decimal;
if(_be.places==Infinity){
re="(?:"+re+"\\d+)?";
}else{
re+="\\d{"+_be.places+"}";
}
}
return re;
},true);
var _c1=dojo.regexp.buildGroupRE(_be.exponent,function(q){
if(q){
return "([eE]"+dojo.number._integerRegexp({signed:_be.eSigned})+")";
}
return "";
});
var _c2=_bf+_c0;
if(_c0){
_c2="(?:(?:"+_c2+")|(?:"+_c0+"))";
}
return _c2+_c1;
};
dojo.number._integerRegexp=function(_c3){
_c3=_c3||{};
if(!("signed" in _c3)){
_c3.signed=[true,false];
}
if(!("separator" in _c3)){
_c3.separator="";
}else{
if(!("groupSize" in _c3)){
_c3.groupSize=3;
}
}
var _c4=dojo.regexp.buildGroupRE(_c3.signed,function(q){
return q?"[-+]":"";
},true);
var _c5=dojo.regexp.buildGroupRE(_c3.separator,function(sep){
if(!sep){
return "(?:\\d+)";
}
sep=dojo.regexp.escapeString(sep);
if(sep==" "){
sep="\\s";
}else{
if(sep==" "){
sep="\\s\\xa0";
}
}
var grp=_c3.groupSize,_c6=_c3.groupSize2;
if(_c6){
var _c7="(?:0|[1-9]\\d{0,"+(_c6-1)+"}(?:["+sep+"]\\d{"+_c6+"})*["+sep+"]\\d{"+grp+"})";
return ((grp-_c6)>0)?"(?:"+_c7+"|(?:0|[1-9]\\d{0,"+(grp-1)+"}))":_c7;
}
return "(?:0|[1-9]\\d{0,"+(grp-1)+"}(?:["+sep+"]\\d{"+grp+"})*)";
},true);
return _c4+_c5;
};
}
if(!dojo._hasResource["dijit.form.HorizontalSlider"]){
dojo._hasResource["dijit.form.HorizontalSlider"]=true;
dojo.provide("dijit.form.HorizontalSlider");
dojo.declare("dijit.form.HorizontalSlider",[dijit.form._FormValueWidget,dijit._Container],{templateString:dojo.cache("dijit.form","templates/HorizontalSlider.html","<table class=\"dijit dijitReset dijitSlider dijitSliderH\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" dojoAttachEvent=\"onkeypress:_onKeyPress,onkeyup:_onKeyUp\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td dojoAttachPoint=\"topDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationT dijitSliderDecorationH\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\"\n\t\t\t><div class=\"dijitSliderDecrementIconH\" style=\"display:none\" dojoAttachPoint=\"decrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderLeftBumper\" dojoAttachEvent=\"onmousedown:_onClkDecBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><input dojoAttachPoint=\"valueNode\" type=\"hidden\" ${!nameAttrSetting}\n\t\t\t/><div class=\"dijitReset dijitSliderBarContainerH\" role=\"presentation\" dojoAttachPoint=\"sliderBarContainer\"\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"progressBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderProgressBar dijitSliderProgressBarH\" dojoAttachEvent=\"onmousedown:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableH\"\n\t\t\t\t\t\t><div dojoAttachPoint=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleH\" dojoAttachEvent=\"onmousedown:_onHandleClick\" role=\"slider\" valuemin=\"${minimum}\" valuemax=\"${maximum}\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderRemainingBar dijitSliderRemainingBarH\" dojoAttachEvent=\"onmousedown:_onBarClick\"></div\n\t\t\t></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderRightBumper\" dojoAttachEvent=\"onmousedown:_onClkIncBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\"\n\t\t\t><div class=\"dijitSliderIncrementIconH\" style=\"display:none\" dojoAttachPoint=\"incrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td dojoAttachPoint=\"containerNode,bottomDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationB dijitSliderDecorationH\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n></table>\n"),value:0,showButtons:true,minimum:0,maximum:100,discreteValues:Infinity,pageIncrement:2,clickSelect:true,slideDuration:dijit.defaultDuration,widgetsInTemplate:true,attributeMap:dojo.delegate(dijit.form._FormWidget.prototype.attributeMap,{id:""}),baseClass:"dijitSlider",cssStateNodes:{incrementButton:"dijitSliderIncrementButton",decrementButton:"dijitSliderDecrementButton",focusNode:"dijitSliderThumb"},_mousePixelCoord:"pageX",_pixelCount:"w",_startingPixelCoord:"x",_startingPixelCount:"l",_handleOffsetCoord:"left",_progressPixelSize:"width",_onKeyUp:function(e){
if(this.disabled||this.readOnly||e.altKey||e.ctrlKey||e.metaKey){
return;
}
this._setValueAttr(this.value,true);
},_onKeyPress:function(e){
if(this.disabled||this.readOnly||e.altKey||e.ctrlKey||e.metaKey){
return;
}
switch(e.charOrCode){
case dojo.keys.HOME:
this._setValueAttr(this.minimum,false);
break;
case dojo.keys.END:
this._setValueAttr(this.maximum,false);
break;
case ((this._descending||this.isLeftToRight())?dojo.keys.RIGHT_ARROW:dojo.keys.LEFT_ARROW):
case (this._descending===false?dojo.keys.DOWN_ARROW:dojo.keys.UP_ARROW):
case (this._descending===false?dojo.keys.PAGE_DOWN:dojo.keys.PAGE_UP):
this.increment(e);
break;
case ((this._descending||this.isLeftToRight())?dojo.keys.LEFT_ARROW:dojo.keys.RIGHT_ARROW):
case (this._descending===false?dojo.keys.UP_ARROW:dojo.keys.DOWN_ARROW):
case (this._descending===false?dojo.keys.PAGE_UP:dojo.keys.PAGE_DOWN):
this.decrement(e);
break;
default:
return;
}
dojo.stopEvent(e);
},_onHandleClick:function(e){
if(this.disabled||this.readOnly){
return;
}
if(!dojo.isIE){
dijit.focus(this.sliderHandle);
}
dojo.stopEvent(e);
},_isReversed:function(){
return !this.isLeftToRight();
},_onBarClick:function(e){
if(this.disabled||this.readOnly||!this.clickSelect){
return;
}
dijit.focus(this.sliderHandle);
dojo.stopEvent(e);
var _c8=dojo.position(this.sliderBarContainer,true);
var _c9=e[this._mousePixelCoord]-_c8[this._startingPixelCoord];
this._setPixelValue(this._isReversed()?(_c8[this._pixelCount]-_c9):_c9,_c8[this._pixelCount],true);
this._movable.onMouseDown(e);
},_setPixelValue:function(_ca,_cb,_cc){
if(this.disabled||this.readOnly){
return;
}
_ca=_ca<0?0:_cb<_ca?_cb:_ca;
var _cd=this.discreteValues;
if(_cd<=1||_cd==Infinity){
_cd=_cb;
}
_cd--;
var _ce=_cb/_cd;
var _cf=Math.round(_ca/_ce);
this._setValueAttr((this.maximum-this.minimum)*_cf/_cd+this.minimum,_cc);
},_setValueAttr:function(_d0,_d1){
this._set("value",_d0);
this.valueNode.value=_d0;
dijit.setWaiState(this.focusNode,"valuenow",_d0);
this.inherited(arguments);
var _d2=(_d0-this.minimum)/(this.maximum-this.minimum);
var _d3=(this._descending===false)?this.remainingBar:this.progressBar;
var _d4=(this._descending===false)?this.progressBar:this.remainingBar;
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
if(_d1&&this.slideDuration>0&&_d3.style[this._progressPixelSize]){
var _d5=this;
var _d6={};
var _d7=parseFloat(_d3.style[this._progressPixelSize]);
var _d8=this.slideDuration*(_d2-_d7/100);
if(_d8==0){
return;
}
if(_d8<0){
_d8=0-_d8;
}
_d6[this._progressPixelSize]={start:_d7,end:_d2*100,units:"%"};
this._inProgressAnim=dojo.animateProperty({node:_d3,duration:_d8,onAnimate:function(v){
_d4.style[_d5._progressPixelSize]=(100-parseFloat(v[_d5._progressPixelSize]))+"%";
},onEnd:function(){
delete _d5._inProgressAnim;
},properties:_d6});
this._inProgressAnim.play();
}else{
_d3.style[this._progressPixelSize]=(_d2*100)+"%";
_d4.style[this._progressPixelSize]=((1-_d2)*100)+"%";
}
},_bumpValue:function(_d9,_da){
if(this.disabled||this.readOnly){
return;
}
var s=dojo.getComputedStyle(this.sliderBarContainer);
var c=dojo._getContentBox(this.sliderBarContainer,s);
var _db=this.discreteValues;
if(_db<=1||_db==Infinity){
_db=c[this._pixelCount];
}
_db--;
var _dc=(this.value-this.minimum)*_db/(this.maximum-this.minimum)+_d9;
if(_dc<0){
_dc=0;
}
if(_dc>_db){
_dc=_db;
}
_dc=_dc*(this.maximum-this.minimum)/_db+this.minimum;
this._setValueAttr(_dc,_da);
},_onClkBumper:function(val){
if(this.disabled||this.readOnly||!this.clickSelect){
return;
}
this._setValueAttr(val,true);
},_onClkIncBumper:function(){
this._onClkBumper(this._descending===false?this.minimum:this.maximum);
},_onClkDecBumper:function(){
this._onClkBumper(this._descending===false?this.maximum:this.minimum);
},decrement:function(e){
this._bumpValue(e.charOrCode==dojo.keys.PAGE_DOWN?-this.pageIncrement:-1);
},increment:function(e){
this._bumpValue(e.charOrCode==dojo.keys.PAGE_UP?this.pageIncrement:1);
},_mouseWheeled:function(evt){
dojo.stopEvent(evt);
var _dd=!dojo.isMozilla;
var _de=evt[(_dd?"wheelDelta":"detail")]*(_dd?1:-1);
this._bumpValue(_de<0?-1:1,true);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_df){
if(this[_df.container]!=this.containerNode){
this[_df.container].appendChild(_df.domNode);
}
},this);
this.inherited(arguments);
},_typematicCallback:function(_e0,_e1,e){
if(_e0==-1){
this._setValueAttr(this.value,true);
}else{
this[(_e1==(this._descending?this.incrementButton:this.decrementButton))?"decrement":"increment"](e);
}
},buildRendering:function(){
this.inherited(arguments);
if(this.showButtons){
this.incrementButton.style.display="";
this.decrementButton.style.display="";
}
var _e2=dojo.query("label[for=\""+this.id+"\"]");
if(_e2.length){
_e2[0].id=(this.id+"_label");
dijit.setWaiState(this.focusNode,"labelledby",_e2[0].id);
}
dijit.setWaiState(this.focusNode,"valuemin",this.minimum);
dijit.setWaiState(this.focusNode,"valuemax",this.maximum);
},postCreate:function(){
this.inherited(arguments);
if(this.showButtons){
this._connects.push(dijit.typematic.addMouseListener(this.decrementButton,this,"_typematicCallback",25,500));
this._connects.push(dijit.typematic.addMouseListener(this.incrementButton,this,"_typematicCallback",25,500));
}
this.connect(this.domNode,!dojo.isMozilla?"onmousewheel":"DOMMouseScroll","_mouseWheeled");
var _e3=dojo.declare(dijit.form._SliderMover,{widget:this});
this._movable=new dojo.dnd.Moveable(this.sliderHandle,{mover:_e3});
this._layoutHackIE7();
},destroy:function(){
this._movable.destroy();
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
this._supportingWidgets=dijit.findWidgets(this.domNode);
this.inherited(arguments);
}});
dojo.declare("dijit.form._SliderMover",dojo.dnd.Mover,{onMouseMove:function(e){
var _e4=this.widget;
var _e5=_e4._abspos;
if(!_e5){
_e5=_e4._abspos=dojo.position(_e4.sliderBarContainer,true);
_e4._setPixelValue_=dojo.hitch(_e4,"_setPixelValue");
_e4._isReversed_=_e4._isReversed();
}
var _e6=e.touches?e.touches[0]:e,_e7=_e6[_e4._mousePixelCoord]-_e5[_e4._startingPixelCoord];
_e4._setPixelValue_(_e4._isReversed_?(_e5[_e4._pixelCount]-_e7):_e7,_e5[_e4._pixelCount],false);
},destroy:function(e){
dojo.dnd.Mover.prototype.destroy.apply(this,arguments);
var _e8=this.widget;
_e8._abspos=null;
_e8._setValueAttr(_e8.value,true);
}});
}
if(!dojo._hasResource["dijit.form.VerticalSlider"]){
dojo._hasResource["dijit.form.VerticalSlider"]=true;
dojo.provide("dijit.form.VerticalSlider");
dojo.declare("dijit.form.VerticalSlider",dijit.form.HorizontalSlider,{templateString:dojo.cache("dijit.form","templates/VerticalSlider.html","<table class=\"dijit dijitReset dijitSlider dijitSliderV\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" dojoAttachEvent=\"onkeypress:_onKeyPress,onkeyup:_onKeyUp\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderIncrementIconV\" style=\"display:none\" dojoAttachPoint=\"decrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderTopBumper\" dojoAttachEvent=\"onmousedown:_onClkIncBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td dojoAttachPoint=\"leftDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationL dijitSliderDecorationV\"></td\n\t\t><td class=\"dijitReset dijitSliderDecorationC\" style=\"height:100%;\"\n\t\t\t><input dojoAttachPoint=\"valueNode\" type=\"hidden\" ${!nameAttrSetting}\n\t\t\t/><center class=\"dijitReset dijitSliderBarContainerV\" role=\"presentation\" dojoAttachPoint=\"sliderBarContainer\"\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderRemainingBar dijitSliderRemainingBarV\" dojoAttachEvent=\"onmousedown:_onBarClick\"><!--#5629--></div\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"progressBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderProgressBar dijitSliderProgressBarV\" dojoAttachEvent=\"onmousedown:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableV\" style=\"vertical-align:top;\"\n\t\t\t\t\t\t><div dojoAttachPoint=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleV\" dojoAttachEvent=\"onmousedown:_onHandleClick\" role=\"slider\" valuemin=\"${minimum}\" valuemax=\"${maximum}\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t></center\n\t\t></td\n\t\t><td dojoAttachPoint=\"containerNode,rightDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationR dijitSliderDecorationV\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderBottomBumper\" dojoAttachEvent=\"onmousedown:_onClkDecBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderDecrementIconV\" style=\"display:none\" dojoAttachPoint=\"incrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n></table>\n"),_mousePixelCoord:"pageY",_pixelCount:"h",_startingPixelCoord:"y",_startingPixelCount:"t",_handleOffsetCoord:"top",_progressPixelSize:"height",_descending:true,_isReversed:function(){
return this._descending;
}});
}
if(!dojo._hasResource["dijit.form._Spinner"]){
dojo._hasResource["dijit.form._Spinner"]=true;
dojo.provide("dijit.form._Spinner");
dojo.declare("dijit.form._Spinner",dijit.form.RangeBoundTextBox,{defaultTimeout:500,minimumTimeout:10,timeoutChangeRate:0.9,smallDelta:1,largeDelta:10,templateString:dojo.cache("dijit.form","templates/Spinner.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\" role=\"presentation\"\n\t><div class=\"dijitReset dijitButtonNode dijitSpinnerButtonContainer\"\n\t\t><input class=\"dijitReset dijitInputField dijitSpinnerButtonInner\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t/><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitUpArrowButton\"\n\t\t\tdojoAttachPoint=\"upArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9650;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t\t><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\tdojoAttachPoint=\"downArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9660;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' dojoAttachPoint=\"textbox,focusNode\" type=\"${type}\" dojoAttachEvent=\"onkeypress:_onKeyPress\"\n\t\t\trole=\"spinbutton\" autocomplete=\"off\" ${!nameAttrSetting}\n\t/></div\n></div>\n"),baseClass:"dijitTextBox dijitSpinner",cssStateNodes:{"upArrowNode":"dijitUpArrowButton","downArrowNode":"dijitDownArrowButton"},adjust:function(val,_e9){
return val;
},_arrowPressed:function(_ea,_eb,_ec){
if(this.disabled||this.readOnly){
return;
}
this._setValueAttr(this.adjust(this.get("value"),_eb*_ec),false);
dijit.selectInputText(this.textbox,this.textbox.value.length);
},_arrowReleased:function(_ed){
this._wheelTimer=null;
if(this.disabled||this.readOnly){
return;
}
},_typematicCallback:function(_ee,_ef,evt){
var inc=this.smallDelta;
if(_ef==this.textbox){
var k=dojo.keys;
var key=evt.charOrCode;
inc=(key==k.PAGE_UP||key==k.PAGE_DOWN)?this.largeDelta:this.smallDelta;
_ef=(key==k.UP_ARROW||key==k.PAGE_UP)?this.upArrowNode:this.downArrowNode;
}
if(_ee==-1){
this._arrowReleased(_ef);
}else{
this._arrowPressed(_ef,(_ef==this.upArrowNode)?1:-1,inc);
}
},_wheelTimer:null,_mouseWheeled:function(evt){
dojo.stopEvent(evt);
var _f0=evt.detail?(evt.detail*-1):(evt.wheelDelta/120);
if(_f0!==0){
var _f1=this[(_f0>0?"upArrowNode":"downArrowNode")];
this._arrowPressed(_f1,_f0,this.smallDelta);
if(!this._wheelTimer){
clearTimeout(this._wheelTimer);
}
this._wheelTimer=setTimeout(dojo.hitch(this,"_arrowReleased",_f1),50);
}
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,!dojo.isMozilla?"onmousewheel":"DOMMouseScroll","_mouseWheeled");
this._connects.push(dijit.typematic.addListener(this.upArrowNode,this.textbox,{charOrCode:dojo.keys.UP_ARROW,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout));
this._connects.push(dijit.typematic.addListener(this.downArrowNode,this.textbox,{charOrCode:dojo.keys.DOWN_ARROW,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout));
this._connects.push(dijit.typematic.addListener(this.upArrowNode,this.textbox,{charOrCode:dojo.keys.PAGE_UP,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout));
this._connects.push(dijit.typematic.addListener(this.downArrowNode,this.textbox,{charOrCode:dojo.keys.PAGE_DOWN,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout));
}});
}
if(!dojo._hasResource["dijit.form.NumberTextBox"]){
dojo._hasResource["dijit.form.NumberTextBox"]=true;
dojo.provide("dijit.form.NumberTextBox");
dojo.declare("dijit.form.NumberTextBoxMixin",null,{regExpGen:dojo.number.regexp,value:NaN,editOptions:{pattern:"#.######"},_formatter:dojo.number.format,_setConstraintsAttr:function(_f2){
var _f3=typeof _f2.places=="number"?_f2.places:0;
if(_f3){
_f3++;
}
if(typeof _f2.max!="number"){
_f2.max=9*Math.pow(10,15-_f3);
}
if(typeof _f2.min!="number"){
_f2.min=-9*Math.pow(10,15-_f3);
}
this.inherited(arguments,[_f2]);
if(this.focusNode&&this.focusNode.value&&!isNaN(this.value)){
this.set("value",this.value);
}
},_onFocus:function(){
if(this.disabled){
return;
}
var val=this.get("value");
if(typeof val=="number"&&!isNaN(val)){
var _f4=this.format(val,this.constraints);
if(_f4!==undefined){
this.textbox.value=_f4;
}
}
this.inherited(arguments);
},format:function(_f5,_f6){
var _f7=String(_f5);
if(typeof _f5!="number"){
return _f7;
}
if(isNaN(_f5)){
return "";
}
if(!("rangeCheck" in this&&this.rangeCheck(_f5,_f6))&&_f6.exponent!==false&&/\de[-+]?\d/i.test(_f7)){
return _f7;
}
if(this.editOptions&&this._focused){
_f6=dojo.mixin({},_f6,this.editOptions);
}
return this._formatter(_f5,_f6);
},_parser:dojo.number.parse,parse:function(_f8,_f9){
var v=this._parser(_f8,dojo.mixin({},_f9,(this.editOptions&&this._focused)?this.editOptions:{}));
if(this.editOptions&&this._focused&&isNaN(v)){
v=this._parser(_f8,_f9);
}
return v;
},_getDisplayedValueAttr:function(){
var v=this.inherited(arguments);
return isNaN(v)?this.textbox.value:v;
},filter:function(_fa){
return (_fa===null||_fa===""||_fa===undefined)?NaN:this.inherited(arguments);
},serialize:function(_fb,_fc){
return (typeof _fb!="number"||isNaN(_fb))?"":this.inherited(arguments);
},_setBlurValue:function(){
var val=dojo.hitch(dojo.mixin({},this,{_focused:true}),"get")("value");
this._setValueAttr(val,true);
},_setValueAttr:function(_fd,_fe,_ff){
if(_fd!==undefined&&_ff===undefined){
_ff=String(_fd);
if(typeof _fd=="number"){
if(isNaN(_fd)){
_ff="";
}else{
if(("rangeCheck" in this&&this.rangeCheck(_fd,this.constraints))||this.constraints.exponent===false||!/\de[-+]?\d/i.test(_ff)){
_ff=undefined;
}
}
}else{
if(!_fd){
_ff="";
_fd=NaN;
}else{
_fd=undefined;
}
}
}
this.inherited(arguments,[_fd,_fe,_ff]);
},_getValueAttr:function(){
var v=this.inherited(arguments);
if(isNaN(v)&&this.textbox.value!==""){
if(this.constraints.exponent!==false&&/\de[-+]?\d/i.test(this.textbox.value)&&(new RegExp("^"+dojo.number._realNumberRegexp(dojo.mixin({},this.constraints))+"$").test(this.textbox.value))){
var n=Number(this.textbox.value);
return isNaN(n)?undefined:n;
}else{
return undefined;
}
}else{
return v;
}
},isValid:function(_100){
if(!this._focused||this._isEmpty(this.textbox.value)){
return this.inherited(arguments);
}else{
var v=this.get("value");
if(!isNaN(v)&&this.rangeCheck(v,this.constraints)){
if(this.constraints.exponent!==false&&/\de[-+]?\d/i.test(this.textbox.value)){
return true;
}else{
return this.inherited(arguments);
}
}else{
return false;
}
}
}});
dojo.declare("dijit.form.NumberTextBox",[dijit.form.RangeBoundTextBox,dijit.form.NumberTextBoxMixin],{baseClass:"dijitTextBox dijitNumberTextBox"});
}
if(!dojo._hasResource["dijit.form.NumberSpinner"]){
dojo._hasResource["dijit.form.NumberSpinner"]=true;
dojo.provide("dijit.form.NumberSpinner");
dojo.declare("dijit.form.NumberSpinner",[dijit.form._Spinner,dijit.form.NumberTextBoxMixin],{adjust:function(val,_101){
var tc=this.constraints,v=isNaN(val),_102=!isNaN(tc.max),_103=!isNaN(tc.min);
if(v&&_101!=0){
val=(_101>0)?_103?tc.min:_102?tc.max:0:_102?this.constraints.max:_103?tc.min:0;
}
var _104=val+_101;
if(v||isNaN(_104)){
return val;
}
if(_102&&(_104>tc.max)){
_104=tc.max;
}
if(_103&&(_104<tc.min)){
_104=tc.min;
}
return _104;
},_onKeyPress:function(e){
if((e.charOrCode==dojo.keys.HOME||e.charOrCode==dojo.keys.END)&&!(e.ctrlKey||e.altKey||e.metaKey)&&typeof this.get("value")!="undefined"){
var _105=this.constraints[(e.charOrCode==dojo.keys.HOME?"min":"max")];
if(typeof _105=="number"){
this._setValueAttr(_105,false);
}
dojo.stopEvent(e);
}
}});
}
if(!dojo._hasResource["dojo.cldr.monetary"]){
dojo._hasResource["dojo.cldr.monetary"]=true;
dojo.provide("dojo.cldr.monetary");
dojo.getObject("cldr.monetary",true,dojo);
dojo.cldr.monetary.getData=function(code){
var _106={ADP:0,AFN:0,ALL:0,AMD:0,BHD:3,BIF:0,BYR:0,CLF:0,CLP:0,COP:0,CRC:0,DJF:0,ESP:0,GNF:0,GYD:0,HUF:0,IDR:0,IQD:0,IRR:3,ISK:0,ITL:0,JOD:3,JPY:0,KMF:0,KPW:0,KRW:0,KWD:3,LAK:0,LBP:0,LUF:0,LYD:3,MGA:0,MGF:0,MMK:0,MNT:0,MRO:0,MUR:0,OMR:3,PKR:0,PYG:0,RSD:0,RWF:0,SLL:0,SOS:0,STD:0,SYP:0,TMM:0,TND:3,TRL:0,TZS:0,UGX:0,UZS:0,VND:0,VUV:0,XAF:0,XOF:0,XPF:0,YER:0,ZMK:0,ZWD:0};
var _107={CHF:5};
var _108=_106[code],_109=_107[code];
if(typeof _108=="undefined"){
_108=2;
}
if(typeof _109=="undefined"){
_109=0;
}
return {places:_108,round:_109};
};
}
if(!dojo._hasResource["dojo.currency"]){
dojo._hasResource["dojo.currency"]=true;
dojo.provide("dojo.currency");
dojo.getObject("currency",true,dojo);
dojo.currency._mixInDefaults=function(_10a){
_10a=_10a||{};
_10a.type="currency";
var _10b=dojo.i18n.getLocalization("dojo.cldr","currency",_10a.locale)||{};
var iso=_10a.currency;
var data=dojo.cldr.monetary.getData(iso);
dojo.forEach(["displayName","symbol","group","decimal"],function(prop){
data[prop]=_10b[iso+"_"+prop];
});
data.fractional=[true,false];
return dojo.mixin(data,_10a);
};
dojo.currency.format=function(_10c,_10d){
return dojo.number.format(_10c,dojo.currency._mixInDefaults(_10d));
};
dojo.currency.regexp=function(_10e){
return dojo.number.regexp(dojo.currency._mixInDefaults(_10e));
};
dojo.currency.parse=function(_10f,_110){
return dojo.number.parse(_10f,dojo.currency._mixInDefaults(_110));
};
}
if(!dojo._hasResource["dijit.form.CurrencyTextBox"]){
dojo._hasResource["dijit.form.CurrencyTextBox"]=true;
dojo.provide("dijit.form.CurrencyTextBox");
dojo.declare("dijit.form.CurrencyTextBox",dijit.form.NumberTextBox,{currency:"",baseClass:"dijitTextBox dijitCurrencyTextBox",regExpGen:function(_111){
return "("+(this._focused?this.inherited(arguments,[dojo.mixin({},_111,this.editOptions)])+"|":"")+dojo.currency.regexp(_111)+")";
},_formatter:dojo.currency.format,_parser:dojo.currency.parse,parse:function(_112,_113){
var v=this.inherited(arguments);
if(isNaN(v)&&/\d+/.test(_112)){
v=dojo.hitch(dojo.mixin({},this,{_parser:dijit.form.NumberTextBox.prototype._parser}),"inherited")(arguments);
}
return v;
},_setConstraintsAttr:function(_114){
if(!_114.currency&&this.currency){
_114.currency=this.currency;
}
this.inherited(arguments,[dojo.currency._mixInDefaults(dojo.mixin(_114,{exponent:false}))]);
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.Number"]){
dojo._hasResource["wm.base.widget.Editors.Number"]=true;
dojo.provide("wm.base.widget.Editors.Number");
dijit.form.NumberTextBox.extend({format:function(_115,_116){
var _117=String(_115);
if(typeof _115!="number"){
return _117;
}
if(isNaN(_115)){
return "";
}
if(!("rangeCheck" in this&&this.rangeCheck(_115,_116))&&_116.exponent!==false&&/de[-+]?d/i.test(_117)){
return _117;
}
_116=dojo.mixin({},_116,this.editOptions);
return this._formatter(_115,_116);
}});
dojo.declare("wm.Number",wm.Text,{spinnerButtons:false,minimum:"",maximum:"",places:"",_messages:{rangeMin:"Minimum number must be less than the maximum setting of ${0}.",rangeMax:"Maximum number must be greater than the minimum setting of ${0}."},rangeMessage:"",validationEnabled:function(){
return true;
},connectEditor:function(){
this.inherited(arguments);
if(this.spinnerButtons){
this.addEditorConnect(this.editor,"onClick",this,"changed");
}
},getEditorConstraints:function(){
var _118={};
if(!isNaN(parseInt(this.minimum))){
_118.min=Number(this.minimum);
}
if(!isNaN(parseInt(this.maximum))){
_118.max=Number(this.maximum);
}
if(this.places){
var _119=this._getPlaces();
if(_119&&_119!=""){
_118.places=parseInt(_119)!=NaN?parseInt(_119):_119;
}
}
return _118;
},getEditorProps:function(_11a,_11b){
var v=this.displayValue;
var _11c=this.getEditorConstraints();
var p=dojo.mixin(this.inherited(arguments),{constraints:_11c,rangeMessage:this.rangeMessage,required:this.required,value:v?Number(v):"",editOptions:{}},_11b||{});
if(this.places){
p.editOptions.places=Number(this.places);
}
return p;
},_getPlaces:function(){
return "";
},_createEditor:function(_11d,_11e){
if(this.spinnerButtons){
return new dijit.form.NumberSpinner(this.getEditorProps(_11d,_11e));
}else{
return new dijit.form.NumberTextBox(this.getEditorProps(_11d,_11e));
}
},setMaximum:function(_11f){
var v=(_11f==="")?"":Number(_11f);
if(this.minimum===""||this.minimum<v||v===""){
this.maximum=v;
if(this.editor){
this.editor._setConstraintsAttr(this.getEditorConstraints());
this.editor.validate();
}
}else{
if(this.isDesignLoaded()&&!(this.$.binding&&this.$.binding.wires.maximum)){
app.alert(dojo.string.substitute(this._messages.rangeMax,[this.minimum]));
}
}
},setMinimum:function(_120){
var v=(_120==="")?"":Number(_120);
if(this.maximum===""||v<this.maximum||v===""){
this.minimum=v;
if(this.editor){
this.editor._setConstraintsAttr(this.getEditorConstraints());
this.editor.validate();
}
}else{
if(this.isDesignLoaded()&&!(this.$.binding&&this.$.binding.wires.minimum)){
app.alert(dojo.string.substitute(this._messages.rangeMin,[this.maximum]));
}
}
},_getReadonlyValue:function(){
return dojo.number.format(this.getDataValue(),this.getFormatProps());
},getFormatProps:function(){
var _121={};
if(this.places&&this.places!=""){
_121.places=parseInt(this.places);
}
return _121;
},setSpinnerButtons:function(_122){
if(this.spinnerButtons!=_122){
this.spinnerButtons=_122;
this.createEditor();
}
},calcIsDirty:function(a,b){
return a!==b;
}});
dojo.declare("wm.Currency",wm.Number,{currency:"",getEditorProps:function(_123,_124){
var prop=this.inherited(arguments);
if(prop.constraints){
delete prop.constraints.pattern;
}
return dojo.mixin(prop,{currency:this.currency||(this._isDesignLoaded?studio.application.currencyLocale:app.currencyLocale)||"USD"},_124||{});
},_createEditor:function(_125,_126){
return new dijit.form.CurrencyTextBox(this.getEditorProps(_125,_126));
},_getReadonlyValue:function(){
return dojo.currency.format(this.dataValue,{currency:this.currency||(this._isDesignLoaded?studio.application.currencyLocale:app.currencyLocale)||"USD",places:parseInt(this.places)});
},_getPlaces:function(){
return this.places;
},setEditorValue:function(_127){
var v=_127;
if(this.editor){
v=dojo.currency.parse(dojo.currency.format(String(v).replace(/[^0-9\-\.]/g,""),this.editor.constraints),this.editor.constraints);
}
wm.AbstractEditor.prototype.setEditorValue.call(this,v);
},getDataValue:function(){
return this.dataValue;
},editorChanged:function(){
var _128=this.dataValue;
this.dataValue=this.getEditorValue();
var _129=this.displayValue;
this.displayValue=this._getReadonlyValue();
var _12a=false;
if(_128!=this._lastValue){
this.valueChanged("dataValue",this.dataValue);
_12a=true;
}
if(_129!=this.displayValue){
this.valueChanged("displayValue",this.displayValue);
_12a=true;
}
if(_12a){
if(this._inPostInit){
this._lastValue=this.dataValue;
}
this.updateIsDirty();
}
return _12a;
},setCurrency:function(_12b){
this.currency=_12b;
this.createEditor();
}});
dojo.declare("wm.Slider",wm.AbstractEditor,{minimum:0,maximum:100,showButtons:true,discreteValues:"",verticalSlider:false,editorBorder:false,reflow:function(){
},setVerticalSlider:function(_12c){
this.verticalSlider=_12c;
if(this.editor){
this.createEditor();
}
if(this.verticalSlider){
this.editor.incrementButton.style.width="auto";
this.editor.decrementButton.style.width="auto";
}
},getEditorProps:function(_12d,_12e){
var v=this.displayValue;
var minV=Number(this.minimum)?Number(this.minimum):0;
if(!v||(Number(v)<minV)){
v=this.displayValue=minV;
}
return dojo.mixin(this.inherited(arguments),{minimum:Number(this.minimum),maximum:Number(this.maximum),showButtons:Boolean(this.showButtons),discreteValues:Number(this.discreteValues)||Infinity,value:v},_12e||{});
},setMaximum:function(_12f){
this.maximum=(_12f==="")?100:Number(_12f);
if(this.editor){
this.editor.maximum=this.maximum;
this.editor._setValueAttr(this.dataValue,true);
}
},setMinimum:function(_130){
this.minimum=(_130==="")?0:Number(_130);
if(this.editor){
this.editor.minimum=this.minimum;
this.editor._setValueAttr(this.dataValue,true);
}
},_createEditor:function(_131,_132){
var div=dojo.create("div");
var _133;
if(this.verticalSlider){
_133=new dijit.form.VerticalSlider(this.getEditorProps(_131,_132));
}else{
_133=new dijit.form.HorizontalSlider(this.getEditorProps(_131,_132));
}
div.appendChild(_133.domNode);
_133.domNode=div;
return _133;
},sizeEditor:function(){
if(this._cupdating){
return;
}
this.inherited(arguments);
this.editor._setStyleAttr("height: "+this.editor.domNode.style.height+";width:"+this.editor.domNode.style.width);
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.Base"]){
dojo._hasResource["wm.base.widget.Editors.Base"]=true;
dojo.provide("wm.base.widget.Editors.Base");
wm.propertyIsChanged=function(_134,_135,_136){
var p=(_136||0).prototype;
return p&&p[_135]!==_134;
};
wm.defaultEmptyValue=function(_137){
switch(_137){
case "Text":
return "";
case "Number":
return 0;
}
};
wm.createFieldEditor=function(_138,_139,_13a,_13b,_13c){
var _13d=dojo.mixin({},wm.getFieldEditorProps(_139),_13a);
var name=wm.getValidJsName(_13d.name||"editor1");
return _138.owner.loadComponent(name,_138,_13c||"wm._TextEditor1",_13d,_13b);
};
dojo.declare("wm._BaseEditor",wm.Widget,{classNames:"wmeditor",width:"100%",height:"100%",editorBorder:true,border:0,changeOnKey:false,changeOnEnter:false,required:false,showMessages:true,init:function(){
this._editorConnects=[];
this.name="editor";
this.setOwner(this.parent);
this.singleLine=this.owner.singleLine;
this.readonly=this.owner.readonly;
this.disabled=this.owner.disabled;
this.inherited(arguments);
},postInit:function(){
this.createEditor();
this.inherited(arguments);
},destroy:function(){
this.destroyEditor();
this.inherited(arguments);
},createEditor:function(_13e){
this.destroyEditor();
var n=document.createElement("div");
this.domNode.appendChild(n);
this.startTimerWithName("CreateDijit",this.declaredClass);
this.editor=this._createEditor(n,_13e);
this.stopTimerWithName("CreateDijit",this.declaredClass);
if(this.editor){
this.styleEditor();
if(this.validationEnabled()){
this.validatorNode=this._getValidatorNode();
}
this.sizeEditor();
this.connectEditor();
this.setRequired(this.required);
this.setInitialValue();
this.setReadonly(this.readonly);
}
this.editor.owner=this;
if(this.editor.displayMessage){
this.editor.displayMessage=function(_13f){
if(!this.owner.showMessages){
return;
}
var o=dojo.getObject(this.declaredClass);
if(o){
o.prototype.displayMessage.apply(this,arguments);
}
};
}
return this.editor;
},validationEnabled:function(){
if(this.isLoading()){
return false;
}else{
return true;
}
},_createEditor:function(_140,_141){
return new dijit.form.TextBox(this.getEditorProps(_140,_141));
},destroyEditor:function(){
this.disconnectEditor();
wm.fire(this.editor,"destroy");
this.editor=null;
},styleEditor:function(){
},sizeEditor:function(){
if(this._cupdating){
return;
}
var e=this.editor;
if(e){
var _142=this.getContentBounds(),_143=_142.h?_142.h-2+"px":"",_144=_142.w?_142.w-4:"",d=e&&e.domNode,s=d.style,fc=d&&d.firstChild;
if(this._editorPaddingLeft){
_144-=this._editorPaddingLeft;
}
if(this._editorPaddingRight){
_144-=this._editorPaddingRight;
}
if(_144){
_144+="px";
}
if(!this.editorBorder){
s.border=0;
}
s.backgroundColor=this.editorBorder?"":"transparent";
s.backgroundImage=this.editorBorder?"":"none";
s.width=_144;
if(_143){
if(fc){
dojo.forEach(fc.childNodes,function(c){
if(c.style){
c.style.height=_143;
}
});
}
if(e.focusNode&&e.focusNode.style){
e.focusNode.style.height=_143;
}
}
}
},renderBounds:function(){
this.inherited(arguments);
this.sizeEditor();
},setEditorBorder:function(_145){
this.editorBorder=_145;
this.render();
},addEditorConnect:function(_146){
this._editorConnects.push(dojo.connect.apply(dojo,arguments));
},connectEditor:function(){
this.disconnectEditor();
this.addEditorConnect(this.editor,"onChange",this,"changed");
this.addEditorConnect(this.editor,"onBlur",this,"blurred");
this.addEditorConnect(this.editor,"_onFocus",this,"focused");
this.addEditorConnect(this.editor.domNode,"onkeypress",this,"keypressed");
this.addEditorConnect(this.editor.domNode,"onkeypress",this,"dokeypress");
if(this.validationEnabled()){
this.addEditorConnect(this.editor,"validate",this,"editorValidated");
}
},disconnectEditor:function(){
dojo.forEach(this._editorConnects,dojo.disconnect);
this._editorConnects=[];
},invalidate:function(){
delete this._isValid;
},keypressed:function(){
this.validate();
},blurred:function(){
this.validate();
this.owner.doOnblur();
},doOnblur:function(){
if(!this.disabled){
this.onblur();
}
},focused:function(){
this.owner.doOnfocus();
},changed:function(){
this.validate();
this.owner.doOnchange();
},_getValidatorNode:function(){
var n=this.editor&&this.editor.domNode.firstChild;
if(!n){
return null;
}
for(var i=0,c,_147=n.childNodes;c=_147[i];i++){
if(dojo.hasClass(c,"dijitValidationIcon")){
return c;
}
}
},editorValidated:function(){
if(this.validatorNode){
this.validatorNode.style.display=this.editor.state=="Error"?"":"none";
}
},validate:function(){
if(this.validationEnabled()){
this.invalidate();
}
wm.job(this.getRuntimeId(),25,dojo.hitch(this,function(){
wm.fire(this.owner,"validate");
}));
},getEditorProps:function(_148,_149){
return dojo.mixin({srcNodeRef:_148,owner:this,disabled:this.owner.disabled},_149||{});
},getInvalid:function(){
if(!this.validationEnabled()){
return false;
}
if(this.editor&&this.editor.isValid){
if(this._isValid===undefined){
this._isValid=this.editor.isValid();
}
return !(this.readonly||this._isValid);
}
},_getReadonlyValue:function(){
return this.getDisplayValue()||"";
},setReadonly:function(_14a){
this.readonly=_14a;
var dn=this.domNode,pn=this.editor.domNode.parentNode;
if(this.readonly){
if(pn==dn){
dn.removeChild(this.editor.domNode);
}
wm.fire(this.editor,"_hideTooltip");
}else{
if(pn!=dn){
dn.innerHTML="";
dn.appendChild(this.editor.domNode);
this.owner.reflow();
}
}
this.updateReadonlyValue();
},updateReadonlyValue:function(){
if(this.readonly&&(!this.editor.domNode.parentNode||!this.editor.domNode.parentNode.id)){
if(wm._CheckBoxEditor&&this instanceof wm._CheckBoxEditor){
this.setReadonlyValue();
}else{
this.domNode.innerHTML=this._getReadonlyValue();
}
}
},getDisplayValue:function(){
return this.editor&&this.editor.declaredClass&&this.editor.get&&this.editor.get("displayedValue")?this.editor.get("displayedValue")||"":this.getEditorValue()||"";
},makeEmptyValue:function(){
switch(this.owner.emptyValue){
case "null":
return null;
case "false":
return false;
case "emptyString":
return "";
case "zero":
return 0;
}
},getEditorValue:function(){
var v;
if(this.editor&&this.editor.get){
v=this.editor.get("value");
}
return (v||v===0)?v:this.makeEmptyValue();
},setEditorValue:function(_14b){
if(this.editor&&this.editor.set){
_14b=_14b===undefined?null:_14b;
var _14c=this.editor.get("value");
this.editor.set("value",_14b,false);
if(_14c!=_14b){
this.changed();
}
this.updateReadonlyValue();
}
},setDisplayValue:function(_14d){
this.setEditorValue(_14d);
},setRequired:function(_14e){
var _14f=this.required;
this.required=_14e;
if(this.editor){
this.editor.required=_14e;
if(this.required||_14f){
this.validate();
wm.fire(this.owner,"requireChanged");
}
}
},setInitialValue:function(){
var o=this.owner;
o.beginEditUpdate();
this.setEditorValue(wm.propertyIsChanged(o.dataValue,"dataValue",wm.Editor)?o.dataValue:o.displayValue);
o.endEditUpdate();
},setDisabled:function(_150){
this.disabled=_150;
if(this.editor&&this.editor.set){
this.editor.set("disabled",_150);
}
},isReady:function(){
return Boolean(this.editor);
},focus:function(){
wm.fire(this.editor,"focus");
},reset:function(){
var e=this.editor;
if(e){
e._hasBeenBlurred=false;
wm.fire(e,"_hideTooltip");
}
},clear:function(){
this.reset();
this.setEditorValue(null);
},listOwnerProperties:function(){
var p=dojo.mixin({},wm.Component.prototype.listProperties.apply(this)||{});
for(var i in p){
if(!p[i].isOwnerProperty){
delete p[i];
}
}
return p;
},listProperties:function(){
var p=dojo.mixin({},this.inherited(arguments)||{});
for(var i in p){
if(p[i].isOwnerProperty){
delete p[i];
}
}
return p;
},valueChanged:function(_151,_152){
if(this._updating){
return;
}
this.inherited(arguments);
},setValueAsEmpty:function(){
this.makeEmptyValue();
},isLoading:function(){
return this.owner._loading;
},dokeypress:function(_153){
if(this.changeOnKey||(this.changeOnEnter&&_153.keyCode==dojo.keys.ENTER)){
wm.onidle(this,"doChangeOnKey",arguments);
}
if(_153.keyCode==dojo.keys.ENTER){
wm.onidle(this,"onEnterKeyPress",[this]);
}
},doChangeOnKey:function(_154){
var e=this.editor;
this.changed();
},onEnterKeyPress:function(){
}});
wm.Object.extendSchema(wm._BaseEditor,{onEnterKeyPress:{ignore:1},name:{ignore:1},showing:{ignore:1},disabled:{ignore:1},singleLine:{ignore:1},readonly:{ignore:1},border:{ignore:1},borderColor:{ignore:1},margin:{ignore:1},padding:{ignore:1},scrollX:{ignore:1},scrollY:{ignore:1}});
}
if(!dojo._hasResource["dijit.form.DropDownButton"]){
dojo._hasResource["dijit.form.DropDownButton"]=true;
dojo.provide("dijit.form.DropDownButton");
}
if(!dojo._hasResource["dijit.Calendar"]){
dojo._hasResource["dijit.Calendar"]=true;
dojo.provide("dijit.Calendar");
dojo.declare("dijit.Calendar",[dijit._Widget,dijit._Templated,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/Calendar.html","<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" dojoAttachEvent=\"onkeypress: _onKeyPress\" aria-labelledby=\"${id}_year\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\" dojoAttachPoint=\"monthDropDownButton\"\n\t\t\t\t\tid=\"${id}_mddb\" tabIndex=\"-1\">\n\t\t\t\t</div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\" role=\"gridcell\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n"),widgetsInTemplate:true,value:new Date(""),datePackage:"dojo.date",dayWidth:"narrow",tabIndex:"0",currentFocus:new Date(),baseClass:"dijitCalendar",cssStateNodes:{"decrementMonth":"dijitCalendarArrow","incrementMonth":"dijitCalendarArrow","previousYearLabelNode":"dijitCalendarPreviousYear","nextYearLabelNode":"dijitCalendarNextYear"},_isValidDate:function(_155){
return _155&&!isNaN(_155)&&typeof _155=="object"&&_155.toString()!=this.constructor.prototype.value.toString();
},setValue:function(_156){
dojo.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_156);
},_getValueAttr:function(){
var _157=new this.dateClassObj(this.value);
_157.setHours(0,0,0,0);
if(_157.getDate()<this.value.getDate()){
_157=this.dateFuncObj.add(_157,"hour",1);
}
return _157;
},_setValueAttr:function(_158,_159){
if(_158){
_158=new this.dateClassObj(_158);
}
if(this._isValidDate(_158)){
if(!this._isValidDate(this.value)||this.dateFuncObj.compare(_158,this.value)){
_158.setHours(1,0,0,0);
if(!this.isDisabledDate(_158,this.lang)){
this._set("value",_158);
this.set("currentFocus",_158);
if(_159||typeof _159=="undefined"){
this.onChange(this.get("value"));
this.onValueSelected(this.get("value"));
}
}
}
}else{
this._set("value",null);
this.set("currentFocus",this.currentFocus);
}
},_setText:function(node,text){
while(node.firstChild){
node.removeChild(node.firstChild);
}
node.appendChild(dojo.doc.createTextNode(text));
},_populateGrid:function(){
var _15a=new this.dateClassObj(this.currentFocus);
_15a.setDate(1);
var _15b=_15a.getDay(),_15c=this.dateFuncObj.getDaysInMonth(_15a),_15d=this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(_15a,"month",-1)),_15e=new this.dateClassObj(),_15f=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
if(_15f>_15b){
_15f-=7;
}
dojo.query(".dijitCalendarDateTemplate",this.domNode).forEach(function(_160,i){
i+=_15f;
var date=new this.dateClassObj(_15a),_161,_162="dijitCalendar",adj=0;
if(i<_15b){
_161=_15d-_15b+i+1;
adj=-1;
_162+="Previous";
}else{
if(i>=(_15b+_15c)){
_161=i-_15b-_15c+1;
adj=1;
_162+="Next";
}else{
_161=i-_15b+1;
_162+="Current";
}
}
if(adj){
date=this.dateFuncObj.add(date,"month",adj);
}
date.setDate(_161);
if(!this.dateFuncObj.compare(date,_15e,"date")){
_162="dijitCalendarCurrentDate "+_162;
}
if(this._isSelectedDate(date,this.lang)){
_162="dijitCalendarSelectedDate "+_162;
}
if(this.isDisabledDate(date,this.lang)){
_162="dijitCalendarDisabledDate "+_162;
}
var _163=this.getClassForDate(date,this.lang);
if(_163){
_162=_163+" "+_162;
}
_160.className=_162+"Month dijitCalendarDateTemplate";
_160.dijitDateValue=date.valueOf();
dojo.attr(_160,"dijitDateValue",date.valueOf());
var _164=dojo.query(".dijitCalendarDateLabel",_160)[0],text=date.getDateLocalized?date.getDateLocalized(this.lang):date.getDate();
this._setText(_164,text);
},this);
var _165=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,_15a);
this.monthDropDownButton.dropDown.set("months",_165);
this.monthDropDownButton.containerNode.innerHTML=(dojo.isIE==6?"":"<div class='dijitSpacer'>"+this.monthDropDownButton.dropDown.domNode.innerHTML+"</div>")+"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>"+_165[_15a.getMonth()]+"</div>";
var y=_15a.getFullYear()-1;
var d=new this.dateClassObj();
dojo.forEach(["previous","current","next"],function(name){
d.setFullYear(y++);
this._setText(this[name+"YearLabelNode"],this.dateLocaleModule.format(d,{selector:"year",locale:this.lang}));
},this);
},goToToday:function(){
this.set("value",new this.dateClassObj());
},constructor:function(args){
var _166=(args.datePackage&&(args.datePackage!="dojo.date"))?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_166,false);
this.datePackage=args.datePackage||this.datePackage;
this.dateFuncObj=dojo.getObject(this.datePackage,false);
this.dateLocaleModule=dojo.getObject(this.datePackage+".locale",false);
},postMixInProperties:function(){
if(isNaN(this.value)){
delete this.value;
}
this.inherited(arguments);
},buildRendering:function(){
this.inherited(arguments);
dojo.setSelectable(this.domNode,false);
var _167=dojo.hitch(this,function(_168,n){
var _169=dojo.query(_168,this.domNode)[0];
for(var i=0;i<n;i++){
_169.parentNode.appendChild(_169.cloneNode(true));
}
});
_167(".dijitCalendarDayLabelTemplate",6);
_167(".dijitCalendarDateTemplate",6);
_167(".dijitCalendarWeekTemplate",5);
var _16a=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang);
var _16b=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
dojo.query(".dijitCalendarDayLabel",this.domNode).forEach(function(_16c,i){
this._setText(_16c,_16a[(i+_16b)%7]);
},this);
var _16d=new this.dateClassObj(this.currentFocus);
this.monthDropDownButton.dropDown=new dijit.Calendar._MonthDropDown({id:this.id+"_mdd",onChange:dojo.hitch(this,"_onMonthSelect")});
this.set("currentFocus",_16d,false);
var _16e=this;
var _16f=function(_170,_171,adj){
_16e._connects.push(dijit.typematic.addMouseListener(_16e[_170],_16e,function(_172){
if(_172>=0){
_16e._adjustDisplay(_171,adj);
}
},0.8,500));
};
_16f("incrementMonth","month",1);
_16f("decrementMonth","month",-1);
_16f("nextYearLabelNode","year",1);
_16f("previousYearLabelNode","year",-1);
},_adjustDisplay:function(part,_173){
this._setCurrentFocusAttr(this.dateFuncObj.add(this.currentFocus,part,_173));
},_setCurrentFocusAttr:function(date,_174){
var _175=this.currentFocus,_176=_175?dojo.query("[dijitDateValue="+_175.valueOf()+"]",this.domNode)[0]:null;
date=new this.dateClassObj(date);
date.setHours(1,0,0,0);
this._set("currentFocus",date);
this._populateGrid();
var _177=dojo.query("[dijitDateValue="+date.valueOf()+"]",this.domNode)[0];
_177.setAttribute("tabIndex",this.tabIndex);
if(this._focused||_174){
_177.focus();
}
if(_176&&_176!=_177){
if(dojo.isWebKit){
_176.setAttribute("tabIndex","-1");
}else{
_176.removeAttribute("tabIndex");
}
}
},focus:function(){
this._setCurrentFocusAttr(this.currentFocus,true);
},_onMonthSelect:function(_178){
this.currentFocus=this.dateFuncObj.add(this.currentFocus,"month",_178-this.currentFocus.getMonth());
this._populateGrid();
},_onDayClick:function(evt){
dojo.stopEvent(evt);
for(var node=evt.target;node&&!node.dijitDateValue;node=node.parentNode){
}
if(node&&!dojo.hasClass(node,"dijitCalendarDisabledDate")){
this.set("value",node.dijitDateValue);
}
},_onDayMouseOver:function(evt){
var node=dojo.hasClass(evt.target,"dijitCalendarDateLabel")?evt.target.parentNode:evt.target;
if(node&&(node.dijitDateValue||node==this.previousYearLabelNode||node==this.nextYearLabelNode)){
dojo.addClass(node,"dijitCalendarHoveredDate");
this._currentNode=node;
}
},_onDayMouseOut:function(evt){
if(!this._currentNode){
return;
}
if(evt.relatedTarget&&evt.relatedTarget.parentNode==this._currentNode){
return;
}
var cls="dijitCalendarHoveredDate";
if(dojo.hasClass(this._currentNode,"dijitCalendarActiveDate")){
cls+=" dijitCalendarActiveDate";
}
dojo.removeClass(this._currentNode,cls);
this._currentNode=null;
},_onDayMouseDown:function(evt){
var node=evt.target.parentNode;
if(node&&node.dijitDateValue){
dojo.addClass(node,"dijitCalendarActiveDate");
this._currentNode=node;
}
},_onDayMouseUp:function(evt){
var node=evt.target.parentNode;
if(node&&node.dijitDateValue){
dojo.removeClass(node,"dijitCalendarActiveDate");
}
},handleKey:function(evt){
var dk=dojo.keys,_179=-1,_17a,_17b=this.currentFocus;
switch(evt.keyCode){
case dk.RIGHT_ARROW:
_179=1;
case dk.LEFT_ARROW:
_17a="day";
if(!this.isLeftToRight()){
_179*=-1;
}
break;
case dk.DOWN_ARROW:
_179=1;
case dk.UP_ARROW:
_17a="week";
break;
case dk.PAGE_DOWN:
_179=1;
case dk.PAGE_UP:
_17a=evt.ctrlKey||evt.altKey?"year":"month";
break;
case dk.END:
_17b=this.dateFuncObj.add(_17b,"month",1);
_17a="day";
case dk.HOME:
_17b=new this.dateClassObj(_17b);
_17b.setDate(1);
break;
case dk.ENTER:
case dk.SPACE:
this.set("value",this.currentFocus);
break;
default:
return true;
}
if(_17a){
_17b=this.dateFuncObj.add(_17b,_17a,_179);
}
this._setCurrentFocusAttr(_17b);
return false;
},_onKeyPress:function(evt){
if(!this.handleKey(evt)){
dojo.stopEvent(evt);
}
},onValueSelected:function(date){
},onChange:function(date){
},_isSelectedDate:function(_17c,_17d){
return this._isValidDate(this.value)&&!this.dateFuncObj.compare(_17c,this.value,"date");
},isDisabledDate:function(_17e,_17f){
},getClassForDate:function(_180,_181){
}});
dojo.declare("dijit.Calendar._MonthDropDown",[dijit._Widget,dijit._Templated],{months:[],templateString:"<div class='dijitCalendarMonthMenu dijitMenu' "+"dojoAttachEvent='onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'></div>",_setMonthsAttr:function(_182){
this.domNode.innerHTML=dojo.map(_182,function(_183,idx){
return _183?"<div class='dijitCalendarMonthLabel' month='"+idx+"'>"+_183+"</div>":"";
}).join("");
},_onClick:function(evt){
this.onChange(dojo.attr(evt.target,"month"));
},onChange:function(_184){
},_onMenuHover:function(evt){
dojo.toggleClass(evt.target,"dijitCalendarMonthLabelHover",evt.type=="mouseover");
}});
}
if(!dojo._hasResource["dijit.form._DateTimeTextBox"]){
dojo._hasResource["dijit.form._DateTimeTextBox"]=true;
dojo.provide("dijit.form._DateTimeTextBox");
new Date("X");
dojo.declare("dijit.form._DateTimeTextBox",[dijit.form.RangeBoundTextBox,dijit._HasDropDown],{templateString:dojo.cache("dijit.form","templates/DropDownBox.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),hasDownArrow:true,openOnClick:true,regExpGen:dojo.date.locale.regexp,datePackage:"dojo.date",compare:function(val1,val2){
var _185=this._isInvalidDate(val1);
var _186=this._isInvalidDate(val2);
return _185?(_186?0:-1):(_186?1:dojo.date.compare(val1,val2,this._selector));
},forceWidth:true,format:function(_187,_188){
if(!_187){
return "";
}
return this.dateLocaleModule.format(_187,_188);
},"parse":function(_189,_18a){
return this.dateLocaleModule.parse(_189,_18a)||(this._isEmpty(_189)?null:undefined);
},serialize:function(val,_18b){
if(val.toGregorian){
val=val.toGregorian();
}
return dojo.date.stamp.toISOString(val,_18b);
},dropDownDefaultValue:new Date(),value:new Date(""),_blankValue:null,popupClass:"",_selector:"",constructor:function(args){
var _18c=args.datePackage?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_18c,false);
this.value=new this.dateClassObj("");
this.datePackage=args.datePackage||this.datePackage;
this.dateLocaleModule=dojo.getObject(this.datePackage+".locale",false);
this.regExpGen=this.dateLocaleModule.regexp;
this._invalidDate=dijit.form._DateTimeTextBox.prototype.value.toString();
},buildRendering:function(){
this.inherited(arguments);
if(!this.hasDownArrow){
this._buttonNode.style.display="none";
}
if(this.openOnClick||!this.hasDownArrow){
this._buttonNode=this.domNode;
this.baseClass+=" dijitComboBoxOpenOnClick";
}
},_setConstraintsAttr:function(_18d){
_18d.selector=this._selector;
_18d.fullYear=true;
var _18e=dojo.date.stamp.fromISOString;
if(typeof _18d.min=="string"){
_18d.min=_18e(_18d.min);
}
if(typeof _18d.max=="string"){
_18d.max=_18e(_18d.max);
}
this.inherited(arguments);
},_isInvalidDate:function(_18f){
return !_18f||isNaN(_18f)||typeof _18f!="object"||_18f.toString()==this._invalidDate;
},_setValueAttr:function(_190,_191,_192){
if(_190!==undefined){
if(typeof _190=="string"){
_190=dojo.date.stamp.fromISOString(_190);
}
if(this._isInvalidDate(_190)){
_190=null;
}
if(_190 instanceof Date&&!(this.dateClassObj instanceof Date)){
_190=new this.dateClassObj(_190);
}
}
this.inherited(arguments);
if(this.dropDown){
this.dropDown.set("value",_190,false);
}
},_set:function(attr,_193){
if(attr=="value"&&this.value instanceof Date&&this.compare(_193,this.value)==0){
return;
}
this.inherited(arguments);
},_setDropDownDefaultValueAttr:function(val){
if(this._isInvalidDate(val)){
val=new this.dateClassObj();
}
this.dropDownDefaultValue=val;
},openDropDown:function(_194){
if(this.dropDown){
this.dropDown.destroy();
}
var _195=dojo.getObject(this.popupClass,false),_196=this,_197=this.get("value");
this.dropDown=new _195({onChange:function(_198){
dijit.form._DateTimeTextBox.superclass._setValueAttr.call(_196,_198,true);
},id:this.id+"_popup",dir:_196.dir,lang:_196.lang,value:_197,currentFocus:!this._isInvalidDate(_197)?_197:this.dropDownDefaultValue,constraints:_196.constraints,filterString:_196.filterString,datePackage:_196.datePackage,isDisabledDate:function(date){
return !_196.rangeCheck(date,_196.constraints);
}});
this.inherited(arguments);
},_getDisplayedValueAttr:function(){
return this.textbox.value;
},_setDisplayedValueAttr:function(_199,_19a){
this._setValueAttr(this.parse(_199,this.constraints),_19a,_199);
}});
}
if(!dojo._hasResource["dijit.form.DateTextBox"]){
dojo._hasResource["dijit.form.DateTextBox"]=true;
dojo.provide("dijit.form.DateTextBox");
dojo.declare("dijit.form.DateTextBox",dijit.form._DateTimeTextBox,{baseClass:"dijitTextBox dijitComboBox dijitDateTextBox",popupClass:"dijit.Calendar",_selector:"date",value:new Date("")});
}
if(!dojo._hasResource["dijit._TimePicker"]){
dojo._hasResource["dijit._TimePicker"]=true;
dojo.provide("dijit._TimePicker");
dojo.declare("dijit._TimePicker",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("dijit","templates/TimePicker.html","<div id=\"widget_${id}\" class=\"dijitMenu\"\n    ><div dojoAttachPoint=\"upArrow\" class=\"dijitButtonNode dijitUpArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div></div\n    ><div dojoAttachPoint=\"timeMenu,focusNode\" dojoAttachEvent=\"onclick:_onOptionSelected,onmouseover,onmouseout\"></div\n    ><div dojoAttachPoint=\"downArrow\" class=\"dijitButtonNode dijitDownArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div></div\n></div>\n"),baseClass:"dijitTimePicker",clickableIncrement:"T00:15:00",visibleIncrement:"T01:00:00",visibleRange:"T05:00:00",value:new Date(),_visibleIncrement:2,_clickableIncrement:1,_totalIncrements:10,constraints:{},serialize:dojo.date.stamp.toISOString,setValue:function(_19b){
dojo.deprecated("dijit._TimePicker:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_19b);
},_setValueAttr:function(date){
this._set("value",date);
this._showText();
},_setFilterStringAttr:function(val){
this._set("filterString",val);
this._showText();
},isDisabledDate:function(_19c,_19d){
return false;
},_getFilteredNodes:function(_19e,_19f,_1a0,_1a1){
var _1a2=[],_1a3=_1a1?_1a1.date:this._refDate,n,i=_19e,max=this._maxIncrement+Math.abs(i),chk=_1a0?-1:1,dec=_1a0?1:0,inc=1-dec;
do{
i=i-dec;
n=this._createOption(i);
if(n){
if((_1a0&&n.date>_1a3)||(!_1a0&&n.date<_1a3)){
break;
}
_1a2[_1a0?"unshift":"push"](n);
_1a3=n.date;
}
i=i+inc;
}while(_1a2.length<_19f&&(i*chk)<max);
return _1a2;
},_showText:function(){
var _1a4=dojo.date.stamp.fromISOString;
this.timeMenu.innerHTML="";
this._clickableIncrementDate=_1a4(this.clickableIncrement);
this._visibleIncrementDate=_1a4(this.visibleIncrement);
this._visibleRangeDate=_1a4(this.visibleRange);
var _1a5=function(date){
return date.getHours()*60*60+date.getMinutes()*60+date.getSeconds();
},_1a6=_1a5(this._clickableIncrementDate),_1a7=_1a5(this._visibleIncrementDate),_1a8=_1a5(this._visibleRangeDate),time=(this.value||this.currentFocus).getTime();
this._refDate=new Date(time-time%(_1a7*1000));
this._refDate.setFullYear(1970,0,1);
this._clickableIncrement=1;
this._totalIncrements=_1a8/_1a6;
this._visibleIncrement=_1a7/_1a6;
this._maxIncrement=(60*60*24)/_1a6;
var _1a9=this._getFilteredNodes(0,Math.min(this._totalIncrements>>1,10)-1),_1aa=this._getFilteredNodes(0,Math.min(this._totalIncrements,10)-_1a9.length,true,_1a9[0]);
dojo.forEach(_1aa.concat(_1a9),function(n){
this.timeMenu.appendChild(n);
},this);
},constructor:function(){
this.constraints={};
},postMixInProperties:function(){
this.inherited(arguments);
this._setConstraintsAttr(this.constraints);
},_setConstraintsAttr:function(_1ab){
dojo.mixin(this,_1ab);
if(!_1ab.locale){
_1ab.locale=this.lang;
}
},postCreate:function(){
this.connect(this.timeMenu,dojo.isIE?"onmousewheel":"DOMMouseScroll","_mouseWheeled");
this._connects.push(dijit.typematic.addMouseListener(this.upArrow,this,"_onArrowUp",33,250));
this._connects.push(dijit.typematic.addMouseListener(this.downArrow,this,"_onArrowDown",33,250));
this.inherited(arguments);
},_buttonMouse:function(e){
dojo.toggleClass(e.currentTarget,e.currentTarget==this.upArrow?"dijitUpArrowHover":"dijitDownArrowHover",e.type=="mouseenter"||e.type=="mouseover");
},_createOption:function(_1ac){
var date=new Date(this._refDate);
var _1ad=this._clickableIncrementDate;
date.setHours(date.getHours()+_1ad.getHours()*_1ac,date.getMinutes()+_1ad.getMinutes()*_1ac,date.getSeconds()+_1ad.getSeconds()*_1ac);
if(this.constraints.selector=="time"){
date.setFullYear(1970,0,1);
}
var _1ae=dojo.date.locale.format(date,this.constraints);
if(this.filterString&&_1ae.toLowerCase().indexOf(this.filterString)!==0){
return null;
}
var div=dojo.create("div",{"class":this.baseClass+"Item"});
div.date=date;
div.index=_1ac;
dojo.create("div",{"class":this.baseClass+"ItemInner",innerHTML:_1ae},div);
if(_1ac%this._visibleIncrement<1&&_1ac%this._visibleIncrement>-1){
dojo.addClass(div,this.baseClass+"Marker");
}else{
if(!(_1ac%this._clickableIncrement)){
dojo.addClass(div,this.baseClass+"Tick");
}
}
if(this.isDisabledDate(date)){
dojo.addClass(div,this.baseClass+"ItemDisabled");
}
if(this.value&&!dojo.date.compare(this.value,date,this.constraints.selector)){
div.selected=true;
dojo.addClass(div,this.baseClass+"ItemSelected");
if(dojo.hasClass(div,this.baseClass+"Marker")){
dojo.addClass(div,this.baseClass+"MarkerSelected");
}else{
dojo.addClass(div,this.baseClass+"TickSelected");
}
this._highlightOption(div,true);
}
return div;
},_onOptionSelected:function(tgt){
var _1af=tgt.target.date||tgt.target.parentNode.date;
if(!_1af||this.isDisabledDate(_1af)){
return;
}
this._highlighted_option=null;
this.set("value",_1af);
this.onChange(_1af);
},onChange:function(time){
},_highlightOption:function(node,_1b0){
if(!node){
return;
}
if(_1b0){
if(this._highlighted_option){
this._highlightOption(this._highlighted_option,false);
}
this._highlighted_option=node;
}else{
if(this._highlighted_option!==node){
return;
}else{
this._highlighted_option=null;
}
}
dojo.toggleClass(node,this.baseClass+"ItemHover",_1b0);
if(dojo.hasClass(node,this.baseClass+"Marker")){
dojo.toggleClass(node,this.baseClass+"MarkerHover",_1b0);
}else{
dojo.toggleClass(node,this.baseClass+"TickHover",_1b0);
}
},onmouseover:function(e){
this._keyboardSelected=null;
var tgr=(e.target.parentNode===this.timeMenu)?e.target:e.target.parentNode;
if(!dojo.hasClass(tgr,this.baseClass+"Item")){
return;
}
this._highlightOption(tgr,true);
},onmouseout:function(e){
this._keyboardSelected=null;
var tgr=(e.target.parentNode===this.timeMenu)?e.target:e.target.parentNode;
this._highlightOption(tgr,false);
},_mouseWheeled:function(e){
this._keyboardSelected=null;
dojo.stopEvent(e);
var _1b1=(dojo.isIE?e.wheelDelta:-e.detail);
this[(_1b1>0?"_onArrowUp":"_onArrowDown")]();
},_onArrowUp:function(_1b2){
if(typeof _1b2=="number"&&_1b2==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _1b3=this.timeMenu.childNodes[0].index;
var divs=this._getFilteredNodes(_1b3,1,true,this.timeMenu.childNodes[0]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
this.timeMenu.insertBefore(divs[0],this.timeMenu.childNodes[0]);
}
},_onArrowDown:function(_1b4){
if(typeof _1b4=="number"&&_1b4==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _1b5=this.timeMenu.childNodes[this.timeMenu.childNodes.length-1].index+1;
var divs=this._getFilteredNodes(_1b5,1,false,this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[0]);
this.timeMenu.appendChild(divs[0]);
}
},handleKey:function(e){
var dk=dojo.keys;
if(e.charOrCode==dk.DOWN_ARROW||e.charOrCode==dk.UP_ARROW){
dojo.stopEvent(e);
if(this._highlighted_option&&!this._highlighted_option.parentNode){
this._highlighted_option=null;
}
var _1b6=this.timeMenu,tgt=this._highlighted_option||dojo.query("."+this.baseClass+"ItemSelected",_1b6)[0];
if(!tgt){
tgt=_1b6.childNodes[0];
}else{
if(_1b6.childNodes.length){
if(e.charOrCode==dk.DOWN_ARROW&&!tgt.nextSibling){
this._onArrowDown();
}else{
if(e.charOrCode==dk.UP_ARROW&&!tgt.previousSibling){
this._onArrowUp();
}
}
if(e.charOrCode==dk.DOWN_ARROW){
tgt=tgt.nextSibling;
}else{
tgt=tgt.previousSibling;
}
}
}
this._highlightOption(tgt,true);
this._keyboardSelected=tgt;
return false;
}else{
if(e.charOrCode==dk.ENTER||e.charOrCode===dk.TAB){
if(!this._keyboardSelected&&e.charOrCode===dk.TAB){
return true;
}
if(this._highlighted_option){
this._onOptionSelected({target:this._highlighted_option});
}
return e.charOrCode===dk.TAB;
}
}
}});
}
if(!dojo._hasResource["dijit.form.TimeTextBox"]){
dojo._hasResource["dijit.form.TimeTextBox"]=true;
dojo.provide("dijit.form.TimeTextBox");
dojo.declare("dijit.form.TimeTextBox",dijit.form._DateTimeTextBox,{baseClass:"dijitTextBox dijitComboBox dijitTimeTextBox",popupClass:"dijit._TimePicker",_selector:"time",value:new Date(""),_onKey:function(evt){
this.inherited(arguments);
switch(evt.keyCode){
case dojo.keys.ENTER:
case dojo.keys.TAB:
case dojo.keys.ESCAPE:
case dojo.keys.DOWN_ARROW:
case dojo.keys.UP_ARROW:
break;
default:
setTimeout(dojo.hitch(this,function(){
var val=this.get("displayedValue");
this.filterString=(val&&!this.parse(val,this.constraints))?val.toLowerCase():"";
if(this._opened){
this.closeDropDown();
}
this.openDropDown();
}),0);
}
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.Date"]){
dojo._hasResource["wm.base.widget.Editors.Date"]=true;
dojo.provide("wm.base.widget.Editors.Date");
dojo.declare("wm.Date",wm.Text,{useLocalTime:false,promptMessage:"",invalidMessage:"",minimum:"",maximum:"",dateMode:"Date",validationEnabled:function(){
return true;
},getEditorConstraints:function(){
var _1b7={};
if(this.minimum){
_1b7.min=this.convertValue(this.minimum);
}
if(this.maximum){
_1b7.max=this.convertValue(this.maximum);
}
return _1b7;
},getEditorProps:function(_1b8,_1b9){
var _1ba=this.getEditorConstraints();
var prop=dojo.mixin(this.inherited(arguments),{promptMessage:this.promptMessage,invalidMessage:this.invalidMessage||"$_unset_$",constraints:_1ba,required:this.required,value:this.convertValue(this.displayValue)},_1b9||{});
return prop;
},_createEditor:function(_1bb,_1bc){
return new dijit.form.DateTextBox(this.getEditorProps(_1bb,_1bc));
},convertValue:function(_1bd){
return wm.convertValueToDate(_1bd,{selector:this.dateMode.toLowerCase(),formatLength:this.formatLength,timePattern:this.use24Time?"HH:mm":"hh:mm a"});
},getEditorValue:function(){
var d=this.inherited(arguments);
if(d){
if(!this.useLocalTime){
if(this.dateMode=="Date"){
d.setHours(-wm.timezoneOffset,0,0);
}else{
d=dojo.date.add(d,"hour",-wm.timezoneOffset);
}
}
return d.getTime();
}
return this.makeEmptyValue();
},setEditorValue:function(_1be){
var v=this.convertValue(_1be);
if(!this.useLocalTime&&v){
v=new Date(v);
v.setHours(v.getHours()+wm.timezoneOffset);
}
this.inherited(arguments,[v]);
},setDefaultOnInsert:function(){
if(this.defaultInsert){
if(this.$.binding&&this.$.binding.wires.defaultInsert){
this.$.binding.wires.defaultInsert.refreshValue();
}
this.setDataValue(this.defaultInsert);
this.invalidate();
}
},calcDisplayValue:function(_1bf){
var d=_1bf;
if(d instanceof Date==false){
d=new Date(_1bf);
}
return dojo.date.locale.format(d,{formatLength:this.formatLength,fullYear:true,selector:this.dateMode.toLowerCase(),timePattern:this.use24Time?"HH:mm":"hh:mm a"});
},getDisplayValue:function(){
if(this.editor){
return this.editor.get("displayedValue");
}else{
if(this.dataValue){
return this.calcDisplayValue(this.dataValue);
}else{
return "";
}
}
},setMaximum:function(_1c0){
if(!_1c0){
this.maximum=null;
}else{
this.maximum=_1c0;
}
if(this.editor){
this.editor._setConstraintsAttr(this.getEditorConstraints());
this.editor.validate();
}
},setMinimum:function(_1c1){
if(!_1c1){
this.minimum=null;
}else{
this.minimum=_1c1;
}
if(this.editor){
this.editor._setConstraintsAttr(this.getEditorConstraints());
this.editor.validate();
}
},calcIsDirty:function(val1,val2){
if(val1===undefined||val1===null){
val1=0;
}
if(val2===undefined||val2===null){
val2=0;
}
if(val1 instanceof Date==false){
val1=new Date(val1);
}
if(val2 instanceof Date==false){
var val2=new Date(val2);
}
if(val1&&val2&&val1.getTime()==val2.getTime()){
return false;
}
val1=dojo.date.locale.format(val1,{formatLength:this.formatLength||"short",selector:this.dateMode.toLowerCase(),timePattern:this.use24Time?"HH:mm":"hh:mm a"});
val2=dojo.date.locale.format(val2,{formatLength:this.formatLength||"short",selector:this.dateMode.toLowerCase(),timePattern:this.use24Time?"HH:mm":"hh:mm a"});
return val1!=val2;
}});
dojo.declare("wm.Time",wm.Date,{timePattern:"HH:mm a",setDataValue:function(_1c2){
if(_1c2){
var d=new Date(_1c2);
d.setYear(1970);
d.setMonth(0);
d.setDate(1);
}
this.inherited(arguments,[_1c2?d.getTime():null]);
},getEditorProps:function(_1c3,_1c4){
var prop=dojo.mixin(this.inherited(arguments),{constraints:{timePattern:this.timePattern}},_1c4||{});
return prop;
},convertValue:function(_1c5){
return wm.convertValueToDate(_1c5,{selector:"time"});
},_createEditor:function(_1c6,_1c7){
return new dijit.form.TimeTextBox(this.getEditorProps(_1c6,_1c7));
},getEditorValue:function(){
var d=wm.Text.prototype.getEditorValue.call(this);
if(d){
if(!this.useLocalTime){
d.setHours(d.getHours()-wm.timezoneOffset);
}
return d.getTime();
}
return this.makeEmptyValue();
},calcIsDirty:function(val1,val2){
if(val1===undefined||val1===null){
val1=0;
}
if(val2===undefined||val2===null){
val2=0;
}
if(val1 instanceof Date==false){
val1=new Date(val1);
}
if(val2 instanceof Date==false){
var val2=new Date(val2);
}
if(val1&&val2&&val1.getTime()==val2.getTime()){
return false;
}
val1=dojo.date.locale.format(val1,{timePattern:this.timePattern,selector:"time"});
val2=dojo.date.locale.format(val2,{timePattern:this.timePattern,selector:"time"});
return val1!=val2;
}});
dojo.declare("wm.DateTime",wm.Date,{use24Time:false,formatLength:"short",dateMode:"Date and Time",getEditorConstraints:function(){
var _1c8=this.inherited(arguments);
_1c8.formatLength=this.formatLength;
_1c8.timePattern=this.use24Time?"HH:mm":"hh:mm a";
return _1c8;
},getEditorProps:function(_1c9,_1ca){
var p=this.inherited(arguments);
p._selector=this.dateMode=="Date and Time"?"datetime":this.dateMode.toLowerCase();
p.use24Time=this.use24Time;
return p;
},_createEditor:function(_1cb,_1cc){
return new dijit.form.DateTimeTextBox(this.getEditorProps(_1cb,_1cc));
},setEditorValue:function(_1cd){
var d;
if(_1cd instanceof Date){
d=new Date(_1cd);
}else{
if(String(_1cd).match(/^\d+$/)){
d=new Date(_1cd);
}else{
if(_1cd){
d=wm.convertValueToDate(_1cd,{formatLength:this.formatLength,selector:this.dateMode.toLowerCase(),timePattern:this.use24Time?"HH:mm":"hh:mm a"});
}
}
}
var _1ce=null;
if(d&&d.getTime()!=NaN){
if(!this.useLocalTime){
d.setHours(d.getHours()+wm.timezoneOffset);
}
_1ce=this.calcDisplayValue(d);
}else{
d=null;
}
this.inherited(arguments,[_1ce]);
},setDateMode:function(_1cf){
var _1d0=this.getDataValue();
this.dateMode=_1cf;
this.setDataValue(_1d0);
}});
dojo.declare("dijit.form.DateTimeTextBox",dijit.form._DateTimeTextBox,{forceWidth:false,autoWidth:false,baseClass:"dijitTextBox dijitComboBox dijitDateTextBox",popupClass:"wm.DateTimePicker",_selector:"datetime",value:new Date(""),openDropDown:function(_1d1){
if(!wm.DateTimePicker.dialog){
wm.DateTimePicker.dialog=new wm.DateTimePicker({owner:this,name:"DateTimePopup"});
}
this.dropDown=wm.DateTimePicker.dialog;
this.dropDown._updating=true;
switch(this._selector){
case "datetime":
this.dropDown.calendar.show();
this.dropDown.panel.show();
break;
case "time":
this.dropDown.calendar.hide();
this.dropDown.panel.show();
break;
case "date":
this.dropDown.calendar.show();
this.dropDown.panel.hide();
}
this.dropDown.setUse24Time(this.use24Time);
this.dropDown.setHeight(this.dropDown.getPreferredFitToContentHeight()+"px");
this.dropDown.setDataValue(this.get("value"));
this.dropDown.setMinimum(this.constraints.min);
this.dropDown.setMaximum(this.constraints.max);
this.dropDown._currentDijit=this;
this.dropDown._updating=false;
var _1d2=dijit._HasDropDown.prototype.openDropDown.call(this,_1d1);
if(this.dropDown.calendar.showing){
this.dropDown.calendar.focus();
}else{
this.dropDown.hours.focus();
}
return _1d2;
}});
dojo.declare("wm.DateTimePicker",wm.Container,{use24Time:false,border:"1",borderColor:"#333",height:"252px",width:"210px",padding:"0",margin:"0",classNames:"wmdialog MainContent",horizontalAlign:"left",verticalAlign:"top",dataValue:null,prepare:function(_1d3){
_1d3.owner=app;
this.inherited(arguments);
},setUse24Time:function(_1d4){
this.use24Time=_1d4;
this.ampm.setShowing(!_1d4);
this.hours.setMaximum(_1d4?24:12);
},postInit:function(){
var _1d5=dojo.hitch(this,"changed");
this.calendar=new wm.dijit.Calendar({owner:this,parent:this,userLocalTime:true,height:"180px",width:"100%",onValueSelected:_1d5});
this.panel=new wm.Panel({owner:this,parent:this,name:"dateTimePickerPanel",layoutKind:"left-to-right",horizontalAlign:"left",verticalAlign:"bottom",margin:"0,0,3,0",width:"100%",height:"50px"});
this.hours=new wm.Number({owner:this,parent:this.panel,caption:"Hour",captionAlign:"left",captionPosition:"top",captionSize:"22px",changeOnKey:true,displayValue:"",height:"100%",maximum:12,minimum:0,padding:"2",spinnerButtons:1,width:"100%",onchange:_1d5});
this.minutes=new wm.Number({owner:this,parent:this.panel,caption:"Minute",captionAlign:"left",captionPosition:"top",captionSize:"22px",changeOnKey:true,displayValue:"",height:"100%",maximum:59,minimum:0,padding:"2",spinnerButtons:1,width:"100%",onchange:_1d5});
this.ampm=new wm.ToggleButton({owner:this,parent:this.panel,captionDown:"PM",captionUp:"AM",height:"21px",width:"50px",margin:"0,4,2,0",onclick:_1d5});
this.buttonPanel=new wm.Panel({owner:this,parent:this,_classes:{domNode:["dialogfooter"]},showing:false,name:"dateTimePickerButtonPanel",layoutKind:"left-to-right",horizontalAlign:"left",verticalAlign:"bottom",width:"100%",height:"32px"});
this.okButton=new wm.Button({owner:this,parent:this.buttonPanel,name:"okButton",caption:"OK",width:"100px",height:"100%",onclick:dojo.hitch(this,"onOkClick")});
new wm.Button({owner:this,parent:this.buttonPanel,name:"cancelButton",caption:"Cancel",width:"100px",height:"100%",onclick:dojo.hitch(this,"onCancelClick")});
this.inherited(arguments);
this.reflow();
},changed:function(){
if(this._updating){
return;
}
if(this.calendar.showing){
var date=new Date(this.calendar.getDateValue());
}else{
var date=new Date(0);
}
if(this.panel.showing){
var hour=this.hours.getDataValue()||1;
var _1d6=this.minutes.getDataValue()||0;
var isPM=this.ampm.clicked;
date.setHours(hour+(isPM?12:0),_1d6);
}
this.dataValue=date;
if(this._currentDijit){
this._currentDijit.set("value",date);
}
if(this._currentDijit&&this.calendar.showing&&!this.panel.showing){
this._currentDijit.closeDropDown();
}
},set:function(_1d7,_1d8){
},destroyRecursive:function(){
},reflowParent:function(){
this.reflow();
this.renderBounds();
},getContentBounds:function(){
var b=this.inherited(arguments);
b.l+=this.borderExtents.l;
b.t+=this.borderExtents.t;
return b;
},setDataValue:function(_1d9){
this._initialValue=_1d9;
var _1da;
if(_1d9 instanceof Date){
_1da=_1d9;
}else{
if(!_1d9){
_1da="";
}else{
_1da=wm.convertValueToDate(_1d9);
}
}
this.dataValue=_1da;
if(_1da){
if(this.calendar.showing){
this.calendar.setDate(_1da);
}
if(this.panel.showing){
var time=dojo.date.locale.format(_1da,{selector:"time",timePattern:this.use24Time?"HH:mm":"hh:mm a"});
if(this.use24Time){
var _1db=time.match(/^(\d\d)\:(\d\d)$/);
}else{
var _1db=time.match(/^(\d\d)\:(\d\d) (.*)$/);
}
this.minutes.setDataValue(_1db[2]);
if(this.use24Time){
this.hours.setDataValue(Number(_1db[1]));
}else{
var isPM=_1db[3].toLowerCase()=="pm";
this.hours.setDataValue(_1db[1]);
this.ampm.setClicked(isPM);
}
}
}
},setMinimum:function(_1dc){
this.calendar.setMinimum(_1dc);
},setMaximum:function(_1dd){
this.calendar.setMaximum(_1dd);
},onOkClick:function(){
if(this._currentDijit){
this._currentDijit.closeDropDown();
}
},onCancelClick:function(){
if(this._currentDijit){
this._currentDijit.closeDropDown();
this._currentDijit.set("value",this._initialValue);
}
},onChange:function(_1de){
}});
}
if(!dojo._hasResource["dijit.form.ToggleButton"]){
dojo._hasResource["dijit.form.ToggleButton"]=true;
dojo.provide("dijit.form.ToggleButton");
}
if(!dojo._hasResource["dijit.form.CheckBox"]){
dojo._hasResource["dijit.form.CheckBox"]=true;
dojo.provide("dijit.form.CheckBox");
dojo.declare("dijit.form.CheckBox",dijit.form.ToggleButton,{templateString:dojo.cache("dijit.form","templates/CheckBox.html","<div class=\"dijit dijitReset dijitInline\" role=\"presentation\"\n\t><input\n\t \t${!nameAttrSetting} type=\"${type}\" ${checkedAttrSetting}\n\t\tclass=\"dijitReset dijitCheckBoxInput\"\n\t\tdojoAttachPoint=\"focusNode\"\n\t \tdojoAttachEvent=\"onclick:_onClick\"\n/></div>\n"),baseClass:"dijitCheckBox",type:"checkbox",value:"on",readOnly:false,attributeMap:dojo.delegate(dijit.form._FormWidget.prototype.attributeMap,{readOnly:"focusNode"}),_setReadOnlyAttr:function(_1df){
this._set("readOnly",_1df);
dojo.attr(this.focusNode,"readOnly",_1df);
dijit.setWaiState(this.focusNode,"readonly",_1df);
},_setValueAttr:function(_1e0,_1e1){
if(typeof _1e0=="string"){
this._set("value",_1e0);
dojo.attr(this.focusNode,"value",_1e0);
_1e0=true;
}
if(this._created){
this.set("checked",_1e0,_1e1);
}
},_getValueAttr:function(){
return (this.checked?this.value:false);
},_setLabelAttr:undefined,postMixInProperties:function(){
if(this.value==""){
this.value="on";
}
this.checkedAttrSetting=this.checked?"checked":"";
this.inherited(arguments);
},_fillContent:function(_1e2){
},reset:function(){
this._hasBeenBlurred=false;
this.set("checked",this.params.checked||false);
this._set("value",this.params.value||"on");
dojo.attr(this.focusNode,"value",this.value);
},_onFocus:function(){
if(this.id){
dojo.query("label[for='"+this.id+"']").addClass("dijitFocusedLabel");
}
this.inherited(arguments);
},_onBlur:function(){
if(this.id){
dojo.query("label[for='"+this.id+"']").removeClass("dijitFocusedLabel");
}
this.inherited(arguments);
},_onClick:function(e){
if(this.readOnly){
dojo.stopEvent(e);
return false;
}
return this.inherited(arguments);
}});
dojo.declare("dijit.form.RadioButton",dijit.form.CheckBox,{type:"radio",baseClass:"dijitRadio",_setCheckedAttr:function(_1e3){
this.inherited(arguments);
if(!this._created){
return;
}
if(_1e3){
var _1e4=this;
dojo.query("INPUT[type=radio]",this.focusNode.form||dojo.doc).forEach(function(_1e5){
if(_1e5.name==_1e4.name&&_1e5!=_1e4.focusNode&&_1e5.form==_1e4.focusNode.form){
var _1e6=dijit.getEnclosingWidget(_1e5);
if(_1e6&&_1e6.checked){
_1e6.set("checked",false);
}
}
});
}
},_clicked:function(e){
if(!this.checked){
this.set("checked",true);
}
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.Checkbox"]){
dojo._hasResource["wm.base.widget.Editors.Checkbox"]=true;
dojo.provide("wm.base.widget.Editors.Checkbox");
dojo.declare("wm.Checkbox",wm.AbstractEditor,{classNames:"wmeditor wmeditor-cbeditor",width:"120px",dataType:"boolean",startChecked:false,checkedValue:true,_createEditor:function(_1e7,_1e8){
return new dijit.form.CheckBox(this.getEditorProps(_1e7,_1e8));
},setRequired:function(){
},connectEditor:function(){
this.inherited(arguments);
},sizeEditor:function(){
if(this._cupdating){
return;
}
this.inherited(arguments);
var node=this.editorNode;
node.style.width="16px";
node.style.height="16px";
var _1e9=parseInt(node.style.lineHeight);
node.style.marginTop=(Math.floor(_1e9-16)/2)+"px";
},styleEditor:function(){
this.inherited(arguments);
var n=this.captionNode;
if(n){
dojo.setSelectable(n,false);
}
},render:function(){
this.inherited(arguments);
this.domNode.style.textAlign=(this.captionPosition=="right")?"right":"";
},setInitialValue:function(){
this.beginEditUpdate();
if(this.startChecked&&!this._setEditorValueCalled||Boolean(this.dataValue)){
this.setChecked(true);
}
this.endEditUpdate();
},getChecked:function(){
if(this.editor){
return Boolean(this.editor.checked);
}else{
return Boolean(this.dataValue);
}
},setChecked:function(_1ea){
this.editor.set("checked",_1ea,false);
if(!this._cupdating){
this.changed();
}
},getDisplayValue:function(){
return this.getDataValue();
},setDisplayValue:function(_1eb){
},getEditorValue:function(){
var c=this.editor&&this.editor.checked;
var v=this.checkedValue;
if(v===undefined){
v=this.getTypedValue(1);
}else{
v=this.getTypedValue(v);
}
return c?v:this.makeEmptyValue();
},makeEmptyValue:function(){
return this.getTypedValue(this.inherited(arguments));
},getTypedValue:function(_1ec){
var v=_1ec;
switch(this.dataType){
case "string":
if(v===false){
v="false";
}else{
if(v===0){
v="0";
}else{
if(!v){
v="";
}else{
v=String(v);
}
}
}
return v;
case "number":
var n=Number(v);
return isNaN(n)?Number(Boolean(v)):n;
default:
return Boolean(v);
}
},setEditorValue:function(_1ed){
this._setEditorValueCalled=true;
if(this.editor){
this.editor.set("checked",Boolean(_1ed));
}
},updateReadonlyValue:function(){
},setStartChecked:function(_1ee){
this.startChecked=_1ee;
this.createEditor();
},set_startChecked:function(_1ef){
this.dataValue=Boolean(_1ef);
this.setStartChecked(_1ef);
},setDataType:function(_1f0){
this.dataType=_1f0;
if(_1f0=="boolean"){
this.displayValue=true;
}
switch(_1f0){
case "string":
break;
case "number":
if(typeof this.checkedValue=="number"){
}else{
if(String(this.checkedValue).match(/^[0-9.]+$/)){
}else{
app.toastWarning(studio.getDictionaryItem("wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_NUMBER"));
}
}
break;
case "boolean":
if(typeof this.checkedValue=="boolean"){
}else{
if(this.checkedValue=="true"){
this.checkedValue=true;
}else{
if(this.checkedValue=="false"){
this.checkedValue=false;
}else{
app.toastWarning(studio.getDictionaryItem("wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_BOOLEAN"));
}
}
}
break;
}
},setDisabled:function(_1f1){
this.inherited(arguments);
if(!this.editor){
return;
}
this.editor.set("disabled",inReadonly||this._disabled);
},setReadonly:function(_1f2){
this.readonly=_1f2;
if(!this.editor){
return;
}
if(!this.readOnlyNode){
this.readOnlyNode=this.editor;
}
this.editor.set("disabled",_1f2||this._disabled);
},getMinWidthProp:function(){
if(this.minWidth){
return this.minWidth;
}
if(this.captionPosition=="top"||this.captionPosition=="bottom"||!this.caption){
return 40;
}else{
if(this.captionSize.match(/\%/)){
return 80;
}else{
return 20+parseInt(this.captionSize);
}
}
}});
}
if(!dojo._hasResource["dijit.form.RadioButton"]){
dojo._hasResource["dijit.form.RadioButton"]=true;
dojo.provide("dijit.form.RadioButton");
}
if(!dojo._hasResource["wm.base.widget.Editors.Radiobutton"]){
dojo._hasResource["wm.base.widget.Editors.Radiobutton"]=true;
dojo.provide("wm.base.widget.Editors.Radiobutton");
dojo.declare("wm.RadioButton",wm.Checkbox,{radioGroup:"default",dataType:"string",_createEditor:function(_1f3,_1f4){
return new dijit.form.RadioButton(this.getEditorProps(_1f3,_1f4));
},getEditorProps:function(_1f5,_1f6){
return dojo.mixin(this.inherited(arguments),{name:this.radioGroup},_1f6||{});
},connectEditor:function(){
this.inherited(arguments);
this.addEditorConnect(this.domNode,"ondblclick",this,function(){
this.onDblClick();
});
},setInitialValue:function(){
this.beginEditUpdate();
var _1f7=false;
var g=this.getGroup();
for(var i=0;i<g.length;i++){
var o=g[i].owner;
if(o._setEditorValueCalled){
_1f7=true;
break;
}
}
if(this.startChecked&&!_1f7||this.groupValue==this.checkedValue){
this.setChecked(true);
}
this.endEditUpdate();
},getChecked:function(){
if(this.editor){
return Boolean(this.editor.checked);
}else{
return this.groupValue==this.checkedValue;
}
},setEditorValue:function(_1f8){
if(_1f8==this.checkedValue){
if(this.editor){
this.editor.set("checked",true);
this.updateGroupValue();
this._lastValue=this.checkedValue;
}else{
this.groupValue=this.checkedValue;
this._lastValue=this.checkedValue;
}
var _1f9=this.getGroup();
for(var i=0,v,o;(v=_1f9[i]);i++){
if(v.owner&&v.owner!=this){
v.owner._lastValue=this.makeEmptyValue();
}
}
}else{
var _1fa=false;
var _1f9=this.getGroup(),gv=this.getGroupValue();
for(var i=0,v,o;(v=_1f9[i]);i++){
if(v){
o=v.owner;
if(o.checkedValue==_1f8){
o.setEditorValue(_1f8);
o._lastValue=_1f8;
_1fa=true;
break;
}else{
o._lastValue=this.makeEmptyValue();
}
}
}
if(!_1fa){
for(var i=0,v,o;(v=_1f9[i]);i++){
if(v){
o=v.owner;
if(o.getChecked()){
o.setChecked(false);
this.updateGroupValue();
return;
}
}
}
}
}
this._setEditorValueCalled=true;
},setRadioGroup:function(_1fb){
this.radioGroup=_1fb?wm.getValidJsName(_1fb):"";
var _1fc=this.getGroup();
if(_1fc.length){
this.dataType=_1fc[0].dataType;
}
this.createEditor();
wm.fire(studio.inspector,"reinspect");
},getGroup:function(){
var _1fd=[];
var _1fe=dojo.query("input[type=radio][name="+(this.radioGroup||"default")+"]");
_1fe.forEach(function(_1ff,_200,_201){
_1fd[_200]=dijit.getEnclosingWidget(_1ff);
});
return _1fd;
},updateGroupValue:function(){
var _202=this.getGroup(),gv=this.getGroupValue();
for(var i=0,v,o;(v=_202[i]);i++){
if(v){
o=v.owner;
if(o){
o.groupValue=gv;
o.valueChanged("groupValue",gv);
}
}
}
},setGroupValue:function(_203){
this.setEditorValue(_203);
},getGroupValue:function(){
var _204=this.getGroup();
for(var i=0,v;(v=_204[i]);i++){
if(v.checked){
return v.owner.checkedValue;
}
}
for(var i=0,v;(v=_204[i]);i++){
return v.owner.makeEmptyValue();
}
},isLoading:function(){
var l=this.inherited(arguments);
if(!l){
var _205=this.getGroup();
for(var i=0,v,gl;(v=_205[i]);i++){
gl=v.owner._rendering;
if(gl){
return true;
}
}
}
return l;
},setDataType:function(_206){
this.inherited(arguments);
var _207=this.getGroup();
for(var i=0,v;(v=_207[i]);i++){
v.dataType=_206;
}
},setStartChecked:function(_208){
if(_208){
var _209=this.getGroup();
for(var i=0,v,r;(v=_209[i]);i++){
if(v!=this){
v.owner.setStartChecked(false);
}
}
}
this.inherited(arguments);
},editorChanged:function(){
this.inherited(arguments);
this.updateGroupValue();
return true;
},onDblClick:function(){
}});
}
if(!dojo._hasResource["dojo.data.util.filter"]){
dojo._hasResource["dojo.data.util.filter"]=true;
dojo.provide("dojo.data.util.filter");
dojo.getObject("data.util.filter",true,dojo);
dojo.data.util.filter.patternToRegExp=function(_20a,_20b){
var rxp="^";
var c=null;
for(var i=0;i<_20a.length;i++){
c=_20a.charAt(i);
switch(c){
case "\\":
rxp+=c;
i++;
rxp+=_20a.charAt(i);
break;
case "*":
rxp+=".*";
break;
case "?":
rxp+=".";
break;
case "$":
case "^":
case "/":
case "+":
case ".":
case "|":
case "(":
case ")":
case "{":
case "}":
case "[":
case "]":
rxp+="\\";
default:
rxp+=c;
}
}
rxp+="$";
if(_20b){
return new RegExp(rxp,"mi");
}else{
return new RegExp(rxp,"m");
}
};
}
if(!dojo._hasResource["dijit.form.ComboBox"]){
dojo._hasResource["dijit.form.ComboBox"]=true;
dojo.provide("dijit.form.ComboBox");
dojo.declare("dijit.form.ComboBoxMixin",dijit._HasDropDown,{item:null,pageSize:Infinity,store:null,fetchProperties:{},query:{},autoComplete:true,highlightMatch:"first",searchDelay:100,searchAttr:"name",labelAttr:"",labelType:"text",queryExpr:"${0}*",ignoreCase:true,hasDownArrow:true,templateString:dojo.cache("dijit.form","templates/DropDownBox.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),baseClass:"dijitTextBox dijitComboBox",dropDownClass:"dijit.form._ComboBoxMenu",cssStateNodes:{"_buttonNode":"dijitDownArrowButton"},maxHeight:-1,_stopClickEvents:false,_getCaretPos:function(_20c){
var pos=0;
if(typeof (_20c.selectionStart)=="number"){
pos=_20c.selectionStart;
}else{
if(dojo.isIE){
var tr=dojo.doc.selection.createRange().duplicate();
var ntr=_20c.createTextRange();
tr.move("character",0);
ntr.move("character",0);
try{
ntr.setEndPoint("EndToEnd",tr);
pos=String(ntr.text).replace(/\r/g,"").length;
}
catch(e){
}
}
}
return pos;
},_setCaretPos:function(_20d,_20e){
_20e=parseInt(_20e);
dijit.selectInputText(_20d,_20e,_20e);
},_setDisabledAttr:function(_20f){
this.inherited(arguments);
dijit.setWaiState(this.domNode,"disabled",_20f);
},_abortQuery:function(){
if(this.searchTimer){
clearTimeout(this.searchTimer);
this.searchTimer=null;
}
if(this._fetchHandle){
if(this._fetchHandle.abort){
this._fetchHandle.abort();
}
this._fetchHandle=null;
}
},_onInput:function(evt){
if(!this.searchTimer&&(evt.type=="paste"||evt.type=="input")&&this._lastInput!=this.textbox.value){
this.searchTimer=setTimeout(dojo.hitch(this,function(){
this._onKey({charOrCode:229});
}),100);
}
this.inherited(arguments);
},_onKey:function(evt){
var key=evt.charOrCode;
if(evt.altKey||((evt.ctrlKey||evt.metaKey)&&(key!="x"&&key!="v"))||key==dojo.keys.SHIFT){
return;
}
var _210=false;
var pw=this.dropDown;
var dk=dojo.keys;
var _211=null;
this._prev_key_backspace=false;
this._abortQuery();
this.inherited(arguments);
if(this._opened){
_211=pw.getHighlightedOption();
}
switch(key){
case dk.PAGE_DOWN:
case dk.DOWN_ARROW:
case dk.PAGE_UP:
case dk.UP_ARROW:
if(this._opened){
this._announceOption(_211);
}
dojo.stopEvent(evt);
break;
case dk.ENTER:
if(_211){
if(_211==pw.nextButton){
this._nextSearch(1);
dojo.stopEvent(evt);
break;
}else{
if(_211==pw.previousButton){
this._nextSearch(-1);
dojo.stopEvent(evt);
break;
}
}
}else{
this._setBlurValue();
this._setCaretPos(this.focusNode,this.focusNode.value.length);
}
if(this._opened||this._fetchHandle){
evt.preventDefault();
}
case dk.TAB:
var _212=this.get("displayedValue");
if(pw&&(_212==pw._messages["previousMessage"]||_212==pw._messages["nextMessage"])){
break;
}
if(_211){
this._selectOption();
}
if(this._opened){
this._lastQuery=null;
this.closeDropDown();
}
break;
case " ":
if(_211){
dojo.stopEvent(evt);
this._selectOption();
this.closeDropDown();
}else{
_210=true;
}
break;
case dk.DELETE:
case dk.BACKSPACE:
this._prev_key_backspace=true;
_210=true;
break;
default:
_210=typeof key=="string"||key==229;
}
if(_210){
this.item=undefined;
this.searchTimer=setTimeout(dojo.hitch(this,"_startSearchFromInput"),1);
}
},_autoCompleteText:function(text){
var fn=this.focusNode;
dijit.selectInputText(fn,fn.value.length);
var _213=this.ignoreCase?"toLowerCase":"substr";
if(text[_213](0).indexOf(this.focusNode.value[_213](0))==0){
var cpos=this._getCaretPos(fn);
if((cpos+1)>fn.value.length){
fn.value=text;
dijit.selectInputText(fn,cpos);
}
}else{
fn.value=text;
dijit.selectInputText(fn);
}
},_openResultList:function(_214,_215){
this._fetchHandle=null;
if(this.disabled||this.readOnly||(_215.query[this.searchAttr]!=this._lastQuery)){
return;
}
var _216=this.dropDown._highlighted_option&&dojo.hasClass(this.dropDown._highlighted_option,"dijitMenuItemSelected");
this.dropDown.clearResultList();
if(!_214.length&&!this._maxOptions){
this.closeDropDown();
return;
}
_215._maxOptions=this._maxOptions;
var _217=this.dropDown.createOptions(_214,_215,dojo.hitch(this,"_getMenuLabelFromItem"));
this._showResultList();
if(_215.direction){
if(1==_215.direction){
this.dropDown.highlightFirstOption();
}else{
if(-1==_215.direction){
this.dropDown.highlightLastOption();
}
}
if(_216){
this._announceOption(this.dropDown.getHighlightedOption());
}
}else{
if(this.autoComplete&&!this._prev_key_backspace&&!/^[*]+$/.test(_215.query[this.searchAttr])){
this._announceOption(_217[1]);
}
}
},_showResultList:function(){
this.closeDropDown(true);
this.displayMessage("");
this.openDropDown();
dijit.setWaiState(this.domNode,"expanded","true");
},loadDropDown:function(_218){
this._startSearchAll();
},isLoaded:function(){
return false;
},closeDropDown:function(){
this._abortQuery();
if(this._opened){
this.inherited(arguments);
dijit.setWaiState(this.domNode,"expanded","false");
dijit.removeWaiState(this.focusNode,"activedescendant");
}
},_setBlurValue:function(){
var _219=this.get("displayedValue");
var pw=this.dropDown;
if(pw&&(_219==pw._messages["previousMessage"]||_219==pw._messages["nextMessage"])){
this._setValueAttr(this._lastValueReported,true);
}else{
if(typeof this.item=="undefined"){
this.item=null;
this.set("displayedValue",_219);
}else{
if(_219===""){
this.item=null;
this.set("displayedValue",_219);
}else{
if(this.value!=this._lastValueReported){
dijit.form._FormValueWidget.prototype._setValueAttr.call(this,this.value,true);
}
this._refreshState();
}
}
}
},_onBlur:function(){
this.closeDropDown();
this.inherited(arguments);
},_setItemAttr:function(item,_21a,_21b){
if(!_21b){
_21b=this.store.getValue(item,this.searchAttr);
}
var _21c=this._getValueField()!=this.searchAttr?this.store.getIdentity(item):_21b;
this._set("item",item);
dijit.form.ComboBox.superclass._setValueAttr.call(this,_21c,_21a,_21b);
},_announceOption:function(node){
if(!node){
return;
}
var _21d;
if(node==this.dropDown.nextButton||node==this.dropDown.previousButton){
_21d=node.innerHTML;
this.item=undefined;
this.value="";
}else{
_21d=this.store.getValue(node.item,this.searchAttr).toString();
this.set("item",node.item,false,_21d);
}
this.focusNode.value=this.focusNode.value.substring(0,this._lastInput.length);
dijit.setWaiState(this.focusNode,"activedescendant",dojo.attr(node,"id"));
this._autoCompleteText(_21d);
},_selectOption:function(evt){
if(evt){
this._announceOption(evt.target);
}
this.closeDropDown();
this._setCaretPos(this.focusNode,this.focusNode.value.length);
dijit.form._FormValueWidget.prototype._setValueAttr.call(this,this.value,true);
},_startSearchAll:function(){
this._startSearch("");
},_startSearchFromInput:function(){
this._startSearch(this.focusNode.value.replace(/([\\\*\?])/g,"\\$1"));
},_getQueryString:function(text){
return dojo.string.substitute(this.queryExpr,[text]);
},_startSearch:function(key){
if(!this.dropDown){
var _21e=this.id+"_popup",_21f=dojo.getObject(this.dropDownClass,false);
this.dropDown=new _21f({onChange:dojo.hitch(this,this._selectOption),id:_21e,dir:this.dir});
dijit.removeWaiState(this.focusNode,"activedescendant");
dijit.setWaiState(this.textbox,"owns",_21e);
}
var _220=dojo.clone(this.query);
this._lastInput=key;
this._lastQuery=_220[this.searchAttr]=this._getQueryString(key);
this.searchTimer=setTimeout(dojo.hitch(this,function(_221,_222){
this.searchTimer=null;
var _223={queryOptions:{ignoreCase:this.ignoreCase,deep:true},query:_221,onBegin:dojo.hitch(this,"_setMaxOptions"),onComplete:dojo.hitch(this,"_openResultList"),onError:function(_224){
_222._fetchHandle=null;
console.error("dijit.form.ComboBox: "+_224);
_222.closeDropDown();
},start:0,count:this.pageSize};
dojo.mixin(_223,_222.fetchProperties);
this._fetchHandle=_222.store.fetch(_223);
var _225=function(_226,_227){
_226.start+=_226.count*_227;
_226.direction=_227;
this._fetchHandle=this.store.fetch(_226);
this.focus();
};
this._nextSearch=this.dropDown.onPage=dojo.hitch(this,_225,this._fetchHandle);
},_220,this),this.searchDelay);
},_setMaxOptions:function(size,_228){
this._maxOptions=size;
},_getValueField:function(){
return this.searchAttr;
},constructor:function(){
this.query={};
this.fetchProperties={};
},postMixInProperties:function(){
if(!this.store){
var _229=this.srcNodeRef;
this.store=new dijit.form._ComboBoxDataStore(_229);
if(!("value" in this.params)){
var item=(this.item=this.store.fetchSelectedItem());
if(item){
var _22a=this._getValueField();
this.value=this.store.getValue(item,_22a);
}
}
}
this.inherited(arguments);
},postCreate:function(){
var _22b=dojo.query("label[for=\""+this.id+"\"]");
if(_22b.length){
_22b[0].id=(this.id+"_label");
dijit.setWaiState(this.domNode,"labelledby",_22b[0].id);
}
this.inherited(arguments);
},_setHasDownArrowAttr:function(val){
this.hasDownArrow=val;
this._buttonNode.style.display=val?"":"none";
},_getMenuLabelFromItem:function(item){
var _22c=this.labelFunc(item,this.store),_22d=this.labelType;
if(this.highlightMatch!="none"&&this.labelType=="text"&&this._lastInput){
_22c=this.doHighlight(_22c,this._escapeHtml(this._lastInput));
_22d="html";
}
return {html:_22d=="html",label:_22c};
},doHighlight:function(_22e,find){
var _22f=(this.ignoreCase?"i":"")+(this.highlightMatch=="all"?"g":""),i=this.queryExpr.indexOf("${0}");
find=dojo.regexp.escapeString(find);
return this._escapeHtml(_22e).replace(new RegExp((i==0?"^":"")+"("+find+")"+(i==(this.queryExpr.length-4)?"$":""),_22f),"<span class=\"dijitComboBoxHighlightMatch\">$1</span>");
},_escapeHtml:function(str){
str=String(str).replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
return str;
},reset:function(){
this.item=null;
this.inherited(arguments);
},labelFunc:function(item,_230){
return _230.getValue(item,this.labelAttr||this.searchAttr).toString();
}});
dojo.declare("dijit.form._ComboBoxMenu",[dijit._Widget,dijit._Templated,dijit._CssStateMixin],{templateString:"<ul class='dijitReset dijitMenu' dojoAttachEvent='onmousedown:_onMouseDown,onmouseup:_onMouseUp,onmouseover:_onMouseOver,onmouseout:_onMouseOut' style='overflow: \"auto\"; overflow-x: \"hidden\";'>"+"<li class='dijitMenuItem dijitMenuPreviousButton' dojoAttachPoint='previousButton' role='option'></li>"+"<li class='dijitMenuItem dijitMenuNextButton' dojoAttachPoint='nextButton' role='option'></li>"+"</ul>",_messages:null,baseClass:"dijitComboBoxMenu",postMixInProperties:function(){
this.inherited(arguments);
this._messages=dojo.i18n.getLocalization("dijit.form","ComboBox",this.lang);
},buildRendering:function(){
this.inherited(arguments);
this.previousButton.innerHTML=this._messages["previousMessage"];
this.nextButton.innerHTML=this._messages["nextMessage"];
},_setValueAttr:function(_231){
this.value=_231;
this.onChange(_231);
},onChange:function(_232){
},onPage:function(_233){
},onClose:function(){
this._blurOptionNode();
},_createOption:function(item,_234){
var _235=dojo.create("li",{"class":"dijitReset dijitMenuItem"+(this.isLeftToRight()?"":" dijitMenuItemRtl"),role:"option"});
var _236=_234(item);
if(_236.html){
_235.innerHTML=_236.label;
}else{
_235.appendChild(dojo.doc.createTextNode(_236.label));
}
if(_235.innerHTML==""){
_235.innerHTML="&nbsp;";
}
_235.item=item;
return _235;
},createOptions:function(_237,_238,_239){
this.previousButton.style.display=(_238.start==0)?"none":"";
dojo.attr(this.previousButton,"id",this.id+"_prev");
dojo.forEach(_237,function(item,i){
var _23a=this._createOption(item,_239);
if(item.indent){
dojo.addClass(_23a,"indentOption"+(item.indent===true)?"":item.indent);
}
dojo.attr(_23a,"id",this.id+i);
this.domNode.insertBefore(_23a,this.nextButton);
},this);
var _23b=false;
if(_238._maxOptions&&_238._maxOptions!=-1){
if((_238.start+_238.count)<_238._maxOptions){
_23b=true;
}else{
if((_238.start+_238.count)>_238._maxOptions&&_238.count==_237.length){
_23b=true;
}
}
}else{
if(_238.count==_237.length){
_23b=true;
}
}
this.nextButton.style.display=_23b?"":"none";
dojo.attr(this.nextButton,"id",this.id+"_next");
return this.domNode.childNodes;
},clearResultList:function(){
while(this.domNode.childNodes.length>2){
this.domNode.removeChild(this.domNode.childNodes[this.domNode.childNodes.length-2]);
}
this._blurOptionNode();
},_onMouseDown:function(evt){
dojo.stopEvent(evt);
},_onMouseUp:function(evt){
if(evt.target===this.domNode||!this._highlighted_option){
return;
}else{
if(evt.target==this.previousButton){
this._blurOptionNode();
this.onPage(-1);
}else{
if(evt.target==this.nextButton){
this._blurOptionNode();
this.onPage(1);
}else{
var tgt=evt.target;
while(!tgt.item){
tgt=tgt.parentNode;
}
this._setValueAttr({target:tgt},true);
}
}
}
},_onMouseOver:function(evt){
if(evt.target===this.domNode){
return;
}
var tgt=evt.target;
if(!(tgt==this.previousButton||tgt==this.nextButton)){
while(!tgt.item){
tgt=tgt.parentNode;
}
}
this._focusOptionNode(tgt);
},_onMouseOut:function(evt){
if(evt.target===this.domNode){
return;
}
this._blurOptionNode();
},_focusOptionNode:function(node){
if(this._highlighted_option!=node){
this._blurOptionNode();
this._highlighted_option=node;
dojo.addClass(this._highlighted_option,"dijitMenuItemSelected");
}
},_blurOptionNode:function(){
if(this._highlighted_option){
dojo.removeClass(this._highlighted_option,"dijitMenuItemSelected");
this._highlighted_option=null;
}
},_highlightNextOption:function(){
if(!this.getHighlightedOption()){
var fc=this.domNode.firstChild;
this._focusOptionNode(fc.style.display=="none"?fc.nextSibling:fc);
}else{
var ns=this._highlighted_option.nextSibling;
if(ns&&ns.style.display!="none"){
this._focusOptionNode(ns);
}else{
this.highlightFirstOption();
}
}
dojo.window.scrollIntoView(this._highlighted_option);
},highlightFirstOption:function(){
var _23c=this.domNode.firstChild;
var _23d=_23c.nextSibling;
this._focusOptionNode(_23d.style.display=="none"?_23c:_23d);
dojo.window.scrollIntoView(this._highlighted_option);
},highlightLastOption:function(){
this._focusOptionNode(this.domNode.lastChild.previousSibling);
dojo.window.scrollIntoView(this._highlighted_option);
},_highlightPrevOption:function(){
if(!this.getHighlightedOption()){
var lc=this.domNode.lastChild;
this._focusOptionNode(lc.style.display=="none"?lc.previousSibling:lc);
}else{
var ps=this._highlighted_option.previousSibling;
if(ps&&ps.style.display!="none"){
this._focusOptionNode(ps);
}else{
this.highlightLastOption();
}
}
dojo.window.scrollIntoView(this._highlighted_option);
},_page:function(up){
var _23e=0;
var _23f=this.domNode.scrollTop;
var _240=dojo.style(this.domNode,"height");
if(!this.getHighlightedOption()){
this._highlightNextOption();
}
while(_23e<_240){
if(up){
if(!this.getHighlightedOption().previousSibling||this._highlighted_option.previousSibling.style.display=="none"){
break;
}
this._highlightPrevOption();
}else{
if(!this.getHighlightedOption().nextSibling||this._highlighted_option.nextSibling.style.display=="none"){
break;
}
this._highlightNextOption();
}
var _241=this.domNode.scrollTop;
_23e+=(_241-_23f)*(up?-1:1);
_23f=_241;
}
},pageUp:function(){
this._page(true);
},pageDown:function(){
this._page(false);
},getHighlightedOption:function(){
var ho=this._highlighted_option;
return (ho&&ho.parentNode)?ho:null;
},handleKey:function(evt){
switch(evt.charOrCode){
case dojo.keys.DOWN_ARROW:
this._highlightNextOption();
return false;
case dojo.keys.PAGE_DOWN:
this.pageDown();
return false;
case dojo.keys.UP_ARROW:
this._highlightPrevOption();
return false;
case dojo.keys.PAGE_UP:
this.pageUp();
return false;
default:
return true;
}
}});
dojo.declare("dijit.form.ComboBox",[dijit.form.ValidationTextBox,dijit.form.ComboBoxMixin],{_setValueAttr:function(_242,_243,_244){
this._set("item",null);
var self=this;
this.store.fetchItemByIdentity({identity:_242,onItem:function(item){
self._set("item",item);
}});
if(!_242){
_242="";
}
dijit.form.ValidationTextBox.prototype._setValueAttr.call(this,_242,_243,_244);
}});
dojo.declare("dijit.form._ComboBoxDataStore",null,{constructor:function(root){
this.root=root;
if(root.tagName!="SELECT"&&root.firstChild){
root=dojo.query("select",root);
if(root.length>0){
root=root[0];
}else{
this.root.innerHTML="<SELECT>"+this.root.innerHTML+"</SELECT>";
root=this.root.firstChild;
}
this.root=root;
}
dojo.query("> option",root).forEach(function(node){
node.innerHTML=dojo.trim(node.innerHTML);
});
},getValue:function(item,_245,_246){
return (_245=="value")?item.value:(item.innerText||item.textContent||"");
},isItemLoaded:function(_247){
return true;
},getFeatures:function(){
return {"dojo.data.api.Read":true,"dojo.data.api.Identity":true};
},_fetchItems:function(args,_248,_249){
if(!args.query){
args.query={};
}
if(!args.query.name){
args.query.name="";
}
if(!args.queryOptions){
args.queryOptions={};
}
var _24a=dojo.data.util.filter.patternToRegExp(args.query.name,args.queryOptions.ignoreCase),_24b=dojo.query("> option",this.root).filter(function(_24c){
return (_24c.innerText||_24c.textContent||"").match(_24a);
});
if(args.sort){
_24b.sort(dojo.data.util.sorter.createSortFunction(args.sort,this));
}
_248(_24b,args);
},close:function(_24d){
return;
},getLabel:function(item){
return item.innerHTML;
},getIdentity:function(item){
return dojo.attr(item,"value");
},fetchItemByIdentity:function(args){
var item=dojo.query("> option[value='"+args.identity+"']",this.root)[0];
args.onItem(item);
},fetchSelectedItem:function(){
var root=this.root,si=root.selectedIndex;
return typeof si=="number"?dojo.query("> option:nth-child("+(si!=-1?si+1:1)+")",root)[0]:null;
}});
dojo.extend(dijit.form._ComboBoxDataStore,dojo.data.util.simpleFetch);
}
if(!dojo._hasResource["dijit.form.FilteringSelect"]){
dojo._hasResource["dijit.form.FilteringSelect"]=true;
dojo.provide("dijit.form.FilteringSelect");
dojo.declare("dijit.form.FilteringSelect",[dijit.form.MappedTextBox,dijit.form.ComboBoxMixin],{required:true,_lastDisplayedValue:"",_isValidSubset:function(){
return this._opened;
},isValid:function(){
return this.item||(!this.required&&this.get("displayedValue")=="");
},_refreshState:function(){
if(!this.searchTimer){
this.inherited(arguments);
}
},_callbackSetLabel:function(_24e,_24f,_250){
if((_24f&&_24f.query[this.searchAttr]!=this._lastQuery)||(!_24f&&_24e.length&&this.store.getIdentity(_24e[0])!=this._lastQuery)){
return;
}
if(!_24e.length){
this.valueNode.value="";
dijit.form.TextBox.superclass._setValueAttr.call(this,"",_250||(_250===undefined&&!this._focused));
this._set("item",null);
this.validate(this._focused);
}else{
this.set("item",_24e[0],_250);
}
},_openResultList:function(_251,_252){
if(_252.query[this.searchAttr]!=this._lastQuery){
return;
}
dijit.form.ComboBoxMixin.prototype._openResultList.apply(this,arguments);
if(this.item===undefined){
this.validate(true);
}
},_getValueAttr:function(){
return this.valueNode.value;
},_getValueField:function(){
return "value";
},_setValueAttr:function(_253,_254){
if(!this._onChangeActive){
_254=null;
}
this._lastQuery=_253;
if(_253===null||_253===""){
this._setDisplayedValueAttr("",_254);
return;
}
var self=this;
this.store.fetchItemByIdentity({identity:_253,onItem:function(item){
self._callbackSetLabel(item?[item]:[],undefined,_254);
}});
},_setItemAttr:function(item,_255,_256){
this.inherited(arguments);
this.valueNode.value=this.value;
this._lastDisplayedValue=this.textbox.value;
},_getDisplayQueryString:function(text){
return text.replace(/([\\\*\?])/g,"\\$1");
},_setDisplayedValueAttr:function(_257,_258){
if(_257==null){
_257="";
}
if(!this._created){
if(!("displayedValue" in this.params)){
return;
}
_258=false;
}
if(this.store){
this.closeDropDown();
var _259=dojo.clone(this.query);
this._lastQuery=_259[this.searchAttr]=this._getDisplayQueryString(_257);
this.textbox.value=_257;
this._lastDisplayedValue=_257;
this._set("displayedValue",_257);
var _25a=this;
var _25b={query:_259,queryOptions:{ignoreCase:this.ignoreCase,deep:true},onComplete:function(_25c,_25d){
_25a._fetchHandle=null;
dojo.hitch(_25a,"_callbackSetLabel")(_25c,_25d,_258);
},onError:function(_25e){
_25a._fetchHandle=null;
console.error("dijit.form.FilteringSelect: "+_25e);
dojo.hitch(_25a,"_callbackSetLabel")([],undefined,false);
}};
dojo.mixin(_25b,this.fetchProperties);
this._fetchHandle=this.store.fetch(_25b);
}
},undo:function(){
this.set("displayedValue",this._lastDisplayedValue);
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.Select"]){
dojo._hasResource["wm.base.widget.Editors.Select"]=true;
dojo.provide("wm.base.widget.Editors.Select");
dojo.declare("wm.SelectMenu",wm.DataSetEditor,{comboBox:true,placeHolder:"",_storeNameField:"_selectMenuName",displayType:"Text",pageSize:20,allowNone:false,autoComplete:true,hasDownArrow:true,restrictValues:true,_selectedData:null,init:function(){
this.inherited(arguments);
},generateStore:function(){
var data=[];
if(this.dataSet){
var _25f=this.dataSet.getCount();
for(var i=0;i<_25f;i++){
data.push({id:i,name:this._getDisplayData(this.dataSet.getItem(i))});
}
}
if(this.allowNone){
data.unshift({id:-1,name:""});
}
return new wm.base.data.SimpleStore(data,"name",this);
},getEditorProps:function(_260,_261){
if(!this.comboBox){
var p=this.inherited(arguments);
p.options=[];
if(this.allowNone){
p.options.push({label:"",value:null});
}
if(this.dataSet){
var _262=this.dataSet.getCount();
for(var i=0;i<_262;i++){
var item=this.dataSet.getItem(i);
p.options.push({label:this._getDisplayData(item),value:String(i)});
}
}
return p;
}else{
var _263=this.generateStore();
return dojo.mixin(this.inherited(arguments),{placeHolder:this.placeHolder,required:this.required,store:_263,autoComplete:this.autoComplete,hasDownArrow:this.hasDownArrow,searchAttr:"name",pageSize:this.pageSize?this.pageSize:Infinity},_261||{});
}
},_createEditor:function(_264,_265){
if(!this.comboBox){
return new dijit.form.Select(this.getEditorProps(_264,_265));
}else{
if(this.restrictValues){
return new dijit.form.FilteringSelect(this.getEditorProps(_264,_265));
}else{
return new dijit.form.ComboBox(this.getEditorProps(_264,_265));
}
}
},setPlaceHolder:function(_266){
this.placeHolder=_266;
if(this.editor){
this.editor.attr("placeHolder",_266);
}
},setRestrictValues:function(_267){
var _268=this.getEditorValue();
var _269=this.restrictValues;
this.restrictValues=_267;
if(this.editor&&_269!=_267){
this.createEditor();
this.setEditorValue(_268);
}
},sizeEditor:function(){
if(this._cupdating){
return;
}
this.inherited(arguments);
if(this.comboBox){
if(!this.editorNode.style.height){
return;
}
var h=this.editorNode.style.height.match(/\d+/)[0];
if(dojo.isIE&&dojo.isIE<8&&!this.readonly){
var n=dojo.query(".dijitArrowButtonInner",this.domNode)[0];
var s=n.style;
var c=dojo.coords(n);
s.position="relative";
s.top=Math.floor((h-c.h)/2)+"px";
}
}else{
var h=this._editorHeight;
var s=this.editor.containerNode.parentNode.style;
s.display="block";
s.lineHeight=s.height=h+"px";
s.width=(this._editorWidth-24)+"px";
var _26a=dojo.query(".dijitArrowButtonInner",this.domNode)[0];
_26a.parentNode.style.position="relative";
_26a.parentNode.style.width="24px";
_26a.style.position="absolute";
_26a.style.top="0px";
_26a.parentNode.style.border="0";
_26a.style.height=(dojo.isIE?h:(h+1))+"px";
_26a.style.width="22px";
_26a.style.margin="0";
_26a.style.border="solid 1px "+this.borderColor;
_26a.style.borderLeft="solid 1px #999";
}
},_onSetEditorValueFailed:function(_26b){
if(!this.restrictValues){
this.editor.set("displayedValue",_26b);
}
},formatData:function(_26c){
try{
if(this._formatter){
return this._formatter.format(_26c);
}else{
if(this.displayType){
var ctor=wm.getFormatter(this.displayType);
this._formatter=new ctor({name:"format",owner:this});
return this._formatter.format(_26c);
}else{
return _26c;
}
}
}
catch(e){
}
},setDataSet:function(_26d){
this.inherited(arguments);
this.createEditor();
},clear:function(){
if(this.editor){
var _26e=this.editor.get("displayedValue");
if(this.restrictValues){
this.editor.set("value","",false);
}else{
this.editor.set("value",undefined,false);
}
this._lastValue=this.makeEmptyValue();
this.displayValue="";
this.dataValue=null;
this.editor._lastValueReported="";
this.updateReadonlyValue();
this.resetState();
if(_26e&&this.hasValues()){
this.changed();
}
}else{
this.resetState();
}
},validationEnabled:function(){
return this.comboBox&&!this.restrictValues;
},_getValidatorNode:function(){
var _26f=dojo.query(".dijitValidationContainer",this.editor.domNode)[0];
_26f.firstChild.value="";
return _26f;
},blurred:function(){
this.inherited(arguments);
var _270=this.displayValue;
if(this.getDisplayValue()!=_270){
this.doOnchange();
}
},getInvalid:function(){
if(!this.validationEnabled()){
if(this.required&&!this.getDataValue()){
return true;
}
return false;
}
var _271;
if(!this.editor||this.editor._focused){
_271=true;
}else{
var _272=this.getDataValue();
var _273=Boolean(_272);
var _274=this.getDisplayValue();
this._isValid=(!this.restrictValues||(_274&&_273||!_274));
if(this.readonly){
_271=true;
}else{
if(this.required){
if(!this.restrictValues&&!_274){
_271=false;
}else{
if(this.restrictValues&&!_273){
_271=false;
}else{
_271=true;
}
}
}else{
if(this.restrictValues&&_274&&!_273){
_271=false;
}else{
_271=true;
}
}
}
}
if(_271){
this.validatorNode.style.display="none";
}
return !_271;
},getSelectedIndex:function(){
return this.getItemIndex(this.selectedItem.getData());
},getItemIndex:function(item){
if(!item){
return -1;
}
var data=this.editor.store.data;
for(var i=0;i<data.length;i++){
if(item==data[i]||item[this.dataField]==data[i][this.dataField]){
return i;
}
}
return -1;
},getEditorValue:function(){
var _275=this.inherited(arguments);
if(!_275&&!this.restrictValues){
_275=this.editor.get("displayedValue");
}
return (_275||_275===0)?_275:this.makeEmptyValue();
},getDisplayValue:function(){
if(this.editor){
return this.editor.get("displayedValue");
}
return null;
},blurred:function(){
this.changed();
this.doOnblur();
},changed:function(){
var item;
var _276;
if(!this.comboBox){
_276=this.editor.get("value");
var _277=this.dataSet.getItem(_276);
this.selectedItem.setData(_277);
return this.inherited(arguments);
}else{
item=this.editor.get("item");
var _277=null;
var _278=this.editor.get("displayedValue");
if(item&&_278==item.name){
_276=item.id;
var _277=this.dataSet.getItem(_276);
this.selectedItem.setData(_277);
}else{
this.selectedItem.setData(null);
}
if(this.editor._lastValueReported===""&&_278!==""){
this.editor._lastValueReported=_278;
}
return this.inherited(arguments);
}
},selectItem:function(_279){
if(!this.editor){
return;
}
var item=this.dataSet.getItem(_279);
this.selectedItem.setData(item);
if(this.comboBox){
this.editor.set("displayedValue",this._getDisplayData(item),false);
}else{
this.editor.set("value",String(item.getIndexInOwner()),false);
}
}});
dojo.declare("wm.Lookup",wm.SelectMenu,{dataField:"",autoDataSet:true,startUpdate:true,maxResults:500,ignoreCase:true,init:function(){
this.inherited(arguments);
if(this.autoDataSet&&this.formField){
this.createDataSet();
}
this.dataField="";
},createDataSet:function(){
wm.fire(this.$.liveVariable,"destroy");
var _27a=this.getParentForm();
if(_27a){
if(wm.isInstanceType(_27a,wm.LiveForm)&&!_27a.dataSet){
return;
}
if(wm.isInstanceType(_27a,wm.DataForm)&&!_27a.dataSet&&!_27a.type){
return;
}
if(!wm.getFormLiveView||!wm.getFormField){
return;
}
var view=wm.getFormLiveView(_27a);
var _27b=_27a instanceof wm.DataForm?_27a.type:_27a.dataSet.type;
var ff=wm.getFormField(this);
try{
var _27c=_27b&&_27b!="any"?wm.typeManager.getType(_27b).fields[ff].type:"string";
}
catch(e){
}
if(view&&!this._isDesignLoaded){
view.addRelated(ff);
}
var lv=this.dataSet=new wm.LiveVariable({name:"liveVariable",owner:this,autoUpdate:false,startUpdate:false,_rootField:view?ff:null,liveView:view,liveSource:view?undefined:_27c,maxResults:this.maxResults,ignoreCase:this.ignoreCase,refireOnDbChange:true,orderBy:this.orderBy});
this.selectedItem.setType(this.dataSet.type);
this.createDataSetWire(lv);
}
},createDataSetWire:function(_27d){
var w=this._dataSetWire=new wm.Wire({name:"dataFieldWire",target:this,owner:this,source:_27d.getId(),targetProperty:"dataSet"});
w.connectWire();
},setAutoDataSet:function(_27e){
this.autoDataSet=_27e;
if(this.autoDataSet){
this.createDataSet();
this.update();
}
},_getFormSource:function(_27f){
if(this.isAncestorInstanceOf(wm.RelatedEditor)){
var w=wm.data.getPropWire(_27f,"dataSet");
return w&&w.source&&this.getRoot().getValueById(w.source);
}else{
var lf=this.isAncestorInstanceOf(wm.LiveForm)||this.isAncestorInstanceOf(wm.DataForm);
if(lf&&this.formField){
return lf.dataSet.getValue(this.formField);
}
}
},changed:function(){
if(this.isUpdating()){
return;
}
this.inherited(arguments);
if(wm.getParentForm){
var f=wm.getParentForm(this);
if(f instanceof wm.RelatedEditor){
var s=this._getFormSource(f);
if(s){
s.beginUpdate();
var v=this._selectedData;
if(this.autoDataSet&&this.dataSet){
var i=this.getItemIndex(v);
if(i>=0){
this.dataSet.cursor=i;
}
}
s.setData(v);
this.endEditUpdate();
}
}
}
}});
dojo.declare("wm.FilteringLookup",wm.Lookup,{startUpdate:false,restrictValues:true,changeOnKey:true,pageSize:25,autoComplete:true,hasDownArrow:false,placeHolder:"Start typing to find matches",filterField:"",prepare:function(){
this.inherited(arguments);
this.maxResults=this.pageSize;
this.filterField=this.displayField;
this.orderBy="asc: "+this.displayField;
},setDataSet:function(_280){
this.inherited(arguments);
if(this.dataSet){
wm.onidle(this,function(){
var item=this.editor.get("item");
if(item){
if(item[this._storeNameField]!=this.editor.get("displayedValue")){
item=null;
}
}
if(!item&&this.editor.get("displayedValue")){
this.editor._startSearchFromInput();
}
this._onchange();
});
}
},setDataValue:function(_281){
if(this.dataSet&&_281){
this.dataSet.setData(_281?[_281]:null);
}
this.inherited(arguments);
},setPageSize:function(_282){
this.maxResults=this.pageSize=_282;
},doOnchange:function(){
this._onchange();
if(this.editor.get("item")){
this.inherited(arguments);
}
},_onchange:function(){
if(this.disabled||this.readonly){
return;
}
var _283=this.editor.get("displayedValue");
var _284=this.dataSet.filter.getValue(this.filterField);
if(!this.editor.get("item")){
this.dataValue="";
}
if(_283!=_284&&!this.dataSet._requester){
this.dataSet.filter.setValue(this.filterField,_283);
if(_283===undefined||_283===null||_283===""){
this.dataSet.setData([]);
}else{
this.dataSet.update();
}
}
},getDisplayValue:function(){
if(this.editor){
return this.editor.get("displayedValue");
}else{
return this.inherited(arguments);
}
},_end:0});
}
if(!dojo._hasResource["dojo.fx.Toggler"]){
dojo._hasResource["dojo.fx.Toggler"]=true;
dojo.provide("dojo.fx.Toggler");
dojo.declare("dojo.fx.Toggler",null,{node:null,showFunc:dojo.fadeIn,hideFunc:dojo.fadeOut,showDuration:200,hideDuration:200,constructor:function(args){
var _285=this;
dojo.mixin(_285,args);
_285.node=args.node;
_285._showArgs=dojo.mixin({},args);
_285._showArgs.node=_285.node;
_285._showArgs.duration=_285.showDuration;
_285.showAnim=_285.showFunc(_285._showArgs);
_285._hideArgs=dojo.mixin({},args);
_285._hideArgs.node=_285.node;
_285._hideArgs.duration=_285.hideDuration;
_285.hideAnim=_285.hideFunc(_285._hideArgs);
dojo.connect(_285.showAnim,"beforeBegin",dojo.hitch(_285.hideAnim,"stop",true));
dojo.connect(_285.hideAnim,"beforeBegin",dojo.hitch(_285.showAnim,"stop",true));
},show:function(_286){
return this.showAnim.play(_286||0);
},hide:function(_287){
return this.hideAnim.play(_287||0);
}});
}
if(!dojo._hasResource["dojo.fx"]){
dojo._hasResource["dojo.fx"]=true;
dojo.provide("dojo.fx");
(function(){
var d=dojo,_288={_fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,args||[]);
}
return this;
}};
var _289=function(_28a){
this._index=-1;
this._animations=_28a||[];
this._current=this._onAnimateCtx=this._onEndCtx=null;
this.duration=0;
d.forEach(this._animations,function(a){
this.duration+=a.duration;
if(a.delay){
this.duration+=a.delay;
}
},this);
};
d.extend(_289,{_onAnimate:function(){
this._fire("onAnimate",arguments);
},_onEnd:function(){
d.disconnect(this._onAnimateCtx);
d.disconnect(this._onEndCtx);
this._onAnimateCtx=this._onEndCtx=null;
if(this._index+1==this._animations.length){
this._fire("onEnd");
}else{
this._current=this._animations[++this._index];
this._onAnimateCtx=d.connect(this._current,"onAnimate",this,"_onAnimate");
this._onEndCtx=d.connect(this._current,"onEnd",this,"_onEnd");
this._current.play(0,true);
}
},play:function(_28b,_28c){
if(!this._current){
this._current=this._animations[this._index=0];
}
if(!_28c&&this._current.status()=="playing"){
return this;
}
var _28d=d.connect(this._current,"beforeBegin",this,function(){
this._fire("beforeBegin");
}),_28e=d.connect(this._current,"onBegin",this,function(arg){
this._fire("onBegin",arguments);
}),_28f=d.connect(this._current,"onPlay",this,function(arg){
this._fire("onPlay",arguments);
d.disconnect(_28d);
d.disconnect(_28e);
d.disconnect(_28f);
});
if(this._onAnimateCtx){
d.disconnect(this._onAnimateCtx);
}
this._onAnimateCtx=d.connect(this._current,"onAnimate",this,"_onAnimate");
if(this._onEndCtx){
d.disconnect(this._onEndCtx);
}
this._onEndCtx=d.connect(this._current,"onEnd",this,"_onEnd");
this._current.play.apply(this._current,arguments);
return this;
},pause:function(){
if(this._current){
var e=d.connect(this._current,"onPause",this,function(arg){
this._fire("onPause",arguments);
d.disconnect(e);
});
this._current.pause();
}
return this;
},gotoPercent:function(_290,_291){
this.pause();
var _292=this.duration*_290;
this._current=null;
d.some(this._animations,function(a){
if(a.duration<=_292){
this._current=a;
return true;
}
_292-=a.duration;
return false;
});
if(this._current){
this._current.gotoPercent(_292/this._current.duration,_291);
}
return this;
},stop:function(_293){
if(this._current){
if(_293){
for(;this._index+1<this._animations.length;++this._index){
this._animations[this._index].stop(true);
}
this._current=this._animations[this._index];
}
var e=d.connect(this._current,"onStop",this,function(arg){
this._fire("onStop",arguments);
d.disconnect(e);
});
this._current.stop();
}
return this;
},status:function(){
return this._current?this._current.status():"stopped";
},destroy:function(){
if(this._onAnimateCtx){
d.disconnect(this._onAnimateCtx);
}
if(this._onEndCtx){
d.disconnect(this._onEndCtx);
}
}});
d.extend(_289,_288);
dojo.fx.chain=function(_294){
return new _289(_294);
};
var _295=function(_296){
this._animations=_296||[];
this._connects=[];
this._finished=0;
this.duration=0;
d.forEach(_296,function(a){
var _297=a.duration;
if(a.delay){
_297+=a.delay;
}
if(this.duration<_297){
this.duration=_297;
}
this._connects.push(d.connect(a,"onEnd",this,"_onEnd"));
},this);
this._pseudoAnimation=new d.Animation({curve:[0,1],duration:this.duration});
var self=this;
d.forEach(["beforeBegin","onBegin","onPlay","onAnimate","onPause","onStop","onEnd"],function(evt){
self._connects.push(d.connect(self._pseudoAnimation,evt,function(){
self._fire(evt,arguments);
}));
});
};
d.extend(_295,{_doAction:function(_298,args){
d.forEach(this._animations,function(a){
a[_298].apply(a,args);
});
return this;
},_onEnd:function(){
if(++this._finished>this._animations.length){
this._fire("onEnd");
}
},_call:function(_299,args){
var t=this._pseudoAnimation;
t[_299].apply(t,args);
},play:function(_29a,_29b){
this._finished=0;
this._doAction("play",arguments);
this._call("play",arguments);
return this;
},pause:function(){
this._doAction("pause",arguments);
this._call("pause",arguments);
return this;
},gotoPercent:function(_29c,_29d){
var ms=this.duration*_29c;
d.forEach(this._animations,function(a){
a.gotoPercent(a.duration<ms?1:(ms/a.duration),_29d);
});
this._call("gotoPercent",arguments);
return this;
},stop:function(_29e){
this._doAction("stop",arguments);
this._call("stop",arguments);
return this;
},status:function(){
return this._pseudoAnimation.status();
},destroy:function(){
d.forEach(this._connects,dojo.disconnect);
}});
d.extend(_295,_288);
dojo.fx.combine=function(_29f){
return new _295(_29f);
};
dojo.fx.wipeIn=function(args){
var node=args.node=d.byId(args.node),s=node.style,o;
var anim=d.animateProperty(d.mixin({properties:{height:{start:function(){
o=s.overflow;
s.overflow="hidden";
if(s.visibility=="hidden"||s.display=="none"){
s.height="1px";
s.display="";
s.visibility="";
return 1;
}else{
var _2a0=d.style(node,"height");
return Math.max(_2a0,1);
}
},end:function(){
return node.scrollHeight;
}}}},args));
d.connect(anim,"onEnd",function(){
s.height="auto";
s.overflow=o;
});
return anim;
};
dojo.fx.wipeOut=function(args){
var node=args.node=d.byId(args.node),s=node.style,o;
var anim=d.animateProperty(d.mixin({properties:{height:{end:1}}},args));
d.connect(anim,"beforeBegin",function(){
o=s.overflow;
s.overflow="hidden";
s.display="";
});
d.connect(anim,"onEnd",function(){
s.overflow=o;
s.height="auto";
s.display="none";
});
return anim;
};
dojo.fx.slideTo=function(args){
var node=args.node=d.byId(args.node),top=null,left=null;
var init=(function(n){
return function(){
var cs=d.getComputedStyle(n);
var pos=cs.position;
top=(pos=="absolute"?n.offsetTop:parseInt(cs.top)||0);
left=(pos=="absolute"?n.offsetLeft:parseInt(cs.left)||0);
if(pos!="absolute"&&pos!="relative"){
var ret=d.position(n,true);
top=ret.y;
left=ret.x;
n.style.position="absolute";
n.style.top=top+"px";
n.style.left=left+"px";
}
};
})(node);
init();
var anim=d.animateProperty(d.mixin({properties:{top:args.top||0,left:args.left||0}},args));
d.connect(anim,"beforeBegin",anim,init);
return anim;
};
})();
}
if(!dojo._hasResource["dojo.colors"]){
dojo._hasResource["dojo.colors"]=true;
dojo.provide("dojo.colors");
dojo.getObject("colors",true,dojo);
(function(){
var _2a1=function(m1,m2,h){
if(h<0){
++h;
}
if(h>1){
--h;
}
var h6=6*h;
if(h6<1){
return m1+(m2-m1)*h6;
}
if(2*h<1){
return m2;
}
if(3*h<2){
return m1+(m2-m1)*(2/3-h)*6;
}
return m1;
};
dojo.colorFromRgb=function(_2a2,obj){
var m=_2a2.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
if(m){
var c=m[2].split(/\s*,\s*/),l=c.length,t=m[1],a;
if((t=="rgb"&&l==3)||(t=="rgba"&&l==4)){
var r=c[0];
if(r.charAt(r.length-1)=="%"){
a=dojo.map(c,function(x){
return parseFloat(x)*2.56;
});
if(l==4){
a[3]=c[3];
}
return dojo.colorFromArray(a,obj);
}
return dojo.colorFromArray(c,obj);
}
if((t=="hsl"&&l==3)||(t=="hsla"&&l==4)){
var H=((parseFloat(c[0])%360)+360)%360/360,S=parseFloat(c[1])/100,L=parseFloat(c[2])/100,m2=L<=0.5?L*(S+1):L+S-L*S,m1=2*L-m2;
a=[_2a1(m1,m2,H+1/3)*256,_2a1(m1,m2,H)*256,_2a1(m1,m2,H-1/3)*256,1];
if(l==4){
a[3]=c[3];
}
return dojo.colorFromArray(a,obj);
}
}
return null;
};
var _2a3=function(c,low,high){
c=Number(c);
return isNaN(c)?high:c<low?low:c>high?high:c;
};
dojo.Color.prototype.sanitize=function(){
var t=this;
t.r=Math.round(_2a3(t.r,0,255));
t.g=Math.round(_2a3(t.g,0,255));
t.b=Math.round(_2a3(t.b,0,255));
t.a=_2a3(t.a,0,1);
return this;
};
})();
dojo.colors.makeGrey=function(g,a){
return dojo.colorFromArray([g,g,g,a]);
};
dojo.mixin(dojo.Color.named,{aliceblue:[240,248,255],antiquewhite:[250,235,215],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],blanchedalmond:[255,235,205],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],oldlace:[253,245,230],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],thistle:[216,191,216],tomato:[255,99,71],transparent:[0,0,0,0],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],whitesmoke:[245,245,245],yellowgreen:[154,205,50]});
}
if(!dojo._hasResource["dojox.color._base"]){
dojo._hasResource["dojox.color._base"]=true;
dojo.provide("dojox.color._base");
dojox.color.Color=dojo.Color;
dojox.color.blend=dojo.blendColors;
dojox.color.fromRgb=dojo.colorFromRgb;
dojox.color.fromHex=dojo.colorFromHex;
dojox.color.fromArray=dojo.colorFromArray;
dojox.color.fromString=dojo.colorFromString;
dojox.color.greyscale=dojo.colors.makeGrey;
dojo.mixin(dojox.color,{fromCmy:function(cyan,_2a4,_2a5){
if(dojo.isArray(cyan)){
_2a4=cyan[1],_2a5=cyan[2],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_2a4=cyan.m,_2a5=cyan.y,cyan=cyan.c;
}
}
cyan/=100,_2a4/=100,_2a5/=100;
var r=1-cyan,g=1-_2a4,b=1-_2a5;
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromCmyk:function(cyan,_2a6,_2a7,_2a8){
if(dojo.isArray(cyan)){
_2a6=cyan[1],_2a7=cyan[2],_2a8=cyan[3],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_2a6=cyan.m,_2a7=cyan.y,_2a8=cyan.b,cyan=cyan.c;
}
}
cyan/=100,_2a6/=100,_2a7/=100,_2a8/=100;
var r,g,b;
r=1-Math.min(1,cyan*(1-_2a8)+_2a8);
g=1-Math.min(1,_2a6*(1-_2a8)+_2a8);
b=1-Math.min(1,_2a7*(1-_2a8)+_2a8);
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsl:function(hue,_2a9,_2aa){
if(dojo.isArray(hue)){
_2a9=hue[1],_2aa=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_2a9=hue.s,_2aa=hue.l,hue=hue.h;
}
}
_2a9/=100;
_2aa/=100;
while(hue<0){
hue+=360;
}
while(hue>=360){
hue-=360;
}
var r,g,b;
if(hue<120){
r=(120-hue)/60,g=hue/60,b=0;
}else{
if(hue<240){
r=0,g=(240-hue)/60,b=(hue-120)/60;
}else{
r=(hue-240)/60,g=0,b=(360-hue)/60;
}
}
r=2*_2a9*Math.min(r,1)+(1-_2a9);
g=2*_2a9*Math.min(g,1)+(1-_2a9);
b=2*_2a9*Math.min(b,1)+(1-_2a9);
if(_2aa<0.5){
r*=_2aa,g*=_2aa,b*=_2aa;
}else{
r=(1-_2aa)*r+2*_2aa-1;
g=(1-_2aa)*g+2*_2aa-1;
b=(1-_2aa)*b+2*_2aa-1;
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsv:function(hue,_2ab,_2ac){
if(dojo.isArray(hue)){
_2ab=hue[1],_2ac=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_2ab=hue.s,_2ac=hue.v,hue=hue.h;
}
}
if(hue==360){
hue=0;
}
_2ab/=100;
_2ac/=100;
var r,g,b;
if(_2ab==0){
r=_2ac,b=_2ac,g=_2ac;
}else{
var _2ad=hue/60,i=Math.floor(_2ad),f=_2ad-i;
var p=_2ac*(1-_2ab);
var q=_2ac*(1-(_2ab*f));
var t=_2ac*(1-(_2ab*(1-f)));
switch(i){
case 0:
r=_2ac,g=t,b=p;
break;
case 1:
r=q,g=_2ac,b=p;
break;
case 2:
r=p,g=_2ac,b=t;
break;
case 3:
r=p,g=q,b=_2ac;
break;
case 4:
r=t,g=p,b=_2ac;
break;
case 5:
r=_2ac,g=p,b=q;
break;
}
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
}});
dojo.extend(dojox.color.Color,{toCmy:function(){
var cyan=1-(this.r/255),_2ae=1-(this.g/255),_2af=1-(this.b/255);
return {c:Math.round(cyan*100),m:Math.round(_2ae*100),y:Math.round(_2af*100)};
},toCmyk:function(){
var cyan,_2b0,_2b1,_2b2;
var r=this.r/255,g=this.g/255,b=this.b/255;
_2b2=Math.min(1-r,1-g,1-b);
cyan=(1-r-_2b2)/(1-_2b2);
_2b0=(1-g-_2b2)/(1-_2b2);
_2b1=(1-b-_2b2)/(1-_2b2);
return {c:Math.round(cyan*100),m:Math.round(_2b0*100),y:Math.round(_2b1*100),b:Math.round(_2b2*100)};
},toHsl:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _2b3=max-min;
var h=0,s=0,l=(min+max)/2;
if(l>0&&l<1){
s=_2b3/((l<0.5)?(2*l):(2-2*l));
}
if(_2b3>0){
if(max==r&&max!=g){
h+=(g-b)/_2b3;
}
if(max==g&&max!=b){
h+=(2+(b-r)/_2b3);
}
if(max==b&&max!=r){
h+=(4+(r-g)/_2b3);
}
h*=60;
}
return {h:h,s:Math.round(s*100),l:Math.round(l*100)};
},toHsv:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _2b4=max-min;
var h=null,s=(max==0)?0:(_2b4/max);
if(s==0){
h=0;
}else{
if(r==max){
h=60*(g-b)/_2b4;
}else{
if(g==max){
h=120+60*(b-r)/_2b4;
}else{
h=240+60*(r-g)/_2b4;
}
}
if(h<0){
h+=360;
}
}
return {h:h,s:Math.round(s*100),v:Math.round(max*100)};
}});
}
if(!dojo._hasResource["dojox.color"]){
dojo._hasResource["dojox.color"]=true;
dojo.provide("dojox.color");
}
if(!dojo._hasResource["dojox.widget.ColorPicker"]){
dojo._hasResource["dojox.widget.ColorPicker"]=true;
dojo.provide("dojox.widget.ColorPicker");
dojo.experimental("dojox.widget.ColorPicker");
(function(d){
var _2b5=function(hex){
return hex;
};
dojo.declare("dojox.widget.ColorPicker",dijit.form._FormWidget,{showRgb:true,showHsv:true,showHex:true,webSafe:true,animatePoint:true,slideDuration:250,liveUpdate:false,PICKER_HUE_H:150,PICKER_SAT_VAL_H:150,PICKER_SAT_VAL_W:150,PICKER_HUE_SELECTOR_H:8,PICKER_SAT_SELECTOR_H:10,PICKER_SAT_SELECTOR_W:10,value:"#ffffff",_underlay:d.moduleUrl("dojox.widget","ColorPicker/images/underlay.png"),_hueUnderlay:d.moduleUrl("dojox.widget","ColorPicker/images/hue.png"),_pickerPointer:d.moduleUrl("dojox.widget","ColorPicker/images/pickerPointer.png"),_huePickerPointer:d.moduleUrl("dojox.widget","ColorPicker/images/hueHandle.png"),_huePickerPointerAlly:d.moduleUrl("dojox.widget","ColorPicker/images/hueHandleA11y.png"),templateString:dojo.cache("dojox.widget","ColorPicker/ColorPicker.html","<table class=\"dojoxColorPicker\" dojoAttachEvent=\"onkeypress: _handleKey\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t<div class=\"dojoxColorPickerBox\">\n\t\t\t\t<!-- Forcing ABS in style attr due to dojo DND issue with not picking it up form the class. -->\n\t\t\t\t<img role=\"status\" title=\"${saturationPickerTitle}\" alt=\"${saturationPickerTitle}\" class=\"dojoxColorPickerPoint\" src=\"${_pickerPointer}\" tabIndex=\"0\" dojoAttachPoint=\"cursorNode\" style=\"position: absolute; top: 0px; left: 0px;\">\n\t\t\t\t<img role=\"presentation\" alt=\"\" dojoAttachPoint=\"colorUnderlay\" dojoAttachEvent=\"onclick: _setPoint, onmousedown: _stopDrag\" class=\"dojoxColorPickerUnderlay\" src=\"${_underlay}\" ondragstart=\"return false\">\n\t\t\t</div>\n\t\t</td>\n\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t<div class=\"dojoxHuePicker\">\n\t\t\t\t<!-- Forcing ABS in style attr due to dojo DND issue with not picking it up form the class. -->\n\t\t\t\t<img role=\"status\" dojoAttachPoint=\"hueCursorNode\" tabIndex=\"0\" class=\"dojoxHuePickerPoint\" title=\"${huePickerTitle}\" alt=\"${huePickerTitle}\" src=\"${_huePickerPointer}\" style=\"position: absolute; top: 0px; left: 0px;\">\n\t\t\t\t<div class=\"dojoxHuePickerUnderlay\" dojoAttachPoint=\"hueNode\">\n\t\t\t\t    <img role=\"presentation\" alt=\"\" dojoAttachEvent=\"onclick: _setHuePoint, onmousedown: _stopDrag\" src=\"${_hueUnderlay}\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</td>\n\t\t<td valign=\"top\">\n\t\t\t<table cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td valign=\"top\" class=\"dojoxColorPickerPreviewContainer\">\n\t\t\t\t\t\t<table cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td valign=\"top\" class=\"dojoxColorPickerRightPad\">\n\t\t\t\t\t\t\t\t\t<div dojoAttachPoint=\"previewNode\" class=\"dojoxColorPickerPreview\"></div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t\t\t\t<div dojoAttachPoint=\"safePreviewNode\" class=\"dojoxColorPickerWebSafePreview\"></div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td valign=\"bottom\">\n\t\t\t\t\t\t<table class=\"dojoxColorPickerOptional\" cellpadding=\"0\" cellspacing=\"0\">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class=\"dijitInline dojoxColorPickerRgb\" dojoAttachPoint=\"rgbNode\">\n\t\t\t\t\t\t\t\t\t\t<table cellpadding=\"1\" cellspacing=\"1\">\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_r\">${redLabel}</label></td><td><input id=\"${_uId}_r\" dojoAttachPoint=\"Rval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_g\">${greenLabel}</label></td><td><input id=\"${_uId}_g\" dojoAttachPoint=\"Gval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_b\">${blueLabel}</label></td><td><input id=\"${_uId}_b\" dojoAttachPoint=\"Bval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"></td></tr>\n\t\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div class=\"dijitInline dojoxColorPickerHsv\" dojoAttachPoint=\"hsvNode\">\n\t\t\t\t\t\t\t\t\t\t<table cellpadding=\"1\" cellspacing=\"1\">\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_h\">${hueLabel}</label></td><td><input id=\"${_uId}_h\" dojoAttachPoint=\"Hval\"size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${degLabel}</td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_s\">${saturationLabel}</label></td><td><input id=\"${_uId}_s\" dojoAttachPoint=\"Sval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${percentSign}</td></tr>\n\t\t\t\t\t\t\t\t\t\t<tr><td><label for=\"${_uId}_v\">${valueLabel}</label></td><td><input id=\"${_uId}_v\" dojoAttachPoint=\"Vval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\"> ${percentSign}</td></tr>\n\t\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<!--  Copyright (C) 2011 VMware, Inc. All rights reserved. Licensed under the Apache License 2.0 - http://www.apache.org/licenses/LICENSE-2.0 \n\t\t\t\t\t\t\t WaveMaker: set display:none because it was not laid out to our satisfaction -->\n\t\t\t\t\t\t\t<tr style=\"display:none\">\n\t\t\t\t\t\t\t\t<td colspan=\"2\">\n\t\t\t\t\t\t\t\t\t<div class=\"dojoxColorPickerHex\" dojoAttachPoint=\"hexNode\" aria-live=\"polite\">\t\n\t\t\t\t\t\t\t\t\t\t<label for=\"${_uId}_hex\">&nbsp;${hexLabel}&nbsp;</label><input id=\"${_uId}_hex\" dojoAttachPoint=\"hexCode, focusNode, valueNode\" size=\"6\" class=\"dojoxColorPickerHexCode\" dojoAttachEvent=\"onchange: _colorInputChange\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</td>\n\t</tr>\n</table>\n\n"),postMixInProperties:function(){
if(dojo.hasClass(dojo.body(),"dijit_a11y")){
this._huePickerPointer=this._huePickerPointerAlly;
}
this._uId=dijit.getUniqueId(this.id);
dojo.mixin(this,dojo.i18n.getLocalization("dojox.widget","ColorPicker"));
dojo.mixin(this,dojo.i18n.getLocalization("dojo.cldr","number"));
this.inherited(arguments);
},postCreate:function(){
this.inherited(arguments);
if(d.isIE<7){
this.colorUnderlay.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this._underlay+"', sizingMethod='scale')";
this.colorUnderlay.src=this._blankGif.toString();
}
if(!this.showRgb){
this.rgbNode.style.visibility="hidden";
}
if(!this.showHsv){
this.hsvNode.style.visibility="hidden";
}
if(!this.showHex){
this.hexNode.style.visibility="hidden";
}
if(!this.webSafe){
this.safePreviewNode.style.visibility="hidden";
}
},startup:function(){
if(this._started){
return;
}
this._started=true;
this.set("value",this.value);
this._mover=new d.dnd.move.boxConstrainedMoveable(this.cursorNode,{box:{t:-(this.PICKER_SAT_SELECTOR_H/2),l:-(this.PICKER_SAT_SELECTOR_W/2),w:this.PICKER_SAT_VAL_W,h:this.PICKER_SAT_VAL_H}});
this._hueMover=new d.dnd.move.boxConstrainedMoveable(this.hueCursorNode,{box:{t:-(this.PICKER_HUE_SELECTOR_H/2),l:0,w:0,h:this.PICKER_HUE_H}});
this._subs=[];
this._subs.push(d.subscribe("/dnd/move/stop",d.hitch(this,"_clearTimer")));
this._subs.push(d.subscribe("/dnd/move/start",d.hitch(this,"_setTimer")));
this._keyListeners=[];
this._connects.push(dijit.typematic.addKeyListener(this.hueCursorNode,{charOrCode:dojo.keys.UP_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateHueCursorNode),25,25));
this._connects.push(dijit.typematic.addKeyListener(this.hueCursorNode,{charOrCode:dojo.keys.DOWN_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateHueCursorNode),25,25));
this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{charOrCode:dojo.keys.UP_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateCursorNode),25,25));
this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{charOrCode:dojo.keys.DOWN_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateCursorNode),25,25));
this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{charOrCode:dojo.keys.LEFT_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateCursorNode),25,25));
this._connects.push(dijit.typematic.addKeyListener(this.cursorNode,{charOrCode:dojo.keys.RIGHT_ARROW,shiftKey:false,metaKey:false,ctrlKey:false,altKey:false},this,dojo.hitch(this,this._updateCursorNode),25,25));
},_setValueAttr:function(_2b6){
if(!this._started){
return;
}
this.setColor(_2b6,true);
},setColor:function(_2b7,_2b8){
var col=dojox.color.fromString(_2b7);
this._updatePickerLocations(col);
this._updateColorInputs(col);
this._updateValue(col,_2b8);
},_setTimer:function(_2b9){
dijit.focus(_2b9.node);
d.setSelectable(this.domNode,false);
this._timer=setInterval(d.hitch(this,"_updateColor"),45);
},_clearTimer:function(_2ba){
clearInterval(this._timer);
this._timer=null;
this.onChange(this.value);
d.setSelectable(this.domNode,true);
},_setHue:function(h){
d.style(this.colorUnderlay,"backgroundColor",dojox.color.fromHsv(h,100,100).toHex());
},_updateHueCursorNode:function(_2bb,node,e){
if(_2bb!==-1){
var y=dojo.style(this.hueCursorNode,"top");
var _2bc=(this.PICKER_HUE_SELECTOR_H/2);
y+=_2bc;
var _2bd=false;
if(e.charOrCode==dojo.keys.UP_ARROW){
if(y>0){
y-=1;
_2bd=true;
}
}else{
if(e.charOrCode==dojo.keys.DOWN_ARROW){
if(y<this.PICKER_HUE_H){
y+=1;
_2bd=true;
}
}
}
y-=_2bc;
if(_2bd){
dojo.style(this.hueCursorNode,"top",y+"px");
}
}else{
this._updateColor(true);
}
},_updateCursorNode:function(_2be,node,e){
var _2bf=this.PICKER_SAT_SELECTOR_H/2;
var _2c0=this.PICKER_SAT_SELECTOR_W/2;
if(_2be!==-1){
var y=dojo.style(this.cursorNode,"top");
var x=dojo.style(this.cursorNode,"left");
y+=_2bf;
x+=_2c0;
var _2c1=false;
if(e.charOrCode==dojo.keys.UP_ARROW){
if(y>0){
y-=1;
_2c1=true;
}
}else{
if(e.charOrCode==dojo.keys.DOWN_ARROW){
if(y<this.PICKER_SAT_VAL_H){
y+=1;
_2c1=true;
}
}else{
if(e.charOrCode==dojo.keys.LEFT_ARROW){
if(x>0){
x-=1;
_2c1=true;
}
}else{
if(e.charOrCode==dojo.keys.RIGHT_ARROW){
if(x<this.PICKER_SAT_VAL_W){
x+=1;
_2c1=true;
}
}
}
}
}
if(_2c1){
y-=_2bf;
x-=_2c0;
dojo.style(this.cursorNode,"top",y+"px");
dojo.style(this.cursorNode,"left",x+"px");
}
}else{
this._updateColor(true);
}
},_updateColor:function(){
var _2c2=this.PICKER_HUE_SELECTOR_H/2,_2c3=this.PICKER_SAT_SELECTOR_H/2,_2c4=this.PICKER_SAT_SELECTOR_W/2;
var _2c5=d.style(this.hueCursorNode,"top")+_2c2,_2c6=d.style(this.cursorNode,"top")+_2c3,_2c7=d.style(this.cursorNode,"left")+_2c4,h=Math.round(360-(_2c5/this.PICKER_HUE_H*360)),col=dojox.color.fromHsv(h,_2c7/this.PICKER_SAT_VAL_W*100,100-(_2c6/this.PICKER_SAT_VAL_H*100));
this._updateColorInputs(col);
this._updateValue(col,true);
if(h!=this._hue){
this._setHue(h);
}
},_colorInputChange:function(e){
var col,_2c8=false;
switch(e.target){
case this.hexCode:
col=dojox.color.fromString(e.target.value);
_2c8=true;
break;
case this.Rval:
case this.Gval:
case this.Bval:
col=dojox.color.fromArray([this.Rval.value,this.Gval.value,this.Bval.value]);
_2c8=true;
break;
case this.Hval:
case this.Sval:
case this.Vval:
col=dojox.color.fromHsv(this.Hval.value,this.Sval.value,this.Vval.value);
_2c8=true;
break;
}
if(_2c8){
this._updatePickerLocations(col);
this._updateColorInputs(col);
this._updateValue(col,true);
}
},_updateValue:function(col,_2c9){
var hex=col.toHex();
this.value=this.valueNode.value=hex;
if(_2c9&&(!this._timer||this.liveUpdate)){
this.onChange(hex);
}
},_updatePickerLocations:function(col){
var _2ca=this.PICKER_HUE_SELECTOR_H/2,_2cb=this.PICKER_SAT_SELECTOR_H/2,_2cc=this.PICKER_SAT_SELECTOR_W/2;
var hsv=col.toHsv(),ypos=Math.round(this.PICKER_HUE_H-hsv.h/360*this.PICKER_HUE_H)-_2ca,_2cd=Math.round(hsv.s/100*this.PICKER_SAT_VAL_W)-_2cc,_2ce=Math.round(this.PICKER_SAT_VAL_H-hsv.v/100*this.PICKER_SAT_VAL_H)-_2cb;
if(this.animatePoint){
d.fx.slideTo({node:this.hueCursorNode,duration:this.slideDuration,top:ypos,left:0}).play();
d.fx.slideTo({node:this.cursorNode,duration:this.slideDuration,top:_2ce,left:_2cd}).play();
}else{
d.style(this.hueCursorNode,"top",ypos+"px");
d.style(this.cursorNode,{left:_2cd+"px",top:_2ce+"px"});
}
if(hsv.h!=this._hue){
this._setHue(hsv.h);
}
},_updateColorInputs:function(col){
var hex=col.toHex();
if(this.showRgb){
this.Rval.value=col.r;
this.Gval.value=col.g;
this.Bval.value=col.b;
}
if(this.showHsv){
var hsv=col.toHsv();
this.Hval.value=Math.round((hsv.h));
this.Sval.value=Math.round(hsv.s);
this.Vval.value=Math.round(hsv.v);
}
if(this.showHex){
this.hexCode.value=hex;
}
this.previewNode.style.backgroundColor=hex;
if(this.webSafe){
this.safePreviewNode.style.backgroundColor=_2b5(hex);
}
},_setHuePoint:function(evt){
var _2cf=(this.PICKER_HUE_SELECTOR_H/2);
var coor=dojo.coords(this.colorUnderlay);
var ypos=evt.pageY-coor.y-2;
if(this.animatePoint){
d.fx.slideTo({node:this.hueCursorNode,duration:this.slideDuration,top:ypos,left:0,onEnd:d.hitch(this,function(){
this._updateColor(true);
dijit.focus(this.hueCursorNode);
})}).play();
}else{
d.style(this.hueCursorNode,"top",ypos+"px");
this._updateColor(false);
}
},_setPoint:function(evt){
var _2d0=this.PICKER_SAT_SELECTOR_H/2;
var _2d1=this.PICKER_SAT_SELECTOR_W/2;
var coor=dojo.coords(this.colorUnderlay);
var _2d2=evt.pageY-coor.y;
var _2d3=evt.pageX-coor.x;
if(evt){
dijit.focus(evt.target);
}
if(this.animatePoint){
d.fx.slideTo({node:this.cursorNode,duration:this.slideDuration,top:_2d2,left:_2d3,onEnd:d.hitch(this,function(){
this._updateColor(true);
dijit.focus(this.cursorNode);
})}).play();
}else{
d.style(this.cursorNode,{left:_2d3+"px",top:_2d2+"px"});
this._updateColor(false);
}
},_handleKey:function(e){
},focus:function(){
if(!this._focused){
dijit.focus(this.focusNode);
}
},_stopDrag:function(e){
dojo.stopEvent(e);
},destroy:function(){
this.inherited(arguments);
dojo.forEach(this._subs,function(sub){
dojo.unsubscribe(sub);
});
delete this._subs;
}});
})(dojo);
}
if(!dojo._hasResource["wm.base.widget.Dialogs.ColorPickerDialog"]){
dojo._hasResource["wm.base.widget.Dialogs.ColorPickerDialog"]=true;
dojo.provide("wm.base.widget.Dialogs.ColorPickerDialog");
dojo.declare("wm.ColorPickerDialog",wm.Dialog,{colorPicker:null,colorPickerSet:false,border:"1",borderColor:"#888888",width:"325px",height:"235px",modal:false,colorPickerControl:null,init:function(){
this.inherited(arguments);
},postInit:function(){
this.inherited(arguments);
if(!wm.ColorPickerDialog.cssLoaded){
var link=document.createElement("link");
link.rel="stylesheet";
link.type="text/css";
link.href=dojo.moduleUrl("dojox.widget.ColorPicker").uri+"ColorPicker.css";
document.getElementsByTagName("head")[0].appendChild(link);
wm.ColorPickerDialog.cssLoaded=true;
}
this.colorPickerControl=new wm.Control({name:"colorPickerControl",width:"325px",height:"170px",owner:this,parent:this});
this.textPanel=new wm.Panel({name:"buttonPanel",width:"100%",height:"26px",layoutKind:"left-to-right",owner:this,parent:this,horizontalAlign:"center"});
this.BrightenButton=new wm.Button({caption:"Bright",width:"75px",height:"100%",parent:this.textPanel,owner:this});
this.DarkenButton=new wm.Button({caption:"Dark",width:"75px",height:"100%",parent:this.textPanel,owner:this});
this.text=new wm.Text({owner:this,parent:this.textPanel,name:"text",width:"100%",resetButton:true,placeHolder:"Enter Color",changeOnKey:true,onchange:dojo.hitch(this,"textChange"),onEnterKeyPress:dojo.hitch(this,"onOK")});
this.buttonPanel=new wm.Panel({_classes:{domNode:["dialogfooter"]},name:"buttonPanel",width:"100%",height:"100%",layoutKind:"left-to-right",owner:this,parent:this,horizontalAlign:"right"});
this.CancelButton=new wm.Button({caption:"Cancel",width:"75px",height:"30px",parent:this.buttonPanel,owner:this});
this.OKButton=new wm.Button({caption:"OK",width:"75px",height:"30px",parent:this.buttonPanel,owner:this});
this.connect(this.BrightenButton,"onclick",this,"brighten");
this.connect(this.DarkenButton,"onclick",this,"darken");
this.connect(this.OKButton,"onclick",this,"onOK");
this.connect(this.CancelButton,"onclick",this,"onCancel");
this.domNode.style.backgroundColor="white";
},onCancel:function(){
},onOK:function(){
this.dismiss();
},getValue:function(){
if(this.colorPicker){
return this.colorPicker.getValue();
}else{
return this._tmpValue;
}
},setDijitValue:function(_2d4){
if(this.colorPicker){
if(_2d4){
this.colorPicker.setColor(_2d4);
}
}else{
this._tmpValue=_2d4;
}
if(this.text&&_2d4!=this.text.getDataValue()){
this.text.setDataValue(_2d4);
}
},setShowing:function(_2d5,_2d6){
var _2d7=Boolean(this.colorPicker);
if(!_2d7&&_2d5&&this.domNode){
this.colorPicker=new dojox.widget.ColorPicker({animatePoint:true,showHsv:false,showRtb:true,webSave:false,onChange:dojo.hitch(this,"valueChange")},this.domNode);
this.colorPicker.PICKER_SAT_VAL_H=152;
this.colorPicker.PICKER_SAT_VAL_W=152;
this.colorPicker.PICKER_HUE_H=150;
}
if(_2d5){
if(!this.showing){
this._changed=false;
}
if(this._tmpValue){
this.setDijitValue(this._tmpValue);
delete this._tmpValue;
}
if(this.domNode.parentNode!=document.body){
document.body.appendChild(this.domNode);
this.colorPickerControl.domNode.appendChild(this.colorPicker.domNode);
}
if(this.owner.editorNode){
var o=dojo._abs(this.owner.editorNode);
o.y+=this.owner.bounds.h;
this.bounds.t=o.y;
this.bounds.l=o.x;
this._fixPosition=true;
}
}
this.inherited(arguments);
if(!_2d7&&_2d5){
wm.onidle(this,function(){
this.colorPicker.startup();
});
}
},valueChange:function(_2d8){
this._changed=true;
this.text.setDataValue(_2d8);
this.onChange(_2d8);
},textChange:function(_2d9,_2da){
this._changed=true;
this.setDijitValue(_2d9);
this.onChange(_2d9);
},onChange:function(_2db){
},brighten:function(){
var _2dc=this.colorPicker.attr("value");
var _2dd=[parseInt(_2dc.substr(1,2),16),parseInt(_2dc.substr(3,2),16),parseInt(_2dc.substr(5,2),16)];
var _2de="#";
var _2df=0;
var _2e0=0;
for(var i=0;i<3;i++){
if(_2dd[i]==0){
_2df++;
}else{
if(_2dd[i]==255){
_2e0++;
}
}
}
var _2e1=0;
if(_2e0+_2df==3){
_2e1=40;
}
for(var i=0;i<3;i++){
_2dd[i]=Math.max(_2e1,Math.min(255,Math.floor(_2dd[i]*1.2)));
var str=_2dd[i].toString(16);
if(str.length<2){
str="0"+str;
}
_2de+=str;
}
this.setDijitValue(_2de);
this.onChange(_2de);
},darken:function(){
var _2e2=this.colorPicker.attr("value");
var _2e3=[parseInt(_2e2.substr(1,2),16),parseInt(_2e2.substr(3,2),16),parseInt(_2e2.substr(5,2),16)];
var _2e4="#";
for(var i=0;i<3;i++){
_2e3[i]=Math.floor(_2e3[i]*0.8);
var str=_2e3[i].toString(16);
if(str.length<2){
str="0"+str;
}
_2e4+=str;
}
this.setDijitValue(_2e4);
this.onChange(_2e4);
},destroy:function(){
if(this.colorPicker){
this.colorPicker.destroyRecursive();
}
this.inherited(arguments);
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.ColorPicker"]){
dojo._hasResource["wm.base.widget.Editors.ColorPicker"]=true;
dojo.provide("wm.base.widget.Editors.ColorPicker");
dojo.declare("wm.ColorPicker",wm.Text,{className:"wmeditor wmcolorpickereditor",_editorBackgroundColor:true,defaultColor:"",colorPickerDialog:null,cancelValue:null,_empty:true,regExp:"#[0-9a-fA-F]{6}",showMessages:false,init:function(){
this.inherited(arguments);
this.subscribe("wm.AbstractEditor-focused",this,function(_2e5){
if(this!=_2e5&&(!this.colorPickerDialog||this.colorPickerDialog.text!=_2e5)){
if(this.colorPickerDialog){
this.colorPickerDialog.dismiss();
}
}
});
},postInit:function(){
this.inherited(arguments);
var v=this.getDataValue()||this.defaultColor;
this.setNodeColors(v);
},createColorPicker:function(){
wm.getComponentStructure("wm.ColorPickerDialog");
this.colorPickerDialog=new wm.ColorPickerDialog({owner:this});
this.colorPickerDialog.connect(this.colorPickerDialog,"onChange",this,function(_2e6){
if(this.colorPickerDialog.showing){
this.setDataValue(_2e6);
}
});
this.colorPickerDialog.connect(this.colorPickerDialog,"onCancel",this,function(_2e7){
var val=this.getDataValue();
if(val!=this.cancelValue){
this.setDataValue(this.cancelValue);
this.changed();
}
this.colorPickerDialog.dismiss();
});
},onfocus:function(){
if(!this.colorPickerDialog||!this.colorPickerDialog.showing){
var v=this.getDataValue();
if(v==="inherit"||!v){
v=this.defaultColor;
}
this.cancelValue=this.getDataValue();
if(!this.colorPickerDialog){
this.createColorPicker();
}
this.colorPickerDialog.setValue(v);
this.colorPickerDialog.setShowing(true);
}
},setEditorValue:function(_2e8){
this.inherited(arguments);
this._empty=!Boolean(_2e8);
this.setNodeColors(_2e8);
},setNodeColors:function(_2e9){
if(_2e9){
this.editorNode.style.backgroundColor=_2e9;
this.editorNode.style.color=(parseInt(_2e9.substr(1,2),16)+parseInt(_2e9.substr(3,2),16)+parseInt(_2e9.substr(5,2),16)<200)?"white":"black";
}else{
this.editorNode.style.backgroundColor="transparent";
this.editorNode.style.color="black";
}
},getDataValue:function(){
if(this.getInvalid()){
return this.defaultColor;
}
return this.inherited(arguments)||this.defaultColor;
},onblur:function(){
if(this.colorPickerDialog&&this.getDataValue()&&(this._empty||this.colorPickerDialog.getValue().toLowerCase()!=this.getDataValue().toLowerCase()&&this.colorPickerDialog._changed)){
this._empty=false;
this.changed();
}
},changed:function(){
if(this.colorPickerDialog){
this.setNodeColors(this.getDataValue());
return this.inherited(arguments);
}
}});
}
if(!dojo._hasResource["wm.base.widget.Editors.DataSetEditor"]){
dojo._hasResource["wm.base.widget.Editors.DataSetEditor"]=true;
dojo.provide("wm.base.widget.Editors.DataSetEditor");
dojo.declare("wm.DataSetEditor",wm.AbstractEditor,{_multiSelect:false,dataSet:null,options:"",dataField:"",displayField:"",displayExpression:"",startUpdate:false,_allFields:"All Fields",selectedItem:null,init:function(){
this.inherited(arguments);
this.selectedItem=new wm.Variable({name:"selectedItem",owner:this});
if(this._multiSelect){
this.selectedItem.setIsList(true);
}
},postInit:function(){
if(this.options){
this.setOptionsVariable();
}
if(!this.displayField){
this._setDisplayField();
if(!this.dataField&&this.dataSet&&this.dataSet.type&&wm.defaultTypes[this.dataSet.type]){
this.dataField="dataValue";
}
}
this.inherited(arguments);
if(this.startUpdate){
this.update();
}
},_setDisplayField:function(){
var _2ea=this.dataSet;
if(_2ea&&_2ea.type){
var type=_2ea.type;
var _2eb=wm.typeManager.getDisplayField(type);
if(_2eb){
return this.setDisplayField(_2eb);
}
}
},update:function(){
if(this.dataSet instanceof wm.ServiceVariable){
if(djConfig.isDebug){
var _2ec=app.debugDialog.newLogEvent({eventType:"startUpdate",eventName:"startUpdate",method:"update",affectedId:this.dataSet.getRuntimeId(),firingId:this.getRuntimeId(),method:"update"});
}
var d=this.dataSet.updateInternal();
if(_2ec){
app.debugDialog.endLogEvent(_2ec);
}
return d;
}
},hasValues:function(){
return (this.options||this.dataSet&&!this.dataSet.isEmpty());
},isAllDataFields:function(){
return (this.dataField==this._allFields||this.dataField=="");
},setDefaultOnInsert:function(){
if(this.editor&&this.defaultInsert){
if(this.$.binding&&this.$.binding.wires.defaultInsert){
this.$.binding.wires.defaultInsert.refreshValue();
}
this.setEditorValue(this.defaultInsert);
this.changed();
}
},setInitialValue:function(){
this.beginEditUpdate();
this.selectedItem.setType(this.dataSet instanceof wm.Variable?this.dataSet.type:"AnyData");
var _2ed=this.dataValue;
var _2ee=this.displayValue;
if(this.dataValue!==null&&wm.propertyIsChanged(_2ed,"dataValue",wm._BaseEditor)){
this.setEditorValue(_2ed);
}else{
this.setDisplayValue(_2ee);
}
this.endEditUpdate();
if(!this._cupdating){
var _2ee=this.getDisplayValue();
if(_2ee!=this.displayValue){
this.changed();
}
}
},isReady:function(){
return this.inherited(arguments)&&this.hasValues();
},editorChanged:function(){
if(this.dataSet&&this.dataSet.getCount()){
return this.inherited(arguments);
}
},isAllDataFields:function(){
return (this.dataField==this._allFields||this.dataField=="");
},setDataSet:function(_2ef){
this.dataSet=_2ef;
var _2f0=this.dataValue;
this.updateIsDirty();
},setDisplayField:function(_2f1){
this.displayField=_2f1;
if(!this._cupdating){
this.createEditor();
}
},setDataField:function(_2f2){
if(_2f2=="All Fields"){
this.dataField="";
}else{
this.dataField=_2f2;
}
},_getOptionsData:function(){
var data=[];
if(!this.options){
return data;
}
var opts=dojo.isArray(this.options)?this.options:this.options.split(",");
for(var i=0,l=opts.length,d;i<l;i++){
d=dojo.string.trim(opts[i]);
data[i]={name:d,dataValue:d};
}
return data;
},setOptionsVariable:function(){
var opts=this._getOptionsData();
var ds=this.dataSet=new wm.Variable({name:"optionsVar",owner:this,type:"StringData"});
ds.setData(opts);
if(this._isDesignLoaded){
this.displayField="dataValue";
this.dataField="dataValue";
}
},setOptions:function(_2f3){
if(!this.displayField){
this.displayField="dataValue";
if(!this.dataField){
this.dataField="dataValue";
}
}
this.options=_2f3;
this.setOptionsVariable();
var _2f4=this._cupdating;
this._cupdating=true;
this.setDataSet(this.dataSet);
if(!_2f4){
this._cupdating=false;
if(!this.invalidCss){
this.sizeEditor();
}else{
this.render();
}
}
},_getDisplayData:function(_2f5){
var _2f6;
if(wm.isInstanceType(_2f5,wm.Variable)){
_2f6=_2f5;
}else{
_2f6=new wm.Variable({_temporaryComponent:true});
if(this.dataSet){
_2f6.setType(this.dataSet.type);
}
_2f6.setData(dojo.clone(_2f5));
}
var de=this.displayExpression,v=_2f6;
var _2f7=de?wm.expression.getValue(de,v,this.owner):_2f6.getValue(this.displayField);
if(this.displayType&&this.displayType!="Text"){
_2f7=this.formatData(_2f7);
}
return _2f7==null?"":String(_2f7);
},calcIsDirty:function(val1,val2){
var _2f8="";
var _2f9="";
if(val1 instanceof wm.Variable&&val1.isList||dojo.isArray(val1)){
var _2fa=val1 instanceof wm.Variable?val1.getCount():val1.length;
for(var i=0;i<_2fa;i++){
if(i){
_2f8+=",";
}
_2f8+=this._getDisplayData(val1 instanceof wm.Variable?val1.getItem(i):val1[i]);
}
}else{
if(val1!==null&&typeof val1=="object"){
_2f8=this._getDisplayData(val1);
}else{
if(val1==null){
_2f8="";
}else{
_2f8=val1;
}
}
}
if(val2 instanceof wm.Variable&&val2.isList||dojo.isArray(val2)){
var _2fa=val2 instanceof wm.Variable?val2.getCount():val2.length;
for(var i=0;i<_2fa;i++){
if(i){
_2f9+=",";
}
_2f9+=this._getDisplayData(val2 instanceof wm.Variable?val2.getItem(i):val2[i]);
}
}else{
if(val2!==null&&typeof val2=="object"){
_2f9=this._getDisplayData(val2);
}else{
if(val2==null){
_2f9="";
}else{
_2f9=val2;
}
}
}
return _2f8!=_2f9;
},setEditorValue:function(_2fb){
this._setEditorValue(_2fb,false);
this.updateReadonlyValue();
},setDisplayValue:function(_2fc){
this._setEditorValue(_2fc,true);
this.updateReadonlyValue();
},_setEditorValue:function(_2fd,_2fe){
var self=this;
if(!this.selectedItem||!this.dataSet){
this.dataValue=_2fd;
return;
}
this.beginEditUpdate();
try{
var _2ff=this._lastValue;
this.deselectAll();
this._lastValue=_2ff;
if(_2fd instanceof wm.Variable){
_2fd=_2fd.getData();
}
var _300;
if(!_2fe&&this.dataField){
_300=this.dataField;
}else{
if(!this.displayExpression){
_300=this.displayField;
}
}
if(_300||this.displayExpression){
if(!dojo.isArray(_2fd)){
_2fd=_2fd===undefined||_2fd===null?[]:[_2fd];
}
var _301;
_301=_2fd.length;
var _302=this.dataSet.getCount();
if(_302==0){
this.dataValue=this._multiSelect?_2fd:_2fd[0];
}else{
for(var i=0;i<_301;i++){
var _303=dojo.isArray(_2fd)?_2fd[i]:_2fd;
var _304;
if(_300&&_303!==null&&typeof _303=="object"){
_304=_303 instanceof wm.Variable?_303.getValue(_300):_303[_300];
}else{
if(!_300&&_303!==null&&typeof _303=="object"){
_304=this._getDisplayData(_303);
}else{
_304=_303;
}
}
var _305=false;
for(var j=0;j<_302;j++){
var item=this.dataSet.isList?this.dataSet.getItem(j):this.dataSet;
var _306=_300?item.getValue(_300):this._getDisplayData(item);
if(_306==_304){
_305=true;
this.selectItem(j);
break;
}
}
if(!_305){
this._onSetEditorValueFailed(_2fd);
}
}
}
}
}
catch(e){
console.error(e);
}
this.endEditUpdate();
this.changed();
if(this.isDataSetValueValid(this.dataValue)){
this._lastValue=dojo.clone(this.dataValue);
}else{
this.dataValue="";
}
},isDataSetValueValid:function(_307){
if(dojo.isArray(_307)){
for(var i=0;i<_307.length;i++){
if(_307[i] instanceof wm.Component){
return false;
}
}
return true;
}else{
return !(_307 instanceof wm.Component);
}
},_onSetEditorValueFailed:function(_308){
},getEditorValue:function(){
if(!this.selectedItem){
return null;
}
if(this.dataValueValid){
return this.dataValue;
}
if(this.dataSet.getCount()==0){
return this.dataValue;
}
var _309=[];
if(this.dataField){
var _30a=this.selectedItem.getCount();
for(var i=0;i<_30a;i++){
_309.push(this.selectedItem.isList?this.selectedItem.getItem(i).getValue(this.dataField):this.selectedItem.getValue(this.dataField));
}
}else{
_309=this.selectedItem.getData();
if(!dojo.isArray(_309)){
_309=[_309];
}
}
if(!this._multiSelect&&_309){
var _309=_309[0];
return (_309||_309===0)?_309:this.makeEmptyValue();
}else{
return _309;
}
},validationEnabled:function(){
return false;
},getDisplayValue:function(){
var _30b="";
var _30c=this.selectedItem.getCount();
for(var i=0;i<_30c;i++){
if(i){
_30b+=", ";
}
_30b+=this._getDisplayData(this.selectedItem.isList?this.selectedItem.getItem(i):this.selectedItem);
}
return _30b;
},deselectAll:function(){
this.clear();
}});
dojo.declare("wm.CheckboxSet",wm.DataSetEditor,{singleLine:false,_multiSelect:true,_focused:false,height:"100px",editors:null,_dijitClass:"dijit.form.CheckBox",setDataSet:function(_30d){
this.inherited(arguments);
this.createEditor();
},connectEditor:function(){
},destroyEditor:function(){
var _30e=this.editor;
if(this.dijits){
dojo.forEach(this.dijits,function(d){
d.destroy();
});
}
this.inherited(arguments);
dojo.destroy(_30e);
},_createEditor:function(_30f){
this.editor=_30f;
this.editor.className="wmCheckboxSet";
var html="";
if(this.dataSet){
var _310=this.dataSet.getCount();
for(var i=0;i<_310;i++){
var item=this.dataSet.getItem(i);
var id=this.getRuntimeId().replace(/\./g,"__")+"__"+i;
html+="<div class='wmCheckboxSetItem'><input id='"+id+"' name='"+this.getRuntimeId().replace(".","_")+"' dojoType='"+this._dijitClass+"' value='"+i+"'><label for='"+id+"'>"+this._getDisplayData(item)+"</label></div>";
}
this.editor.innerHTML=html;
this.dijits=dojo.parser.parse(this.editor);
var self=this;
dojo.forEach(this.dijits,function(_311){
self.connect(_311,"onChange",self,"changed");
self.connect(_311,"onFocus",self,"_onEditorFocused");
self.connect(_311,"onBlur",self,"_onEditorBlurred");
_311.domNode.style.lineHeight="normal";
});
}
return this.editor;
},_onEditorFocused:function(){
if(!this._focused){
this._focused=true;
this.focused();
}
},_onEditorBlurred:function(){
wm.job(this.getRuntimeId()+".Blurred",100,dojo.hitch(this,function(){
if(this._focused&&!dojo.isDescendant(document.activeElement,this.domNode)){
this._focused=false;
this.blurred();
}
}));
},changed:function(){
if(!this.dijits){
return;
}
var data=[];
for(var i=0;i<this.dijits.length;i++){
if(this.dijits[i].checked){
data.push(this.dataSet.getItem(i));
}
}
this.dataValueValid=false;
this.selectedItem.setData(data);
this.inherited(arguments);
this.dataValueValid=true;
},destroy:function(){
dojo.forEach(this.dijits,function(d){
d.destroy();
});
this.inherited(arguments);
},setReadonly:function(_312){
this.readonly=Boolean(_312);
if(!this.dijits){
return;
}
for(var i=0;i<this.dijits.length;i++){
var e=this.dijits[i];
var _313=e.get("checked");
e.set("disabled",this.readonly||this._disabled);
if(!_313){
e.domNode.parentNode.style.display=this.readonly?"none":"";
}
}
},setDisabled:function(_314){
this.inherited(arguments);
var d=this._disabled;
if(!this.dijits){
return;
}
for(var i=0;i<this.dijits.length;i++){
var e=this.dijits[i];
e.set("disabled",this._disabled||this.readonly);
}
},deselectAll:function(){
if(!this.dijits){
return;
}
for(var i=0;i<this.dijits.length;i++){
this.dijits[i].set("checked",false,false);
this.dijits[i]._lastValueReported=false;
}
},selectItem:function(_315){
if(!this.dijits){
return;
}
this.dijits[_315].set("checked",true,false);
this.dijits[_315]._lastValueReported=true;
}});
dojo.declare("wm.RadioSet",wm.CheckboxSet,{singleLine:false,_multiSelect:false,_dijitClass:"dijit.form.RadioButton",setDataSet:function(_316){
this.inherited(arguments);
this.createEditor();
},changed:function(){
if(!this.dijits){
return;
}
var data=[];
for(var i=0;i<this.dijits.length;i++){
if(this.dijits[i].checked){
this.selectedItem.setData(this.dataSet.getItem(i));
this.dataValueValid=false;
wm.AbstractEditor.prototype.changed.call(this);
this.dataValueValid=true;
return;
}
}
}});
dojo.declare("wm.ListSet",wm.DataSetEditor,{singleLine:false,searchBar:true,_multiSelect:true,height:"100px",editors:null,setDataSet:function(_317){
this.inherited(arguments);
if(this.grid){
this.grid.setDataSet(_317);
}
},_onShowParent:function(){
if(this.grid){
this.grid.renderDojoObj();
}
},flow:function(){
if(this.editor){
this.editor.flow();
}
},setSearchBar:function(_318){
this.searchBar=Boolean(_318);
if(this.searchBar){
if(!this._searchBar){
this.createSearchBar();
this.editor.moveControl(this._searchBar,0);
}else{
this._searchBar.show();
}
}else{
if(this._searchBar){
this._searchBar.hide();
}
}
},createSearchBar:function(){
this._searchBar=new wm.Text({owner:this,parent:this.editor,width:"100%",caption:"",changeOnKey:true,emptyValue:"emptyString",name:"searchBar"});
this.connect(this._searchBar,"onchange",this,"filterList");
},filterList:function(_319,_31a){
var _31b=this.grid.getRowCount();
var rows=dojo.query(".dojoxGridRow",this.grid.domNode);
var _31c={};
if(_319){
_31c[this.grid.columns[0].field]="*"+_319+"*";
}
this.grid.setQuery(_31c);
},_createEditor:function(_31d){
this.editor=new wm.Container({owner:this,parent:this,name:"ListSetContainer",width:"100%",height:"100%",layoutKind:"top-to-bottom",verticalAlign:"top",horizontalAlign:"left"});
if(this.searchBar){
this.createSearchBar();
}
this.grid=new wm.DojoGrid({owner:this,parent:this.editor,name:"editor",width:"100%",height:"100%",noHeader:true,margin:"0",padding:"0",border:"0",selectionMode:"multiple"});
this.grid._isDesignLoaded=false;
this.grid.columns=[{show:true,width:"100%",field:this.displayExpression?"_name":this.displayField,expression:this.displayExpression}];
if(this.dataSet){
this.grid.setDataSet(this.dataSet);
}
return this.editor;
},connectEditor:function(){
if(!this.$.binding){
new wm.Binding({name:"binding",owner:this});
}
this.selectedItem.$.binding.addWire("","dataSet",this.name+".editor.selectedItem");
this.connect(this.grid,"onSelectionChange",this,"changed");
},deselectAll:function(){
this.grid.deselectAll();
},selectItem:function(_31e){
this.grid.setSelectedRow(_31e);
},setDisabled:function(_31f){
this.disabled=Boolean(_31f);
var _320=this.disabled||this._parentDisabled;
if(this.grid){
dojo.toggleClass(this.domNode,"Disabled",_320);
this.grid.setSelectionMode(_320?"none":"multiple");
}
}});
}
if(!dojo._hasResource["wm.base.widget.Buttons.ToggleButton"]){
dojo._hasResource["wm.base.widget.Buttons.ToggleButton"]=true;
dojo.provide("wm.base.widget.Buttons.ToggleButton");
dojo.declare("wm.ToggleButton",wm.ToolButton,{height:"32px",border:1,borderColor:"#ABB8CF",margin:4,captionUp:"Btn Up",captionDown:"Btn Down",classNames:"wmbutton wmtogglebutton",init:function(){
this.caption=this.captionUp;
this.inherited(arguments);
if(this.clicked){
this.setClicked(true);
}
},click:function(_321){
this.setProp("clicked",!this.clicked);
wm.onidle(this,function(){
this.onclick(_321,this);
});
},setClicked:function(_322){
if(_322!=this.clicked||this._cupdating){
this.clicked=_322;
this.valueChanged("clicked",_322);
this.setCaption(this.clicked?this.captionDown:this.captionUp);
dojo[this.clicked?"addClass":"removeClass"](this.domNode,"toggleButtonDown");
}
},setCaptionUp:function(_323){
this.captionUp=_323;
if(!this.clicked){
this.setCaption(_323);
}
},setCaptionDown:function(_324){
this.captionDown=_324;
if(this.clicked){
this.setCaption(_324);
}
}});
}
if(!dojo._hasResource["wm.base.widget.JsonStatus"]){
dojo._hasResource["wm.base.widget.JsonStatus"]=true;
dojo.provide("wm.base.widget.JsonStatus");
dojo.declare("wm.JsonStatus",wm.Control,{scrim:true,classNames:"wmjsonstatus",width:"24px",height:"28px",border:"2",iconWidth:20,iconHeight:20,statusBar:false,argsList:null,minimize:false,build:function(){
this.inherited(arguments);
this.buttonNode=document.createElement("div");
dojo.addClass(this.buttonNode,"wmjsonstatusicon");
this.domNode.appendChild(this.buttonNode);
this.messageNode=document.createElement("div");
dojo.addClass(this.messageNode,"wmjsonstatuslabel");
this.domNode.appendChild(this.messageNode);
},init:function(){
this.inherited(arguments);
this.connect(wm.inflight,"add",this,"add");
this.connect(wm.inflight,"remove",this,"remove");
this.connect(this.domNode,"onclick",this,function(evt){
window.setTimeout(dojo.hitch(this,"onclick",evt),5);
});
this.argsList=[];
},add:function(_325,_326,_327,_328,_329,_32a){
this.updateSpinner();
if(this.bounds.w>40){
this.updateMessage();
}
},remove:function(_32b,_32c){
this.updateSpinner();
if(this.bounds.w>40){
this.updateMessage();
}
},updateSpinner:function(){
if(wm.inflight._inflight.length){
dojo.addClass(this.domNode,"wmStatusWaiting");
}else{
dojo.removeClass(this.domNode,"wmStatusWaiting");
}
},updateMessage:function(){
this.messageNode.innerHTML=wm.Array.last(wm.inflight._inflightNames)||"";
},setMinimize:function(_32d){
if(_32d){
this.setWidth((parseInt(this.iconWidth)+this.padBorderMargin.l+this.padBorderMargin.r)+"px");
this.setHeight((parseInt(this.iconHeight)+this.padBorderMargin.t+this.padBorderMargin.b)+"px");
this.messageNode.innerHTML="";
}else{
this.setWidth("80px");
}
},onclick:function(){
if(djConfig.isDebug||window["studio"]){
app.debugDialog.show();
}
}});
wm.Object.extendSchema(wm.JsonStatus,{iconWidth:{group:"display"},iconHeight:{group:"display"},minimize:{group:"display"},statusBar:{group:"display"},disabled:{ignore:1}});
}
dojo.i18n._preloadLocalizations("dojo.nls.wm_editors",["ROOT","ar","ca","cs","da","de","de-de","el","en","en-au","en-gb","en-us","es","es-es","fi","fi-fi","fr","fr-fr","he","he-il","hu","it","it-it","ja","ja-jp","ko","ko-kr","nb","nl","nl-nl","pl","pt","pt-br","pt-pt","ru","sk","sl","sv","th","tr","xx","zh","zh-cn","zh-tw"]);
