;(function() {
  'use strict';

  angular.module('commons.services.scannLogger.factory', ['ngCordova', 'd7-services.resources','commons.resources.advertisingData', 'commons.services.ble.bleChannels', 'commons.services.scannLogger.channel', 'commons.services.gps.channel'])
    .factory('ScannLogger', ScannLogger);

  ScannLogger.$inject = ['$rootScope','$state','$q','$filter','$ionicPlatform','NodeResource','AdvertisingDataResource','DrupalHelperService','bleScannerChannel','ScannLoggerChannel','GpsServiceChannel'];

  function ScannLogger(   $rootScope,  $state,  $q,  $filter,  $ionicPlatform,  NodeResource,  AdvertisingDataResource,  DrupalHelperService,  bleScannerChannel,  ScannLoggerChannel,  GpsServiceChannel) {

    var configurations = {
        devideInformation		: true,
        gpsPosition 			: true,
        appState				: true
      },

      deviceInformation = undefined,
      isOffline 		  = 0,
      isBackground 	  = 0,

      scope = $rootScope.$new(),
      unsubFoundDevice = undefined,
      activeMeasurementNid = 0,
    //ready, recording, uploading, finished
      serviceState = 'ready',
      title = '',
      gpsPosition = [],
      measurementData = [],
      packagesCount = 0;

    var	ScannLoggerService = {
      setActiveMeasurement : setActiveMeasurement,
      getTitle : getTitle,
      getState : getState,
      start    : start,
      stop     : stop,
      save     : save,
      getCount : getCount
    };

    init();

    return ScannLoggerService;

    ////////////

    function init() {
      //updateDeviceInformation
      ionic.Platform.ready(function(){
        // will execute when device is ready, or immediately if the device is already ready.
        deviceInformation = ionic.Platform.device();

        //online offline
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){ isOffline = 0;});
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){ isOffline = 1;});

        //open/background
        $ionicPlatform.on('pause', function(event){ isBackground = 1;});
        $ionicPlatform.on('resume', function(event){ isBackground = 0;});
        //$ionicPlatform.on('volumedownbutton', function(event){volumedownbutton = true;});
        //$ionicPlatform.on('batterylow', function(event){batterylow = true;});
        //$ionicPlatform.on('offline', function(event){offline = true;});

        GpsServiceChannel.subPositionUpdated(scope, positionUpdatedHandler);
      });
    };

    function positionUpdatedHandler(position){
      gpsPosition = [position.coords.latitude, position.coords.longitude];
    }

    function setState(state) {
      var states = ['ready', 'recording', 'finished', 'uploading'];
      if(states.indexOf(state) !== -1 && serviceState !== state) {
        serviceState = state;
        ScannLoggerChannel.pubStateUpdated(serviceState);
      }
    }

    function setActiveMeasurement(newTitle) {

      title = newTitle;

      var defer = $q.defer(),
        newMeasurement = {
          title 	: newTitle,
          type 	  : 'messdaten',
          field_cordova_version : DrupalHelperService.structureField({value:deviceInformation.cordova}),
          field_model : DrupalHelperService.structureField({value:deviceInformation.model}),
          field_platforms : DrupalHelperService.structureField({value:deviceInformation.platform}),
          field_uuid : DrupalHelperService.structureField({value:deviceInformation.uuid}),
          field_version : DrupalHelperService.structureField({value:deviceInformation.version}),
          field_manufacturer : DrupalHelperService.structureField({value:deviceInformation.manufacturer}),
          field_is_virtual : DrupalHelperService.structureField({value:(deviceInformation.isVirtual)?1:0}),
          field_serial : DrupalHelperService.structureField({value:deviceInformation.serial}),
          field_pending  	: DrupalHelperService.structureField({value:0})
        };

      NodeResource
        .create(newMeasurement)
        .then(function(response){ activeMeasurementNid = response.data.nid; })
        .finally(function(){ defer.resolve();});

      return defer.promise;
    }

    function getTitle() {
      return title;
    }

    function getState() {
      return serviceState;
    }

    function getCount() {
      return packagesCount;
    }

    function updatePackageCounter(newCount){

      if(parseInt(newCount) === newCount){
        packagesCount = newCount;
      }
      else {
        packagesCount++;
      }

      ScannLoggerChannel.pubCountUpdated(packagesCount);
    }

    function start() {
      if(unsubFoundDevice === undefined) {
        unsubFoundDevice = bleScannerChannel.onFoundBleDevice(scope, onFoundDeviceHandler);
        setState('recording');
      }
    }

    //every measurement focused on ble advertising packages
    //depending on config obj we add additional data to it
    function onFoundDeviceHandler(preparedDevice) {

      var newData =  {};

      //Column name in Drupal
      //DB only
      //'apid'  //Primary key
      //'created'
      //'changed'
      //'nid' //Foreign key
      //----------------------------------------------------
      /*//##DeviceInformation
      //'device_cordova' => dc
      newData.dc = deviceInformation.cordova;
      //'device_model' => dm
      newData.dm = deviceInformation.model;
      //'device_platform' => dp
      newData.dp = deviceInformation.platform;
      //'device_uuid' => du
      newData.du = deviceInformation.uuid;
      //'device_version' => dv
      newData.dv = deviceInformation.version;
      //'device_manufacturer' => da
      newData.da = deviceInformation.manufacturer;
      //'device_isVirtual' => di
      newData.di = (deviceInformation.isVirtual)?1:0;
      //'device_serial' => ds
      newData.ds = deviceInformation.serial;
      //----------------------------------------------------*/
      //##App information
      //'isBackground' => ib
      newData.ib = isBackground;
      //'isOffline' => io
      newData.io = isOffline;
      //----------------------------------------------------
      //##GPS information
      //'geolat' => la
      newData.la = gpsPosition[0];
      //'geolng' => ln
      newData.ln = gpsPosition[1];
      //----------------------------------------------------
      //##BLE advertising package information
      //'scannTime' => st
      newData.st = parseInt(preparedDevice.lastScan);
      //'iBeaconUUID' => iu
      newData.iu = preparedDevice.iBeaconUuid;
      //'major' => ma
      newData.ma = preparedDevice.major;
      //'minor' => mi
      newData.mi = preparedDevice.minor;
      //'rssi' => ri
      newData.rs = preparedDevice.rssi;
      //'rssiCalibrated' => rc
      //newData.rs = preparedDevice.rssi;

      measurementData.push(newData);
      updatePackageCounter();
    };

    function stop() {
      if(unsubFoundDevice) {
        unsubFoundDevice();
        unsubFoundDevice = undefined;
        setState('finished');
      }
    }

    function save() {
      //each row has max 105 chars
      //{"1441216420474":{"bg":0,"bl":{"ud":"E6C56DB5-DFFB-48D2-B088-40F5A81496EE","ma":0000,"mi":0000,"rs":-99}},}

      //each row has max 105 chars
      //{"1441216420474":{"bg":0,"bl":{"ud":"E6C56DB5-DFFB-48D2-B088-40F5A81496EE","ma":0000,"mi":0000,"rs":-99}}, }
      setState('uploading');
      var promises = chunk(measurementData, 5000).map(function(arr) {
        var defer = $q.defer(),
          measurementData = {};

        measurementData.nid = activeMeasurementNid;
        measurementData.advertising_packages = arr;
        return AdvertisingDataResource.create(measurementData);
      });

      ScannLoggerChannel.pubProgressStart(promises.length);

      allWithProgress(promises, function(progress) {
          if(progress == 1) {
            ScannLoggerChannel.pubProgressComplete(promises.length);
            measurementData = [];
            updatePackageCounter(0);
            setState('ready');
          }
          else {
            ScannLoggerChannel.pubProgress(progress);
          }

      }).catch(function(error) {
          ScannLoggerChannel.pubProgressComplete(promises.length);
          setState('ready');
      });
    }

    //@TODO replace with angular.filter
    function chunk(arr, n) {
      return arr.reduce(function(p, cur, i) {
        (p[i/n|0] = p[i/n|0] || []).push(cur);
        return p;
      },[]);
    }

    //
    function allWithProgress(promises, progress) {
      var total = promises.length;
      var now = 0;
      promises.forEach(function(p) {
        p.then(function() {
          now++;
          progress(now / total);
        });
      })
      return $q.all(promises);
    }



  };



})();
