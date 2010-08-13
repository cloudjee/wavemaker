dojo.declare("GmailPage", wm.Page, {
  start: function() {
    
  },
  LectorGmailError: function(inSender, inError) {
     this.error_lbl.setValue("showing", true);
     this.loading_lbl.setValue("showing", false);
     this.usuario.editor.setValue("disabled",false);
     this.password.editor.setValue("disabled",false);
     this.button1.setValue("disabled",false);
  },
  LectorGmailBeforeUpdate: function(inSender, ioInput) {
     this.error_lbl.setValue("showing", false);
     this.loading_lbl.setValue("showing", true);
     this.usuario.editor.setValue("disabled",true);
     this.password.editor.setValue("disabled",true);
     this.button1.setValue("disabled",true);
  },
  LectorGmailSuccess: function(inSender, inData) {
     this.loading_lbl.setValue("showing", false);
     this.usuario.editor.setValue("disabled",false);
     this.password.editor.setValue("disabled",false);
     this.button1.setValue("disabled",false);
  },
  _end: 0
});