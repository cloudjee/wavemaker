/*
 *  Copyright (C) 2010 WaveMaker Software, Inc.
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
dojo.provide('wm.base.components.componentList');


/************************************************************************************
 * MICHAEL'S ATTEMPT TO DESCRIBE THIS:
 *
 * Component.js only tries to access this list if the class isn't already loaded.
 * Any class we try to load and is NOT in this list is assumed to be in common/packages.
 * Therefore: any class you load must either already be loaded or listed here.
 * If that class is NOT a part of any existing layer, then enter in its standard package name
 * so dojo.require can run normally.  Still working out details of how to create new build layers.
 ************************************************************************************/
wm.componentList = {
	'wm.DataGrid': ['build.Gzipped.wm_dojo_grid'],
	'wm.DojoGrid': ['build.Gzipped.wm_dojo_grid', 'wm.base.widget.DojoGrid'],
	'wm.DojoMenu': ['build.Gzipped.wm_menus'],
	'wm.PopupMenu': ['build.Gzipped.wm_menus'],
	'wm.DojoChart': ['build.Gzipped.wm_charts'],
	'wm.Dashboard':['wm.base.widget.Dashboard'],
	'wm.DojoFisheye': ['wm.base.widget.DojoFisheye'],
	'wm.DojoLightbox': ['wm.base.widget.DojoLightbox'],
	'wm.TwitterFeed':['wm.base.widget.TwitterFeed'],
	
	'wm.Tree': ['wm.base.widget.Tree'],
	'wm.PropertyTree': ['wm.base.widget.Tree'],
	'wm.LivePanel': ['wm.base.widget.LivePanel'],
	'wm.EditPanel': ['wm.base.widget.EditPanel'],
	'wm.Gadget': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.YouTube': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.Stocks': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.Weather': ['build.Gzipped.wm_gadgets'],
	'wm.ImageList':['wm.base.components.ImageList'],
	'wm.Splitter': ['wm.base.drag.capture','wm.base.drag.drag','wm.base.widget.Splitter'],
	'wm.DataNavigator':['wm.base.widget.DataNavigator'],
	'wm.RichText':['build.Gzipped.wm_editors','build.Gzipped.wm_richTextEditor'],
	'wm.CheckBoxEditor':['build.Gzipped.wm_editors'],
	'wm.RadioButtonEditor':['build.Gzipped.wm_editors'],
	'wm.SelectEditor':['build.Gzipped.wm_editors'],
	'wm.RelatedEditor':['build.Gzipped.wm_editors'],
	'wm.TextEditor':['build.Gzipped.wm_editors'],
	'wm.SliderEditor':['build.Gzipped.wm_editors'],
	'wm._SliderEditor':['build.Gzipped.wm_editors'],
	'wm.TextAreaEditor':['build.Gzipped.wm_editors'],
	'wm._TextEditor':['build.Gzipped.wm_editors'],
	'wm.CurrencyEditor':['build.Gzipped.wm_editors'],
	'wm.NumberEditor':['build.Gzipped.wm_editors'],
	'wm.Editor':['build.Gzipped.wm_editors'],
	'wm.DateEditor':['build.Gzipped.wm_editors'],
	'wm.TimeEditor':['build.Gzipped.wm_editors'],
	'wm.dijit.ProgressBar':['wm.base.widget.dijit.ProgressBar'],
	'wm.BusyButton':['wm.base.widget.BusyButton'],
	'wm.PopupMenuButton':['wm.base.widget.Button'],
	'wm.JsonStatus':['wm.base.widget.Tree'],
	'wm.Timer':['wm.base.components.Timer'],
	
	'wm.Date':['build.Gzipped.wm_editors'],
	'wm.SelectMenu':['build.Gzipped.wm_editors'],
	'wm.Number':['build.Gzipped.wm_editors'],
	'wm.Checkbox':['build.Gzipped.wm_editors'],
	'wm.RadioButton':['build.Gzipped.wm_editors'],
	'wm.Currency':['build.Gzipped.wm_editors'],
	'wm.Select':['build.Gzipped.wm_editors'],
	'wm.Slider':['build.Gzipped.wm_editors'],
	'wm.Text':['build.Gzipped.wm_editors'],
	'wm.TextArea':['build.Gzipped.wm_editors'],
	'wm.Time':['build.Gzipped.wm_editors'],
	'wm.LargeTextArea':['build.Gzipped.wm_editors'],

	'wm.LiveForm': ['wm.base.widget.LiveForm'],
	'wm.Picture': ["wm.base.widget.Picture"],
	'wm.dijit.Calendar':["wm.base.widget.dijit.Calendar"],
	'wm.Html':['wm.base.widget.Html'],
	'wm.NavigationCall':["wm.base.components.NavigationCall"],
	'wm.Property':["wm.base.components.Property"],
	'wm.ComponentPublisher':["wm.base.components.Publisher"],
	'wm.CompositePublisher':["wm.base.components.Publisher"],
	'wm.TemplatePublisher':["wm.base.components.Publisher"],
	'wm.Composite':['wm.base.widget.Composite'],
	'wm.CompositeMixin':['wm.base.widget.Composite'],
	'wm.Ticker':['wm.base.widget.Ticker'],
	'wm.FileUpload':['wm.base.widget.FileUpload'],
	'wm.DojoFileUpload':['wm.base.widget.DojoFileUpload'],
	'wm.DojoFlashFileUpload':['wm.base.widget.DojoFlashFileUpload'],

	'wm.Popup':['wm.base.widget.Popup'],
	'wm.Service':['wm.base.components.Service'],
	'wm.ServiceCall':['wm.base.components.ServiceCall'],
	'wm.ServiceInput':['wm.base.components.ServiceCall'],
	'wm.FunctionService':['wm.base.components.FunctionService'],
        'wm.List': ['wm.base.widget.List'],
        'wm.WidgetList':['wm.base.widget.WidgetList'],
//	'wm.List':["build.Gzipped.wm_list"],
//	'wm.WidgetList':["build.Gzipped.wm_list"],
	'wm.IFrame':['wm.base.widget.IFrame'],
	'wm.FeedList':['wm.base.widget.FeedList'],
	'wm.ListViewer':['wm.base.widget.ListViewer'],
        "wm.DraggableTree":['wm.base.widget.DraggableTree'],
	
	'wm.LogoutVariable':['wm.base.components.LogoutVariable'],
	'wm.Service':['wm.base.components.Service']
}

wm.getComponentStructure = function(inType){
	//console.info('Loading ' + inType + ' dynamically.');
	var requireList = wm.componentList[inType];

	// if we dont get the require list, then we assume that it is a composite widget 
	// so we will try to load it.
	if (!requireList)
	{
		// this is done for custom widgets.
		if (inType.indexOf('wm.') == 0)
		{
			inType = inType.substring(3);
		}

		var requireList = ['wm.base.widget.Composite', 'wm.packages.' + inType];
		//console.info('Trying to load composite: ' + requireList);
	}

	if (!requireList)
	{
		console.error('Add ' + inType + ' in component list.');
	}
	else
	{
		for (var i = 0; i < requireList.length; i++)
		{
			var relpath = dojo._getModuleSymbols(requireList[i]).join("/") + ".js";
			var uri = ((relpath.charAt(0) == "/" || relpath.match(/^\w+:/)) ? "" : dojo.baseUrl) + relpath;
			wm.dojoScriptLoader(uri);
		}
	}
}

