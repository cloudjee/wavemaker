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

dojo.provide("wm.base.components.Property_design");
dojo.require("wm.base.components.Property");


wm.Property.extend({
    designTimeInit: function() {
	if (this.property) {
	    /* onIdle because dojo.connect requires that the component be created, and it won't be created until the page finishes generating */
	    wm.onidle(this, function() {
		this.selectProperty(this.property);
	    });
	}
    },
	listProperties: function() {
		var p = this.inherited(arguments);
		p.bindTarget.ignoretmp = this.isEvent;
		p.bindSource.ignoretmp = this.isEvent;
		return p;
	},
        beginSelectProperty:function() {
				wm.onidle(this, "beginBind");
	},
	beginBind: function(inPropName) {
		studio.onSelectProperty = dojo.hitch(this, "selectProperty");
	    studio.selectProperty(this, null, studio.getDictionaryItem("wm.Property.SELECT_PROPERTY", {propertyName: this.name}));
	},
    /* Design-time only */
    selectProperty: function(inId) {
        if(this._nameChangeConnect) {
            dojo.disconnect(this._nameChangeConnect);
            delete this._nameChangeConnect;
        }

        studio.onSelectProperty = null;
        var id = inId.replace("studio.wip.", "");
        this.property = id;
        // FIXME: this split/shift/join thing happens in Composite too, unify
        var ids = id.split(".");
        var cName = ids.shift();
        var prop = ids.join(".");
        if (!prop) prop = "dataSet";

        // FIXME: this also happens in Composite, a couple different ways
        var c = studio.wip.getValue(cName);

        if(c) {
            var propDef = c.listProperties()[prop];

            if(propDef) {
                if (!wm.typeManager.getType(propDef.type)) {
                    var prop_c = c.getValue(prop);
                    if (prop_c instanceof wm.Variable) {
                        this.type = prop_c.type;
                    } else if (propDef.type) {
                        this.type = propDef.type;
                    } else {
                        this.type = typeof prop_c;
                    }
                } else {
                    this.type = propDef.type;
                }
                this.method = propDef.method;
                if (propDef.operation) {
                    if (propDef.operationTarget) {
                        this.operationTarget = cName + "." + propDef.operationTarget;
                    } else {
                        this.operationTarget = cName;
                    }
                    this.operation = typeof propDef.operation == "string" ? propDef.operation : prop;
                    /*
                    if (typeof propDef.operation == "string") {
                        this.operation = cName + "." + propDef.operation;
                    } else {
                        this.operation = cName + "." + prop;
                    }*/

                }
                var props = ["bindSource", "bindTarget", "ignore", "hidden", "readonly", "writeonly", "editor", "editorProps"];
                dojo.forEach(props, function(inName, i) {
                    if (propDef[inName]) this[inName] = propDef[inName];
                }, this);
                if (propDef.bindable) {
                    this.bindSource = this.bindTarget = true;
                }
            } else if (c instanceof wm.Variable && (!prop || prop == "dataSet")) {
                this.type = c.type;
                if (c instanceof wm.ServiceVariable == false) {
                    this.bindSource = this.bindTarget = true;
                } else {
                    this.ignore = true;
                }
            } else if (c instanceof wm.Variable && c.isDataProp(prop)) {
                this.type = c._dataSchema[prop].type;
                if (c instanceof wm.ServiceVariable) {
                    this.ignore = true;
                    this.bindTarget = false;
                    this.isDataField = true;
                }
            }
            if(c.isEventProp(prop)) this.setValue("isEvent", true);
            if(c.schema[prop] && c.schema[prop].readonly) this.setValue("readonly", true);

            this._nameChangeConnect = this.connect(c, "set_name", this, function() {
                this.property = c.name + "." + prop;
            });
        }

    },

    setProperty: function(inId) {
	this.selectProperty(inId);
    },
	write: function() {
        var prop = this.owner.getValue(this.property);
		if (prop && prop instanceof wm.Variable) {
			this.type = prop.type;
		}
		return wm.Property.deploy ? "" : this.inherited(arguments);
	},
	publish: function() {
	    try {
		this.selectProperty(this.property); // updates type field
	    } catch(e){}
	    var operation = "";
	    if (this.operation) {
    	    if (typeof this.operation == "number" || typeof this.operation == "boolean") {
    	       operation = this.operation;
    	    } else if (typeof this.operation == "string") {
    	       operation = "'" + this.operation + "'";
    	    }
    	}


		return '[' +
			'"' + this.name + '", ' +
			'"' + this.property + '", ' +
			'{' +
				'group: "Published"' + (
					this.isEvent ? ', isEvent: true' :
						(this.readonly ? ', readonly: true' : '') +
						(this.bindSource ? ', bindSource: true' : '') +
					(this.bindTarget ? ', bindTarget: true' : '') +
					(this.ignore ? ', ignore: true' : '') +
					(this.hidden ? ', hidden: true' : '') +
					(this.writeonly ? ', writeonly: true' : '') +
                    (this.editor ? ', editor: "' + this.editor + '"' : '') +
                    (this.editorProps ? ', editorProps: ' + dojo.toJson(this.editorProps) : '') +
					(operation ? ', operation:' + operation : '') +
                    (this.operationTarget ? ', operationTarget:"' + this.operationTarget + '"' : '') +
                    (this.property ? ', property: "' + this.property + '"': '') +
                    (this.group ? ', group:"widgetName", subgroup:"' + this.group + '"': '') +
                    (this.order && this.group ? ', order:' + this.order : '') +
					(this.type && !operation ? ', type: "' + this.type + '"' : '')) +
			'}' +
		']';
	}
});

wm.Object.extendSchema(wm.Property, {
    type: {writeonly: true},
    owner: { ignore: 1},
    property: {group: "widgetName", order: 2},
    selectProperty: {group: "widgetName", order: 3,operation:"beginSelectProperty"},
    bindSource: {group: "widgetName", order: 10},
    bindTarget: {group: "widgetName", order: 11},
    isEvent: {group: "widgetName", order: 20},
    readonly: {group: "widgetName", order: 30},
    ignore: {group: "widgetName", order: 40},
    hidden: {group: "widgetName", order: 45},
    group: {group: "widgetName", order: 46},
    order: {group: "widgetName", order: 47, type: "number"},
    isDataField: {group: "widgetName", order: 50},
    operation: {group: "widgetName", order: 60},
    operationTarget: {group: "widgetName", order: 60},
    editor: {group: "widgetName", order: 70},
    editorProps: {group: "widgetName", order: 70}
});

/*
registerPackage([ "Components", "Property", "wm.Property", "wm.base.components.Property", "images/flash.png", "Published Property"]);
*/
