/* Controllers of start component */
//______________________________________________________________________________________

var scanningIbeaconControllers = angular.module('scanning.ibeacon.controllers', ['bleServices', 'bcmsServices', 'LocalForageModule', 'ngCordova']);



scanningIbeaconControllers/**/
.constant("scanningIbeaconControllersConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/* Scanning Controllers */
scanningIbeaconControllers.controller( 'ScanningIbeaconRecentlyseenCtrl', 
				//@TODO check dependncies because if order changes problem occours
				['$dummyScanner', '$rootScope', '$scope', '$filter',  'scanningIbeaconControllersConfig', 'bleNotificationChannel', 'bcmsAjaxServiceConfig', 'bleDeviceServiceConfig', 'bleDeviceService', '$ionicPlatform', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function($dummyScanner,   $rootScope ,  $scope,   $filter,    scanningIbeaconControllersConfig,   bleNotificationChannel,   bcmsAjaxServiceConfig,   bleDeviceServiceConfig,   bleDeviceService,   $ionicPlatform,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {
		/*
    			// Specify your beacon 128bit UUIDs here.
				$scope.iBeaconRanges = {
						//Estimote Beacon factory UUID.
						'B9407F30-F5F8-466E-AFF9-25556B57FE6D' : false,
						'699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012' : false,
						'E6C56DB5-DFFB-48D2-B088-40F5A81496EE' : false
					};
				// Dictionary of beacons.
				$scope.iBeacons  = {};
				$scope.logs = {};
				
				$scope.stopScan = function() {
					cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
    				.fail(console.error)
    				.done();
				}
				
				$ionicPlatform.ready(function() {
					// Specify a shortcut for the location manager holding the iBeacon functions.
					//window.locationManager = cordova.plugins.locationManager;
					// Start tracking beacons!
				
				
					// The delegate object holds the iBeacon callback functions
					// specified below.
					var delegate = new locationManager.Delegate();
					
					//var t =  Date.now();
					//$scope.logs[t] = 'delegate: ' + JSON.stringify(delegate);
					
					// Called continuously when ranging beacons.
					delegate.didRangeBeaconsInRegion = function(pluginResult)
					{
						//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
						//var t =  Date.now();
						//$scope.logs[t] = 'didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult);
						
						for (var i in pluginResult.beacons)
						{
							//var t =  Date.now();
							//$scope.logs[t] = pluginResult.beacons[i];
							
							// Insert beacon into table of found beacons.
							var beacon = pluginResult.beacons[i];
							beacon.timeStamp = Date.now();
							var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
							$scope.iBeacons[key] = beacon;
							 
						}
					};
					
					
					// Set the delegate object to use.
					locationManager.setDelegate(delegate);
					
					// Request permission from user to access location info.
					// This is needed on iOS 8.
					locationManager.requestAlwaysAuthorization();
					
					var i = 1;
					// Start monitoring and ranging beacons.
					for (var uuid in $scope.iBeaconRanges)
					{
						console.log(uuid, i++);
						
						var beaconRegion = new locationManager.BeaconRegion(i++,uuid);
						// Start ranging.
						locationManager.startRangingBeaconsInRegion(beaconRegion)
							.fail(console.error)
							.done();
						// Start monitoring.
						// (Not used in this example, included as a reference.)
						locationManager.startMonitoringForRegion(beaconRegion)
						.fail(console.error)
						.done();
					}
					
				});
*/
					
					// Specify your beacon 128bit UUIDs here.
					$scope.regions =
					[
						// Estimote Beacon factory UUID.
						{uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D'},
						// Sample UUIDs for beacons of SIT
						{uuid:'0235B0B2-B6B5-AD4C-4FBD-C17602C2434C'},
						{uuid:'699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012'},
					];
					// Dictionary of beacons.
					$scope.iBeacons  = {};
					$scope.logs = {};
					
					$scope.startScan = function() {
					
						cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
	    				.fail(console.error)
	    				.done();
					}
					
					$scope.startScan = function() {
					
						// The delegate object holds the iBeacon callback functions
						// specified below.
						var delegate = new locationManager.Delegate();
						
						//var t =  Date.now();
						//$scope.logs[t] = 'delegate: ' + JSON.stringify(delegate);
						
						// Called continuously when ranging beacons.
						delegate.didRangeBeaconsInRegion = function(pluginResult)
						{
							//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
							//var t =  Date.now();
							//$scope.logs[t] = 'didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult);
							
							for (var i in pluginResult.beacons)
							{
								//var t =  Date.now();
								//$scope.logs[t] = pluginResult.beacons[i];
								
								// Insert beacon into table of found beacons.
								var beacon = pluginResult.beacons[i];
								beacon.timeStamp = Date.now();
								var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
								$scope.iBeacons[key] = beacon;
								 
							}
						};
						
						
						// Called when starting to monitor a region.
						// (Not used in this example, included as a reference.)
						delegate.didStartMonitoringForRegion = function(pluginResult)
						{
							//var t =  Date.now();
							//$scope.logs[t] = 'didStartMonitoringForRegion:' + JSON.stringify(pluginResult);
						};
						// Called when monitoring and the state of a region changes.
						// (Not used in this example, included as a reference.)
						delegate.didDetermineStateForRegion = function(pluginResult)
						{
							//var t =  Date.now();
							//$scope.logs[t] = 'didDetermineStateForRegion: ' + JSON.stringify(pluginResult);
						};
						
						// Set the delegate object to use.
						locationManager.setDelegate(delegate);
						
						// Request permission from user to access location info.
						// This is needed on iOS 8.
						locationManager.requestAlwaysAuthorization();
						
						// Start monitoring and ranging beacons.
						for (var i in $scope.regions)
						{
							var beaconRegion = new locationManager.BeaconRegion(i + 1,$scope.regions[i].uuid);
							// Start ranging.
							locationManager.startRangingBeaconsInRegion(beaconRegion)
								.fail(console.error)
								.done();
							// Start monitoring.
							// (Not used in this example, included as a reference.)
							locationManager.startMonitoringForRegion(beaconRegion)
							.fail(console.error)
							.done();
						}
					}


					$ionicPlatform.ready(function() {
						// Specify a shortcut for the location manager holding the iBeacon functions.
						window.locationManager = cordova.plugins.locationManager;
						// Start tracking beacons!
						//var t =  Date.now();
						//$scope.logs[t] = 'window.locationManager:'+ JSON.stringify(window.locationManager);
						$scope.startScan();
					});

			

}]);