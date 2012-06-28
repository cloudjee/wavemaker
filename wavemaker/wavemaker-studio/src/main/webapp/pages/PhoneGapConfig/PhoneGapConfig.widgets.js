/*
 * Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 

PhoneGapConfig.widgets = {
    PhoneGapImage: ["wm.TypeDefinition", {internal: true}, {}, {
	src: ["wm.TypeDefinitionField", {"fieldName":"src"}, {}],
	width: ["wm.TypeDefinitionField", {"fieldName":"width","fieldType":"Number"}, {}],
	height: ["wm.TypeDefinitionField", {"fieldName":"height","fieldType":"Number"}, {}],
	description: ["wm.TypeDefinitionField", {fieldName: "description", fieldType: "String"}],
	template: ["wm.TypeDefinitionField", {fieldName: "template", fieldType: "String"}]
    }],
    iconListVar: ["wm.Variable", {"isList":true,"type":"PhoneGapImage","json": dojo.toJson([
	{description: "Default (used for all devices except where better image is available)", width: 36, height: 36, src: "resources/images/logos/wavemaker_35x35.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"android\" gap:density=\"ldpi\" /><icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},
	{description: "iPhone Classic; 57x57", width: 57, height: 57, src: "", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},
	{description: "iPhone Retina Display; 72x72", width: 72, height: 72, src: "resources/images/logos/wavemaker_64x64.png", template: "<icon gap:platform=\"ios\" src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},
	{description: "iPad 114x114", width: 114, height: 114, src: "", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},

	{description: "Android Medium Density Screen 48x48", width: 48, height: 48, src: "resources/images/logos/wavemaker_35x35.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"android\" gap:density=\"mdpi\" />"},
	{description: "Android High Density Screen 72x72", width: 72, height: 72, src: "resources/images/logos/wavemaker_64x64.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"android\" gap:density=\"hdpi\" />"},
	{description: "Android Extra-High Density Screen 96x96 (may not be supported by phonegap yet)", width: 96, height: 96, src: "", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"android\" gap:density=\"xdpi\" />"},
	{description: "Blackberry 55x55", width: 55, height: 55, src: "resources/images/logos/wavemaker_35x35.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"blackberry\" />"},
	{description: "Blackberry (hover), 55x55", width: 55, height: 55, src: "", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"blackberry\" gap:state=\"hover\" />"},
	{description: "WebOS 64x64", width: 64, height: 64, src: "resources/images/logos/wavemaker_64x64.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"webos\" />"},
	{description: "Windows Mobile Small Application Tile; 62x62", width: 62, height: 62, src: "resources/images/logos/wavemaker_64x64.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"winphone\" gap:role=\"background\" />"},
/*	{description: "Windows Mobile Large Application Tile; 173x173", width: 173, height: 173, src: ""},*/
	{description: "Windows Mobile Application Bar; 48x48", width: 48, height: 48, src: "resources/images/logos/wavemaker_35x35.png", template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" gap:platform=\"winphone\" />"}
    ])}],
    
    splashListVar: ["wm.Variable", {"isList":true, type: "PhoneGapImage", json: dojo.toJson([
	{description: "Standard Small Image; 240x360", width: 240, height: 360, src: "resources/images/logos/wavemaker_240x360.png", template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" /><gap:splash src=\"${src}\" gap:platform=\"android\" gap:density=\"ldpi\"/>"},
	{description: "Standard Medium Image; 320x480", width: 320, height: 480, src: "resources/images/logos/wavemaker_320x480.png", template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" /><gap:splash src=\"${src}\" gap:platform=\"android\" gap:density=\"hdpi\"/><gap:splash src=\"${src}\"  gap:platform=\"blackberry\" /><gap:splash src=\"${src}\" gap:platform=\"winphone\" /><gap:splash src=\"${src}\" gap:platform=\"android\" gap:density=\"mdpi\"/>"},
	{description: "iPhone Retina; 640x960", width: 640, height: 960, src: "", template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},
	{description: "iPad Landscape; 1024x768", width: 1024, height: 768, src: "", template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"},
	{description: "iPad Portrait; 768x1024", width: 768, height: 1024, src: "", template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"}

    ])}],
    domainsVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
    layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		mainPanel: ["wm.studio.DialogMainPanel", {"padding":"5"}, {}, {
		    tabLayers1: ["wm.TabLayers", {_classes: {domNode: ["StudioTabs", "NoRightMarginOnTab","TransparentTabBar", "StudioDarkLayers"]}, width: "100%", height: "100%", clientBorder: "1",clientBorderColor: "#959DAB", _lockHeaderHeight:1, headerHeight: "32px"}, {}, {
				requiredLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Required Info","horizontalAlign":"left","margin":"0","padding":"10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					formPanel1: ["wm.FormPanel", {"captionAlign":"left","captionSize":"140px","desktopHeight":"254px","height":"254px","type":"wm.FormPanel"}, {}, {
					    appName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Application Name","captionAlign":"left","captionSize":"140px","dataValue":"","desktopHeight":"26px","displayValue":"","emptyValue":"emptyString","height":"26px","helpText":"Enter the name you want users to see when looking at their device's home screen or application list","required":1,"width":"100%"}, {}],
					    xhrPath: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, "caption":"Server Path","captionAlign":"left","captionSize":"140px","dataValue":undefined,"displayValue":"","helpText":"Enter the path that you want this application to use to send requests to your server","width":"100%", restrictValues: 0}, {onchange: "xhrPathChange"}],
						html1: ["wm.Html", {"border":"0","html":"After generating your phonegap build, you will need to upload it to build.phonegap.com.  If you do not yet have an account there, its free to sign up, and free to upload simple applications to their site    ","margin":"10","minDesktopHeight":15}, {}]
					}]
				}],
				descriptionLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Descriptive Info","horizontalAlign":"left","margin":"0","padding":"10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					formPanel2: ["wm.FormPanel", {"captionAlign":"left","captionSize":"140px","desktopHeight":"234px","height":"234px","type":"wm.FormPanel"}, {}, {
						appId: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Application ID","captionAlign":"left","captionSize":"140px","dataValue":"","desktopHeight":"26px","displayValue":"","emptyValue":"emptyString","height":"26px","helpText":"Needs to be of the form com.mycompany.projectName","required":1,"width":"100%"}, {}],
						appVersion: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Version","captionAlign":"left","captionSize":"140px","dataValue":"","desktopHeight":"26px","displayValue":"","emptyValue":"emptyString","height":"26px","width":"100%"}, {}],
						appDescription: ["wm.LargeTextArea", {_classes: {domNode: ["StudioEditor"]}, "caption":"Description","captionPosition":"left","captionSize":"140px","dataValue":"","desktopHeight":"100px","displayValue":"","emptyValue":"emptyString","height":"100px","width":"100%"}, {}],
						appAuthorName: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Developer Name","captionAlign":"left","captionSize":"140px","desktopHeight":"26px","displayValue":"A WaveMaker Studio User","emptyValue":"emptyString","height":"26px","width":"100%"}, {}],
						appAuthorUrl: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Developer URL","captionAlign":"left","captionSize":"140px","dataValue":"","desktopHeight":"26px","displayValue":"","emptyValue":"emptyString","height":"26px","width":"100%"}, {}],
						appAuthorEmail: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, "caption":"Developer Email","captionAlign":"left","captionSize":"140px","dataValue":"","desktopHeight":"26px","displayValue":"","emptyValue":"emptyString","height":"26px","width":"100%"}, {}]
					}]
				}],
				devicesLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Device Settings","horizontalAlign":"left","margin":"0","padding":"10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					formPanel4: ["wm.FormPanel", {"captionAlign":"left","captionSize":"160px","desktopHeight":"108px","height":"108px","type":"wm.FormPanel"}, {}, {
						appOrientation: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, "caption":"Orientation","captionAlign":"left","captionSize":"160px","dataField":"dataValue","dataValue":"default","desktopHeight":"26px","displayField":"dataValue","displayValue":"default","height":"26px","helpText":"default means both landscape and portrait","options":"default, landscape, portrait","width":"100%"}, {}],
						appFullscreen: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, "caption":"Full screen","captionAlign":"left","captionSize":"160px","desktopHeight":"26px","displayValue":false,"height":"26px","helpText":"Hides the device's status bar","width":"100%"}, {}],
						iosPrerenderedIcon: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, "caption":"IOS: prerendered-icon","captionAlign":"left","captionSize":"160px","desktopHeight":"26px","displayValue":false,"height":"26px","helpText":"If icon is prerendered, IOS will not apply its gloss to your icon on the user's home screen","mobileHeight":"100%","width":"100%"}, {}],
					    iosStatusBarStyle: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, "caption":"IOS: Status Bar Style","captionAlign":"left","captionSize":"160px","dataField":"dataValue","dataValue":"default","desktopHeight":"26px","displayField":"dataValue","displayValue":"default","height":"26px","options":"default,black-opaque,black-translucent","width":"100%"}, {}]
					}]
				}],
				graphicsLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Graphics","horizontalAlign":"left","margin":"0","padding":"10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
				    label1: ["wm.Label", {"border":"0","caption":"The icons you provide will be used to represent your application on the device's home screen and application list. PNG files only.","height":"50px","padding":"2,4,0,4","width":"100%", singleLine: false}, {}],
					iconGridPanel: ["wm.Panel", {"height":"147px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					    iconGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"sample","title":"-","width":"80px","align":"left","formatFunc":"wm_image_formatter", "expression":"${src} ? '/wavemaker/projects/' + studio.project.projectName + '/' + ${src} : ''","mobileColumn":false},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"src","title":"Path to Icons","width":"150px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","mobileColumn":false},{"show":true,"field":"width","title":"Width (px)","width":"60px","align":"right","formatFunc":"","fieldType":"dojox.grid.cells.NumberTextBox","mobileColumn":false},{"show":true,"field":"height","title":"Height (px)","width":"70px","align":"right","formatFunc":"","fieldType":"dojox.grid.cells.NumberTextBox","mobileColumn":false}],"deleteColumn":false,"height":"147px","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"iconListVar","targetProperty":"dataSet"}, {}]
							}]
						}]/*,
						panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"120px"}, {}, {
						    addIconButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Icon","margin":"4","width":"100%"}, {"onclick":"iconGrid.addEmptyRow"}],
							iconHelpLink: ["wm.Label", {"align":"center","border":"0","caption":"Help","link":"https://build.phonegap.com/docs/config-xml","padding":"4","width":"100%"}, {}]
						}]*/
					}],
					label2: ["wm.Label", {"border":"0","caption":"The Splash screen images you provide will be used  for different device sizes and device orientations while your application is loading. PNG files only.","height":"50px","padding":"10,4,0,4","width":"100%"}, {}],
					iconGridPanel1: ["wm.Panel", {"height":"147px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						splashGrid: ["wm.DojoGrid", {"columns":[{"show":true,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":true,"field":"src","title":"Path to Splash Screen Images","width":"150px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","mobileColumn":false},{"show":true,"field":"width","title":"Width (px)","width":"60px","align":"right","formatFunc":"","fieldType":"dojox.grid.cells.NumberTextBox","mobileColumn":false},{"show":true,"field":"height","title":"Height (px)","width":"70px","align":"right","formatFunc":"","fieldType":"dojox.grid.cells.NumberTextBox","mobileColumn":false}],"deleteColumn":false,"height":"147px","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"splashListVar","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
				    samplePicture: ["wm.Picture", {width: "1px", height: "1px", border:"1",borderColor: "#333"}, {}, {
					binding: ["wm.Binding", {}, {}, {
					    wire: ["wm.Wire", {"expression":undefined,"source":"splashGrid.selectedItem.src","targetProperty":"source"}, {}],
					    wire1: ["wm.Wire", {"expression":undefined,"expression":"${splashGrid.selectedItem.width}+'px'","targetProperty":"width"}, {}],
					    wire2: ["wm.Wire", {"expression":undefined,"expression":"${splashGrid.selectedItem.height}+'px'","targetProperty":"height"}, {}]
					}]
				    }]
				}],
				permissionsLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Permissions","horizontalAlign":"left","margin":"0","padding":"10","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
				    features: ["wm.CheckboxSet", {_classes: {domNode: ["StudioEditor"]}, "caption":undefined,"captionSize":"120px","dataField":"dataValue","dataValue":["http://api.phonegap.com/1.0/network","http://api.phonegap.com/1.0/notification","http://api.phonegap.com/1.0/geolocation","http://api.phonegap.com/1.0/camera","http://api.phonegap.com/1.0/contacts"],"desktopHeight":"180px","displayField":"dataValue","displayValue":"http://api.phonegap.com/1.0/network, http://api.phonegap.com/1.0/notification, http://api.phonegap.com/1.0/geolocation, http://api.phonegap.com/1.0/camera, http://api.phonegap.com/1.0/contacts, http://api.phonegap.com/1.0/file","editorBorder":false,"height":"180px","mobileHeight":"100%","options":"http://api.phonegap.com/1.0/network,http://api.phonegap.com/1.0/notification,http://api.phonegap.com/1.0/geolocation,http://api.phonegap.com/1.0/camera,http://api.phonegap.com/1.0/contacts,http://api.phonegap.com/1.0/file,http://api.phonegap.com/1.0/media,http://api.phonegap.com/1.0/battery","width":"100%"}, {onchange: "onPermissionsChange"}],
				    label3: ["wm.Label", {showing: 0, "border":"0","caption":"You can use * as a value to allow access to all domains.  Enter the domains that your application is allowed to send requests to","height":"50px","padding":"10,4,0,4","width":"100%"}, {}],
					domainGridPanel: ["wm.Panel", {showing: 0, "height":"147px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					    domainsGrid: ["wm.DojoGrid", {_classes: {domNode: ['StudioGrid']}, "columns":[{"show":true,"field":"name","title":"Domain","width":"100%","align":"left","formatFunc":"","fieldType":"dojox.grid.cells._Widget","mobileColumn":false},{"show":true,"field":"dataValue","title":"Allow Subdomains","width":"120px","align":"left","formatFunc":"","fieldType":"dojox.grid.cells.Bool","mobileColumn":false}],"deleteColumn":true,"height":"147px","localizationStructure":{},"margin":"4","minDesktopHeight":60,"singleClickEdit":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"domainsVar","targetProperty":"dataSet"}, {}]
							}]
						}],
						panel6: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"120px"}, {}, {
							addDomainButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, "caption":"Add Domain","margin":"4","width":"100%"}, {"onclick":"iconGrid.addEmptyRow"}]
						}]
					}]
				}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"2,0,2,0","verticalAlign":"top","width":"100%"}, {}, {
			CancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Cancel","margin":"4"}, {"onclick":"cancelClick"}],
			OKButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"OK","margin":"4"}, {"onclick":"okClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"source":"layoutBox1.invalid","targetProperty":"disabled"}, {}]
				}]
			}]
		}]
	}]
}