/* Controllers of start component */
var apiDevicesControllers = angular.module('apiDevicesControllers', ['deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);
 
/*Scanning controller*/
apiDevicesControllers.controller('apiDevicesListCtrl',
				[ '$scope', 'beaconAPIService',
         function( $scope,   beaconAPIService) {
			   
			//we need a "." in our view variables
			$scope.apiDevicesCtrl = {};
			$scope.apiDevicesCtrl.apiDevicesList = {};		

	      	//start refreshes serverdata every x ms
	    	$scope.apiDevicesCtrl.refreshServerData = function() {
	    		beaconAPIService.getAllBeacons()
			    	.then(
		    			//success
		    			function (apiDeviceList) { 
		    				console.log('apiDevicesListCtrl refreshServerData' + Date.now() ); 
		    				angular.forEach(apiDeviceList, function(beacon, key) {
		    					$scope.apiDevicesCtrl.apiDevicesList[key] = {	bcmsBeaconKey	: key,
		    																	bcmsBeacon 		: beacon
		    																};
		    				});	
		    				
		    				$scope.$broadcast('scroll.refreshComplete');  }, 
		    			//error
		    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	    	}	
		
	      	//initial stuff 
	      	var init = function () {
	      		
	      	}
	      	
	      	init();
	    

}]);