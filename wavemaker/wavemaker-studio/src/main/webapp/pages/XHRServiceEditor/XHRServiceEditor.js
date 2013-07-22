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


dojo.declare("XHRServiceEditor", wm.Page, {
    i18n: true,
    start: function() {
        this.reset();
    },
    reset: function() {
        var options = ["String", "Number", "Date", "Boolean"];
        var types = wm.typeManager.getPublicTypes();
        wm.forEachProperty(types, function(typeDef, typeName) {
            options.push(typeName);
        });
        this.inputsGrid.setColumnComboBoxOptions("type", options);
        this.pathInputsGrid.setColumnComboBoxOptions("type", options);
        this.headerInputsGrid.setColumnComboBoxOptions("type", options);
        this.serviceResponseType.setDataValue("New Type");
    },
    onShow: function() {
        if (this.owner.owner != studio)
            this.owner.owner.importButton.setDisabled(false);
    },
    setService: function(inService) {
        this.editService = inService;
        this.serviceName.setDataValue(inService.name);
        this.serviceUrl.setDataValue(inService.url);
        this.serviceContentType.setDataValue(inService.contentType);
        this.serviceRequestType.setDataValue(inService.requestType);
        this.useProxyCheckbox.setChecked(inService.useProxy);
        this.serviceResponseType.setDataValue(inService.returnType);

        var inputs = inService.parameters;
        var inputsQueryArray = [];
        var inputsHeaderArray = [];
        var inputsPathArray = [];
        wm.forEachProperty(inputs, function(item, name) {
            var tmp = {
                name: name,
                type: item.type,
                transmitType: item.transmitType,
                defaultValue: item.defaultValue,
                noEscape: item.noEscape,
                hidden: item.hidden
            };
            switch(item.transmitType) {
                case "path":
                    inputsPathArray.push(tmp);
                    break;
                case "header":
                    inputsHeaderArray.push(tmp);
                    break;
                case "queryString":
                    inputsQueryArray.push(tmp);
                    break;
            }
        });
        this.inputsVar.setData(inputsQueryArray);
        this.inputsHeaderVar.setData(inputsHeaderArray);
        this.inputsPathVar.setData(inputsPathArray);

        this.toolbar.show();
        this.updateUrl();
        this.isDirty = false;
        studio.updateServicesDirtyTabIndicators();
    },
    onDeleteClick: function(inSender) {
        wm.XhrService.prototype.removeOperation(this.editService.name);
        this.editService.destroy();
        studio.refreshServiceTree();
        this.dismiss();
    },
    okButtonClick: function(inSender) {
        var oldName = this.editService ? this.editService.name : "";

        var serviceName = this.serviceName.getDataValue();
        if (!serviceName) {
            app.toastError("Please enter a service name");
            return;
        }

        serviceName = (this.editService && this.editService.name == serviceName) ? serviceName : studio.application.getUniqueName(serviceName);

        var url = this.serviceUrl.getDataValue();
        if (!url) {
            app.toastError("Please enter a url");
            return;
        }

        var returnType;
        var jsonText;
        if (this.serviceResponseType.getDataValue() != "New Type") {
            returnType = this.serviceResponseType.getDataValue();
        } else {
            jsonText = this.returnedJSONEditor.getDataValue();
            if (!jsonText) {
                app.toastError("Please enter a sample JSON result or set the returned type to String");
                return;
            }
        }

        var c;
        if (this.editService) {
            c = this.editService;
            if (c.name != serviceName) {
                c.set_name(serviceName, true);
            }
        } else {
            c = new wm.XhrDefinition({
                owner: studio.application,
                name: serviceName
            });
        }
        c.url = url;
        c.contentType = this.serviceContentType.getDataValue();
        c.useProxy = this.useProxyCheckbox.getChecked();
        c.type = this.serviceRequestType.getDataValue();

        var inputs = {};

        /* Add paths to the input */
        this.inputsPathVar.forEach(dojo.hitch(this, function(item) {
            inputs[item.getValue("name")] = {transmitType: "path",
                                             type: item.getValue("type"),
                                             defaultValue: item.getValue("defaultValue")};
        }));

        this.inputsHeaderVar.forEach(dojo.hitch(this, function(item) {
            inputs[item.getValue("name")] = {transmitType: "header",
                                             type: item.getValue("type"),
                                             defaultValue: item.getValue("defaultValue"),
                                             hidden: item.getValue("hidden")};
        }));
        this.inputsVar.forEach(dojo.hitch(this, function(item) {
            inputs[item.getValue("name")] = {transmitType: "queryString",
                                             type: item.getValue("type"),
                                             defaultValue: item.getValue("defaultValue"),
                                             hidden: item.getValue("hidden"),
                                             noEscape: item.getValue("noEscape")
                                             };
        }));

        c.parameters = inputs;

        if (returnType) {
            c.returnType = returnType;
        } else {
            var typeDef = new wm.TypeDefinition({
                name: serviceName + "Response",
                owner: studio.application,
                _isDesignLoaded: true
            });
            c.returnType = typeDef.name;
            wm.TypeDefinition.prototype.getTypeDefinitionDialog();
            studio.TypeDefinitionGeneratorDialog.page.setTypeDefinition(typeDef);
            studio.TypeDefinitionGeneratorDialog.page.typeName.setDataValue(typeDef.name)
            studio.TypeDefinitionGeneratorDialog.page.generateButtonClick(null, null, null, jsonText, typeDef.name);
        }
        c.requestType = this.serviceRequestType.getDataValue();
        if (this.editService) {
            this.inherited(arguments);
            if (oldName != this.editService.name) {
                wm.XhrService.prototype.removeOperation(oldName);
            }
        }

        c.initType();
        dojo.publish("wmtypes-changed");
        studio.refreshServiceTree();

        if (!this._inStudioSave) {
            app.toastSuccess("You can access the new service using a wm.ServiceVariable, set the service to \"xhrService\" and the operation to \"" + c.name + "\"");
            this.dismiss();
            studio.project.save();
        }
    },
    updateUrl: function() {
        var text = this.serviceUrl.getDataValue();
        var queryString = "";

        this.inputsPathVar.forEach(function(item) {
            var replaceStr = "${" + item.getValue("name") + "}";
            var replaceStrIndex = text.indexOf(replaceStr);
            text = text.substring(0, replaceStrIndex) + (item.getValue("defaultValue") || "somevalue") + text.substring(replaceStrIndex + replaceStr.length);
        });

        this.inputsVar.forEach(function(item) {
            if (queryString) queryString += "&";
            queryString += item.getValue("name") + "=somevalue";
        });
        if (queryString) text += "?" + queryString;
        this.actualUrl.setDataValue(text);
    },
    addHeaderButtonClick: function() {
        this.headerInputsGrid.addRow({  name: "",
                                        type: "String",
                                        hidden: false,
                                        noEscape: false,
                                        defaultValue: ""});
    },
    addInputRow: function() {
        this.inputsGrid.addRow({
            type: "String",
            transmitType: "queryString",
            name: "",
            defaultValue: "",
            hidden: false,
            noEscape: false
        });
    },
    cancelClick: function() {
        this.dismiss();
    },
    dismiss: function() {
        if (wm.isInstanceType(this.owner.owner, window["ImportWebService"])) {
            this.owner.owner.dismiss();
        } else {
            var tabs = this.owner.parent.parent;
            this.owner.parent.destroy();
            if (tabs.layers.length == 0) {
                tabs.parent.hide();
                studio.workspace.activate();
            }
        }
    },
    changed: function(inSender,inDisplayValue,inDataValue,inSetByCode) {
        if (inSender instanceof wm.AbstractEditor && inSetByCode) return;
        this.isDirty = true;
        var layer = this.owner.parent;
        while (layer.owner != studio) {
            layer = layer.parent.isAncestorInstanceOf(wm.Layer);
        }
        if (layer instanceof wm.Layer) {
            dojo.addClass(layer.decorator.btns[layer.getIndex()], "StudioDirtyIcon");
            studio.updateServicesDirtyTabIndicators();
        }
    },
    regeneratePathGrid: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSetByCode) return;
        /* Step 1: Get the list of inputs based on the URL */
        var value = this.serviceUrl.getDataValue();
        var queryString = value.match(/\?.*$/);
        if (queryString) {
            queryString = queryString[0];
            this.serviceUrl.setDataValue(value.substring(0,value.indexOf(queryString)));
            queryString = queryString.substring(1);
            var queryInputs = queryString.split(/\&/);
            for (var i = 0; i < queryInputs.length; i++) {
                var namevalue = queryInputs[i].match(/^(.*)\=(.*$)/);
                if (namevalue && this.inputsVar.query({name: namevalue[1]}).getCount() == 0) {
                    this.inputsVar.addItem({name: namevalue[1],
                                            defaultValue: namevalue[2],
                                            type: "String"});
                }
            }
            app.toastInfo("Everything after the '?' has been removed from the URL and put into the 'Query String Inputs' tab");
        }
        var inputs = value.match(/\$\{.*?\}/g) || [];
        for (var i = 0; i < inputs.length; i++) {
            inputs[i] = inputs[i].substring(2,inputs[i].length-1);
        }

        /* Step 2: Remove from our inputPathVar any items that don't exist in the inputs array */
        var remainingPathVar = this.inputsPathVar.filterItems(function(item) {
            var name = item.getValue("name");
            return dojo.indexOf(inputs, name) != -1;
        });

        /* Step 3: Add items from the inputs array into remainingPathVar unless the item is already there */
        for (var i = 0; i < inputs.length; i++) {
            var name = inputs[i];
            if (remainingPathVar.query({name: name}).getCount() == 0) {
                remainingPathVar.addItem({name: name, defaultValue: name, type: "String"});
            }
        }

        /* Step 4: Update the dataSet and grid */
        this.inputsPathVar.setData(remainingPathVar.getData());
    },
    /* Accessed from studio */
    getDirty: function() {
        return this.isDirty;
    },
    getProgressIncrement: function() {
        return 0;
    },
    /* Called by studio; project already saved by the call that does this */
    save: function() {
        this._inStudioSave = true;
        try {
            this.okButtonClick();
        } catch(e) {}
        delete this._inStudioSave;
        this.saveComplete();
    },
    saveComplete: function() {},// exists solely so studio can connect
    _end: 0
});