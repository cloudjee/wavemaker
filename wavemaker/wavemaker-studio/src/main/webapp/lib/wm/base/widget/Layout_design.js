dojo.provide("wm.base.widget.Layout_design");
dojo.require("wm.base.widget.Layout");
dojo.require("wm.base.widget.Container_design");

wm.Object.extendSchema(wm.Layout, {
    mobileFoldingType: {group: "mobile", order: 0, options: ["wm.TabLayers", "wm.BreadcrumbLayers", "wm.AccordionLayers", "wm.Layers"]},
    mobileFolding: {ignore:1},
    mobileFoldingCaption: {ignore:1},
    mobileFoldingIndex: {ignore:1},
    deviceType: {ignore: 1},
    deviceSize: {ignore: 1},
    themeStyleType: {ignore: 0},
	fitToContent: { ignore: 1 },
	fitToContentWidth: { ignore: 1 },
	fitToContentHeight: { ignore: 1 },
	minWidth: { ignore: 1 },
	minHeight: { ignore: 1 },
	fit: { ignore: 1 }
});


wm.Layout.extend({
    themeable: true,
    themeableStyles: ["Document-Styles-BorderStyle_Radius", "Document-Styles-BorderStyle_Shadow"],
    set_mobileFoldingType: function(inType) {
	this.mobileFoldingType = inType;
	if (studio.mobileFoldingToggleButton.clicked) {
	    // redo mobile folding
	    studio.designPhoneUI(false);
	    studio.designMobileFolding(true);
	}
    },
    listProperties: function() {
	var p = this.inherited(arguments);
	p.mobileFoldingType.ignoretmp = !studio.mobileFoldingToggleButton.clicked;
	return p;
    }
});