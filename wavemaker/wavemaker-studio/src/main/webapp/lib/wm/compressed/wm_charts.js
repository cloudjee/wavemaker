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

dojo.provide("wm.compressed.wm_charts");
if(!dojo._hasResource["dojox.charting.scaler.common"]){
dojo._hasResource["dojox.charting.scaler.common"]=true;
dojo.provide("dojox.charting.scaler.common");
(function(){
var eq=function(a,b){
return Math.abs(a-b)<=0.000001*(Math.abs(a)+Math.abs(b));
};
dojo.mixin(dojox.charting.scaler.common,{findString:function(_1,_2){
_1=_1.toLowerCase();
for(var i=0;i<_2.length;++i){
if(_1==_2[i]){
return true;
}
}
return false;
},getNumericLabel:function(_3,_4,_5){
var _6="";
if(dojo.number){
_6=(_5.fixed?dojo.number.format(_3,{places:_4<0?-_4:0}):dojo.number.format(_3))||"";
}else{
_6=_5.fixed?_3.toFixed(_4<0?-_4:0):_3.toString();
}
if(_5.labelFunc){
var r=_5.labelFunc(_6,_3,_4);
if(r){
return r;
}
}
if(_5.labels){
var l=_5.labels,lo=0,hi=l.length;
while(lo<hi){
var _7=Math.floor((lo+hi)/2),_8=l[_7].value;
if(_8<_3){
lo=_7+1;
}else{
hi=_7;
}
}
if(lo<l.length&&eq(l[lo].value,_3)){
return l[lo].text;
}
--lo;
if(lo>=0&&lo<l.length&&eq(l[lo].value,_3)){
return l[lo].text;
}
lo+=2;
if(lo<l.length&&eq(l[lo].value,_3)){
return l[lo].text;
}
}
return _6;
}});
})();
}
if(!dojo._hasResource["dojox.charting.scaler.linear"]){
dojo._hasResource["dojox.charting.scaler.linear"]=true;
dojo.provide("dojox.charting.scaler.linear");
(function(){
var _9=3,dc=dojox.charting,_a=dc.scaler,_b=_a.common,_c=_b.findString,_d=_b.getNumericLabel;
var _e=function(_f,max,_10,_11,_12,_13,_14){
_10=dojo.delegate(_10);
if(!_11){
if(_10.fixUpper=="major"){
_10.fixUpper="minor";
}
if(_10.fixLower=="major"){
_10.fixLower="minor";
}
}
if(!_12){
if(_10.fixUpper=="minor"){
_10.fixUpper="micro";
}
if(_10.fixLower=="minor"){
_10.fixLower="micro";
}
}
if(!_13){
if(_10.fixUpper=="micro"){
_10.fixUpper="none";
}
if(_10.fixLower=="micro"){
_10.fixLower="none";
}
}
var _15=_c(_10.fixLower,["major"])?Math.floor(_10.min/_11)*_11:_c(_10.fixLower,["minor"])?Math.floor(_10.min/_12)*_12:_c(_10.fixLower,["micro"])?Math.floor(_10.min/_13)*_13:_10.min,_16=_c(_10.fixUpper,["major"])?Math.ceil(_10.max/_11)*_11:_c(_10.fixUpper,["minor"])?Math.ceil(_10.max/_12)*_12:_c(_10.fixUpper,["micro"])?Math.ceil(_10.max/_13)*_13:_10.max;
if(_10.useMin){
_f=_15;
}
if(_10.useMax){
max=_16;
}
var _17=(!_11||_10.useMin&&_c(_10.fixLower,["major"]))?_f:Math.ceil(_f/_11)*_11,_18=(!_12||_10.useMin&&_c(_10.fixLower,["major","minor"]))?_f:Math.ceil(_f/_12)*_12,_19=(!_13||_10.useMin&&_c(_10.fixLower,["major","minor","micro"]))?_f:Math.ceil(_f/_13)*_13,_1a=!_11?0:(_10.useMax&&_c(_10.fixUpper,["major"])?Math.round((max-_17)/_11):Math.floor((max-_17)/_11))+1,_1b=!_12?0:(_10.useMax&&_c(_10.fixUpper,["major","minor"])?Math.round((max-_18)/_12):Math.floor((max-_18)/_12))+1,_1c=!_13?0:(_10.useMax&&_c(_10.fixUpper,["major","minor","micro"])?Math.round((max-_19)/_13):Math.floor((max-_19)/_13))+1,_1d=_12?Math.round(_11/_12):0,_1e=_13?Math.round(_12/_13):0,_1f=_11?Math.floor(Math.log(_11)/Math.LN10):0,_20=_12?Math.floor(Math.log(_12)/Math.LN10):0,_21=_14/(max-_f);
if(!isFinite(_21)){
_21=1;
}
return {bounds:{lower:_15,upper:_16,from:_f,to:max,scale:_21,span:_14},major:{tick:_11,start:_17,count:_1a,prec:_1f},minor:{tick:_12,start:_18,count:_1b,prec:_20},micro:{tick:_13,start:_19,count:_1c,prec:0},minorPerMajor:_1d,microPerMinor:_1e,scaler:_a.linear};
};
dojo.mixin(dojox.charting.scaler.linear,{buildScaler:function(min,max,_22,_23){
var h={fixUpper:"none",fixLower:"none",natural:false};
if(_23){
if("fixUpper" in _23){
h.fixUpper=String(_23.fixUpper);
}
if("fixLower" in _23){
h.fixLower=String(_23.fixLower);
}
if("natural" in _23){
h.natural=Boolean(_23.natural);
}
}
if("min" in _23){
min=_23.min;
}
if("max" in _23){
max=_23.max;
}
if(_23.includeZero){
if(min>0){
min=0;
}
if(max<0){
max=0;
}
}
h.min=min;
h.useMin=true;
h.max=max;
h.useMax=true;
if("from" in _23){
min=_23.from;
h.useMin=false;
}
if("to" in _23){
max=_23.to;
h.useMax=false;
}
if(max<=min){
return _e(min,max,h,0,0,0,_22);
}
var mag=Math.floor(Math.log(max-min)/Math.LN10),_24=_23&&("majorTickStep" in _23)?_23.majorTickStep:Math.pow(10,mag),_25=0,_26=0,_27;
if(_23&&("minorTickStep" in _23)){
_25=_23.minorTickStep;
}else{
do{
_25=_24/10;
if(!h.natural||_25>0.9){
_27=_e(min,max,h,_24,_25,0,_22);
if(_27.bounds.scale*_27.minor.tick>_9){
break;
}
}
_25=_24/5;
if(!h.natural||_25>0.9){
_27=_e(min,max,h,_24,_25,0,_22);
if(_27.bounds.scale*_27.minor.tick>_9){
break;
}
}
_25=_24/2;
if(!h.natural||_25>0.9){
_27=_e(min,max,h,_24,_25,0,_22);
if(_27.bounds.scale*_27.minor.tick>_9){
break;
}
}
return _e(min,max,h,_24,0,0,_22);
}while(false);
}
if(_23&&("microTickStep" in _23)){
_26=_23.microTickStep;
_27=_e(min,max,h,_24,_25,_26,_22);
}else{
do{
_26=_25/10;
if(!h.natural||_26>0.9){
_27=_e(min,max,h,_24,_25,_26,_22);
if(_27.bounds.scale*_27.micro.tick>_9){
break;
}
}
_26=_25/5;
if(!h.natural||_26>0.9){
_27=_e(min,max,h,_24,_25,_26,_22);
if(_27.bounds.scale*_27.micro.tick>_9){
break;
}
}
_26=_25/2;
if(!h.natural||_26>0.9){
_27=_e(min,max,h,_24,_25,_26,_22);
if(_27.bounds.scale*_27.micro.tick>_9){
break;
}
}
_26=0;
}while(false);
}
return _26?_27:_e(min,max,h,_24,_25,0,_22);
},buildTicks:function(_28,_29){
var _2a,_2b,_2c,_2d=_28.major.start,_2e=_28.minor.start,_2f=_28.micro.start;
if(_29.microTicks&&_28.micro.tick){
_2a=_28.micro.tick,_2b=_2f;
}else{
if(_29.minorTicks&&_28.minor.tick){
_2a=_28.minor.tick,_2b=_2e;
}else{
if(_28.major.tick){
_2a=_28.major.tick,_2b=_2d;
}else{
return null;
}
}
}
var _30=1/_28.bounds.scale;
if(_28.bounds.to<=_28.bounds.from||isNaN(_30)||!isFinite(_30)||_2a<=0||isNaN(_2a)||!isFinite(_2a)){
return null;
}
var _31=[],_32=[],_33=[];
while(_2b<=_28.bounds.to+_30){
if(Math.abs(_2d-_2b)<_2a/2){
_2c={value:_2d};
if(_29.majorLabels){
_2c.label=_d(_2d,_28.major.prec,_29);
}
_31.push(_2c);
_2d+=_28.major.tick;
_2e+=_28.minor.tick;
_2f+=_28.micro.tick;
}else{
if(Math.abs(_2e-_2b)<_2a/2){
if(_29.minorTicks){
_2c={value:_2e};
if(_29.minorLabels&&(_28.minMinorStep<=_28.minor.tick*_28.bounds.scale)){
_2c.label=_d(_2e,_28.minor.prec,_29);
}
_32.push(_2c);
}
_2e+=_28.minor.tick;
_2f+=_28.micro.tick;
}else{
if(_29.microTicks){
_33.push({value:_2f});
}
_2f+=_28.micro.tick;
}
}
_2b+=_2a;
}
return {major:_31,minor:_32,micro:_33};
},getTransformerFromModel:function(_34){
var _35=_34.bounds.from,_36=_34.bounds.scale;
return function(x){
return (x-_35)*_36;
};
},getTransformerFromPlot:function(_37){
var _38=_37.bounds.from,_39=_37.bounds.scale;
return function(x){
return x/_39+_38;
};
}});
})();
}
if(!dojo._hasResource["dojox.gfx.matrix"]){
dojo._hasResource["dojox.gfx.matrix"]=true;
dojo.provide("dojox.gfx.matrix");
(function(){
var m=dojox.gfx.matrix;
var _3a={};
m._degToRad=function(_3b){
return _3a[_3b]||(_3a[_3b]=(Math.PI*_3b/180));
};
m._radToDeg=function(_3c){
return _3c/Math.PI*180;
};
m.Matrix2D=function(arg){
if(arg){
if(typeof arg=="number"){
this.xx=this.yy=arg;
}else{
if(arg instanceof Array){
if(arg.length>0){
var _3d=m.normalize(arg[0]);
for(var i=1;i<arg.length;++i){
var l=_3d,r=dojox.gfx.matrix.normalize(arg[i]);
_3d=new m.Matrix2D();
_3d.xx=l.xx*r.xx+l.xy*r.yx;
_3d.xy=l.xx*r.xy+l.xy*r.yy;
_3d.yx=l.yx*r.xx+l.yy*r.yx;
_3d.yy=l.yx*r.xy+l.yy*r.yy;
_3d.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
_3d.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
dojo.mixin(this,_3d);
}
}else{
dojo.mixin(this,arg);
}
}
}
};
dojo.extend(m.Matrix2D,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0});
dojo.mixin(m,{identity:new m.Matrix2D(),flipX:new m.Matrix2D({xx:-1}),flipY:new m.Matrix2D({yy:-1}),flipXY:new m.Matrix2D({xx:-1,yy:-1}),translate:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({dx:a,dy:b});
}
return new m.Matrix2D({dx:a.x,dy:a.y});
},scale:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({xx:a,yy:b});
}
if(typeof a=="number"){
return new m.Matrix2D({xx:a,yy:a});
}
return new m.Matrix2D({xx:a.x,yy:a.y});
},rotate:function(_3e){
var c=Math.cos(_3e);
var s=Math.sin(_3e);
return new m.Matrix2D({xx:c,xy:-s,yx:s,yy:c});
},rotateg:function(_3f){
return m.rotate(m._degToRad(_3f));
},skewX:function(_40){
return new m.Matrix2D({xy:Math.tan(_40)});
},skewXg:function(_41){
return m.skewX(m._degToRad(_41));
},skewY:function(_42){
return new m.Matrix2D({yx:Math.tan(_42)});
},skewYg:function(_43){
return m.skewY(m._degToRad(_43));
},reflect:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=2*a*b/n2;
return new m.Matrix2D({xx:2*a2/n2-1,xy:xy,yx:xy,yy:2*b2/n2-1});
},project:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=a*b/n2;
return new m.Matrix2D({xx:a2/n2,xy:xy,yx:xy,yy:b2/n2});
},normalize:function(_44){
return (_44 instanceof m.Matrix2D)?_44:new m.Matrix2D(_44);
},clone:function(_45){
var obj=new m.Matrix2D();
for(var i in _45){
if(typeof (_45[i])=="number"&&typeof (obj[i])=="number"&&obj[i]!=_45[i]){
obj[i]=_45[i];
}
}
return obj;
},invert:function(_46){
var M=m.normalize(_46),D=M.xx*M.yy-M.xy*M.yx,M=new m.Matrix2D({xx:M.yy/D,xy:-M.xy/D,yx:-M.yx/D,yy:M.xx/D,dx:(M.xy*M.dy-M.yy*M.dx)/D,dy:(M.yx*M.dx-M.xx*M.dy)/D});
return M;
},_multiplyPoint:function(_47,x,y){
return {x:_47.xx*x+_47.xy*y+_47.dx,y:_47.yx*x+_47.yy*y+_47.dy};
},multiplyPoint:function(_48,a,b){
var M=m.normalize(_48);
if(typeof a=="number"&&typeof b=="number"){
return m._multiplyPoint(M,a,b);
}
return m._multiplyPoint(M,a.x,a.y);
},multiply:function(_49){
var M=m.normalize(_49);
for(var i=1;i<arguments.length;++i){
var l=M,r=m.normalize(arguments[i]);
M=new m.Matrix2D();
M.xx=l.xx*r.xx+l.xy*r.yx;
M.xy=l.xx*r.xy+l.xy*r.yy;
M.yx=l.yx*r.xx+l.yy*r.yx;
M.yy=l.yx*r.xy+l.yy*r.yy;
M.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
M.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
return M;
},_sandwich:function(_4a,x,y){
return m.multiply(m.translate(x,y),_4a,m.translate(-x,-y));
},scaleAt:function(a,b,c,d){
switch(arguments.length){
case 4:
return m._sandwich(m.scale(a,b),c,d);
case 3:
if(typeof c=="number"){
return m._sandwich(m.scale(a),b,c);
}
return m._sandwich(m.scale(a,b),c.x,c.y);
}
return m._sandwich(m.scale(a),b.x,b.y);
},rotateAt:function(_4b,a,b){
if(arguments.length>2){
return m._sandwich(m.rotate(_4b),a,b);
}
return m._sandwich(m.rotate(_4b),a.x,a.y);
},rotategAt:function(_4c,a,b){
if(arguments.length>2){
return m._sandwich(m.rotateg(_4c),a,b);
}
return m._sandwich(m.rotateg(_4c),a.x,a.y);
},skewXAt:function(_4d,a,b){
if(arguments.length>2){
return m._sandwich(m.skewX(_4d),a,b);
}
return m._sandwich(m.skewX(_4d),a.x,a.y);
},skewXgAt:function(_4e,a,b){
if(arguments.length>2){
return m._sandwich(m.skewXg(_4e),a,b);
}
return m._sandwich(m.skewXg(_4e),a.x,a.y);
},skewYAt:function(_4f,a,b){
if(arguments.length>2){
return m._sandwich(m.skewY(_4f),a,b);
}
return m._sandwich(m.skewY(_4f),a.x,a.y);
},skewYgAt:function(_50,a,b){
if(arguments.length>2){
return m._sandwich(m.skewYg(_50),a,b);
}
return m._sandwich(m.skewYg(_50),a.x,a.y);
}});
})();
dojox.gfx.Matrix2D=dojox.gfx.matrix.Matrix2D;
}
if(!dojo._hasResource["dojox.gfx._base"]){
dojo._hasResource["dojox.gfx._base"]=true;
dojo.provide("dojox.gfx._base");
(function(){
var g=dojox.gfx,b=g._base;
g._hasClass=function(_51,_52){
var cls=_51.getAttribute("className");
return cls&&(" "+cls+" ").indexOf(" "+_52+" ")>=0;
};
g._addClass=function(_53,_54){
var cls=_53.getAttribute("className")||"";
if(!cls||(" "+cls+" ").indexOf(" "+_54+" ")<0){
_53.setAttribute("className",cls+(cls?" ":"")+_54);
}
};
g._removeClass=function(_55,_56){
var cls=_55.getAttribute("className");
if(cls){
_55.setAttribute("className",cls.replace(new RegExp("(^|\\s+)"+_56+"(\\s+|$)"),"$1$2"));
}
};
b._getFontMeasurements=function(){
var _57={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
if(dojo.isIE){
dojo.doc.documentElement.style.fontSize="100%";
}
var div=dojo.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},dojo.body());
for(var p in _57){
div.style.fontSize=p;
_57[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;
}
dojo.body().removeChild(div);
return _57;
};
var _58=null;
b._getCachedFontMeasurements=function(_59){
if(_59||!_58){
_58=b._getFontMeasurements();
}
return _58;
};
var _5a=null,_5b={};
b._getTextBox=function(_5c,_5d,_5e){
var m,s,al=arguments.length;
if(!_5a){
_5a=dojo.create("div",{style:{position:"absolute",top:"-10000px",left:"0"}},dojo.body());
}
m=_5a;
m.className="";
s=m.style;
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
if(al>1&&_5d){
for(var i in _5d){
if(i in _5b){
continue;
}
s[i]=_5d[i];
}
}
if(al>2&&_5e){
m.className=_5e;
}
m.innerHTML=_5c;
if(m["getBoundingClientRect"]){
var bcr=m.getBoundingClientRect();
return {l:bcr.left,t:bcr.top,w:bcr.width||(bcr.right-bcr.left),h:bcr.height||(bcr.bottom-bcr.top)};
}else{
return dojo.marginBox(m);
}
};
var _5f=0;
b._getUniqueId=function(){
var id;
do{
id=dojo._scopeName+"Unique"+(++_5f);
}while(dojo.byId(id));
return id;
};
})();
dojo.mixin(dojox.gfx,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:(function(){
var _60={};
return function(_61){
var t=_60[_61];
if(t){
return new t();
}
t=_60[_61]=new Function;
t.prototype=dojox.gfx["default"+_61];
return new t();
};
})(),normalizeColor:function(_62){
return (_62 instanceof dojo.Color)?_62:new dojo.Color(_62);
},normalizeParameters:function(_63,_64){
if(_64){
var _65={};
for(var x in _63){
if(x in _64&&!(x in _65)){
_63[x]=_64[x];
}
}
}
return _63;
},makeParameters:function(_66,_67){
if(!_67){
return dojo.delegate(_66);
}
var _68={};
for(var i in _66){
if(!(i in _68)){
_68[i]=dojo.clone((i in _67)?_67[i]:_66[i]);
}
}
return _68;
},formatNumber:function(x,_69){
var val=x.toString();
if(val.indexOf("e")>=0){
val=x.toFixed(4);
}else{
var _6a=val.indexOf(".");
if(_6a>=0&&val.length-_6a>5){
val=x.toFixed(4);
}
}
if(x<0){
return val;
}
return _69?" "+val:val;
},makeFontString:function(_6b){
return _6b.style+" "+_6b.variant+" "+_6b.weight+" "+_6b.size+" "+_6b.family;
},splitFontString:function(str){
var _6c=dojox.gfx.getDefault("Font");
var t=str.split(/\s+/);
do{
if(t.length<5){
break;
}
_6c.style=t[0];
_6c.variant=t[1];
_6c.weight=t[2];
var i=t[3].indexOf("/");
_6c.size=i<0?t[3]:t[3].substring(0,i);
var j=4;
if(i<0){
if(t[4]=="/"){
j=6;
}else{
if(t[4].charAt(0)=="/"){
j=5;
}
}
}
if(j<t.length){
_6c.family=t.slice(j).join(" ");
}
}while(false);
return _6c;
},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){
return dojox.gfx._base._getCachedFontMeasurements()["12pt"]/12;
},pt2px:function(len){
return len*dojox.gfx.px_in_pt();
},px2pt:function(len){
return len/dojox.gfx.px_in_pt();
},normalizedLength:function(len){
if(len.length==0){
return 0;
}
if(len.length>2){
var _6d=dojox.gfx.px_in_pt();
var val=parseFloat(len);
switch(len.slice(-2)){
case "px":
return val;
case "pt":
return val*_6d;
case "in":
return val*72*_6d;
case "pc":
return val*12*_6d;
case "mm":
return val*dojox.gfx.mm_in_pt*_6d;
case "cm":
return val*dojox.gfx.cm_in_pt*_6d;
}
}
return parseFloat(len);
},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,equalSources:function(a,b){
return a&&b&&a==b;
},switchTo:function(_6e){
var ns=dojox.gfx[_6e];
if(ns){
dojo.forEach(["Group","Rect","Ellipse","Circle","Line","Polyline","Image","Text","Path","TextPath","Surface","createSurface"],function(_6f){
dojox.gfx[_6f]=ns[_6f];
});
}
}});
}
if(!dojo._hasResource["dojox.gfx"]){
dojo._hasResource["dojox.gfx"]=true;
dojo.provide("dojox.gfx");
dojo.loadInit(function(){
var gfx=dojo.getObject("dojox.gfx",true),sl,_70,_71;
while(!gfx.renderer){
if(dojo.config.forceGfxRenderer){
dojox.gfx.renderer=dojo.config.forceGfxRenderer;
break;
}
var _72=(typeof dojo.config.gfxRenderer=="string"?dojo.config.gfxRenderer:"svg,vml,canvas,silverlight").split(",");
for(var i=0;i<_72.length;++i){
switch(_72[i]){
case "svg":
if("SVGAngle" in dojo.global){
dojox.gfx.renderer="svg";
}
break;
case "vml":
if(dojo.isIE){
dojox.gfx.renderer="vml";
}
break;
case "silverlight":
try{
if(dojo.isIE){
sl=new ActiveXObject("AgControl.AgControl");
if(sl&&sl.IsVersionSupported("1.0")){
_70=true;
}
}else{
if(navigator.plugins["Silverlight Plug-In"]){
_70=true;
}
}
}
catch(e){
_70=false;
}
finally{
sl=null;
}
if(_70){
dojox.gfx.renderer="silverlight";
}
break;
case "canvas":
if(dojo.global.CanvasRenderingContext2D){
dojox.gfx.renderer="canvas";
}
break;
}
if(gfx.renderer){
break;
}
}
break;
}
if(dojo.config.isDebug){
}
if(gfx[gfx.renderer]){
gfx.switchTo(gfx.renderer);
}else{
gfx.loadAndSwitch=gfx.renderer;
dojo["require"]("dojox.gfx."+gfx.renderer);
}
});
}
if(!dojo._hasResource["dojox.charting.axis2d.common"]){
dojo._hasResource["dojox.charting.axis2d.common"]=true;
dojo.provide("dojox.charting.axis2d.common");
(function(){
var g=dojox.gfx;
var _73=function(s){
s.marginLeft="0px";
s.marginTop="0px";
s.marginRight="0px";
s.marginBottom="0px";
s.paddingLeft="0px";
s.paddingTop="0px";
s.paddingRight="0px";
s.paddingBottom="0px";
s.borderLeftWidth="0px";
s.borderTopWidth="0px";
s.borderRightWidth="0px";
s.borderBottomWidth="0px";
};
var _74=function(n){
if(n["getBoundingClientRect"]){
var bcr=n.getBoundingClientRect();
return bcr.width||(bcr.right-bcr.left);
}else{
return dojo.marginBox(n).w;
}
};
dojo.mixin(dojox.charting.axis2d.common,{createText:{gfx:function(_75,_76,x,y,_77,_78,_79,_7a){
return _76.createText({x:x,y:y,text:_78,align:_77}).setFont(_79).setFill(_7a);
},html:function(_7b,_7c,x,y,_7d,_7e,_7f,_80,_81){
var p=dojo.doc.createElement("div"),s=p.style,_82;
_73(s);
s.font=_7f;
p.innerHTML=String(_7e).replace(/\s/g,"&nbsp;");
s.color=_80;
s.position="absolute";
s.left="-10000px";
dojo.body().appendChild(p);
var _83=g.normalizedLength(g.splitFontString(_7f).size);
if(!_81){
_82=_74(p);
}
dojo.body().removeChild(p);
s.position="relative";
if(_81){
s.width=_81+"px";
switch(_7d){
case "middle":
s.textAlign="center";
s.left=(x-_81/2)+"px";
break;
case "end":
s.textAlign="right";
s.left=(x-_81)+"px";
break;
default:
s.left=x+"px";
s.textAlign="left";
break;
}
}else{
switch(_7d){
case "middle":
s.left=Math.floor(x-_82/2)+"px";
break;
case "end":
s.left=Math.floor(x-_82)+"px";
break;
default:
s.left=Math.floor(x)+"px";
break;
}
}
s.top=Math.floor(y-_83)+"px";
s.whiteSpace="nowrap";
var _84=dojo.doc.createElement("div"),w=_84.style;
_73(w);
w.width="0px";
w.height="0px";
_84.appendChild(p);
_7b.node.insertBefore(_84,_7b.node.firstChild);
return _84;
}}});
})();
}
if(!dojo._hasResource["dojox.charting.Element"]){
dojo._hasResource["dojox.charting.Element"]=true;
dojo.provide("dojox.charting.Element");
dojo.declare("dojox.charting.Element",null,{chart:null,group:null,htmlElements:null,dirty:true,constructor:function(_85){
this.chart=_85;
this.group=null;
this.htmlElements=[];
this.dirty=true;
this.trailingSymbol="...";
this._events=[];
},createGroup:function(_86){
if(!_86){
_86=this.chart.surface;
}
if(!this.group){
this.group=_86.createGroup();
}
return this;
},purgeGroup:function(){
this.destroyHtmlElements();
if(this.group){
this.group.clear();
this.group.removeShape();
this.group=null;
}
this.dirty=true;
if(this._events.length){
dojo.forEach(this._events,function(_87){
_87.shape.disconnect(_87.handle);
});
this._events=[];
}
return this;
},cleanGroup:function(_88){
this.destroyHtmlElements();
if(!_88){
_88=this.chart.surface;
}
if(this.group){
this.group.clear();
}else{
this.group=_88.createGroup();
}
this.dirty=true;
return this;
},destroyHtmlElements:function(){
if(this.htmlElements.length){
dojo.forEach(this.htmlElements,dojo.destroy);
this.htmlElements=[];
}
},destroy:function(){
this.purgeGroup();
},getTextWidth:function(s,_89){
return dojox.gfx._base._getTextBox(s,{font:_89}).w||0;
},getTextWithLimitLength:function(s,_8a,_8b,_8c){
if(!s||s.length<=0){
return {text:"",truncated:_8c||false};
}
if(!_8b||_8b<=0){
return {text:s,truncated:_8c||false};
}
var _8d=2,_8e=0.618,_8f=s.substring(0,1)+this.trailingSymbol,_90=this.getTextWidth(_8f,_8a);
if(_8b<=_90){
return {text:_8f,truncated:true};
}
var _91=this.getTextWidth(s,_8a);
if(_91<=_8b){
return {text:s,truncated:_8c||false};
}else{
var _92=0,end=s.length;
while(_92<end){
if(end-_92<=_8d){
while(this.getTextWidth(s.substring(0,_92)+this.trailingSymbol,_8a)>_8b){
_92-=1;
}
return {text:(s.substring(0,_92)+this.trailingSymbol),truncated:true};
}
var _93=_92+Math.round((end-_92)*_8e),_94=this.getTextWidth(s.substring(0,_93),_8a);
if(_94<_8b){
_92=_93;
end=end;
}else{
_92=_92;
end=_93;
}
}
}
},getTextWithLimitCharCount:function(s,_95,_96,_97){
if(!s||s.length<=0){
return {text:"",truncated:_97||false};
}
if(!_96||_96<=0||s.length<=_96){
return {text:s,truncated:_97||false};
}
return {text:s.substring(0,_96)+this.trailingSymbol,truncated:true};
},_plotFill:function(_98,dim,_99){
if(!_98||!_98.type||!_98.space){
return _98;
}
var _9a=_98.space;
switch(_98.type){
case "linear":
if(_9a==="plot"||_9a==="shapeX"||_9a==="shapeY"){
_98=dojox.gfx.makeParameters(dojox.gfx.defaultLinearGradient,_98);
_98.space=_9a;
if(_9a==="plot"||_9a==="shapeX"){
var _9b=dim.height-_99.t-_99.b;
_98.y1=_99.t+_9b*_98.y1/100;
_98.y2=_99.t+_9b*_98.y2/100;
}
if(_9a==="plot"||_9a==="shapeY"){
var _9b=dim.width-_99.l-_99.r;
_98.x1=_99.l+_9b*_98.x1/100;
_98.x2=_99.l+_9b*_98.x2/100;
}
}
break;
case "radial":
if(_9a==="plot"){
_98=dojox.gfx.makeParameters(dojox.gfx.defaultRadialGradient,_98);
_98.space=_9a;
var _9c=dim.width-_99.l-_99.r,_9d=dim.height-_99.t-_99.b;
_98.cx=_99.l+_9c*_98.cx/100;
_98.cy=_99.t+_9d*_98.cy/100;
_98.r=_98.r*Math.sqrt(_9c*_9c+_9d*_9d)/200;
}
break;
case "pattern":
if(_9a==="plot"||_9a==="shapeX"||_9a==="shapeY"){
_98=dojox.gfx.makeParameters(dojox.gfx.defaultPattern,_98);
_98.space=_9a;
if(_9a==="plot"||_9a==="shapeX"){
var _9b=dim.height-_99.t-_99.b;
_98.y=_99.t+_9b*_98.y/100;
_98.height=_9b*_98.height/100;
}
if(_9a==="plot"||_9a==="shapeY"){
var _9b=dim.width-_99.l-_99.r;
_98.x=_99.l+_9b*_98.x/100;
_98.width=_9b*_98.width/100;
}
}
break;
}
return _98;
},_shapeFill:function(_9e,_9f){
if(!_9e||!_9e.space){
return _9e;
}
var _a0=_9e.space;
switch(_9e.type){
case "linear":
if(_a0==="shape"||_a0==="shapeX"||_a0==="shapeY"){
_9e=dojox.gfx.makeParameters(dojox.gfx.defaultLinearGradient,_9e);
_9e.space=_a0;
if(_a0==="shape"||_a0==="shapeX"){
var _a1=_9f.width;
_9e.x1=_9f.x+_a1*_9e.x1/100;
_9e.x2=_9f.x+_a1*_9e.x2/100;
}
if(_a0==="shape"||_a0==="shapeY"){
var _a1=_9f.height;
_9e.y1=_9f.y+_a1*_9e.y1/100;
_9e.y2=_9f.y+_a1*_9e.y2/100;
}
}
break;
case "radial":
if(_a0==="shape"){
_9e=dojox.gfx.makeParameters(dojox.gfx.defaultRadialGradient,_9e);
_9e.space=_a0;
_9e.cx=_9f.x+_9f.width/2;
_9e.cy=_9f.y+_9f.height/2;
_9e.r=_9e.r*_9f.width/200;
}
break;
case "pattern":
if(_a0==="shape"||_a0==="shapeX"||_a0==="shapeY"){
_9e=dojox.gfx.makeParameters(dojox.gfx.defaultPattern,_9e);
_9e.space=_a0;
if(_a0==="shape"||_a0==="shapeX"){
var _a1=_9f.width;
_9e.x=_9f.x+_a1*_9e.x/100;
_9e.width=_a1*_9e.width/100;
}
if(_a0==="shape"||_a0==="shapeY"){
var _a1=_9f.height;
_9e.y=_9f.y+_a1*_9e.y/100;
_9e.height=_a1*_9e.height/100;
}
}
break;
}
return _9e;
},_pseudoRadialFill:function(_a2,_a3,_a4,_a5,end){
if(!_a2||_a2.type!=="radial"||_a2.space!=="shape"){
return _a2;
}
var _a6=_a2.space;
_a2=dojox.gfx.makeParameters(dojox.gfx.defaultRadialGradient,_a2);
_a2.space=_a6;
if(arguments.length<4){
_a2.cx=_a3.x;
_a2.cy=_a3.y;
_a2.r=_a2.r*_a4/100;
return _a2;
}
var _a7=arguments.length<5?_a5:(end+_a5)/2;
return {type:"linear",x1:_a3.x,y1:_a3.y,x2:_a3.x+_a2.r*_a4*Math.cos(_a7)/100,y2:_a3.y+_a2.r*_a4*Math.sin(_a7)/100,colors:_a2.colors};
return _a2;
}});
}
if(!dojo._hasResource["dojox.charting.axis2d.Base"]){
dojo._hasResource["dojox.charting.axis2d.Base"]=true;
dojo.provide("dojox.charting.axis2d.Base");
dojo.declare("dojox.charting.axis2d.Base",dojox.charting.Element,{constructor:function(_a8,_a9){
this.vertical=_a9&&_a9.vertical;
},clear:function(){
return this;
},initialized:function(){
return false;
},calculate:function(min,max,_aa){
return this;
},getScaler:function(){
return null;
},getTicks:function(){
return null;
},getOffsets:function(){
return {l:0,r:0,t:0,b:0};
},render:function(dim,_ab){
this.dirty=false;
return this;
}});
}
if(!dojo._hasResource["dojox.lang.functional.lambda"]){
dojo._hasResource["dojox.lang.functional.lambda"]=true;
dojo.provide("dojox.lang.functional.lambda");
(function(){
var df=dojox.lang.functional,_ac={};
var _ad="ab".split(/a*/).length>1?String.prototype.split:function(sep){
var r=this.split.call(this,sep),m=sep.exec(this);
if(m&&m.index==0){
r.unshift("");
}
return r;
};
var _ae=function(s){
var _af=[],_b0=_ad.call(s,/\s*->\s*/m);
if(_b0.length>1){
while(_b0.length){
s=_b0.pop();
_af=_b0.pop().split(/\s*,\s*|\s+/m);
if(_b0.length){
_b0.push("(function("+_af+"){return ("+s+")})");
}
}
}else{
if(s.match(/\b_\b/)){
_af=["_"];
}else{
var l=s.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),r=s.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
if(l||r){
if(l){
_af.push("$1");
s="$1"+s;
}
if(r){
_af.push("$2");
s=s+"$2";
}
}else{
var _b1=s.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*:|this|true|false|null|undefined|typeof|instanceof|in|delete|new|void|arguments|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|eval|isFinite|isNaN|parseFloat|parseInt|unescape|dojo|dijit|dojox|window|document|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,"").match(/([a-z_$][a-z_$\d]*)/gi)||[],t={};
dojo.forEach(_b1,function(v){
if(!(v in t)){
_af.push(v);
t[v]=1;
}
});
}
}
}
return {args:_af,body:s};
};
var _b2=function(a){
return a.length?function(){
var i=a.length-1,x=df.lambda(a[i]).apply(this,arguments);
for(--i;i>=0;--i){
x=df.lambda(a[i]).call(this,x);
}
return x;
}:function(x){
return x;
};
};
dojo.mixin(df,{rawLambda:function(s){
return _ae(s);
},buildLambda:function(s){
s=_ae(s);
return "function("+s.args.join(",")+"){return ("+s.body+");}";
},lambda:function(s){
if(typeof s=="function"){
return s;
}
if(s instanceof Array){
return _b2(s);
}
if(s in _ac){
return _ac[s];
}
s=_ae(s);
return _ac[s]=new Function(s.args,"return ("+s.body+");");
},clearLambdaCache:function(){
_ac={};
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.array"]){
dojo._hasResource["dojox.lang.functional.array"]=true;
dojo.provide("dojox.lang.functional.array");
(function(){
var d=dojo,df=dojox.lang.functional,_b3={};
d.mixin(df,{filter:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t=[],v,i,n;
if(d.isArray(a)){
for(i=0,n=a.length;i<n;++i){
v=a[i];
if(f.call(o,v,i,a)){
t.push(v);
}
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(i=0;a.hasNext();){
v=a.next();
if(f.call(o,v,i++,a)){
t.push(v);
}
}
}else{
for(i in a){
if(!(i in _b3)){
v=a[i];
if(f.call(o,v,i,a)){
t.push(v);
}
}
}
}
}
return t;
},forEach:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var i,n;
if(d.isArray(a)){
for(i=0,n=a.length;i<n;f.call(o,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(i=0;a.hasNext();f.call(o,a.next(),i++,a)){
}
}else{
for(i in a){
if(!(i in _b3)){
f.call(o,a[i],i,a);
}
}
}
}
return o;
},map:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n,i;
if(d.isArray(a)){
t=new Array(n=a.length);
for(i=0;i<n;t[i]=f.call(o,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
t=[];
for(i=0;a.hasNext();t.push(f.call(o,a.next(),i++,a))){
}
}else{
t=[];
for(i in a){
if(!(i in _b3)){
t.push(f.call(o,a[i],i,a));
}
}
}
}
return t;
},every:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var i,n;
if(d.isArray(a)){
for(i=0,n=a.length;i<n;++i){
if(!f.call(o,a[i],i,a)){
return false;
}
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(i=0;a.hasNext();){
if(!f.call(o,a.next(),i++,a)){
return false;
}
}
}else{
for(i in a){
if(!(i in _b3)){
if(!f.call(o,a[i],i,a)){
return false;
}
}
}
}
}
return true;
},some:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var i,n;
if(d.isArray(a)){
for(i=0,n=a.length;i<n;++i){
if(f.call(o,a[i],i,a)){
return true;
}
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(i=0;a.hasNext();){
if(f.call(o,a.next(),i++,a)){
return true;
}
}
}else{
for(i in a){
if(!(i in _b3)){
if(f.call(o,a[i],i,a)){
return true;
}
}
}
}
}
return false;
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.object"]){
dojo._hasResource["dojox.lang.functional.object"]=true;
dojo.provide("dojox.lang.functional.object");
(function(){
var d=dojo,df=dojox.lang.functional,_b4={};
d.mixin(df,{keys:function(obj){
var t=[];
for(var i in obj){
if(!(i in _b4)){
t.push(i);
}
}
return t;
},values:function(obj){
var t=[];
for(var i in obj){
if(!(i in _b4)){
t.push(obj[i]);
}
}
return t;
},filterIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
var t={},v,i;
for(i in obj){
if(!(i in _b4)){
v=obj[i];
if(f.call(o,v,i,obj)){
t[i]=v;
}
}
}
return t;
},forIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
for(var i in obj){
if(!(i in _b4)){
f.call(o,obj[i],i,obj);
}
}
return o;
},mapIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
var t={},i;
for(i in obj){
if(!(i in _b4)){
t[i]=f.call(o,obj[i],i,obj);
}
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional"]){
dojo._hasResource["dojox.lang.functional"]=true;
dojo.provide("dojox.lang.functional");
}
if(!dojo._hasResource["dojox.lang.utils"]){
dojo._hasResource["dojox.lang.utils"]=true;
dojo.provide("dojox.lang.utils");
(function(){
var _b5={},du=dojox.lang.utils,_b6=Object.prototype.toString;
var _b7=function(o){
if(o){
switch(_b6.call(o)){
case "[object Array]":
return o.slice(0);
case "[object Object]":
return dojo.delegate(o);
}
}
return o;
};
dojo.mixin(du,{coerceType:function(_b8,_b9){
switch(typeof _b8){
case "number":
return Number(eval("("+_b9+")"));
case "string":
return String(_b9);
case "boolean":
return Boolean(eval("("+_b9+")"));
}
return eval("("+_b9+")");
},updateWithObject:function(_ba,_bb,_bc){
if(!_bb){
return _ba;
}
for(var x in _ba){
if(x in _bb&&!(x in _b5)){
var t=_ba[x];
if(t&&typeof t=="object"){
du.updateWithObject(t,_bb[x],_bc);
}else{
_ba[x]=_bc?du.coerceType(t,_bb[x]):_b7(_bb[x]);
}
}
}
return _ba;
},updateWithPattern:function(_bd,_be,_bf,_c0){
if(!_be||!_bf){
return _bd;
}
for(var x in _bf){
if(x in _be&&!(x in _b5)){
_bd[x]=_c0?du.coerceType(_bf[x],_be[x]):_b7(_be[x]);
}
}
return _bd;
},merge:function(_c1,_c2){
if(_c2){
var _c3=_b6.call(_c1),_c4=_b6.call(_c2),t,i,l,m;
switch(_c4){
case "[object Array]":
if(_c4==_c3){
t=new Array(Math.max(_c1.length,_c2.length));
for(i=0,l=t.length;i<l;++i){
t[i]=du.merge(_c1[i],_c2[i]);
}
return t;
}
return _c2.slice(0);
case "[object Object]":
if(_c4==_c3&&_c1){
t=dojo.delegate(_c1);
for(i in _c2){
if(i in _c1){
l=_c1[i];
m=_c2[i];
if(m!==l){
t[i]=du.merge(l,m);
}
}else{
t[i]=dojo.clone(_c2[i]);
}
}
return t;
}
return dojo.clone(_c2);
}
}
return _c2;
}});
})();
}
if(!dojo._hasResource["dojox.charting.axis2d.Invisible"]){
dojo._hasResource["dojox.charting.axis2d.Invisible"]=true;
dojo.provide("dojox.charting.axis2d.Invisible");
(function(){
var dc=dojox.charting,df=dojox.lang.functional,du=dojox.lang.utils,g=dojox.gfx,lin=dc.scaler.linear,_c5=du.merge,_c6=4,_c7=45;
dojo.declare("dojox.charting.axis2d.Invisible",dojox.charting.axis2d.Base,{defaultParams:{vertical:false,fixUpper:"none",fixLower:"none",natural:false,leftBottom:true,includeZero:false,fixed:true,majorLabels:true,minorTicks:true,minorLabels:true,microTicks:false,rotation:0},optionalParams:{min:0,max:1,from:0,to:1,majorTickStep:4,minorTickStep:2,microTickStep:1,labels:[],labelFunc:null,maxLabelSize:0,maxLabelCharCount:0,trailingSymbol:null},constructor:function(_c8,_c9){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_c9);
du.updateWithPattern(this.opt,_c9,this.optionalParams);
},dependOnData:function(){
return !("min" in this.opt)||!("max" in this.opt);
},clear:function(){
delete this.scaler;
delete this.ticks;
this.dirty=true;
return this;
},initialized:function(){
return "scaler" in this&&!(this.dirty&&this.dependOnData());
},setWindow:function(_ca,_cb){
this.scale=_ca;
this.offset=_cb;
return this.clear();
},getWindowScale:function(){
return "scale" in this?this.scale:1;
},getWindowOffset:function(){
return "offset" in this?this.offset:0;
},_groupLabelWidth:function(_cc,_cd,_ce){
if(!_cc.length){
return 0;
}
if(dojo.isObject(_cc[0])){
_cc=df.map(_cc,function(_cf){
return _cf.text;
});
}
if(_ce){
_cc=df.map(_cc,function(_d0){
return dojo.trim(_d0).length==0?"":_d0.substring(0,_ce)+this.trailingSymbol;
},this);
}
var s=_cc.join("<br>");
return dojox.gfx._base._getTextBox(s,{font:_cd}).w||0;
},calculate:function(min,max,_d1,_d2){
if(this.initialized()){
return this;
}
var o=this.opt;
this.labels="labels" in o?o.labels:_d2;
this.scaler=lin.buildScaler(min,max,_d1,o);
var tsb=this.scaler.bounds;
if("scale" in this){
o.from=tsb.lower+this.offset;
o.to=(tsb.upper-tsb.lower)/this.scale+o.from;
if(!isFinite(o.from)||isNaN(o.from)||!isFinite(o.to)||isNaN(o.to)||o.to-o.from>=tsb.upper-tsb.lower){
delete o.from;
delete o.to;
delete this.scale;
delete this.offset;
}else{
if(o.from<tsb.lower){
o.to+=tsb.lower-o.from;
o.from=tsb.lower;
}else{
if(o.to>tsb.upper){
o.from+=tsb.upper-o.to;
o.to=tsb.upper;
}
}
this.offset=o.from-tsb.lower;
}
this.scaler=lin.buildScaler(min,max,_d1,o);
tsb=this.scaler.bounds;
if(this.scale==1&&this.offset==0){
delete this.scale;
delete this.offset;
}
}
var ta=this.chart.theme.axis,_d3=0,_d4=o.rotation%360,_d5=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_d6=_d5?g.normalizedLength(g.splitFontString(_d5).size):0,_d7=Math.abs(Math.cos(_d4*Math.PI/180)),_d8=Math.abs(Math.sin(_d4*Math.PI/180));
if(_d4<0){
_d4+=360;
}
if(_d6){
if(this.vertical?_d4!=0&&_d4!=180:_d4!=90&&_d4!=270){
if(this.labels){
_d3=this._groupLabelWidth(this.labels,_d5,o.maxLabelCharCount);
}else{
var _d9=Math.ceil(Math.log(Math.max(Math.abs(tsb.from),Math.abs(tsb.to)))/Math.LN10),t=[];
if(tsb.from<0||tsb.to<0){
t.push("-");
}
t.push(dojo.string.rep("9",_d9));
var _da=Math.floor(Math.log(tsb.to-tsb.from)/Math.LN10);
if(_da>0){
t.push(".");
t.push(dojo.string.rep("9",_da));
}
_d3=dojox.gfx._base._getTextBox(t.join(""),{font:_d5}).w;
}
_d3=o.maxLabelSize?Math.min(o.maxLabelSize,_d3):_d3;
}else{
_d3=_d6;
}
switch(_d4){
case 0:
case 90:
case 180:
case 270:
break;
default:
var _db=Math.sqrt(_d3*_d3+_d6*_d6),_dc=this.vertical?_d6*_d7+_d3*_d8:_d3*_d7+_d6*_d8;
_d3=Math.min(_db,_dc);
break;
}
}
this.scaler.minMinorStep=_d3+_c6;
this.ticks=lin.buildTicks(this.scaler,o);
return this;
},getScaler:function(){
return this.scaler;
},getTicks:function(){
return this.ticks;
}});
})();
}
if(!dojo._hasResource["dojo.colors"]){
dojo._hasResource["dojo.colors"]=true;
dojo.provide("dojo.colors");
dojo.getObject("colors",true,dojo);
(function(){
var _dd=function(m1,m2,h){
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
dojo.colorFromRgb=function(_de,obj){
var m=_de.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
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
a=[_dd(m1,m2,H+1/3)*256,_dd(m1,m2,H)*256,_dd(m1,m2,H-1/3)*256,1];
if(l==4){
a[3]=c[3];
}
return dojo.colorFromArray(a,obj);
}
}
return null;
};
var _df=function(c,low,_e0){
c=Number(c);
return isNaN(c)?_e0:c<low?low:c>_e0?_e0:c;
};
dojo.Color.prototype.sanitize=function(){
var t=this;
t.r=Math.round(_df(t.r,0,255));
t.g=Math.round(_df(t.g,0,255));
t.b=Math.round(_df(t.b,0,255));
t.a=_df(t.a,0,1);
return this;
};
})();
dojo.colors.makeGrey=function(g,a){
return dojo.colorFromArray([g,g,g,a]);
};
dojo.mixin(dojo.Color.named,{aliceblue:[240,248,255],antiquewhite:[250,235,215],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],blanchedalmond:[255,235,205],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],oldlace:[253,245,230],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],thistle:[216,191,216],tomato:[255,99,71],transparent:[0,0,0,0],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],whitesmoke:[245,245,245],yellowgreen:[154,205,50]});
}
if(!dojo._hasResource["dojox.charting.axis2d.Default"]){
dojo._hasResource["dojox.charting.axis2d.Default"]=true;
dojo.provide("dojox.charting.axis2d.Default");
(function(){
var dc=dojox.charting,du=dojox.lang.utils,g=dojox.gfx,lin=dc.scaler.linear,_e1=4,_e2=45;
dojo.declare("dojox.charting.axis2d.Default",dojox.charting.axis2d.Invisible,{defaultParams:{vertical:false,fixUpper:"none",fixLower:"none",natural:false,leftBottom:true,includeZero:false,fixed:true,majorLabels:true,minorTicks:true,minorLabels:true,microTicks:false,rotation:0,htmlLabels:true},optionalParams:{min:0,max:1,from:0,to:1,majorTickStep:4,minorTickStep:2,microTickStep:1,labels:[],labelFunc:null,maxLabelSize:0,maxLabelCharCount:0,trailingSymbol:null,stroke:{},majorTick:{},minorTick:{},microTick:{},tick:{},font:"",fontColor:"",title:"",titleGap:0,titleFont:"",titleFontColor:"",titleOrientation:""},constructor:function(_e3,_e4){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_e4);
du.updateWithPattern(this.opt,_e4,this.optionalParams);
},getOffsets:function(){
var s=this.scaler,_e5={l:0,r:0,t:0,b:0};
if(!s){
return _e5;
}
var o=this.opt,_e6=0,a,b,c,d,gl=dc.scaler.common.getNumericLabel,_e7=0,ma=s.major,mi=s.minor,ta=this.chart.theme.axis,_e8=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_e9=o.titleFont||(ta.tick&&ta.tick.titleFont),_ea=(o.titleGap==0)?0:o.titleGap||(ta.tick&&ta.tick.titleGap)||15,_eb=this.chart.theme.getTick("major",o),_ec=this.chart.theme.getTick("minor",o),_ed=_e8?g.normalizedLength(g.splitFontString(_e8).size):0,_ee=_e9?g.normalizedLength(g.splitFontString(_e9).size):0,_ef=o.rotation%360,_f0=o.leftBottom,_f1=Math.abs(Math.cos(_ef*Math.PI/180)),_f2=Math.abs(Math.sin(_ef*Math.PI/180));
this.trailingSymbol=(o.trailingSymbol===undefined||o.trailingSymbol===null)?this.trailingSymbol:o.trailingSymbol;
if(_ef<0){
_ef+=360;
}
if(_ed){
if(this.labels){
_e6=this._groupLabelWidth(this.labels,_e8,o.maxLabelCharCount);
}else{
_e6=this._groupLabelWidth([gl(ma.start,ma.prec,o),gl(ma.start+ma.count*ma.tick,ma.prec,o),gl(mi.start,mi.prec,o),gl(mi.start+mi.count*mi.tick,mi.prec,o)],_e8,o.maxLabelCharCount);
}
_e6=o.maxLabelSize?Math.min(o.maxLabelSize,_e6):_e6;
if(this.vertical){
var _f3=_f0?"l":"r";
switch(_ef){
case 0:
case 180:
_e5[_f3]=_e6;
_e5.t=_e5.b=_ed/2;
break;
case 90:
case 270:
_e5[_f3]=_ed;
_e5.t=_e5.b=_e6/2;
break;
default:
if(_ef<=_e2||(180<_ef&&_ef<=(180+_e2))){
_e5[_f3]=_ed*_f2/2+_e6*_f1;
_e5[_f0?"t":"b"]=_ed*_f1/2+_e6*_f2;
_e5[_f0?"b":"t"]=_ed*_f1/2;
}else{
if(_ef>(360-_e2)||(180>_ef&&_ef>(180-_e2))){
_e5[_f3]=_ed*_f2/2+_e6*_f1;
_e5[_f0?"b":"t"]=_ed*_f1/2+_e6*_f2;
_e5[_f0?"t":"b"]=_ed*_f1/2;
}else{
if(_ef<90||(180<_ef&&_ef<270)){
_e5[_f3]=_ed*_f2+_e6*_f1;
_e5[_f0?"t":"b"]=_ed*_f1+_e6*_f2;
}else{
_e5[_f3]=_ed*_f2+_e6*_f1;
_e5[_f0?"b":"t"]=_ed*_f1+_e6*_f2;
}
}
}
break;
}
_e5[_f3]+=_e1+Math.max(_eb.length,_ec.length)+(o.title?(_ee+_ea):0);
}else{
var _f3=_f0?"b":"t";
switch(_ef){
case 0:
case 180:
_e5[_f3]=_ed;
_e5.l=_e5.r=_e6/2;
break;
case 90:
case 270:
_e5[_f3]=_e6;
_e5.l=_e5.r=_ed/2;
break;
default:
if((90-_e2)<=_ef&&_ef<=90||(270-_e2)<=_ef&&_ef<=270){
_e5[_f3]=_ed*_f2/2+_e6*_f1;
_e5[_f0?"r":"l"]=_ed*_f1/2+_e6*_f2;
_e5[_f0?"l":"r"]=_ed*_f1/2;
}else{
if(90<=_ef&&_ef<=(90+_e2)||270<=_ef&&_ef<=(270+_e2)){
_e5[_f3]=_ed*_f2/2+_e6*_f1;
_e5[_f0?"l":"r"]=_ed*_f1/2+_e6*_f2;
_e5[_f0?"r":"l"]=_ed*_f1/2;
}else{
if(_ef<_e2||(180<_ef&&_ef<(180-_e2))){
_e5[_f3]=_ed*_f2+_e6*_f1;
_e5[_f0?"r":"l"]=_ed*_f1+_e6*_f2;
}else{
_e5[_f3]=_ed*_f2+_e6*_f1;
_e5[_f0?"l":"r"]=_ed*_f1+_e6*_f2;
}
}
}
break;
}
_e5[_f3]+=_e1+Math.max(_eb.length,_ec.length)+(o.title?(_ee+_ea):0);
}
}
if(_e6){
this._cachedLabelWidth=_e6;
}
return _e5;
},render:function(dim,_f4){
if(!this.dirty){
return this;
}
var o=this.opt,ta=this.chart.theme.axis,_f5=o.leftBottom,_f6=o.rotation%360,_f7,_f8,_f9,_fa=0,_fb,_fc,_fd,_fe,_ff,_100,_101=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_102=o.titleFont||(ta.tick&&ta.tick.titleFont),_103=o.fontColor||(ta.majorTick&&ta.majorTick.fontColor)||(ta.tick&&ta.tick.fontColor)||"black",_104=o.titleFontColor||(ta.tick&&ta.tick.titleFontColor)||"black",_105=(o.titleGap==0)?0:o.titleGap||(ta.tick&&ta.tick.titleGap)||15,_106=o.titleOrientation||(ta.tick&&ta.tick.titleOrientation)||"axis",_107=this.chart.theme.getTick("major",o),_108=this.chart.theme.getTick("minor",o),_109=this.chart.theme.getTick("micro",o),_10a=Math.max(_107.length,_108.length,_109.length),_10b="stroke" in o?o.stroke:ta.stroke,size=_101?g.normalizedLength(g.splitFontString(_101).size):0,cosr=Math.abs(Math.cos(_f6*Math.PI/180)),sinr=Math.abs(Math.sin(_f6*Math.PI/180)),_10c=_102?g.normalizedLength(g.splitFontString(_102).size):0;
if(_f6<0){
_f6+=360;
}
if(this.vertical){
_f7={y:dim.height-_f4.b};
_f8={y:_f4.t};
_f9={y:(dim.height-_f4.b+_f4.t)/2};
_fb=size*sinr+(this._cachedLabelWidth||0)*cosr+_e1+Math.max(_107.length,_108.length)+_10c+_105;
_fc={x:0,y:-1};
_ff={x:0,y:0};
_fd={x:1,y:0};
_fe={x:_e1,y:0};
switch(_f6){
case 0:
_100="end";
_ff.y=size*0.4;
break;
case 90:
_100="middle";
_ff.x=-size;
break;
case 180:
_100="start";
_ff.y=-size*0.4;
break;
case 270:
_100="middle";
break;
default:
if(_f6<_e2){
_100="end";
_ff.y=size*0.4;
}else{
if(_f6<90){
_100="end";
_ff.y=size*0.4;
}else{
if(_f6<(180-_e2)){
_100="start";
}else{
if(_f6<(180+_e2)){
_100="start";
_ff.y=-size*0.4;
}else{
if(_f6<270){
_100="start";
_ff.x=_f5?0:size*0.4;
}else{
if(_f6<(360-_e2)){
_100="end";
_ff.x=_f5?0:size*0.4;
}else{
_100="end";
_ff.y=size*0.4;
}
}
}
}
}
}
}
if(_f5){
_f7.x=_f8.x=_f4.l;
_fa=(_106&&_106=="away")?90:270;
_f9.x=_f4.l-_fb+(_fa==270?_10c:0);
_fd.x=-1;
_fe.x=-_fe.x;
}else{
_f7.x=_f8.x=dim.width-_f4.r;
_fa=(_106&&_106=="axis")?90:270;
_f9.x=dim.width-_f4.r+_fb-(_fa==270?0:_10c);
switch(_100){
case "start":
_100="end";
break;
case "end":
_100="start";
break;
case "middle":
_ff.x+=size;
break;
}
}
}else{
_f7={x:_f4.l};
_f8={x:dim.width-_f4.r};
_f9={x:(dim.width-_f4.r+_f4.l)/2};
_fb=size*cosr+(this._cachedLabelWidth||0)*sinr+_e1+Math.max(_107.length,_108.length)+_10c+_105;
_fc={x:1,y:0};
_ff={x:0,y:0};
_fd={x:0,y:1};
_fe={x:0,y:_e1};
switch(_f6){
case 0:
_100="middle";
_ff.y=size;
break;
case 90:
_100="start";
_ff.x=-size*0.4;
break;
case 180:
_100="middle";
break;
case 270:
_100="end";
_ff.x=size*0.4;
break;
default:
if(_f6<(90-_e2)){
_100="start";
_ff.y=_f5?size:0;
}else{
if(_f6<(90+_e2)){
_100="start";
_ff.x=-size*0.4;
}else{
if(_f6<180){
_100="start";
_ff.y=_f5?0:-size;
}else{
if(_f6<(270-_e2)){
_100="end";
_ff.y=_f5?0:-size;
}else{
if(_f6<(270+_e2)){
_100="end";
_ff.y=_f5?size*0.4:0;
}else{
_100="end";
_ff.y=_f5?size:0;
}
}
}
}
}
}
if(_f5){
_f7.y=_f8.y=dim.height-_f4.b;
_fa=(_106&&_106=="axis")?180:0;
_f9.y=dim.height-_f4.b+_fb-(_fa?_10c:0);
}else{
_f7.y=_f8.y=_f4.t;
_fa=(_106&&_106=="away")?180:0;
_f9.y=_f4.t-_fb+(_fa?0:_10c);
_fd.y=-1;
_fe.y=-_fe.y;
switch(_100){
case "start":
_100="end";
break;
case "end":
_100="start";
break;
case "middle":
_ff.y-=size;
break;
}
}
}
this.cleanGroup();
try{
var s=this.group,c=this.scaler,t=this.ticks,_10d,f=lin.getTransformerFromModel(this.scaler),_10e=!_fa&&!_f6&&this.opt.htmlLabels&&!dojo.isIE&&!dojo.isOpera?"html":"gfx",dx=_fd.x*_107.length,dy=_fd.y*_107.length;
s.createLine({x1:_f7.x,y1:_f7.y,x2:_f8.x,y2:_f8.y}).setStroke(_10b);
if(o.title){
var _10f=dc.axis2d.common.createText[_10e](this.chart,s,_f9.x,_f9.y,"middle",o.title,_102,_104);
if(_10e=="html"){
this.htmlElements.push(_10f);
}else{
_10f.setTransform(g.matrix.rotategAt(_fa,_f9.x,_f9.y));
}
}
dojo.forEach(t.major,function(tick){
var _110=f(tick.value),elem,x=_f7.x+_fc.x*_110,y=_f7.y+_fc.y*_110;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_107);
if(tick.label){
var _111=o.maxLabelCharCount?this.getTextWithLimitCharCount(tick.label,_101,o.maxLabelCharCount):{text:tick.label,truncated:false};
_111=o.maxLabelSize?this.getTextWithLimitLength(_111.text,_101,o.maxLabelSize,_111.truncated):_111;
elem=dc.axis2d.common.createText[_10e](this.chart,s,x+dx+_fe.x+(_f6?0:_ff.x),y+dy+_fe.y+(_f6?0:_ff.y),_100,_111.text,_101,_103);
_111.truncated&&this.labelTooltip(elem,this.chart,tick.label,_111.text,_101,_10e);
if(_10e=="html"){
this.htmlElements.push(elem);
}else{
if(_f6){
elem.setTransform([{dx:_ff.x,dy:_ff.y},g.matrix.rotategAt(_f6,x+dx+_fe.x,y+dy+_fe.y)]);
}
}
}
},this);
dx=_fd.x*_108.length;
dy=_fd.y*_108.length;
_10d=c.minMinorStep<=c.minor.tick*c.bounds.scale;
dojo.forEach(t.minor,function(tick){
var _112=f(tick.value),elem,x=_f7.x+_fc.x*_112,y=_f7.y+_fc.y*_112;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_108);
if(_10d&&tick.label){
var _113=o.maxLabelCharCount?this.getTextWithLimitCharCount(tick.label,_101,o.maxLabelCharCount):{text:tick.label,truncated:false};
_113=o.maxLabelSize?this.getTextWithLimitLength(_113.text,_101,o.maxLabelSize,_113.truncated):_113;
elem=dc.axis2d.common.createText[_10e](this.chart,s,x+dx+_fe.x+(_f6?0:_ff.x),y+dy+_fe.y+(_f6?0:_ff.y),_100,_113.text,_101,_103);
_113.truncated&&this.labelTooltip(elem,this.chart,tick.label,_113.text,_101,_10e);
if(_10e=="html"){
this.htmlElements.push(elem);
}else{
if(_f6){
elem.setTransform([{dx:_ff.x,dy:_ff.y},g.matrix.rotategAt(_f6,x+dx+_fe.x,y+dy+_fe.y)]);
}
}
}
},this);
dx=_fd.x*_109.length;
dy=_fd.y*_109.length;
dojo.forEach(t.micro,function(tick){
var _114=f(tick.value),elem,x=_f7.x+_fc.x*_114,y=_f7.y+_fc.y*_114;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_109);
},this);
}
catch(e){
}
this.dirty=false;
return this;
},labelTooltip:function(elem,_115,_116,_117,font,_118){
if(!dijit||!dijit.Tooltip){
return;
}
var _119={type:"rect"},_11a=["above","below"],_11b=dojox.gfx._base._getTextBox(_117,{font:font}).w||0;
fontHeight=font?g.normalizedLength(g.splitFontString(font).size):0;
if(_118=="html"){
dojo.mixin(_119,dojo.coords(elem.firstChild,true));
_119.width=Math.ceil(_11b);
_119.height=Math.ceil(fontHeight);
this._events.push({shape:dojo,handle:dojo.connect(elem.firstChild,"onmouseover",this,function(e){
dijit.showTooltip(_116,_119,_11a);
})});
this._events.push({shape:dojo,handle:dojo.connect(elem.firstChild,"onmouseout",this,function(e){
dijit.hideTooltip(_119);
})});
}else{
var shp=elem.getShape(),lt=dojo.coords(_115.node,true);
_119=dojo.mixin(_119,{x:shp.x-_11b/2,y:shp.y});
_119.x+=lt.x;
_119.y+=lt.y;
_119.x=Math.round(_119.x);
_119.y=Math.round(_119.y);
_119.width=Math.ceil(_11b);
_119.height=Math.ceil(fontHeight);
this._events.push({shape:elem,handle:elem.connect("onmouseenter",this,function(e){
dijit.showTooltip(_116,_119,_11a);
})});
this._events.push({shape:elem,handle:elem.connect("onmouseleave",this,function(e){
dijit.hideTooltip(_119);
})});
}
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.common"]){
dojo._hasResource["dojox.charting.plot2d.common"]=true;
dojo.provide("dojox.charting.plot2d.common");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common;
dojo.mixin(dojox.charting.plot2d.common,{makeStroke:function(_11c){
if(!_11c){
return _11c;
}
if(typeof _11c=="string"||_11c instanceof dojo.Color){
_11c={color:_11c};
}
return dojox.gfx.makeParameters(dojox.gfx.defaultStroke,_11c);
},augmentColor:function(_11d,_11e){
var t=new dojo.Color(_11d),c=new dojo.Color(_11e);
c.a=t.a;
return c;
},augmentStroke:function(_11f,_120){
var s=dc.makeStroke(_11f);
if(s){
s.color=dc.augmentColor(s.color,_120);
}
return s;
},augmentFill:function(fill,_121){
var fc,c=new dojo.Color(_121);
if(typeof fill=="string"||fill instanceof dojo.Color){
return dc.augmentColor(fill,_121);
}
return fill;
},defaultStats:{vmin:Number.POSITIVE_INFINITY,vmax:Number.NEGATIVE_INFINITY,hmin:Number.POSITIVE_INFINITY,hmax:Number.NEGATIVE_INFINITY},collectSimpleStats:function(_122){
var _123=dojo.delegate(dc.defaultStats);
for(var i=0;i<_122.length;++i){
var run=_122[i];
for(var j=0;j<run.data.length;j++){
if(run.data[j]!==null){
if(typeof run.data[j]=="number"){
var _124=_123.vmin,_125=_123.vmax;
if(!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,i){
if(val!==null){
var x=i+1,y=val;
if(isNaN(y)){
y=0;
}
_123.hmin=Math.min(_123.hmin,x);
_123.hmax=Math.max(_123.hmax,x);
_123.vmin=Math.min(_123.vmin,y);
_123.vmax=Math.max(_123.vmax,y);
}
});
}
if("ymin" in run){
_123.vmin=Math.min(_124,run.ymin);
}
if("ymax" in run){
_123.vmax=Math.max(_125,run.ymax);
}
}else{
var _126=_123.hmin,_127=_123.hmax,_124=_123.vmin,_125=_123.vmax;
if(!("xmin" in run)||!("xmax" in run)||!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,i){
if(val!==null){
var x="x" in val?val.x:i+1,y=val.y;
if(isNaN(x)){
x=0;
}
if(isNaN(y)){
y=0;
}
_123.hmin=Math.min(_123.hmin,x);
_123.hmax=Math.max(_123.hmax,x);
_123.vmin=Math.min(_123.vmin,y);
_123.vmax=Math.max(_123.vmax,y);
}
});
}
if("xmin" in run){
_123.hmin=Math.min(_126,run.xmin);
}
if("xmax" in run){
_123.hmax=Math.max(_127,run.xmax);
}
if("ymin" in run){
_123.vmin=Math.min(_124,run.ymin);
}
if("ymax" in run){
_123.vmax=Math.max(_125,run.ymax);
}
}
break;
}
}
}
return _123;
},calculateBarSize:function(_128,opt,_129){
if(!_129){
_129=1;
}
var gap=opt.gap,size=(_128-2*gap)/_129;
if("minBarSize" in opt){
size=Math.max(size,opt.minBarSize);
}
if("maxBarSize" in opt){
size=Math.min(size,opt.maxBarSize);
}
size=Math.max(size,1);
gap=(_128-size*_129)/2;
return {size:size,gap:gap};
},collectStackedStats:function(_12a){
var _12b=dojo.clone(dc.defaultStats);
if(_12a.length){
_12b.hmin=Math.min(_12b.hmin,1);
_12b.hmax=df.foldl(_12a,"seed, run -> Math.max(seed, run.data.length)",_12b.hmax);
for(var i=0;i<_12b.hmax;++i){
var v=_12a[0].data[i];
v=v&&(typeof v=="number"?v:v.y);
if(isNaN(v)){
v=0;
}
_12b.vmin=Math.min(_12b.vmin,v);
for(var j=1;j<_12a.length;++j){
var t=_12a[j].data[i];
t=t&&(typeof t=="number"?t:t.y);
if(isNaN(t)){
t=0;
}
v+=t;
}
_12b.vmax=Math.max(_12b.vmax,v);
}
}
return _12b;
},curve:function(a,_12c){
var arr=a.slice(0);
if(_12c=="x"){
arr[arr.length]=arr[0];
}
var p=dojo.map(arr,function(item,i){
if(i==0){
return "M"+item.x+","+item.y;
}
if(!isNaN(_12c)){
var dx=item.x-arr[i-1].x,dy=arr[i-1].y;
return "C"+(item.x-(_12c-1)*(dx/_12c))+","+dy+" "+(item.x-(dx/_12c))+","+item.y+" "+item.x+","+item.y;
}else{
if(_12c=="X"||_12c=="x"||_12c=="S"){
var p0,p1=arr[i-1],p2=arr[i],p3;
var bz1x,bz1y,bz2x,bz2y;
var f=1/6;
if(i==1){
if(_12c=="x"){
p0=arr[arr.length-2];
}else{
p0=p1;
}
f=1/3;
}else{
p0=arr[i-2];
}
if(i==(arr.length-1)){
if(_12c=="x"){
p3=arr[1];
}else{
p3=p2;
}
f=1/3;
}else{
p3=arr[i+1];
}
var p1p2=Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
var p0p2=Math.sqrt((p2.x-p0.x)*(p2.x-p0.x)+(p2.y-p0.y)*(p2.y-p0.y));
var p1p3=Math.sqrt((p3.x-p1.x)*(p3.x-p1.x)+(p3.y-p1.y)*(p3.y-p1.y));
var _12d=p0p2*f;
var _12e=p1p3*f;
if(_12d>p1p2/2&&_12e>p1p2/2){
_12d=p1p2/2;
_12e=p1p2/2;
}else{
if(_12d>p1p2/2){
_12d=p1p2/2;
_12e=p1p2/2*p1p3/p0p2;
}else{
if(_12e>p1p2/2){
_12e=p1p2/2;
_12d=p1p2/2*p0p2/p1p3;
}
}
}
if(_12c=="S"){
if(p0==p1){
_12d=0;
}
if(p2==p3){
_12e=0;
}
}
bz1x=p1.x+_12d*(p2.x-p0.x)/p0p2;
bz1y=p1.y+_12d*(p2.y-p0.y)/p0p2;
bz2x=p2.x-_12e*(p3.x-p1.x)/p1p3;
bz2y=p2.y-_12e*(p3.y-p1.y)/p1p3;
}
}
return "C"+(bz1x+","+bz1y+" "+bz2x+","+bz2y+" "+p2.x+","+p2.y);
});
return p.join(" ");
},getLabel:function(_12f,_130,_131){
if(dojo.number){
return (_130?dojo.number.format(_12f,{places:_131}):dojo.number.format(_12f))||"";
}
return _130?_12f.toFixed(_131):_12f.toString();
}});
})();
}
if(!dojo._hasResource["dojox.charting.scaler.primitive"]){
dojo._hasResource["dojox.charting.scaler.primitive"]=true;
dojo.provide("dojox.charting.scaler.primitive");
dojox.charting.scaler.primitive={buildScaler:function(min,max,span,_132){
if(min==max){
min-=0.5;
max+=0.5;
}
return {bounds:{lower:min,upper:max,from:min,to:max,scale:span/(max-min),span:span},scaler:dojox.charting.scaler.primitive};
},buildTicks:function(_133,_134){
return {major:[],minor:[],micro:[]};
},getTransformerFromModel:function(_135){
var _136=_135.bounds.from,_137=_135.bounds.scale;
return function(x){
return (x-_136)*_137;
};
},getTransformerFromPlot:function(_138){
var _139=_138.bounds.from,_13a=_138.bounds.scale;
return function(x){
return x/_13a+_139;
};
}};
}
if(!dojo._hasResource["dojox.charting.plot2d._PlotEvents"]){
dojo._hasResource["dojox.charting.plot2d._PlotEvents"]=true;
dojo.provide("dojox.charting.plot2d._PlotEvents");
dojo.declare("dojox.charting.plot2d._PlotEvents",null,{constructor:function(){
this._shapeEvents=[];
this._eventSeries={};
},destroy:function(){
this.resetEvents();
this.inherited(arguments);
},plotEvent:function(o){
},raiseEvent:function(o){
this.plotEvent(o);
var t=dojo.delegate(o);
t.originalEvent=o.type;
t.originalPlot=o.plot;
t.type="onindirect";
dojo.forEach(this.chart.stack,function(plot){
if(plot!==this&&plot.plotEvent){
t.plot=plot;
plot.plotEvent(t);
}
},this);
},connect:function(_13b,_13c){
this.dirty=true;
return dojo.connect(this,"plotEvent",_13b,_13c);
},events:function(){
var ls=this.plotEvent._listeners;
if(!ls||!ls.length){
return false;
}
for(var i in ls){
if(!(i in Array.prototype)){
return true;
}
}
return false;
},resetEvents:function(){
if(this._shapeEvents.length){
dojo.forEach(this._shapeEvents,function(item){
item.shape.disconnect(item.handle);
});
this._shapeEvents=[];
}
this.raiseEvent({type:"onplotreset",plot:this});
},_connectSingleEvent:function(o,_13d){
this._shapeEvents.push({shape:o.eventMask,handle:o.eventMask.connect(_13d,this,function(e){
o.type=_13d;
o.event=e;
this.raiseEvent(o);
o.event=null;
})});
},_connectEvents:function(o){
if(o){
o.chart=this.chart;
o.plot=this;
o.hAxis=this.hAxis||null;
o.vAxis=this.vAxis||null;
o.eventMask=o.eventMask||o.shape;
this._connectSingleEvent(o,"onmouseover");
this._connectSingleEvent(o,"onmouseout");
this._connectSingleEvent(o,"onclick");
}
},_reconnectEvents:function(_13e){
var a=this._eventSeries[_13e];
if(a){
dojo.forEach(a,this._connectEvents,this);
}
},fireEvent:function(_13f,_140,_141,_142){
var s=this._eventSeries[_13f];
if(s&&s.length&&_141<s.length){
var o=s[_141];
o.type=_140;
o.event=_142||null;
this.raiseEvent(o);
o.event=null;
}
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Base"]){
dojo._hasResource["dojox.charting.plot2d.Base"]=true;
dojo.provide("dojox.charting.plot2d.Base");
dojo.declare("dojox.charting.plot2d.Base",[dojox.charting.Element,dojox.charting.plot2d._PlotEvents],{constructor:function(_143,_144){
this.zoom=null,this.zoomQueue=[];
this.lastWindow={vscale:1,hscale:1,xoffset:0,yoffset:0};
},clear:function(){
this.series=[];
this._hAxis=null;
this._vAxis=null;
this.dirty=true;
return this;
},setAxis:function(axis){
if(axis){
this[axis.vertical?"_vAxis":"_hAxis"]=axis;
}
return this;
},addSeries:function(run){
this.series.push(run);
return this;
},getSeriesStats:function(){
return dojox.charting.plot2d.common.collectSimpleStats(this.series);
},calculateAxes:function(dim){
this.initializeScalers(dim,this.getSeriesStats());
return this;
},isDirty:function(){
return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;
},isDataDirty:function(){
return dojo.some(this.series,function(item){
return item.dirty;
});
},performZoom:function(dim,_145){
var vs=this._vAxis.scale||1,hs=this._hAxis.scale||1,_146=dim.height-_145.b,_147=this._hScaler.bounds,_148=(_147.from-_147.lower)*_147.scale,_149=this._vScaler.bounds,_14a=(_149.from-_149.lower)*_149.scale;
rVScale=vs/this.lastWindow.vscale,rHScale=hs/this.lastWindow.hscale,rXOffset=(this.lastWindow.xoffset-_148)/((this.lastWindow.hscale==1)?hs:this.lastWindow.hscale),rYOffset=(_14a-this.lastWindow.yoffset)/((this.lastWindow.vscale==1)?vs:this.lastWindow.vscale),shape=this.group,anim=dojox.gfx.fx.animateTransform(dojo.delegate({shape:shape,duration:1200,transform:[{name:"translate",start:[0,0],end:[_145.l*(1-rHScale),_146*(1-rVScale)]},{name:"scale",start:[1,1],end:[rHScale,rVScale]},{name:"original"},{name:"translate",start:[0,0],end:[rXOffset,rYOffset]}]},this.zoom));
dojo.mixin(this.lastWindow,{vscale:vs,hscale:hs,xoffset:_148,yoffset:_14a});
this.zoomQueue.push(anim);
dojo.connect(anim,"onEnd",this,function(){
this.zoom=null;
this.zoomQueue.shift();
if(this.zoomQueue.length>0){
this.zoomQueue[0].play();
}
});
if(this.zoomQueue.length==1){
this.zoomQueue[0].play();
}
return this;
},render:function(dim,_14b){
return this;
},getRequiredColors:function(){
return this.series.length;
},initializeScalers:function(dim,_14c){
if(this._hAxis){
if(!this._hAxis.initialized()){
this._hAxis.calculate(_14c.hmin,_14c.hmax,dim.width);
}
this._hScaler=this._hAxis.getScaler();
}else{
this._hScaler=dojox.charting.scaler.primitive.buildScaler(_14c.hmin,_14c.hmax,dim.width);
}
if(this._vAxis){
if(!this._vAxis.initialized()){
this._vAxis.calculate(_14c.vmin,_14c.vmax,dim.height);
}
this._vScaler=this._vAxis.getScaler();
}else{
this._vScaler=dojox.charting.scaler.primitive.buildScaler(_14c.vmin,_14c.vmax,dim.height);
}
return this;
}});
}
if(!dojo._hasResource["dojox.lang.functional.reversed"]){
dojo._hasResource["dojox.lang.functional.reversed"]=true;
dojo.provide("dojox.lang.functional.reversed");
(function(){
var d=dojo,df=dojox.lang.functional;
d.mixin(df,{filterRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t=[],v,i=a.length-1;
for(;i>=0;--i){
v=a[i];
if(f.call(o,v,i,a)){
t.push(v);
}
}
return t;
},forEachRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;f.call(o,a[i],i,a),--i){
}
},mapRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n),i=n-1,j=0;
for(;i>=0;t[j++]=f.call(o,a[i],i,a),--i){
}
return t;
},everyRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;--i){
if(!f.call(o,a[i],i,a)){
return false;
}
}
return true;
},someRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;--i){
if(f.call(o,a[i],i,a)){
return true;
}
}
return false;
}});
})();
}
if(!dojo._hasResource["dojox.gfx.fx"]){
dojo._hasResource["dojox.gfx.fx"]=true;
dojo.provide("dojox.gfx.fx");
(function(){
var d=dojo,g=dojox.gfx,m=g.matrix;
function _14d(_14e,end){
this.start=_14e,this.end=end;
};
_14d.prototype.getValue=function(r){
return (this.end-this.start)*r+this.start;
};
function _14f(_150,end,_151){
this.start=_150,this.end=end;
this.units=_151;
};
_14f.prototype.getValue=function(r){
return (this.end-this.start)*r+this.start+this.units;
};
function _152(_153,end){
this.start=_153,this.end=end;
this.temp=new dojo.Color();
};
_152.prototype.getValue=function(r){
return d.blendColors(this.start,this.end,r,this.temp);
};
function _154(_155){
this.values=_155;
this.length=_155.length;
};
_154.prototype.getValue=function(r){
return this.values[Math.min(Math.floor(r*this.length),this.length-1)];
};
function _156(_157,def){
this.values=_157;
this.def=def?def:{};
};
_156.prototype.getValue=function(r){
var ret=dojo.clone(this.def);
for(var i in this.values){
ret[i]=this.values[i].getValue(r);
}
return ret;
};
function _158(_159,_15a){
this.stack=_159;
this.original=_15a;
};
_158.prototype.getValue=function(r){
var ret=[];
dojo.forEach(this.stack,function(t){
if(t instanceof m.Matrix2D){
ret.push(t);
return;
}
if(t.name=="original"&&this.original){
ret.push(this.original);
return;
}
if(!(t.name in m)){
return;
}
var f=m[t.name];
if(typeof f!="function"){
ret.push(f);
return;
}
var val=dojo.map(t.start,function(v,i){
return (t.end[i]-v)*r+v;
}),_15b=f.apply(m,val);
if(_15b instanceof m.Matrix2D){
ret.push(_15b);
}
},this);
return ret;
};
var _15c=new d.Color(0,0,0,0);
function _15d(prop,obj,name,def){
if(prop.values){
return new _154(prop.values);
}
var _15e,_15f,end;
if(prop.start){
_15f=g.normalizeColor(prop.start);
}else{
_15f=_15e=obj?(name?obj[name]:obj):def;
}
if(prop.end){
end=g.normalizeColor(prop.end);
}else{
if(!_15e){
_15e=obj?(name?obj[name]:obj):def;
}
end=_15e;
}
return new _152(_15f,end);
};
function _160(prop,obj,name,def){
if(prop.values){
return new _154(prop.values);
}
var _161,_162,end;
if(prop.start){
_162=prop.start;
}else{
_162=_161=obj?obj[name]:def;
}
if(prop.end){
end=prop.end;
}else{
if(typeof _161!="number"){
_161=obj?obj[name]:def;
}
end=_161;
}
return new _14d(_162,end);
};
g.fx.animateStroke=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d.Animation(args),_163=args.shape,_164;
d.connect(anim,"beforeBegin",anim,function(){
_164=_163.getStroke();
var prop=args.color,_165={},_166,_167,end;
if(prop){
_165.color=_15d(prop,_164,"color",_15c);
}
prop=args.style;
if(prop&&prop.values){
_165.style=new _154(prop.values);
}
prop=args.width;
if(prop){
_165.width=_160(prop,_164,"width",1);
}
prop=args.cap;
if(prop&&prop.values){
_165.cap=new _154(prop.values);
}
prop=args.join;
if(prop){
if(prop.values){
_165.join=new _154(prop.values);
}else{
_167=prop.start?prop.start:(_164&&_164.join||0);
end=prop.end?prop.end:(_164&&_164.join||0);
if(typeof _167=="number"&&typeof end=="number"){
_165.join=new _14d(_167,end);
}
}
}
this.curve=new _156(_165,_164);
});
d.connect(anim,"onAnimate",_163,"setStroke");
return anim;
};
g.fx.animateFill=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d.Animation(args),_168=args.shape,fill;
d.connect(anim,"beforeBegin",anim,function(){
fill=_168.getFill();
var prop=args.color,_169={};
if(prop){
this.curve=_15d(prop,fill,"",_15c);
}
});
d.connect(anim,"onAnimate",_168,"setFill");
return anim;
};
g.fx.animateFont=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d.Animation(args),_16a=args.shape,font;
d.connect(anim,"beforeBegin",anim,function(){
font=_16a.getFont();
var prop=args.style,_16b={},_16c,_16d,end;
if(prop&&prop.values){
_16b.style=new _154(prop.values);
}
prop=args.variant;
if(prop&&prop.values){
_16b.variant=new _154(prop.values);
}
prop=args.weight;
if(prop&&prop.values){
_16b.weight=new _154(prop.values);
}
prop=args.family;
if(prop&&prop.values){
_16b.family=new _154(prop.values);
}
prop=args.size;
if(prop&&prop.units){
_16d=parseFloat(prop.start?prop.start:(_16a.font&&_16a.font.size||"0"));
end=parseFloat(prop.end?prop.end:(_16a.font&&_16a.font.size||"0"));
_16b.size=new _14f(_16d,end,prop.units);
}
this.curve=new _156(_16b,font);
});
d.connect(anim,"onAnimate",_16a,"setFont");
return anim;
};
g.fx.animateTransform=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d.Animation(args),_16e=args.shape,_16f;
d.connect(anim,"beforeBegin",anim,function(){
_16f=_16e.getTransform();
this.curve=new _158(args.transform,_16f);
});
d.connect(anim,"onAnimate",_16e,"setTransform");
return anim;
};
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Default"]){
dojo._hasResource["dojox.charting.plot2d.Default"]=true;
dojo.provide("dojox.charting.plot2d.Default");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_170=df.lambda("item.purgeGroup()");
var _171=1200;
dojo.declare("dojox.charting.plot2d.Default",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",lines:true,areas:false,markers:false,tension:"",animate:false},optionalParams:{stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:"",markerStroke:{},markerOutline:{},markerShadow:{},markerFill:{},markerFont:"",markerFontColor:""},constructor:function(_172,_173){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_173);
du.updateWithPattern(this.opt,_173,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},render:function(dim,_174){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_174);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_170);
this._eventSeries={};
this.cleanGroup();
this.group.setTransform(null);
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_175,_176,_177,_178=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
if(!run.data.length){
run.dirty=false;
t.skip();
continue;
}
var _179=t.next(this.opt.areas?"area":"line",[this.opt,run],true),s=run.group,_17a=[],_17b=[],rseg=null,_17c,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_17d=this._eventSeries[run.name]=new Array(run.data.length);
for(var j=0;j<run.data.length;j++){
if(run.data[j]!=null){
if(!rseg){
rseg=[];
_17b.push(j);
_17a.push(rseg);
}
rseg.push(run.data[j]);
}else{
rseg=null;
}
}
for(var seg=0;seg<_17a.length;seg++){
if(typeof _17a[seg][0]=="number"){
_17c=dojo.map(_17a[seg],function(v,i){
return {x:ht(i+_17b[seg]+1)+_174.l,y:dim.height-_174.b-vt(v)};
},this);
}else{
_17c=dojo.map(_17a[seg],function(v,i){
return {x:ht(v.x)+_174.l,y:dim.height-_174.b-vt(v.y)};
},this);
}
var _17e=this.opt.tension?dc.curve(_17c,this.opt.tension):"";
if(this.opt.areas&&_17c.length>1){
var fill=_179.series.fill;
var _17f=dojo.clone(_17c);
if(this.opt.tension){
var _180="L"+_17f[_17f.length-1].x+","+(dim.height-_174.b)+" L"+_17f[0].x+","+(dim.height-_174.b)+" L"+_17f[0].x+","+_17f[0].y;
run.dyn.fill=s.createPath(_17e+" "+_180).setFill(fill).getFill();
}else{
_17f.push({x:_17c[_17c.length-1].x,y:dim.height-_174.b});
_17f.push({x:_17c[0].x,y:dim.height-_174.b});
_17f.push(_17c[0]);
run.dyn.fill=s.createPolyline(_17f).setFill(fill).getFill();
}
}
if(this.opt.lines||this.opt.markers){
_175=_179.series.stroke;
if(_179.series.outline){
_176=run.dyn.outline=dc.makeStroke(_179.series.outline);
_176.width=2*_176.width+_175.width;
}
}
if(this.opt.markers){
run.dyn.marker=_179.symbol;
}
var _181=null,_182=null,_183=null;
if(_175&&_179.series.shadow&&_17c.length>1){
var _184=_179.series.shadow,_185=dojo.map(_17c,function(c){
return {x:c.x+_184.dx,y:c.y+_184.dy};
});
if(this.opt.lines){
if(this.opt.tension){
run.dyn.shadow=s.createPath(dc.curve(_185,this.opt.tension)).setStroke(_184).getStroke();
}else{
run.dyn.shadow=s.createPolyline(_185).setStroke(_184).getStroke();
}
}
if(this.opt.markers&&_179.marker.shadow){
_184=_179.marker.shadow;
_183=dojo.map(_185,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_179.symbol).setStroke(_184).setFill(_184.color);
},this);
}
}
if(this.opt.lines&&_17c.length>1){
if(_176){
if(this.opt.tension){
run.dyn.outline=s.createPath(_17e).setStroke(_176).getStroke();
}else{
run.dyn.outline=s.createPolyline(_17c).setStroke(_176).getStroke();
}
}
if(this.opt.tension){
run.dyn.stroke=s.createPath(_17e).setStroke(_175).getStroke();
}else{
run.dyn.stroke=s.createPolyline(_17c).setStroke(_175).getStroke();
}
}
if(this.opt.markers){
_181=new Array(_17c.length);
_182=new Array(_17c.length);
_176=null;
if(_179.marker.outline){
_176=dc.makeStroke(_179.marker.outline);
_176.width=2*_176.width+(_179.marker.stroke?_179.marker.stroke.width:0);
}
dojo.forEach(_17c,function(c,i){
var path="M"+c.x+" "+c.y+" "+_179.symbol;
if(_176){
_182[i]=s.createPath(path).setStroke(_176);
}
_181[i]=s.createPath(path).setStroke(_179.marker.stroke).setFill(_179.marker.fill);
},this);
run.dyn.markerFill=_179.marker.fill;
run.dyn.markerStroke=_179.marker.stroke;
if(_178){
dojo.forEach(_181,function(s,i){
var o={element:"marker",index:i+_17b[seg],run:run,shape:s,outline:_182[i]||null,shadow:_183&&_183[i]||null,cx:_17c[i].x,cy:_17c[i].y};
if(typeof _17a[seg][0]=="number"){
o.x=i+_17b[seg]+1;
o.y=_17a[seg][i];
}else{
o.x=_17a[seg][i].x;
o.y=_17a[seg][i].y;
}
this._connectEvents(o);
_17d[i+_17b[seg]]=o;
},this);
}else{
delete this._eventSeries[run.name];
}
}
}
run.dirty=false;
}
if(this.animate){
var _186=this.group;
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_186,duration:_171,transform:[{name:"translate",start:[0,dim.height-_174.b],end:[0,0]},{name:"scale",start:[1,0],end:[1,1]},{name:"original"}]},this.animate)).play();
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Lines"]){
dojo._hasResource["dojox.charting.plot2d.Lines"]=true;
dojo.provide("dojox.charting.plot2d.Lines");
dojo.declare("dojox.charting.plot2d.Lines",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Areas"]){
dojo._hasResource["dojox.charting.plot2d.Areas"]=true;
dojo.provide("dojox.charting.plot2d.Areas");
dojo.declare("dojox.charting.plot2d.Areas",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=true;
this.opt.areas=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Markers"]){
dojo._hasResource["dojox.charting.plot2d.Markers"]=true;
dojo.provide("dojox.charting.plot2d.Markers");
dojo.declare("dojox.charting.plot2d.Markers",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.markers=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.MarkersOnly"]){
dojo._hasResource["dojox.charting.plot2d.MarkersOnly"]=true;
dojo.provide("dojox.charting.plot2d.MarkersOnly");
dojo.declare("dojox.charting.plot2d.MarkersOnly",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=false;
this.opt.markers=true;
}});
}
if(!dojo._hasResource["dojox.gfx.gradutils"]){
dojo._hasResource["dojox.gfx.gradutils"]=true;
dojo.provide("dojox.gfx.gradutils");
(function(){
var d=dojo,m=dojox.gfx.matrix,C=d.Color;
function _187(o,c){
if(o<=0){
return c[0].color;
}
var len=c.length;
if(o>=1){
return c[len-1].color;
}
for(var i=0;i<len;++i){
var stop=c[i];
if(stop.offset>=o){
if(i){
var prev=c[i-1];
return d.blendColors(new C(prev.color),new C(stop.color),(o-prev.offset)/(stop.offset-prev.offset));
}
return stop.color;
}
}
return c[len-1].color;
};
dojox.gfx.gradutils.getColor=function(fill,pt){
var o;
if(fill){
switch(fill.type){
case "linear":
var _188=Math.atan2(fill.y2-fill.y1,fill.x2-fill.x1),_189=m.rotate(-_188),_18a=m.project(fill.x2-fill.x1,fill.y2-fill.y1),p=m.multiplyPoint(_18a,pt),pf1=m.multiplyPoint(_18a,fill.x1,fill.y1),pf2=m.multiplyPoint(_18a,fill.x2,fill.y2),_18b=m.multiplyPoint(_189,pf2.x-pf1.x,pf2.y-pf1.y).x,o=m.multiplyPoint(_189,p.x-pf1.x,p.y-pf1.y).x/_18b;
break;
case "radial":
var dx=pt.x-fill.cx,dy=pt.y-fill.cy,o=Math.sqrt(dx*dx+dy*dy)/fill.r;
break;
}
return _187(o,fill.colors);
}
return new C(fill||[0,0,0,0]);
};
dojox.gfx.gradutils.reverse=function(fill){
if(fill){
switch(fill.type){
case "linear":
case "radial":
fill=dojo.delegate(fill);
if(fill.colors){
var c=fill.colors,l=c.length,i=0,stop,n=fill.colors=new Array(c.length);
for(;i<l;++i){
stop=c[i];
n[i]={offset:1-stop.offset,color:stop.color};
}
n.sort(function(a,b){
return a.offset-b.offset;
});
}
break;
}
}
return fill;
};
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Scatter"]){
dojo._hasResource["dojox.charting.plot2d.Scatter"]=true;
dojo.provide("dojox.charting.plot2d.Scatter");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_18c=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Scatter",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",shadows:null,animate:null},optionalParams:{markerStroke:{},markerOutline:{},markerShadow:{},markerFill:{},markerFont:"",markerFontColor:""},constructor:function(_18d,_18e){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_18e);
du.updateWithPattern(this.opt,_18e,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},render:function(dim,_18f){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_18f);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_18c);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_190=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
if(!run.data.length){
run.dirty=false;
t.skip();
continue;
}
var _191=t.next("marker",[this.opt,run]),s=run.group,_192,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
if(typeof run.data[0]=="number"){
_192=dojo.map(run.data,function(v,i){
return {x:ht(i+1)+_18f.l,y:dim.height-_18f.b-vt(v)};
},this);
}else{
_192=dojo.map(run.data,function(v,i){
return {x:ht(v.x)+_18f.l,y:dim.height-_18f.b-vt(v.y)};
},this);
}
var _193=new Array(_192.length),_194=new Array(_192.length),_195=new Array(_192.length);
dojo.forEach(_192,function(c,i){
var _196=typeof run.data[i]=="number"?t.post(_191,"marker"):t.addMixin(_191,"marker",run.data[i],true),path="M"+c.x+" "+c.y+" "+_196.symbol;
if(_196.marker.shadow){
_193[i]=s.createPath("M"+(c.x+_196.marker.shadow.dx)+" "+(c.y+_196.marker.shadow.dy)+" "+_196.symbol).setStroke(_196.marker.shadow).setFill(_196.marker.shadow.color);
if(this.animate){
this._animateScatter(_193[i],dim.height-_18f.b);
}
}
if(_196.marker.outline){
var _197=dc.makeStroke(_196.marker.outline);
_197.width=2*_197.width+_196.marker.stroke.width;
_195[i]=s.createPath(path).setStroke(_197);
if(this.animate){
this._animateScatter(_195[i],dim.height-_18f.b);
}
}
var _198=dc.makeStroke(_196.marker.stroke),fill=this._plotFill(_196.marker.fill,dim,_18f);
if(fill&&(fill.type==="linear"||fill.type=="radial")){
var _199=dojox.gfx.gradutils.getColor(fill,{x:c.x,y:c.y});
if(_198){
_198.color=_199;
}
_194[i]=s.createPath(path).setStroke(_198).setFill(_199);
}else{
_194[i]=s.createPath(path).setStroke(_198).setFill(fill);
}
if(this.animate){
this._animateScatter(_194[i],dim.height-_18f.b);
}
},this);
if(_194.length){
run.dyn.stroke=_194[_194.length-1].getStroke();
run.dyn.fill=_194[_194.length-1].getFill();
}
if(_190){
var _19a=new Array(_194.length);
dojo.forEach(_194,function(s,i){
var o={element:"marker",index:i,run:run,shape:s,outline:_195&&_195[i]||null,shadow:_193&&_193[i]||null,cx:_192[i].x,cy:_192[i].y};
if(typeof run.data[0]=="number"){
o.x=i+1;
o.y=run.data[i];
}else{
o.x=run.data[i].x;
o.y=run.data[i].y;
}
this._connectEvents(o);
_19a[i]=o;
},this);
this._eventSeries[run.name]=_19a;
}else{
delete this._eventSeries[run.name];
}
run.dirty=false;
}
this.dirty=false;
return this;
},_animateScatter:function(_19b,_19c){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_19b,duration:1200,transform:[{name:"translate",start:[0,_19c],end:[0,0]},{name:"scale",start:[0,0],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.sequence"]){
dojo._hasResource["dojox.lang.functional.sequence"]=true;
dojo.provide("dojox.lang.functional.sequence");
(function(){
var d=dojo,df=dojox.lang.functional;
d.mixin(df,{repeat:function(n,f,z,o){
o=o||d.global;
f=df.lambda(f);
var t=new Array(n),i=1;
t[0]=z;
for(;i<n;t[i]=z=f.call(o,z),++i){
}
return t;
},until:function(pr,f,z,o){
o=o||d.global;
f=df.lambda(f);
pr=df.lambda(pr);
var t=[];
for(;!pr.call(o,z);t.push(z),z=f.call(o,z)){
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Stacked"]){
dojo._hasResource["dojox.charting.plot2d.Stacked"]=true;
dojo.provide("dojox.charting.plot2d.Stacked");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_19d=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Stacked",dojox.charting.plot2d.Default,{getSeriesStats:function(){
var _19e=dc.collectStackedStats(this.series);
this._maxRunLength=_19e.hmax;
return _19e;
},render:function(dim,_19f){
if(this._maxRunLength<=0){
return this;
}
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(v!==null){
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
}
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_19f);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_19d);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_1a0=this.events(),ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1a1=t.next(this.opt.areas?"area":"line",[this.opt,run],true),s=run.group,_1a2,_1a3=dojo.map(acc,function(v,i){
return {x:ht(i+1)+_19f.l,y:dim.height-_19f.b-vt(v)};
},this);
var _1a4=this.opt.tension?dc.curve(_1a3,this.opt.tension):"";
if(this.opt.areas){
var _1a5=dojo.clone(_1a3);
if(this.opt.tension){
var p=dc.curve(_1a5,this.opt.tension);
p+=" L"+_1a3[_1a3.length-1].x+","+(dim.height-_19f.b)+" L"+_1a3[0].x+","+(dim.height-_19f.b)+" L"+_1a3[0].x+","+_1a3[0].y;
run.dyn.fill=s.createPath(p).setFill(_1a1.series.fill).getFill();
}else{
_1a5.push({x:_1a3[_1a3.length-1].x,y:dim.height-_19f.b});
_1a5.push({x:_1a3[0].x,y:dim.height-_19f.b});
_1a5.push(_1a3[0]);
run.dyn.fill=s.createPolyline(_1a5).setFill(_1a1.series.fill).getFill();
}
}
if(this.opt.lines||this.opt.markers){
if(_1a1.series.outline){
_1a2=dc.makeStroke(_1a1.series.outline);
_1a2.width=2*_1a2.width+_1a1.series.stroke.width;
}
}
if(this.opt.markers){
run.dyn.marker=_1a1.symbol;
}
var _1a6,_1a7,_1a8;
if(_1a1.series.shadow&&_1a1.series.stroke){
var _1a9=_1a1.series.shadow,_1aa=dojo.map(_1a3,function(c){
return {x:c.x+_1a9.dx,y:c.y+_1a9.dy};
});
if(this.opt.lines){
if(this.opt.tension){
run.dyn.shadow=s.createPath(dc.curve(_1aa,this.opt.tension)).setStroke(_1a9).getStroke();
}else{
run.dyn.shadow=s.createPolyline(_1aa).setStroke(_1a9).getStroke();
}
}
if(this.opt.markers){
_1a9=_1a1.marker.shadow;
_1a8=dojo.map(_1aa,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_1a1.symbol).setStroke(_1a9).setFill(_1a9.color);
},this);
}
}
if(this.opt.lines){
if(_1a2){
if(this.opt.tension){
run.dyn.outline=s.createPath(_1a4).setStroke(_1a2).getStroke();
}else{
run.dyn.outline=s.createPolyline(_1a3).setStroke(_1a2).getStroke();
}
}
if(this.opt.tension){
run.dyn.stroke=s.createPath(_1a4).setStroke(_1a1.series.stroke).getStroke();
}else{
run.dyn.stroke=s.createPolyline(_1a3).setStroke(_1a1.series.stroke).getStroke();
}
}
if(this.opt.markers){
_1a6=new Array(_1a3.length);
_1a7=new Array(_1a3.length);
_1a2=null;
if(_1a1.marker.outline){
_1a2=dc.makeStroke(_1a1.marker.outline);
_1a2.width=2*_1a2.width+(_1a1.marker.stroke?_1a1.marker.stroke.width:0);
}
dojo.forEach(_1a3,function(c,i){
var path="M"+c.x+" "+c.y+" "+_1a1.symbol;
if(_1a2){
_1a7[i]=s.createPath(path).setStroke(_1a2);
}
_1a6[i]=s.createPath(path).setStroke(_1a1.marker.stroke).setFill(_1a1.marker.fill);
},this);
if(_1a0){
var _1ab=new Array(_1a6.length);
dojo.forEach(_1a6,function(s,i){
var o={element:"marker",index:i,run:run,shape:s,outline:_1a7[i]||null,shadow:_1a8&&_1a8[i]||null,cx:_1a3[i].x,cy:_1a3[i].y,x:i+1,y:run.data[i]};
this._connectEvents(o);
_1ab[i]=o;
},this);
this._eventSeries[run.name]=_1ab;
}else{
delete this._eventSeries[run.name];
}
}
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(v!==null){
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedLines"]){
dojo._hasResource["dojox.charting.plot2d.StackedLines"]=true;
dojo.provide("dojox.charting.plot2d.StackedLines");
dojo.declare("dojox.charting.plot2d.StackedLines",dojox.charting.plot2d.Stacked,{constructor:function(){
this.opt.lines=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedAreas"]){
dojo._hasResource["dojox.charting.plot2d.StackedAreas"]=true;
dojo.provide("dojox.charting.plot2d.StackedAreas");
dojo.declare("dojox.charting.plot2d.StackedAreas",dojox.charting.plot2d.Stacked,{constructor:function(){
this.opt.lines=true;
this.opt.areas=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Columns"]){
dojo._hasResource["dojox.charting.plot2d.Columns"]=true;
dojo.provide("dojox.charting.plot2d.Columns");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1ac=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Columns",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:0,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_1ad,_1ae){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_1ae);
du.updateWithPattern(this.opt,_1ae,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},getSeriesStats:function(){
var _1af=dc.collectSimpleStats(this.series);
_1af.hmin-=0.5;
_1af.hmax+=0.5;
return _1af;
},render:function(dim,_1b0){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1b0);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1ac);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1b1,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1b2=Math.max(0,this._vScaler.bounds.lower),_1b3=vt(_1b2),_1b4=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
gap=f.gap;
_1b1=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1b5=t.next("column",[this.opt,run]),s=run.group,_1b6=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var _1b7=run.data[j];
if(_1b7!==null){
var v=typeof _1b7=="number"?_1b7:_1b7.y,vv=vt(v),_1b8=vv-_1b3,h=Math.abs(_1b8),_1b9=typeof _1b7!="number"?t.addMixin(_1b5,"column",_1b7,true):t.post(_1b5,"column");
if(_1b1>=1&&h>=1){
var rect={x:_1b0.l+ht(j+0.5)+gap,y:dim.height-_1b0.b-(v>_1b2?vv:_1b3),width:_1b1,height:h};
var _1ba=this._plotFill(_1b9.series.fill,dim,_1b0);
_1ba=this._shapeFill(_1ba,rect);
var _1bb=s.createRect(rect).setFill(_1ba).setStroke(_1b9.series.stroke);
run.dyn.fill=_1bb.getFill();
run.dyn.stroke=_1bb.getStroke();
if(_1b4){
var o={element:"column",index:j,run:run,shape:_1bb,x:j+0.5,y:v};
this._connectEvents(o);
_1b6[j]=o;
}
if(this.animate){
this._animateColumn(_1bb,dim.height-_1b0.b-_1b3,h);
}
}
}
}
this._eventSeries[run.name]=_1b6;
run.dirty=false;
}
this.dirty=false;
return this;
},_animateColumn:function(_1bc,_1bd,_1be){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1bc,duration:1200,transform:[{name:"translate",start:[0,_1bd-(_1bd/_1be)],end:[0,0]},{name:"scale",start:[1,1/_1be],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedColumns"]){
dojo._hasResource["dojox.charting.plot2d.StackedColumns"]=true;
dojo.provide("dojox.charting.plot2d.StackedColumns");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1bf=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedColumns",dojox.charting.plot2d.Columns,{getSeriesStats:function(){
var _1c0=dc.collectStackedStats(this.series);
this._maxRunLength=_1c0.hmax;
_1c0.hmin-=0.5;
_1c0.hmax+=0.5;
return _1c0;
},render:function(dim,_1c1){
if(this._maxRunLength<=0){
return this;
}
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var _1c2=run.data[j];
if(_1c2!==null){
var v=typeof _1c2=="number"?_1c2:_1c2.y;
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
}
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1c1);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1bf);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1c3,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1c4=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
gap=f.gap;
_1c3=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1c5=t.next("column",[this.opt,run]),s=run.group,_1c6=new Array(acc.length);
for(var j=0;j<acc.length;++j){
var _1c2=run.data[j];
if(_1c2!==null){
var v=acc[j],_1c7=vt(v),_1c8=typeof _1c2!="number"?t.addMixin(_1c5,"column",_1c2,true):t.post(_1c5,"column");
if(_1c3>=1&&_1c7>=1){
var rect={x:_1c1.l+ht(j+0.5)+gap,y:dim.height-_1c1.b-vt(v),width:_1c3,height:_1c7};
var _1c9=this._plotFill(_1c8.series.fill,dim,_1c1);
_1c9=this._shapeFill(_1c9,rect);
var _1ca=s.createRect(rect).setFill(_1c9).setStroke(_1c8.series.stroke);
run.dyn.fill=_1ca.getFill();
run.dyn.stroke=_1ca.getStroke();
if(_1c4){
var o={element:"column",index:j,run:run,shape:_1ca,x:j+0.5,y:v};
this._connectEvents(o);
_1c6[j]=o;
}
if(this.animate){
this._animateColumn(_1ca,dim.height-_1c1.b,_1c7);
}
}
}
}
this._eventSeries[run.name]=_1c6;
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var _1c2=run.data[j];
if(_1c2!==null){
var v=typeof _1c2=="number"?_1c2:_1c2.y;
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.ClusteredColumns"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredColumns"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredColumns");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1cb=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredColumns",dojox.charting.plot2d.Columns,{render:function(dim,_1cc){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1cc);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1cb);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1cd,_1ce,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1cf=Math.max(0,this._vScaler.bounds.lower),_1d0=vt(_1cf),_1d1=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt,this.series.length);
gap=f.gap;
_1cd=_1ce=f.size;
for(var i=0;i<this.series.length;++i){
var run=this.series[i],_1d2=_1ce*i;
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1d3=t.next("column",[this.opt,run]),s=run.group,_1d4=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var _1d5=run.data[j];
if(_1d5!==null){
var v=typeof _1d5=="number"?_1d5:_1d5.y,vv=vt(v),_1d6=vv-_1d0,h=Math.abs(_1d6),_1d7=typeof _1d5!="number"?t.addMixin(_1d3,"column",_1d5,true):t.post(_1d3,"column");
if(_1cd>=1&&h>=1){
var rect={x:_1cc.l+ht(j+0.5)+gap+_1d2,y:dim.height-_1cc.b-(v>_1cf?vv:_1d0),width:_1cd,height:h};
var _1d8=this._plotFill(_1d7.series.fill,dim,_1cc);
_1d8=this._shapeFill(_1d8,rect);
var _1d9=s.createRect(rect).setFill(_1d8).setStroke(_1d7.series.stroke);
run.dyn.fill=_1d9.getFill();
run.dyn.stroke=_1d9.getStroke();
if(_1d1){
var o={element:"column",index:j,run:run,shape:_1d9,x:j+0.5,y:v};
this._connectEvents(o);
_1d4[j]=o;
}
if(this.animate){
this._animateColumn(_1d9,dim.height-_1cc.b-_1d0,h);
}
}
}
}
this._eventSeries[run.name]=_1d4;
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Bars"]){
dojo._hasResource["dojox.charting.plot2d.Bars"]=true;
dojo.provide("dojox.charting.plot2d.Bars");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1da=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Bars",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:0,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_1db,_1dc){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_1dc);
du.updateWithPattern(this.opt,_1dc,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},getSeriesStats:function(){
var _1dd=dc.collectSimpleStats(this.series),t;
_1dd.hmin-=0.5;
_1dd.hmax+=0.5;
t=_1dd.hmin,_1dd.hmin=_1dd.vmin,_1dd.vmin=t;
t=_1dd.hmax,_1dd.hmax=_1dd.vmax,_1dd.vmax=t;
return _1dd;
},render:function(dim,_1de){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1de);
}
this.dirty=this.isDirty();
this.resetEvents();
if(this.dirty){
dojo.forEach(this.series,_1da);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1df,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1e0=Math.max(0,this._hScaler.bounds.lower),_1e1=ht(_1e0),_1e2=this.events();
f=dc.calculateBarSize(this._vScaler.bounds.scale,this.opt);
gap=f.gap;
_1df=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1e3=t.next("bar",[this.opt,run]),s=run.group,_1e4=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var _1e5=run.data[j];
if(_1e5!==null){
var v=typeof _1e5=="number"?_1e5:_1e5.y,hv=ht(v),_1e6=hv-_1e1,w=Math.abs(_1e6),_1e7=typeof _1e5!="number"?t.addMixin(_1e3,"bar",_1e5,true):t.post(_1e3,"bar");
if(w>=1&&_1df>=1){
var rect={x:_1de.l+(v<_1e0?hv:_1e1),y:dim.height-_1de.b-vt(j+1.5)+gap,width:w,height:_1df};
var _1e8=this._plotFill(_1e7.series.fill,dim,_1de);
_1e8=this._shapeFill(_1e8,rect);
var _1e9=s.createRect(rect).setFill(_1e8).setStroke(_1e7.series.stroke);
run.dyn.fill=_1e9.getFill();
run.dyn.stroke=_1e9.getStroke();
if(_1e2){
var o={element:"bar",index:j,run:run,shape:_1e9,x:v,y:j+1.5};
this._connectEvents(o);
_1e4[j]=o;
}
if(this.animate){
this._animateBar(_1e9,_1de.l+_1e1,-w);
}
}
}
}
this._eventSeries[run.name]=_1e4;
run.dirty=false;
}
this.dirty=false;
return this;
},_animateBar:function(_1ea,_1eb,_1ec){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1ea,duration:1200,transform:[{name:"translate",start:[_1eb-(_1eb/_1ec),0],end:[0,0]},{name:"scale",start:[1/_1ec,1],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedBars"]){
dojo._hasResource["dojox.charting.plot2d.StackedBars"]=true;
dojo.provide("dojox.charting.plot2d.StackedBars");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1ed=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedBars",dojox.charting.plot2d.Bars,{getSeriesStats:function(){
var _1ee=dc.collectStackedStats(this.series),t;
this._maxRunLength=_1ee.hmax;
_1ee.hmin-=0.5;
_1ee.hmax+=0.5;
t=_1ee.hmin,_1ee.hmin=_1ee.vmin,_1ee.vmin=t;
t=_1ee.hmax,_1ee.hmax=_1ee.vmax,_1ee.vmax=t;
return _1ee;
},render:function(dim,_1ef){
if(this._maxRunLength<=0){
return this;
}
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var _1f0=run.data[j];
if(_1f0!==null){
var v=typeof _1f0=="number"?_1f0:_1f0.y;
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
}
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1ef);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1ed);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1f1,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1f2=this.events();
f=dc.calculateBarSize(this._vScaler.bounds.scale,this.opt);
gap=f.gap;
_1f1=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _1f3=t.next("bar",[this.opt,run]),s=run.group,_1f4=new Array(acc.length);
for(var j=0;j<acc.length;++j){
var _1f0=run.data[j];
if(_1f0!==null){
var v=acc[j],_1f5=ht(v),_1f6=typeof _1f0!="number"?t.addMixin(_1f3,"bar",_1f0,true):t.post(_1f3,"bar");
if(_1f5>=1&&_1f1>=1){
var rect={x:_1ef.l,y:dim.height-_1ef.b-vt(j+1.5)+gap,width:_1f5,height:_1f1};
var _1f7=this._plotFill(_1f6.series.fill,dim,_1ef);
_1f7=this._shapeFill(_1f7,rect);
var _1f8=s.createRect(rect).setFill(_1f7).setStroke(_1f6.series.stroke);
run.dyn.fill=_1f8.getFill();
run.dyn.stroke=_1f8.getStroke();
if(_1f2){
var o={element:"bar",index:j,run:run,shape:_1f8,x:v,y:j+1.5};
this._connectEvents(o);
_1f4[j]=o;
}
if(this.animate){
this._animateBar(_1f8,_1ef.l,-_1f5);
}
}
}
}
this._eventSeries[run.name]=_1f4;
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var _1f0=run.data[j];
if(_1f0!==null){
var v=typeof _1f0=="number"?_1f0:_1f0.y;
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredBars");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1f9=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredBars",dojox.charting.plot2d.Bars,{render:function(dim,_1fa){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_1fa);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1f9);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_1fb,_1fc,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_1fd=Math.max(0,this._hScaler.bounds.lower),_1fe=ht(_1fd),_1ff=this.events();
f=dc.calculateBarSize(this._vScaler.bounds.scale,this.opt,this.series.length);
gap=f.gap;
_1fb=_1fc=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i],_200=_1fc*(this.series.length-i-1);
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _201=t.next("bar",[this.opt,run]),s=run.group,_202=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var _203=run.data[j];
if(_203!==null){
var v=typeof _203=="number"?_203:_203.y,hv=ht(v),_204=hv-_1fe,w=Math.abs(_204),_205=typeof _203!="number"?t.addMixin(_201,"bar",_203,true):t.post(_201,"bar");
if(w>=1&&_1fb>=1){
var rect={x:_1fa.l+(v<_1fd?hv:_1fe),y:dim.height-_1fa.b-vt(j+1.5)+gap+_200,width:w,height:_1fb};
var _206=this._plotFill(_205.series.fill,dim,_1fa);
_206=this._shapeFill(_206,rect);
var _207=s.createRect(rect).setFill(_206).setStroke(_205.series.stroke);
run.dyn.fill=_207.getFill();
run.dyn.stroke=_207.getStroke();
if(_1ff){
var o={element:"bar",index:j,run:run,shape:_207,x:v,y:j+1.5};
this._connectEvents(o);
_202[j]=o;
}
if(this.animate){
this._animateBar(_207,_1fa.l+_1fe,-_204);
}
}
}
}
this._eventSeries[run.name]=_202;
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Grid"]){
dojo._hasResource["dojox.charting.plot2d.Grid"]=true;
dojo.provide("dojox.charting.plot2d.Grid");
(function(){
var du=dojox.lang.utils,dc=dojox.charting.plot2d.common;
dojo.declare("dojox.charting.plot2d.Grid",dojox.charting.Element,{defaultParams:{hAxis:"x",vAxis:"y",hMajorLines:true,hMinorLines:false,vMajorLines:true,vMinorLines:false,hStripes:"none",vStripes:"none",animate:null},optionalParams:{},constructor:function(_208,_209){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_209);
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.dirty=true;
this.animate=this.opt.animate;
this.zoom=null,this.zoomQueue=[];
this.lastWindow={vscale:1,hscale:1,xoffset:0,yoffset:0};
},clear:function(){
this._hAxis=null;
this._vAxis=null;
this.dirty=true;
return this;
},setAxis:function(axis){
if(axis){
this[axis.vertical?"_vAxis":"_hAxis"]=axis;
}
return this;
},addSeries:function(run){
return this;
},getSeriesStats:function(){
return dojo.delegate(dc.defaultStats);
},initializeScalers:function(){
return this;
},isDirty:function(){
return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;
},performZoom:function(dim,_20a){
var vs=this._vAxis.scale||1,hs=this._hAxis.scale||1,_20b=dim.height-_20a.b,_20c=this._hAxis.getScaler().bounds,_20d=(_20c.from-_20c.lower)*_20c.scale,_20e=this._vAxis.getScaler().bounds,_20f=(_20e.from-_20e.lower)*_20e.scale;
rVScale=vs/this.lastWindow.vscale,rHScale=hs/this.lastWindow.hscale,rXOffset=(this.lastWindow.xoffset-_20d)/((this.lastWindow.hscale==1)?hs:this.lastWindow.hscale),rYOffset=(_20f-this.lastWindow.yoffset)/((this.lastWindow.vscale==1)?vs:this.lastWindow.vscale),shape=this.group,anim=dojox.gfx.fx.animateTransform(dojo.delegate({shape:shape,duration:1200,transform:[{name:"translate",start:[0,0],end:[_20a.l*(1-rHScale),_20b*(1-rVScale)]},{name:"scale",start:[1,1],end:[rHScale,rVScale]},{name:"original"},{name:"translate",start:[0,0],end:[rXOffset,rYOffset]}]},this.zoom));
dojo.mixin(this.lastWindow,{vscale:vs,hscale:hs,xoffset:_20d,yoffset:_20f});
this.zoomQueue.push(anim);
dojo.connect(anim,"onEnd",this,function(){
this.zoom=null;
this.zoomQueue.shift();
if(this.zoomQueue.length>0){
this.zoomQueue[0].play();
}
});
if(this.zoomQueue.length==1){
this.zoomQueue[0].play();
}
return this;
},getRequiredColors:function(){
return 0;
},render:function(dim,_210){
if(this.zoom){
return this.performZoom(dim,_210);
}
this.dirty=this.isDirty();
if(!this.dirty){
return this;
}
this.cleanGroup();
var s=this.group,ta=this.chart.theme.axis;
try{
var _211=this._vAxis.getScaler(),vt=_211.scaler.getTransformerFromModel(_211),_212=this._vAxis.getTicks();
if(this.opt.hMinorLines){
dojo.forEach(_212.minor,function(tick){
var y=dim.height-_210.b-vt(tick.value);
var _213=s.createLine({x1:_210.l,y1:y,x2:dim.width-_210.r,y2:y}).setStroke(ta.minorTick);
if(this.animate){
this._animateGrid(_213,"h",_210.l,_210.r+_210.l-dim.width);
}
},this);
}
if(this.opt.hMajorLines){
dojo.forEach(_212.major,function(tick){
var y=dim.height-_210.b-vt(tick.value);
var _214=s.createLine({x1:_210.l,y1:y,x2:dim.width-_210.r,y2:y}).setStroke(ta.majorTick);
if(this.animate){
this._animateGrid(_214,"h",_210.l,_210.r+_210.l-dim.width);
}
},this);
}
}
catch(e){
}
try{
var _215=this._hAxis.getScaler(),ht=_215.scaler.getTransformerFromModel(_215),_212=this._hAxis.getTicks();
if(_212&&this.opt.vMinorLines){
dojo.forEach(_212.minor,function(tick){
var x=_210.l+ht(tick.value);
var _216=s.createLine({x1:x,y1:_210.t,x2:x,y2:dim.height-_210.b}).setStroke(ta.minorTick);
if(this.animate){
this._animateGrid(_216,"v",dim.height-_210.b,dim.height-_210.b-_210.t);
}
},this);
}
if(_212&&this.opt.vMajorLines){
dojo.forEach(_212.major,function(tick){
var x=_210.l+ht(tick.value);
var _217=s.createLine({x1:x,y1:_210.t,x2:x,y2:dim.height-_210.b}).setStroke(ta.majorTick);
if(this.animate){
this._animateGrid(_217,"v",dim.height-_210.b,dim.height-_210.b-_210.t);
}
},this);
}
}
catch(e){
}
this.dirty=false;
return this;
},_animateGrid:function(_218,type,_219,size){
var _21a=type=="h"?[_219,0]:[0,_219];
var _21b=type=="h"?[1/size,1]:[1,1/size];
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_218,duration:1200,transform:[{name:"translate",start:_21a,end:[0,0]},{name:"scale",start:_21b,end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Pie"]){
dojo._hasResource["dojox.charting.plot2d.Pie"]=true;
dojo.provide("dojox.charting.plot2d.Pie");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,da=dojox.charting.axis2d.common,g=dojox.gfx,m=g.matrix,_21c=0.2;
dojo.declare("dojox.charting.plot2d.Pie",[dojox.charting.Element,dojox.charting.plot2d._PlotEvents],{defaultParams:{labels:true,ticks:false,fixed:true,precision:1,labelOffset:20,labelStyle:"default",htmlLabels:true,radGrad:"native",fanSize:5,startAngle:0},optionalParams:{radius:0,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:"",labelWiring:{}},constructor:function(_21d,_21e){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_21e);
du.updateWithPattern(this.opt,_21e,this.optionalParams);
this.run=null;
this.dyn=[];
},clear:function(){
this.dirty=true;
this.dyn=[];
this.run=null;
return this;
},setAxis:function(axis){
return this;
},addSeries:function(run){
this.run=run;
return this;
},getSeriesStats:function(){
return dojo.delegate(dc.defaultStats);
},initializeScalers:function(){
return this;
},getRequiredColors:function(){
return this.run?this.run.data.length:0;
},render:function(dim,_21f){
if(!this.dirty){
return this;
}
this.resetEvents();
this.dirty=false;
this._eventSeries={};
this.cleanGroup();
var s=this.group,t=this.chart.theme;
if(!this.run||!this.run.data.length){
return this;
}
var rx=(dim.width-_21f.l-_21f.r)/2,ry=(dim.height-_21f.t-_21f.b)/2,r=Math.min(rx,ry),_220="font" in this.opt?this.opt.font:t.axis.font,size=_220?g.normalizedLength(g.splitFontString(_220).size):0,_221="fontColor" in this.opt?this.opt.fontColor:t.axis.fontColor,_222=m._degToRad(this.opt.startAngle),_223=_222,step,_224,_225,_226,_227,_228,run=this.run.data,_229=this.events();
if(typeof run[0]=="number"){
_224=df.map(run,"x ? Math.max(x, 0) : 0");
if(df.every(_224,"<= 0")){
return this;
}
_225=df.map(_224,"/this",df.foldl(_224,"+",0));
if(this.opt.labels){
_226=dojo.map(_225,function(x){
return x>0?this._getLabel(x*100)+"%":"";
},this);
}
}else{
_224=df.map(run,"x ? Math.max(x.y, 0) : 0");
if(df.every(_224,"<= 0")){
return this;
}
_225=df.map(_224,"/this",df.foldl(_224,"+",0));
if(this.opt.labels){
_226=dojo.map(_225,function(x,i){
if(x<=0){
return "";
}
var v=run[i];
return "text" in v?v.text:this._getLabel(x*100)+"%";
},this);
}
}
var _22a=df.map(run,function(v,i){
if(v===null||typeof v=="number"){
return t.next("slice",[this.opt,this.run],true);
}
return t.next("slice",[this.opt,this.run,v],true);
},this);
if(this.opt.labels){
_227=df.foldl1(df.map(_226,function(_22b,i){
var font=_22a[i].series.font;
return dojox.gfx._base._getTextBox(_22b,{font:font}).w;
},this),"Math.max(a, b)")/2;
if(this.opt.labelOffset<0){
r=Math.min(rx-2*_227,ry-size)+this.opt.labelOffset;
}
_228=r-this.opt.labelOffset;
}
if("radius" in this.opt){
r=this.opt.radius;
_228=r-this.opt.labelOffset;
}
var _22c={cx:_21f.l+rx,cy:_21f.t+ry,r:r};
this.dyn=[];
var _22d=new Array(_225.length);
dojo.some(_225,function(_22e,i){
if(_22e<=0){
return false;
}
var v=run[i],_22f=_22a[i],_230;
if(_22e>=1){
_230=this._plotFill(_22f.series.fill,dim,_21f);
_230=this._shapeFill(_230,{x:_22c.cx-_22c.r,y:_22c.cy-_22c.r,width:2*_22c.r,height:2*_22c.r});
_230=this._pseudoRadialFill(_230,{x:_22c.cx,y:_22c.cy},_22c.r);
var _231=s.createCircle(_22c).setFill(_230).setStroke(_22f.series.stroke);
this.dyn.push({fill:_230,stroke:_22f.series.stroke});
if(_229){
var o={element:"slice",index:i,run:this.run,shape:_231,x:i,y:typeof v=="number"?v:v.y,cx:_22c.cx,cy:_22c.cy,cr:r};
this._connectEvents(o);
_22d[i]=o;
}
return true;
}
var end=_223+_22e*2*Math.PI;
if(i+1==_225.length){
end=_222+2*Math.PI;
}
var step=end-_223,x1=_22c.cx+r*Math.cos(_223),y1=_22c.cy+r*Math.sin(_223),x2=_22c.cx+r*Math.cos(end),y2=_22c.cy+r*Math.sin(end);
var _232=m._degToRad(this.opt.fanSize);
if(_22f.series.fill&&_22f.series.fill.type==="radial"&&this.opt.radGrad==="fan"&&step>_232){
var _233=s.createGroup(),_234=Math.ceil(step/_232),_235=step/_234;
_230=this._shapeFill(_22f.series.fill,{x:_22c.cx-_22c.r,y:_22c.cy-_22c.r,width:2*_22c.r,height:2*_22c.r});
for(var j=0;j<_234;++j){
var _236=j==0?x1:_22c.cx+r*Math.cos(_223+(j-_21c)*_235),_237=j==0?y1:_22c.cy+r*Math.sin(_223+(j-_21c)*_235),_238=j==_234-1?x2:_22c.cx+r*Math.cos(_223+(j+1+_21c)*_235),_239=j==_234-1?y2:_22c.cy+r*Math.sin(_223+(j+1+_21c)*_235),fan=_233.createPath({}).moveTo(_22c.cx,_22c.cy).lineTo(_236,_237).arcTo(r,r,0,_235>Math.PI,true,_238,_239).lineTo(_22c.cx,_22c.cy).closePath().setFill(this._pseudoRadialFill(_230,{x:_22c.cx,y:_22c.cy},r,_223+(j+0.5)*_235,_223+(j+0.5)*_235));
}
_233.createPath({}).moveTo(_22c.cx,_22c.cy).lineTo(x1,y1).arcTo(r,r,0,step>Math.PI,true,x2,y2).lineTo(_22c.cx,_22c.cy).closePath().setStroke(_22f.series.stroke);
_231=_233;
}else{
_231=s.createPath({}).moveTo(_22c.cx,_22c.cy).lineTo(x1,y1).arcTo(r,r,0,step>Math.PI,true,x2,y2).lineTo(_22c.cx,_22c.cy).closePath().setStroke(_22f.series.stroke);
var _230=_22f.series.fill;
if(_230&&_230.type==="radial"){
_230=this._shapeFill(_230,{x:_22c.cx-_22c.r,y:_22c.cy-_22c.r,width:2*_22c.r,height:2*_22c.r});
if(this.opt.radGrad==="linear"){
_230=this._pseudoRadialFill(_230,{x:_22c.cx,y:_22c.cy},r,_223,end);
}
}else{
if(_230&&_230.type==="linear"){
_230=this._plotFill(_230,dim,_21f);
_230=this._shapeFill(_230,_231.getBoundingBox());
}
}
_231.setFill(_230);
}
this.dyn.push({fill:_230,stroke:_22f.series.stroke});
if(_229){
var o={element:"slice",index:i,run:this.run,shape:_231,x:i,y:typeof v=="number"?v:v.y,cx:_22c.cx,cy:_22c.cy,cr:r};
this._connectEvents(o);
_22d[i]=o;
}
_223=end;
return false;
},this);
if(this.opt.labels){
if(this.opt.labelStyle=="default"){
_223=_222;
dojo.some(_225,function(_23a,i){
if(_23a<=0){
return false;
}
var _23b=_22a[i];
if(_23a>=1){
var v=run[i],elem=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,_22c.cx,_22c.cy+size/2,"middle",_226[i],_23b.series.font,_23b.series.fontColor);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
return true;
}
var end=_223+_23a*2*Math.PI,v=run[i];
if(i+1==_225.length){
end=_222+2*Math.PI;
}
var _23c=(_223+end)/2,x=_22c.cx+_228*Math.cos(_23c),y=_22c.cy+_228*Math.sin(_23c)+size/2;
var elem=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,x,y,"middle",_226[i],_23b.series.font,_23b.series.fontColor);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
_223=end;
return false;
},this);
}else{
if(this.opt.labelStyle=="columns"){
_223=_222;
var _23d=[];
dojo.forEach(_225,function(_23e,i){
var end=_223+_23e*2*Math.PI;
if(i+1==_225.length){
end=_222+2*Math.PI;
}
var _23f=(_223+end)/2;
_23d.push({angle:_23f,left:Math.cos(_23f)<0,theme:_22a[i],index:i,omit:end-_223<0.001});
_223=end;
});
var _240=dojox.gfx._base._getTextBox("a",{font:_220}).h;
this._getProperLabelRadius(_23d,_240,_22c.r*1.1);
dojo.forEach(_23d,function(_241,i){
if(!_241.omit){
var _242=_22c.cx-_22c.r*2,_243=_22c.cx+_22c.r*2,_244=dojox.gfx._base._getTextBox(_226[i],{font:_220}).w,x=_22c.cx+_241.labelR*Math.cos(_241.angle),y=_22c.cy+_241.labelR*Math.sin(_241.angle),_245=(_241.left)?(_242+_244):(_243-_244),_246=(_241.left)?_242:_245;
var _247=s.createPath().moveTo(_22c.cx+_22c.r*Math.cos(_241.angle),_22c.cy+_22c.r*Math.sin(_241.angle));
if(Math.abs(_241.labelR*Math.cos(_241.angle))<_22c.r*2-_244){
_247.lineTo(x,y);
}
_247.lineTo(_245,y).setStroke(_241.theme.series.labelWiring);
var elem=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,_246,y,"left",_226[i],_241.theme.series.font,_241.theme.series.fontColor);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
}
},this);
}
}
}
var esi=0;
this._eventSeries[this.run.name]=df.map(run,function(v){
return v<=0?null:_22d[esi++];
});
return this;
},_getProperLabelRadius:function(_248,_249,_24a){
var _24b={},_24c={},_24d=1,_24e=1;
if(_248.length==1){
_248[0].labelR=_24a;
return;
}
for(var i=0;i<_248.length;i++){
var _24f=Math.abs(Math.sin(_248[i].angle));
if(_248[i].left){
if(_24d>_24f){
_24d=_24f;
_24b=_248[i];
}
}else{
if(_24e>_24f){
_24e=_24f;
_24c=_248[i];
}
}
}
_24b.labelR=_24c.labelR=_24a;
this._caculateLabelR(_24b,_248,_249);
this._caculateLabelR(_24c,_248,_249);
},_caculateLabelR:function(_250,_251,_252){
var i=_250.index,_253=_251.length,_254=_250.labelR;
while(!(_251[i%_253].left^_251[(i+1)%_253].left)){
if(!_251[(i+1)%_253].omit){
var _255=(Math.sin(_251[i%_253].angle)*_254+((_251[i%_253].left)?(-_252):_252))/Math.sin(_251[(i+1)%_253].angle);
_254=(_255<_250.labelR)?_250.labelR:_255;
_251[(i+1)%_253].labelR=_254;
}
i++;
}
i=_250.index,j=(i==0)?_253-1:i-1;
while(!(_251[i].left^_251[j].left)){
if(!_251[j].omit){
var _255=(Math.sin(_251[i].angle)*_254+((_251[i].left)?_252:(-_252)))/Math.sin(_251[j].angle);
_254=(_255<_250.labelR)?_250.labelR:_255;
_251[j].labelR=_254;
}
i--;
j--;
i=(i<0)?i+_251.length:i;
j=(j<0)?j+_251.length:j;
}
},_getLabel:function(_256){
return dc.getLabel(_256,this.opt.fixed,this.opt.precision);
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Bubble"]){
dojo._hasResource["dojox.charting.plot2d.Bubble"]=true;
dojo.provide("dojox.charting.plot2d.Bubble");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_257=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Bubble",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",animate:null},optionalParams:{stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_258,_259){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_259);
du.updateWithPattern(this.opt,_259,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},render:function(dim,_25a){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_25a);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_257);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_25b=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
if(!run.data.length){
run.dirty=false;
t.skip();
continue;
}
if(typeof run.data[0]=="number"){
console.warn("dojox.charting.plot2d.Bubble: the data in the following series cannot be rendered as a bubble chart; ",run);
continue;
}
var _25c=t.next("circle",[this.opt,run]),s=run.group,_25d=dojo.map(run.data,function(v,i){
return v?{x:ht(v.x)+_25a.l,y:dim.height-_25a.b-vt(v.y),radius:this._vScaler.bounds.scale*(v.size/2)}:null;
},this);
var _25e=null,_25f=null,_260=null;
if(_25c.series.shadow){
_260=dojo.map(_25d,function(item){
if(item!==null){
var _261=t.addMixin(_25c,"circle",item,true),_262=_261.series.shadow;
var _263=s.createCircle({cx:item.x+_262.dx,cy:item.y+_262.dy,r:item.radius}).setStroke(_262).setFill(_262.color);
if(this.animate){
this._animateBubble(_263,dim.height-_25a.b,item.radius);
}
return _263;
}
return null;
},this);
if(_260.length){
run.dyn.shadow=_260[_260.length-1].getStroke();
}
}
if(_25c.series.outline){
_25f=dojo.map(_25d,function(item){
if(item!==null){
var _264=t.addMixin(_25c,"circle",item,true),_265=dc.makeStroke(_264.series.outline);
_265.width=2*_265.width+_25c.series.stroke.width;
var _266=s.createCircle({cx:item.x,cy:item.y,r:item.radius}).setStroke(_265);
if(this.animate){
this._animateBubble(_266,dim.height-_25a.b,item.radius);
}
return _266;
}
return null;
},this);
if(_25f.length){
run.dyn.outline=_25f[_25f.length-1].getStroke();
}
}
_25e=dojo.map(_25d,function(item){
if(item!==null){
var _267=t.addMixin(_25c,"circle",item,true),rect={x:item.x-item.radius,y:item.y-item.radius,width:2*item.radius,height:2*item.radius};
var _268=this._plotFill(_267.series.fill,dim,_25a);
_268=this._shapeFill(_268,rect);
var _269=s.createCircle({cx:item.x,cy:item.y,r:item.radius}).setFill(_268).setStroke(_267.series.stroke);
if(this.animate){
this._animateBubble(_269,dim.height-_25a.b,item.radius);
}
return _269;
}
return null;
},this);
if(_25e.length){
run.dyn.fill=_25e[_25e.length-1].getFill();
run.dyn.stroke=_25e[_25e.length-1].getStroke();
}
if(_25b){
var _26a=new Array(_25e.length);
dojo.forEach(_25e,function(s,i){
if(s!==null){
var o={element:"circle",index:i,run:run,shape:s,outline:_25f&&_25f[i]||null,shadow:_260&&_260[i]||null,x:run.data[i].x,y:run.data[i].y,r:run.data[i].size/2,cx:_25d[i].x,cy:_25d[i].y,cr:_25d[i].radius};
this._connectEvents(o);
_26a[i]=o;
}
},this);
this._eventSeries[run.name]=_26a;
}else{
delete this._eventSeries[run.name];
}
run.dirty=false;
}
this.dirty=false;
return this;
},_animateBubble:function(_26b,_26c,size){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_26b,duration:1200,transform:[{name:"translate",start:[0,_26c],end:[0,0]},{name:"scale",start:[0,1/size],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Candlesticks"]){
dojo._hasResource["dojox.charting.plot2d.Candlesticks"]=true;
dojo.provide("dojox.charting.plot2d.Candlesticks");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_26d=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Candlesticks",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:2,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_26e,_26f){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_26f);
du.updateWithPattern(this.opt,_26f,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},collectStats:function(_270){
var _271=dojo.delegate(dc.defaultStats);
for(var i=0;i<_270.length;i++){
var run=_270[i];
if(!run.data.length){
continue;
}
var _272=_271.vmin,_273=_271.vmax;
if(!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,idx){
if(val!==null){
var x=val.x||idx+1;
_271.hmin=Math.min(_271.hmin,x);
_271.hmax=Math.max(_271.hmax,x);
_271.vmin=Math.min(_271.vmin,val.open,val.close,val.high,val.low);
_271.vmax=Math.max(_271.vmax,val.open,val.close,val.high,val.low);
}
});
}
if("ymin" in run){
_271.vmin=Math.min(_272,run.ymin);
}
if("ymax" in run){
_271.vmax=Math.max(_273,run.ymax);
}
}
return _271;
},getSeriesStats:function(){
var _274=this.collectStats(this.series);
_274.hmin-=0.5;
_274.hmax+=0.5;
return _274;
},render:function(dim,_275){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_275);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_26d);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_276,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_277=Math.max(0,this._vScaler.bounds.lower),_278=vt(_277),_279=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
gap=f.gap;
_276=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _27a=t.next("candlestick",[this.opt,run]),s=run.group,_27b=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(v!==null){
var _27c=t.addMixin(_27a,"candlestick",v,true);
var x=ht(v.x||(j+0.5))+_275.l+gap,y=dim.height-_275.b,open=vt(v.open),_27d=vt(v.close),high=vt(v.high),low=vt(v.low);
if("mid" in v){
var mid=vt(v.mid);
}
if(low>high){
var tmp=high;
high=low;
low=tmp;
}
if(_276>=1){
var _27e=open>_27d;
var line={x1:_276/2,x2:_276/2,y1:y-high,y2:y-low},rect={x:0,y:y-Math.max(open,_27d),width:_276,height:Math.max(_27e?open-_27d:_27d-open,1)};
shape=s.createGroup();
shape.setTransform({dx:x,dy:0});
var _27f=shape.createGroup();
_27f.createLine(line).setStroke(_27c.series.stroke);
_27f.createRect(rect).setStroke(_27c.series.stroke).setFill(_27e?_27c.series.fill:"white");
if("mid" in v){
_27f.createLine({x1:(_27c.series.stroke.width||1),x2:_276-(_27c.series.stroke.width||1),y1:y-mid,y2:y-mid}).setStroke(_27e?"white":_27c.series.stroke);
}
run.dyn.fill=_27c.series.fill;
run.dyn.stroke=_27c.series.stroke;
if(_279){
var o={element:"candlestick",index:j,run:run,shape:_27f,x:x,y:y-Math.max(open,_27d),cx:_276/2,cy:(y-Math.max(open,_27d))+(Math.max(_27e?open-_27d:_27d-open,1)/2),width:_276,height:Math.max(_27e?open-_27d:_27d-open,1),data:v};
this._connectEvents(o);
_27b[j]=o;
}
}
if(this.animate){
this._animateCandlesticks(shape,y-low,high-low);
}
}
}
this._eventSeries[run.name]=_27b;
run.dirty=false;
}
this.dirty=false;
return this;
},_animateCandlesticks:function(_280,_281,_282){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_280,duration:1200,transform:[{name:"translate",start:[0,_281-(_281/_282)],end:[0,0]},{name:"scale",start:[1,1/_282],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.OHLC"]){
dojo._hasResource["dojox.charting.plot2d.OHLC"]=true;
dojo.provide("dojox.charting.plot2d.OHLC");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_283=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.OHLC",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:2,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_284,_285){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_285);
du.updateWithPattern(this.opt,_285,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},collectStats:function(_286){
var _287=dojo.delegate(dc.defaultStats);
for(var i=0;i<_286.length;i++){
var run=_286[i];
if(!run.data.length){
continue;
}
var _288=_287.vmin,_289=_287.vmax;
if(!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,idx){
if(val!==null){
var x=val.x||idx+1;
_287.hmin=Math.min(_287.hmin,x);
_287.hmax=Math.max(_287.hmax,x);
_287.vmin=Math.min(_287.vmin,val.open,val.close,val.high,val.low);
_287.vmax=Math.max(_287.vmax,val.open,val.close,val.high,val.low);
}
});
}
if("ymin" in run){
_287.vmin=Math.min(_288,run.ymin);
}
if("ymax" in run){
_287.vmax=Math.max(_289,run.ymax);
}
}
return _287;
},getSeriesStats:function(){
var _28a=this.collectStats(this.series);
_28a.hmin-=0.5;
_28a.hmax+=0.5;
return _28a;
},render:function(dim,_28b){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(dim,_28b);
}
this.resetEvents();
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_283);
this._eventSeries={};
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_28c,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_28d=Math.max(0,this._vScaler.bounds.lower),_28e=vt(_28d),_28f=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
gap=f.gap;
_28c=f.size;
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
this._reconnectEvents(run.name);
continue;
}
run.cleanGroup();
var _290=t.next("candlestick",[this.opt,run]),s=run.group,_291=new Array(run.data.length);
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(v!==null){
var _292=t.addMixin(_290,"candlestick",v,true);
var x=ht(v.x||(j+0.5))+_28b.l+gap,y=dim.height-_28b.b,open=vt(v.open),_293=vt(v.close),high=vt(v.high),low=vt(v.low);
if(low>high){
var tmp=high;
high=low;
low=tmp;
}
if(_28c>=1){
var hl={x1:_28c/2,x2:_28c/2,y1:y-high,y2:y-low},op={x1:0,x2:((_28c/2)+((_292.series.stroke.width||1)/2)),y1:y-open,y2:y-open},cl={x1:((_28c/2)-((_292.series.stroke.width||1)/2)),x2:_28c,y1:y-_293,y2:y-_293};
shape=s.createGroup();
shape.setTransform({dx:x,dy:0});
var _294=shape.createGroup();
_294.createLine(hl).setStroke(_292.series.stroke);
_294.createLine(op).setStroke(_292.series.stroke);
_294.createLine(cl).setStroke(_292.series.stroke);
run.dyn.stroke=_292.series.stroke;
if(_28f){
var o={element:"candlestick",index:j,run:run,shape:_294,x:x,y:y-Math.max(open,_293),cx:_28c/2,cy:(y-Math.max(open,_293))+(Math.max(open>_293?open-_293:_293-open,1)/2),width:_28c,height:Math.max(open>_293?open-_293:_293-open,1),data:v};
this._connectEvents(o);
_291[j]=o;
}
}
if(this.animate){
this._animateOHLC(shape,y-low,high-low);
}
}
}
this._eventSeries[run.name]=_291;
run.dirty=false;
}
this.dirty=false;
return this;
},_animateOHLC:function(_295,_296,_297){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_295,duration:1200,transform:[{name:"translate",start:[0,_296-(_296/_297)],end:[0,0]},{name:"scale",start:[1,1/_297],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
if(!dojo._hasResource["dojo.fx.Toggler"]){
dojo._hasResource["dojo.fx.Toggler"]=true;
dojo.provide("dojo.fx.Toggler");
dojo.declare("dojo.fx.Toggler",null,{node:null,showFunc:dojo.fadeIn,hideFunc:dojo.fadeOut,showDuration:200,hideDuration:200,constructor:function(args){
var _298=this;
dojo.mixin(_298,args);
_298.node=args.node;
_298._showArgs=dojo.mixin({},args);
_298._showArgs.node=_298.node;
_298._showArgs.duration=_298.showDuration;
_298.showAnim=_298.showFunc(_298._showArgs);
_298._hideArgs=dojo.mixin({},args);
_298._hideArgs.node=_298.node;
_298._hideArgs.duration=_298.hideDuration;
_298.hideAnim=_298.hideFunc(_298._hideArgs);
dojo.connect(_298.showAnim,"beforeBegin",dojo.hitch(_298.hideAnim,"stop",true));
dojo.connect(_298.hideAnim,"beforeBegin",dojo.hitch(_298.showAnim,"stop",true));
},show:function(_299){
return this.showAnim.play(_299||0);
},hide:function(_29a){
return this.hideAnim.play(_29a||0);
}});
}
if(!dojo._hasResource["dojo.fx"]){
dojo._hasResource["dojo.fx"]=true;
dojo.provide("dojo.fx");
(function(){
var d=dojo,_29b={_fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,args||[]);
}
return this;
}};
var _29c=function(_29d){
this._index=-1;
this._animations=_29d||[];
this._current=this._onAnimateCtx=this._onEndCtx=null;
this.duration=0;
d.forEach(this._animations,function(a){
this.duration+=a.duration;
if(a.delay){
this.duration+=a.delay;
}
},this);
};
d.extend(_29c,{_onAnimate:function(){
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
},play:function(_29e,_29f){
if(!this._current){
this._current=this._animations[this._index=0];
}
if(!_29f&&this._current.status()=="playing"){
return this;
}
var _2a0=d.connect(this._current,"beforeBegin",this,function(){
this._fire("beforeBegin");
}),_2a1=d.connect(this._current,"onBegin",this,function(arg){
this._fire("onBegin",arguments);
}),_2a2=d.connect(this._current,"onPlay",this,function(arg){
this._fire("onPlay",arguments);
d.disconnect(_2a0);
d.disconnect(_2a1);
d.disconnect(_2a2);
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
},gotoPercent:function(_2a3,_2a4){
this.pause();
var _2a5=this.duration*_2a3;
this._current=null;
d.some(this._animations,function(a){
if(a.duration<=_2a5){
this._current=a;
return true;
}
_2a5-=a.duration;
return false;
});
if(this._current){
this._current.gotoPercent(_2a5/this._current.duration,_2a4);
}
return this;
},stop:function(_2a6){
if(this._current){
if(_2a6){
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
d.extend(_29c,_29b);
dojo.fx.chain=function(_2a7){
return new _29c(_2a7);
};
var _2a8=function(_2a9){
this._animations=_2a9||[];
this._connects=[];
this._finished=0;
this.duration=0;
d.forEach(_2a9,function(a){
var _2aa=a.duration;
if(a.delay){
_2aa+=a.delay;
}
if(this.duration<_2aa){
this.duration=_2aa;
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
d.extend(_2a8,{_doAction:function(_2ab,args){
d.forEach(this._animations,function(a){
a[_2ab].apply(a,args);
});
return this;
},_onEnd:function(){
if(++this._finished>this._animations.length){
this._fire("onEnd");
}
},_call:function(_2ac,args){
var t=this._pseudoAnimation;
t[_2ac].apply(t,args);
},play:function(_2ad,_2ae){
this._finished=0;
this._doAction("play",arguments);
this._call("play",arguments);
return this;
},pause:function(){
this._doAction("pause",arguments);
this._call("pause",arguments);
return this;
},gotoPercent:function(_2af,_2b0){
var ms=this.duration*_2af;
d.forEach(this._animations,function(a){
a.gotoPercent(a.duration<ms?1:(ms/a.duration),_2b0);
});
this._call("gotoPercent",arguments);
return this;
},stop:function(_2b1){
this._doAction("stop",arguments);
this._call("stop",arguments);
return this;
},status:function(){
return this._pseudoAnimation.status();
},destroy:function(){
d.forEach(this._connects,dojo.disconnect);
}});
d.extend(_2a8,_29b);
dojo.fx.combine=function(_2b2){
return new _2a8(_2b2);
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
var _2b3=d.style(node,"height");
return Math.max(_2b3,1);
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
if(!dojo._hasResource["dojo.fx.easing"]){
dojo._hasResource["dojo.fx.easing"]=true;
dojo.provide("dojo.fx.easing");
dojo.getObject("fx.easing",true,dojo);
dojo.fx.easing={linear:function(n){
return n;
},quadIn:function(n){
return Math.pow(n,2);
},quadOut:function(n){
return n*(n-2)*-1;
},quadInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,2)/2;
}
return -1*((--n)*(n-2)-1)/2;
},cubicIn:function(n){
return Math.pow(n,3);
},cubicOut:function(n){
return Math.pow(n-1,3)+1;
},cubicInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,3)/2;
}
n-=2;
return (Math.pow(n,3)+2)/2;
},quartIn:function(n){
return Math.pow(n,4);
},quartOut:function(n){
return -1*(Math.pow(n-1,4)-1);
},quartInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,4)/2;
}
n-=2;
return -1/2*(Math.pow(n,4)-2);
},quintIn:function(n){
return Math.pow(n,5);
},quintOut:function(n){
return Math.pow(n-1,5)+1;
},quintInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,5)/2;
}
n-=2;
return (Math.pow(n,5)+2)/2;
},sineIn:function(n){
return -1*Math.cos(n*(Math.PI/2))+1;
},sineOut:function(n){
return Math.sin(n*(Math.PI/2));
},sineInOut:function(n){
return -1*(Math.cos(Math.PI*n)-1)/2;
},expoIn:function(n){
return (n==0)?0:Math.pow(2,10*(n-1));
},expoOut:function(n){
return (n==1)?1:(-1*Math.pow(2,-10*n)+1);
},expoInOut:function(n){
if(n==0){
return 0;
}
if(n==1){
return 1;
}
n=n*2;
if(n<1){
return Math.pow(2,10*(n-1))/2;
}
--n;
return (-1*Math.pow(2,-10*n)+2)/2;
},circIn:function(n){
return -1*(Math.sqrt(1-Math.pow(n,2))-1);
},circOut:function(n){
n=n-1;
return Math.sqrt(1-Math.pow(n,2));
},circInOut:function(n){
n=n*2;
if(n<1){
return -1/2*(Math.sqrt(1-Math.pow(n,2))-1);
}
n-=2;
return 1/2*(Math.sqrt(1-Math.pow(n,2))+1);
},backIn:function(n){
var s=1.70158;
return Math.pow(n,2)*((s+1)*n-s);
},backOut:function(n){
n=n-1;
var s=1.70158;
return Math.pow(n,2)*((s+1)*n+s)+1;
},backInOut:function(n){
var s=1.70158*1.525;
n=n*2;
if(n<1){
return (Math.pow(n,2)*((s+1)*n-s))/2;
}
n-=2;
return (Math.pow(n,2)*((s+1)*n+s)+2)/2;
},elasticIn:function(n){
if(n==0||n==1){
return n;
}
var p=0.3;
var s=p/4;
n=n-1;
return -1*Math.pow(2,10*n)*Math.sin((n-s)*(2*Math.PI)/p);
},elasticOut:function(n){
if(n==0||n==1){
return n;
}
var p=0.3;
var s=p/4;
return Math.pow(2,-10*n)*Math.sin((n-s)*(2*Math.PI)/p)+1;
},elasticInOut:function(n){
if(n==0){
return 0;
}
n=n*2;
if(n==2){
return 1;
}
var p=0.3*1.5;
var s=p/4;
if(n<1){
n-=1;
return -0.5*(Math.pow(2,10*n)*Math.sin((n-s)*(2*Math.PI)/p));
}
n-=1;
return 0.5*(Math.pow(2,-10*n)*Math.sin((n-s)*(2*Math.PI)/p))+1;
},bounceIn:function(n){
return (1-dojo.fx.easing.bounceOut(1-n));
},bounceOut:function(n){
var s=7.5625;
var p=2.75;
var l;
if(n<(1/p)){
l=s*Math.pow(n,2);
}else{
if(n<(2/p)){
n-=(1.5/p);
l=s*Math.pow(n,2)+0.75;
}else{
if(n<(2.5/p)){
n-=(2.25/p);
l=s*Math.pow(n,2)+0.9375;
}else{
n-=(2.625/p);
l=s*Math.pow(n,2)+0.984375;
}
}
}
return l;
},bounceInOut:function(n){
if(n<0.5){
return dojo.fx.easing.bounceIn(n*2)/2;
}
return (dojo.fx.easing.bounceOut(n*2-1)/2)+0.5;
}};
}
if(!dojo._hasResource["dojox.charting.plot2d.Spider"]){
dojo._hasResource["dojox.charting.plot2d.Spider"]=true;
dojo.provide("dojox.charting.plot2d.Spider");
dojo.experimental("dojox.charting.plot2d.Spider");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,da=dojox.charting.axis2d.common,g=dojox.gfx,m=g.matrix,_2b4=0.2;
dojo.declare("dojox.charting.plot2d.Spider",[dojox.charting.Element,dojox.charting.plot2d._PlotEvents],{defaultParams:{labels:true,ticks:false,fixed:true,precision:1,labelOffset:-10,labelStyle:"default",htmlLabels:true,startAngle:-90,divisions:3,axisColor:"",axisWidth:0,spiderColor:"",spiderWidth:0,seriesWidth:0,seriesFillAlpha:0.2,spiderOrigin:0.16,markerSize:3,spiderType:"polygon",animationType:dojo.fx.easing.backOut,axisTickFont:"",axisTickFontColor:"",axisFont:"",axisFontColor:""},optionalParams:{radius:0,font:"",fontColor:""},constructor:function(_2b5,_2b6){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_2b6);
du.updateWithPattern(this.opt,_2b6,this.optionalParams);
this.series=[];
this.dyn=[];
this.datas={};
this.labelKey=[];
this.oldSeriePoints={};
this.animations={};
},clear:function(){
this.dirty=true;
this.dyn=[];
this.series=[];
this.datas={};
this.labelKey=[];
this.oldSeriePoints={};
this.animations={};
return this;
},setAxis:function(axis){
return this;
},addSeries:function(run){
var _2b7=false;
this.series.push(run);
for(var key in run.data){
var val=run.data[key],data=this.datas[key];
if(data){
data.vlist.push(val);
data.min=Math.min(data.min,val);
data.max=Math.max(data.max,val);
}else{
this.datas[key]={min:val,max:val,vlist:[val]};
}
}
if(this.labelKey.length<=0){
for(var key in run.data){
this.labelKey.push(key);
}
}
return this;
},getSeriesStats:function(){
return dojox.charting.plot2d.common.collectSimpleStats(this.series);
},calculateAxes:function(dim){
this.initializeScalers(dim,this.getSeriesStats());
return this;
},getRequiredColors:function(){
return this.series.length;
},initializeScalers:function(dim,_2b8){
if(this._hAxis){
if(!this._hAxis.initialized()){
this._hAxis.calculate(_2b8.hmin,_2b8.hmax,dim.width);
}
this._hScaler=this._hAxis.getScaler();
}else{
this._hScaler=dojox.charting.scaler.primitive.buildScaler(_2b8.hmin,_2b8.hmax,dim.width);
}
if(this._vAxis){
if(!this._vAxis.initialized()){
this._vAxis.calculate(_2b8.vmin,_2b8.vmax,dim.height);
}
this._vScaler=this._vAxis.getScaler();
}else{
this._vScaler=dojox.charting.scaler.primitive.buildScaler(_2b8.vmin,_2b8.vmax,dim.height);
}
return this;
},render:function(dim,_2b9){
if(!this.dirty){
return this;
}
this.dirty=false;
this.cleanGroup();
var s=this.group,t=this.chart.theme;
this.resetEvents();
if(!this.series||!this.series.length){
return this;
}
var o=this.opt,ta=t.axis,rx=(dim.width-_2b9.l-_2b9.r)/2,ry=(dim.height-_2b9.t-_2b9.b)/2,r=Math.min(rx,ry),_2ba=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font)||"normal normal normal 7pt Tahoma",_2bb=o.axisFont||(ta.tick&&ta.tick.titleFont)||"normal normal normal 11pt Tahoma",_2bc=o.axisTickFontColor||(ta.majorTick&&ta.majorTick.fontColor)||(ta.tick&&ta.tick.fontColor)||"silver",_2bd=o.axisFontColor||(ta.tick&&ta.tick.titleFontColor)||"black",_2be=o.axisColor||(ta.tick&&ta.tick.axisColor)||"silver",_2bf=o.spiderColor||(ta.tick&&ta.tick.spiderColor)||"silver",_2c0=o.axisWidth||(ta.stroke&&ta.stroke.width)||2,_2c1=o.spiderWidth||(ta.stroke&&ta.stroke.width)||2,_2c2=o.seriesWidth||(ta.stroke&&ta.stroke.width)||2,_2c3=g.normalizedLength(g.splitFontString(_2bb).size),_2c4=m._degToRad(o.startAngle),_2c5=_2c4,step,_2c6,_2c7,_2c8,_2c9,_2ca,_2cb,_2cc,_2cd,_2ce,_2cf,ro=o.spiderOrigin,dv=o.divisions>=3?o.divisions:3,ms=o.markerSize,spt=o.spiderType,at=o.animationType,_2d0=o.labelOffset<-10?o.labelOffset:-10,_2d1=0.2;
if(o.labels){
_2c8=dojo.map(this.series,function(s){
return s.name;
},this);
_2c9=df.foldl1(df.map(_2c8,function(_2d2,i){
var font=t.series.font;
return dojox.gfx._base._getTextBox(_2d2,{font:font}).w;
},this),"Math.max(a, b)")/2;
r=Math.min(rx-2*_2c9,ry-_2c3)+_2d0;
_2ca=r-_2d0;
}
if("radius" in o){
r=o.radius;
_2ca=r-_2d0;
}
r/=(1+_2d1);
var _2d3={cx:_2b9.l+rx,cy:_2b9.t+ry,r:r};
for(var i=this.series.length-1;i>=0;i--){
var _2d4=this.series[i];
if(!this.dirty&&!_2d4.dirty){
t.skip();
continue;
}
_2d4.cleanGroup();
var run=_2d4.data;
if(run!==null){
var len=this._getObjectLength(run);
if(!_2cb||_2cb.length<=0){
_2cb=[],_2cc=[],_2cf=[];
this._buildPoints(_2cb,len,_2d3,r,_2c5,true);
this._buildPoints(_2cc,len,_2d3,r*ro,_2c5,true);
this._buildPoints(_2cf,len,_2d3,_2ca,_2c5);
if(dv>2){
_2cd=[],_2ce=[];
for(var j=0;j<dv-2;j++){
_2cd[j]=[];
this._buildPoints(_2cd[j],len,_2d3,r*(ro+(1-ro)*(j+1)/(dv-1)),_2c5,true);
_2ce[j]=r*(ro+(1-ro)*(j+1)/(dv-1));
}
}
}
}
}
var _2d5=s.createGroup(),_2d6={color:_2be,width:_2c0},_2d7={color:_2bf,width:_2c1};
for(var j=_2cb.length-1;j>=0;--j){
var _2d8=_2cb[j],st={x:_2d8.x+(_2d8.x-_2d3.cx)*_2d1,y:_2d8.y+(_2d8.y-_2d3.cy)*_2d1},nd={x:_2d8.x+(_2d8.x-_2d3.cx)*_2d1/2,y:_2d8.y+(_2d8.y-_2d3.cy)*_2d1/2};
_2d5.createLine({x1:_2d3.cx,y1:_2d3.cy,x2:st.x,y2:st.y}).setStroke(_2d6);
this._drawArrow(_2d5,st,nd,_2d6);
}
var _2d9=s.createGroup();
for(var j=_2cf.length-1;j>=0;--j){
var _2d8=_2cf[j],_2da=dojox.gfx._base._getTextBox(this.labelKey[j],{font:_2bb}).w||0,_2db=this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx";
elem=da.createText[_2db](this.chart,_2d9,(!dojo._isBodyLtr()&&_2db=="html")?(_2d8.x+_2da-dim.width):_2d8.x,_2d8.y,"middle",this.labelKey[j],_2bb,_2bd);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
}
var _2dc=s.createGroup();
if(spt=="polygon"){
_2dc.createPolyline(_2cb).setStroke(_2d7);
_2dc.createPolyline(_2cc).setStroke(_2d7);
if(_2cd.length>0){
for(var j=_2cd.length-1;j>=0;--j){
_2dc.createPolyline(_2cd[j]).setStroke(_2d7);
}
}
}else{
var _2dd=this._getObjectLength(this.datas);
_2dc.createCircle({cx:_2d3.cx,cy:_2d3.cy,r:r}).setStroke(_2d7);
_2dc.createCircle({cx:_2d3.cx,cy:_2d3.cy,r:r*ro}).setStroke(_2d7);
if(_2ce.length>0){
for(var j=_2ce.length-1;j>=0;--j){
_2dc.createCircle({cx:_2d3.cx,cy:_2d3.cy,r:_2ce[j]}).setStroke(_2d7);
}
}
}
var _2de=s.createGroup(),len=this._getObjectLength(this.datas),k=0;
for(var key in this.datas){
var data=this.datas[key],min=data.min,max=data.max,_2df=max-min,end=_2c5+2*Math.PI*k/len;
for(var i=0;i<dv;i++){
var text=min+_2df*i/(dv-1),_2d8=this._getCoordinate(_2d3,r*(ro+(1-ro)*i/(dv-1)),end);
text=this._getLabel(text);
var _2da=dojox.gfx._base._getTextBox(text,{font:_2ba}).w||0,_2db=this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx";
if(this.opt.htmlLabels){
this.htmlElements.push(da.createText[_2db](this.chart,_2de,(!dojo._isBodyLtr()&&_2db=="html")?(_2d8.x+_2da-dim.width):_2d8.x,_2d8.y,"start",text,_2ba,_2bc));
}
}
k++;
}
this.chart.seriesShapes={};
var _2e0=[];
for(var i=this.series.length-1;i>=0;i--){
var _2d4=this.series[i],run=_2d4.data;
if(run!==null){
var _2e1=[],k=0,_2e2=[];
for(var key in run){
var data=this.datas[key],min=data.min,max=data.max,_2df=max-min,_2e3=run[key],end=_2c5+2*Math.PI*k/len,_2d8=this._getCoordinate(_2d3,r*(ro+(1-ro)*(_2e3-min)/_2df),end);
_2e1.push(_2d8);
_2e2.push({sname:_2d4.name,key:key,data:_2e3});
k++;
}
_2e1[_2e1.length]=_2e1[0];
_2e2[_2e2.length]=_2e2[0];
var _2e4=this._getBoundary(_2e1),_2e5=t.next("spider",[o,_2d4]),ts=_2d4.group,f=g.normalizeColor(_2e5.series.fill),sk={color:_2e5.series.fill,width:_2c2};
f.a=o.seriesFillAlpha;
_2d4.dyn={fill:f,stroke:sk};
var osps=this.oldSeriePoints[_2d4.name];
var cs=this._createSeriesEntry(ts,(osps||_2cc),_2e1,f,sk,r,ro,ms,at);
this.chart.seriesShapes[_2d4.name]=cs;
this.oldSeriePoints[_2d4.name]=_2e1;
var po={element:"spider_poly",index:i,id:"spider_poly_"+_2d4.name,run:_2d4,plot:this,shape:cs.poly,parent:ts,brect:_2e4,cx:_2d3.cx,cy:_2d3.cy,cr:r,f:f,s:s};
this._connectEvents(po);
var so={element:"spider_plot",index:i,id:"spider_plot_"+_2d4.name,run:_2d4,plot:this,shape:_2d4.group};
this._connectEvents(so);
dojo.forEach(cs.circles,function(c,i){
var _2e6=c.getShape(),co={element:"spider_circle",index:i,id:"spider_circle_"+_2d4.name+i,run:_2d4,plot:this,shape:c,parent:ts,tdata:_2e2[i],cx:_2e1[i].x,cy:_2e1[i].y,f:f,s:s};
this._connectEvents(co);
},this);
}
}
return this;
},_createSeriesEntry:function(ts,osps,sps,f,sk,r,ro,ms,at){
var _2e7=ts.createPolyline(osps).setFill(f).setStroke(sk),_2e8=[];
for(var j=0;j<osps.length;j++){
var _2e9=osps[j],cr=ms;
var _2ea=ts.createCircle({cx:_2e9.x,cy:_2e9.y,r:cr}).setFill(f).setStroke(sk);
_2e8.push(_2ea);
}
var _2eb=dojo.map(sps,function(np,j){
var sp=osps[j],anim=new dojo._Animation({duration:1000,easing:at,curve:[sp.y,np.y]});
var spl=_2e7,sc=_2e8[j];
dojo.connect(anim,"onAnimate",function(y){
var _2ec=spl.getShape();
_2ec.points[j].y=y;
spl.setShape(_2ec);
var _2ed=sc.getShape();
_2ed.cy=y;
sc.setShape(_2ed);
});
return anim;
});
var _2ee=dojo.map(sps,function(np,j){
var sp=osps[j],anim=new dojo._Animation({duration:1000,easing:at,curve:[sp.x,np.x]});
var spl=_2e7,sc=_2e8[j];
dojo.connect(anim,"onAnimate",function(x){
var _2ef=spl.getShape();
_2ef.points[j].x=x;
spl.setShape(_2ef);
var _2f0=sc.getShape();
_2f0.cx=x;
sc.setShape(_2f0);
});
return anim;
});
var _2f1=dojo.fx.combine(_2eb.concat(_2ee));
_2f1.play();
return {group:ts,poly:_2e7,circles:_2e8};
},plotEvent:function(o){
var _2f2=o.id?o.id:"default",a;
if(_2f2 in this.animations){
a=this.animations[_2f2];
a.anim&&a.anim.stop(true);
}else{
a=this.animations[_2f2]={};
}
if(o.element=="spider_poly"){
if(!a.color){
var _2f3=o.shape.getFill();
if(!_2f3||!(_2f3 instanceof dojo.Color)){
return;
}
a.color={start:_2f3,end:_2f4(_2f3)};
}
var _2f5=a.color.start,end=a.color.end;
if(o.type=="onmouseout"){
var t=_2f5;
_2f5=end;
end=t;
}
a.anim=dojox.gfx.fx.animateFill({shape:o.shape,duration:800,easing:dojo.fx.easing.backOut,color:{start:_2f5,end:end}});
a.anim.play();
}else{
if(o.element=="spider_circle"){
var init,_2f6,_2f7=1.5;
if(o.type=="onmouseover"){
init=dojox.gfx.matrix.identity;
_2f6=_2f7;
var _2f8={type:"rect"};
_2f8.x=o.cx;
_2f8.y=o.cy;
_2f8.width=_2f8.height=1;
var lt=dojo.coords(this.chart.node,true);
_2f8.x+=lt.x;
_2f8.y+=lt.y;
_2f8.x=Math.round(_2f8.x);
_2f8.y=Math.round(_2f8.y);
_2f8.width=Math.ceil(_2f8.width);
_2f8.height=Math.ceil(_2f8.height);
this.aroundRect=_2f8;
var _2f9=["after","before"];
if(dijit&&dijit.Tooltip){
dijit.showTooltip(o.tdata.sname+"<br/>"+o.tdata.key+"<br/>"+o.tdata.data,this.aroundRect,_2f9);
}
}else{
init=dojox.gfx.matrix.scaleAt(_2f7,o.cx,o.cy);
_2f6=1/_2f7;
if(dijit&&dijit.Tooltip){
this.aroundRect&&dijit.hideTooltip(this.aroundRect);
}
}
var cs=o.shape.getShape(),init=m.scaleAt(_2f7,cs.cx,cs.cy),_2fa={shape:o.shape,duration:200,easing:dojo.fx.easing.backOut,transform:[{name:"scaleAt",start:[1,cs.cx,cs.cy],end:[_2f6,cs.cx,cs.cy]},init]};
a.anim=dojox.gfx.fx.animateTransform(_2fa);
a.anim.play();
}else{
if(o.element=="spider_plot"){
if(o.type=="onmouseover"&&!dojo.isIE){
o.shape.moveToFront();
}
}
}
}
},_getBoundary:function(_2fb){
var xmax=_2fb[0].x,xmin=_2fb[0].x,ymax=_2fb[0].y,ymin=_2fb[0].y;
for(var i=0;i<_2fb.length;i++){
var _2fc=_2fb[i];
xmax=Math.max(_2fc.x,xmax);
ymax=Math.max(_2fc.y,ymax);
xmin=Math.min(_2fc.x,xmin);
ymin=Math.min(_2fc.y,ymin);
}
return {x:xmin,y:ymin,width:xmax-xmin,height:ymax-ymin};
},_drawArrow:function(s,_2fd,end,_2fe){
var len=Math.sqrt(Math.pow(end.x-_2fd.x,2)+Math.pow(end.y-_2fd.y,2)),sin=(end.y-_2fd.y)/len,cos=(end.x-_2fd.x)/len,_2ff={x:end.x+(len/3)*(-sin),y:end.y+(len/3)*cos},_300={x:end.x+(len/3)*sin,y:end.y+(len/3)*(-cos)};
s.createPolyline([_2fd,_2ff,_300]).setFill(_2fe.color).setStroke(_2fe);
},_buildPoints:function(_301,_302,_303,_304,_305,_306){
for(var i=0;i<_302;i++){
var end=_305+2*Math.PI*i/_302;
_301.push(this._getCoordinate(_303,_304,end));
}
if(_306){
_301.push(this._getCoordinate(_303,_304,_305+2*Math.PI));
}
},_getCoordinate:function(_307,_308,_309){
return {x:_307.cx+_308*Math.cos(_309),y:_307.cy+_308*Math.sin(_309)};
},_getObjectLength:function(obj){
var _30a=0;
if(dojo.isObject(obj)){
for(var key in obj){
_30a++;
}
}
return _30a;
},_getLabel:function(_30b){
return dc.getLabel(_30b,this.opt.fixed,this.opt.precision);
}});
function _2f4(_30c){
var a=new dojox.color.Color(_30c),x=a.toHsl();
if(x.s==0){
x.l=x.l<50?100:0;
}else{
x.s=100;
if(x.l<50){
x.l=75;
}else{
if(x.l>75){
x.l=50;
}else{
x.l=x.l-50>75-x.l?50:75;
}
}
}
var _30c=dojox.color.fromHsl(x);
_30c.a=0.7;
return _30c;
};
})();
}
if(!dojo._hasResource["dojox.lang.functional.fold"]){
dojo._hasResource["dojox.lang.functional.fold"]=true;
dojo.provide("dojox.lang.functional.fold");
(function(){
var d=dojo,df=dojox.lang.functional,_30d={};
d.mixin(df,{foldl:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var i,n;
if(d.isArray(a)){
for(i=0,n=a.length;i<n;z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(i=0;a.hasNext();z=f.call(o,z,a.next(),i++,a)){
}
}else{
for(i in a){
if(!(i in _30d)){
z=f.call(o,z,a[i],i,a);
}
}
}
}
return z;
},foldl1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var z,i,n;
if(d.isArray(a)){
z=a[0];
for(i=1,n=a.length;i<n;z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
if(a.hasNext()){
z=a.next();
for(i=1;a.hasNext();z=f.call(o,z,a.next(),i++,a)){
}
}
}else{
var _30e=true;
for(i in a){
if(!(i in _30d)){
if(_30e){
z=a[i];
_30e=false;
}else{
z=f.call(o,z,a[i],i,a);
}
}
}
}
}
return z;
},foldr:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length;i>0;--i,z=f.call(o,z,a[i],i,a)){
}
return z;
},foldr1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,z=a[n-1],i=n-1;
for(;i>0;--i,z=f.call(o,z,a[i],i,a)){
}
return z;
},reduce:function(a,f,z){
return arguments.length<3?df.foldl1(a,f):df.foldl(a,f,z);
},reduceRight:function(a,f,z){
return arguments.length<3?df.foldr1(a,f):df.foldr(a,f,z);
},unfold:function(pr,f,g,z,o){
o=o||d.global;
f=df.lambda(f);
g=df.lambda(g);
pr=df.lambda(pr);
var t=[];
for(;!pr.call(o,z);t.push(f.call(o,z)),z=g.call(o,z)){
}
return t;
}});
})();
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
dojo.mixin(dojox.color,{fromCmy:function(cyan,_30f,_310){
if(dojo.isArray(cyan)){
_30f=cyan[1],_310=cyan[2],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_30f=cyan.m,_310=cyan.y,cyan=cyan.c;
}
}
cyan/=100,_30f/=100,_310/=100;
var r=1-cyan,g=1-_30f,b=1-_310;
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromCmyk:function(cyan,_311,_312,_313){
if(dojo.isArray(cyan)){
_311=cyan[1],_312=cyan[2],_313=cyan[3],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_311=cyan.m,_312=cyan.y,_313=cyan.b,cyan=cyan.c;
}
}
cyan/=100,_311/=100,_312/=100,_313/=100;
var r,g,b;
r=1-Math.min(1,cyan*(1-_313)+_313);
g=1-Math.min(1,_311*(1-_313)+_313);
b=1-Math.min(1,_312*(1-_313)+_313);
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsl:function(hue,_314,_315){
if(dojo.isArray(hue)){
_314=hue[1],_315=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_314=hue.s,_315=hue.l,hue=hue.h;
}
}
_314/=100;
_315/=100;
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
r=2*_314*Math.min(r,1)+(1-_314);
g=2*_314*Math.min(g,1)+(1-_314);
b=2*_314*Math.min(b,1)+(1-_314);
if(_315<0.5){
r*=_315,g*=_315,b*=_315;
}else{
r=(1-_315)*r+2*_315-1;
g=(1-_315)*g+2*_315-1;
b=(1-_315)*b+2*_315-1;
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsv:function(hue,_316,_317){
if(dojo.isArray(hue)){
_316=hue[1],_317=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_316=hue.s,_317=hue.v,hue=hue.h;
}
}
if(hue==360){
hue=0;
}
_316/=100;
_317/=100;
var r,g,b;
if(_316==0){
r=_317,b=_317,g=_317;
}else{
var _318=hue/60,i=Math.floor(_318),f=_318-i;
var p=_317*(1-_316);
var q=_317*(1-(_316*f));
var t=_317*(1-(_316*(1-f)));
switch(i){
case 0:
r=_317,g=t,b=p;
break;
case 1:
r=q,g=_317,b=p;
break;
case 2:
r=p,g=_317,b=t;
break;
case 3:
r=p,g=q,b=_317;
break;
case 4:
r=t,g=p,b=_317;
break;
case 5:
r=_317,g=p,b=q;
break;
}
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
}});
dojo.extend(dojox.color.Color,{toCmy:function(){
var cyan=1-(this.r/255),_319=1-(this.g/255),_31a=1-(this.b/255);
return {c:Math.round(cyan*100),m:Math.round(_319*100),y:Math.round(_31a*100)};
},toCmyk:function(){
var cyan,_31b,_31c,_31d;
var r=this.r/255,g=this.g/255,b=this.b/255;
_31d=Math.min(1-r,1-g,1-b);
cyan=(1-r-_31d)/(1-_31d);
_31b=(1-g-_31d)/(1-_31d);
_31c=(1-b-_31d)/(1-_31d);
return {c:Math.round(cyan*100),m:Math.round(_31b*100),y:Math.round(_31c*100),b:Math.round(_31d*100)};
},toHsl:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _31e=max-min;
var h=0,s=0,l=(min+max)/2;
if(l>0&&l<1){
s=_31e/((l<0.5)?(2*l):(2-2*l));
}
if(_31e>0){
if(max==r&&max!=g){
h+=(g-b)/_31e;
}
if(max==g&&max!=b){
h+=(2+(b-r)/_31e);
}
if(max==b&&max!=r){
h+=(4+(r-g)/_31e);
}
h*=60;
}
return {h:h,s:Math.round(s*100),l:Math.round(l*100)};
},toHsv:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _31f=max-min;
var h=null,s=(max==0)?0:(_31f/max);
if(s==0){
h=0;
}else{
if(r==max){
h=60*(g-b)/_31f;
}else{
if(g==max){
h=120+60*(b-r)/_31f;
}else{
h=240+60*(r-g)/_31f;
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
if(!dojo._hasResource["dojox.color.Palette"]){
dojo._hasResource["dojox.color.Palette"]=true;
dojo.provide("dojox.color.Palette");
(function(){
var dxc=dojox.color;
dxc.Palette=function(base){
this.colors=[];
if(base instanceof dojox.color.Palette){
this.colors=base.colors.slice(0);
}else{
if(base instanceof dojox.color.Color){
this.colors=[null,null,base,null,null];
}else{
if(dojo.isArray(base)){
this.colors=dojo.map(base.slice(0),function(item){
if(dojo.isString(item)){
return new dojox.color.Color(item);
}
return item;
});
}else{
if(dojo.isString(base)){
this.colors=[null,null,new dojox.color.Color(base),null,null];
}
}
}
}
};
function _320(p,_321,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var r=(_321=="dr")?item.r+val:item.r,g=(_321=="dg")?item.g+val:item.g,b=(_321=="db")?item.b+val:item.b,a=(_321=="da")?item.a+val:item.a;
ret.colors.push(new dojox.color.Color({r:Math.min(255,Math.max(0,r)),g:Math.min(255,Math.max(0,g)),b:Math.min(255,Math.max(0,b)),a:Math.min(1,Math.max(0,a))}));
});
return ret;
};
function tCMY(p,_322,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toCmy(),c=(_322=="dc")?o.c+val:o.c,m=(_322=="dm")?o.m+val:o.m,y=(_322=="dy")?o.y+val:o.y;
ret.colors.push(dojox.color.fromCmy(Math.min(100,Math.max(0,c)),Math.min(100,Math.max(0,m)),Math.min(100,Math.max(0,y))));
});
return ret;
};
function _323(p,_324,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toCmyk(),c=(_324=="dc")?o.c+val:o.c,m=(_324=="dm")?o.m+val:o.m,y=(_324=="dy")?o.y+val:o.y,k=(_324=="dk")?o.b+val:o.b;
ret.colors.push(dojox.color.fromCmyk(Math.min(100,Math.max(0,c)),Math.min(100,Math.max(0,m)),Math.min(100,Math.max(0,y)),Math.min(100,Math.max(0,k))));
});
return ret;
};
function tHSL(p,_325,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toHsl(),h=(_325=="dh")?o.h+val:o.h,s=(_325=="ds")?o.s+val:o.s,l=(_325=="dl")?o.l+val:o.l;
ret.colors.push(dojox.color.fromHsl(h%360,Math.min(100,Math.max(0,s)),Math.min(100,Math.max(0,l))));
});
return ret;
};
function tHSV(p,_326,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toHsv(),h=(_326=="dh")?o.h+val:o.h,s=(_326=="ds")?o.s+val:o.s,v=(_326=="dv")?o.v+val:o.v;
ret.colors.push(dojox.color.fromHsv(h%360,Math.min(100,Math.max(0,s)),Math.min(100,Math.max(0,v))));
});
return ret;
};
function _327(val,low,high){
return high-((high-val)*((high-low)/high));
};
dojo.extend(dxc.Palette,{transform:function(_328){
var fn=_320;
if(_328.use){
var use=_328.use.toLowerCase();
if(use.indexOf("hs")==0){
if(use.charAt(2)=="l"){
fn=tHSL;
}else{
fn=tHSV;
}
}else{
if(use.indexOf("cmy")==0){
if(use.charAt(3)=="k"){
fn=_323;
}else{
fn=tCMY;
}
}
}
}else{
if("dc" in _328||"dm" in _328||"dy" in _328){
if("dk" in _328){
fn=_323;
}else{
fn=tCMY;
}
}else{
if("dh" in _328||"ds" in _328){
if("dv" in _328){
fn=tHSV;
}else{
fn=tHSL;
}
}
}
}
var _329=this;
for(var p in _328){
if(p=="use"){
continue;
}
_329=fn(_329,p,_328[p]);
}
return _329;
},clone:function(){
return new dxc.Palette(this);
}});
dojo.mixin(dxc.Palette,{generators:{analogous:function(args){
var high=args.high||60,low=args.low||18,base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h=[(hsv.h+low+360)%360,(hsv.h+Math.round(low/2)+360)%360,hsv.h,(hsv.h-Math.round(high/2)+360)%360,(hsv.h-high+360)%360];
var s1=Math.max(10,(hsv.s<=95)?hsv.s+5:(100-(hsv.s-95))),s2=(hsv.s>1)?hsv.s-1:21-hsv.s,v1=(hsv.v>=92)?hsv.v-9:Math.max(hsv.v+9,20),v2=(hsv.v<=90)?Math.max(hsv.v+5,20):(95+Math.ceil((hsv.v-90)/2)),s=[s1,s2,hsv.s,s1,s1],v=[v1,v2,hsv.v,v1,v2];
return new dxc.Palette(dojo.map(h,function(hue,i){
return dojox.color.fromHsv(hue,s[i],v[i]);
}));
},monochromatic:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var s1=(hsv.s-30>9)?hsv.s-30:hsv.s+30,s2=hsv.s,v1=_327(hsv.v,20,100),v2=(hsv.v-20>20)?hsv.v-20:hsv.v+60,v3=(hsv.v-50>20)?hsv.v-50:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(hsv.h,s1,v1),dojox.color.fromHsv(hsv.h,s2,v3),base,dojox.color.fromHsv(hsv.h,s1,v3),dojox.color.fromHsv(hsv.h,s2,v2)]);
},triadic:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=(hsv.h+57+360)%360,h2=(hsv.h-157+360)%360,s1=(hsv.s>20)?hsv.s-10:hsv.s+10,s2=(hsv.s>90)?hsv.s-10:hsv.s+10,s3=(hsv.s>95)?hsv.s-5:hsv.s+5,v1=(hsv.v-20>20)?hsv.v-20:hsv.v+20,v2=(hsv.v-30>20)?hsv.v-30:hsv.v+30,v3=(hsv.v-30>70)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(h1,s1,hsv.v),dojox.color.fromHsv(hsv.h,s2,v2),base,dojox.color.fromHsv(h2,s2,v1),dojox.color.fromHsv(h2,s3,v3)]);
},complementary:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=((hsv.h*2)+137<360)?(hsv.h*2)+137:Math.floor(hsv.h/2)-137,s1=Math.max(hsv.s-10,0),s2=_327(hsv.s,10,100),s3=Math.min(100,hsv.s+20),v1=Math.min(100,hsv.v+30),v2=(hsv.v>20)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(hsv.h,s1,v1),dojox.color.fromHsv(hsv.h,s2,v2),base,dojox.color.fromHsv(h1,s3,v2),dojox.color.fromHsv(h1,hsv.s,hsv.v)]);
},splitComplementary:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,_32a=args.da||30,hsv=base.toHsv();
var _32b=((hsv.h*2)+137<360)?(hsv.h*2)+137:Math.floor(hsv.h/2)-137,h1=(_32b-_32a+360)%360,h2=(_32b+_32a)%360,s1=Math.max(hsv.s-10,0),s2=_327(hsv.s,10,100),s3=Math.min(100,hsv.s+20),v1=Math.min(100,hsv.v+30),v2=(hsv.v>20)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(h1,s1,v1),dojox.color.fromHsv(h1,s2,v2),base,dojox.color.fromHsv(h2,s3,v2),dojox.color.fromHsv(h2,hsv.s,hsv.v)]);
},compound:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=((hsv.h*2)+18<360)?(hsv.h*2)+18:Math.floor(hsv.h/2)-18,h2=((hsv.h*2)+120<360)?(hsv.h*2)+120:Math.floor(hsv.h/2)-120,h3=((hsv.h*2)+99<360)?(hsv.h*2)+99:Math.floor(hsv.h/2)-99,s1=(hsv.s-40>10)?hsv.s-40:hsv.s+40,s2=(hsv.s-10>80)?hsv.s-10:hsv.s+10,s3=(hsv.s-25>10)?hsv.s-25:hsv.s+25,v1=(hsv.v-40>10)?hsv.v-40:hsv.v+40,v2=(hsv.v-20>80)?hsv.v-20:hsv.v+20,v3=Math.max(hsv.v,20);
return new dxc.Palette([dojox.color.fromHsv(h1,s1,v1),dojox.color.fromHsv(h1,s2,v2),base,dojox.color.fromHsv(h2,s3,v3),dojox.color.fromHsv(h3,s2,v2)]);
},shades:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var s=(hsv.s==100&&hsv.v==0)?0:hsv.s,v1=(hsv.v-50>20)?hsv.v-50:hsv.v+30,v2=(hsv.v-25>=20)?hsv.v-25:hsv.v+55,v3=(hsv.v-75>=20)?hsv.v-75:hsv.v+5,v4=Math.max(hsv.v-10,20);
return new dxc.Palette([new dojox.color.fromHsv(hsv.h,s,v1),new dojox.color.fromHsv(hsv.h,s,v2),base,new dojox.color.fromHsv(hsv.h,s,v3),new dojox.color.fromHsv(hsv.h,s,v4)]);
}},generate:function(base,type){
if(dojo.isFunction(type)){
return type({base:base});
}else{
if(dxc.Palette.generators[type]){
return dxc.Palette.generators[type]({base:base});
}
}
throw new Error("dojox.color.Palette.generate: the specified generator ('"+type+"') does not exist.");
}});
})();
}
if(!dojo._hasResource["dojox.charting.Theme"]){
dojo._hasResource["dojox.charting.Theme"]=true;
dojo.provide("dojox.charting.Theme");
dojo.declare("dojox.charting.Theme",null,{shapeSpaces:{shape:1,shapeX:1,shapeY:1},constructor:function(_32c){
_32c=_32c||{};
var def=dojox.charting.Theme.defaultTheme;
dojo.forEach(["chart","plotarea","axis","series","marker"],function(name){
this[name]=dojo.delegate(def[name],_32c[name]);
},this);
if(_32c.seriesThemes&&_32c.seriesThemes.length){
this.colors=null;
this.seriesThemes=_32c.seriesThemes.slice(0);
}else{
this.seriesThemes=null;
this.colors=(_32c.colors||dojox.charting.Theme.defaultColors).slice(0);
}
this.markerThemes=null;
if(_32c.markerThemes&&_32c.markerThemes.length){
this.markerThemes=_32c.markerThemes.slice(0);
}
this.markers=_32c.markers?dojo.clone(_32c.markers):dojo.delegate(dojox.charting.Theme.defaultMarkers);
this.noGradConv=_32c.noGradConv;
this.noRadialConv=_32c.noRadialConv;
if(_32c.reverseFills){
this.reverseFills();
}
this._current=0;
this._buildMarkerArray();
},clone:function(){
var _32d=new dojox.charting.Theme({chart:this.chart,plotarea:this.plotarea,axis:this.axis,series:this.series,marker:this.marker,colors:this.colors,markers:this.markers,seriesThemes:this.seriesThemes,markerThemes:this.markerThemes,noGradConv:this.noGradConv,noRadialConv:this.noRadialConv});
dojo.forEach(["clone","clear","next","skip","addMixin","post","getTick"],function(name){
if(this.hasOwnProperty(name)){
_32d[name]=this[name];
}
},this);
return _32d;
},clear:function(){
this._current=0;
},next:function(_32e,_32f,_330){
var _331=dojox.lang.utils.merge,_332,_333;
if(this.colors){
_332=dojo.delegate(this.series);
_333=dojo.delegate(this.marker);
var _334=new dojo.Color(this.colors[this._current%this.colors.length]),old;
if(_332.stroke&&_332.stroke.color){
_332.stroke=dojo.delegate(_332.stroke);
old=new dojo.Color(_332.stroke.color);
_332.stroke.color=new dojo.Color(_334);
_332.stroke.color.a=old.a;
}else{
_332.stroke={color:_334};
}
if(_333.stroke&&_333.stroke.color){
_333.stroke=dojo.delegate(_333.stroke);
old=new dojo.Color(_333.stroke.color);
_333.stroke.color=new dojo.Color(_334);
_333.stroke.color.a=old.a;
}else{
_333.stroke={color:_334};
}
if(!_332.fill||_332.fill.type){
_332.fill=_334;
}else{
old=new dojo.Color(_332.fill);
_332.fill=new dojo.Color(_334);
_332.fill.a=old.a;
}
if(!_333.fill||_333.fill.type){
_333.fill=_334;
}else{
old=new dojo.Color(_333.fill);
_333.fill=new dojo.Color(_334);
_333.fill.a=old.a;
}
}else{
_332=this.seriesThemes?_331(this.series,this.seriesThemes[this._current%this.seriesThemes.length]):this.series;
_333=this.markerThemes?_331(this.marker,this.markerThemes[this._current%this.markerThemes.length]):_332;
}
var _335=_333&&_333.symbol||this._markers[this._current%this._markers.length];
var _336={series:_332,marker:_333,symbol:_335};
++this._current;
if(_32f){
_336=this.addMixin(_336,_32e,_32f);
}
if(_330){
_336=this.post(_336,_32e);
}
return _336;
},skip:function(){
++this._current;
},addMixin:function(_337,_338,_339,_33a){
if(dojo.isArray(_339)){
dojo.forEach(_339,function(m){
_337=this.addMixin(_337,_338,m);
},this);
}else{
var t={};
if("color" in _339){
if(_338=="line"||_338=="area"){
dojo.setObject("series.stroke.color",_339.color,t);
dojo.setObject("marker.stroke.color",_339.color,t);
}else{
dojo.setObject("series.fill",_339.color,t);
}
}
dojo.forEach(["stroke","outline","shadow","fill","font","fontColor","labelWiring"],function(name){
var _33b="marker"+name.charAt(0).toUpperCase()+name.substr(1),b=_33b in _339;
if(name in _339){
dojo.setObject("series."+name,_339[name],t);
if(!b){
dojo.setObject("marker."+name,_339[name],t);
}
}
if(b){
dojo.setObject("marker."+name,_339[_33b],t);
}
});
if("marker" in _339){
t.symbol=_339.marker;
}
_337=dojox.lang.utils.merge(_337,t);
}
if(_33a){
_337=this.post(_337,_338);
}
return _337;
},post:function(_33c,_33d){
var fill=_33c.series.fill,t;
if(!this.noGradConv&&this.shapeSpaces[fill.space]&&fill.type=="linear"){
if(_33d=="bar"){
t={x1:fill.y1,y1:fill.x1,x2:fill.y2,y2:fill.x2};
}else{
if(!this.noRadialConv&&fill.space=="shape"&&(_33d=="slice"||_33d=="circle")){
t={type:"radial",cx:0,cy:0,r:100};
}
}
if(t){
return dojox.lang.utils.merge(_33c,{series:{fill:t}});
}
}
return _33c;
},getTick:function(name,_33e){
var tick=this.axis.tick,_33f=name+"Tick";
merge=dojox.lang.utils.merge;
if(tick){
if(this.axis[_33f]){
tick=merge(tick,this.axis[_33f]);
}
}else{
tick=this.axis[_33f];
}
if(_33e){
if(tick){
if(_33e[_33f]){
tick=merge(tick,_33e[_33f]);
}
}else{
tick=_33e[_33f];
}
}
return tick;
},inspectObjects:function(f){
dojo.forEach(["chart","plotarea","axis","series","marker"],function(name){
f(this[name]);
},this);
if(this.seriesThemes){
dojo.forEach(this.seriesThemes,f);
}
if(this.markerThemes){
dojo.forEach(this.markerThemes,f);
}
},reverseFills:function(){
this.inspectObjects(function(o){
if(o&&o.fill){
o.fill=dojox.gfx.gradutils.reverse(o.fill);
}
});
},addMarker:function(name,_340){
this.markers[name]=_340;
this._buildMarkerArray();
},setMarkers:function(obj){
this.markers=obj;
this._buildMarkerArray();
},_buildMarkerArray:function(){
this._markers=[];
for(var p in this.markers){
this._markers.push(this.markers[p]);
}
}});
dojo.mixin(dojox.charting.Theme,{defaultMarkers:{CIRCLE:"m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0",SQUARE:"m-3,-3 l0,6 6,0 0,-6 z",DIAMOND:"m0,-3 l3,3 -3,3 -3,-3 z",CROSS:"m0,-3 l0,6 m-3,-3 l6,0",X:"m-3,-3 l6,6 m0,-6 l-6,6",TRIANGLE:"m-3,3 l3,-6 3,6 z",TRIANGLE_INVERTED:"m-3,-3 l3,6 3,-6 z"},defaultColors:["#54544c","#858e94","#6e767a","#948585","#474747"],defaultTheme:{chart:{stroke:null,fill:"white",pageStyle:null,titleGap:20,titlePos:"top",titleFont:"normal normal bold 14pt Tahoma",titleFontColor:"#333"},plotarea:{stroke:null,fill:"white"},axis:{stroke:{color:"#333",width:1},tick:{color:"#666",position:"center",font:"normal normal normal 7pt Tahoma",fontColor:"#333",titleGap:15,titleFont:"normal normal normal 11pt Tahoma",titleFontColor:"#333",titleOrientation:"axis"},majorTick:{width:1,length:6},minorTick:{width:0.8,length:3},microTick:{width:0.5,length:1}},series:{stroke:{width:1.5,color:"#333"},outline:{width:0.1,color:"#ccc"},shadow:null,fill:"#ccc",font:"normal normal normal 8pt Tahoma",fontColor:"#000",labelWiring:{width:1,color:"#ccc"}},marker:{stroke:{width:1.5,color:"#333"},outline:{width:0.1,color:"#ccc"},shadow:null,fill:"#ccc",font:"normal normal normal 8pt Tahoma",fontColor:"#000"}},defineColors:function(_341){
_341=_341||{};
var c=[],n=_341.num||5;
if(_341.colors){
var l=_341.colors.length;
for(var i=0;i<n;i++){
c.push(_341.colors[i%l]);
}
return c;
}
if(_341.hue){
var s=_341.saturation||100;
var st=_341.low||30;
var end=_341.high||90;
var l=(end+st)/2;
return dojox.color.Palette.generate(dojox.color.fromHsv(_341.hue,s,l),"monochromatic").colors;
}
if(_341.generator){
return dojox.color.Palette.generate(_341.base,_341.generator).colors;
}
return c;
},generateGradient:function(_342,_343,_344){
var fill=dojo.delegate(_342);
fill.colors=[{offset:0,color:_343},{offset:1,color:_344}];
return fill;
},generateHslColor:function(_345,_346){
_345=new dojox.color.Color(_345);
var hsl=_345.toHsl(),_347=dojox.color.fromHsl(hsl.h,hsl.s,_346);
_347.a=_345.a;
return _347;
},generateHslGradient:function(_348,_349,_34a,_34b){
_348=new dojox.color.Color(_348);
var hsl=_348.toHsl(),_34c=dojox.color.fromHsl(hsl.h,hsl.s,_34a),_34d=dojox.color.fromHsl(hsl.h,hsl.s,_34b);
_34c.a=_34d.a=_348.a;
return dojox.charting.Theme.generateGradient(_349,_34c,_34d);
}});
}
if(!dojo._hasResource["dojox.charting.Series"]){
dojo._hasResource["dojox.charting.Series"]=true;
dojo.provide("dojox.charting.Series");
dojo.declare("dojox.charting.Series",dojox.charting.Element,{constructor:function(_34e,data,_34f){
dojo.mixin(this,_34f);
if(typeof this.plot!="string"){
this.plot="default";
}
this.update(data);
},clear:function(){
this.dyn={};
},update:function(data){
if(dojo.isArray(data)){
this.data=data;
}else{
this.source=data;
this.data=this.source.data;
if(this.source.setSeriesObject){
this.source.setSeriesObject(this);
}
}
this.dirty=true;
this.clear();
}});
}
if(!dojo._hasResource["dojox.charting.Chart"]){
dojo._hasResource["dojox.charting.Chart"]=true;
dojo.provide("dojox.charting.Chart");
(function(){
var df=dojox.lang.functional,dc=dojox.charting,g=dojox.gfx,_350=df.lambda("item.clear()"),_351=df.lambda("item.purgeGroup()"),_352=df.lambda("item.destroy()"),_353=df.lambda("item.dirty = false"),_354=df.lambda("item.dirty = true"),_355=df.lambda("item.name");
dojo.declare("dojox.charting.Chart",null,{constructor:function(node,_356){
if(!_356){
_356={};
}
this.margins=_356.margins?_356.margins:{l:10,t:10,r:10,b:10};
this.stroke=_356.stroke;
this.fill=_356.fill;
this.delayInMs=_356.delayInMs||200;
this.title=_356.title;
this.titleGap=_356.titleGap;
this.titlePos=_356.titlePos;
this.titleFont=_356.titleFont;
this.titleFontColor=_356.titleFontColor;
this.chartTitle=null;
this.theme=null;
this.axes={};
this.stack=[];
this.plots={};
this.series=[];
this.runs={};
this.dirty=true;
this.coords=null;
this.node=dojo.byId(node);
var box=dojo.marginBox(node);
this.surface=g.createSurface(this.node,box.w||400,box.h||300);
},destroy:function(){
dojo.forEach(this.series,_352);
dojo.forEach(this.stack,_352);
df.forIn(this.axes,_352);
if(this.chartTitle&&this.chartTitle.tagName){
dojo.destroy(this.chartTitle);
}
this.surface.destroy();
},getCoords:function(){
if(!this.coords){
this.coords=dojo.coords(this.node,true);
}
return this.coords;
},setTheme:function(_357){
this.theme=_357.clone();
this.dirty=true;
return this;
},addAxis:function(name,_358){
var axis,_359=_358&&_358.type||"Default";
if(typeof _359=="string"){
if(!dc.axis2d||!dc.axis2d[_359]){
throw Error("Can't find axis: "+_359+" - didn't you forget to dojo"+".require() it?");
}
axis=new dc.axis2d[_359](this,_358);
}else{
axis=new _359(this,_358);
}
axis.name=name;
axis.dirty=true;
if(name in this.axes){
this.axes[name].destroy();
}
this.axes[name]=axis;
this.dirty=true;
return this;
},getAxis:function(name){
return this.axes[name];
},removeAxis:function(name){
if(name in this.axes){
this.axes[name].destroy();
delete this.axes[name];
this.dirty=true;
}
return this;
},addPlot:function(name,_35a){
var plot,_35b=_35a&&_35a.type||"Default";
if(typeof _35b=="string"){
if(!dc.plot2d||!dc.plot2d[_35b]){
throw Error("Can't find plot: "+_35b+" - didn't you forget to dojo"+".require() it?");
}
plot=new dc.plot2d[_35b](this,_35a);
}else{
plot=new _35b(this,_35a);
}
plot.name=name;
plot.dirty=true;
if(name in this.plots){
this.stack[this.plots[name]].destroy();
this.stack[this.plots[name]]=plot;
}else{
this.plots[name]=this.stack.length;
this.stack.push(plot);
}
this.dirty=true;
return this;
},removePlot:function(name){
if(name in this.plots){
var _35c=this.plots[name];
delete this.plots[name];
this.stack[_35c].destroy();
this.stack.splice(_35c,1);
df.forIn(this.plots,function(idx,name,_35d){
if(idx>_35c){
_35d[name]=idx-1;
}
});
var ns=dojo.filter(this.series,function(run){
return run.plot!=name;
});
if(ns.length<this.series.length){
dojo.forEach(this.series,function(run){
if(run.plot==name){
run.destroy();
}
});
this.runs={};
dojo.forEach(ns,function(run,_35e){
this.runs[run.plot]=_35e;
},this);
this.series=ns;
}
this.dirty=true;
}
return this;
},getPlotOrder:function(){
return df.map(this.stack,_355);
},setPlotOrder:function(_35f){
var _360={},_361=df.filter(_35f,function(name){
if(!(name in this.plots)||(name in _360)){
return false;
}
_360[name]=1;
return true;
},this);
if(_361.length<this.stack.length){
df.forEach(this.stack,function(plot){
var name=plot.name;
if(!(name in _360)){
_361.push(name);
}
});
}
var _362=df.map(_361,function(name){
return this.stack[this.plots[name]];
},this);
df.forEach(_362,function(plot,i){
this.plots[plot.name]=i;
},this);
this.stack=_362;
this.dirty=true;
return this;
},movePlotToFront:function(name){
if(name in this.plots){
var _363=this.plots[name];
if(_363){
var _364=this.getPlotOrder();
_364.splice(_363,1);
_364.unshift(name);
return this.setPlotOrder(_364);
}
}
return this;
},movePlotToBack:function(name){
if(name in this.plots){
var _365=this.plots[name];
if(_365<this.stack.length-1){
var _366=this.getPlotOrder();
_366.splice(_365,1);
_366.push(name);
return this.setPlotOrder(_366);
}
}
return this;
},addSeries:function(name,data,_367){
var run=new dc.Series(this,data,_367);
run.name=name;
if(name in this.runs){
this.series[this.runs[name]].destroy();
this.series[this.runs[name]]=run;
}else{
this.runs[name]=this.series.length;
this.series.push(run);
}
this.dirty=true;
if(!("ymin" in run)&&"min" in run){
run.ymin=run.min;
}
if(!("ymax" in run)&&"max" in run){
run.ymax=run.max;
}
return this;
},removeSeries:function(name){
if(name in this.runs){
var _368=this.runs[name];
delete this.runs[name];
this.series[_368].destroy();
this.series.splice(_368,1);
df.forIn(this.runs,function(idx,name,runs){
if(idx>_368){
runs[name]=idx-1;
}
});
this.dirty=true;
}
return this;
},updateSeries:function(name,data){
if(name in this.runs){
var run=this.series[this.runs[name]];
run.update(data);
this._invalidateDependentPlots(run.plot,false);
this._invalidateDependentPlots(run.plot,true);
}
return this;
},getSeriesOrder:function(_369){
return df.map(df.filter(this.series,function(run){
return run.plot==_369;
}),_355);
},setSeriesOrder:function(_36a){
var _36b,_36c={},_36d=df.filter(_36a,function(name){
if(!(name in this.runs)||(name in _36c)){
return false;
}
var run=this.series[this.runs[name]];
if(_36b){
if(run.plot!=_36b){
return false;
}
}else{
_36b=run.plot;
}
_36c[name]=1;
return true;
},this);
df.forEach(this.series,function(run){
var name=run.name;
if(!(name in _36c)&&run.plot==_36b){
_36d.push(name);
}
});
var _36e=df.map(_36d,function(name){
return this.series[this.runs[name]];
},this);
this.series=_36e.concat(df.filter(this.series,function(run){
return run.plot!=_36b;
}));
df.forEach(this.series,function(run,i){
this.runs[run.name]=i;
},this);
this.dirty=true;
return this;
},moveSeriesToFront:function(name){
if(name in this.runs){
var _36f=this.runs[name],_370=this.getSeriesOrder(this.series[_36f].plot);
if(name!=_370[0]){
_370.splice(_36f,1);
_370.unshift(name);
return this.setSeriesOrder(_370);
}
}
return this;
},moveSeriesToBack:function(name){
if(name in this.runs){
var _371=this.runs[name],_372=this.getSeriesOrder(this.series[_371].plot);
if(name!=_372[_372.length-1]){
_372.splice(_371,1);
_372.push(name);
return this.setSeriesOrder(_372);
}
}
return this;
},resize:function(_373,_374){
var box;
switch(arguments.length){
case 1:
box=dojo.mixin({},_373);
dojo.marginBox(this.node,box);
break;
case 2:
box={w:_373,h:_374};
dojo.marginBox(this.node,box);
break;
}
box=dojo.marginBox(this.node);
this.surface.setDimensions(box.w,box.h);
this.dirty=true;
this.coords=null;
return this.render();
},getGeometry:function(){
var ret={};
df.forIn(this.axes,function(axis){
if(axis.initialized()){
ret[axis.name]={name:axis.name,vertical:axis.vertical,scaler:axis.scaler,ticks:axis.ticks};
}
});
return ret;
},setAxisWindow:function(name,_375,_376,zoom){
var axis=this.axes[name];
if(axis){
axis.setWindow(_375,_376);
dojo.forEach(this.stack,function(plot){
if(plot.hAxis==name||plot.vAxis==name){
plot.zoom=zoom;
}
});
}
return this;
},setWindow:function(sx,sy,dx,dy,zoom){
if(!("plotArea" in this)){
this.calculateGeometry();
}
df.forIn(this.axes,function(axis){
var _377,_378,_379=axis.getScaler().bounds,s=_379.span/(_379.upper-_379.lower);
if(axis.vertical){
_377=sy;
_378=dy/s/_377;
}else{
_377=sx;
_378=dx/s/_377;
}
axis.setWindow(_377,_378);
});
dojo.forEach(this.stack,function(plot){
plot.zoom=zoom;
});
return this;
},zoomIn:function(name,_37a){
var axis=this.axes[name];
if(axis){
var _37b,_37c,_37d=axis.getScaler().bounds;
var _37e=Math.min(_37a[0],_37a[1]);
var _37f=Math.max(_37a[0],_37a[1]);
_37e=_37a[0]<_37d.lower?_37d.lower:_37e;
_37f=_37a[1]>_37d.upper?_37d.upper:_37f;
_37b=(_37d.upper-_37d.lower)/(_37f-_37e);
_37c=_37e-_37d.lower;
this.setAxisWindow(name,_37b,_37c);
this.render();
}
},calculateGeometry:function(){
if(this.dirty){
return this.fullGeometry();
}
var _380=dojo.filter(this.stack,function(plot){
return plot.dirty||(plot.hAxis&&this.axes[plot.hAxis].dirty)||(plot.vAxis&&this.axes[plot.vAxis].dirty);
},this);
_381(_380,this.plotArea);
return this;
},fullGeometry:function(){
this._makeDirty();
dojo.forEach(this.stack,_350);
if(!this.theme){
this.setTheme(new dojox.charting.Theme(dojox.charting._def));
}
dojo.forEach(this.series,function(run){
if(!(run.plot in this.plots)){
if(!dc.plot2d||!dc.plot2d.Default){
throw Error("Can't find plot: Default - didn't you forget to dojo"+".require() it?");
}
var plot=new dc.plot2d.Default(this,{});
plot.name=run.plot;
this.plots[run.plot]=this.stack.length;
this.stack.push(plot);
}
this.stack[this.plots[run.plot]].addSeries(run);
},this);
dojo.forEach(this.stack,function(plot){
if(plot.hAxis){
plot.setAxis(this.axes[plot.hAxis]);
}
if(plot.vAxis){
plot.setAxis(this.axes[plot.vAxis]);
}
},this);
var dim=this.dim=this.surface.getDimensions();
dim.width=g.normalizedLength(dim.width);
dim.height=g.normalizedLength(dim.height);
df.forIn(this.axes,_350);
_381(this.stack,dim);
var _382=this.offsets={l:0,r:0,t:0,b:0};
df.forIn(this.axes,function(axis){
df.forIn(axis.getOffsets(),function(o,i){
_382[i]+=o;
});
});
if(this.title){
this.titleGap=(this.titleGap==0)?0:this.titleGap||this.theme.chart.titleGap||20;
this.titlePos=this.titlePos||this.theme.chart.titlePos||"top";
this.titleFont=this.titleFont||this.theme.chart.titleFont;
this.titleFontColor=this.titleFontColor||this.theme.chart.titleFontColor||"black";
var _383=g.normalizedLength(g.splitFontString(this.titleFont).size);
_382[this.titlePos=="top"?"t":"b"]+=(_383+this.titleGap);
}
df.forIn(this.margins,function(o,i){
_382[i]+=o;
});
this.plotArea={width:dim.width-_382.l-_382.r,height:dim.height-_382.t-_382.b};
df.forIn(this.axes,_350);
_381(this.stack,this.plotArea);
return this;
},render:function(){
if(this.theme){
this.theme.clear();
}
if(this.dirty){
return this.fullRender();
}
this.calculateGeometry();
df.forEachRev(this.stack,function(plot){
plot.render(this.dim,this.offsets);
},this);
df.forIn(this.axes,function(axis){
axis.render(this.dim,this.offsets);
},this);
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},fullRender:function(){
this.fullGeometry();
var _384=this.offsets,dim=this.dim,rect;
dojo.forEach(this.series,_351);
df.forIn(this.axes,_351);
dojo.forEach(this.stack,_351);
if(this.chartTitle&&this.chartTitle.tagName){
dojo.destroy(this.chartTitle);
}
this.surface.clear();
this.chartTitle=null;
var t=this.theme,fill=t.plotarea&&t.plotarea.fill,_385=t.plotarea&&t.plotarea.stroke,rect={x:_384.l-1,y:_384.t-1,width:dim.width-_384.l-_384.r+2,height:dim.height-_384.t-_384.b+2};
if(fill){
fill=dc.Element.prototype._shapeFill(dc.Element.prototype._plotFill(fill,dim,_384),rect);
this.surface.createRect(rect).setFill(fill);
}
if(_385){
this.surface.createRect({x:_384.l,y:_384.t,width:dim.width-_384.l-_384.r+1,height:dim.height-_384.t-_384.b+1}).setStroke(_385);
}
df.foldr(this.stack,function(z,plot){
return plot.render(dim,_384),0;
},0);
fill=this.fill!==undefined?this.fill:(t.chart&&t.chart.fill);
_385=this.stroke!==undefined?this.stroke:(t.chart&&t.chart.stroke);
if(fill=="inherit"){
var node=this.node,fill=new dojo.Color(dojo.style(node,"backgroundColor"));
while(fill.a==0&&node!=document.documentElement){
fill=new dojo.Color(dojo.style(node,"backgroundColor"));
node=node.parentNode;
}
}
if(fill){
fill=dc.Element.prototype._plotFill(fill,dim,_384);
if(_384.l){
rect={width:_384.l,height:dim.height+1};
this.surface.createRect(rect).setFill(dc.Element.prototype._shapeFill(fill,rect));
}
if(_384.r){
rect={x:dim.width-_384.r,width:_384.r+1,height:dim.height+2};
this.surface.createRect(rect).setFill(dc.Element.prototype._shapeFill(fill,rect));
}
if(_384.t){
rect={width:dim.width+1,height:_384.t};
this.surface.createRect(rect).setFill(dc.Element.prototype._shapeFill(fill,rect));
}
if(_384.b){
rect={y:dim.height-_384.b,width:dim.width+1,height:_384.b+2};
this.surface.createRect(rect).setFill(dc.Element.prototype._shapeFill(fill,rect));
}
}
if(_385){
this.surface.createRect({width:dim.width-1,height:dim.height-1}).setStroke(_385);
}
if(this.title){
var _386=(g.renderer=="canvas"),_387=_386||!dojo.isIE&&!dojo.isOpera?"html":"gfx",_388=g.normalizedLength(g.splitFontString(this.titleFont).size);
this.chartTitle=dc.axis2d.common.createText[_387](this,this.surface,dim.width/2,this.titlePos=="top"?_388+this.margins.t:dim.height-this.margins.b,"middle",this.title,this.titleFont,this.titleFontColor);
}
df.forIn(this.axes,function(axis){
axis.render(dim,_384);
});
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},delayedRender:function(){
if(!this._delayedRenderHandle){
this._delayedRenderHandle=setTimeout(dojo.hitch(this,function(){
clearTimeout(this._delayedRenderHandle);
this._delayedRenderHandle=null;
this.render();
}),this.delayInMs);
}
return this;
},connectToPlot:function(name,_389,_38a){
return name in this.plots?this.stack[this.plots[name]].connect(_389,_38a):null;
},fireEvent:function(_38b,_38c,_38d){
if(_38b in this.runs){
var _38e=this.series[this.runs[_38b]].plot;
if(_38e in this.plots){
var plot=this.stack[this.plots[_38e]];
if(plot){
plot.fireEvent(_38b,_38c,_38d);
}
}
}
return this;
},_makeClean:function(){
dojo.forEach(this.axes,_353);
dojo.forEach(this.stack,_353);
dojo.forEach(this.series,_353);
this.dirty=false;
},_makeDirty:function(){
dojo.forEach(this.axes,_354);
dojo.forEach(this.stack,_354);
dojo.forEach(this.series,_354);
this.dirty=true;
},_invalidateDependentPlots:function(_38f,_390){
if(_38f in this.plots){
var plot=this.stack[this.plots[_38f]],axis,_391=_390?"vAxis":"hAxis";
if(plot[_391]){
axis=this.axes[plot[_391]];
if(axis&&axis.dependOnData()){
axis.dirty=true;
dojo.forEach(this.stack,function(p){
if(p[_391]&&p[_391]==plot[_391]){
p.dirty=true;
}
});
}
}else{
plot.dirty=true;
}
}
}});
function _392(_393){
return {min:_393.hmin,max:_393.hmax};
};
function _394(_395){
return {min:_395.vmin,max:_395.vmax};
};
function _396(_397,h){
_397.hmin=h.min;
_397.hmax=h.max;
};
function _398(_399,v){
_399.vmin=v.min;
_399.vmax=v.max;
};
function _39a(_39b,_39c){
if(_39b&&_39c){
_39b.min=Math.min(_39b.min,_39c.min);
_39b.max=Math.max(_39b.max,_39c.max);
}
return _39b||_39c;
};
function _381(_39d,_39e){
var _39f={},axes={};
dojo.forEach(_39d,function(plot){
var _3a0=_39f[plot.name]=plot.getSeriesStats();
if(plot.hAxis){
axes[plot.hAxis]=_39a(axes[plot.hAxis],_392(_3a0));
}
if(plot.vAxis){
axes[plot.vAxis]=_39a(axes[plot.vAxis],_394(_3a0));
}
});
dojo.forEach(_39d,function(plot){
var _3a1=_39f[plot.name];
if(plot.hAxis){
_396(_3a1,axes[plot.hAxis]);
}
if(plot.vAxis){
_398(_3a1,axes[plot.vAxis]);
}
plot.initializeScalers(_39e,_3a1);
});
};
})();
}
if(!dojo._hasResource["dojox.charting.Chart2D"]){
dojo._hasResource["dojox.charting.Chart2D"]=true;
dojo.provide("dojox.charting.Chart2D");
dojo.deprecated("dojox.charting.Chart2D","Use dojo.charting.Chart instead and require all other components explicitly","2.0");
dojox.charting.Chart2D=dojox.charting.Chart;
}
if(!dojo._hasResource["dojox.charting.widget.Legend"]){
dojo._hasResource["dojox.charting.widget.Legend"]=true;
dojo.provide("dojox.charting.widget.Legend");
dojo.declare("dojox.charting.widget.Legend",[dijit._Widget,dijit._Templated],{chartRef:"",horizontal:true,swatchSize:18,templateString:"<table dojoAttachPoint='legendNode' class='dojoxLegendNode' role='group' aria-label='chart legend'><tbody dojoAttachPoint='legendBody'></tbody></table>",legendNode:null,legendBody:null,postCreate:function(){
if(!this.chart){
if(!this.chartRef){
return;
}
this.chart=dijit.byId(this.chartRef);
if(!this.chart){
var node=dojo.byId(this.chartRef);
if(node){
this.chart=dijit.byNode(node);
}else{
return;
}
}
this.series=this.chart.chart.series;
}else{
this.series=this.chart.series;
}
this.refresh();
},refresh:function(){
var df=dojox.lang.functional;
if(this._surfaces){
dojo.forEach(this._surfaces,function(_3a2){
_3a2.destroy();
});
}
this._surfaces=[];
while(this.legendBody.lastChild){
dojo.destroy(this.legendBody.lastChild);
}
if(this.horizontal){
dojo.addClass(this.legendNode,"dojoxLegendHorizontal");
this._tr=dojo.create("tr",null,this.legendBody);
this._inrow=0;
}
var s=this.series;
if(s.length==0){
return;
}
if(s[0].chart.stack[0].declaredClass=="dojox.charting.plot2d.Pie"){
var t=s[0].chart.stack[0];
if(typeof t.run.data[0]=="number"){
var _3a3=df.map(t.run.data,"Math.max(x, 0)");
if(df.every(_3a3,"<= 0")){
return;
}
var _3a4=df.map(_3a3,"/this",df.foldl(_3a3,"+",0));
dojo.forEach(_3a4,function(x,i){
this._addLabel(t.dyn[i],t._getLabel(x*100)+"%");
},this);
}else{
dojo.forEach(t.run.data,function(x,i){
this._addLabel(t.dyn[i],x.legend||x.text||x.y);
},this);
}
}else{
dojo.forEach(s,function(x){
this._addLabel(x.dyn,x.legend||x.name);
},this);
}
},_addLabel:function(dyn,_3a5){
var _3a6=dojo.create("td"),icon=dojo.create("div",null,_3a6),text=dojo.create("label",null,_3a6),div=dojo.create("div",{style:{"width":this.swatchSize+"px","height":this.swatchSize+"px","float":"left"}},icon);
dojo.addClass(icon,"dojoxLegendIcon dijitInline");
dojo.addClass(text,"dojoxLegendText");
if(this._tr){
this._tr.appendChild(_3a6);
if(++this._inrow===this.horizontal){
this._tr=dojo.create("tr",null,this.legendBody);
this._inrow=0;
}
}else{
var tr=dojo.create("tr",null,this.legendBody);
tr.appendChild(_3a6);
}
this._makeIcon(div,dyn);
text.innerHTML=String(_3a5);
},_makeIcon:function(div,dyn){
var mb={h:this.swatchSize,w:this.swatchSize};
var _3a7=dojox.gfx.createSurface(div,mb.w,mb.h);
this._surfaces.push(_3a7);
if(dyn.fill){
_3a7.createRect({x:2,y:2,width:mb.w-4,height:mb.h-4}).setFill(dyn.fill).setStroke(dyn.stroke);
}else{
if(dyn.stroke||dyn.marker){
var line={x1:0,y1:mb.h/2,x2:mb.w,y2:mb.h/2};
if(dyn.stroke){
_3a7.createLine(line).setStroke(dyn.stroke);
}
if(dyn.marker){
var c={x:mb.w/2,y:mb.h/2};
if(dyn.stroke){
_3a7.createPath({path:"M"+c.x+" "+c.y+" "+dyn.marker}).setFill(dyn.stroke.color).setStroke(dyn.stroke);
}else{
_3a7.createPath({path:"M"+c.x+" "+c.y+" "+dyn.marker}).setFill(dyn.color).setStroke(dyn.color);
}
}
}else{
_3a7.createRect({x:2,y:2,width:mb.w-4,height:mb.h-4}).setStroke("black");
_3a7.createLine({x1:2,y1:2,x2:mb.w-2,y2:mb.h-2}).setStroke("black");
_3a7.createLine({x1:2,y1:mb.h-2,x2:mb.w-2,y2:2}).setStroke("black");
}
}
}});
}
if(!dojo._hasResource["dojox.charting.action2d.Base"]){
dojo._hasResource["dojox.charting.action2d.Base"]=true;
dojo.provide("dojox.charting.action2d.Base");
(function(){
var _3a8=400,_3a9=dojo.fx.easing.backOut,df=dojox.lang.functional;
dojo.declare("dojox.charting.action2d.Base",null,{overOutEvents:{onmouseover:1,onmouseout:1},constructor:function(_3aa,plot,_3ab){
this.chart=_3aa;
this.plot=plot||"default";
this.anim={};
if(!_3ab){
_3ab={};
}
this.duration=_3ab.duration?_3ab.duration:_3a8;
this.easing=_3ab.easing?_3ab.easing:_3a9;
},connect:function(){
this.handle=this.chart.connectToPlot(this.plot,this,"process");
},disconnect:function(){
if(this.handle){
dojo.disconnect(this.handle);
this.handle=null;
}
},reset:function(){
},destroy:function(){
this.disconnect();
df.forIn(this.anim,function(o){
df.forIn(o,function(anim){
anim.action.stop(true);
});
});
this.anim={};
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Highlight"]){
dojo._hasResource["dojox.charting.action2d.Highlight"]=true;
dojo.provide("dojox.charting.action2d.Highlight");
(function(){
var _3ac=100,_3ad=75,_3ae=50,c=dojox.color,cc=function(_3af){
return function(){
return _3af;
};
},hl=function(_3b0){
var a=new c.Color(_3b0),x=a.toHsl();
if(x.s==0){
x.l=x.l<50?100:0;
}else{
x.s=_3ac;
if(x.l<_3ae){
x.l=_3ad;
}else{
if(x.l>_3ad){
x.l=_3ae;
}else{
x.l=x.l-_3ae>_3ad-x.l?_3ae:_3ad;
}
}
}
return c.fromHsl(x);
};
dojo.declare("dojox.charting.action2d.Highlight",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut},optionalParams:{highlight:"red"},constructor:function(_3b1,plot,_3b2){
var a=_3b2&&_3b2.highlight;
this.colorFun=a?(dojo.isFunction(a)?a:cc(a)):hl;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)){
return;
}
var _3b3=o.run.name,_3b4=o.index,anim,_3b5,_3b6;
if(_3b3 in this.anim){
anim=this.anim[_3b3][_3b4];
}else{
this.anim[_3b3]={};
}
if(anim){
anim.action.stop(true);
}else{
var _3b7=o.shape.getFill();
if(!_3b7||!(_3b7 instanceof dojo.Color)){
return;
}
this.anim[_3b3][_3b4]=anim={start:_3b7,end:this.colorFun(_3b7)};
}
var _3b8=anim.start,end=anim.end;
if(o.type=="onmouseout"){
var t=_3b8;
_3b8=end;
end=t;
}
anim.action=dojox.gfx.fx.animateFill({shape:o.shape,duration:this.duration,easing:this.easing,color:{start:_3b8,end:end}});
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
if(this.anim[_3b3]){
delete this.anim[_3b3][_3b4];
}
});
}
anim.action.play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Magnify"]){
dojo._hasResource["dojox.charting.action2d.Magnify"]=true;
dojo.provide("dojox.charting.action2d.Magnify");
(function(){
var _3b9=2,m=dojox.gfx.matrix,gf=dojox.gfx.fx;
dojo.declare("dojox.charting.action2d.Magnify",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut,scale:_3b9},optionalParams:{},constructor:function(_3ba,plot,_3bb){
this.scale=_3bb&&typeof _3bb.scale=="number"?_3bb.scale:_3b9;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)||!("cx" in o)||!("cy" in o)){
return;
}
var _3bc=o.run.name,_3bd=o.index,_3be=[],anim,init,_3bf;
if(_3bc in this.anim){
anim=this.anim[_3bc][_3bd];
}else{
this.anim[_3bc]={};
}
if(anim){
anim.action.stop(true);
}else{
this.anim[_3bc][_3bd]=anim={};
}
if(o.type=="onmouseover"){
init=m.identity;
_3bf=this.scale;
}else{
init=m.scaleAt(this.scale,o.cx,o.cy);
_3bf=1/this.scale;
}
var _3c0={shape:o.shape,duration:this.duration,easing:this.easing,transform:[{name:"scaleAt",start:[1,o.cx,o.cy],end:[_3bf,o.cx,o.cy]},init]};
if(o.shape){
_3be.push(gf.animateTransform(_3c0));
}
if(o.oultine){
_3c0.shape=o.outline;
_3be.push(gf.animateTransform(_3c0));
}
if(o.shadow){
_3c0.shape=o.shadow;
_3be.push(gf.animateTransform(_3c0));
}
if(!_3be.length){
delete this.anim[_3bc][_3bd];
return;
}
anim.action=dojo.fx.combine(_3be);
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
if(this.anim[_3bc]){
delete this.anim[_3bc][_3bd];
}
});
}
anim.action.play();
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.scan"]){
dojo._hasResource["dojox.lang.functional.scan"]=true;
dojo.provide("dojox.lang.functional.scan");
(function(){
var d=dojo,df=dojox.lang.functional,_3c1={};
d.mixin(df,{scanl:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n,i;
if(d.isArray(a)){
t=new Array((n=a.length)+1);
t[0]=z;
for(i=0;i<n;z=f.call(o,z,a[i],i,a),t[++i]=z){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
t=[z];
for(i=0;a.hasNext();t.push(z=f.call(o,z,a.next(),i++,a))){
}
}else{
t=[z];
for(i in a){
if(!(i in _3c1)){
t.push(z=f.call(o,z,a[i],i,a));
}
}
}
}
return t;
},scanl1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n,z,_3c2=true;
if(d.isArray(a)){
t=new Array(n=a.length);
t[0]=z=a[0];
for(var i=1;i<n;t[i]=z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
if(a.hasNext()){
t=[z=a.next()];
for(var i=1;a.hasNext();t.push(z=f.call(o,z,a.next(),i++,a))){
}
}
}else{
for(var i in a){
if(!(i in _3c1)){
if(_3c2){
t=[z=a[i]];
_3c2=false;
}else{
t.push(z=f.call(o,z,a[i],i,a));
}
}
}
}
}
return t;
},scanr:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n+1),i=n;
t[n]=z;
for(;i>0;--i,z=f.call(o,z,a[i],i,a),t[i]=z){
}
return t;
},scanr1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n),z=a[n-1],i=n-1;
t[i]=z;
for(;i>0;--i,z=f.call(o,z,a[i],i,a),t[i]=z){
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.MoveSlice"]){
dojo._hasResource["dojox.charting.action2d.MoveSlice"]=true;
dojo.provide("dojox.charting.action2d.MoveSlice");
(function(){
var _3c3=1.05,_3c4=7,m=dojox.gfx.matrix,gf=dojox.gfx.fx,df=dojox.lang.functional;
dojo.declare("dojox.charting.action2d.MoveSlice",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut,scale:_3c3,shift:_3c4},optionalParams:{},constructor:function(_3c5,plot,_3c6){
if(!_3c6){
_3c6={};
}
this.scale=typeof _3c6.scale=="number"?_3c6.scale:_3c3;
this.shift=typeof _3c6.shift=="number"?_3c6.shift:_3c4;
this.connect();
},process:function(o){
if(!o.shape||o.element!="slice"||!(o.type in this.overOutEvents)){
return;
}
if(!this.angles){
var _3c7=m._degToRad(o.plot.opt.startAngle);
if(typeof o.run.data[0]=="number"){
this.angles=df.map(df.scanl(o.run.data,"+",_3c7),"* 2 * Math.PI / this",df.foldl(o.run.data,"+",0));
}else{
this.angles=df.map(df.scanl(o.run.data,"a + b.y",_3c7),"* 2 * Math.PI / this",df.foldl(o.run.data,"a + b.y",0));
}
}
var _3c8=o.index,anim,_3c9,_3ca,_3cb,_3cc,_3cd=(this.angles[_3c8]+this.angles[_3c8+1])/2,_3ce=m.rotateAt(-_3cd,o.cx,o.cy),_3cf=m.rotateAt(_3cd,o.cx,o.cy);
anim=this.anim[_3c8];
if(anim){
anim.action.stop(true);
}else{
this.anim[_3c8]=anim={};
}
if(o.type=="onmouseover"){
_3cb=0;
_3cc=this.shift;
_3c9=1;
_3ca=this.scale;
}else{
_3cb=this.shift;
_3cc=0;
_3c9=this.scale;
_3ca=1;
}
anim.action=dojox.gfx.fx.animateTransform({shape:o.shape,duration:this.duration,easing:this.easing,transform:[_3cf,{name:"translate",start:[_3cb,0],end:[_3cc,0]},{name:"scaleAt",start:[_3c9,o.cx,o.cy],end:[_3ca,o.cx,o.cy]},_3ce]});
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
delete this.anim[_3c8];
});
}
anim.action.play();
},reset:function(){
delete this.angles;
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Shake"]){
dojo._hasResource["dojox.charting.action2d.Shake"]=true;
dojo.provide("dojox.charting.action2d.Shake");
(function(){
var _3d0=3,m=dojox.gfx.matrix,gf=dojox.gfx.fx;
dojo.declare("dojox.charting.action2d.Shake",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut,shiftX:_3d0,shiftY:_3d0},optionalParams:{},constructor:function(_3d1,plot,_3d2){
if(!_3d2){
_3d2={};
}
this.shiftX=typeof _3d2.shiftX=="number"?_3d2.shiftX:_3d0;
this.shiftY=typeof _3d2.shiftY=="number"?_3d2.shiftY:_3d0;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)){
return;
}
var _3d3=o.run.name,_3d4=o.index,_3d5=[],anim,_3d6=o.type=="onmouseover"?this.shiftX:-this.shiftX,_3d7=o.type=="onmouseover"?this.shiftY:-this.shiftY;
if(_3d3 in this.anim){
anim=this.anim[_3d3][_3d4];
}else{
this.anim[_3d3]={};
}
if(anim){
anim.action.stop(true);
}else{
this.anim[_3d3][_3d4]=anim={};
}
var _3d8={shape:o.shape,duration:this.duration,easing:this.easing,transform:[{name:"translate",start:[this.shiftX,this.shiftY],end:[0,0]},m.identity]};
if(o.shape){
_3d5.push(gf.animateTransform(_3d8));
}
if(o.oultine){
_3d8.shape=o.outline;
_3d5.push(gf.animateTransform(_3d8));
}
if(o.shadow){
_3d8.shape=o.shadow;
_3d5.push(gf.animateTransform(_3d8));
}
if(!_3d5.length){
delete this.anim[_3d3][_3d4];
return;
}
anim.action=dojo.fx.combine(_3d5);
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
if(this.anim[_3d3]){
delete this.anim[_3d3][_3d4];
}
});
}
anim.action.play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Tooltip"]){
dojo._hasResource["dojox.charting.action2d.Tooltip"]=true;
dojo.provide("dojox.charting.action2d.Tooltip");
(function(){
var _3d9=function(o){
var t=o.run&&o.run.data&&o.run.data[o.index];
if(t&&typeof t!="number"&&(t.tooltip||t.text)){
return t.tooltip||t.text;
}
if(o.element=="candlestick"){
return "<table cellpadding=\"1\" cellspacing=\"0\" border=\"0\" style=\"font-size:0.9em;\">"+"<tr><td>Open:</td><td align=\"right\"><strong>"+o.data.open+"</strong></td></tr>"+"<tr><td>High:</td><td align=\"right\"><strong>"+o.data.high+"</strong></td></tr>"+"<tr><td>Low:</td><td align=\"right\"><strong>"+o.data.low+"</strong></td></tr>"+"<tr><td>Close:</td><td align=\"right\"><strong>"+o.data.close+"</strong></td></tr>"+(o.data.mid!==undefined?"<tr><td>Mid:</td><td align=\"right\"><strong>"+o.data.mid+"</strong></td></tr>":"")+"</table>";
}
return o.element=="bar"?o.x:o.y;
};
var df=dojox.lang.functional,m=dojox.gfx.matrix,pi4=Math.PI/4,pi2=Math.PI/2;
dojo.declare("dojox.charting.action2d.Tooltip",dojox.charting.action2d.Base,{defaultParams:{text:_3d9},optionalParams:{},constructor:function(_3da,plot,_3db){
this.text=_3db&&_3db.text?_3db.text:_3d9;
this.connect();
},process:function(o){
if(o.type==="onplotreset"||o.type==="onmouseout"){
dijit.hideTooltip(this.aroundRect);
this.aroundRect=null;
if(o.type==="onplotreset"){
delete this.angles;
}
return;
}
if(!o.shape||o.type!=="onmouseover"){
return;
}
var _3dc={type:"rect"},_3dd=["after","before"];
switch(o.element){
case "marker":
_3dc.x=o.cx;
_3dc.y=o.cy;
_3dc.width=_3dc.height=1;
break;
case "circle":
_3dc.x=o.cx-o.cr;
_3dc.y=o.cy-o.cr;
_3dc.width=_3dc.height=2*o.cr;
break;
case "column":
_3dd=["above","below"];
case "bar":
_3dc=dojo.clone(o.shape.getShape());
break;
case "candlestick":
_3dc.x=o.x;
_3dc.y=o.y;
_3dc.width=o.width;
_3dc.height=o.height;
break;
default:
if(!this.angles){
if(typeof o.run.data[0]=="number"){
this.angles=df.map(df.scanl(o.run.data,"+",0),"* 2 * Math.PI / this",df.foldl(o.run.data,"+",0));
}else{
this.angles=df.map(df.scanl(o.run.data,"a + b.y",0),"* 2 * Math.PI / this",df.foldl(o.run.data,"a + b.y",0));
}
}
var _3de=m._degToRad(o.plot.opt.startAngle),_3df=(this.angles[o.index]+this.angles[o.index+1])/2+_3de;
_3dc.x=o.cx+o.cr*Math.cos(_3df);
_3dc.y=o.cy+o.cr*Math.sin(_3df);
_3dc.width=_3dc.height=1;
if(_3df<pi4){
}else{
if(_3df<pi2+pi4){
_3dd=["below","above"];
}else{
if(_3df<Math.PI+pi4){
_3dd=["before","after"];
}else{
if(_3df<2*Math.PI-pi4){
_3dd=["above","below"];
}
}
}
}
break;
}
var lt=dojo.coords(this.chart.node,true);
_3dc.x+=lt.x;
_3dc.y+=lt.y;
_3dc.x=Math.round(_3dc.x);
_3dc.y=Math.round(_3dc.y);
_3dc.width=Math.ceil(_3dc.width);
_3dc.height=Math.ceil(_3dc.height);
this.aroundRect=_3dc;
var _3e0=this.text(o);
if(_3e0){
dijit.showTooltip(_3e0,this.aroundRect,_3dd);
}
}});
})();
}
if(!dojo._hasResource["wm.base.widget.DojoChart"]){
dojo._hasResource["wm.base.widget.DojoChart"]=true;
dojo.provide("wm.base.widget.DojoChart");
dojo.declare("wm.DojoChart",wm.Control,{chartTitle:"",yAxisTitle:"",hideLegend:false,verticalLegend:false,padding:4,width:"200px",height:"200px",legendHeight:"50px",legendWidth:"150px",variable:null,dataSet:null,dojoObj:null,theme:"CubanShirts",xAxis:"wmDefaultX",xAxisLabelLength:0,maxTimePoints:15,xMajorTickStep:5,xMinorTicks:false,xMinorTickStep:1,yAxis:"wmDefaultY",yUpperRange:"",chartColor:"",includeX:true,includeY:true,enableAnimation:true,chartType:"Columns",includeGrid:false,gap:2,defaultXY:[{"wmDefaultX":"Jan","wmDefaultY":3},{"wmDefaultX":"Feb","wmDefaultY":5},{"wmDefaultX":"Mar","wmDefaultY":8},{"wmDefaultX":"Apr","wmDefaultY":2}],addedSeries:{},aniHighlight:null,aniShake:null,magnify:null,aniTooltip:null,addSilverlight:false,init:function(){
if(this.showAddSilverlight()){
return;
}
dojo["require"]("dojox.charting.Chart2D");
dojo["require"]("dojox.charting.widget.Legend");
dojo["require"]("dojox.charting.widget.SelectableLegend");
dojo["require"]("dojox.charting.action2d.Highlight");
dojo["require"]("dojox.charting.action2d.Magnify");
dojo["require"]("dojox.charting.action2d.MoveSlice");
dojo["require"]("dojox.charting.action2d.Shake");
dojo["require"]("dojox.charting.action2d.Tooltip");
dojo["require"]("dojo.fx.easing");
this.inherited(arguments);
},postInit:function(){
this.inherited(arguments);
},renderDojoObj:function(){
if(this._loading||this.addSilverlight){
return;
}
if(this.dojoObj!=null){
this.dojoObj.destroy();
while(this.domNode.childNodes.length>0){
this.domNode.removeChild(this.domNode.childNodes[0]);
}
}
this.dojoDiv=dojo.doc.createElement("div");
this.updateChartDivHeight();
this.updateChartDivWidth();
this.domNode.appendChild(this.dojoDiv);
this.dojoObj=new dojox.charting.Chart2D(this.dojoDiv,{title:this.chartTitle,titlePos:"top",titleGap:5,margins:{l:0,t:5,r:5,b:15}});
this.setChartTheme();
this.updateChartType();
this.addXAxis();
this.addYAxis();
if(this.includeGrid){
this.dojoObj.addPlot("grid",{type:"Grid",hMinorLines:true,vMinorLines:true});
}
this.addAnimation();
this.addChartSeries();
var self=this;
dojo.addOnLoad(function(){
self.dojoRenderer();
self.connectDojoEvents();
});
},renderBounds:function(){
this.inherited(arguments);
this.resizeDijit();
},resizeDijit:function(){
this.renderDojoObj();
},createLegend:function(){
if(this.legend&&this.legend!=null){
this.legend.destroy();
}
if(this.hideLegend){
return;
}
this.legendDiv=dojo.doc.createElement("div");
dojo.attr(this.legendDiv,"align","center");
this.domNode.appendChild(this.legendDiv);
try{
if(this.xAxis.match(/,/)||this.yAxis.match(/,/)){
this.legend=new dojox.charting.widget.SelectableLegend({chart:this.dojoObj,horizontal:!this.verticalLegend},this.legendDiv);
}else{
this.legend=new dojox.charting.widget.Legend({chart:this.dojoObj,horizontal:!this.verticalLegend},this.legendDiv);
}
}
catch(e){
}
wm.onidle(this,function(){
var _3e1=dojo.query(".dojoxLegendNode",this.domNode)[0];
if(_3e1){
var s=_3e1.style;
if(this.verticalLegend){
s.position="absolute";
s.left=Math.max(0,this.getContentBounds().w-parseInt(this.legendWidth))+"px";
s.width=this.legendWidth;
s.top="0px";
}
}
while(this.domNode.childNodes[1].childNodes.length>1){
dojo.destroy(this.domNode.childNodes[1].childNodes[0]);
}
});
},updateChartDivHeight:function(){
if(!this.dojoDiv){
return;
}
var h=dojo.coords(this.domNode).h;
if(!this.verticalLegend){
var lh=wm.splitUnits(this.legendHeight);
var l=lh.value;
}else{
l=0;
}
if(l==0){
var _3e2=h+10;
}else{
var _3e2=h-l;
}
if(_3e2>0){
this.dojoDiv.style.height=_3e2+"px";
}
},updateChartDivWidth:function(){
if(!this.dojoDiv){
return;
}
var _3e3=this.getContentBounds().w;
if(this.verticalLegend){
_3e3-=parseInt(this.legendWidth);
}
if(_3e3<0){
_3e3=0;
}
this.dojoDiv.style.width=_3e3+"px";
},dojoRenderer:function(){
if(!this.dojoObj){
return;
}
try{
this.dojoObj.render();
}
catch(e){
}
this.createLegend();
},connectDojoEvents:function(){
this.dojoObj.connectToPlot("default",dojo.hitch(this,"dojoChartEvent"));
},getDataSet:function(){
return this.variable;
},setDataSet:function(_3e4,_3e5){
this.dataSet=this.variable=_3e4;
if(!this.dojoObj&&(!this.variable||!this.variable.getData())){
return;
}
var _3e6=this;
dojo.addOnLoad(function(){
_3e6.renderDojoObj();
});
},addChartSeries:function(_3e7){
this.updateXLabelSet();
dojo.forEach(this.yAxis.split(","),function(_3e8,idx){
try{
_3e8=dojo.trim(_3e8);
if(!_3e8){
return;
}
var _3e9=this.getColumnDataSet(_3e8);
var _3ea=wm.capitalize(_3e8);
if(_3e7&&this.addedSeries[_3ea]&&this.addedSeries[_3ea].length>0){
_3e9=this.addedSeries[_3ea].concat(_3e9);
while(_3e9.length>this.maxTimePoints){
_3e9.shift();
}
}
if(this.chartColor instanceof Array){
var _3eb=this.chartColor[idx];
}
if(_3eb&&_3eb!=""&&this.chartType!="Pie"){
this.dojoObj.addSeries(_3ea,_3e9,{stroke:{width:0},fill:_3eb});
}else{
if(!_3e7){
this.dojoObj.addSeries(_3ea,_3e9);
}else{
this.dojoObj.updateSeries(_3ea,_3e9);
}
}
this.addedSeries[_3ea]=_3e9;
}
catch(e){
}
},this);
},getChartDataSet:function(){
if(this.xAxis=="wmDefaultX"&&this.yAxis=="wmDefaultY"){
return this.defaultXY;
}
if(!this.variable||this.variable==""){
return [];
}
var ds=this.variable.getData();
if(ds&&!(ds instanceof Array)){
ds=[ds];
}
if(this.xAxis=="wmDefaultX"||this.yAxis=="wmDefaultY"){
if(this.xAxis=="wmDefaultX"){
var axis="wmDefaultX";
}else{
var axis="wmDefaultY";
}
dojo.forEach(ds,function(obj,i){
if(i>=this.defaultXY.length){
return;
}
ds[i][axis]=this.defaultXY[i][axis];
},this);
}
return ds;
},updateXLabelSet:function(){
this.xLabels={};
if(this.xAxis=="wmDefaultX"){
var ds=this.defaultXY;
}else{
var ds=this.getChartDataSet();
}
var x=this.xAxis;
dojo.forEach(ds,function(obj,idx){
var _3ec=obj[x];
var _3ed=this.xaxisFormatter(_3ec);
this.xLabels[_3ec]=this.addXLabel(_3ed);
},this);
return this.xLabels;
},formatChanged:function(){
this.renderDojoObj();
},isPieChart:function(){
return this.chartType=="Pie";
},getColumnDataSet:function(_3ee){
var data=[],x="";
var ds=this.getChartDataSet();
var _3ef=this.xAxis;
dojo.forEach(ds,function(_3f0,i){
var obj={y:_3ee in _3f0?_3f0[_3ee]:0};
if(this.isPieChart()){
if(_3ef!=""){
obj.legend=this.xaxisFormatter(_3f0[_3ef]);
}
if(this.chartColor!=""){
if(this.chartColor instanceof Array){
var _3f1=this.chartColor[i];
if(_3f1){
obj.color=_3f1;
}
}else{
obj.color=_3f0[this.chartColor];
}
}
}else{
if(_3ef){
x=this.xLabels[_3f0[_3ef]];
}
if(x!=""){
obj.x=x;
}
}
data.push(obj);
},this);
return data;
},getPieDataSet:function(_3f2){
if((_3f2=="wmDefaultX"||_3f2=="wmDefaultY")&&this.isDesignLoaded()){
if(_3f2=="wmDefaultX"){
return this.defaultXY;
}else{
return this.defaultXY;
}
}
if(this.variable==null||this.variable==""){
return [];
}
var data=[];
for(var i=0;i<this.variable.getCount();i++){
var _3f3=this.variable.getItem(i).data;
if(_3f3&&_3f3!=null){
var obj={y:_3f3[_3f2]};
if(this.xAxis!=""){
obj.legend=_3f3[this.xAxis];
}
if(this.chartColor!=""){
if(this.chartColor instanceof Array){
var _3f4=this.chartColor[i];
if(_3f4){
obj.color=_3f4;
}
}else{
obj.color=_3f3[this.chartColor];
}
}
data[data.length]=obj;
}
}
return data;
},addXAxis:function(){
if(!this.includeX){
this.dojoObj.removeAxis("x");
return;
}
var x=this.dojoObj?this.dojoObj.getAxis("x"):{},_3f5={};
if(x&&x.opt){
_3f5=x.opt;
}
_3f5.minorTicks=this.xMinorTicks;
var _3f6=this.getFontProperty();
if(_3f6){
dojo.mixin(_3f5,_3f6);
}
if(this.xMajorTickStep){
_3f5.majorTickStep=this.xMajorTickStep;
}
if(this.xMinorTickStep){
_3f5.minorTickStep=this.xMinorTickStep;
}
this.dojoObj.addAxis("x",_3f5);
},addYAxis:function(){
if(this.includeY){
var _3f7={vertical:true,natural:true,includeZero:true,fixUpper:"minor"};
var _3f8=this.getFontProperty();
if(_3f8){
dojo.mixin(_3f7,_3f8);
}
if(this.yLowerRange){
_3f7.min=this.yLowerRange;
}
if(this.yUpperRange&&this.yUpperRange!=""){
_3f7.max=this.yUpperRange;
}
if(this.yMajorTickStep){
_3f7.majorTickStep=this.yMajorTickStep;
}
if(this.yAxisTitle){
_3f7.title=this.yAxisTitle;
}
_3f7.labelFunc=dojo.hitch(this,"yaxisFormatter");
this.dojoObj.addAxis("y",_3f7);
}
},yaxisFormatter:function(_3f9){
if(this.$.yformat){
return this.$.yformat.format(_3f9);
}else{
if(this.ydisplay&&dojo.isFunction(this.owner[this.ydisplay])){
return this.owner[this.ydisplay](this,_3f9);
}else{
return _3f9;
}
}
},xaxisFormatter:function(_3fa){
if(this.$.xformat){
return this.$.xformat.format(_3fa);
}else{
if(this.xdisplay&&dojo.isFunction(this.owner[this.xdisplay])){
return this.owner[this.xdisplay](this,_3fa);
}else{
return _3fa;
}
}
},getFontProperty:function(){
var _3fb={style:"normal",variant:"normal",weight:"normal",size:"7pt",family:"Tahoma"};
var _3fc={};
var _3fd={};
var _3fe=false;
if(this._classes&&this._classes.domNode){
for(var i=0;i<this._classes.domNode.length;i++){
var _3ff=this._classes.domNode[i];
var _400=this.getDojoGFXCssPropObj(_3ff);
if(_400){
_3fd[_400.propName]=_400.propValue;
_3fe=true;
}
}
if(_3fe){
var _401="";
for(p in _3fb){
if(_3fd[p]&&_3fd[p]!=""){
_401+=" "+_3fd[p];
}else{
_401+=" "+_3fb[p];
}
}
_3fc.font=dojo.trim(_401);
if(_3fd.fontColor){
_3fc.fontColor=_3fd.fontColor;
}
return _3fc;
}
}
return null;
},addSeries:function(){
return;
thisObj=this;
dojo.forEach(this.yAxis.split(","),function(_402,idx){
var _403=null;
if(thisObj.chartType=="Pie"){
_403=thisObj.getPieDataSet(_402);
}else{
_403=thisObj.getColumnDataSet(_402);
}
_402=dojo.trim(_402);
var _404=wm.capitalize(_402);
var _405=1;
while(dojo.indexOf(thisObj.addedSeries,_404)!=-1){
_404+=" "+_405;
_405++;
}
if(thisObj.chartType!="Pie"&&thisObj.chartColor instanceof Array){
var _406=thisObj.chartColor[idx];
if(_406&&_406!=""){
thisObj.dojoObj.addSeries(_404,_403,{stroke:{width:0},fill:_406});
}else{
thisObj.dojoObj.addSeries(_404,_403);
}
}else{
thisObj.dojoObj.addSeries(_404,_403);
}
thisObj.addedSeries[thisObj.addedSeries.length]=_404;
});
},incrementSeries:function(){
this.addChartSeries(true);
this.renderDojoObj();
},updateSeries:function(_407,_408){
try{
this.dojoObj.updateSeries(_407,_408);
this.dojoObj.render();
}
catch(e){
}
},setChartTheme:function(){
var js="dojox.charting.themes."+this.theme;
dojo["require"](js);
var self=this;
dojo.addOnLoad(function(){
self.updateChartTheme();
});
},updateChartTheme:function(){
var _409=dojo.getObject("dojox.charting.themes."+this.theme);
this.dojoObj.setTheme(_409);
},updateChartType:function(){
this.updateChartXY();
var prop={type:this.chartType,gap:this.gap};
if(this.chartType=="Lines"){
prop.markers=true;
}
this.dojoObj.addPlot("default",prop);
},getDojoGFXCssPropObj:function(prop){
var _40a=prop.split("_");
if(_40a.length==3){
switch(_40a[1]){
case "FontFamily":
return {propName:"family",propValue:_40a[2]};
case "FontSizePx":
return {propName:"size",propValue:_40a[2]};
case "FontColor":
return {propName:"fontColor",propValue:_40a[2]};
case "TextDecoration":
return {propName:"weight",propValue:_40a[2]};
}
}
return null;
},updateChartXY:function(){
if(this.chartType=="Pie"){
this.dojoObj.removeAxis("x");
}else{
this.addXAxis();
}
this.addSeries();
},addAnimation:function(){
if(this.aniHighlight!=null){
this.aniHighlight.destroy();
this.aniShake.destroy();
this.aniTooltip.destroy();
if(this.magnify){
this.magnify.destroy();
}
}
if(this.enableAnimation){
var dc=dojox.charting;
var dur=450;
this.aniHighlight=new dc.action2d.Highlight(this.dojoObj,"default",{duration:dur,easing:dojo.fx.easing.sineOut});
this.aniShake=new dc.action2d.Shake(this.dojoObj,"default");
this.aniTooltip=new dc.action2d.Tooltip(this.dojoObj,"default");
if(this.chartType=="Lines"){
this.magnify=new dc.action2d.Magnify(this.dojoObj,"default");
}
}
},getTimeX:function(){
var _40b=new Date();
var h=_40b.getHours();
var m=_40b.getMinutes();
var s=_40b.getSeconds();
var text;
var _40c=this.dojoObj.getAxis("x"),_40d=_40c.opt.labels||[];
if(_40d.length<1){
var _40e=1;
}else{
var _40e=_40d[_40d.length-1].value+1;
while(_40d.length>this.maxTimePoints){
_40d.shift();
}
}
_40d.push({value:_40e,text:text});
_40c.labels=_40d;
this.dojoObj.addAxis("x",_40c);
return _40e;
},addXLabel:function(_40f){
var _410=this.dojoObj.getAxis("x"),_411=_410.opt.labels||[],_412=0;
if(_411.length<1){
_412=1;
}else{
_412=_411[_411.length-1].value+1;
}
_40f=_40f+"";
if(this.xAxisLabelLength){
_40f=_40f.substring(0,this.xAxisLabelLength);
}
_411.push({value:_412,text:_40f});
_410.labels=_411;
this.dojoObj.addAxis("x",_410);
return _412;
},showAddSilverlight:function(){
if(!dojo.isIE||!Silverlight||Silverlight.isInstalled()){
return;
}
this.addSilverlight=true;
var link=dojo.doc.createElement("a");
dojo.attr(link,"href","http://go.microsoft.com/fwlink/?LinkId=149156");
dojo.attr(link,"style","text-decoration: none;");
var img=dojo.doc.createElement("img");
dojo.attr(img,"src","http://go.microsoft.com/fwlink/?LinkId=108181");
dojo.attr(img,"alt",wm.getDictionaryItem("ALT_PROMPT_SILVERLIGHT"));
dojo.attr(img,"style","border-style: none");
link.appendChild(img);
this.domNode.appendChild(link);
},dojoChartEvent:function(e){
var type=e.type;
var idx=e.index;
if(!this.variable||!type||!idx||type==null||idx==null||this.variable==null){
return;
}
var _413=null;
var item=this.variable.getItem(idx);
if(item!=null){
_413=item.data;
}
if(type=="onclick"){
dojo.hitch(this,"onClick")(e,_413);
}else{
if(type=="onmouseover"){
dojo.hitch(this,"onMouseOver")(e,_413);
}else{
if(type=="onmouseout"){
dojo.hitch(this,"onMouseOut")(e,_413);
}
}
}
},onClick:function(e,_414){
},onMouseOver:function(e,_415){
},onMouseOut:function(e,_416){
},toHtml:function(){
return this.dojoObj.node.innerHTML;
}});
}
if(!dojo._hasResource["dijit._Container"]){
dojo._hasResource["dijit._Container"]=true;
dojo.provide("dijit._Container");
dojo.declare("dijit._Container",null,{isContainer:true,buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_417,_418){
var _419=this.containerNode;
if(_418&&typeof _418=="number"){
var _41a=this.getChildren();
if(_41a&&_41a.length>=_418){
_419=_41a[_418-1].domNode;
_418="after";
}
}
dojo.place(_417.domNode,_419,_418);
if(this._started&&!_417._started){
_417.startup();
}
},removeChild:function(_41b){
if(typeof _41b=="number"){
_41b=this.getChildren()[_41b];
}
if(_41b){
var node=_41b.domNode;
if(node&&node.parentNode){
node.parentNode.removeChild(node);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},destroyDescendants:function(_41c){
dojo.forEach(this.getChildren(),function(_41d){
_41d.destroyRecursive(_41c);
});
},_getSiblingOfChild:function(_41e,dir){
var node=_41e.domNode,_41f=(dir>0?"nextSibling":"previousSibling");
do{
node=node[_41f];
}while(node&&(node.nodeType!=1||!dijit.byNode(node)));
return node&&dijit.byNode(node);
},getIndexOfChild:function(_420){
return dojo.indexOf(this.getChildren(),_420);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_421){
_421.startup();
});
this.inherited(arguments);
}});
}
if(!dojo._hasResource["dijit._Contained"]){
dojo._hasResource["dijit._Contained"]=true;
dojo.provide("dijit._Contained");
dojo.declare("dijit._Contained",null,{getParent:function(){
var _422=dijit.getEnclosingWidget(this.domNode.parentNode);
return _422&&_422.isContainer?_422:null;
},_getSibling:function(_423){
var node=this.domNode;
do{
node=node[_423+"Sibling"];
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
if(!dojo._hasResource["dojox.widget.gauge._Gauge"]){
dojo._hasResource["dojox.widget.gauge._Gauge"]=true;
dojo.provide("dojox.widget.gauge._Gauge");
dojo.experimental("dojox.widget.gauge._Gauge");
dojo.declare("dojox.widget.gauge._Gauge",[dijit._Widget,dijit._Templated,dijit._Container],{width:0,height:0,background:null,min:0,max:0,image:null,useRangeStyles:0,useTooltip:true,majorTicks:null,minorTicks:null,_defaultIndicator:null,defaultColors:[[0,84,170,1],[68,119,187,1],[102,153,204,1],[153,187,238,1],[153,204,255,1],[204,238,255,1],[221,238,255,1]],min:null,max:null,surface:null,hideValues:false,gaugeContent:undefined,templateString:dojo.cache("dojox.widget.gauge","_Gauge.html","<div>\n\t<div class=\"dojoxGaugeContent\" dojoAttachPoint=\"gaugeContent\"></div>\n\t<div dojoAttachPoint=\"containerNode\"></div>\n\t<div dojoAttachPoint=\"mouseNode\"></div>\n</div>\n"),_backgroundDefault:{color:"#E0E0E0"},_rangeData:null,_indicatorData:null,_drag:null,_img:null,_overOverlay:false,_lastHover:"",startup:function(){
if(this.image===null){
this.image={};
}
this.connect(this.gaugeContent,"onmousemove",this.handleMouseMove);
this.connect(this.gaugeContent,"onmouseover",this.handleMouseOver);
this.connect(this.gaugeContent,"onmouseout",this.handleMouseOut);
this.connect(this.gaugeContent,"onmouseup",this.handleMouseUp);
if(!dojo.isArray(this.ranges)){
this.ranges=[];
}
if(!dojo.isArray(this.indicators)){
this.indicators=[];
}
var _424=[],_425=[];
var i;
if(this.hasChildren()){
var _426=this.getChildren();
for(i=0;i<_426.length;i++){
if(/dojox\.widget\..*Indicator/.test(_426[i].declaredClass)){
_425.push(_426[i]);
continue;
}
switch(_426[i].declaredClass){
case "dojox.widget.gauge.Range":
_424.push(_426[i]);
break;
}
}
this.ranges=this.ranges.concat(_424);
this.indicators=this.indicators.concat(_425);
}
if(!this.background){
this.background=this._backgroundDefault;
}
this.background=this.background.color||this.background;
if(!this.surface){
this.createSurface();
}
this.addRanges(this.ranges);
if(this.minorTicks&&this.minorTicks.interval){
this.setMinorTicks(this.minorTicks);
}
if(this.majorTicks&&this.majorTicks.interval){
this.setMajorTicks(this.majorTicks);
}
for(i=0;i<this.indicators.length;i++){
this.addIndicator(this.indicators[i]);
}
},_setTicks:function(_427,_428,_429){
var i;
if(_427&&dojo.isArray(_427._ticks)){
for(i=0;i<_427._ticks.length;i++){
this.removeIndicator(_427._ticks[i]);
}
}
var t={length:_428.length,offset:_428.offset,noChange:true};
if(_428.color){
t.color=_428.color;
}
if(_428.font){
t.font=_428.font;
}
_428._ticks=[];
for(i=this.min;i<=this.max;i+=_428.interval){
t.value=i;
if(_429){
t.label=""+i;
}
_428._ticks.push(this.addIndicator(t));
}
return _428;
},setMinorTicks:function(_42a){
this.minorTicks=this._setTicks(this.minorTicks,_42a,false);
},setMajorTicks:function(_42b){
this.majorTicks=this._setTicks(this.majorTicks,_42b,true);
},postCreate:function(){
if(this.hideValues){
dojo.style(this.containerNode,"display","none");
}
dojo.style(this.mouseNode,"width","0");
dojo.style(this.mouseNode,"height","0");
dojo.style(this.mouseNode,"position","absolute");
dojo.style(this.mouseNode,"z-index","100");
if(this.useTooltip){
dijit.showTooltip("test",this.mouseNode,!this.isLeftToRight());
dijit.hideTooltip(this.mouseNode);
}
},createSurface:function(){
this.gaugeContent.style.width=this.width+"px";
this.gaugeContent.style.height=this.height+"px";
this.surface=dojox.gfx.createSurface(this.gaugeContent,this.width,this.height);
this._background=this.surface.createRect({x:0,y:0,width:this.width,height:this.height});
this._background.setFill(this.background);
if(this.image.url){
this._img=this.surface.createImage({width:this.image.width||this.width,height:this.image.height||this.height,src:this.image.url});
if(this.image.overlay){
this._img.getEventSource().setAttribute("overlay",true);
}
if(this.image.x||this.image.y){
this._img.setTransform({dx:this.image.x||0,dy:this.image.y||0});
}
}
},setBackground:function(_42c){
if(!_42c){
_42c=this._backgroundDefault;
}
this.background=_42c.color||_42c;
this._background.setFill(this.background);
},addRange:function(_42d){
this.addRanges([_42d]);
},addRanges:function(_42e){
if(!this._rangeData){
this._rangeData=[];
}
var _42f;
for(var i=0;i<_42e.length;i++){
_42f=_42e[i];
if((this.min===null)||(_42f.low<this.min)){
this.min=_42f.low;
}
if((this.max===null)||(_42f.high>this.max)){
this.max=_42f.high;
}
if(!_42f.color){
var _430=this._rangeData.length%this.defaultColors.length;
if(dojox.gfx.svg&&this.useRangeStyles>0){
_430=(this._rangeData.length%this.useRangeStyles)+1;
_42f.color={style:"dojoxGaugeRange"+_430};
}else{
_430=this._rangeData.length%this.defaultColors.length;
_42f.color=this.defaultColors[_430];
}
}
this._rangeData[this._rangeData.length]=_42f;
}
this.draw();
},addIndicator:function(_431){
_431._gauge=this;
if(!_431.declaredClass){
_431=new this._defaultIndicator(_431);
}
if(!_431.hideValue){
this.containerNode.appendChild(_431.domNode);
}
if(!this._indicatorData){
this._indicatorData=[];
}
this._indicatorData[this._indicatorData.length]=_431;
_431.draw();
return _431;
},removeIndicator:function(_432){
for(var i=0;i<this._indicatorData.length;i++){
if(this._indicatorData[i]===_432){
this._indicatorData.splice(i,1);
_432.remove();
break;
}
}
},moveIndicatorToFront:function(_433){
if(_433.shapes){
for(var i=0;i<_433.shapes.length;i++){
_433.shapes[i].moveToFront();
}
}
},drawText:function(txt,x,y,_434,_435,_436,font){
var t=this.surface.createText({x:x,y:y,text:txt,align:_434});
t.setFill(_436);
t.setFont(font);
return t;
},removeText:function(t){
this.surface.rawNode.removeChild(t);
},updateTooltip:function(txt,e){
if(this._lastHover!=txt){
if(txt!==""){
dijit.hideTooltip(this.mouseNode);
dijit.showTooltip(txt,this.mouseNode,!this.isLeftToRight());
}else{
dijit.hideTooltip(this.mouseNode);
}
this._lastHover=txt;
}
},handleMouseOver:function(_437){
var _438=_437.target.getAttribute("hover");
if(_437.target.getAttribute("overlay")){
this._overOverlay=true;
var r=this.getRangeUnderMouse(_437);
if(r&&r.hover){
_438=r.hover;
}
}
if(this.useTooltip&&!this._drag){
if(_438){
this.updateTooltip(_438,_437);
}else{
this.updateTooltip("",_437);
}
}
},handleMouseOut:function(_439){
if(_439.target.getAttribute("overlay")){
this._overOverlay=false;
}
if(this.useTooltip&&this.mouseNode){
dijit.hideTooltip(this.mouseNode);
}
},handleMouseDown:function(_43a){
for(var i=0;i<this._indicatorData.length;i++){
var _43b=this._indicatorData[i].shapes;
for(var s=0;s<_43b.length;s++){
if(_43b[s].getEventSource()==_43a.target){
this._drag=this._indicatorData[i];
s=_43b.length;
i=this._indicatorData.length;
}
}
}
dojo.stopEvent(_43a);
},handleMouseUp:function(_43c){
this._drag=null;
dojo.stopEvent(_43c);
},handleMouseMove:function(_43d){
if(_43d){
dojo.style(this.mouseNode,"left",_43d.pageX+1+"px");
dojo.style(this.mouseNode,"top",_43d.pageY+1+"px");
}
if(this._drag){
this._dragIndicator(this,_43d);
}else{
if(this.useTooltip&&this._overOverlay){
var r=this.getRangeUnderMouse(_43d);
if(r&&r.hover){
this.updateTooltip(r.hover,_43d);
}else{
this.updateTooltip("",_43d);
}
}
}
}});
dojo.declare("dojox.widget.gauge.Range",[dijit._Widget,dijit._Contained],{low:0,high:0,hover:"",color:null,size:0,startup:function(){
this.color=this.color.color||this.color;
}});
dojo.declare("dojox.widget.gauge._Indicator",[dijit._Widget,dijit._Contained,dijit._Templated],{value:0,type:"",color:"black",label:"",font:{family:"sans-serif",size:"12px"},length:0,width:0,offset:0,hover:"",front:false,easing:dojo._defaultEasing,duration:1000,hideValue:false,noChange:false,_gauge:null,title:"",templateString:dojo.cache("dojox.widget.gauge","_Indicator.html","<div class=\"dojoxGaugeIndicatorDiv\">\n\t<label class=\"dojoxGaugeIndicatorLabel\" for=\"${title}\">${title}:</label>\n\t<input class=\"dojoxGaugeIndicatorInput\" name=\"${title}\" size=\"5\" value=\"${value}\" dojoAttachPoint=\"valueNode\" dojoAttachEvent=\"onchange:_update\"></input>\n</div>\n"),startup:function(){
if(this.onDragMove){
this.onDragMove=dojo.hitch(this.onDragMove);
}
},postCreate:function(){
if(this.title===""){
dojo.style(this.domNode,"display","none");
}
if(dojo.isString(this.easing)){
this.easing=dojo.getObject(this.easing);
}
},_update:function(_43e){
var _43f=this.valueNode.value;
if(_43f===""){
this.value=null;
}else{
this.value=Number(_43f);
this.hover=this.title+": "+_43f;
}
if(this._gauge){
this.draw();
this.valueNode.value=this.value;
if((this.title=="Target"||this.front)&&this._gauge.moveIndicator){
this._gauge.moveIndicatorToFront(this);
}
}
},update:function(_440){
if(!this.noChange){
this.valueNode.value=_440;
this._update();
}
},onDragMove:function(){
this.value=Math.floor(this.value);
this.valueNode.value=this.value;
this.hover=this.title+": "+this.value;
},draw:function(_441){
},remove:function(){
for(var i=0;i<this.shapes.length;i++){
this._gauge.surface.remove(this.shapes[i]);
}
if(this.text){
this._gauge.surface.remove(this.text);
}
}});
}
if(!dojo._hasResource["dojox.widget.AnalogGauge"]){
dojo._hasResource["dojox.widget.AnalogGauge"]=true;
dojo.provide("dojox.widget.AnalogGauge");
dojo.experimental("dojox.widget.AnalogGauge");
dojo.declare("dojox.widget.gauge.AnalogLineIndicator",[dojox.widget.gauge._Indicator],{_getShapes:function(){
return [this._gauge.surface.createLine({x1:0,y1:-this.offset,x2:0,y2:-this.length-this.offset}).setStroke({color:this.color,width:this.width})];
},draw:function(_442){
if(this.shapes){
this._move(_442);
}else{
if(this.text){
this._gauge.surface.rawNode.removeChild(this.text);
this.text=null;
}
var a=this._gauge._getAngle(Math.min(Math.max(this.value,this._gauge.min),this._gauge.max));
this.color=this.color||"#000000";
this.length=this.length||this._gauge.radius;
this.width=this.width||1;
this.offset=this.offset||0;
this.highlight=this.highlight||"#D0D0D0";
this.shapes=this._getShapes(this._gauge,this);
if(this.shapes){
for(var s=0;s<this.shapes.length;s++){
this.shapes[s].setTransform([{dx:this._gauge.cx,dy:this._gauge.cy},dojox.gfx.matrix.rotateg(a)]);
if(this.hover){
this.shapes[s].getEventSource().setAttribute("hover",this.hover);
}
if(this.onDragMove&&!this.noChange){
this._gauge.connect(this.shapes[s].getEventSource(),"onmousedown",this._gauge.handleMouseDown);
this.shapes[s].getEventSource().style.cursor="pointer";
}
}
}
if(this.label){
var len=this.length+this.offset,rad=this._gauge._getRadians(a),x=this._gauge.cx+(len+5)*Math.sin(rad),y=this._gauge.cy-(len+5)*Math.cos(rad),_443="start",aa=Math.abs(a);
if(a<=-10){
_443="end";
}
if(aa<10){
_443="middle";
}
var _444="bottom";
if(aa>90){
_444="top";
}
this.text=this._gauge.drawText(""+this.label,x,y,_443,_444,this.color,this.font);
}
this.currentValue=this.value;
}
},_move:function(_445){
var v=Math.min(Math.max(this.value,this._gauge.min),this._gauge.max),c=this.currentValue;
if(_445){
var _446=this._gauge._getAngle(v);
for(var i in this.shapes){
this.shapes[i].setTransform([{dx:this._gauge.cx,dy:this._gauge.cy},dojox.gfx.matrix.rotateg(_446)]);
if(this.hover){
this.shapes[i].getEventSource().setAttribute("hover",this.hover);
}
}
}else{
if(c!=v){
var anim=new dojo.Animation({curve:[c,v],duration:this.duration,easing:this.easing});
dojo.connect(anim,"onAnimate",dojo.hitch(this,function(step){
for(var i in this.shapes){
this.shapes[i].setTransform([{dx:this._gauge.cx,dy:this._gauge.cy},dojox.gfx.matrix.rotateg(this._gauge._getAngle(step))]);
if(this.hover){
this.shapes[i].getEventSource().setAttribute("hover",this.hover);
}
}
this.currentValue=step;
}));
anim.play();
}
}
}});
dojo.declare("dojox.widget.AnalogGauge",dojox.widget.gauge._Gauge,{startAngle:-90,endAngle:90,cx:0,cy:0,radius:0,_defaultIndicator:dojox.widget.gauge.AnalogLineIndicator,startup:function(){
if(this.getChildren){
dojo.forEach(this.getChildren(),function(_447){
_447.startup();
});
}
this.startAngle=Number(this.startAngle);
this.endAngle=Number(this.endAngle);
this.cx=Number(this.cx);
if(!this.cx){
this.cx=this.width/2;
}
this.cy=Number(this.cy);
if(!this.cy){
this.cy=this.height/2;
}
this.radius=Number(this.radius);
if(!this.radius){
this.radius=Math.min(this.cx,this.cy)-25;
}
this._oppositeMiddle=(this.startAngle+this.endAngle)/2+180;
this.inherited(arguments);
},_getAngle:function(_448){
return (_448-this.min)/(this.max-this.min)*(this.endAngle-this.startAngle)+this.startAngle;
},_getValueForAngle:function(_449){
if(_449>this._oppositeMiddle){
_449-=360;
}
return (_449-this.startAngle)*(this.max-this.min)/(this.endAngle-this.startAngle)+this.min;
},_getRadians:function(_44a){
return _44a*Math.PI/180;
},_getDegrees:function(_44b){
return _44b*180/Math.PI;
},draw:function(){
var i;
if(this._rangeData){
for(i=0;i<this._rangeData.length;i++){
this.drawRange(this._rangeData[i]);
}
if(this._img&&this.image.overlay){
this._img.moveToFront();
}
}
if(this._indicatorData){
for(i=0;i<this._indicatorData.length;i++){
this._indicatorData[i].draw();
}
}
},drawRange:function(_44c){
var path;
if(_44c.shape){
this.surface.remove(_44c.shape);
_44c.shape=null;
}
var a1,a2;
if((_44c.low==this.min)&&(_44c.high==this.max)&&((this.endAngle-this.startAngle)==360)){
path=this.surface.createCircle({cx:this.cx,cy:this.cy,r:this.radius});
}else{
a1=this._getRadians(this._getAngle(_44c.low));
a2=this._getRadians(this._getAngle(_44c.high));
var x1=this.cx+this.radius*Math.sin(a1),y1=this.cy-this.radius*Math.cos(a1),x2=this.cx+this.radius*Math.sin(a2),y2=this.cy-this.radius*Math.cos(a2),big=0;
if((a2-a1)>Math.PI){
big=1;
}
path=this.surface.createPath();
if(_44c.size){
path.moveTo(this.cx+(this.radius-_44c.size)*Math.sin(a1),this.cy-(this.radius-_44c.size)*Math.cos(a1));
}else{
path.moveTo(this.cx,this.cy);
}
path.lineTo(x1,y1);
path.arcTo(this.radius,this.radius,0,big,1,x2,y2);
if(_44c.size){
path.lineTo(this.cx+(this.radius-_44c.size)*Math.sin(a2),this.cy-(this.radius-_44c.size)*Math.cos(a2));
path.arcTo((this.radius-_44c.size),(this.radius-_44c.size),0,big,0,this.cx+(this.radius-_44c.size)*Math.sin(a1),this.cy-(this.radius-_44c.size)*Math.cos(a1));
}
path.closePath();
}
if(dojo.isArray(_44c.color)||dojo.isString(_44c.color)){
path.setStroke({color:_44c.color});
path.setFill(_44c.color);
}else{
if(_44c.color.type){
a1=this._getRadians(this._getAngle(_44c.low));
a2=this._getRadians(this._getAngle(_44c.high));
_44c.color.x1=this.cx+(this.radius*Math.sin(a1))/2;
_44c.color.x2=this.cx+(this.radius*Math.sin(a2))/2;
_44c.color.y1=this.cy-(this.radius*Math.cos(a1))/2;
_44c.color.y2=this.cy-(this.radius*Math.cos(a2))/2;
path.setFill(_44c.color);
path.setStroke({color:_44c.color.colors[0].color});
}else{
path.setStroke({color:"green"});
path.setFill("green");
path.getEventSource().setAttribute("class",_44c.color.style);
}
}
if(_44c.hover){
path.getEventSource().setAttribute("hover",_44c.hover);
}
_44c.shape=path;
},getRangeUnderMouse:function(_44d){
var _44e=null,pos=dojo.coords(this.gaugeContent),x=_44d.clientX-pos.x,y=_44d.clientY-pos.y,r=Math.sqrt((y-this.cy)*(y-this.cy)+(x-this.cx)*(x-this.cx));
if(r<this.radius){
var _44f=this._getDegrees(Math.atan2(y-this.cy,x-this.cx)+Math.PI/2),_450=this._getValueForAngle(_44f);
if(this._rangeData){
for(var i=0;(i<this._rangeData.length)&&!_44e;i++){
if((Number(this._rangeData[i].low)<=_450)&&(Number(this._rangeData[i].high)>=_450)){
_44e=this._rangeData[i];
}
}
}
}
return _44e;
},_dragIndicator:function(_451,_452){
var pos=dojo.coords(_451.gaugeContent),x=_452.clientX-pos.x,y=_452.clientY-pos.y,_453=_451._getDegrees(Math.atan2(y-_451.cy,x-_451.cx)+Math.PI/2),_454=_451._getValueForAngle(_453);
_454=Math.min(Math.max(_454,_451.min),_451.max);
_451._drag.value=_451._drag.currentValue=_454;
_451._drag.onDragMove(_451._drag);
_451._drag.draw(true);
dojo.stopEvent(_452);
}});
}
if(!dojo._hasResource["dojox.widget.gauge.AnalogArrowIndicator"]){
dojo._hasResource["dojox.widget.gauge.AnalogArrowIndicator"]=true;
dojo.provide("dojox.widget.gauge.AnalogArrowIndicator");
dojo.experimental("dojox.widget.gauge.AnalogArrowIndicator");
dojo.declare("dojox.widget.gauge.AnalogArrowIndicator",[dojox.widget.gauge.AnalogLineIndicator],{_getShapes:function(){
if(!this._gauge){
return null;
}
var x=Math.floor(this.width/2);
var head=this.width*5;
var odd=(this.width&1);
var _455=[];
var _456=[{x:-x,y:0},{x:-x,y:-this.length+head},{x:-2*x,y:-this.length+head},{x:0,y:-this.length},{x:2*x+odd,y:-this.length+head},{x:x+odd,y:-this.length+head},{x:x+odd,y:0},{x:-x,y:0}];
_455[0]=this._gauge.surface.createPolyline(_456).setStroke({color:this.color}).setFill(this.color);
_455[1]=this._gauge.surface.createLine({x1:-x,y1:0,x2:-x,y2:-this.length+head}).setStroke({color:this.highlight});
_455[2]=this._gauge.surface.createLine({x1:-x-3,y1:-this.length+head,x2:0,y2:-this.length}).setStroke({color:this.highlight});
_455[3]=this._gauge.surface.createCircle({cx:0,cy:0,r:this.width}).setStroke({color:this.color}).setFill(this.color);
return _455;
}});
}
if(!dojo._hasResource["wm.base.widget.DojoGauge"]){
dojo._hasResource["wm.base.widget.DojoGauge"]=true;
dojo.provide("wm.base.widget.DojoGauge");
dojo.declare("wm.DojoGauge",wm.Control,{useOverlayImage:true,lowRangeMin:0,lowRangeMax:20,lowRangeColor:"#FFFF00",midRangeMax:80,midRangeColor:"#BCDE53",highRangeMax:100,highRangeColor:"#FF6B0A",arrowColor1:"#0000FF",arrowColor2:"#008888",arrowColor3:"#000000",currentValue1:0,currentValue2:0,currentValue3:0,useSecondIndicator:false,useThirdIndicator:false,width:"320px",height:"180px",margin:"4",init:function(){
this.inherited(arguments);
},postInit:function(){
this.inherited(arguments);
this.createGauge();
},createGauge:function(){
if(this.gauge){
this.gauge.destroy();
}
if(this.valueIndicator1){
this.valueIndicator1.destroy();
}
if(this.valueIndicator2){
this.valueIndicator2.destroy();
}
if(this.valueIndicator3){
this.valueIndicator3.destroy();
}
if(this.gaugeNode){
dojo.destroy(this.gaugeNode);
}
this.gaugeNode=dojo.create("div",{},this.domNode);
if(!this.currentValue1){
this.currentValue1=this.lowRangeMin;
}
var _457={"type":"linear","x1":50,"x2":0,"y2":0,"y1":200,"colors":[{offset:0,color:"#FFFFFF"},{offset:1,color:"white"}]};
if(this.useOverlayImage){
var _458={url:dojo.moduleUrl("wm.base.widget.themes.default.images").path+"gaugeOverlay.png",width:280,height:155,x:10,y:32,overlay:true};
}
var _459={length:5,interval:10,offset:125,font:{family:"Arial",style:"italic",variant:"small-caps",size:"13px"}};
var _45a=[{low:this.lowRangeMin,high:this.lowRangeMax,color:this.lowRangeColor},{low:this.lowRangeMax,high:this.midRangeMax,color:this.midRangeColor},{low:this.midRangeMax,high:this.highRangeMax,color:this.highRangeColor}];
gauge=this.gauge=new dojox.widget.AnalogGauge({width:320,height:200,cx:150,cy:169,radius:125,background:_457,image:dojo.isIE&&dojo.isIE<=8||!this.useOverlayImage?"":_458,ranges:_45a,useRangeStyles:0,majorTicks:_459},this.gaugeNode);
gauge.startup();
this.valueIndicator1=new dojox.widget.gauge.AnalogArrowIndicator({value:this.currentValue1,width:3,hover:"Value: "+this.currentValue1,color:this.arrowColor1,easing:dojo.fx.easing.bounceOut});
if(this.useSecondIndicator){
this.valueIndicator2=new dojox.widget.gauge.AnalogArrowIndicator({value:this.currentValue2,width:3,hover:"Value: "+this.currentValue2,color:this.arrowColor2,easing:dojo.fx.easing.bounceOut});
}
if(this.useThirdIndicator){
this.valueIndicator3=new dojox.widget.gauge.AnalogArrowIndicator({value:this.currentValue3,width:3,hover:"Value: "+this.currentValue3,color:this.arrowColor3,easing:dojo.fx.easing.bounceOut});
}
try{
gauge.addIndicator(this.valueIndicator1);
}
catch(e){
}
try{
if(this.valueIndicator2){
gauge.addIndicator(this.valueIndicator2);
}
}
catch(e){
}
try{
if(this.valueIndicator3){
gauge.addIndicator(this.valueIndicator3);
}
}
catch(e){
}
wm.onidle(this,function(){
this.valueIndicator1.currentValue=this.currentValue1;
this.valueIndicator1.update(this.currentValue1);
this.valueIndicator1.draw(true);
if(this.valueIndicator2){
this.valueIndicator2.currentValue=this.currentValue2;
this.valueIndicator2.update(this.currentValue2);
this.valueIndicator2.draw(true);
}
if(this.valueIndicator3){
this.valueIndicator3.currentValue=this.currentValue3;
this.valueIndicator3.update(this.currentValue3);
this.valueIndicator3.draw(true);
}
});
},setCurrentValue1:function(_45b){
this.currentValue1=_45b;
if(this.valueIndicator1){
this.valueIndicator1.update(this.currentValue1);
}
},setCurrentValue2:function(_45c){
this.currentValue2=_45c;
if(this.valueIndicator2){
this.valueIndicator2.update(this.currentValue2);
}
},setCurrentValue3:function(_45d){
this.currentValue3=_45d;
if(this.valueIndicator3){
this.valueIndicator3.update(this.currentValue3);
}
},setUseOverlayImage:function(_45e){
this.useOverlayImage=_45e;
this.createGauge();
},setLowRangeMin:function(_45f){
this.lowRangeMin=_45f;
this.createGauge();
},setLowRangeMax:function(_460){
this.lowRangeMax=_460;
this.createGauge();
},setLowRangeColor:function(_461){
this.lowRangeColor=_461;
this.createGauge();
},setMidRangeMax:function(_462){
this.midRangeMax=_462;
this.createGauge();
},setMidRangeColor:function(_463){
this.midRangeColor=_463;
this.createGauge();
},setHighRangeMax:function(_464){
this.highRangeMax=_464;
this.createGauge();
},setHighRangeColor:function(_465){
this.highRangeColor=_465;
this.createGauge();
},setUseSecondIndicator:function(_466){
this.useSecondIndicator=_466;
this.createGauge();
},setUseThirdIndicator:function(_467){
this.useThirdIndicator=_467;
this.createGauge();
},setArrowColor1:function(_468){
this.arrowColor1=_468;
this.createGauge();
},setArrowColor2:function(_469){
this.arrowColor2=_469;
this.createGauge();
},setArrowColor3:function(_46a){
this.arrowColor3=_46a;
this.createGauge();
},destroy:function(){
this.valueIndicator1.destroy();
this.gauge.destroy();
this.inherited(arguments);
},toHtml:function(){
return main.dojoGauge1.gauge.domNode.innerHTML;
},_end:0});
}
