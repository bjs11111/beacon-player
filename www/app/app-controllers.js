var appControllers = angular.module('appControllers', [ 'ngCordova', 'bleState', 'qrScanner', 'deviceManagers']);

/* 
 * 
 * App Controllers 
 * This controller holds general logic for all app.* controllers
 * */

appControllers
//@TODO move into service
.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 30,
	msBeforeBeaconIsOld : 1000 * 10,
})

.controller('AppCtrl', ['$scope', 'bleDeviceService', 
                function($scope, bleDeviceService) {
	
}]);













