Editor.widgets = {
	rightClickDialog: ["wm.GenericDialog", {"button1Caption":"OK","button1Close":true,"corner":"tc","desktopHeight":"102px","height":"101px","title":"Right Click Dialog","userPrompt":"Button right click detected"}, {}],
	leftClickDialog: ["wm.GenericDialog", {"button1Caption":"OK","button1Close":true,"corner":"tc","desktopHeight":"102px","height":"101px","title":"Left Click Dialog","userPrompt":"Button left click detected"}, {}],
	popupButtonDialog: ["wm.DesignableDialog", {"buttonBarId":"buttonBar","containerWidgetId":"containerWidget","corner":"tc","desktopHeight":"120px","height":"120px","modal":false,"title":"Popup Button Dialog","width":"300px"}, {}, {
		containerWidget: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			label19: ["wm.Label", {"caption":"You clicked the Popup Button ","padding":"4"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel19: ["wm.Panel", {"height":"29px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				label21: ["wm.Label", {"caption":"Selected item = ","padding":"4","width":"116px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}],
				label20: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"padding":"4","width":"64px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":false,"source":"popupMenuButton1.caption","targetProperty":"caption"}, {}]
					}],
					format: ["wm.DataFormatter", {}, {}]
				}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			button4: ["wm.Button", {"caption":"OK","margin":"4"}, {"onclick":"popupButtonDialog.hide"}]
		}]
	}],
	howButtonDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"containerWidget1","corner":"tc","desktopHeight":"200px","height":"200px","modal":false,"title":"Button Widget"}, {}, {
		containerWidget1: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"autoScroll":true,"height":"100%","horizontalAlign":"left","padding":"5","verticalAlign":"top","width":"100%"}, {}, {
			html1: ["wm.Html", {"height":"100%","html":"Pushing a button creates an onClick event. <br><br>\nIn this example, the onClick event calls a custom Javascript function that increments a counter using the following code:<br><br>\n<code>\nthis.buttonPushVar.setValue('dataValue',this.buttonPushVar.getValue('dataValue')+1);\n</code>","minDesktopHeight":15}, {}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel12: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
			label8: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Editor Widget Examples","padding":"4","width":"143px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		tabLayers1: ["wm.TabLayers", {"width":"800px"}, {}, {
			text: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Text","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				panel33: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					pageContainer4: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Text","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
				}]
			}],
			layer1: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Number + Currency","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
				pageContainer6: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Number","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			radio: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Radio + Checkbox","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Radio","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			basic: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Basic Editors","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Basic","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			dates: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Dates","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				panel16: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					pageContainer3: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Dates","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
				}]
			}],
			validation: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Validation","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				panel49: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					pageContainer5: ["wm.PageContainer", {"deferLoad":true,"pageName":"Editor_Validation","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
				}]
			}]
		}]
	}]
}