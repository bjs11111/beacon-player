// Ionic beaconPlayer App-Module
var beaconPlayerApp = angular.module('beaconPlayerApp', 
		[ 'ionic',
		  'generalServices',
		  'LocalStorageModule',
		  //stores
		  'beaconAPIServices',
		  
		  //main controller
		  'appControllers',
		  //components/pages
		  'alertsControllers',
		  'qrScannerControllers',
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
			$urlRouterProvider.otherwise('/app/help');

			$stateProvider
			
			.state('app', {
				url : "/app", 
				abstract : true,
				templateUrl : "app/templates/main-sidemenu.html",
				controller 	: 'AppCtrl'
				
			})
			/*
			.state('app.settings', {
				url : '/settings',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/settings/settings.html',
						controller 	: 'settingsCtrl'
					}
				}
			})
			*/
			.state('app.help', {
				url : '/help',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/help/help.html',
						//controller 	: 'helpCtrl'
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
			})
		
			
			.state('app.alerts', {
				url : '/alerts',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/alerts/alerts.html',
						controller 	: 'alertsCtrl'
					}
				}
			})
			.state('app.qr-scanner', {
				url : '/qr-scanner',
				views : {
					'mainContent' : {
						templateUrl : 'app/components/qr-scanner/qr-scanner.html',
						controller 	: 'qrScannerCtrl'
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
			;
}]);

beaconPlayerApp.run([ '$rootScope', '$state', '$ionicPlatform', 'localStorageService', 
              function($rootScope, $state, $ionicPlatform, localStorageService) {

		//@TODO use launcherService instead of $localStorage
		//redirection logic start
	
		//load localStorage data into scope
	
		
	  /*  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
	    	//var firstVisit 	= localStorageService.get("firstVisit"); 
	    	console.log('localStorageService', localStorageService.get("firstVisit")); 
	    	 // if its the users first visit to the app play the apps tour
		   	 if ( localStorageService.get("firstVisit") != '1' && toState.name !== 'app.help') { 
		   		    event.preventDefault();
		   		    //set FirstVisite
		   		    localStorageService.set('firstVisit', '1');
		   		 console.log('localStorageService2 :', localStorageService.get("firstVisit")); 
			 		$state.go('app.help'); 	
			 		return;
			 }  
	    }); */
	    
	    //show/hide loading screen with content of args.loading_settings || default
	    $rootScope.$on('loading:show', function (event, args) {
	    	$ionicLoading.show((args && 'loading_settings' in args) ? args.loading_settings:{});
	    });
	      
	    $rootScope.$on('loading:hide', function (event, args) {
	        $ionicLoading.hide()
	    });
	    
		$ionicPlatform.ready(function() {
			 
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}

			if (window.StatusBar) { StatusBar.styleDefault(); }
		});

} ]);
