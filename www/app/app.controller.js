;(function() {
    'use strict';


angular
    .module('bp.app.controller', [
    'd7-services.commons.authentication',
    'd7-services.commons.directives.toggleByAccesslevel',
    'commons.services.glue.service',
    'commons.offlineBar'])
    .controller('AppController', AppController);

	AppController.$inject = ['$ionicSideMenuDelegate','AuthenticationServiceConstant','AuthenticationService', 'GlueService'];
	function AppController(   $ionicSideMenuDelegate,  AuthenticationServiceConstant,   AuthenticationService, GlueService )
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
              GlueService.goToState('app.login');
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
