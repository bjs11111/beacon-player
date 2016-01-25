;(function() {
	'use strict';

	angular
		.module('bp.map.controller', ['commons.services.gps.channel','commons.services.gps.factory', 'leaflet-directive'])
		.controller('MapController', MapController);

	MapController.$inject= ['$scope','GpsServiceChannel','GpsService','leafletData'];

	function MapController($scope,    GpsServiceChannel,  GpsService, leafletData) {

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
        // update center
        vm.center.lat = position.coords.latitude;
        vm.center.lng = position.coords.longitude;
        //update point
        vm.markers.actualPoint.lat = position.coords.latitude;
        vm.markers.actualPoint.lng = position.coords.longitude;
        //update path
        vm.paths.actualPath.latlngs.push({lat: position.coords.latitude, lng: position.coords.longitude});

        leafletData.getMap().then(function(map) {
          setTimeout(function(){
            map.invalidateSize();
          }, 200);
        });
      }
    }

	};



})();
