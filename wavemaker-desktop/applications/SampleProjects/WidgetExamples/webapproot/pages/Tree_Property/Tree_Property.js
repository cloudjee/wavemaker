dojo.declare("Tree_Property", wm.Page, {
	start: function() {
		try {
			
			
		} catch(e) {
			app.toastError(this.name + ".start() Failed: " + e.toString()); 
		}
	},

	propertyTree1Select: function(inSender, inNode, inSelectedDataList, inSelectedPropertyName, inSelectedPropertyValue) {
	  try {
            this.propertyTreeLabel.setCaption(inNode.content);		  
		  
	  } catch(e) {
		  console.error('ERROR IN propertyTree1Select: ' + e); 
	  } 
  },
  _end: 0
});