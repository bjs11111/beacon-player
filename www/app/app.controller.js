;(function() {
    'use strict';


angular
    .module('bp.app.controller', ['d7-services.commons.authentication', 'd7-services.commons.directives.toggleByAccesslevel', 'commons.services.generalServices.factory', 'commons.deviceDataManager.service'])
    .controller('AppController', AppController);
	//@TODO try to use $scope to listen on events instead of $rootScope
	AppController.$inject = ['$rootScope','$state','$ionicSideMenuDelegate','AuthenticationServiceConstant','AuthenticationService','generalService','DeviceDataManagerService' ];

	/** @ngInject */
	function AppController(   $rootScope,  $state,  $ionicSideMenuDelegate,  AuthenticationServiceConstant,   AuthenticationService, generalService,  DeviceDataManagerService )
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
