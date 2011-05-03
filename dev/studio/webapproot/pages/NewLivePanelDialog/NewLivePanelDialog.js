/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 

dojo.declare("NewLivePanelDialog", wm.Page, {
    i18n: true,
    selectedTemplate: null,
    options: null,
    start: function() {

	var options = this.options = [{name: "Traditional",
				       img: "images/GridLiveForm.png"},
				      {name: "Dialog",
				       img: "images/GridLiveFormDialog.png"}];
	
        var i = 0; 

	for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (i % 3 == 0) {
                var panel = new wm.Panel({width: "100%", height: "128px", layoutKind: "left-to-right", parent: this.templatesInsertPanel, owner: this, name: "templateRow" + i});
            }
            var imgpanel = new wm.Panel({_classes: {domNode: ["SelectableTemplate"]}, 
					 layoutKind: "top-to-bottom", 
					 parent: panel, 
					 owner: this, 
					 name: "templatepanel_" + i, 
					 margin: "4", 
					 border: "1", 
					 borderColor: "#888888", 
					 width: "112px", 
					 height: "120px"});
	    if (i == 0) 
		var firstimgpanel = imgpanel;
            var img = new wm.Picture({width: "100%", 
				      height: "100px", 
				      parent: imgpanel, 
				      owner: this, 
				      name: "template"+ i});
            img.domNode.style.backgroundImage = "url(" + option.img + ")";
            var label = new wm.Label({"width": "100%",
				      height: "20px",
				      parent: imgpanel,
				      owner: this,
				      name: "templatelabel" + i,
				      caption: option.name});
        }
        dojo.query(".SelectableTemplate", this.templatesInsertPanel.domNode).connect("onclick", this, "templateClicked");
        dojo.query(".SelectableTemplate", this.templatesInsertPanel.domNode).connect("dblclick", this, "templateDblClicked");
	this.templateClicked2(firstimgpanel);
	this.templatesInsertPanel.reflow();
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
  _end: 0
});
