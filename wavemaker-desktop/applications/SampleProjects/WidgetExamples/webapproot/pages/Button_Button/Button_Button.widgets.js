Button_Button.widgets = {
	buttonPushVar: ["wm.Variable", {"type":"NumberData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":"0","source":false,"targetProperty":"dataValue"}, {}]
		}]
	}],
	buttonClickDialog: ["wm.GenericDialog", {"button1Caption":"Close","button1Close":true,"corner":"cr","desktopHeight":"102px","height":"102px","positionNear":"basicButton","userPrompt":"You pushed the button!"}, {}],
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel20: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label4: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"autoSizeWidth":true,"caption":"Button Widget","padding":"4","width":"85px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minWidth":450,"verticalAlign":"top","width":"100%"}, {}, {
						label14: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						label16: ["wm.Label", {"caption":"<b>Directions:</b> push button to show dialog window.","height":"34px","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							basicButton: ["wm.Button", {"caption":"Push Me!","hint":"Pushing this button shows a dialog","margin":"4","width":"96px"}, {"onclick":"buttonClickDialog.show"}]
						}],
						label17: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						panel8: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
							label5: ["wm.Label", {"autoSizeWidth":true,"caption":"Push button to show dialog window.","padding":"4","width":"202px"}, {}, {
								format: ["wm.DataFormatter", {}, {}]
							}]
						}]
					}],
					panel17: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","minWidth":280,"verticalAlign":"top","width":"50%"}, {}, {
						fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
							panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								html2: ["wm.Html", {"height":"100%","html":"<p>The button widget generates an onClick event when it is clicked. Clicking a button can trigger the following actions:</p>\n<ul>\n<li>Navigate to a new page or layer</li>\n<li>Query a database</li>\n<li>Call a Javascript function</li>\n<li>Call a web service or Java method</li>\n</ul>\n<p>This example shows using the onClick event of a button to show a dialog window built using drag and drop development and no code!</p>\n<h4>Documentation</h4>\n<ul>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/Button' target='_blank'>Button Widget</a></li>\n</ul>\n<h4>Related Examples</h4>\n<ul>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=button&layer=toggle' target='_blank'>Toggle Button</a></li>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=button&layer=busy' target='_blank'>Busy Button</a></li>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=button&layer=popup' target='_blank'>Popup Button</a></li>\n</ul>","margin":"5","minDesktopHeight":15}, {}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}