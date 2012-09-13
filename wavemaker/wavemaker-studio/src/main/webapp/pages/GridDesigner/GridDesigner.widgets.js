    /*
     *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
    GridDesigner.widgets = {
        formattersType: ["wm.TypeDefinition", {}, {}, {
    field100: ["wm.TypeDefinitionField", {"fieldName":"currency","fieldType":"String"}, {}],
    field101: ["wm.TypeDefinitionField", {"fieldName":"round","fieldType":"Boolean"}, {}],
    field102: ["wm.TypeDefinitionField", {"fieldName":"dijits","fieldType":"String"}, {}],
    field103: ["wm.TypeDefinitionField", {"fieldName":"useLocalTime","fieldType":"Boolean"}, {}],
    field104: ["wm.TypeDefinitionField", {"fieldName":"datePattern","fieldType":"String"}, {}],
    field105: ["wm.TypeDefinitionField", {"fieldName":"timePattern","fieldType":"String"}, {}],
    field106: ["wm.TypeDefinitionField", {"fieldName":"formatLength","fieldType":"String"}, {}],
    field107: ["wm.TypeDefinitionField", {"fieldName":"dateType","fieldType":"String"}, {}],
    field108: ["wm.TypeDefinitionField", {"fieldName":"numberType","fieldType":"String"}, {}],
    field109: ["wm.TypeDefinitionField", {"fieldName":"prefix","fieldType":"String"}, {}],
    field110: ["wm.TypeDefinitionField", {"fieldName":"postfix","fieldType":"String"}, {}],
    field111: ["wm.TypeDefinitionField", {"fieldName":"target","fieldType":"String"}, {}],
    field112: ["wm.TypeDefinitionField", {"fieldName":"width","fieldType":"String"}, {}],
    field113: ["wm.TypeDefinitionField", {"fieldName":"height","fieldType":"String"}, {}],
    field115: ["wm.TypeDefinitionField", {"fieldName":"buttonclass","fieldType":"String"}, {}],
    field116: ["wm.TypeDefinitionField", {"fieldName":"separator","fieldType":"String"}, {}],
    field117: ["wm.TypeDefinitionField", {"fieldName":"joinFieldName","fieldType":"String"}, {}]


    }],
        constraintsType: ["wm.TypeDefinition", {}, {}, {
        field1001: ["wm.TypeDefinitionField", {"fieldName":"max","fieldType":"Boolean"}, {}],
        field1002: ["wm.TypeDefinitionField", {"fieldName":"min","fieldType":"String"}, {}]
        }],
        editorPropsType: ["wm.TypeDefinition", {}, {}, {
        field2000: ["wm.TypeDefinitionField", {"fieldName":"regExp","fieldType":"String"}, {}],
        field2001: ["wm.TypeDefinitionField", {"fieldName":"invalidMessage","fieldType":"String"}, {}],
        field2002: ["wm.TypeDefinitionField", {"fieldName":"required","fieldType":"String"}, {}],
        field2003: ["wm.TypeDefinitionField", {"fieldName":"options", "fieldType": "String"}, {}],
        field2004: ["wm.TypeDefinitionField", {"fieldName":"selectDataSet", "fieldType": "String"}, {}],
        field2005: ["wm.TypeDefinitionField", {"fieldName":"displayField", "fieldType": "String"}, {}],
        field2006: ["wm.TypeDefinitionField", {"fieldName":"isSimpleType", "fieldType": "String"}, {}],
        field2007: ["wm.TypeDefinitionField", {"fieldName":"restrictValues", "fieldType": "String"}, {}]
        }],
        gridDefinitionType: ["wm.TypeDefinition", {}, {}, {
        field1: ["wm.TypeDefinitionField", {"fieldName":"show","fieldType":"Boolean"}, {}],
        field2: ["wm.TypeDefinitionField", {"fieldName":"field", "fieldType": "String"}, {}],
        field3: ["wm.TypeDefinitionField", {"fieldName":"title", "fieldType": "String"}, {}],
        field4: ["wm.TypeDefinitionField", {"fieldName":"width", "fieldType": "String"}, {}],
        field5: ["wm.TypeDefinitionField", {"fieldName":"align", "fieldType": "String"}, {}],
        field6: ["wm.TypeDefinitionField", {"fieldName":"formatFunc", "fieldType": "String"}, {}],
        field6b: ["wm.TypeDefinitionField", {"fieldName":"formatProps", "fieldType": "formattersType", isObject: true}, {}],
        field7: ["wm.TypeDefinitionField", {"fieldName":"fieldType", "fieldType": "String"}, {}],
        field7b: ["wm.TypeDefinitionField", {"fieldName":"constraints", "fieldType": "constraintsType", isObject: true}, {}],
        field7c: ["wm.TypeDefinitionField", {"fieldName":"editorProps", "fieldType": "editorPropsType", isObject: true}, {}],
        field8: ["wm.TypeDefinitionField", {"fieldName":"expression", "fieldType": "String"}, {}],
        field9: ["wm.TypeDefinitionField", {"fieldName":"backgroundColor", "fieldType": "String"}, {}],
        field10: ["wm.TypeDefinitionField", {"fieldName":"textColor", "fieldType": "String"}, {}],
        field11: ["wm.TypeDefinitionField", {"fieldName":"isCustomField", "fieldType": "String"}, {}],
        field12: ["wm.TypeDefinitionField", {"fieldName":"cssClass", "fieldType": "String"}, {}],
        field13: ["wm.TypeDefinitionField", {"fieldName":"mobileColumn", "fieldType": "boolean"}, {}]
        }],
        columnsVar: ["wm.Variable", {"isList":true,"json":"[{\"showing\":\"1\",\"columnName\":\"firstname\"},{\"showing\":\"1\",\"columnName\":\"lastname\"},{\"showing\":\"\",\"columnName\":\"zipcode\"},{\"columnName\":\"city\"},{\"showing\":\"1\",\"columnName\":\"department.name\"}]","type":"gridDefinitionType"}, {}],
        editorsVar: ["wm.Variable", {isList: true, type: "EntryData", "json": "[{name: '', dataValue: ''},{name: 'Text', dataValue: 'dojox.grid.cells._Widget'},{name: 'Number', dataValue: 'dojox.grid.cells.NumberTextBox'},{name: 'Date', dataValue: 'dojox.grid.cells.DateTextBox'},{name: 'Time', dataValue: 'dojox.grid.cells.TimeTextBox'},{name: 'Checkbox', dataValue: 'dojox.grid.cells.Bool'},{name: 'ComboBox', dataValue: 'dojox.grid.cells.ComboBox'},{name: 'Select', dataValue: 'dojox.grid.cells.Select'}]"}],
        formattersVar:["wm.Variable", {isList: true, type: "EntryData", "json": "[{name: '', dataValue: ''},{name: 'Currency', dataValue: 'wm_currency_formatter'},{name: 'Date', dataValue: 'wm_date_formatter'},{name: 'Number', dataValue: 'wm_number_formatter'},{name: 'Image', dataValue: 'wm_image_formatter'},{name: 'Link', dataValue: 'wm_link_formatter'},{name: 'Array', dataValue: 'wm_array_formatter'},{name: 'Button', dataValue: 'wm_button_formatter'}]"}],
        fullFormattersVar: ["wm.Variable", {isList: true, type: "EntryData"}],
        buttonHandlersVar: ["wm.Variable", {isList: true, type: "EntryData"}],
        liveSourceVar:  ["wm.Variable", {isList: true, type: "StringData"}],
        layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
            mainPanel: ["wm.studio.DialogMainPanel", {layoutKind: "left-to-right"},{}, {
            panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"185px"}, {}, {
            grid: ["wm.DojoGrid",
{
    "columns": [{
        "show": true,
        "id": "show",
        "title": "Desktop",
        "width": "50px",
        "displayType": "Text",
        "noDelete": true,
        "align": "left",
        "formatFunc": "",
        "fieldType": "dojox.grid.cells.Bool"
    }, {
        "show": true,
        "id": "mobileColumn",
        "title": "Phone",
        "width": "30px",
        "displayType": "Text",
        "noDelete": true,
        "align": "left",
        "formatFunc": "",
        "fieldType": "dojox.grid.cells.Bool"
    }, {
        "show": true,
        "id": "field",
        "title": "Field",
        "width": "100%",
        "displayType": "Text",
        "noDelete": true,
        "align": "left",
        "formatFunc": ""
    }],
    selectFirstRow: true,
    "height": "100%",
    "localizationStructure": {},
    "margin": "4",
    border: "1",
    borderColor: "#959DAB"
}, {
    onCellEdited: "onCellEdited",
    onSelect: "onColumnSelect",
    onRenderData: "onRenderData"
}, {
    binding: ["wm.Binding",
    {}, {}, {
        wire: ["wm.Wire",
        {
            "expression": undefined,
            "source": "columnsVar",
            "targetProperty": "dataSet"
        }, {}]
    }]
}],
            panel4: ["wm.Panel", {"height":"32px","horizontalAlign":"middle","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
                addButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Add","margin":"4","width":"90px",imageList: "studio.silkIconImageList", imageIndex: 1}, {"onclick":"addButtonClick"}],
                panel4Spacer: ["wm.Spacer", {width: "100%"}],
                upButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},width: "90px", imageList: "studio.silkIconImageList", imageIndex: 7,caption:"Up"}, {onclick: "moveUp"}, {
                binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {"expression":undefined,"source":"grid.emptySelection","targetProperty":"disabled"}, {}]
                }]
                }]
            }],
            panel4b:["wm.Panel", {"height":"32px","horizontalAlign":"middle","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
                deleteButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},"caption":"Delete","margin":"4","width":"90px",imageList: "studio.silkIconImageList", imageIndex: 21}, {"onclick":"deleteButtonClick"}],
                panel4bSpacer: ["wm.Spacer", {width: "100%"}],
                downButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},width: "90px", imageList: "studio.silkIconImageList", imageIndex: 2,caption:"Down"}, {onclick: "moveDown"}, {
                binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {"expression":undefined,"source":"grid.emptySelection","targetProperty":"disabled"}, {}]
                }]
                }]
            }]
            }],
                        splitter: ["wm.Splitter", {_classes: {domNode: ["StudioSplitter"]}}],
            form: ["wm.DataForm", {width: "100%", height: "100%", layoutKind: "top-to-bottom",confirmChangeOnDirty: ""}, {}, {
            binding: ["wm.Binding", {}, {}, {
                wire: ["wm.Wire", {"expression":undefined,"source":"grid.selectedItem","targetProperty":"dataSet"}, {}]
            }],

            tabLayers1: ["wm.studio.TabLayers", {_classes: {domNode: ["StudioTabs", "TransparentTabBar", "StudioDarkLayers", "NoRightMarginOnTab"]}, "margin":"4", clientBorder: "1", clientBorderColor: "#959DAB"}, {}, {
                layer1: ["wm.Layer", {"borderColor":"#999999","caption":"Basic Settings","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","verticalAlign":"top", autoScroll:true}, {}, {
                label1: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"align":"center","border":"0,0,2,0",borderColor: "#959DAB", "padding":"4","width":"100%"}, {}, {
                    binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {"expression":undefined,"source":"grid.selectedItem.field","targetProperty":"caption"}, {}]
                    }]
                }],
                titleEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Title","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Label to show in the grid header for this column","width":"100%", formField: "title"}, {onchange: "onTitleChange"}, {}],
                widthTypePanel: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
                    widthSizeEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Width","captionAlign":"left","displayValue":"100","width":"100%", emptyValue: "emptyString"}, {onchange: "onWidthChange"}, {
                    binding: ["wm.Binding", {}, {}, {
                        wire: ["wm.Wire", {"expression":"parseInt(${grid.selectedItem.width})","targetProperty":"dataValue"}, {}]
                    }]
                    }],
                    widthTypeEditor: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "dataField":"dataValue","displayField":"dataValue","displayValue":"%","helpText":"Set the width of the column","options":"px,%,auto","width":"70px"}, {onchange: "onWidthChange"}, {
                    binding: ["wm.Binding", {}, {}, {
                        wire: ["wm.Wire", {"expression":"${grid.selectedItem.width}.replace(/\\d*/,'')","targetProperty":"dataValue"}, {}]
                    }]
                    }]
                }],
                alignmentEditor: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Alignment","captionAlign":"left","dataField":"dataValue","displayField":"dataValue","displayValue":"","helpText":"Horizontal alignment for cells in this column","options":"left, right, center","width":"100%", formField: "align"}, {onchange: "onAlignChange"}],
                formattersPanels: ["wm.Panel", {title: "Formatters", width: "100%", height: "100%", margin: "10,0,10,0", padding: "0", fitToContentHeight: true, border: "1",borderColor: "#959DAB", layoutKind: "top-to-bottom"}, {}, {
                    formatEditor: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, restrictValues: false, "caption":"Format","captionAlign":"left","helpText":"<ul><li>Leave alone to just show the raw data for this column</li><li>Specify a formatter to customize how its displayed</li><li>Create a custom formatter and write code to control how its displayed</li><li>Use a button formatter and the widget's onGridButtonClick event handler to add operations (NOTE: clicking a button will NOT cause a selection change)</li></ul>","width":"100%", dataField: "dataValue", displayField: "name", formField: "formatFunc"}, {onchange: "onFormatChange"}, {
                    binding: ["wm.Binding", {}, {}, {
                        wire1: ["wm.Wire", {"expression":undefined,"source":"fullFormattersVar","targetProperty":"dataSet"}, {}]
                    }]
                    }],
                    formatSubForm: ["wm.SubForm", {width: "100%", height: "100%", padding: "0", margin: "0", fitToContentHeight: true, formField: "formatProps",confirmChangeOnDirty: ""}, {}, {
                    formatLayers: ["wm.Layers", {width: "100%", height: "100%", fitToContentHeight:true}, {}, {
                        formatBlankLayer: ["wm.Layer", {}],
                        currencyLayer: ["wm.Layer", {}, {}, {
                            currencyType: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Currency Type","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Enter an ISO4217 currency code such as USD","width":"100%", formField: "currency"}, {onchange: "onCurrencyTypeChange"}],
                            currencyDijits: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Digits","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Set the number of decimal places that are displayed","width":"100%", formField: "dijits"}, {onchange: "onCurrencyDijitsChange"}],
                            currencyRound: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Round?","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Round the value or truncate?","width":"100%",formField: "round"}, {onchange: "onCurrencyRoundChange"}]
                        }],
                        dateLayer: ["wm.Layer", {}, {}, {
                            dateSelector: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Show",options: "date, time, date and time", "captionAlign":"left","dataValue":"short","displayValue":"","helpText":"Pick between showing date or time or both","width":"100%", formField: "dateType"}, {onchange: "onDateTimeChange"}],
                            dateFormatLength: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Format Length",options: "short,medium,long,full", "captionAlign":"left","dataValue":"short","displayValue":"","helpText":"The formatLength property determines the style of the displayed date:<ul><li>short - 12/15/2007</li><li>medium - Dec 15, 2007</li><li>long - December 15, 2007</li><li>full - Saturday, December 15, 2007</li></ul>","width":"100%", formField: "formatLength"}, {onchange: "onDateLengthChange"}],
                            datePattern: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Date Pattern","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"The datePattern property determines the format of the date. For example: MMM-dd-yyyy.  Only use this if dateFormatLength doesn't get the desired results.  More information at http://dojotoolkit.org/api/, look for dojo.date.locale.format","width":"100%", formField: "datePattern"}, {onchange: "onDatePatternChange"}],
                            timePattern: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Time Pattern","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"The timePattern format property determines the format of the time. For example: HH:mm.  More information at http://dojotoolkit.org/api/, look for dojo.date.locale.format","width":"100%", formField: "timePattern"}, {onchange: "onTimePatternChange"}],
                            useLocalTime: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Use local time?","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Show the date in server time or in local time?  Server time is shown exactly the same to all users in all places.","width":"100%", formField: "useLocalTime"}, {onchange: "onUseLocalTimeChange"}]
                        }],
                        numberLayer: ["wm.Layer", {}, {}, {
                            numberType: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, dataType: "string", "border":"0","caption":"Show Percent?",checkedValue: "percent","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"","width":"100%", formField: "numberType"}, {onchange: "onNumberTypeChange"}],
                            numberDijits: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Digits","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Set the number of decimal places that are displayed","width":"100%", formField: "dijits"}, {onchange: "onNumberDijitsChange"}],
                            numberRound: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Round?","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Round the value or truncate?","width":"100%", formField: "round"}, {onchange: "onNumberRoundChange"}]
                        }],
                        linkLayer: ["wm.Layer", {}, {}, {
                            linkPrefix: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Prefix","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Text to append to the start of each URL, such as 'https'. NOTE: This changes the link, but not the displayed text.","width":"100%", formField: "prefix"}, {onchange: "onLinkPrefixChange"}],
                            linkPostfix: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Postfix","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Text to append to the end of each URL, such as '?from=wavemakerApp'. NOTE: This changes the link, but not the displayed text.","width":"100%", formField: "postfix"}, {onchange: "onLinkPostfixChange"}],
                            linkTarget: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Target","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"HTML attribute for naming the window to open.  Leave blank to use the default of _NewWindow","width":"100%", formField: "target"}, {onchange: "onTargetChange"}],
                        }],
                        imageLayer: ["wm.Layer", {}, {}, {
                            imagePrefix: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Prefix","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Text to append to the start of each URL, such as 'https://images.'.","width":"100%", formField: "prefix"}, {onchange: "onLinkPrefixChange"}],
                            imagePostfix: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Postfix","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Text to append to the end of each URL, such as '?from=wavemakerApp'.","width":"100%", formField: "postfix"}, {onchange: "onLinkPostfixChange"}],
                            imageWidthTarget: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Width","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Width of the images; leave blank if the width may vary.  Width is in px (leave out the px)","width":"100%", formField: "width"}, {onchange: "onImageWidthChange"}],
                            imageHeightTarget: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Height","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Height of the images; leave blank if the height may vary.  Height is in px (leave out the px)","width":"100%", formField: "height"}, {onchange: "onImageHeightChange"}]
                        }],
                        arrayLayer: ["wm.Layer", {}, {}, {
                            arraySeparator: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Separator","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"Your array will be displayed as a comma separated list, a space separated list, or a list separated by anything you want.","width":"100%", formField: "separator"}, {onchange: "onArraySeparatorChange"}],
                            arrayDisplayField: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "border":"0","caption":"Field name","captionAlign":"left","dataValue":undefined,"displayValue":"","helpText":"You have an array of objects; which field do you want to use to join your results together? firstname? departmentName?  Often you will want just 'dataValue'.","width":"100%", formField: "joinFieldName"}, {onchange: "onArrayFieldNameChange"}]
                        }],
                        buttonLayer: ["wm.Layer", {}, {}, {
                            buttonClassEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"CSS Class",captionAlign: "left", "dataValue":null,"helpText":"Enter a CSS class such as Column1Button, and then go to your CSS tab and add a CSS rule for .Column1Button { font-weight: bold; background-image: ...}.  Default is wmbutton; your class will replace wmbutton.  You can enter \"wmbutton Column1Button\" if you want to use both classes.", formField: "buttonclass"}, {onchange: "onButtonClassChange"}],
                            buttonLabel: ["wm.Label", {width: "100%", caption: "Next step: Setup your grid's onGridButtonClick event handler"}]
                        }]
                    }]
                    }]
                }],
                displayExpressionEditor: ["wm.LargeTextArea", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Display Expression","dataValue":undefined,"displayValue":"", formField: "expression",
                                           "helpText":"<p>Display expressions can be simple expressions <code>${firstname} + \" \" + ${lastname}</code> if firstname and lastname are field names for your grid data.</p><p>Display expressions can be complex expressions: <code>if (${firstname}) {<br/>   'Dr. ' + ${firstname};<br/>} else {<br/>   'Mr. NoName';<br/>}</code>NOTE: Last statement or value is the value of your display expression; return statements are invalid and can not be used.</p><p><a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/Binding+Expressions+Display+Expressions' target='Docs'>More docs</a></p>",
                                           width: "100%", height: "100%", emptyValue: "emptyString"}, {onchange: "onDisplayExprChange"}]
                }],
                advancedLayer: ["wm.Layer", {"caption":"Advanced Settings","horizontalAlign":"left","padding":"4","themeStyleType":"ContentPanel","verticalAlign":"top", autoScroll:false}, {}, {
                label2: ["wm.Label", {"_classes":{"domNode":["wm_TextDecoration_Bold"]},"align":"center","border":"0",borderColor: "#959DAB","padding":"4","width":"100%"}, {}, {
                    binding: ["wm.Binding", {}, {}, {
                    wire: ["wm.Wire", {"expression":undefined,"source":"grid.selectedItem.field","targetProperty":"caption"}, {}]
                    }]
                }],
                innerAdvancedPanel: ["wm.Panel", {width: "100%", height: "100%", verticalAlign: "top", horizontalAlign: "left", layoutKind: "top-to-bottom", autoScroll: true}, {}, {
                editorPanels: ["wm.Panel", {title: "Editors", width: "100%", height: "100%", margin: "0", padding: "0", border: "1",borderColor: "#959DAB", fitToContentHeight: true, layoutKind: "top-to-bottom"}, {}, {
                    editorPanelNote: ["wm.Label", {caption: "Please note that edit fields will not work on tablets and phones", width: "100%"}],
                    editorSelector: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Edit Field Type","captionAlign":"left","helpText":"Leave this blank unless you want your users to be able to edit your grid. <br/> NOTES<ul><li>You'll need onCellEditted event handlers for any changes in value to have meaning</li><li>Editable grid cells will not be available on mobile devices</li></ul>", dataField: "dataValue", displayField: "name", width: "100%", formField: "fieldType"}, {onchange: "onEditFieldChange"}, {
                    binding: ["wm.Binding", {}, {}, {
                        wire: ["wm.Wire", {"expression":undefined,"source":"editorsVar","targetProperty":"dataSet"}, {}]
                    }]
                    }],
                    editorPropLayers: ["wm.Layers", {width: "100%", height: "100%", fitToContentHeight:true}, {}, {
                    editorPropBlankLayer: ["wm.Layer", {}],
                    editorTextLayer: ["wm.Layer", {}, {}, {
                        editorTextLayerSubForm: ["wm.SubForm", {width: "100%", height: "100%",  padding: "0", margin: "0",formField: "editorProps", fitToContentHeight:true,confirmChangeOnDirty: ""}, {}, {
                        regexEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Regex",captionAlign: "left", "dataValue":null,"helpText":"Enter any regular expression to be used to validate user input for client-side input validation.<code>Regex to enter zero or more digits (0-9)\n[0-9]*\nRegex to enter one or more alpha characters (A-Z or a-z)\n[A-Za-z]+\nSocial security number:\n^d{3}-d{2}-d{4}$<\nUS Phone number:\n\(?\d\d\d\)?[ \-]?\d{3}[ \-]?\d{4}</code>", formField: "regExp"}, {onchange: "onRegexChange"}],
                        invalidTextEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Invalid Message",captionAlign: "left", "dataValue":null,"helpText":"Text to show if the value the user enters is invalid", formField: "invalidMessage"}, {onchange: "onInvalidChange"}]
                        }]
                    }],
                    editorDateLayer: ["wm.Layer", {}, {}, {
                        editorDateLayerSubForm: ["wm.SubForm", {width: "100%", height: "100%",  padding: "0", margin: "0",formField: "constraints", fitToContentHeight:true,confirmChangeOnDirty: ""}, {}, {
                        minDateEditor: ["wm.Date", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Minimum",captionAlign: "left", "dataValue":null,"helpText":"To change this via binding will require some custom code, not ready to publish at this time.", formField: "min"}, {onchange: "onMinimumChange"}],
                        maxDateEditor: ["wm.Date", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Maximum",captionAlign: "left", "dataValue":null,"helpText":"To change this via binding will require some custom code, not ready to publish at this time.", formField: "max"}, {onchange: "onMaximumChange"}]
                        }]
                    }],
                    editorTimeLayer: ["wm.Layer", {}, {}, {
                    }],

                    editorNumberLayer: ["wm.Layer", {}, {}, {
                        editorNumberLayerSubForm: ["wm.SubForm", {width: "100%", height: "100%",  padding: "0", margin: "0",formField: "constraints", fitToContentHeight:true,confirmChangeOnDirty: ""}, {}, {
                        minNumberEditor: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Minimum",captionAlign: "left", "dataValue":null,"helpText":"To change this via binding will require some custom code, not ready to publish at this number.", formField: "min"}, {onchange: "onMinimumChange"}],
                        maxNumberEditor: ["wm.Number", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Maximum",captionAlign: "left", "dataValue":null,"helpText":"To change this via binding will require some custom code, not ready to publish at this number.", formField: "max"}, {onchange: "onMaximumChange"}],
                        invalidNumberEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Invalid Message",captionAlign: "left", "dataValue":null,"helpText":"Text to show if the value the user enters is invalid"}, {onchange: "onInvalidChange"}, {
                            binding: ["wm.Binding", {}, {}, {
                            wire: ["wm.Wire", {"expression":undefined,"source":"grid.selectedItem.editorProps.invalidMessage","targetProperty":"dataValue"}, {}]
                            }]
                        }]
                        }]
                    }],
                    editorCheckboxLayer: ["wm.Layer", {}, {}, {
                    }],
                    editorComboBoxLayer: ["wm.Layer", {}, {}, {
                        editorComboBoxLayerSubForm: ["wm.SubForm", {width: "100%", height: "100%",  padding: "0", margin: "0",formField: "editorProps", fitToContentHeight:true,confirmChangeOnDirty: ""}, {}, {
                        dataSetComboBoxEditor: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"dataSet",displayField: "dataValue",dataField: "dataValue",captionAlign: "left", "dataValue":null,"helpText":"Enter a comma separated list of menu items", width: "100%", formField: "selectDataSet"}, {onchange: "onDataSetChange"}, {
                            binding: ["wm.Binding", {}, {}, {
                            wire: ["wm.Wire", {"expression":undefined,"source":"liveSourceVar","targetProperty":"dataSet"}, {}]
                            }]
                        }],
                        comboBoxDisplayFieldEditor: ["wm.SelectMenu", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Display Field",restrictValues: false, displayField: "dataValue",dataField: "dataValue", captionAlign: "left", "dataValue":null,"helpText":"Which field do you want to use to represent the options in the ComboBox?", width: "100%", formField: "displayField"}, {onchange: "onDisplayFieldChange"}],
                        isSimpleDataValueEditor: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Use displayValue Only", captionAlign: "left","helpText":"If you want to write the displayed value and not the selected object, use this.  This should only be selected if the field you are editing is a string and not an object or subobject.", width: "100%", formField: "isSimpleType"}, {onchange: "onIsSimpleTypeChange"}],
                        isRestrictDataValueEditor: ["wm.Checkbox", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Restrict Values", captionAlign: "left","helpText":"Uncheck this to allow the user to pick from the list AND to enter any string they want.  Leave this checked to limit the user to the options that are presented.", width: "100%", formField: "restrictValues"}, {onchange: "onIsRestrictValuesChange"}],
                        }]
                    }],
                    editorSelectLayer: ["wm.Layer", {}, {}, {
                        editorSelectLayerSubForm: ["wm.SubForm", {width: "100%", height: "100%",  padding: "0", margin: "0",formField: "editorProps", fitToContentHeight:true,confirmChangeOnDirty: ""}, {}, {
                        optionsSelectEditor: ["wm.Text", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Options",captionAlign: "left", "dataValue":null,"helpText":"Enter a comma separated list of menu items", width: "100%", formField: "options"}, {onchange: "onOptionsChange"}]
                        }]
                    }]
                    }]
                }],
                backgroundColorEditor1: ["wm.LargeTextArea", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Background Color","dataValue":undefined,"displayValue":"","height":"122px",
                                          "helpText":"Display expression that returns a color; <code>if (${budget} > 50) \"red\";</code><p>See Display Expression tips for more information</p><p><a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/Binding+Expressions+Display+Expressions' target='Docs'>More docs</a></p>",
                                          width: "100%", formField: "backgroundColor"}, {onchange: "onBackExprChange"}],
                textColorEditor: ["wm.LargeTextArea", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Text Color","dataValue":undefined,"displayValue":"","height":"122px",
                                       "helpText":"Display expression that returns a color; <code>if (${budget} > 50) \"red\";</code><p>See Display Expression tips for more information</p><p><a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/Binding+Expressions+Display+Expressions' target='Docs'>More docs</a></p>",
                                       width: "100%", formField: "textColor"}, {onchange: "onColorExprChange"}],
                customClassEditor: ["wm.LargeTextArea", {_classes: {domNode: ["StudioEditor"]}, changeOnSetData: false, "caption":"Custom CSS Class","dataValue":undefined,"displayValue":"",
                                     "helpText":"Enter a display expression that returns a CSS Class name; example: <code>if (${budget} > 50) {\n  \"TooHigh\";\n } else if (${budget} < 0) {\n \"TooLow\";\n } else {\n \"JustRight\";\n }</code>NOTE: Last statement or value is the value of your display expression; return statements are invalid and can not be used.</p><p><a href='http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/Binding+Expressions+Display+Expressions' target='Docs'>More docs</a></p><p>Suggested use-case: adding custom styling, such as icons for buttons.</p>",
                                     width: "100%", formField: "cssClass"}, {onchange: "onCustomCssClassChange"}]
                }]
            }]
            }]
    }]
        }],
        panel2: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
            cancelButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},width: "80px", "caption":"Cancel"}, {onclick: "onCancelClick"}],
            okButton: ["wm.Button", {"_classes":{"domNode":["StudioButton"]},width: "80px", "caption":"OK"}, {onclick: "onOkClick"}]
        }]
        }]
    }