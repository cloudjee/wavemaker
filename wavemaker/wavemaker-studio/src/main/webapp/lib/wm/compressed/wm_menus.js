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

dojo.provide("wm.compressed.wm_menus");
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
if(!dojo._hasResource["dijit._KeyNavContainer"]){
dojo._hasResource["dijit._KeyNavContainer"]=true;
dojo.provide("dijit._KeyNavContainer");
dojo.declare("dijit._KeyNavContainer",dijit._Container,{tabIndex:"0",_keyNavCodes:{},connectKeyNavHandlers:function(_f,_10){
var _11=(this._keyNavCodes={});
var _12=dojo.hitch(this,this.focusPrev);
var _13=dojo.hitch(this,this.focusNext);
dojo.forEach(_f,function(_14){
_11[_14]=_12;
});
dojo.forEach(_10,function(_15){
_11[_15]=_13;
});
_11[dojo.keys.HOME]=dojo.hitch(this,"focusFirstChild");
_11[dojo.keys.END]=dojo.hitch(this,"focusLastChild");
this.connect(this.domNode,"onkeypress","_onContainerKeypress");
this.connect(this.domNode,"onfocus","_onContainerFocus");
},startupKeyNavChildren:function(){
dojo.forEach(this.getChildren(),dojo.hitch(this,"_startupChild"));
},addChild:function(_16,_17){
dijit._KeyNavContainer.superclass.addChild.apply(this,arguments);
this._startupChild(_16);
},focus:function(){
this.focusFirstChild();
},focusFirstChild:function(){
var _18=this._getFirstFocusableChild();
if(_18){
this.focusChild(_18);
}
},focusLastChild:function(){
var _19=this._getLastFocusableChild();
if(_19){
this.focusChild(_19);
}
},focusNext:function(){
var _1a=this._getNextFocusableChild(this.focusedChild,1);
this.focusChild(_1a);
},focusPrev:function(){
var _1b=this._getNextFocusableChild(this.focusedChild,-1);
this.focusChild(_1b,true);
},focusChild:function(_1c,_1d){
if(this.focusedChild&&_1c!==this.focusedChild){
this._onChildBlur(this.focusedChild);
}
_1c.set("tabIndex",this.tabIndex);
_1c.focus(_1d?"end":"start");
this._set("focusedChild",_1c);
},_startupChild:function(_1e){
_1e.set("tabIndex","-1");
this.connect(_1e,"_onFocus",function(){
_1e.set("tabIndex",this.tabIndex);
});
this.connect(_1e,"_onBlur",function(){
_1e.set("tabIndex","-1");
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
var _1f=this._keyNavCodes[evt.charOrCode];
if(_1f){
_1f();
dojo.stopEvent(evt);
}
},_onChildBlur:function(_20){
},_getFirstFocusableChild:function(){
return this._getNextFocusableChild(null,1);
},_getLastFocusableChild:function(){
return this._getNextFocusableChild(null,-1);
},_getNextFocusableChild:function(_21,dir){
if(_21){
_21=this._getSiblingOfChild(_21,dir);
}
var _22=this.getChildren();
for(var i=0;i<_22.length;i++){
if(!_21){
_21=_22[(dir>0)?0:(_22.length-1)];
}
if(_21.isFocusable()){
return _21;
}
_21=this._getSiblingOfChild(_21,dir);
}
return null;
}});
}
if(!dojo._hasResource["dijit._Contained"]){
dojo._hasResource["dijit._Contained"]=true;
dojo.provide("dijit._Contained");
dojo.declare("dijit._Contained",null,{getParent:function(){
var _23=dijit.getEnclosingWidget(this.domNode.parentNode);
return _23&&_23.isContainer?_23:null;
},_getSibling:function(_24){
var _25=this.domNode;
do{
_25=_25[_24+"Sibling"];
}while(_25&&_25.nodeType!=1);
return _25&&dijit.byNode(_25);
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
if(!dojo._hasResource["dijit.MenuItem"]){
dojo._hasResource["dijit.MenuItem"]=true;
dojo.provide("dijit.MenuItem");
dojo.declare("dijit.MenuItem",[dijit._Widget,dijit._Templated,dijit._Contained,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/MenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n"),attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{label:{node:"containerNode",type:"innerHTML"},iconClass:{node:"iconNode",type:"class"}}),baseClass:"dijitMenuItem",label:"",iconClass:"",accelKey:"",disabled:false,_fillContent:function(_26){
if(_26&&!("label" in this.params)){
this.set("label",_26.innerHTML);
}
},buildRendering:function(){
this.inherited(arguments);
var _27=this.id+"_text";
dojo.attr(this.containerNode,"id",_27);
if(this.accelKeyNode){
dojo.attr(this.accelKeyNode,"id",this.id+"_accel");
_27+=" "+this.id+"_accel";
}
dijit.setWaiState(this.domNode,"labelledby",_27);
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
},_setSelected:function(_28){
dojo.toggleClass(this.domNode,"dijitMenuItemSelected",_28);
},setLabel:function(_29){
dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_29);
},setDisabled:function(_2a){
dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");
this.set("disabled",_2a);
},_setDisabledAttr:function(_2b){
dijit.setWaiState(this.focusNode,"disabled",_2b?"true":"false");
this._set("disabled",_2b);
},_setAccelKeyAttr:function(_2c){
this.accelKeyNode.style.display=_2c?"":"none";
this.accelKeyNode.innerHTML=_2c;
dojo.attr(this.containerNode,"colSpan",_2c?"1":"2");
this._set("accelKey",_2c);
}});
}
if(!dojo._hasResource["dijit.PopupMenuItem"]){
dojo._hasResource["dijit.PopupMenuItem"]=true;
dojo.provide("dijit.PopupMenuItem");
dojo.declare("dijit.PopupMenuItem",dijit.MenuItem,{_fillContent:function(){
if(this.srcNodeRef){
var _2d=dojo.query("*",this.srcNodeRef);
dijit.PopupMenuItem.superclass._fillContent.call(this,_2d[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(!this.popup){
var _2e=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.popup=dijit.byNode(_2e);
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
dojo.declare("dijit.CheckedMenuItem",dijit.MenuItem,{templateString:dojo.cache("dijit","templates/CheckedMenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\n</tr>\n"),checked:false,_setCheckedAttr:function(_2f){
dojo.toggleClass(this.domNode,"dijitCheckedMenuItemChecked",_2f);
dijit.setWaiState(this.domNode,"checked",_2f);
this._set("checked",_2f);
},onChange:function(_30){
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
dojo.forEach(this.getChildren(),function(_31){
_31.startup();
});
this.startupKeyNavChildren();
this.inherited(arguments);
},onExecute:function(){
},onCancel:function(_32){
},_moveToPopup:function(evt){
if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){
this.focusedChild._onClick(evt);
}else{
var _33=this._getTopMenu();
if(_33&&_33._isMenuBar){
_33.focusNext();
}
}
},_onPopupHover:function(evt){
if(this.currentPopup&&this.currentPopup._pendingClose_timer){
var _34=this.currentPopup.parentMenu;
if(_34.focusedChild){
_34.focusedChild._setSelected(false);
}
_34.focusedChild=this.currentPopup.from_item;
_34.focusedChild._setSelected(true);
this._stopPendingCloseTimer(this.currentPopup);
}
},onItemHover:function(_35){
if(this.isActive||this.openOnHover){
this.focusChild(_35);
if(this.openOnHover||(this.focusedChild.popup&&!this.focusedChild.disabled&&!this.hover_timer)){
this.hover_timer=setTimeout(dojo.hitch(this,"_openPopup"),this.popupDelay);
}
}
if(this.focusedChild){
this.focusChild(_35);
}
this._hoveredChild=_35;
},_onChildBlur:function(_36){
this._stopPopupTimer();
_36._setSelected(false);
var _37=_36.popup;
if(_37){
this._stopPendingCloseTimer(_37);
_37._pendingClose_timer=setTimeout(function(){
_37._pendingClose_timer=null;
if(_37.parentMenu){
_37.parentMenu.currentPopup=null;
}
dijit.popup.close(_37);
},this.popupDelay);
}
},onItemUnhover:function(_38){
if(this.isActive){
this._stopPopupTimer();
}
if(this._hoveredChild==_38){
this._hoveredChild=null;
}
},_stopPopupTimer:function(){
if(this.hover_timer){
clearTimeout(this.hover_timer);
this.hover_timer=null;
}
},_stopPendingCloseTimer:function(_39){
if(_39._pendingClose_timer){
clearTimeout(_39._pendingClose_timer);
_39._pendingClose_timer=null;
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
},onItemClick:function(_3a,evt){
if(typeof this.isShowingNow=="undefined"){
this._markActive();
}
this.focusChild(_3a);
if(_3a.disabled){
return false;
}
if(_3a.popup){
this._openPopup();
}else{
this.onExecute();
_3a.onClick(evt);
}
},_openPopup:function(){
this._stopPopupTimer();
var _3b=this.focusedChild;
if(!_3b){
return;
}
var _3c=_3b.popup;
if(_3c.isShowingNow){
return;
}
if(this.currentPopup){
this._stopPendingCloseTimer(this.currentPopup);
dijit.popup.close(this.currentPopup);
}
_3c.parentMenu=this;
_3c.from_item=_3b;
var _3d=this;
dijit.popup.open({parent:this,popup:_3c,around:_3b.domNode,orient:this._orient||(this.isLeftToRight()?{"TR":"TL","TL":"TR","BR":"BL","BL":"BR"}:{"TL":"TR","TR":"TL","BL":"BR","BR":"BL"}),onCancel:function(){
_3d.focusChild(_3b);
_3d._cleanUp();
_3b._setSelected(true);
_3d.focusedChild=_3b;
},onExecute:dojo.hitch(this,"_cleanUp")});
this.currentPopup=_3c;
_3c.connect(_3c.domNode,"onmouseenter",dojo.hitch(_3d,"_onPopupHover"));
if(_3c.focus){
_3c._focus_timer=setTimeout(dojo.hitch(_3c,function(){
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
var _3e=this.focusedChild&&this.focusedChild.from_item;
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
},_onItemFocus:function(_3f){
if(this._hoveredChild&&this._hoveredChild!=_3f){
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
},_iframeContentWindow:function(_40){
var win=dojo.window.get(this._iframeContentDocument(_40))||this._iframeContentDocument(_40)["__parent__"]||(_40.name&&dojo.doc.frames[_40.name])||null;
return win;
},_iframeContentDocument:function(_41){
var doc=_41.contentDocument||(_41.contentWindow&&_41.contentWindow.document)||(_41.name&&dojo.doc.frames[_41.name]&&dojo.doc.frames[_41.name].document)||null;
return doc;
},bindDomNode:function(_42){
_42=dojo.byId(_42);
var cn;
if(_42.tagName.toLowerCase()=="iframe"){
var _43=_42,win=this._iframeContentWindow(_43);
cn=dojo.withGlobal(win,dojo.body);
}else{
cn=(_42==dojo.body()?dojo.doc.documentElement:_42);
}
var _44={node:_42,iframe:_43};
dojo.attr(_42,"_dijitMenu"+this.id,this._bindings.push(_44));
var _45=dojo.hitch(this,function(cn){
return [dojo.connect(cn,this.leftClickToOpen?"onclick":"oncontextmenu",this,function(evt){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_43,{x:evt.pageX,y:evt.pageY});
}),dojo.connect(cn,"onkeydown",this,function(evt){
if(evt.shiftKey&&evt.keyCode==dojo.keys.F10){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_43);
}
})];
});
_44.connects=cn?_45(cn):[];
if(_43){
_44.onloadHandler=dojo.hitch(this,function(){
var win=this._iframeContentWindow(_43);
cn=dojo.withGlobal(win,dojo.body);
_44.connects=_45(cn);
});
if(_43.addEventListener){
_43.addEventListener("load",_44.onloadHandler,false);
}else{
_43.attachEvent("onload",_44.onloadHandler);
}
}
},unBindDomNode:function(_46){
var _47;
try{
_47=dojo.byId(_46);
}
catch(e){
return;
}
var _48="_dijitMenu"+this.id;
if(_47&&dojo.hasAttr(_47,_48)){
var bid=dojo.attr(_47,_48)-1,b=this._bindings[bid];
dojo.forEach(b.connects,dojo.disconnect);
var _49=b.iframe;
if(_49){
if(_49.removeEventListener){
_49.removeEventListener("load",b.onloadHandler,false);
}else{
_49.detachEvent("onload",b.onloadHandler);
}
}
dojo.removeAttr(_47,_48);
delete this._bindings[bid];
}
},_scheduleOpen:function(_4a,_4b,_4c){
if(!this._openTimer){
this._openTimer=setTimeout(dojo.hitch(this,function(){
delete this._openTimer;
this._openMyself({target:_4a,iframe:_4b,coords:_4c});
}),1);
}
},_openMyself:function(_4d){
var _4e=_4d.target,_4f=_4d.iframe,_50=_4d.coords;
if(_50){
if(_4f){
var od=_4e.ownerDocument,ifc=dojo.position(_4f,true),win=this._iframeContentWindow(_4f),_51=dojo.withGlobal(win,"_docScroll",dojo);
var cs=dojo.getComputedStyle(_4f),tp=dojo._toPixelValue,_52=(dojo.isIE&&dojo.isQuirks?0:tp(_4f,cs.paddingLeft))+(dojo.isIE&&dojo.isQuirks?tp(_4f,cs.borderLeftWidth):0),top=(dojo.isIE&&dojo.isQuirks?0:tp(_4f,cs.paddingTop))+(dojo.isIE&&dojo.isQuirks?tp(_4f,cs.borderTopWidth):0);
_50.x+=ifc.x+_52-_51.x;
_50.y+=ifc.y+top-_51.y;
}
}else{
_50=dojo.position(_4e,true);
_50.x+=10;
_50.y+=10;
}
var _53=this;
var _54=dijit.getFocus(this);
function _55(){
if(_53.refocus){
dijit.focus(_54);
}
dijit.popup.close(_53);
};
dijit.popup.open({popup:this,x:_50.x,y:_50.y,onExecute:_55,onCancel:_55,orient:this.isLeftToRight()?"L":"R"});
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
if(!dojo._hasResource["dijit.MenuBar"]){
dojo._hasResource["dijit.MenuBar"]=true;
dojo.provide("dijit.MenuBar");
dojo.declare("dijit.MenuBar",dijit._MenuBase,{templateString:dojo.cache("dijit","templates/MenuBar.html","<div class=\"dijitMenuBar dijitMenuPassive\" dojoAttachPoint=\"containerNode\"  role=\"menubar\" tabIndex=\"${tabIndex}\" dojoAttachEvent=\"onkeypress: _onKeyPress\"></div>\n"),baseClass:"dijitMenuBar",openOnHover:false,_isMenuBar:true,postCreate:function(){
var k=dojo.keys,l=this.isLeftToRight();
this.connectKeyNavHandlers(l?[k.LEFT_ARROW]:[k.RIGHT_ARROW],l?[k.RIGHT_ARROW]:[k.LEFT_ARROW]);
this._orient=this.isLeftToRight()?{BL:"TL"}:{BR:"TR"};
},focusChild:function(_56){
var _57=this.focusedChild,_58=_57&&_57.popup&&_57.popup.isShowingNow;
this.inherited(arguments);
if(this.openOnHover||(_58&&_56.popup&&!_56.disabled)){
this._openPopup();
}
},_onKeyPress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
switch(evt.charOrCode){
case dojo.keys.DOWN_ARROW:
this._moveToPopup(evt);
dojo.stopEvent(evt);
}
},onItemClick:function(_59,evt){
if(_59.popup&&_59.popup.isShowingNow){
_59.popup.onCancel();
}else{
this.inherited(arguments);
}
}});
}
if(!dojo._hasResource["dijit.MenuBarItem"]){
dojo._hasResource["dijit.MenuBarItem"]=true;
dojo.provide("dijit.MenuBarItem");
dojo.declare("dijit._MenuBarItemMixin",null,{templateString:dojo.cache("dijit","templates/MenuBarItem.html","<div class=\"dijitReset dijitInline dijitMenuItem dijitMenuItemLabel\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<span dojoAttachPoint=\"containerNode\"></span>\n</div>\n"),attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{label:{node:"containerNode",type:"innerHTML"}})});
dojo.declare("dijit.MenuBarItem",[dijit.MenuItem,dijit._MenuBarItemMixin],{});
}
if(!dojo._hasResource["dijit.PopupMenuBarItem"]){
dojo._hasResource["dijit.PopupMenuBarItem"]=true;
dojo.provide("dijit.PopupMenuBarItem");
dojo.declare("dijit.PopupMenuBarItem",[dijit.PopupMenuItem,dijit._MenuBarItemMixin],{});
}
if(!dojo._hasResource["dojox.html.styles"]){
dojo._hasResource["dojox.html.styles"]=true;
dojo.provide("dojox.html.styles");
(function(){
var _5a={};
var _5b={};
var _5c=[];
var _5d=[];
dojox.html.insertCssRule=function(_5e,_5f,_60){
var ss=dojox.html.getDynamicStyleSheet(_60);
var _61=_5e+" {"+_5f+"}";
if(dojo.isIE){
ss.cssText+=_61;
}else{
if(ss.sheet){
ss.sheet.insertRule(_61,ss._indicies.length);
}else{
ss.appendChild(dojo.doc.createTextNode(_61));
}
}
ss._indicies.push(_5e+" "+_5f);
return _5e;
};
dojox.html.removeCssRule=function(_62,_63,_64){
var ss;
var _65=-1;
for(var nm in _5a){
if(_64&&_64!=nm){
continue;
}
ss=_5a[nm];
for(var i=0;i<ss._indicies.length;i++){
if(_62+" "+_63==ss._indicies[i]){
_65=i;
break;
}
}
if(_65>-1){
break;
}
}
if(!ss){
return false;
}
if(_65==-1){
return false;
}
ss._indicies.splice(_65,1);
if(dojo.isIE){
ss.removeRule(_65);
}else{
if(ss.sheet){
ss.sheet.deleteRule(_65);
}else{
if(document.styleSheets[0]){
}
}
}
return true;
};
dojox.html.getStyleSheet=function(_66){
if(_5a[_66||"default"]){
return _5a[_66||"default"];
}
if(!_66){
return false;
}
var _67=dojox.html.getStyleSheets();
if(_67[_66]){
return dojox.html.getStyleSheets()[_66];
}
for(var nm in _67){
if(_67[nm].href&&_67[nm].href.indexOf(_66)>-1){
return _67[nm];
}
}
return false;
};
dojox.html.getDynamicStyleSheet=function(_68){
if(!_68){
_68="default";
}
if(!_5a[_68]){
if(dojo.doc.createStyleSheet){
_5a[_68]=dojo.doc.createStyleSheet();
if(dojo.isIE<9){
_5a[_68].title=_68;
}
}else{
_5a[_68]=dojo.doc.createElement("style");
_5a[_68].setAttribute("type","text/css");
dojo.doc.getElementsByTagName("head")[0].appendChild(_5a[_68]);
}
_5a[_68]._indicies=[];
}
return _5a[_68];
};
dojox.html.enableStyleSheet=function(_69){
var ss=dojox.html.getStyleSheet(_69);
if(ss){
if(ss.sheet){
ss.sheet.disabled=false;
}else{
ss.disabled=false;
}
}
};
dojox.html.disableStyleSheet=function(_6a){
var ss=dojox.html.getStyleSheet(_6a);
if(ss){
if(ss.sheet){
ss.sheet.disabled=true;
}else{
ss.disabled=true;
}
}
};
dojox.html.activeStyleSheet=function(_6b){
var _6c=dojox.html.getToggledStyleSheets();
if(arguments.length==1){
dojo.forEach(_6c,function(s){
s.disabled=(s.title==_6b)?false:true;
});
}else{
for(var i=0;i<_6c.length;i++){
if(_6c[i].disabled==false){
return _6c[i];
}
}
}
return true;
};
dojox.html.getPreferredStyleSheet=function(){
};
dojox.html.getToggledStyleSheets=function(){
if(!_5c.length){
var _6d=dojox.html.getStyleSheets();
for(var nm in _6d){
if(_6d[nm].title){
_5c.push(_6d[nm]);
}
}
}
return _5c;
};
dojox.html.getStyleSheets=function(){
if(_5b.collected){
return _5b;
}
var _6e=dojo.doc.styleSheets;
dojo.forEach(_6e,function(n){
var s=(n.sheet)?n.sheet:n;
var _6f=s.title||s.href;
if(dojo.isIE){
if(s.cssText.indexOf("#default#VML")==-1){
if(s.href){
_5b[_6f]=s;
}else{
if(s.imports.length){
dojo.forEach(s.imports,function(si){
_5b[si.title||si.href]=si;
});
}else{
_5b[_6f]=s;
}
}
}
}else{
_5b[_6f]=s;
_5b[_6f].id=s.ownerNode.id;
dojo.forEach(s.cssRules,function(r){
if(r.href){
_5b[r.href]=r.styleSheet;
_5b[r.href].id=s.ownerNode.id;
}
});
}
});
_5b.collected=true;
return _5b;
};
})();
}
if(!dojo._hasResource["wm.base.widget.DojoMenu"]){
dojo._hasResource["wm.base.widget.DojoMenu"]=true;
dojo.provide("wm.base.widget.DojoMenu");
dojo.declare("wm.DojoMenu",wm.Control,{_menuConnects:null,padding:4,width:"100%",height:"35px",structure:"",localizationStructure:null,fullStructure:null,fullStructureStr:"",dojoObj:null,menu:"",vertical:false,openOnHover:false,eventList:[],menuItems:[],init:function(){
this._menuConnects=[];
if(!this.localizationStructure){
this.localizationStructure={};
}
this.inherited(arguments);
dojo.addClass(this.domNode,"dojoMenu");
},postInit:function(){
this.inherited(arguments);
var _70=this;
this._rightclickBlocker=[];
dojo.addOnLoad(function(){
_70.renderDojoObj();
});
},setTransparent:function(_71){
this.transparent=_71;
if(_71){
this.addUserClass("TransparentDojoMenu");
this.removeUserClass("ClickableDojoMenu");
}else{
this.addUserClass("ClickableDojoMenu");
this.removeUserClass("TransparentDojoMenu");
}
},getTransparent:function(){
if(this._classes&&this._classes.domNode){
return dojo.indexOf(this._classes.domNode,"ClickableDojoMenu")==-1;
}
return true;
},renderBounds:function(){
this.inherited(arguments);
if(this.dojoObj&&this.dojoObj.domNode){
var _72=this.getContentBounds();
this.dojoObj.domNode.style.width=_72.w+"px";
}
},createMenuBar:function(){
if(this.vertical){
this.dojoObj=new dijit.Menu({style:"width:0%",openOnHover:this.openOnHover});
}else{
this.dojoObj=new dijit.MenuBar({openOnHover:this.openOnHover});
}
dojo.addClass(this.dojoObj.domNode,this.getRuntimeId().replace(/\./g,"_")+"_CSS");
if(this.openOnHover&&!this.vertical){
this.hoverConnect=dojo.connect(this.dojoObj,"onItemHover",this,"_onItemHover");
}
return this.dojoObj;
},forEachMenuItem:function(_73,_74){
if(dojo.isArray(_73)){
_73={children:_73};
}else{
_74(_73);
}
if(_73.children){
for(var i=0;i<_73.children.length;i++){
this.forEachMenuItem(_73.children[i],_74);
}
}
},destroy:function(){
delete this._dijitHash;
dojo.forEach(this._menuConnects,function(c){
dojo.disconnect(c);
});
delete this._menuConnects;
if(this.dojoObj){
this.dojoObj.destroyRecursive();
}
this.inherited(arguments);
},renderDojoObj:function(){
this._dijitHash={};
dojo.forEach(this._righclickBlocker,function(con){
dojo.disconnect(con);
});
this._righclickBlocker=[];
if(this.dojoObj){
try{
this.dojoObj.destroyRecursive();
}
catch(e){
}
dojo.forEach(this._menuConnects,function(c){
dojo.disconnect(c);
});
if(this.hoverConnect){
dojo.disconnect(this.hoverConnect);
}
}
this.menuItems=[];
this.dojoObj=this.createMenuBar();
dojo.addClass(this.dojoObj.domNode,this.getRuntimeId().replace(/\./g,"_")+"_CSS");
if(!this.isPopupMenu){
this.dojoObj.placeAt(this.domNode);
}
if(this.fullStructureStr){
this.setFullStructureStr(this.fullStructureStr,0);
}
if(!this.fullStructure&&this.structure){
var _75=this.getStructure();
this.fullStructure=_75.items;
for(var i=0;i<this.eventList.length;i++){
var _76=this.eventList[i];
if(_76.onClick){
var _77=this.findCaptionInStructure(this.fullStructure,_76.label);
if(_77){
_77.onClick=_76.onClick;
}
}
}
delete this.eventList;
delete this.structure;
}
if(this.fullStructure&&this.fullStructure.length>0){
var _75=dojo.clone(this.fullStructure);
for(var i=0;i<_75.length;i++){
var _78=_75[i];
this.addAdvancedMenuChildren(this.dojoObj,_78,true);
}
}else{
var _75=this.getStructure();
for(var i=0;i<_75.items.length;i++){
var _78=_75.items[i];
var _77=this.addMenuChildren(this.dojoObj,_78,true);
this.menuItems[this.menuItems.length]=_77;
}
}
this.dojoRenderer();
this.blockRightClickOnMenu(this.dojoObj.domNode);
},findCaptionInStructure:function(_79,_7a){
for(var i=0;i<_79.length;i++){
var _7b=_79[i];
if(_7b.label==_7a){
return _7b;
}else{
if(_7b.children){
var _7c=this.findCaptionInStructure(_7b.children,_7a);
if(_7c){
return _7c;
}
}
}
}
},blockRightClickOnMenu:function(_7d){
try{
if(dojo.isFF){
this._righclickBlocker.push(this.connect(_7d,"onmousedown",function(_7e){
if(_7e.button==2||_7e.ctrlKey){
dojo.stopEvent(_7e);
}
}));
}
this._righclickBlocker.push(this.connect(_7d,"oncontextmenu",function(_7f){
dojo.stopEvent(_7f);
}));
}
catch(e){
}
},_onItemHover:function(_80){
this.dojoObj.focusChild(_80);
},addMenuChildren:function(_81,_82,_83){
var _84=null;
if(_83&&!this.isPopupMenu){
if(this.vertical){
_84=new dijit.MenuItem({label:_82.label});
}else{
_84=new dijit.PopupMenuBarItem({label:_82.label});
}
}else{
if(dojo.trim(_82.label)=="separator"){
_84=new dijit.MenuSeparator();
}else{
if(!_82.children){
_84=new dijit.MenuItem({label:_82.label,iconClass:_82.iconClass});
}else{
_84=new dijit.PopupMenuItem({label:_82.label,iconClass:_82.iconClass});
}
}
}
var _85=this.getEventObj(this.getEventName(_82.defaultLabel||_82.label));
if(!this.isDesignLoaded()&&_85&&_85.onClick&&_85.onClick!=""){
if(dojo.isFunction(_85.onClick)){
_84.onClick=_85.onClick;
}else{
var f=this.owner.getValueById(_85.onClick)||this.owner[_85.onClick];
_84.onClick=this.owner.makeEvent(f,_85.onClick,this,"onClick");
}
}
if(_82.children&&_82.children.length>0){
var _86=new dijit.Menu({});
dojo.addClass(_86.domNode,this.owner.name+"_"+this.name+"_PopupMenu");
for(var i=0;i<_82.children.length;i++){
var _87=_82.children[i];
var _88=this.addMenuChildren(_86,_87,false);
this.menuItems[this.menuItems.length]=_88;
}
if(_84.arrowWrapper){
_84.arrowWrapper.style.visibility="";
}
_84.popup=_86;
}
_81.addChild(_84);
dojo.addClass(_84.domNode,this.getRuntimeId().replace(/\./g,"_")+"_CSS");
return _84;
},addAdvancedMenuChildren:function(_89,_8a,_8b){
var _8c=null;
var _8d=_8a.onClick;
delete _8a.onClick;
var _8e=_8a.idInPage;
delete _8a.idInPage;
if(_8a.defaultLabel){
if(this.localizationStructure[_8e?_8e:_8a.defaultLabel]){
_8a.label=this.localizationStructure[_8e?_8e:_8a.defaultLabel];
}else{
if(_8a.defaultLabel){
_8a.label=_8a.defaultLabel;
}
}
}
if(_8b&&!this._neverIsTop){
_8c=new dijit.PopupMenuBarItem({label:_8a.label,data:_8a});
}else{
if(_8a.separator===true){
_8c=new dijit.MenuSeparator();
}else{
if(_8a.isCheckbox===true){
_8c=new dijit.CheckedMenuItem(_8a);
dojo.addClass(_8c.iconNode,"dijitMenuItemIcon dijitCheckedMenuItemIcon");
}else{
_8c=new dijit.MenuItem(_8a);
}
}
}
if(_8a.defaultLabel||_8a.label){
this._dijitHash[_8a.defaultLabel||_8a.label]=_8c;
}
if(!this.isDesignLoaded()&&this.eventList[_8a.label]&&this.eventList[_8a.label]!=""){
_8c.onClick=dojo.hitch(this.eventList[_8a.label]);
}
if(_8d){
if(dojo.isString(_8d)){
var f=this.owner[_8d];
_8c.onClick=this.owner.makeEvent(f||_8d,_8d,this,"onClick");
}else{
_8c.onClick=dojo.hitch(this.owner,_8d,_8c,_8a);
}
this._menuConnects.push(dojo.connect(_8c,"onClick",this,function(e){
this.onclick(_8c.defaultLabel||_8c.label,_8c.iconClass,e);
}));
}else{
_8c.onClick=dojo.hitch(this,function(e){
this.onclick(_8c.defaultLabel||_8c.label,_8c.iconClass,e);
});
}
if(_8e){
this.owner[_8e]=_8c;
}
if(_8a.children&&_8a.children.length>0){
var _8f=new dijit.Menu({});
this.blockRightClickOnMenu(_8f.domNode);
dojo.addClass(_8f.domNode,this.owner.name+"_"+this.name+"_PopupMenu");
dojo.addClass(_8f.domNode,this.owner.name+"_"+_8e+"_PopupMenu");
for(var i=0;i<_8a.children.length;i++){
var _90=_8a.children[i];
this.addAdvancedMenuChildren(_8f,_90,false);
}
_8c.popup=_8f;
var _91=dojo.query(".dijitMenuArrowCell div",_8c.domNode)[0];
if(_91){
_91.style.visibility="visible";
}
}
if(_89.addChild){
_89.addChild(_8c);
}
return _8c;
},onclick:function(_92,_93,_94){
},addNewMenuItem:function(_95,_96){
if(!_95.popup){
var _97=new dijit.Menu({});
dojo.addClass(_97.domNode,this.owner.name+"_"+this.name+"_PopupMenu");
if(_96.idInPage){
dojo.addClass(_97.domNode,this.owner.name+"_"+_96.idInPage+"_PopupMenu");
}
_95.popup=_97;
}
this.addAdvancedMenuChildren(_95.popup,_96,false);
},dojoRenderer:function(){
},setFullStructureStr:function(_98,_99){
this.fullStructureStr=_98;
this.setFullStructure(dojo.fromJson(_98));
if(_99){
this.renderDojoObj();
}
},setFullStructure:function(_9a){
this.fullStructure=_9a;
this.eventList=[];
},getStructure:function(){
return this.structure==""?{items:[]}:dojo.fromJson(this.structure);
},setStructure:function(_9b){
if(this.fullStructure&&this.fullStructure.length>0){
return;
}
if(_9b==""){
return;
}
var _9c=[];
var _9d=[];
var _9e=[];
var _9f=_9b.split("\n");
for(var i=0;i<_9f.length;i++){
if(dojo.trim(_9f[i])==""){
continue;
}
var _a0=_9f[i].split(">");
var obj={label:dojo.trim(_a0[0])};
var _a1=this.findInItems(_9d,obj.label);
if(_a1==null){
_9c[_9c.length]=obj;
}
this.addToEventList(obj);
var _a2=[];
if(_a0.length>1){
var _a3=_a0[1].split(",");
for(var j=0;j<_a3.length;j++){
var _a4={label:dojo.trim(_a3[j])};
this.addToEventList(dojo.clone(_a4));
_a2[_a2.length]=_a4;
_9d[_9d.length]=_a4;
_9c[_9c.length]=dojo.clone(_a4);
}
obj.children=_a2;
}
if(_a1!=null){
_a1.children=_a2;
}else{
_9e[_9e.length]=obj;
}
}
this.removeOldEvents(_9c);
this.structure=dojo.toJson({items:_9e});
},findInItems:function(_a5,_a6){
for(var i=_a5.length-1;i>=0;i--){
if(_a5[i].label==_a6){
return _a5[i];
}
}
return null;
},addToEventList:function(obj){
for(var i=0;i<this.eventList.length;i++){
if(this.eventList[i].label==obj.label){
return;
}
}
this.eventList[this.eventList.length]=obj;
},removeOldEvents:function(_a7){
var _a8=[];
for(var i=0;i<this.eventList.length;i++){
var _a9=this.eventList[i];
var _aa=false;
for(var j=0;j<_a7.length;j++){
if(_a9.label==_a7[j].label){
_a8[_a8.length]=_a9;
}
}
}
this.eventList=_a8;
},overrideCSS:function(_ab,_ac){
dojox.html.insertCssRule(this.getCSSMenuTypeClass(_ab)+this.id+"_CSS",_ac);
},getCSSMenuTypeClass:function(_ad){
switch(_ad){
case "MenuBar":
return ".tundra .dijitMenuBar.";
case "MenuItem":
return ".tundra .dijitMenuItem.";
case "MenuHover":
return ".tundra .dijitMenuItemHover.";
case "MenuPassiveHover":
return ".tundra .dijitMenuPassive .dijitMenuItemHover.";
}
},setMenu:function(_ae){
this.menu=_ae;
this.setStructure(_ae);
this.renderDojoObj();
},setItemDisabled:function(_af,_b0){
if(this._dijitHash[_af]){
this._dijitHash[_af].set("disabled",_b0);
}
},setItemShowing:function(_b1,_b2){
if(this._dijitHash[_b1]){
this._dijitHash[_b1].domNode.style.display=_b2?"":"none";
}
},getItemChecked:function(_b3){
if(this._dijitHash[_b3]){
this._dijitHash[_b3].get("checked");
}
},setItemChecked:function(_b4,_b5){
if(this._dijitHash[_b4]){
this._dijitHash[_b4].set("checked",Boolean(_b5));
}
}});
dojo.declare("wm.PopupMenu",wm.DojoMenu,{classNames:"wmpopupmenu",_neverIsTop:true,width:"0px",height:"0px",isPopupMenu:true,createMenuBar:function(){
return new dijit.Menu({style:"width:0%"});
},renderBounds:function(){
},render:function(){
},renderCss:function(){
},renderDojoObj:function(){
this.inherited(arguments);
if(this.domNode!=this.dojoObj.domNode){
this.dojoObj.className+=this.domNode.className;
dojo.destroy(this.domNode);
this.domNode=this.dojoObj.domNode;
dojo.addClass(this.domNode,this.classNames);
}
},activate:function(_b6){
if(this.isDesignLoaded()){
this.dojoObj._scheduleOpen(studio.designer.domNode);
}else{
if(_b6){
this.setShowing(true,_b6);
}
}
},update:function(_b7,_b8,_b9){
this.target=_b8;
if(_b9||!_b7){
var _ba=dojo.coords(_b8.domNode);
var _bb=_b8.getContentBounds();
var y=_ba.y+_bb.h;
var x=_ba.x;
this.dojoObj.domNode.style.width=(_bb.w+_b8.borderExtents.l+_b8.borderExtents.r)+"px";
this.dojoObj.domNode.style.borderTop="solid 1px "+_b8.borderColor;
this.dojoObj._scheduleOpen(_b8.domNode,null,{x:x,y:y});
}else{
this.dojoObj._scheduleOpen(_b7.target,null,{x:_b7.pageX,y:_b7.pageY});
}
},setShowing:function(_bc,_bd){
if(_bc){
this.dojoObj._scheduleOpen(_bd);
}
},setLabel:function(_be,_bf){
this.dojoObj.getChildren()[_be].set("label",_bf);
},removeAllChildren:function(){
var _c0=this.dojoObj.getChildren();
for(var i=_c0.length-1;i>=0;i--){
_c0[i].destroy();
}
delete this.dojoObj.focusedChild;
},_end:0});
}
if(!dojo._hasResource["wm.base.widget.Buttons.PopupMenuButton"]){
dojo._hasResource["wm.base.widget.Buttons.PopupMenuButton"]=true;
dojo.provide("wm.base.widget.Buttons.PopupMenuButton");
dojo.declare("wm.PopupMenuButton",wm.IconButton,{width:"120px",rememberWithCookie:true,classNames:"wmbutton wmPopupButton",fullStructureStr:"",fullStructure:null,iconClass:"",onclick:function(){
},onchange:function(_c1,_c2,_c3){
},onchangeNoInit:function(_c4,_c5,_c6){
},postInit:function(){
this.dojoMenu=new wm.PopupMenu({name:"dojoMenu",classNames:"wmpopupmenu wmpopupbuttonmenu",owner:this});
try{
if(this.rememberWithCookie&&!this.isDesignLoaded()){
var obj=dojo.cookie(this.getRuntimeId());
if(obj){
obj=dojo.fromJson(obj);
}
if(obj&&typeof obj=="object"){
this.setProp("caption",obj.caption);
this.iconClass=obj.iconClass;
this.iconWidth=obj.iconWidth;
this.iconHeight=obj.iconHeight;
this.onchange(obj.caption,obj.iconClass);
}
}
}
catch(e){
}
if(this.fullStructureStr){
this.setFullStructureStr(this.fullStructureStr);
}else{
if(this.fullStructure){
this.setFullStructure(this.fullStructure);
}
}
this.connect(this.dojoMenu,"onclick",this,"menuChange");
this.inherited(arguments);
},menuChange:function(_c7,_c8,_c9){
this.setProp("caption",_c7);
this.iconClass=_c8;
if(_c8){
var img=dojo.query(".dijitIcon."+_c8)[0];
if(img){
var _ca=dojo.getComputedStyle(img);
var _cb=_ca.width;
var _cc=_ca.height;
this.iconWidth=_cb;
this.iconHeight=_cc;
}else{
this.iconUrl="";
this.iconWidth="0px";
this.iconHeight="0px";
}
}
this.render(true);
this.onchange(_c7,_c8,_c9);
this.onchangeNoInit(_c7,_c8,_c9);
if(this.rememberWithCookie){
dojo.cookie(this.getRuntimeId(),dojo.toJson({caption:this.caption,iconClass:this.iconClass,iconWidth:this.iconWidth,iconHeight:this.iconHeight}));
}
},click:function(_cd){
if(this.disabled){
return;
}
var _ce=dojo.coords(dojo.query(".popupIcon",this.domNode)[0]);
var _cf=_ce.x-2;
if(_cd.clientX>=_cf){
this.dojoMenu.update(_cd,this,true);
}else{
this.onclick(_cd,this);
if(!this.clicked){
this.setProp("clicked",true);
}
}
},render:function(_d0){
this.inherited(arguments);
if(this._iconImage){
this._iconImage.className=this.iconClass;
}
},setIconClass:function(_d1){
this.iconClass=_d1;
if(this.isReflowEnabled()){
this.render(true);
}
},setFullStructureStr:function(_d2,_d3){
this.fullStructureStr=_d2;
this.dojoMenu.setFullStructureStr(_d2);
this.dojoMenu.renderDojoObj();
if(!this.caption){
this.set_caption();
}
if(_d3&&this.isDesignLoaded()){
studio.inspector.reinspect();
}
},setFullStructure:function(_d4){
this.dojoMenu.setFullStructure(_d4);
this.dojoMenu.renderDojoObj();
},setCaption:function(_d5){
this.inherited(arguments);
this.valueChanged("caption",_d5);
},_end:0});
}
