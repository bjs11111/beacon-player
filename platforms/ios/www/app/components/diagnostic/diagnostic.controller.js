;(function () {
  'use strict'

  angular.module('bp.diagnostic.controller', ['prioloc.diagnostic'])
          .controller('DiagnosticController', DiagnosticController);

  DiagnosticController.$inject = ['$scope','DiagnosticService', 'DiagnosticChannel'];
  function DiagnosticController($scope, DiagnosticService, DiagnosticChannel) {

    var vm = this;

    vm.isOfflineState;

    vm.isLocationEnabled;
    vm.openLocationSettings = DiagnosticService.switchToLocationSettings;
    vm.isBluetoothEnabled;
    vm.openBluetoothSettings = DiagnosticService.switchToBluetoothSettings;
    vm.isCameraEnabled;


    vm.isWifiEnabled;
    vm.openWifiSettings = DiagnosticService.switchToWifiSettings;
    vm.openMobileDataSettings = DiagnosticService.switchToMobileDataSettings;



    init();

    ////////////////

    function init() {
      vm.isOfflineState = DiagnosticService.getIsOffline()
      DiagnosticChannel.subIsOfflineChanged($scope, function(value) {
        vm.isOfflineState = value;
      });

      DiagnosticService.isLocationEnabled().then(function(data) {vm.isLocationEnabled = data;}, function(e) {console.log('location error', e);});
      DiagnosticChannel.subLocationEnabledChanged($scope, function(value) {
        vm.isLocationEnabled = value;
      });

      DiagnosticService.isBluetoothEnabled().then(function(data) {vm.isBluetoothEnabled = data;}, function(e) {console.log('bluetooth error', e);});
      DiagnosticChannel.subBluetoothEnabledChanged($scope, function(value) {
        vm.isBluetoothEnabled = value;
      });

      DiagnosticService.isCameraEnabled().then(function(data) {vm.isCameraEnabled = data;}, function(e) {console.log('camera error', e);});
      DiagnosticChannel.subCameraEnabledChanged($scope, function(value) {
        vm.isCameraEnabled = value;
      });

      DiagnosticService.isWifiEnabled().then(function(data) {vm.isWifiEnabled = data;}, function(e) {console.log('wifi error', e);});
      DiagnosticChannel.subWifiEnabledChanged($scope, function(value) {
        vm.isWifiEnabled = value;
      });
    }

  }

})();
