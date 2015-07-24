var apiDevicesControllers = angular.module('apiDevicesControllers', ['beaconAPIServices', 'generalServices']);
 
apiDevicesControllers.controller('apiDevicesListCtrl',
				[ '$scope', 'serverBeaconStore', 'beaconAPIChannel', 'generalService',
         function( $scope,   serverBeaconStore,   beaconAPIChannel,   generalService) {
			//$scope vars
			$scope.apiDevicesCtrl = {};
			$scope.apiDevicesCtrl.apiDevicesList = [];
			
			//functions
			$scope.openIABWithKey = generalService.openIABWithKey;

			$scope.apiDevicesCtrl.refreshServerData = function() {
	    		serverBeaconStore.updateBeaconList()
			    	.then(
		    			//success
		    			function (result) { $scope.$broadcast('scroll.refreshComplete');  }, 
		    			//error
		    			function(error) { $scope.$broadcast('scroll.refreshComplete'); }
		    		); 
	    	}
			
			var _mergeBeacons = function(newBeaconList) {
				angular.forEach(newBeaconList, function(beacon, key) {
					
					newDevice = {	bcmsBeaconKey	: key,
									bcmsBeacon 		: beacon
					};
					
					$scope.apiDevicesCtrl.apiDevicesList.push(newDevice);
				});
			}
	    	
	    	var _subBeaconsUpdatedHandler = function(result) {
	    		var newDevice = {};
	    		serverBeaconStore.getAllBeacons().then(
	    				//success
		    			function (newBeaconList) { _mergeBeacons(newBeaconList); }, 
		    			//error
		    			function() { }
	    		);
	    	};
	    	
	    	var init = function() {
	    		beaconAPIChannel.subBeaconsUpdated($scope, _subBeaconsUpdatedHandler); 
	    		console.log('init apiDevicesListCtrl'); 
	    	}
	    	
	    	init(); 
	    	
		
}]);