Studio's webapp/lib/wm/base folder
=========================

This is where the WaveMaker objects start getting defined.

The key objects 
---------------
* Object.js: The base Object class that everything inherits from.  Comes with getters, setters, schema manipulation (lets us know details about each field type, including how best to edit each field of the object), 
* Component.js: Anything that appears in a Page.widgets.js file must be a Component or subclass of wm.Component.  This is the basic building block of applications.  wm.Page and wm.Application are both Components.
* Component_design.js: Contains design time code for manipulating Components of a page that is being designed
* Control.js: Anything that appears in a Page.widgets.js file that manipulates a dom node must be a subclass of wm.Control.  This is the basic widget that is able to render itself.
* Control_design.js:  Contains design time code for manipulating Control of a page that is being designed

Back in the day when we had a community/free edition and an enterprise edition, enterprise level features were added to the wm.Component/wm.Control
classes using the Plugin system which modifies methods of the component.

Plugins
-------
* Plugin.js: The basic plugin class that other plugins inherit from.
* RbacPlugin.js: Originally, this class added support for a roles property, and if there are a list of roles for this property and the user doesn't have any of those roles, all attempts to call setShowing(true) turn into setShowing(false).  In WM 6.5, a mobile plugin was added to this file for determining if a widget should be shown based on the size of the device/browser.
* RbacPlugin_design.js: This file contains design-time code for RbacPlugin; specifically, the ability to show/hide widgets as Studio's deviceSize control is changed.
* I18nPlugin.js: This plugin replaces the default properties of a widget with the properties stored in a dictionary for the current language.

Folders
-------
* components: Contains non-visual components
* data: contains libraries for working with data
* debug: Contains the WaveMaker debugger; a beta-quality debugging tool that helps users to look at their Components, and look at an asynchronous stack trace.  Only shows up when running a project with "?debug" in the url.
* design: Contains design-time only components.  Could move this to webapp/app.
* drag: Contains a library for doing drag and drop.  Used by Studio at design time. Also used for a very small number of drag and drop operations supported for applications (dragging dialogs, tabs and splitters I think are done through this library).
* lib: A dump folder of assorted libraries.
* styles: Deprecated; used to drive WaveMaker 5.0-6.4 styling.  Kept for backwards compatability.  But users no longer use these css classes and stylesheets on new projects.
* templates: A paying customer requested these a long time back; I've never ever looked at them.
* widget: Contains all widget class files


Misc
----
* CFInstall.js: ChromeFrame Install library.  Users running in IE 6 for example should be sent to the chromeframe install page; this library helps detect if that is needed.
