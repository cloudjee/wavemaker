/* TODO:
  * 1. License files
  * 2. How to handle upgrades that add new css
  * 3. Header/Emphasized Content Panels
  * 4. Dialog/Button panels
  * 5. Filter the theme list to only show themes created by THIS theme designer
  */

dojo.declare("WidgetThemerPage", wm.Page, {
    "preferredDevice": "desktop",
    defaultEditorProps: {
        _classes: {domNode: ["StudioEditor"]},
        width: "100%",
        captionSize: "120px",
        captionAlign: "left",
        margin: "0,0,0,15"
    },


    templateFileData: [
        {
            name: "Main Document",
            templateFile: "document",
            classList: [{dataValue: "wm.AppRoot"}]
        },
        {
            name: "Buttons",
            templateFile: "button",
            classList: [{dataValue: "wm.Button"},{dataValue: "wm.ToggleButton"}, {dataValue: "wm.PopupMenuButton"}]
        },
        {
            name: "Editors",
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
                        {dataValue: "wm.ListSet"}
                    ]
        },
        {
            name: "Tabs",
            templateFile: "tabs",
            classList: [{dataValue: "wm.TabLayers"}]
        },
        {
            name: "Accordions",
            templateFile: "accordions",
            classList: [{dataValue: "wm.AccordionLayers"}]
        },
        {
            name: "Titled Panel",
            templateFile: "titledpanel",
            classList: [{dataValue: "wm.FancyPanel"}]
        },
        {
            name: "Dialogs",
            templateFile: "dialogs",
            classList: [{dataValue: "wm.Dialog"},
                        {dataValue: "wm.PageDialog"},
                        {dataValue: "wm.GenericDialog"},                        
                        {dataValue: "wm.DesignableDialog"}]
            
        },
        {
            name: "Grids",
            templateFile: "grid",
            classList: [{dataValue: "wm.DojoGrid"},
                        {dataValue: "wm.List"}]
            
        },
        {
            name: "Menus",
            templateFile: "menus",
            classList: [{dataValue: "wm.DojoMenu"}]            
        },
        {
            name: "Combobox Dropdowns",
            templateFile: "combodropdowns",
            classList: []            
        },
        {
            name: "Progress Bar",
            templateFile: "progressbar",
            classList: [{dataValue: "wm.dijit.ProgressBar"}]            
        },
        {
            name: "Splitter/Bevel",
            templateFile: "splitterbevel",
            classList: [{dataValue: "wm.Bevel"}]            
        },
        {
            name: "Calendar",
            templateFile: "calendar",
            classList: [{dataValue: "wm.dijit.Calendar"}]            
        },
        {
            name: "Main Content Panel",
            templateFile: "panels",
            classList: [{dataValue: "wm.MainContentPanel"}]            
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
		"width": ["wm.prop.SizeEditor", {allSizeTypes:true, defaultValue: 20}],		
		"height": ["wm.prop.SizeEditor", {allSizeTypes:true, defaultValue: 20}],				
		"color": ["wm.ColorPicker", {caption: "font color"}],
		"border": ["wm.BorderEditor", {caption: "border"}],		
		"outline": ["wm.BorderEditor", {caption: "outline"}],				
		"font-weight": ["wm.SelectMenu", {options: "normal,bold"}],
		"border-radius":["wm.BorderRadiusEditor", {caption: "border-radius"}],
		"box-shadow":   ["wm.BoxShadowEditor", {caption: "box-shadow"}],
		"background": ["wm.BackgroundEditor", {caption: "background"}]

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
        // should have filter here, but thats a screwy microsoft style.
        
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
        this.connect(studio.project, "projectChanging", this, "onHide");
        this.templateListVar.setData(this.templateFileData);
        this.setupThemeList(studio.application.theme);    
        this.connect(dijit.popup, "_createWrapper", this, "moveMenuNode");
        this.themeListVar.setQuery({designer: "widgetthemer"});
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
    },
    themeselectChange: function(inSender) {
        if (this.currentTheme) dojo.removeClass(this.demoPanelWithThemeName.domNode, this.currentThemeName);
        var currentTheme = inSender.getDataValue();
        if (!currentTheme) {
            this.mainPanel.setDisabled(true);
            return;
        } else if (this.mainPanel.disabled) {
            this.mainPanel.setDisabled(false);
        }
        this.currentTheme = currentTheme;
        this.currentThemeName = currentTheme.replace(/^.*\./,"");
        this.widgetCssFiles = {};

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


            /* Step 6: Load the Theme.js file, store it in this.themePrototype */
            this.themePrototype =  dojo.fromJson(dojo.xhrGet({url:path + "Theme.js", sync:true, preventCache:true}).results[0]);

            studio.application.setTheme(this.currentTheme, false, this.cssText || " ", this.themePrototype, true);
            this.onPrototypeChange();
            studio.application.cacheWidgets();
            this.setDirty(false);

            this.widgetGrid.deselectAll();
            this.widgetGrid.select(0);

            studio.endWait();
        });
    },
    copyThemeClick: function() {
        app.prompt("Enter theme name", studio.project.projectName + "Theme", dojo.hitch(this, "copyTheme"));    
    },
    copyTheme: function(inThemeName) {
        inThemeName = inThemeName.replace(/[^a-zA-Z0-9_]/g,"");

        /* TODO: Update this query once themeListVar stops being a StringData var */
        if (this.themeListVar.query({dataValue: inThemeName}).getCount()) {
            app.prompt(inThemeName + " is taken. Enter a different theme name", studio.project.projectName + "Theme", dojo.hitch(this, "copyTheme"));
            return;
        }
        studio.resourceManagerService.requestAsync("copyFolder", ["/common/themes/" + this.currentThemeName, "/common/themes/" + inThemeName]).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("getFolder", ["/common/themes/" + inThemeName]);
            })
        ).then(
            dojo.hitch(this, function(inResult) {
                this.filesToUpdate = dojo.filter(inResult.files, function(f) {
                    return f.file.match(/\.css$/);
                });
                return this.updateClassNameInFiles(inThemeName);
            })
        ).then( 
            dojo.hitch(this, function() {
                return studio.loadThemeList();
            })
        ).then(
            dojo.hitch(this, function() {
                this.setupThemeList("common.themes." + inThemeName);
            })
        );
    },
    updateClassNameInFiles: function(inThemeName) {
        if (!this.updateClassNameInFilesDeferred) {
            this.updateClassNameInFilesDeferred = new dojo.Deferred();
        }
        if (this.filesToUpdate && this.filesToUpdate.length) {
            var file = this.filesToUpdate.pop();
        
            var fileText = wm.load(dojo.moduleUrl("common.themes." + inThemeName) + file.file);
            var r = new RegExp("." + this.currentThemeName, "g");
            fileText = fileText.replace(r, "." + inThemeName);
            studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/" + file.file, fileText]).then(dojo.hitch(this, "updateClassNameInFiles", inThemeName)); 
        } else {
            this.updateClassNameInFilesDeferred.callback();
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

        /* Step 1: Create the theme folder */
        /* TODO: Need to have default theme.css file, presumably a compiled version of all of the individual theme templates */
        studio.resourceManagerService.requestAsync("createFolder", ["/common/themes/" + inThemeName]).then(            
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/themedesigner.css", ""]);
            })
        ).then(dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/theme.css", ""]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/mtheme.css", ""]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + inThemeName + "/Theme.js", "{}"]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.loadThemeList();
            })
        ).then(
            dojo.hitch(this, function() {
                this.setupThemeList("common.themes." + inThemeName);
            })
        );
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
                this.setupThemeList(studio.application.theme || "");
            })
        );
    },
    revertThemeClick: function() {
        this.themeselectChange(this.themeSelect);       
    },    
    /* END SECTION: End of managing themes and theme selection */



    /* START SECTION: Edit the selected widget styles and properties */
    widgetGridSelect: function(inSender) {

        /* Step 1: Set the current widget data */
        this.currentWidgetName = inSender.selectedItem.getValue("name");
        this.currentWidgetTemplateFile = inSender.selectedItem.getValue("templateFile");
        var heading = "";
        var currentClassList = this.currentClassList = [];
        inSender.selectedItem.getValue("classList").forEach(function(inItem) {
            currentClassList.push(inItem.getValue("dataValue"));
        });
        this.editorPanelHeader.setCaption(currentClassList.join(", "));


        /* Step 2: Load the css file and the sample file and apply it to the demo panel */
        if (!this.widgetCssFiles[this.currentWidgetTemplateFile]) {
            this.widgetCssFiles[this.currentWidgetTemplateFile] = wm.load(dojo.moduleUrl("common.themes." + this.currentThemeName) + this.currentWidgetTemplateFile + ".css?" + (Math.floor(Math.random(new Date().getTime()) * 1000000))) ||
                                        wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + this.currentWidgetTemplateFile + ".css").replace(/\.wm_template/g, "." + this.currentThemeName);
        }        
        
        this.sampleWidgets =  dojo.fromJson(wm.load(dojo.moduleUrl("wm.studio.app.templates") + "widgetthemes/" + this.currentWidgetTemplateFile + ".widgets"));
        
        this.regenerateDemoPanel();
        this.editArea.setDataValue(this.widgetCssFiles[this.currentWidgetTemplateFile]);

        /* Generate the editors */
        this.editorPanel.removeAllControls();
        this.generatePrototypeEditors(this.currentClassList);
        this.generateCssEditors(this.currentWidgetTemplateFile);
        this.editorPanel.reflow();
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
                            this.generateCssEditor(styleObj.name, styleObj.value, parent, currentGroup);
                        }
                    }
                }
            }, this);
        } catch(e) {}
        delete this._generatingEditors;
    },
    generateCssEditor: function(styleName, styleValue, parent, styleGroup) {
        styleValue = String(styleValue).replace(/\s\!important/, "");
        var styleEditorDef;
        var styleRule = this.styleRules[styleName];
        if (styleName == "filter" && styleValue.match(/Gradient/i)) {
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
            
            if (styleEditorDef[0] == "wm.BackgroundEditor") {
                styleEditorDef[1].urlPlaceHolder = wm.dojoModuleToPath(this.currentTheme + ".images") + "/example.png";
            }
            
            dojo.mixin(styleEditorDef[1], this.defaultEditorProps);
            var caption = styleEditorDef[1] && styleEditorDef[1].caption || styleName;            
            styleEditorDef[1].caption = "";
            
            var ctor = dojo.getObject(styleEditorDef[0]);
            var defaultHeight = ctor ? ctor.prototype.height : "24px";
            var p = parent.createComponents({
                panel: ["wm.Panel", {width: "100%", height: defaultHeight, padding: "0", margin: "0,0,0,20",
                                     layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
                                label: ["wm.Label", {width: "120px", caption:  caption}],
                                checkbox: ["wm.Checkbox", {width: "16px", startChecked: styleValue && styleValue != "inherit" && styleValue != "initial"}],
                                editor: styleEditorDef
                        }]                        
            })[0];
            var e = p.c$[2];
            e.name = styleGroup + "_" + styleName;
            var checkbox = p.c$[1];
            if (e.editor instanceof wm.Container && e.editor.verticalAlign != "top") {
                p.setVerticalAlign(e.editor.verticalAlign);
            }
            e.connect(e, "onchange", this, dojo.hitch(this, "onEditorChange", checkbox, e, styleGroup, styleName)); 
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
    getStyleObjFromLine: function(inLine) {
        var values = inLine.match(/\s*(.*?)\:\s*(.*);/);
        if (values) {
            return {name: values[1], value: values[2]};
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
                                if (!updateCssLineFired) {
                                    if (isEditorEnabled) {
                                        lines[i] = "\t" + altLine + (altLine.match(/;\s*$/) ? "" : ";");
                                    } else {
                                        lines[i] = "\t" + altLine.replace(/\:(.|\n|\r)*/m,"") + ": inherit;";
                                    }
                                    if (isImportant) {
                                        lines[i] = lines[i].replace(/(\\!simportant)?\s*;/g, " !important;");
                                    }
                                    updateCssLineFired = true;
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
                            if (isEditorEnabled) {                        
                                lines[i] = "\t" + inStyleName + ": " + inEditor.getDataValue() + ";";
                                if (isImportant) {
                                    lines[i] = lines[i].replace(/(\\!simportant)?\s*;/g, " !important;");
                                }
                            } else {
                                lines[i] = "\t" + inStyleName + ": inherit;";
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
        studio.application.loadThemeCss(studio.application.theme, true, this.cssText);
    },
    /* END SECTION: Edit the selected widget styles */

    /* START SECTION: Manage AceEditor */
    /* TODO: Support user editing this file, OR make it readonly */
    onCssLayerShow: function() {
        this.editAreaChangedSinceLayerChange = false;
        this.editArea.setDataValue(this.widgetCssFiles[this.currentWidgetTemplateFile]);
    },
    onGeneratedLayerShow: function() {
        if (this.editAreaChangedSinceLayerChange) {
            this.widgetCssFiles[this.currentWidgetTemplateFile] = this.editArea.getDataValue();
            this.updateCssText();            
            this.widgetGridSelect(this.widgetGrid);
            this.editAreaChangedSinceLayerChange = false;
        }
    },
    editAreaChange: function() {
        this.editAreaChangedSinceLayerChange = this.editArea.isDirty;
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
                  owner: this
            });
            dojo.forEach(editableProps, dojo.hitch(this, "generatePrototypeEditor", inClassName, ctor));
        }
    },
    generatePrototypeEditor: function(inClassName, ctor, p) {
        var props = dojo.mixin({
            caption: p,
            dataValue: this.themePrototype[inClassName][p] || ctor.prototype[p],
            owner: this,
            parent: this.editorPanel,
            name: p
        }, this.defaultEditorProps);
        var e;
        switch(p) {
        case "borderColor":
        case "clientBorderColor":
        case "labelBorderColor":
        case "captionBorderColor":        
                    e = new wm.ColorPicker(props);
                    break;
        case "border":
        case "labelBorder":
        case "layerBorder":
        case "captionBorder":        
                    props.regExp = "\\d+(\\s*,\\s*\\d+){0,3}";
                    e = new wm.Text(props);
                    break;
        case "width":
        case "height":        
        case "mobileHeight":        
        case "desktopHeight":                
                    e = new wm.prop.SizeEditor(props);
                    break;
        default:
                    e = new wm.Text(props);
        }
        e.connect(e, "onchange", dojo.hitch(this, "onPrototypeEditorChange", p, e));
    },
    onPrototypeEditorChange: function( inPropName, editor, inDisplayValue, inDataValue) {
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
        studio.application.cacheWidgets();
        this.setDirty(true);

        dojo.forEach(this.currentClassList, function(inClassName) {
            var ctor = dojo.getObject(inClassName);
            if (ctor.prototype.themeableProps && dojo.indexOf(ctor.prototype.themeableProps,inPropName) != -1) {

                studio.application.loadThemePrototypeForClass(ctor); // make sure the prototype is loaded before we start editting it
                ctor.prototype[inPropName] = inDataValue;
                this.themePrototype[inClassName][inPropName] = inDataValue;
            }
        }, this);
        this.regenerateDemoPanel();
        this.onPrototypeChange();
    },
    onPrototypeChange: function() {
        studio._themeDesignerChange = true;
        studio._reflowPageDesigner = true;
    },
    /* END SECTION: Edit the selected widget prototype */


    /* START SECTION: Saving */
    saveThemeClick: function() {
        if (this.cssLayer.isActive() && this.editArea.isDirty) {
            this.widgetCssFiles[this.currentWidgetTemplateFile]= this.editArea.getDataValue();
        }       
        var files = this._templateFilesToWrite = [];
        wm.forEachProperty(this.widgetCssFiles, function(inValue, inName) {
            files.push({fileName: inName, cssText: inValue});
        });
        studio.beginWait("Saving...");
        studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/themedesigner.css", this.cssText]).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/theme.css", this.optimizeCss(this.cssText)]);
            })
        ).then(
            dojo.hitch(this, function() {
                return studio.resourceManagerService.requestAsync("writeFile", ["/common/themes/" + this.currentThemeName + "/Theme.js", dojo.toJson(this.themePrototype, true)]);
            })
        ).then(
            dojo.hitch(this, "writeMobileCss")
        ).then(dojo.hitch(this, "writeTemplateFiles"));
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
                    debugger;
                    rule = rule.substring(0,startOfRuleSegment-1);
                } else {
                    rule = rule.substring(0,startOfRuleSegment-1) + rule.substring(endIndex);                        
                }
            }
            braceBlocks[i].rule = rule;
        }
            debugger;                
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
    	// strip out comments
    	inText = inText.replace(/\/\*(.|\n|\r)*?\*\//gm,"")

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

    /* START SECTION: Managing the Demo Panel */
    onShow: function() {
        this.demoPanelWithAppRoot.owner = studio.application;
    },
    onHide: function() {
        this.demoPanelWithAppRoot.owner = this;
    },
    regenerateDemoPanel: function() {
        studio.beginWait("Loading...");
        wm.onidle(this, function() {
            this.demoPanelWithAppRoot.removeAllControls();
            this.demoPanel = this.demoPanelWithAppRoot.createComponents({
                demoPanel:  ["wm.Panel", {_classes: {domNode: ["wmpagecontainer"]}, layoutKind: "top-to-bottom", height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {}]
            })[0];

            wm.forEachProperty(this.themePrototype["wm.AppRoot"], dojo.hitch(this, function(inValue, inName) {
                this.demoPanel.setValue(inName, inValue);
            }));               
            this.demoPanel.createComponents(this.sampleWidgets);
            
            /* Custom hacks needed to get the sample widgets to work */
            switch(this.widgetGrid.selectedItem.getValue("templateFile")) {
                case "grid":
                    this.demoPanel.c$[0].setDataSet(this.sampleDataSet);
                    this.demoPanel.c$[1].setDataSet(this.sampleDataSet);                
                    this.demoPanel.c$[2].setDataSet(this.sampleDataSet);                                
                    break;
            }
            
            this.demoPanelWithAppRoot.reflow();
            studio.endWait();
        });
    },
    /* END SECTION: Managing the Demo Panel */


    /* START SECTION: Studio Integration Methods */
    setDirty: function(dirty) {
        this.isDirty = dirty;
        wm.job("WidgetThemerPage.setDirty", 10, this, function() {
            var layer = this.owner.parent;
            if (dojo.hasClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon")) {
                if (!dirty) {
                dojo.removeClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
                studio.updateServicesDirtyTabIndicators();
                }
            } else if (dirty) {
                dojo.addClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
                studio.updateServicesDirtyTabIndicators();
            }
        });
    },
    getDirty: function() {
        return this.isDirty;
    },
    /* END SECTION: Studio Integration Methods */

    _end: 0
});