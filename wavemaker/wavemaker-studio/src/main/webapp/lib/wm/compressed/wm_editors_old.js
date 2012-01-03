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

dojo.provide("wm.compressed.wm_editors_old");
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
if(!dojo._hasResource["wm.base.widget.Editors.Base"]){
dojo._hasResource["wm.base.widget.Editors.Base"]=true;
dojo.provide("wm.base.widget.Editors.Base");
wm.propertyIsChanged=function(_5,_6,_7){
var p=(_7||0).prototype;
return p&&p[_6]!==_5;
};
wm.defaultEmptyValue=function(_8){
switch(_8){
case "Text":
return "";
case "Number":
return 0;
}
};
wm.createFieldEditor=function(_9,_a,_b,_c,_d){
var _e=dojo.mixin({},wm.getFieldEditorProps(_a),_b);
var _f=wm.getValidJsName(_e.name||"editor1");
return _9.owner.loadComponent(_f,_9,_d||"wm._TextEditor1",_e,_c);
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
},createEditor:function(_10){
this.destroyEditor();
var n=document.createElement("div");
this.domNode.appendChild(n);
this.startTimerWithName("CreateDijit",this.declaredClass);
this.editor=this._createEditor(n,_10);
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
this.editor.displayMessage=function(_11){
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
},_createEditor:function(_12,_13){
return new dijit.form.TextBox(this.getEditorProps(_12,_13));
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
var _14=this.getContentBounds(),_15=_14.h?_14.h-2+"px":"",_16=_14.w?_14.w-4:"",d=e&&e.domNode,s=d.style,fc=d&&d.firstChild;
if(this._editorPaddingLeft){
_16-=this._editorPaddingLeft;
}
if(this._editorPaddingRight){
_16-=this._editorPaddingRight;
}
if(_16){
_16+="px";
}
if(!this.editorBorder){
s.border=0;
}
s.backgroundColor=this.editorBorder?"":"transparent";
s.backgroundImage=this.editorBorder?"":"none";
s.width=_16;
if(_15){
if(fc){
dojo.forEach(fc.childNodes,function(c){
if(c.style){
c.style.height=_15;
}
});
}
if(e.focusNode&&e.focusNode.style){
e.focusNode.style.height=_15;
}
}
}
},renderBounds:function(){
this.inherited(arguments);
this.sizeEditor();
},setEditorBorder:function(_17){
this.editorBorder=_17;
this.render();
},addEditorConnect:function(_18){
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
for(var i=0,c,_19=n.childNodes;c=_19[i];i++){
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
},getEditorProps:function(_1a,_1b){
return dojo.mixin({srcNodeRef:_1a,owner:this,disabled:this.owner.disabled},_1b||{});
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
},setReadonly:function(_1c){
this.readonly=_1c;
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
},setEditorValue:function(_1d){
if(this.editor&&this.editor.set){
_1d=_1d===undefined?null:_1d;
var _1e=this.editor.get("value");
this.editor.set("value",_1d,false);
if(_1e!=_1d){
this.changed();
}
this.updateReadonlyValue();
}
},setDisplayValue:function(_1f){
this.setEditorValue(_1f);
},setRequired:function(_20){
var _21=this.required;
this.required=_20;
if(this.editor){
this.editor.required=_20;
if(this.required||_21){
this.validate();
wm.fire(this.owner,"requireChanged");
}
}
},setInitialValue:function(){
var o=this.owner;
o.beginEditUpdate();
this.setEditorValue(wm.propertyIsChanged(o.dataValue,"dataValue",wm.Editor)?o.dataValue:o.displayValue);
o.endEditUpdate();
},setDisabled:function(_22){
this.disabled=_22;
if(this.editor&&this.editor.set){
this.editor.set("disabled",_22);
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
},valueChanged:function(_23,_24){
if(this._updating){
return;
}
this.inherited(arguments);
},setValueAsEmpty:function(){
this.makeEmptyValue();
},isLoading:function(){
return this.owner._loading;
},dokeypress:function(_25){
if(this.changeOnKey||(this.changeOnEnter&&_25.keyCode==dojo.keys.ENTER)){
wm.onidle(this,"doChangeOnKey",arguments);
}
if(_25.keyCode==dojo.keys.ENTER){
wm.onidle(this,"onEnterKeyPress",[this]);
}
},doChangeOnKey:function(_26){
var e=this.editor;
this.changed();
},onEnterKeyPress:function(){
}});
wm.Object.extendSchema(wm._BaseEditor,{onEnterKeyPress:{ignore:1},name:{ignore:1},showing:{ignore:1},disabled:{ignore:1},singleLine:{ignore:1},readonly:{ignore:1},border:{ignore:1},borderColor:{ignore:1},margin:{ignore:1},padding:{ignore:1},scrollX:{ignore:1},scrollY:{ignore:1}});
}
if(!dojo._hasResource["wm.base.widget.Editor"]){
dojo._hasResource["wm.base.widget.Editor"]=true;
dojo.provide("wm.base.widget.Editor");
wm.editors=["Text","Date","Time","DateTime","Number","Currency","SelectMenu","Checkbox","TextArea","RadioButton","Lookup","Slider"];
wm.getEditor=function(_27){
var c=_27||"Text";
if(c.slice(0,5)!="wm"){
c="wm._"+c+"Editor";
}
return dojo.getObject(c)||wm._BaseEditor;
};
wm.getDataSet=function(_28){
var w=_28;
while(w&&!w.dataSet){
w=w.parent;
}
if(w&&w.dataSet){
return w.dataSet;
}
};
wm.getEditorType=function(_29){
var t=wm.typeManager.getPrimitiveType(_29)||_29;
var map={Boolean:"CheckBox"};
if(t in map){
t=map[t];
}
return dojo.indexOf(wm.editors,t)!=-1?t:"Text";
};
wm.getFieldEditorProps=function(_2a){
var f=_2a,_2b={caption:f.caption||wm.capitalize(f.name),display:wm.getEditorType(f.displayType||f.type),readonly:f.readonly,editorInitProps:{required:f.required},required:f.required,subType:f.subType};
if(_2b.display=="CheckBox"){
_2b.editorInitProps.dataType="boolean";
_2b.displayValue=true;
_2b.emptyValue="false";
}else{
if(_2b.display=="Date"){
_2b.dateMode="Date";
}
}
return _2b;
};
wm.createFieldEditor=function(_2c,_2d,_2e,_2f,_30){
var _31=dojo.mixin({},wm.getFieldEditorProps(_2d),_2e);
var _32=wm.getValidJsName(_31.name||"editor1");
return _2c.owner.loadComponent(_32,_2c,_30||"wm.Editor",_31,_2f);
};
wm.updateFieldEditorProps=function(_33,_34){
var e=_33,_35=wm.getFieldEditorProps(_34),_36=_35.editorInitProps;
delete _35.formField;
delete _35.editorInitProps;
for(var i in _35){
e.setProp(i,_35[i]);
}
for(var i in _36){
e.editor.setProp(i,_36[i]);
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
},setDomNode:function(_37){
this.inherited(arguments);
dojo.addClass(this.domNode,"wmeditor");
},createCaption:function(){
var cs=String(this.captionSize);
var _38={domNode:["wmeditor-caption"].concat(this._classes.captionNode)};
this.captionLabel=new wm.Label({parent:this,width:cs,height:cs,_classes:_38,singleLine:this.singleLine,caption:this.caption,showing:Boolean(this.caption),margin:"0,4,0,0",border:0,owner:this});
this.setCaptionAlign(this.captionAlign);
},getRequiredHtml:function(){
var e=this.editor;
if(!e){
e=this.$.editor;
}
return !this.readonly&&e&&e.required?"&nbsp;<span class=\"wmeditor-required\">*</span>":"";
},setDisplay:function(_39){
this.display=_39;
var e=this.editor||this.$.editor;
if(e){
e.destroy();
this.editor=null;
}
this.createEditor();
this.reflow();
},createEditor:function(){
var _3a=wm.getEditor(this.display);
var _3b=dojo.mixin({name:"editor",owner:this,parent:this,border:0,readonly:this.readonly},this.editorInitProps||{});
this.editor=new _3a(_3b);
this._editor=this.editor.editor;
},setDisplayValue:function(_3c){
this.displayValue=_3c;
wm.fire(this.editor,"setDisplayValue",[_3c]);
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
},setDataValue:function(_3d){
if(_3d===undefined){
_3d=null;
}
this.dataValue=_3d instanceof wm.Variable?_3d.getData():_3d;
wm.fire(this.editor,"setEditorValue",[_3d]);
},setCaption:function(_3e){
var c=this.caption;
this.caption=_3e;
this.captionLabel.setCaption(this.caption+this.getRequiredHtml());
this.captionLabel.setShowing(Boolean(this.caption));
if(Boolean(c)!=Boolean(this.caption)){
this.renderControls();
}
},setCaptionSize:function(_3f){
this.captionLabel[this.layoutKind=="top-to-bottom"?"setHeight":"setWidth"](this.captionSize=_3f);
this.reflow();
},setCaptionAlign:function(_40){
this.captionAlign=_40;
this.captionLabel.setAlign(this.captionAlign);
},setCaptionPosition:function(_41){
var cp=this.captionPosition=_41;
this.removeControl(this.captionLabel);
this.insertControl(this.captionLabel,(cp=="top"||cp=="left")?0:1);
this.setLayoutKind((cp=="top"||cp=="bottom")?"top-to-bottom":"left-to-right");
this.setCaptionSize(this.captionSize);
},setSingleLine:function(_42){
this.singleLine=_42;
this.captionLabel.setSingleLine(_42);
},setDisabled:function(_43){
var d=this.disabled;
this.inherited(arguments);
if(d!=this.disabled){
this.updateDisabled();
}
},updateDisabled:function(){
dojo[this.disabled?"addClass":"removeClass"](this.captionLabel.domNode,"wmeditor-caption-disabled");
wm.fire(this.editor,"setDisabled",[this.disabled]);
},setReadonly:function(_44){
var r=this.readonly;
this.readonly=_44;
if(r!=this.readonly){
this.setCaption(this.caption);
}
wm.fire(this.editor,"setReadonly",[_44]);
},setRequired:function(_45){
wm.fire(this.editor,"setRequired",[_45]);
},requireChanged:function(){
this.setCaption(this.caption);
},getInvalid:function(){
return wm.fire(this.editor,"getInvalid");
},isValid:function(){
return !this.getInvalid();
},validate:function(_46){
wm.fire(this.parent,"validate");
this.valueChanged("invalid",this.getInvalid());
},getGroupValue:function(){
var e=this.editor;
return wm.fire(e,"getGroupValue");
},setGroupValue:function(_47){
this.groupValue=_47;
var e=this.editor;
wm.fire(e,"setGroupValue",[_47]);
},getCheckedValue:function(){
return this.getDisplayValue();
},setCheckedValue:function(_48){
this.setDisplayValue(_48);
},editorChanged:function(){
this.valueChanged("displayValue",this.displayValue=this.getDisplayValue());
this.valueChanged("dataValue",this.dataValue=this.getDataValue());
wm.fire(this.editor,"ownerEditorChanged");
},isUpdating:function(){
return this._updating>0;
},beginEditUpdate:function(_49){
this._updating++;
},endEditUpdate:function(_4a){
this._updating--;
},valueChanged:function(_4b,_4c){
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
},onchange:function(_4d,_4e){
},onfocus:function(){
},onblur:function(){
}});
wm.Editor.description="A general purpose editor.";
wm.Editor.extend({themeable:false,scrim:true,listProperties:function(){
var e=this.editor,_4f=dojo.mixin({},this.inherited(arguments),e?e.listOwnerProperties():{}),f=wm.getParentForm(this);
_4f.formField.ignoretmp=!Boolean(f);
_4f.displayValue.readonly=this.formField&&!this.saveDisplayValue;
_4f.saveDisplayValue.ignoretmp=!this.formField;
return _4f;
},afterPaletteDrop:function(){
this.setCaption(this.name);
},set_formField:function(_50){
if(!_50){
delete this.formField;
}else{
this.formField=_50;
}
var f=wm.getParentForm(this);
if(f){
var _51=f.addEditorToForm(this);
}
},resizeLabel:function(){
var _52=dojo.doc.createElement("span");
_52.style.padding="5px";
_52.innerHTML=this.captionLabel.caption;
document.body.appendChild(_52);
var _53=dojo.coords(_52);
var _54=_53.w;
_52.parentNode.removeChild(_52);
this.setCaptionSize("50%");
var _55=_54*4;
this.setWidth(_55+"px");
if(this.isDesignLoaded()&&studio.designer.selected==this){
setTimeout(dojo.hitch(studio.inspector,"reinspect"),100);
}
},makePropEdit:function(_56,_57,_58){
switch(_56){
case "formField":
return new wm.prop.FormFieldSelect(_58);
case "display":
return new wm.SelectMenu(dojo.mixin(_58,{options:wm.editors}));
}
return this.inherited(arguments);
},resizeToFit:function(){
this.resizeLabel();
},writeChildren:function(_59,_5a,_5b){
var s=this.inherited(arguments);
s.push(this.editor.write(_5a,_5b));
return s;
},addUserClass:function(_5c,_5d){
this.inherited(arguments);
if(_5d=="captionNode"){
this.captionLabel.addUserClass(_5c,"domNode");
}
},removeUserClass:function(_5e,_5f){
this.inherited(arguments);
if(_5f=="captionNode"){
this.captionLabel.removeUserClass(_5e,"domNode");
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
},setChecked:function(_60){
this.editor.setChecked(_60);
}});
dojo.declare("wm.TextAreaEditor",wm.Editor,{display:"TextArea"});
wm.TextAreaEditor.extend({});
dojo.declare("wm.RadioButtonEditor",wm.Editor,{displayValue:1,display:"RadioButton"});
dojo.declare("wm.LookupEditor",wm.Editor,{display:"Lookup"});
dojo.declare("wm.SliderEditor",wm.Editor,{display:"Slider"});
wm.Object.extendSchema(wm.Editor,{disabled:{bindTarget:true,type:"Boolean",group:"common",order:40},formField:{group:"common",order:500},singleLine:{group:"display",order:200},box:{ignore:1},horizontalAlign:{ignore:1},verticalAlign:{ignore:1},layoutKind:{ignore:1},fitToContent:{ignore:1},scrollX:{ignore:1},scrollY:{ignore:1},lock:{ignore:1},imageList:{ignore:1},caption:{bindable:1,group:"display",type:"String",order:0,focus:1},readonly:{bindable:1,type:"Boolean",group:"display",order:5},captionSize:{group:"display",order:200,editor:"wm.prop.SizeEditor"},captionUnits:{ignore:1},captionAlign:{group:"display",order:210,options:["left","center","right"]},captionPosition:{group:"display",order:220,options:["top","left","bottom","right"]},display:{group:"editor",subgroup:"value",order:20},editor:{readonly:1,group:"editor",subgroup:"Sub Editor",editor:"wm.prop.SubComponentEditor"},displayValue:{bindable:1,group:"editor",subgroup:"value",order:40,type:"any"},dataValue:{ignore:1,bindable:1,group:"editor",order:45,simpleBindProp:true},emptyValue:{group:"editor",subgroup:"value",order:50,options:["unset","null","emptyString","false","zero"]},invalid:{ignore:1,bindSource:1,type:"boolean"},groupValue:{ignore:1},selectedItem:{ignore:1},resizeToFit:{group:"layout",order:200,operation:1},captionStyles:{ignore:1,categoryParent:"Styles",categoryProps:{content:"caption",nodeName:"captionNode",nodeClass:"wmeditor-caption"}}});
}
if(!dojo._hasResource["wm.base.widget.Editors._TextEditor"]){
dojo._hasResource["wm.base.widget.Editors._TextEditor"]=true;
dojo.provide("wm.base.widget.Editors._TextEditor");
dojo.declare("wm._TextEditor",wm._BaseEditor,{promptMessage:"",invalidMessage:"",password:false,maxChars:"",regExp:".*",_passwordChar:"&#8226;",tooltipDisplayTime:2000,getEditorProps:function(_61,_62){
var p=dojo.mixin(this.inherited(arguments),{promptMessage:this.promptMessage,invalidMessage:this.invalidMessage||"$_unset_$",regExp:this.regExp,value:this.owner.displayValue,required:this.required,tooltipDisplayTime:this.tooltipDisplayTime});
if(this.password){
p.type="password";
}
if(this.maxChars){
p.maxLength=this.maxChars;
}
return dojo.mixin(p,_62||{});
},validationEnabled:function(){
return (this.regExp&&this.regExp!=".*")||this.required;
},setPassword:function(_63){
this.password=_63;
this.createEditor();
},_createEditor:function(_64,_65){
if(this.singleLine){
if(this.validationEnabled()||this.promptMessage){
return new dijit.form.ValidationTextBox(this.getEditorProps(_64,_65));
}else{
return new dijit.form.TextBox(this.getEditorProps(_64,_65));
}
}else{
return new dijit.form.SimpleTextarea(this.getEditorProps(_64,_65));
}
},validator:function(_66,_67){
var l=Number(this.maxChars);
return this.maxChars!==""&&!isNaN(l)?_66.length<=l:true;
},_getReadonlyValue:function(){
var v=this.inherited(arguments);
if(this.password){
for(var i=0,a=[],l=v.length;i<l;i++){
a.push(this._passwordChar);
}
v=a.join("");
}
return v;
}});
dojo.declare("wm._TextAreaEditor",wm._TextEditor,{_editorPaddingLeft:3,_editorPaddingRight:3,_createEditor:function(_68,_69){
return new dijit.form.SimpleTextarea(this.getEditorProps(_68,_69));
},sizeEditor:function(){
this.inherited(arguments);
this.domNode.style.height="";
this.domNode.style.lineHeight="";
}});
wm.Object.extendSchema(wm._TextAreaEditor,{changeOnEnter:{ignore:1},password:{ignore:1}});
}
if(!dojo._hasResource["dijit._Container"]){
dojo._hasResource["dijit._Container"]=true;
dojo.provide("dijit._Container");
dojo.declare("dijit._Container",null,{isContainer:true,buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_6a,_6b){
var _6c=this.containerNode;
if(_6b&&typeof _6b=="number"){
var _6d=this.getChildren();
if(_6d&&_6d.length>=_6b){
_6c=_6d[_6b-1].domNode;
_6b="after";
}
}
dojo.place(_6a.domNode,_6c,_6b);
if(this._started&&!_6a._started){
_6a.startup();
}
},removeChild:function(_6e){
if(typeof _6e=="number"){
_6e=this.getChildren()[_6e];
}
if(_6e){
var _6f=_6e.domNode;
if(_6f&&_6f.parentNode){
_6f.parentNode.removeChild(_6f);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},destroyDescendants:function(_70){
dojo.forEach(this.getChildren(),function(_71){
_71.destroyRecursive(_70);
});
},_getSiblingOfChild:function(_72,dir){
var _73=_72.domNode,_74=(dir>0?"nextSibling":"previousSibling");
do{
_73=_73[_74];
}while(_73&&(_73.nodeType!=1||!dijit.byNode(_73)));
return _73&&dijit.byNode(_73);
},getIndexOfChild:function(_75){
return dojo.indexOf(this.getChildren(),_75);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_76){
_76.startup();
});
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dojo.dnd.move"]){
dojo._hasResource["dojo.dnd.move"]=true;
dojo.provide("dojo.dnd.move");
dojo.declare("dojo.dnd.move.constrainedMoveable",dojo.dnd.Moveable,{constraints:function(){
},within:false,markupFactory:function(_77,_78){
return new dojo.dnd.move.constrainedMoveable(_78,_77);
},constructor:function(_79,_7a){
if(!_7a){
_7a={};
}
this.constraints=_7a.constraints;
this.within=_7a.within;
},onFirstMove:function(_7b){
var c=this.constraintBox=this.constraints.call(this,_7b);
c.r=c.l+c.w;
c.b=c.t+c.h;
if(this.within){
var mb=dojo._getMarginSize(_7b.node);
c.r-=mb.w;
c.b-=mb.h;
}
},onMove:function(_7c,_7d){
var c=this.constraintBox,s=_7c.node.style;
this.onMoving(_7c,_7d);
_7d.l=_7d.l<c.l?c.l:c.r<_7d.l?c.r:_7d.l;
_7d.t=_7d.t<c.t?c.t:c.b<_7d.t?c.b:_7d.t;
s.left=_7d.l+"px";
s.top=_7d.t+"px";
this.onMoved(_7c,_7d);
}});
dojo.declare("dojo.dnd.move.boxConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{box:{},markupFactory:function(_7e,_7f){
return new dojo.dnd.move.boxConstrainedMoveable(_7f,_7e);
},constructor:function(_80,_81){
var box=_81&&_81.box;
this.constraints=function(){
return box;
};
}});
dojo.declare("dojo.dnd.move.parentConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{area:"content",markupFactory:function(_82,_83){
return new dojo.dnd.move.parentConstrainedMoveable(_83,_82);
},constructor:function(_84,_85){
var _86=_85&&_85.area;
this.constraints=function(){
var n=this.node.parentNode,s=dojo.getComputedStyle(n),mb=dojo._getMarginBox(n,s);
if(_86=="margin"){
return mb;
}
var t=dojo._getMarginExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(_86=="border"){
return mb;
}
t=dojo._getBorderExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(_86=="padding"){
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
var _87=this.dropDown,_88=false;
if(e&&this._opened){
var c=dojo.position(this._buttonNode,true);
if(!(e.pageX>=c.x&&e.pageX<=c.x+c.w)||!(e.pageY>=c.y&&e.pageY<=c.y+c.h)){
var t=e.target;
while(t&&!_88){
if(dojo.hasClass(t,"dijitPopup")){
_88=true;
}else{
t=t.parentNode;
}
}
if(_88){
t=e.target;
if(_87.onItemClick){
var _89;
while(t&&!(_89=dijit.byNode(t))){
t=t.parentNode;
}
if(_89&&_89.onClick&&_89.getParent){
_89.getParent().onItemClick(_89,e);
}
}
return;
}
}
}
if(this._opened&&_87.focus&&_87.autoFocus!==false){
window.setTimeout(dojo.hitch(_87,"focus"),1);
}
},_onDropDownClick:function(e){
if(this._stopClickEvents){
dojo.stopEvent(e);
}
},buildRendering:function(){
this.inherited(arguments);
this._buttonNode=this._buttonNode||this.focusNode||this.domNode;
this._popupStateNode=this._popupStateNode||this.focusNode||this._buttonNode;
var _8a={"after":this.isLeftToRight()?"Right":"Left","before":this.isLeftToRight()?"Left":"Right","above":"Up","below":"Down","left":"Left","right":"Right"}[this.dropDownPosition[0]]||this.dropDownPosition[0]||"Down";
dojo.addClass(this._arrowWrapperNode||this._buttonNode,"dijit"+_8a+"ArrowButton");
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
var d=this.dropDown,_8b=e.target;
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
if(!this._opened&&(e.charOrCode==dojo.keys.DOWN_ARROW||((e.charOrCode==dojo.keys.ENTER||e.charOrCode==" ")&&((_8b.tagName||"").toLowerCase()!=="input"||(_8b.type&&_8b.type.toLowerCase()!=="text"))))){
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
var _8c=dijit._curFocus&&this.dropDown&&dojo.isDescendant(dijit._curFocus,this.dropDown.domNode);
this.closeDropDown(_8c);
this.inherited(arguments);
},isLoaded:function(){
return true;
},loadDropDown:function(_8d){
_8d();
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
var _8e=this.dropDown,_8f=_8e.domNode,_90=this._aroundNode||this.domNode,_91=this;
if(!this._preparedNode){
this._preparedNode=true;
if(_8f.style.width){
this._explicitDDWidth=true;
}
if(_8f.style.height){
this._explicitDDHeight=true;
}
}
if(this.maxHeight||this.forceWidth||this.autoWidth){
var _92={display:"",visibility:"hidden"};
if(!this._explicitDDWidth){
_92.width="";
}
if(!this._explicitDDHeight){
_92.height="";
}
dojo.style(_8f,_92);
var _93=this.maxHeight;
if(_93==-1){
var _94=dojo.window.getBox(),_95=dojo.position(_90,false);
_93=Math.floor(Math.max(_95.y,_94.h-(_95.y+_95.h)));
}
if(_8e.startup&&!_8e._started){
_8e.startup();
}
dijit.popup.moveOffScreen(_8e);
var mb=dojo._getMarginSize(_8f);
var _96=(_93&&mb.h>_93);
dojo.style(_8f,{overflowX:"hidden",overflowY:_96?"auto":"hidden"});
if(_96){
mb.h=_93;
if("w" in mb){
mb.w+=16;
}
}else{
delete mb.h;
}
if(this.forceWidth){
mb.w=_90.offsetWidth;
}else{
if(this.autoWidth){
mb.w=Math.max(mb.w,_90.offsetWidth);
}else{
delete mb.w;
}
}
if(dojo.isFunction(_8e.resize)){
_8e.resize(mb);
}else{
dojo.marginBox(_8f,mb);
}
}
var _97=dijit.popup.open({parent:this,popup:_8e,around:_90,orient:dijit.getPopupAroundAlignment((this.dropDownPosition&&this.dropDownPosition.length)?this.dropDownPosition:["below"],this.isLeftToRight()),onExecute:function(){
_91.closeDropDown(true);
},onCancel:function(){
_91.closeDropDown(true);
},onClose:function(){
dojo.attr(_91._popupStateNode,"popupActive",false);
dojo.removeClass(_91._popupStateNode,"dijitHasDropDownOpen");
_91._opened=false;
}});
dojo.attr(this._popupStateNode,"popupActive","true");
dojo.addClass(_91._popupStateNode,"dijitHasDropDownOpen");
this._opened=true;
return _97;
},closeDropDown:function(_98){
if(this._opened){
if(_98){
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
for(var _99=this.domNode;_99.parentNode;_99=_99.parentNode){
var _9a=dijit.byNode(_99);
if(_9a&&typeof _9a._onSubmit=="function"){
_9a._onSubmit(e);
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
},_fillContent:function(_9b){
if(_9b&&(!this.params||!("label" in this.params))){
this.set("label",_9b.innerHTML);
}
},_setShowLabelAttr:function(val){
if(this.containerNode){
dojo.toggleClass(this.containerNode,"dijitDisplayNone",!val);
}
this._set("showLabel",val);
},onClick:function(e){
return true;
},_clicked:function(e){
},setLabel:function(_9c){
dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_9c);
},_setLabelAttr:function(_9d){
this._set("label",_9d);
this.containerNode.innerHTML=_9d;
if(this.showLabel==false&&!this.params.title){
this.titleNode.title=dojo.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
},_setIconClassAttr:function(val){
var _9e=this.iconClass||"dijitNoIcon",_9f=val||"dijitNoIcon";
dojo.replaceClass(this.iconNode,_9f,_9e);
this._set("iconClass",val);
}});
dojo.declare("dijit.form.DropDownButton",[dijit.form.Button,dijit._Container,dijit._HasDropDown],{baseClass:"dijitDropDownButton",templateString:dojo.cache("dijit.form","templates/DropDownButton.html","<span class=\"dijit dijitReset dijitInline\"\n\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\" dojoAttachPoint=\"_buttonNode\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"focusNode,titleNode,_arrowWrapperNode\"\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\n\t\t\t\tdojoAttachPoint=\"iconNode\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tdojoAttachPoint=\"containerNode,_popupStateNode\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\" tabIndex=\"-1\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),_fillContent:function(){
if(this.srcNodeRef){
var _a0=dojo.query("*",this.srcNodeRef);
dijit.form.DropDownButton.superclass._fillContent.call(this,_a0[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
if(!this.dropDown&&this.dropDownContainer){
var _a1=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.dropDown=dijit.byNode(_a1);
delete this.dropDownContainer;
}
if(this.dropDown){
dijit.popup.hide(this.dropDown);
}
this.inherited(arguments);
},isLoaded:function(){
var _a2=this.dropDown;
return (!!_a2&&(!_a2.href||_a2.isLoaded));
},loadDropDown:function(){
var _a3=this.dropDown;
if(!_a3){
return;
}
if(!this.isLoaded()){
var _a4=dojo.connect(_a3,"onLoad",this,function(){
dojo.disconnect(_a4);
this.openDropDown();
});
_a3.refresh();
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
},focus:function(_a5){
if(!this.disabled){
dijit.focus(_a5=="start"?this.titleNode:this._popupStateNode);
}
}});
dojo.declare("dijit.form.ToggleButton",dijit.form.Button,{baseClass:"dijitToggleButton",checked:false,attributeMap:dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap),{checked:"focusNode"}),_clicked:function(evt){
this.set("checked",!this.checked);
},_setCheckedAttr:function(_a6,_a7){
this._set("checked",_a6);
dojo.attr(this.focusNode||this.domNode,"checked",_a6);
dijit.setWaiState(this.focusNode||this.domNode,"pressed",_a6);
this._handleOnChange(_a6,_a7);
},setChecked:function(_a8){
dojo.deprecated("setChecked("+_a8+") is deprecated. Use set('checked',"+_a8+") instead.","","2.0");
this.set("checked",_a8);
},reset:function(){
this._hasBeenBlurred=false;
this.set("checked",this.params.checked||false);
}});
}
if(!dojo._hasResource["dojo.number"]){
dojo._hasResource["dojo.number"]=true;
dojo.provide("dojo.number");
dojo.getObject("number",true,dojo);
dojo.number.format=function(_a9,_aa){
_aa=dojo.mixin({},_aa||{});
var _ab=dojo.i18n.normalizeLocale(_aa.locale),_ac=dojo.i18n.getLocalization("dojo.cldr","number",_ab);
_aa.customs=_ac;
var _ad=_aa.pattern||_ac[(_aa.type||"decimal")+"Format"];
if(isNaN(_a9)||Math.abs(_a9)==Infinity){
return null;
}
return dojo.number._applyPattern(_a9,_ad,_aa);
};
dojo.number._numberPatternRE=/[#0,]*[#0](?:\.0*#*)?/;
dojo.number._applyPattern=function(_ae,_af,_b0){
_b0=_b0||{};
var _b1=_b0.customs.group,_b2=_b0.customs.decimal,_b3=_af.split(";"),_b4=_b3[0];
_af=_b3[(_ae<0)?1:0]||("-"+_b4);
if(_af.indexOf("%")!=-1){
_ae*=100;
}else{
if(_af.indexOf("‰")!=-1){
_ae*=1000;
}else{
if(_af.indexOf("¤")!=-1){
_b1=_b0.customs.currencyGroup||_b1;
_b2=_b0.customs.currencyDecimal||_b2;
_af=_af.replace(/\u00a4{1,3}/,function(_b5){
var _b6=["symbol","currency","displayName"][_b5.length-1];
return _b0[_b6]||_b0.currency||"";
});
}else{
if(_af.indexOf("E")!=-1){
throw new Error("exponential notation not supported");
}
}
}
}
var _b7=dojo.number._numberPatternRE;
var _b8=_b4.match(_b7);
if(!_b8){
throw new Error("unable to find a number expression in pattern: "+_af);
}
if(_b0.fractional===false){
_b0.places=0;
}
return _af.replace(_b7,dojo.number._formatAbsolute(_ae,_b8[0],{decimal:_b2,group:_b1,places:_b0.places,round:_b0.round}));
};
dojo.number.round=function(_b9,_ba,_bb){
var _bc=10/(_bb||10);
return (_bc*+_b9).toFixed(_ba)/_bc;
};
if((0.9).toFixed()==0){
(function(){
var _bd=dojo.number.round;
dojo.number.round=function(v,p,m){
var d=Math.pow(10,-p||0),a=Math.abs(v);
if(!v||a>=d||a*Math.pow(10,p+1)<5){
d=0;
}
return _bd(v,p,m)+(v>0?d:-d);
};
})();
}
dojo.number._formatAbsolute=function(_be,_bf,_c0){
_c0=_c0||{};
if(_c0.places===true){
_c0.places=0;
}
if(_c0.places===Infinity){
_c0.places=6;
}
var _c1=_bf.split("."),_c2=typeof _c0.places=="string"&&_c0.places.indexOf(","),_c3=_c0.places;
if(_c2){
_c3=_c0.places.substring(_c2+1);
}else{
if(!(_c3>=0)){
_c3=(_c1[1]||[]).length;
}
}
if(!(_c0.round<0)){
_be=dojo.number.round(_be,_c3,_c0.round);
}
var _c4=String(Math.abs(_be)).split("."),_c5=_c4[1]||"";
if(_c1[1]||_c0.places){
if(_c2){
_c0.places=_c0.places.substring(0,_c2);
}
var pad=_c0.places!==undefined?_c0.places:(_c1[1]&&_c1[1].lastIndexOf("0")+1);
if(pad>_c5.length){
_c4[1]=dojo.string.pad(_c5,pad,"0",true);
}
if(_c3<_c5.length){
_c4[1]=_c5.substr(0,_c3);
}
}else{
if(_c4[1]){
_c4.pop();
}
}
var _c6=_c1[0].replace(",","");
pad=_c6.indexOf("0");
if(pad!=-1){
pad=_c6.length-pad;
if(pad>_c4[0].length){
_c4[0]=dojo.string.pad(_c4[0],pad);
}
if(_c6.indexOf("#")==-1){
_c4[0]=_c4[0].substr(_c4[0].length-pad);
}
}
var _c7=_c1[0].lastIndexOf(","),_c8,_c9;
if(_c7!=-1){
_c8=_c1[0].length-_c7-1;
var _ca=_c1[0].substr(0,_c7);
_c7=_ca.lastIndexOf(",");
if(_c7!=-1){
_c9=_ca.length-_c7-1;
}
}
var _cb=[];
for(var _cc=_c4[0];_cc;){
var off=_cc.length-_c8;
_cb.push((off>0)?_cc.substr(off):_cc);
_cc=(off>0)?_cc.slice(0,off):"";
if(_c9){
_c8=_c9;
delete _c9;
}
}
_c4[0]=_cb.reverse().join(_c0.group||",");
return _c4.join(_c0.decimal||".");
};
dojo.number.regexp=function(_cd){
return dojo.number._parseInfo(_cd).regexp;
};
dojo.number._parseInfo=function(_ce){
_ce=_ce||{};
var _cf=dojo.i18n.normalizeLocale(_ce.locale),_d0=dojo.i18n.getLocalization("dojo.cldr","number",_cf),_d1=_ce.pattern||_d0[(_ce.type||"decimal")+"Format"],_d2=_d0.group,_d3=_d0.decimal,_d4=1;
if(_d1.indexOf("%")!=-1){
_d4/=100;
}else{
if(_d1.indexOf("‰")!=-1){
_d4/=1000;
}else{
var _d5=_d1.indexOf("¤")!=-1;
if(_d5){
_d2=_d0.currencyGroup||_d2;
_d3=_d0.currencyDecimal||_d3;
}
}
}
var _d6=_d1.split(";");
if(_d6.length==1){
_d6.push("-"+_d6[0]);
}
var re=dojo.regexp.buildGroupRE(_d6,function(_d7){
_d7="(?:"+dojo.regexp.escapeString(_d7,".")+")";
return _d7.replace(dojo.number._numberPatternRE,function(_d8){
var _d9={signed:false,separator:_ce.strict?_d2:[_d2,""],fractional:_ce.fractional,decimal:_d3,exponent:false},_da=_d8.split("."),_db=_ce.places;
if(_da.length==1&&_d4!=1){
_da[1]="###";
}
if(_da.length==1||_db===0){
_d9.fractional=false;
}else{
if(_db===undefined){
_db=_ce.pattern?_da[1].lastIndexOf("0")+1:Infinity;
}
if(_db&&_ce.fractional==undefined){
_d9.fractional=true;
}
if(!_ce.places&&(_db<_da[1].length)){
_db+=","+_da[1].length;
}
_d9.places=_db;
}
var _dc=_da[0].split(",");
if(_dc.length>1){
_d9.groupSize=_dc.pop().length;
if(_dc.length>1){
_d9.groupSize2=_dc.pop().length;
}
}
return "("+dojo.number._realNumberRegexp(_d9)+")";
});
},true);
if(_d5){
re=re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g,function(_dd,_de,_df,_e0){
var _e1=["symbol","currency","displayName"][_df.length-1],_e2=dojo.regexp.escapeString(_ce[_e1]||_ce.currency||"");
_de=_de?"[\\s\\xa0]":"";
_e0=_e0?"[\\s\\xa0]":"";
if(!_ce.strict){
if(_de){
_de+="*";
}
if(_e0){
_e0+="*";
}
return "(?:"+_de+_e2+_e0+")?";
}
return _de+_e2+_e0;
});
}
return {regexp:re.replace(/[\xa0 ]/g,"[\\s\\xa0]"),group:_d2,decimal:_d3,factor:_d4};
};
dojo.number.parse=function(_e3,_e4){
var _e5=dojo.number._parseInfo(_e4),_e6=(new RegExp("^"+_e5.regexp+"$")).exec(_e3);
if(!_e6){
return NaN;
}
var _e7=_e6[1];
if(!_e6[1]){
if(!_e6[2]){
return NaN;
}
_e7=_e6[2];
_e5.factor*=-1;
}
_e7=_e7.replace(new RegExp("["+_e5.group+"\\s\\xa0"+"]","g"),"").replace(_e5.decimal,".");
return _e7*_e5.factor;
};
dojo.number._realNumberRegexp=function(_e8){
_e8=_e8||{};
if(!("places" in _e8)){
_e8.places=Infinity;
}
if(typeof _e8.decimal!="string"){
_e8.decimal=".";
}
if(!("fractional" in _e8)||/^0/.test(_e8.places)){
_e8.fractional=[true,false];
}
if(!("exponent" in _e8)){
_e8.exponent=[true,false];
}
if(!("eSigned" in _e8)){
_e8.eSigned=[true,false];
}
var _e9=dojo.number._integerRegexp(_e8),_ea=dojo.regexp.buildGroupRE(_e8.fractional,function(q){
var re="";
if(q&&(_e8.places!==0)){
re="\\"+_e8.decimal;
if(_e8.places==Infinity){
re="(?:"+re+"\\d+)?";
}else{
re+="\\d{"+_e8.places+"}";
}
}
return re;
},true);
var _eb=dojo.regexp.buildGroupRE(_e8.exponent,function(q){
if(q){
return "([eE]"+dojo.number._integerRegexp({signed:_e8.eSigned})+")";
}
return "";
});
var _ec=_e9+_ea;
if(_ea){
_ec="(?:(?:"+_ec+")|(?:"+_ea+"))";
}
return _ec+_eb;
};
dojo.number._integerRegexp=function(_ed){
_ed=_ed||{};
if(!("signed" in _ed)){
_ed.signed=[true,false];
}
if(!("separator" in _ed)){
_ed.separator="";
}else{
if(!("groupSize" in _ed)){
_ed.groupSize=3;
}
}
var _ee=dojo.regexp.buildGroupRE(_ed.signed,function(q){
return q?"[-+]":"";
},true);
var _ef=dojo.regexp.buildGroupRE(_ed.separator,function(sep){
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
var grp=_ed.groupSize,_f0=_ed.groupSize2;
if(_f0){
var _f1="(?:0|[1-9]\\d{0,"+(_f0-1)+"}(?:["+sep+"]\\d{"+_f0+"})*["+sep+"]\\d{"+grp+"})";
return ((grp-_f0)>0)?"(?:"+_f1+"|(?:0|[1-9]\\d{0,"+(grp-1)+"}))":_f1;
}
return "(?:0|[1-9]\\d{0,"+(grp-1)+"}(?:["+sep+"]\\d{"+grp+"})*)";
},true);
return _ee+_ef;
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
var _f2=dojo.position(this.sliderBarContainer,true);
var _f3=e[this._mousePixelCoord]-_f2[this._startingPixelCoord];
this._setPixelValue(this._isReversed()?(_f2[this._pixelCount]-_f3):_f3,_f2[this._pixelCount],true);
this._movable.onMouseDown(e);
},_setPixelValue:function(_f4,_f5,_f6){
if(this.disabled||this.readOnly){
return;
}
_f4=_f4<0?0:_f5<_f4?_f5:_f4;
var _f7=this.discreteValues;
if(_f7<=1||_f7==Infinity){
_f7=_f5;
}
_f7--;
var _f8=_f5/_f7;
var _f9=Math.round(_f4/_f8);
this._setValueAttr((this.maximum-this.minimum)*_f9/_f7+this.minimum,_f6);
},_setValueAttr:function(_fa,_fb){
this._set("value",_fa);
this.valueNode.value=_fa;
dijit.setWaiState(this.focusNode,"valuenow",_fa);
this.inherited(arguments);
var _fc=(_fa-this.minimum)/(this.maximum-this.minimum);
var _fd=(this._descending===false)?this.remainingBar:this.progressBar;
var _fe=(this._descending===false)?this.progressBar:this.remainingBar;
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
if(_fb&&this.slideDuration>0&&_fd.style[this._progressPixelSize]){
var _ff=this;
var _100={};
var _101=parseFloat(_fd.style[this._progressPixelSize]);
var _102=this.slideDuration*(_fc-_101/100);
if(_102==0){
return;
}
if(_102<0){
_102=0-_102;
}
_100[this._progressPixelSize]={start:_101,end:_fc*100,units:"%"};
this._inProgressAnim=dojo.animateProperty({node:_fd,duration:_102,onAnimate:function(v){
_fe.style[_ff._progressPixelSize]=(100-parseFloat(v[_ff._progressPixelSize]))+"%";
},onEnd:function(){
delete _ff._inProgressAnim;
},properties:_100});
this._inProgressAnim.play();
}else{
_fd.style[this._progressPixelSize]=(_fc*100)+"%";
_fe.style[this._progressPixelSize]=((1-_fc)*100)+"%";
}
},_bumpValue:function(_103,_104){
if(this.disabled||this.readOnly){
return;
}
var s=dojo.getComputedStyle(this.sliderBarContainer);
var c=dojo._getContentBox(this.sliderBarContainer,s);
var _105=this.discreteValues;
if(_105<=1||_105==Infinity){
_105=c[this._pixelCount];
}
_105--;
var _106=(this.value-this.minimum)*_105/(this.maximum-this.minimum)+_103;
if(_106<0){
_106=0;
}
if(_106>_105){
_106=_105;
}
_106=_106*(this.maximum-this.minimum)/_105+this.minimum;
this._setValueAttr(_106,_104);
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
var _107=!dojo.isMozilla;
var _108=evt[(_107?"wheelDelta":"detail")]*(_107?1:-1);
this._bumpValue(_108<0?-1:1,true);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_109){
if(this[_109.container]!=this.containerNode){
this[_109.container].appendChild(_109.domNode);
}
},this);
this.inherited(arguments);
},_typematicCallback:function(_10a,_10b,e){
if(_10a==-1){
this._setValueAttr(this.value,true);
}else{
this[(_10b==(this._descending?this.incrementButton:this.decrementButton))?"decrement":"increment"](e);
}
},buildRendering:function(){
this.inherited(arguments);
if(this.showButtons){
this.incrementButton.style.display="";
this.decrementButton.style.display="";
}
var _10c=dojo.query("label[for=\""+this.id+"\"]");
if(_10c.length){
_10c[0].id=(this.id+"_label");
dijit.setWaiState(this.focusNode,"labelledby",_10c[0].id);
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
var _10d=dojo.declare(dijit.form._SliderMover,{widget:this});
this._movable=new dojo.dnd.Moveable(this.sliderHandle,{mover:_10d});
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
var _10e=this.widget;
var _10f=_10e._abspos;
if(!_10f){
_10f=_10e._abspos=dojo.position(_10e.sliderBarContainer,true);
_10e._setPixelValue_=dojo.hitch(_10e,"_setPixelValue");
_10e._isReversed_=_10e._isReversed();
}
var _110=e.touches?e.touches[0]:e,_111=_110[_10e._mousePixelCoord]-_10f[_10e._startingPixelCoord];
_10e._setPixelValue_(_10e._isReversed_?(_10f[_10e._pixelCount]-_111):_111,_10f[_10e._pixelCount],false);
},destroy:function(e){
dojo.dnd.Mover.prototype.destroy.apply(this,arguments);
var _112=this.widget;
_112._abspos=null;
_112._setValueAttr(_112.value,true);
}});
}
if(!dojo._hasResource["dijit.form.VerticalSlider"]){
dojo._hasResource["dijit.form.VerticalSlider"]=true;
dojo.provide("dijit.form.VerticalSlider");
dojo.declare("dijit.form.VerticalSlider",dijit.form.HorizontalSlider,{templateString:dojo.cache("dijit.form","templates/VerticalSlider.html","<table class=\"dijit dijitReset dijitSlider dijitSliderV\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" dojoAttachEvent=\"onkeypress:_onKeyPress,onkeyup:_onKeyUp\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderIncrementIconV\" style=\"display:none\" dojoAttachPoint=\"decrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderTopBumper\" dojoAttachEvent=\"onmousedown:_onClkIncBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td dojoAttachPoint=\"leftDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationL dijitSliderDecorationV\"></td\n\t\t><td class=\"dijitReset dijitSliderDecorationC\" style=\"height:100%;\"\n\t\t\t><input dojoAttachPoint=\"valueNode\" type=\"hidden\" ${!nameAttrSetting}\n\t\t\t/><center class=\"dijitReset dijitSliderBarContainerV\" role=\"presentation\" dojoAttachPoint=\"sliderBarContainer\"\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderRemainingBar dijitSliderRemainingBarV\" dojoAttachEvent=\"onmousedown:_onBarClick\"><!--#5629--></div\n\t\t\t\t><div role=\"presentation\" dojoAttachPoint=\"progressBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderProgressBar dijitSliderProgressBarV\" dojoAttachEvent=\"onmousedown:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableV\" style=\"vertical-align:top;\"\n\t\t\t\t\t\t><div dojoAttachPoint=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleV\" dojoAttachEvent=\"onmousedown:_onHandleClick\" role=\"slider\" valuemin=\"${minimum}\" valuemax=\"${maximum}\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t></center\n\t\t></td\n\t\t><td dojoAttachPoint=\"containerNode,rightDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationR dijitSliderDecorationV\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderBottomBumper\" dojoAttachEvent=\"onmousedown:_onClkDecBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderDecrementIconV\" style=\"display:none\" dojoAttachPoint=\"incrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n></table>\n"),_mousePixelCoord:"pageY",_pixelCount:"h",_startingPixelCoord:"y",_startingPixelCount:"t",_handleOffsetCoord:"top",_progressPixelSize:"height",_descending:true,_isReversed:function(){
return this._descending;
}});
}
if(!dojo._hasResource["wm.base.widget.Editors._NumberEditor"]){
dojo._hasResource["wm.base.widget.Editors._NumberEditor"]=true;
dojo.provide("wm.base.widget.Editors._NumberEditor");
dojo.declare("wm._NumberEditor",wm._TextEditor,{minimum:"",maximum:"",places:"",_messages:{rangeMin:"Minimum number must be less than the maximum setting of ${0}.",rangeMax:"Maximum number must be greater than the minimum setting of ${0}."},rangeMessage:"",getEditorProps:function(_113,_114){
var _115={},v=this.owner.displayValue;
if(this.minimum){
_115.min=Number(this.minimum);
}
if(this.maximum){
_115.max=Number(this.maximum);
}
if(this.places){
var _116=this._getPlaces();
if(_116&&_116!=""){
_115.places=_116;
}
}
_115.pattern=this._getPattern();
return dojo.mixin(this.inherited(arguments),{constraints:_115,editPattern:_115.pattern,rangeMessage:this.rangeMessage,required:this.required,value:v?Number(v):""},_114||{});
},_getPlaces:function(){
return "";
},_createEditor:function(_117,_118){
return new dijit.form.NumberTextBox(this.getEditorProps(_117,_118));
},_getPattern:function(){
var p=this.places!==""?Number(this.places):20,n="#",d=".",_119=[n];
if(p){
_119.push(d);
}
for(var i=0;i<p;i++){
_119.push(n);
}
return _119.join("");
},setMaximum:function(_11a){
var v=Number(_11a);
if(this.minimum===""||this.minimum<v){
this.maximum=v;
if(this.editor){
this.editor.constraints.max=v;
}
}else{
if(this.isDesignLoaded()){
app.alert(dojo.string.substitute(this._messages.rangeMax,[this.minimum]));
}
}
},setMinimum:function(_11b){
var v=Number(_11b);
if(this.maximum===""||v<this.maximum){
this.minimum=v;
if(this.editor){
this.editor.constraints.min=v;
}
}else{
if(this.isDesignLoaded()){
app.alert(dojo.string.substitute(this._messages.rangeMin,[this.maximum]));
}
}
},_getReadonlyValue:function(){
return dojo.number.format(this.owner.dataValue,this.getFormatProps());
},getFormatProps:function(){
var _11c={};
if(this.places&&this.places!=""){
_11c.places=Number(this.places);
}
return _11c;
}});
dojo.declare("wm._CurrencyEditor",wm._NumberEditor,{currency:"USD",getEditorProps:function(_11d,_11e){
var prop=this.inherited(arguments);
if(prop.constraints){
delete prop.constraints.pattern;
}
return dojo.mixin(prop,{currency:this.currency},_11e||{});
},_createEditor:function(_11f,_120){
return new dijit.form.CurrencyTextBox(this.getEditorProps(_11f,_120));
},_getReadonlyValue:function(){
return dojo.currency.format(this.owner.dataValue,{currency:this.currency,places:this.places});
},_getPlaces:function(){
return this.places;
}});
dojo.declare("wm._SliderEditor",wm._BaseEditor,{minimum:0,maximum:100,showButtons:true,discreteValues:"",verticalSlider:false,reflow:function(){
},setVerticalSlider:function(_121){
this.verticalSlider=_121;
if(this.editor){
this.createEditor();
}
},getEditorProps:function(_122,_123){
var v=this.owner.displayValue;
var minV=Number(this.minimum)?Number(this.minimum):0;
if(!v||(Number(v)<minV)){
v=this.owner.displayValue=minV;
}
return dojo.mixin(this.inherited(arguments),{minimum:Number(this.minimum),maximum:Number(this.maximum),showButtons:Boolean(this.showButtons),discreteValues:Number(this.discreteValues)||Infinity,value:v},_123||{});
},_createEditor:function(_124,_125){
if(this.verticalSlider){
return new dijit.form.VerticalSlider(this.getEditorProps(_124,_125));
}else{
return new dijit.form.HorizontalSlider(this.getEditorProps(_124,_125));
}
},sizeEditor:function(){
if(this._cupdating){
return;
}
var e=this.editor;
if(e){
var _126=this.getContentBounds(),_127=_126.h?_126.h-2+"px":"",_128=_126.w?_126.w-4+"px":"",d=e&&e.domNode,s=d.style,fc=d&&d.firstChild;
if(!this.editorBorder){
s.border=0;
}
s.backgroundColor=this.editorBorder?"":"transparent";
s.backgroundImage=this.editorBorder?"":"none";
s.width=_128;
s.height=_127;
if(this.verticalSlider){
this.editor.incrementButton.style.width="auto";
this.editor.decrementButton.style.width="auto";
}
}
}});
wm.Object.extendSchema(wm._NumberEditor,{regExp:{ignore:1},maxChars:{ignore:1}});
wm.Object.extendSchema(wm._SliderEditor,{changeOnKey:{ignore:1},changeOnEnter:{ignore:1}});
}
if(!dojo._hasResource["dijit.form.DropDownButton"]){
dojo._hasResource["dijit.form.DropDownButton"]=true;
dojo.provide("dijit.form.DropDownButton");
}
if(!dojo._hasResource["dijit.Calendar"]){
dojo._hasResource["dijit.Calendar"]=true;
dojo.provide("dijit.Calendar");
dojo.declare("dijit.Calendar",[dijit._Widget,dijit._Templated,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/Calendar.html","<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" dojoAttachEvent=\"onkeypress: _onKeyPress\" aria-labelledby=\"${id}_year\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\" dojoAttachPoint=\"monthDropDownButton\"\n\t\t\t\t\tid=\"${id}_mddb\" tabIndex=\"-1\">\n\t\t\t\t</div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\" role=\"gridcell\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n"),widgetsInTemplate:true,value:new Date(""),datePackage:"dojo.date",dayWidth:"narrow",tabIndex:"0",currentFocus:new Date(),baseClass:"dijitCalendar",cssStateNodes:{"decrementMonth":"dijitCalendarArrow","incrementMonth":"dijitCalendarArrow","previousYearLabelNode":"dijitCalendarPreviousYear","nextYearLabelNode":"dijitCalendarNextYear"},_isValidDate:function(_129){
return _129&&!isNaN(_129)&&typeof _129=="object"&&_129.toString()!=this.constructor.prototype.value.toString();
},setValue:function(_12a){
dojo.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_12a);
},_getValueAttr:function(){
var _12b=new this.dateClassObj(this.value);
_12b.setHours(0,0,0,0);
if(_12b.getDate()<this.value.getDate()){
_12b=this.dateFuncObj.add(_12b,"hour",1);
}
return _12b;
},_setValueAttr:function(_12c,_12d){
if(_12c){
_12c=new this.dateClassObj(_12c);
}
if(this._isValidDate(_12c)){
if(!this._isValidDate(this.value)||this.dateFuncObj.compare(_12c,this.value)){
_12c.setHours(1,0,0,0);
if(!this.isDisabledDate(_12c,this.lang)){
this._set("value",_12c);
this.set("currentFocus",_12c);
if(_12d||typeof _12d=="undefined"){
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
var _12e=new this.dateClassObj(this.currentFocus);
_12e.setDate(1);
var _12f=_12e.getDay(),_130=this.dateFuncObj.getDaysInMonth(_12e),_131=this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(_12e,"month",-1)),_132=new this.dateClassObj(),_133=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
if(_133>_12f){
_133-=7;
}
dojo.query(".dijitCalendarDateTemplate",this.domNode).forEach(function(_134,i){
i+=_133;
var date=new this.dateClassObj(_12e),_135,_136="dijitCalendar",adj=0;
if(i<_12f){
_135=_131-_12f+i+1;
adj=-1;
_136+="Previous";
}else{
if(i>=(_12f+_130)){
_135=i-_12f-_130+1;
adj=1;
_136+="Next";
}else{
_135=i-_12f+1;
_136+="Current";
}
}
if(adj){
date=this.dateFuncObj.add(date,"month",adj);
}
date.setDate(_135);
if(!this.dateFuncObj.compare(date,_132,"date")){
_136="dijitCalendarCurrentDate "+_136;
}
if(this._isSelectedDate(date,this.lang)){
_136="dijitCalendarSelectedDate "+_136;
}
if(this.isDisabledDate(date,this.lang)){
_136="dijitCalendarDisabledDate "+_136;
}
var _137=this.getClassForDate(date,this.lang);
if(_137){
_136=_137+" "+_136;
}
_134.className=_136+"Month dijitCalendarDateTemplate";
_134.dijitDateValue=date.valueOf();
dojo.attr(_134,"dijitDateValue",date.valueOf());
var _138=dojo.query(".dijitCalendarDateLabel",_134)[0],text=date.getDateLocalized?date.getDateLocalized(this.lang):date.getDate();
this._setText(_138,text);
},this);
var _139=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,_12e);
this.monthDropDownButton.dropDown.set("months",_139);
this.monthDropDownButton.containerNode.innerHTML=(dojo.isIE==6?"":"<div class='dijitSpacer'>"+this.monthDropDownButton.dropDown.domNode.innerHTML+"</div>")+"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>"+_139[_12e.getMonth()]+"</div>";
var y=_12e.getFullYear()-1;
var d=new this.dateClassObj();
dojo.forEach(["previous","current","next"],function(name){
d.setFullYear(y++);
this._setText(this[name+"YearLabelNode"],this.dateLocaleModule.format(d,{selector:"year",locale:this.lang}));
},this);
},goToToday:function(){
this.set("value",new this.dateClassObj());
},constructor:function(args){
var _13a=(args.datePackage&&(args.datePackage!="dojo.date"))?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_13a,false);
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
var _13b=dojo.hitch(this,function(_13c,n){
var _13d=dojo.query(_13c,this.domNode)[0];
for(var i=0;i<n;i++){
_13d.parentNode.appendChild(_13d.cloneNode(true));
}
});
_13b(".dijitCalendarDayLabelTemplate",6);
_13b(".dijitCalendarDateTemplate",6);
_13b(".dijitCalendarWeekTemplate",5);
var _13e=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang);
var _13f=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
dojo.query(".dijitCalendarDayLabel",this.domNode).forEach(function(_140,i){
this._setText(_140,_13e[(i+_13f)%7]);
},this);
var _141=new this.dateClassObj(this.currentFocus);
this.monthDropDownButton.dropDown=new dijit.Calendar._MonthDropDown({id:this.id+"_mdd",onChange:dojo.hitch(this,"_onMonthSelect")});
this.set("currentFocus",_141,false);
var _142=this;
var _143=function(_144,_145,adj){
_142._connects.push(dijit.typematic.addMouseListener(_142[_144],_142,function(_146){
if(_146>=0){
_142._adjustDisplay(_145,adj);
}
},0.8,500));
};
_143("incrementMonth","month",1);
_143("decrementMonth","month",-1);
_143("nextYearLabelNode","year",1);
_143("previousYearLabelNode","year",-1);
},_adjustDisplay:function(part,_147){
this._setCurrentFocusAttr(this.dateFuncObj.add(this.currentFocus,part,_147));
},_setCurrentFocusAttr:function(date,_148){
var _149=this.currentFocus,_14a=_149?dojo.query("[dijitDateValue="+_149.valueOf()+"]",this.domNode)[0]:null;
date=new this.dateClassObj(date);
date.setHours(1,0,0,0);
this._set("currentFocus",date);
this._populateGrid();
var _14b=dojo.query("[dijitDateValue="+date.valueOf()+"]",this.domNode)[0];
_14b.setAttribute("tabIndex",this.tabIndex);
if(this._focused||_148){
_14b.focus();
}
if(_14a&&_14a!=_14b){
if(dojo.isWebKit){
_14a.setAttribute("tabIndex","-1");
}else{
_14a.removeAttribute("tabIndex");
}
}
},focus:function(){
this._setCurrentFocusAttr(this.currentFocus,true);
},_onMonthSelect:function(_14c){
this.currentFocus=this.dateFuncObj.add(this.currentFocus,"month",_14c-this.currentFocus.getMonth());
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
var dk=dojo.keys,_14d=-1,_14e,_14f=this.currentFocus;
switch(evt.keyCode){
case dk.RIGHT_ARROW:
_14d=1;
case dk.LEFT_ARROW:
_14e="day";
if(!this.isLeftToRight()){
_14d*=-1;
}
break;
case dk.DOWN_ARROW:
_14d=1;
case dk.UP_ARROW:
_14e="week";
break;
case dk.PAGE_DOWN:
_14d=1;
case dk.PAGE_UP:
_14e=evt.ctrlKey||evt.altKey?"year":"month";
break;
case dk.END:
_14f=this.dateFuncObj.add(_14f,"month",1);
_14e="day";
case dk.HOME:
_14f=new this.dateClassObj(_14f);
_14f.setDate(1);
break;
case dk.ENTER:
case dk.SPACE:
this.set("value",this.currentFocus);
break;
default:
return true;
}
if(_14e){
_14f=this.dateFuncObj.add(_14f,_14e,_14d);
}
this._setCurrentFocusAttr(_14f);
return false;
},_onKeyPress:function(evt){
if(!this.handleKey(evt)){
dojo.stopEvent(evt);
}
},onValueSelected:function(date){
},onChange:function(date){
},_isSelectedDate:function(_150,_151){
return this._isValidDate(this.value)&&!this.dateFuncObj.compare(_150,this.value,"date");
},isDisabledDate:function(_152,_153){
},getClassForDate:function(_154,_155){
}});
dojo.declare("dijit.Calendar._MonthDropDown",[dijit._Widget,dijit._Templated],{months:[],templateString:"<div class='dijitCalendarMonthMenu dijitMenu' "+"dojoAttachEvent='onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'></div>",_setMonthsAttr:function(_156){
this.domNode.innerHTML=dojo.map(_156,function(_157,idx){
return _157?"<div class='dijitCalendarMonthLabel' month='"+idx+"'>"+_157+"</div>":"";
}).join("");
},_onClick:function(evt){
this.onChange(dojo.attr(evt.target,"month"));
},onChange:function(_158){
},_onMenuHover:function(evt){
dojo.toggleClass(evt.target,"dijitCalendarMonthLabelHover",evt.type=="mouseover");
}});
}
if(!dojo._hasResource["dijit.form._DateTimeTextBox"]){
dojo._hasResource["dijit.form._DateTimeTextBox"]=true;
dojo.provide("dijit.form._DateTimeTextBox");
new Date("X");
dojo.declare("dijit.form._DateTimeTextBox",[dijit.form.RangeBoundTextBox,dijit._HasDropDown],{templateString:dojo.cache("dijit.form","templates/DropDownBox.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),hasDownArrow:true,openOnClick:true,regExpGen:dojo.date.locale.regexp,datePackage:"dojo.date",compare:function(val1,val2){
var _159=this._isInvalidDate(val1);
var _15a=this._isInvalidDate(val2);
return _159?(_15a?0:-1):(_15a?1:dojo.date.compare(val1,val2,this._selector));
},forceWidth:true,format:function(_15b,_15c){
if(!_15b){
return "";
}
return this.dateLocaleModule.format(_15b,_15c);
},"parse":function(_15d,_15e){
return this.dateLocaleModule.parse(_15d,_15e)||(this._isEmpty(_15d)?null:undefined);
},serialize:function(val,_15f){
if(val.toGregorian){
val=val.toGregorian();
}
return dojo.date.stamp.toISOString(val,_15f);
},dropDownDefaultValue:new Date(),value:new Date(""),_blankValue:null,popupClass:"",_selector:"",constructor:function(args){
var _160=args.datePackage?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_160,false);
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
},_setConstraintsAttr:function(_161){
_161.selector=this._selector;
_161.fullYear=true;
var _162=dojo.date.stamp.fromISOString;
if(typeof _161.min=="string"){
_161.min=_162(_161.min);
}
if(typeof _161.max=="string"){
_161.max=_162(_161.max);
}
this.inherited(arguments);
},_isInvalidDate:function(_163){
return !_163||isNaN(_163)||typeof _163!="object"||_163.toString()==this._invalidDate;
},_setValueAttr:function(_164,_165,_166){
if(_164!==undefined){
if(typeof _164=="string"){
_164=dojo.date.stamp.fromISOString(_164);
}
if(this._isInvalidDate(_164)){
_164=null;
}
if(_164 instanceof Date&&!(this.dateClassObj instanceof Date)){
_164=new this.dateClassObj(_164);
}
}
this.inherited(arguments);
if(this.dropDown){
this.dropDown.set("value",_164,false);
}
},_set:function(attr,_167){
if(attr=="value"&&this.value instanceof Date&&this.compare(_167,this.value)==0){
return;
}
this.inherited(arguments);
},_setDropDownDefaultValueAttr:function(val){
if(this._isInvalidDate(val)){
val=new this.dateClassObj();
}
this.dropDownDefaultValue=val;
},openDropDown:function(_168){
if(this.dropDown){
this.dropDown.destroy();
}
var _169=dojo.getObject(this.popupClass,false),_16a=this,_16b=this.get("value");
this.dropDown=new _169({onChange:function(_16c){
dijit.form._DateTimeTextBox.superclass._setValueAttr.call(_16a,_16c,true);
},id:this.id+"_popup",dir:_16a.dir,lang:_16a.lang,value:_16b,currentFocus:!this._isInvalidDate(_16b)?_16b:this.dropDownDefaultValue,constraints:_16a.constraints,filterString:_16a.filterString,datePackage:_16a.datePackage,isDisabledDate:function(date){
return !_16a.rangeCheck(date,_16a.constraints);
}});
this.inherited(arguments);
},_getDisplayedValueAttr:function(){
return this.textbox.value;
},_setDisplayedValueAttr:function(_16d,_16e){
this._setValueAttr(this.parse(_16d,this.constraints),_16e,_16d);
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
dojo.declare("dijit._TimePicker",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("dijit","templates/TimePicker.html","<div id=\"widget_${id}\" class=\"dijitMenu\"\n    ><div dojoAttachPoint=\"upArrow\" class=\"dijitButtonNode dijitUpArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div></div\n    ><div dojoAttachPoint=\"timeMenu,focusNode\" dojoAttachEvent=\"onclick:_onOptionSelected,onmouseover,onmouseout\"></div\n    ><div dojoAttachPoint=\"downArrow\" class=\"dijitButtonNode dijitDownArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div></div\n></div>\n"),baseClass:"dijitTimePicker",clickableIncrement:"T00:15:00",visibleIncrement:"T01:00:00",visibleRange:"T05:00:00",value:new Date(),_visibleIncrement:2,_clickableIncrement:1,_totalIncrements:10,constraints:{},serialize:dojo.date.stamp.toISOString,setValue:function(_16f){
dojo.deprecated("dijit._TimePicker:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_16f);
},_setValueAttr:function(date){
this._set("value",date);
this._showText();
},_setFilterStringAttr:function(val){
this._set("filterString",val);
this._showText();
},isDisabledDate:function(_170,_171){
return false;
},_getFilteredNodes:function(_172,_173,_174,_175){
var _176=[],_177=_175?_175.date:this._refDate,n,i=_172,max=this._maxIncrement+Math.abs(i),chk=_174?-1:1,dec=_174?1:0,inc=1-dec;
do{
i=i-dec;
n=this._createOption(i);
if(n){
if((_174&&n.date>_177)||(!_174&&n.date<_177)){
break;
}
_176[_174?"unshift":"push"](n);
_177=n.date;
}
i=i+inc;
}while(_176.length<_173&&(i*chk)<max);
return _176;
},_showText:function(){
var _178=dojo.date.stamp.fromISOString;
this.timeMenu.innerHTML="";
this._clickableIncrementDate=_178(this.clickableIncrement);
this._visibleIncrementDate=_178(this.visibleIncrement);
this._visibleRangeDate=_178(this.visibleRange);
var _179=function(date){
return date.getHours()*60*60+date.getMinutes()*60+date.getSeconds();
},_17a=_179(this._clickableIncrementDate),_17b=_179(this._visibleIncrementDate),_17c=_179(this._visibleRangeDate),time=(this.value||this.currentFocus).getTime();
this._refDate=new Date(time-time%(_17b*1000));
this._refDate.setFullYear(1970,0,1);
this._clickableIncrement=1;
this._totalIncrements=_17c/_17a;
this._visibleIncrement=_17b/_17a;
this._maxIncrement=(60*60*24)/_17a;
var _17d=this._getFilteredNodes(0,Math.min(this._totalIncrements>>1,10)-1),_17e=this._getFilteredNodes(0,Math.min(this._totalIncrements,10)-_17d.length,true,_17d[0]);
dojo.forEach(_17e.concat(_17d),function(n){
this.timeMenu.appendChild(n);
},this);
},constructor:function(){
this.constraints={};
},postMixInProperties:function(){
this.inherited(arguments);
this._setConstraintsAttr(this.constraints);
},_setConstraintsAttr:function(_17f){
dojo.mixin(this,_17f);
if(!_17f.locale){
_17f.locale=this.lang;
}
},postCreate:function(){
this.connect(this.timeMenu,dojo.isIE?"onmousewheel":"DOMMouseScroll","_mouseWheeled");
this._connects.push(dijit.typematic.addMouseListener(this.upArrow,this,"_onArrowUp",33,250));
this._connects.push(dijit.typematic.addMouseListener(this.downArrow,this,"_onArrowDown",33,250));
this.inherited(arguments);
},_buttonMouse:function(e){
dojo.toggleClass(e.currentTarget,e.currentTarget==this.upArrow?"dijitUpArrowHover":"dijitDownArrowHover",e.type=="mouseenter"||e.type=="mouseover");
},_createOption:function(_180){
var date=new Date(this._refDate);
var _181=this._clickableIncrementDate;
date.setHours(date.getHours()+_181.getHours()*_180,date.getMinutes()+_181.getMinutes()*_180,date.getSeconds()+_181.getSeconds()*_180);
if(this.constraints.selector=="time"){
date.setFullYear(1970,0,1);
}
var _182=dojo.date.locale.format(date,this.constraints);
if(this.filterString&&_182.toLowerCase().indexOf(this.filterString)!==0){
return null;
}
var div=dojo.create("div",{"class":this.baseClass+"Item"});
div.date=date;
div.index=_180;
dojo.create("div",{"class":this.baseClass+"ItemInner",innerHTML:_182},div);
if(_180%this._visibleIncrement<1&&_180%this._visibleIncrement>-1){
dojo.addClass(div,this.baseClass+"Marker");
}else{
if(!(_180%this._clickableIncrement)){
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
var _183=tgt.target.date||tgt.target.parentNode.date;
if(!_183||this.isDisabledDate(_183)){
return;
}
this._highlighted_option=null;
this.set("value",_183);
this.onChange(_183);
},onChange:function(time){
},_highlightOption:function(node,_184){
if(!node){
return;
}
if(_184){
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
dojo.toggleClass(node,this.baseClass+"ItemHover",_184);
if(dojo.hasClass(node,this.baseClass+"Marker")){
dojo.toggleClass(node,this.baseClass+"MarkerHover",_184);
}else{
dojo.toggleClass(node,this.baseClass+"TickHover",_184);
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
var _185=(dojo.isIE?e.wheelDelta:-e.detail);
this[(_185>0?"_onArrowUp":"_onArrowDown")]();
},_onArrowUp:function(_186){
if(typeof _186=="number"&&_186==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _187=this.timeMenu.childNodes[0].index;
var divs=this._getFilteredNodes(_187,1,true,this.timeMenu.childNodes[0]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
this.timeMenu.insertBefore(divs[0],this.timeMenu.childNodes[0]);
}
},_onArrowDown:function(_188){
if(typeof _188=="number"&&_188==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _189=this.timeMenu.childNodes[this.timeMenu.childNodes.length-1].index+1;
var divs=this._getFilteredNodes(_189,1,false,this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
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
var _18a=this.timeMenu,tgt=this._highlighted_option||dojo.query("."+this.baseClass+"ItemSelected",_18a)[0];
if(!tgt){
tgt=_18a.childNodes[0];
}else{
if(_18a.childNodes.length){
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
if(!dojo._hasResource["wm.base.widget.Editors._DateEditor"]){
dojo._hasResource["wm.base.widget.Editors._DateEditor"]=true;
dojo.provide("wm.base.widget.Editors._DateEditor");
dojo.declare("wm._DateEditor",wm._BaseEditor,{promptMessage:"",invalidMessage:"",minimum:"",maximum:"",format:"",dateEditorType:"DateTextBox",getEditorProps:function(_18b,_18c){
var _18d={};
if(this.minimum){
_18d.min=this.convertValue(this.minimum);
}
if(this.maximum){
_18d.max=this.convertValue(this.maximum);
}
var prop=dojo.mixin(this.inherited(arguments),{promptMessage:this.promptMessage,invalidMessage:this.invalidMessage||"$_unset_$",constraints:_18d,required:this.required,value:this.convertValue(this.owner.displayValue)},_18c||{});
if(this.format!=""){
prop.lang=this.format;
}
return prop;
},_createEditor:function(_18e,_18f){
if(this.dateEditorType=="DualCalendar"){
dojo["require"]("wm.base.components.DualCalendar");
return new wm.DualCalendar(this.getEditorProps(_18e,_18f));
}else{
if(this.dateEditorType=="IslamicDateTextbox"){
dojo["require"]("wm.base.components.IslamicDateTextbox");
return new wm.IslamicDateTextbox(this.getEditorProps(_18e,_18f));
}else{
return new dijit.form.DateTextBox(this.getEditorProps(_18e,_18f));
}
}
},convertValue:function(_190){
return wm.convertValueToDate(_190);
},getEditorValue:function(){
var d=this.inherited(arguments);
return d&&d.getTime()||this.makeEmptyValue();
},setEditorValue:function(_191){
this.inherited(arguments,[this.convertValue(_191)]);
}});
dojo.declare("wm._TimeEditor",wm._DateEditor,{timePattern:"HH:mm a",getEditorProps:function(_192,_193){
var prop=dojo.mixin(this.inherited(arguments),{constraints:{timePattern:this.timePattern}},_193||{});
return prop;
},convertValue:function(_194){
return wm.convertValueToDate(_194,{selector:"time"});
},_createEditor:function(_195,_196){
return new dijit.form.TimeTextBox(this.getEditorProps(_195,_196));
}});
wm.Object.extendSchema(wm._DateEditor,{changeOnKey:{ignore:1}});
wm.Object.extendSchema(wm._TimeEditor,{format:{ignore:1},timePattern:{options:["HH:mm","HH:mm:ss","HH:mm a","HH:mm:ss a"]}});
}
if(!dojo._hasResource["wm.base.widget.Editors._CheckBoxEditor"]){
dojo._hasResource["wm.base.widget.Editors._CheckBoxEditor"]=true;
dojo.provide("wm.base.widget.Editors._CheckBoxEditor");
dojo.declare("wm._CheckBoxEditor",wm._BaseEditor,{dataType:"string",startChecked:false,_hasReadonlyValue:false,_createEditor:function(_197,_198){
return new dijit.form.CheckBox(this.getEditorProps(_197,_198));
},setRequired:function(){
},connectEditor:function(){
this.inherited(arguments);
if(this.owner.captionLabel){
this.addEditorConnect(this.owner.captionLabel,"onclick",this,"captionClicked");
}
},styleEditor:function(){
this.inherited(arguments);
dojo.addClass(this.editor.domNode.parentNode,"wmeditor-cbeditor");
var n=this.owner.captionLabel.domNode;
if(n){
n.style.cursor="pointer";
dojo.setSelectable(n,false);
}
},sizeEditor:function(){
this.inherited(arguments);
this.editor.domNode.style.width="16px";
},renderBounds:function(){
this.inherited(arguments);
this.domNode.style.textAlign=(this.owner.captionPosition=="right")?"right":"";
},setInitialValue:function(){
this.owner.beginEditUpdate();
if(this.startChecked){
this.setChecked(true);
}
this.owner.endEditUpdate();
},getChecked:function(){
return Boolean(this.editor.checked);
},setChecked:function(_199){
this.editor.set("checked",_199);
},captionClicked:function(){
if(!this.owner.readonly&&!this.owner.disabled){
this.setChecked(!this.getChecked());
}
},getDisplayValue:function(){
return this.getTypedValue(this.owner.displayValue);
},setDisplayValue:function(_19a){
},getEditorValue:function(){
var c=this.editor&&this.editor.checked,v=this.getDisplayValue();
if(v===undefined){
v=this.getTypedValue(1);
}
return c?v:this.makeEmptyValue();
},getTypedValue:function(_19b){
var v=_19b;
switch(this.dataType){
case "string":
v=v||v===0?v:"";
return String(v);
case "number":
var n=Number(v);
return isNaN(n)?Number(Boolean(v)):n;
default:
return Boolean(v);
}
},setEditorValue:function(_19c){
if(_19c==null){
_19c=this.startChecked;
}
if(this.editor){
var t=(_19c===this.getDisplayValue()),f=(_19c===this.makeEmptyValue());
this._hasReadonlyValue=t||f;
this.editor.set("checked",t);
this.updateReadonlyValue();
}
},_getReadonlyValue:function(){
var v=this._hasReadonlyValue?this.getEditorValue():"";
return wm.capitalize(String(v));
},setReadonlyValue:function(){
if(!this.domNode){
return;
}
var v=this._hasReadonlyValue?this.getEditorValue():"";
var _19d=new dijit.form.CheckBox({},dojo.doc.createElement("div"));
_19d.set("checked",v);
_19d.set("disabled",true);
while(this.domNode.childNodes.length>0){
this.domNode.removeChild(this.domNode.childNodes[0]);
}
this.domNode.appendChild(_19d.domNode);
},setStartChecked:function(_19e){
this.startChecked=_19e;
this.createEditor();
},setDataType:function(_19f){
this.dataType=_19f;
if(_19f=="boolean"){
this.owner.displayValue=true;
}
}});
wm.Object.extendSchema(wm._CheckBoxEditor,{changeOnKey:{ignore:1},changeOnEnter:{ignore:1},dataType:{options:["string","boolean","number"]},startChecked:{bindable:1,type:"Boolean"},displayValue:{isOwnerProperty:1,ignore:1,writeonly:1,type:"any"},checkedValue:{isOwnerProperty:1,readonly:1,bindable:1,group:"edit",order:40,type:"any"},required:{ignore:1}});
}
if(!dojo._hasResource["wm.base.widget.Editors._RadioButtonEditor"]){
dojo._hasResource["wm.base.widget.Editors._RadioButtonEditor"]=true;
dojo.provide("wm.base.widget.Editors._RadioButtonEditor");
dojo.declare("wm._RadioButtonEditor",wm._CheckBoxEditor,{radioGroup:"",_createEditor:function(_1a0,_1a1){
return new dijit.form.RadioButton(this.getEditorProps(_1a0,_1a1));
},getEditorProps:function(_1a2,_1a3){
return dojo.mixin(this.inherited(arguments),{name:this.radioGroup},_1a3||{});
},captionClicked:function(){
if(!this.owner.readonly&&!this.owner.disabled){
this.setChecked(true);
}
},setEditorValue:function(){
this.inherited(arguments);
this.updateGroupValue();
},setRadioGroup:function(_1a4){
this.radioGroup=_1a4?wm.getValidJsName(_1a4):"";
var _1a5=this.getGroup();
if(_1a5.length){
this.dataType=_1a5[0].owner.dataType;
}
this.createEditor();
wm.fire(studio.inspector,"reinspect");
},getGroup:function(){
var _1a6=[];
var _1a7=dojo.query("input[type=radio][name="+this.radioGroup+"]");
_1a7.forEach(function(_1a8,_1a9,_1aa){
_1a6[_1a9]=dijit.getEnclosingWidget(_1a8);
});
return _1a6;
},updateGroupValue:function(){
var _1ab=this.getGroup(),gv=this.getGroupValue();
for(var i=0,v,o;(v=_1ab[i]);i++){
o=(v.owner||0).owner;
if(o){
o.groupValue=gv;
o.valueChanged("groupValue",gv);
}
}
},setGroupValue:function(_1ac){
var _1ad=this.getGroup();
for(var i=0,v;(v=_1ad[i]);i++){
if(v.owner.getDisplayValue()===_1ac){
if(!v.checked){
v.owner.setChecked(true);
}
return;
}
}
for(var i=0,v;(v=_1ad[i]);i++){
if(v.checked){
v.owner.setChecked(false);
return;
}
}
},getGroupValue:function(){
var _1ae=this.getGroup();
for(var i=0,v;(v=_1ae[i]);i++){
if(v.checked){
return v.owner.getEditorValue();
}
}
for(var i=0,v;(v=_1ae[i]);i++){
return v.owner.makeEmptyValue();
}
},isLoading:function(){
var l=this.inherited(arguments);
if(!l){
var _1af=this.getGroup();
for(var i=0,v,gl;(v=_1af[i]);i++){
gl=v.owner.owner._rendering;
if(gl){
return true;
}
}
}
return l;
},setDataType:function(_1b0){
var _1b1=this.getGroup();
for(var i=0,v;(v=_1b1[i]);i++){
v.owner.dataType=_1b0;
}
},setStartChecked:function(_1b2){
if(_1b2){
var _1b3=this.getGroup();
for(var i=0,v,r;(v=_1b3[i]);i++){
if(v.owner!=this){
v.owner.setStartChecked(false);
}
}
}
this.inherited(arguments);
},ownerEditorChanged:function(){
this.updateGroupValue();
}});
wm.Object.extendSchema(wm._RadioButtonEditor,{groupValue:{isOwnerProperty:1,ignore:1,bindable:1,type:"any",group:"edit",order:50}});
}
if(!dojo._hasResource["wm.base.widget.Editors._SelectEditor"]){
dojo._hasResource["wm.base.widget.Editors._SelectEditor"]=true;
dojo.provide("wm.base.widget.Editors._SelectEditor");
wm.selectDisplayTypes=["Text","Date","Time","Number","Currency"];
dojo.declare("wm._SelectEditor",wm._BaseEditor,{options:"",displayField:"",dataField:"",displayExpression:"",lookupDisplay:"Text",pageSize:20,allowNone:false,autoComplete:true,hasDownArrow:true,startUpdate:false,_allFields:"All Fields",restrictValues:true,init:function(){
this.inherited(arguments);
this.owner.selectedItem=new wm.Variable({name:"selectedItem",owner:this.owner});
},ownerLoaded:function(){
if(this.startUpdate){
this.update();
}
},update:function(){
if(this.dataSet instanceof wm.ServiceVariable){
var d=this.dataSet.update();
return d;
}
},generateStore:function(){
this._initDataProps();
var d=this._getData();
return new wm.base.data.SimpleStore(d,"name",this);
},getEditorProps:function(_1b4,_1b5){
var _1b6=this.generateStore();
return dojo.mixin(this.inherited(arguments),{required:this.required,store:_1b6,autoComplete:this.autoComplete,hasDownArrow:this.hasDownArrow,searchAttr:"name",pageSize:this.pageSize?this.pageSize+1:Infinity},_1b5||{});
},createEditor:function(){
var _1b7=this.inherited(arguments);
if(this.isReflowEnabled()){
this.renderBounds();
}
return _1b7;
},_createEditor:function(_1b8,_1b9){
if(this.restrictValues){
return new dijit.form.FilteringSelect(this.getEditorProps(_1b8,_1b9));
}else{
return new dijit.form.ComboBox(this.getEditorProps(_1b8,_1b9));
}
},setRestrictValues:function(_1ba){
var _1bb=this.getEditorValue();
var _1bc=this.restrictValues;
this.restrictValues=_1ba;
if(this.editor&&_1bc!=_1ba){
this.createEditor();
this.setEditorValue(_1bb);
}
if(!_1ba&&this.dataField==this._allFields){
this.dataField="";
}
},sizeEditor:function(){
this.inherited(arguments);
this.domNode.style.height="";
this.domNode.style.lineHeight="";
if(this.editor&&this.editor.domNode){
this.editor.domNode.style.height=this.getContentBounds().h+"px";
if(this.editor.downArrowNode){
this.editor.downArrowNode.style.height=this.editor.domNode.style.height;
if(this.editor.downArrowNode.childNodes.length==1){
this.editor.downArrowNode.childNodes[0].style.height=this.editor.domNode.style.height;
}
}
if(dojo.isIE&&dojo.isIE<8){
var n=dojo.query(".dijitArrowButtonInner",this.domNode)[0];
var h=dojo.coords(this.editor.domNode).h;
var s=n.style;
var c=dojo.coords(n);
s.position="relative";
s.top=Math.floor((h-c.h)/2)+"px";
}
}
},hasValues:function(){
return (this.editor&&this.editor.store.getCount());
},getStoreItem:function(_1bd,_1be){
if(!this.hasValues()){
return;
}
var _1bf,_1c0=function(item){
_1bf=item;
},_1c1={};
_1c1[_1be]=_1bd;
this.editor.store.fetch({query:_1c1,queryOptions:{exactMatch:true},count:1,onItem:_1c0});
return _1bf;
},isAllDataFields:function(){
return (this.dataField==this._allFields);
},setInitialValue:function(){
this.owner.beginEditUpdate();
this.owner.selectedItem.setType(this.dataSet instanceof wm.Variable?this.dataSet.type:"AnyData");
var _1c2=this.owner.dataValue,_1c3=this.owner.displayValue;
if(wm.propertyIsChanged(_1c2,"dataValue",wm.Editor)){
this.setEditorValue(_1c2);
}else{
this.setDisplayValue(_1c3);
}
this.owner.endEditUpdate();
},setDisplayValue:function(_1c4){
var i=this.getStoreItem(_1c4,"name");
if(i!==undefined){
this._setEditorValue(this.editor.store.getValue(i,"name"));
}else{
this.clear();
}
},setEditorValue:function(_1c5){
var i;
if(this.isAllDataFields()&&_1c5 instanceof wm.Variable){
var v=this._getDisplayData(_1c5);
i=this.getStoreItem(v,"name");
}else{
i=this.getStoreItem(_1c5,"value");
}
if(i!==undefined){
this._setEditorValue(this.editor.store.getValue(i,"name"));
}else{
if(this.restrictValues){
this.clear();
}else{
this.editor.set("value",_1c5);
}
}
this.updateReadonlyValue();
},_setEditorValue:function(_1c6){
_1c6=String(_1c6);
delete this._isValid;
var e=this.editor;
e._isvalid=true;
if(this.restrictValues){
e.set("displayedValue",_1c6);
}else{
e.set("value",_1c6);
}
},getDisplayValue:function(){
if(this.hasValues()){
return this.inherited(arguments);
}
},getEditorValue:function(){
var v;
if(this.editor&&this.hasValues()){
var _1c7=this.editor.get("value"),i=_1c7&&this.getStoreItem(_1c7,"name");
if(i){
v=this.editor.store.getValue(i,"value");
v=v instanceof wm.Variable?v.getData():v;
}
}
if(!this.restrictValues&&_1c7&&!v){
return _1c7;
}
return (v||v===0)?v:this.makeEmptyValue();
},setDataField:function(_1c8){
this.dataField=_1c8;
},setDisplayField:function(_1c9){
this.displayField=_1c9;
},_getFirstDataField:function(){
if(!this.dataSet){
return;
}
var _1ca=this.dataSet._dataSchema;
for(var i in _1ca){
var ti=_1ca[i];
if(!ti.isList&&!ti.isObject){
return i;
}
}
},_initDataProps:function(){
if(this.dataSet){
var ff=this._getFirstDataField();
this._displayField=this.displayField||ff||"name";
this._dataField=this.dataField||ff||("dataValue" in this.dataSet._dataSchema?"dataValue":"value");
}else{
if(this.options){
this._displayField=this._dataField="name";
}
}
},_getOptionsData:function(){
var data=[];
if(!this.options){
return data;
}
for(var i=0,opts=this.options.split(","),l=opts.length,d;i<l;i++){
d=dojo.string.trim(opts[i]);
if(d!=""){
data[i]={dataValue:d};
}
}
return data;
},_getDisplayData:function(_1cb){
var de=this.displayExpression,v=_1cb;
var _1cc="";
if(de){
return wm.expression.getValue(de,v);
}else{
if(this.lookupDisplay&&this.lookupDisplay!="Text"){
return this.formatData(v.getValue(this._displayField));
}else{
return v.getValue(this._displayField);
}
}
},formatData:function(_1cd){
try{
if(this.formatter){
return this.formatter.format(_1cd);
}else{
if(this.lookupDisplay){
var ctor=wm.getFormatter(this.lookupDisplay);
this.formatter=new ctor({name:"format",owner:this});
return this.formatter.format(_1cd);
}else{
return _1cd;
}
}
}
catch(e){
}
},_getDataSetData:function(){
var _1ce=this.dataSet,data=[],_1cf=this._dataField,af=this.isAllDataFields();
for(var i=0,c=_1ce.getCount(),v;i<c&&(v=_1ce.getItem(i));i++){
data.push({name:this._getDisplayData(v),value:af?v.getData():v.getValue(_1cf)});
}
return data;
},_getData:function(){
var data=[];
if(this.dataSet){
data=this._getDataSetData();
}else{
if(this.options){
this.setOptionsVariable();
data=this._getDataSetData();
}
}
if(this.allowNone){
var o={name:"",value:null};
data.unshift(o);
}
return data;
},setDataSet:function(_1d0){
var ds=this.dataSet=_1d0;
if(!ds||!ds.data||!ds.data.list){
return;
}
this.createEditor();
if(_1d0&&_1d0.type&&_1d0.type!="any"&&_1d0.type!=this.owner.selectedItem.type){
this.owner.selectedItem.setType(_1d0.type);
}
},setOptionsVariable:function(){
var opts=this._getOptionsData();
var ds=this.dataSet=new wm.Variable({name:"optionsVar",owner:this,type:"StringData"});
ds.setData(opts);
this.displayField="dataValue";
this.dataField="dataValue";
},setOptions:function(_1d1){
this.options=_1d1;
this.setOptionsVariable();
this.createEditor();
},setOptionSet:function(_1d2){
if(_1d2==null||_1d2==undefined||_1d2.length==0){
return;
}
var obj=_1d2[0];
var keys=[];
for(var key in obj){
keys.push(key);
}
var _1d3={};
_1d3.name=this.owner.name+"Var";
_1d3.owner=this;
_1d3.type="EntryData";
var ds=this.dataSet=new wm.Variable(_1d3);
var ds=this.dataSet=new wm.Variable(_1d3);
ds.setData(_1d2);
this.displayField=keys[0];
this.dataField=keys[1];
this.createEditor();
},isReady:function(){
return this.inherited(arguments)&&this.hasValues();
},clear:function(){
this.reset();
if(this.editor&&this.hasValues()){
if(this.restrictValues){
try{
this.editor.set("value","");
}
catch(e){
}
}else{
this.editor.set("value",undefined);
}
}
},ownerEditorChanged:function(){
this.updateSelectedItem();
},updateSelectedItem:function(){
var v=this.getEditorValue();
this.owner.selectedItem.setData(v);
}});
dojo.declare("wm._LookupEditor",wm._SelectEditor,{dataField:"All Fields",autoDataSet:true,startUpdate:true,init:function(){
this.inherited(arguments);
if(this.autoDataSet){
this.createDataSet();
}
},createDataSet:function(){
wm.fire(this.$.liveVariable,"destroy");
var pf=wm.getParentForm(this.owner);
var v=wm.getFormLiveView(pf);
if(v){
var ff=wm.getFormField(this.owner);
v.addRelated(ff);
var lv=this.dataSet=new wm.LiveVariable({name:"liveVariable",owner:this,autoUpdate:false,startUpdate:false,_rootField:ff,liveView:v});
this.owner.selectedItem.setType(this.dataSet.type);
this.createDataSetWire(lv);
}else{
if(pf){
var evt2=pf._getEditorBindSourceId(pf.getSourceId())+"-created";
this._subscriptions.push(dojo.subscribe(evt2,this,"_onSourceCreated"));
}
}
},_onSourceCreated:function(){
try{
this.createDataSet();
this.update();
}
catch(e){
}
},createDataSetWire:function(_1d4){
var w=this._dataSetWire=new wm.Wire({name:"dataFieldWire",target:this,owner:this,source:_1d4.getId(),targetProperty:"dataSet"});
w.connectWire();
},setAutoDataSet:function(_1d5){
this.autoDataSet=_1d5;
if(this.autoDataSet){
this.createDataSet();
this.update();
}
},_getFormSource:function(_1d6){
var w=wm.data.getPropWire(_1d6,"dataSet");
return w&&w.source&&this.getRoot().getValueById(w.source);
},changed:function(){
if(this.owner.isUpdating()){
return;
}
this.inherited(arguments);
var f=wm.getParentForm(this.owner);
var s=this._getFormSource(f);
if(s){
this.owner.beginEditUpdate();
var v=this.owner.dataValue;
if(this.autoDataSet){
var i=this.dataSet.getItemIndex(v);
if(i>=0){
this.dataSet.cursor=i;
}
}
s.setData(v);
this.owner.endEditUpdate();
wm.fire(f,"populateEditors");
}
}});
wm._SelectEditor.extend({updateNow:"(updateNow)",set_dataSet:function(_1d7){
if(_1d7&&!(_1d7 instanceof wm.Variable)){
var ds=this.getValueById(_1d7);
if(ds){
this.components.binding.addWire("","dataSet",ds.getId());
}
}else{
this.setDataSet(_1d7);
}
},_addFields:function(_1d8,_1d9){
for(var i in _1d9){
var ti=_1d9[i];
if(!(ti||0).isList&&!wm.typeManager.isStructuredType((ti||0).type)){
_1d8.push(i);
}
}
},_listFields:function(){
var list=[""];
var _1da=this.dataSet instanceof wm.LiveVariable?wm.typeManager.getTypeSchema(this.dataSet.type):(this.dataSet||0)._dataSchema;
var _1da=(this.dataSet||0)._dataSchema;
this._addFields(list,_1da);
return list;
},updateNow:function(){
return this.update();
}});
wm.Object.extendSchema(wm._SelectEditor,{changeOnKey:{ignore:1},changeOnEnter:{ignore:1},selectedItem:{ignore:true,isObject:true,bindSource:true,isOwnerProperty:1},dataSet:{readonly:true,group:"data",order:5,type:"wm.Variable",isList:true,bindTarget:true,editor:"wm.prop.DataSetSelect"},startUpdate:{group:"data",order:6},liveVariable:{ignore:1},formatter:{ignore:1},options:{group:"data",order:7},dataField:{group:"data",order:10,editor:"wm.prop.FieldSelect"},displayField:{group:"data",order:15,editor:"wm.prop.FieldSelect"},lookupDisplay:{group:"data",order:16,options:wm.selectDisplayTypes},displayExpression:{group:"data",order:20},hasDownArrow:{group:"editor",order:26},restrictValues:{type:"wm.Boolean",group:"data",order:40},pageSize:{order:0},updateNow:{group:"operation",operation:1},dataFieldWire:{ignore:1}});
wm._LookupEditor.extend({listProperties:function(){
var _1db=this.inherited(arguments);
_1db.dataSet.ignoretmp=this.autoDataSet;
_1db.dataSet.bindTarget=!_1db.dataSet.ignoretmp;
return _1db;
}});
wm.Object.extendSchema(wm._LookupEditor,{autoDataSet:{group:"data",order:3},options:{ignore:1},dataField:{ignore:1}});
}
dojo.i18n._preloadLocalizations("dojo.nls.wm_editors_old",["ROOT","ar","ca","cs","da","de","de-de","el","en","en-au","en-gb","en-us","es","es-es","fi","fi-fi","fr","fr-fr","he","he-il","hu","it","it-it","ja","ja-jp","ko","ko-kr","nb","nl","nl-nl","pl","pt","pt-br","pt-pt","ru","sk","sl","sv","th","tr","xx","zh","zh-cn","zh-tw"]);
