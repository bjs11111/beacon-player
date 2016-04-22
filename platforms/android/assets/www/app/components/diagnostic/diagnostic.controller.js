;(function () {
  'use strict'

  angular.module('bp.ble-scanner.controller', ['prioloc.diagnostic', ])
          .controller('BleScannerController', BleScannerController);

  function BleScannerController($scope, DiagnosticService, DiagnosticChannel) {

    var vm = this;

    vm.isBluetoothEnabled;
    vm.openBluetoothSettings = DiagnosticService.switchToBluetoothSettings;

    init();

    ////////////////

    function init() {

      DiagnosticService.isBluetoothEnabled().then(function(data) {vm.isBluetoothEnabled = data;}, function(e) {console.log('bluetooth error', e);});
      DiagnosticChannel.subBluetoothEnabledChanged($scope, function(value) {
        vm.isBluetoothEnabled = value;
      });

    }

  }

})();
