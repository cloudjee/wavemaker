dojo.declare("WeatherForecastPage", wm.Page, {
  start: function() {
    
  },
  list1Format: function(inSender, ioData, inColumn, inData, inHeader) {
        if (inColumn == 1 && inHeader != true) {
      ioData.data = '<img src="' + ioData.data + '">';
    }

  },
  _end: 0
});