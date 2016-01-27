;(function() {
	'use strict';

	angular
		.module('bp.map.controller', ['commons.services.gps.channel','commons.services.gps.factory', 'leaflet-directive'])
		.controller('MapController', MapController);

	MapController.$inject= ['$scope','GpsServiceChannel','GpsService','leafletData'];

	function MapController($scope,    GpsServiceChannel,  GpsService, leafletData) {

  var i = 0;

		// jshint validthis: true
		var vm = this;


    vm.layers =  {
      baselayers: {
        googleTerrain: {
          name: 'Google Terrain',
            layerType: 'TERRAIN',
            type: 'google'
        },
        googleHybrid: {
          name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
        }
      }
    };

    vm.center = {
      lat: 0,
      lng: 0,
      zoom: 12
    };

    vm.paths = {
      actualPath: {
        color: '#008000',
        weight: 2,
        latlngs: []
      }
    };

    vm.markers = {
      actualPoint: {
        lat: 0,
        lng: 0,
        focus: true,
        draggable: false
      }
    };
    vm.defaults = {
      scrollWheelZoom: false
    };


    init();
		///////////////

    function init(){
        GpsServiceChannel.subPositionUpdated($scope,updateMap);

        leafletData.getMap().then(function(map) {
          setTimeout(function(){
            map.invalidateSize();
          }, 200);
        });
    }

    function updateMap(position) {
      if(angular.isObject(position) && ('coords' in position) ){
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        // update center
        vm.center.lat = lat;
        vm.center.lng = lng;

        //update point
        vm.markers.actualPoint.lat = lat;
        vm.markers.actualPoint.lng = lng;

        vm.markers[i] = {};
        vm.markers[i].lat = lat;
        vm.markers[i].lng = lng;
        i++;

        //update path
        vm.paths.actualPath.latlngs.push({lat:lat, lng: lng});

        leafletData.getMap().then(function(map) {
          setTimeout(function(){
            map.invalidateSize();
          }, 200);
        });
      }
    }

	};



})();
