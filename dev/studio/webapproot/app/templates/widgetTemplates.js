/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
dojo.provide("wm.studio.app.templates.widgetTemplates");

wm.widgetTemplates = {};

wm.widgetTemplates.twoColumn = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
	    toolbarPanel: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", _classes: {domNode: ["toolbar"]}, border: "0,0,2,0", layoutKind: "left-to-right", height: "36px", width: "100%"}, {}, {
		button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button2: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button3: ["wm.Button", {width: "80px", height: "100%"}, {}]
	    }],
            panel1: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", layoutKind: "left-to-right", width: "100%", height: "100%"}, {}, {
	        leftSideBarTOC: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", _classes: {domNode: ["TOC"]}, layoutKind: "top-to-bottom", width: "246px", height: "100%"}, {}],
	        splitter1: ["wm.Splitter", {layout: "left"}, {}],
	        mainContent: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", isMajorContent: true, layoutKind: "top-to-bottom", width: "100%", height: "100%"}, {}]
            }]
	}
}

wm.widgetTemplates.fancyCenteredTemplate = {
    layoutKind: "top-to-bottom",
    width: "100%",
    height: "100%",
    verticalAlign: "top",
    horizontalAlign: "left",
    _classes: {domNode: ["fancyCenteredTemplate"]},
    _template: {
	templateMain: ["wm.Template", {"layoutKind":"left-to-right","width":"100%","height":"100%","verticalAlign":"top","horizontalAlign":"center"}, {}, {
	    content: ["wm.Panel", {"height":"100%","width":"960px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}, {
		panelHeader: ["wm.Panel", {"height":"80px","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right"}, {}, {
		    pictureHeader: ["wm.Panel", {horizontalAlign: "left", verticalAlign: "top", "_classes":{"domNode":["wm_Attribution_new"]},"height":"100%","width":"300px","margin":"0,0,0,20"}, {}],
		    labelHeader: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_24px"]},"height":"100%","width":"100%","caption":"Application Name","border":"0","padding":"20", "align":"right"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		    }]
		}],
                        
		panel0: ["wm.Panel", {"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"top-to-bottom"}, {}, {
		    panel1: ["wm.Panel", {"height":"24px","width":"100%","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right","lock":true}, {}, {
			templateTopLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateTop: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-center"]},"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateTopRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-top-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left"}, {}]
		    }],
		    panel2: ["wm.Panel", {isMajorContent: true, "height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true,"layoutKind":"left-to-right"}, {}, {
			templateLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateContent: ["wm.Panel", {isMajorContent: true, "height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left"}, {}],
			templateRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}]
		    }],
		    panel3: ["wm.Panel", {"height":"24px","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true,"layoutKind":"left-to-right"}, {}, {
			templateBottomLeft: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-left"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateBottom: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-center"]},"height":"100%","width":"100%","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}],
			templateBottomRight: ["wm.Panel", {"_classes":{"domNode":["fancytemplate-bottom-right"]},"height":"100%","width":"24px","verticalAlign":"top","horizontalAlign":"left","freeze":true}, {}]
		    }],
		    panelFooter: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","height":"48px","width":"100%","caption":"Copyright 2010 Wavemaker Software<br>301 Howard St Suite 2200 San Francisco, CA 94105","border":"0","padding":"10,20","margin":"0","singleLine":false}, {}, {}]
		}]
	    }]
        }]
    }
}

wm.widgetTemplates.CenteredPageContainerWithHeaderFooter = {
	 height:"100%",
	 width:"100%",
	 horizontalAlign:"left",
	 _template: {
		CenteredLayout: ["wm.Template", {"width":"100%","height":"100%","verticalAlign":"top","horizontalAlign":"center"}, {}, {
		    contentPanel: ["wm.Panel", {"width":"800px","height":"100%","border":"0,1"}, {}, {
			TitleBar: ["wm.Template", {"_classes":{"domNode":["titlebar"]},"width":"100%","height":"96px","verticalAlign":"top","horizontalAlign":"left","layoutKind":"left-to-right","padding":"8", border: "0,0,4,0"}, {}, {
					appNameLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_24px"]},"caption":"Application Name","width":"100%","height":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
			    panel3: ["wm.Panel", {isMajorContent: true, "width":"284px","height":"100%","border":"1"}, {}]
				}],
			pageContainer1: ["wm.PageContainer", {_classes: {domNode: ["wmcontentarea"]}, "height":"100%"}, {}],
				Footer: ["wm.Template", {"_classes":{"domNode":["toolbar"]},"width":"100%","height":"36px","verticalAlign":"middle","horizontalAlign":"center","padding":"2"}, {}, {
				    footerLabel: ["wm.Label", {align: "center", "caption":"Copyright 2010 ACME, Inc.","width":"100%","height":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}]
			}]
		}]
	}
}

wm.widgetTemplates.tabbedTwoColumn = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		tabLayers1: ["wm.TabLayers", {height: "100%", width: "100%"}, {}, {
			layer1: ["wm.Layer", {caption: "Tab1", layoutKind: "left-to-right"}, {}, {
			    leftSideBarTOC: ["wm.Panel", {_classes: {domNode: ["TOC"]}, layoutKind: "top-to-bottom", width: "198px", height: "100%"}, {}],
				splitter1: ["wm.Splitter", {layout: "left"}, {}],
				panel2: ["wm.Panel", {box: "v", width: "1flex"}, {}, {
				    toolbarPanel: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, border: "0,0,2,0", layoutKind: "left-to-right", height: "36px", width: "100%"}, {}, {
						button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
						button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
					}],
				    mainContent: ["wm.Panel", {isMajorContent: true, layoutKind: "left-to-right", width: "100%", height: "100%"}, {}]
				}]
			}],
			layer2: ["wm.Layer", {caption: "Tab2"}, {}],
			layer3: ["wm.Layer", {caption: "Tab3"}, {}]
		}]
	}
}

wm.widgetTemplates.toolbarWithGroupBox = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		panel1: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_ToolBar"]}, width: "100%", height: "36px", border: "0", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}],
			button2: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}]
		}],
		panel2: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_LightBlueInsetPanel"]}, width: "100%", height: "100%", border: "0", layoutKind: "left-to-right", horizontalAlign: "center"}, {}, {
			panel3: ["wm.Panel", {width: "542px", height: "100%", border: "0"}, {}, {
				panel4: ["wm.Panel", {height: "45px", border: "0"}, {}, {
					panel6: ["wm.Panel", {width: "100%", height: "20px", border: "0", layoutKind: "left-to-right"}, {}],
					label1: ["wm.Label", {caption: "Group Box", height: "100%", border: "", width: "100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				panel5: ["wm.Panel", {_classes: {domNode: ["wm_SilverBlueTheme_MainOutsetPanel"]}, width: "100%", height: "262px", border: "0", layoutKind: "left-to-right", horizontalAlign: "center"}, {}, {
					panel7: ["wm.Panel", {width: "430px", height: "100%", border: "0", verticalAlign: "middle"}, {}, {
						editor1: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor2: ["wm.Editor", {caption: "Bar:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor3: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor4: ["wm.Editor", {caption: "Bar:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						editor5: ["wm.Editor", {caption: "Foo:", height: "26px", border: "0", width: "100%"}, {}, {
							editor: ["wm._TextEditor", {}, {}]
						}],
						panel8: ["wm.Panel", {width: "100%", height: "36px", border: "0", layoutKind: "left-to-right", horizontalAlign: "right"}, {}, {
							button3: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}],
							button4: ["wm.Button", {width: "50px", height: "100%", border: "1"}, {}]
						}]
					}]
				}]
			}]
		}]
	}
}

wm.widgetTemplates.complexLayout = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		toolbar: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, width: "100%", height: "36px", layoutKind: "left-to-right"}, {}, {
			button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
			button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
		}],
		panel2: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right"}, {}, {
			accordionLayers1: ["wm.AccordionLayers", {width: "214px"}, {}, {
				layer1: ["wm.Layer", {caption: "layer1"}, {}],
				layer2: ["wm.Layer", {caption: "layer2"}, {}],
				layer3: ["wm.Layer", {caption: "layer3"}, {}]
			}],
			splitter1: ["wm.Splitter", {height: "100%", width: "6px", layout: "left"}, {}],
			panel4: ["wm.Panel", {width: "100%", height: "100%"}, {}, {
				dataGrid1: ["wm.DataGrid", {height: "250px"}, {}, {
					column: ["wm.DataGridColumn", {autoSize: true}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}]
				}],
				splitter2: ["wm.Splitter", {width: "100%"}, {}],
				contentPanelFrame: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", padding: "48", horizontalAlign: "center", verticalAlign: "middle"}, {}, {
				    contentPanel: ["wm.Panel", {isMajorContent: true, width: "100%", height: "312px", border: "1", layoutKind: "left-to-right"}, {}]
				}]
			}]
		}]
	}
}

wm.widgetTemplates.searchListDetail = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "100%",
	_template: {
		searchBarPanel: ["wm.Panel", {_classes: {domNode: ["toolbar"]}, width: "100%", height: "36px", layoutKind: "left-to-right"}, {}, {
			searchBox: ["wm.Editor", {width: "219px", margin: "4", padding: "0"}, {}, {
				editor: ["wm._TextEditor", {}, {}]
			}],
			searchBtn: ["wm.Button", {width: "55px", height: "100%", caption: "Search"}, {}]
		}],
		dataGrid1: ["wm.DataGrid", {height: "226px"}, {}, {
			column: ["wm.DataGridColumn", {autoSize: true}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}]
		}],
		splitter1: ["wm.Splitter", {layout: "top"}, {}],
		liveFormOuterPanel: ["wm.Panel", {width: "100%", height: "100%", layoutKind: "left-to-right", padding: "48"}, {}, {
		    liveFormInnerPanel: ["wm.Panel", {isMajorContent: true, width: "100%", height: "100%", border: "1", padding: "32"}, {}, {
				liveForm1: ["wm.LiveForm", {height: "100%", fitToContent: false, horizontalAlign: "left", verticalAlign: "top"}, {}]
			}]
		}]
	}
}

wm.widgetTemplates.titleBar = {
	layoutKind: "left-to-right",
	width: "100%",
	height: "96px",
	padding: "8",
        border: "0,0,4,0",
	_classes: {domNode: ["titlebar"]},
	_template: {
		appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_24px"]}, caption: "Application Name", height: "100%", width: "100%"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
	    panel3: ["wm.Panel", {isMajorContent: true, height: "100%", width: "222px", border: "1"}, {}]
	}
}

wm.widgetTemplates.centeredFixedLayout = {
	width: "100%",
	height: "100%",
	verticalAlign: "top",
	horizontalAlign: "center",
	layoutKind: "top-to-bottom",
	_template: {
	    contentPanel: ["wm.Panel", {isMajorContent: true, width: "600px", height: "100%", border: "0,1"}, {}]
	}
}

wm.widgetTemplates.toolbar = {
	layoutKind: "left-to-right",
	width: "100%",
	height: "36px",
	_classes: {domNode: ["toolbar"]},
	_template: {
		button1: ["wm.Button", {width: "80px", height: "100%"}, {}],
		button2: ["wm.Button", {width: "80px", height: "100%"}, {}]
	}
}


wm.widgetTemplates.footer = {
	layoutKind: "top-to-bottom",
	width: "100%",
	height: "36px",
	padding: "2",
	verticalAlign: "middle",
	horizontalAlign: "center",
	_classes: {domNode: ["toolbar"]},
	_template: {
	    footerLabel: ["wm.Label", {align: "center", caption: "Copyright 2010 ACME, Inc.", width: "100%", height: "100%"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}
}

wm.widgetTemplates.basic = {
	layoutKind: "top-to-bottom",
	height: "100%",
	width: "100%",
	_template: {
		headerLabel: ["wm.Label", {height: "40px", width: "100%", border: "0", padding: "10", caption: "Header", backgroundColor: "#C6D3E7"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}],
		mainPanel: ["wm.Panel", {height: "100%", width: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top"}, {}, {
			tabs: ["wm.TabLayers", {height: "100%", width: "100%", border: "0", verticalAlign: "top", horizontalAlign: "left"}, {}, {
				layer1: ["wm.Layer", {caption: "layer1"}, {}],
				layer2: ["wm.Layer", {caption: "layer2"}, {}]
			}]
		}],
		footerLabel: ["wm.Label", {height: "30px", width: "100%", border: "0", padding: "10", caption: "Footer", backgroundColor: "#C6D3E7"}, {}, {
			format: ["wm.DataFormatter", {}, {}]
		}]
	}
}
