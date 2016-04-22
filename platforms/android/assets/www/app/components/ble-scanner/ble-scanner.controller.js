;(function () {
  'use strict'

  angular.module('bp.bleScanner.controller', ['prioloc.ble', 'prioloc.diagnostics', 'commons.ble-button.directive'])
         .controller('BleScannerController', BleScannerController);

  BleScannerController.$inject = ['$scope','BleScannerService', 'BleScannerChannel'];
  function BleScannerController($scope, BleScannerService, BleScannerChannel) {

    var vm = this;

    vm.isBluetoothEnabled;
    vm.openBluetoothSettings = BleScannerService.switchToBluetoothSettings;

    init();

    ////////////////

    function init() {
      BleScannerService.isBluetoothEnabled().then(function(data) {vm.isBluetoothEnabled = data;}, function(e) {console.log('bluetooth error', e);});
      BleScannerChannel.subBluetoothEnabledChanged($scope, function(value) {
        vm.isBluetoothEnabled = value;
      });
    }

  }

})();
