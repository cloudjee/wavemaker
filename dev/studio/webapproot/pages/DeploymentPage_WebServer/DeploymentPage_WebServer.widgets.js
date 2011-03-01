/*
 * Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
DeploymentPage_WebServer.widgets = {
	cloudStorageService: ["wm.JsonRpcService", {service: "cloudStorageService", sync: true}, {}],
    S3LocList: ["wm.Variable", {type: "EntryData", json: "[ {name: \"North America\", dataValue: \"Default\" }, \n{name: \"European Union\", dataValue: \"EU\"} ]"}, {}],
    S3BucketNames: ["wm.Variable", {type: "wm.Variable"}, {}],
    EC2HostNames: ["wm.Variable", {type: "wm.Variable"}, {}],
    appsVar: ["wm.Variable", {type: "com.wavemaker.tools.deployment.AppInfo"}, {}],
    taskListVar: ["wm.Variable", {type: "wm.Variable"}],
	destTypeVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Server', dataValue: 'server'}, {name: 'Storage', dataValue: 'storage'}]"}],
	serverTypeVar: ["wm.Variable", {type: "EntryData", json: "[{name: 'Tomcat', dataValue: 'tomcat'}, {name: 'WebSphere', dataValue: 'websphere'}, {name: 'JBoss', dataValue: 'jboss'}, {name: 'WebLogic', dataValue: 'webLogic'}]"}],
	serviceProviderVar: ["wm.Variable", {type: "EntryData", 
		json: "[{name: 'Local', dataValue: 'local'}, {name: 'Amazon', dataValue: 'amazon'}, {name: 'Eucalyptus', dataValue: 'eucalyptus'}, {name: 'OpSource', dataValue: 'opsource'}, {name: 'RackSpace', dataValue: 'rackspace'}]"}],
	targetListVar: ["wm.Variable", {type: "com.wavemaker.tools.deployment.TargetInfo"}, {}],
	amFileListVar: ["wm.Variable", {type: "com.wavemaker.tools.cloudmgr.CloudFile"}, {}],
	rsFileListVar: ["wm.Variable", {type: "com.wavemaker.tools.cloudmgr.CloudFile"}, {}],

    layoutBox1: ["wm.Layout", {height: "100%", border: "3", borderColor: "#B0BDD4", margin: "10"}, {}, {
	MainLayers: ["wm.Layers", {width: "100%", height: "100%"}, {}, {
		DepTargetListLayer: ["wm.Layer", {}, {onShow: "depTargetShow"}, {
		DepTargetListLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Select the server", margin: "0,0,5,0"}],
		DepTargetListLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		DepTargetListPanel:  ["wm.Panel", {height: "100%", width: "450px", layoutKind: "top-to-bottom"}, {}, {
		    DepTargetList: ["wm.List", {toggleSelect: true, width: "100%", height: "240px",  
				dataFields: "name, description, serviceProvider, destType, container, server, port, dnsHost, publicIp",
				columnWidths: "85px, 180px, 100px, 85px, 85px, 85px, 85px, 110px, 110px",
				headerVisible: true, border: "2", borderColor: "rgb(120,120,120)"}, {}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {targetProperty: "dataSet", source: "targetListVar"}, {}]
			}]
		    }],
		}],
		spacer320: ["wm.Spacer", {height: "10px", width: "14px"}, {}],
		DepTargetListButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {

			DepTargetListRefreshButton: ["wm.Button", { caption: "Refresh", width: "150px", height: "100%"}, {onclick: "DepTargetListRefreshButtonClick"}],
			//spacer179: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			
			DepTargetListAddButton: ["wm.Button", { caption: "Add", width: "150px", height: "100%"}, {onclick: "DepTargetListAddButtonClick"}],
			//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			
			DepTargetListEditButton: ["wm.Button", { caption: "Edit", width: "150px", height: "100%"}, {onclick: "DepTargetListEditButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","source":"DepTargetList.emptySelection"}, {}]
				}]
			}],
			//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

			DepTargetListDeleteButton: ["wm.Button", { caption: "Delete", width: "150px", height: "100%"}, {onclick: "DepTargetListDeleteButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","source":"DepTargetList.emptySelection"}, {}]
				}]
			}],
			//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

			DepTargetListOKButton: ["wm.Button", { caption: "OK", width: "150px", height: "100%"}, {onclick: "DepTargetListOKButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","source":"DepTargetList.emptySelection"}, {}]
				}]
			}],
		}]
		}]
	    }],
	
		TargetPropertiesLayer: ["wm.Layer", {width: "100%", height: "100%"}, {}, {
			TargetPropertiesLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Server Properties", margin: "0,0,5,0"}],
			TargetPropertiesLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
				targetName: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Name", width: "100%", height: "24px", changeOnKey: true}],
				targetDescription: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Description", width: "100%", height: "24px", changeOnKey: true}],
				destType: ["wm.SelectMenu", {captionSize: "115px", captionAlign: "left", caption: "Destination Type", width: "100%", height: "24px", displayField: "name", dataField: "dataValue"}, 
					{onchange: "targetPropertiesDestTypeChanged"}, {
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
				serverType: ["wm.SelectMenu", {captionSize: "115px", captionAlign: "left", caption: "App Server", width: "100%", height: "24px", displayField: "name", dataField: "dataValue"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "serverTypeVar"}, {}]
					}]
				}],
				dnsHost: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Host Name", width: "100%", height: "24px", changeOnKey: true}],
				publicIP: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Public IP Address", width: "100%", height: "24px", changeOnKey: true}],
				privateIP: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Private IP Address", width: "100%", height: "24px", changeOnKey: true}],
				portNumber: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "Port", width: "100%", height: "24px", changeOnKey: true}],
				serverUser: ["wm.Text", {captionSize: "115px", captionAlign: "left", caption: "User", 
							width: "100%", height: "24px", displayValue: "", emptyValue: "", changeOnKey: true}],
				serverPassword1: ["wm.Text", {password: 1, captionSize: "115px", captionAlign: "left", caption: "Enter Password", 
							width: "100%", height: "24px", displayValue: "", emptyValue: "", changeOnKey: true}],
				serverPassword2: ["wm.Text", {password: 1, captionSize: "115px", captionAlign: "left", caption: "Confirm Password", 
							width: "100%", height: "24px", displayValue: "", emptyValue: "", changeOnKey: true}],
			
				/*spacer389: ["wm.Spacer", {height: "8px", width: "14px"}, {}],
				overrideFlag: ["wm.CheckBoxEditor", {captionSize: "200px", captionAlign: "left", caption: "Override information if already exists?", 
					width: "100%", layoutKind: "left-to-right", displayValue: true, emptyValue: "false"}, {}, {
						editor: ["wm._CheckBoxEditor", {dataType: "boolean"}, {}]
				}],*/
				
				spacerButtonPanel5: ["wm.Spacer", {height: "100%"}],
				TargetPropertiesButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", //2
						verticalAlign: "top", horizontalAlign: "right"}, {}, {
					TargetPropertiesOKButton: ["wm.Button", { caption: "OK", width: "150px", height: "100%"}, //1
						{onclick: "targetPropertiesOKClick"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"targetProperty":"disabled","expression":
							"!${destType.dataValue} || !${serviceProvider.dataValue} || !${targetName.dataValue} || !${targetDescription.dataValue}"}, {}]
						}]
					}], //1
					spacer389: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
					TargetPropertiesBackButton: ["wm.Button", { caption: "Back to Server List", width: "150px", height: "100%", }, {onclick: "targetPropertiesBackClick"}]	
				}], //2
			}] //3
		}],


	    //*************************************************************************************************************************
		DeployPropertiesLayer: ["wm.Layer", {width: "100%", height: "100%"},{}, { //***************************************************************************************** LAYER 2
		DeployPropertiesLayerLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Enter your server information", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		DeployPropertiesLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		  
			spacer335: ["wm.Spacer", {height: "20px", width: "14px"}, {}],
		    DeployPropertiesPanel: ["wm.Panel", {height: "220px", width: "100%"}, {}],
			spacer337: ["wm.Spacer", {height: "5px", width: "14px"}, {}],
			HelpPanel: ["wm.Panel", {height: "40px", width: "100%", layoutKind: "left-to-right"}, {}, {
				spacer337: ["wm.Spacer", {height: "5px", width: "200px"}, {}],
				helpLabel: ["wm.Html", {showing: false, height: "100%", width: "100%", singleLine: false}],
			}],
			spacer340: ["wm.Spacer", {height: "100%", width: "14px"}, {}],
		    deployToServerButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {			
				DeployPropertiesOKButton: ["wm.Button", {height: "100%", width: "150px", caption: "OK", /*borderColor: "rgb(60,60,60)"*/}, {onclick: "DeployPropertiesOKButtonClick"}],
				DeployPropertiesBackButton: ["wm.Button", {height: "100%", width: "150px", caption: "Back to Server List"}, {onclick: "DeployPropertiesBackButtonClick"}],
			}],
		}]
	    }],
	    appListLayer: ["wm.Layer", {},{onShow: "showAppListLayer"}, {
		appListLayerLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Deployed Applications", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		appListLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"}, {}, {
		    applist: ["wm.List", {toggleSelect: true, width: "103%", height: "100%", border: "2", borderColor: "rgb(120,120,120)", dataFields:"name,href,description", columnWidths: "150px,290px,150px"}, {onselect: "onAppListSelectionChange"}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {targetProperty: "dataSet", source: "appsVar"}, {}]
			}]
		    }],
		spacer390: ["wm.Spacer", {height: "40px", width: "14px"}, {}],
		appManagerButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
			appListRefreshButton: ["wm.Button", {height: "100%", width: "150px", caption: "Refresh"}, {onclick: "appListRefreshButtonClick"}],
			appListDeployButton: ["wm.Button", {height: "100%", width: "150px", caption: "Deploy"}, {onclick: "appListDeployButtonClick"}],
			appListRedeployButton: ["wm.Button", {height: "100%", width: "150px", caption: "Redeploy"}, {onclick: "appListRedeployButtonClick"}, {
				 binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"disabled","source":"applist.emptySelection"}, {}]
			    }]
			}],
			appListUndeployButton: ["wm.Button", {width: "150px", height: "100%", caption: "Undeploy"}, {onclick: "appListUndeployButtonClick"}, {
			    binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"disabled","source":"applist.emptySelection"}, {}]
			    }]
			}],
			appListBackButton: ["wm.Button", {height: "100%", width: "150px", caption: "Back to Enter Server Info"}, {onclick: "appListBackButtonClick"}],
		    }]
		}]
	    }],

		RSCredentialLayer: ["wm.Layer", {width: "100%", height: "100%"}, {}, {
		stepRSCredentialLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Enter RackSpace account information", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		RSCredentialLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		RSCredentialPanel:  ["wm.Panel", {height: "120px", width: "450px", layoutKind: "top-to-bottom"}, {}, {
		    rsusername: ["wm.Text", {width: "350px", caption: "Username", height: "20px", changeOnKey: true, captionSize: "20%"}, {onEnterKeyPress: "RSCredentialOKButtonClick"}],
		    spacer201: ["wm.Spacer", {height: "5px", width: "250px"}, {}],
		    rspassword: ["wm.Text", {password: 1, width: "350px", caption: "Password (API Access Key)", height: "20px",  changeOnKey: true, captionSize: "20%"}, {onEnterKeyPress: "RSCredentialOKButtonClick"}]
		}],
		space205: ["wm.Spacer", {height: "100%"}],
		RSCredentialButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		    RackSpaceCredentialOKButton: ["wm.Button", {height: "48px", width: "150px", caption: "OK"}, {onclick: "RSCredentialOKButtonClick"}, {
			binding: ["wm.Binding", {}, {}, {
			    wire: ["wm.Wire", {"targetProperty":"disabled","expression":"!${rspassword.dataValue} || !${rsusername.dataValue}"}, {}]
			}]
		    }],
			//spacer210: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			RSCredentialBackButton: ["wm.Button", {height: "48px", width: "150px", caption: "Back to Server List"}, {onclick: "RSCredentialBackButtonClick"}]    
		}]
		}]
	    }],

		RSFileListLayer: ["wm.Layer", {width: "100%", height: "100%"}, {onShow: "rsShowFiles"}, {
		RSFileListLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Select a File", margin: "0,0,5,0"}],
		RSFileListLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
			rsContainer: ["wm.Text", {captionSize: "75px", captionAlign: "left", caption: "Container", width: "100%", height: "24px", changeOnKey: true}],
			spacer695: ["wm.Spacer", {height: "16px", width: "14px"}, {}],
			RSFileListPanel:  ["wm.Panel", {height: "100%", width: "450px", layoutKind: "top-to-bottom"}, {}, {
				RSFileList: ["wm.List", {toggleSelect: true, width: "100%", height: "250px",  dataFields: "fileName, sizeString, lastModified, owner",
					headerVisible: true, border: "2", borderColor: "rgb(120,120,120)"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "rsFileListVar"}, {}]
					}]
				}],
			}],

			spacer700: ["wm.Spacer", {height: "10px", width: "14px"}, {}],
			RSFileListButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {

				RSFileListRefreshWarButton: ["wm.Button", { caption: "Refresh", width: "150px", height: "100%"}, {onclick: "RSFileListRefreshButtonClick"}],
				//spacer710: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
				
				RSFileListUploadWarButton: ["wm.Button", { caption: "Upload WAR", width: "150px", height: "100%"}, {onclick: "RSFileListUploadWarButtonClick"}],
				//spacer710: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

				RSFileListUploadEarButton: ["wm.Button", { caption: "Upload EAR", width: "150px", height: "100%"}, {onclick: "RSFileListUploadEarButtonClick"}],
				//spacer715: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
				
				//spacer720: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

				RSFileListDeleteButton: ["wm.Button", { caption: "Delete", width: "150px", height: "100%"}, {onclick: "RSFileListDeleteButtonClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"disabled","source":"RSFileList.emptySelection"}, {}]
					}]
				}],
				//spacer730: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

				RSFileListBackButton: ["wm.Button", { caption: "Back to Enter Credentials", width: "150px", height: "100%"}, {onclick: "RSFileListBackButtonClick"}, {}],
			}]
		}]
	    }],

		AMCredentialLayer: ["wm.Layer", {width: "100%", height: "100%"}, {}, {
		stepAMCredentialLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "96px", caption: "Enter Amazon account information", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		AMCredentialLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
		AMCredentialPanel:  ["wm.Panel", {height: "120px", width: "450px", layoutKind: "top-to-bottom"}, {}, {
		    accessKeyId: ["wm.Text", {password: 1, width: "200px", caption: "Access Key Id", captionSize: "150px", height: "20px", changeOnKey: true}, {onEnterKeyPress: "AMCredentialOKButtonClick"}],
		    spacer405: ["wm.Spacer", {height: "5px", width: "250px"}, {}],
		    secretAccessKey: ["wm.Text", {password: 1, width: "200px", caption: "Secret Access Key", captionSize: "150px", height: "20px",  changeOnKey: true}, {onEnterKeyPress: "AMCredentialOKButtonClick"}]
		}],
		spacer410: ["wm.Spacer", {height: "100%"}],
		AMCredentialButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
		    AMCredentialOKButton: ["wm.Button", {height: "48px", width: "150px", caption: "OK"}, {onclick: "AMCredentialOKButtonClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"targetProperty":"disabled","expression":"!${accessKeyId.dataValue} || !${secretAccessKey.dataValue}"}, {}]
				}]
		    }],
			//spacer415: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			AMCredentialBackButton: ["wm.Button", {height: "48px", width: "150px", caption: "Back to Server List"}, {onclick: "AMCredentialBackButtonClick"}]    
		}]
		}]
	    }],

		AMFileListLayer: ["wm.Layer", {width: "100%", height: "100%"}, {onShow: "amShowFiles"}, {
		AMFileListLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", caption: "Select a File", margin: "0,0,5,0"}],
		AMFileListLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6"},{}, {
			amContainer: ["wm.Text", {captionSize: "75px", captionAlign: "left", caption: "Container", width: "100%", height: "24px", changeOnKey: true}],
			spacer377: ["wm.Spacer", {height: "16px", width: "14px"}, {}],
			AMFileListPanel:  ["wm.Panel", {height: "100%", width: "450px", layoutKind: "top-to-bottom"}, {}, {
				AMFileList: ["wm.List", {toggleSelect: true, width: "100%", height: "250px",  dataFields: "fileName, sizeString, lastModified, owner",
					headerVisible: true, border: "2", borderColor: "rgb(120,120,120)"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "amFileListVar"}, {}]
					}]
				}],
			}],
			spacer320: ["wm.Spacer", {height: "10px", width: "14px"}, {}],
			AMFileListButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {

				AMFileListRefreshButton: ["wm.Button", { caption: "Refresh", width: "150px", height: "100%"}, {onclick: "AMFileListRefreshButtonClick"}],
				//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
				
				AMFileListUploadWarButton: ["wm.Button", { caption: "Upload WAR", width: "150px", height: "100%"}, {onclick: "AMFileListUploadWarButtonClick"}],
				//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
				
				AMFileListUploadEarButton: ["wm.Button", { caption: "Upload EAR", width: "150px", height: "100%"}, {onclick: "AMFileListUploadEarButtonClick"}],
				//spacer385: ["wm.Spacer", {height: "48px", width: "14px"}, {}],
			
				//spacer390: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

				AMFileListDeleteButton: ["wm.Button", { caption: "Delete", width: "150px", height: "100%"}, {onclick: "AMFileListDeleteButtonClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"targetProperty":"disabled","source":"AMFileList.emptySelection"}, {}]
					}]
				}],
				//spacer400: ["wm.Spacer", {height: "48px", width: "14px"}, {}],

				AMFileListBackButton: ["wm.Button", { caption: "Back to Enter Credentials", width: "150px", height: "100%"}, {onclick: "AMFileListBackButtonClick"}, {}],
			}]
		}]
	    }],

		contextRootLayer: ["wm.Layer", {width: "100%", height: "100%"},{onShow: "setDefaultContext"}, {
		contextRootLayerLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_14px", "DeploymentHeader"]}, height: "38px", width: "100%", 
			caption: "Context Root (path to your application on the target webserver)", margin: "0,0,5,0"}, {}, {
		    format: ["wm.DataFormatter", {}, {}]
		}],
		contextRootLayerPanel: ["wm.Panel", {height: "100%", width: "100%", margin: "6", verticalAlign: "top", horizontalAlign: "left"}, {}, {
		    contextRootPanel: ["wm.Panel", {height: "59px", width: "100%", verticalAlign: "top", horizontalAlign: "left"}, {}, {
			contextRoot: ["wm.Text", {caption: "Context Root: ", width: "100%", captionSize: "200px"}]
		    }],
		    spacer390: ["wm.Spacer", {height: "100%", width: "14px"}, {}],
		    contextRootLayerButtonPanel: ["wm.Panel", {height: "48px", width: "100%", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {			
			contextRootLayerOKButton: ["wm.Button", {height: "100%", width: "150px", caption: "OK"}, {onclick: "contextRootOKButtonClick"}],
		    contextRootLayerBackButton: ["wm.Button", {height: "100%", width: "150px", caption: "Back to Application List"}, {onclick: "contextRootBackButtonClick"}],
			}],
		    deployResultMessage: ["wm.Label", {showing: false, border: "2", color: "red", width: "100%", height: "30px"}]
		}]
	    }],

	}]
    }]
};
