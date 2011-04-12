dojo.provide("wm.base.widget.Buttons.Button_design");
dojo.require("wm.base.widget.Buttons.ToggleButton");
dojo.require("wm.base.widget.Buttons.RoundedButton");
dojo.require("wm.base.widget.Buttons.PopupMenuButton");

wm.Object.extendSchema(wm.ToggleButton, {
    captionUp: { group: "display", bindTarget: 1, order: 10, focus: 1, doc: 1},
    captionDown: { group: "display", bindTarget: 1, order: 11, doc: 1},
    clicked: { group: "display", type: "Boolean", bindTarget: 1, bindSource: 1, order: 12, simpleBindProp: true,doc: 1},
    caption: {ignore: 1},
    setClicked: {group: "method", params: "(inClicked)", doc: 1}
});

wm.Object.extendSchema(wm.Button, {
    caption: { group: "display", bindable: 1, order: 10, focus: 1, type: "String" },
	hint: { group: "display", order: 20 },
	imageList: { group: "display",order: 50},
    imageIndex: { group: "display", order: 51, type: "Number",  doc: 1},
    editImageIndex: { group: "display", order: 52, type: "String", doc: 1},
    setCaption: {group: "method",doc: 1},
    setImageIndex: {group: "method",doc: 1},
    setIconUrl: {group: "method",doc: 1},
    setDisabled: {group: "method", doc: 1},
    click:  {group: "method",  doc: 1}
});
wm.Button.description = "A simple button.";

wm.Object.extendSchema(wm.RoundedButton, {
    imageList: {ignore: 1},
    imageIndex: {ignore: 1},
    iconHeight: {ignore: 1},
    iconWidth: {ignore: 1},
    iconUrl: {ignore: 1},
    iconMargin: {ignore: 1},
    leftImgWidth: {ignore: 1},
    rightImgWidth: {ignore: 1},
    border: {ignore: 1},
    borderColor: {ignore: 1},
    scrollX:  {ignore: 1},
    scrollY:  {ignore: 1},
    padding:  {ignore: 1}
});



wm.PopupMenuButton.extend({
    themeableStyles: [{name: "wm.PopupMenuButton_Image", displayName: "Icon"}]
});

wm.Object.extendSchema(wm.PopupMenuButton, {
    caption: { group: "display", order: 10, focus: 1, type: "String" },
    iconClass: {hidden: true},
    editMenuItems: {group: "operation"},
    fullStructureStr: {hidden: true},
    hint: {ignore: true},
    iconUrl: {ignore: true},
    imageList:  {ignore: true},
    imageIndex: {ignore: true},
    iconMargin: {ignore: true},
    dojoMenu: {ignore: true, doc: 1},
    setIconClass: {group: "method", doc: 1}

});   


