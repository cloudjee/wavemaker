dojo.declare("Tree_Object", wm.Page, {
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	tree2Click: function(inSender, inNode) {
	  try {
           this.dataTreeLabel.setCaption(inNode.content);    		  
		  
	  } catch(e) {
		  console.error('ERROR IN tree2Click: ' + e); 
	  } 
  },
  _end: 0
});