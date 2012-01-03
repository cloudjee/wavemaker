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

dojo.provide("wm.compressed.wm_dojo_grid");
if(!dojo._hasResource["dijit._Container"]){
dojo._hasResource["dijit._Container"]=true;
dojo.provide("dijit._Container");
dojo.declare("dijit._Container",null,{isContainer:true,buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_1,_2){
var _3=this.containerNode;
if(_2&&typeof _2=="number"){
var _4=this.getChildren();
if(_4&&_4.length>=_2){
_3=_4[_2-1].domNode;
_2="after";
}
}
dojo.place(_1.domNode,_3,_2);
if(this._started&&!_1._started){
_1.startup();
}
},removeChild:function(_5){
if(typeof _5=="number"){
_5=this.getChildren()[_5];
}
if(_5){
var _6=_5.domNode;
if(_6&&_6.parentNode){
_6.parentNode.removeChild(_6);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},destroyDescendants:function(_7){
dojo.forEach(this.getChildren(),function(_8){
_8.destroyRecursive(_7);
});
},_getSiblingOfChild:function(_9,_a){
var _b=_9.domNode,_c=(_a>0?"nextSibling":"previousSibling");
do{
_b=_b[_c];
}while(_b&&(_b.nodeType!=1||!dijit.byNode(_b)));
return _b&&dijit.byNode(_b);
},getIndexOfChild:function(_d){
return dojo.indexOf(this.getChildren(),_d);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_e){
_e.startup();
});
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit._Contained"]){
dojo._hasResource["dijit._Contained"]=true;
dojo.provide("dijit._Contained");
dojo.declare("dijit._Contained",null,{getParent:function(){
var _f=dijit.getEnclosingWidget(this.domNode.parentNode);
return _f&&_f.isContainer?_f:null;
},_getSibling:function(_10){
var _11=this.domNode;
do{
_11=_11[_10+"Sibling"];
}while(_11&&_11.nodeType!=1);
return _11&&dijit.byNode(_11);
},getPreviousSibling:function(){
return this._getSibling("previous");
},getNextSibling:function(){
return this._getSibling("next");
},getIndexInParent:function(){
var p=this.getParent();
if(!p||!p.getIndexOfChild){
return -1;
}
return p.getIndexOfChild(this);
}});
}
if(!dojo._hasResource["dijit.layout._LayoutWidget"]){
dojo._hasResource["dijit.layout._LayoutWidget"]=true;
dojo.provide("dijit.layout._LayoutWidget");
dojo.declare("dijit.layout._LayoutWidget",[dijit._Widget,dijit._Container,dijit._Contained],{baseClass:"dijitLayoutContainer",isLayoutContainer:true,buildRendering:function(){
this.inherited(arguments);
dojo.addClass(this.domNode,"dijitContainer");
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
var _12=this.getParent&&this.getParent();
if(!(_12&&_12.isLayoutContainer)){
this.resize();
this.connect(dojo.isIE?this.domNode:dojo.global,"onresize",function(){
this.resize();
});
}
},resize:function(_13,_14){
var _15=this.domNode;
if(_13){
dojo.marginBox(_15,_13);
if(_13.t){
_15.style.top=_13.t+"px";
}
if(_13.l){
_15.style.left=_13.l+"px";
}
}
var mb=_14||{};
dojo.mixin(mb,_13||{});
if(!("h" in mb)||!("w" in mb)){
mb=dojo.mixin(dojo.marginBox(_15),mb);
}
var cs=dojo.getComputedStyle(_15);
var me=dojo._getMarginExtents(_15,cs);
var be=dojo._getBorderExtents(_15,cs);
var bb=(this._borderBox={w:mb.w-(me.w+be.w),h:mb.h-(me.h+be.h)});
var pe=dojo._getPadExtents(_15,cs);
this._contentBox={l:dojo._toPixelValue(_15,cs.paddingLeft),t:dojo._toPixelValue(_15,cs.paddingTop),w:bb.w-pe.w,h:bb.h-pe.h};
this.layout();
},layout:function(){
},_setupChild:function(_16){
var cls=this.baseClass+"-child "+(_16.baseClass?this.baseClass+"-"+_16.baseClass:"");
dojo.addClass(_16.domNode,cls);
},addChild:function(_17,_18){
this.inherited(arguments);
if(this._started){
this._setupChild(_17);
}
},removeChild:function(_19){
var cls=this.baseClass+"-child"+(_19.baseClass?" "+this.baseClass+"-"+_19.baseClass:"");
dojo.removeClass(_19.domNode,cls);
this.inherited(arguments);
}});
dijit.layout.marginBox2contentBox=function(_1a,mb){
var cs=dojo.getComputedStyle(_1a);
var me=dojo._getMarginExtents(_1a,cs);
var pb=dojo._getPadBorderExtents(_1a,cs);
return {l:dojo._toPixelValue(_1a,cs.paddingLeft),t:dojo._toPixelValue(_1a,cs.paddingTop),w:mb.w-(me.w+pb.w),h:mb.h-(me.h+pb.h)};
};
(function(){
var _1b=function(_1c){
return _1c.substring(0,1).toUpperCase()+_1c.substring(1);
};
var _1d=function(_1e,dim){
var _1f=_1e.resize?_1e.resize(dim):dojo.marginBox(_1e.domNode,dim);
if(_1f){
dojo.mixin(_1e,_1f);
}else{
dojo.mixin(_1e,dojo.marginBox(_1e.domNode));
dojo.mixin(_1e,dim);
}
};
dijit.layout.layoutChildren=function(_20,dim,_21,_22,_23){
dim=dojo.mixin({},dim);
dojo.addClass(_20,"dijitLayoutContainer");
_21=dojo.filter(_21,function(_24){
return _24.region!="center"&&_24.layoutAlign!="client";
}).concat(dojo.filter(_21,function(_25){
return _25.region=="center"||_25.layoutAlign=="client";
}));
dojo.forEach(_21,function(_26){
var elm=_26.domNode,pos=(_26.region||_26.layoutAlign);
var _27=elm.style;
_27.left=dim.l+"px";
_27.top=dim.t+"px";
_27.position="absolute";
dojo.addClass(elm,"dijitAlign"+_1b(pos));
var _28={};
if(_22&&_22==_26.id){
_28[_26.region=="top"||_26.region=="bottom"?"h":"w"]=_23;
}
if(pos=="top"||pos=="bottom"){
_28.w=dim.w;
_1d(_26,_28);
dim.h-=_26.h;
if(pos=="top"){
dim.t+=_26.h;
}else{
_27.top=dim.t+dim.h+"px";
}
}else{
if(pos=="left"||pos=="right"){
_28.h=dim.h;
_1d(_26,_28);
dim.w-=_26.w;
if(pos=="left"){
dim.l+=_26.w;
}else{
_27.left=dim.l+dim.w+"px";
}
}else{
if(pos=="client"||pos=="center"){
_1d(_26,dim);
}
}
}
});
};
})();
}
if(!dojo._hasResource["dijit.dijit"]){
dojo._hasResource["dijit.dijit"]=true;
dojo.provide("dijit.dijit");
}
if(!dojo._hasResource["dijit._KeyNavContainer"]){
dojo._hasResource["dijit._KeyNavContainer"]=true;
dojo.provide("dijit._KeyNavContainer");
dojo.declare("dijit._KeyNavContainer",dijit._Container,{tabIndex:"0",_keyNavCodes:{},connectKeyNavHandlers:function(_29,_2a){
var _2b=(this._keyNavCodes={});
var _2c=dojo.hitch(this,this.focusPrev);
var _2d=dojo.hitch(this,this.focusNext);
dojo.forEach(_29,function(_2e){
_2b[_2e]=_2c;
});
dojo.forEach(_2a,function(_2f){
_2b[_2f]=_2d;
});
_2b[dojo.keys.HOME]=dojo.hitch(this,"focusFirstChild");
_2b[dojo.keys.END]=dojo.hitch(this,"focusLastChild");
this.connect(this.domNode,"onkeypress","_onContainerKeypress");
this.connect(this.domNode,"onfocus","_onContainerFocus");
},startupKeyNavChildren:function(){
dojo.forEach(this.getChildren(),dojo.hitch(this,"_startupChild"));
},addChild:function(_30,_31){
dijit._KeyNavContainer.superclass.addChild.apply(this,arguments);
this._startupChild(_30);
},focus:function(){
this.focusFirstChild();
},focusFirstChild:function(){
var _32=this._getFirstFocusableChild();
if(_32){
this.focusChild(_32);
}
},focusLastChild:function(){
var _33=this._getLastFocusableChild();
if(_33){
this.focusChild(_33);
}
},focusNext:function(){
var _34=this._getNextFocusableChild(this.focusedChild,1);
this.focusChild(_34);
},focusPrev:function(){
var _35=this._getNextFocusableChild(this.focusedChild,-1);
this.focusChild(_35,true);
},focusChild:function(_36,_37){
if(this.focusedChild&&_36!==this.focusedChild){
this._onChildBlur(this.focusedChild);
}
_36.set("tabIndex",this.tabIndex);
_36.focus(_37?"end":"start");
this._set("focusedChild",_36);
},_startupChild:function(_38){
_38.set("tabIndex","-1");
this.connect(_38,"_onFocus",function(){
_38.set("tabIndex",this.tabIndex);
});
this.connect(_38,"_onBlur",function(){
_38.set("tabIndex","-1");
});
},_onContainerFocus:function(evt){
if(evt.target!==this.domNode){
return;
}
this.focusFirstChild();
dojo.attr(this.domNode,"tabIndex","-1");
},_onBlur:function(evt){
if(this.tabIndex){
dojo.attr(this.domNode,"tabIndex",this.tabIndex);
}
this.inherited(arguments);
},_onContainerKeypress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
var _39=this._keyNavCodes[evt.charOrCode];
if(_39){
_39();
dojo.stopEvent(evt);
}
},_onChildBlur:function(_3a){
},_getFirstFocusableChild:function(){
return this._getNextFocusableChild(null,1);
},_getLastFocusableChild:function(){
return this._getNextFocusableChild(null,-1);
},_getNextFocusableChild:function(_3b,dir){
if(_3b){
_3b=this._getSiblingOfChild(_3b,dir);
}
var _3c=this.getChildren();
for(var i=0;i<_3c.length;i++){
if(!_3b){
_3b=_3c[(dir>0)?0:(_3c.length-1)];
}
if(_3b.isFocusable()){
return _3b;
}
_3b=this._getSiblingOfChild(_3b,dir);
}
return null;
}});
}
if(!dojo._hasResource["dijit.MenuItem"]){
dojo._hasResource["dijit.MenuItem"]=true;
dojo.provide("dijit.MenuItem");
dojo.declare("dijit.MenuItem",[dijit._Widget,dijit._Templated,dijit._Contained,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/MenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n"),attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{label:{node:"containerNode",type:"innerHTML"},iconClass:{node:"iconNode",type:"class"}}),baseClass:"dijitMenuItem",label:"",iconClass:"",accelKey:"",disabled:false,_fillContent:function(_3d){
if(_3d&&!("label" in this.params)){
this.set("label",_3d.innerHTML);
}
},buildRendering:function(){
this.inherited(arguments);
var _3e=this.id+"_text";
dojo.attr(this.containerNode,"id",_3e);
if(this.accelKeyNode){
dojo.attr(this.accelKeyNode,"id",this.id+"_accel");
_3e+=" "+this.id+"_accel";
}
dijit.setWaiState(this.domNode,"labelledby",_3e);
dojo.setSelectable(this.domNode,false);
},_onHover:function(){
this.getParent().onItemHover(this);
},_onUnhover:function(){
this.getParent().onItemUnhover(this);
this._set("hovering",false);
},_onClick:function(evt){
this.getParent().onItemClick(this,evt);
dojo.stopEvent(evt);
},onClick:function(evt){
},focus:function(){
try{
if(dojo.isIE==8){
this.containerNode.focus();
}
dijit.focus(this.focusNode);
}
catch(e){
}
},_onFocus:function(){
this._setSelected(true);
this.getParent()._onItemFocus(this);
this.inherited(arguments);
},_setSelected:function(_3f){
dojo.toggleClass(this.domNode,"dijitMenuItemSelected",_3f);
},setLabel:function(_40){
dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_40);
},setDisabled:function(_41){
dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");
this.set("disabled",_41);
},_setDisabledAttr:function(_42){
dijit.setWaiState(this.focusNode,"disabled",_42?"true":"false");
this._set("disabled",_42);
},_setAccelKeyAttr:function(_43){
this.accelKeyNode.style.display=_43?"":"none";
this.accelKeyNode.innerHTML=_43;
dojo.attr(this.containerNode,"colSpan",_43?"1":"2");
this._set("accelKey",_43);
}});
}
if(!dojo._hasResource["dijit.PopupMenuItem"]){
dojo._hasResource["dijit.PopupMenuItem"]=true;
dojo.provide("dijit.PopupMenuItem");
dojo.declare("dijit.PopupMenuItem",dijit.MenuItem,{_fillContent:function(){
if(this.srcNodeRef){
var _44=dojo.query("*",this.srcNodeRef);
dijit.PopupMenuItem.superclass._fillContent.call(this,_44[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(!this.popup){
var _45=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.popup=dijit.byNode(_45);
}
dojo.body().appendChild(this.popup.domNode);
this.popup.startup();
this.popup.domNode.style.display="none";
if(this.arrowWrapper){
dojo.style(this.arrowWrapper,"visibility","");
}
dijit.setWaiState(this.focusNode,"haspopup","true");
},destroyDescendants:function(){
if(this.popup){
if(!this.popup._destroyed){
this.popup.destroyRecursive();
}
delete this.popup;
}
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit.CheckedMenuItem"]){
dojo._hasResource["dijit.CheckedMenuItem"]=true;
dojo.provide("dijit.CheckedMenuItem");
dojo.declare("dijit.CheckedMenuItem",dijit.MenuItem,{templateString:dojo.cache("dijit","templates/CheckedMenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\n</tr>\n"),checked:false,_setCheckedAttr:function(_46){
dojo.toggleClass(this.domNode,"dijitCheckedMenuItemChecked",_46);
dijit.setWaiState(this.domNode,"checked",_46);
this._set("checked",_46);
},onChange:function(_47){
},_onClick:function(e){
if(!this.disabled){
this.set("checked",!this.checked);
this.onChange(this.checked);
}
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit.MenuSeparator"]){
dojo._hasResource["dijit.MenuSeparator"]=true;
dojo.provide("dijit.MenuSeparator");
dojo.declare("dijit.MenuSeparator",[dijit._Widget,dijit._Templated,dijit._Contained],{templateString:dojo.cache("dijit","templates/MenuSeparator.html","<tr class=\"dijitMenuSeparator\">\n\t<td class=\"dijitMenuSeparatorIconCell\">\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n</tr>\n"),buildRendering:function(){
this.inherited(arguments);
dojo.setSelectable(this.domNode,false);
},isFocusable:function(){
return false;
}});
}
if(!dojo._hasResource["dijit.Menu"]){
dojo._hasResource["dijit.Menu"]=true;
dojo.provide("dijit.Menu");
dojo.declare("dijit._MenuBase",[dijit._Widget,dijit._Templated,dijit._KeyNavContainer],{parentMenu:null,popupDelay:500,startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_48){
_48.startup();
});
this.startupKeyNavChildren();
this.inherited(arguments);
},onExecute:function(){
},onCancel:function(_49){
},_moveToPopup:function(evt){
if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){
this.focusedChild._onClick(evt);
}else{
var _4a=this._getTopMenu();
if(_4a&&_4a._isMenuBar){
_4a.focusNext();
}
}
},_onPopupHover:function(evt){
if(this.currentPopup&&this.currentPopup._pendingClose_timer){
var _4b=this.currentPopup.parentMenu;
if(_4b.focusedChild){
_4b.focusedChild._setSelected(false);
}
_4b.focusedChild=this.currentPopup.from_item;
_4b.focusedChild._setSelected(true);
this._stopPendingCloseTimer(this.currentPopup);
}
},onItemHover:function(_4c){
if(this.isActive||this.openOnHover){
this.focusChild(_4c);
if(this.openOnHover||(this.focusedChild.popup&&!this.focusedChild.disabled&&!this.hover_timer)){
this.hover_timer=setTimeout(dojo.hitch(this,"_openPopup"),this.popupDelay);
}
}
if(this.focusedChild){
this.focusChild(_4c);
}
this._hoveredChild=_4c;
},_onChildBlur:function(_4d){
this._stopPopupTimer();
_4d._setSelected(false);
var _4e=_4d.popup;
if(_4e){
this._stopPendingCloseTimer(_4e);
_4e._pendingClose_timer=setTimeout(function(){
_4e._pendingClose_timer=null;
if(_4e.parentMenu){
_4e.parentMenu.currentPopup=null;
}
dijit.popup.close(_4e);
},this.popupDelay);
}
},onItemUnhover:function(_4f){
if(this.isActive){
this._stopPopupTimer();
}
if(this._hoveredChild==_4f){
this._hoveredChild=null;
}
},_stopPopupTimer:function(){
if(this.hover_timer){
clearTimeout(this.hover_timer);
this.hover_timer=null;
}
},_stopPendingCloseTimer:function(_50){
if(_50._pendingClose_timer){
clearTimeout(_50._pendingClose_timer);
_50._pendingClose_timer=null;
}
},_stopFocusTimer:function(){
if(this._focus_timer){
clearTimeout(this._focus_timer);
this._focus_timer=null;
}
},_getTopMenu:function(){
for(var top=this;top.parentMenu;top=top.parentMenu){
}
return top;
},onItemClick:function(_51,evt){
if(typeof this.isShowingNow=="undefined"){
this._markActive();
}
this.focusChild(_51);
if(_51.disabled){
return false;
}
if(_51.popup){
this._openPopup();
}else{
this.onExecute();
_51.onClick(evt);
}
},_openPopup:function(){
this._stopPopupTimer();
var _52=this.focusedChild;
if(!_52){
return;
}
var _53=_52.popup;
if(_53.isShowingNow){
return;
}
if(this.currentPopup){
this._stopPendingCloseTimer(this.currentPopup);
dijit.popup.close(this.currentPopup);
}
_53.parentMenu=this;
_53.from_item=_52;
var _54=this;
dijit.popup.open({parent:this,popup:_53,around:_52.domNode,orient:this._orient||(this.isLeftToRight()?{"TR":"TL","TL":"TR","BR":"BL","BL":"BR"}:{"TL":"TR","TR":"TL","BL":"BR","BR":"BL"}),onCancel:function(){
_54.focusChild(_52);
_54._cleanUp();
_52._setSelected(true);
_54.focusedChild=_52;
},onExecute:dojo.hitch(this,"_cleanUp")});
this.currentPopup=_53;
_53.connect(_53.domNode,"onmouseenter",dojo.hitch(_54,"_onPopupHover"));
if(_53.focus){
_53._focus_timer=setTimeout(dojo.hitch(_53,function(){
this._focus_timer=null;
this.focus();
}),0);
}
},_markActive:function(){
this.isActive=true;
dojo.replaceClass(this.domNode,"dijitMenuActive","dijitMenuPassive");
},onOpen:function(e){
this.isShowingNow=true;
this._markActive();
},_markInactive:function(){
this.isActive=false;
dojo.replaceClass(this.domNode,"dijitMenuPassive","dijitMenuActive");
},onClose:function(){
this._stopFocusTimer();
this._markInactive();
this.isShowingNow=false;
this.parentMenu=null;
},_closeChild:function(){
this._stopPopupTimer();
var _55=this.focusedChild&&this.focusedChild.from_item;
if(this.currentPopup){
if(dijit._curFocus&&dojo.isDescendant(dijit._curFocus,this.currentPopup.domNode)){
this.focusedChild.focusNode.focus();
}
dijit.popup.close(this.currentPopup);
this.currentPopup=null;
}
if(this.focusedChild){
this.focusedChild._setSelected(false);
this.focusedChild._onUnhover();
this.focusedChild=null;
}
},_onItemFocus:function(_56){
if(this._hoveredChild&&this._hoveredChild!=_56){
this._hoveredChild._onUnhover();
}
},_onBlur:function(){
this._cleanUp();
this.inherited(arguments);
},_cleanUp:function(){
this._closeChild();
if(typeof this.isShowingNow=="undefined"){
this._markInactive();
}
}});
dojo.declare("dijit.Menu",dijit._MenuBase,{constructor:function(){
this._bindings=[];
},templateString:dojo.cache("dijit","templates/Menu.html","<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\" dojoAttachEvent=\"onkeypress:_onKeyPress\" cellspacing=\"0\">\n\t<tbody class=\"dijitReset\" dojoAttachPoint=\"containerNode\"></tbody>\n</table>\n"),baseClass:"dijitMenu",targetNodeIds:[],contextMenuForWindow:false,leftClickToOpen:false,refocus:true,postCreate:function(){
if(this.contextMenuForWindow){
this.bindDomNode(dojo.body());
}else{
dojo.forEach(this.targetNodeIds,this.bindDomNode,this);
}
var k=dojo.keys,l=this.isLeftToRight();
this._openSubMenuKey=l?k.RIGHT_ARROW:k.LEFT_ARROW;
this._closeSubMenuKey=l?k.LEFT_ARROW:k.RIGHT_ARROW;
this.connectKeyNavHandlers([k.UP_ARROW],[k.DOWN_ARROW]);
},_onKeyPress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
switch(evt.charOrCode){
case this._openSubMenuKey:
this._moveToPopup(evt);
dojo.stopEvent(evt);
break;
case this._closeSubMenuKey:
if(this.parentMenu){
if(this.parentMenu._isMenuBar){
this.parentMenu.focusPrev();
}else{
this.onCancel(false);
}
}else{
dojo.stopEvent(evt);
}
break;
}
},_iframeContentWindow:function(_57){
var win=dojo.window.get(this._iframeContentDocument(_57))||this._iframeContentDocument(_57)["__parent__"]||(_57.name&&dojo.doc.frames[_57.name])||null;
return win;
},_iframeContentDocument:function(_58){
var doc=_58.contentDocument||(_58.contentWindow&&_58.contentWindow.document)||(_58.name&&dojo.doc.frames[_58.name]&&dojo.doc.frames[_58.name].document)||null;
return doc;
},bindDomNode:function(_59){
_59=dojo.byId(_59);
var cn;
if(_59.tagName.toLowerCase()=="iframe"){
var _5a=_59,win=this._iframeContentWindow(_5a);
cn=dojo.withGlobal(win,dojo.body);
}else{
cn=(_59==dojo.body()?dojo.doc.documentElement:_59);
}
var _5b={node:_59,iframe:_5a};
dojo.attr(_59,"_dijitMenu"+this.id,this._bindings.push(_5b));
var _5c=dojo.hitch(this,function(cn){
return [dojo.connect(cn,this.leftClickToOpen?"onclick":"oncontextmenu",this,function(evt){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_5a,{x:evt.pageX,y:evt.pageY});
}),dojo.connect(cn,"onkeydown",this,function(evt){
if(evt.shiftKey&&evt.keyCode==dojo.keys.F10){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_5a);
}
})];
});
_5b.connects=cn?_5c(cn):[];
if(_5a){
_5b.onloadHandler=dojo.hitch(this,function(){
var win=this._iframeContentWindow(_5a);
cn=dojo.withGlobal(win,dojo.body);
_5b.connects=_5c(cn);
});
if(_5a.addEventListener){
_5a.addEventListener("load",_5b.onloadHandler,false);
}else{
_5a.attachEvent("onload",_5b.onloadHandler);
}
}
},unBindDomNode:function(_5d){
var _5e;
try{
_5e=dojo.byId(_5d);
}
catch(e){
return;
}
var _5f="_dijitMenu"+this.id;
if(_5e&&dojo.hasAttr(_5e,_5f)){
var bid=dojo.attr(_5e,_5f)-1,b=this._bindings[bid];
dojo.forEach(b.connects,dojo.disconnect);
var _60=b.iframe;
if(_60){
if(_60.removeEventListener){
_60.removeEventListener("load",b.onloadHandler,false);
}else{
_60.detachEvent("onload",b.onloadHandler);
}
}
dojo.removeAttr(_5e,_5f);
delete this._bindings[bid];
}
},_scheduleOpen:function(_61,_62,_63){
if(!this._openTimer){
this._openTimer=setTimeout(dojo.hitch(this,function(){
delete this._openTimer;
this._openMyself({target:_61,iframe:_62,coords:_63});
}),1);
}
},_openMyself:function(_64){
var _65=_64.target,_66=_64.iframe,_67=_64.coords;
if(_67){
if(_66){
var od=_65.ownerDocument,ifc=dojo.position(_66,true),win=this._iframeContentWindow(_66),_68=dojo.withGlobal(win,"_docScroll",dojo);
var cs=dojo.getComputedStyle(_66),tp=dojo._toPixelValue,_69=(dojo.isIE&&dojo.isQuirks?0:tp(_66,cs.paddingLeft))+(dojo.isIE&&dojo.isQuirks?tp(_66,cs.borderLeftWidth):0),top=(dojo.isIE&&dojo.isQuirks?0:tp(_66,cs.paddingTop))+(dojo.isIE&&dojo.isQuirks?tp(_66,cs.borderTopWidth):0);
_67.x+=ifc.x+_69-_68.x;
_67.y+=ifc.y+top-_68.y;
}
}else{
_67=dojo.position(_65,true);
_67.x+=10;
_67.y+=10;
}
var _6a=this;
var _6b=dijit.getFocus(this);
function _6c(){
if(_6a.refocus){
dijit.focus(_6b);
}
dijit.popup.close(_6a);
};
dijit.popup.open({popup:this,x:_67.x,y:_67.y,onExecute:_6c,onCancel:_6c,orient:this.isLeftToRight()?"L":"R"});
this.focus();
this._onBlur=function(){
this.inherited("_onBlur",arguments);
dijit.popup.close(this);
};
},uninitialize:function(){
dojo.forEach(this._bindings,function(b){
if(b){
this.unBindDomNode(b.node);
}
},this);
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dojox.html.metrics"]){
dojo._hasResource["dojox.html.metrics"]=true;
dojo.provide("dojox.html.metrics");
(function(){
var dhm=dojox.html.metrics;
dhm.getFontMeasurements=function(){
var _6d={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
if(dojo.isIE){
dojo.doc.documentElement.style.fontSize="100%";
}
var div=dojo.doc.createElement("div");
var ds=div.style;
ds.position="absolute";
ds.left="-100px";
ds.top="0";
ds.width="30px";
ds.height="1000em";
ds.borderWidth="0";
ds.margin="0";
ds.padding="0";
ds.outline="0";
ds.lineHeight="1";
ds.overflow="hidden";
dojo.body().appendChild(div);
for(var p in _6d){
ds.fontSize=p;
_6d[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;
}
dojo.body().removeChild(div);
div=null;
return _6d;
};
var _6e=null;
dhm.getCachedFontMeasurements=function(_6f){
if(_6f||!_6e){
_6e=dhm.getFontMeasurements();
}
return _6e;
};
var _70=null,_71={};
dhm.getTextBox=function(_72,_73,_74){
var m,s;
if(!_70){
m=_70=dojo.doc.createElement("div");
var c=dojo.doc.createElement("div");
c.appendChild(m);
s=c.style;
s.overflow="scroll";
s.position="absolute";
s.left="0px";
s.top="-10000px";
s.width="1px";
s.height="1px";
s.visibility="hidden";
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
dojo.body().appendChild(c);
}else{
m=_70;
}
m.className="";
s=m.style;
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
if(arguments.length>1&&_73){
for(var i in _73){
if(i in _71){
continue;
}
s[i]=_73[i];
}
}
if(arguments.length>2&&_74){
m.className=_74;
}
m.innerHTML=_72;
var box=dojo.position(m);
box.w=m.parentNode.scrollWidth;
return box;
};
var _75={w:16,h:16};
dhm.getScrollbar=function(){
return {w:_75.w,h:_75.h};
};
dhm._fontResizeNode=null;
dhm.initOnFontResize=function(_76){
var f=dhm._fontResizeNode=dojo.doc.createElement("iframe");
var fs=f.style;
fs.position="absolute";
fs.width="5em";
fs.height="10em";
fs.top="-10000px";
if(dojo.isIE){
f.onreadystatechange=function(){
if(f.contentWindow.document.readyState=="complete"){
f.onresize=f.contentWindow.parent[dojox._scopeName].html.metrics._fontresize;
}
};
}else{
f.onload=function(){
f.contentWindow.onresize=f.contentWindow.parent[dojox._scopeName].html.metrics._fontresize;
};
}
f.setAttribute("src","javascript:'<html><head><script>if(\"loadFirebugConsole\" in window){window.loadFirebugConsole();}</script></head><body></body></html>'");
dojo.body().appendChild(f);
dhm.initOnFontResize=function(){
};
};
dhm.onFontResize=function(){
};
dhm._fontresize=function(){
dhm.onFontResize();
};
dojo.addOnUnload(function(){
var f=dhm._fontResizeNode;
if(f){
if(dojo.isIE&&f.onresize){
f.onresize=null;
}else{
if(f.contentWindow&&f.contentWindow.onresize){
f.contentWindow.onresize=null;
}
}
dhm._fontResizeNode=null;
}
});
dojo.addOnLoad(function(){
try{
var n=dojo.doc.createElement("div");
n.style.cssText="top:0;left:0;width:100px;height:100px;overflow:scroll;position:absolute;visibility:hidden;";
dojo.body().appendChild(n);
_75.w=n.offsetWidth-n.clientWidth;
_75.h=n.offsetHeight-n.clientHeight;
dojo.body().removeChild(n);
delete n;
}
catch(e){
}
if("fontSizeWatch" in dojo.config&&!!dojo.config.fontSizeWatch){
dhm.initOnFontResize();
}
});
})();
}
if(!dojo._hasResource["dojox.grid.util"]){
dojo._hasResource["dojox.grid.util"]=true;
dojo.provide("dojox.grid.util");
(function(){
var dgu=dojox.grid.util;
dgu.na="...";
dgu.rowIndexTag="gridRowIndex";
dgu.gridViewTag="gridView";
dgu.fire=function(ob,ev,_77){
var fn=ob&&ev&&ob[ev];
return fn&&(_77?fn.apply(ob,_77):ob[ev]());
};
dgu.setStyleHeightPx=function(_78,_79){
if(_79>=0){
var s=_78.style;
var v=_79+"px";
if(_78&&s["height"]!=v){
s["height"]=v;
}
}
};
dgu.mouseEvents=["mouseover","mouseout","mousedown","mouseup","click","dblclick","contextmenu"];
dgu.keyEvents=["keyup","keydown","keypress"];
dgu.funnelEvents=function(_7a,_7b,_7c,_7d){
var _7e=(_7d?_7d:dgu.mouseEvents.concat(dgu.keyEvents));
for(var i=0,l=_7e.length;i<l;i++){
_7b.connect(_7a,"on"+_7e[i],_7c);
}
};
dgu.removeNode=function(_7f){
_7f=dojo.byId(_7f);
_7f&&_7f.parentNode&&_7f.parentNode.removeChild(_7f);
return _7f;
};
dgu.arrayCompare=function(inA,inB){
for(var i=0,l=inA.length;i<l;i++){
if(inA[i]!=inB[i]){
return false;
}
}
return (inA.length==inB.length);
};
dgu.arrayInsert=function(_80,_81,_82){
if(_80.length<=_81){
_80[_81]=_82;
}else{
_80.splice(_81,0,_82);
}
};
dgu.arrayRemove=function(_83,_84){
_83.splice(_84,1);
};
dgu.arraySwap=function(_85,inI,inJ){
var _86=_85[inI];
_85[inI]=_85[inJ];
_85[inJ]=_86;
};
})();
}
if(!dojo._hasResource["dojox.grid._Scroller"]){
dojo._hasResource["dojox.grid._Scroller"]=true;
dojo.provide("dojox.grid._Scroller");
(function(){
var _87=function(_88){
var i=0,n,p=_88.parentNode;
while((n=p.childNodes[i++])){
if(n==_88){
return i-1;
}
}
return -1;
};
var _89=function(_8a){
if(!_8a){
return;
}
var _8b=function(inW){
return inW.domNode&&dojo.isDescendant(inW.domNode,_8a,true);
};
var ws=dijit.registry.filter(_8b);
for(var i=0,w;(w=ws[i]);i++){
w.destroy();
}
delete ws;
};
var _8c=function(_8d){
var _8e=dojo.byId(_8d);
return (_8e&&_8e.tagName?_8e.tagName.toLowerCase():"");
};
var _8f=function(_90,_91){
var _92=[];
var i=0,n;
while((n=_90.childNodes[i])){
i++;
if(_8c(n)==_91){
_92.push(n);
}
}
return _92;
};
var _93=function(_94){
return _8f(_94,"div");
};
dojo.declare("dojox.grid._Scroller",null,{constructor:function(_95){
this.setContentNodes(_95);
this.pageHeights=[];
this.pageNodes=[];
this.stack=[];
},rowCount:0,defaultRowHeight:32,keepRows:100,contentNode:null,scrollboxNode:null,defaultPageHeight:0,keepPages:10,pageCount:0,windowHeight:0,firstVisibleRow:0,lastVisibleRow:0,averageRowHeight:0,page:0,pageTop:0,init:function(_96,_97,_98){
switch(arguments.length){
case 3:
this.rowsPerPage=_98;
case 2:
this.keepRows=_97;
case 1:
this.rowCount=_96;
default:
break;
}
this.defaultPageHeight=this.defaultRowHeight*this.rowsPerPage;
this.pageCount=this._getPageCount(this.rowCount,this.rowsPerPage);
this.setKeepInfo(this.keepRows);
this.invalidate();
if(this.scrollboxNode){
this.scrollboxNode.scrollTop=0;
this.scroll(0);
this.scrollboxNode.onscroll=dojo.hitch(this,"onscroll");
}
},_getPageCount:function(_99,_9a){
return _99?(Math.ceil(_99/_9a)||1):0;
},destroy:function(){
this.invalidateNodes();
delete this.contentNodes;
delete this.contentNode;
delete this.scrollboxNode;
},setKeepInfo:function(_9b){
this.keepRows=_9b;
this.keepPages=!this.keepRows?this.keepPages:Math.max(Math.ceil(this.keepRows/this.rowsPerPage),2);
},setContentNodes:function(_9c){
this.contentNodes=_9c;
this.colCount=(this.contentNodes?this.contentNodes.length:0);
this.pageNodes=[];
for(var i=0;i<this.colCount;i++){
this.pageNodes[i]=[];
}
},getDefaultNodes:function(){
return this.pageNodes[0]||[];
},invalidate:function(){
this._invalidating=true;
this.invalidateNodes();
this.pageHeights=[];
this.height=(this.pageCount?(this.pageCount-1)*this.defaultPageHeight+this.calcLastPageHeight():0);
this.resize();
this._invalidating=false;
},updateRowCount:function(_9d){
this.invalidateNodes();
this.rowCount=_9d;
var _9e=this.pageCount;
if(_9e===0){
this.height=1;
}
this.pageCount=this._getPageCount(this.rowCount,this.rowsPerPage);
if(this.pageCount<_9e){
for(var i=_9e-1;i>=this.pageCount;i--){
this.height-=this.getPageHeight(i);
delete this.pageHeights[i];
}
}else{
if(this.pageCount>_9e){
this.height+=this.defaultPageHeight*(this.pageCount-_9e-1)+this.calcLastPageHeight();
}
}
this.resize();
},pageExists:function(_9f){
return Boolean(this.getDefaultPageNode(_9f));
},measurePage:function(_a0){
if(this.grid.rowHeight){
var _a1=this.grid.rowHeight+1;
return ((_a0+1)*this.rowsPerPage>this.rowCount?this.rowCount-_a0*this.rowsPerPage:this.rowsPerPage)*_a1;
}
var n=this.getDefaultPageNode(_a0);
return (n&&n.innerHTML)?n.offsetHeight:undefined;
},positionPage:function(_a2,_a3){
for(var i=0;i<this.colCount;i++){
this.pageNodes[i][_a2].style.top=_a3+"px";
}
},repositionPages:function(_a4){
var _a5=this.getDefaultNodes();
var _a6=0;
for(var i=0;i<this.stack.length;i++){
_a6=Math.max(this.stack[i],_a6);
}
var n=_a5[_a4];
var y=(n?this.getPageNodePosition(n)+this.getPageHeight(_a4):0);
for(var p=_a4+1;p<=_a6;p++){
n=_a5[p];
if(n){
if(this.getPageNodePosition(n)==y){
return;
}
this.positionPage(p,y);
}
y+=this.getPageHeight(p);
}
},installPage:function(_a7){
for(var i=0;i<this.colCount;i++){
this.contentNodes[i].appendChild(this.pageNodes[i][_a7]);
}
},preparePage:function(_a8,_a9){
var p=(_a9?this.popPage():null);
for(var i=0;i<this.colCount;i++){
var _aa=this.pageNodes[i];
var _ab=(p===null?this.createPageNode():this.invalidatePageNode(p,_aa));
_ab.pageIndex=_a8;
_aa[_a8]=_ab;
}
},renderPage:function(_ac){
var _ad=[];
var i,j;
for(i=0;i<this.colCount;i++){
_ad[i]=this.pageNodes[i][_ac];
}
for(i=0,j=_ac*this.rowsPerPage;(i<this.rowsPerPage)&&(j<this.rowCount);i++,j++){
this.renderRow(j,_ad);
}
},removePage:function(_ae){
for(var i=0,j=_ae*this.rowsPerPage;i<this.rowsPerPage;i++,j++){
this.removeRow(j);
}
},destroyPage:function(_af){
for(var i=0;i<this.colCount;i++){
var n=this.invalidatePageNode(_af,this.pageNodes[i]);
if(n){
dojo.destroy(n);
}
}
},pacify:function(_b0){
},pacifying:false,pacifyTicks:200,setPacifying:function(_b1){
if(this.pacifying!=_b1){
this.pacifying=_b1;
this.pacify(this.pacifying);
}
},startPacify:function(){
this.startPacifyTicks=new Date().getTime();
},doPacify:function(){
var _b2=(new Date().getTime()-this.startPacifyTicks)>this.pacifyTicks;
this.setPacifying(true);
this.startPacify();
return _b2;
},endPacify:function(){
this.setPacifying(false);
},resize:function(){
if(this.scrollboxNode){
this.windowHeight=this.scrollboxNode.clientHeight;
}
for(var i=0;i<this.colCount;i++){
dojox.grid.util.setStyleHeightPx(this.contentNodes[i],Math.max(1,this.height));
}
var _b3=(!this._invalidating);
if(!_b3){
var ah=this.grid.get("autoHeight");
if(typeof ah=="number"&&ah<=Math.min(this.rowsPerPage,this.rowCount)){
_b3=true;
}
}
if(_b3){
this.needPage(this.page,this.pageTop);
}
var _b4=(this.page<this.pageCount-1)?this.rowsPerPage:((this.rowCount%this.rowsPerPage)||this.rowsPerPage);
var _b5=this.getPageHeight(this.page);
this.averageRowHeight=(_b5>0&&_b4>0)?(_b5/_b4):0;
},calcLastPageHeight:function(){
if(!this.pageCount){
return 0;
}
var _b6=this.pageCount-1;
var _b7=((this.rowCount%this.rowsPerPage)||(this.rowsPerPage))*this.defaultRowHeight;
this.pageHeights[_b6]=_b7;
return _b7;
},updateContentHeight:function(_b8){
this.height+=_b8;
this.resize();
},updatePageHeight:function(_b9,_ba,_bb){
if(this.pageExists(_b9)){
var oh=this.getPageHeight(_b9);
var h=(this.measurePage(_b9));
if(h===undefined){
h=oh;
}
this.pageHeights[_b9]=h;
if(oh!=h){
this.updateContentHeight(h-oh);
var ah=this.grid.get("autoHeight");
if((typeof ah=="number"&&ah>this.rowCount)||(ah===true&&!_ba)){
if(!_bb){
this.grid.sizeChange();
}else{
var ns=this.grid.viewsNode.style;
ns.height=parseInt(ns.height)+h-oh+"px";
this.repositionPages(_b9);
}
}else{
this.repositionPages(_b9);
}
}
return h;
}
return 0;
},rowHeightChanged:function(_bc,_bd){
this.updatePageHeight(Math.floor(_bc/this.rowsPerPage),false,_bd);
},invalidateNodes:function(){
while(this.stack.length){
this.destroyPage(this.popPage());
}
},createPageNode:function(){
var p=document.createElement("div");
dojo.attr(p,"role","presentation");
p.style.position="absolute";
p.style[dojo._isBodyLtr()?"left":"right"]="0";
return p;
},getPageHeight:function(_be){
var ph=this.pageHeights[_be];
return (ph!==undefined?ph:this.defaultPageHeight);
},pushPage:function(_bf){
return this.stack.push(_bf);
},popPage:function(){
return this.stack.shift();
},findPage:function(_c0){
var i=0,h=0;
for(var ph=0;i<this.pageCount;i++,h+=ph){
ph=this.getPageHeight(i);
if(h+ph>=_c0){
break;
}
}
this.page=i;
this.pageTop=h;
},buildPage:function(_c1,_c2,_c3){
this.preparePage(_c1,_c2);
this.positionPage(_c1,_c3);
this.installPage(_c1);
this.renderPage(_c1);
this.pushPage(_c1);
},needPage:function(_c4,_c5){
var h=this.getPageHeight(_c4),oh=h;
if(!this.pageExists(_c4)){
this.buildPage(_c4,(!this.grid._autoHeight&&this.keepPages&&(this.stack.length>=this.keepPages)),_c5);
h=this.updatePageHeight(_c4,true);
}else{
this.positionPage(_c4,_c5);
}
return h;
},onscroll:function(){
this.scroll(this.scrollboxNode.scrollTop);
},scroll:function(_c6){
this.grid.scrollTop=_c6;
if(this.colCount){
this.startPacify();
this.findPage(_c6);
var h=this.height;
var b=this.getScrollBottom(_c6);
for(var p=this.page,y=this.pageTop;(p<this.pageCount)&&((b<0)||(y<b));p++){
y+=this.needPage(p,y);
}
this.firstVisibleRow=this.getFirstVisibleRow(this.page,this.pageTop,_c6);
this.lastVisibleRow=this.getLastVisibleRow(p-1,y,b);
if(h!=this.height){
this.repositionPages(p-1);
}
this.endPacify();
}
},getScrollBottom:function(_c7){
return (this.windowHeight>=0?_c7+this.windowHeight:-1);
},processNodeEvent:function(e,_c8){
var t=e.target;
while(t&&(t!=_c8)&&t.parentNode&&(t.parentNode.parentNode!=_c8)){
t=t.parentNode;
}
if(!t||!t.parentNode||(t.parentNode.parentNode!=_c8)){
return false;
}
var _c9=t.parentNode;
e.topRowIndex=_c9.pageIndex*this.rowsPerPage;
e.rowIndex=e.topRowIndex+_87(t);
e.rowTarget=t;
return true;
},processEvent:function(e){
return this.processNodeEvent(e,this.contentNode);
},renderRow:function(_ca,_cb){
},removeRow:function(_cc){
},getDefaultPageNode:function(_cd){
return this.getDefaultNodes()[_cd];
},positionPageNode:function(_ce,_cf){
},getPageNodePosition:function(_d0){
return _d0.offsetTop;
},invalidatePageNode:function(_d1,_d2){
var p=_d2[_d1];
if(p){
delete _d2[_d1];
this.removePage(_d1,p);
_89(p);
p.innerHTML="";
}
return p;
},getPageRow:function(_d3){
return _d3*this.rowsPerPage;
},getLastPageRow:function(_d4){
return Math.min(this.rowCount,this.getPageRow(_d4+1))-1;
},getFirstVisibleRow:function(_d5,_d6,_d7){
if(!this.pageExists(_d5)){
return 0;
}
var row=this.getPageRow(_d5);
var _d8=this.getDefaultNodes();
var _d9=_93(_d8[_d5]);
for(var i=0,l=_d9.length;i<l&&_d6<_d7;i++,row++){
_d6+=_d9[i].offsetHeight;
}
return (row?row-1:row);
},getLastVisibleRow:function(_da,_db,_dc){
if(!this.pageExists(_da)){
return 0;
}
var _dd=this.getDefaultNodes();
var row=this.getLastPageRow(_da);
var _de=_93(_dd[_da]);
for(var i=_de.length-1;i>=0&&_db>_dc;i--,row--){
_db-=_de[i].offsetHeight;
}
return row+1;
},findTopRow:function(_df){
var _e0=this.getDefaultNodes();
var _e1=_93(_e0[this.page]);
for(var i=0,l=_e1.length,t=this.pageTop,h;i<l;i++){
h=_e1[i].offsetHeight;
t+=h;
if(t>=_df){
this.offset=h-(t-_df);
return i+this.page*this.rowsPerPage;
}
}
return -1;
},findScrollTop:function(_e2){
var _e3=Math.floor(_e2/this.rowsPerPage);
var t=0;
var i,l;
for(i=0;i<_e3;i++){
t+=this.getPageHeight(i);
}
this.pageTop=t;
this.page=_e3;
this.needPage(_e3,this.pageTop);
var _e4=this.getDefaultNodes();
var _e5=_93(_e4[_e3]);
var r=_e2-this.rowsPerPage*_e3;
for(i=0,l=_e5.length;i<l&&i<r;i++){
t+=_e5[i].offsetHeight;
}
return t;
},dummy:0});
})();
}
if(!dojo._hasResource["dojox.grid.cells._base"]){
dojo._hasResource["dojox.grid.cells._base"]=true;
dojo.provide("dojox.grid.cells._base");
dojo.declare("dojox.grid._DeferredTextWidget",dijit._Widget,{deferred:null,_destroyOnRemove:true,postCreate:function(){
if(this.deferred){
this.deferred.addBoth(dojo.hitch(this,function(_e6){
if(this.domNode){
this.domNode.innerHTML=_e6;
}
}));
}
}});
(function(){
var _e7=function(_e8){
try{
dojox.grid.util.fire(_e8,"focus");
dojox.grid.util.fire(_e8,"select");
}
catch(e){
}
};
var _e9=function(){
setTimeout(dojo.hitch.apply(dojo,arguments),0);
};
var dgc=dojox.grid.cells;
dojo.declare("dojox.grid.cells._Base",null,{styles:"",classes:"",editable:false,alwaysEditing:false,formatter:null,defaultValue:"...",value:null,hidden:false,noresize:false,draggable:true,_valueProp:"value",_formatPending:false,constructor:function(_ea){
this._props=_ea||{};
dojo.mixin(this,_ea);
if(this.draggable===undefined){
this.draggable=true;
}
},_defaultFormat:function(_eb,_ec){
var s=this.grid.formatterScope||this;
var f=this.formatter;
if(f&&s&&typeof f=="string"){
f=this.formatter=s[f];
}
var v=(_eb!=this.defaultValue&&f)?f.apply(s,_ec):_eb;
if(typeof v=="undefined"){
return this.defaultValue;
}
if(v&&v.addBoth){
v=new dojox.grid._DeferredTextWidget({deferred:v},dojo.create("span",{innerHTML:this.defaultValue}));
}
if(v&&v.declaredClass&&v.startup){
return "<div class='dojoxGridStubNode' linkWidget='"+v.id+"' cellIdx='"+this.index+"'>"+this.defaultValue+"</div>";
}
return v;
},format:function(_ed,_ee){
var f,i=this.grid.edit.info,d=this.get?this.get(_ed,_ee):(this.value||this.defaultValue);
d=(d&&d.replace&&this.grid.escapeHTMLInData)?d.replace(/&/g,"&amp;").replace(/</g,"&lt;"):d;
if(this.editable&&(this.alwaysEditing||(i.rowIndex==_ed&&i.cell==this))){
return this.formatEditing(d,_ed);
}else{
return this._defaultFormat(d,[d,_ed,this]);
}
},formatEditing:function(_ef,_f0){
},getNode:function(_f1){
return this.view.getCellNode(_f1,this.index);
},getHeaderNode:function(){
return this.view.getHeaderCellNode(this.index);
},getEditNode:function(_f2){
return (this.getNode(_f2)||0).firstChild||0;
},canResize:function(){
var uw=this.unitWidth;
return uw&&(uw!=="auto");
},isFlex:function(){
var uw=this.unitWidth;
return uw&&dojo.isString(uw)&&(uw=="auto"||uw.slice(-1)=="%");
},applyEdit:function(_f3,_f4){
this.grid.edit.applyCellEdit(_f3,this,_f4);
},cancelEdit:function(_f5){
this.grid.doCancelEdit(_f5);
},_onEditBlur:function(_f6){
if(this.grid.edit.isEditCell(_f6,this.index)){
this.grid.edit.apply();
}
},registerOnBlur:function(_f7,_f8){
if(this.commitOnBlur){
dojo.connect(_f7,"onblur",function(e){
setTimeout(dojo.hitch(this,"_onEditBlur",_f8),250);
});
}
},needFormatNode:function(_f9,_fa){
this._formatPending=true;
_e9(this,"_formatNode",_f9,_fa);
},cancelFormatNode:function(){
this._formatPending=false;
},_formatNode:function(_fb,_fc){
if(this._formatPending){
this._formatPending=false;
dojo.setSelectable(this.grid.domNode,true);
this.formatNode(this.getEditNode(_fc),_fb,_fc);
}
},formatNode:function(_fd,_fe,_ff){
if(dojo.isIE){
_e9(this,"focus",_ff,_fd);
}else{
this.focus(_ff,_fd);
}
},dispatchEvent:function(m,e){
if(m in this){
return this[m](e);
}
},getValue:function(_100){
return this.getEditNode(_100)[this._valueProp];
},setValue:function(_101,_102){
var n=this.getEditNode(_101);
if(n){
n[this._valueProp]=_102;
}
},focus:function(_103,_104){
_e7(_104||this.getEditNode(_103));
},save:function(_105){
this.value=this.value||this.getValue(_105);
},restore:function(_106){
this.setValue(_106,this.value);
},_finish:function(_107){
dojo.setSelectable(this.grid.domNode,false);
this.cancelFormatNode();
},apply:function(_108){
this.applyEdit(this.getValue(_108),_108);
this._finish(_108);
},cancel:function(_109){
this.cancelEdit(_109);
this._finish(_109);
}});
dgc._Base.markupFactory=function(node,_10a){
var d=dojo;
var _10b=d.trim(d.attr(node,"formatter")||"");
if(_10b){
_10a.formatter=dojo.getObject(_10b)||_10b;
}
var get=d.trim(d.attr(node,"get")||"");
if(get){
_10a.get=dojo.getObject(get);
}
var _10c=function(attr,cell,_10d){
var _10e=d.trim(d.attr(node,attr)||"");
if(_10e){
cell[_10d||attr]=!(_10e.toLowerCase()=="false");
}
};
_10c("sortDesc",_10a);
_10c("editable",_10a);
_10c("alwaysEditing",_10a);
_10c("noresize",_10a);
_10c("draggable",_10a);
var _10f=d.trim(d.attr(node,"loadingText")||d.attr(node,"defaultValue")||"");
if(_10f){
_10a.defaultValue=_10f;
}
var _110=function(attr,cell,_111){
var _112=d.trim(d.attr(node,attr)||"")||undefined;
if(_112){
cell[_111||attr]=_112;
}
};
_110("styles",_10a);
_110("headerStyles",_10a);
_110("cellStyles",_10a);
_110("classes",_10a);
_110("headerClasses",_10a);
_110("cellClasses",_10a);
};
dojo.declare("dojox.grid.cells.Cell",dgc._Base,{constructor:function(){
this.keyFilter=this.keyFilter;
},keyFilter:null,formatEditing:function(_113,_114){
this.needFormatNode(_113,_114);
return "<input class=\"dojoxGridInput\" type=\"text\" value=\""+_113+"\">";
},formatNode:function(_115,_116,_117){
this.inherited(arguments);
this.registerOnBlur(_115,_117);
},doKey:function(e){
if(this.keyFilter){
var key=String.fromCharCode(e.charCode);
if(key.search(this.keyFilter)==-1){
dojo.stopEvent(e);
}
}
},_finish:function(_118){
this.inherited(arguments);
var n=this.getEditNode(_118);
try{
dojox.grid.util.fire(n,"blur");
}
catch(e){
}
}});
dgc.Cell.markupFactory=function(node,_119){
dgc._Base.markupFactory(node,_119);
var d=dojo;
var _11a=d.trim(d.attr(node,"keyFilter")||"");
if(_11a){
_119.keyFilter=new RegExp(_11a);
}
};
dojo.declare("dojox.grid.cells.RowIndex",dgc.Cell,{name:"Row",postscript:function(){
this.editable=false;
},get:function(_11b){
return _11b+1;
}});
dgc.RowIndex.markupFactory=function(node,_11c){
dgc.Cell.markupFactory(node,_11c);
};
dojo.declare("dojox.grid.cells.Select",dgc.Cell,{options:null,values:null,returnIndex:-1,constructor:function(_11d){
this.values=this.values||this.options;
},formatEditing:function(_11e,_11f){
this.needFormatNode(_11e,_11f);
var h=["<select class=\"dojoxGridSelect\">"];
for(var i=0,o,v;((o=this.options[i])!==undefined)&&((v=this.values[i])!==undefined);i++){
h.push("<option",(_11e==v?" selected":"")," value=\""+v+"\"",">",o,"</option>");
}
h.push("</select>");
return h.join("");
},getValue:function(_120){
var n=this.getEditNode(_120);
if(n){
var i=n.selectedIndex,o=n.options[i];
return this.returnIndex>-1?i:o.value||o.innerHTML;
}
}});
dgc.Select.markupFactory=function(node,cell){
dgc.Cell.markupFactory(node,cell);
var d=dojo;
var _121=d.trim(d.attr(node,"options")||"");
if(_121){
var o=_121.split(",");
if(o[0]!=_121){
cell.options=o;
}
}
var _122=d.trim(d.attr(node,"values")||"");
if(_122){
var v=_122.split(",");
if(v[0]!=_122){
cell.values=v;
}
}
};
dojo.declare("dojox.grid.cells.AlwaysEdit",dgc.Cell,{alwaysEditing:true,_formatNode:function(_123,_124){
this.formatNode(this.getEditNode(_124),_123,_124);
},applyStaticValue:function(_125){
var e=this.grid.edit;
e.applyCellEdit(this.getValue(_125),this,_125);
e.start(this,_125,true);
}});
dgc.AlwaysEdit.markupFactory=function(node,cell){
dgc.Cell.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.Bool",dgc.AlwaysEdit,{_valueProp:"checked",formatEditing:function(_126,_127){
return "<input class=\"dojoxGridInput\" type=\"checkbox\""+(_126?" checked=\"checked\"":"")+" style=\"width: auto\" />";
},doclick:function(e){
if(e.target.tagName=="INPUT"){
this.applyStaticValue(e.rowIndex);
}
}});
dgc.Bool.markupFactory=function(node,cell){
dgc.AlwaysEdit.markupFactory(node,cell);
};
})();
}
if(!dojo._hasResource["dojox.grid.cells"]){
dojo._hasResource["dojox.grid.cells"]=true;
dojo.provide("dojox.grid.cells");
}
if(!dojo._hasResource["dojox.grid._Builder"]){
dojo._hasResource["dojox.grid._Builder"]=true;
dojo.provide("dojox.grid._Builder");
(function(){
var dg=dojox.grid;
var _128=function(td){
return td.cellIndex>=0?td.cellIndex:dojo.indexOf(td.parentNode.cells,td);
};
var _129=function(tr){
return tr.rowIndex>=0?tr.rowIndex:dojo.indexOf(tr.parentNode.childNodes,tr);
};
var _12a=function(_12b,_12c){
return _12b&&((_12b.rows||0)[_12c]||_12b.childNodes[_12c]);
};
var _12d=function(node){
for(var n=node;n&&n.tagName!="TABLE";n=n.parentNode){
}
return n;
};
var _12e=function(_12f,_130){
for(var n=_12f;n&&_130(n);n=n.parentNode){
}
return n;
};
var _131=function(_132){
var name=_132.toUpperCase();
return function(node){
return node.tagName!=name;
};
};
var _133=dojox.grid.util.rowIndexTag;
var _134=dojox.grid.util.gridViewTag;
dg._Builder=dojo.extend(function(view){
if(view){
this.view=view;
this.grid=view.grid;
}
},{view:null,_table:"<table class=\"dojoxGridRowTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"",getTableArray:function(){
var html=[this._table];
if(this.view.viewWidth){
html.push([" style=\"width:",this.view.viewWidth,";\""].join(""));
}
html.push(">");
return html;
},generateCellMarkup:function(_135,_136,_137,_138){
var _139=[],html;
if(_138){
var _13a=_135.index!=_135.grid.getSortIndex()?"":_135.grid.sortInfo>0?"aria-sort=\"ascending\"":"aria-sort=\"descending\"";
if(!_135.id){
_135.id=this.grid.id+"Hdr"+_135.index;
}
html=["<th tabIndex=\"-1\" aria-readonly=\"true\" role=\"columnheader\"",_13a,"id=\"",_135.id,"\""];
}else{
var _13b=this.grid.editable&&!_135.editable?"aria-readonly=\"true\"":"";
html=["<td tabIndex=\"-1\" role=\"gridcell\"",_13b];
}
if(_135.colSpan){
html.push(" colspan=\"",_135.colSpan,"\"");
}
if(_135.rowSpan){
html.push(" rowspan=\"",_135.rowSpan,"\"");
}
html.push(" class=\"dojoxGridCell ");
if(_135.classes){
html.push(_135.classes," ");
}
if(_137){
html.push(_137," ");
}
_139.push(html.join(""));
_139.push("");
html=["\" idx=\"",_135.index,"\" style=\""];
if(_136&&_136[_136.length-1]!=";"){
_136+=";";
}
html.push(_135.styles,_136||"",_135.hidden?"display:none;":"");
if(_135.unitWidth){
html.push("width:",_135.unitWidth,";");
}
_139.push(html.join(""));
_139.push("");
html=["\""];
if(_135.attrs){
html.push(" ",_135.attrs);
}
html.push(">");
_139.push(html.join(""));
_139.push("");
_139.push(_138?"</th>":"</td>");
return _139;
},isCellNode:function(_13c){
return Boolean(_13c&&_13c!=dojo.doc&&dojo.attr(_13c,"idx"));
},getCellNodeIndex:function(_13d){
return _13d?Number(dojo.attr(_13d,"idx")):-1;
},getCellNode:function(_13e,_13f){
for(var i=0,row;((row=_12a(_13e.firstChild,i))&&row.cells);i++){
for(var j=0,cell;(cell=row.cells[j]);j++){
if(this.getCellNodeIndex(cell)==_13f){
return cell;
}
}
}
return null;
},findCellTarget:function(_140,_141){
var n=_140;
while(n&&(!this.isCellNode(n)||(n.offsetParent&&_134 in n.offsetParent.parentNode&&n.offsetParent.parentNode[_134]!=this.view.id))&&(n!=_141)){
n=n.parentNode;
}
return n!=_141?n:null;
},baseDecorateEvent:function(e){
e.dispatch="do"+e.type;
e.grid=this.grid;
e.sourceView=this.view;
e.cellNode=this.findCellTarget(e.target,e.rowNode);
e.cellIndex=this.getCellNodeIndex(e.cellNode);
e.cell=(e.cellIndex>=0?this.grid.getCell(e.cellIndex):null);
},findTarget:function(_142,_143){
var n=_142;
while(n&&(n!=this.domNode)&&(!(_143 in n)||(_134 in n&&n[_134]!=this.view.id))){
n=n.parentNode;
}
return (n!=this.domNode)?n:null;
},findRowTarget:function(_144){
return this.findTarget(_144,_133);
},isIntraNodeEvent:function(e){
try{
return (e.cellNode&&e.relatedTarget&&dojo.isDescendant(e.relatedTarget,e.cellNode));
}
catch(x){
return false;
}
},isIntraRowEvent:function(e){
try{
var row=e.relatedTarget&&this.findRowTarget(e.relatedTarget);
return !row&&(e.rowIndex==-1)||row&&(e.rowIndex==row.gridRowIndex);
}
catch(x){
return false;
}
},dispatchEvent:function(e){
if(e.dispatch in this){
return this[e.dispatch](e);
}
return false;
},domouseover:function(e){
if(e.cellNode&&(e.cellNode!=this.lastOverCellNode)){
this.lastOverCellNode=e.cellNode;
this.grid.onMouseOver(e);
}
this.grid.onMouseOverRow(e);
},domouseout:function(e){
if(e.cellNode&&(e.cellNode==this.lastOverCellNode)&&!this.isIntraNodeEvent(e,this.lastOverCellNode)){
this.lastOverCellNode=null;
this.grid.onMouseOut(e);
if(!this.isIntraRowEvent(e)){
this.grid.onMouseOutRow(e);
}
}
},domousedown:function(e){
if(e.cellNode){
this.grid.onMouseDown(e);
}
this.grid.onMouseDownRow(e);
}});
dg._ContentBuilder=dojo.extend(function(view){
dg._Builder.call(this,view);
},dg._Builder.prototype,{update:function(){
this.prepareHtml();
},prepareHtml:function(){
var _145=this.grid.get,_146=this.view.structure.cells;
for(var j=0,row;(row=_146[j]);j++){
for(var i=0,cell;(cell=row[i]);i++){
cell.get=cell.get||(cell.value==undefined)&&_145;
cell.markup=this.generateCellMarkup(cell,cell.cellStyles,cell.cellClasses,false);
if(!this.grid.editable&&cell.editable){
this.grid.editable=true;
}
}
}
},generateHtml:function(_147,_148){
var html=this.getTableArray(),v=this.view,_149=v.structure.cells,item=this.grid.getItem(_148);
dojox.grid.util.fire(this.view,"onBeforeRow",[_148,_149]);
for(var j=0,row;(row=_149[j]);j++){
if(row.hidden||row.header){
continue;
}
html.push(!row.invisible?"<tr>":"<tr class=\"dojoxGridInvisible\">");
for(var i=0,cell,m,cc,cs;(cell=row[i]);i++){
m=cell.markup;
cc=cell.customClasses=[];
cs=cell.customStyles=[];
m[5]=cell.format(_148,item);
m[1]=cc.join(" ");
m[3]=cs.join(";");
html.push.apply(html,m);
}
html.push("</tr>");
}
html.push("</table>");
return html.join("");
},decorateEvent:function(e){
e.rowNode=this.findRowTarget(e.target);
if(!e.rowNode){
return false;
}
e.rowIndex=e.rowNode[_133];
this.baseDecorateEvent(e);
e.cell=this.grid.getCell(e.cellIndex);
dojo.IEGridEvent=e;
return true;
}});
dg._HeaderBuilder=dojo.extend(function(view){
this.moveable=null;
dg._Builder.call(this,view);
},dg._Builder.prototype,{_skipBogusClicks:false,overResizeWidth:4,minColWidth:1,update:function(){
if(this.tableMap){
this.tableMap.mapRows(this.view.structure.cells);
}else{
this.tableMap=new dg._TableMap(this.view.structure.cells);
}
},generateHtml:function(_14a,_14b){
var html=this.getTableArray(),_14c=this.view.structure.cells;
dojox.grid.util.fire(this.view,"onBeforeRow",[-1,_14c]);
for(var j=0,row;(row=_14c[j]);j++){
if(row.hidden){
continue;
}
html.push(!row.invisible?"<tr>":"<tr class=\"dojoxGridInvisible\">");
for(var i=0,cell,_14d;(cell=row[i]);i++){
cell.customClasses=[];
cell.customStyles=[];
if(this.view.simpleStructure){
if(cell.draggable){
if(cell.headerClasses){
if(cell.headerClasses.indexOf("dojoDndItem")==-1){
cell.headerClasses+=" dojoDndItem";
}
}else{
cell.headerClasses="dojoDndItem";
}
}
if(cell.attrs){
if(cell.attrs.indexOf("dndType='gridColumn_")==-1){
cell.attrs+=" dndType='gridColumn_"+this.grid.id+"'";
}
}else{
cell.attrs="dndType='gridColumn_"+this.grid.id+"'";
}
}
_14d=this.generateCellMarkup(cell,cell.headerStyles,cell.headerClasses,true);
_14d[5]=(_14b!=undefined?_14b:_14a(cell));
_14d[3]=cell.customStyles.join(";");
_14d[1]=cell.customClasses.join(" ");
html.push(_14d.join(""));
}
html.push("</tr>");
}
html.push("</table>");
return html.join("");
},getCellX:function(e){
var n,x=e.layerX;
if(dojo.isMoz||dojo.isIE>=9){
n=_12e(e.target,_131("th"));
x-=(n&&n.offsetLeft)||0;
var t=e.sourceView.getScrollbarWidth();
if(!dojo._isBodyLtr()){
table=_12e(n,_131("table"));
x-=(table&&table.offsetLeft)||0;
}
}
n=_12e(e.target,function(){
if(!n||n==e.cellNode){
return false;
}
x+=(n.offsetLeft<0?0:n.offsetLeft);
return true;
});
return x;
},decorateEvent:function(e){
this.baseDecorateEvent(e);
e.rowIndex=-1;
e.cellX=this.getCellX(e);
return true;
},prepareResize:function(e,mod){
do{
var i=_128(e.cellNode);
e.cellNode=(i?e.cellNode.parentNode.cells[i+mod]:null);
e.cellIndex=(e.cellNode?this.getCellNodeIndex(e.cellNode):-1);
}while(e.cellNode&&e.cellNode.style.display=="none");
return Boolean(e.cellNode);
},canResize:function(e){
if(!e.cellNode||e.cellNode.colSpan>1){
return false;
}
var cell=this.grid.getCell(e.cellIndex);
return !cell.noresize&&cell.canResize();
},overLeftResizeArea:function(e){
if(dojo.hasClass(dojo.body(),"dojoDndMove")){
return false;
}
if(dojo.isIE){
var tN=e.target;
if(dojo.hasClass(tN,"dojoxGridArrowButtonNode")||dojo.hasClass(tN,"dojoxGridArrowButtonChar")){
return false;
}
}
if(dojo._isBodyLtr()){
return (e.cellIndex>0)&&(e.cellX>0&&e.cellX<this.overResizeWidth)&&this.prepareResize(e,-1);
}
var t=e.cellNode&&(e.cellX>0&&e.cellX<this.overResizeWidth);
return t;
},overRightResizeArea:function(e){
if(dojo.hasClass(dojo.body(),"dojoDndMove")){
return false;
}
if(dojo.isIE){
var tN=e.target;
if(dojo.hasClass(tN,"dojoxGridArrowButtonNode")||dojo.hasClass(tN,"dojoxGridArrowButtonChar")){
return false;
}
}
if(dojo._isBodyLtr()){
return e.cellNode&&(e.cellX>=e.cellNode.offsetWidth-this.overResizeWidth);
}
return (e.cellIndex>0)&&(e.cellX>=e.cellNode.offsetWidth-this.overResizeWidth)&&this.prepareResize(e,-1);
},domousemove:function(e){
if(!this.moveable){
var c=(this.overRightResizeArea(e)?"dojoxGridColResize":(this.overLeftResizeArea(e)?"dojoxGridColResize":""));
if(c&&!this.canResize(e)){
c="dojoxGridColNoResize";
}
dojo.toggleClass(e.sourceView.headerNode,"dojoxGridColNoResize",(c=="dojoxGridColNoResize"));
dojo.toggleClass(e.sourceView.headerNode,"dojoxGridColResize",(c=="dojoxGridColResize"));
if(dojo.isIE){
var t=e.sourceView.headerNode.scrollLeft;
e.sourceView.headerNode.scrollLeft=t;
}
if(c){
dojo.stopEvent(e);
}
}
},domousedown:function(e){
if(!this.moveable){
if((this.overRightResizeArea(e)||this.overLeftResizeArea(e))&&this.canResize(e)){
this.beginColumnResize(e);
}else{
this.grid.onMouseDown(e);
this.grid.onMouseOverRow(e);
}
}
},doclick:function(e){
if(this._skipBogusClicks){
dojo.stopEvent(e);
return true;
}
return false;
},colResizeSetup:function(e,_14e){
var _14f=dojo.contentBox(e.sourceView.headerNode);
if(_14e){
this.lineDiv=document.createElement("div");
var vw=(dojo.position||dojo._abs)(e.sourceView.headerNode,true);
var _150=dojo.contentBox(e.sourceView.domNode);
var l=e.pageX;
if(!dojo._isBodyLtr()&&dojo.isIE<8){
l-=dojox.html.metrics.getScrollbar().w;
}
dojo.style(this.lineDiv,{top:vw.y+"px",left:l+"px",height:(_150.h+_14f.h)+"px"});
dojo.addClass(this.lineDiv,"dojoxGridResizeColLine");
this.lineDiv._origLeft=l;
dojo.body().appendChild(this.lineDiv);
}
var _151=[],_152=this.tableMap.findOverlappingNodes(e.cellNode);
for(var i=0,cell;(cell=_152[i]);i++){
_151.push({node:cell,index:this.getCellNodeIndex(cell),width:cell.offsetWidth});
}
var view=e.sourceView;
var adj=dojo._isBodyLtr()?1:-1;
var _153=e.grid.views.views;
var _154=[];
for(var j=view.idx+adj,_155;(_155=_153[j]);j=j+adj){
_154.push({node:_155.headerNode,left:window.parseInt(_155.headerNode.style.left)});
}
var _156=view.headerContentNode.firstChild;
var drag={scrollLeft:e.sourceView.headerNode.scrollLeft,view:view,node:e.cellNode,index:e.cellIndex,w:dojo.contentBox(e.cellNode).w,vw:_14f.w,table:_156,tw:dojo.contentBox(_156).w,spanners:_151,followers:_154};
return drag;
},beginColumnResize:function(e){
this.moverDiv=document.createElement("div");
dojo.style(this.moverDiv,{position:"absolute",left:0});
dojo.body().appendChild(this.moverDiv);
dojo.addClass(this.grid.domNode,"dojoxGridColumnResizing");
var m=(this.moveable=new dojo.dnd.Moveable(this.moverDiv));
var drag=this.colResizeSetup(e,true);
m.onMove=dojo.hitch(this,"doResizeColumn",drag);
dojo.connect(m,"onMoveStop",dojo.hitch(this,function(){
this.endResizeColumn(drag);
if(drag.node.releaseCapture){
drag.node.releaseCapture();
}
this.moveable.destroy();
delete this.moveable;
this.moveable=null;
dojo.removeClass(this.grid.domNode,"dojoxGridColumnResizing");
}));
if(e.cellNode.setCapture){
e.cellNode.setCapture();
}
m.onMouseDown(e);
},doResizeColumn:function(_157,_158,_159){
var _15a=_159.l;
var data={deltaX:_15a,w:_157.w+(dojo._isBodyLtr()?_15a:-_15a),vw:_157.vw+_15a,tw:_157.tw+_15a};
this.dragRecord={inDrag:_157,mover:_158,leftTop:_159};
if(data.w>=this.minColWidth){
if(!_158){
this.doResizeNow(_157,data);
}else{
dojo.style(this.lineDiv,"left",(this.lineDiv._origLeft+data.deltaX)+"px");
}
}
},endResizeColumn:function(_15b){
if(this.dragRecord){
var _15c=this.dragRecord.leftTop;
var _15d=dojo._isBodyLtr()?_15c.l:-_15c.l;
_15d+=Math.max(_15b.w+_15d,this.minColWidth)-(_15b.w+_15d);
if(dojo.isWebKit&&_15b.spanners.length){
_15d+=dojo._getPadBorderExtents(_15b.spanners[0].node).w;
}
var data={deltaX:_15d,w:_15b.w+_15d,vw:_15b.vw+_15d,tw:_15b.tw+_15d};
this.doResizeNow(_15b,data);
delete this.dragRecord;
}
dojo.destroy(this.lineDiv);
dojo.destroy(this.moverDiv);
dojo.destroy(this.moverDiv);
delete this.moverDiv;
this._skipBogusClicks=true;
_15b.view.update();
this._skipBogusClicks=false;
this.grid.onResizeColumn(_15b.index,_15b,data);
},doResizeNow:function(_15e,data){
_15e.view.convertColPctToFixed();
if(_15e.view.flexCells&&!_15e.view.testFlexCells()){
var t=_12d(_15e.node);
if(t){
(t.style.width="");
}
}
var i,s,sw,f,fl;
for(i=0;(s=_15e.spanners[i]);i++){
sw=s.width+data.deltaX;
if(sw>0){
s.node.style.width=sw+"px";
_15e.view.setColWidth(s.index,sw);
}
}
if(dojo._isBodyLtr()||!dojo.isIE){
for(i=0;(f=_15e.followers[i]);i++){
fl=f.left+data.deltaX;
f.node.style.left=fl+"px";
}
}
_15e.node.style.width=data.w+"px";
_15e.view.setColWidth(_15e.index,data.w);
_15e.view.headerNode.style.width=data.vw+"px";
_15e.view.setColumnsWidth(data.tw);
if(!dojo._isBodyLtr()){
_15e.view.headerNode.scrollLeft=_15e.scrollLeft+data.deltaX;
}
}});
dg._TableMap=dojo.extend(function(rows){
this.mapRows(rows);
},{map:null,mapRows:function(_15f){
var _160=_15f.length;
if(!_160){
return;
}
this.map=[];
var row;
for(var k=0;(row=_15f[k]);k++){
this.map[k]=[];
}
for(var j=0;(row=_15f[j]);j++){
for(var i=0,x=0,cell,_161,_162;(cell=row[i]);i++){
while(this.map[j][x]){
x++;
}
this.map[j][x]={c:i,r:j};
_162=cell.rowSpan||1;
_161=cell.colSpan||1;
for(var y=0;y<_162;y++){
for(var s=0;s<_161;s++){
this.map[j+y][x+s]=this.map[j][x];
}
}
x+=_161;
}
}
},dumpMap:function(){
for(var j=0,row,h="";(row=this.map[j]);j++,h=""){
for(var i=0,cell;(cell=row[i]);i++){
h+=cell.r+","+cell.c+"   ";
}
}
},getMapCoords:function(_163,_164){
for(var j=0,row;(row=this.map[j]);j++){
for(var i=0,cell;(cell=row[i]);i++){
if(cell.c==_164&&cell.r==_163){
return {j:j,i:i};
}
}
}
return {j:-1,i:-1};
},getNode:function(_165,_166,_167){
var row=_165&&_165.rows[_166];
return row&&row.cells[_167];
},_findOverlappingNodes:function(_168,_169,_16a){
var _16b=[];
var m=this.getMapCoords(_169,_16a);
for(var j=0,row;(row=this.map[j]);j++){
if(j==m.j){
continue;
}
var rw=row[m.i];
var n=(rw?this.getNode(_168,rw.r,rw.c):null);
if(n){
_16b.push(n);
}
}
return _16b;
},findOverlappingNodes:function(_16c){
return this._findOverlappingNodes(_12d(_16c),_129(_16c.parentNode),_128(_16c));
}});
})();
}
if(!dojo._hasResource["dojo.dnd.Container"]){
dojo._hasResource["dojo.dnd.Container"]=true;
dojo.provide("dojo.dnd.Container");
dojo.declare("dojo.dnd.Container",null,{skipForm:false,constructor:function(node,_16d){
this.node=dojo.byId(node);
if(!_16d){
_16d={};
}
this.creator=_16d.creator||null;
this.skipForm=_16d.skipForm;
this.parent=_16d.dropParent&&dojo.byId(_16d.dropParent);
this.map={};
this.current=null;
this.containerState="";
dojo.addClass(this.node,"dojoDndContainer");
if(!(_16d&&_16d._skipStartup)){
this.startup();
}
this.events=[dojo.connect(this.node,"onmouseover",this,"onMouseOver"),dojo.connect(this.node,"onmouseout",this,"onMouseOut"),dojo.connect(this.node,"ondragstart",this,"onSelectStart"),dojo.connect(this.node,"onselectstart",this,"onSelectStart")];
},creator:function(){
},getItem:function(key){
return this.map[key];
},setItem:function(key,data){
this.map[key]=data;
},delItem:function(key){
delete this.map[key];
},forInItems:function(f,o){
o=o||dojo.global;
var m=this.map,e=dojo.dnd._empty;
for(var i in m){
if(i in e){
continue;
}
f.call(o,m[i],i,this);
}
return o;
},clearItems:function(){
this.map={};
},getAllNodes:function(){
return dojo.query("> .dojoDndItem",this.parent);
},sync:function(){
var map={};
this.getAllNodes().forEach(function(node){
if(node.id){
var item=this.getItem(node.id);
if(item){
map[node.id]=item;
return;
}
}else{
node.id=dojo.dnd.getUniqueId();
}
var type=node.getAttribute("dndType"),data=node.getAttribute("dndData");
map[node.id]={data:data||node.innerHTML,type:type?type.split(/\s*,\s*/):["text"]};
},this);
this.map=map;
return this;
},insertNodes:function(data,_16e,_16f){
if(!this.parent.firstChild){
_16f=null;
}else{
if(_16e){
if(!_16f){
_16f=this.parent.firstChild;
}
}else{
if(_16f){
_16f=_16f.nextSibling;
}
}
}
if(_16f){
for(var i=0;i<data.length;++i){
var t=this._normalizedCreator(data[i]);
this.setItem(t.node.id,{data:t.data,type:t.type});
this.parent.insertBefore(t.node,_16f);
}
}else{
for(var i=0;i<data.length;++i){
var t=this._normalizedCreator(data[i]);
this.setItem(t.node.id,{data:t.data,type:t.type});
this.parent.appendChild(t.node);
}
}
return this;
},destroy:function(){
dojo.forEach(this.events,dojo.disconnect);
this.clearItems();
this.node=this.parent=this.current=null;
},markupFactory:function(_170,node){
_170._skipStartup=true;
return new dojo.dnd.Container(node,_170);
},startup:function(){
if(!this.parent){
this.parent=this.node;
if(this.parent.tagName.toLowerCase()=="table"){
var c=this.parent.getElementsByTagName("tbody");
if(c&&c.length){
this.parent=c[0];
}
}
}
this.defaultCreator=dojo.dnd._defaultCreator(this.parent);
this.sync();
},onMouseOver:function(e){
var n=e.relatedTarget;
while(n){
if(n==this.node){
break;
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
if(!n){
this._changeState("Container","Over");
this.onOverEvent();
}
n=this._getChildByEvent(e);
if(this.current==n){
return;
}
if(this.current){
this._removeItemClass(this.current,"Over");
}
if(n){
this._addItemClass(n,"Over");
}
this.current=n;
},onMouseOut:function(e){
for(var n=e.relatedTarget;n;){
if(n==this.node){
return;
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
if(this.current){
this._removeItemClass(this.current,"Over");
this.current=null;
}
this._changeState("Container","");
this.onOutEvent();
},onSelectStart:function(e){
if(!this.skipForm||!dojo.dnd.isFormElement(e)){
dojo.stopEvent(e);
}
},onOverEvent:function(){
},onOutEvent:function(){
},_changeState:function(type,_171){
var _172="dojoDnd"+type;
var _173=type.toLowerCase()+"State";
dojo.replaceClass(this.node,_172+_171,_172+this[_173]);
this[_173]=_171;
},_addItemClass:function(node,type){
dojo.addClass(node,"dojoDndItem"+type);
},_removeItemClass:function(node,type){
dojo.removeClass(node,"dojoDndItem"+type);
},_getChildByEvent:function(e){
var node=e.target;
if(node){
for(var _174=node.parentNode;_174;node=_174,_174=node.parentNode){
if(_174==this.parent&&dojo.hasClass(node,"dojoDndItem")){
return node;
}
}
}
return null;
},_normalizedCreator:function(item,hint){
var t=(this.creator||this.defaultCreator).call(this,item,hint);
if(!dojo.isArray(t.type)){
t.type=["text"];
}
if(!t.node.id){
t.node.id=dojo.dnd.getUniqueId();
}
dojo.addClass(t.node,"dojoDndItem");
return t;
}});
dojo.dnd._createNode=function(tag){
if(!tag){
return dojo.dnd._createSpan;
}
return function(text){
return dojo.create(tag,{innerHTML:text});
};
};
dojo.dnd._createTrTd=function(text){
var tr=dojo.create("tr");
dojo.create("td",{innerHTML:text},tr);
return tr;
};
dojo.dnd._createSpan=function(text){
return dojo.create("span",{innerHTML:text});
};
dojo.dnd._defaultCreatorNodes={ul:"li",ol:"li",div:"div",p:"div"};
dojo.dnd._defaultCreator=function(node){
var tag=node.tagName.toLowerCase();
var c=tag=="tbody"||tag=="thead"?dojo.dnd._createTrTd:dojo.dnd._createNode(dojo.dnd._defaultCreatorNodes[tag]);
return function(item,hint){
var _175=item&&dojo.isObject(item),data,type,n;
if(_175&&item.tagName&&item.nodeType&&item.getAttribute){
data=item.getAttribute("dndData")||item.innerHTML;
type=item.getAttribute("dndType");
type=type?type.split(/\s*,\s*/):["text"];
n=item;
}else{
data=(_175&&item.data)?item.data:item;
type=(_175&&item.type)?item.type:["text"];
n=(hint=="avatar"?dojo.dnd._createSpan:c)(String(data));
}
if(!n.id){
n.id=dojo.dnd.getUniqueId();
}
return {node:n,data:data,type:type};
};
};
}
if(!dojo._hasResource["dojo.dnd.Selector"]){
dojo._hasResource["dojo.dnd.Selector"]=true;
dojo.provide("dojo.dnd.Selector");
dojo.declare("dojo.dnd.Selector",dojo.dnd.Container,{constructor:function(node,_176){
if(!_176){
_176={};
}
this.singular=_176.singular;
this.autoSync=_176.autoSync;
this.selection={};
this.anchor=null;
this.simpleSelection=false;
this.events.push(dojo.connect(this.node,"onmousedown",this,"onMouseDown"),dojo.connect(this.node,"onmouseup",this,"onMouseUp"));
},singular:false,getSelectedNodes:function(){
var t=new dojo.NodeList();
var e=dojo.dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
t.push(dojo.byId(i));
}
return t;
},selectNone:function(){
return this._removeSelection()._removeAnchor();
},selectAll:function(){
this.forInItems(function(data,id){
this._addItemClass(dojo.byId(id),"Selected");
this.selection[id]=1;
},this);
return this._removeAnchor();
},deleteSelectedNodes:function(){
var e=dojo.dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
var n=dojo.byId(i);
this.delItem(i);
dojo.destroy(n);
}
this.anchor=null;
this.selection={};
return this;
},forInSelectedItems:function(f,o){
o=o||dojo.global;
var s=this.selection,e=dojo.dnd._empty;
for(var i in s){
if(i in e){
continue;
}
f.call(o,this.getItem(i),i,this);
}
},sync:function(){
dojo.dnd.Selector.superclass.sync.call(this);
if(this.anchor){
if(!this.getItem(this.anchor.id)){
this.anchor=null;
}
}
var t=[],e=dojo.dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
if(!this.getItem(i)){
t.push(i);
}
}
dojo.forEach(t,function(i){
delete this.selection[i];
},this);
return this;
},insertNodes:function(_177,data,_178,_179){
var _17a=this._normalizedCreator;
this._normalizedCreator=function(item,hint){
var t=_17a.call(this,item,hint);
if(_177){
if(!this.anchor){
this.anchor=t.node;
this._removeItemClass(t.node,"Selected");
this._addItemClass(this.anchor,"Anchor");
}else{
if(this.anchor!=t.node){
this._removeItemClass(t.node,"Anchor");
this._addItemClass(t.node,"Selected");
}
}
this.selection[t.node.id]=1;
}else{
this._removeItemClass(t.node,"Selected");
this._removeItemClass(t.node,"Anchor");
}
return t;
};
dojo.dnd.Selector.superclass.insertNodes.call(this,data,_178,_179);
this._normalizedCreator=_17a;
return this;
},destroy:function(){
dojo.dnd.Selector.superclass.destroy.call(this);
this.selection=this.anchor=null;
},markupFactory:function(_17b,node){
_17b._skipStartup=true;
return new dojo.dnd.Selector(node,_17b);
},onMouseDown:function(e){
if(this.autoSync){
this.sync();
}
if(!this.current){
return;
}
if(!this.singular&&!dojo.isCopyKey(e)&&!e.shiftKey&&(this.current.id in this.selection)){
this.simpleSelection=true;
if(e.button===dojo.mouseButtons.LEFT){
dojo.stopEvent(e);
}
return;
}
if(!this.singular&&e.shiftKey){
if(!dojo.isCopyKey(e)){
this._removeSelection();
}
var c=this.getAllNodes();
if(c.length){
if(!this.anchor){
this.anchor=c[0];
this._addItemClass(this.anchor,"Anchor");
}
this.selection[this.anchor.id]=1;
if(this.anchor!=this.current){
var i=0;
for(;i<c.length;++i){
var node=c[i];
if(node==this.anchor||node==this.current){
break;
}
}
for(++i;i<c.length;++i){
var node=c[i];
if(node==this.anchor||node==this.current){
break;
}
this._addItemClass(node,"Selected");
this.selection[node.id]=1;
}
this._addItemClass(this.current,"Selected");
this.selection[this.current.id]=1;
}
}
}else{
if(this.singular){
if(this.anchor==this.current){
if(dojo.isCopyKey(e)){
this.selectNone();
}
}else{
this.selectNone();
this.anchor=this.current;
this._addItemClass(this.anchor,"Anchor");
this.selection[this.current.id]=1;
}
}else{
if(dojo.isCopyKey(e)){
if(this.anchor==this.current){
delete this.selection[this.anchor.id];
this._removeAnchor();
}else{
if(this.current.id in this.selection){
this._removeItemClass(this.current,"Selected");
delete this.selection[this.current.id];
}else{
if(this.anchor){
this._removeItemClass(this.anchor,"Anchor");
this._addItemClass(this.anchor,"Selected");
}
this.anchor=this.current;
this._addItemClass(this.current,"Anchor");
this.selection[this.current.id]=1;
}
}
}else{
if(!(this.current.id in this.selection)){
this.selectNone();
this.anchor=this.current;
this._addItemClass(this.current,"Anchor");
this.selection[this.current.id]=1;
}
}
}
}
dojo.stopEvent(e);
},onMouseUp:function(e){
if(!this.simpleSelection){
return;
}
this.simpleSelection=false;
this.selectNone();
if(this.current){
this.anchor=this.current;
this._addItemClass(this.anchor,"Anchor");
this.selection[this.current.id]=1;
}
},onMouseMove:function(e){
this.simpleSelection=false;
},onOverEvent:function(){
this.onmousemoveEvent=dojo.connect(this.node,"onmousemove",this,"onMouseMove");
},onOutEvent:function(){
dojo.disconnect(this.onmousemoveEvent);
delete this.onmousemoveEvent;
},_removeSelection:function(){
var e=dojo.dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
var node=dojo.byId(i);
if(node){
this._removeItemClass(node,"Selected");
}
}
this.selection={};
return this;
},_removeAnchor:function(){
if(this.anchor){
this._removeItemClass(this.anchor,"Anchor");
this.anchor=null;
}
return this;
}});
}
if(!dojo._hasResource["dojo.dnd.Avatar"]){
dojo._hasResource["dojo.dnd.Avatar"]=true;
dojo.provide("dojo.dnd.Avatar");
dojo.declare("dojo.dnd.Avatar",null,{constructor:function(_17c){
this.manager=_17c;
this.construct();
},construct:function(){
this.isA11y=dojo.hasClass(dojo.body(),"dijit_a11y");
var a=dojo.create("table",{"class":"dojoDndAvatar",style:{position:"absolute",zIndex:"1999",margin:"0px"}}),_17d=this.manager.source,node,b=dojo.create("tbody",null,a),tr=dojo.create("tr",null,b),td=dojo.create("td",null,tr),icon=this.isA11y?dojo.create("span",{id:"a11yIcon",innerHTML:this.manager.copy?"+":"<"},td):null,span=dojo.create("span",{innerHTML:_17d.generateText?this._generateText():""},td),k=Math.min(5,this.manager.nodes.length),i=0;
dojo.attr(tr,{"class":"dojoDndAvatarHeader",style:{opacity:0.9}});
for(;i<k;++i){
if(_17d.creator){
node=_17d._normalizedCreator(_17d.getItem(this.manager.nodes[i].id).data,"avatar").node;
}else{
node=this.manager.nodes[i].cloneNode(true);
if(node.tagName.toLowerCase()=="tr"){
var _17e=dojo.create("table"),_17f=dojo.create("tbody",null,_17e);
_17f.appendChild(node);
node=_17e;
}
}
node.id="";
tr=dojo.create("tr",null,b);
td=dojo.create("td",null,tr);
td.appendChild(node);
dojo.attr(tr,{"class":"dojoDndAvatarItem",style:{opacity:(9-i)/10}});
}
this.node=a;
},destroy:function(){
dojo.destroy(this.node);
this.node=false;
},update:function(){
dojo[(this.manager.canDropFlag?"add":"remove")+"Class"](this.node,"dojoDndAvatarCanDrop");
if(this.isA11y){
var icon=dojo.byId("a11yIcon");
var text="+";
if(this.manager.canDropFlag&&!this.manager.copy){
text="< ";
}else{
if(!this.manager.canDropFlag&&!this.manager.copy){
text="o";
}else{
if(!this.manager.canDropFlag){
text="x";
}
}
}
icon.innerHTML=text;
}
dojo.query(("tr.dojoDndAvatarHeader td span"+(this.isA11y?" span":"")),this.node).forEach(function(node){
node.innerHTML=this._generateText();
},this);
},_generateText:function(){
return this.manager.nodes.length.toString();
}});
}
if(!dojo._hasResource["dojo.dnd.Manager"]){
dojo._hasResource["dojo.dnd.Manager"]=true;
dojo.provide("dojo.dnd.Manager");
dojo.declare("dojo.dnd.Manager",null,{constructor:function(){
this.avatar=null;
this.source=null;
this.nodes=[];
this.copy=true;
this.target=null;
this.canDropFlag=false;
this.events=[];
},OFFSET_X:16,OFFSET_Y:16,overSource:function(_180){
if(this.avatar){
this.target=(_180&&_180.targetState!="Disabled")?_180:null;
this.canDropFlag=Boolean(this.target);
this.avatar.update();
}
dojo.publish("/dnd/source/over",[_180]);
},outSource:function(_181){
if(this.avatar){
if(this.target==_181){
this.target=null;
this.canDropFlag=false;
this.avatar.update();
dojo.publish("/dnd/source/over",[null]);
}
}else{
dojo.publish("/dnd/source/over",[null]);
}
},startDrag:function(_182,_183,copy){
this.source=_182;
this.nodes=_183;
this.copy=Boolean(copy);
this.avatar=this.makeAvatar();
dojo.body().appendChild(this.avatar.node);
dojo.publish("/dnd/start",[_182,_183,this.copy]);
this.events=[dojo.connect(dojo.doc,"onmousemove",this,"onMouseMove"),dojo.connect(dojo.doc,"onmouseup",this,"onMouseUp"),dojo.connect(dojo.doc,"onkeydown",this,"onKeyDown"),dojo.connect(dojo.doc,"onkeyup",this,"onKeyUp"),dojo.connect(dojo.doc,"ondragstart",dojo.stopEvent),dojo.connect(dojo.body(),"onselectstart",dojo.stopEvent)];
var c="dojoDnd"+(copy?"Copy":"Move");
dojo.addClass(dojo.body(),c);
},canDrop:function(flag){
var _184=Boolean(this.target&&flag);
if(this.canDropFlag!=_184){
this.canDropFlag=_184;
this.avatar.update();
}
},stopDrag:function(){
dojo.removeClass(dojo.body(),["dojoDndCopy","dojoDndMove"]);
dojo.forEach(this.events,dojo.disconnect);
this.events=[];
this.avatar.destroy();
this.avatar=null;
this.source=this.target=null;
this.nodes=[];
},makeAvatar:function(){
return new dojo.dnd.Avatar(this);
},updateAvatar:function(){
this.avatar.update();
},onMouseMove:function(e){
var a=this.avatar;
if(a){
dojo.dnd.autoScrollNodes(e);
var s=a.node.style;
s.left=(e.pageX+this.OFFSET_X)+"px";
s.top=(e.pageY+this.OFFSET_Y)+"px";
var copy=Boolean(this.source.copyState(dojo.isCopyKey(e)));
if(this.copy!=copy){
this._setCopyStatus(copy);
}
}
},onMouseUp:function(e){
if(this.avatar){
if(this.target&&this.canDropFlag){
var copy=Boolean(this.source.copyState(dojo.isCopyKey(e))),_185=[this.source,this.nodes,copy,this.target,e];
dojo.publish("/dnd/drop/before",_185);
dojo.publish("/dnd/drop",_185);
}else{
dojo.publish("/dnd/cancel");
}
this.stopDrag();
}
},onKeyDown:function(e){
if(this.avatar){
switch(e.keyCode){
case dojo.keys.CTRL:
var copy=Boolean(this.source.copyState(true));
if(this.copy!=copy){
this._setCopyStatus(copy);
}
break;
case dojo.keys.ESCAPE:
dojo.publish("/dnd/cancel");
this.stopDrag();
break;
}
}
},onKeyUp:function(e){
if(this.avatar&&e.keyCode==dojo.keys.CTRL){
var copy=Boolean(this.source.copyState(false));
if(this.copy!=copy){
this._setCopyStatus(copy);
}
}
},_setCopyStatus:function(copy){
this.copy=copy;
this.source._markDndStatus(this.copy);
this.updateAvatar();
dojo.replaceClass(dojo.body(),"dojoDnd"+(this.copy?"Copy":"Move"),"dojoDnd"+(this.copy?"Move":"Copy"));
}});
dojo.dnd._manager=null;
dojo.dnd.manager=function(){
if(!dojo.dnd._manager){
dojo.dnd._manager=new dojo.dnd.Manager();
}
return dojo.dnd._manager;
};
}
if(!dojo._hasResource["dojo.dnd.Source"]){
dojo._hasResource["dojo.dnd.Source"]=true;
dojo.provide("dojo.dnd.Source");
dojo.declare("dojo.dnd.Source",dojo.dnd.Selector,{isSource:true,horizontal:false,copyOnly:false,selfCopy:false,selfAccept:true,skipForm:false,withHandles:false,autoSync:false,delay:0,accept:["text"],generateText:true,constructor:function(node,_186){
dojo.mixin(this,dojo.mixin({},_186));
var type=this.accept;
if(type.length){
this.accept={};
for(var i=0;i<type.length;++i){
this.accept[type[i]]=1;
}
}
this.isDragging=false;
this.mouseDown=false;
this.targetAnchor=null;
this.targetBox=null;
this.before=true;
this._lastX=0;
this._lastY=0;
this.sourceState="";
if(this.isSource){
dojo.addClass(this.node,"dojoDndSource");
}
this.targetState="";
if(this.accept){
dojo.addClass(this.node,"dojoDndTarget");
}
if(this.horizontal){
dojo.addClass(this.node,"dojoDndHorizontal");
}
this.topics=[dojo.subscribe("/dnd/source/over",this,"onDndSourceOver"),dojo.subscribe("/dnd/start",this,"onDndStart"),dojo.subscribe("/dnd/drop",this,"onDndDrop"),dojo.subscribe("/dnd/cancel",this,"onDndCancel")];
},checkAcceptance:function(_187,_188){
if(this==_187){
return !this.copyOnly||this.selfAccept;
}
for(var i=0;i<_188.length;++i){
var type=_187.getItem(_188[i].id).type;
var flag=false;
for(var j=0;j<type.length;++j){
if(type[j] in this.accept){
flag=true;
break;
}
}
if(!flag){
return false;
}
}
return true;
},copyState:function(_189,self){
if(_189){
return true;
}
if(arguments.length<2){
self=this==dojo.dnd.manager().target;
}
if(self){
if(this.copyOnly){
return this.selfCopy;
}
}else{
return this.copyOnly;
}
return false;
},destroy:function(){
dojo.dnd.Source.superclass.destroy.call(this);
dojo.forEach(this.topics,dojo.unsubscribe);
this.targetAnchor=null;
},markupFactory:function(_18a,node){
_18a._skipStartup=true;
return new dojo.dnd.Source(node,_18a);
},onMouseMove:function(e){
if(this.isDragging&&this.targetState=="Disabled"){
return;
}
dojo.dnd.Source.superclass.onMouseMove.call(this,e);
var m=dojo.dnd.manager();
if(!this.isDragging){
if(this.mouseDown&&this.isSource&&(Math.abs(e.pageX-this._lastX)>this.delay||Math.abs(e.pageY-this._lastY)>this.delay)){
var _18b=this.getSelectedNodes();
if(_18b.length){
m.startDrag(this,_18b,this.copyState(dojo.isCopyKey(e),true));
}
}
}
if(this.isDragging){
var _18c=false;
if(this.current){
if(!this.targetBox||this.targetAnchor!=this.current){
this.targetBox=dojo.position(this.current,true);
}
if(this.horizontal){
_18c=(e.pageX-this.targetBox.x)<(this.targetBox.w/2);
}else{
_18c=(e.pageY-this.targetBox.y)<(this.targetBox.h/2);
}
}
if(this.current!=this.targetAnchor||_18c!=this.before){
this._markTargetAnchor(_18c);
m.canDrop(!this.current||m.source!=this||!(this.current.id in this.selection));
}
}
},onMouseDown:function(e){
if(!this.mouseDown&&this._legalMouseDown(e)&&(!this.skipForm||!dojo.dnd.isFormElement(e))){
this.mouseDown=true;
this._lastX=e.pageX;
this._lastY=e.pageY;
dojo.dnd.Source.superclass.onMouseDown.call(this,e);
}
},onMouseUp:function(e){
if(this.mouseDown){
this.mouseDown=false;
dojo.dnd.Source.superclass.onMouseUp.call(this,e);
}
},onDndSourceOver:function(_18d){
if(this!=_18d){
this.mouseDown=false;
if(this.targetAnchor){
this._unmarkTargetAnchor();
}
}else{
if(this.isDragging){
var m=dojo.dnd.manager();
m.canDrop(this.targetState!="Disabled"&&(!this.current||m.source!=this||!(this.current.id in this.selection)));
}
}
},onDndStart:function(_18e,_18f,copy){
if(this.autoSync){
this.sync();
}
if(this.isSource){
this._changeState("Source",this==_18e?(copy?"Copied":"Moved"):"");
}
var _190=this.accept&&this.checkAcceptance(_18e,_18f);
this._changeState("Target",_190?"":"Disabled");
if(this==_18e){
dojo.dnd.manager().overSource(this);
}
this.isDragging=true;
},onDndDrop:function(_191,_192,copy,_193){
if(this==_193){
this.onDrop(_191,_192,copy);
}
this.onDndCancel();
},onDndCancel:function(){
if(this.targetAnchor){
this._unmarkTargetAnchor();
this.targetAnchor=null;
}
this.before=true;
this.isDragging=false;
this.mouseDown=false;
this._changeState("Source","");
this._changeState("Target","");
},onDrop:function(_194,_195,copy){
if(this!=_194){
this.onDropExternal(_194,_195,copy);
}else{
this.onDropInternal(_195,copy);
}
},onDropExternal:function(_196,_197,copy){
var _198=this._normalizedCreator;
if(this.creator){
this._normalizedCreator=function(node,hint){
return _198.call(this,_196.getItem(node.id).data,hint);
};
}else{
if(copy){
this._normalizedCreator=function(node,hint){
var t=_196.getItem(node.id);
var n=node.cloneNode(true);
n.id=dojo.dnd.getUniqueId();
return {node:n,data:t.data,type:t.type};
};
}else{
this._normalizedCreator=function(node,hint){
var t=_196.getItem(node.id);
_196.delItem(node.id);
return {node:node,data:t.data,type:t.type};
};
}
}
this.selectNone();
if(!copy&&!this.creator){
_196.selectNone();
}
this.insertNodes(true,_197,this.before,this.current);
if(!copy&&this.creator){
_196.deleteSelectedNodes();
}
this._normalizedCreator=_198;
},onDropInternal:function(_199,copy){
var _19a=this._normalizedCreator;
if(this.current&&this.current.id in this.selection){
return;
}
if(copy){
if(this.creator){
this._normalizedCreator=function(node,hint){
return _19a.call(this,this.getItem(node.id).data,hint);
};
}else{
this._normalizedCreator=function(node,hint){
var t=this.getItem(node.id);
var n=node.cloneNode(true);
n.id=dojo.dnd.getUniqueId();
return {node:n,data:t.data,type:t.type};
};
}
}else{
if(!this.current){
return;
}
this._normalizedCreator=function(node,hint){
var t=this.getItem(node.id);
return {node:node,data:t.data,type:t.type};
};
}
this._removeSelection();
this.insertNodes(true,_199,this.before,this.current);
this._normalizedCreator=_19a;
},onDraggingOver:function(){
},onDraggingOut:function(){
},onOverEvent:function(){
dojo.dnd.Source.superclass.onOverEvent.call(this);
dojo.dnd.manager().overSource(this);
if(this.isDragging&&this.targetState!="Disabled"){
this.onDraggingOver();
}
},onOutEvent:function(){
dojo.dnd.Source.superclass.onOutEvent.call(this);
dojo.dnd.manager().outSource(this);
if(this.isDragging&&this.targetState!="Disabled"){
this.onDraggingOut();
}
},_markTargetAnchor:function(_19b){
if(this.current==this.targetAnchor&&this.before==_19b){
return;
}
if(this.targetAnchor){
this._removeItemClass(this.targetAnchor,this.before?"Before":"After");
}
this.targetAnchor=this.current;
this.targetBox=null;
this.before=_19b;
if(this.targetAnchor){
this._addItemClass(this.targetAnchor,this.before?"Before":"After");
}
},_unmarkTargetAnchor:function(){
if(!this.targetAnchor){
return;
}
this._removeItemClass(this.targetAnchor,this.before?"Before":"After");
this.targetAnchor=null;
this.targetBox=null;
this.before=true;
},_markDndStatus:function(copy){
this._changeState("Source",copy?"Copied":"Moved");
},_legalMouseDown:function(e){
if(!dojo.mouseButtons.isLeft(e)){
return false;
}
if(!this.withHandles){
return true;
}
for(var node=e.target;node&&node!==this.node;node=node.parentNode){
if(dojo.hasClass(node,"dojoDndHandle")){
return true;
}
if(dojo.hasClass(node,"dojoDndItem")||dojo.hasClass(node,"dojoDndIgnore")){
break;
}
}
return false;
}});
dojo.declare("dojo.dnd.Target",dojo.dnd.Source,{constructor:function(node,_19c){
this.isSource=false;
dojo.removeClass(this.node,"dojoDndSource");
},markupFactory:function(_19d,node){
_19d._skipStartup=true;
return new dojo.dnd.Target(node,_19d);
}});
dojo.declare("dojo.dnd.AutoSource",dojo.dnd.Source,{constructor:function(node,_19e){
this.autoSync=true;
},markupFactory:function(_19f,node){
_19f._skipStartup=true;
return new dojo.dnd.AutoSource(node,_19f);
}});
}
if(!dojo._hasResource["dojox.grid._View"]){
dojo._hasResource["dojox.grid._View"]=true;
dojo.provide("dojox.grid._View");
(function(){
var _1a0=function(_1a1,_1a2){
return _1a1.style.cssText==undefined?_1a1.getAttribute("style"):_1a1.style.cssText;
};
dojo.declare("dojox.grid._View",[dijit._Widget,dijit._Templated],{defaultWidth:"18em",viewWidth:"",templateString:"<div class=\"dojoxGridView\" role=\"presentation\">\n\t<div class=\"dojoxGridHeader\" dojoAttachPoint=\"headerNode\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"headerNodeContainer\" style=\"width:9000em\" role=\"presentation\">\n\t\t\t<div dojoAttachPoint=\"headerContentNode\" role=\"row\"></div>\n\t\t</div>\n\t</div>\n\t<input type=\"checkbox\" class=\"dojoxGridHiddenFocus\" dojoAttachPoint=\"hiddenFocusNode\" role=\"presentation\" />\n\t<input type=\"checkbox\" class=\"dojoxGridHiddenFocus\" role=\"presentation\" />\n\t<div class=\"dojoxGridScrollbox\" dojoAttachPoint=\"scrollboxNode\" role=\"presentation\">\n\t\t<div class=\"dojoxGridContent\" dojoAttachPoint=\"contentNode\" hidefocus=\"hidefocus\" role=\"presentation\"></div>\n\t</div>\n</div>\n",themeable:false,classTag:"dojoxGrid",marginBottom:0,rowPad:2,_togglingColumn:-1,_headerBuilderClass:dojox.grid._HeaderBuilder,_contentBuilderClass:dojox.grid._ContentBuilder,postMixInProperties:function(){
this.rowNodes={};
},postCreate:function(){
this.connect(this.scrollboxNode,"onscroll","doscroll");
dojox.grid.util.funnelEvents(this.contentNode,this,"doContentEvent",["mouseover","mouseout","click","dblclick","contextmenu","mousedown"]);
dojox.grid.util.funnelEvents(this.headerNode,this,"doHeaderEvent",["dblclick","mouseover","mouseout","mousemove","mousedown","click","contextmenu"]);
this.content=new this._contentBuilderClass(this);
this.header=new this._headerBuilderClass(this);
if(!dojo._isBodyLtr()){
this.headerNodeContainer.style.width="";
}
},destroy:function(){
dojo.destroy(this.headerNode);
delete this.headerNode;
for(var i in this.rowNodes){
dojo.destroy(this.rowNodes[i]);
}
this.rowNodes={};
if(this.source){
this.source.destroy();
}
this.inherited(arguments);
},focus:function(){
if(dojo.isIE||dojo.isWebKit||dojo.isOpera){
this.hiddenFocusNode.focus();
}else{
this.scrollboxNode.focus();
}
},setStructure:function(_1a3){
var vs=(this.structure=_1a3);
if(vs.width&&!isNaN(vs.width)){
this.viewWidth=vs.width+"em";
}else{
this.viewWidth=vs.width||(vs.noscroll?"auto":this.viewWidth);
}
this._onBeforeRow=vs.onBeforeRow||function(){
};
this._onAfterRow=vs.onAfterRow||function(){
};
this.noscroll=vs.noscroll;
if(this.noscroll){
this.scrollboxNode.style.overflow="hidden";
}
this.simpleStructure=Boolean(vs.cells.length==1);
this.testFlexCells();
this.updateStructure();
},_cleanupRowWidgets:function(_1a4){
if(_1a4){
dojo.forEach(dojo.query("[widgetId]",_1a4).map(dijit.byNode),function(w){
if(w._destroyOnRemove){
w.destroy();
delete w;
}else{
if(w.domNode&&w.domNode.parentNode){
w.domNode.parentNode.removeChild(w.domNode);
}
}
});
}
},onBeforeRow:function(_1a5,_1a6){
this._onBeforeRow(_1a5,_1a6);
if(_1a5>=0){
this._cleanupRowWidgets(this.getRowNode(_1a5));
}
},onAfterRow:function(_1a7,_1a8,_1a9){
this._onAfterRow(_1a7,_1a8,_1a9);
var g=this.grid;
dojo.forEach(dojo.query(".dojoxGridStubNode",_1a9),function(n){
if(n&&n.parentNode){
var lw=n.getAttribute("linkWidget");
var _1aa=window.parseInt(dojo.attr(n,"cellIdx"),10);
var _1ab=g.getCell(_1aa);
var w=dijit.byId(lw);
if(w){
n.parentNode.replaceChild(w.domNode,n);
if(!w._started){
w.startup();
}
}else{
n.innerHTML="";
}
}
},this);
},testFlexCells:function(){
this.flexCells=false;
for(var j=0,row;(row=this.structure.cells[j]);j++){
for(var i=0,cell;(cell=row[i]);i++){
cell.view=this;
this.flexCells=this.flexCells||cell.isFlex();
}
}
return this.flexCells;
},updateStructure:function(){
this.header.update();
this.content.update();
},getScrollbarWidth:function(){
var _1ac=this.hasVScrollbar();
var _1ad=dojo.style(this.scrollboxNode,"overflow");
if(this.noscroll||!_1ad||_1ad=="hidden"){
_1ac=false;
}else{
if(_1ad=="scroll"){
_1ac=true;
}
}
return (_1ac?dojox.html.metrics.getScrollbar().w:0);
},getColumnsWidth:function(){
var h=this.headerContentNode;
return h&&h.firstChild?h.firstChild.offsetWidth:0;
},setColumnsWidth:function(_1ae){
this.headerContentNode.firstChild.style.width=_1ae+"px";
if(this.viewWidth){
this.viewWidth=_1ae+"px";
}
},getWidth:function(){
return this.viewWidth||(this.getColumnsWidth()+this.getScrollbarWidth())+"px";
},getContentWidth:function(){
return Math.max(0,dojo._getContentBox(this.domNode).w-this.getScrollbarWidth())+"px";
},render:function(){
this.scrollboxNode.style.height="";
this.renderHeader();
if(this._togglingColumn>=0){
this.setColumnsWidth(this.getColumnsWidth()-this._togglingColumn);
this._togglingColumn=-1;
}
var _1af=this.grid.layout.cells;
var _1b0=dojo.hitch(this,function(node,_1b1){
!dojo._isBodyLtr()&&(_1b1=!_1b1);
var inc=_1b1?-1:1;
var idx=this.header.getCellNodeIndex(node)+inc;
var cell=_1af[idx];
while(cell&&cell.getHeaderNode()&&cell.getHeaderNode().style.display=="none"){
idx+=inc;
cell=_1af[idx];
}
if(cell){
return cell.getHeaderNode();
}
return null;
});
if(this.grid.columnReordering&&this.simpleStructure){
if(this.source){
this.source.destroy();
}
var _1b2="dojoxGrid_bottomMarker";
var _1b3="dojoxGrid_topMarker";
if(this.bottomMarker){
dojo.destroy(this.bottomMarker);
}
this.bottomMarker=dojo.byId(_1b2);
if(this.topMarker){
dojo.destroy(this.topMarker);
}
this.topMarker=dojo.byId(_1b3);
if(!this.bottomMarker){
this.bottomMarker=dojo.create("div",{"id":_1b2,"class":"dojoxGridColPlaceBottom"},dojo.body());
this._hide(this.bottomMarker);
this.topMarker=dojo.create("div",{"id":_1b3,"class":"dojoxGridColPlaceTop"},dojo.body());
this._hide(this.topMarker);
}
this.arrowDim=dojo.contentBox(this.bottomMarker);
var _1b4=dojo.contentBox(this.headerContentNode.firstChild.rows[0]).h;
this.source=new dojo.dnd.Source(this.headerContentNode.firstChild.rows[0],{horizontal:true,accept:["gridColumn_"+this.grid.id],viewIndex:this.index,generateText:false,onMouseDown:dojo.hitch(this,function(e){
this.header.decorateEvent(e);
if((this.header.overRightResizeArea(e)||this.header.overLeftResizeArea(e))&&this.header.canResize(e)&&!this.header.moveable){
this.header.beginColumnResize(e);
}else{
if(this.grid.headerMenu){
this.grid.headerMenu.onCancel(true);
}
if(e.button===(dojo.isIE?1:0)){
dojo.dnd.Source.prototype.onMouseDown.call(this.source,e);
}
}
}),onMouseOver:dojo.hitch(this,function(e){
var src=this.source;
if(src._getChildByEvent(e)){
dojo.dnd.Source.prototype.onMouseOver.apply(src,arguments);
}
}),_markTargetAnchor:dojo.hitch(this,function(_1b5){
var src=this.source;
if(src.current==src.targetAnchor&&src.before==_1b5){
return;
}
if(src.targetAnchor&&_1b0(src.targetAnchor,src.before)){
src._removeItemClass(_1b0(src.targetAnchor,src.before),src.before?"After":"Before");
}
dojo.dnd.Source.prototype._markTargetAnchor.call(src,_1b5);
var _1b6=_1b5?src.targetAnchor:_1b0(src.targetAnchor,src.before);
var _1b7=0;
if(!_1b6){
_1b6=src.targetAnchor;
_1b7=dojo.contentBox(_1b6).w+this.arrowDim.w/2+2;
}
var pos=(dojo.position||dojo._abs)(_1b6,true);
var left=Math.floor(pos.x-this.arrowDim.w/2+_1b7);
dojo.style(this.bottomMarker,"visibility","visible");
dojo.style(this.topMarker,"visibility","visible");
dojo.style(this.bottomMarker,{"left":left+"px","top":(_1b4+pos.y)+"px"});
dojo.style(this.topMarker,{"left":left+"px","top":(pos.y-this.arrowDim.h)+"px"});
if(src.targetAnchor&&_1b0(src.targetAnchor,src.before)){
src._addItemClass(_1b0(src.targetAnchor,src.before),src.before?"After":"Before");
}
}),_unmarkTargetAnchor:dojo.hitch(this,function(){
var src=this.source;
if(!src.targetAnchor){
return;
}
if(src.targetAnchor&&_1b0(src.targetAnchor,src.before)){
src._removeItemClass(_1b0(src.targetAnchor,src.before),src.before?"After":"Before");
}
this._hide(this.bottomMarker);
this._hide(this.topMarker);
dojo.dnd.Source.prototype._unmarkTargetAnchor.call(src);
}),destroy:dojo.hitch(this,function(){
dojo.disconnect(this._source_conn);
dojo.unsubscribe(this._source_sub);
dojo.dnd.Source.prototype.destroy.call(this.source);
if(this.bottomMarker){
dojo.destroy(this.bottomMarker);
delete this.bottomMarker;
}
if(this.topMarker){
dojo.destroy(this.topMarker);
delete this.topMarker;
}
}),onDndCancel:dojo.hitch(this,function(){
dojo.dnd.Source.prototype.onDndCancel.call(this.source);
this._hide(this.bottomMarker);
this._hide(this.topMarker);
})});
this._source_conn=dojo.connect(this.source,"onDndDrop",this,"_onDndDrop");
this._source_sub=dojo.subscribe("/dnd/drop/before",this,"_onDndDropBefore");
this.source.startup();
}
},_hide:function(node){
dojo.style(node,{left:"-10000px",top:"-10000px","visibility":"hidden"});
},_onDndDropBefore:function(_1b8,_1b9,copy){
if(dojo.dnd.manager().target!==this.source){
return;
}
this.source._targetNode=this.source.targetAnchor;
this.source._beforeTarget=this.source.before;
var _1ba=this.grid.views.views;
var _1bb=_1ba[_1b8.viewIndex];
var _1bc=_1ba[this.index];
if(_1bc!=_1bb){
_1bb.convertColPctToFixed();
_1bc.convertColPctToFixed();
}
},_onDndDrop:function(_1bd,_1be,copy){
if(dojo.dnd.manager().target!==this.source){
if(dojo.dnd.manager().source===this.source){
this._removingColumn=true;
}
return;
}
this._hide(this.bottomMarker);
this._hide(this.topMarker);
var _1bf=function(n){
return n?dojo.attr(n,"idx"):null;
};
var w=dojo.marginBox(_1be[0]).w;
if(_1bd.viewIndex!==this.index){
var _1c0=this.grid.views.views;
var _1c1=_1c0[_1bd.viewIndex];
var _1c2=_1c0[this.index];
if(_1c1.viewWidth&&_1c1.viewWidth!="auto"){
_1c1.setColumnsWidth(_1c1.getColumnsWidth()-w);
}
if(_1c2.viewWidth&&_1c2.viewWidth!="auto"){
_1c2.setColumnsWidth(_1c2.getColumnsWidth());
}
}
var stn=this.source._targetNode;
var stb=this.source._beforeTarget;
!dojo._isBodyLtr()&&(stb=!stb);
var _1c3=this.grid.layout;
var idx=this.index;
delete this.source._targetNode;
delete this.source._beforeTarget;
_1c3.moveColumn(_1bd.viewIndex,idx,_1bf(_1be[0]),_1bf(stn),stb);
},renderHeader:function(){
this.headerContentNode.innerHTML=this.header.generateHtml(this._getHeaderContent);
if(this.flexCells){
this.contentWidth=this.getContentWidth();
this.headerContentNode.firstChild.style.width=this.contentWidth;
}
dojox.grid.util.fire(this,"onAfterRow",[-1,this.structure.cells,this.headerContentNode]);
},_getHeaderContent:function(_1c4){
var n=_1c4.name||_1c4.grid.getCellName(_1c4);
var ret=["<div class=\"dojoxGridSortNode"];
if(_1c4.index!=_1c4.grid.getSortIndex()){
ret.push("\">");
}else{
ret=ret.concat([" ",_1c4.grid.sortInfo>0?"dojoxGridSortUp":"dojoxGridSortDown","\"><div class=\"dojoxGridArrowButtonChar\">",_1c4.grid.sortInfo>0?"&#9650;":"&#9660;","</div><div class=\"dojoxGridArrowButtonNode\" role=\"presentation\"></div>","<div class=\"dojoxGridColCaption\">"]);
}
ret=ret.concat([n,"</div></div>"]);
return ret.join("");
},resize:function(){
this.adaptHeight();
this.adaptWidth();
},hasHScrollbar:function(_1c5){
var _1c6=this._hasHScroll||false;
if(this._hasHScroll==undefined||_1c5){
if(this.noscroll){
this._hasHScroll=false;
}else{
var _1c7=dojo.style(this.scrollboxNode,"overflow");
if(_1c7=="hidden"){
this._hasHScroll=false;
}else{
if(_1c7=="scroll"){
this._hasHScroll=true;
}else{
this._hasHScroll=(this.scrollboxNode.offsetWidth-this.getScrollbarWidth()<this.contentNode.offsetWidth);
}
}
}
}
if(_1c6!==this._hasHScroll){
this.grid.update();
}
return this._hasHScroll;
},hasVScrollbar:function(_1c8){
var _1c9=this._hasVScroll||false;
if(this._hasVScroll==undefined||_1c8){
if(this.noscroll){
this._hasVScroll=false;
}else{
var _1ca=dojo.style(this.scrollboxNode,"overflow");
if(_1ca=="hidden"){
this._hasVScroll=false;
}else{
if(_1ca=="scroll"){
this._hasVScroll=true;
}else{
this._hasVScroll=(this.scrollboxNode.scrollHeight>this.scrollboxNode.clientHeight);
}
}
}
}
if(_1c9!==this._hasVScroll){
this.grid.update();
}
return this._hasVScroll;
},convertColPctToFixed:function(){
var _1cb=false;
this.grid.initialWidth="";
var _1cc=dojo.query("th",this.headerContentNode);
var _1cd=dojo.map(_1cc,function(c,vIdx){
var w=c.style.width;
dojo.attr(c,"vIdx",vIdx);
if(w&&w.slice(-1)=="%"){
_1cb=true;
}else{
if(w&&w.slice(-2)=="px"){
return window.parseInt(w,10);
}
}
return dojo.contentBox(c).w;
});
if(_1cb){
dojo.forEach(this.grid.layout.cells,function(cell,idx){
if(cell.view==this){
var _1ce=cell.view.getHeaderCellNode(cell.index);
if(_1ce&&dojo.hasAttr(_1ce,"vIdx")){
var vIdx=window.parseInt(dojo.attr(_1ce,"vIdx"));
this.setColWidth(idx,_1cd[vIdx]);
dojo.removeAttr(_1ce,"vIdx");
}
}
},this);
return true;
}
return false;
},adaptHeight:function(_1cf){
if(!this.grid._autoHeight){
var h=(this.domNode.style.height&&parseInt(this.domNode.style.height.replace(/px/,""),10))||this.domNode.clientHeight;
var self=this;
var _1d0=function(){
var v;
for(var i in self.grid.views.views){
v=self.grid.views.views[i];
if(v!==self&&v.hasHScrollbar()){
return true;
}
}
return false;
};
if(_1cf||(this.noscroll&&_1d0())){
h-=dojox.html.metrics.getScrollbar().h;
}
dojox.grid.util.setStyleHeightPx(this.scrollboxNode,h);
}
this.hasVScrollbar(true);
},adaptWidth:function(){
if(this.flexCells){
this.contentWidth=this.getContentWidth();
this.headerContentNode.firstChild.style.width=this.contentWidth;
}
var w=this.scrollboxNode.offsetWidth-this.getScrollbarWidth();
if(!this._removingColumn){
w=Math.max(w,this.getColumnsWidth())+"px";
}else{
w=Math.min(w,this.getColumnsWidth())+"px";
this._removingColumn=false;
}
var cn=this.contentNode;
cn.style.width=w;
this.hasHScrollbar(true);
},setSize:function(w,h){
var ds=this.domNode.style;
var hs=this.headerNode.style;
if(w){
ds.width=w;
hs.width=w;
}
ds.height=(h>=0?h+"px":"");
},renderRow:function(_1d1){
var _1d2=this.createRowNode(_1d1);
this.buildRow(_1d1,_1d2);
this.grid.edit.restore(this,_1d1);
return _1d2;
},createRowNode:function(_1d3){
var node=document.createElement("div");
node.className=this.classTag+"Row";
if(this instanceof dojox.grid._RowSelector){
dojo.attr(node,"role","presentation");
}else{
dojo.attr(node,"role","row");
if(this.grid.selectionMode!="none"){
dojo.attr(node,"aria-selected","false");
}
}
node[dojox.grid.util.gridViewTag]=this.id;
node[dojox.grid.util.rowIndexTag]=_1d3;
this.rowNodes[_1d3]=node;
return node;
},buildRow:function(_1d4,_1d5){
this.buildRowContent(_1d4,_1d5);
this.styleRow(_1d4,_1d5);
},buildRowContent:function(_1d6,_1d7){
_1d7.innerHTML=this.content.generateHtml(_1d6,_1d6);
if(this.flexCells&&this.contentWidth){
_1d7.firstChild.style.width=this.contentWidth;
}
dojox.grid.util.fire(this,"onAfterRow",[_1d6,this.structure.cells,_1d7]);
},rowRemoved:function(_1d8){
if(_1d8>=0){
this._cleanupRowWidgets(this.getRowNode(_1d8));
}
this.grid.edit.save(this,_1d8);
delete this.rowNodes[_1d8];
},getRowNode:function(_1d9){
return this.rowNodes[_1d9];
},getCellNode:function(_1da,_1db){
var row=this.getRowNode(_1da);
if(row){
return this.content.getCellNode(row,_1db);
}
},getHeaderCellNode:function(_1dc){
if(this.headerContentNode){
return this.header.getCellNode(this.headerContentNode,_1dc);
}
},styleRow:function(_1dd,_1de){
_1de._style=_1a0(_1de);
this.styleRowNode(_1dd,_1de);
},styleRowNode:function(_1df,_1e0){
if(_1e0){
this.doStyleRowNode(_1df,_1e0);
}
},doStyleRowNode:function(_1e1,_1e2){
this.grid.styleRowNode(_1e1,_1e2);
},updateRow:function(_1e3){
var _1e4=this.getRowNode(_1e3);
if(_1e4){
_1e4.style.height="";
this.buildRow(_1e3,_1e4);
}
if(dojo.isIE&&dojo.IEGridEvent&&dojo.IEGridEvent.rowIndex!==undefined&&dojo.IEGridEvent.cellIndex!==undefined&&dojo.IEGridEvent.rowIndex==_1e3){
var _1e5=dojo.query("td",_1e4)[dojo.IEGridEvent.cellIndex];
var _1e6=dojo.query("input",_1e5);
if(_1e6.length){
dojo.IEGridEvent.target=_1e6[0];
}else{
dojo.IEGridEvent.target=_1e5;
}
}
return _1e4;
},updateRowStyles:function(_1e7){
this.styleRowNode(_1e7,this.getRowNode(_1e7));
},lastTop:0,firstScroll:0,doscroll:function(_1e8){
var _1e9=dojo._isBodyLtr();
if(this.firstScroll<2){
if((!_1e9&&this.firstScroll==1)||(_1e9&&this.firstScroll===0)){
var s=dojo.marginBox(this.headerNodeContainer);
if(dojo.isIE){
this.headerNodeContainer.style.width=s.w+this.getScrollbarWidth()+"px";
}else{
if(dojo.isMoz){
this.headerNodeContainer.style.width=s.w-this.getScrollbarWidth()+"px";
this.scrollboxNode.scrollLeft=_1e9?this.scrollboxNode.clientWidth-this.scrollboxNode.scrollWidth:this.scrollboxNode.scrollWidth-this.scrollboxNode.clientWidth;
}
}
}
this.firstScroll++;
}
this.headerNode.scrollLeft=this.scrollboxNode.scrollLeft;
var top=this.scrollboxNode.scrollTop;
if(top!==this.lastTop){
this.grid.scrollTo(top);
}
},setScrollTop:function(_1ea){
this.lastTop=_1ea;
this.scrollboxNode.scrollTop=_1ea;
return this.scrollboxNode.scrollTop;
},doContentEvent:function(e){
if(this.content.decorateEvent(e)){
this.grid.onContentEvent(e);
}
},doHeaderEvent:function(e){
if(this.header.decorateEvent(e)){
this.grid.onHeaderEvent(e);
}
},dispatchContentEvent:function(e){
return this.content.dispatchEvent(e);
},dispatchHeaderEvent:function(e){
return this.header.dispatchEvent(e);
},setColWidth:function(_1eb,_1ec){
this.grid.setCellWidth(_1eb,_1ec+"px");
},update:function(){
if(!this.domNode){
return;
}
this.content.update();
this.grid.update();
var left=this.scrollboxNode.scrollLeft;
this.scrollboxNode.scrollLeft=left;
this.headerNode.scrollLeft=left;
}});
dojo.declare("dojox.grid._GridAvatar",dojo.dnd.Avatar,{construct:function(){
var dd=dojo.doc;
var a=dd.createElement("table");
a.cellPadding=a.cellSpacing="0";
a.className="dojoxGridDndAvatar";
a.style.position="absolute";
a.style.zIndex=1999;
a.style.margin="0px";
var b=dd.createElement("tbody");
var tr=dd.createElement("tr");
var td=dd.createElement("td");
var img=dd.createElement("td");
tr.className="dojoxGridDndAvatarItem";
img.className="dojoxGridDndAvatarItemImage";
img.style.width="16px";
var _1ed=this.manager.source,node;
if(_1ed.creator){
node=_1ed._normalizedCreator(_1ed.getItem(this.manager.nodes[0].id).data,"avatar").node;
}else{
node=this.manager.nodes[0].cloneNode(true);
var _1ee,_1ef;
if(node.tagName.toLowerCase()=="tr"){
_1ee=dd.createElement("table");
_1ef=dd.createElement("tbody");
_1ef.appendChild(node);
_1ee.appendChild(_1ef);
node=_1ee;
}else{
if(node.tagName.toLowerCase()=="th"){
_1ee=dd.createElement("table");
_1ef=dd.createElement("tbody");
var r=dd.createElement("tr");
_1ee.cellPadding=_1ee.cellSpacing="0";
r.appendChild(node);
_1ef.appendChild(r);
_1ee.appendChild(_1ef);
node=_1ee;
}
}
}
node.id="";
td.appendChild(node);
tr.appendChild(img);
tr.appendChild(td);
dojo.style(tr,"opacity",0.9);
b.appendChild(tr);
a.appendChild(b);
this.node=a;
var m=dojo.dnd.manager();
this.oldOffsetY=m.OFFSET_Y;
m.OFFSET_Y=1;
},destroy:function(){
dojo.dnd.manager().OFFSET_Y=this.oldOffsetY;
this.inherited(arguments);
}});
var _1f0=dojo.dnd.manager().makeAvatar;
dojo.dnd.manager().makeAvatar=function(){
var src=this.source;
if(src.viewIndex!==undefined&&!dojo.hasClass(dojo.body(),"dijit_a11y")){
return new dojox.grid._GridAvatar(this);
}
return _1f0.call(dojo.dnd.manager());
};
})();
}
if(!dojo._hasResource["dojox.grid._RowSelector"]){
dojo._hasResource["dojox.grid._RowSelector"]=true;
dojo.provide("dojox.grid._RowSelector");
dojo.declare("dojox.grid._RowSelector",dojox.grid._View,{defaultWidth:"2em",noscroll:true,padBorderWidth:2,buildRendering:function(){
this.inherited("buildRendering",arguments);
this.scrollboxNode.style.overflow="hidden";
this.headerNode.style.visibility="hidden";
},getWidth:function(){
return this.viewWidth||this.defaultWidth;
},buildRowContent:function(_1f1,_1f2){
var w=this.contentWidth||0;
_1f2.innerHTML="<table class=\"dojoxGridRowbarTable\" style=\"width:"+w+"px;height:1px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"><tr><td class=\"dojoxGridRowbarInner\">&nbsp;</td></tr></table>";
},renderHeader:function(){
},updateRow:function(){
},resize:function(){
this.adaptHeight();
},adaptWidth:function(){
if(!("contentWidth" in this)&&this.contentNode){
this.contentWidth=this.contentNode.offsetWidth-this.padBorderWidth;
}
},doStyleRowNode:function(_1f3,_1f4){
var n=["dojoxGridRowbar dojoxGridNonNormalizedCell"];
if(this.grid.rows.isOver(_1f3)){
n.push("dojoxGridRowbarOver");
}
if(this.grid.selection.isSelected(_1f3)){
n.push("dojoxGridRowbarSelected");
}
_1f4.className=n.join(" ");
},domouseover:function(e){
this.grid.onMouseOverRow(e);
},domouseout:function(e){
if(!this.isIntraRowEvent(e)){
this.grid.onMouseOutRow(e);
}
}});
}
if(!dojo._hasResource["dojox.grid._Layout"]){
dojo._hasResource["dojox.grid._Layout"]=true;
dojo.provide("dojox.grid._Layout");
dojo.declare("dojox.grid._Layout",null,{constructor:function(_1f5){
this.grid=_1f5;
},cells:[],structure:null,defaultWidth:"6em",moveColumn:function(_1f6,_1f7,_1f8,_1f9,_1fa){
var _1fb=this.structure[_1f6].cells[0];
var _1fc=this.structure[_1f7].cells[0];
var cell=null;
var _1fd=0;
var _1fe=0;
for(var i=0,c;c=_1fb[i];i++){
if(c.index==_1f8){
_1fd=i;
break;
}
}
cell=_1fb.splice(_1fd,1)[0];
cell.view=this.grid.views.views[_1f7];
for(i=0,c=null;c=_1fc[i];i++){
if(c.index==_1f9){
_1fe=i;
break;
}
}
if(!_1fa){
_1fe+=1;
}
_1fc.splice(_1fe,0,cell);
var _1ff=this.grid.getCell(this.grid.getSortIndex());
if(_1ff){
_1ff._currentlySorted=this.grid.getSortAsc();
}
this.cells=[];
_1f8=0;
var v;
for(i=0;v=this.structure[i];i++){
for(var j=0,cs;cs=v.cells[j];j++){
for(var k=0;c=cs[k];k++){
c.index=_1f8;
this.cells.push(c);
if("_currentlySorted" in c){
var si=_1f8+1;
si*=c._currentlySorted?1:-1;
this.grid.sortInfo=si;
delete c._currentlySorted;
}
_1f8++;
}
}
}
dojo.forEach(this.cells,function(c){
var _200=c.markup[2].split(" ");
var _201=parseInt(_200[1].substring(5));
if(_201!=c.index){
_200[1]="idx=\""+c.index+"\"";
c.markup[2]=_200.join(" ");
}
});
this.grid.setupHeaderMenu();
},setColumnVisibility:function(_202,_203){
var cell=this.cells[_202];
if(cell.hidden==_203){
cell.hidden=!_203;
var v=cell.view,w=v.viewWidth;
if(w&&w!="auto"){
v._togglingColumn=dojo.marginBox(cell.getHeaderNode()).w||0;
}
v.update();
return true;
}else{
return false;
}
},addCellDef:function(_204,_205,_206){
var self=this;
var _207=function(_208){
var w=0;
if(_208.colSpan>1){
w=0;
}else{
w=_208.width||self._defaultCellProps.width||self.defaultWidth;
if(!isNaN(w)){
w=w+"em";
}
}
return w;
};
var _209={grid:this.grid,subrow:_204,layoutIndex:_205,index:this.cells.length};
if(_206&&_206 instanceof dojox.grid.cells._Base){
var _20a=dojo.clone(_206);
_209.unitWidth=_207(_20a._props);
_20a=dojo.mixin(_20a,this._defaultCellProps,_206._props,_209);
return _20a;
}
var _20b=_206.type||_206.cellType||this._defaultCellProps.type||this._defaultCellProps.cellType||dojox.grid.cells.Cell;
_209.unitWidth=_207(_206);
return new _20b(dojo.mixin({},this._defaultCellProps,_206,_209));
},addRowDef:function(_20c,_20d){
var _20e=[];
var _20f=0,_210=0,_211=true;
for(var i=0,def,cell;(def=_20d[i]);i++){
cell=this.addCellDef(_20c,i,def);
_20e.push(cell);
this.cells.push(cell);
if(_211&&cell.relWidth){
_20f+=cell.relWidth;
}else{
if(cell.width){
var w=cell.width;
if(typeof w=="string"&&w.slice(-1)=="%"){
_210+=window.parseInt(w,10);
}else{
if(w=="auto"){
_211=false;
}
}
}
}
}
if(_20f&&_211){
dojo.forEach(_20e,function(cell){
if(cell.relWidth){
cell.width=cell.unitWidth=((cell.relWidth/_20f)*(100-_210))+"%";
}
});
}
return _20e;
},addRowsDef:function(_212){
var _213=[];
if(dojo.isArray(_212)){
if(dojo.isArray(_212[0])){
for(var i=0,row;_212&&(row=_212[i]);i++){
_213.push(this.addRowDef(i,row));
}
}else{
_213.push(this.addRowDef(0,_212));
}
}
return _213;
},addViewDef:function(_214){
this._defaultCellProps=_214.defaultCell||{};
if(_214.width&&_214.width=="auto"){
delete _214.width;
}
return dojo.mixin({},_214,{cells:this.addRowsDef(_214.rows||_214.cells)});
},setStructure:function(_215){
this.fieldIndex=0;
this.cells=[];
var s=this.structure=[];
if(this.grid.rowSelector){
var sel={type:dojox._scopeName+".grid._RowSelector"};
if(dojo.isString(this.grid.rowSelector)){
var _216=this.grid.rowSelector;
if(_216=="false"){
sel=null;
}else{
if(_216!="true"){
sel["width"]=_216;
}
}
}else{
if(!this.grid.rowSelector){
sel=null;
}
}
if(sel){
s.push(this.addViewDef(sel));
}
}
var _217=function(def){
return ("name" in def||"field" in def||"get" in def);
};
var _218=function(def){
if(dojo.isArray(def)){
if(dojo.isArray(def[0])||_217(def[0])){
return true;
}
}
return false;
};
var _219=function(def){
return (def!==null&&dojo.isObject(def)&&("cells" in def||"rows" in def||("type" in def&&!_217(def))));
};
if(dojo.isArray(_215)){
var _21a=false;
for(var i=0,st;(st=_215[i]);i++){
if(_219(st)){
_21a=true;
break;
}
}
if(!_21a){
s.push(this.addViewDef({cells:_215}));
}else{
for(i=0;(st=_215[i]);i++){
if(_218(st)){
s.push(this.addViewDef({cells:st}));
}else{
if(_219(st)){
s.push(this.addViewDef(st));
}
}
}
}
}else{
if(_219(_215)){
s.push(this.addViewDef(_215));
}
}
this.cellCount=this.cells.length;
this.grid.setupHeaderMenu();
}});
}
if(!dojo._hasResource["dojox.grid._ViewManager"]){
dojo._hasResource["dojox.grid._ViewManager"]=true;
dojo.provide("dojox.grid._ViewManager");
dojo.declare("dojox.grid._ViewManager",null,{constructor:function(_21b){
this.grid=_21b;
},defaultWidth:200,views:[],resize:function(){
this.onEach("resize");
},render:function(){
this.onEach("render");
},addView:function(_21c){
_21c.idx=this.views.length;
this.views.push(_21c);
},destroyViews:function(){
for(var i=0,v;v=this.views[i];i++){
v.destroy();
}
this.views=[];
},getContentNodes:function(){
var _21d=[];
for(var i=0,v;v=this.views[i];i++){
_21d.push(v.contentNode);
}
return _21d;
},forEach:function(_21e){
for(var i=0,v;v=this.views[i];i++){
_21e(v,i);
}
},onEach:function(_21f,_220){
_220=_220||[];
for(var i=0,v;v=this.views[i];i++){
if(_21f in v){
v[_21f].apply(v,_220);
}
}
},normalizeHeaderNodeHeight:function(){
var _221=[];
for(var i=0,v;(v=this.views[i]);i++){
if(v.headerContentNode.firstChild){
_221.push(v.headerContentNode);
}
}
this.normalizeRowNodeHeights(_221);
},normalizeRowNodeHeights:function(_222){
var h=0;
var _223=[];
if(this.grid.rowHeight){
h=this.grid.rowHeight;
}else{
if(_222.length<=1){
return;
}
for(var i=0,n;(n=_222[i]);i++){
if(!dojo.hasClass(n,"dojoxGridNonNormalizedCell")){
_223[i]=n.firstChild.offsetHeight;
h=Math.max(h,_223[i]);
}
}
h=(h>=0?h:0);
if(dojo.isMoz&&h){
h++;
}
}
for(i=0;(n=_222[i]);i++){
if(_223[i]!=h){
n.firstChild.style.height=h+"px";
}
}
},resetHeaderNodeHeight:function(){
for(var i=0,v,n;(v=this.views[i]);i++){
n=v.headerContentNode.firstChild;
if(n){
n.style.height="";
}
}
},renormalizeRow:function(_224){
var _225=[];
for(var i=0,v,n;(v=this.views[i])&&(n=v.getRowNode(_224));i++){
n.firstChild.style.height="";
_225.push(n);
}
this.normalizeRowNodeHeights(_225);
},getViewWidth:function(_226){
return this.views[_226].getWidth()||this.defaultWidth;
},measureHeader:function(){
this.resetHeaderNodeHeight();
this.forEach(function(_227){
_227.headerContentNode.style.height="";
});
var h=0;
this.forEach(function(_228){
h=Math.max(_228.headerNode.offsetHeight,h);
});
return h;
},measureContent:function(){
var h=0;
this.forEach(function(_229){
h=Math.max(_229.domNode.offsetHeight,h);
});
return h;
},findClient:function(_22a){
var c=this.grid.elasticView||-1;
if(c<0){
for(var i=1,v;(v=this.views[i]);i++){
if(v.viewWidth){
for(i=1;(v=this.views[i]);i++){
if(!v.viewWidth){
c=i;
break;
}
}
break;
}
}
}
if(c<0){
c=Math.floor(this.views.length/2);
}
return c;
},arrange:function(l,w){
var i,v,vw,len=this.views.length;
var c=(w<=0?len:this.findClient());
var _22b=function(v,l){
var ds=v.domNode.style;
var hs=v.headerNode.style;
if(!dojo._isBodyLtr()){
ds.right=l+"px";
if(dojo.isMoz){
hs.right=l+v.getScrollbarWidth()+"px";
hs.width=parseInt(hs.width,10)-v.getScrollbarWidth()+"px";
}else{
hs.right=l+"px";
}
}else{
ds.left=l+"px";
hs.left=l+"px";
}
ds.top=0+"px";
hs.top=0;
};
for(i=0;(v=this.views[i])&&(i<c);i++){
vw=this.getViewWidth(i);
v.setSize(vw,0);
_22b(v,l);
if(v.headerContentNode&&v.headerContentNode.firstChild){
vw=v.getColumnsWidth()+v.getScrollbarWidth();
}else{
vw=v.domNode.offsetWidth;
}
l+=vw;
}
i++;
var r=w;
for(var j=len-1;(v=this.views[j])&&(i<=j);j--){
vw=this.getViewWidth(j);
v.setSize(vw,0);
vw=v.domNode.offsetWidth;
r-=vw;
_22b(v,r);
}
if(c<len){
v=this.views[c];
vw=Math.max(1,r-l);
v.setSize(vw+"px",0);
_22b(v,l);
}
return l;
},renderRow:function(_22c,_22d,_22e){
var _22f=[];
for(var i=0,v,n,_230;(v=this.views[i])&&(n=_22d[i]);i++){
_230=v.renderRow(_22c);
n.appendChild(_230);
_22f.push(_230);
}
if(!_22e){
this.normalizeRowNodeHeights(_22f);
}
},rowRemoved:function(_231){
this.onEach("rowRemoved",[_231]);
},updateRow:function(_232,_233){
for(var i=0,v;v=this.views[i];i++){
v.updateRow(_232);
}
if(!_233){
this.renormalizeRow(_232);
}
},updateRowStyles:function(_234){
this.onEach("updateRowStyles",[_234]);
},setScrollTop:function(_235){
var top=_235;
for(var i=0,v;v=this.views[i];i++){
top=v.setScrollTop(_235);
if(dojo.isIE&&v.headerNode&&v.scrollboxNode){
v.headerNode.scrollLeft=v.scrollboxNode.scrollLeft;
}
}
return top;
},getFirstScrollingView:function(){
for(var i=0,v;(v=this.views[i]);i++){
if(v.hasHScrollbar()||v.hasVScrollbar()){
return v;
}
}
return null;
}});
}
if(!dojo._hasResource["dojox.grid._RowManager"]){
dojo._hasResource["dojox.grid._RowManager"]=true;
dojo.provide("dojox.grid._RowManager");
(function(){
var _236=function(_237,_238){
if(_237.style.cssText==undefined){
_237.setAttribute("style",_238);
}else{
_237.style.cssText=_238;
}
};
dojo.declare("dojox.grid._RowManager",null,{constructor:function(_239){
this.grid=_239;
},linesToEms:2,overRow:-2,prepareStylingRow:function(_23a,_23b){
return {index:_23a,node:_23b,odd:Boolean(_23a&1),selected:!!this.grid.selection.isSelected(_23a),over:this.isOver(_23a),customStyles:"",customClasses:"dojoxGridRow"};
},styleRowNode:function(_23c,_23d){
var row=this.prepareStylingRow(_23c,_23d);
this.grid.onStyleRow(row);
this.applyStyles(row);
},applyStyles:function(_23e){
var i=_23e;
i.node.className=i.customClasses;
var h=i.node.style.height;
_236(i.node,i.customStyles+";"+(i.node._style||""));
i.node.style.height=h;
},updateStyles:function(_23f){
this.grid.updateRowStyles(_23f);
},setOverRow:function(_240){
var last=this.overRow;
this.overRow=_240;
if((last!=this.overRow)&&(dojo.isString(last)||last>=0)){
this.updateStyles(last);
}
this.updateStyles(this.overRow);
},isOver:function(_241){
return (this.overRow==_241&&!dojo.hasClass(this.grid.domNode,"dojoxGridColumnResizing"));
}});
})();
}
if(!dojo._hasResource["dojox.grid._FocusManager"]){
dojo._hasResource["dojox.grid._FocusManager"]=true;
dojo.provide("dojox.grid._FocusManager");
dojo.declare("dojox.grid._FocusManager",null,{constructor:function(_242){
this.grid=_242;
this.cell=null;
this.rowIndex=-1;
this._connects=[];
this._headerConnects=[];
this.headerMenu=this.grid.headerMenu;
this._connects.push(dojo.connect(this.grid.domNode,"onfocus",this,"doFocus"));
this._connects.push(dojo.connect(this.grid.domNode,"onblur",this,"doBlur"));
this._connects.push(dojo.connect(this.grid.domNode,"oncontextmenu",this,"doContextMenu"));
this._connects.push(dojo.connect(this.grid.lastFocusNode,"onfocus",this,"doLastNodeFocus"));
this._connects.push(dojo.connect(this.grid.lastFocusNode,"onblur",this,"doLastNodeBlur"));
this._connects.push(dojo.connect(this.grid,"_onFetchComplete",this,"_delayedCellFocus"));
this._connects.push(dojo.connect(this.grid,"postrender",this,"_delayedHeaderFocus"));
},destroy:function(){
dojo.forEach(this._connects,dojo.disconnect);
dojo.forEach(this._headerConnects,dojo.disconnect);
delete this.grid;
delete this.cell;
},_colHeadNode:null,_colHeadFocusIdx:null,_contextMenuBindNode:null,tabbingOut:false,focusClass:"dojoxGridCellFocus",focusView:null,initFocusView:function(){
this.focusView=this.grid.views.getFirstScrollingView()||this.focusView||this.grid.views.views[0];
this._initColumnHeaders();
},isFocusCell:function(_243,_244){
return (this.cell==_243)&&(this.rowIndex==_244);
},isLastFocusCell:function(){
if(this.cell){
return (this.rowIndex==this.grid.rowCount-1)&&(this.cell.index==this.grid.layout.cellCount-1);
}
return false;
},isFirstFocusCell:function(){
if(this.cell){
return (this.rowIndex===0)&&(this.cell.index===0);
}
return false;
},isNoFocusCell:function(){
return (this.rowIndex<0)||!this.cell;
},isNavHeader:function(){
return (!!this._colHeadNode);
},getHeaderIndex:function(){
if(this._colHeadNode){
return dojo.indexOf(this._findHeaderCells(),this._colHeadNode);
}else{
return -1;
}
},_focusifyCellNode:function(_245){
var n=this.cell&&this.cell.getNode(this.rowIndex);
if(n){
dojo.toggleClass(n,this.focusClass,_245);
if(_245){
var sl=this.scrollIntoView();
try{
if(!this.grid.edit.isEditing()){
dojox.grid.util.fire(n,"focus");
if(sl){
this.cell.view.scrollboxNode.scrollLeft=sl;
}
}
}
catch(e){
}
}
}
},_delayedCellFocus:function(){
if(this.isNavHeader()||!this.grid._focused){
return;
}
var n=this.cell&&this.cell.getNode(this.rowIndex);
if(n){
try{
if(!this.grid.edit.isEditing()){
dojo.toggleClass(n,this.focusClass,true);
this.blurHeader();
dojox.grid.util.fire(n,"focus");
}
}
catch(e){
}
}
},_delayedHeaderFocus:function(){
if(this.isNavHeader()){
this.focusHeader();
this.grid.domNode.focus();
}
},_initColumnHeaders:function(){
dojo.forEach(this._headerConnects,dojo.disconnect);
this._headerConnects=[];
var _246=this._findHeaderCells();
for(var i=0;i<_246.length;i++){
this._headerConnects.push(dojo.connect(_246[i],"onfocus",this,"doColHeaderFocus"));
this._headerConnects.push(dojo.connect(_246[i],"onblur",this,"doColHeaderBlur"));
}
},_findHeaderCells:function(){
var _247=dojo.query("th",this.grid.viewsHeaderNode);
var _248=[];
for(var i=0;i<_247.length;i++){
var _249=_247[i];
var _24a=dojo.hasAttr(_249,"tabIndex");
var _24b=dojo.attr(_249,"tabIndex");
if(_24a&&_24b<0){
_248.push(_249);
}
}
return _248;
},_setActiveColHeader:function(_24c,_24d,_24e){
dojo.attr(this.grid.domNode,"aria-activedescendant",_24c.id);
if(_24e!=null&&_24e>=0&&_24e!=_24d){
dojo.toggleClass(this._findHeaderCells()[_24e],this.focusClass,false);
}
dojo.toggleClass(_24c,this.focusClass,true);
this._colHeadNode=_24c;
this._colHeadFocusIdx=_24d;
this._scrollHeader(this._colHeadFocusIdx);
},scrollIntoView:function(){
var info=(this.cell?this._scrollInfo(this.cell):null);
if(!info||!info.s){
return null;
}
var rt=this.grid.scroller.findScrollTop(this.rowIndex);
if(info.n&&info.sr){
if(info.n.offsetLeft+info.n.offsetWidth>info.sr.l+info.sr.w){
info.s.scrollLeft=info.n.offsetLeft+info.n.offsetWidth-info.sr.w;
}else{
if(info.n.offsetLeft<info.sr.l){
info.s.scrollLeft=info.n.offsetLeft;
}
}
}
if(info.r&&info.sr){
if(rt+info.r.offsetHeight>info.sr.t+info.sr.h){
this.grid.setScrollTop(rt+info.r.offsetHeight-info.sr.h);
}else{
if(rt<info.sr.t){
this.grid.setScrollTop(rt);
}
}
}
return info.s.scrollLeft;
},_scrollInfo:function(cell,_24f){
if(cell){
var cl=cell,sbn=cl.view.scrollboxNode,sbnr={w:sbn.clientWidth,l:sbn.scrollLeft,t:sbn.scrollTop,h:sbn.clientHeight},rn=cl.view.getRowNode(this.rowIndex);
return {c:cl,s:sbn,sr:sbnr,n:(_24f?_24f:cell.getNode(this.rowIndex)),r:rn};
}
return null;
},_scrollHeader:function(_250){
var info=null;
if(this._colHeadNode){
var cell=this.grid.getCell(_250);
info=this._scrollInfo(cell,cell.getNode(0));
}
if(info&&info.s&&info.sr&&info.n){
var _251=info.sr.l+info.sr.w;
if(info.n.offsetLeft+info.n.offsetWidth>_251){
info.s.scrollLeft=info.n.offsetLeft+info.n.offsetWidth-info.sr.w;
}else{
if(info.n.offsetLeft<info.sr.l){
info.s.scrollLeft=info.n.offsetLeft;
}else{
if(dojo.isIE<=7&&cell&&cell.view.headerNode){
cell.view.headerNode.scrollLeft=info.s.scrollLeft;
}
}
}
}
},_isHeaderHidden:function(){
var _252=this.focusView;
if(!_252){
for(var i=0,_253;(_253=this.grid.views.views[i]);i++){
if(_253.headerNode){
_252=_253;
break;
}
}
}
return (_252&&dojo.getComputedStyle(_252.headerNode).display=="none");
},colSizeAdjust:function(e,_254,_255){
var _256=this._findHeaderCells();
var view=this.focusView;
if(!view){
for(var i=0,_257;(_257=this.grid.views.views[i]);i++){
if(_257.header.tableMap.map){
view=_257;
break;
}
}
}
var _258=_256[_254];
if(!view||(_254==_256.length-1&&_254===0)){
return;
}
view.content.baseDecorateEvent(e);
e.cellNode=_258;
e.cellIndex=view.content.getCellNodeIndex(e.cellNode);
e.cell=(e.cellIndex>=0?this.grid.getCell(e.cellIndex):null);
if(view.header.canResize(e)){
var _259={l:_255};
var drag=view.header.colResizeSetup(e,false);
view.header.doResizeColumn(drag,null,_259);
view.update();
}
},styleRow:function(_25a){
return;
},setFocusIndex:function(_25b,_25c){
this.setFocusCell(this.grid.getCell(_25c),_25b);
},setFocusCell:function(_25d,_25e){
if(_25d&&!this.isFocusCell(_25d,_25e)){
this.tabbingOut=false;
if(this._colHeadNode){
this.blurHeader();
}
this._colHeadNode=this._colHeadFocusIdx=null;
this.focusGridView();
this._focusifyCellNode(false);
this.cell=_25d;
this.rowIndex=_25e;
this._focusifyCellNode(true);
}
if(dojo.isOpera){
setTimeout(dojo.hitch(this.grid,"onCellFocus",this.cell,this.rowIndex),1);
}else{
this.grid.onCellFocus(this.cell,this.rowIndex);
}
},next:function(){
if(this.cell){
var row=this.rowIndex,col=this.cell.index+1,cc=this.grid.layout.cellCount-1,rc=this.grid.rowCount-1;
if(col>cc){
col=0;
row++;
}
if(row>rc){
col=cc;
row=rc;
}
if(this.grid.edit.isEditing()){
var _25f=this.grid.getCell(col);
if(!this.isLastFocusCell()&&(!_25f.editable||this.grid.canEdit&&!this.grid.canEdit(_25f,row))){
this.cell=_25f;
this.rowIndex=row;
this.next();
return;
}
}
this.setFocusIndex(row,col);
}
},previous:function(){
if(this.cell){
var row=(this.rowIndex||0),col=(this.cell.index||0)-1;
if(col<0){
col=this.grid.layout.cellCount-1;
row--;
}
if(row<0){
row=0;
col=0;
}
if(this.grid.edit.isEditing()){
var _260=this.grid.getCell(col);
if(!this.isFirstFocusCell()&&!_260.editable){
this.cell=_260;
this.rowIndex=row;
this.previous();
return;
}
}
this.setFocusIndex(row,col);
}
},move:function(_261,_262){
var _263=_262<0?-1:1;
if(this.isNavHeader()){
var _264=this._findHeaderCells();
var _265=currentIdx=dojo.indexOf(_264,this._colHeadNode);
currentIdx+=_262;
while(currentIdx>=0&&currentIdx<_264.length&&_264[currentIdx].style.display=="none"){
currentIdx+=_263;
}
if((currentIdx>=0)&&(currentIdx<_264.length)){
this._setActiveColHeader(_264[currentIdx],currentIdx,_265);
}
}else{
if(this.cell){
var sc=this.grid.scroller,r=this.rowIndex,rc=this.grid.rowCount-1,row=Math.min(rc,Math.max(0,r+_261));
if(_261){
if(_261>0){
if(row>sc.getLastPageRow(sc.page)){
this.grid.setScrollTop(this.grid.scrollTop+sc.findScrollTop(row)-sc.findScrollTop(r));
}
}else{
if(_261<0){
if(row<=sc.getPageRow(sc.page)){
this.grid.setScrollTop(this.grid.scrollTop-sc.findScrollTop(r)-sc.findScrollTop(row));
}
}
}
}
var cc=this.grid.layout.cellCount-1,i=this.cell.index,col=Math.min(cc,Math.max(0,i+_262));
var cell=this.grid.getCell(col);
while(col>=0&&col<cc&&cell&&cell.hidden===true){
col+=_263;
cell=this.grid.getCell(col);
}
if(!cell||cell.hidden===true){
col=i;
}
var n=cell.getNode(row);
if(!n&&_261){
if((row+_261)>=0&&(row+_261)<=rc){
this.move(_261>0?++_261:--_261,_262);
}
return;
}else{
if((!n||dojo.style(n,"display")==="none")&&_262){
if((col+_261)>=0&&(col+_261)<=cc){
this.move(_261,_262>0?++_262:--_262);
}
return;
}
}
this.setFocusIndex(row,col);
if(_261){
this.grid.updateRow(r);
}
}
}
},previousKey:function(e){
if(this.grid.edit.isEditing()){
dojo.stopEvent(e);
this.previous();
}else{
if(!this.isNavHeader()&&!this._isHeaderHidden()){
this.grid.domNode.focus();
dojo.stopEvent(e);
}else{
this.tabOut(this.grid.domNode);
if(this._colHeadFocusIdx!=null){
dojo.toggleClass(this._findHeaderCells()[this._colHeadFocusIdx],this.focusClass,false);
this._colHeadFocusIdx=null;
}
this._focusifyCellNode(false);
}
}
},nextKey:function(e){
var _266=(this.grid.rowCount===0);
if(e.target===this.grid.domNode&&this._colHeadFocusIdx==null){
this.focusHeader();
dojo.stopEvent(e);
}else{
if(this.isNavHeader()){
this.blurHeader();
if(!this.findAndFocusGridCell()){
this.tabOut(this.grid.lastFocusNode);
}
this._colHeadNode=this._colHeadFocusIdx=null;
}else{
if(this.grid.edit.isEditing()){
dojo.stopEvent(e);
this.next();
}else{
this.tabOut(this.grid.lastFocusNode);
}
}
}
},tabOut:function(_267){
this.tabbingOut=true;
_267.focus();
},focusGridView:function(){
dojox.grid.util.fire(this.focusView,"focus");
},focusGrid:function(_268){
this.focusGridView();
this._focusifyCellNode(true);
},findAndFocusGridCell:function(){
var _269=true;
var _26a=(this.grid.rowCount===0);
if(this.isNoFocusCell()&&!_26a){
var _26b=0;
var cell=this.grid.getCell(_26b);
if(cell.hidden){
_26b=this.isNavHeader()?this._colHeadFocusIdx:0;
}
this.setFocusIndex(0,_26b);
}else{
if(this.cell&&!_26a){
if(this.focusView&&!this.focusView.rowNodes[this.rowIndex]){
this.grid.scrollToRow(this.rowIndex);
}
this.focusGrid();
}else{
_269=false;
}
}
this._colHeadNode=this._colHeadFocusIdx=null;
return _269;
},focusHeader:function(){
var _26c=this._findHeaderCells();
var _26d=this._colHeadFocusIdx;
if(this._isHeaderHidden()){
this.findAndFocusGridCell();
}else{
if(!this._colHeadFocusIdx){
if(this.isNoFocusCell()){
this._colHeadFocusIdx=0;
}else{
this._colHeadFocusIdx=this.cell.index;
}
}
}
this._colHeadNode=_26c[this._colHeadFocusIdx];
while(this._colHeadNode&&this._colHeadFocusIdx>=0&&this._colHeadFocusIdx<_26c.length&&this._colHeadNode.style.display=="none"){
this._colHeadFocusIdx++;
this._colHeadNode=_26c[this._colHeadFocusIdx];
}
if(this._colHeadNode&&this._colHeadNode.style.display!="none"){
if(this.headerMenu&&this._contextMenuBindNode!=this.grid.domNode){
this.headerMenu.unBindDomNode(this.grid.viewsHeaderNode);
this.headerMenu.bindDomNode(this.grid.domNode);
this._contextMenuBindNode=this.grid.domNode;
}
this._setActiveColHeader(this._colHeadNode,this._colHeadFocusIdx,_26d);
this._scrollHeader(this._colHeadFocusIdx);
this._focusifyCellNode(false);
}else{
this.findAndFocusGridCell();
}
},blurHeader:function(){
dojo.removeClass(this._colHeadNode,this.focusClass);
dojo.removeAttr(this.grid.domNode,"aria-activedescendant");
if(this.headerMenu&&this._contextMenuBindNode==this.grid.domNode){
var _26e=this.grid.viewsHeaderNode;
this.headerMenu.unBindDomNode(this.grid.domNode);
this.headerMenu.bindDomNode(_26e);
this._contextMenuBindNode=_26e;
}
},doFocus:function(e){
if(e&&e.target!=e.currentTarget){
dojo.stopEvent(e);
return;
}
if(!this.tabbingOut){
this.focusHeader();
}
this.tabbingOut=false;
dojo.stopEvent(e);
},doBlur:function(e){
dojo.stopEvent(e);
},doContextMenu:function(e){
if(!this.headerMenu){
dojo.stopEvent(e);
}
},doLastNodeFocus:function(e){
if(this.tabbingOut){
this._focusifyCellNode(false);
}else{
if(this.grid.rowCount>0){
if(this.isNoFocusCell()){
this.setFocusIndex(0,0);
}
this._focusifyCellNode(true);
}else{
this.focusHeader();
}
}
this.tabbingOut=false;
dojo.stopEvent(e);
},doLastNodeBlur:function(e){
dojo.stopEvent(e);
},doColHeaderFocus:function(e){
this._setActiveColHeader(e.target,dojo.attr(e.target,"idx"),this._colHeadFocusIdx);
this._scrollHeader(this.getHeaderIndex());
dojo.stopEvent(e);
},doColHeaderBlur:function(e){
dojo.toggleClass(e.target,this.focusClass,false);
}});
}
if(!dojo._hasResource["dojox.grid._EditManager"]){
dojo._hasResource["dojox.grid._EditManager"]=true;
dojo.provide("dojox.grid._EditManager");
dojo.declare("dojox.grid._EditManager",null,{constructor:function(_26f){
this.grid=_26f;
if(dojo.isIE){
this.connections=[dojo.connect(document.body,"onfocus",dojo.hitch(this,"_boomerangFocus"))];
}else{
this.connections=[dojo.connect(this.grid,"onBlur",this,"apply")];
}
},info:{},destroy:function(){
dojo.forEach(this.connections,dojo.disconnect);
},cellFocus:function(_270,_271){
if(this.grid.singleClickEdit||this.isEditRow(_271)){
this.setEditCell(_270,_271);
}else{
this.apply();
}
if(this.isEditing()||(_270&&_270.editable&&_270.alwaysEditing)){
this._focusEditor(_270,_271);
}
},rowClick:function(e){
if(this.isEditing()&&!this.isEditRow(e.rowIndex)){
this.apply();
}
},styleRow:function(_272){
if(_272.index==this.info.rowIndex){
_272.customClasses+=" dojoxGridRowEditing";
}
},dispatchEvent:function(e){
var c=e.cell,ed=(c&&c["editable"])?c:0;
return ed&&ed.dispatchEvent(e.dispatch,e);
},isEditing:function(){
return this.info.rowIndex!==undefined;
},isEditCell:function(_273,_274){
return (this.info.rowIndex===_273)&&(this.info.cell.index==_274);
},isEditRow:function(_275){
return this.info.rowIndex===_275;
},setEditCell:function(_276,_277){
if(!this.isEditCell(_277,_276.index)&&this.grid.canEdit&&this.grid.canEdit(_276,_277)){
this.start(_276,_277,_276.editable||this.isEditRow(_277));
}
},_focusEditor:function(_278,_279){
dojox.grid.util.fire(_278,"focus",[_279]);
},focusEditor:function(){
if(this.isEditing()){
this._focusEditor(this.info.cell,this.info.rowIndex);
}
},_boomerangWindow:500,_shouldCatchBoomerang:function(){
return this._catchBoomerang>new Date().getTime();
},_boomerangFocus:function(){
if(this._shouldCatchBoomerang()){
this.grid.focus.focusGrid();
this.focusEditor();
this._catchBoomerang=0;
}
},_doCatchBoomerang:function(){
if(dojo.isIE){
this._catchBoomerang=new Date().getTime()+this._boomerangWindow;
}
},start:function(_27a,_27b,_27c){
this.grid.beginUpdate();
this.editorApply();
if(this.isEditing()&&!this.isEditRow(_27b)){
this.applyRowEdit();
this.grid.updateRow(_27b);
}
if(_27c){
this.info={cell:_27a,rowIndex:_27b};
this.grid.doStartEdit(_27a,_27b);
this.grid.updateRow(_27b);
}else{
this.info={};
}
this.grid.endUpdate();
this.grid.focus.focusGrid();
this._focusEditor(_27a,_27b);
this._doCatchBoomerang();
},_editorDo:function(_27d){
var c=this.info.cell;
if(c&&c.editable){
c[_27d](this.info.rowIndex);
}
},editorApply:function(){
try{
this._editorDo("apply");
}
catch(e){
this._editorDo("cancel");
}
},editorCancel:function(){
this._editorDo("cancel");
},applyCellEdit:function(_27e,_27f,_280){
if(this.grid.canEdit(_27f,_280)){
this.grid.doApplyCellEdit(_27e,_280,_27f.field);
}
},applyRowEdit:function(){
this.grid.doApplyEdit(this.info.rowIndex,this.info.cell.field);
},apply:function(){
if(this.isEditing()){
this.grid.beginUpdate();
this.editorApply();
this.applyRowEdit();
this.info={};
this.grid.endUpdate();
this.grid.focus.focusGrid();
this._doCatchBoomerang();
}
},cancel:function(){
if(this.isEditing()){
this.grid.beginUpdate();
this.editorCancel();
this.info={};
this.grid.endUpdate();
this.grid.focus.focusGrid();
this._doCatchBoomerang();
}
},save:function(_281,_282){
var c=this.info.cell;
if(this.isEditRow(_281)&&(!_282||c.view==_282)&&c.editable){
c.save(c,this.info.rowIndex);
}
},restore:function(_283,_284){
var c=this.info.cell;
if(this.isEditRow(_284)&&c.view==_283&&c.editable){
c.restore(c,this.info.rowIndex);
}
}});
}
if(!dojo._hasResource["dojox.grid.Selection"]){
dojo._hasResource["dojox.grid.Selection"]=true;
dojo.provide("dojox.grid.Selection");
dojo.declare("dojox.grid.Selection",null,{constructor:function(_285){
this.grid=_285;
this.selected=[];
this.setMode(_285.selectionMode);
},mode:"extended",selected:null,updating:0,selectedIndex:-1,setMode:function(mode){
if(this.selected.length){
this.deselectAll();
}
if(mode!="extended"&&mode!="multiple"&&mode!="single"&&mode!="none"){
this.mode="extended";
}else{
this.mode=mode;
}
},onCanSelect:function(_286){
return this.grid.onCanSelect(_286);
},onCanDeselect:function(_287){
return this.grid.onCanDeselect(_287);
},onSelected:function(_288){
},onDeselected:function(_289){
},onChanging:function(){
},onChanged:function(){
},isSelected:function(_28a){
if(this.mode=="none"){
return false;
}
return this.selected[_28a];
},getFirstSelected:function(){
if(!this.selected.length||this.mode=="none"){
return -1;
}
for(var i=0,l=this.selected.length;i<l;i++){
if(this.selected[i]){
return i;
}
}
return -1;
},getNextSelected:function(_28b){
if(this.mode=="none"){
return -1;
}
for(var i=_28b+1,l=this.selected.length;i<l;i++){
if(this.selected[i]){
return i;
}
}
return -1;
},getSelected:function(){
var _28c=[];
for(var i=0,l=this.selected.length;i<l;i++){
if(this.selected[i]){
_28c.push(i);
}
}
return _28c;
},getSelectedCount:function(){
var c=0;
for(var i=0;i<this.selected.length;i++){
if(this.selected[i]){
c++;
}
}
return c;
},_beginUpdate:function(){
if(this.updating===0){
this.onChanging();
}
this.updating++;
},_endUpdate:function(){
this.updating--;
if(this.updating===0){
this.onChanged();
}
},select:function(_28d){
if(this.mode=="none"){
return;
}
if(this.mode!="multiple"){
this.deselectAll(_28d);
this.addToSelection(_28d);
}else{
this.toggleSelect(_28d);
}
},addToSelection:function(_28e){
if(this.mode=="none"){
return;
}
if(dojo.isArray(_28e)){
dojo.forEach(_28e,this.addToSelection,this);
return;
}
_28e=Number(_28e);
if(this.selected[_28e]){
this.selectedIndex=_28e;
}else{
if(this.onCanSelect(_28e)!==false){
this.selectedIndex=_28e;
var _28f=this.grid.getRowNode(_28e);
if(_28f){
dojo.attr(_28f,"aria-selected","true");
}
this._beginUpdate();
this.selected[_28e]=true;
this.onSelected(_28e);
this._endUpdate();
}
}
},deselect:function(_290){
if(this.mode=="none"){
return;
}
if(dojo.isArray(_290)){
dojo.forEach(_290,this.deselect,this);
return;
}
_290=Number(_290);
if(this.selectedIndex==_290){
this.selectedIndex=-1;
}
if(this.selected[_290]){
if(this.onCanDeselect(_290)===false){
return;
}
var _291=this.grid.getRowNode(_290);
if(_291){
dojo.attr(_291,"aria-selected","false");
}
this._beginUpdate();
delete this.selected[_290];
this.onDeselected(_290);
this._endUpdate();
}
},setSelected:function(_292,_293){
this[(_293?"addToSelection":"deselect")](_292);
},toggleSelect:function(_294){
if(dojo.isArray(_294)){
dojo.forEach(_294,this.toggleSelect,this);
return;
}
this.setSelected(_294,!this.selected[_294]);
},_range:function(_295,inTo,func){
var s=(_295>=0?_295:inTo),e=inTo;
if(s>e){
e=s;
s=inTo;
}
for(var i=s;i<=e;i++){
func(i);
}
},selectRange:function(_296,inTo){
this._range(_296,inTo,dojo.hitch(this,"addToSelection"));
},deselectRange:function(_297,inTo){
this._range(_297,inTo,dojo.hitch(this,"deselect"));
},insert:function(_298){
this.selected.splice(_298,0,false);
if(this.selectedIndex>=_298){
this.selectedIndex++;
}
},remove:function(_299){
this.selected.splice(_299,1);
if(this.selectedIndex>=_299){
this.selectedIndex--;
}
},deselectAll:function(_29a){
for(var i in this.selected){
if((i!=_29a)&&(this.selected[i]===true)){
this.deselect(i);
}
}
},clickSelect:function(_29b,_29c,_29d){
if(this.mode=="none"){
return;
}
this._beginUpdate();
if(this.mode!="extended"){
this.select(_29b);
}else{
var _29e=this.selectedIndex;
if(!_29c){
this.deselectAll(_29b);
}
if(_29d){
this.selectRange(_29e,_29b);
}else{
if(_29c){
this.toggleSelect(_29b);
}else{
this.addToSelection(_29b);
}
}
}
this._endUpdate();
},clickSelectEvent:function(e){
this.clickSelect(e.rowIndex,dojo.isCopyKey(e),e.shiftKey);
},clear:function(){
this._beginUpdate();
this.deselectAll();
this._endUpdate();
}});
}
if(!dojo._hasResource["dojox.grid._Events"]){
dojo._hasResource["dojox.grid._Events"]=true;
dojo.provide("dojox.grid._Events");
dojo.declare("dojox.grid._Events",null,{cellOverClass:"dojoxGridCellOver",onKeyEvent:function(e){
this.dispatchKeyEvent(e);
},onContentEvent:function(e){
this.dispatchContentEvent(e);
},onHeaderEvent:function(e){
this.dispatchHeaderEvent(e);
},onStyleRow:function(_29f){
var i=_29f;
i.customClasses+=(i.odd?" dojoxGridRowOdd":"")+(i.selected?" dojoxGridRowSelected":"")+(i.over?" dojoxGridRowOver":"");
this.focus.styleRow(_29f);
this.edit.styleRow(_29f);
},onKeyDown:function(e){
if(e.altKey||e.metaKey){
return;
}
var dk=dojo.keys;
var _2a0;
switch(e.keyCode){
case dk.ESCAPE:
this.edit.cancel();
break;
case dk.ENTER:
if(!this.edit.isEditing()){
_2a0=this.focus.getHeaderIndex();
if(_2a0>=0){
this.setSortIndex(_2a0);
break;
}else{
this.selection.clickSelect(this.focus.rowIndex,dojo.isCopyKey(e),e.shiftKey);
}
dojo.stopEvent(e);
}
if(!e.shiftKey){
var _2a1=this.edit.isEditing();
this.edit.apply();
if(!_2a1){
this.edit.setEditCell(this.focus.cell,this.focus.rowIndex);
}
}
if(!this.edit.isEditing()){
var _2a2=this.focus.focusView||this.views.views[0];
_2a2.content.decorateEvent(e);
this.onRowClick(e);
dojo.stopEvent(e);
}
break;
case dk.SPACE:
if(!this.edit.isEditing()){
_2a0=this.focus.getHeaderIndex();
if(_2a0>=0){
this.setSortIndex(_2a0);
break;
}else{
this.selection.clickSelect(this.focus.rowIndex,dojo.isCopyKey(e),e.shiftKey);
}
dojo.stopEvent(e);
}
break;
case dk.TAB:
this.focus[e.shiftKey?"previousKey":"nextKey"](e);
break;
case dk.LEFT_ARROW:
case dk.RIGHT_ARROW:
if(!this.edit.isEditing()){
var _2a3=e.keyCode;
dojo.stopEvent(e);
_2a0=this.focus.getHeaderIndex();
if(_2a0>=0&&(e.shiftKey&&e.ctrlKey)){
this.focus.colSizeAdjust(e,_2a0,(_2a3==dk.LEFT_ARROW?-1:1)*5);
}else{
var _2a4=(_2a3==dk.LEFT_ARROW)?1:-1;
if(dojo._isBodyLtr()){
_2a4*=-1;
}
this.focus.move(0,_2a4);
}
}
break;
case dk.UP_ARROW:
if(!this.edit.isEditing()&&this.focus.rowIndex!==0){
dojo.stopEvent(e);
this.focus.move(-1,0);
}
break;
case dk.DOWN_ARROW:
if(!this.edit.isEditing()&&this.focus.rowIndex+1!=this.rowCount){
dojo.stopEvent(e);
this.focus.move(1,0);
}
break;
case dk.PAGE_UP:
if(!this.edit.isEditing()&&this.focus.rowIndex!==0){
dojo.stopEvent(e);
if(this.focus.rowIndex!=this.scroller.firstVisibleRow+1){
this.focus.move(this.scroller.firstVisibleRow-this.focus.rowIndex,0);
}else{
this.setScrollTop(this.scroller.findScrollTop(this.focus.rowIndex-1));
this.focus.move(this.scroller.firstVisibleRow-this.scroller.lastVisibleRow+1,0);
}
}
break;
case dk.PAGE_DOWN:
if(!this.edit.isEditing()&&this.focus.rowIndex+1!=this.rowCount){
dojo.stopEvent(e);
if(this.focus.rowIndex!=this.scroller.lastVisibleRow-1){
this.focus.move(this.scroller.lastVisibleRow-this.focus.rowIndex-1,0);
}else{
this.setScrollTop(this.scroller.findScrollTop(this.focus.rowIndex+1));
this.focus.move(this.scroller.lastVisibleRow-this.scroller.firstVisibleRow-1,0);
}
}
break;
default:
break;
}
},onMouseOver:function(e){
e.rowIndex==-1?this.onHeaderCellMouseOver(e):this.onCellMouseOver(e);
},onMouseOut:function(e){
e.rowIndex==-1?this.onHeaderCellMouseOut(e):this.onCellMouseOut(e);
},onMouseDown:function(e){
e.rowIndex==-1?this.onHeaderCellMouseDown(e):this.onCellMouseDown(e);
},onMouseOverRow:function(e){
if(!this.rows.isOver(e.rowIndex)){
this.rows.setOverRow(e.rowIndex);
e.rowIndex==-1?this.onHeaderMouseOver(e):this.onRowMouseOver(e);
}
},onMouseOutRow:function(e){
if(this.rows.isOver(-1)){
this.onHeaderMouseOut(e);
}else{
if(!this.rows.isOver(-2)){
this.rows.setOverRow(-2);
this.onRowMouseOut(e);
}
}
},onMouseDownRow:function(e){
if(e.rowIndex!=-1){
this.onRowMouseDown(e);
}
},onCellMouseOver:function(e){
if(e.cellNode){
dojo.addClass(e.cellNode,this.cellOverClass);
}
},onCellMouseOut:function(e){
if(e.cellNode){
dojo.removeClass(e.cellNode,this.cellOverClass);
}
},onCellMouseDown:function(e){
},onCellClick:function(e){
this._click[0]=this._click[1];
this._click[1]=e;
if(!this.edit.isEditCell(e.rowIndex,e.cellIndex)){
this.focus.setFocusCell(e.cell,e.rowIndex);
}
this.onRowClick(e);
},onCellDblClick:function(e){
if(this._click.length>1&&dojo.isIE){
this.edit.setEditCell(this._click[1].cell,this._click[1].rowIndex);
}else{
if(this._click.length>1&&this._click[0].rowIndex!=this._click[1].rowIndex){
this.edit.setEditCell(this._click[0].cell,this._click[0].rowIndex);
}else{
this.edit.setEditCell(e.cell,e.rowIndex);
}
}
this.onRowDblClick(e);
},onCellContextMenu:function(e){
this.onRowContextMenu(e);
},onCellFocus:function(_2a5,_2a6){
this.edit.cellFocus(_2a5,_2a6);
},onRowClick:function(e){
this.edit.rowClick(e);
this.selection.clickSelectEvent(e);
},onRowDblClick:function(e){
},onRowMouseOver:function(e){
},onRowMouseOut:function(e){
},onRowMouseDown:function(e){
},onRowContextMenu:function(e){
dojo.stopEvent(e);
},onHeaderMouseOver:function(e){
},onHeaderMouseOut:function(e){
},onHeaderCellMouseOver:function(e){
if(e.cellNode){
dojo.addClass(e.cellNode,this.cellOverClass);
}
},onHeaderCellMouseOut:function(e){
if(e.cellNode){
dojo.removeClass(e.cellNode,this.cellOverClass);
}
},onHeaderCellMouseDown:function(e){
},onHeaderClick:function(e){
},onHeaderCellClick:function(e){
this.setSortIndex(e.cell.index);
this.onHeaderClick(e);
},onHeaderDblClick:function(e){
},onHeaderCellDblClick:function(e){
this.onHeaderDblClick(e);
},onHeaderCellContextMenu:function(e){
this.onHeaderContextMenu(e);
},onHeaderContextMenu:function(e){
if(!this.headerMenu){
dojo.stopEvent(e);
}
},onStartEdit:function(_2a7,_2a8){
},onApplyCellEdit:function(_2a9,_2aa,_2ab){
},onCancelEdit:function(_2ac){
},onApplyEdit:function(_2ad){
},onCanSelect:function(_2ae){
return true;
},onCanDeselect:function(_2af){
return true;
},onSelected:function(_2b0){
this.updateRowStyles(_2b0);
},onDeselected:function(_2b1){
this.updateRowStyles(_2b1);
},onSelectionChanged:function(){
}});
}
if(!dojo._hasResource["dojox.grid._Grid"]){
dojo._hasResource["dojox.grid._Grid"]=true;
dojo.provide("dojox.grid._Grid");
(function(){
if(!dojo.isCopyKey){
dojo.isCopyKey=dojo.dnd.getCopyKeyState;
}
dojo.declare("dojox.grid._Grid",[dijit._Widget,dijit._Templated,dojox.grid._Events],{templateString:"<div hidefocus=\"hidefocus\" role=\"grid\" dojoAttachEvent=\"onmouseout:_mouseOut\">\n\t<div class=\"dojoxGridMasterHeader\" dojoAttachPoint=\"viewsHeaderNode\" role=\"presentation\"></div>\n\t<div class=\"dojoxGridMasterView\" dojoAttachPoint=\"viewsNode\" role=\"presentation\"></div>\n\t<div class=\"dojoxGridMasterMessages\" style=\"display: none;\" dojoAttachPoint=\"messagesNode\"></div>\n\t<span dojoAttachPoint=\"lastFocusNode\" tabindex=\"0\"></span>\n</div>\n",classTag:"dojoxGrid",rowCount:5,keepRows:75,rowsPerPage:25,autoWidth:false,initialWidth:"",autoHeight:"",rowHeight:0,autoRender:true,defaultHeight:"15em",height:"",structure:null,elasticView:-1,singleClickEdit:false,selectionMode:"extended",rowSelector:"",columnReordering:false,headerMenu:null,placeholderLabel:"GridColumns",selectable:false,_click:null,loadingMessage:"<span class='dojoxGridLoading'>${loadingState}</span>",errorMessage:"<span class='dojoxGridError'>${errorState}</span>",noDataMessage:"",escapeHTMLInData:true,formatterScope:null,editable:false,sortInfo:0,themeable:true,_placeholders:null,_layoutClass:dojox.grid._Layout,buildRendering:function(){
this.inherited(arguments);
if(!this.domNode.getAttribute("tabIndex")){
this.domNode.tabIndex="0";
}
this.createScroller();
this.createLayout();
this.createViews();
this.createManagers();
this.createSelection();
this.connect(this.selection,"onSelected","onSelected");
this.connect(this.selection,"onDeselected","onDeselected");
this.connect(this.selection,"onChanged","onSelectionChanged");
dojox.html.metrics.initOnFontResize();
this.connect(dojox.html.metrics,"onFontResize","textSizeChanged");
dojox.grid.util.funnelEvents(this.domNode,this,"doKeyEvent",dojox.grid.util.keyEvents);
if(this.selectionMode!="none"){
dojo.attr(this.domNode,"aria-multiselectable",this.selectionMode=="single"?"false":"true");
}
dojo.addClass(this.domNode,this.classTag);
if(!this.isLeftToRight()){
dojo.addClass(this.domNode,this.classTag+"Rtl");
}
},postMixInProperties:function(){
this.inherited(arguments);
var _2b2=dojo.i18n.getLocalization("dijit","loading",this.lang);
this.loadingMessage=dojo.string.substitute(this.loadingMessage,_2b2);
this.errorMessage=dojo.string.substitute(this.errorMessage,_2b2);
if(this.srcNodeRef&&this.srcNodeRef.style.height){
this.height=this.srcNodeRef.style.height;
}
this._setAutoHeightAttr(this.autoHeight,true);
this.lastScrollTop=this.scrollTop=0;
},postCreate:function(){
this._placeholders=[];
this._setHeaderMenuAttr(this.headerMenu);
this._setStructureAttr(this.structure);
this._click=[];
this.inherited(arguments);
if(this.domNode&&this.autoWidth&&this.initialWidth){
this.domNode.style.width=this.initialWidth;
}
if(this.domNode&&!this.editable){
dojo.attr(this.domNode,"aria-readonly","true");
}
},destroy:function(){
this.domNode.onReveal=null;
this.domNode.onSizeChange=null;
delete this._click;
this.edit.destroy();
delete this.edit;
this.views.destroyViews();
if(this.scroller){
this.scroller.destroy();
delete this.scroller;
}
if(this.focus){
this.focus.destroy();
delete this.focus;
}
if(this.headerMenu&&this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
p.unReplace(true);
});
this.headerMenu.unBindDomNode(this.viewsHeaderNode);
}
this.inherited(arguments);
},_setAutoHeightAttr:function(ah,_2b3){
if(typeof ah=="string"){
if(!ah||ah=="false"){
ah=false;
}else{
if(ah=="true"){
ah=true;
}else{
ah=window.parseInt(ah,10);
}
}
}
if(typeof ah=="number"){
if(isNaN(ah)){
ah=false;
}
if(ah<0){
ah=true;
}else{
if(ah===0){
ah=false;
}
}
}
this.autoHeight=ah;
if(typeof ah=="boolean"){
this._autoHeight=ah;
}else{
if(typeof ah=="number"){
this._autoHeight=(ah>=this.get("rowCount"));
}else{
this._autoHeight=false;
}
}
if(this._started&&!_2b3){
this.render();
}
},_getRowCountAttr:function(){
return this.updating&&this.invalidated&&this.invalidated.rowCount!=undefined?this.invalidated.rowCount:this.rowCount;
},textSizeChanged:function(){
this.render();
},sizeChange:function(){
this.update();
},createManagers:function(){
this.rows=new dojox.grid._RowManager(this);
this.focus=new dojox.grid._FocusManager(this);
this.edit=new dojox.grid._EditManager(this);
},createSelection:function(){
this.selection=new dojox.grid.Selection(this);
},createScroller:function(){
this.scroller=new dojox.grid._Scroller();
this.scroller.grid=this;
this.scroller.renderRow=dojo.hitch(this,"renderRow");
this.scroller.removeRow=dojo.hitch(this,"rowRemoved");
},createLayout:function(){
this.layout=new this._layoutClass(this);
this.connect(this.layout,"moveColumn","onMoveColumn");
},onMoveColumn:function(){
this.render();
},onResizeColumn:function(_2b4){
},createViews:function(){
this.views=new dojox.grid._ViewManager(this);
this.views.createView=dojo.hitch(this,"createView");
},createView:function(_2b5,idx){
var c=dojo.getObject(_2b5);
var view=new c({grid:this,index:idx});
this.viewsNode.appendChild(view.domNode);
this.viewsHeaderNode.appendChild(view.headerNode);
this.views.addView(view);
dojo.attr(this.domNode,"align",dojo._isBodyLtr()?"left":"right");
return view;
},buildViews:function(){
for(var i=0,vs;(vs=this.layout.structure[i]);i++){
this.createView(vs.type||dojox._scopeName+".grid._View",i).setStructure(vs);
}
this.scroller.setContentNodes(this.views.getContentNodes());
},_setStructureAttr:function(_2b6){
var s=_2b6;
if(s&&dojo.isString(s)){
dojo.deprecated("dojox.grid._Grid.set('structure', 'objVar')","use dojox.grid._Grid.set('structure', objVar) instead","2.0");
s=dojo.getObject(s);
}
this.structure=s;
if(!s){
if(this.layout.structure){
s=this.layout.structure;
}else{
return;
}
}
this.views.destroyViews();
this.focus.focusView=null;
if(s!==this.layout.structure){
this.layout.setStructure(s);
}
this._structureChanged();
},setStructure:function(_2b7){
dojo.deprecated("dojox.grid._Grid.setStructure(obj)","use dojox.grid._Grid.set('structure', obj) instead.","2.0");
this._setStructureAttr(_2b7);
},getColumnTogglingItems:function(){
return dojo.map(this.layout.cells,function(cell){
if(!cell.menuItems){
cell.menuItems=[];
}
var self=this;
var item=new dijit.CheckedMenuItem({label:cell.name,checked:!cell.hidden,_gridCell:cell,onChange:function(_2b8){
if(self.layout.setColumnVisibility(this._gridCell.index,_2b8)){
var _2b9=this._gridCell.menuItems;
if(_2b9.length>1){
dojo.forEach(_2b9,function(item){
if(item!==this){
item.setAttribute("checked",_2b8);
}
},this);
}
_2b8=dojo.filter(self.layout.cells,function(c){
if(c.menuItems.length>1){
dojo.forEach(c.menuItems,"item.set('disabled', false);");
}else{
c.menuItems[0].set("disabled",false);
}
return !c.hidden;
});
if(_2b8.length==1){
dojo.forEach(_2b8[0].menuItems,"item.set('disabled', true);");
}
}
},destroy:function(){
var _2ba=dojo.indexOf(this._gridCell.menuItems,this);
this._gridCell.menuItems.splice(_2ba,1);
delete this._gridCell;
dijit.CheckedMenuItem.prototype.destroy.apply(this,arguments);
}});
cell.menuItems.push(item);
return item;
},this);
},_setHeaderMenuAttr:function(menu){
if(this._placeholders&&this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
p.unReplace(true);
});
this._placeholders=[];
}
if(this.headerMenu){
this.headerMenu.unBindDomNode(this.viewsHeaderNode);
}
this.headerMenu=menu;
if(!menu){
return;
}
this.headerMenu.bindDomNode(this.viewsHeaderNode);
if(this.headerMenu.getPlaceholders){
this._placeholders=this.headerMenu.getPlaceholders(this.placeholderLabel);
}
},setHeaderMenu:function(menu){
dojo.deprecated("dojox.grid._Grid.setHeaderMenu(obj)","use dojox.grid._Grid.set('headerMenu', obj) instead.","2.0");
this._setHeaderMenuAttr(menu);
},setupHeaderMenu:function(){
if(this._placeholders&&this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
if(p._replaced){
p.unReplace(true);
}
p.replace(this.getColumnTogglingItems());
},this);
}
},_fetch:function(_2bb){
this.setScrollTop(0);
},getItem:function(_2bc){
return null;
},showMessage:function(_2bd){
if(_2bd){
this.messagesNode.innerHTML=_2bd;
this.messagesNode.style.display="";
}else{
this.messagesNode.innerHTML="";
this.messagesNode.style.display="none";
}
},_structureChanged:function(){
this.buildViews();
if(this.autoRender&&this._started){
this.render();
}
},hasLayout:function(){
return this.layout.cells.length;
},resize:function(_2be,_2bf){
this._pendingChangeSize=_2be;
this._pendingResultSize=_2bf;
this.sizeChange();
},_getPadBorder:function(){
this._padBorder=this._padBorder||dojo._getPadBorderExtents(this.domNode);
return this._padBorder;
},_getHeaderHeight:function(){
var vns=this.viewsHeaderNode.style,t=vns.display=="none"?0:this.views.measureHeader();
vns.height=t+"px";
this.views.normalizeHeaderNodeHeight();
return t;
},_resize:function(_2c0,_2c1){
_2c0=_2c0||this._pendingChangeSize;
_2c1=_2c1||this._pendingResultSize;
delete this._pendingChangeSize;
delete this._pendingResultSize;
if(!this.domNode){
return;
}
var pn=this.domNode.parentNode;
if(!pn||pn.nodeType!=1||!this.hasLayout()||pn.style.visibility=="hidden"||pn.style.display=="none"){
return;
}
var _2c2=this._getPadBorder();
var hh=undefined;
var h;
if(this._autoHeight){
this.domNode.style.height="auto";
}else{
if(typeof this.autoHeight=="number"){
h=hh=this._getHeaderHeight();
h+=(this.scroller.averageRowHeight*this.autoHeight);
this.domNode.style.height=h+"px";
}else{
if(this.domNode.clientHeight<=_2c2.h){
if(pn==document.body){
this.domNode.style.height=this.defaultHeight;
}else{
if(this.height){
this.domNode.style.height=this.height;
}else{
this.fitTo="parent";
}
}
}
}
}
if(_2c1){
_2c0=_2c1;
}
if(_2c0){
dojo.marginBox(this.domNode,_2c0);
this.height=this.domNode.style.height;
delete this.fitTo;
}else{
if(this.fitTo=="parent"){
h=this._parentContentBoxHeight=this._parentContentBoxHeight||dojo._getContentBox(pn).h;
this.domNode.style.height=Math.max(0,h)+"px";
}
}
var _2c3=dojo.some(this.views.views,function(v){
return v.flexCells;
});
if(!this._autoHeight&&(h||dojo._getContentBox(this.domNode).h)===0){
this.viewsHeaderNode.style.display="none";
}else{
this.viewsHeaderNode.style.display="block";
if(!_2c3&&hh===undefined){
hh=this._getHeaderHeight();
}
}
if(_2c3){
hh=undefined;
}
this.adaptWidth();
this.adaptHeight(hh);
this.postresize();
},adaptWidth:function(){
var _2c4=(!this.initialWidth&&this.autoWidth);
var w=_2c4?0:this.domNode.clientWidth||(this.domNode.offsetWidth-this._getPadBorder().w),vw=this.views.arrange(1,w);
this.views.onEach("adaptWidth");
if(_2c4){
this.domNode.style.width=vw+"px";
}
},adaptHeight:function(_2c5){
var t=_2c5===undefined?this._getHeaderHeight():_2c5;
var h=(this._autoHeight?-1:Math.max(this.domNode.clientHeight-t,0)||0);
this.views.onEach("setSize",[0,h]);
this.views.onEach("adaptHeight");
if(!this._autoHeight){
var _2c6=0,_2c7=0;
var _2c8=dojo.filter(this.views.views,function(v){
var has=v.hasHScrollbar();
if(has){
_2c6++;
}else{
_2c7++;
}
return (!has);
});
if(_2c6>0&&_2c7>0){
dojo.forEach(_2c8,function(v){
v.adaptHeight(true);
});
}
}
if(this.autoHeight===true||h!=-1||(typeof this.autoHeight=="number"&&this.autoHeight>=this.get("rowCount"))){
this.scroller.windowHeight=h;
}else{
this.scroller.windowHeight=Math.max(this.domNode.clientHeight-t,0);
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(this.autoRender){
this.render();
}
},render:function(){
if(!this.domNode){
return;
}
if(!this._started){
return;
}
if(!this.hasLayout()){
this.scroller.init(0,this.keepRows,this.rowsPerPage);
return;
}
this.update=this.defaultUpdate;
this._render();
},_render:function(){
this.scroller.init(this.get("rowCount"),this.keepRows,this.rowsPerPage);
this.prerender();
this.setScrollTop(0);
this.postrender();
},prerender:function(){
this.keepRows=this._autoHeight?0:this.keepRows;
this.scroller.setKeepInfo(this.keepRows);
this.views.render();
this._resize();
},postrender:function(){
this.postresize();
this.focus.initFocusView();
dojo.setSelectable(this.domNode,this.selectable);
},postresize:function(){
if(this._autoHeight){
var size=Math.max(this.views.measureContent())+"px";
this.viewsNode.style.height=size;
}
},renderRow:function(_2c9,_2ca){
this.views.renderRow(_2c9,_2ca,this._skipRowRenormalize);
},rowRemoved:function(_2cb){
this.views.rowRemoved(_2cb);
},invalidated:null,updating:false,beginUpdate:function(){
this.invalidated=[];
this.updating=true;
},endUpdate:function(){
this.updating=false;
var i=this.invalidated,r;
if(i.all){
this.update();
}else{
if(i.rowCount!=undefined){
this.updateRowCount(i.rowCount);
}else{
for(r in i){
this.updateRow(Number(r));
}
}
}
this.invalidated=[];
},defaultUpdate:function(){
if(!this.domNode){
return;
}
if(this.updating){
this.invalidated.all=true;
return;
}
this.lastScrollTop=this.scrollTop;
this.prerender();
this.scroller.invalidateNodes();
this.setScrollTop(this.lastScrollTop);
this.postrender();
},update:function(){
this.render();
},updateRow:function(_2cc){
_2cc=Number(_2cc);
if(this.updating){
this.invalidated[_2cc]=true;
}else{
this.views.updateRow(_2cc);
this.scroller.rowHeightChanged(_2cc);
}
},updateRows:function(_2cd,_2ce){
_2cd=Number(_2cd);
_2ce=Number(_2ce);
var i;
if(this.updating){
for(i=0;i<_2ce;i++){
this.invalidated[i+_2cd]=true;
}
}else{
for(i=0;i<_2ce;i++){
this.views.updateRow(i+_2cd,this._skipRowRenormalize);
}
this.scroller.rowHeightChanged(_2cd);
}
},updateRowCount:function(_2cf){
if(this.updating){
this.invalidated.rowCount=_2cf;
}else{
this.rowCount=_2cf;
this._setAutoHeightAttr(this.autoHeight,true);
if(this.layout.cells.length){
this.scroller.updateRowCount(_2cf);
}
this._resize();
if(this.layout.cells.length){
this.setScrollTop(this.scrollTop);
}
}
},updateRowStyles:function(_2d0){
this.views.updateRowStyles(_2d0);
},getRowNode:function(_2d1){
if(this.focus.focusView&&!(this.focus.focusView instanceof dojox.grid._RowSelector)){
return this.focus.focusView.rowNodes[_2d1];
}else{
for(var i=0,_2d2;(_2d2=this.views.views[i]);i++){
if(!(_2d2 instanceof dojox.grid._RowSelector)){
return _2d2.rowNodes[_2d1];
}
}
}
return null;
},rowHeightChanged:function(_2d3){
this.views.renormalizeRow(_2d3);
this.scroller.rowHeightChanged(_2d3);
},fastScroll:true,delayScroll:false,scrollRedrawThreshold:(dojo.isIE?100:50),scrollTo:function(_2d4){
if(!this.fastScroll){
this.setScrollTop(_2d4);
return;
}
var _2d5=Math.abs(this.lastScrollTop-_2d4);
this.lastScrollTop=_2d4;
if(_2d5>this.scrollRedrawThreshold||this.delayScroll){
this.delayScroll=true;
this.scrollTop=_2d4;
this.views.setScrollTop(_2d4);
if(this._pendingScroll){
window.clearTimeout(this._pendingScroll);
}
var _2d6=this;
this._pendingScroll=window.setTimeout(function(){
delete _2d6._pendingScroll;
_2d6.finishScrollJob();
},200);
}else{
this.setScrollTop(_2d4);
}
},finishScrollJob:function(){
this.delayScroll=false;
this.setScrollTop(this.scrollTop);
},setScrollTop:function(_2d7){
this.scroller.scroll(this.views.setScrollTop(_2d7));
},scrollToRow:function(_2d8){
this.setScrollTop(this.scroller.findScrollTop(_2d8)+1);
},styleRowNode:function(_2d9,_2da){
if(_2da){
this.rows.styleRowNode(_2d9,_2da);
}
},_mouseOut:function(e){
this.rows.setOverRow(-2);
},getCell:function(_2db){
return this.layout.cells[_2db];
},setCellWidth:function(_2dc,_2dd){
this.getCell(_2dc).unitWidth=_2dd;
},getCellName:function(_2de){
return "Cell "+_2de.index;
},canSort:function(_2df){
},sort:function(){
},getSortAsc:function(_2e0){
_2e0=_2e0==undefined?this.sortInfo:_2e0;
return Boolean(_2e0>0);
},getSortIndex:function(_2e1){
_2e1=_2e1==undefined?this.sortInfo:_2e1;
return Math.abs(_2e1)-1;
},setSortIndex:function(_2e2,_2e3){
var si=_2e2+1;
if(_2e3!=undefined){
si*=(_2e3?1:-1);
}else{
if(this.getSortIndex()==_2e2){
si=-this.sortInfo;
}
}
this.setSortInfo(si);
},setSortInfo:function(_2e4){
if(this.canSort(_2e4)){
this.sortInfo=_2e4;
this.sort();
this.update();
}
},doKeyEvent:function(e){
e.dispatch="do"+e.type;
this.onKeyEvent(e);
},_dispatch:function(m,e){
if(m in this){
return this[m](e);
}
return false;
},dispatchKeyEvent:function(e){
this._dispatch(e.dispatch,e);
},dispatchContentEvent:function(e){
this.edit.dispatchEvent(e)||e.sourceView.dispatchContentEvent(e)||this._dispatch(e.dispatch,e);
},dispatchHeaderEvent:function(e){
e.sourceView.dispatchHeaderEvent(e)||this._dispatch("doheader"+e.type,e);
},dokeydown:function(e){
this.onKeyDown(e);
},doclick:function(e){
if(e.cellNode){
this.onCellClick(e);
}else{
this.onRowClick(e);
}
},dodblclick:function(e){
if(e.cellNode){
this.onCellDblClick(e);
}else{
this.onRowDblClick(e);
}
},docontextmenu:function(e){
if(e.cellNode){
this.onCellContextMenu(e);
}else{
this.onRowContextMenu(e);
}
},doheaderclick:function(e){
if(e.cellNode){
this.onHeaderCellClick(e);
}else{
this.onHeaderClick(e);
}
},doheaderdblclick:function(e){
if(e.cellNode){
this.onHeaderCellDblClick(e);
}else{
this.onHeaderDblClick(e);
}
},doheadercontextmenu:function(e){
if(e.cellNode){
this.onHeaderCellContextMenu(e);
}else{
this.onHeaderContextMenu(e);
}
},doStartEdit:function(_2e5,_2e6){
this.onStartEdit(_2e5,_2e6);
},doApplyCellEdit:function(_2e7,_2e8,_2e9){
this.onApplyCellEdit(_2e7,_2e8,_2e9);
},doCancelEdit:function(_2ea){
this.onCancelEdit(_2ea);
},doApplyEdit:function(_2eb){
this.onApplyEdit(_2eb);
},addRow:function(){
this.updateRowCount(this.get("rowCount")+1);
},removeSelectedRows:function(){
if(this.allItemsSelected){
this.updateRowCount(0);
}else{
this.updateRowCount(Math.max(0,this.get("rowCount")-this.selection.getSelected().length));
}
this.selection.clear();
}});
dojox.grid._Grid.markupFactory=function(_2ec,node,ctor,_2ed){
var d=dojo;
var _2ee=function(n){
var w=d.attr(n,"width")||"auto";
if((w!="auto")&&(w.slice(-2)!="em")&&(w.slice(-1)!="%")){
w=parseInt(w,10)+"px";
}
return w;
};
if(!_2ec.structure&&node.nodeName.toLowerCase()=="table"){
_2ec.structure=d.query("> colgroup",node).map(function(cg){
var sv=d.attr(cg,"span");
var v={noscroll:(d.attr(cg,"noscroll")=="true")?true:false,__span:(!!sv?parseInt(sv,10):1),cells:[]};
if(d.hasAttr(cg,"width")){
v.width=_2ee(cg);
}
return v;
});
if(!_2ec.structure.length){
_2ec.structure.push({__span:Infinity,cells:[]});
}
d.query("thead > tr",node).forEach(function(tr,_2ef){
var _2f0=0;
var _2f1=0;
var _2f2;
var _2f3=null;
d.query("> th",tr).map(function(th){
if(!_2f3){
_2f2=0;
_2f3=_2ec.structure[0];
}else{
if(_2f0>=(_2f2+_2f3.__span)){
_2f1++;
_2f2+=_2f3.__span;
var _2f4=_2f3;
_2f3=_2ec.structure[_2f1];
}
}
var cell={name:d.trim(d.attr(th,"name")||th.innerHTML),colSpan:parseInt(d.attr(th,"colspan")||1,10),type:d.trim(d.attr(th,"cellType")||""),id:d.trim(d.attr(th,"id")||"")};
_2f0+=cell.colSpan;
var _2f5=d.attr(th,"rowspan");
if(_2f5){
cell.rowSpan=_2f5;
}
if(d.hasAttr(th,"width")){
cell.width=_2ee(th);
}
if(d.hasAttr(th,"relWidth")){
cell.relWidth=window.parseInt(dojo.attr(th,"relWidth"),10);
}
if(d.hasAttr(th,"hidden")){
cell.hidden=(d.attr(th,"hidden")=="true"||d.attr(th,"hidden")===true);
}
if(_2ed){
_2ed(th,cell);
}
cell.type=cell.type?dojo.getObject(cell.type):dojox.grid.cells.Cell;
if(cell.type&&cell.type.markupFactory){
cell.type.markupFactory(th,cell);
}
if(!_2f3.cells[_2ef]){
_2f3.cells[_2ef]=[];
}
_2f3.cells[_2ef].push(cell);
});
});
}
return new ctor(_2ec,node);
};
})();
}
if(!dojo._hasResource["dojox.grid.DataSelection"]){
dojo._hasResource["dojox.grid.DataSelection"]=true;
dojo.provide("dojox.grid.DataSelection");
dojo.declare("dojox.grid.DataSelection",dojox.grid.Selection,{getFirstSelected:function(){
var idx=dojox.grid.Selection.prototype.getFirstSelected.call(this);
if(idx==-1){
return null;
}
return this.grid.getItem(idx);
},getNextSelected:function(_2f6){
var _2f7=this.grid.getItemIndex(_2f6);
var idx=dojox.grid.Selection.prototype.getNextSelected.call(this,_2f7);
if(idx==-1){
return null;
}
return this.grid.getItem(idx);
},getSelected:function(){
var _2f8=[];
for(var i=0,l=this.selected.length;i<l;i++){
if(this.selected[i]){
_2f8.push(this.grid.getItem(i));
}
}
return _2f8;
},addToSelection:function(_2f9){
if(this.mode=="none"){
return;
}
var idx=null;
if(typeof _2f9=="number"||typeof _2f9=="string"){
idx=_2f9;
}else{
idx=this.grid.getItemIndex(_2f9);
}
dojox.grid.Selection.prototype.addToSelection.call(this,idx);
},deselect:function(_2fa){
if(this.mode=="none"){
return;
}
var idx=null;
if(typeof _2fa=="number"||typeof _2fa=="string"){
idx=_2fa;
}else{
idx=this.grid.getItemIndex(_2fa);
}
dojox.grid.Selection.prototype.deselect.call(this,idx);
},deselectAll:function(_2fb){
var idx=null;
if(_2fb||typeof _2fb=="number"){
if(typeof _2fb=="number"||typeof _2fb=="string"){
idx=_2fb;
}else{
idx=this.grid.getItemIndex(_2fb);
}
dojox.grid.Selection.prototype.deselectAll.call(this,idx);
}else{
this.inherited(arguments);
}
}});
}
if(!dojo._hasResource["dojox.grid.DataGrid"]){
dojo._hasResource["dojox.grid.DataGrid"]=true;
dojo.provide("dojox.grid.DataGrid");
dojo.declare("dojox.grid.DataGrid",dojox.grid._Grid,{store:null,query:null,queryOptions:null,fetchText:"...",sortFields:null,updateDelay:1,items:null,_store_connects:null,_by_idty:null,_by_idx:null,_cache:null,_pages:null,_pending_requests:null,_bop:-1,_eop:-1,_requests:0,rowCount:0,_isLoaded:false,_isLoading:false,postCreate:function(){
this._pages=[];
this._store_connects=[];
this._by_idty={};
this._by_idx=[];
this._cache=[];
this._pending_requests={};
this._setStore(this.store);
this.inherited(arguments);
},createSelection:function(){
this.selection=new dojox.grid.DataSelection(this);
},get:function(_2fc,_2fd){
if(_2fd&&this.field=="_item"&&!this.fields){
return _2fd;
}else{
if(_2fd&&this.fields){
var ret=[];
var s=this.grid.store;
dojo.forEach(this.fields,function(f){
ret=ret.concat(s.getValues(_2fd,f));
});
return ret;
}else{
if(!_2fd&&typeof _2fc==="string"){
return this.inherited(arguments);
}
}
}
return (!_2fd?this.defaultValue:(!this.field?this.value:(this.field=="_item"?_2fd:this.grid.store.getValue(_2fd,this.field))));
},_checkUpdateStatus:function(){
if(this.updateDelay>0){
var _2fe=false;
if(this._endUpdateDelay){
clearTimeout(this._endUpdateDelay);
delete this._endUpdateDelay;
_2fe=true;
}
if(!this.updating){
this.beginUpdate();
_2fe=true;
}
if(_2fe){
var _2ff=this;
this._endUpdateDelay=setTimeout(function(){
delete _2ff._endUpdateDelay;
_2ff.endUpdate();
},this.updateDelay);
}
}
},_onSet:function(item,_300,_301,_302){
this._checkUpdateStatus();
var idx=this.getItemIndex(item);
if(idx>-1){
this.updateRow(idx);
}
},_createItem:function(item,_303){
var idty=this._hasIdentity?this.store.getIdentity(item):dojo.toJson(this.query)+":idx:"+_303+":sort:"+dojo.toJson(this.getSortProps());
var o=this._by_idty[idty]={idty:idty,item:item};
return o;
},_addItem:function(item,_304,_305){
this._by_idx[_304]=this._createItem(item,_304);
if(!_305){
this.updateRow(_304);
}
},_onNew:function(item,_306){
this._checkUpdateStatus();
var _307=this.get("rowCount");
this._addingItem=true;
this.updateRowCount(_307+1);
this._addingItem=false;
this._addItem(item,_307);
this.showMessage();
},_onDelete:function(item){
this._checkUpdateStatus();
var idx=this._getItemIndex(item,true);
if(idx>=0){
this._pages=[];
this._bop=-1;
this._eop=-1;
var o=this._by_idx[idx];
this._by_idx.splice(idx,1);
delete this._by_idty[o.idty];
this.updateRowCount(this.get("rowCount")-1);
if(this.get("rowCount")===0){
this.showMessage(this.noDataMessage);
}
}
},_onRevert:function(){
this._refresh();
},setStore:function(_308,_309,_30a){
this._setQuery(_309,_30a);
this._setStore(_308);
this._refresh(true);
},setQuery:function(_30b,_30c){
this._setQuery(_30b,_30c);
this._refresh(true);
},setItems:function(_30d){
this.items=_30d;
this._setStore(this.store);
this._refresh(true);
},_setQuery:function(_30e,_30f){
this.query=_30e;
this.queryOptions=_30f||this.queryOptions;
},_setStore:function(_310){
if(this.store&&this._store_connects){
dojo.forEach(this._store_connects,this.disconnect,this);
}
this.store=_310;
if(this.store){
var f=this.store.getFeatures();
var h=[];
this._canEdit=!!f["dojo.data.api.Write"]&&!!f["dojo.data.api.Identity"];
this._hasIdentity=!!f["dojo.data.api.Identity"];
if(!!f["dojo.data.api.Notification"]&&!this.items){
h.push(this.connect(this.store,"onSet","_onSet"));
h.push(this.connect(this.store,"onNew","_onNew"));
h.push(this.connect(this.store,"onDelete","_onDelete"));
}
if(this._canEdit){
h.push(this.connect(this.store,"revert","_onRevert"));
}
this._store_connects=h;
}
},_onFetchBegin:function(size,req){
if(!this.scroller){
return;
}
if(this.rowCount!=size){
if(req.isRender){
this.scroller.init(size,this.keepRows,this.rowsPerPage);
this.rowCount=size;
this._setAutoHeightAttr(this.autoHeight,true);
this._skipRowRenormalize=true;
this.prerender();
this._skipRowRenormalize=false;
}else{
this.updateRowCount(size);
}
}
if(!size){
this.views.render();
this._resize();
this.showMessage(this.noDataMessage);
this.focus.initFocusView();
}else{
this.showMessage();
}
},_onFetchComplete:function(_311,req){
if(!this.scroller){
return;
}
if(_311&&_311.length>0){
dojo.forEach(_311,function(item,idx){
this._addItem(item,req.start+idx,true);
},this);
this.updateRows(req.start,_311.length);
if(req.isRender){
this.setScrollTop(0);
this.postrender();
}else{
if(this._lastScrollTop){
this.setScrollTop(this._lastScrollTop);
}
}
}
delete this._lastScrollTop;
if(!this._isLoaded){
this._isLoading=false;
this._isLoaded=true;
}
this._pending_requests[req.start]=false;
},_onFetchError:function(err,req){
debugger;
delete this._lastScrollTop;
if(!this._isLoaded){
this._isLoading=false;
this._isLoaded=true;
this.showMessage(this.errorMessage);
}
this._pending_requests[req.start]=false;
this.onFetchError(err,req);
},onFetchError:function(err,req){
},_fetch:function(_312,_313){
_312=_312||0;
if(this.store&&!this._pending_requests[_312]){
if(!this._isLoaded&&!this._isLoading){
this._isLoading=true;
this.showMessage(this.loadingMessage);
}
this._pending_requests[_312]=true;
try{
if(this.items){
var _314=this.items;
var _315=this.store;
this.rowsPerPage=_314.length;
var req={start:_312,count:this.rowsPerPage,isRender:_313};
this._onFetchBegin(_314.length,req);
var _316=0;
dojo.forEach(_314,function(i){
if(!_315.isItemLoaded(i)){
_316++;
}
});
if(_316===0){
this._onFetchComplete(_314,req);
}else{
var _317=function(item){
_316--;
if(_316===0){
this._onFetchComplete(_314,req);
}
};
dojo.forEach(_314,function(i){
if(!_315.isItemLoaded(i)){
_315.loadItem({item:i,onItem:_317,scope:this});
}
},this);
}
}else{
this.store.fetch({start:_312,count:this.rowsPerPage,query:this.query,sort:this.getSortProps(),queryOptions:this.queryOptions,isRender:_313,onBegin:dojo.hitch(this,"_onFetchBegin"),onComplete:dojo.hitch(this,"_onFetchComplete"),onError:dojo.hitch(this,"_onFetchError")});
}
}
catch(e){
this._onFetchError(e,{start:_312,count:this.rowsPerPage});
}
}
},_clearData:function(){
this.updateRowCount(0);
this._by_idty={};
this._by_idx=[];
this._pages=[];
this._bop=this._eop=-1;
this._isLoaded=false;
this._isLoading=false;
},getItem:function(idx){
var data=this._by_idx[idx];
if(!data||(data&&!data.item)){
this._preparePage(idx);
return null;
}
return data.item;
},getItemIndex:function(item){
return this._getItemIndex(item,false);
},_getItemIndex:function(item,_318){
if(!_318&&!this.store.isItem(item)){
return -1;
}
var idty=this._hasIdentity?this.store.getIdentity(item):null;
for(var i=0,l=this._by_idx.length;i<l;i++){
var d=this._by_idx[i];
if(d&&((idty&&d.idty==idty)||(d.item===item))){
return i;
}
}
return -1;
},filter:function(_319,_31a){
this.query=_319;
if(_31a){
this._clearData();
}
this._fetch();
},_getItemAttr:function(idx,attr){
var item=this.getItem(idx);
return (!item?this.fetchText:this.store.getValue(item,attr));
},_render:function(){
if(this.domNode.parentNode){
this.scroller.init(this.get("rowCount"),this.keepRows,this.rowsPerPage);
this.prerender();
this._fetch(0,true);
}
},_requestsPending:function(_31b){
return this._pending_requests[_31b];
},_rowToPage:function(_31c){
return (this.rowsPerPage?Math.floor(_31c/this.rowsPerPage):_31c);
},_pageToRow:function(_31d){
return (this.rowsPerPage?this.rowsPerPage*_31d:_31d);
},_preparePage:function(_31e){
if((_31e<this._bop||_31e>=this._eop)&&!this._addingItem){
var _31f=this._rowToPage(_31e);
this._needPage(_31f);
this._bop=_31f*this.rowsPerPage;
this._eop=this._bop+(this.rowsPerPage||this.get("rowCount"));
}
},_needPage:function(_320){
if(!this._pages[_320]){
this._pages[_320]=true;
this._requestPage(_320);
}
},_requestPage:function(_321){
var row=this._pageToRow(_321);
var _322=Math.min(this.rowsPerPage,this.get("rowCount")-row);
if(_322>0){
this._requests++;
if(!this._requestsPending(row)){
setTimeout(dojo.hitch(this,"_fetch",row,false),1);
}
}
},getCellName:function(_323){
return _323.field;
},_refresh:function(_324){
this._clearData();
this._fetch(0,_324);
},sort:function(){
this.edit.apply();
this._lastScrollTop=this.scrollTop;
this._refresh();
},canSort:function(){
return (!this._isLoading);
},getSortProps:function(){
var c=this.getCell(this.getSortIndex());
if(!c){
if(this.sortFields){
return this.sortFields;
}
return null;
}else{
var desc=c["sortDesc"];
var si=!(this.sortInfo>0);
if(typeof desc=="undefined"){
desc=si;
}else{
desc=si?!desc:desc;
}
return [{attribute:c.field,descending:desc}];
}
},styleRowState:function(_325){
if(this.store&&this.store.getState){
var _326=this.store.getState(_325.index),c="";
for(var i=0,ss=["inflight","error","inserting"],s;s=ss[i];i++){
if(_326[s]){
c=" dojoxGridRow-"+s;
break;
}
}
_325.customClasses+=c;
}
},onStyleRow:function(_327){
this.styleRowState(_327);
this.inherited(arguments);
},canEdit:function(_328,_329){
return this._canEdit;
},_copyAttr:function(idx,attr){
var row={};
var _32a={};
var src=this.getItem(idx);
return this.store.getValue(src,attr);
},doStartEdit:function(_32b,_32c){
if(!this._cache[_32c]){
this._cache[_32c]=this._copyAttr(_32c,_32b.field);
}
this.onStartEdit(_32b,_32c);
},doApplyCellEdit:function(_32d,_32e,_32f){
this.store.fetchItemByIdentity({identity:this._by_idx[_32e].idty,onItem:dojo.hitch(this,function(item){
var _330=this.store.getValue(item,_32f);
if(typeof _330=="number"){
if(typeof _32d=="boolean"){
_32d=_32d?1:0;
}else{
if(_32d instanceof Date){
_32d=_32d.getTime();
}else{
_32d=isNaN(_32d)?_32d:parseFloat(_32d);
}
}
}else{
if(typeof _330=="boolean"){
_32d=_32d=="true"?true:_32d=="false"?false:_32d;
}else{
if(_330 instanceof Date){
var _331=new Date(_32d);
_32d=isNaN(_331.getTime())?_32d:_331;
}
}
}
this.store.setValue(item,_32f,_32d);
this.onApplyCellEdit(_32d,_32e,_32f);
})});
},doCancelEdit:function(_332){
var _333=this._cache[_332];
if(_333){
this.updateRow(_332);
delete this._cache[_332];
}
this.onCancelEdit.apply(this,arguments);
},doApplyEdit:function(_334,_335){
var _336=this._cache[_334];
this.onApplyEdit(_334);
},removeSelectedRows:function(){
if(this._canEdit){
this.edit.apply();
var fx=dojo.hitch(this,function(_337){
if(_337.length){
dojo.forEach(_337,this.store.deleteItem,this.store);
this.selection.clear();
}
});
if(this.allItemsSelected){
this.store.fetch({query:this.query,queryOptions:this.queryOptions,onComplete:fx});
}else{
fx(this.selection.getSelected());
}
}
}});
dojox.grid.DataGrid.cell_markupFactory=function(_338,node,_339){
var _33a=dojo.trim(dojo.attr(node,"field")||"");
if(_33a){
_339.field=_33a;
}
_339.field=_339.field||_339.name;
var _33b=dojo.trim(dojo.attr(node,"fields")||"");
if(_33b){
_339.fields=_33b.split(",");
}
if(_338){
_338(node,_339);
}
};
dojox.grid.DataGrid.markupFactory=function(_33c,node,ctor,_33d){
return dojox.grid._Grid.markupFactory(_33c,node,ctor,dojo.partial(dojox.grid.DataGrid.cell_markupFactory,_33d));
};
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
var _33e=this.dropDown,_33f=false;
if(e&&this._opened){
var c=dojo.position(this._buttonNode,true);
if(!(e.pageX>=c.x&&e.pageX<=c.x+c.w)||!(e.pageY>=c.y&&e.pageY<=c.y+c.h)){
var t=e.target;
while(t&&!_33f){
if(dojo.hasClass(t,"dijitPopup")){
_33f=true;
}else{
t=t.parentNode;
}
}
if(_33f){
t=e.target;
if(_33e.onItemClick){
var _340;
while(t&&!(_340=dijit.byNode(t))){
t=t.parentNode;
}
if(_340&&_340.onClick&&_340.getParent){
_340.getParent().onItemClick(_340,e);
}
}
return;
}
}
}
if(this._opened&&_33e.focus&&_33e.autoFocus!==false){
window.setTimeout(dojo.hitch(_33e,"focus"),1);
}
},_onDropDownClick:function(e){
if(this._stopClickEvents){
dojo.stopEvent(e);
}
},buildRendering:function(){
this.inherited(arguments);
this._buttonNode=this._buttonNode||this.focusNode||this.domNode;
this._popupStateNode=this._popupStateNode||this.focusNode||this._buttonNode;
var _341={"after":this.isLeftToRight()?"Right":"Left","before":this.isLeftToRight()?"Left":"Right","above":"Up","below":"Down","left":"Left","right":"Right"}[this.dropDownPosition[0]]||this.dropDownPosition[0]||"Down";
dojo.addClass(this._arrowWrapperNode||this._buttonNode,"dijit"+_341+"ArrowButton");
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
var d=this.dropDown,_342=e.target;
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
if(!this._opened&&(e.charOrCode==dojo.keys.DOWN_ARROW||((e.charOrCode==dojo.keys.ENTER||e.charOrCode==" ")&&((_342.tagName||"").toLowerCase()!=="input"||(_342.type&&_342.type.toLowerCase()!=="text"))))){
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
var _343=dijit._curFocus&&this.dropDown&&dojo.isDescendant(dijit._curFocus,this.dropDown.domNode);
this.closeDropDown(_343);
this.inherited(arguments);
},isLoaded:function(){
return true;
},loadDropDown:function(_344){
_344();
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
var _345=this.dropDown,_346=_345.domNode,_347=this._aroundNode||this.domNode,self=this;
if(!this._preparedNode){
this._preparedNode=true;
if(_346.style.width){
this._explicitDDWidth=true;
}
if(_346.style.height){
this._explicitDDHeight=true;
}
}
if(this.maxHeight||this.forceWidth||this.autoWidth){
var _348={display:"",visibility:"hidden"};
if(!this._explicitDDWidth){
_348.width="";
}
if(!this._explicitDDHeight){
_348.height="";
}
dojo.style(_346,_348);
var _349=this.maxHeight;
if(_349==-1){
var _34a=dojo.window.getBox(),_34b=dojo.position(_347,false);
_349=Math.floor(Math.max(_34b.y,_34a.h-(_34b.y+_34b.h)));
}
if(_345.startup&&!_345._started){
_345.startup();
}
dijit.popup.moveOffScreen(_345);
var mb=dojo._getMarginSize(_346);
var _34c=(_349&&mb.h>_349);
dojo.style(_346,{overflowX:"hidden",overflowY:_34c?"auto":"hidden"});
if(_34c){
mb.h=_349;
if("w" in mb){
mb.w+=16;
}
}else{
delete mb.h;
}
if(this.forceWidth){
mb.w=_347.offsetWidth;
}else{
if(this.autoWidth){
mb.w=Math.max(mb.w,_347.offsetWidth);
}else{
delete mb.w;
}
}
if(dojo.isFunction(_345.resize)){
_345.resize(mb);
}else{
dojo.marginBox(_346,mb);
}
}
var _34d=dijit.popup.open({parent:this,popup:_345,around:_347,orient:dijit.getPopupAroundAlignment((this.dropDownPosition&&this.dropDownPosition.length)?this.dropDownPosition:["below"],this.isLeftToRight()),onExecute:function(){
self.closeDropDown(true);
},onCancel:function(){
self.closeDropDown(true);
},onClose:function(){
dojo.attr(self._popupStateNode,"popupActive",false);
dojo.removeClass(self._popupStateNode,"dijitHasDropDownOpen");
self._opened=false;
}});
dojo.attr(this._popupStateNode,"popupActive","true");
dojo.addClass(self._popupStateNode,"dijitHasDropDownOpen");
this._opened=true;
return _34d;
},closeDropDown:function(_34e){
if(this._opened){
if(_34e){
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
for(var node=this.domNode;node.parentNode;node=node.parentNode){
var _34f=dijit.byNode(node);
if(_34f&&typeof _34f._onSubmit=="function"){
_34f._onSubmit(e);
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
},_fillContent:function(_350){
if(_350&&(!this.params||!("label" in this.params))){
this.set("label",_350.innerHTML);
}
},_setShowLabelAttr:function(val){
if(this.containerNode){
dojo.toggleClass(this.containerNode,"dijitDisplayNone",!val);
}
this._set("showLabel",val);
},onClick:function(e){
return true;
},_clicked:function(e){
},setLabel:function(_351){
dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_351);
},_setLabelAttr:function(_352){
this._set("label",_352);
this.containerNode.innerHTML=_352;
if(this.showLabel==false&&!this.params.title){
this.titleNode.title=dojo.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
},_setIconClassAttr:function(val){
var _353=this.iconClass||"dijitNoIcon",_354=val||"dijitNoIcon";
dojo.replaceClass(this.iconNode,_354,_353);
this._set("iconClass",val);
}});
dojo.declare("dijit.form.DropDownButton",[dijit.form.Button,dijit._Container,dijit._HasDropDown],{baseClass:"dijitDropDownButton",templateString:dojo.cache("dijit.form","templates/DropDownButton.html","<span class=\"dijit dijitReset dijitInline\"\n\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\" dojoAttachPoint=\"_buttonNode\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdojoAttachPoint=\"focusNode,titleNode,_arrowWrapperNode\"\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\n\t\t\t\tdojoAttachPoint=\"iconNode\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tdojoAttachPoint=\"containerNode,_popupStateNode\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\" tabIndex=\"-1\"\n\t\tdojoAttachPoint=\"valueNode\"\n/></span>\n"),_fillContent:function(){
if(this.srcNodeRef){
var _355=dojo.query("*",this.srcNodeRef);
dijit.form.DropDownButton.superclass._fillContent.call(this,_355[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
if(!this.dropDown&&this.dropDownContainer){
var _356=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.dropDown=dijit.byNode(_356);
delete this.dropDownContainer;
}
if(this.dropDown){
dijit.popup.hide(this.dropDown);
}
this.inherited(arguments);
},isLoaded:function(){
var _357=this.dropDown;
return (!!_357&&(!_357.href||_357.isLoaded));
},loadDropDown:function(){
var _358=this.dropDown;
if(!_358){
return;
}
if(!this.isLoaded()){
var _359=dojo.connect(_358,"onLoad",this,function(){
dojo.disconnect(_359);
this.openDropDown();
});
_358.refresh();
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
},focus:function(_35a){
if(!this.disabled){
dijit.focus(_35a=="start"?this.titleNode:this._popupStateNode);
}
}});
dojo.declare("dijit.form.ToggleButton",dijit.form.Button,{baseClass:"dijitToggleButton",checked:false,attributeMap:dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap),{checked:"focusNode"}),_clicked:function(evt){
this.set("checked",!this.checked);
},_setCheckedAttr:function(_35b,_35c){
this._set("checked",_35b);
dojo.attr(this.focusNode||this.domNode,"checked",_35b);
dijit.setWaiState(this.focusNode||this.domNode,"pressed",_35b);
this._handleOnChange(_35b,_35c);
},setChecked:function(_35d){
dojo.deprecated("setChecked("+_35d+") is deprecated. Use set('checked',"+_35d+") instead.","","2.0");
this.set("checked",_35d);
},reset:function(){
this._hasBeenBlurred=false;
this.set("checked",this.params.checked||false);
}});
}
if(!dojo._hasResource["dijit.form.DropDownButton"]){
dojo._hasResource["dijit.form.DropDownButton"]=true;
dojo.provide("dijit.form.DropDownButton");
}
if(!dojo._hasResource["dijit.Calendar"]){
dojo._hasResource["dijit.Calendar"]=true;
dojo.provide("dijit.Calendar");
dojo.declare("dijit.Calendar",[dijit._Widget,dijit._Templated,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/Calendar.html","<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" dojoAttachEvent=\"onkeypress: _onKeyPress\" aria-labelledby=\"${id}_year\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoType=\"dijit.form.DropDownButton\" dojoAttachPoint=\"monthDropDownButton\"\n\t\t\t\t\tid=\"${id}_mddb\" tabIndex=\"-1\">\n\t\t\t\t</div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset dijitCalendarArrow' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut, onmousedown: _onDayMouseDown, onmouseup: _onDayMouseUp\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\" role=\"gridcell\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n"),widgetsInTemplate:true,value:new Date(""),datePackage:"dojo.date",dayWidth:"narrow",tabIndex:"0",currentFocus:new Date(),baseClass:"dijitCalendar",cssStateNodes:{"decrementMonth":"dijitCalendarArrow","incrementMonth":"dijitCalendarArrow","previousYearLabelNode":"dijitCalendarPreviousYear","nextYearLabelNode":"dijitCalendarNextYear"},_isValidDate:function(_35e){
return _35e&&!isNaN(_35e)&&typeof _35e=="object"&&_35e.toString()!=this.constructor.prototype.value.toString();
},setValue:function(_35f){
dojo.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_35f);
},_getValueAttr:function(){
var _360=new this.dateClassObj(this.value);
_360.setHours(0,0,0,0);
if(_360.getDate()<this.value.getDate()){
_360=this.dateFuncObj.add(_360,"hour",1);
}
return _360;
},_setValueAttr:function(_361,_362){
if(_361){
_361=new this.dateClassObj(_361);
}
if(this._isValidDate(_361)){
if(!this._isValidDate(this.value)||this.dateFuncObj.compare(_361,this.value)){
_361.setHours(1,0,0,0);
if(!this.isDisabledDate(_361,this.lang)){
this._set("value",_361);
this.set("currentFocus",_361);
if(_362||typeof _362=="undefined"){
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
var _363=new this.dateClassObj(this.currentFocus);
_363.setDate(1);
var _364=_363.getDay(),_365=this.dateFuncObj.getDaysInMonth(_363),_366=this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(_363,"month",-1)),_367=new this.dateClassObj(),_368=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
if(_368>_364){
_368-=7;
}
dojo.query(".dijitCalendarDateTemplate",this.domNode).forEach(function(_369,i){
i+=_368;
var date=new this.dateClassObj(_363),_36a,_36b="dijitCalendar",adj=0;
if(i<_364){
_36a=_366-_364+i+1;
adj=-1;
_36b+="Previous";
}else{
if(i>=(_364+_365)){
_36a=i-_364-_365+1;
adj=1;
_36b+="Next";
}else{
_36a=i-_364+1;
_36b+="Current";
}
}
if(adj){
date=this.dateFuncObj.add(date,"month",adj);
}
date.setDate(_36a);
if(!this.dateFuncObj.compare(date,_367,"date")){
_36b="dijitCalendarCurrentDate "+_36b;
}
if(this._isSelectedDate(date,this.lang)){
_36b="dijitCalendarSelectedDate "+_36b;
}
if(this.isDisabledDate(date,this.lang)){
_36b="dijitCalendarDisabledDate "+_36b;
}
var _36c=this.getClassForDate(date,this.lang);
if(_36c){
_36b=_36c+" "+_36b;
}
_369.className=_36b+"Month dijitCalendarDateTemplate";
_369.dijitDateValue=date.valueOf();
dojo.attr(_369,"dijitDateValue",date.valueOf());
var _36d=dojo.query(".dijitCalendarDateLabel",_369)[0],text=date.getDateLocalized?date.getDateLocalized(this.lang):date.getDate();
this._setText(_36d,text);
},this);
var _36e=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,_363);
this.monthDropDownButton.dropDown.set("months",_36e);
this.monthDropDownButton.containerNode.innerHTML=(dojo.isIE==6?"":"<div class='dijitSpacer'>"+this.monthDropDownButton.dropDown.domNode.innerHTML+"</div>")+"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>"+_36e[_363.getMonth()]+"</div>";
var y=_363.getFullYear()-1;
var d=new this.dateClassObj();
dojo.forEach(["previous","current","next"],function(name){
d.setFullYear(y++);
this._setText(this[name+"YearLabelNode"],this.dateLocaleModule.format(d,{selector:"year",locale:this.lang}));
},this);
},goToToday:function(){
this.set("value",new this.dateClassObj());
},constructor:function(args){
var _36f=(args.datePackage&&(args.datePackage!="dojo.date"))?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_36f,false);
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
var _370=dojo.hitch(this,function(_371,n){
var _372=dojo.query(_371,this.domNode)[0];
for(var i=0;i<n;i++){
_372.parentNode.appendChild(_372.cloneNode(true));
}
});
_370(".dijitCalendarDayLabelTemplate",6);
_370(".dijitCalendarDateTemplate",6);
_370(".dijitCalendarWeekTemplate",5);
var _373=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang);
var _374=dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
dojo.query(".dijitCalendarDayLabel",this.domNode).forEach(function(_375,i){
this._setText(_375,_373[(i+_374)%7]);
},this);
var _376=new this.dateClassObj(this.currentFocus);
this.monthDropDownButton.dropDown=new dijit.Calendar._MonthDropDown({id:this.id+"_mdd",onChange:dojo.hitch(this,"_onMonthSelect")});
this.set("currentFocus",_376,false);
var _377=this;
var _378=function(_379,_37a,adj){
_377._connects.push(dijit.typematic.addMouseListener(_377[_379],_377,function(_37b){
if(_37b>=0){
_377._adjustDisplay(_37a,adj);
}
},0.8,500));
};
_378("incrementMonth","month",1);
_378("decrementMonth","month",-1);
_378("nextYearLabelNode","year",1);
_378("previousYearLabelNode","year",-1);
},_adjustDisplay:function(part,_37c){
this._setCurrentFocusAttr(this.dateFuncObj.add(this.currentFocus,part,_37c));
},_setCurrentFocusAttr:function(date,_37d){
var _37e=this.currentFocus,_37f=_37e?dojo.query("[dijitDateValue="+_37e.valueOf()+"]",this.domNode)[0]:null;
date=new this.dateClassObj(date);
date.setHours(1,0,0,0);
this._set("currentFocus",date);
this._populateGrid();
var _380=dojo.query("[dijitDateValue="+date.valueOf()+"]",this.domNode)[0];
_380.setAttribute("tabIndex",this.tabIndex);
if(this._focused||_37d){
_380.focus();
}
if(_37f&&_37f!=_380){
if(dojo.isWebKit){
_37f.setAttribute("tabIndex","-1");
}else{
_37f.removeAttribute("tabIndex");
}
}
},focus:function(){
this._setCurrentFocusAttr(this.currentFocus,true);
},_onMonthSelect:function(_381){
this.currentFocus=this.dateFuncObj.add(this.currentFocus,"month",_381-this.currentFocus.getMonth());
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
var dk=dojo.keys,_382=-1,_383,_384=this.currentFocus;
switch(evt.keyCode){
case dk.RIGHT_ARROW:
_382=1;
case dk.LEFT_ARROW:
_383="day";
if(!this.isLeftToRight()){
_382*=-1;
}
break;
case dk.DOWN_ARROW:
_382=1;
case dk.UP_ARROW:
_383="week";
break;
case dk.PAGE_DOWN:
_382=1;
case dk.PAGE_UP:
_383=evt.ctrlKey||evt.altKey?"year":"month";
break;
case dk.END:
_384=this.dateFuncObj.add(_384,"month",1);
_383="day";
case dk.HOME:
_384=new this.dateClassObj(_384);
_384.setDate(1);
break;
case dk.ENTER:
case dk.SPACE:
this.set("value",this.currentFocus);
break;
default:
return true;
}
if(_383){
_384=this.dateFuncObj.add(_384,_383,_382);
}
this._setCurrentFocusAttr(_384);
return false;
},_onKeyPress:function(evt){
if(!this.handleKey(evt)){
dojo.stopEvent(evt);
}
},onValueSelected:function(date){
},onChange:function(date){
},_isSelectedDate:function(_385,_386){
return this._isValidDate(this.value)&&!this.dateFuncObj.compare(_385,this.value,"date");
},isDisabledDate:function(_387,_388){
},getClassForDate:function(_389,_38a){
}});
dojo.declare("dijit.Calendar._MonthDropDown",[dijit._Widget,dijit._Templated],{months:[],templateString:"<div class='dijitCalendarMonthMenu dijitMenu' "+"dojoAttachEvent='onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'></div>",_setMonthsAttr:function(_38b){
this.domNode.innerHTML=dojo.map(_38b,function(_38c,idx){
return _38c?"<div class='dijitCalendarMonthLabel' month='"+idx+"'>"+_38c+"</div>":"";
}).join("");
},_onClick:function(evt){
this.onChange(dojo.attr(evt.target,"month"));
},onChange:function(_38d){
},_onMenuHover:function(evt){
dojo.toggleClass(evt.target,"dijitCalendarMonthLabelHover",evt.type=="mouseover");
}});
}
if(!dojo._hasResource["dijit.form._DateTimeTextBox"]){
dojo._hasResource["dijit.form._DateTimeTextBox"]=true;
dojo.provide("dijit.form._DateTimeTextBox");
new Date("X");
dojo.declare("dijit.form._DateTimeTextBox",[dijit.form.RangeBoundTextBox,dijit._HasDropDown],{templateString:dojo.cache("dijit.form","templates/DropDownBox.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),hasDownArrow:true,openOnClick:true,regExpGen:dojo.date.locale.regexp,datePackage:"dojo.date",compare:function(val1,val2){
var _38e=this._isInvalidDate(val1);
var _38f=this._isInvalidDate(val2);
return _38e?(_38f?0:-1):(_38f?1:dojo.date.compare(val1,val2,this._selector));
},forceWidth:true,format:function(_390,_391){
if(!_390){
return "";
}
return this.dateLocaleModule.format(_390,_391);
},"parse":function(_392,_393){
return this.dateLocaleModule.parse(_392,_393)||(this._isEmpty(_392)?null:undefined);
},serialize:function(val,_394){
if(val.toGregorian){
val=val.toGregorian();
}
return dojo.date.stamp.toISOString(val,_394);
},dropDownDefaultValue:new Date(),value:new Date(""),_blankValue:null,popupClass:"",_selector:"",constructor:function(args){
var _395=args.datePackage?args.datePackage+".Date":"Date";
this.dateClassObj=dojo.getObject(_395,false);
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
},_setConstraintsAttr:function(_396){
_396.selector=this._selector;
_396.fullYear=true;
var _397=dojo.date.stamp.fromISOString;
if(typeof _396.min=="string"){
_396.min=_397(_396.min);
}
if(typeof _396.max=="string"){
_396.max=_397(_396.max);
}
this.inherited(arguments);
},_isInvalidDate:function(_398){
return !_398||isNaN(_398)||typeof _398!="object"||_398.toString()==this._invalidDate;
},_setValueAttr:function(_399,_39a,_39b){
if(_399!==undefined){
if(typeof _399=="string"){
_399=dojo.date.stamp.fromISOString(_399);
}
if(this._isInvalidDate(_399)){
_399=null;
}
if(_399 instanceof Date&&!(this.dateClassObj instanceof Date)){
_399=new this.dateClassObj(_399);
}
}
this.inherited(arguments);
if(this.dropDown){
this.dropDown.set("value",_399,false);
}
},_set:function(attr,_39c){
if(attr=="value"&&this.value instanceof Date&&this.compare(_39c,this.value)==0){
return;
}
this.inherited(arguments);
},_setDropDownDefaultValueAttr:function(val){
if(this._isInvalidDate(val)){
val=new this.dateClassObj();
}
this.dropDownDefaultValue=val;
},openDropDown:function(_39d){
if(this.dropDown){
this.dropDown.destroy();
}
var _39e=dojo.getObject(this.popupClass,false),_39f=this,_3a0=this.get("value");
this.dropDown=new _39e({onChange:function(_3a1){
dijit.form._DateTimeTextBox.superclass._setValueAttr.call(_39f,_3a1,true);
},id:this.id+"_popup",dir:_39f.dir,lang:_39f.lang,value:_3a0,currentFocus:!this._isInvalidDate(_3a0)?_3a0:this.dropDownDefaultValue,constraints:_39f.constraints,filterString:_39f.filterString,datePackage:_39f.datePackage,isDisabledDate:function(date){
return !_39f.rangeCheck(date,_39f.constraints);
}});
this.inherited(arguments);
},_getDisplayedValueAttr:function(){
return this.textbox.value;
},_setDisplayedValueAttr:function(_3a2,_3a3){
this._setValueAttr(this.parse(_3a2,this.constraints),_3a3,_3a2);
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
dojo.declare("dijit._TimePicker",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("dijit","templates/TimePicker.html","<div id=\"widget_${id}\" class=\"dijitMenu\"\n    ><div dojoAttachPoint=\"upArrow\" class=\"dijitButtonNode dijitUpArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div></div\n    ><div dojoAttachPoint=\"timeMenu,focusNode\" dojoAttachEvent=\"onclick:_onOptionSelected,onmouseover,onmouseout\"></div\n    ><div dojoAttachPoint=\"downArrow\" class=\"dijitButtonNode dijitDownArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div></div\n></div>\n"),baseClass:"dijitTimePicker",clickableIncrement:"T00:15:00",visibleIncrement:"T01:00:00",visibleRange:"T05:00:00",value:new Date(),_visibleIncrement:2,_clickableIncrement:1,_totalIncrements:10,constraints:{},serialize:dojo.date.stamp.toISOString,setValue:function(_3a4){
dojo.deprecated("dijit._TimePicker:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_3a4);
},_setValueAttr:function(date){
this._set("value",date);
this._showText();
},_setFilterStringAttr:function(val){
this._set("filterString",val);
this._showText();
},isDisabledDate:function(_3a5,_3a6){
return false;
},_getFilteredNodes:function(_3a7,_3a8,_3a9,_3aa){
var _3ab=[],_3ac=_3aa?_3aa.date:this._refDate,n,i=_3a7,max=this._maxIncrement+Math.abs(i),chk=_3a9?-1:1,dec=_3a9?1:0,inc=1-dec;
do{
i=i-dec;
n=this._createOption(i);
if(n){
if((_3a9&&n.date>_3ac)||(!_3a9&&n.date<_3ac)){
break;
}
_3ab[_3a9?"unshift":"push"](n);
_3ac=n.date;
}
i=i+inc;
}while(_3ab.length<_3a8&&(i*chk)<max);
return _3ab;
},_showText:function(){
var _3ad=dojo.date.stamp.fromISOString;
this.timeMenu.innerHTML="";
this._clickableIncrementDate=_3ad(this.clickableIncrement);
this._visibleIncrementDate=_3ad(this.visibleIncrement);
this._visibleRangeDate=_3ad(this.visibleRange);
var _3ae=function(date){
return date.getHours()*60*60+date.getMinutes()*60+date.getSeconds();
},_3af=_3ae(this._clickableIncrementDate),_3b0=_3ae(this._visibleIncrementDate),_3b1=_3ae(this._visibleRangeDate),time=(this.value||this.currentFocus).getTime();
this._refDate=new Date(time-time%(_3b0*1000));
this._refDate.setFullYear(1970,0,1);
this._clickableIncrement=1;
this._totalIncrements=_3b1/_3af;
this._visibleIncrement=_3b0/_3af;
this._maxIncrement=(60*60*24)/_3af;
var _3b2=this._getFilteredNodes(0,Math.min(this._totalIncrements>>1,10)-1),_3b3=this._getFilteredNodes(0,Math.min(this._totalIncrements,10)-_3b2.length,true,_3b2[0]);
dojo.forEach(_3b3.concat(_3b2),function(n){
this.timeMenu.appendChild(n);
},this);
},constructor:function(){
this.constraints={};
},postMixInProperties:function(){
this.inherited(arguments);
this._setConstraintsAttr(this.constraints);
},_setConstraintsAttr:function(_3b4){
dojo.mixin(this,_3b4);
if(!_3b4.locale){
_3b4.locale=this.lang;
}
},postCreate:function(){
this.connect(this.timeMenu,dojo.isIE?"onmousewheel":"DOMMouseScroll","_mouseWheeled");
this._connects.push(dijit.typematic.addMouseListener(this.upArrow,this,"_onArrowUp",33,250));
this._connects.push(dijit.typematic.addMouseListener(this.downArrow,this,"_onArrowDown",33,250));
this.inherited(arguments);
},_buttonMouse:function(e){
dojo.toggleClass(e.currentTarget,e.currentTarget==this.upArrow?"dijitUpArrowHover":"dijitDownArrowHover",e.type=="mouseenter"||e.type=="mouseover");
},_createOption:function(_3b5){
var date=new Date(this._refDate);
var _3b6=this._clickableIncrementDate;
date.setHours(date.getHours()+_3b6.getHours()*_3b5,date.getMinutes()+_3b6.getMinutes()*_3b5,date.getSeconds()+_3b6.getSeconds()*_3b5);
if(this.constraints.selector=="time"){
date.setFullYear(1970,0,1);
}
var _3b7=dojo.date.locale.format(date,this.constraints);
if(this.filterString&&_3b7.toLowerCase().indexOf(this.filterString)!==0){
return null;
}
var div=dojo.create("div",{"class":this.baseClass+"Item"});
div.date=date;
div.index=_3b5;
dojo.create("div",{"class":this.baseClass+"ItemInner",innerHTML:_3b7},div);
if(_3b5%this._visibleIncrement<1&&_3b5%this._visibleIncrement>-1){
dojo.addClass(div,this.baseClass+"Marker");
}else{
if(!(_3b5%this._clickableIncrement)){
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
var _3b8=tgt.target.date||tgt.target.parentNode.date;
if(!_3b8||this.isDisabledDate(_3b8)){
return;
}
this._highlighted_option=null;
this.set("value",_3b8);
this.onChange(_3b8);
},onChange:function(time){
},_highlightOption:function(node,_3b9){
if(!node){
return;
}
if(_3b9){
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
dojo.toggleClass(node,this.baseClass+"ItemHover",_3b9);
if(dojo.hasClass(node,this.baseClass+"Marker")){
dojo.toggleClass(node,this.baseClass+"MarkerHover",_3b9);
}else{
dojo.toggleClass(node,this.baseClass+"TickHover",_3b9);
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
var _3ba=(dojo.isIE?e.wheelDelta:-e.detail);
this[(_3ba>0?"_onArrowUp":"_onArrowDown")]();
},_onArrowUp:function(_3bb){
if(typeof _3bb=="number"&&_3bb==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _3bc=this.timeMenu.childNodes[0].index;
var divs=this._getFilteredNodes(_3bc,1,true,this.timeMenu.childNodes[0]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
this.timeMenu.insertBefore(divs[0],this.timeMenu.childNodes[0]);
}
},_onArrowDown:function(_3bd){
if(typeof _3bd=="number"&&_3bd==-1){
return;
}
if(!this.timeMenu.childNodes.length){
return;
}
var _3be=this.timeMenu.childNodes[this.timeMenu.childNodes.length-1].index+1;
var divs=this._getFilteredNodes(_3be,1,false,this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
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
var _3bf=this.timeMenu,tgt=this._highlighted_option||dojo.query("."+this.baseClass+"ItemSelected",_3bf)[0];
if(!tgt){
tgt=_3bf.childNodes[0];
}else{
if(_3bf.childNodes.length){
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
if(!dojo._hasResource["dojo.data.util.filter"]){
dojo._hasResource["dojo.data.util.filter"]=true;
dojo.provide("dojo.data.util.filter");
dojo.getObject("data.util.filter",true,dojo);
dojo.data.util.filter.patternToRegExp=function(_3c0,_3c1){
var rxp="^";
var c=null;
for(var i=0;i<_3c0.length;i++){
c=_3c0.charAt(i);
switch(c){
case "\\":
rxp+=c;
i++;
rxp+=_3c0.charAt(i);
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
if(_3c1){
return new RegExp(rxp,"mi");
}else{
return new RegExp(rxp,"m");
}
};
}
if(!dojo._hasResource["dijit.form.ComboBox"]){
dojo._hasResource["dijit.form.ComboBox"]=true;
dojo.provide("dijit.form.ComboBox");
dojo.declare("dijit.form.ComboBoxMixin",dijit._HasDropDown,{item:null,pageSize:Infinity,store:null,fetchProperties:{},query:{},autoComplete:true,highlightMatch:"first",searchDelay:100,searchAttr:"name",labelAttr:"",labelType:"text",queryExpr:"${0}*",ignoreCase:true,hasDownArrow:true,templateString:dojo.cache("dijit.form","templates/DropDownBox.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n"),baseClass:"dijitTextBox dijitComboBox",dropDownClass:"dijit.form._ComboBoxMenu",cssStateNodes:{"_buttonNode":"dijitDownArrowButton"},maxHeight:-1,_stopClickEvents:false,_getCaretPos:function(_3c2){
var pos=0;
if(typeof (_3c2.selectionStart)=="number"){
pos=_3c2.selectionStart;
}else{
if(dojo.isIE){
var tr=dojo.doc.selection.createRange().duplicate();
var ntr=_3c2.createTextRange();
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
},_setCaretPos:function(_3c3,_3c4){
_3c4=parseInt(_3c4);
dijit.selectInputText(_3c3,_3c4,_3c4);
},_setDisabledAttr:function(_3c5){
this.inherited(arguments);
dijit.setWaiState(this.domNode,"disabled",_3c5);
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
var _3c6=false;
var pw=this.dropDown;
var dk=dojo.keys;
var _3c7=null;
this._prev_key_backspace=false;
this._abortQuery();
this.inherited(arguments);
if(this._opened){
_3c7=pw.getHighlightedOption();
}
switch(key){
case dk.PAGE_DOWN:
case dk.DOWN_ARROW:
case dk.PAGE_UP:
case dk.UP_ARROW:
if(this._opened){
this._announceOption(_3c7);
}
dojo.stopEvent(evt);
break;
case dk.ENTER:
if(_3c7){
if(_3c7==pw.nextButton){
this._nextSearch(1);
dojo.stopEvent(evt);
break;
}else{
if(_3c7==pw.previousButton){
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
var _3c8=this.get("displayedValue");
if(pw&&(_3c8==pw._messages["previousMessage"]||_3c8==pw._messages["nextMessage"])){
break;
}
if(_3c7){
this._selectOption();
}
if(this._opened){
this._lastQuery=null;
this.closeDropDown();
}
break;
case " ":
if(_3c7){
dojo.stopEvent(evt);
this._selectOption();
this.closeDropDown();
}else{
_3c6=true;
}
break;
case dk.DELETE:
case dk.BACKSPACE:
this._prev_key_backspace=true;
_3c6=true;
break;
default:
_3c6=typeof key=="string"||key==229;
}
if(_3c6){
this.item=undefined;
this.searchTimer=setTimeout(dojo.hitch(this,"_startSearchFromInput"),1);
}
},_autoCompleteText:function(text){
var fn=this.focusNode;
dijit.selectInputText(fn,fn.value.length);
var _3c9=this.ignoreCase?"toLowerCase":"substr";
if(text[_3c9](0).indexOf(this.focusNode.value[_3c9](0))==0){
var cpos=this._getCaretPos(fn);
if((cpos+1)>fn.value.length){
fn.value=text;
dijit.selectInputText(fn,cpos);
}
}else{
fn.value=text;
dijit.selectInputText(fn);
}
},_openResultList:function(_3ca,_3cb){
this._fetchHandle=null;
if(this.disabled||this.readOnly||(_3cb.query[this.searchAttr]!=this._lastQuery)){
return;
}
var _3cc=this.dropDown._highlighted_option&&dojo.hasClass(this.dropDown._highlighted_option,"dijitMenuItemSelected");
this.dropDown.clearResultList();
if(!_3ca.length&&!this._maxOptions){
this.closeDropDown();
return;
}
_3cb._maxOptions=this._maxOptions;
var _3cd=this.dropDown.createOptions(_3ca,_3cb,dojo.hitch(this,"_getMenuLabelFromItem"));
this._showResultList();
if(_3cb.direction){
if(1==_3cb.direction){
this.dropDown.highlightFirstOption();
}else{
if(-1==_3cb.direction){
this.dropDown.highlightLastOption();
}
}
if(_3cc){
this._announceOption(this.dropDown.getHighlightedOption());
}
}else{
if(this.autoComplete&&!this._prev_key_backspace&&!/^[*]+$/.test(_3cb.query[this.searchAttr])){
this._announceOption(_3cd[1]);
}
}
},_showResultList:function(){
this.closeDropDown(true);
this.displayMessage("");
this.openDropDown();
dijit.setWaiState(this.domNode,"expanded","true");
},loadDropDown:function(_3ce){
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
var _3cf=this.get("displayedValue");
var pw=this.dropDown;
if(pw&&(_3cf==pw._messages["previousMessage"]||_3cf==pw._messages["nextMessage"])){
this._setValueAttr(this._lastValueReported,true);
}else{
if(typeof this.item=="undefined"){
this.item=null;
this.set("displayedValue",_3cf);
}else{
if(_3cf===""){
this.item=null;
this.set("displayedValue",_3cf);
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
},_setItemAttr:function(item,_3d0,_3d1){
if(!_3d1){
_3d1=this.store.getValue(item,this.searchAttr);
}
var _3d2=this._getValueField()!=this.searchAttr?this.store.getIdentity(item):_3d1;
this._set("item",item);
dijit.form.ComboBox.superclass._setValueAttr.call(this,_3d2,_3d0,_3d1);
},_announceOption:function(node){
if(!node){
return;
}
var _3d3;
if(node==this.dropDown.nextButton||node==this.dropDown.previousButton){
_3d3=node.innerHTML;
this.item=undefined;
this.value="";
}else{
_3d3=this.store.getValue(node.item,this.searchAttr).toString();
this.set("item",node.item,false,_3d3);
}
this.focusNode.value=this.focusNode.value.substring(0,this._lastInput.length);
dijit.setWaiState(this.focusNode,"activedescendant",dojo.attr(node,"id"));
this._autoCompleteText(_3d3);
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
var _3d4=this.id+"_popup",_3d5=dojo.getObject(this.dropDownClass,false);
this.dropDown=new _3d5({onChange:dojo.hitch(this,this._selectOption),id:_3d4,dir:this.dir});
dijit.removeWaiState(this.focusNode,"activedescendant");
dijit.setWaiState(this.textbox,"owns",_3d4);
}
var _3d6=dojo.clone(this.query);
this._lastInput=key;
this._lastQuery=_3d6[this.searchAttr]=this._getQueryString(key);
this.searchTimer=setTimeout(dojo.hitch(this,function(_3d7,_3d8){
this.searchTimer=null;
var _3d9={queryOptions:{ignoreCase:this.ignoreCase,deep:true},query:_3d7,onBegin:dojo.hitch(this,"_setMaxOptions"),onComplete:dojo.hitch(this,"_openResultList"),onError:function(_3da){
_3d8._fetchHandle=null;
console.error("dijit.form.ComboBox: "+_3da);
_3d8.closeDropDown();
},start:0,count:this.pageSize};
dojo.mixin(_3d9,_3d8.fetchProperties);
this._fetchHandle=_3d8.store.fetch(_3d9);
var _3db=function(_3dc,_3dd){
_3dc.start+=_3dc.count*_3dd;
_3dc.direction=_3dd;
this._fetchHandle=this.store.fetch(_3dc);
this.focus();
};
this._nextSearch=this.dropDown.onPage=dojo.hitch(this,_3db,this._fetchHandle);
},_3d6,this),this.searchDelay);
},_setMaxOptions:function(size,_3de){
this._maxOptions=size;
},_getValueField:function(){
return this.searchAttr;
},constructor:function(){
this.query={};
this.fetchProperties={};
},postMixInProperties:function(){
if(!this.store){
var _3df=this.srcNodeRef;
this.store=new dijit.form._ComboBoxDataStore(_3df);
if(!("value" in this.params)){
var item=(this.item=this.store.fetchSelectedItem());
if(item){
var _3e0=this._getValueField();
this.value=this.store.getValue(item,_3e0);
}
}
}
this.inherited(arguments);
},postCreate:function(){
var _3e1=dojo.query("label[for=\""+this.id+"\"]");
if(_3e1.length){
_3e1[0].id=(this.id+"_label");
dijit.setWaiState(this.domNode,"labelledby",_3e1[0].id);
}
this.inherited(arguments);
},_setHasDownArrowAttr:function(val){
this.hasDownArrow=val;
this._buttonNode.style.display=val?"":"none";
},_getMenuLabelFromItem:function(item){
var _3e2=this.labelFunc(item,this.store),_3e3=this.labelType;
if(this.highlightMatch!="none"&&this.labelType=="text"&&this._lastInput){
_3e2=this.doHighlight(_3e2,this._escapeHtml(this._lastInput));
_3e3="html";
}
return {html:_3e3=="html",label:_3e2};
},doHighlight:function(_3e4,find){
var _3e5=(this.ignoreCase?"i":"")+(this.highlightMatch=="all"?"g":""),i=this.queryExpr.indexOf("${0}");
find=dojo.regexp.escapeString(find);
return this._escapeHtml(_3e4).replace(new RegExp((i==0?"^":"")+"("+find+")"+(i==(this.queryExpr.length-4)?"$":""),_3e5),"<span class=\"dijitComboBoxHighlightMatch\">$1</span>");
},_escapeHtml:function(str){
str=String(str).replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
return str;
},reset:function(){
this.item=null;
this.inherited(arguments);
},labelFunc:function(item,_3e6){
return _3e6.getValue(item,this.labelAttr||this.searchAttr).toString();
}});
dojo.declare("dijit.form._ComboBoxMenu",[dijit._Widget,dijit._Templated,dijit._CssStateMixin],{templateString:"<ul class='dijitReset dijitMenu' dojoAttachEvent='onmousedown:_onMouseDown,onmouseup:_onMouseUp,onmouseover:_onMouseOver,onmouseout:_onMouseOut' style='overflow: \"auto\"; overflow-x: \"hidden\";'>"+"<li class='dijitMenuItem dijitMenuPreviousButton' dojoAttachPoint='previousButton' role='option'></li>"+"<li class='dijitMenuItem dijitMenuNextButton' dojoAttachPoint='nextButton' role='option'></li>"+"</ul>",_messages:null,baseClass:"dijitComboBoxMenu",postMixInProperties:function(){
this.inherited(arguments);
this._messages=dojo.i18n.getLocalization("dijit.form","ComboBox",this.lang);
},buildRendering:function(){
this.inherited(arguments);
this.previousButton.innerHTML=this._messages["previousMessage"];
this.nextButton.innerHTML=this._messages["nextMessage"];
},_setValueAttr:function(_3e7){
this.value=_3e7;
this.onChange(_3e7);
},onChange:function(_3e8){
},onPage:function(_3e9){
},onClose:function(){
this._blurOptionNode();
},_createOption:function(item,_3ea){
var _3eb=dojo.create("li",{"class":"dijitReset dijitMenuItem"+(this.isLeftToRight()?"":" dijitMenuItemRtl"),role:"option"});
var _3ec=_3ea(item);
if(_3ec.html){
_3eb.innerHTML=_3ec.label;
}else{
_3eb.appendChild(dojo.doc.createTextNode(_3ec.label));
}
if(_3eb.innerHTML==""){
_3eb.innerHTML="&nbsp;";
}
_3eb.item=item;
return _3eb;
},createOptions:function(_3ed,_3ee,_3ef){
this.previousButton.style.display=(_3ee.start==0)?"none":"";
dojo.attr(this.previousButton,"id",this.id+"_prev");
dojo.forEach(_3ed,function(item,i){
var _3f0=this._createOption(item,_3ef);
if(item.indent){
dojo.addClass(_3f0,"indentOption"+(item.indent===true)?"":item.indent);
}
dojo.attr(_3f0,"id",this.id+i);
this.domNode.insertBefore(_3f0,this.nextButton);
},this);
var _3f1=false;
if(_3ee._maxOptions&&_3ee._maxOptions!=-1){
if((_3ee.start+_3ee.count)<_3ee._maxOptions){
_3f1=true;
}else{
if((_3ee.start+_3ee.count)>_3ee._maxOptions&&_3ee.count==_3ed.length){
_3f1=true;
}
}
}else{
if(_3ee.count==_3ed.length){
_3f1=true;
}
}
this.nextButton.style.display=_3f1?"":"none";
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
var _3f2=this.domNode.firstChild;
var _3f3=_3f2.nextSibling;
this._focusOptionNode(_3f3.style.display=="none"?_3f2:_3f3);
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
var _3f4=0;
var _3f5=this.domNode.scrollTop;
var _3f6=dojo.style(this.domNode,"height");
if(!this.getHighlightedOption()){
this._highlightNextOption();
}
while(_3f4<_3f6){
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
var _3f7=this.domNode.scrollTop;
_3f4+=(_3f7-_3f5)*(up?-1:1);
_3f5=_3f7;
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
dojo.declare("dijit.form.ComboBox",[dijit.form.ValidationTextBox,dijit.form.ComboBoxMixin],{_setValueAttr:function(_3f8,_3f9,_3fa){
this._set("item",null);
var self=this;
this.store.fetchItemByIdentity({identity:_3f8,onItem:function(item){
self._set("item",item);
}});
if(!_3f8){
_3f8="";
}
dijit.form.ValidationTextBox.prototype._setValueAttr.call(this,_3f8,_3f9,_3fa);
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
},getValue:function(item,_3fb,_3fc){
return (_3fb=="value")?item.value:(item.innerText||item.textContent||"");
},isItemLoaded:function(_3fd){
return true;
},getFeatures:function(){
return {"dojo.data.api.Read":true,"dojo.data.api.Identity":true};
},_fetchItems:function(args,_3fe,_3ff){
if(!args.query){
args.query={};
}
if(!args.query.name){
args.query.name="";
}
if(!args.queryOptions){
args.queryOptions={};
}
var _400=dojo.data.util.filter.patternToRegExp(args.query.name,args.queryOptions.ignoreCase),_401=dojo.query("> option",this.root).filter(function(_402){
return (_402.innerText||_402.textContent||"").match(_400);
});
if(args.sort){
_401.sort(dojo.data.util.sorter.createSortFunction(args.sort,this));
}
_3fe(_401,args);
},close:function(_403){
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
if(!dojo._hasResource["dojo.data.ItemFileReadStore"]){
dojo._hasResource["dojo.data.ItemFileReadStore"]=true;
dojo.provide("dojo.data.ItemFileReadStore");
dojo.declare("dojo.data.ItemFileReadStore",null,{constructor:function(_404){
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=[];
this._loadFinished=false;
this._jsonFileUrl=_404.url;
this._ccUrl=_404.url;
this.url=_404.url;
this._jsonData=_404.data;
this.data=null;
this._datatypeMap=_404.typeMap||{};
if(!this._datatypeMap["Date"]){
this._datatypeMap["Date"]={type:Date,deserialize:function(_405){
return dojo.date.stamp.fromISOString(_405);
}};
}
this._features={"dojo.data.api.Read":true,"dojo.data.api.Identity":true};
this._itemsByIdentity=null;
this._storeRefPropName="_S";
this._itemNumPropName="_0";
this._rootItemPropName="_RI";
this._reverseRefMap="_RRM";
this._loadInProgress=false;
this._queuedFetches=[];
if(_404.urlPreventCache!==undefined){
this.urlPreventCache=_404.urlPreventCache?true:false;
}
if(_404.hierarchical!==undefined){
this.hierarchical=_404.hierarchical?true:false;
}
if(_404.clearOnClose){
this.clearOnClose=true;
}
if("failOk" in _404){
this.failOk=_404.failOk?true:false;
}
},url:"",_ccUrl:"",data:null,typeMap:null,clearOnClose:false,urlPreventCache:false,failOk:false,hierarchical:true,_assertIsItem:function(item){
if(!this.isItem(item)){
throw new Error("dojo.data.ItemFileReadStore: Invalid item argument.");
}
},_assertIsAttribute:function(_406){
if(typeof _406!=="string"){
throw new Error("dojo.data.ItemFileReadStore: Invalid attribute argument.");
}
},getValue:function(item,_407,_408){
var _409=this.getValues(item,_407);
return (_409.length>0)?_409[0]:_408;
},getValues:function(item,_40a){
this._assertIsItem(item);
this._assertIsAttribute(_40a);
if(_40a.indexOf(".")!=-1){
var _40b=_40a.split(/\./);
var _40c=item;
for(var i=0;i<_40b.length;i++){
var key=_40b[i];
if(_40c[key]&&_40c[key][0]){
_40c=i==_40b.length-1?_40c[key]:_40c[key][0];
}else{
_40c=null;
break;
}
}
if(_40c!==null){
return _40c;
}
}
return (item[_40a]||[]).slice(0);
},getAttributes:function(item){
this._assertIsItem(item);
var _40d=[];
for(var key in item){
if((key!==this._storeRefPropName)&&(key!==this._itemNumPropName)&&(key!==this._rootItemPropName)&&(key!==this._reverseRefMap)){
_40d.push(key);
}
}
return _40d;
},hasAttribute:function(item,_40e){
this._assertIsItem(item);
this._assertIsAttribute(_40e);
return (_40e in item);
},containsValue:function(item,_40f,_410){
var _411=undefined;
if(typeof _410==="string"){
_411=dojo.data.util.filter.patternToRegExp(_410,false);
}
return this._containsValue(item,_40f,_410,_411);
},_containsValue:function(item,_412,_413,_414){
return dojo.some(this.getValues(item,_412),function(_415){
if(_415!==null&&!dojo.isObject(_415)&&_414){
if(_415.toString().match(_414)){
return true;
}
}else{
if(_413===_415){
return true;
}
}
});
},isItem:function(_416){
if(_416&&_416[this._storeRefPropName]===this){
if(this._arrayOfAllItems[_416[this._itemNumPropName]]===_416){
return true;
}
}
return false;
},isItemLoaded:function(_417){
return this.isItem(_417);
},loadItem:function(_418){
this._assertIsItem(_418.item);
},getFeatures:function(){
return this._features;
},getLabel:function(item){
if(this._labelAttr&&this.isItem(item)){
return this.getValue(item,this._labelAttr);
}
return undefined;
},getLabelAttributes:function(item){
if(this._labelAttr){
return [this._labelAttr];
}
return null;
},_fetchItems:function(_419,_41a,_41b){
var self=this,_41c=function(_41d,_41e){
var _41f=[],i,key;
if(_41d.query){
var _420,_421=_41d.queryOptions?_41d.queryOptions.ignoreCase:false;
var _422={};
for(key in _41d.query){
_420=_41d.query[key];
if(typeof _420==="string"){
_422[key]=dojo.data.util.filter.patternToRegExp(_420,_421);
}else{
if(_420 instanceof RegExp){
_422[key]=_420;
}
}
}
for(i=0;i<_41e.length;++i){
var _423=true;
var _424=_41e[i];
if(_424===null){
_423=false;
}else{
for(key in _41d.query){
_420=_41d.query[key];
if(!self._containsValue(_424,key,_420,_422[key])){
_423=false;
}
}
}
if(_423){
_41f.push(_424);
}
}
_41a(_41f,_41d);
}else{
for(i=0;i<_41e.length;++i){
var item=_41e[i];
if(item!==null){
_41f.push(item);
}
}
_41a(_41f,_41d);
}
};
if(this._loadFinished){
_41c(_419,this._getItemsArray(_419.queryOptions));
}else{
if(this._jsonFileUrl!==this._ccUrl){
dojo.deprecated("dojo.data.ItemFileReadStore: ","To change the url, set the url property of the store,"+" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
this._ccUrl=this._jsonFileUrl;
this.url=this._jsonFileUrl;
}else{
if(this.url!==this._ccUrl){
this._jsonFileUrl=this.url;
this._ccUrl=this.url;
}
}
if(this.data!=null){
this._jsonData=this.data;
this.data=null;
}
if(this._jsonFileUrl){
if(this._loadInProgress){
this._queuedFetches.push({args:_419,filter:_41c});
}else{
this._loadInProgress=true;
var _425={url:self._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk};
var _426=dojo.xhrGet(_425);
_426.addCallback(function(data){
try{
self._getItemsFromLoadedData(data);
self._loadFinished=true;
self._loadInProgress=false;
_41c(_419,self._getItemsArray(_419.queryOptions));
self._handleQueuedFetches();
}
catch(e){
self._loadFinished=true;
self._loadInProgress=false;
_41b(e,_419);
}
});
_426.addErrback(function(_427){
self._loadInProgress=false;
_41b(_427,_419);
});
var _428=null;
if(_419.abort){
_428=_419.abort;
}
_419.abort=function(){
var df=_426;
if(df&&df.fired===-1){
df.cancel();
df=null;
}
if(_428){
_428.call(_419);
}
};
}
}else{
if(this._jsonData){
try{
this._loadFinished=true;
this._getItemsFromLoadedData(this._jsonData);
this._jsonData=null;
_41c(_419,this._getItemsArray(_419.queryOptions));
}
catch(e){
_41b(e,_419);
}
}else{
_41b(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."),_419);
}
}
}
},_handleQueuedFetches:function(){
if(this._queuedFetches.length>0){
for(var i=0;i<this._queuedFetches.length;i++){
var _429=this._queuedFetches[i],_42a=_429.args,_42b=_429.filter;
if(_42b){
_42b(_42a,this._getItemsArray(_42a.queryOptions));
}else{
this.fetchItemByIdentity(_42a);
}
}
this._queuedFetches=[];
}
},_getItemsArray:function(_42c){
if(_42c&&_42c.deep){
return this._arrayOfAllItems;
}
return this._arrayOfTopLevelItems;
},close:function(_42d){
if(this.clearOnClose&&this._loadFinished&&!this._loadInProgress){
if(((this._jsonFileUrl==""||this._jsonFileUrl==null)&&(this.url==""||this.url==null))&&this.data==null){
}
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=[];
this._loadFinished=false;
this._itemsByIdentity=null;
this._loadInProgress=false;
this._queuedFetches=[];
}
},_getItemsFromLoadedData:function(_42e){
var _42f=false,self=this;
function _430(_431){
var _432=((_431!==null)&&(typeof _431==="object")&&(!dojo.isArray(_431)||_42f)&&(!dojo.isFunction(_431))&&(_431.constructor==Object||dojo.isArray(_431))&&(typeof _431._reference==="undefined")&&(typeof _431._type==="undefined")&&(typeof _431._value==="undefined")&&self.hierarchical);
return _432;
};
function _433(_434){
self._arrayOfAllItems.push(_434);
for(var _435 in _434){
var _436=_434[_435];
if(_436){
if(dojo.isArray(_436)){
var _437=_436;
for(var k=0;k<_437.length;++k){
var _438=_437[k];
if(_430(_438)){
_433(_438);
}
}
}else{
if(_430(_436)){
_433(_436);
}
}
}
}
};
this._labelAttr=_42e.label;
var i,item;
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=_42e.items;
for(i=0;i<this._arrayOfTopLevelItems.length;++i){
item=this._arrayOfTopLevelItems[i];
if(dojo.isArray(item)){
_42f=true;
}
_433(item);
item[this._rootItemPropName]=true;
}
var _439={},key;
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
for(key in item){
if(key!==this._rootItemPropName){
var _43a=item[key];
if(_43a!==null){
if(!dojo.isArray(_43a)){
item[key]=[_43a];
}
}else{
item[key]=[null];
}
}
_439[key]=key;
}
}
while(_439[this._storeRefPropName]){
this._storeRefPropName+="_";
}
while(_439[this._itemNumPropName]){
this._itemNumPropName+="_";
}
while(_439[this._reverseRefMap]){
this._reverseRefMap+="_";
}
var _43b;
var _43c=_42e.identifier;
if(_43c){
this._itemsByIdentity={};
this._features["dojo.data.api.Identity"]=_43c;
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
_43b=item[_43c];
var _43d=_43b[0];
if(!Object.hasOwnProperty.call(this._itemsByIdentity,_43d)){
this._itemsByIdentity[_43d]=item;
}else{
if(this._jsonFileUrl){
throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: ["+this._jsonFileUrl+"] is malformed.  Items within the list have identifier: ["+_43c+"].  Value collided: ["+_43d+"]");
}else{
if(this._jsonData){
throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: ["+_43c+"].  Value collided: ["+_43d+"]");
}
}
}
}
}else{
this._features["dojo.data.api.Identity"]=Number;
}
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
item[this._storeRefPropName]=this;
item[this._itemNumPropName]=i;
}
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
for(key in item){
_43b=item[key];
for(var j=0;j<_43b.length;++j){
_43a=_43b[j];
if(_43a!==null&&typeof _43a=="object"){
if(("_type" in _43a)&&("_value" in _43a)){
var type=_43a._type;
var _43e=this._datatypeMap[type];
if(!_43e){
throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '"+type+"'");
}else{
if(dojo.isFunction(_43e)){
_43b[j]=new _43e(_43a._value);
}else{
if(dojo.isFunction(_43e.deserialize)){
_43b[j]=_43e.deserialize(_43a._value);
}else{
throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
}
}
}
}
if(_43a._reference){
var _43f=_43a._reference;
if(!dojo.isObject(_43f)){
_43b[j]=this._getItemByIdentity(_43f);
}else{
for(var k=0;k<this._arrayOfAllItems.length;++k){
var _440=this._arrayOfAllItems[k],_441=true;
for(var _442 in _43f){
if(_440[_442]!=_43f[_442]){
_441=false;
}
}
if(_441){
_43b[j]=_440;
}
}
}
if(this.referenceIntegrity){
var _443=_43b[j];
if(this.isItem(_443)){
this._addReferenceToMap(_443,item,key);
}
}
}else{
if(this.isItem(_43a)){
if(this.referenceIntegrity){
this._addReferenceToMap(_43a,item,key);
}
}
}
}
}
}
}
},_addReferenceToMap:function(_444,_445,_446){
},getIdentity:function(item){
var _447=this._features["dojo.data.api.Identity"];
if(_447===Number){
return item[this._itemNumPropName];
}else{
var _448=item[_447];
if(_448){
return _448[0];
}
}
return null;
},fetchItemByIdentity:function(_449){
var item,_44a;
if(!this._loadFinished){
var self=this;
if(this._jsonFileUrl!==this._ccUrl){
dojo.deprecated("dojo.data.ItemFileReadStore: ","To change the url, set the url property of the store,"+" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
this._ccUrl=this._jsonFileUrl;
this.url=this._jsonFileUrl;
}else{
if(this.url!==this._ccUrl){
this._jsonFileUrl=this.url;
this._ccUrl=this.url;
}
}
if(this.data!=null&&this._jsonData==null){
this._jsonData=this.data;
this.data=null;
}
if(this._jsonFileUrl){
if(this._loadInProgress){
this._queuedFetches.push({args:_449});
}else{
this._loadInProgress=true;
var _44b={url:self._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk};
var _44c=dojo.xhrGet(_44b);
_44c.addCallback(function(data){
var _44d=_449.scope?_449.scope:dojo.global;
try{
self._getItemsFromLoadedData(data);
self._loadFinished=true;
self._loadInProgress=false;
item=self._getItemByIdentity(_449.identity);
if(_449.onItem){
_449.onItem.call(_44d,item);
}
self._handleQueuedFetches();
}
catch(error){
self._loadInProgress=false;
if(_449.onError){
_449.onError.call(_44d,error);
}
}
});
_44c.addErrback(function(_44e){
self._loadInProgress=false;
if(_449.onError){
var _44f=_449.scope?_449.scope:dojo.global;
_449.onError.call(_44f,_44e);
}
});
}
}else{
if(this._jsonData){
self._getItemsFromLoadedData(self._jsonData);
self._jsonData=null;
self._loadFinished=true;
item=self._getItemByIdentity(_449.identity);
if(_449.onItem){
_44a=_449.scope?_449.scope:dojo.global;
_449.onItem.call(_44a,item);
}
}
}
}else{
item=this._getItemByIdentity(_449.identity);
if(_449.onItem){
_44a=_449.scope?_449.scope:dojo.global;
_449.onItem.call(_44a,item);
}
}
},_getItemByIdentity:function(_450){
var item=null;
if(this._itemsByIdentity&&Object.hasOwnProperty.call(this._itemsByIdentity,_450)){
item=this._itemsByIdentity[_450];
}else{
if(Object.hasOwnProperty.call(this._arrayOfAllItems,_450)){
item=this._arrayOfAllItems[_450];
}
}
if(item===undefined){
item=null;
}
return item;
},getIdentityAttributes:function(item){
var _451=this._features["dojo.data.api.Identity"];
if(_451===Number){
return null;
}else{
return [_451];
}
},_forceLoad:function(){
var self=this;
if(this._jsonFileUrl!==this._ccUrl){
dojo.deprecated("dojo.data.ItemFileReadStore: ","To change the url, set the url property of the store,"+" not _jsonFileUrl.  _jsonFileUrl support will be removed in 2.0");
this._ccUrl=this._jsonFileUrl;
this.url=this._jsonFileUrl;
}else{
if(this.url!==this._ccUrl){
this._jsonFileUrl=this.url;
this._ccUrl=this.url;
}
}
if(this.data!=null){
this._jsonData=this.data;
this.data=null;
}
if(this._jsonFileUrl){
var _452={url:this._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk,sync:true};
var _453=dojo.xhrGet(_452);
_453.addCallback(function(data){
try{
if(self._loadInProgress!==true&&!self._loadFinished){
self._getItemsFromLoadedData(data);
self._loadFinished=true;
}else{
if(self._loadInProgress){
throw new Error("dojo.data.ItemFileReadStore:  Unable to perform a synchronous load, an async load is in progress.");
}
}
}
catch(e){
throw e;
}
});
_453.addErrback(function(_454){
throw _454;
});
}else{
if(this._jsonData){
self._getItemsFromLoadedData(self._jsonData);
self._jsonData=null;
self._loadFinished=true;
}
}
}});
dojo.extend(dojo.data.ItemFileReadStore,dojo.data.util.simpleFetch);
}
if(!dojo._hasResource["dijit.form.ToggleButton"]){
dojo._hasResource["dijit.form.ToggleButton"]=true;
dojo.provide("dijit.form.ToggleButton");
}
if(!dojo._hasResource["dijit.form.CheckBox"]){
dojo._hasResource["dijit.form.CheckBox"]=true;
dojo.provide("dijit.form.CheckBox");
dojo.declare("dijit.form.CheckBox",dijit.form.ToggleButton,{templateString:dojo.cache("dijit.form","templates/CheckBox.html","<div class=\"dijit dijitReset dijitInline\" role=\"presentation\"\n\t><input\n\t \t${!nameAttrSetting} type=\"${type}\" ${checkedAttrSetting}\n\t\tclass=\"dijitReset dijitCheckBoxInput\"\n\t\tdojoAttachPoint=\"focusNode\"\n\t \tdojoAttachEvent=\"onclick:_onClick\"\n/></div>\n"),baseClass:"dijitCheckBox",type:"checkbox",value:"on",readOnly:false,attributeMap:dojo.delegate(dijit.form._FormWidget.prototype.attributeMap,{readOnly:"focusNode"}),_setReadOnlyAttr:function(_455){
this._set("readOnly",_455);
dojo.attr(this.focusNode,"readOnly",_455);
dijit.setWaiState(this.focusNode,"readonly",_455);
},_setValueAttr:function(_456,_457){
if(typeof _456=="string"){
this._set("value",_456);
dojo.attr(this.focusNode,"value",_456);
_456=true;
}
if(this._created){
this.set("checked",_456,_457);
}
},_getValueAttr:function(){
return (this.checked?this.value:false);
},_setLabelAttr:undefined,postMixInProperties:function(){
if(this.value==""){
this.value="on";
}
this.checkedAttrSetting=this.checked?"checked":"";
this.inherited(arguments);
},_fillContent:function(_458){
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
dojo.declare("dijit.form.RadioButton",dijit.form.CheckBox,{type:"radio",baseClass:"dijitRadio",_setCheckedAttr:function(_459){
this.inherited(arguments);
if(!this._created){
return;
}
if(_459){
var _45a=this;
dojo.query("INPUT[type=radio]",this.focusNode.form||dojo.doc).forEach(function(_45b){
if(_45b.name==_45a.name&&_45b!=_45a.focusNode&&_45b.form==_45a.focusNode.form){
var _45c=dijit.getEnclosingWidget(_45b);
if(_45c&&_45c.checked){
_45c.set("checked",false);
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
if(!dojo._hasResource["dijit.form._Spinner"]){
dojo._hasResource["dijit.form._Spinner"]=true;
dojo.provide("dijit.form._Spinner");
dojo.declare("dijit.form._Spinner",dijit.form.RangeBoundTextBox,{defaultTimeout:500,minimumTimeout:10,timeoutChangeRate:0.9,smallDelta:1,largeDelta:10,templateString:dojo.cache("dijit.form","templates/Spinner.html","<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\" role=\"presentation\"\n\t><div class=\"dijitReset dijitButtonNode dijitSpinnerButtonContainer\"\n\t\t><input class=\"dijitReset dijitInputField dijitSpinnerButtonInner\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t/><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitUpArrowButton\"\n\t\t\tdojoAttachPoint=\"upArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9650;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t\t><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\tdojoAttachPoint=\"downArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9660;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' dojoAttachPoint=\"textbox,focusNode\" type=\"${type}\" dojoAttachEvent=\"onkeypress:_onKeyPress\"\n\t\t\trole=\"spinbutton\" autocomplete=\"off\" ${!nameAttrSetting}\n\t/></div\n></div>\n"),baseClass:"dijitTextBox dijitSpinner",cssStateNodes:{"upArrowNode":"dijitUpArrowButton","downArrowNode":"dijitDownArrowButton"},adjust:function(val,_45d){
return val;
},_arrowPressed:function(_45e,_45f,_460){
if(this.disabled||this.readOnly){
return;
}
this._setValueAttr(this.adjust(this.get("value"),_45f*_460),false);
dijit.selectInputText(this.textbox,this.textbox.value.length);
},_arrowReleased:function(node){
this._wheelTimer=null;
if(this.disabled||this.readOnly){
return;
}
},_typematicCallback:function(_461,node,evt){
var inc=this.smallDelta;
if(node==this.textbox){
var k=dojo.keys;
var key=evt.charOrCode;
inc=(key==k.PAGE_UP||key==k.PAGE_DOWN)?this.largeDelta:this.smallDelta;
node=(key==k.UP_ARROW||key==k.PAGE_UP)?this.upArrowNode:this.downArrowNode;
}
if(_461==-1){
this._arrowReleased(node);
}else{
this._arrowPressed(node,(node==this.upArrowNode)?1:-1,inc);
}
},_wheelTimer:null,_mouseWheeled:function(evt){
dojo.stopEvent(evt);
var _462=evt.detail?(evt.detail*-1):(evt.wheelDelta/120);
if(_462!==0){
var node=this[(_462>0?"upArrowNode":"downArrowNode")];
this._arrowPressed(node,_462,this.smallDelta);
if(!this._wheelTimer){
clearTimeout(this._wheelTimer);
}
this._wheelTimer=setTimeout(dojo.hitch(this,"_arrowReleased",node),50);
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
if(!dojo._hasResource["dojo.number"]){
dojo._hasResource["dojo.number"]=true;
dojo.provide("dojo.number");
dojo.getObject("number",true,dojo);
dojo.number.format=function(_463,_464){
_464=dojo.mixin({},_464||{});
var _465=dojo.i18n.normalizeLocale(_464.locale),_466=dojo.i18n.getLocalization("dojo.cldr","number",_465);
_464.customs=_466;
var _467=_464.pattern||_466[(_464.type||"decimal")+"Format"];
if(isNaN(_463)||Math.abs(_463)==Infinity){
return null;
}
return dojo.number._applyPattern(_463,_467,_464);
};
dojo.number._numberPatternRE=/[#0,]*[#0](?:\.0*#*)?/;
dojo.number._applyPattern=function(_468,_469,_46a){
_46a=_46a||{};
var _46b=_46a.customs.group,_46c=_46a.customs.decimal,_46d=_469.split(";"),_46e=_46d[0];
_469=_46d[(_468<0)?1:0]||("-"+_46e);
if(_469.indexOf("%")!=-1){
_468*=100;
}else{
if(_469.indexOf("‰")!=-1){
_468*=1000;
}else{
if(_469.indexOf("¤")!=-1){
_46b=_46a.customs.currencyGroup||_46b;
_46c=_46a.customs.currencyDecimal||_46c;
_469=_469.replace(/\u00a4{1,3}/,function(_46f){
var prop=["symbol","currency","displayName"][_46f.length-1];
return _46a[prop]||_46a.currency||"";
});
}else{
if(_469.indexOf("E")!=-1){
throw new Error("exponential notation not supported");
}
}
}
}
var _470=dojo.number._numberPatternRE;
var _471=_46e.match(_470);
if(!_471){
throw new Error("unable to find a number expression in pattern: "+_469);
}
if(_46a.fractional===false){
_46a.places=0;
}
return _469.replace(_470,dojo.number._formatAbsolute(_468,_471[0],{decimal:_46c,group:_46b,places:_46a.places,round:_46a.round}));
};
dojo.number.round=function(_472,_473,_474){
var _475=10/(_474||10);
return (_475*+_472).toFixed(_473)/_475;
};
if((0.9).toFixed()==0){
(function(){
var _476=dojo.number.round;
dojo.number.round=function(v,p,m){
var d=Math.pow(10,-p||0),a=Math.abs(v);
if(!v||a>=d||a*Math.pow(10,p+1)<5){
d=0;
}
return _476(v,p,m)+(v>0?d:-d);
};
})();
}
dojo.number._formatAbsolute=function(_477,_478,_479){
_479=_479||{};
if(_479.places===true){
_479.places=0;
}
if(_479.places===Infinity){
_479.places=6;
}
var _47a=_478.split("."),_47b=typeof _479.places=="string"&&_479.places.indexOf(","),_47c=_479.places;
if(_47b){
_47c=_479.places.substring(_47b+1);
}else{
if(!(_47c>=0)){
_47c=(_47a[1]||[]).length;
}
}
if(!(_479.round<0)){
_477=dojo.number.round(_477,_47c,_479.round);
}
var _47d=String(Math.abs(_477)).split("."),_47e=_47d[1]||"";
if(_47a[1]||_479.places){
if(_47b){
_479.places=_479.places.substring(0,_47b);
}
var pad=_479.places!==undefined?_479.places:(_47a[1]&&_47a[1].lastIndexOf("0")+1);
if(pad>_47e.length){
_47d[1]=dojo.string.pad(_47e,pad,"0",true);
}
if(_47c<_47e.length){
_47d[1]=_47e.substr(0,_47c);
}
}else{
if(_47d[1]){
_47d.pop();
}
}
var _47f=_47a[0].replace(",","");
pad=_47f.indexOf("0");
if(pad!=-1){
pad=_47f.length-pad;
if(pad>_47d[0].length){
_47d[0]=dojo.string.pad(_47d[0],pad);
}
if(_47f.indexOf("#")==-1){
_47d[0]=_47d[0].substr(_47d[0].length-pad);
}
}
var _480=_47a[0].lastIndexOf(","),_481,_482;
if(_480!=-1){
_481=_47a[0].length-_480-1;
var _483=_47a[0].substr(0,_480);
_480=_483.lastIndexOf(",");
if(_480!=-1){
_482=_483.length-_480-1;
}
}
var _484=[];
for(var _485=_47d[0];_485;){
var off=_485.length-_481;
_484.push((off>0)?_485.substr(off):_485);
_485=(off>0)?_485.slice(0,off):"";
if(_482){
_481=_482;
delete _482;
}
}
_47d[0]=_484.reverse().join(_479.group||",");
return _47d.join(_479.decimal||".");
};
dojo.number.regexp=function(_486){
return dojo.number._parseInfo(_486).regexp;
};
dojo.number._parseInfo=function(_487){
_487=_487||{};
var _488=dojo.i18n.normalizeLocale(_487.locale),_489=dojo.i18n.getLocalization("dojo.cldr","number",_488),_48a=_487.pattern||_489[(_487.type||"decimal")+"Format"],_48b=_489.group,_48c=_489.decimal,_48d=1;
if(_48a.indexOf("%")!=-1){
_48d/=100;
}else{
if(_48a.indexOf("‰")!=-1){
_48d/=1000;
}else{
var _48e=_48a.indexOf("¤")!=-1;
if(_48e){
_48b=_489.currencyGroup||_48b;
_48c=_489.currencyDecimal||_48c;
}
}
}
var _48f=_48a.split(";");
if(_48f.length==1){
_48f.push("-"+_48f[0]);
}
var re=dojo.regexp.buildGroupRE(_48f,function(_490){
_490="(?:"+dojo.regexp.escapeString(_490,".")+")";
return _490.replace(dojo.number._numberPatternRE,function(_491){
var _492={signed:false,separator:_487.strict?_48b:[_48b,""],fractional:_487.fractional,decimal:_48c,exponent:false},_493=_491.split("."),_494=_487.places;
if(_493.length==1&&_48d!=1){
_493[1]="###";
}
if(_493.length==1||_494===0){
_492.fractional=false;
}else{
if(_494===undefined){
_494=_487.pattern?_493[1].lastIndexOf("0")+1:Infinity;
}
if(_494&&_487.fractional==undefined){
_492.fractional=true;
}
if(!_487.places&&(_494<_493[1].length)){
_494+=","+_493[1].length;
}
_492.places=_494;
}
var _495=_493[0].split(",");
if(_495.length>1){
_492.groupSize=_495.pop().length;
if(_495.length>1){
_492.groupSize2=_495.pop().length;
}
}
return "("+dojo.number._realNumberRegexp(_492)+")";
});
},true);
if(_48e){
re=re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g,function(_496,_497,_498,_499){
var prop=["symbol","currency","displayName"][_498.length-1],_49a=dojo.regexp.escapeString(_487[prop]||_487.currency||"");
_497=_497?"[\\s\\xa0]":"";
_499=_499?"[\\s\\xa0]":"";
if(!_487.strict){
if(_497){
_497+="*";
}
if(_499){
_499+="*";
}
return "(?:"+_497+_49a+_499+")?";
}
return _497+_49a+_499;
});
}
return {regexp:re.replace(/[\xa0 ]/g,"[\\s\\xa0]"),group:_48b,decimal:_48c,factor:_48d};
};
dojo.number.parse=function(_49b,_49c){
var info=dojo.number._parseInfo(_49c),_49d=(new RegExp("^"+info.regexp+"$")).exec(_49b);
if(!_49d){
return NaN;
}
var _49e=_49d[1];
if(!_49d[1]){
if(!_49d[2]){
return NaN;
}
_49e=_49d[2];
info.factor*=-1;
}
_49e=_49e.replace(new RegExp("["+info.group+"\\s\\xa0"+"]","g"),"").replace(info.decimal,".");
return _49e*info.factor;
};
dojo.number._realNumberRegexp=function(_49f){
_49f=_49f||{};
if(!("places" in _49f)){
_49f.places=Infinity;
}
if(typeof _49f.decimal!="string"){
_49f.decimal=".";
}
if(!("fractional" in _49f)||/^0/.test(_49f.places)){
_49f.fractional=[true,false];
}
if(!("exponent" in _49f)){
_49f.exponent=[true,false];
}
if(!("eSigned" in _49f)){
_49f.eSigned=[true,false];
}
var _4a0=dojo.number._integerRegexp(_49f),_4a1=dojo.regexp.buildGroupRE(_49f.fractional,function(q){
var re="";
if(q&&(_49f.places!==0)){
re="\\"+_49f.decimal;
if(_49f.places==Infinity){
re="(?:"+re+"\\d+)?";
}else{
re+="\\d{"+_49f.places+"}";
}
}
return re;
},true);
var _4a2=dojo.regexp.buildGroupRE(_49f.exponent,function(q){
if(q){
return "([eE]"+dojo.number._integerRegexp({signed:_49f.eSigned})+")";
}
return "";
});
var _4a3=_4a0+_4a1;
if(_4a1){
_4a3="(?:(?:"+_4a3+")|(?:"+_4a1+"))";
}
return _4a3+_4a2;
};
dojo.number._integerRegexp=function(_4a4){
_4a4=_4a4||{};
if(!("signed" in _4a4)){
_4a4.signed=[true,false];
}
if(!("separator" in _4a4)){
_4a4.separator="";
}else{
if(!("groupSize" in _4a4)){
_4a4.groupSize=3;
}
}
var _4a5=dojo.regexp.buildGroupRE(_4a4.signed,function(q){
return q?"[-+]":"";
},true);
var _4a6=dojo.regexp.buildGroupRE(_4a4.separator,function(sep){
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
var grp=_4a4.groupSize,grp2=_4a4.groupSize2;
if(grp2){
var _4a7="(?:0|[1-9]\\d{0,"+(grp2-1)+"}(?:["+sep+"]\\d{"+grp2+"})*["+sep+"]\\d{"+grp+"})";
return ((grp-grp2)>0)?"(?:"+_4a7+"|(?:0|[1-9]\\d{0,"+(grp-1)+"}))":_4a7;
}
return "(?:0|[1-9]\\d{0,"+(grp-1)+"}(?:["+sep+"]\\d{"+grp+"})*)";
},true);
return _4a5+_4a6;
};
}
if(!dojo._hasResource["dijit.form.NumberTextBox"]){
dojo._hasResource["dijit.form.NumberTextBox"]=true;
dojo.provide("dijit.form.NumberTextBox");
dojo.declare("dijit.form.NumberTextBoxMixin",null,{regExpGen:dojo.number.regexp,value:NaN,editOptions:{pattern:"#.######"},_formatter:dojo.number.format,_setConstraintsAttr:function(_4a8){
var _4a9=typeof _4a8.places=="number"?_4a8.places:0;
if(_4a9){
_4a9++;
}
if(typeof _4a8.max!="number"){
_4a8.max=9*Math.pow(10,15-_4a9);
}
if(typeof _4a8.min!="number"){
_4a8.min=-9*Math.pow(10,15-_4a9);
}
this.inherited(arguments,[_4a8]);
if(this.focusNode&&this.focusNode.value&&!isNaN(this.value)){
this.set("value",this.value);
}
},_onFocus:function(){
if(this.disabled){
return;
}
var val=this.get("value");
if(typeof val=="number"&&!isNaN(val)){
var _4aa=this.format(val,this.constraints);
if(_4aa!==undefined){
this.textbox.value=_4aa;
}
}
this.inherited(arguments);
},format:function(_4ab,_4ac){
var _4ad=String(_4ab);
if(typeof _4ab!="number"){
return _4ad;
}
if(isNaN(_4ab)){
return "";
}
if(!("rangeCheck" in this&&this.rangeCheck(_4ab,_4ac))&&_4ac.exponent!==false&&/\de[-+]?\d/i.test(_4ad)){
return _4ad;
}
if(this.editOptions&&this._focused){
_4ac=dojo.mixin({},_4ac,this.editOptions);
}
return this._formatter(_4ab,_4ac);
},_parser:dojo.number.parse,parse:function(_4ae,_4af){
var v=this._parser(_4ae,dojo.mixin({},_4af,(this.editOptions&&this._focused)?this.editOptions:{}));
if(this.editOptions&&this._focused&&isNaN(v)){
v=this._parser(_4ae,_4af);
}
return v;
},_getDisplayedValueAttr:function(){
var v=this.inherited(arguments);
return isNaN(v)?this.textbox.value:v;
},filter:function(_4b0){
return (_4b0===null||_4b0===""||_4b0===undefined)?NaN:this.inherited(arguments);
},serialize:function(_4b1,_4b2){
return (typeof _4b1!="number"||isNaN(_4b1))?"":this.inherited(arguments);
},_setBlurValue:function(){
var val=dojo.hitch(dojo.mixin({},this,{_focused:true}),"get")("value");
this._setValueAttr(val,true);
},_setValueAttr:function(_4b3,_4b4,_4b5){
if(_4b3!==undefined&&_4b5===undefined){
_4b5=String(_4b3);
if(typeof _4b3=="number"){
if(isNaN(_4b3)){
_4b5="";
}else{
if(("rangeCheck" in this&&this.rangeCheck(_4b3,this.constraints))||this.constraints.exponent===false||!/\de[-+]?\d/i.test(_4b5)){
_4b5=undefined;
}
}
}else{
if(!_4b3){
_4b5="";
_4b3=NaN;
}else{
_4b3=undefined;
}
}
}
this.inherited(arguments,[_4b3,_4b4,_4b5]);
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
},isValid:function(_4b6){
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
dojo.declare("dijit.form.NumberSpinner",[dijit.form._Spinner,dijit.form.NumberTextBoxMixin],{adjust:function(val,_4b7){
var tc=this.constraints,v=isNaN(val),_4b8=!isNaN(tc.max),_4b9=!isNaN(tc.min);
if(v&&_4b7!=0){
val=(_4b7>0)?_4b9?tc.min:_4b8?tc.max:0:_4b8?this.constraints.max:_4b9?tc.min:0;
}
var _4ba=val+_4b7;
if(v||isNaN(_4ba)){
return val;
}
if(_4b8&&(_4ba>tc.max)){
_4ba=tc.max;
}
if(_4b9&&(_4ba<tc.min)){
_4ba=tc.min;
}
return _4ba;
},_onKeyPress:function(e){
if((e.charOrCode==dojo.keys.HOME||e.charOrCode==dojo.keys.END)&&!(e.ctrlKey||e.altKey||e.metaKey)&&typeof this.get("value")!="undefined"){
var _4bb=this.constraints[(e.charOrCode==dojo.keys.HOME?"min":"max")];
if(typeof _4bb=="number"){
this._setValueAttr(_4bb,false);
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
var _4bc={ADP:0,AFN:0,ALL:0,AMD:0,BHD:3,BIF:0,BYR:0,CLF:0,CLP:0,COP:0,CRC:0,DJF:0,ESP:0,GNF:0,GYD:0,HUF:0,IDR:0,IQD:0,IRR:3,ISK:0,ITL:0,JOD:3,JPY:0,KMF:0,KPW:0,KRW:0,KWD:3,LAK:0,LBP:0,LUF:0,LYD:3,MGA:0,MGF:0,MMK:0,MNT:0,MRO:0,MUR:0,OMR:3,PKR:0,PYG:0,RSD:0,RWF:0,SLL:0,SOS:0,STD:0,SYP:0,TMM:0,TND:3,TRL:0,TZS:0,UGX:0,UZS:0,VND:0,VUV:0,XAF:0,XOF:0,XPF:0,YER:0,ZMK:0,ZWD:0};
var _4bd={CHF:5};
var _4be=_4bc[code],_4bf=_4bd[code];
if(typeof _4be=="undefined"){
_4be=2;
}
if(typeof _4bf=="undefined"){
_4bf=0;
}
return {places:_4be,round:_4bf};
};
}
if(!dojo._hasResource["dojo.currency"]){
dojo._hasResource["dojo.currency"]=true;
dojo.provide("dojo.currency");
dojo.getObject("currency",true,dojo);
dojo.currency._mixInDefaults=function(_4c0){
_4c0=_4c0||{};
_4c0.type="currency";
var _4c1=dojo.i18n.getLocalization("dojo.cldr","currency",_4c0.locale)||{};
var iso=_4c0.currency;
var data=dojo.cldr.monetary.getData(iso);
dojo.forEach(["displayName","symbol","group","decimal"],function(prop){
data[prop]=_4c1[iso+"_"+prop];
});
data.fractional=[true,false];
return dojo.mixin(data,_4c0);
};
dojo.currency.format=function(_4c2,_4c3){
return dojo.number.format(_4c2,dojo.currency._mixInDefaults(_4c3));
};
dojo.currency.regexp=function(_4c4){
return dojo.number.regexp(dojo.currency._mixInDefaults(_4c4));
};
dojo.currency.parse=function(_4c5,_4c6){
return dojo.number.parse(_4c5,dojo.currency._mixInDefaults(_4c6));
};
}
if(!dojo._hasResource["dijit.form.CurrencyTextBox"]){
dojo._hasResource["dijit.form.CurrencyTextBox"]=true;
dojo.provide("dijit.form.CurrencyTextBox");
dojo.declare("dijit.form.CurrencyTextBox",dijit.form.NumberTextBox,{currency:"",baseClass:"dijitTextBox dijitCurrencyTextBox",regExpGen:function(_4c7){
return "("+(this._focused?this.inherited(arguments,[dojo.mixin({},_4c7,this.editOptions)])+"|":"")+dojo.currency.regexp(_4c7)+")";
},_formatter:dojo.currency.format,_parser:dojo.currency.parse,parse:function(_4c8,_4c9){
var v=this.inherited(arguments);
if(isNaN(v)&&/\d+/.test(_4c8)){
v=dojo.hitch(dojo.mixin({},this,{_parser:dijit.form.NumberTextBox.prototype._parser}),"inherited")(arguments);
}
return v;
},_setConstraintsAttr:function(_4ca){
if(!_4ca.currency&&this.currency){
_4ca.currency=this.currency;
}
this.inherited(arguments,[dojo.currency._mixInDefaults(dojo.mixin(_4ca,{exponent:false}))]);
}});
}
if(!dojo._hasResource["dojo.dnd.move"]){
dojo._hasResource["dojo.dnd.move"]=true;
dojo.provide("dojo.dnd.move");
dojo.declare("dojo.dnd.move.constrainedMoveable",dojo.dnd.Moveable,{constraints:function(){
},within:false,markupFactory:function(_4cb,node){
return new dojo.dnd.move.constrainedMoveable(node,_4cb);
},constructor:function(node,_4cc){
if(!_4cc){
_4cc={};
}
this.constraints=_4cc.constraints;
this.within=_4cc.within;
},onFirstMove:function(_4cd){
var c=this.constraintBox=this.constraints.call(this,_4cd);
c.r=c.l+c.w;
c.b=c.t+c.h;
if(this.within){
var mb=dojo._getMarginSize(_4cd.node);
c.r-=mb.w;
c.b-=mb.h;
}
},onMove:function(_4ce,_4cf){
var c=this.constraintBox,s=_4ce.node.style;
this.onMoving(_4ce,_4cf);
_4cf.l=_4cf.l<c.l?c.l:c.r<_4cf.l?c.r:_4cf.l;
_4cf.t=_4cf.t<c.t?c.t:c.b<_4cf.t?c.b:_4cf.t;
s.left=_4cf.l+"px";
s.top=_4cf.t+"px";
this.onMoved(_4ce,_4cf);
}});
dojo.declare("dojo.dnd.move.boxConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{box:{},markupFactory:function(_4d0,node){
return new dojo.dnd.move.boxConstrainedMoveable(node,_4d0);
},constructor:function(node,_4d1){
var box=_4d1&&_4d1.box;
this.constraints=function(){
return box;
};
}});
dojo.declare("dojo.dnd.move.parentConstrainedMoveable",dojo.dnd.move.constrainedMoveable,{area:"content",markupFactory:function(_4d2,node){
return new dojo.dnd.move.parentConstrainedMoveable(node,_4d2);
},constructor:function(node,_4d3){
var area=_4d3&&_4d3.area;
this.constraints=function(){
var n=this.node.parentNode,s=dojo.getComputedStyle(n),mb=dojo._getMarginBox(n,s);
if(area=="margin"){
return mb;
}
var t=dojo._getMarginExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(area=="border"){
return mb;
}
t=dojo._getBorderExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(area=="padding"){
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
var _4d4=dojo.position(this.sliderBarContainer,true);
var _4d5=e[this._mousePixelCoord]-_4d4[this._startingPixelCoord];
this._setPixelValue(this._isReversed()?(_4d4[this._pixelCount]-_4d5):_4d5,_4d4[this._pixelCount],true);
this._movable.onMouseDown(e);
},_setPixelValue:function(_4d6,_4d7,_4d8){
if(this.disabled||this.readOnly){
return;
}
_4d6=_4d6<0?0:_4d7<_4d6?_4d7:_4d6;
var _4d9=this.discreteValues;
if(_4d9<=1||_4d9==Infinity){
_4d9=_4d7;
}
_4d9--;
var _4da=_4d7/_4d9;
var _4db=Math.round(_4d6/_4da);
this._setValueAttr((this.maximum-this.minimum)*_4db/_4d9+this.minimum,_4d8);
},_setValueAttr:function(_4dc,_4dd){
this._set("value",_4dc);
this.valueNode.value=_4dc;
dijit.setWaiState(this.focusNode,"valuenow",_4dc);
this.inherited(arguments);
var _4de=(_4dc-this.minimum)/(this.maximum-this.minimum);
var _4df=(this._descending===false)?this.remainingBar:this.progressBar;
var _4e0=(this._descending===false)?this.progressBar:this.remainingBar;
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
if(_4dd&&this.slideDuration>0&&_4df.style[this._progressPixelSize]){
var _4e1=this;
var _4e2={};
var _4e3=parseFloat(_4df.style[this._progressPixelSize]);
var _4e4=this.slideDuration*(_4de-_4e3/100);
if(_4e4==0){
return;
}
if(_4e4<0){
_4e4=0-_4e4;
}
_4e2[this._progressPixelSize]={start:_4e3,end:_4de*100,units:"%"};
this._inProgressAnim=dojo.animateProperty({node:_4df,duration:_4e4,onAnimate:function(v){
_4e0.style[_4e1._progressPixelSize]=(100-parseFloat(v[_4e1._progressPixelSize]))+"%";
},onEnd:function(){
delete _4e1._inProgressAnim;
},properties:_4e2});
this._inProgressAnim.play();
}else{
_4df.style[this._progressPixelSize]=(_4de*100)+"%";
_4e0.style[this._progressPixelSize]=((1-_4de)*100)+"%";
}
},_bumpValue:function(_4e5,_4e6){
if(this.disabled||this.readOnly){
return;
}
var s=dojo.getComputedStyle(this.sliderBarContainer);
var c=dojo._getContentBox(this.sliderBarContainer,s);
var _4e7=this.discreteValues;
if(_4e7<=1||_4e7==Infinity){
_4e7=c[this._pixelCount];
}
_4e7--;
var _4e8=(this.value-this.minimum)*_4e7/(this.maximum-this.minimum)+_4e5;
if(_4e8<0){
_4e8=0;
}
if(_4e8>_4e7){
_4e8=_4e7;
}
_4e8=_4e8*(this.maximum-this.minimum)/_4e7+this.minimum;
this._setValueAttr(_4e8,_4e6);
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
var _4e9=!dojo.isMozilla;
var _4ea=evt[(_4e9?"wheelDelta":"detail")]*(_4e9?1:-1);
this._bumpValue(_4ea<0?-1:1,true);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_4eb){
if(this[_4eb.container]!=this.containerNode){
this[_4eb.container].appendChild(_4eb.domNode);
}
},this);
this.inherited(arguments);
},_typematicCallback:function(_4ec,_4ed,e){
if(_4ec==-1){
this._setValueAttr(this.value,true);
}else{
this[(_4ed==(this._descending?this.incrementButton:this.decrementButton))?"decrement":"increment"](e);
}
},buildRendering:function(){
this.inherited(arguments);
if(this.showButtons){
this.incrementButton.style.display="";
this.decrementButton.style.display="";
}
var _4ee=dojo.query("label[for=\""+this.id+"\"]");
if(_4ee.length){
_4ee[0].id=(this.id+"_label");
dijit.setWaiState(this.focusNode,"labelledby",_4ee[0].id);
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
var _4ef=dojo.declare(dijit.form._SliderMover,{widget:this});
this._movable=new dojo.dnd.Moveable(this.sliderHandle,{mover:_4ef});
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
var _4f0=this.widget;
var _4f1=_4f0._abspos;
if(!_4f1){
_4f1=_4f0._abspos=dojo.position(_4f0.sliderBarContainer,true);
_4f0._setPixelValue_=dojo.hitch(_4f0,"_setPixelValue");
_4f0._isReversed_=_4f0._isReversed();
}
var _4f2=e.touches?e.touches[0]:e,_4f3=_4f2[_4f0._mousePixelCoord]-_4f1[_4f0._startingPixelCoord];
_4f0._setPixelValue_(_4f0._isReversed_?(_4f1[_4f0._pixelCount]-_4f3):_4f3,_4f1[_4f0._pixelCount],false);
},destroy:function(e){
dojo.dnd.Mover.prototype.destroy.apply(this,arguments);
var _4f4=this.widget;
_4f4._abspos=null;
_4f4._setValueAttr(_4f4.value,true);
}});
}
if(!dojo._hasResource["dijit._editor.selection"]){
dojo._hasResource["dijit._editor.selection"]=true;
dojo.provide("dijit._editor.selection");
dojo.getObject("_editor.selection",true,dijit);
dojo.mixin(dijit._editor.selection,{getType:function(){
if(dojo.isIE<9){
return dojo.doc.selection.type.toLowerCase();
}else{
var _4f5="text";
var oSel;
try{
oSel=dojo.global.getSelection();
}
catch(e){
}
if(oSel&&oSel.rangeCount==1){
var _4f6=oSel.getRangeAt(0);
if((_4f6.startContainer==_4f6.endContainer)&&((_4f6.endOffset-_4f6.startOffset)==1)&&(_4f6.startContainer.nodeType!=3)){
_4f5="control";
}
}
return _4f5;
}
},getSelectedText:function(){
if(dojo.isIE<9){
if(dijit._editor.selection.getType()=="control"){
return null;
}
return dojo.doc.selection.createRange().text;
}else{
var _4f7=dojo.global.getSelection();
if(_4f7){
return _4f7.toString();
}
}
return "";
},getSelectedHtml:function(){
if(dojo.isIE<9){
if(dijit._editor.selection.getType()=="control"){
return null;
}
return dojo.doc.selection.createRange().htmlText;
}else{
var _4f8=dojo.global.getSelection();
if(_4f8&&_4f8.rangeCount){
var i;
var html="";
for(i=0;i<_4f8.rangeCount;i++){
var frag=_4f8.getRangeAt(i).cloneContents();
var div=dojo.doc.createElement("div");
div.appendChild(frag);
html+=div.innerHTML;
}
return html;
}
return null;
}
},getSelectedElement:function(){
if(dijit._editor.selection.getType()=="control"){
if(dojo.isIE<9){
var _4f9=dojo.doc.selection.createRange();
if(_4f9&&_4f9.item){
return dojo.doc.selection.createRange().item(0);
}
}else{
var _4fa=dojo.global.getSelection();
return _4fa.anchorNode.childNodes[_4fa.anchorOffset];
}
}
return null;
},getParentElement:function(){
if(dijit._editor.selection.getType()=="control"){
var p=this.getSelectedElement();
if(p){
return p.parentNode;
}
}else{
if(dojo.isIE<9){
var r=dojo.doc.selection.createRange();
r.collapse(true);
return r.parentElement();
}else{
var _4fb=dojo.global.getSelection();
if(_4fb){
var node=_4fb.anchorNode;
while(node&&(node.nodeType!=1)){
node=node.parentNode;
}
return node;
}
}
}
return null;
},hasAncestorElement:function(_4fc){
return this.getAncestorElement.apply(this,arguments)!=null;
},getAncestorElement:function(_4fd){
var node=this.getSelectedElement()||this.getParentElement();
return this.getParentOfType(node,arguments);
},isTag:function(node,tags){
if(node&&node.tagName){
var _4fe=node.tagName.toLowerCase();
for(var i=0;i<tags.length;i++){
var _4ff=String(tags[i]).toLowerCase();
if(_4fe==_4ff){
return _4ff;
}
}
}
return "";
},getParentOfType:function(node,tags){
while(node){
if(this.isTag(node,tags).length){
return node;
}
node=node.parentNode;
}
return null;
},collapse:function(_500){
if(window.getSelection){
var _501=dojo.global.getSelection();
if(_501.removeAllRanges){
if(_500){
_501.collapseToStart();
}else{
_501.collapseToEnd();
}
}else{
_501.collapse(_500);
}
}else{
if(dojo.isIE){
var _502=dojo.doc.selection.createRange();
_502.collapse(_500);
_502.select();
}
}
},remove:function(){
var sel=dojo.doc.selection;
if(dojo.isIE<9){
if(sel.type.toLowerCase()!="none"){
sel.clear();
}
return sel;
}else{
sel=dojo.global.getSelection();
sel.deleteFromDocument();
return sel;
}
},selectElementChildren:function(_503,_504){
var win=dojo.global;
var doc=dojo.doc;
var _505;
_503=dojo.byId(_503);
if(doc.selection&&dojo.isIE<9&&dojo.body().createTextRange){
_505=_503.ownerDocument.body.createTextRange();
_505.moveToElementText(_503);
if(!_504){
try{
_505.select();
}
catch(e){
}
}
}else{
if(win.getSelection){
var _506=dojo.global.getSelection();
if(dojo.isOpera){
if(_506.rangeCount){
_505=_506.getRangeAt(0);
}else{
_505=doc.createRange();
}
_505.setStart(_503,0);
_505.setEnd(_503,(_503.nodeType==3)?_503.length:_503.childNodes.length);
_506.addRange(_505);
}else{
_506.selectAllChildren(_503);
}
}
}
},selectElement:function(_507,_508){
var _509;
var doc=dojo.doc;
var win=dojo.global;
_507=dojo.byId(_507);
if(dojo.isIE<9&&dojo.body().createTextRange){
try{
var tg=_507.tagName?_507.tagName.toLowerCase():"";
if(tg==="img"||tg==="table"){
_509=dojo.body().createControlRange();
}else{
_509=dojo.body().createRange();
}
_509.addElement(_507);
if(!_508){
_509.select();
}
}
catch(e){
this.selectElementChildren(_507,_508);
}
}else{
if(dojo.global.getSelection){
var _50a=win.getSelection();
_509=doc.createRange();
if(_50a.removeAllRanges){
if(dojo.isOpera){
if(_50a.getRangeAt(0)){
_509=_50a.getRangeAt(0);
}
}
_509.selectNode(_507);
_50a.removeAllRanges();
_50a.addRange(_509);
}
}
}
},inSelection:function(node){
if(node){
var _50b;
var doc=dojo.doc;
var _50c;
if(dojo.global.getSelection){
var sel=dojo.global.getSelection();
if(sel&&sel.rangeCount>0){
_50c=sel.getRangeAt(0);
}
if(_50c&&_50c.compareBoundaryPoints&&doc.createRange){
try{
_50b=doc.createRange();
_50b.setStart(node,0);
if(_50c.compareBoundaryPoints(_50c.START_TO_END,_50b)===1){
return true;
}
}
catch(e){
}
}
}else{
if(doc.selection){
_50c=doc.selection.createRange();
try{
_50b=node.ownerDocument.body.createControlRange();
if(_50b){
_50b.addElement(node);
}
}
catch(e1){
try{
_50b=node.ownerDocument.body.createTextRange();
_50b.moveToElementText(node);
}
catch(e2){
}
}
if(_50c&&_50b){
if(_50c.compareEndPoints("EndToStart",_50b)===1){
return true;
}
}
}
}
}
return false;
}});
}
if(!dojo._hasResource["dijit._editor.range"]){
dojo._hasResource["dijit._editor.range"]=true;
dojo.provide("dijit._editor.range");
dijit.range={};
dijit.range.getIndex=function(node,_50d){
var ret=[],retR=[];
var stop=_50d;
var _50e=node;
var _50f,n;
while(node!=stop){
var i=0;
_50f=node.parentNode;
while((n=_50f.childNodes[i++])){
if(n===node){
--i;
break;
}
}
ret.unshift(i);
retR.unshift(i-_50f.childNodes.length);
node=_50f;
}
if(ret.length>0&&_50e.nodeType==3){
n=_50e.previousSibling;
while(n&&n.nodeType==3){
ret[ret.length-1]--;
n=n.previousSibling;
}
n=_50e.nextSibling;
while(n&&n.nodeType==3){
retR[retR.length-1]++;
n=n.nextSibling;
}
}
return {o:ret,r:retR};
};
dijit.range.getNode=function(_510,_511){
if(!dojo.isArray(_510)||_510.length==0){
return _511;
}
var node=_511;
dojo.every(_510,function(i){
if(i>=0&&i<node.childNodes.length){
node=node.childNodes[i];
}else{
node=null;
return false;
}
return true;
});
return node;
};
dijit.range.getCommonAncestor=function(n1,n2,root){
root=root||n1.ownerDocument.body;
var _512=function(n){
var as=[];
while(n){
as.unshift(n);
if(n!==root){
n=n.parentNode;
}else{
break;
}
}
return as;
};
var n1as=_512(n1);
var n2as=_512(n2);
var m=Math.min(n1as.length,n2as.length);
var com=n1as[0];
for(var i=1;i<m;i++){
if(n1as[i]===n2as[i]){
com=n1as[i];
}else{
break;
}
}
return com;
};
dijit.range.getAncestor=function(node,_513,root){
root=root||node.ownerDocument.body;
while(node&&node!==root){
var name=node.nodeName.toUpperCase();
if(_513.test(name)){
return node;
}
node=node.parentNode;
}
return null;
};
dijit.range.BlockTagNames=/^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/;
dijit.range.getBlockAncestor=function(node,_514,root){
root=root||node.ownerDocument.body;
_514=_514||dijit.range.BlockTagNames;
var _515=null,_516;
while(node&&node!==root){
var name=node.nodeName.toUpperCase();
if(!_515&&_514.test(name)){
_515=node;
}
if(!_516&&(/^(?:BODY|TD|TH|CAPTION)$/).test(name)){
_516=node;
}
node=node.parentNode;
}
return {blockNode:_515,blockContainer:_516||node.ownerDocument.body};
};
dijit.range.atBeginningOfContainer=function(_517,node,_518){
var _519=false;
var _51a=(_518==0);
if(!_51a&&node.nodeType==3){
if(/^[\s\xA0]+$/.test(node.nodeValue.substr(0,_518))){
_51a=true;
}
}
if(_51a){
var _51b=node;
_519=true;
while(_51b&&_51b!==_517){
if(_51b.previousSibling){
_519=false;
break;
}
_51b=_51b.parentNode;
}
}
return _519;
};
dijit.range.atEndOfContainer=function(_51c,node,_51d){
var _51e=false;
var _51f=(_51d==(node.length||node.childNodes.length));
if(!_51f&&node.nodeType==3){
if(/^[\s\xA0]+$/.test(node.nodeValue.substr(_51d))){
_51f=true;
}
}
if(_51f){
var _520=node;
_51e=true;
while(_520&&_520!==_51c){
if(_520.nextSibling){
_51e=false;
break;
}
_520=_520.parentNode;
}
}
return _51e;
};
dijit.range.adjacentNoneTextNode=function(_521,next){
var node=_521;
var len=(0-_521.length)||0;
var prop=next?"nextSibling":"previousSibling";
while(node){
if(node.nodeType!=3){
break;
}
len+=node.length;
node=node[prop];
}
return [node,len];
};
dijit.range._w3c=Boolean(window["getSelection"]);
dijit.range.create=function(win){
if(dijit.range._w3c){
return (win||dojo.global).document.createRange();
}else{
return new dijit.range.W3CRange;
}
};
dijit.range.getSelection=function(win,_522){
if(dijit.range._w3c){
return win.getSelection();
}else{
var s=new dijit.range.ie.selection(win);
if(!_522){
s._getCurrentSelection();
}
return s;
}
};
if(!dijit.range._w3c){
dijit.range.ie={cachedSelection:{},selection:function(win){
this._ranges=[];
this.addRange=function(r,_523){
this._ranges.push(r);
if(!_523){
r._select();
}
this.rangeCount=this._ranges.length;
};
this.removeAllRanges=function(){
this._ranges=[];
this.rangeCount=0;
};
var _524=function(){
var r=win.document.selection.createRange();
var type=win.document.selection.type.toUpperCase();
if(type=="CONTROL"){
return new dijit.range.W3CRange(dijit.range.ie.decomposeControlRange(r));
}else{
return new dijit.range.W3CRange(dijit.range.ie.decomposeTextRange(r));
}
};
this.getRangeAt=function(i){
return this._ranges[i];
};
this._getCurrentSelection=function(){
this.removeAllRanges();
var r=_524();
if(r){
this.addRange(r,true);
}
};
},decomposeControlRange:function(_525){
var _526=_525.item(0),_527=_525.item(_525.length-1);
var _528=_526.parentNode,_529=_527.parentNode;
var _52a=dijit.range.getIndex(_526,_528).o;
var _52b=dijit.range.getIndex(_527,_529).o+1;
return [_528,_52a,_529,_52b];
},getEndPoint:function(_52c,end){
var _52d=_52c.duplicate();
_52d.collapse(!end);
var _52e="EndTo"+(end?"End":"Start");
var _52f=_52d.parentElement();
var _530,_531,_532;
if(_52f.childNodes.length>0){
dojo.every(_52f.childNodes,function(node,i){
var _533;
if(node.nodeType!=3){
_52d.moveToElementText(node);
if(_52d.compareEndPoints(_52e,_52c)>0){
if(_532&&_532.nodeType==3){
_530=_532;
_533=true;
}else{
_530=_52f;
_531=i;
return false;
}
}else{
if(i==_52f.childNodes.length-1){
_530=_52f;
_531=_52f.childNodes.length;
return false;
}
}
}else{
if(i==_52f.childNodes.length-1){
_530=node;
_533=true;
}
}
if(_533&&_530){
var _534=dijit.range.adjacentNoneTextNode(_530)[0];
if(_534){
_530=_534.nextSibling;
}else{
_530=_52f.firstChild;
}
var _535=dijit.range.adjacentNoneTextNode(_530);
_534=_535[0];
var _536=_535[1];
if(_534){
_52d.moveToElementText(_534);
_52d.collapse(false);
}else{
_52d.moveToElementText(_52f);
}
_52d.setEndPoint(_52e,_52c);
_531=_52d.text.length-_536;
return false;
}
_532=node;
return true;
});
}else{
_530=_52f;
_531=0;
}
if(!end&&_530.nodeType==1&&_531==_530.childNodes.length){
var _537=_530.nextSibling;
if(_537&&_537.nodeType==3){
_530=_537;
_531=0;
}
}
return [_530,_531];
},setEndPoint:function(_538,_539,_53a){
var _53b=_538.duplicate(),node,len;
if(_539.nodeType!=3){
if(_53a>0){
node=_539.childNodes[_53a-1];
if(node){
if(node.nodeType==3){
_539=node;
_53a=node.length;
}else{
if(node.nextSibling&&node.nextSibling.nodeType==3){
_539=node.nextSibling;
_53a=0;
}else{
_53b.moveToElementText(node.nextSibling?node:_539);
var _53c=node.parentNode;
var _53d=_53c.insertBefore(node.ownerDocument.createTextNode(" "),node.nextSibling);
_53b.collapse(false);
_53c.removeChild(_53d);
}
}
}
}else{
_53b.moveToElementText(_539);
_53b.collapse(true);
}
}
if(_539.nodeType==3){
var _53e=dijit.range.adjacentNoneTextNode(_539);
var _53f=_53e[0];
len=_53e[1];
if(_53f){
_53b.moveToElementText(_53f);
_53b.collapse(false);
if(_53f.contentEditable!="inherit"){
len++;
}
}else{
_53b.moveToElementText(_539.parentNode);
_53b.collapse(true);
}
_53a+=len;
if(_53a>0){
if(_53b.move("character",_53a)!=_53a){
console.error("Error when moving!");
}
}
}
return _53b;
},decomposeTextRange:function(_540){
var _541=dijit.range.ie.getEndPoint(_540);
var _542=_541[0],_543=_541[1];
var _544=_541[0],_545=_541[1];
if(_540.htmlText.length){
if(_540.htmlText==_540.text){
_545=_543+_540.text.length;
}else{
_541=dijit.range.ie.getEndPoint(_540,true);
_544=_541[0],_545=_541[1];
}
}
return [_542,_543,_544,_545];
},setRange:function(_546,_547,_548,_549,_54a,_54b){
var _54c=dijit.range.ie.setEndPoint(_546,_547,_548);
_546.setEndPoint("StartToStart",_54c);
if(!_54b){
var end=dijit.range.ie.setEndPoint(_546,_549,_54a);
}
_546.setEndPoint("EndToEnd",end||_54c);
return _546;
}};
dojo.declare("dijit.range.W3CRange",null,{constructor:function(){
if(arguments.length>0){
this.setStart(arguments[0][0],arguments[0][1]);
this.setEnd(arguments[0][2],arguments[0][3]);
}else{
this.commonAncestorContainer=null;
this.startContainer=null;
this.startOffset=0;
this.endContainer=null;
this.endOffset=0;
this.collapsed=true;
}
},_updateInternal:function(){
if(this.startContainer!==this.endContainer){
this.commonAncestorContainer=dijit.range.getCommonAncestor(this.startContainer,this.endContainer);
}else{
this.commonAncestorContainer=this.startContainer;
}
this.collapsed=(this.startContainer===this.endContainer)&&(this.startOffset==this.endOffset);
},setStart:function(node,_54d){
_54d=parseInt(_54d);
if(this.startContainer===node&&this.startOffset==_54d){
return;
}
delete this._cachedBookmark;
this.startContainer=node;
this.startOffset=_54d;
if(!this.endContainer){
this.setEnd(node,_54d);
}else{
this._updateInternal();
}
},setEnd:function(node,_54e){
_54e=parseInt(_54e);
if(this.endContainer===node&&this.endOffset==_54e){
return;
}
delete this._cachedBookmark;
this.endContainer=node;
this.endOffset=_54e;
if(!this.startContainer){
this.setStart(node,_54e);
}else{
this._updateInternal();
}
},setStartAfter:function(node,_54f){
this._setPoint("setStart",node,_54f,1);
},setStartBefore:function(node,_550){
this._setPoint("setStart",node,_550,0);
},setEndAfter:function(node,_551){
this._setPoint("setEnd",node,_551,1);
},setEndBefore:function(node,_552){
this._setPoint("setEnd",node,_552,0);
},_setPoint:function(what,node,_553,ext){
var _554=dijit.range.getIndex(node,node.parentNode).o;
this[what](node.parentNode,_554.pop()+ext);
},_getIERange:function(){
var r=(this._body||this.endContainer.ownerDocument.body).createTextRange();
dijit.range.ie.setRange(r,this.startContainer,this.startOffset,this.endContainer,this.endOffset,this.collapsed);
return r;
},getBookmark:function(body){
this._getIERange();
return this._cachedBookmark;
},_select:function(){
var r=this._getIERange();
r.select();
},deleteContents:function(){
var r=this._getIERange();
r.pasteHTML("");
this.endContainer=this.startContainer;
this.endOffset=this.startOffset;
this.collapsed=true;
},cloneRange:function(){
var r=new dijit.range.W3CRange([this.startContainer,this.startOffset,this.endContainer,this.endOffset]);
r._body=this._body;
return r;
},detach:function(){
this._body=null;
this.commonAncestorContainer=null;
this.startContainer=null;
this.startOffset=0;
this.endContainer=null;
this.endOffset=0;
this.collapsed=true;
}});
}
}
if(!dojo._hasResource["dijit._editor.html"]){
dojo._hasResource["dijit._editor.html"]=true;
dojo.provide("dijit._editor.html");
dojo.getObject("_editor",true,dijit);
dijit._editor.escapeXml=function(str,_555){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_555){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dijit._editor.getNodeHtml=function(node){
var _556;
switch(node.nodeType){
case 1:
var _557=node.nodeName.toLowerCase();
if(!_557||_557.charAt(0)=="/"){
return "";
}
_556="<"+_557;
var _558=[];
var attr;
if(dojo.isIE&&node.outerHTML){
var s=node.outerHTML;
s=s.substr(0,s.indexOf(">")).replace(/(['"])[^"']*\1/g,"");
var reg=/(\b\w+)\s?=/g;
var m,key;
while((m=reg.exec(s))){
key=m[1];
if(key.substr(0,3)!="_dj"){
if(key=="src"||key=="href"){
if(node.getAttribute("_djrealurl")){
_558.push([key,node.getAttribute("_djrealurl")]);
continue;
}
}
var val,_559;
switch(key){
case "style":
val=node.style.cssText.toLowerCase();
break;
case "class":
val=node.className;
break;
case "width":
if(_557==="img"){
_559=/width=(\S+)/i.exec(s);
if(_559){
val=_559[1];
}
break;
}
case "height":
if(_557==="img"){
_559=/height=(\S+)/i.exec(s);
if(_559){
val=_559[1];
}
break;
}
default:
val=node.getAttribute(key);
}
if(val!=null){
_558.push([key,val.toString()]);
}
}
}
}else{
var i=0;
while((attr=node.attributes[i++])){
var n=attr.name;
if(n.substr(0,3)!="_dj"){
var v=attr.value;
if(n=="src"||n=="href"){
if(node.getAttribute("_djrealurl")){
v=node.getAttribute("_djrealurl");
}
}
_558.push([n,v]);
}
}
}
_558.sort(function(a,b){
return a[0]<b[0]?-1:(a[0]==b[0]?0:1);
});
var j=0;
while((attr=_558[j++])){
_556+=" "+attr[0]+"=\""+(dojo.isString(attr[1])?dijit._editor.escapeXml(attr[1],true):attr[1])+"\"";
}
if(_557==="script"){
_556+=">"+node.innerHTML+"</"+_557+">";
}else{
if(node.childNodes.length){
_556+=">"+dijit._editor.getChildrenHtml(node)+"</"+_557+">";
}else{
switch(_557){
case "br":
case "hr":
case "img":
case "input":
case "base":
case "meta":
case "area":
case "basefont":
_556+=" />";
break;
default:
_556+="></"+_557+">";
}
}
}
break;
case 4:
case 3:
_556=dijit._editor.escapeXml(node.nodeValue,true);
break;
case 8:
_556="<!--"+dijit._editor.escapeXml(node.nodeValue,true)+"-->";
break;
default:
_556="<!-- Element not recognized - Type: "+node.nodeType+" Name: "+node.nodeName+"-->";
}
return _556;
};
dijit._editor.getChildrenHtml=function(dom){
var out="";
if(!dom){
return out;
}
var _55a=dom["childNodes"]||dom;
var _55b=!dojo.isIE||_55a!==dom;
var node,i=0;
while((node=_55a[i++])){
if(!_55b||node.parentNode==dom){
out+=dijit._editor.getNodeHtml(node);
}
}
return out;
};
}
if(!dojo._hasResource["dijit._editor.RichText"]){
dojo._hasResource["dijit._editor.RichText"]=true;
dojo.provide("dijit._editor.RichText");
if(!dojo.config["useXDomain"]||dojo.config["allowXdRichTextSave"]){
if(dojo._postLoad){
(function(){
var _55c=dojo.doc.createElement("textarea");
_55c.id=dijit._scopeName+"._editor.RichText.value";
dojo.style(_55c,{display:"none",position:"absolute",top:"-100px",height:"3px",width:"3px"});
dojo.body().appendChild(_55c);
})();
}else{
try{
dojo.doc.write("<textarea id=\""+dijit._scopeName+"._editor.RichText.value\" "+"style=\"display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;\"></textarea>");
}
catch(e){
}
}
}
dojo.declare("dijit._editor.RichText",[dijit._Widget,dijit._CssStateMixin],{constructor:function(_55d){
this.contentPreFilters=[];
this.contentPostFilters=[];
this.contentDomPreFilters=[];
this.contentDomPostFilters=[];
this.editingAreaStyleSheets=[];
this.events=[].concat(this.events);
this._keyHandlers={};
if(_55d&&dojo.isString(_55d.value)){
this.value=_55d.value;
}
this.onLoadDeferred=new dojo.Deferred();
},baseClass:"dijitEditor",inheritWidth:false,focusOnLoad:false,name:"",styleSheets:"",height:"300px",minHeight:"1em",isClosed:true,isLoaded:false,_SEPARATOR:"@@**%%__RICHTEXTBOUNDRY__%%**@@",_NAME_CONTENT_SEP:"@@**%%:%%**@@",onLoadDeferred:null,isTabIndent:false,disableSpellCheck:false,postCreate:function(){
if("textarea"==this.domNode.tagName.toLowerCase()){
console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
}
this.contentPreFilters=[dojo.hitch(this,"_preFixUrlAttributes")].concat(this.contentPreFilters);
if(dojo.isMoz){
this.contentPreFilters=[this._normalizeFontStyle].concat(this.contentPreFilters);
this.contentPostFilters=[this._removeMozBogus].concat(this.contentPostFilters);
}
if(dojo.isWebKit){
this.contentPreFilters=[this._removeWebkitBogus].concat(this.contentPreFilters);
this.contentPostFilters=[this._removeWebkitBogus].concat(this.contentPostFilters);
}
if(dojo.isIE){
this.contentPostFilters=[this._normalizeFontStyle].concat(this.contentPostFilters);
}
this.inherited(arguments);
dojo.publish(dijit._scopeName+"._editor.RichText::init",[this]);
this.open();
this.setupDefaultShortcuts();
},setupDefaultShortcuts:function(){
var exec=dojo.hitch(this,function(cmd,arg){
return function(){
return !this.execCommand(cmd,arg);
};
});
var _55e={b:exec("bold"),i:exec("italic"),u:exec("underline"),a:exec("selectall"),s:function(){
this.save(true);
},m:function(){
this.isTabIndent=!this.isTabIndent;
},"1":exec("formatblock","h1"),"2":exec("formatblock","h2"),"3":exec("formatblock","h3"),"4":exec("formatblock","h4"),"\\":exec("insertunorderedlist")};
if(!dojo.isIE){
_55e.Z=exec("redo");
}
for(var key in _55e){
this.addKeyHandler(key,true,false,_55e[key]);
}
},events:["onKeyPress","onKeyDown","onKeyUp"],captureEvents:[],_editorCommandsLocalized:false,_localizeEditorCommands:function(){
if(dijit._editor._editorCommandsLocalized){
this._local2NativeFormatNames=dijit._editor._local2NativeFormatNames;
this._native2LocalFormatNames=dijit._editor._native2LocalFormatNames;
return;
}
dijit._editor._editorCommandsLocalized=true;
dijit._editor._local2NativeFormatNames={};
dijit._editor._native2LocalFormatNames={};
this._local2NativeFormatNames=dijit._editor._local2NativeFormatNames;
this._native2LocalFormatNames=dijit._editor._native2LocalFormatNames;
var _55f=["div","p","pre","h1","h2","h3","h4","h5","h6","ol","ul","address"];
var _560="",_561,i=0;
while((_561=_55f[i++])){
if(_561.charAt(1)!=="l"){
_560+="<"+_561+"><span>content</span></"+_561+"><br/>";
}else{
_560+="<"+_561+"><li>content</li></"+_561+"><br/>";
}
}
var _562={position:"absolute",top:"0px",zIndex:10,opacity:0.01};
var div=dojo.create("div",{style:_562,innerHTML:_560});
dojo.body().appendChild(div);
var _563=dojo.hitch(this,function(){
var node=div.firstChild;
while(node){
try{
dijit._editor.selection.selectElement(node.firstChild);
var _564=node.tagName.toLowerCase();
this._local2NativeFormatNames[_564]=document.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_564]]=_564;
node=node.nextSibling.nextSibling;
}
catch(e){
}
}
div.parentNode.removeChild(div);
div.innerHTML="";
});
setTimeout(_563,0);
},open:function(_565){
if(!this.onLoadDeferred||this.onLoadDeferred.fired>=0){
this.onLoadDeferred=new dojo.Deferred();
}
if(!this.isClosed){
this.close();
}
dojo.publish(dijit._scopeName+"._editor.RichText::open",[this]);
if(arguments.length==1&&_565.nodeName){
this.domNode=_565;
}
var dn=this.domNode;
var html;
if(dojo.isString(this.value)){
html=this.value;
delete this.value;
dn.innerHTML="";
}else{
if(dn.nodeName&&dn.nodeName.toLowerCase()=="textarea"){
var ta=(this.textarea=dn);
this.name=ta.name;
html=ta.value;
dn=this.domNode=dojo.doc.createElement("div");
dn.setAttribute("widgetId",this.id);
ta.removeAttribute("widgetId");
dn.cssText=ta.cssText;
dn.className+=" "+ta.className;
dojo.place(dn,ta,"before");
var _566=dojo.hitch(this,function(){
dojo.style(ta,{display:"block",position:"absolute",top:"-1000px"});
if(dojo.isIE){
var s=ta.style;
this.__overflow=s.overflow;
s.overflow="hidden";
}
});
if(dojo.isIE){
setTimeout(_566,10);
}else{
_566();
}
if(ta.form){
var _567=ta.value;
this.reset=function(){
var _568=this.getValue();
if(_568!=_567){
this.replaceValue(_567);
}
};
dojo.connect(ta.form,"onsubmit",this,function(){
dojo.attr(ta,"disabled",this.disabled);
ta.value=this.getValue();
});
}
}else{
html=dijit._editor.getChildrenHtml(dn);
dn.innerHTML="";
}
}
var _569=dojo.contentBox(dn);
this._oldHeight=_569.h;
this._oldWidth=_569.w;
this.value=html;
if(dn.nodeName&&dn.nodeName=="LI"){
dn.innerHTML=" <br>";
}
this.header=dn.ownerDocument.createElement("div");
dn.appendChild(this.header);
this.editingArea=dn.ownerDocument.createElement("div");
dn.appendChild(this.editingArea);
this.footer=dn.ownerDocument.createElement("div");
dn.appendChild(this.footer);
if(!this.name){
this.name=this.id+"_AUTOGEN";
}
if(this.name!==""&&(!dojo.config["useXDomain"]||dojo.config["allowXdRichTextSave"])){
var _56a=dojo.byId(dijit._scopeName+"._editor.RichText.value");
if(_56a&&_56a.value!==""){
var _56b=_56a.value.split(this._SEPARATOR),i=0,dat;
while((dat=_56b[i++])){
var data=dat.split(this._NAME_CONTENT_SEP);
if(data[0]==this.name){
html=data[1];
_56b=_56b.splice(i,1);
_56a.value=_56b.join(this._SEPARATOR);
break;
}
}
}
if(!dijit._editor._globalSaveHandler){
dijit._editor._globalSaveHandler={};
dojo.addOnUnload(function(){
var id;
for(id in dijit._editor._globalSaveHandler){
var f=dijit._editor._globalSaveHandler[id];
if(dojo.isFunction(f)){
f();
}
}
});
}
dijit._editor._globalSaveHandler[this.id]=dojo.hitch(this,"_saveContent");
}
this.isClosed=false;
var ifr=(this.editorObject=this.iframe=dojo.doc.createElement("iframe"));
ifr.id=this.id+"_iframe";
this._iframeSrc=this._getIframeDocTxt();
ifr.style.border="none";
ifr.style.width="100%";
if(this._layoutMode){
ifr.style.height="100%";
}else{
if(dojo.isIE>=7){
if(this.height){
ifr.style.height=this.height;
}
if(this.minHeight){
ifr.style.minHeight=this.minHeight;
}
}else{
ifr.style.height=this.height?this.height:this.minHeight;
}
}
ifr.frameBorder=0;
ifr._loadFunc=dojo.hitch(this,function(win){
this.window=win;
this.document=this.window.document;
if(dojo.isIE){
this._localizeEditorCommands();
}
this.onLoad(html);
});
var s="javascript:parent."+dijit._scopeName+".byId(\""+this.id+"\")._iframeSrc";
ifr.setAttribute("src",s);
this.editingArea.appendChild(ifr);
if(dojo.isSafari<=4){
var src=ifr.getAttribute("src");
if(!src||src.indexOf("javascript")==-1){
setTimeout(function(){
ifr.setAttribute("src",s);
},0);
}
}
if(dn.nodeName=="LI"){
dn.lastChild.style.marginTop="-1.2em";
}
dojo.addClass(this.domNode,this.baseClass);
},_local2NativeFormatNames:{},_native2LocalFormatNames:{},_getIframeDocTxt:function(){
var _56c=dojo.getComputedStyle(this.domNode);
var html="";
var _56d=true;
if(dojo.isIE||dojo.isWebKit||(!this.height&&!dojo.isMoz)){
html="<div id='dijitEditorBody'></div>";
_56d=false;
}else{
if(dojo.isMoz){
this._cursorToStart=true;
html="&nbsp;";
}
}
var font=[_56c.fontWeight,_56c.fontSize,_56c.fontFamily].join(" ");
var _56e=_56c.lineHeight;
if(_56e.indexOf("px")>=0){
_56e=parseFloat(_56e)/parseFloat(_56c.fontSize);
}else{
if(_56e.indexOf("em")>=0){
_56e=parseFloat(_56e);
}else{
_56e="normal";
}
}
var _56f="";
var self=this;
this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig,function(_570){
_570=_570.replace(/^;/ig,"")+";";
var s=_570.split(":")[0];
if(s){
s=dojo.trim(s);
s=s.toLowerCase();
var i;
var sC="";
for(i=0;i<s.length;i++){
var c=s.charAt(i);
switch(c){
case "-":
i++;
c=s.charAt(i).toUpperCase();
default:
sC+=c;
}
}
dojo.style(self.domNode,sC,"");
}
_56f+=_570+";";
});
var _571=dojo.query("label[for=\""+this.id+"\"]");
return [this.isLeftToRight()?"<html>\n<head>\n":"<html dir='rtl'>\n<head>\n",(dojo.isMoz&&_571.length?"<title>"+_571[0].innerHTML+"</title>\n":""),"<meta http-equiv='Content-Type' content='text/html'>\n","<style>\n","\tbody,html {\n","\t\tbackground:transparent;\n","\t\tpadding: 1px 0 0 0;\n","\t\tmargin: -1px 0 0 0;\n",((dojo.isWebKit)?"\t\twidth: 100%;\n":""),((dojo.isWebKit)?"\t\theight: 100%;\n":""),"\t}\n","\tbody{\n","\t\ttop:0px;\n","\t\tleft:0px;\n","\t\tright:0px;\n","\t\tfont:",font,";\n",((this.height||dojo.isOpera)?"":"\t\tposition: fixed;\n"),"\t\tmin-height:",this.minHeight,";\n","\t\tline-height:",_56e,";\n","\t}\n","\tp{ margin: 1em 0; }\n",(!_56d&&!this.height?"\tbody,html {overflow-y: hidden;}\n":""),"\t#dijitEditorBody{overflow-x: auto; overflow-y:"+(this.height?"auto;":"hidden;")+" outline: 0px;}\n","\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",(!dojo.isIE?"\tli{ min-height:1.2em; }\n":""),"</style>\n",this._applyEditingAreaStyleSheets(),"\n","</head>\n<body ",(_56d?"id='dijitEditorBody' ":""),"onload='frameElement._loadFunc(window,document)' style='"+_56f+"'>",html,"</body>\n</html>"].join("");
},_applyEditingAreaStyleSheets:function(){
var _572=[];
if(this.styleSheets){
_572=this.styleSheets.split(";");
this.styleSheets="";
}
_572=_572.concat(this.editingAreaStyleSheets);
this.editingAreaStyleSheets=[];
var text="",i=0,url;
while((url=_572[i++])){
var _573=(new dojo._Url(dojo.global.location,url)).toString();
this.editingAreaStyleSheets.push(_573);
text+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_573+"\"/>";
}
return text;
},addStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo._Url(dojo.global.location,url)).toString();
}
if(dojo.indexOf(this.editingAreaStyleSheets,url)>-1){
return;
}
this.editingAreaStyleSheets.push(url);
this.onLoadDeferred.addCallback(dojo.hitch(this,function(){
if(this.document.createStyleSheet){
this.document.createStyleSheet(url);
}else{
var head=this.document.getElementsByTagName("head")[0];
var _574=this.document.createElement("link");
_574.rel="stylesheet";
_574.type="text/css";
_574.href=url;
head.appendChild(_574);
}
}));
},removeStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo._Url(dojo.global.location,url)).toString();
}
var _575=dojo.indexOf(this.editingAreaStyleSheets,url);
if(_575==-1){
return;
}
delete this.editingAreaStyleSheets[_575];
dojo.withGlobal(this.window,"query",dojo,["link:[href=\""+url+"\"]"]).orphan();
},disabled:false,_mozSettingProps:{"styleWithCSS":false},_setDisabledAttr:function(_576){
_576=!!_576;
this._set("disabled",_576);
if(!this.isLoaded){
return;
}
if(dojo.isIE||dojo.isWebKit||dojo.isOpera){
var _577=dojo.isIE&&(this.isLoaded||!this.focusOnLoad);
if(_577){
this.editNode.unselectable="on";
}
this.editNode.contentEditable=!_576;
if(_577){
var _578=this;
setTimeout(function(){
_578.editNode.unselectable="off";
},0);
}
}else{
try{
this.document.designMode=(_576?"off":"on");
}
catch(e){
return;
}
if(!_576&&this._mozSettingProps){
var ps=this._mozSettingProps;
for(var n in ps){
if(ps.hasOwnProperty(n)){
try{
this.document.execCommand(n,false,ps[n]);
}
catch(e2){
}
}
}
}
}
this._disabledOK=true;
},onLoad:function(html){
if(!this.window.__registeredWindow){
this.window.__registeredWindow=true;
this._iframeRegHandle=dijit.registerIframe(this.iframe);
}
if(!dojo.isIE&&!dojo.isWebKit&&(this.height||dojo.isMoz)){
this.editNode=this.document.body;
}else{
this.editNode=this.document.body.firstChild;
var _579=this;
if(dojo.isIE){
this.tabStop=dojo.create("div",{tabIndex:-1},this.editingArea);
this.iframe.onfocus=function(){
_579.editNode.setActive();
};
}
}
this.focusNode=this.editNode;
var _57a=this.events.concat(this.captureEvents);
var ap=this.iframe?this.document:this.editNode;
dojo.forEach(_57a,function(item){
this.connect(ap,item.toLowerCase(),item);
},this);
this.connect(ap,"onmouseup","onClick");
if(dojo.isIE){
this.connect(this.document,"onmousedown","_onIEMouseDown");
this.editNode.style.zoom=1;
}else{
this.connect(this.document,"onmousedown",function(){
delete this._cursorToStart;
});
}
if(dojo.isWebKit){
this._webkitListener=this.connect(this.document,"onmouseup","onDisplayChanged");
this.connect(this.document,"onmousedown",function(e){
var t=e.target;
if(t&&(t===this.document.body||t===this.document)){
setTimeout(dojo.hitch(this,"placeCursorAtEnd"),0);
}
});
}
if(dojo.isIE){
try{
this.document.execCommand("RespectVisibilityInDesign",true,null);
}
catch(e){
}
}
this.isLoaded=true;
this.set("disabled",this.disabled);
var _57b=dojo.hitch(this,function(){
this.setValue(html);
if(this.onLoadDeferred){
this.onLoadDeferred.callback(true);
}
this.onDisplayChanged();
if(this.focusOnLoad){
dojo.addOnLoad(dojo.hitch(this,function(){
setTimeout(dojo.hitch(this,"focus"),this.updateInterval);
}));
}
this.value=this.getValue(true);
});
if(this.setValueDeferred){
this.setValueDeferred.addCallback(_57b);
}else{
_57b();
}
},onKeyDown:function(e){
if(e.keyCode===dojo.keys.TAB&&this.isTabIndent){
dojo.stopEvent(e);
if(this.queryCommandEnabled((e.shiftKey?"outdent":"indent"))){
this.execCommand((e.shiftKey?"outdent":"indent"));
}
}
if(dojo.isIE){
if(e.keyCode==dojo.keys.TAB&&!this.isTabIndent){
if(e.shiftKey&&!e.ctrlKey&&!e.altKey){
this.iframe.focus();
}else{
if(!e.shiftKey&&!e.ctrlKey&&!e.altKey){
this.tabStop.focus();
}
}
}else{
if(e.keyCode===dojo.keys.BACKSPACE&&this.document.selection.type==="Control"){
dojo.stopEvent(e);
this.execCommand("delete");
}else{
if((65<=e.keyCode&&e.keyCode<=90)||(e.keyCode>=37&&e.keyCode<=40)){
e.charCode=e.keyCode;
this.onKeyPress(e);
}
}
}
}
return true;
},onKeyUp:function(e){
return;
},setDisabled:function(_57c){
dojo.deprecated("dijit.Editor::setDisabled is deprecated","use dijit.Editor::attr(\"disabled\",boolean) instead",2);
this.set("disabled",_57c);
},_setValueAttr:function(_57d){
this.setValue(_57d);
},_setDisableSpellCheckAttr:function(_57e){
if(this.document){
dojo.attr(this.document.body,"spellcheck",!_57e);
}else{
this.onLoadDeferred.addCallback(dojo.hitch(this,function(){
dojo.attr(this.document.body,"spellcheck",!_57e);
}));
}
this._set("disableSpellCheck",_57e);
},onKeyPress:function(e){
var c=(e.keyChar&&e.keyChar.toLowerCase())||e.keyCode,_57f=this._keyHandlers[c],args=arguments;
if(_57f&&!e.altKey){
dojo.some(_57f,function(h){
if(!(h.shift^e.shiftKey)&&!(h.ctrl^(e.ctrlKey||e.metaKey))){
if(!h.handler.apply(this,args)){
e.preventDefault();
}
return true;
}
},this);
}
if(!this._onKeyHitch){
this._onKeyHitch=dojo.hitch(this,"onKeyPressed");
}
setTimeout(this._onKeyHitch,1);
return true;
},addKeyHandler:function(key,ctrl,_580,_581){
if(!dojo.isArray(this._keyHandlers[key])){
this._keyHandlers[key]=[];
}
this._keyHandlers[key].push({shift:_580||false,ctrl:ctrl||false,handler:_581});
},onKeyPressed:function(){
this.onDisplayChanged();
},onClick:function(e){
this.onDisplayChanged(e);
},_onIEMouseDown:function(e){
if(!this._focused&&!this.disabled){
this.focus();
}
},_onBlur:function(e){
this.inherited(arguments);
var _582=this.getValue(true);
if(_582!=this.value){
this.onChange(_582);
}
this._set("value",_582);
},_onFocus:function(e){
if(!this.disabled){
if(!this._disabledOK){
this.set("disabled",false);
}
this.inherited(arguments);
}
},blur:function(){
if(!dojo.isIE&&this.window.document.documentElement&&this.window.document.documentElement.focus){
this.window.document.documentElement.focus();
}else{
if(dojo.doc.body.focus){
dojo.doc.body.focus();
}
}
},focus:function(){
if(!this.isLoaded){
this.focusOnLoad=true;
return;
}
if(this._cursorToStart){
delete this._cursorToStart;
if(this.editNode.childNodes){
this.placeCursorAtStart();
return;
}
}
if(!dojo.isIE){
dijit.focus(this.iframe);
}else{
if(this.editNode&&this.editNode.focus){
this.iframe.fireEvent("onfocus",document.createEventObject());
}
}
},updateInterval:200,_updateTimer:null,onDisplayChanged:function(e){
if(this._updateTimer){
clearTimeout(this._updateTimer);
}
if(!this._updateHandler){
this._updateHandler=dojo.hitch(this,"onNormalizedDisplayChanged");
}
this._updateTimer=setTimeout(this._updateHandler,this.updateInterval);
},onNormalizedDisplayChanged:function(){
delete this._updateTimer;
},onChange:function(_583){
},_normalizeCommand:function(cmd,_584){
var _585=cmd.toLowerCase();
if(_585=="formatblock"){
if(dojo.isSafari&&_584===undefined){
_585="heading";
}
}else{
if(_585=="hilitecolor"&&!dojo.isMoz){
_585="backcolor";
}
}
return _585;
},_qcaCache:{},queryCommandAvailable:function(_586){
var ca=this._qcaCache[_586];
if(ca!==undefined){
return ca;
}
return (this._qcaCache[_586]=this._queryCommandAvailable(_586));
},_queryCommandAvailable:function(_587){
var ie=1;
var _588=1<<1;
var _589=1<<2;
var _58a=1<<3;
function _58b(_58c){
return {ie:Boolean(_58c&ie),mozilla:Boolean(_58c&_588),webkit:Boolean(_58c&_589),opera:Boolean(_58c&_58a)};
};
var _58d=null;
switch(_587.toLowerCase()){
case "bold":
case "italic":
case "underline":
case "subscript":
case "superscript":
case "fontname":
case "fontsize":
case "forecolor":
case "hilitecolor":
case "justifycenter":
case "justifyfull":
case "justifyleft":
case "justifyright":
case "delete":
case "selectall":
case "toggledir":
_58d=_58b(_588|ie|_589|_58a);
break;
case "createlink":
case "unlink":
case "removeformat":
case "inserthorizontalrule":
case "insertimage":
case "insertorderedlist":
case "insertunorderedlist":
case "indent":
case "outdent":
case "formatblock":
case "inserthtml":
case "undo":
case "redo":
case "strikethrough":
case "tabindent":
_58d=_58b(_588|ie|_58a|_589);
break;
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
_58d=_58b(ie);
break;
case "cut":
case "copy":
case "paste":
_58d=_58b(ie|_588|_589);
break;
case "inserttable":
_58d=_58b(_588|ie);
break;
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
_58d=_58b(ie|_588);
break;
default:
return false;
}
return (dojo.isIE&&_58d.ie)||(dojo.isMoz&&_58d.mozilla)||(dojo.isWebKit&&_58d.webkit)||(dojo.isOpera&&_58d.opera);
},execCommand:function(_58e,_58f){
var _590;
this.focus();
_58e=this._normalizeCommand(_58e,_58f);
if(_58f!==undefined){
if(_58e=="heading"){
throw new Error("unimplemented");
}else{
if((_58e=="formatblock")&&dojo.isIE){
_58f="<"+_58f+">";
}
}
}
var _591="_"+_58e+"Impl";
if(this[_591]){
_590=this[_591](_58f);
}else{
_58f=arguments.length>1?_58f:null;
if(_58f||_58e!="createlink"){
_590=this.document.execCommand(_58e,false,_58f);
}
}
this.onDisplayChanged();
return _590;
},queryCommandEnabled:function(_592){
if(this.disabled||!this._disabledOK){
return false;
}
_592=this._normalizeCommand(_592);
if(dojo.isMoz||dojo.isWebKit){
if(_592=="unlink"){
return this._sCall("hasAncestorElement",["a"]);
}else{
if(_592=="inserttable"){
return true;
}
}
}
if(dojo.isWebKit){
if(_592=="cut"||_592=="copy"){
var sel=this.window.getSelection();
if(sel){
sel=sel.toString();
}
return !!sel;
}else{
if(_592=="paste"){
return true;
}
}
}
var elem=dojo.isIE?this.document.selection.createRange():this.document;
try{
return elem.queryCommandEnabled(_592);
}
catch(e){
return false;
}
},queryCommandState:function(_593){
if(this.disabled||!this._disabledOK){
return false;
}
_593=this._normalizeCommand(_593);
try{
return this.document.queryCommandState(_593);
}
catch(e){
return false;
}
},queryCommandValue:function(_594){
if(this.disabled||!this._disabledOK){
return false;
}
var r;
_594=this._normalizeCommand(_594);
if(dojo.isIE&&_594=="formatblock"){
r=this._native2LocalFormatNames[this.document.queryCommandValue(_594)];
}else{
if(dojo.isMoz&&_594==="hilitecolor"){
var _595;
try{
_595=this.document.queryCommandValue("styleWithCSS");
}
catch(e){
_595=false;
}
this.document.execCommand("styleWithCSS",false,true);
r=this.document.queryCommandValue(_594);
this.document.execCommand("styleWithCSS",false,_595);
}else{
r=this.document.queryCommandValue(_594);
}
}
return r;
},_sCall:function(name,args){
return dojo.withGlobal(this.window,name,dijit._editor.selection,args);
},placeCursorAtStart:function(){
this.focus();
var _596=false;
if(dojo.isMoz){
var _597=this.editNode.firstChild;
while(_597){
if(_597.nodeType==3){
if(_597.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_596=true;
this._sCall("selectElement",[_597]);
break;
}
}else{
if(_597.nodeType==1){
_596=true;
var tg=_597.tagName?_597.tagName.toLowerCase():"";
if(/br|input|img|base|meta|area|basefont|hr|link/.test(tg)){
this._sCall("selectElement",[_597]);
}else{
this._sCall("selectElementChildren",[_597]);
}
break;
}
}
_597=_597.nextSibling;
}
}else{
_596=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_596){
this._sCall("collapse",[true]);
}
},placeCursorAtEnd:function(){
this.focus();
var _598=false;
if(dojo.isMoz){
var last=this.editNode.lastChild;
while(last){
if(last.nodeType==3){
if(last.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_598=true;
this._sCall("selectElement",[last]);
break;
}
}else{
if(last.nodeType==1){
_598=true;
if(last.lastChild){
this._sCall("selectElement",[last.lastChild]);
}else{
this._sCall("selectElement",[last]);
}
break;
}
}
last=last.previousSibling;
}
}else{
_598=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_598){
this._sCall("collapse",[false]);
}
},getValue:function(_599){
if(this.textarea){
if(this.isClosed||!this.isLoaded){
return this.textarea.value;
}
}
return this._postFilterContent(null,_599);
},_getValueAttr:function(){
return this.getValue(true);
},setValue:function(html){
if(!this.isLoaded){
this.onLoadDeferred.addCallback(dojo.hitch(this,function(){
this.setValue(html);
}));
return;
}
this._cursorToStart=true;
if(this.textarea&&(this.isClosed||!this.isLoaded)){
this.textarea.value=html;
}else{
html=this._preFilterContent(html);
var node=this.isClosed?this.domNode:this.editNode;
if(html&&dojo.isMoz&&html.toLowerCase()=="<p></p>"){
html="<p>&nbsp;</p>";
}
if(!html&&dojo.isWebKit){
html="&nbsp;";
}
node.innerHTML=html;
this._preDomFilterContent(node);
}
this.onDisplayChanged();
this._set("value",this.getValue(true));
},replaceValue:function(html){
if(this.isClosed){
this.setValue(html);
}else{
if(this.window&&this.window.getSelection&&!dojo.isMoz){
this.setValue(html);
}else{
if(this.window&&this.window.getSelection){
html=this._preFilterContent(html);
this.execCommand("selectall");
if(!html){
this._cursorToStart=true;
html="&nbsp;";
}
this.execCommand("inserthtml",html);
this._preDomFilterContent(this.editNode);
}else{
if(this.document&&this.document.selection){
this.setValue(html);
}
}
}
}
this._set("value",this.getValue(true));
},_preFilterContent:function(html){
var ec=html;
dojo.forEach(this.contentPreFilters,function(ef){
if(ef){
ec=ef(ec);
}
});
return ec;
},_preDomFilterContent:function(dom){
dom=dom||this.editNode;
dojo.forEach(this.contentDomPreFilters,function(ef){
if(ef&&dojo.isFunction(ef)){
ef(dom);
}
},this);
},_postFilterContent:function(dom,_59a){
var ec;
if(!dojo.isString(dom)){
dom=dom||this.editNode;
if(this.contentDomPostFilters.length){
if(_59a){
dom=dojo.clone(dom);
}
dojo.forEach(this.contentDomPostFilters,function(ef){
dom=ef(dom);
});
}
ec=dijit._editor.getChildrenHtml(dom);
}else{
ec=dom;
}
if(!dojo.trim(ec.replace(/^\xA0\xA0*/,"").replace(/\xA0\xA0*$/,"")).length){
ec="";
}
dojo.forEach(this.contentPostFilters,function(ef){
ec=ef(ec);
});
return ec;
},_saveContent:function(e){
var _59b=dojo.byId(dijit._scopeName+"._editor.RichText.value");
if(_59b.value){
_59b.value+=this._SEPARATOR;
}
_59b.value+=this.name+this._NAME_CONTENT_SEP+this.getValue(true);
},escapeXml:function(str,_59c){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_59c){
str=str.replace(/'/gm,"&#39;");
}
return str;
},getNodeHtml:function(node){
dojo.deprecated("dijit.Editor::getNodeHtml is deprecated","use dijit._editor.getNodeHtml instead",2);
return dijit._editor.getNodeHtml(node);
},getNodeChildrenHtml:function(dom){
dojo.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated","use dijit._editor.getChildrenHtml instead",2);
return dijit._editor.getChildrenHtml(dom);
},close:function(save){
if(this.isClosed){
return;
}
if(!arguments.length){
save=true;
}
if(save){
this._set("value",this.getValue(true));
}
if(this.interval){
clearInterval(this.interval);
}
if(this._webkitListener){
this.disconnect(this._webkitListener);
delete this._webkitListener;
}
if(dojo.isIE){
this.iframe.onfocus=null;
}
this.iframe._loadFunc=null;
if(this._iframeRegHandle){
dijit.unregisterIframe(this._iframeRegHandle);
delete this._iframeRegHandle;
}
if(this.textarea){
var s=this.textarea.style;
s.position="";
s.left=s.top="";
if(dojo.isIE){
s.overflow=this.__overflow;
this.__overflow=null;
}
this.textarea.value=this.value;
dojo.destroy(this.domNode);
this.domNode=this.textarea;
}else{
this.domNode.innerHTML=this.value;
}
delete this.iframe;
dojo.removeClass(this.domNode,this.baseClass);
this.isClosed=true;
this.isLoaded=false;
delete this.editNode;
delete this.focusNode;
if(this.window&&this.window._frameElement){
this.window._frameElement=null;
}
this.window=null;
this.document=null;
this.editingArea=null;
this.editorObject=null;
},destroy:function(){
if(!this.isClosed){
this.close(false);
}
this.inherited(arguments);
if(dijit._editor._globalSaveHandler){
delete dijit._editor._globalSaveHandler[this.id];
}
},_removeMozBogus:function(html){
return html.replace(/\stype="_moz"/gi,"").replace(/\s_moz_dirty=""/gi,"").replace(/_moz_resizing="(true|false)"/gi,"");
},_removeWebkitBogus:function(html){
html=html.replace(/\sclass="webkit-block-placeholder"/gi,"");
html=html.replace(/\sclass="apple-style-span"/gi,"");
html=html.replace(/<meta charset=\"utf-8\" \/>/gi,"");
return html;
},_normalizeFontStyle:function(html){
return html.replace(/<(\/)?strong([ \>])/gi,"<$1b$2").replace(/<(\/)?em([ \>])/gi,"<$1i$2");
},_preFixUrlAttributes:function(html){
return html.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2");
},_inserthorizontalruleImpl:function(_59d){
if(dojo.isIE){
return this._inserthtmlImpl("<hr>");
}
return this.document.execCommand("inserthorizontalrule",false,_59d);
},_unlinkImpl:function(_59e){
if((this.queryCommandEnabled("unlink"))&&(dojo.isMoz||dojo.isWebKit)){
var a=this._sCall("getAncestorElement",["a"]);
this._sCall("selectElement",[a]);
return this.document.execCommand("unlink",false,null);
}
return this.document.execCommand("unlink",false,_59e);
},_hilitecolorImpl:function(_59f){
var _5a0;
if(dojo.isMoz){
this.document.execCommand("styleWithCSS",false,true);
_5a0=this.document.execCommand("hilitecolor",false,_59f);
this.document.execCommand("styleWithCSS",false,false);
}else{
_5a0=this.document.execCommand("hilitecolor",false,_59f);
}
return _5a0;
},_backcolorImpl:function(_5a1){
if(dojo.isIE){
_5a1=_5a1?_5a1:null;
}
return this.document.execCommand("backcolor",false,_5a1);
},_forecolorImpl:function(_5a2){
if(dojo.isIE){
_5a2=_5a2?_5a2:null;
}
return this.document.execCommand("forecolor",false,_5a2);
},_inserthtmlImpl:function(_5a3){
_5a3=this._preFilterContent(_5a3);
var rv=true;
if(dojo.isIE){
var _5a4=this.document.selection.createRange();
if(this.document.selection.type.toUpperCase()=="CONTROL"){
var n=_5a4.item(0);
while(_5a4.length){
_5a4.remove(_5a4.item(0));
}
n.outerHTML=_5a3;
}else{
_5a4.pasteHTML(_5a3);
}
_5a4.select();
}else{
if(dojo.isMoz&&!_5a3.length){
this._sCall("remove");
}else{
rv=this.document.execCommand("inserthtml",false,_5a3);
}
}
return rv;
},_boldImpl:function(_5a5){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("bold",false,_5a5);
},_italicImpl:function(_5a6){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("italic",false,_5a6);
},_underlineImpl:function(_5a7){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("underline",false,_5a7);
},_strikethroughImpl:function(_5a8){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("strikethrough",false,_5a8);
},getHeaderHeight:function(){
return this._getNodeChildrenHeight(this.header);
},getFooterHeight:function(){
return this._getNodeChildrenHeight(this.footer);
},_getNodeChildrenHeight:function(node){
var h=0;
if(node&&node.childNodes){
var i;
for(i=0;i<node.childNodes.length;i++){
var size=dojo.position(node.childNodes[i]);
h+=size.h;
}
}
return h;
},_isNodeEmpty:function(node,_5a9){
if(node.nodeType==1){
if(node.childNodes.length>0){
return this._isNodeEmpty(node.childNodes[0],_5a9);
}
return true;
}else{
if(node.nodeType==3){
return (node.nodeValue.substring(_5a9)=="");
}
}
return false;
},_removeStartingRangeFromRange:function(node,_5aa){
if(node.nextSibling){
_5aa.setStart(node.nextSibling,0);
}else{
var _5ab=node.parentNode;
while(_5ab&&_5ab.nextSibling==null){
_5ab=_5ab.parentNode;
}
if(_5ab){
_5aa.setStart(_5ab.nextSibling,0);
}
}
return _5aa;
},_adaptIESelection:function(){
var _5ac=dijit.range.getSelection(this.window);
if(_5ac&&_5ac.rangeCount&&!_5ac.isCollapsed){
var _5ad=_5ac.getRangeAt(0);
var _5ae=_5ad.startContainer;
var _5af=_5ad.startOffset;
while(_5ae.nodeType==3&&_5af>=_5ae.length&&_5ae.nextSibling){
_5af=_5af-_5ae.length;
_5ae=_5ae.nextSibling;
}
var _5b0=null;
while(this._isNodeEmpty(_5ae,_5af)&&_5ae!=_5b0){
_5b0=_5ae;
_5ad=this._removeStartingRangeFromRange(_5ae,_5ad);
_5ae=_5ad.startContainer;
_5af=0;
}
_5ac.removeAllRanges();
_5ac.addRange(_5ad);
}
}});
}
if(!dojo._hasResource["dijit.ToolbarSeparator"]){
dojo._hasResource["dijit.ToolbarSeparator"]=true;
dojo.provide("dijit.ToolbarSeparator");
dojo.declare("dijit.ToolbarSeparator",[dijit._Widget,dijit._Templated],{templateString:"<div class=\"dijitToolbarSeparator dijitInline\" role=\"presentation\"></div>",buildRendering:function(){
this.inherited(arguments);
dojo.setSelectable(this.domNode,false);
},isFocusable:function(){
return false;
}});
}
if(!dojo._hasResource["dijit.Toolbar"]){
dojo._hasResource["dijit.Toolbar"]=true;
dojo.provide("dijit.Toolbar");
dojo.declare("dijit.Toolbar",[dijit._Widget,dijit._Templated,dijit._KeyNavContainer],{templateString:"<div class=\"dijit\" role=\"toolbar\" tabIndex=\"${tabIndex}\" dojoAttachPoint=\"containerNode\">"+"</div>",baseClass:"dijitToolbar",postCreate:function(){
this.inherited(arguments);
this.connectKeyNavHandlers(this.isLeftToRight()?[dojo.keys.LEFT_ARROW]:[dojo.keys.RIGHT_ARROW],this.isLeftToRight()?[dojo.keys.RIGHT_ARROW]:[dojo.keys.LEFT_ARROW]);
},startup:function(){
if(this._started){
return;
}
this.startupKeyNavChildren();
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit._editor._Plugin"]){
dojo._hasResource["dijit._editor._Plugin"]=true;
dojo.provide("dijit._editor._Plugin");
dojo.declare("dijit._editor._Plugin",null,{constructor:function(args,node){
this.params=args||{};
dojo.mixin(this,this.params);
this._connects=[];
this._attrPairNames={};
},editor:null,iconClassPrefix:"dijitEditorIcon",button:null,command:"",useDefaultCommand:true,buttonClass:dijit.form.Button,disabled:false,getLabel:function(key){
return this.editor.commands[key];
},_initButton:function(){
if(this.command.length){
var _5b1=this.getLabel(this.command),_5b2=this.editor,_5b3=this.iconClassPrefix+" "+this.iconClassPrefix+this.command.charAt(0).toUpperCase()+this.command.substr(1);
if(!this.button){
var _5b4=dojo.mixin({label:_5b1,dir:_5b2.dir,lang:_5b2.lang,showLabel:false,iconClass:_5b3,dropDown:this.dropDown,tabIndex:"-1"},this.params||{});
this.button=new this.buttonClass(_5b4);
}
}
if(this.get("disabled")&&this.button){
this.button.set("disabled",this.get("disabled"));
}
},destroy:function(){
dojo.forEach(this._connects,dojo.disconnect);
if(this.dropDown){
this.dropDown.destroyRecursive();
}
},connect:function(o,f,tf){
this._connects.push(dojo.connect(o,f,this,tf));
},updateState:function(){
var e=this.editor,c=this.command,_5b5,_5b6;
if(!e||!e.isLoaded||!c.length){
return;
}
var _5b7=this.get("disabled");
if(this.button){
try{
_5b6=!_5b7&&e.queryCommandEnabled(c);
if(this.enabled!==_5b6){
this.enabled=_5b6;
this.button.set("disabled",!_5b6);
}
if(typeof this.button.checked=="boolean"){
_5b5=e.queryCommandState(c);
if(this.checked!==_5b5){
this.checked=_5b5;
this.button.set("checked",e.queryCommandState(c));
}
}
}
catch(e){
}
}
},setEditor:function(_5b8){
this.editor=_5b8;
this._initButton();
if(this.button&&this.useDefaultCommand){
if(this.editor.queryCommandAvailable(this.command)){
this.connect(this.button,"onClick",dojo.hitch(this.editor,"execCommand",this.command,this.commandArg));
}else{
this.button.domNode.style.display="none";
}
}
this.connect(this.editor,"onNormalizedDisplayChanged","updateState");
},setToolbar:function(_5b9){
if(this.button){
_5b9.addChild(this.button);
}
},set:function(name,_5ba){
if(typeof name==="object"){
for(var x in name){
this.set(x,name[x]);
}
return this;
}
var _5bb=this._getAttrNames(name);
if(this[_5bb.s]){
var _5bc=this[_5bb.s].apply(this,Array.prototype.slice.call(arguments,1));
}else{
this._set(name,_5ba);
}
return _5bc||this;
},get:function(name){
var _5bd=this._getAttrNames(name);
return this[_5bd.g]?this[_5bd.g]():this[name];
},_setDisabledAttr:function(_5be){
this.disabled=_5be;
this.updateState();
},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
var uc=name.charAt(0).toUpperCase()+name.substr(1);
return (apn[name]={s:"_set"+uc+"Attr",g:"_get"+uc+"Attr"});
},_set:function(name,_5bf){
var _5c0=this[name];
this[name]=_5bf;
}});
}
if(!dojo._hasResource["dijit._editor.plugins.EnterKeyHandling"]){
dojo._hasResource["dijit._editor.plugins.EnterKeyHandling"]=true;
dojo.provide("dijit._editor.plugins.EnterKeyHandling");
dojo.declare("dijit._editor.plugins.EnterKeyHandling",dijit._editor._Plugin,{blockNodeForEnter:"BR",constructor:function(args){
if(args){
if("blockNodeForEnter" in args){
args.blockNodeForEnter=args.blockNodeForEnter.toUpperCase();
}
dojo.mixin(this,args);
}
},setEditor:function(_5c1){
if(this.editor===_5c1){
return;
}
this.editor=_5c1;
if(this.blockNodeForEnter=="BR"){
this.editor.customUndo=true;
_5c1.onLoadDeferred.addCallback(dojo.hitch(this,function(d){
this.connect(_5c1.document,"onkeypress",function(e){
if(e.charOrCode==dojo.keys.ENTER){
var ne=dojo.mixin({},e);
ne.shiftKey=true;
if(!this.handleEnterKey(ne)){
dojo.stopEvent(e);
}
}
});
return d;
}));
}else{
if(this.blockNodeForEnter){
var h=dojo.hitch(this,this.handleEnterKey);
_5c1.addKeyHandler(13,0,0,h);
_5c1.addKeyHandler(13,0,1,h);
this.connect(this.editor,"onKeyPressed","onKeyPressed");
}
}
},onKeyPressed:function(e){
if(this._checkListLater){
if(dojo.withGlobal(this.editor.window,"isCollapsed",dijit)){
var _5c2=dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,["LI"]);
if(!_5c2){
dijit._editor.RichText.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
var _5c3=dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,[this.blockNodeForEnter]);
if(_5c3){
_5c3.innerHTML=this.bogusHtmlContent;
if(dojo.isIE){
var r=this.editor.document.selection.createRange();
r.move("character",-1);
r.select();
}
}else{
console.error("onKeyPressed: Cannot find the new block node");
}
}else{
if(dojo.isMoz){
if(_5c2.parentNode.parentNode.nodeName=="LI"){
_5c2=_5c2.parentNode.parentNode;
}
}
var fc=_5c2.firstChild;
if(fc&&fc.nodeType==1&&(fc.nodeName=="UL"||fc.nodeName=="OL")){
_5c2.insertBefore(fc.ownerDocument.createTextNode(" "),fc);
var _5c4=dijit.range.create(this.editor.window);
_5c4.setStart(_5c2.firstChild,0);
var _5c5=dijit.range.getSelection(this.editor.window,true);
_5c5.removeAllRanges();
_5c5.addRange(_5c4);
}
}
}
this._checkListLater=false;
}
if(this._pressedEnterInBlock){
if(this._pressedEnterInBlock.previousSibling){
this.removeTrailingBr(this._pressedEnterInBlock.previousSibling);
}
delete this._pressedEnterInBlock;
}
},bogusHtmlContent:"&nbsp;",blockNodes:/^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,handleEnterKey:function(e){
var _5c6,_5c7,_5c8,_5c9,_5ca,_5cb,doc=this.editor.document,br,rs,txt;
if(e.shiftKey){
var _5cc=dojo.withGlobal(this.editor.window,"getParentElement",dijit._editor.selection);
var _5cd=dijit.range.getAncestor(_5cc,this.blockNodes);
if(_5cd){
if(_5cd.tagName=="LI"){
return true;
}
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
if(!_5c7.collapsed){
_5c7.deleteContents();
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
}
if(dijit.range.atBeginningOfContainer(_5cd,_5c7.startContainer,_5c7.startOffset)){
br=doc.createElement("br");
_5c8=dijit.range.create(this.editor.window);
_5cd.insertBefore(br,_5cd.firstChild);
_5c8.setStartBefore(br.nextSibling);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
}else{
if(dijit.range.atEndOfContainer(_5cd,_5c7.startContainer,_5c7.startOffset)){
_5c8=dijit.range.create(this.editor.window);
br=doc.createElement("br");
_5cd.appendChild(br);
_5cd.appendChild(doc.createTextNode(" "));
_5c8.setStart(_5cd.lastChild,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
}else{
rs=_5c7.startContainer;
if(rs&&rs.nodeType==3){
txt=rs.nodeValue;
dojo.withGlobal(this.editor.window,function(){
_5c9=doc.createTextNode(txt.substring(0,_5c7.startOffset));
_5ca=doc.createTextNode(txt.substring(_5c7.startOffset));
_5cb=doc.createElement("br");
if(_5ca.nodeValue==""&&dojo.isWebKit){
_5ca=doc.createTextNode(" ");
}
dojo.place(_5c9,rs,"after");
dojo.place(_5cb,_5c9,"after");
dojo.place(_5ca,_5cb,"after");
dojo.destroy(rs);
_5c8=dijit.range.create(dojo.gobal);
_5c8.setStart(_5ca,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
});
return false;
}
return true;
}
}
}else{
_5c6=dijit.range.getSelection(this.editor.window);
if(_5c6.rangeCount){
_5c7=_5c6.getRangeAt(0);
if(_5c7&&_5c7.startContainer){
if(!_5c7.collapsed){
_5c7.deleteContents();
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
}
rs=_5c7.startContainer;
if(rs&&rs.nodeType==3){
dojo.withGlobal(this.editor.window,dojo.hitch(this,function(){
var _5ce=false;
var _5cf=_5c7.startOffset;
if(rs.length<_5cf){
ret=this._adjustNodeAndOffset(rs,_5cf);
rs=ret.node;
_5cf=ret.offset;
}
txt=rs.nodeValue;
_5c9=doc.createTextNode(txt.substring(0,_5cf));
_5ca=doc.createTextNode(txt.substring(_5cf));
_5cb=doc.createElement("br");
if(!_5ca.length){
_5ca=doc.createTextNode(" ");
_5ce=true;
}
if(_5c9.length){
dojo.place(_5c9,rs,"after");
}else{
_5c9=rs;
}
dojo.place(_5cb,_5c9,"after");
dojo.place(_5ca,_5cb,"after");
dojo.destroy(rs);
_5c8=dijit.range.create(dojo.gobal);
_5c8.setStart(_5ca,0);
_5c8.setEnd(_5ca,_5ca.length);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
if(_5ce&&!dojo.isWebKit){
dijit._editor.selection.remove();
}else{
dijit._editor.selection.collapse(true);
}
}));
}else{
dojo.withGlobal(this.editor.window,dojo.hitch(this,function(){
var _5d0=doc.createElement("br");
rs.appendChild(_5d0);
var _5d1=doc.createTextNode(" ");
rs.appendChild(_5d1);
_5c8=dijit.range.create(dojo.global);
_5c8.setStart(_5d1,0);
_5c8.setEnd(_5d1,_5d1.length);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
dijit._editor.selection.collapse(true);
}));
}
}
}else{
dijit._editor.RichText.prototype.execCommand.call(this.editor,"inserthtml","<br>");
}
}
return false;
}
var _5d2=true;
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
if(!_5c7.collapsed){
_5c7.deleteContents();
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
}
var _5d3=dijit.range.getBlockAncestor(_5c7.endContainer,null,this.editor.editNode);
var _5d4=_5d3.blockNode;
if((this._checkListLater=(_5d4&&(_5d4.nodeName=="LI"||_5d4.parentNode.nodeName=="LI")))){
if(dojo.isMoz){
this._pressedEnterInBlock=_5d4;
}
if(/^(\s|&nbsp;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|\xA0)<\/span>)?(<br>)?$/.test(_5d4.innerHTML)){
_5d4.innerHTML="";
if(dojo.isWebKit){
_5c8=dijit.range.create(this.editor.window);
_5c8.setStart(_5d4,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
}
this._checkListLater=false;
}
return true;
}
if(!_5d3.blockNode||_5d3.blockNode===this.editor.editNode){
try{
dijit._editor.RichText.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
}
catch(e2){
}
_5d3={blockNode:dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,[this.blockNodeForEnter]),blockContainer:this.editor.editNode};
if(_5d3.blockNode){
if(_5d3.blockNode!=this.editor.editNode&&(!(_5d3.blockNode.textContent||_5d3.blockNode.innerHTML).replace(/^\s+|\s+$/g,"").length)){
this.removeTrailingBr(_5d3.blockNode);
return false;
}
}else{
_5d3.blockNode=this.editor.editNode;
}
_5c6=dijit.range.getSelection(this.editor.window);
_5c7=_5c6.getRangeAt(0);
}
var _5d5=doc.createElement(this.blockNodeForEnter);
_5d5.innerHTML=this.bogusHtmlContent;
this.removeTrailingBr(_5d3.blockNode);
var _5d6=_5c7.endOffset;
var node=_5c7.endContainer;
if(node.length<_5d6){
var ret=this._adjustNodeAndOffset(node,_5d6);
node=ret.node;
_5d6=ret.offset;
}
if(dijit.range.atEndOfContainer(_5d3.blockNode,node,_5d6)){
if(_5d3.blockNode===_5d3.blockContainer){
_5d3.blockNode.appendChild(_5d5);
}else{
dojo.place(_5d5,_5d3.blockNode,"after");
}
_5d2=false;
_5c8=dijit.range.create(this.editor.window);
_5c8.setStart(_5d5,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
if(this.editor.height){
dojo.window.scrollIntoView(_5d5);
}
}else{
if(dijit.range.atBeginningOfContainer(_5d3.blockNode,_5c7.startContainer,_5c7.startOffset)){
dojo.place(_5d5,_5d3.blockNode,_5d3.blockNode===_5d3.blockContainer?"first":"before");
if(_5d5.nextSibling&&this.editor.height){
_5c8=dijit.range.create(this.editor.window);
_5c8.setStart(_5d5.nextSibling,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
dojo.window.scrollIntoView(_5d5.nextSibling);
}
_5d2=false;
}else{
if(_5d3.blockNode===_5d3.blockContainer){
_5d3.blockNode.appendChild(_5d5);
}else{
dojo.place(_5d5,_5d3.blockNode,"after");
}
_5d2=false;
if(_5d3.blockNode.style){
if(_5d5.style){
if(_5d3.blockNode.style.cssText){
_5d5.style.cssText=_5d3.blockNode.style.cssText;
}
}
}
rs=_5c7.startContainer;
var _5d7;
if(rs&&rs.nodeType==3){
var _5d8,_5d9;
_5d6=_5c7.endOffset;
if(rs.length<_5d6){
ret=this._adjustNodeAndOffset(rs,_5d6);
rs=ret.node;
_5d6=ret.offset;
}
txt=rs.nodeValue;
_5c9=doc.createTextNode(txt.substring(0,_5d6));
_5ca=doc.createTextNode(txt.substring(_5d6,txt.length));
dojo.place(_5c9,rs,"before");
dojo.place(_5ca,rs,"after");
dojo.destroy(rs);
var _5da=_5c9.parentNode;
while(_5da!==_5d3.blockNode){
var tg=_5da.tagName;
var _5db=doc.createElement(tg);
if(_5da.style){
if(_5db.style){
if(_5da.style.cssText){
_5db.style.cssText=_5da.style.cssText;
}
}
}
if(_5da.tagName==="FONT"){
if(_5da.color){
_5db.color=_5da.color;
}
if(_5da.face){
_5db.face=_5da.face;
}
if(_5da.size){
_5db.size=_5da.size;
}
}
_5d8=_5ca;
while(_5d8){
_5d9=_5d8.nextSibling;
_5db.appendChild(_5d8);
_5d8=_5d9;
}
dojo.place(_5db,_5da,"after");
_5c9=_5da;
_5ca=_5db;
_5da=_5da.parentNode;
}
_5d8=_5ca;
if(_5d8.nodeType==1||(_5d8.nodeType==3&&_5d8.nodeValue)){
_5d5.innerHTML="";
}
_5d7=_5d8;
while(_5d8){
_5d9=_5d8.nextSibling;
_5d5.appendChild(_5d8);
_5d8=_5d9;
}
}
_5c8=dijit.range.create(this.editor.window);
var _5dc;
var _5dd=_5d7;
if(this.blockNodeForEnter!=="BR"){
while(_5dd){
_5dc=_5dd;
_5d9=_5dd.firstChild;
_5dd=_5d9;
}
if(_5dc&&_5dc.parentNode){
_5d5=_5dc.parentNode;
_5c8.setStart(_5d5,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
if(this.editor.height){
dijit.scrollIntoView(_5d5);
}
if(dojo.isMoz){
this._pressedEnterInBlock=_5d3.blockNode;
}
}else{
_5d2=true;
}
}else{
_5c8.setStart(_5d5,0);
_5c6.removeAllRanges();
_5c6.addRange(_5c8);
if(this.editor.height){
dijit.scrollIntoView(_5d5);
}
if(dojo.isMoz){
this._pressedEnterInBlock=_5d3.blockNode;
}
}
}
}
return _5d2;
},_adjustNodeAndOffset:function(node,_5de){
while(node.length<_5de&&node.nextSibling&&node.nextSibling.nodeType==3){
_5de=_5de-node.length;
node=node.nextSibling;
}
var ret={"node":node,"offset":_5de};
return ret;
},removeTrailingBr:function(_5df){
var para=/P|DIV|LI/i.test(_5df.tagName)?_5df:dijit._editor.selection.getParentOfType(_5df,["P","DIV","LI"]);
if(!para){
return;
}
if(para.lastChild){
if((para.childNodes.length>1&&para.lastChild.nodeType==3&&/^[\s\xAD]*$/.test(para.lastChild.nodeValue))||para.lastChild.tagName=="BR"){
dojo.destroy(para.lastChild);
}
}
if(!para.childNodes.length){
para.innerHTML=this.bogusHtmlContent;
}
}});
}
if(!dojo._hasResource["dijit.Editor"]){
dojo._hasResource["dijit.Editor"]=true;
dojo.provide("dijit.Editor");
dojo.declare("dijit.Editor",dijit._editor.RichText,{plugins:null,extraPlugins:null,constructor:function(){
if(!dojo.isArray(this.plugins)){
this.plugins=["undo","redo","|","cut","copy","paste","|","bold","italic","underline","strikethrough","|","insertOrderedList","insertUnorderedList","indent","outdent","|","justifyLeft","justifyRight","justifyCenter","justifyFull","dijit._editor.plugins.EnterKeyHandling"];
}
this._plugins=[];
this._editInterval=this.editActionInterval*1000;
if(dojo.isIE){
this.events.push("onBeforeDeactivate");
this.events.push("onBeforeActivate");
}
},postMixInProperties:function(){
this.setValueDeferred=new dojo.Deferred();
this.inherited(arguments);
},postCreate:function(){
this._steps=this._steps.slice(0);
this._undoedSteps=this._undoedSteps.slice(0);
if(dojo.isArray(this.extraPlugins)){
this.plugins=this.plugins.concat(this.extraPlugins);
}
this.inherited(arguments);
this.commands=dojo.i18n.getLocalization("dijit._editor","commands",this.lang);
if(!this.toolbar){
this.toolbar=new dijit.Toolbar({dir:this.dir,lang:this.lang});
this.header.appendChild(this.toolbar.domNode);
}
dojo.forEach(this.plugins,this.addPlugin,this);
this.setValueDeferred.callback(true);
dojo.addClass(this.iframe.parentNode,"dijitEditorIFrameContainer");
dojo.addClass(this.iframe,"dijitEditorIFrame");
dojo.attr(this.iframe,"allowTransparency",true);
if(dojo.isWebKit){
dojo.style(this.domNode,"KhtmlUserSelect","none");
}
this.toolbar.startup();
this.onNormalizedDisplayChanged();
},destroy:function(){
dojo.forEach(this._plugins,function(p){
if(p&&p.destroy){
p.destroy();
}
});
this._plugins=[];
this.toolbar.destroyRecursive();
delete this.toolbar;
this.inherited(arguments);
},addPlugin:function(_5e0,_5e1){
var args=dojo.isString(_5e0)?{name:_5e0}:_5e0;
if(!args.setEditor){
var o={"args":args,"plugin":null,"editor":this};
dojo.publish(dijit._scopeName+".Editor.getPlugin",[o]);
if(!o.plugin){
var pc=dojo.getObject(args.name);
if(pc){
o.plugin=new pc(args);
}
}
if(!o.plugin){
console.warn("Cannot find plugin",_5e0);
return;
}
_5e0=o.plugin;
}
if(arguments.length>1){
this._plugins[_5e1]=_5e0;
}else{
this._plugins.push(_5e0);
}
_5e0.setEditor(this);
if(dojo.isFunction(_5e0.setToolbar)){
_5e0.setToolbar(this.toolbar);
}
},startup:function(){
},resize:function(size){
if(size){
dijit.layout._LayoutWidget.prototype.resize.apply(this,arguments);
}
},layout:function(){
var _5e2=(this._contentBox.h-(this.getHeaderHeight()+this.getFooterHeight()+dojo._getPadBorderExtents(this.iframe.parentNode).h+dojo._getMarginExtents(this.iframe.parentNode).h));
this.editingArea.style.height=_5e2+"px";
if(this.iframe){
this.iframe.style.height="100%";
}
this._layoutMode=true;
},_onIEMouseDown:function(e){
var _5e3;
var b=this.document.body;
var _5e4=b.clientWidth;
var _5e5=b.clientHeight;
var _5e6=b.clientLeft;
var _5e7=b.offsetWidth;
var _5e8=b.offsetHeight;
var _5e9=b.offsetLeft;
bodyDir=b.dir?b.dir.toLowerCase():"";
if(bodyDir!="rtl"){
if(_5e4<_5e7&&e.x>_5e4&&e.x<_5e7){
_5e3=true;
}
}else{
if(e.x<_5e6&&e.x>_5e9){
_5e3=true;
}
}
if(!_5e3){
if(_5e5<_5e8&&e.y>_5e5&&e.y<_5e8){
_5e3=true;
}
}
if(!_5e3){
delete this._cursorToStart;
delete this._savedSelection;
if(e.target.tagName=="BODY"){
setTimeout(dojo.hitch(this,"placeCursorAtEnd"),0);
}
this.inherited(arguments);
}
},onBeforeActivate:function(e){
this._restoreSelection();
},onBeforeDeactivate:function(e){
if(this.customUndo){
this.endEditing(true);
}
if(e.target.tagName!="BODY"){
this._saveSelection();
}
},customUndo:true,editActionInterval:3,beginEditing:function(cmd){
if(!this._inEditing){
this._inEditing=true;
this._beginEditing(cmd);
}
if(this.editActionInterval>0){
if(this._editTimer){
clearTimeout(this._editTimer);
}
this._editTimer=setTimeout(dojo.hitch(this,this.endEditing),this._editInterval);
}
},_steps:[],_undoedSteps:[],execCommand:function(cmd){
if(this.customUndo&&(cmd=="undo"||cmd=="redo")){
return this[cmd]();
}else{
if(this.customUndo){
this.endEditing();
this._beginEditing();
}
var r;
var _5ea=/copy|cut|paste/.test(cmd);
try{
r=this.inherited(arguments);
if(dojo.isWebKit&&_5ea&&!r){
throw {code:1011};
}
}
catch(e){
if(e.code==1011&&_5ea){
var sub=dojo.string.substitute,_5eb={cut:"X",copy:"C",paste:"V"};
alert(sub(this.commands.systemShortcut,[this.commands[cmd],sub(this.commands[dojo.isMac?"appleKey":"ctrlKey"],[_5eb[cmd]])]));
}
r=false;
}
if(this.customUndo){
this._endEditing();
}
return r;
}
},queryCommandEnabled:function(cmd){
if(this.customUndo&&(cmd=="undo"||cmd=="redo")){
return cmd=="undo"?(this._steps.length>1):(this._undoedSteps.length>0);
}else{
return this.inherited(arguments);
}
},_moveToBookmark:function(b){
var _5ec=b.mark;
var mark=b.mark;
var col=b.isCollapsed;
var r,_5ed,_5ee,sel;
if(mark){
if(dojo.isIE<9){
if(dojo.isArray(mark)){
_5ec=[];
dojo.forEach(mark,function(n){
_5ec.push(dijit.range.getNode(n,this.editNode));
},this);
dojo.withGlobal(this.window,"moveToBookmark",dijit,[{mark:_5ec,isCollapsed:col}]);
}else{
if(mark.startContainer&&mark.endContainer){
sel=dijit.range.getSelection(this.window);
if(sel&&sel.removeAllRanges){
sel.removeAllRanges();
r=dijit.range.create(this.window);
_5ed=dijit.range.getNode(mark.startContainer,this.editNode);
_5ee=dijit.range.getNode(mark.endContainer,this.editNode);
if(_5ed&&_5ee){
r.setStart(_5ed,mark.startOffset);
r.setEnd(_5ee,mark.endOffset);
sel.addRange(r);
}
}
}
}
}else{
sel=dijit.range.getSelection(this.window);
if(sel&&sel.removeAllRanges){
sel.removeAllRanges();
r=dijit.range.create(this.window);
_5ed=dijit.range.getNode(mark.startContainer,this.editNode);
_5ee=dijit.range.getNode(mark.endContainer,this.editNode);
if(_5ed&&_5ee){
r.setStart(_5ed,mark.startOffset);
r.setEnd(_5ee,mark.endOffset);
sel.addRange(r);
}
}
}
}
},_changeToStep:function(from,to){
this.setValue(to.text);
var b=to.bookmark;
if(!b){
return;
}
this._moveToBookmark(b);
},undo:function(){
var ret=false;
if(!this._undoRedoActive){
this._undoRedoActive=true;
this.endEditing(true);
var s=this._steps.pop();
if(s&&this._steps.length>0){
this.focus();
this._changeToStep(s,this._steps[this._steps.length-1]);
this._undoedSteps.push(s);
this.onDisplayChanged();
delete this._undoRedoActive;
ret=true;
}
delete this._undoRedoActive;
}
return ret;
},redo:function(){
var ret=false;
if(!this._undoRedoActive){
this._undoRedoActive=true;
this.endEditing(true);
var s=this._undoedSteps.pop();
if(s&&this._steps.length>0){
this.focus();
this._changeToStep(this._steps[this._steps.length-1],s);
this._steps.push(s);
this.onDisplayChanged();
ret=true;
}
delete this._undoRedoActive;
}
return ret;
},endEditing:function(_5ef){
if(this._editTimer){
clearTimeout(this._editTimer);
}
if(this._inEditing){
this._endEditing(_5ef);
this._inEditing=false;
}
},_getBookmark:function(){
var b=dojo.withGlobal(this.window,dijit.getBookmark);
var tmp=[];
if(b&&b.mark){
var mark=b.mark;
if(dojo.isIE<9){
var sel=dijit.range.getSelection(this.window);
if(!dojo.isArray(mark)){
if(sel){
var _5f0;
if(sel.rangeCount){
_5f0=sel.getRangeAt(0);
}
if(_5f0){
b.mark=_5f0.cloneRange();
}else{
b.mark=dojo.withGlobal(this.window,dijit.getBookmark);
}
}
}else{
dojo.forEach(b.mark,function(n){
tmp.push(dijit.range.getIndex(n,this.editNode).o);
},this);
b.mark=tmp;
}
}
try{
if(b.mark&&b.mark.startContainer){
tmp=dijit.range.getIndex(b.mark.startContainer,this.editNode).o;
b.mark={startContainer:tmp,startOffset:b.mark.startOffset,endContainer:b.mark.endContainer===b.mark.startContainer?tmp:dijit.range.getIndex(b.mark.endContainer,this.editNode).o,endOffset:b.mark.endOffset};
}
}
catch(e){
b.mark=null;
}
}
return b;
},_beginEditing:function(cmd){
if(this._steps.length===0){
this._steps.push({"text":dijit._editor.getChildrenHtml(this.editNode),"bookmark":this._getBookmark()});
}
},_endEditing:function(_5f1){
var v=dijit._editor.getChildrenHtml(this.editNode);
this._undoedSteps=[];
this._steps.push({text:v,bookmark:this._getBookmark()});
},onKeyDown:function(e){
if(!dojo.isIE&&!this.iframe&&e.keyCode==dojo.keys.TAB&&!this.tabIndent){
this._saveSelection();
}
if(!this.customUndo){
this.inherited(arguments);
return;
}
var k=e.keyCode,ks=dojo.keys;
if(e.ctrlKey&&!e.altKey){
if(k==90||k==122){
dojo.stopEvent(e);
this.undo();
return;
}else{
if(k==89||k==121){
dojo.stopEvent(e);
this.redo();
return;
}
}
}
this.inherited(arguments);
switch(k){
case ks.ENTER:
case ks.BACKSPACE:
case ks.DELETE:
this.beginEditing();
break;
case 88:
case 86:
if(e.ctrlKey&&!e.altKey&&!e.metaKey){
this.endEditing();
if(e.keyCode==88){
this.beginEditing("cut");
setTimeout(dojo.hitch(this,this.endEditing),1);
}else{
this.beginEditing("paste");
setTimeout(dojo.hitch(this,this.endEditing),1);
}
break;
}
default:
if(!e.ctrlKey&&!e.altKey&&!e.metaKey&&(e.keyCode<dojo.keys.F1||e.keyCode>dojo.keys.F15)){
this.beginEditing();
break;
}
case ks.ALT:
this.endEditing();
break;
case ks.UP_ARROW:
case ks.DOWN_ARROW:
case ks.LEFT_ARROW:
case ks.RIGHT_ARROW:
case ks.HOME:
case ks.END:
case ks.PAGE_UP:
case ks.PAGE_DOWN:
this.endEditing(true);
break;
case ks.CTRL:
case ks.SHIFT:
case ks.TAB:
break;
}
},_onBlur:function(){
this.inherited(arguments);
this.endEditing(true);
},_saveSelection:function(){
try{
this._savedSelection=this._getBookmark();
}
catch(e){
}
},_restoreSelection:function(){
if(this._savedSelection){
delete this._cursorToStart;
if(dojo.withGlobal(this.window,"isCollapsed",dijit)){
this._moveToBookmark(this._savedSelection);
}
delete this._savedSelection;
}
},onClick:function(){
this.endEditing(true);
this.inherited(arguments);
},replaceValue:function(html){
if(!this.customUndo){
this.inherited(arguments);
}else{
if(this.isClosed){
this.setValue(html);
}else{
this.beginEditing();
if(!html){
html="&nbsp;";
}
this.setValue(html);
this.endEditing();
}
}
},_setDisabledAttr:function(_5f2){
var _5f3=dojo.hitch(this,function(){
if((!this.disabled&&_5f2)||(!this._buttonEnabledPlugins&&_5f2)){
dojo.forEach(this._plugins,function(p){
p.set("disabled",true);
});
}else{
if(this.disabled&&!_5f2){
dojo.forEach(this._plugins,function(p){
p.set("disabled",false);
});
}
}
});
this.setValueDeferred.addCallback(_5f3);
this.inherited(arguments);
},_setStateClass:function(){
try{
this.inherited(arguments);
if(this.document&&this.document.body){
dojo.style(this.document.body,"color",dojo.style(this.iframe,"color"));
}
}
catch(e){
}
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
var args=o.args,p;
var _5f4=dijit._editor._Plugin;
var name=args.name;
switch(name){
case "undo":
case "redo":
case "cut":
case "copy":
case "paste":
case "insertOrderedList":
case "insertUnorderedList":
case "indent":
case "outdent":
case "justifyCenter":
case "justifyFull":
case "justifyLeft":
case "justifyRight":
case "delete":
case "selectAll":
case "removeFormat":
case "unlink":
case "insertHorizontalRule":
p=new _5f4({command:name});
break;
case "bold":
case "italic":
case "underline":
case "strikethrough":
case "subscript":
case "superscript":
p=new _5f4({buttonClass:dijit.form.ToggleButton,command:name});
break;
case "|":
p=new _5f4({button:new dijit.ToolbarSeparator(),setEditor:function(_5f5){
this.editor=_5f5;
}});
}
o.plugin=p;
});
}
if(!dojo._hasResource["dojox.grid.cells.dijit"]){
dojo._hasResource["dojox.grid.cells.dijit"]=true;
dojo.provide("dojox.grid.cells.dijit");
(function(){
var dgc=dojox.grid.cells;
dojo.declare("dojox.grid.cells._Widget",dgc._Base,{widgetClass:dijit.form.TextBox,constructor:function(_5f6){
this.widget=null;
if(typeof this.widgetClass=="string"){
dojo.deprecated("Passing a string to widgetClass is deprecated","pass the widget class object instead","2.0");
this.widgetClass=dojo.getObject(this.widgetClass);
}
},formatEditing:function(_5f7,_5f8){
this.needFormatNode(_5f7,_5f8);
return "<div></div>";
},getValue:function(_5f9){
return this.widget.get("value");
},setValue:function(_5fa,_5fb){
if(this.widget&&this.widget.set){
if(this.widget.onLoadDeferred){
var self=this;
this.widget.onLoadDeferred.addCallback(function(){
self.widget.set("value",_5fb===null?"":_5fb);
});
}else{
this.widget.set("value",_5fb);
}
}else{
this.inherited(arguments);
}
},getWidgetProps:function(_5fc){
return dojo.mixin({dir:this.dir,lang:this.lang},this.widgetProps||{},{constraints:dojo.mixin({},this.constraint)||{},inGrid:true,value:_5fc});
},createWidget:function(_5fd,_5fe,_5ff){
return new this.widgetClass(this.getWidgetProps(_5fe),_5fd);
},attachWidget:function(_600,_601,_602){
_600.appendChild(this.widget.domNode);
this.setValue(_602,_601);
},formatNode:function(_603,_604,_605){
if(!this.widgetClass){
return _604;
}
if(!this.widget){
this.widget=this.createWidget.apply(this,arguments);
}else{
this.attachWidget.apply(this,arguments);
}
this.sizeWidget.apply(this,arguments);
this.grid.views.renormalizeRow(_605);
this.grid.scroller.rowHeightChanged(_605,true);
this.focus();
return undefined;
},sizeWidget:function(_606,_607,_608){
var p=this.getNode(_608),box=dojo.contentBox(p);
dojo.marginBox(this.widget.domNode,{w:box.w});
},focus:function(_609,_60a){
if(this.widget){
this.widget._message="";
setTimeout(dojo.hitch(this.widget,function(){
dojox.grid.util.fire(this,"focus");
}),0);
}
},_finish:function(_60b){
this.inherited(arguments);
dojox.grid.util.removeNode(this.widget.domNode);
if(dojo.isIE){
dojo.setSelectable(this.widget.domNode,true);
}
}});
dgc._Widget.markupFactory=function(node,cell){
dgc._Base.markupFactory(node,cell);
var d=dojo;
var _60c=d.trim(d.attr(node,"widgetProps")||"");
var _60d=d.trim(d.attr(node,"constraint")||"");
var _60e=d.trim(d.attr(node,"widgetClass")||"");
if(_60c){
cell.widgetProps=d.fromJson(_60c);
}
if(_60d){
cell.constraint=d.fromJson(_60d);
}
if(_60e){
cell.widgetClass=d.getObject(_60e);
}
};
dojo.declare("dojox.grid.cells.ComboBox",dgc._Widget,{widgetClass:dijit.form.ComboBox,getWidgetProps:function(_60f){
var _610=[];
dojo.forEach(this.options,function(o){
_610.push({name:o,value:o});
});
var _611=new dojo.data.ItemFileReadStore({data:{identifier:"name",items:_610}});
return dojo.mixin({},this.widgetProps||{},{value:_60f,store:_611});
},getValue:function(){
var e=this.widget;
e.set("displayedValue",e.get("displayedValue"));
return e.get("value");
}});
dgc.ComboBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
var d=dojo;
var _612=d.trim(d.attr(node,"options")||"");
if(_612){
var o=_612.split(",");
if(o[0]!=_612){
cell.options=o;
}
}
};
dojo.declare("dojox.grid.cells.DateTextBox",dgc._Widget,{widgetClass:dijit.form.DateTextBox,setValue:function(_613,_614){
if(this.widget){
this.widget.set("value",new Date(_614));
}else{
this.inherited(arguments);
}
},getWidgetProps:function(_615){
if(this.constraint){
if(typeof this.constraint.max=="number"){
this.constraint.max=new Date(this.constraint.max);
}
if(typeof this.constraint.min=="number"){
this.constraint.min=new Date(this.constraint.min);
}
}
return dojo.mixin(this.inherited(arguments),{value:new Date(_615)});
}});
dgc.DateTextBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.NumberTextBox",dgc._Widget,{widgetClass:dijit.form.NumberTextBox});
dgc.NumberTextBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.ValidationTextBox",dgc._Widget,{widgetClass:dijit.form.ValidationTextBox,getWidgetProps:function(_616){
var _617=this.inherited(arguments);
return _617;
},});
dgc.ValidationTextBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.TimeTextBox",dgc._Widget,{widgetClass:dijit.form.TimeTextBox});
dgc.TimeTextBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.CheckBox",dgc._Widget,{widgetClass:dijit.form.CheckBox,getValue:function(){
return this.widget.checked;
},setValue:function(_618,_619){
if(this.widget&&this.widget.attributeMap.checked){
this.widget.set("checked",_619);
}else{
this.inherited(arguments);
}
},sizeWidget:function(_61a,_61b,_61c){
return;
}});
dgc.CheckBox.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.Editor",dgc._Widget,{widgetClass:dijit.Editor,getWidgetProps:function(_61d){
return dojo.mixin({},this.widgetProps||{},{height:this.widgetHeight||"100px"});
},createWidget:function(_61e,_61f,_620){
var _621=new this.widgetClass(this.getWidgetProps(_61f),_61e);
dojo.connect(_621,"onLoad",dojo.hitch(this,"populateEditor"));
return _621;
},formatNode:function(_622,_623,_624){
this.content=_623;
this.inherited(arguments);
if(dojo.isMoz){
var e=this.widget;
e.open();
if(this.widgetToolbar){
dojo.place(e.toolbar.domNode,e.editingArea,"before");
}
}
},populateEditor:function(){
this.widget.set("value",this.content);
this.widget.placeCursorAtEnd();
}});
dgc.Editor.markupFactory=function(node,cell){
dgc._Widget.markupFactory(node,cell);
var d=dojo;
var h=dojo.trim(dojo.attr(node,"widgetHeight")||"");
if(h){
if((h!="auto")&&(h.substr(-2)!="em")){
h=parseInt(h,10)+"px";
}
cell.widgetHeight=h;
}
};
})();
}
if(!dojo._hasResource["dojo.data.ItemFileWriteStore"]){
dojo._hasResource["dojo.data.ItemFileWriteStore"]=true;
dojo.provide("dojo.data.ItemFileWriteStore");
dojo.declare("dojo.data.ItemFileWriteStore",dojo.data.ItemFileReadStore,{constructor:function(_625){
this._features["dojo.data.api.Write"]=true;
this._features["dojo.data.api.Notification"]=true;
this._pending={_newItems:{},_modifiedItems:{},_deletedItems:{}};
if(!this._datatypeMap["Date"].serialize){
this._datatypeMap["Date"].serialize=function(obj){
return dojo.date.stamp.toISOString(obj,{zulu:true});
};
}
if(_625&&(_625.referenceIntegrity===false)){
this.referenceIntegrity=false;
}
this._saveInProgress=false;
},referenceIntegrity:true,_assert:function(_626){
if(!_626){
throw new Error("assertion failed in ItemFileWriteStore");
}
},_getIdentifierAttribute:function(){
var _627=this.getFeatures()["dojo.data.api.Identity"];
return _627;
},newItem:function(_628,_629){
this._assert(!this._saveInProgress);
if(!this._loadFinished){
this._forceLoad();
}
if(typeof _628!="object"&&typeof _628!="undefined"){
throw new Error("newItem() was passed something other than an object");
}
var _62a=null;
var _62b=this._getIdentifierAttribute();
if(_62b===Number){
_62a=this._arrayOfAllItems.length;
}else{
_62a=_628[_62b];
if(typeof _62a==="undefined"){
throw new Error("newItem() was not passed an identity for the new item");
}
if(dojo.isArray(_62a)){
throw new Error("newItem() was not passed an single-valued identity");
}
}
if(this._itemsByIdentity){
this._assert(typeof this._itemsByIdentity[_62a]==="undefined");
}
this._assert(typeof this._pending._newItems[_62a]==="undefined");
this._assert(typeof this._pending._deletedItems[_62a]==="undefined");
var _62c={};
_62c[this._storeRefPropName]=this;
_62c[this._itemNumPropName]=this._arrayOfAllItems.length;
if(this._itemsByIdentity){
this._itemsByIdentity[_62a]=_62c;
_62c[_62b]=[_62a];
}
this._arrayOfAllItems.push(_62c);
var _62d=null;
if(_629&&_629.parent&&_629.attribute){
_62d={item:_629.parent,attribute:_629.attribute,oldValue:undefined};
var _62e=this.getValues(_629.parent,_629.attribute);
if(_62e&&_62e.length>0){
var _62f=_62e.slice(0,_62e.length);
if(_62e.length===1){
_62d.oldValue=_62e[0];
}else{
_62d.oldValue=_62e.slice(0,_62e.length);
}
_62f.push(_62c);
this._setValueOrValues(_629.parent,_629.attribute,_62f,false);
_62d.newValue=this.getValues(_629.parent,_629.attribute);
}else{
this._setValueOrValues(_629.parent,_629.attribute,_62c,false);
_62d.newValue=_62c;
}
}else{
_62c[this._rootItemPropName]=true;
this._arrayOfTopLevelItems.push(_62c);
}
this._pending._newItems[_62a]=_62c;
for(var key in _628){
if(key===this._storeRefPropName||key===this._itemNumPropName){
throw new Error("encountered bug in ItemFileWriteStore.newItem");
}
var _630=_628[key];
if(!dojo.isArray(_630)){
_630=[_630];
}
_62c[key]=_630;
if(this.referenceIntegrity){
for(var i=0;i<_630.length;i++){
var val=_630[i];
if(this.isItem(val)){
this._addReferenceToMap(val,_62c,key);
}
}
}
}
this.onNew(_62c,_62d);
return _62c;
},_removeArrayElement:function(_631,_632){
var _633=dojo.indexOf(_631,_632);
if(_633!=-1){
_631.splice(_633,1);
return true;
}
return false;
},deleteItem:function(item){
this._assert(!this._saveInProgress);
this._assertIsItem(item);
var _634=item[this._itemNumPropName];
var _635=this.getIdentity(item);
if(this.referenceIntegrity){
var _636=this.getAttributes(item);
if(item[this._reverseRefMap]){
item["backup_"+this._reverseRefMap]=dojo.clone(item[this._reverseRefMap]);
}
dojo.forEach(_636,function(_637){
dojo.forEach(this.getValues(item,_637),function(_638){
if(this.isItem(_638)){
if(!item["backupRefs_"+this._reverseRefMap]){
item["backupRefs_"+this._reverseRefMap]=[];
}
item["backupRefs_"+this._reverseRefMap].push({id:this.getIdentity(_638),attr:_637});
this._removeReferenceFromMap(_638,item,_637);
}
},this);
},this);
var _639=item[this._reverseRefMap];
if(_639){
for(var _63a in _639){
var _63b=null;
if(this._itemsByIdentity){
_63b=this._itemsByIdentity[_63a];
}else{
_63b=this._arrayOfAllItems[_63a];
}
if(_63b){
for(var _63c in _639[_63a]){
var _63d=this.getValues(_63b,_63c)||[];
var _63e=dojo.filter(_63d,function(_63f){
return !(this.isItem(_63f)&&this.getIdentity(_63f)==_635);
},this);
this._removeReferenceFromMap(item,_63b,_63c);
if(_63e.length<_63d.length){
this._setValueOrValues(_63b,_63c,_63e,true);
}
}
}
}
}
}
this._arrayOfAllItems[_634]=null;
item[this._storeRefPropName]=null;
if(this._itemsByIdentity){
delete this._itemsByIdentity[_635];
}
this._pending._deletedItems[_635]=item;
if(item[this._rootItemPropName]){
this._removeArrayElement(this._arrayOfTopLevelItems,item);
}
this.onDelete(item);
return true;
},setValue:function(item,_640,_641){
return this._setValueOrValues(item,_640,_641,true);
},setValues:function(item,_642,_643){
return this._setValueOrValues(item,_642,_643,true);
},unsetAttribute:function(item,_644){
return this._setValueOrValues(item,_644,[],true);
},_setValueOrValues:function(item,_645,_646,_647){
this._assert(!this._saveInProgress);
this._assertIsItem(item);
this._assert(dojo.isString(_645));
this._assert(typeof _646!=="undefined");
var _648=this._getIdentifierAttribute();
if(_645==_648){
throw new Error("ItemFileWriteStore does not have support for changing the value of an item's identifier.");
}
var _649=this._getValueOrValues(item,_645);
var _64a=this.getIdentity(item);
if(!this._pending._modifiedItems[_64a]){
var _64b={};
for(var key in item){
if((key===this._storeRefPropName)||(key===this._itemNumPropName)||(key===this._rootItemPropName)){
_64b[key]=item[key];
}else{
if(key===this._reverseRefMap){
_64b[key]=dojo.clone(item[key]);
}else{
_64b[key]=item[key].slice(0,item[key].length);
}
}
}
this._pending._modifiedItems[_64a]=_64b;
}
var _64c=false;
if(dojo.isArray(_646)&&_646.length===0){
_64c=delete item[_645];
_646=undefined;
if(this.referenceIntegrity&&_649){
var _64d=_649;
if(!dojo.isArray(_64d)){
_64d=[_64d];
}
for(var i=0;i<_64d.length;i++){
var _64e=_64d[i];
if(this.isItem(_64e)){
this._removeReferenceFromMap(_64e,item,_645);
}
}
}
}else{
var _64f;
if(dojo.isArray(_646)){
var _650=_646;
_64f=_646.slice(0,_646.length);
}else{
_64f=[_646];
}
if(this.referenceIntegrity){
if(_649){
var _64d=_649;
if(!dojo.isArray(_64d)){
_64d=[_64d];
}
var map={};
dojo.forEach(_64d,function(_651){
if(this.isItem(_651)){
var id=this.getIdentity(_651);
map[id.toString()]=true;
}
},this);
dojo.forEach(_64f,function(_652){
if(this.isItem(_652)){
var id=this.getIdentity(_652);
if(map[id.toString()]){
delete map[id.toString()];
}else{
this._addReferenceToMap(_652,item,_645);
}
}
},this);
for(var rId in map){
var _653;
if(this._itemsByIdentity){
_653=this._itemsByIdentity[rId];
}else{
_653=this._arrayOfAllItems[rId];
}
this._removeReferenceFromMap(_653,item,_645);
}
}else{
for(var i=0;i<_64f.length;i++){
var _64e=_64f[i];
if(this.isItem(_64e)){
this._addReferenceToMap(_64e,item,_645);
}
}
}
}
var _654=item;
var _655=_645.split(/\./);
while(_654&&_655.length>1){
_654=_654[_655[0]];
_655.shift();
if(_654){
_654=_654[0];
}
}
if(_654){
_654[_655[0]]=_64f;
}else{
item[_645]=_64f;
}
_64c=true;
}
if(_647){
this.onSet(item,_645,_649,_646);
}
return _64c;
},_addReferenceToMap:function(_656,_657,_658){
var _659=this.getIdentity(_657);
var _65a=_656[this._reverseRefMap];
if(!_65a){
_65a=_656[this._reverseRefMap]={};
}
var _65b=_65a[_659];
if(!_65b){
_65b=_65a[_659]={};
}
_65b[_658]=true;
},_removeReferenceFromMap:function(_65c,_65d,_65e){
var _65f=this.getIdentity(_65d);
var _660=_65c[this._reverseRefMap];
var _661;
if(_660){
for(_661 in _660){
if(_661==_65f){
delete _660[_661][_65e];
if(this._isEmpty(_660[_661])){
delete _660[_661];
}
}
}
if(this._isEmpty(_660)){
delete _65c[this._reverseRefMap];
}
}
},_dumpReferenceMap:function(){
var i;
for(i=0;i<this._arrayOfAllItems.length;i++){
var item=this._arrayOfAllItems[i];
if(item&&item[this._reverseRefMap]){
}
}
},_getValueOrValues:function(item,_662){
var _663=undefined;
if(this.hasAttribute(item,_662)){
var _664=this.getValues(item,_662);
if(_664.length==1){
_663=_664[0];
}else{
_663=_664;
}
}
return _663;
},_flatten:function(_665){
if(this.isItem(_665)){
var item=_665;
var _666=this.getIdentity(item);
var _667={_reference:_666};
return _667;
}else{
if(typeof _665==="object"){
for(var type in this._datatypeMap){
var _668=this._datatypeMap[type];
if(dojo.isObject(_668)&&!dojo.isFunction(_668)){
if(_665 instanceof _668.type){
if(!_668.serialize){
throw new Error("ItemFileWriteStore:  No serializer defined for type mapping: ["+type+"]");
}
return {_type:type,_value:_668.serialize(_665)};
}
}else{
if(_665 instanceof _668){
return {_type:type,_value:_665.toString()};
}
}
}
}
return _665;
}
},_getNewFileContentString:function(){
var _669={};
var _66a=this._getIdentifierAttribute();
if(_66a!==Number){
_669.identifier=_66a;
}
if(this._labelAttr){
_669.label=this._labelAttr;
}
_669.items=[];
for(var i=0;i<this._arrayOfAllItems.length;++i){
var item=this._arrayOfAllItems[i];
if(item!==null){
var _66b={};
for(var key in item){
if(key!==this._storeRefPropName&&key!==this._itemNumPropName&&key!==this._reverseRefMap&&key!==this._rootItemPropName){
var _66c=key;
var _66d=this.getValues(item,_66c);
if(_66d.length==1){
_66b[_66c]=this._flatten(_66d[0]);
}else{
var _66e=[];
for(var j=0;j<_66d.length;++j){
_66e.push(this._flatten(_66d[j]));
_66b[_66c]=_66e;
}
}
}
}
_669.items.push(_66b);
}
}
var _66f=true;
return dojo.toJson(_669,_66f);
},_isEmpty:function(_670){
var _671=true;
if(dojo.isObject(_670)){
var i;
for(i in _670){
_671=false;
break;
}
}else{
if(dojo.isArray(_670)){
if(_670.length>0){
_671=false;
}
}
}
return _671;
},save:function(_672){
this._assert(!this._saveInProgress);
this._saveInProgress=true;
var self=this;
var _673=function(){
self._pending={_newItems:{},_modifiedItems:{},_deletedItems:{}};
self._saveInProgress=false;
if(_672&&_672.onComplete){
var _674=_672.scope||dojo.global;
_672.onComplete.call(_674);
}
};
var _675=function(err){
self._saveInProgress=false;
if(_672&&_672.onError){
var _676=_672.scope||dojo.global;
_672.onError.call(_676,err);
}
};
if(this._saveEverything){
var _677=this._getNewFileContentString();
this._saveEverything(_673,_675,_677);
}
if(this._saveCustom){
this._saveCustom(_673,_675);
}
if(!this._saveEverything&&!this._saveCustom){
_673();
}
},revert:function(){
this._assert(!this._saveInProgress);
var _678;
for(_678 in this._pending._modifiedItems){
var _679=this._pending._modifiedItems[_678];
var _67a=null;
if(this._itemsByIdentity){
_67a=this._itemsByIdentity[_678];
}else{
_67a=this._arrayOfAllItems[_678];
}
_679[this._storeRefPropName]=this;
for(key in _67a){
delete _67a[key];
}
dojo.mixin(_67a,_679);
}
var _67b;
for(_678 in this._pending._deletedItems){
_67b=this._pending._deletedItems[_678];
_67b[this._storeRefPropName]=this;
var _67c=_67b[this._itemNumPropName];
if(_67b["backup_"+this._reverseRefMap]){
_67b[this._reverseRefMap]=_67b["backup_"+this._reverseRefMap];
delete _67b["backup_"+this._reverseRefMap];
}
this._arrayOfAllItems[_67c]=_67b;
if(this._itemsByIdentity){
this._itemsByIdentity[_678]=_67b;
}
if(_67b[this._rootItemPropName]){
this._arrayOfTopLevelItems.push(_67b);
}
}
for(_678 in this._pending._deletedItems){
_67b=this._pending._deletedItems[_678];
if(_67b["backupRefs_"+this._reverseRefMap]){
dojo.forEach(_67b["backupRefs_"+this._reverseRefMap],function(_67d){
var _67e;
if(this._itemsByIdentity){
_67e=this._itemsByIdentity[_67d.id];
}else{
_67e=this._arrayOfAllItems[_67d.id];
}
this._addReferenceToMap(_67e,_67b,_67d.attr);
},this);
delete _67b["backupRefs_"+this._reverseRefMap];
}
}
for(_678 in this._pending._newItems){
var _67f=this._pending._newItems[_678];
_67f[this._storeRefPropName]=null;
this._arrayOfAllItems[_67f[this._itemNumPropName]]=null;
if(_67f[this._rootItemPropName]){
this._removeArrayElement(this._arrayOfTopLevelItems,_67f);
}
if(this._itemsByIdentity){
delete this._itemsByIdentity[_678];
}
}
this._pending={_newItems:{},_modifiedItems:{},_deletedItems:{}};
return true;
},isDirty:function(item){
if(item){
var _680=this.getIdentity(item);
return new Boolean(this._pending._newItems[_680]||this._pending._modifiedItems[_680]||this._pending._deletedItems[_680]).valueOf();
}else{
if(!this._isEmpty(this._pending._newItems)||!this._isEmpty(this._pending._modifiedItems)||!this._isEmpty(this._pending._deletedItems)){
return true;
}
return false;
}
},onSet:function(item,_681,_682,_683){
},onNew:function(_684,_685){
},onDelete:function(_686){
},close:function(_687){
if(this.clearOnClose){
if(!this.isDirty()){
this.inherited(arguments);
}else{
throw new Error("dojo.data.ItemFileWriteStore: There are unsaved changes present in the store.  Please save or revert the changes before invoking close.");
}
}
}});
}
if(!dojo._hasResource["dojox.grid._Selector"]){
dojo._hasResource["dojox.grid._Selector"]=true;
dojo.provide("dojox.grid._Selector");
(function(){
dojox.grid._InputSelectorHeaderBuilder=dojo.extend(function(view){
dojox.grid._HeaderBuilder.call(this,view);
},dojox.grid._HeaderBuilder.prototype,{generateHtml:function(){
var w=this.view.contentWidth||0;
var _688=this.view.grid.selection.getSelectedCount();
var _689=(_688&&_688==this.view.grid.rowCount)?" dijitCheckBoxChecked dijitChecked":"";
return "<table style=\"width:"+w+"px;\" "+"border=\"0\" cellspacing=\"0\" cellpadding=\"0\" "+"role=\"presentation\"><tr><th style=\"text-align: center;\">"+"<div class=\"dojoxGridCheckSelector dijitReset dijitInline dijitCheckBox"+_689+"\"></div></th></tr></table>";
},doclick:function(e){
var _68a=this.view.grid.selection.getSelectedCount();
this.view._selectionChanging=true;
if(_68a==this.view.grid.rowCount){
this.view.grid.selection.deselectAll();
}else{
this.view.grid.selection.selectRange(0,this.view.grid.rowCount-1);
}
this.view._selectionChanging=false;
this.view.onSelectionChanged();
return true;
}});
dojox.grid._SelectorContentBuilder=dojo.extend(function(view){
dojox.grid._ContentBuilder.call(this,view);
},dojox.grid._ContentBuilder.prototype,{generateHtml:function(_68b,_68c){
var w=this.view.contentWidth||0;
return "<table class=\"dojoxGridRowbarTable\" style=\"width:"+w+"px;\" border=\"0\" "+"cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\"><tr>"+"<td  style=\"text-align: center;\" class=\"dojoxGridRowbarInner\">"+this.getCellContent(_68c)+"</td></tr></table>";
},getCellContent:function(_68d){
return "&nbsp;";
},findTarget:function(){
var t=dojox.grid._ContentBuilder.prototype.findTarget.apply(this,arguments);
return t;
},domouseover:function(e){
this.view.grid.onMouseOverRow(e);
},domouseout:function(e){
if(!this.isIntraRowEvent(e)){
this.view.grid.onMouseOutRow(e);
}
},doclick:function(e){
var idx=e.rowIndex;
var _68e=this.view.grid.selection.isSelected(idx);
var mode=this.view.grid.selection.mode;
if(!_68e){
if(mode=="single"){
this.view.grid.selection.select(idx);
}else{
if(mode!="none"){
this.view.grid.selection.addToSelection(idx);
}
}
}else{
this.view.grid.selection.deselect(idx);
}
return true;
}});
dojox.grid._InputSelectorContentBuilder=dojo.extend(function(view){
dojox.grid._SelectorContentBuilder.call(this,view);
},dojox.grid._SelectorContentBuilder.prototype,{getCellContent:function(_68f){
var v=this.view;
var type=v.inputType=="checkbox"?"CheckBox":"Radio";
var _690=!!v.grid.selection.isSelected(_68f)?" dijit"+type+"Checked dijitChecked":"";
return "<div class=\"dojoxGridCheckSelector dijitReset dijitInline dijit"+type+_690+"\"></div>";
}});
dojo.declare("dojox.grid._Selector",dojox.grid._View,{inputType:"",selectionMode:"",defaultWidth:"2em",noscroll:true,padBorderWidth:2,_contentBuilderClass:dojox.grid._SelectorContentBuilder,postCreate:function(){
this.inherited(arguments);
if(this.selectionMode){
this.grid.selection.mode=this.selectionMode;
}
this.connect(this.grid.selection,"onSelected","onSelected");
this.connect(this.grid.selection,"onDeselected","onDeselected");
},buildRendering:function(){
this.inherited(arguments);
this.scrollboxNode.style.overflow="hidden";
},getWidth:function(){
return this.viewWidth||this.defaultWidth;
},resize:function(){
this.adaptHeight();
},setStructure:function(s){
this.inherited(arguments);
if(s.defaultWidth){
this.defaultWidth=s.defaultWidth;
}
},adaptWidth:function(){
if(!("contentWidth" in this)&&this.contentNode){
this.contentWidth=this.contentNode.offsetWidth-this.padBorderWidth;
}
},doStyleRowNode:function(_691,_692){
var n=["dojoxGridRowbar dojoxGridNonNormalizedCell"];
if(this.grid.rows.isOver(_691)){
n.push("dojoxGridRowbarOver");
}
if(this.grid.selection.isSelected(_691)){
n.push("dojoxGridRowbarSelected");
}
_692.className=n.join(" ");
},onSelected:function(_693){
this.grid.updateRow(_693);
},onDeselected:function(_694){
this.grid.updateRow(_694);
}});
if(!dojox.grid._View.prototype._headerBuilderClass&&!dojox.grid._View.prototype._contentBuilderClass){
dojox.grid._Selector.prototype.postCreate=function(){
this.connect(this.scrollboxNode,"onscroll","doscroll");
dojox.grid.util.funnelEvents(this.contentNode,this,"doContentEvent",["mouseover","mouseout","click","dblclick","contextmenu","mousedown"]);
dojox.grid.util.funnelEvents(this.headerNode,this,"doHeaderEvent",["dblclick","mouseover","mouseout","mousemove","mousedown","click","contextmenu"]);
if(this._contentBuilderClass){
this.content=new this._contentBuilderClass(this);
}else{
this.content=new dojox.grid._ContentBuilder(this);
}
if(this._headerBuilderClass){
this.header=new this._headerBuilderClass(this);
}else{
this.header=new dojox.grid._HeaderBuilder(this);
}
if(!dojo._isBodyLtr()){
this.headerNodeContainer.style.width="";
}
this.connect(this.grid.selection,"onSelected","onSelected");
this.connect(this.grid.selection,"onDeselected","onDeselected");
};
}
dojo.declare("dojox.grid._RadioSelector",dojox.grid._Selector,{inputType:"radio",selectionMode:"single",_contentBuilderClass:dojox.grid._InputSelectorContentBuilder,buildRendering:function(){
this.inherited(arguments);
this.headerNode.style.visibility="hidden";
},renderHeader:function(){
}});
dojo.declare("dojox.grid._CheckBoxSelector",dojox.grid._Selector,{inputType:"checkbox",_headerBuilderClass:dojox.grid._InputSelectorHeaderBuilder,_contentBuilderClass:dojox.grid._InputSelectorContentBuilder,postCreate:function(){
this.inherited(arguments);
this.connect(this.grid,"onSelectionChanged","onSelectionChanged");
this.connect(this.grid,"updateRowCount","_updateVisibility");
},renderHeader:function(){
this.inherited(arguments);
this._updateVisibility(this.grid.rowCount);
},_updateVisibility:function(_695){
this.headerNode.style.visibility=_695?"":"hidden";
},onSelectionChanged:function(){
if(this._selectionChanging){
return;
}
var _696=dojo.query(".dojoxGridCheckSelector",this.headerNode)[0];
var g=this.grid;
var s=(g.rowCount&&g.rowCount==g.selection.getSelectedCount());
g.allItemsSelected=s||false;
dojo.toggleClass(_696,"dijitChecked",g.allItemsSelected);
dojo.toggleClass(_696,"dijitCheckBoxChecked",g.allItemsSelected);
}});
})();
}
if(!dojo._hasResource["dojox.grid._CheckBoxSelector"]){
dojo._hasResource["dojox.grid._CheckBoxSelector"]=true;
dojo.provide("dojox.grid._CheckBoxSelector");
}
if(!dojo._hasResource["dojox.grid._RadioSelector"]){
dojo._hasResource["dojox.grid._RadioSelector"]=true;
dojo.provide("dojox.grid._RadioSelector");
}
if(!dojo._hasResource["wm.base.lib.currencyMappings"]){
dojo._hasResource["wm.base.lib.currencyMappings"]=true;
dojo.provide("wm.base.lib.currencyMappings");
wm.currencyMap={"ar":"","ca":"","cs":"","da":"","de-de":"","el":"","en-gb":"","en-us":"USD","es-es":"","fi-fi":"","fr-fr":"","he-il":"","hu":"","it-it":"","ja-jp":"","ko-kr":"","nl-nl":"","nb":"","pl":"","pt-br":"","pt-pt":"","ru":"","sk":"","sl":"","sv":"","th":"","tr":"","zh-tw":"","zh-cn":""};
wm.getLocaleCurrency=function(){
var code=wm.currencyMap[dojo.locale];
if(!code||code==""){
return "USD";
}
return code;
};
}
if(!dojo._hasResource["wm.base.widget.DojoGrid"]){
dojo._hasResource["wm.base.widget.DojoGrid"]=true;
dojo.provide("wm.base.widget.DojoGrid");
dojo.declare("wm.DojoGrid",wm.Control,{deleteConfirm:"Are you sure you want to delete this?",deleteColumn:false,noHeader:false,margin:4,width:"100%",height:"200px",minWidth:150,minHeight:60,variable:null,dataSet:null,dsType:null,store:null,query:"",queryOptions:{ignoreCase:true},dojoObj:null,singleClickEdit:false,liveEditing:false,selectedItem:null,emptySelection:true,isRowSelected:false,selectionMode:"single",_selectionMode:"",addFormName:"",columns:null,selectFirstRow:false,caseSensitiveSort:true,requiredLibs:["dojox.grid.DataGrid","dojox.grid.cells.dijit","dojo.data.ItemFileWriteStore","dojo.string","wm.base.lib.currencyMappings","dojox.grid._CheckBoxSelector","dojox.grid._RadioSelector"],setLocalizationStructure:function(_697){
this.localizationStructure=_697;
for(var i=0;i<this.columns.length;i++){
var c=this.columns[i];
if(this.localizationStructure[c.field]){
c.title=this.localizationStructure[c.field];
}
}
if(!this._cupdating&&this.dojoObj){
this.renderDojoObj();
}
},init:function(){
this.setSelectionMode(this.selectionMode);
if(!this.columns){
this.columns=[];
}else{
if(this.localizationStructure){
this.setLocalizationStructure(this.localizationStructure);
}
}
for(var i=0;i<this.requiredLibs.length;i++){
dojo["require"](this.requiredLibs[i]);
}
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].id){
this.columns[i].field=this.columns[i].id;
delete this.columns[i].id;
}
}
this.inherited(arguments);
var _698={name:"selectedItem",owner:this,json:this._selectionMode=="multiple"?"[]":"",type:this.variable?this.variable.type:"any"};
this.selectedItem=new wm.Variable(_698);
this.updateSelectedItem(-1);
this.setSelectionMode(this.selectionMode);
},setNoHeader:function(_699){
this.noHeader=_699;
dojo.toggleClass(this.domNode,"dojoGridNoHeader",_699);
},postInit:function(){
this.inherited(arguments);
if(this.noHeader){
this.setNoHeader(this.noHeader);
}
if(this.variable&&this.variable.getData()||this.columns&&this.columns.length){
this.renderDojoObj();
}
},dataSetToSelectedItem:function(){
this.selectedItem.setLiveView((this.variable||0).liveView);
this.selectedItem.setType(this.variable&&this.variable.type?this.variable.type:"any");
},setSelectedRow:function(_69a,_69b,_69c){
if(!this.dataSet){
return;
}
if(this._setRowTimeout){
window.clearTimeout(this._setRowTimeout);
delete this._setRowTimeout;
}
if(_69b==undefined){
_69b=true;
}
if(_69b){
if(wm.isEmpty(this.getRow(_69a))){
this.dojoObj.scrollToRow(_69a);
wm.onidle(this,function(){
this.setSelectedRow(_69a);
if(_69c){
_69c();
}
});
}else{
this.dojoObj.selection.select(_69a);
this.onSelectionChange();
this.dojoObj.scrollToRow(_69a);
if(_69c){
_69c();
}
}
}else{
this.dojoObj.selection.setSelected(_69a,_69b);
this.onSelectionChange();
}
},selectItemOnGrid:function(obj,_69d){
if(!this.store){
return;
}
if(obj instanceof wm.Variable){
obj=obj.getData();
}
if(obj===undefined||obj===null){
obj={};
}
var _69e=this.getDateFields();
if(!_69d){
_69d=wm.data.getIncludeFields(this.variable.type);
}
if(_69d.length==0){
var _69f=wm.typeManager.getTypeSchema(this.variable.type);
for(var _6a0 in _69f){
_69d.push(_6a0);
}
}
var q={};
dojo.forEach(_69d,function(f){
q[f]=obj[f];
if(dojo.indexOf(_69e,f)!=-1){
q[f]=new Date(obj[f]);
}
});
var _6a1=this;
var _6a2=function(_6a3,_6a4){
if(_6a3.length<1){
if(_6a1.selectFirstRow){
_6a1.setSelectedRow(0);
}else{
_6a1.deselectAll();
}
return;
}
var idx=_6a1.dojoObj.getItemIndex(_6a3[0]);
if(idx==-1){
idx=_6a1.variable.getItemIndexByPrimaryKey(obj,_69d)||-1;
}
if(idx==-1&&this.selectFirstRow){
idx=0;
}
if(idx>=0){
if(this._setRowTimeout){
window.clearTimeout(this._setRowTimeout);
}
this._setRowTimeout=setTimeout(function(){
_6a1.dojoObj.scrollToRow(idx);
wm.onidle(_6a1,function(){
this.setSelectedRow(idx);
});
},0);
}else{
_6a1.deselectAll();
}
};
this.store.fetch({query:q,onComplete:_6a2});
},deselectAll:function(){
if(this.dojoObj){
this.dojoObj.selection.clear();
}
this.updateSelectedItem(-1);
this.onSelectionChange();
},select:function(_6a5,_6a6,_6a7){
this.setSelectedRow(_6a5,_6a6,_6a7);
},selectionChange:function(){
var _6a8=this.dojoObj.selection.getSelected();
var _6a9=false;
if(!this._curSelectionObj||!wm.Array.equals(this._curSelectionObj,_6a8)){
_6a9=true;
}
if(_6a9){
this._selectedItemTimeStamp=new Date().getTime();
if(this._selectionMode=="multiple"){
this.updateAllSelectedItem();
}else{
this.updateSelectedItem(this.getSelectedIndex());
}
if(!this.rendering){
this.onSelectionChange();
}
this._curSelectionObj=[];
for(var i=0;i<_6a8.length;i++){
this._curSelectionObj.push(_6a8[i]);
}
}
},cellEditted:function(_6aa,_6ab,_6ac){
var _6ad=this.getRowData(_6ab)._wmVariable;
if(_6ad){
_6ad=_6ad[0];
}
if(_6ad){
var _6ae=_6ad._allowLazyLoad;
_6ad._allowLazyLoad=false;
var _6af=_6ad.getValue(_6ac);
_6ad._allowLazyLoad=_6ae;
if(_6af===_6aa){
return;
}
}
var _6b0=this.getSelectedIndex();
if(_6b0!=_6ab){
this.setSelectedRow(_6ab,true);
}else{
this.updateSelectedItem(_6b0);
}
var _6ae=this.selectedItem._allowLazyLoad;
this.selectedItem._allowLazyLoad=false;
var _6af=this.selectedItem.getValue(_6ac);
this.selectedItem._allowLazyLoad=_6ae;
if(_6af===_6aa){
return;
}
this.selectedItem.setValue(_6ac,_6aa);
if(_6ac.indexOf(".")!=-1){
var _6b1=_6ac.split(".");
var _6b2=_6b1.shift();
var obj=this.getCell(_6ab,_6b2);
if(obj[_6b1.join(".")]){
obj[_6b1.join(".")][0]=_6aa;
}else{
obj[_6b1.join(".")]=[_6aa];
}
}
if(_6ad){
_6ad.beginUpdate();
_6ad.setValue(_6ac,_6aa);
_6ad.endUpdate();
}
if(this.liveEditing){
this.writeSelectedItem();
}
this.onCellEdited(_6aa,_6ab,_6ac);
},updateSelectedItem:function(_6b3){
if(_6b3==-1||this.getRowCount()==0){
this.selectedItem.clearData();
}else{
if(_6b3<this.getRowCount()){
this.selectedItem.setDataSet(this.getRowData(_6b3)._wmVariable[0]);
}else{
this.selectedItem.setDataSet(null);
}
}
this.setValue("emptySelection",!this.hasSelection());
this.setValue("isRowSelected",this.hasSelection());
},createNewLiveVariable:function(){
var lvar=new wm.LiveVariable({owner:this,operation:"update",backlogBehavior:"executeAll",name:"liveVar",type:this.dataSet.type,liveSource:this.getDataSet().liveSource,autoUpdate:false,startUpdate:false});
this.connect(lvar,"onSuccess",this,"_onLiveEditSuccess");
this.connect(lvar,"onSuccess",this,"_onLiveEditError");
this.connect(lvar,"onSuccess",this,"_onLiveEditResult");
return lvar;
},writeSelectedItem:function(){
var _6b4;
var _6b5=this.getSelectedIndex();
var row=this.getRow(_6b5);
var _6b6=row._wmVariable.data._new?"insert":"update";
var _6b7=this.selectedItem.getData();
if(_6b6=="insert"){
var _6b8=this.selectedItem._dataSchema;
for(var _6b9 in _6b8){
if(_6b7[_6b9]===undefined||_6b7[_6b9]===null){
if(_6b8[_6b9].required){
console.warn("Can not write a '"+this.selectedItem.type+"' when required field '"+_6b9+"' has no value");
return;
}
}
}
}
var _6b8=this.selectedItem._dataSchema;
for(var _6b9 in _6b8){
if(_6b7[_6b9] instanceof Date){
_6b7[_6b9]=_6b7[_6b9].getTime();
}
}
if(_6b6==="insert"){
this.onLiveEditBeforeInsert(_6b7);
}else{
this.onLiveEditBeforeUpdate(_6b7);
}
if(!this.liveVariable){
this.liveVariable=this.createNewLiveVariable();
}
this.liveVariable.setSourceData(_6b7);
this.liveVariable.operation=_6b6;
var _6b4=this.liveVariable.update();
if(_6b6=="insert"){
this.handleInsertResult(_6b4,_6b5);
}
},onLiveEditBeforeInsert:function(_6ba){
},onLiveEditBeforeUpdate:function(_6bb){
},onLiveEditBeforeDelete:function(_6bc){
},_onLiveEditSuccess:function(_6bd){
this["onLiveEdit"+wm.capitalize(this.liveVariable.operation)+"Success"](this.liveVariable.getData());
},_onLiveEditError:function(_6be){
this["onLiveEdit"+wm.capitalize(this.liveVariable.operation)+"Error"](_6be);
},_onLiveEditResult:function(_6bf){
this["onLiveEdit"+wm.capitalize(this.liveVariable.operation)+"Result"](this.liveVariable.getData());
},onLiveEditInsertSuccess:function(_6c0){
},onLiveEditUpdateSuccess:function(_6c1){
},onLiveEditDeleteSuccess:function(_6c2){
},onLiveEditInsertResult:function(_6c3){
},onLiveEditUpdateResult:function(_6c4){
},onLiveEditDeleteResult:function(_6c5){
},onLiveEditInsertError:function(_6c6){
},onLiveEditUpdateError:function(_6c7){
},onLiveEditDeleteError:function(_6c8){
},handleInsertResult:function(_6c9,_6ca){
_6c9.addCallback(dojo.hitch(this,function(_6cb){
var row=this.getRow(_6ca);
delete row._wmVariable.data._new;
this.setUneditableFields(_6ca,_6cb);
this.updateSelectedItem(_6ca);
}));
_6c9.addErrback(dojo.hitch(this,function(_6cc){
console.error(_6cc);
}));
},setUneditableFields:function(_6cd,data){
var _6ce=this.getRow(_6cd);
var type=wm.typeManager.getType(this.getDataSet().type);
var _6cf=this.columns;
for(var i=0;i<_6cf.length;i++){
var _6d0=type.fields[_6cf[i].field];
if(_6d0){
if(_6d0.exclude.length){
this.setCell(_6cd,_6cf[i].field,data[_6cf[i].field]);
_6ce[_6cf[i].field]=data[_6cf[i].field];
}else{
if(_6ce[_6cf[i].field]=="&nbsp;"){
_6ce[_6cf[i].field]="";
}
}
}
}
_6ce._wmVariable.setData(_6ce);
},updateAllSelectedItem:function(){
if(!this.dojoObj){
return;
}
this.selectedItem.clearData();
var _6d1=this.dojoObj.selection.getSelected();
var _6d2=[];
dojo.forEach(_6d1,function(obj){
_6d2.push(this.itemToJSONObject(this.store,obj));
},this);
this.selectedItem._setArrayData(_6d2);
this.selectedItem.notify();
this.setValue("emptySelection",!this.hasSelection());
this.setValue("isRowSelected",this.hasSelection());
},getSelectedIndex:function(){
if(!this.dojoObj){
return -1;
}
if(this._selectionMode=="multiple"){
var _6d3=this.dojoObj.selection.selected;
var _6d4=[];
for(var row in _6d3){
_6d4.push(Number(row));
}
return _6d4;
}else{
return this.dojoObj.selection.selectedIndex;
}
},getRowData:function(_6d5){
return this.dojoObj.getItem(_6d5);
},findRowIndexByFieldValue:function(_6d6,_6d7){
var item;
for(var i=0;i<this.getRowCount();i++){
item=this.dojoObj.getItem(i);
if(this.store.getValue(item,_6d6)==_6d7){
return this.dojoObj.getItemIndex(item);
}
}
return -1;
},getCell:function(_6d8,_6d9){
var item=this.dojoObj.getItem(_6d8);
return this.dojoObj.store.getValue(item,_6d9);
},getCellNode:function(_6da,_6db){
var _6dc=this.dojoObj.layout.cells;
for(var i=0;i<_6dc.length;i++){
if(_6dc[i].field==_6db){
return this.dojoObj.layout.cells[i].getNode(_6da);
}
}
},editCell:function(_6dd,_6de){
wm.onidle(this,function(){
var _6df=this.dojoObj.layout.cells;
for(var i=0;i<_6df.length;i++){
if(_6df[i].field==_6de){
this.dojoObj.edit.setEditCell(_6df[i],_6dd);
this.dojoObj.focus.setFocusCell(_6df[i],_6dd);
return;
}
}
});
},cancelEdit:function(){
this.dojoObj.edit.cancel();
},setCell:function(_6e0,_6e1,_6e2,_6e3){
if(_6e0<0){
console.error("setCell requires 0 or greater for row index");
return;
}
var item=this.dojoObj.getItem(_6e0);
this.dojoObj.store._setValueOrValues(item,_6e1,_6e2,!_6e3);
if(item._wmVariable&&item._wmVariable[0]){
item._wmVariable[0].beginUpdate();
item._wmVariable[0].setValue(_6e1,_6e2);
item._wmVariable[0].endUpdate();
}
if(this.getSelectedIndex()==_6e0){
this.updateSelectedItem(_6e0);
}
if(item._wmVariable&&item._wmVariable[0]){
item._wmVariable[0].beginUpdate();
item._wmVariable[0].setValue(_6e1,_6e2);
item._wmVariable[0].endUpdate();
}
if(this.getSelectedIndex()==_6e0){
this.updateSelectedItem(_6e0);
}
},deleteRow:function(_6e4){
var _6e5;
if(this.liveEditing){
_6e5=this.getRow(_6e4);
}
if(this.liveEditing&&(!_6e5._wmVariable||!_6e5._wmVariable.data._new)){
var _6e6=this.selectedItem._dataSchema;
for(var _6e7 in _6e6){
if(_6e5[_6e7] instanceof Date){
_6e5[_6e7]=_6e5[_6e7].getTime();
}
}
var _6e8=this.liveVariable;
if(!_6e8){
_6e8=this.liveVariable=this.createNewLiveVariable();
}
_6e8.operation="delete";
this.onLiveEditBeforeDelete(_6e5);
_6e8.setSourceData(_6e5);
var _6e9=_6e8.update();
_6e9.addCallback(dojo.hitch(this,function(_6ea){
if(this.getSelectedIndex()==_6e4){
this.updateSelectedItem(-1);
}
var item=this.getRowData(_6e4);
this.dojoObj.store.deleteItem(item);
this.dojoObj.render();
}));
_6e9.addErrback(dojo.hitch(this,function(_6eb){
console.error(_6eb);
app.toastError(_6eb.message);
}));
return;
}
this.updateSelectedItem(-1);
var item=this.getRowData(_6e4);
this.dojoObj.store.deleteItem(item);
this.dojoObj.render();
},addRow:function(_6ec,_6ed){
if(this.getRowCount()==0&&this.variable){
this.variable.setData([_6ec]);
this.renderDojoObj();
if(_6ed){
this.setSelectedRow(0);
this.selectionChange();
}
return;
}
var data=dojo.clone(_6ec);
var v=new wm.Variable({type:this.dataSet.type});
v.setData(data);
this.dataSet.addItem(v,0);
this.dataSet.getItem(0).data._new=true;
if(_6ed||_6ed===undefined){
this.setSelectedRow(0);
this.selectionChange();
var self=this;
setTimeout(function(){
self.dojoObj.scrollToRow(0);
for(var i=0;i<self.columns.length;i++){
if(self.columns[i].fieldType){
self.editCell(0,self.columns[i].field);
break;
}
}
},0);
}
},addEmptyRow:function(_6ee){
var obj={};
var _6ef=false;
for(var i=0;i<this.columns.length;i++){
var _6f0=this.columns[i];
var _6f1=_6f0.field||_6f0.id;
var _6f2=_6f1.split(".");
var _6f3=this.dataSet.type;
var type=wm.typeManager.getType(_6f3);
for(var _6f4=0;_6f4<_6f2.length;_6f4++){
if(type&&type.fields){
var _6f5=type.fields[_6f2[_6f4]];
if(_6f5){
_6f3=type.fields[_6f2[_6f4]].type;
type=wm.typeManager.getType(_6f3);
}else{
type="java.lang.String";
}
}
}
var _6f6=null;
switch(_6f3){
case "java.lang.Integer":
case "java.lang.Double":
case "java.lang.Float":
case "java.lang.Short":
_6f6=0;
break;
case "java.lang.Date":
_6f6=new Date().getTime();
_6ef=true;
break;
case "java.lang.Boolean":
_6f6=false;
break;
default:
_6f6=_6ef?null:"&nbsp;";
_6ef=true;
}
var _6f7=obj;
for(var _6f4=0;_6f4<_6f2.length;_6f4++){
if(_6f4+1<_6f2.length){
if(!_6f7[_6f2[_6f4]]){
_6f7[_6f2[_6f4]]={};
}
_6f7=_6f7[_6f2[_6f4]];
}else{
_6f7[_6f2[_6f4]]=_6f6;
}
}
}
this.addRow(obj,_6ee);
},getRowCount:function(){
return Math.max(this.dojoObj.rowCount,this.dojoObj._by_idx.length);
},hasSelection:function(){
return Boolean(this.getSelectedIndex()!=-1);
},getEmptySelection:function(){
return !this.hasSelection();
},getIsRowSelected:function(){
return !this.getEmptySelection();
},renderBounds:function(){
this.inherited(arguments);
this.resizeDijit();
},resizeDijit:function(){
if(this.dojoObj){
this.dojoObj.resize();
}
},addDojoProps:function(_6f8){
},renderDojoObj:function(){
if(this._cupdating){
return;
}
if(this.dojoObj!=null){
this.dojoObj.destroy();
this.dojoObj=null;
}
if(!this.variable&&(!this.columns||!this.columns.length)){
return;
}
if(this.isAncestorHidden()&&!this._renderHiddenGrid){
this._renderDojoObjSkipped=true;
return;
}
this._renderDojoObjSkipped=false;
this.rendering=true;
if(this._resetStore){
this.setDojoStore();
delete this._resetStore;
}
var _6f9=this.getStructure();
if(_6f9[0].length==0){
_6f9={};
}
var _6fa={escapeHTMLInData:false,structure:_6f9,store:this.store,singleClickEdit:this.singleClickEdit,columnReordering:true,queryOptions:this.queryOptions,query:this.query||{},updateDelay:0};
this.addDojoProps(_6fa);
this.dojoObj=new dojox.grid.DataGrid(_6fa,dojo.create("div",{style:"width:100%;height:100%"},this.domNode));
this.connectDojoEvents();
this.setSelectionMode(this.selectionMode);
this.dojoRenderer();
var _6fb=this.selectedItem.getData();
var _6fc=dojo.isArray(_6fb);
if(_6fc&&_6fb.length||!_6fc&&_6fb||this.selectFirstRow){
this.selectItemOnGrid(this.selectedItem);
}
var _6fd=this;
setTimeout(function(){
_6fd.rendering=false;
},0);
},dojoRenderer:function(){
if(!this.dojoObj){
return;
}
this.dojoObj.startup();
this.dojoObj.updateDelay=1;
if(this._isDesignLoaded){
var self=this;
wm.job(this.getRuntimeId()+".renderBounds",1,function(){
self.renderBounds();
});
}
},_onShowParent:function(){
if(this._renderDojoObjSkipped){
this.renderDojoObj();
}
},connectDojoEvents:function(){
dojo.connect(this.dojoObj,"onSelectionChanged",this,"selectionChange");
if(this.isDesignLoaded()){
dojo.connect(this.dojoObj,"onMoveColumn",this,"_onMoveColumn");
dojo.connect(this.dojoObj,"onResizeColumn",this,"_onResizeColumn");
dojo.connect(this.dojoObj.domNode,"oncontextmenu",this,"showContextMenu");
if(dojo.isFF){
dojo.connect(this.dojoObj,"onHeaderCellMouseDown",this,function(evt){
if(evt.button==2||evt.ctrlKey){
dojo.stopEvent(evt);
this.showContextMenu(evt);
}
});
}else{
dojo.connect(this.dojoObj,"onHeaderContextMenu",this,"showContextMenu");
}
dojo.connect(this.dojoObj,"onRowContextMenu",this,"showContextMenu");
dojo.connect(this.dojoObj,"onCellContextMenu",this,"showContextMenu");
}else{
dojo.connect(this.dojoObj,"onCellContextMenu",this,"_onCellRightClick");
dojo.connect(this.dojoObj,"onApplyCellEdit",this,"cellEditted");
dojo.connect(this.dojoObj,"onClick",this,"_onClick");
dojo.connect(this.dojoObj,"onCellDblClick",this,"_onCellDblClick");
dojo.connect(this.dojoObj,"sort",this,"_onSort");
}
dojo.connect(this.dojoObj,"onStyleRow",this,"styleRow");
},styleRow:function(_6fe){
try{
var _6ff=_6fe.index;
var _700=this.getRowData(_6ff);
if(_700){
var _701=this.getRowData(_6ff)._wmVariable[0].data._new;
if(_701){
_6fe.customClasses+=" dojoxGridRow-inserting";
}
this.onStyleRow(_6fe,_700);
}
}
catch(e){
}
},onStyleRow:function(_702,_703){
},getDataSet:function(){
return this.variable;
},setDataSet:function(_704,_705){
if(this._typeChangedConnect){
this.disconnectEvent("typeChanged");
delete this._typeChangedConnect;
}
this.dataSet=this.variable=_704;
var _706=false;
if(this.variable){
this.dataSetToSelectedItem();
if(this._isDesignLoaded){
this._typeChangedConnect=this.connect(this.variable,"typeChanged",this,function(){
this.updateColumnData();
this.setDojoStore();
this.renderDojoObj();
});
this.updateColumnData();
_706=true;
}
}
if(this._isDesignLoaded&&!this._loading&&!_706){
this.setColumnData();
}
this._resetStore=true;
if(_704&&_704 instanceof wm.Variable){
this.selectedItem.setType(_704.type);
}
if(this.allLibsLoaded()){
this.renderDojoObj();
}else{
var _707=this;
dojo.addOnLoad(function(){
_707.renderDojoObj();
});
}
},allLibsLoaded:function(){
for(var i=0;i<this.requiredLibs.length;i++){
if(!dojo.getObject(this.requiredLibs[i])){
return false;
}
}
return true;
},setSortIndex:function(_708,_709){
this.dojoObj.setSortIndex(_708,_709);
},setSortField:function(_70a,_70b){
var _70c=this.dojoObj.layout.cells;
for(var i=0;i<_70c.length;i++){
if(_70c[i].field==_70a){
this.dojoObj.setSortIndex(_70c[i].index,_70b);
}
}
},customSort:function(a,b){
return "";
},setDojoStore:function(){
if(!this.variable){
this.store=null;
this.dsType=null;
return;
}
var _70d={"items":[]};
var _70e=this.variable.getData()||[];
if(this.customSort!=this.constructor.prototype.customSort&&dojo.isFunction(this.customSort)){
_70e=_70e.sort(this.customSort);
}
var _70f=this.getDateFields();
dojo.forEach(_70e,function(obj){
var _710={};
dojo.forEach(_70f,function(f){
if(obj[f]){
_710[f]=new Date(obj[f]);
}
});
obj=dojo.mixin({},obj,_710);
},this);
if(_70e){
for(var i=0;i<_70e.length;i++){
_70e[i]._wmVariable=this.variable.getItem(i);
}
}
_70d.items=_70e;
this.store=new dojo.data.ItemFileWriteStore({data:_70d});
if(!this.caseSensitiveSort){
this.makeSortingInsensitive();
}
},makeSortingInsensitive:function(){
this.store.comparatorMap={};
dojo.forEach(this.columns,function(col){
if(col.displayType=="Text"){
this.store.comparatorMap[col.field]=dojo.hitch(this,"sortNoCase");
}
},this);
},sortNoCase:function(a,b){
var a=String(a).toLowerCase();
var b=String(b).toLowerCase();
if(a>b){
return 1;
}
if(a<b){
return -1;
}
return 0;
},setQuery:function(q){
this.query=q;
if(this.dojoObj){
this.dojoObj.setQuery(q);
}
},getStructure:function(){
var _711=[];
if(this.deleteColumn){
_711.push({hidden:false,name:"-",width:"20px","get":dojo.hitch(this,"getExpressionValue","'<div class=\\'wmDeleteColumn\\'></div>'"),field:"_deleteColumn"});
}
dojo.forEach(this.columns,function(col){
var _712=col.options||col.editorProps&&col.editorProps.options;
var obj={hidden:(!col.show),field:col.field,constraint:col.constraints,name:col.title?col.title:"-",width:col.width,fieldType:col.fieldType=="dojox.grid.cells._Widget"&&col.editorProps&&col.editorProps.regExp?"dojox.grid.cells.ValidationTextBox":col.fieldType,widgetProps:col.editorProps,options:typeof _712=="string"?_712.split(/\s*,\s*/):_712,editable:col.editable||col.fieldType,expression:col.expression,displayType:col.displayType};
if(obj.widgetProps){
obj.widgetProps=dojo.mixin({owner:this},obj.widgetProps);
if(obj.fieldType=="dojox.grid.cells.ComboBox"){
obj.fieldType="wm.grid.cells.ComboBox";
obj.widgetProps.searchAttr=obj.widgetProps.displayField;
}
}
if(obj.fieldType=="dojox.grid.cells.DateTextBox"){
obj.fieldType="wm.grid.cells.DateTextBox";
}
if(obj.fieldType=="wm.grid.cells.DateTextBox"){
if(!obj.widgetProps){
obj.widgetProps={owner:this};
}
}
if(col.editorProps&&col.editorProps.selectDataSet&&col.fieldType=="dojox.grid.cells.ComboBox"){
var _713=this.owner.getValueById(col.editorProps.selectDataSet);
if(_713){
if(!_713.isEmpty()){
var _712=[];
var _714=_713.getCount();
for(var i=0;i<_714;i++){
var item=_713.getItem(i);
_712.push({name:item.getValue(col.editorProps.displayField),dataValue:item.getData()});
}
obj.options=_712;
}
if(this["_connectOnSetData."+col.field]){
dojo.disconnect(this["_connectOnSetData."+col.field]);
}
this["_connectOnSetData."+col.field]=this.connect(_713,"onSetData",dojo.hitch(this,"updateEditorDataSet",_713,col.field));
}
}
if(col.align&&col.align!=""){
obj.styles="text-align:"+col.align+";";
}
if(col.formatFunc&&col.formatFunc!=""||col.backgroundColor||col.textColor||col.cssClass){
switch(col.formatFunc){
case "wm_date_formatter":
case "Date (WaveMaker)":
obj.formatter=dojo.hitch(this,"dateFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_localdate_formatter":
case "Local Date (WaveMaker)":
obj.formatter=dojo.hitch(this,"localDateFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_time_formatter":
case "Time (WaveMaker)":
obj.formatter=dojo.hitch(this,"timeFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_number_formatter":
case "Number (WaveMaker)":
obj.formatter=dojo.hitch(this,"numberFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_currency_formatter":
case "Currency (WaveMaker)":
obj.formatter=dojo.hitch(this,"currencyFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_image_formatter":
case "Image (WaveMaker)":
obj.formatter=dojo.hitch(this,"imageFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_link_formatter":
case "Link (WaveMaker)":
obj.formatter=dojo.hitch(this,"linkFormatter",col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
case "wm_button_formatter":
obj.formatter=dojo.hitch(this,"buttonFormatter",col.field,col.formatProps||{},col.backgroundColor,col.textColor,col.cssClass);
break;
break;
default:
obj.formatter=dojo.hitch(this,"customFormatter",col.formatFunc,col.backgroundColor,col.textColor,col.cssClass);
break;
}
}
if(obj.fieldType&&obj.fieldType!=""){
obj.type=dojo.getObject(obj.fieldType);
}
if(obj.expression&&obj.expression!=""&&!obj.get){
obj.get=dojo.hitch(this,"getExpressionValue",obj.expression);
}else{
if(obj.field&&obj.field.indexOf(".")!=-1&&!obj.get){
obj.get=dojo.hitch(this,"getExpressionValue","${"+obj.field+"}");
}
}
_711.push(obj);
},this);
_711=[_711];
if(this.selectionMode=="checkbox"){
_711.unshift({type:"dojox.grid._CheckBoxSelector"});
}else{
if(this.selectionMode=="radio"){
_711.unshift({type:"dojox.grid._RadioSelector"});
}
}
return _711;
},updateEditorDataSet:function(_715,_716){
var _717=this.dojoObj.layout.cells;
if(_717){
for(var i=0;i<_717.length;i++){
if(_717[i].field===_716){
_717[i].options=_715.getData();
if(_717[i].widget){
_717[i].widget.set("store",wm.grid.cells.ComboBox.prototype.generateStore(_717[i].options,_717[i].widgetProps.displayField));
}
break;
}
}
}
},getColumnIndex:function(_718){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].field==_718){
return i;
}
}
return -1;
},getColumn:function(_719){
var _71a=this.getColumnIndex(_719);
if(_71a!=-1){
return this.columns[_71a];
}
},setColumnShowing:function(_71b,_71c,_71d){
var _71e=this.getColumnIndex(_71b);
if(_71e!=-1&&this.columns[_71e].show!=_71c){
this.columns[_71e].show=_71c;
if(!_71d){
this.renderDojoObj();
}
}
},getColumnShowing:function(_71f,_720,_721){
var _722=this.getColumnIndex(_71f);
if(_722!=-1){
return this.columns[_722].show;
}
},setColumnWidth:function(_723,_724,_725){
var _726=this.getColumnIndex(_723);
if(_726!=-1&&this.columns[_726].width!=_724){
this.columns[_726].width=_724;
if(!_725){
this.renderDojoObj();
}
}
},setColumnComboBoxOptions:function(_727,_728){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].field==_727){
this.columns[i].options=_728;
this.columns[i].fieldType="dojox.grid.cells.ComboBox";
this.renderDojoObj();
break;
}
}
},setColumnData:function(){
if(!this.variable||(this.variable.type==this.dsType&&this.columns.length>0)){
return;
}
this.dsType=this.variable.type;
this.columns=[];
var _729=this.getViewFields();
dojo.forEach(_729,function(f,i){
var _72a="left";
var _72b="100%";
var _72c="";
if(f.displayType=="Number"){
_72a="right";
_72b="80px";
}else{
if(f.displayType=="Date"){
_72b="80px";
_72c="wm_date_formatter";
}
}
this.columns.push({show:i<15,field:f.dataIndex,title:f.caption,width:_72b,displayType:f.displayType,align:_72a,formatFunc:_72c});
},this);
if(this.isDesignLoaded()){
if(!this.contextMenu){
this.designCreate();
}
this.contextMenu.setDataSet(this.columns);
}
},updateColumnData:function(){
var _72d={dataValue:{type:this.variable.type}};
var _72e=this.getViewFields()||_72d;
dojo.forEach(_72e,function(f,i){
if(dojo.some(this.columns,function(item){
return item.field==f.dataIndex;
})){
return;
}
var _72f=wm.typeManager.getTypeSchema(this.variable.type)||_72d;
if(wm.typeManager.isPropInList(_72f,f.dataIndex)){
return;
}
var _730="left";
var _731="100%";
var _732="";
if(f.displayType=="Number"){
_730="right";
_731="80px";
}else{
if(f.displayType=="Date"){
_731="80px";
_732="wm_date_formatter";
}
}
this.columns.push({show:i<15,field:f.dataIndex,title:wm.capitalize(f.dataIndex),width:_731,displayType:f.displayType,align:_730,formatFunc:_732});
},this);
var _733=[];
dojo.forEach(this.columns,dojo.hitch(this,function(col){
if(col.isCustomField){
_733.push(col);
return;
}
if(dojo.some(_72e,dojo.hitch(this,function(_734){
return _734.dataIndex==col.field;
}))){
_733.push(col);
return;
}
return;
}));
this.columns=_733;
},getDateFields:function(){
var _735=[];
dojo.forEach(this.columns,function(col){
if(col.displayType=="Date"){
_735.push(col.field);
}
});
return _735;
},setSelectionMode:function(_736){
this.selectionMode=_736;
if(_736=="checkbox"){
_736="multiple";
}else{
if(_736=="radio"){
_736="single";
}
}
this._selectionMode=_736;
if(this.dojoObj){
this.dojoObj.selection.setMode(_736);
}
},getViewFields:function(){
var _737=[];
if(this.variable instanceof wm.LiveVariable){
_737=this.variable.getViewFields();
}else{
if(this.variable instanceof wm.Variable){
_737=wm.getDefaultView(this.variable.type)||[];
}
}
return _737;
},setDeleteColumn:function(_738){
this.deleteColumn=_738;
this.renderDojoObj();
},_onGridEvent:function(evt){
var _739={};
if(!evt.grid){
if(dojo.IEGridEvent){
evt.target=dojo.IEGridEvent.target;
evt.grid=dojo.IEGridEvent.grid;
evt.cell=dojo.IEGridEvent.cell;
evt.cellIndex=dojo.IEGridEvent.cellIndex;
evt.rowIndex=dojo.IEGridEvent.rowIndex;
evt.rowNode=dojo.IEGridEvent.rowNode;
evt.sourceView=dojo.IEGridEvent.sourceView;
}else{
return {};
}
}
_739.cellNode=evt.cellNode;
_739.rowNode=evt.rowNode;
_739.rowId=evt.rowIndex;
_739.selectedItem=this.selectedItem;
if(evt.cell){
_739.fieldId=evt.cell.field;
}
return _739;
},_onSort:function(){
var _73a=this.selectedItem.getData();
if(_73a){
this.selectItemOnGrid(this.selectedItem);
}
var _73b=this.dojoObj.structure[0];
var _73c=_73b[Math.abs(this.dojoObj.sortInfo)-1].field;
this.onSort(_73c);
},onSort:function(_73d){
},_onClick:function(evt){
var _73e=this._onGridEvent(evt);
if(!_73e.rowId&&_73e.rowId!=0){
return;
}
if(_73e.rowId==-1){
this.onHeaderClick(evt,_73e.selectedItem,_73e.rowId,_73e.fieldId,_73e.rowNode,_73e.cellNode);
}else{
if(_73e.fieldId=="_deleteColumn"){
var _73f=this.getRow(_73e.rowId);
if(this.deleteConfirm){
app.confirm(this.deleteConfirm,false,dojo.hitch(this,function(){
this.deleteRow(_73e.rowId);
this.onRowDeleted(_73e.rowId,_73f);
}));
}else{
this.deleteRow(_73e.rowId);
this.onRowDeleted(_73e.rowId,_73f);
}
}else{
this.onClick(evt,_73e.selectedItem,_73e.rowId,_73e.fieldId,_73e.rowNode,_73e.cellNode);
}
}
},_onCellDblClick:function(evt){
var _740=this._onGridEvent(evt);
this.onCellDblClick(evt,_740.selectedItem,_740.rowId,_740.fieldId,_740.rowNode,_740.cellNode);
},_onCellRightClick:function(evt){
var _741=this._onGridEvent(evt);
this.onCellRightClick(evt,_741.selectedItem,_741.rowId,_741.fieldId,_741.rowNode,_741.cellNode);
},onRowDeleted:function(_742,_743){
},onClick:function(evt,_744,_745,_746,_747,_748){
},onCellDblClick:function(evt,_749,_74a,_74b,_74c,_74d){
},onCellRightClick:function(evt,_74e,_74f,_750,_751,_752){
},onCellEdited:function(_753,_754,_755){
},onHeaderClick:function(evt,_756,_757,_758,_759,_75a){
},onSelectionChange:function(){
},addColumnToCSV:function(_75b,_75c,_75d){
if(dojo.isString(_75c)){
_75c=_75c.replace(/\"/g,"\\\"");
}
_75b.push("\""+_75c+"\"");
_75b.push(",");
},addBreakToCSV:function(_75e){
_75e.pop();
_75e.push("\n");
},showCSVData:function(){
app.echoFile(this.toCSV(),"text/csv",this.name+".csv");
},toHtml:function(){
var html="<table border='0' cellspacing='0' cellpadding='0' class='wmdojogrid'><thead><tr>";
dojo.forEach(this.columns,function(col,idx){
if(!col.show){
return;
}
html+="<th style='"+(col.width.match(/px/)?col.width:"")+"'>"+col.title+"</th>";
},this);
html+="</tr></thead><tbody>";
var _75f=this.variable.getData();
dojo.forEach(_75f,function(obj,_760){
dojo.forEach(this.columns,function(col,idx){
if(!col.show){
return;
}
try{
var _761=obj[col.field||col.id];
if(!_761){
var _761=obj;
var _762=col.field||col.id;
while(_762.indexOf(".")!=-1){
var _763=_762.indexOf(".");
_761=_761[_762.substring(0,_763)];
_762=_762.substring(_763+1);
}
_761=_761[_762];
}
if(col.expression){
_761=this.getExpressionValue(col.expression,idx,obj,true);
}else{
if(col.formatFunc){
switch(col.formatFunc){
case "wm_date_formatter":
case "Date (WaveMaker)":
_761=this.dateFormatter(_761);
break;
case "wm_localdate_formatter":
case "Local Date (WaveMaker)":
_761=this.localDateFormatter(_761);
break;
case "wm_time_formatter":
case "Time (WaveMaker)":
_761=this.timeFormatter(_761);
break;
case "wm_number_formatter":
case "Number (WaveMaker)":
_761=this.numberFormatter(_761);
break;
case "wm_currency_formatter":
case "Currency (WaveMaker)":
_761=this.currencyFormatter(_761);
break;
case "wm_image_formatter":
case "Image (WaveMaker)":
break;
case "wm_link_formatter":
case "Link (WaveMaker)":
break;
default:
if(!this.isDesignLoaded()){
_761=dojo.hitch(this.owner,col.formatFunc)(_761,_760,idx,col.field||col.id,{},obj);
}
break;
}
}
}
}
catch(e){
_761="";
}
html+="<td>"+_761+"</td>";
},this);
html+="</tr>";
},this);
return html+="</tbody></table>";
},toCSV:function(){
var _764=[];
dojo.forEach(this.columns,function(col,idx){
if(!col.show){
return;
}
this.addColumnToCSV(_764,col.title,col.formatFunc);
},this);
if(_764.length==0){
return "CSV Data cannot be extracted for this Grid.";
}
this.addBreakToCSV(_764);
var _765=this.variable.getData();
dojo.forEach(_765,function(obj,_766){
dojo.forEach(this.columns,function(col,idx){
if(!col.show){
return;
}
try{
var _767=obj[col.field];
if(!_767){
var _767=obj;
var _768=col.field;
while(_768.indexOf(".")!=-1){
var _769=_768.indexOf(".");
_767=_767[_768.substring(0,_769)];
_768=_768.substring(_769+1);
}
_767=_767[_768];
}
if(col.expression){
_767=this.getExpressionValue(col.expression,idx,obj,true);
}else{
if(col.formatFunc){
switch(col.formatFunc){
case "wm_date_formatter":
case "Date (WaveMaker)":
_767=this.dateFormatter(_767);
break;
case "wm_localdate_formatter":
case "Local Date (WaveMaker)":
_767=this.localDateFormatter(_767);
break;
case "wm_time_formatter":
case "Time (WaveMaker)":
_767=this.timeFormatter(_767);
break;
case "wm_number_formatter":
case "Number (WaveMaker)":
_767=this.numberFormatter(_767);
break;
case "wm_currency_formatter":
case "Currency (WaveMaker)":
_767=this.currencyFormatter(_767);
break;
case "wm_image_formatter":
case "Image (WaveMaker)":
break;
case "wm_link_formatter":
case "Link (WaveMaker)":
break;
default:
if(!this.isDesignLoaded()){
_767=dojo.hitch(this.owner,col.formatFunc)(_767,_766,idx,col.field||col.id,{},obj);
}
break;
}
}
}
}
catch(e){
_767="";
}
this.addColumnToCSV(_764,_767);
},this);
this.addBreakToCSV(_764);
},this);
return _764.join("");
},getExpressionValue:function(exp,idx,_76a,_76b){
var _76c="..";
if(!_76a){
return _76c;
}
var json=_76a;
if(typeof _76a=="object"&&_76a!==null&&_76a._0!==undefined){
json=this.itemToJSONObject(this.store,_76a);
}
if(!json){
return _76c;
}
try{
_76c=wm.expression.getValue(exp,json,this.owner);
}
catch(e){
}
return _76c;
},dateFormatter:function(_76d,_76e,_76f,_770,_771,_772,_773){
this.handleColorFuncs(_773,_76e,_76f,_770,_772);
if(!_771){
return _771;
}else{
if(typeof _771=="number"){
_771=new Date(_771);
}else{
if(_771 instanceof Date==false){
return _771;
}
}
}
if(!_76d.useLocalTime){
_771.setHours(_771.getHours()+wm.timezoneOffset);
}
var _774={selector:_76d.dateType||"date",formatLength:_76d.formatLength||"short",locale:dojo.locale,datePattern:_76d.datePattern,timePattern:_76d.timePattern};
return dojo.date.locale.format(_771,_774);
},localDateFormatter:function(_775,_776,_777,_778,_779,_77a,_77b){
this.handleColorFuncs(_77b,_776,_777,_778,_77a);
if(!_779){
return _779;
}else{
if(typeof _779=="number"){
_779=new Date(_779);
}else{
if(_779 instanceof Date==false){
return _779;
}else{
if(typeof inDatum=="number"){
inDatum=new Date(inDatum);
}else{
if(inDatum instanceof Date==false){
return inDatum;
}
}
}
}
}
var _77c={selector:"date",formatLength:"short",locale:dojo.locale};
return dojo.date.locale.format(_779,_77c);
},timeFormatter:function(_77d,_77e,_77f,_780,_781,_782,_783){
this.handleColorFuncs(_783,_77e,_77f,_780,_782);
if(!_781){
return _781;
}else{
if(typeof _781=="number"){
_781=new Date(_781);
}else{
if(_781 instanceof Date==false){
return _781;
}
}
}
_781.setHours(_781.getHours()+wm.timezoneOffset,0,0);
var _784={selector:"time",formatLength:"short",locale:dojo.locale};
return dojo.date.locale.format(_781,_784);
},numberFormatter:function(_785,_786,_787,_788,_789,_78a,_78b){
this.handleColorFuncs(_78b,_786,_787,_788,_78a);
var _78c={places:_785.dijits||0,round:_785.round?0:-1,type:_785.numberType};
return dojo.number.format(_789,_78c);
},currencyFormatter:function(_78d,_78e,_78f,_790,_791,_792,_793){
this.handleColorFuncs(_793,_78e,_78f,_790,_792);
return dojo.currency.format(_791,{currency:_78d.currency||(this._isDesignLoaded?studio.application.currencyLocale:app.currencyLocale)||wm.getLocaleCurrency(),places:_78d.dijits==undefined?2:_78d.dijits,round:_78d.round?0:-1});
},imageFormatter:function(_794,_795,_796,_797,_798,_799,_79a){
this.handleColorFuncs(_79a,_795,_796,_797,_799);
if(_798&&_798!=""){
var _79b=_794.width?" width=\""+_794.width+"px\"":"";
var _79c=_794.height?" height=\""+_794.height+"px\"":"";
if(_794.prefix){
_798=_794.prefix+_798;
}
if(_794.postfix){
_798=_798+_794.postfix;
}
return "<img "+_79b+_79c+" src=\""+_798+"\">";
}
return _798;
},buttonFormatter:function(_79d,_79e,_79f,_7a0,_7a1,_7a2,_7a3,_7a4){
this.handleColorFuncs(_7a4,_79f,_7a0,_7a1,_7a3);
if(_7a2&&_7a2!=""){
var _7a5=_79e.buttonclass?" class=\""+_79e.buttonclass+"\" ":" class=\"wmbutton\" ";
var _7a6="onclick='"+this.getRuntimeId()+".gridButtonClicked(\""+_79d+"\","+_7a3+")' ";
return "<button "+_7a6+_79e.buttonclick+"\" style=\"width:100%;display:inline-block\" "+_7a5+">"+_7a2+"</button>";
}
return _7a2;
},gridButtonClicked:function(_7a7,_7a8){
var _7a9=this.getRow(_7a8);
this.onGridButtonClick(_7a7,_7a9,_7a8);
},onGridButtonClick:function(_7aa,_7ab,_7ac){
},linkFormatter:function(_7ad,_7ae,_7af,_7b0,_7b1,_7b2,_7b3){
this.handleColorFuncs(_7b3,_7ae,_7af,_7b0,_7b2);
if(_7b1&&_7b1!=""){
var _7b4=String(_7b1);
var _7b5=String(_7b1);
if(_7ad.prefix){
_7b5=_7ad.prefix+_7b5;
}
if(_7ad.postfix){
_7b5=_7b5+_7ad.postfix;
}
var _7b6=_7ad.target||"_NewWindow";
if(_7b5.indexOf("://")==-1&&_7b5.charAt(0)!="/"){
_7b5="http://"+_7b5;
}
return "<a href=\""+_7b5+"\" target=\""+_7b6+"\">"+_7b4+"</a>";
}
return _7b1;
},customFormatter:function(_7b7,_7b8,_7b9,_7ba,_7bb,_7bc,_7bd){
var _7be=this.getRow(_7bc);
this.handleColorFuncs(_7bd,_7b8,_7b9,_7ba,_7bc);
if(_7b7&&this.owner[_7b7]){
return dojo.hitch(this.owner,_7b7,_7bb,_7bc,_7bd.index,_7bd.field,_7bd,_7be)();
}else{
return _7bb;
}
},handleColorFuncs:function(_7bf,_7c0,_7c1,_7c2,_7c3){
var _7c4=this.getRow(_7c3);
if(_7c0){
var _7c5=this.getExpressionValue(_7c0,null,_7c4,true);
if(_7c5){
_7bf.customStyles.push("background-color: "+_7c5);
}
}
if(_7c1){
var _7c5=this.getExpressionValue(_7c1,null,_7c4,true);
if(_7c5){
_7bf.customStyles.push("color: "+_7c5);
}
}
if(_7c2){
var _7c5=this.getExpressionValue(_7c2,null,_7c4,true);
if(_7c5){
_7bf.customClasses.push(_7c5);
}
}
},getNumColumns:function(_7c6){
if(_7c6){
return this.columns.length;
}
return dojo.filter(this.columns,function(col){
return col.show;
}).length;
},getNumRows:function(){
return this.getRowCount();
},getRow:function(idx){
return this.itemToJSONObject(this.store,this.getRowData(idx)||{});
}});
wm.DojoGrid.description="A dojo grid.";
wm.DojoGrid.extend({itemToJSONObject:function(_7c7,item){
var json={};
if(item&&_7c7){
var _7c8=wm.isEmpty(item)?[]:_7c7.getAttributes(item);
_7c8=dojo.filter(_7c8,function(_7c9){
return _7c9.indexOf("_")==-1;
});
if(_7c8&&_7c8.length>0){
var i;
for(i=0;i<_7c8.length;i++){
var _7ca=_7c7.getValues(item,_7c8[i]);
if(_7ca){
if(_7ca.length>1){
var j;
json[_7c8[i]]=[];
for(j=0;j<_7ca.length;j++){
var _7cb=_7ca[j];
if(_7c7.isItem(_7cb)){
json[_7c8[i]].push(this.itemToJSONObject(_7c7,_7cb));
}else{
json[_7c8[i]].push(_7cb);
}
}
}else{
if(_7c7.isItem(_7ca[0])){
json[_7c8[i]]=this.itemToJSONObject(_7c7,_7ca[0]);
}else{
json[_7c8[i]]=_7ca[0];
}
}
}
}
}
}
return json;
}});
dojo.declare("wm.grid.cells.ComboBox",dojox.grid.cells._Widget,{widgetClass:dijit.form.ComboBox,getWidgetProps:function(_7cc){
return dojo.mixin({},this.widgetProps||{},{value:_7cc,store:this.generateStore(this.options,this.widgetProps.displayField)});
},generateStore:function(_7cd,_7ce){
var _7cf=[];
dojo.forEach(_7cd,function(o){
_7cf.push(o);
});
var _7d0=new dojo.data.ItemFileReadStore({data:{identifier:_7ce,items:_7cf}});
return _7d0;
},apply:function(_7d1){
if(this.grid.canEdit(this,_7d1)){
if(!this.widget){
return;
}
var name=this.field;
var _7d2=name.replace(/\..*?$/,"");
var item=this.widget.item;
var _7d3=this.widget.store;
if(this.widgetProps.owner){
var _7d4=this.widgetProps.owner.itemToJSONObject(_7d3,item);
var _7d5=this.grid.getItem(_7d1);
this.grid.doApplyCellEdit(_7d4,_7d1,_7d2);
}
}
this._finish(_7d1);
},getValue:function(){
var e=this.widget;
e.set("displayedValue",e.get("displayedValue"));
return e.get("value");
}});
dojo.declare("wm.grid.cells.DateTextBox",dojox.grid.cells.DateTextBox,{apply:function(_7d6){
var _7d7=this.widgetProps.owner;
var _7d8=_7d7.getColumn(this.field);
var _7d9=_7d8.formatterProps;
var _7da=_7d9&&_7d9.useLocalTime;
var _7db=this.getValue(_7d6);
if(!_7da){
_7db.setHours(-wm.timezoneOffset,0,0);
}
this.applyEdit(_7db,_7d6);
this._finish(_7d6);
}});
dojo.declare("dojox.grid.cells.NumberTextBox",dojox.grid.cells._Widget,{widgetClass:dijit.form.NumberTextBox});
dojox.grid.cells.NumberTextBox.markupFactory=function(node,cell){
dojox.grid.cells._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.ValidationTextBox",dojox.grid.cells._Widget,{widgetClass:dijit.form.ValidationTextBox,getWidgetProps:function(_7dc){
var _7dd=this.inherited(arguments);
return _7dd;
},});
dojox.grid.cells.ValidationTextBox.markupFactory=function(node,cell){
dojox.grid.cells._Widget.markupFactory(node,cell);
};
dojo.declare("dojox.grid.cells.TimeTextBox",dojox.grid.cells._Widget,{widgetClass:dijit.form.TimeTextBox});
dojox.grid.cells.TimeTextBox.markupFactory=function(node,cell){
dojox.grid.cells._Widget.markupFactory(node,cell);
};
}
dojo.i18n._preloadLocalizations("dojo.nls.wm_dojo_grid",["ROOT","ar","ca","cs","da","de","de-de","el","en","en-au","en-gb","en-us","es","es-es","fi","fi-fi","fr","fr-fr","he","he-il","hu","it","it-it","ja","ja-jp","ko","ko-kr","nb","nl","nl-nl","pl","pt","pt-br","pt-pt","ru","sk","sl","sv","th","tr","xx","zh","zh-cn","zh-tw"]);
