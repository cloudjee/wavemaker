/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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
		var p = studio.project;
		this.publishName = this.publishName || p.projectName + p.pageName;
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
		studio.undeployComponent(this.publishName, this.namespace, this.displayName || this.publishName, this.group, this.removeSource);
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
	publishName: {group: "Events", order: 10},
	namespace: {group: "Events", order: 20},
	group: {group: "Events", order: 30},
	displayName: {group: "Events", order: 40},
	description: {group: "Events", order: 50},
    width: {group: "layout", order: 20, editor: "wm.prop.SizeEditor"},
	height: {group: "layout", order: 30, editor: "wm.prop.SizeEditor"},
    deploy: {group: "operation", order: 10, operation: "doDeploy"},
    undeploy: {group: "operation", order: 20, operation: true},
	owner: {ignore: 1}
});


dojo.declare("wm.CompositePublisher", wm.ComponentPublisher, {
	getComponentJson: function() {
		if (!this.publishName || !studio.page)
			return;
		//
		var klass = this.namespace ? this.namespace + '.' + this.publishName : this.publishName;
		var pageComponents = studio.page.writeComponents(sourcer_tab);
		var root = studio.page.root;
		var rootWidgets = root.writeComponents(sourcer_tab);
		var components = pageComponents.concat(rootWidgets).join(",\n");
		
		
		var widgets = klass + ".components = {" + sourcer_nl + components /*source_body(studio.page)*/ + "}";
		var css = studio.getCss();
		var html = studio.getMarkup();
		//
		var resource = 'common.packages.' + klass;
		var group = this.group || "Published";
		var image = "images/wm/widget.png";
		var displayName = this.displayName || this.publishName;
		//
		// FIXME: hackalicious
		var js = studio.getScript();
		js = js.split("\n");
		js.shift();
		// stream box properties specially
		var rootProps = ["layoutKind", "verticalAlign", "horizontalAlign"];
		dojo.forEach(rootProps, function(p) {
			if (root[p])
				js.unshift("  " + p + ": \"" + root[p] + "\",");
		});
		//
		js.unshift('dojo.declare("' + klass + '", wm.Composite, {');
		js = js.join("\n");
		//
		var reg = 'wm.registerPackage(["' +
			group + '", ' +
			'"' + displayName + '", ' +
			'"' + klass + '", ' +
			'"' + resource + '", ' +
			'"' + image + '", ' +
			'"' + this.description + '", ' +
			'{width: "' + this.width + '", height: "' + this.height + '"},' + 
		        "false" + 
		']);';
		//
		var c, props = [];
		for (var n in studio.page.$) {
			c = studio.page.$[n];
			if (c instanceof wm.Property) {
				props.push(c.publish());
			}
		}
		props = props.length ? 'wm.publish(' + klass + ', [\n\t' + props.join(',\n\t') + '\n]);\n \n' : "";
		//
		return [
			'dojo.provide("' + resource + '");', '\n \n',
			js, '\n \n',
			widgets, '\n \n',
			props,
//		    css ? klass + '.css = "' + escape(css) + '";' + '\n \n' : '',
//		    html ? klass + '.html = "' + escape(html) + '";' + '\n \n' : '',
			reg
		].join('');
	}
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

/*
wm.registerPackage(["Components", "Template Publisher", "wm.TemplatePublisher", "wm.base.components.Publisher", "images/flash.png"]);
*/