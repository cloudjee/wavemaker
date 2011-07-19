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

ImportDatabase.widgets = {
    layoutBox1: ["wm.Layout", {_classes: {domNode: ["wm-darksnazzy"]}, height: "100%", width: "100%"}, {}, {
	importDBDialogInner: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
	    panel1: ["wm.TabLayers", {height: "100%", padding: "10"}, {}, {
		panel2: ["wm.Layer", {caption: "Basic Options", layoutKind: "top-to-bottom", horizontalAlign: "center", verticalAlign: "middle"}, {}, {


		    dbdropdown: ["wm.SelectMenu", {captionAlign: "left", captionSize: "120px", caption: "Database System", width: "65%", helpText: "Choose what type of database server you are connecting to"}, {onchange: "importDBdropdownChanged"}],
		    hostInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Hostname", width: "65%", border: "0", emptyValue: "emptyString", helpText: "The network host for the database. The default value is localhost, meaning that the database is located on the same computer that WaveMaker studio is running on."}, {onchange: "importHostChanged", changeOnKey: true, onEnterKeyPress: "importBtnClick"}],
		    usernameInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Username", width: "65%", border: "0", emptyValue: "emptyString", helpText: "Enter the username for connecting to the database server"}, {onchange: "usernameChanged", changeOnKey: true, onEnterKeyPress: "importBtnClick"}],
		    passwordInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Password", width: "65%", border: "0", password:true, emptyValue: "emptyString", helpText: "Enter the password for connecting to the database server"}, {onEnterKey: "importBtnClick"}],
		    extraInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "extraInput1", width: "65%", border: "0", showing: false, emptyValue: "emptyString", helpText: "This is set in datautils.js"}, {changeOnKey: true, onchange: "importExtraChanged", onEnterKeyPress: "importBtnClick"}],
		    extra2Input: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Instance", width: "65%", border: "0", emptyValue: "emptyString", helpText: "Normally, this should be set to the value 'SQLExpress' if you are using SQL Server Express Edition."}, {onchange: "importExtra2Changed", changeOnKey: true, onEnterKeyPress: "importBtnClick"}],
		}],
		panel4: ["wm.Layer", {captionAlign: "left", captionSize: "120px", caption: "Advanced Options", horizontalAlign: "center", verticalAlign: "middle", layoutKind: "top-to-bottom", autoScroll: true}, {}, {

		    serviceNameInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Service Name", width: "65%", border: "0", emptyValue: "emptyString", helpText: "The service name is the name that is added to your service tree, and the name your ServiceVariables will use"}, {onchange: "serviceNameChanged", changeOnKey: true, onEnterKeyPress: "importBtnClick"}],
		    portInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Port", width: "65%", border: "0", emptyValue: "emptyString", helpText: "The port number for the database. Typically this is set automatically when the database type is selected and should not be changed."}, {onchange: "importPortChanged", changeOnKey: true, onEnterKey: "importBtnClick"}],
		    connectionUrlInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Connection URL", width: "65%", border: "0", emptyValue: "emptyString", helpText: "When you import a database using the standard configuration options on the Import Database screen, WaveMaker Studio creates a JDBC URL for you. This URL is shown here in the Connection URL field. If you know what you are doing and want to change this JDBC URL, you can do it here."}, {onEnterKeyPress: "importBtnClick"}],
		    packageInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Java Package", width: "65%", border: "0", emptyValue: "emptyString", helpText: "WaveMaker Studio generates Java classes for you when you import a database. If you want a different Java package name than the default name we generate, type it in here."}, {onEnterKeyPress: "importBtnClick"}],
		    tablePatternInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Table Filter", width: "65%", border: "0", emptyValue: "emptyString", helpText: "By default WaveMaker Studio imports all the tables in the database. If you want to import only a subset of the tables, type in a comma-delimited list of regular expressions here."}, {onEnterKeyPress: "importBtnClick"}],
		    schemaPatternInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Schema Filter", width: "65%", border: "0", emptyValue: "emptyString",helpText: "When you are importing a database that supports schemas, WaveMaker Studio imports only the tables for the default schema. If you want to import tables from other schemas, add the schema names in this field."}, {onEnterKeyPress: "importBtnClick"}],
		    driverClassInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Driver Class", width: "65%", border: "0", emptyValue: "emptyString", helpText: "JDBC driver class name. WaveMaker Studio creates a JAR file for each database that uses a specified driver. If you want to use a different JAR file for connecting, specify it here (the JAR file must be in the Application Server's class path)."}, {onEnterKeyPress: "importBtnClick"}],
		    dialectInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Dialect", width: "65%", border: "0", emptyValue: "emptyString", helpText:"Hibernate dialect.  Most users should leave this blank.  For more information go to http://docs.jboss.org/hibernate/core/3.3/reference/en/html/session-configuration.html#configuration-optional-dialects"}, {onEnterKeyPress: "importBtnClick"}],
		    revengNamingStrategyInput: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Naming Strategy", width: "65%", border: "0", emptyValue: "emptyString", helpText: "Most users should leave this blank.  Enter the name of a java class you created for handling the naming strategy."}, {onEnterKeyPress: "importBtnClick"}],
		    /* Do not localize the options property; any change to options requires change to ImportDatabase.js */
		    executeAsMenu: ["wm.SelectMenu", {captionAlign: "left", captionSize: "120px", caption: "Execute as", options: "Database credentials, Logged in user", dataValue: "Database credentials", width: "65%", helpText: "Typically your database connections will just use the username and password configured above.  If you need the connection to do an 'Execute As' and use the currently logged in user's credentials (i.e. the user who has logged into your deployed application), you can set that here."}, {onchange: "executeAsMenuChange"}],

		    activeDirectoryDomain: ["wm.Text", {captionAlign: "left", captionSize: "120px", caption: "Active Directory Domain", width: "65%", showing: false, disabled: true, emptyValue: "emptyString", helpText: "If specified, the Active Directory Domain name will be prefixed to the authenticated user's name when running the \"EXECUTE AS\" statement against the active DB connection."}]
		}],
	    }],
	    footer: ["wm.Panel", {height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		testConnectionBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Test Connection", width: "160px"}, {onclick: "testConnectionBtnClick"}],
		spacer1: ["wm.Spacer", {width: "10px"}, {}],
		importBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Import", width: "96px", hint: "Import Database"}, {onclick: "importBtnClick"}],
		spacer2: ["wm.Spacer", {width: "10px"}, {}],
		cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", width: "96px"}, {onclick: "cancelBtnClick"}]
	    }]

	}]
    }]
}