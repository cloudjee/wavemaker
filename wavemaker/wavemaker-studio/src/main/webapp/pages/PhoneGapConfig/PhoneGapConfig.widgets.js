/*
 * Copyright (C) 2011-2013 VMware, Inc. All rights reserved.
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
    PhoneGapImage: ["wm.TypeDefinition",
    {
        internal: true
    }, {}, {
        imageId: ["wm.TypeDefinitionField",
        {
            "fieldName": "imageId"
        }, {}],
        src: ["wm.TypeDefinitionField",
        {
            "fieldName": "src"
        }, {}],
        imageType: ["wm.TypeDefinitionField",
        {
            fieldName: "imageType",
            fieldType: "String"
        }],
        width: ["wm.TypeDefinitionField",
        {
            "fieldName": "width",
            "fieldType": "Number"
        }, {}],
        height: ["wm.TypeDefinitionField",
        {
            "fieldName": "height",
            "fieldType": "Number"
        }, {}],
        description: ["wm.TypeDefinitionField",
        {
            fieldName: "description",
            fieldType: "String"
        }],
        template: ["wm.TypeDefinitionField",
        {
            fieldName: "template",
            fieldType: "String"
        }]
    }],
    /* http://developer.apple.com/library/ios/#documentation/userexperience/conceptual/mobilehig/IconsImages/IconsImages.html */
    iosIconListVar: ["wm.Variable",
    {
        isList: true,
        type: "PhoneGapImage",
        json: dojo.toJson([{
            imageId: 1,
            description: "iPhone Classic",
            imageType: "Icon",
            width: 57,
            height: 57,
            src: "resources/images/logos/IOS/wavemaker_57x57.png",
            template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 2,
            description: "iPhone Retina",
            imageType: "Icon",
            width: 72,
            height: 72,
            src: "resources/images/logos/IOS/wavemaker_72x72.png",
            template: "<icon gap:platform=\"ios\" src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 3,
            description: "iPad",
            imageType: "Icon",
            width: 114,
            height: 114,
            src: "resources/images/logos/IOS/wavemaker_114x114.png",
            template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 4,
            description: "iPad Retina",
            imageType: "Icon",
            width: 144,
            height: 144,
            src: "resources/images/logos/IOS/wavemaker_144x144.png",
            template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 5,
            description: "IPhone Classic",
            imageType: "Splash Screen",
            width: 320,
            height: 480,
            src: "resources/images/logos/IOS/wavemaker_320x480.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />\n\t<gap:splash src=\"${src}\"  gap:platform=\"blackberry\" />\n\t<gap:splash src=\"${src}\" gap:platform=\"winphone\" />"
        }, {
            imageId: 6,
            description: "iPhone Retina",
            imageType: "Splash Screen",
            width: 640,
            height: 960,
            src: "resources/images/logos/IOS/wavemaker_640x960.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 7,
            description: "iPad Portrait",
            imageType: "Splash Screen",
            width: 768,
            height: 1004,
            src: "resources/images/logos/IOS/wavemaker_768x1004.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 8,
            description: "iPad Landscape",
            imageType: "Splash Screen",
            width: 1024,
            height: 748,
            src: "resources/images/logos/IOS/wavemaker_1024x748.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 9,
            description: "iPad Retina Portrait",
            imageType: "Splash Screen",
            width: 1536,
            height: 2008,
            src: "resources/images/logos/IOS/wavemaker_1536x2008.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }, {
            imageId: 10,
            description: "iPad Retina Landscape",
            imageType: "Splash Screen",
            width: 2048,
            height: 1496,
            src: "resources/images/logos/IOS/wavemaker_2048x1496.png",
            template: "<gap:splash src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }])
    }],
        androidIconListVar: ["wm.Variable",
 {
     isList: true,
     type: "PhoneGapImage",
     json: dojo.toJson([{
         imageId: 1,
         description: "Low Density Screen",
         imageType: "Icon",
         width: 36,
         height: 36,
         src: "resources/images/logos/Android/wavemaker_36x36.png",
         template: "<icon src=\"${src}\"  gap:platform=\"android\" gap:density=\"ldpi\"  />"
     }, {
         imageId: 2,
         description: "Medium Density Screen",
         imageType: "Icon",
         width: 48,
         height: 48,
         src: "resources/images/logos/Android/wavemaker_48x48.png",
         template: "<icon src=\"${src}\"  gap:platform=\"android\" gap:density=\"mdpi\"  />"
     }, {
         imageId: 3,
         description: "High Density Screen",
         imageType: "Icon",
         width: 72,
         height: 72,
         src: "resources/images/logos/Android/wavemaker_72x72.png",
         template: "<icon src=\"${src}\"  gap:platform=\"android\" gap:density=\"hdpi\"  />"
     }, {
         imageId: 4,
         description: "Extra High Density Screen",
         imageType: "Icon",
         width: 96,
         height: 96,
         src: "resources/images/logos/Android/wavemaker_96x96.png",
         template: "<icon src=\"${src}\"  gap:platform=\"android\" gap:density=\"xhdpi\"  />"
     }, {
         imageId: 5,
         description: "Low Density Screen",
         imageType: "Splash Screen",
         width: 320,
         height: 480,
         src: "resources/images/logos/Android/wavemaker_320x480.png",
         template: "<gap:splash src=\"${src}\"  gap:platform=\"android\" gap:density=\"ldpi\"  />"
     }, {
         imageId: 6,
         description: "Medium Density Screen",
         imageType: "Splash Screen",
         width: 640,
         height: 960,
         src: "resources/images/logos/Android/wavemaker_640x960.png",
         template: "<gap:splash src=\"${src}\"  gap:platform=\"android\" gap:density=\"mdpi\"  />"
     }, {
         imageId: 7,
         description: "High Density Screen",
         imageType: "Splash Screen",
         width: 768,
         height: 1024,
         src: "resources/images/logos/Android/wavemaker_768x1024.png",
         template: "<gap:splash src=\"${src}\"  gap:platform=\"android\" gap:density=\"hdpi\"  />"
     }, {
         imageId: 8,
         description: "Extra High Density Screen",
         imageType: "Splash Screen",
         width: 1024,
         height: 1364,
         src: "resources/images/logos/Android/wavemaker_1024x1364.png",
         template: "<gap:splash src=\"${src}\"  gap:platform=\"android\" gap:density=\"xhdpi\"  />"
     }
     ])
 }],
    otherIconListVar: ["wm.Variable",
    {
        "isList": true,
        "type": "PhoneGapImage",
        "json": dojo.toJson([{
            imageId: 1,
            description: "Windows Mobile",
            imageType: "Icon",
            width: 62,
            height: 62,
            src: "resources/images/logos/Other/wavemaker_62x62.png",
            template: "<icon gap:platform=\"winphone\" src=\"${src}\" />\n\t<icon gap:platform=\"winphone\" src=\"${src}\" gap:role=\"background\" />"
        }, {
            imageId: 2,
            description: "WebOS",
            imageType: "Icon",
            width: 64,
            height: 64,
            src: "resources/images/logos/Other/wavemaker_64x64.png",
            template: "<icon src=\"${src}\" width=\"${width}\" height=\"${height}\" />"
        }
    ])
    }],


    domainsVar: ["wm.Variable",
    {
        "isList": true,
        "type": "EntryData"
    }, {}],
    previewDialog: ["wm.Dialog", {width: "100%", height: "100%", title: "Preview", modal: false}, {},{
        previewDialogPic: ["wm.Picture", {width: "100%", height: "100%"}]
    }],
    layoutBox1: ["wm.Layout",
    {
        "horizontalAlign": "left",
        "verticalAlign": "top"
    }, {}, {
        mainPanel: ["wm.studio.DialogMainPanel",
        {
            "padding": "5"
        }, {}, {
            tabLayers1: ["wm.studio.TabLayers",
            {
                _classes: {
                    domNode: ["StudioTabs", "NoRightMarginOnTab", "TransparentTabBar", "StudioDarkLayers"]
                },
                width: "100%",
                height: "100%",
                clientBorder: "1",
                clientBorderColor: "#959DAB"
            }, {}, {
                requiredLayer: ["wm.Layer",
                {
                    "border": "1",
                    "borderColor": "#999999",
                    "caption": "Required Info",
                    "horizontalAlign": "left",
                    "margin": "0",
                    "padding": "10",
                    "themeStyleType": "ContentPanel",
                    "verticalAlign": "top"
                }, {}, {
                    formPanel1: ["wm.FormPanel",
                    {
                        "captionAlign": "left",
                        "captionSize": "140px",
                        "desktopHeight": "254px",
                        "height": "254px",
                        "type": "wm.FormPanel"
                    }, {}, {
                        appName: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Application Name",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "26px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "helpText": "Enter the name you want users to see when looking at their device's home screen or application list",
                            "required": 1,
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        xhrPath: ["wm.SelectMenu",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Server Path",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": undefined,
                            "displayValue": "",
                            "helpText": "Enter the path that you want this application to use to send requests to a WaveMaker server; you need this for LiveVariables, database services, java services and web services (except XHR/JSON services). Examples:<dl><dt>http://mylocalhostipaddress:8094/Project35</dt><dd>Use something like this if your phonegap app is talking to your development machine</dd><dt>http://project35.cloudfoundry.com</dt><dd>if your phonegap application is talking to a server you deployed to cloudfoundry</dd><dt>http://myserver.com/project35</dt><dd>if your phonegap application is talking to a server you deployed elsewhere</dd><dt>Leave blank</dt><dd>If your only using XHR Services and don't need a WaveMaker server</dd></dl>",
                            "width": "100%",
                            emptyValue: "null",
                            restrictValues: 0,
                            regExp: "[^&<>]*"
                        }, {
                            onchange: "xhrPathChange"
                        }],
                        xhrServiceProxies: ["wm.Checkbox",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Use Server Proxy",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": undefined,
                            "displayValue": "",
                            "helpText": "When you import a WebService of type XHR/JSON, you may have set the useProxy setting to true (default = true).  That means all requests go through your wavemaker server and your server forwards the request.  This is not needed in a phonegap application, and adds complications.  <ul><li><b>Check this</b>: If you want your xhr services to use your service definition's useProxy setting</li><li><b>Uncheck this</b>: If you want to send your requests directly from the phonegap application and ignore your service definition's useProxy setting.</li></ul>",
                            "width": "100%",
                            emptyValue: "false"
                        }, {
                            onchange: "xhrPathChange"
                        }],
                        html1: ["wm.Html",
                        {
                            "border": "0",
                            "html": "After generating your phonegap build, you will need to upload it to build.phonegap.com.  If you do not yet have an account there, its free to sign up, and free to upload simple applications to their site    ",
                            "margin": "10",
                            "minDesktopHeight": 15
                        }, {}]
                    }]
                }],
                descriptionLayer: ["wm.Layer",
                {
                    "border": "1",
                    "borderColor": "#999999",
                    "caption": "Descriptive Info",
                    "horizontalAlign": "left",
                    "margin": "0",
                    "padding": "10",
                    "themeStyleType": "ContentPanel",
                    "verticalAlign": "top"
                }, {}, {
                    formPanel2: ["wm.FormPanel",
                    {
                        "captionAlign": "left",
                        "captionSize": "140px",
                        "desktopHeight": "234px",
                        "height": "234px",
                        "type": "wm.FormPanel"
                    }, {}, {
                        appId: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Application ID",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "26px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "helpText": "Needs to be of the form com.mycompany.projectName",
                            "required": 1,
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        appVersion: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Version",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "26px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        appDescription: ["wm.LargeTextArea",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Description",
                            "captionPosition": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "100px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "100px",
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        appAuthorName: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Developer Name",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "desktopHeight": "26px",
                            "displayValue": "A WaveMaker Studio User",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        appAuthorUrl: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Developer URL",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "26px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}],
                        appAuthorEmail: ["wm.Text",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Developer Email",
                            "captionAlign": "left",
                            "captionSize": "140px",
                            "dataValue": "",
                            "desktopHeight": "26px",
                            "displayValue": "",
                            "emptyValue": "emptyString",
                            "height": "26px",
                            "width": "100%",
                            regExp: "[^&<>]*"
                        }, {}]
                    }]
                }],
                devicesLayer: ["wm.Layer",
                {
                    "border": "1",
                    "borderColor": "#999999",
                    "caption": "Device Settings",
                    "horizontalAlign": "left",
                    "margin": "0",
                    "padding": "10",
                    "themeStyleType": "ContentPanel",
                    "verticalAlign": "top"
                }, {}, {
                    formPanel4: ["wm.FormPanel",
                    {
                        "captionAlign": "left",
                        "captionSize": "160px",
                        "desktopHeight": "108px",
                        "height": "108px",
                        "type": "wm.FormPanel"
                    }, {}, {
                        appOrientation: ["wm.SelectMenu",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Orientation",
                            "captionAlign": "left",
                            "captionSize": "160px",
                            "dataField": "dataValue",
                            "dataValue": "default",
                            "desktopHeight": "26px",
                            "displayField": "dataValue",
                            "displayValue": "default",
                            "height": "26px",
                            "helpText": "default means both landscape and portrait",
                            "options": "default, landscape, portrait",
                            "width": "100%"
                        }, {}],
                        appFullscreen: ["wm.Checkbox",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "Full screen",
                            "captionAlign": "left",
                            "captionSize": "160px",
                            "desktopHeight": "26px",
                            "displayValue": false,
                            "height": "26px",
                            "helpText": "Hides the device's status bar",
                            "width": "100%"
                        }, {}],
                        iosPrerenderedIcon: ["wm.Checkbox",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "IOS: prerendered-icon",
                            "captionAlign": "left",
                            "captionSize": "160px",
                            "desktopHeight": "26px",
                            "displayValue": false,
                            "height": "26px",
                            "helpText": "If icon is prerendered, IOS will not apply its gloss to your icon on the user's home screen",
                            "mobileHeight": "100%",
                            "width": "100%"
                        }, {}],
                        iosStatusBarStyle: ["wm.SelectMenu",
                        {
                            _classes: {
                                domNode: ["StudioEditor"]
                            },
                            "caption": "IOS: Status Bar Style",
                            "captionAlign": "left",
                            "captionSize": "160px",
                            "dataField": "dataValue",
                            "dataValue": "default",
                            "desktopHeight": "26px",
                            "displayField": "dataValue",
                            "displayValue": "default",
                            "height": "26px",
                            "options": "default,black-opaque,black-translucent",
                            "width": "100%"
                        }, {}]
                    }]
                }],
                graphicsLayer: ["wm.Layer",
                {
                    "border": "1",
                    "borderColor": "#999999",
                    "caption": "Graphics",
                    "horizontalAlign": "left",
                    "margin": "0",
                    "padding": "10",
                    "themeStyleType": "ContentPanel",
                    "verticalAlign": "top"
                }, {}, {
                    devicesTabs: ["wm.TabLayers",
                    {
                        _classes: {domNode: ["StudioTabs", "NoRightMarginOnTab", "TransparentTabBar", "StudioDarkLayers"]},
                clientBorder: "1",
                clientBorderColor: "#959DAB",
                headerHeight: "32px",
                        width: "100%",
                        height: "100%",
                        layoutKind:"top-to-bottom"
                    }, {}, {
                        IOSGraphicsLayer: ["wm.Layer",
                        {
                            caption: "IOS"
                        }, {}, {

                            iosIconGrid: ["wm.DojoGrid",
                            {
                                "columns": [{
                                    "show": true,
                                    "field": "description",
                                    "title": "Description",
                                    "width": "200px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "imageType",
                                    "title": "Type",
                                    "width": "80px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "src",
                                    "title": "Path to Icons",
                                    "width": "100%",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                }],
                                "deleteColumn": false,
                                "height": "100%",
                                "localizationStructure": {},
                                "margin": "4",
                                "minDesktopHeight": 60,
                                "singleClickEdit": true
                            }, {onRenderData: "onRenderData"}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "iosIconListVar",
                                        "targetProperty": "dataSet"
                                    }, {}]
                                }]
                            }],
                            iosDetailsPanel: ["wm.Panel", {width: "100%", height: "300px", layoutKind: "left-to-right", verticalAlign:"top",horizontalAlign:"left"},{},{
                            iosDataForm: ["wm.DataForm", {width: "100%", height: "100%",confirmChangeOnDirty:""}, {}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "iosIconGrid.selectedItem",
                                        "targetProperty": "dataSet"
                                    }],
                                    wire2: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "iosIconGrid.emptySelection",
                                        "targetProperty": "disabled"
                                    }]
                                }],
                                iosNameEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "description", readonly:1,ignoreParentReadonly:1,width: "100%", caption: "", captionSize: "0px"}, {}],
                                iosWidthEditor: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, formField: "width", width: "100%", caption: "Width", captionSize: "80px",changeOnKey:1}, {onchange: "iosGraphicsChange"}],
                                iosHeightEditor: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, formField: "height", width: "100%", caption: "Height", captionSize: "80px",changeOnKey:1}, {onchange: "iosGraphicsChange"}],
                                iosSrcEditorPanel: ["wm.Panel",{width: "100%", height:"24px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign:"left"},{},{
                                    iosSrcEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "src", width: "100%", caption: "Source", captionSize: "80px",changeOnKey:1}, {onchange: "iosGraphicsChange"}],
                                    iosSrcBindButton: ["wm.ToolButton", {_classes: {domNode: ["bindButton"]}, width: "24px", height: "24px"},{onclick: "selectImage"}]
                                }]/*,

                                iosSpacer: ["wm.Spacer", {height: "100%"}],
                                iosButtonPanel: ["wm.Panel", {width: "100%", height: "40px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
                                      iosSaveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Save"},{onclick: "saveIOSGraphicsClick"}],
                                      iosCancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Revert"},{onclick: "revertIOSGraphicsClick"}]
                                }]*/
                            }],
                            iosPreviewPicture: ["wm.Picture", {width: "200px", height: "100%",aspect:"v"},{onclick: "showPreviewDialog"},{
                                 binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression":  "${iosSrcEditor.dataValue} ? '/wavemaker/projects/' + studio.project.projectName + '/' + ${iosSrcEditor.dataValue} : ''",
                                        "targetProperty": "source"
                                    }, {}]
                            }]
                            }]
                        }]
                    }],
                    AndroidGraphicsLayer: ["wm.Layer",
                    {
                        caption: "Android"
                    }, {}, {
                            androidIconGrid: ["wm.DojoGrid",
                            {
                                "columns": [{
                                    "show": true,
                                    "field": "description",
                                    "title": "Description",
                                    "width": "200px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "imageType",
                                    "title": "Type",
                                    "width": "80px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "src",
                                    "title": "Path to Icons",
                                    "width": "100%",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                }],
                                "deleteColumn": false,
                                "height": "100%",
                                "localizationStructure": {},
                                "margin": "4",
                                "minDesktopHeight": 60,
                                "singleClickEdit": true
                            }, {onRenderData: "onRenderData"}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "androidIconListVar",
                                        "targetProperty": "dataSet"
                                    }, {}]
                                }]
                            }],
                            androidDetailsPanel: ["wm.Panel", {width: "100%", height: "300px", layoutKind: "left-to-right", verticalAlign:"top",horizontalAlign:"left"},{},{
                            androidDataForm: ["wm.DataForm", {width: "100%", height: "100%",confirmChangeOnDirty:""}, {}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "androidIconGrid.selectedItem",
                                        "targetProperty": "dataSet"
                                    }],
                                    wire2: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "androidIconGrid.emptySelection",
                                        "targetProperty": "disabled"
                                    }]
                                }],
                                androidNameEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "description", readonly:1,ignoreParentReadonly:1,width: "100%", caption: "", captionSize: "0px"}, {}],

                                androidSrcEditorPanel: ["wm.Panel",{width: "100%", height:"24px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign:"left"},{},{
                                    androidSrcEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "src", width: "100%", caption: "Source", captionSize: "80px",changeOnKey:1}, {onchange: "androidGraphicsChange"}],
                                    androidSrcBindButton: ["wm.ToolButton", {_classes: {domNode: ["bindButton"]}, width: "24px", height: "24px"},{onclick: "selectImage"}]
                                }]/*,

                                iosSpacer: ["wm.Spacer", {height: "100%"}],
                                iosButtonPanel: ["wm.Panel", {width: "100%", height: "40px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
                                      iosSaveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Save"},{onclick: "saveIOSGraphicsClick"}],
                                      iosCancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Revert"},{onclick: "revertIOSGraphicsClick"}]
                                }]*/
                            }],
                            androidPreviewPicture: ["wm.Picture", {width: "200px", height: "100%",aspect:"v"},{onclick: "showPreviewDialog"},{
                                 binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression":  "${androidSrcEditor.dataValue} ? '/wavemaker/projects/' + studio.project.projectName + '/' + ${androidSrcEditor.dataValue} : ''",
                                        "targetProperty": "source"
                                    }, {}]
                            }]
                            }]
                        }]
                    }],
                    MiscGraphicsLayer: ["wm.Layer",
                    {
                        caption: "Other"
                    }, {}, {
                            otherIconGrid: ["wm.DojoGrid",
                            {
                                "columns": [{
                                    "show": true,
                                    "field": "description",
                                    "title": "Description",
                                    "width": "200px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "imageType",
                                    "title": "Type",
                                    "width": "80px",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                },
                                {
                                    "show": true,
                                    "field": "src",
                                    "title": "Path to Icons",
                                    "width": "100%",
                                    "align": "left",
                                    "formatFunc": "",
                                    "mobileColumn": false
                                }],
                                "deleteColumn": false,
                                "height": "100%",
                                "localizationStructure": {},
                                "margin": "4",
                                "minDesktopHeight": 60,
                                "singleClickEdit": true
                            }, {onRenderData: "onRenderData"}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "otherIconListVar",
                                        "targetProperty": "dataSet"
                                    }, {}]
                                }]
                            }],
                            otherDetailsPanel: ["wm.Panel", {width: "100%", height: "300px", layoutKind: "left-to-right", verticalAlign:"top",horizontalAlign:"left"},{},{
                            otherDataForm: ["wm.DataForm", {width: "100%", height: "100%",confirmChangeOnDirty:""}, {}, {
                                binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "otherIconGrid.selectedItem",
                                        "targetProperty": "dataSet"
                                    }],
                                    wire2: ["wm.Wire",
                                    {
                                        "expression": undefined,
                                        "source": "otherIconGrid.emptySelection",
                                        "targetProperty": "disabled"
                                    }]
                                }],
                                otherNameEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "description", readonly:1,ignoreParentReadonly:1,width: "100%", caption: "", captionSize: "0px"}, {}],

                                otherSrcEditorPanel: ["wm.Panel",{width: "100%", height:"24px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign:"left"},{},{
                                    otherSrcEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, formField: "src", width: "100%", caption: "Source", captionSize: "80px",changeOnKey:1}, {onchange: "otherGraphicsChange"}],
                                    otherSrcBindButton: ["wm.ToolButton", {_classes: {domNode: ["bindButton"]}, width: "24px", height: "24px"},{onclick: "selectImage"}]
                                }]/*,

                                iosSpacer: ["wm.Spacer", {height: "100%"}],
                                iosButtonPanel: ["wm.Panel", {width: "100%", height: "40px", layoutKind: "left-to-right", verticalAlign: "top", horizontalAlign: "right"}, {}, {
                                      iosSaveButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Save"},{onclick: "saveIOSGraphicsClick"}],
                                      iosCancelButton: ["wm.Button", {_classes: {domNode: ["StudioButton"]}, caption: "Revert"},{onclick: "revertIOSGraphicsClick"}]
                                }]*/
                            }],
                            otherPreviewPicture: ["wm.Picture", {width: "200px", height: "100%",aspect:"v"},{onclick: "showPreviewDialog"},{
                                 binding: ["wm.Binding",
                                {}, {}, {
                                    wire: ["wm.Wire",
                                    {
                                        "expression":  "${otherSrcEditor.dataValue} ? '/wavemaker/projects/' + studio.project.projectName + '/' + ${other∏SrcEditor.dataValue} : ''",
                                        "targetProperty": "source"
                                    }, {}]
                            }]
                            }]
                        }]
                    }]
                }]
                /*
                label1: ["wm.Label",
                {
                    "border": "0",
                    "caption": "The icons you provide will be used to represent your application on the device's home screen and application list. PNG files only.",
                    "height": "50px",
                    "padding": "2,4,0,4",
                    "width": "100%",
                    singleLine: false
                }, {}],
                iconGridPanel: ["wm.Panel",
                {
                    "height": "147px",
                    "horizontalAlign": "left",
                    "layoutKind": "left-to-right",
                    "verticalAlign": "top",
                    "width": "100%"
                }, {}, {
                    iconGrid: ["wm.DojoGrid",
                    {
                        "columns": [{
                            "show": true,
                            "field": "sample",
                            "title": "-",
                            "width": "80px",
                            "align": "left",
                            "formatFunc": "wm_image_formatter",
                            "expression": "${src} ? '/wavemaker/projects/' + studio.project.projectName + '/' + ${src} : ''",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "description",
                            "title": "Description",
                            "width": "100%",
                            "align": "left",
                            "formatFunc": "",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "src",
                            "title": "Path to Icons",
                            "width": "150px",
                            "align": "left",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells._Widget",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "width",
                            "title": "Width (px)",
                            "width": "60px",
                            "align": "right",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells.NumberTextBox",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "height",
                            "title": "Height (px)",
                            "width": "70px",
                            "align": "right",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells.NumberTextBox",
                            "mobileColumn": false
                        }],
                        "deleteColumn": false,
                        "height": "147px",
                        "localizationStructure": {},
                        "margin": "4",
                        "minDesktopHeight": 60,
                        "singleClickEdit": true
                    }, {}, {
                        binding: ["wm.Binding",
                        {}, {}, {
                            wire: ["wm.Wire",
                            {
                                "expression": undefined,
                                "source": "iconListVar",
                                "targetProperty": "dataSet"
                            }, {}]
                        }]
                    }]
                }],
                label2: ["wm.Label",
                {
                    "border": "0",
                    "caption": "The Splash screen images you provide will be used  for different device sizes and device orientations while your application is loading. PNG files only.",
                    "height": "50px",
                    "padding": "10,4,0,4",
                    "width": "100%"
                }, {}],
                iconGridPanel1: ["wm.Panel",
                {
                    "height": "147px",
                    "horizontalAlign": "left",
                    "layoutKind": "left-to-right",
                    "verticalAlign": "top",
                    "width": "100%"
                }, {}, {
                    splashGrid: ["wm.DojoGrid",
                    {
                        "columns": [{
                            "show": true,
                            "field": "description",
                            "title": "Description",
                            "width": "100%",
                            "align": "left",
                            "formatFunc": "",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "src",
                            "title": "Path to Splash Screen Images",
                            "width": "150px",
                            "align": "left",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells._Widget",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "width",
                            "title": "Width (px)",
                            "width": "60px",
                            "align": "right",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells.NumberTextBox",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "height",
                            "title": "Height (px)",
                            "width": "70px",
                            "align": "right",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells.NumberTextBox",
                            "mobileColumn": false
                        }],
                        "deleteColumn": false,
                        "height": "147px",
                        "localizationStructure": {},
                        "margin": "4",
                        "minDesktopHeight": 60,
                        "singleClickEdit": true
                    }, {}, {
                        binding: ["wm.Binding",
                        {}, {}, {
                            wire: ["wm.Wire",
                            {
                                "expression": undefined,
                                "source": "splashListVar",
                                "targetProperty": "dataSet"
                            }, {}]
                        }]
                    }]
                }],
                samplePicture: ["wm.Picture",
                {
                    width: "1px",
                    height: "1px",
                    border: "1",
                    borderColor: "#333"
                }, {}, {
                    binding: ["wm.Binding",
                    {}, {}, {
                        wire: ["wm.Wire",
                        {
                            "expression": undefined,
                            "source": "splashGrid.selectedItem.src",
                            "targetProperty": "source"
                        }, {}],
                        wire1: ["wm.Wire",
                        {
                            "expression": undefined,
                            "expression": "${splashGrid.selectedItem.width}+'px'",
                            "targetProperty": "width"
                        }, {}],
                        wire2: ["wm.Wire",
                        {
                            "expression": undefined,
                            "expression": "${splashGrid.selectedItem.height}+'px'",
                            "targetProperty": "height"
                        }, {}]
                    }]
                }]
                */
            }],
            permissionsLayer: ["wm.Layer",
            {
                "border": "1",
                "borderColor": "#999999",
                "caption": "Permissions",
                "horizontalAlign": "left",
                "margin": "0",
                "padding": "10",
                "themeStyleType": "ContentPanel",
                "verticalAlign": "top"
            }, {}, {
                features: ["wm.CheckboxSet",
                {
                    _classes: {
                        domNode: ["StudioEditor"]
                    },
                    "caption": undefined,
                    "captionSize": "120px",
                    "dataField": "dataValue",
                    "desktopHeight": "100%",
                    "displayField": "dataValue",
                    "dataValue": ["http://api.phonegap.com/1.0/network","http://api.phonegap.com/1.0/notification","http://api.phonegap.com/1.0/geolocation","http://api.phonegap.com/1.0/camera","http://api.phonegap.com/1.0/contacts","http://api.phonegap.com/1.0/file","http://api.phonegap.com/1.0/media","http://api.phonegap.com/1.0/battery"],
                    "editorBorder": false,
                    "height": "100%",
                    "mobileHeight": "100%",
                    "options": "http://api.phonegap.com/1.0/network,http://api.phonegap.com/1.0/notification,http://api.phonegap.com/1.0/geolocation,http://api.phonegap.com/1.0/camera,http://api.phonegap.com/1.0/contacts,http://api.phonegap.com/1.0/file,http://api.phonegap.com/1.0/media,http://api.phonegap.com/1.0/battery",
                    "width": "100%"
                }, {
                    onchange: "onPermissionsChange"
                }],
                permissionsHtml: ["wm.Html", {width: "100%", height: "100%", html: "<p>By default, all permissions are enabled so that while testing, everything will work.  When you ready to start distributing this app, review the above list and remove those permissions that your application does not need.</p><p>On some devices, the lack of a requried permission results in no warnings, it just causes the app to freeze or fail.</p><p>On Android, the camera API requires the file API.</p>"}],
                label3: ["wm.Label",
                {
                    showing: 0,
                    "border": "0",
                    "caption": "You can use * as a value to allow access to all domains.  Enter the domains that your application is allowed to send requests to",
                    "height": "50px",
                    "padding": "10,4,0,4",
                    "width": "100%"
                }, {}],
                domainGridPanel: ["wm.Panel",
                {
                    showing: 0,
                    "height": "147px",
                    "horizontalAlign": "left",
                    "layoutKind": "left-to-right",
                    "verticalAlign": "top",
                    "width": "100%"
                }, {}, {
                    domainsGrid: ["wm.DojoGrid",
                    {
                        _classes: {
                            domNode: ['StudioGrid']
                        },
                        "columns": [{
                            "show": true,
                            "field": "name",
                            "title": "Domain",
                            "width": "100%",
                            "align": "left",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells._Widget",
                            "mobileColumn": false
                        }, {
                            "show": true,
                            "field": "dataValue",
                            "title": "Allow Subdomains",
                            "width": "120px",
                            "align": "left",
                            "formatFunc": "",
                            "fieldType": "dojox.grid.cells.Bool",
                            "mobileColumn": false
                        }],
                        "deleteColumn": true,
                        "height": "147px",
                        "localizationStructure": {},
                        "margin": "4",
                        "minDesktopHeight": 60,
                        "singleClickEdit": true
                    }, {}, {
                        binding: ["wm.Binding",
                        {}, {}, {
                            wire: ["wm.Wire",
                            {
                                "expression": undefined,
                                "source": "domainsVar",
                                "targetProperty": "dataSet"
                            }, {}]
                        }]
                    }],
                    panel6: ["wm.Panel",
                    {
                        "height": "100%",
                        "horizontalAlign": "left",
                        "verticalAlign": "top",
                        "width": "120px"
                    }, {}, {
                        addDomainButton: ["wm.Button",
                        {
                            _classes: {
                                domNode: ["StudioButton"]
                            },
                            "caption": "Add Domain",
                            "margin": "4",
                            "width": "100%"
                        }, {
                            "onclick": "iconGrid.addEmptyRow"
                        }]
                    }]
                }]
            }]
        }]
    }],
    buttonBar: ["wm.Panel",
    {
        "_classes": {
            "domNode": ["dialogfooter"]
        },
        "border": "1,0,0,0",
        "height": "34px",
        "horizontalAlign": "right",
        "layoutKind": "left-to-right",
        "padding": "2,0,2,0",
        "verticalAlign": "top",
        "width": "100%"
    }, {}, {
        CancelButton: ["wm.Button",
        {
            "_classes": {
                "domNode": ["StudioButton"]
            },
            "caption": "Cancel",
            "margin": "4"
        }, {
            "onclick": "cancelClick"
        }],
        OKButton: ["wm.Button",
        {
            "_classes": {
                "domNode": ["StudioButton"]
            },
            "caption": "OK",
            "margin": "4"
        }, {
            "onclick": "okClick"
        }, {
            binding: ["wm.Binding",
            {}, {}, {
                wire: ["wm.Wire",
                {
                    "source": "layoutBox1.invalid",
                    "targetProperty": "disabled"
                }, {}]
            }]
        }]
    }]
}]
}