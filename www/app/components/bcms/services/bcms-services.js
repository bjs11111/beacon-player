/* Services */
var bcmsServices = angular.module('bcmsServices', ['LocalForageModule', 'bleServices']);

bcmsServices

//Constants for the bleDeviceService
//rename to general settings
.constant("bcmsAjaxServiceConfig", {
	//Events
	_BEACON_LIST_UPDATED_ 	: '_BEACON_LIST_UPDATED_',
	_TRY_IAB_OPEN_EVENT_ 	: '_TRY_IAB_OPEN_EVENT_',
	//path vars
	basePath 				: 'http://www.starnberger.at/dev-bcms',
	getBeaconsListPath		: 'get-all-beacons',
	iabView 				: 'b-i',
	
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
   
// publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var publishManualOpenIAB = function (bcmsBeaconKey) {
	   //console.log('in publishTryOpenIAB' + bcmsBeaconKey );
       $rootScope.$broadcast(bcmsAjaxServiceConfig._TRY_IAB_OPEN_EVENT_, {bcmsBeaconKey: bcmsBeaconKey});
   };
   // subscribe to knownDevices updated notification
   var onManualOpenIAB = function ($scope, handler) {
       $scope.$on(bcmsAjaxServiceConfig._TRY_IAB_OPEN_EVENT_, function (event, agrs) {
    	   handler(agrs.bcmsBeaconKey);
       });
   };
   
   // return the publicly accessible methods
   return {
	   publishBeaconListUpdated	: publishBeaconListUpdated,
	   onBeaconListUpdated		: onBeaconListUpdated,
	   publishManualOpenIAB		: publishManualOpenIAB,
	   onManualOpenIAB			: onManualOpenIAB
   	};
}])

//ajax calls
.factory( 'bcmsAjaxService', ['$http', 'bcmsAjaxServiceConfig', 'bleDeviceServiceConfig', 'bleDeviceService',
                      function($http,   bcmsAjaxServiceConfig,   bleDeviceServiceConfig,   bleDeviceService) {

	var refreshBeaconList = function() {
		
		var path = bcmsAjaxServiceConfig.basePath + '/' + bcmsAjaxServiceConfig.getBeaconsListPath;
		var oldData = undefined;
		return  $http.post(path)			
		.success(function (data, status, headers, config) { 
				angular.forEach(data, function(value, key) {
					bleDeviceService.mapBeaconDataToKnownDevices(value, bleDeviceServiceConfig.mapTypeBcmsDevice); 
				});	
				return true;
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