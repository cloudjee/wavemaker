/*
 * Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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


dojo.provide("wm.studio.pages.ImportCloudFoundryDatabase.ImportCloudFoundryDatabase");

dojo.declare("ImportCloudFoundryDatabase", wm.Page, {

    i18n: true,

    start: function() {
        this.update();
    },

    onShow: function() {
        this.update();
    },

    update: function(inImportDataModel) {
        this.cloudFoundryService.requestAsync("listDatabaseServices", ["", ""], dojo.hitch(this, function(inResult) {
            this.populateCloudFoundryAppList(inResult);
        }), dojo.hitch(this, function(inError) {
            app.alert(inError);
        }));
    },
    cancelBtnClick: function(inSender) {
        this.owner.owner.hide();
    },
    populateCloudFoundryAppList: function(inResult) {
        this.serviceListVar.setData(inResult);
    },
    selectedServiceChange: function(inSender) {
        var serviceName = this._serviceName = this.serviceList.selectedItem.getValue("name");
        var type = this.serviceList.selectedItem.getValue("vendor");
        this.packageInput.setDataValue(DEFAULT_PACKAGE_ROOT + serviceName);
        setupWidgetsForDatabaseType(type, "", this.dumpEditor, this.dumpEditor, this.dumpEditor, this.dumpEditor, this.tablePatternInput, this.schemaPatternInput, this.dumpEditor, this.dumpEditor, this.dumpEditor, this.dumpEditor);
    },
    importBtnClick: function(inSender) {
        this.dataModelName = null;
        var serviceName = this.serviceList.selectedItem.getValue("name");
        var type =  this.serviceList.selectedItem.getValue("vendor");

        studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING"));
        this.cloudFoundryService.requestAsync("isServiceBound", ["", "", serviceName, ""],
                        dojo.hitch(this, function(isBound) {
                        if (isBound) {
                            this.doImport(serviceName, type);
                        } else {
                            this.doBind(serviceName, type);
                        }
                        }),
                        function(inError) {
                        app.alert(inError.toString());
                        studio.endWait();
                        }
                       );
    },
    doBind: function(serviceName, type) {
        studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_BINDING"));
        // this will restart the studio server
        this.cloudFoundryService.requestAsync("bindService", ["", "", serviceName, ""], dojo.hitch(this, function() {
            this.waitForStudioToRestart(serviceName, type);
        }), function(inError) {
            app.alert(inError);
            studio.endWait();
        });
    },

	importSampleBtnClick: function(inSender) {
		studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING"));
		if(wm.services.byName["hrdb"] !== undefined){
			studio.endWait();
			app.toastInfo(this.getDictionaryItem("INFO_SAMPLE_ALREADY_IMPORTED"));
			this._close("Import");
		}
		else{
			this._serviceName = "hrdb";
			studio.dataService.requestAsync("importSampleDatabase",
					[],
					dojo.hitch(this, "_importResult"),
					function(inError) {
						app.alert(inError.toString());
						studio.endWait();
					});
		}
	},

    waitForStudioToRestart: function(serviceName, type) {
        studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_BINDING_RESTART1"));
        window.setTimeout(dojo.hitch(this, function() {
            this.waitForStudioToRestart2(serviceName, type);
        }), 5000);
    },

    waitForStudioToRestart2: function(serviceName, type) {
        studio.studioService.requestAsync("getOpenProject", [], dojo.hitch(this, function(inResult) {
            // if a project is still open, the server hasn't yet restarted
            this.waitForStudioToRestart(serviceName, type);
        }), dojo.hitch(this, function(inError) {
            // server has restarted, and is now responding
            if (inError.message.match(/No open project/i)) {
                this.waitForStudioToRestart3(serviceName, type);
            } else {
                // threw an error, the server has definitely restarted, but isn't yet online
                studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_BINDING_RESTART2"));
                this.waitForStudioToRestart(serviceName, type);
            }
        }));
    },

    waitForStudioToRestart3: function(serviceName, type) {
        studio.studioService.requestAsync("openProject", [studio.project.projectName], dojo.hitch(this, function() {
            this.doImport(serviceName, type);
        }));
    },

    doImport: function(serviceName, type) {
        studio.beginWait(this.getDictionaryItem("WAIT_IMPORTING_GENERATING"));
        studio.dataService.requestAsync("cfImportDatabase", [serviceName,
                                                            this.packageInput.getDataValue(),
                                                            this.tablePatternInput.getDataValue(),
                                                            this.schemaPatternInput.getDataValue(),
                                                            "",
                                                            "",
                                                            this.revengNamingStrategyInput.getDataValue(),
                                                            false,
                                                            ""],
                                        dojo.hitch(this, "_importResult"), function(inError) {
            app.alert(inError.toString());
                studio.endWait();
            }
        );

    },

    _importResult: function() {
        studio.endWait();
        this.dataModelName = this._serviceName;
        studio.updateServices();
        studio.setLiveLayoutReady(0); // force testRunStart on next live data call
        this.owner.owner.dismiss("Import");
    },
  _end: 0
});
