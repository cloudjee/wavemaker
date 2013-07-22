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
 

dojo.provide("wm.studio.pages.ImportFile.ImportFile");

dojo.declare("ImportFile", wm.Page, {
    i18n: true,
    start: function() {
        var d = this.fileUploader.button.domNode;
    	dojo.addClass(d, "StudioButton");
    	this.fileUploader.connect(this.fileUploader, "createButton", this, "styleUploader");
    	this.fileUploader.connect(this.fileUploader, "adjustButtonHeight", this, "styleUploader2");    	
    	this.styleUploader();
    }, 
    styleUploader: function() {
        var b = this.fileUploader.button;
        b.setBorder("1");
        b.setBorderColor(this.cancelButton2.borderColor);
        b.setMargin("4px");
    },
    styleUploader2: function() {    
        var d = this.fileUploader.button.domNode;
        d.style.margin = "4px";
        d.style.border = this.cancelButton2.domNode.style.border;
    },
    onShow: function() {
        this.introLayer.activate();
        this.projectTakenLabel.hide();
        this.radioPanel.hide();
        this.cleanupTmpFolder();        
    },
    
    onHide: function() {
        this.cleanupTmpFolder();
    },
    cleanupTmpFolder: function() {
   		studio.deploymentService.requestAsync("cleanupImportTmp", [this.serverFileName || ""]);
   		delete this.serverFileName;
    },
    /*
    openProject: function() {
	this.owner.dismiss();
	studio.project.openProject(this.fileUploader.variable.getData()[0].path);
    },
    */
    setService: function(inService, inOperation) {
		this.fileUploader.service = inService;
		this.fileUploader.operation = inOperation;
		this.fileUploader.createDijit();
    },
    getPath: function() {
    	return this.fileUploader.variable.getData()[0].path;
    },
    selectLastItem: function() {
    	wm.onidle(this, function() {
    	    this.list.eventSelect(this.list.getItem(this.list.getCount()-1));
    	});
    },
    onChange: function() {
	    var data = this.fileUploader.variable.getData();
    	this.fileUploader.reset();
    	if (data) {
    	    data = data[0];
    	    this.fileUploader.variable.setData([data]);
    	}
    	
    },
    
    /* fired when the file is uploaded successfully; currently that means we get some initial analytics back on what was in the zip file */
    onSuccess: function(inSender, inResponse) {
        var result = dojo.fromJson(inResponse[0].path);
        this.serverFileName = result.file;
        var data = [];
        var selectedData = [];
        if (result.components) {
            dojo.forEach(result.components, function(item) {
                data.push({name: item.name, type: "component", exists: item.exists, dataValue: "component:" + item.name, moduleName: item.moduleName});
                if (!item.exists) selectedData.push(data[data.length-1]);
            });
        }
        
        if (result.themes) {
            dojo.forEach(result.themes, function(item) {
                data.push({name: item.name, type: "theme", exists: item.exists, dataValue: "theme:" + item.name});
                if (!item.exists) selectedData.push(data[data.length-1]);                
            });
        }        
        
        if (result.projecttemplates) {
            dojo.forEach(result.projecttemplates, function(item) {
                data.push({name: item.name, type: "projecttemplate", exists: item.exists, dataValue: "projecttemplate:" + item.name});            
                if (!item.exists) selectedData.push(data[data.length-1]);                
            });
        }        
        
        this.radioNoImport.show();
        if (result.project && !result.project.exists) {
            data.push({name: result.project.name, type: "project", exists: result.project.exists, dataValue: "project:"+result.project.name + ":" + result.project.name});
            selectedData.push(data[data.length-1]);
            this.radioPanel.hide();
        } else if (result.project) {
            this._projectName = result.project.name;
            this.radioPanel.show();        
            this.radioOverwrite.setCaption("Overwrite " + result.project.name + " with imported project");
            this.radioRename.setCaption("Import project " + result.project.name + " with new name:");
            this.renameEditor.setDataValue(result.project.alt);
            this.radioRename.setChecked(true);
            if (data.length == 0) this.radioNoImport.hide();
        }
        this.variable.setData(data);
        this.checkboxSet.setDataValue(selectedData);
        this.checkboxSet.setShowing(data.length);
        this.bevel1.setShowing(this.checkboxSet.showing && this.radioPanel.showing);
        if (result.project && !result.project.exists && data.length == 1) {
            this.finishImport();
        } else {
            this.confirmLayer.activate();
        }
    },
    finishImport: function() {
        var data = this.checkboxSet.getDataValue();
        if (this.radioPanel.show) {
            if(this.radioOverwrite.getChecked()) {
                data.push("project:" + this._projectName + ":" + this._projectName);
            } else if (this.radioRename.getChecked()) {
                data.push("project:" + this._projectName + ":" + this.renameEditor.getDataValue());
            }
        }
   		studio.deploymentService.requestAsync("uploadMultiFile",
			[this.serverFileName , data],
			dojo.hitch(this, "onImportSuccess"),
			dojo.hitch(this, "onImportError"));

    },
    onImportError: function(inError) {app.alert(inError);},
    onImportSuccess: function(inResult) {
        this.owner.owner.hide();
	    app.toastSuccess("Import Successful");

        var importedItems = this.checkboxSet.selectedItem;
        
        if (importedItems.query({type:"theme"}).getCount() > 0) {
            studio.loadThemeList();
        }
        
        importedItems.query({type: "component"}).forEach(function(inItem) {
            var moduleName = inItem.getValue("moduleName");
            delete dojo._loadedModules[moduleName];
            var uri = dojo.moduleUrl(moduleName.replace(/\.[^.]+$/,"")) + moduleName.replace(/^.*\./,"") + ".js";
            delete dojo._loadedUrls[uri];
            dojo.require(moduleName);
        });
	    if (inResult) {	    
	       studio.project.openProject(inResult);
	    }
	    delete this.serverFileName;
    },
    
    onError: function() {},
    updateProjectTakenLabel: function(inSender, inDisplayValue, inDataValue) {
        if (app.projectListVar.query({dataValue: inDisplayValue}).getCount()) {
            this.projectTakenLabel.show();
        } else {
            this.projectTakenLabel.hide();
        }
    },
    _end: 0
});
