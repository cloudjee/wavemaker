dojo.declare("ListViewer", wm.Page, {
	"preferredDevice": "desktop",
	start: function() {
		if (wm.isInstanceType(this.owner.owner, wm.Dashboard)) 
            this.fancyPanel2.hide();
	},

	_end: 0
});