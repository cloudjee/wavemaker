Main.widgets = {
	svarShopSearch: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"Shopping-Search","service":"xhrService"}, {}, {
		input: ["wm.ServiceInput", {"type":"Shopping-SearchInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"app.varAPIKey.dataValue","targetProperty":"key"}, {}],
				wire1: ["wm.Wire", {"expression":"\"json\"","targetProperty":"alt"}, {}],
				wire2: ["wm.Wire", {"expression":"\"US\"","targetProperty":"country"}, {}],
				wire3: ["wm.Wire", {"expression":"\"unknown,outOfStock,limited,inStock,backorder,preorder,onDisplayToOrde\"","targetProperty":"availability"}, {}],
				wire4: ["wm.Wire", {"expression":"\"price:ascending\"","targetProperty":"rankBy"}, {}],
				wire5: ["wm.Wire", {"expression":undefined,"source":"textQueryString.dataValue","targetProperty":"q"}, {}]
			}]
		}]
	}],
	productLiveVariable1: ["wm.LiveVariable", {"autoUpdate":false,"matchMode":"anywhere","type":"com.crazyeddb.data.Product"}, {}, {
		liveView: ["wm.LiveView", {"dataType":"com.crazyeddb.data.Product","view":[{"caption":"Id","sortable":true,"dataIndex":"id","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"ImageUrl","sortable":true,"dataIndex":"imageUrl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Price","sortable":true,"dataIndex":"price","type":"java.lang.Float","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"SpecialInstructions","sortable":true,"dataIndex":"specialInstructions","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null}]}, {}],
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"textQueryString.dataValue","targetProperty":"filter.name"}, {}]
		}]
	}],
	loadingDialogDBQuery: ["wm.LoadingDialog", {"caption":"Searching.."}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire1: ["wm.Wire", {"expression":undefined,"source":"productLiveVariable1","targetProperty":"serviceVariableToTrack"}, {}],
			wire: ["wm.Wire", {"expression":undefined,"source":"panelDbResults","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	loadingDialogShopSearch: ["wm.LoadingDialog", {"caption":"Searching..."}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire1: ["wm.Wire", {"expression":undefined,"source":"svarShopSearch","targetProperty":"serviceVariableToTrack"}, {}],
			wire: ["wm.Wire", {"expression":undefined,"source":"panelShopSearchResults","targetProperty":"widgetToCover"}, {}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"height":"800px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		labelTitlePanel: ["wm.Panel", {"height":"60px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			pictureCrazyLog: ["wm.Picture", {"aspect":"h","height":"100%","source":"http://1.bp.blogspot.com/-YMJZzUXMEPc/T0m9G_nM52I/AAAAAAAAAUM/83-EwT667gA/s1600/Crazy+Eddie.jpg","width":"120px"}, {}],
			labelTitle: ["wm.Label", {"caption":"The Priceinator","height":"100%","padding":"4","singleLine":false,"styles":{"fontWeight":"bold","fontSize":"38px","textAlign":"center"},"width":"100%"}, {"onclick":"layerPriceTool"}],
			pictureWMLogo: ["wm.Picture", {"aspect":"h","height":"100%","source":"resources/images/logos/wm-logo-fancy.png","width":"120px"}, {}]
		}],
		layers1: ["wm.Layers", {"margin":"3,0,0,0"}, {}, {
			layerPriceTool: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","themeStyleType":"","verticalAlign":"top"}, {}, {
				textQueryString: ["wm.Text", {"caption":"Search","captionSize":"80px","dataValue":undefined,"desktopHeight":"35px","displayValue":"","height":"35px","placeHolder":"Enter the product name and/or model ","width":"600px"}, {"onchange":"productLiveVariable1","onchange1":"svarShopSearch"}],
				bevel3: ["wm.Bevel", {"bevelSize":4,"height":"4px","width":"100%"}, {}],
				panelDbResults: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
					label1: ["wm.Label", {"caption":"Our Insane Price","padding":"4","styles":{"fontSize":"20px"},"width":"177px"}, {}],
					dojoGridCrazyDbProducts: ["wm.DojoGrid", {"columns":[{"show":false,"field":"id","title":"Id","width":"80px","align":"right","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"300px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"imageUrl","title":"Image","width":"100px","align":"left","formatFunc":"wm_image_formatter","formatProps":{"height":80},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"price","title":"Price","width":"80px","align":"left","formatFunc":"wm_currency_formatter","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"specialInstructions","title":"SpecialInstructions","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Image: \" + wm.List.prototype.imageFormatter({\"height\":80}, null,null,null,${imageUrl}) + \"</div>\"\n+ \"<div class='MobileRow'>Price: \" + wm.List.prototype.currencyFormatter({}, null,null,null,${price}) + \"</div>\"\n","mobileColumn":false}],"dsType":"com.crazyeddb.data.Product","height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":60,"noHeader":true,"singleClickEdit":true}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"productLiveVariable1","targetProperty":"dataSet"}, {}]
						}]
					}],
					simpleForm2: ["wm.SimpleForm", {"fitToContentHeight":true,"height":"70px","horizontalAlign":"center","verticalAlign":"top"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridCrazyDbProducts.selectedItem","targetProperty":"dataSet"}, {}]
						}],
						descriptionEditor1: ["wm.Text", {"caption":"Description","captionSize":"120px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"description","height":"35px","padding":"2,14,2,2","readonly":true,"width":"600px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridCrazyDbProducts.selectedItem.description","targetProperty":"dataValue"}, {}]
							}]
						}],
						priceEditor2Panel: ["wm.Panel", {"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"600px"}, {}, {
							priceEditor2: ["wm.Currency", {"caption":"Price","captionSize":"80px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"zero","formField":"price","height":"35px","readonly":true,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridCrazyDbProducts.selectedItem.price","targetProperty":"dataValue"}, {}]
								}]
							}],
							specialInstructionsEditor1: ["wm.Text", {"caption":"Notes","captionSize":"60px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"specialInstructions","height":"35px","readonly":true,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridCrazyDbProducts.selectedItem.specialInstructions","targetProperty":"dataValue"}, {}]
								}]
							}]
						}]
					}]
				}],
				bevel2: ["wm.Bevel", {"bevelSize":4,"height":"4px","width":"100%"}, {}],
				panelShopSearchResults: ["wm.Panel", {"enableTouchHeight":true,"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"300%"}, {}, {
					dojoGridShopSearchResulats: ["wm.DojoGrid", {"columns":[{"show":false,"field":"kind","title":"Kind","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"id","title":"Id","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"selfLink","title":"SelfLink","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"product.googleId","title":"GoogleId","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.author.name","title":"Name","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.author.accountId","title":"AccountId","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.creationTime","title":"CreationTime","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.modificationTime","title":"ModificationTime","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"product.country","title":"Country","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.language","title":"Language","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"product.title","title":"Product","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"product.description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.link","title":"Link","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.brand","title":"Brand","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"product.condition","title":"Condition","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Product: \" + ${product.title} + \"</div>\"\n","mobileColumn":false}],"dsType":"Shopping-SearchResponse_items","height":"100%","margin":"4","minDesktopHeight":60,"noHeader":true,"singleClickEdit":true}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"svarShopSearch.items","targetProperty":"dataSet"}, {}]
						}]
					}],
					label4: ["wm.Label", {"caption":"The Competition","padding":"4","styles":{"fontSize":"20px"},"width":"174px"}, {}],
					textShopDescription: ["wm.Text", {"caption":"Description","captionSize":"120px","desktopHeight":"35px","displayValue":"","height":"35px","padding":"2,14,2,2","readonly":true,"width":"600px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridShopSearchResulats.selectedItem.product.description","targetProperty":"dataValue"}, {}]
						}]
					}],
					simpleForm1: ["wm.SimpleForm", {"fitToContentHeight":true,"height":"70px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"top","width":"600px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"dojoGridShopSearchResulats.selectedItem.product.inventories","targetProperty":"dataSet"}, {}]
						}],
						priceEditor1Panel: ["wm.Panel", {"desktopHeight":"35px","enableTouchHeight":true,"height":"70px","horizontalAlign":"left","mobileHeight":"70px","verticalAlign":"top","width":"100%"}, {}, {
							priceEditor1: ["wm.Currency", {"caption":"Price","captionSize":"80px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"price","height":"35px","readonly":true,"required":undefined,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"list2.selectedItem.product.inventories.price","targetProperty":"dataValue"}, {}]
								}]
							}],
							shippingEditor1: ["wm.Currency", {"caption":"Shipping","captionSize":"80px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"shipping","height":"35px","readonly":true,"required":undefined,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"list2.selectedItem.product.inventories.shipping","targetProperty":"dataValue"}, {}]
								}]
							}]
						}],
						panel1: ["wm.Panel", {"desktopHeight":"70px","enableTouchHeight":true,"height":"70px","horizontalAlign":"left","mobileHeight":"70px","verticalAlign":"top","width":"100%"}, {}, {
							currencyEditor1: ["wm.Text", {"caption":"Currency","captionSize":"80px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"currency","height":"35px","readonly":true,"required":undefined,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"list2.selectedItem.product.inventories.currency","targetProperty":"dataValue"}, {}]
								}]
							}],
							availabilityEditor1: ["wm.Text", {"caption":"Availability","captionSize":"80px","changeOnKey":true,"desktopHeight":"26px","emptyValue":"emptyString","formField":"availability","height":"35px","readonly":true,"required":undefined,"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"list2.selectedItem.product.inventories.availability","targetProperty":"dataValue"}, {}]
								}]
							}]
						}]
					}]
				}],
				bevel1: ["wm.Bevel", {"bevelSize":4,"height":"4px","width":"100%"}, {}],
				label2: ["wm.Label", {"caption":"About this Application","padding":"4","width":"133px"}, {"onclick":"layerAbout"}]
			}],
			layerAbout: ["wm.Layer", {"borderColor":"","caption":"layer2","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"PageAbout","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
			}]
		}]
	}]
}