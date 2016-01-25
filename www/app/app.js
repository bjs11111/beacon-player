;(function() {
    'use strict';

    angular.module('bp', ['ionic', 'bp.config', 'bp.routes','commons.services.gps.factory'])
    .run(runFunction);

    runFunction.$inject = ['$ionicPlatform','GpsService'];

	  /** @ngInject */
	  function runFunction($ionicPlatform, GpsService) {

		  $ionicPlatform.ready(function() {
		    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs)
		    if(window.cordova && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		    }
		    if(window.StatusBar) {
		      StatusBar.styleDefault();
		    }


        GpsService.startWatchGeoCustom();
		  });

	  };

})();
