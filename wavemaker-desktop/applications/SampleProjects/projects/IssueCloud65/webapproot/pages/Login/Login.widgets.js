Login.widgets = {
	phonegapCredentialStorage: ["wm.Variable", {"saveInPhonegap":true,"type":"EntryData"}, {}],
	loginVariable1: ["wm.LoginVariable", {}, {"onError":"loginFailed","onResult":"loadingDialog.hide","onSuccess":"onLoginSuccess"}, {
		input: ["wm.ServiceInput", {"type":"loginInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"usernameInput.dataValue","targetProperty":"username"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"passwordInput.dataValue","targetProperty":"password"}, {}]
			}]
		}]
	}],
	loadingDialog: ["wm.LoadingDialog", {"_classes":{"domNode":["rounded"]},"caption":"Logging in","captionWidth":"100px"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"loginInputPanel","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	layoutBox: ["wm.Layout", {}, {}, {
		desktopHeader: ["wm.Panel", {"border":"0,0,4,0","borderColor":"#a6abb9","deviceType":null,"height":"88px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"fontSize":"16px","backgroundGradient":{"direction":"vertical","startColor":"#ffffff","endColor":"#dbdee6","colorStop":28}},"verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"aspect":"h","height":"88px","source":"resources/images/IssueCloudLogo.png","width":"280px"}, {}]
		}],
		loginMainPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","padding":"10","verticalAlign":"center","width":"100%"}, {}, {
			layers1: ["wm.Layers", {}, {}, {
				layer1: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
					panel1: ["wm.Panel", {"autoScroll":true,"deviceType":null,"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						html1: ["wm.Html", {"deviceType":["desktop","tablet"],"height":"100%","html":"  <p style=\"font-family:arial; color:#000000; font-size:18px;\">Welcome to IssueCloud</p>\n  <p style=\"font-family:arial; color:#484848; font-size:16px;\">\n    This application demonstrates how to build multi-tenant cloud applications using WaveMaker.\n  </p>\n  <p style=\"font-family:arial; color:#484848; font-size:16px;\">\n    This application is hosted on Amazon EC2 and uses WaveMaker's multi-tenant \n    security to automatically enforce data isolation between companies or tenants.\n    Issuecloud demonstrates email workflow, enabling the browser back button and\n    other advanced WaveMaker techniques.\n  </p>","minDesktopHeight":15}, {}],
						panel2: ["wm.Panel", {"fitToContentHeight":true,"height":"376px","horizontalAlign":"left","verticalAlign":"top","width":"250px"}, {"onEnterKeyPress":"loginVariable1"}, {
							usernameInput: ["wm.Text", {"caption":"Username","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"desktopHeight":"58px","displayValue":"","height":"60px","mobileHeight":"60px","width":"100%"}, {}],
							passwordInput: ["wm.Text", {"caption":"Password","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"desktopHeight":"58px","displayValue":"","height":"60px","mobileHeight":"60px","password":true,"width":"100%"}, {}],
							loginButtonPanel: ["wm.Panel", {"height":"50px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"4","width":"100%"}, {}, {
								loginErrorMsg: ["wm.Label", {"align":"center","caption":" ","height":"100%","padding":"4","singleLine":false,"width":"100%"}, {}, {
									format: ["wm.DataFormatter", {}, {}]
								}],
								loginButton: ["wm.Button", {"borderColor":"#000000","caption":"Login","height":"100%","margin":"4","width":"90px"}, {"onclick":"loginButtonClick","onclick2":"loadingDialog.show","onclick3":"loginVariable1"}]
							}],
							html2: ["wm.Html", {"autoSizeHeight":true,"height":"204px","html":"Logins to Use:\n\n<ul>\n<li>username: user, password: pass (tenant = WaveMaker; role = user)</li>\n<li>username: admin, password: admin (tenant = WaveMaker; role = admin)</li>\n<li>username: user1, password: user1 (tenant = TesterCo, role = user</li></ul>\n\nTenantID indicates which company's account you have logged into; tenant","minDesktopHeight":15}, {}]
						}]
					}]
				}]
			}]
		}],
		label1: ["wm.Label", {"align":"center","caption":"Copyright 2013 VMware. Built with WaveMaker 6.5","padding":"4","styles":{"backgroundColor":"","color":"#aaaaaa","backgroundGradient":{"direction":"vertical","startColor":"#000000","endColor":"#6c6e77","colorStop":77}},"width":"100%"}, {}]
	}]
}