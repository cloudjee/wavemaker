/*
 * Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
/* COMPLETE CLASS LIST/LIBRARY LIST:
BASE:
* Object.js
* Component.js
* Control.js
* Plugin.js
* I18nPlugin.js
* RbacPlugin.js

Everything in base is required for any application to run (the plugins could be removed, 
but at this time we will assume that the functionality represented by them is required.

DRAG:
* drag.js: Required by Splitter, Dialog, and DraggableTree
* capture.js: Required by drag.js
* layout.js: Design only

LIB:
* Silverlight.js: Not sure what this is for, but doesn't seem to get loaded by any code I can find; presumed deprecated
* date.js: among other things, manages wm.timezoneOffset which means this should always be loaded
* types.js: Defines the type manager; always needed
* data.js: Defines some misc functions; assume its always needed until we can restructure things
* util.js: Lots of utilities; always needed

DATA:
* SimpleStore: Used by SelectMenu only; we should deprecate this and use the same dojo store as Grid
* expression.js: Used by binding and display expressions; always needed

COMPONENTS:
* AdaptorVariable.js: Experiment, may polish up and include if there is a demand for it; used to convert one set of fields to a second set of fields
* Application.js: Required
* Application_design.js: Design-time only
* Binding.js: Required
* PageLoader + CssLoader + HtmlLoader: Required
* DataModel: Design-time only
* DualCalendar + IslamicDateTextbox: Custom component created for singleton client; anyone who wants it needs to load it without any build layers
* FunctionService: Needed by any user who uses a ServiceVariable whose service is set to functionService.  As there is no
*               component loader for services, this is required until we stop supporting FunctionServices. (NOTE: REVIEW NEEDED)  (Ed and Michael have Axed it)
* ImageList: Silk icon list is part of our template for creating new projects; Required.
* ImageList_design: Design-time only
* JavaService + WebService: Design-time only
* JsonRpcService: Required for any kind of client-server communication
* LiveVariable: Required for most database apps. Assume every app needs it.
* LiveVariable_design: Design-time only
* LiveView: Required by Every LiveVariable 
* LiveView_design: Design-time only
* LogoutVariable: This 50 line file is small and simple; Recommended for main build layer because many projects should use it and its a low cost. (NOTE: REVIEW NEEDED)
* NavigationService: Define Navigation Services and a Navigation variable for using the service. Required.
* Page: Required
* Property: Defines a property exposed by composites and page containers. Class is 27 lines. Hopefully this will become an important feature; Required (NOTE: REVIEW NEEDED)
* PhoneGapService: Defines a PhoneGap service. Required for mobile apps, not required for desktop apps
* Publisher: Design-time only
* Query: Design-time only
* SalesForceMonitorVariable.js: Not supported
* Security: Provides utilty methods needed for login/logout.  Required unless no security needed.
* Security_design: Design-time only
* ServerComponent: Design-time only
* Service: Parent class of all services; Required
* ServiceCall: Variable for calling a service; Required
* ServiceCall_design: Design-time only
* ServiceQueue: Built into every ServiceCall; required because ServiceCall is required.  Hopefully deprecated soon.  Ed and I have Axed this; 
* ServiceVariable: ServiceVariable for calling server services. Required
* Timer: Used in small % of projects; removed from main build layer; not part of any layers
* TypeDefinition: Relatively few projects use this, but I am using it any time custom types are needed by studio and by components.
*        Currently only used by the debugger and studio pages.  Putting in main build layer on the assumption that this will evolve. (NOTE: REVIEW NEEDED)
*        46 lines
* TypeDefinition_design: Design-time only
* Variable: Required
* Variable_design: Design-time only
* componentList: Required for loading of build layers

WIDGETS:
* AccordionLayers: Part of the wm_accordionlayer layer
* AceEditor: Design time only, projects that need it will have to do their own dojo.require; not even in componentList.js
* AppRoot: Widget contains entire application; required
* Bevel: Used in small % of projects; 42 lines; included in main lib but not required (NOTE: REVIEW NEEDED); NOT in mobile build; (SPlitter is part of Application)
* Splitter: Now built into Application and its docking code; main build layer
* Button.js: Only here for older projects that have an outdated dojo.require; used Buttons/Button.js instead. Not in build.
* BreadcrumbLayers: Part of the wm_breadcrumblayerx layer
* Composite.js: Composites are infrequently used; 262 lines; Not in build
* Container: Required
* Content: Infrequently used; I personally prefer wm.Html; Not in build (removed) (NOTE: REVIEW NEEDED)
* ContextMenuDialog: Design-time only for Dashboard
* Dashboard: Infrequently used; Added new dashboard layer to get it and related dojo libs
* DataForm: New form widget (beta); added custom layer for it
* DataGrid: Deprecated; has own build layer
* DataNavigator: Used for paging through grids or form entries.  Infrequent use; part of the live panel layer (NOTE: REVIEW NEEDED)
* Dialog.js:  Only here for older projects that have an outdated dojo.require; used Dialog/Dialog.js instead. Not in build.
* DojoChart: Used in small % of projects; has its own build layer
* DojoFileUpload + DojoFlashFileUpload: Infrequently used; now has custom build layer
* DojoFisheye: Infrequently used; no build layer
* DojoGauge: Infrequently used; built into charts layer
* DojoGrid: Frequently used; part of wm_grid layer; only reason its not part of main layer is that it requires a lot of dojo libraries we'd like to NOT grab when loading a login or other simple page.  How should this philosophy affect other decisions made for other widgets? (NOTE: REVIEW NEEDED)
* DojoLightBox: Infrequently used; no build layer
* DojoMenu: Frequently used; part of wm_menu layer; only reason its not part of main layer is that it requires a lot of dojo libraries we'd like to NOT grab when loading a login or other simple page.  How should this philosophy affect other decisions made for other widgets? (NOTE: REVIEW NEEDED)
* DojoTreeGrid: Experimental; not ready for use
* EditPanel: Part of the livepanel build layer; frequently used but rarly used deliberately
* Editor.js: Part of the old editors build
* FeedList: Infrequent use; no build layer
* FileUpload: Deprecated; no build layer
* Formatters: used by some labels; not required by labels. Used in small % of new projects; Used in all old projects so required. (NOTE: REVIEW NEEDED)
* Html: Guessing its used in 30% of projects; 164 lines; No build layer (NOTE: REVIEW NEEDED) (Ed and Michael vote for having it in main layer)
* IFrame: Used in small number of projects; no build layer; 53 lines (NOTE: REVIEW NEEDED)
* Input: Deprecated; only used by old studio pages
* JsonStatus: Mostly used for debugging; LoadingDialog likely to replace the need for this in running projects.  No build layer (NOTE: REVIEW NEEDED)
* Label: Required
* Layers: Need to refactor this and Decorators; wm.Layer + wm.Layers + wm.Decorator; wm.TabLayer + wm.TabControl + wm.TabDecorator; wm.WizardLayer + wm.WizardDecorator; may wait for WaveMaker 7; For now this + decorators are required, Accordions, Wizards, BreadcrumbLayers aren't used all that frequently. Mobile in particular needs to pick and choose its layers.
* Layout; Part of every page; required
* LayoutBox: Deprecated; place holder for old projects to point them to Layout.js
* List: Part of the wm_list build layer; may build it into mobile build layer
* ListViewer: beta widget; not much used, not sufficiently polished; no build layer
* LiveForm + LivePanel + RelatedEditor: part of the livepanel build layer
* PageContainer: Required; part of every Application component.
* Panel: Required
* Picture: Required (Guessing 80% of projects use this, any login page that gets polished is likely to see one of these)
* Scrim: used by Dialogs; required because dialogs are part of the Application component
* Select:  Deprecated; only used by old studio pages
* Spacer: Don't know how often this is used; 21 lines (7 lines after removing comments); including because small and good chance a polished login page would need this
* Template: I've added code so that when a template is dragged onto a project, its converted to a wm.Panel.  Projects created with a template selected from the new project dialog don't have a wm.Template widget.  Upgraded projects where templates are added from palette will have a wm.Template.  In hopes that there are few projects needing it, this widget has no build layer
* TextArea:  Deprecated; only used by old studio pages
* Ticker: Rarely used; not part of any build layer
* Tree.js:  Only here for older projects that have an outdated dojo.require; used Tree/Tree.js instead. Not in build.
* TwitterFeed: Rarely used, not part of any build layer
* VirtualList: Part of wm_list build layer
* WizardLayers: Part of the wm_wizardlayer layer

WIDGET/LAYOUT:
* Abs.js: Experimental absolute layoutKind renderer; not used
* Box.js: left-to-right and top-to-bottom layoutKind renderer; required 
* Layout.js: Parent class of all layout classes; required


WIDGET/GADGET: (NOTE: REVIEW NEEDED: Every one of these maybe should be in a standalone layer?) (Ed and MIchael have axed this layer)
* Facebook: Gadgets build 
* GoogleMap: Gadgets build
* TwitterGadgets: Gadgets build
* Weather: Gadgets build
* Stocks: Gadget build
* YouTube: Gadgets build

WIDGET/DIJIT FOLDER: (NOTE: NEEDS REVIEW; Have not done anything with any of these)
* Dijit: Parent class for most or all of this folder; primarily used for calendar and progressbar. No build layer
* Calendar: Required by DateTime editor; so needs to be in editor build layer
* ProgressBar: Custom progressbar layer
* ColorPalette: Demonstration widget; no build layer
* Checkbox: Demonstration widget; no build layer
* Grid: Demonstration widget and option for using a grid without any wrapping code beyond a wm.Control.

WIDGET/TREES: Added new tree layer for all of these
* Tree: Parent class of all trees;
* ObjectTree: Renders a javascript hash as a tree
* PropertyTree: LiveView style tree
* DraggableTree: For the rare user needing drag and drop trees
* JSObjTreeNode: Used by the old DebugTree; keeping it around but not currently used; not in a build layer

WIDGET/DIALOGS: 
* ColorPickerDialog: Used by ColorPicker editor; put in colorpicker layer
* DesignableDialog: While I expect most projects to have one or two of these, probably most login pages won't have these.  Currently part of the main build layer (TODO: REVIEW THIS)
* Dialog: Required; part of every Application component
* GenericDialog: Used for app.alert/app.confirm/app.prompt. Required unless we load it when developer calls app.alert.
* LoadingDialog: Currently part of main build layer.  Expected to see this in most projects, possibly even in login pages (TODO: REVIEW THIS) (Ed and Michael were exceptionally indecisive)
* PageDialog: Currently part of Application component; if we remove app.pageDialog, we may move this out of main build layer; but still fairly common use.  Probably uncommon use for mobile design.
* PopoutDialog: Obsolete
* RichTextDialog: No build layer; rare use. 
* Toast: Required; part of Application component. User may not use it... many users may not use it.  But don't want to load it when user calls app.toast. (TODO: REVIEW THIS) (Ed and Michael say "preload it")
* WidgetsJsDialog: Parent class of Toast and GenericDialog; required.

WIDGET/LAYERS: (TODO: REVIEW THIS)
* AccodionDecorator: Part of the wm_accordion layer
* Decorator: Required
* TabsDecorator: Required; includes TabsControl, TabDecorator and BreadcrumbDecorator; RoundedTabDecorator commented out (TODO: REVIEW THIS)
* WizardDecorator: Part of the wm_wizardlayer layer

WIDGET/TABLE
* builder: Part of the wm_list layer

WIDGET/EDITORS
* AbstractEditor: Parent class of all modern editors; required
* Text: Required

* DataSetEditor: not required; wm_editors layer
* Select: Very common; not required (TODO: REVIEW THIS)
* Number: Very common but not required; Consider this for mobile build
* Date: Very common but not required; wm_editors layer (TODO: REVIEW THIS)
* Checkbox: not required; wm_editors layer

* Radiobutton: not required; wm_editors layer; 

* Base: Parent class of all deprecated editors; wm_editors_old

* ColorPicker: not required: wm_editors layer (TODO: REVIEW THIS; Adds a lot a number of files to editor build layer); Remove from mobile build

* OneToMany: Part of the new form layer



* _*: Old editors
* dijit: Modifications to ValidationTextBox; since Text is required, this is required

WIDGET/BUTTONS:
* BusyButton: Rarely used; not very polished; no build layer
* Button: Required; buttons are too common
* PopupMenuButton: Uncommon widget; part of the wm_menus layer
* ToggleButton: Containers ToggleButton and ToggleButtonPanel; No layer
* ToolButton: Required; parent class of all buttons
*/

/* WHEN DONE RECATEGORIZING THESE, WRITEUP A SECTION ON THE PERFORMANCE PAGE DESCRIBING
 * 0. Add them to build-js.xml
 * 1. What widgets aren't part of a build layer
 * 2. How to create a single library file with all the components you use in your project that aren't part of a build layer
 * 3. How to use google closure to compile that library
 * 4. How to dojo.require that library
 * 5. How to grab one or two editors such that we don't need to grab the entire editors layer
 * When done working on the wiki page, write a blog post...
 */

dependencies = {
	layers: [
		{
			name: "dojo.js",
			dependencies: [
			    "dojo._base.declare",
			    "dojo._base.lang",
				"dojo._base.array",
				"dojo._base.event",
				"dojo._base.connect",
				"dojo._base.html",
				"dijit._WidgetBase",
			    "dojo.i18n",
			    "dojo.rpc.JsonService",
			    "dojo.rpc.RpcService",
			    "dojo.cookie"
			]
		},
		// runtime (desktop)
		{
			name: "lib_build.js",
			resourceName: "wm",
			layerDependencies: [
			],
			dependencies: [
                            "wm.base.components.componentList",

			    // wm utility libs
			    "wm.base.lib.util",
			    "wm.base.lib.date",
			    "wm.base.lib.types",
			    "wm.base.lib.data",
			    "wm.base.data.expression",

			    // base classes
			    "wm.base.Object",
			    "wm.base.Component",
			    "wm.base.Control",
			    "wm.base.Plugin",
			    "wm.base.RbacPlugin",
			    "wm.base.I18nPlugin",

			    /* Services */
			    "wm.base.components.Service",
			    "wm.base.components.ServiceCall",
			    "wm.base.components.NavigationService",
			    "wm.base.components.NotificationService",
			    //"wm.base.components.FunctionService",
			    "wm.base.components.PhoneGapService",
			    "wm.base.components.JsonRpcService",

			    /* Variables/ServiceVariables */
			    "wm.base.components.Variable",
			    "wm.base.components.ServiceVariable",
			    "wm.base.components.LiveView",
			    "wm.base.components.LiveVariable",
			    "wm.base.components.LogoutVariable",

			    // components
			    "wm.base.components.Page",
			    "wm.base.components.HtmlLoader",
			    "wm.base.components.CssLoader",
			    "wm.base.components.PageLoader",
			    "wm.base.components.Application",
			    "wm.base.components.Property",
			    "wm.base.components.ImageList",
			    "wm.base.components.Binding",
			    "wm.base.components.TypeDefinition",



			    // component Utilities
			    "wm.base.components.Security",
			    //"wm.base.components.ServiceQueue",

			    // Layout rendering classes
			    "wm.base.widget.layout.Layout",
			    "wm.base.widget.layout.Box",

			    // widgets
			    "wm.base.widget.AppRoot",
			    "wm.base.widget.Formatters",
			    "wm.base.widget.Editors.AbstractEditor",
        		    "wm.base.widget.Editors.dijit",
			    "wm.base.widget.Editors.Text",
			    "wm.base.widget.Spacer",
			    "wm.base.widget.Container",
			    "wm.base.widget.Panel",
			    //"wm.base.widget.Template",
			    "wm.base.widget.Layout",
			    "wm.base.widget.Bevel",
			    "wm.base.widget.Splitter",
			    "wm.base.widget.Buttons.Button",
			    "wm.base.widget.Buttons.ToggleButton",
			    "wm.base.widget.Picture",
			    "wm.base.widget.Label",
			    "wm.base.widget.Html",

			    "wm.base.widget.Layers.Decorator",
			    "wm.base.widget.Layers.TabsDecorator",
			    "wm.base.widget.Layers",
				
			    "wm.base.widget.PageContainer",
			    "wm.base.widget.Scrim",
			    "wm.base.widget.Dialogs.Dialog",
			    "wm.base.widget.Dialogs.Toast",
			    "wm.base.widget.Dialogs.WidgetsJsDialog",
			    "wm.base.widget.Dialogs.GenericDialog",
			    "wm.base.widget.Dialogs.PageDialog",
			    "wm.base.widget.Dialogs.DesignableDialog",
			    "wm.base.widget.Dialogs.LoadingDialog",

			]
		},
		{
			name: "lib_build_mobile.js",
			resourceName: "wm",
			layerDependencies: [
			],
			dependencies: [
                            "wm.base.components.componentList",

			    // wm utility libs
			    "wm.base.lib.util",
			    "wm.base.lib.date",
			    "wm.base.lib.types",
			    "wm.base.lib.data",
			    "wm.base.data.expression",

			    // base classes
			    "wm.base.Object",
			    "wm.base.Component",
			    "wm.base.Control",
			    "wm.base.Plugin",
			    "wm.base.RbacPlugin",
			    "wm.base.I18nPlugin",

			    /* Services */
			    "wm.base.components.Service",
			    "wm.base.components.NavigationService",
			    "wm.base.components.NotificationService",
			    "wm.base.components.ServiceCall",
			    //"wm.base.components.FunctionService",
			    "wm.base.components.PhoneGapService",
			    "wm.base.components.JsonRpcService",
			    "wm.base.components.PhoneGapService",

			    /* Variables/ServiceVariables */
			    "wm.base.components.Variable",
			    "wm.base.components.ServiceVariable",
			    "wm.base.components.LiveView",
			    "wm.base.components.LiveVariable",
			    "wm.base.components.LogoutVariable",


			    // components
			    "wm.base.components.Page",
			    "wm.base.components.HtmlLoader",
			    "wm.base.components.CssLoader",
			    "wm.base.components.PageLoader",
			    "wm.base.components.Application",
			    "wm.base.components.Property",
			    "wm.base.components.ImageList",
			    "wm.base.components.Binding",
			    "wm.base.components.TypeDefinition",


			    // component Utilities
			    "wm.base.components.Security",
			    //"wm.base.components.ServiceQueue",

			    // Layout rendering classes
			    "wm.base.widget.layout.Layout",
			    "wm.base.widget.layout.Box",

			    // Editors
			    "wm.base.widget.Editors.AbstractEditor",
        		    "wm.base.widget.Editors.dijit",
			    "wm.base.widget.Editors.Text",
			    "wm.base.widget.Editors.Number",
			    "wm.base.widget.Editors.Checkbox",
			    "wm.base.widget.Editors.DataSetEditor",
			    "wm.base.widget.Editors.Select",


			    // widgets
			    "wm.base.widget.AppRoot",
			    "wm.base.widget.Formatters",
			    "wm.base.widget.Label",
			    "wm.base.widget.Spacer",
			    "wm.base.widget.Container",
			    //"lib.github.touchscroll.touchscrollmin",
			    "wm.base.widget.Panel",
			    "wm.base.widget.Layout",
			    "wm.base.widget.Bevel",
			    "wm.base.widget.Splitter",
			    "wm.base.widget.Buttons.Button",
			    "wm.base.widget.Buttons.ToggleButton",
			    "wm.base.widget.Picture",

			    "wm.base.widget.Html",
			    "wm.base.widget.VirtualList",
			    "wm.base.widget.Table.builder",
			    "wm.base.widget.List",

			    "wm.base.widget.Layers.Decorator",
			    "wm.base.widget.Layers.TabsDecorator",
			    "wm.base.widget.Layers.BreadcrumbDecorator",
			    "wm.base.widget.Layers",
			    "wm.base.widget.BreadcrumbLayers",
				
			    "wm.base.widget.PageContainer",
			    "wm.base.widget.Scrim",
			    "wm.base.widget.Dialogs.Dialog",
			    "wm.base.widget.Dialogs.Toast",
			    "wm.base.widget.Dialogs.WidgetsJsDialog",
			    "wm.base.widget.Dialogs.GenericDialog",
			    "wm.base.widget.Dialogs.PageDialog",
			    "wm.base.widget.Dialogs.DesignableDialog",
			    "wm.base.widget.Dialogs.LoadingDialog",
			    
			    // Grid? Menu? Calendar? Editors? Layers?
			]
		},

		{
			name: "wm_charts.js",
			resourceName: "wm.compressed.wm_charts",
			layerDependencies: ["lib_build.js"],
			dependencies: [
				"dojox.charting.Chart2D",
				"dojox.charting.widget.Legend",
				"dojox.charting.action2d.Highlight",
				"dojox.charting.action2d.Magnify",
				"dojox.charting.action2d.MoveSlice",
				"dojox.charting.action2d.Shake",
				"dojox.charting.action2d.Tooltip",
				"dojo.fx.easing",
			        "wm.base.widget.DojoChart",
			        "wm.base.widget.DojoGauge"
			]
		},
		{
			name: "wm_menus.js",
			resourceName: "wm.compressed.wm_menus",
			layerDependencies: ["lib_build.js"],
			dependencies: [
				"dijit.Menu",
				"dijit.MenuItem",
				"dijit.PopupMenuItem",
				"dijit.MenuBar",
				"dijit.MenuBarItem",
				"dijit.PopupMenuBarItem",
				"dijit.MenuSeparator",
			    "wm.base.widget.DojoMenu",
			    "wm.base.widget.Buttons.PopupMenuButton",
			]
		},
		{
			name: "wm_dojo_grid.js",
			resourceName: "wm.compressed.wm_dojo_grid",
			layerDependencies: ["lib_build.js"],
			dependencies: [
	   		"dojox.grid.DataGrid",
			    "dojox.grid.cells.dijit",
			    "dojo.data.ItemFileWriteStore",
			    "dojo.string",
			    "dojox.grid._CheckBoxSelector",
			    "dojox.grid._RadioSelector",
			    "wm.base.widget.DojoGrid"
			]
		},
		{
			name: "wm_data_grid.js",
			resourceName: "wm.compressed.wm_data_grid",
			layerDependencies: ["lib_build.js"],
			dependencies: [
	   		    "dojox.grid.compat.Grid",
			    "dojo.data.ItemFileWriteStore",
			    "dojo.string",
			    "wm.base.widget.DataGrid",
			    "wm.base.widget.dijit.Grid"
			]
		},

                {
			name: "wm_list.js",
			resourceName: "wm.compressed.wm_list",
			layerDependencies: ["lib_build.js"],
			dependencies: [
				"wm.base.widget.VirtualList",
			        "wm.base.widget.Table.builder",
			        "wm.base.widget.List"
			]
		},
		{
			name: "wm_editors.js",
			resourceName: "wm.compressed.wm_editors",
			layerDependencies: ["lib_build.js"],
		    dependencies: [
			"wm.base.widget.Editors.Number",
			"wm.base.widget.Editors.Date",
			"wm.base.widget.dijit.Dijit",
			"wm.base.widget.dijit.Calendar",
			"wm.base.widget.Editors.Checkbox",
			"dojo.dojo.parser", /* Used by DataSetEditor */
			"wm.base.widget.Editors.DataSetEditor",
			"wm.base.data.SimpleStore", /* Used by Select */
			"wm.base.widget.Editors.Select"
			]		
		},
		{
			name: "wm_editors_misc.js",
			resourceName: "wm.compressed.wm_editors_misc",
		    layerDependencies: ["lib_build.js", "wm_editors"],
		    dependencies: [
			"wm.base.widget.Editors.Radiobutton",
			"wm.base.widget.Editors.Slider"
			]		
		},

		{
			name: "wm_editors_old.js",
			resourceName: "wm.compressed.wm_editors_old",
			layerDependencies: ["lib_build.js"],
			dependencies: [
        	   "wm.base.widget.Editors.dijit",
			    "wm.base.widget.Editors.Base",
               "wm.base.widget.Editor",
               "wm.base.widget.Editors._NumberEditor",
               "wm.base.widget.Editors._DateEditor",
               "wm.base.widget.Editors._CheckBoxEditor",
               "wm.base.widget.Editors._RadioButtonEditor",
               "wm.base.widget.Editors._SelectEditor",
			    "wm.base.widget.Editors.Slider"
			]		
		},

		{
			name: "wm_richTextEditor.js",
			resourceName: "wm.compressed.wm_richTextEditor",
			layerDependencies: ["lib_build.js", "wm_editors.js"],
			dependencies: [
			    "wm.base.widget.Editors.RichText",
			    "dijit._editor.plugins.AlwaysShowToolbar",
			    "dijit._editor.plugins.FontChoice",
			    "dijit._editor.plugins.TextColor",
			    "dijit._editor.plugins.LinkDialog",
			    "dojox.editor.plugins.FindReplace",
			    "dojox.editor.plugins.AutoUrlLink"
			]		
		},
		{
			name: "wm_dashboard.js",
			resourceName: "wm.compressed.wm_dashboard",
			layerDependencies: ["lib_build.js", "wm_editors.js"],
			dependencies: [
			    "wm.base.widget.Dashboard"
			]		
		},
		{
			name: "wm_livepanel.js",
			resourceName: "wm.compressed.wm_livepanel",
			layerDependencies: ["lib_build.js"],
			dependencies: [
               "wm.base.widget.LiveForm",
               "wm.base.widget.RelatedEditor",
               "wm.base.widget.LivePanel",
               "wm.base.widget.EditPanel",
               "wm.base.widget.DataNavigator"
			]		
		},
		{
			name: "wm_dataform.js",
			resourceName: "wm.compressed.wm_dataform",
		    layerDependencies: ["lib_build.js", "wm_editors"],
			dependencies: [
               "wm.base.widget.DataForm",
               "wm.base.widget.Editors.OneToMany"
			]		
		},

		{
			name: "wm_gadgets.js",
			resourceName: "wm.compressed.wm_gadgets",
			layerDependencies: ["lib_build.js"],
			dependencies: [
				"wm.base.widget.gadget.Gadget",
				"wm.base.widget.gadget.Stocks",
				"wm.base.widget.gadget.Weather",
				"wm.base.widget.gadget.YouTube",
			        "wm.base.widget.gadget.Facebook",
			        "wm.base.widget.gadget.TwitterGadgets",
			        "wm.base.widget.gadget.GoogleMap"			    
			]		
		},
		{
			name: "wm_fileupload.js",
			resourceName: "wm.compressed.wm_fileupload",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			    "wm.base.widget.Html", /* Required by DojoFileUpload */
			    "wm.base.widget.dijit.ProgressBar",
			    "dojo.io.iframe",
			    "dojox.form.FileUploader",
			    "wm.base.widget.DojoFlashFileUpload",
			    "wm.base.widget.DojoFileUpload"
			]
		},				
    {
			name: "wm_trees.js",
			resourceName: "wm.compressed.wm_trees",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			    "wm.base.widget.Trees.Tree", 
			    "wm.base.widget.Trees.ObjectTree", 
			    "wm.base.widget.Trees.PropertyTree", 
			    "wm.base.widget.Trees.DraggableTree"
			]
		},		
		{
			name: "wm_accordion.js",
			resourceName: "wm.compressed.wm_accordion",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			    "wm.base.widget.AccordionLayers", 
			    "wm.base.widget.Layers.AccordionDecorator"
			]
		},
		{
			name: "wm_wizardlayer.js",
			resourceName: "wm.compressed.wm_wizardlayer",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			    "wm.base.widget.WizardLayers", 
			    "wm.base.widget.Layers.WizardDecorator"
			]
		},
		{
			name: "wm_breadcrumblayer.js",
			resourceName: "wm.compressed.wm_breadcrumblayer",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			    "wm.base.widget.BreadcrumbLayers", 
			    "wm.base.widget.Layers.BreadcrumbDecorator"
			]
		},
		{
			name: "wm_progressbar.js",
			resourceName: "wm.compressed.wm_progressbar",
		        layerDependencies: ["lib_build.js"],
			dependencies: [
			    "dijit.ProgressBar",
			    "wm.base.widget.dijit.ProgressBar", 
			    "wm.base.widget.Layers.BreadcrumbDecorator"
			]
		},
		{
			name: "wm_colorpicker.js",
			resourceName: "wm.compressed.wm_colorpicker",
		    layerDependencies: ["lib_build.js", "wm_editors"],
			dependencies: [
			"wm.base.widget.Editors.ColorPicker",
			"wm.base.widget.Dialogs.ColorPickerDialog",
			"dojox.widget.ColorPicker"
			]
		},
		
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
	        [ "wm", "../../wm" ],
	        [ "lib", "../.." ]
		/*,[ "Palm", "../../Palm" ]*/
	]
}