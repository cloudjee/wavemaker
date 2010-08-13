/*
 * Copyright (C) 2010 WaveMaker Software, Inc.
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

/* TODO:
 * 1. Some things may need resizing when font and border sizes are changed; accordion headers, tabs and other non-resizable elements
 * 2. DojoGrid, selected cell gets highlighted blue border; must stop that!
 * 3. Page settings for border don't seem like they are such a good idea...
 * 4. Advanced settings for border and prototype settings for border aren't finding values set by each other.
 * 5. Content Panels borderColor doesn't work
 * 6. Need editor colors in basic, or some nice guesses

 * 2. Create more themes (found http://colorschemedesigner.com useful; mono and analogic settings were both good)
 */

dojo.provide("wm.studio.pages.ThemeDesigner.ThemeDesigner");





dojo.declare("ThemeDesigner", wm.Page, {
    userLevel: 0,
    currentTheme: "",

    /* themeTypes provides the editor to use when editting somethign with the given name.
     * Note: Don't yet support putting event handlers in here so don't try it without fixing that 
     */
    themeTypes: {"Family": ["wm.SelectMenu", {options: "Lucida Grande, Lucida Sans, Arial, Verdana, Arial, sans-serif, serif", width: "80px"}],
                 "Weight": ["wm.SelectMenu", {options: "normal, bold", width: "80px"}],
                 "TextSize": ["wm.Number",  { width: "80px"}],
                 "Color": ["wm.ColorPicker", {width: "80px"}],
                 "Shadow": ["wm.SelectMenu", {dataField: "dataValue", displayValue: "name", allowNone: true, width: "80px"},{},{
                     binding: ["wm.Binding", {},{},{
                         wire: ["wm.Wire", {targetProperty: "dataSet", source: "shadowListVar"}]
                     }]
                 }],
                 "BorderSize": ["wm.Text", {regExp: "\\d+(\\s*,\\s*\\d+){0,3}", width: "80px"}], 
                 "Radius": ["wm.Number", {minimum: 0, maximum: 24, width: "80px"}],
                 "Margin": ["wm.Number",  { width: "80px"}],
                 "Image": ["wm.SelectMenu", {dataField: "dataValue", displayValue: "name", width: "120px"},{},{
                     binding: ["wm.Binding", {},{},{
                         wire: ["wm.Wire", {targetProperty: "dataSet", source: "imageListVar"}]
                     }]
                 }]
                },

    /* themeGroupType indicates how to edit a Font, Border or other higher level styling concept.
     * To restrict to editting only a single property within the styling concept, you can use
     * Font-Family or Border-Color, or any groupName-styleName.
     */
    themeGroupTypes: {"Font": ["Family", "Weight", "TextSize", "Color"],
                      "Border": ["BorderSize", "Color"],
                      "BorderStyle": ["Radius", "Shadow"],
                      "Background": ["Color", "Image"]},

    /* Each entry in themeGroupData represents a styling group that the user can select and access all of the editors
     * for that group.  Each group element is hash consisting of:
     * demo: The name of the widgets_js structure that should be shown when the user is editting this group
     * styles: A list of style names that the user will edit; names taken from themeGroupTypes
     * borders: Optional array of borders that will be updated when/if the user changes a Border-BorderSize or Border-Color property
     */
    themeGroupData: {
        "Common": {
	    demo: "themeGroupDemoHeaderWidgets",
            styles: ["Editor_BorderStyle-Radius", "Panel_Border", "Panel_BorderStyle-Radius"],
	    borders: [{borderClass: "wm.TabLayers", borderProperty: "clientBorder"},
			      {borderClass: "wm.AccordionLayers", borderProperty: "layerBorder", borderColorProperty: "borderColor"},
			      {borderClass: "wm.WizardLayers", borderProperty: "clientBorder"},
			      {borderClass: "wm.Dialog", borderProperty: "border"},
			      {borderClass: "wm.FancyPanel", borderProperty: "innerBorder"}
			     ]},
        "Document": {
	    subcategories: {
		"Styles": {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles: ["Font", "Border", "BorderStyle", "Background"],
		    borders: [{borderClass: "wm.Layout", borderProperty: "border"}]},
		"HeadersDefault": {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles: ["Font", "Border-BorderSize", "BorderStyle", "Background"],
		    borders: [{borderClass: "wm.Button", borderProperty: "border"},
			      {borderClass: "wm.ToggleButton", borderProperty: "border"},
			      {borderClass: "wm.RoundedButton", borderProperty: "border"},
			      {borderClass: "wm.BusyButton", borderProperty: "border"},
			      {borderClass: "wm.AccordionDecorator", borderProperty: "captionBorder"},

			      {borderClass: "wm.Dialog", borderProperty: "titlebarBorder", borderTemplate: "0,0,?,0"},
			      {borderClass: "wm.GenericDialog", borderProperty: "footerBorder", borderTemplate: "?,0,0,0"},
			      {borderClass: "wm.RichTextDialog", borderProperty: "footerBorder", borderTemplate: "?,0,0,0"},
			      {borderClass: "wm.PageDialog", borderProperty: "footerBorder", borderTemplate: "?,0,0,0"}
			     ]},               
		"HeadersHover":   {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"HeadersActive":  {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},

		"EditorsDefault": {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles:     ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles:     ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
		    demo: "themeGroupDemoDocumentWidgets",
		    styles:     ["Border-Color", "Background", "Font-Color"]}}},
	

        "PageContent":  {
	    subcategories: {
		"Styles": {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Font", "Background"]},
		"HeadersDefault": {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Font", "BorderStyle", "Background"]},               
		"HeadersHover":   {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"HeadersActive":  {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},

		/* For Editors, the border in question is for the dijit (css) not the widget (border property) */
		"EditorsDefault": {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
		    demo: "themeGroupDemoPageAndEditorWidgets",
		    styles: ["Border-Color", "Background", "Font-Color"]}}},
		

        "ContentPanel":  {
	    subcategories: {
		"Styles": {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Font", "Background"]},
		"HeadersDefault": {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Font", "BorderStyle", "Background"]},               
		"HeadersHover":   {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"HeadersActive":  {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"EditorsDefault": {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
		    demo: "themeGroupDemoContentPanelWidgets",
		    styles: ["Border-Color", "Background", "Font-Color"]}
	    }
	},


        /* Table row/cell borders are handled by css, not properties */
        "Tables": {
	    subcategories: {
		"EvenRows": {
		    demo: "themeGroupDemoHeaderWidgets",
		    styles: ["Font", "Background", "Border-Color"]},
		"OddRows":   {
		    demo: "themeGroupDemoHeaderWidgets",
		    styles: ["Font-Color", "Background"]}}}
    },


    start: function() {
        window.setTimeout(function() {
            app.toastWarning("We recommend saving a copy of your project before you start tinkering with themes as there may be side effects");
        }, 1000);

        // Get the themes list from studio
        var data = this.owner.owner.themesListVar.getData();
        for (var i = 0; i < data.length; i++) {
            if (data[i].dataValue == "wm_notheme") {
                data.splice(i,1);
                break;
            }
        }
        this.themeListVar.setDataSet(data);

        // Read in packages.js for a list of widgets that the user can edit when in "control freak" mode
        this.initWidgetList();

        this.initThemeGroupList();

        // Select the theme in use by the user's application
        var listitem = this.themeList.getItemByFieldName("dataValue", studio.application.theme);
        this.themeList.eventSelect(listitem);
    },

    initThemeGroupList: function() {
            var groupList = [];
            for (var i in this.themeGroupData) {
		var checkbox = (i == "ContentPanel" || i == "PageContent") ? "<input type='checkbox' name='" + i + "' id='" + i +"Enabled' />" : "";
                groupList.push({dataValue: i,
                                name: checkbox + i.replace(/-/g," ")});
            }
            this.themeGroupListVar.setData(groupList);
	    var inputs = this.themeGroupList.domNode.getElementsByTagName("input");
	dojo.forEach(inputs, dojo.hitch(this,function(input) {
		dojo.connect(input, "onchange", this, function(e) {
		    dojo.stopEvent(e);
		    this.setSectionEnabled(input.id.replace(/Enabled/,""), input.checked);
/*
		    this.themeData[input.id + "-Enabled"] = input.checked;
		    this.cssText = this.cssText.replace(/(\@media )(screen|disabled)/, "$1" + ((input.checked) ? "screen" : "disabled"));
		    studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
		    */
		});
	}));
    },

    // Populate this.widgetListVar
    initWidgetList: function() {
        if (!this.widgetListVar.getData()) {
            var widgetList = [];
            // sync request
            loadData(dojo.moduleUrl("wm.studio.app") + "packages.js", dojo.hitch(this, function(d) {
                var list = eval("[" + d + "]");
                for (var i = 0; i < list.length; i++) {
                var cl = list[i][2];
                    if (dojo.getObject(cl).prototype.themeable) {
                        widgetList.push({dataValue: cl});
                    }
                }
                this.widgetListVar.setData(widgetList);
            }));
        }
    },

    /* When a theme is selected, load in the theme data, and either reselect the current difficulty list
     * item or select basic if no current selection 
     */
    themeselect: function(inSender) {
        /* Step 1: Find out what theme was selected! */
        this.currentTheme = inSender.selectedItem.getData().dataValue;

        /* Step 2: Set the class of the demo panel to the new theme so the demo widgets will get the proper classpath */
        this.demoPanelOuter.domNode.className = this.currentTheme;

        /* Step 3: Get a list of images available for this theme so they're avialable for image pulldown menus */
	var path;
        var result = studio.deploymentService.requestSync("listThemeImages", [this.currentTheme]).results[0];
        var imageList = [{name: "none", dataValue: "no-repeat,top left,none"}];
        dojo.forEach(result, function(image) {
            var im = image.replace(/^.*\//,"").replace(/\)/,"");
            imageList.push({name: im, dataValue: image});
        });
        this.imageListVar.setData(imageList);

        /* Step 4: Find the path to the theme folder */
	if (this.currentTheme.match(/^wm_/))
	    path = dojo.moduleUrl("wm") + "base/widget/themes/" + this.currentTheme + "/";
	else
	    path = dojo.moduleUrl("common") + "themes/" + this.currentTheme + "/";

        /* Step 5: Load the theme.css file and store it in this.cssText, and load the css so it affects the demo panel */
	var originalCssText =  dojo.xhrGet({url:path + "theme.css", sync:true, preventCache:true}).results[0];
	var templateCssText =  "";
	var stylesheets = ["theme.css", "buttons.css", "calendar.css", "dialog.css", "editors.css", "grid.css", "menus.css", "panels.css", "progressbar.css", "splitterbevel.css"];
	for (var i = 0; i < stylesheets.length; i++) {
	    templateCssText += dojo.xhrGet({url:dojo.moduleUrl("wm.studio.app") + "templates/themes/" + stylesheets[i], sync:true, preventCache:true}).results[0];
	}
    
        templateCssText = templateCssText.replace(/\.wm_template/g, "." + this.currentTheme);
        this.cssText = templateCssText;
    
        /* Step 6: Load the themedescriptor file and store it in this.themeData */
	this.themeData =  dojo.fromJson(dojo.xhrGet({url:path + "themedescriptor.json", sync:true, preventCache:true}).results[0]);

        /* Step 7: Copy the style description into the this.cssText */
        var lines =this.cssText.match(/.*\S.*/g);
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            var results = l.match(/(.*?)\:(.*?)(\s+\!important)?;\s*\/\* (\S+?)_(\S+) \*\//);
            if (results) {

                // results[1]: css styletag: background-color
                // results[2]: value that we're going to replace "#000000"
                // results[3]: !important?
                // results[4]: Style group name "Header"
                // results[5]: Style symbol "Background-Color"
                var group = this.themeData[results[4]];
                if (group) {
                    var styleValue = group[results[5]];
                    var important = (results[3]) ? " !important" : ""
                    if (styleValue)
                        lines[i] = results[1] + ": " + styleValue + important + "; /* " + results[4] + "_" + results[5] + " */";
                } 
            }
        }
        this.cssText = lines.join("\n");

	/* this.cssText must be set before calling these */
	this.setSectionEnabled("PageContent", this.themeData["PageContent-Enabled"]);
	this.setSectionEnabled("ContentPanel", this.themeData["ContentPanel-Enabled"]);
	dojo.byId("ContentPanelEnabled").checked = this.themeData["ContentPanel-Enabled"];
	dojo.byId("PageContentEnabled").checked = this.themeData["PageContent-Enabled"];    
	    
        /* Step 8: Load the Theme.js file and store it in this.themePrototype */
	this.themePrototype =  dojo.fromJson(dojo.xhrGet({url:path + "Theme.js", sync:true, preventCache:true}).results[0]);
        for (var i in this.themePrototype) {
	    var propHash = this.themePrototype[i];
	    var prototype = dojo.getObject(i).prototype;
	    for (var j in propHash) {
		console.log("SET " + i + "." + j + ": " + propHash[j]);
		prototype[j] = propHash[j];
	    }
	}
	    
        /* Step 8: Load the new css values into the document */
            studio.application.setTheme(this.currentTheme, false, this.cssText, this.themePrototype, true);
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
        studio.application.cacheWidgets();
        this.setDirty(false);

	if (this.currentTheme.match(/^wm_/)) {
            this.userLevelListPanel.hide();
            this.themeGroupListPanel.hide();
            this.themeSubGroupListPanel.hide();
            this.widgetListPanel.hide();
            this.widgetEditPanel.removeAllControls();
            var label = new wm.Label({owner: this, parent: this.widgetEditPanel, caption: "To edit this theme click copy, and edit your local copy of the theme", width: "100%", height: "50px"});
            this.widgetEditPanel.reflow();
            this.regenerateDemoPanel();            
        } else {
            if (!this.userLevelListPanel.showing) {
                this.userLevelListPanel.show();
            }

            /* Step 9: Make sure the theme group list has something selected so that the user can see a response to their theme selection */
            this.userLevelList.eventSelect((this.userLevelList.selectedItem.getData()) ? this.userLevelList.items[this.userLevelList.getSelectedIndex()] : this.userLevelList.items[0]);
        }
    },

    difficultySelect: function(inSender) {
        var index = this.userLevelList.getSelectedIndex();
        if (index <= 0) {       
            /* Basic difficulty: hide the extra lists in case they are showing, adjust the width to use the extra space, 
             * and call generateBasicEditor 
             */
            this.themeGroupListPanel.hide();
            this.themeSubGroupListPanel.hide();
            this.widgetListPanel.hide();
            //this.themeGroupListPanel.parent.setWidth("250px");
            this.generateBasicEditor();
            this.regenerateDemoPanel(this.themeGroupDemoHeaderWidgets);
        } else if (index == this.userLevelList.getCount()-1) {
            /* Highest difficulty: show  the widget list in case its hidden, adjust the width, 
             * and fire off a select event on the widget list, reselecting the current item or selecting the first item
             */
            this.widgetListPanel.show();
            this.themeGroupListPanel.hide();            
            this.themeSubGroupListPanel.hide();
            //this.themeGroupListPanel.parent.setWidth("450px");
            var item;
            if (this.widgetList.selectedItem.getData()) 
                item = this.widgetList.items[this.widgetList.getSelectedIndex()] ;
            else
                item = this.widgetList.items[0];
            this.widgetList.eventSelect(item);
        } else {       
            /* Medium difficulty: show  the theme group list in case its hidden, adjust the width, 
             * and fire off a select event on the theme group list, reselecting the current item or selecting the first item
             */
            this.widgetListPanel.hide();
            this.themeGroupListPanel.show();
            this.themeSubGroupListPanel.hide();
            //this.themeGroupListPanel.parent.setWidth("450px");
            var selectedThemeIndex = this.themeGroupList.getSelectedIndex();
            if (selectedThemeIndex < 0) selectedThemeIndex = 0;
	    this.themeGroupList.eventSelect( this.themeGroupList.items[selectedThemeIndex]);
            this.regenerateDemoPanel();
        }
    },

    /* Generate the editors/panels for accessing the basic settings */
    generateBasicEditor: function() {
        this.widgetEditPanel.removeAllControls();

                    var props = {captionSize: "15px", 
                                 captionPosition: "bottom",
                                 captionAlign: "left",
                                 width: "100%",
                                 height: "100%",
                                 readonly: Boolean(this.currentTheme.match(/^wm_/))};


        new wm.Label({name: "editorsHeading", caption: "Primary Colors", width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});

        var container;
        var editors = [];
        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left", margin: "0,0,15,0"});
        new wm.Label({caption: "Border",
                      width: "75px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "borderColor",
                                         captionSize: "15px",
                                         caption: "Color",
                                         captionPosition: "bottom",
                                         dataValue: wm.FancyPanel.prototype.borderColor,
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "borderRadius",
                                         captionSize: "15px",
                                         caption: "Radius",
                                         captionPosition: "bottom",
                                    dataValue: this.getThemeDataValue("Document-HeadersDefault-BorderStyle", "Radius","0px").replace(/\D/g,""),
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "borderWidth",
                                    captionSize: "15px",
                                    caption: "Width",
                                    captionPosition: "bottom",
                                    dataValue:  wm.FancyPanel.prototype.innerBorder,
                                    width: "100px",
                                    height: "100%",
                                    owner: this,
                                    parent: container,
                                    readonly: Boolean(this.currentTheme.match(/^wm_/))}));


        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left", margin: "0,0,15,0"});
        new wm.Label({caption: "Page Style",
                      width: "75px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "pageBackgroundColor",
                                         captionSize: "15px",
                                         caption: "Background",
                                         captionPosition: "bottom",
                                         dataValue: this.getThemeDataValue("Document-Styles-Background", "Color","#FFFFFF"),
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.ColorPicker({name: "pageFontColor",
                                         captionSize: "15px",
                                         caption: "Font Color",
                                         captionPosition: "bottom",
                                         dataValue: this.getThemeDataValue("Document-Styles-Font", "Color","#000000"),
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));


        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left", margin: "0,0,15,0"});
        new wm.Label({caption: "Header Style",
                      width: "75px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "headerBackgroundColor",
                                         captionSize: "15px",
                                         caption: "Background Color",
                                         captionPosition: "bottom",
                                         dataValue: this.getThemeDataValue("Document-HeadersDefault-Background", "Color","#555555"),
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));
        var widget_json = this.themeTypes["Image"];
        var val = 
            this.getThemeDataValue("Document-HeadersDefault-Background", "Image-Repeat") + "," +
            this.getThemeDataValue("Document-HeadersDefault-Background", "Image-Position") + "," +
            this.getThemeDataValue("Document-HeadersDefault-Background", "Image");
        var imageSelect = container.createComponent("headerImage",
						    widget_json[0], 
						    dojo.mixin({caption: "Header Image", 
                                                                dataValue: val}, dojo.mixin(props, widget_json[1])),
						    {},
						    widget_json[3], this);

	editors.push(imageSelect);
        var val =  this.getThemeDataValue("Document-HeadersDefault-Font", "Color","#FFFFFF");
        editors.push(new wm.ColorPicker({name: "headerFontColor",
                                         captionSize: "15px",
                                         caption: "Font Color",
                                         captionPosition: "bottom",
                                         dataValue: val,
                                         width: "100px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        dojo.forEach(editors, dojo.hitch(this, function(e) {
            var originalValue = e.getDataValue();
            var hasChanged = false;
            e.connect(e,"onchange", this, function(inValue) {
/*
                if (originalValue != inValue)
                    hasChanged = true;
                if (hasChanged)
		*/
                    this.basicEditorChange(e);
            })}));

        this.createSaveThemeButtonPanel();
        this.widgetEditPanel.reflow();                    
    },

    /* Handle changes to the basic settings editors */
    basicEditorChange: function(inSender) {
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
        studio.application.cacheWidgets();
        this.setDirty(true);

        var value = inSender.getDataValue();
        var name = inSender.name;
        switch(name) {
        case "borderColor":
            this.editAllBorderColors(value);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            this.regenerateDemoPanel();
            return;
        case "borderWidth":
            var borders = [];
            var borders1 = this.themeGroupData.Document.subcategories.HeadersDefault.borders;
            var borders2 = this.themeGroupData.Common.borders;
            
            for (var i = 0; i < borders1.length; i++) borders.push(borders1[i]);
            for (var i = 0; i < borders2.length; i++) borders.push(borders2[i]);
            for (var i = 0; i < borders.length; i++) {
                var widgetClassName = borders[i].borderClass;
                var borderProperty = borders[i].borderProperty;
                var borderTemplate = borders[i].borderTemplate;
                var newValue = (borderTemplate && borderProperty.match(/border$/i)) ? borderTemplate.replace(/\?/g, value) : value;
                if (!this.themePrototype[widgetClassName]) 
                    this.themePrototype[widgetClassName] = {};
                this.themePrototype[widgetClassName][borderProperty] = newValue;
                var ctor = dojo.getObject(widgetClassName);
                if (ctor && ctor.prototype) {
                    ctor.prototype[borderProperty] = newValue;
                }
            }

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            this.regenerateDemoPanel();
            return;
        case "borderRadius":
            var newValue = value + "px";
	    this.setCssSymbol("Common-Panel_BorderStyle", "Radius", newValue);
	    this.setCssSymbol("Document-HeadersDefault-BorderStyle", "Radius",newValue);
	    this.setCssSymbol("PageContent-HeadersDefault-BorderStyle", "Radius",newValue);
	    this.setCssSymbol("ContentPanel-HeadersDefault-BorderStyle", "Radius",newValue);

            newValue = Math.floor(value * 0.6) + "px";
            

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            
            return;
        case "headerBackgroundColor":
	    this.setCssSymbol("Document-HeadersDefault-Background", "Color", value);
	    this.setCssSymbol("PageContent-HeadersDefault-Background", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Background", "Color", value);
            var newvalues = this.offsetColor(value);
	    this.setCssSymbol("Document-HeadersHover-Background", "Color", newvalues[0]);
	    this.setCssSymbol("Document-HeadersActive-Background", "Color", newvalues[2]);
	    this.setCssSymbol("PageContent-HeadersHover-Background", "Color", newvalues[0]);
	    this.setCssSymbol("PageContent-HeadersActive-Background", "Color", newvalues[2]);
	    this.setCssSymbol("ContentPanel-HeadersHover-Background", "Color", newvalues[0]);
	    this.setCssSymbol("ContentPanel-HeadersActive-Background", "Color", newvalues[2]);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;
        case "headerFontColor":
	    this.setCssSymbol("Document-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersActive-Font", "Color", value);
	    this.setCssSymbol("PageContent-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("PageContent-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("PageContent-HeadersActive-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersActive-Font", "Color", value)

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;
        case "headerImage":
            var url = "none";
            var position = "top left";
            var repeat = "no-repeat";
            if (value) {
                var imageMatches = value.match(/[^,]+/g);
                repeat = imageMatches[0];
                position = imageMatches[1];
                url = imageMatches[2];
            }

	    this.setCssSymbol("Document-HeadersDefault-Background", "Image", url);
	    this.setCssSymbol("Document-HeadersDefault-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Document-HeadersDefault-Background", "Image-Position", position);
	    this.setCssSymbol("PageContent-HeadersDefault-Background", "Image", url);
	    this.setCssSymbol("PageContent-HeadersDefault-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("PageContent-HeadersDefault-Background", "Image-Position", position);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Background", "Image", url);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Background", "Image-Position", position);
	    if  (url.match(/\d/)) {
		var numb = parseInt(url.match(/\d/)[0]);
		if (numb > 0) {
		    numb--;
		    url = url.replace(/\d/, numb);
		}
	    }
	    

	    this.setCssSymbol("Document-HeadersHover-Background", "Image", url);
	    this.setCssSymbol("Document-HeadersHover-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Document-HeadersHover-Background", "Image-Position", position);
	    this.setCssSymbol("PageContent-HeadersHover-Background", "Image", url);
	    this.setCssSymbol("PageContent-HeadersHover-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("PageContent-HeadersHover-Background", "Image-Position", position);
	    this.setCssSymbol("ContentPanel-HeadersHover-Background", "Image", url);
	    this.setCssSymbol("ContentPanel-HeadersHover-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("ContentPanel-HeadersHover-Background", "Image-Position", position);

	    if  (url.match(/\d/)) {
		var numb = parseInt(url.match(/\d/)[0]);
		if (numb > 0) {
		    numb--;
		    url = url.replace(/\d/, numb);
		}
	    }

	    this.setCssSymbol("Document-HeadersActive-Background", "Image", url);
	    this.setCssSymbol("Document-HeadersActive-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Document-HeadersActive-Background", "Image-Position", position);
	    this.setCssSymbol("PageContent-HeadersActive-Background", "Image", url);
	    this.setCssSymbol("PageContent-HeadersActive-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("PageContent-HeadersActive-Background", "Image-Position", position);
	    this.setCssSymbol("ContentPanel-HeadersActive-Background", "Image", url);
	    this.setCssSymbol("ContentPanel-HeadersActive-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("ContentPanel-HeadersActive-Background", "Image-Position", position);


            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;

        case "headerFontColor":

	    this.setCssSymbol("Document-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersActive-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("Document-HeadersActive-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersDefault-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersHover-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-HeadersActive-Font", "Color", value);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;

        case "pageBackgroundColor":
	    this.setCssSymbol("Document-Styles-Background", "Color", value);
	    this.setCssSymbol("PageContent-Styles-Background", "Color", value);
	    this.setCssSymbol("ContentPanel-Styles-Background", "Color", value);
            var newvalues = this.offsetColor(value);
	    this.setCssSymbol("ContentPanel-EditorsDefault-Background", "Color", newvalues[0]);
	    this.setCssSymbol("ContentPanel-EditorsHover-Background", "Color", newvalues[1]);
	    this.setCssSymbol("ContentPanel-EditorsFocus-Background", "Color", "#FFFFFF");
	    this.setCssSymbol("PageContent-EditorsDefault-Background", "Color", newvalues[0]);
	    this.setCssSymbol("PageContent-EditorsHover-Background", "Color", newvalues[1]);
	    this.setCssSymbol("PageContent-EditorsFocus-Background", "Color", "#FFFFFF");
	    this.setCssSymbol("Document-EditorsDefault-Background", "Color", newvalues[0]);
	    this.setCssSymbol("Document-EditorsHover-Background", "Color", newvalues[1]);
	    this.setCssSymbol("Document-EditorsFocus-Background", "Color", "#FFFFFF");
	    this.setCssSymbol("Tables-EvenRow-Background", "Color", value);
	    this.setCssSymbol("Table-OddRow-Background", "Color", newvalues[0]);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;
        case "pageFontColor":
	    this.setCssSymbol("Document-Styles-Font", "Color", value);
	    this.setCssSymbol("PageContent-Styles-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-Styles-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-EditorsDefault-Font", "Color", value);
	    this.setCssSymbol("ContentPanel-EditorsHover-Font", "Color", value);
	    this.setCssSymbol("PageContent-EditorsFocus-Font", "Color", "#000000");
	    this.setCssSymbol("PageContent-EditorsDefault-Font", "Color", value);
	    this.setCssSymbol("PageContent-EditorsHover-Font", "Color", value);
	    this.setCssSymbol("PageContent-EditorsFocus-Font", "Color", "#000000");
	    this.setCssSymbol("Document-Editors-Default-Font", "Color", value);
	    this.setCssSymbol("Document-Editors-Hover-Font", "Color", value);
	    this.setCssSymbol("Document-Editors-Focus-Font", "Color", "#000000");
	    this.setCssSymbol("Table-EvenRow-Font", "Color", value);
	    this.setCssSymbol("Table-OddRow-Font", "Color", value);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            return;
        }
    },

    themegroupselect: function(inSender) {
        this.widgetEditPanel.removeAllControls();

        var groupName = inSender.selectedItem.getData().dataValue;
	var fullGroupName = groupName;
	var groupObj = (inSender == this.themeGroupList) ? this.themeGroupData[groupName] : this.themeGroupData[this.themeGroupList.selectedItem.getData().dataValue].subcategories[groupName];


        var subcategories = groupObj.subcategories;
	if (subcategories) {
            var selectedSubGroupIndex = this.themeSubGroupList.getSelectedIndex();
            if (selectedSubGroupIndex < 0 || this.themeGroupList.getSelectedIndex() != this.themeSubGroupListCurrentGroup) selectedSubGroupIndex = 0;
            var subgroupList = [];
            for (var i in subcategories) {
		subcategories[i].parentName = this.themeGroupList.selectedItem.getData().dataValue;
                subgroupList.push({dataValue: i,
                                name: i.replace(/-/g," ")});
            }	    
	    this.themeSubGroupListVar.setData(subgroupList);
            this.themeSubGroupList.eventSelect( this.themeSubGroupList.items[selectedSubGroupIndex]);
            this.themeSubGroupListPanel.show();
	    this.themeSubGroupListCurrentGroup = this.themeGroupList.getSelectedIndex();

            if (this.themeSubGroupList.getSelectedIndex() < 0) { 
		this.themeSubGroupList.eventSelect( this.themeSubGroupList.items[0]);
	    }
	    return;
	} 

	if (this._lastDemoPanel != groupObj.demo) {	    
           this.regenerateDemoPanel(this[groupObj.demo]);
	    this._lastDemoPanel = groupObj.demo;
	}

	if (inSender != this.themeSubGroupList)
            this.themeSubGroupListPanel.hide();
	else
	    fullGroupName = groupObj.parentName +"-" + groupName;

        new wm.Label({name: "editorsHeading", caption: fullGroupName, width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});

        var styleGroupList = groupObj.styles;
        for (var j = 0; j < styleGroupList.length; j++) {
            var subGroupName = styleGroupList[j];
            var styleFilter = "";
            if (subGroupName.indexOf("-") != -1) {
                styleFilter = subGroupName.substring(1 + subGroupName.indexOf("-"));
                subGroupName = subGroupName.substring(0, subGroupName.indexOf("-"));
            }
            var styleList = this.themeGroupTypes[subGroupName.replace(/^.*_/,"")];

            var container = new wm.Panel({layoutKind: "left-to-right", height: "50px", margin: "0,0,15,0", width: "100%", parent: this.widgetEditPanel, owner: this});
            new wm.Label({width: "110px", height: "100%", caption: subGroupName, parent: container, owner: this});
            dojo.forEach(styleList, dojo.hitch(this, function(styleName) {
                if (!styleFilter || styleFilter == styleName) {
                    var value;
                    if (styleName == "Image") {
                        value = this.getThemeDataValue((groupObj.styleName || fullGroupName) + "-" + subGroupName, "Image-Repeat","") + "," +
                            this.getThemeDataValue((groupObj.styleName || fullGroupName) + "-" + subGroupName, "Image-Position","") + "," +
                            this.getThemeDataValue((groupObj.styleName || fullGroupName) + "-" + subGroupName, "Image","");
                    } else {
                         value = this.getThemeDataValue((groupObj.styleName || fullGroupName) + "-" + subGroupName, styleName,"");
                    }
                    if (styleName != "Shadow" && dojo.isString(value))
                        value = value.replace(/(px|pt)/g,"");
                    var props = {captionSize: "15px", 
                                 captionPosition: "bottom",
                                 caption: styleName, 
                                 captionAlign: "left",
                                 dataValue: value,
                                 width: "100%",
                                 height: "100%",
                                 readonly: Boolean(this.currentTheme.match(/^wm_/))};
                    var widget_json = this.themeTypes[styleName];

                    var e = 
                        container.createComponent((groupObj.styleName || fullGroupName) + "_" + subGroupName + "_" + styleName, 
                                                  widget_json[0], 
                                                  dojo.mixin(props, widget_json[1]),
                                                  {},//{"onchange": "advancedEditorChange"}, 
                                                  widget_json[3], this);

                    var originalValue = e.getDataValue();
                    var hasChanged = false;
                    e.connect(e,"onchange", this, function(inValue) {
/*
                        if (originalValue != inValue)
                            hasChanged = true;
                        if (hasChanged)
			*/
                            this.advancedEditorChange(e);
                    });

                }
            }));
        }

        var buttonpanel = this.createSaveThemeButtonPanel();

	var selectedLevel = this.themeGroupList.selectedItem.getData().dataValue;
	if (selectedLevel == "ContentPanel" || selectedLevel == "PageContent") {
	    var copyButton = new wm.Button({_classes: {domNode: ["themeButton"]}, owner: this, parent: buttonpanel, caption: "Copy " + (selectedLevel == "PageContent" ? "Document" : "PageContent") + " Settings", width: "100px", height: "100%",disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
	    copyButton.connect(copyButton, "onclick", this, "copy" + (selectedLevel == "PageContent" ? "Document" : "PageContent") + "Settings");
	}

        wm.onidle(this.widgetEditPanel,"reflow");
    },
    copyPageContentSettings: function() {
	var name = this.themeSubGroupList.selectedItem.getData().dataValue;
	var data = this.themeData;
	for (var i in data) {
	    var items = i.split("-");
	    var group = items.shift();
	    if (group == "PageContent" && items[0] == name) {
		for (var j in data[i]) {
		    this.setCssSymbol("ContentPanel-" + items.join("-"), j,data[i][j]);
		}
	    }
	}
	this.themegroupselect(this.themeSubGroupList); // regenerate the editors with new values -- could just call setDataValue
        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
    },
    copyDocumentSettings: function() {
	var name = this.themeSubGroupList.selectedItem.getData().dataValue;
	var data = this.themeData;
	for (var i in data) {
	    var items = i.split("-");
	    var group = items.shift();
	    if (group == "Document" && items[0] == name) {
		for (var j in data[i]) {
		    this.setCssSymbol("PageContent-" + items.join("-"), j,data[i][j]);
		}
	    }
	}
	this.themegroupselect(this.themeSubGroupList); // regenerate the editors with new values -- could just call setDataValue
        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
    },
    advancedEditorChange: function(inSender) {
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
        studio.application.cacheWidgets();
        this.setDirty(true);

        var value = inSender.getDataValue();

        var name = inSender.name;
        var matches = name.match(/[^_]*_?/g);
	if (!matches[matches.length-1]) matches.pop();
        var groupName = matches[0].replace(/_$/,"");
	var subGroupName = "";
	while(matches.length > 2) {
            subGroupName += matches[1];
	    matches.splice(1,1);
	}
	subGroupName = subGroupName.replace(/_$/,"");
        var styleName = matches[1].replace(/_$/,"");

        if (styleName.match(/(Radius|Margin)$/)) value += "px";
        else if (styleName == "TextSize") value += "pt";


        if (styleName != "Image") {
	    this.setCssSymbol(groupName + "-" + subGroupName, styleName, value);
        } else {
            var url = "none";
            var position = "top left";
            var repeat = "no-repeat";
            if (value) {
                var imageMatches = value.match(/[^,]+/g);
                repeat = imageMatches[0];
                position = imageMatches[1];
                url = imageMatches[2];
            }
	    this.setCssSymbol(groupName + "-" + subGroupName , "Image", url);
	    this.setCssSymbol(groupName + "-" + subGroupName, "Image-Position", position);
	    this.setCssSymbol(groupName + "-" + subGroupName, "Image-Repeat", repeat);
        }

        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);        
       if (this._prototypeChanged) 
           this.regenerateDemoPanel();
    },
    copyStylesFromGroup: function(fromGroup, toGroup) {
        var styleGroups = this.themeGroupData[toGroup].styles;
        for (var i = 0; i < styleGroups.length; i++) {
            var styleGroupName = styleGroups[i].replace(/\-.*$/,"");
            
            var styleNames = this.themeGroupTypes[styleGroupName];
            for (var j = 0; j < styleNames.length; j++) {
                var key = fromGroup + "-" + styleGroupName;
                if (this.themeData[key] && this.themeData[key][styleNames[j]])
                    this.setCssSymbol(toGroup + "-" + styleGroupName, styleNames[j], this.themeData[key][styleNames[j]]);
                else
                    console.error(key + " not found");
                console.error("doesn't yet handle darken/brighten");
            }
        }

    },



    widgetselect: function(inSender) {
        var name = this.widgetList.selectedItem.getData().dataValue;
        var ctor =  dojo.getObject(name);
        this.showDemoWidget(name, ctor);
        this.showWidgetEditor(name, ctor);
    },
    showWidgetEditor: function(name, ctor) {
        this.widgetEditPanel.removeAllControls();

	this.generatePrototypeEditor(name, ctor);
	this.generateWidgetStylesEditor(name, ctor);

        this.createSaveThemeButtonPanel();
        this.widgetEditPanel.reflow();
    },

    generatePrototypeEditor: function(name, ctor) {
        new wm.Label({name: "mainPanel1Label", caption: "Main styles/properties", width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});
        if (!this.themePrototype[name]) this.themePrototype[name] = {};
        var editableProps = ctor.prototype.themeableProps || [];
        if (editableProps.length)
            dojo.forEach(editableProps, dojo.hitch(this, function(p) {
		var props = {captionSize: "220px", caption: p, dataValue: this.themePrototype[name][p] || ctor.prototype[p], width: "100%", height: "20px", owner: this, parent: this.widgetEditPanel, name: p, readonly: Boolean(this.currentTheme.match(/^wm_/))};
		var e;
		switch(p) {
		case "borderColor":
		case "clientBorderColor":
		case "labelBorderColor":
                    e = new wm.ColorPicker(props);
                    break;
		case "border":
		case "labelBorder":
		case "layerBorder":
                    props.regExp = "\\d+(\\s*,\\s*\\d+){0,3}";
                    e = new wm.Text(props);
                    break;
		case "isMajorContent":
                    e = new wm.Checkbox(props);
                    e.setChecked(props.dataValue);
                    break;
		default:
                    e = new wm.Text(props);
		}
		e.connect(e, "onchange", this, function() {
                    studio._themeDesignerChange = true;
                    studio._reflowPageDesigner = true;
                    studio.application.cacheWidgets();
                    this.setDirty(true);

                    var value = e.getDataValue();
                    if (p == "headerHeight" && !value.match(/px/)) value += "px";
                    ctor.prototype[p] = value;
                    this.themePrototype[name][p] = value;                    
		    //this.regenerateDemoPanel();
		    this.showDemoWidget(name, ctor);
		});
            }));
    },
    generateWidgetStylesEditor: function(name,ctor) {
        var widgetStyles = ctor.prototype.themeableStyles || [];
        for (var i = 0; i < widgetStyles.length; i++) {
            if (widgetStyles[i].match(/^\-/)) {
                var captiontext = widgetStyles[i].replace(/^\-/,"");
                new wm.Label({name: captiontext,
			      caption: captiontext,
			      parent: this.widgetEditPanel,
			      owner: this,
			      height: "24px",
			      width: "100%",
			      border: "0,0,1,0",
			      borderColor: "black",
			      margin: "8,2,2,2"});
            } else {
                var matches = widgetStyles[i].match(/^(.*?)_(.*)$/);
                var groupname = matches[1];
                var stylename = matches[2];
                if (!this.themeData[groupname]) this.themeData[groupname] = {};
                this.addThemeEditor(stylename, (stylename == "Image") ? this.themeData[groupname]["Image-Repeat"] + "," + this.themeData[groupname]["Image-Position"] + "," + this.themeData[groupname]["Image"] : this.themeData[groupname][stylename], groupname, this.widgetEditPanel);
		//this.addThemeEditor(stylename, this.themeData[groupname][stylename], groupname, this.widgetEditPanel);
            }
        }
    },
    createSaveThemeButtonPanel: function() {
        var buttonPanel = new wm.Panel({layoutKind: "left-to-right", width: "100%", height: "80px", owner: this, parent: this.widgetEditPanel, margin: "10,5,10,5"});
        var savebutton = new wm.Button({_classes: {domNode: ["themeButton"]}, caption: "Save " + this.currentTheme, width: "50%", height: "100%", owner: this, parent: buttonPanel, disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
        savebutton.connect(savebutton, "onclick", this, "saveTheme");

        var revertbutton = new wm.Button({_classes: {domNode: ["themeButton"]}, caption: "Revert", width: "50%", height: "100%", owner: this, parent: buttonPanel, disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
        revertbutton.connect(revertbutton, "onclick", this, "revertTheme");
	return buttonPanel;
    },

    showDemoWidget: function(name, ctor) {
        this.demoPanel.removeAllControls();
	this.owner = studio.page; // block Application.loadThemePrototypeForClass from using wm_studio to generate the widget
        this.demoPanel.domNode.innerHTML = "";
        var o = this._create(ctor, {margin: (name == "wm.Layout") ? "0" : "0,20,0,20", owner: this, parent: this.demoPanel, width: "100%", height: "200px", caption: "Caption"});
        var props = o.themeableDemoProps;
        if (props) {
            for (var i in props)
                o.setProp(i,props[i]);
        }
        switch (name) {
	case "wm.Layout":
	    o.setMargin("40");
	    break;
        case "wm.List":           
        case "wm.DataGrid":
        case "wm.DojoGrid":
        case "wm.SelectMenu":
            o.setDataSet(this.imageListVar);
            if (name == "wm.List") o.setColumnWidths("50%,50%");
            break;
        case "wm.DojoMenu":
            o.setMenu("File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp");
            break;
        case "wm.SelectEditor":
            o.editor.setDataSet(this.imageListVar);
            break;
        case "wm.TabLayers":
        case "wm.WizardLayers":
        case "wm.AccordionLayers":
            o.addLayer("layer2");
            break;
        case "wm.Layout":
            var subOne = new wm.Panel({isMajorContent: true, margin: "50", parent: o, horizontalAlign: "center", verticalAlign: "middle", width: "100%", height: "100%"});
            var subTwo = new wm.Panel({isMajorContent: true, margin: "50", parent: subOne, horizontalAlign: "center", verticalAlign: "middle", width: "100%", height: "100%"});
            
            break;
        }
	this.owner = app;
        if (wm.isInstanceType(o, wm.Dialog)) {
            o.setHeight("300px");
            o.setWidth("500px");
            this.demoPanel.domNode.appendChild(o.domNode);
            o.show();
        } else
            this.demoPanel.reflow();
    },

    addThemeEditor: function(inName, inValue, inGroupName, parent, showGroupName) {
        var props = {captionSize: "220px", caption: ((showGroupName) ? inGroupName + "-" : "") + inName, dataValue: inValue, width: "100%", height: "20px", owner: this, parent: parent, name: inGroupName + "__" + inName, readonly: this.currentTheme.match(/^wm_/)};
        var e;
        var shortname = inName.replace(/^.*\-/, "");
        switch(shortname) {
        case "Color":
            // replace with color picker
            e = new wm.ColorPicker(props);
            break;
        case "Width":
        case "Radius":
        case "Margin":
        case "Top-Radius":
        case "Bottom-Radius":
        case "Header-Radius":
            props.dataValue = (dojo.isString(props.dataValue)) ? props.dataValue.replace(/\D/g,"") : props.dataValue;
            e = new wm.Number(props);
            break;
        case "Image":
            props.dataField    = "dataValue";
            props.displayField = "name";
            props.dataSet = this.imageListVar;
            props.allowNone = true;
            e = new wm.SelectMenu(props);
            e.setDataValue(inValue);
            break;
        case "Position":
            props.dataField    = "dataValue";
            props.displayField = "dataValue";
            var hasImage = this.themeData[inGroupName][inName.replace(/\-Position$/,"")];
            hasImage = hasImage && hasImage != "none";
            props.showing = hasImage;
            props.allowNone = true;
            props.options = "left top,center top, right top, left center, center center, right center, left bottom, center bottom, right bottom";
            e = new wm.SelectMenu(props);
            break;
        case "Repeat":
            props.dataField    = "dataValue";
            props.displayField = "dataValue";
            var hasImage = this.themeData[inGroupName][inName.replace(/\-Repeat$/,"")];
            hasImage = hasImage && hasImage != "none";
            props.showing = hasImage;
            props.allowNone = true;
            props.options = "no-repeat,repeat-x,repeat-y,repeat";
            e = new wm.SelectMenu(props);

            break;
        case "Shadow":
            props.dataField    = "dataValue";
            props.displayField = "name";
            props.dataSet = this.shadowListVar;
            props.allowNone = true;
            e = new wm.SelectMenu(props);
            break;
        default: 
            e = new wm.Text(props);
        }
        e.connect(e, "onchange", this, function() {
            studio._themeDesignerChange = true;
            studio._reflowPageDesigner = true;
            studio.application.cacheWidgets();
            this.setDirty(true);

            var value = e.getDataValue();
            if (shortname == "Image") {
                var url = "none";
                var position = "top left";
                var repeat = "no-repeat";
                if (value) {
                    var imageMatches = value.match(/[^,]+/g);
                    repeat = imageMatches[0];
                    position = imageMatches[1];
                    url = imageMatches[2];
                }
	        this.setCssSymbol(inGroupName, "Image", url);
	        this.setCssSymbol(inGroupName, "Image-Position", position);
	        this.setCssSymbol(inGroupName, "Image-Repeat", repeat);
            } else {
                if (shortname == "Radius" || shortname == "Width" || shortname == "Margin" || shortname == "Height") 
                    if (!value.match(/px/))
                        value += "px";
                else if (shortname == "TextSize") value += "pt";
                // replace "some-css-name: some-css-value; /* some-symbolic-name */
                // with "same-dang-css-name: some-new-css-value; /* same-dang-symbolic-name */
	        this.setCssSymbol(inGroupName, inName, value);
            }
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
        });
    },
    getThemeGroup: function(inGroupName, inGroupData) {
	if (inGroupData[inGroupName])
	    return inGroupData[inGroupName];
	var results = inGroupName.split("-");
	var name = results.shift();
	if (inGroupData[name]) {
	    if (inGroupData[name].subcategories)
		return this.getThemeGroup(results.join("-"), inGroupData[name].subcategories);
	    else
		return inGroupData[name];
	}
	return;
    },
    setSectionEnabled: function(name, value) {
	this.themeData[name + "-Enabled"] = value;
	var matchstr = "^\\s*@media (screen|disabled)\\s*{\\s/\\* " + name + "-Level \\*/";
	console.log(matchstr);
	var replacestr = '@media ' + (value ? "screen" : "disabled") + " { /* " + name + "-Level */";
	console.log("REPLACE WITH: " + replacestr);
	var r = new RegExp(matchstr, "gm");
	
        this.cssText = this.cssText.replace(r, replacestr);
	studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
    },
    setCssSymbol: function(inGroupName, inName, inValue) {
	var symbolicName = inGroupName + "_" + inName;

        // ADJUSTMENTS TO VALUES
/*
        switch(inName) {
            case "Shadow":
            var tmp = inGroupName.replace(/Style$/,"");
            if (this.themeData[tmp] && this.themeData[tmp].Color)
                inValue = inValue.replace(/\#888888/, this.themeData[tmp].Color);
            break;
        }
        */

        console.log("SET SYMBOL: " + symbolicName + " TO " + inValue);
        if (!this.themeData[inGroupName])
            this.themeData[inGroupName] = {};
        this.themeData[inGroupName][inName] = inValue;
        var r = new RegExp("(\\S+\\s*\\:\\s*)\\s*.*?(\\s+\!important)?\\s*(\\;\\s*\\/\\* " + symbolicName + " \\*\\/)", "g");
        this.cssText = this.cssText.replace(r, "$1" + inValue + "$2$3");

        // If updating the border, we must set the prototype as well (redundant in some cases)
        if (inGroupName.match(/^(.*)(\-|_)Border$/)) {
            // used px for css but now we need to get rid of it
            var newValue = (inName == "Radius") ? inValue.replace(/\D/g,"") : inValue;

            var themeGroupName = inGroupName.match(/^(.*)(\-|_)Border$/)[1];
	    var borderList = this.getThemeGroup(symbolicName, this.themeGroupData).borders;
            if (borderList)
                for (var i = 0; i < borderList.length; i++) {
                    var widgetClassName = borderList[i].borderClass;
                    var borderProperty;
                    if (inName == "Color") {
                        borderProperty = (borderList[i].borderColorProperty) ? borderList[i].borderColorProperty :
                            borderList[i].borderProperty + "Color";
                    } else {
                        borderProperty = borderList[i].borderProperty ;
                    }
		    if (widgetClassName == "wm.FancyPanel") {
			if (borderProperty == "innerBorderColor")
			    borderProperty = "borderColor";
		    }
		    if (borderProperty.match(/Border^/))
			newValue = parseInt(newValue); // no px in value 
                    var borderTemplate = borderList[i].borderTemplate;
                    if (!this.themePrototype[widgetClassName]) this.themePrototype[widgetClassName] = {};
                    newValue = (borderTemplate && borderProperty.match(/border$/i)) ? borderTemplate.replace(/\?/g, inValue) : inValue;
                    this.themePrototype[widgetClassName][borderProperty] = newValue;
                    var ctor = dojo.getObject(widgetClassName);
                    if (ctor && ctor.prototype) {
                        ctor.prototype[borderProperty] = newValue;
			console.log("Set prototype " + widgetClassName + ".prototype." + borderProperty + " = " + newValue);
                    }
                }
	    this.regenerateDemoPanel();
        }

        /* AFTER EFFECTS OF THE CHANGE */
        switch(symbolicName) {
        case "Content-Panels-Editors-Default-BorderStyle_Radius":
            var newValue = Math.floor(parseInt(inValue) * 0.6) + "px";
            this.setCssSymbol("wm.SelectMenu", "Inner-Radius", newValue);
            break;
/*
	case "Common-Panel_BorderStyle_Radius":
            var newValue = Math.floor(parseInt(inValue) * 0.6) + "px";
            this.setCssSymbol("Common-Panel_Inner_Border", "Inner-Radius", newValue);
	    */
        }
    },
    revertTheme: function() {
        this.themeList.eventSelect(this.themeList.items[this.themeList.getSelectedIndex()]);
        app.toastDialog.showToast("Reverted", 2000, "Success");
        this.setDirty(false);
    },
    saveTheme: function() {
        studio.beginWait("Saving...");
	var result = studio.deploymentService.requestSync("deployTheme", [this.currentTheme, "themedescriptor.json",dojo.toJson(this.themeData,true)]);
        if (result)
            result = studio.deploymentService.requestSync("deployTheme", [this.currentTheme, "theme.css",this.cssText]);
        if (result)
            result = studio.deploymentService.requestSync("deployTheme", [this.currentTheme, "Theme.js",dojo.toJson(this.themePrototype, true)]);
        studio.endWait("Saving...");
        if (!result) {
            app.toastDialog.showToast("Error saving theme!", 10000, "Warning");
            return;
        }
        app.toastDialog.showToast("Theme '" + this.currentTheme + "' saved!", 5000, "Success");
        this.setDirty(false);

        // force an update in the applicaton's theme if we've modified its current theme
        if (studio.application.theme == this.currentTheme) {
            studio.application.setTheme(this.currentTheme);
        }
    },
    copyThemeClick: function(inSender) {
        if (this.currentTheme == "wm_notheme") {
/*
            var dialog = studio.genericDialog; // defined in Studio.widgets.js
            dialog.setTitle("Copy Theme");
            dialog.setButton1Caption("OK");
            dialog.setButton2Caption("");
            dialog.setUserPrompt("This theme has been customized such that it can't be editted using this themebuilder and therefore can not be copied. Please pick a different theme to copy.");
            dialog.button1Close = true;
            dialog.show();
            */
            app.alert("This theme has been customized such that it can't be editted using this themebuilder and therefore can not be copied. Please pick a different theme to copy.");
            return;
        }


        var dialog = studio.genericDialog; // defined in Studio.widgets.js
        dialog.setTitle("Copy Theme");
        dialog.setButton1Caption("OK");
        dialog.setButton2Caption("Cancel");
        dialog.button2Close = true;
        dialog.setUserPrompt("Enter name for your new theme");
        dialog.setShowInput(true);
        var selectedName = this.themeList.selectedItem.getData().dataValue;
        var newname = selectedName;
        newname = newname.replace(/^wm_/, "custom_");
        var list = [];
        var tmplist = studio.themesListVar.getData();
        for (var i = 0; i < tmplist.length; i++) list.push(tmplist[i].dataValue);
        while (dojo.indexOf(list, newname) != -1) {
            var numbmatch = newname.match(/\d+$/);
            if (numbmatch) {
                var numb = parseInt(numbmatch[0]) + 1;
                newname = newname.replace(/\d+$/, numb);
            } else
                newname += "1";
        }
        dialog.setInputDefaultValue(newname);
        this.connect(dialog, "onButton2Click", this, function(inSender, inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            this.disconnectEvent("onEnterKeyPress");
        });
        this.connect(dialog, "onButton1Click", this, function(inSender, inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            this.disconnectEvent("onEnterKeyPress");
            this.processNewThemeName(inText, selectedName);
        });
        this.connect(dialog, "onEnterKeyPress", this, function(inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            this.disconnectEvent("onEnterKeyPress");
            this.processNewThemeName(inText, selectedName);
            dialog.dismiss();
        });
        dialog.show();
    },
    setDirty: function(inDirty) {
        if (inDirty) {
            this._cacheUserLabel = studio.userLabel.caption;
            studio.userLabel.setCaption("THEME NOT SAVED");
            studio.userLabel.setAlign("center");
            studio.userLabel.domNode.style.backgroundColor = "red";
        } else {
            studio.userLabel.setCaption(this._cacheUserLabel != "THEME NOT SAVED" ? this._cacheUserLabel : "");
            studio.userLabel.domNode.style.backgroundColor = "";
        }
    },

    processNewThemeName: function(inText, selectedName) {
        var dialog = studio.genericDialog; // defined in Studio.widgets.js

        var list = [];
        var tmplist = studio.themesListVar.getData();
        for (var i = 0; i < tmplist.length; i++) list.push(tmplist[i].dataValue);


        if (!inText) {
            app.toastDialog.showToast("Please enter a name for your theme before hitting OK...", 5000, "Warning");
            return;
        } else if (dojo.indexOf(list, inText) != -1) {
            app.toastDialog.showToast("Unfortunately, " + inText + " is already in use", 5000, "Warning");
        } else if (!inText.match(/^custom_/) || inText == "custom_") {
            app.toastDialog.showToast("Please use the 'custom_' prefix in your theme names", 5000, "Warning");
            return;
        }
        dialog.dismiss();
        this.disconnectEvent("onButton2Click");
        this.disconnectEvent("onButton1Click");
        
            var d = studio.deploymentService.requestAsync("copyTheme", [selectedName, inText]);
            d.addCallback(dojo.hitch(this, function(inData) {
                app.toastDialog.showToast("Theme Copied!", 5000, "Success");
                studio.loadThemeList(dojo.hitch(this, function() {
                    this.themeList.setDataSet(studio.themesListVar);
                    var themelist = studio.themesListVar.getData();
                    for (var j = 0; j < themelist.length; j++) {
                        if (themelist[j].dataValue == inText) {
                            this.themeList.eventSelect(this.themeList.getItem(j));
                            break;
                        }
                    }
                }));
            }));
            d.addErrback(dojo.hitch(this, function(result) {
                app.toastDialog.showToast("Theme Copy Failed:" + result.message, 10000, "Warning");
            }));
    },
    confirmNewBorderColor: function() {
        var dialog = studio.genericDialog; // defined in Studio.widgets.js
        dialog.setTitle("Confirm");
        dialog.setButton1Caption("OK");
        dialog.setButton2Caption("Cancel");
        dialog.setUserPrompt("Confirm that you want to change all borders to match this widget's border of " + this.$.borderColor.getDataValue());
        dialog.setShowInput(false);


        this.connect(dialog, "onButton2Click", this, function(inSender, inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            dialog.dismiss();
        });
        this.connect(dialog, "onButton1Click", this, function(inText) {
            this.editAllBorderColors(this.$.borderColor.getDataValue());
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            dialog.dismiss();
        });

        dialog.show();
    },
    editAllBorderColors: function(inColor) {
        for (var i in this.themePrototype) {
	    var propHash = this.themePrototype[i];	    
	    var prototype = dojo.getObject(i).prototype;
	    for (var j in propHash) {
		if (j.match(/borderColor$/i)) {
		    propHash[j] = inColor;
		    prototype[j] = inColor;
		}
	    }
	}
        if (!this.themePrototype["wm.Control"])
            this.themePrototype["wm.Control"] = {};
        this.themePrototype["wm.Control"].borderColor = inColor;
        wm.Control.borderColor = inColor;
    },
    removeThemeClick: function(inSender) {
        var selectedName = this.themeList.selectedItem.getData().dataValue;
        if (!selectedName) return;

        if (selectedName.match(/^wm_/)) {
            var dialog = studio.genericDialog; // defined in Studio.widgets.js
            dialog.setButton1Caption("OK");
            dialog.setButton2Caption("");
            dialog.setUserPrompt("You can only delete themes that don't begin with 'wm_'");
            dialog.setTitle("Delete Theme");
            dialog.button1Close = true;
            dialog.show();
            return;
        }

        var dialog = studio.genericDialog; // defined in Studio.widgets.js
        dialog.setButton1Caption("Delete");
        dialog.setButton2Caption("Cancel");
        dialog.setUserPrompt("Are you sure you want to delete '" + selectedName + "'?");
        dialog.setShowInput(false);
        dialog.setHeight("150px");
        this.connect(dialog, "onButton2Click", this, function(inSender, inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            dialog.dismiss();
        });
        this.connect(dialog, "onButton1Click", this, function(inSender, inText) {
            this.disconnectEvent("onButton2Click");
            this.disconnectEvent("onButton1Click");
            dialog.dismiss();

            var d = studio.deploymentService.requestAsync("deleteTheme", [selectedName]);
            d.addCallback(dojo.hitch(this, function(inData) {
                app.toastDialog.showToast("Theme Deleted!", 5000, "Success");
                studio.loadThemeList(dojo.hitch(this, function() {
                    this.themeList.setDataSet(studio.themesListVar);
                    this.selectTheme("wm_notheme");
                }));
            }));
            d.addErrback(dojo.hitch(this, function(result) {
                app.toastDialog.showToast("Theme Delete Failed:" + result.message, 10000, "Warning");
            }));

        });
            dialog.show();

    },




    /**** COLOR UTILITIES ****/
    /* Turn an array of color numbers representing rgb integers into a proper hex string */
    sanitizeColorArray: function(result1) {
        for (var i = 0; i < 3; i++) {
            if (result1[i] < 0) result1[i] = 0;
            else if (result1[i] > 255) result1[i] = 255;
            result1[i] = result1[i].toString(16);
            result1[i] = ("" + result1[i]).length < 2 ? "0" + result1[i] : "" + result1[i];
        }
        return result1;
    },

    /* returns array of colors offset from the original; both must be offset in the same direction (brighter or darker) */
    offsetColor: function(inValue) {
        var values = [parseInt(inValue.substr(1,2),16),
                      parseInt(inValue.substr(3,2),16),
                      parseInt(inValue.substr(5,2),16)];
        var max = 0;
        for (var i = 0; i < 3; i++) if (values[i] > max) max = values[i];
        
        var brighten = (max <= 120);

        if (max < 40) 
            values = [40,40,40];

        var result1 =  [Math.floor(values[0] * (brighten ? 1.2 : 0.9)),
                        Math.floor(values[1] * (brighten ? 1.2 : 0.9)),
                        Math.floor(values[2] * (brighten ? 1.2 : 0.9))];
        result1 = this.sanitizeColorArray(result1);


        var result2 =  [Math.floor(values[0] * (brighten ? 1.4 : 0.8)),
                        Math.floor(values[1] * (brighten ? 1.4 : 0.8)),
                        Math.floor(values[2] * (brighten ? 1.4 : 0.8))];
        result2 = this.sanitizeColorArray(result2);


        var result3 =  [Math.floor(values[0] * (brighten ? 1.6 : 0.7)),
                        Math.floor(values[1] * (brighten ? 1.6 : 0.7)),
                        Math.floor(values[2] * (brighten ? 1.6 : 0.7))];
        result3 = this.sanitizeColorArray(result3);

        return ["#" + result1.join(""),
                "#" + result2.join(""),
                "#" + result3.join("")];
    },




    regenerateDemoPanel: function(optionalObj) {
        this.demoPanel.removeAllControls();
	this.owner = studio.page; // block Application.loadThemePrototypeForClass from using wm_studio to generate the widget
        this.demoPanel.domNode.innerHTML = "";

/*
	if (this.userLevelList.selectedItem.getData().dataValue == "Advanced") {
	    var demoWidgets = this.themeGroupData[this.themeGroupList.selectedItem.getData().dataValue].demo;
            this.demoPanel.createComponents(this[demoWidgets], this);
	} else {
            this.demoPanel.createComponents(this.themeGroupDemoHeaderWidgets, this);
	}
        */
	this._currentTheme = optionalObj || this._currentTheme || this.themeGroupDemoHeaderWidgets;
        this.demoPanel.createComponents(this._currentTheme, this);

        if (this.$.openDialogButton)
            this.$.openDialogButton.connect(this.$.openDialogButton, "onclick", this, function() {
                this.demoDialog = new wm.GenericDialog({owner: studio.page, "height":"145px","showInput":true,"noEscape":false,"title":"Sample Dialog","button1Caption":"OK","button1Close":true,"button2Close":true,"userPrompt":"This is a sample of a wm.GenericDialog"});
                this.demoDialog.setOwner(this);
                this.demoPanel.domNode.appendChild(this.demoDialog.domNode);               
                this.demoDialog.show();
                
                this.demoDialog.connect(this.demoDialog.$.button1, "onclick", this, function(inShowing) {
                    this.demoDialog.destroy();
                });
                
            });
	this.owner = app;
        wm.onidle(this.demoPanel,"reflow");
        this._prototypeChanged = false;
    },
    getThemeDataValue: function(groupname, stylename, defaultVal) {
        if (!this.themeData[groupname])
            this.themeData[groupname] = {};
        if (!this.themeData[groupname][stylename])
            this.themeData[groupname][stylename] =  defaultVal;
        return this.themeData[groupname][stylename];
    },


    isDesignLoaded: function() {
	return (this.owner == studio.page);
    },


    /* Demos to show while the user is editting */
    themeGroupDemoHeaderWidgets: {
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		headerPanel: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			Page_Title: ["wm.Label", {"height":"48px","width":"100%","border":"0","margin":"0,0,0,20","caption":"Page Title"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			headerlabel2: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log in", link:"javascript:alert('login')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			headerlabel3: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log out", link:"javascript:alert('logout')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			headertextEditor1: ["wm.TextEditor", {"caption":"Search","height":"27px","width":"184px"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}]
		}],
	    panel4outer: ["wm.FancyPanel", {width: "100%", height: "100%", title: "Demo Panel", margin: "40"},{},{
		panel4: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"100%", autoScroll: true}, {}, {
		    panel2: ["wm.Panel", {"horizontalAlign":"left","verticalAlign":"top","width":"450px","height":"200px","padding":"10", fitToContentHeight: true}, {}, {
				panel1: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"81px"}, {}, {
					label1: ["wm.Label", {"height":"48px","width":"96px","border":"0","caption":"Buttons:"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					button1: ["wm.Button", {"height":"48px","width":"153px"}, {}],
					toggleButton1: ["wm.ToggleButton", {"height":"48px","width":"150px","captionUp":"Toggle Button","captionDown":"Toggle Down"}, {}]
				}],
				accordionLayers1: ["wm.AccordionLayers", {"height":"200px"}, {}, {
					layer1: ["wm.Layer", {"caption":"Accordion 1","horizontalAlign":"left","verticalAlign":"top","isMajorContent":undefined}, {}, {
						label5: ["wm.Label", {"height":"30px","width":"100%","border":"0","caption":"Contents of accordion 1","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
					    text12: ["wm.Text", {height: "25px", width: "100%", caption: "text input"}],
					    button12345: ["wm.Button", {height: "40px", width: "80px", caption: "Save"}]
					}],
					layer2: ["wm.Layer", {"caption":"Accordion 2","horizontalAlign":"left","verticalAlign":"top","isMajorContent":undefined}, {}, {
						label3: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of accordion 2","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					layer3: ["wm.Layer", {"caption":"Accordion 3","horizontalAlign":"left","verticalAlign":"top","isMajorContent":undefined}, {}, {
						label2: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of accordion 3","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				spacer1: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
				tabLayers1: ["wm.TabLayers", {"height":"150px"}, {}, {
					layer4: ["wm.Layer", {"_classes":{"domNode":["wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea"]},"caption":"Tab 1","horizontalAlign":"left","verticalAlign":"top","isMajorContent":true}, {}, {
						label6: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of tab 1","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					layer5: ["wm.Layer", {"_classes":{"domNode":["wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea"]},"caption":"Tab 2","horizontalAlign":"left","verticalAlign":"top","isMajorContent":true}, {}, {
						label7: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of tab 2","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					layer6: ["wm.Layer", {"_classes":{"domNode":["wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea","wmcontentarea"]},"caption":"Tab 3","horizontalAlign":"left","verticalAlign":"top","isMajorContent":true}, {}, {
						label8: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of tab 3","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				spacer2: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
			        dojoGrid1: ["wm.List", {"height":"150px", width: "100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"shadowListVar"}, {}]
					}]
				}]
			}],
			bevel1: ["wm.Bevel", {"height":"100%","width":"10px"}, {}],
			panel3: ["wm.Panel", {"horizontalAlign":"left","verticalAlign":"top","width":"250px","height":"200px", fitToContentHeight: true,"padding":"10"}, {}, {
				dojoMenu1: ["wm.DojoMenu", {"structure":"{\"items\":[{\"label\":\"File\",\"children\":[{\"label\":\"New\"},{\"label\":\"Open\"},{\"label\":\"Save\"},{\"label\":\"Close\"}]},{\"label\":\"Edit\",\"children\":[{\"label\":\"Cut\"},{\"label\":\"Copy\"},{\"label\":\"Paste\"}]},{\"label\":\"Zoom\",\"children\":[{\"label\":\"25%\"},{\"label\":\"50%\"},{\"label\":\"100%\"},{\"label\":\"150%\"}]},{\"label\":\"Help\"}]}","menu":"File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp","eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"},{"label":"Edit","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Cut"},{"label":"Copy"},{"label":"Paste"},{"label":"Zoom","children":[{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"}]},{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"},{"label":"Help"}]}, {}],
				spacer3: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
			    calendar1: ["wm.dijit.Calendar", {width: "100%", height: "200px"}, {}],
				spacer4: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
				progressBar1: ["wm.dijit.ProgressBar", {"height":"48px","width":"360px"}, {}],
				spacer5: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
				text1: ["wm.Text", {"displayValue":"","caption":"text1"}, {}],
				selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","options":"option a, option b, option c","displayField":"name","dataField":"dataValue","displayValue":""}, {}],
				spacer6: ["wm.Spacer", {"height":"48px","width":"96px"}, {}],
				button2: ["wm.Button", {"height":"94px","width":"198px","caption":"Open Dialog"}, {"onclick":"genericDialog1"}]
			}]
		}]
		}],
		footerpanel2: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"center","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			footerlabel6: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"About Us", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			footerlabel7: ["wm.Label", {"height":"27px","width":"150px","border":"0","caption":"More about us ", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			footertextEditor2: ["wm.TextEditor", {"caption":"Search","height":"27px","width":"100%"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}]
		}]
	}]
    },


    themeGroupDemoDocumentWidgets: {
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
	    dojoMenu1: ["wm.DojoMenu", {"structure":"{\"items\":[{\"label\":\"File\",\"children\":[{\"label\":\"New\"},{\"label\":\"Open\"},{\"label\":\"Save\"},{\"label\":\"Close\"}]},{\"label\":\"Edit\",\"children\":[{\"label\":\"Cut\"},{\"label\":\"Copy\"},{\"label\":\"Paste\"}]},{\"label\":\"Zoom\",\"children\":[{\"label\":\"25%\"},{\"label\":\"50%\"},{\"label\":\"100%\"},{\"label\":\"150%\"}]},{\"label\":\"Help\"}]}",
					"menu":"File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp",
					"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"},{"label":"Edit","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Cut"},{"label":"Copy"},{"label":"Paste"},{"label":"Zoom","children":[{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"}]},{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"},{"label":"Help"}]}, {}],
	    headerPanel: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			Page_Title: ["wm.Label", {"height":"27px","width":"100%","border":"0","margin":"0,0,0,20","caption":"Document Region"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		headerlabel2: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log in", link: "javascript:alert('login')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			headerlabel3: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log out", link: "javascript:alert('logout')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			headertextEditor1: ["wm.TextEditor", {"caption":"Search","height":"27px","width":"184px"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}],
		searchButton: ["wm.Button", {caption: "Go", width: "50px", height: "33px"}],
		searchToggleButton: ["wm.ToggleButton", {captionUp: "Off", captionDown: "On", width: "60px", height: "33px"}]
		}],
	    accordionLayers1: ["wm.AccordionLayers", {"height":"200px", "margin": "10,40,0,40"}, {}, {
					layer1: ["wm.Layer", {"caption":"Accordion 1","horizontalAlign":"left","verticalAlign":"top","isMajorContent":undefined}, {}, {
						label5: ["wm.Label", {"height":"30px","width":"100%","border":"0","caption":"Contents of accordion 1","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
					    text12: ["wm.Text", {height: "25px", width: "100%", caption: "text input"}],
					    button12345: ["wm.Button", {height: "40px", width: "80px", caption: "Save"}]
					}],
					layer2: ["wm.Layer", {"caption":"Accordion 2","horizontalAlign":"left","verticalAlign":"top","isMajorContent":undefined}, {}, {
						label3: ["wm.Label", {"height":"100%","width":"100%","border":"0","caption":"Contents of accordion 2","singleLine":false}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
	    panel4: ["wm.FancyPanel", {"layoutKind":"top-to-bottom","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"100%","margin":"10,40,10,40"}, {}, {
		pageContentLabel1: ["wm.Label", {width: "100%", height: "30px", caption: "Page Content Area"}],
 		panel4: ["wm.FancyPanel", {"_classes":{"domNode":["wmcontentarea"]},title: "Content Panel Area", "layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"100%","margin":"40", autoScroll: true}, {}, {

		}], 
		pageContentLabel2: ["wm.Label", {width: "100%", height: "30px", caption: "Page Content Area"}],
 		panel5: ["wm.FancyPanel", {title: "Content Panel Area", "layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"100%","margin":"40", autoScroll: true}, {}, {

		}]
	    }],
	    footerpanel2: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"center","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
		footerlabel6: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"About Us", link:"javascript:alert('about us')"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		footerlabel7: ["wm.Label", {"height":"27px","width":"150px","border":"0","caption":"Copyright 2010 "}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		footerMenu: ["wm.SelectMenu", {options: "Home, Page 1, Page 3", "height":"27px","width":"200px",captionSize: "50px","border":"0","caption":"Goto"}],
		gotoButton1: ["wm.Button", {"caption":"Go","height":"33px","width":"50px"}]
	    }]
	}]
    },


    themeGroupDemoPageAndEditorWidgets: {
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel1: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			Page_Title: ["wm.Label", {"height":"48px","width":"100%","border":"0","margin":"0,0,0,20","caption":"Page Title"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label2: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log in", link:"javascript:alert('login')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		    label3: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log out", link:"javascript:alert('logout')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			textEditor1: ["wm.TextEditor", {"caption":"Search","height":"27px","width":"184px"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}]
		}],
  	        fancyPanel1: ["wm.FancyPanel", {"horizontalAlign":"left","verticalAlign":"top", margin: "40,10,40,10"}, {}, {
		    label333: ["wm.Label", {"height":"27px","width":"100%","border":"0","caption":"Page Content Section"}],
			text1: ["wm.Text", {"displayValue":"","caption":"text1"}, {}],
			selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","options":"option 1, option 2, option 3","displayField":"name","dataField":"dataValue"}, {}],
			checkbox1: ["wm.Checkbox", {"displayValue":"","caption":"checkbox1"}, {}],
			slider1: ["wm.Slider", {"displayValue":"","caption":"slider1"}, {}],
			largeTextArea1: ["wm.LargeTextArea", {"displayValue":"","caption":"largeTextArea1"}, {}],
		        richText1: ["wm.RichText", {"height":"119px"}, {}],
		        panel1: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"81px"}, {}, {
			    label1: ["wm.Label", {"height":"48px","width":"96px","border":"0","caption":"Buttons:"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }],
			    button1: ["wm.Button", {"height":"48px","width":"153px"}, {}],
			    toggleButton1: ["wm.ToggleButton", {"height":"48px","width":"150px","captionUp":"Toggle Button","captionDown":"Toggle Down"}, {}]
			}]

		}],
		panel2: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"center","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
			label6: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"About Us", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label7: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"More about us ", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		    footerMenu: ["wm.SelectMenu", {options: "Home, Page 1, Page 3", "height":"27px","width":"200px",captionSize: "50px","border":"0","caption":"Goto"}],
		    gotoButton1: ["wm.Button", {"caption":"Go","height":"33px","width":"50px"}]
		}]
	}]
    },


    themeGroupDemoContentPanelWidgets: {
	layoutBox1: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
	    panel1: ["wm.FancyPanel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"88px", title: "Title Bar", margin: "10,40,10,40"}, {}, {
			Page_Title: ["wm.Label", {"height":"48px","width":"100%","border":"0","margin":"0,0,0,20","caption":"Page Title"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label2: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log in", link:"javascript:alert('login')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		    label3: ["wm.Label", {"height":"27px","width":"70px","border":"0","caption":"Log out", link:"javascript:alert('logout')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			textEditor1: ["wm.TextEditor", {"caption":"Search","height":"27px","width":"184px"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}]
		}],
	    layers: ["wm.TabLayers", {width: "100%", height: "100%", margin: "10,40,10,40"},{}, {
		layer1: ["wm.Layer", {caption: "Tab 1", padding: "20"}, {}, {
		    label111: ["wm.Label", {caption: "PageContent Section", width: "100%", height: "20px"}],
		fancyPanel1: ["wm.FancyPanel", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
			text1: ["wm.Text", {"displayValue":"","caption":"text1"}, {}],
			selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","options":"option 1, option 2, option 3","displayField":"name","dataField":"dataValue"}, {}],
			checkbox1: ["wm.Checkbox", {"displayValue":"","caption":"checkbox1"}, {}],
			slider1: ["wm.Slider", {"displayValue":"","caption":"slider1"}, {}],
			largeTextArea1: ["wm.LargeTextArea", {"displayValue":"","caption":"largeTextArea1"}, {}],
		        richText1: ["wm.RichText", {"height":"119px"}, {}],
		        panel1: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"left","verticalAlign":"top","width":"100%","height":"81px"}, {}, {
			    label1: ["wm.Label", {"height":"48px","width":"96px","border":"0","caption":"Buttons:"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			    }],
			    button1: ["wm.Button", {"height":"48px","width":"153px"}, {}],
			    toggleButton1: ["wm.ToggleButton", {"height":"48px","width":"150px","captionUp":"Toggle Button","captionDown":"Toggle Down"}, {}]
			}]

		}]
	    }]
	    }],
		panel2: ["wm.Panel", {"layoutKind":"left-to-right","horizontalAlign":"center","verticalAlign":"top","width":"100%","height":"48px"}, {}, {
			spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
			label6: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"About Us", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			label7: ["wm.Label", {"height":"27px","width":"100px","border":"0","caption":"More about us ", link:"javascript:alert('about')"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
		    footerMenu: ["wm.SelectMenu", {options: "Home, Page 1, Page 3", "height":"27px","width":"200px",captionSize: "50px","border":"0","caption":"Goto"}],
		    gotoButton1: ["wm.Button", {"caption":"Go","height":"33px","width":"50px"}]
		}]

	}]
    }
});

