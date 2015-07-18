/* Controllers of start component */
var apiDevicesControllers = angular.module('apiDevicesControllers', ['bleChannels', 'deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);
 
/*Scanning controller*/
apiDevicesControllers.controller('apiDevicesListCtrl',
				[ '$scope', 'bleScannerChannel','beaconAPIService', 'bleDeviceChannel', 'bleDeviceService',
         function( $scope,   bleScannerChannel,  beaconAPIService,   bleDeviceChannel,   bleDeviceService) {
			   
			$scope.apiDevicesCtrl = {};
			$scope.apiDevicesCtrl.allDevicesList = {};		

	      	//start refreshes serverdata every x ms
	    	$scope.apiDevicesCtrl.refreshServerData = function() {
	    		bleDeviceService.updateBeaconsFromServer()
			    	.then(
		    			//success
		    			function () { console.log('getAllBeacons e' + Date.now() ); $scope.$broadcast('scroll.refreshComplete');  }, 
		    			//error
		    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	    	}	
	    	
	    	//this is used to update list after serverdata updated   	
	    	var subKnownDeviceUpdatedHandler = function(key)  { 
	    		
				//$scope.apiDevicesCtrl.allDevicesList[key] 	= bleDeviceService.getKnownDevice(key);
				
			};
		
	      	//initial stuff 
	      	var init = function () {
	      		//bleDeviceChannel.subKnownDeviceUpdated($scope, subKnownDeviceUpdatedHandler );
	      	}
	      	
	      	init();
	    

}]);