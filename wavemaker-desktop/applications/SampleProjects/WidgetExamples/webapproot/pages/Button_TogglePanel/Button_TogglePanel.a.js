dojo.declare("Button_TogglePanel", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
_end: 0
});

Button_TogglePanel.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"caption":"Toggle Button Panel","padding":"4","width":"222px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"padding":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
label18: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label26: ["wm.Label", {"caption":"<b>Directions:</b> Change which button is selected to see how the UI can update","height":"34px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel15: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
toggleButtonPanel1: ["wm.ToggleButtonPanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"button1","targetProperty":"currentButton"}, {}]
}],
button1: ["wm.Button", {"border":"0,1,0,0","caption":"Dogs","margin":"0","width":"100%"}, {"onclick":"dogLayer"}],
button2: ["wm.Button", {"border":"0,1,0,0","caption":"Cats","margin":"0","width":"100%"}, {"onclick":"catsLayer"}],
button3: ["wm.Button", {"caption":"Mice","margin":"0","width":"100%"}, {"onclick":"miceLayer"}]
}]
}],
label20: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel11: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
label9: ["wm.Label", {"autoSizeWidth":true,"caption":"Button is clicked = ","padding":"4","width":"108px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label11: ["wm.Label", {"border":"1","padding":"4","width":"43px"}, {}, {
format: ["wm.DataFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"toggleButtonPanel1.currentButtonCaption","targetProperty":"caption"}, {}]
}]
}]
}],
layers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px"}, {}, {
dogLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Dogs","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
label1: ["wm.Label", {"align":"center","caption":"The world is going to the dogs","padding":"4","width":"100%"}, {}]
}],
catsLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Cats","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
label2: ["wm.Label", {"align":"center","caption":"The world is going to the cats","padding":"4","width":"100%"}, {}]
}],
miceLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Mice","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
label3: ["wm.Label", {"align":"center","caption":"The world is going to the track pads","padding":"4","width":"100%"}, {}]
}]
}]
}],
panel25: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel3: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel4: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html3: ["wm.Html", {"height":"100%","html":"<p>The toggle button panel insures that only one button in the panel is clicked, and updates its state when the clicked button changes.</p>\n<p>This example shows <ul>\n<li><b>Binding</b>: A label in the Result section is bound to the ToggleButtonPanel's selected catpion</li>\n<li><b>Event Handler</b>: Using the onClick event of the buttons we can change which tab is active below.  This is built using drag and drop development and no code!</li>\n</ul></p>\n</ul>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.5/ToggleButtonPanel\">Toggle Button Panel</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=button\">Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=busy\">Toggle Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=popup\">Popup Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
};

Button_TogglePanel.prototype._cssText = '';
Button_TogglePanel.prototype._htmlText = '';