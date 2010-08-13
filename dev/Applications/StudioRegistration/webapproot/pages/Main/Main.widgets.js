Main.widgets = {
	createUser: ["wm.ServiceVariable", {service: "UserService", operation: "createUser"}, {onSuccess: "createUserSuccess"}, {
		input: ["wm.ServiceInput", {type: "createUserInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "email", source: "emailInput.dataValue"}, {}]
			}]
		}]
	}],
	gotoResetPasswordLayer: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {type: "gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "layer", source: "resetPasswordLayer"}, {}]
			}]
		}]
	}],
	gotoCreateAccountSuccessLayer: ["wm.NavigationCall", {}, {onSuccess: "gotoCreateAccountSuccessLayerSuccess"}, {
		input: ["wm.ServiceInput", {type: "gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "layer", source: "createAccountSuccessLayer"}, {}]
			}]
		}]
	}],
	resetPassword: ["wm.ServiceVariable", {service: "UserService", operation: "resetPassword"}, {onSuccess: "resetPasswordSuccess", onBeforeUpdate: "resetPasswordBeforeUpdate"}, {
		input: ["wm.ServiceInput", {type: "resetPasswordInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "email", source: "pwResetEmailInput.dataValue"}, {}]
			}]
		}]
	}],
	gotoResetPasswordSuccessLayer: ["wm.NavigationCall", {}, {onSuccess: "gotoResetPasswordSuccessLayerSuccess"}, {
		input: ["wm.ServiceInput", {type: "gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "layer", source: "resetPasswordSuccessLayer"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {height: "100%"}, {}, {
		topspacer: ["wm.Spacer", {height: "30px"}, {}],
		logoholder: ["wm.Panel", {_classes: {domNode: ["wm_Padding_6px"]}, layoutKind: "left-to-right", horizontalAlign: "center", height: "73px"}, {}, {
			logo: ["wm.Picture", {source: "images/wmcloudlogo.gif", width: "341px", height: "100%"}, {}]
		}],
		spacer1: ["wm.Spacer", {height: "30px"}, {}],
		layers: ["wm.Layers", {width: "100px"}, {}, {
			createAccountLayer: ["wm.Layer", {caption: "layer1"}, {}, {
				panel1: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "center", height: "294px"}, {}, {
					panel2: ["wm.Panel", {width: "406px"}, {}, {
						label1: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_TextAlign_Center"]}, height: "48px", width: "70px", caption: "Create an Account"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						emailInput: ["wm.Editor", {caption: "Email", captionSize: "30%", height: "20px"}, {}, {
							editor: ["wm._TextEditor", {required: true}, {}]
						}],
						panel3: ["wm.Panel", {_classes: {domNode: ["wm_Padding_4px"]}, layoutKind: "left-to-right", horizontalAlign: "right", height: "34px"}, {}, {
							createAccountBtn: ["wm.Button", {caption: "Create my account", width: "180px", height: "30px"}, {onclick: "createAccountBtnClick"}]
						}],
						spacer2: ["wm.Spacer", {height: "24px"}, {}],
						errorMsg: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "100%", width: "70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}]
			}],
			createAccountSuccessLayer: ["wm.Layer", {caption: "layer2"}, {}, {
				panel4: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "center", height: "238px"}, {}, {
					panel5: ["wm.Panel", {width: "398px"}, {}, {
						label2: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_TextAlign_Center"]}, height: "48px", width: "70px", caption: "Thank You"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						thankYouMsg: ["wm.Html", {height: "100%"}, {}]
					}]
				}]
			}],
			resetPasswordLayer: ["wm.Layer", {caption: "layer1"}, {}, {
				panel6: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "center", height: "294px"}, {}, {
					panel7: ["wm.Panel", {width: "406px"}, {}, {
						label3: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_TextAlign_Center"]}, height: "48px", width: "70px", caption: "Reset Password"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						pwResetEmailInput: ["wm.Editor", {caption: "Email", captionSize: "30%", height: "20px"}, {}, {
							editor: ["wm._TextEditor", {required: true}, {}]
						}],
						panel8: ["wm.Panel", {_classes: {domNode: ["wm_Padding_4px"]}, layoutKind: "left-to-right", horizontalAlign: "right", height: "34px"}, {}, {
							resetDoneButton: ["wm.Button", {caption: "Return to Login", width: "180px", height: "30px"}, {onclick: "resetDoneButtonClick"}],
							resetPasswordBtn1: ["wm.Button", {caption: "Reset my password", width: "180px", height: "30px"}, {onclick: "resetPassword"}]
						}],
						spacer3: ["wm.Spacer", {height: "24px"}, {}],
						pwResetErrorMsg: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center"]}, height: "100%", width: "70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}]
			}],
			resetPasswordSuccessLayer: ["wm.Layer", {caption: "layer1"}, {}, {
				panel9: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "center", height: "238px", width: "100%"}, {}, {
					panel10: ["wm.Panel", {height: "100%", width: "398px"}, {}, {
						label4: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_TextAlign_Center"]}, height: "48px", width: "70px", caption: "Your Password Has Been Reset"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						pwResetMsg: ["wm.Label", {height: "100%", width: "70px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel11: ["wm.Panel", {layoutKind: "left-to-right", horizontalAlign: "center", height: "40px", verticalAlign: "top", width: "353px"}, {}, {
							resetDoneButton1: ["wm.Button", {caption: "Return to Login", width: "150px", height: "34px"}, {onclick: "resetDoneButtonClick"}]
						}]
					}]
				}]
			}]
		}]
	}]
}