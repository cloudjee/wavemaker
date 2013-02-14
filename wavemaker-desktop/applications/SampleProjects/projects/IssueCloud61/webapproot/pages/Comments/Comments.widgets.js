Comments.widgets = {
	liveIssue: ["wm.LiveVariable", {"liveSource":"com.data.Issue","autoUpdate":false,"startUpdate":false}, {"onSuccess":"liveIssueSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.iid","source":"app.vIssueId.dataValue"}, {}]
		}]
	}],
	liveComment: ["wm.LiveVariable", {"liveSource":"com.data.Comment","autoUpdate":false,"startUpdate":false}, {"onSuccess":"liveCommentSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.cid","source":"app.vCommentId.dataValue"}, {}]
		}]
	}],
	svGetID: ["wm.ServiceVariable", {"service":"securityService","operation":"getUserId","startUpdate":true}, {"onSuccess":"liveReporter"}, {
		input: ["wm.ServiceInput", {"type":"getUserIdInputs"}, {}]
	}],
	svSendMail: ["wm.ServiceVariable", {"service":"jsSendMail","operation":"initEmail"}, {"onBeforeUpdate":"svSendMailBeforeUpdate"}, {
		input: ["wm.ServiceInput", {"type":"initEmailInputs"}, {}]
	}],
	liveReporter: ["wm.LiveVariable", {"liveSource":"com.data.User","autoUpdate":false}, {"onSuccess":"liveReporterSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.uid","source":"svGetID.dataValue"}, {}]
		}]
	}],
	lbxComment: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panComments: ["wm.Panel", {"width":"1000px","height":"389px","horizontalAlign":"center","verticalAlign":"top"}, {}, {
			panHeader: ["wm.Panel", {"width":"900px","height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
				labCommentHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"height":"100%","width":"236px","caption":"Add comment for Issue:","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labIssue: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"height":"100%","width":"100%","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labSearchIssue: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_TextDecoration_Underline"]},"height":"100%","width":"150px","caption":"Return To Issue","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"labSearchIssueClick"}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panCommentFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_FontSizePx_12px"]},"width":"900px","height":"326px","horizontalAlign":"center","border":"5","padding":"20,0,0,0","verticalAlign":"top"}, {}, {
				rtComment: ["wm.RichText", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"margin":"5","readonly":true,"width":"830px"}, {}],
				spacer1: ["wm.Spacer", {"height":"20px","width":"830px"}, {}],
				lformComment: ["wm.LiveForm", {"height":"78px","horizontalAlign":"left","verticalAlign":"top","readonly":true,"width":"830px"}, {"onBeginInsert":"lformCommentBeginInsert","onCancelEdit":"lformCommentCancelEdit","onSuccess":"lformCommentSuccess","onBeginUpdate":"lformCommentBeginUpdate"}, {
					binding: ["wm.Binding", {}, {}, {
						wire1: ["wm.Wire", {"targetProperty":"dataOutput.rel2Project","source":"rel2ProjectRelatedEditor1.dataOutput","expression":undefined}, {}],
						wire2: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionReported","source":"rel2VersionReportedRelatedEditor1.dataOutput","expression":undefined}, {}],
						wire3: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionFixed","source":"rel2VersionFixedRelatedEditor1.dataOutput","expression":undefined}, {}],
						wire4: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserReported","source":"rel2UserReportedRelatedEditor1.dataOutput","expression":undefined}, {}],
						wire5: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserAssigned","source":"rel2UserAssignedRelatedEditor1.dataOutput","expression":undefined}, {}],
						wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveComment","expression":undefined}, {}],
						wire6: ["wm.Wire", {"targetProperty":"dataOutput.rel2Issue","source":"relIssue.dataOutput","expression":undefined}, {}],
						wire7: ["wm.Wire", {"targetProperty":"dataOutput.rel2User","source":"relReporter.dataOutput","expression":undefined}, {}]
					}],
					teCreateDate: ["wm.Editor", {"height":"26px","caption":"Createdate","width":"100%","display":"Date","readonly":true,"formField":"createdate","showing":false}, {}, {
						editor: ["wm._DateEditor", {}, {}]
					}],
					teDescription: ["wm.Editor", {"height":"26px","caption":"Description","width":"100%","readonly":true,"formField":"description","showing":false}, {}, {
						editor: ["wm._TextEditor", {}, {}]
					}],
					teFlag: ["wm.Editor", {"height":"26px","caption":"Flag","width":"100%","display":"Number","readonly":true,"formField":"flag","showing":false}, {}, {
						editor: ["wm._NumberEditor", {"required":true}, {}]
					}],
					relIssue: ["wm.RelatedEditor", {"formField":"rel2Issue","lock":true,"showing":false}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveComment.rel2Issue","expression":undefined}, {}],
							wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupIssue.selectedItem","expression":undefined}, {}]
						}],
						lupIssue: ["wm.Editor", {"height":"26px","caption":"Rel2Issue (lookup)","width":"100%","display":"Lookup","readonly":true,"formField":""}, {}, {
							editor: ["wm._LookupEditor", {"required":true,"displayField":"iid","lookupDisplay":"Number"}, {}, {
								format: ["wm.NumberFormatter", {}, {}]
							}]
						}]
					}],
					relReporter: ["wm.RelatedEditor", {"formField":"rel2User","lock":true,"showing":false}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveComment.rel2User","expression":undefined}, {}],
							wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupReporter.selectedItem","expression":undefined}, {}]
						}],
						lupReporter: ["wm.Editor", {"height":"26px","caption":"Rel2User (lookup)","width":"100%","display":"Lookup","readonly":true,"formField":""}, {}, {
							editor: ["wm._LookupEditor", {"required":true,"displayField":"uid","lookupDisplay":"Number"}, {}, {
								format: ["wm.NumberFormatter", {}, {}]
							}]
						}]
					}],
					panControl: ["wm.EditPanel", {"liveForm":"lformComment","savePanel":"panSave","operationPanel":"panOp","lock":false,"height":"46px"}, {}, {
						panSave: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","showing":false}, {}, {
							btnSave: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnSaveClick"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"disabled","source":"panControl.formInvalid","expression":undefined}, {}]
								}]
							}],
							btnCancel: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"panControl.cancelEdit"}]
						}],
						panOp: ["wm.Panel", {"width":"100%","height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
							btnNew: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"New","iconUrl":"resources/images/buttons/add.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"panControl.beginDataInsert"}],
							btnUpdate: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"panControl.beginDataUpdate"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"disabled","source":"panControl.formUneditable","expression":undefined}, {}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}