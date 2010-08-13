/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
dojo.provide("wm.base.components.ServiceQueue");

dojo.declare("wm.ServiceQueue", wm.Component, {
	services: "",
	init: function() {
		this._services = [];
		this._serviceConnections = [];
		this.inherited(arguments);
	},
	getServicesCount: function() {
		return this._services && this._services.length;
	},
	getServicesList: function() {
		for (var i=0, l=[], ss=this.services.split(","), s, v; (s=ss[i]); i++) {
			v = this.getValueById(dojo.string.trim(s));
			if (v)
				l.push(v);
		}
		return l;
	},
	update: function() {
		this.beginUpdate();
	},
	beginUpdate: function() {
		this._services = this.getServicesList();
		this.connectServices();
		this._currentService = 0;
		this.updateNextService();
	},
	getCurrentService: function() {
		return this._services[this._currentService];
	},
	updateNextService: function() {
		if (this._currentService < this.getServicesCount()) {
			var s = this.getCurrentService();
			this._currentService++;
			s.update();
		} else
			this.completeUpdate();
	},
	completeUpdate: function() {
		this.disconnectServices();
	},
	abortUpdate: function() {
		this.disconnectServices();
	},
	connectServices: function() {
		this.disconnectServices();
		dojo.forEach(this._services, dojo.hitch(this, function(s) {
			this._serviceConnections.push(dojo.connect(s, "onResult", this, "updateNextService"));
			this._serviceConnections.push(dojo.connect(s, "onError", this, "abortUpdate"));
		}));
	},
	disconnectServices: function() {
		dojo.forEach(this._serviceConnections, function(s) {
			dojo.disconnect(s);
		});
	}
});

wm.ServiceQueue.extend({
	getAvailableServicesList: function() {
		var d = wm.listComponentIds([studio.application, studio.page], wm.ServiceVariable);
		d = d.concat(wm.listComponentIds([studio.application, studio.page], wm.NavigationCall));
		// don't show this!
		var i = dojo.indexOf(d, this.owner.getId());
		if (i != -1)
			d.splice(i, 1);
		return d;
	},
	write: function(inIndent) {
		return this.services ? this.inherited(arguments): null;
	}
});
