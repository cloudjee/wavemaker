dojo.declare("FlirckPage", wm.Page, {
  start: function() {
    
  },
  list1Select: function(inSender, inItem) {
    this.infoPhoto.update();
    var s = this.list1.selected.getData();
    var url = "http://farm" + s.farm + ".static.flickr.com/" + s.server + "/" + s.id + "_" + s.secret + ".jpg";
    this.picture1.setSource(url);
  },
  button1Click: function(inSender, inEvent) {
    
  },
  BuscarFotosBeforeUpdate: function(inSender, ioInput) {
    this.label2.setValue("showing",true);
  },
  BuscarFotosSuccess: function(inSender, inData) {
    this.label2.setValue("showing",false);
  },
  BuscarFotosError: function(inSender, inError) {
    this.label2.setValue("showing",false);
//    window.alert("paso un error");
  },
  BuscarFotosResult: function(inSender, inData) {
      this.label2.setValue("showing",false);
  },
  _end: 0
});