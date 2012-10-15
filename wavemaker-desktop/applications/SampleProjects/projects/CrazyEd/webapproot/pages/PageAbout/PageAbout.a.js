dojo.declare("PageAbout", wm.Page, {
"preferredDevice": "desktop",
start: function() {
},
_end: 0
});

PageAbout.widgets = {
layoutBox1: ["wm.Layout", {"horizontalAlign":"center","verticalAlign":"top"}, {}, {
htmlAbout: ["wm.Html", {"html":"resources/htmlcontent/About.txt","minDesktopHeight":15,"width":"80%"}, {}]
}]
};

PageAbout.prototype._cssText = '';
PageAbout.prototype._htmlText = '';