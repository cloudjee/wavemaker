/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
/* TODO:
  * 1. License files
  * 2. How to handle upgrades that add new css
  * 3. Header/Emphasized Content Panels
  * 4. Dialog/Button panels
  * 5. Filter the theme list to only show themes created by THIS theme designer
  */

dojo.declare("WidgetThemerPage", wm.Page, {
    "preferredDevice": "desktop",
    editorMargin: 20,
    defaultEditorWidth: 200,
    defaultEditorProps: {
        _classes: {domNode: ["StudioEditor"]},
        width: "100%",
        captionSize: "120px",
        captionAlign: "left",
        margin: "0,0,0,15"
    },

    _customWidgets: [
        {
            name: "Custom Widgets",
            category: true
        },
        {
            name: "SubmitButton",
            parentName: "Buttons",
            classList: [{dataValue: "wm.Button"}]
        }
    ],
    templateFileData: [
        {
            name: "Containers",
            category: true
        },
        {
            name: "Panel",
            category: false,
            hide: true,
            templateFile: "panel",
            classList: [{dataValue: "wm.Panel"}],
            customWidgetAddClass: "wmpanel"
        },
        {
            name: "Main Document",
            category: false,
            templateFile: "document",
            classList: [{dataValue: "wm.AppRoot"}]
        },
        {
            name: "Tabs",
            category: false,
            templateFile: "tabs",
            classList: [{dataValue: "wm.TabLayers"}],
            customWidgetAddClass: "wmtablayers"
        },
        {
            name: "Accordions",
            category: false,
            templateFile: "accordions",
            classList: [{dataValue: "wm.AccordionLayers"}],
            customWidgetAddClass: "wmaccordion"
        },
        {
            name: "Titled Panel",
            category: false,
            templateFile: "titledpanel",
            classList: [{dataValue: "wm.FancyPanel"}],
            customWidgetAddClass: "wmfancypanel"
        },

        {
            name: "Widgets",
            category: true
        },
        {
            name: "Buttons",
            category: false,
            templateFile: "button",
            classList: [{dataValue: "wm.Button"},{dataValue: "wm.ToggleButton"}, {dataValue: "wm.PopupMenuButton"}],
            customWidgetAddClass: "wmbutton"
        },
        {
            name: "Toggle Button Panel",
            category: false,
            templateFile: "togglebuttonpanel",
            classList: [{dataValue: "wm.ToggleButtonPanel"}],
            customWidgetAddClass: "wmtogglebuttonpanel"
        },
        {
            name: "Editors",
            category: false,
            templateFile: "editors",
            classList: [{dataValue: "wm.Text"},
                        {dataValue: "wm.LargeTextArea"},
                        {dataValue: "wm.Number"},
                        {dataValue: "wm.Currency"},
                        {dataValue: "wm.SelectMenu"},
                        {dataValue: "wm.Lookup"},
                        {dataValue: "wm.FilteringLookup"},
                        {dataValue: "wm.Date"},
                        {dataValue: "wm.Time"},
                        {dataValue: "wm.DateTime"},
                        {dataValue: "wm.Checkbox"},
                        {dataValue: "wm.RadioButton"},
                        {dataValue: "wm.RichText"},
                        {dataValue: "wm.Date"},
                        {dataValue: "wm.CheckboxSet"},
                        {dataValue: "wm.RadioSet"},
                        {dataValue: "wm.ListSet"},
                        {dataValue: "wm.Slider"}
                    ],
            customWidgetAddClass: "wmeditor"
        },
         {
            name: "Grids",
            category: false,
            templateFile: "grid",
            classList: [{dataValue: "wm.DojoGrid"},
                        {dataValue: "wm.List"}],
            customWidgetAddClass: "GridListStyle"

        },
        {
            name: "Progress Bar",
            category: false,
            templateFile: "progressbar",
            classList: [{dataValue: "wm.dijit.ProgressBar"}],
            customWidgetAddClass: "wmprogressbar"
        },
        {
            name: "Splitter/Bevel",
            category: false,
            templateFile: "splitterbevel",
            classList: [{dataValue: "wm.Bevel"},{dataValue: "wm.Splitter"}]
        },
        {
            name: "Calendar",
            category: false,
            templateFile: "calendar",
            classList: [{dataValue: "wm.dijit.Calendar"}]
        },
        {
            name: "Links",
            category: false,
            templateFile: "links",
            classList: []
        },
        {
            name: "Dashboard",
            category: false,
            templateFile: "dashboard",
            classList: [{dataValue: "wm.Dashboard"}]
        },
       {
            name: "Popups",
            category: true
        },
        {
            name: "Dialogs",
            category: false,
            templateFile: "dialogs",
            classList: [{dataValue: "wm.Dialog"},
                        {dataValue: "wm.PageDialog"},
                        {dataValue: "wm.GenericDialog"},
                        {dataValue: "wm.DesignableDialog"}]

        },
        {
            name: "Dialog Button Bars",
            category: false,
            templateFile: "dialogbuttonbar",
            classList: [{dataValue: "wm.ButtonBarPanel"}]

        },

        {
            name: "Menus",
            category: false,
            templateFile: "menus",
            classList: [{dataValue: "wm.DojoMenu"}],
            customWidgetAddClass: "dojoMenu"
        },
        {
            name: "Combobox Dropdowns",
            category: false,
            templateFile: "combodropdowns",
            classList: []
        },

        {
            name: "Tool Tips",
            category: false,
            templateFile: "tooltips",
            classList: []
        },
        {
            name: "Toast Dialogs",
            category: false,
            templateFile: "toast",
            classList: [{dataValue: "wm.Toast"}]
        }
    ],

	styleEditors: {
	    "default": ["wm.Text", {}],
		"font-family": ["wm.SelectMenu", {restrictValues: false, dataField: "dataValue", displayField: "dataValue"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "dataSet", source: "fontFaceVar"}]
			}]
		}],
		"font-size": ["wm.prop.SizeEditor", {allSizeTypes:true, defaultValue: 12}],
		"text-decoration": ["wm.SelectMenu", {options: "none, underline, line-through", restrictValues: false}],
		"font-style": ["wm.SelectMenu", {options: "normal, italic, oblique", restrictValues: false}],
		"font-variant": ["wm.SelectMenu", {options: "normal, small-caps", restrictValues: false}],
		"width": ["wm.prop.SizeEditor", {allSizeTypes:true, defaultValue: 20}],
		"height": ["wm.prop.SizeEditor", {allSizeTypes:true, defaultValue: 20}],
		"color": ["wm.ColorPicker", {caption: "font color"}],
		"border": ["wm.BorderEditor", {caption: "border", width: "100%"}],
		"outline": ["wm.BorderEditor", {caption: "outline", width: "100%"}],
		"font-weight": ["wm.SelectMenu", {options: "normal,bold"}],
		"border-radius":["wm.BorderRadiusEditor", {caption: "border-radius"}],
		"box-shadow":   ["wm.BoxShadowEditor", {caption: "box-shadow", width: "100%"}],
		"background": ["wm.BackgroundEditor", {caption: "background", width: "100%"}]

	},
    /* If the style name is not in the styleRules object, then check directly in the styleEditors object.
     * Example: "font-family" isn't here, so check for font-family in the stylesEditor.
     * This section of for rules that are more complicated
     */
    styleRules: {
        "background": "background",
        "background-color": "background",
        "background-image": "background",
        "background-position": "background",
        "background-repeat": "background",
        //"filter": "background", // NOTE: This will be a problem if other filters are used such as opacity

        "border-radius": "border-radius",
        "-webkit-border-radius": "border-radius",
        "-moz-border-radius": "border-radius",
        "-o-border-radius": "border-radius",
        "-ms-border-radius": "border-radius",

        "border-top-left-radius": "border-radius",
        "-webkit-border-top-left-radius": "border-radius",
        "-moz-border-top-left-radius": "border-radius",
        "-o-border-top-left-radius": "border-radius",
        "-ms-border-top-left-radius": "border-radius",

        "border-top-right-radius": "border-radius",
        "-webkit-border-top-right-radius": "border-radius",
        "-moz-border-top-right-radius": "border-radius",
        "-o-border-top-right-radius": "border-radius",
        "-ms-border-top-right-radius": "border-radius",
        "border-bottom-left-radius": "border-radius",
        "-webkit-border-bottom-left-radius": "border-radius",
        "-moz-border-bottom-left-radius": "border-radius",
        "-o-border-bottom-left-radius": "border-radius",
        "-ms-border-bottom-left-radius": "border-radius",
        "border-bottom-right-radius": "border-radius",
        "-webkit-border-bottom-right-radius": "border-radius",
        "-moz-border-bottom-right-radius": "border-radius",
        "-o-border-bottom-right-radius": "border-radius",
        "-ms-border-bottom-right-radius": "border-radius",

        "box-shadow": "box-shadow",
        "-webkit-box-shadow": "box-shadow",
        "-moz-box-shadow": "box-shadow",
        "-o-box-shadow": "box-shadow",
        "-ms-box-shadow": "box-shadow",

        "outline": "outline",
        "outline-width": "outline",
        "outline-color": "outline",
        "outline-style": "outline",

        "border": "border",
        "border-width": "border",
        "border-style": "border",
        "border-color": "border",
        "border-top":   "border",
        "border-left":  "border",
        "border-right":  "border",
        "border-bottom":  "border",
        "border-top-width":   "border",
        "border-left-width":  "border",
        "border-right-width":  "border",
        "border-bottom-width":  "border",
        "border-top-color":   "border",
        "border-left-color":  "border",
        "border-right-color":  "border",
        "border-bottom-color":  "border",
        "border-top-style":   "border",
        "border-left-style":  "border",
        "border-right-style":  "border",
        "border-bottom-style":  "border"
    },

    start: function() {
        this.templateListVar.setQuery({hide: false});
        this.themeListVar.setQuery({designer: "widgetthemer"});
        //this.themeListVar.setDataSet(studio.themesListVar);
        this.connect(studio.project, "projectChanging", this, "onHide");
        this.parentClassListVar.setData(dojo.filter(this.templateFileData, function(inItem) {
            return inItem.customWidgetAddClass;
        }));
        this.setupThemeList(studio.application._theme);
        this.connect(dijit.popup, "_createWrapper", this, "moveMenuNode");
        this.connect(studio, "projectChanging", this, "resetThemeDesigner");
    },
    resetThemeDesigner: function() {
        this.currentTheme = "";
        this.inCancelThemeChange = true;
        this.themeSelect.setDataValue("");
        this.inCancelThemeChange = false;
    },
    moveMenuNode: function(widget) {
        if (!this.root.isAncestorHidden() &&
            (this.currentWidgetTemplateFile == "menus" ||
             this.currentWidgetTemplateFile == "combodropdowns") &&
             widget.domNode.innerHTML.match(/Gandalf the Grey/)) {
            this.connectOnce(widget, "onOpen", this, function() {
                this.demoPanelWithAppRoot.domNode.appendChild(widget.domNode.parentNode);
                widget.domNode.parentNode.style.left = "20px";
                widget.domNode.parentNode.style.top = "20px";
            });
        }
    },


    /* START SECTION: End of managing themes and theme selection */
    setupThemeList: function(inTheme) {
        var data = this.owner.owner.themesListVar.getData();
        for (var i = 0; i < data.length; i++) {
            if (data[i].dataValue == "wm_notheme") {
                data.splice(i,1);
                break;
            }
        }
        this.themeListVar.setDataSet(data);
        this.themeSelect.setDataValue(inTheme);
        if (!this.themeSelect.getDataValue()) {
            app.alert("The theme " + inTheme + " can only be edited using the 'Theme Generator' and not the 'Theme Designer'");
            this.mainPanel.setDisabled(true);
        }
    },
    themeselectChange: function(inSender) {
        if (this.inCancelThemeChange) return;
        if (this.currentTheme && this.isDirty && !this.currentTheme.match(/wm\.base\.widget\.themes/) && inSender.getDataValue() != this.currentTheme) {
            app.confirm("You have unsaved changes to theme " + this.currentTheme + ", are you sure you want to lose these changes?").then(
                dojo.hitch(this, function() {
                    this.isDirty = false;
                    this.themeselectChange(inSender);
                }),
                dojo.hitch(this, function() {
                    this.inCancelThemeChange = true;
                    this.themeSelect.setDataValue(this.currentTheme);
                    this.inCancelThemeChange = false;
                })
            );
            return;
        }
        if (this.currentTheme) dojo.removeClass(this.demoPanelWithThemeName.domNode, this.currentThemeName);
        var currentTheme = inSender.getDataValue();
        if (!currentTheme) {
            this.mainPanel.setDisabled(true);
            return;
        } else if (currentTheme.match(/^wm\.base\.widget\.themes/)) {
            if (this.mainPanel.disabled) this.mainPanel.setDisabled(false);
            this.editorLayer.setDisabled(true);
        } else {
            if (this.mainPanel.disabled) this.mainPanel.setDisabled(false);
            if (this.editorLayer.disabled) this.editorLayer.setDisabled(false);
        }
        this.themesPageSaveBtn.setDisabled(this.mainPanel.disabled);
        this.themesPageDeleteBtn.setDisabled(this.mainPanel.disabled);
        this.themesPageRevertBtn.setDisabled(this.mainPanel.disabled);

        this.currentTheme = currentTheme;
        this.currentThemeName = currentTheme.replace(/^.*\./,"");
        this.widgetCssFiles = {};
        this.customWidgets = this._customWidgets;
        studio.beginWait("Loading Theme...");
        wm.onidle(this, function() {


            /* Step 1: enable/disable delete button; this could go anywhere in the process */
            this.themesPageDeleteBtn.setDisabled(this.currentTheme.match(/^wm\./));

            /* Step 2: Set the class of the demo panel to the new theme so the demo widgets will get the proper classpath */
            dojo.addClass(this.demoPanelWithThemeName.domNode, this.currentThemeName);

            /* Step 4: Find the path to the theme folder */
            var path = dojo.moduleUrl(this.currentTheme);

            /* Step 5: Load the theme.css file that we are going to edit */
            this.cssText = "";
            try {
                this.cssText =  dojo.xhrGet({url:path + "themedesigner.css", sync:true, preventCache:true}).results[0];
            } catch(e) {}
            if (!this.cssText) {
                this.cssText =  dojo.xhrGet({url:path + "theme.css", sync:true, preventCache:true}).results[0];
            }
            if (!this.cssText) this.cssText = "";

            /* Step 6: Load the custom widgets file */
            try {
                var customWidgets = dojo.fromJson(dojo.xhrGet({url:path + "customwidgets.json", sync:true, preventCache:true}).results[0]);
                if (customWidgets) this.customWidgets = customWidgets;
            } catch(e) {}
            this.templateListVar.setData(this.templateFileData.concat(dojo.clone(this.customWidgets)));

            /* Step 7: Load the Theme.js file, store it in this.themePrototype */
            this.themePrototype =  dojo.fromJson(dojo.xhrGet({url:path + "Theme.js", sync:true, preventCache:true}).results[0]);
            this.resetCache();
            this.updateDirty();
            studio.application._setTheme(this.currentTheme, false, this.cssText || " ", this.themePrototype, true);
            this.onPrototypeChange();
            studio.application.cacheWidgets();

            this.currentWidgetIndex = -1;
            this.widgetGrid.deselectAll();
            this.widgetGrid.select(1);
            studio.endWait();
        });
    },
    copyThemeClick: function() {
        var themeName = this.currentThemeName + 1;
        for (var i = 2; i < 1000 && this.themeListVar.query({name: themeName}).getCount(); i++) {
            themeName = this.currentThemeName + i;
        }
        app.prompt("Enter theme name", themeName, dojo.hitch(this, "copyTheme"));
    },
    copyTheme: function(inThemeName) {
        inThemeName = inThemeName.replace(/[^a-zA-Z0-9_]/g,"");

        if (this.themeListVar.query({name: inThemeName}).getCount()) {
            app.prompt(inThemeName + " is taken. Enter a different theme name", studio.project.projectName + "Theme", dojo.hitch(this, "copyTheme"));
            return;
        }
        this._copyTheme(inThemeName, this.currentTheme);
    },
    _copyTheme: function(inThemeName, inSourceThemePath) {
        if (inSourceThemePath) {
            var inSourceThemeName = inSourceThemePath.replace(/^.*\./,"");
            var inSourceThemeUrl = wm.dojoModuleToPath(inSourceThemePath);
            inSourceThemeUrl = inSourceThemeUrl.replace(/^lib\/wm\/common\//, "/common/");
            if (inSourceThemePath.match(/wm\.base\.widget\.theme/)) inSourceThemeUrl = "app/templates/../../" + inSourceThemeUrl; // stupid hack to help the resource manager find the folder
        }
        studio.resourceManagerService.requestAsync("copyFolder", [inSourceThemeUrl || "app/templates/widgetthemes", "/common/themes/" + inThemeName]).then(
            dojo.hitch(this, function() {
        		return studio.resourceManagerService.requestAsync("getFolder", ["/common/themes/" + inThemeName]);
            })
        ).then(
            dojo.hitch(this, function(inResult) {
                this.filesToUpdate = dojo.filter(inResult.files, function(f) {
                    return f.file.match(/\.css$/);
                });
                return this.updateClassNameInFiles(inThemeName, inSourceThemeName || "wm_template");
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.loadThemeList();
            })
        ).then(
            dojo.hitch(this, function() {
                this.setupThemeList("common.themes." + inThemeName);
                this.themeselectChange(this.themeSelect);
            })
        );
    },
    updateClassNameInFiles: function(inThemeName, inSourceThemeName) {
        if (!this.updateClassNameInFilesDeferred) {
            this.updateClassNameInFilesDeferred = new dojo.Deferred();
        }
        if (this.filesToUpdate && this.filesToUpdate.length) {
            var file = this.filesToUpdate.pop();

            var fileText = wm.load(dojo.moduleUrl("common.themes." + inThemeName) + file.file);
            var r = new RegExp("." + inSourceThemeName, "g");
            fileText = fileText.replace(r, "." + inThemeName);
            studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/" + file.file, fileText]).then(dojo.hitch(this, "updateClassNameInFiles", inThemeName, inSourceThemeName));
        } else {
            this.updateClassNameInFilesDeferred.callback();
            delete this.updateClassNameInFilesDeferred;
        }
        return this.updateClassNameInFilesDeferred;
    },
    addNewThemeClick: function() {
        app.prompt("Enter theme name", studio.project.projectName + "Theme", dojo.hitch(this, "addNewTheme"));
    },
    addNewTheme: function(inThemeName) {
        inThemeName = inThemeName.replace(/[^a-zA-Z0-9_]/g,"");

        /* TODO: Update this query once themeListVar stops being a StringData var */
        if (this.themeListVar.query({dataValue: inThemeName}).getCount()) {
            app.prompt(inThemeName + " is taken. Enter a different theme name", studio.project.projectName + "Theme", dojo.hitch(this, "addNewTheme"));
            return;
        }
        this._copyTheme(inThemeName, "");

    },
    deleteThemeClick: function() {
        app.confirm("Are you sure you want to delete the theme " + this.currentThemeName + "?", false, dojo.hitch(this, "deleteTheme"));
    },
    deleteTheme: function() {
        studio.resourceManagerService.requestAsync("deleteFile", ["/common/themes/" + this.currentThemeName]).then(
            dojo.hitch(this, function() {
                app.toastSuccess("Deleted");
                return studio.loadThemeList();
            })
        ).then(
            dojo.hitch(this, function() {
                this.setupThemeList(studio.application._theme || "");
            })
        );
    },
    revertThemeClick: function() {
        app.confirm("This will lose any unsaved changes to your theme; continue?").then(
            dojo.hitch(this, function() {
                this.themeselectChange(this.themeSelect);
            })
        );
    },
    /* END SECTION: End of managing themes and theme selection */



    /* START SECTION: Edit the selected widget styles and properties */
    widgetGridSelect: function(inSender) {
        if (inSender.selectedItem.getValue("category")) {
            wm.onidle(this, function() {
                this.widgetGrid.select(this.currentWidgetIndex);
            });
            return;
        } else if (inSender.getSelectedIndex() == this.currentWidgetIndex) {
            return;
        }
        /* Step 1: Set the current widget data */
        this.currentWidgetIndex = inSender.getSelectedIndex();
        this.currentWidgetName = inSender.selectedItem.getValue("name");
        this.currentWidgetTemplateFile = inSender.selectedItem.getValue("templateFile");
        if (!this.currentWidgetTemplateFile && inSender.selectedItem.getValue("parentName")) {
            this.currentWidgetTemplateFile = this.currentWidgetName;
        }
        var heading = "";

        this.editorPanelHeader.setCaption(this.currentTheme.match(/^wm\.base\.widget\.themes/) ? "Theme is Read-only; Copy theme to modify it." : this.currentWidgetName);


        /* Step 2: Load the css file and the sample file and apply it to the demo panel */
        var itemData = inSender.selectedItem.getData();
        if (!this.widgetCssFiles[this.currentWidgetTemplateFile]) {
            this.widgetCssFiles[this.currentWidgetTemplateFile] = wm.load(dojo.moduleUrl("common.themes." + this.currentThemeName) + (itemData.parentName ? itemData.name : this.currentWidgetTemplateFile) + ".css?" + (Math.floor(Math.random(new Date().getTime()) * 1000000)));
            if (!this.widgetCssFiles[this.currentWidgetTemplateFile]) {
                if (itemData.parentName) {
                    this.setupCustomWidgetTemplate(itemData);
                } else {
                    this.widgetCssFiles[this.currentWidgetTemplateFile] = wm.load(dojo.moduleUrl("wm.studio.app.templates.widgetthemes") + this.currentWidgetTemplateFile + ".css").replace(/\.wm_template/g, "." + this.currentThemeName);
                }
            }
        }
        this.removeClassButton.setDisabled(!itemData.parentName);

        var currentClassList = this.currentClassList = [];
        inSender.selectedItem.getValue("classList").forEach(function(inItem) {
            currentClassList.push(inItem.getValue("dataValue"));
        });

        if (itemData.parentName) {
            var item = this.templateListVar.query({name: itemData.parentName}).getItem(0);
            this.sampleWidgets =  dojo.fromJson(wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + item.getValue("templateFile") + ".widgets"));
        } else {
            this.sampleWidgets =  dojo.fromJson(wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + this.currentWidgetTemplateFile + ".widgets"));
        }

        this.regenerateDemoPanel();
        this.editArea.setDataValue(this.widgetCssFiles[this.currentWidgetTemplateFile]);

        /* Generate the editors */
        this.editorPanel._cupdating = true;
        this.editorPanel.removeAllControls();
        this.generatePrototypeEditors(this.currentClassList);
        this.generateCssEditors(this.currentWidgetTemplateFile);
        this.editorPanel._cupdating = false;
        this.editorPanel.reflow();
        if (this.mainPanel.disabled) {
                // make disabled propagate down to the newly generated editors
                this.mainPanel.setDisabled(false);
                this.mainPanel.setDisabled(true);
            }
        this.updateCssText();
    },
    /* END SECTION: Edit the selected widget styles and properties */


    /* START SECTION: Edit the selected widget styles */
    generateCssEditors: function(filename) {
        this._generatingEditors = true;
        try {
            var parent = this.editorPanel;
            var lines = this.widgetCssFiles[this.currentWidgetTemplateFile].split(/\n/);
            var currentGroup = "";
            dojo.forEach(lines, function(l) {
                var groupName = this.getGroupNameFromLine(l);
                if (groupName) {
                    currentGroup = groupName;
                    var label = new wm.Label({ width: "100%",
                                                height: "30px",
                                                margin: "10,0,0,0",
                                                caption: currentGroup,
                                                _classes: {domNode: ["SubHeading"]},
                                                owner: this,
                                                parent: parent});
                    this.currentEditorsHash = {};
                } else {

                    var calcString = "THEMER: CALC:";
                    var indexOfCalcString = l.indexOf(calcString);
                    var hideString = "THEMER: HIDE";
                    var indexOfHideString = l.indexOf(hideString);
                    if (indexOfCalcString == -1 && indexOfHideString == -1) {
                        var styleObj = this.getStyleObjFromLine(l);
                        if (styleObj) {
                            this.generateCssEditor(styleObj.name, styleObj.value, styleObj.disabled, styleObj.message, parent, currentGroup);
                        }
                    }
                }
            }, this);
        } catch(e) {}
        delete this._generatingEditors;

    },
    generateCssEditor: function(styleName, styleValue, isDisabled, inMessage, parent, styleGroup) {
        styleValue = String(styleValue).replace(/\s\!important/, "");
        var styleEditorDef;
        var styleRule = this.styleRules[styleName];
        if (styleName == "filter" && (styleValue.match(/Gradient/i) || styleValue == "none")) {
            styleRule = this.styleRules.background;
        }
        var editorExists = false;
        if (styleRule) {
            styleEditorDef =  this.styleEditors[styleRule];
            editorExists = Boolean(this.currentEditorsHash[styleRule]);
        } else {
            styleEditorDef =  this.styleEditors[styleName];
        }
        if (!editorExists) {
            if (!styleEditorDef) styleEditorDef = this.styleEditors["default"];
            styleEditorDef = dojo.clone(styleEditorDef);
            if (!styleEditorDef[1].width) styleEditorDef[1].width = this.defaultEditorWidth + "px";
            if (styleEditorDef[0] == "wm.BackgroundEditor") {
                styleEditorDef[1].urlPlaceHolder = wm.dojoModuleToPath(this.currentTheme + ".images") + "/example.png";
            }

            styleEditorDef[1] = dojo.mixin({}, this.defaultEditorProps,styleEditorDef[1]);
            var caption = styleEditorDef[1] && styleEditorDef[1].caption || styleName;
            styleEditorDef[1].caption = "";

            styleEditorDef[1].message = inMessage;
            var ctor = dojo.getObject(styleEditorDef[0]);
            var defaultHeight = ctor ? ctor.prototype.height : "24px";
            var p = parent.createComponents({
                panel: ["wm.Panel", {width: "100%", height: defaultHeight, padding: "0", margin: "0,0,0," + this.editorMargin,
                                     layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
                                label: ["wm.Label", {width: "120px", caption:  caption}],
                                checkbox: ["wm.Checkbox", {width: "16px", startChecked: !isDisabled}],
                                editor: styleEditorDef
                        }]
            })[0];
            var e = p.c$[2];
            if (isDisabled) e.setDisabled(true);

            e.name = styleGroup + "_" + styleName;
            var checkbox = p.c$[1];
            if (e.editor instanceof wm.Container && e.editor.verticalAlign != "top") {
                p.setVerticalAlign(e.editor.verticalAlign);
            }
            e.connect(e, "onchange", this, dojo.hitch(this, "onEditorChange", checkbox, e, styleGroup, styleName));
            if (e["onCustomEvent"]) {
                e.connect(e, "onCustomEvent", this, dojo.hitch(this, "onCustomEvent", e, styleGroup, styleName));
            }

            checkbox.connect(checkbox, "onchange", this, dojo.hitch(this, "onEditorChange", checkbox, e, styleGroup, styleName));
            this.currentEditorsHash[styleRule || styleName] = e;
        }
        if (styleValue && styleValue != "inherit") {
            if (!e) e = this.currentEditorsHash[styleRule || styleName];
            if (e.setPartialValue) {
                e.setPartialValue(styleName, styleValue);
            } else {
                e.setDataValue(styleValue);
            }
        }
    },
    getIndexOfCss: function(inStyleGroup, inStyleName) {
        var css = this.widgetCssFiles[this.currentWidgetTemplateFile];
        var startIndex = css.indexOf("GROUP: " + inStyleGroup);
        var startBlockIndex = css.indexOf("{", startIndex);
        var styleIndex = css.indexOf(inStyleName, startBlockIndex);
        return styleIndex;
    },
    onCustomEvent: function(inEditor, inStyleGroup, inStyleName, inEventName) {
        if (inEditor instanceof wm.BackgroundEditor) {
            if (inEventName == "onCustomLinkClick") {
                this.codeTogglePanel.setCurrentButton(this.codeToggleButton);
                wm.job("setThemeCursorPosition", 20, this, function() {
                    var index = this.getIndexOfCss(inStyleGroup, inStyleName);
                    this.editArea.setCursorPositionInText(index);
                    this.editArea.focus();
                });
            }

        }

    },
    getStyleObjFromLine: function(inLine) {
        var disabled = false;
        var message = "";
        if (inLine.match(/\/\*.*THEMER:\s*DISABLED/i)) {
            disabled = true;
            inLine = inLine.replace(/\/\*/,"").replace(/;.*$/,";");
        } else if (inLine.match(/THEMER:/)) {
            var matches = inLine.match(/THEMER:\s*(.*?)\s*\*\//);
            message = matches[1];
        }
        var values = inLine.match(/\s*(.*?)\:\s*(.*);/);
        if (values) {
            return {name: values[1], value: values[2], disabled: disabled, message: message};
        }
    },
    getGroupNameFromLine: function(inLine) {
        var values = inLine.match(/\*\sGROUP\:\s*(.*)\*\//);
        if (values) return values[1];
    },

    onEditorChange: function(inCheckbox, inEditor, inGroup, inStyleName) {
        if (this._generatingEditors) return;
        var isEditorEnabled = inCheckbox.getChecked();
        inEditor.setDisabled(!isEditorEnabled);
        var foundGroup = false;
        var currentGroup = "";
        var lines = this.widgetCssFiles[this.currentWidgetTemplateFile].split(/\n/);
        var updateCssLineFired = false;
        var deleteRows = [];
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            var isImportant = l.match(/\!important/);
            l = l.replace(/\s*!important\s*/,"");
            var groupName = this.getGroupNameFromLine(l);
            if (groupName) {
                currentGroup = groupName;
            } else if (currentGroup == inGroup) {
                foundGroup = true;

                var calcString = "THEMER: CALC:";
                var indexOfCalcString = l.indexOf(calcString);
                var hideString = "THEMER: HIDE";
                var indexOfHideString = l.indexOf(hideString);
                if (indexOfHideString != -1) {
                    ;
                } else if (indexOfCalcString != -1) {
                    /* TODO: Need to apply these expressions! */
                    var expr = l.substring(indexOfCalcString, l.indexOf("*/", indexOfCalcString));
                    console.log("EXPR:" + expr);

                } else {
                    var styleObj = this.getStyleObjFromLine(l);
                    if (styleObj) {
                        /* If its a complex editor (has updateCssLIne method) let it examine
                         * every style in the group and update it if it chooses to
                         */
                        if (inEditor.updateCssLine) {
                            // value is sent in case of name "filter" and value "Gradient"
                            // as thats the only way to know that a filter is for background gradient
                            var altLine = inEditor.updateCssLine(styleObj.name, styleObj.value);
                            if (altLine) {
                                var doNotChange = false;
                                if (altLine === true) {
                                    doNotChange = true;
                                    altLine = dojo.trim(lines[i]);
                                }
                                if (!updateCssLineFired) {
                                    lines[i] = "\t" + altLine + (altLine.match(/;\s*(\/\*.*?\*\/)?\s*$/) ? "" : ";");
                                    if (isImportant) {
                                        lines[i] = lines[i].replace(/(\\!simportant)?\s*;/g, " !important;");
                                    }
                                    if (!isEditorEnabled) {
                                        var generatedLines = lines[i].split(/\n+/);
                                        for (var j = 0; j < generatedLines.length; j++) {
                                            if (generatedLines[j].match(/\/\*/)) {
                                                generatedLines[j] = "/* " + generatedLines[j].substring(0, generatedLines[j].indexOf("/*")) + " // THEMER: DISABLED */ " + generatedLines[j].substring(generatedLines[j].indexOf("/*"));

                                            } else {
                                                generatedLines[j] = "/* " + generatedLines[j] + " // THEMER: DISABLED */";
                                            }
                                        }
                                        lines[i] = generatedLines.join("\n");
                                    } else if (lines[i].match(/DISABLED/)) {
                                        // this happens when updateCssLine returns true (matches, but don't try to update it)
                                        lines[i] = lines[i].replace(/\/\*\s*(.*)\/\/ THEMER: DISABLED\s*\*\//, "$1");
                                    }
                                    if (!doNotChange) {
                                        updateCssLineFired = true;
                                    }
                                } else {
                                    lines[i] = "";
                                    deleteRows.push(i);
                                }
                            }
                        }

                        /* Basic editors only edit a single line; exit loop after
                         * making the change
                         */
                        else if (styleObj.name === inStyleName) {
                            lines[i] = "\t" + inStyleName + ": " + inEditor.getDataValue() + ";";
                            if (isImportant) {
                                lines[i] = lines[i].replace(/(\\!simportant)?\s*;/g, " !important;");
                            }
                            if (!isEditorEnabled) {
                                if (lines[i].match(/\/\*/)) {
                                    lines[i] = "/* " + lines[i].substring(0,lines[i].indexOf("/*")) + " // THEMER: DISABLED */ " + lines[i].substring(lines[i].indexOf("/*"));
                                } else {
                                    lines[i] = "/* " + lines[i] + " // THEMER: DISABLED */";
                                }
                            }
                            break;
                        }
                    }
                }
            } else if (foundGroup) {
                break;
            }
        }
        for (var i = deleteRows.length-1; i >= 0; i--) wm.Array.removeElementAt(lines,deleteRows[i]);
        this.widgetCssFiles[this.currentWidgetTemplateFile] = lines.join("\n");

        this.updateCssText();
    },
    updateCssText: function() {
            var startString = "/***** START SECTION: " + this.currentWidgetName + " *****/";
        var endString = "/***** END SECTION: " + this.currentWidgetName + " *****/";
        var startIndex = this.cssText.indexOf(startString);
        if (startIndex != -1) {
            startIndex += startString.length;
            var endIndex = this.cssText.indexOf(endString, startIndex);
            this.cssText =  this.cssText.substring(0,startIndex) + "\n" +
                            this.widgetCssFiles[this.currentWidgetTemplateFile] + "\n" +
                            this.cssText.substring(endIndex);
        } else {
            this.cssText += startString + "\n" + this.widgetCssFiles[this.currentWidgetTemplateFile] + "\n" + endString;
        }
            studio.application._setTheme(this.currentTheme, false, this.cssText, this.themePrototype, true);
//        studio.application.loadThemeCss(this.currentTheme, true, this.cssText);
        if (this.widgetGrid.selectedItem.getValue("templateFile") == "editors" && dojo.isIE == 10 ||
            this.widgetGrid.selectedItem.getValue("templateFile") == "tooltips") {
            this.regenerateDemoPanel(); // dojo directly manipulates the styles of the input node for ie 10, and must regenerate on style change
        }
        this.updateDirty();
    },
    /* END SECTION: Edit the selected widget styles */

    /* START SECTION: Manage AceEditor */
    onCssLayerShow: function() {
        this.editAreaChangedSinceLayerChange = false;
        this.editArea.setDataValue(this.widgetCssFiles[this.currentWidgetTemplateFile]);
    },
    onGeneratedLayerShow: function() {
        if (this.editAreaChangedSinceLayerChange) {
            this.widgetCssFiles[this.currentWidgetTemplateFile] = this.editArea.getDataValue();
            this.updateCssText();
            this.currentWidgetIndex = -1;
            this.widgetGridSelect(this.widgetGrid);
            this.editAreaChangedSinceLayerChange = false;
        }
    },
    editAreaChange: function() {
        this.editAreaChangedSinceLayerChange = this.editArea.isDirty;
    },


    /* START SECTION: Create new subclasses */
    addCustomClassClick: function() {
        this.customClassDialog.show();
    },
    customClassCancelButtonClick: function() {
        this.customClassDialog.hide();
    },
    parentClassSelectChange: function() {
        if (this.subclassCheckboxSet.dataSet.getCount() == 1) {
            this.subclassCheckboxSet.selectItem(0);
            this.subclassCheckboxSet.changed();
        }
    },
    subclassNameChange: function() {
        // update the display values of the checkboxes
        var dataValue = dojo.clone(this.subclassCheckboxSet.getDataValue());
        this.subclassCheckboxSet.setDataSet(this.subclassCheckboxSet.dataSet);
        this.parentClassSelectChange();
    },
    setupCustomWidgetTemplate: function(itemData) {
        var item = this.templateListVar.query({name: itemData.parentName}).getItem(0);
        if (item) {
            var templateFile = item.getValue("templateFile");
            this.widgetCssFiles[this.currentWidgetTemplateFile] = wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + templateFile+ ".css").replace(/\.wm_template/g, "." + this.currentThemeName);
            var replaceName = item.getValue("customWidgetAddClass");
            if (itemData.parentName && replaceName) {
                var reg = new RegExp("\\." + replaceName +"(,|\\.|\\s+)", "g");
                this.widgetCssFiles[this.currentWidgetTemplateFile] =
                    this.widgetCssFiles[this.currentWidgetTemplateFile].replace(reg, "." + itemData.name + "." + replaceName + "$1").replace(/\/\*\s*THEMER\: DO NOT SUBCLASS START(.|\n)*?THEMER\: DO NOT SUBCLASS END\s*\*\//gm,"");

                /* Disable all css within the template */
                var lines = this.widgetCssFiles[this.currentWidgetTemplateFile].split(/\n/);
                for (var i = 0; i < lines.length; i++) {
                    var l = lines[i];
                    var calcString = "THEMER: CALC:";
                    var indexOfCalcString = l.indexOf(calcString);
                    var hideString = "THEMER: HIDE";
                    var indexOfHideString = l.indexOf(hideString);
                    if (indexOfCalcString == -1 && indexOfHideString == -1) {
                        var styleObj = this.getStyleObjFromLine(l);
                        if (styleObj && !styleObj.disabled) {
                            lines[i] = "/* " + styleObj.name + ": " + styleObj.value + "; // THEMER: DISABLED */" + (styleObj.message ? " // THEMER: " + styleObj.message : "");
                        }
                    }
                }
                this.widgetCssFiles[this.currentWidgetTemplateFile] = lines.join("\n");
            }
        }
    },
    customClassOKButtonClick: function() {
        var parentClassName = this.parentClassSelect.getDataValue();
        var newClassName = this.newCustomClassNameEditor.getDataValue();
        newClassName = dojo.trim(newClassName);
            newClassName = newClassName.replace(/\s+[a-zA-Z]/g, function(inChars) {
            return inChars.substring(1,2).toUpperCase();
        });
        newClassName = newClassName.replace(/[^0-9a-zA-Z_]/g, "_");
        if (!parentClassName) return app.alert("Please select a parent class first");
        if (!newClassName) return app.alert("Please enter a name for your new class");
        if (this.templateListVar.query({name: newClassName}).getCount() > 0) return app.alert("That name is already taken, please select a new name");
        if (!this.subclassCheckboxSet.getDataValue()) return app.alert("Please select a widget to subclass");

        this.customClassDialog.hide();
        /* STEP 1: Update custom Widgets and write it to the file system */
        this.customWidgets.push({name: newClassName, parentName: parentClassName, classList: this.subclassCheckboxSet.getDataValue()});
        studio.resourceManagerService.requestAsync("writeFile",
            ["/common/themes/" + this.currentThemeName + "/customwidgets.json",
            dojo.toJson(this.customWidgets,true)]).then(dojo.hitch(this, function() {
                /* STEP 2: Update the grid's dataSet */
                this.widgetGrid.dojoObj.updateDelay = 0;
                this.templateListVar.setData(this.templateFileData.concat(dojo.clone(this.customWidgets)));

                /* STEP 3: Select the grid item and Generate the new theme file */
                wm.onidle(this, function() {
                    this.widgetGrid.selectByQuery({name: newClassName});
                    this.currentWidgetIndex = -1;
                    this.widgetGridSelect(this.widgetGrid);
                });
            }));
    },
    removeCustomClassClick: function() {
        if (!this.widgetGrid.selectedItem.getValue("parentName")) return;
        app.confirm("Are you sure you want to delete this?  Until you save, this removal is not permanent.").then(
            dojo.hitch(this, function() {
                var name = this.widgetGrid.selectedItem.getValue("name");
                var customWidgets = [];
                var removedWidget;
                delete this.widgetCssFiles[name];
                /* STEP 1: Remove the item from customWidgets and the Grid */
                dojo.forEach(this.customWidgets, function(customWidget) {
                    if (customWidget.name != name) customWidgets.push(customWidget);
                    else removedWidget = customWidget;
                });
                this.customWidgets = customWidgets;
                this.templateListVar.setData(this.templateFileData.concat(dojo.clone(this.customWidgets)));

                /* STEP 2: Remove the theme from this.cssText */
                var startString = "/***** START SECTION: " + name + " *****/";
                var endString = "/***** END SECTION: " + name+ " *****/";
                var startIndex = this.cssText.indexOf(startString);
                if (startIndex != -1) {
                    var endIndex = this.cssText.indexOf(endString, startIndex);
                    this.cssText = this.cssText.substring(0,startIndex) + this.cssText.substring(endIndex + endString.length);
                }

                /* STEP 3: Remove the files for this custom style */
                studio.resourceManagerService.requestAsync("deleteFile", ["/common/themes/"+ this.currentThemeName + "/" + name + ".css"]);

            })
        );
    },

    /* START SECTION: Edit the selected widget prototype */
    generatePrototypeEditors: function(currentClassList) {
        this.currentPrototypeProperties = {};
        dojo.forEach(currentClassList, dojo.hitch(this, "generatePrototypeEditorsForClass"));
    },
    generatePrototypeEditorsForClass: function(inClassName) {
        var ctor = dojo.getObject(inClassName);
        if (!ctor) return; /* TODO: Do we need to try to load the component? */

        /* Initialize the prototype data we're storing for this class if it doesn't already exist */
        if (!this.themePrototype[inClassName]) this.themePrototype[inClassName] = {};

        /* Get the editor props from the widget's design time file */
        var editableProps = [];
        if (ctor.prototype.themeableProps) {
            editableProps = dojo.clone(ctor.prototype.themeableProps);
            var tmp = [];
            dojo.forEach(editableProps, function(inPropName) {
                if (!this.currentPrototypeProperties[inPropName]) {
                    tmp.push(inPropName);
                    this.currentPrototypeProperties[inPropName] = true;
                }
            }, this);
            editableProps = tmp;
        }

        /* Generate an editor for each one */
        if (editableProps.length) {
            new wm.Label({name: "mainPanel1Label",
                  caption: "Default Properties for " + inClassName,
                  width: "100%",
                  height: "24px",
                  parent: this.editorPanel,
                  owner: this,
                  _classes: {domNode: ["SubHeading"]}
            });
            dojo.forEach(editableProps, dojo.hitch(this, "generatePrototypeEditor", inClassName, ctor));
        }
    },
    generatePrototypeEditor: function(inClassName, ctor, p) {
        var initialValue;
        if (this.widgetGrid.selectedItem.getValue("parentName")) {
            var data = this.getCurrentCustomWidgetItem().customProps;
            initialValue = data && data[p] || this.themePrototype[inClassName][p] || ctor.prototype[p];
        } else {
            initialValue = this.themePrototype[inClassName][p] || ctor.prototype[p];
        }
        var props = dojo.mixin({
            caption: p,
            dataValue: initialValue,
            owner: this,
            parent: this.editorPanel,
            name: p
        }, this.defaultEditorProps);
        props.width = this.defaultEditorWidth + parseInt(props.captionSize) + "px";
        props.margin = "0,0,0," + this.editorMargin;
        var e;
        switch(p) {
        case "borderColor":
        case "clientBorderColor":
        case "labelBorderColor":
        case "captionBorderColor":
        case "titlebarBorderColor":
        case "buttonBorderColor":
                    e = new wm.ColorPicker(props);
                    break;
        case "border":
        case "labelBorder":
        case "layerBorder":
        case "captionBorder":
        case "footerBorder":
                    //props.regExp = "\\d+(\\s*,\\s*\\d+){0,3}";
                    //e = new wm.Text(props);
                    e = new wm.BorderWidthEditor(props);
                    break;
        case "width":
        case "height":
        case "imgWidth":
        case "imgHeight":
        case "mobileHeight":
        case "desktopHeight":
        case "captionSize":
        case "buttonBarHeight":
            if ((p == "desktopHeight" || p == "mobileHeight") && props.dataValue === undefined) {
                props.dataValue = this.themePrototype[inClassName].height || ctor.prototype.height;
            }
            e = new wm.prop.SizeEditor(props);
            break;
        case "captionPosition":
            props.options = "left,top,right,bottom";
            e = new wm.SelectMenu(props);
            break;
        case "captionAlign":
            props.options = "left,center,right";
            e = new wm.SelectMenu(props);
            break;
        default:
            if (typeof props.dataValue == "boolean") {
                e = new wm.Checkbox(props);
                e.setChecked(props.dataValue);
            } else {
                e = new wm.Text(props);
            }
        }
        e.connect(e, "onchange", dojo.hitch(this, "onPrototypeEditorChange", p, e));

        // Sometimes the theme clobbers this, so force it to be set
        e.setCaptionPosition("left");
    },
    getCurrentCustomWidgetItem: function() {
     var customWidgetItem;
     dojo.forEach(this.customWidgets, function(customWidget) {
                if (customWidget.name == this.widgetGrid.selectedItem.getValue("name")) {
                    customWidgetItem = customWidget;
                }
            }, this);
        return customWidgetItem;
    },
    onPrototypeEditorChange: function( inPropName, editor, inDisplayValue, inDataValue) {
        if (!editor.isValid()) return;
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
        studio.application.cacheWidgets();


        if (this.widgetGrid.selectedItem.getValue("parentName")) {
            var customWidgetItem = this.getCurrentCustomWidgetItem();

            var data = customWidgetItem.customProps;
            if (!data) data = {};
            data[inPropName] = inDataValue;
            customWidgetItem.customProps = data;
        } else {
            dojo.forEach(this.currentClassList, function(inClassName) {
                var ctor = dojo.getObject(inClassName);
                if (ctor.prototype.themeableProps && dojo.indexOf(ctor.prototype.themeableProps,inPropName) != -1) {

                    studio.application.loadThemePrototypeForClass(ctor); // make sure the prototype is loaded before we start editting it
                    ctor.prototype[inPropName] = inDataValue;
                    this.themePrototype[inClassName][inPropName] = inDataValue;
                }
            }, this);
        }
        this.regenerateDemoPanel();
        this.onPrototypeChange();
        this.updateDirty();
    },
    onPrototypeChange: function() {
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
    },
    /* END SECTION: Edit the selected widget prototype */


    /* START SECTION: Saving */
    saveThemeClick: function() {
        if (this.cssLayer.isActive() && this.editArea.isDirty) {
            this.onGeneratedLayerShow();
            this.widgetCssFiles[this.currentWidgetTemplateFile]= this.editArea.getDataValue();
            this.updateCssText();
        }
        var files = this._templateFilesToWrite = [];
        wm.forEachProperty(this.widgetCssFiles, function(inValue, inName) {
            files.push({fileName: inName, cssText: inValue});
        });
        studio.beginWait("Saving...");
        this.resetCache();
        studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/themedesigner.css", this.cssText]).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/theme.css", this.optimizeCss(this.cssText)]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/mtheme.css", this.optimizeCss(this.cssText)]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/Theme.js", dojo.toJson(this.themePrototype, true)]);
            })
        ).then(
            dojo.hitch(this, "writeMobileCss")
        ).then(dojo.hitch(this, "writeTemplateFiles")
        ).then(dojo.hitch(this, "writeCustomWidgetsJson")
        ).then(dojo.hitch(this, "writePackagesJs")
        ).then(dojo.hitch(studio, "themeChanged", this.currentTheme)
        ).then(dojo.hitch(this, "updateDirty"));
    },
    writePackagesJs: function() {
        var packages = [];
        dojo.forEach(this.customWidgets, function(customWidget) {
            if (customWidget.category) return;
            var classNames = dojo.map(customWidget.classList, function(item) {
                return item.dataValue;
            });
            dojo.forEach(classNames, function(className) {
                var parentPaletteNode = studio.palette.findNodeByCallback(function(n) {
                    if (n.data.klass == className) return true;
                });
                var elements = [];
                elements.push("'Theme Widgets'");
//                elements.push("'" + (classNames.length == 1 ? customWidget.name : customWidget.name + wm.capitalize(className.replace(/^.*\./,""))) + "'");
                elements.push("'" + customWidget.name + "<span class=\"ThemeSubclassName\">" + wm.packageNames[className] + "</span>'");
                elements.push("'" + className + "'");
                elements.push("'" + parentPaletteNode.module + "'");
                elements.push("'" + parentPaletteNode.image + "'");
                elements.push("''");
                var props = dojo.clone(customWidget.customProps || {});
                props._classes = {domNode: [customWidget.name]};
                elements.push(dojo.toJson(props));
                packages.push("[" + elements.join(",") + "]");
            });
        }, this);
        return studio.resourceManagerService.requestAsync("writeFile",
            ["/common/themes/" + this.currentThemeName + "/packages.js",
            packages.join(",\n")]);
    },
    writeCustomWidgetsJson: function() {
        return studio.resourceManagerService.requestAsync("writeFile",
            ["/common/themes/" + this.currentThemeName + "/customwidgets.json",
            dojo.toJson(this.customWidgets,true)]);
    },

    writeMobileCss: function() {
        var css = this.cssText;
        var braceBlocks = [];
        var index = 0;
        while (true) {
            var startIndex = css.indexOf("{",index);
            if (startIndex == -1) break;
            var endIndex = css.indexOf("}", startIndex);
            if (endIndex == -1) break;
            braceBlocks.push({start: startIndex, end: endIndex});
            index = endIndex;
        }
        for (var i = 0; i < braceBlocks.length; i++) {
            // find the first non-comment before start and after the last end
            var start = braceBlocks[i].start;
            var priorEnd = i == 0 ? 0 : braceBlocks[i-1].end+1;
            var inComment = false;
            for (var charIndex = priorEnd; charIndex < start; charIndex++) {
                if (css.substr(charIndex,2) == "/*") {
                    inComment = true;
                } else if (css.substr(charIndex,2) == "*/") {
                    inComment = false;
                    charIndex++; // skip the "/"
                } else if (!inComment && !css.substr(charIndex,1).match(/\s/m)) {
                    braceBlocks[i].ruleStart = charIndex;
                    break;
                }
            }
        }
        for (var i = 0; i < braceBlocks.length; i++) {
            var rule = css.substring(braceBlocks[i].ruleStart, braceBlocks[i].start);
            while(true) {
                var index = rule.indexOf(".dojoxGrid");
                if (index == -1) break;
                var startOfRuleSegment = Math.max(rule.lastIndexOf("\n",index), rule.lastIndexOf("\r",index), rule.lastIndexOf(",",index));
                if (startOfRuleSegment == -1) startOfRuleSegment = 0; // start of string is the start of the rule segment
                var endIndex1 = rule.indexOf(",",index);
                var endIndex2 = rule.indexOf("{", index);
                var endIndex;
                if (endIndex1 != -1 && endIndex2 != -1) {
                    endIndex = Math.min(endIndex1,endIndex2);
                } else if (endIndex1 == -1) {
                    endIndex = endIndex2;
                } else {
                    endIndex = endIndex1;
                }
                if (startOfRuleSegment <= 0 && endIndex <= 0) {
                    rule = "";
                    break;
                } else if (startOfRuleSegment <= 0) {
                    rule = rule.substring(endIndex);
                    rule = rule.substring(rule.indexOf(",")+1);
                } else if (endIndex <= 0) {
                    rule = rule.substring(0,startOfRuleSegment-1);
                } else {
                    rule = rule.substring(0,startOfRuleSegment-1) + rule.substring(endIndex);
                }
            }
            braceBlocks[i].rule = rule;
        }

        for (var i = braceBlocks.length-1; i >= 0; i--) {
            if (braceBlocks[i].rule) {
                css = css.substring(0,braceBlocks[i].ruleStart) + braceBlocks[i].rule + css.substring(braceBlocks[i].start);
            } else {
                css = css.substring(0,braceBlocks[i].ruleStart) + css.substring(braceBlocks[i].end+1);
            }
        }
        css = this.optimizeCss(css);
         return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/mtheme.css", css]);
    },
    optimizeCss: function(inText) {
        // strip out blocked content
        inText = inText.replace(/\n.*?\/\* THEMER: REMOVE LINE .*?\n/g,"\n");

    	// strip out comments
    	inText = inText.replace(/\/\*(.|\n)*?\*\//gm,"")


    	// strip out white space
    	inText = inText.replace(/^\s*/gm,"").replace(/\s*$/gm,"");

    	return inText;
    },

    writeTemplateFiles: function() {
        if (this._templateFilesToWrite.length) {
            var fileObj = this._templateFilesToWrite.shift();
            var fileName = fileObj.fileName + ".css";
            var cssText = fileObj.cssText;
            studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/" + fileName, cssText]).then(dojo.hitch(this, "writeTemplateFiles"));
        } else {
            studio.endWait();
            app.toastSuccess("Saved");
        }

    },
    exportThemeClick: function() {
//        var path = wm.dojoModuleToPath(this.currentTheme).replace(/^.*\/common\//, "/common/");
        studio.downloadInIFrame("services/deploymentService.download?method=exportTheme&themename=" + this.currentThemeName);
    },

    /* START SECTION: Managing the Demo Panel */
    onShow: function() {
        this.demoPanelWithAppRoot.owner = studio.application;
        dojo.toggleClass(this.demoPanelWithThemeName.domNode, "wmmobile", studio.currentDeviceType != "desktop");

        if (!this.currentTheme) this.setupThemeList(studio.application._theme);

        if (this.currentTheme && this.currentTheme != studio.application._theme) this.updateCssText();

        // mostly this is needed because the user may switch from desktop to mobile in the canvas
        // and that requires regenerating the demo panel with mobileheights, and checkboxes and lists...
        if (this.currentTheme && this.currentWidgetIndex > 1) this.regenerateDemoPanel();

    },
    onHide: function() {
        this.demoPanelWithAppRoot.owner = this;
    },
    regenerateDemoPanel: function() {
        wm.onidle(this, function() {
            this.demoPanelHeader.setCaption("Samples (" + studio.currentDeviceType + ")");
            this.demoPanelWithAppRoot.removeAllControls();
            this.demoPanel = this.demoPanelWithAppRoot.createComponents({
                demoPanel:  ["wm.Panel", {_classes: {domNode: ["wmpagecontainer"]}, autoScroll:true, layoutKind: "top-to-bottom", height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {}]
            })[0];

            wm.forEachProperty(this.themePrototype["wm.AppRoot"], dojo.hitch(this, function(inValue, inName) {
                this.demoPanel.setValue(inName, inValue);
            }));
            this.demoPanel.createComponents(this.sampleWidgets);

            var widgetTemplateFile = this.widgetGrid.selectedItem.getValue("templateFile");
            var selectedItem = this.widgetGrid.selectedItem.getData();
            if (selectedItem.parentName) {
                var parentItem = this.templateListVar.query({name: selectedItem.parentName}).getItem(0);
                widgetTemplateFile = parentItem.getValue("templateFile");
                dojo.query("." + parentItem.getValue("customWidgetAddClass"), this.demoPanel.domNode.id).addClass(selectedItem.name);
                var defaultProps = this.getCurrentCustomWidgetItem().customProps;
                var widgetClassList = parentItem.getValue("classList").map(function(inItem) {
                    return dojo.getObject(inItem.getValue("dataValue"));
                });
                wm.forEachWidget(this.demoPanel, dojo.hitch(this, function(w) {
                    if (w != this.demoPanel && wm.isInstanceType(w, widgetClassList)) {
                        wm.forEachProperty(defaultProps, function(inValue, inName) {
                            w.setValue(inName, inValue);
                        });
                    }
                }), true);
            }

            if (this._cacheRenderBoundsFunc) {
                app.toolTipDialog.insureDialogVisible = this._cacheRenderBoundsFunc;
                delete this._cacheRenderBoundsFunc;
            }

            /* Custom hacks needed to get the sample widgets to work */
            switch(widgetTemplateFile) {
                case "grid":
                    this.demoPanel.c$[1].setDataSet(this.sampleDataSet);
                    this.demoPanel.c$[3].setDataSet(this.sampleDataSet);
                    this.demoPanel.c$[5].setDataSet(this.sampleDataSet);
                    break;
                case "dialogs":
                case "dialogbuttonbar":
                    var parent = this.demoPanel.c$[0].buttonBar;
                    new wm.Button({owner: parent, parent: parent, caption: "OK"});
                    new wm.Button({owner: parent, parent: parent, caption: "Cancel"});
                    this.demoPanel.c$[0].containerWidget.setPadding(wm.Dialog.prototype.containerPadding);
                    break;
                case "togglebuttonpanel":
                    this.demoPanel.c$[0].setCurrentButton(this.demoPanel.c$[0].c$[0]);
                    break;
                case "tooltips":
                    app.createToolTip("This is a tool tip.  Not just any ordinary tool tip.  This tool tip is one styled by you!", this.demoPanel.c$[1].domNode);
                    this._cacheRenderBoundsFunc = app.toolTipDialog.insureDialogVisible;
                    app.toolTipDialog.insureDialogVisible = function() {};
                    wm.onidle(this, "fixToolTips");
                    break;
                case "toast":
                    studio.application.createToastDialog();
                    studio.application.toastDialog._designer = null;
                    if (studio.application.toastDialog.designWrapper) {
                        studio.application.toastDialog.designWrapper.destroy();
                        delete studio.application.toastDialog.designWrapper;
                    }
                    wm.forEachProperty(this.themePrototype["wm.Toast"], dojo.hitch(this, function(inValue, inName) {
                        studio.application.toastDialog.setValue(inName, "");
                        studio.application.toastDialog.setValue(inName, inValue);
                    }));
                    var wasShowing = false;
                    if (studio.application.toastDialog.showing) {
                        studio.application.toastDialog.hide();
                        wasShowing = true;
                    }
                    this.demoPanel.domNode.appendChild(studio.application.toastDialog.domNode);
                    this.demoPanel.c$[0].connect(this.demoPanel.c$[0], "onclick", this, function() {
                        studio.application.toastDialog.showToast("Your toast has popped up with a message indicating that you have finally been successful", 100000, "Success","tl");

                    });
                    this.demoPanel.c$[1].connect(this.demoPanel.c$[1], "onclick", this, function() {
                        studio.application.toastDialog.showToast("Your toast has popped up with a message warning you that you might not want to have cheese with your toast.", 100000, "Warning", "tl");

                    });
                    this.demoPanel.c$[2].connect(this.demoPanel.c$[2], "onclick", this, function() {
                        studio.application.toastDialog.showToast("Your toast has popped up with an error message telling you not to click that button again.", 100000, "Error", "tl");

                    });
                    this.demoPanel.c$[3].connect(this.demoPanel.c$[3], "onclick", this, function() {
                        studio.application.toastDialog.showToast("Your toast has popped up with a message containing useful information; in this case, an indicator to you that your toast dialog has in fact been openned.", 100000, "Info", "tl", "Toasted");

                    });
                    if (wasShowing) {
                        if (dojo.hasClass(studio.application.toastDialog.domNode, "Success")) {
                            this.demoPanel.c$[0].click();
                        } else if (dojo.hasClass(studio.application.toastDialog.domNode, "Warning")) {
                            this.demoPanel.c$[1].click();
                        } if (dojo.hasClass(studio.application.toastDialog.domNode, "Error")) {
                            this.demoPanel.c$[2].click();
                        } if (dojo.hasClass(studio.application.toastDialog.domNode, "Info")) {
                            this.demoPanel.c$[3].click();
                        }
                    }
                    break;
            }

            this.demoPanelWithAppRoot.reflow();
        });
    },
    fixToolTips: function() {
        dojo.disconnect(app._testHintConnect);
        this.demoPanel.domNode.appendChild(app.toolTipDialog.domNode);
        app.toolTipDialog.domNode.style.left = "20px";
        app.toolTipDialog.domNode.style.top = "20px";
        wm.onidle(this, function() {
            app.toolTipDialog.html.doAutoSize(true, true);
            wm.job("WidgetThemerTooltips", wm.Container.runDelayedReflow * 2, this, function() {
                app.toolTipDialog.setBestHeight();
                this.demoPanel.domNode.appendChild(app.toolTipDialog.domNode);
                app.toolTipDialog.domNode.style.left = "20px";
                app.toolTipDialog.domNode.style.top = "20px";
            });
        });
    },

    /* END SECTION: Managing the Demo Panel */


    themeHelp: function() {
         window.open(studio.getDictionaryItem("URL_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + "ThemeDesigner");

    },

    /* START SECTION: Studio Integration Methods */
    resetCache: function() {
            this._cache = {css: this.cssText,
                            themePrototype: dojo.toJson(this.themePrototype)};
    },
    updateDirty: function() {
        this.isDirty = (this.cssText != this._cache.css || dojo.toJson(this.themePrototype) != this._cache.themePrototype);
        wm.job("WidgetThemerPage.setDirty", 10, this, function() {
            var layer = this.owner.parent;
            if (!this.isDirty) {
                dojo.removeClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
                studio.updateServicesDirtyTabIndicators();
                studio.userLabel.setCaption(this._cacheUserLabel != "THEME NOT SAVED" ? this._cacheUserLabel : "");
                studio.userLabel.domNode.style.backgroundColor = "";
            } else {
                dojo.addClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
                studio.updateServicesDirtyTabIndicators();
                this._cacheUserLabel = studio.userLabel.caption;
                studio.userLabel.setCaption("THEME NOT SAVED");
                studio.userLabel.domNode.style.backgroundColor = "red";
            }
        });
    },
    getDirty: function() {
        return this.isDirty;
    },
    /* END SECTION: Studio Integration Methods */

    _end: 0
});