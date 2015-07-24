// Ionic beaconPlayer App-Module
var beaconPlayerApp = angular.module('beaconPlayerApp', 
		[ 'ionic',
		  //stores
		  'beaconAPIServices',
		  
		  //main controller
		  'appControllers',
		  //components/pages
		  'helpControllers', 
		  'bleDevicesControllers', 
		  'apiDevicesControllers', 
		  'scanningControllers', 
		  'tourControllers', 
		  'settingsControllers', 
]);

beaconPlayerApp.config(
		[ '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
  function($stateProvider,   $urlRouterProvider,   $ionicConfigProvider) {
			
			/**
			 * config routing
			 **/
			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/app/scanning');

			$stateProvider
			
			.state('app', {
				url : "/app", 
				abstract : true,
				templateUrl : "app/templates/main-sidemenu.html",
				controller 	: 'AppCtrl'
					
			})

			.state('app.settings', {
				url : '/settings',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/settings/settings.html',
						controller 	: 'settingsCtrl'
					}
				}
			})
			
			
			.state('app.help', {
				url : '/help',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/help/help.html',
						//controller 	: 'helpCtrl'
					}
				}
			})
			
			.state('app.ble-devices', {
				url : '/ble-devices',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/ble-devices/ble-devices-list.html',
						controller 	: 'bleDevicesListCtrl'
					}
				}
			})
			
			.state('app.api-devices', {
				url : '/api-devices',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/api-devices/api-devices-list.html',
						controller 	: 'apiDevicesListCtrl'
					}
				}
			})

			.state('app.scanning', {
				url : '/scanning',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/scanning/scanning.html',
						controller 	: 'scanningCtrl'
					}
				}
			})

			.state('app.tour', {
				url : '/tour',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/tour/tour.html',
						controller 	: 'tourCtrl'
					}
				}
			});

}]);

beaconPlayerApp.run([ '$ionicPlatform', function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		 
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}

		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

	});
} ]);
