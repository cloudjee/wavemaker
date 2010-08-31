/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.manifest");

wm.registerPaths(
	["wm", wm.libPath + "wm"]
);

wm.loadLibs([ 
	// Dijit
	"css.dijit.themes.tundra.tundra",
	"css.dijit.themes.soria.soria",
	"css.dojox.grid._grid.Grid",
	"css.dojox.grid.resources.Grid",
	"css.dojox.grid.resources.tundraGrid",
	"css.dojox.widget.Portlet.Portlet",
	"css.dojox.layout.resources.GridContainer",
	
	"dijit.form.ValidationTextBox",
	"dijit.form.ComboBox",
	"dijit.form.FilteringSelect",
	"dojox.html.styles",
	// WM
	"css.wm.base.widget.themes.default.theme",
	"css.wm.base.styles.wavemaker",
	"css.wm.base.styles.progressBar",
	"css.dojox.widget.FisheyeList.FisheyeList",
	"css.dojox.image.resources.image",
	
	"dijit.form._FormValueWidget",
	"dijit._Container",
	// wm utility libs
	"wm.base.lib.util",
	"wm.base.lib.date",
	"wm.base.lib.text",
	"wm.base.lib.types",
	"wm.base.lib.data",
	"wm.base.layout.console",
	"wm.base.data.expression",
	"wm.base.data.SimpleStore",
	"wm.base.drag.capture",
	"wm.base.drag.drag",
	// base classes
	"wm.base.Object",
	"wm.base.Component",
	"wm.base.Control",
	"wm.base.Plugin",
	"wm.base.widget.DojoGrid",
	"wm.base.widget.DojoChart",
	"wm.base.widget.Dashboard",
	"wm.base.widget.DojoFisheye",
	"wm.base.widget.DojoLightbox",
	"wm.base.widget.DojoMenu",
	// components
	"wm.base.components.Page",
	"wm.base.components.HtmlLoader",
	"wm.base.components.CssLoader",
	"wm.base.components.PageLoader",
	"wm.base.components.Application",
	"wm.base.components.ImageList",
	"wm.base.components.Variable",
	"wm.base.components.Binding",
	"wm.base.components.Service",
	"wm.base.components.ServiceCall",
	"wm.base.components.ServiceQueue",
	"wm.base.components.ServiceVariable",
	"wm.base.components.LiveView",
	"wm.base.components.LiveVariable",
	"wm.base.components.LogoutVariable",
	"wm.base.components.NavigationCall",
	"wm.base.components.NavigationService",
	"wm.base.components.FunctionService",
	"wm.base.components.TypeDefinition",
	//"wm.base.components.FileTransferService",
	"wm.base.components.JsonRpcService",
	"wm.base.components.Security",
	"wm.base.components.DomMacro",
	// widgets
	"wm.base.widget.Formatters",
	"wm.base.widget.Editors.dijit",
	"wm.base.widget.Editors.Base",
	"wm.base.widget.Editors.Text",
	"wm.base.widget.Editors.Number",
	"wm.base.widget.Editors.Date",
	"wm.base.widget.Editors.Checkbox",
	"wm.base.widget.Editors.Radiobutton",
	"wm.base.widget.Editors.Select",
	"wm.base.widget.Box",
	"wm.base.widget.Spacer",
	"wm.base.widget.layout.Layout",
	"wm.base.widget.layout.Box",
	"wm.base.widget.layout.Abs",
	"wm.base.widget.Container",
	//"wm.base.widget.Dwim",
	"wm.base.widget.Panel",
	"wm.base.widget.Template",
	"wm.base.widget.Layout",
	"wm.base.widget.Content",
	"wm.base.widget.Html",
	"wm.base.widget.Bevel",
	"wm.base.widget.Splitter",
	"wm.base.widget.Layers.Decorator",
	"wm.base.widget.Layers.TabsDecorator",
	"wm.base.widget.Layers.AccordionDecorator",
	"wm.base.widget.Layers",
	"wm.base.widget.Button",
	"wm.base.widget.DialogButton",
	"wm.base.widget.Picture",
	"wm.base.widget.Tree",
	"wm.base.widget.Label",
	"wm.base.widget.gadget.Gadget",
	"wm.base.widget.gadget.Stocks",
	"wm.base.widget.gadget.Weather",
	"wm.base.widget.gadget.YouTube",
	"wm.base.widget.PageContainer",
	"wm.base.widget.Table.builder",
	"wm.base.widget.VirtualList",
	"wm.base.widget.List",
	"wm.base.widget.WidgetList",
	"wm.base.widget.FeedList",
	"wm.base.widget.TwitterFeed",
	"wm.base.widget.Detail",
	"wm.base.widget.Form",
	"wm.base.widget.LiveForm",
	"wm.base.widget.LivePanel",
	"wm.base.widget.DataNavigator",
	"wm.base.widget.Input",
	"wm.base.widget.TextArea",
	"wm.base.widget.Select",
	"wm.base.widget.Scrim",
	"wm.base.widget.Dialog",
	"wm.base.widget.Editor",
	"wm.base.widget.Editors.RichText",
	"wm.base.widget.RelatedEditor",
	"wm.base.widget.FileUpload",
	"wm.base.widget.EditArea",
	"wm.base.widget.Popup",
	"wm.base.widget.EditPanel",
	"wm.base.widget.Ticker",
	"wm.base.widget.Composite",
	"wm.base.widget.Cards",
	// Dijits
	"wm.base.widget.dijit.Dijit",
	"wm.base.widget.dijit.CheckBox",
	"wm.base.widget.dijit.Calendar",
	"wm.base.widget.dijit.ProgressBar",
	// dojo firebug debugger
	//"dojo._firebug.firebug",
	// Grid
	"dojo.dnd.common",
	"dojox.grid.compat._grid.selection",
	"dojox.grid.compat.VirtualGrid",
	"dojox.grid.compat.Grid",
	"wm.base.widget.dijit.Grid",
	"wm.base.widget.DataGrid",
	"dojo.data.ItemFileWriteStore",
	"wm.base.widget.Toolbar",
	"wm.base.components.componentList",	

	"wm.base.widget.ContextMenuDialog",
	
	// Silverlight for Dojo chart, gfx.
	"wm.base.lib.Silverlight",
	// Ext
	/*
	"wm.base.widget.ext.Ext",
	"wm.base.widget.ext.Toolbar",
	*/
	// Plugins
	//"wm.modules.rbac.RbacPlugin"
	"wm.base.RbacPlugin"
]);
