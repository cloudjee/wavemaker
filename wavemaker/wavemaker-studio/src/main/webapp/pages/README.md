Studio's webapp/pages folder
=========================

This folder contains all of the pages used by Studio.  No pages here will be available when running a user's application.
The main page here is the Studio page.  All other pages here are used by the Studio page or by various widgets' design-time only code.

Page List
---------
* AdaptorEditor: Experiment. Never polished. There is a need for a way to take data of one type and map it to another type so that it can be shown in a grid, chart, etc...   However, the need wasn't great enough to complete this.
* AddPatch: When the user selects Studio's File menu -> Modify Studio -> Apply Studio Patches, this dialog opens up and allows the user to patch javascript libraries; this affects both how studio runs, and how applications run.
* BindSourceDialog: The bind dialog
* CodeEditorDialog: When the user clicks in the property panel, styles section, classes subsection, and clicks to edit a css class, that class is shown in this popup code editor dialog.
* ConfirmSaveDialog: Asks the user if they want to save and continue, continue, or cancel.
* CreateLiveView: Deprecated.  This was used to create a new LiveView when LiveViews were app-level components.  Now LiveViews are owned by LiveVariables and no longer need to be created.
* DBConnectionSettings: This dialog shows the connection settings for your dialog, and allows you to edit them, save them, export your database design to an actual database, etc...  Openned from the DataObjectEditor page.
* DDLDialog: Used by the DBConnectionSettings dialog to show changes that will be made to your database when you export your database.
* DataObjectsEditor: This page lets the user design new databases/tables, or edit/refine existing database tables.  Also used to tweak the hibernate types and cascade settings.  This page is a candidate for redesign.
* DeploymentDialog: Manages deploying your project to various serveres.  Currently manages deploy to tomcat, deploy to cloudfoundry and generate WAR and EAR files.
* EditVariable: A dialog for editing the JSON of a wm.Variable; replaces the plain text box in the property panel that we used to have with something that offers more assistance in validating the results.
* ExportProjectPage: When the user selects File -> Export from Studio's menu, this asks the user what they want to export.  This dialog is skipped if the user has no custom themes and components that might need to be exported with the project.
* GridDesigner: This dialog is used to configure the columns of a wm.DojoGrid and wm.List
* HandleRequiredJars: This dialog prompts the user to install jar files that are missing.  Certain jar files (ojdbc14.jar, db2jcc.jar, wsdl4j.jar) CloudJee was unable to distribute due to licensing issues.
* I18nDictionaryEditor: This dialog is used to enter localization dictionary terms for use by scripts.  This edits the same file as is used to localize widgets, but this dictionary editor does not edit widget properties, only script dictionary terms.
* ImportCloudFoundryDatabase: This is a version of the ImportDatabase that is used when Studio is running in CloudFoundry instead of on localhost.
* ImportDatabase: Prompts the user to enter information about their database so that Studio can import the data models and save the connection properties.
* ImportFile: Imports projects, custom components, themes and project templates
* ImportPageDialog: Dialog is used to copy pages from one project to another; activated from the Pages menu -> "Copy Page" command.
* ImportThirdPartyAPI: Imports third party services; activated from Studio's File menu -> Modify Studio -> Import Partner Service
* ImportWebService: This page provides access to all of the WebService Importer options.
* JavaEditor: This page allows the user to edit their java services. 
* LiveViewEditor: This dialog lets the user edit their LiveViews; openned from the LiveVariable's property panel.
* LogViewer: This page shows up in both the JavaEditor page, and in Studio's Source tab.  Some of the code/logic here was designed to filter logs to only those relevant to the currently open project; done in order to support a shared Studio running in the cloud (ec2).  Much of that is probably no longer needed.
* Login: When Studio was running in the cloud (ec2) users needed to login.  Not used for cloud deployments such as cloudfoundry where its one user per studio, and authentication is handled elsewhere.
* MenuDesigner: Dialog for editing the menu items of your menus, popupmenus, and popupbuttons.
* NewJavaService: Dialog for entering in the name and package of a new java service. Opened when the user selects Studio's Services menu -> Java Service.
* NewLivePanelDialog: Dialog for configuring a new LivePanel.  Triggered by dragging a database table off the palette.
* NewProjectDialog: Dialog for creating a new project; triggered by selecting the "New Project" operation.
* OpenProjectOptions: Dialog appears if the user is openning a project in a new version of Studio and the project upgrade process needs to be triggered.
* PhoneGapConfig: Dialog appears if the user selects File -> Deploy -> Phonegap Deploy; it allows the user to configure and generate a build file that can be uploaded to build.phonegap.com.
* PopupHelp: When the user clicks the "?" to get help with a property, this dialog pops up.  The property doc information is loaded from the wiki; there is some code here for handling wiki-formatted content; but there is also some in ComponentInspector.js as well.
* PreferencesPane: Studio settings dialog.  Right now, this is primarily used for setting the home folder for studio.  In the past, its also been used for other settings, which are no longer needed.
* PropertyPublisher: This dialog lets users publish properties for use in Composites and PageContainers.
* QueryEditor: This page is used to create/edit HQL Queries
* QueueDialog: Deprecated; this dialog lets the user configure a sequence of asynchronous actions.  Unfortunately, it wasn't all that clear how to use this, and there was no concept of an exit condition or conditional logic.  Only one user complained when it was deprecated.
* RegistrationDialog: As with the Login page, this was used when running Studio in an EC2 instance, and users needed to register and login to edit their projects.
* ResourceEditor: The ResourceManager page lets the user select a file to edit; the ResourceEditor is loaded to actually handle the editing of that file.
* ResourceManager: Allows the user to manage the project file system.  Needed especially when running studio in the cloud.  But kind of nice to have even on localhost.  Has some knowledge, like if you edit the current page's widgets.js file, then reload that widget file into the canvas.
* RestServiceBuilder: Used by the ImportWebService to display the "Build-a-rest" options.
* RestUrlDialog:  Used by the ImportWebService to display the "Build-a-rest" options.
* Security: This dialog is used to setup and edit security settings
* Services: This page shows the currently selected web service. It allows a few simple customizations of that service.  See ImportWebService for setting up a complete web service.
* Start: Studio's welcome page, shows the welcome dialog and the project list.
* Studio: The main page of StudioApplication
* ThemeDesigner: The ThemeDesigner added for WM 6.2, allowed user to specify general styles, and the designer applied those styles to a broad range of widgets
* TypeDefinitionGeneratorDialog: A dialog for pasting in json data from which a client-side only type can be generated.  These types can then be used by wm.Variables to store data with those fields.  
* UserSettings: As with the Login page, this was used when running Studio in an EC2 instance, and users needed to edit their password or other account information.
* WidgetThemerPage: The ThemeDesigner added for WM 6.6, allows users to edit each individual widget and how it will appear, and to directly access all css for the theme. It also allows creation of versions of the widgets that can be added to the palette with customizations.  For example, a SubmitButton which is a button with "SubmitButton" class added to it for styling.
* XHRServiceEditor: Used by the ImportWebService page, this allows users to setup and edit an xhr service that can use the WaveMaker server as a proxy or that can directly access the remote server if that server allows cross domain requests.