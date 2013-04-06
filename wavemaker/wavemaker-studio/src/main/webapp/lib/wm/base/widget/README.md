Studio's webapp/lib/wm/base/widget folder
=========================

This is where all subclasses of wm.Control (Control.js) go.  There are two types of files, 
widget files and design-time only files.  There are also some folders containing key widgets or logic:

Folders That Don't Contain Widgets
-----------------------------------
1. layout: By far the most important folder here is the layout folder which contains the rendering engine.
This code understands how to layout a left-to-right panel and a top-to-bottom panel,
 and manages the absolute position of every single widget in an application.
2. themes: Contains theme folders with css, graphics, and javascript prototype changes
3. Layers: 
4. Table: Rendering engine for VirtualList.js/List.js/wm.List.
5. List: Not been used in at least four years.

Folders That Contain Widgets
-----------------------------------
1. dijit: Contains the Dijit wrapper class that helps easily wrap a dojo dijit in a wm.Control; contains
various examples, most notably the Calendar class.
2. gadget: Assorted widgets based on third party libraries (google maps, facebook like button, youtube, etc.)
3. Buttons: Contains all button widgets
4. Dialogs: Contains all Dialog widgets
5. Editors: Contains all Editor widgets
6. Trees: Contains all Tree widgets

Formatting Widgets
------------------
These are the simplest widgets, used primarily to provide basic formatting and basic functionality.
* Bevel.js: A border widget.  Most users should probably just use the Border property on an existing widget.
* Button.js: It used to be that all of our Buttons were in one file.  We refactored that into a Buttons folder with many class files.  
For purposes of backwards compatability, we kept the Button.js file which now simplly loads the Button classes from their new location.
* Content.js: This almost-deprecated widget shows html taken from the Source tab -> Markup subtab.  While there are performance
advantages of using html from the markup tab, maintaining the code in the markup tab is simply too unweildy.  We added the ability
to load  html from the resources folder, but this mirrored functionality in wm.Html which has been better maintained.
* Html.js: Displays html from an HTML property, or loaded from the project's resources folder.
* IFrame.js: Displays content from an arbitrary URL.
* Label.js: Provides a basic html label, standard class for a single line of text.  Can support multiple lines
though Html.js is a widget to consider for large blocks of text.
* PageContainer.js: Places a subpage into your page.  Even the application's main page is placed within a PageContainer managed
by wm.Application.
* Picture.js: Provides a basic widget for displaying a single graphic.  Sometimes used as a button because of its onclick event.
* Scrim.js: Not availble to users via the Palette, this widget is used by Dialogs and at design time to gray out the background of a page.
* Spacer.js: While margin and padding properties can be used to create spacing, the Spacer widget is the only way to create
flexable spacing.  To fill all available space between two widgets, you can put a Spacer between them and set its width or
height to 100%.
* Splitter.js: Subclass of Bevel that provides a draggable border for resizing panels of the application.



Editors
-------
Most editors are built on top of dojo's dijits.  There are two types of editors to mention at this level of the folder heirarchy.
* Deprecated editors from WaveMaker 5.x (maybe 4.x as well)
* Current editors.

Here are the files/folders to know about for editors:
* AceEditor.js: This is not properly an editor widget, this is a design-time only widget for editing js, css, html, json, xml, etc...
* Editor.js: Deprecated; parent class of most of the deprecated editors.
Actually, deprecated is an understatement, while this class should still work, we strongly discourage its use.
* Editors Folder: Contains all of the form-based editor classes (also contains many  deprecated editors)
* Input.js: This was deprecated way back when Editor.js was standard.  It hasn't been removed yet because there are still
a few Studio pages that use it and that would need to be updated to NOT use it.  No users use this widget.
* Select.js: Deprecated; Subclass of Editor.js. This may still be in use in a few very old projects,
but removing it is perfectly acceptable... after removing its use from all Studio pages first.
* TextArea.js: As with Input.js, this was deprecated back when Editor.js was standard.  I see noplace where this is used in Studio.
Removal of this should be safe.

Containers
----------
* AppRoot.js: Every wm.Application widget owns an AppRoot widget which is the wm.Container subclass that knows the browser size,
contains the main page, and also contains any docked dialogs.  Its main difference from a wm.Container is 
that a wm.Container is sized by its parent, an AppRoot sizes itself based on the size of the browser.
* Composite.js: This Container subclass is used at design time to create a widget consisting of a collection of widgets, as well
as nonvisual widgets, code, css and services.  In WavMaker 6.5, a Composite was always only a Container.  In WM 6.6, the CompositeMixin
is also used to create composites that are NOT containers (single widgets, nonvisual components, etc.).
* Container.js: This wm.Control subclass is the parent class of all Containers/panels.
* Dialog.js: It used to be that all of our Dialogs were in one file.  We refactored that into a Dialogs folder with many class files.  
For purposes of backwards compatability, we kept the Dialog.js file which now simplly loads the Dialog classes from their new location.
* Layout.js: In WaveMaker 6.4, this widget did what AppRoot does now.  Every page has a root widget that is a wm.Layout and which 
contains all of the page's inline widgets (non-inlined widgets are dialogs that are not part of the flow of the page's widgets).  
It was replaced with AppRoot in part because there was little to differentiate between a wm.Layout that is sized by a PageContainer 
and one that is sized by the browser.  The root of the document needed a separate set of CSS classes and javascript functionality.
* Panel.js: A subclass of wm.Container that adds almost no new functionality.  Users drag a wm.Panel onto their page, while widgets
that extent Container functionality would extend wm.Container rather than Panel which is there for the user to interact with.  This
file also contains wm.FancyPanel (Titled Panel).
* Template.js: A subclass of wm.Container that the user can drag off the palette and generates a pre-designed configuration of widgets (sometimes non-visual components as well).

###Layer Widgets###

A wm.Layers widget is a widget that manages a set of wm.Layer containers and determines which one(s)
to show at any given time, and what if any controls should manage the transition from one Layer to another.

* Layers.js: Base class for wm.Layers, wm.TabLayers, and the wm.Layer container that is managed by the wm.Layers widgets.
* Layers Folder: Contains the Decorator classes for all Layer classes.  Decorators manage the tabs, accordion headers and other 
"decorations" added to the Layers to help visualize and navigate the layers.
* Layers_design.js: Design time code for managing any of the wm.Layers classes
* AccordionLayers.js: Depends on Layers/AccordionDecorator.js; provides an accordion widget
* BreadcrumbLayers.js: Depends on Layers/BreadcrumbDecorator.js; provides a Tab-like container
that manages which tabs are showing based on the sequence of Layers the user has traversed.
* WizardLayers.js: Depends on Layers/WizardDecorator.js; provides a Tab-like container
that only lets users procede to the next tab when the current tab has been validated.  
Provides "Next" and "Back" buttons as the main navigation with the tabs showing the planned steps.


DataSet Widgets
---------------
* DataGrid.js: This is a deprecated grid, though we do still see the occasional post on the forum from someone still trying to use it.
* DojoChart.js: The basic charting widget; has a dataSet property for getting the data it charts, and a bunch of config properties to
specify the chart type, axis names, etc...
* DojoFisheye.js: Takes a dataSet of images to display, and generates a fisheye widget.  Meant to be a bit like the OSX Dock.
* DojoGauge.js: Takes one or more values and displays them.  This widget does not have a dataSet property so is not truly a DataSet widget.
* DojoGrid.js: A wrapper around dojo's DataGrid widget.  This is our main grid widget.  However, it does not work on touch screens/mobile devices, 
so List.js/wm.List has become the slightly less functional equivalent that users with mobile needs should use.  At runtime, if the framework determines its running on a mobile device, all wm.DojoGrid widgets are automatically replaced with wm.List widgets.
* DojoListbox.js: Takes a dataSet of an array of images, and shows the images one at a time in a popup box.  This is a basic wrapper around 
dojo's dojox.image.Lightbox dijit.
* DojoTreeGrid.js: Unfinished/Unused: Experimental file for supporting dojo's tree grid.  Was never completed, the initial pass at this had
a single DojoGrid.js file that did both Grid and TreeGrid and it got a bit too messy so was refactored, and then set aside.  This file currently
does both TreeGrid and Grid, and should be simplified if anyone wants to use it.
* FeedList.js: Subclass of wm.List for showing RSS Feeds.
* List.js: This widget is almost an exact copy of DojoGrid.js in terms of properties, apis and look-and-feel.  Unlike DojoGrid, this is NOT a
wrapper around a dojo dijit, its our own list implementation, AND this works on mobile devices.
It adds a few extra behaviors that are specific to mobile styling of lists.
* ListViewer.js: A frequent user request is the ability to have a panel of widgets that repeats once per item in a dataSet.  ListViewer does this
by having a Page represent the widgets and code that get loaded into each row.  In order to make this perform better,
this widget renders new rows (i.e. panels) as the user scrolls.  This code worked adequately for desktop browsers but did not work well for
mobile browsers.  As such, its use has NOT been pushed.  A property was recently added to make it render all
rows so that scrolling would work smoothly on mobile browsers.  As a result, this widget can be used on mobile browsers as long as the dataSet
size is small.
* Tree.js: It used to be that all of our Trees were in one file.  We refactored that into a Trees folder with many class files.  
For purposes of backwards compatability, we kept the Tree.js file which now simplly loads the Tree classes from their new location.
* TwitterFeed.js: Subclass of FeedList.js and List.js; this class has been deprecated by changes/restrictions to Twitter's APIs.
* VirtualList.js: Parent class of List.js

Database Widgets
------------
LivePanel.js: This widget represents a database object dragged off the palette, and generates any of a number of UIs for viewing
and editing database data.  A LivePanel usually consists of the following types of widgets.

* DataForm.js: This beta replacement for LiveForm was an attempt to address some of LiveForm's shortcomings, which were primarily around its black-box implementation.  Due to performance issues, we were forced to continue many of the black-box choices, but also implemented a class hierarhcy that let the user choose a form widget that gave them the kind of control they needed.  Also cleaned up issues around the confusing defaultInsert and binding of dataValue fields in editors.
* DataNavigator.js: This panel provides controls for paging through a LiveVariable's dataSet, loading maxResults entries at a time from the server.
* EditPanel.js: Used by wm.LiveForm, provides and manages visibility of the New, Delete, Edit, Cancel and Save buttons.
* LiveForm.js: The standard form widget for generating a set of editors, and managing its own LiveVariable for saving/updating/deleting its entry.
* RelatedEditor.js: A Subform widget used by wm.LiveForm; can be used to show a subform for displaying (or with some work, editing) a
related object.  Can also display a grid of one-to-many related items.  Used to support a wm.Lookup for picking a related object, but 
wm.Lookup should now be used as a standalone widget outside of a RelatedEditor.


MISC Widgets
------------
* ContextMenuDialog.js: Design-time only dialog used currently for configuring Dashboard.  I strongly object to this implementation which I 
did not participate in; this was built using raw dojo dijits and as such can not be managed using wavemaker framework.  This used to support
DojoGrid configuration but I replaced this with the GridDesigner studio page.
* Dashboard.js: Provides a set of Portlets that the user can arrange to their liking for viewing multiple pages and picking which pages they want to see.
* DojoFileUpload.js  Wrapper around dojo's file upload dijit.  Note that the dojo widget is deprecated; this widget must be updated before going to dojo 2.0.
* DojoFlashFileUpload.js: Subclass of DojoFileUplaod that supports a flash version of the dojo file upload dijit.  Put in a separate file/class because this used to be an enterprise-only widget.
* DojoMenu.js: Provides a menu bar as well as context-menu/popup-menu support.
* FileUpload.js: Deprecated file upload widget.  Still used in a couple of Studio pages.
* Formatters.js: Used by wm.Label and readonly editors for formatting their values.
* FormattersMisc.js: Infrequently used Formatter classes that are not loaded as part of the main build layer.
* JsonStatus.js: Widget that shows activity indicator; it spins any time an XHR request is in progress.  Increased width will cause it to display what that request is.
* Ticker.js: Scrolling panel
