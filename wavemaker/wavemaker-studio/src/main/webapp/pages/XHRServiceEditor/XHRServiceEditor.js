 /*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
        var inputsArray = [];
        wm.forEachProperty(inputs, function(item, name) {
            inputsArray.push({
                name: name,
                type: item.type,
                transmitType: item.transmitType
            });
        });
        this.inputsVar.setData(inputsArray);

        var headers = inService.headers
        var headersArray = [];
        wm.forEachProperty(headers, function(value, name) {
            headersArray.push({
                name: name,
                dataValue: value
            });
        });
        this.fixedHeadersVar.setData(headersArray);
        this.toolbar.show();
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

        var headers = {};
        var headersArray = this.fixedHeadersVar.getData();
        for (var i = 0; headersArray && i < headersArray.length; i++) {
            var item = headersArray[i];
            headers[item.name] = item.dataValue;
        }

        c.headers = headers;

        var inputs = {};
        var inputsArray = this.inputsVar.getData();
        for (var i = 0; inputsArray && i < inputsArray.length; i++) {
            var item = inputsArray[i];
            inputs[item.name] = {
                transmitType: item.transmitType ? 1 : 0,
                type: item.type || "string"
            };
        }

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
        app.toastSuccess("You can access the new service using a wm.ServiceVariable, set the service to \"xhrService\" and the operation to \"" + c.name + "\"");
        this.dismiss();
    },
    addInputRow: function() {
        this.inputsGrid.addRow({
            type: "String",
            transmitType: "parameter",
            name: ""
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
    _end: 0
});