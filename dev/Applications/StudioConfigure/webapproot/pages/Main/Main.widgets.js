Main.widgets = {
	downloadAndInstallServiceVar: ["wm.ServiceVariable", {"operation":"DownloadPackages","service":"InstallService"}, {"onSuccess":"downloadAndInstallServiceVarSuccess","onError":"downloadAndInstallServiceVarError"}, {
		input: ["wm.ServiceInput", {"type":"DownloadPackagesInputs"}, {}]
	}],
	gotoMainLayer: ["wm.NavigationCall", {}, {}, {
		input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"source":"layer1","targetProperty":"layer"}, {}]
			}]
		}]
	}],
	layoutBox: ["wm.Layout", {"height":"100%","horizontalAlign":"center","width":"100%"}, {}, {
		panel5: ["wm.Panel", {"_classes":{"domNode":["wm_Attribution_new"]},"border":"0","height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"266px"}, {}],
		loginMainPanel: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"center","minHeight":550,"padding":"20","verticalAlign":"middle","width":"100%"}, {}, {
			wmTitle: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","wm_TextDecoration_Bold"]},"align":"center","border":"0","caption":"Complete Installation","height":"20px","padding":"4","width":"350px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			loginInputPanel: ["wm.EmphasizedContentPanel", {"_classes":{"domNode":["wm_BorderTopStyle_Curved8px","wm_BorderBottomStyle_Curved8px"]},"border":"2","height":"500px","horizontalAlign":"center","padding":"0","verticalAlign":"center","width":"948px"}, {}, {
				layers1: ["wm.Layers", {"margin":"20","transition":"fade"}, {}, {
					layer1: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer1","horizontalAlign":"right","verticalAlign":"top"}, {}, {
						html2: ["wm.Html", {"autoScroll":false,"border":"0","height":"88px","html":"<p>NOTE: If the box below fails to load or if it takes more than a minute for the install button to run, click on <a href='#' onclick='main.manualLabelClick()'>Proxy Problems?</a>.</p><p>WaveMaker has identified missing system requirements.  These dependencies can be resolved by downloading the WaveMaker System Requirements Bundle.  The WaveMaker System Requirements Bundle includes open source packages.  Your use of the WaveMaker System Requirements Bundle is subject to the following open source license(s):</p>","margin":"0,20","width":"100%"}, {}],
					    html: ["wm.html", {"_classes":{"domNode":["wm_BackgroundColor_LightGray"]},"border":"0","height":"100%",html: "resources/dependency_bundle_open_source_licenses.txt","width":"100%"}, {}],
						panel3: ["wm.Panel", {"border":"0","height":"48px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							spacer1: ["wm.Spacer", {"height":"50px","width":"326px"}, {}],
							downloadButton: ["wm.BusyButton", {"caption":"Download and Install","defaultIconUrl":"lib/wm/base/widget/themes/default/images/blank.gif","height":"34px","margin":"4","width":"257px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"downloadAndInstallServiceVar","targetProperty":"clickVariable"}, {}]
								}]
							}],
							manualLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_White"]},"align":"right","border":"0","caption":"Proxy Problems?","link":"#","padding":"4","width":"100%"}, {"onclick":"manualLabelClick"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					fileUploadLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer2","horizontalAlign":"left","verticalAlign":"top"}, {}, {
						label2: ["wm.Label", {"border":"2","borderColor":"#ff0000","caption":"There is a connection problem.  Typically this means you are either not connected to the network or there is a firewall blocking access.  To work around firewall issues, please use the buttons below to complete installation","height":"54px","padding":"4","singleLine":false,"width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						bypassFirewallLabel: ["wm.Label", {"border":"0","caption":"If firewalls are keeping the installation from completing, you can use the buttons below to bypass these problems","padding":"4","showing":false,"width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel1: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label3: ["wm.Label", {"border":"0","caption":"Step 1: Download the zip file","height":"100%","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							downloadZipButton: ["wm.Button", {"caption":"Download","height":"100%","margin":"4","width":"130px"}, {"onclick":"downloadZipButtonClick"}]
						}],
						panel2: ["wm.Panel", {"border":"0","height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label4: ["wm.Label", {"border":"0","caption":"Step 2: Upload the zip into studio","height":"100%","padding":"4","width":"100%"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}],
							dojoFileUpload1: ["wm.DojoFileUpload", {"border":"1","borderColor":"#ABB8CF","height":"100%","margin":"4","operation":"uploadPackage","service":"InstallService","useList":false,"width":"130px"}, {"onSuccess":"dojoFileUpload1Success","onError":"dojoFileUpload1Error"}, {
								_variable: ["wm.Variable", {"isList":true,"type":"wm.DojoFileUpload.FileData"}, {}],
								_uploadedVariable: ["wm.Variable", {"isList":true,"type":"wm.DojoFileUpload.FileData"}, {}],
								_variable1: ["wm.Variable", {"isList":true,"type":"wm.DojoFileUpload.FileData"}, {}],
								_uploadedVariable1: ["wm.Variable", {"isList":true,"type":"wm.DojoFileUpload.FileData"}, {}],
								input1: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}],
								input: ["wm.ServiceInput", {"type":"uploadPackageInputs"}, {}]
							}]
						}],
						panel4: ["wm.Panel", {"border":"0","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							autoLabel: ["wm.Label", {"align":"left","border":"0","caption":"Retry automated install?","link":"#","padding":"4","width":"100%"}, {"onclick":"gotoMainLayer"}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					permissionsLayer: ["wm.Layer", {"border":"0","borderColor":"","caption":"layer2","horizontalAlign":"right","verticalAlign":"top"}, {}, {
						html1: ["wm.Html", {"_classes":{"domNode":["wm_BackgroundColor_LightGray","wm_FontColor_Black"]},"border":"0","height":"100%","html":"Unable to upload this file; this typically means that your system requires additional permissions to install. You can install these files yourself into studio/WEB-INF/lib.  For instructions go to <a class=\"wm_FontColor_Black\" href=\"#\" onclick=\"window.open('http://dev.wavemaker.com/wiki/bin/ThirdPartyJars')\">Installing Jars</a> on the wiki","padding":"10","width":"100%"}, {}],
						button1: ["wm.Button", {"caption":"Try Again","margin":"4","width":"107px"}, {"onclick":"layer1"}]
					}]
				}]
			}]
		}]
	}]
}