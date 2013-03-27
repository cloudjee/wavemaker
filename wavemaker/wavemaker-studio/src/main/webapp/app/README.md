Studio's webapp/app folder
=========================

The app folder contains a variety of utility libraries, widgets and extensions to the Studio class for driving studio. 

Folders
------
* buildUtils: Contains the dojo build config files
* inspector: Contains the ComponentInspector that renders the Property Panel and manages the editing of properties.
* lib: Contains third party library files/folders.  Currently only contains the Ace Library which is the javascript/java/css code editor.
* templates: Contains templates for projects, security, themes, etc...

Extensions to the Studio Page Object
------------------------------------
* deploy.js: Opens the DeploymentDialog, manages project export, project import, composite export, composite import, and enabling Live Layout data.
* editcommands.js: Handles most callbacks from the various code editors under the Source tab.  In particular, those triggered by using the toolbuttons over the source editor.  Also handles the autocompletion service and UI.
* mainNavigation.js: Libraries for navigating around studio, especially between canvas and source tabs.  Also for managing/generating subtabs of the source tabs. 
* manifest.js: When running studio with ?debug, the manifest indicates what libraries to preload at launch time. This file may be loaded at runtime as well, but the buildUtils configuration determines what libraries are precompiled to be loaded at launch time.
* menus.js: Code for managing studio's menu bar.  1. manages enabling/disabling of menu items; 2. manages adding items to the Services and Insert menus.
* project.js: Manages opening, saving, deleting, copying and determing if isDirty for a project and a page of a project.
* trees.js: Manages the model tree, services tree and components tree.

Class Files
-----------
* Palette.js: This contains the widget for Studio's Palette with support for dragging items from the palette onto the canvas
* StudioApplication.js: This subclass of wm.Application doesn't provide much; most of the logic for Studio is actually in the Studio "Page".
* binding.js: Contains the main components used for the Bind dialog (loaded by pages/BindSourceDialog)
* propertyEdit.js: Contains classes for editors used mostly by the property panel, but occasionally may get used elsewhere in addition to the property panel.
* servicesTree.js:  This hasn't been touched in 4 years.  This tree widget is used in a few places, but over 4 years ago, that widget was marked as hidden and no longer part of the UI design.  Unfortuantely, there are events triggered off that tree that still drive some of the UIs.

User Interaction Utilities
--------------------------
* actions.js: Contains the concept of an "action", and the means to undo those actions.  More actions can be found in propertyEdit.js
* clipboard.js: Manages the copy/paste buffer and logic for applying a paste operation.
* events.js: Manages adding, editing and selecting event handlers in the user's page code
* file.js: Some file management functions; some functions for generating files from templates.
* keyconfig.js: Lists all keyboard shortcuts and the method to call when the shortcut is invoked
* packageLoader.js: Loads the contents of packages.js; also loads the packages.js from Documents/WaveMaker/common/packages/packages.js
* packages.js: Contains the list of components/widgets to show in the Palette and in the Insert menu
* packages.noncloud.js: Deprecated. This was used when running a single Studio in an Amazon cloud and we did not want users able to modify studio for all users so this file was only used by localhost deployments of studio.
* 

Misc Utilities
--------------
* componentList.js: This file is used to determine which build files studio should load javascript libraries from at runtime.
* config.js: Standard config.js file that goes with every application.  Contains a few studio modifications.
* css.js: Libraries for managing stylesheets; especially for when the user edits css and we need to reapply it, or when a new page is loaded and its css file needs to be applied.
* data.js: Unknown; hasn't been touched in 4 years.
* dataconstants.js: Contains some constants for the DataObjectEditor, QueryEditor, ImportDatabase and DBConnection pages
* datautils.js: Contains some utilities for the ImportDatabase and DBConnection pages
* dom.js: This hasn't been touched in 4 years. 
* markup.js: This hasn't been touched in 4 years. 
* services.js: This hasn't been touched in 4 years.
* sourcer.js: Some utilities for writing widgets to file.
* studioLoader.js: Studio's version of lib/runtimeLoader.js.  This loads the dojo framework, and then starts the loading of the WaveMaker core libraries.
* util.js: Assorted utility methods