/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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

/* TODO: 
 *  1. FusionTables integration
 *  2. Geocoding? Maybe a bad idea, but hard to use without it.  Would be nice to have fields for specifying addresses and then do the lookup at runtime
 *  3. Directions link added to POI popups
 *  4. Field for specifying markers
 */
dojo.provide("wm.base.widget.gadget.GoogleMap");

dojo.declare("wm.gadget.GoogleMap", wm.Control, {
    scrim: true,
    width: "100%",
    height: "100%",
    minHeight: "100",
    latitude: 37.789607,
    longitude: -122.39984,

    
    zoom: 17,
    mapType: "ROADMAP", // ROADMAP, SATELLITE, HYBRID, TERRAIN
    dataSet: "",
    latitudeField: "",
    longitudeField: "",
    titleField: "",
    descriptionField: "",
    iconField: "",
    _map: "",
    _markers: "",
    _infoWindow: "",
    selectedItem: "",
    init: function() {
	if (!dojo.byId("GoogleMapsScript")) {
	    var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.id = "GoogleMapsScript";
	    script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=wm.gadget.GoogleMap.initialize";
	    document.body.appendChild(script);
	}
	this._markers = [];
	this.inherited(arguments);
	this.selectedItem = new wm.Variable({name: "selectedItem", owner: this});
    },
    postInit: function() {
	this.inherited(arguments);
	if (window.google && window.google.maps) {
	    this.initialize();
	} else {
	    wm.gadget.GoogleMap.waitingForInitialize.push(this);
	}
    },
    initialize: function() {
	var myLatlng = new google.maps.LatLng(this.latitude, this.longitude);
	var myOptions = {
	    zoom: this.zoom,
	    center: myLatlng,
	    mapTypeId: google.maps.MapTypeId[this.mapType]
	}
	this._map = new google.maps.Map(this.domNode, myOptions);
	if (this.dataSet && this.dataSet.getCount())
	    this.generateMarkers();

	this._infoWindow = new google.maps.InfoWindow();

    },
/*
    setSizeProp: function() {
	var h = this.bounds.h;
	var w = this.bounds.w;
	this.inherited(arguments);
	if (this._map && h != this.bounds.h || w != this.bounds.w)
	    this._map.resize();
    },
    */
    renderBounds: function() {
	if (this.inherited(arguments) && this._map) {
	    google.maps.event.trigger(this._map, "resize");
	}

    },
    setZoom: function(inZoom) {
	this.zoom = inZoom;
	if (this._map)
	    this._map.setZoom(Number(inZoom));
    },
    setLatitude: function(inVal) {
	this.latitude = inVal;
	if (this._map)
	    this._map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    },
    setLongitude: function(inVal) {
	this.longitude = inVal;
	if (this._map)
	    this._map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    },
    fitToMarkers: function() {
	var minLat = 10000000;
	var minLon = 10000000;
	var maxLat = -1000000;
	var maxLon = -1000000;
	if (!this.dataSet) return;
	var count = this.dataSet.getCount();
	if (count == 0) return;
	for (var i = 0; i < count; i++) {
	    var item = this.dataSet.getItem(i);
	    var lat = item.getValue(this.latitudeField);
	    var lon = item.getValue(this.longitudeField);
	    if (lat < minLat) minLat = lat;
	    if (lat > maxLat) maxLat = lat;
	    if (lon < minLon) minLon = lon;
	    if (lon > maxLon) maxLon = lon;
	}

	var maxPos = new google.maps.LatLng(maxLat, maxLon);
	var minPos = new google.maps.LatLng(minLat, minLon);
	this._map.fitBounds(new google.maps.LatLngBounds(minPos, maxPos));
    },
    setMapType: function(inVal) {
	this.mapType = inVal;
	if (this._map)
	    this._map.setMapTypeId(google.maps.MapTypeId[this.mapType]);
    },
	_addFields: function(inList, inSchema) {
		for (var i in inSchema) {
			var ti = inSchema[i];
			if (!(ti||0).isList && !wm.typeManager.isStructuredType((ti||0).type)) {
				inList.push(i);
			}
		}
	},
	_listFields: function() {
		var list = [ "" ];
		var schema = this.dataSet instanceof wm.LiveVariable ? wm.typeManager.getTypeSchema(this.dataSet.type) : (this.dataSet||0)._dataSchema;
		var schema = (this.dataSet||0)._dataSchema;
		this._addFields(list, schema);
		return list;
	},
	makePropEdit: function(inName, inValue, inDefault) {
		switch (inName) {
		case "mapType":
		    return makeSelectPropEdit(inName, inValue, ["ROADMAP", "SATELLITE", "HYBRID", "TERRAIN"], inDefault);
		case "latitudeField":
		case "longitudeField":
		case "titleField":
		case "descriptionField":
		case "iconField":
		    return makeSelectPropEdit(inName, inValue, this._listFields(), inDefault);
		case "dataSet":
		    return new wm.propEdit.DataSetSelect({component: this, name: inName, value: this.variable ? this.variable.getId() : "", allowAllTypes: true, listMatch: true});
		}
	    return this.inherited(arguments);
	},
	setDataSet: function(inDataSet) {
	    this.dataSet = inDataSet;
	    if (inDataSet)
		this.selectedItem.setType(inDataSet.type);
	    dojo.forEach(this._markers, function(m) {
		m.setMap(null);
	    });
	    this._markers = [];

	    if (this._map && inDataSet) {
		this.generateMarkers();
	    }
	},
	set_dataSet: function(inDataSet) {
		// support setting dataSet via id from designer
		if (inDataSet && !(inDataSet instanceof wm.Variable)) {
			var ds = this.getValueById(inDataSet);
			if (ds)
				this.components.binding.addWire("", "dataSet", ds.getId());
		} else
			this.setDataSet(inDataSet);
	    
	},
    generateMarkers: function() {
        
	    var data = this.dataSet.getData();
	
	    for (var i = 0; i < data.length; i++) {
		this.generateMarker(data[i]);
	    }
    },
    generateMarker: function(d) {
		var lat = d[this.latitudeField];
		var lon = d[this.longitudeField];
		var title = d[this.titleField];
		var desc = d[this.descriptionField];
		var icon = d[this.iconField];
		var marker = new google.maps.Marker({
		    icon: icon,
		    position: new google.maps.LatLng(lat,lon), 
		    map: this._map,
		    title: title});
		this._markers.push(marker);
		google.maps.event.addListener(marker, 'click', 
					      dojo.hitch(this, function() {
						  if (desc) {
						      this._infoWindow.setContent("<h3>" + title + "</h3>" + desc);
						      this._infoWindow.open(this._map,marker);
						  }
						  this.selectedItem.setData(d);
						  this.onMarkerClick(d);
						  this.onMarkerChange(d);
					      }));
    },
    selectMarkerByIndex: function(inIndex) {
	this._clickMarker(this._markers[inIndex], this.dataSet.getItem(inIndex));
    },
    _clickMarker: function(inMarker, inData) {
	var content = "<h3>" + inData.getValue(this.titleField) + "</h3>" + inData.getValue(this.descriptionField);
	this._infoWindow.setContent(content);
	this._infoWindow.open(this._map, inMarker);
	this.onMarkerChange(inData);
    },
    onMarkerClick: function(inData) {
    },
    onMarkerChange: function(inData) {
    },
    listProperties: function() {
	var props = this.inherited(arguments);
	props.selectedItem.type = this.dataSet ? this.dataSet.type : "";
	return props
    },
    _end: 0
});

wm.gadget.GoogleMap.waitingForInitialize = [];
wm.gadget.GoogleMap.initialize = function() {
    dojo.forEach(wm.gadget.GoogleMap.waitingForInitialize, function(w) {w.initialize();});
    wm.gadget.GoogleMap.waitingForInitialize = [];
}



wm.Object.extendSchema(wm.gadget.GoogleMap, {
    dataSet: { readonly: true, group: "data", order: 1, bindTarget: 1, type: "wm.Variable", isList: true},
    selectedItem: { ignore: 1, bindSource: 1, isObject: true, simpleBindProp: true },
    latitudeField: {group: "Marker", order: 1},
    longitudeField: {group: "Marker", order: 2},
    titleField: {group: "Marker", order: 3},
    descriptionField: {group: "Marker", order: 4},
    iconField: {group: "Marker", order: 5},
    latitude: {group: "Map", order: 1, bindTarget: 1},
    longitude: {group: "Map", order: 2, bindTarget: 1},
    zoom: {group: "Map", order: 3, options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]},
    mapType: {group: "Map", order: 4}
});