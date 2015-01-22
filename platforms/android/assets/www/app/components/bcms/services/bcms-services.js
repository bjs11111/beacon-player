/* Services */
var bcmsServices = angular.module('bcmsServices', ['LocalForageModule']);

bcmsServices

//Constants for the bleDeviceService
.constant("bcmsAjaxServiceConfig", {
	//Events
	_BEACON_LIST_UPDATED_ 	: '_BEACON_LIST_UPDATED_',
	//path vars
	basePath 				: 'http://www.starnberger.at/dev-bcms',
	getBeaconsListPath		: 'get-all-beacons',
	//localForge keys
	beaconListKey 			: 'beacon_list',
})

//bcmsNotifatation Channel
.factory('bcmsNotificationChannel', ['$rootScope', 'bcmsAjaxServiceConfig',
                            function ($rootScope,   bcmsAjaxServiceConfig) {
   
   // publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var publishBeaconListUpdated = function (updatedDate) {
	   //console.log('in publish knownDevices updated' );
       $rootScope.$broadcast(bcmsAjaxServiceConfig._BEACON_LIST_UPDATED_, {updatedDate: updatedDate});
   };
   // subscribe to knownDevices updated notification
   var onBeaconListUpdated = function ($scope, handler) {
       $scope.$on(bcmsAjaxServiceConfig._BEACON_LIST_UPDATED_, function (event, agrs) {
    	 //console.log('in on onKnownDevicesUpdated:' + JSON.stringify(args) );
    	   handler(agrs.updatedDate );
       });
   };
       
   // return the publicly accessible methods
   return {
	   publishBeaconListUpdated	: publishBeaconListUpdated,
	   onBeaconListUpdated		: onBeaconListUpdated
   	};
}])

//ajax calls
.factory( 'bcmsAjaxService', ['$http', '$localForage', 'bcmsAjaxServiceConfig', 'bcmsNotificationChannel', 
                      function($http,   $localForage,   bcmsAjaxServiceConfig,   bcmsNotificationChannel ) {

	 
	
	var refreshBeaconList = function() {
		
		var path = bcmsAjaxServiceConfig.basePath + '/' + bcmsAjaxServiceConfig.getBeaconsListPath;
		var oldData = undefined;
		var result =  $http.post(path)			
		.success(function (data, status, headers, config) { 
			
				angular.forEach(data, function(value, key) {
					
					//$localForage.clear();
					$localForage.getItem(key).then(function(oldData) {
							//oldData['bcmsBeacon'] = value;
							 
							//obj is new
							if(oldData === undefined) {
								oldData = {};
							} 
							oldData.bcmsBeacon = value;
							oldData.address = value.uuid + '.' + value.major + '.' + value.minor;
							
							$localForage.setItem( key, oldData ); 
				    });
					
				});
				
				//publish data BeaconListUpdated event
				bcmsNotificationChannel.publishBeaconListUpdated();
				 
						
        })
        .error(function (data, status, headers, config) {
            return {error : "Error occurred.  Status:" + status};
        });
	
	}
	
	//this function returns a primise of the localeForage module
	//useage => getBeaconList.then(function(data) { mydata = data });
	var getBeaconList = function () {
		return $localForage.getItem(bcmsAjaxServiceConfig.beaconListKey);
	}

	//notice use only function name without () on the right side
	return {
		// fetch beacons form cms and store it with local forge
		refreshBeaconList 	: refreshBeaconList,
		getBeaconList 		: getBeaconList,
	};
	
}]);