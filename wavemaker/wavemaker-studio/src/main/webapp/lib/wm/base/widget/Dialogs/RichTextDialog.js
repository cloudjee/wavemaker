/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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


dojo.provide("wm.base.widget.Dialogs.RichTextDialog");
dojo.require("wm.base.widget.Dialogs.WidgetsJsDialog");

dojo.declare("wm.RichTextDialog", wm.WidgetsJsDialog, {

    noEscape: true,
    footerBorder: "",
    footerBorderColor: "",
    title: "Write Your Documentation",
    padding: "0",
    width: "500px",
    height: "500px",
    modal: false,
    html: "", // initial html to show in the editor; use getHtml for current value
    prepare: function() {
        this.inherited(arguments);
        this.widgets_data = {
	    documentation: ["wm.RichText", {width: "100%", 
					    height: "100%", 
					    "toolbarAlign":false,
					    "toolbarLink":true,
					    "toolbarColor":true, 
					    toolbarFormatName: true, 
					    dataValue: this.html, 
					    displayValue: this.html}, {}],
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, 
				     name: "buttonBar", 
				     layoutKind: "left-to-right", 
				     padding: "2,0,2,0",
				     horizontalAlign: "right", 
				     height: "34px", 
				     fitToContentHeight: true, 
				     width: "100%", 
				     borderColor: this.footerBorderColor, 
				     border: this.footerBorder}, {}, {
					 okButton: ["wm.Button", {"width":"150px",
								  "caption": wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_OK")}, 
						    {"onclick":"onOkClick"}],
					 cancelButton: ["wm.Button", {"width":"150px",
								      "caption":  wm.getDictionaryItem("wm.Application.CAPTION_CONFIRM_CANCEL")}, 
							{"onclick":"onCancelClick"}]
	                     }]};
    },
    postInit: function() {
	this.inherited(arguments);
	this.$.documentation.onchange = dojo.hitch(this, function() {
	    this.valueChanged("html", this.$.documentation.dataValue);
	});
    },

    setHtml: function(inHtml) {
        this.html = inHtml; // for design mode use only
        if (this.$.documentation)
	    this.$.documentation.setDataValue(inHtml);
    },
    getHtml: function() {
        if (this.$.documentation)
	    return this.$.documentation.getDataValue();
    },
    onOkClick: function() {
	this.dismiss();
    },
    onCancelClick: function() {
	this.dismiss();
    },
    setShowing: function(inShowing) {
        this.inherited(arguments);
        if (this.$.documentation && !this.$.documentation.editor)
            this.$.documentation.setShowing(true);
    }
});

wm.Object.extendSchema(wm.RichTextDialog, {
    html: {group: "display", order: 54, bindable: true, simpleBindProp: true},
    footerBorder: {group: "style", order: 100},
    footerBorderColor:  {group: "style", order: 101}
});
wm.RichTextDialog.extend({
    themeable: false
});

