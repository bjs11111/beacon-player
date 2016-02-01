(function() {
	'use strict';

	/**
	 * tracking-map Module
	 */
	var trackingMap = angular.module('commons.directives.trackingMap.directive', ['leaflet-directive', 'commons.services.scannLogger.factory', 'commons.services.scannLogger.channel', 'commons.services.gps.factory'])

	.directive('trackingMap', trackingMap);

	/**
	 * Manually identify dependencies for minification-safe code
	 *
	 **/
	trackingMap.$inject = ['$timeout','ScannLogger','ScannLoggerChannel', 'GpsServiceChannel','leafletData'];

	/**
	 *
	 **/
	/** @ngInject */
	function trackingMap(  $timeout,  ScannLogger,  ScannLoggerChannel, GpsService, GpsServiceChannel, leafletData) {

		var buttonIcons = {
				ready : 'ion-play',
				recording : 'ion-stop',
				finished : 'ion-upload'
      },
      watchGeoInterval = undefined;

		 return {
			    restrict: 'E',
			    replace:true,
			    templateUrl: 'app/commons/directives/map/tracking-map.html',
			    controller: ['$scope',
			        function( $scope) {

                var actualState = ScannLogger.getState(),
                    TrackCount  = 0;

                $scope.layers =  {
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

                $scope.center = {
                  lat: 0,
                  lng: 0,
                  zoom: 12
                };

                $scope.paths = {
                  actualPath: {
                    color: '#008000',
                    weight: 2,
                    latlngs: []
                  }
                };

                $scope.markers = {
                  actualPoint: {
                    lat: 0,
                    lng: 0,
                    focus: true,
                    draggable: false
                  }
                };
                $scope.defaults = {
                  scrollWheelZoom: false,
                  zoomControlPosition: 'bottomleft'
                };

			    		init();

			    		/////////////////////////////////////////

			    		//listeners,
				    	function init() {
                GpsService.geoGetPosition().then(updatePositionHandler);
                GpsServiceChannel.subPositionUpdated($scope, updatePositionHandler);

                leafletData.getMap("tracking-map").then(function(map) {
                  $timeout(function(){
                    map.invalidateSize();
                  }, 2000);
                });
				    		stateUpdatedHandler(ScannLogger.getState());
				    		ScannLoggerChannel.subStateUpdated($scope, stateUpdatedHandler);
				    	};

              function updatePositionHandler(position) {

                if(angular.isObject(position) && ('coords' in position) ){
                  var lat = position.coords.latitude,
                      lng = position.coords.longitude;
                  updateCenter(lat, lng);
                  updateActualPosition(lat, lng);
                  if(actualState = "recording") {
                    updateTrack(lat, lng);
                  }

                  leafletData.getMap("tracking-map").then(function(map) {
                    $timeout(function(){
                      map.invalidateSize();
                    }, 200);
                  });
                }

              }

              function updateActualPosition(lat, lng){
                $scope.markers.actualPoint.lat = lat;
                $scope.markers.actualPoint.lng = lng;
              }
                function updateTrack(lat, lng){
                  $scope.markers[TrackCount] = {};
                  $scope.markers[TrackCount].lat = lat;
                  $scope.markers[TrackCount].lng = lng;

                  $scope.paths.actualPath.latlngs.push({lat:lat, lng: lng});
                  TrackCount++;
                }

                function updateCenter(lat, lng){
                  $scope.center.lat = lat;
                  $scope.center.lng = lng;
                }

				    	function stateUpdatedHandler(newState) {
				    		actualState = newState;
				    	}

			    }]

			  }

	};

})();
