dojo.provide("wm.base.widget.Panel_design");
dojo.require("wm.base.widget.Panel");
dojo.require("wm.base.widget.Container_design");


wm.Object.extendSchema(wm.Panel, {
    themeStyleType: {ignore: 0},
    dockTop:{group: "Docking", type: "boolean"},
    dockBottom:{group: "Docking", type: "boolean"},
    dockLeft:{group: "Docking", type: "boolean"},
    dockRight:{group: "Docking", type: "boolean"}
});

wm.Panel.extend({
    themeable: false,
    // backward-compatibility fixups
	afterPaletteDrop: function() {
		this.inherited(arguments);
	    if (this instanceof wm.FancyPanel) return;
	    var v = "top-to-bottom", h = "left-to-right", pv = (this.parent.layoutKind == v);
	    this.setLayoutKind(pv ? h : v);
		if (pv)
			this.setWidth("100%");
		else
			this.setHeight("100%");                 
	//        this.setIsRounded(true);
	}

});

 
wm.FancyPanel.extend({
    themeable: true,
    themeableProps: ["innerBorder","borderColor","labelHeight"],
    getOrderedWidgets: function() {
	return this.containerWidget.getOrderedWidgets();
    }
});

wm.Object.extendSchema(wm.FancyPanel, {
    title: { type: "String", bindTarget: 1, group: "display", order: 100, focus: true,  doc: 1},
    labelWidget: {ignore: 1,  doc: 1},
    themeStyleType:  {ignore: 1},
    containerWidget: {ignore: 1,  doc: 1},
    layoutKind: {ignore: 1},
    innerLayoutKind: {group: "layout", order: 100, shortname: "layoutKind",  doc: 1, options: ["top-to-bottom", "left-to-right"]},
    innerHorizontalAlign: {group: "layout", order: 101, shortname: "horizontalAlign", doc: 1, options: ["left", "center", "right"/*, "justified"*/]},
    innerVerticalAlign: {group: "layout", order: 101, shortname: "verticalAlign",  doc: 1, options: ["top", "middle", "bottom"/*, "justified"*/]},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    padding: {ignore: 1},
    labelHeight: {group: "layout", order: 90},
    border: {ignore: 1},
    innerBorder: {group: "style", shortname: "border",  doc: 1},
    setInnerLayoutKind: {method:1,   doc: 1},
    setInnerHorizontalAlign: {method:1, doc: 1},
    setInnerVerticalAlign: {method:1, doc: 1},
    setInnerBorder: {method:1, doc: 1},
    setTitle:  {method:1,  doc: 1},
    autoScroll: {ignore: 1}  // until we actually scroll the correct node, don't even provide this property
});


wm.Panel.description = "A container for widgets.";
