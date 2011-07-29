/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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


{
    ALERT_OLD_IE_BAD: "<p>WaveMaker applications can run on IE6 or above.</p><p>However, WaveMaker Studio requires Chrome, FireFox or IE8.</p><p>Note: if you are running WaveMaker studio in IE8, you must turn off compatibility mode.</p>",
    TOOLTIP_SECURITY_ERROR: "A security error shown here has no effect on the project you are designing.  It does indicate that we are unable to show your data within the designer.  You can typically fix this problem by running your application, logging in to your application, and then the data should show up in the designer",

    /* Documentation; Help Menu */
    URL_TUTORIALS: "http://dev.wavemaker.com/wiki/bin/wmdoc_6.3/Tutorials",
    URL_DOCS: "http://dev.wavemaker.com/wiki/bin/wmdoc_6.3/",
    URL_PROPDOCS: "http://dev.wavemaker.com/wiki/bin/wmjsref_6.3/",
    URL_FORUMS: "http://dev.wavemaker.com/forums",
    "MENU_ITEM_TUTORIALS" : "Tutorials",
    "MENU_ITEM_DOCS" : "Documentation",
    "MENU_ITEM_COMMUNITY" : "Forums",
    "MENU_ITEM_PROPDOCS" : "JavaScript (Client) Docs",


    TOAST_RUN_FAILED: 'Run failed: ${error}',
    ALERT_NEW_WIDGET_NEEDS_CONTAINER: "No available container for the new widget.  All containers are either locked or frozen.",

    /* Shortcuts dialog */
    SHORTCUTS_HEADER: "Most common shortcuts",
    SHORTCUTS_W: "Toggle width between 100% and 100px (not supported for chrome in windows)",
    SHORTCUTS_H: "Toggle height between 100% and 100px",
    SHORTCUTS_M: "Toggle between model and palette",
    SHORTCUTS_S: "Save project",
    SHORTCUTS_R: "Run project",
    SHORTCUTS_ESC_1: "If dialog is open: Close the dialog",
    SHORTCUTS_ESC_2: "If no dialog: Select the parent of the selected widget",
    SHORTCUTS_DEL: "Delete selected component (unless a text field/property field is selected for editting in which case it edits the text field)",
    SHORTCUTS_HEADER_2: "Additional shortcuts",
    SHORTCUTS_O: "Toggle horizontal alignment of widgets in container",
    SHORTCUTS_E: "Toggle vertical alignment of widgets in container",
    SHORTCUTS_B: "Toggle layoutKind between left-to-right and top-to-bottom",
    SHORTCUTS_Z: "Undo",


    /* Generate documentation */
    GENERATE_DOCUMENTATION_HEADER: "<i>Note: this page is for reviewing documentation; to edit documentation you must go to the component in the model and select its documentation property</i>",
    GENERATE_DOCUMENTATION_NODOCS: "No Documentation",
    GENERATE_DOCUMENTATION_NONVISUAL_HEADER: "Page ${pageName} Non-Visual Components</h2>",
    GENERATE_DOCUMENTATION_VISUAL_HEADER: "Page ${pageName} Visual Components</h2>",
    "wm.Component.DOCUMENTATION_DIALOG_TITLE": "Document ${name}",
    "wm.Component.GENERATE_DOCUMENTATION_TOPNOTE": "Generated Documentation",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HEADER": "<h4>${eventName}</h4>\n executes ",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_TYPE": "<b>Type:</b>: ${componentType}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_OPERATION": "<b>Operation:</b>: ${operation}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_FUNCTION": "${functionName} (Function)",
    "wm.Component.GENERATE_DOCUMENTATION_NO_EVENT_HANDLER": "No event handlers",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_SECTION": "<h4>Event Handlers</h4><div style='margin-left:15px;'>${eventHtml}</div>",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HANDLERS_HEADER": "<h4>The following object event handlers activate this component</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${eventHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING": "<li><b>${property}</b> is bound to <i>${source}</i></li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_NO_BINDING": "No bindings",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING_SECTION": "<h4>This object has the following bindings</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindingHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO": "<li><b>${targetComponent}.${targetProperty}</b> is bound to <i>${source}</i></li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO_SECTION": "<h4>The following objects are bound to this</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindHtml}</ul>",

    "wm.DojoFlashFileUpload.CAPTION_UPLOAD": "Upload",
    "wm.DojoFlashFileUpload.CAPTION_SELECT": "Select Files...",



    JSON_PENDING: "Pending Request: ${name}",
    CONFIRM_LOGOUT: 'Are you sure you want to logout? Unsaved changes will be lost.', /* Cloud version only */
    CONFIRM_OPEN_PAGE_LOSE_UNSAVED : "Are you sure you want to open page ${newPage}? Unsaved changes to ${oldPage} will be lost.",
    CONFIRM_CLOSE_PROJECT_LOSE_UNSAVED : "Are you sure you want to close project \"${projectName}\"? Unsaved changes will be lost.",
    WAIT_OPENING_PAGE: "Opening page: ${pageName}",



    "LAYER_NAME_IDE" : "Source",
    "ALERT_UNSAVED_LOST" : "Please note that any unpublished changes will be lost.",
    "ALERT_NO_UNSAVED" : "Please note, there are no unsaved changes.",

    /* wm.DataModel */
    "wm.DataModel.WAIT_ADDING": "Adding ${dataModel}",
    "wm.DataModel.IMPORT_DATABASE_TITLE": "New Data Model",
    "wm.DataModel.TOAST_IMPORT_SUCCESS": "New Data Model ${dataModel} has been imported",
    "wm.DataModel.ENTER_NAME": "Enter your data model name",
    "wm.DataModel.ORACLE_JAR_INSTRUCTIONS": "<p>To use Oracle databases, you'll need to download and install ojdbc14.jar</p><p>Go to <a target='_New' href='http://www.oracle.com/technetwork/database/enterprise-edition/jdbc-10201-088211.html'>Oracle</a> and download ojdbc14.jar (or whatever the latest version number is).</p><p>Hit the \"Next\" button below when finished.</p>",
    "wm.DataModel.DB2_JAR_INSTRUCTIONS":  "<p>To use DB2 databases, you'll need to download and install db2jcc.jar</p><p>Go to <a target='_New' href='https://www14.software.ibm.com/webapp/iwm/web/reg/pick.do?source=swg-idsjs11'>IBM</a> and download their driver.</p><p>Open the zip file and find db2jcc.jar (you can ignore the file named db2jcc4.jar)</p><p>Hit the \"Next\" button below when finished.</p>",

    /* wm.JavaService */
    "wm.JavaService.WAIT_INITIALIZING": "Initializing Java Service ${serviceId}",
    "wm.JavaService.CREATE_SERVICE_TITLE": "New Java Service",
    "wm.JavaService.CREATE_SERVICE_OK": "OK",
    "wm.JavaService.CREATE_SERVICE_CANCEL": "Cancel",
    "wm.JavaService.WAIT_CREATING_SERVICE": "Creating service",
    "wm.JavaService.TOAST_SUCCESS_CREATING_SERVICE": "Created java service ${serviceId}",
    "wm.JavaService.TOAST_ERROR_CREATING_SERVICE": "Failed to Create java service ${serviceId}",

    /* wm.WebService */
    "wm.WebService.IMPORT_TITLE": "Import Web Service",
    "wm.WebService.JAR_INSTRUCTIONS": "<p>To use web services, you'll need to download and install wsdl4j.jar</p><p>Go to <a target='_New' href='http://sourceforge.net/projects/wsdl4j/'>SourceForge</a> and download wsdl4j-bin-1.6.2.</p><p>Open the zip file and find wsdl4j.jar within the lib folder.  When you find it, hit this dialog's \"Next\" button.",

    /* wm.LiveVariable */
    "wm.LiveVariable.ALERT_INVALID_SORT_ORDER": "Each property used in the orderBy clause must be of the form asc|desc: &lt;propertyPath&gt;. \"${order}\" does not match this format. The current orderBy clause will generate an error and should be corrected.",

    /* wm.Page/PageLoader */
    "wm.Page.WIDGETS_MISSING": "Page ${pageName} has errors",
    "wm.PageLoader.JS_NOT_LOADED": "Page ${inName}.js had errors",

    /* wm.PageContainer */
    "wm.PageContainer.OPEN_PAGE": "Open Page",
    "wm.PageContainer.NEW_PAGE": "New Page",
    "wm.PageContainer.NEW_PAGE_OPTION": "-New Page",
    "wm.PageContainer.CONFIRM_SAVE_CHANGES": "In order to set a new page for your container, we must save your project. Save and procede?",

    /* wm.Property/Composite/Publisher */
    "wm.Property.SELECT_PROPERTY": "Select Property to publish as <b>${propertyName}</b>",

    /* wm.PopupMenuButton, wm.DojoMenu */
    "wm.PopupMenuButton.MENU_DESIGNER_TITLE":"Edit Menu",
    "wm.DojoMenu.MENU_DESIGNER_TITLE": "Edit Menu",
    "wm.PopupMenu.DEFAULT_STRUCTURE": 
        '[{label: "File",	children: [{label: "Save"},{label: "Close"}]},' +
	'{label: "Edit",	children: [{label: "Cut"}, {label: "Copy"},{label: "Paste"}]},' +
        '{label: "Help"}]',

    /* wm.ContextMenuDialog */
    "wm.ContextMenuDialog.DELETE_LABEL": 'Delete', 
    "wm.ContextMenuDialog.SHOW_MORE": 'Show Advanced Properties >>',
    "wm.ContextMenuDialog.SHOW_LESS": '<< Hide Advanced Properties',

    /* wm.Dashboard */
    "wm.Dashboard.CONTEXT_MENU_TITLE": "Configure Portlets",
    "wm.Dashboard.CONFIG_DIALOG_OPEN_FIELD": "Default",
    "wm.Dashboard.CONFIG_DIALOG_TITLE_FIELD": "Title",
    "wm.Dashboard.CONFIG_DIALOG_PAGE_FIELD": "Page",
    "wm.Dashboard.CONFIG_DIALOG_CLOSE_FIELD": "Closable",

    /* wm.ListViewer */
    "wm.ListViewer.NO_DATASET": "Please select a dataSet before creating a new page",
    "wm.ListViewer.CONFIRM_SAVE_CHANGES": "Can we save this page before moving on to the next page?", 

     /* wm.DojoGrid */
    "wm.DojoGrid.HELP_TEXT": '* To re-arrange columns close dialog box and drag columns on grid to desired position.<br/>* You can right click on grid to open this dialog.',
    "wm.DojoGrid.CONFIG_ID": "Field",
    "wm.DojoGrid.CONFIG_TITLE": "Title",
    "wm.DojoGrid.CONFIG_WIDTH": "Width",
    "wm.DojoGrid.CONFIG_ALIGN": "Alignment",
    "wm.DojoGrid.CONFIG_FORMAT": "Format",
    "wm.DojoGrid.CONFIG_TYPE": "Edit Field Type",
    "wm.DojoGrid.CONFIG_EXPR": "Data Expression",
    "wm.DojoGrid.ADD_COLUMN_LABEL": "Add Column",
    "wm.DojoGrid.EDIT_COLUMNS_DIALOG_TITLE": "DojoGrid Column Properties",
    "wm.DojoGrid.ADD_FORMATTER": '- Add Formatter',
    "wm.DojoGrid.COLUMN_ALIGN_RIGHT": "Right",
    "wm.DojoGrid.COLUMN_ALIGN_LEFT": "Left",
    "wm.DojoGrid.COLUMN_ALIGN_CENTER": "Center",


    /* Studio Service Tabs */
    "wm.LiveView.TAB_CAPTION": "Live View",
    "wm.Security.TAB_CAPTION": "Security",
    "wm.Query.TAB_CAPTION": "Query",
    "wm.DataModel.TAB_CAPTION": "Data Model",

    
    /* LivePanel, LiveForm, EditPanel, RelatedEditor */
    "wm.RelatedEditor.BAD_EDIT_MODE": "For this editor to be editable, its parent editor must have an editingMode of editable.",
    "wm.RelatedEditor.LOOKUP_CAPTION": "${fieldName} (lookup)",
    "wm.LivePanel.CHOOSER_TITLE": "Pick LivePanel Layout",
    "wm.LivePanel.DETAILS_PANEL_TITLE": "Details",
    "wm.LivePanel.WAIT_GENERATING": "Generating...",
    "wm.LiveForm.GENERATE_BUTTONS_TITLE": "Generate Form Buttons",
    "wm.LiveForm.GENERATE_BUTTONS_PROMPT": "What kind of buttons do you want? EditPanel manages the buttons for you; basic buttons gives you a starting point for creating your own button panel",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION1": "Edit Panel",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION2": "Basic Buttons",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION3": "Cancel",
    "wm.LiveForm.GENERATE_BUTTONS_SAVE": "Save",
    "wm.LiveForm.GENERATE_BUTTONS_CANCEL": "Cancel",
    "wm.LiveForm.GENERATE_BUTTONS_NEW": "New",
    "wm.LiveForm.GENERATE_BUTTONS_UPDATE": "Update",
    "wm.LiveForm.GENERATE_BUTTONS_DELETE": "Delete",
    "wm.LiveForm.WAIT_ADD_EDITORS": "Adding Editors for ${widgetName}",
    "wm.LiveForm.SET_NAME_CONFIRM": "Customizations you have made to your EditPanel will be lost if you change the name.  Procede?",
    "wm.LiveForm.CONFIRM_REMOVE_EDITORS": "Are you sure? All editors in ${name} will be deleted.",
    "wm.EditPanel.REMOVE_CONTROLS_CONFIRM": "Are you sure? All widgets in ${name} will be deleted.",
    "wm.EditPanel.SAVE_CAPTION": "Save",
    "wm.EditPanel.CANCEL_CAPTION": "Cancel",
    "wm.EditPanel.NEW_CAPTION": "New",
    "wm.EditPanel.UPDATE_CAPTION": "Update",
    "wm.EditPanel.DELETE_CAPTION": "Delete",


    "wm.EditArea.ENTER_LINE_NUMBER": "Enter line number"    ,

    /* Editors */
    "wm.ResizeableEditor.SET_MAX_HEIGHT": "Your maxHeight must be larger than ${minHeight}",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_BOOLEAN": "You have changed your dataType to Boolean; your checkedValue should be updated to be true/false",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_NUMBER": "You have changed your dataType to Number; your checkedValue should be updated to be a number",

    /* Context Menus */
    "wm.Component.CONTEXT_MENU_LAYERS": "${parentName} Layers",
    "wm.Component.CONTEXT_MENU_HELP": "${className} docs...",
    "wm.Component.CLASS_NOT_FOUND": 'Component type "${type}" is not available.',
    "wm.Palette.MENU_ITEM_COPY": "Copy New ${className}",
    "wm.Palette.MENU_ITEM_DOCS": "${className} docs...",
    "wm.Palette.URL_CLASS_DOCS": "http://dev.wavemaker.com/wiki/bin/wmjsref_6.3/${className}",
    "wm.Palette.TIP_DOCS": "Click for docs",

    /* action.js/clipboard.js: undo/redo */
    "UNDO_MOUSEOVER_HINT": "Undo ${hint}",
    "UNDO_DELETE_HINT": "Delete ${className}",
    "UNDO_DROP_HINT": "Drop ${className}",
    "UNDO_ADD_HINT": "Add ${className}",
    "UNDO_PROP_HINT": "Property ${propName}; return to \"${oldValue}\"",

    "ALERT_PASTE_FAILED_PANEL_LOCKED": "Unable to paste.  All containers are either locked or frozen."    ,
    "CONFIRM_GENERIC_DISCARD_UNSAVED": 'Discard unsaved changes?',

    
    WAIT_BUILDING_WAR: "Building WAR file. It may take several minutes. Please wait.",
    ALERT_LIVE_LAYOUT_SECURITY_WARNING: "In order for Live Layout to work, project security needs to be disabled.<br/>Please uncheck the 'Enable Security' check box in the Security Editor to disable security.<br/>To disable Live Layout, launch Studio in 'nolive' mode.",
    ALERT_BUILDING_ZIP_SUCCESS: "Successfully exported project to zip file at <ul><li>${inResponse}</li></ul>To import this project unzip it into the projects directory of another studio.",
    ALERT_BUILDING_ZIP_FAILED: "Error occurred while building ZIP FILE!<br/>${error}",
    ALERT_BUILDING_WAR_SUCCESS: "Successfully generated WAR file: <ul><li>${inResponse}</li></ul>",
    ALERT_BUILDING_WAR_FAILED: "Error occurred while building WAR FILE!<br/>${error}",
    TITLE_IMPORT_PROJECT: "Import Project",
    TITLE_CREATE_LIVE_VIEW: "New LiveView",
    //TOAST_IMPORT_PROJECT: "Successfully imported project ${inResponse}",
    //ALERT_IMPORT_PROJECT_FAILED: "Error occurred while importing project!\n${error}",
    MENU_REDEPLOY: "Redeploy to ${deploymentName}...",
    ALERT_DEPLOY_SUCCESS: "Deployment successful.",
    ALERT_DEPLOY_FAILED: "Deployment error: <ul><li>${error}</li></ul>",
    ALERT_UNDEPLOY_COMPONENT_SUCCESS: "Undeployment successful.",
    ALERT_UNDEPLOY_COMPONENT_FAILED: "Component not found",
    ALERT_UNDEPLOY_COMPONENT_FAILED2: "Undeployment error: ${inError}",
    TOAST_CODE_VALIDATION_SUCCESS: "No errors found",
    TITLE_CODE_VALIDATION_DIALOG: "Compiler Results",
    TITLE_IMPORT_JAVASCRIPT: "Script Importer",
    TITLE_IMPORT_CSS: "CSS Importer",

    /* Auto Completion */
    AUTOCOMPLETE_ALERT_SELECT_TEXT: "Please select text, such as 'this.button1', or 'button1', and if your page has a button1 in it, we will list suitable methods you can call on that object",
    AUTOCOMPLETE_ALERT_NOT_FOUND: "\"${text}\" not found. Please select text, such as 'this.button1', or 'button1', and if your page has a button1 in it, we will list suitable methods you can call on that object",
    AUTOCOMPLETION_LABEL_PAGE_COMPONENTS: "Page Components",
    AUTOCOMPLETION_LABEL_TYPE_NUMBER: "Number",
    AUTOCOMPLETION_LABEL_TYPE_BOOLEAN: "Boolean",
    AUTOCOMPLETION_LABEL_TYPE_STRING: "String",
    AUTOCOMPLETION_TITLE_DIALOG: "Completions",
    AUTOCOMPLETION_LABEL_PROPERTIES_METHODS: "Properties/Methods",
    AUTOCOMPLETION_LABEL_NAME: "<b>Name:</b><br/>&nbsp;&nbsp;&nbsp;${name}",
    AUTOCOMPLETION_LABEL_TYPE: "<b>Type:</b><br/>&nbsp;&nbsp;&nbsp;${type}",
    AUTOCOMPLETION_LABEL_PARAMS: "<b>Parameters:</b><br/>&nbsp;&nbsp;&nbsp;${params}",
    AUTOCOMPLETION_LABEL_RETURN: "<b>Returns:</b><br/>&nbsp;&nbsp;&nbsp;${returns}",
    AUTOCOMPLETION_TYPE_NOT_SUPPORTED: "We do not provide information on this kind of object",
    AUTOCOMPLETION_HTML: "Select a term to see description; double click to add it to your code",
    AUTOCOMPLETION_LABEL_DESCRIPTION: "Description",

    /* Event Editor */
    "wm.EventEditor.NO_EVENTS": " - No Event",
    "wm.EventEditor.NEW_JAVASCRIPT": " - Javascript...",
    "wm.EventEditor.NEW_JAVASCRIPT_SHARED": " - Javascript Shared...",
    "wm.EventEditor.NEW_SERVICE": " - New Service...",
    "wm.EventEditor.NEW_LIVEVAR": " - New LiveVariable...",
    "wm.EventEditor.NEW_NAVIGATION": " - New Navigation...",
    "wm.EventEditor.LIST_NAVIGATION": "Navigations:",
    "wm.EventEditor.LIST_SERVICE": "Service Variables:",
    "wm.EventEditor.LIST_SHARED_JAVASCRIPT": "Service Event Handlers:",
    "wm.EventEditor.LIST_DIALOGS": "Dialogs:",
    "wm.EventEditor.LIST_LAYERS": "Layers:",
    "wm.EventEditor.LIST_DASHBOARDS": "Dashboard Add Widget:",
    "wm.EventEditor.LIST_TIMERS": "TIMERS:",

    /* Inspectors */
    "wm.DataInspector.TOAST_EXPRESSION_FAILED": "This value failed to compile; please try again.  Most common problem: lack of quotes",    
    "wm.ComponentInpsectorPanel.PROPERTY_NODE_CAPTION": "Properties",
    "wm.ComponentInpsectorPanel.EVENT_NODE_CAPTION": "Events",
    "wm.ComponentInpsectorPanel.CUSTOMMETHOD_NODE_CAPTION": "Custom Methods",
    "wm.Inspector.PROPERTIES_HEADER_CAPTION": "Properties",    
    "wm.Inspector.VALUES_HEADER_CAPTION": "Value",    
    "wm.StyleInspector.BASIC_STYLE_LAYER_CAPTION": "Basic",
    "wm.StyleInspector.CLASSES_LAYER_CAPTION": "Classes",
    "wm.StyleInspector.CUSTOM_LAYER_CAPTION": "Custom Styles",
    "wm.StyleInspector.CUSTOM_CLASS_CAPTION": "Custom",
    "wm.StyleInspector.CUSTOM_BUTTON_CAPTION": "Apply",

    /* Model/Services */
    "MODELTREE_NODE_PAGE_HEADING": "Page (${className})",
    "MODELTREE_NODE_PROJECT_HEADING": "Project (${projectName})",
    "MODELTREE_CONTEXTMENU_NEW": "New ${className}",
    "MODELTREE_CONTEXTMENU_DOC": "docs...",

    "POPUP_BLOCKER_TITLE": "Popup Blocker",
    "POPUP_BLOCKER_MESSAGE": "Popup Blocker Detected, run application using Manual Launch link",
    "POPUP_BLOCKER_LAUNCH_CAPTION": "Manual Launch",
    "wm.studio.Project.TOAST_RESERVED_NAME": "That is a reserved javascript name",
    "wm.studio.Project.WAIT_CREATING_PROJECT": "Setting up new project",
    "wm.studio.Project.WAIT_OPEN_PROJECT": "Opening...",
    "wm.studio.Project.TOAST_OPEN_PROJECT_FAILED": "Failed to open project ${projectName}: ${error}",

    /* These next two seem to indicate the same thing, but come up from different types of errors */
    "wm.studio.Project.TOAST_OPEN_PAGE_FAILED": "Failed to open page ${pageName}: ${error}",
    "wm.studio.Project.THROW_INVALID_PAGE": "Invalid Page",

    "wm.studio.Project.WAIT_COPY_PROJECT": "Copying...",
    "wm.studio.Project.TOAST_COPY_PROJECT_SUCCESS": "${oldName} saved as ${newName}; you are still editting ${oldName}",
    "wm.studio.Project.ALERT_DELETE_PAGE_FAILED": "Page ${pageName} could not be deleted: ${error}",
    "CONFIRM_CLOSE_PROJECT": "Are you sure you want to close project ${projectName}? Unsaved changes will be lost.",
    WAIT_CREATING_PAGE: "Creating page: ${pageName}",
    CONFIRM_NEW_PAGE: "Are you sure you want to add a new page? Unsaved changes to ${pageName} will be lost.",
    ALERT_UPGRADE_HEADING: "\n\nImportant messages regarding your upgrade:\n",
    ALERT_BACKUP_OLD_PROJECT: "Your project has been upgraded.  A backup of your old project is available at:${filePath}\n",
    THROW_PROJECT_NOT_FOUND: "Warning: Could not find ${projectPath}",
    SAVE_DIALOG_START_LABEL: "Starting save...",
    SAVE_DIALOG_UPDATE_MESSAGE: "Saving ${componentName}",
    "SAVE_DIALOG_ERROR_REPORT_PROJECT_FILES": "Project Files",
    "TOAST_SAVE_PROJECT_SUCCESS": "Project Saved",
    "IMPORT_RESOURCE_BUTTON_CAPTION": "Import",
    "TITLE_BIND_DIALOG": "Binding...",
    "WAIT_PROJECT_CLOSING": "Closing...",
    "WAIT_PROJECT_DELETING": "Deleting...",
    "RUN_BUTTON_CAPTION": "Run",
    "TEST_BUTTON_CAPTION": "Run",
    "RUN_BUTTON_CAPTION": "Run",
    "WAIT_SAVE_PAGE_AS": "Saving page as ${pageName}",
    "CONFIRM_DELETE_PROJECT": "Are you sure you want to delete ${projectName}?",
    "CONFIRM_DELETE_PAGE": "Are you sure you want to delete ${pageName}?",
    "ALERT_CANT_DELETE_HOME_PAGE": "${pageName} is the project home page. You cannot delete the home page.",
    "PROMPT_TARGET_NAME": "Enter a new ${target} name: ",
    "TOAST_TARGET_EXISTS": "The ${target} named \"${pageName}\" already exists. Please choose a different name.",
    "TOAST_INVALID_TARGET_NAME": "The name \"${name}\" is not valid. Names can contain only letters, numbers, underscores, must not begin with a number, and must not be a javascript reserved word.",
    "WAIT_BUILD_PREVIEW": "Building Preview...",
    "CONFIRM_UNSAVEDTAB_HEADER": "You have unsaved changes:",
    "CONFIRM_UNSAVEDTAB_CLOSEANYWAY": "Close anyway?",
    "CONFIRM_REFRESH_SCRIPT": "Are you sure you want to reload this file file from disk ? Unsaved changes will be lost",
    "TITLE_PREFERENCES": "WaveMaker Preferences",


    "DATA_UTILS_DATABASE": "Database",
    "DATA_UTILS_FILE": "File",
    "DATA_UTILS_DATABASE_HELP": "Enter the name of the database on your database server",
    "DATA_UTILS_FILE_HELP": "Enter the name of the file in your project's webapproot/data folder. If the name is hrdb.script, just enter hrdb.",
}
