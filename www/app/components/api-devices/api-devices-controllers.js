var apiDevicesControllers = angular.module('apiDevicesControllers', ['beaconAPIServices', 'generalServices']);
 
apiDevicesControllers.controller('apiDevicesListCtrl',
				[ '$scope', 'beaconAPIService', 'generalService',
         function( $scope,   beaconAPIService,   generalService) {
			   
	
			//we need a "." in our view variables
			$scope.apiDevicesCtrl = {};
			$scope.apiDevicesCtrl.apiDevicesList = [];
			
			//functions
			$scope.openIABWithKey = generalService.openIABWithKey;

	    	$scope.apiDevicesCtrl.refreshServerData = function() {
	    		beaconAPIService.getAllBeacons()
			    	.then(
		    			//success
		    			function (apiDeviceList) { 
		    				var newDevice = {};
		    				angular.forEach(apiDeviceList, function(beacon, key) {
		    					newDevice = {	bcmsBeaconKey	: key,
												bcmsBeacon 		: beacon
								};
		    					
		    					$scope.apiDevicesCtrl.apiDevicesList.push(newDevice);
		    				});	
		    				
		    				$scope.$broadcast('scroll.refreshComplete');  }, 
		    			//error
		    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	    	}	
	    	
	    	console.log('init apiDevicesListCtrl'); 
		
}]);