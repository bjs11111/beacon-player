;(function() {
  'use strict';

  var sitBleScannerConfig = {
            _UNKNOWN_DEVICE_: 'Unknown Device',
            //@TODO remove if not needed
            _UNKNOWN_TYPE_: 'Unknown Type',
            _I_BEACON_: 'iBeacon',
            _ESTIMOTE_: 'Estimote'
  }

  angular.module('commons.services.ble.bleScanners.factory', ['commons.services.ble.bleChannels', 'commons.filter.bleFilters'])
         .constant("sitBleScannerConfig",sitBleScannerConfig)
         .factory('androidBleScanner', androidBleScanner)
         .factory('iosBleScanner', iosBleScanner)
         .factory('sitBleScanner', sitBleScanner);


    androidBleScanner.$inject = ['$q', '$ionicPlatform'];
    function androidBleScanner ($q, $ionicPlatform) {

      var androidBleScanner = {
        startScanning: startScanning,
        stopScanning: stopScanning
      };

      //return the publicly accessible methods
      return androidBleScanner;

      ////////////////////////////////////

      //start scanning for ble devices on Android
      function startScanning(foundDeviceCallback) {
        var defer = $q.defer();

        $ionicPlatform.ready(function () {
          evothings.ble.startScan(function (rawDevice) {

            if (rawDevice.rssi != 0) {
              //we return a new clean reference of the rawDevice data
              foundDeviceCallback(rawDevice);
            }

          }, function (error) {
            defer.reject(error);
          });

          defer.resolve(true);
        });

        return defer.promise;

      };

      //start scanning for ble devices
      function stopScanning() {
        var defer = $q.defer();

        evothings.ble.stopScan(function (result) {
          defer.resolve(true);
        }, function (error) {
          defer.reject(error);
        });
        defer.resolve(true);

        return defer.promise;
      };
    };



  /* ble scanner for ios use-cases*/
  iosBleScanner.$inject = ['$filter', '$q', '$ionicPlatform'];
  function iosBleScanner($filter, $q, $ionicPlatform) {

      //locationManager.Delegate()
      var delegate = undefined,
        iBeaconUuidToHex = $filter('iBeaconUuidToHex'),
      //array of uuids of bcms
        iBeaconRanges = [
          //Estimote Beacon factory UUID.
          //{ "uuid"			: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', "registered" 	: false}
        ];

    var iosBleScanner = {
      init : init,
      createBeaconRegion : createBeaconRegion,
      setDelegate: setDelegate,
      getDelegate: getDelegate,
      addIBeaconRange: addIBeaconRange,
      getIBeaconRanges: getIBeaconRanges,
      startScanning: startScanning,
      stopScanning: stopScanning,

    };

    return iosBleScanner

    /////////////////////

    function init(foundDeviceCallback) {

      $ionicPlatform.ready(function () {

        var systemVersion = ionic.Platform.version(),
        versionArray = systemVersion.toString().split('.');

        delegate = new cordova.plugins.locationManager.Delegate();

        // Called continuously when determine states of regions.
        delegate.didDetermineStateForRegion = function (pluginResult) {
          //console.log('didDetermineStateForRegion:' + JSON.stringify(pluginResult));
          //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
          var beacon = pluginResult.region;
          beacon.major = 0;
          beacon.minor = 0;
          beacon.rssi = 0;
          beacon.monitored = 1;
          beacon.state = pluginResult.state;

          foundDeviceCallback(beacon);
        };

        // Called once when monitoring ist started for monitoring beacons regions.
        delegate.didStartMonitoringForRegion = function (pluginResult) {
          //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        // Called continuously when ranging beacons.
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
          //console.log('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
          for (var i in pluginResult.beacons) {
            // Insert beacon into table of found beacons.
            var beacon = pluginResult.beacons[i];
            //beacon.timeStamp = Date.now();
            //var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
            //console.log(':-) !!');
            foundDeviceCallback(beacon);
          }

        };

        cordova.plugins.locationManager.setDelegate(delegate);

        if (parseInt(versionArray[0]) >= 8) {
          // required in iOS 8+
          //cordova.plugins.locationManager.requestWhenInUseAuthorization();
          cordova.plugins.locationManager.requestAlwaysAuthorization();
        }

      });
    }

    /**
     * Function that creates a BeaconRegion data transfer object.
     *
     * @throws Error if the BeaconRegion parameters are not valid.
     */
    function createBeaconRegion(identifier, uuid, major, minor) {
      var defer = $q.defer(),
        notifyEntryStateOnDisplay = true;

      $ionicPlatform.ready(function () {
        try{
          // throws an error if the parameters are not valid
          var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
          defer.resolve(beaconRegion);
        }
        catch(e) {
          defer.reject(e);
        }
      });

      return defer.promise;
    }


      function getIBeaconRanges() {
        return iBeaconRanges;
      };

      function setDelegate(newDelegate) {
        delegate = newDelegate;
      };

      function getDelegate(newDelegate) {
        return delegate;
      };

      //add uuid to range
      function addIBeaconRange(uuid) {

        var isInList = false;
        //
        if (iBeaconUuidToHex(uuid) !== false) {

          for (var i in iBeaconRanges) {
            if (iBeaconRanges[i].uuid == uuid) {
              isInList = true
            }
          }

          if (isInList === false) {
            iBeaconRanges.push({
              'uuid': uuid,
              registered: false
            });

          }
        }
      }

      //start scanning for ble devices on IOS
      //@TODO group createRegions promises with $q.all
      function startScanning() {

        var defer = $q.defer();

        $ionicPlatform.ready(function () {

          // Start monitoring and ranging beacons.
          for (var i in iBeaconRanges) {
            createBeaconRegion(i + 1, iBeaconRanges[i].uuid)
              .then(function(beaconRegion) {
                cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                  .fail(console.log('error while startRangingBeaconsInRegion: ' + iBeaconRanges[i].uuid, JSON.stringify(beaconRegion)))
                  .done();

                cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                  .fail(console.log('error while startRangingBeaconsInRegion: ' + iBeaconRanges[i].uuid, JSON.stringify(beaconRegion)))
                  .done();

                iBeaconRanges[i].registered = true;
              });
          }

          defer.resolve(true);

        });

        return defer.promise;
      };

      //start scanning for ble devices on IOS
      //@TODO group createRegions promises with $q.all
      function stopScanning() {
        var defer = $q.defer();

        for (var i in iBeaconRanges) {
          createBeaconRegion(i + 1, iBeaconRanges[i].uuid)
            .then(function(beaconRegion) {
              cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
                .fail(console.log('error stopRangingBeaconsInRegion'))
                .done();

              cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
                .fail(console.log('error while startRangingBeaconsInRegion: ' + iBeaconRanges[i].uuid, JSON.stringify(beaconRegion)))
                .done();

              iBeaconRanges[i].registered = false;
            });
        }
        defer.resolve(true);

        return defer.promise;


      };

    };

  /* ble scanner for hybrid scanning*/
      sitBleScanner.$inject = ['$rootScope', '$filter', 'sitBleScannerConfig', 'bleScannerChannel', 'androidBleScanner', 'iosBleScanner', 'beaconAPIChannel'];
      function sitBleScanner($rootScope, $filter, sitBleScannerConfig, bleScannerChannel, androidBleScanner, iosBleScanner, beaconAPIChannel) {

        var fakeScope = $rootScope.$new();

        //holds state of ble scanner
        var bleScannerState = false,
        //
          scannedDevicesList = {},
        //filter returns false if invalif iiud
          iBeaconUuidToHex = $filter('iBeaconUuidToHex'),
        //the toIsBrokenRawDevice filter
          toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');

        // return the publicly accessible methods
        var sitBleScanner = {
          getScannedDevice: getScannedDevice,
          getScannedDevices: getScannedDevices,

          getBleScannerState: getBleScannerState,
          startScanning: startScanning,
          stopScanning: stopScanning
        };

        init();

        return sitBleScanner;

        /////////////////////////////


        function init() {
          if (ionic.Platform.isIOS()) {
            beaconAPIChannel.subUuidAdded(fakeScope, _regiserUuidForIosBleScanner);
            iosBleScanner.init(foundDevice);
          }
        }

        //returns bleScannerState
        function getBleScannerState() {
          return bleScannerState;
        };

        //set bleScannerState
        function setBleScannerState(newState) {
          //be shure that newState is boolean
          newState = (newState) ? true : false;

          //apply only if newState is different from current state
          if (newState != getBleScannerState()) {
            bleScannerState = newState;
            bleScannerChannel.publishBleScannerStateUpdated(bleScannerState);
          }
        };

        // returns the array of knownDevices
        function getScannedDevices() {
          return scannedDevicesList;
        };

        function getScannedDevice(cmsBeaconKey) {
          var searchedDevice = scannedDevicesList[cmsBeaconKey];
          if (searchedDevice) {
            return searchedDevice;
          }
          return false;
        };

        // sends notification that a device has been found
        function foundDevice(rawDevice) {

          //we receive a clean (copied reference of the data)
          var preparedDevice = prepareDeviceData(rawDevice);

          if (preparedDevice !== false) {
            scannedDevicesList[preparedDevice.bcmsBeaconKey] = preparedDevice;

            //we return a new clean reference of the rawDevice data
            var cleanReferenceTopreparedDevice = angular.copy(preparedDevice);

            bleScannerChannel.publishFoundDevice(cleanReferenceTopreparedDevice);
          }
        };

        function startScanning() {

          if (getBleScannerState()) {
            return;
          }


          //IOS
          if (ionic.Platform.isIOS()) {

            iosBleScanner.startScanning().then(
              function (result) {

                setBleScannerState(true);
              },
              function (error) {
                //@TODO should we react on this???

              });

          }
          //Android
          else if (ionic.Platform.isAndroid()) {
            androidBleScanner
              .startScanning(foundDevice)
              .then(function (result) {
                setBleScannerState(true);
              }, function (error) {
                //@TODO should we react on this???
              });
          }
          //WindowsPhone
          else if (ionic.Platform.isWindowsPhone()) {
            //@TODO implement windows scanning
          }
        }

        function stopScanning() {

          if (!getBleScannerState()) {
            return;
          }

          //IOS
          if (ionic.Platform.isIOS()) {
            iosBleScanner.stopScanning().then(
              function (result) {
                setBleScannerState(false);
              },
              function (error) {
                //@TODO should we react on this?
              });
          }
          //Android
          else if (ionic.Platform.isAndroid()) {
            androidBleScanner.stopScanning().then(
              function (result) {
                setBleScannerState(false);
              },
              function (error) {
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
        function prepareDeviceData(device) {

          //IOS
          if (ionic.Platform.isIOS()) {

            return prepareIOSDeviceData(device);

          }
          //Android
          else if (ionic.Platform.isAndroid()) {

            return prepareAndroidDeviceData(device);
          }
          //WindowsPhone
          else if (ionic.Platform.isWindowsPhone()) {
            //@TODO

          }
        };

        /*
         * IOS section
         */
        function prepareIOSDeviceData(device) {

          var preparedDevice = angular.copy(device);

          //This is the Major value
          //preparedDevice.major = device.major;
          //This is the Minor value
          //preparedDevice.minor = device.minor;

          preparedDevice.rssiOneMeterDistance = -77;

          //preparedDevice.rssi = device.rssi;

          preparedDevice.iBeaconUuid = preparedDevice.uuid;

          preparedDevice.bcmsBeaconKey = preparedDevice.uuid + '.' + preparedDevice.major + '.' + preparedDevice.minor;
          //set lastScan to now
          preparedDevice.lastScan = Date.now();

          //no name is given -> set to default
          preparedDevice.name = sitBleScannerConfig._UNKNOWN_DEVICE_;

          return preparedDevice;
        };


        /*
         * android section
         */

        //decode scanRecond of device and extract data
        //returns false or the device
        function prepareAndroidDeviceData(rawDevice) {

          var preparedDevice = angular.copy(rawDevice);

          var hexToIBeaconUuid = $filter('hexToIBeaconUuid'),
            base64DecToArr = $filter('base64DecToArr'),
            srArr = base64DecToArr(preparedDevice.scanRecord),
            str = Array.prototype.map.call(srArr,
              function (n) {
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

        function _regiserUuidForIosBleScanner(uuid) {
          iosBleScanner.addIBeaconRange(uuid);
        };

      };

})();
