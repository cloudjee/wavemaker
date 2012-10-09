dojo.declare("Mouse_MouseOver", wm.Page, {
"preferredDevice": "desktop",
start: function() {
try {
} catch(e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
// Called by onClick event for basicButton
basicButtonClick: function(inSender) {
try {
this.buttonPushVar.setValue('dataValue',this.buttonPushVar.getValue('dataValue')+1);
} catch(e) {
console.error('ERROR IN basicButtonClick: ' + e);
}
},
_end: 0
});

Mouse_MouseOver.widgets = {
buttonPushVar: ["wm.Variable", {"type":"NumberData"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"0","source":false,"targetProperty":"dataValue"}, {}]
}]
}],
buttonClickDialog: ["wm.GenericDialog", {"button1Caption":undefined,"button1Close":true,"corner":"cr","desktopHeight":"70px","height":"59px","modal":false,"positionNear":"basicButton","title":"Custom Popup Dialog","userPrompt":"Now move the mouse away..."}, {}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label4: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"MouseOver Event","padding":"4","width":"108px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
label14: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label16: ["wm.Label", {"autoSizeHeight":true,"caption":"<b>Directions:</b> Point your mouse at the button.  Then move it away from the button.","height":"34px","padding":"4","singleLine":false,"width":"100%"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
basicButton: ["wm.Button", {"caption":"Point at Me!","hint":undefined,"margin":"4","width":"96px"}, {"onMouseOut":"buttonClickDialog.hide","onMouseOver":"buttonClickDialog.show"}]
}]
}],
panel17: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
html2: ["wm.Html", {"height":"100%","html":"<p>The onMouseOver and onMouseOut events are available for almost all widgets. Such events are typically used for\n<ul>\n<li>Tooltips/popups</li>\n<li>Change content in a side panel</li>\n<li>Preload data before a user clicks/performs an action</li>\n</ul>\n<h4>Documentation</h4>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Control_onMouseOver\" target=\"_blank\">onMouseOver</a></li>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Control_onMouseOut\" target=\"_blank\">onMouseOut</a></li>\n</ul>\n</p>","margin":"5","minDesktopHeight":15}, {}]
}]
}]
}]
}]
}]
}]
}]
};

Mouse_MouseOver.prototype._cssText = '';
Mouse_MouseOver.prototype._htmlText = '';