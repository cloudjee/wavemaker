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



dojo.provide("wm.base.widget.Editors.Select");
dojo.require("wm.base.widget.Editors.AbstractEditor");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.ComboBox");
//===========================================================================
// Select Editor
//===========================================================================
dojo.declare("wm.SelectMenu", wm.DataSetEditor, {
    indentField: "",
    placeHolder: "",
    _storeNameField: "_selectMenuName",
    pageSize: 20,
    allowNone: false,
    autoComplete: true,
    hasDownArrow: true,
    restrictValues: true,
    _selectedData: null,
    displayMenuExpression: "",
    init: function() {
        if(wm.isMobile) {
            this.manageHistory = true;
        }
        this.inherited(arguments);
    },
    handleBack: function(inOptions) {
        this.editor.closeDropDown();
        this.editor.dropDown.hide();
        return true;
    },
    // STORE ACCESS
    generateStore: function() {
        if(wm.isMobile) return;
        var data = [];
        if(this.dataSet) {
            var count = this.dataSet.getCount();
            for(var i = 0; i < count; i++) {
                var v = this.dataSet.getItem(i);
                var item = {
                    id: i,
                    name: this._getDisplayData(v)
                };
                if (this.displayMenuExpression) {
                    item.menuField = wm.expression.getValue(this.displayMenuExpression, v,this.owner)
                }
                if(this.indentField) {
                    item.indent = Boolean(this.dataSet.getItem(i).getValue(this.indentField));
                }
                data.push(item);
            }
        }
        if(this.allowNone) {
            data.unshift({
                id: -1,
                name: ""
            });
        }

        return new wm.base.data.SimpleStore(data, "name", this);
    },
    getEditorProps: function(inNode, inProps) {
        var store = this.generateStore();
        return dojo.mixin(this.inherited(arguments), {
            placeHolder: this.placeHolder,
            required: this.required,
            store: store,
            autoComplete: this.autoComplete,
            hasDownArrow: this.hasDownArrow,
            searchAttr: "name",
            labelAttr: this.displayMenuExpression ? "menuField" : null,
            labelType: this.displayMenuExpression ? "html" : "text",
            pageSize: this.pageSize ? this.pageSize : Infinity // dijit requires 1 higher or it will still print the "more" link
        }, inProps || {});
    },

    _createEditor: function(inNode, inProps) {
        var e;
        if(wm.isMobile) {
            e = new wm.dijit.form.ComboBox(this.getEditorProps(inNode, inProps));
            e.owner = this;
            dojo.attr(e.focusNode, "readonly", true);
            //this.connect(e.domNode, "ontouchstart", this, "showPopup");
        } else if(this.restrictValues) {
            e = new dijit.form.FilteringSelect(this.getEditorProps(inNode, inProps));
        } else {
            e = new dijit.form.ComboBox(this.getEditorProps(inNode, inProps));
        }
        return e;
    },
    showPopup: function() {
        if(this.editor) {
            this.editor.openDropDown();
        }
    },
    setPlaceHolder: function(inPlaceHolder) {
        this.placeHolder = inPlaceHolder;
        if(this.editor) this.editor.attr("placeHolder", inPlaceHolder);
    },
    setRestrictValues: function(inValue) {
        var dataval = this.getEditorValue();
        var oldval = this.restrictValues;
        this.restrictValues = inValue;
        if(this.editor && oldval != inValue) {
            this.createEditor();
            this.setEditorValue(dataval);
        }
    },

    _onSetEditorValueFailed: function(inValue) {
        if (!this.restrictValues)
            this.editor.set("displayedValue", inValue);
    },

    setDataSet: function(inDataSet, noSetEditorValue) {
        this._inSetDataSet = true;
        this.inherited(arguments);
        if (this.editor) {
            this.editor.set("store", this.generateStore());
            if (!noSetEditorValue) {
                this.setEditorValue(this.dataValue);
            }
        }
        delete this._inSetDataSet;
    },
    clear: function() {
        // note: hack to call internal dijit function to ensure we can
        // set a blank value even if this is not a valid value
        if (this.editor) {
            var valueWas = this.editor.get("displayedValue");
            if (this.restrictValues) {
                this.editor.set('value', '', false);
            } else {
                this.editor.set("value", undefined, false);
            }
            this.editor.item = null;
            this.selectedItem.clearData(); // may get called again in changed, but only if !_cupdating and hasValues
            this._lastValue = this.makeEmptyValue();

            // need to preserve the values if we're in the middle of a dataSet change or we'll be firing onchange events even though the value remains unchanged
            if (!this._inSetDataSet) {
                this.displayValue = "";
                this.dataValue = null;

                // because we passed in false above so as to fire out own SYNCRHONOUS onchange
                // _lastValueReported is not cleared, which means that trying to changing the value
                // back to _lastValueReported will fail to fire an onchange event
                this.editor._lastValueReported = "";
                this.updateReadonlyValue();
                this.resetState();
            }
            if (!this._cupdating && valueWas && this.hasValues()) {
                this.changed();
            }
        } else {
            this.resetState();
        }
    },
    validationEnabled: function() {
        return this.restrictValues || this.required;
    },
    _getValidatorNode: function() {
        var result = dojo.query(".dijitValidationContainer", this.editor.domNode)[0];
        result.firstChild.value = "";
        return result;
    },
/*
    editorChanged: function() {
        / * WM-2515; Don't bother firing an onchange event if there are no options to choose from; this situation
         *          presumably means that we're still waiting for the dataSet to get options from the server;
         *          all changed actions will fire AFTER we have a displayValue to go with whatever dataValue we have.
         * /
        if (this.dataSet && this.dataSet.getCount()) {
        var result = this.inherited(arguments);
        this.updateSelectedItem();
        return result;
        }
    },
    */
    blurred: function() {
        this.inherited(arguments);
        var displayValue = this.displayValue;
        if (this.getDisplayValue() != displayValue) {
            this.doOnchange();
        }
    },
    getInvalid: function() {
        if (!this.validationEnabled()) {
            if (this.required && !this.getDataValue()) return true;
            return false;
        }
        var valid;
        if (!this.editor || this.editor._focused) {
            valid = true;
        } else {
            var dataValue = this.getDataValue();
            var hasValue = Boolean(dataValue);
            // always valid if !this.restrictValue
            // always valid if !this.displayValue, but if there is a displayValue there must be a dataValue /* May not be true in dojo 1.6 */
            var display = this.getDisplayValue();

            this._isValid = (!this.restrictValues || (display && hasValue || !display));
            //console.log("_isValid:" + this._isValid + "; display="+display + "; data:"+this.dataValue);

            if (this.readonly) valid = true;
            else if (this.required) {
                if (!this.restrictValues && !display) {
                    valid = false;
                } else if (this.restrictValues && !hasValue) {
                    valid = false;
                } else {
                    valid = true;
                }
            } else if (this.restrictValues && display && !hasValue) {
                valid = false;
            } else {
                valid = true;
            }
            /*
        else if (this.required && !this.dataValue) valid = false;
        else if (this.restrictValues && display && !this.dataValue) valid = false;
        else valid = true;
        */
        } /* Clear invalid flag if its now valid; don't set invalid flag until dojo decides its time to set it */
        if (valid) this.validatorNode.style.display = "none";
        return !valid;
    },
    /*
    updateSelectedItem: function() {
        // FIXME: only if dataField is All Field should we update entire selectedItem.
        var v = this.getEditorValue(true);
        this.selectedItem.setData(v);

    },
    */
    getSelectedIndex: function() {
        if (this.editor.item) return this.editor.item.id;
        return -1;
        //return this.getItemIndex(this.selectedItem.getData());
    },
/*
    getItemIndex: function(item) {
        if (!item) return -1;
        var data = this.editor.store.data;
        for (var i = 0; i < data.length; i++)
        if (item == data[i] || item[this.dataField] == data[i][this.dataField]) return i;
        return -1;
    },
*/
    getEditorValue: function() {
        var result = this.inherited(arguments);

        if (!result && !this.restrictValues) result = this.editor.get("displayedValue");
        return (result || result === 0) ? result : this.makeEmptyValue();
    },
    getDisplayValue: function() {
        if (this.editor) return this.editor.get('displayedValue');
        return null;
    },
    blurred: function() {
        this.changed();
        this.doOnblur();
    },
    changed: function() {
        if (wm.isMobile && this.editor && this.editor.focusNode == document.activeElement) {
            this.editor.focusNode.blur();
            return; // blur will trigger changed call
        }
        var item;
        var index;
        if (this.editor) item = this.editor.get('item');
        var result = null;
        if (this.editor) var displayedValue = this.editor.get("displayedValue");

        /* If there is an item its mobile then just use the item as the mobile version of the select editor's item is always good */
        if (item && wm.isMobile) {
            this.selectedItem.setData(item);
        }

        /* item may still be set in the dijit even though the displayed value no longer matches it; */
        else if (item && displayedValue == item.name) {
            index = item.id;
            var result = this.dataSet ? this.dataSet.getItem(index) : null;
            this.selectedItem.setData(result);
        } else {
            this.selectedItem.setData(null);
        }
        if (this.editor && this.editor._lastValueReported === "" && displayedValue !== "") {
            this.editor._lastValueReported = displayedValue;
        }

        return this.inherited(arguments);

    },
    selectItem: function(rowIndex) {
        if (!this.editor) return;
        var item = this.dataSet.getItem(rowIndex);
        this.selectedItem.setData(item);
        //this.editor.set("value", String(item.getIndexInOwner()), false);
        this.editor.set("value", this._getDisplayData(item), false);
        if (wm.isMobile) {
            this.editor.item = item.getData();
        }
    }

/*
    setDefaultOnInsert:function(){
        if (this.editor && this.defaultInsert){
            if (this.$.binding && this.$.binding.wires.defaultInsert)
            this.$.binding.wires.defaultInsert.refreshValue();
            this.setEditorValue(this.defaultInsert);
            this.changed();
        }
    },

    calcIsDirty: function(val1, val2) {
    if (val1 !== null && val2 !== null && typeof val1 == "object" && typeof val2 == "object") {
        return val1[this._storeNameField] != val2[this._storeNameField];
    } else {
        return val1 != val2;
    }
    }
    */

});






//===========================================================================
// Lookup Editor
//===========================================================================
dojo.declare("wm.Lookup", wm.SelectMenu, {
    dataType: "",
    dataField: "",
    autoDataSet: true,
    startUpdate: true,
    maxResults: 500,
    ignoreCase: true,
    postInit: function() {
        if (this.autoDataSet && this.formField) {
            this.createDataSet();
        } else if (!this.autoDataSet) {
            this.startUpdate = false;
         }
        this.inherited(arguments);
    },
    createDataSet: function() {
        wm.fire(this.$.liveVariable, "destroy");
        var parentForm = this.getParentForm();
        if (parentForm) {

            if (wm.isInstanceType(parentForm, wm.LiveForm) && !parentForm.dataSet) return;
            if (wm.isInstanceType(parentForm, wm.DataForm) && !parentForm.dataSet && !parentForm.type) return;
            if (!wm.getFormLiveView || !wm.getFormField) return;

            var view = wm.getFormLiveView(parentForm);
            var parentType = wm.isInstanceType(parentForm, wm.DataForm) ? parentForm.type : parentForm.dataSet && parentForm.dataSet.type;

            var ff = wm.getFormField(this);

            try {
                var currentType;
                if (this.dataType) {
                    currentType = this.dataType;
                } else if (parentForm instanceof wm.ServiceInputForm) {
                    var typeDef = parentForm.dataOutput._dataSchema;
                    if (typeDef) {
                        currentType = typeDef[ff] ? typeDef[ff].type : null;
                    }
                } else if (parentType && parentType != "any") {
                    currentType = wm.typeManager.getType(parentType).fields[ff].type;
                } else {
                    currentType = "string";
                }
            } catch (e) {}

            if (view) {
                view.addRelated(ff);
            }
            var lv = this.dataSet = new wm.LiveVariable({
                name: "liveVariable",
                owner: this,
                autoUpdate: false,
                startUpdate: false,
                _rootField: view ? ff : null,
                liveView: view,
                liveSource: currentType,
                maxResults: this.maxResults,
                ignoreCase: this.ignoreCase,
                refireOnDbChange: true,
                orderBy: this.orderBy // right now, only FilteringSelect provides the orderBy property
            });
            this.selectedItem.setType(this.dataSet.type);
            this.createDataSetWire(lv);
        }
    },

    createDataSetWire: function(inDataSet) {
        if (!this.$.binding) {
            new wm.Binding({
                name: "binding",
                owner: this
            });
        }
        var w = this._dataSetWire = new wm.Wire({
            name: "dataFieldWire",
            target: this,
            owner: this.$.binding,
            source: inDataSet.getId(),
            targetProperty: "dataSet"
        });
        w.connectWire();
    },
    setAutoDataSet: function(inAutoDataSet) {
        this.autoDataSet = inAutoDataSet;
        if (this.autoDataSet) {
            this.createDataSet();
            if (this.dataSet) {
                var eventId = this.debugAutoSetData();
                this.update();
                if (eventId) app.debugDialog.endLogEvent(eventId);
            }
        }
    },
    debugAutoSetData: function() {
        if (app.debugDialog) {
            var eventId = app.debugDialog.newLogEvent({
                eventType: "update",
                sourceDescription: "Initializing " + this.getRuntimeId(),
                resultDescription: this.getRuntimeId() + ".setAutoDataSet() called to populate Lookup editor from server",
                affectedId: this.getRuntimeId(),
                firingId: this.getRuntimeId(),
                method: "update"
            });
            return eventId;
        }
    },
    _getFormSource: function(inForm) {
        if (this.isAncestorInstanceOf(wm.RelatedEditor)) {
            var w = wm.data.getPropWire(inForm, "dataSet");
            return w && w.source && this.getRoot().getValueById(w.source);
            /*var o = this.owner, w = wm.data.getPropWire(o, "dataValue");
        return w && w.source && this.getRoot().getValueById(w.source);*/
        } else {
            var lf = this.isAncestorInstanceOf(wm.LiveForm) || this.isAncestorInstanceOf(wm.DataForm);
            if (lf && this.formField) {
                return lf.dataSet.getValue(this.formField);
            }
        }
    },
    // NOTE: lookups automatically push data back to their source
    changed: function() {
        // When loopup editor is changed by user only then we should change liveForms field values.
        // if value of loopupEditor is being initialized by the owner(not user) that means we should not change value of other fields in liveForm.
        if (this.isUpdating())
            return;

        this.inherited(arguments);
        if (wm.getParentForm) {
            var f = wm.getParentForm(this);
    /*
            if (f instanceof wm.RelatedEditor) {
            var s = this._getFormSource(f);
            if (s) {
                            s.beginUpdate();
                //console.log(s.getId(), this.dataValue);
                    var v = this._selectedData;
                // update cursor
                if (this.autoDataSet && this.dataSet) {
                                // this is invalid; in some conditions, the objects in the datastore that populate _selectedData are no longer exact replicas of the objects in the datastore; for example, they have _selectMenuName property added to them
                    //var i = this.dataSet.getItemIndex(v);
                                var i = this.getItemIndex(v);
                    if (i >=0)
                        this.dataSet.cursor = i;
                }
                s.setData(v);
                this.endEditUpdate();
                //wm.fire(f, "populateEditors");
            }
            }
            */
        }

        /* If this is a wm.Lookup within a composite key acting to select an id, we need to propagate its value up to the parent form's relationship */
        if (this.relationshipName && !this.selectedItem.isEmpty()) {
            var subform = this.getParentForm();
            var mainform = subform.getParentForm();
            mainform.dataOutput.setValue(this.relationshipName, this.selectedItem);
        }
    }
});

if (wm.isMobile) {
    wm.Lookup.extend({
    _createEditor: function() {
        var e = this.inherited(arguments);
        this.connect(e, "openDropDown", this, "_onOpenDropDown");
        return e;
    },
    _onOpenDropDown: function() {
        this.inherited(arguments);
    }
    });
}
dojo.declare("wm.FilteringLookup", wm.Lookup, {
    startUpdate: false,
    restrictValues: true, // looking up up objects; partial match is useless
    changeOnKey: true,
    pageSize: 25,
    autoComplete: true,
    hasDownArrow: false,
    placeHolder: "Start typing to find matches",
    filterField: "", // right now we only support filtering upon a single field
    prepare: function() {
        this.inherited(arguments);
        this.maxResults = this.pageSize;
        this.filterField = this.displayField;
        this.orderBy = "asc: " + this.displayField;
        if (!this.autoDataSet) this.changeOnKey = true;
    },
    _onchange: function(optionalValue) {
        if (this.disabled || this.readonly || !this.isActive()) return;
        var autoDataSet = this.autoDataSet && this.getParentForm();
        var value = optionalValue || this.editor.get("displayedValue");
        if (autoDataSet) {
            var lastValue = this.dataSet.filter.getValue(this.filterField);
        }

        /* Insure that oldValue doesn't get used in setDataSet if there is no current item */
        if (!this.editor.get("item")) {
            this.dataValue = "";
        }

        /* Don't update the filter if its already firing; keep it at its last value so we'll know when it returns
         * what was requested
         */
        if (value != this._lastQueryValue) {
            this._lastQueryValue = value;

            if (autoDataSet) {
                this.dataSet.filter.setValue(this.filterField, value);
                if (value === undefined || value === null || value === "") {
                    this.dataSet.setData([]);
                } else {
                    this.dataSet.update();
                }
            } else {
                this.displayValue = value;
                this.valueChanged("displayValue", value);
                this.dataSet.update();
            }
        }
    },
    getDisplayValue: function() {
        if (this.editor) return this.editor.get('displayedValue');
        else return this.inherited(arguments);
    },
    setDataValue: function(inData) {
        if (this.dataSet && inData) {
            this.dataSet.setData(inData ? [inData] : null);
        }
        this.inherited(arguments);
    },
    setPageSize: function(inValue) {
        this.maxResults = this.pageSize = inValue;
    },
    isActive: function() {
        return this.editor._focused || this.editor.dropDown && this.editor.dropDown.domNode.parentNode && this.editor.dropDown.domNode.parentNode.style.display != "none";
    }
});
if (!wm.isMobile) {
    wm.FilteringLookup.extend({
    getEditorProps: function(inNode, inProps) {
        var p = this.inherited(arguments);
        p.queryExpr = "*";
        return p;
    },

    setDataSet: function(inDataSet) {
        this.inherited(arguments, [inDataSet, true]);
        if (this.dataSet && !this.dataSet.isEmpty() && this.isActive()) {
            wm.job(this.getRuntimeId() + ".handleSetDataSet", 1, dojo.hitch(this, function() {
                if (this.editor.declaredClass != "wm.dijit.form.ComboBox") {
                    var item = this.editor.get("item");
                    if (item) {
                        if (item[this._storeNameField] != this.editor.get("displayedValue")) item = null;
                    }
                    if (!item && this.editor.get("displayedValue")) {
                        this.editor._startSearchFromInput();
                    }
                    this._onchange(); // see if there have been any new characters since our last request was fired
                }
            }));
        }
    },
    doOnchange: function() {
        this._onchange();
        if (this.editor.get("item")) {
            this.inherited(arguments);
        }
    },
    _end: 0
});
} else {
    wm.FilteringLookup.extend({
    getEditorProps: function(inNode, inProps) {
        var p = this.inherited(arguments);
        p.noFilter = true;
        delete p.placeHolder;
        return p;
    },
    setDataSet: function(inDataSet) {
        this.inherited(arguments, [inDataSet, true]);
        if (this.dataSet) {
            if (this.editor && this.editor.dropDown) {
                this.editor.listSet.setDataSet(this.dataSet);
            }
        }
    },
    _onOpenDropDown: function() {
        var l = this.editor.listSet;
        l.searchBar.setPlaceHolder(this.placeHolder);
        if (this._searchBarChangeConnect) {
            dojo.disconnect(this._searchBarChangeConnect);
            wm.Array.removeElement(this._connections, this._searchBarChangeConnect);
        }
        this._searchBarChangeConnect = l.searchBar.connect(l.searchBar, "onchange", this, function(inDisplayValue, inDataValue) {
            this._onchange(inDisplayValue);
        });
    },
    _end: 0
    });
}





/* MOBILE CLASSES */
dojo.declare(
    "wm.dijit.form.ComboBox",
    [dijit.form.ValidationTextBox, dijit._HasDropDown],
{
    baseClass: "dijitTextBox dijitComboBox",
    popupClass: "wm.ListSet",
    forceWidth: false, // Force the popup to use its own width and not match the editor width
    autoWidth: false,// Force the popup to use its own width and not match the editor width
    value: "",
    noFilter: false,
    templateString: dojo.cache("dijit.form", "templates/DropDownBox.html"),

    // hasDownArrow: [const] Boolean
    //      Set this textbox to display a down arrow button, to open the drop down list.
    hasDownArrow: true,

    // openOnClick: [const] Boolean
    //      Set to true to open drop down upon clicking anywhere on the textbox.
    openOnClick: true,
    buildRendering: function(){
        this.inherited(arguments);
        this._buttonNode = this.domNode;
    },
    createDropDown: function() {
        this.dropDown = new wm.Dialog({owner: this.owner,
                           corner: wm.device == "phone" ? "cc" : "cc",
                           fixPositionNode: wm.device == "tablet" ? this.focusNode : undefined,
                           width: wm.device == "phone" ? "100%" : "350px",
                           height: wm.device == "phone" ? "100%" : "600px",
                           border: "1",
                           borderColor: "#666",
                           useContainerWidget: true,
                           padding: "0",
                           margin: "10",
                           title: "",//this.owner.caption,  need this back if we reduce the margin
                           destroyRecursive: function() {if (!this.isDestroyed) this.destroy();} // this === this.dropDown
                          });
        this.dropDown.dialogScrim.connect(this.dropDown.dialogScrim.domNode, wm.isFakeMobile ? "onclick" : "ontouchstart", this.dropDown, "hide");
        var c = this.dropDown.containerWidget;
        c.setPadding("0");
        c.setMargin("0");

        this.listSet = wm.ListSet({owner: this.dropDown,
                    parent: c,
                       _noFilter: this.noFilter,
                    selectionMode: "radio",
                    captionAlign: "left",
                    captionPosition: "top",
                    caption: "",//this.owner.caption,
                    //captionSize: "20px",
                    border: "0",
                    editorBorder: false,
                    padding: "0",
                    width: "100%",
                    height: "100%",
                       onchange: dojo.hitch(this, function(inDisplayValue, inDataValue, inSetByCode) {
                        if (this._cupdating || inSetByCode) return;
                        var data = this.owner.allowNone && this.listSet.grid.getSelectedIndex() == 0 ? null : this.listSet.grid.selectedItem.getData();
                        var value = data ? this.owner._getDisplayData(data) : null;

                        if (data || this.listSet.grid.getSelectedIndex() == 0) {
                            this.set("value", value);
                            if (data) {
                                data.name = this.listSet.grid.getCell(this.listSet.grid.getSelectedIndex(),"name");
                            }

                            this.set("item", data);
                            this.displayedValue = value;
                            this.owner.changed();

                            this.closeDropDown();
                            this.dropDown.hide();

                        }
                    })
                       });
        this.listSet.grid.setSelectionMode("radio");
        this.closeButton = new wm.ToolButton({owner: this.owner,
                              name: "closeButton",
                              border: "1",
                              borderColor: "#222",
                              _classes: {domNode: ["SelectCloseButton"]},
                              width: "30px",
                              height: "100%",
                              margin: "4",
                              padding: "0 4 0 4",
                              parent: this.dropDown.titleBar,
                              caption: "X",
                              onclick: dojo.hitch(this, function() {
                              this.closeDropDown();
                              this.dropDown.hide();
                              })});
    },

    openDropDown: function( /*Function*/ callback) {
        app.addHistory({
            id: this.owner.getRuntimeId(),
            options: {},
            title: "Hide Popup"
        });

        if (!this.dropDown) {
            this.createDropDown();
        }
        this.listSet.setShowing(false); // improves performance
        this._cupdating = true;
        this.dropDown.setTitle(this.owner.caption); // in case caption has changed
        this.listSet.setDataSet(null);
        this.dropDown.setShowing(true);

        if (this.owner.displayExpression || this.owner.displayMenuExpression) {
            this.listSet.setDisplayField("");
            this.listSet.setDisplayExpression(this.owner.displayMenuExpression || this.owner.displayExpression);
        } else {
            this.listSet.setDisplayExpression("");
            this.listSet.setDisplayField(this.owner.displayField);
        }
        if (this.owner.allowNone) {
            if (!this.owner._dataSet) {
                this.owner._dataSet = new wm.Variable();
            }
            this.owner._dataSet.setDataSet(this.owner.dataSet);
            var newItem = {};
            for (var fieldName in this.owner._dataSet._dataSchema) {
                newItem[fieldName] = "";
            }
            this.owner._dataSet.addItem(newItem, 0);
            this.listSet.setDataSet(this.owner._dataSet);
        } else {
            this.listSet.setDataSet(this.owner.dataSet);
        }
        /*
         this.listSet.setDataValue(this.owner.dataValue); // must be done after grid._render()
         this._cupdating = false;
         */
        // TODO: Need to preselect the current value!
        /* wm.onidle allows the dialog to render before populating the somewhat slow list */
        wm.onidle(this, function() {
            this.listSet.setShowing(true);
            this.listSet.grid._render();
            this._cupdating = true;
            this.listSet.grid._cupdating = true;
            this.listSet.setDataValue(this.owner.dataValue);
            this.listSet.grid._cupdating = false;
            this._cupdating = false;
        });
        this._opened = true;
        return true;
    }
});
