;
(function () {
  'use strict';

  angular
    .module('prioloc.diagnostic.service', ['prioloc.diagnostic.channel', 'ngCordova'])
    .service('DiagnosticService', DiagnosticService);

  DiagnosticService.$inject = ['$q', '$interval', '$rootScope', 'DiagnosticChannel', '$cordovaNetwork'];
  function DiagnosticService($q, $interval, $rootScope, DiagnosticChannel, $cordovaNetwork) {

    var network,
      diagnosticPlugin = cordova.plugins.diagnostic;

    var diagnosticService = {
      startScanning: startScanning,
      stopScanning: stopScanning
  };

  init();
  return diagnosticService;

  ///////

  function init() {}

    //start scanning for ble devices on Android
    function startScanning(foundDeviceCallback) {
      var defer = $q.defer();

      $ionicPlatform.ready(function () {
        evothings.ble.startScan(function (rawDevice) {

          if (rawDevice.rssi != 0) {
            //we return a new clean reference of the rawDevice data
            foundDeviceCallback(rawDevice);
          }

        },
          function (error) {
          (error);
        });

        defer.resolve(true);
      });

      return defer.promise;

    };

}

})();
