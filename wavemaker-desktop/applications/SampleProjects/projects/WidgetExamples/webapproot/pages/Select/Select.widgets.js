Select.widgets = {
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["MainContent"]},"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel1: ["wm.MainContentPanel", {"height":"34px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"800px"}, {}, {
			label3: ["wm.Label", {"_classes":{"domNode":["SectionHeader"]},"autoSizeWidth":true,"caption":"Select Menu Widget Examples","padding":"4","width":"169px"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		tabLayers1: ["wm.TabLayers", {"desktopHeaderHeight":"29px","manageURL":true,"width":"800px"}, {}, {
			select: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select from List","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_List","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			populate: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Select from DB","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer2: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_DB","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			filter: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Filtering Select","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer3: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_Filter","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}],
			display: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Display Expression","horizontalAlign":"left","verticalAlign":"top"}, {}, {
				pageContainer4: ["wm.PageContainer", {"deferLoad":true,"pageName":"Select_Display","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}]
		}]
	}]
}