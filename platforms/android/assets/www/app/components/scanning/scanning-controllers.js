/* Controllers of start component */
var scanningControllers = angular.module('scanningControllers', ['bleChannels', 'deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);


/*Config for scanning controllers*/
scanningControllers.constant("scanningCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});
/*Scanning controller*/
scanningControllers.controller('scanningCtrl',
				[ '$scope', 'bleScannerChannel','beaconAPIService', 'bleDeviceChannel', 'bleDeviceService',
         function( $scope,   bleScannerChannel,  beaconAPIService,   bleDeviceChannel,   bleDeviceService) {
			//we need a "." in our view variables			   
			$scope.scanCtrl = {};
			$scope.scanCtrl.allDevicesList = {};		

	      	//start refreshes serverdata every x ms
	    	$scope.scanCtrl.refreshServerData = function() {
	    		bleDeviceService.updateBeaconsFromServer()
			    	.then(
		    			//success
		    			function () { console.log('getAllBeacons e' + Date.now() ); $scope.$broadcast('scroll.refreshComplete');  }, 
		    			//error
		    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	    	}	
	    	
	    	//this is used to update list after serverdata updated   	
	    	var subKnownDeviceUpdatedHandler = function(key)  { 
	    		console.log('scanningCtrl subKnownDeviceUpdatedHandler' + Date.now()); 
				$scope.scanCtrl.allDevicesList[key] 	= bleDeviceService.getKnownDevice(key); 
				$scope.$apply(); 
			};
		
	      	//initial stuff 
	      	var init = function () {
	      		console.log('init scanningCtrl');
	      		bleDeviceChannel.subKnownDeviceUpdated($scope, subKnownDeviceUpdatedHandler );
	      	}
	      	
	      	init();
	    
	      	console.log('asf adsf das fas fes');

}]);