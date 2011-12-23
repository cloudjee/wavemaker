dojo.provide("wm.base.widget.Layout_design");
dojo.require("wm.base.widget.Layout");
dojo.require("wm.base.widget.Container_design");

wm.Object.extendSchema(wm.Layout, {
    themeStyleType: {ignore: 0},
	fitToContent: { ignore: 1 },
	fitToContentWidth: { ignore: 1 },
	fitToContentHeight: { ignore: 1 },
	minWidth: { ignore: 1 },
	minHeight: { ignore: 1 },
	fit: { ignore: 1 }
});


dojo.extend(wm.Layout, {
    themeable: true,
    themeableStyles: ["Document-Styles-BorderStyle_Radius", "Document-Styles-BorderStyle_Shadow"]
});