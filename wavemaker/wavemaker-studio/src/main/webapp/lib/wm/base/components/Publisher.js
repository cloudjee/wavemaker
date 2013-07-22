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

dojo.provide("wm.base.components.Publisher");

dojo.declare("wm.ComponentPublisher", wm.Component, {
    namespace: "test",
    publishName: "",
    displayName: "",
    description: "",
    width: "250px",
    height: "150px",
    removeSource: true,
    deploy: "(deploy)",
    undeploy: "(undeploy)",
    group: "Published",
    init: function() {
        this.inherited(arguments);
        if (window["studio"]) {
            var p = studio.project;
            this.publishName = this.publishName || p.projectName + p.pageName;
        }
    },
    __isWriteableComponent: function(inName, inProperties) {
        return !studio._isPublishComponent;
    },
    deploy: function() {
        wm.Property.deploy = true;
        try {
            var json = this.getComponentJson();
            studio.deployComponent(this.publishName, this.namespace, this.displayName || this.publishName, this.group, json);
        } finally {
            wm.Property.deploy = false;
        }
    },
    undeploy: function() {
        studio.undeployComponent(this.publishName, this.namespace , this.displayName || this.publishName, this.group, this.removeSource);
    },
    getComponentJson: function() {

    },
    setPublishName: function(inValue){
        this.publishName = wm.getValidJsName(inValue);
    },
    setDisplayName: function(inValue){
        this.displayName = wm.getValidJsName(inValue);
    },
    write: function() {
        return wm.Property.deploy ? "" : this.inherited(arguments);
    },

    doDeploy: function() {
        var self = this;
        studio.project.saveProject(false, function() {
            self.deploy();
        });
    }
});

wm.Object.extendSchema(wm.ComponentPublisher, {
    removeSource: {ignore: 1},
    publishName: {group: "widgetName", order: 10},
    namespace: {group: "widgetName", order: 20},
    group: {group: "widgetName", order: 30},
    displayName: {group: "widgetName", order: 40},
    description: {group: "widgetName", order: 50},
    width: {group: "display", subgroup: "layout", order: 20, editor: "wm.prop.SizeEditor"},
    height: {group: "display", subgroup: "layout", order: 30, editor: "wm.prop.SizeEditor"},
    deploy: {group: "widgetName", order: 100, shortname: "Publish to Palette", operation: "doDeploy"},
    undeploy: {group: "widgetName", order: 110, shortname: "Remove from Palette", operation: true},
    owner: {ignore: 1}
});


dojo.declare("wm.CompositePublisher", wm.ComponentPublisher, {
    parentClass: "wm.Composite",
    undeploy: function() {
        studio.undeployComponent(this.publishName, this.namespace, this.displayName || this.publishName, this.group, this.removeSource);
    },
    _deploy: function(services, components) {
        this.serviceList = dojo.clone(services);
        this.componentList = dojo.map(components, function(c) {return c.name;});

        wm.Property.deploy = true;
        try {
            // save the composite and publisher's current state
            studio.project.savePage(dojo.hitch(this, function() {
                var json = this.getComponentJson(components);
                studio.deployComponent( this.publishName,
                                        this.namespace + "." + this.publishName,
                                        this.displayName || this.publishName,
                                        this.group,
                                        json,
                                        services,
                                        this._wmPictureSource,
                                        this._wmHtmlSource);
            }));
        } finally {
            wm.Property.deploy = false;
        }
    },
    deploy: function() {
        var d = studio.publishComponentDialog;
        var dataSet = studio.publishComponentDialogDataSet;
        if (!d) {
            dataSet = studio.publishComponentDialogDataSet = new wm.Variable({
                name: "publishComponentDialogDataSet",
                type: "EntryData",
                isList: true,
                owner: studio
            });
            d = studio.publishComponentDialog = new wm.Dialog({
                _classes: {domNode: ["studiodialog"]},
                owner: studio,
                width: "300px",
                height: "400px",
                title: "Deploy Component",
                modal: true,
                useContainerWidget: true,
                useButtonBar: true});
                d.containerWidget.setPadding("0");
                d.innerContainerWidget = new wm.studio.DialogMainPanel({owner: d, parent: d.containerWidget});

                new wm.Label({_classes: {domNode: ["StudioLabel"]},
                              owner: d,
                              parent: d.innerContainerWidget,
                              width: "100%",
                              caption: "Pick app-level components and services to include in Composite",
                              singleLine: false,
                              height: "38px"
                              });

                d.checkboxSet = new wm.CheckboxSet({owner: d,
                                                    parent: d.innerContainerWidget,
                                                    editorBorder:0,
                                                    width: "100%",
                                                    height: "100%",
                                                    dataField: "name",
                                                    displayExpression: "${dataValue}.replace(/^.*\\./,'') + ': ' + ${name}"});



            d.cancelButton = new wm.Button({
                                        _classes: {domNode: ["StudioButton"]},
                                        owner: d,
                                        parent: d.buttonBar,
                                        caption: "Cancel",
                                        onclick: function() {d.hide();}
                                        });
            d.okButton = new wm.Button({
                                        _classes: {domNode: ["StudioButton"]},
                                        owner: d,
                                        parent: d.buttonBar,
                                        caption: "OK"
                                        });



        }
        var data = [];
        var skipServices = ["resourceFileService", "securityService"]
        wm.services.forEach(function(s) {
            if (!s.isClientService && !s.clientHide && dojo.indexOf(skipServices,s.name) == -1) {
                data.push({dataValue: s.type, name: s.name});
            }
        });

        wm.forEachProperty(studio.application.components, function(inValue, inName) {
            if (inName && wm.isInstanceType(inValue, [wm.XhrDefinition, wm.TypeDefinition, wm.Dialog])) {
                data.push({dataValue: inValue.publishClass, name: inName});
            }
        });

        if (data.length) {
            dataSet.setData(data);
            d.checkboxSet.setDataSet(dataSet);
            d.checkboxSet.setDataValue((this.componentList || []).concat(this.serviceList || []));
            d.okButton.onclick = dojo.hitch(this, function() {
                var values = d.checkboxSet.getDataValue();
                var serverComponents = [];
                var clientComponents = [];
                for (var i = 0; i < values.length; i++) {
                    if (wm.services.byName[values[i]]) {
                        serverComponents.push(values[i]);
                    } else {
                        clientComponents.push(studio.application.components[values[i]]);
                    }
                }
                this._deploy(serverComponents,clientComponents);
                d.hide();
            });
            d.show();
        } else {
            this._deploy([],[]);
        }
    },
    getComponentJson: function(applevelComponents) {
        if(!this.publishName || !studio.page) return;
        //
        var klass = this.namespace ? this.namespace + '.' + this.publishName : this.publishName;
        this.adjustAllPictures();
        this.adjustAllHtmlWidgets();
        studio._isPublishComponent = true;

        var componentArray = [];
        dojo.forEach(applevelComponents, function(c) {
            componentArray.push(c.write("\t"));
        });

        var pageComponents = studio.page.writeComponents(sourcer_tab);
        componentArray = componentArray.concat(pageComponents);

        var root = studio.page.root;
        var rootWidgets = root.writeComponents(sourcer_tab);
        studio._isPublishComponent = false;
        this.restoreAllPictures();
        this.restoreAllHtmlWidgets();

        var components = componentArray.concat(rootWidgets).join(",\n");


        var widgets = klass + ".components = {" + sourcer_nl + components /*source_body(studio.page)*/
        + "\n}";
        var css = studio.getCss() + "\n//app.css\n" + studio.getAppCss();
        var html = studio.getMarkup();
        //
        var resource = 'common.packages.' + klass + "." + klass.replace(/^.*\./, "");
        var group = this.group || "Published";
        var image = group == "Services" || group == "Non-Visual Components" ? "Studio_paletteImageList_43" : "images/wm/widget.png";
        var displayName = this.displayName || this.publishName;
        //
        // FIXME: hackalicious
        var js = studio.getScript();
        js = js.split("\n");
        //js.shift();
        var header = [];
        while(js[0].indexOf('dojo.declare("' + studio.project.pageName + '"') == -1 && js[0].indexOf("dojo.declare('" + studio.project.pageName + "'") == -1) {
            header.push(js.shift());
        }
        js.shift(); // get rid of dojo.declare("Main", wm.Page, {
        /* Enables pictures to get images from the Composite's folder */
        js.unshift("  getPath: function() {return dojo.moduleUrl('common.packages." + klass + "').uri;},");

        /* Enables the CSS designed for widgets in this page to affect the the widgets in the composite as well */
        js.unshift("  _appendCssClassName: '" + studio.project.pageName + "',");

        if(this.parentClass && dojo.getObject(this.parentClass) && dojo.getObject(this.parentClass).prototype instanceof wm.Control) {
            var rootProps = studio.page.root.writeProps();
            rootProps.width = this.width;
            rootProps.height = this.height;
            wm.forEachProperty(rootProps, function(inValue, inName) {
                if(typeof inValue == "string") {
                    inValue = "\"" + inValue + "\"";
                } else if(inValue instanceof Date) {
                    inValue = inValue.getTime();
                } else if(typeof inValue == "object" && inValue instanceof wm.Component == false) {
                    inValue = dojo.toJson(inValue, true);
                }
                js.unshift("  " + inName + ": " + inValue + ",");
            });
        }
        /*
    // stream box properties specially
    var rootProps = ["layoutKind", "verticalAlign", "horizontalAlign"];
    dojo.forEach(rootProps, function(p) {
        if (root[p])
        js.unshift("  " + p + ": \"" + root[p] + "\",");
    });
*/
        if(this.parentClass == "wm.Composite") {
            js.unshift('dojo.declare("' + klass + '", wm.Composite, {');
        } else {
            js.unshift('dojo.declare("' + klass + '", [' + this.parentClass + ',wm.CompositeMixin], {');
        }
        js = header.join("\n") + "\n" + js.join("\n");



        //
        var reg = 'wm.registerPackage(["' + group + '", ' + '"' + displayName + '", ' + '"' + klass + '", ' + '"' + resource + '", ' + '"' + image + '", ' + '"' + this.description + '", ' + '{},' + "false," + (this.index === null ? "undefined" : this.index) + ']);';
        //
        var c, props = [];
        for(var n in studio.page.$) {
            c = studio.page.$[n];
            if(c instanceof wm.Property) {
                props.push(c.publish());
            }
        }
        props = props.length ? 'wm.publish(' + klass + ', [\n\t' + props.join(',\n\t') + '\n]);\n \n' : "";


        var css = dojo.trim(studio.getCss()) + "\n\n" + dojo.trim(studio.getAppCss());
        var jscss = klass + ".prototype._cssText = '";
        var cssArray = [];
        dojo.forEach(css.split(/\n/), function(line) {
            if(line.match(/\S/)) cssArray.push(line.replace(/^\s*/g, "").replace(/\'/g, "\"").replace(/\s+$/g, "") + " \\\n");
        });
        jscss += cssArray.join("") + "';\n\n";


        //
        return ['dojo.provide("' + resource + '");', '\n \n', js, '\n \n', widgets, '\n \n', props, jscss,
        //    css ? klass + '.css = "' + escape(css) + '";' + '\n \n' : '',
        //    html ? klass + '.html = "' + escape(html) + '";' + '\n \n' : '',
        reg].join('');
    },
    adjustAllPictures: function() {
        var comps = wm.listComponents([studio.page], wm.Picture, true);
        var sourcelist = this._wmPictureSource = [];
        dojo.forEach(comps, function(w,i) {
            if (!w.$.binding || !w.$.binding.wires.source) {
                if (w.source && w.source.indexOf("resources/") == 0) {
                    sourcelist[i] = w.source;
                    w.source = "images/" + w.source.replace(/^.*\//,"");
                }
            }
        });
    },
    restoreAllPictures: function() {
        var comps = wm.listComponents([studio.page], wm.Picture, true);
        var sourcelist = this._wmPictureSource;
        dojo.forEach(comps, function(w,i) {
            if (sourcelist[i]) {
                w.source = sourcelist[i];
                sourcelist[i] = unescape(sourcelist[i]);
            }
        });
    },
    adjustAllHtmlWidgets: function() {
        var comps = wm.listComponents([studio.page], wm.Html, true);
        var sourcelist = this._wmHtmlSource = [];
        dojo.forEach(comps, function(w,i) {
            if (!w.$.binding || !w.$.binding.wires.html) {
                if (w.html && w.html.match(/^resources\//)) {
                    sourcelist[i] = w.html;
                    w.html= "html/" + w.html.replace(/^.*\//,"");
                    w.htmlIsResource = true;
                }
            }
        });

    },
    restoreAllHtmlWidgets: function() {
        var comps = wm.listComponents([studio.page], wm.Html, true);
        var sourcelist = this._wmHtmlSource;
        dojo.forEach(comps, function(w,i) {
            if (sourcelist[i]) {
                w.html= sourcelist[i];
                delete w.htmlIsResource;
                sourcelist[i] = unescape(sourcelist[i]);
            }
        });
    },
    download: function() {
        studio.downloadInIFrame("services/deploymentService.download?method=downloadClientComponent&file=" + (this.namespace ? this.namespace.replace(/\./g,"/") + "/" : "") + this.publishName);
    }
});


wm.Object.extendSchema(wm.CompositePublisher, {
    download: {operation:1, group: "widgetName", order: 150},
    index: {group: "widgetName", type: "Number", order:80},
    parentClass: {group: "widgetName", type: "String", order:81},
    serviceList: {writeonly:1},
    componentList: {writeonly:1}
});
/*
wm.registerPackage([bundlePackage.Non_Visual_Components, bundlePackage.Composite_Publisher, "wm.CompositePublisher", "wm.base.components.Publisher", "images/flash.png"]);
*/

dojo.declare("wm.TemplatePublisher", wm.ComponentPublisher, {
        isFullPageTemplate: false,
    width: "100%",
    height: "100%",
    getComponentJson: function() {
        if (!this.publishName || !studio.page)
            return;
        //
        //var template = this.publishName + "_template";
            var template = ((!this.isFullPageTemplate) ? "wm.widgetTemplates." : "wm.fullTemplates.") + this.publishName;
        var root = studio.page.root;
        var widgets = template + " = {\n" +
            '\ttemplateGroup: "Custom",\n' +
            '\tlayoutKind: "' + root.layoutKind + '",\n' +
            '\twidth: "' + this.width + '",\n' +
            '\theight: "' + this.height + '",\n' +
            '\tverticalAlign: "' + root.verticalAlign + '",\n' +
            '\thorizontalAlign: "' + root.horizontalAlign + '",\n' +
            '\t_template: {\n' +
                root.writeComponents("\t").join(",\n") +
            "}};";
        //
        var resource = 'common.packages.' + (this.namespace ? this.namespace + '.' + this.publishName : this.publishName);
        var group = this.group || "Published";
        var image = "images/wm/template.png";
        var displayName = this.displayName || this.publishName;
        //
        var reg = 'wm.registerPackage(["' +
            group + '", ' +
            '"' + displayName + '", ' +
            '"wm.Template",' +
            '"' + resource + '", ' +
            '"' + image + '", ' +
            '"' + this.description + '", ' +
            template +
        ']);';
        //
        var r = [
            'dojo.provide("' + resource + '");', '\n \n',
                    (this.isFullPageTemplate) ? "if (!wm.fullTemplates) wm.fullTemplates = {};\n" : "if (!wm.widgetTemplates) wm.widgetTemplates = {};\n",
            widgets, '\n \n',
            reg
        ].join('');
        console.log(r);
        return r
    }
});

wm.Object.extendSchema(wm.TemplatePublisher, {
    isFullPageTemplate: {group: "widgetName", order: 50}
});


/*
wm.registerPackage(["Components", "Template Publisher", "wm.TemplatePublisher", "wm.base.components.Publisher", "images/flash.png"]);
*/