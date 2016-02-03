;(function() {
	'use strict';

	angular
		.module('bp.map2.controller', ['commons.services.gps.channel','commons.services.gps.factory', 'ngMap'])
		.controller('Map2Controller', Map2Controller);

	Map2Controller.$inject= ['$scope','GpsServiceChannel','GpsService','NgMap'];

	function Map2Controller($scope,    GpsServiceChannel,  GpsService, NgMap) {

    //0 is actual position
  var i = 1;

		// jshint validthis: true
		var vm = this;
    vm.paths = {};
    vm.paths.actualPath = [];

    vm.center = [40.74, -74.18];

    vm.markers =[
      {pos:[40.11, -75.21],name:'actualPosition'}
    ];

    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    vm.currentIndex = 0;

    init();
		///////////////

    function init(){
      GpsServiceChannel.subPositionUpdated($scope,updateMap);

      NgMap.getMap({id:'gmap'}).then(function(map) {
        vm.gmap = map;
        map.setZoom(4);
      });
    }

    function updateMap(position) {
      if(angular.isObject(position) && ('coords' in position) ){
        var lat = position.coords.latitude,
            lng = position.coords.longitude;

        // update center
        vm.center[0] = lat;
        vm.center[1] = lng;

        //update actual position marker
        vm.markers[0].pos[0] = lat;
        vm.markers[0].pos[1] = lng;

        //update path markers
        vm.markers[i] = {pos:[]};
        vm.markers[i].pos[0] = lat;
        vm.markers[i].pos[1] = lng;
        i++;

        //update path
        vm.paths.actualPath.push([lat,lng]);
      }
    }

	};



})();
