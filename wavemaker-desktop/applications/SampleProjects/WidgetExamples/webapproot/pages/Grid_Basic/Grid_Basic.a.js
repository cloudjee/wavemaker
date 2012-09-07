dojo.declare("Grid_Basic", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Grid_Basic.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel12: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label13: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"caption":"Grid Widget","padding":"4","width":"166px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px"}, {}, {
layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Standard Grid","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label20: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"caption":"<b>Directions:</b> this grid shows employees - try selecting a row.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel16: ["wm.Panel", {"height":"236px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel17: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"42px"}, {}],
dojoGrid1: ["wm.DojoGrid", {"columns":[{"show":true,"field":"picurl","title":"-","width":"40px","align":"left","formatFunc":"wm_image_formatter","formatProps":{"width":40,"height":40},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":false,"field":"eid","title":"Eid","width":"80px","align":"right","formatFunc":"","mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"birthdate","title":"Birthdate","width":"100px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>-: \" + wm.DojoGrid.prototype.imageFormatter({\"width\":40,\"height\":40}, null,null,null,${picurl}) + \"</div>\"\n+ \"<div class='MobileRow'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n+ \"<div class='MobileRow'>City: \" + ${city} + \"</div>\"\n+ \"<div class='MobileRow'>Birthdate: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${birthdate}) + \"</div>\"\n","mobileColumn":true}],"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label19: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel18: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label14: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":false,"source":"dojoGrid1.selectedItem.lastname","targetProperty":"caption"}, {}]
}]
}]
}]
}],
layer2: ["wm.Layer", {"_classes":{"domNode":["wmmobile"]},"border":"1","borderColor":"#999999","caption":"Mobile List (Tablet)","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label21: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label17: ["wm.Label", {"caption":"<b>Directions:</b> this Mobile List shows employees - try selecting a row.","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel19: ["wm.Panel", {"height":"236px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"42px"}, {}],
list1: ["wm.List", {"_classes":{"domNode":["MobileListStyle"]},"border":"0","columns":[{"show":true,"field":"picurl","title":"Picture","width":"100%","align":"left","formatFunc":"wm_image_formatter","formatProps":{"width":40,"height":40},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"eid","title":"Eid","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Picture: \" + wm.DojoGrid.prototype.imageFormatter({\"width\":40,\"height\":40}, null,null,null,${picurl}) + \"</div>\"\n+ \"<div class='MobileRow'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n+ \"<div class='MobileRow'>City: \" + ${city} + \"</div>\"\n+ \"<div class='MobileRow'>Birthdate: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${birthdate}) + \"</div>\"\n","mobileColumn":true},{"show":true,"controller":"rightarrow","width":"20px","title":"-","field":"_rightArrow","mobileColumn":true}],"headerVisible":false,"height":"100%","margin":"0","minDesktopHeight":60,"rightNavArrow":true,"styleAsGrid":false}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel22: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label15: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel1: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"list1.selectedItem.lastname","targetProperty":"caption"}, {}]
}]
}]
}]
}],
layer3: ["wm.Layer", {"_classes":{"domNode":["wmmobile"]},"border":"1","borderColor":"#999999","caption":"Mobile List (Phone)","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
label23: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label18: ["wm.Label", {"caption":"<b>Directions:</b> this Mobile List is compressed for phones into a single column, and shows employees - try selecting a row.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel23: ["wm.Panel", {"height":"236px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel24: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"42px"}, {}],
list2: ["wm.List", {"_classes":{"domNode":["MobileListStyle"]},"border":"0","columns":[{"show":false,"field":"eid","title":"Eid","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"firstname","title":"Firstname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"expression":"\"<div style='float:left;margin-right:5px;'>\" + wm.DojoGrid.prototype.imageFormatter({\"width\":40,\"height\":40}, null,null,null,${picurl}) + \"</div>\"\n+ \"<div class='MobileRow'>Firstname: \" + ${firstname} + \"</div>\"\n+ \"<div class='MobileRow'>Lastname: \" + ${lastname} + \"</div>\"\n+ \"<div class='MobileRow'>City: \" + ${city} + \"</div>\"\n+ \"<div class='MobileRow'>Birthdate: \" + wm.DojoGrid.prototype.dateFormatter({}, null,null,null,${birthdate}) + \"</div>\"\n","mobileColumn":false},{"show":false,"field":"lastname","title":"Lastname","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"street","title":"Street","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"city","title":"City","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"state","title":"State","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"zip","title":"Zip","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"birthdate","title":"Birthdate","width":"80px","align":"left","formatFunc":"wm_date_formatter","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"picurl","title":"Picurl","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"twitterid","title":"Twitterid","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"tenantid","title":"Tenantid","width":"80px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"","isCustomField":true,"mobileColumn":false},{"show":true,"controller":"rightarrow","width":"20px","title":"-","field":"_rightArrow","mobileColumn":true}],"headerVisible":false,"height":"100%","margin":"0","minDesktopHeight":60,"rightNavArrow":true,"styleAsGrid":false}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"app.empLiveVar","targetProperty":"dataSet"}, {}]
}]
}]
}],
label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel25: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
label25: ["wm.Label", {"autoSizeWidth":true,"caption":"You selected","padding":"4","width":"75px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
gridLabel2: ["wm.Label", {"padding":"4"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"list2.selectedItem.lastname","targetProperty":"caption"}, {}]
}]
}]
}]
}]
}]
}],
panel73: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel74: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html6: ["wm.Html", {"height":"100%","html":"<p>Grid widgets show tablular data, for example employees from a database. Mobile Lists take the same exact settings and grids, but present data in a more touch friendly manner.</p>\n\n<p>This example shows using the dataSet property of a grid widget to display database information and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Grid_Basic.prototype._cssText = '';
Grid_Basic.prototype._htmlText = '';