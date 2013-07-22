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



dojo.provide("wm.studio.pages.ResourceEditor.ResourceEditor");


dojo.declare("ResourceEditor", wm.Page, {
    i18n: true,
    item: null,
    start: function() {
        this.connect(studio.project, "saveComplete", this, "onProjectSaved");
    },
    setItem: function(inItem) {
        this.item = inItem;

        // If we are reverting the file, keep the old path; getFilePath may fail because
        // the tree node may no longer exist by the time we do a revert
        if (!this._fullPath) {
            this._fullPath = this.item.getFilePath();
        }
        if (this.item instanceof wm.ImageResourceItem) {
            this.editor.hide();
            this.picture.show();
            var path = this._fullPath;
            path = path.replace(/\/webapproot/, "");
            path = "projects/" + studio.project.getProjectPath() + path;
            this.picture.setSource(path);
        } else if (this.item instanceof wm.ZipResourceItem) {

        } else if (this.item instanceof wm.JarResourceItem) {

        } else {
            studio.resourceManagerService.requestAsync("readFile", [this.item.getFilePath()], dojo.hitch(this, "receiveItem"));
        }
        this.fullPath.setCaption(this._fullPath);

    },
    receiveItem: function(inResult) {
        var text = inResult;
        this.editor.setText(text);
        if (this.item instanceof wm.HTMLResourceItem) {
            this.editor.setSyntax("html");
            this.formatBtn.hide();
        } else if (this.item instanceof wm.XMLResourceItem) {
            this.formatBtn.hide();
            this.editor.setSyntax("xml");
        } else if (this.item instanceof wm.MiscResourceItem) {
            this.formatBtn.hide();
            this.editor.setSyntax("text");
        } else if (this.item instanceof wm.CSSResourceItem) {
            this.formatBtn.hide();
            this.editor.setSyntax("css");
        } else if (this.item instanceof wm.JSONResourceItem) {
            this.formatBtn.show();
            this.editor.setSyntax("json");
        } else if (this.item instanceof wm.JSResourceItem) {
            this.formatBtn.show();
            this.editor.setSyntax("javascript");
        } else if (this.item instanceof wm.XMLResourceItem) {
            this.formatBtn.hide();
            this.editor.setSyntax("xml");
        } else {
            this.formatBtn.hide();
            this.editor.setSyntax("text");
        }

        wm.onidle(this, function() {
            this.editor.setLineNumber(0);
        });


    },

    findScriptClick: function() {
        this.editor.showSearch();
    },
    refreshScriptClick: function() {
        this.setItem(this.item);
    },
    formatScriptClick: function() {
        studio.formatScript(this.editor);
    },
    toggleWrapScriptClick: function() {
        this.editor.toggleWordWrap();
    },
    showEditorHelp: function() {
        this.editor.showHelp();
    },
    saveTextEditor: function() {
        studio.beginWait("Saving...");
        studio.resourceManagerService.requestSync("writeFile", [this._fullPath, this.editor.getDataValue()], dojo.hitch(this, function() {
            this.saveBtn.setDisabled(true);
            studio.endWait("Saving...");
            app.toastSuccess(this.getDictionaryItem("EDITS_SAVED"));
            this.editor.clearDirty();
            this.editor.focus();
            this.onFileChange(this._fullPath, this.editor.getDataValue());
        }), dojo.hitch(this, function() {
            studio.endWait("Saving...");
            app.toastError(this.getDictionaryItem("EDITS_FAILED"));
        }));
    },
    editorChange: function(inSender) {
        var isDirty = this.editor.isDirty;
        this.saveBtn.setDisabled(!isDirty);
        /*
    this.owner.isDirty = isDirty;
    this.owner.parent.updateIsDirty();
    */
    },
    onFileChange: function(inPath, inContents) {
        if (inPath.match(/\/pages\//)) {
            inPath = inPath.replace(/.*?\/pages\//, "");
            this.onPageChange(inPath, inContents);
        } else if (inPath.indexOf("/common/") == 0) {
            this.onCommonChange(inPath, inContents);
        } else {
            switch (inPath) {
            case "/webapproot/" + studio.project.projectName + ".js":
                this.onProjectChange(inPath, inContents);
                break;
            case "/webapproot/app.css":
                this.onProjectChange(inPath, inContents);
                break;
            }
        }
    },
    onPageChange: function(inPath, inContents) {
        var matches = inPath.match(/^[^\/]*/);
        var pageName = matches ? matches[0] : null; // should never be null;
        /* Refresh all components so that page containers are updated */
        if (pageName != studio.project.pageName) {
            var pageContainers = wm.listOfWidgetType(wm.PageContainer, false, false);
            for (var i = 0; i < pageContainers.length; i++) {
                if (pageContainers[i].pageName == pageName) delete window[pageName];
                pageContainers[i].forceReloadPage();
            }
        } else {
            studio._dontNavOnPageChange = true;
            studio.project.openPage(pageName);
            delete studio._dontNavOnPageChange;
        }
    },
    onProjectChange: function(inPath, inContents) {
        var tmp = studio.application;
        studio.project.openApplication();
        tmp.destroy();
        studio.refreshWidgetsTree();
    },

    // The project has been saved, some of the files being edited may now be out of sync with whats on the server
    // Rather than let the user clobber their just-saved changes, refresh the editors with the current file content
    onProjectSaved: function() {
        var inPath = this._fullPath;
        if (inPath.match(/\/pages\//)) {
            inPath = inPath.replace(/.*?\/pages\//, "");
            var matches = inPath.match(/^[^\/]*/);
            var pageName = matches ? matches[0] : null; // should never be null;
        }
        /* Refresh all components so that page containers are updated */
        if (pageName == studio.project.pageName ||
            inPath == "/webapproot/" + studio.project.projectName + ".js" ||
            inPath == "/webapproot/" + studio.project.projectName + ".css") {
            this.refreshScriptClick();
        }

    },
    onCommonChange: function(inPath, inContents) {

    },
    scriptEditorCtrlKey: function(inSender, e, letter) {
        switch(letter.toLowerCase()) {
        case "s":
            dojo.stopEvent(e);
            return this.saveTextEditor();
        }
    },
    _end: 0
});