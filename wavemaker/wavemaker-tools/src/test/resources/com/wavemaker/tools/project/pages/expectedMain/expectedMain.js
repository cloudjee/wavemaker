dojo.declare("expectedMain", turbo.Part, {
	start: function() {
		
	},
	dataGrid1CellClick: function(inSender, inEvent) {
		app.projectpage.mainPane.setPageName("ProjectDetailPage");
	},
	_end: 0
});
