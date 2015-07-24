var appControllers = angular.module('appControllers', [ 'ngCordova', 'bleState', 'qrScanner', 'beaconAPIServices' ]);

/* 
 * 
 * App Controllers 
 * This controller holds general logic for all app.* controllers
 * */
appControllers
.controller('AppCtrl', ['$scope', 'serverBeaconStore',
                function($scope,   serverBeaconStore) {
	
	   var init = function() {
		   serverBeaconStore.updateBeaconList();   
		   console.log('init AppCtrl'); 
	   }
	   
	   init(); 
		
}]);













