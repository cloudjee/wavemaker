/*
 *  Copyright (C) 2011 VMware, Inc. All rights reserved.
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
DeploymentDialog.widgets = {
    cloudFoundryService: ["wm.JsonRpcService", {service: "cloudFoundryService", sync: true}, {}],
    deploymentLoadingDialog: ["wm.LoadingDialog", {}],
    cloudFoundryAppListDialog: ["wm.DesignableDialog", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", containerWidgetId: "cfAppListPanel", buttonBarId: "buttonBar5", width: "400px", height: "500px"}, {}, {
	cfAppListPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", layoutKind: "top-to-bottom", padding: "0", border: "10", borderColor: "#424a5a"}, {}, {
	    cloudFoundryAppList: ["wm.List", {dataFields: "name", headerVisible: true, innerBorder:"1",borderColor:"black","height":"100%","width":"100%", dataFields: "name,state,services"}, {}],
	    deleteServicesCheckbox: ["wm.Checkbox", {caption: "Delete services too?", width: "220px", captionSize: "100%", startChecked: true, helpText: "Deleting services means deleting database services that were generated for your application.  Typically you should delete these databases unless there is another application listed above that is using the database."}]
	}],
	buttonBar5: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {

	    cloudFoundryUndeployFromListButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Undeploy","margin":"4"}, {"onclick":"cloudFoundryUndeployFromListButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"source":"cloudFoundryAppList.emptySelection","targetProperty":"disabled"}, {}]
		}]
	    }],
	    cloudFoundryAppListDialogCloseButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Close","margin":"4"}, {"onclick":"cloudFoundryAppListCloseButtonClick"}]
	}]
    }],

/*
    deploymentListPopupMenu: ["wm.PopupMenu", {"fullStructure":[{'label':'Deploy', 'onClick':"contextDeploy",'children':[]},
								{'label':'Delete','onClick':"contextDelete",'children':[]}
							       ]
					      }],
					      */
    deploymentListVar: ["wm.Variable", {type: "EntryData", isList:true}],
    confirmSaveDialog: ["wm.DesignableDialog", {"border":"1","height":"110px","title":"Save Changes","width":"400px","containerWidgetId":"containerWidget4","buttonBarId":"buttonBar4"}, {}, {
	containerWidget4: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","margin":"0","verticalAlign":"top","width":"100%"}, {}, {
	    confirmSaveDialogHtml1: ["wm.Html", {"border":"0","height":"100%","width":"100%", padding: "10,30,10,30", html: "You have unsaved changes that will be lost; continue?"}, {}]
	}],
	buttonBar4: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		saveDialogDontSaveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Don't Save","margin":"4","width":"100px"}, {}],
		spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
	        saveDialogCancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {}],
	        saveDialogSaveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Save","margin":"4"}, {}]
	}]
    }],

    newDeploymentDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget2",width: "400px", "height":"200px","title":"Choose Deployment Type"}, {}, {
	containerWidget2: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
	    iconOrMarginPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
	    chooseDeploymentPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","padding":"5,40,5,0","verticalAlign":"top","width":"100%"}, {}, {
		chooseDeploymentLabel: ["wm.Label", {"align":"center","border":"0","caption":"Choose the target for this deployment","padding":"4","width":"100%"}, {}],
		tomcatRadio: ["wm.RadioButton", {"caption":"Tomcat Server","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"tc","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","startChecked":true,"width":"100%"}, {onDblClick: "onNewDeployOk"}],
		cloudfoundryRadio: ["wm.RadioButton", {"caption":"CloudFoundry","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"cf","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","width":"100%"}, {onDblClick: "onNewDeployOk"}],
		appfilesRadio: ["wm.RadioButton", {"caption":"Application Files (WAR/EAR)","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"files","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","width":"100%"}, {onDblClick: "onNewDeployOk"}]
	    }]
	}],
	buttonBar1: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    cancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {onclick: "onNewDeployCancel"}],
	    okButton: ["wm.Button", {"caption":"OK","margin":"4"}, {onclick: "onNewDeployOk"}]
	}]
    }],
    cfLoginDialog: ["wm.DesignableDialog", {"height":"170px","title":"CloudFoundry Account Info","width":"400px","containerWidgetId":"containerWidget3","buttonBarId":"buttonBar2"}, {}, {
	containerWidget3: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0","padding":"0","verticalAlign":"top","width":"100%"}, {}, {
	    loginMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"5,20,5,20","verticalAlign":"top","width":"100%"}, {}, {
		loginDialogInstructionLabel: ["wm.Label", {"align":"center","border":"0","caption":"Enter your CloudFoundry Account Info","padding":"4","width":"100%"}, {}],
		loginDialogTargetEditor: ["wm.Text", {captionSize: "150px", "caption":"CloudFoundry target","captionAlign":"left","displayValue":"https://api.cloudfoundry.com","width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}],
		loginDialogUserEditor: ["wm.Text", {captionSize: "150px", "caption":"Account name","captionAlign":"left","displayValue":"","width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}],
		loginDialogPasswordEditor: ["wm.Text", {captionSize: "150px", "caption":"Password","captionAlign":"left","displayValue":"","password":true,"width":"100%"}, {onEnterKeyPress: "cfLoginOkClick"}]
	    }]
	}],
	buttonBar2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    cloudFoundryRegisterLink: ["wm.Label", {caption: "Get an account", link: "http://cloudfoundry.com/signup", width: "100px", height: "100%"}],
	    loginSpacer: ["wm.Spacer", {width: "100%"}],
	    cfLoginCancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {onclick: "cfLoginCancelClick"}],
	    cfLogonOkButton: ["wm.Button", {"caption":"OK","margin":"4"}, {onclick: "cfLoginOkClick"}]	    
	}]
    }],
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
	deploymentMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", layoutKind: "left-to-right", padding: "20"}, {}, {
	    deploymentListPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]},"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"150px", margin: "0,10,0,0"}, {}, {
		listButtonPanel: ["wm.Panel", {"border":"0","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    addButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Add","height":"100%","margin":"1","width":"40px"}, {"onclick":"addButtonClick"}],
		    deleteButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Delete","height":"100%","margin":"1","width":"100%"}, {"onclick":"deleteButtonClick"}],
		    copyButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Copy","height":"100%","margin":"1","width":"45px"}, {"onclick":"copyButtonClick"}]
		}],
		deploymentList: ["wm.List", {dataFields: "name", headerVisible: false, innerBorder:"1",borderColor:"black","height":"100%","width":"100%"}, {onselect: "deploymentListSelect"/*, onRightClick: "deploymentListPopupMenuOpen"*/}, {
		    binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"source":"deploymentListVar","targetProperty":"dataSet"}, {}]
		    }]
		}]
	    }],
	    splitter1: ["wm.Splitter", {height: "100%", minimum: "150", maximum: "350"}],
	    editLayers: ["wm.Layers", {width: "100%", height: "100%", margin: "0,0,0,10"}, {}, {
		defaultLayer: ["wm.Layer", {padding: "30"}, {}, {
		    defaultHtml: ["wm.Html", {width: "100%", height: "100%", html: "<p>No deployment targets are selected for this project.</p><p>Click the Add button (to the left) to create a new deployment target</p><p>If there are deployment targets listed to the left, select one to begin editing</p>"}]
		}],
		editLayer: ["wm.Layer", {}, {}, {
		    editPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]},"autoScroll":true,"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", borderColor: "#525A6A", border: "2,0,2,0"}, {}, {
			settingsPanel: ["wm.FancyPanel", {"borderColor":"black","fitToContentHeight":true,"height":"166px","innerBorder":"1","labelHeight":"24","margin":"10,10,10,0","title":"Settings"}, {}, {
			    settingLayers: ["wm.Layers", {margin: "5,50,5,50", height: "100%", width: "100%"}, {}, {
				tomcatLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				    tcDeploymentNameEditor: ["wm.Text", {"border":"0","caption":"Deployment name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"New Tomcat Deployment","width":"100%", required: true}, {onchange: "deploymentNameChange"}],
				    tcDeploymentTypeEditor: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","readonly":true,"width":"100%", required: true}, {}],
				    tcHostEditor: ["wm.Text", {"border":"0","caption":"Host/IP address","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"localhost","width":"100%", required: true}, {}],
				    tcPortEditor: ["wm.Text", {"border":"0","caption":"Port","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"80","width":"100%", required: true}, {}],
				    tcNameEditor: ["wm.Text", {"border":"0","caption":"Application name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}],
				    tcUrlEditor: ["wm.Text", {"border":"0","caption":"URL","captionAlign":"left","captionSize":"140px","displayValue":"http://localhost:80/","readonly":true,"width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {"expression":"\"http://\" + ${tcHostEditor.dataValue} + \":\" + ${tcPortEditor.dataValue} + \"/\" + ${tcNameEditor.dataValue}","source":false,"targetProperty":"dataValue"}, {}]
					}]
				    }],
				    tcUserEditor: ["wm.Text", {"border":"0","caption":"User name","captionAlign":"left","captionSize":"140px","displayValue":"","width":"100%", required: true}, {}],
				    tcPasswordEditor: ["wm.Text", {"border":"0","caption":"Password","captionAlign":"left","captionSize":"140px","displayValue":"","width":"100%", required: true, password: true}, {}]
				}],
				cloudFoundryLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				    cfDeploymentNameEditor: ["wm.Text", {"border":"0","caption":"Deployment name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"New CloudFoundry Deployment","width":"100%", required: true}, {onchange: "deploymentNameChange"}],
				    cfDeploymentTypeEditor: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","readonly":true,"width":"100%"}, {}],
				    cfHostEditor: ["wm.Text", {"border":"0","caption":"CloudFoundry target","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"https://api.cloudfoundry.com","width":"100%", required: true}, {}],
				    cfNameEditor: ["wm.Text", {"border":"0","caption":"Application name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {onchange: "cloudFoundryApplicationNameChanged"}],
				    cfUrlEditor: ["wm.Text", {"border":"0","caption":"URL","captionAlign":"left","captionSize":"140px","displayValue":"http://.cloudfoundry.com/","readonly":true,"width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {"expression":"${cfHostEditor.dataValue}.replace(/\:.*$/,\"\") + \"://\" + ${cfNameEditor.dataValue} + \".\" + ${cfHostEditor.dataValue}.replace(/^.*?api\\./,\"\") + \"/\"","source":false,"targetProperty":"dataValue"}, {}]
					}]
				    }]
				}],
				appFileLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				    fileDeploymentNameEditor: ["wm.Text", {"border":"0","caption":"Deployment name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"New Generate File","width":"100%"}, {onchange: "deploymentNameChange"}],
				    appFileTypePanel: ["wm.Panel", {"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					appFileTypeLabel: ["wm.Label", {"_classes":{"domNode":["wmeditor-caption"]},"border":"0","caption":"Type","height":"100%","padding":"4","singleLine":false,"width":"140px"}, {}],
					appFileTypeRadioPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					    warRadioButton: ["wm.RadioButton", {"caption":"WAR File","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"WAR","minEditorWidth":"","width":"100%"}, {}],
					    earRadioButton: ["wm.RadioButton", {"caption":"EAR File","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"EAR","minEditorWidth":"","width":"100%"}, {}]
					}]
				    }]
				}]
			    }]
			}]
		    }]
		}]
	    }]
	}],
	buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    buttonBarMarginSpacer: ["wm.Spacer", {"height":"48px","width":"184px"}, {}],
	    deployButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Deploy Now","margin":"4","width":"120px"}, {"onclick":"deployButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"source":"editPanel.invalid","targetProperty":"disabled"}, {}]
		}]
	    }],
	    manageUndeployButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Manage CloudFoundry Apps","margin":"4","width":"200px", showing: false}, {"onclick":"manageCloudFoundryButtonClick"}],
	    buttonBarMarginSpacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
	    saveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Save","margin":"4"}, {"onclick":"saveButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"source":"editPanel.invalid","targetProperty":"disabled"}, {}]
		}]
	    }],
	    closeButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Close","margin":"4"}, {"onclick":"closeButtonClick"}],
	    buttonBarMarginSpacer3: ["wm.Spacer", {"height":"48px","width":"42px"}, {}]
	}]
    }]
};

