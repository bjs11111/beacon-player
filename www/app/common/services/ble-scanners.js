/* Services */
var bleScanners = angular.module('bleScanners', [ 'bleChannels', 'bleFilters']);

/* ble scanner for andoid use-cases*/
bleScanners.factory('androidBleScanner', [ 
       '$q', 
       '$ionicPlatform',
		function($q, $ionicPlatform) {

    	   var allDevicesList = [];
    	   
			//start scanning for ble devices on Android
			var startScanning = function(foundDeviceCallback) {
				var defer = $q.defer();

				$ionicPlatform.ready(function() {
					evothings.ble.startScan(function(rawDevice) {
						
						foundDeviceCallback(rawDevice);
					}, function(error) {
						defer.reject(error);
					});

					defer.resolve(true);
				});

				return defer.promise;

			};

			//start scanning for ble devices
			var stopScanning = function() {
				var defer = $q.defer();

				evothings.ble.stopScan(function(result) {
					defer.resolve(true);
				}, function(error) {
					defer.reject(error);
				});
				defer.resolve(true);

				return defer.promise;
			};

			// return the publicly accessible methods
			return {
				startScanning : startScanning,
				stopScanning : stopScanning
			};

} ]);

/* ble scanner for ios use-cases*/
bleScanners.factory('iosBleScanner', [
		'bleScannerChannel',
		'$filter',
		'$ionicPlatform',
		function(bleScannerChannel, $filter, $ionicPlatform) {

			//locationManager.Delegate()
			var delegate = undefined,
			//array of uuids of bcms
				iBeaconRanges = [
			//Estimote Beacon factory UUID.
			//{ "uuid"			: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', "registered" 	: false}
			];

			var getIBeaconRanges = function() {
				return iBeaconRanges;
			};

			var setDelegate = function(newDelegate) {
				delegate = newDelegate;
			};

			var getDelegate = function(newDelegate) {
				return delegate;
			};

			//add uuid to range
			var addIBeaconRange = function(uuid) {

				var isInList = false;
				//
				if (iBeaconUuidToHex(uuid) !== false) {

					for ( var i in iBeaconRanges) {
						if (iBeaconRanges[i].uuid == uuid) {
							isInList = true
						}
					}

					if (isInList === false) {
						iBeaconRanges.push({
							'uuid' : uuid,
							registered : false
						});
					}
				}
			}

			//start scanning for ble devices on IOS
			var startScanning = function() {
				$ionicPlatform.ready(function() {
					
					var systemVersion = ionic.Platform.version(),
						versionArray = systemVersion.toString().split('.');
					
					// Specify a shortcut for the location manager holding the iBeacon functions.
					window.locationManager = cordova.plugins.locationManager;

					// The delegate object holds the iBeacon callback functions
					// specified below.
					delegate = new locationManager.Delegate();

					// Called continuously when ranging beacons.
					delegate.didRangeBeaconsInRegion = function(pluginResult) {

						for ( var i in pluginResult.beacons) {
							// Insert beacon into table of found beacons.
							var beacon = pluginResult.beacons[i];
							//beacon.timeStamp = Date.now();
							//var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
							//beacon.
							bleScannerChannel.publishFoundDevice(beacon);

						}
					};

					// Set the delegate object to use.
					locationManager.setDelegate(delegate);

					
					if (parseInt(versionArray[0]) >= 8) {
						// Request permission from user to access location info.
						// This is needed on iOS 8.
						locationManager.requestAlwaysAuthorization();
					}

					// Start monitoring and ranging beacons.
					for ( var i in iBeaconRanges) {
						var beaconRegion = new locationManager.BeaconRegion(
								i + 1, iBeaconRanges[i].uuid);
						// Start ranging.
						locationManager.startRangingBeaconsInRegion(
								beaconRegion).fail(console.error).done();
						// Start monitoring.
						// (Not used in this example, included as a reference.)
						locationManager.startMonitoringForRegion(beaconRegion)
								.fail(console.error).done();

						iBeaconRanges[i].registered = true;
					}

					setBleScannerState(true);

				});
			};

			//start scanning for ble devices on IOS
			var stopScanning = function() {
				
				if (!getBleScannerState()) { return; }
				sitBleScanner.setBleScannerState(false);
				
				evothings.ble.stopScan(function(result) {
					//set bleScannerState to false
					sitBleScanner.setBleScannerState(false);
				}, function(error) {
					//do nothing
					//console.log('BLE stopScanning error: ' + error);
				});
			};

			// return the publicly accessible methods
			return {
				setDelegate : setDelegate,
				getDelegate : getDelegate,
				addIBeaconRange : addIBeaconRange,
				getIBeaconRanges : getIBeaconRanges,
				startScanning : startScanning,
				stopScanning : stopScanning
			};

		} ]);

bleScanners.constant( "sitBleScannerConfig", {
	
	_UNKNOWN_DEVICE_ 	: 'Unknown Device',
	
	_UNKNOWN_TYPE_ 		: 'Unknown Type',
	_I_BEACON_			: 'iBeacon',
	_ESTIMOTE_			: 'Estimote'
		
});


/* ble scanner for hybride scanning*/
bleScanners
		.factory(
				'sitBleScanner',
				[
						'$filter',
						'sitBleScannerConfig',
						'bleScannerChannel',
						'androidBleScanner',
						'iosBleScanner',
						
						function($filter, sitBleScannerConfig, bleScannerChannel, androidBleScanner, iosBleScanner) {
							
							//holds state of ble scanner
							var bleScannerState = false,
							//
								scannedDevicesList = [],
							//filter returns false if invalif iiud
								iBeaconUuidToHex = $filter('iBeaconUuidToHex'),
							//the toIsBrokenRawDevice filter
								toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');

							//returns bleScannerState
							var getBleScannerState = function() {
								return bleScannerState;
							};

							//set bleScannerState
							var setBleScannerState = function(newState) {
								//be shure that newState is boolean
								newState = (newState) ? true : false;

								//apply only if newState is different from current state
								if (newState != getBleScannerState()) {
									bleScannerState = newState;
									bleScannerChannel.publishBleScannerStateUpdated(bleScannerState);
								}
							};
							
							// returns the array of knownDevices
			               var getScannedDevices = function() {
			             	  return scannedDevicesList; 
			               };
			               
			               var getScannedDevice = function(cmsBeaconKey) {
			             	  var searchedDevice = scannedDevicesList[cmsBeaconKey];
			             	  if(searchedDevice) { return searchedDevice; }
			             	  return false; 
			               };

							// sends notification that a device has been found
							var foundDevice = function(rawDevice) { 
								var preparedDevice = prepareDeviceData(rawDevice);
								if(preparedDevice !== false) {
									scannedDevicesList[preparedDevice.bcmsBeaconKey] = preparedDevice;
									bleScannerChannel.publishFoundDevice(preparedDevice);
								}
							};

							var startScanning = function() {

								if (getBleScannerState()) {
									return;
								}

								//IOS
								if (ionic.Platform.isIOS()) {
									setBleScannerState(iosBleScanner.startScanning());
								}
								//Android
								else if (ionic.Platform.isAndroid()) {
									androidBleScanner
											.startScanning(foundDevice)
											.then(function(result) {
												setBleScannerState(true);
											}, function(error) {
												//@TODO should we react on this???
											});
								}
								//WindowsPhone
								else if (ionic.Platform.isWindowsPhone()) {
									//@TODO implement windows scanning
								}
							}

							var stopScanning = function() {

								if (!getBleScannerState()) {
									return;
								}

								//IOS
								if (ionic.Platform.isIOS()) {
									setBleScannerState(iosBleScanner
											.stopScanning());
								}
								//Android
								else if (ionic.Platform.isAndroid()) {
									androidBleScanner.stopScanning().then(
											function(result) {
												setBleScannerState(false);
											}, function(error) {
												//@TODO should we react on this?
											});
								}
								//WindowsPhone
								else if (ionic.Platform.isWindowsPhone()) {
									//@TODO
								}
							};
							
							//device should have following keya after prepare
							//major	
							//minor
							//rssiOneMeterDistance
							//rssi
							//iBeaconUUid
							//bcmsBeaconKey = uuid+'.'+major+'.'+minor;
							//lastScan
							//name
							var prepareDeviceData = function(device) {

								//IOS
								if (ionic.Platform.isIOS()) {
									//console.log('ios');
									return prepareIOSDeviceData(device);

								}
								//Android
								else if (ionic.Platform.isAndroid()) {
									//console.log('android');
									return prepareAndroidDeviceData(device);
								}
								//WindowsPhone
								else if (ionic.Platform.isWindowsPhone()) {
									//@TODO
									//console.log('windows');
								}
							};

							/*
							 * IOS section 
							 */
							var prepareIOSDeviceData = function(device) {
								
								var preparedDevice = angular.copy(device);
								 
								//This is the Major value
								preparedDevice.major = device.major;
								//This is the Minor value
								preparedDevice.minor = device.minor;

								preparedDevice.rssiOneMeterDistance = -56;

								//preparedDevice.rssi = device.rssi;

								preparedDevice.iBeaconUuid = device.uuid;

								device.bcmsBeaconKey = device.uuid + '.' + device.major + '.' + device.minor;
								//set lastScan to now
								preparedDevice.lastScan = Date.now();

								//no name is given -> set to default
								preparedDevice.name = sitBleScannerConfig._UNKNOWN_DEVICE_;

								return device;
							};
							
							var subGetAllBeaconsCallback =  function(beaconList)  {
								if (ionic.Platform.isIOS()) {
									angular.forEach(beaconList, function(beacon, key) {
										//iosBleScanner.addIBeaconRange(beacon.iBeaconUuid); 
									});	
								}
				           	};
				           	
							/*
							 * android section 
							 */
	
							//decode scanRecond of device and extract data
							//returns false or the device
							var prepareAndroidDeviceData = function(rawDevice) {
							
								var preparedDevice = angular.copy(rawDevice); 
								
								var hexToIBeaconUuid = $filter('hexToIBeaconUuid'), 
									base64DecToArr = $filter('base64DecToArr'),
									srArr = base64DecToArr(preparedDevice.scanRecord),
									str = Array.prototype.map.call(srArr,
										function(n) {
											var s = n.toString(16);
											if (s.length == 1) {
												s = '0' + s;
											}
											return s;
										}).join('');
								
								//This sequence says the first block of ad data is two octets long 
								preparedDevice.firstBlockLenght = str.substr(0, 2);
								//This says the advertising octet(s) following are Bluetooth flags 
								preparedDevice.bleFlags = str.substr(2, 2);
								//This is the binary value derived when certain of those flags are set. 
								preparedDevice.binValFlags = str.substr(4, 2);
								//This sequence says the second block of ad data is 26 octets long 
								preparedDevice.secondBlockLenght = str.substr(6, 2);
								//This identifies the group as manufacturer-specific data 
								preparedDevice.secondBlockIdentifier = str.substr(8, 2);
								//Bluetooth manufacturer ID (Apple has c400)
								preparedDevice.mfId = str.substr(10, 4);
								//Byte 0 of iBeacon advertisement indicator
								preparedDevice.b0 = str.substr(14, 2);
								//Byte 1 of iBeacon advertisement indicator
								preparedDevice.b1 = str.substr(16, 2);

								//check iBeacon advertisement indicator
								if (preparedDevice.b0 != '02' || preparedDevice.b1 != '15') {
									return false;
								}
							
								//This is the Universally Unique Identifier [UUID] in the Manufacture-Data (length = 32 -> 8-4-4-4-12)
								preparedDevice.mfUuid = str.substr(18, 32);
								//This is the Major value
								preparedDevice.major = parseInt(str.substr(50, 4), 16);
								//This is the Minor value
								preparedDevice.minor = parseInt(str.substr(54, 4), 16);
								//This is out beacon address in the cms if you want to see its content (UUID.Major.Minor) 
								//preparedDevice.address = preparedDevice.mfUuid + '.' + preparedDevice.major + '.' + preparedDevice.minor;

								//This is the RSSI value measured in 1m distancece from the iBeacon and is used for calibration the distance estimation. 
								//signet integer 8 bit
								preparedDevice.calibrationValue = parseInt(str.substr(58, 2), 16);
								//
								preparedDevice.rssiOneMeterDistance = preparedDevice.calibrationValue - 256;
								//This is the UUID as iBeacon-UUID format
								preparedDevice.iBeaconUuid = hexToIBeaconUuid(preparedDevice.mfUuid);
								 
								//preparedDevice.bcmsBeaconKey = preparedDevice.mfUuid + '.' + preparedDevice.major + '.' + preparedDevice.minor;
								preparedDevice.bcmsBeaconKey = preparedDevice.iBeaconUuid + '.' + preparedDevice.major + '.' + preparedDevice.minor;
								
								
								//set lastScan to now
								preparedDevice.lastScan = Date.now();
							
								//if no name is given set to default
								preparedDevice.name = (preparedDevice.name) ? preparedDevice.name : sitBleScannerConfig._UNKNOWN_DEVICE_;
								
								return preparedDevice;
							};
							
							
							var init = function() {
								//beaconAPIChannle.subGetAllBeaconsSuccess(scope, subGetAllBeaconsHandler);
							}

							init();

							// return the publicly accessible methods
							return {
								getScannedDevice : getScannedDevice,
								getScannedDevices : getScannedDevices,

								getBleScannerState  : getBleScannerState,
								startScanning 		: startScanning,
								stopScanning 		: stopScanning
							};


						} ]);





bleScanners
		.factory(
				'sitBleDummyScanner',
				[
						'$q',
						'$filter',
						'bleScannerChannel',
						'$interval',
						'$ionicPlatform',
						function($q, $filter, bleScannerChannel, $interval,
								$ionicPlatform) {

							
							/*
							 * scannerstate
							 **/
	
							//holds state of ble scanner
							var bleScannerState = false;

							//returns bleScannerState
							var getBleScannerState = function() {
								return bleScannerState;
							};

							//set bleScannerState
							var setBleScannerState = function(newState) {
								//be shure that newState is boolean
								newState = (newState) ? true : false;

								//apply only if newState is different from current state
								if (newState != getBleScannerState()) {
									bleScannerState = newState;
									bleScannerChannel
											.publishBleScannerStateUpdated(bleScannerState);
								}
							};


							/*
							 * platforms
							 * */
							var platformTypes = [ {
								name : 'IOS'
							}, {
								name : 'Android'
							}, {
								name : 'Windows'
							} ];
							var fakePlatform = false;

							var getFakePlatform = function() {
								return fakePlatform;
							};

							var setFakePlatform = function(platform) {
								for ( var i = 0 in platformTypes) {
									if (platformTypes[i].name == platform) {
										fakePlatform = platformTypes[i].name;
									}
								}
							};

							var getPlatformTypes = function() {
								return platformTypes;
							};

							/*
							 * helpers
							 * */
							var randBetween = function(min, max) {
								return Math.floor((min < 0) ? (min + Math
										.random()
										* (Math.abs(min) + max)) : (min + Math
										.random()
										* max));
							}

							var getRawAndroidData = function(rssiRange) {
								//@TODO implement default range for RSSI 
								var dev = rawAndroidScannData[randBetween(0,
										rawAndroidScannData.length - 1)];

								dev.rssi = randBetween(rssiRange.min,
										rssiRange.max)
								return dev;
							}

							var getRawIOSData = function(rssiRange,
									accuracyRange, proximity) {
								var dev = bcmsBeacons[randBetween(0,
										bcmsBeacons.length)];

								dev.rssi = randBetween(rssiRange.min,
										rssiRange.max);
								dev.accuracy = randBetween(accuracyRange.min,
										accuracyRange.max);

								(proximity >= 0 && proximity <= proximityValues.length) ? proximityValues[proximity]
										: proximityValues[randBetween(0,
												proximityValues.length)];

								return dev;
							}

							/*
							 * data
							 * */
							var proximityValues = [ "ProximityNear",
									"ProximityInermediate", "ProximityFar" ];

							var rawAndroidScannData = [
									{
										address : '0E:FA:EF:0C:22:39',
										scanRecord : 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
									},
									{
										address : '0E:FA:EF:0C:22:40',
										scanRecord : 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
									},
									{
										address : '0E:FA:EF:0C:22:41',
										scanRecord : 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
									} ];

							var rawIOSScannData = [ {
								uuid : "E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
								major : 7,
								minor : 1
							}, {
								uuid : "E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
								major : 7,
								minor : 2
							}, {
								uuid : "E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
								major : 7,
								minor : 3
							}, ];

							/*
							 * simulations
							 * */
							var approachRssiTo = function(device, toRssi, steps, stepDelay) {
								//defaults
								steps = (steps) ? (parseInt(steps) != NaN ? parseInt(steps)
										: 1)
										: 1;
								stepDelay = (stepDelay) ? (parseInt(stepDelay) != NaN ? parseInt(stepDelay)
										: 500)
										: 500;

								//debug
								//toRssi = 20; device.rssi = 91;
								//toRssi = 20; device.rssi = -91;
								//toRssi = -20; device.rssi = -91;
								//toRssi = -20; device.rssi = 91;

								var currentStep = 1, defer = $q.defer(), rssiDiff = Math
										.abs(device.rssi - toRssi), rssiStep = ~~(rssiDiff / steps)
										rssiStepMod = rssiDiff % steps,
										numSign = (toRssi - device.rssi >= 0) ? 1
												: -1;

								/*console.log('steps: ' + steps);
								console.log('from: ' + device.rssi);
								console.log('to: ' + toRssi);
								console.log('diff: ' + rssiDiff); 
								console.log('diffStep: ' + rssiStep); 
								console.log('rssiStepMod: ' + rssiStepMod); 
								console.log('numSign: ' + numSign);
								console.log('add*numSign: ' + rssiStep* numSign);*/

								$interval(function() {
									var add = (currentStep == steps) ? rssiStep
											+ rssiStepMod : rssiStep;

									device.rssi += add * numSign;
									bleScannerChannel.publishFoundDevice(device);

									if (currentStep == steps) {
										defer.resolve(device);
									}
									currentStep++;
								}, stepDelay, steps);

								return defer.promise;
							}

							approachRssiTo(getRawAndroidData({
								min : -50,
								max : -90
							}), -110, 10, 600).then(function() {

							}, function() {
							});

							return {
								getFakePlatform : getFakePlatform,
								setFakePlatform : setFakePlatform,
								getPlatformTypes : getPlatformTypes,

								rawAndroidScannData : rawAndroidScannData,
								rawIOSScannData : rawIOSScannData,

								approachRssiTo : approachRssiTo

							}

} ]);