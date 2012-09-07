Tree_Object.widgets = {
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel19: ["wm.Panel", {"height":"570px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel21: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label15: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"border":"0","caption":"Object Tree Widget","padding":"4","width":"212px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel22: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel24: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label21: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label17: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> this tree shows departments and their related employees","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel25: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel26: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						tree2: ["wm.ObjectTree", {"_classes":{"domNode":["wm_FontSizePx_14px"]},"border":"0","connectors":false,"data":{"Guitars":{"Martin":undefined,"Gibson":undefined,"Fender":undefined,"Guild":undefined},"Cadillacs":{"Grand Torino":undefined,"Seville":undefined,"Pink Convertible":undefined,"Black and Sleek":undefined},"Hillbilly Music":{"Steve Earle":undefined,"Dwight Yoakum":undefined,"Hank Williams":undefined}},"height":"100%"}, {"onclick":"tree2Click"}]
					}],
					label22: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel27: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
						label18: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"You selected","padding":"4","width":"82px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						dataTreeLabel: ["wm.Label", {"border":"0","caption":"","padding":"4"}, {"onclick":"dataTreeLabelClick"}, {
							format: ["wm.DataFormatter", {}, {}]
						}]
					}]
				}],
				fancyPanel2: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
					panel2: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						html7: ["wm.Html", {"border":"0","height":"100%","html":"<p>An Object Tree widget is created using the studio tree editor to create a static list of choices.</p>\n<p>This example shows using the data property of a tree widget to display structured information and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/PropertyTree' target='_blank'>Tree populated from DB</a></li>\n<li><a href='http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/ObjectTree' target='_blank'>Tree populated from static list</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href='http://widgetexamples.cloudfoundry.com/?page=select&layer=list'>Select Menu</a></li>\n</ul>\t","margin":"5","width":"100%"}, {}]
					}]
				}]
			}]
		}]
	}]
}