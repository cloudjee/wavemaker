/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
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
			if (w instanceof inType && !(w.owner instanceof wm.Composite))
				list.push(w);
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
	var list = [];
	dojo.forEach(inTypes, function(t) {
		list = list.concat(wm.listOfWidgetType(t));
	});
	return list;
};

// list components (not widgets) within owners by types
wm.listMatchingComponents = function(inOwners, inMatch, inRecurse) {
	var l=[];
	if (inMatch)
		dojo.forEach(inOwners, function(o) {
			if (!o)
				return;
			wm.forEachProperty(o.components, function(c) {
				if (inMatch(c))
					l.push(c);
				if (inRecurse)
					l = l.concat(wm.listMatchingComponents([o], inMatch, inRecurse));
			});
		});
	return l;
}

wm.listMatchingComponentIds = function(inOwners, inMatch, inRecurse) {
	var d = [], l = wm.listMatchingComponents.call(dojo.global, inOwners, inMatch, inRecurse);
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
				return inComp instanceof inClass;
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
wm.openUrl = function(inUrl, inTitle, inWindowName) {
	var w = window.open(inUrl, inWindowName);
        if (dojo.isChrome) {
	    wm.job(inWindowName, 3000, function() {
		if (w.closed) return;
		if (w.document.body && w.outerWidth == 0)
		    wm.openUrlDialog(inUrl,inTitle,inWindowName+1);
	    });
	} else if (!w) {
	    wm.openUrlDialog(inUrl,inTitle,inWindowName);
	}
}
wm.openUrlDialog = function(inUrl, inTitle, inWindowName) {
    var d = wm.openUrl.dialog;
    if (!d)
	d = wm.openUrl.dialog = new wm.Dialog({owner: studio, width: 320, height: 95});
    var
    target = ' target="' + (inWindowName || "_blank") + '"',
    link = ['<a href="', inUrl , ,'"', target, 
	    'style="color:#FFF" onclick="javascript:wm.openUrl.dialog.dismiss();">',
	    studio.getDictionaryItem("POPUP_BLOCKER_MESSAGE"), 
	    ' ', inTitle || inUrl, '</a>'].join('');
    d.containerNode.innerHTML = [
	'<table class="wmWaitDialog" width="100%" height="100%" style="border: 1px solid #363b44;">',
	'<tr><td align="center" valign="middle">',
	link,
	'</td></tr></table>'
    ].join('');
    d.show();
}

wm.makeLoginHtml =  function(fileTemplate, inProjectName, themeName) {
    var macros = ['PROJECT'], data=[inProjectName], t = fileTemplate;
    // change template to index
    for (var i=0, m, d; (m=macros[i]); i++){
	d=data[i] || "";
	t = t.replace(new RegExp(['{%', m, '}'].join(''), 'g'), d);
        t = t.replace(/\wavemakerNode\"\}/, "wavemakerNode\", theme:\"" + themeName + "\", name:\"" + studio.project.projectName + "\"}");
    }
    return t;
}