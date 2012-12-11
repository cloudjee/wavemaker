/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

dojo.provide("wm.base.widget.Composite");
dojo.require("wm.base.widget.Panel");

// Property Facade Publishing: helper API

// publish property "name" in "ctor" as a facade for target property "id"
wm.publishProperty = function(ctor, name, id, schema) {
    var pt = ctor.prototype;

    // fixme: expensive
    var parts = id.split(".");
    var target = parts.shift();
    var property = parts.join(".");
    if (schema.isEvent) {
        // event property name has to start with "on"
        if (name.slice(0,2) != "on")
            name = "on" + name;
        // initialize value in prototype
        pt[name] = function(inSender) {};
        // build getter/setter
        /*
        var capP = name.slice(0, 1).toUpperCase() + name.slice(1);
        pt["get" + capP] = function(inValue) {
            return this[name] = this.getValue(target).getValue(property);
        }
        pt["set" + capP] = function(inValue) {
            this.getValue(target).setValue(property, this[name] = inValue);
        }
        */
    } else if (target) {
        if (schema.type == "function") {return;} // not supported except in PageContainers

        // initialize value in prototype
        pt[name] = undefined;

        // build getter/setter
        var capP = name.slice(0, 1).toUpperCase() + name.slice(1);
        pt["get" + capP] = function(inValue) {
            var t = this.getValue(target);

            if ((!property || property == "dataSet") && t instanceof wm.Variable) {
                 return t;
            } else if (t) {
                 return this[name] = this.getValue(target).getValue(property);
            }
        };

        pt["set" + capP] = function(inValue) {
            var t = this.getValue(target);
            if (t) {
                t["_inSet" + capP] = true;
                try {
                    if (!property && t instanceof wm.Variable) {
                        this[name] = inValue;
                        t.setData(inValue);
                    } else {
                        this.getValue(target).setValue(property, this[name] = inValue);
                    }
                } catch(e) {}
                delete t["_inSet" + capP];
            }
        };

        // build special setter to avoid circular connection between setter and wire
        var pName = "source" + name;
        var pCapP = pName.slice(0, 1).toUpperCase() + pName.slice(1);
        pt["set" + pCapP] = function(inValue) {
            var t = this.getValue(target);
            if (t) {
                if (!t["_inSet" + capP]) {
                    t["_inSet" + capP] = true;
                    try {
                        if (t instanceof wm.Variable) {
                            if (t !== this[name]) {
                                this[name] = inValue;
                                var id = t.owner.getRuntimeId();
                                dojo.publish(id + "." + name + "-ownerChanged", [this]);
                            }

                        } else {
                            if (this[name] !== inValue) {
                                // This is not needed; in setsource + Name, its triggered by a bind
                                // event which means its already been changed
                                // t._setProp(property, this[name] = inValue);
                                this.valueChanged(name, inValue);
                            } else if (this[name] instanceof wm.Variable) {

                            }
                        }

                    } catch(e) {}
                    delete t["_inSet" + capP];
                }
            }
        };


        if (schema.operation) {
            schema = dojo.clone(schema);
            var op = schema.operation;
            var opTarget = schema.operationTarget;
            schema._operation = function() {
                var t;
                var operation = op;
                if (opTarget) {
                    t = this.getValue(opTarget);
                } else {
                    t = this.getValue(target);
                }
                if (t) {
                    if (typeof operation == "function") {
                        operation();
                    } else if (typeof operation == "string") {
                        t[operation]();
                    } else {
                        t[property]();
                    }
                }
            };
        }
    }
    // extend schema
    var exSchema = {};
    if (schema)
        exSchema[name] = schema;
    wm.Object.extendSchema(ctor, exSchema);
    // register published properties
    var pb = pt.published = (pt.published || {});
    pb[name] = {name: name, id: id, target: target, property: property};
    if (schema.operation) {
        pb[name].operation = schema.operation;
        pb[name].operationTarget = schema.operationTarget;
    }
}

// Cause inCtor to publish inProperties (Array of property descriptors, [[ctor, name, id, schema]...])
wm.publish = function(inCtor, inProperties) {
    for (var i=0, p; p=inProperties[i]; i++) {
        p.unshift(inCtor);
        wm.publishProperty.apply(this, p);
    }
}

// To be mixed in with a container widget to create a composite,
// a custom widget which can own components and
// exposes published component properties
dojo.declare("wm.CompositeMixin", null, {
    _regenerateOnDeviceChange: 1,
    _hasCustomPath: true,
    init: function() {
        //this.published = {};
        // FIXME: does createComposite need to come before inherited?
        if (this instanceof wm.Control) {
            this.initDomNode();
        }
        this._isDesignLoaded = this.isDesignLoaded();
        this.createComposite();
        this.inherited(arguments);
    },
    postInit: function() {
        this.inherited(arguments);
        if (this instanceof wm.Control == false) {
            if (!this.$.binding && this._isDesignLoaded) {
                new wm.Binding({
                    name: "binding",
                    owner: this
                });
            }
        }
        // initialize published properties
        for (var p in this.published) {
            // id qualifier to localize ids
            var pre = this.name + ".";
            var o = this.owner;
            while (o instanceof wm.Composite) {
                pre = o.name + "." + pre;
                o = o.owner;
            }
            var pub = this.published[p];
            if (this.schema[pub.name].isEvent) {
                var c = this.marshallFacade(pub.name);
                if (c.comp)
                    dojo.connect(c.comp, pub.property, this, pub.name);
            } else {
                // propagate loaded values to underlying properties
                if (this[p] != this.constructor.prototype[p])
                    this.setValue(p, this[p]);

                if (!this.schema[pub.name].operation) {
                    // watch changes on our source property, will propagate values up from source
                    // (possibly round-tripping a value set above)
                    // instead of using the real target name, use a special one ("source" + realTargetName)
                    // to avoid circular connection
                      if (!this.$.binding) {
                        new wm.Binding({
                            name: "binding",
                            owner: this
                        });
                    }
                    new wm.Wire({name: "_" + pub.name, target: this, targetProperty: "source" + pub.name, source: pre + pub.id, owner: this.$.binding}).connectWire();
                }
            }
        }

	var cssText = this.constructor.prototype._cssText;
        if (cssText) {
            this.cssLoader = new wm.CssLoader({
                owner: this,
                relativeUrl: false
            });
            this.cssLoader.setCss(cssText);
        }
        wm.onidle(this, function() {
            this.start(); // this is created from a wm.Page where startup code goes in start method
            this.onStart();
        });
    },
    start: function() {}, // meant to be overridden by the end user's composite
    onStart: function() {}, // meant to be overriden as standard event handler
    // get the target component for facade property inName
    marshallFacade: function(inName) {
        if (this.published) {
            var p = this.published[inName];
            if (p) {
                // FIXME: can't reuse "published[inName]".since "published"
                // is shared among all instances. But we do want to have
                // something to cache p.comp since getValue(p.target) is expensive
                p.comp = this.getValue(p.target);
            }
            return p;
        }
    },
    createComposite: function() {
        // We don't have a concept of binding scoped to the
        // Widget, so we do a fixup here.
        // FIXME: fix scoping in publisher instead because
        // we have more ready information at publish time.
        var c = dojo.clone(this.constructor.components);
        var isDesignLoaded = this._isDesignLoaded;

        this.updateComponentsBinding(c);

        // construct designed components with "owner: this"
        this._isDesignLoaded = false;
        this.createComponents(c, this);
        this.fixupSubscriptions();
        this._isDesignLoaded = isDesignLoaded;
    },
    fixupSubscriptions: function() {

        wm.forEachProperty(this.constructor.prototype.published, dojo.hitch(this, function(propDef,name) {
                    var target = this.getRuntimeId() + "." + propDef.id;

                    var valueFromOwner = this[name];
                    var value = this.getValue(name); // this call rather annoyingly changes this[name]
                    if (valueFromOwner !== undefined ) this[name] = valueFromOwner;
                    if (value instanceof wm.Component) {
                        if (value instanceof wm.Variable) {
                            this.subscribe(target + "-ownerChanged", dojo.hitch(this, "_forwardBindEvent", this.getRuntimeId() + "." + name, name, target));
                        }
                    }


        }));
    },
    _forwardBindEvent: function(inName, inPropName, target) {
            dojo.publish(inName + "-ownerChanged", [this.getValue(inPropName)]);
    },
    updateComponentsBinding: function(inComponents) {
        // construct a directory of component names that are
        // local to this composite
        this.buildComponentsDir(inComponents);
        // locate bindings to local components and qualify
        // with a (widget name prefix?)
        this._updateComponentsBinding(inComponents);
    },
    buildComponentsDir: function(inComponents) {
        this._dir = {};
        this._buildComponentsDir(inComponents);
    },
    _buildComponentsDir: function(inComponents) {
        for (var i in inComponents) {
            this._dir[i] = true;
            this._buildComponentsDir(inComponents[i][3]);
        }
    },
    _fixupValue: function(inValue) {
        var v = inValue;
        if (v && v.split) {
            v = v.split(".").shift();
            if (v == "*")
                v = this.name;
            else if (this._dir[v]) {
                if (this._isDesignLoaded && this.isAncestor(studio.designer)) {
                    v = this.getRuntimeId().replace(/^studio\.wip\./,"") + "." + inValue;
                } else if (!this._isDesignLoaded && this.isAncestor(app._page)) {
                    v = this.getRuntimeId().replace(/^.*?\./,"") + "." + inValue;
                } else {
                    v = this.getRuntimeId() + "." + inValue;
                }
            }
        }
        return v;
    },
    _fixupExpression: function(inValue) {
        var pre = this.name + ".";
        var srcs = wm.expression.getSources(inValue);
        for (var i in srcs) {
            inValue = inValue.replace(srcs[i], pre + srcs[i]);
        }
        return inValue;
    },
    _fixupProperties: function(inClass, inProps) {
        // qualify ids that refer to local components with "<name>."
        for (var p in inProps) {
            var v = inProps[p];
            switch(inClass){
                case "wm.Wire":
                    switch(p){
                        case "expression":
                            v = this._fixupExpression(v);
                            break;
                        case "source":
                            v = this._fixupValue(v);
                            break; // switch(p)
                    }
                    break; // switch(inClass)
                case "wm.EditPanel":
                    switch(p){
                        case "liveForm":
                        case "operationPanel":
                        case "savePanel":
                        v = this._fixupValue(v);
                        break;
                    }
                    break;
                case "wm.DesignableDialog":
                    if (p == "containerWidgetId") {
                        v = this._fixupValue(v);
                    }
                    break;
                default:
                    switch(p){
                        case "dataSet":
                        case "dataOutput":
                        case "liveSource":
                        case "defaultButton":
                            v = this._fixupValue(v);
                            break; // switch(p)
                    }
                    break; // switch(inClass)
            }
            inProps[p] = v;
        }
    },
    _fixupEvents: function(inProps) {
        // qualify events that refer to local components with "<name>."
        for (var p in inProps) {
            inProps[p] = this._fixupValue(inProps[p]);
        }
    },
    _updateComponentsBinding: function(inComponents) {
        for (var i in inComponents) {
            var c = inComponents[i];
            this._fixupProperties(c[0], c[1]);
            this._fixupEvents(c[2]);
            this._updateComponentsBinding(c[3]); // children
            //c._isBindableSource = false;
        }
    }
});

// design only
wm.CompositeMixin.extend({
/*    init: function() {
        this.inherited(arguments);
        if (this._isDesignLoaded) {
            this.createPageLoader();
        }
    },
    createPageLoader: function() {

        this._pageLoader = new wm.PageLoader({
            owner: this,
            domNode: this.domNode
        });
    },    */
    // ask owner of the underlying property to generate an editor for facade property inName
    makePropEdit: function(inName, inValue, inDefault) {
        var p = this.marshallFacade(inName);
        if (p && p.comp) {
            // FIXME: default has to come from source prototype for inspector to correctly discern type
            // we should be able to discern this from schema
            inDefault = p.comp.constructor.prototype[p.property];
            //console.log(this, ": forwarding makePropEdit for published [", inName, "] to ", p);
            var e = p.comp.makePropEdit(p.property, inValue, inDefault);
/* TODO: PROPINSPECTOR CHANGE: Need to fix this
            if (dojo.isString(e))
                return e.replace('name="' + p.property + '"', 'name="' + inName + '"');
            else if (e) {
                e.name = inName;
                    e.component = this;
                return e;
            }
            */
        }
        return this.inherited(arguments);
    },
    // ask owner of the underlying property to handle an edit-click request for facade property inName
    editProp: function(inName, inValue, inInspector) {
        var p = this.marshallFacade(inName);
        if (p && p.comp) {
            //console.log(this, ": forwarding editProp for published [", inName, "] to ", p);
            return p.comp.editProp(p.property, inValue, inInspector);
        }
        return this.inherited(arguments);
    },
    writeComponents: function(inIndent, inOptions) {
        var
            s = [],
            c = this.components.binding.write(inIndent);
        if (c)
            s.push(c);
        return s;
    },
    _afterPaletteDrop: function(inPackagePath) {
        var onDone = dojo.hitch(this, "afterPaletteDrop");

		var path = inPackagePath.split(/\./);
		if (path[0] == "common" && path[1] == "packages") {
			path.shift();
			path.shift();
		}
		if (path.length > 1 && path[path.length-1] === path[path.length-2]) {
			path.pop();
		}


        studio.deploymentService.requestAsync("copyComponentServices", [path.join("/")], dojo.hitch(this, function(inResponse) {
			var response = dojo.fromJson(inResponse);
			var userMessage = "";
			if (response.servicesAdded.length) {
				userMessage += "The following services were added to your project <ul>";
				dojo.forEach(response.servicesAdded, function(serviceName) {
					userMessage += "<li>"+serviceName + "</li>";
				});
				userMessage += "</ul>";
			}
			if (response.servicesSkipped.length) {
				userMessage += "The following services were NOT added to your project because they already exist<ul>";
				dojo.forEach(response.servicesSkipped, function(serviceName) {
					userMessage += "<li>"+serviceName + "</li>";
				});
				userMessage += "</ul>";
			}

			if (response.servicesAdded.length/* || response.servicesSkipped.length*/) {
				var d = studio.deploy("Compiling new services", "studioProjectCompile");
				d.addCallback(function() {
					studio.updateFullServiceList();
					app.alert(userMessage);
                    onDone();
				});
			} else {
			     wm.fire(this,"reflowParent");
                 onDone();
			}
		}));

    }
});

dojo.declare("wm.Composite", [wm.Container, wm.CompositeMixin], {
    scrim: true, // prevent the user from interacting with the contents of the composite in designer
    lock: true // prevent user from adding additional controls
});

wm.Object.extendSchema(wm.Composite, {
    box: {ignore: 1},
    boxPosition: {ignore: 1},
    freeze: { ignore: 1 },
    lock: { ignore: 1 }, // prevent user from unlocking in studio

     // properties written into user's page which isn't desired for composite's property panel
    preferredDevice: {ignore:1},
    i18n: {ignore:1}
});
