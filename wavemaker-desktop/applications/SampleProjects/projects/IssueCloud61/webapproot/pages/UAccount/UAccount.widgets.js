UAccount.widgets = {
	liveUser: ["wm.LiveVariable", {"liveSource":"com.data.User","autoUpdate":false}, {"onSuccess":"liveUserSuccess"}],
	vRole: ["wm.Variable", {"type":"EntryData","json":"[{name: 'admin', id:0},{name: 'user', id:1}]"}, {}],
	svGetPass: ["wm.ServiceVariable", {"service":"jsPassGenerator","operation":"generate","startUpdate":true}, {"onBeforeUpdate":"svGetPassBeforeUpdate","onSuccess":"svGetPassSuccess"}, {
		input: ["wm.ServiceInput", {"type":"generateInputs"}, {}]
	}],
	svCheckEmail: ["wm.ServiceVariable", {"service":"jsUtil","operation":"retEmail"}, {"onSuccess":"svCheckEmailSuccess"}, {
		input: ["wm.ServiceInput", {"type":"retEmailInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"inEmail","source":"teEmail.dataValue"}, {}]
			}]
		}]
	}],
	svValidateEmail: ["wm.ServiceVariable", {"service":"jsUtil","operation":"validateEmail"}, {"onSuccess":"svValidateEmailSuccess"}, {
		input: ["wm.ServiceInput", {"type":"validateEmailInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"targetProperty":"inEmail","source":"teEmail.dataValue"}, {}]
			}]
		}]
	}],
	svSendMail: ["wm.ServiceVariable", {"service":"jsSendMail","operation":"sendEmailNotification"}, {"onBeforeUpdate":"svSendMailBeforeUpdate","onSuccess":"svSendMailSuccess"}, {
		input: ["wm.ServiceInput", {"type":"sendEmailNotificationInputs"}, {}]
	}],
	lbxUAccount: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panProject: ["wm.Panel", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"width":"1000px","height":"600px","horizontalAlign":"center","borderColor":"#B1B1B1","verticalAlign":"top"}, {}, {
			panUserAccounts: ["wm.Panel", {"width":"800px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
				labUserAccounts: ["wm.Label", {"height":"100%","width":"100%","caption":"User Accounts","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panUAccountFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_FontSizePx_12px"]},"width":"800px","height":"460px","horizontalAlign":"center","border":"5","verticalAlign":"middle"}, {}, {
				liveDataUAccount: ["wm.LivePanel", {"verticalAlign":"top","horizontalAlign":"left","height":"425px","width":"700px"}, {}, {
					grdUAccount: ["wm.DataGrid", {"border":"0","height":"180px"}, {"onSelected":"grdUAccountSelected"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
						}],
						colFirstname: ["wm.DataGridColumn", {"field":"firstname","caption":"First Name","columnWidth":"97px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						colLastname: ["wm.DataGridColumn", {"field":"lastname","caption":"Last Name","columnWidth":"102px","index":1}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						colEmail: ["wm.DataGridColumn", {"field":"email","caption":"Username","columnWidth":"185px","index":2}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						colRole: ["wm.DataGridColumn", {"field":"role","caption":"Role","columnWidth":"70px","index":4}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						colFlag: ["wm.DataGridColumn", {"field":"flag","caption":"Show","columnWidth":"60px","display":"Number","index":6}, {}, {
							format: ["wm.NumberFormatter", {}, {}]
						}],
						column1: ["wm.DataGridColumn", {"field":"createdate","caption":"Create Date","display":"Date","index":3}, {}, {
							format: ["wm.DateFormatter", {}, {}]
						}],
						User_Id: ["wm.DataGridColumn", {"field":"uid","caption":"User Id","columnWidth":"69px","display":"Number","index":5}, {}, {
							format: ["wm.NumberFormatter", {}, {}]
						}]
					}],
					lformUAccount: ["wm.LiveForm", {"height":"245px","horizontalAlign":"left","verticalAlign":"top","readonly":true}, {"onSuccess":"lformUAccountSuccess","onBeginInsert":"lformUAccountBeginInsert"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"targetProperty":"dataSet","source":"grdUAccount.selectedItem","expression":undefined}, {}]
						}],
						spacer1: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
						teCreateDate: ["wm.Editor", {"height":"26px","caption":"Createdate","width":"100%","display":"Date","readonly":true,"formField":"createdate","border":"0,0,1,0","disabled":true,"captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
							editor: ["wm._DateEditor", {"required":true}, {}]
						}],
						teFirstName: ["wm.Editor", {"height":"26px","caption":"Firstname","width":"100%","readonly":true,"formField":"firstname","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						teLastName: ["wm.Editor", {"height":"26px","caption":"Lastname","width":"100%","readonly":true,"formField":"lastname","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						teEmail: ["wm.Editor", {"height":"26px","caption":"Email ","width":"100%","readonly":true,"formField":"email","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {"onfocus":"teEmailFocus"}, {
							editor: ["wm._TextEditor", {"required":true}, {}]
						}],
						seRole: ["wm.Editor", {"height":"26px","caption":"Role","width":"100%","display":"Select","readonly":true,"formField":"role","border":"0,0,1,0","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
							editor: ["wm._SelectEditor", {}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"vRole","expression":undefined}, {}]
								}]
							}]
						}],
						teFlag: ["wm.Editor", {"height":"26px","caption":"Showing","width":"100%","display":"CheckBox","readonly":true,"formField":"flag","border":"0,0,1,0","displayValue":1,"emptyValue":"zero","captionSize":"200px","borderColor":"#B1B1B1"}, {}, {
							editor: ["wm._CheckBoxEditor", {"dataType":"number"}, {}]
						}],
						tePass: ["wm.Editor", {"height":"26px","caption":"Password","width":"100%","readonly":true,"formField":"password","showing":false}, {}, {
							editor: ["wm._TextEditor", {"required":true}, {}]
						}],
						teUserName: ["wm.Editor", {"height":"26px","caption":"Username","width":"100%","readonly":true,"formField":"username","showing":false}, {}, {
							editor: ["wm._TextEditor", {"required":true}, {}]
						}],
						labError: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Center"]},"height":"25px","width":"100%","border":"0"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						editPanel: ["wm.EditPanel", {"liveForm":"lformUAccount","savePanel":"savePanel1","operationPanel":"operationPanel1","lock":false}, {}, {
							savePanel1: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false}, {}, {
								btnSave: ["wm.Button", {"_classes":{"domNode":["wm_FontColor_White","wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"svValidateEmail"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel.formInvalid","expression":undefined}, {}],
										wire1: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/save.png\""}, {}]
									}]
								}],
								btnCancel: ["wm.Button", {"_classes":{"domNode":["wm_FontColor_White","wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnCancelClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/cancel.png\""}, {}]
									}]
								}]
							}],
							operationPanel1: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
								btnNew: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite","wm_FontColor_White"]},"height":"100%","width":"90px","caption":"New","iconUrl":"resources/images/buttons/add.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnNewClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"iconUrl","expression":"\"resources/images/buttons/add.png\""}, {}]
									}]
								}],
								btnUpdate: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_Graphite","wm_FontColor_White"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"editPanel.beginDataUpdate"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"disabled","source":"editPanel.formUneditable","expression":undefined}, {}],
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
}