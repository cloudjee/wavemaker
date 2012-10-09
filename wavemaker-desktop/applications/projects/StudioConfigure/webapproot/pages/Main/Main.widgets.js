Main.widgets = {
	downloadAndInstallServiceVar: ["wm.ServiceVariable", {"operation":"DownloadPackages","service":"InstallService"}, {"onError":"downloadAndInstallServiceVarError","onSuccess":"downloadAndInstallServiceVarSuccess"}, {
		input: ["wm.ServiceInput", {"type":"DownloadPackagesInputs"}, {}]
	}],
	gotoMainLayer: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layer1","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	loadingDialog1: ["wm.LoadingDialog", {"caption":"Installing","captionWidth":"200px"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"downloadAndInstallServiceVar","targetProperty":"serviceVariableToTrack"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"downloadButton","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	layoutBox: ["wm.Layout", {"horizontalAlign":"center"}, {}, {
		panel5: ["wm.Panel", {"_classes":{"domNode":["wm_Attribution_new"]},"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"266px"}, {}],
		loginMainPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","padding":"20","verticalAlign":"middle","width":"100%"}, {}, {
			wmTitle: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold"]},"align":"center","caption":"Complete Installation","height":"29px","padding":"4","styles":{"color":"#ffffff"},"width":"350px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			loginInputPanel: ["wm.EmphasizedContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px"]},"border":"2","height":"350px","horizontalAlign":"center","verticalAlign":"center","width":"948px"}, {}, {
				layers1: ["wm.Layers", {"margin":"20","transition":"fade"}, {}, {
					layer1: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"right","verticalAlign":"top"}, {}, {
						html2: ["wm.Html", {"autoScroll":false,"height":"119px","html":"<p>NOTE: If it takes more than a minute for the install button to run, click on \"Proxy Problems?\" next to the Download button.</p><p>WaveMaker has identified missing system requirements.  These dependencies can be resolved by downloading the WaveMaker System Requirements Bundle.  The WaveMaker System Requirements Bundle includes open source packages.  Your use of the WaveMaker System Requirements Bundle is subject to open source license(s). \n</p><p>\n<a target=\"_blank\" href=\"https://raw.github.com/wavemaker/WaveMaker-LGPL-Resources-6-4/6.5/license.txt\">View Licenses</a>\n</p>\n","margin":"0,20","minDesktopHeight":15}, {}],
						panel6: ["wm.Panel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,80","verticalAlign":"middle","width":"100%"}, {}, {
							licenseCheckbox: ["wm.RadioButton", {"_classes":{"domNode":["StudioEditor"]},"caption":"I accept these licenses","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"yes","desktopHeight":"35px","displayValue":"","groupValue":true,"height":"35px","radioGroup":"license","width":"100%"}, {}],
							licenseCheckbox1: ["wm.RadioButton", {"_classes":{"domNode":["StudioEditor"]},"caption":"I do not accept these licenses","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":"no","desktopHeight":"35px","displayValue":"","groupValue":true,"height":"35px","radioGroup":"license","width":"100%"}, {"onchange":"licenseCheckbox1Change"}]
						}],
						panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"!${licenseCheckbox.checked}","targetProperty":"disabled"}, {}]
							}],
							spacer1: ["wm.Spacer", {"height":"48px","width":"328px"}, {}],
							downloadButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Download and Install","desktopHeight":"34px","height":"34px","margin":"4","width":"200px"}, {"onclick":"downloadAndInstallServiceVar"}],
							manualLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_White"]},"align":"right","caption":"Proxy Problems?","link":"#","padding":"4","width":"100%"}, {"onclick":"manualLabelClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					fileUploadLayer: ["wm.Layer", {"borderColor":"","caption":"layer2","horizontalAlign":"left","verticalAlign":"top"}, {}, {
						label2: ["wm.Label", {"border":"2","borderColor":"#ff0000","caption":"There is a connection problem.  Typically this means you are either not connected to the network or there is a firewall blocking access.  To work around firewall issues, please use the buttons below to complete installation","height":"54px","padding":"4","singleLine":false,"width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						bypassFirewallLabel: ["wm.Label", {"caption":"If firewalls are keeping the installation from completing, you can use the buttons below to bypass these problems","padding":"4","showing":false,"width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel1: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label3: ["wm.Label", {"caption":"Step 1: Download the zip file","height":"100%","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							downloadZipButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Download","margin":"4","width":"130px"}, {"onclick":"downloadZipButtonClick"}]
						}],
						panel2: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label4: ["wm.Label", {"caption":"Step 2: Upload the zip into studio","height":"100%","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							dojoFileUpload1: ["wm.DojoFileUpload", {"_classes":{"domNode":["StudioButton"]},"border":"1","borderColor":"#ABB8CF","height":"100%","margin":"4","operation":"uploadPackage","service":"InstallService","useList":false,"width":"130px"}, {"onError":"dojoFileUpload1Error","onSuccess":"dojoFileUpload1Success"}, {
								input1: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}],
								input2: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}],
								input3: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}],
								input: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}]
							}]
						}],
						panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							autoLabel: ["wm.Label", {"align":"left","caption":"Retry automated install?","link":"#","padding":"4","width":"100%"}, {"onclick":"gotoMainLayer"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					permissionsLayer: ["wm.Layer", {"borderColor":"","caption":"layer2","horizontalAlign":"right","verticalAlign":"top"}, {}, {
						html1: ["wm.Html", {"_classes":{"domNode":["wm_BackgroundColor_LightGray","wm_FontColor_Black"]},"height":"100%","html":"Unable to upload this file; this typically means that your system requires additional permissions to install. You can install these files yourself into studio/WEB-INF/lib.  For instructions go to <a class=\"wm_FontColor_Black\" href=\"#\" onclick=\"window.open('http://dev.wavemaker.com/wiki/bin/ThirdPartyJars')\">Installing Jars</a> on the wiki","minDesktopHeight":15,"padding":"10"}, {}],
						button1: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Try Again","margin":"4","width":"107px"}, {"onclick":"layer1"}]
					}]
				}]
			}]
		}]
	}]
}