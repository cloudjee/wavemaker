/*
 * Copyright (C) 2008-2013 VMware, Inc. All rights reserved.
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
 
dojo.provide("wm.studio.app.util");

//===========================================================================
// Utility functions to iterate through widgets and components and produce lists
//===========================================================================

// produce a name ordered list of widgets of a given class,
// don't include widgets that are owned by Composite
wm.listOfWidgetType = function(inType, inIgnoreBuiltin, ignoreDialogs) {
    var list = [];
    if (ignoreDialogs) {
    var owners = [studio.page];
    } else {
    var owners = wm.listComponents([studio.application, studio.page], wm.Dialog, false);
    owners.push(studio.page);
    }
    for (var i = 0; i < owners.length; i++) {
    var root = owners[i] instanceof wm.Page ? owners[i].root : owners[i];
    if (root) {
        wm.forEachWidget(root, function(w) {
            if (wm.isInstanceType(w, inType) && !(wm.isInstanceType(w.owner, wm.Composite))) {
            list.push(w);
            }
        }, inIgnoreBuiltin);
        list.sort(function(a, b) {
            return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
        });
    }
    }

    return list;
}

// produce a name ordered list of widgets of a given set of classes
wm.listOfWidgetTypes = function(inTypes) {
/*
    var list = [];
    dojo.forEach(inTypes, function(t) {
        list = list.concat(wm.listOfWidgetType(t));
    });
    */
    var list = wm.listOfWidgetType(inTypes); // change made possible by adding support in isInstanceType for a class or array of classes
    return list;
};

// list components (not widgets) within owners by types
wm.listMatchingComponents = function(inOwners, inMatch, inRecurse,inNoPageContainerRecurse) {
    var l=[];
    if (inMatch)
        dojo.forEach(inOwners, function(o) {
            if (!o)
                return;
            wm.forEachProperty(o.components, function(c) {
                if (inMatch(c))
                    l.push(c);
                    if (inRecurse && (inRecurse == "nonvisual" && c instanceof wm.Control === false ||  inRecurse != "nonvisual" || c instanceof wm.PageContainer) && (!inNoPageContainerRecurse || c instanceof wm.PageContainer == false)) {
                        l = l.concat(wm.listMatchingComponents([c], inMatch, inRecurse, inNoPageContainerRecurse));
                    }
            });
        });
    return l;
}

wm.listMatchingComponentIds = function(inOwners, inMatch, inRecurse, inNoPageContainerRecurse) {
    var d = [], l = wm.listMatchingComponents.call(dojo.global, inOwners, inMatch, inRecurse,inNoPageContainerRecurse);
    dojo.forEach(l, function(c) {
        d.push(c.getId());
    });
    d.sort();
    return d;
}

// Actually returns the page in the page container, not the pagecontainer itself
wm.listAllPageContainers = function(inOwners) {
    var pagecontainers = wm.listComponents(inOwners, wm.PageContainer, false);
    var pages = [];
    for (var i = 0; i < pagecontainers.length; i++)  {
    if (pagecontainers[i].page)
        pages.push(pagecontainers[i].page);
    }

    var pagedialogs = wm.listComponents(inOwners, wm.PageDialog, false);
    for (var i = 0; i < pagedialogs.length; i++) {
    if (pagedialogs[i].page)
        pages.push(pagedialogs[i].page);
    }

    if (pages.length) {
    var subpages = wm.listAllPageContainers(pages);
    return pages.concat(subpages);
    } else {
    return [];
    }
}

// produce list of components (not widgets) of a given class name within a set of owners
// if inStrict is true, only classes with declaredClass == inClass.declaredClass are returned
wm.listComponents = function(inOwners, inClass, inStrict) {
    isRequestedType = function(inComp) {
        if (inComp) {
            if (inStrict)
                return (inClass.prototype.declaredClass == inComp.declaredClass);
            else
                return wm.isInstanceType(inComp, inClass);
        }
    };
    return wm.listMatchingComponents(inOwners, isRequestedType);
}

// produce list of component *ids* (not widgets) of a given class within a set of owners
wm.listComponentIds = function(inOwners, inClass, inStrict) {
    var d = [], l = wm.listComponents.call(dojo.global, inOwners, inClass, inStrict);
    dojo.forEach(l, function(c) {
        d.push(c.getId());
    });
    d.sort();
    return d;
}

// open a url and present user with a dialog if popups are blocked.
wm.openUrl = function(inUrl, inTitle, inWindowName, inWindowOptions) {
    var w = window.open(inUrl, inWindowName, inWindowOptions);
    if (dojo.isChrome) {
        wm.job(inWindowName, 200, function() {
            if (w.closed) wm.openUrlDialog(inUrl,inTitle,inWindowName+1);
            if (w.document && w.document.body && w.outerWidth == 0) {
                wm.openUrlDialog(inUrl,inTitle,inWindowName+1);
            }
        });
    } else if (!w) {
        wm.openUrlDialog(inUrl,inTitle,inWindowName);
    }
    return w;
}
wm.openUrlDialog = function(inUrl, inTitle, inWindowName) {
    var d = wm.openUrl.dialog;
    if (!d) {
    d = wm.openUrl.dialog = new wm.Dialog({_classes: {domNode: ["studiodialog"]},
                           title: studio.getDictionaryItem("POPUP_BLOCKER_TITLE"),
                           owner: studio, 
                           width: 320, 
                           height: 110,
                           modal: false,
                           useContainerWidget: true});
    var container = d.containerWidget;
    new wm.Label({parent: container,
              width: "100%",
              height: "100%",
              owner: d,
              caption: studio.getDictionaryItem("POPUP_BLOCKER_MESSAGE"), 
              singleLine: false,
              align: "center"});
    new wm.Label({
        parent: container,
        owner: d,
        caption: studio.getDictionaryItem("POPUP_BLOCKER_LAUNCH_CAPTION"),
        width: "100%",
        align: "center"
    });
    }
    var link = d.containerWidget.c$[1];
    link.setLink(inUrl);
    dojo.query("a", link.domNode)[0].target = (inWindowName || "_blank");
    d.show();
}

wm.makeLoginHtml =  function(fileTemplate, inProjectName) {
    var macros = ['PROJECT'], data=[inProjectName], t = fileTemplate;
    // change template to index
    for (var i=0, m, d; (m=macros[i]); i++){
    d=data[i] || "";
    t = t.replace(new RegExp(['{%', m, '}'].join(''), 'g'), d);
        t = t.replace(/\wavemakerNode\"\}/, "wavemakerNode\", theme:\"" + studio.application.theme + "\", name:\"" + studio.project.projectName + "\"}");
    }
    return t;
}

wm.getEditorType = function(inPrimitive) {
	var t = wm.typeManager.getPrimitiveType(inPrimitive) || inPrimitive;
	var map = {
		Boolean: "CheckBox"
	};
	if (t in map)
		t = map[t];
	return dojo.indexOf(wm.editors, t) != -1 ? t : "Text";
};

// convert "foo.bar.spaz" of class wm.Editor to "fooBarSpazEditor1"
wm.makeNameForProp = function(inProp, inSuffix) {
	return inProp.replace(/\.(\S)/g, function(w) {return w.slice(1).toUpperCase();} ) + (inSuffix || "")+ "1";
}


wm.getEditorClassName = function(type){
    switch(type.toLowerCase()) {
    case "checkbox":
    case "java.lang.boolean":
	type = "Checkbox";
	break;
    case "select":
	type = "SelectMenu";
	break;
    case "date":
    case "time":
    case "java.util.date":
	type = "DateTime";
	break;
    case "int":
    case "java.lang.integer":
    case "java.lang.short":
    case "java.lang.long":
    case "java.lang.float":
    case "java.lang.double":
	type = "Number";
	break;
    }
    if (dojo.indexOf(wm.editors, type) == -1)
	type = 'Text';
    return 'wm.'+type;
}
    
    