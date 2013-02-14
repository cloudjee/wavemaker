Issues.widgets = {
	liveIssue: ["wm.LiveVariable", {"liveSource":"com.data.Issue","autoUpdate":false,"startUpdate":false}, {"onSuccess":"liveIssueSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.iid","source":"app.vIssueId.dataValue"}, {}]
		}]
	}],
	liveProject: ["wm.LiveVariable", {"liveSource":"com.data.Project","autoUpdate":false,"startUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}]
		}]
	}],
	liveUser: ["wm.LiveVariable", {"liveSource":"com.data.User","autoUpdate":false,"startUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}]
		}]
	}],
	liveVersion: ["wm.LiveVariable", {"liveSource":"com.data.Version","autoUpdate":false,"startUpdate":false}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire1: ["wm.Wire", {"targetProperty":"filter.flag","expression":"1"}, {}],
			wire: ["wm.Wire", {"targetProperty":"filter.rel2Project","source":"lformIssue.dataOutput.rel2Project"}, {}]
		}]
	}],
	svDeleteAllFiles: ["wm.ServiceVariable", {"service":"jsFiles","operation":"deleteAllFiles"}, {"onBeforeUpdate":"svDeleteAllFilesBeforeUpdate","onSuccess":"svDeleteAllFilesSuccess"}, {
		input: ["wm.ServiceInput", {"type":"deleteAllFilesInputs"}, {}]
	}],
	svDeleteFile: ["wm.ServiceVariable", {"service":"jsFiles","operation":"deleteFile"}, {"onBeforeUpdate":"svDeleteFileBeforeUpdate","onSuccess":"svDeleteFileSuccess"}, {
		input: ["wm.ServiceInput", {"type":"deleteFileInputs"}, {}]
	}],
	svGetFileSize: ["wm.ServiceVariable", {"service":"jsFiles","operation":"fSize"}, {"onBeforeUpdate":"svGetFileSizeBeforeUpdate","onSuccess":"svGetFileSizeSuccess"}, {
		input: ["wm.ServiceInput", {"type":"fSizeInputs"}, {}]
	}],
	svGetPrefix: ["wm.ServiceVariable", {"service":"jsUtil","operation":"retPrefix"}, {"onBeforeUpdate":"svGetPrefixBeforeUpdate","onSuccess":"svGetPrefixSuccess"}, {
		input: ["wm.ServiceInput", {"type":"retPrefixInputs"}, {}]
	}],
	svSendIssue: ["wm.ServiceVariable", {"service":"jsSendMail","operation":"initEmail"}, {"onBeforeUpdate":"svSendIssueBeforeUpdate","onSuccess":"svSendIssueSuccess"}, {
		input: ["wm.ServiceInput", {"type":"initEmailInputs"}, {}]
	}],
	lbxIssues: ["wm.Layout", {"height":"100%","width":"100%","horizontalAlign":"left","verticalAlign":"top","padding":"0"}, {}, {
		panIssues: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"center","verticalAlign":"top"}, {}, {
			panHeader: ["wm.Panel", {"width":"950px","height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
				labManageHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_20px"]},"height":"100%","width":"100%","caption":"Manage Issues:","border":"0"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labDashboard: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px","wm_TextDecoration_Underline"]},"height":"100%","width":"150px","caption":"Return to Dashboard","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"labDashboardClick"}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				labSearchIssue: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px","wm_TextDecoration_Underline"]},"height":"100%","width":"150px","caption":"Search Issues","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"labSearchIssueClick"}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panMain: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"width":"950px","height":"100%","horizontalAlign":"left","border":"5","padding":"5","verticalAlign":"top"}, {}, {
				panFields: ["wm.Panel", {"width":"100%","height":"431px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
					labelProject: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_BackgroundColor_LightGray","wm_FontColor_White"]},"height":"10px","width":"100%","border":"0"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					lformIssue: ["wm.LiveForm", {"_classes":{"domNode":["wm_FontSizePx_12px"]},"height":"419px","horizontalAlign":"left","verticalAlign":"top","readonly":true,"captionSize":"150px"}, {"onBeginUpdate":"lformIssueBeginUpdate","onUpdateData":"lformIssueUpdateData","onCancelEdit":"lformIssueCancelEdit","onBeginInsert":"lformIssueBeginInsert","onInsertData":"lformIssueInsertData","onSuccess":"lformIssueSuccess"}, {
						binding: ["wm.Binding", {}, {}, {
							wire3: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserReported","source":"relUserReported.dataOutput","expression":undefined}, {}],
							wire7: ["wm.Wire", {"targetProperty":"dataOutput.attachments","source":"attachmentsRelatedEditor1.dataOutput","expression":undefined}, {}],
							wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue","expression":undefined}, {}],
							wire5: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionReported","source":"relVersionReported.dataOutput","expression":undefined}, {}],
							wire6: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserAssigned","source":"relUserAssigned.dataOutput","expression":undefined}, {}],
							wire1: ["wm.Wire", {"targetProperty":"dataOutput.rel2Project","source":"relProject.dataOutput","expression":undefined}, {}],
							wire2: ["wm.Wire", {"targetProperty":"dataOutput.comments","source":"commentsRelatedEditor1.dataOutput","expression":undefined}, {}],
							wire4: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionFixed","source":"relVersionFixed.dataOutput","expression":undefined}, {}]
						}],
						relProject: ["wm.RelatedEditor", {"formField":"rel2Project","lock":true,"border":"0,0,1,0","captionSize":"150px","width":"447px","borderColor":"#B1B1B1"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.rel2Project","expression":undefined}, {}],
								wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupProject.selectedItem","expression":undefined}, {}]
							}],
							lupProject: ["wm.Editor", {"height":"26px","caption":"Project","width":"100%","display":"Lookup","readonly":true,"formField":"","displayValue":"Project 2","captionSize":"150px"}, {"onchange":"lupProjectChange"}, {
								editor: ["wm._LookupEditor", {"required":true,"displayField":"name","autoDataSet":false,"startUpdate":false}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveProject","expression":undefined}, {}]
									}]
								}]
							}]
						}],
						teDescription: ["wm.Editor", {"height":"26px","caption":"Description","width":"100%","readonly":true,"formField":"description","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1","showing":false}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						tePath: ["wm.Editor", {"height":"26px","caption":"Path","width":"100%","readonly":true,"formField":"path","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1","showing":false}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						panelDescribe: ["wm.Panel", {"width":"100%","height":"170px","horizontalAlign":"left","fitToContentHeight":true,"verticalAlign":"top"}, {}, {
							teSummary: ["wm.Editor", {"height":"26px","caption":"Summary","width":"100%","readonly":true,"formField":"summary","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
								editor: ["wm._TextEditor", {"required":true}, {}]
							}],
							labDescription: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_SteelBlue","wm_FontSizePx_14px","wm_TextDecoration_Bold"]},"height":"22px","width":"467px","caption":"Issue description","border":"0","borderColor":"#B1B1B1"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							rtIssue: ["wm.RichText", {"_classes":{"domNode":["wm_FontSizePx_12px"]},"height":"120px"}, {}]
						}],
						panelHide: ["wm.Panel", {"width":"100%","height":"182px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
							panel1: ["wm.Panel", {"width":"100%","height":"116px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
								panelBasic: ["wm.Panel", {"width":"100%","height":"113px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
									seIssueType: ["wm.Editor", {"height":"22px","caption":"Issuetype","width":"100%","display":"Select","readonly":true,"formField":"issuetype","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._SelectEditor", {}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vType","expression":undefined}, {}]
											}]
										}]
									}],
									sePriority: ["wm.Editor", {"height":"22px","caption":"Priority","width":"100%","display":"Select","readonly":true,"formField":"priority","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._SelectEditor", {}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vPriority","expression":undefined}, {}]
											}]
										}]
									}],
									seStatus: ["wm.Editor", {"height":"22px","caption":"Status","width":"100%","display":"Select","readonly":true,"formField":"status","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._SelectEditor", {}, {}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"targetProperty":"dataSet","source":"app.vStatus","expression":undefined}, {}]
											}]
										}]
									}],
									relVersionReported: ["wm.RelatedEditor", {"formField":"rel2VersionReported","lock":true,"border":"0,0,1,0","height":"22px","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.rel2VersionReported","expression":undefined}, {}],
											wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupVersionReported.selectedItem","expression":undefined}, {}]
										}],
										lupVersionReported: ["wm.Editor", {"height":"26px","caption":"Reported Version","width":"100%","display":"Lookup","readonly":true,"formField":"","captionSize":"150px"}, {}, {
											editor: ["wm._LookupEditor", {"displayField":"name","autoDataSet":false,"startUpdate":false}, {}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveVersion","expression":undefined}, {}]
												}]
											}]
										}]
									}],
									relVersionFixed: ["wm.RelatedEditor", {"formField":"rel2VersionFixed","lock":true,"border":"0,0,1,0","height":"22px","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.rel2VersionFixed","expression":undefined}, {}],
											wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupVersionFixed.selectedItem","expression":undefined}, {}]
										}],
										lupVersionFixed: ["wm.Editor", {"height":"26px","caption":"Fixed Version","width":"100%","display":"Lookup","readonly":true,"formField":"","captionSize":"150px"}, {}, {
											editor: ["wm._LookupEditor", {"displayField":"name","autoDataSet":false}, {}, {
												format: ["wm.NumberFormatter", {}, {}],
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveVersion","expression":undefined}, {}]
												}]
											}]
										}]
									}]
								}],
								spacer3: ["wm.Spacer", {"height":"48px","width":"20px"}, {}],
								panelAuto: ["wm.Panel", {"width":"100%","height":"113px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
									neFlag: ["wm.NumberEditor", {"caption":"Flag","readonly":true,"showing":false,"formField":"flag"}, {}, {
										editor: ["wm._NumberEditor", {"required":true}, {}]
									}],
									teIssueKey: ["wm.Editor", {"height":"22px","caption":"Issue Key","width":"100%","readonly":true,"formField":"name","border":"0,0,1,0","disabled":true,"captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._TextEditor", {}, {}]
									}],
									teCreateDate: ["wm.Editor", {"height":"22px","caption":"Createdate","width":"100%","display":"Date","readonly":true,"formField":"createdate","border":"0,0,1,0","disabled":true,"captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._DateEditor", {}, {}]
									}],
									relUserReported: ["wm.RelatedEditor", {"formField":"rel2UserReported","lock":true,"border":"0,0,1,0","height":"22px","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.rel2UserReported","expression":undefined}, {}],
											wire1: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupUserReported.selectedItem","expression":undefined}, {}]
										}],
										lupUserReported: ["wm.Editor", {"height":"26px","caption":"Reported by","width":"100%","display":"Lookup","readonly":true,"formField":"","emptyValue":"emptyString","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
											editor: ["wm._LookupEditor", {"autoDataSet":false,"startUpdate":false,"displayExpression":"${firstname} +\" \"+${lastname}"}, {}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
												}]
											}]
										}]
									}],
									relUserAssigned: ["wm.RelatedEditor", {"formField":"rel2UserAssigned","lock":true,"border":"0,0,1,0","height":"22px","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										binding: ["wm.Binding", {}, {}, {
											wire1: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.rel2UserAssigned","expression":undefined}, {}],
											wire: ["wm.Wire", {"targetProperty":"dataOutput","source":"lupUserAssigned.selectedItem","expression":undefined}, {}]
										}],
										lupUserAssigned: ["wm.Editor", {"height":"26px","caption":"Assigned to","width":"100%","display":"Lookup","readonly":true,"formField":"","captionSize":"150px","borderColor":"#F1F1F1"}, {}, {
											editor: ["wm._LookupEditor", {"autoDataSet":false,"startUpdate":false,"displayExpression":"${firstname} +\" \"+${lastname}"}, {}, {
												binding: ["wm.Binding", {}, {}, {
													wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveUser","expression":undefined}, {}]
												}]
											}]
										}]
									}],
									teCloseDate: ["wm.Editor", {"height":"22px","caption":"Closedate","width":"100%","display":"Date","readonly":true,"formField":"closedate","border":"0,0,1,0","captionSize":"150px","borderColor":"#B1B1B1"}, {}, {
										editor: ["wm._DateEditor", {}, {}]
									}]
								}]
							}],
							panAttachment: ["wm.Panel", {"width":"894px","height":"62px","horizontalAlign":"left","borderColor":"#B1B1B1","padding":"5","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
								labFileAttach: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_SteelBlue","wm_FontSizePx_14px","wm_TextDecoration_Bold"]},"height":"35px","width":"100px","caption":"Attach file","border":"0"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								spacer1: ["wm.Spacer", {"height":"48px","width":"20px"}, {}],
								panOpenDialog: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px","wm_BackgroundChromeBar_LightGray"]},"width":"300px","height":"35px","horizontalAlign":"right","borderColor":"#B1B1B1","border":"1","layoutKind":"left-to-right","lock":true,"verticalAlign":"middle"}, {}, {
									panUpload: ["wm.Panel", {"width":"230px","height":"25px","horizontalAlign":"left","verticalAlign":"top"}, {}],
									picSave: ["wm.Picture", {"height":"25px","width":"25px","aspect":"v","border":"0","source":"resources/images/buttons/save.png","showing":false}, {"onclick":"picSaveClick"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"targetProperty":"source","expression":"\"resources/images/buttons/save.png\""}, {}]
										}]
									}],
									spacer4: ["wm.Spacer", {"height":"100%","width":"20px"}, {}]
								}],
								spacer5: ["wm.Spacer", {"height":"48px","width":"20px"}, {}],
								panHolder: ["wm.Panel", {"width":"300px","height":"55px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
									panAttachHeader: ["wm.Panel", {"width":"100%","height":"30px","horizontalAlign":"left","borderColor":"#B1B1B1","border":"0,0,2,0","layoutKind":"left-to-right","lock":true,"verticalAlign":"top"}, {}, {
										labAtt: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold","wm_FontSizePx_12px"]},"height":"100%","width":"100%","caption":"Attachment:","border":"0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										labSize: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold"]},"height":"100%","width":"65px","caption":"Size:","border":"0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										labRemove: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold"]},"height":"100%","width":"65px","caption":"Remove:","border":"0"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}]
								}]
							}]
						}],
						panEditIssue: ["wm.EditPanel", {"liveForm":"lformIssue","savePanel":"panSave","operationPanel":"panOp","lock":false,"height":"34px"}, {}, {
							panSave: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","showing":false}, {}, {
								btnSave: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Save","iconUrl":"resources/images/buttons/save.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnSaveClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"disabled","source":"panEditIssue.formInvalid","expression":undefined}, {}]
									}]
								}],
								btnCancel: ["wm.Button", {"_classes":{"domNode":["wm_BackgroundChromeBar_Graphite","wm_FontColor_White","wm_FontSizePx_12px"]},"height":"100%","width":"90px","caption":"Cancel","iconUrl":"resources/images/buttons/cancel.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnCancelClick"}]
							}],
							panOp: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
								btnNew: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"New","iconUrl":"resources/images/buttons/add.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnNewClick"}],
								btnUpdate: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"height":"100%","width":"90px","caption":"Update","disabled":true,"iconUrl":"resources/images/buttons/update.png","iconWidth":"20px","iconHeight":"18px","iconMargin":"0 10px 1 0"}, {"onclick":"btnUpdateClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"disabled","source":"panEditIssue.formUneditable","expression":undefined}, {}]
									}]
								}],
								spacer2: ["wm.Spacer", {"height":"48px","width":"40px"}, {}]
							}]
						}]
					}]
				}],
				panComment: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"left","borderColor":"#B1B1B1","border":"2,0,0,0","padding":"5","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
					panCommentTable: ["wm.Panel", {"width":"100%","height":"100%","horizontalAlign":"left","verticalAlign":"top"}, {}, {
						liveComment: ["wm.LiveForm", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","readonly":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue","expression":undefined}, {}],
								wire1: ["wm.Wire", {"targetProperty":"dataOutput.rel2Project","source":"rel2ProjectRelatedEditor1.dataOutput","expression":undefined}, {}],
								wire2: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionReported","source":"rel2VersionReportedRelatedEditor1.dataOutput","expression":undefined}, {}],
								wire3: ["wm.Wire", {"targetProperty":"dataOutput.rel2VersionFixed","source":"relVersionFixed.dataOutput","expression":undefined}, {}],
								wire4: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserReported","source":"rel2UserReportedRelatedEditor1.dataOutput","expression":undefined}, {}],
								wire5: ["wm.Wire", {"targetProperty":"dataOutput.rel2UserAssigned","source":"rel2UserAssignedRelatedEditor1.dataOutput","expression":undefined}, {}],
								wire6: ["wm.Wire", {"targetProperty":"dataOutput.comments","source":"commentsRelatedEditor1.dataOutput","expression":undefined}, {}]
							}],
							commentsRelatedEditor1: ["wm.RelatedEditor", {"formField":"comments","editingMode":"readonly","height":"100%","captionSize":"50px","minHeight":100}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.comments","expression":undefined}, {}]
								}],
								grdComment: ["wm.DataGrid", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Blue"]},"border":"0"}, {"onSelectionChanged":"grdCommentSelectionChanged","onSetColumns":"grdCommentSetColumns"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"targetProperty":"dataSet","source":"liveIssue.comments","expression":undefined}, {}]
									}],
									colDescription: ["wm.DataGridColumn", {"field":"description","caption":"Comments","columnWidth":"100%"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									colReporter: ["wm.DataGridColumn", {"field":"rel2User.lastname","caption":"Reporters Name","index":1}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									colDate: ["wm.DataGridColumn", {"field":"createdate","caption":"Date","columnWidth":"100px","display":"Date","index":2}, {}, {
										format: ["wm.DateFormatter", {}, {}]
									}]
								}]
							}]
						}]
					}],
					panCommentControl: ["wm.Panel", {"width":"170px","height":"40px","horizontalAlign":"center","verticalAlign":"top"}, {}, {
						labComment: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px","wm_TextDecoration_Bold","wm_TextDecoration_Underline"]},"height":"100%","width":"194%","caption":"Attach new Comment:","border":"0","borderColor":"#B1B1B1","align":"center"}, {"onclick":"labCommentClick"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}