// Ionic beaconPlayer App-Module
var beaconPlayerApp = angular.module('beaconPlayerApp', 
		[ 'ionic',
		  //main controller
		  'appControllers',
		  //components/pages
		  'helpControllers', 'scanningControllers', 'tourControllers', 'settingsControllers', 
]);

beaconPlayerApp.config([ '$stateProvider', '$urlRouterProvider',
		'$ionicConfigProvider',
		function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
			
			/**
			 * config ionic 
			 **/
			//@Todo check if needed or use defaults for each device
			//$ionicConfigProvider.tabs.position('bottom');
	
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
				controller : 'AppCtrl'
			})

			.state('app.help', {
				url : '/help',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/help/help.html',
						controller : 'helpCtrl'
					}
				}
			})

			.state('app.scanning', {
				url : '/scanning',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/scanning/scanning.html',
						controller : 'scanningCtrl'
					}
				}
			})

			.state('app.tour', {
				url : '/tour',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/tour/tour.html',
						controller : 'tourCtrl'
					}
				}
			})
			
			.state('app.settings', {
				url : '/settings',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/settings/settings.html',
						controller : 'settingsCtrl'
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
