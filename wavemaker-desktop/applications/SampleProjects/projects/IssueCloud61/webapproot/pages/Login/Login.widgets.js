Login.widgets = {
	ncLogin: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layLogin","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	ncWelcome: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layWelcome","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	ncRegister: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layRegister","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	svSetTenant: ["wm.ServiceVariable", {"operation":"createTenant","service":"jsRegistration"}, {"onBeforeUpdate":"svSetTenantBeforeUpdate","onSuccess":"svSetTenantSuccess"}, {
		input: ["wm.ServiceInput", {"type":"createTenantInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"teAddress.dataValue","targetProperty":"inAddress"}, {}],
				wire1: ["wm.Wire", {"source":"teCompany.dataValue","targetProperty":"inCompName"}, {}],
				wire2: ["wm.Wire", {"source":"teEmail.dataValue","targetProperty":"inEmail"}, {}],
				wire3: ["wm.Wire", {"source":"teFirstName.dataValue","targetProperty":"inFirst"}, {}],
				wire4: ["wm.Wire", {"source":"teLastName.dataValue","targetProperty":"inLast"}, {}],
				wire5: ["wm.Wire", {"source":"tePhone.dataValue","targetProperty":"inPhone"}, {}]
			}]
		}],
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"CenteredLayout","targetProperty":"loadingDialog"}, {}]
		}]
	}],
	ncSuccess: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"laySuccess","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	svResetPass: ["wm.ServiceVariable", {"operation":"resetEmail","service":"jsRegistration"}, {"onSuccess":"ncSuccess"}, {
		input: ["wm.ServiceInput", {"type":"resetEmailInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"teResetEmail.dataValue","targetProperty":"inEmail"}, {}]
			}]
		}]
	}],
	ncReset: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layReset","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	svCheckEmail: ["wm.ServiceVariable", {"operation":"validateEmail","service":"jsUtil"}, {}, {
		input: ["wm.ServiceInput", {"type":"validateEmailInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"teEmail.dataValue","targetProperty":"inEmail"}, {}]
			}]
		}]
	}],
	lbxLogin: ["wm.Layout", {"width":"1267px"}, {}, {
		CenteredLayout: ["wm.Template", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
			contentPanel: ["wm.Panel", {"_classes":{"domNode":["wm_SilverBlueTheme_WhiteOutsetPanel"]},"border":"0,1","borderColor":"#656565","height":"700px","width":"800px"}, {}, {
				panHeader: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"0,0,3,0","borderColor":"#656565","height":"90px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
					picLogo: ["wm.Picture", {"aspect":"h","width":"400px"}, {"onclick":"picLogoClick"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":"\"resources/images/logos/IssueCloudLogo.png\"","targetProperty":"source"}, {}]
						}]
					}],
					spa2: ["wm.Spacer", {"height":"100%","width":"100%"}, {}],
					panLink: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"bottom","width":"269px"}, {}, {
						labLogin: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextAlign_Center","wm_TextDecoration_Bold"]},"align":"center","caption":"Customer Login","height":"26px","padding":"4","width":"108px"}, {"onclick":"ncLogin"}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						spacer5: ["wm.Spacer", {"height":"15px","width":"96px"}, {}]
					}]
				}],
				layMain: ["wm.Layers", {"defaultLayer":0}, {"onchange":"layMainChange"}, {
					layWelcome: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","padding":"20","verticalAlign":"top"}, {}, {
						conWelcome: ["wm.Content", {"content":"Login","height":"210px"}, {}],
						picWelcome: ["wm.Picture", {"height":"320px","width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"\"resources/images/photos/cloud_welcome.jpg\"","targetProperty":"source"}, {}]
							}]
						}]
					}],
					layLogin: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
						panLoginFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"354px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"620px"}, {}, {
							panLogin: ["wm.Panel", {"height":"288px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"559px"}, {}, {
								picLogin: ["wm.Picture", {"aspect":"h","height":"277px","width":"190\\"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":"\"resources/images/photos/cloud_login.jpg\"","targetProperty":"source"}, {}]
									}]
								}],
								loginInputPanel: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved4px","wm_Border_StyleSolid","wm_Border_Size1px","wm_Border_ColorLightGray"]},"height":"288px","padding":"10","width":"351px"}, {}, {
									loginErrorMsg: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px"]},"caption":" ","height":"50px","padding":"4","singleLine":false,"width":"215px"}, {}, {
										format: ["wm.DataFormatter", {}, {}]
									}],
									usernameInput: ["wm.Text", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Email ","captionSize":"80px","dataValue":undefined,"desktopHeight":"28px","displayValue":"","height":"28px","required":true,"width":"224px"}, {}],
									passwordInput: ["wm.Text", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Password","captionSize":"80px","dataValue":undefined,"desktopHeight":"28px","displayValue":"","height":"28px","password":true,"required":true}, {}],
									seRemember: ["wm.Checkbox", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontColor_Black"]},"caption":"Remember Username","captionAlign":"left","captionPosition":"right","captionSize":"223px","desktopHeight":"25px","displayValue":true,"height":"25px","margin":"0,0,0,80","startChecked":true,"width":"259px"}, {}],
									panLoginBtn: ["wm.Panel", {"height":"45px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										loginButton: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Login","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"loginButtonClick"}, {
											binding: ["wm.Binding", {}, {}, {
												wire: ["wm.Wire", {"expression":"\"resources/images/buttons/submit.png\"","targetProperty":"iconUrl"}, {}]
											}]
										}]
									}],
									panRegLink: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										labAccount: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Black","wm_TextAlign_Right"]},"border":"3,0,0,0","caption":"Don't have an account?","height":"100%","padding":"4","width":"143px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										labRegister: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold","wm_TextAlign_Left"]},"border":"3,0,0,0","caption":"Sign up here","height":"100%","padding":"4","width":"110px"}, {"onclick":"ncRegister"}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}],
									panResetLink: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
										labForgot: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_Black","wm_TextAlign_Right"]},"border":"3,0,0,0","caption":"Forgot your password?","height":"100%","padding":"4","width":"143px"}, {}, {
											format: ["wm.DataFormatter", {}, {}]
										}],
										labReset: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_TextDecoration_Bold","wm_TextAlign_Left"]},"border":"3,0,0,0","caption":"Reset Password","height":"100%","padding":"4","width":"110px"}, {"onclick":"ncReset"}, {
											format: ["wm.DataFormatter", {}, {}]
										}]
									}]
								}]
							}]
						}],
						content1: ["wm.Content", {"content":"GettingStarted","padding":"10","width":"620px"}, {}]
					}],
					layRegister: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
						paRegisterFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"450px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"650px"}, {}, {
							panRegTenant: ["wm.Panel", {"height":"380px","horizontalAlign":"left","padding":"20","verticalAlign":"top","width":"572px"}, {}, {
								labDetail: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_LightGray","wm_Border_StyleFirefoxCurved8px","wm_TextDecoration_Bold"]},"border":"1","borderColor":"#B1B1B1","caption":"Your details:","height":"25px","padding":"10","width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								spacer1: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								panDetail: ["wm.Panel", {"height":"55px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"530px"}, {}, {
									panDetailLeft: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										teFirstName: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"First Name:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","required":true,"width":"100%"}, {}],
										teEmail: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Email:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","required":true,"width":"100%"}, {}]
									}],
									panDetailRight: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										teLastName: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Last Name:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","required":true,"width":"100%"}, {}],
										teUsername: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"User Name:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","required":true,"showing":false,"width":"100%"}, {}]
									}]
								}],
								labRegError: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextAlign_Center"]},"height":"30px","padding":"4","width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								labCompany: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_BackgroundChromeBar_LightGray","wm_Border_StyleFirefoxCurved8px","wm_TextDecoration_Bold"]},"border":"1","borderColor":"#B1B1B1","caption":"Your company details:","height":"25px","padding":"10","width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								spacer3: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								panCompany: ["wm.Panel", {"height":"27px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"530px"}, {}, {
									panCompLeft: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										teCompany: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Company Name:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","width":"100%"}, {}]
									}],
									panCompRight: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
										tePhone: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Phone Number:","captionSize":"3px","dataValue":undefined,"desktopHeight":"25px","displayValue":"","height":"25px","width":"100%"}, {}]
									}]
								}],
								teAddress: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Company Address:","captionSize":"58px","dataValue":undefined,"desktopHeight":"80px","displayValue":"","height":"80px","width":"100%"}, {}],
								spacer4: ["wm.Spacer", {"height":"20px","width":"100%"}, {}],
								panBtn: ["wm.Panel", {"height":"35px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									btnSubmit: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Submit","height":"100%","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"svSetTenant"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":"\"resources/images/buttons/submit.png\"","targetProperty":"iconUrl"}, {}]
										}]
									}],
									btnCancel: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Cancel","height":"100%","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"ncWelcome"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":"\"resources/images/buttons/cancel.png\"","targetProperty":"iconUrl"}, {}]
										}]
									}]
								}]
							}]
						}]
					}],
					layReset: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
						panResetFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"303px","horizontalAlign":"center","verticalAlign":"middle","width":"620px"}, {}, {
							conReset: ["wm.Content", {"border":"0,0,3,0","content":"Reset","height":"151px","width":"550px"}, {}],
							spacer6: ["wm.Spacer", {"height":"20px","width":"550px"}, {}],
							panReset: ["wm.Panel", {"height":"37px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"550px"}, {}, {
								teResetEmail: ["wm.LargeTextArea", {"_classes":{"domNode":["wm_FontSizePx_12px"],"captionNode":["wm_FontSizePx_12px","wm_FontColor_Black"]},"border":"0","caption":"Email:","captionSize":"6px","dataValue":undefined,"desktopHeight":"28px","displayValue":"","height":"28px","required":true}, {}],
								btnReset: ["wm.Button", {"_classes":{"domNode":["wm_FontSizePx_12px","wm_FontColor_White","wm_BackgroundChromeBar_Graphite"]},"caption":"Reset","iconHeight":"18px","iconMargin":"0 10px 1 0","iconWidth":"20px","margin":"4","width":"90px"}, {"onclick":"svResetPass"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":"\"resources/images/buttons/update.png\"","targetProperty":"iconUrl"}, {}]
									}]
								}]
							}]
						}]
					}],
					laySuccess: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","verticalAlign":"middle"}, {}, {
						panSuccessFrame: ["wm.Panel", {"_classes":{"domNode":["wm_Border_StyleFirefoxCurved8px"]},"border":"5","height":"171px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"620px"}, {}, {
							conSuccess: ["wm.Content", {"content":"Success","height":"116px","width":"550px"}, {}]
						}]
					}]
				}],
				panFooter: ["wm.Panel", {"_classes":{"domNode":["wm_BackgroundChromeBar_LightGray"]},"border":"3,0,1,0","borderColor":"#656565","height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
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
				}]
			}]
		}]
	}]
}