dojo.declare("Main", wm.Page, {
	"preferredDevice": "desktop",
  start: function() {
  
    // subscribe session expiration
    dojo.subscribe("session-expiration", this, "sessExp");    

    this.initSups();
  },
  
  sessExp: function (){
      proto = window.location.protocol
      host = window.location.host;
      appName = app.declaredClass;
      // Doctor url for login page
      window.location.href = proto + "//" + host +"/"+ appName +"/login.html"; 
  },
  // Initializes link to show underline and change mouse to pointer onHover 
  initLink: function (inLink){
    this.connect(inLink.domNode, "onmouseover", this, dojo.hitch(this, "linkMouseOver", inLink));
    this.connect(inLink.domNode, "onmouseout", this, dojo.hitch(this, "linkMouseOut", inLink));
    this.labHome.domNode.style.cursor = "pointer";
  },  
  // intit subscription & CSS
  initSups: function() {  
    // hide control panel until roles 
    // determined; see svGetRoleResult()
    this.panControl.setShowing(false);  
    // load dojo hash
    dojo.require("dojo.hash");
    // subscribe URL change events
    dojo.connect(window,"onhashchange",this, "callback");
    //dojo.connect(dojo.global, "onhashchange", this, "callback");
    this.initLink(this.labHome);
    this.initLink(this.labMyAccount);
    this.initLink(this.labUserAccount);
    this.initLink(this.labProject);
    this.initLink(this.labIssue);
    this.initLink(this.labLogout);    

    // load the issues page in the background
    // so that a bookmark request can be performed
    //this.pcPages.loadPage("Chart");
    
  },
  
  
  // ******** LINK HOVER EVENTS *********
  
  // mouse hover functions for links
  linkMouseOver: function(inWidget) {
    inWidget.domNode.style.textDecoration = "underline";
  }, 
  linkMouseOut: function(inWidget) {
    inWidget.domNode.style.textDecoration = "";
  },

  // ******** BUTTON HOVER EVENTS *********
  
  // mouse hover functions for buttons
  btnMouseOver: function(inWidget) {
    inWidget.setBorder(3);
    inWidget.setBorderColor("#FF9966");
  }, 
  btnMouseOut: function(inWidget) {
    inWidget.setBorder(1);
    inWidget.setBorderColor("#ABB8CF");
  },
    
  // ******** OWN FUNCTIONS *********  
  
  // sets 2 URL parameters
  setHash: function(inPage,inParam) {
    if(inParam>0) {
      obj = {
          page: inPage,
          param: inParam
      }
    } else {
      obj = {
          page: inPage
      }
    }
    dojo.hash(dojo.objectToQuery(obj));
  },
  // gets the paramter of the URL hash
  getHashParam: function() {
    var obj = dojo.queryToObject(dojo.hash());
    return obj.param;
  },
  // updates the parameter value
  updateHashParam: function (inParam) {
    var obj = dojo.queryToObject(dojo.hash());
    obj.param = inParam;
    dojo.hash(dojo.objectToQuery(obj));
  },
  // adds a tailing segment to the url
  addHashTail: function (inTailing) {
    var obj = dojo.hash().split("/");
    obj.push(inTailing);
    dojo.hash(obj.join("/"));
  },
  // called when URL changed by dojo.hash() function
  callback: function () {
    //hashchange event
    var obj = dojo.queryToObject(dojo.hash());
    switch(obj.page) {
      case "home":        this.ncHome.update();
                          break;
      case "myaccount":   this.ncMyAccount.update();
                          break;
      case "useraccount": this.ncUAccount.update();
                          break;
      case "project":     this.ncProject.update();
                          break;
      case "issue":       this.ncIssue.update();
                          break;
      case "issues":      this.ncIssues.update();
                          break;
      case "comment":     if(app.vCommentId.getValue("dataValue") >= 0) {
                            this.ncComment.update();
                          }
                          break;                  
    };
  },
  // load all properties for page load
  pageLoad: function(inSpinnerName, inNavCall) {
    try { 
      // sets the height for the layer
      //this.pcPages.setHeight("0px");
      // invokes nav call
      this[inNavCall].update();
    } catch(e) {
      console.error('ERROR IN pageLoad: ' + e); 
    }   
  }, 
    
  // ******** SERVICE VAR EVENTS *********
  
  // set the width for the link panel in the header
  svGetRoleResult: function(inSender, inData) {
      try {
        if(inSender.getItem(0).getData().dataValue == "admin") {
          this.panControl.setWidth("620px");
        } else if(inSender.getItem(0).getData().dataValue == "user") {
          this.panControl.setWidth("420px");
        }
        this.panControl.reflow();
        this.panControl.setShowing(true);
      } catch(e) {
          console.error('ERROR IN svGetRoleResult: ' + e); 
      } 
  },
  
  // ******** LINK CLICK EVENTS *********
  
  // home link
  labHomeClick: function(inSender, inEvent) {
    try { 
      // set URL and callback gets invoked
      this.setHash("home");      
    } catch(e) {
      console.error('ERROR IN labHomeClick: ' + e); 
    } 
  },
  // myaccount link
  labMyAccountClick: function(inSender, inEvent) {
    try {
      this.setHash("myaccount"); 
    } catch(e) {
      console.error('ERROR IN labMyAccountClick: ' + e); 
    } 
  },
  // user account link
  labUserAccountClick: function(inSender, inEvent) {
    try {
      this.setHash("useraccount");
    } catch(e) {
      console.error('ERROR IN labUserAccountClick: ' + e); 
    } 
  },
  // project link
  labProjectClick: function(inSender, inEvent) {
    try {
       this.setHash("project"); 
    } catch(e) {
      console.error('ERROR IN labProjectClick: ' + e); 
    } 
  },
  // issue link
  labIssueClick: function(inSender, inEvent) {
    try {
     this.setHash("issues");
    } catch(e) {
      console.error('ERROR IN labIssueClick: ' + e); 
    } 
  },
  // logout link 
  labLogoutClick: function(inSender, inEvent) {
    try {
      wm.logout();
    } catch(e) {
      console.error('ERROR IN labLogoutClick: ' + e); 
    } 
  },


  _end: 0
});
