/*
 *  Copyright (C) 2011-2013 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.debug.DataPanel");

dojo.declare("wm.debug.DataPanel", wm.Layer, {
    width: "100%",
    height: "100%",
    caption: "Data",
    layoutKind: "top-to-bottom",
    verticalAlign: "top",
    horizontalAlign: "left",
    autoScroll: true,
    


/* This hack (providing getRoot and getRuntimeId) is needeed to be able to write event handlers such as onShow: "serviceGridPanel.activate"; without it, we'd need something like
 * app.debugDialog.serviceGridPanel.activate
 */
    getRoot: function() {
	return this;
    },
	getRuntimeId: function(inId) {
		inId = this.name + (inId ? "." + inId : "");
		return this.owner != app.pageContainer ? this.owner.getRuntimeId(inId) : inId;
	},
	getId: function(inName) {
		return inName;
	},



    postInit: function() {
       this.inherited(arguments);
       this.createComponents({
           //dataEditor: [wm.isMobile ? "wm.LargeTextArea" : "wm.AceEditor", {"height":"100%","name":"dataEditor","width":"100%"}],
           tabs: ["wm.TabLayers", {conditionalTabButtons:1,width:"100%",height:"100%",headerHeight: "20px", clientBorder: "1,0,0,0", margin: "0", padding: "0"},{},{
                dataLayer: ["wm.Layer", {caption: "Current Data", horizontalAlign: "left", verticalAlign: "top"},{},{
                   dataEditor: ["wm.LargeTextArea",
                   {
                       "editorBorder": false,
                       "height": "100%",
                       "name": "dataEditor",
                       "width": "100%",
                       padding: "0",
                       border: "0,0,1,0",
                       borderColor: "black"
                   }],
                   setDataButton: ["wm.Button",
                   {
                       name: "fireButton",
                       caption: "setData()",
                       width: "120px",
                       height: "20px",
                       margin: "2",
                       border: "1",
                       borderColor: "#666"
                   }, {
                       onclick: "callSetData"
                   }],
                   errorLabel: ["wm.Html",
                   {
                       name: "errorLabel",
                       width: "100%",
                       height: "50px",
                       border: "1",
                       borderColor: "red"
                   }, {}, {}]
               }],
               responseLayer: ["wm.Layer", {caption: "Server Response"}, {}, {
                    responseEditor: ["wm.LargeTextArea",
                    {
                       "editorBorder": false,
                       "height": "100%",
                       "name": "dataEditor",
                       "width": "100%",
                       padding: "0",
                       border: "0,0,1,0",
                       borderColor: "black",
                       readonly: true
                   }]
               }]
           }]
       }, this);
   },


   inspect: function(inComponent, inGridItem) {
        this.responseLayer.setShowing(inComponent instanceof wm.ServiceVariable);
       this.selectedItem = inComponent;
       if (!this.selectedItem || this.selectedItem instanceof wm.Variable == false) {
           this.hide();
           return;
       }
       if (inComponent._requester) {
            this.dataEditor.setDataValue("Loading from server...");
       } else {
           var data = inComponent.getData();
           this.dataEditor.setDataValue(js_beautify(dojo.toJson(data)));
           if (this.dataEditor.setLineNumber) this.dataEditor.setLineNumber(0);           
           this.responseEditor.setDataValue(inComponent._lastResponse);
       }
       if (data instanceof Error) {
           this.errorLabel.setCaption(data.toString());
           this.errorLabel.show();
       } else {
           this.errorLabel.hide();
       }
   },
   callSetData: function() {
       var data = this.dataEditor.getDataValue();
       data = eval("(" + data + ")");
       this.selectedItem.setData(data);
   },
   onShow: function() {
       this.dataEditor.focus();
   }
});