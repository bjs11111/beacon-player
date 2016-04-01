;(function() {
    'use strict';


angular
    .module('bp.app.controller', ['d7-services.commons.authentication', 'd7-services.commons.directives.toggleByAccesslevel', 'commons.services.generalServices.factory', 'commons.deviceDataManager.service', 'commons.services.cms.beaconAPIServices', 'commons.services.ble.bleScanners.factory'])
    .controller('AppController', AppController);
	//@TODO try to use $scope to listen on events instead of $rootScope
	AppController.$inject = ['$rootScope','$state','$ionicSideMenuDelegate','AuthenticationServiceConstant','AuthenticationService','generalService','DeviceDataManagerService' ];

	/** @ngInject */
	function AppController(   $rootScope,  $state,  $ionicSideMenuDelegate,  AuthenticationServiceConstant,   AuthenticationService, generalService,  DeviceDataManagerService )
	{
		// jshint validthis: true
		var vm = this;

		vm.accessLevels = AuthenticationServiceConstant.accessLevels;
		vm.loggingOut = false;

		vm.doLogout = doLogout;

		///////////////////////

		function doLogout() {

			vm.loggingOut = true;

			AuthenticationService
			 	.logout()
			 		.then(
		 				function(data) {
		 					$ionicSideMenuDelegate.toggleLeft();
		 					$state.go('app.login');
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
