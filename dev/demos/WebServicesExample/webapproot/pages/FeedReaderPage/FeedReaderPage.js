dojo.declare("FeedReaderPage", wm.Page, {
  start: function() {
      this.list1.renderData([
      {name: "Ajaxian Front Page", url: "http://ajaxian.com/index.xml"},
      {name: "BBC News World Edition", url:"http://news.bbc.co.uk/rss/newsonline_world_edition/front_page/rss.xml"},
      {name: "CNN.com", url: "http://rss.cnn.com/rss/cnn_topstories.rss"},
      {name: "ESPN.com", url: "http://sports.espn.go.com/espn/rss/news"},
      {name: "Google News   Sci/Tech", url:"http://news.google.com/news?pz=1&ned=us&hl=en&topic=t&output=rss"},
      {name: "Mundo Coolf", url:"http://mundocoolf.blogspot.com/atom.xml"},
      {name: "Slashdot", url:"http://rss.slashdot.org/Slashdot/slashdot"},
      {name: "Wired Top Stories", url:"http://feeds.wired.com/wired/index"},
      {name: "WaveMaker", url: "http://www.wavemaker.com/rss/wavemakernews.xml"},
      {name: "WebIntenta", url:"http://www.webintenta.com/feed"}
    ]);
  },
  list1Click: function(inSender, inEvent, inItem) {
       this.editor1.setDataValue(inItem.getData().url);
  },
  editor1Change: function(inSender, inDisplayValue, inDataValue) {
    
  },
  _end: 0
});