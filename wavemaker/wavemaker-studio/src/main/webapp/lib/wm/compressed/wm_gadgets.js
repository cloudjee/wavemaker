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

dojo.provide("wm.compressed.wm_gadgets");
if(!dojo._hasResource["wm.base.widget.IFrame"]){
dojo._hasResource["wm.base.widget.IFrame"]=true;
dojo.provide("wm.base.widget.IFrame");
dojo.declare("wm.IFrame",wm.Control,{scrim:true,source:"",build:function(){
this.frame=document.createElement("iframe");
this.domNode=dojo.byId(this.domNode||this.id||undefined);
if(!this.domNode){
this.domNode=this.frame;
}else{
this.domNode.appendChild(this.frame);
}
},init:function(){
dojo.addClass(this.domNode,"wmiframe");
this.inherited(arguments);
this.setSource(this.getSource());
},buildCssSetterObj:function(){
var _1=this.inherited(arguments);
_1.overflow="";
_1.overflowX="";
_1.overflowY="";
return _1;
},getSource:function(){
return this.source;
},setSource:function(_2){
if(!dojo.isString(_2)||_2=="undefined"){
_2="";
}
this.source=_2;
var _3=this.source.slice(0,4)!="http"&&this.source.slice(0,1)!="/"?this.getPath():"";
this.frame.src=this.source?_3+this.source:this.source;
this.valueChanged("source",this.source);
},toHtml:function(){
return "<iframe src='"+this.source+"'></iframe>";
}});
}
if(!dojo._hasResource["wm.base.widget.gadget.Gadget"]){
dojo._hasResource["wm.base.widget.gadget.Gadget"]=true;
dojo.provide("wm.base.widget.gadget.Gadget");
dojo.declare("wm.Gadget",wm.IFrame,{width:"268px",height:"246px",update:function(){
this.setSource(this.source);
}});
wm.Object.extendSchema(wm.Gadget,{source:{ignore:1}});
}
if(!dojo._hasResource["wm.base.widget.gadget.Stocks"]){
dojo._hasResource["wm.base.widget.gadget.Stocks"]=true;
dojo.provide("wm.base.widget.gadget.Stocks");
dojo.declare("wm.gadget.Stocks",wm.Gadget,{ticker:"GOOG",source:"http://gmodules.com/ig/ifr?url=http://www.tigersyard.com/gadgets/stock.xml&up_price1=200&up_refreshtime=1000&up_symbol1=GOOG&up_shares1=5&up_link=google&synd=open&w=320&h=190&title=Stocks&border=%23ffffff%7C3px%2C1px+solid+%23999999",setTicker:function(_4){
this.ticker=_4;
this.update();
},update:function(){
var rx=new RegExp("up_symbol1=[^&]*&","g");
this.source=this.source.replace(rx,"up_symbol1="+this.ticker+"&");
this.inherited(arguments);
}});
wm.Object.extendSchema(wm.gadget.Stocks,{ticker:{bindable:1,type:"String"}});
}
if(!dojo._hasResource["wm.base.widget.gadget.Weather"]){
dojo._hasResource["wm.base.widget.gadget.Weather"]=true;
dojo.provide("wm.base.widget.gadget.Weather");
dojo.declare("wm.gadget.Weather",wm.Gadget,{zip:"94105",source:"http://gmodules.com/ig/ifr?url=http://www.labpixies.com/campaigns/weather/weather.xml&up_degree_unit_type=0&up_city_code=none&up_zip_code=94105&synd=open&w=320&h=224&title=Live+Weather&border=%23ffffff%7C3px%2C1px+solid+%23999999",setZip:function(_5){
this.zip=_5;
this.update();
},update:function(){
var rx=new RegExp("up_zip_code=[^&]*&","g");
this.source=this.source.replace(rx,"up_zip_code="+this.zip+"&");
this.inherited(arguments);
}});
wm.Object.extendSchema(wm.gadget.Weather,{zip:{bindable:1,type:"String"}});
}
if(!dojo._hasResource["wm.base.widget.gadget.YouTube"]){
dojo._hasResource["wm.base.widget.gadget.YouTube"]=true;
dojo.provide("wm.base.widget.gadget.YouTube");
dojo.declare("wm.gadget.YouTube",wm.Gadget,{videoId:"http://youtu.be/Zmqu39fzPxY",autoScroll:true,build:function(){
this.inherited(arguments);
dojo.attr(this.domNode,"frameborder",0);
dojo.attr(this.domNode,"allowfullscreen","true");
},getSource:function(){
if(!this.videoId&&this._isDesignLoaded){
return "";
}
return "http://www.youtube.com/embed/"+(this.videoId?this.videoId.replace(/^.*\//,""):"");
},setVideoId:function(_6){
this.videoId=_6;
this.setSource(this.getSource());
}});
wm.Object.extendSchema(wm.gadget.YouTube,{videoId:{bindTarget:1,group:"display",subgroup:"behavior",requiredGroup:1}});
}
if(!dojo._hasResource["wm.base.widget.gadget.Facebook"]){
dojo._hasResource["wm.base.widget.gadget.Facebook"]=true;
dojo.provide("wm.base.widget.gadget.Facebook");
dojo.declare("wm.gadget.Facebook",wm.Gadget,{});
dojo.declare("wm.gadget.FacebookLikeButton",wm.gadget.Facebook,{width:"400px",height:"100px",base_source:"http://www.facebook.com/plugins/like.php",href:"",layout:"standard",show_faces:true,action:"like",font:"arial",colorscheme:"dark",ref:"",updateSource:function(){
var b=this.getContentBounds();
this._width=b.w;
this._height=b.h;
this.source=this.base_source+"?"+"href="+this.href+"&layout="+this.layout+"&show_faces="+this.show_faces+"&action="+this.action+"&font="+this.font+"&width="+this._width+"&height="+this._height+"&ref="+this.ref+"&colorscheme="+this.colorscheme;
this.setSource(this.source);
},renderBounds:function(){
this.inherited(arguments);
var b=this.getContentBounds();
if(b.w!=this._width||b.h!=this._height){
this.updateSource();
}
},setHref:function(_7){
this.href=_7;
this.updateSource();
},setLayout:function(_8){
this.layout=_8;
switch(_8){
case "box_count":
this.setWidth(87+this.padBorderMargin.r+this.padBorderMargin.l+"px");
this.setHeight(62+this.padBorderMargin.t+this.padBorderMargin.b+"px");
break;
case "button_count":
this.setWidth(70+this.padBorderMargin.r+this.padBorderMargin.l+"px");
this.setHeight(21+this.padBorderMargin.t+this.padBorderMargin.b+"px");
break;
case "standard":
if(this.bounds.w<150){
this.setWidth(400+this.padBorderMargin.r+this.padBorderMargin.l+"px");
}
if(this.bounds.h<50){
this.setHeight(80+this.padBorderMargin.t+this.padBorderMargin.b+"px");
}
break;
}
this.updateSource();
},setShow_Faces:function(_9){
this.show_faces=_9;
this.updateSource();
},setAction:function(_a){
this.action=_a;
this.updateSource();
},setFont:function(_b){
this.font=_b;
this.updateSource();
},setColorscheme:function(_c){
this.colorscheme=_c;
this.updateSource();
}});
dojo.declare("wm.gadget.FacebookActivityFeed",wm.gadget.Facebook,{width:"200px",height:"400px",base_source:"http://www.facebook.com/plugins/activity.php",site:"wavemaker.com",showHeader:true,font:"arial",colorscheme:"dark",showRecommendations:false,ref:"",updateSource:function(){
var b=this.getContentBounds();
this._width=b.w;
this._height=b.h;
this.source=this.base_source+"?"+"site="+this.site+"&header="+this.showHeader+"&recommendations="+this.showRecommendations+"&font="+this.font+"&width="+this._width+"&height="+this._height+"&ref="+this.ref+"&colorscheme="+this.colorscheme;
this.setSource(this.source);
},renderBounds:function(){
this.inherited(arguments);
var b=this.getContentBounds();
if(b.w!=this._width||b.h!=this._height){
this.updateSource();
}
},setSite:function(_d){
this.site=_d;
this.updateSource();
},setShowHeader:function(_e){
this.showHeader=_e;
this.updateSource();
},setShowRecommendations:function(_f){
this.showRecommendations=_f;
this.updateSource();
},setFont:function(_10){
this.font=_10;
this.updateSource();
},setColorscheme:function(_11){
this.colorscheme=_11;
this.updateSource();
}});
}
if(!dojo._hasResource["wm.base.widget.gadget.TwitterGadgets"]){
dojo._hasResource["wm.base.widget.gadget.TwitterGadgets"]=true;
dojo.provide("wm.base.widget.gadget.TwitterGadgets");
dojo.declare("wm.gadget.TwitterFollowButton",wm.Gadget,{scrim:true,autoScroll:false,width:"300px",height:"20px",screenName:"WaveMakerDev",showFollowerCount:true,buttonColor:"blue",linkColor:"",textColor:"",build:function(){
this.inherited(arguments);
dojo.attr(this.domNode,"frameborder",0);
dojo.attr(this.domNode,"scrolling","no");
dojo.attr(this.domNode,"allowtransparency","true");
},getSource:function(){
return "http://platform.twitter.com/widgets/follow_button.html?"+"screen_name="+this.screenName+"&button="+this.buttonColor+(this.linkColor?"&link_color="+this.linkColor.substring(1):"")+(this.textColor?"&text_color="+this.textColor.substring(1):"")+"&show_count="+this.showFollowerCount+"&lang="+dojo.locale;
},setScreenName:function(_12){
this.screenName=_12;
this.setSource(this.getSource());
},setButtonColor:function(_13){
this.buttonColor=_13;
this.setSource(this.getSource());
},setLinkColor:function(_14){
this.linkColor=_14;
this.setSource(this.getSource());
},setTextColor:function(_15){
this.textColor=_15;
this.setSource(this.getSource());
},setShowFollowerCount:function(_16){
this.showFollowerCount=Boolean(_16);
this.setSource(this.getSource());
}});
wm.Object.extendSchema(wm.gadget.TwitterFollowButton,{screenName:{bindTarget:1,group:"widgetName",subgroup:"behavior"},buttonColor:{group:"widgetName",subgroup:"display",options:["blue","grey"]},showFollowerCount:{group:"widgetName",subgroup:"behavior",type:"Boolean"},linkColor:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker"},textColor:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker"}});
dojo.declare("wm.gadget.TwitterTweetButton",wm.Gadget,{scrim:true,autoScroll:false,width:"100px",height:"20px",url:"http://dev.wavemaker.com/",via:"",countPosition:"horizontal",build:function(){
this.inherited(arguments);
dojo.attr(this.domNode,"frameborder",0);
dojo.attr(this.domNode,"scrolling","no");
dojo.attr(this.domNode,"allowtransparency","true");
},getSource:function(){
return "http://platform.twitter.com/widgets/tweet_button.html?"+"url="+escape(this.url)+"&count="+this.countPosition+(this.via?"&via="+this.via:"");
},setUrl:function(_17){
this.url=_17;
this.setSource(this.getSource());
},setVia:function(_18){
this.via=_18;
this.setSource(this.getSource());
},setCountPosition:function(_19){
this.countPosition=_19;
this.setSource(this.getSource());
if(this._isDesignLoaded){
switch(_19){
case "vertical":
this.setWidth("56px");
this.setHeight("63px");
break;
case "horizontal":
this.setWidth("100px");
this.setHeight("20px");
break;
case "none":
this.setWidth("55px");
this.setHeight("20px");
break;
}
}
}});
wm.Object.extendSchema(wm.gadget.TwitterTweetButton,{url:{bindTarget:1,group:"widgetName",subgroup:"behavior"},via:{bindTarget:1,group:"widgetName",subgroup:"behavior"},showFollowerCount:{group:"widgetName",subgroup:"display",type:"Boolean"},countPosition:{group:"widgetName",subgroup:"display",options:["none","horizontal","vertical"]}});
dojo.declare("wm.gadget.TwitterList",wm.Control,{scrim:true,width:"250px",height:"300px",screenName:"WaveMakerDev",title:"Your title",search:"WaveMaker",_version:2,twitterActivity:"profile",postCount:10,pollInterval:30,shellTextColor:"#ffffff",shellBackground:"#333333",tweetTextColor:"#ffffff",tweetBackground:"#000000",tweetLinkColor:"#4aed05",twitterScrollbar:true,twitterLoop:false,twitterPollingEnabled:true,twitterBehavior:"all",build:function(){
this.inherited(arguments);
if(!window["TWTR"]){
var tag=document.createElement("script");
tag.src="http://widgets.twimg.com/j/2/widget.js";
var _1a=document.getElementsByTagName("head")[0];
_1a.appendChild(tag);
}
},postInit:function(){
this.inherited(arguments);
this.initTwitterWidget();
},initTwitterWidget:function(){
if(!window["TWTR"]){
wm.job(this.getRuntimeId()+".LoadLib",50,dojo.hitch(this,"initTwitterWidget"));
return;
}
var _1b={id:this.domNode.id,version:this._version,type:this.twitterActivity,search:this.search,title:this.title,rpp:this.postCount,interval:this.pollInterval*1000,width:"auto",height:this.bounds.h,theme:{shell:{background:this.shellBackground,color:this.shellTextColor},tweets:{background:this.tweetBackground,color:this.tweetTextColor,links:this.tweetLinkColor}},features:{scrollbar:this.twitterScrollbar,loop:this.twitterLoop,live:this.twitterPollingEnabled,behavior:this.twitterBehavior}};
this._twidget=new TWTR.Widget(_1b);
this._twidget.render();
if(this.twitterActivity=="profile"){
this._twidget.setUser(this.screenName);
}
this._twidget.start();
this.connect(this._twidget,"_prePlay",this,"getResults");
TWTR.Widget.hasLoadedStyleSheet=true;
},getResults:function(){
var _1c=this._twidget.results;
this.onSuccess(_1c);
},onSuccess:function(_1d){
},setScreenName:function(_1e){
this.screenName=_1e;
this.destroyTwitter();
this.initTwitterWidget();
},setPostCount:function(_1f){
this.postCount=_1f;
if(this._twidget){
this._twidget.setRpp(this.postCount);
}
},setPollInterval:function(_20){
this.pollInterval=_20;
if(this._twidget){
this._twidget.setTweetInterval(this.pollInterval);
}
},setShellTextColor:function(_21){
this.shellTextColor=_21;
this.destroyTwitter();
this.initTwitterWidget();
},setShellBackground:function(_22){
this.shellBackground=_22;
this.destroyTwitter();
this.initTwitterWidget();
},setTweetTextColor:function(_23){
this.tweetTextColor=_23;
this.destroyTwitter();
this.initTwitterWidget();
},setTweetBackground:function(_24){
this.tweetBackground=_24;
this.destroyTwitter();
this.initTwitterWidget();
},setTweetLinkColor:function(_25){
this.tweetLinkColor=_25;
this.destroyTwitter();
this.initTwitterWidget();
},setTwitterScrollbar:function(_26){
this.twitterScrollbar=_26;
this.destroyTwitter();
this.initTwitterWidget();
},setTwitterLoop:function(_27){
this.twitterLoop=_27;
this.destroyTwitter();
this.initTwitterWidget();
},setPollingEnabled:function(_28){
this.pollingEnabled=_28;
this.destroyTwitter();
this.initTwitterWidget();
},setTwitterActivity:function(_29){
this.twitterActivity=_29;
this.destroyTwitter();
this.initTwitterWidget();
},setSearch:function(_2a){
this.search=_2a;
if(this._twidget){
this._twidget.setSearch(this.search);
}
},setTitle:function(_2b){
this.title=_2b;
if(this._twidget){
this._twidget.setTitle(this.title);
}
},destroyTwitter:function(){
if(this._twidget){
this._twidget.destroy();
delete this._twidget;
}
},renderBounds:function(){
this.inherited(arguments);
if(this._twidget){
this._twidget._fullScreenResize();
}
},destroy:function(){
this.destroyTwitter();
this.inherited(arguments);
},listProperties:function(){
var p=this.inherited(arguments);
p.title.ignoretmp=p.search.ignoretmp=(this.twitterActivity!="search");
p.screenName.ignoretmp=(this.twitterActivity!="profile");
return p;
}});
wm.Object.extendSchema(wm.gadget.TwitterList,{screenName:{bindTarget:1,group:"widgetName",subgroup:"behavior"},title:{bindTarget:1,group:"widgetName",subgroup:"display"},search:{bindTarget:1,group:"widgetName",subgroup:"behavior"},twitterActivity:{group:"widgetName",subgroup:"behavior",options:["profile","search"]},postCount:{group:"widgetName",subgroup:"display",order:100},twitterScrollbar:{group:"widgetName",subgroup:"display",order:101},twitterLoop:{group:"widgetName",subgroup:"behavior",order:102},pollInterval:{group:"widgetName",subgroup:"behavior",order:110},twitterPollingEnabled:{group:"widgetName",subgroup:"behavior",order:111},shellTextColor:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker",order:200},shellBackground:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker",order:201},tweetTextColor:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker",order:202},tweetBackground:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker",order:203},tweetLinkColor:{group:"widgetName",subgroup:"display",editor:"wm.ColorPicker",order:204},twitterBehavior:{ignore:1}});
}
if(!dojo._hasResource["wm.base.widget.gadget.GoogleMap"]){
dojo._hasResource["wm.base.widget.gadget.GoogleMap"]=true;
dojo.provide("wm.base.widget.gadget.GoogleMap");
dojo.declare("wm.gadget.GoogleMap",wm.Control,{scrim:true,width:"100%",height:"100%",minHeight:"100",latitude:37.789607,longitude:-122.39984,zoom:17,mapType:"ROADMAP",dataSet:"",addressField:"",latitudeField:"",longitudeField:"",titleField:"",descriptionField:"",iconField:"",_map:"",_markers:"",_infoWindow:"",selectedItem:"",init:function(){
this._dataToGeocode=[];
if(!dojo.byId("GoogleMapsScript")){
var _2c=document.createElement("script");
_2c.type="text/javascript";
_2c.id="GoogleMapsScript";
_2c.src="http://maps.google.com/maps/api/js?sensor=false&callback=wm.gadget.GoogleMap.initialize";
document.body.appendChild(_2c);
}
this._markers=[];
this.inherited(arguments);
this.selectedItem=new wm.Variable({name:"selectedItem",owner:this});
},postInit:function(){
this.inherited(arguments);
if(window.google&&window.google.maps){
this.initialize();
}else{
wm.gadget.GoogleMap.waitingForInitialize.push(this);
}
},initialize:function(){
var _2d=new google.maps.LatLng(this.latitude,this.longitude);
var _2e={zoom:this.zoom,center:_2d,mapTypeId:google.maps.MapTypeId[this.mapType]};
this._map=new google.maps.Map(this.domNode,_2e);
if(this.dataSet&&this.dataSet.getCount()){
this.generateMarkers();
}
this._infoWindow=new google.maps.InfoWindow();
},renderBounds:function(){
if(this.inherited(arguments)&&this._map){
google.maps.event.trigger(this._map,"resize");
}
},setZoom:function(_2f){
this.zoom=_2f;
if(this._map){
this._map.setZoom(Number(_2f));
}
},setLatitude:function(_30){
this.latitude=_30;
if(this._map){
this._map.setCenter(new google.maps.LatLng(this.latitude,this.longitude));
}
},setLongitude:function(_31){
this.longitude=_31;
if(this._map){
this._map.setCenter(new google.maps.LatLng(this.latitude,this.longitude));
}
},fitToMarkers:function(){
var _32=10000000;
var _33=10000000;
var _34=-1000000;
var _35=-1000000;
if(!this.dataSet){
return;
}
var _36=this.dataSet.getCount();
if(_36==0){
return;
}
for(var i=0;i<_36;i++){
var _37=this.dataSet.getItem(i);
var lat=_37.getValue(this.latitudeField);
var lon=_37.getValue(this.longitudeField);
if(lat<_32){
_32=lat;
}
if(lat>_34){
_34=lat;
}
if(lon<_33){
_33=lon;
}
if(lon>_35){
_35=lon;
}
}
var _38=new google.maps.LatLng(_34,_35);
var _39=new google.maps.LatLng(_32,_33);
this._map.fitBounds(new google.maps.LatLngBounds(_39,_38));
},setMapType:function(_3a){
this.mapType=_3a;
if(this._map){
this._map.setMapTypeId(google.maps.MapTypeId[this.mapType]);
}
},setDataSet:function(_3b){
this.dataSet=_3b;
if(_3b){
this.selectedItem.setType(_3b.type);
}
dojo.forEach(this._markers,function(m){
m.setMap(null);
});
this._markers=[];
if(this._map&&_3b){
this.generateMarkers();
}
},geocode:function(_3c){
this._dataToGeocode.push(_3c);
this.geocodeNext();
},geocodeNext:function(){
if(this._geocoding){
return;
}
this._geocoding=true;
this.onIncrementGeocodeCount(this._dataToGeocode.length,this.dataSet.getCount());
this._geocode(this._dataToGeocode.shift(),this._dataToGeocode.length?dojo.hitch(this,"geocodeNext"):dojo.hitch(this,"onGeocodeComplete"));
},onIncrementGeocodeCount:function(_3d,_3e){
},onGeocodeComplete:function(){
},onGeocodeSuccess:function(_3f){
},onGeocodeError:function(_40,_41){
},_geocode:function(_42,_43){
var _44=this;
var _45;
if(!this.geocoder){
this.geocoder=new google.maps.Geocoder();
}
this.geocoder.geocode({"address":_42[this.addressField]},function(_46,_47){
_44._geocoding=false;
if(_47==google.maps.GeocoderStatus.OK){
var _48=_46[0].geometry.location;
_42[_44.latitudeField]=_48.lat();
_42[_44.longitudeField]=_48.lng();
_44.generateMarker(_42);
_44.onGeocodeSuccess(_42);
}else{
if(_47==google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
_44._dataToGeocode.push(_42);
wm.job("geocodeNext",500,dojo.hitch(_44,"geocodeNext"));
return;
}else{
console.error("Failed to geocode "+_42[_44.addressField]+"; "+_47);
_44.onGeocodeError(_47,_42);
}
}
if(_43){
_43();
}
});
},geocode:function(_49){
this._dataToGeocode.push(_49);
this.geocodeNext();
},geocodeNext:function(){
if(this._geocoding){
return;
}
this._geocoding=true;
this.onIncrementGeocodeCount(this._dataToGeocode.length,this.dataSet.getCount());
this._geocode(this._dataToGeocode.shift(),this._dataToGeocode.length?dojo.hitch(this,"geocodeNext"):dojo.hitch(this,"onGeocodeComplete"));
},onIncrementGeocodeCount:function(_4a,_4b){
},onGeocodeComplete:function(){
},onGeocodeSuccess:function(_4c){
},onGeocodeError:function(_4d,_4e){
},_geocode:function(_4f,_50){
var _51=this;
var _52;
if(!this.geocoder){
this.geocoder=new google.maps.Geocoder();
}
this.geocoder.geocode({"address":_4f[this.addressField]},function(_53,_54){
_51._geocoding=false;
if(_54==google.maps.GeocoderStatus.OK){
var _55=_53[0].geometry.location;
_4f[_51.latitudeField]=_55.lat();
_4f[_51.longitudeField]=_55.lng();
_51.generateMarker(_4f);
_51.onGeocodeSuccess(_4f);
}else{
if(_54==google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
_51._dataToGeocode.push(_4f);
wm.job("geocodeNext",500,dojo.hitch(_51,"geocodeNext"));
return;
}else{
console.error("Failed to geocode "+_4f[_51.addressField]+"; "+_54);
_51.onGeocodeError(_54,_4f);
}
}
if(_50){
_50();
}
});
},geocode:function(_56){
this._dataToGeocode.push(_56);
this.geocodeNext();
},geocodeNext:function(){
if(this._geocoding){
return;
}
this._geocoding=true;
this.onIncrementGeocodeCount(this._dataToGeocode.length,this.dataSet.getCount());
this._geocode(this._dataToGeocode.shift(),this._dataToGeocode.length?dojo.hitch(this,"geocodeNext"):dojo.hitch(this,"onGeocodeComplete"));
},onIncrementGeocodeCount:function(_57,_58){
},onGeocodeComplete:function(){
},onGeocodeSuccess:function(_59){
},onGeocodeError:function(_5a,_5b){
},_geocode:function(_5c,_5d){
var _5e=this;
var _5f;
if(!this.geocoder){
this.geocoder=new google.maps.Geocoder();
}
this.geocoder.geocode({"address":_5c[this.addressField]},function(_60,_61){
_5e._geocoding=false;
if(_61==google.maps.GeocoderStatus.OK){
var _62=_60[0].geometry.location;
_5c[_5e.latitudeField]=_62.lat();
_5c[_5e.longitudeField]=_62.lng();
_5e.generateMarker(_5c);
_5e.onGeocodeSuccess(_5c);
}else{
if(_61==google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
_5e._dataToGeocode.push(_5c);
wm.job("geocodeNext",500,dojo.hitch(_5e,"geocodeNext"));
return;
}else{
console.error("Failed to geocode "+_5c[_5e.addressField]+"; "+_61);
_5e.onGeocodeError(_61,_5c);
}
}
if(_5d){
_5d();
}
});
},generateMarkers:function(){
var _63=this.dataSet.getData();
for(var i=0;i<_63.length;i++){
_63[i]._index=i+1;
this.generateMarker(_63[i]);
}
if(this._dataToGeocode.length){
this.geocodeNext();
}
},generateMarker:function(d){
var lat=d[this.latitudeField];
var lon=d[this.longitudeField];
var _64=d[this.addressField];
var _65=d[this.titleField];
var _66=d[this.descriptionField];
var _67=d[this.iconField];
if(_64&&!lat&&!lon){
this._dataToGeocode.push(d);
return;
}
switch(_67){
case "green":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/green/blank.png";
break;
case "blue":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png";
break;
case "red":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/red/blank.png";
break;
case "pink":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/pink/blank.png";
break;
case "orange":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/blank.png";
break;
case "green1":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/green/marker"+d._index+".png";
break;
case "blue1":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/marker"+d._index+".png";
break;
case "red1":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/red/marker"+d._index+".png";
break;
case "pink1":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/pink/marker"+d._index+".png";
break;
case "orange1":
_67="http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/marker"+d._index+".png";
break;
}
var _68=new google.maps.Marker({icon:_67,position:new google.maps.LatLng(lat,lon),map:this._map,title:_65});
this._markers.push(_68);
google.maps.event.addListener(_68,"click",dojo.hitch(this,function(){
if(_66){
this._infoWindow.setContent("<h3>"+_65+"</h3>"+_66);
this._infoWindow.open(this._map,_68);
}
this.selectedItem.setData(d);
this.onMarkerClick(d);
this.onMarkerChange(d);
}));
},selectMarkerByIndex:function(_69){
this._clickMarker(this._markers[_69],this.dataSet.getItem(_69));
},_clickMarker:function(_6a,_6b){
var _6c="<h3 class='MapMarkerTitle'>"+_6b.getValue(this.titleField)+"</h3><div class='MapMarkerDescription'>"+_6b.getValue(this.descriptionField)+"</div>";
this._infoWindow.setContent(_6c);
this._infoWindow.open(this._map,_6a);
this.onMarkerChange(_6b);
},onMarkerClick:function(_6d){
},onMarkerChange:function(_6e){
},_end:0});
wm.gadget.GoogleMap.waitingForInitialize=[];
wm.gadget.GoogleMap.initialize=function(){
dojo.forEach(wm.gadget.GoogleMap.waitingForInitialize,function(w){
w.initialize();
});
wm.gadget.GoogleMap.waitingForInitialize=[];
};
}
