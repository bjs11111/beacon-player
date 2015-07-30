var appControllers = angular.module('appControllers', [ 'ngCordova', 'bleState', 'qrScanner', 'deviceStates']);

/* 
 * 
 * App Controllers 
 * This controller holds general logic for all app.* controllers
 * */
appControllers
.controller('AppCtrl', ['$rootScope', '$scope', 'serverBeaconStore',
                function($rootScope,   $scope,   serverBeaconStore) {
	
    var init = function() {
	   serverBeaconStore.updateBeaconList();   
	   console.log('init AppCtrl'); 
    }
	   
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
       
    init(); 
		
}]);













