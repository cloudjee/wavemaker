Studio's webapp folder
======================

The webapp folder contains all resources that can be loaded from a web browser.  There are two types of files in webapp:
1. Designtime libraries: Widgets, code, pages, css for use by Studio.
   	   These should NOT be deployed when a user deploys their application,
	   but can be customized and deployed by developers needing to customize
	   Studio itself.
2. Runtime libraries: Widgets, code, css for running user applications
   	   (also used by the Studio application).  These all need to be deployed
	   when a user deploys their application.

Folder List
---------
* app: Contains files that extend the Studio page; contains various utilities such as copy/paste.  Contains the property inspector
* build: Contains most (but not all) of the libraries used by studio and the UI Framework as compressed files.  Some compression was not done in order to maintain function input names, as these are needed when generating event handlers for  the user.  While build files are not needed for running Studio on localhost, they are critical for running Studio from the cloud.
* branding: Contains sample files for rebranding studio. http://dev.wavemaker.com/wiki/bin/wmdoc_6.5/Branding
* images: Images used by Studio.  A lot of images here are no longer used.
* languages: Localization files.  These are not currently maintained.  We have localization files for Japanese that were completed for WM 6.4 but not maintained.  We have localization files for Spanish that were never completed. http://dev.wavemaker.com/wiki/bin/wmdoc_6.5/Localization
* lib: Runtime libraries; these are used both by Studio and all applications.
* pages: All of the pages used by Studio; most of them within Dialogs.
* services: Contains smd files that indicate what java services are available to the client.  These are needed by ServiceVariables, but ServiceVariables can not be used by Studio, so these files are not required for Studio.
* WEB-INF: Tomcat and spring configuration files, class and jar files.

File List
---------
* index.html: Html file that causes Studio to load.
* Readme.md: Umm....
* types.js: Loads basic types into Studio.  Mostly Studio needs the types from the users projects, and Studio-specific types are declared in client-side code written elsewhere.
				   
MISC NOTES:
* md formatting can be read about at http://daringfireball.net/projects/markdown/syntax and https://help.github.com/articles/github-flavored-markdown
