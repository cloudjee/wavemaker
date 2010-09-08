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
    panelTypes: ["Document", "MainContent", "EmphasizedContent", "HeaderContent"],

    /* themeTypes provides the editor to use when editting somethign with the given name.
     * Note: Don't yet support putting event handlers in here so don't try it without fixing that 
     */
    themeTypes: {"Family": ["wm.SelectMenu", {options: "Lucida Grande, Lucida Sans, Arial, Verdana,  sans-serif, serif", width: "80px"}],
                 "Weight": ["wm.SelectMenu", {options: "normal, bold", width: "80px"}],
                 "TextSize": ["wm.Number",  { width: "60px"}],
                 "Color": ["wm.ColorPicker", {width: "80px"}],
                 "Shadow": ["wm.SelectMenu", {dataField: "dataValue", displayValue: "name", allowNone: true, width: "80px"},{},{
                     binding: ["wm.Binding", {},{},{
                         wire: ["wm.Wire", {targetProperty: "dataSet", source: "shadowListVar"}]
                     }]
                 }],
                 "PanelStylePicker": ["wm.SelectMenu", {options: "Document, MainContent, EmphasizedContent, HeaderContent", width: "120px"}],
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
                      "Background": ["Color", "Image"],
                      "PanelType": ["PanelStylePicker"]},

    /* Each entry in themeGroupData represents a styling group that the user can select and access all of the editors
     * for that group.  Each group element is hash consisting of:
     * demo: The name of the widgets_js structure that should be shown when the user is editting this group
     * styles: A list of style names that the user will edit; names taken from themeGroupTypes
     * borders: Optional array of borders that will be updated when/if the user changes a Border-BorderSize or Border-Color property
     */
    themeGroupData: {
        "Borders": {
	    demo: "themeGroupDemoAllPanelsWidgets",
            styles: [{name: "Editor_BorderStyle-Radius", 
                      description: "Change the radius (roundedness) of editor borders for all editors in your document.  Enter an integer between 0 (square) and 24 (very round)"},
                     {name: "Panel_BorderStyle-Radius", 
                      description: "Change the radius (roundedness) of panel borders for all TabLayers, AccordionLayers, FancyPanel and other non-layout panels in your document.  Enter an integer between 0 (square) and 24 (very round)"}, 
                     {name: "Panel_Border", 
                      symbol: "Borders-Panel_Border",
                      description: "Change the border width and color of containers such as Accordions, TabLayers, Dialogs and FancyPanels. This also sets the default color for all of your wm.Panels, but does NOT change the border size for wm.Panels.",
                      borders: [{borderClass: "wm.TabLayers", borderProperty: "clientBorder"},
			        {borderClass: "wm.AccordionLayers", borderProperty: "layerBorder", borderColorProperty: "borderColor"},
			        {borderClass: "wm.WizardLayers", borderProperty: "clientBorder"},
		                {borderClass: "wm.FancyPanel", borderProperty: "innerBorder"},
			        {borderClass: "wm.Panel", borderProperty: "border"}
			       ]},
                     {name: "Clickable_Border", 
                      symbol: "Borders-Clickable_Border",
                      description: "Change the border width and color Clickables such as wm.Buttons, wm.AccordionLayer's headings, wm.TabLayer's buttons.  Also changes titlebars for Dialogs and RoundedPanel/FancyPanel",
                      borders: [{borderClass: "wm.Button", borderProperty: "border"},
			      {borderClass: "wm.ToggleButton", borderProperty: "border"},
			      {borderClass: "wm.RoundedButton", borderProperty: "border"},
			        {borderClass: "wm.BusyButton", borderProperty: "border"},
			        {borderClass: "wm.AccordionDecorator", borderProperty: "captionBorder"}

                               ]
                     }
                    ]
        },
        "Document": {
	    subcategories: {
		"Styles": {
                    displayName: "Basic Panel Styles",
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font", 
                             {name: "Border", description: "Change the default border for your wm.Layout widgets. This will put a border around your document; it will also put a border around your PageContainers and PageDialogs.  This can be used to create interesting effects, but probably best to stay away from it.", 
                                      borders: [{borderClass: "wm.Layout", borderProperty: "border"}]}, 
                             {name: "BorderStyle", description: "Give your wm.Layout border some rounding (not a standard practice).  As this may also affect PageDialogs and PageContainers, probably best to leave this one alone until someone finds a nice way to use it."},
                             {name: "Background", description: "Set the background color for the main pages of your product."}
                            ],
                    description: "Set the basic styling of your document panel (i.e. the wm.Layout for your main pages) and everything within it.  Font lets you set the basic font to use within your document; border and background let you set the border style for your document (its not a common design, but putting a border around your document, possibly even rounding it a bit could just be your thing).  Note that border settings are for your wm.Layout, and NOT for the contents of your wm.Layout"
		},
		"ClickablesDefault": {
                    displayName: "Clickables (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font", "BorderStyle", "Background"],
                    description: "<p>Clickable settings affects the following widgets<ul><li>wm.Button</li><li>wm.AccordionLayer Headers</li><li>wm.TabLayer Tab Buttons</li><li>wm.FancyPanel/RoundedPanel Titlebar</li><li>wm.Dialog Titlebar and buttonbar</li><li>wm.Splitter</li><li>wm.Bevel</li></ul> It represents both clickable elements and minor headers. Why both? because in most cases, clickable elements Are headers; for example, consider the wm.AccordionLayer header and the wm.TabLayer buttons.</p><p>In this form, you will set the font and background colors for your headers and buttons.  This affects all buttons and headers within your document except where the theme or a project specifically override these styles</p>"
		},               
		"ClickablesHover":   {
                    displayName: "Clickables (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Clickable elements should have a mouse-over effect that emphasizes its clickability.</p><p>In this form, you will set the changes to font, shadowing and background colors that are displayed when the mouse hovers over your headers/buttons.  Shadowing is particularly useful for making a button look pressable as it gives it a more three dimensional look.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"ClickablesActive":  {
                    displayName: "Clickables (Active)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Any clickable element that has an active state will want a special set of styling to indicate that its active.  Clickables with active state include <ul><li>wm.ToggleButton</li><li>wm.TabLayers Tab Buttons</li><li>wm.AccordionLayer Headers</li></ul></p><p>Set the font, shadowing and background colors to emphasize that this clickable header is currently active.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},

		"EditorsDefault": {
                    displayName: "Editors (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "You of course have the option of having a plain and functional editor. If you'd rather spice them up a bit, you can set the border color, background and font. Note that you can also control the rounding of the borders, but this is currently set under <b>Full Theme Settings</b> - <b>Borders</b>",
		    styles:     ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
                    displayName: "Editors (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the mouse hovers over your editor, you can just do nothing (mouse cursor changes to insertion point). If you'd rather spice things up a bit, you might brighten or darken the background a bit. You can set the colors for border, background and font.",
		    styles:     ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
                    displayName: "Editors (Focus)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the insertion point is in the editor, and the user can start typing in, you can setup a style to indicate that the editor is active. Wavemaker themes tend to cause these editors to go to solid white background and black text.  But this is entirely under the control of the theme designer; you can set the colors for border, background and font.",
		    styles:     ["Border-Color", "Background", "Font-Color"]}}},

        "Dialogs": {
	    subcategories: {
		"Styles": {
                    displayName: "Basic Panel Styles",
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["PanelType", 
                             {name: "Border", 
                              symbol: "Dialogs-Styles-Border",
                              borders: [{borderClass: "wm.Dialog", borderProperty: "border"},// sadly, changing the prototype for wm.Dialog does NOT change its subclasses which were defined and set their prototypes before we get around to changing their parent class's prototype
                                        {borderClass: "wm.WidgetsJsDialog", borderProperty: "border"},
                                        {borderClass: "wm.GenericDialog", borderProperty: "border"},
                                        {borderClass: "wm.RichTextDialog", borderProperty: "border"},
                                        {borderClass: "wm.FileUploadDialog", borderProperty: "border"},
                                        {borderClass: "wm.PageDialog", borderProperty: "border"},
                                        {borderClass: "wm.DesignableDialog", borderProperty: "border"},
                                        {borderClass: "wm.ColorPickerDialog", borderProperty: "border"}
                                       ]},
                             "Background", 
                             "Font"],
                    description: "Styling your dialogs is done by determining which panel-type styles the contents of your dialog should use (should your dialogs be displayed using Main Content styles? Emphasized styles?  Plain Document styles?), and then setting up how your dialog's header and footer buttons should look."
                },
		"FooterButtonsDefault": {
                    displayName: "Bottom Buttons (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font", "BorderStyle-Shadow", "Background"],
                    description: "Buttons that are in the button bar on the bottom of a dialog are on a different background from other buttons in your theme.  Special background colors may be needed; and this is where you set them"
		},               
		"FooterButtonsHover": {
                    displayName: "Bottom Buttons (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "Buttons that are in the button bar on the bottom of a dialog are on a different hover background from other buttons in your theme.  Special background colors may be needed; and this is where you set them",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},

		"TitleButtonsDefault": {
                    displayName: "Top Buttons (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font-Color",  "BorderStyle-Shadow", "Background"],
                    description: "There are buttons in the title bar that show up for non-modal dialogs (create a dialog and uncheck the modal property).  Often, you will want these to look just like your footer buttons, but these buttons are much smaller and may need some different settings."
		},               
		"TitleButtonsHover": {
                    displayName: "Top Buttons (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "There are buttons in the title bar that show up for non-modal dialogs (create a dialog and uncheck the modal property).  Specify the hover behaviors of these buttons..",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]}}},

	

        "MainContent":  {
	    subcategories: {
		"Styles": {
                    displayName: "Basic Panel Styles",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "Set the basic styling of the MainContent panel and everything within it.  Font lets you set the basic font to use within your Main Content panel; border and background let you set the border style for your Main Content panel.  Note that border settings are for panels marked as MainContent, and NOT for the contents of thisis panel.",
		    styles: ["Font",  {name: "Border", borders: [{borderClass: "wm.MainContentPanel", borderProperty: "border"}]}, "BorderStyle", "Background"]},
		"ClickablesDefault": {
                    displayName: "Clickables (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Clickable settings affects the following widgets<ul><li>wm.Button</li><li>wm.AccordionLayer Headers</li><li>wm.TabLayer Tab Buttons</li><li>wm.FancyPanel/RoundedPanel Titlebar</li><li>wm.Dialog Titlebar and buttonbar</li><li>wm.Splitter</li><li>wm.Bevel</li></ul> It represents both clickable elements and minor headers. Why both? because in most cases, clickable elements Are headers; for example, consider the wm.AccordionLayer header and the wm.TabLayer buttons.</p><p>In this form, you will set the font and background colors for your headers and buttons.  This affects all buttons and headers within your MainContent panel.</p>",
		    styles: ["Font", "BorderStyle", "Background"]},               
		"ClickablesHover":   {
                    displayName: "Clickables (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Set the hover styling for any clickable widgets in your Main Content panel</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"ClickablesActive":  {
                    displayName: "Clickables (Active)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Set the active state styling for widgets in your Main Content panel that have active states.  These include wm.ToggleButton, and Accordion and TabLayer buttons.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},

		/* For Editors, the border in question is for the dijit (css) not the widget (border property) */
		"EditorsDefault": {
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "You of course have the option of having a plain and functional editor. If you'd rather spice up the editors in your Main Content Panel, you can set the border color, background and font.",
		    styles: ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
                    displayName: "Editors (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "Set the hover styling for your editors when they are in the Main Content Panel",
		    styles: ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
                    displayName: "Editors (Focus)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the insertion point is in a Main Content Panel editor, and the user can start typing in, you can setup a style to indicate that the editor is active. Wavemaker themes tend to cause these editors to go to solid white background and black text.  But this is entirely under the control of the theme designer; you can set the colors for border, background and font.",
		    styles: ["Border-Color", "Background", "Font-Color"]}}},
		

        "EmphasizedContent":  {
	    subcategories: {
		"Styles": {
                    displayName: "Basic Panel Styles",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "Set the basic styling of the EmphasizedContent panel and everything within it.  Font lets you set the basic font to use within your document; border and background let you set the border style for your document.  Note that border settings are for panels marked as EmphasizedContent, and NOT for the contents of thisis panel.  Also note that setting the border size and border color must be done by hand as these are properties of your panel.",
		    styles: ["Font",  {name: "Border", borders: [{borderClass: "wm.EmphasizedContentPanel", borderProperty: "border"}]}, "BorderStyle", "Background"]},
		"ClickablesDefault": {
                    displayName: "Clickables (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Clickable settings affects the following widgets <ul><li>wm.Button</li><li>wm.AccordionLayer</li><li>wm.TabLayer</li><li>wm.FancyPanel</li><li>wm.Dialog (title bar and buttons)</li><li>wm.Splitter</li><li>wm.Bevel</li></ul> It represents both clickable elements and headers. Why both? because in most cases, headers are clickable elements; for example, consider the wm.AccordionLayer header and the wm.TabLayer buttons.</p><p>In this form, you will set the font, border and background colors for your headers and buttons.  This affects all buttons and headers within any panel marked as <b>EmphasizedContent</b> except where the theme or a project specifically override these styles</p>",
		    styles: ["Font", "BorderStyle", "Background"]},               
		"ClickablesHover":   {
                    displayName: "Clickables (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Any header that is clickable should have a mouse-over effect that emphasizes its clickability.  A header that is NOT clickable will ignore mouseover effects.</p><p>In this form, you will set the changes to font, shadowing and background colors that are displayed when the mouse hovers over your headers/buttons.  Shadowing is particularly useful for making a button look pressable as it gives it a more three dimensional look.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"ClickablesActive":  {
                    displayName: "Editors (Hover)",
                    displayName: "Clickables (Active)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Any header that has an active state will want a special set of styling to indicate that its active.  Examples of this include a wm.TabLayers button that indicates the currently selected tab; wm.AccordionLayers header that indicates the currently selected layer, and a wm.ToggleButton which is currently pressed.</p><p>Set the font, shadowing and background colors to emphasize that this clickable header is currently active.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"EditorsDefault": {
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "You of course have the option of having a plain and functional editor. If you'd rather spice them up a bit, you can set the border color, background and font. Note that you can also control the rounding of the borders, but this is currently set under <b>Full Theme Settings</b> -> <b>Borders</b>",
		    styles: ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
                    displayName: "Editors (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the mouse hovers over your editor, you can just do nothing (mouse cursor changes to insertion point). If you'd rather spice things up a bit, you might brighten or darken the background a bit. You can set the colors for border, background and font.",
		    styles: ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
                    displayName: "Editors (Focus)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the insertion point is in a Emphasized Content Panel editor, and the user can start typing in, you can setup a style to indicate that the editor is active. Wavemaker themes tend to cause these editors to go to solid white background and black text.  But this is entirely under the control of the theme designer; you can set the colors for border, background and font.",
		    styles: ["Border-Color", "Background", "Font-Color"]}
	    }
	},

        "HeaderContent":  {
	    subcategories: {
		"Styles": {
                    displayName: "Basic Panel Styles",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "Set the basic styling of the ToolbarContent panel and everything within it.  Font lets you set the basic font to use within your document; border and background let you set the border style for your document.  Note that border settings are for panels marked as ToolbarContent, and NOT for the contents of thisis panel.  Also note that setting the border size and border color must be done by hand as these are properties of your panel.",
		    styles: ["Font",  {name: "Border", borders: [{borderClass: "wm.HeaderContentPanel", borderProperty: "border"}]}, "BorderStyle", "Background"]},
		"ClickablesDefault": {
                    displayName: "Clickables (Default)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Clickable settings affects the following widgets <ul><li>wm.Button</li><li>wm.AccordionLayer</li><li>wm.TabLayer</li><li>wm.FancyPanel</li><li>wm.Dialog (title bar and buttons)</li><li>wm.Splitter</li><li>wm.Bevel</li></ul> It represents both clickable elements and headers. Why both? because in most cases, headers are clickable elements; for example, consider the wm.AccordionLayer header and the wm.TabLayer buttons.</p><p>In this form, you will set the font, border and background colors for your headers and buttons.  This affects all buttons and headers within any panel marked as <b>ToolbarContent</b> except where the theme or a project specifically override these styles</p>",
		    styles: ["Font", "BorderStyle", "Background"]},               
		"ClickablesHover":   {
                    displayName: "Clickables (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Any header that is clickable should have a mouse-over effect that emphasizes its clickability.  A header that is NOT clickable will ignore mouseover effects.</p><p>In this form, you will set the changes to font, shadowing and background colors that are displayed when the mouse hovers over your headers/buttons.  Shadowing is particularly useful for making a button look pressable as it gives it a more three dimensional look.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"ClickablesActive":  {
                    displayName: "Editors (Hover)",
                    displayName: "Clickables (Active)",                    
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "<p>Any header that has an active state will want a special set of styling to indicate that its active.  Examples of this include a wm.TabLayers button that indicates the currently selected tab; wm.AccordionLayers header that indicates the currently selected layer, and a wm.ToggleButton which is currently pressed.</p><p>Set the font, shadowing and background colors to emphasize that this clickable header is currently active.</p>",
		    styles: ["Font-Color", "BorderStyle-Shadow", "Background"]},
		"EditorsDefault": {
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "You of course have the option of having a plain and functional editor. If you'd rather spice them up a bit, you can set the border color, background and font. Note that you can also control the rounding of the borders, but this is currently set under <b>Full Theme Settings</b> -> <b>Borders</b>",
		    styles: ["Border-Color", "Background", "Font"]},
		"EditorsHover":   {
                    displayName: "Editors (Hover)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the mouse hovers over your editor, you can just do nothing (mouse cursor changes to insertion point). If you'd rather spice things up a bit, you might brighten or darken the background a bit. You can set the colors for border, background and font.",
		    styles: ["Border-Color", "Background", "Font-Color"]},
		"EditorsFocus":   {
                    displayName: "Editors (Focus)",
		    demo: "themeGroupDemoAllPanelsWidgets",
                    description: "When the insertion point is in a Header Content Panel editor, and the user can start typing in, you can setup a style to indicate that the editor is active. Wavemaker themes tend to cause these editors to go to solid white background and black text.  But this is entirely under the control of the theme designer; you can set the colors for border, background and font.",
		    styles: ["Border-Color", "Background", "Font-Color"]}
	    }
	},

        /* Table row/cell borders are handled by css, not properties */
        "Tables": {
	    subcategories: {
		"EvenRows": {
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font", "Background-Color", "Border"]},
		"OddRows":   {
		    demo: "themeGroupDemoAllPanelsWidgets",
		    styles: ["Font-Color", "Background-Color"]}
            }}
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
/*
        var listitem = this.themeList.getItemByFieldName("dataValue", studio.application.theme);
        this.themeList.eventSelect(listitem);
*/
	this.themeSelect.setDataValue(studio.application.theme);

        dojo.query("a", this.themeGroupList.domNode).forEach(dojo.hitch(this,function(node, index, arr) {
            this.connect(node, "onclick", this, function(event) {
                if (this.themeGroupListVar.getItem(index).getData().description) {
                    studio.helpDialog.setUserPrompt(this.themeGroupListVar.getItem(index).getData().description);
                    studio.helpDialog.show();
                }
                dojo.stopEvent(event);
            });
        }));
    },

    initThemeGroupList: function() {
	var items = this.themeGroupList.items;
	var values = this.themeGroupListVar.getData();
	for (var i = 0; i < values.length; i++) {
	    if (!values[i].dataValue)
		dojo.addClass(items[i].domNode, "ThemeListHeader");
	    else
		dojo.addClass(items[i].domNode, "ThemeListItem");
	}
/*
	var inputs = [dojo.byId("MainContentEnabled"),dojo.byId("EmphasizedContentEnabled"), dojo.byId("HeaderContentEnabled")];
	dojo.forEach(inputs, dojo.hitch(this,function(input) {
		dojo.connect(input, "onchange", this, function(e) {
		    dojo.stopEvent(e);
		    this.setSectionEnabled(input.id.replace(/Enabled/,""), input.checked);
		});
	}));
        */
/*
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
/ *
		    this.themeData[input.id + "-Enabled"] = input.checked;
		    this.cssText = this.cssText.replace(/(\@media )(screen|disabled)/, "$1" + ((input.checked) ? "screen" : "disabled"));
		    studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
		    * /
		});
	}));
    */
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
        this.currentTheme = inSender.getDataValue();
        studio.beginWait("Loading Theme...");
        wm.onidle(this, function() {
            /* Step 1: Find out what theme was selected! */
            /* Step 1a: enable/disable delete button; this could go anywhere in the process */
            studio.themesPageDeleteBtn.setDisabled(this.currentTheme.match(/^wm_/));

            /* Step 2: Set the class of the demo panel to the new theme so the demo widgets will get the proper classpath */
	    for (var i = 0; i < this.demoPanelTabLayers.layers.length; i++) 
                this.demoPanelTabLayers.layers[i].domNode.className = this.currentTheme;

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
            console.log("THEME:" + this.currentTheme);
	    if (this.currentTheme.match(/^wm_/))
	        path = dojo.moduleUrl("wm") + "base/widget/themes/" + this.currentTheme + "/";
	    else
	        path = dojo.moduleUrl("common") + "themes/" + this.currentTheme + "/";

            /* Step 5: Load the theme.css file and store it in this.cssText, and load the css so it affects the demo panel */
	    var originalCssText =  dojo.xhrGet({url:path + "theme.css", sync:true, preventCache:true}).results[0];
	    var templateCssText =  "";
	    var stylesheets = ["theme.css", "buttons.css", "calendar.css", "dialog.css", "editors.css", "grid.css", "menus.css", "panels.css", "progressbar.css", "splitterbevel.css"];
	    for (var i = 0; i < stylesheets.length; i++) {
	        templateCssText += "/*****************************************\n * FILE: " + stylesheets[i] + "\n *****************************************/\n" + 
		    dojo.xhrGet({url:dojo.moduleUrl("wm.studio.app") + "templates/themes/" + stylesheets[i], sync:true, preventCache:true}).results[0] +
		    "/*****************************************\n * EOF: " + stylesheets[i] + "\n *****************************************/\n";
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

	    /* this.cssText must be set before calling these 
	       this.setSectionEnabled("MainContent", this.themeData["MainContent-Enabled"]);
	       this.setSectionEnabled("EmphasizedContent", this.themeData["EmphasizedContent-Enabled"]);
	       this.setSectionEnabled("TOCContent", this.themeData["TOCContent-Enabled"]);
	       this.setSectionEnabled("ToolbarContent", this.themeData["ToolbarContent-Enabled"]);

	       dojo.byId("MainContentEnabled").checked = this.themeData["MainContent-Enabled"];
	       dojo.byId("EmphasizedContentEnabled").checked = this.themeData["EmphasizedContent-Enabled"];    
	       dojo.byId("TOCContentEnabled").checked = this.themeData["TOCContent-Enabled"];
	       dojo.byId("ToolbarContentEnabled").checked = this.themeData["ToolbarContent-Enabled"];
	    */

            /* Step 8: Load the Theme.js file and store it in this.themePrototype */
	    this.themePrototype =  dojo.fromJson(dojo.xhrGet({url:path + "Theme.js", sync:true, preventCache:true}).results[0]);
            for (var i in this.themePrototype) {
                try {
	        var propHash = this.themePrototype[i];
	        var prototype = dojo.getObject(i).prototype;
	        for (var j in propHash) {
		    console.log("SET " + i + "." + j + ": " + propHash[j]);
		    prototype[j] = propHash[j];
	        }
                } catch(e) {
                    console.error("Failed to set prototype of " + i + ": " + e);
                }
	    }
	    
            /* Step 8: Load the new css values into the document */
            studio.application.setTheme(this.currentTheme, false, this.cssText, this.themePrototype, true);
            studio._themeDesignerChange = true;
            studio._reflowPageDesigner = true;
            studio.application.cacheWidgets();
            this.setDirty(false);


            /* Step 9: Make sure the theme group list has something selected so that the user can see a response to their theme selection */
            this.themeGroupList.eventSelect((this.themeGroupList.selectedItem.getData()) ? this.themeGroupList.items[this.themeGroupList.getSelectedIndex()] : this.themeGroupList.items[0]);
            studio.endWait();
        });
    },

    /* Obsolete */
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
            this.regenerateDemoPanel(null,null,true);
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
            this.regenerateDemoPanel(null,null,true);
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


        new wm.Label({name: "editorsHeading", caption: "Quick Theme Creator", width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});

        var container;
        var editors = [];
        new wm.Label({caption: "Borders",
                      width: "75px",
                      height: "20px",
		      margin: "5,0,0,0",
                      owner: this,
                      parent: this.widgetEditPanel});
        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", margin: "0,0,15,0", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left"});
        new wm.Spacer({
                      width: "20px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "borderColor",
                                         captionSize: "15px",
                                         caption: "Color",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: wm.FancyPanel.prototype.borderColor,
                                         width: "65px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "borderRadius",
                                         captionSize: "15px",
                                         caption: "Radius",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                    dataValue: this.getThemeDataValue("Document-ClickablesDefault-BorderStyle", "Radius","").replace(/\D/g,""),
				         minimum: 0,
				         maximum: 40,
                                         width: "80px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "borderWidth",
                                    captionSize: "15px",
                                    caption: "Width",
                                    captionPosition: "bottom",
				    captionAlign: "left",
                                    dataValue:  wm.FancyPanel.prototype.innerBorder,
				         minimum: 0,
				         maximum: 20,
                                    width: "80px",
                                    height: "100%",
                                    owner: this,
                                    parent: container,
                                    readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        new wm.Label({caption: "Page Style",
                      width: "75px",
                      height: "20px",
		      margin: "5,0,0,0",
                      owner: this,
                      parent: this.widgetEditPanel});

        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", margin: "0,0,15,0", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left"});
        new wm.Spacer({
                      width: "20px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "pageBackgroundColor",
                                         captionSize: "15px",
                                         caption: "Background",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: this.getThemeDataValue("Document-Styles-Background", "Color",""),
                                         width: "75px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.ColorPicker({name: "pageFontColor",
                                         captionSize: "15px",
                                         caption: "Color",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: this.getThemeDataValue("Document-Styles-Font", "Color",""),
                                         width: "65px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "pageFontSize",
                                         captionSize: "15px",
                                         caption: "TextSize",
                                         captionPosition: "bottom",
					 captionAlign: "left",
				         minimum: 6,
				         maximum: 30,
                                    dataValue: this.getThemeDataValue("Document-Styles-Font", "TextSize","").replace(/\D/g,""),
                                         width: "55px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

	editors.push(new wm.SelectMenu({name: "headerFontFamily",
                                         captionSize: "15px",
                                         caption: "Family",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: this.getThemeDataValue("Document-Styles-Font", "Family",""),
					 options: this.themeTypes.Family[1].options,
                                         width: "90px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                        readonly: Boolean(this.currentTheme.match(/^wm_/))}));


        new wm.Label({caption: "Clickable Styles",
                      width: "75px",
                      height: "20px",
		      margin: "5,0,0,0",
                      owner: this,
                      parent: this.widgetEditPanel});
        container = new wm.Panel({layoutKind: "left-to-right", height: "50px", margin: "0,0,15,0", width: "100%", owner: this, parent: this.widgetEditPanel, verticalAlign: "top", horizontalAlign: "left"});
        new wm.Spacer({
                      width: "20px",
                      height: "100%",
                      owner: this,
                      parent: container});
        editors.push(new wm.ColorPicker({name: "headerBackgroundColor",
                                         captionSize: "15px",
                                         caption: "Background",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: this.getThemeDataValue("Document-ClickablesDefault-Background", "Color",""),
                                         width: "75px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));
        var widget_json = this.themeTypes["Image"];
        var val = 
            this.getThemeDataValue("Document-ClickablesDefault-Background", "Image-Repeat") + "," +
            this.getThemeDataValue("Document-ClickablesDefault-Background", "Image-Position") + "," +
            this.getThemeDataValue("Document-ClickablesDefault-Background", "Image");
        var imageSelect = container.createComponent("headerImage",
						    widget_json[0], 
						    dojo.mixin({caption: "Clickable Image", 
								captionPosition: "bottom",
                                                                dataValue: val}, dojo.mixin(props, widget_json[1]), {width: "100px"}),
						    {},
						    widget_json[3], this);
						   
	editors.push(imageSelect);
        var val =  this.getThemeDataValue("Document-ClickablesDefault-Font", "Color","");
        editors.push(new wm.ColorPicker({name: "headerFontColor",
                                         captionSize: "15px",
                                         caption: "Color",
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                         dataValue: val,
                                         width: "65px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));

        editors.push(new wm.Number({name: "headerFontSize",
                                         captionSize: "15px",
                                         caption: "TextSize",
				         minimum: 6,
				         maximum: 30,
                                         captionPosition: "bottom",
					 captionAlign: "left",
                                    dataValue: this.getThemeDataValue("Document-ClickablesDefault-Font", "TextSize","").replace(/\D/g,""),
                                         width: "55px",
                                         height: "100%",
                                         owner: this,
                                         parent: container,
                                         readonly: Boolean(this.currentTheme.match(/^wm_/))}));


        new wm.Label({caption: "Everything you need to create a basic theme can be found here. To create a more sophisticated theme, you'll need to try the settings in 'Full Theme Settings' and 'Advanced Settings'.  If you change font sizes for headers and Accordions and FancyPanels stop fitting, you may need to go to 'Widget Settings' to adjust the size of your Accordions and FancyPanel titles.",
		      singleLine: false,
                      width: "100%",
                      height: "100%",
		      margin: "25,10,0,10",
                      owner: this,
                      parent: this.widgetEditPanel});

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

        //this.createSaveThemeButtonPanel();
        this.widgetEditPanel.reflow();                    
        this.regenerateDemoPanel(null,null,true);
	this.themeSubGroupList.hide();
	this.widgetList.hide();
    },

    /* Handle changes to the basic settings editors */
    basicEditorChange: function(inSender) {
        studio.beginWait("Updating Stylesheets...");

        // wrap everything in wm.onidle so that the wait dialog has a moment to render before we begin
        wm.onidle(this, function() {
        try {
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
            this.regenerateDemoPanel(null,null,false);
            break;

        case "borderWidth":
            var borders = [];
             
            borders = borders.concat(this.themeGroupData.Borders.styles[2].borders);
            borders = borders.concat(this.themeGroupData.Borders.styles[3].borders);
            borders = borders.concat(this.themeGroupData.Dialogs.subcategories.Styles.styles[1].borders);
            borders.push({borderClass: "wm.HeaderContentPanel", borderProperty: "border"});
            borders.push({borderClass: "wm.EmphasizedContentPanel", borderProperty: "border"});
            borders.push({borderClass: "wm.EmphasizedContentPanel", borderProperty: "border"});

            for (var i = 0; i < borders.length; i++) {
                var widgetClassName = borders[i].borderClass;
                var borderProperty = borders[i].borderProperty;
		if (borderProperty.match(/Color/)) continue;
                var borderTemplate = borders[i].borderTemplate;
                var newValue = (borderTemplate && borderProperty.match(/border$/i)) ? borderTemplate.replace(/\?/g, value) : value;
                if (!this.themePrototype[widgetClassName]) 
                    this.themePrototype[widgetClassName] = {};
                this.themePrototype[widgetClassName][borderProperty] = newValue;
                var ctor = dojo.getObject(widgetClassName);
                if (ctor && ctor.prototype) {
                    studio.application.loadThemePrototypeForClass(ctor); // make sure the prototype is loaded before we start editting it
                    if (widgetClassName != "wm.Panel" || borderProperty != "border") // never set the border for wm.Panel! borderColor is ok...
                        ctor.prototype[borderProperty] = newValue;
                }
            }

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            this.regenerateDemoPanel(null,null,false);
            break;

        case "borderRadius":
            var newValue = value + "px";
	    this.setCssSymbol("Borders-Panel_BorderStyle", "Radius", newValue);
	    this.setCssSymbol("Document-ClickablesDefault_BorderStyle", "Radius", newValue);

            for (var i = 1; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-BorderStyle", "Radius",newValue);
	        this.setCssSymbol(this.panelTypes[i] + "-Styles-BorderStyle", "Radius",newValue);
            }

            newValue = Math.floor(value * 0.6) + "px";
            

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            
            break;

        case "headerBackgroundColor":
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Background", "Color", value);
            }
            var newvalues = this.offsetColor(value);

	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Background", "Color", value);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Background", "Color", newvalues[0]);

            // title buttons will always be just white
	    this.setCssSymbol("Dialogs-TitleButtonsDefault-Background", "Color", "#ffffff");
	    this.setCssSymbol("Dialogs-TitleButtonsHover-Background", "Color", "#dddddd");


            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Background", "Color", newvalues[0]);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Background", "Color", newvalues[2]);
            }

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;

        case "headerFontColor":
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Font", "Color", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Font", "Color", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Font", "Color", value);
            }

	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Font", "Color", value);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Font", "Color", value);

            // Title buttons will always just be black font
	    this.setCssSymbol("Dialogs-TitleButtonsDefault-Font", "Color", "#000000");
	    this.setCssSymbol("Dialogs-TitleButtonsHover-Font", "Color", "#000000");

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;

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

            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Background", "Image", url);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Background", "Image-Repeat", repeat);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Background", "Image-Position", position);
            }
	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Background", "Image", url);
	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Background", "Image-Position", position);

            // No background image for the  titlebar buttons
	    this.setCssSymbol("Dialogs-TitleButtonsDefault-Background", "Image", "none");
	    this.setCssSymbol("Dialogs-TitleButtonsDefault-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Dialogs-TitleButtonsDefault-Background", "Image-Position", position);

	    if  (url.match(/\d/)) {
		var numb = parseInt(url.match(/\d/)[0]);
		if (numb > 0) {
		    numb--;
		    url = url.replace(/\d/, numb);
		}
	    }
	    
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Background", "Image", url);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Background", "Image-Repeat", repeat);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Background", "Image-Position", position);
            }

	    this.setCssSymbol("Dialogs-FooterButtonsHover-Background", "Image", url);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Background", "Image-Repeat", repeat);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Background", "Image-Position", position);


	    if  (url.match(/\d/)) {
		var numb = parseInt(url.match(/\d/)[0]);
		if (numb > 0) {
		    numb--;
		    url = url.replace(/\d/, numb);
		}
	    }

            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Background", "Image", url);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Background", "Image-Repeat", repeat);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Background", "Image-Position", position);
            }

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;

        case "headerFontSize":
	    value += "pt";
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Font", "TextSize", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Font", "TextSize", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Font", "TextSize", value);
            }
	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Font", "TextSize", value);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Font", "TextSize", value);

	    this.setCssSymbol("Dialogs-Styles-Font", "TextSize", value);

            // don't set the font size for the titlebar buttons; tends to mess with the position of the "x" and "-" in the buttons

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;

        case "headerFontFamily":
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesDefault-Font", "Family", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesHover-Font", "Family", value);
	        this.setCssSymbol(this.panelTypes[i] + "-ClickablesActive-Font", "Family", value);
            }
	    this.setCssSymbol("Dialogs-FooterButtonsDefault-Font", "Family", value);
	    this.setCssSymbol("Dialogs-FooterButtonsHover-Font", "Family", value);

            // don't mess with the font for the titlebar buttons

	    // Also sets the page font face; if the user wants something other than a single font face for their app, go advanced
            for (var i = 0; i < this.panelTypes.length; i++) 
	        this.setCssSymbol(this.panelTypes[i] + "-Styles-Font", "Family", value);
	    this.setCssSymbol("Dialogs-Styles-Font", "Family", value);

            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;

        case "pageBackgroundColor":
            for (var i = 0; i < this.panelTypes.length; i++) 
	        this.setCssSymbol(this.panelTypes[i] + "-Styles-Background", "Color", value);


            var newvalues = this.offsetColor(value);
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-EditorsDefault-Background", "Color", newvalues[0]);
	        this.setCssSymbol(this.panelTypes[i] + "-EditorsHover-Background", "Color", newvalues[1]);
	        this.setCssSymbol(this.panelTypes[i] + "-EditorsFocus-Background", "Color", "#FFFFFF");
            }

	    this.setCssSymbol("Tables-EvenRow-Background", "Color", value);
	    this.setCssSymbol("Table-OddRow-Background", "Color", newvalues[0]);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;
        case "pageFontColor":
            for (var i = 0; i < this.panelTypes.length; i++) 
	        this.setCssSymbol(this.panelTypes[i] + "-Styles-Font", "Color", value);

            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-Editors-Default-Font", "Color", value);
	        this.setCssSymbol(this.panelTypes[i] + "-Editors-Hover-Font", "Color", value);
	        this.setCssSymbol(this.panelTypes[i] + "-Editors-Focus-Font", "Color", "#000000");
            }

	    this.setCssSymbol("Table-EvenRow-Font", "Color", value);
	    this.setCssSymbol("Table-OddRow-Font", "Color", value);
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;
        case "pageFontSize":
	    value += "pt";
            for (var i = 0; i < this.panelTypes.length; i++) {
	        this.setCssSymbol(this.panelTypes[i] + "-Styles-Font", "TextSize", value);
	        this.setCssSymbol(this.panelTypes[i] + "-Editors-Default-Font", "TextSize", value);
            }
            studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
            break;
        }
        } catch(e){}
        studio.endWait();
        });
    },

    themegroupselect: function(inSender) {
        this.widgetEditPanel.removeAllControls();
        if (this._descConnections) {
            dojo.forEach(this._descConnections, dojo.disconnect);
        }
        this._descConnections = [];

        var groupName = inSender.selectedItem.getData().dataValue;
	if (!groupName) return;
	if (groupName == "Basic") 
	    return this.generateBasicEditor();
	else if (groupName == "Widgets") {
 	    this.themeSubGroupList.hide();
	    this.widgetList.show();
	    if (this.widgetList.getSelectedIndex() == -1)
		this.widgetList.eventSelect(this.widgetList.getItem(0));
	    else
		this.widgetselect(inSender);
	    return;
	}
	this.widgetList.hide();

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
                                   name: subcategories[i].displayName || i.replace(/-/g," "),
                                   help: "<a>?</a>",
                                   description: subcategories[i].description});
            }	    
	    this.themeSubGroupListVar.setData(subgroupList);
            this.themeSubGroupList.setDataSet(this.themeSubGroupListVar);
            if (this._subgroupConnections) 
                dojo.forEach(this._subgroupConnections, dojo.disconnect);
            this._subgroupConnections = [];

            dojo.query("a", this.themeSubGroupList.domNode).forEach(dojo.hitch(this,function(node, index, arr) {
                this._subgroupConnections.push(dojo.connect(node, "onclick", this, function(event) {
                    if (this.themeSubGroupListVar.getItem(index).getData().description) {
                        studio.helpDialog.setUserPrompt(this.themeSubGroupListVar.getItem(index).getData().description);
                        studio.helpDialog.show();
                    }
                    dojo.stopEvent(event);
                }));
            }));
            

            this.themeSubGroupList.eventSelect( this.themeSubGroupList.items[selectedSubGroupIndex]);
	    this.themeSubGroupListCurrentGroup = this.themeGroupList.getSelectedIndex();

	    this.themeSubGroupList.show();

            if (this.themeSubGroupList.getSelectedIndex() < 0) { 
		this.themeSubGroupList.eventSelect( this.themeSubGroupList.items[0]);
	    }
	    return;
	} 
    /*
	if (this._lastDemoPanel != groupObj.demo) {	    
           this.regenerateDemoPanel(this[groupObj.demo]);
	    this._lastDemoPanel = groupObj.demo;
	}
*/
            this.regenerateDemoPanel(null,null,true);


	if (inSender != this.themeSubGroupList)
	    this.themeSubGroupList.hide();
	else
	    fullGroupName = groupObj.parentName +"-" + groupName;

	var labelHeading = "";
	var settingList = this.themeGroupListVar.getData();
	var settingListIndex = this.themeGroupList.getSelectedIndex();
	for (var i = settingListIndex-1; i >= 0; i--) {
	    if (!settingList[i].dataValue) {
		labelHeading = settingList[i].name + ": ";
		break;
	    }
	}
        new wm.Label({name: "editorsHeading", caption: labelHeading + fullGroupName, width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});


        dojo.forEach(groupObj.styles, dojo.hitch(this,function(styleGroupElement) {
            var subGroupName;
            var description = "";
            if (dojo.isString(styleGroupElement)) {
                subGroupName = styleGroupElement;
            } else {
                subGroupName = styleGroupElement.name;
                description = styleGroupElement.description;
            }

            var styleFilter = "";
            if (subGroupName.indexOf("-") != -1) {
                styleFilter = subGroupName.substring(1 + subGroupName.indexOf("-"));
                subGroupName = subGroupName.substring(0, subGroupName.indexOf("-"));
            }
            var styleList = this.themeGroupTypes[subGroupName.replace(/^.*_/,"")];

            var label = new wm.Label({width: "100%", height: "20px", margin: "5,0,0,0", caption: subGroupName.replace(/_/g," ") + (description ? " <a>?</a>" : ""), parent: this.widgetEditPanel, owner: this});
            if (description) {
                this._descConnections.push(dojo.connect(dojo.query("a",label.domNode)[0], "onclick", this, function() {
                    studio.helpDialog.setUserPrompt(description);
                    studio.helpDialog.show();
                }));
            }
            var container = new wm.Panel({layoutKind: "left-to-right", height: "50px", margin: "0,0,15,0", width: "100%", parent: this.widgetEditPanel, owner: this});
	    new wm.Spacer({width: "20px", height: "100%", owner: this, parent: container});
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

        }));


        //var buttonpanel = this.createSaveThemeButtonPanel();

	var selectedLevel = this.themeGroupList.selectedItem.getData().dataValue;
	if (selectedLevel.match(/Content$/) && !this.currentTheme.match(/^wm_/)) {
	    new wm.Label({width: "100%", height: "50px", parent: this.widgetEditPanel, owner: this, singleLine: false, caption: "Use the controls below to copy styles from another panel type; select the panel type to copy from and either copy all styles for that group, or just update just the values shown above."});
	    var buttonpanel = new wm.Panel({layoutKind: "left-to-right", width: "100%", height: "80px", owner: this, parent: this.widgetEditPanel, margin: "10,5,10,5", verticalAlign: "top", horizontalAlign: "right"});

	    var contentOptions = new wm.SelectMenu({owner: this,
						    parent: buttonpanel,
						    caption: "Copy settings from",
                                                    captionPosition: "top",
                                                    captionAlign: "left",
                                                    captionSize: "15px",
						    width: "150px",
						    height: "40px",
						    dataValue: "Document",
						    options: wm.Array.removeElement(["Document", "MainContent", "EmphasizedContent", "HeaderContent"], selectedLevel).join(",")});
	    var copyButton = new wm.Button({_classes: {domNode: ["themeButton"]}, owner: this, parent: buttonpanel, caption: "Copy", width: "100%", margin: "3", height: "40px",disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
	    var copyAllButton = new wm.Button({_classes: {domNode: ["themeButton"]}, owner: this, parent: buttonpanel, caption: "Copy All", width: "100%", margin: "3", height: "40px",disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
            
	    copyButton.connect(copyButton, "onclick", this, function() {
                studio.beginWait("Copying...");
                wm.onidle(this, function() {
		    this.copyStyleSettings(contentOptions.getDataValue(), this.themeGroupList.selectedItem.getData().dataValue);
                });
	    });
	    copyAllButton.connect(copyAllButton, "onclick", this, function() {
                studio.beginWait("Copying...");
                wm.onidle(this, function() {
		    this.copyAllStyleSettings(contentOptions.getDataValue(), this.themeGroupList.selectedItem.getData().dataValue);
                });
	    });
/*
	    contentOptions.connect(contentOptions, "onchange", this, function() {
		copyButton.setCaption("Copy " + contentOptions.getDataValue() + " Settings");
	    });
            */
	}

        wm.onidle(this.widgetEditPanel,"reflow");
    },
/*
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
*/
    copyStyleSettings: function(copyFromGroup, copyToGroup, optionalSubGroup) {
        try {
	var name = optionalSubGroup || this.themeSubGroupList.selectedItem.getData().dataValue;
	var data = this.themeData;
	for (var i in data) {
	    var items = i.split("-");
	    var group = items.shift();
	    if (group == copyFromGroup && items[0] == name) {
		for (var j in data[i]) {
		    this.setCssSymbol(copyToGroup + "-" + items.join("-"), j,data[i][j]);
		}
	    }
	}
	this.themegroupselect(this.themeSubGroupList); // regenerate the editors with new values -- could just call setDataValue
        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
    }
        catch(e) {}
        finally {
            studio.endWat();
        }
    },
    copyAllStyleSettings: function(copyFromGroup, copyToGroup) {
        try {
	var data = this.themeData;
	for (var i in data) {
	    var items = i.split("-");
	    var group = items.shift();
            if (group == copyFromGroup) {
		for (var j in data[i]) {
		    this.setCssSymbol(copyToGroup + "-" + items.join("-"), j,data[i][j]);
		}
	    }
	}
	this.themegroupselect(this.themeSubGroupList); // regenerate the editors with new values -- could just call setDataValue
        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
        } 
        catch(e) {}
        finally {
            studio.endWat();
        }
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
	else if (styleName == "BorderSize" && groupName == "Tables-EvenRows")
	    value += "px";

        if (styleName == "PanelStylePicker") {
            var dialogTypes = ["wm.Dialog", "wm.WidgetsJsDialog", "wm.RichTextDialog", "wm.GenericDialog", "wm.FileUploadDialog", "wm.PageDialog", "wm.DesignableDialog"];
            for (i = 0; i < dialogTypes.length; i++) {
                if (!this.themePrototype[dialogTypes[i]])
                    this.themePrototype[dialogTypes[i]] = {};
                this.themePrototype[dialogTypes[i]].containerClass = value;
                dojo.getObject(dialogTypes[i]).prototype.containerClass = value;
            }
	    this.setCssSymbol(groupName + "-" + subGroupName, styleName, value);
            this._prototypeChanged = true;
        } else if (styleName != "Image") {
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
            this.regenerateDemoPanel(null,null,false);
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

        //this.createSaveThemeButtonPanel();
        this.widgetEditPanel.reflow();
    },

    generatePrototypeEditor: function(name, ctor) {
        new wm.Label({name: "mainPanel1Label", caption: "Widget Settings: " + name, width: "100%", height: "24px", parent: this.widgetEditPanel, owner: this, backgroundColor: "black"});
        if (!this.themePrototype[name]) this.themePrototype[name] = {};
        var editableProps = ctor.prototype.themeableProps || [];
        if (editableProps.length)
            dojo.forEach(editableProps, dojo.hitch(this, function(p) {
		var props = {captionSize: "120px", captionAlign: "left",  padding: "2,5,2,5", caption: p, dataValue: this.themePrototype[name][p] || ctor.prototype[p], width: "100%", height: "20px", owner: this, parent: this.widgetEditPanel, name: p, readonly: Boolean(this.currentTheme.match(/^wm_/))};
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
                    studio.application.loadThemePrototypeForClass(ctor); // make sure the prototype is loaded before we start editting it
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
            var name, displayName;
            if (dojo.isString(widgetStyles[i])) {
                name = displayName = widgetStyles[i];
                displayName = displayName.replace(/^\-/,"");
            } else {
                name = widgetStyles[i].name;
                displayName = widgetStyles[i].displayName;                
            }

            if (name.match(/^\-/)) {
                name = name.replace(/^\-/,"");
                new wm.Label({name: name,
			      caption: displayName,
			      parent: this.widgetEditPanel,
			      owner: this,
			      height: "24px",
			      width: "100%",
			      border: "0,0,1,0",
			      borderColor: "black",
			      margin: "8,2,2,2"});
            } else {
                var matches = name.match(/^(.*?)_(.*)$/);
                var groupname = matches[1];
                var stylename = matches[2];
                if (!this.themeData[groupname]) this.themeData[groupname] = {};
                this.addThemeEditor(stylename, displayName || styleName, (stylename == "Image") ? this.themeData[groupname]["Image-Repeat"] + "," + this.themeData[groupname]["Image-Position"] + "," + this.themeData[groupname]["Image"] : this.themeData[groupname][stylename], groupname, this.widgetEditPanel);
		//this.addThemeEditor(stylename, this.themeData[groupname][stylename], groupname, this.widgetEditPanel);
            }
        }
    },
/*
    createSaveThemeButtonPanel: function() {
        var buttonPanel = new wm.Panel({layoutKind: "left-to-right", width: "100%", height: "80px", owner: this, parent: this.widgetEditPanel, margin: "10,5,10,5"});
        var savebutton = new wm.Button({_classes: {domNode: ["themeButton"]}, caption: "Save " + this.currentTheme, width: "50%", height: "100%", owner: this, parent: buttonPanel, disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
        savebutton.connect(savebutton, "onclick", this, "saveTheme");

        var revertbutton = new wm.Button({_classes: {domNode: ["themeButton"]}, caption: "Revert", width: "50%", height: "100%", owner: this, parent: buttonPanel, disabled: this.currentTheme.match(/^wm_/), border: 2, borderColor: "#262b34"});
        revertbutton.connect(revertbutton, "onclick", this, "revertTheme");
	return buttonPanel;
    },
    */
    regenerateADemo: function(inSender) {
	if (this.themeGroupList.selectedItem.getData().dataValue == "Widgets")
	    this.widgetselect(inSender);
	else 
            this.regenerateDemoPanel(null,null,false);
    },
    showDemoWidget: function(name, ctor) {
        var overviewLayers = [this.pageWithTopNavLayer, this.pageWithSideNavLayer, this.pageWithNoNavLayer];
        dojo.forEach(overviewLayers, function(l) {l.hide();});
	this.viewWidgetsLayer.hide();
	this.viewOneWidgetLayer.setCaption(name);
	this.viewOneWidgetLayer.show();
	this.viewOneWidgetLayer.activate();

	var demoPanel = this.demoPanel4;
        demoPanel.removeAllControls();
	this.owner = studio.page; // block Application.loadThemePrototypeForClass from using wm_studio to generate the widget
        demoPanel.domNode.innerHTML = "";
        var o = this._create(ctor, {margin: (name == "wm.Layout") ? "0" : "0,20,0,20", owner: this, parent: demoPanel, width: "100%", height: "200px", caption: "Caption"});
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
            o.addLayer("layer3");
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
            demoPanel.domNode.appendChild(o.domNode);
            o.show();
        } else
            demoPanel.reflow();
    },

    addThemeEditor: function(inName, inDisplayName, inValue, inGroupName, parent, showGroupName) {
        var props = {captionSize: "120px", captionAlign: "left", padding: "2,5,2,5", caption: inDisplayName || (((showGroupName) ? inGroupName + "-" : "") + inName), dataValue: inValue, width: "100%", height: "20px", owner: this, parent: parent, name: inGroupName + "__" + inName, readonly: this.currentTheme.match(/^wm_/)};
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
        case "HoverShadow":
        case "SelectedShadow":
        case "UnselectedShadow":
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
                    if (!String(value).match(/px/))
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
	var matchstr2 = "^\\s*@media (screen|disabled)\\s*{\\s/\\* !" + name + "-Level \\*/";
	console.log(matchstr);
	var replacestr = '@media ' + (value ? "screen" : "disabled") + " { /* " + name + "-Level */";
	var replacestr2 = '@media ' + (!value ? "screen" : "disabled") + " { /* !" + name + "-Level */";
	console.log("REPLACE WITH: " + replacestr);
	var r = new RegExp(matchstr, "gm");
	var r2 = new RegExp(matchstr2, "gm");
	
        this.cssText = this.cssText.replace(r, replacestr);
        this.cssText = this.cssText.replace(r2, replacestr2);
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
        if (inGroupName.match(/^(.*)[-_]Border$/)) {
            // used px for css but now we need to get rid of it
            var newValue = (inName == "Radius") ? inValue.replace(/\D/g,"") : inValue;

            var themeGroupName = inGroupName.match(/^(.*)(\-|_)Border$/)[1];
            var groupDesc = this.getThemeGroup(symbolicName, this.themeGroupData);
            var borderList;
            for (var i = 0; i < groupDesc.styles.length; i++) {
                var name = groupDesc.styles[i].symbol || groupDesc.styles[i].name;
		var comparison = inGroupName.replace(/-(BorderSize|Color)$/,"");
                if (name == "Border" || name == "Border-BorderSize" || name == "Border-Color" || name == comparison) 
                    borderList = groupDesc.styles[i].borders;
            }
	    //var borderList = this.getThemeGroup(symbolicName, this.themeGroupData).borders;
            
            if (borderList) {
                for (var i = 0; i < borderList.length; i++) {
                    var widgetClassName = borderList[i].borderClass;
		    console.log("Updating " + widgetClassName);
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
		    if (widgetClassName == "wm.Panel" && borderProperty == "border") continue;

		    if (borderProperty.match(/Border^/) || borderProperty == "border")
			newValue = parseInt(newValue); // no px in value 
                    var borderTemplate = borderList[i].borderTemplate;
                    if (!this.themePrototype[widgetClassName]) this.themePrototype[widgetClassName] = {};
                    newValue = (borderTemplate && borderProperty.match(/border$/i)) ? borderTemplate.replace(/\?/g, inValue) : inValue;
                    this.themePrototype[widgetClassName][borderProperty] = newValue;
                    var ctor = dojo.getObject(widgetClassName);
                    if (ctor && ctor.prototype) {
                        studio.application.loadThemePrototypeForClass(ctor); // make sure the prototype is loaded before we start editting it
                        ctor.prototype[borderProperty] = newValue;
			console.log("Set prototype " + widgetClassName + ".prototype." + borderProperty + " = " + newValue);
                    }
                }
            this.regenerateDemoPanel(null,null,false);
            }
        }

        /* AFTER EFFECTS OF THE CHANGE */
        switch(symbolicName) {
        case "Content-Panels-Editors-Default-BorderStyle_Radius":
            var newValue = Math.floor(parseInt(inValue) * 0.6) + "px";
            this.setCssSymbol("wm.SelectMenu", "Inner-Radius", newValue);
            break;
            /*
	      case "Borders-Panel_BorderStyle_Radius":
              var newValue = Math.floor(parseInt(inValue) * 0.6) + "px";
              this.setCssSymbol("Borders-Panel_Inner_BorderStyle", "Inner-Radius", newValue);
	    */
        }
    },
    revertTheme: function() {        
	this.themeselect(this.themeSelect);
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
/* no longer needed; we update theme as we edit
        if (studio.application.theme == this.currentTheme) {
            studio.application.setTheme(this.currentTheme);
        }
*/
    },
    copyThemeClick: function(inSender, inTheme) {
	this.copyTheme = inTheme || this.currentTheme;
        if (inTheme == "wm_notheme") {
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
        //var selectedName = this.themeList.selectedItem.getData().dataValue;
        var selectedName = this.copyTheme;
        var newname = selectedName;
        newname = newname.replace(/^wm_/, "");
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
            app.alert("Please enter a name for your theme before hitting OK...");
            return;
        } else if (dojo.indexOf(list, inText) != -1) {
            app.alert("Unfortunately, " + inText + " is already in use");
        } else if (inText.match(/^wm_/)) {
            app.alert("Only built-in themes can use the wm_ prefix");
            return;
        }
        dialog.dismiss();
        this.disconnectEvent("onButton2Click");
        this.disconnectEvent("onButton1Click");
        
            var d = studio.deploymentService.requestAsync("copyTheme", [selectedName, inText]);
            d.addCallback(dojo.hitch(this, function(inData) {
                app.toastDialog.showToast(inText + " created from " + selectedName, 5000, "Success");
                studio.loadThemeList(dojo.hitch(this, function() {
                    this.themeSelect.setDataSet(studio.themesListVar);
                    this.themeSelect.setDataValue(inText);

                    /* from when themeList was a wm.List instead of wm.SelectMenu
                    this.themeList.setDataSet(studio.themesListVar);
                    var themelist = studio.themesListVar.getData();
                    for (var j = 0; j < themelist.length; j++) {
                        if (themelist[j].dataValue == inText) {
                            this.themeList.eventSelect(this.themeList.getItem(j));
                            break;
                        }
                    }
                    */
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
        //var selectedName = this.themeList.selectedItem.getData().dataValue;
        var selectedName = this.themeSelect.getDataValue();
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
                    //this.themeList.setDataSet(studio.themesListVar);
                    this.themeSelect.setDataSet(studio.themesListVar);
                    this.themeSelect.setDataValue(studio.themesListVar.getData()[0].dataValue);
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

        var blackandwhite = (max < 120) ? "#ffffff" : "#000000";
        return ["#" + result1.join(""),
                "#" + result2.join(""),
                "#" + result3.join(""),
               blackandwhite];
    },




    regenerateDemoPanel: function(inSender,inEvent,inChangeActiveTab) {
        studio.beginWait("Regenerating Preview");
        wm.onidle(this, function() {
        try {
	    var selectedGroup = this.themeGroupList.selectedItem.getData().dataValue;
	    var selectedGroupMatchesPanelContent = selectedGroup.match(/Content$/) || selectedGroup == "Document";
            var demoPanel;
            var widgets;
            var overviewLayers = [this.pageWithTopNavLayer, this.pageWithSideNavLayer, this.pageWithNoNavLayer];
            if (selectedGroup == "Dialogs") {
                this.viewOneWidgetLayer.hide();
                dojo.forEach(overviewLayers, function(l) {l.hide();});
                this.viewWidgetsLayer.show();
                this.viewWidgetsLayer.activate();
	        demoPanel = this.demoPanelTabLayers.getActiveLayer().c$[0];
                demoPanel.removeAllControls();
	        this.owner = studio.page; // block Application.loadThemePrototypeForClass from using wm_studio to generate the widget
                demoPanel.domNode.innerHTML = "";
                
                if (this.demoDialog) this.demoDialog.destroy();
                console.log("Create Dialog");
                var designer = studio.page._designer;
                studio.page._designer = null;
                this.demoDialog = new wm.GenericDialog({owner: studio.page, "height":"145px","showInput":true,"noEscape":false,"title":"Sample Dialog","button1Caption":"OK","button1Close":true,"button2Close":true,"userPrompt":"This is a sample of a wm.GenericDialog", modal: false});
                studio.page._designer = designer;
                this.demoDialog.setOwner(this);
                this.viewWidgetsLayer.domNode.appendChild(this.demoDialog.domNode);               
                this.demoDialog.show();

                return;
            }
                if (!selectedGroupMatchesPanelContent) {
                    this.viewOneWidgetLayer.hide();
                    this.viewWidgetsLayer.hide();
                    dojo.forEach(overviewLayers, function(l) {l.show();});
                    if (!this.demoPanelTabLayers.getActiveLayer().showing)
                        this.demoPanelTabLayers.layers[0].activate();
	            demoPanel = this.demoPanelTabLayers.getActiveLayer().c$[0];
	            widgets = this.demoPanelTabLayers.getActiveLayer().themeWidgets
                    widgets = this[widgets];
                } else {
                    this.viewOneWidgetLayer.hide();
                    var viewWidgetsLayerShowing = this.viewWidgetsLayer.showing;
                    this.viewWidgetsLayer.show();
                dojo.forEach(overviewLayers, function(l) {l.show();});

                    // Activate the widgetlayer if we're just showing it, else leave the selected layer alone.
                    if (!viewWidgetsLayerShowing)
                        this.viewWidgetsLayer.activate();
                    else if (inChangeActiveTab && this.themeSubGroupList.selectedItem.getData().dataValue.match(/Editor/))
                        this.viewWidgetsLayer.activate();
                    demoPanel = this.demoPanelTabLayers.getActiveLayer().c$[0];
                    if (!this.viewWidgetsLayer.isActive()) {
	                widgets = this.demoPanelTabLayers.getActiveLayer().themeWidgets
                        widgets = this[widgets];
                    } else {
	                widgets = this.themeGroupWidgets;
                        widgets.layoutBox[3].themeGroupPanel[0] = "wm." + (selectedGroup == "Document" ? "" : selectedGroup) + "Panel";
                        widgets.layoutBox[3].themeGroupPanel[3].fancyPanel1[0] = (selectedGroup == "HeaderContent") ? "wm.Panel" : "wm.FancyPanel";
	            }
                }


            demoPanel.removeAllControls();
	        this.owner = studio.page; // block Application.loadThemePrototypeForClass from using wm_studio to generate the widget
                demoPanel.domNode.innerHTML = "";

            demoPanel.createComponents(widgets);
	    if (this.demoDialog) {
		this.demoDialog.destroy();
                this.demoDialog = null;
            }

	    this.owner = app;
            wm.onidle(demoPanel,"reflow");
            wm.onidle(demoPanel.c$[0],"reflow");
            this._prototypeChanged = false;
        } catch(e) {
        } finally {
            studio.endWait();
        }
        });
    },
         
    getThemeDataValue: function(groupname, stylename, defaultVal) {
        if (!this.themeData[groupname])
            this.themeData[groupname] = {};
        if (!this.themeData[groupname][stylename]) {
            this.themeData[groupname][stylename] =  defaultVal;
	}
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







    themeGroupWidgets: {
	layoutBox: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top", padding: "15"}, {}, {
            themeGroupPanel: ["wm.Panel", {width: "100%", height: "100%", padding: "10"}, {}, {
		fancyPanel1: ["wm.FancyPanel", {"verticalAlign":"top","horizontalAlign":"left", width: "100%", height: "100%", layoutKind: "top-to-bottom"}, {}, {
			text1: ["wm.Text", {"displayValue":"","caption":"text1"}, {}],
			selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","options":"this, is, a, select, menu","displayField":"name","dataField":"dataValue"}, {}],
			panel1: ["wm.Panel", {"width":"100%","height":"48px","horizontalAlign":"left","verticalAlign":"top","layoutKind":"left-to-right"}, {}, {
				button1: ["wm.Button", {"height":"48px","width":"96px"}, {}],
				toggleButton1: ["wm.ToggleButton", {"height":"48px","width":"96px"}, {}]
			}],
		    tabLayers1: ["wm.TabLayers", {margin: "10"}, {}, {
				layer1: ["wm.Layer", {"caption":"Grid","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true}, {}, {
				    dojoGrid: ["wm.DojoGrid", {dsType: "EntryData", width: "100%", height: "100%","columns":[{"show":true,"id":"name","title":"Name","width":"auto","displayType":undefined,"noDelete":true},{"show":true,"id":"dataValue","title":"DataValue","width":"auto","displayType":undefined,"noDelete":true}]},{},{
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {"targetProperty":"dataSet","source":"shadowListVar"}, {}]
					}]
				    }]
				}],
				layer2: ["wm.Layer", {"caption":"Accordion","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true}, {}, {
					accordionLayers1: ["wm.AccordionLayers", {}, {}, {
						layer4: ["wm.Layer", {"caption":"Empty Layer 1","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true}, {}],
						layer5: ["wm.Layer", {"caption":"Empty Layer 2","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true}, {}],
						layer6: ["wm.Layer", {"caption":"Empty Layer 3","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true}, {}]
					}]
				}],
			    layer3: ["wm.Layer", {"caption":"Calendar","horizontalAlign":"left","verticalAlign":"top","themeStyleType":"ContentPanel","border":"2","transitionNext":true, height: "220px"}, {}, {
					calendar1: ["wm.dijit.Calendar", {}, {}]
				}]
			}]
                }]

		}]
	}]
    },


    themeGroupWidgets_TopNav: {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		CenteredLayout: ["wm.Template", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			spacer1: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}],
			contentPanel: ["wm.Panel", {"borderColor":"#888888","height":"100%","themeStyleType":"ContentPanel","width":"770px"}, {}, {
				HeaderPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					headerLogoPicture: ["wm.Picture", {"border":"0","height":"60px","source":"/wavemaker/lib/wm/base/styles/images/wavemakerLogo.png","width":"273px"}, {}],
					headerTitleLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"align":"center","border":"0","caption":"Template","height":"100%","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					headerLinksPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"183px"}, {}, {
						headerLogoutLabel: ["wm.Label", {"align":"center","border":"0","caption":"Logout","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}],
						headerLinkLabel2: ["wm.Label", {"align":"center","border":"0","caption":"Help","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				panel1: ["wm.HeaderContentPanel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
					dojoMenu1: ["wm.DojoMenu", {"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"},{"label":"Edit","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Cut"},{"label":"Copy"},{"label":"Paste"},{"label":"Zoom","children":[{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"}]},{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"},{"label":"Help"}],"height":"37px","menu":"File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp","structure":"{\"items\":[{\"label\":\"File\",\"children\":[{\"label\":\"New\"},{\"label\":\"Open\"},{\"label\":\"Save\"},{\"label\":\"Close\"}]},{\"label\":\"Edit\",\"children\":[{\"label\":\"Cut\"},{\"label\":\"Copy\"},{\"label\":\"Paste\"}]},{\"label\":\"Zoom\",\"children\":[{\"label\":\"25%\"},{\"label\":\"50%\"},{\"label\":\"100%\"},{\"label\":\"150%\"}]},{\"label\":\"Help\"}]}","width":"318px"}, {}],
					spacer3: ["wm.Spacer", {"height":"0px","width":"100%"}, {}],
					text1: ["wm.Text", {"caption":"Search for widgets","displayValue":"","height":"30px","width":"280px"}, {}],
					button1: ["wm.Button", {"caption":"Search","height":"30px","margin":"2,10,2,10","width":"90px"}, {}],
					toggleButton3: ["wm.ToggleButton", {"captionDown":"Untoggle","captionUp":"Toggle","height":"100%","width":"96px"}, {}]
				}],
				MainContentOuter: ["wm.Panel", {"border":"2","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"15,0","verticalAlign":"top","width":"100%"}, {}, {
					MainContentPanel: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","themeStyleType":"MainContent","verticalAlign":"top","width":"100%"}, {}, {
						tabLayers1: ["wm.TabLayers", {"autoScroll":true,"padding":"0"}, {}, {
							layer1: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#333333","caption":"Common Widgets","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								panel2: ["wm.EmphasizedContentPanel", {"height":"80px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									emphasizedbuttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										label3: ["wm.Label", {"align":"center","border":"0","caption":"EmphasizedContent:","height":"48px","width":"150px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										button3: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
										toggleButton2: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
										label4: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}],
									text4: ["wm.Text", {"caption":"Text Editor","captionSize":"130px","displayValue":"","width":"280px"}, {}]
								}],
								buttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									button2: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
									toggleButton1: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
									label1: ["wm.Label", {"align":"center","border":"0","caption":"label1","height":"48px","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									label2: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}]
								}],
								splitter1: ["wm.Splitter", {"height":"10px","width":"100%"}, {}],
								accordionLayers1: ["wm.AccordionLayers", {"border":"1","height":"360px"}, {}, {
									layer4: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Basic Editors","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										text2: ["wm.Text", {"caption":"Regular Text Input","displayValue":""}, {}],
										text3: ["wm.Text", {"caption":"Validating Text Input","displayValue":"","regExp":"z.*"}, {}],
										selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","dataField":"dataValue","displayField":"name","displayValue":"","options":"this is option 1, this is option 2, this is option 3, pick me!"}, {}],
										checkbox1: ["wm.Checkbox", {"caption":"checkbox1","displayValue":""}, {}],
										radioButton1: ["wm.RadioButton", {"caption":"radioButton1","displayValue":""}, {}]
									}],
									layer5: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.List","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										list1: ["wm.List", {"height":"100%","width":"492px"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
											}]
										}]
									}],
									layer6: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Progress bar, Bevel and Calendar","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										progressBar1: ["wm.dijit.ProgressBar", {"height":"48px","progress":50,"width":"360px"}, {}],
										bevel1: ["wm.Bevel", {"height":"10px","width":"100%"}, {}],
										calendar1: ["wm.dijit.Calendar", {"height":"200px"}, {}]
									}]
								}]
							}],
							layer2: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.DojoGrid","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								fancyPanel2: ["wm.FancyPanel", {"horizontalAlign":"left","title":"Rounded Panel","verticalAlign":"top"}, {}, {
									dojoGrid1: ["wm.DojoGrid", {"dsType":"EntryData","height":"100%","columns":[{"show":true,"id":"name","title":"Name","width":"auto","displayType":undefined,"noDelete":true},{"show":true,"id":"dataValue","title":"DataValue","width":"auto","displayType":undefined,"noDelete":true}]}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
										}]
									}]

								}]
							}]
						}]
					}]
				}],
				FooterPanel: ["wm.Panel", {"border":"1,0,0,0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					footerPoweredByImage: ["wm.Picture", {"_classes":{"domNode":["wm_Attribution_center"]},"border":"0","height":"100%","width":"279px"}, {}],
				    footerInstrLabel: ["wm.Label", {"align":"right","border":"0","caption":"If you don't see your change here, go to 'Preview Widget Set' Tab", singleLine: false,"height":"48px","width":"300px", align: "center"}],
					footerCopyrightLabel: ["wm.Label", {"align":"right","border":"0","caption":"Copyright 2010","height":"48px","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}],
			spacer2: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}]
		}]
	}]
    },




    themeGroupWidgets_NoNav: {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		CenteredLayout: ["wm.Template", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			spacer1: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}],
			contentPanel: ["wm.Panel", {"borderColor":"#888888","height":"100%","themeStyleType":"ContentPanel","width":"770px"}, {}, {
				HeaderPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					headerLogoPicture: ["wm.Picture", {"border":"0","height":"60px","source":"/wavemaker/lib/wm/base/styles/images/wavemakerLogo.png","width":"273px"}, {}],
					headerTitleLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"align":"center","border":"0","caption":"Template","height":"100%","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					headerLinksPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"183px"}, {}, {
						headerLogoutLabel: ["wm.Label", {"align":"center","border":"0","caption":"Logout","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}],
						headerLinkLabel2: ["wm.Label", {"align":"center","border":"0","caption":"Help","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				MainContentOuter: ["wm.Panel", {"border":"2","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"15,0","verticalAlign":"top","width":"100%"}, {}, {
					MainContentPanel: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","themeStyleType":"MainContent","verticalAlign":"top","width":"100%"}, {}, {
						tabLayers1: ["wm.TabLayers", {"autoScroll":true,"padding":"0"}, {}, {
							layer1: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#333333","caption":"Common Widgets","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								panel2: ["wm.EmphasizedContentPanel", {"height":"80px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									emphasizedbuttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										label3: ["wm.Label", {"align":"center","border":"0","caption":"EmphasizedContent:","height":"48px","width":"150px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										button3: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
										toggleButton2: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
										label4: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}],
									text4: ["wm.Text", {"caption":"Text Editor","captionSize":"130px","displayValue":"","width":"280px"}, {}]
								}],
								buttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									button2: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
									toggleButton1: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
									label1: ["wm.Label", {"align":"center","border":"0","caption":"label1","height":"48px","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									label2: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}]
								}],
								splitter1: ["wm.Splitter", {"height":"10px","width":"100%"}, {}],
								accordionLayers1: ["wm.AccordionLayers", {"border":"1","height":"360px"}, {}, {
									layer4: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Basic Editors","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										text2: ["wm.Text", {"caption":"Regular Text Input","displayValue":""}, {}],
										text3: ["wm.Text", {"caption":"Validating Text Input","displayValue":"","regExp":"z.*"}, {}],
										selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","dataField":"dataValue","displayField":"name","displayValue":"","options":"this is option 1, this is option 2, this is option 3, pick me!"}, {}],
										checkbox1: ["wm.Checkbox", {"caption":"checkbox1","displayValue":""}, {}],
										radioButton1: ["wm.RadioButton", {"caption":"radioButton1","displayValue":""}, {}],
										panel1: ["wm.HeaderContentPanel", {"height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"15","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
											button4: ["wm.Button", {"caption":"Edit","height":"100%","width":"96px"}, {}],
											button5: ["wm.Button", {"caption":"Delete","height":"100%","width":"96px"}, {}],
											button6: ["wm.Button", {"caption":"Save","height":"100%","width":"96px"}, {}],
											spacer3: ["wm.Spacer", {"height":"2px","width":"100%"}, {}],
											text1: ["wm.Text", {"caption":"text1","displayValue":"","height":"100%","width":"300px"}, {}],
											button1: ["wm.Button", {"caption":"Search","height":"100%","width":"120px"}, {}],
											toggleButton3: ["wm.ToggleButton", {"captionDown":"Untoggle","captionUp":"Toggle","height":"100%","width":"96px"}, {}]
										}]
									}],
									layer5: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.List","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										list1: ["wm.List", {"height":"100%","width":"492px"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
											}]
										}]
									}],
									layer6: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Progress bar, Bevel and Calendar","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										progressBar1: ["wm.dijit.ProgressBar", {"height":"48px","progress":50,"width":"360px"}, {}],
										bevel1: ["wm.Bevel", {"bevelSize":"10","height":"10px","width":"100%"}, {}],
										calendar1: ["wm.dijit.Calendar", {"height":"200px"}, {}]
									}]
								}]
							}],
							layer2: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.DojoGrid","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								fancyPanel2: ["wm.FancyPanel", {"horizontalAlign":"left","title":"Rounded Panel","verticalAlign":"top"}, {}, {
									dojoGrid1: ["wm.DojoGrid", {"dsType":"EntryData","height":"100%","columns":[{"show":true,"id":"name","title":"Name","width":"auto","displayType":undefined,"noDelete":true},{"show":true,"id":"dataValue","title":"DataValue","width":"auto","displayType":undefined,"noDelete":true}]}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
										}]
									}]

								}]
							}]
						}]
					}]
				}],
				FooterPanel: ["wm.Panel", {"border":"1,0,0,0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					footerPoweredByImage: ["wm.Picture", {"_classes":{"domNode":["wm_Attribution_center"]},"border":"0","height":"100%","width":"279px"}, {}],
				    footerInstrLabel: ["wm.Label", {"align":"right","border":"0","caption":"If you don't see your change here, go to 'Preview Widget Set' Tab", singleLine: false,"height":"48px","width":"300px", align: "center"}],
					footerCopyrightLabel: ["wm.Label", {"align":"right","border":"0","caption":"Copyright 2010","height":"48px","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}],
			spacer2: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}]
		}]
	}]
    },



themeGroupWidgets_SideNav: {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		CenteredLayout: ["wm.Template", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			spacer1: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}],
			contentPanel: ["wm.Panel", {"borderColor":"#888888","height":"100%","themeStyleType":"ContentPanel","width":"770px"}, {}, {
				HeaderPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					headerLogoPicture: ["wm.Picture", {"border":"0","height":"60px","source":"/wavemaker/lib/wm/base/styles/images/wavemakerLogo.png","width":"273px"}, {}],
					headerTitleLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"align":"center","border":"0","caption":"Template","height":"100%","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					headerLinksPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"183px"}, {}, {
						headerLogoutLabel: ["wm.Label", {"align":"center","border":"0","caption":"Logout","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}],
						headerLinkLabel2: ["wm.Label", {"align":"center","border":"0","caption":"Help","height":"25px","link":"#","width":"80px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"#\"","targetProperty":"link"}, {}]
							}],
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				MainContentOuter: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"15,0","verticalAlign":"top","width":"100%"}, {}, {
					panel1: ["wm.HeaderContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,3,0,0","padding":"5","verticalAlign":"top","width":"100px"}, {}, {
						dojoMenu1: ["wm.DojoMenu", {"eventList":[{"label":"File","children":[{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"}]},{"label":"New"},{"label":"Open"},{"label":"Save"},{"label":"Close"},{"label":"Edit","children":[{"label":"Cut"},{"label":"Copy"},{"label":"Paste"}]},{"label":"Cut"},{"label":"Copy"},{"label":"Paste"},{"label":"Zoom","children":[{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"}]},{"label":"25%"},{"label":"50%"},{"label":"100%"},{"label":"150%"},{"label":"Help"}],"height":"156px","menu":"File > New, Open, Save, Close\nEdit > Cut, Copy, Paste\nZoom > 25%, 50%, 100%, 150%\nHelp","structure":"{\"items\":[{\"label\":\"File\",\"children\":[{\"label\":\"New\"},{\"label\":\"Open\"},{\"label\":\"Save\"},{\"label\":\"Close\"}]},{\"label\":\"Edit\",\"children\":[{\"label\":\"Cut\"},{\"label\":\"Copy\"},{\"label\":\"Paste\"}]},{\"label\":\"Zoom\",\"children\":[{\"label\":\"25%\"},{\"label\":\"50%\"},{\"label\":\"100%\"},{\"label\":\"150%\"}]},{\"label\":\"Help\"}]}","vertical":true,"width":"95px"}, {}],
						spacer3: ["wm.Spacer", {"height":"0px","width":"100%"}, {}],
						text1: ["wm.Text", {"caption":"Search","captionAlign":"center","captionPosition":"top","captionSize":"15px","displayValue":"","height":"40px"}, {}],
						button1: ["wm.Button", {"caption":"Search","height":"30px","width":"100%"}, {}],
						toggleButton3: ["wm.ToggleButton", {"captionDown":"Untoggle","captionUp":"Toggle","height":"30px","width":"100%"}, {}]
					}],
					MainContentPanel: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"5","themeStyleType":"MainContent","verticalAlign":"top","width":"100%"}, {}, {
						tabLayers1: ["wm.TabLayers", {"autoScroll":true,"padding":"0"}, {}, {
							layer1: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#333333","caption":"Common Widgets","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								panel2: ["wm.EmphasizedContentPanel", {"height":"80px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
									emphasizedbuttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										label3: ["wm.Label", {"align":"center","border":"0","caption":"EmphasizedContent:","height":"48px","width":"150px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										button3: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
										toggleButton2: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
										label4: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}],
									text4: ["wm.Text", {"caption":"Text Editor","captionSize":"130px","displayValue":"","width":"280px"}, {}]
								}],
								buttonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									button2: ["wm.Button", {"height":"100%","margin":"4,10,4,4","width":"120px"}, {}],
									toggleButton1: ["wm.ToggleButton", {"height":"100%","width":"120px"}, {}],
									label1: ["wm.Label", {"align":"center","border":"0","caption":"label1","height":"48px","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									label2: ["wm.Label", {"align":"center","border":"0","caption":"link1","height":"48px","link":"test","width":"96px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}]
								}],
								splitter1: ["wm.Splitter", {"height":"10px","width":"100%"}, {}],
								accordionLayers1: ["wm.AccordionLayers", {"border":"1","height":"360px"}, {}, {
									layer4: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Basic Editors","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										text2: ["wm.Text", {"caption":"Regular Text Input","displayValue":""}, {}],
										text3: ["wm.Text", {"caption":"Validating Text Input","displayValue":"","regExp":"z.*"}, {}],
										selectMenu1: ["wm.SelectMenu", {"caption":"selectMenu1","dataField":"dataValue","displayField":"name","displayValue":"","options":"this is option 1, this is option 2, this is option 3, pick me!"}, {}],
										checkbox1: ["wm.Checkbox", {"caption":"checkbox1","displayValue":""}, {}],
										radioButton1: ["wm.RadioButton", {"caption":"radioButton1","displayValue":""}, {}]
									}],
									layer5: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.List","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										list1: ["wm.List", {"height":"100%","width":"492px"}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
											}]
										}]
									}],
									layer6: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"Progress bar, Bevel and Calendar","horizontalAlign":"left","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
										progressBar1: ["wm.dijit.ProgressBar", {"height":"48px","progress":50,"width":"360px"}, {}],
										bevel1: ["wm.Bevel", {"height":"10px","width":"100%"}, {}],
										calendar1: ["wm.dijit.Calendar", {"height":"200px"}, {}]
									}]
								}]
							}],
							layer2: ["wm.Layer", {"border":"1","borderColor":"#333333","caption":"wm.DojoGrid","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","transitionNext":true,"verticalAlign":"top"}, {}, {
								fancyPanel2: ["wm.FancyPanel", {"horizontalAlign":"left","title":"Rounded Panel","verticalAlign":"top"}, {}, {
									dojoGrid1: ["wm.DojoGrid", {"dsType":"EntryData","height":"100%","columns":[{"show":true,"id":"name","title":"Name","width":"auto","displayType":undefined,"noDelete":true},{"show":true,"id":"dataValue","title":"DataValue","width":"auto","displayType":undefined,"noDelete":true}]}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"shadowListVar","targetProperty":"dataSet"}, {}]
										}]
									}]

								}]
							}]
						}]
					}]
				}],
				FooterPanel: ["wm.Panel", {"border":"1,0,0,0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					footerPoweredByImage: ["wm.Picture", {"_classes":{"domNode":["wm_Attribution_center"]},"border":"0","height":"100%","width":"279px"}, {}],
				    footerInstrLabel: ["wm.Label", {"align":"right","border":"0","caption":"If you don't see your change here, go to 'Preview Widget Set' Tab", singleLine: false,"height":"48px","width":"300px", align: "center"}],

					footerCopyrightLabel: ["wm.Label", {"align":"right","border":"0","caption":"Copyright 2010","height":"48px","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}],
			spacer2: ["wm.Spacer", {"height":"0px","minWidth":10,"width":"100%"}, {}]
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

