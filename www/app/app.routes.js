;(function() {
    'use strict';

    angular.module('drupalionicDemo.routes', ['ngStorage',
                                              'ngDrupal7Services-3_x.commons.configurations',
                                              'ngDrupal7Services-3_x.commons.authentication',
                                              'drupalionicDemo.app.controller', 
                                              'drupalionicDemo.login.controller',
                                              'drupalionicDemo.profile.controller',
                                              'drupalionicDemo.bleDevicesControllers',
                                              //'commons.services.cms.beaconAPIServices',
                                              'commons.services.ble.bleScanners.factory'
                                              ]) 
    .config(configFunction)
    .run(runFunction);

    configFunction.$inject = ['$stateProvider','$urlRouterProvider','$localStorageProvider','AuthenticationServiceConstant'];
    
	/** @ngInject */
	function configFunction(   $stateProvider,  $urlRouterProvider,  $localStorageProvider,  AuthenticationServiceConstant) { 
		
		//http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
		// Prevent $urlRouter from automatically intercepting URL changes;
		// this allows you to configure custom behavior in between location changes and route synchronization
		//
		//We use this in the in the modules .run function
		$urlRouterProvider.deferIntercept();
		
		//routing configurations
		$urlRouterProvider.otherwise('app/login');
		
		//set states
	    $stateProvider
	    
	    .state('app', {
            url: "/app",
            abstract: true,
            templateUrl		: "app/app.view.html",
            controller		: 'AppController as app'
          })
	    
       .state('app.login', {
            url: '/login',
            views : {
            	'menuContent' : {
            		 templateUrl	: 'app/components/login/login.view.html',
                     controller		: 'LoginController as login',
            	}
            } 
       })
       
       .state('app.profile', {
            url: '/profile',
            views : {
            	'menuContent' : {
            		 templateUrl	: 'app/components/profile/profile.view.html',
                     controller		: 'ProfileController as profile'
            	}
            },
            data : {
            	'access' : AuthenticationServiceConstant.accessLevels.user
            }
       })
       
       //@TODO refactor to controller as
       .state('app.list', {
				url : '/ble-devices',
				views : {
					'menuContent' : {
						templateUrl : 'app/components/ble-devices/ble-devices-list.html',
						controller 	: 'bleDevicesListCtrl as deviceList'
					}
				}
			})
       
       ;
	    
	};
	
	
	runFunction.$inject = ['$rootScope','AuthenticationService','serverBeaconStore','sitBleScanner','$state','$localStorage','DrupalApiConstant','$urlRouter','$ionicLoading'];
	                       
	
	/** @ngInject */ 
	function runFunction(   $rootScope,  AuthenticationService,  serverBeaconStore,  sitBleScanner,  $state, $localStorage,   DrupalApiConstant,  $urlRouter, $ionicLoading) 
	{ 
		
	    $rootScope.$on('loading:show', loadingShowCallback);
    
	    $rootScope.$on('loading:hide', loadingHideCallback );

	    //http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouterProvider#methods_deferintercept
		//location change logic => before any view is rendered
	    $rootScope.$on('$locationChangeStart', locationChangeStartCallback)

		//state change logic
		$rootScope.$on("$stateChangeStart", stateChangeStartCallback);
	    
	    ////////////
	    
	    // show ionicLoading overlay with args of event
	    function loadingShowCallback(event, args) {
	    	$ionicLoading.show((args && 'loading_settings' in args) ? args.loading_settings:{});
	    }
	    
	    // hide ionicLoading overlay
	    function loadingHideCallback(event, args) {
	        $ionicLoading.hide()
	    }
	    
	    //we need this to have out current auth state before any other thing in router happens
	    function locationChangeStartCallback(e) {
	 	   
		    	if ( AuthenticationService.getLastConnectTime() > 0) {
		       	 		//sync the current URL to the router
		    	    	$urlRouter.sync();
		    	    	return;
		    	 }
	    	 
	    	    // Prevent $urlRouter's default handler from firing
	    	    e.preventDefault();
	    	    $rootScope.$broadcast('loading:show', { loading_settings : {template:"<p><ion-spinner></ion-spinner><br/>Connect with System...</p>"} });
	    	   
	    	    // init or refresh Authentication service connection    
	    	    AuthenticationService
	    	    .refreshConnection()
		    	    .then(
		    	    	function() {
		    	    		$rootScope.$broadcast('loading:hide');
		    	    		//sync the current URL to the router 
		    	    		$urlRouter.sync();
		    	    	}
		    	    )
		    	    .catch(
		    	    	function() {
		    	    		$rootScope.$broadcast('loading:hide');
		    	    		//sync the current URL to the router 
		    	    		$urlRouter.sync();
		    	    	}
		    	    );
	    	    
	    	    
    	    console.log('serverBeaconStore.isInitialized'); 
    	    if (serverBeaconStore.isInitialized() === false) {
    	   	    // Prevent $urlRouter's default handler from firing
    	   	    e.preventDefault(); 
    	   	    $rootScope.$broadcast('loading:show', { loading_settings : {template:"<p><ion-spinner></ion-spinner><br/>Loading...</p>"} });
    	   	    
    	   	    // init or refresh Authentication service connection    
    	   	    console.log('load initial beacons from server in app.route'); 
    	   	    serverBeaconStore.updateBeaconList().then(
    	   	    	function() {
    	   	    		sitBleScanner.startScanning();
    	   	    		$rootScope.$broadcast('loading:hide');
    	   	    		//sync the current URL to the router 
    	   	    		$urlRouter.sync(); 
    	   	    	},
    	   	    	function() {
    	   	    		$rootScope.$broadcast('loading:hide');
    	   	    		//sync the current URL to the router 
    	   	    		$urlRouter.sync();
    	   	    	}
    	   	    );
    	   	    
    	     }
	    	    
	    	 
	    	 // Configures $urlRouter's listener *after* your custom listener
		     $urlRouter.listen();
		};
		
		function stateChangeStartCallback(event, toState, toParams, fromState, fromParams) {
		   
		    //redirects for logged in user away from login or register and show its profile instead
			if  (toState.name == 'app.login') {
				if(AuthenticationService.getConnectionState()) {
					event.preventDefault();
					$state.go('app.profile');
					return;
				}
		    } 
			
			//redirect if user is unauthorized
			if ( ('data' in toState) && ('access' in toState.data) && !AuthenticationService.isAuthorized(toState.data.access) ) {
				event.preventDefault();
				$state.go('app.login'); 
				return;
		    }
	    }

	}


})();