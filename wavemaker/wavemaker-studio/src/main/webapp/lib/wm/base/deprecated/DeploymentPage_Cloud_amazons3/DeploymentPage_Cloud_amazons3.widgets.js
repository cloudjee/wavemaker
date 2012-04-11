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
 
DeploymentPage_Cloud_amazons3.widgets = {
    cloudStorageService: ["wm.JsonRpcService", {service: "cloudStorageService", sync: true}, {}],
	deploymentService: ["wm.JsonRpcService", {service: "deploymentService", sync: true}, {}],
 
    ContainerListVar: ["wm.Variable", {type: "com.wavemaker.tools.cloudmgr.CloudContainer"}, {}],
    destTypeVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Server', dataValue: 'server'}, {name: 'Storage', dataValue: 'storage'}]"}],
	serviceProviderVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Amazon', dataValue: 'amazon'}, {name: 'OpSource', dataValue: 'opsource'}, {name: 'RackSpace', dataValue: 'rackspace'}]"}],
	containerLocationVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Default', dataValue: 'default'}, {name: 'EU', dataValue: 'eu'}]"}],
	layoutBox1: ["wm.Layout", {height: "100%"}, {}, {
	MainLayers: ["wm.Layers", {width: "100%", height: "100%"}, {}, {

	    CredentialLayer: ["wm.Layer", {width: "100%", height: "100%", margin: "10", border: "3", borderColor: "#B0BDD4"}, {}, {
		stepCredentialLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Enter Amazon account information", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		CredentialLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		CredentialPanel:  ["wm.Panel", {height: "120px", width: "450px", layoutKind: "top-to-bottom"}, {}, {
		    accessKeyId: ["wm.Text", {password: 1, width: "200px", caption: "Access Key Id", captionSize: "150px", height: "20px", changeOnKey: true}, {onEnterKeyPress: "CredentialOKButtonClick"}],
		    spacer111: ["wm.Spacer", {height: "5px", width: "250px"}, {}],
		    secretAccessKey: ["wm.Text", {password: 1, width: "200px", caption: "Secret Access Key", captionSize: "150px", height: "20px",  changeOnKey: true}, {onEnterKeyPress: "CredentialOKButtonClick"}]
		}],
		spacer118: ["wm.Spacer", {height: "15px", width: "20px"}, {}],
		HelpPanel: ["wm.Panel", {height: "150px", width: "100%", layoutKind: "left-to-right"}, {}, {
			spacer337: ["wm.Spacer", {height: "5px", width: "100px"}, {}],
			helpLabel: ["wm.Html", {showing: false, height: "100%", width: "100%", singleLine: false,}],
		}],
		spacerButtonPanel1: ["wm.Spacer", {height: "100%"}],
		CredentialButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		    CredentialOKButton: ["wm.Button", {height: "48px", width: "150px", caption: "OK"}, {onclick: "CredentialOKButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","expression":"!${accessKeyId.dataValue} || !${secretAccessKey.dataValue}"}, {}]
				}]
		    }],
			//spacer382: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			CredentialBackButton: ["wm.Button", {height: "48px", width: "150px", caption: "Back to Service Provider List"}, {onclick: "CredentialBackButtonClick"}]    
		}]
		}]
	    }],

	    CreateContainerLayer: ["wm.Layer", {width: "100%", height: "100%", margin: "10", border: "3", borderColor: "#B0BDD4"}, {onShow: "setDefaultLoc"}, {
		CreateContainerLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Create Container", margin: "0,0,5,0"}],
		CreateContainerLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		    containerName: ["wm.Text", {captionSize: "110px", captionAlign: "left", caption: "Container Name", width: "100%", height: "24px", changeOnKey: true}],
			containerLocation: ["wm.SelectMenu", {captionSize: "75px", captionAlign: "left", caption: "Location", width: "100%", height: "24px", displayField: "name", dataField: "dataValue"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {targetProperty: "dataSet", source: "containerLocationVar"}, {}]
				}]
			}],
		spacerButtonPanel5: ["wm.Spacer", {height: "100%"}],
		CreateContainerButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		    CreateContainerButton: ["wm.Button", { caption: "Create", width: "150px", height: "100%"}, {onclick: "createContainerClick"}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {"targetProperty":"disabled","expression":"!${containerName.dataValue}"}, {}]
			}]
		    }],
			//spacer388: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			CreateContainerBackButton: ["wm.Button", { caption: "Back to Container List", width: "150px", height: "100%", }, {onclick: "createContainerBackClick"}]		    
		}]
		}],
	    }],

		TargetPropertiesLayer: ["wm.Layer", {width: "100%", height: "100%", margin: "10", border: "3", borderColor: "#B0BDD4"}, {onShow: "setDefaultProperties"}, {
			TargetPropertiesLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Server Properties", margin: "0,0,5,0"}],
			TargetPropertiesLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
				targetName: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Name", width: "100%", height: "24px", changeOnKey: true}],
				targetDescription: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Description", width: "100%", height: "24px", changeOnKey: true}],
				destType: ["wm.SelectMenu", {captionSize: "115px", captionAlign: "left", caption: "Destination Type", width: "100%", height: "24px", displayField: "name", dataField: "dataValue"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "destTypeVar"}, {}]
					}]
				}],
				serviceProvider: ["wm.SelectMenu", {captionSize: "115px", captionAlign: "left", caption: "Service Provider", width: "100%", height: "24px", displayField: "name", dataField: "dataValue"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "serviceProviderVar"}, {}]
					}]
				}],
				container: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Container", width: "100%", height: "24px", changeOnKey: true}],
			
				spacer389: ["wm.Spacer", {height: "8px", width: "14px"}, {}],
				overrideFlag: ["wm.CheckBoxEditor", {captionSize: "230px", captionAlign: "left", caption: "Override information if already exists?", 
					width: "100%", layoutKind: "left-to-right", displayValue: true, emptyValue: "false"}, {}, {
						editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
				}],
				
				spacerButtonPanel5: ["wm.Spacer", {height: "100%"}],
				TargetPropertiesButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", 
						verticalAlign: "top", horizontalAlign: "right"}, {}, {
					TargetPropertiesOKButton: ["wm.Button", { caption: "OK", width: "150px", height: "100%"}, 
						{onclick: "targetPropertiesOKClick"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"targetProperty":"disabled","expression":"!${targetName.dataValue} || !${targetDescription.dataValue}"}, {}]
						}]
					}],
					//spacer389: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
					TargetPropertiesBackButton: ["wm.Button", { caption: "Back to Container List", width: "150px", height: "100%", }, {onclick: "targetPropertiesBackClick"}]	
				}],
			}],
		}],
	    
		ContainerListLayer: ["wm.Layer", {width: "100%", height: "100%", margin: "10", border: "3", borderColor: "#B0BDD4"}, {}, {
		ContainerListLayerLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Container List", margin: "0,0,5,0"}],
		
		ContainerListLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		ContainerListPanel:  ["wm.Panel", {height: "255px", width: "450px", layoutKind: "top-to-bottom"}, {}, {
		    ContainerListLabel: ["wm.Label", {height: "20px", width: "100%", caption: "Choose a container"}],
		    ContainerList: ["wm.List", {toggleSelect: true, width: "100%", height: "100%",  
				dataFields: "containerName, created", 
				//columnWidths: "85px, 180px, 100px, 100px",
				headerVisible: true, border: "2", borderColor: "rgb(120,120,120)"}, {}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {targetProperty: "dataSet", source: "ContainerListVar"}, {}]
			}]
		    }],
		}],
		
		spacer383: ["wm.Spacer", {height: "85px", width: "14px"}, {}],
		ContainerListButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		    ServerListRefreshButton: ["wm.Button", { caption: "Refresh", width: "150px", height: "100%"}, {onclick: "containerListRefreshClick"}],
			//spacer358: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

			ServerListCreateButton: ["wm.Button", { caption: "Create", width: "150px", height: "100%"}, {onclick: "collectContainerBaseInfo"}],
			//spacer361: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			ContainerListTerminateButton: ["wm.Button", { caption: "Delete", width: "150px", height: "100%"}, {onclick: "deleteContainerClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","source":"ContainerList.emptySelection"}, {}]
				}]
		    }],
			//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			ContainerListDepTargetButton: ["wm.Button", { caption: "Add to Deployment Target Table", width: "150px", height: "100%"}, {onclick: "addToDepTargetClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","source":"ContainerList.emptySelection"}, {}]
				}]
		    }],
			//spacer386: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			ContainerListBackButton: ["wm.Button", { caption: "Back to Enter Credentials", width: "150px", height: "100%"}, {onclick: "containerListBackClick"}]		    
		}]
		}]
	    }]
	}]
    }]
};
