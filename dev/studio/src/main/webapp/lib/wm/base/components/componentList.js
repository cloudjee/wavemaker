/*
 *  Copyright (C) 2010-2011 VMware, Inc. All rights reserved.
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
wm.componentFixList = {};
wm.componentList = {
	'wm.DataGrid': ['build.Gzipped.wm_dojo_grid'],
	'wm.DojoGrid': ['build.Gzipped.wm_dojo_grid'],
	'wm.DojoMenu': ['build.Gzipped.wm_menus'],
        'wm.PopupMenu': ['build.Gzipped.wm_menus'],
	'wm.DojoChart': ['build.Gzipped.wm_charts'],
	'wm.DojoGauge': ['build.Gzipped.wm_charts'],
	'wm.Dashboard':['wm.base.widget.Dashboard'],
    'wm.ColorPickerDialog': ['wm.base.widget.Dialogs.ColorPickerDialog'],
	'wm.DojoFisheye': ['wm.base.widget.DojoFisheye'],
	'wm.DojoLightbox': ['wm.base.widget.DojoLightbox'],
	'wm.TwitterFeed':['wm.base.widget.TwitterFeed'],
        'wm.JsonStatus':['build.Gzipped.wm_editors'],
	'wm.Tree': ['wm.base.widget.Trees.Tree'],
	'wm.PropertyTree': ['wm.base.widget.Trees.PropertyTree'],
	'wm.ObjectTree': ['wm.base.widget.Trees.ObjectTree'],
	'wm.Gadget': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.YouTube': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.FacebookLikeButton': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.FacebookActivityFeed': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.GoogleMap': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.Stocks': ['build.Gzipped.wm_gadgets'],
	'wm.gadget.Weather': ['build.Gzipped.wm_gadgets'],
	//'wm.ImageList':['wm.base.components.ImageList'],
	'wm.Splitter': ['wm.base.drag.capture','wm.base.drag.drag','wm.base.widget.Splitter'],

	'wm.RichText':['build.Gzipped.wm_editors','build.Gzipped.wm_richTextEditor'],

	'wm.CheckBoxEditor':['build.Gzipped.wm_editors_old'],
	'wm.RadioButtonEditor':['build.Gzipped.wm_editors_old'],
	'wm.SelectEditor':['build.Gzipped.wm_editors_old'],
	'wm.TextEditor':['build.Gzipped.wm_editors_old'],
	'wm.SliderEditor':['build.Gzipped.wm_editors_old'],
	'wm._SliderEditor':['build.Gzipped.wm_editors_old'],
	'wm.TextAreaEditor':['build.Gzipped.wm_editors_old'],
	'wm._TextEditor':['build.Gzipped.wm_editors_old'],
	'wm.CurrencyEditor':['build.Gzipped.wm_editors_old'],
	'wm.NumberEditor':['build.Gzipped.wm_editors_old'],
	'wm.Editor':['build.Gzipped.wm_editors_old'],
	'wm.DateEditor':['build.Gzipped.wm_editors_old'],
	'wm.TimeEditor':['build.Gzipped.wm_editors_old'],
	'wm.Select':['build.Gzipped.wm_editors_old'],

	'wm.Date':['build.Gzipped.wm_editors'],
	'wm.DateTime':['build.Gzipped.wm_editors'],
	'wm.SelectMenu':['build.Gzipped.wm_editors'],
	'wm.Lookup':['build.Gzipped.wm_editors'],
	'wm.FilteringLookup':['build.Gzipped.wm_editors'],
	'wm.Number':['build.Gzipped.wm_editors'],
	'wm.Checkbox':['build.Gzipped.wm_editors'],
	'wm.RadioButton':['build.Gzipped.wm_editors'],
	'wm.Currency':['build.Gzipped.wm_editors'],

	'wm.Slider':['build.Gzipped.wm_editors'],
	'wm.Text':['build.Gzipped.wm_editors'],
	'wm.TextArea':['build.Gzipped.wm_editors'],
	'wm.Time':['build.Gzipped.wm_editors'],
	'wm.LargeTextArea':['build.Gzipped.wm_editors'],


	'wm.dijit.ProgressBar':['wm.base.widget.dijit.ProgressBar'],
	'wm.RoundedButton':['wm.base.widget.Buttons.RoundedButton'],    
	'wm.BusyButton':['wm.base.widget.Buttons.BusyButton'],
	'wm.PopupMenuButton':['build.Gzipped.wm_menus'],
	'wm.ToggleButton':['build.Gzipped.wm_editors'],
	'wm.Timer':['wm.base.components.Timer'],
	
    'wm.SimpleForm': ['build.Gzipped.wm_livepanel'],
    'wm.LiveForm': ['build.Gzipped.wm_livepanel'],
    'wm.RelatedEditor': ['build.Gzipped.wm_livepanel'],
    'wm.LivePanel':  ['build.Gzipped.wm_livepanel'],
    'wm.EditPanel':  ['build.Gzipped.wm_livepanel'],
	'wm.DataNavigator':  ['build.Gzipped.wm_livepanel'],


	//'wm.Picture': ["wm.base.widget.Picture"],
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
        'wm.DijitDesigner': ["wm.base.widget.dijit.Dijit"],

        //'wm.Popup':['wm.base.widget.Popup'],
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

/* wm.require is the public version of wm.getComponentStructure; inCommon is optional parameter
 * to use when loading a class from the common folder
 */
wm.require = function(inType, inCommon) {
    var requireList = wm.componentList[inType];
    if (requireList || inCommon)
	return wm.getComponentStructure(inType);
    else
	dojo["require"](inType);
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
		    if (wm.componentFixList[requireList[i]]) {
			var fixes = wm.componentFixList[requireList[i]];
			for (var j = 0; j < fixes.length; j++)
			    fixes[j]();
		    }
		}
	}
}

wm.addFrameworkFix = function(gzipName, inFunc) {
    if (djConfig.isDebug && !wm.studioConfig) {
	inFunc();
    } else if (!wm.componentFixList[gzipName]) {
	wm.componentFixList[gzipName] = [inFunc];
    } else {
	wm.componentFixList[gzipName].push(inFunc);
    }
}

wm.applyFrameworkFixes = function() {
    for (var packageName in wm.componentFixList) {
	var packageFixes = wm.componentFixList[packageName];
	for (var i = 0; i < packageFixes.length; i++) {
	    packageFixes[i]();
	}
    }
}

wm.loadLib("common." + wm.version.replace(/[^a-zA-Z0-9]/g,"") + "_patches");
