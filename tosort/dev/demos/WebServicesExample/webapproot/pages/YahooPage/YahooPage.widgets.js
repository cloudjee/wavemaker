YahooPage.widgets = {
	getTraffic: ["wm.ServiceVariable", {service: "YahooTraffic", operation: "getTraffic"}, {onSuccess: "getTrafficSuccess"}, {
		input: ["wm.ServiceInput", {type: "getTrafficInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "appid", source: "editor1.dataValue"}, {}],
				wire1: ["wm.Wire", {targetProperty: "location", source: "editor2.dataValue"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		template1: ["wm.Template", {width: "100%", height: "93px", verticalAlign: "top", horizontalAlign: "left", padding: "8", layoutKind: "left-to-right"}, {}, {
			appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_FontColor_Blue"]}, caption: "Yahoo Traffic", height: "76px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel3: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_WhiteInsetPanel"]}, width: "200px", height: "68px", borderColor: "steelblue"}, {}, {
				picture1: ["wm.Picture", {height: "80px", width: "100%", source: "yahoo.png"}, {}]
			}]
		}],
		panel1: ["wm.Panel", {width: "100%", horizontalAlign: "center", verticalAlign: "middle", height: "104px", layoutKind: "left-to-right"}, {}, {
			panel4: ["wm.Panel", {width: "401px", horizontalAlign: "left", verticalAlign: "top", height: "95px"}, {}, {
				editor1: ["wm.Editor", {caption: "Application ID", displayValue: "00b2xK7V34HS3LIeYcXYCfJEs5k.pqKYAxrZSEwMj_SKeOhrNcZLTCIXPldEwrp6MSH85kY", width: "400px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				editor2: ["wm.Editor", {caption: "Location", width: "400px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "displayValue", source: "New York"}, {}],
						wire1: ["wm.Wire", {targetProperty: "dataValue", source: "New York"}, {}]
					}],
					editor: ["wm._TextEditor", {}, {}]
				}],
				panel5: ["wm.Panel", {width: "400px", horizontalAlign: "right", verticalAlign: "top", height: "48px", layoutKind: "left-to-right"}, {}, {
					label1: ["wm.Label", {caption: "Ej. New York", height: "48px", width: "96px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					spacer1: ["wm.Spacer", {height: "48px", width: "167px"}, {}],
					button1: ["wm.Button", {width: "96px", height: "34px", caption: "Get Traffic Info", borderColor: "#FFFFFF"}, {onclick: "getTraffic"}]
				}]
			}],
			content1: ["wm.Content", {_classes: {domNode: ["wm_BackgroundChromeBar_Yellow"]}, height: "100%", width: "100%", content: "YahooUsage", padding: "5"}, {}]
		}],
		panel2: ["wm.Panel", {width: "100%", horizontalAlign: "left", verticalAlign: "top", height: "100%", layoutKind: "left-to-right"}, {}, {
			dataGrid1: ["wm.DataGrid", {width: "309px"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {targetProperty: "dataSet", source: "getTraffic.results"}, {}]
				}],
				title1: ["wm.DataGridColumn", {field: "title", caption: "Title", index: 6, columnWidth: "373px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel6: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_LightBlueOutsetPanel"]}, width: "202px", horizontalAlign: "left", verticalAlign: "top", height: "100%"}, {}, {
				editor3: ["wm.Editor", {caption: "Description", width: "350px", readonly: true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "displayValue", source: "dataGrid1.selectedItem.description"}, {}]
					}],
					editor: ["wm._TextEditor", {}, {}]
				}],
				editor4: ["wm.Editor", {caption: "Severity", width: "350px", readonly: true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "displayValue", source: "dataGrid1.selectedItem.severity"}, {}]
					}],
					editor: ["wm._TextEditor", {}, {}]
				}]
			}],
			iFrame1: ["wm.IFrame", {height: "100%", width: "100%", scrollY: true}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {targetProperty: "source", source: "getTraffic.results.imageUrl"}, {}]
				}]
			}]
		}]
	}]
}