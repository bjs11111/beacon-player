var appControllers = angular.module('appControllers', [ 'ngCordova', 'bleState', 'qrScanner', 'beaconAPIServices']);

/* 
 * 
 * App Controllers 
 * This controller holds general logic for all app.* controllers
 * */
appControllers
.controller('appCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'serverBeaconStore', 'beaconAPIChannel',
                function($rootScope,   $scope,   $state,   $timeout,  serverBeaconStore,   beaconAPIChannel) {
	
   
	$scope.appCtrl = {};
	
	
	   
	// @TODO moe into directive
    // Show hide network connection bar
    $scope.states = {};
  	$scope.states.isOffline = false;
  	
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    	serverBeaconStore.updateBeaconList();
    	$scope.states.isOffline = false;
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
    	$scope.states.isOffline = true;
    });
       
    var init = function() {
 	   console.log('init AppCtrl');
     }
    
    init(); 
		
}]);













