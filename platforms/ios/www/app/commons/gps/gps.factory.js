;(function() {
	'use strict';

	angular.module('commons.services.gps.factory', ['ngCordova', 'commons.services.gps.channel'])
		   .factory('GpsService', GpsService);

	GpsService.$inject = ['$rootScope','$state','$q','$interval','$filter','$ionicPlatform','DrupalHelperService','GpsServiceChannel','$cordovaGeolocation'];

	function GpsService(   $rootScope,  $state,  $q,  $interval,  $filter,  $ionicPlatform,  DrupalHelperService,  GpsServiceChannel,  $cordovaGeolocation) {

    var bgGeoOptions = {
      // Geolocation config
      desiredAccuracy: 0,
      stationaryRadius: 50,
      distanceFilter: 50,
      disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
      locationUpdateInterval: 5000,
      minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change
      fastestLocationUpdateInterval: 5000,
      activityRecognitionInterval: 10000,
      stopDetectionDelay: 1,  // Wait x minutes to engage stop-detection system
      stopTimeout: 2,  // Wait x miutes to turn off location system after stop-detection
      activityType: 'AutomotiveNavigation',

      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user)
      forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user)
      forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user)
      stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
      startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      method: 'POST',
      batchSync: true,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
      headers: {
        "X-FOO": "bar"
      },
      params: {
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    };

    var actualGpsPosition = undefined;

    var geoOptions = {
        //frequency: 2500,
       // timeout : 2000,
        enableHighAccuracy: true
      },
      geoWatcher = undefined,
      watchGeoInterval = undefined;

    var	GpsServiceService = {
      geoGetPosition : geoGetPosition,
      startWatchGeoCustom : startWatchGeoCustom
    };

		init();

    return GpsServiceService;

    ////////////

    function init() {
      geoInit();
    };



    //GEO
    //_____________________________________________________

    function geoInit(){
        //geoGetPosition();
        //geoWatch();
    }

    function geoGetPosition() {
      var defer = $q.defer();

      ionic.Platform.ready(function(){
        return $cordovaGeolocation
          .getCurrentPosition(geoOptions)
          .then(function (position) {
            //emit event here
            GpsServiceChannel.pubPositionUpdated(position);
            defer.resolve(position);
          }, function(err) {
            //emit event here
            defer.reject(err);
          });

      });

      return defer.promise;
    }

    function startWatchGeoCustom() {
      watchGeoInterval = $interval(function(){
         geoGetPosition()
          .then(function(pos){
            GpsServiceChannel.pubPositionUpdated(pos);
            actualGpsPosition = pos;
          });

      }, 1000 * 2);
    }


    function geoWatch(){
      geoWatcher = navigator.geolocation.watchPosition(function(position) {
      }, function(err) {
      }, geoOptions);
    }

    function geoClearWatch() {

      return geoWatcher.clearWatch()
        .then(function(r){
          geoWatcher = undefined;
          return $q.resolve(r);
        });
    }


	};

})();