dojo.declare("Main", wm.Page, {
	"preferredDevice": "desktop",
    start: function() {
            
    },

    loginLinkClick: function(inSender, inEvent) {
      
    },
  aboutLinkClick: function(inSender, inEvent) {
      this.loginLinkClick(inSender, inEvent);
    },
  navTogglePanelChange: function(inSender, inIndex) {
      var pageName;
      switch(this.navTogglePanel.currentButtonName) {
          case "viewProjectsToggle":
            pageName = "ProjectsPage";
            break;
          case "viewUsersToggle":
            pageName = "UsersPage";
            break;
          default:
            pageName = "IssuesPage";
      }
      this.pageContainer.setPageName(pageName);
    },
  
    mainMenuDesktopClick: function(inSender /*,args*/) {
	    window.location.search = "wmmobile=desktop";	
	},
	mainMenuPhoneClick: function(inSender /*,args*/) {
        window.location.search = "wmmobile=phone";			
	},
	mainMenuTabletClick: function(inSender /*,args*/) {
		window.location.search = "wmmobile=tablet";	
	},
	_end: 0
});