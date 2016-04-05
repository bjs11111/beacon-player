;(function () {
  'use strict'

  angular.module('bp.bleScanner.controller', ['prioloc.diagnostic', 'commons.ble-button.directive'])
         .controller('BLEScannerController', BLEScannerController);

  function BLEScannerController($scope, DiagnosticService, DiagnosticChannel) {

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
