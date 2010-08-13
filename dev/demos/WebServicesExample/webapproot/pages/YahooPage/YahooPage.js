dojo.declare("YahooPage", wm.Page, {
  start: function() {
    
  },
  getTrafficSuccess: function(inSender, inData) {
        if (!inData.results || inData.results.length == 0) {
      alert("No traffic problems reported for this location!");
    }

  },
  _end: 0
});