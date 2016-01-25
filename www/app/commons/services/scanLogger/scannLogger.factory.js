;(function() {
  'use strict';

  angular.module('commons.services.scannLogger.factory', ['ngCordova', 'ngDrupal7Services-3_x.resources.node.resource', 'ngDrupal7Services-3_x.commons.helperService', 'commons.services.ble.bleChannels', 'commons.services.scannLogger.channel'])
    .factory('ScannLogger', ScannLogger);

  ScannLogger.$inject = ['$rootScope','$state','$q','$filter','$ionicPlatform','NodeResource','DrupalHelperService','bleScannerChannel','ScannLoggerChannel'];

  function ScannLogger(   $rootScope,  $state,  $q,  $filter,  $ionicPlatform,  NodeResource,  DrupalHelperService,  bleScannerChannel,  ScannLoggerChannel) {

    var configurations = {
        devideInformation		: true,
        gpsPosition 			: true,
        appState				: true
      },

      deviceInformation = undefined,
      isOffline 		  = 0,
      isBackground 	  = 0,

      scope = $rootScope.$new(),
      unsubFoundDevice,
    //ready, recording, finished
      serviceState = 'ready',
      title = '',
      measurementData = [],
      packagesCount = 0;

    var	ScannLoggerService = {
      setTitle : setTitle,
      getTitle : getTitle,
      getState : getState,
      start: start,
      stop : stop,
      save : save,
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
      });

      //online offline
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){ isOffline = 0;});
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){ isOffline = 1;});

      //open/background
      $ionicPlatform.on('pause', function(event){ isBackground = 1;});
      $ionicPlatform.on('resume', function(event){ isBackground = 0;});
      //$ionicPlatform.on('volumedownbutton', function(event){volumedownbutton = true;});
      //$ionicPlatform.on('batterylow', function(event){batterylow = true;});
      //$ionicPlatform.on('offline', function(event){offline = true;});
    };

    function setState(state) {

      var states = ['ready', 'recording', 'finished'];
      if(states.indexOf(state) !== -1 && serviceState !== state) {
        console.log('state updated');
        serviceState = state;
        ScannLoggerChannel.pubStateUpdated(serviceState);
      }
    }

    function setTitle(newTitle) {
      title = newTitle;
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

    function updatePackageCounter(){
      packagesCount++;
      ScannLoggerChannel.pubCountUpdated(packagesCount);
    }

    function start() {
      if(unsubFoundDevice === undefined) {
       // unsubFoundDevice = bleScannerChannel.onFoundBleDevice(scope, onFoundDeviceHandler);
        setState('recording');
      }
    }

    //every measurement focused on ble advertising packages
    //depending on config obj we add additional data to it
    function onFoundDeviceHandler(preparedDevice) {

      var blePackage = {};
      blePackage.ud = preparedDevice.iBeaconUuid;
      blePackage.ma = preparedDevice.major;
      blePackage.mi = preparedDevice.minor;
      blePackage.rs = preparedDevice.rssi;
      blePackage.la = preparedDevice.lastScan;


      updatePackageCounter();

      var newData =  {};

      //newData.deviceInformation = deviceInformation;
      //newData.isOffline = isOffline;
      newData.bg = isBackground;
      //newData.po = gpsPosition;
      newData.bl = blePackage;

      measurementData.push(newData);

      //console.log(JSON.stringify(measurementData));
    };

    function stop() {
      if(unsubFoundDevice) {
        unsubFoundDevice();
        unsubFoundDevice = undefined;
        setState('finished');
      }
    }

    function save() {
      //console.log('we try to save now');

      //@TODO devide array into chunks of 5000
      //2 for the wrapper obj
      //each row has max 105 chars
      //{"1441216420474":{"bg":0,"bl":{"ud":"E6C56DB5-DFFB-48D2-B088-40F5A81496EE","ma":0000,"mi":0000,"rs":-99}},}
      var promises = chunk(measurementData, 5000).map(function(arr) {
        var newMeasurement = {
          title 	: title,
          type 	: 'messdaten',
          body  	: DrupalHelperService.structureField({ value : [JSON.stringify(arr)], format: "plain_text"})
        };
        return NodeResource.create(newMeasurement);
      });

      ScannLoggerChannel.pubProgressStart(promises.length);

      allWithProgress(promises, function(progress) {
        if(progress == 1) {
          ScannLoggerChannel.pubProgressComplete(promises.length);
          measurementData = [];
          setState('ready');
        }
        else {
          ScannLoggerChannel.pubProgress(progress);
        }

      })
        .catch(function(error) {
          ScannLoggerChannel.pubProgressComplete(promises.length);
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
