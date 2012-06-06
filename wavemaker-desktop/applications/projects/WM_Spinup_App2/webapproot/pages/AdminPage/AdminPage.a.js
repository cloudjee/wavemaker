dojo.declare("AdminPage", wm.Page, {
start: function() {
},
_end: 0
});

AdminPage.widgets = {
svarGetKey: ["wm.ServiceVariable", {"operation":"createKey","service":"SpinUpService"}, {}, {
input: ["wm.ServiceInput", {"type":"createKeyInputs"}, {}]
}],
svarUpdate: ["wm.ServiceVariable", {"operation":"checkForUpdate","service":"SpinUpService"}, {}, {
input: ["wm.ServiceInput", {"type":"checkForUpdateInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"KeyEditor.dataValue","targetProperty":"key"}, {}]
}]
}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
panel1: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
keyGenButton: ["wm.Button", {"caption":"GenKey","margin":"4"}, {"onclick":"svarGetKey"}],
updateButton: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"svarUpdate"}]
}],
KeyEditor: ["wm.Number", {"caption":"Key","captionSize":"50px","dataValue":undefined,"displayValue":"","maximum":NaN}, {}]
}]
};

AdminPage.prototype._cssText = '';
AdminPage.prototype._htmlText = '';