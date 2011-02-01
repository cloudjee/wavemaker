Main.widgets = {
	createUser: ["wm.ServiceVariable", {"operation":"createUser","service":"UserService"}, {"onSuccess":"createUserSuccess","onResult":"createUserResult"}, {
		input: ["wm.ServiceInput", {"type":"createUserInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"emailInput.dataValue","targetProperty":"email"}, {}]
			}]
		}]
	}],
	gotoResetPasswordLayer: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"resetPasswordLayer","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	gotoCreateAccountSuccessLayer: ["wm.NavigationCall", {}, {"onSuccess":"gotoCreateAccountSuccessLayerSuccess"}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"createAccountSuccessLayer","targetProperty":"layer"}, {}]
			}]
		}]
	}],
    resetPassword: ["wm.ServiceVariable", {"operation":"resetPassword","service":"UserService"}, {"onSuccess":"resetPasswordSuccess","onBeforeUpdate":"resetPasswordBeforeUpdate", onResult: "resetPasswordResult"}, {
		input: ["wm.ServiceInput", {"type":"resetPasswordInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"pwResetEmailInput.dataValue","targetProperty":"email"}, {}]
			}]
		}]
	}],
	gotoResetPasswordSuccessLayer: ["wm.NavigationCall", {}, {"onSuccess":"gotoResetPasswordSuccessLayerSuccess"}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"resetPasswordSuccessLayer","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"height":"100%"}, {}, {
		topspacer: ["wm.Spacer", {"height":"30px"}, {}],
		logoholder: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_6px"]},"height":"73px","horizontalAlign":"center","layoutKind":"left-to-right"}, {}, {
			logo: ["wm.Picture", {"border":"0","height":"100%","source":"images/wmcloudlogo.gif","width":"341px"}, {}]
		}],
		spacer1: ["wm.Spacer", {"height":"30px"}, {}],
		layers: ["wm.Layers", {"width":"100px"}, {}, {
			createAccountLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","margin":"2,0,2,0"}, {}, {
				panel1: ["wm.Panel", {"height":"294px","horizontalAlign":"center","layoutKind":"left-to-right"}, {}, {
					panel2: ["wm.Panel", {"width":"406px"}, {}, {
						label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_TextAlign_Center"]},"border":"0","caption":"Create an Account","height":"48px","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						emailInput: ["wm.Text", {"border":"0","caption":"Email","captionSize":"30%","displayValue":"","height":"20px","required":true}, {"onEnterKeyPress":"emailInputEnterKeyPress"}],
						panel3: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_4px"]},"height":"34px","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
							createAccountBtn: ["wm.Button", {"caption":"Create my account","height":"30px","width":"180px"}, {"onclick":"createAccountBtnClick"}]
						}],
						spacer2: ["wm.Spacer", {"height":"24px"}, {}],
						errorMsg: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center"]},"border":"0","height":"100%","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}]
			}],
			createAccountSuccessLayer: ["wm.Layer", {"borderColor":"","caption":"layer2","margin":"2,0,2,0"}, {}, {
				panel4: ["wm.Panel", {"height":"238px","horizontalAlign":"center","layoutKind":"left-to-right"}, {}, {
					panel5: ["wm.Panel", {"width":"398px"}, {}, {
						label2: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_TextAlign_Center"]},"border":"0","caption":"Thank You","height":"48px","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						thankYouMsg: ["wm.Html", {"border":"0","height":"100%"}, {}]
					}]
				}]
			}],
			resetPasswordLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","margin":"2,0,2,0"}, {}, {
				panel6: ["wm.Panel", {"height":"294px","horizontalAlign":"center","layoutKind":"left-to-right"}, {}, {
					panel7: ["wm.Panel", {"width":"406px"}, {}, {
						label3: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_TextAlign_Center"]},"border":"0","caption":"Reset Password","height":"48px","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						pwResetEmailInput: ["wm.Text", {"border":"0","caption":"Email","captionSize":"30%","displayValue":"","height":"20px","required":true}, {"onEnterKeyPress":"resetPassword"}],
						panel8: ["wm.Panel", {"_classes":{"domNode":["wm_Padding_4px"]},"height":"34px","horizontalAlign":"right","layoutKind":"left-to-right"}, {}, {
							resetDoneButton: ["wm.Button", {"caption":"Return to Login","height":"30px","width":"180px"}, {"onclick":"resetDoneButtonClick"}],
							resetPasswordBtn1: ["wm.Button", {"caption":"Reset my password","height":"30px","width":"180px"}, {"onclick":"resetPassword"}]
						}],
						spacer3: ["wm.Spacer", {"height":"24px"}, {}],
						pwResetErrorMsg: ["wm.Label", {"_classes":{"domNode":["wm_TextAlign_Center"]},"border":"0","height":"100%","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}]
			}],
			resetPasswordSuccessLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","margin":"2,0,2,0"}, {}, {
				panel9: ["wm.Panel", {"height":"238px","horizontalAlign":"center","layoutKind":"left-to-right","width":"100%"}, {}, {
					panel10: ["wm.Panel", {"height":"100%","width":"398px"}, {}, {
						label4: ["wm.Label", {"_classes":{"domNode":["wm_FontSize_200percent","wm_TextAlign_Center"]},"border":"0","caption":"Your Password Has Been Reset","height":"48px","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						pwResetMsg: ["wm.Label", {"border":"0","height":"100%","width":"70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel11: ["wm.Panel", {"height":"40px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"353px"}, {}, {
							resetDoneButton1: ["wm.Button", {"caption":"Return to Login","height":"34px","width":"150px"}, {"onclick":"resetDoneButtonClick"}]
						}]
					}]
				}]
			}]
		}]
	}]
}