/*
 *  Copyright (C) 2011-2012 VMware, Inc. All rights reserved.
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
 *  - Make the geocode incrementer bindable to a progress bar
 *  - document values for the icon property for each item "orange" and "orange1" or a path to a custom image
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
    addressField: "",
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
	this._dataToGeocode = [];
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
	if (!this._isDesignLoaded) {
	    if (!this.latitudeField) this.latitudeField = "_latitude";
	    if (!this.longitudeField) this.longitudeField = "_longitude";
	}
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

    /* If errors occur (other than QUOTA_LIMIT errors which cause us to retry the address) calls this */
    onGeocodeError: function(inResponse, inData) {},

    geocode: function(inData) {
	this._dataToGeocode.push(inData);
	this.geocodeNext();
    },
    geocodeNext: function() {
	if (this._geocoding) return;
	this._geocoding = true;
	this.onIncrementGeocodeCount(this._dataToGeocode.length, this.dataSet.getCount());
        this._geocode(this._dataToGeocode.shift(), this._dataToGeocode.length ? dojo.hitch(this, "geocodeNext") : dojo.hitch(this, "onGeocodeComplete"));    
    },

    /* This is called before each geocode attempt; lets you update a progress bar; TODO: Make this bindable to a progressbar */
    onIncrementGeocodeCount: function(remainingItems, totalItems) {},

    /* Called after ALL addresses in the dataSet that needed to be geocoded have been geocoded */
    onGeocodeComplete: function() {},
    
    /* Called for each successful geocode of each individual address in the dataset; will be called many times; if updating a wm.Variable with the results,
     * you should precede your updates with this.variable.beginUpdate/endUpdate so that the map isn't repeatedly regenerated/regeocoded
     */
    onGeocodeSuccess: function(inItem) {},

    /* If errors occur (other than QUOTA_LIMIT errors which cause us to retry the address) calls this */
    onGeocodeError: function(inResponse, inData) {},

    _geocode: function(inData, onCompleteFunc) {
        var self = this;
        var icon;
	if (!this.geocoder) {
	    this.geocoder = new google.maps.Geocoder();
	}
        this.geocoder.geocode({
            'address': inData[this.addressField]
        }, function(results, status) {
	    self._geocoding = false;
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
		inData[self.latitudeField] = location.lat();
		inData[self.longitudeField] = location.lng();
		self.generateMarker(inData);
		self.onGeocodeSuccess(inData);
            } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                console.log("GEOCODING: " + status + ". DELAY and then redo " + inData[self.addressField]);
                self._dataToGeocode.push(inData);
                wm.job("geocodeNext", 500, dojo.hitch(self, "geocodeNext"));
                return;
            } else {
                console.error("Failed to geocode " + inData[self.addressField] + "; " + status);
		self.onGeocodeError(status, inData);
            }
            if (onCompleteFunc) {
                onCompleteFunc();
            }
        });
    },
    generateMarkers: function() {
        
	    var data = this.dataSet.getData();
	
	    for (var i = 0; i < data.length; i++) {
		data[i]._index = i+1; // one based indexing for end users
		this.generateMarker(data[i]);
	    }
	if (this._dataToGeocode.length)
	    this.geocodeNext();
    },
    generateMarker: function(d) {
		var lat = d[this.latitudeField];
		var lon = d[this.longitudeField];
	var address = d[this.addressField];
		var title = d[this.titleField];
		var desc = d[this.descriptionField];
		var icon = d[this.iconField];
	if (address && !lat && !lon) {
	    this._dataToGeocode.push(d);
	    return;
	}
	switch(icon) {
	case "green":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/green/blank.png";
	    break;
	case "blue":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png";
	    break;
	case "red":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/red/blank.png";
	    break;
	case "pink":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/pink/blank.png";
	    break;
	case "orange":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/blank.png";
	    break;
	case "green1":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/green/marker" + d._index + ".png";
	    break;
	case "blue1":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/marker" + d._index + ".png";
	    break;
	case "red1":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/red/marker" + d._index + ".png";
	    break;
	case "pink1":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/pink/marker" + d._index + ".png";
	    break;
	case "orange1":
	    icon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/marker" + d._index + ".png";
	    break;
	}

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
	var content = "<h3 class='MapMarkerTitle'>" + inData.getValue(this.titleField) + "</h3><div class='MapMarkerDescription'>" + inData.getValue(this.descriptionField) + "</div>";
	this._infoWindow.setContent(content);
	this._infoWindow.open(this._map, inMarker);
	this.onMarkerChange(inData);
    },
    onMarkerClick: function(inData) {
    },
    onMarkerChange: function(inData) {
    },
    _end: 0
});

wm.gadget.GoogleMap.waitingForInitialize = [];
wm.gadget.GoogleMap.initialize = function() {
    dojo.forEach(wm.gadget.GoogleMap.waitingForInitialize, function(w) {w.initialize();});
    wm.gadget.GoogleMap.waitingForInitialize = [];
}

