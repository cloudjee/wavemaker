dojo.declare("WidgetThemerPage", wm.Page, {
start: function() {
},
"preferredDevice": "desktop",
dojoGrid1Select: function(inSender) {
var filename = inSender.selectedItem.getValue("dataValue");
this.currentCssFile = wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + filename);
var parent = this.editorPanel;
var lines = this.currentCssFile.split(/\n/);
dojo.forEach(lines, function(l) {
var values = l.match(/\{\s\/\*(.*)\*\//);
if (values) {
var name = values[1];
new wm.Label({width: "100%", caption: name, _classes: {domNode: ["SubHeading"]}, owner: this, parent: parent});
} else {
values = l.match(/\s*(.*?)\: (.*)/);
if (values) {
new wm.Text({width: "100%", captionSize: "200px", caption: values[1], dataValue: values[2], owner: this, parent: parent});
}
}
}, this);
},
_end: 0
});

WidgetThemerPage.widgets = {
variable1: ["wm.Variable", {"isList":true,"json":"[{\"name\":\"Button\",\"dataValue\":\"button.css\"}]","type":"EntryData"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
dojoGrid1: ["wm.DojoGrid", {"columns":[
{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},
{"show":false,"field":"dataValue","title":"DataValue","width":"100%","align":"left","formatFunc":"","mobileColumn":false},
{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>\" +\n\"Name: \" + ${name} +\n\"</div>\"\n\n"}
],"dsType":"EntryData","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true,"width":"150px"}, {"onSelect":"dojoGrid1Select"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"variable1","targetProperty":"dataSet"}, {}]
}]
}],
editorPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}]
}]
};

WidgetThemerPage.prototype._cssText = '';
WidgetThemerPage.prototype._htmlText = '';