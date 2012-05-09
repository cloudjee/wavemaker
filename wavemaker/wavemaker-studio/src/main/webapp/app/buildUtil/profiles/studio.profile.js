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
	    /* Libraries that studio depends upon; TODO: Fold this into another layer */
		{
			name: "studio_base.js",
			resourceName: "studio_base",
		    layerDependencies: ["wm_richtext.js"],
			dependencies: [
			    "dojo.number",
			    "dojo.currency",
			    "dojo.fx",			    
			    "dojo.io.iframe",
			    "dojo.string",
			    "dojo.date.stamp",
			    "dojo.date.locale",
			    "dojo.date",
			    "dojo.data.util.simpleFetch",
			    "wm.studio.app.packageLoader",
			    'wm.base.components.componentList',
			    'wm.studio.app.componentList',
			    "wm.base.lib.util",
			    "wm.base.lib.date",
			    "wm.base.lib.types",
			    "wm.base.lib.data",
			    "wm.base.lib.currencyMappings",
			    //"wm.base.layout.console",
			    "wm.base.data.expression",
			    "wm.base.data.SimpleStore",
			    "wm.base.drag.capture",
			    "wm.base.drag.drag",
			    "wm.base.drag.layout",

/* The old datagrid is still used in DataObjectsEditor and LiveViewEditor; let it load on demand
				"dojox.grid._grid.scroller",
				"dojox.grid._grid.edit",
				"dojox.grid._grid.cell",
				"dojox.grid._grid.builder",
				"dojox.grid._grid.layout",
				"dojox.grid._grid.view",
				"dojox.grid._grid.drag",
				"dojox.grid._grid.lib",
				"dojox.grid._grid.views",
				"dojox.grid._grid.rows",
				"dojox.grid._grid.focus",
				"dojox.grid._grid.selection",
				"dojox.grid._grid.rowbar",
				"dojox.grid._grid.publicEvents",
				"dojox.grid.VirtualGrid",
				"dojox.grid.compat.Grid",*/

				"dijit.form.TextBox",
				"dijit.form._FormWidget",
				"dijit._Widget",
				"dijit._base",
				"dijit._base.focus",
				"dijit._base.manager",
				"dijit._base.place",
				"dijit._base.popup",
				"dijit._base.window",
				"dijit._base.scroll",
				"dijit._base.sniff",
				"dijit._base.bidi",
				"dijit._base.typematic",
				"dijit._base.wai",
				"dijit._Templated",
			        "dijit.Tooltip", 

			    /* CORE COMPONENTS */
				"wm.base.Object",
				"wm.base.Component",
				"wm.base.Component_design",
				"wm.base.Control",
				"wm.base.Control_design",
				//"wm.base.Widget",
				//"wm.base.Widget_design",
				"wm.base.Plugin",
				"wm.base.RbacPlugin_design",
				"wm.base.RbacPlugin",
				"wm.base.I18nPlugin",

			    /*  COMPONENTS FOLDER */
				"wm.base.components.Page",
				"wm.base.components.HtmlLoader",
				"wm.base.components.CssLoader",
				"wm.base.components.PageLoader",
				"wm.base.components.Application",
			        "wm.base.components.Application_design",
				"wm.base.components.Property",
				"wm.base.components.Publisher",
				"wm.base.components.ImageList",
				"wm.base.components.ImageList_design",
				"wm.base.components.Variable",
				"wm.base.components.Variable_design",
				"wm.base.components.Binding",
				"wm.base.components.Service",
				"wm.base.components.ServiceQueue",
				"wm.base.components.ServiceCall",
			        "wm.base.components.ServiceCall_design",
				"wm.base.components.ServiceVariable",
				"wm.base.components.LiveView",
				"wm.base.components.LiveView_design",
				"wm.base.components.LiveVariable",
				"wm.base.components.LiveVariable_design",
				"wm.base.components.NavigationService_design",
				"wm.base.components.NavigationService",
				"wm.base.components.FunctionService",
				"wm.base.components.JsonRpcService",
				"wm.base.components.Security_design",
				"wm.base.components.Security",
			        //"wm.base.components.DomMacro",
				"wm.base.components.Timer",
				"wm.base.components.LogoutVariable_design",
				"wm.base.components.LogoutVariable",
				"wm.base.components.TypeDefinition_design",
				"wm.base.components.TypeDefinition",
				"wm.base.components.DataModel",
				"wm.base.components.Query",
				"wm.base.components.JavaService",
				"wm.base.components.WebService",
				"wm.base.widget.Formatters",
				"wm.base.widget.FormattersMisc",



			    /* CORE WIDGETS */
				"wm.base.widget.Spacer",
				"wm.base.widget.Spacer_design",
				"wm.base.widget.Label",
				"wm.base.widget.Label_design",
				"wm.base.widget.Picture",
				"wm.base.widget.Picture_design",
				"wm.base.widget.Content",
				"wm.base.widget.Content_design",
				"wm.base.widget.Html",
				"wm.base.widget.Html_design",
				"wm.base.widget.Bevel",
				"wm.base.widget.Bevel_design",
				"wm.base.widget.Splitter",
				"wm.base.widget.Splitter_design",
			    
				"wm.base.widget.Buttons.ToggleButton",
				"wm.base.widget.Buttons.ToolButton",
				"wm.base.widget.Buttons.Button",
				"wm.base.widget.Buttons.Button_design",

			    /* Rendering Classes */

				"wm.base.widget.layout.Layout",
				"wm.base.widget.layout.Box",
				"wm.base.widget.layout.Abs",

			    /* CORE CONTAINERS */
				"wm.base.widget.Container",
				"wm.base.widget.Container_design",
				"wm.base.widget.Panel",
				"wm.base.widget.Panel_design",
				"wm.base.widget.PageContainer",
				"wm.base.widget.PageContainer_design",
				"wm.base.widget.Template",
				"wm.base.widget.AppRoot",
				"wm.base.widget.Layout",
				"wm.base.widget.Layout_design",
				"wm.base.widget.Layers.Decorator",
				"wm.base.widget.Layers.TabsDecorator",
				"wm.base.widget.Layers.TabsDecorator_design",
				"wm.base.widget.Layers.AccordionDecorator",
				"wm.base.widget.Layers",
				"wm.base.widget.AccordionLayers",
				"wm.base.widget.Layers_design",




			    /* EDITORS */
			    "wm.base.widget.Editors.AbstractEditor",
			    "wm.base.widget.Editors.AbstractEditor_design",
			    "wm.base.widget.Editors.dijit",
			    "wm.base.widget.Editors.Text_design",
			    "wm.base.widget.Editors.Text",
			    "wm.base.widget.Editors.Number_design",
			    "wm.base.widget.Editors.Number",
			    "wm.base.widget.Editors.Checkbox_design",
			    "wm.base.widget.Editors.Checkbox",
			    "wm.base.widget.Editors.Radiobutton", /* Needed by bind dialog */
			    "wm.base.widget.Editors.DataSetEditor",
			    "wm.base.widget.Editors.DataSetEditor_design",
			    "wm.base.widget.Editors.Select_design",
			    "wm.base.widget.Editors.Select",
			    "wm.base.widget.AceEditor",




/* Load on demand*/


/*			    "dojo.dnd.Selector",
			    "dojo.dnd.Avatar",
			    "dojo.dnd.Container",
			    "dojo.dnd.Source",
			    */



			    /* Required advanced widgets */
			    "wm.base.widget.IFrame",  /* Required for the start page */
			    "wm.base.widget.IFrame_design",
			    "wm.base.widget.Trees.Tree", 
			    "wm.base.widget.Trees.Tree_design",
			    "wm.base.widget.Trees.DraggableTree",
			    "wm.base.widget.JsonStatus",
			    "wm.base.widget.Editors.RichText",

			    /* LIST LAYER IS REQUIRED */
			    "wm.base.widget.Table.builder",
			    "wm.base.widget.VirtualList",
			    "wm.base.widget.List",
			    "wm.base.widget.List_design",






			    /* FormPanel is required by the property panel, so DataForm must be included in the build */
			    "wm.base.widget.DataForm",
			    "wm.base.widget.DataForm_design",

			    /* Load this since its not ever going to be in componentList.js */
				"wm.base.widget.Input",

			    /* REQUIRED Dialogs */
			    "wm.base.widget.Scrim",
			    "wm.base.widget.Dialogs.Dialog",
			    "wm.base.widget.Dialogs.Toast",
			    "wm.base.widget.Dialogs.WidgetsJsDialog",
			    "wm.base.widget.Dialogs.GenericDialog",
			    "wm.base.widget.Dialogs.PageDialog",
			    "wm.base.widget.Dialogs.DesignableDialog",
			    "wm.base.widget.Dialogs.LoadingDialog",/* Not required but expected to be very common */
			    "wm.base.widget.Dialogs.Dialog_design",

			    
			    /* ProgressBar is required */
			    "wm.base.widget.dijit.Dijit",
			    "wm.base.widget.dijit.Dijit_design",			    
			    "wm.base.widget.dijit.ProgressBar",
			    "wm.base.widget.dijit.ProgressBar_design",


			    /* Drives the menu bar and contextual menus */
			    "wm.base.widget.DojoMenu",
			    "wm.base.widget.DojoMenu_design"
			]
		},

	    /* Layer with all of studio's custom widgets and classes not needed by user projects */
		{
			name: "studio.js",
			resourceName: "studio",
			layerDependencies: [
				"studio_base.js"
			],
			dependencies: [
			    /* Design classes */
				"wm.base.design.Designable",
				"wm.base.design.Surface",
				"wm.base.design.Drag",
				"wm.base.design.Wrapper",
				"wm.base.design.Designer",

			    /* Studio application and page classes */
				"wm.studio.app.StudioApplication",
				"wm.studio.pages.Studio.Studio",

			    /* App folder  */
				"wm.studio.app.util",
				"wm.studio.app.mainNavigation",
				"wm.studio.app.keyconfig",
				"wm.studio.app.Palette",
				"wm.studio.app.binding",
				"wm.studio.app.inspector.ComponentInspector",
				"wm.studio.app.inspect",
				"wm.studio.app.sourcer",
				"wm.studio.app.events",
				"wm.studio.app.editcommands",
				"wm.studio.app.file",
				"wm.studio.app.css",
				"wm.studio.app.project",
				"wm.studio.app.markup",
				"wm.studio.app.actions",
				"wm.studio.app.clipboard",
				"wm.studio.app.trees",
				"wm.studio.app.menu",
				"wm.studio.app.deploy",
				"wm.studio.app.dom",
				"wm.studio.app.propertyEdit",
				"wm.studio.app.data",
				"wm.studio.app.templates.widgetTemplates",
				"wm.studio.app.dataconstants",
				"wm.studio.app.datautils",
			    

			    "wm.studio.pages.Start.Start",
			    "wm.studio.pages.ConfirmSaveDialog.ConfirmSaveDialog",
				"wm.studio.pages.BindSourceDialog.BindSourceDialog",
				/* Load on demand
				"wm.studio.pages.ImportPageDialog.ImportPageDialog",
				"wm.studio.pages.CreateLiveView.CreateLiveView",
				"wm.studio.pages.DataObjectsEditor.DataObjectsEditor",
				"wm.studio.pages.DBConnectionSettings.DBConnectionSettings",
				"wm.studio.pages.DDLDialog.DDLDialog",
				"wm.studio.pages.DeploymentDialog.DeploymentDialog",
				"wm.studio.pages.Diagnostics.Diagnostics",
				"wm.studio.pages.ImportDatabase.ImportDatabase",
				"wm.studio.pages.ImportWebService.ImportWebService",
				"wm.studio.pages.JavaEditor.JavaEditor",
				"wm.studio.pages.LiveViewEditor.LiveViewEditor",
				"wm.studio.pages.NavigationDialog.NavigationDialog",
				"wm.studio.pages.NewJavaService.NewJavaService",
				"wm.studio.pages.PreferencesPane.PreferencesPane",
				"wm.studio.pages.QueryEditor.QueryEditor",
				"wm.studio.pages.QueueDialog.QueueDialog",
				"wm.studio.pages.RegistrationDialog.RegistrationDialog",
				"wm.studio.pages.RestServiceBuilder.RestServiceBuilder",
				"wm.studio.pages.RestUrlDialog.RestUrlDialog",
				"wm.studio.pages.Security.Security",
				"wm.studio.pages.ServiceDialog.ServiceDialog",
				"wm.studio.pages.Services.Services",
			    "wm.studio.pages.HandleRequiredJars.HandleRequiredJars" 
				*/


			]
		},
	    {

		name: "wm_livepanel.js",
		resourceName: "wm_livepanel",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
				"wm.base.widget.LiveForm",
				"wm.base.widget.LiveForm_design",
				"wm.base.widget.LivePanel",
				"wm.base.widget.LivePanel_design",
				"wm.base.widget.RelatedEditor",
				"wm.base.widget.RelatedEditor_design",
				"wm.base.widget.EditPanel",
				"wm.base.widget.EditPanel_design",
				"wm.base.widget.DataNavigator",
				"wm.base.widget.DataNavigator_design"
		]
	    },
	    {
		name: "wm_gadget.js",
		resourceName: "wm_gadget",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.FeedList",
		    "wm.base.widget.gadget.Gadget",
		    "wm.base.widget.gadget.Stocks",
		    "wm.base.widget.gadget.Weather",
		    "wm.base.widget.gadget.YouTube",
		    "wm.base.widget.gadget.GoogleMap",
		    "wm.base.widget.gadget.GoogleMap_design",
		    "wm.base.widget.gadget.Facebook",
		    "wm.base.widget.gadget.Facebook_design",
		    "wm.base.widget.gadget.TwitterGadgets",
		    "wm.base.widget.gadget.TwitterGadgets_design",
		    "wm.base.widget.DojoFisheye",
		    "wm.base.widget.DojoFisheye_design"

		]
	    },
	    {
		name: "wm_richtext.js",
		resourceName: "wm_editors",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "dijit.Editor",
		    "dojox.editor.plugins.AutoUrlLink",
		    "dijit._editor.plugins.AlwaysShowToolbar",
		    "dijit._editor.plugins.FontChoice",
		    "dijit._editor.plugins.TextColor",
		    "dijit._editor.plugins.LinkDialog",
		    "dojox.editor.plugins.FindReplace"
		]
	    },
	    {
		name: "wm_editors.js",
		resourceName: "wm_editors",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.Editors.OneToMany",
		    "wm.base.widget.Editors.OneToMany_design",
		    "wm.base.widget.dijit.Calendar",
		    "wm.base.widget.dijit.Calendar_design",
		    "wm.base.widget.Editors.Date",
		    "wm.base.widget.Editors.Date_design",
		    "wm.base.widget.Editors.Slider"
		]
	    },
	    {
		name: "wm_misc.js",
		resourceName: "wm_misc",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.Buttons.BusyButton",
		    "wm.base.widget.Buttons.BusyButton_design",
		    "wm.base.widget.DojoLightbox",
		    "wm.base.widget.ListViewer",				
		    "wm.base.widget.ListViewer_design"
		]
	    },
	    {
		name: "wm_dashboard.js",
		resourceName: "wm_dashboard",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.Dashboard",
		    "wm.base.widget.Dashboard_design"
		]
	    },
	    {
		name: "wm_charts.js",
		resourceName: "wm_charts",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.DojoChart",
		    "wm.base.widget.DojoChart_design",
		    "wm.base.widget.DojoGauge",
		    "wm.base.widget.DojoGauge_design"
		]
	    },
	    {
		name: "wm_trees.js",
		resourceName: "wm_trees",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.Trees.PropertyTree",
		    "wm.base.widget.Trees.ObjectTree",
		    "wm.base.widget.Trees.DebugTree"
		]
	    },
	    {
		name: "wm_dojogrid.js",
		resourceName: "wm_dojogrid",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.DojoGrid",
		    "wm.base.widget.DojoGrid_design"
		]
	    },
	    {
		name: "wm_fileupload.js",
		resourceName: "wm_fileupload",
		layerDependencies: ["studio.js", "studio_base.js"],
		dependencies: [
		    "wm.base.widget.DojoFileUpload",				
		    "wm.base.widget.DojoFlashFileUpload",				
		]
	    },
		{
			name: "wm_editors_old.js",
			resourceName: "wm.compressed.wm_editors_old",
		    layerDependencies: ["studio.js", "studio_base.js", "wm_editors.js"],
			dependencies: [
        	   "wm.base.widget.Editors.dijit",
			    "wm.base.widget.Editors.Base",
               "wm.base.widget.Editor",
               "wm.base.widget.Editors._NumberEditor",
               "wm.base.widget.Editors._DateEditor",
               "wm.base.widget.Editors._CheckBoxEditor",
               "wm.base.widget.Editors._RadioButtonEditor",
               "wm.base.widget.Editors._SelectEditor"
			]		
		},


	],





				


	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "wm", "../../wm" ]
	]
}
