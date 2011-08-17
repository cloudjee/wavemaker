/*
 * Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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
 
DBConnectionSettings.widgets = {
    layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", border: "0",  width: "100%", autoScroll: false}, {}, {
		importDBDialog: ["wm.Panel", {border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
			importDBDialogInner: ["wm.Panel", {border: "0", height: "100%", width: "100%"}, {}, {
				titleBar: ["wm.Panel", {border: "0", height: "29px", layoutKind: "left-to-right"}, {}, {
					dialogLabel: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold", "wm_TextAlign_Center", "wm_Padding_4px", "wm_FontColor_White"]}, caption: "Database Connection Settings", width: "100%", height: "100%", border: "0"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				connectionSettingsPanel: ["wm.Panel", {padding: "10", border: "0", height: "100%", layoutKind: "left-to-right", width: "100%"}, {}, {
					panel1: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, padding: "5", height: "100%", width: "50%"}, {}, {
						dataModelList: ["wm.List", {_classes: {domNode: ["wm_Border_StyleSolid", "wm_Border_Size1px"]}, width: "100%", height: "100%"}, {onselect: "dataModelListSelect"}]
					}],
					panel2: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]}, padding: "5,50,5,50", border: "0", height: "100%", width: "100%"}, {}, {
					    conUserInput: ["wm.Text", {captionSize: "150px", caption: "Username", width: "100%", border: "0", changeOnKey:true, helpText: "Enter the username for connecting to the database server", required: true}, {onchange: "conUsernameChanged"}],
					    conPasswordInput: ["wm.Text", {captionSize: "150px", caption: "Password", password: true, width: "100%", border: "0", changeOnKey:true, helpText: "Enter the password for connecting to the database server", emptyValue: "emptyString"}, {onchange: "conPasswordChanged"}],
					    conDBdropdown: ["wm.SelectMenu", {captionSize: "150px", caption: "RDBMS", width: "100%", changeOnKey:true, helpText: "Choose what type of database server you are connecting to"}, {onchange: "conDBdropdownChanged"}, {}],
					    conHostInput: ["wm.Text", {captionSize: "150px", caption: "Hostname", width: "100%", border: "0", changeOnKey:true, helpText: "The network host for the database. The default value is localhost, meaning that the database is located on the same computer that WaveMaker studio is running on."}, {onchange: "conHostChanged"}],
					    conPortInput: ["wm.Text", {captionSize: "150px", caption: "Port", width: "100%", border: "0", changeOnKey:true, helpText: "The port number for the database. Typically this is set automatically when the database type is selected and should not be changed."}, {onchange: "conPortChanged"}],
					    conExtraInput: ["wm.Text", {captionSize: "150px", caption: "Caption set in datautils", width: "100%", border: "0", showing: false, changeOnKey:true, helpText: "Help set in datautils.js", required: true}, {onchange: "conExtraChanged"}],
					    conExtra2Input: ["wm.Text", {captionSize: "150px", caption: "Instance", width: "100%", border: "0", changeOnKey:true, helpText: "Normally, this should be set to the value 'SQLExpress' if you are using SQL Server Express Edition."}, {onchange: "conExtra2Changed"}],
					    conConnectionUrlInput: ["wm.Text", {captionSize: "150px", caption: "Connection URL", width: "100%", border: "0", dataValue: "jdbc:mysql://localhost:3306", changeOnKey:true, helpText: "When you import a database using the standard configuration options on the Import Database screen, WaveMaker Studio creates a JDBC URL for you. This URL is shown here in the Connection URL field. If you know what you are doing and want to change this JDBC URL, you can do it here."}, {onchange: "conConnectionUrlChanged"}],
					    conTablePatternInput: ["wm.Text", {captionSize: "150px", caption: "Table Filter", width: "100%", border: "0", emptyValue: "emptyString", changeOnKey:true, helpText: "By default WaveMaker Studio imports all the tables in the database. If you want to import only a subset of the tables, type in a comma-delimited list of regular expressions here."}, {onchange: "conTablePatternChanged"}],
					    conSchemaPatternInput: ["wm.Text", {captionSize: "150px", caption: "Schema Filter", width: "100%", border: "0", emptyValue: "emptyString", changeOnKey:true, helpText: "When you are importing a database that supports schemas, WaveMaker Studio imports only the tables for the default schema. If you want to import tables from other schemas, add the schema names in this field."}, {onchange: "conSchemaPatternChanged"}],
					    conDriverClassInput: ["wm.Text", {captionSize: "150px", caption: "Driver Class", width: "100%", border: "0", changeOnKey:true, helpText: "JDBC driver class name. WaveMaker Studio creates a JAR file for each database that uses a specified driver. If you want to use a different JAR file for connecting, specify it here (the JAR file must be in the Application Server's class path)."}, {onchange: "conDriverClassChanged"}],
					    conDialectInput: ["wm.Text", {captionSize: "150px", caption: "Dialect", width: "100%", border: "0", changeOnKey:true,helpText:"Hibernate dialect.  Most users should leave this blank.  For more information go to http://docs.jboss.org/hibernate/core/3.3/reference/en/html/session-configuration.html#configuration-optional-dialects"}, {onchange: "conDialectChanged"}],
					    conRevengNamingStrategyInput: ["wm.Text", {captionSize: "150px", caption: "Reverse Naming Strategy", width: "100%", border: "0", emptyValue: "emptyString", changeOnKey:true, helpText: "Most users should leave this blank.  Enter the name of a java class you created for handling the naming strategy."}, {onchange: "conRevengChanged"}],
		    /* Do not localize the options property; any change to options requires change to ImportDatabase.js */
					    executeAsMenu: ["wm.SelectMenu", { captionSize: "150px", caption: "Execute as", options: "Database credentials, Logged in user", dataValue: "Database credentials", width: "100%", helpText: "Typically your database connections will just use the username and password configured above.  If you need the connection to do an 'Execute As' and use the currently logged in user's credentials (i.e. the user who has logged into your deployed application), you can set that here."}, {onchange: "executeAsMenuChange"}],
					    activeDirectoryDomain: ["wm.Text", {captionSize: "150px", caption: "Active Directory Domain", width: "100%", showing: false, disabled: true, emptyValue: "emptyString", helpText: "If specified, the Active Directory Domain name will be prefixed to the authenticated user's name when running the \"EXECUTE AS\" statement against the active DB connection."}],
					    overrideFlagInput: ["wm.Checkbox", {captionSize: "150px", caption: "Overwrite database", width: "100%", dataType: "boolean", displayValue: true, emptyValue: "false", helpText: "If you are using the \"Export\" button and this is checked, then the database already exists, all tables and data will be dropped and deleted. A new database will be created whether or not there is an existing database."}, {onchange: "overrideFlagInputChanged"}]
					}]
				}],
				footer: ["wm.Panel", {border: "0", height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
				    testConnectionBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Test Connection", autoSize: false, width: "130px", margin: "4"}, {onclick: "testConnectionBtnClick"}],
				    spacer1: ["wm.Spacer", {width: "10px", border: "0"}, {}],
				    saveBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Save", autoSize: false, width: "80px", margin: "4"}, {onclick: "saveBtnClick"}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {targetProperty: "disabled", source: "panel2.invalid"}]
					}]
				    }],
				    spacer2: ["wm.Spacer", {width: "10px", border: "0"}, {}],
				    reimportBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Re-Import", autoSize: false, width: "100px", margin: "4"}, {onclick: "reimportBtnClick"},{
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {targetProperty: "disabled", source: "panel2.invalid"}]
					}]
				    }],
				    spacer3: ["wm.Spacer", {width: "10px", border: "0"}, {}],
				    exportBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Export", autoSize: false, width: "80px", margin: "4"}, {onclick: "exportBtnClick"}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {targetProperty: "disabled", source: "panel2.invalid"}]
					}]
				    }],
				    spacer4: ["wm.Spacer", {width: "10px", border: "0"}, {}],
				    cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", autoSize: false, width: "80px", margin: "4"}, {onclick: "cancelBtnClick"}]
				}]
			}]
		}]
	}]

}