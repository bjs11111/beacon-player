/* Services */
var bcmsServices = angular.module('bcmsServices', ['bleServices', 'bleFilters']);

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
	iabView 				: 'b-i'
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
.factory( 'bcmsAjaxService', ['$http','$filter', 'bcmsAjaxServiceConfig', 'bleDeviceServiceConfig', 'bleDeviceService', '$cordovaEvothingsBLE',
                      function($http,  $filter,  bcmsAjaxServiceConfig,   bleDeviceServiceConfig,   bleDeviceService,   $cordovaEvothingsBLE) {

	 var hexToIBeaconUuid 	= $filter('hexToIBeaconUuid');
	
	var refreshBeaconList = function() {
		
		var path = bcmsAjaxServiceConfig.basePath + '/' + bcmsAjaxServiceConfig.getBeaconsListPath;
		var oldData = undefined;
		
		

		return   $http({
 			    method: 'GET',
 			    url: 'app/data/skydataBeacons.json'
 			  })			
		.then(function (data, status, headers, config) { 
			
			//console.log(data); 
			
				angular.forEach(data.data, function(value, key) {
					//console.log(value, key);
					value = mapSkyDataBeaconToBcmsBeacon(value)
					
					
					//add uuid to range
					$cordovaEvothingsBLE.addIBeaconRange(value.iBeaconUuid);
					
					bleDeviceService.mapBeaconDataToKnownDevices(value, bleDeviceServiceConfig.mapTypeBcmsDevice); 
				});	
				return true;
        },function (error, status, headers, config) {
        	console.log(error); 
           return {error : "Error occurred.  Status:" + status};
        });
		
		///////
		
		
		function mapSkyDataBeaconToBcmsBeacon(obj) {
			var mappedObj = angular.extend({}, obj);
			mappedObj.iBeaconUuid = hexToIBeaconUuid(mappedObj.idDataUUID.split('x').pop());
		    mappedObj.bcmsBeaconKey  = mappedObj.iBeaconUuid +'.'+mappedObj.idDataMajorId+'.'+mappedObj.idDataMinorId;
		    
			return mappedObj;
			
		}
	
	}
	
	//notice use only function name without () on the right side
	return {
		refreshBeaconList 	: refreshBeaconList,
	};
	
}]);