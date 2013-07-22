/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
Form_Search.widgets = {
	filmLiveVar: ["wm.LiveVariable", {"liveSource":"com.sampledatadb.data.Film","maxResults":100}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"searchText.dataValue","targetProperty":"filter.title"}, {}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel53: ["wm.Panel", {"height":"679px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel65: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label38: ["wm.Label", {"_classes":{"domNode":["DemoHeader"]},"border":"0","caption":"Search List Detail","padding":"4","width":"166px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel66: ["wm.Panel", {"height":"622px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,10","verticalAlign":"top","width":"100%"}, {}, {
				panel68: ["wm.Panel", {"height":"618px","horizontalAlign":"left","verticalAlign":"top","width":"450px"}, {}, {
					label39: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label40: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> enter 2+ letters to filter grid. Select row in grid to see form with details for that row.","height":"42px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel4: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
						searchText: ["wm.Text", {"changeOnKey":true,"displayValue":"","placeHolder":"Enter name to search","resetButton":true,"width":"163px"}, {"onchange":"searchListFilmLiveVar"}]
					}],
					panel69: ["wm.Panel", {"height":"200px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel70: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"96px"}, {}],
						filmGrid: ["wm.DojoGrid", {"columns":[{"show":false,"id":"filmId","title":"FilmId","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"title","title":"Title","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"description","title":"Description","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":true,"id":"releaseYear","title":"ReleaseYear","width":"100px","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"rentalDuration","title":"RentalDuration","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"rentalRate","title":"RentalRate","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":true,"id":"length","title":"Length","width":"60px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"replacementCost","title":"ReplacementCost","width":"80px","displayType":"Number","noDelete":true,"align":"right","formatFunc":""},{"show":false,"id":"rating","title":"Rating","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""},{"show":false,"id":"specialFeatures","title":"SpecialFeatures","width":"100%","displayType":"Text","noDelete":true,"align":"left","formatFunc":""}],"localizationStructure":{},"margin":"4"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					label41: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label42: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"border":"0","caption":"Detailed information for the selected film","height":"38px","margin":"10,0,0,20","padding":"4","singleLine":false,"width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel71: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"0,0,0,100","verticalAlign":"middle","width":"100%"}, {}, {
						liveForm3: ["wm.LiveForm", {"captionSize":"140px","fitToContentHeight":true,"height":"178px","horizontalAlign":"left","readonly":true,"verticalAlign":"top"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"filmGrid.selectedItem","targetProperty":"dataSet"}, {}]
							}],
							filmIdEditor1: ["wm.Number", {"caption":"FilmId","captionSize":"140px","formField":"filmId","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
							titleEditor1: ["wm.Text", {"caption":"Title","captionSize":"140px","formField":"title","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
							descriptionEditor1: ["wm.Text", {"caption":"Description","captionSize":"140px","formField":"description","height":"48px","readonly":true,"singleLine":false,"width":"100%"}, {}],
							releaseYearEditor1: ["wm.Text", {"caption":"ReleaseYear","captionSize":"140px","formField":"releaseYear","height":"26px","readonly":true,"width":"100%"}, {}],
							rentalDurationEditor1: ["wm.Number", {"caption":"RentalDuration","captionSize":"140px","formField":"rentalDuration","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
							rentalRateEditor1: ["wm.Number", {"caption":"RentalRate","captionSize":"140px","formField":"rentalRate","height":"26px","readonly":true,"required":true,"width":"100%"}, {}],
							lengthEditor1: ["wm.Number", {"caption":"Length","captionSize":"140px","formField":"length","height":"26px","readonly":true,"width":"100%"}, {}],
							replacementCostEditor1: ["wm.Number", {"caption":"ReplacementCost","captionSize":"140px","formField":"replacementCost","height":"26px","readonly":true,"required":true,"showing":false,"width":"100%"}, {}],
							ratingEditor1: ["wm.Text", {"caption":"Rating","captionSize":"140px","formField":"rating","height":"26px","readonly":true,"width":"100%"}, {}],
							specialFeaturesEditor1: ["wm.Text", {"caption":"SpecialFeatures","captionSize":"140px","formField":"specialFeatures","height":"26px","readonly":true,"showing":false,"width":"100%"}, {}],
							liveForm3EditPanel: ["wm.EditPanel", {"disabled":true,"height":"32px","liveForm":"liveForm3","operationPanel":"operationPanel3","savePanel":"savePanel3","showing":false}, {}, {
								savePanel3: ["wm.Panel", {"disabled":true,"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
									saveButton3: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"liveForm3EditPanel.saveData"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"liveForm3EditPanel.formInvalid","targetProperty":"disabled"}, {}]
										}]
									}],
									cancelButton3: ["wm.Button", {"caption":"Cancel","disabled":true,"margin":"4"}, {"onclick":"liveForm3EditPanel.cancelEdit"}]
								}],
								operationPanel3: ["wm.Panel", {"disabled":true,"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
									newButton3: ["wm.Button", {"caption":"New","disabled":true,"margin":"4"}, {"onclick":"liveForm3EditPanel.beginDataInsert"}],
									updateButton3: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"liveForm3EditPanel.beginDataUpdate"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"liveForm3EditPanel.formUneditable","targetProperty":"disabled"}, {}]
										}]
									}],
									deleteButton3: ["wm.Button", {"caption":"Delete","margin":"4"}, {"onclick":"liveForm3EditPanel.deleteData"}, {
										binding: ["wm.Binding", {}, {}, {
											wire: ["wm.Wire", {"expression":undefined,"source":"liveForm3EditPanel.formUneditable","targetProperty":"disabled"}, {}]
										}]
									}]
								}]
							}]
						}]
					}]
				}],
				panel75: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel8: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel76: ["wm.EmphasizedContentPanel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html11: ["wm.Html", {"border":"0","height":"100%","html":"<p>Adding a search box makes it possible to search for specific data in a grid.</p>\n<p>The database widget automates the creation of a list-detail form.</p>\n<p>This example shows using a search box to filter a live variable to show database information matching the search string and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/DojoGrid\" target=\"_blank\">DojoGrid</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=select&amp;layer=list\">Select Menu</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}