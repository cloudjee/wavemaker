AmazonPage.widgets = {
	AmazonVar: ["wm.ServiceVariable", {service: "AmazonRESTService", operation: "itemSearch"}, {onBeforeUpdate: "AmazonVarBeforeUpdate", onSuccess: "AmazonVarSuccess"}, {
		input: ["wm.ServiceInput", {type: "itemSearchInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {targetProperty: "keywords", source: "editor2.dataValue"}, {}],
				wire4: ["wm.Wire", {targetProperty: "subscriptionId", source: "editor1.dataValue"}, {}],
				wire2: ["wm.Wire", {targetProperty: "operation", expression: "\"ItemSearch\""}, {}],
				wire3: ["wm.Wire", {targetProperty: "searchIndex", expression: "\"Books\""}, {}],
				wire: ["wm.Wire", {targetProperty: "itemPage", expression: "\"1\""}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		template1: ["wm.Template", {width: "100%", height: "78px", verticalAlign: "top", horizontalAlign: "left", padding: "8", layoutKind: "left-to-right"}, {}, {
			appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent"]}, caption: "Amazon Service", height: "51px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			picture1: ["wm.Picture", {height: "68px", width: "200px", source: "amazon_logo.png"}, {}]
		}],
		panel1: ["wm.Panel", {width: "100%", height: "100%", horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right"}, {}, {
			panel2: ["wm.Panel", {width: "362px", height: "568%", horizontalAlign: "center", verticalAlign: "top", padding: "10"}, {}, {
				label1: ["wm.Label", {_classes: {domNode: ["wm_BackgroundChromeBar_Yellow"]}, caption: "You will need to get an Amazon ID in order to use this Web service.  Please get yours <a href=\"http://www.amazon.com/gp/browse.html?node=3435361\">here</a><br/>Eg. Api Key AKIAINK3LAQLL7NTH5BQ", height: "54px", width: "100%", singleLine: false}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				spacer1: ["wm.Spacer", {height: "10px", width: "100%"}, {}],
				editor1: ["wm.Editor", {caption: "Api Key", captionSize: "90px", displayValue: "AKIAINK3LAQLL7NTH5BQ", width: "100%"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				spacer2: ["wm.Spacer", {height: "10px", width: "339px"}, {}],
				editor2: ["wm.Editor", {caption: "Keyword", captionSize: "90px", width: "100%"}, {onchange: "AmazonVar"}, {
					editor: ["wm._TextEditor", {changeOnEnter: true}, {}]
				}],
				spacer3: ["wm.Spacer", {height: "10px", width: "337px"}, {}],
				button1: ["wm.Button", {width: "96px", height: "32px", caption: "Search"}, {onclick: "AmazonVar"}],
				spacer4: ["wm.Spacer", {height: "12px", width: "210%"}, {}],
				dataGrid1: ["wm.DataGrid", {}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "AmazonVar.items.items"}, {}]
					}],
					title: ["wm.DataGridColumn", {field: "itemAttributes.title", caption: "title", index: 1, columnWidth: "331px"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}],
			splitter1: ["wm.Splitter", {layout: "left", width: "4px", height: "100%", border: "0", borderColor: "#ABB8CF"}, {}],
			label2: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_12px", "wm_FontColor_SteelBlue"]}, caption: "Loading ...", height: "30px", width: "118px", showing: false}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			iFrame1: ["wm.IFrame", {height: "100%", width: "100%", scrollX: true, scrollY: true}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {targetProperty: "source", source: "dataGrid1.selectedItem.detailPageURL"}, {}]
				}]
			}]
		}]
	}]
}