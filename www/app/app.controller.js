;(function() {
    'use strict';


angular
    .module('drupalionicDemo.app.controller', ['ngDrupal7Services-3_x.commons.authentication', 'ngDrupal7Services-3_x.commons.directives.toggleByAccesslevel', 'deviceManagers', 'commons.services.generalServices.factory'])
    .controller('AppController', AppController);
	//@TODO try to use $scope to listen on events instead of $rootScope
	AppController.$inject = ['$rootScope','$state','$ionicSideMenuDelegate','AuthenticationServiceConstant','AuthenticationService','bleDeviceService','generalService'];

	/** @ngInject */ 
	function AppController(   $rootScope,  $state,  $ionicSideMenuDelegate,  AuthenticationServiceConstant,   AuthenticationService, bleDeviceService, generalService ) 
	{ 
		// jshint validthis: true 
		var vm = this;
	    
		vm.$state = $state;
		vm.accessLevels = AuthenticationServiceConstant.accessLevels;
		vm.loggingOut = false;
		
		vm.doLogout = doLogout;
		
		//hold phone states
		vm.states = {};
		vm.states.isOffline = false;
	  	 
	    // listen for Online event
	    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
	    	vm.states.isOffline = false;
	    	
	    	/*if(!serverBeaconStore.isInitialized()) {
	    		serverBeaconStore.updateBeaconList().then(
	    		   	    	function() {
	    		   	    		sitBleScanner.startScanning();
	    		   	    	},
	    		   	    	function() {});
	    	}*/
	    	
	    });

	    // listen for Offline event
	    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	    	vm.states.isOffline = true;
	    });
		
		///////////////////////
		
		function doLogout() {
			
			vm.loggingOut = true;

			AuthenticationService
			 	.logout()
			 		.then(
		 				function(data) {
		 					$ionicSideMenuDelegate.toggleLeft();
		 					vm.$state.go('app.login');
		 				}
			 		)
			 		.finally(
		 				function() {
		 					vm.loggingOut = false;
		 				}
	 				); 
		}
	   
		
	};

})();