(function () {
  'use strict';

  /**
   * tracking-map Module
   */
  var trackingMap = angular.module('commons.directives.trackingMap.directive', ['commons.services.scannLogger.factory', 'commons.services.scannLogger.channel', 'commons.services.gps.factory', 'ngMap'])

    .directive('trackingMap', trackingMap);

  /**
   * Manually identify dependencies for minification-safe code
   *
   **/
  trackingMap.$inject = ['ScannLogger', 'ScannLoggerChannel', 'GpsServiceChannel', 'NgMap'];

  /**
   *
   **/
  /** @ngInject */
  function trackingMap(ScannLogger, ScannLoggerChannel, GpsService, GpsServiceChannel, NgMap) {

    var buttonIcons = {
        ready: 'ion-play',
        recording: 'ion-stop',
        finished: 'ion-upload'
      },
      watchGeoInterval = undefined;

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/directives/map/tracking-map.html',
      controller: ['$scope',
        function ($scope) {

          var actualState = ScannLogger.getState(),
            TrackCount = 0;

          $scope.center = [];

          $scope.zoom = 12;

          $scope.paths = {
            actualPath: []
          };

          $scope.markers = [
            {pos: [], name: 'actualPosition'}
          ];

          init();

          /////////////////////////////////////////

          //listeners,
          function init() {
            GpsService.geoGetPosition().then(updatePositionHandler);
            GpsServiceChannel.subPositionUpdated($scope, updatePositionHandler);

            stateUpdatedHandler(ScannLogger.getState());
            ScannLoggerChannel.subStateUpdated($scope, stateUpdatedHandler);

            NgMap.getMap({id: 'gmap'}).then(function (map) {
              $scope.gmap = map;
              map.setZoom(4);
            });
          };

          function updatePositionHandler(position) {
            if (angular.isObject(position) && ('coords' in position)) {
              var lat = position.coords.latitude,
                lng = position.coords.longitude;

              updateCenter(lat, lng);
              updateActualPosition(lat, lng);

              if (actualState == "recording") {
                updateTrack(lat, lng);
              }

            }

          }

          function updateActualPosition(lat, lng) {
            $scope.markers[0].pos[0] = lat;
            $scope.markers[0].pos[1] = lng;
          }

          function updateTrack(lat, lng) {
            $scope.markers[TrackCount] = {pos: []};
            $scope.markers[TrackCount].pos[0] = lat;
            $scope.markers[TrackCount].pos[1] = lng;

            $scope.paths.actualPath.push({lat: lat, lng: lng});
            TrackCount++;
          }

          function updateCenter(lat, lng) {
            $scope.center[0] = lat;
            $scope.center[1] = lng;
          }

          function stateUpdatedHandler(newState) {
            actualState = newState;
            switch(actualState){
              case'ready':
                $scope.paths.actualPath = [];
                $scope.markers = [$scope.markers[0]];
                    break;
            }
          }

        }]

    }

  };

})();
