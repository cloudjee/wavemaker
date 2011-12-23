MainPage.widgets = {
	gotoLayer3: ["wm.NavigationCall", {
		operation: "gotoLayer"
	}, {
	}, {
		input: ["wm.ServiceInput", {
			type: "gotoLayerInputs"
		}, {
		}, {
			binding: ["wm.Binding", {
			}, {
			}, {
				wire: ["wm.Wire", {
					targetProperty: "layer",
					source: "layer3"
				}, {
				}]
			}]
		}]
	}],
	gotoLayer2: ["wm.NavigationCall", {
		operation: "gotoLayer"
	}, {
	}, {
		input: ["wm.ServiceInput", {
			type: "gotoLayerInputs"
		}, {
		}, {
			binding: ["wm.Binding", {
			}, {
			}, {
				wire: ["wm.Wire", {
					targetProperty: "layer",
					source: "layer2"
				}, {
				}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {
		box: "v",
		height: "1flex"
	}, {
	}, {
		panelMain: ["wm.Panel", {
			box: "v",
			height: "1flex"
		}, {
		}, {
			topHeader: ["wm.Panel", {
				box: "h",
				height: "40px"
			}, {
			}, {
				panel11: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}],
				panel12: ["wm.Panel", {
					box: "h",
					width: "780px"
				}, {
				}, {
					panel9: ["wm.Panel", {
						box: "v",
						width: "1flex"
					}, {
					}],
					panel18: ["wm.Panel", {
						box: "v",
						width: "180px"
					}, {
					}, {
						panel19: ["wm.Panel", {
							box: "h",
							height: "1flex"
						}, {
						}]
					}]
				}],
				panel13: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}]
			}],
			panelHeader: ["wm.Panel", {
				box: "h",
				height: "92px"
			}, {
			}, {
				panel2: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}],
				panelHdrBorder: ["wm.Panel", {
					box: "h",
					width: "780px"
				}, {
				}, {
					panel17: ["wm.Panel", {
						box: "h",
						width: "1flex",
						boxPosition: "topLeft"
					}, {
					}, {
						picture2: ["wm.Picture", {
							_classes: {
								domNode: ["wm_Border_Size2px", "wm_Border_StyleSolid", "wm_Border_ColorGraphite"]
							},
							source: "http://www.wavemaker.com/img/logo_wavemaker.gif",
							height: "48px",
							width: "1flex"
						}, {
							onclick: "gotoLayer3"
						}],
						picture1: ["wm.Picture", {
							_classes: {
								domNode: ["wm_Border_Size2px", "wm_Border_StyleSolid", "wm_Border_ColorGraphite", "wm_Border_LeftNone"]
							},
							source: "http://www.xignite.com/Images/xignite_logo.gif",
							width: "1flex"
						}, {
						}]
					}]
				}],
				panel4: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}]
			}],
			body: ["wm.Panel", {
				box: "h",
				height: "1flex"
			}, {
			}, {
				panel8: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}],
				panelContent: ["wm.Panel", {
					box: "v",
					width: "780px"
				}, {
				}, {
					pane1: ["wm.PageContainer", {
						pageName: "ContentPage",
						height: "1flex"
					}, {
					}]
				}],
				panel10: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}]
			}],
			footer: ["wm.Panel", {
				_classes: {
					domNode: ["wm_Padding_2px"]
				},
				box: "h",
				height: "32px",
				boxPosition: "center"
			}, {
			}, {
				panel14: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}],
				panelFooter: ["wm.Panel", {
					box: "v",
					width: "780px"
				}, {
				}, {
					labelFooter: ["wm.Label", {
						_classes: {
							domNode: ["wm_TextAlign_Center", "wm_Padding_10px"]
						},
						caption: "Copyright @ 2008 Powered By WaveMaker",
						height: "1flex",
						width: "70px"
					}, {
					}, {
						format: ["wm.DataFormatter", {
						}, {
						}]
					}]
				}],
				panel16: ["wm.Panel", {
					box: "v",
					width: "1flex"
				}, {
				}]
			}],
			bottomFooter: ["wm.Panel", {
				box: "h",
				height: "30px"
			}, {
			}]
		}]
	}]
}
