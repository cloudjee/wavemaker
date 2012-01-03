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

dojo.provide("wm.compressed.wm_richTextEditor");
if(!dojo._hasResource["dijit._editor.selection"]){
dojo._hasResource["dijit._editor.selection"]=true;
dojo.provide("dijit._editor.selection");
dojo.getObject("_editor.selection",true,dijit);
dojo.mixin(dijit._editor.selection,{getType:function(){
if(dojo.isIE<9){
return dojo.doc.selection.type.toLowerCase();
}else{
var _1="text";
var _2;
try{
_2=dojo.global.getSelection();
}
catch(e){
}
if(_2&&_2.rangeCount==1){
var _3=_2.getRangeAt(0);
if((_3.startContainer==_3.endContainer)&&((_3.endOffset-_3.startOffset)==1)&&(_3.startContainer.nodeType!=3)){
_1="control";
}
}
return _1;
}
},getSelectedText:function(){
if(dojo.isIE<9){
if(dijit._editor.selection.getType()=="control"){
return null;
}
return dojo.doc.selection.createRange().text;
}else{
var _4=dojo.global.getSelection();
if(_4){
return _4.toString();
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
var _5=dojo.global.getSelection();
if(_5&&_5.rangeCount){
var i;
var _6="";
for(i=0;i<_5.rangeCount;i++){
var _7=_5.getRangeAt(i).cloneContents();
var _8=dojo.doc.createElement("div");
_8.appendChild(_7);
_6+=_8.innerHTML;
}
return _6;
}
return null;
}
},getSelectedElement:function(){
if(dijit._editor.selection.getType()=="control"){
if(dojo.isIE<9){
var _9=dojo.doc.selection.createRange();
if(_9&&_9.item){
return dojo.doc.selection.createRange().item(0);
}
}else{
var _a=dojo.global.getSelection();
return _a.anchorNode.childNodes[_a.anchorOffset];
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
var _b=dojo.global.getSelection();
if(_b){
var _c=_b.anchorNode;
while(_c&&(_c.nodeType!=1)){
_c=_c.parentNode;
}
return _c;
}
}
}
return null;
},hasAncestorElement:function(_d){
return this.getAncestorElement.apply(this,arguments)!=null;
},getAncestorElement:function(_e){
var _f=this.getSelectedElement()||this.getParentElement();
return this.getParentOfType(_f,arguments);
},isTag:function(_10,_11){
if(_10&&_10.tagName){
var _12=_10.tagName.toLowerCase();
for(var i=0;i<_11.length;i++){
var _13=String(_11[i]).toLowerCase();
if(_12==_13){
return _13;
}
}
}
return "";
},getParentOfType:function(_14,_15){
while(_14){
if(this.isTag(_14,_15).length){
return _14;
}
_14=_14.parentNode;
}
return null;
},collapse:function(_16){
if(window.getSelection){
var _17=dojo.global.getSelection();
if(_17.removeAllRanges){
if(_16){
_17.collapseToStart();
}else{
_17.collapseToEnd();
}
}else{
_17.collapse(_16);
}
}else{
if(dojo.isIE){
var _18=dojo.doc.selection.createRange();
_18.collapse(_16);
_18.select();
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
},selectElementChildren:function(_19,_1a){
var win=dojo.global;
var doc=dojo.doc;
var _1b;
_19=dojo.byId(_19);
if(doc.selection&&dojo.isIE<9&&dojo.body().createTextRange){
_1b=_19.ownerDocument.body.createTextRange();
_1b.moveToElementText(_19);
if(!_1a){
try{
_1b.select();
}
catch(e){
}
}
}else{
if(win.getSelection){
var _1c=dojo.global.getSelection();
if(dojo.isOpera){
if(_1c.rangeCount){
_1b=_1c.getRangeAt(0);
}else{
_1b=doc.createRange();
}
_1b.setStart(_19,0);
_1b.setEnd(_19,(_19.nodeType==3)?_19.length:_19.childNodes.length);
_1c.addRange(_1b);
}else{
_1c.selectAllChildren(_19);
}
}
}
},selectElement:function(_1d,_1e){
var _1f;
var doc=dojo.doc;
var win=dojo.global;
_1d=dojo.byId(_1d);
if(dojo.isIE<9&&dojo.body().createTextRange){
try{
var tg=_1d.tagName?_1d.tagName.toLowerCase():"";
if(tg==="img"||tg==="table"){
_1f=dojo.body().createControlRange();
}else{
_1f=dojo.body().createRange();
}
_1f.addElement(_1d);
if(!_1e){
_1f.select();
}
}
catch(e){
this.selectElementChildren(_1d,_1e);
}
}else{
if(dojo.global.getSelection){
var _20=win.getSelection();
_1f=doc.createRange();
if(_20.removeAllRanges){
if(dojo.isOpera){
if(_20.getRangeAt(0)){
_1f=_20.getRangeAt(0);
}
}
_1f.selectNode(_1d);
_20.removeAllRanges();
_20.addRange(_1f);
}
}
}
},inSelection:function(_21){
if(_21){
var _22;
var doc=dojo.doc;
var _23;
if(dojo.global.getSelection){
var sel=dojo.global.getSelection();
if(sel&&sel.rangeCount>0){
_23=sel.getRangeAt(0);
}
if(_23&&_23.compareBoundaryPoints&&doc.createRange){
try{
_22=doc.createRange();
_22.setStart(_21,0);
if(_23.compareBoundaryPoints(_23.START_TO_END,_22)===1){
return true;
}
}
catch(e){
}
}
}else{
if(doc.selection){
_23=doc.selection.createRange();
try{
_22=_21.ownerDocument.body.createControlRange();
if(_22){
_22.addElement(_21);
}
}
catch(e1){
try{
_22=_21.ownerDocument.body.createTextRange();
_22.moveToElementText(_21);
}
catch(e2){
}
}
if(_23&&_22){
if(_23.compareEndPoints("EndToStart",_22)===1){
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
dijit.range.getIndex=function(_24,_25){
var ret=[],_26=[];
var _27=_25;
var _28=_24;
var _29,n;
while(_24!=_27){
var i=0;
_29=_24.parentNode;
while((n=_29.childNodes[i++])){
if(n===_24){
--i;
break;
}
}
ret.unshift(i);
_26.unshift(i-_29.childNodes.length);
_24=_29;
}
if(ret.length>0&&_28.nodeType==3){
n=_28.previousSibling;
while(n&&n.nodeType==3){
ret[ret.length-1]--;
n=n.previousSibling;
}
n=_28.nextSibling;
while(n&&n.nodeType==3){
_26[_26.length-1]++;
n=n.nextSibling;
}
}
return {o:ret,r:_26};
};
dijit.range.getNode=function(_2a,_2b){
if(!dojo.isArray(_2a)||_2a.length==0){
return _2b;
}
var _2c=_2b;
dojo.every(_2a,function(i){
if(i>=0&&i<_2c.childNodes.length){
_2c=_2c.childNodes[i];
}else{
_2c=null;
return false;
}
return true;
});
return _2c;
};
dijit.range.getCommonAncestor=function(n1,n2,_2d){
_2d=_2d||n1.ownerDocument.body;
var _2e=function(n){
var as=[];
while(n){
as.unshift(n);
if(n!==_2d){
n=n.parentNode;
}else{
break;
}
}
return as;
};
var _2f=_2e(n1);
var _30=_2e(n2);
var m=Math.min(_2f.length,_30.length);
var com=_2f[0];
for(var i=1;i<m;i++){
if(_2f[i]===_30[i]){
com=_2f[i];
}else{
break;
}
}
return com;
};
dijit.range.getAncestor=function(_31,_32,_33){
_33=_33||_31.ownerDocument.body;
while(_31&&_31!==_33){
var _34=_31.nodeName.toUpperCase();
if(_32.test(_34)){
return _31;
}
_31=_31.parentNode;
}
return null;
};
dijit.range.BlockTagNames=/^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/;
dijit.range.getBlockAncestor=function(_35,_36,_37){
_37=_37||_35.ownerDocument.body;
_36=_36||dijit.range.BlockTagNames;
var _38=null,_39;
while(_35&&_35!==_37){
var _3a=_35.nodeName.toUpperCase();
if(!_38&&_36.test(_3a)){
_38=_35;
}
if(!_39&&(/^(?:BODY|TD|TH|CAPTION)$/).test(_3a)){
_39=_35;
}
_35=_35.parentNode;
}
return {blockNode:_38,blockContainer:_39||_35.ownerDocument.body};
};
dijit.range.atBeginningOfContainer=function(_3b,_3c,_3d){
var _3e=false;
var _3f=(_3d==0);
if(!_3f&&_3c.nodeType==3){
if(/^[\s\xA0]+$/.test(_3c.nodeValue.substr(0,_3d))){
_3f=true;
}
}
if(_3f){
var _40=_3c;
_3e=true;
while(_40&&_40!==_3b){
if(_40.previousSibling){
_3e=false;
break;
}
_40=_40.parentNode;
}
}
return _3e;
};
dijit.range.atEndOfContainer=function(_41,_42,_43){
var _44=false;
var _45=(_43==(_42.length||_42.childNodes.length));
if(!_45&&_42.nodeType==3){
if(/^[\s\xA0]+$/.test(_42.nodeValue.substr(_43))){
_45=true;
}
}
if(_45){
var _46=_42;
_44=true;
while(_46&&_46!==_41){
if(_46.nextSibling){
_44=false;
break;
}
_46=_46.parentNode;
}
}
return _44;
};
dijit.range.adjacentNoneTextNode=function(_47,_48){
var _49=_47;
var len=(0-_47.length)||0;
var _4a=_48?"nextSibling":"previousSibling";
while(_49){
if(_49.nodeType!=3){
break;
}
len+=_49.length;
_49=_49[_4a];
}
return [_49,len];
};
dijit.range._w3c=Boolean(window["getSelection"]);
dijit.range.create=function(win){
if(dijit.range._w3c){
return (win||dojo.global).document.createRange();
}else{
return new dijit.range.W3CRange;
}
};
dijit.range.getSelection=function(win,_4b){
if(dijit.range._w3c){
return win.getSelection();
}else{
var s=new dijit.range.ie.selection(win);
if(!_4b){
s._getCurrentSelection();
}
return s;
}
};
if(!dijit.range._w3c){
dijit.range.ie={cachedSelection:{},selection:function(win){
this._ranges=[];
this.addRange=function(r,_4c){
this._ranges.push(r);
if(!_4c){
r._select();
}
this.rangeCount=this._ranges.length;
};
this.removeAllRanges=function(){
this._ranges=[];
this.rangeCount=0;
};
var _4d=function(){
var r=win.document.selection.createRange();
var _4e=win.document.selection.type.toUpperCase();
if(_4e=="CONTROL"){
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
var r=_4d();
if(r){
this.addRange(r,true);
}
};
},decomposeControlRange:function(_4f){
var _50=_4f.item(0),_51=_4f.item(_4f.length-1);
var _52=_50.parentNode,_53=_51.parentNode;
var _54=dijit.range.getIndex(_50,_52).o;
var _55=dijit.range.getIndex(_51,_53).o+1;
return [_52,_54,_53,_55];
},getEndPoint:function(_56,end){
var _57=_56.duplicate();
_57.collapse(!end);
var _58="EndTo"+(end?"End":"Start");
var _59=_57.parentElement();
var _5a,_5b,_5c;
if(_59.childNodes.length>0){
dojo.every(_59.childNodes,function(_5d,i){
var _5e;
if(_5d.nodeType!=3){
_57.moveToElementText(_5d);
if(_57.compareEndPoints(_58,_56)>0){
if(_5c&&_5c.nodeType==3){
_5a=_5c;
_5e=true;
}else{
_5a=_59;
_5b=i;
return false;
}
}else{
if(i==_59.childNodes.length-1){
_5a=_59;
_5b=_59.childNodes.length;
return false;
}
}
}else{
if(i==_59.childNodes.length-1){
_5a=_5d;
_5e=true;
}
}
if(_5e&&_5a){
var _5f=dijit.range.adjacentNoneTextNode(_5a)[0];
if(_5f){
_5a=_5f.nextSibling;
}else{
_5a=_59.firstChild;
}
var _60=dijit.range.adjacentNoneTextNode(_5a);
_5f=_60[0];
var _61=_60[1];
if(_5f){
_57.moveToElementText(_5f);
_57.collapse(false);
}else{
_57.moveToElementText(_59);
}
_57.setEndPoint(_58,_56);
_5b=_57.text.length-_61;
return false;
}
_5c=_5d;
return true;
});
}else{
_5a=_59;
_5b=0;
}
if(!end&&_5a.nodeType==1&&_5b==_5a.childNodes.length){
var _62=_5a.nextSibling;
if(_62&&_62.nodeType==3){
_5a=_62;
_5b=0;
}
}
return [_5a,_5b];
},setEndPoint:function(_63,_64,_65){
var _66=_63.duplicate(),_67,len;
if(_64.nodeType!=3){
if(_65>0){
_67=_64.childNodes[_65-1];
if(_67){
if(_67.nodeType==3){
_64=_67;
_65=_67.length;
}else{
if(_67.nextSibling&&_67.nextSibling.nodeType==3){
_64=_67.nextSibling;
_65=0;
}else{
_66.moveToElementText(_67.nextSibling?_67:_64);
var _68=_67.parentNode;
var _69=_68.insertBefore(_67.ownerDocument.createTextNode(" "),_67.nextSibling);
_66.collapse(false);
_68.removeChild(_69);
}
}
}
}else{
_66.moveToElementText(_64);
_66.collapse(true);
}
}
if(_64.nodeType==3){
var _6a=dijit.range.adjacentNoneTextNode(_64);
var _6b=_6a[0];
len=_6a[1];
if(_6b){
_66.moveToElementText(_6b);
_66.collapse(false);
if(_6b.contentEditable!="inherit"){
len++;
}
}else{
_66.moveToElementText(_64.parentNode);
_66.collapse(true);
}
_65+=len;
if(_65>0){
if(_66.move("character",_65)!=_65){
console.error("Error when moving!");
}
}
}
return _66;
},decomposeTextRange:function(_6c){
var _6d=dijit.range.ie.getEndPoint(_6c);
var _6e=_6d[0],_6f=_6d[1];
var _70=_6d[0],_71=_6d[1];
if(_6c.htmlText.length){
if(_6c.htmlText==_6c.text){
_71=_6f+_6c.text.length;
}else{
_6d=dijit.range.ie.getEndPoint(_6c,true);
_70=_6d[0],_71=_6d[1];
}
}
return [_6e,_6f,_70,_71];
},setRange:function(_72,_73,_74,_75,_76,_77){
var _78=dijit.range.ie.setEndPoint(_72,_73,_74);
_72.setEndPoint("StartToStart",_78);
if(!_77){
var end=dijit.range.ie.setEndPoint(_72,_75,_76);
}
_72.setEndPoint("EndToEnd",end||_78);
return _72;
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
},setStart:function(_79,_7a){
_7a=parseInt(_7a);
if(this.startContainer===_79&&this.startOffset==_7a){
return;
}
delete this._cachedBookmark;
this.startContainer=_79;
this.startOffset=_7a;
if(!this.endContainer){
this.setEnd(_79,_7a);
}else{
this._updateInternal();
}
},setEnd:function(_7b,_7c){
_7c=parseInt(_7c);
if(this.endContainer===_7b&&this.endOffset==_7c){
return;
}
delete this._cachedBookmark;
this.endContainer=_7b;
this.endOffset=_7c;
if(!this.startContainer){
this.setStart(_7b,_7c);
}else{
this._updateInternal();
}
},setStartAfter:function(_7d,_7e){
this._setPoint("setStart",_7d,_7e,1);
},setStartBefore:function(_7f,_80){
this._setPoint("setStart",_7f,_80,0);
},setEndAfter:function(_81,_82){
this._setPoint("setEnd",_81,_82,1);
},setEndBefore:function(_83,_84){
this._setPoint("setEnd",_83,_84,0);
},_setPoint:function(_85,_86,_87,ext){
var _88=dijit.range.getIndex(_86,_86.parentNode).o;
this[_85](_86.parentNode,_88.pop()+ext);
},_getIERange:function(){
var r=(this._body||this.endContainer.ownerDocument.body).createTextRange();
dijit.range.ie.setRange(r,this.startContainer,this.startOffset,this.endContainer,this.endOffset,this.collapsed);
return r;
},getBookmark:function(_89){
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
dijit._editor.escapeXml=function(str,_8a){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_8a){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dijit._editor.getNodeHtml=function(_8b){
var _8c;
switch(_8b.nodeType){
case 1:
var _8d=_8b.nodeName.toLowerCase();
if(!_8d||_8d.charAt(0)=="/"){
return "";
}
_8c="<"+_8d;
var _8e=[];
var _8f;
if(dojo.isIE&&_8b.outerHTML){
var s=_8b.outerHTML;
s=s.substr(0,s.indexOf(">")).replace(/(['"])[^"']*\1/g,"");
var reg=/(\b\w+)\s?=/g;
var m,key;
while((m=reg.exec(s))){
key=m[1];
if(key.substr(0,3)!="_dj"){
if(key=="src"||key=="href"){
if(_8b.getAttribute("_djrealurl")){
_8e.push([key,_8b.getAttribute("_djrealurl")]);
continue;
}
}
var val,_90;
switch(key){
case "style":
val=_8b.style.cssText.toLowerCase();
break;
case "class":
val=_8b.className;
break;
case "width":
if(_8d==="img"){
_90=/width=(\S+)/i.exec(s);
if(_90){
val=_90[1];
}
break;
}
case "height":
if(_8d==="img"){
_90=/height=(\S+)/i.exec(s);
if(_90){
val=_90[1];
}
break;
}
default:
val=_8b.getAttribute(key);
}
if(val!=null){
_8e.push([key,val.toString()]);
}
}
}
}else{
var i=0;
while((_8f=_8b.attributes[i++])){
var n=_8f.name;
if(n.substr(0,3)!="_dj"){
var v=_8f.value;
if(n=="src"||n=="href"){
if(_8b.getAttribute("_djrealurl")){
v=_8b.getAttribute("_djrealurl");
}
}
_8e.push([n,v]);
}
}
}
_8e.sort(function(a,b){
return a[0]<b[0]?-1:(a[0]==b[0]?0:1);
});
var j=0;
while((_8f=_8e[j++])){
_8c+=" "+_8f[0]+"=\""+(dojo.isString(_8f[1])?dijit._editor.escapeXml(_8f[1],true):_8f[1])+"\"";
}
if(_8d==="script"){
_8c+=">"+_8b.innerHTML+"</"+_8d+">";
}else{
if(_8b.childNodes.length){
_8c+=">"+dijit._editor.getChildrenHtml(_8b)+"</"+_8d+">";
}else{
switch(_8d){
case "br":
case "hr":
case "img":
case "input":
case "base":
case "meta":
case "area":
case "basefont":
_8c+=" />";
break;
default:
_8c+="></"+_8d+">";
}
}
}
break;
case 4:
case 3:
_8c=dijit._editor.escapeXml(_8b.nodeValue,true);
break;
case 8:
_8c="<!--"+dijit._editor.escapeXml(_8b.nodeValue,true)+"-->";
break;
default:
_8c="<!-- Element not recognized - Type: "+_8b.nodeType+" Name: "+_8b.nodeName+"-->";
}
return _8c;
};
dijit._editor.getChildrenHtml=function(dom){
var out="";
if(!dom){
return out;
}
var _91=dom["childNodes"]||dom;
var _92=!dojo.isIE||_91!==dom;
var _93,i=0;
while((_93=_91[i++])){
if(!_92||_93.parentNode==dom){
out+=dijit._editor.getNodeHtml(_93);
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
var _94=dojo.doc.createElement("textarea");
_94.id=dijit._scopeName+"._editor.RichText.value";
dojo.style(_94,{display:"none",position:"absolute",top:"-100px",height:"3px",width:"3px"});
dojo.body().appendChild(_94);
})();
}else{
try{
dojo.doc.write("<textarea id=\""+dijit._scopeName+"._editor.RichText.value\" "+"style=\"display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;\"></textarea>");
}
catch(e){
}
}
}
dojo.declare("dijit._editor.RichText",[dijit._Widget,dijit._CssStateMixin],{constructor:function(_95){
this.contentPreFilters=[];
this.contentPostFilters=[];
this.contentDomPreFilters=[];
this.contentDomPostFilters=[];
this.editingAreaStyleSheets=[];
this.events=[].concat(this.events);
this._keyHandlers={};
if(_95&&dojo.isString(_95.value)){
this.value=_95.value;
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
var _96=dojo.hitch(this,function(cmd,arg){
return function(){
return !this.execCommand(cmd,arg);
};
});
var _97={b:_96("bold"),i:_96("italic"),u:_96("underline"),a:_96("selectall"),s:function(){
this.save(true);
},m:function(){
this.isTabIndent=!this.isTabIndent;
},"1":_96("formatblock","h1"),"2":_96("formatblock","h2"),"3":_96("formatblock","h3"),"4":_96("formatblock","h4"),"\\":_96("insertunorderedlist")};
if(!dojo.isIE){
_97.Z=_96("redo");
}
for(var key in _97){
this.addKeyHandler(key,true,false,_97[key]);
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
var _98=["div","p","pre","h1","h2","h3","h4","h5","h6","ol","ul","address"];
var _99="",_9a,i=0;
while((_9a=_98[i++])){
if(_9a.charAt(1)!=="l"){
_99+="<"+_9a+"><span>content</span></"+_9a+"><br/>";
}else{
_99+="<"+_9a+"><li>content</li></"+_9a+"><br/>";
}
}
var _9b={position:"absolute",top:"0px",zIndex:10,opacity:0.01};
var div=dojo.create("div",{style:_9b,innerHTML:_99});
dojo.body().appendChild(div);
var _9c=dojo.hitch(this,function(){
var _9d=div.firstChild;
while(_9d){
try{
dijit._editor.selection.selectElement(_9d.firstChild);
var _9e=_9d.tagName.toLowerCase();
this._local2NativeFormatNames[_9e]=document.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_9e]]=_9e;
_9d=_9d.nextSibling.nextSibling;
}
catch(e){
}
}
div.parentNode.removeChild(div);
div.innerHTML="";
});
setTimeout(_9c,0);
},open:function(_9f){
if(!this.onLoadDeferred||this.onLoadDeferred.fired>=0){
this.onLoadDeferred=new dojo.Deferred();
}
if(!this.isClosed){
this.close();
}
dojo.publish(dijit._scopeName+"._editor.RichText::open",[this]);
if(arguments.length==1&&_9f.nodeName){
this.domNode=_9f;
}
var dn=this.domNode;
var _a0;
if(dojo.isString(this.value)){
_a0=this.value;
delete this.value;
dn.innerHTML="";
}else{
if(dn.nodeName&&dn.nodeName.toLowerCase()=="textarea"){
var ta=(this.textarea=dn);
this.name=ta.name;
_a0=ta.value;
dn=this.domNode=dojo.doc.createElement("div");
dn.setAttribute("widgetId",this.id);
ta.removeAttribute("widgetId");
dn.cssText=ta.cssText;
dn.className+=" "+ta.className;
dojo.place(dn,ta,"before");
var _a1=dojo.hitch(this,function(){
dojo.style(ta,{display:"block",position:"absolute",top:"-1000px"});
if(dojo.isIE){
var s=ta.style;
this.__overflow=s.overflow;
s.overflow="hidden";
}
});
if(dojo.isIE){
setTimeout(_a1,10);
}else{
_a1();
}
if(ta.form){
var _a2=ta.value;
this.reset=function(){
var _a3=this.getValue();
if(_a3!=_a2){
this.replaceValue(_a2);
}
};
dojo.connect(ta.form,"onsubmit",this,function(){
dojo.attr(ta,"disabled",this.disabled);
ta.value=this.getValue();
});
}
}else{
_a0=dijit._editor.getChildrenHtml(dn);
dn.innerHTML="";
}
}
var _a4=dojo.contentBox(dn);
this._oldHeight=_a4.h;
this._oldWidth=_a4.w;
this.value=_a0;
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
var _a5=dojo.byId(dijit._scopeName+"._editor.RichText.value");
if(_a5&&_a5.value!==""){
var _a6=_a5.value.split(this._SEPARATOR),i=0,dat;
while((dat=_a6[i++])){
var _a7=dat.split(this._NAME_CONTENT_SEP);
if(_a7[0]==this.name){
_a0=_a7[1];
_a6=_a6.splice(i,1);
_a5.value=_a6.join(this._SEPARATOR);
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
this.onLoad(_a0);
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
var _a8=dojo.getComputedStyle(this.domNode);
var _a9="";
var _aa=true;
if(dojo.isIE||dojo.isWebKit||(!this.height&&!dojo.isMoz)){
_a9="<div id='dijitEditorBody'></div>";
_aa=false;
}else{
if(dojo.isMoz){
this._cursorToStart=true;
_a9="&nbsp;";
}
}
var _ab=[_a8.fontWeight,_a8.fontSize,_a8.fontFamily].join(" ");
var _ac=_a8.lineHeight;
if(_ac.indexOf("px")>=0){
_ac=parseFloat(_ac)/parseFloat(_a8.fontSize);
}else{
if(_ac.indexOf("em")>=0){
_ac=parseFloat(_ac);
}else{
_ac="normal";
}
}
var _ad="";
var _ae=this;
this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig,function(_af){
_af=_af.replace(/^;/ig,"")+";";
var s=_af.split(":")[0];
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
dojo.style(_ae.domNode,sC,"");
}
_ad+=_af+";";
});
var _b0=dojo.query("label[for=\""+this.id+"\"]");
return [this.isLeftToRight()?"<html>\n<head>\n":"<html dir='rtl'>\n<head>\n",(dojo.isMoz&&_b0.length?"<title>"+_b0[0].innerHTML+"</title>\n":""),"<meta http-equiv='Content-Type' content='text/html'>\n","<style>\n","\tbody,html {\n","\t\tbackground:transparent;\n","\t\tpadding: 1px 0 0 0;\n","\t\tmargin: -1px 0 0 0;\n",((dojo.isWebKit)?"\t\twidth: 100%;\n":""),((dojo.isWebKit)?"\t\theight: 100%;\n":""),"\t}\n","\tbody{\n","\t\ttop:0px;\n","\t\tleft:0px;\n","\t\tright:0px;\n","\t\tfont:",_ab,";\n",((this.height||dojo.isOpera)?"":"\t\tposition: fixed;\n"),"\t\tmin-height:",this.minHeight,";\n","\t\tline-height:",_ac,";\n","\t}\n","\tp{ margin: 1em 0; }\n",(!_aa&&!this.height?"\tbody,html {overflow-y: hidden;}\n":""),"\t#dijitEditorBody{overflow-x: auto; overflow-y:"+(this.height?"auto;":"hidden;")+" outline: 0px;}\n","\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",(!dojo.isIE?"\tli{ min-height:1.2em; }\n":""),"</style>\n",this._applyEditingAreaStyleSheets(),"\n","</head>\n<body ",(_aa?"id='dijitEditorBody' ":""),"onload='frameElement._loadFunc(window,document)' style='"+_ad+"'>",_a9,"</body>\n</html>"].join("");
},_applyEditingAreaStyleSheets:function(){
var _b1=[];
if(this.styleSheets){
_b1=this.styleSheets.split(";");
this.styleSheets="";
}
_b1=_b1.concat(this.editingAreaStyleSheets);
this.editingAreaStyleSheets=[];
var _b2="",i=0,url;
while((url=_b1[i++])){
var _b3=(new dojo._Url(dojo.global.location,url)).toString();
this.editingAreaStyleSheets.push(_b3);
_b2+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_b3+"\"/>";
}
return _b2;
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
var _b4=this.document.getElementsByTagName("head")[0];
var _b5=this.document.createElement("link");
_b5.rel="stylesheet";
_b5.type="text/css";
_b5.href=url;
_b4.appendChild(_b5);
}
}));
},removeStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo._Url(dojo.global.location,url)).toString();
}
var _b6=dojo.indexOf(this.editingAreaStyleSheets,url);
if(_b6==-1){
return;
}
delete this.editingAreaStyleSheets[_b6];
dojo.withGlobal(this.window,"query",dojo,["link:[href=\""+url+"\"]"]).orphan();
},disabled:false,_mozSettingProps:{"styleWithCSS":false},_setDisabledAttr:function(_b7){
_b7=!!_b7;
this._set("disabled",_b7);
if(!this.isLoaded){
return;
}
if(dojo.isIE||dojo.isWebKit||dojo.isOpera){
var _b8=dojo.isIE&&(this.isLoaded||!this.focusOnLoad);
if(_b8){
this.editNode.unselectable="on";
}
this.editNode.contentEditable=!_b7;
if(_b8){
var _b9=this;
setTimeout(function(){
_b9.editNode.unselectable="off";
},0);
}
}else{
try{
this.document.designMode=(_b7?"off":"on");
}
catch(e){
return;
}
if(!_b7&&this._mozSettingProps){
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
},onLoad:function(_ba){
if(!this.window.__registeredWindow){
this.window.__registeredWindow=true;
this._iframeRegHandle=dijit.registerIframe(this.iframe);
}
if(!dojo.isIE&&!dojo.isWebKit&&(this.height||dojo.isMoz)){
this.editNode=this.document.body;
}else{
this.editNode=this.document.body.firstChild;
var _bb=this;
if(dojo.isIE){
this.tabStop=dojo.create("div",{tabIndex:-1},this.editingArea);
this.iframe.onfocus=function(){
_bb.editNode.setActive();
};
}
}
this.focusNode=this.editNode;
var _bc=this.events.concat(this.captureEvents);
var ap=this.iframe?this.document:this.editNode;
dojo.forEach(_bc,function(_bd){
this.connect(ap,_bd.toLowerCase(),_bd);
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
var _be=dojo.hitch(this,function(){
this.setValue(_ba);
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
this.setValueDeferred.addCallback(_be);
}else{
_be();
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
},setDisabled:function(_bf){
dojo.deprecated("dijit.Editor::setDisabled is deprecated","use dijit.Editor::attr(\"disabled\",boolean) instead",2);
this.set("disabled",_bf);
},_setValueAttr:function(_c0){
this.setValue(_c0);
},_setDisableSpellCheckAttr:function(_c1){
if(this.document){
dojo.attr(this.document.body,"spellcheck",!_c1);
}else{
this.onLoadDeferred.addCallback(dojo.hitch(this,function(){
dojo.attr(this.document.body,"spellcheck",!_c1);
}));
}
this._set("disableSpellCheck",_c1);
},onKeyPress:function(e){
var c=(e.keyChar&&e.keyChar.toLowerCase())||e.keyCode,_c2=this._keyHandlers[c],_c3=arguments;
if(_c2&&!e.altKey){
dojo.some(_c2,function(h){
if(!(h.shift^e.shiftKey)&&!(h.ctrl^(e.ctrlKey||e.metaKey))){
if(!h.handler.apply(this,_c3)){
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
},addKeyHandler:function(key,_c4,_c5,_c6){
if(!dojo.isArray(this._keyHandlers[key])){
this._keyHandlers[key]=[];
}
this._keyHandlers[key].push({shift:_c5||false,ctrl:_c4||false,handler:_c6});
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
var _c7=this.getValue(true);
if(_c7!=this.value){
this.onChange(_c7);
}
this._set("value",_c7);
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
},onChange:function(_c8){
},_normalizeCommand:function(cmd,_c9){
var _ca=cmd.toLowerCase();
if(_ca=="formatblock"){
if(dojo.isSafari&&_c9===undefined){
_ca="heading";
}
}else{
if(_ca=="hilitecolor"&&!dojo.isMoz){
_ca="backcolor";
}
}
return _ca;
},_qcaCache:{},queryCommandAvailable:function(_cb){
var ca=this._qcaCache[_cb];
if(ca!==undefined){
return ca;
}
return (this._qcaCache[_cb]=this._queryCommandAvailable(_cb));
},_queryCommandAvailable:function(_cc){
var ie=1;
var _cd=1<<1;
var _ce=1<<2;
var _cf=1<<3;
function _d0(_d1){
return {ie:Boolean(_d1&ie),mozilla:Boolean(_d1&_cd),webkit:Boolean(_d1&_ce),opera:Boolean(_d1&_cf)};
};
var _d2=null;
switch(_cc.toLowerCase()){
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
_d2=_d0(_cd|ie|_ce|_cf);
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
_d2=_d0(_cd|ie|_cf|_ce);
break;
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
_d2=_d0(ie);
break;
case "cut":
case "copy":
case "paste":
_d2=_d0(ie|_cd|_ce);
break;
case "inserttable":
_d2=_d0(_cd|ie);
break;
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
_d2=_d0(ie|_cd);
break;
default:
return false;
}
return (dojo.isIE&&_d2.ie)||(dojo.isMoz&&_d2.mozilla)||(dojo.isWebKit&&_d2.webkit)||(dojo.isOpera&&_d2.opera);
},execCommand:function(_d3,_d4){
var _d5;
this.focus();
_d3=this._normalizeCommand(_d3,_d4);
if(_d4!==undefined){
if(_d3=="heading"){
throw new Error("unimplemented");
}else{
if((_d3=="formatblock")&&dojo.isIE){
_d4="<"+_d4+">";
}
}
}
var _d6="_"+_d3+"Impl";
if(this[_d6]){
_d5=this[_d6](_d4);
}else{
_d4=arguments.length>1?_d4:null;
if(_d4||_d3!="createlink"){
_d5=this.document.execCommand(_d3,false,_d4);
}
}
this.onDisplayChanged();
return _d5;
},queryCommandEnabled:function(_d7){
if(this.disabled||!this._disabledOK){
return false;
}
_d7=this._normalizeCommand(_d7);
if(dojo.isMoz||dojo.isWebKit){
if(_d7=="unlink"){
return this._sCall("hasAncestorElement",["a"]);
}else{
if(_d7=="inserttable"){
return true;
}
}
}
if(dojo.isWebKit){
if(_d7=="cut"||_d7=="copy"){
var sel=this.window.getSelection();
if(sel){
sel=sel.toString();
}
return !!sel;
}else{
if(_d7=="paste"){
return true;
}
}
}
var _d8=dojo.isIE?this.document.selection.createRange():this.document;
try{
return _d8.queryCommandEnabled(_d7);
}
catch(e){
return false;
}
},queryCommandState:function(_d9){
if(this.disabled||!this._disabledOK){
return false;
}
_d9=this._normalizeCommand(_d9);
try{
return this.document.queryCommandState(_d9);
}
catch(e){
return false;
}
},queryCommandValue:function(_da){
if(this.disabled||!this._disabledOK){
return false;
}
var r;
_da=this._normalizeCommand(_da);
if(dojo.isIE&&_da=="formatblock"){
r=this._native2LocalFormatNames[this.document.queryCommandValue(_da)];
}else{
if(dojo.isMoz&&_da==="hilitecolor"){
var _db;
try{
_db=this.document.queryCommandValue("styleWithCSS");
}
catch(e){
_db=false;
}
this.document.execCommand("styleWithCSS",false,true);
r=this.document.queryCommandValue(_da);
this.document.execCommand("styleWithCSS",false,_db);
}else{
r=this.document.queryCommandValue(_da);
}
}
return r;
},_sCall:function(_dc,_dd){
return dojo.withGlobal(this.window,_dc,dijit._editor.selection,_dd);
},placeCursorAtStart:function(){
this.focus();
var _de=false;
if(dojo.isMoz){
var _df=this.editNode.firstChild;
while(_df){
if(_df.nodeType==3){
if(_df.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_de=true;
this._sCall("selectElement",[_df]);
break;
}
}else{
if(_df.nodeType==1){
_de=true;
var tg=_df.tagName?_df.tagName.toLowerCase():"";
if(/br|input|img|base|meta|area|basefont|hr|link/.test(tg)){
this._sCall("selectElement",[_df]);
}else{
this._sCall("selectElementChildren",[_df]);
}
break;
}
}
_df=_df.nextSibling;
}
}else{
_de=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_de){
this._sCall("collapse",[true]);
}
},placeCursorAtEnd:function(){
this.focus();
var _e0=false;
if(dojo.isMoz){
var _e1=this.editNode.lastChild;
while(_e1){
if(_e1.nodeType==3){
if(_e1.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_e0=true;
this._sCall("selectElement",[_e1]);
break;
}
}else{
if(_e1.nodeType==1){
_e0=true;
if(_e1.lastChild){
this._sCall("selectElement",[_e1.lastChild]);
}else{
this._sCall("selectElement",[_e1]);
}
break;
}
}
_e1=_e1.previousSibling;
}
}else{
_e0=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_e0){
this._sCall("collapse",[false]);
}
},getValue:function(_e2){
if(this.textarea){
if(this.isClosed||!this.isLoaded){
return this.textarea.value;
}
}
return this._postFilterContent(null,_e2);
},_getValueAttr:function(){
return this.getValue(true);
},setValue:function(_e3){
if(!this.isLoaded){
this.onLoadDeferred.addCallback(dojo.hitch(this,function(){
this.setValue(_e3);
}));
return;
}
this._cursorToStart=true;
if(this.textarea&&(this.isClosed||!this.isLoaded)){
this.textarea.value=_e3;
}else{
_e3=this._preFilterContent(_e3);
var _e4=this.isClosed?this.domNode:this.editNode;
if(_e3&&dojo.isMoz&&_e3.toLowerCase()=="<p></p>"){
_e3="<p>&nbsp;</p>";
}
if(!_e3&&dojo.isWebKit){
_e3="&nbsp;";
}
_e4.innerHTML=_e3;
this._preDomFilterContent(_e4);
}
this.onDisplayChanged();
this._set("value",this.getValue(true));
},replaceValue:function(_e5){
if(this.isClosed){
this.setValue(_e5);
}else{
if(this.window&&this.window.getSelection&&!dojo.isMoz){
this.setValue(_e5);
}else{
if(this.window&&this.window.getSelection){
_e5=this._preFilterContent(_e5);
this.execCommand("selectall");
if(!_e5){
this._cursorToStart=true;
_e5="&nbsp;";
}
this.execCommand("inserthtml",_e5);
this._preDomFilterContent(this.editNode);
}else{
if(this.document&&this.document.selection){
this.setValue(_e5);
}
}
}
}
this._set("value",this.getValue(true));
},_preFilterContent:function(_e6){
var ec=_e6;
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
},_postFilterContent:function(dom,_e7){
var ec;
if(!dojo.isString(dom)){
dom=dom||this.editNode;
if(this.contentDomPostFilters.length){
if(_e7){
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
var _e8=dojo.byId(dijit._scopeName+"._editor.RichText.value");
if(_e8.value){
_e8.value+=this._SEPARATOR;
}
_e8.value+=this.name+this._NAME_CONTENT_SEP+this.getValue(true);
},escapeXml:function(str,_e9){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_e9){
str=str.replace(/'/gm,"&#39;");
}
return str;
},getNodeHtml:function(_ea){
dojo.deprecated("dijit.Editor::getNodeHtml is deprecated","use dijit._editor.getNodeHtml instead",2);
return dijit._editor.getNodeHtml(_ea);
},getNodeChildrenHtml:function(dom){
dojo.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated","use dijit._editor.getChildrenHtml instead",2);
return dijit._editor.getChildrenHtml(dom);
},close:function(_eb){
if(this.isClosed){
return;
}
if(!arguments.length){
_eb=true;
}
if(_eb){
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
},_removeMozBogus:function(_ec){
return _ec.replace(/\stype="_moz"/gi,"").replace(/\s_moz_dirty=""/gi,"").replace(/_moz_resizing="(true|false)"/gi,"");
},_removeWebkitBogus:function(_ed){
_ed=_ed.replace(/\sclass="webkit-block-placeholder"/gi,"");
_ed=_ed.replace(/\sclass="apple-style-span"/gi,"");
_ed=_ed.replace(/<meta charset=\"utf-8\" \/>/gi,"");
return _ed;
},_normalizeFontStyle:function(_ee){
return _ee.replace(/<(\/)?strong([ \>])/gi,"<$1b$2").replace(/<(\/)?em([ \>])/gi,"<$1i$2");
},_preFixUrlAttributes:function(_ef){
return _ef.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2");
},_inserthorizontalruleImpl:function(_f0){
if(dojo.isIE){
return this._inserthtmlImpl("<hr>");
}
return this.document.execCommand("inserthorizontalrule",false,_f0);
},_unlinkImpl:function(_f1){
if((this.queryCommandEnabled("unlink"))&&(dojo.isMoz||dojo.isWebKit)){
var a=this._sCall("getAncestorElement",["a"]);
this._sCall("selectElement",[a]);
return this.document.execCommand("unlink",false,null);
}
return this.document.execCommand("unlink",false,_f1);
},_hilitecolorImpl:function(_f2){
var _f3;
if(dojo.isMoz){
this.document.execCommand("styleWithCSS",false,true);
_f3=this.document.execCommand("hilitecolor",false,_f2);
this.document.execCommand("styleWithCSS",false,false);
}else{
_f3=this.document.execCommand("hilitecolor",false,_f2);
}
return _f3;
},_backcolorImpl:function(_f4){
if(dojo.isIE){
_f4=_f4?_f4:null;
}
return this.document.execCommand("backcolor",false,_f4);
},_forecolorImpl:function(_f5){
if(dojo.isIE){
_f5=_f5?_f5:null;
}
return this.document.execCommand("forecolor",false,_f5);
},_inserthtmlImpl:function(_f6){
_f6=this._preFilterContent(_f6);
var rv=true;
if(dojo.isIE){
var _f7=this.document.selection.createRange();
if(this.document.selection.type.toUpperCase()=="CONTROL"){
var n=_f7.item(0);
while(_f7.length){
_f7.remove(_f7.item(0));
}
n.outerHTML=_f6;
}else{
_f7.pasteHTML(_f6);
}
_f7.select();
}else{
if(dojo.isMoz&&!_f6.length){
this._sCall("remove");
}else{
rv=this.document.execCommand("inserthtml",false,_f6);
}
}
return rv;
},_boldImpl:function(_f8){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("bold",false,_f8);
},_italicImpl:function(_f9){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("italic",false,_f9);
},_underlineImpl:function(_fa){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("underline",false,_fa);
},_strikethroughImpl:function(_fb){
if(dojo.isIE){
this._adaptIESelection();
}
return this.document.execCommand("strikethrough",false,_fb);
},getHeaderHeight:function(){
return this._getNodeChildrenHeight(this.header);
},getFooterHeight:function(){
return this._getNodeChildrenHeight(this.footer);
},_getNodeChildrenHeight:function(_fc){
var h=0;
if(_fc&&_fc.childNodes){
var i;
for(i=0;i<_fc.childNodes.length;i++){
var _fd=dojo.position(_fc.childNodes[i]);
h+=_fd.h;
}
}
return h;
},_isNodeEmpty:function(_fe,_ff){
if(_fe.nodeType==1){
if(_fe.childNodes.length>0){
return this._isNodeEmpty(_fe.childNodes[0],_ff);
}
return true;
}else{
if(_fe.nodeType==3){
return (_fe.nodeValue.substring(_ff)=="");
}
}
return false;
},_removeStartingRangeFromRange:function(node,_100){
if(node.nextSibling){
_100.setStart(node.nextSibling,0);
}else{
var _101=node.parentNode;
while(_101&&_101.nextSibling==null){
_101=_101.parentNode;
}
if(_101){
_100.setStart(_101.nextSibling,0);
}
}
return _100;
},_adaptIESelection:function(){
var _102=dijit.range.getSelection(this.window);
if(_102&&_102.rangeCount&&!_102.isCollapsed){
var _103=_102.getRangeAt(0);
var _104=_103.startContainer;
var _105=_103.startOffset;
while(_104.nodeType==3&&_105>=_104.length&&_104.nextSibling){
_105=_105-_104.length;
_104=_104.nextSibling;
}
var _106=null;
while(this._isNodeEmpty(_104,_105)&&_104!=_106){
_106=_104;
_103=this._removeStartingRangeFromRange(_104,_103);
_104=_103.startContainer;
_105=0;
}
_102.removeAllRanges();
_102.addRange(_103);
}
}});
}
if(!dojo._hasResource["dijit._KeyNavContainer"]){
dojo._hasResource["dijit._KeyNavContainer"]=true;
dojo.provide("dijit._KeyNavContainer");
dojo.declare("dijit._KeyNavContainer",dijit._Container,{tabIndex:"0",_keyNavCodes:{},connectKeyNavHandlers:function(_107,_108){
var _109=(this._keyNavCodes={});
var prev=dojo.hitch(this,this.focusPrev);
var next=dojo.hitch(this,this.focusNext);
dojo.forEach(_107,function(code){
_109[code]=prev;
});
dojo.forEach(_108,function(code){
_109[code]=next;
});
_109[dojo.keys.HOME]=dojo.hitch(this,"focusFirstChild");
_109[dojo.keys.END]=dojo.hitch(this,"focusLastChild");
this.connect(this.domNode,"onkeypress","_onContainerKeypress");
this.connect(this.domNode,"onfocus","_onContainerFocus");
},startupKeyNavChildren:function(){
dojo.forEach(this.getChildren(),dojo.hitch(this,"_startupChild"));
},addChild:function(_10a,_10b){
dijit._KeyNavContainer.superclass.addChild.apply(this,arguments);
this._startupChild(_10a);
},focus:function(){
this.focusFirstChild();
},focusFirstChild:function(){
var _10c=this._getFirstFocusableChild();
if(_10c){
this.focusChild(_10c);
}
},focusLastChild:function(){
var _10d=this._getLastFocusableChild();
if(_10d){
this.focusChild(_10d);
}
},focusNext:function(){
var _10e=this._getNextFocusableChild(this.focusedChild,1);
this.focusChild(_10e);
},focusPrev:function(){
var _10f=this._getNextFocusableChild(this.focusedChild,-1);
this.focusChild(_10f,true);
},focusChild:function(_110,last){
if(this.focusedChild&&_110!==this.focusedChild){
this._onChildBlur(this.focusedChild);
}
_110.set("tabIndex",this.tabIndex);
_110.focus(last?"end":"start");
this._set("focusedChild",_110);
},_startupChild:function(_111){
_111.set("tabIndex","-1");
this.connect(_111,"_onFocus",function(){
_111.set("tabIndex",this.tabIndex);
});
this.connect(_111,"_onBlur",function(){
_111.set("tabIndex","-1");
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
var func=this._keyNavCodes[evt.charOrCode];
if(func){
func();
dojo.stopEvent(evt);
}
},_onChildBlur:function(_112){
},_getFirstFocusableChild:function(){
return this._getNextFocusableChild(null,1);
},_getLastFocusableChild:function(){
return this._getNextFocusableChild(null,-1);
},_getNextFocusableChild:function(_113,dir){
if(_113){
_113=this._getSiblingOfChild(_113,dir);
}
var _114=this.getChildren();
for(var i=0;i<_114.length;i++){
if(!_113){
_113=_114[(dir>0)?0:(_114.length-1)];
}
if(_113.isFocusable()){
return _113;
}
_113=this._getSiblingOfChild(_113,dir);
}
return null;
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
var _115=this.getLabel(this.command),_116=this.editor,_117=this.iconClassPrefix+" "+this.iconClassPrefix+this.command.charAt(0).toUpperCase()+this.command.substr(1);
if(!this.button){
var _118=dojo.mixin({label:_115,dir:_116.dir,lang:_116.lang,showLabel:false,iconClass:_117,dropDown:this.dropDown,tabIndex:"-1"},this.params||{});
this.button=new this.buttonClass(_118);
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
var e=this.editor,c=this.command,_119,_11a;
if(!e||!e.isLoaded||!c.length){
return;
}
var _11b=this.get("disabled");
if(this.button){
try{
_11a=!_11b&&e.queryCommandEnabled(c);
if(this.enabled!==_11a){
this.enabled=_11a;
this.button.set("disabled",!_11a);
}
if(typeof this.button.checked=="boolean"){
_119=e.queryCommandState(c);
if(this.checked!==_119){
this.checked=_119;
this.button.set("checked",e.queryCommandState(c));
}
}
}
catch(e){
}
}
},setEditor:function(_11c){
this.editor=_11c;
this._initButton();
if(this.button&&this.useDefaultCommand){
if(this.editor.queryCommandAvailable(this.command)){
this.connect(this.button,"onClick",dojo.hitch(this.editor,"execCommand",this.command,this.commandArg));
}else{
this.button.domNode.style.display="none";
}
}
this.connect(this.editor,"onNormalizedDisplayChanged","updateState");
},setToolbar:function(_11d){
if(this.button){
_11d.addChild(this.button);
}
},set:function(name,_11e){
if(typeof name==="object"){
for(var x in name){
this.set(x,name[x]);
}
return this;
}
var _11f=this._getAttrNames(name);
if(this[_11f.s]){
var _120=this[_11f.s].apply(this,Array.prototype.slice.call(arguments,1));
}else{
this._set(name,_11e);
}
return _120||this;
},get:function(name){
var _121=this._getAttrNames(name);
return this[_121.g]?this[_121.g]():this[name];
},_setDisabledAttr:function(_122){
this.disabled=_122;
this.updateState();
},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
var uc=name.charAt(0).toUpperCase()+name.substr(1);
return (apn[name]={s:"_set"+uc+"Attr",g:"_get"+uc+"Attr"});
},_set:function(name,_123){
var _124=this[name];
this[name]=_123;
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
},setEditor:function(_125){
if(this.editor===_125){
return;
}
this.editor=_125;
if(this.blockNodeForEnter=="BR"){
this.editor.customUndo=true;
_125.onLoadDeferred.addCallback(dojo.hitch(this,function(d){
this.connect(_125.document,"onkeypress",function(e){
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
_125.addKeyHandler(13,0,0,h);
_125.addKeyHandler(13,0,1,h);
this.connect(this.editor,"onKeyPressed","onKeyPressed");
}
}
},onKeyPressed:function(e){
if(this._checkListLater){
if(dojo.withGlobal(this.editor.window,"isCollapsed",dijit)){
var _126=dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,["LI"]);
if(!_126){
dijit._editor.RichText.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
var _127=dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,[this.blockNodeForEnter]);
if(_127){
_127.innerHTML=this.bogusHtmlContent;
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
if(_126.parentNode.parentNode.nodeName=="LI"){
_126=_126.parentNode.parentNode;
}
}
var fc=_126.firstChild;
if(fc&&fc.nodeType==1&&(fc.nodeName=="UL"||fc.nodeName=="OL")){
_126.insertBefore(fc.ownerDocument.createTextNode(" "),fc);
var _128=dijit.range.create(this.editor.window);
_128.setStart(_126.firstChild,0);
var _129=dijit.range.getSelection(this.editor.window,true);
_129.removeAllRanges();
_129.addRange(_128);
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
var _12a,_12b,_12c,_12d,_12e,_12f,doc=this.editor.document,br,rs,txt;
if(e.shiftKey){
var _130=dojo.withGlobal(this.editor.window,"getParentElement",dijit._editor.selection);
var _131=dijit.range.getAncestor(_130,this.blockNodes);
if(_131){
if(_131.tagName=="LI"){
return true;
}
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
if(!_12b.collapsed){
_12b.deleteContents();
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
}
if(dijit.range.atBeginningOfContainer(_131,_12b.startContainer,_12b.startOffset)){
br=doc.createElement("br");
_12c=dijit.range.create(this.editor.window);
_131.insertBefore(br,_131.firstChild);
_12c.setStartBefore(br.nextSibling);
_12a.removeAllRanges();
_12a.addRange(_12c);
}else{
if(dijit.range.atEndOfContainer(_131,_12b.startContainer,_12b.startOffset)){
_12c=dijit.range.create(this.editor.window);
br=doc.createElement("br");
_131.appendChild(br);
_131.appendChild(doc.createTextNode(" "));
_12c.setStart(_131.lastChild,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
}else{
rs=_12b.startContainer;
if(rs&&rs.nodeType==3){
txt=rs.nodeValue;
dojo.withGlobal(this.editor.window,function(){
_12d=doc.createTextNode(txt.substring(0,_12b.startOffset));
_12e=doc.createTextNode(txt.substring(_12b.startOffset));
_12f=doc.createElement("br");
if(_12e.nodeValue==""&&dojo.isWebKit){
_12e=doc.createTextNode(" ");
}
dojo.place(_12d,rs,"after");
dojo.place(_12f,_12d,"after");
dojo.place(_12e,_12f,"after");
dojo.destroy(rs);
_12c=dijit.range.create(dojo.gobal);
_12c.setStart(_12e,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
});
return false;
}
return true;
}
}
}else{
_12a=dijit.range.getSelection(this.editor.window);
if(_12a.rangeCount){
_12b=_12a.getRangeAt(0);
if(_12b&&_12b.startContainer){
if(!_12b.collapsed){
_12b.deleteContents();
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
}
rs=_12b.startContainer;
if(rs&&rs.nodeType==3){
dojo.withGlobal(this.editor.window,dojo.hitch(this,function(){
var _132=false;
var _133=_12b.startOffset;
if(rs.length<_133){
ret=this._adjustNodeAndOffset(rs,_133);
rs=ret.node;
_133=ret.offset;
}
txt=rs.nodeValue;
_12d=doc.createTextNode(txt.substring(0,_133));
_12e=doc.createTextNode(txt.substring(_133));
_12f=doc.createElement("br");
if(!_12e.length){
_12e=doc.createTextNode(" ");
_132=true;
}
if(_12d.length){
dojo.place(_12d,rs,"after");
}else{
_12d=rs;
}
dojo.place(_12f,_12d,"after");
dojo.place(_12e,_12f,"after");
dojo.destroy(rs);
_12c=dijit.range.create(dojo.gobal);
_12c.setStart(_12e,0);
_12c.setEnd(_12e,_12e.length);
_12a.removeAllRanges();
_12a.addRange(_12c);
if(_132&&!dojo.isWebKit){
dijit._editor.selection.remove();
}else{
dijit._editor.selection.collapse(true);
}
}));
}else{
dojo.withGlobal(this.editor.window,dojo.hitch(this,function(){
var _134=doc.createElement("br");
rs.appendChild(_134);
var _135=doc.createTextNode(" ");
rs.appendChild(_135);
_12c=dijit.range.create(dojo.global);
_12c.setStart(_135,0);
_12c.setEnd(_135,_135.length);
_12a.removeAllRanges();
_12a.addRange(_12c);
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
var _136=true;
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
if(!_12b.collapsed){
_12b.deleteContents();
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
}
var _137=dijit.range.getBlockAncestor(_12b.endContainer,null,this.editor.editNode);
var _138=_137.blockNode;
if((this._checkListLater=(_138&&(_138.nodeName=="LI"||_138.parentNode.nodeName=="LI")))){
if(dojo.isMoz){
this._pressedEnterInBlock=_138;
}
if(/^(\s|&nbsp;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|\xA0)<\/span>)?(<br>)?$/.test(_138.innerHTML)){
_138.innerHTML="";
if(dojo.isWebKit){
_12c=dijit.range.create(this.editor.window);
_12c.setStart(_138,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
}
this._checkListLater=false;
}
return true;
}
if(!_137.blockNode||_137.blockNode===this.editor.editNode){
try{
dijit._editor.RichText.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
}
catch(e2){
}
_137={blockNode:dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,[this.blockNodeForEnter]),blockContainer:this.editor.editNode};
if(_137.blockNode){
if(_137.blockNode!=this.editor.editNode&&(!(_137.blockNode.textContent||_137.blockNode.innerHTML).replace(/^\s+|\s+$/g,"").length)){
this.removeTrailingBr(_137.blockNode);
return false;
}
}else{
_137.blockNode=this.editor.editNode;
}
_12a=dijit.range.getSelection(this.editor.window);
_12b=_12a.getRangeAt(0);
}
var _139=doc.createElement(this.blockNodeForEnter);
_139.innerHTML=this.bogusHtmlContent;
this.removeTrailingBr(_137.blockNode);
var _13a=_12b.endOffset;
var node=_12b.endContainer;
if(node.length<_13a){
var ret=this._adjustNodeAndOffset(node,_13a);
node=ret.node;
_13a=ret.offset;
}
if(dijit.range.atEndOfContainer(_137.blockNode,node,_13a)){
if(_137.blockNode===_137.blockContainer){
_137.blockNode.appendChild(_139);
}else{
dojo.place(_139,_137.blockNode,"after");
}
_136=false;
_12c=dijit.range.create(this.editor.window);
_12c.setStart(_139,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
if(this.editor.height){
dojo.window.scrollIntoView(_139);
}
}else{
if(dijit.range.atBeginningOfContainer(_137.blockNode,_12b.startContainer,_12b.startOffset)){
dojo.place(_139,_137.blockNode,_137.blockNode===_137.blockContainer?"first":"before");
if(_139.nextSibling&&this.editor.height){
_12c=dijit.range.create(this.editor.window);
_12c.setStart(_139.nextSibling,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
dojo.window.scrollIntoView(_139.nextSibling);
}
_136=false;
}else{
if(_137.blockNode===_137.blockContainer){
_137.blockNode.appendChild(_139);
}else{
dojo.place(_139,_137.blockNode,"after");
}
_136=false;
if(_137.blockNode.style){
if(_139.style){
if(_137.blockNode.style.cssText){
_139.style.cssText=_137.blockNode.style.cssText;
}
}
}
rs=_12b.startContainer;
var _13b;
if(rs&&rs.nodeType==3){
var _13c,_13d;
_13a=_12b.endOffset;
if(rs.length<_13a){
ret=this._adjustNodeAndOffset(rs,_13a);
rs=ret.node;
_13a=ret.offset;
}
txt=rs.nodeValue;
_12d=doc.createTextNode(txt.substring(0,_13a));
_12e=doc.createTextNode(txt.substring(_13a,txt.length));
dojo.place(_12d,rs,"before");
dojo.place(_12e,rs,"after");
dojo.destroy(rs);
var _13e=_12d.parentNode;
while(_13e!==_137.blockNode){
var tg=_13e.tagName;
var _13f=doc.createElement(tg);
if(_13e.style){
if(_13f.style){
if(_13e.style.cssText){
_13f.style.cssText=_13e.style.cssText;
}
}
}
if(_13e.tagName==="FONT"){
if(_13e.color){
_13f.color=_13e.color;
}
if(_13e.face){
_13f.face=_13e.face;
}
if(_13e.size){
_13f.size=_13e.size;
}
}
_13c=_12e;
while(_13c){
_13d=_13c.nextSibling;
_13f.appendChild(_13c);
_13c=_13d;
}
dojo.place(_13f,_13e,"after");
_12d=_13e;
_12e=_13f;
_13e=_13e.parentNode;
}
_13c=_12e;
if(_13c.nodeType==1||(_13c.nodeType==3&&_13c.nodeValue)){
_139.innerHTML="";
}
_13b=_13c;
while(_13c){
_13d=_13c.nextSibling;
_139.appendChild(_13c);
_13c=_13d;
}
}
_12c=dijit.range.create(this.editor.window);
var _140;
var _141=_13b;
if(this.blockNodeForEnter!=="BR"){
while(_141){
_140=_141;
_13d=_141.firstChild;
_141=_13d;
}
if(_140&&_140.parentNode){
_139=_140.parentNode;
_12c.setStart(_139,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
if(this.editor.height){
dijit.scrollIntoView(_139);
}
if(dojo.isMoz){
this._pressedEnterInBlock=_137.blockNode;
}
}else{
_136=true;
}
}else{
_12c.setStart(_139,0);
_12a.removeAllRanges();
_12a.addRange(_12c);
if(this.editor.height){
dijit.scrollIntoView(_139);
}
if(dojo.isMoz){
this._pressedEnterInBlock=_137.blockNode;
}
}
}
}
return _136;
},_adjustNodeAndOffset:function(node,_142){
while(node.length<_142&&node.nextSibling&&node.nextSibling.nodeType==3){
_142=_142-node.length;
node=node.nextSibling;
}
var ret={"node":node,"offset":_142};
return ret;
},removeTrailingBr:function(_143){
var para=/P|DIV|LI/i.test(_143.tagName)?_143:dijit._editor.selection.getParentOfType(_143,["P","DIV","LI"]);
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
if(!dojo._hasResource["dijit._Contained"]){
dojo._hasResource["dijit._Contained"]=true;
dojo.provide("dijit._Contained");
dojo.declare("dijit._Contained",null,{getParent:function(){
var _144=dijit.getEnclosingWidget(this.domNode.parentNode);
return _144&&_144.isContainer?_144:null;
},_getSibling:function(_145){
var node=this.domNode;
do{
node=node[_145+"Sibling"];
}while(node&&node.nodeType!=1);
return node&&dijit.byNode(node);
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
var _146=this.getParent&&this.getParent();
if(!(_146&&_146.isLayoutContainer)){
this.resize();
this.connect(dojo.isIE?this.domNode:dojo.global,"onresize",function(){
this.resize();
});
}
},resize:function(_147,_148){
var node=this.domNode;
if(_147){
dojo.marginBox(node,_147);
if(_147.t){
node.style.top=_147.t+"px";
}
if(_147.l){
node.style.left=_147.l+"px";
}
}
var mb=_148||{};
dojo.mixin(mb,_147||{});
if(!("h" in mb)||!("w" in mb)){
mb=dojo.mixin(dojo.marginBox(node),mb);
}
var cs=dojo.getComputedStyle(node);
var me=dojo._getMarginExtents(node,cs);
var be=dojo._getBorderExtents(node,cs);
var bb=(this._borderBox={w:mb.w-(me.w+be.w),h:mb.h-(me.h+be.h)});
var pe=dojo._getPadExtents(node,cs);
this._contentBox={l:dojo._toPixelValue(node,cs.paddingLeft),t:dojo._toPixelValue(node,cs.paddingTop),w:bb.w-pe.w,h:bb.h-pe.h};
this.layout();
},layout:function(){
},_setupChild:function(_149){
var cls=this.baseClass+"-child "+(_149.baseClass?this.baseClass+"-"+_149.baseClass:"");
dojo.addClass(_149.domNode,cls);
},addChild:function(_14a,_14b){
this.inherited(arguments);
if(this._started){
this._setupChild(_14a);
}
},removeChild:function(_14c){
var cls=this.baseClass+"-child"+(_14c.baseClass?" "+this.baseClass+"-"+_14c.baseClass:"");
dojo.removeClass(_14c.domNode,cls);
this.inherited(arguments);
}});
dijit.layout.marginBox2contentBox=function(node,mb){
var cs=dojo.getComputedStyle(node);
var me=dojo._getMarginExtents(node,cs);
var pb=dojo._getPadBorderExtents(node,cs);
return {l:dojo._toPixelValue(node,cs.paddingLeft),t:dojo._toPixelValue(node,cs.paddingTop),w:mb.w-(me.w+pb.w),h:mb.h-(me.h+pb.h)};
};
(function(){
var _14d=function(word){
return word.substring(0,1).toUpperCase()+word.substring(1);
};
var size=function(_14e,dim){
var _14f=_14e.resize?_14e.resize(dim):dojo.marginBox(_14e.domNode,dim);
if(_14f){
dojo.mixin(_14e,_14f);
}else{
dojo.mixin(_14e,dojo.marginBox(_14e.domNode));
dojo.mixin(_14e,dim);
}
};
dijit.layout.layoutChildren=function(_150,dim,_151,_152,_153){
dim=dojo.mixin({},dim);
dojo.addClass(_150,"dijitLayoutContainer");
_151=dojo.filter(_151,function(item){
return item.region!="center"&&item.layoutAlign!="client";
}).concat(dojo.filter(_151,function(item){
return item.region=="center"||item.layoutAlign=="client";
}));
dojo.forEach(_151,function(_154){
var elm=_154.domNode,pos=(_154.region||_154.layoutAlign);
var _155=elm.style;
_155.left=dim.l+"px";
_155.top=dim.t+"px";
_155.position="absolute";
dojo.addClass(elm,"dijitAlign"+_14d(pos));
var _156={};
if(_152&&_152==_154.id){
_156[_154.region=="top"||_154.region=="bottom"?"h":"w"]=_153;
}
if(pos=="top"||pos=="bottom"){
_156.w=dim.w;
size(_154,_156);
dim.h-=_154.h;
if(pos=="top"){
dim.t+=_154.h;
}else{
_155.top=dim.t+dim.h+"px";
}
}else{
if(pos=="left"||pos=="right"){
_156.h=dim.h;
size(_154,_156);
dim.w-=_154.w;
if(pos=="left"){
dim.l+=_154.w;
}else{
_155.left=dim.l+dim.w+"px";
}
}else{
if(pos=="client"||pos=="center"){
size(_154,dim);
}
}
}
});
};
})();
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
},addPlugin:function(_157,_158){
var args=dojo.isString(_157)?{name:_157}:_157;
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
console.warn("Cannot find plugin",_157);
return;
}
_157=o.plugin;
}
if(arguments.length>1){
this._plugins[_158]=_157;
}else{
this._plugins.push(_157);
}
_157.setEditor(this);
if(dojo.isFunction(_157.setToolbar)){
_157.setToolbar(this.toolbar);
}
},startup:function(){
},resize:function(size){
if(size){
dijit.layout._LayoutWidget.prototype.resize.apply(this,arguments);
}
},layout:function(){
var _159=(this._contentBox.h-(this.getHeaderHeight()+this.getFooterHeight()+dojo._getPadBorderExtents(this.iframe.parentNode).h+dojo._getMarginExtents(this.iframe.parentNode).h));
this.editingArea.style.height=_159+"px";
if(this.iframe){
this.iframe.style.height="100%";
}
this._layoutMode=true;
},_onIEMouseDown:function(e){
var _15a;
var b=this.document.body;
var _15b=b.clientWidth;
var _15c=b.clientHeight;
var _15d=b.clientLeft;
var _15e=b.offsetWidth;
var _15f=b.offsetHeight;
var _160=b.offsetLeft;
bodyDir=b.dir?b.dir.toLowerCase():"";
if(bodyDir!="rtl"){
if(_15b<_15e&&e.x>_15b&&e.x<_15e){
_15a=true;
}
}else{
if(e.x<_15d&&e.x>_160){
_15a=true;
}
}
if(!_15a){
if(_15c<_15f&&e.y>_15c&&e.y<_15f){
_15a=true;
}
}
if(!_15a){
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
var _161=/copy|cut|paste/.test(cmd);
try{
r=this.inherited(arguments);
if(dojo.isWebKit&&_161&&!r){
throw {code:1011};
}
}
catch(e){
if(e.code==1011&&_161){
var sub=dojo.string.substitute,_162={cut:"X",copy:"C",paste:"V"};
alert(sub(this.commands.systemShortcut,[this.commands[cmd],sub(this.commands[dojo.isMac?"appleKey":"ctrlKey"],[_162[cmd]])]));
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
var _163=b.mark;
var mark=b.mark;
var col=b.isCollapsed;
var r,_164,_165,sel;
if(mark){
if(dojo.isIE<9){
if(dojo.isArray(mark)){
_163=[];
dojo.forEach(mark,function(n){
_163.push(dijit.range.getNode(n,this.editNode));
},this);
dojo.withGlobal(this.window,"moveToBookmark",dijit,[{mark:_163,isCollapsed:col}]);
}else{
if(mark.startContainer&&mark.endContainer){
sel=dijit.range.getSelection(this.window);
if(sel&&sel.removeAllRanges){
sel.removeAllRanges();
r=dijit.range.create(this.window);
_164=dijit.range.getNode(mark.startContainer,this.editNode);
_165=dijit.range.getNode(mark.endContainer,this.editNode);
if(_164&&_165){
r.setStart(_164,mark.startOffset);
r.setEnd(_165,mark.endOffset);
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
_164=dijit.range.getNode(mark.startContainer,this.editNode);
_165=dijit.range.getNode(mark.endContainer,this.editNode);
if(_164&&_165){
r.setStart(_164,mark.startOffset);
r.setEnd(_165,mark.endOffset);
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
},endEditing:function(_166){
if(this._editTimer){
clearTimeout(this._editTimer);
}
if(this._inEditing){
this._endEditing(_166);
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
var _167;
if(sel.rangeCount){
_167=sel.getRangeAt(0);
}
if(_167){
b.mark=_167.cloneRange();
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
},_endEditing:function(_168){
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
},_setDisabledAttr:function(_169){
var _16a=dojo.hitch(this,function(){
if((!this.disabled&&_169)||(!this._buttonEnabledPlugins&&_169)){
dojo.forEach(this._plugins,function(p){
p.set("disabled",true);
});
}else{
if(this.disabled&&!_169){
dojo.forEach(this._plugins,function(p){
p.set("disabled",false);
});
}
}
});
this.setValueDeferred.addCallback(_16a);
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
var _16b=dijit._editor._Plugin;
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
p=new _16b({command:name});
break;
case "bold":
case "italic":
case "underline":
case "strikethrough":
case "subscript":
case "superscript":
p=new _16b({buttonClass:dijit.form.ToggleButton,command:name});
break;
case "|":
p=new _16b({button:new dijit.ToolbarSeparator(),setEditor:function(_16c){
this.editor=_16c;
}});
}
o.plugin=p;
});
}
if(!dojo._hasResource["dojox.editor.plugins.AutoUrlLink"]){
dojo._hasResource["dojox.editor.plugins.AutoUrlLink"]=true;
dojo.provide("dojox.editor.plugins.AutoUrlLink");
dojo.declare("dojox.editor.plugins.AutoUrlLink",[dijit._editor._Plugin],{_template:"<a _djrealurl='${url}' href='${url}'>${url}</a>",setEditor:function(_16d){
this.editor=_16d;
if(!dojo.isIE){
dojo.some(_16d._plugins,function(_16e){
if(_16e.isInstanceOf(dijit._editor.plugins.EnterKeyHandling)){
this.blockNodeForEnter=_16e.blockNodeForEnter;
return true;
}
return false;
},this);
this.connect(_16d,"onKeyPress","_keyPress");
this.connect(_16d,"onClick","_recognize");
this.connect(_16d,"onBlur","_recognize");
}
},_keyPress:function(evt){
var ks=dojo.keys,v=118,V=86,kc=evt.keyCode,cc=evt.charCode;
if(cc==ks.SPACE||(evt.ctrlKey&&(cc==v||cc==V))){
setTimeout(dojo.hitch(this,"_recognize"),0);
}else{
if(kc==ks.ENTER){
setTimeout(dojo.hitch(this,function(){
this._recognize({enter:true});
}),0);
}else{
this._saved=this.editor.window.getSelection().anchorNode;
}
}
},_recognize:function(args){
var _16f=this._template,_170=args?args.enter:false,ed=this.editor,_171=ed.window.getSelection();
if(_171){
var node=_170?this._findLastEditingNode(_171.anchorNode):(this._saved||_171.anchorNode),bm=this._saved=_171.anchorNode,_172=_171.anchorOffset;
if(node.nodeType==3&&!this._inLink(node)){
var _173=false,_174=this._findUrls(node,bm,_172),_175=ed.document.createRange(),item,cost=0,_176=(bm==node);
item=_174.shift();
while(item){
_175.setStart(node,item.start);
_175.setEnd(node,item.end);
_171.removeAllRanges();
_171.addRange(_175);
ed.execCommand("insertHTML",dojo.string.substitute(_16f,{url:_175.toString()}));
cost+=item.end;
item=_174.shift();
_173=true;
}
if(_176&&(_172=_172-cost)<=0){
return;
}
if(!_173){
return;
}
try{
_175.setStart(bm,0);
_175.setEnd(bm,_172);
_171.removeAllRanges();
_171.addRange(_175);
dojo.withGlobal(ed.window,"collapse",dijit._editor.selection,[]);
}
catch(e){
}
}
}
},_inLink:function(node){
var _177=this.editor.editNode,_178=false,_179;
node=node.parentNode;
while(node&&node!==_177){
_179=node.tagName?node.tagName.toLowerCase():"";
if(_179=="a"){
_178=true;
break;
}
node=node.parentNode;
}
return _178;
},_findLastEditingNode:function(node){
var _17a=dijit.range.BlockTagNames,_17b=this.editor.editNode,_17c;
if(!node){
return node;
}
if(this.blockNodeForEnter=="BR"&&(!(_17c=dijit.range.getBlockAncestor(node,null,_17b).blockNode)||_17c.tagName.toUpperCase()!="LI")){
while((node=node.previousSibling)&&node.nodeType!=3){
}
}else{
if((_17c||(_17c=dijit.range.getBlockAncestor(node,null,_17b).blockNode))&&_17c.tagName.toUpperCase()=="LI"){
node=_17c;
}else{
node=dijit.range.getBlockAncestor(node,null,_17b).blockNode;
}
while((node=node.previousSibling)&&!(node.tagName&&node.tagName.match(_17a))){
}
if(node){
node=node.lastChild;
while(node){
if(node.nodeType==3&&dojo.trim(node.nodeValue)!=""){
break;
}else{
if(node.nodeType==1){
node=node.lastChild;
}else{
node=node.previousSibling;
}
}
}
}
}
return node;
},_findUrls:function(node,bm,_17d){
var _17e=/(http|https|ftp):\/\/[^\s]+/ig,list=[],_17f=0,_180=node.nodeValue,_181,ch;
if(node===bm&&_17d<_180.length){
_180=_180.substr(0,_17d);
}
while((_181=_17e.exec(_180))!=null){
if(_181.index==0||(ch=_180.charAt(_181.index-1))==" "||ch==" "){
list.push({start:_181.index-_17f,end:_181.index+_181[0].length-_17f});
_17f=_181.index+_181[0].length;
}
}
return list;
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
var name=o.args.name.toLowerCase();
if(name==="autourllink"){
o.plugin=new dojox.editor.plugins.AutoUrlLink();
}
});
}
if(!dojo._hasResource["dijit._editor.plugins.AlwaysShowToolbar"]){
dojo._hasResource["dijit._editor.plugins.AlwaysShowToolbar"]=true;
dojo.provide("dijit._editor.plugins.AlwaysShowToolbar");
dojo.declare("dijit._editor.plugins.AlwaysShowToolbar",dijit._editor._Plugin,{_handleScroll:true,setEditor:function(e){
if(!e.iframe){
return;
}
this.editor=e;
e.onLoadDeferred.addCallback(dojo.hitch(this,this.enable));
},enable:function(d){
this._updateHeight();
this.connect(window,"onscroll","globalOnScrollHandler");
this.connect(this.editor,"onNormalizedDisplayChanged","_updateHeight");
return d;
},_updateHeight:function(){
var e=this.editor;
if(!e.isLoaded){
return;
}
if(e.height){
return;
}
var _182=dojo._getMarginSize(e.editNode).h;
if(dojo.isOpera){
_182=e.editNode.scrollHeight;
}
if(!_182){
_182=dojo._getMarginSize(e.document.body).h;
}
if(_182==0){
return;
}
if(dojo.isIE<=7&&this.editor.minHeight){
var min=parseInt(this.editor.minHeight);
if(_182<min){
_182=min;
}
}
if(_182!=this._lastHeight){
this._lastHeight=_182;
dojo.marginBox(e.iframe,{h:this._lastHeight});
}
},_lastHeight:0,globalOnScrollHandler:function(){
var _183=dojo.isIE<7;
if(!this._handleScroll){
return;
}
var tdn=this.editor.header;
var db=dojo.body;
if(!this._scrollSetUp){
this._scrollSetUp=true;
this._scrollThreshold=dojo.position(tdn,true).y;
}
var _184=dojo._docScroll().y;
var s=tdn.style;
if(_184>this._scrollThreshold&&_184<this._scrollThreshold+this._lastHeight){
if(!this._fixEnabled){
var _185=dojo._getMarginSize(tdn);
this.editor.iframe.style.marginTop=_185.h+"px";
if(_183){
s.left=dojo.position(tdn).x;
if(tdn.previousSibling){
this._IEOriginalPos=["after",tdn.previousSibling];
}else{
if(tdn.nextSibling){
this._IEOriginalPos=["before",tdn.nextSibling];
}else{
this._IEOriginalPos=["last",tdn.parentNode];
}
}
dojo.body().appendChild(tdn);
dojo.addClass(tdn,"dijitIEFixedToolbar");
}else{
s.position="fixed";
s.top="0px";
}
dojo.marginBox(tdn,{w:_185.w});
s.zIndex=2000;
this._fixEnabled=true;
}
var _186=(this.height)?parseInt(this.editor.height):this.editor._lastHeight;
s.display=(_184>this._scrollThreshold+_186)?"none":"";
}else{
if(this._fixEnabled){
this.editor.iframe.style.marginTop="";
s.position="";
s.top="";
s.zIndex="";
s.display="";
if(_183){
s.left="";
dojo.removeClass(tdn,"dijitIEFixedToolbar");
if(this._IEOriginalPos){
dojo.place(tdn,this._IEOriginalPos[1],this._IEOriginalPos[0]);
this._IEOriginalPos=null;
}else{
dojo.place(tdn,this.editor.iframe,"before");
}
}
s.width="";
this._fixEnabled=false;
}
}
},destroy:function(){
this._IEOriginalPos=null;
this._handleScroll=false;
dojo.forEach(this._connects,dojo.disconnect);
if(dojo.isIE<7){
dojo.removeClass(this.editor.header,"dijitIEFixedToolbar");
}
}});
}
if(!dojo._hasResource["dojo.data.ItemFileReadStore"]){
dojo._hasResource["dojo.data.ItemFileReadStore"]=true;
dojo.provide("dojo.data.ItemFileReadStore");
dojo.declare("dojo.data.ItemFileReadStore",null,{constructor:function(_187){
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=[];
this._loadFinished=false;
this._jsonFileUrl=_187.url;
this._ccUrl=_187.url;
this.url=_187.url;
this._jsonData=_187.data;
this.data=null;
this._datatypeMap=_187.typeMap||{};
if(!this._datatypeMap["Date"]){
this._datatypeMap["Date"]={type:Date,deserialize:function(_188){
return dojo.date.stamp.fromISOString(_188);
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
if(_187.urlPreventCache!==undefined){
this.urlPreventCache=_187.urlPreventCache?true:false;
}
if(_187.hierarchical!==undefined){
this.hierarchical=_187.hierarchical?true:false;
}
if(_187.clearOnClose){
this.clearOnClose=true;
}
if("failOk" in _187){
this.failOk=_187.failOk?true:false;
}
},url:"",_ccUrl:"",data:null,typeMap:null,clearOnClose:false,urlPreventCache:false,failOk:false,hierarchical:true,_assertIsItem:function(item){
if(!this.isItem(item)){
throw new Error("dojo.data.ItemFileReadStore: Invalid item argument.");
}
},_assertIsAttribute:function(_189){
if(typeof _189!=="string"){
throw new Error("dojo.data.ItemFileReadStore: Invalid attribute argument.");
}
},getValue:function(item,_18a,_18b){
var _18c=this.getValues(item,_18a);
return (_18c.length>0)?_18c[0]:_18b;
},getValues:function(item,_18d){
this._assertIsItem(item);
this._assertIsAttribute(_18d);
if(_18d.indexOf(".")!=-1){
var _18e=_18d.split(/\./);
var _18f=item;
for(var i=0;i<_18e.length;i++){
var key=_18e[i];
if(_18f[key]&&_18f[key][0]){
_18f=i==_18e.length-1?_18f[key]:_18f[key][0];
}else{
_18f=null;
break;
}
}
if(_18f!==null){
return _18f;
}
}
return (item[_18d]||[]).slice(0);
},getAttributes:function(item){
this._assertIsItem(item);
var _190=[];
for(var key in item){
if((key!==this._storeRefPropName)&&(key!==this._itemNumPropName)&&(key!==this._rootItemPropName)&&(key!==this._reverseRefMap)){
_190.push(key);
}
}
return _190;
},hasAttribute:function(item,_191){
this._assertIsItem(item);
this._assertIsAttribute(_191);
return (_191 in item);
},containsValue:function(item,_192,_193){
var _194=undefined;
if(typeof _193==="string"){
_194=dojo.data.util.filter.patternToRegExp(_193,false);
}
return this._containsValue(item,_192,_193,_194);
},_containsValue:function(item,_195,_196,_197){
return dojo.some(this.getValues(item,_195),function(_198){
if(_198!==null&&!dojo.isObject(_198)&&_197){
if(_198.toString().match(_197)){
return true;
}
}else{
if(_196===_198){
return true;
}
}
});
},isItem:function(_199){
if(_199&&_199[this._storeRefPropName]===this){
if(this._arrayOfAllItems[_199[this._itemNumPropName]]===_199){
return true;
}
}
return false;
},isItemLoaded:function(_19a){
return this.isItem(_19a);
},loadItem:function(_19b){
this._assertIsItem(_19b.item);
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
},_fetchItems:function(_19c,_19d,_19e){
var self=this,_19f=function(_1a0,_1a1){
var _1a2=[],i,key;
if(_1a0.query){
var _1a3,_1a4=_1a0.queryOptions?_1a0.queryOptions.ignoreCase:false;
var _1a5={};
for(key in _1a0.query){
_1a3=_1a0.query[key];
if(typeof _1a3==="string"){
_1a5[key]=dojo.data.util.filter.patternToRegExp(_1a3,_1a4);
}else{
if(_1a3 instanceof RegExp){
_1a5[key]=_1a3;
}
}
}
for(i=0;i<_1a1.length;++i){
var _1a6=true;
var _1a7=_1a1[i];
if(_1a7===null){
_1a6=false;
}else{
for(key in _1a0.query){
_1a3=_1a0.query[key];
if(!self._containsValue(_1a7,key,_1a3,_1a5[key])){
_1a6=false;
}
}
}
if(_1a6){
_1a2.push(_1a7);
}
}
_19d(_1a2,_1a0);
}else{
for(i=0;i<_1a1.length;++i){
var item=_1a1[i];
if(item!==null){
_1a2.push(item);
}
}
_19d(_1a2,_1a0);
}
};
if(this._loadFinished){
_19f(_19c,this._getItemsArray(_19c.queryOptions));
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
this._queuedFetches.push({args:_19c,filter:_19f});
}else{
this._loadInProgress=true;
var _1a8={url:self._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk};
var _1a9=dojo.xhrGet(_1a8);
_1a9.addCallback(function(data){
try{
self._getItemsFromLoadedData(data);
self._loadFinished=true;
self._loadInProgress=false;
_19f(_19c,self._getItemsArray(_19c.queryOptions));
self._handleQueuedFetches();
}
catch(e){
self._loadFinished=true;
self._loadInProgress=false;
_19e(e,_19c);
}
});
_1a9.addErrback(function(_1aa){
self._loadInProgress=false;
_19e(_1aa,_19c);
});
var _1ab=null;
if(_19c.abort){
_1ab=_19c.abort;
}
_19c.abort=function(){
var df=_1a9;
if(df&&df.fired===-1){
df.cancel();
df=null;
}
if(_1ab){
_1ab.call(_19c);
}
};
}
}else{
if(this._jsonData){
try{
this._loadFinished=true;
this._getItemsFromLoadedData(this._jsonData);
this._jsonData=null;
_19f(_19c,this._getItemsArray(_19c.queryOptions));
}
catch(e){
_19e(e,_19c);
}
}else{
_19e(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."),_19c);
}
}
}
},_handleQueuedFetches:function(){
if(this._queuedFetches.length>0){
for(var i=0;i<this._queuedFetches.length;i++){
var _1ac=this._queuedFetches[i],_1ad=_1ac.args,_1ae=_1ac.filter;
if(_1ae){
_1ae(_1ad,this._getItemsArray(_1ad.queryOptions));
}else{
this.fetchItemByIdentity(_1ad);
}
}
this._queuedFetches=[];
}
},_getItemsArray:function(_1af){
if(_1af&&_1af.deep){
return this._arrayOfAllItems;
}
return this._arrayOfTopLevelItems;
},close:function(_1b0){
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
},_getItemsFromLoadedData:function(_1b1){
var _1b2=false,self=this;
function _1b3(_1b4){
var _1b5=((_1b4!==null)&&(typeof _1b4==="object")&&(!dojo.isArray(_1b4)||_1b2)&&(!dojo.isFunction(_1b4))&&(_1b4.constructor==Object||dojo.isArray(_1b4))&&(typeof _1b4._reference==="undefined")&&(typeof _1b4._type==="undefined")&&(typeof _1b4._value==="undefined")&&self.hierarchical);
return _1b5;
};
function _1b6(_1b7){
self._arrayOfAllItems.push(_1b7);
for(var _1b8 in _1b7){
var _1b9=_1b7[_1b8];
if(_1b9){
if(dojo.isArray(_1b9)){
var _1ba=_1b9;
for(var k=0;k<_1ba.length;++k){
var _1bb=_1ba[k];
if(_1b3(_1bb)){
_1b6(_1bb);
}
}
}else{
if(_1b3(_1b9)){
_1b6(_1b9);
}
}
}
}
};
this._labelAttr=_1b1.label;
var i,item;
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=_1b1.items;
for(i=0;i<this._arrayOfTopLevelItems.length;++i){
item=this._arrayOfTopLevelItems[i];
if(dojo.isArray(item)){
_1b2=true;
}
_1b6(item);
item[this._rootItemPropName]=true;
}
var _1bc={},key;
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
for(key in item){
if(key!==this._rootItemPropName){
var _1bd=item[key];
if(_1bd!==null){
if(!dojo.isArray(_1bd)){
item[key]=[_1bd];
}
}else{
item[key]=[null];
}
}
_1bc[key]=key;
}
}
while(_1bc[this._storeRefPropName]){
this._storeRefPropName+="_";
}
while(_1bc[this._itemNumPropName]){
this._itemNumPropName+="_";
}
while(_1bc[this._reverseRefMap]){
this._reverseRefMap+="_";
}
var _1be;
var _1bf=_1b1.identifier;
if(_1bf){
this._itemsByIdentity={};
this._features["dojo.data.api.Identity"]=_1bf;
for(i=0;i<this._arrayOfAllItems.length;++i){
item=this._arrayOfAllItems[i];
_1be=item[_1bf];
var _1c0=_1be[0];
if(!Object.hasOwnProperty.call(this._itemsByIdentity,_1c0)){
this._itemsByIdentity[_1c0]=item;
}else{
if(this._jsonFileUrl){
throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: ["+this._jsonFileUrl+"] is malformed.  Items within the list have identifier: ["+_1bf+"].  Value collided: ["+_1c0+"]");
}else{
if(this._jsonData){
throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: ["+_1bf+"].  Value collided: ["+_1c0+"]");
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
_1be=item[key];
for(var j=0;j<_1be.length;++j){
_1bd=_1be[j];
if(_1bd!==null&&typeof _1bd=="object"){
if(("_type" in _1bd)&&("_value" in _1bd)){
var type=_1bd._type;
var _1c1=this._datatypeMap[type];
if(!_1c1){
throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '"+type+"'");
}else{
if(dojo.isFunction(_1c1)){
_1be[j]=new _1c1(_1bd._value);
}else{
if(dojo.isFunction(_1c1.deserialize)){
_1be[j]=_1c1.deserialize(_1bd._value);
}else{
throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
}
}
}
}
if(_1bd._reference){
var _1c2=_1bd._reference;
if(!dojo.isObject(_1c2)){
_1be[j]=this._getItemByIdentity(_1c2);
}else{
for(var k=0;k<this._arrayOfAllItems.length;++k){
var _1c3=this._arrayOfAllItems[k],_1c4=true;
for(var _1c5 in _1c2){
if(_1c3[_1c5]!=_1c2[_1c5]){
_1c4=false;
}
}
if(_1c4){
_1be[j]=_1c3;
}
}
}
if(this.referenceIntegrity){
var _1c6=_1be[j];
if(this.isItem(_1c6)){
this._addReferenceToMap(_1c6,item,key);
}
}
}else{
if(this.isItem(_1bd)){
if(this.referenceIntegrity){
this._addReferenceToMap(_1bd,item,key);
}
}
}
}
}
}
}
},_addReferenceToMap:function(_1c7,_1c8,_1c9){
},getIdentity:function(item){
var _1ca=this._features["dojo.data.api.Identity"];
if(_1ca===Number){
return item[this._itemNumPropName];
}else{
var _1cb=item[_1ca];
if(_1cb){
return _1cb[0];
}
}
return null;
},fetchItemByIdentity:function(_1cc){
var item,_1cd;
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
this._queuedFetches.push({args:_1cc});
}else{
this._loadInProgress=true;
var _1ce={url:self._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk};
var _1cf=dojo.xhrGet(_1ce);
_1cf.addCallback(function(data){
var _1d0=_1cc.scope?_1cc.scope:dojo.global;
try{
self._getItemsFromLoadedData(data);
self._loadFinished=true;
self._loadInProgress=false;
item=self._getItemByIdentity(_1cc.identity);
if(_1cc.onItem){
_1cc.onItem.call(_1d0,item);
}
self._handleQueuedFetches();
}
catch(error){
self._loadInProgress=false;
if(_1cc.onError){
_1cc.onError.call(_1d0,error);
}
}
});
_1cf.addErrback(function(_1d1){
self._loadInProgress=false;
if(_1cc.onError){
var _1d2=_1cc.scope?_1cc.scope:dojo.global;
_1cc.onError.call(_1d2,_1d1);
}
});
}
}else{
if(this._jsonData){
self._getItemsFromLoadedData(self._jsonData);
self._jsonData=null;
self._loadFinished=true;
item=self._getItemByIdentity(_1cc.identity);
if(_1cc.onItem){
_1cd=_1cc.scope?_1cc.scope:dojo.global;
_1cc.onItem.call(_1cd,item);
}
}
}
}else{
item=this._getItemByIdentity(_1cc.identity);
if(_1cc.onItem){
_1cd=_1cc.scope?_1cc.scope:dojo.global;
_1cc.onItem.call(_1cd,item);
}
}
},_getItemByIdentity:function(_1d3){
var item=null;
if(this._itemsByIdentity&&Object.hasOwnProperty.call(this._itemsByIdentity,_1d3)){
item=this._itemsByIdentity[_1d3];
}else{
if(Object.hasOwnProperty.call(this._arrayOfAllItems,_1d3)){
item=this._arrayOfAllItems[_1d3];
}
}
if(item===undefined){
item=null;
}
return item;
},getIdentityAttributes:function(item){
var _1d4=this._features["dojo.data.api.Identity"];
if(_1d4===Number){
return null;
}else{
return [_1d4];
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
var _1d5={url:this._jsonFileUrl,handleAs:"json-comment-optional",preventCache:this.urlPreventCache,failOk:this.failOk,sync:true};
var _1d6=dojo.xhrGet(_1d5);
_1d6.addCallback(function(data){
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
_1d6.addErrback(function(_1d7){
throw _1d7;
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
if(!dojo._hasResource["dijit._editor.plugins.FontChoice"]){
dojo._hasResource["dijit._editor.plugins.FontChoice"]=true;
dojo.provide("dijit._editor.plugins.FontChoice");
dojo.declare("dijit._editor.plugins._FontDropDown",[dijit._Widget,dijit._Templated],{label:"",widgetsInTemplate:true,plainText:false,templateString:"<span style='white-space: nowrap' class='dijit dijitReset dijitInline'>"+"<label class='dijitLeft dijitInline' for='${selectId}'>${label}</label>"+"<input dojoType='dijit.form.FilteringSelect' required='false' labelType='html' labelAttr='label' searchAttr='name' "+"tabIndex='-1' id='${selectId}' dojoAttachPoint='select' value=''/>"+"</span>",postMixInProperties:function(){
this.inherited(arguments);
this.strings=dojo.i18n.getLocalization("dijit._editor","FontChoice");
this.label=this.strings[this.command];
this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
this.selectId=this.id+"_select";
this.inherited(arguments);
},postCreate:function(){
var _1d8=dojo.map(this.values,function(_1d9){
var name=this.strings[_1d9]||_1d9;
return {label:this.getLabel(_1d9,name),name:name,value:_1d9};
},this);
this.select.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",items:_1d8}});
this.select.set("value","",false);
this.disabled=this.select.get("disabled");
},_setValueAttr:function(_1da,_1db){
_1db=_1db!==false?true:false;
this.select.set("value",dojo.indexOf(this.values,_1da)<0?"":_1da,_1db);
if(!_1db){
this.select._lastValueReported=null;
}
},_getValueAttr:function(){
return this.select.get("value");
},focus:function(){
this.select.focus();
},_setDisabledAttr:function(_1dc){
this.disabled=_1dc;
this.select.set("disabled",_1dc);
}});
dojo.declare("dijit._editor.plugins._FontNameDropDown",dijit._editor.plugins._FontDropDown,{generic:false,command:"fontName",postMixInProperties:function(){
if(!this.values){
this.values=this.generic?["serif","sans-serif","monospace","cursive","fantasy"]:["Arial","Times New Roman","Comic Sans MS","Courier New"];
}
this.inherited(arguments);
},getLabel:function(_1dd,name){
if(this.plainText){
return name;
}else{
return "<div style='font-family: "+_1dd+"'>"+name+"</div>";
}
},_setValueAttr:function(_1de,_1df){
_1df=_1df!==false?true:false;
if(this.generic){
var map={"Arial":"sans-serif","Helvetica":"sans-serif","Myriad":"sans-serif","Times":"serif","Times New Roman":"serif","Comic Sans MS":"cursive","Apple Chancery":"cursive","Courier":"monospace","Courier New":"monospace","Papyrus":"fantasy"};
_1de=map[_1de]||_1de;
}
this.inherited(arguments,[_1de,_1df]);
}});
dojo.declare("dijit._editor.plugins._FontSizeDropDown",dijit._editor.plugins._FontDropDown,{command:"fontSize",values:[1,2,3,4,5,6,7],getLabel:function(_1e0,name){
if(this.plainText){
return name;
}else{
return "<font size="+_1e0+"'>"+name+"</font>";
}
},_setValueAttr:function(_1e1,_1e2){
_1e2=_1e2!==false?true:false;
if(_1e1.indexOf&&_1e1.indexOf("px")!=-1){
var _1e3=parseInt(_1e1,10);
_1e1={10:1,13:2,16:3,18:4,24:5,32:6,48:7}[_1e3]||_1e1;
}
this.inherited(arguments,[_1e1,_1e2]);
}});
dojo.declare("dijit._editor.plugins._FormatBlockDropDown",dijit._editor.plugins._FontDropDown,{command:"formatBlock",values:["noFormat","p","h1","h2","h3","pre"],postCreate:function(){
this.inherited(arguments);
this.set("value","noFormat",false);
},getLabel:function(_1e4,name){
if(this.plainText||_1e4=="noFormat"){
return name;
}else{
return "<"+_1e4+">"+name+"</"+_1e4+">";
}
},_execCommand:function(_1e5,_1e6,_1e7){
if(_1e7==="noFormat"){
var _1e8;
var end;
var sel=dijit.range.getSelection(_1e5.window);
if(sel&&sel.rangeCount>0){
var _1e9=sel.getRangeAt(0);
var node,tag;
if(_1e9){
_1e8=_1e9.startContainer;
end=_1e9.endContainer;
while(_1e8&&_1e8!==_1e5.editNode&&_1e8!==_1e5.document.body&&_1e8.nodeType!==1){
_1e8=_1e8.parentNode;
}
while(end&&end!==_1e5.editNode&&end!==_1e5.document.body&&end.nodeType!==1){
end=end.parentNode;
}
var _1ea=dojo.hitch(this,function(node,_1eb){
if(node.childNodes&&node.childNodes.length){
var i;
for(i=0;i<node.childNodes.length;i++){
var c=node.childNodes[i];
if(c.nodeType==1){
if(dojo.withGlobal(_1e5.window,"inSelection",dijit._editor.selection,[c])){
var tag=c.tagName?c.tagName.toLowerCase():"";
if(dojo.indexOf(this.values,tag)!==-1){
_1eb.push(c);
}
_1ea(c,_1eb);
}
}
}
}
});
var _1ec=dojo.hitch(this,function(_1ed){
if(_1ed&&_1ed.length){
_1e5.beginEditing();
while(_1ed.length){
this._removeFormat(_1e5,_1ed.pop());
}
_1e5.endEditing();
}
});
var _1ee=[];
if(_1e8==end){
var _1ef;
node=_1e8;
while(node&&node!==_1e5.editNode&&node!==_1e5.document.body){
if(node.nodeType==1){
tag=node.tagName?node.tagName.toLowerCase():"";
if(dojo.indexOf(this.values,tag)!==-1){
_1ef=node;
break;
}
}
node=node.parentNode;
}
_1ea(_1e8,_1ee);
if(_1ef){
_1ee=[_1ef].concat(_1ee);
}
_1ec(_1ee);
}else{
node=_1e8;
while(dojo.withGlobal(_1e5.window,"inSelection",dijit._editor.selection,[node])){
if(node.nodeType==1){
tag=node.tagName?node.tagName.toLowerCase():"";
if(dojo.indexOf(this.values,tag)!==-1){
_1ee.push(node);
}
_1ea(node,_1ee);
}
node=node.nextSibling;
}
_1ec(_1ee);
}
_1e5.onDisplayChanged();
}
}
}else{
_1e5.execCommand(_1e6,_1e7);
}
},_removeFormat:function(_1f0,node){
if(_1f0.customUndo){
while(node.firstChild){
dojo.place(node.firstChild,node,"before");
}
node.parentNode.removeChild(node);
}else{
dojo.withGlobal(_1f0.window,"selectElementChildren",dijit._editor.selection,[node]);
var html=dojo.withGlobal(_1f0.window,"getSelectedHtml",dijit._editor.selection,[null]);
dojo.withGlobal(_1f0.window,"selectElement",dijit._editor.selection,[node]);
_1f0.execCommand("inserthtml",html||"");
}
}});
dojo.declare("dijit._editor.plugins.FontChoice",dijit._editor._Plugin,{useDefaultCommand:false,_initButton:function(){
var _1f1={fontName:dijit._editor.plugins._FontNameDropDown,fontSize:dijit._editor.plugins._FontSizeDropDown,formatBlock:dijit._editor.plugins._FormatBlockDropDown}[this.command],_1f2=this.params;
if(this.params.custom){
_1f2.values=this.params.custom;
}
var _1f3=this.editor;
this.button=new _1f1(dojo.delegate({dir:_1f3.dir,lang:_1f3.lang},_1f2));
this.connect(this.button.select,"onChange",function(_1f4){
this.editor.focus();
if(this.command=="fontName"&&_1f4.indexOf(" ")!=-1){
_1f4="'"+_1f4+"'";
}
if(this.button._execCommand){
this.button._execCommand(this.editor,this.command,_1f4);
}else{
this.editor.execCommand(this.command,_1f4);
}
});
},updateState:function(){
var _1f5=this.editor;
var _1f6=this.command;
if(!_1f5||!_1f5.isLoaded||!_1f6.length){
return;
}
if(this.button){
var _1f7=this.get("disabled");
this.button.set("disabled",_1f7);
if(_1f7){
return;
}
var _1f8;
try{
_1f8=_1f5.queryCommandValue(_1f6)||"";
}
catch(e){
_1f8="";
}
var _1f9=dojo.isString(_1f8)&&_1f8.match(/'([^']*)'/);
if(_1f9){
_1f8=_1f9[1];
}
if(_1f6==="formatBlock"){
if(!_1f8||_1f8=="p"){
_1f8=null;
var elem;
var sel=dijit.range.getSelection(this.editor.window);
if(sel&&sel.rangeCount>0){
var _1fa=sel.getRangeAt(0);
if(_1fa){
elem=_1fa.endContainer;
}
}
while(elem&&elem!==_1f5.editNode&&elem!==_1f5.document){
var tg=elem.tagName?elem.tagName.toLowerCase():"";
if(tg&&dojo.indexOf(this.button.values,tg)>-1){
_1f8=tg;
break;
}
elem=elem.parentNode;
}
if(!_1f8){
_1f8="noFormat";
}
}else{
if(dojo.indexOf(this.button.values,_1f8)<0){
_1f8="noFormat";
}
}
}
if(_1f8!==this.button.get("value")){
this.button.set("value",_1f8,false);
}
}
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
switch(o.args.name){
case "fontName":
case "fontSize":
case "formatBlock":
o.plugin=new dijit._editor.plugins.FontChoice({command:o.args.name,plainText:o.args.plainText?o.args.plainText:false});
}
});
}
if(!dojo._hasResource["dijit._PaletteMixin"]){
dojo._hasResource["dijit._PaletteMixin"]=true;
dojo.provide("dijit._PaletteMixin");
dojo.declare("dijit._PaletteMixin",[dijit._CssStateMixin],{defaultTimeout:500,timeoutChangeRate:0.9,value:null,_selectedCell:-1,tabIndex:"0",cellClass:"dijitPaletteCell",dyeClass:"",_preparePalette:function(_1fb,_1fc,_1fd){
this._cells=[];
var url=this._blankGif;
_1fd=_1fd||dojo.getObject(this.dyeClass);
for(var row=0;row<_1fb.length;row++){
var _1fe=dojo.create("tr",{tabIndex:"-1"},this.gridNode);
for(var col=0;col<_1fb[row].length;col++){
var _1ff=_1fb[row][col];
if(_1ff){
var _200=new _1fd(_1ff,row,col);
var _201=dojo.create("td",{"class":this.cellClass,tabIndex:"-1",title:_1fc[_1ff]});
_200.fillCell(_201,url);
this.connect(_201,"ondijitclick","_onCellClick");
this._trackMouseState(_201,this.cellClass);
dojo.place(_201,_1fe);
_201.index=this._cells.length;
this._cells.push({node:_201,dye:_200});
}
}
}
this._xDim=_1fb[0].length;
this._yDim=_1fb.length;
var _202={UP_ARROW:-this._xDim,DOWN_ARROW:this._xDim,RIGHT_ARROW:this.isLeftToRight()?1:-1,LEFT_ARROW:this.isLeftToRight()?-1:1};
for(var key in _202){
this._connects.push(dijit.typematic.addKeyListener(this.domNode,{charOrCode:dojo.keys[key],ctrlKey:false,altKey:false,shiftKey:false},this,function(){
var _203=_202[key];
return function(_204){
this._navigateByKey(_203,_204);
};
}(),this.timeoutChangeRate,this.defaultTimeout));
}
},postCreate:function(){
this.inherited(arguments);
this._setCurrent(this._cells[0].node);
},focus:function(){
dijit.focus(this._currentFocus);
},_onCellClick:function(evt){
var _205=evt.currentTarget,_206=this._getDye(_205).getValue();
this._setCurrent(_205);
setTimeout(dojo.hitch(this,function(){
dijit.focus(_205);
this._setValueAttr(_206,true);
}));
dojo.removeClass(_205,"dijitPaletteCellHover");
dojo.stopEvent(evt);
},_setCurrent:function(node){
if("_currentFocus" in this){
dojo.attr(this._currentFocus,"tabIndex","-1");
}
this._currentFocus=node;
if(node){
dojo.attr(node,"tabIndex",this.tabIndex);
}
},_setValueAttr:function(_207,_208){
if(this._selectedCell>=0){
dojo.removeClass(this._cells[this._selectedCell].node,"dijitPaletteCellSelected");
}
this._selectedCell=-1;
if(_207){
for(var i=0;i<this._cells.length;i++){
if(_207==this._cells[i].dye.getValue()){
this._selectedCell=i;
dojo.addClass(this._cells[i].node,"dijitPaletteCellSelected");
break;
}
}
}
this._set("value",this._selectedCell>=0?_207:null);
if(_208||_208===undefined){
this.onChange(_207);
}
},onChange:function(_209){
},_navigateByKey:function(_20a,_20b){
if(_20b==-1){
return;
}
var _20c=this._currentFocus.index+_20a;
if(_20c<this._cells.length&&_20c>-1){
var _20d=this._cells[_20c].node;
this._setCurrent(_20d);
setTimeout(dojo.hitch(dijit,"focus",_20d),0);
}
},_getDye:function(cell){
return this._cells[cell.index].dye;
}});
}
if(!dojo._hasResource["dijit.ColorPalette"]){
dojo._hasResource["dijit.ColorPalette"]=true;
dojo.provide("dijit.ColorPalette");
dojo.declare("dijit.ColorPalette",[dijit._Widget,dijit._Templated,dijit._PaletteMixin],{palette:"7x10",_palettes:{"7x10":[["white","seashell","cornsilk","lemonchiffon","lightyellow","palegreen","paleturquoise","lightcyan","lavender","plum"],["lightgray","pink","bisque","moccasin","khaki","lightgreen","lightseagreen","lightskyblue","cornflowerblue","violet"],["silver","lightcoral","sandybrown","orange","palegoldenrod","chartreuse","mediumturquoise","skyblue","mediumslateblue","orchid"],["gray","red","orangered","darkorange","yellow","limegreen","darkseagreen","royalblue","slateblue","mediumorchid"],["dimgray","crimson","chocolate","coral","gold","forestgreen","seagreen","blue","blueviolet","darkorchid"],["darkslategray","firebrick","saddlebrown","sienna","olive","green","darkcyan","mediumblue","darkslateblue","darkmagenta"],["black","darkred","maroon","brown","darkolivegreen","darkgreen","midnightblue","navy","indigo","purple"]],"3x4":[["white","lime","green","blue"],["silver","yellow","fuchsia","navy"],["gray","red","purple","black"]]},templateString:dojo.cache("dijit","templates/ColorPalette.html","<div class=\"dijitInline dijitColorPalette\">\n\t<table class=\"dijitPaletteTable\" cellSpacing=\"0\" cellPadding=\"0\">\n\t\t<tbody dojoAttachPoint=\"gridNode\"></tbody>\n\t</table>\n</div>\n"),baseClass:"dijitColorPalette",buildRendering:function(){
this.inherited(arguments);
this._preparePalette(this._palettes[this.palette],dojo.i18n.getLocalization("dojo","colors",this.lang),dojo.declare(dijit._Color,{hc:dojo.hasClass(dojo.body(),"dijit_a11y"),palette:this.palette}));
}});
dojo.declare("dijit._Color",dojo.Color,{template:"<span class='dijitInline dijitPaletteImg'>"+"<img src='${blankGif}' alt='${alt}' class='dijitColorPaletteSwatch' style='background-color: ${color}'/>"+"</span>",hcTemplate:"<span class='dijitInline dijitPaletteImg' style='position: relative; overflow: hidden; height: 12px; width: 14px;'>"+"<img src='${image}' alt='${alt}' style='position: absolute; left: ${left}px; top: ${top}px; ${size}'/>"+"</span>",_imagePaths:{"7x10":dojo.moduleUrl("dijit.themes","a11y/colors7x10.png"),"3x4":dojo.moduleUrl("dijit.themes","a11y/colors3x4.png")},constructor:function(_20e,row,col){
this._alias=_20e;
this._row=row;
this._col=col;
this.setColor(dojo.Color.named[_20e]);
},getValue:function(){
return this.toHex();
},fillCell:function(cell,_20f){
var html=dojo.string.substitute(this.hc?this.hcTemplate:this.template,{color:this.toHex(),blankGif:_20f,alt:this._alias,image:this._imagePaths[this.palette].toString(),left:this._col*-20-5,top:this._row*-20-5,size:this.palette=="7x10"?"height: 145px; width: 206px":"height: 64px; width: 86px"});
dojo.place(html,cell);
}});
}
if(!dojo._hasResource["dijit._editor.plugins.TextColor"]){
dojo._hasResource["dijit._editor.plugins.TextColor"]=true;
dojo.provide("dijit._editor.plugins.TextColor");
dojo.declare("dijit._editor.plugins.TextColor",dijit._editor._Plugin,{buttonClass:dijit.form.DropDownButton,useDefaultCommand:false,constructor:function(){
this.dropDown=new dijit.ColorPalette();
this.connect(this.dropDown,"onChange",function(_210){
this.editor.execCommand(this.command,_210);
});
},updateState:function(){
var _211=this.editor;
var _212=this.command;
if(!_211||!_211.isLoaded||!_212.length){
return;
}
if(this.button){
var _213=this.get("disabled");
this.button.set("disabled",_213);
if(_213){
return;
}
var _214;
try{
_214=_211.queryCommandValue(_212)||"";
}
catch(e){
_214="";
}
}
if(_214==""){
_214="#000000";
}
if(_214=="transparent"){
_214="#ffffff";
}
if(typeof _214=="string"){
if(_214.indexOf("rgb")>-1){
_214=dojo.colorFromRgb(_214).toHex();
}
}else{
_214=((_214&255)<<16)|(_214&65280)|((_214&16711680)>>>16);
_214=_214.toString(16);
_214="#000000".slice(0,7-_214.length)+_214;
}
if(_214!==this.dropDown.get("value")){
this.dropDown.set("value",_214,false);
}
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
switch(o.args.name){
case "foreColor":
case "hiliteColor":
o.plugin=new dijit._editor.plugins.TextColor({command:o.args.name});
}
});
}
if(!dojo._hasResource["dijit.layout._ContentPaneResizeMixin"]){
dojo._hasResource["dijit.layout._ContentPaneResizeMixin"]=true;
dojo.provide("dijit.layout._ContentPaneResizeMixin");
dojo.declare("dijit.layout._ContentPaneResizeMixin",null,{doLayout:true,isContainer:true,isLayoutContainer:true,_startChildren:function(){
dojo.forEach(this.getChildren(),function(_215){
_215.startup();
_215._started=true;
});
},startup:function(){
if(this._started){
return;
}
var _216=dijit._Contained.prototype.getParent.call(this);
this._childOfLayoutWidget=_216&&_216.isLayoutContainer;
this._needLayout=!this._childOfLayoutWidget;
this.inherited(arguments);
this._startChildren();
if(this._isShown()){
this._onShow();
}
if(!this._childOfLayoutWidget){
this.connect(dojo.isIE?this.domNode:dojo.global,"onresize",function(){
this._needLayout=!this._childOfLayoutWidget;
this.resize();
});
}
},_checkIfSingleChild:function(){
var _217=dojo.query("> *",this.containerNode).filter(function(node){
return node.tagName!=="SCRIPT";
}),_218=_217.filter(function(node){
return dojo.hasAttr(node,"data-dojo-type")||dojo.hasAttr(node,"dojoType")||dojo.hasAttr(node,"widgetId");
}),_219=dojo.filter(_218.map(dijit.byNode),function(_21a){
return _21a&&_21a.domNode&&_21a.resize;
});
if(_217.length==_218.length&&_219.length==1){
this._singleChild=_219[0];
}else{
delete this._singleChild;
}
dojo.toggleClass(this.containerNode,this.baseClass+"SingleChild",!!this._singleChild);
},resize:function(_21b,_21c){
if(!this._wasShown&&this.open!==false){
this._onShow();
}
this._resizeCalled=true;
this._scheduleLayout(_21b,_21c);
},_scheduleLayout:function(_21d,_21e){
if(this._isShown()){
this._layout(_21d,_21e);
}else{
this._needLayout=true;
this._changeSize=_21d;
this._resultSize=_21e;
}
},_layout:function(_21f,_220){
if(_21f){
dojo.marginBox(this.domNode,_21f);
}
var cn=this.containerNode;
if(cn===this.domNode){
var mb=_220||{};
dojo.mixin(mb,_21f||{});
if(!("h" in mb)||!("w" in mb)){
mb=dojo.mixin(dojo.marginBox(cn),mb);
}
this._contentBox=dijit.layout.marginBox2contentBox(cn,mb);
}else{
this._contentBox=dojo.contentBox(cn);
}
this._layoutChildren();
delete this._needLayout;
},_layoutChildren:function(){
if(this.doLayout){
this._checkIfSingleChild();
}
if(this._singleChild&&this._singleChild.resize){
var cb=this._contentBox||dojo.contentBox(this.containerNode);
this._singleChild.resize({w:cb.w,h:cb.h});
}else{
dojo.forEach(this.getChildren(),function(_221){
if(_221.resize){
_221.resize();
}
});
}
},_isShown:function(){
if(this._childOfLayoutWidget){
if(this._resizeCalled&&"open" in this){
return this.open;
}
return this._resizeCalled;
}else{
if("open" in this){
return this.open;
}else{
var node=this.domNode,_222=this.domNode.parentNode;
return (node.style.display!="none")&&(node.style.visibility!="hidden")&&!dojo.hasClass(node,"dijitHidden")&&_222&&_222.style&&(_222.style.display!="none");
}
}
},_onShow:function(){
if(this._needLayout){
this._layout(this._changeSize,this._resultSize);
}
this.inherited(arguments);
this._wasShown=true;
}});
}
if(!dojo._hasResource["dojo.html"]){
dojo._hasResource["dojo.html"]=true;
dojo.provide("dojo.html");
dojo.getObject("html",true,dojo);
(function(){
var _223=0,d=dojo;
dojo.html._secureForInnerHtml=function(cont){
return cont.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig,"");
};
dojo.html._emptyNode=dojo.empty;
dojo.html._setNodeContent=function(node,cont){
d.empty(node);
if(cont){
if(typeof cont=="string"){
cont=d._toDom(cont,node.ownerDocument);
}
if(!cont.nodeType&&d.isArrayLike(cont)){
for(var _224=cont.length,i=0;i<cont.length;i=_224==cont.length?i+1:0){
d.place(cont[i],node,"last");
}
}else{
d.place(cont,node,"last");
}
}
return node;
};
dojo.declare("dojo.html._ContentSetter",null,{node:"",content:"",id:"",cleanContent:false,extractContent:false,parseContent:false,parserScope:dojo._scopeName,startup:true,constructor:function(_225,node){
dojo.mixin(this,_225||{});
node=this.node=dojo.byId(this.node||node);
if(!this.id){
this.id=["Setter",(node)?node.id||node.tagName:"",_223++].join("_");
}
},set:function(cont,_226){
if(undefined!==cont){
this.content=cont;
}
if(_226){
this._mixin(_226);
}
this.onBegin();
this.setContent();
this.onEnd();
return this.node;
},setContent:function(){
var node=this.node;
if(!node){
throw new Error(this.declaredClass+": setContent given no node");
}
try{
node=dojo.html._setNodeContent(node,this.content);
}
catch(e){
var _227=this.onContentError(e);
try{
node.innerHTML=_227;
}
catch(e){
console.error("Fatal "+this.declaredClass+".setContent could not change content due to "+e.message,e);
}
}
this.node=node;
},empty:function(){
if(this.parseResults&&this.parseResults.length){
dojo.forEach(this.parseResults,function(w){
if(w.destroy){
w.destroy();
}
});
delete this.parseResults;
}
dojo.html._emptyNode(this.node);
},onBegin:function(){
var cont=this.content;
if(dojo.isString(cont)){
if(this.cleanContent){
cont=dojo.html._secureForInnerHtml(cont);
}
if(this.extractContent){
var _228=cont.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_228){
cont=_228[1];
}
}
}
this.empty();
this.content=cont;
return this.node;
},onEnd:function(){
if(this.parseContent){
this._parse();
}
return this.node;
},tearDown:function(){
delete this.parseResults;
delete this.node;
delete this.content;
},onContentError:function(err){
return "Error occured setting content: "+err;
},_mixin:function(_229){
var _22a={},key;
for(key in _229){
if(key in _22a){
continue;
}
this[key]=_229[key];
}
},_parse:function(){
var _22b=this.node;
try{
var _22c={};
dojo.forEach(["dir","lang","textDir"],function(name){
if(this[name]){
_22c[name]=this[name];
}
},this);
this.parseResults=dojo.parser.parse({rootNode:_22b,noStart:!this.startup,inherited:_22c,scope:this.parserScope});
}
catch(e){
this._onError("Content",e,"Error parsing in _ContentSetter#"+this.id);
}
},_onError:function(type,err,_22d){
var _22e=this["on"+type+"Error"].call(this,err);
if(_22d){
console.error(_22d,err);
}else{
if(_22e){
dojo.html._setNodeContent(this.node,_22e,true);
}
}
}});
dojo.html.set=function(node,cont,_22f){
if(undefined==cont){
console.warn("dojo.html.set: no cont argument provided, using empty string");
cont="";
}
if(!_22f){
return dojo.html._setNodeContent(node,cont,true);
}else{
var op=new dojo.html._ContentSetter(dojo.mixin(_22f,{content:cont,node:node}));
return op.set();
}
};
})();
}
if(!dojo._hasResource["dijit.layout.ContentPane"]){
dojo._hasResource["dijit.layout.ContentPane"]=true;
dojo.provide("dijit.layout.ContentPane");
dojo.declare("dijit.layout.ContentPane",[dijit._Widget,dijit.layout._ContentPaneResizeMixin],{href:"",extractContent:false,parseOnLoad:true,parserScope:dojo._scopeName,preventCache:false,preload:false,refreshOnShow:false,loadingMessage:"<span class='dijitContentPaneLoading'>${loadingState}</span>",errorMessage:"<span class='dijitContentPaneError'>${errorState}</span>",isLoaded:false,baseClass:"dijitContentPane",ioArgs:{},onLoadDeferred:null,attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{title:[]}),stopParser:true,template:false,create:function(_230,_231){
if((!_230||!_230.template)&&_231&&!("href" in _230)&&!("content" in _230)){
var df=dojo.doc.createDocumentFragment();
_231=dojo.byId(_231);
while(_231.firstChild){
df.appendChild(_231.firstChild);
}
_230=dojo.delegate(_230,{content:df});
}
this.inherited(arguments,[_230,_231]);
},postMixInProperties:function(){
this.inherited(arguments);
var _232=dojo.i18n.getLocalization("dijit","loading",this.lang);
this.loadingMessage=dojo.string.substitute(this.loadingMessage,_232);
this.errorMessage=dojo.string.substitute(this.errorMessage,_232);
},buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
this.domNode.title="";
if(!dojo.attr(this.domNode,"role")){
dijit.setWaiRole(this.domNode,"group");
}
},_startChildren:function(){
this.inherited(arguments);
if(this._contentSetter){
dojo.forEach(this._contentSetter.parseResults,function(obj){
if(!obj._started&&!obj._destroyed&&dojo.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
},this);
}
},setHref:function(href){
dojo.deprecated("dijit.layout.ContentPane.setHref() is deprecated. Use set('href', ...) instead.","","2.0");
return this.set("href",href);
},_setHrefAttr:function(href){
this.cancel();
this.onLoadDeferred=new dojo.Deferred(dojo.hitch(this,"cancel"));
this.onLoadDeferred.addCallback(dojo.hitch(this,"onLoad"));
this._set("href",href);
if(this.preload||(this._created&&this._isShown())){
this._load();
}else{
this._hrefChanged=true;
}
return this.onLoadDeferred;
},setContent:function(data){
dojo.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use set('content', ...) instead.","","2.0");
this.set("content",data);
},_setContentAttr:function(data){
this._set("href","");
this.cancel();
this.onLoadDeferred=new dojo.Deferred(dojo.hitch(this,"cancel"));
if(this._created){
this.onLoadDeferred.addCallback(dojo.hitch(this,"onLoad"));
}
this._setContent(data||"");
this._isDownloaded=false;
return this.onLoadDeferred;
},_getContentAttr:function(){
return this.containerNode.innerHTML;
},cancel:function(){
if(this._xhrDfd&&(this._xhrDfd.fired==-1)){
this._xhrDfd.cancel();
}
delete this._xhrDfd;
this.onLoadDeferred=null;
},uninitialize:function(){
if(this._beingDestroyed){
this.cancel();
}
this.inherited(arguments);
},destroyRecursive:function(_233){
if(this._beingDestroyed){
return;
}
this.inherited(arguments);
},_onShow:function(){
this.inherited(arguments);
if(this.href){
if(!this._xhrDfd&&(!this.isLoaded||this._hrefChanged||this.refreshOnShow)){
return this.refresh();
}
}
},refresh:function(){
this.cancel();
this.onLoadDeferred=new dojo.Deferred(dojo.hitch(this,"cancel"));
this.onLoadDeferred.addCallback(dojo.hitch(this,"onLoad"));
this._load();
return this.onLoadDeferred;
},_load:function(){
this._setContent(this.onDownloadStart(),true);
var self=this;
var _234={preventCache:(this.preventCache||this.refreshOnShow),url:this.href,handleAs:"text"};
if(dojo.isObject(this.ioArgs)){
dojo.mixin(_234,this.ioArgs);
}
var hand=(this._xhrDfd=(this.ioMethod||dojo.xhrGet)(_234));
hand.addCallback(function(html){
try{
self._isDownloaded=true;
self._setContent(html,false);
self.onDownloadEnd();
}
catch(err){
self._onError("Content",err);
}
delete self._xhrDfd;
return html;
});
hand.addErrback(function(err){
if(!hand.canceled){
self._onError("Download",err);
}
delete self._xhrDfd;
return err;
});
delete this._hrefChanged;
},_onLoadHandler:function(data){
this._set("isLoaded",true);
try{
this.onLoadDeferred.callback(data);
}
catch(e){
console.error("Error "+this.widgetId+" running custom onLoad code: "+e.message);
}
},_onUnloadHandler:function(){
this._set("isLoaded",false);
try{
this.onUnload();
}
catch(e){
console.error("Error "+this.widgetId+" running custom onUnload code: "+e.message);
}
},destroyDescendants:function(){
if(this.isLoaded){
this._onUnloadHandler();
}
var _235=this._contentSetter;
dojo.forEach(this.getChildren(),function(_236){
if(_236.destroyRecursive){
_236.destroyRecursive();
}
});
if(_235){
dojo.forEach(_235.parseResults,function(_237){
if(_237.destroyRecursive&&_237.domNode&&_237.domNode.parentNode==dojo.body()){
_237.destroyRecursive();
}
});
delete _235.parseResults;
}
dojo.html._emptyNode(this.containerNode);
delete this._singleChild;
},_setContent:function(cont,_238){
this.destroyDescendants();
var _239=this._contentSetter;
if(!(_239&&_239 instanceof dojo.html._ContentSetter)){
_239=this._contentSetter=new dojo.html._ContentSetter({node:this.containerNode,_onError:dojo.hitch(this,this._onError),onContentError:dojo.hitch(this,function(e){
var _23a=this.onContentError(e);
try{
this.containerNode.innerHTML=_23a;
}
catch(e){
console.error("Fatal "+this.id+" could not change content due to "+e.message,e);
}
})});
}
var _23b=dojo.mixin({cleanContent:this.cleanContent,extractContent:this.extractContent,parseContent:this.parseOnLoad,parserScope:this.parserScope,startup:false,dir:this.dir,lang:this.lang},this._contentSetterParams||{});
_239.set((dojo.isObject(cont)&&cont.domNode)?cont.domNode:cont,_23b);
delete this._contentSetterParams;
if(this.doLayout){
this._checkIfSingleChild();
}
if(!_238){
if(this._started){
this._startChildren();
this._scheduleLayout();
}
this._onLoadHandler(cont);
}
},_onError:function(type,err,_23c){
this.onLoadDeferred.errback(err);
var _23d=this["on"+type+"Error"].call(this,err);
if(_23c){
console.error(_23c,err);
}else{
if(_23d){
this._setContent(_23d,true);
}
}
},onLoad:function(data){
},onUnload:function(){
},onDownloadStart:function(){
return this.loadingMessage;
},onContentError:function(_23e){
},onDownloadError:function(_23f){
return this.errorMessage;
},onDownloadEnd:function(){
}});
}
if(!dojo._hasResource["dijit.form._FormMixin"]){
dojo._hasResource["dijit.form._FormMixin"]=true;
dojo.provide("dijit.form._FormMixin");
dojo.declare("dijit.form._FormMixin",null,{state:"",reset:function(){
dojo.forEach(this.getDescendants(),function(_240){
if(_240.reset){
_240.reset();
}
});
},validate:function(){
var _241=false;
return dojo.every(dojo.map(this.getDescendants(),function(_242){
_242._hasBeenBlurred=true;
var _243=_242.disabled||!_242.validate||_242.validate();
if(!_243&&!_241){
dojo.window.scrollIntoView(_242.containerNode||_242.domNode);
_242.focus();
_241=true;
}
return _243;
}),function(item){
return item;
});
},setValues:function(val){
dojo.deprecated(this.declaredClass+"::setValues() is deprecated. Use set('value', val) instead.","","2.0");
return this.set("value",val);
},_setValueAttr:function(obj){
var map={};
dojo.forEach(this.getDescendants(),function(_244){
if(!_244.name){
return;
}
var _245=map[_244.name]||(map[_244.name]=[]);
_245.push(_244);
});
for(var name in map){
if(!map.hasOwnProperty(name)){
continue;
}
var _246=map[name],_247=dojo.getObject(name,false,obj);
if(_247===undefined){
continue;
}
if(!dojo.isArray(_247)){
_247=[_247];
}
if(typeof _246[0].checked=="boolean"){
dojo.forEach(_246,function(w,i){
w.set("value",dojo.indexOf(_247,w.value)!=-1);
});
}else{
if(_246[0].multiple){
_246[0].set("value",_247);
}else{
dojo.forEach(_246,function(w,i){
w.set("value",_247[i]);
});
}
}
}
},getValues:function(){
dojo.deprecated(this.declaredClass+"::getValues() is deprecated. Use get('value') instead.","","2.0");
return this.get("value");
},_getValueAttr:function(){
var obj={};
dojo.forEach(this.getDescendants(),function(_248){
var name=_248.name;
if(!name||_248.disabled){
return;
}
var _249=_248.get("value");
if(typeof _248.checked=="boolean"){
if(/Radio/.test(_248.declaredClass)){
if(_249!==false){
dojo.setObject(name,_249,obj);
}else{
_249=dojo.getObject(name,false,obj);
if(_249===undefined){
dojo.setObject(name,null,obj);
}
}
}else{
var ary=dojo.getObject(name,false,obj);
if(!ary){
ary=[];
dojo.setObject(name,ary,obj);
}
if(_249!==false){
ary.push(_249);
}
}
}else{
var prev=dojo.getObject(name,false,obj);
if(typeof prev!="undefined"){
if(dojo.isArray(prev)){
prev.push(_249);
}else{
dojo.setObject(name,[prev,_249],obj);
}
}else{
dojo.setObject(name,_249,obj);
}
}
});
return obj;
},isValid:function(){
return this.state=="";
},onValidStateChange:function(_24a){
},_getState:function(){
var _24b=dojo.map(this._descendants,function(w){
return w.get("state")||"";
});
return dojo.indexOf(_24b,"Error")>=0?"Error":dojo.indexOf(_24b,"Incomplete")>=0?"Incomplete":"";
},disconnectChildren:function(){
dojo.forEach(this._childConnections||[],dojo.hitch(this,"disconnect"));
dojo.forEach(this._childWatches||[],function(w){
w.unwatch();
});
},connectChildren:function(_24c){
var _24d=this;
this.disconnectChildren();
this._descendants=this.getDescendants();
var set=_24c?function(name,val){
_24d[name]=val;
}:dojo.hitch(this,"_set");
set("value",this.get("value"));
set("state",this._getState());
var _24e=(this._childConnections=[]),_24f=(this._childWatches=[]);
dojo.forEach(dojo.filter(this._descendants,function(item){
return item.validate;
}),function(_250){
dojo.forEach(["state","disabled"],function(attr){
_24f.push(_250.watch(attr,function(attr,_251,_252){
_24d.set("state",_24d._getState());
}));
});
});
var _253=function(){
if(_24d._onChangeDelayTimer){
clearTimeout(_24d._onChangeDelayTimer);
}
_24d._onChangeDelayTimer=setTimeout(function(){
delete _24d._onChangeDelayTimer;
_24d._set("value",_24d.get("value"));
},10);
};
dojo.forEach(dojo.filter(this._descendants,function(item){
return item.onChange;
}),function(_254){
_24e.push(_24d.connect(_254,"onChange",_253));
_24f.push(_254.watch("disabled",_253));
});
},startup:function(){
this.inherited(arguments);
this.connectChildren(true);
this.watch("state",function(attr,_255,_256){
this.onValidStateChange(_256=="");
});
},destroy:function(){
this.disconnectChildren();
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit._DialogMixin"]){
dojo._hasResource["dijit._DialogMixin"]=true;
dojo.provide("dijit._DialogMixin");
dojo.declare("dijit._DialogMixin",null,{attributeMap:dijit._Widget.prototype.attributeMap,execute:function(_257){
},onCancel:function(){
},onExecute:function(){
},_onSubmit:function(){
this.onExecute();
this.execute(this.get("value"));
},_getFocusItems:function(){
var _258=dijit._getTabNavigable(this.containerNode);
this._firstFocusItem=_258.lowest||_258.first||this.closeButtonNode||this.domNode;
this._lastFocusItem=_258.last||_258.highest||this._firstFocusItem;
}});
}
if(!dojo._hasResource["dijit.TooltipDialog"]){
dojo._hasResource["dijit.TooltipDialog"]=true;
dojo.provide("dijit.TooltipDialog");
dojo.declare("dijit.TooltipDialog",[dijit.layout.ContentPane,dijit._Templated,dijit.form._FormMixin,dijit._DialogMixin],{title:"",doLayout:false,autofocus:true,baseClass:"dijitTooltipDialog",_firstFocusItem:null,_lastFocusItem:null,templateString:dojo.cache("dijit","templates/TooltipDialog.html","<div role=\"presentation\" tabIndex=\"-1\">\n\t<div class=\"dijitTooltipContainer\" role=\"presentation\">\n\t\t<div class =\"dijitTooltipContents dijitTooltipFocusNode\" dojoAttachPoint=\"containerNode\" role=\"dialog\"></div>\n\t</div>\n\t<div class=\"dijitTooltipConnector\" role=\"presentation\"></div>\n</div>\n"),_setTitleAttr:function(_259){
this.containerNode.title=_259;
this._set("title",_259);
},postCreate:function(){
this.inherited(arguments);
this.connect(this.containerNode,"onkeypress","_onKey");
},orient:function(node,_25a,_25b){
var newC="dijitTooltipAB"+(_25b.charAt(1)=="L"?"Left":"Right")+" dijitTooltip"+(_25b.charAt(0)=="T"?"Below":"Above");
dojo.replaceClass(this.domNode,newC,this._currentOrientClass||"");
this._currentOrientClass=newC;
},focus:function(){
this._getFocusItems(this.containerNode);
dijit.focus(this._firstFocusItem);
},onOpen:function(pos){
this.orient(this.domNode,pos.aroundCorner,pos.corner);
this._onShow();
},onClose:function(){
this.onHide();
},_onKey:function(evt){
var node=evt.target;
var dk=dojo.keys;
if(evt.charOrCode===dk.TAB){
this._getFocusItems(this.containerNode);
}
var _25c=(this._firstFocusItem==this._lastFocusItem);
if(evt.charOrCode==dk.ESCAPE){
setTimeout(dojo.hitch(this,"onCancel"),0);
dojo.stopEvent(evt);
}else{
if(node==this._firstFocusItem&&evt.shiftKey&&evt.charOrCode===dk.TAB){
if(!_25c){
dijit.focus(this._lastFocusItem);
}
dojo.stopEvent(evt);
}else{
if(node==this._lastFocusItem&&evt.charOrCode===dk.TAB&&!evt.shiftKey){
if(!_25c){
dijit.focus(this._firstFocusItem);
}
dojo.stopEvent(evt);
}else{
if(evt.charOrCode===dk.TAB){
evt.stopPropagation();
}
}
}
}
}});
}
if(!dojo._hasResource["dijit.form._FormSelectWidget"]){
dojo._hasResource["dijit.form._FormSelectWidget"]=true;
dojo.provide("dijit.form._FormSelectWidget");
dojo.declare("dijit.form._FormSelectWidget",dijit.form._FormValueWidget,{multiple:false,options:null,store:null,query:null,queryOptions:null,onFetch:null,sortByLabel:true,loadChildrenOnOpen:false,getOptions:function(_25d){
var _25e=_25d,opts=this.options||[],l=opts.length;
if(_25e===undefined){
return opts;
}
if(dojo.isArray(_25e)){
return dojo.map(_25e,"return this.getOptions(item);",this);
}
if(dojo.isObject(_25d)){
if(!dojo.some(this.options,function(o,idx){
if(o===_25e||(o.value&&o.value===_25e.value)){
_25e=idx;
return true;
}
return false;
})){
_25e=-1;
}
}
if(typeof _25e=="string"){
for(var i=0;i<l;i++){
if(opts[i].value===_25e){
_25e=i;
break;
}
}
}
if(typeof _25e=="number"&&_25e>=0&&_25e<l){
return this.options[_25e];
}
return null;
},addOption:function(_25f){
if(!dojo.isArray(_25f)){
_25f=[_25f];
}
dojo.forEach(_25f,function(i){
if(i&&dojo.isObject(i)){
this.options.push(i);
}
},this);
this._loadChildren();
},removeOption:function(_260){
if(!dojo.isArray(_260)){
_260=[_260];
}
var _261=this.getOptions(_260);
dojo.forEach(_261,function(i){
if(i){
this.options=dojo.filter(this.options,function(node,idx){
return (node.value!==i.value||node.label!==i.label);
});
this._removeOptionItem(i);
}
},this);
this._loadChildren();
},updateOption:function(_262){
if(!dojo.isArray(_262)){
_262=[_262];
}
dojo.forEach(_262,function(i){
var _263=this.getOptions(i),k;
if(_263){
for(k in i){
_263[k]=i[k];
}
}
},this);
this._loadChildren();
},setStore:function(_264,_265,_266){
var _267=this.store;
_266=_266||{};
if(_267!==_264){
dojo.forEach(this._notifyConnections||[],dojo.disconnect);
delete this._notifyConnections;
if(_264&&_264.getFeatures()["dojo.data.api.Notification"]){
this._notifyConnections=[dojo.connect(_264,"onNew",this,"_onNewItem"),dojo.connect(_264,"onDelete",this,"_onDeleteItem"),dojo.connect(_264,"onSet",this,"_onSetItem")];
}
this._set("store",_264);
}
this._onChangeActive=false;
if(this.options&&this.options.length){
this.removeOption(this.options);
}
if(_264){
this._loadingStore=true;
_264.fetch(dojo.delegate(_266,{onComplete:function(_268,opts){
if(this.sortByLabel&&!_266.sort&&_268.length){
_268.sort(dojo.data.util.sorter.createSortFunction([{attribute:_264.getLabelAttributes(_268[0])[0]}],_264));
}
if(_266.onFetch){
_268=_266.onFetch.call(this,_268,opts);
}
dojo.forEach(_268,function(i){
this._addOptionForItem(i);
},this);
this._loadingStore=false;
this.set("value","_pendingValue" in this?this._pendingValue:_265);
delete this._pendingValue;
if(!this.loadChildrenOnOpen){
this._loadChildren();
}else{
this._pseudoLoadChildren(_268);
}
this._fetchedWith=opts;
this._lastValueReported=this.multiple?[]:null;
this._onChangeActive=true;
this.onSetStore();
this._handleOnChange(this.value);
},scope:this}));
}else{
delete this._fetchedWith;
}
return _267;
},_setValueAttr:function(_269,_26a){
if(this._loadingStore){
this._pendingValue=_269;
return;
}
var opts=this.getOptions()||[];
if(!dojo.isArray(_269)){
_269=[_269];
}
dojo.forEach(_269,function(i,idx){
if(!dojo.isObject(i)){
i=i+"";
}
if(typeof i==="string"){
_269[idx]=dojo.filter(opts,function(node){
return node.value===i;
})[0]||{value:"",label:""};
}
},this);
_269=dojo.filter(_269,function(i){
return i&&i.value;
});
if(!this.multiple&&(!_269[0]||!_269[0].value)&&opts.length){
_269[0]=opts[0];
}
dojo.forEach(opts,function(i){
i.selected=dojo.some(_269,function(v){
return v.value===i.value;
});
});
var val=dojo.map(_269,function(i){
return i.value;
}),disp=dojo.map(_269,function(i){
return i.label;
});
this._set("value",this.multiple?val:val[0]);
this._setDisplay(this.multiple?disp:disp[0]);
this._updateSelection();
this._handleOnChange(this.value,_26a);
},_getDisplayedValueAttr:function(){
var val=this.get("value");
if(!dojo.isArray(val)){
val=[val];
}
var ret=dojo.map(this.getOptions(val),function(v){
if(v&&"label" in v){
return v.label;
}else{
if(v){
return v.value;
}
}
return null;
},this);
return this.multiple?ret:ret[0];
},_loadChildren:function(){
if(this._loadingStore){
return;
}
dojo.forEach(this._getChildren(),function(_26b){
_26b.destroyRecursive();
});
dojo.forEach(this.options,this._addOptionItem,this);
this._updateSelection();
},_updateSelection:function(){
this._set("value",this._getValueFromOpts());
var val=this.value;
if(!dojo.isArray(val)){
val=[val];
}
if(val&&val[0]){
dojo.forEach(this._getChildren(),function(_26c){
var _26d=dojo.some(val,function(v){
return _26c.option&&(v===_26c.option.value);
});
dojo.toggleClass(_26c.domNode,this.baseClass+"SelectedOption",_26d);
dijit.setWaiState(_26c.domNode,"selected",_26d);
},this);
}
},_getValueFromOpts:function(){
var opts=this.getOptions()||[];
if(!this.multiple&&opts.length){
var opt=dojo.filter(opts,function(i){
return i.selected;
})[0];
if(opt&&opt.value){
return opt.value;
}else{
opts[0].selected=true;
return opts[0].value;
}
}else{
if(this.multiple){
return dojo.map(dojo.filter(opts,function(i){
return i.selected;
}),function(i){
return i.value;
})||[];
}
}
return "";
},_onNewItem:function(item,_26e){
if(!_26e||!_26e.parent){
this._addOptionForItem(item);
}
},_onDeleteItem:function(item){
var _26f=this.store;
this.removeOption(_26f.getIdentity(item));
},_onSetItem:function(item){
this.updateOption(this._getOptionObjForItem(item));
},_getOptionObjForItem:function(item){
var _270=this.store,_271=_270.getLabel(item),_272=(_271?_270.getIdentity(item):null);
return {value:_272,label:_271,item:item};
},_addOptionForItem:function(item){
var _273=this.store;
if(!_273.isItemLoaded(item)){
_273.loadItem({item:item,onComplete:function(i){
this._addOptionForItem(item);
},scope:this});
return;
}
var _274=this._getOptionObjForItem(item);
this.addOption(_274);
},constructor:function(_275){
this._oValue=(_275||{}).value||null;
},buildRendering:function(){
this.inherited(arguments);
dojo.setSelectable(this.focusNode,false);
},_fillContent:function(){
var opts=this.options;
if(!opts){
opts=this.options=this.srcNodeRef?dojo.query(">",this.srcNodeRef).map(function(node){
if(node.getAttribute("type")==="separator"){
return {value:"",label:"",selected:false,disabled:false};
}
return {value:(node.getAttribute("data-"+dojo._scopeName+"-value")||node.getAttribute("value")),label:String(node.innerHTML),selected:node.getAttribute("selected")||false,disabled:node.getAttribute("disabled")||false};
},this):[];
}
if(!this.value){
this._set("value",this._getValueFromOpts());
}else{
if(this.multiple&&typeof this.value=="string"){
this_set("value",this.value.split(","));
}
}
},postCreate:function(){
this.inherited(arguments);
this.connect(this,"onChange","_updateSelection");
this.connect(this,"startup","_loadChildren");
this._setValueAttr(this.value,null);
},startup:function(){
this.inherited(arguments);
var _276=this.store,_277={};
dojo.forEach(["query","queryOptions","onFetch"],function(i){
if(this[i]){
_277[i]=this[i];
}
delete this[i];
},this);
if(_276&&_276.getFeatures()["dojo.data.api.Identity"]){
this.store=null;
this.setStore(_276,this._oValue,_277);
}
},destroy:function(){
dojo.forEach(this._notifyConnections||[],dojo.disconnect);
this.inherited(arguments);
},_addOptionItem:function(_278){
},_removeOptionItem:function(_279){
},_setDisplay:function(_27a){
},_getChildren:function(){
return [];
},_getSelectedOptionsAttr:function(){
return this.getOptions(this.get("value"));
},_pseudoLoadChildren:function(_27b){
},onSetStore:function(){
}});
}
if(!dojo._hasResource["dijit.MenuItem"]){
dojo._hasResource["dijit.MenuItem"]=true;
dojo.provide("dijit.MenuItem");
dojo.declare("dijit.MenuItem",[dijit._Widget,dijit._Templated,dijit._Contained,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/MenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n"),attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{label:{node:"containerNode",type:"innerHTML"},iconClass:{node:"iconNode",type:"class"}}),baseClass:"dijitMenuItem",label:"",iconClass:"",accelKey:"",disabled:false,_fillContent:function(_27c){
if(_27c&&!("label" in this.params)){
this.set("label",_27c.innerHTML);
}
},buildRendering:function(){
this.inherited(arguments);
var _27d=this.id+"_text";
dojo.attr(this.containerNode,"id",_27d);
if(this.accelKeyNode){
dojo.attr(this.accelKeyNode,"id",this.id+"_accel");
_27d+=" "+this.id+"_accel";
}
dijit.setWaiState(this.domNode,"labelledby",_27d);
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
},_setSelected:function(_27e){
dojo.toggleClass(this.domNode,"dijitMenuItemSelected",_27e);
},setLabel:function(_27f){
dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_27f);
},setDisabled:function(_280){
dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");
this.set("disabled",_280);
},_setDisabledAttr:function(_281){
dijit.setWaiState(this.focusNode,"disabled",_281?"true":"false");
this._set("disabled",_281);
},_setAccelKeyAttr:function(_282){
this.accelKeyNode.style.display=_282?"":"none";
this.accelKeyNode.innerHTML=_282;
dojo.attr(this.containerNode,"colSpan",_282?"1":"2");
this._set("accelKey",_282);
}});
}
if(!dojo._hasResource["dijit.PopupMenuItem"]){
dojo._hasResource["dijit.PopupMenuItem"]=true;
dojo.provide("dijit.PopupMenuItem");
dojo.declare("dijit.PopupMenuItem",dijit.MenuItem,{_fillContent:function(){
if(this.srcNodeRef){
var _283=dojo.query("*",this.srcNodeRef);
dijit.PopupMenuItem.superclass._fillContent.call(this,_283[0]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(!this.popup){
var node=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.popup=dijit.byNode(node);
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
dojo.declare("dijit.CheckedMenuItem",dijit.MenuItem,{templateString:dojo.cache("dijit","templates/CheckedMenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\n</tr>\n"),checked:false,_setCheckedAttr:function(_284){
dojo.toggleClass(this.domNode,"dijitCheckedMenuItemChecked",_284);
dijit.setWaiState(this.domNode,"checked",_284);
this._set("checked",_284);
},onChange:function(_285){
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
dojo.forEach(this.getChildren(),function(_286){
_286.startup();
});
this.startupKeyNavChildren();
this.inherited(arguments);
},onExecute:function(){
},onCancel:function(_287){
},_moveToPopup:function(evt){
if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){
this.focusedChild._onClick(evt);
}else{
var _288=this._getTopMenu();
if(_288&&_288._isMenuBar){
_288.focusNext();
}
}
},_onPopupHover:function(evt){
if(this.currentPopup&&this.currentPopup._pendingClose_timer){
var _289=this.currentPopup.parentMenu;
if(_289.focusedChild){
_289.focusedChild._setSelected(false);
}
_289.focusedChild=this.currentPopup.from_item;
_289.focusedChild._setSelected(true);
this._stopPendingCloseTimer(this.currentPopup);
}
},onItemHover:function(item){
if(this.isActive||this.openOnHover){
this.focusChild(item);
if(this.openOnHover||(this.focusedChild.popup&&!this.focusedChild.disabled&&!this.hover_timer)){
this.hover_timer=setTimeout(dojo.hitch(this,"_openPopup"),this.popupDelay);
}
}
if(this.focusedChild){
this.focusChild(item);
}
this._hoveredChild=item;
},_onChildBlur:function(item){
this._stopPopupTimer();
item._setSelected(false);
var _28a=item.popup;
if(_28a){
this._stopPendingCloseTimer(_28a);
_28a._pendingClose_timer=setTimeout(function(){
_28a._pendingClose_timer=null;
if(_28a.parentMenu){
_28a.parentMenu.currentPopup=null;
}
dijit.popup.close(_28a);
},this.popupDelay);
}
},onItemUnhover:function(item){
if(this.isActive){
this._stopPopupTimer();
}
if(this._hoveredChild==item){
this._hoveredChild=null;
}
},_stopPopupTimer:function(){
if(this.hover_timer){
clearTimeout(this.hover_timer);
this.hover_timer=null;
}
},_stopPendingCloseTimer:function(_28b){
if(_28b._pendingClose_timer){
clearTimeout(_28b._pendingClose_timer);
_28b._pendingClose_timer=null;
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
},onItemClick:function(item,evt){
if(typeof this.isShowingNow=="undefined"){
this._markActive();
}
this.focusChild(item);
if(item.disabled){
return false;
}
if(item.popup){
this._openPopup();
}else{
this.onExecute();
item.onClick(evt);
}
},_openPopup:function(){
this._stopPopupTimer();
var _28c=this.focusedChild;
if(!_28c){
return;
}
var _28d=_28c.popup;
if(_28d.isShowingNow){
return;
}
if(this.currentPopup){
this._stopPendingCloseTimer(this.currentPopup);
dijit.popup.close(this.currentPopup);
}
_28d.parentMenu=this;
_28d.from_item=_28c;
var self=this;
dijit.popup.open({parent:this,popup:_28d,around:_28c.domNode,orient:this._orient||(this.isLeftToRight()?{"TR":"TL","TL":"TR","BR":"BL","BL":"BR"}:{"TL":"TR","TR":"TL","BL":"BR","BR":"BL"}),onCancel:function(){
self.focusChild(_28c);
self._cleanUp();
_28c._setSelected(true);
self.focusedChild=_28c;
},onExecute:dojo.hitch(this,"_cleanUp")});
this.currentPopup=_28d;
_28d.connect(_28d.domNode,"onmouseenter",dojo.hitch(self,"_onPopupHover"));
if(_28d.focus){
_28d._focus_timer=setTimeout(dojo.hitch(_28d,function(){
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
var _28e=this.focusedChild&&this.focusedChild.from_item;
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
},_onItemFocus:function(item){
if(this._hoveredChild&&this._hoveredChild!=item){
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
},_iframeContentWindow:function(_28f){
var win=dojo.window.get(this._iframeContentDocument(_28f))||this._iframeContentDocument(_28f)["__parent__"]||(_28f.name&&dojo.doc.frames[_28f.name])||null;
return win;
},_iframeContentDocument:function(_290){
var doc=_290.contentDocument||(_290.contentWindow&&_290.contentWindow.document)||(_290.name&&dojo.doc.frames[_290.name]&&dojo.doc.frames[_290.name].document)||null;
return doc;
},bindDomNode:function(node){
node=dojo.byId(node);
var cn;
if(node.tagName.toLowerCase()=="iframe"){
var _291=node,win=this._iframeContentWindow(_291);
cn=dojo.withGlobal(win,dojo.body);
}else{
cn=(node==dojo.body()?dojo.doc.documentElement:node);
}
var _292={node:node,iframe:_291};
dojo.attr(node,"_dijitMenu"+this.id,this._bindings.push(_292));
var _293=dojo.hitch(this,function(cn){
return [dojo.connect(cn,this.leftClickToOpen?"onclick":"oncontextmenu",this,function(evt){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_291,{x:evt.pageX,y:evt.pageY});
}),dojo.connect(cn,"onkeydown",this,function(evt){
if(evt.shiftKey&&evt.keyCode==dojo.keys.F10){
dojo.stopEvent(evt);
this._scheduleOpen(evt.target,_291);
}
})];
});
_292.connects=cn?_293(cn):[];
if(_291){
_292.onloadHandler=dojo.hitch(this,function(){
var win=this._iframeContentWindow(_291);
cn=dojo.withGlobal(win,dojo.body);
_292.connects=_293(cn);
});
if(_291.addEventListener){
_291.addEventListener("load",_292.onloadHandler,false);
}else{
_291.attachEvent("onload",_292.onloadHandler);
}
}
},unBindDomNode:function(_294){
var node;
try{
node=dojo.byId(_294);
}
catch(e){
return;
}
var _295="_dijitMenu"+this.id;
if(node&&dojo.hasAttr(node,_295)){
var bid=dojo.attr(node,_295)-1,b=this._bindings[bid];
dojo.forEach(b.connects,dojo.disconnect);
var _296=b.iframe;
if(_296){
if(_296.removeEventListener){
_296.removeEventListener("load",b.onloadHandler,false);
}else{
_296.detachEvent("onload",b.onloadHandler);
}
}
dojo.removeAttr(node,_295);
delete this._bindings[bid];
}
},_scheduleOpen:function(_297,_298,_299){
if(!this._openTimer){
this._openTimer=setTimeout(dojo.hitch(this,function(){
delete this._openTimer;
this._openMyself({target:_297,iframe:_298,coords:_299});
}),1);
}
},_openMyself:function(args){
var _29a=args.target,_29b=args.iframe,_29c=args.coords;
if(_29c){
if(_29b){
var od=_29a.ownerDocument,ifc=dojo.position(_29b,true),win=this._iframeContentWindow(_29b),_29d=dojo.withGlobal(win,"_docScroll",dojo);
var cs=dojo.getComputedStyle(_29b),tp=dojo._toPixelValue,left=(dojo.isIE&&dojo.isQuirks?0:tp(_29b,cs.paddingLeft))+(dojo.isIE&&dojo.isQuirks?tp(_29b,cs.borderLeftWidth):0),top=(dojo.isIE&&dojo.isQuirks?0:tp(_29b,cs.paddingTop))+(dojo.isIE&&dojo.isQuirks?tp(_29b,cs.borderTopWidth):0);
_29c.x+=ifc.x+left-_29d.x;
_29c.y+=ifc.y+top-_29d.y;
}
}else{
_29c=dojo.position(_29a,true);
_29c.x+=10;
_29c.y+=10;
}
var self=this;
var _29e=dijit.getFocus(this);
function _29f(){
if(self.refocus){
dijit.focus(_29e);
}
dijit.popup.close(self);
};
dijit.popup.open({popup:this,x:_29c.x,y:_29c.y,onExecute:_29f,onCancel:_29f,orient:this.isLeftToRight()?"L":"R"});
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
if(!dojo._hasResource["dijit.form.Select"]){
dojo._hasResource["dijit.form.Select"]=true;
dojo.provide("dijit.form.Select");
dojo.declare("dijit.form._SelectMenu",dijit.Menu,{buildRendering:function(){
this.inherited(arguments);
var o=(this.menuTableNode=this.domNode);
var n=(this.domNode=dojo.create("div",{style:{overflowX:"hidden",overflowY:"scroll"}}));
if(o.parentNode){
o.parentNode.replaceChild(n,o);
}
dojo.removeClass(o,"dijitMenuTable");
n.className=o.className+" dijitSelectMenu";
o.className="dijitReset dijitMenuTable";
dijit.setWaiRole(o,"listbox");
dijit.setWaiRole(n,"presentation");
n.appendChild(o);
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onmousemove",dojo.stopEvent);
},resize:function(mb){
if(mb){
dojo.marginBox(this.domNode,mb);
if("w" in mb){
this.menuTableNode.style.width="100%";
}
}
}});
dojo.declare("dijit.form.Select",[dijit.form._FormSelectWidget,dijit._HasDropDown],{baseClass:"dijitSelect",templateString:dojo.cache("dijit.form","templates/Select.html","<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tdojoAttachPoint=\"_buttonNode,tableNode,focusNode\" cellspacing='0' cellpadding='0'\n\trole=\"combobox\" aria-haspopup=\"true\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonContents dijitButtonNode\" role=\"presentation\"\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"  dojoAttachPoint=\"containerNode,_popupStateNode\"></span\n\t\t\t><input type=\"hidden\" ${!nameAttrSetting} dojoAttachPoint=\"valueNode\" value=\"${value}\" aria-hidden=\"true\"\n\t\t/></td><td class=\"dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\t\tdojoAttachPoint=\"titleNode\" role=\"presentation\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\n\t\t></td\n\t></tr></tbody\n></table>\n"),attributeMap:dojo.mixin(dojo.clone(dijit.form._FormSelectWidget.prototype.attributeMap),{style:"tableNode"}),required:false,state:"",message:"",tooltipPosition:[],emptyLabel:"&nbsp;",_isLoaded:false,_childrenLoaded:false,_fillContent:function(){
this.inherited(arguments);
if(this.options.length&&!this.value&&this.srcNodeRef){
var si=this.srcNodeRef.selectedIndex||0;
this.value=this.options[si>=0?si:0].value;
}
this.dropDown=new dijit.form._SelectMenu({id:this.id+"_menu"});
dojo.addClass(this.dropDown.domNode,this.baseClass+"Menu");
},_getMenuItemForOption:function(_2a0){
if(!_2a0.value&&!_2a0.label){
return new dijit.MenuSeparator();
}else{
var _2a1=dojo.hitch(this,"_setValueAttr",_2a0);
var item=new dijit.MenuItem({option:_2a0,label:_2a0.label||this.emptyLabel,onClick:_2a1,disabled:_2a0.disabled||false});
dijit.setWaiRole(item.focusNode,"listitem");
return item;
}
},_addOptionItem:function(_2a2){
if(this.dropDown){
this.dropDown.addChild(this._getMenuItemForOption(_2a2));
}
},_getChildren:function(){
if(!this.dropDown){
return [];
}
return this.dropDown.getChildren();
},_loadChildren:function(_2a3){
if(_2a3===true){
if(this.dropDown){
delete this.dropDown.focusedChild;
}
if(this.options.length){
this.inherited(arguments);
}else{
dojo.forEach(this._getChildren(),function(_2a4){
_2a4.destroyRecursive();
});
var item=new dijit.MenuItem({label:"&nbsp;"});
this.dropDown.addChild(item);
}
}else{
this._updateSelection();
}
this._isLoaded=false;
this._childrenLoaded=true;
if(!this._loadingStore){
this._setValueAttr(this.value);
}
},_setValueAttr:function(_2a5){
this.inherited(arguments);
dojo.attr(this.valueNode,"value",this.get("value"));
},_setDisplay:function(_2a6){
var lbl=_2a6||this.emptyLabel;
this.containerNode.innerHTML="<span class=\"dijitReset dijitInline "+this.baseClass+"Label\">"+lbl+"</span>";
dijit.setWaiState(this.focusNode,"valuetext",lbl);
},validate:function(_2a7){
var _2a8=this.isValid(_2a7);
this._set("state",_2a8?"":"Error");
dijit.setWaiState(this.focusNode,"invalid",_2a8?"false":"true");
var _2a9=_2a8?"":this._missingMsg;
if(this.message!==_2a9){
this._set("message",_2a9);
dijit.hideTooltip(this.domNode);
if(_2a9){
dijit.showTooltip(_2a9,this.domNode,this.tooltipPosition,!this.isLeftToRight());
}
}
return _2a8;
},isValid:function(_2aa){
return (!this.required||this.value===0||!(/^\s*$/.test(this.value||"")));
},reset:function(){
this.inherited(arguments);
dijit.hideTooltip(this.domNode);
this._set("state","");
this._set("message","");
},postMixInProperties:function(){
this.inherited(arguments);
this._missingMsg=dojo.i18n.getLocalization("dijit.form","validate",this.lang).missingMessage;
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onmousemove",dojo.stopEvent);
},_setStyleAttr:function(_2ab){
this.inherited(arguments);
dojo.toggleClass(this.domNode,this.baseClass+"FixedWidth",!!this.tableNode.style.width);
},isLoaded:function(){
return this._isLoaded;
},loadDropDown:function(_2ac){
this._loadChildren(true);
this._isLoaded=true;
_2ac();
},closeDropDown:function(){
this.inherited(arguments);
if(this.dropDown&&this.dropDown.menuTableNode){
this.dropDown.menuTableNode.style.width="";
}
},uninitialize:function(_2ad){
if(this.dropDown&&!this.dropDown._destroyed){
this.dropDown.destroyRecursive(_2ad);
delete this.dropDown;
}
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit._editor.plugins.LinkDialog"]){
dojo._hasResource["dijit._editor.plugins.LinkDialog"]=true;
dojo.provide("dijit._editor.plugins.LinkDialog");
dojo.declare("dijit._editor.plugins.LinkDialog",dijit._editor._Plugin,{buttonClass:dijit.form.DropDownButton,useDefaultCommand:false,urlRegExp:"((https?|ftps?|file)\\://|./|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",emailRegExp:"<?(mailto\\:)([!#-'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-'*+\\-\\/-9=?A-Z^-~]+"+"@"+"((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*>?",htmlTemplate:"<a href=\"${urlInput}\" _djrealurl=\"${urlInput}\""+" target=\"${targetSelect}\""+">${textInput}</a>",tag:"a",_hostRxp:new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$"),_userAtRxp:new RegExp("^([!#-'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-'*+\\-\\/-9=?A-Z^-~]+@","i"),linkDialogTemplate:["<table><tr><td>","<label for='${id}_urlInput'>${url}</label>","</td><td>","<input dojoType='dijit.form.ValidationTextBox' required='true' "+"id='${id}_urlInput' name='urlInput' intermediateChanges='true'/>","</td></tr><tr><td>","<label for='${id}_textInput'>${text}</label>","</td><td>","<input dojoType='dijit.form.ValidationTextBox' required='true' id='${id}_textInput' "+"name='textInput' intermediateChanges='true'/>","</td></tr><tr><td>","<label for='${id}_targetSelect'>${target}</label>","</td><td>","<select id='${id}_targetSelect' name='targetSelect' dojoType='dijit.form.Select'>","<option selected='selected' value='_self'>${currentWindow}</option>","<option value='_blank'>${newWindow}</option>","<option value='_top'>${topWindow}</option>","<option value='_parent'>${parentWindow}</option>","</select>","</td></tr><tr><td colspan='2'>","<button dojoType='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>","<button dojoType='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>","</td></tr></table>"].join(""),_initButton:function(){
var _2ae=this;
this.tag=this.command=="insertImage"?"img":"a";
var _2af=dojo.mixin(dojo.i18n.getLocalization("dijit","common",this.lang),dojo.i18n.getLocalization("dijit._editor","LinkDialog",this.lang));
var _2b0=(this.dropDown=new dijit.TooltipDialog({title:_2af[this.command+"Title"],execute:dojo.hitch(this,"setValue"),onOpen:function(){
_2ae._onOpenDialog();
dijit.TooltipDialog.prototype.onOpen.apply(this,arguments);
},onCancel:function(){
setTimeout(dojo.hitch(_2ae,"_onCloseDialog"),0);
}}));
_2af.urlRegExp=this.urlRegExp;
_2af.id=dijit.getUniqueId(this.editor.id);
this._uniqueId=_2af.id;
this._setContent(_2b0.title+"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>"+dojo.string.substitute(this.linkDialogTemplate,_2af));
_2b0.startup();
this._urlInput=dijit.byId(this._uniqueId+"_urlInput");
this._textInput=dijit.byId(this._uniqueId+"_textInput");
this._setButton=dijit.byId(this._uniqueId+"_setButton");
this.connect(dijit.byId(this._uniqueId+"_cancelButton"),"onClick",function(){
this.dropDown.onCancel();
});
if(this._urlInput){
this.connect(this._urlInput,"onChange","_checkAndFixInput");
}
if(this._textInput){
this.connect(this._textInput,"onChange","_checkAndFixInput");
}
this._urlRegExp=new RegExp("^"+this.urlRegExp+"$","i");
this._emailRegExp=new RegExp("^"+this.emailRegExp+"$","i");
this._urlInput.isValid=dojo.hitch(this,function(){
var _2b1=this._urlInput.get("value");
return this._urlRegExp.test(_2b1)||this._emailRegExp.test(_2b1);
});
this._connectTagEvents();
this.inherited(arguments);
},_checkAndFixInput:function(){
var self=this;
var url=this._urlInput.get("value");
var _2b2=function(url){
var _2b3=false;
var _2b4=false;
if(url&&url.length>1){
url=dojo.trim(url);
if(url.indexOf("mailto:")!==0){
if(url.indexOf("/")>0){
if(url.indexOf("://")===-1){
if(url.charAt(0)!=="/"&&url.indexOf("./")!==0){
if(self._hostRxp.test(url)){
_2b3=true;
}
}
}
}else{
if(self._userAtRxp.test(url)){
_2b4=true;
}
}
}
}
if(_2b3){
self._urlInput.set("value","http://"+url);
}
if(_2b4){
self._urlInput.set("value","mailto:"+url);
}
self._setButton.set("disabled",!self._isValid());
};
if(this._delayedCheck){
clearTimeout(this._delayedCheck);
this._delayedCheck=null;
}
this._delayedCheck=setTimeout(function(){
_2b2(url);
},250);
},_connectTagEvents:function(){
this.editor.onLoadDeferred.addCallback(dojo.hitch(this,function(){
this.connect(this.editor.editNode,"ondblclick",this._onDblClick);
}));
},_isValid:function(){
return this._urlInput.isValid()&&this._textInput.isValid();
},_setContent:function(_2b5){
this.dropDown.set({parserScope:"dojo",content:_2b5});
},_checkValues:function(args){
if(args&&args.urlInput){
args.urlInput=args.urlInput.replace(/"/g,"&quot;");
}
return args;
},setValue:function(args){
this._onCloseDialog();
if(dojo.isIE<9){
var sel=dijit.range.getSelection(this.editor.window);
var _2b6=sel.getRangeAt(0);
var a=_2b6.endContainer;
if(a.nodeType===3){
a=a.parentNode;
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()!==this.tag)){
a=dojo.withGlobal(this.editor.window,"getSelectedElement",dijit._editor.selection,[this.tag]);
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()===this.tag)){
if(this.editor.queryCommandEnabled("unlink")){
dojo.withGlobal(this.editor.window,"selectElementChildren",dijit._editor.selection,[a]);
this.editor.execCommand("unlink");
}
}
}
args=this._checkValues(args);
this.editor.execCommand("inserthtml",dojo.string.substitute(this.htmlTemplate,args));
},_onCloseDialog:function(){
this.editor.focus();
},_getCurrentValues:function(a){
var url,text,_2b7;
if(a&&a.tagName.toLowerCase()===this.tag){
url=a.getAttribute("_djrealurl")||a.getAttribute("href");
_2b7=a.getAttribute("target")||"_self";
text=a.textContent||a.innerText;
dojo.withGlobal(this.editor.window,"selectElement",dijit._editor.selection,[a,true]);
}else{
text=dojo.withGlobal(this.editor.window,dijit._editor.selection.getSelectedText);
}
return {urlInput:url||"",textInput:text||"",targetSelect:_2b7||""};
},_onOpenDialog:function(){
var a;
if(dojo.isIE<9){
var sel=dijit.range.getSelection(this.editor.window);
var _2b8=sel.getRangeAt(0);
a=_2b8.endContainer;
if(a.nodeType===3){
a=a.parentNode;
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()!==this.tag)){
a=dojo.withGlobal(this.editor.window,"getSelectedElement",dijit._editor.selection,[this.tag]);
}
}else{
a=dojo.withGlobal(this.editor.window,"getAncestorElement",dijit._editor.selection,[this.tag]);
}
this.dropDown.reset();
this._setButton.set("disabled",true);
this.dropDown.set("value",this._getCurrentValues(a));
},_onDblClick:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag&&dojo.attr(t,"href")){
dojo.withGlobal(this.editor.window,"selectElement",dijit._editor.selection,[t]);
this.editor.onDisplayChanged();
setTimeout(dojo.hitch(this,function(){
this.button.set("disabled",false);
this.button.openDropDown();
}),10);
}
}
}});
dojo.declare("dijit._editor.plugins.ImgLinkDialog",[dijit._editor.plugins.LinkDialog],{linkDialogTemplate:["<table><tr><td>","<label for='${id}_urlInput'>${url}</label>","</td><td>","<input dojoType='dijit.form.ValidationTextBox' regExp='${urlRegExp}' "+"required='true' id='${id}_urlInput' name='urlInput' intermediateChanges='true'/>","</td></tr><tr><td>","<label for='${id}_textInput'>${text}</label>","</td><td>","<input dojoType='dijit.form.ValidationTextBox' required='false' id='${id}_textInput' "+"name='textInput' intermediateChanges='true'/>","</td></tr><tr><td>","</td><td>","</td></tr><tr><td colspan='2'>","<button dojoType='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>","<button dojoType='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>","</td></tr></table>"].join(""),htmlTemplate:"<img src=\"${urlInput}\" _djrealurl=\"${urlInput}\" alt=\"${textInput}\" />",tag:"img",_getCurrentValues:function(img){
var url,text;
if(img&&img.tagName.toLowerCase()===this.tag){
url=img.getAttribute("_djrealurl")||img.getAttribute("src");
text=img.getAttribute("alt");
dojo.withGlobal(this.editor.window,"selectElement",dijit._editor.selection,[img,true]);
}else{
text=dojo.withGlobal(this.editor.window,dijit._editor.selection.getSelectedText);
}
return {urlInput:url||"",textInput:text||""};
},_isValid:function(){
return this._urlInput.isValid();
},_connectTagEvents:function(){
this.inherited(arguments);
this.editor.onLoadDeferred.addCallback(dojo.hitch(this,function(){
this.connect(this.editor.editNode,"onmousedown",this._selectTag);
}));
},_selectTag:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag){
dojo.withGlobal(this.editor.window,"selectElement",dijit._editor.selection,[t]);
}
}
},_checkValues:function(args){
if(args&&args.urlInput){
args.urlInput=args.urlInput.replace(/"/g,"&quot;");
}
if(args&&args.textInput){
args.textInput=args.textInput.replace(/"/g,"&quot;");
}
return args;
},_onDblClick:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag&&dojo.attr(t,"src")){
dojo.withGlobal(this.editor.window,"selectElement",dijit._editor.selection,[t]);
this.editor.onDisplayChanged();
setTimeout(dojo.hitch(this,function(){
this.button.set("disabled",false);
this.button.openDropDown();
}),10);
}
}
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
switch(o.args.name){
case "createLink":
o.plugin=new dijit._editor.plugins.LinkDialog({command:o.args.name});
break;
case "insertImage":
o.plugin=new dijit._editor.plugins.ImgLinkDialog({command:o.args.name});
break;
}
});
}
if(!dojo._hasResource["dojox.editor.plugins.ToolbarLineBreak"]){
dojo._hasResource["dojox.editor.plugins.ToolbarLineBreak"]=true;
dojo.provide("dojox.editor.plugins.ToolbarLineBreak");
dojo.declare("dojox.editor.plugins.ToolbarLineBreak",[dijit._Widget,dijit._Templated],{templateString:"<span class='dijit dijitReset'><br></span>",postCreate:function(){
dojo.setSelectable(this.domNode,false);
},isFocusable:function(){
return false;
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
var name=o.args.name.toLowerCase();
if(name==="||"||name==="toolbarlinebreak"){
o.plugin=new dijit._editor._Plugin({button:new dojox.editor.plugins.ToolbarLineBreak(),setEditor:function(_2b9){
this.editor=_2b9;
}});
}
});
}
if(!dojo._hasResource["dojox.editor.plugins.FindReplace"]){
dojo._hasResource["dojox.editor.plugins.FindReplace"]=true;
dojo.provide("dojox.editor.plugins.FindReplace");
dojo.experimental("dojox.editor.plugins.FindReplace");
dojo.declare("dojox.editor.plugins._FindReplaceCloseBox",[dijit._Widget,dijit._Templated],{btnId:"",widget:null,widgetsInTemplate:true,templateString:"<span style='float: right' class='dijitInline' tabindex='-1'>"+"<button class='dijit dijitReset dijitInline' "+"id='${btnId}' dojoAttachPoint='button' dojoType='dijit.form.Button' tabindex='-1' iconClass='dijitEditorIconsFindReplaceClose' showLabel='false'>X</button>"+"</span>",postMixInProperties:function(){
this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
this.btnId=this.id+"_close";
this.inherited(arguments);
},startup:function(){
this.connect(this.button,"onClick","onClick");
},onClick:function(){
}});
dojo.declare("dojox.editor.plugins._FindReplaceTextBox",[dijit._Widget,dijit._Templated],{textId:"",label:"",toolTip:"",widget:null,widgetsInTemplate:true,templateString:"<span style='white-space: nowrap' class='dijit dijitReset dijitInline dijitEditorFindReplaceTextBox' "+"title='${tooltip}' tabindex='-1'>"+"<label class='dijitLeft dijitInline' for='${textId}' tabindex='-1'>${label}</label>"+"<input dojoType='dijit.form.TextBox' required='false' intermediateChanges='true' class='focusTextBox'"+"tabIndex='0' id='${textId}' dojoAttachPoint='textBox, focusNode' value='' dojoAttachEvent='onKeyPress: _onKeyPress'/>"+"</span>",postMixInProperties:function(){
this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
this.textId=this.id+"_text";
this.inherited(arguments);
},postCreate:function(){
this.textBox.set("value","");
this.disabled=this.textBox.get("disabled");
this.connect(this.textBox,"onChange","onChange");
},_setValueAttr:function(_2ba){
this.value=_2ba;
this.textBox.set("value",_2ba);
},focus:function(){
this.textBox.focus();
},_setDisabledAttr:function(_2bb){
this.disabled=_2bb;
this.textBox.set("disabled",_2bb);
},onChange:function(val){
this.value=val;
},_onKeyPress:function(evt){
var _2bc=0;
var end=0;
if(evt.target&&!evt.ctrlKey&&!evt.altKey&&!evt.shiftKey){
if(evt.keyCode==dojo.keys.LEFT_ARROW){
_2bc=evt.target.selectionStart;
end=evt.target.selectionEnd;
if(_2bc<end){
dijit.selectInputText(evt.target,_2bc,_2bc);
dojo.stopEvent(evt);
}
}else{
if(evt.keyCode==dojo.keys.RIGHT_ARROW){
_2bc=evt.target.selectionStart;
end=evt.target.selectionEnd;
if(_2bc<end){
dijit.selectInputText(evt.target,end,end);
dojo.stopEvent(evt);
}
}
}
}
}});
dojo.declare("dojox.editor.plugins._FindReplaceCheckBox",[dijit._Widget,dijit._Templated],{checkId:"",label:"",tooltip:"",widget:null,widgetsInTemplate:true,templateString:"<span style='white-space: nowrap' tabindex='-1' "+"class='dijit dijitReset dijitInline dijitEditorFindReplaceCheckBox' title='${tooltip}' >"+"<input dojoType='dijit.form.CheckBox' required=false "+"tabIndex='0' id='${checkId}' dojoAttachPoint='checkBox, focusNode' value=''/>"+"<label tabindex='-1' class='dijitLeft dijitInline' for='${checkId}'>${label}</label>"+"</span>",postMixInProperties:function(){
this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
this.checkId=this.id+"_check";
this.inherited(arguments);
},postCreate:function(){
this.checkBox.set("checked",false);
this.disabled=this.checkBox.get("disabled");
this.checkBox.isFocusable=function(){
return false;
};
},_setValueAttr:function(_2bd){
this.checkBox.set("value",_2bd);
},_getValueAttr:function(){
return this.checkBox.get("value");
},focus:function(){
this.checkBox.focus();
},_setDisabledAttr:function(_2be){
this.disabled=_2be;
this.checkBox.set("disabled",_2be);
}});
dojo.declare("dojox.editor.plugins._FindReplaceToolbar",dijit.Toolbar,{postCreate:function(){
this.connectKeyNavHandlers([],[]);
this.connect(this.containerNode,"onclick","_onToolbarEvent");
this.connect(this.containerNode,"onkeydown","_onToolbarEvent");
dojo.addClass(this.domNode,"dijitToolbar");
},addChild:function(_2bf,_2c0){
dijit._KeyNavContainer.superclass.addChild.apply(this,arguments);
},_onToolbarEvent:function(evt){
evt.stopPropagation();
}});
dojo.declare("dojox.editor.plugins.FindReplace",[dijit._editor._Plugin],{buttonClass:dijit.form.ToggleButton,iconClassPrefix:"dijitEditorIconsFindReplace",editor:null,button:null,_frToolbar:null,_closeBox:null,_findField:null,_replaceField:null,_findButton:null,_replaceButton:null,_replaceAllButton:null,_caseSensitive:null,_backwards:null,_promDialog:null,_promDialogTimeout:null,_strings:null,_initButton:function(){
this._strings=dojo.i18n.getLocalization("dojox.editor.plugins","FindReplace");
this.button=new dijit.form.ToggleButton({label:this._strings["findReplace"],showLabel:false,iconClass:this.iconClassPrefix+" dijitEditorIconFindString",tabIndex:"-1",onChange:dojo.hitch(this,"_toggleFindReplace")});
if(dojo.isOpera){
this.button.set("disabled",true);
}
this.connect(this.button,"set",dojo.hitch(this,function(attr,val){
if(attr==="disabled"){
this._toggleFindReplace((!val&&this._displayed),true,true);
}
}));
},setEditor:function(_2c1){
this.editor=_2c1;
this._initButton();
},toggle:function(){
this.button.set("checked",!this.button.get("checked"));
},_toggleFindReplace:function(show,_2c2,_2c3){
var size=dojo.marginBox(this.editor.domNode);
if(show&&!dojo.isOpera){
dojo.style(this._frToolbar.domNode,"display","block");
this._populateFindField();
if(!_2c2){
this._displayed=true;
}
}else{
dojo.style(this._frToolbar.domNode,"display","none");
if(!_2c2){
this._displayed=false;
}
if(!_2c3){
this.editor.focus();
}
}
this.editor.resize({h:size.h});
},_populateFindField:function(){
var ed=this.editor;
var win=ed.window;
var _2c4=dojo.withGlobal(ed.window,"getSelectedText",dijit._editor.selection,[null]);
if(this._findField&&this._findField.textBox){
if(_2c4){
this._findField.textBox.set("value",_2c4);
}
this._findField.textBox.focus();
dijit.selectInputText(this._findField.textBox.focusNode);
}
},setToolbar:function(_2c5){
this.inherited(arguments);
if(!dojo.isOpera){
var _2c6=this._frToolbar=new dojox.editor.plugins._FindReplaceToolbar();
dojo.style(_2c6.domNode,"display","none");
dojo.place(_2c6.domNode,_2c5.domNode,"after");
_2c6.startup();
this._closeBox=new dojox.editor.plugins._FindReplaceCloseBox();
_2c6.addChild(this._closeBox);
this._findField=new dojox.editor.plugins._FindReplaceTextBox({label:this._strings["findLabel"],tooltip:this._strings["findTooltip"]});
_2c6.addChild(this._findField);
this._replaceField=new dojox.editor.plugins._FindReplaceTextBox({label:this._strings["replaceLabel"],tooltip:this._strings["replaceTooltip"]});
_2c6.addChild(this._replaceField);
_2c6.addChild(new dojox.editor.plugins.ToolbarLineBreak());
this._findButton=new dijit.form.Button({label:this._strings["findButton"],showLabel:true,iconClass:this.iconClassPrefix+" dijitEditorIconFind"});
this._findButton.titleNode.title=this._strings["findButtonTooltip"];
_2c6.addChild(this._findButton);
this._replaceButton=new dijit.form.Button({label:this._strings["replaceButton"],showLabel:true,iconClass:this.iconClassPrefix+" dijitEditorIconReplace"});
this._replaceButton.titleNode.title=this._strings["replaceButtonTooltip"];
_2c6.addChild(this._replaceButton);
this._replaceAllButton=new dijit.form.Button({label:this._strings["replaceAllButton"],showLabel:true,iconClass:this.iconClassPrefix+" dijitEditorIconReplaceAll"});
this._replaceAllButton.titleNode.title=this._strings["replaceAllButtonTooltip"];
_2c6.addChild(this._replaceAllButton);
this._caseSensitive=new dojox.editor.plugins._FindReplaceCheckBox({label:this._strings["matchCase"],tooltip:this._strings["matchCaseTooltip"]});
_2c6.addChild(this._caseSensitive);
this._backwards=new dojox.editor.plugins._FindReplaceCheckBox({label:this._strings["backwards"],tooltip:this._strings["backwardsTooltip"]});
_2c6.addChild(this._backwards);
this._findButton.set("disabled",true);
this._replaceButton.set("disabled",true);
this._replaceAllButton.set("disabled",true);
this.connect(this._findField,"onChange","_checkButtons");
this.connect(this._findField,"onKeyDown","_onFindKeyDown");
this.connect(this._replaceField,"onKeyDown","_onReplaceKeyDown");
this.connect(this._findButton,"onClick","_find");
this.connect(this._replaceButton,"onClick","_replace");
this.connect(this._replaceAllButton,"onClick","_replaceAll");
this.connect(this._closeBox,"onClick","toggle");
this._promDialog=new dijit.TooltipDialog();
this._promDialog.startup();
this._promDialog.set("content","");
}
},_checkButtons:function(){
var _2c7=this._findField.get("value");
if(_2c7){
this._findButton.set("disabled",false);
this._replaceButton.set("disabled",false);
this._replaceAllButton.set("disabled",false);
}else{
this._findButton.set("disabled",true);
this._replaceButton.set("disabled",true);
this._replaceAllButton.set("disabled",true);
}
},_onFindKeyDown:function(evt){
if(evt.keyCode==dojo.keys.ENTER){
this._find();
dojo.stopEvent(evt);
}
},_onReplaceKeyDown:function(evt){
if(evt.keyCode==dojo.keys.ENTER){
if(!this._replace()){
this._replace();
}
dojo.stopEvent(evt);
}
},_find:function(_2c8){
var txt=this._findField.get("value")||"";
if(txt){
var _2c9=this._caseSensitive.get("value");
var _2ca=this._backwards.get("value");
var _2cb=this._findText(txt,_2c9,_2ca);
if(!_2cb&&_2c8){
this._promDialog.set("content",dojo.string.substitute(this._strings["eofDialogText"],{"0":this._strings["eofDialogTextFind"]}));
dijit.popup.open({popup:this._promDialog,around:this._findButton.domNode});
this._promDialogTimeout=setTimeout(dojo.hitch(this,function(){
clearTimeout(this._promDialogTimeout);
this._promDialogTimeout=null;
dijit.popup.close(this._promDialog);
}),3000);
setTimeout(dojo.hitch(this,function(){
this.editor.focus();
}),0);
}
return _2cb;
}
return false;
},_replace:function(_2cc){
var _2cd=false;
var ed=this.editor;
ed.focus();
var txt=this._findField.get("value")||"";
var _2ce=this._replaceField.get("value")||"";
if(txt){
var _2cf=this._caseSensitive.get("value");
var _2d0=this._backwards.get("value");
var _2d1=dojo.withGlobal(ed.window,"getSelectedText",dijit._editor.selection,[null]);
if(dojo.isMoz){
txt=dojo.trim(txt);
_2d1=dojo.trim(_2d1);
}
var _2d2=this._filterRegexp(txt,!_2cf);
if(_2d1&&_2d2.test(_2d1)){
ed.execCommand("inserthtml",_2ce);
_2cd=true;
if(_2d0){
this._findText(_2ce,_2cf,_2d0);
dojo.withGlobal(ed.window,"collapse",dijit._editor.selection,[true]);
}
}
if(!this._find(false)&&_2cc){
this._promDialog.set("content",dojo.string.substitute(this._strings["eofDialogText"],{"0":this._strings["eofDialogTextReplace"]}));
dijit.popup.open({popup:this._promDialog,around:this._replaceButton.domNode});
this._promDialogTimeout=setTimeout(dojo.hitch(this,function(){
clearTimeout(this._promDialogTimeout);
this._promDialogTimeout=null;
dijit.popup.close(this._promDialog);
}),3000);
setTimeout(dojo.hitch(this,function(){
this.editor.focus();
}),0);
}
return _2cd;
}
return null;
},_replaceAll:function(_2d3){
var _2d4=0;
var _2d5=this._backwards.get("value");
if(_2d5){
this.editor.placeCursorAtEnd();
}else{
this.editor.placeCursorAtStart();
}
if(this._replace(false)){
_2d4++;
}
var _2d6=dojo.hitch(this,function(){
if(this._replace(false)){
_2d4++;
setTimeout(_2d6,10);
}else{
if(_2d3){
this._promDialog.set("content",dojo.string.substitute(this._strings["replaceDialogText"],{"0":""+_2d4}));
dijit.popup.open({popup:this._promDialog,around:this._replaceAllButton.domNode});
this._promDialogTimeout=setTimeout(dojo.hitch(this,function(){
clearTimeout(this._promDialogTimeout);
this._promDialogTimeout=null;
dijit.popup.close(this._promDialog);
}),3000);
setTimeout(dojo.hitch(this,function(){
this._findField.focus();
this._findField.textBox.focusNode.select();
}),0);
}
}
});
_2d6();
},_findText:function(txt,_2d7,_2d8){
var ed=this.editor;
var win=ed.window;
var _2d9=false;
if(txt){
if(win.find){
_2d9=win.find(txt,_2d7,_2d8,false,false,false,false);
}else{
var doc=ed.document;
if(doc.selection){
this.editor.focus();
var _2da=doc.body.createTextRange();
var _2db=doc.selection?doc.selection.createRange():null;
if(_2db){
if(_2d8){
_2da.setEndPoint("EndToStart",_2db);
}else{
_2da.setEndPoint("StartToEnd",_2db);
}
}
var _2dc=_2d7?4:0;
if(_2d8){
_2dc=_2dc|1;
}
_2d9=_2da.findText(txt,_2da.text.length,_2dc);
if(_2d9){
_2da.select();
}
}
}
}
return _2d9;
},_filterRegexp:function(_2dd,_2de){
var rxp="";
var c=null;
for(var i=0;i<_2dd.length;i++){
c=_2dd.charAt(i);
switch(c){
case "\\":
rxp+=c;
i++;
rxp+=_2dd.charAt(i);
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
rxp="^"+rxp+"$";
if(_2de){
return new RegExp(rxp,"mi");
}else{
return new RegExp(rxp,"m");
}
},updateState:function(){
this.button.set("disabled",this.get("disabled"));
},destroy:function(){
this.inherited(arguments);
if(this._promDialogTimeout){
clearTimeout(this._promDialogTimeout);
this._promDialogTimeout=null;
dijit.popup.close(this._promDialog);
}
if(this._frToolbar){
this._frToolbar.destroyRecursive();
this._frToolbar=null;
}
if(this._promDialog){
this._promDialog.destroyRecursive();
this._promDialog=null;
}
}});
dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){
if(o.plugin){
return;
}
var name=o.args.name.toLowerCase();
if(name==="findreplace"){
o.plugin=new dojox.editor.plugins.FindReplace({});
}
});
}
if(!dojo._hasResource["wm.base.widget.Editors.RichText"]){
dojo._hasResource["wm.base.widget.Editors.RichText"]=true;
dojo.provide("wm.base.widget.Editors.RichText");
dojo.declare("wm.RichText",wm.LargeTextArea,{width:"100%",height:"200px",padding:"0",_ready:false,emptyValue:"emptyString",dataValue:"",displayValue:"",plugins:null,toolbarUndo:true,toolbarStyle:true,toolbarStyleAll:false,toolbarFind:false,toolbarAlign:true,toolbarList:true,toolbarLink:false,toolbarFontName:false,toolbarFormatName:false,toolbarSize:false,toolbarColor:false,classNames:"wmeditor wmrichtext",afterPaletteDrop:function(){
this.inherited(arguments);
if(!this.formField){
this.setCaption("");
}
var lf=this.getParentForm();
if(lf){
this.setPadding(wm.AbstractEditor.prototype.padding);
}
},init:function(){
this.inherited(arguments);
this.plugins=[];
this.updatePlugins();
},updatePlugins:function(){
this.plugins=["dijit._editor.plugins.AlwaysShowToolbar","dijit._editor.plugins.EnterKeyHandling","autourllink"];
if(this.toolbarUndo){
this.plugins.push("undo");
this.plugins.push("redo");
this.plugins.push("|");
}
if(this.toolbarStyle){
this.plugins.push("bold");
this.plugins.push("italic");
this.plugins.push("underline");
if(this.toolbarStyleAll){
this.plugins.push("strikethrough");
this.plugins.push("subscript");
this.plugins.push("superscript");
}
this.plugins.push("|");
}
if(this.toolbarAlign){
this.plugins.push("justifyLeft");
this.plugins.push("justifyRight");
this.plugins.push("justifyCenter");
this.plugins.push("justifyFull");
this.plugins.push("|");
}
if(this.toolbarFind){
this.plugins.push("findreplace");
}
if(this.toolbarList){
this.plugins.push("insertOrderedList");
this.plugins.push("insertUnorderedList");
this.plugins.push("indent");
this.plugins.push("outdent");
this.plugins.push("|");
}
if(this.toolbarLink){
this.plugins.push("createLink");
this.plugins.push("unlink");
this.plugins.push("|");
}
if(this.toolbarColor){
this.plugins.push("dijit._editor.plugins.TextColor");
this.plugins.push("foreColor");
this.plugins.push("hiliteColor");
this.plugins.push("|");
}
if(this.toolbarFontName){
this.plugins.push("fontName");
}
if(this.toolbarSize){
this.plugins.push("fontSize");
}
if(this.toolbarFormatName){
this.plugins.push("formatBlock");
}
if(this.customAddPlugins){
this.plugins=this.plugins.concat(this.customAddPlugins());
}
},setReadonly:function(_2df){
if(this.readonly&&!_2df){
var val=this.getDataValue();
this.inherited(arguments,[_2df,true]);
this.setDataValue(val);
}else{
this.inherited(arguments,[_2df,true]);
}
},sizeEditor:function(){
if(!this._ready){
return;
}
this.inherited(arguments);
var h=parseInt(this.editorNode.style.height);
var _2e0=this.editorNode.childNodes[0].clientHeight;
if(h<=_2e0){
h=Math.max(40,this.bounds.h-20);
_2e0=20;
}
this.editor.iframe.style.height=(h-_2e0)+"px";
if(this.editor.focusNode){
this.editor.focusNode.style.height=(h-_2e0)+"px";
}
dojo.query(".dijitComboBox input, .dijitToolbar",this.domNode).forEach(function(node){
node.style.lineHeight="normal";
node.style.height="";
});
},_createEditor:function(_2e1,_2e2){
this._ready=false;
this.editorNode=document.createElement("div");
this.domNode.appendChild(this.editorNode);
this.editor=new dijit.Editor({height:parseInt(this.height),plugins:this.plugins,disabled:this.disabled},this.editorNode);
this._onLoad();
return this.editor;
},_onLoad:function(){
this._ready=true;
this._cupdating=false;
this.sizeEditor();
this.connect(this.editor,"onFocus",this,function(){
dojo.addClass(this.editorNode,"Focused");
});
this.connect(this.editor,"onBlur",this,function(){
dojo.removeClass(this.editorNode,"Focused");
});
this.editor.set("value",this.dataValue||"");
if(this.editor.focusNode){
this.updateFocusNode();
}else{
this.connect(this.editor,"onLoad",this,"updateFocusNode");
}
},updateFocusNode:function(){
this.editor.focusNode.style.overflow="auto";
if(this._isDesignLoaded){
wm.onidle(this,function(){
var _2e3=dojo.query(".dijitToolbar",this.domNode)[0];
_2e3.style.lineHeight="24px";
});
}
},isReady:function(){
return Boolean(this._ready&&this.editor&&this.editor.focusNode);
},setDisabled:function(_2e4){
this.disabled=_2e4;
if(this.editor){
this.editor.set("disabled",this.disabled||this._parentDisabled);
}
},getEditorValue:function(){
try{
var _2e5=this.inherited(arguments);
if(_2e5.match(/^\s*\<.*\>\s*$/)&&!_2e5.match(/\>\w/)){
_2e5="";
}
return _2e5;
}
catch(e){
}
return this.dataValue;
},_setEditorAttempts:0,setEditorValue:function(_2e6){
if(this.editor&&!this.editor.isLoaded){
this.editor.onLoadDeferred.addCallback(dojo.hitch(this,"setEditorValue",_2e6));
return;
}
if(_2e6===null||_2e6===undefined){
_2e6="\n\n";
}
if(dojo.isString(_2e6)){
_2e6+="";
}
try{
this.editor.set("value",_2e6);
this.updateReadonlyValue(_2e6);
}
catch(e){
console.warn("setEditorValue Failed: "+e);
}
}});
wm.Object.extendSchema(wm.RichText,{toolbarUndo:{group:"subwidgets",subgroup:"buttons",order:1,shortname:"undo"},toolbarStyle:{group:"subwidgets",subgroup:"buttons",order:2,shortname:"styles"},toolbarStyleAll:{group:"subwidgets",subgroup:"buttons",order:3,shortname:"more styles"},toolbarAlign:{group:"subwidgets",subgroup:"buttons",order:4,shortname:"align"},toolbarList:{group:"subwidgets",subgroup:"buttons",order:5,shortname:"lists"},toolbarLink:{group:"subwidgets",subgroup:"buttons",order:6,shortname:"link"},toolbarFontName:{group:"subwidgets",subgroup:"buttons",order:7,shortname:"fontName"},toolbarFormatName:{group:"subwidgets",subgroup:"buttons",order:8,shortname:"formatName"},toolbarSize:{group:"subwidgets",subgroup:"buttons",order:9,shortname:"size"},toolbarColor:{group:"subwidgets",subgroup:"buttons",order:11,shortname:"color"},toolbarFind:{group:"subwidgets",subgroup:"buttons",order:12,shortname:"find & replace"},selectOnClick:{ignore:1},changeOnEnter:{ignore:1},changeOnKey:{ignore:1},password:{ignore:1},emptyValue:{ignore:1},regExp:{ignore:1},invalidMessage:{ignore:1},maxChars:{ignore:1},singleLine:{ignore:1},tooltipDisplayTime:{ignore:1},promptMessage:{ignore:1},displayValue:{ignore:1},setToolbarUndo:{method:1},setToolbarStyle:{method:1},setToolbarStyleAll:{method:1},setToolbarAlign:{method:1},setToolbarList:{method:1},setToolbarLink:{method:1},setToolbarFont:{method:1},setToolbarFormat:{method:1},setToolbarSize:{method:1},setToolbarColor:{method:1}});
wm.RichText.extend({setToolbarUndo:function(val){
this.toolbarUndo=val;
this.updatePlugins();
this.createEditor();
},setToolbarStyle:function(val){
this.toolbarStyle=val;
this.updatePlugins();
this.createEditor();
},setToolbarStyleAll:function(val){
if(val){
this.toolbarStyle=true;
}
this.toolbarStyleAll=val;
this.updatePlugins();
this.createEditor();
},setToolbarAlign:function(val){
this.toolbarAlign=val;
this.updatePlugins();
this.createEditor();
},setToolbarList:function(val){
this.toolbarList=val;
this.updatePlugins();
this.createEditor();
},setToolbarLink:function(val){
this.toolbarLink=val;
this.updatePlugins();
this.createEditor();
},setToolbarFontName:function(val){
this.toolbarFontName=val;
this.updatePlugins();
this.createEditor();
},setToolbarFormatName:function(val){
this.toolbarFormatName=val;
this.updatePlugins();
this.createEditor();
},setToolbarSize:function(val){
this.toolbarSize=val;
this.updatePlugins();
this.createEditor();
},setToolbarColor:function(val){
this.toolbarColor=val;
this.updatePlugins();
this.createEditor();
},setToolbarFind:function(val){
this.toolbarFind=val;
this.updatePlugins();
this.createEditor();
}});
}
dojo.i18n._preloadLocalizations("dojo.nls.wm_richTextEditor",["ROOT","ar","ca","cs","da","de","de-de","el","en","en-au","en-gb","en-us","es","es-es","fi","fi-fi","fr","fr-fr","he","he-il","hu","it","it-it","ja","ja-jp","ko","ko-kr","nb","nl","nl-nl","pl","pt","pt-br","pt-pt","ru","sk","sl","sv","th","tr","xx","zh","zh-cn","zh-tw"]);
