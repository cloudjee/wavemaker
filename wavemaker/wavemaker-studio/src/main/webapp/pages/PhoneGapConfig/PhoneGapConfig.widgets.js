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
    layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"},{}, {
        mainPanel: ["wm.studio.DialogMainPanel", {},{}, {
			appDescriptorPanel: ["wm.FancyPanel", {"height":"204px","title":"Application Description"}, {}, {
			    formPanel1: ["wm.FormPanel", {"height":"100%"}, {}, {
				appName: ["wm.Text", {required: 1, "caption":"Application Name","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}],
				appId: ["wm.Text", {required: 1, "caption":"Application ID","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%", helpText: "Needs to be of the form com.mycompany.projectName"}, {}],
				appVersion: ["wm.Text", {"caption":"Version","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}],
				appDescription: ["wm.LargeTextArea", {"caption":"Description","captionAlign":"right","captionPosition":"left","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","displayValue":"","width":"100%", height: "100%"}, {}]
			    }]
			}],
	    imagesPanel: ["wm.FancyPanel", {"title":"Graphics", height: "90px"}, {}, {
					iconPanel1: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						appIconUrl: ["wm.Text", {"caption":"Icon Path","captionSize":"100px","dataValue":"resources/images/logos/favicon.ico","desktopHeight":"26px","displayValue":"resources/images/logos/favicon.ico","height":"26px","helpText":"Pick an image from your resources folder using a path: resources/path-to-image","placeHolder":"resources/images/logos/favicon.ico","width":"100%"}, {}],
						appIconWidth: ["wm.Number", {"caption":"Width","captionSize":"50px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100px"}, {}],
						appIconHeight: ["wm.Number", {"caption":"Height","captionSize":"50px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100px"}, {}]
					}],
					splashPanel1: ["wm.Panel", {"height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						appSplashUrl: ["wm.Text", {"caption":"Splash Icon Path","captionSize":"100px","dataValue":"resources/images/logos/favicon.ico","desktopHeight":"26px","displayValue":"resources/images/logos/favicon.ico","height":"26px","helpText":"Pick an image from your resources folder using a path: resources/path-to-image","placeHolder":"resources/images/logos/favicon.ico","width":"100%"}, {}],
						appSplashWidth: ["wm.Number", {"caption":"Width","captionSize":"50px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100px"}, {}],
						appSplashHeight: ["wm.Number", {"caption":"Height","captionSize":"50px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100px"}, {}]
					}]
				}],

			panel4: ["wm.Panel", {"height":"118px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			    authorPanel: ["wm.FancyPanel", {"height":"100%","title":"Author Info","width":"50%"}, {}, {
					appAuthorUrl: ["wm.Text", {"caption":"URL","captionSize":"70px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}],
					appAuthorEmail: ["wm.Text", {"caption":"Email","captionSize":"70px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}],
					appAuthorName: ["wm.Text", {"caption":"Full Name","captionSize":"70px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","width":"100%"}, {}]
				}],

				generalSettingsPanel: ["wm.FancyPanel", {"title":"General Settings","width":"100%"}, {}, {
				    formPanel2: ["wm.FormPanel", {"height":"100%", captionSize: "80px"}, {}, {
					appOrientation: ["wm.SelectMenu", {"caption":"Orientation","captionSize":"80px","dataField":"dataValue","dataValue":"default","desktopHeight":"26px","displayField":"dataValue","displayValue":"default","height":"26px","helpText":"default means both landscape and portrait","options":"default, landscape, portrait","width":"100%"}, {}],
					appFullscreen: ["wm.Checkbox", {"caption":"Full screen","captionSize":"80px","desktopHeight":"26px","displayValue":false,"height":"26px","helpText":"Hides the device's status bar","width":"100%"}, {}]
				    }]
				}]
			}],
			panel5: ["wm.Panel", {"height":"292px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			    IOSPanel: ["wm.FancyPanel", {"width":"50%","title":"IOS Only"}, {}, {
				formPanel3: ["wm.FormPanel", {"height":"100%"}, {}, {
				    iosPrerenderedIcon: ["wm.Checkbox", {"caption":"prerendered-icon","captionSize":"100px","desktopHeight":"26px","displayValue":false,"height":"26px","helpText":"If icon is prerendered, IOS will not apply its gloss to your icon on the user's home screen","mobileHeight":"100%","width":"100%"}, {}],
				    iosStatusBarStyle: ["wm.SelectMenu", {"caption":"Status Bar Style","captionSize":"100px","dataField":"dataValue","dataValue":"default","desktopHeight":"26px","displayField":"dataValue","displayValue":"default","height":"26px","options":"default,black-opaque,black-translucent","width":"100%"}, {}]
				}]
			    }],
			    permissionsPanel: ["wm.FancyPanel", {width: "100%", "title":"Permissions"}, {}, {
					permisionsSet: ["wm.CheckboxSet", {"caption":undefined,"captionSize":"120px","dataField":"dataValue","dataValue":["http://api.phonegap.com/1.0/network","http://api.phonegap.com/1.0/notification","http://api.phonegap.com/1.0/geolocation","http://api.phonegap.com/1.0/camera","http://api.phonegap.com/1.0/contacts"],"desktopHeight":"180px","displayField":"dataValue","displayValue":"http://api.phonegap.com/1.0/network, http://api.phonegap.com/1.0/notification, http://api.phonegap.com/1.0/geolocation, http://api.phonegap.com/1.0/camera, http://api.phonegap.com/1.0/contacts","editorBorder":false,"height":"171px","mobileHeight":"100%","options":"http://api.phonegap.com/1.0/network,http://api.phonegap.com/1.0/notification,http://api.phonegap.com/1.0/geolocation,http://api.phonegap.com/1.0/camera,http://api.phonegap.com/1.0/contacts,http://api.phonegap.com/1.0/file,http://api.phonegap.com/1.0/media,http://api.phonegap.com/1.0/file,http://api.phonegap.com/1.0/battery","width":"100%"}, {}],
					panel1: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					    access1: ["wm.Text", {"caption":"Allow Domains","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","placeHolder":"*","width":"251px", helpText: "Enter * to allow all domains; else the application can only directly send reqeusts to those domains listed here"}, {}],
						accessSubDomains1: ["wm.Checkbox", {"caption":"Allow Subdomains","captionSize":"100%","desktopHeight":"26px","displayValue":false,"height":"26px","width":"100%"}, {}]
					}],
					panel2: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						access2: ["wm.Text", {"caption":"More Domains","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","placeHolder":"","width":"251px"}, {}],
						accessSubDomains2: ["wm.Checkbox", {"caption":"Allow Subdomains","captionSize":"100%","desktopHeight":"26px","displayValue":false,"height":"26px","width":"100%"}, {}]
					}],
					panel3: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						access3: ["wm.Text", {"caption":"More Domains","captionSize":"120px","dataValue":undefined,emptyValue: "emptyString","desktopHeight":"26px","displayValue":"","height":"26px","placeHolder":"","width":"251px"}, {}],
						accessSubDomains3: ["wm.Checkbox", {"caption":"Allow Subdomains","captionSize":"100%","desktopHeight":"26px","displayValue":false,"height":"26px","width":"100%"}, {}]
					}]
				}]
			}]

	}],
	    buttonBar: ["wm.Panel", {_classes: {domNode: ["dialogfooter"]}, height: "20px", "horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%", padding: "2,0,2,0", border: "1,0,0,0", height: "34px", horizontalAlign: "right"}, {}, {
		CancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "Cancel"}, {onclick: "cancelClick"}],
		OKButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]},caption: "OK"}, {onclick: "okClick"}, {
		    binding: ["wm.Binding", {},{},{
			wire: ["wm.Wire", {targetProperty: "disabled", source: "layoutBox1.invalid"}]
		    }]
		}]
	    }]
    }]
}
