Studio's webapp/lib/wm/base/components folder
============================================

There are three types of files in this folder:
1. Components used at runtime
2. Designtime files for Components used at runtime
3. Designtime files for setting up services at designtime. These could potentially be moved to webapp/app/components

Components Used at Runtime
--------------------------
* AdaptorVariable.js: Not used/incomplete.  The goal of this experiment was to implement an adaptor:
  		      Connect a ServiceVariable to a wm.Variable
		      through an adaptor, and remap the fields as the data is transfered.
* Application.js:     This is the core component that manages the application life cycle and management of pages,
  		      and also provides various utility components such as alertDialog, toastDialog, etc...
* Binding.js: 	      Binding components manage subscriptions to property changes and notification of 
  		      the subscriber any time the property has changed
* FunctionService.js: Deprecated.  Allowed developers to have a component that fires a function call.  
  		      Deprecated because its more straightforward to either use a javascript event handler,
		      or to have your event handler be something like "mydialog.show".
* ImageList.js:       The ImageList component manages a set of sprites images, each of the same size,
  		      and allows Pictures, Buttons and other widgets to display an image from the ImageList.
* JsonRpcService.js:  Provides a Service that knows how to communicate with the server. 
  		      Used for all communication with the WaveMaker server 
		      (except for the downloadFile requests -- handled by wm.ServiceVariable).
* LiveVariable.js:    Subclass of ServiceVariable that handles all direct queries to the database.  All requests
  		      currently go through runtimeServices.
* LiveView.js: 	      Every LiveVariable has a LiveView that specifies what related tables to include in the results.
* LogoutVariable.js:  While any user can use a wm.ServiceVariable to logout, we found that users find the added functionality
  		      of bundling standard logout actions into a single component (logs out AND navigates to the login page).
* NavigationService.js: Provides a Service for changing pages.  Other forms of navigation are supported but these
  			are no longer encouraged as simpler ways now exist of triggering layer and dialog actions.
* NotificationService.js: Provides a Service for doing alerts, prompts, confirms and toast messages.
* Page.js:            Represents a single page of the application; this may be the main page or a subpage.
  		      All pages are contained by a PageContainer.
* PhoneGapService.js: Provides a Service for communicating with a device's native APIs such as camera, local storage, location, contacts, etc...
  		      Currently only works within a phonegap build, though many of these features may become standard HTML5 features.
* Property.js: 	      While this is primarily a design-time concept, PageContainers now use these at runtime.  A Property is a way
  		      to declare a property of a component to also be a property of a PageContainer or Composite so that the owner
		      can set the property of the component and only needs access to the PageContainer or Composite to do that.
* SalesForceMonitorVariable.js: Experimental.  Feel free to delete this.  This component was designed to work with a server-side feature 
  				for interfacing with Salesforce data; polling for new chatter notifications.
* Security.js:        Provides a service for logging in, logging out, and looking up the user's roles
* Service.js:         Parent class for all Services.
* ServiceCall.js:     A ServiceCall is a component that knows how to access a Service.  Any point above where we say something 
  		      provides a "Service", a ServiceCall subclass is used to access that service.
		      ServiceVariable, NotificationService, NavigationService, PhonegapService are all subclasses of ServiceCall.
* ServiceQueue.js:    Deprecated.  A runtime component for managing an asynchronous queue of actions to be triggered.  
  		      Unfortunately, it wasn't all that easy to use, and didn't provide support for conditional behaviors.
* ServiceVariable.js: Subclass of ServiceCall and wm.Variable: Its a component for accessing a service that provides data.
  		      While almost all ServiceVariables are used to talk to the server, the key definition of
		      "A component for accessing a service that provides data" is why its the parent class for 
		      wm.PhoneGapCall which accesses the PhoneGapService.js, and provides access to any data returned by the call.
* Timer.js: 	      Simple component for sceduling javascript events
* TypeDefinition.js:  Defines a type, allowing wm.Variables to store data using fields other than those specified by the server's types.js file.
* Variable.js:        Basic datastore component, parent class of ServiceVariable.  
* XhrService.js:      Provides a Service for directly calling a webservice without our server having to have generated a bunch
  		      of java files.
* componentList.js:   Contains a mapping indicating which class is in which compressed library file so that at runtime,
  		      we can load the required libraries as widgets are used in the project.

### PageLoaders ###
* PageLoader.js: Loads a WaveMaker Page.  Either loads Page.a.js, or if that does not exist, 
  		 will load Page.js, Page.widgets.js, Page.css and Page.html
* CssLoader.js:  When the PageLoader has loaded the css via Page.a.js, or wants Page.css to be loaded, 
  		 the CssLoader will load it and add it to the dom so that the styles can be applied
* HtmlLoader.js: When the PageLoader has loaded the html via Page.a.js, or wants Page.html to be loaded, 
  		 the HtmlLoader will load it and add it to the dom so that the styles can be applied.  Note
		 that use of the Page.html file is no longer encouraged though not officially deprecated.


Designtime Files for Components Used at Runtime
-----------------------------------------------
* Application_design.js
* ImageList_design.js
* LiveVariable_design.js
* LiveView_Design.js
* LogoutVariable_design.js
* NavigationService_design.js
* Property_design.js
* Security_design.js
* ServiceCall_design.js: For reasons I've not yet resolved, extensions to ServiceCall in this file fail to apply.  Perhaps the sequence is:
  			 ServiceCall loads, ServiceCall_design modifies it, then ServiceCall loads a second time for some reason and clobbers
			 the ServiceCall_design changes.
* ServiceVariable_design.js
* TypeDefinition_design.js
* Variable_design.js

Designtime Files for Setting Up Services at Designtime
------------------------------------------------------
* ServerComponent.js: All Server components are represented at designtime by a ServerComponent subclass
* DataModel.js:       Represents a database service, and allows the user to edit the database schema via the DataObjectEditor Studio Page
* JavaService.js:     Represents a java service,  and allows the user to edit the java via the JavaEditor Studio Page
* Query.js:	      Represents a HQL Query service, and allows the user to edit the query via the QueryEditor Studio Page
* WebService.js	      Represents a web service, and allows the user to edit the WebService via the Services Studio Page

Misc
----
* DualCalendar.js: Created for an arabic project at customer request.  My opinion is that this should have been done as a widget
  		   but only one or two people in the world actually know that this component exists so it doesn't matter.
		   Probably not being used anymore.
* IslamicDateTextbox.js: See DualCalendar description.