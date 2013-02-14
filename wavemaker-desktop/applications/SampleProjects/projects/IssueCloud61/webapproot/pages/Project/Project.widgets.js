Project.widgets = {
	liveProject: ["wm.LiveVariable", {"liveSource":"com.data.Project","autoUpdate":false}, {"onSuccess":"liveProjectSuccess"}],
	ncProject: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"layProject"}, {}]
			}]
		}]
	}],
	ncVersion: ["wm.NavigationCall", {}, {"onBeforeUpdate":"ncVersionBeforeUpdate"}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"layVersion"}, {}]
			}]
		}]
	}],
	liveVersion: ["wm.LiveVariable", {"liveSource":"com.data.Version","autoUpdate":false}, {}],
	vStatus: ["wm.Variable", {"type":"EntryData","json":"[{\n\"name\":\"Open\"\n},{\n\"name\":\"In Progress\"\n},{\n\"name\":\"Closed\"\n}]"}, {}],
	svCheckPfx: ["wm.ServiceVariable", {"service":"issuecloudv2","operation":"checkPrefix"}, {}, {
		input: ["wm.ServiceInput", {"type":"checkPrefixInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"pfx","source":"tePrefix.dataValue"}, {}]
			}]
		}]
	}],
	lbxProject: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		layMain: ["wm.Layers", {"defaultLayer":0,"height":"570px","width":"1000px"}, {}, {
			layProject: ["wm.Layer", {"caption":"project","horizontalAlign":"center","verticalAlign":"top"}, {}, {
				panProject: ["wm.Panel", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"width":"100%","height":"100%","horizontalAlign":"center","borderColor":"#B1B1B1","verticalAlign":"top"}, {}, {
					panVersionLink: ["wm.Panel", {"width":"750px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
						labProjectHeader: ["wm.Label", {"height":"100%","width":"100%","caption":"Project:","border":"0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						labVersion: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"100%","width":"150px","caption":"Manage Versions:","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"ncVersion"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					panProjectFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_FontSizePx_12px"]},"width":"750px","height":"470px","horizontalAlign":"center","border":"5","verticalAlign":"middle"}, {}, {
						liveDataProject: ["wm.LivePanel", {"verticalAlign":"top","horizontalAlign":"left","height":"400px","width":"700px","lock":true}, {}, {
							grdProject: ["wm.DataGrid", {"border":"0","height":"180px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveProject","expression":undefined}, {}]
								}],
								colName: ["wm.DataGridColumn", {"field":"name","caption":"Project Name","columnWidth":"150px"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colDescription: ["wm.DataGridColumn", {"field":"description","caption":"Project Description","columnWidth":"200px","index":1}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colPrefix: ["wm.DataGridColumn", {"field":"prefix","caption":"Issue Prefix","columnWidth":"90px","index":2}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colUrl: ["wm.DataGridColumn", {"field":"url","caption":"Url","columnWidth":"150px","index":3}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colFlag: ["wm.DataGridColumn", {"field":"flag","caption":"Show","columnWidth":"50px","display":"Number","index":4}, {}, {
									format: ["wm.NumberFormatter", {}, {}]
								}]
							}],
							lformProject: ["wm.LiveForm", {"height":"208px","horizontalAlign":"left","verticalAlign":"top","readonly":true}, {"onSuccess":"liveProject","onBeginInsert":"lformProjectBeginInsert","onCancelEdit":"lformProjectCancelEdit","onInsertData":"lformProjectInsertData"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"grdProject.selectedItem","expression":undefined}, {}]
								}],
								spacer1: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								teName: ["wm.Editor", {"height":"26px","caption":"Name","width":"100%","readonly":true,"formField":"name","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._TextEditor", {"required":true}, {}]
								}],
								teDescription: ["wm.Editor", {"height":"26px","caption":"Description","width":"100%","readonly":true,"formField":"description","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._TextEditor", {"required":true}, {}]
								}],
								tePrefix: ["wm.Editor", {"height":"26px","caption":"Prefix","width":"100%","readonly":true,"formField":"prefix","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {"onchange":"tePrefixChange"}, {
									editor: ["wm._TextEditor", {"required":true,"promptMessage":"Please use two lower case characters or one lower case character and one number","invalidMessage":"Please use two lower case characters or one lower case character and one number","maxChars":"2","regExp":"[a-z][a-z0-9]"}, {}]
								}],
								teUrl: ["wm.Editor", {"height":"26px","caption":"Url","width":"100%","readonly":true,"formField":"url","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._TextEditor", {"required":true}, {}]
								}],
								teFlag: ["wm.Editor", {"height":"26px","caption":"Showing","width":"100%","display":"CheckBox","formField":"flag","border":"0,0,1,0","displayValue":1,"emptyValue":"zero","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._CheckBoxEditor", {"dataType":"number"}, {}]
								}],
								teProjectID: ["wm.Editor", {"height":"26px","caption":"Pid","width":"100%","display":"Number","readonly":true,"formField":"pid","captionSize":"150px","showing":false}, {}, {
									editor: ["wm._NumberEditor", {"required":true}, {}]
								}],
								spacer3: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								editProjectPanel: ["wm.EditPanel", {"_classes":{"domNode":["wm_FontSizePx_12px"]},"liveForm":"lformProject","savePanel":"panSave","operationPanel":"panOp","lock":false}, {}, {
									panSave: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false}, {}, {
										labErrorPfx: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Center"]},"height":"100%","width":"100%","border":"0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										btnPSave: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnPSaveClick"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"disabled","source":"editProjectPanel.formInvalid","expression":undefined}, {}],
												wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/save.png\""}, {}]
											}]
										}],
										btnPCancel: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editProjectPanel.cancelEdit"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/cancel.png\""}, {}]
											}]
										}]
									}],
									panOp: ["wm.Panel", {"width":"100%","height":"35px","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
										btnPNew: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"New","iconUrl":"resources/images/buttons/add.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editProjectPanel.beginDataInsert"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/add.png\""}, {}]
											}]
										}],
										btnPUpdate: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"18px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editProjectPanel.beginDataUpdate"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"disabled","source":"editProjectPanel.formUneditable","expression":undefined}, {}],
												wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/update.png\""}, {}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}],
			layVersion: ["wm.Layer", {"caption":"layer1","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				panVersion: ["wm.Panel", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"width":"100%","height":"100%","horizontalAlign":"center","borderColor":"#B1B1B1","verticalAlign":"top"}, {}, {
					panProjectLink: ["wm.Panel", {"width":"750px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
						labVersionHeader: ["wm.Label", {"height":"100%","width":"100%","caption":"Versions:","border":"0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						labProject: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"100%","width":"150px","caption":"Manage Project:","border":"0","borderColor":"#B1B1B1"}, {"onclick":"ncProject"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					panVersionFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_FontSizePx_12px"]},"width":"750px","height":"470px","horizontalAlign":"center","border":"5","verticalAlign":"middle"}, {}, {
						liveDataVersion: ["wm.LivePanel", {"verticalAlign":"top","horizontalAlign":"left","height":"430px","width":"700px","lock":true}, {}, {
							grdVersion: ["wm.DataGrid", {"border":"0","height":"180px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveVersion","expression":undefined}, {}]
								}],
								colProject: ["wm.DataGridColumn", {"field":"rel2Project.name","caption":"Project","autoSize":undefined}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colDescription: ["wm.DataGridColumn", {"field":"description","caption":"Description","columnWidth":"180px","index":2}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colFlag: ["wm.DataGridColumn", {"field":"flag","caption":"Show","columnWidth":"50px","display":"Number","index":5}, {}, {
									format: ["wm.NumberFormatter", {}, {}]
								}],
								colName: ["wm.DataGridColumn", {"field":"name","caption":"Name","columnWidth":"100px","index":1}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								colReleaseDate: ["wm.DataGridColumn", {"field":"releasedate","caption":"Release Date","columnWidth":"100px","display":"Date","index":3}, {}, {
									format: ["wm.DateFormatter", {}, {}]
								}],
								colStatus: ["wm.DataGridColumn", {"field":"status","caption":"Status","columnWidth":"80px","index":4}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}]
							}],
							lformVersion: ["wm.LiveForm", {"height":"236px","horizontalAlign":"left","verticalAlign":"top","readonly":true}, {"onSuccess":"liveVersion","onBeginInsert":"lformVersionBeginInsert"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"grdVersion.selectedItem","expression":undefined}, {}],
									wire1: ["wm.Wire", {"targetProperty":"dataOutput.rel2Project","source":"relProject.dataOutput","expression":undefined}, {}],
									wire2: ["wm.Wire", {"targetProperty":"dataOutput.rel2Status","source":"rel2StatusRelatedEditor1.dataOutput","expression":undefined}, {}]
								}],
								spacer4: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								relProject: ["wm.RelatedEditor", {"formField":"rel2Project","border":"0,0,1,0","height":"28px","borderColor":"#B1B1B1"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"dataSet","source":"grdVersion.selectedItem.rel2Project","expression":undefined}, {}],
										wire1: ["wm.Wire", {"targetProperty":"dataOutput","source":"reProject.selectedItem","expression":undefined}, {}]
									}],
									reProject: ["wm.Editor", {"height":"26px","caption":"Project","width":"100%","display":"Lookup","readonly":true,"formField":"","captionSize":"200px"}, {}, {
										editor: ["wm._LookupEditor", {"required":true,"displayField":"name","autoDataSet":false}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveProject","expression":undefined}, {}]
											}]
										}]
									}]
								}],
								teVName: ["wm.Editor", {"height":"26px","caption":"Name","width":"100%","readonly":true,"formField":"name","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._TextEditor", {"required":true}, {}]
								}],
								teVDescription: ["wm.Editor", {"height":"26px","caption":"Description","width":"100%","readonly":true,"formField":"description","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._TextEditor", {}, {}]
								}],
								teVReleaseDate: ["wm.Editor", {"height":"26px","caption":"Release Date","width":"100%","display":"Date","readonly":true,"formField":"releasedate","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._DateEditor", {}, {}]
								}],
								teStatus: ["wm.Editor", {"height":"26px","caption":"Status","width":"100%","display":"Select","readonly":true,"formField":"status","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._SelectEditor", {"required":true}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"dataSet","source":"vStatus","expression":undefined}, {}]
										}]
									}]
								}],
								teVFlag: ["wm.Editor", {"height":"26px","caption":"Showing","width":"100%","display":"CheckBox","readonly":true,"formField":"flag","border":"0,0,1,0","displayValue":1,"emptyValue":"zero","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
									editor: ["wm._CheckBoxEditor", {"dataType":"number"}, {}]
								}],
								spacer2: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								editPanelVersion: ["wm.EditPanel", {"liveForm":"lformVersion","savePanel":"panVSave","operationPanel":"panVOp","lock":false}, {}, {
									panVSave: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false}, {}, {
										btnVSave: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanelVersion.saveData"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanelVersion.formInvalid","expression":undefined}, {}],
												wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/save.png\""}, {}]
											}]
										}],
										btnVCancel: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanelVersion.cancelEdit"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/cancel.png\""}, {}]
											}]
										}]
									}],
									panVOp: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
										btnVNew: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"New","iconUrl":"resources/images/buttons/add.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanelVersion.beginDataInsert"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/add.png\""}, {}]
											}]
										}],
										btnVUpdate: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanelVersion.beginDataUpdate"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanelVersion.formUneditable","expression":undefined}, {}],
												wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/update.png\""}, {}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}