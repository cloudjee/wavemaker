dojo.declare("Main", wm.Page, {
  start: function() {
    
  },
  usersDataGrid1Selected: function(inSender, inIndex) {
    try {
      var tweeturl = 'http://search.twitter.com/search.atom?q='+this.twitternameEditor1.getDataValue();
      this.twitterFeed.setValue('url',tweeturl);
      this.twitterFeed.update();          
    } catch(e) {
      console.error('ERROR IN usersDataGrid1Selected: ' + e); 
    } 
  },
  _end: 0
});