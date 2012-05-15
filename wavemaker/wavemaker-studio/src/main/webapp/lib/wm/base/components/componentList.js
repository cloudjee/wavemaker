/*
 *  Copyright (C) 2010-2012 VMware, Inc. All rights reserved.
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
        'wm.Content': ['wm.base.widget.Content'],
	'wm.DataGrid': ['build.Gzipped.wm_data_grid'],
	'wm.DojoGrid': ['build.Gzipped.wm_dojo_grid'],
	'wm.DojoMenu': ['build.Gzipped.wm_menus'],
        'wm.PopupMenu': ['build.Gzipped.wm_menus'],
	'wm.DojoChart': ['build.Gzipped.wm_charts'],
	'wm.DojoGauge': ['build.Gzipped.wm_charts'],
	'wm.Dashboard':['build.Gzipped.wm_dashboard'],
	'wm.AccordionLayers':['build.Gzipped.wm_accordion'],
	'wm.WizardLayers':['build.Gzipped.wm_wizardlayer'],
    'wm.ColorPickerDialog': ['build.Gzipped.wm_colorpicker'],
    'wm.ColorPicker': ['build.Gzipped.wm_colorpicker'],
    'wm.RichTextDialog': ['wm.base.widget.Dialogs.RichTextDialog'],
	'wm.DojoFisheye': ['wm.base.widget.DojoFisheye'],
	'wm.DojoLightbox': ['wm.base.widget.DojoLightbox'],
	'wm.TwitterFeed':['wm.base.widget.TwitterFeed'],
        'wm.JsonStatus':['build.Gzipped.wm_editors'],
	'wm.Tree': ['build.Gzipped.wm_trees'],
	'wm.PropertyTree': ['build.Gzipped.wm_trees'],
	'wm.ObjectTree':  ['build.Gzipped.wm_trees'],
        "wm.DraggableTree":  ['build.Gzipped.wm_trees'],
    'wm.Gadget': ["wm.base.widget.gadget.Gadget"],
    'wm.gadget.YouTube': ["wm.base.widget.gadget.YouTube"],
    'wm.gadget.YouTube': ["wm.base.widget.gadget.YouTube"],
	'wm.gadget.FacebookLikeButton':  ["wm.base.widget.gadget.Facebook"],
	'wm.gadget.FacebookActivityFeed': ["wm.base.widget.gadget.Facebook"],
	'wm.gadget.GoogleMap': ["wm.base.widget.gadget.GoogleMap"],
	'wm.gadget.Stocks': ["wm.base.widget.gadget.Stocks"],
	'wm.gadget.Weather': ["wm.base.widget.gadget.Weather"],
	'wm.gadget.TwitterFollowButton': ["wm.base.widget.gadget.TwitterGadgets"],
	'wm.gadget.TwitterTweetButton': ["wm.base.widget.gadget.TwitterGadgets"],
	'wm.gadget.TwitterList': ["wm.base.widget.gadget.TwitterGadgets"],
    
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
        'wm.DateTime':['build.Gzipped.wm_editors', "build.Gzipped.wm_list"],
	'wm.SelectMenu':['build.Gzipped.wm_editors'],
	'wm.Lookup':['build.Gzipped.wm_editors'],
	'wm.FilteringLookup':['build.Gzipped.wm_editors'],
	'wm.CheckboxSet':['build.Gzipped.wm_editors'],
	'wm.RadioSet':['build.Gzipped.wm_editors'],
        'wm.ListSet':['build.Gzipped.wm_editors',"build.Gzipped.wm_list"],
	'wm.Number':['build.Gzipped.wm_editors'],
	'wm.Checkbox':['build.Gzipped.wm_editors'],
	'wm.RadioButton':['build.Gzipped.wm_editors_misc'],
    //'wm.RadioSet':['build.Gzipped.wm_editors_misc'],
	'wm.Currency':['build.Gzipped.wm_editors'],

	'wm.Slider':['build.Gzipped.wm_editors_misc'],
	'wm.Text':['build.Gzipped.wm_editors'],
	'wm.TextArea':['build.Gzipped.wm_editors'],
	'wm.Time':['build.Gzipped.wm_editors'],
	'wm.LargeTextArea':['build.Gzipped.wm_editors'],

	'wm.dijit.Dijit':['wm.base.widget.dijit.Dijit'],
	'wm.dijit.ProgressBar':['build.Gzipped.wm_progressbar'],
	'wm.RoundedButton':['wm.base.widget.Buttons.RoundedButton'],    
	'wm.BusyButton':['wm.base.widget.Buttons.BusyButton'],
	'wm.PopupMenuButton':['build.Gzipped.wm_menus'],
	'wm.ToggleButton':['build.Gzipped.wm_editors'],   // currently in main build
	'wm.ToggleButtonPanel':['build.Gzipped.wm_editors'],// currently in main build
	'wm.Timer':['wm.base.components.Timer'],
	
	/* Old forms and related widgets */
    'wm.SimpleForm': ['build.Gzipped.wm_livepanel'],
    'wm.LiveForm': ['build.Gzipped.wm_livepanel'],
    'wm.RelatedEditor': ['build.Gzipped.wm_livepanel'],
    'wm.LivePanel':  ['build.Gzipped.wm_livepanel'],
    'wm.EditPanel':  ['build.Gzipped.wm_livepanel'],
    'wm.DataNavigator':  ['build.Gzipped.wm_livepanel'],
    'wm.RegularExpressionFormatter': ["wm.base.widget.FormattersMisc"],
    'wm.EvaluationFormatter': ["wm.base.widget.FormattersMisc"],
    'wm.LinkFormatter': ["wm.base.widget.FormattersMisc"],
    'wm.ImageFormatter': ["wm.base.widget.FormattersMisc"],
    /* New Forms */
    'wm.DataForm': ['build.Gzipped.wm_dataform'],
    'wm.FormPanel': ['build.Gzipped.wm_dataform'],
    'wm.SubForm': ['build.Gzipped.wm_dataform'],
    'wm.DBForm': ['build.Gzipped.wm_dataform'],
    'wm.OneToMany': ['wm.compressed.wm_dataform'],
    'wm.ServiceInputForm': ['build.Gzipped.wm_dataform'],
    'wm.ServiceQueue': ['wm.base.components.ServiceQueue'],
	//'wm.Picture': ["wm.base.widget.Picture"],
	'wm.dijit.Calendar':["build.Gzipped.wm_editors"],
	'wm.Template':['wm.base.widget.Template'],

	'wm.ComponentPublisher':["wm.base.components.Publisher"],
	'wm.CompositePublisher':["wm.base.components.Publisher"],
	'wm.TemplatePublisher':["wm.base.components.Publisher"],
	'wm.Composite':['wm.base.widget.Composite'],
	'wm.CompositeMixin':['wm.base.widget.Composite'],
	'wm.Ticker':['wm.base.widget.Ticker'],
	'wm.FileUpload':['wm.base.widget.FileUpload'],
        'wm.DojoFileUpload':['build.Gzipped.wm_fileupload'],
	'wm.DojoFlashFileUpload':['build.Gzipped.wm_fileupload'],
        'wm.DijitDesigner': ["wm.base.widget.dijit.Dijit"],

        //'wm.Popup':['wm.base.widget.Popup'],
	'wm.FunctionService':['wm.base.components.FunctionService'],
	'wm.List':["build.Gzipped.wm_list"],
	'wm.IFrame':['wm.base.widget.IFrame'],
	'wm.FeedList':['wm.base.widget.FeedList'],
	'wm.ListViewer':['wm.base.widget.ListViewer'],
        'wm.PhoneGapService': ['wm.base.components.PhoneGapService'],
	'wm.LogoutVariable':['wm.base.components.LogoutVariable']
}

/* wm.require is the public version of wm.getComponentStructure; inCommon is optional parameter
 * to use when loading a class from the common folder
 */
wm.require = function(inType, inCommon) {
    if (dojo.getObject(inType)) return;
    var requireList = wm.componentList[inType];
    if (requireList || inCommon)
	return wm.getComponentStructure(inType);
    else
	dojo["require"](inType);
}

wm.getComponentStructure = function(inType){
	//console.info('Loading ' + inType + ' dynamically.');
    if (inType == "wm.DojoGrid" && wm.isMobile) {
	inType = "wm.List";
    }
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
		    while (uri.match(/[^\/]\/\.\.\//)) {
			uri = uri.replace(/[^\/]*\/\.\.\/+/,"")
		    }
			wm.dojoScriptLoader(uri);
		    if (wm.componentFixList[requireList[i]]) {
			var fixes = wm.componentFixList[requireList[i]];
			for (var j = 0; j < fixes.length; j++)
			    fixes[j]();
		    }
		}
	}
    if (wm.isMobile && inType == "wm.List") {
	wm.DojoGrid = wm.List;
    }
}

wm.addFrameworkFix = function(className, inFunc) {
    if (djConfig.isDebug && !wm.studioConfig) {
	inFunc();
    } else
	var ctor = dojo.getObject(className);
    if (ctor) {
	inFunc();
    } else if (!wm.componentFixList[className]) {
	wm.componentFixList[className] = [inFunc];
    } else {
	wm.componentFixList[className].push(inFunc);
    }
}

wm.applyFrameworkFixes = function() {
		for (var className in wm.componentFixList) {
		    var ctor = dojo.getObject(className);
		    if (ctor) {
			var classFixes = wm.componentFixList[className];
			for (var i = 0; i < classFixes.length; i++) {
				classFixes[i]();
			}
			delete wm.componentFixList[className];
		    }
		}
}

//wm.loadLib("common." + wm.version.replace(/[^a-zA-Z0-9]/g,"") + "_patches"); moved to Application.js
