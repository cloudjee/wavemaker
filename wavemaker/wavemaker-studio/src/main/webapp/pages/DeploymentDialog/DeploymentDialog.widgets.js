/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
    dataServiceListService: ["wm.JsonRpcService", {service: "cloudJeeService", sync: true}, {}],
    dataServiceListVar: ["wm.Variable", {isList:1, type: "EntryData"}],
    dbTypeVar: ["wm.Variable", {"type":"BooleanData"}, {}],

    cloudJeeService: ["wm.JsonRpcService", {service: "cloudJeeService", sync: true}, {}],
    deploymentLoadingDialog: ["wm.LoadingDialog", {}],
    cloudJeeAppListDialog: ["wm.DesignableDialog", {"title":"WaveMaker Cloud Applications", _classes: {domNode: ["studiodialog"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", containerWidgetId: "mainPanel1", buttonBarId: "buttonBar5", width: "650px", height: "500px"}, {}, {
        mainPanel1: ["wm.studio.DialogMainPanel", {},{}, {
	    cloudJeeAppList: ["wm.List", {dataFields: "name", headerVisible: true, innerBorder:"1",borderColor:"black","height":"100%","width":"100%", columns:[{field:"name",show:true,title: "App Name", width:"100%"},{field:"state",show:true,title: "Status",width:"80px"}/*,{field:"services",show:true,title: "Services",width:"120%"}*/]}, {}],
        noCloudJeeAppsMessage : ["wm.Label", {"border":"0","caption":"No WaveMaker Cloud Applications are deployed for this account","padding":"4","width":"100%", "showing":false},{},{}]
	    //deleteServicesCheckbox: ["wm.Checkbox", {caption: "Delete services too?", width: "220px", captionSize: "100%", startChecked: false, helpText: "Deleting services means deleting database services that were generated for your application.  Typically you should delete these databases unless there is another application listed above that is using the database."}]
	}],
	buttonBar5: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		cloudJeeStartFromListButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Start","margin":"4"}, {"onclick":"cloudJeeStartFromListButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"expression":"Boolean(${cloudJeeAppList.emptySelection} || ${cloudJeeAppList.selectedItem.data.state} === 'STARTED' || ${cloudJeeAppList.selectedItem.data.state} === 'UNDEPLOYED')","targetProperty":"disabled"}, {}]
		}]
	    }],
	    cloudJeeStopFromListButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Stop","margin":"4"}, {"onclick":"cloudJeeStopFromListButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"expression":"Boolean(${cloudJeeAppList.emptySelection} || ${cloudJeeAppList.selectedItem.data.state} === 'STOPPED' ||  ${cloudJeeAppList.selectedItem.data.state} === 'UNDEPLOYED' || ${cloudJeeAppList.selectedItem.data.id}.search('wavemaker-studio') !== -1)","targetProperty":"disabled"}, {}]
		}]
	    }],
	    cloudJeeUndeployFromListButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Undeploy","margin":"4"}, {"onclick":"cloudJeeUndeployFromListButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"expression":"Boolean(${cloudJeeAppList.emptySelection} ||  ${cloudJeeAppList.selectedItem.data.state} === 'UNDEPLOYED')","targetProperty":"disabled"}, {}, {}]
		}]
	    }],
	    cloudJeeAppListDialogCloseButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Close","margin":"4"}, {"onclick":"cloudJeeAppListCloseButtonClick"}]
	}]
    }],

    cloudJeeLogsDialog: ["wm.DesignableDialog", {"title":"WaveMaker Cloud Server Logs", _classes: {domNode: ["studiodialog"]}, "height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%", containerWidgetId: "mainPanel5", buttonBarId: "buttonBar5", width: "650px", height: "500px"}, {}, {
        mainPanel5: ["wm.studio.DialogMainPanel", {},{}, {
        cloudJeeLogsList: ["wm.List", {dataFields: "name", headerVisible: true, innerBorder:"1",borderColor:"black","height":"100%","width":"100%", columns:[{field:"name",show:true,title: "File Name", width:"100%"},{field:"size",show:true,title: "Size",width:"100px"},{field:"state",show:true,title: "Download Link",width:"100%"}/*,{field:"services",show:true,title: "Services",width:"120%"}*/]}, {}],
        noCloudJeeLogsMessage : ["wm.Label", {"border":"0","caption":"No server logs found for this account","padding":"4","width":"100%", "showing":false},{},{}]
        //deleteServicesCheckbox: ["wm.Checkbox", {caption: "Delete services too?", width: "220px", captionSize: "100%", startChecked: false, helpText: "Deleting services means deleting database services that were generated for your application.  Typically you should delete these databases unless there is another application listed above that is using the database."}]
    }],
  	buttonBar6: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
   	    cloudJeeAppListDialogCloseButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Close","margin":"4"}, {"onclick":"cloudJeeLogsListCloseButtonClick"}]
   	}]
    }],

/*
    deploymentListPopupMenu: ["wm.PopupMenu", {"fullStructure":[{'label':'Deploy', 'onClick':"contextDeploy",'children':[]},
								{'label':'Delete','onClick':"contextDelete",'children':[]}
							       ]
					      }],
					      */
    deploymentListVar: ["wm.Variable", {type: "EntryData", isList:true}],
    confirmSaveDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, "border":"1","height":"120px","title":"Save Changes","width":"400px","containerWidgetId":"mainPanel2","buttonBarId":"buttonBar4"}, {}, {
        mainPanel2: ["wm.studio.DialogMainPanel", {autoScroll:false},{}, {
	    confirmSaveDialogHtml1: ["wm.Html", {"border":"0","height":"100%","width":"100%", html: "You have unsaved changes that will be lost; continue?", autoScroll:false}, {}]
	}],
	buttonBar4: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		saveDialogDontSaveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Don't Save","margin":"4","width":"100px"}, {}],
		spacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
	        saveDialogCancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {}],
	        saveDialogSaveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Save","margin":"4"}, {}]
	}]
    }],

    newDeploymentDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, "buttonBarId":"buttonBar","containerWidgetId":"mainPanel3",width: "400px", "height":"200px","title":"Choose Deployment Type"}, {}, {
        mainPanel3: ["wm.studio.DialogMainPanel", {autoScroll:true, layoutKind: "left-to-right"},{}, {
	    iconOrMarginPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
	    chooseDeploymentPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		chooseDeploymentLabel: ["wm.Label", {"border":"0","caption":"Choose the target for this deployment","padding":"4","width":"100%"}, {}],
		tomcatRadio: ["wm.RadioButton", {"caption":"Local  Server","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"tc","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","startChecked":true,"width":"100%"}, {onDblClick: "onNewDeployOk"}],
		/*cloudfoundryRadio: ["wm.RadioButton", {"caption":"Cloud Jee","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"cf","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","width":"100%"}, {onDblClick: "onNewDeployOk"}],*/
		cloudjeeRadio: ["wm.RadioButton", {"caption":"WaveMaker Cloud<sup style=\"font-size:8px; color:#A02727;\">&nbsp;NEW!</sup>","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"cj","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","width":"100%"}, {onDblClick: "onNewDeployOk"}],
		appfilesRadio: ["wm.RadioButton", {"caption":"Application Files (WAR/EAR)","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"files","displayValue":"","minEditorWidth":"30","radioGroup":"deploymentType","width":"100%"}, {onDblClick: "onNewDeployOk"}]
	    }]
	}],
	buttonBar1: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    cancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {onclick: "onNewDeployCancel"}],
	    okButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"OK","margin":"4"}, {onclick: "onNewDeployOk"}]
	}]
    }],
    cjLoginDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, "height":"200px","title":"WaveMaker Cloud Account","width":"400px","containerWidgetId":"mainPanel4","buttonBarId":"buttonBar2"}, {}, {
        mainPanel4: ["wm.studio.DialogMainPanel", {autoScroll:true},{}, {
	    loginMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"5,20,5,20","verticalAlign":"top","width":"100%"}, {}, {
		loginDialogInstructionLabel: ["wm.Label", {"align":"center","border":"0","caption":"Login to your WaveMaker Cloud Account","padding":"4","width":"100%"}, {}],
		loginDialogTargetEditor: ["wm.Text", {changeOnKey:1,captionSize: "150px", "emptyValue":"emptyString", "caption":"WaveMaker Cloud target","captionAlign":"left","readonly":true, "displayValue":"https://apps.mywavemaker.com","width":"100%"}, {onEnterKeyPress: "cjLogonOkButton.click"}],
		loginDialogUserEditor: ["wm.Text", {changeOnKey:1,captionSize: "150px", "emptyValue":"emptyString", "caption":"Email Id","captionAlign":"left","displayValue":"","width":"100%"}, {onEnterKeyPress: "cjLogonOkButton.click"}],
		loginDialogPasswordEditor: ["wm.Text", {changeOnKey:1,captionSize: "150px", "emptyValue":"emptyString", "caption":"Password","captionAlign":"left","displayValue":"","password":true,"width":"100%"}, {onEnterKeyPress: "cjLogonOkButton.click"}]
	    }]
	}],
	buttonBar2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
	    cloudJeeRegisterLink: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Sign Up","margin":"4", "showing":true} /*,{caption: "Sign Up", link: "https://apps.mywavemaker.com/login/signup", width: "100px", height: "100%"}*/,{onclick: "signUpDialog"}],
	    loginSpacer: ["wm.Spacer", {width: "100%"}],
	    cjLoginCancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {onclick: "cjLoginCancelClick"}],
	    cjLogonOkButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"OK","margin":"4"}, {onclick: "cjLoginOkClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"(${loginDialogTargetEditor.dataValue} === \"\" || ${loginDialogUserEditor.dataValue} === \"\" || ${loginDialogPasswordEditor.dataValue} === \"\")","targetProperty":"disabled"}, {}]
				}]
			}]
	}]
    }],
    cjSignupDialog: ["wm.DesignableDialog", {_classes: {domNode: ["studiodialog"]}, "height":"150px","title":"WaveMaker Cloud Account Sign Up","width":"400px","containerWidgetId":"mainPanel4","buttonBarId":"buttonBar2"}, {}, {
        signupmainPanel4: ["wm.studio.DialogMainPanel", {autoScroll:true},{}, {
        signupMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","margin":"5,20,5,20","verticalAlign":"top","width":"100%"}, {}, {
        signupDialogInstructionLabel: ["wm.Label", {"align":"center","border":"0","caption":"Sign Up for WaveMaker Cloud Account","padding":"4","width":"100%"}, {}],
        signupDialogUserEditor: ["wm.Text", {changeOnKey:1,captionSize: "150px", "emptyValue":"emptyString", "caption":"Email Id","captionAlign":"left","displayValue":"","width":"100%"}, {onEnterKeyPress: "cjLogonOkButton.click"}],

        }]
    }],
 	signupbuttonBar2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
 	    loginSpacer: ["wm.Spacer", {width: "100%"}],
 	    singupLoginCancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {onclick: "signupLoginCancelClick"}],
 	    signupLogonOkButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"OK","margin":"4"}, {onclick: "signupLoginOkClick"}, {
 	    binding: ["wm.Binding", {}, {}, {
        					wire: ["wm.Wire", {"expression":"( ${signupDialogUserEditor.dataValue} === \"\")","targetProperty":"disabled"}, {}]
        	}]


 	        }]
 	}]
 	}],

    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
        mainPanel5: ["wm.studio.DialogMainPanel", {autoScroll:true, layoutKind: "left-to-right"},{}, {

	    deploymentListPanel: ["wm.Panel", {_classes: {domNode: ["wmGroupBox"]},"border":"0","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"150px", margin: "0,10,0,0"}, {}, {
		listButtonPanel: ["wm.Panel", {"border":"0","height":"32px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		    addButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Add","height":"100%","margin":"2","width":"40px"}, {"onclick":"addButtonClick"}],
		    deleteButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Delete","height":"100%","margin":"2","width":"100%"}, {"onclick":"deleteButtonClick"}],
		    copyButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Copy","height":"100%","margin":"2","width":"45px"}, {"onclick":"copyButtonClick"}]
		}],
		deploymentList: ["wm.List", {_renderHiddenGrid:1,dataFields: "name", renderVisibleRowsOnly: false, headerVisible: false, innerBorder:"1",borderColor:"black","height":"100%","width":"100%"}, {onselect: "deploymentListSelect"/*, onRightClick: "deploymentListPopupMenuOpen"*/}, {
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
			settingsPanel: ["wm.FancyPanel", {"borderColor":"black","fitToContentHeight":true,"height":"180px","innerBorder":"1","labelHeight":"24","margin":"10,10,10,0","title":"Settings"}, {}, {
			    settingLayers: ["wm.Layers", {margin: "5,50,5,50", height: "100%", width: "100%", fitToContentHeight: true}, {}, {
				tomcatLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				    tcDeploymentNameEditor: ["wm.Text", {"border":"0","caption":"Deployment name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"New Tomcat Deployment","width":"100%", required: true}, {onchange: "deploymentNameChange"}],
				    tcDeploymentTypeEditor: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","readonly":true,"width":"100%", required: true}, {}],
				    tcHostEditor: ["wm.Text", {"border":"0","caption":"Host/IP address","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"localhost","width":"100%", required: true}, {}],
				    tcPortEditor: ["wm.Text", {"border":"0","caption":"Port","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"80","width":"100%", required: true}, {onchange: "portChanged"}],
				    tcNameEditor: ["wm.Text", {"border":"0","caption":"Application name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%", required: true}, {}],
				    tcUrlEditor: ["wm.Text", {"border":"0","caption":"URL","captionAlign":"left","captionSize":"140px","displayValue":"http://localhost:80/","readonly":true,"width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
						    wire: ["wm.Wire", {"expression":"\"http://\" + ${tcHostEditor.dataValue} + \":\" + ${tcPortEditor.dataValue} + \"/\" + ${tcNameEditor.dataValue}","source":false,"targetProperty":"dataValue"}, {}]
						}]
					    }],
				    tcUserEditor: ["wm.Text", {"border":"0","caption":"User name","captionAlign":"left","captionSize":"140px","displayValue":"","width":"100%", required: true}, {}],
				    tcPasswordEditor: ["wm.Text", {"border":"0","caption":"Password","captionAlign":"left","captionSize":"140px","displayValue":"","width":"100%", required: true, password: true}, {}]
				}],
				cloudJeeLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				    cjDeploymentNameEditor: ["wm.Text", {"border":"0","caption":"Deployment name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"New WaveMaker Cloud Deployment","width":"100%", required: true}, {onchange: "deploymentNameChange"}],
				    cjDeploymentTypeEditor: ["wm.Text", {"border":"0","caption":"Type","captionAlign":"left","captionSize":"140px","readonly":true,"width":"100%"}, {}],
				    cjHostEditor: ["wm.Text", {"border":"0","caption":"WaveMaker Cloud target","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"https://apps.mywavemaker.com","width":"100%","readonly":true, required: true,"showing":false}, {onchange: "cloudJeeTargetChange"}],
				    cjNameEditor: ["wm.Text", {"border":"0","caption":"Application name","captionAlign":"left","captionSize":"140px","changeOnKey":true,"displayValue":"","width":"100%","maxChars":"80", "regExp":"[a-zA-Z0-9_-]*", "invalidMessage":" Application name supports alphanumerics, _, -", required: true}, {onchange: "cloudJeeApplicationNameChanged"}],
					cjUrlpanel: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				    cjMsgEditor: ["wm.LargeTextArea", {"border":"0","caption":" ","captionPosition":"left","captionAlign":"left","captionSize":"140px","displayValue":"http://.mywavemaker.com","readonly":true,"width":"100%", required:1}, {}, {
	/*			        binding: ["wm.Binding", {}, {}, {
                        	wire: ["wm.Wire", {"expression":"\"<a href='#'>\" ${cjHostEditor.dataValue}  + \"/\" + ${cjNameEditor.dataValue} \"</a>\"","source":false,"targetProperty":"dataValue"}, {}]
                      }]
*/
				    }]//,
					//cjGetUrlbutton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"hint":"\"Generate a URL using the project name and a random number\"", "caption":"Generate URL","margin":"4,4,4,8", "width": "112px"}, {"onclick":"cjGetUrlbuttonClick"}]
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
		    wire: ["wm.Wire", {"expression":"Boolean(${editPanel.invalid} || ${dbTypeVar.dataValue} == true)","targetProperty":"disabled"}, {}]
		}]
	    }],
	    manageCloudJeeApps: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Manage WaveMaker Cloud Apps","margin":"4","width":"200px", "showing":false}, {"onclick":"manageCloudJeeButtonClick"}],
	    manageCloudJeeLogs: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"View Logs","width":"100px", "showing":false}, {"onclick":"manageCloudJeeLogsClick"}],
	    buttonBarMarginSpacer1: ["wm.Spacer", {"height":"48px","width":"100%"}, {}],
	    saveButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Save","margin":"4"}, {"onclick":"saveButtonClick"}, {
		binding: ["wm.Binding", {}, {}, {
		    wire: ["wm.Wire", {"expression":"Boolean(${editPanel.invalid})","targetProperty":"disabled"}, {}]
		}]
	    }],
	    closeButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Close","margin":"4"}, {"onclick":"closeButtonClick"}],
	    buttonBarMarginSpacer3: ["wm.Spacer", {"height":"48px","width":"42px"}, {}]
	}]
    }]
};

