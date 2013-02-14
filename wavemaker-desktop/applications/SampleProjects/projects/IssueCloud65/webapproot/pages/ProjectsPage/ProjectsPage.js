dojo.declare("ProjectsPage", wm.Page, {
	"preferredDevice": "tablet",
    start: function() {
            
    },

    viewIssuesClick: function(inSender) {
        var projectData = this.projectDojoGrid.selectedItem.getData();
		
        // this call will unload/destroy this page. Do not refer to any components on this page after this call
        main.gotoIssuesPage.update();
        
        var p = wm.getPage("IssuesPage");
        p.projectMenu.setDataValue(projectData);
	},
	_end: 0
});