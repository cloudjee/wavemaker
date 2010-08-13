dojo.declare("AmazonPage", wm.Page, {
  start: function() {
    
  },
  AmazonVarBeforeUpdate: function(inSender, ioInput) {
    this.label2.setValue("showing",true);
  },
  AmazonVarSuccess: function(inSender, inData) {
     this.label2.setValue("showing",false);
  },
  _end: 0
});