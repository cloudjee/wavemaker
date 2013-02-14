Main.widgets = {
	svGetRole: ["wm.ServiceVariable", {"operation":"getUserRoles","service":"securityService","startUpdate":true}, {"onResult":"svGetRoleResult"}, {
		input: ["wm.ServiceInput", {"type":"getUserRolesInputs"}, {}]
	}],
	ncMyAccount: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"MAccount\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncHome: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Chart\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncProject: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Project\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncUAccount: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"UAccount\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncIssue: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Issue\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncIssues: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Issues\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	ncComment: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"Comments\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	svGetInvolved: ["wm.ServiceVariable", {"operation":"getInvolved","service":"jsSendMail"}, {}, {
		input: ["wm.ServiceInput", {"type":"getInvolvedInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"inID"}, {}]
			}]
		}]
	}],
	svGetMails: ["wm.ServiceVariable", {"operation":"getInvolved","service":"jsSendMail"}, {}, {
		input: ["wm.ServiceInput", {"type":"getInvolvedInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"issueid"}, {}],
				wire1: ["wm.Wire", {"source":"teInvolved.dataValue","targetProperty":"inID"}, {}]
			}]
		}]
	}],
	navigationCall1: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":"\"IssuesV2\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	navigationCall2: ["wm.NavigationCall", {"operation":"gotoPageContainerPage"}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoPageContainerPageInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pcPages","targetProperty":"pageContainer"}, {}],
				wire1: ["wm.Wire", {"expression":"\"IssueMain\"","targetProperty":"pageName"}, {}]
			}]
		}]
	}],
	lbxHome: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		CenteredLayout: ["wm.Template", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
			contentPanel: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteOutsetPanel"]},"borderColor":"#B8B8B8","height":"100%","horizontalAlign":"center","width":"100%"}, {}, {
				panHeader: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0,0,3,0","borderColor":"#656565","height":"80px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					picLogo: ["wm.Picture", {"aspect":"h","height":"88px","width":"343px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"resources/images/logos/IssueCloudLogo.png\"","targetProperty":"source"}, {}]
						}]
					}],
					spa2: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
					panControl: ["wm.Panel", {"height":"95px","horizontalAlign":"left","verticalAlign":"top","width":"620px"}, {}, {
						spacer4: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
						panLinks: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"165%"}, {}, {
							labHome: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,1","borderColor":"#B1B1B1","caption":"Home","height":"100%","padding":"4","width":"100px"}, {"onclick":"labHomeClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							labMyAccount: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"My Account","height":"100%","padding":"4","width":"100px"}, {"onclick":"labMyAccountClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							labUserAccount: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"User Account","height":"100%","padding":"4","width":"100px"}, {"onclick":"labUserAccountClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							labProject: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Project","height":"100%","padding":"4","width":"100px"}, {"onclick":"labProjectClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							labIssue: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Issue","height":"100%","padding":"4","width":"100px"}, {"onclick":"labIssueClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							labLogout: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center","wm_FontSizePx_14px"]},"align":"center","border":"0,1,0,0","borderColor":"#B1B1B1","caption":"Logout","height":"100%","padding":"4","width":"100%"}, {"onclick":"labLogoutClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							spacer1: ["wm.Spacer", {"height":"100%","width":"20px"}, {}]
						}]
					}]
				}],
				panel1: ["wm.Panel", {"autoScroll":true,"height":"800px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"1000px"}, {}, {
					pcPages: ["wm.PageContainer", {"pageName":"Chart","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
				}],
				panFooter: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"3,0,0,0","borderColor":"#656565","height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","lock":true,"verticalAlign":"middle","width":"100%"}, {}, {
					labFooter: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Right","wm_FontColor_Graphite"]},"caption":"Copyright 2010 WaveMaker, Inc.","height":"20px","padding":"4","width":"186px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					picIcon: ["wm.Picture", {"aspect":"v","height":"20px","width":"20px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"resources/images/logos/WaveMaker.ico\"","targetProperty":"source"}, {}]
						}]
					}],
					labVersion: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Graphite","wm_TextAlign_Left"]},"caption":"Version Beta 1.07","height":"20px","padding":"4","width":"120px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panRest: ["wm.Panel", {"borderColor":"#B8B8B8","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}]
			}]
		}]
	}]
}