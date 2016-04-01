;(function () {
  'use strict';

  angular
    .module('prioloc.diagnostic.service', [])
    .service('DiagnosticService', DiagnosticService);

  DiagnosticService.$inject = [$rootScope];
  function DiagnosticService() {

    var network = {
      isOffline : false
    };


    var glueService = {
      //network
      getNetworkState : getNetworkState,

      //ble
      getBleState : getBleState
      //gps

      //nfc

      //camera
    };

    return glueService;

    ///////


    function subOfflineState () {
       // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        network.isOffline = false;
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        network.isOffline = true;
      });

    }

  }
})();
