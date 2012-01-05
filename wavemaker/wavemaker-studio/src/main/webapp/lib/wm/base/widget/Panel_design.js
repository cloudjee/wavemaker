dojo.provide("wm.base.widget.Panel_design");
dojo.require("wm.base.widget.Panel");
dojo.require("wm.base.widget.Container_design");


wm.Object.extendSchema(wm.Panel, {
    themeStyleType: {ignore: 0},
    dockTop:   {group: "dialog", subgroup: "docking", type: "boolean", advanced:1},
    dockBottom:{group: "dialog", subgroup: "docking", type: "boolean", advanced:1},
    dockLeft:  {group: "dialog", subgroup: "docking", type: "boolean", advanced:1},
    dockRight: {group: "dialog", subgroup: "docking", type: "boolean", advanced:1}
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

// TODO: 6.5: test the docking properties for FancyPanel
wm.Object.extendSchema(wm.FancyPanel, {
    /* Display group; text subgroup */
    title:       {group: "widgetName", subgroup: "text", order: 10, requiredGroup: true, type: "String", bindTarget: 1},
    labelHeight: {group: "widgetName", subgroup: "text", order: 20, advanced: 1},
    
    /* Display group; layout subgroup */
    innerLayoutKind:      {group: "display", subgroup: "layout", order: 100, shortname: "layoutKind", options: ["top-to-bottom", "left-to-right"], requiredGroup:1},
    innerHorizontalAlign: {group: "display", subgroup: "layout", order: 101, shortname: "horizontalAlign", options: ["left", "center", "right"/*, "justified"*/]},
    innerVerticalAlign:   {group: "display", subgroup: "layout", order: 101, shortname: "verticalAlign", options: ["top", "middle", "bottom"/*, "justified"*/]},

    /* Style group */
    innerBorder: {group: "style", order: 100, shortname: "border",  doc: 1},

    /* Ignored group */
    dockBottom:{ignore:1},
    dockTop:{ignore:1},
    dockLeft:{ignore:1},
    dockRight:{ignore:1},
    labelWidget: {ignore: 1,  doc: 1},
    themeStyleType:  {ignore: 1},
    containerWidget: {ignore: 1,  doc: 1},
    layoutKind: {ignore: 1},
    horizontalAlign: {ignore: 1},
    verticalAlign: {ignore: 1},
    padding: {ignore: 1},
    border: {ignore: 1},
    autoScroll: {ignore: 1},  // until we actually scroll the correct node, don't even provide this property

    /* Methods group */
    setInnerLayoutKind: {method:1},
    setInnerHorizontalAlign: {method:1},
    setInnerVerticalAlign: {method:1},
    setInnerBorder: {method:1},
    setTitle:  {method:1}
});


wm.Panel.description = "A container for widgets.";
