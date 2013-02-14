MAccount.widgets = {
	svGetUser: ["wm.ServiceVariable", {"service":"securityService","operation":"getUserId","startUpdate":true}, {"onSuccess":"liveUser"}, {
		input: ["wm.ServiceInput", {"type":"getUserIdInputs"}, {}]
	}],
	ncUserDetail: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"layUserDetail"}, {}]
			}]
		}]
	}],
	ncTenantDetail: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"layer","source":"layTenentDetail"}, {}]
			}]
		}]
	}],
	liveTenant: ["wm.LiveVariable", {"liveSource":"com.data.Tenant","autoUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.tid","source":"liveUser.tid"}, {}]
		}]
	}],
	liveUser: ["wm.LiveVariable", {"liveSource":"com.data.User","autoUpdate":false,"startUpdate":false}, {"onSuccess":"liveUserSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.uid","source":"svGetUser.dataValue"}, {}]
		}]
	}],
	lbxMAccount: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		layMain: ["wm.Layers", {"height":"430px","width":"1000px"}, {}, {
			layUserDetail: ["wm.Layer", {"caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
				panDetail: ["wm.Panel", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"width":"100%","height":"100%","horizontalAlign":"center","borderColor":"#B1B1B1","verticalAlign":"top"}, {}, {
					panControl: ["wm.Panel", {"width":"650px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
						labMyAccount: ["wm.Label", {"height":"100%","width":"100%","caption":"Account Details:","border":"0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						labTenantDetail: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"100%","width":"194px","caption":"Change Tenant Details:","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"ncTenantDetail"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					panMyAccountFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"width":"650px","height":"300px","horizontalAlign":"center","border":"5","verticalAlign":"middle"}, {}, {
						lformMyAccount: ["wm.LiveForm", {"height":"222px","horizontalAlign":"left","verticalAlign":"top","readonly":true,"width":"557px"}, {"onSuccess":"lformMyAccountSuccess"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
							}],
							createdateEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Createdate","width":"100%","display":"Date","readonly":true,"formField":"createdate","border":"0,0,1,0","disabled":true,"captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._DateEditor", {"editorBorder":false}, {}]
							}],
							firstnameEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Firstname","width":"100%","readonly":true,"formField":"firstname","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							lastnameEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Lastname","width":"100%","readonly":true,"formField":"lastname","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							emailEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Email","width":"100%","readonly":true,"formField":"email","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {"required":true}, {}]
							}],
							usernameEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Username","width":"100%","readonly":true,"formField":"username","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1","showing":false}, {}, {
								editor: ["wm._TextEditor", {"required":true}, {}]
							}],
							passwordEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Password","width":"100%","readonly":true,"formField":"password","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {"required":true,"password":true}, {}]
							}],
							flagEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Flag","width":"100%","display":"Number","readonly":true,"formField":"flag","showing":false}, {}, {
								editor: ["wm._NumberEditor", {"required":true}, {}]
							}],
							roleEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Role","width":"100%","readonly":true,"formField":"role","showing":false}, {}, {
								editor: ["wm._TextEditor", {"required":true}, {}]
							}],
							uidEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Uid","width":"100%","display":"Number","readonly":true,"formField":"uid","showing":false}, {}, {
								editor: ["wm._NumberEditor", {"required":true}, {}]
							}],
							spacer1: ["wm.Spacer", {"height":"30px","width":"100%"}, {}],
							editPanel1: ["wm.EditPanel", {"liveForm":"lformMyAccount","savePanel":"savePanel1","operationPanel":"operationPanel1","lock":false}, {}, {
								savePanel1: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false}, {}, {
									btnASave: ["wm.Button", {"_classes":{"domNode":["wm_FontColor_White","wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel1.saveData"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel1.formInvalid","expression":undefined}, {}],
											wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/save.png\""}, {}]
										}]
									}],
									btnACancel: ["wm.Button", {"_classes":{"domNode":["wm_FontColor_White","wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel1.cancelEdit"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/cancel.png\""}, {}]
										}]
									}]
								}],
								operationPanel1: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
									btnAUpdate: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontSizePx_12px","wm_FontColor_White"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel1.beginDataUpdate"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel1.formUneditable","expression":undefined}, {}],
											wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/update.png\""}, {}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}],
			layTenentDetail: ["wm.Layer", {"caption":"layer1","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				panTenantDetail: ["wm.Panel", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"width":"100%","height":"100%","horizontalAlign":"center","borderColor":"#B1B1B1","verticalAlign":"top"}, {}, {
					panControl1: ["wm.Panel", {"width":"650px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
						labTenant: ["wm.Label", {"height":"100%","width":"100%","caption":"Tenant Details:","border":"0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						labUserDetail: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"height":"100%","width":"194px","caption":"Change Account Details:","border":"0","borderColor":"#B1B1B1"}, {"onclick":"ncUserDetail"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}],
					panTenantFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"width":"650px","height":"300px","horizontalAlign":"center","border":"5","verticalAlign":"middle"}, {}, {
						lformTenant: ["wm.LiveForm", {"height":"250px","horizontalAlign":"left","verticalAlign":"top","readonly":true,"width":"557px","lock":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveTenant","expression":undefined}, {}]
							}],
							createdateEditor2: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Createdate","width":"100%","display":"Date","readonly":true,"formField":"createdate","border":"0,0,1,0","disabled":true,"captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._DateEditor", {"editorBorder":false}, {}]
							}],
							accountnumberEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Accountnumber","width":"100%","display":"Number","readonly":true,"formField":"accountnumber","border":"0,0,1,0","disabled":true,"captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._NumberEditor", {"editorBorder":false}, {}]
							}],
							addressEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"55px","caption":"Address","width":"100%","readonly":true,"formField":"address","border":"0,0,1,0","captionSize":"150px","singleLine":false,"borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							billcodeEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Billcode","width":"100%","readonly":true,"formField":"billcode","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							companynameEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Companyname","width":"100%","readonly":true,"formField":"companyname","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							flagEditor2: ["wm.Editor", {"height":"26px","caption":"Flag","width":"100%","display":"Number","readonly":true,"formField":"flag","showing":false}, {}, {
								editor: ["wm._NumberEditor", {"required":true}, {}]
							}],
							phoneEditor1: ["wm.Editor", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px"]},"height":"26px","caption":"Phone","width":"100%","readonly":true,"formField":"phone","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {}, {}]
							}],
							tidEditor1: ["wm.Editor", {"height":"26px","caption":"Tid","width":"100%","display":"Number","readonly":true,"formField":"tid","showing":false}, {}, {
								editor: ["wm._NumberEditor", {"required":true}, {}]
							}],
							spacer2: ["wm.Spacer", {"height":"30px","width":"100%"}, {}],
							editPanel2: ["wm.EditPanel", {"liveForm":"lformTenant","savePanel":"savePanel2","operationPanel":"operationPanel2","lock":false,"height":"35px"}, {}, {
								savePanel2: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false}, {}, {
									btnTSave: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel2.saveData"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel2.formInvalid","expression":undefined}, {}],
											wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/save.png\""}, {}]
										}]
									}],
									btnTCancel: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel2.cancelEdit"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/cancel.png\""}, {}]
										}]
									}]
								}],
								operationPanel2: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
									btnTUpdate: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Update","iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel2.beginDataUpdate"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel2.formUneditable","expression":undefined}, {}],
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
}