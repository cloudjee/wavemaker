/*
 * Copyright (C) 2010-2013 VMware, Inc. All rights reserved.
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
 

dojo.declare("NewLivePanelDialog", wm.Page, {
    i18n: true,
    selectedTemplate: null,
    options: null,
    start: function() {
        this.helpButton = new wm.ToolButton({owner: this,
            parent: this.owner.owner.titleBar,
            _classes: {domNode: ["StudioHelpIcon"]},
            onclick: dojo.hitch(this, "openHelp"),
            width: "16px",
            height: "16px"
        });
    var options = this.options = [
                      
                       {name: this.getDictionaryItem("TRADITIONAL"),
                       img: "images/GridLiveForm.png",
                       mobile: false},
                      {name: this.getDictionaryItem("DIALOG"),
                       img: "images/GridLiveFormDialog.png",
                       mobile: false},                       
                       {name: this.getDictionaryItem("GRID"),
                       img: "images/GridLiveFormEditable.png",
                       mobile: false},                    
                       {name: this.getDictionaryItem("MENU"),
                       img: "images/GridLiveFormLeft.png",
                       mobile: false},                       
                      {name: this.getDictionaryItem("BREADCRUMB"),
                       img: "images/GridLiveFormBreadcrumbs.png",
                       mobile: false},                       
                      {name: this.getDictionaryItem("LIVEVARIABLE"),
                       img:"",
                       mobile: false},
                      {name: this.getDictionaryItem("TABLET"),
                       img: "images/GridLiveFormLeft.png",
                       mobile: true},                       
                      {name: this.getDictionaryItem("PHONE"),
                       img: "images/GridLiveFormBreadcrumbs.png",
                       mobile: true},
                      {name: this.getDictionaryItem("LIVEVARIABLE"),
                       img:"",
                       mobile: true}                       
                    ];
    
        var i = 0;
        this.addTemplates(options, false);
        this.addTemplates(options, true);
        dojo.query(".SelectableTemplate", this.tabs.domNode).connect("onclick", this, "templateClicked");
        dojo.query(".SelectableTemplate", this.tabs.domNode).connect("dblclick", this, "templateDblClicked");
    this.templateClicked2(this.firstimgpanel);
    this.tabs.reflow();
    },
    addTemplates: function(options, isMobile) {
        var i = 0;
        var panel;
        var parent = !isMobile ? this.desktopTemplatesInsertPanel : this.mobileTemplatesInsertPanel;
        dojo.forEach(options, function(option) {
            if (option.mobile != isMobile) return;            
            if (i % 3 == 0) {
                panel = new wm.Panel({width: "100%", height: "128px", layoutKind: "left-to-right", parent: parent, owner: this, name: "templateRow" + i});
            }
            var imgpanel = new wm.Panel({_classes: {domNode: ["SelectableTemplate"]}, 
                     layoutKind: "top-to-bottom", 
                     parent: panel, 
                     owner: this, 
                     name: "templatepanel_" + parent.name + i, 
                     margin: "4", 
                     border: "1", 
                     borderColor: "#888888", 
                     width: "112px", 
                     height: "120px"});
        if (!this.firstimgpanel) 
            this.firstimgpanel = imgpanel;
            var img = new wm.Picture({width: "100%", 
                      height: "91px", 
                      border: "1",
                      borderColor: "#555555",
                      parent: imgpanel, 
                      owner: this, 
                      name: "template"+ parent.name + i});
            img.domNode.style.backgroundImage = "url(" + option.img + ")";
            var label = new wm.Label({"width": "100%",
                      height: "20px",
                      parent: imgpanel,
                      owner: this,
                      name: "templatelabel" + parent.name + i,
                      caption: option.name});
            i++;
        }, this);
    },
/* Copied from NewProjectDialog and not yet updated for use here
    reset: function() {
        var projectNames = {};
    var projects = studio.project.getProjectList();
    var l={};
    dojo.forEach(projects, dojo.hitch(this, function(p) {
        projectNames[p] = true;
        }));
    var newname = wm.findUniqueName("Project", [projectNames]);
    this.projectName.setDataValue(newname);
    },
    */
    clearSelection: function() {
        if (this.selectedTemplate) {
            this.selectedTemplate.setBorderColor("#888888");
            this.selectedTemplate.setBorder("1");       
            dojo.removeClass(this.selectedTemplate.domNode, "Selected");
            this.selectedTemplate = null;
        }
    },
    templateDblClicked: function(inMouseEvent) {
        var target = wm.getWidgetByDomNode(inMouseEvent.target);
        while(target && !dojo.hasClass(target.domNode, "SelectableTemplate"))
            target = target.parent;
        if (!target) return;
        if (target != this.selectedTemplate) {
        this.templateClicked2(target);
        }
    var selectedName = target.c$[1].caption;
        this.onOkClick(selectedName);
    },
    templateClicked: function(inMouseEvent) {
        var target = wm.getWidgetByDomNode(inMouseEvent.target);
        while(target && !dojo.hasClass(target.domNode, "SelectableTemplate"))
            target = target.parent;
        if (!target) return;
        if (target == this.selectedTemplate) return;
    this.templateClicked2(target);
    },
    templateClicked2: function(inTarget) {
        this.clearSelection();
        this.selectedTemplate = inTarget;
        this.selectedTemplate.setBorderColor("#333333");
        this.selectedTemplate.setBorder("2");
        dojo.addClass(inTarget.domNode, "Selected");
    },
    onCancelClick: function() {
        this.owner.owner.dismiss();
    },
    onOkClick: function(selectedName) {
        this.owner.owner.dismiss();
    },
    _onOkClick: function() {
    this.onOkClick(this.selectedTemplate.c$[1].caption);
    },
    openHelp: function() {
        window.open(studio.getDictionaryItem("URL_DOCS", {studioVersionNumber: wm.studioConfig.studioVersion.replace(/^(\d+\.\d+).*/,"$1")}) + "NewLivePanelDialog");
    },
  _end: 0
});
