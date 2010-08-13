FlirckPage.widgets = {
	BuscarFotos: ["wm.ServiceVariable", {service: "FlickrPhotoSearch", operation: "search"}, {onBeforeUpdate: "BuscarFotosBeforeUpdate", onSuccess: "BuscarFotosSuccess", onError: "BuscarFotosError", onResult: "BuscarFotosResult"}, {
		input: ["wm.ServiceInput", {type: "searchInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "apiKey", source: "editor1.dataValue"}, {}],
				wire1: ["wm.Wire", {targetProperty: "text", source: "editor2.dataValue"}, {}]
			}]
		}]
	}],
	infoPhoto: ["wm.ServiceVariable", {service: "FlickrPhotoInfo", operation: "getInfo"}, {}, {
		input: ["wm.ServiceInput", {type: "getInfoInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {targetProperty: "apiKey", source: "editor1.dataValue"}, {}],
				wire1: ["wm.Wire", {targetProperty: "photoId", source: "list1.selectedItem.id"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {height: "100%", width: "100%", horizontalAlign: "left", verticalAlign: "top"}, {}, {
		template1: ["wm.Template", {_classes: {domNode: ["wm_SilverBlueTheme_MainOutsetPanel", "wm_BackgroundChromeBar_LightGray"]}, width: "100%", height: "106px", verticalAlign: "top", horizontalAlign: "left", padding: "8", layoutKind: "left-to-right"}, {}, {
			appNameLabel: ["wm.Label", {_classes: {domNode: ["wm_FontSize_200percent", "wm_FontColor_Blue"]}, caption: "Flickr Service", height: "75px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			picture2: ["wm.Picture", {height: "89px", width: "200px", source: "flickr_logo.png", border: "1", borderColor: "#ff0d8a"}, {}]
		}],
		panel1: ["wm.Panel", {height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
			panel2: ["wm.Panel", {height: "45px", layoutKind: "left-to-right", border: "1", padding: "6", horizontalAlign: "left", verticalAlign: "top", borderColor: "#FF0D8A", width: "100%"}, {}, {
				editor1: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "Api Key :", height: "30px", captionSize: "60px", displayValue: "4617f3f1fd02d1c3db905cb3cdb89718", width: "368px"}, {}, {
					editor: ["wm._TextEditor", {}, {}]
				}],
				spacer1: ["wm.Spacer", {height: "29px", width: "8px"}, {}],
				editor2: ["wm.Editor", {_classes: {captionNode: ["wm_FontColor_White"]}, caption: "Title :", height: "30px", captionSize: "60px", width: "244px"}, {onchange: "BuscarFotos"}, {
					editor: ["wm._TextEditor", {changeOnEnter: true}, {}]
				}],
				spacer2: ["wm.Spacer", {height: "31px", width: "7px"}, {}],
				button1: ["wm.Button", {width: "96px", height: "33px", caption: "Search", borderColor: "#1180DD"}, {onclick: "BuscarFotos"}],
				label2: ["wm.Label", {_classes: {domNode: ["wm_FontSizePx_12px", "wm_TextDecoration_Bold", "wm_TextAlign_Right"]}, caption: "Loading ...    ", height: "33px", width: "100%", padding: "8", showing: false}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			label1: ["wm.Label", {_classes: {domNode: ["wm_BackgroundChromeBar_Yellow"]}, caption: "To use the Flickr API you need to have an application key. Please get yours   <a href=\"http://www.flickr.com/services/api/keys/\">here</a>  &nbsp;   |    &nbsp;&nbsp;&nbsp;    Ej. Api key 4617f3f1fd02d1c3db905cb3cdb89718 .", height: "22px", width: "100%"}, {}, {
				format: ["wm.DataFormatter", {}, {}]
			}],
			panel4: ["wm.Panel", {height: "100%", layoutKind: "left-to-right", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
				list1: ["wm.List", {height: "150%", dataFields: "title", toggleSelect: true, width: "330px"}, {onselect: "list1Select"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {targetProperty: "dataSet", source: "BuscarFotos.photos.photos"}, {}]
					}]
				}],
				splitter1: ["wm.Splitter", {width: "4px", height: "100%", layout: "left"}, {}],
				panel5: ["wm.Panel", {height: "100%", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
					panel6: ["wm.Panel", {height: "132px", horizontalAlign: "left", verticalAlign: "top", width: "100%"}, {}, {
						editor3: ["wm.Editor", {caption: "Owner", captionSize: "80px", border: "1", width: "100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "displayValue", source: "infoPhoto.photo.owner.username"}, {}]
							}],
							editor: ["wm._TextEditor", {editorBorder: false}, {}]
						}],
						editor4: ["wm.Editor", {caption: "Date", captionSize: "80px", border: "1", width: "100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "displayValue", source: "infoPhoto.photo.dates.taken"}, {}]
							}],
							editor: ["wm._TextEditor", {editorBorder: false}, {}]
						}],
						editor5: ["wm.Editor", {caption: "Location", captionSize: "80px", border: "1", width: "150%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "displayValue", source: "infoPhoto.photo.owner.location"}, {}]
							}],
							editor: ["wm._TextEditor", {editorBorder: false}, {}]
						}],
						editor6: ["wm.Editor", {caption: "Description", captionSize: "80px", border: "1", width: "100%", singleLine: false}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "displayValue", source: "infoPhoto.photo.description"}, {}]
							}],
							editor: ["wm._TextEditor", {editorBorder: false}, {}]
						}],
						editor7: ["wm.Editor", {caption: "Comments", captionSize: "80px", border: "1", width: "100%", singleLine: false}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "displayValue", source: "infoPhoto.photo.comments"}, {}]
							}],
							editor: ["wm._TextEditor", {editorBorder: false}, {}]
						}]
					}],
					splitter2: ["wm.Splitter", {width: "100%", height: "4px"}, {}],
					panel3: ["wm.Panel", {height: "100%", layoutKind: "left-to-right", horizontalAlign: "center", verticalAlign: "middle", width: "100%"}, {}, {
						picture1: ["wm.Picture", {height: "417px", width: "559px", border: "1", padding: "10", borderColor: "#EBEBEB", autoSize: true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {targetProperty: "link", source: "infoPhoto.photo.urls.url.value"}, {}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}