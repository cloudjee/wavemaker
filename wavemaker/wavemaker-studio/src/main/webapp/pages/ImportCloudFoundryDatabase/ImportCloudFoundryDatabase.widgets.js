/*
 * Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

ImportCloudFoundryDatabase.widgets = {
    cloudFoundryService: ["wm.JsonRpcService", {service: "cloudFoundryService", sync: true}, {}],
    serviceListVar: ["wm.Variable", {type: "StringData", isList:true}],
    cfLoginDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, "height":"200px","title":"CloudFoundry Account Info","width":"400px","containerWidgetId":"containerWidget3","buttonBarId":"buttonBar2"}, {}, {
        mainPanel4: ["wm.studio.DialogMainPanel", {autoScroll:true},{}, {
	    loginMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"5,20,5,20","verticalAlign":"top","width":"100%"}, {}, {
		loginDialogInstructionLabel: ["wm.Label", {"align":"center","border":"0","caption":"Enter your CloudFoundry Account Info; <b>this dialog will be removed soon</b>","padding":"4","width":"100%"}, {}],
		loginDialogTargetEditor: ["wm.Text", {captionSize: "150px", "caption":"CloudFoundry target","captionAlign":"left","displayValue":"https://api.cloudfoundry.com","width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}],
		loginDialogUserEditor: ["wm.Text", {captionSize: "150px", "caption":"Account name","captionAlign":"left","displayValue":"","width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}],
		loginDialogPasswordEditor: ["wm.Text", {captionSize: "150px", "caption":"Password","captionAlign":"left","displayValue":"","password":true,"width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}]
	    }]
	}],
    layoutBox1: ["wm.Layout", {height: "100%", width: "100%"}, {}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
	    instructions: ["wm.Html", {width: "100%", height: "30px", html: "Select a database service you have setup in CloudFoundry, or <a target='caldecott' href='http://blog.cloudfoundry.com/post/12928974099/now-you-can-tunnel-into-any-cloud-foundry-data-service'>Setup a new database service</a>"}],
	    serviceList: ["wm.List", {_classes: {domNode: ["StudioList"]}, width: "100%", height: "100%", columns:[{show:true, field: "dataValue"}], noHeader:true}, {}, {
		binding: ["wm.Binding",{},{},{
		    wire: ["wm.Wire", {source: "serviceListVar", targetProp: "dataSet"}]
		}]
	    }]
	}],
	footer: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "30px", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
		importBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Import", width: "96px", hint: "Import Database"}, {onclick: "importBtnClick"}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {targetProperty: "disabled", source: "panel1.invalid"}]
		    }]
		}],
		cancelBtn: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Close", width: "96px"}, {onclick: "cancelBtnClick"}]
	    }]

    }]
    }