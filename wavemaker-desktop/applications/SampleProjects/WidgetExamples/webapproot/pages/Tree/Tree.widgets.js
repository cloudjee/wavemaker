Tree.widgets = {
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
			label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Tree Widget Examples","padding":"4","width":"128px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px","manageURL":true,"width":"800px"}, {}, {
			propertyTree: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Property Tree","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Tree_Property","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			objectTree: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Object Tree","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Tree_Object","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}]
		}]
	}]
}