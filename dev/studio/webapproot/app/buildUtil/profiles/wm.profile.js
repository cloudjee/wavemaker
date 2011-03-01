/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

dependencies = {
	layers: [
		// runtime
		{
			name: "lib_build.js",
			resourceName: "wm",
			layerDependencies: [
			],
			dependencies: [
				//
				//"dojo.dijit.form.TextBox",
				//"dojo.dojo.string",
				"dojo.dojo.parser",
				//"dojo.dojo.date.stamp",
				//"dojo.dijit.Tooltip",
				//"dojo.dijit.form.ComboBox",
				//"dojo.dojo.date.locale",
				//"dojo.dojo.date",
				//"dojo.dojo.regexp",
				"dojo.dojo.data.util.simpleFetch",
				//"dojo.dojo.data.util.sorter",
				//"dojo.dojo.rpc.JsonService",
				//"dojo.dojo.rpc.RpcService",
				//"dojo.dojo.cookie",
				//"dojo.dijit.form.CheckBox",
				"dojo.dijit.form.Button",
				//"dojo.dijit._Container",
				//"dojo.dijit.form.DateTextBox",
				//"dojo.dijit._Calendar",
				//"dojo.dijit.form._DateTimeTextBox",
				//"dojo.dijit.form.TimeTextBox",
				//"dojo.dijit._TimePicker",
				//"dojo.dijit.form.NumberTextBox",
				//"dojo.dojo.number",
				//"dijit.form.FilteringSelect",
				//"dojo.dijit.form.CurrencyTextBox",
				//"dojo.dojo.currency",
				//"dojo.dijit.form.HorizontalSlider",
				//"dojo.dijit.form.VerticalSlider",
				//"dojo.dojo.io.iframe",
				//"dojo.dijit.ProgressBar",
				//"dojo.dojo.fx",
				//"dojo.dijit.form._Spinner",
				//
				// WM
                            "wm.base.components.componentList",

			    //"lib.github.touchscroll.touchscroll",

				// wm utility libs
				"wm.base.lib.util",
				//"wm.base.lib.date",
				//"wm.base.lib.text",
				"wm.base.lib.types",
				"wm.base.lib.data",
				//"wm.base.layout.console",
				"wm.base.data.expression",
				"wm.base.data.SimpleStore",
				//"wm.base.drag.capture",
				//"wm.base.drag.drag",
				// base classes
				"wm.base.Object",
				"wm.base.Component",
				"wm.base.Control",
				"wm.base.Plugin",
				//"wm.modules.rbac.RbacPlugin",
				"wm.base.RbacPlugin",
				// components
				"wm.base.components.Page",
				"wm.base.components.HtmlLoader",
				"wm.base.components.CssLoader",
				"wm.base.components.PageLoader",
				"wm.base.components.Application",
				//"wm.base.components.Property",
				//"wm.base.components.Publisher",
				//"wm.base.components.ImageList",
				"wm.base.components.Binding",
				"wm.base.components.LiveView",
				"wm.base.components.LiveVariable",
				"wm.base.components.JsonRpcService",
				"wm.base.components.NavigationCall",
				"wm.base.components.NavigationService",
				"wm.base.components.TypeDefinition",
				/*
				"wm.base.components.Variable",
				"wm.base.components.Service",
				"wm.base.components.ServiceCall",
				"wm.base.components.ServiceQueue",
				"wm.base.components.ServiceVariable",
				"wm.base.components.NavigationCall",
				"wm.base.components.NavigationService",
				"wm.base.components.FunctionService",
				*/
				"wm.base.components.Security",
				//"wm.base.components.ImageList",
				//"wm.base.components.DomMacro",
				// widgets
				//"wm.base.widget.Formatters",
				//"wm.base.widget.Editors.dijit",
				"wm.base.widget.Editors.Base",
				"wm.base.widget.Editors.Text",
				//"wm.base.widget.Editors.Number",
				//"wm.base.widget.Editors.Date",
				//"wm.base.widget.Editors.Checkbox",
				//"wm.base.widget.Editors.Radiobutton",
				//"wm.base.widget.Editors.Select",
				"wm.base.widget.Box",
				"wm.base.widget.Spacer",
				"wm.base.widget.layout.Layout",
				"wm.base.widget.layout.Box",
				//"wm.base.widget.layout.Abs",
				"wm.base.widget.Container",
				"wm.base.widget.Panel",
				"wm.base.widget.Template",
				"wm.base.widget.Layout",
				"wm.base.widget.Content",
				//"wm.base.widget.Html",
				"wm.base.widget.Bevel",
				//"wm.base.widget.Splitter",
				"wm.base.widget.Button",
				"wm.base.widget.Picture",
				"wm.base.widget.Label",
				/*
				"wm.base.widget.gadget.Gadget",
				"wm.base.widget.gadget.Stocks",
				"wm.base.widget.gadget.Weather",
				"wm.base.widget.gadget.YouTube",
				"dojo.dijit.form._FormWidget",
				"dojo.dijit._Widget",
				"dojo.dijit._base",
				"dojo.dijit._base.focus",
				"dojo.dijit._base.manager",
				"dojo.dijit._base.place",
				"dojo.dijit._base.popup",
				"dojo.dijit._base.window",
				"dojo.dijit._base.scroll",
				"dojo.dijit._base.sniff",
				"dojo.dijit._base.bidi",
				"dojo.dijit._base.typematic",
				"dojo.dijit._base.wai",
				"dojo.dijit._Templated",

				"wm.base.widget.Tree",
				*/

				"wm.base.widget.Layers.Decorator",
				"wm.base.widget.Layers.TabsDecorator",
				"wm.base.widget.Layers.AccordionDecorator",
				"wm.base.widget.Layers",
				
				"wm.base.widget.PageContainer",
				//"wm.base.widget.Table.builder",
				//"wm.base.widget.VirtualList",
				//"wm.base.widget.List",
				//"wm.base.widget.FeedList",
				//"wm.base.widget.Detail",
				//"wm.base.widget.Form",
				//"wm.base.widget.LiveForm",
				"wm.base.widget.LivePanel",
				//"wm.base.widget.DataNavigator",
				//"wm.base.widget.Input",
				//"wm.base.widget.TextArea",
				//"wm.base.widget.Select",
				"wm.base.widget.Scrim",
				"wm.base.widget.Dialog",
				//"wm.base.widget.Editor",
				//"wm.base.widget.RelatedEditor",
				//"wm.base.widget.FileUpload",
				//"wm.base.widget.EditArea",
				//"wm.base.widget.Popup",
				"wm.base.widget.EditPanel",
				//"wm.base.widget.Ticker",
				//"wm.base.widget.Composite",
				// Misc
				//"wm.base.widget.Cards",
				// Dijits
				"wm.base.widget.dijit.Dijit",
				"wm.base.components.Timer"
				//"wm.base.components.componentList",				
				//"wm.base.widget.dijit.CheckBox",
				//"wm.base.widget.dijit.Calendar",
				//"wm.base.widget.dijit.ProgressBar",
				
				//"wm.base.widget.dijit.Grid",
				//"wm.base.widget.DataGrid",
				//"wm.base.widget.Toolbar"
				// Ext
				/*
				"wm.base.widget.ext.Ext",
				"wm.base.widget.ext.Toolbar",
				*/
				// Plugins
				// Palm
				/*,
				"Palm.Application",
				"Palm.ListContactsService",
				"Palm.ContactDetailService",
				"Palm.LaunchEmailService",
				"Palm.Button",
				"Palm.PanelParts",
				"Palm.Panel"
				*/
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
				"wm.base.widget.DojoChart"
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
				"wm.base.widget.DojoMenu"
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
				"dijit.Dialog",
				"wm.base.lib.currencyMappings",
				"wm.base.widget.DataGrid",
				"wm.base.widget.DojoGrid"
			]
		},
                {
			name: "wm_list.js",
			resourceName: "wm.compressed.wm_list",
			layerDependencies: ["lib_build.js"],
			dependencies: [
				"wm.base.widget.VirtualList",
			        "wm.base.widget.Table.builder",
			        "wm.base.widget.List",
				"wm.base.widget.WidgetList"
			]
		},
		{
			name: "wm_editors.js",
			resourceName: "wm.compressed.wm_editors",
			layerDependencies: ["lib_build.js"],
			dependencies: [
			   "wm.base.lib.date",
        	   "wm.base.lib.text",
        	   "wm.base.widget.Formatters",
        	   "wm.base.widget.Editors.dijit",
               "wm.base.widget.Editor",
               "wm.base.widget.RelatedEditor",
               //"wm.base.widget.Editors.Base",
               //"wm.base.widget.Editors.Text",
               "wm.base.widget.Editors.Number",
               "wm.base.widget.Editors.Date",
               "wm.base.widget.Editors.Checkbox",
               "wm.base.widget.Editors.Radiobutton",
               "wm.base.widget.Editors.Select",
               "wm.base.widget.Editors.Slider"
			]		
		},
		{
			name: "wm_richTextEditor.js",
			resourceName: "wm.compressed.wm_richTextEditor",
			layerDependencies: ["lib_build.js", "wm_editors.js"],
			dependencies: [
			   "wm.base.widget.Editors.RichText"
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
