// Ionic beaconPlayer App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'beaconPlayerApp' is the name of this angular module example (also set in a <body> attribute in index.html)
var beaconPlayerApp = angular.module('beaconPlayerApp', [ 'ionic',
                                                          //main controller
                                                          'app.controllers', 
                                                          //global modules

                                                          //custom general components (direvtives filters, services, constants)... 
                                              
                                                          //components sites
                                                         'help.controllers', 'scanning.controllers', 'scanning.ibeacon.controllers', 'bleServices']);

beaconPlayerApp.config(
			[ '$stateProvider', '$urlRouterProvider',   '$ionicConfigProvider',    
	  function($stateProvider,   $urlRouterProvider,     $ionicConfigProvider) {
	 
	// config ionic app
	$ionicConfigProvider.tabs.position('bottom');
	
	  // Ionic uses AngularUI Router which uses the concept of states
	
	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/scanning');
	
	  // Learn more here: https://github.com/angular-ui/ui-router or look in the readme.md in the projects root folder
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider
	  
	  // setup an abstract state for the app directive 
	  // this is the root route
	  .state('app', {
	      url: "/app",
	      abstract: true,
	      templateUrl: "app/templates/main-sidemenu.html",
	      controller: 'AppCtrl'  
	  })
	  
	   //States for the start page
	  //______________________________________________
	  .state('app.help', {
	    url: '/help',
	    views: {
	      'mainContent': {
	        templateUrl: 'app/components/help/help.html',
	        controller: 'helpCtrl' 
	      }
	    }
	  })
	  
	  //States for the scanning page
	  //______________________________________________

	  .state('app.scanning', {
	   url:'/scanning',
	    views: {
	    	'mainContent': {
	    		 url: '/beacons',
		  		templateUrl: 'app/components/scanning/scanning-recentlyseen.html',
	    		controller: 'ScanningRecentlyseenCtrl'
	    	}
	    }
	  });

}]);
	    
beaconPlayerApp.run(['$ionicPlatform', '$cordovaEvothingsBLE',function( $ionicPlatform, $cordovaEvothingsBLE) {
  $ionicPlatform.ready(function() {
	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    // Specify a shortcut for the location manager holding the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager;
    $cordovaEvothingsBLE.setDelegate(new locationManager.Delegate());
    // Set the delegate object to use.
	locationManager.setDelegate($cordovaEvothingsBLE.getDelegate());
	
	// Request permission from user to access location info.
	// This is needed on iOS 8.
	locationManager.requestAlwaysAuthorization();
  });
}]);


	    