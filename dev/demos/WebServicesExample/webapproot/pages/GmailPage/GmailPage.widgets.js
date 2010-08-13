GmailPage.widgets = {
	LectorGmail: ["wm.ServiceVariable", {service: "FeedService", operation: "getFeedWithHttpConfig"}, {onError: "LectorGmailError", onBeforeUpdate: "LectorGmailBeforeUpdate", onSuccess: "LectorGmailSuccess"}, {
		input: ["wm.ServiceInput", {type: "getFeedWithHttpConfigInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "connectionTimeout", expression: "0"}, {}],
				wire1: ["wm.Wire", {targetProperty: "feedURL", expression: "\"https://mail.google.com/mail/feed/atom\""}, {}],
				wire2: ["wm.Wire", {targetProperty: "httpBasicAuthPassword", source: "password.dataValue"}, {}],
				wire3: ["wm.Wire", {targetProperty: "httpBasicAuthUsername", source: "usuario.dataValue"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "1090px", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		template1: ["wm.Template", {_classes: {domNode: ["wm_SilverBlueTheme_MainOutsetPanel"]}, width: "100%", height: "96px", verticalAlign: "top", horizontalAlign: "left", padding: "8", layoutKind: "left-to-right"}, {}, {
			appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_FontColor_Blue"]}, caption: "Gmail Reader", height: "36px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel5: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_WhiteInsetPanel"]}, width: "222px", height: "80px", fitToContent: true, borderColor: "steelblue"}, {}, {
				picture1: ["wm.Picture", {height: "83px", width: "200px", source: "gmail.png"}, {}]
			}]
		}],
		panel1: ["wm.Panel", {width: "100%", height: "131px", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
			panel2: ["wm.Panel", {_classes: {domNode: ["wm_Padding_4px", "wm_Border_Size1px", "wm_Border_ColorBlack"]}, width: "326px", height: "100%", borderColor: "#ffffff", border: "1", padding: "0", horizontalAlign: "left", verticalAlign: "top"}, {}, {
				label1: ["wm.Label", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "Login ", height: "30px", width: "100%"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				usuario: ["wm.Editor", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "email", width: "309px"}, {}, {
					editor: ["wm._TextEditor", {required: true}, {}]
				}],
				password: ["wm.Editor", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, caption: "password", width: "311px"}, {onchange: "LectorGmail"}, {
					editor: ["wm._TextEditor", {required: true, password: true, changeOnEnter: true}, {}]
				}],
				spacer1: ["wm.Spacer", {height: "11px", width: "325px"}, {}],
				panel3: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", horizontalAlign: "center", verticalAlign: "top"}, {}, {
					button1: ["wm.Button", {_classes: {domNode: ["wm_TextDecoration_Bold"]}, width: "154px", height: "100%", caption: "Read Mail"}, {onclick: "LectorGmail"}]
				}]
			}],
			panel4: ["wm.Panel", {width: "100%", height: "100%", borderColor: "#Fafafa", horizontalAlign: "left", verticalAlign: "top"}, {}, {
				spacer2: ["wm.Spacer", {height: "30px", width: "100%"}, {}],
				label2: ["wm.Label", {caption: "@gmail.com", height: "25px", width: "342px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				error_lbl: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Center", "wm_FontSize_120percent"]}, caption: "Account doesn't exists  ", height: "34px", width: "100%", showing: false}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				loading_lbl: ["wm.Label", {_classes: {domNode: ["wm_TextAlign_Right", "wm_FontSize_150percent"]}, caption: "Loading...", height: "29px", width: "100%", padding: "15", showing: false}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}]
		}],
		dataGrid1: ["wm.DataGrid", {margin: "0", padding: "0", borderColor: "#aeaeae"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "dataSet", source: "LectorGmail.entries"}, {}]
			}],
			publishedDate1: ["wm.DataGridColumn", {field: "publishedDate", caption: "Date", index: 4, columnWidth: "89px", display: "Date"}, {}, {
				format: ["wm.DateFormatter", {}, {}]
			}],
			author1: ["wm.DataGridColumn", {field: "author", caption: "author", index: 6}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			Detail: ["wm.DataGridColumn", {field: "description.value", caption: "Detail", index: 3, columnWidth: "471px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			Subject: ["wm.DataGridColumn", {field: "title", caption: "Subject", index: 2, columnWidth: "310px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}]
	}]
}