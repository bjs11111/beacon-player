// Ionic beaconPlayer App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'beaconPlayerApp' is the name of this angular module example (also set in a <body> attribute in index.html)
var beaconPlayerApp = angular.module('beaconPlayerApp', [ 'ionic',
                                                          //main controller
                                                          'app.controllers', 
                                                          //global modules

                                                          //custom general components (direvtives filters, services, constants)... 
                                              
                                                          //components sites
                                                         'help.controllers', 'scanning.controllers', 'scanning.ibeacon.controllers']);

beaconPlayerApp.config(
			[ '$stateProvider', '$urlRouterProvider',   '$ionicConfigProvider', '$localForageProvider',   
	  function($stateProvider,   $urlRouterProvider,     $ionicConfigProvider ,  $localForageProvider) {
	 
	// config ionic app
	$ionicConfigProvider.tabs.position('bottom');
	
	//localForage Storage (Offline storage, improved.)
	$localForageProvider.config( { 
        //driver      	: 'localStorageWrapper', // if you want to force a driver
        //name        	: 'beaconPlayer', // name of the database and prefix for your data, it is "lf" by default
        //version     	: 1.0, // version of the database, you shouldn't have to use this
        //storeName   	: 'localstoreag', // name of the table
        description 	: 'This is a key vlue store for beacon and its content.'
    });

	  // Ionic uses AngularUI Router which uses the concept of states
	
	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/scanning-ibeacon');
	
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
	  })
	  
	   .state('app.scanning-ibeacon', {
	   url:'/scanning-ibeacon',
	    views: {
	    	'mainContent': {
		  		templateUrl: 'app/components/scanning_ibeacon/scanning-recentlyseen.html',
	    		controller: 'ScanningIbeaconRecentlyseenCtrl'
	    	}
	    }
	  })
	  
	  

	  ;

}]);
	    
beaconPlayerApp.run(function($ionicPlatform ) {
  $ionicPlatform.ready(function() {
	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
  });
});


	    